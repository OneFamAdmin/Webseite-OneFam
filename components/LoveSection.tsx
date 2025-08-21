 
import Image from 'next/image';
import React from 'react';
import FancyGradient from './FancyGradient'; 

const LoveSection = () => { 
  return (
    <>
      {/* <div className='relative h-[1149px] '>
      <FancyGradient className='absolute top-40 left-0 lg:left-28 w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] overflow-hidden z-10' />
      <div className='absolute inset-0 z-0'> 
        <Image
          src={'/assets/wave.svg'}
          alt='love'
          width={2011}
          height={1149}
          className='w-full h-full object-cover'
        />
      </div>
    </div> */}
      <div className=' relative overflow-hidden -mt-36 sm:-mt-50 md:-mt-60 md-2:-mt-70  lg:-mt-96 lg-1:-mt-95 xl:-mt-100 2xl:-mt-120 2xl-1:-mt-120 z-0  '>
        <div className='relative h-[200px] xs:h-[300px] sm:h-[400px] md:h-[450px] md-1:h-[470px] md-2:h-[600px] lg:h-[600px] lg-1:h-[600px] lg-2:h-[600px] xl:h-[600px] 2xl:h-[700px] '>
          <FancyGradient className='absolute top-20 xxs:top-20 xs:top-35 sm:top-40 md:top-[210px] left-0 lg:top-[280px] lg:left-52 2xl:top-[300px]  w-[150px] h-[150px] xxs:w-[100px] xxs:h-[100px] sm:w-[150px] sm:h-[150px] lg:w-[200px] lg:h-[200px] overflow-hidden z-0' />
          <div className='absolute inset-0 z-20'>
            <Image
              src={'/assets/wave.svg'}
              alt='love'
              width={2011}
              height={1149}
              className='w-[1000px] lg:w-full lg:h-full object-cover z-20'
            />
          </div>
        </div>
        {/* <MaxWidth className='flex flex-col gap-16 lg:gap-4 lg:-mt-20 2xl:-mt-55  bg-transparent -z-30 '>
          <div className='relative  w-full flex flex-col items-center  justify-center'>
            <h2
              data-aos='fade-up'
              data-aos-duration='3000'
              className=' -mb-4 sm:-mb-7 lg:-mb-[40px] text-[52px] md:text-[70px] lg:text-[100.16px] font-normal text-primary font-newyork'
            >
              {t('one_love')}
            </h2>
            <h1
              data-aos='fade-up'
              data-aos-duration='3000'
              data-aos-delay='1000'
              data-aos-anchor-placement='top-bottom'
              data-aos-offset='200'
              style={{
                WebkitTextStroke: '1px #ffffff',
              }}
              className='text-[60px] sm:text-[80px] md:text-[100px] lg:text-[128px] font-normal  font-newyork leading-[100%] tracking-[-3%] text-transparent'
            >
              {t('one_culture')}
            </h1>
            <h3
              data-aos='fade-up'
              data-aos-duration='3000'
              data-aos-delay='2000'
              data-aos-anchor-placement='top-bottom'
              data-aos-offset='200'
              className=' pl-[30px] sm:pl-[130px] md:pl-[100px] lg:pl-[160px] xl:pl-[270px] xl-1:pl-[310px] xl-2:pl-[336px] xl-3:pl-[380px] 2xl:pl-[400px] 2xl-1:pl-[430px] -mt-1 lg:-mt-[30px] text-[40px] md:text-[70px] lg:text-[80px] font-normal text-primary font-newyork self-start'
            >
              {t('one_family')}
            </h3>
          </div>
          <div className='flex flex-col items-center justify-between lg:flex-row gap-16 lg:gap-4'>
            <p
              data-aos='fade-up'
              data-aos-duration='3000' 
              data-aos-delay='4000' 
              data-aos-anchor-placement='top-bottom'
              data-aos-offset='200'
              className='lg:w-1/2 text-center lg:text-left text-lg md:text-xl lg:text-lg font-light font-outfit'
            >
              {t('description')}
            </p>
            <button
              data-aos='fade-up'
              data-aos-duration='3000'
              data-aos-anchor-placement='top-bottom'
              className='group lg:self-end flex items-center justify-center lg:justify-start gap-2 text-lg md:text-xl lg:text-lg font-light font-outfit leading-[100%] tracking-[-3%] cursor-pointer relative'
            >
              <span className="relative inline-block before:content-[''] before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-500 group-hover:before:w-full">
                {t('shop_now')}
              </span>
              <MoveRight className='w-7 h-7 md:w-9 md:h-9 lg:w-7 lg:h-7 transform transition-transform duration-300 group-hover:translate-x-2' />
            </button>
          </div>
        </MaxWidth> */}
      </div>
 
    
    </>
  );
};

export default LoveSection;
