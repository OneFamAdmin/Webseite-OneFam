import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import LegalDoc, { type Rechtstext } from '@/components/LegalDoc';
import { pageMetadata } from '@/lib/seo';
import { LOCALES, isLocale, legalPath } from '@/i18n/routing';

// Wie bei den AGB: Der Text (rund 896 Woerter) liegt in
// messages/legal/<sprache>.json, hier steht nur noch die Verdrahtung.
type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: 'legal.datenschutz' });

  return pageMetadata({
    title: t('meta_titel'),
    description: t('meta_beschreibung'),
    path: legalPath(locale, 'datenschutz'),
  });
}

export default async function DatenschutzPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'legal' });
  const doc = t.raw('datenschutz') as Rechtstext;

  return <LegalDoc doc={doc} dsHref={legalPath(locale, 'datenschutz')} />;
}
