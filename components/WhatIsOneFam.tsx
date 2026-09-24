import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';

const WhatIsOneFam = () => {
  const t = useTranslations('what_is_onefam');
  const cards = t.raw('cards') as { title: string; text: string }[];

  return (
    <section id="about" className="bg-bg py-24 md:py-32">
      <MaxWidth>
        <Reveal>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[0.02em] text-primary">
            {t('title')}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-6 max-w-[680px] font-body text-lg leading-relaxed text-secondary">
            {t('intro')}
          </p>
        </Reveal>

        {/* Am 24.09.2026 von drei auf zwei Spalten: die Kachel „Fam statt Masse"
            wurde gestrichen, weil ihr Text („Nicht fuer alle. Und genau das ist
            der Punkt.") die Selbstauswahl-Formel ein drittes Mal brachte — sie
            steht schon in seo.description und seit dem Umbau des Family Code
            auch in dessen Intro. Einmal ist Haltung, dreimal ist Pose. Die
            Spaltenzahl muss mitziehen, sonst bleibt auf dem Desktop eine leere
            dritte Spalte stehen. Wer eine dritte Kachel zurueckholt, setzt hier
            wieder md:grid-cols-3. */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {cards.map((card, i) => (
            <Reveal
              as="div"
              key={card.title}
              delay={0.1 + i * 0.08}
              className="rounded-[8px] border border-line bg-surface p-7"
            >
              <h3 className="flex items-center gap-2.5 font-display text-xl font-semibold text-primary">
                <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {card.title}
              </h3>
              <p className="mt-3 font-body text-base leading-relaxed text-secondary">{card.text}</p>
            </Reveal>
          ))}
        </div>
      </MaxWidth>
    </section>
  );
};

export default WhatIsOneFam;
