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
// AUSNAHME ALBANIEN (seit 22.11.2026): Die Datei kommt NICHT aus tools/zeichen-ausschnitt.py,
// sondern ist ein Nahfoto des STICKS auf schwarzem Fleece, aus
// ~/Projekte/onefam-material/mockups/zeichen-stick/albania.webp (dort auch LIESMICH.md).
// Labis Entscheid vom 22.11.2026: Die Kachel zeigt den Stick als realistisches Nahfoto statt
// des Hoodie-Drucks. Bei Albanien ist der Hoodie bedruckt, Shirt und Sweater sind bestickt —
// die Kachel zeigt bewusst den Stick. Format wie die anderen: 800 x 1000, WebP mit
// Durchsichtigkeit, ovaler Auslauf. Das Werkzeug weigert sich deshalb, albania.webp zu
// überschreiben; wer das Foto ersetzt, kopiert die neue Datei von Hand hierher.
// Weitere Stick-Kacheln (San Marino liegt bereit) kommen dazu, sobald das Land Produkte hat.
//
// Schlüssel ist der Kategorie-Slug des Shops (derselbe wie in lib/shop/laender.ts).

export const ZEICHENBILD: Record<string, string> = {
  afghanistan: '/shop/zeichen/afghanistan.webp',
  albania: '/shop/zeichen/albania.webp',
  andorra: '/shop/zeichen/andorra.webp',
  argentina: '/shop/zeichen/argentina.webp',
};
