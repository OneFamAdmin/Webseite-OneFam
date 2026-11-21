import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import WiderrufAnsicht from '@/components/shop/WiderrufAnsicht';
import { rechtsAdresse } from '@/lib/shop/kasse';
import { LOCALES, homePath, isLocale } from '@/i18n/routing';

// "Vertrag widerrufen" — /widerruf, /de/widerruf … (21.11.2026, nur lokal).
//
// Die Widerrufsfunktion nach Art. 11a der Richtlinie 2011/83/EU. Was das Gesetz
// von Formular, Knopf und Bestätigung verlangt, steht in
// components/shop/WiderrufAnsicht.tsx; der Empfang ist Shop-Snippet 116.
//
// Die Seite sagt bewusst NICHT, wer ein Widerrufsrecht hat — das regeln die
// Rechtstexte des Shops, auf die sie verweist. So bleibt sie richtig, gleich wie
// die offene Frage zum Widerruf in der EU ausgeht (lib/shop/kasse.ts,
// WIDERRUF_EU_AKTIV).
//
// noindex wie alle Shop-Seiten bis zum Livegang.

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'shop_widerruf' });
  return { title: `${t('titel')} | OneFam`, robots: { index: false, follow: false } };
}

export default async function WiderrufSeite({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'shop_widerruf' });

  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav shop />
      <main className="mx-auto w-full max-w-[31rem] flex-1 px-6 py-14 md:py-20">
        <h1 className="font-serif text-[clamp(2rem,4.4vw,2.9rem)] font-normal leading-[1.1] text-primary">{t('titel')}</h1>
        <p className="mt-6 font-body leading-[1.75] tracking-[0.012em] text-secondary">{t('einleitung')}</p>
        <p className="mt-4 font-body text-sm leading-[1.7] text-secondary">
          {t.rich('hinweis_recht', {
            regel: (inhalt) => (
              <a
                href={rechtsAdresse(locale, 'rueckgabe')}
                target="_blank"
                rel="noopener"
                className="text-gold underline-offset-4 hover:underline"
              >
                {inhalt}
              </a>
            ),
          })}
        </p>
        <WiderrufAnsicht startPfad={homePath(locale)} />
      </main>
      <SiteFooter />
    </div>
  );
}
