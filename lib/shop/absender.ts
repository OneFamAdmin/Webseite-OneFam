import type { NextRequest } from 'next/server';
import { COUNTRY_HEADER } from '@/i18n/geo';
import { isLocale } from '@/i18n/routing';
import { WARENKORB_COOKIE, type Absender } from './storeApi';
import { GEO_COOKIE, waehrungFuer } from './waehrung';

// lib/shop/absender.ts — NUR serverseitig.
//
// Was jede Anfrage von onefam.ch an die Store API des Shops mitträgt: den
// Cart-Token, die Währung nach der Geräte-Regel, die echte IP des Besuchers, die
// Sprache der Seite und die Adresse für die Rückkehr nach der Zahlung. Eine
// Stelle für Warenkorb und Kasse, damit beide nie verschieden entscheiden —
// vor allem nicht über die Währung.

/** Kopfzeile, in der die Seite ihre Sprache mitschickt (components/shop). */
export const SPRACHE_KOPF = 'x-onefam-sprache';

export function absenderAus(request: NextRequest): Absender {
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || null;
  const sprache = request.headers.get(SPRACHE_KOPF);
  return {
    token: request.cookies.get(WARENKORB_COOKIE)?.value ?? null,
    waehrung: waehrungFuer({
      geo: request.cookies.get(GEO_COOKIE)?.value,
      land: request.headers.get(COUNTRY_HEADER),
      sprache: request.headers.get('accept-language'),
    }),
    ip,
    sprache: request.headers.get('accept-language'),
    seitenSprache: isLocale(sprache) ? sprache : null,
    // Die Adresse, unter der diese Anfrage ankam: lokal http://localhost:3001,
    // live https://onefam.ch. Vorschau-Adressen von Vercel kennt der Shop nicht —
    // dort leitet zahls.ch auf die Seiten des Shops zurück.
    rueckkehr: request.nextUrl.origin,
  };
}
