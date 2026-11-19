import type { Metadata } from 'next';
import { DEFAULT_LOCALE, LOCALES, OG_LOCALE, homePath, type Locale } from '@/i18n/routing';
import de from '@/messages/de.json';
import en from '@/messages/en.json';
import es from '@/messages/es.json';
import fr from '@/messages/fr.json';

// Die kanonische Adresse ist bewusst fest verdrahtet und kommt NICHT aus
// NEXT_PUBLIC_SITE_URL. Grund: Jede Vercel-Preview und jede *.vercel.app-Adresse
// liefert dieselben Seiten aus. Käme die Basis aus der Umgebung, würde jede dieser
// Adressen sich selbst als kanonisch ausweisen — und Google zählt das als doppelten
// Inhalt (genau das Problem, das onefam.vercel.app bereits hat). Ein fester Wert
// zeigt aus jeder Umgebung auf die eine Adresse, die zählen soll.
export const SITE_URL = 'https://onefam.ch';

export const SITE_NAME = 'OneFam';

// Claim und Beschreibung sind identisch mit dem Hero (messages/de.json → hero).
// Eine Link-Vorschau, die etwas anderes verspricht als die Seite, kostet Vertrauen.
export const DEFAULT_TITLE = 'OneFam — For souls who belong to more than one place';
export const DEFAULT_DESCRIPTION =
  'Kleidung und eine Community für alle, deren Antwort auf «Woher kommst du?» ein Komma hat. Nicht für alle – und genau das ist der Punkt.';

// 1200 × 630 ist das Format, das Facebook, WhatsApp, LinkedIn, X und iMessage
// gleichermassen ohne Beschnitt anzeigen. Als JPEG, weil WhatsApp WebP-Vorschauen
// unzuverlässig rendert.
//
// Seit 19.11.2026 eines je Sprache, erzeugt mit tools/og-bilder.py aus den Texten in
// messages/<sprache>.json. Vorher gab es nur public/og-image.jpg: englischer Claim und
// darunter ein DEUTSCHER Satz — auf Englisch, Französisch und Spanisch geteilt eine
// halb deutsche Vorschau. Das alte Bild bleibt liegen, weil geteilte Links und
// Zwischenspeicher von Facebook & Co. noch darauf zeigen können.
//
// Der Alternativtext beschreibt, was auf dem jeweiligen Bild steht — deshalb hier je
// Sprache und aus derselben Quelle wie das Bild. Wer den Claim ändert, lässt das
// Skript neu laufen, sonst sagen Bild und Alternativtext Verschiedenes.
const CLAIM: Record<Locale, string> = {
  en: en.hero.claim,
  de: de.hero.claim,
  fr: fr.hero.claim,
  es: es.hero.claim,
};

export function ogBild(locale: Locale) {
  return {
    url: `/og/onefam-og-${locale}.jpg`,
    width: 1200,
    height: 630,
    alt: `OneFam — ${CLAIM[locale]}`,
  };
}

type PageMetaInput = {
  title: string;
  description: string;
  /** Pfad mit führendem Slash, z. B. '/join'. Für die Startseite '/'. */
  path: string;
  /** true bei Seiten, die nicht in den Suchindex gehören (Konto, Admin, Bestätigungsseiten). */
  noindex?: boolean;
  /** Sprache der Seite. Steuert og:locale. Ohne Angabe Deutsch. */
  locale?: Locale;
  /** hreflang-Angaben, am einfachsten über sprachAlternativen() erzeugt. */
  languages?: Record<string, string>;
};

/**
 * hreflang-Angaben für eine Unterseite, die es in allen vier Sprachen gibt.
 *
 * Die Startseite bekommt ihre über homeMetadata(). Unterseiten hatten bis zum
 * 10.08.2026 gar keine: /de/join, /fr/join und /es/join standen ohne jeden
 * Verweis aufeinander im Index — vier Adressen, die Google als Konkurrenz statt
 * als Übersetzungen lesen musste.
 *
 * x-default zeigt auf die englische Fassung, wie auf der Startseite auch.
 */
export function sprachAlternativen(pfad: (locale: Locale) => string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${SITE_URL}${pfad(l)}`;
  }
  languages['x-default'] = `${SITE_URL}${pfad(DEFAULT_LOCALE)}`;
  return languages;
}

/**
 * Baut den vollständigen Metadaten-Satz für eine Seite: Titel, Beschreibung,
 * Canonical, Open Graph und Twitter-Card. Der Canonical ist der wichtigste Teil —
 * ohne ihn entscheidet Google selbst, welche der erreichbaren Adressen die
 * "echte" ist.
 */
export function pageMetadata({
  title,
  description,
  path,
  noindex,
  locale,
  languages,
}: PageMetaInput): Metadata {
  const url = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  const bild = ogBild(locale ?? 'de');

  return {
    title,
    description,
    alternates: { canonical: url, ...(languages ? { languages } : {}) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale ?? 'de'],
      url,
      title,
      description,
      images: [bild],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [bild.url],
    },
  };
}

/**
 * Metadaten der Startseite in einer bestimmten Sprache.
 *
 * Der Unterschied zu pageMetadata(): hier stehen zusätzlich die
 * hreflang-Angaben. Sie sagen Google, dass /, /de, /fr und /es dieselbe Seite
 * in vier Sprachen sind und nicht vier konkurrierende Seiten. Ohne sie wählt
 * Google eine aus und ignoriert die anderen — genau der Fehler, den der Shop
 * bis zum 30.07.2026 hatte.
 *
 * x-default zeigt auf die englische Fassung: Sie ist die Standardsprache und
 * die beste Antwort für alle Sprachen, die wir nicht anbieten.
 *
 * Bewusst NUR für die Startseite. Die Unterseiten gibt es nur auf Deutsch;
 * ein hreflang, das eine französische Fassung von /agb behauptet, wäre eine
 * Falschaussage gegenüber Google.
 */
export function homeMetadata({
  locale,
  title,
  description,
}: {
  locale: Locale;
  title: string;
  description: string;
}): Metadata {
  const url = locale === DEFAULT_LOCALE ? SITE_URL : `${SITE_URL}${homePath(locale)}`;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = l === DEFAULT_LOCALE ? SITE_URL : `${SITE_URL}${homePath(l)}`;
  }
  languages['x-default'] = SITE_URL;
  const bild = ogBild(locale);

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      url,
      title,
      description,
      images: [bild],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [bild.url],
    },
  };
}
