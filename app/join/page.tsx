import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';
import WaitlistForm from '@/components/WaitlistForm';
import Nav from '@/components/Nav';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Join the Fam — OneFam',
  description: 'Trag dich ein und sei von Anfang an dabei. Kein Kauf nötig, keine Kaufpflicht, jederzeit abmeldbar.',
  path: '/join',
});

const POINTS = [
  'Kein Kauf nötig – und keine Kaufpflicht',
  'Eine E-Mail, sonst nichts',
  'Du hörst von uns, wenn es etwas zu sagen gibt',
  'Jederzeit abmeldbar',
];

export default function JoinPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav />

      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center px-6 py-16 md:py-24">
        <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">Join the Fam</p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[0.02em] text-primary">
          Sei von Anfang an dabei.
        </h1>
        <p className="mt-5 font-body text-lg leading-[1.7] text-secondary">
          OneFam wächst gerade erst. Trag dich ein, und du erfährst als Erste:r, wenn wir den nächsten Schritt gehen –
          neue Stücke, die Fam, und irgendwann die gemeinsame Reise.
        </p>

        <div className="mt-10">
          <WaitlistForm />
        </div>

        <ul className="mt-8 space-y-2.5">
          {POINTS.map((t) => (
            <li key={t} className="flex items-center gap-3 font-body text-sm text-secondary">
              <Check size={16} strokeWidth={2} className="flex-none text-gold" />
              {t}
            </li>
          ))}
        </ul>

        <p className="mt-10 font-body text-sm text-faint">
          Du hast schon ein OneFam-Konto?{' '}
          <Link href="/login" className="text-gold underline-offset-4 hover:underline">
            Hier anmelden
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
