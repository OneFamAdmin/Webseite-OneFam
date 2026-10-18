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
      <Nav ueberHero />
      <main>
        {/* Reihenfolge seit 18.10.2026 "Roter Faden" — jeder Abschnitt beantwortet die
            Frage, die der Besucher genau dann im Kopf hat (von Labi in der Vorschau
            gewählt):
              bin ich gemeint → was ist das → warum berührt mich das → will ich das
              haben → will ich dazugehören → gehöre ich dazu → wohin geht das →
              gibt es einen Haken → ich bin dabei.
            Vorher stand die Vision an zweiter Stelle: noch bevor Vertrauen da war,
            und beginnend mit Einschränkungen („noch kein Angebot", „nichts wird
            verlost"). Weiter hinten lesen sich dieselben Sätze als Ehrlichkeit.
            Die Geschichte stand an fünfter, die Stücke an sechster Stelle. */}
        <Hero />
        <WhatIsOneFam />
        {/* "So funktioniert OneFam" (HowItWorks) ist raus: seit der Umstellung auf
            Vision + Warteliste gab es keine Mechanik mehr zu erklären, und alle fünf
            Schritte standen bereits in WhatIsOneFam, TravelPool oder im FAQ.
            Komponente + i18n-Keys bleiben geparkt. */}
        <WhyWeDoThis />
        {/* Story → Produkt: die Brücke steht direkt nach der Herkunfts-Geschichte,
            solange das Gefühl noch trägt — dann erst der Shop-Link. */}
        <ProductBridge />
        <Philosophy />
        <Values />
        <TravelPool />
        {/* <DestinationVote /> ist am 10.08.2026 raus. Der Block blendete sich zwar nur ein,
            wenn eine Abstimmungsrunde offen war, sein Knopf führte aber auf /reiseziel —
            und diese Seite gibt es nicht mehr. Komponente bleibt im Repo geparkt. */}
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
