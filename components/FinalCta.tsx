import { useLocale, useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';
import Button from './Button';
import MarbleBg from './MarbleBg';
import { BRAND_GRADIENT_CTA } from '@/lib/brand';
import { joinPath, type Locale } from '@/i18n/routing';

const FinalCta = () => {
  const t = useTranslations('final_cta');
  const locale = useLocale() as Locale;

  return (
    <section id="join" className="relative flex min-h-[80vh] items-center overflow-hidden bg-bg py-24">
      {/* flat #0A0A0A so the top edge blends with the FAQ above; add a photo later if wanted */}
      <MarbleBg opacity={0.45} />

      <MaxWidth className="relative z-10 flex flex-col items-center text-center">
        <Reveal>
          <h2 className="font-serif text-[clamp(2.08rem,4.16vw,3.12rem)] font-normal leading-[1.05] text-primary">
            {t('title')}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-[31rem] font-body text-lg leading-[1.75] tracking-[0.012em] text-secondary">
            {t('text')}
          </p>
        </Reveal>

        <Reveal delay={0.18} className="mt-10 flex justify-center">
          <Button as="a" href={joinPath(locale)} variant="primary" className="w-full px-10 py-4 sm:w-auto" style={{ background: BRAND_GRADIENT_CTA }}>
            {t('cta_primary')}
          </Button>
        </Reveal>
      </MaxWidth>
    </section>
  );
};

export default FinalCta;
