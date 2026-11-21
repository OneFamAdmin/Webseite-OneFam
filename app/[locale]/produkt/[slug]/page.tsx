import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import MaxWidth from '@/components/MaxWidth';
import SiteFooter from '@/components/SiteFooter';
import ProduktAnsicht from '@/components/shop/ProduktAnsicht';
import { holeProdukt, holeProduktSlugs } from '@/lib/shop/katalog';
import { SHOP_AUF_ONEFAM, LOCALES, isLocale, kategoriePfad, warenkorbPfad } from '@/i18n/routing';

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

// Welche Produktseiten beim Bauen vorbereitet werden: alle öffentlichen Produkte
// aus dem Katalog-Endpunkt, je Sprache. Ohne diese Liste markierte der Bau die
// Seite als dynamisch (gemessen 20.11.2026) — dann rechnet Vercel sie bei jedem
// Aufruf neu, statt sie aus dem Zwischenspeicher zu liefern.
// Ein Produkt, das später dazukommt, wird beim ersten Aufruf gebaut und danach
// ebenfalls gespeichert.
export async function generateStaticParams() {
  // Ohne den Schalter gibt es diese Seiten nicht — dann auch nichts beim Shop holen.
  // Zurück kommt trotzdem EIN Platzhalter je Sprache statt einer leeren Liste. Am
  // 21.11.2026 gemessen (Next.js 15.3.6): Bei leerer Liste antwortete JEDE Adresse
  // dieser Route mit 500 statt 404 (DYNAMIC_SERVER_USAGE; app/layout.tsx liest die
  // Kopfzeilen der Anfrage, und ohne eine einzige beim Bauen erzeugte Seite gilt die
  // Route als rein statisch). Mit einem Platzhalter: 404, kein Fehler im Protokoll.
  // Dasselbe gilt für jede Adresse unter /produkt/.
  // Der Platzhalter selbst antwortet mit 404 (Sperre in der Seite). Nicht entfernen.
  if (!SHOP_AUF_ONEFAM) return LOCALES.map((locale) => ({ locale, slug: 'gesperrt' }));
  const slugs = await holeProduktSlugs();
  return LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
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
  // Gesperrt, solange der Shop nicht auf onefam.ch läuft: ohne den Schalter antwortet
  // die Seite mit 404 (i18n/routing.ts, SHOP_AUF_ONEFAM). Die Sperre steht NACH
  // setRequestLocale: Die 404-Seite ist übersetzt, und ohne gesetzte Sprache liest
  // next-intl die Kopfzeilen der Anfrage — auf einer statisch erneuerten Seite ist
  // das ein Serverfehler (gemessen am 21.11.2026: 500 statt 404, DYNAMIC_SERVER_USAGE).
  if (!SHOP_AUF_ONEFAM) notFound();

  const produkt = await holeProdukt(slug, locale);
  if (!produkt) notFound();

  // Die Zeile über dem Produktnamen führt zur Länderseite und heisst wie sie
  // ("Schwarzes Logo", nicht der WooCommerce-Name "Logo Black").
  const tKat = await getTranslations({ locale, namespace: 'shop_kategorien' });
  const katSlug = produkt.kategorie?.slug;
  const kategorieName =
    katSlug && tKat.has(`${katSlug}.name`) ? tKat(`${katSlug}.name`) : (produkt.kategorie?.name ?? null);

  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav shop />
      <main className="flex-1 py-10 md:py-16">
        <MaxWidth>
          <ProduktAnsicht
            produkt={produkt}
            warenkorbPfad={warenkorbPfad(locale)}
            kategoriePfad={katSlug ? kategoriePfad(locale, katSlug) : null}
            kategorieName={kategorieName}
          />
        </MaxWidth>
      </main>
      <SiteFooter />
    </div>
  );
}
