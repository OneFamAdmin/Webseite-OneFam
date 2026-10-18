'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';

const Faq = () => {
  const t = useTranslations('faq');
  const items = t.raw('items') as { question: string; answer: string }[];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-bg py-24 md:py-32">
      <MaxWidth>
        <Reveal>
          <p className="font-body text-sm uppercase tracking-[0.1em] text-faint">{t('label')}</p>
          <h2 className="mt-4 max-w-[22ch] text-balance font-serif text-[clamp(2.08rem,4.16vw,3.12rem)] font-normal leading-[1.1] text-primary">
            {t('title')}
          </h2>
        </Reveal>

        <div className="mt-12 max-w-[760px] border-t border-line">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="div" key={it.question} delay={i * 0.05} className="border-b border-line">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span
                    className={`font-display text-lg font-semibold transition-colors duration-[180ms] ${
                      isOpen ? 'text-gold' : 'text-primary'
                    }`}
                  >
                    {it.question}
                  </span>
                  <ChevronDown
                    size={20}
                    strokeWidth={1.5}
                    className={`shrink-0 transition-[transform,color] duration-300 ${
                      isOpen ? 'rotate-180 text-gold' : 'text-faint'
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[28rem] pb-6 font-body text-base leading-relaxed text-secondary">
                      {it.answer}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </MaxWidth>
    </section>
  );
};

export default Faq;
