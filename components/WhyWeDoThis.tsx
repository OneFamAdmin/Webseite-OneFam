import Image from 'next/image';
import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';

const WhyWeDoThis = () => {
  const t = useTranslations('why_we_do_this');
  const tAlt = useTranslations('alt');
  const paragraphs = t.raw('paragraphs') as string[];

  return (
    <section id="why" className="overflow-hidden bg-bg py-24 md:py-32">
      <MaxWidth>
        <div className="grid items-center gap-10 md:grid-cols-5 md:gap-16">
          {/* Text — 60% */}
          <div className="order-2 md:order-1 md:col-span-3">
            <Reveal>
              <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">{t('label')}</p>
              <h2 className="mt-4 max-w-[22ch] text-balance font-serif text-[clamp(2.08rem,4.16vw,3.12rem)] font-normal leading-[1.1] text-primary">
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
                      <p className="pt-2 font-serif text-[1.625rem] font-normal italic leading-[1.3] text-gold md:text-[1.95rem]">
                        {p}
                      </p>
                    ) : (
                      <p className="max-w-[31rem] font-body text-lg leading-[1.8] text-secondary">{p}</p>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Image — 40%, slightly offset */}
          <div className="order-1 md:order-2 md:col-span-2 md:-translate-y-6">
            <Reveal>
              {/* Seit 19.10.2026 ein echtes Sofortbild von einem der Abende (zwei Freunde, Arm
                  in Arm; einer ist der Inhaber, der andere ist einverstanden). Vorher stand hier
                  ein mit Higgsfield Soul 2 erzeugtes Bild im Handy-Look — neben der Geschichte
                  „kleine, handverlesene Treffen" las es sich wie ein Beleg von damals und war
                  doch gestellt; für eine trust-first-Seite das falsche Signal. Das Handyfoto
                  des Sofortbilds hatte den Rahmen oben/rechts abgeschnitten: das Foto selbst ist
                  unverändert, der weisse Rahmen neu gesetzt (Seitenverhältnis Instax mini),
                  leicht gedreht, dunkler Schatten — dieselbe Bildsprache wie die Ansichtskarte
                  bei der Vision: Dinge, die man aufhebt. Kein Rahmen-Kasten mehr drumherum.
                  Herkunft: ~/Projekte/onefam-material/designs/sofortbild-warum/ */}
              <Image
                src="/assets/why-sofortbild.webp"
                alt={tAlt('why')}
                width={1000}
                height={1457}
                sizes="(max-width: 768px) 80vw, 34vw"
                className="mx-auto h-auto w-full max-w-[420px]"
              />
            </Reveal>
          </div>
        </div>
      </MaxWidth>
    </section>
  );
};

export default WhyWeDoThis;
