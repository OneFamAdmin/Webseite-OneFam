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
   * der Shop über den Filter the_content erzeugt (Snippets 61, 62, 68, 69, 71),
   * in der Sprache der Seite. Am 20.11.2026 für alle 18 Produkte gegen die
   * Shop-Seite verglichen: gleicher Text.
   */
  beschreibungHtml: string;
  /**
   * Derselbe Inhalt, in seine Teile zerlegt (seit 21.11.2026, für die Reiter der
   * Produktseite): die Zeile zum Stück ("Wie es sich trägt: …"), die Erzählung zum
   * Motiv und die drei Klappen des Shops (Grössentabelle, Material, Versand).
   * Lässt sich das HTML nicht zerlegen, steht alles in `erzaehlung`.
   */
  abschnitte: { stueck: string | null; erzaehlung: string | null; klappen: { titel: string; html: string }[] };
  /** Lieferzeit-Zeile in der Sprache der Seite (Shop-Snippet 102). */
  lieferzeit: string | null;
  kategorie: { slug: string; name: string } | null;
  farben: Farbe[];
  groessen: string[];
  varianten: Variante[];
  /** Vorauswahl der Farbe — die Farbe des ersten Bildes in WooCommerce. */
  startFarbe: string;
};

/** Ein Produkt als Kachel auf einer Länder- oder Kollektionsseite. */
export type KachelProdukt = {
  slug: string;
  name: string;
  chf: number;
  /** EUR-Festpreis; null, wenn er auf einer Variante fehlt — dann wird in EUR kein Preis gezeigt. */
  eur: number | null;
  /** false, wenn die Varianten verschieden viel kosten — dann steht "ab" vor dem Preis. */
  einheitlich: boolean;
  /** Anzahl Farben, in denen es das Teil gibt. */
  farben: number;
  /** Von Hand gewähltes Kachelbild (lib/shop/kachelbilder.ts), sonst das Produktbild. */
  bild: string;
  /** Produktbild aus WooCommerce (das freihängende Teil) — für den Einstieg der Länderseite. */
  produktbild: string | null;
};

/**
 * Der Erzähltext eines Motivs aus Shop-Snippet 68, in Abschnitte geteilt.
 * Aufbau dort für alle Motive gleich: zuletzt "Für wen", davor "Das Zeichen",
 * davor die Erzählung (ein oder zwei Absätze).
 */
export type MotivText = {
  erzaehlung: string[];
  zeichen: string;
  fuer: string;
  schluss: string;
  /** Die beiden Überschriften aus Snippet 68 ("Das Zeichen.", "Für wen."). */
  titel: { zeichen: string; fuer: string } | null;
};

/** Eine Länderseite (Albanien …) oder Kollektion (Logo-Linien). */
export type Kategorie = {
  slug: string;
  /** Name aus WooCommerce in der Sprache der Seite (Shop-Snippet 57). */
  name: string;
  /** Kategorietext aus Shop-Snippet 70, in der Sprache der Seite. */
  text: string | null;
  motiv: MotivText | null;
  /** Versand und Rückgabe: Titel und Text der dritten Klappe der Produktseite (Shop-Snippet 69). */
  versand: { titel: string; html: string } | null;
  produkte: KachelProdukt[];
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
