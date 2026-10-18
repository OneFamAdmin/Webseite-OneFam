import { ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { joinPath, shopUrl, type Locale } from '@/i18n/routing';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';
import Button from './Button';
import HeroVideo from './HeroVideo';
import { BRAND_GRADIENT_CTA } from '@/lib/brand';

const Hero = () => {
  const t = useTranslations('hero');
  const locale = useLocale() as Locale;

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg">
      {/* looping background video — plays on all devices (incl. reduced-motion) */}
      <HeroVideo />
      {/* dark overlay so the headline stays readable */}
      <div className="absolute inset-0 z-0" style={{ background: 'rgba(0,0,0,0.55)' }} />

      <MaxWidth className="relative z-10 flex flex-col items-center py-28 text-center">
        <Reveal>
          {/* the real brand mark — gradient — large and centred above the wordmark + claim */}
          <div className="relative mx-auto mb-6 w-fit">
            <div
              className="absolute inset-0 -z-10 blur-2xl"
              style={{ background: 'radial-gradient(circle, rgba(235,128,49,0.4), rgba(107,70,241,0.18), transparent 70%)', transform: 'scale(1.6)' }}
            />
            <img src="/assets/logo-face-gradient.svg" alt="OneFam" className="mx-auto h-20 w-20 md:h-[104px] md:w-[104px]" />
          </div>
          <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold sm:text-[15px]">
            {t('kicker')}
          </p>
          {/* Seit 18.10.2026 EB Garamond, normal geschrieben, Gewicht 400 — vorher
              Cabinet, 76 px, Gewicht 800, Versalien. Gemessen war das die lauteste
              Überschrift von sechs Seiten; keine der edlen Referenzen setzt fett
              (Soho House: Serife 48 px, Gewicht 400). Labi hat die Fassung in der
              Vorschau ausgewählt. max-w-[24ch] hält den Satz auf zwei Zeilen. */}
          <h1
            className="mx-auto mt-3 max-w-[24ch] font-serif text-[clamp(2.288rem,4.784vw,4.16rem)] font-normal leading-[1.08] text-balance"
            style={{ color: '#EBD9A6' }}
          >
            {t('claim')}
          </h1>
          {/* 1 px statt 3 px: neben der Serife wirkte der dicke Balken grob (18.10.2026) */}
          <div className="mx-auto mt-6 h-px w-20 bg-gold" />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-[31rem] font-body text-lg tracking-[0.012em] text-secondary md:text-xl">
            {t('subline')}
          </p>
        </Reveal>

        <Reveal delay={0.18} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button as="a" href={joinPath(locale)} variant="primary" className="w-full sm:w-auto" style={{ background: BRAND_GRADIENT_CTA }}>
            {t('cta_primary')}
          </Button>
          <Button
            as="a"
            href={shopUrl(locale)}
            variant="secondary"
            className="w-full sm:w-auto"
          >
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
