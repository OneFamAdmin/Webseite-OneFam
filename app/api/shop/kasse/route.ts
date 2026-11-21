import { type NextRequest, NextResponse } from 'next/server';
import { SHOP_AUF_ONEFAM, isLocale, DEFAULT_LOCALE } from '@/i18n/routing';
import { SPRACHE_KOPF, absenderAus } from '@/lib/shop/absender';
import {
  LEERE_ADRESSE,
  alsStoreAdresse,
  fehlendeFelder,
  holeKassenDaten,
  weiterleitungErlaubt,
  type Adresse,
} from '@/lib/shop/kasse';
import { BESTELLT_COOKIE, WARENKORB_COOKIE, WARENKORB_COOKIE_MAX_AGE, store } from '@/lib/shop/storeApi';

// POST /api/shop/kasse — gibt die Bestellung auf (21.11.2026).
//
// DAS IST DIE EINE STELLE, AN DER GELD INS SPIEL KOMMT. Ablauf:
//
//   1. Eingaben prüfen (Pflichtfelder nach den Regeln des Shops, E-Mail, Längen).
//   2. Adresse an den Warenkorb geben; WooCommerce rechnet Versand und Summe.
//   3. Die Summe mit der vergleichen, die der Kunde auf der Seite gesehen hat.
//      Weicht sie ab (anderes Versandland, geänderter Preis, andere Währung),
//      wird NICHT bestellt, sondern die neue Summe gezeigt. Niemand soll einen
//      anderen Betrag bestellen als den, der vor ihm stand.
//   4. Bestellung über die Store API anlegen, Zahlart zahls.
//   5. Die Adresse des Zahlungsfensters zurückgeben — nur wenn sie zu zahls.ch
//      oder zur eigenen Website gehört.
//
// Bezahlt wird nicht hier, sondern im Zahlungsfenster von zahls.ch. Den Status
// der Bestellung setzt danach die Rückmeldung von zahls.ch an den Shop.
//
// NICHT GETESTET von Claude: Schritt 4 und 5 legen eine echte Bestellung an.
// Bestellungen und Testkäufe macht Labi (CLAUDE.md). Geprüft sind die Schritte
// 1 bis 3 und das Format gegen die Beschreibung der Schnittstelle.

export const dynamic = 'force-dynamic';

const MAX = 100;

function adresseAus(roh: unknown): Adresse | null {
  if (!roh || typeof roh !== 'object') return null;
  const quelle = roh as Record<string, unknown>;
  const a = { ...LEERE_ADRESSE };
  for (const feld of Object.keys(a) as (keyof Adresse)[]) {
    const wert = quelle[feld];
    if (wert == null) continue;
    if (typeof wert !== 'string' || wert.length > MAX) return null;
    a[feld] = wert;
  }
  return a;
}

type StoreFehler = { message?: string; data?: { params?: Record<string, string> } };

/** Meldung des Shops ohne HTML — sie kommt in der Sprache der Seite. */
function meldung(daten: unknown): string | null {
  const f = daten as StoreFehler | null;
  const text = Object.values(f?.data?.params ?? {})[0] ?? f?.message;
  return typeof text === 'string' ? text.replace(/<[^>]+>/g, '').trim() : null;
}

