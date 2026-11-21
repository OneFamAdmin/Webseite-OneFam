import { defineRouting } from 'next-intl/routing';

// i18n/routing.ts
//
// Eine Stelle für alles, was mit Sprachen zu tun hat. Vorher stand die Sprache
// fest auf 'de' in i18n/request.ts, es gab genau eine Übersetzungsdatei und
// keine Sprachrouten.
//
// Adressmodell — bewusst genauso wie im Shop (shop.onefam.ch):
//   /            Englisch  (Standard, ohne Präfix)
//   /de  /fr  /es          mit Präfix
// So heisst dieselbe Sprache auf beiden Systemen gleich, und ein Besucher, der
// vom Shop herüberkommt, landet nicht in einer anderen Sprache.
//
// Viersprachig sind Startseite, /join, /agb, /datenschutz und /impressum. Die
// übrigen Unterseiten (/archiv, /login, /mein-bereich, /join/bestaetigen) sind
// weiterhin deutsch und liegen ohne Präfix. Sie sind nicht übersetzt — also
// behaupten wir es auch nicht. Wenn sie übersetzt werden, ziehen sie unter
// app/[locale]/ um; dieses Modul bleibt dabei unverändert.

export const LOCALES = ['en', 'de', 'fr', 'es'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Die Middleware schreibt die erkannte Sprache in diesen Request-Header, das
 * Layout und i18n/request.ts lesen sie wieder heraus. Der Umweg über einen
 * Header ist nötig, weil <html lang> im Root-Layout steht und ein Root-Layout
 * die Parameter einer darunterliegenden dynamischen Route nicht sehen kann.
 */
export const LOCALE_HEADER = 'x-onefam-locale';

export function isLocale(wert: string | null | undefined): wert is Locale {
  return !!wert && (LOCALES as readonly string[]).includes(wert);
}

/** '/de' und '/de/irgendwas' → 'de'. Alles andere → Standardsprache. */
export function localeFromPath(pathname: string): Locale {
  const erstesSegment = pathname.split('/')[1];
  return isLocale(erstesSegment) ? erstesSegment : DEFAULT_LOCALE;
}

/** Wert für <html lang="…">. */
export const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  de: 'de',
  fr: 'fr',
  es: 'es',
};

/** Wert für og:locale in der Link-Vorschau. */
export const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  de: 'de_CH',
  fr: 'fr_CH',
  es: 'es_ES',
};

/** Klartextname für den Sprachumschalter — jeweils in der eigenen Sprache. */
export const LOCALE_NAME: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
};

/** Pfad der Startseite in einer Sprache. Englisch ohne Präfix. */
export function homePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/' : `/${locale}`;
}

const SHOP_BASE = 'https://shop.onefam.ch';

/**
 * Der Shop folgt seit dem 30.07.2026 selbst der Sprache, aber nur auf der
 * präfixlosen Adresse. Ein Präfix erzwingt die Sprache — deshalb hier bewusst
 * pro Sprache verlinken statt immer auf /de/, wie es vorher an vier Stellen
 * fest im Code stand. Ein französischer Besucher landete damit im deutschen Shop.
 */
export function shopUrl(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? `${SHOP_BASE}/` : `${SHOP_BASE}/${locale}/`;
}

