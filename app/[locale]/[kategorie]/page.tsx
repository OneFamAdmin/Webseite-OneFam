import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Button from '@/components/Button';
import Nav from '@/components/Nav';
import MaxWidth from '@/components/MaxWidth';
import SiteFooter from '@/components/SiteFooter';
import KategorieKacheln from '@/components/shop/KategorieKacheln';
import PreisZeile from '@/components/shop/PreisZeile';
import { BRAND_GRADIENT_CTA } from '@/lib/brand';
import { holeKategorie, holeKategorieSlugs } from '@/lib/shop/katalog';
import { SHOP_AUF_ONEFAM, LOCALES, isLocale, type Locale } from '@/i18n/routing';

// Länderseiten und Kollektionen auf onefam.ch — /de/albania, /logo-black …
// Probeaufbau, nur lokal. Plan: docs/plan-zusammenfuehrung-onefam.md.
//
// AUFBAU seit 21.11.2026 nach dem Entwurf "OneFam – Premium One-Page: Albanien"
// (Labi: "bau die Länderseite nach dem Entwurf um, aber nur wenn sie zur Landing
// Page und dem Edlen passt und verkaufspsychologisch Sinn macht"):
//
//   1. Einstieg     Für wen es ist (grosse Zeile), was auf der Brust ist, ein
//                   Knopf zu den Teilen, der Preis direkt daneben.
//   2. Die Teile    Drei Kacheln mit Preis; darunter die Sachangaben und
//                   Versand/Rückgabe — die Antworten auf "was kostet es, woraus
//                   ist es, kann ich es zurückgeben" stehen beim Angebot, nicht
//                   am Seitenende.
//   3. Erzählung    "Was man über euch sagt …" — der Grund, warum jemand genau
//                   dieses Land trägt.
//   4. Das Zeichen / Für wen
//   5. Schlusszeile und noch einmal der Knopf zu den Teilen.
//
// ÜBERNOMMEN aus dem Entwurf: Reihenfolge, grosse Serifenzeilen in dem hellen
// Ton des Hero-Claims, goldene Zeile über dem Titel, der Markenverlauf auf dem
// Knopf, der zum Kauf führt (Labis Entscheid vom 21.11.2026).
//
// NICHT ÜBERNOMMEN, jeweils mit Grund:
//   - Farbschimmer hinter Bildern und Abschnitten, blasse Riesen-Gesichter im
//     Hintergrund, schwere Schatten: dekorative Verläufe und Glow sind auf
//     onefam.ch nicht erwünscht (CLAUDE.md, Design und Marke).
//   - DM Sans als Fliesstext: wäre die dritte Schrift. Hier Satoshi.
//   - Mitlaufende Kaufleiste: verdeckt Inhalt und drängt.
//   - Laufzeile mit Küstenorten, Lookbook mit Sofortbildern, "Was drin steckt":
//     dafür gibt es keine Texte und Bilder für alle sechs Linien in vier
//     Sprachen. Erfundene Texte kommen nicht auf die Seite; die Kacheln zeigen
//     die Teile ohnehin an Menschen.
//   - Kundenstimme: Es gibt noch keine echte. Erfunden wird keine.
//   - Zahlarten (TWINT, Apple Pay …): erst nennen, wenn an der Kasse geprüft.
//   - Kaufbereich auf der Länderseite: siehe components/shop/KategorieKacheln.tsx.
//
// WOHER DIE TEXTE KOMMEN — nichts davon ist neu geschrieben:
//   Name, die beiden Sätze des Einstiegs   messages/<sprache>.json, "shop_kategorien"
//                                          (aus dem Router-Snippet übernommen)
//   Erzählung, Das Zeichen, Für wen,       Shop-Snippet 68, über den Katalog-Endpunkt
//   Schlusszeile
//   Sachangaben                            Shop-Snippet 70
//   Versand und Rückgabe                   Shop-Snippet 69
//
// DIESE ROUTE FÄNGT JEDE ADRESSE DIREKT UNTER DER SPRACHE, für die es keine
// eigene Seite gibt (/de/irgendwas). Deshalb wird der Slug zuerst gegen die
// Liste der Kategorien geprüft — sonst löste jede Tippfehler-Adresse und jeder
// Bot eine Abfrage beim Shop aus. Alles Unbekannte bleibt ein 404.

