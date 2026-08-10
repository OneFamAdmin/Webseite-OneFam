import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import LegalDoc, { type Rechtstext } from '@/components/LegalDoc';
import { pageMetadata, sprachAlternativen } from '@/lib/seo';
import { LOCALES, isLocale, legalPath } from '@/i18n/routing';

// Der Text dieser Seite stand bis zum 30.07.2026 als JSX hier drin — rund 775
// Woerter deutscher Fliesstext. Jetzt liegt er in messages/legal/<sprache>.json
// und diese Datei ist nur noch die Verdrahtung.
type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: 'legal.agb' });

  return pageMetadata({
    title: t('meta_titel'),
    description: t('meta_beschreibung'),
    path: legalPath(locale, 'agb'),
    locale,
    languages: sprachAlternativen((l) => legalPath(l, 'agb')),
  });
}

export default async function AgbPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'legal' });
  const doc = t.raw('agb') as Rechtstext;

  return <LegalDoc doc={doc} dsHref={legalPath(locale, 'datenschutz')} />;
}
