import { KACHELBILD } from './kachelbilder';
import type { Farbe, Kategorie, Produkt, Variante } from './typen';
import type { Locale } from '@/i18n/routing';

// lib/shop/katalog.ts — NUR serverseitig benutzen.
//
// Holt Produktdaten aus WooCommerce für die Shop-Seiten auf onefam.ch.
//
// QUELLE (seit 20.11.2026): der eigene Katalog-Endpunkt im Shop,
//   GET https://shop.onefam.ch/wp-json/onefam/v1/katalog            Produktliste, Lieferländer
//   GET https://shop.onefam.ch/wp-json/onefam/v1/katalog/<slug>?lang=<sprache>
// Shop-Snippet 114, Quelle im Repo: docs/shop-snippets/onefam-headless-katalog.php.
// Öffentlich, nur lesend, braucht KEINEN WooCommerce-Schlüssel — der liegt
// bewusst nicht in Vercel. Am 20.11.2026 gemessen: 18 Produkte, 21 Lieferländer
// (seit 21.11.2026 sind es 19 — ohne Grossbritannien und Norwegen, lib/shop/kasse.ts);
// Albanien-Hoodie 84 Varianten, alle mit EUR-Festpreis 69,99 und CHF 75,
// Antwort 0,7 s, Bilder in den von WordPress erzeugten Grössen.
//
// Warum nicht die öffentliche Store API: Sie kennt die EUR-Festpreise nicht
// (gemessen: nur CHF) und braucht 0,94 s.
//
// DIE SPRACHE GEHT ALS COOKIE MIT, nicht nur als Parameter. Der Shop legt die
// Sprache einmal je Anfrage fest (Snippet 28: Adresspräfix, dann Cookie `ofl`,
// dann Browsersprache, dann IP-Land), und daran hängen Produktnamen, Motivtext,
// Grössentabelle und Lieferzeit. Ohne Cookie kam am 20.11.2026 alles deutsch,
// und Englisch, Französisch und Spanisch hatten gar keinen Motivtext. Passen
// Cookie und Parameter nicht zusammen, antwortet der Endpunkt mit 409.

const SHOP = 'https://shop.onefam.ch';

/** Grössen in Tragereihenfolge. */
const GROESSEN_REIHENFOLGE = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

/**
 * Welche Bilder gehören zu welcher Farbe? Zwei Quellen, in dieser Reihenfolge:
 *
 * 1. Das Bild, das WooCommerce an der Variante hinterlegt hat. Am 20.11.2026 für
 *    alle 18 Produkte gemessen: jede Farbe hat genau eines, alle liegen in der
 *    Galerie. Es steht in der Galerie der Farbe immer vorn.
 * 2. Bei den Länder-Produkten tragen die übrigen Bilder die Farbe im Dateinamen
 *    (OneFam_Albanien_Hoodie_HeatherGrey_Frau_frontal_4k.webp; Schwarz heisst
 *    dort "schwarz"). Sie folgen danach.
 *
 * Nur nach dem Dateinamen zu gehen, wie im ersten Wurf, liess die Galerie der
 * sechs Logo-Produkte leer: deren Dateien heissen logo-black-hoodie-red.webp
 * oder hf_2026…webp. Bilder, die so zu KEINER Farbe gehören (dort zwei
 * Modellbilder je Produkt), hängen an jeder Farbe hinten an — wie im Shop, wo
 * die Galerie ohnehin alle Bilder zeigt.
 */
const FARB_ALIAS: Record<string, string> = { black: 'schwarz' };

function farbSchluessel(farbe: string) {
  const k = farbe.replace(/\s+/g, '').toLowerCase();
  return FARB_ALIAS[k] ?? k;
}

