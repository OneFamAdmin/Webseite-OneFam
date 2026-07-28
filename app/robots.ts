import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

// Next.js liefert diese Datei unter /robots.txt aus.
//
// Wichtig zur Abgrenzung: `disallow` verbietet das *Crawlen*, nicht das *Indexieren*.
// Eine per robots.txt gesperrte Seite kann trotzdem im Index landen (ohne Snippet),
// weil Google den noindex-Hinweis dann nie zu sehen bekommt. Deshalb steht die
// eigentliche Absicherung von /admin, /login und /mein-bereich im jeweiligen
// noindex-Metatag — hier ist nur das, was Crawler-Budget spart.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/auth/', '/dev', '/design'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
