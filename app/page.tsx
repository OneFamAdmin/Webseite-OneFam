 
import CodeConduct from '@/components/CodeConduct';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer'; 
import HeroSection from '@/components/HeroSection';
import LoveSection from '@/components/LoveSection';
import PhilosophySection from '@/components/PhilosophySection';
import ProcessFlow from '@/components/ProcessFlow';
import ProductsSection from '@/components/ProductsSection';
// import StoryAndStats from '@/components/StoryAndStats';
import StraightTalk from '@/components/StraightTalk';
import VisionSection from '@/components/VisionSection';

export default function Home() {
  return (
    <> 
      <HeroSection />
      <VisionSection />
      <ProcessFlow />
      {/* <StoryAndStats /> */}
      <StraightTalk />
      <ProductsSection />
      <LoveSection /> 
      <PhilosophySection />
      <CodeConduct />
      <Faq />
      <Footer />
      
    </>
  );
}
