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
// Stand jetzt gilt das NUR für die Startseite. Die Unterseiten (/join, /agb,
// /datenschutz, /archiv, /reiseziel, /login, /mein-bereich) sind weiterhin
// deutsch und liegen weiterhin ohne Präfix. Sie sind nicht übersetzt — also
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
 * `localeDetection: true` (seit 30.07.2026): Die Middleware liest die
 * Browsersprache (Accept-Language) und leitet einen Besucher mit
 * franzoesischem Browser von / auf /fr um. Wer eine Sprache im Umschalter
 * waehlt, bekommt sie im Cookie gemerkt und wird nicht mehr umgeleitet.
 *
 * Das war zunaechst bewusst AUS, aus Sorge um die Indexierung. Beim Nachdenken
 * hielt das Argument nicht:
 *   - Googlebot schickt kein Accept-Language mit und bleibt deshalb auf der
 *     englischen Fassung — fuer den Crawler aendert sich nichts.
 *   - Nur /, /agb und /datenschutz sind betroffen. Die uebrigen Unterseiten
 *     laufen an dieser Middleware vorbei (siehe OHNE_SPRACHE in middleware.ts).
 *   - Alle vier Fassungen stehen mit hreflang in der Sitemap und sind direkt
 *     erreichbar, die Weiterleitung verdeckt also keine davon.
 * Dazu kommt: Der Shop macht es seit jeher so (Snippet 28). Ein Besucher, der
 * im Shop Franzoesisch sieht und auf der Website Englisch, ist der schlechtere
 * Zustand.
 *
 * Was man im Auge behalten muss: ob /de, /fr und /es in der Search Console
 * weiterhin indexiert werden. Wenn Google anfaengt, sie als
 * "Seite mit Weiterleitung" auszuweisen, gehoert diese Zeile zurueck auf false.
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
  localeDetection: true,
});

/**
 * Adresse eines Rechtstextes in einer Sprache.
 *
 * Nur AGB und Datenschutzerklärung liegen unter app/[locale]/. Die übrigen
 * Unterseiten (/join, /archiv, /reiseziel, /login, /mein-bereich) sind
 * weiterhin nur auf Deutsch und behalten ihre Adresse ohne Präfix — eine
 * Adresse /fr/join, die deutschen Text ausliefert, wäre eine Falschaussage
 * gegenüber Besuchern und gegenüber Google.
 */
export function legalPath(locale: Locale, seite: 'agb' | 'datenschutz'): string {
  return locale === DEFAULT_LOCALE ? `/${seite}` : `/${locale}/${seite}`;
}
