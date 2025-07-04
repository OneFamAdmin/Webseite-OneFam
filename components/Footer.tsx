// components/Footer.tsx

"use client";

import React from 'react';
import MaxWidth from './MaxWidth';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import ImprintDialog from './ImprintDialog';

const Footer = () => {
  const t = useTranslations('footer');
  const [imprintDialogOpen, setImprintDialogOpen] = React.useState(false);

  const openImprintDialog = () => {
    setImprintDialogOpen(!imprintDialogOpen);
  };

  const socialLinks = [
    {
      name: 'facebook',
      icon: '/assets/facebook.svg',
      url: 'https://www.facebook.com/profile.php?id=61568690728641',
    },
    {
      name: 'whatsapp',
      icon: '/assets/whatsapp.svg',
      url: 'https://api.whatsapp.com/message/CXRNI6YIROSTD1?autoload=1&app_absent=0',
    },
    {
      name: 'instagram',
      icon: '/assets/instagram.svg',
      url: 'https://www.instagram.com/onefam_official/?igsh=MXRlb3JqOTJ1ejFhNA%3D%3D&utm_source=qr#',
    },
    {
      name: 'telegram',
      icon: '/assets/fly.svg',
      url: 'https://t.me/onefam_admin',
    },
    {
      name: 'threema',
      icon: '/assets/threema.svg',
      url: 'https://threema.id/AK3AZ3X6',
    },
    { name: 'x', icon: '/assets/x.svg', url: 'https://www.onefam.ch/#' },
    {
      name: 'pinterest',
      icon: '/assets/pinterest.svg',
      url: 'https://www.pinterest.com/',
    },
    {
      name: 'contact',
      icon: '/assets/email.svg',
      url: 'https://www.onefam.ch/',
    },
  ];

  return (
    <>
      <div id='footer'>
        <MaxWidth className='py-16'>
          <div className='flex flex-col items-center justify-center gap-8 text-center '>
            <Image
              src='/assets/hero.svg'
              alt='footer'
              width={120}
              height={145}
              data-aos='zoom-in-up'
              data-aos-duration='1000'
              data-aos-delay='200'
              className=' hidden md-2:block'
            />
            <Image
              src='/assets/footer.svg'
              alt='footer'
              width={71}
              height={86}
              data-aos='zoom-in-up'
              data-aos-duration='1000'
              data-aos-delay='200'
              className='md-2:hidden'
            />
            <h1
              className='text-[24px] md-2:text-[48px] font-outfit font-light'
              data-aos='fade-up'
              data-aos-duration='1000'
              data-aos-delay='200'
              data-aos-anchor-placement='top-bottom'
            >
              {t('title')}
            </h1>

            <div className='flex flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-4 max-w-[250px] md:max-w-lg lg:max-w-full'>
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='
                  flex items-center justify-center 
                w-10 h-10 md:w-20 md:h-20  lg:w-10 lg:h-10 rounded-full border border-white 
                  text-white hover:bg-gray-800  
                  relative group  
                '
                  data-aos='fade-up'
                  data-aos-duration='1000'
                  data-aos-delay='200'
                  data-aos-anchor-placement='top-bottom'
                >
                  {/* Enhanced Tooltip with smooth animation */}
                  <div
                    className='
                  absolute -top-9 left-1/2 -translate-x-1/2 
                  text-white bg-white/10 rounded-full px-3 py-0.5 
                  opacity-0 group-hover:opacity-100   capitalize 
                  pointer-events-none
                '
                  >
                    {link.name}
                  </div>
                  <Image
                    src={link.icon}
                    alt={link.name}
                    width={16}
                    height={16}
                    className='w-5 h-5 md:w-10 md:h-10 lg:w-5 lg:h-5 transition-transform duration-300 group-hover:scale-125 '
                  />
                </Link>
              ))}
            </div>
          </div>
          <p
            onClick={openImprintDialog}
            className='underline cursor-pointer text-center mt-12 font-normal font-outfit text-[24px]'
            data-aos='fade-up'
            data-aos-duration='1000'
            data-aos-delay='200'
            data-aos-anchor-placement='top-bottom'
          >
            {t('imprint')}
          </p>
          <div className='text-center mt-10 lg:mt-24'>
            <p
              className='text-[20px] md-2:text-base font-outfit font-light'
              data-aos='fade-up'
              data-aos-duration='1000'
              data-aos-delay='200'
              data-aos-anchor-placement='top-bottom'
            >
              © {new Date().getFullYear()} {t('onefam')}
            </p>
          </div>
        </MaxWidth>
      </div>
      {imprintDialogOpen && <ImprintDialog onClose={()=>setImprintDialogOpen(false)} />}
    </>
  );
};

export default Footer;
