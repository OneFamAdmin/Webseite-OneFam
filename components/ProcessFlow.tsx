import React from 'react';
import MaxWidth from './MaxWidth';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import FancyGradient from './FancyGradient';

const ProcessFlow = () => {
  const t = useTranslations('process_flow');
  const process = t.raw('process');
  const locale = useLocale();

  const tripArray = [
    {
      title: t('tripCovered'),
      count: '100%',
    },
    {
      title: t('adventures'),
      count: '01',
    },
    {
      title: t('members'),
      count: '1000+',
    },
  ];

  const fullProcess = [
    {
      image: '/assets/shop-work.svg',
    },
    {
      image: '/assets/vote-work.svg',
    },
    {
      image: '/assets/fly-work.svg',
    },
  ];

  const newPrcess = process.map(
    (item: { title: string; description: string }, index: number) => {
      const img = fullProcess[index].image;
      return {
        title: item.title,
        description: item.description,
        image: img,
      };
    },
  );

  return (
    <div className='relative '>
      <div className='absolute inset-0 hidden md-2:block'>
        <Image
          src={'/assets/fly-image.svg'}
          alt='fly'
          width={1435}
          height={1047}
          className='w-full h-full'
        />
      </div>

      <div className='relative '>
        <div className='flex flex-col items-center justify-center gap-8 py-20 md-2:py-[140px]'>
          <MaxWidth className='flex flex-col items-center justify-center gap-8'>
            <div className='flex flex-col items-center'>
              <h1
                data-aos='fade-up'
                data-aos-duration='1000'
                data-aos-delay='200'
                data-aos-anchor-placement='top-bottom'
                className={`${
                  locale !== 'en'
                ? 'text-[40px] xxs-1:text-[42px] xs:text-[44px] sm:text-[48px] font-semibold sm:font-normal '
                : 'text-[48px] font-normal'
                } sm:text-[48px] md:text-[55px] md-1:text-[60px] md-2:text-[80px]  lg:text-[80px] lg-1:text-[80px] xl-2:text-[80px] font-newyork font-normal text-center`}
              >
                {t('title')}
              </h1>
              <h2
                data-aos='fade-up'
                data-aos-duration='1000'
                data-aos-delay='200'
                data-aos-anchor-placement='top-bottom'
                className='text-[28px] md:text-[32px] md-1:text-[36px] md-2:text-[48px]  lg:text-[48px] lg-1:text-[48px] xl-2:text-[48px] font-outfit font-light text-center'
              >
                {t('subTitle')}
              </h2>
            </div>
            <div className='space-y-4'>
              <p
                data-aos='fade-up'
                data-aos-duration='1000'
                data-aos-delay='300'
                data-aos-anchor-placement='top-bottom'
                className='font-outfit font-light  text-center'
              >
                {t('description')}
              </p>
            </div>
          </MaxWidth>
          <div className='relative'>
            <div className='absolute inset-0  md-2:hidden'>
              <Image
                src={'/assets/fly-image-mobile.svg'}
                alt='fly'
                width={651}
                height={475}
                className='w-full h-full'
              />
            </div>

            <MaxWidth className='flex flex-wrap justify-center gap-12 mt-6'>
              {newPrcess?.map(
                (
                  item: { title: string; description: string; image: string },
                  index: number,
                ) => (
                  <div
                    key={index}
                    className='bg-[#C131BF]/17 md-2:bg-[#C131BF]/10 flex flex-col items-center justify-center w-[332px] min-h-[248px] p-6'
                  >
                    <div
                      className=' w-[50px] h-[50px]  rounded-full flex items-center justify-center'
                      style={{
                        // backgroundImage: 'linear-gradient(-15deg, #FAD649, #EB356A, #6B46F1, #EF8031, #EF8031)',
                        backgroundImage:
                          'linear-gradient(-15deg, rgba(250, 214, 73, 0.2), rgba(235, 53, 106, 0.2), rgba(107, 70, 241, 0.2), rgba(239, 128, 49, 0.2), rgba(239, 128, 49, 0.2))',
                      }}
                      data-aos='fade-up'
                      data-aos-duration='1000'
                      data-aos-delay='200'
                      data-aos-anchor-placement='top-bottom'
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={32}
                        height={32}
                        className='w-[32px] h-[32px]'
                      />
                    </div>

                    <h2
                      data-aos='fade-up'
                      data-aos-duration='1000'
                      data-aos-delay='200'
                      data-aos-anchor-placement='top-bottom'
                      className='text-[40px] font-newyork font-normal text-center'
                    >
                      {item.title}
                    </h2>
                    <p
                      data-aos='fade-up'
                      data-aos-duration='1000'
                      data-aos-delay='400'
                      data-aos-anchor-placement='top-bottom'
                      className='font-outfit font-light text-center'
                    >
                      {item.description}
                    </p>
                  </div>
                ),
              )}
            </MaxWidth>
          </div>
        </div>
      </div>

      <div className='relative -z-10  '>
        <FancyGradient className='absolute top-0 -left-0 w-[50px] h-[600px] overflow-hidden ' />
        <FancyGradient className='absolute top-0 -right-0  w-[50px] h-[600px]  overflow-hidden ' />
        <MaxWidth className='flex flex-col items-center justify-center gap-8 py-16'>
          <div className='flex flex-col items-center'>
            <h1
              data-aos='fade-up'
              data-aos-duration='1000'
              data-aos-delay='200'
              data-aos-anchor-placement='top-bottom'
              className={`${
                locale !== 'en'
                ? 'text-[40px] xxs-1:text-[42px] xs:text-[44px] sm:text-[48px] font-semibold sm:font-normal '
                : 'text-[48px] font-normal'
              } sm:text-[48px] md:text-[55px] md-1:text-[60px] md-2:text-[80px]  lg:text-[80px] lg-1:text-[80px] xl-2:text-[80px] font-newyork font-normal text-center`}
            >
              {t('title_story')}
            </h1>
            <h2
              data-aos='fade-up'
              data-aos-duration='1000'
              data-aos-delay='200'
              data-aos-anchor-placement='top-bottom'
              className='text-[28px] md:text-[32px] md-1:text-[36px] md-2:text-[48px]  lg:text-[48px] lg-1:text-[48px] xl-2:text-[48px] font-outfit font-light text-center'
            >
              {t('subTitle_story')}
            </h2>
          </div>
          <div className='space-y-4 max-w-[942px] '>
            <p
              data-aos='fade-up'
              data-aos-duration='2000'
              data-aos-delay='400'
              data-aos-anchor-placement='top-bottom'
              className='font-outfit font-light  text-center '
            >
              {t('description1')}
            </p>
            <p
              data-aos='fade-up'
              data-aos-duration='1000'
              data-aos-delay='400'
              data-aos-anchor-placement='top-bottom'
              className='font-outfit font-light  text-center  '
            >
              {t('description2')}
            </p>
          </div>
          <div className=' grid grid-cols-2 md-2:grid-cols-3 gap-4 mt-6'>
            {tripArray?.map((trip, index) => (
              <div
                key={index}
                className={`bg-[#C131BF]/10 flex flex-col items-center justify-center px-8 py-2  ${
                  tripArray.length - 1 === index
                    ? 'col-span-2 md-2:col-span-1'
                    : ''
                }`}
              >
                <p
                  data-aos='fade-up'
                  data-aos-duration='1000'
                  data-aos-delay='400'
                  data-aos-anchor-placement='top-bottom'
                  className=' text-[24px] font-normal font-outfit  text-center'
                >
                  {trip.count}
                </p>
                <h4
                  data-aos='fade-up'
                  data-aos-duration='2000'
                  data-aos-delay='200'
                  data-aos-anchor-placement='top-bottom'
                  className='font-outfit font-light text-center'
                >
                  {trip.title}
                </h4>
              </div>
            ))}
          </div>
        </MaxWidth>
      </div>
    </div>
  );
};

export default ProcessFlow;
