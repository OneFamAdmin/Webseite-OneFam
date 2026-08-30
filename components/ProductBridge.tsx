import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { shopUrl, type Locale } from '@/i18n/routing';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';
import Button from './Button';

// Shop-Adresse pro Sprache — siehe i18n/routing.ts. Stand vorher fest auf /de/.

// Bewusst dasselbe Kleidungsstück in derselben Farbe und Perspektive — nur das Zeichen
// auf der Brust unterscheidet sich. Genau das ist die Aussage der Sektion.
// Beide Mockups sind vom weissen Studio-Hintergrund freigestellt (Alpha), deshalb stehen
// sie ohne Karte und ohne Rahmen direkt auf dem schwarzen Grund.
// Die Bildbeschreibungen stehen im Namensraum 'alt' der Uebersetzungsdateien,
// damit sie wie jeder andere Text in allen vier Sprachen vorliegen.
const LINE_IMAGES = [
  { src: '/assets/shirt-logo.png', altKey: 'shirt_logo' },
  { src: '/assets/shirt-mexico.png', altKey: 'shirt_mexico' },
] as const;

/** Die Brücke von der Story zum Produkt: überträgt das Gefühl der Herkunfts-Geschichte
 *  auf die Stücke, bevor der Shop-Link kommt (docs/handover-shopify-pool.md §4b). */
const ProductBridge = () => {
  const t = useTranslations('product_bridge');
  const tAlt = useTranslations('alt');
  const locale = useLocale() as Locale;
  const lines = t.raw('lines') as { name: string; text: string }[];

  // Bewusst ohne Trennung nach oben — wie die übrigen acht Abschnitte. Von den
  // zehn Abschnittsgrenzen der Startseite hatten nur zwei je eine Linie: diese
  // und die über der Fusszeile. Der Wechsel trägt sich selbst: py-24, Label,
  // Überschrift.
  return (
    <section id="stuecke" className="bg-bg py-24 md:py-32">
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
                  alt={tAlt(LINE_IMAGES[i].altKey)}
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
          <Button as="a" href={shopUrl(locale)} variant="primary">
            {t('cta')}
            <ArrowRight size={18} strokeWidth={1.5} />
          </Button>
        </Reveal>
      </MaxWidth>
    </section>
  );
};

export default ProductBridge;
