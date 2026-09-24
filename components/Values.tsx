'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';

/**
 * Family Code — am 24.09.2026 von elf Punkten auf vier umgebaut.
 *
 * WARUM: Die elf Punkte waren Tugenden („Love & Respect", „Gratitude", „Growth"),
 * keine Regeln. Eine Tugend kostet nichts und schliesst niemanden aus — genau das
 * soll dieser Abschnitt aber tun. Er war ausserdem die einzige Stelle der Seite,
 * die in Allgemeinplaetzen sprach, waehrend der Rest („We don't talk about the
 * weather") scharf formuliert ist. Die Laenge war nicht das Problem, der Inhalt
 * war es: je laenger die Liste, desto mehr klingt sie nach Ueberzeugenwollen.
 * Die vier Regeln decken die elf inhaltlich vollstaendig ab.
 *
 * WARUM KEINE ICONS MEHR: Elf Karten mit elf lucide-Icons im Zweispalter ist das
 * Layout, das jede SaaS-Seite fuer ihre Funktionsliste benutzt. Das hat mehr
 * Prestige gekostet als die Textlaenge. Vier Regeln als reine Typografie mit
 * Ziffern 01–04 lesen sich als Manifest — dieselbe Sprache wie die Schritte in
 * HowItWorks. Wer Icons zurueckholt, holt die Funktionsliste mit zurueck.
 *
 * WARUM DIE VIER OFFEN STEHEN UND NUR DIE LANGE FASSUNG KLAPPT: Die vier Saetze
 * sind die Ladung. Haette jeder Punkt eine eigene Klappe, saehe der Abschnitt aus
 * wie vier zugeklappte FAQ-Zeilen — ein Manifest, das man aufklappen muss, ist
 * keines. Darum: vier offen, darunter eine stille Zeile fuer alle, die das Warum
 * wollen. Das Klapp-Muster ist bewusst dasselbe wie in Faq.tsx (Gold beim
 * Oeffnen, Pfeil dreht, Hoehe ueber grid-rows) — nicht neu gebaut, damit sich die
 * Seite an beiden Stellen gleich anfuehlt.
 */
const Values = () => {
  const t = useTranslations('values');
  const items = t.raw('items') as { title: string; text: string }[];
  const lang = t.raw('long') as string[];
  const [offen, setOffen] = useState(false);

  return (
    <section id="werte" className="bg-bg py-24 md:py-32">
      <MaxWidth>
        <Reveal>
          <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">
            {t('label')}
          </p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[0.02em] text-primary">
            {t('title')}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-6 max-w-[640px] font-body text-lg leading-relaxed text-secondary">
            {t('intro')}
          </p>
        </Reveal>

        <div className="mt-16 max-w-[860px]">
          {items.map((item, i) => (
            <Reveal
              as="div"
              key={item.title}
              delay={0.1 + i * 0.07}
              className="border-t border-line py-10 first:border-t-0 first:pt-0 md:py-12 md:first:pt-0"
            >
              <p className="font-body text-sm font-medium tracking-[0.22em] text-gold">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 max-w-[20ch] font-display text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-[1.15] tracking-[0.01em] text-primary">
                {item.title}
              </h3>
              <p className="mt-4 max-w-[54ch] font-body text-lg leading-relaxed text-secondary">
                {item.text}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Die lange Fassung. Bewusst unscheinbar: wer sie nicht sucht, soll sie
            nicht sehen muessen — die vier Regeln oben stehen fuer sich. */}
        <Reveal as="div" delay={0.4} className="mt-6 max-w-[860px] border-t border-line">
          <button
            type="button"
            onClick={() => setOffen(!offen)}
            aria-expanded={offen}
            className="flex w-full items-center justify-between gap-6 py-6 text-left"
          >
            <span
              className={`font-body text-base transition-colors duration-[180ms] ${
                offen ? 'text-gold' : 'text-secondary'
              }`}
            >
              {t('long_label')}
            </span>
            <ChevronDown
              size={20}
              strokeWidth={1.5}
              className={`shrink-0 transition-[transform,color] duration-300 ${
                offen ? 'rotate-180 text-gold' : 'text-faint'
              }`}
            />
          </button>
          <div
            className={`grid transition-all duration-300 ease-out ${
              offen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="max-w-[640px] space-y-5 pb-8">
                {lang.map((absatz, i) => (
                  <p key={i} className="font-body text-base leading-relaxed text-secondary">
                    {absatz}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </MaxWidth>
    </section>
  );
};

export default Values;
