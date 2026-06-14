'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import ImprintDialog from './ImprintDialog';

const SHOP_URL = 'https://onefam.shop';

const socials = [
  { name: 'Instagram', icon: '/assets/instagram.svg', url: 'https://www.instagram.com/onefam_official/' },
  { name: 'Facebook', icon: '/assets/facebook.svg', url: 'https://www.facebook.com/profile.php?id=61568690728641' },
  { name: 'WhatsApp', icon: '/assets/whatsapp.svg', url: 'https://api.whatsapp.com/message/CXRNI6YIROSTD1?autoload=1&app_absent=0' },
  { name: 'Telegram', icon: '/assets/fly.svg', url: 'https://t.me/onefam_admin' },
  { name: 'Threema', icon: '/assets/threema.svg', url: 'https://threema.id/AK3AZ3X6' },
  { name: 'X', icon: '/assets/x.svg', url: 'https://www.onefam.ch/' },
];

const SiteFooter = () => {
  const t = useTranslations('footer');
  const [imprintOpen, setImprintOpen] = React.useState(false);
  const pages = t.raw('pages') as { label: string; href: string }[];
  const legal = t.raw('legal') as { label: string; href?: string }[];

  return (
    <>
      <footer className="border-t border-line bg-bg">
        <MaxWidth className="py-16">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
            {/* Brand + claim */}
            <div className="max-w-xs">
              <Image src="/assets/logo-white.png" alt="OneFam" width={216} height={75} className="h-9 w-auto" />
              <p className="mt-4 font-display text-base font-semibold uppercase tracking-[0.1em] text-gold">
                {t('claim')}
              </p>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 gap-10 sm:gap-16">
              {/* Pages */}
              <div>
                <p className="font-body text-xs uppercase tracking-[0.1em] text-faint">{t('pages_title')}</p>
                <ul className="mt-4 space-y-3">
                  {pages.map((p) => (
                    <li key={p.label}>
                      <a
                        href={p.href}
                        className="font-body text-[15px] text-secondary transition-colors duration-[180ms] hover:text-primary"
                      >
                        {p.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <p className="font-body text-xs uppercase tracking-[0.1em] text-faint">{t('legal_title')}</p>
                <ul className="mt-4 space-y-3">
                  <li>
                    <button
                      onClick={() => setImprintOpen(true)}
                      className="font-body text-[15px] text-secondary transition-colors duration-[180ms] hover:text-primary"
                    >
                      {t('imprint')}
                    </button>
                  </li>
                  {legal.map((l) => (
                    <li key={l.label}>
                      {l.href ? (
                        <Link
                          href={l.href}
                          className="font-body text-[15px] text-secondary transition-colors duration-[180ms] hover:text-primary"
                        >
                          {l.label}
                        </Link>
                      ) : (
                        // placeholder until the dedicated page exists
                        <span
                          aria-disabled
                          title="Bald verfügbar"
                          className="cursor-not-allowed font-body text-[15px] text-faint"
                        >
                          {l.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="font-body text-xs uppercase tracking-[0.1em] text-faint">{t('social_title')}</p>
              <div className="mt-4 flex items-center gap-5">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="group"
                  >
                    <span
                      className="block h-5 w-5 bg-faint transition-colors duration-[180ms] group-hover:bg-gold"
                      style={{
                        maskImage: `url(${s.icon})`,
                        WebkitMaskImage: `url(${s.icon})`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-xs text-faint">{t('copyright')}</p>
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs text-faint transition-colors duration-[180ms] hover:text-gold"
            >
              onefam.shop
            </a>
          </div>
        </MaxWidth>
      </footer>

      {imprintOpen && <ImprintDialog onClose={() => setImprintOpen(false)} />}
    </>
  );
};

export default SiteFooter;
