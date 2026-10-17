// Länderwunsch auf der Warteliste (Migration 0016).
//
// Bewusst NICHT lib/geo/data.ts: das ist eine kuratierte Auswahl von
// Reisezielen fürs (geparkte) Reiseziel-Voting, nur mit deutschen Namen. Albanien
// und Kosovo — der erste Drop und seine grösste Zielgruppe — fehlen dort. Hier
// geht es um Kleidung, also um alle Länder.
//
// Die Namen kommen aus Intl.DisplayNames und werden auf dem SERVER erzeugt (die
// /join-Seite reicht sie ans Formular weiter). Im Browser erzeugt, könnten sie
// von der Node-ICU abweichen („Türkei"/„Türkiye") und einen Hydrationsfehler
// auslösen.

// ISO 3166-1 alpha-2 ohne die unbewohnten Gebiete (AQ, BV, GS, HM, IO, TF, UM),
// dazu XK für Kosovo.
const CODES = [
  'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ',
  'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR',
  'BS', 'BT', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM',
  'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ',
  'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB',
  'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GT', 'GU', 'GW',
  'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IQ', 'IR', 'IS', 'IT',
  'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ',
  'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME',
  'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV',
  'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU',
  'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW',
  'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI',
  'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD',
  'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG',
  'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'XK', 'YE', 'YT',
  'ZA', 'ZM', 'ZW',
] as const;

const GUELTIG = new Set<string>(CODES);

export type LandOption = { code: string; name: string };

/** Gibt den Code zurück, wenn er auf der Liste steht — sonst null. Was das
 *  Formular schickt, ist Besuchereingabe und wird nicht ungeprüft gespeichert. */
export function pruefeLandwunsch(roh: unknown): string | null {
  const code = String(roh ?? '').trim().toUpperCase();
  return GUELTIG.has(code) ? code : null;
}

/** Alle Länder mit Namen in der Sprache der Seite, alphabetisch nach dieser Sprache. */
export function laenderOptionen(locale: string): LandOption[] {
  const namen = new Intl.DisplayNames([locale], { type: 'region' });
  const sortierung = new Intl.Collator(locale);
  return CODES.map((code) => ({ code, name: namen.of(code) ?? code })).sort((a, b) =>
    sortierung.compare(a.name, b.name),
  );
}

/** Ländername für die Admin-Übersicht. */
export function landName(code: string, locale = 'de'): string {
  return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code;
}
