// lib/shop/typen.ts
//
// Die Form der Shop-Daten auf onefam.ch (Probeaufbau seit 20.11.2026).
//
// Der Shop kommt in die Landing Page (docs/plan-zusammenfuehrung-onefam.md):
// onefam.ch zeigt Produkte, Warenkorb und später die Kasse, WooCommerce bleibt
// unsichtbar im Hintergrund. Diese Typen sind die Grenze zwischen beiden — alles,
// was die Seiten brauchen, und nichts von dem, wie WooCommerce es intern ablegt.
// Die Quelle (seit 20.11.2026 der eigene Katalog-Endpunkt im Shop, Snippet 114)
// steckt allein in lib/shop/katalog.ts.

export type Waehrung = 'CHF' | 'EUR';

export type Bild = {
  /** Grosse Fassung von WordPress (z. B. 825 x 1024) — nicht das 2,3-MB-Original. */
  src: string;
  /** Kleine quadratische Fassung (300 x 300) für Vorschaubildchen. */
  klein: string;
  alt: string;
};

export type Farbe = {
  /** So heisst die Farbe in WooCommerce und in der Bestellung, z. B. "Heather Grey". */
  name: string;
  /** Galerie dieser Farbe, in der Reihenfolge aus WooCommerce. Das erste Bild ist das freihängende Teil. */
  bilder: Bild[];
};

export type Variante = {
  /** WooCommerce-Variations-ID — genau sie geht in den Warenkorb. */
  id: number;
  farbe: string;
  groesse: string;
  /** Preis in CHF, wie in WooCommerce eingetragen. */
  chf: number;
  /**
   * EUR-Festpreis aus der CURCY-Meta `_regular_price_wmcp`.
   * null heisst: fehlt. Dann wird NICHT umgerechnet — 82,50 / 71,50 / 44,00 ist
   * kein Preis, sondern das Fehlerbild eines fehlenden Festpreises (CLAUDE.md, Preise).
   */
  eur: number | null;
  lieferbar: boolean;
};

export type Produkt = {
  id: number;
  slug: string;
  name: string;
  /**
   * Beschreibung samt Grössentabelle, Material und Versand — dasselbe HTML, das
   * der Shop über den Filter the_content erzeugt (Snippets 68 und 69), in der
   * Sprache der Seite. Stand 20.11.2026: Der Motivtext fehlt darin auf EN/FR/ES,
   * siehe docs/plan-zusammenfuehrung-onefam.md.
   */
  beschreibungHtml: string;
  kategorie: { slug: string; name: string } | null;
  farben: Farbe[];
  groessen: string[];
  varianten: Variante[];
  /** Vorauswahl der Farbe — die Farbe des ersten Bildes in WooCommerce. */
  startFarbe: string;
};

/** Der Warenkorb, so wie onefam.ch ihn anzeigt. Beträge in Rappen bzw. Cent. */
export type Warenkorb = {
  waehrung: Waehrung | string;
  positionen: {
    key: string;
    id: number;
    name: string;
    farbe: string;
    groesse: string;
    menge: number;
    bild: string | null;
    einzelpreis: number;
    summe: number;
  }[];
  anzahl: number;
  zwischensumme: number;
  versand: number | null;
  total: number;
  land: string;
  laender: string[];
  fehler: string[];
};
