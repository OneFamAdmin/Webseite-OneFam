import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from './routing';

// i18n/geo.ts
//
// Welche Sprache bekommt ein Besucher, der zum ersten Mal auf onefam.ch landet?
//
// Vorher entschied das allein `Accept-Language`, also die Spracheinstellung des
// Browsers. Das griff zu kurz: Sehr viele Geräte sind ab Werk auf Englisch
// eingestellt, auch in Deutschland, Frankreich oder Argentinien. Ein deutscher
// Besucher mit englischem Telefon sah die englische Fassung, obwohl es eine
// deutsche gibt.
//
// Deshalb jetzt zwei Signale statt einem, in dieser Reihenfolge:
//
//   1. Eigene Wahl (Cookie NEXT_LOCALE) — schlägt alles.
//   2. Browsersprache, ABER nur wenn sie Deutsch, Französisch oder Spanisch
//      sagt. Wer sein Gerät bewusst auf Französisch stellt, will Französisch,
//      egal wo er gerade ist.
//   3. Herkunftsland aus der IP (Vercel-Header). Greift genau dann, wenn Signal
//      2 nichts hergibt — also bei englischen und bei nicht unterstützten
//      Browsersprachen (Arabisch, Niederländisch, Italienisch …).
//   4. Englisch.
//
// Warum die Browsersprache VOR dem Land kommt: Ein Deutscher im Urlaub in
// Argentinien liest weiterhin Deutsch. Das Land beschreibt, wo jemand ist —
// die Browsersprache, was er liest. Die Reihenfolge ist bewusst.
//
// Und warum Englisch im Schritt 2 NICHT gewinnt: Sonst wäre Schritt 3 wirkungs-
// los, denn genau die Geräte mit englischer Voreinstellung sind der Grund für
// die Landeserkennung. Wer wirklich Englisch will, wählt es einmal im
// Umschalter — dann merkt es sich das Cookie für ein Jahr.
//
// Für Googlebot ändert sich nichts: Der Crawler schickt kein Accept-Language
// und kommt aus den USA. Beide Signale zeigen auf Englisch, er bleibt also auf
// der präfixlosen Fassung. Genau wie vorher.

/** Cookie, in dem die bewusste Wahl des Besuchers steht. Name von next-intl. */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

/** Ein Jahr. Wer einmal gewählt hat, soll nicht bei jedem Besuch neu wählen. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Header, in den Vercel das aus der IP ermittelte Land schreibt (ISO-3166-1 alpha-2). */
export const COUNTRY_HEADER = 'x-vercel-ip-country';

/**
 * Land → Sprache.
 *
 * Nur Länder, die NICHT auf Englisch laufen sollen, stehen hier. Alles
 * Übrige fällt auf Englisch — inklusive USA, Grossbritannien, Irland,
 * Australien, Neuseeland, Indien, Kanada.
 *
 * Kanada steht bewusst nicht drin: Québec-Besucher haben in aller Regel einen
 * französischen Browser und werden schon über Signal 2 abgeholt.
 */
