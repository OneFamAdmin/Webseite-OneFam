'use client';

import React from 'react';
import Slider from 'react-slick';
import MaxWidth from './MaxWidth';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { CustomArrowProps } from 'react-slick';
import { MoveRight } from 'lucide-react';
// import { MoveLeft, MoveRight } from 'lucide-react';

function SampleNextArrow({ className, style, onClick }: CustomArrowProps) {
  return (
    <>
      {/* for lg screen */}
      <div
        className={`${className}  !z-10 !hidden lg:!flex transition-all duration-300 hover:translate-x-2`}
        style={{
          ...style,
          right: '-200px', // override default right
          top: '40%',
          transform: 'translateY(-50%)',
          width: '100px',
          height: '100px',
        }}
        onClick={onClick}
      >
        <Image
          src={'/assets/right-arrow.svg'}
          alt='arrow'
          width={172}
          height={64}
          // className='w-[200px] h-[100px]'
        />
        {/* <MoveRight className='text-white w-10 h-10' /> */}
      </div>
      {/* for xs screen */}
      <div
        className={`${className}  !z-10 !flex sm:!hidden transition-all duration-300 hover:translate-x-2`}
        style={{
          ...style,
          right: '70px', // override default right
          top: '105%',
          transform: 'translateY(-50%)',
          width: '80px',
          height: '80px',
        }}
        onClick={onClick}
      >
        <Image
          src={'/assets/right-arrow.svg'}
          alt='arrow'
          width={172}
          height={64}
          // className='w-[200px] h-[100px]'
        />
        {/* <MoveRight className='text-white w-14 h-14' /> */}
      </div>
      {/* for md screen */}
      <div
        className={`${className}  !z-10 !hidden md:!flex lg:!hidden transition-all duration-300 hover:translate-x-2`}
        style={{
          ...style,
          right: '250px', // override default right
          top: '103%',
          transform: 'translateY(-50%)',
          width: '100px',
          height: '100px',
        }}
        onClick={onClick}
      >
        <Image
          src={'/assets/right-arrow.svg'}
          alt='arrow'
          width={172}
          height={64}
          // className='w-[200px] h-[100px]'
        />
        {/* <MoveRight className='text-white w-14 h-14' /> */}
      </div>
      {/* for sm screen */}
      <div
        className={`${className}  !z-10 !hidden sm:!flex md:!hidden transition-all duration-300 hover:translate-x-2`}
        style={{
          ...style,
          right: '180px', // override default right
          top: '103%',
          transform: 'translateY(-50%)',
          width: '100px',
          height: '100px',
        }}
        onClick={onClick}
      >
        <Image
          src={'/assets/right-arrow.svg'}
          alt='arrow'
          width={172}
          height={64}
          // className='w-[200px] h-[100px]'
        />
        {/* <MoveRight className='text-white w-14 h-14' /> */}
      </div>
    </>
  );
}

function SamplePrevArrow({ className, style, onClick }: CustomArrowProps) {
  return (
    <>
      {/* for lg screen */}
      <div
        className={`${className}  !z-10 !hidden lg:!flex transition-all duration-300 hover:-translate-x-2`}
        style={{
          ...style,
          left: '-200px', // override default left
          top: '40%',
          transform: 'translateY(-50%)',
          width: '100px',
          height: '100px',
        }}
        onClick={onClick}
      >
        <Image
          src={'/assets/left-arrow.svg'}
          alt='arrow'
          width={172}
          height={64}
        />
        {/* <MoveLeft className='text-white w-10 h-10' /> */}
      </div>
      {/* for xs screen */}
      <div
        className={`${className}  !z-10 !flex sm:!hidden transition-all duration-300 hover:-translate-x-2`}
        style={{
          ...style,
          left: '70px', // override default left
          top: '105%',
          transform: 'translateY(-50%)',
          width: '80px',
          height: '80px',
        }}
        onClick={onClick}
      >
        <Image
          src={'/assets/left-arrow.svg'}
          alt='arrow'
          width={172}
          height={64}
        />
        {/* <MoveLeft className='text-white w-14 h-14' /> */}
      </div>
      {/* for md screen */}
      <div
        className={`${className}  !z-10 !hidden md:!flex lg:!hidden transition-all duration-300 hover:-translate-x-2`}
        style={{
          ...style,
          left: '250px', // override default left
          top: '103%',
          transform: 'translateY(-50%)',
          width: '100px',
          height: '100px',
        }}
        onClick={onClick}
      >
        <Image
          src={'/assets/left-arrow.svg'}
          alt='arrow'
          width={172}
          height={64}
        />
        {/* <MoveLeft className='text-white w-14 h-14' /> */}
      </div>
      {/* for sm screen */}
      <div
        className={`${className}  !z-10 !hidden sm:!flex md:!hidden transition-all duration-300 hover:-translate-x-2`}
        style={{
          ...style,
          left: '180px', // override default left
          top: '103%',
          transform: 'translateY(-50%)',
          width: '100px',
          height: '100px',
        }}
        onClick={onClick}
      >
        <Image
          src={'/assets/left-arrow.svg'}
          alt='arrow'
          width={172}
          height={64}
        />
        {/* <MoveLeft className='text-white w-14 h-14' /> */}
      </div>
    </>
  );
}

