import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import MainLayout from '@/layout';
import { SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION, pageMetadata } from '@/lib/seo';
import { headers } from 'next/headers';
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  PFAD_OHNE_SPRACHE_HEADER,
  SPRACHE_OHNE_PRAEFIX,
  isLocale,
} from '@/i18n/routing';

const cabinet = localFont({
  src: './fonts/CabinetGrotesk-Variable.woff2',
  variable: '--font-cabinet',
  display: 'swap',
  weight: '600 800',
  fallback: ['system-ui', 'sans-serif'],
});

const satoshi = localFont({
  src: './fonts/Satoshi-Variable.woff2',
  variable: '--font-satoshi',
  display: 'swap',
  weight: '400 500',
  fallback: ['system-ui', 'sans-serif'],
});

// Titel und Beschreibung sind das, was in Suchergebnissen, im Browser-Tab und in
// jeder geteilten Link-Vorschau steht — sie müssen denselben Claim tragen wie der
// Hero, sonst verspricht die Vorschau etwas anderes als die Seite.
//
// Seit dem Sprachrouting hat app/page.tsx einen eigenen generateMetadata-Export
// (englisch, mit hreflang auf alle vier Sprachen), app/[locale]/page.tsx ebenso.
// Dieser Block ist deshalb nur noch der Rückfall für Seiten ohne eigene
// Metadaten — er darf nicht mehr als "die Startseite" gelesen werden.
//
// `metadataBase` ist der Grund, warum Open Graph absolute Adressen ausgibt. Ohne
// diesen Wert schreibt Next.js einen relativen Bildpfad in die Vorschau — und den
// kann kein Messenger auflösen, die Vorschau bleibt bildlos.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: '/',
  }),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const roh = await getLocale();
  const erkannt = isLocale(roh) ? roh : DEFAULT_LOCALE;

  // Seiten ausserhalb von app/[locale]/ laufen an next-intl vorbei, also meldet
  // getLocale() dort die Standardsprache Englisch — obwohl /login und
  // /mein-bereich durchgehend deutsch sind. Die Middleware setzt fuer genau
  // diese Pfade eine Kopfzeile; erst damit steht hier die richtige Sprache.
  //
  // Umgestellt wird beides: <html lang> UND die Sprache des
  // NextIntlClientProvider samt seiner Texte.
  //
  // Die sichtbaren Menuepunkte aendert das nicht — "About", "Code", "FAQ",
  // "Shop", "Join the Fam" stehen in allen vier Sprachdateien gleich, das sind
  // Markenbegriffe (am 08.09.2026 in messages/{de,en,fr,es}.json nachgesehen).
  // Was sich unterscheidet, sind die UNSICHTBAREN Beschriftungen: der
  // Menue-Knopf meldete sich auf /mein-bereich und /login gegenueber
  // Vorleseprogrammen mit "Open menu" statt "Menü öffnen".
  //
  // Der Seiteninhalt selbst ist davon unberuehrt: diese Seiten tragen ihre
  // Texte fest im TSX, sie holen nichts aus messages/.
  const kopf = await headers();
  const ohneSprache = kopf.get(PFAD_OHNE_SPRACHE_HEADER) === '1';
  const locale = ohneSprache ? SPRACHE_OHNE_PRAEFIX : erkannt;
  const htmlSprache = HTML_LANG[locale];

  // getMessages() MIT der Sprache aufrufen, nicht ohne. Ohne Argument holt es
  // den Satz, den i18n/request.ts bestimmt hat — und der faellt fuer Pfade
  // ausserhalb von app/[locale]/ auf Englisch zurueck. Beim ersten Anlauf am
  // 08.09.2026 stand deshalb lang="de" ueber einem Menue, dessen Knopf sich
  // gegenueber Vorleseprogrammen weiter mit "Open menu" meldete: die
  // Kennzeichnung war umgestellt, die Texte nicht.
  const messages = await getMessages({ locale });

  // <html lang> stand vorher fest auf "de" — auch dann, wenn der Seitentitel
  // englisch war. Das ist die Angabe, an der Vorleseprogramme ihre Aussprache
  // wählen und an der Google die Sprache der Seite abliest.
  return (
    <html lang={htmlSprache}>
      <body className={`${cabinet.variable} ${satoshi.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MainLayout>{children}</MainLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
