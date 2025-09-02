import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import MaxWidth from './MaxWidth';
import Image from 'next/image';
import FancyGradient from './FancyGradient';
// import { MoveRight } from 'lucide-react';

const VisionSection = () => {
  const t = useTranslations('vision_section');
  const locale = useLocale();
  return (
    <div
      id='vision'
      className='relative  xl:pt-28   ml-auto  flex lg:items-end  justify-center '
    >
      <FancyGradient className=' absolute w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] -top-10 lg:-top-20 left-0 md:left-[20%] lg:left-[40%]' />
      <div className='absolute inset-0 -z-10 h-[718px] hidden lg:block '>
        <Image
          src={'/assets/vision_bg.png'}
          alt='vission'
          width={628.64}
          height={718.01}
          // className='w-fit h-full float-right hidden lg:block'
          className="h-full w-auto object-contain float-right h"
          data-aos='fade-left'
          data-aos-duration='1000'
          data-aos-delay='200'
        /> 
      </div>
        <div className='absolute inset-0 -z-10 h-[600px] lg:hidden '>
        
        <Image
          // src={'/assets/vision_bg_mobile.svg'}
          src={'/assets/vesionbgMobile.png'}
          alt='vission'
          width={525}
          height={599}
          className='h-full w-auto object-contain float-right '
        />
      </div>
      <MaxWidth className='pb-4 lg:pb-0 pt-0 lg:pt-20 xl:pt-0 overflow-hidden'>
        <h1
          data-aos='fade-up'
          data-aos-duration='1000'
          data-aos-delay='800'
          data-aos-anchor-placement='top-bottom'
          className=' lg:hidden -ml-[157px] sm-ml-[160px] md:-ml-[295px]  -mt-4 text-[110px] xs:text-[130px] sm:text-[170px] md:text-[220px] whitespace-nowrap font-newyork font-normal 
         bg-gradient-to-r from-white/0 from-21.03% to-white/30 to-100% bg-clip-text text-transparent
          '
        >
          {t('title')} 
        </h1>
        <div className='flex flex-col justify-center items-center lg:justify-start lg:items-start gap-4 lg:max-w-[680px] '>
          <h2
            className={` ${
              locale !== 'en'
                ? 'text-[40px] xxs-1:text-[42px] xs:text-[44px] sm:text-[48px] font-semibold sm:font-normal '
                : 'text-[48px] font-normal'
            } sm:text-[48px] md:text-[55px] md-1:text-[60px] md-2:text-[80px]  lg:text-[80px] lg-1:text-[80px] xl-2:text-[80px] font-newyork leading-[100%] `}
            data-aos='fade-up'
            data-aos-duration='1000'
            data-aos-delay='200'
            data-aos-anchor-placement='top-bottom'
          >
            {t('title')}
          </h2>
          <h2
            className='text-[28px] md:text-[32px] md-1:text-[36px] md-2:text-[48px]  lg:text-[48px] lg-1:text-[48px] xl-2:text-[48px] font-outfit font-light text-center lg:text-start'
            data-aos='fade-up'
            data-aos-duration='1000'
            data-aos-delay='200'
            data-aos-anchor-placement='top-bottom'
          >
            {t('subTitle')}
          </h2>
          <p
            className='font-outfit font-light  text-center lg:text-start'
            data-aos='fade-up'
            data-aos-duration='1000'
            data-aos-delay='400'
            data-aos-anchor-placement='top-bottom'
          >
            {t('description1')}
          </p>
          <p
            className=' font-outfit font-light text-center lg:text-start'
            data-aos='fade-up'
            data-aos-duration='1000'
            data-aos-delay='400'
            data-aos-anchor-placement='top-bottom'
          >
            {t('description2')}
          </p>
          {/* <button
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
          </button> */}
        </div>
        <h1
          data-aos='fade-up'
          data-aos-duration='1000'
          data-aos-anchor-placement='left-center'
          className='leading-[100%] hidden lg:block lg:-ml-[300px] xl:-ml-[240px] lg:-mt-6 text-[60px] lg:text-[160px] xl:text-[160px] font-newyork font-normal 
         bg-gradient-to-r from-white/0 from-21.03% to-white/30 to-100% bg-clip-text text-transparent whitespace-nowrap pt-28
          '
        >
          {t('title')}
        </h1>
      </MaxWidth>
    </div>
  );
};

export default VisionSection;
