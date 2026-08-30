'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { LOCALES, LOCALE_NAME, homePath, type Locale } from '@/i18n/routing';
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from '@/i18n/geo';
import Flag from './Flag';

/**
 * Die bewusste Wahl im Cookie festhalten — sonst ist sie beim naechsten Klick
 * schon wieder weg.
 *
 * Der Fehler, den das behebt: Wer auf /de auf "EN" klickt, landet auf "/".
 * Dort greift die Spracherkennung der Middleware, sieht einen deutschen
 * Browser oder eine deutsche IP — und leitet zurueck auf /de. Fuer den
 * Besucher sieht es aus, als tue der Umschalter nichts. Das Cookie ist das
 * einzige Signal, das ueber der Erkennung steht.
 *
 * Bewusst per document.cookie und nicht ueber den Link-Wrapper von next-intl:
 * So steht an einer Stelle, was passiert, und es haengt nicht an Interna einer
 * Bibliothek, die sich zwischen zwei Nebenversionen aendern koennen.
 */
function spracheMerken(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}

/**
 * Sprachumschalter: Flagge mit Klappmenü.
 *
 * Vorher standen hier vier Kürzel nebeneinander — EN · DE · FR · ES. Das hatte
 * zwei Nachteile. Auf dem Telefon war jedes einzelne Kürzel ein Klickziel von
 * rund zwanzig Pixeln, also deutlich unter dem, was eine Fingerkuppe trifft.
 * Und vier Kürzel muss man lesen; eine Flagge erkennt man. Bei einer Marke,
 * deren Publikum per Definition mehrsprachig ist, zählt das. Der Shop
 * (shop.onefam.ch) zeigt dieselbe Flagge mit demselben Klappmenü — beide
 * Auftritte sehen im Kopf jetzt gleich aus.
 *
 * Wichtig: Die Verweise zeigen bewusst immer auf die STARTSEITE der jeweiligen
 * Sprache, nicht auf die gerade geöffnete Seite. Übersetzt ist bislang nur die
 * Startseite; ein Verweis von /agb auf "/fr/agb" würde eine Seite versprechen,
 * die es nicht gibt. Sobald die Unterseiten übersetzt sind, wird daraus ein
 * Wechsel auf dieselbe Seite in der anderen Sprache.
 *
 * `hrefLang` und `lang` stehen an jedem Verweis: Sie sagen Suchmaschinen und
 * Vorleseprogrammen, dass das Ziel eine andere Sprache hat — sonst liest ein
 * Screenreader "Français" mit deutscher Aussprache vor.
 *
 * Bewusst <a> und nicht <Link> von Next: Der Sprachwechsel muss die Seite neu
 * laden. NextIntlClientProvider und <html lang> stehen im WURZEL-Layout
 * (app/layout.tsx), und ein Layout rendert bei einem Wechsel innerhalb der App
 * nicht neu. Mit <Link> stand nach dem Klick auf "Français" zwar die
 * französische Seite da, aber <html lang> blieb auf "de" und `useLocale()`
 * meldete weiter Deutsch — der Knopf hätte also die deutsche Flagge behalten,
 * obwohl die Seite französisch ist. Das war schon vorher falsch (die alte
 * Fassung hob das falsche Kürzel hervor), fiel nur nicht auf. Ein voller
 * Seitenaufbau kostet hier nichts: Die Sprache wechselt man einmal, und der
 * Shop macht es genauso.
 *
 * Die Flagge allein ist keine Beschriftung: Im Klappmenü steht neben jeder
 * Flagge der Sprachname, und der Knopf trägt ein aria-label mit der aktuellen
 * Sprache im Klartext. Wer nichts sieht, hört sonst nur "Schaltfläche".
 */
export default function LocaleSwitcher({
  onNavigate,
  variant = 'desktop',
}: {
  onNavigate?: () => void;
  variant?: 'desktop' | 'mobile';
}) {
  const t = useTranslations('nav');
  const aktuell = useLocale() as Locale;
  const [offen, setOffen] = useState(false);
  const wurzel = useRef<HTMLDivElement>(null);
  const knopf = useRef<HTMLButtonElement>(null);
  const listeId = useId();

  const mobil = variant === 'mobile';

  // Klick daneben und Escape schliessen das Menü. `pointerdown` statt `click`,
  // damit es sich auch dann schliesst, wenn der Zeiger auf einem Element
  // landet, das den Klick selbst abfängt. Escape gibt den Fokus an den Knopf
  // zurück — sonst steht die Tastatur nach dem Schliessen im Nichts.
  useEffect(() => {
    if (!offen) return;

    const beiZeiger = (e: PointerEvent) => {
      if (!wurzel.current?.contains(e.target as Node)) setOffen(false);
    };
    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOffen(false);
        knopf.current?.focus();
      }
    };

    document.addEventListener('pointerdown', beiZeiger);
    document.addEventListener('keydown', beiTaste);
    return () => {
      document.removeEventListener('pointerdown', beiZeiger);
      document.removeEventListener('keydown', beiTaste);
    };
  }, [offen]);

  return (
    <div ref={wurzel} className="relative">
      <button
        ref={knopf}
        type="button"
        onClick={() => setOffen((o) => !o)}
        aria-expanded={offen}
        aria-controls={listeId}
        aria-label={`${t('language')}: ${LOCALE_NAME[aktuell]}`}
        // Der Knopf ist bewusst mindestens 44 Pixel hoch — das ist die Grösse,
        // die Apple und Google als kleinstes verlässliches Fingerziel angeben.
        className={`flex items-center rounded-full border border-transparent transition-colors duration-[180ms] hover:border-line hover:bg-surface ${
          offen ? 'border-line bg-surface' : ''
        } ${mobil ? 'h-11 gap-2.5 px-3' : 'h-9 gap-1.5 px-2'}`}
      >
        <Flag locale={aktuell} className={mobil ? 'h-6 w-6' : 'h-5 w-5'} />
        <ChevronDown
          size={mobil ? 18 : 15}
          strokeWidth={1.75}
          aria-hidden="true"
          className={`text-secondary transition-transform duration-200 ${offen ? 'rotate-180' : ''}`}
        />
      </button>

      {offen && (
        <div
          id={listeId}
          // Auf dem Telefon steht der Umschalter unten in der mittigen Spalte
          // des Menü-Overlays. Ein Klappmenü nach unten fiele dort aus dem
          // Bild — deshalb dort nach oben und mittig statt nach unten rechts.
          className={`absolute z-50 min-w-[176px] rounded-[8px] border border-line bg-surface p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.55)] ${
            mobil ? 'bottom-full left-1/2 mb-3 -translate-x-1/2' : 'right-0 top-full mt-2'
          }`}
        >
          <ul aria-label={t('language')}>
            {LOCALES.map((l) => (
              <li key={l}>
                <a
                  href={homePath(l)}
                  hrefLang={l}
                  lang={l}
                  aria-current={l === aktuell ? 'true' : undefined}
                  onClick={() => {
                    spracheMerken(l);
                    setOffen(false);
                    onNavigate?.();
                  }}
                  className={`flex items-center gap-3 rounded-[6px] px-3 py-2.5 font-body text-[15px] font-medium transition-colors duration-[180ms] hover:bg-white/5 ${
                    l === aktuell ? 'text-gold' : 'text-secondary hover:text-primary'
                  }`}
                >
                  <Flag locale={l} className="h-5 w-5" />
                  {LOCALE_NAME[l]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
