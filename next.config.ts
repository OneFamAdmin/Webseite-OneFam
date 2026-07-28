import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Jede *.vercel.app-Adresse liefert exakt dieselbe Website aus wie onefam.ch.
        // onefam.vercel.app ist deshalb bereits als doppelter Inhalt im Google-Index
        // gelandet. Der Canonical in den Seiten zeigt zwar immer auf onefam.ch, aber
        // ein Header ist die härtere Aussage — und er erfasst auch alle Preview-Deploys,
        // die sonst nach und nach dasselbe Problem erzeugen.
        source: '/:path*',
        has: [{ type: 'host', value: '(?<vercelhost>.*)\\.vercel\\.app' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
