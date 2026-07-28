import type { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from '@/components/LoginForm';
import Nav from '@/components/Nav';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Anmelden — OneFam',
  description: 'Anmeldung für OneFam-Mitglieder – per Link, ohne Passwort.',
  path: '/login',
  noindex: true,
});

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav />

      <main className="mx-auto flex w-full max-w-[460px] flex-1 flex-col justify-center px-6 py-16 md:py-24">
        <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">Mitglieder</p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[0.02em] text-primary">
          Anmelden
        </h1>
        <p className="mt-5 font-body text-base leading-[1.7] text-secondary">
          Wir schicken dir einen Link per E-Mail. Kein Passwort nötig.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>

        <p className="mt-10 font-body text-sm text-faint">
          Noch nicht dabei?{' '}
          <Link href="/join" className="text-gold underline-offset-4 hover:underline">
            Auf die Warteliste
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
