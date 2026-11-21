import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import MaxWidth from '@/components/MaxWidth';
import SiteFooter from '@/components/SiteFooter';
import WarenkorbAnsicht from '@/components/shop/WarenkorbAnsicht';
import { SHOP_AUF_ONEFAM, LOCALES, isLocale, kassePfad, shopByCountryPfad } from '@/i18n/routing';

// Warenkorb auf onefam.ch — Probeaufbau vom 20.11.2026, nur lokal.
// Die Seite selbst ist für alle gleich; den Inhalt holt WarenkorbAnsicht im
// Browser. Ein Warenkorb gehört nie in einen Suchindex.

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'shop_seiten' });
  return { title: `${t('warenkorb')} | OneFam`, robots: { index: false, follow: false } };
}

export default async function WarenkorbSeite({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  // Gesperrt, solange der Shop nicht auf onefam.ch läuft: ohne den Schalter antwortet
  // die Seite mit 404 (i18n/routing.ts, SHOP_AUF_ONEFAM). Die Sperre steht NACH
  // setRequestLocale: Die 404-Seite ist übersetzt, und ohne gesetzte Sprache liest
  // next-intl die Kopfzeilen der Anfrage — auf einer statisch erneuerten Seite ist
  // das ein Serverfehler (gemessen am 21.11.2026: 500 statt 404, DYNAMIC_SERVER_USAGE).
  if (!SHOP_AUF_ONEFAM) notFound();
  const t = await getTranslations({ locale, namespace: 'shop_seiten' });

  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav shop />
      <main className="flex-1 py-10 md:py-16">
        <MaxWidth>
          <h1 className="mb-10 font-serif text-[clamp(2rem,4.4vw,2.9rem)] font-normal text-primary">
            {t('warenkorb')}
          </h1>
          <WarenkorbAnsicht weiterPfad={shopByCountryPfad(locale)} kassePfad={kassePfad(locale)} />
        </MaxWidth>
      </main>
      <SiteFooter />
    </div>
  );
}
