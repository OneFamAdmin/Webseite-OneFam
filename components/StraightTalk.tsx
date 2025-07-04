import React from 'react';
import MaxWidth from './MaxWidth';
import { useLocale, useTranslations } from 'next-intl';
import { Check } from 'lucide-react';

const StraightTalk = () => {
  const t = useTranslations('straight_talk');
  const locale = useLocale();
  const straights = t.raw('straights');
  return (
    <div>
      <MaxWidth className='flex flex-col items-center justify-center gap-12 py-16 pt-20 md-2:pt-28'>
        <div>
          <h1
            className={`${
              locale !== 'en'
                ? 'text-[40px] xxs-1:text-[42px] xs:text-[44px] sm:text-[48px] font-semibold sm:font-normal '
                : 'text-[48px] font-normal'
            } sm:text-[48px] md:text-[55px] md-1:text-[60px] md-2:text-[80px]  lg:text-[80px] lg-1:text-[80px] xl-2:text-[80px] font-newyork text-center`}
            data-aos='fade-up'
            data-aos-duration='1000'
            data-aos-delay='200'
            data-aos-anchor-placement='top-bottom'
          >
            {t('title')}
          </h1>
          <p
            className='font-outfit font-light mt-4 md-2:mt-0 text-center '
            data-aos='fade-up'
            data-aos-duration='1000'
            data-aos-delay='400'
            data-aos-anchor-placement='top-bottom'
          >
            {t('description')}
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[910px]'>
          {straights.map(
            (item: { title: string; description: string }, index: number) => (
              <div
                key={index}
                className='grid grid-cols-12  bg-[#C131BF]/10 md:w-[437px] md:h-[157px] p-6'
                data-aos='fade-up'
                data-aos-duration='1000'
                data-aos-delay='600'
                data-aos-anchor-placement='top-bottom'
              >
                <div className='col-span-1 flex items-center justify-center bg-[#D9D9D9] w-[28px] h-[40px] rounded-[20px] '>
                  <Check className='text-black' />
                </div>
                <div className='col-span-11 space-y-2 pl-3'>
                  <h1 className='text-[24px] font-outfit font-normal'>
                    {item.title}
                  </h1>
                  <p className='font-outfit font-light'>{item.description}</p>
                </div>
              </div>
            ),
          )}
        </div>
      </MaxWidth>
    </div>
  );
};

export default StraightTalk;
