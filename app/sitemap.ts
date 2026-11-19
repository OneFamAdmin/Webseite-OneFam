import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { DEFAULT_LOCALE, LOCALES, homePath, joinPath, legalPath, type Locale } from '@/i18n/routing';

// Next.js liefert diese Datei unter /sitemap.xml aus. Sie enthält bewusst nur die
// Seiten, die auch in den Index sollen — /login, /mein-bereich, /join/bestaetigen
// und /admin tragen noindex und hätten hier nichts verloren.
//
// `lastModified` steht bewusst auf dem Build-Zeitpunkt statt auf einem gepflegten
// Datum pro Seite: ein falsches, altes Datum ist für Google schlechter als gar keins,
// und jeder Deploy ist tatsächlich der letzte Zeitpunkt, an dem sich etwas ändern konnte.
// Jede Adresse trägt seit 19.11.2026 ihre Sprachverweise (hreflang) auch in der
// Sitemap. Bis dahin standen sie nur im HTML; Google empfiehlt eine der beiden
// Stellen, beide zusammen sind die robusteste Fassung. Die Adressen müssen
// zeichengleich mit denen im HTML sein (lib/seo.ts), deshalb dieselben Helfer.
function sprachen(pfad: (l: Locale) => string, wurzel = false): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    const p = pfad(l);
    languages[l] = wurzel && p === '/' ? SITE_URL : `${SITE_URL}${p}`;
  }
  languages['x-default'] = languages[DEFAULT_LOCALE];
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const start = sprachen(homePath, true);
  const join = sprachen(joinPath);

  return [
    // Ohne Schrägstrich am Ende — exakt so, wie der Canonical der Startseite lautet.
    // Sitemap und Canonical müssen zeichengleich sein, sonst meldet die Search Console
    // "Alternative Seite mit richtigem kanonischen Tag" statt einer sauberen Indexierung.
    // Startseite, /join, AGB, Datenschutz und Impressum gibt es in allen vier
    // Sprachen. Andere öffentliche Unterseiten hat die Site derzeit nicht.
    ...LOCALES.map((locale) => ({
      url: locale === DEFAULT_LOCALE ? SITE_URL : `${SITE_URL}${homePath(locale)}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: locale === DEFAULT_LOCALE ? 1 : 0.9,
      alternates: { languages: start },
    })),
    ...LOCALES.map((locale) => ({
      url: `${SITE_URL}${joinPath(locale)}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
      alternates: { languages: join },
    })),
  // /archiv ist seit dem 09.08.2026 deaktiviert und liefert 404. Eine Sitemap, die
    // eine 404-Seite bewirbt, schickt Google auf einen Fehler. Deshalb kein Eintrag.
    // AGB, Datenschutz und seit dem 10.08.2026 auch das Impressum gibt es in vier
    // Sprachen und gehören deshalb viermal in die Sitemap.
    ...LOCALES.flatMap((locale) =>
      (['agb', 'datenschutz', 'impressum'] as const).map((seite) => ({
        url: `${SITE_URL}${legalPath(locale, seite)}`,
        lastModified,
        changeFrequency: 'yearly' as const,
        priority: 0.3,
        alternates: { languages: sprachen((l) => legalPath(l, seite)) },
      })),
    ),
  ];
}
