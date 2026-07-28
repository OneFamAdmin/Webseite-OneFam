import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';
import Button from './Button';

const SHOP_URL = 'https://shop.onefam.ch/de/';

// Bewusst dasselbe Kleidungsstück in derselben Farbe und Perspektive — nur das Zeichen
// auf der Brust unterscheidet sich. Genau das ist die Aussage der Sektion.
// Beide Mockups sind vom weissen Studio-Hintergrund freigestellt (Alpha), deshalb stehen
// sie ohne Karte und ohne Rahmen direkt auf dem schwarzen Grund.
const LINE_IMAGES = [
  { src: '/assets/shirt-logo.png', alt: 'Anthrazitfarbenes OneFam-Shirt mit dem weissen OneFam-Zeichen auf der Brust' },
  { src: '/assets/shirt-mexico.png', alt: 'Anthrazitfarbenes OneFam-Shirt mit dem OneFam-Zeichen in mexikanischen Motiven' },
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

        {/* Bewusst ohne Preisangabe: die Sektion baut ein Gefühl auf, eine Preiszeile würde es
            im letzten Moment in einen Katalog verwandeln. Preise stehen im Shop. */}
        <Reveal delay={0.2} className="mt-16">
          <Button as="a" href={SHOP_URL} target="_blank" rel="noopener noreferrer" variant="primary">
            {t('cta')}
            <ArrowRight size={18} strokeWidth={1.5} />
          </Button>
        </Reveal>
      </MaxWidth>
    </section>
  );
};

export default ProductBridge;
