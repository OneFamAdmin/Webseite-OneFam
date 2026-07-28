import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // loco-motive.ch ist der abgelegte frühere Markenname. Auf gedruckten Karten
        // steht ein QR-Code auf loco-motive.ch/connect — der lässt sich nicht mehr
        // ändern, das Ziel dahinter schon. Deshalb wird die gesamte alte Domain auf
        // die Startseite geschickt, nicht nur /connect: Falls anderswo weitere alte
        // Adressen gedruckt sind, laufen die damit ebenfalls nicht mehr ins Leere.
        //
        // Bewusst OHNE Pfad-Übernahme (kein /:path* im Ziel): Die alten Pfade gibt es
        // auf der neuen Seite nicht, sie würden dort nur einen 404 erzeugen. Ein
        // Besucher, der die Marke ohnehin nicht mehr kennt, ist auf der Startseite
        // besser aufgehoben als auf einer Fehlerseite.
        //
        // 308 (permanent), damit Suchmaschinen und Browser es sich merken.
        source: '/:path*',
        has: [{ type: 'host', value: '(www\\.)?loco-motive\\.ch' }],
        destination: 'https://onefam.ch/',
        permanent: true,
      },
    ];
  },

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
