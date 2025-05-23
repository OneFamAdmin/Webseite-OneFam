import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LoveSection from '@/components/LoveSection';
import PhilosophySection from '@/components/PhilosophySection';
import ProductsSection from '@/components/ProductsSection';
import VisionSection from '@/components/VisionSection';

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <VisionSection />
      <ProductsSection />
      <LoveSection /> 
      <PhilosophySection />
      <Faq />
      <Footer />
      
    </>
  );
}
