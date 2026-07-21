import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import MainLayout from '@/layout';

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
export const metadata: Metadata = {
  title: 'OneFam — For souls who belong to more than one place',
  description:
    'Kleidung und eine Community für alle, deren Antwort auf «Woher kommst du?» ein Komma hat. Nicht für alle – und genau das ist der Punkt.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="de">
      <body className={`${cabinet.variable} ${satoshi.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <MainLayout>{children}</MainLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
