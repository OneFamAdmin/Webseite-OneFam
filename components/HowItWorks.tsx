import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';
import Button from './Button';

const HowItWorks = () => {
  const t = useTranslations('how_it_works');
  const steps = t.raw('steps') as { number: string; text: string }[];

  return (
    <section id="how" className="bg-bg py-24 md:py-32">
      <MaxWidth>
        <Reveal>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[0.02em] text-primary">
            {t('title')}
          </h2>
        </Reveal>

        <div className="mt-14 border-t border-line">
          {steps.map((s, i) => (
            <Reveal
              as="div"
              key={s.number}
              delay={i * 0.08}
              className="grid grid-cols-1 items-center gap-2 border-b border-line py-8 md:grid-cols-[auto_1fr] md:gap-12"
            >
              <span className="font-display text-5xl font-extrabold leading-none text-line md:text-6xl">
                {s.number}
              </span>
              <p className="max-w-[640px] font-body text-lg font-medium text-primary">{s.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <Button as="a" href="#faq" variant="ghost">
            {t('cta')}
            <ArrowRight size={18} strokeWidth={1.5} />
          </Button>
        </Reveal>
      </MaxWidth>
    </section>
  );
};

export default HowItWorks;