type KatalogBild = { id: number; voll: string; gross: string; klein: string; alt: string };
type KatalogAntwort = {
  id: number;
  slug: string;
  name: string;
  kategorie: { slug: string; name: string } | null;
  farben: string[];
  groessen: string[];
  bilder: KatalogBild[];
  varianten: {
    id: number;
    farbe: string;
    groesse: string;
    chf: number;
    eur: number | null;
    lieferbar: boolean;
    bild: number;
  }[];
  inhalt: string | null;
  lieferzeit: string | null;
};

type KatalogUebersicht = {
  produkte: { slug: string; kategorie: string | null }[];
  laender: string[];
};

/**
 * Das HTML aus dem Shop bringt eigene <style>-Blöcke für das Divi-Theme mit.
 * Hier würden sie die Seite von onefam.ch mitgestalten — deshalb raus; die
 * Gestaltung übernimmt components/shop/ProduktAnsicht.tsx.
 */
function ohneStil(html: string) {
  return html.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/\sstyle="[^"]*"/gi, '');
}

/**
 * HTML aus dem Shop für onefam.ch herrichten: ohne dessen Gestaltung, und Links
 * ohne Domain auf den Shop gerichtet. In den Texten stehen Verweise wie
 * href="/shipping-policy/" — auf onefam.ch gibt es diese Seiten (noch) nicht,
 * der Link lief dort ins Leere (gemerkt am 21.11.2026, betraf auch die
 * Produktseiten). Mit Sprachpräfix, sonst landet ein französischer Besucher
 * auf der englischen Versandseite.
 */
