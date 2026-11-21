'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Button from '@/components/Button';
import { BRAND_GRADIENT_CTA } from '@/lib/brand';
import { LAENDER_MIT_EINFUHR, ZAHLARTEN_BILDER } from '@/lib/shop/kasse';
import { merkeKorbAnzahl } from '@/lib/shop/korbZaehler';
import type { Warenkorb } from '@/lib/shop/typen';
import { preisText } from '@/lib/shop/waehrung';
import { useWaehrung } from './useWaehrung';

// Warenkorb auf onefam.ch (Probeaufbau 20.11.2026). Liest und ändert über
// /api/shop/warenkorb; Preise, Versand und Summen rechnet WooCommerce, nicht
// diese Seite — es darf nur eine Quelle für Preise geben (CLAUDE.md).
//
// "Zur Kasse" führt seit 21.11.2026 auf die Kasse von onefam.ch
// (components/shop/KasseAnsicht.tsx).

export default function WarenkorbAnsicht({ weiterPfad, kassePfad }: { weiterPfad: string; kassePfad: string }) {
  const t = useTranslations('shop_seiten');
  const tKasse = useTranslations('shop_kasse');
  const [abbruch, setAbbruch] = useState(false);

  // Rückkehr von zahls.ch nach abgebrochener oder fehlgeschlagener Zahlung: Das
  // zahls-Plugin hängt ?zahls_error=1 an die Warenkorb-Adresse. Der Warenkorb
  // bleibt, der Merker "gerade bestellt" wird zurückgenommen. Gelesen wird aus
  // der Adresse statt über useSearchParams — das zwänge die sonst feste Seite
  // in eine Suspense-Grenze.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('zahls_error')) return;
    setAbbruch(true);
    fetch('/api/shop/warenkorb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aktion: 'abbruch' }),
    }).catch(() => {});
  }, []);
  const locale = useLocale();
  // Setzt das Cookie of_geo, bevor der Warenkorb geladen wird — sonst entschiede
  // die Route beim allerersten Besuch ohne die Zeitzone.
  const waehrung = useWaehrung();
  const [korb, setKorb] = useState<Warenkorb | null>(null);
  const [fehler, setFehler] = useState(false);
  const [beschaeftigt, setBeschaeftigt] = useState(false);

  const senden = useCallback(async (koerper?: object) => {
    setBeschaeftigt(true);
    try {
      const antwort = await fetch('/api/shop/warenkorb', {
        method: koerper ? 'POST' : 'GET',
        headers: koerper
          ? { 'Content-Type': 'application/json', 'x-onefam-sprache': locale }
          : { 'x-onefam-sprache': locale },
        body: koerper ? JSON.stringify(koerper) : undefined,
      });
      if (!antwort.ok) throw new Error(String(antwort.status));
      const neu = (await antwort.json()) as Warenkorb;
      setKorb(neu);
      merkeKorbAnzahl(neu.anzahl);
      setFehler(false);
    } catch {
      setFehler(true);
    } finally {
      setBeschaeftigt(false);
    }
  }, [locale]);

  useEffect(() => {
    if (waehrung) void senden();
  }, [waehrung, senden]);

  const geld = (rappen: number) => (korb ? preisText(rappen / 100, korb.waehrung, locale) : '');
  const laenderName = new Intl.DisplayNames([locale], { type: 'region' });

  if (!korb) {
    return <p className="font-body text-secondary">{fehler ? t('fehler') : ' '}</p>;
  }

  if (korb.positionen.length === 0) {
    return (
      <div>
        <p className="font-body text-lg text-secondary">{t('leer')}</p>
        <Link href={weiterPfad} className="mt-6 inline-block font-body text-gold underline-offset-4 hover:underline">
          {t('weiter')} →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]" aria-busy={beschaeftigt}>
      <ul className="divide-y divide-white/10 border-y border-white/10">
        {korb.positionen.map((p) => (
          <li key={p.key} className="flex gap-4 py-5">
            <div className="h-24 w-20 flex-none overflow-hidden rounded-[3px] bg-[#F1F1F1]">
              {/* Vorschaubild der Variante, von WooCommerce schon klein gerechnet */}
              {p.bild && <img src={p.bild} alt="" className="h-full w-full object-cover" loading="lazy" />}
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="font-body text-primary">{p.name}</p>
              <p className="font-body text-sm text-secondary">
                {p.farbe} · {p.groesse}
              </p>
              <div className="mt-auto flex items-center gap-4">
                <label className="font-body text-sm text-secondary">
                  <span className="sr-only">{t('menge')}</span>
                  <select
                    value={p.menge}
                    disabled={beschaeftigt}
                    onChange={(e) => senden({ aktion: 'menge', key: p.key, menge: Number(e.target.value) })}
                    className="rounded-[3px] border border-white/20 bg-bg px-2 py-1 text-primary"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  disabled={beschaeftigt}
                  onClick={() => senden({ aktion: 'entfernen', key: p.key })}
                  className="font-body text-sm text-secondary underline-offset-4 hover:text-primary hover:underline"
                >
                  {t('entfernen')}
                </button>
              </div>
            </div>
            <p className="font-body text-primary">{geld(p.summe)}</p>
          </li>
        ))}
      </ul>

      <div className="h-fit rounded-[4px] border border-white/10 p-6">
        <label className="block font-body text-sm text-secondary">
          {t('versand_nach')}
          <select
            value={korb.land}
            disabled={beschaeftigt}
            onChange={(e) => senden({ aktion: 'land', land: e.target.value })}
            className="mt-2 block w-full rounded-[3px] border border-white/20 bg-bg px-3 py-2 text-primary"
          >
            {[...korb.laender]
              .sort((a, b) => laenderName.of(a)!.localeCompare(laenderName.of(b)!, locale))
              .map((l) => (
                <option key={l} value={l}>
                  {laenderName.of(l)}
                </option>
              ))}
          </select>
        </label>

        <dl className="mt-6 space-y-2 font-body text-secondary">
          <div className="flex justify-between">
            <dt>{t('zwischensumme')}</dt>
            <dd className="text-primary">{geld(korb.zwischensumme)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>{t('versand')}</dt>
            <dd className="text-primary">{korb.versand == null ? '–' : geld(korb.versand)}</dd>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-3 text-lg">
            <dt className="text-primary">{t('total')}</dt>
            <dd className="text-primary">{geld(korb.total)}</dd>
          </div>
        </dl>

        {korb.fehler.length > 0 && (
          <ul className="mt-4 font-body text-sm text-secondary">
            {korb.fehler.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}

        {abbruch && (
          <p className="mt-5 rounded-[4px] border border-white/15 p-3 font-body text-sm text-primary" role="status">
            {tKasse('abbruch')}
          </p>
        )}
        {/* Einfuhrabgaben gehören zum Endpreis — der Hinweis steht bei der Summe. */}
        {LAENDER_MIT_EINFUHR.includes(korb.land) && (
          <p className="mt-4 rounded-[4px] border border-white/15 p-3 font-body text-sm leading-[1.6] text-primary">
            {tKasse('einfuhr')}
          </p>
        )}
        {/* Der Weg zum Kauf: Markenverlauf, wie auf Produktseite und Kasse. */}
        <Button as="a" href={kassePfad} className="mt-6 w-full" style={{ background: BRAND_GRADIENT_CTA }}>
          {t('zur_kasse')}
        </Button>
        {/* Lieferbeschränkungen und Zahlungsmittel müssen "spätestens bei Beginn des
            Bestellvorgangs" klar angegeben sein (Art. 8 Abs. 3 RL 2011/83/EU;
            § 312j Abs. 1 BGB; L221-14 C. consom.; Art. 98.3 TRLGDCU; reg. 14(6) UK).
            Der Warenkorb ist dieser Beginn. */}
        <p className="mt-4 font-body text-xs leading-[1.6] text-faint">{tKasse('lieferung_zahlung')}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {ZAHLARTEN_BILDER.map((z) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={z.name} src={z.src} alt={z.name.replace('_', ' ')} height={22} className="h-[22px] w-auto" loading="lazy" />
          ))}
        </div>
      </div>
    </div>
  );
}
