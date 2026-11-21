import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import MaxWidth from '@/components/MaxWidth';
import SiteFooter from '@/components/SiteFooter';
import KasseAnsicht from '@/components/shop/KasseAnsicht';
import { AGB_ADRESSE, datenschutzAdresse, holeKassenDaten } from '@/lib/shop/kasse';
import { LOCALES, isLocale, shopByCountryPfad, warenkorbPfad } from '@/i18n/routing';

// Kasse auf onefam.ch — /kasse, /de/kasse … (21.11.2026, nur lokal).
// Ablauf, Herkunft der Regeln und der Rechtstexte: lib/shop/kasse.ts.
// Eine Kasse gehört nie in einen Suchindex.

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 300;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'shop_kasse' });
  return { title: `${t('titel')} | OneFam`, robots: { index: false, follow: false } };
}

export default async function KasseSeite({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'shop_kasse' });
  const regeln = await holeKassenDaten(locale);

  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav shop />
      <main className="flex-1 py-10 md:py-16">
        <MaxWidth>
          <h1 className="mb-10 font-serif text-[clamp(2rem,4.4vw,2.9rem)] font-normal text-primary">{t('titel')}</h1>
          <KasseAnsicht
            regeln={regeln}
            agbAdresse={AGB_ADRESSE[locale]}
            datenschutzAdresse={datenschutzAdresse(locale)}
            warenkorbPfad={warenkorbPfad(locale)}
            weiterPfad={shopByCountryPfad(locale)}
          />
        </MaxWidth>
      </main>
      <SiteFooter />
    </div>
  );
}
