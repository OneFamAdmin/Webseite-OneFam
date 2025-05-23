import React from 'react';
import MaxWidth from './MaxWidth';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const PhilosophySection = () => {
  const t = useTranslations('philosophy_section');
  return (
    <div className='relative text-black  flex items-center overflow-hidden'>
       <div className='absolute inset-0 -z-10'>
             <Image
               src={'/assets/philosophy-bg.svg'}
               alt='philosophy'
               width={1920}
               height={1080}
               className='w-full h-full object-cover'  
             /> 
           </div>
      <MaxWidth className='py-16 flex flex-col items-center justify-center lg:items-start lg:justify-start lg:flex-row '>
        <div className='basis-1/3 hidden lg:block'>
          <h2
            data-aos='fade-right'
            data-aos-duration='1000'
            data-aos-delay='200'
            data-aos-anchor-placement='top-bottom'
            className='text-3xl lg:text-[80px] font-newyork font-normal text-right pt-32 -mr-65 xl:-mr-65 2xl:pt-36 uppercase '
          >
            {t('philo')}
            <span className='text-[#E5E5E5] z-0'>{t('sophy')}</span>
          </h2>
        </div>

        <Image
          src={'/assets/philosophy.png'}
          alt='hero'
          width={400}
          height={600}
          className='basis-1/3 z-10 '
          data-aos='zoom-in-up' 
          data-aos-duration='1000'

        />
        <div className='pt-8 md:pt-10 lg:pt-0 2xl:pb-16  lg:self-end flex flex-col  gap-4 lg:max-w-[500px] lg:basis-1/3 '>
          <h2
            data-aos='fade-left'
            data-aos-duration='1000'
            data-aos-delay='200'
            data-aos-anchor-placement='top-bottom'
            className='text-[58px] sm:text-[70px] md:text-7xl lg:text-[80px] font-newyork font-normal text-center lg:text-left uppercase lg:-ml-65 xl:-ml-72'
          >
            <span className='lg:text-[#E5E5E5] z-0'>{t('philo')}</span>
            {t('sophy')} 
          </h2>
          <p
            data-aos='fade-up' 
            data-aos-duration='1000'
            data-aos-delay='400'
            data-aos-anchor-placement='top-bottom'
            className='text-lg md:text-xl lg:text-lg font-light font-outfit text-center lg:text-left'
          >
            {t('description')}
          </p>
        </div>
      </MaxWidth>
    </div>
  );
};

export default PhilosophySection;
