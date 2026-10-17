'use server';

import { createClient } from '@/lib/supabase/server';

export type WaitlistState = { status: 'idle' | 'ok' | 'error'; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Warteliste: reines E-Mail-Signup, kein Login, keine Teilnahme, kein Magic-Link.
 *  Doppelte Adressen melden bewusst Erfolg — die Liste verrät nie, wer schon drin ist. */
export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  const email = String(formData.get('email') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim().slice(0, 40);

  if (!EMAIL_RE.test(email)) {
    return { status: 'error', message: 'Bitte gib eine gültige E-Mail-Adresse ein.' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('waitlist')
      .insert({ email: email.toLowerCase(), name: name || null, source: 'site' });

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
