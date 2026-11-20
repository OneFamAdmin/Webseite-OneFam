import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import MaxWidth from '@/components/MaxWidth';
import SiteFooter from '@/components/SiteFooter';
import LaenderWand, { type Linie } from '@/components/shop/LaenderWand';
import { holeKategorie, holeKategorieSlugs } from '@/lib/shop/katalog';
import { LAENDER, LOGO_BALD } from '@/lib/shop/laender';
import { SITE_URL } from '@/lib/seo';
import { LOCALES, isLocale, shopByCountryPfad } from '@/i18n/routing';

// "Nach Land shoppen" — /shop-by-country, /de/shop-by-country …
// Probeaufbau vom 21.11.2026, nur lokal. Plan: docs/plan-zusammenfuehrung-onefam.md.
//
// Die Übersicht des Shops: was es schon gibt (Länder und die beiden
// Logo-Linien) und die Wunschwand mit allen übrigen Ländern samt Warteliste.
// Aufbau und Gründe stehen in components/shop/LaenderWand.tsx.
//
// WAS "SCHON ZU KAUFEN" HEISST, entscheidet der Katalog: eine Kategorie mit
// mindestens einem Produkt. Trägt sie die Kennung eines Landes aus
// lib/shop/laender.ts, ist sie ein Land, sonst eine Linie (heute die beiden
// Logos). Ein neues Land erscheint also von selbst unter "Jetzt verfügbar" und
// verschwindet aus der Wunschwand, sobald es Produkte hat — im Shop musste
// dafür ein Schalter in der Länderliste umgelegt werden.

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 300;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'shop_laender' });
  return {
    title: `${t('titel')} | OneFam`,
    description: t('intro'),
    // Probeaufbau: nicht in den Index, auch nicht bei einem versehentlichen Push.
    robots: { index: false, follow: false },
  };
}

export default async function ShopByCountry({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'shop_laender' });
  const tKat = await getTranslations({ locale, namespace: 'shop_kategorien' });

  const slugs = await holeKategorieSlugs();
  const kategorien = (await Promise.all(slugs.map((s) => holeKategorie(s, locale)))).filter(
    (k): k is NonNullable<typeof k> => !!k && k.produkte.length > 0,
  );

  const alsLinie = (k: (typeof kategorien)[number]): Linie => ({
    slug: k.slug,
    name: tKat.has(`${k.slug}.name`) ? tKat(`${k.slug}.name`) : k.name,
    bild: k.produkte[0].produktbild ?? k.produkte[0].bild,
    produkte: k.produkte,
  });

  const vergleich = new Intl.Collator(locale, { sensitivity: 'base' });
  const land = new Map(LAENDER.map((l) => [l.id, l]));
  const kaufbar = new Set(kategorien.map((k) => k.slug));

  const verfuegbar = kategorien
    .filter((k) => land.has(k.slug))
    .map((k) => ({ ...alsLinie(k), en: land.get(k.slug)!.en }))
    .sort((a, b) => vergleich.compare(a.name, b.name));
  const linien = kategorien.filter((k) => !land.has(k.slug)).map(alsLinie);

  const wand = LAENDER.filter((l) => !kaufbar.has(l.id))
    .map((l) => ({
      id: l.id,
      en: l.en,
      name: l[locale],
      // Form im Satz ("Ich will die Schweiz"); Spanisch und Länder ohne Artikel: der Name.
      satz: (locale !== 'es' && l.satz?.[locale]) || l[locale],
    }))
    .sort((a, b) => vergleich.compare(a.name, b.name));

  const bald = LOGO_BALD.map((b) => ({ en: b.en, bild: `https://shop.onefam.ch${b.bild}` }));

  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav shop />
      <main className="flex-1 pb-20 pt-12 md:pb-28 md:pt-20">
        <MaxWidth>
          <header className="max-w-[40rem]">
            <h1 className="font-serif text-[clamp(2.5rem,5.6vw,4.4rem)] font-normal leading-[1.06] text-primary">
              {t('titel')}
            </h1>
            <p className="mt-5 max-w-[31rem] font-body text-lg leading-[1.7] tracking-[0.012em] text-secondary">
              {t('intro')}
            </p>
          </header>

          <LaenderWand
            verfuegbar={verfuegbar}
            linien={linien}
            bald={bald}
            wand={wand}
            teilenUrl={`${SITE_URL}${shopByCountryPfad(locale)}`}
          />
        </MaxWidth>
      </main>
      <SiteFooter />
    </div>
  );
}
