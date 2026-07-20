import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';
import MarbleBg from './MarbleBg';
import WaitlistForm from './WaitlistForm';

/** Travel Pool — VISION, nicht Mechanik.
 *
 *  Bewusst ohne Live-Counter, ohne Betrag, ohne Kauf→Auswahl-Versprechen: bei einer
 *  unbekannten Marke liest sich ein leerer CHF-Zähler wie ein Scam, und die aktive
 *  Mechanik darf erst nach anwaltlicher Prüfung + "Teilnahme ohne Kaufzwang" zurück
 *  (siehe docs/handover-shopify-pool.md §3). Bis dahin: Ziel benennen, Warteliste
 *  anbieten — rechtlich ein sauberer Newsletter, der den Hook am Leben hält.
 *
 *  Die Pool-Buchhaltung im Hintergrund (pool_ledger, /admin/pool) läuft unverändert
 *  weiter — sie ist nur nicht mehr öffentlich sichtbar. */
const TravelPool = () => {
  const t = useTranslations('travel_pool');
  const points = t.raw('points') as string[];

  return (
    <section
      id="travelpool"
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          'linear-gradient(180deg, var(--bg) 0px, var(--surface) 110px, var(--surface) calc(100% - 110px), var(--bg) 100%)',
      }}
    >
      <MarbleBg opacity={0.5} />
      <MaxWidth className="relative z-10 flex flex-col items-center text-center">
        <Reveal>
          <p className="font-body text-sm uppercase tracking-[0.1em] text-faint">{t('label')}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.08] tracking-[0.01em] text-primary">
            {t('title')}
          </h2>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-6 max-w-[560px] font-body text-lg leading-relaxed text-secondary">{t('description')}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <ul className="mt-10 flex flex-col items-center gap-3">
            {points.map((p) => (
              <li key={p} className="max-w-[460px] font-body text-base leading-relaxed text-faint">
                {p}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.26} className="mt-12 w-full">
          <div className="mx-auto w-full max-w-[420px] text-left">
            <p className="mb-4 text-center font-body text-base font-medium text-primary">{t('waitlist_title')}</p>
            <WaitlistForm compact />
          </div>
        </Reveal>
      </MaxWidth>
    </section>
  );
};

export default TravelPool;
