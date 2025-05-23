'use client';

// components/LanguageSwitcher.tsx

import setLanguage from '@/utils/setLanguage';
import Image from 'next/image';
import React from 'react';

const LanguageSwitcher: React.FC<{ setOpenSidebar: (value: boolean) => void }> = ({
  setOpenSidebar,
}) => {
  const langFlag = [
    { value: 'en', label: 'English', flag: '/assets/uk.svg' },
    { value: 'fr', label: 'French', flag: '/assets/fr.svg' },
    { value: 'es', label: 'Spanish', flag: '/assets/sp.svg' },
    { value: 'de', label: 'German', flag: '/assets/de.svg' },
  ];
  return (
    <div className='flex gap-4 z-50'>
      {langFlag.map((lang, index) => (
        <button
          key={index}
          onClick={() => {
            setLanguage(lang.value);
            setOpenSidebar(false);
          }}
          className='cursor-pointer relative group'
        >
          <span className='z-[50] absolute -top-9 left-1/2 -translate-x-1/2  text-white bg-white/10 rounded-full  px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            {lang.label}
          </span>
          <Image
            src={lang.flag}
            alt={lang.label}
            width={48}
            height={48}
            className='cursor-pointer'
          />
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
