import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import Hero from '@/components/Hero';
import WhatIsOneFam from '@/components/WhatIsOneFam';
import TravelPool from '@/components/TravelPool';
import Values from '@/components/Values';
import Philosophy from '@/components/Philosophy';
import WhyWeDoThis from '@/components/WhyWeDoThis';
import ProductBridge from '@/components/ProductBridge';
import Faq from '@/components/Faq';
import FinalCta from '@/components/FinalCta';

// Der Inhalt der Startseite liegt hier und nicht mehr in app/page.tsx, weil es
// seit dem Sprachrouting zwei Einstiegspunkte gibt: app/page.tsx für Englisch
// (ohne Präfix) und app/[locale]/page.tsx für /de, /fr, /es. Beide rendern
// dieselbe Seite; die Sprache kommt über next-intl aus dem Kontext, nicht aus
// den Komponenten. Deshalb steht hier kein einziges Sprachkürzel.
export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhatIsOneFam />
        {/* "So funktioniert OneFam" (HowItWorks) ist raus: seit der Umstellung auf
            Vision + Warteliste gab es keine Mechanik mehr zu erklären, und alle fünf
            Schritte standen bereits in WhatIsOneFam, TravelPool oder im FAQ.
            Komponente + i18n-Keys bleiben geparkt. */}
        <TravelPool />
        {/* <DestinationVote /> ist am 10.08.2026 raus. Der Block blendete sich zwar nur ein,
            wenn eine Abstimmungsrunde offen war, sein Knopf führte aber auf /reiseziel —
            und diese Seite gibt es nicht mehr. Komponente bleibt im Repo geparkt. */}
        <Values />
        <Philosophy />
        <WhyWeDoThis />
        {/* Story → Produkt: die Brücke steht direkt nach der Herkunfts-Geschichte,
            solange das Gefühl noch trägt — dann erst der Shop-Link. */}
        <ProductBridge />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
