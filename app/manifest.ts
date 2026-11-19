import type { MetadataRoute } from 'next';
import { DEFAULT_DESCRIPTION, SITE_NAME } from '@/lib/seo';

// /manifest.webmanifest — seit 19.11.2026. Vorher gab es keines; die Adresse leitete
// auf /de/manifest.webmanifest um und endete mit 404. Browser nehmen daraus Name,
// Farben und Symbol, wenn jemand die Seite auf den Startbildschirm legt; Lighthouse
// prüft es unter „Best Practices".
//
// Farben aus app/globals.css (--bg #0a0a0a). Symbole sind die, die es schon gibt:
// icon.svg skaliert beliebig, apple-icon.png ist 180 × 180. Der Pfad steht in
// DATEIEN_OHNE_SPRACHE (i18n/routing.ts), sonst greift die Sprachumleitung.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: '/',
    display: 'browser',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  };
}
