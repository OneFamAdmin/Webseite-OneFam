// Gemeinsame Werte der Warteliste (doppelte Bestätigung, 18.10.2026).
//
// Eigene Datei, weil app/actions/join.ts eine 'use server'-Datei ist und dort
// nur asynchrone Funktionen exportiert werden dürfen — die Seiten unter
// app/[locale]/join/ brauchen dieselben Werte.

import { DEFAULT_LOCALE, type Locale } from '@/i18n/routing';
import { SITE_URL } from '@/lib/seo';

/** Wie lange der Bestätigungslink gilt — derselbe Wert wie im Shop (Snippet 18). */
export const GUELTIG_TAGE = 30;

/** Frühestens nach so vielen Minuten geht für dieselbe Adresse eine neue Mail raus. */
export const SPERRE_MINUTEN = 10;

/** Tokens sind 24 Zufallsbytes in base64url, also 32 Zeichen. Alles deutlich Längere ist Müll. */
export const TOKEN_MAX = 64;

/** Pfad einer Unterseite von /join in einer Sprache (Englisch ohne Präfix). */
export function joinUnterpfad(locale: Locale, seite: 'bestaetigt' | 'abmelden'): string {
  return `${locale === DEFAULT_LOCALE ? '' : `/${locale}`}/join/${seite}`;
}

/** Vollständige Adresse für einen Link in der Mail. */
export function joinUnterLink(locale: Locale, seite: 'bestaetigt' | 'abmelden', token: string): string {
  return `${SITE_URL}${joinUnterpfad(locale, seite)}?t=${encodeURIComponent(token)}`;
}
