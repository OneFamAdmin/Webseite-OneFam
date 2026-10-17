'use server';

import { createClient } from '@/lib/supabase/server';
import { pruefeLandwunsch } from '@/lib/laenderwunsch';

export type WaitlistState = { status: 'idle' | 'ok' | 'error'; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Warteliste: reines E-Mail-Signup, kein Login, keine Teilnahme, kein Magic-Link.
 *  Doppelte Adressen melden bewusst Erfolg — die Liste verrät nie, wer schon drin ist. */
export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const email = String(formData.get('email') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim().slice(0, 40);
  const landwunsch = pruefeLandwunsch(formData.get('land'));

  if (!EMAIL_RE.test(email)) {
    return { status: 'error', message: 'Bitte gib eine gültige E-Mail-Adresse ein.' };
  }

  // country_wish nur mitschicken, wenn jemand ein Land gewählt hat. So bleibt die
  // Warteliste für alle ohne Wunsch auch dann heil, wenn der Code vor Migration
  // 0016 live geht (17.10.2026) — eine unbekannte Spalte liesse sonst JEDE
  // Eintragung scheitern.
  //
  // Steht die Adresse schon auf der Liste, geht ein neu gewählter Wunsch verloren
  // (23505 unten). Nachtragen ginge nur mit einer Update-Policy für anon, und die
  // würde jedem erlauben, fremde Einträge zu ändern.
  const zeile = {
    email: email.toLowerCase(),
    name: name || null,
    source: 'site',
    ...(landwunsch ? { country_wish: landwunsch } : {}),
  };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('waitlist').insert(zeile);

    // 23505 = unique violation → steht schon auf der Liste, für den Besucher dasselbe Ergebnis
    if (error && error.code !== '23505') {
      console.error('[waitlist] insert failed', error);
      return { status: 'error', message: 'Hoppla – das hat nicht geklappt. Versuch es gleich nochmal.' };
    }
  } catch (e) {
    console.error('[waitlist] insert threw', e);
    return { status: 'error', message: 'Hoppla – das hat nicht geklappt. Versuch es gleich nochmal.' };
  }

  return { status: 'ok', message: email };
}
