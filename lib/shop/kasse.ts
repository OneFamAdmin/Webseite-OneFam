import type { Locale } from '@/i18n/routing';

// lib/shop/kasse.ts — die Kasse auf onefam.ch (21.11.2026).
//
// WIE BESTELLT WIRD: über die Store API von WooCommerce (POST /wc/store/v1/checkout)
// — derselbe Weg, den die Kasse des Shops schon geht (sie ist die "Block-Kasse",
// gemessen am 21.11.2026). Zahlart ist `zahls`; die Antwort trägt die Adresse des
// Zahlungsfensters von zahls.ch, dorthin wird der Kunde weitergeleitet. Die
// Bestellung entsteht ganz normal in WooCommerce — Bestätigungsmail, PodOS und
// die Pool-Buchhaltung hängen daran wie bisher.
//
// WOHER DIE REGELN KOMMEN: Pflichtfelder, Kantone und Provinzen je Land liefert
// der Shop (GET /wp-json/onefam/v1/kasse, Snippet 114) aus denselben
// WooCommerce-Einstellungen, nach denen er die Adresse am Ende selbst prüft.
//
// RECHTLICHES (Stand 21.11.2026, am Wortlaut der Gesetze geprüft): Der Bestellknopf
// trägt in jeder Sprache die Formel des Gesetzes (Art. 8 Abs. 2 RL 2011/83/EU) —
// bis zu diesem Tag stand hier der Wortlaut der WooCommerce-Kasse, der in drei
// Sprachen die Zahlung nicht nannte. Dieselben Texte setzt seither Shop-Snippet 115
// in der Kasse des Shops (docs/shop-snippets/onefam-kasse-bestellknopf.php).
// Die AGB sind die des SHOPS (Kaufbedingungen), nicht die von onefam.ch.
// Was offen ist, steht in docs/stand.md.

const SHOP = 'https://shop.onefam.ch';

export type LandRegel = {
  code: string;
  name: string;
  /** Kanton, Bundesland, Provinz … */
  region: { label: string | null; pflicht: boolean; versteckt: boolean; auswahl: { code: string; name: string }[] };
  plz: { label: string | null; pflicht: boolean; versteckt: boolean };
};

export async function holeKassenDaten(locale: Locale): Promise<LandRegel[]> {
  const antwort = await fetch(`${SHOP}/wp-json/onefam/v1/kasse?lang=${locale}`, {
    headers: { Cookie: `ofl=${locale}` },
    next: { revalidate: 300 },
  });
  if (!antwort.ok) throw new Error(`Kassendaten: ${antwort.status}`);
  return ((await antwort.json()) as { laender: LandRegel[] }).laender;
}

/**
 * Die Rechtstexte des SHOPS je Sprache — Kaufbedingungen, Datenschutz, Rückgabe und
 * Widerruf, Versand, Impressum. Am 21.11.2026 alle 20 Adressen mit 200 gemessen.
 *
 * Verlinkt wird direkt auf die Seiten. Die AGB-Adressen, die WooCommerce selbst
 * führt (/de/agb/, /fr/conditions-generales-de-vente/, /es/terminos-y-condiciones/),
 * leiten nur per 301 hierher weiter. Eine Datenschutzseite ist in WooCommerce nicht
 * hinterlegt; die Kasse des Shops zeigt das Wort deshalb ohne Link — hier ist es einer.
 *
 * Es sind die Texte des Shops und nicht die von onefam.ch (/agb, /datenschutz):
 * Jene regeln den Kauf, diese die Website und die Warteliste.
 */
export type RechtsSeite = 'agb' | 'datenschutz' | 'rueckgabe' | 'versand' | 'impressum';

const RECHTS_PFAD: Record<RechtsSeite, string> = {
  agb: 'terms-of-service',
  datenschutz: 'privacy-policy',
  rueckgabe: 'refund-policy',
  versand: 'shipping-policy',
  impressum: 'legal-notice',
};

export function rechtsAdresse(locale: Locale, seite: RechtsSeite): string {
  return `${SHOP}${locale === 'en' ? '' : `/${locale}`}/${RECHTS_PFAD[seite]}/`;
}

export function rechtsAdressen(locale: Locale): Record<RechtsSeite, string> {
  return Object.fromEntries(
    (Object.keys(RECHTS_PFAD) as RechtsSeite[]).map((s) => [s, rechtsAdresse(locale, s)]),
  ) as Record<RechtsSeite, string>;
}

/**
 * Lieferländer ausserhalb der EU-Zollunion: Dorthin kommen Einfuhrabgaben dazu,
 * die der Kunde bei der Zustellung zahlt (AGB Ziff. 3 und 7, Rückgaberichtlinie
 * Ziff. 6). Versendet wird aus Deutschland. Liechtenstein gehört zum Schweizer
 * Zollgebiet. An der Kasse steht der Hinweis genau dann, wenn in eines dieser
 * Länder geliefert wird — bei einem Kunden in Deutschland wäre er falsch.
 *
 * Grossbritannien und Norwegen standen bis 21.11.2026 mit in der Liste. Seit
 * diesem Tag liefert der Shop dorthin nicht mehr (Labis Entscheid): Der Verkäufer
 * müsste dort selbst Umsatzsteuer erheben und sich registrieren (Vereinigtes
 * Königreich bis £135 Warenwert, Norwegen VOEC). Kommen sie zurück, gehören sie
 * wieder hierher.
 */
export const LAENDER_MIT_EINFUHR = ['CH', 'LI'];

/** Empfang der Online-Widerrufserklärung im Shop (Snippet 116, docs/shop-snippets/onefam-widerruf.php). */
export const WIDERRUF_EMPFANG = `${SHOP}/wp-json/onefam/v1/widerruf`;

