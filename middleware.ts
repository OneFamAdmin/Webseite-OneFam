import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';
import { DEFAULT_LOCALE, LOCALES, routing } from '@/i18n/routing';
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

// Diese Bereiche liegen NICHT unter app/[locale]/ und duerfen deshalb nicht
// umgeschrieben werden. Ohne diese Liste macht next-intl aus /admin ein
// /en/admin — und das gibt es nicht, die Seite antwortet mit 404.
//
// Sie muessen die Middleware trotzdem durchlaufen: /admin und /auth/callback
// brauchen die aufgefrischte Supabase-Sitzung. Deshalb werden sie hier nicht
// aus dem Matcher genommen, sondern nur an next-intl vorbeigefuehrt.
// Diese Seiten sind (noch) nicht uebersetzt und liegen deshalb bewusst NICHT
// unter app/[locale]/. Sie behalten ihre bestehende Adresse ohne Praefix.
// Sobald ihre Texte in den Uebersetzungsdateien liegen, ziehen sie um und
// verschwinden aus dieser Liste.
const OHNE_SPRACHE = [
  '/admin',
  '/dev',
  '/design',
  '/api',
  '/auth',
  '/join/bestaetigen',
  '/archiv',
  '/reiseziel',
  '/login',
  '/mein-bereich',
];

// Dasselbe gilt fuer die beiden Metadaten-Routen aus app/robots.ts und
// app/sitemap.ts. Sie liegen ebenfalls ausserhalb von app/[locale]/ und wurden
// beim ersten Anlauf still zu /en/sitemap.xml umgeschrieben — Ergebnis: die
// Sitemap, die gerade erst in der Search Console eingereicht wurde, antwortete
// mit 404. Genau die Art Fehler, die niemandem auffaellt, weil man Seiten
// prueft und Metadaten-Routen vergisst.
const DATEIEN_OHNE_SPRACHE = ['/sitemap.xml', '/robots.txt'];

function istOhneSprache(pfad: string) {
  if (DATEIEN_OHNE_SPRACHE.includes(pfad)) return true;
  return OHNE_SPRACHE.some((p) => pfad === p || pfad.startsWith(`${p}/`));
}

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

  const response = istOhneSprache(request.nextUrl.pathname)
    ? NextResponse.next({ request })
    : intlMiddleware(request);

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
    // everything except Next internals and static asset files
    '/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)',
  ],
};
