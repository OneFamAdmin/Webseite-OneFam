// Der OneFam-Markenverlauf — direkt aus logo-face-gradient.svg uebernommen
// (Gold → Orange → Pink → Magenta → Violett). Einzige Quelle, damit Logo,
// Gesichtsmarke und Pool-Zahl nie auseinanderlaufen. Die Stufen nicht einbetten.
export const BRAND_GRADIENT =
  'linear-gradient(135deg, #FAD649 0%, #EF8031 28%, #EB356A 55%, #C131BF 78%, #6B46F1 100%)';

// Der Knopfverlauf — die helle Haelfte derselben Rampe.
//
// WARUM ES IHN GIBT (24.09.2026): Bis dahin trugen alle "Join the Fam"-Knoepfe
// den vollen Markenverlauf, mit dunklem Text #0A0A0A darauf. Am violetten Ende
// #6B46F1 ergibt das einen Kontrast von **3,56 : 1** — unter dem Mindestwert
// 4,5 : 1. Weisser Text ist keine Loesung: der scheitert am gelben Anfang
// #FAD649 mit 1,6 : 1. **Ein Verlauf ueber die ganze Bandbreite kann gar keine
// Schrift tragen.** Ueber die helle Haelfte sind es **4,95 : 1**.
//
// Beide Werte wurden nachgerechnet und nicht uebernommen.
//
// WOHER DIE LOESUNG STAMMT: nicht neu erfunden. shop.onefam.ch fuehrt seit
// laengerem genau diese Rampe als `--of-grad-cta`, mit derselben Begruendung im
// Code; `--of-grad` bleibt dort ebenso unangetastet. Landing und Shop benutzen
// damit **denselben** Knopfverlauf — das war der eigentliche Zweck der
// Angleichung am 24.09.2026.
//
// WER HIER ETWAS AENDERT: die Marke behaelt BRAND_GRADIENT. Nur Flaechen, auf
// denen Schrift steht, nehmen diese Rampe. Wer den Knopf auf den vollen Verlauf
// zurueckdreht, holt sich 3,56 : 1 zurueck.
export const BRAND_GRADIENT_CTA =
  'linear-gradient(135deg, #FAD649 0%, #EF8031 42%, #EB356A 100%)';
