/**
 * Die Naht zwischen zwei Abschnitten — als weicher Schein statt als Strich.
 *
 * Die Linie, die hier vorher stand, war `border-t border-line`: ein Pixel
 * #2a2a2a über die volle Breite. Sie hatte einen guten Grund. Ober- und
 * unterhalb liegt dasselbe Schwarz (#0a0a0a); ohne sie ginge ein Abschnitt in
 * den nächsten über, ohne dass jemand merkt, dass ein neues Kapitel anfängt.
 *
 * Nur ist es genau dieselbe Linie, die auf dem Telefon unter der Kopfzeile
 * gestört hat: gegen ein schwarzes OLED-Bild liest sich ein heller Pixel als
 * harte Kante, und je nach Umgebung wirkt er warm.
 *
 * Deshalb dasselbe Mittel wie oben: ein Verlauf statt einer Kante. Der Schein
 * liegt MITTIG auf der Naht und geht nach beiden Seiten auf Null — dadurch gibt
 * es nirgends einen Übergang, an dem eine Kante entstehen könnte. Man sieht
 * nicht, wo er anfängt; man sieht nur, dass sich der Grund verändert.
 *
 * Die Farbe ist das Marken-Cremeweiss #EDE7D6 bei 5 Prozent, nicht neutrales
 * Grau: über Schwarz ergibt das einen leicht warmen Schein statt eines grauen
 * Schleiers.
 *
 * Der umgebende Abschnitt braucht `relative` und darf nicht `overflow-hidden`
 * sein — sonst schneidet er die obere Hälfte des Scheins ab.
 */
export default function SectionSeam() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -top-20 h-40"
      style={{
        background:
          'linear-gradient(180deg, rgba(237,231,214,0) 0%, rgba(237,231,214,0.05) 50%, rgba(237,231,214,0) 100%)',
      }}
    />
  );
}
