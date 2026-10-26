// Subtle marble / topographic line texture (carried over from the old site).
// Uses screen blend so only the light lines show — never darkens the section,
// which keeps it usable on both #0A0A0A and the lighter surface band.
type MarbleBgProps = {
  opacity?: number;
  className?: string;
};

export default function MarbleBg({ opacity = 0.5, className = '' }: MarbleBgProps) {
  // fade the texture out at the top/bottom edges so it never hard-stops at a section border
  const fade = 'linear-gradient(180deg, transparent, #000 100px, #000 calc(100% - 100px), transparent)';
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 bg-cover bg-center mix-blend-screen ${className}`}
      style={{
        // WebP statt SVG seit 26.10.2026: philosophy-bg.svg wog 3,3 MB (2,4 MB übertragen),
        // weil darin ein PNG von 4096 px steckte. Als CSS-Hintergrund lädt es jeder Besucher
        // sofort, auch wenn die Abschnitte weit unten liegen — im Mobilfunk kamen die Bilder
        // darüber spürbar später. In Chrome auf Schwarz gerendert (2880 × 1646) und als WebP
        // gespeichert: 60 KB. Schwarz als Grund ist gleichwertig, weil mix-blend-screen
        // Schwarz nicht verändert. Original in onefam-material/designs/marmor-hintergrund.
        backgroundImage: "url('/assets/marmor-bg.webp')",
        opacity,
        WebkitMaskImage: fade,
        maskImage: fade,
      }}
    />
  );
}
