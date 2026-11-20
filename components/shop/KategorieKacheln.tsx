'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { KachelProdukt } from '@/lib/shop/typen';
import { produktPfad, type Locale } from '@/i18n/routing';
import { preisText } from '@/lib/shop/waehrung';
import { useWaehrung } from './useWaehrung';

// Die Produktkacheln einer Länderseite: Bild, Name, Preis, darunter Farbzahl und
// "Auswählen". Reihenfolge wie im Shop (Hoodie, Sweater, Shirt; die liefert der
// Katalog). Aufbau seit 21.11.2026 nach dem Entwurf "Premium One-Page".
//
// Jede Kachel führt auf die Produktseite. Der Entwurf sah stattdessen einen
// Kaufbereich mitten auf der Länderseite vor. Bewusst nicht übernommen: Bei
// heute bis zu zehn Farben und zehn Grössen wäre das die ganze Produktseite ein
// zweites Mal — doppelt zu pflegen, und die Länderseite trüge die Daten von rund
// 250 Varianten. Die Produktseite ist vorgebaut und einen Klick entfernt. Für
// die Vorbestellung (ein Teil, eine Farbe, nur die Grösse wählen) lohnt sich der
// Kaufbereich auf der Seite selbst — dort gehört er hin.
//
// Eine Client-Komponente nur wegen des Preises: Welche Währung gilt, weiss erst
// der Browser (Zeitzone, lib/shop/waehrung.ts). Bilder, Namen und Links stehen
// trotzdem schon im ausgelieferten HTML.

export default function KategorieKacheln({ produkte }: { produkte: KachelProdukt[] }) {
  const t = useTranslations('shop_seiten');
  const locale = useLocale() as Locale;
  const waehrung = useWaehrung();

  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {produkte.map((p) => {
        const betrag = !waehrung ? null : waehrung === 'CHF' ? p.chf : p.eur;
        const preis = betrag != null && waehrung ? preisText(betrag, waehrung, locale) : null;
        return (
          <li key={p.slug}>
            <Link href={produktPfad(locale, p.slug)} className="group block">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-[#F1F1F1]">
                {p.bild && (
                  <Image
                    src={p.bild}
                    alt={p.name}
                    fill
                    unoptimized
                    className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                )}
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-2xl font-normal text-primary">{p.name}</h3>
                {/* Feste Mindestbreite: der Preis erscheint erst mit der Währung und soll den Namen nicht verschieben. */}
                <p className="min-w-[5.5rem] text-right font-body text-primary" aria-live="polite">
                  {preis ? (p.einheitlich ? preis : t('ab_preis', { preis })) : ' '}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 font-body text-sm">
                <span className="text-secondary">{t('farben', { n: p.farben })}</span>
                <span className="text-gold underline-offset-4 group-hover:underline">{t('auswaehlen')} →</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
