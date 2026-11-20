import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import MaxWidth from '@/components/MaxWidth';
import SiteFooter from '@/components/SiteFooter';
import ProduktAnsicht from '@/components/shop/ProduktAnsicht';
import { holeProdukt } from '@/lib/shop/katalog';
import { LOCALES, isLocale, warenkorbPfad } from '@/i18n/routing';

// Produktseite auf onefam.ch — Probeaufbau vom 20.11.2026, nur lokal.
//
// Plan: docs/plan-zusammenfuehrung-onefam.md, Schritt 0. Daten aus WooCommerce
// (lib/shop/katalog.ts), Warenkorb über /api/shop/warenkorb.
//
// noindex, solange es ein Probeaufbau ist: Die Seite soll auch dann nicht in
// den Index, wenn sie versehentlich mit einem Push live geht. Die echte Seite
// bekommt Canonical, hreflang und Produktdaten (Plan Schritt 4).

type Props = { params: Promise<{ locale: string; slug: string }> };

// Fünf Minuten wie die Datenabfrage — Preise und Lager bleiben damit aktuell,
// ohne dass jeder Aufruf WordPress lädt.
export const revalidate = 300;

// Welche Produktseiten beim Bauen vorbereitet werden. Ohne diese Liste markierte
// der Bau die Seite als dynamisch (gemessen 20.11.2026) — dann rechnet Vercel sie
// bei jedem Aufruf neu, statt sie aus dem Zwischenspeicher zu liefern.
// Im Probeaufbau ein Produkt; später alle Slugs aus dem Katalog-Endpunkt.
// Andere Slugs werden beim ersten Aufruf gebaut und danach ebenfalls gespeichert.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale, slug: 'albania-hoodie' }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const produkt = await holeProdukt(slug, locale).catch(() => null);
  return {
    title: produkt ? `${produkt.name} | OneFam` : 'OneFam',
    robots: { index: false, follow: false },
  };
}

export default async function ProduktSeite({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const produkt = await holeProdukt(slug, locale);
  if (!produkt) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav />
      <main className="flex-1 py-10 md:py-16">
        <MaxWidth>
          <ProduktAnsicht produkt={produkt} warenkorbPfad={warenkorbPfad(locale)} kategoriePfad={null} />
        </MaxWidth>
      </main>
      <SiteFooter />
    </div>
  );
}
