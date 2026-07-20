import Nav from '@/components/Nav';
import SiteFooter from '@/components/SiteFooter';
import Hero from '@/components/Hero';
import WhatIsOneFam from '@/components/WhatIsOneFam';
import HowItWorks from '@/components/HowItWorks';
import TravelPool from '@/components/TravelPool';
import DestinationVote from '@/components/DestinationVote';
import Values from '@/components/Values';
import Philosophy from '@/components/Philosophy';
import WhyWeDoThis from '@/components/WhyWeDoThis';
import ProductBridge from '@/components/ProductBridge';
import Faq from '@/components/Faq';
import FinalCta from '@/components/FinalCta';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhatIsOneFam />
        <HowItWorks />
        <TravelPool />
        <DestinationVote />
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