function shopHtml(html: string, locale: Locale) {
  const basis = `${SHOP}${locale === 'en' ? '' : `/${locale}`}`;
  return ohneStil(html).replace(/href="\/(?!\/)/g, `href="${basis}/`);
}

export async function holeProdukt(slug: string, locale: Locale): Promise<Produkt | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const antwort = await fetch(`${SHOP}/wp-json/onefam/v1/katalog/${slug}?lang=${locale}`, {
    headers: { Cookie: `ofl=${locale}` },
    // Fünf Minuten wie der Zwischenspeicher im Shop selbst.
    next: { revalidate: 300 },
  });
  if (antwort.status === 404) return null;
  if (!antwort.ok) throw new Error(`Katalog ${slug}: ${antwort.status}`);
  const p = (await antwort.json()) as KatalogAntwort;

  const jeFarbe = new Map<string, KatalogBild[]>();
  for (const name of p.farben) {
    const variantenBild = p.varianten.find((v) => v.farbe === name && v.bild)?.bild;
    const schluessel = farbSchluessel(name);
    const vorn = p.bilder.filter((b) => b.id === variantenBild);
    const weitere = p.bilder.filter(
      (b) => b.id !== variantenBild && b.voll.toLowerCase().includes(`_${schluessel}_`),
    );
    jeFarbe.set(name, [...vorn, ...weitere]);
  }
  const vergeben = new Set([...jeFarbe.values()].flat().map((b) => b.id));
  const ohneFarbe = p.bilder.filter((b) => !vergeben.has(b.id));

  const farben: Farbe[] = p.farben.map((name) => ({
    name,
    bilder: [...(jeFarbe.get(name) ?? []), ...ohneFarbe].map((b) => ({
      src: b.gross,
      klein: b.klein,
      alt: b.alt || `${p.name} – ${name}`,
    })),
  }));

  const varianten: Variante[] = p.varianten.map((v) => ({
    id: v.id,
    farbe: v.farbe,
    groesse: v.groesse,
    chf: v.chf,
    eur: v.eur,
    lieferbar: v.lieferbar,
  }));

  // Vorauswahl: die Farbe, zu der das erste Galeriebild gehört — dieselbe, die der
  // Shop zuerst zeigt. Gehört es zu keiner (Logo-Linien), die erste Farbe.
  const erstesId = p.bilder[0]?.id;
  const startFarbe =
    p.farben.find((name) => jeFarbe.get(name)?.some((b) => b.id === erstesId)) ?? p.farben[0] ?? '';

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    beschreibungHtml: shopHtml(p.inhalt ?? '', locale),
    lieferzeit: p.lieferzeit,
    kategorie: p.kategorie,
    farben,
    groessen: [...p.groessen].sort((a, b) => GROESSEN_REIHENFOLGE.indexOf(a) - GROESSEN_REIHENFOLGE.indexOf(b)),
    varianten,
    startFarbe,
  };
}

async function holeUebersicht(): Promise<KatalogUebersicht> {
  const antwort = await fetch(`${SHOP}/wp-json/onefam/v1/katalog`, { next: { revalidate: 300 } });
  if (!antwort.ok) throw new Error(`Katalog-Übersicht: ${antwort.status}`);
  return antwort.json() as Promise<KatalogUebersicht>;
}

/** Alle öffentlichen Produkte (am 20.11.2026: 18) — für die Liste der vorzubauenden Seiten. */
export async function holeProduktSlugs(): Promise<string[]> {
  return (await holeUebersicht()).produkte.map((p) => p.slug);
}

/** Alle Kategorien mit mindestens einem öffentlichen Produkt (am 20.11.2026: vier Länder, zwei Logo-Linien). */
export async function holeKategorieSlugs(): Promise<string[]> {
  const kategorien = (await holeUebersicht()).produkte.map((p) => p.kategorie);
  return [...new Set(kategorien.filter((k): k is string => !!k))];
}

type KategorieAntwort = {
  slug: string;
  name: string;
  text: string | null;
  motiv: { absaetze: string[]; schluss: string; titel: { zeichen: string; fuer: string } | null } | null;
  versand: { titel: string; html: string } | null;
  produkte: {
    slug: string;
    name: string;
    chf: number;
    eur: number | null;
    einheitlich: boolean;
    farben: number;
    bild: KatalogBild | null;
  }[];
};

/**
 * Eine Länderseite oder Kollektion: Name, Kategorietext, Produkte mit Preis.
 * Die Sprache geht wie bei holeProdukt als Cookie mit.
 */
export async function holeKategorie(slug: string, locale: Locale): Promise<Kategorie | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const antwort = await fetch(`${SHOP}/wp-json/onefam/v1/katalog/kategorie/${slug}?lang=${locale}`, {
    headers: { Cookie: `ofl=${locale}` },
    next: { revalidate: 300 },
  });
  if (antwort.status === 404) return null;
  if (!antwort.ok) throw new Error(`Kategorie ${slug}: ${antwort.status}`);
  const k = (await antwort.json()) as KategorieAntwort;

  // Mindestens drei Absätze, sonst lässt sich der Text nicht sicher in
  // Erzählung, "Das Zeichen" und "Für wen" teilen — dann lieber keiner.
  const a = k.motiv?.absaetze ?? [];
  const motiv =
    k.motiv && a.length >= 3
      ? {
          erzaehlung: a.slice(0, -2),
          zeichen: a[a.length - 2],
          fuer: a[a.length - 1],
          schluss: k.motiv.schluss,
          titel: k.motiv.titel,
        }
      : null;

  return {
    slug: k.slug,
    name: k.name,
    text: k.text,
    motiv,
    versand: k.versand ? { titel: k.versand.titel, html: shopHtml(k.versand.html, locale) } : null,
    produkte: k.produkte.map((p) => ({
      slug: p.slug,
      name: p.name,
      chf: p.chf,
      eur: p.eur,
      einheitlich: p.einheitlich,
      farben: p.farben,
      bild: KACHELBILD[p.slug] ? `${SHOP}${KACHELBILD[p.slug]}` : (p.bild?.gross ?? ''),
      produktbild: p.bild?.gross ?? null,
    })),
  };
}

/** Lieferländer des Shops (am 20.11.2026: 21 Länder, seit 21.11.2026: 19). */
export async function holeLieferlaender(): Promise<string[]> {
  return (await holeUebersicht()).laender;
}
