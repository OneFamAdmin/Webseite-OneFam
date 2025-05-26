import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import MaxWidth from './MaxWidth';
import FancyGradient from './FancyGradient';
import { MoveRight } from 'lucide-react';
// import Link from 'next/link';

const HeroSection = () => {
  const t = useTranslations('hero_section');
  return (
    <div className='relative   flex items-center lg:items-end overflow-hidden 2xl:py-16 '>
      <FancyGradient className=' absolute top-56 md:top-96 lg:top-16 -right-[300px] w-[350px] h-[350px] overflow-hidden' />

      <MaxWidth className='flex flex-col gap-16 lg:gap-32 pt-16 pb-12 lg:pb-5 '>
        <div className='flex flex-col items-center justify-between lg:flex-row gap-16 lg:gap-0 lg:min-w-[1050px]  max-w-[1350px] mx-auto '>
          <div className='w-full lg:w-2/3 xl:w-[70%] flex flex-col justify-between gap-16 lg:gap-32 '>
            <div className='relative  w-full flex flex-col items-center lg:items-start justify-center '>
              <h5
                className='pl-8 sm:pl-10 md:pl-[20px] lg:pl-[60px] -mb-2 sm:-mb-4 lg:-mb-[25px] text-[60px] md:text-[70px] lg:text-[120px] 2xl-1:text-[140px]  font-normal text-primary font-newyork leading-[100%] tracking-[-3%] capitalize'
                data-aos='fade-up'
                data-aos-duration='3000'
              >
                {t('wear_it')}
              </h5>
              <h1
                style={{
                  WebkitTextStroke: '1px #ffffff',
                  // textStroke: '1px #ffffff'
                }}
                className=' text-[60px] sm:text-[80px] md:text-[90px] lg:text-[100px] 2xl-1:text-[120px]  font-normal  font-newyork leading-[100%] tracking-[-3%] text-transparent capitalize'
                data-aos='fade-up'
                data-aos-duration='3000'
              >
                {t('support_it')}
              </h1>
              <h5
                className='pl-36 sm:pl-44 md:pl-[260px] lg:pl-[210px] 2xl-1:pl-[240px]  -mt-2 sm:-mt-4 lg:-mt-4  text-[40px] md:text-[50px] lg:text-[80px] 2xl-1:text-[100px]  font-normal text-primary font-newyork leading-[100%] tracking-[-3%] capitalize'
                data-aos='fade-up'
                data-aos-duration='3000'
              >
                {' '}
                {t('explore_it')}
              </h5>
            </div>
          </div>
          <div className=' lg:self-start '>
            <Image
              src={'/assets/hero.png'}
              alt='hero'
              width={250}
              height={350}
              data-aos='fade-up'
              data-aos-duration='2000'
              className='w-[247px] h-[300px] lg:w-[210px] lg:h-[260px] 2xl-1:w-[260px] 2xl-1:h-[320px] object-cover '
            />
          </div>
        </div>

        <div
          className='text-center mx-auto lg:mx-0 lg:text-start max-w-[350px]  lg:max-w-[350px] flex flex-col gap-4 pt-8'
          data-aos='fade-up'
          data-aos-duration='1000'
        >
          <p className=' text-lg md:text-xl lg:text-lg font-light font-outfit '>
            {t('join_onefam')}
          </p>
          <button className='group relative flex items-center justify-center lg:justify-start gap-2 text-lg md:text-xl lg:text-lg font-light font-outfit leading-[100%] tracking-[-3%] cursor-pointer'>
            <span className="relative before:content-[''] before:absolute before:left-0 before:-bottom-1 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-500 group-hover:before:w-full">
              {t('shop_now')}
            </span>
            <MoveRight className='w-7 h-7 lg:w-7 lg:h-7 transform transition-all duration-300 group-hover:translate-x-2' />
          </button>
        </div>

        {/* <Link
          href={'#vision'}
          className='flex justify-center items-center w-full lg:-mt-17 '
          data-aos='fade-up'
          data-aos-duration='2000'
        >
          <Image
            src={'/assets/down-arrow.svg'}
            alt='hero'
            width={48}
            height={48}
            className='cursor-pointer transition-transform duration-500 ease-in-out hover:skew-x-6 hover:skew-y-1 hover:-translate-y-2'
          />
        </Link> */}
      </MaxWidth>
    </div>
  );
};

export default HeroSection;
