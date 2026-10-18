import { useTranslations } from 'next-intl';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';
import Image from 'next/image';
import MarbleBg from './MarbleBg';
import WaitlistForm from './WaitlistForm';

/** Travel Pool — VISION, nicht Mechanik.
 *
 *  Bewusst ohne Live-Counter, ohne Betrag, ohne Kauf→Auswahl-Versprechen: bei einer
 *  unbekannten Marke liest sich ein leerer CHF-Zähler wie ein Scam, und die aktive
 *  Mechanik darf erst nach anwaltlicher Prüfung + "Teilnahme ohne Kaufzwang" zurück
 *  (siehe docs/handover-shop-pool.md §3). Bis dahin: Ziel benennen, Warteliste
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
        {/* Ansichtskarte seit 18.10.2026: ein gedeckter Tisch am Hafen, die Stühle warten
            auf Gäste — das Bild zum Satz „für den Tag, an dem wir uns nicht mehr nur online
            begegnen“. Labi hat sie gegen drei Karten (mehrere Orte) gewählt: OneFam handelt
            von Menschen, nicht von Orten. Keine Schrift, kein Ortsname, weil die Vision kein
            Reiseziel verspricht. Rein schmückend, daher alt="". Gedämpft auf Sättigung 0,35
            wie das Foto „Warum“ — das Original war das bunteste Bild der Seite. Herkunft und
            Fassungen: ~/Projekte/onefam-material/designs/ansichtskarten-vision/ */}
        <Reveal className="mb-10 w-full">
          <Image
            src="/assets/vision-karte.webp"
            alt=""
            width={1600}
            height={1063}
            sizes="(min-width: 768px) 560px, 92vw"
            className="mx-auto h-auto w-full max-w-[560px]"
          />
        </Reveal>
        <Reveal>
          <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">{t('label')}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-4 max-w-[16ch] font-serif text-[clamp(2.08rem,4.16vw,3.12rem)] font-normal leading-[1.08] text-primary">
            {t('title')}
          </h2>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-6 max-w-[31rem] font-body text-lg leading-[1.75] tracking-[0.012em] text-secondary">{t('description')}</p>
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
