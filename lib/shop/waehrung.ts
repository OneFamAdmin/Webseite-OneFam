import type { Waehrung } from './typen';

// lib/shop/waehrung.ts
//
// Welche Währung sieht ein Besucher? Dieselbe Regel wie im Shop (Snippet 25,
// of_target_currency) — die Seite und die Kasse dürfen nie verschiedene
// Währungen zeigen:
//
//   1. Zeitzone des Geräts, im Cookie `of_geo` ('ch' oder 'x').
//      Europe/Zurich und Europe/Vaduz → CHF, alles andere → EUR.
//   2. Fehlt das Cookie (erster Aufruf, noch kein JavaScript): IP-Land CH/LI → CHF.
//   3. Sonst Browsersprache mit "-CH" (de-CH, fr-CH …) → CHF.
//   4. Sonst EUR.
//
// Die Währung folgt also dem GERÄT, nicht dem Standort: Ein Schweizer mit
// Schweizer Telefon in Deutschland sieht CHF. Absicht, kein Fehler (CLAUDE.md).
//
// Das Cookie heisst bewusst genauso wie im Shop. Es liegt aber auf onefam.ch,
// eine andere Domain — die beiden Cookies sehen sich nicht. Deshalb gibt
// onefam.ch die Entscheidung dem Shop bei jeder Warenkorb-Anfrage ausdrücklich
// mit (lib/shop/storeApi.ts).

export const GEO_COOKIE = 'of_geo';

const SCHWEIZER_ZEITZONEN = ['Europe/Zurich', 'Europe/Vaduz'];

export function geoAusZeitzone(zeitzone: string | undefined | null): 'ch' | 'x' {
  return zeitzone && SCHWEIZER_ZEITZONEN.includes(zeitzone) ? 'ch' : 'x';
}

export function waehrungFuer({
  geo,
  land,
  sprache,
}: {
  geo?: string | null;
  land?: string | null;
  sprache?: string | null;
}): Waehrung {
  if (geo === 'ch') return 'CHF';
  if (geo === 'x') return 'EUR';
  if (land && ['CH', 'LI'].includes(land.toUpperCase())) return 'CHF';
  if (sprache && /-CH\b/i.test(sprache)) return 'CHF';
  return 'EUR';
}

/** Betrag in Hauptwährung, z. B. 75 → "CHF 75.00", 69.99 → "69,99 €". */
export function preisText(betrag: number, waehrung: Waehrung | string, locale: string): string {
  // CHF wie im Shop und in der Schweiz üblich mit Punkt ("CHF 75.00"),
  // EUR in der Schreibweise der jeweiligen Sprache.
  const format = waehrung === 'CHF' ? 'de-CH' : locale === 'en' ? 'en-IE' : locale;
  return new Intl.NumberFormat(format, { style: 'currency', currency: waehrung }).format(betrag);
}
