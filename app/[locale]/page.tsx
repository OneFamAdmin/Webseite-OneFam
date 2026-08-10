import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import HomePage from '@/components/HomePage';
import { homeMetadata } from '@/lib/seo';
import { faqSchema, organisationSchema, webseiteSchema, type FaqEintrag } from '@/lib/schema';
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

// Strukturierte Daten werden bewusst als drei eigenständige Blöcke ausgegeben und
// nicht in einem @graph zusammengefasst: So bleibt jeder Block für sich gültig, und
// ein Fehler in einem zieht die anderen beiden nicht mit.
//
// Das Ersetzen von < verhindert, dass ein übersetzter Text mit spitzer Klammer das
// script-Element vorzeitig schliesst. JSON-LD erlaubt die Escape-Schreibweise.
function jsonLd(daten: object) {
  return { __html: JSON.stringify(daten).replace(/</g, '\\u003c') };
}

export default async function LocalisedHome({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);

  const tSeo = await getTranslations({ locale, namespace: 'seo' });
  const tFaq = await getTranslations({ locale, namespace: 'faq' });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organisationSchema())} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(webseiteSchema(locale, tSeo('description')))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(faqSchema(tFaq.raw('items') as FaqEintrag[]))}
      />
      <HomePage />
    </>
  );
}
