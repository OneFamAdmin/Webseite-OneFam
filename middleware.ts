import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { LOCALE_HEADER, localeFromPath } from '@/i18n/routing';

// Zwei Aufgaben, bewusst in dieser Reihenfolge:
//
// 1) Sprache aus der Adresse ableiten und als Request-Header weitergeben.
//    Das Root-Layout braucht sie für <html lang> und kann die Parameter einer
//    darunterliegenden dynamischen Route nicht sehen; i18n/request.ts liest
//    denselben Header, um die richtige Übersetzungsdatei zu laden.
//
// 2) Die Supabase-Sitzung auffrischen, damit Server Components eine gültige
//    Sitzung sehen. Das darf die Seite nie zum Absturz bringen: eine fehlende
//    Umgebungsvariable oder ein Auth-Schluckauf führt zu "nicht aufgefrischt",
//    nicht zu einem 500er.
//
// Wichtig beim Anfassen: Der Sprach-Header muss an JEDER Stelle mitgegeben
// werden, an der eine neue Antwort gebaut wird — auch im setAll-Rückruf von
// Supabase. Sonst verliert genau der Request die Sprache, bei dem Supabase ein
// Cookie erneuert, und die Seite erscheint sporadisch auf Englisch.
export async function middleware(request: NextRequest) {
  const locale = localeFromPath(request.nextUrl.pathname);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  const neueAntwort = () => NextResponse.next({ request: { headers: requestHeaders } });

  let response = neueAntwort();

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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = neueAntwort();
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
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
