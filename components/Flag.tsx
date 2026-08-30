'use client';

import type { Locale } from '@/i18n/routing';

/**
 * Flagge zu einer Sprache — als Inline-SVG, nicht als Datei.
 *
 * Die Zeichnungen sind Zeichen fuer Zeichen dieselben wie im Sprachumschalter
 * von shop.onefam.ch: 18 x 12 Einheiten, Ecken mit Radius 2. Der Auftrag sagt
 * "genauso wie im Shop" — dann sollen es auch dieselben Flaggen sein und nicht
 * zwei Zeichnungen desselben Landes, die sich um eine Nuance unterscheiden.
 *
 * Warum inline und nicht die vorhandenen public/assets/{uk,de,fr,sp}.svg:
 * Die stammen aus einem Figma-Export und tragen ein eingebettetes PNG mit sich
 * herum — zusammen rund 145 KB fuer vier Bildchen von 18 Pixeln. Zwei davon
 * haben ausserdem einen weissen Kreis hinter der Flagge, zwei nicht; im Menue
 * nebeneinander sieht man den Unterschied sofort.
 *
 * Warum kein Emoji (🇬🇧🇩🇪🇫🇷🇪🇸): Windows liefert bis heute keine Flaggen-Emoji
 * aus. Auf jedem Windows-Rechner stuenden dort stattdessen die Buchstaben "GB",
 * "DE", "FR", "ES" in kleinen Kaestchen — also genau das, was der Umschalter
 * loswerden soll.
 *
 * Der Union Jack wird zusaetzlich vom umgebenden <span> beschnitten: seine
 * Diagonalen sind Striche von Ecke zu Ecke und liefen sonst ueber die runden
 * Ecken hinaus. Beschnitten wird per CSS und nicht per <clipPath>, weil ein
 * clipPath eine id braucht und dieselbe Flagge mehrfach auf der Seite steht
 * (Knopf und Liste, Desktop und Mobil) — doppelte ids sind ungueltiges HTML.
 */

const ZEICHNUNGEN: Record<Locale, React.ReactNode> = {
  en: (
    <>
      <rect width="18" height="12" rx="2" fill="#012169" />
      <path d="M0 0l18 12M18 0L0 12" stroke="#fff" strokeWidth="2.6" />
      <path d="M0 0l18 12M18 0L0 12" stroke="#C8102E" strokeWidth="1.3" />
      <path d="M9 0v12M0 6h18" stroke="#fff" strokeWidth="4" />
      <path d="M9 0v12M0 6h18" stroke="#C8102E" strokeWidth="2.2" />
    </>
  ),
  de: (
    <>
      <rect width="18" height="12" rx="2" fill="#FFCE00" />
      <path d="M0 2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2H0z" fill="#000" />
      <rect y="4" width="18" height="4" fill="#DD0000" />
    </>
  ),
  fr: (
    <>
      <rect width="18" height="12" rx="2" fill="#fff" />
      <path d="M2 0h4v12H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" fill="#002395" />
      <path d="M12 0h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4z" fill="#ED2939" />
    </>
  ),
  es: (
    <>
      <rect width="18" height="12" rx="2" fill="#AA151B" />
      <rect y="3" width="18" height="6" fill="#F1BF00" />
    </>
  ),
};

export default function Flag({ locale, className = 'h-3 w-[18px]' }: { locale: Locale; className?: string }) {
  return (
    <span className={`inline-block shrink-0 overflow-hidden rounded-[2px] ${className}`}>
      {/* width/height stehen zusaetzlich zur viewBox im Tag: ohne sie rendert
          Safari ein SVG in manchen Kontexten gar nicht. */}
      <svg viewBox="0 0 18 12" width="18" height="12" className="h-full w-full" aria-hidden="true" focusable="false">
        {ZEICHNUNGEN[locale]}
      </svg>
    </span>
  );
}
