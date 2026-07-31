'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { LOCALES, LOCALE_NAME, homePath, type Locale } from '@/i18n/routing';
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from '@/i18n/geo';

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
 * Sprachumschalter. Vorher gab es keinen — die Seite war einsprachig.
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
 */
export default function LocaleSwitcher({
  onNavigate,
  variant = 'desktop',
}: {
  onNavigate?: () => void;
  variant?: 'desktop' | 'mobile';
}) {
  const aktuell = useLocale() as Locale;

  const basis =
    variant === 'desktop'
      ? 'font-body text-[13px] font-medium tracking-wide transition-colors duration-[180ms]'
      : 'font-body text-base font-medium tracking-wide transition-colors duration-[180ms]';

  return (
    <nav aria-label="Sprache" className={variant === 'desktop' ? 'flex items-center gap-2' : 'flex items-center gap-4'}>
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="text-secondary/40">·</span>}
          <Link
            href={homePath(l)}
            hrefLang={l}
            lang={l}
            title={LOCALE_NAME[l]}
            aria-current={l === aktuell ? 'true' : undefined}
            onClick={() => {
              spracheMerken(l);
              onNavigate?.();
            }}
            className={`${basis} ${
              l === aktuell ? 'text-primary' : 'text-secondary hover:text-primary'
            }`}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </nav>
  );
}
