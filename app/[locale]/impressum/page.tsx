import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import LegalLayout from '@/components/LegalLayout';
import { pageMetadata, sprachAlternativen } from '@/lib/seo';
import { LOCALES, isLocale, legalPath } from '@/i18n/routing';

// Das Impressum gab es bis zum 10.08.2026 nur als Modal im Footer. Inhaltlich war
// es vollständig, aber ein Modal hat keine eigene Adresse: nicht verlinkbar, für
// Suchmaschinen unsichtbar, und wer im Streitfall auf die Anbieterangaben zeigen
// will, kann es nicht. Diese Seite behebt das.
//
// Die Werte kommen aus messages/<sprache>.json unter footer.imprint_*, also aus
// derselben Quelle wie das Modal. Es gibt sie damit genau einmal.
type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: 'legal.impressum' });

  return pageMetadata({
    title: t('meta_titel'),
    description: t('meta_beschreibung'),
    path: legalPath(locale, 'impressum'),
    locale,
    languages: sprachAlternativen((l) => legalPath(l, 'impressum')),
  });
}

export default async function ImpressumPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'legal.impressum' });
  const tF = await getTranslations({ locale, namespace: 'footer' });

  const zeilen = [
    { label: t('label_firma'), wert: tF('imprint_company') },
    { label: t('label_inhaber'), wert: tF('imprint_owner') },
    { label: t('label_adresse'), wert: tF('imprint_address') },
  ];

  const email = tF('imprint_email');
  const telefon = tF('imprint_phone');

  return (
    <LegalLayout title={t('titel')} lead={t('einleitung')}>
      <dl className="space-y-6">
        {zeilen.map((zeile) => (
          <div key={zeile.label}>
            <dt className="font-body text-xs uppercase tracking-[0.1em] text-faint">{zeile.label}</dt>
            <dd className="mt-1 font-body text-[17px] leading-relaxed text-secondary">{zeile.wert}</dd>
          </div>
        ))}

        <div>
          <dt className="font-body text-xs uppercase tracking-[0.1em] text-faint">{t('label_email')}</dt>
          <dd className="mt-1 font-body text-[17px] leading-relaxed">
            <a href={`mailto:${email}`} className="text-gold underline-offset-4 hover:underline">
              {email}
            </a>
          </dd>
        </div>

        <div>
          <dt className="font-body text-xs uppercase tracking-[0.1em] text-faint">{t('label_telefon')}</dt>
          <dd className="mt-1 font-body text-[17px] leading-relaxed">
            <a href={`tel:${telefon.replace(/\s/g, '')}`} className="text-gold underline-offset-4 hover:underline">
              {telefon}
            </a>
          </dd>
        </div>
      </dl>

      <div className="mt-12 border-t border-line pt-8">
        <h2 className="font-display text-xl font-semibold text-primary">{t('hinweis_titel')}</h2>
        <p className="mt-3 font-body text-[17px] leading-relaxed text-secondary">{t('hinweis_text')}</p>
      </div>
    </LegalLayout>
  );
}
