'use client';

import React from 'react';
import MaxWidth from './MaxWidth';
import { useTranslations } from 'next-intl';
import { Minus, Plus } from 'lucide-react';
import clsx from 'clsx';
import FancyGradient from './FancyGradient';

const Faq = () => {
  const t = useTranslations('faq_section');
  const faqItem = t.raw('items');

  const [isOpenIndex, setIsOpenIndex] = React.useState<number | null>(null);

  const toggle = (index: number) => {
    setIsOpenIndex(index === isOpenIndex ? null : index);
  };

  return (
    <div className='relative overflow-hidden'>
      <FancyGradient className='absolute -top-10 -left-44 -z-10 w-[200px] h-[200px] overflow-hidden' />
      <MaxWidth className='py-16'>
        <div className='flex flex-col items-center justify-center gap-4 text-center lg:max-w-[1000px] lg:mx-auto'>
          <h1
            data-aos='fade-up'
            data-aos-duration='1000'
            data-aos-delay='200'
            data-aos-anchor-placement='top-bottom'
            className='text-5xl md:text-5xl lg:text-[40px] font-newyork font-normal'
          >
            {t('title')}
          </h1>
          <p
            data-aos='fade-up'
            data-aos-duration='1000'
            data-aos-delay='400'
            data-aos-anchor-placement='top-bottom'
            className='text-lg md:text-xl lg:text-lg font-outfit font-normal'
          >
            {t('description')}
          </p>
        </div>

        <div className='lg:max-w-2/3 lg:mx-auto mt-8 lg:mt-16'>
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
                  className='border-b border-white/[10%] cursor-pointer'
                >
                  <div className='flex justify-between items-center py-4'>
                    <h2
                      className='text-lg md:text-xl lg:text-lg font-normal font-outfit'
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

                  <div
                    className={clsx(
                      'text-lg md:text-xl lg:text-lg overflow-hidden transition-all duration-300 ease-in-out font-normal font-outfit text-primary',
                      isOpen ? ' opacity-100 pb-4' : 'max-h-0 opacity-0',
                    )}
                  >
                    {faqItem.content}
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
