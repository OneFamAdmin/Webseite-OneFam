import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import localFont from 'next/font/local'
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import MainLayout from '@/layout';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

 
const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin']
});

const newyork = localFont({
  src: './fonts/NewYork PERSONAL USE.otf',
  variable: '--font-newyork',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OneFam',
  description: 'Discover premium products tailored for your lifestyle. OneFam brings you quality, style, and convenience — all in one place.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={` ${outfit.variable} ${newyork.variable}  antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <MainLayout>{children}</MainLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
