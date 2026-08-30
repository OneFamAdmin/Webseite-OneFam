'use client';

import type { Locale } from '@/i18n/routing';

/**
 * Runde Flagge zu einer Sprache — als Inline-SVG, nicht als Datei.
 *
 * Warum inline und nicht die vorhandenen public/assets/{uk,de,fr,sp}.svg:
 * Die stammen aus einem Figma-Export und tragen ein eingebettetes PNG mit sich
 * herum — zusammen rund 145 KB für vier Bildchen von 20 Pixeln. Zwei davon
 * haben ausserdem einen weissen Kreis hinter der Flagge, zwei nicht; im Menü
 * nebeneinander sieht man den Unterschied sofort.
 *
 * Warum kein Emoji (🇬🇧🇩🇪🇫🇷🇪🇸): Windows liefert bis heute keine Flaggen-Emoji
 * aus. Auf jedem Windows-Rechner stünden dort stattdessen die Buchstaben "GB",
 * "DE", "FR", "ES" in kleinen Kästchen — also genau das, was der Umschalter
 * loswerden soll.
 *
 * Beschnitten wird über `overflow-hidden rounded-full` am umgebenden <span>,
 * nicht über <clipPath> im SVG: ein clipPath braucht eine id, und die Flagge
 * steht mehrfach auf derselben Seite (Knopf + Liste, Desktop + Mobil). Doppelte
 * ids sind ungültiges HTML.
 *
 * Die Zeichnungen sind der mittige quadratische Ausschnitt der jeweiligen
 * Flagge. Beim Union Jack sind die roten Diagonalen bewusst mittig statt
 * versetzt (der echte St-Patrick-Balken ist gegenständig verschoben) — bei
 * 20 Pixeln Kantenlänge ist der Unterschied nicht sichtbar, der Code dafür
 * aber dreimal so lang.
 */

const ZEICHNUNGEN: Record<Locale, React.ReactNode> = {
  // Union Jack, quadratisch. Weisses Kreuz 1/3 der Höhe, rotes Kreuz 1/5 —
  // dieselben Verhältnisse wie in der echten Flagge, nur auf 24 skaliert.
  en: (
    <>
      <rect width="24" height="24" fill="#012169" />
      <path d="M0 0 L24 24 M24 0 L0 24" stroke="#ffffff" strokeWidth="5.6" />
      <path d="M0 0 L24 24 M24 0 L0 24" stroke="#C8102E" strokeWidth="1.9" />
      <path d="M12 0 V24 M0 12 H24" stroke="#ffffff" strokeWidth="8" />
      <path d="M12 0 V24 M0 12 H24" stroke="#C8102E" strokeWidth="4.8" />
    </>
  ),
  de: (
    <>
      <rect width="24" height="8" fill="#000000" />
      <rect y="8" width="24" height="8" fill="#DD0000" />
      <rect y="16" width="24" height="8" fill="#FFCE00" />
    </>
  ),
  fr: (
    <>
      <rect width="8" height="24" fill="#002654" />
      <rect x="8" width="8" height="24" fill="#ffffff" />
      <rect x="16" width="8" height="24" fill="#ED2939" />
    </>
  ),
  // Spanien ist 1 : 2 : 1 geteilt, nicht in Drittel.
  es: (
    <>
      <rect width="24" height="24" fill="#AA151B" />
      <rect y="6" width="24" height="12" fill="#F1BF00" />
    </>
  ),
};

export default function Flag({ locale, className = 'h-5 w-5' }: { locale: Locale; className?: string }) {
  return (
    <span
      // ring-inset: der Rand liegt INNEN. Aussen würde er die Flagge um einen
      // Pixel wachsen lassen und die Höhen im Menü gegeneinander verschieben.
      className={`inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-inset ring-white/25 ${className}`}
    >
      {/* width/height stehen zusätzlich zur viewBox im Tag: ohne sie rendert
          Safari ein SVG in manchen Kontexten gar nicht. */}
      <svg viewBox="0 0 24 24" width="24" height="24" className="h-full w-full" aria-hidden="true" focusable="false">
        {ZEICHNUNGEN[locale]}
      </svg>
    </span>
  );
}
