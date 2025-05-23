'use client';

import React from 'react';
import Slider from 'react-slick';
import MaxWidth from './MaxWidth';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { CustomArrowProps } from 'react-slick';
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
          <h2
            data-aos='fade-up'
            data-aos-duration='3000'
            data-aos-anchor-placement='top-bottom'
            data-aos-offset='200'
            className='text-5xl md:text-5xl lg:text-[40px] font-newyork font-normal'
          >
            {locale === 'es' ? (
              <>
                <span className='sm:hidden'>{t('title_mobile')}</span>
                <span className='hidden sm:inline'>{t('title')}</span>
              </>
            ) : (
              t('title')
            )}
          </h2>
          <p
            data-aos='fade-up'
            data-aos-duration='3000'
            data-aos-anchor-placement='top-bottom'
            data-aos-offset='200'
            className='text-lg md:text-xl lg:text-lg font-outfit font-normal text-center'
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
      </MaxWidth>
    </div>
  );
};

export default ProductsSection;
