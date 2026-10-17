import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import WaitlistForm from '@/components/WaitlistForm';
import Nav from '@/components/Nav';
import { pageMetadata, sprachAlternativen } from '@/lib/seo';
import { LOCALES, isLocale, joinPath } from '@/i18n/routing';

// Bis zum 09.08.2026 lag diese Seite als app/join/page.tsx ausserhalb der
// Sprachstruktur. Sie war nur auf Deutsch zu haben, /fr/join und /es/join
// antworteten mit 404, und die Spracherkennung liess sie bewusst aus (Liste
// OHNE_SPRACHE in middleware.ts) — es gab ja nichts zu wechseln.
//
// Jetzt liegt sie unter app/[locale]/ und ihre Texte stehen in
// messages/<sprache>.json unter "join". Das Warteliste-Formular holt seine
// eigenen Texte aus "waitlist".
//
// /join/bestaetigen bleibt bewusst dort, wo es ist, und bleibt deutsch: Der
// Link darauf steht in bereits verschickten Bestätigungsmails.
type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: 'join' });

  return pageMetadata({
    title: t('meta_titel'),
    description: t('meta_beschreibung'),
    path: joinPath(locale),
    locale,
    languages: sprachAlternativen(joinPath),
  });
}

export default async function JoinPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'join' });
  const punkte = t.raw('punkte') as string[];

  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav />

      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center px-6 py-16 md:py-24">
        <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">{t('kicker')}</p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[0.02em] text-primary">
          {t('titel')}
        </h1>
        <p className="mt-5 font-body text-lg leading-[1.7] text-secondary">{t('text')}</p>

        <div className="mt-10">
          <WaitlistForm />
        </div>

        <ul className="mt-8 space-y-2.5">
          {punkte.map((punkt) => (
            <li key={punkt} className="flex items-center gap-3 font-body text-sm text-secondary">
              <Check size={16} strokeWidth={2} className="flex-none text-gold" />
              {punkt}
            </li>
          ))}
        </ul>

        <p className="mt-10 font-body text-sm text-faint">
          {t('konto_frage')}{' '}
          <Link href="/login" className="text-gold underline-offset-4 hover:underline">
            {t('konto_link')}
          </Link>
        </p>
      </main>
    </div>
  );
}
