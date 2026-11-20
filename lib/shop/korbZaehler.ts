// lib/shop/korbZaehler.ts — nur im Browser benutzen.
//
// Wie viele Teile liegen im Warenkorb? Die Zahl am Warenkorb-Symbol der
// Kopfzeile (seit 21.11.2026).
//
// Sie wird NICHT bei jedem Seitenaufruf beim Shop erfragt: Das wäre eine
// Anfrage an WordPress (gemessen rund 0,6 s) auf jeder Shop-Seite, nur für eine
// Ziffer — und genau diese Anfragen spart der Umzug auf onefam.ch ein. Statt
// dessen merkt sich der Browser die Zahl aus der letzten Antwort des
// Warenkorbs: nach "In den Warenkorb" und bei jedem Öffnen oder Ändern des
// Warenkorbs. Verbindlich ist immer die Warenkorb-Seite; die Ziffer ist eine
// Gedächtnisstütze und kann nach 48 Stunden (dann räumt WooCommerce den
// Warenkorb ab) höchstens zu hoch stehen, bis man den Warenkorb öffnet.

const SCHLUESSEL = 'of_korb_anzahl';
export const KORB_EREIGNIS = 'of-korb';

export function leseKorbAnzahl(): number {
  try {
    const zahl = Number(window.localStorage.getItem(SCHLUESSEL));
    return Number.isInteger(zahl) && zahl > 0 ? zahl : 0;
  } catch {
    // Privates Fenster oder gesperrter Speicher: dann eben ohne Ziffer.
    return 0;
  }
}

export function merkeKorbAnzahl(anzahl: number) {
  try {
    window.localStorage.setItem(SCHLUESSEL, String(Math.max(0, anzahl)));
  } catch {
    // siehe oben
  }
  window.dispatchEvent(new CustomEvent(KORB_EREIGNIS));
}