/**
 * WIDERRUFSRECHT FÜR KUNDEN IN DER EU UND IM EWR — vorbereitet, NICHT eingeschaltet
 * (21.11.2026).
 *
 * Die Rechtstexte des Shops schliessen die Rückgabe aus ("nach Kundenwunsch
 * angefertigt"). Labi hat am 21.11.2026 entschieden, Kunden in EU und EWR
 * 14 Tage Widerruf einzuräumen (für die Schweiz bleibt es beim Ausschluss) und
 * die Rechtsfrage vorher einem Anwalt vorzulegen. Begründung, Quellen und die
 * Entwürfe der Texte liegen nur lokal (docs/privat/, das Repo ist öffentlich).
 *
 * Solange dieser Schalter aus ist, zeigt die Kasse den Satz des Shops ("kein
 * Rückgaberecht") und es gibt keinen Link "Vertrag widerrufen". Einschalten erst,
 * wenn die Rechtstexte des Shops (AGB Ziff. 5, Rückgaberichtlinie Ziff. 1,
 * Widerrufsbelehrung mit Rücksendeadresse) umgestellt sind — sonst verspricht
 * die Kasse etwas, das die AGB verneinen (CLAUDE.md, Arbeitsregel 7).
 *
 * Die Seite /widerruf und der Empfang im Shop arbeiten unabhängig davon: Wer
 * widerruft, dessen Erklärung kommt an.
 */
export const WIDERRUF_EU_AKTIV = false;

/** EU-27 und die drei EWR-Staaten Island, Liechtenstein, Norwegen. Die Schweiz gehört nicht dazu. */
export const LAENDER_MIT_WIDERRUF = [
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'HU',
  'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
  'IS', 'LI', 'NO',
];

/** Zeigt die Kasse für dieses Lieferland das Widerrufsrecht? Massgeblich ist das Land der Lieferung. */
export function hatWiderruf(land: string): boolean {
  return WIDERRUF_EU_AKTIV && LAENDER_MIT_WIDERRUF.includes(land);
}

/** Zeichen der Zahlarten, wie die Kasse des Shops sie zeigt (Dateien des zahls-Plugins). */
export const ZAHLARTEN_BILDER = ['twint', 'mastercard', 'visa', 'apple_pay', 'google_pay'].map((name) => ({
  name,
  src: `${SHOP}/wp-content/plugins/zahls-ch-payment-gateway/cardicons/card_${name}.svg`,
}));

export type Adresse = {
  vorname: string;
  nachname: string;
  adresse1: string;
  adresse2: string;
  plz: string;
  ort: string;
  region: string;
  land: string;
  telefon: string;
};

export const LEERE_ADRESSE: Adresse = {
  vorname: '',
  nachname: '',
  adresse1: '',
  adresse2: '',
  plz: '',
  ort: '',
  region: '',
  land: '',
  telefon: '',
};

/** Welche Pflichtangaben fehlen? Dieselbe Prüfung im Formular und auf dem Server. */
export function fehlendeFelder(a: Adresse, regeln: LandRegel[]): (keyof Adresse)[] {
  const regel = regeln.find((r) => r.code === a.land);
  const fehlt: (keyof Adresse)[] = [];
  if (!regel) return ['land'];
  for (const feld of ['vorname', 'nachname', 'adresse1', 'ort'] as const) {
    if (!a[feld].trim()) fehlt.push(feld);
  }
  if (!regel.plz.versteckt && regel.plz.pflicht && !a.plz.trim()) fehlt.push('plz');
  if (!regel.region.versteckt) {
    if (regel.region.pflicht && !a.region.trim()) fehlt.push('region');
    // Wo es eine Auswahl gibt, muss der Wert aus ihr stammen.
    if (a.region && regel.region.auswahl.length > 0 && !regel.region.auswahl.some((o) => o.code === a.region)) {
      fehlt.push('region');
    }
  }
  return fehlt;
}

/** Adresse in der Form der Store API. Versteckte Felder gehen leer mit — die Schnittstelle verlangt alle Schlüssel. */
export function alsStoreAdresse(a: Adresse, regeln: LandRegel[]) {
  const regel = regeln.find((r) => r.code === a.land);
  return {
    first_name: a.vorname.trim(),
    last_name: a.nachname.trim(),
    company: '',
    address_1: a.adresse1.trim(),
    address_2: a.adresse2.trim(),
    city: a.ort.trim(),
    state: regel?.region.versteckt ? '' : a.region.trim(),
    postcode: regel?.plz.versteckt ? '' : a.plz.trim(),
    country: a.land,
    phone: a.telefon.trim(),
  };
}

/**
 * Darf der Kunde nach dem Bestellen dorthin weitergeleitet werden?
 *
 * Die Adresse kommt aus der Antwort des Shops. Trotzdem wird sie geprüft: Diese
 * Route soll niemanden auf eine beliebige fremde Seite schicken können, falls
 * dort je etwas Unerwartetes zurückkommt. Erlaubt sind das Zahlungsfenster von
 * zahls.ch (https://<name>.zahls.ch/…) und die eigene Website (Danke-Seite).
 */
export function weiterleitungErlaubt(adresse: string, eigeneAdresse: string): boolean {
  let ziel: URL;
  try {
    ziel = new URL(adresse);
  } catch {
    return false;
  }
  if (ziel.origin === eigeneAdresse) return true;
  return ziel.protocol === 'https:' && (ziel.hostname === 'zahls.ch' || ziel.hostname.endsWith('.zahls.ch'));
}
