import React from 'react';
import MaxWidth from './MaxWidth';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

const PhilosophySection = () => {
  const t = useTranslations('philosophy_section');
  const locale = useLocale();
  return (
    <div className='relative text-black flex items-center overflow-hidden '>
      <div className='absolute inset-0 -z-10'>
        <Image
          src={'/assets/philosophy-bg.svg'}
          alt='philosophy'
          width={1920}
          height={1080}
          className='w-full h-full object-cover'
        />
      </div>
      <MaxWidth className='py-16 md-2:py-12  flex flex-col items-center justify-center lg:items-start lg:justify-start lg:flex-row '>
        <div className='basis-1/3 hidden lg:block '>
          <h2
            data-aos='fade-right'
            data-aos-duration='1000'
            data-aos-delay='200'
            data-aos-anchor-placement='top-bottom'
            className={`text-[120px] md-2:text-[120px] font-newyork font-normal text-right pt-20  uppercase 
              ${locale === 'es' ? '-mr-[337px]' : '-mr-[392px]'} 
              `}
          >
            {t('philo')}
            <span className='text-[#E5E5E5] z-0'>{t('sophy')}</span>
          </h2>
        </div>

        <Image
          src={'/assets/philosophy.png'}
          alt='hero'
          width={508}
          height={715}
          className='basis-1/3 z-10 hidden md-2:block'
          data-aos='zoom-in-up'
          data-aos-duration='1000'
        />
        <Image
          src={'/assets/philosophy.png'}
          alt='hero'
          width={366}
          height={516}
          className=' z-10 md-2:hidden'
          data-aos='zoom-in-up'
          data-aos-duration='1000'
        />
        <div className='pt-8 md:pt-10 lg:pt-0 2xl:pb-16  lg:self-end flex flex-col  gap-4 md-2:max-w-[500px] lg:basis-1/3 '>
          <h2
            data-aos='fade-left'
            data-aos-duration='1000'
            data-aos-delay='200'
            data-aos-anchor-placement='top-bottom'
            className={`
              ${
                locale !== 'en'
                ? 'text-[40px] xxs-1:text-[42px] xs:text-[44px] sm:text-[48px] font-semibold sm:font-normal '
                : 'text-[48px] font-normal'
              }
             xs:text-[48px] sm:text-[60px] md:text-[70px] md-2:text-[120px] font-newyork text-center md-2:text-left uppercase 
            ${locale === 'es' ? 'md-2:-ml-[310px]' : 'md-2:-ml-[400px]'}  
             `}
          >
            <span className='lg:text-[#E5E5E5] z-0'>{t('philo')}</span>
            {t('sophy')}
          </h2>
          <p
            data-aos='fade-up'
            data-aos-duration='1000'
            data-aos-delay='400'
            data-aos-anchor-placement='top-bottom'
            className=' font-light font-outfit leading-[100%] text-center  md-2:text-left md-2:-ml-[120px] md-2:mb-[115px] '
          >
            {t('description')}
          </p>
        </div>
      </MaxWidth>
    </div>
  );
};

export default PhilosophySection;
