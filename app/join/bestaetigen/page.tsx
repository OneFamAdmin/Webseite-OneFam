import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { after } from 'next/server';
import { Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { sendWelcomeEmail } from '@/lib/email/send';

export const metadata = { title: 'Du bist dabei — OneFam' };

function clampGroup(n: number) {
  return Math.max(1, Math.min(5, Math.floor(Number.isFinite(n) ? n : 1)));
}

export default async function BestaetigenPage({
  searchParams,
}: {
  searchParams: Promise<{ g?: string; n?: string }>;
}) {
  const { g, n } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // not logged in → send back to the join page
  if (!user) redirect('/join');

  const year = new Date().getFullYear();
  const wantedGroup = clampGroup(Number(g ?? '1'));

  // already entered this year?
  const { data: existing } = await supabase
    .from('entries')
    .select('group_size')
    .eq('user_id', user.id)
    .eq('year', year)
    .maybeSingle();

  let groupSize = existing?.group_size ?? wantedGroup;
  let firstTime = !existing;

  if (!existing) {
    const { error } = await supabase
      .from('entries')
      .insert({ user_id: user.id, year, group_size: wantedGroup });
    if (error) {
      // unique violation (parallel insert) → already in; re-read the size
      firstTime = false;
      const { data: again } = await supabase
        .from('entries')
        .select('group_size')
        .eq('user_id', user.id)
        .eq('year', year)
        .maybeSingle();
      groupSize = again?.group_size ?? wantedGroup;
    }
  }

  // optional: save / update the public display name for this user
  const displayName = (n ?? '').trim().slice(0, 30);
  if (displayName) {
    await supabase
      .from('profiles')
      .upsert({ user_id: user.id, display_name: displayName, updated_at: new Date().toISOString() });
  }

  // welcome e-mail on first entry — runs after the response, never blocks/breaks signup
  if (firstTime && user.email) {
    after(async () => {
      try {
        await sendWelcomeEmail({ to: user.email!, name: displayName || null, groupSize, year });
      } catch (e) {
        console.error('[email] welcome failed', e);
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" aria-label="OneFam — Home" className="flex items-center gap-2.5">
            <img src="/assets/logo-face-gradient.svg" alt="" aria-hidden="true" className="h-7 w-7" />
            <Image src="/assets/logo-white.png" alt="OneFam" width={216} height={75} priority className="h-6 w-auto" />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col items-center justify-center px-6 py-16 text-center md:py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40">
          <Check size={30} strokeWidth={2} className="text-gold" />
        </div>
        <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[0.02em] text-primary">
          {firstTime ? 'Du bist dabei!' : 'Du bist schon dabei.'}
        </h1>
        <p className="mt-4 font-body text-lg leading-[1.7] text-secondary">
          {firstTime
            ? `Deine Teilnahme für ${year} ist bestätigt.`
            : `Deine Teilnahme für ${year} war bereits registriert.`}{' '}
          {groupSize > 1
            ? `Gebucht für dich und ${groupSize - 1} weitere (${groupSize} Personen).`
            : 'Gebucht für dich (Solo).'}
        </p>
        {displayName && (
          <p className="mt-4 font-body text-sm text-secondary">
            Dein Name in der Ziehung: <span className="font-medium text-gold">{displayName}</span>
          </p>
        )}
        <p className="mt-3 font-body text-sm text-faint">
          Eingeloggt als {user.email}. Die Ziehung läuft fair und öffentlich nachprüfbar.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center justify-center rounded-[4px] bg-gold px-7 py-3.5 font-body font-medium text-bg transition-colors duration-[180ms] hover:bg-gold-hover"
        >
          Zur Startseite
        </Link>
      </main>
    </div>
  );
}