const ProductsSection = () => {
  const t = useTranslations('products_section');
  const locale = useLocale();

  const settings = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    // arrows: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const images = [
    '/assets/6.png',
    '/assets/1.png',
    '/assets/2.png',
    '/assets/3.png',
    '/assets/4.png',
    '/assets/5.png',
    '/assets/7.png',
    '/assets/8.png',
    '/assets/9.png',
    '/assets/10.png',
    '/assets/11.png',
    '/assets/12.png',
    '/assets/14.png',
    '/assets/15.png',
  ];

  return (
    <div className='  py-14 lg:py-16 z-10 overflow-hidden relative  '>
      <MaxWidth>
        <div className='flex flex-col justify-center items-center max-w-[950px] mx-auto gap-4'>
          <h1
            data-aos='fade-up'
            data-aos-duration='3000'
            data-aos-anchor-placement='top-bottom'
            data-aos-offset='200'
            className={`${
              locale !== 'en'
                ? 'text-[40px] xxs-1:text-[42px] xs:text-[44px] sm:text-[48px] font-semibold sm:font-normal '
                : 'text-[48px] font-normal'
            } sm:text-[48px] md:text-[55px] md-1:text-[60px] md-2:text-[80px]  lg:text-[80px] lg-1:text-[80px] xl-2:text-[80px] font-newyork leading-[100%]`}
          >
            {t('title')}
          </h1>
          <h2
            data-aos='fade-up'
            data-aos-duration='3000'
            data-aos-anchor-placement='top-bottom'
            data-aos-offset='200'
            className='text-[28px] md:text-[32px] md-1:text-[36px] md-2:text-[48px] lg:text-[48px] lg-1:text-[48px] xl-2:text-[48px] font-outfit font-light text-center'
          >
            {t('subTitle')}
          </h2>
          <p
            data-aos='fade-up'
            data-aos-duration='3000'
            data-aos-anchor-placement='top-bottom'
            data-aos-offset='200'
            className='font-outfit font-light text-center'
          >
            {t('description')}
          </p>
        </div>
        <div className='slider-container w-full  lg:w-[474px] h-[474px] md:h-[490px] lg:h-[474px] rounded-lg mx-auto mt-10'>
          <Slider {...settings}>
            {images?.map((img, i) => {
              return (
                <div
                  key={i}
                  className='  '
                >
                  <Image
                    src={img}
                    alt='products'
                    width={474}
                    height={474}
                    className='lg:w-full lg:h-full object-cover rounded-lg  mx-auto'
                    data-aos='zoom-in-down'
                    data-aos-duration='3000'
                    data-aos-anchor-placement='top-bottom'
                    data-aos-offset='200'
                  />
                </div>
              );
            })}
          </Slider>
        </div>
        <div
          data-aos='zoom-in-up'
          data-aos-duration='2000'
          className=' mt-10 xs:mt-20 md-2:mt-10 bg-gradient-to-r  from-[#EF8031] via-[#EB356A] to-[#FAD649] p-px pb-[4px] w-full md-2:w-fit mx-auto'
        >
          <button className='group relative bg-background flex items-center justify-center lg:justify-start gap-2 text-lg md:text-xl lg:text-lg font-light font-outfit leading-[100%] tracking-[-3%] cursor-pointer py-2 px-14 w-full md-2:w-fit'>
            <span className="relative before:content-[''] before:absolute before:left-0 before:-bottom-1 before:h-[2px] before:w-0 before:bg-white before:transition-all before:duration-500 group-hover:before:w-full">
              {t('shop_now')}
            </span>
            <MoveRight className='w-7 h-7 lg:w-7 lg:h-7 transform transition-all duration-300 group-hover:translate-x-2' />
          </button>
        </div>
      </MaxWidth>
    </div>
  );
};

export default ProductsSection;
