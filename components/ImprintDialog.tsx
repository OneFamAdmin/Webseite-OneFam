'use client';

import { Mail, MapPin, Phone, X } from 'lucide-react';
import React from 'react';
import { useTranslations } from 'next-intl';

interface ImprintDialogProps {
  onClose: () => void;
}

const ImprintDialog: React.FC<ImprintDialogProps> = ({ onClose }) => {
  const t = useTranslations('footer');

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[560px] rounded-[8px] border border-line bg-surface p-8 md:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Schliessen"
          className="absolute right-5 top-5 text-faint transition-colors duration-[180ms] hover:text-primary"
        >
          <X size={22} strokeWidth={1.5} />
        </button>

        <p className="font-body text-xs uppercase tracking-[0.1em] text-faint">{t('imprint')}</p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-[0.02em] text-primary md:text-3xl">
          {t('imprint_company')}
        </h2>
        <p className="mt-2 font-body text-base text-secondary">
          Inhaber: {t('imprint_owner')}
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-4 text-secondary">
            <MapPin size={22} strokeWidth={1.5} className="text-gold" />
            <span className="font-body text-base md:text-lg">{t('imprint_address')}</span>
          </div>
          <a
            href={`mailto:${t('imprint_email')}`}
            className="group flex items-center gap-4 text-secondary transition-colors duration-[180ms] hover:text-gold"
          >
            <Mail size={22} strokeWidth={1.5} className="text-gold" />
            <span className="font-body text-base md:text-lg">{t('imprint_email')}</span>
          </a>
          <a
            href={`tel:${t('imprint_phone').replace(/\s/g, '')}`}
            className="group flex items-center gap-4 text-secondary transition-colors duration-[180ms] hover:text-gold"
          >
            <Phone size={22} strokeWidth={1.5} className="text-gold" />
            <span className="font-body text-base md:text-lg">{t('imprint_phone')}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ImprintDialog;
