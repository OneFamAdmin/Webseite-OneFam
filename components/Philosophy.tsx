import Image from 'next/image';
import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';
import MarbleBg from './MarbleBg';

const Philosophy = () => {
  const t = useTranslations('philosophy');

  return (
    <section id="philosophie" className="relative flex min-h-[60vh] items-center overflow-hidden bg-bg py-24 md:py-32">
      {/* marble / topographic swirl texture carried over from the old site */}
      <MarbleBg opacity={0.6} />

      {/* philosopher-head motif — a solid black silhouette underneath masks the
          marble inside the head shape, so the head clearly sits ON TOP of it */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="relative aspect-[509/717] h-[82%]">
          <Image src="/assets/philosophy.png" alt="" aria-hidden fill sizes="520px" className="object-contain brightness-0" />
          <Image src="/assets/philosophy.png" alt="" aria-hidden fill sizes="520px" className="object-contain opacity-[0.55] grayscale" />
        </div>
      </div>

      {/* readability scrim behind the text — interior only, fades out before the
          edges so the soft section transitions stay intact */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse 75% 48% at 50% 50%, rgba(0,0,0,0.72), transparent 70%)' }}
      />

      <MaxWidth className="relative z-10 flex flex-col items-center text-center">
        <Reveal>
          <p className="font-body text-xs uppercase tracking-[0.1em] text-secondary [text-shadow:0_2px_10px_rgba(0,0,0,0.85)]">
            {t('label')}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <span aria-hidden className="mt-6 block font-display text-7xl leading-none text-gold">&ldquo;</span>
        </Reveal>

        <Reveal delay={0.16}>
          <blockquote className="mx-auto max-w-[720px] font-display text-2xl font-semibold leading-snug tracking-[0.01em] text-primary md:text-3xl">
            {t('quote')}
          </blockquote>
        </Reveal>
      </MaxWidth>
    </section>
  );
};

export default Philosophy;
