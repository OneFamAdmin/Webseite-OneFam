import { type NextRequest, NextResponse } from 'next/server';
import { COUNTRY_HEADER } from '@/i18n/geo';
import { isLocale } from '@/i18n/routing';
import { holeLieferlaender } from '@/lib/shop/katalog';
import {
  WARENKORB_COOKIE,
  WARENKORB_COOKIE_MAX_AGE,
  alsWarenkorb,
  store,
  type Absender,
} from '@/lib/shop/storeApi';
import { GEO_COOKIE, waehrungFuer } from '@/lib/shop/waehrung';

// /api/shop/warenkorb — der Warenkorb auf onefam.ch (Probeaufbau 20.11.2026).
//
// Der Browser spricht nur mit onefam.ch. Diese Route reicht an die Store API
// des Shops weiter (lib/shop/storeApi.ts) und hält den Cart-Token in einem
// eigenen, für JavaScript unsichtbaren Cookie.
//
//   GET                                   Warenkorb lesen
//   POST {aktion:'hinzu', id, menge}      Variante hinzufügen
//   POST {aktion:'menge', key, menge}     Menge ändern
//   POST {aktion:'entfernen', key}        Position entfernen
//   POST {aktion:'land', land}            Versandland setzen
//
// Eingaben werden hier geprüft und nicht ungesehen an den Shop durchgereicht:
// Die Route ist öffentlich, und alles, was sie annimmt, landet in WooCommerce.

export const dynamic = 'force-dynamic';

/** Kopfzeile, in der die Seite ihre Sprache mitschickt (components/shop). */
const SPRACHE_KOPF = 'x-onefam-sprache';

function absenderAus(request: NextRequest): Absender {
  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || null;
  return {
    token: request.cookies.get(WARENKORB_COOKIE)?.value ?? null,
    waehrung: waehrungFuer({
      geo: request.cookies.get(GEO_COOKIE)?.value,
      land: request.headers.get(COUNTRY_HEADER),
      sprache: request.headers.get('accept-language'),
    }),
    ip,
    sprache: request.headers.get('accept-language'),
    seitenSprache: isLocale(request.headers.get(SPRACHE_KOPF)) ? request.headers.get(SPRACHE_KOPF) : null,
  };
}

async function antworten(ergebnis: { status: number; daten: unknown; token: string | null }) {
  const daten = ergebnis.daten as { items?: unknown; message?: string } | null;
  if (!daten || !('items' in daten)) {
    return NextResponse.json(
      { fehler: daten?.message ?? 'Der Warenkorb ist gerade nicht erreichbar.' },
      { status: ergebnis.status >= 400 ? ergebnis.status : 502 },
    );
  }
  const antwort = NextResponse.json(alsWarenkorb(daten, await holeLieferlaender()));
  if (ergebnis.token) {
    antwort.cookies.set(WARENKORB_COOKIE, ergebnis.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: WARENKORB_COOKIE_MAX_AGE,
    });
  }
  return antwort;
}

export async function GET(request: NextRequest) {
  return antworten(await store('/cart', absenderAus(request)));
}

const ganzzahl = (x: unknown, min: number, max: number) =>
  typeof x === 'number' && Number.isInteger(x) && x >= min && x <= max ? x : null;

export async function POST(request: NextRequest) {
  const eingabe = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const absender = absenderAus(request);

  // Ohne Cart-Token verlangt die Store API für jede Änderung einen Nonce und
  // antwortet mit 401 — so geschehen am 20.11.2026 beim ersten Klick auf
  // "In den Warenkorb" in einem frischen Browser (im curl-Test fiel es nicht auf,
  // weil dort zuerst gelesen wurde). Deshalb zuerst einen Token holen: Den gibt
  // jede lesende Anfrage mit.
  if (!absender.token) {
    absender.token = (await store('/cart', absender)).token;
  }
  const key = typeof eingabe?.key === 'string' && /^[a-f0-9]{32}$/.test(eingabe.key) ? eingabe.key : null;

  switch (eingabe?.aktion) {
    case 'hinzu': {
      const id = ganzzahl(eingabe.id, 1, 10_000_000);
      const menge = ganzzahl(eingabe.menge, 1, 10);
      if (!id || !menge) break;
      return antworten(await store('/cart/add-item', absender, { id, quantity: menge }));
    }
    case 'menge': {
      const menge = ganzzahl(eingabe.menge, 1, 10);
      if (!key || !menge) break;
      return antworten(await store('/cart/update-item', absender, { key, quantity: menge }));
    }
    case 'entfernen': {
      if (!key) break;
      return antworten(await store('/cart/remove-item', absender, { key }));
    }
    case 'land': {
      const land = typeof eingabe.land === 'string' ? eingabe.land : '';
      if (!(await holeLieferlaender()).includes(land)) break;
      const adresse = { country: land, state: '' };
      return antworten(
        await store('/cart/update-customer', absender, { shipping_address: adresse, billing_address: adresse }),
      );
    }
  }
  return NextResponse.json({ fehler: 'Ungültige Eingabe.' }, { status: 400 });
}
