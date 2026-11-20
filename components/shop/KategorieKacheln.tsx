'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { KachelProdukt } from '@/lib/shop/typen';
import { produktPfad, type Locale } from '@/i18n/routing';
import { preisText } from '@/lib/shop/waehrung';
import { useWaehrung } from './useWaehrung';

// Die Produktkacheln einer Länderseite (20.11.2026): Bild, Name, Preis — wie auf
// den heutigen Länderseiten des Shops, in derselben Reihenfolge (Hoodie,
// Sweater, Shirt; die liefert der Katalog).
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
      {produkte.map((p, i) => {
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
                    priority={i === 0}
                    className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                )}
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h2 className="font-serif text-2xl font-normal text-primary">{p.name}</h2>
                {/* Feste Mindestbreite: der Preis erscheint erst mit der Währung und soll den Namen nicht verschieben. */}
                <p className="min-w-[5.5rem] text-right font-body text-primary" aria-live="polite">
                  {preis ? (p.einheitlich ? preis : t('ab_preis', { preis })) : ' '}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
