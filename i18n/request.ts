// i18n/request.ts

import { getRequestConfig } from 'next-intl/server';

// OneFam ships German-only. Locale is fixed; no cookie/URL negotiation.
export default getRequestConfig(async () => {
  const locale = 'de';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
