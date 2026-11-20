import type { Farbe, Produkt, Variante } from './typen';
import type { Locale } from '@/i18n/routing';

// lib/shop/katalog.ts — NUR serverseitig benutzen.
//
// Holt Produktdaten aus WooCommerce für die Shop-Seiten auf onefam.ch.
//
// QUELLE (seit 20.11.2026): der eigene Katalog-Endpunkt im Shop,
//   GET https://shop.onefam.ch/wp-json/onefam/v1/katalog/<slug>?lang=<sprache>
// Shop-Snippet 114, Quelle im Repo: docs/shop-snippets/onefam-headless-katalog.php.
// Öffentlich, nur lesend, braucht KEINEN WooCommerce-Schlüssel — der liegt
// bewusst nicht in Vercel. Am 20.11.2026 gemessen: 84 Varianten, alle mit
// EUR-Festpreis 69,99 und CHF 75, Antwort 0,7 s, Bilder in den von WordPress
// erzeugten Grössen.
//
// Warum nicht die öffentliche Store API: Sie kennt die EUR-Festpreise nicht
// (gemessen: nur CHF) und braucht 0,94 s.
//
// AUSNAHME: Die Lieferländer kommen im Probeaufbau noch über wc/v3 mit dem
// Lese-Schlüssel aus .env.local (holeLieferlaender). Vor dem Livegang gehören
// sie in den Katalog-Endpunkt.

const SHOP = 'https://shop.onefam.ch';

/** Grössen in Tragereihenfolge. */
const GROESSEN_REIHENFOLGE = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

/**
 * Die Dateinamen der Bilder tragen die Farbe ohne Leerzeichen
 * (OneFam_Albanien_Hoodie_HeatherGrey_Frau_frontal_4k.webp) — ausser Schwarz:
 * dort steht "schwarz". So ordnet heute auch der Shop die Galerie je Farbe zu.
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
  varianten: { id: number; farbe: string; groesse: string; chf: number; eur: number | null; lieferbar: boolean }[];
  texte: { motiv: string | null; titel: string | null; inhalt: string | null };
};

/**
 * Das HTML aus dem Shop bringt eigene <style>-Blöcke für das Divi-Theme mit.
 * Hier würden sie die Seite von onefam.ch mitgestalten — deshalb raus; die
 * Gestaltung übernimmt components/shop/ProduktAnsicht.tsx.
 */
function ohneStil(html: string) {
  return html.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/\sstyle="[^"]*"/gi, '');
}

export async function holeProdukt(slug: string, locale: Locale): Promise<Produkt | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const antwort = await fetch(`${SHOP}/wp-json/onefam/v1/katalog/${slug}?lang=${locale}`, {
    // Fünf Minuten wie der Zwischenspeicher im Shop selbst.
    next: { revalidate: 300 },
  });
  if (antwort.status === 404) return null;
  if (!antwort.ok) throw new Error(`Katalog ${slug}: ${antwort.status}`);
  const p = (await antwort.json()) as KatalogAntwort;

  const farben: Farbe[] = p.farben.map((name) => {
    const schluessel = farbSchluessel(name);
    return {
      name,
      bilder: p.bilder
        .filter((b) => b.voll.toLowerCase().includes(`_${schluessel}_`))
        .map((b) => ({ src: b.gross, klein: b.klein, alt: b.alt || `${p.name} – ${name}` })),
    };
  });

  const varianten: Variante[] = p.varianten.map((v) => ({ ...v }));

  const erstes = p.bilder[0]?.voll.toLowerCase() ?? '';
  const startFarbe =
    farben.find((f) => erstes.includes(`_${farbSchluessel(f.name)}_`))?.name ?? farben[0]?.name ?? '';

  return {
    id: p.id,
    slug: p.slug,
    name: p.texte.titel || p.name,
    beschreibungHtml: ohneStil(p.texte.inhalt ?? ''),
    kategorie: p.kategorie,
    farben,
    groessen: [...p.groessen].sort((a, b) => GROESSEN_REIHENFOLGE.indexOf(a) - GROESSEN_REIHENFOLGE.indexOf(b)),
    varianten,
    startFarbe,
  };
}

/** Lieferländer aus den Versandzonen des Shops (am 20.11.2026: 21 Länder). Noch über wc/v3, siehe oben. */
export async function holeLieferlaender(): Promise<string[]> {
  const key = process.env.WOO_KEY;
  const secret = process.env.WOO_SECRET;
  if (!key || !secret) throw new Error('WOO_KEY/WOO_SECRET fehlen — Lieferländer nur lokal.');
  const kopf = { Authorization: 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64') };
  const wc = async <T,>(pfad: string): Promise<T> => {
    const r = await fetch(`${SHOP}/wp-json/wc/v3${pfad}`, { headers: kopf, next: { revalidate: 3600 } });
    if (!r.ok) throw new Error(`WooCommerce ${pfad}: ${r.status}`);
    return r.json() as Promise<T>;
  };
  const zonen = await wc<{ id: number }[]>('/shipping/zones');
  const listen = await Promise.all(
    zonen.map((z) => wc<{ code: string; type: string }[]>(`/shipping/zones/${z.id}/locations`)),
  );
  return [...new Set(listen.flat().filter((l) => l.type === 'country').map((l) => l.code))];
}
