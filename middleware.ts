import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';
import { DEFAULT_LOCALE, LOCALES, PFAD_OHNE_SPRACHE_HEADER, istOhneSprache, routing } from '@/i18n/routing';
import { COUNTRY_HEADER, LOCALE_COOKIE, detectLocale } from '@/i18n/geo';

// Zwei Aufgaben in einer Middleware, Reihenfolge ist wichtig:
//
// 1) next-intl bestimmt die Sprache aus der Adresse und schreibt sie intern um:
//    /agb wird zu /en/agb, /de/agb bleibt /de/agb. Nach aussen aendert sich
//    nichts. Die Antwort dieser Middleware traegt die Sprache bereits in sich —
//    deshalb wird sie unten als Grundlage weitergereicht und nicht verworfen.
//
// 2) Die Supabase-Sitzung wird aufgefrischt, damit Server Components eine
//    gueltige Sitzung sehen. Das darf die Seite nie zum Absturz bringen: eine
//    fehlende Umgebungsvariable oder ein Auth-Schluckauf fuehrt zu "nicht
//    aufgefrischt", nicht zu einem 500er.
//
// Die Falle beim Anfassen: Wer hier eine eigene NextResponse.next() baut und
// zurueckgibt, wirft die Sprach-Umschreibung von next-intl weg — die Seite
// erscheint dann in der Standardsprache, ohne Fehlermeldung. Deshalb werden die
// Cookies von Supabase auf die intl-Antwort GESETZT, statt eine neue zu bauen.
const intlMiddleware = createIntlMiddleware(routing);

// Welche Bereiche ausserhalb von app/[locale]/ liegen, steht seit dem
// 08.09.2026 in i18n/routing.ts — dort, weil die Kopfzeile dieselbe Liste
// braucht, um auf diesen Seiten den Sprachumschalter auszublenden.
//
// Sie duerfen nicht umgeschrieben werden: ohne diese Liste macht next-intl aus
// /admin ein /en/admin, und das gibt es nicht — die Seite antwortet mit 404.
// Sie muessen die Middleware trotzdem durchlaufen, weil /admin und
// /auth/callback die aufgefrischte Supabase-Sitzung brauchen. Deshalb werden
// sie hier nicht aus dem Matcher genommen, sondern nur an next-intl
// vorbeigefuehrt.

/** Traegt der Pfad bereits ein Sprachpraefix? '/de', '/fr/agb' → ja. */
function hatSprachPraefix(pfad: string) {
  const erstes = pfad.split('/')[1];
  return (LOCALES as readonly string[]).includes(erstes);
}

// Spracherkennung aus zwei Signalen — Browsersprache und Herkunftsland.
// Regeln und Land-Sprache-Tabelle: i18n/geo.ts. next-intl macht das NICHT mehr
// selbst (localeDetection: false in i18n/routing.ts), sonst wuerden sich zwei
// Umleitungen gegenseitig ins Gehege kommen.
//
// Umgeleitet wird nur, wenn ALLE vier Bedingungen zutreffen:
//   - der Pfad gehoert zum uebersetzten Bereich (nicht /join, /admin, …),
//   - er traegt noch KEIN Sprachpraefix (sonst Endlosschleife),
//   - die erkannte Sprache ist nicht die Standardsprache,
//   - es ist eine GET-Anfrage (ein POST darf man nicht umleiten, der Rumpf
//     ginge verloren — trifft hier vor allem Server Actions).
function spracheUmleiten(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (request.method !== 'GET') return null;
  if (istOhneSprache(pathname)) return null;
  if (hatSprachPraefix(pathname)) return null;

  const { locale, quelle } = detectLocale({
    cookie: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get('accept-language'),
    country: request.headers.get(COUNTRY_HEADER),
  });

  if (locale === DEFAULT_LOCALE) return null;

  const ziel = request.nextUrl.clone();
  ziel.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;

  const antwort = NextResponse.redirect(ziel, 307);
  // Beim Nachmessen unbezahlbar: In den Entwicklerwerkzeugen steht dann im
  // Antwort-Header, WELCHES Signal entschieden hat. Ohne das raet man.
  antwort.headers.set('x-onefam-locale-quelle', quelle);
  return antwort;
}

export async function middleware(request: NextRequest) {
  const umleitung = spracheUmleiten(request);
  if (umleitung) return umleitung;

  // Der Header sagt dem Wurzel-Layout, dass diese Seite ausserhalb der
  // Sprachstruktur liegt und deutsch ist. Ohne ihn kann app/layout.tsx das nicht
  // wissen: getLocale() von next-intl faellt dort auf Englisch zurueck, und
  // <html lang> stand deshalb auf "en" ueber durchgehend deutschem Text —
  // gemessen am 08.09.2026 auf /mein-bereich und /login. An dieser Angabe liest
  // Google die Sprache ab, und Vorleseprogramme waehlen danach ihre Aussprache.
  //
  // Bewusst nur in DIESEM Zweig: hier wird ohnehin ein eigenes
  // NextResponse.next() gebaut. Im intl-Zweig darf die Antwort nicht ersetzt
  // werden — das wirft die Sprach-Umschreibung von next-intl weg, und die ganze
  // Seite faellt ohne Fehlermeldung auf Englisch zurueck (siehe oben).
  const ohneSprache = istOhneSprache(request.nextUrl.pathname);

  let response: NextResponse;
  if (ohneSprache) {
    const kopfzeilen = new Headers(request.headers);
    kopfzeilen.set(PFAD_OHNE_SPRACHE_HEADER, '1');
    response = NextResponse.next({ request: { headers: kopfzeilen } });
  } else {
    response = intlMiddleware(request);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without Supabase credentials there is no session to refresh — skip quietly
  // instead of letting createServerClient throw on every request.
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    await supabase.auth.getUser();
  } catch {
    // Never let an auth hiccup take down the whole site.
  }

  return response;
}

export const config = {
  matcher: [
    // Alles ausser Next-Interna und statischen Dateien.
    //
    // Die Endungsliste ist kein Schoenheitsfehler, sondern der Unterschied
    // zwischen ausgeliefert und 404: Was hier fehlt, laeuft durch next-intl
    // und bekommt ein Sprachpraefix verpasst. 02.09.2026 fehlte `webm` —
    // /hero.webm wurde zu /de/hero.webm umgeschrieben und antwortete mit 404,
    // obwohl die Datei in public/ liegt. Der Browser fiel still auf hero.mp4
    // zurueck (18,75 MB statt 10,6 MB), sichtbar nur als 404 in der Konsole.
    // Wer hier ein neues Dateiformat nach public/ legt, traegt es hier ein.
    '/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|ico)$).*)',
  ],
};