/**
 * Routing-Beschreibung fuer die next-intl-Middleware.
 *
 * `localePrefix: 'as-needed'` heisst: Die Standardsprache laeuft OHNE Praefix,
 * alle anderen mit. Die Middleware schreibt /agb intern auf /en/agb um — nach
 * aussen bleibt die Adresse /agb. Genau dieses Modell hat auch der Shop.
 *
 * `localeDetection: false` (seit 31.07.2026) — und das ist KEINE Rueckkehr zum
 * Zustand vor dem 30.07.
 *
 * Vom 30.07. bis 31.07. stand hier `true`. Damit erledigte next-intl die
 * Spracherkennung selbst, allerdings ausschliesslich ueber `Accept-Language`.
 * Das griff zu kurz: Sehr viele Geraete sind ab Werk englisch eingestellt, auch
 * in Deutschland oder Argentinien. Diese Besucher sahen Englisch, obwohl es
 * ihre Sprache gibt.
 *
 * Seit dem 31.07. entscheidet die Middleware selbst, aus ZWEI Signalen:
 * Browsersprache UND Herkunftsland (Vercel-IP-Header). Die Regeln und die
 * Land-Sprache-Tabelle stehen in i18n/geo.ts. Diese Zeile muss deshalb auf
 * `false` stehen — sonst wuerde next-intl zusaetzlich umleiten und die eigene
 * Entscheidung ueberschreiben.
 *
 * Die Erwaegung zur Indexierung gilt unveraendert:
 *   - Googlebot schickt kein Accept-Language mit und kommt aus den USA. Beide
 *     Signale zeigen auf Englisch, der Crawler bleibt auf der praefixlosen
 *     Fassung — fuer ihn aendert sich nichts.
 *   - Nur /, /agb und /datenschutz sind betroffen. Die uebrigen Unterseiten
 *     laufen an dieser Middleware vorbei (siehe OHNE_SPRACHE in middleware.ts).
 *   - Alle vier Fassungen stehen mit hreflang in der Sitemap und sind direkt
 *     erreichbar, die Weiterleitung verdeckt also keine davon.
 *
 * Was man im Auge behalten muss: ob /de, /fr und /es in der Search Console
 * weiterhin indexiert werden. Wenn Google anfaengt, sie als
 * "Seite mit Weiterleitung" auszuweisen, gehoert die Umleitung in
 * middleware.ts abgeschaltet — nicht diese Zeile veraendert.
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
  localeDetection: false,
  // Keine hreflang-Angaben im HTTP-Kopf (19.11.2026). next-intl schrieb dort für
  // Englisch https://onefam.ch/ MIT Schrägstrich, das HTML (lib/seo.ts) und der
  // Canonical nennen https://onefam.ch OHNE. Zwei Quellen mit verschiedenen Adressen
  // für dieselbe Aussage — Google muss raten, welche gilt. Die hreflang-Angaben
  // stehen vollständig im HTML und in der Sitemap; das reicht.
  alternateLinks: false,
});

/**
 * Adresse eines Rechtstextes in einer Sprache.
 *
 * AGB, Datenschutzerklärung, /join und seit dem 10.08.2026 auch das Impressum
 * liegen unter app/[locale]/. Die übrigen Unterseiten (/archiv, /login,
 * /mein-bereich, /join/bestaetigen) sind weiterhin nur auf Deutsch und behalten
 * ihre Adresse ohne Präfix — eine Adresse /fr/login, die deutschen Text
 * ausliefert, wäre eine Falschaussage gegenüber Besuchern und gegenüber Google.
 */
export function legalPath(locale: Locale, seite: 'agb' | 'datenschutz' | 'impressum'): string {
  return locale === DEFAULT_LOCALE ? `/${seite}` : `/${locale}/${seite}`;
}

/**
 * Adresse der Anmeldeseite in einer Sprache. Seit dem 09.08.2026 liegt /join
 * unter app/[locale]/ und ist in allen vier Sprachen vorhanden.
 *
 * /join/bestaetigen bleibt bewusst aussen vor: Der Link darauf steht in bereits
 * verschickten Bestätigungsmails und darf seine Adresse nicht ändern.
 */
export function joinPath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/join' : `/${locale}/join`;
}

/**
 * SCHALTER: Führt "Shop" auf onefam.ch selbst oder noch auf shop.onefam.ch?
 *
 * Der Shop wird auf onefam.ch aufgebaut (docs/plan-zusammenfuehrung-onefam.md).
 * Solange die Kasse dort fehlt, darf die Navigation der Live-Seite niemanden in
 * einen Shop schicken, in dem man nicht bezahlen kann. Deshalb zeigt "Shop"
 * (Kopfzeile, Fusszeile, die beiden Knöpfe der Startseite) nur dann auf
 * /shop-by-country, wenn NEXT_PUBLIC_SHOP_AUF_ONEFAM=1 gesetzt ist — lokal in
 * .env.local, auf Vercel erst zum Livegang (das trägt Labi ein). Ohne die
 * Variable bleibt alles, wie es war: "Shop" führt auf shop.onefam.ch.
 *
 * SEIT 21.11.2026 SPERRT DER SCHALTER AUCH DIE SEITEN SELBST: Ohne ihn antworten
 * Länderseiten, Produktseiten, /shop-by-country, /warenkorb, /kasse, /danke und
 * die Routen unter /api/shop mit 404. Anlass: Für die Widerrufsfunktion (/widerruf)
 * musste der Stand auf die Live-Seite, die Kasse war da aber noch nicht mit einem
 * echten Kauf geprüft — sie soll nicht über eine erratene Adresse benutzbar sein.
 * /widerruf ist bewusst NICHT gesperrt.
 *
 * NEXT_PUBLIC_* wird beim Bauen eingebacken: Umschalten heisst neu deployen.
 */
export const SHOP_AUF_ONEFAM = process.env.NEXT_PUBLIC_SHOP_AUF_ONEFAM === '1';

/** Die Übersicht "Nach Land shoppen" — dieselbe Adresse wie im Shop. */
export function shopByCountryPfad(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/shop-by-country' : `/${locale}/shop-by-country`;
}

/** Wohin "Shop" führt, und ob das eine fremde Adresse ist (siehe SHOP_AUF_ONEFAM). */
export function shopEinstieg(locale: Locale): { href: string; extern: boolean } {
  return SHOP_AUF_ONEFAM
    ? { href: shopByCountryPfad(locale), extern: false }
    : { href: shopUrl(locale), extern: true };
}

