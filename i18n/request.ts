// i18n/request.ts

import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { DEFAULT_LOCALE, LOCALE_HEADER, isLocale } from './routing';

// Die Sprache kommt aus dem Header, den die Middleware aus der Adresse ableitet.
// Vorher stand hier fest 'de' — mit dem Kommentar "OneFam ships German-only".
//
// Fehlt der Header (z. B. weil eine Route nicht durch die Middleware läuft),
// fällt die Seite auf die Standardsprache zurück statt zu werfen. Eine Website,
// die wegen einer fehlenden Sprachangabe einen 500er liefert, wäre schlimmer als
// eine, die kurz in der falschen Sprache erscheint.
export default getRequestConfig(async () => {
  const kopf = await headers();
  const roh = kopf.get(LOCALE_HEADER);
  const locale = isLocale(roh) ? roh : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
