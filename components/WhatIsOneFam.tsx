import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';

const WhatIsOneFam = () => {
  const t = useTranslations('what_is_onefam');

  // Unten ohne Polster (18.10.2026): ohne die Kacheln ist der Abschnitt nur noch
  // Überschrift und ein Absatz. Mit py-24/32 hier UND oben bei „Warum" standen
  // 256 px Schwarz dazwischen; jetzt trägt allein das Polster von „Warum".
  return (
    <section id="about" className="bg-bg pt-24 md:pt-32">
      <MaxWidth>
        {/* Seit 18.10.2026 ist die grosse Zeile eine Aussage, das alte Etikett steht klein
            darüber (wie bei „Die Stücke“). Wer nur Überschriften liest, liest so die ganze
            Geschichte: Raum → Gefühl → Zeichen. Siehe docs/stand.md „Roter Faden“.
            22ch + text-balance: mit 18ch stand „muss.“ allein in der dritten Zeile. */}
        <Reveal>
          <p className="font-body text-sm uppercase tracking-[0.1em] text-faint">{t('label')}</p>
          <h2 className="mt-4 max-w-[22ch] text-balance font-serif text-[clamp(2.08rem,4.16vw,3.12rem)] font-normal leading-[1.1] text-primary">
            {t('title')}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-6 max-w-[31rem] font-body text-lg leading-relaxed text-secondary">
            {t('intro')}
          </p>
        </Reveal>

        {/* Die Kacheln sind seit 18.10.2026 ganz weg (vorher zwei, davor drei).
            „Tiefe statt Small Talk" wiederholte fast wörtlich den Family Code („Nicht
            die Small-Talk-Variante"); sein Satz hängt jetzt am Intro. „Haltung statt
            Fassade" erklärt, warum das Zeichen still ist, und steht deshalb bei den
            Stücken (product_bridge.haltung). Labis Vorschlag, in der Vorschau
            „Roter Faden" angesehen. Nichts gestrichen, nur umgezogen. */}
      </MaxWidth>
    </section>
  );
};

export default WhatIsOneFam;
