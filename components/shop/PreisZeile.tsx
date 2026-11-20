'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { KachelProdukt } from '@/lib/shop/typen';
import { preisText } from '@/lib/shop/waehrung';
import { useWaehrung } from './useWaehrung';

// "Hoodie, Sweater, Shirt · ab CHF 40.00" neben dem Knopf im Einstieg der
// Länderseite. Der Preis steht bewusst direkt am ersten Knopf: Wer weiss, was es
// kostet, klickt eher weiter als jemand, der den Preis erst suchen muss.
//
// Die Wörter kommen aus den Produktnamen (letztes Wort: "Albanien Hoodie" →
// "Hoodie"), der Preis ist der günstigste der Linie — beides aus WooCommerce,
// nichts davon steht fest im Code.

export default function PreisZeile({ produkte }: { produkte: KachelProdukt[] }) {
  const t = useTranslations('shop_seiten');
  const locale = useLocale();
  const waehrung = useWaehrung();

  const arten = produkte.map((p) => p.name.trim().split(/\s+/).pop()).join(', ');

  let preis: string | null = null;
  if (waehrung === 'CHF') {
    preis = preisText(Math.min(...produkte.map((p) => p.chf)), 'CHF', locale);
  } else if (waehrung === 'EUR' && produkte.every((p) => p.eur != null)) {
    preis = preisText(Math.min(...produkte.map((p) => p.eur as number)), 'EUR', locale);
  }

  return (
    <p className="font-body text-secondary" aria-live="polite">
      {arten}
      {preis && <> · {t('ab_preis', { preis })}</>}
    </p>
  );
}
