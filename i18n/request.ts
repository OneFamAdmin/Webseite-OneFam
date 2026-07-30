// i18n/request.ts

import { getRequestConfig } from 'next-intl/server';
import { DEFAULT_LOCALE, isLocale } from './routing';

// Die Sprache kommt aus dem [locale]-Segment der Adresse, das die
// next-intl-Middleware setzt. Vorher stand hier fest 'de' — mit dem Kommentar
// "OneFam ships German-only" —, dann kurzzeitig ein selbst gesetzter Header.
//
// Laesst sich die Sprache nicht bestimmen (z. B. bei Routen ausserhalb von
// app/[locale]/ wie /admin oder /api), faellt die Seite auf die Standardsprache
// zurueck statt zu werfen. Eine Website, die wegen einer fehlenden
// Sprachangabe einen 500er liefert, waere schlimmer als eine, die kurz in der
// falschen Sprache erscheint.
export default getRequestConfig(async ({ requestLocale }) => {
  const angefragt = await requestLocale;
  const locale = isLocale(angefragt) ? angefragt : DEFAULT_LOCALE;

  // Die Rechtstexte liegen in einer eigenen Datei. Sie sind zusammen rund
  // 1'700 Woerter und wuerden messages/<sprache>.json unlesbar machen —
  // ausserdem aendern sie sich in einem ganz anderen Rhythmus als die
  // Startseite. Zwei Dateien, ein Namensraum.
  const [allgemein, recht] = await Promise.all([
    import(`../messages/${locale}.json`),
    import(`../messages/legal/${locale}.json`),
  ]);

  return {
    locale,
    messages: { ...allgemein.default, legal: recht.default },
  };
});
