import Image from 'next/image';

/**
 * Gesichtsmarke und Wortmarke nebeneinander. Steht im Kopf der Rechtstexte, der
 * Admin-Seiten und der Bestätigungsseite — überall dort, wo kein Hero und kein
 * Video die Marke ohnehin schon trägt. In der Hauptnavigation steht die
 * Wortmarke bewusst allein, dort sitzt die Gesichtsmarke gross in der Hero-Mitte.
 *
 * Die Wortmarke steht auf 45 % der SICHTBAREN Höhe der Gesichtsmarke. Bei diesem
 * Verhältnis wiegen beide Striche gleich schwer. Vorher stand sie auf 86 %, und
 * der Schriftzug war dadurch gut doppelt so fett wie die Zeichnung daneben —
 * gemessen: die Gesichtsmarke setzt 4,4 % ihrer Höhe in Strich um, die Wortmarke
 * 13,4 % der ihren.
 *
 * "Sichtbar" ist der entscheidende Zusatz: Die SVG-Leinwand der Gesichtsmarke ist
 * 283,5 Einheiten hoch, die Zeichnung darin nur 251 — oben und unten stehen
 * zusammen 11,5 % Luft. h-10 sind also 40 px Kasten, aber nur 35,4 px Marke, und
 * davon sind 45 % gleich 16 px, also h-4.
 *
 * Wer die Grösse ändert, muss beide Zahlen ändern. Genau deshalb stehen sie hier
 * an einer Stelle und nicht fünfmal über das Repo verteilt.
 */
export default function Lockup() {
  return (
    <span className="flex items-center gap-2.5">
      {/* Kein next/image: das ist ein SVG, und next/image reicht SVG ohnehin nur
          unverändert durch — mit dangerouslyAllowSVG als Preis. */}
      <img src="/assets/logo-face-gradient.svg" alt="" aria-hidden="true" className="h-10 w-10" />
      <Image src="/assets/logo-white.png" alt="OneFam" width={656} height={137} priority className="h-4 w-auto" />
    </span>
  );
}
