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
        backgroundImage: "url('/assets/philosophy-bg.svg')",
        opacity,
        WebkitMaskImage: fade,
        maskImage: fade,
      }}
    />
  );
}