export async function POST(request: NextRequest) {
  // Gesperrt, solange der Shop nicht auf onefam.ch läuft (i18n/routing.ts, SHOP_AUF_ONEFAM).
  if (!SHOP_AUF_ONEFAM) return NextResponse.json({ fehler: 'aus' }, { status: 404 });
  const eingabe = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const kopfSprache = request.headers.get(SPRACHE_KOPF);
  const locale = isLocale(kopfSprache) ? kopfSprache : DEFAULT_LOCALE;

  // 1. Eingaben
  const email = typeof eingabe?.email === 'string' ? eingabe.email.trim() : '';
  const lieferung = adresseAus(eingabe?.lieferung);
  const rechnung = eingabe?.rechnung == null ? lieferung : adresseAus(eingabe.rechnung);
  const gesehen = typeof eingabe?.gesehenTotal === 'number' ? eingabe.gesehenTotal : null;
  const gesehenWaehrung = typeof eingabe?.gesehenWaehrung === 'string' ? eingabe.gesehenWaehrung : null;

  if (!lieferung || !rechnung || gesehen == null || !gesehenWaehrung) {
    return NextResponse.json({ fehler: 'eingabe' }, { status: 400 });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ fehler: 'email' }, { status: 400 });
  }

  const regeln = await holeKassenDaten(locale);
  const fehlt = [...fehlendeFelder(lieferung, regeln), ...fehlendeFelder(rechnung, regeln)];
  if (fehlt.length > 0) {
    return NextResponse.json({ fehler: 'pflicht', felder: [...new Set(fehlt)] }, { status: 400 });
  }

  const absender = absenderAus(request);
  // Ohne Warenkorb gibt es nichts zu bestellen — und ohne Token verlangte die Schnittstelle einen Nonce.
  if (!absender.token) return NextResponse.json({ fehler: 'leer' }, { status: 400 });

  const lieferAdresse = alsStoreAdresse(lieferung, regeln);
  const rechnungsAdresse = { ...alsStoreAdresse(rechnung, regeln), email };

  // 2. Adresse an den Warenkorb, WooCommerce rechnet
  const korb = await store('/cart/update-customer', absender, {
    shipping_address: lieferAdresse,
    billing_address: rechnungsAdresse,
  });
  const k = korb.daten as {
    items?: unknown[];
    totals?: { total_price: string; currency_code: string };
    shipping_rates?: { shipping_rates: unknown[] }[];
  } | null;
  if (korb.status !== 200 || !k?.totals) {
    return NextResponse.json({ fehler: 'shop', meldung: meldung(korb.daten) }, { status: korb.status >= 400 ? korb.status : 502 });
  }
  if (!k.items?.length) return NextResponse.json({ fehler: 'leer' }, { status: 400 });
  if (!k.shipping_rates?.[0]?.shipping_rates?.length) {
    return NextResponse.json({ fehler: 'versand', meldung: meldung(korb.daten) }, { status: 400 });
  }

  // 3. Dieselbe Summe wie gesehen?
  const total = Number(k.totals.total_price);
  if (total !== gesehen || k.totals.currency_code !== gesehenWaehrung) {
    return NextResponse.json(
      { fehler: 'summe', total, waehrung: k.totals.currency_code },
      { status: 409 },
    );
  }

  // 4. Bestellung anlegen
  const bestellung = await store('/checkout', absender, {
    billing_address: rechnungsAdresse,
    shipping_address: lieferAdresse,
    payment_method: 'zahls',
    payment_data: [],
  });
  const b = bestellung.daten as {
    order_id?: number;
    payment_result?: { payment_status?: string; redirect_url?: string };
  } | null;

  if (bestellung.status !== 200 || !b?.order_id) {
    return NextResponse.json(
      { fehler: 'shop', meldung: meldung(bestellung.daten) },
      { status: bestellung.status >= 400 ? bestellung.status : 502 },
    );
  }

  // 5. Weiter zum Zahlungsfenster
  const ziel = b.payment_result?.redirect_url ?? '';
  const erlaubt = weiterleitungErlaubt(ziel, request.nextUrl.origin);
  const antwort = erlaubt
    ? NextResponse.json({ weiter: ziel })
    : // Die Bestellung ist angelegt, aber es gibt kein brauchbares Zahlungsfenster.
      // Das darf nicht wie ein gewöhnlicher Fehler aussehen: ein zweiter Klick
      // legte eine zweite Bestellung an.
      NextResponse.json({ fehler: 'zahlung', bestellung: b.order_id }, { status: 502 });

  antwort.cookies.set(BESTELLT_COOKIE, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 2,
  });
  if (bestellung.token) {
    antwort.cookies.set(WARENKORB_COOKIE, bestellung.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: WARENKORB_COOKIE_MAX_AGE,
    });
  }
  return antwort;
}
