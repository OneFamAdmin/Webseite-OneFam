import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import MaxWidth from '@/components/MaxWidth';
import SiteFooter from '@/components/SiteFooter';
import KategorieKacheln from '@/components/shop/KategorieKacheln';
import { holeKategorie, holeKategorieSlugs } from '@/lib/shop/katalog';
import { LOCALES, homePath, isLocale, type Locale } from '@/i18n/routing';

// Länderseiten und Kollektionen auf onefam.ch — /de/albania, /logo-black …
// Probeaufbau vom 20.11.2026, nur lokal. Plan: docs/plan-zusammenfuehrung-onefam.md.
//
// Inhalt wie die heutigen Länderseiten im Shop: Name, ein Einleitungssatz, drei
// Kacheln. Dazu der Kategorietext aus Shop-Snippet 70, der für genau diese
// Seiten geschrieben wurde und im Shop nirgends mehr erscheint.
//
// Woher was kommt:
//   Name und Einleitungssatz   messages/<sprache>.json, "shop_kategorien" —
//                              am 20.11.2026 maschinell aus dem Router-Snippet
//                              übernommen. onefam.ch ist dafür jetzt die Quelle.
//   Kategorietext, Produkte,   Katalog-Endpunkt im Shop (lib/shop/katalog.ts).
//   Preise
//
// DIESE ROUTE FÄNGT JEDE ADRESSE DIREKT UNTER DER SPRACHE, für die es keine
// eigene Seite gibt (/de/irgendwas). Deshalb wird der Slug zuerst gegen die
// Liste der Kategorien geprüft — sonst löste jede Tippfehler-Adresse und jeder
// Bot eine Abfrage beim Shop aus. Alles Unbekannte bleibt ein 404.

type Props = { params: Promise<{ locale: string; kategorie: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await holeKategorieSlugs();
  return LOCALES.flatMap((locale) => slugs.map((kategorie) => ({ locale, kategorie })));
}

async function lade(locale: Locale, slug: string) {
  // Ist der Shop nicht erreichbar, gilt eine unbekannte Adresse als nicht
  // gefunden statt als Serverfehler. Bekannte Seiten liefert ohnehin der
  // Zwischenspeicher.
  const bekannt = await holeKategorieSlugs().catch(() => [] as string[]);
  if (!bekannt.includes(slug)) return null;
  const daten = await holeKategorie(slug, locale);
  if (!daten || daten.produkte.length === 0) return null;

  const t = await getTranslations({ locale, namespace: 'shop_kategorien' });
  return {
    daten,
    // Für eine Kategorie, die noch keinen eigenen Text hat, gilt der Name aus WooCommerce.
    name: t.has(`${slug}.name`) ? t(`${slug}.name`) : daten.name,
    intro: t.has(`${slug}.intro`) ? t(`${slug}.intro`) : null,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, kategorie } = await params;
  if (!isLocale(locale)) return {};
  const seite = await lade(locale, kategorie).catch(() => null);
  if (!seite) return {};
  return {
    title: `${seite.name} | OneFam`,
    description: seite.daten.text ?? seite.intro ?? undefined,
    // Probeaufbau: nicht in den Index, auch nicht bei einem versehentlichen Push.
    robots: { index: false, follow: false },
  };
}

export default async function KategorieSeite({ params }: Props) {
  const { locale, kategorie } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const seite = await lade(locale, kategorie);
  if (!seite) notFound();

  const t = await getTranslations({ locale, namespace: 'shop_seiten' });

  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav />
      <main className="flex-1 py-10 md:py-16">
        <MaxWidth>
          <nav aria-label="Breadcrumb" className="font-body text-sm text-secondary">
            <Link href={homePath(locale)} className="underline-offset-4 hover:text-primary hover:underline">
              {t('start')}
            </Link>
            <span aria-hidden="true"> &nbsp;/&nbsp; </span>
            <span className="text-primary">{seite.name}</span>
          </nav>

          <header className="mt-8 max-w-[31rem]">
            <h1 className="font-serif text-[clamp(2.4rem,5.2vw,3.6rem)] font-normal leading-[1.05] text-primary">
              {seite.name}
            </h1>
            {seite.intro && (
              <p className="mt-5 font-body text-lg leading-[1.7] tracking-[0.012em] text-secondary">{seite.intro}</p>
            )}
          </header>

          <div className="mt-12">
            <KategorieKacheln produkte={seite.daten.produkte} />
          </div>

          {seite.daten.text && (
            <p className="mt-16 max-w-[31rem] border-t border-white/10 pt-8 font-body leading-[1.75] tracking-[0.012em] text-secondary">
              {seite.daten.text}
            </p>
          )}
        </MaxWidth>
      </main>
      <SiteFooter />
    </div>
  );
}
