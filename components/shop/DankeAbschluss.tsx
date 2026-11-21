'use client';

import { useEffect } from 'react';
import { merkeKorbAnzahl } from '@/lib/shop/korbZaehler';

/**
 * Räumt nach der Zahlung auf: Der Warenkorb wird vergessen und die Ziffer in der
 * Kopfzeile auf null gestellt — aber nur, wenn die Kasse gerade eine Bestellung
 * angelegt hat (Merker of_bestellt, siehe lib/shop/storeApi.ts). Wer /danke
 * einfach so aufruft, verliert seinen Warenkorb nicht.
 */
export default function DankeAbschluss() {
  useEffect(() => {
    fetch('/api/shop/warenkorb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aktion: 'abschluss' }),
    })
      .then((r) => r.json())
      .then((d: { geleert?: boolean }) => {
        if (d?.geleert) merkeKorbAnzahl(0);
      })
      .catch(() => {});
  }, []);
  return null;
}
