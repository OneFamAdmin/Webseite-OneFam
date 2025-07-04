'use client';

import React from 'react';
import MaxWidth from './MaxWidth';
import { useLocale, useTranslations } from 'next-intl';
import { Minus, Plus } from 'lucide-react';
import clsx from 'clsx';
// import FancyGradient from './FancyGradient';

const Faq = () => {
  const t = useTranslations('faq_section');
  const locale = useLocale();
  const faqItem = t.raw('items');

  const [isOpenIndex, setIsOpenIndex] = React.useState<number | null>(null);

  const toggle = (index: number) => {
    setIsOpenIndex(index === isOpenIndex ? null : index);
  };

  return (
    <div className='relative overflow-hidden'>
      {/* <FancyGradient className='absolute -top-10 -left-44 -z-10 w-[200px] h-[200px] overflow-hidden' /> */}
      <MaxWidth className='py-16'>
        <div className='flex flex-col items-center justify-center gap-4 text-center lg:max-w-[1000px] lg:mx-auto'>
          <h1
            data-aos='fade-up'
            data-aos-duration='2000'
            data-aos-delay='200'
            data-aos-anchor-placement='top-bottom'
            className={`${
              locale !== 'en'
                ? 'text-[40px] xxs-1:text-[42px] xs:text-[44px] sm:text-[48px] font-semibold sm:font-normal '
                : 'text-[48px] font-normal'
            } sm:text-[48px] md:text-[55px] md-1:text-[60px] md-2:text-[80px]  lg:text-[80px] lg-1:text-[80px] xl-2:text-[80px] font-newyork `}
          >
            {t('title')}
          </h1>
          <p
            data-aos='fade-up'
            data-aos-duration='1000'
            data-aos-delay='400'
            data-aos-anchor-placement='top-bottom'
            className='font-outfit font-light  text-center max-w-[531px] mx-auto'
          >
            {t('description')}
          </p>
        </div>

        <div className='lg:max-w-[863px] lg:mx-auto mt-8 lg:mt-16 '>
          {faqItem?.map(
            (
              faqItem: {
                title: string;
                content: string;
              },
              i: number,
            ) => {
              const isOpen = i === isOpenIndex;

              return (
                <div
                  key={i}
                  onClick={() => toggle(i)}
                  className=' rounded-[12px] cursor-pointer my-4 p-0.5 '
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(107, 70, 241, 0.2), rgba(239, 128, 49, 0.2))',
                  }}
                >
                  <div className=' h-full w-full md-2:min-w-[863px] bg-black rounded-[12px] '>
                    <div
                      className='  rounded-[12px] '
                      style={{
                        backgroundImage:
                          'linear-gradient(to right, rgba(239, 128, 49, 0.1), rgba(235, 53, 106, 0.1), rgba(250, 214, 73, 0.1))',
                      }}
                    >
                      <div className='flex justify-between items-center gap-3  min-h-[68px] md-2:min-h-[65px] px-2.5 md-2:px-4.5'>
                        <h2
                          className=' text-[16px] md-2:text-[17px] font-light font-outfit'
                          data-aos='fade-right'
                          data-aos-duration='1000'
                          data-aos-delay='600'
                        >
                          {faqItem.title}
                        </h2>
                        <div
                          data-aos='fade-left'
                          data-aos-duration='1000'
                          data-aos-delay='600'
                        >
                          {isOpen ? (
                            <Minus className='w-5 h-5 text-white' />
                          ) : (
                            <Plus className='w-5 h-5 text-white' />
                          )}
                        </div>
                      </div>
                      {isOpen && (
                        <hr className='h-px w-[94.5%] text-white/10 mx-auto mb-2.5 -mt-2' />
                      )}
                      <div
                        className={clsx(
                          'text-[15px] md-2:text-[16px] px-2.5 md-2:px-4.5 font-light font-outfit overflow-hidden transition-all duration-300 ease-in-out text-primary',
                          isOpen ? ' opacity-100 pb-4' : 'max-h-0 opacity-0',
                        )}
                      >
                        {faqItem.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </MaxWidth>
    </div>
  );
};

export default Faq;
