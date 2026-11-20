'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import Button from '@/components/Button';
import type { Produkt } from '@/lib/shop/typen';
import { preisText } from '@/lib/shop/waehrung';
import { useWaehrung } from './useWaehrung';

// Produktseite auf onefam.ch (Probeaufbau 20.11.2026).
//
// Inhaltlich wie die heutige Seite im Shop: Farbe, Grösse, Galerie je Farbe,
// Preis in CHF oder EUR. Farben als Bildchen statt als Klappliste — das Bildchen
// ist das freihängende Teil in genau dieser Farbe. Ein gemalter Farbpunkt wäre
// eine Behauptung über den Farbton; das Foto zeigt ihn.
//
// Die Galerie wechselt mit der Farbe. Die Grösse wird bewusst NICHT
// vorausgewählt: Wer nicht wählt, bestellt sonst die erste Grösse der Liste —
// und es gibt kein Rückgaberecht bei falsch gewählter Grösse (AGB).

export default function ProduktAnsicht({
  produkt,
  warenkorbPfad,
  kategoriePfad,
  kategorieName,
}: {
  produkt: Produkt;
  warenkorbPfad: string;
  kategoriePfad: string | null;
  kategorieName: string | null;
}) {
  const t = useTranslations('shop_seiten');
  const locale = useLocale();
  const waehrung = useWaehrung();

  const [farbe, setFarbe] = useState(produkt.startFarbe);
  const [groesse, setGroesse] = useState<string | null>(null);
  const [bildNr, setBildNr] = useState(0);
  const [zustand, setZustand] = useState<'frei' | 'laeuft' | 'drin' | 'fehler' | 'ohne_groesse'>('frei');

  const bilder = produkt.farben.find((f) => f.name === farbe)?.bilder ?? [];
  const bild = bilder[Math.min(bildNr, bilder.length - 1)];

  const variante = useMemo(
    () => produkt.varianten.find((v) => v.farbe === farbe && v.groesse === groesse) ?? null,
    [produkt.varianten, farbe, groesse],
  );
  // Preis vor der Grössenwahl: alle Varianten kosten gleich viel (CLAUDE.md, Preise).
  // Genommen wird trotzdem die erste lieferbare der Farbe, nicht ein fester Wert.
  const preisVariante = variante ?? produkt.varianten.find((v) => v.farbe === farbe) ?? null;
  const betrag = !preisVariante || !waehrung ? null : waehrung === 'CHF' ? preisVariante.chf : preisVariante.eur;

  async function hinzufuegen() {
    if (!variante) {
      setZustand('ohne_groesse');
      return;
    }
    setZustand('laeuft');
    try {
      const antwort = await fetch('/api/shop/warenkorb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-onefam-sprache': locale },
        body: JSON.stringify({ aktion: 'hinzu', id: variante.id, menge: 1 }),
      });
      setZustand(antwort.ok ? 'drin' : 'fehler');
    } catch {
      setZustand('fehler');
    }
  }

  return (
    // grid-cols-[minmax(0,1fr)] auch auf dem Handy: Ohne feste Spalte wächst das
    // Raster auf die Breite seines breitesten Inhalts — die waagrecht scrollende
    // Bildchenleiste —, und die ganze Seite wurde breiter als der Bildschirm
    // (gemessen 20.11.2026 bei 412 px: Bild, Grössen und Text rechts abgeschnitten).
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
      {/* Galerie */}
      <div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-[#F1F1F1]">
          {bild && (
            <Image
              key={bild.src}
              src={bild.src}
              alt={bild.alt}
              fill
              priority={bildNr === 0}
              unoptimized
              className="object-cover"
            />
          )}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {bilder.map((b, i) => (
            <button
              key={b.src}
              type="button"
              onClick={() => setBildNr(i)}
              aria-label={t('bild', { n: i + 1, gesamt: bilder.length })}
              aria-current={i === bildNr}
              className={clsx(
                'relative h-20 w-16 flex-none overflow-hidden rounded-[3px] bg-[#F1F1F1] transition-opacity',
                i === bildNr ? 'ring-1 ring-gold' : 'opacity-70 hover:opacity-100',
              )}
            >
              <Image src={b.klein} alt="" fill unoptimized className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Auswahl */}
      <div className="max-w-[31rem]">
        {kategorieName && (
          <p className="font-body text-sm uppercase tracking-[0.22em] text-gold">
            {kategoriePfad ? (
              <Link href={kategoriePfad} className="hover:underline underline-offset-4">
                {kategorieName}
              </Link>
            ) : (
              kategorieName
            )}
          </p>
        )}
        <h1 className="mt-3 font-serif text-[clamp(2rem,4.4vw,2.9rem)] font-normal leading-[1.1] text-primary">
          {produkt.name}
        </h1>
        {/* Feste Höhe: der Preis erscheint erst, wenn die Währung feststeht, und darf dabei nichts verschieben. */}
        <p className="mt-4 h-8 font-body text-xl text-primary" aria-live="polite">
          {betrag != null && waehrung ? preisText(betrag, waehrung, locale) : waehrung ? '' : ' '}
        </p>
        {waehrung === 'EUR' && preisVariante && preisVariante.eur == null && (
          <p className="mt-2 font-body text-sm text-secondary">{t('preis_fehlt')}</p>
        )}
        {produkt.lieferzeit && <p className="mt-3 font-body text-sm text-secondary">{produkt.lieferzeit}</p>}

        <div className="mt-8">
          <p className="font-body text-sm text-secondary">
            {t('farbe')}: <span className="text-primary">{farbe}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {produkt.farben.map((f) => (
              <button
                key={f.name}
                type="button"
                onClick={() => {
                  setFarbe(f.name);
                  setBildNr(0);
                  setZustand('frei');
                }}
                aria-label={f.name}
                aria-pressed={f.name === farbe}
                title={f.name}
                className={clsx(
                  'relative h-14 w-12 overflow-hidden rounded-[3px] bg-[#F1F1F1]',
                  f.name === farbe ? 'ring-1 ring-gold ring-offset-2 ring-offset-bg' : 'opacity-80 hover:opacity-100',
                )}
              >
                {f.bilder[0] && <Image src={f.bilder[0].klein} alt="" fill unoptimized className="object-cover" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="font-body text-sm text-secondary">{t('groesse')}</p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {produkt.groessen.map((g) => {
              const v = produkt.varianten.find((x) => x.farbe === farbe && x.groesse === g);
              const geht = !!v?.lieferbar;
              return (
                <button
                  key={g}
                  type="button"
                  disabled={!geht}
                  onClick={() => {
                    setGroesse(g);
                    setZustand('frei');
                  }}
                  aria-pressed={g === groesse}
                  title={geht ? g : `${g} – ${t('nicht_lieferbar')}`}
                  className={clsx(
                    'rounded-[3px] border py-2.5 font-body text-sm transition-colors',
                    g === groesse ? 'border-gold text-primary' : 'border-white/20 text-secondary hover:border-white/40',
                    !geht && 'cursor-not-allowed line-through opacity-40',
                  )}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            type="button"
            onClick={hinzufuegen}
            disabled={zustand === 'laeuft' || (waehrung === 'EUR' && preisVariante?.eur == null)}
            className="w-full disabled:cursor-wait disabled:opacity-60"
          >
            {zustand === 'laeuft' ? t('wird_gelegt') : t('in_warenkorb')}
          </Button>
          <p className="min-h-6 font-body text-sm" aria-live="polite">
            {zustand === 'ohne_groesse' && <span className="text-secondary">{t('groesse_waehlen')}</span>}
            {zustand === 'fehler' && <span className="text-secondary">{t('fehler')}</span>}
            {zustand === 'drin' && (
              <span className="text-primary">
                {t('hinzugefuegt')}{' '}
                <Link href={warenkorbPfad} className="text-gold underline-offset-4 hover:underline">
                  {t('zum_warenkorb')} →
                </Link>
              </span>
            )}
          </p>
        </div>

        {/* HTML aus dem Shop (Snippets 68/69): Beschreibung, dann Grössentabelle,
            Material und Versand als <details>. Gestaltet wird es hier, nicht dort. */}
        {produkt.beschreibungHtml && (
          <div
            className={clsx(
              'mt-10 border-t border-white/10 pt-8 font-body leading-[1.75] tracking-[0.012em] text-secondary',
              '[&_p]:mb-4 [&_em]:text-primary [&_a]:text-gold [&_a]:underline-offset-4 hover:[&_a]:underline',
              '[&_details]:border-b [&_details]:border-white/10 [&_details]:py-4',
              '[&_summary]:cursor-pointer [&_summary]:text-primary [&_summary]:marker:text-gold',
              '[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:text-primary',
              '[&_table]:my-3 [&_table]:block [&_table]:overflow-x-auto [&_table]:text-sm',
              '[&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-normal [&_th]:text-primary [&_td]:px-2 [&_td]:py-1.5',
              '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_strong]:font-medium [&_strong]:text-primary',
            )}
            dangerouslySetInnerHTML={{ __html: produkt.beschreibungHtml }}
          />
        )}
      </div>
    </div>
  );
}
