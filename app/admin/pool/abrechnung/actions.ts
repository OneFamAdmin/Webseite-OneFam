'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Der Admin-Zugang ist eine E-Mail-Pruefung in JEDER Datei unter app/admin/ —
// es gibt keine Middleware, die das uebernimmt (siehe CLAUDE.md). Bewusst hier
// noch einmal, statt aus ../actions.ts importiert: eine Datei, die den Dienst-
// Schluessel benutzt, soll ihre eigene Schranke sichtbar tragen.
async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) throw new Error('Nicht autorisiert.');
  return user;
}

const KATEGORIEN = ['lohn', 'hosting', 'werbung', 'software', 'sonstiges'] as const;
type Kategorie = (typeof KATEGORIEN)[number];

/** "12,50" / "12.50" → 12.5; leer → null. Wie in ../actions.ts. */
function parseNum(raw: FormDataEntryValue | null): number | null {
  const s = String(raw ?? '')
    .trim()
    .replace(',', '.');
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) throw new Error('Bitte eine gültige Zahl eingeben.');
  return n;
}

function revalidate() {
  revalidatePath('/admin/pool/abrechnung');
  revalidatePath('/admin/pool');
}

/**
 * Eine Fixkosten- oder Lohnzeile erfassen.
 *
 * Schreibt NICHT ins `pool_ledger`. Overhead belastet den Pool nie — die
 * Begruendung steht im Kopf von Migration 0014 und wird von
 * lib/pool/abrechnung.test.ts bewacht.
 */
export async function addOverhead(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();

  const year = Number(formData.get('year'));
  const month = Number(formData.get('month'));
  const category = String(formData.get('category') ?? '') as Kategorie;
  const label = String(formData.get('label') ?? '').trim();
  const amount = parseNum(formData.get('amount'));
  const note = String(formData.get('note') ?? '').trim() || null;

  if (!Number.isInteger(year) || year < 2020 || year > 2100) throw new Error('Ungültiges Jahr.');
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new Error('Ungültiger Monat.');
  if (!KATEGORIEN.includes(category)) throw new Error('Unbekannte Kategorie.');
  if (!label) throw new Error('Bitte eine Bezeichnung angeben.');
  // Positiv erzwingen: die Tabelle ist eine KOSTEN-Tabelle, das Minus entsteht
  // erst in der Gegenüberstellung. Ein negativer Betrag wäre eine Einnahme.
  if (amount == null || amount <= 0) throw new Error('Bitte einen Betrag grösser als 0 angeben.');

  // Fremdwährung: den Originalbetrag MIT Währung festhalten und daneben die
  // Franken. Ohne das liesse sich später nicht unterscheiden, ob ein Abo teurer
  // geworden ist oder nur der Kurs gelaufen ist — und beim Higgsfield-Abo, das
  // am Dollar hängt, passiert genau das jeden Monat. Siehe Migration 0015.
  const waehrung = String(formData.get('currency') ?? 'CHF').toUpperCase();
  let amountChf = amount;
  let amountOriginal: number | null = null;
  let currency: string | null = null;

  if (waehrung !== 'CHF') {
    const { data: cfg } = await admin.from('cost_config').select('fx_eur_chf').eq('year', year).maybeSingle();
    const kurs = cfg?.fx_eur_chf != null ? Number(cfg.fx_eur_chf) : null;
    // Nicht raten: ohne Kurs wäre ein Euro-Betrag als Franken rund 8 % zu hoch.
    if (!kurs || !Number.isFinite(kurs)) {
      throw new Error(`Kein Wechselkurs für ${year} hinterlegt (cost_config.fx_eur_chf) — Betrag in CHF eintragen.`);
    }
    amountChf = Math.round(amount * kurs * 100) / 100;
    amountOriginal = amount;
    currency = waehrung;
  }

  const { error } = await admin.from('overhead_costs').insert({
    year,
    month,
    category,
    label,
    amount_chf: amountChf,
    amount_original: amountOriginal,
    currency,
    note,
  });
  if (error) throw new Error(error.message);
  revalidate();
}

/** Eine Kostenzeile wieder entfernen (Tippfehler, doppelt erfasst). */
export async function deleteOverhead(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();
  const id = String(formData.get('id') ?? '').trim();
  if (!id) throw new Error('Keine Zeile angegeben.');
  const { error } = await admin.from('overhead_costs').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidate();
}
