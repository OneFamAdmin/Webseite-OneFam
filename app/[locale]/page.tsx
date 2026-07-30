import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import HomePage from '@/components/HomePage';
import { homeMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE, LOCALES, isLocale } from '@/i18n/routing';

// Die Startseite in den Sprachen MIT Präfix: /de, /fr, /es.
//
// Achtung, das ist der Punkt, an dem man sich hier in den Fuss schiessen kann:
// [locale] ist ein dynamisches Segment auf oberster Ebene und würde ohne die
// Prüfung unten JEDE unbekannte Adresse mit einem Segment schlucken —
// /irgendwas würde dann die Startseite ausliefern statt 404. Statische Routen
// wie /join oder /agb haben in Next.js Vorrang und sind nicht betroffen.
//
// Deshalb: alles, was keine bekannte Sprache ist, wird zu 404. Und die
// Standardsprache gehört hier ebenfalls nicht hin — /en gibt es nicht, Englisch
// liegt auf /. Zwei Adressen für dieselbe Sprache wären genau die Doppelung,
// die wir im Shop gerade aufgeräumt haben.
type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.filter((l) => l !== DEFAULT_LOCALE).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale) || locale === DEFAULT_LOCALE) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: 'seo' });

  return homeMetadata({
    locale,
    title: t('title'),
    description: t('description'),
  });
}

export default async function LocalisedHome({ params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale) || locale === DEFAULT_LOCALE) {
    notFound();
  }

  return <HomePage />;
}
