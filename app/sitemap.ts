import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

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
    { url: SITE_URL, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/join`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/reiseziel`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/archiv`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/agb`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/datenschutz`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
