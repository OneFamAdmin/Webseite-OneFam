import { useTranslations } from 'next-intl';
import React from 'react';
import MaxWidth from './MaxWidth';
import Image from 'next/image';
import FancyGradient from './FancyGradient';
import { MoveRight } from 'lucide-react';

const VisionSection = () => {
  const t = useTranslations('vision_section');
  return (
    <div id='vision' className='relative  xl:pt-36 overflow-hidden  ml-auto  flex lg:items-end  justify-center '>
      <FancyGradient className=' absolute w-[380px] h-[380px] -top-80 lg:-top-72 left-0 md:left-[20%] lg:left-[40%]' />
      <div className='absolute inset-0 -z-10'>
        <Image
          src={'/assets/vision_bg.svg'}
          alt='vission'
          width={1920}
          height={1080}
          className='w-full h-full object-cover hidden lg:block'
          data-aos='fade-left'
          data-aos-duration='1000'
          data-aos-delay='200'
        />
        <Image
          src={'/assets/vision_bg_mobile.svg'}
          alt='vission'
          width={434}
          height={445}
          className='w-full h-full object-cover lg:hidden'
        />
      </div>
      <MaxWidth className='pb-4 lg:pb-0 pt-0 lg:pt-20 xl:pt-0 overflow-hidden'>
        <h1
          data-aos='fade-up'
          data-aos-duration='1000'
          data-aos-delay='800'
          data-aos-anchor-placement='top-bottom'
          className=' lg:hidden -ml-[157px] sm-ml-[160px] md:-ml-[295px]  -mt-4 text-[105px] sm:text-[110px] md:text-[220px] whitespace-nowrap font-newyork font-normal 
         bg-gradient-to-r from-white/0 from-21.03% to-white/30 to-100% bg-clip-text text-transparent whitespace-nowrap
          '
        >
          {t('title')}
        </h1>
        <div className='flex flex-col justify-center items-center lg:justify-start lg:items-start gap-8 lg:gap-4 lg:max-w-[620px] '>
          <h2
            className='text-5xl md:text-5xl lg:text-[40px] font-newyork font-normal'
            data-aos='fade-up'
            data-aos-duration='1000'
            data-aos-delay='200'
            data-aos-anchor-placement='top-bottom'
          >
            {t('title')}
          </h2>
          <p
            className='text-lg md:text-xl lg:text-lg font-outfit font-normal text-center lg:text-start'
            data-aos='fade-up'
            data-aos-duration='1000'
            data-aos-delay='400'
            data-aos-anchor-placement='top-bottom'
          >
            {t('description')}
          </p>
          <button
            className=' z-10 group relative text-lg md:text-xl lg:text-lg font-outfit font-normal flex items-center gap-2 cursor-pointer'
            data-aos='fade-up'
            data-aos-duration='1000'
            data-aos-delay='600'
            data-aos-anchor-placement='top-bottom'
          >
            <span className="relative before:content-[''] before:absolute before:left-0 before:-bottom-1 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-500 group-hover:before:w-full">
              {t('shop_now')}
            </span>
            <MoveRight className='transition-transform duration-300 group-hover:translate-x-2' />
          </button>
        </div>
        <h1
          data-aos='fade-up'
          data-aos-duration='1000'
          data-aos-delay='800'
          data-aos-anchor-placement='top-bottom'
          className='leading-[100%] hidden lg:block lg:-ml-[340px] xl:-ml-[350px] lg:-mt-6 text-[60px] lg:text-[200px] xl:text-[240px] font-newyork font-normal 
         bg-gradient-to-r from-white/0 from-21.03% to-white/30 to-100% bg-clip-text text-transparent whitespace-nowrap
          '
        >
          {t('title')}
        </h1>
      </MaxWidth>
    </div>
  );
};

export default VisionSection;
