import { Mail, Phone, X } from 'lucide-react';
import React from 'react';
import FancyGradient from './FancyGradient';
import { useTranslations } from 'next-intl';

interface ImprintDialogProps {
  onClose: () => void;
}

const ImprintDialog: React.FC<ImprintDialogProps> = ({ onClose }) => {
  const t = useTranslations('footer');

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in '>
      <div className='relative bg-black/85 p-8 md:p-12 w-full shadow-2xl animate-scale-in max-w-[612px] max-h-[394px]'>
        <FancyGradient className=' absolute top-[80px] -left-[10px] w-[150px] h-[150px] overflow-hidden' />
        <FancyGradient className=' absolute top-[80px] -right-[10px] w-[150px] h-[150px] overflow-hidden' />

        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-6 right-6 text-white/70 hover:text-white transition-colors duration-200 hover:scale-110 cursor-pointer'
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className='text-center text-white space-y-4'>
          {/* Title */}
          <div className='space-y-2'>
            <p className='text-[24px] font-outfit font-light'>
              {t('ceo_and_founder')}
            </p>
          </div>

          {/* Name */}
          <div>
            <h1 className='text-[32px] md-2:text-[48px] font-light font-outfit'>
              {t('ceo_and_founder_name')}
            </h1>
          </div>

          {/* Contact Information */}
          <div className='space-y-4 '>
            {/* Email */}
            <div className='flex items-center justify-center space-x-4 group cursor-pointer hover:text-primary/90 transition-colors duration-200'>
              <Mail
                size={28}
                className='text-white/80'
              />
              <span className='text-[16px] md-2:text-[28px] font-outfit font-light'>
                info@onefam.ch
              </span>
            </div>

            {/* Phone */}
            <div className='flex items-center justify-center space-x-4 group cursor-pointer hover:text-primary/90 transition-colors duration-200'>
              <Phone
                size={28}
                className=''
              />
              <span className='text-[16px] md-2:text-[28px] font-outfit font-light'>
                +41 76 225 80 58
              </span>
            </div>
          </div>
        </div>

        <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none'></div>
      </div>
    </div>
  );
};

export default ImprintDialog;
