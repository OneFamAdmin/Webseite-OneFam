import { type NextRequest, NextResponse } from 'next/server';
import { SHOP_AUF_ONEFAM } from '@/i18n/routing';
import { absenderAus } from '@/lib/shop/absender';
import { holeLieferlaender } from '@/lib/shop/katalog';
import {
  BESTELLT_COOKIE,
  WARENKORB_COOKIE,
  WARENKORB_COOKIE_MAX_AGE,
  alsWarenkorb,
  store,
} from '@/lib/shop/storeApi';

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
//   POST {aktion:'abschluss'}             nach bezahlter Bestellung: Warenkorb vergessen
//   POST {aktion:'abbruch'}               Zahlung abgebrochen: Warenkorb behalten
//
// Eingaben werden hier geprüft und nicht ungesehen an den Shop durchgereicht:
// Die Route ist öffentlich, und alles, was sie annimmt, landet in WooCommerce.

export const dynamic = 'force-dynamic';

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
  // Gesperrt, solange der Shop nicht auf onefam.ch läuft (i18n/routing.ts, SHOP_AUF_ONEFAM).
  if (!SHOP_AUF_ONEFAM) return NextResponse.json({ fehler: 'aus' }, { status: 404 });
  return antworten(await store('/cart', absenderAus(request)));
}

const ganzzahl = (x: unknown, min: number, max: number) =>
  typeof x === 'number' && Number.isInteger(x) && x >= min && x <= max ? x : null;

export async function POST(request: NextRequest) {
  // Gesperrt, solange der Shop nicht auf onefam.ch läuft (i18n/routing.ts, SHOP_AUF_ONEFAM).
  if (!SHOP_AUF_ONEFAM) return NextResponse.json({ fehler: 'aus' }, { status: 404 });
  const eingabe = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  // Rückkehr von zahls.ch — beide ohne Anfrage an den Shop.
  if (eingabe?.aktion === 'abschluss') {
    // Nur wenn die Kasse gerade eine Bestellung angelegt hat (Merker). Der
    // Warenkorb wird vergessen, indem sein Token verfällt; im Shop räumt
    // WooCommerce ihn nach 48 Stunden selbst ab.
    const bestellt = request.cookies.get(BESTELLT_COOKIE)?.value === '1';
    const antwort = NextResponse.json({ geleert: bestellt });
    if (bestellt) {
      antwort.cookies.delete(WARENKORB_COOKIE);
      antwort.cookies.delete(BESTELLT_COOKIE);
    }
    return antwort;
  }
  if (eingabe?.aktion === 'abbruch') {
    const antwort = NextResponse.json({ ok: true });
    antwort.cookies.delete(BESTELLT_COOKIE);
    return antwort;
  }

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