export const COUNTRY_LOCALE: Record<string, Locale> = {
  // ---- Deutsch ----
  DE: 'de', // Deutschland
  AT: 'de', // Österreich
  CH: 'de', // Schweiz — Vorgabe Deutsch. Romands und Tessiner mit
  //            französischem bzw. italienischem Browser landen über Signal 2
  //            auf Französisch bzw. (mangels Italienisch) auf Deutsch.
  LI: 'de', // Liechtenstein

  // ---- Französisch ----
  FR: 'fr',
  BE: 'fr', // Belgien — Vorgabe Französisch, so gewünscht. Flämische Besucher
  //            mit niederländischem Browser haben keine eigene Fassung.
  LU: 'fr',
  MC: 'fr',
  // Maghreb und frankophones Afrika
  MA: 'fr', // Marokko
  TN: 'fr', // Tunesien
  DZ: 'fr', // Algerien
  SN: 'fr', // Senegal
  CI: 'fr', // Côte d'Ivoire
  ML: 'fr', // Mali
  BF: 'fr', // Burkina Faso
  NE: 'fr', // Niger
  TD: 'fr', // Tschad
  TG: 'fr', // Togo
  BJ: 'fr', // Benin
  GN: 'fr', // Guinea
  CG: 'fr', // Republik Kongo
  CD: 'fr', // DR Kongo
  CM: 'fr', // Kamerun
  GA: 'fr', // Gabun
  CF: 'fr', // Zentralafrikanische Republik
  DJ: 'fr', // Dschibuti
  KM: 'fr', // Komoren
  MG: 'fr', // Madagaskar
  MR: 'fr', // Mauretanien
  RW: 'fr', // Ruanda
  BI: 'fr', // Burundi
  SC: 'fr', // Seychellen
  MU: 'fr', // Mauritius
  // Frankreich in Übersee und frankophone Karibik
  HT: 'fr', // Haiti
  GP: 'fr', // Guadeloupe
  MQ: 'fr', // Martinique
  GF: 'fr', // Französisch-Guayana
  RE: 'fr', // Réunion
  YT: 'fr', // Mayotte
  NC: 'fr', // Neukaledonien
  PF: 'fr', // Französisch-Polynesien
  PM: 'fr', // Saint-Pierre und Miquelon
  BL: 'fr', // Saint-Barthélemy
  MF: 'fr', // Saint-Martin
  WF: 'fr', // Wallis und Futuna
  VU: 'fr', // Vanuatu

  // ---- Spanisch ----
  ES: 'es', // Spanien
  AD: 'es', // Andorra (katalanisch, spanischnah — und wir verkaufen dorthin)
  // Süd- und Mittelamerika
  AR: 'es', // Argentinien
  BO: 'es',
  CL: 'es',
  CO: 'es',
  EC: 'es', // Ecuador
  PE: 'es', // Peru
  PY: 'es',
  UY: 'es',
  VE: 'es',
  SR: 'es', // Suriname — niederländischsprachig, aber ohne eigene Fassung; in
  //            Südamerika ist Spanisch die brauchbarere Rückfallebene.
  //            Guyana (GY) steht bewusst NICHT hier: dort ist Englisch Amtssprache.
  MX: 'es',
  GT: 'es',
  HN: 'es',
  SV: 'es',
  NI: 'es',
  CR: 'es',
  PA: 'es',
  CU: 'es',
  DO: 'es',
  PR: 'es',
  GQ: 'es', // Äquatorialguinea
  // Portugiesischsprachig — bewusst auf Spanisch, nicht auf Englisch.
  // Entscheidung vom 31.07.2026: Portugiesischsprachige verstehen Spanisch in
  // aller Regel besser als Englisch. Wenn sich das als falsch erweist, sind es
  // diese vier Zeilen.
  BR: 'es', // Brasilien
  PT: 'es', // Portugal
  AO: 'es', // Angola
  MZ: 'es', // Mosambik
};

/**
 * Land → Sprache. Unbekanntes oder fehlendes Land ergibt `null`, nicht die
 * Standardsprache — der Aufrufer soll den Unterschied zwischen "kein Signal"
 * und "Signal sagt Englisch" sehen können.
 */
export function localeFromCountry(land: string | null | undefined): Locale | null {
  if (!land) return null;
  return COUNTRY_LOCALE[land.toUpperCase()] ?? null;
}

/**
 * Erste unterstützte Sprache aus einem `Accept-Language`-Header.
 *
 * Beachtet die Gewichtung (`q=`) und Regionalvarianten: `de-CH` zählt als `de`,
 * `es-419` als `es`. Ohne Treffer `null`.
 */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;

  const eintraege = header
    .split(',')
    .map((teil) => {
      const [tag, ...rest] = teil.trim().split(';');
      const q = rest
        .map((r) => r.trim())
        .find((r) => r.startsWith('q='));
      const gewicht = q ? Number.parseFloat(q.slice(2)) : 1;
      return {
        basis: tag.trim().toLowerCase().split('-')[0],
        gewicht: Number.isFinite(gewicht) ? gewicht : 0,
      };
    })
    .filter((e) => e.basis && e.gewicht > 0)
    .sort((a, b) => b.gewicht - a.gewicht);

  for (const eintrag of eintraege) {
    if ((LOCALES as readonly string[]).includes(eintrag.basis)) {
      return eintrag.basis as Locale;
    }
  }
  return null;
}

/**
 * Die eigentliche Entscheidung. Reihenfolge siehe Kopf dieser Datei.
 *
 * Gibt zusätzlich zurück, WELCHES Signal entschieden hat — das ist beim
 * Nachmessen Gold wert und landet als Antwort-Header `x-onefam-locale-quelle`
 * in der Middleware.
 */
export function detectLocale(signale: {
  cookie?: string | null;
  acceptLanguage?: string | null;
  country?: string | null;
}): { locale: Locale; quelle: 'cookie' | 'browser' | 'land' | 'standard' } {
  if (isLocale(signale.cookie)) {
    return { locale: signale.cookie, quelle: 'cookie' };
  }

  const ausBrowser = localeFromAcceptLanguage(signale.acceptLanguage);
  if (ausBrowser && ausBrowser !== DEFAULT_LOCALE) {
    return { locale: ausBrowser, quelle: 'browser' };
  }

  const ausLand = localeFromCountry(signale.country);
  if (ausLand) {
    return { locale: ausLand, quelle: 'land' };
  }

  return { locale: DEFAULT_LOCALE, quelle: 'standard' };
}
