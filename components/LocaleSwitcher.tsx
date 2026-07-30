'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { LOCALES, LOCALE_NAME, homePath, type Locale } from '@/i18n/routing';

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
            onClick={onNavigate}
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
