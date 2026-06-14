import Image from 'next/image';
import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';

const WhyWeDoThis = () => {
  const t = useTranslations('why_we_do_this');
  const paragraphs = t.raw('paragraphs') as string[];

  return (
    <section id="why" className="overflow-hidden bg-bg py-24 md:py-32">
      <MaxWidth>
        <div className="grid items-center gap-10 md:grid-cols-5 md:gap-16">
          {/* Text — 60% */}
          <div className="order-2 md:order-1 md:col-span-3">
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[0.02em] text-primary">
                {t('title')}
              </h2>
            </Reveal>
            <div className="mt-6 max-w-[580px] space-y-6">
              {paragraphs.map((p, i) => {
                // the final line is the distilled pointe → gold, display font, larger
                const isPointe = i === paragraphs.length - 1;
                return (
                  <Reveal key={i} delay={0.08 + i * 0.06}>
                    {isPointe ? (
                      <p className="pt-2 font-display text-2xl font-semibold tracking-[0.02em] text-gold md:text-3xl">
                        {p}
                      </p>
                    ) : (
                      <p className="font-body text-lg leading-[1.8] text-secondary">{p}</p>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Image — 40%, slightly offset */}
          <div className="order-1 md:order-2 md:col-span-2 md:-translate-y-6">
            <Reveal>
              {/* Photo: Vitaly Gariev / Unsplash (Unsplash License — free commercial, no attribution required) */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] border border-line">
                <Image
                  src="/assets/why-photo.jpg"
                  alt="Die OneFam-Community – echte Momente unter Freunden"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
                {/* subtle dark edge so the bright photo sits in the dark section */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, rgba(10,10,10,0) 55%, rgba(10,10,10,0.45) 100%)' }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </MaxWidth>
    </section>
  );
};

export default WhyWeDoThis;
