'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { homePath, legalPath, type Locale } from '@/i18n/routing';

type LegalLayoutProps = {
  eyebrow?: string;
  title: string;
  updated?: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Self-contained dark/gold chrome for the standalone legal pages
 * (/datenschutz, /agb). Deliberately does NOT reuse the homepage Nav/Footer,
 * whose in-page anchor links (#about, #faq …) would be dead on a sub-route.
 */
export default function LegalLayout({ eyebrow = 'Rechtliches', title, updated, lead, children }: LegalLayoutProps) {
  const t = useTranslations('legal.layout');
  const locale = useLocale() as Locale;
  const home = homePath(locale);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      {/* top bar */}
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <Link href={home} aria-label="OneFam — Home" className="flex items-center gap-2.5">
            <img src="/assets/logo-face-gradient.svg" alt="" aria-hidden="true" className="h-7 w-7" />
            <Image src="/assets/logo-white.png" alt="OneFam" width={216} height={75} priority className="h-6 w-auto" />
          </Link>
          <Link
            href={home}
            className="inline-flex items-center gap-2 font-body text-sm text-secondary transition-colors duration-[180ms] hover:text-primary"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            {t('zur_startseite')}
          </Link>
        </div>
      </header>

      {/* content */}
      <main className="mx-auto w-full max-w-[720px] flex-1 px-6 py-16 md:py-24">
        <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">{eyebrow}</p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[0.02em] text-primary">
          {title}
        </h1>
        {updated && (
          <p className="mt-4 font-body text-sm text-faint">
            {t('stand_prefix')} {updated}
          </p>
        )}

        {/* draft notice */}
        <div className="mt-8 flex gap-3 rounded-[8px] border border-gold/30 bg-gold/[0.06] p-4">
          <AlertTriangle size={18} strokeWidth={1.6} className="mt-0.5 flex-none text-gold" />
          <p className="font-body text-sm leading-relaxed text-secondary">
            <span className="font-semibold text-gold">{t('entwurf_titel')}</span> {t('entwurf_text')}
          </p>
        </div>

        {lead && <div className="mt-10 font-body text-lg leading-[1.8] text-secondary">{lead}</div>}

        <div className="mt-10 space-y-10">{children}</div>
      </main>

      {/* slim footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-x-6 gap-y-2 font-body text-sm">
            <Link href={legalPath(locale, 'datenschutz')} className="text-secondary transition-colors duration-[180ms] hover:text-primary">
              {t('fuss_datenschutz')}
            </Link>
            <Link href={legalPath(locale, 'agb')} className="text-secondary transition-colors duration-[180ms] hover:text-primary">
              {t('fuss_agb')}
            </Link>
            <Link href={home} className="text-secondary transition-colors duration-[180ms] hover:text-primary">
              {t('zur_startseite')}
            </Link>
          </nav>
          <p className="font-body text-xs text-faint">© 2026 OneFam — Einzelfirma, Schweiz</p>
        </div>
      </footer>
    </div>
  );
}

/* ── typographic helpers for legal content ── */

export function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-semibold tracking-[0.01em] text-primary md:text-2xl">
        <span className="text-gold">{n}.</span> {title}
      </h2>
      <div className="space-y-4 font-body text-[15px] leading-[1.8] text-secondary md:text-base">{children}</div>
    </section>
  );
}

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.7em] h-1 w-1 flex-none rounded-full bg-gold" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function ContactCard() {
  return (
    <div className="rounded-[8px] border border-line bg-surface p-5">
      <p className="font-body text-primary">OneFam — Einzelfirma</p>
      <p className="font-body">Inhaber: Labinot Bajrami</p>
      <p className="font-body">Riehenstrasse 236, 4058 Basel, Schweiz</p>
      <p className="mt-2 font-body">
        E-Mail:{' '}
        <a href="mailto:info@onefam.ch" className="text-gold transition-colors duration-[180ms] hover:text-gold-hover">
          info@onefam.ch
        </a>
      </p>
      <p className="font-body">
        Telefon:{' '}
        <a href="tel:+41762258058" className="text-gold transition-colors duration-[180ms] hover:text-gold-hover">
          +41 76 225 80 58
        </a>
      </p>
    </div>
  );
}
