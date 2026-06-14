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

export const metadata: Metadata = {
  title: 'OneFam — For good souls worldwide',
  description:
    'OneFam ist eine globale Community für Menschen mit guter Energie – Respekt, Support und echte Erlebnisse statt Hype.',
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
