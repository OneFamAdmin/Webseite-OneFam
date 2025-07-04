import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import MaxWidth from './MaxWidth';
import FancyGradient from './FancyGradient';
// import { MoveRight } from 'lucide-react';
import Header from './Header';
// import Link from 'next/link';

const HeroSection = () => {
  const t = useTranslations('hero_section');
  return (
    <div className='relative overflow-hidden py-8 2xl:py-16 '>
      <MaxWidth className=''>
        <Header />
      </MaxWidth>

      <FancyGradient className=' absolute top-[480px] md:top-[500px] lg:top-60 -right-[50px] md-2:-right-[300px] w-[150px] h-[150px] md-2:w-[350px] md-2:h-[350px] overflow-hidden' />

      <MaxWidth className='flex flex-col items-center md-2:items-start justify-center md-2:justify-start gap-12 md-2:gap-0 md-2:flex-row pt-[50px] md-2:pt-[132px] pb-[50px] md-2:pb-[80px]'>
        <div className='flex flex-col items-start w-full md-2:w-[44%] '>
          <h1
            className='font-newyork text-[40px] sm:text-[40px] md:text-[40px] md-1:text-[43px] md-2:text-[43px] lg:text-[60px]  lg-1:text-[70px] lg-2:text-[80px] xl:text-[90px] xl-1:text-[98px] xl-2:text-[100px]  '
            data-aos='fade-up'
            data-aos-duration='1000'
          >
            {t('one_love')}
          </h1>
          <div className='relative w-fit'>
            {/* Stroke layer */}
            <h2
              className='font-newyork text-[57px] sm:text-[57px] md:text-[57px] md-1:text-[60px] md-2:text-[60px] lg:text-[70px]  lg-1:text-[80px] lg-2:text-[90px] xl:text-[95px] xl-1:text-[102px] xl-2:text-[110px]   text-transparent absolute top-0 left-0 z-0'
              style={{
                WebkitTextStroke: '5px transparent',
                background: 'linear-gradient(to right, #FAD649, #7942E8)',
                WebkitBackgroundClip: 'text',
              }}
              data-aos='fade-up'
              data-aos-duration='2000'
            >
              {t('one_culture')}
            </h2>

            {/* Fill layer */}
            <h2
              className='font-newyork text-[57px] sm:text-[57px] md:text-[57px] md-1:text-[60px] md-2:text-[60px] lg:text-[70px]  lg-1:text-[80px] lg-2:text-[90px] xl:text-[95px] xl-1:text-[102px] xl-2:text-[110px]    text-primary relative z-10'
              data-aos='fade-up'
              data-aos-duration='2000'
            >
              {t('one_culture')}
            </h2>
          </div>
          <div className='md-2:hidden self-center'>
            {/* <Image
              src={'/assets/hero-onefam1.svg'}
              alt='hero'
              width={424}
              height={134}
              data-aos='fade-up'
              data-aos-duration='2000'
              className=' w-full h-full '
            /> */}
            <div className='relative w-fit'>
              {/* Stroke layer - this creates the gradient outline */}
              <h2
                className='font-newyork text-[57px] sm:text-[57px] md:text-[57px] md-1:text-[60px] md-2:text-[60px] lg:text-[70px] lg-1:text-[80px] lg-2:text-[90px] xl:text-[90px] xl-1:text-[90px] xl-2:text-[90px] text-transparent absolute top-0 left-0 z-0'
                style={{
                  WebkitTextStroke: '2px transparent',
                  background: 'linear-gradient(to right, #FAD649, #7942E8)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }}
                data-aos='fade-up'
                data-aos-duration='2000'
              >
                {t('one_fam')}
              </h2>

              {/* Fill layer - this creates the solid text */}
              <h2
                className='font-newyork text-[57px] sm:text-[57px] md:text-[57px] md-1:text-[60px] md-2:text-[60px] lg:text-[70px] lg-1:text-[80px] lg-2:text-[90px] xl:text-[90px] xl-1:text-[90px] xl-2:text-[90px] text-transparent relative z-10'
                style={{
                  background:
                    'linear-gradient(to right, #000000, #6B46F1, #C131BF, #EB356A, #EF8031, #FAD649)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }}
                data-aos='fade-up'
                data-aos-duration='2000'
              >
                {t('one_fam')}
              </h2>
            </div>
          </div>
          <p
            className='font-outfit font-light mt-2 text-center lg:text-start'
            data-aos='fade-up'
            data-aos-duration='1000'
          >
            {t('description')}
          </p>
        </div>
        <div className=''>
          <Image
            src={'/assets/hero1.svg'}
            alt='hero'
            width={228}
            height={276}
            data-aos='fade-up'
            data-aos-duration='2000'
          />
        </div>
        <div className='hidden md-2:block md-2:self-center mt-5  '>
          {/* <Image
            src={'/assets/hero-onefam1.svg'}
            alt='hero'
            width={424}
            height={134}
            data-aos='fade-left'
            data-aos-duration='2000'
            className=' w-full h-full'
          /> */}
          <div className='relative w-fit'>
            {/* Stroke layer - this creates the gradient outline */}
            <h2
              className='font-newyork text-[57px] sm:text-[57px] md:text-[57px] md-1:text-[60px] md-2:text-[60px] lg:text-[70px] lg-1:text-[80px] lg-2:text-[90px] xl:text-[95px] xl-1:text-[100px] xl-2:text-[100px] text-transparent absolute top-0 left-0 z-0'
              style={{
                WebkitTextStroke: '2px transparent',
                background: 'linear-gradient(to right, #FAD649, #7942E8)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
              data-aos='fade-up'
              data-aos-duration='2000'
            >
              {t('one_fam')}
            </h2>

            {/* Fill layer - this creates the solid text */}
            <h2
              className='font-newyork text-[57px] sm:text-[57px] md:text-[57px] md-1:text-[60px] md-2:text-[60px] lg:text-[70px] lg-1:text-[80px] lg-2:text-[90px] xl:text-[95px] xl-1:text-[100px] xl-2:text-[100px] text-transparent relative z-10'
              style={{
                background:
                  'linear-gradient(to right, #000000, #6B46F1, #C131BF, #EB356A, #EF8031, #FAD649)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
              data-aos='fade-up'
              data-aos-duration='2000'
            >
              {t('one_fam')}
            </h2>
          </div>
        </div>
      </MaxWidth>
    </div>
  );
};

export default HeroSection;
