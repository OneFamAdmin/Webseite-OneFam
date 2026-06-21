import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import JoinForm from '@/components/JoinForm';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Join the Fam — OneFam',
  description: 'Kostenlos dabei sein: einmal im Jahr, ohne Kauf, faire und öffentlich nachprüfbare Ziehung.',
};

const POINTS = [
  'Immer gratis – keine Kaufpflicht',
  'Eine Teilnahme pro Person und Jahr',
  'Teilnahme ab 21 Jahren',
  'Fair gezogen, öffentlich nachprüfbar',
];

export default function JoinPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav />

      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center px-6 py-16 md:py-24">
        <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">Join the Fam</p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[0.02em] text-primary">
          Sei dabei – kostenlos.
        </h1>
        <p className="mt-5 font-body text-lg leading-[1.7] text-secondary">
          Einmal im Jahr, für alle offen, ganz ohne Kauf. Trag dich ein und du bist Teil der nächsten Ziehung – fair und
          für jeden nachprüfbar.
        </p>

        <div className="mt-10">
          <JoinForm />
        </div>

        <ul className="mt-8 space-y-2.5">
          {POINTS.map((t) => (
            <li key={t} className="flex items-center gap-3 font-body text-sm text-secondary">
              <Check size={16} strokeWidth={2} className="flex-none text-gold" />
              {t}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
