import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';
import Button from './Button';
import HeroVideo from './HeroVideo';

const Hero = () => {
  const t = useTranslations('hero');

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg">
      {/* looping background video — plays on all devices (incl. reduced-motion) */}
      <HeroVideo />
      {/* dark overlay so the headline stays readable */}
      <div className="absolute inset-0 z-0" style={{ background: 'rgba(0,0,0,0.55)' }} />

      <MaxWidth className="relative z-10 flex flex-col items-center py-28 text-center">
        <Reveal>
          <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold sm:text-[15px]">
            {t('brand')}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold uppercase leading-[1.05] tracking-[0.03em] text-primary">
            {t('claim')}
          </h1>
          <div className="mx-auto mt-6 h-[3px] w-28 bg-gold" />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-[600px] font-body text-lg text-secondary md:text-xl">
            {t('subline')}
          </p>
        </Reveal>

        <Reveal delay={0.18} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button as="a" href="/join" variant="primary" className="w-full sm:w-auto">
            {t('cta_primary')}
          </Button>
          <Button as="a" href="#about" variant="secondary" className="w-full sm:w-auto">
            {t('cta_secondary')}
          </Button>
        </Reveal>
      </MaxWidth>

      {/* scroll indicator */}
      <a
        href="#about"
        aria-label="Nach unten scrollen"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-faint transition-colors duration-[180ms] hover:text-gold"
      >
        <ChevronDown size={28} strokeWidth={1.5} className="animate-bounce motion-reduce:animate-none" />
      </a>
    </section>
  );
};

export default Hero;
