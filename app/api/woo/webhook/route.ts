import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { findAuthUserByEmail } from '@/lib/supabase/users';
import { grantWooBuyer, recomputeWooBuyer } from '@/lib/woo/buyers';
import { verifyWooHmac, istPing } from '@/lib/woo/verify';
import { creditPoolForOrder, reversePoolForOrder } from '@/lib/pool/service';
import type { LineItem } from '@/lib/pool/accounting';

// Node-Laufzeit: `node:crypto` für den HMAC und der Service-Rollen-Client.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AdminClient = ReturnType<typeof createAdminClient>;

// ── Aufbau der WooCommerce-Nutzdaten (nur die Felder, die wir lesen) ─────────
type WooLineItem = {
  product_id?: number | string | null;
  variation_id?: number | string | null;
  sku?: string | null;
  quantity?: number | string | null;
  price?: number | string | null; // Stückpreis
  total?: string | null; // Zeilensumme nach Rabatt
};
type WooOrder = {
  id?: number | string;
  status?: string | null;
  currency?: string | null;
  total?: string | null;
  customer_id?: number | string | null;
  billing?: { email?: string | null } | null;
  line_items?: WooLineItem[] | null;
};

const lower = (s: string | null | undefined) => (s ?? '').trim().toLowerCase();
const str = (v: unknown) => (v === null || v === undefined ? '' : String(v));

// Welche Bestellzustände gelten als bezahlt, welche als rückabgewickelt?
//
// Das ist der grösste Unterschied zu Shopify. Dort gab es eigene Ereignisse
// (`orders/paid`, `refunds/create`, `orders/cancelled`), die schon im Namen
// sagten, was passiert ist. WooCommerce kennt nur `order.created` und
// `order.updated` — WAS sich geändert hat, steht ausschliesslich im Feld
// `status`. Die Bedeutung muss also hier hergestellt werden.
//
// 'processing' und 'completed' heissen: Geld ist da. 'on-hold' bewusst NICHT —
// das ist die Vorkasse-Warteschleife, da ist noch nichts bezahlt.
const BEZAHLT = new Set(['processing', 'completed']);
const RUECKABGEWICKELT = new Set(['refunded', 'cancelled', 'failed']);

/**
 * WooCommerce-Webhook — automatische Käufer-Erkennung und Pool-Gutschrift.
 *
 * Sicherheit:  HMAC-SHA256 über den Rohtext gegen `X-WC-Webhook-Signature` → 401.
 * Doppelläufer: jedes Ereignis wird einmal in `shop_events` vermerkt.
 *
 * Antwortet mit 200 bei Erfolg (und bei bereits Erledigtem oder ignorierten
 * Themen), damit WooCommerce nicht endlos wiederholt; 401 bei falscher Signatur;
 * 500 nur bei einem echten Verarbeitungsfehler — dann SOLL wiederholt werden.
 */
