// lib/shop/zeichenbilder.ts
//
// Welches Bild zeigt die Karte eines Landes unter "Jetzt verfügbar" auf der
// Übersicht "Nach Land shoppen"?
//
// Bis 22.11.2026 das Produktbild aus WooCommerce: der ganze schwarze Hoodie. Vier
// Länder nebeneinander waren vier fast gleiche Hoodies, das Zeichen rund 15 % der
// Karte breit — zu klein, um die Länder zu unterscheiden (Befund 4 der Durchsicht
// vom 21.11.2026). Jetzt steht das Zeichen gross, so wie es auf dem Stoff sitzt:
// ein fester Ausschnitt der Brust aus dem freihängenden 4k-Bild, oval auslaufend.
// Vorbilder (awwwards, am 22.11.2026 mit Labi angesehen): Unimatic — viele fast
// gleiche schwarze Stücke —, Thebe Magugu — jede Kollektion ein eigenes Ding.
//
// Die Dateien liegen in public/shop/zeichen/ und kommen aus
// tools/zeichen-ausschnitt.py (ein Befehl je Land, nichts wird neu erzeugt).
// EIN NEUES LAND: Datei erzeugen und hier eintragen. Ohne Eintrag zeigt die
// Übersicht wie früher das Produktbild im hellen Kasten — sichtbar falsch, aber
// nicht kaputt.
//
// Schlüssel ist der Kategorie-Slug des Shops (derselbe wie in lib/shop/laender.ts).

export const ZEICHENBILD: Record<string, string> = {
  afghanistan: '/shop/zeichen/afghanistan.webp',
  albania: '/shop/zeichen/albania.webp',
  andorra: '/shop/zeichen/andorra.webp',
  argentina: '/shop/zeichen/argentina.webp',
};