/**
 * Shop-Seiten auf onefam.ch (Probeaufbau seit 20.11.2026, Plan:
 * docs/plan-zusammenfuehrung-onefam.md). Englisch ohne Präfix wie überall.
 */
export function produktPfad(locale: Locale, slug: string): string {
  return locale === DEFAULT_LOCALE ? `/produkt/${slug}` : `/${locale}/produkt/${slug}`;
}

/**
 * Länderseiten und Kollektionen liegen direkt unter der Sprache — /de/albania,
 * /logo-black — genau wie heute im Shop. So lassen sich die alten Shop-Adressen
 * später eins zu eins umleiten.
 */
export function kategoriePfad(locale: Locale, slug: string): string {
  return locale === DEFAULT_LOCALE ? `/${slug}` : `/${locale}/${slug}`;
}

/** Kasse und die Seite nach der Zahlung. Snippet 114 im Shop leitet nach der Zahlung auf genau /danke und /warenkorb. */
export function kassePfad(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/kasse' : `/${locale}/kasse`;
}

export function dankePfad(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/danke' : `/${locale}/danke`;
}

export function warenkorbPfad(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/warenkorb' : `/${locale}/warenkorb`;
}

/** Die Widerrufsfunktion nach Art. 11a RL 2011/83/EU ("Vertrag widerrufen"), siehe lib/shop/kasse.ts. */
export function widerrufPfad(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/widerruf' : `/${locale}/widerruf`;
}

/**
 * Pfade, die NICHT unter app/[locale]/ liegen und deshalb kein Sprachpraefix
 * tragen. Sie sind bewusst nur auf Deutsch zu haben.
 *
 * Diese Liste stand bis zum 08.09.2026 in middleware.ts. Sie ist hierher
 * gezogen, weil sie an zwei Stellen gebraucht wird: die Middleware fuehrt diese
 * Pfade an next-intl vorbei, und die Kopfzeile blendet auf ihnen den
 * Sprachumschalter aus. Zwei Kopien derselben Liste waeren genau die Art
 * doppelt gebauter Loesung, die frueher oder spaeter auseinanderlaeuft.
 *
 * Wer hier etwas eintraegt oder herausnimmt, aendert damit beides.
 */
export const OHNE_SPRACHE = [
  '/admin',
  '/api',
  '/auth',
  '/join/bestaetigen',
  '/archiv',
  '/login',
  '/mein-bereich',
];

/**
 * Dasselbe fuer die beiden Metadaten-Routen aus app/robots.ts und
 * app/sitemap.ts. Sie liegen ebenfalls ausserhalb von app/[locale]/ und wurden
 * beim ersten Anlauf still zu /en/sitemap.xml umgeschrieben — Ergebnis: die
 * Sitemap, die gerade erst in der Search Console eingereicht wurde, antwortete
 * mit 404. Genau die Art Fehler, die niemandem auffaellt, weil man Seiten
 * prueft und Metadaten-Routen vergisst.
 *
 * Seit 19.11.2026 auch /llms.txt und /llms-full.txt (app/llms*.txt/route.ts).
 * Vorher leitete die Middleware /llms.txt nach /de/llms.txt um — 404.
 */
export const DATEIEN_OHNE_SPRACHE = [
  '/sitemap.xml',
  '/robots.txt',
  '/llms.txt',
  '/llms-full.txt',
  // Seit 19.11.2026 (app/manifest.ts). Vorher leitete /manifest.webmanifest auf
  // /de/manifest.webmanifest um und endete mit 404.
  '/manifest.webmanifest',
];

/** Liegt dieser Pfad ausserhalb der Sprachstruktur? */
export function istOhneSprache(pfad: string): boolean {
  if (DATEIEN_OHNE_SPRACHE.includes(pfad)) return true;
  return OHNE_SPRACHE.some((p) => pfad === p || pfad.startsWith(`${p}/`));
}

/**
 * Kopfzeile, mit der die Middleware dem Wurzel-Layout meldet: diese Anfrage
 * geht auf eine Seite ausserhalb der Sprachstruktur.
 *
 * Der Umweg ueber eine Kopfzeile ist noetig, weil app/layout.tsx eine
 * Server-Komponente ist und keinen Zugriff auf den Pfad hat — usePathname()
 * gibt es nur im Browser.
 */
export const PFAD_OHNE_SPRACHE_HEADER = 'x-onefam-ohne-sprache';

/**
 * Die Sprache der Seiten ausserhalb von app/[locale]/.
 *
 * Sie sind alle auf Deutsch geschrieben — /login, /mein-bereich, /archiv,
 * /join/bestaetigen. Wer eine davon uebersetzt, schiebt sie unter
 * app/[locale]/ und nimmt sie aus OHNE_SPRACHE; dieser Wert wird dann fuer
 * sie nicht mehr gebraucht.
 */
export const SPRACHE_OHNE_PRAEFIX: Locale = 'de';
