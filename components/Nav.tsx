'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Button from './Button';
import { BRAND_GRADIENT } from '@/lib/brand';
import LocaleSwitcher from './LocaleSwitcher';
import { homePath, joinPath, shopUrl, type Locale } from '@/i18n/routing';

// Shop-Adresse pro Sprache — siehe i18n/routing.ts. Stand vorher fest auf /de/.

const Nav = () => {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
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

  // Absolute (/#…) so the nav works from EVERY page, not just the homepage: from a sub-route a
  // bare "#werte" would be a dead in-page anchor; "/#werte" jumps to the homepage section.
  // Die Sprungmarken hängen an der Startseite DER AKTUELLEN SPRACHE. Ein blosses
  // "/#about" würde einen französischen Besucher von /fr auf die englische
  // Startseite werfen — der Sprung funktionierte, die Sprache wäre weg.
  const home = homePath(locale);

  // /reiseziel stand hier bis zum 10.08.2026 als "Destination" im Menü. Die Seite
  // zeigt aber nur einen Platzhalter, während die AGB festhalten, dass derzeit kein
  // Travel-Pool-Programm stattfindet — ein Menüpunkt, der etwas verspricht, was die
  // Rechtstexte verneinen. Sie ist deshalb still geparkt: erreichbar, aber nicht
  // beworben und nicht im Index. Kommt das Voting, kommt der Eintrag zurück.
  const links = [
    { label: t('about'), href: `${home}#about`, external: false },
    { label: t('werte'), href: `${home}#werte`, external: false },
    { label: t('faq'), href: `${home}#faq`, external: false },
    { label: t('shop'), href: shopUrl(locale), external: true },
  ];

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled ? 'border-b border-line bg-bg/85 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <MaxWidth>
        <div className="flex h-14 items-center justify-between md:h-16">
          {/* Logo */}
          <Link href={`${homePath(locale)}#hero`} aria-label="OneFam — Home" className="flex items-center">
            {/* wordmark only — the gradient face mark now lives big in the hero centre */}
            <Image src="/assets/logo-white.png" alt="OneFam" width={216} height={75} priority className="h-6 w-auto md:h-7" />
          </Link>

          {/* Desktop links */}
          <nav className="hidden items-center gap-8 md-1:flex">
            {links.map((l) =>
              l.external ? (
                <a
                  key={l.label}
                  href={l.href}
                  className="font-body text-[15px] font-medium text-secondary transition-colors duration-[180ms] hover:text-primary"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.label}
                  href={l.href}
                  className="font-body text-[15px] font-medium text-secondary transition-colors duration-[180ms] hover:text-primary"
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop: Sprachumschalter + CTA */}
          <div className="hidden items-center gap-5 md-1:flex">
            <LocaleSwitcher />
            <Button as="a" href={joinPath(locale)} variant="primary" className="px-5 py-2.5 text-[15px]" style={{ background: BRAND_GRADIENT }}>
              {t('join')}
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="text-primary md-1:hidden"
            aria-label={t('menu_open')}
            onClick={() => setOpen(true)}
          >
            <Menu size={26} strokeWidth={1.5} />
          </button>
        </div>
      </MaxWidth>
    </header>

      {/* Mobile overlay — OUTSIDE <header>: when scrolled the header gets backdrop-blur, which makes
          it the containing block for fixed children and would shrink this inset-0 overlay to the
          header height (→ menu floats over a see-through area). As a sibling it covers the viewport. */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-bg transition-transform duration-300 md-1:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center">
            <Image src="/assets/logo-white.png" alt="OneFam" width={216} height={75} className="h-6 w-auto" />
          </div>
          <button aria-label={t('menu_close')} className="text-primary" onClick={() => setOpen(false)}>
            <X size={26} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center gap-8">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-2xl font-semibold text-primary transition-colors duration-[180ms] hover:text-gold"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-2xl font-semibold text-primary transition-colors duration-[180ms] hover:text-gold"
              >
                {l.label}
              </Link>
            ),
          )}
          <Button as="a" href={joinPath(locale)} variant="primary" className="mt-2" style={{ background: BRAND_GRADIENT }} onClick={() => setOpen(false)}>
            {t('join')}
          </Button>
          <LocaleSwitcher variant="mobile" onNavigate={() => setOpen(false)} />
        </nav>
      </div>
    </>
  );
};

export default Nav;