type Props = { params: Promise<{ locale: string; kategorie: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  // Ohne den Schalter gibt es diese Seiten nicht — dann auch nichts beim Shop holen.
  // Zurück kommt trotzdem EIN Platzhalter je Sprache statt einer leeren Liste. Am
  // 21.11.2026 gemessen (Next.js 15.3.6): Bei leerer Liste antwortete JEDE Adresse
  // dieser Route mit 500 statt 404 (DYNAMIC_SERVER_USAGE; app/layout.tsx liest die
  // Kopfzeilen der Anfrage, und ohne eine einzige beim Bauen erzeugte Seite gilt die
  // Route als rein statisch). Mit einem Platzhalter: 404, kein Fehler im Protokoll.
  // Diese Route liegt direkt unter der Sprache: Es hätte jede unbekannte Adresse der
  // ganzen Website getroffen.
  // Der Platzhalter selbst antwortet mit 404 (Sperre in der Seite). Nicht entfernen.
  if (!SHOP_AUF_ONEFAM) return LOCALES.map((locale) => ({ locale, kategorie: 'gesperrt' }));
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
  const hat = (feld: string) => t.has(`${slug}.${feld}`);
  return {
    daten,
    // Für eine Kategorie, die noch keine eigenen Texte hat, gilt der Name aus WooCommerce.
    name: hat('name') ? t(`${slug}.name`) : daten.name,
    fuer: hat('fuer') ? t(`${slug}.fuer`) : null,
    motivSatz: hat('motiv') ? t(`${slug}.motiv`) : null,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, kategorie } = await params;
  if (!isLocale(locale)) return {};
  const seite = await lade(locale, kategorie).catch(() => null);
  if (!seite) return {};
  return {
    title: `${seite.name} | OneFam`,
    description: seite.daten.text ?? seite.motivSatz ?? undefined,
    // Probeaufbau: nicht in den Index, auch nicht bei einem versehentlichen Push.
    robots: { index: false, follow: false },
  };
}

// Derselbe helle Ton wie der Claim im Hero der Startseite (components/Hero.tsx).
const CLAIM_TON = '#EBD9A6';

const FLIESSTEXT = 'font-body leading-[1.75] tracking-[0.012em] text-secondary';

export default async function KategorieSeite({ params }: Props) {
  const { locale, kategorie } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  // Gesperrt, solange der Shop nicht auf onefam.ch läuft: ohne den Schalter antwortet
  // die Seite mit 404 (i18n/routing.ts, SHOP_AUF_ONEFAM). Die Sperre steht NACH
  // setRequestLocale: Die 404-Seite ist übersetzt, und ohne gesetzte Sprache liest
  // next-intl die Kopfzeilen der Anfrage — auf einer statisch erneuerten Seite ist
  // das ein Serverfehler (gemessen am 21.11.2026: 500 statt 404, DYNAMIC_SERVER_USAGE).
  if (!SHOP_AUF_ONEFAM) notFound();

  const seite = await lade(locale, kategorie);
  if (!seite) notFound();

  const t = await getTranslations({ locale, namespace: 'shop_seiten' });
  const { daten, name, fuer, motivSatz } = seite;
  const { motiv, versand, produkte } = daten;
  const einstiegsBild = produkte[0].produktbild ?? produkte[0].bild;

  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav shop />
      <main className="flex-1">
        {/* 1. Einstieg */}
        <section className="py-12 md:py-20">
          <MaxWidth>
            <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-20">
              <div>
                {/* Eine Überschrift, zwei Zeilen: der Name des Landes gehört für
                    Suchmaschinen in die h1, die grosse Zeile trägt die Aussage. */}
                <h1>
                  <span className="block font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">
                    {name}
                  </span>
                  <span
                    className="mt-5 block font-serif text-[clamp(2.5rem,5.6vw,4.4rem)] font-normal leading-[1.06]"
                    style={{ color: CLAIM_TON }}
                  >
                    {fuer ?? name}
                  </span>
                </h1>
                {motivSatz && (
                  <p className={`mt-7 max-w-[31rem] text-lg ${FLIESSTEXT}`}>{motivSatz}</p>
                )}
                <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                  <Button as="a" href="#teile" variant="primary" style={{ background: BRAND_GRADIENT_CTA }}>
                    {t('kollektion_entdecken')} <span aria-hidden="true">→</span>
                  </Button>
                  <PreisZeile produkte={produkte} />
                </div>
              </div>

              {/* Am Desktop höchstens 32rem breit: bei voller Spaltenbreite war das
                  Bild 750 px hoch und ragte auf einem Laptop unten aus dem Bild. */}
              {einstiegsBild && (
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-[#F1F1F1] lg:max-w-[32rem] lg:justify-self-end">
                  <Image
                    src={einstiegsBild}
                    alt={produkte[0].name}
                    fill
                    unoptimized
                    priority
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </MaxWidth>
        </section>

        {/* 2. Die Teile, mit Sachangaben und Versand/Rückgabe */}
        <section id="teile" className="scroll-mt-16 border-t border-white/10 py-16 md:py-24">
          <MaxWidth>
            <h2 className="font-serif text-[clamp(2rem,4.2vw,3.1rem)] font-normal leading-[1.1] text-primary">
              {produkte.length === 3 ? t('teile_titel_drei') : t('teile_titel')}
            </h2>
            <div className="mt-10 md:mt-12">
              <KategorieKacheln produkte={produkte} />
            </div>

            {(daten.text || versand) && (
              <div className="mt-14 max-w-[31rem]">
                {daten.text && <p className={FLIESSTEXT}>{daten.text}</p>}
                {versand && (
                  <details className="mt-6 border-y border-white/10 py-4">
                    <summary className="cursor-pointer font-body text-primary marker:text-gold">{versand.titel}</summary>
                    <div
                      className={`mt-4 ${FLIESSTEXT} [&_a]:text-gold [&_a]:underline-offset-4 hover:[&_a]:underline [&_p]:mb-4 [&_strong]:font-medium [&_strong]:text-primary`}
                      dangerouslySetInnerHTML={{ __html: versand.html }}
                    />
                  </details>
                )}
              </div>
            )}
          </MaxWidth>
        </section>

        {motiv && (
          <>
            {/* 3. Erzählung */}
            <section className="border-t border-white/10 py-16 md:py-24">
              <MaxWidth>
                {/* Zwei Spalten wie der Abschnitt darunter: links der erste Absatz
                    gross und in Serifen, rechts der Rest. Einspaltig blieb am
                    Desktop die halbe Seite leer. Bei dieser Schriftgrösse sind
                    40rem dieselben rund 55 Zeichen je Zeile wie 31rem im Fliesstext. */}
                <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-2 lg:gap-20">
                  <p className="max-w-[40rem] font-serif text-[clamp(1.45rem,2.3vw,1.9rem)] font-normal leading-[1.4] text-primary">
                    {motiv.erzaehlung[0]}
                  </p>
                  {motiv.erzaehlung.length > 1 && (
                    <div className="max-w-[31rem] lg:pt-2">
                      {motiv.erzaehlung.slice(1).map((absatz) => (
                        <p key={absatz} className={`mb-6 ${FLIESSTEXT}`}>
                          {absatz}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </MaxWidth>
            </section>

            {/* 4. Das Zeichen / Für wen */}
            <section className="border-t border-white/10 py-16 md:py-24">
              <MaxWidth>
                <div className="grid grid-cols-[minmax(0,1fr)] gap-14 lg:grid-cols-2 lg:gap-20">
                  {[
                    { titel: motiv.titel?.zeichen, text: motiv.zeichen },
                    { titel: motiv.titel?.fuer, text: motiv.fuer },
                  ].map((block) => (
                    <div key={block.text} className="max-w-[31rem]">
                      {block.titel && (
                        <h2 className="font-serif text-[clamp(1.7rem,3vw,2.3rem)] font-normal leading-[1.15] text-primary">
                          {block.titel}
                        </h2>
                      )}
                      <p className={`mt-5 ${FLIESSTEXT}`}>{block.text}</p>
                    </div>
                  ))}
                </div>
              </MaxWidth>
            </section>

            {/* 5. Schlusszeile und der Weg zurück zu den Teilen */}
            <section className="border-t border-white/10 py-20 md:py-28">
              <MaxWidth>
                <div className="mx-auto flex max-w-[44rem] flex-col items-center text-center">
                  <p
                    className="font-serif text-[clamp(1.8rem,3.8vw,3rem)] font-normal italic leading-[1.2]"
                    style={{ color: CLAIM_TON }}
                  >
                    {motiv.schluss}
                  </p>
                  <Button
                    as="a"
                    href="#teile"
                    variant="primary"
                    className="mt-10"
                    style={{ background: BRAND_GRADIENT_CTA }}
                  >
                    {t('teil_waehlen')} <span aria-hidden="true">→</span>
                  </Button>
                </div>
              </MaxWidth>
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
