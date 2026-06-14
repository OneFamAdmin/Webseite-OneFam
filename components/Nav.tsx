'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Button from './Button';

const SHOP_URL = 'https://onefam.shop';

const Nav = () => {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = [
    { label: t('about'), href: '#about', external: false },
    { label: t('reiseziel'), href: '/reiseziel', external: false },
    { label: t('werte'), href: '#werte', external: false },
    { label: t('faq'), href: '#faq', external: false },
    { label: t('shop'), href: SHOP_URL, external: true },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled ? 'border-b border-line bg-bg/85 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <MaxWidth>
        <div className="flex h-14 items-center justify-between md:h-16">
          {/* Logo */}
          <a href="#hero" aria-label="OneFam — Home" className="flex items-center gap-2.5">
            {/* gold face mark (recoloured to site gold) + white wordmark */}
            <img src="/assets/logo-face.svg" alt="" aria-hidden="true" className="h-7 w-7 md:h-8 md:w-8" />
            <Image src="/assets/logo-white.png" alt="OneFam" width={216} height={75} priority className="h-6 w-auto md:h-7" />
          </a>

          {/* Desktop links */}
          <nav className="hidden items-center gap-8 md-1:flex">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="font-body text-[15px] font-medium text-secondary transition-colors duration-[180ms] hover:text-primary"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md-1:block">
            <Button as="a" href="/join" variant="primary" className="px-5 py-2.5 text-[15px]">
              {t('join')}
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="text-primary md-1:hidden"
            aria-label="Menü öffnen"
            onClick={() => setOpen(true)}
          >
            <Menu size={26} strokeWidth={1.5} />
          </button>
        </div>
      </MaxWidth>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-bg transition-transform duration-300 md-1:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <img src="/assets/logo-face.svg" alt="" aria-hidden="true" className="h-7 w-7" />
            <Image src="/assets/logo-white.png" alt="OneFam" width={216} height={75} className="h-6 w-auto" />
          </div>
          <button aria-label="Menü schliessen" className="text-primary" onClick={() => setOpen(false)}>
            <X size={26} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              onClick={() => setOpen(false)}
              className="font-display text-2xl font-semibold text-primary transition-colors duration-[180ms] hover:text-gold"
            >
              {l.label}
            </a>
          ))}
          <Button as="a" href="/join" variant="primary" className="mt-2" onClick={() => setOpen(false)}>
            {t('join')}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Nav;
