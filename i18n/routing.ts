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
