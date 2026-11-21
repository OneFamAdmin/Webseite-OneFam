'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { SHOP_AUF_ONEFAM, legalPath, shopEinstieg, widerrufPfad, type Locale } from '@/i18n/routing';
import { WIDERRUF_EU_AKTIV } from '@/lib/shop/kasse';
import MaxWidth from './MaxWidth';

// Shop-Adresse pro Sprache — siehe i18n/routing.ts. Stand vorher fest auf /de/.

const socials = [
  { name: 'Instagram', icon: '/assets/instagram.svg', url: 'https://www.instagram.com/onefam_official/' },
  { name: 'TikTok', icon: '/assets/tiktok.svg', url: 'https://www.tiktok.com/@onefam_official' },
  { name: 'Facebook', icon: '/assets/facebook.svg', url: 'https://www.facebook.com/onefamworld' },
  // X ist bewusst draussen: Der Eintrag zeigte auf https://www.onefam.ch/ — also auf
  // die eigene Startseite. Ein Social-Symbol, das im Kreis führt, kostet mehr Vertrauen
  // als ein fehlendes Symbol. Sobald es ein echtes Profil gibt, diese Zeile einkommentieren:
  // { name: 'X', icon: '/assets/x.svg', url: 'https://x.com/<profil>' },
];

const SiteFooter = () => {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tWiderruf = useTranslations('shop_widerruf');
  const locale = useLocale() as Locale;
  const pages = t.raw('pages') as { label: string; href: string }[];
  const legal = t.raw('legal') as { label: string; href?: string }[];

  return (
    <>
      {/* Bewusst ohne Trennung nach oben: von den zehn Abschnittsgrenzen der
          Startseite hatten nur zwei je eine — diese hier und die ueber "Die
          Stuecke". Acht kamen immer ohne aus. Der Wechsel traegt sich selbst:
          py-16, Wortmarke, Claim, drei Spalten. */}
      <footer className="bg-bg">
        <MaxWidth className="py-16">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
            {/* Brand + claim */}
            <div className="max-w-xs">
              {/* 24 px statt 36. Mit dem alten Schriftzug (2,88 : 1) waren 36 px rund
                  104 px breit, mit dem neuen (4,81 : 1) sind es 173 — die Wortmarke
                  wurde ueber Nacht anderthalbmal so breit und erschlug den Claim
                  darunter. 24 px sind wieder rund 115 px breit und damit nie
                  groesser als die Wortmarke im Kopf. */}
              <Image src="/assets/logo-white.png" alt="OneFam" width={656} height={137} className="h-6 w-auto" />
              {/* Claim seit 19.10.2026 in EB Garamond, normal geschrieben — er wiederholt den Hero
                  und sieht jetzt auch so aus. Vorher Cabinet in Versalien (dritte Schrift). */}
              <p className="mt-4 text-balance font-serif text-xl font-normal leading-[1.3] text-gold">
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
                    <Link
                      href={legalPath(locale, 'impressum')}
                      className="font-body text-[15px] text-secondary transition-colors duration-[180ms] hover:text-primary"
                    >
                      {t('imprint')}
                    </Link>
                  </li>
                  {legal.map((l) => (
                    <li key={l.label}>
                      {l.href ? (
                        <Link
                          href={l.href === '/agb' ? legalPath(locale, 'agb') : l.href === '/datenschutz' ? legalPath(locale, 'datenschutz') : l.href}
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
                  {/* "Vertrag widerrufen" — die Widerrufsfunktion muss "hervorgehoben
                      platziert" und "durchgehend verfügbar" sein (Art. 11a Abs. 1
                      RL 2011/83/EU), deshalb auf jeder Seite. Der Linktext ist die
                      Formel des Gesetzes je Sprache. Sichtbar erst, wenn der Shop auf
                      onefam.ch läuft UND das Widerrufsrecht eingeschaltet ist
                      (lib/shop/kasse.ts, WIDERRUF_EU_AKTIV). */}
                  {SHOP_AUF_ONEFAM && WIDERRUF_EU_AKTIV && (
                    <li>
                      <Link
                        href={widerrufPfad(locale)}
                        className="font-body text-[15px] text-secondary transition-colors duration-[180ms] hover:text-primary"
                      >
                        {tWiderruf('link')}
                      </Link>
                    </li>
                  )}
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
            {/* Solange der Shop auf shop.onefam.ch liegt, steht hier dessen Adresse;
                danach das Wort "Shop" in der Sprache der Seite (Schalter in i18n/routing.ts). */}
            <a
              href={shopEinstieg(locale).href}
              className="font-body text-xs text-faint transition-colors duration-[180ms] hover:text-gold"
            >
              {shopEinstieg(locale).extern ? 'shop.onefam.ch' : tNav('shop')}
            </a>
          </div>
        </MaxWidth>
      </footer>
    </>
  );
};

export default SiteFooter;
