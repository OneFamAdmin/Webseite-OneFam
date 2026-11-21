import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import DankeAbschluss from '@/components/shop/DankeAbschluss';
import { LOCALES, homePath, isLocale } from '@/i18n/routing';

// Die Seite nach der Zahlung — /danke, /de/danke … (21.11.2026, nur lokal).
//
// Hierher leitet zahls.ch nach erfolgreicher Zahlung zurück (Snippet 114 im Shop
// biegt die Rückkehr-Adresse für Bestellungen von onefam.ch um).
//
// Bewusst ohne Bestelldaten: Die Seite ist für jeden aufrufbar und zeigt deshalb
// nichts, was nur den Käufer angeht. Bestellnummer, Positionen und Summe stehen
// in der Bestätigungsmail von WooCommerce. Ob bezahlt ist, entscheidet nicht
// diese Seite, sondern die Rückmeldung von zahls.ch an den Shop.

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'shop_kasse' });
  return { title: `${t('danke_titel')} | OneFam`, robots: { index: false, follow: false } };
}

export default async function DankeSeite({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'shop_kasse' });

  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav shop />
      <DankeAbschluss />
      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center px-6 py-20 md:py-28">
        <h1 className="font-serif text-[clamp(2.4rem,5.6vw,3.6rem)] font-normal leading-[1.06]" style={{ color: '#EBD9A6' }}>
          {t('danke_titel')}
        </h1>
        <p className="mt-6 font-body text-lg leading-[1.7] tracking-[0.012em] text-secondary">{t('danke_text')}</p>
        <Link href={homePath(locale)} className="mt-10 font-body text-gold underline-offset-4 hover:underline">
          {t('danke_weiter')} →
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
