import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';
import Button from './Button';

const SHOP_URL = 'https://onefam.shop';

// Beide Renders haben einen transparenten Hintergrund und dieselbe Kameraperspektive —
// deshalb stehen sie ohne Karte/Rahmen direkt auf dem schwarzen Grund. Kein Karton,
// kein Schlagschatten: "design less, design better".
const LINE_IMAGES = [
  { src: '/assets/product-logo-line.png', alt: 'Schwarzes OneFam-Shirt mit dem weissen OneFam-Schriftzug' },
  { src: '/assets/product-country-line.png', alt: 'Weisses OneFam-Shirt mit Linienmuster in Landesfarben' },
];

/** Die Brücke von der Story zum Produkt: überträgt das Gefühl der Herkunfts-Geschichte
 *  auf die Stücke, bevor der Shop-Link kommt (docs/handover-shopify-pool.md §4b). */
const ProductBridge = () => {
  const t = useTranslations('product_bridge');
  const lines = t.raw('lines') as { name: string; text: string }[];

  return (
    <section id="stuecke" className="border-t border-line bg-bg py-24 md:py-32">
      <MaxWidth>
        <Reveal>
          <p className="font-body text-sm uppercase tracking-[0.1em] text-faint">{t('label')}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-4 max-w-[18ch] font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[0.02em] text-primary">
            {t('title')}
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-[600px] font-body text-lg leading-relaxed text-secondary">{t('intro')}</p>
        </Reveal>

        <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-10">
          {lines.map((l, i) => (
            <Reveal as="div" key={l.name} delay={0.1 + i * 0.08}>
              <div className="relative mx-auto aspect-square w-full max-w-[420px]">
                <Image
                  src={LINE_IMAGES[i].src}
                  alt={LINE_IMAGES[i].alt}
                  fill
                  sizes="(min-width: 768px) 420px, 90vw"
                  className="object-contain"
                />
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold text-primary">{l.name}</h3>
              <p className="mt-3 max-w-[440px] font-body text-base leading-relaxed text-secondary">{l.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Button as="a" href={SHOP_URL} target="_blank" rel="noopener noreferrer" variant="primary">
            {t('cta')}
            <ArrowRight size={18} strokeWidth={1.5} />
          </Button>
          <p className="font-body text-sm text-faint">{t('price_note')}</p>
        </Reveal>
      </MaxWidth>
    </section>
  );
};

export default ProductBridge;
