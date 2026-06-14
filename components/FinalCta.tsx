import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';
import Button from './Button';
import MarbleBg from './MarbleBg';

const FinalCta = () => {
  const t = useTranslations('final_cta');

  return (
    <section id="join" className="relative flex min-h-[80vh] items-center overflow-hidden bg-bg py-24">
      {/* flat #0A0A0A so the top edge blends with the FAQ above; add a photo later if wanted */}
      <MarbleBg opacity={0.45} />

      <MaxWidth className="relative z-10 flex flex-col items-center text-center">
        <Reveal>
          <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-[0.02em] text-primary">
            {t('title')}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-[560px] font-body text-lg leading-relaxed text-secondary">
            {t('text')}
          </p>
        </Reveal>

        <Reveal delay={0.18} className="mt-10 flex justify-center">
          <Button as="a" href="/join" variant="primary" className="w-full px-10 py-4 sm:w-auto">
            {t('cta_primary')}
          </Button>
        </Reveal>
      </MaxWidth>
    </section>
  );
};

export default FinalCta;
