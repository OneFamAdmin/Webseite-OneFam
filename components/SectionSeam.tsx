/**
 * Die Naht zwischen zwei Abschnitten — als weicher Schein statt als Strich.
 *
 * Die Linie, die hier ursprünglich stand, war `border-t border-line`: ein Pixel
 * #2a2a2a über die volle Breite. Sie hatte einen guten Grund. Ober- und
 * unterhalb liegt dasselbe Schwarz (#0a0a0a); ohne sie ginge ein Abschnitt in
 * den nächsten über, ohne dass jemand merkt, dass ein neues Kapitel anfängt.
 *
 * Nur ist es genau dieselbe Linie, die auf dem Telefon unter der Kopfzeile
 * gestört hat. Deshalb ein Verlauf statt einer Kante — und zwar einer, der
 * MITTIG auf der Naht liegt und nach beiden Seiten auf Null geht. Dadurch gibt
 * es nirgends einen Übergang, an dem eine Kante entstehen könnte.
 *
 * ── Warum 48 px und 6 %, und nicht 160 px und 5 % ──
 *
 * Der erste Anlauf war 160 px hoch bei 5 % Deckkraft. Auf dem Telefon waren
 * darin schwache waagrechte Linien zu sehen. Das war kein Zufall, sondern
 * Farbstufenbildung, und sie ist nachrechenbar:
 *
 *   5 % von #EDE7D6 über Schwarz sind rund 12 Helligkeitsstufen. Ein Bildschirm
 *   kennt in jedem Kanal nur ganze Zahlen — die 12 Stufen verteilen sich also
 *   auf 80 px je Seite, macht rund 6,7 px pro Stufe. Gemessen an einer
 *   3x-Aufnahme: das längste Plateau gleicher Helligkeit war 14 Gerätepixel
 *   lang. Genau diese Plateaus sieht das Auge als Linien, und im Schwarzbereich
 *   ist jeder Sprung um eine Stufe ein Helligkeitssprung von fünf bis zehn
 *   Prozent — auf einem OLED im Dunkeln deutlich sichtbar.
 *
 * Die Lösung ist nicht weniger Deckkraft (dann sind es noch weniger Stufen auf
 * derselben Strecke, also breitere Plateaus), sondern eine KÜRZERE Strecke bei
 * etwas mehr Deckkraft: 6 % sind rund 15 Stufen, verteilt auf 24 px je Seite.
 * Gemessen: längstes Plateau 6 Gerätepixel, also 2 CSS-Pixel. So dicht
 * beieinander löst das Auge die einzelnen Konturen nicht mehr auf.
 *
 * Nebenbei sieht die kürzere Naht auch besser aus: 160 px waren ein diffuser
 * Schleier über dem halben Bildschirm, 48 px sind eine Naht.
 *
 * Wer hier Zahlen ändert, muss beides zusammen ändern — Höhe runter heisst
 * Deckkraft rauf, sonst kommen die Stufen zurück.
 *
 * Der umgebende Abschnitt braucht `relative` und darf nicht `overflow-hidden`
 * sein, sonst schneidet er die obere Hälfte des Scheins ab.
 */
export default function SectionSeam() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -top-6 h-12"
      style={{
        background:
          'linear-gradient(180deg, rgba(237,231,214,0) 0%, rgba(237,231,214,0.06) 50%, rgba(237,231,214,0) 100%)',
      }}
    />
  );
}
