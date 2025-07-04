'use client';

import React from 'react';
import MaxWidth from './MaxWidth';
import Image from 'next/image';
import { AlignRight, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  return (
    <div>
      <MaxWidth
        className='relative bg-[#0F0D04] border  border-secondary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] rounded-[18px]'
      > 
        <div className='flex justify-between items-center gap-4 py-4 '>
          <Image
            src={'/assets/Logo.svg'}
            alt=''
            width={107}
            height={35}
          />
          <AlignRight
            onClick={() => setOpenSidebar(true)}
            className='cursor-pointer w-10 h-10'
          />
          {openSidebar && (
            <div className='fixed inset-0 z-30 bg-white/10 blur-xl'></div>
          )}
          <div
            className={`fixed top-0 right-0 h-full z-50 bg-secondary text-primary w-full  transition-transform transform ${
              openSidebar ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <button
              className='absolute top-2 right-6 lg:right-8 p-4 cursor-pointer'
              onClick={() => setOpenSidebar(false)}
            >
              <X />
            </button>
            <div className=' h-full flex items-center justify-center'>
              <LanguageSwitcher setOpenSidebar={setOpenSidebar} />
            </div>
          </div>
        </div>
      </MaxWidth>
    </div>
  );
};

export default Header;