export async function POST(request: Request) {
  // Rohtext ist für den HMAC zwingend — VOR dem Parsen als Text lesen.
  const rawBody = await request.text();
  const topic = request.headers.get('x-wc-webhook-topic');

  // Der Einrichtungs-Ping wird VOR der Prüfung auf das Geheimnis beantwortet,
  // und diese Reihenfolge ist Absicht.
  //
  // Beim Einrichten entsteht sonst ein Henne-Ei-Problem: WooCommerce pingt die
  // Adresse in dem Moment, in dem der Webhook angelegt wird — also bevor
  // irgendjemand das Geheimnis auf beiden Seiten hinterlegen konnte. Antwortet
  // der Endpunkt darauf mit 500, wird der Webhook nie aktiv, und man sucht den
  // Fehler an der falschen Stelle.
  //
  // Ungefährlich ist das, weil ein Ping nur `webhook_id=<zahl>` enthält: keine
  // Nutzdaten, kein Datenbankzugriff, nichts, was sich verändern liesse.
  if (istPing(rawBody, topic)) {
    return NextResponse.json({ ok: true, ping: true });
  }

  const secret = process.env.WOO_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[woo] WOO_WEBHOOK_SECRET ist nicht gesetzt — Webhook abgewiesen');
    return new NextResponse('Webhook not configured', { status: 500 });
  }

  if (!verifyWooHmac(rawBody, request.headers.get('x-wc-webhook-signature'), secret)) {
    return new NextResponse('Invalid HMAC signature', { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new NextResponse('Invalid JSON', { status: 400 });
  }

  // Nur Bestellungen interessieren uns. Alles andere wird bestätigt und verworfen.
  if (!topic || !topic.startsWith('order.')) {
    return NextResponse.json({ ok: true, ignored: topic ?? 'ohne Thema' });
  }

  const order = payload as WooOrder;
  const orderId = str(order.id);
  const status = lower(order.status);
  if (!orderId || !status) {
    return NextResponse.json({ ok: true, ignored: 'ohne Bestellnummer oder Status' });
  }

  // Schlüssel gegen Doppelläufer — und hier steckt die zweite Falle.
  //
  // Bei Shopify genügte "<thema>:<id>", weil jedes Ereignis genau einmal etwas
  // bedeutete. `order.updated` feuert dagegen bei JEDER Änderung derselben
  // Bestellung: pending → processing → completed → refunded. Mit einem Schlüssel
  // ohne Status würde nur die ERSTE dieser Meldungen verarbeitet — eine spätere
  // Retoure käme nie an, still und ohne Fehlermeldung.
  //
  // Deshalb gehört der Status in den Schlüssel: jeder Zustandsübergang wird genau
  // einmal verarbeitet, Wiederholungen derselben Meldung bleiben wirkungslos.
  const eventId = `order:${orderId}:${status}`;

  const admin = createAdminClient();

  const { data: seen, error: seenErr } = await admin
    .from('shop_events')
    .select('event_id')
    .eq('event_id', eventId)
    .maybeSingle();
  if (seenErr) {
    console.error('[woo] Abfrage von shop_events fehlgeschlagen', seenErr);
    return new NextResponse('DB error', { status: 500 });
  }
  if (seen) return NextResponse.json({ ok: true, duplicate: eventId });

  try {
    if (BEZAHLT.has(status)) {
      await handleOrderPaid(admin, order);
    } else if (RUECKABGEWICKELT.has(status)) {
      await markReversed(admin, orderId, status === 'refunded' ? 'refunded' : 'cancelled');
    } else {
      // 'pending', 'on-hold', 'draft' … — nichts zu tun, aber bestätigen.
      return NextResponse.json({ ok: true, ignored: `Status ${status}` });
    }
  } catch (err) {
    // Ereignis NICHT vermerken → WooCommerce wiederholt es später.
    console.error(`[woo] Verarbeitung fehlgeschlagen für ${eventId}`, err);
    return new NextResponse('Processing error', { status: 500 });
  }

  // Erst nach erfolgreicher Arbeit als erledigt vermerken.
  const { error: recErr } = await admin.from('shop_events').insert({ event_id: eventId, topic });
  if (recErr && recErr.code !== '23505') {
    console.error('[woo] shop_event konnte nicht vermerkt werden', recErr);
  }

  return NextResponse.json({ ok: true, processed: eventId });
}

// ── bezahlt → Käufer freischalten (oder parken) und Bestellung erfassen ──────
async function handleOrderPaid(admin: AdminClient, order: WooOrder) {
  const orderId = str(order.id);
  const email = lower(order.billing?.email);
  // customer_id ist bei Gastbestellungen 0 — das ist keine Kundennummer, sondern
  // „kein Konto". Als null speichern, sonst zeigen alle Gäste auf denselben Wert.
  const kundenId = str(order.customer_id);
  const shopCustomerId = kundenId && kundenId !== '0' ? kundenId : null;
  const gross = order.total != null ? Number(order.total) : null;
  const currency = (order.currency ?? '').toUpperCase() || null;

  const user = email ? await findAuthUserByEmail(admin, email) : null;

  const { error: pErr } = await admin.from('purchases').upsert(
    {
      order_id: orderId,
      user_id: user?.id ?? null,
      email: email || null,
      shop_customer_id: shopCustomerId,
      gross_chf: Number.isFinite(gross) ? gross : null,
      currency,
      status: 'paid',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'order_id' },
  );
  if (pErr) throw new Error(pErr.message);

  if (user) {
    await grantWooBuyer(admin, user.id, orderId, shopCustomerId);
  } else if (email) {
    const { error: pbErr } = await admin
      .from('pending_buyers')
      .upsert(
        { email, order_id: orderId, shop_customer_id: shopCustomerId },
        { onConflict: 'email', ignoreDuplicates: true }, // die ERSTE Bestellung behalten
      );
    if (pbErr) throw new Error(pbErr.message);
  }

  // Pool-Gutschrift — und hier die dritte Falle: der Shop verkauft in CHF UND in
  // EUR (nachgemessen am 01.09.2026), die Pool-Rechnung kennt aber nur eine
  // Währung. Eine EUR-Bestellung als Franken zu verbuchen wäre schlicht falsch.
  //
  // Bis die Umrechnung steht (Schritt 3), wird deshalb nur in CHF gutgeschrieben.
  // Die Bestellung ist oben trotzdem vollständig mit Betrag UND Währung erfasst —
  // die übersprungenen Gutschriften lassen sich später aus `purchases`
  // nachbuchen, es geht nichts verloren.
  if (currency && currency !== 'CHF') {
    console.warn(`[woo] Pool-Gutschrift für ${orderId} zurückgestellt: Währung ${currency}, Umrechnung fehlt`);
    return;
  }

  const items: LineItem[] = (order.line_items ?? []).map((li) => {
    const menge = Number(li.quantity ?? 1) || 1;
    const stueck = li.price != null ? Number(li.price) : Number(li.total ?? 0) / menge;
    return {
      // Der Shop führt bei KEINEM Produkt eine SKU (42 von 42 leer, geprüft am
      // 01.09.2026) — auch die Bestellposition liefert keine. Als Kostenschlüssel
      // bleibt allein die product_id. Sie wird hier in das SKU-Feld gelegt, damit
      // `product_costs` in Schritt 2 nur befüllt statt umgebaut werden muss.
      sku: li.sku || (li.product_id != null ? str(li.product_id) : null),
      quantity: menge,
      unitPrice: Number.isFinite(stueck) ? stueck : 0,
    };
  });

  await creditPoolForOrder(admin, {
    orderId,
    year: new Date().getFullYear(),
    gross: Number.isFinite(gross) ? (gross as number) : 0,
    items,
  });
}

/**
 * Gemeinsamer Weg für Retoure und Storno: Zustand der Bestellung umsetzen, die
 * Pool-Gutschrift zurückbuchen, dann den Käufer neu bewerten. Hatte der Käufer
 * nie ein Konto, wird auch der geparkte Eintrag entfernt — sonst würde er sich
 * bei der nächsten Anmeldung eine Bestellung anrechnen lassen, die es nicht
 * mehr gibt.
 */
async function markReversed(admin: AdminClient, orderId: string, status: 'refunded' | 'cancelled') {
  const { data: purchase, error: selErr } = await admin
    .from('purchases')
    .select('user_id, email')
    .eq('order_id', orderId)
    .maybeSingle();
  if (selErr) throw new Error(selErr.message);

  // Unbekannte Bestellung (z. B. storniert, bevor sie je bezahlt war) → nichts zu tun.
  if (!purchase) return;

  const { error: updErr } = await admin
    .from('purchases')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('order_id', orderId);
  if (updErr) throw new Error(updErr.message);

  await reversePoolForOrder(admin, { orderId, year: new Date().getFullYear() });

  if (purchase.user_id) {
    await recomputeWooBuyer(admin, purchase.user_id);
  } else if (purchase.email) {
    const { error: pbErr } = await admin
      .from('pending_buyers')
      .delete()
      .eq('email', purchase.email)
      .eq('order_id', orderId);
    if (pbErr) throw new Error(pbErr.message);
  }
}
