import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { DEFAULT_LOCALE, LOCALES, homePath } from '@/i18n/routing';

// Next.js liefert diese Datei unter /sitemap.xml aus. Sie enthält bewusst nur die
// Seiten, die auch in den Index sollen — /login, /mein-bereich, /join/bestaetigen
// und /admin tragen noindex und hätten hier nichts verloren.
//
// `lastModified` steht bewusst auf dem Build-Zeitpunkt statt auf einem gepflegten
// Datum pro Seite: ein falsches, altes Datum ist für Google schlechter als gar keins,
// und jeder Deploy ist tatsächlich der letzte Zeitpunkt, an dem sich etwas ändern konnte.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    // Ohne Schrägstrich am Ende — exakt so, wie der Canonical der Startseite lautet.
    // Sitemap und Canonical müssen zeichengleich sein, sonst meldet die Search Console
    // "Alternative Seite mit richtigem kanonischen Tag" statt einer sauberen Indexierung.
    // Die Startseite in allen vier Sprachen. Nur sie ist übersetzt — die
    // Unterseiten darunter gibt es weiterhin ausschliesslich auf Deutsch und
    // ohne Sprachpräfix. Sie hier in vier Sprachen aufzuführen wäre eine
    // Falschaussage gegenüber Google.
    ...LOCALES.map((locale) => ({
      url: locale === DEFAULT_LOCALE ? SITE_URL : `${SITE_URL}${homePath(locale)}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: locale === DEFAULT_LOCALE ? 1 : 0.9,
    })),
    { url: `${SITE_URL}/join`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/reiseziel`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/archiv`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/agb`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/datenschutz`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
