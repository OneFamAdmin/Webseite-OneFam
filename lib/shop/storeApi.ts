import type { Warenkorb } from './typen';

// lib/shop/storeApi.ts — NUR serverseitig benutzen.
//
// Spricht mit der WooCommerce-Store-API (/wp-json/wc/store/v1) — derselben
// Schnittstelle, über die die moderne WooCommerce-Kasse arbeitet. Am 20.11.2026
// gemessen:
//
//   - Warenkorb-Änderungen gehen OHNE Nonce, wenn die Anfrage den `Cart-Token`
//     mitschickt. Den Token gibt jede Antwort im Kopf zurück; onefam.ch hält ihn
//     in einem eigenen Cookie (WARENKORB_COOKIE). Dadurch braucht der Browser kein
//     Cookie von shop.onefam.ch — Safari würde ein fremdes ohnehin verwerfen.
//   - Als Zahlart führt die Schnittstelle `zahls`. Die Kasse auf onefam.ch ist
//     also möglich (Plan Schritt 3, im Probeaufbau noch nicht gebaut).
//   - Die WÄHRUNG wählt CURCY in der Schnittstelle allein nach der IP-Adresse.
//     Cookie, Parameter und Sprache wirken nicht. Mit einer deutschen IP kam
//     korrekt 69,99 EUR (Festpreis), sonst CHF. Ohne Gegenmassnahme entschiede
//     also die IP des Vercel-Servers. Deshalb schickt onefam.ch:
//       X-OneFam-Waehrung   die Entscheidung nach der Geräte-Regel
//                           (lib/shop/waehrung.ts). Wirkt erst, wenn im Shop das
//                           Snippet dafür aktiv ist (Plan Schritt 0).
//       X-Forwarded-For     die echte IP des Besuchers — damit bis dahin
//                           wenigstens nach seinem Land entschieden wird und
//                           nicht nach dem Rechenzentrum.
//   - Das Versandland lässt sich nur setzen, wenn das Bundesland mitgeleert wird.
//     Der Shop belegt es mit "BS" (Basel-Stadt) vor; für DE antwortete die
//     Schnittstelle sonst mit "Das angegebene Bundesland (BS) ist ungültig".

const STORE = 'https://shop.onefam.ch/wp-json/wc/store/v1';

export const WARENKORB_COOKIE = 'of_warenkorb';

/** WooCommerce räumt Gast-Warenkörbe nach 48 Stunden ab — länger lohnt das Cookie nicht. */
export const WARENKORB_COOKIE_MAX_AGE = 60 * 60 * 48;

export type Absender = {
  token: string | null;
  waehrung: string;
  ip: string | null;
  sprache: string | null;
  /**
   * Sprache der Seite, auf der der Besucher gerade ist. Geht als Cookie `ofl` an
   * den Shop — danach richtet er Produktnamen und Merkmalsnamen (Snippets 28 und
   * 57). Ohne sie hiess das Teil im deutschen Warenkorb "Albania Hoodie" statt
   * "Albanien Hoodie" (gemessen 20.11.2026).
   */
  seitenSprache: string | null;
};

type StoreAntwort = { status: number; daten: unknown; token: string | null };

export async function store(
  pfad: string,
  absender: Absender,
  koerper?: object,
): Promise<StoreAntwort> {
  const kopf: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-OneFam-Waehrung': absender.waehrung,
  };
  if (absender.token) kopf['Cart-Token'] = absender.token;
  if (absender.ip) kopf['X-Forwarded-For'] = absender.ip;
  if (absender.sprache) kopf['Accept-Language'] = absender.sprache;
  if (absender.seitenSprache) kopf['Cookie'] = `ofl=${absender.seitenSprache}`;

  const antwort = await fetch(`${STORE}${pfad}`, {
    method: koerper ? 'POST' : 'GET',
    headers: kopf,
    body: koerper ? JSON.stringify(koerper) : undefined,
    cache: 'no-store',
  });
  return {
    status: antwort.status,
    daten: await antwort.json().catch(() => null),
    token: antwort.headers.get('cart-token') ?? absender.token,
  };
}

type StoreWarenkorb = {
  items: {
    key: string;
    id: number;
    name: string;
    quantity: number;
    images: { thumbnail: string; src: string }[];
    variation: { raw_attribute: string; attribute: string; value: string }[];
    prices: { price: string; currency_minor_unit: number };
    totals: { line_subtotal: string; line_subtotal_tax: string };
  }[];
  items_count: number;
  shipping_address: { country: string };
  shipping_rates: { shipping_rates: { price: string; selected: boolean }[] }[];
  totals: {
    currency_code: string;
    currency_minor_unit: number;
    total_items: string;
    total_items_tax: string;
    total_shipping: string | null;
    total_shipping_tax: string | null;
    total_price: string;
  };
  errors: { message: string }[];
};

/** Rohantwort der Store API → das, was onefam.ch anzeigt. Beträge bleiben in Rappen/Cent. */
export function alsWarenkorb(roh: unknown, laender: string[]): Warenkorb {
  const w = roh as StoreWarenkorb;
  const zahl = (s: string | null | undefined) => (s == null ? 0 : Number(s));
  const rate = w.shipping_rates?.[0]?.shipping_rates?.find((r) => r.selected) ?? w.shipping_rates?.[0]?.shipping_rates?.[0];
  return {
    waehrung: w.totals.currency_code,
    positionen: w.items.map((i) => ({
      key: i.key,
      id: i.id,
      name: i.name,
      // Nach raw_attribute, nicht nach attribute: Das ist die Beschriftung und kommt
      // übersetzt zurück ("Farbe", "Grösse"), sobald die Browsersprache mitgeht —
      // am 20.11.2026 standen Farbe und Grösse deshalb leer im Warenkorb.
      farbe: i.variation.find((v) => v.raw_attribute === 'attribute_colour')?.value ?? '',
      groesse: i.variation.find((v) => v.raw_attribute === 'attribute_size')?.value ?? '',
      menge: i.quantity,
      bild: i.images[0]?.thumbnail ?? null,
      einzelpreis: zahl(i.prices.price),
      summe: zahl(i.totals.line_subtotal) + zahl(i.totals.line_subtotal_tax),
    })),
    anzahl: w.items_count,
    zwischensumme: zahl(w.totals.total_items) + zahl(w.totals.total_items_tax),
    versand: rate ? zahl(rate.price) : null,
    total: zahl(w.totals.total_price),
    land: w.shipping_address?.country ?? '',
    laender,
    fehler: (w.errors ?? []).map((e) => e.message),
  };
}
