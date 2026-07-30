import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import MainLayout from '@/layout';
import { SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION, pageMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE, HTML_LANG, isLocale } from '@/i18n/routing';

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
  const messages = await getMessages();
  const roh = await getLocale();
  const locale = isLocale(roh) ? roh : DEFAULT_LOCALE;

  // <html lang> stand vorher fest auf "de" — auch dann, wenn der Seitentitel
  // englisch war. Das ist die Angabe, an der Vorleseprogramme ihre Aussprache
  // wählen und an der Google die Sprache der Seite abliest.
  return (
    <html lang={HTML_LANG[locale]}>
      <body className={`${cabinet.variable} ${satoshi.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MainLayout>{children}</MainLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
