// Der OneFam-Markenverlauf — direkt aus logo-face-gradient.svg uebernommen
// (Gold → Orange → Pink → Magenta → Violett). Einzige Quelle, damit Logo,
// Gesichtsmarke und Pool-Zahl nie auseinanderlaufen. Die Stufen nicht einbetten.
export const BRAND_GRADIENT =
  'linear-gradient(135deg, #FAD649 0%, #EF8031 28%, #EB356A 55%, #C131BF 78%, #6B46F1 100%)';

// Der Knopfverlauf — dieselben fuenf Markenfarben, nur anders verteilt.
//
// WARUM ES IHN GIBT (24.09.2026): Auf dem Markenverlauf mit den Originalstufen
// erreicht dunkler Text #0A0A0A **4,31 : 1** — unter dem Mindestwert 4,5 : 1.
// Weisser Text ist keine Loesung, der scheitert am gelben Anfang #FAD649 mit
// 1,6 : 1. Mit den Stufen unten sind es **4,96 : 1**.
//
// WIE RICHTIG GEMESSEN WIRD — der Punkt, an dem ich selbst erst danebenlag:
// **Nicht das Verlaufsende pruefen.** Bei 135 Grad sitzt die letzte Farbe in der
// unteren rechten Ecke, wo gar keine Schrift steht. Am Ende waeren es 3,56 : 1,
// und mit dieser Zahl wurde der Verlauf zuerst faelschlich als unbrauchbar
// verworfen. Massgeblich ist der schlechteste Punkt **hinter der Schrift**: die
// liegt bei einem 173x56-Knopf nur zwischen 25 % und 75 % der Verlaufslinie.
//
// WAS DIE VERSCHIEBUNG MACHT: Magenta und Violett bleiben vollstaendig
// erhalten, ruecken aber in die Ecke. Vorher lagen 45 % der Linie hinter Pink,
// jetzt 22 %. Mit blossem Auge kaum ein Unterschied — aber er besteht die
// Pruefung. Farben wegzulassen war der falsche Weg; eine dreistufige Fassung
// sah sichtbar flacher aus und wurde verworfen.
//
// WARUM NICHT KNAPPER: der kleinere Knopf in der Kopfzeile (149x52) ist der
// schlechteste Fall, nicht der grosse im Hero — bei kurzer Verlaufslinie reicht
// die Schrift weiter ins Dunkle, bis t = 0,776. Eine Zwischenfassung mit
// 35/70/85 ergab dort **4,484** und waere durchgefallen. Wer die Stufen
// verschiebt, misst am **kleinsten** Knopf nach.
//
// SHOP: shop.onefam.ch fuehrt dieselbe Rampe als `--of-grad-cta`. Beide Seiten
// tragen denselben Knopf — das war der Zweck der Angleichung. Wer hier etwas
// aendert, zieht sie dort nach.
//
// WER HIER ETWAS AENDERT: die Marke behaelt BRAND_GRADIENT mit den
// Originalstufen. Nur Flaechen, auf denen Schrift steht, nehmen diese Rampe.
export const BRAND_GRADIENT_CTA =
  'linear-gradient(135deg, #FAD649 0%, #EF8031 40%, #EB356A 78%, #C131BF 90%, #6B46F1 100%)';
