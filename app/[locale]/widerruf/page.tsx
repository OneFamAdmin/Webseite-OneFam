import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import WiderrufAnsicht from '@/components/shop/WiderrufAnsicht';
import { rechtsAdresse } from '@/lib/shop/kasse';
import { LOCALES, SHOP_AUF_ONEFAM, homePath, isLocale } from '@/i18n/routing';

// "Vertrag widerrufen" — /widerruf, /de/widerruf … (live seit 21.11.2026).
//
// Die Widerrufsfunktion nach Art. 11a der Richtlinie 2011/83/EU. Was das Gesetz
// von Formular, Knopf und Bestätigung verlangt, steht in
// components/shop/WiderrufAnsicht.tsx; der Empfang ist Shop-Snippet 116.
//
// Die Seite sagt bewusst NICHT, wer ein Widerrufsrecht hat — das regeln die
// Rechtstexte des Shops, auf die sie verweist (dort steht die Widerrufsbelehrung
// mit der Adresse dieser Seite). Anders als die übrigen Shop-Seiten ist sie nicht
// hinter SHOP_AUF_ONEFAM gesperrt: Die Rechtstexte und die Fusszeile des Shops
// verlinken hierher.
//
// noindex: eine Formularseite, die niemand über eine Suchmaschine finden muss.

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
      {/* Das Warenkorb-Symbol nur, wenn es den Warenkorb auf onefam.ch gibt. */}
      <Nav shop={SHOP_AUF_ONEFAM} />
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
