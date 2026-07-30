import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import HomePage from '@/components/HomePage';
import { homeMetadata } from '@/lib/seo';
import { LOCALES, isLocale } from '@/i18n/routing';

// Die Startseite in allen vier Sprachen. Englisch liegt auf / (die Middleware
// schreibt das intern auf /en um), Deutsch auf /de, Franzoesisch auf /fr,
// Spanisch auf /es.
//
// Die isLocale-Pruefung bleibt drin, obwohl die Middleware nur bekannte
// Sprachen durchlaesst: Sie ist die zweite Sicherung, falls jemand die
// Middleware-Konfiguration aendert. Ohne sie wuerde /irgendwas die Startseite
// ausliefern statt 404.
type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: 'seo' });

  return homeMetadata({
    locale,
    title: t('title'),
    description: t('description'),
  });
}

export default async function LocalisedHome({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);

  return <HomePage />;
}
