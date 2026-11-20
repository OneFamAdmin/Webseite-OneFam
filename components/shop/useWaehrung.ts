'use client';

import { useEffect, useState } from 'react';
import type { Waehrung } from '@/lib/shop/typen';
import { GEO_COOKIE, geoAusZeitzone, waehrungFuer } from '@/lib/shop/waehrung';

/**
 * Die Währung dieses Geräts — nach der Regel in lib/shop/waehrung.ts.
 *
 * Gibt beim ersten Zeichnen null zurück. Die Produktseite ist für alle gleich
 * und wird zwischengespeichert; welche Währung gilt, weiss erst der Browser
 * (Zeitzone). Bis dahin zeigt die Seite den Preis nicht an statt den falschen —
 * ein CHF-Preis, der nach einem Wimpernschlag zu EUR springt, wirkt unseriös.
 *
 * Schreibt dabei das Cookie of_geo, damit die Warenkorb-Route auf dem Server
 * dieselbe Entscheidung trifft.
 */
export function useWaehrung(): Waehrung | null {
  const [waehrung, setWaehrung] = useState<Waehrung | null>(null);
  useEffect(() => {
    let zeitzone: string | undefined;
    try {
      zeitzone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      zeitzone = undefined;
    }
    const geo = geoAusZeitzone(zeitzone);
    document.cookie = `${GEO_COOKIE}=${geo}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    setWaehrung(waehrungFuer({ geo }));
  }, []);
  return waehrung;
}
