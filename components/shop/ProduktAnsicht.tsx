'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import Button from '@/components/Button';
import { BRAND_GRADIENT_CTA } from '@/lib/brand';
import { ZAHLARTEN_BILDER } from '@/lib/shop/kasse';
import { merkeKorbAnzahl } from '@/lib/shop/korbZaehler';
import type { Produkt, Warenkorb } from '@/lib/shop/typen';
import { preisText } from '@/lib/shop/waehrung';
import { useWaehrung } from './useWaehrung';

// Produktseite auf onefam.ch (Probeaufbau 20.11.2026, umgebaut am 21.11.2026).
//
// Inhaltlich wie die heutige Seite im Shop: Farbe, Grösse, Galerie je Farbe,
// Preis in CHF oder EUR. Farben als Bildchen statt als Klappliste — das Bildchen
// ist das freihängende Teil in genau dieser Farbe. Ein gemalter Farbpunkt wäre
// eine Behauptung über den Farbton; das Foto zeigt ihn.
//
// Die Galerie wechselt mit der Farbe. Die Grösse wird bewusst NICHT
// vorausgewählt: Wer nicht wählt, bestellt sonst die erste Grösse der Liste —
// und für Lieferungen in die Schweiz gibt es kein Rückgaberecht bei falsch
// gewählter Grösse.
//
// UMBAU VOM 21.11.2026 — Vorbilder von awwwards.com, von Labi so freigegeben
// (Almada Label für den Aufbau, Kindred of Ireland für "auf Bestellung" und die
// Reiter). Anlass war die Durchsicht vom selben Tag, gemessen bei 412 × 800 px:
// Preis ab 790 px, Kaufknopf ab 1246 px (zweiter Bildschirm), Grössentabelle ab
// 2427 px am Seitenende.
//
//   1. Titel kleiner (28–34 px statt bis 46 px). Fünf Referenzshops liegen bei
//      13,5–32 px (docs/REFERENZ-shopdesign.md). Aufrecht, nicht kursiv wie bei
//      Almada: Kursiv ist auf onefam.ch den Zitaten vorbehalten.
//   2. Auf dem Handy stehen Titel und Preis ÜBER dem Bild, und unten läuft eine
//      schmale Kaufleiste mit, solange der Kaufknopf nicht im Bild ist.
//   3. "Grössentabelle" steht bei der Grössenwahl, nicht mehr am Seitenende.
//   4. "Wird erst für dich gedruckt" bei der Grösse — der Kunde soll es vor dem
//      Kauf wissen, nicht aus den AGB.
//   5. Unter dem Kaufknopf: Lieferzeit und Zahlarten. Dann die Angaben zum Teil.
//   6. Erzählung, Grössen, Material und Versand als Reiter statt als Textwand
//      mit drei Klappen am Ende. Alle Reiter stehen im HTML (nur ausgeblendet).
//   7. Die Galerie bleibt am Bildschirm stehen, während rechts gelesen wird —
//      vorher blieben links rund 500 px leer.

type Zustand = 'frei' | 'laeuft' | 'drin' | 'fehler' | 'ohne_groesse';

const FLIESSTEXT = clsx(
  'font-body leading-[1.75] tracking-[0.012em] text-secondary',
  '[&_p]:mb-4 [&_em]:text-primary [&_a]:text-gold [&_a]:underline-offset-4 hover:[&_a]:underline',
  '[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:text-primary',
  '[&_table]:my-3 [&_table]:block [&_table]:overflow-x-auto [&_table]:text-sm',
  '[&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-normal [&_th]:text-primary [&_td]:px-2 [&_td]:py-1.5',
  '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_strong]:font-medium [&_strong]:text-primary',
);

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
  const [zustand, setZustand] = useState<Zustand>('frei');

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
  const preis = betrag != null && waehrung ? preisText(betrag, waehrung, locale) : null;
  const preisFehlt = waehrung === 'EUR' && !!preisVariante && preisVariante.eur == null;

  // Die Reiter. Die drei Klappen des Shops kommen in fester Reihenfolge
  // (Grössentabelle, Material, Versand) und bekommen kurze Namen. Liefert der
  // Shop einmal eine andere Zahl, heissen sie so, wie der Shop sie nennt.
  const reiter = useMemo(() => {
    const { erzaehlung, klappen } = produkt.abschnitte;
    const kurz = ['groessen', 'material', 'versand'] as const;
    const namen = { groessen: t('reiter_groessen'), material: t('reiter_material'), versand: t('reiter_versand') };
    const liste: { id: string; titel: string; html: string }[] = [];
    if (erzaehlung) liste.push({ id: 'geschichte', titel: t('reiter_geschichte'), html: erzaehlung });
    klappen.forEach((k, i) => {
      const fest = klappen.length === 3 ? kurz[i] : null;
      liste.push({ id: fest ?? `klappe-${i}`, titel: fest ? namen[fest] : k.titel, html: k.html });
    });
    return liste;
  }, [produkt.abschnitte, t]);
  const [aktiv, setAktiv] = useState(reiter[0]?.id ?? '');
  const hat = (id: string) => reiter.some((r) => r.id === id);

  const reiterRef = useRef<HTMLDivElement>(null);
  const groesseRef = useRef<HTMLDivElement>(null);
  const knopfRef = useRef<HTMLDivElement>(null);

  function zeigeReiter(id: string) {
    setAktiv(id);
    reiterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Die Kaufleiste am Handy erscheint, solange der eigentliche Kaufknopf nicht im
  // Bild ist — also schon beim Öffnen der Seite (dort steht das Foto), und wieder,
  // wenn weiter unten gelesen wird.
  const [knopfImBild, setKnopfImBild] = useState(true);
  useEffect(() => {
    const el = knopfRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const beobachter = new IntersectionObserver(([eintrag]) => setKnopfImBild(eintrag.isIntersecting));
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, []);

  async function hinzufuegen() {
    if (!variante) {
      setZustand('ohne_groesse');
      // Von der Kaufleiste aus ist die Grössenwahl oft nicht im Bild.
      groesseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setZustand('laeuft');
    try {
      const antwort = await fetch('/api/shop/warenkorb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-onefam-sprache': locale },
        body: JSON.stringify({ aktion: 'hinzu', id: variante.id, menge: 1 }),
      });
      if (antwort.ok) merkeKorbAnzahl(((await antwort.json()) as Warenkorb).anzahl);
      setZustand(antwort.ok ? 'drin' : 'fehler');
    } catch {
      setZustand('fehler');
    }
  }

  const gesperrt = zustand === 'laeuft' || preisFehlt;

  return (
    <>
      {/* Raster mit drei Flächen: Kopf, Galerie, Auswahl. Im HTML in dieser
          Reihenfolge — so steht am Handy der Titel über dem Bild. Am Bildschirm
          rückt die Galerie nach links und läuft über beide Zeilen.
          grid-cols-[minmax(0,1fr)] auch auf dem Handy: Ohne feste Spalte wächst das
          Raster auf die Breite seines breitesten Inhalts — die waagrecht scrollende
          Bildchenleiste —, und die ganze Seite wurde breiter als der Bildschirm
          (gemessen 20.11.2026 bei 412 px). */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-x-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Kopf */}
        <div className="max-w-[31rem] lg:col-start-2 lg:row-start-1">
          {kategorieName && (
            <p className="font-body text-xs uppercase tracking-[0.22em] text-gold">
              {kategoriePfad ? (
                // -my-4 py-4: 47 px Tippfläche, ohne dass die Zeile höher wird (gemessen vorher 77 x 15).
                <Link href={kategoriePfad} className="-my-4 inline-block py-4 underline-offset-4 hover:underline">
                  {kategorieName}
                </Link>
              ) : (
                kategorieName
              )}
            </p>
          )}
          <h1 className="mt-2 font-serif text-[clamp(1.75rem,2.4vw,2.125rem)] font-normal leading-[1.15] text-primary">
            {produkt.name}
          </h1>
          {/* Feste Höhe: der Preis erscheint erst, wenn die Währung feststeht, und darf dabei nichts verschieben. */}
          <p className="mt-2 flex h-7 items-baseline gap-3 font-body" aria-live="polite">
            <span className="text-lg text-primary">{preis ?? ' '}</span>
            {preis && hat('versand') && (
              // "zzgl. Versand" gehört zum Preis (in Deutschland § 6 PAngV). Der Betrag
              // hängt vom Land ab und steht im Reiter und im Warenkorb.
              <button
                type="button"
                onClick={() => zeigeReiter('versand')}
                className="-my-3 py-3 text-sm text-secondary underline decoration-white/25 underline-offset-4 hover:text-primary"
              >
                {t('zzgl_versand')}
              </button>
            )}
          </p>
          {preisFehlt && <p className="mt-2 font-body text-sm text-secondary">{t('preis_fehlt')}</p>}
        </div>

        {/* Galerie */}
        <div className="mt-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-start lg:sticky lg:top-24">
          {/* Fläche in Seitenfarbe (bis 22.11.2026 hellgrau #F1F1F1): Freistehende Bilder haben
              einen durchsichtigen Hintergrund (lib/shop/schwebebilder.ts) und sollen ohne Kasten
              auf der Seite stehen. Shop-Bilder mit eigenem hellem Grund füllen die Fläche ohnehin. */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-bg">
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
                  'relative h-20 w-16 flex-none overflow-hidden rounded-[3px] bg-bg transition-opacity',
                  i === bildNr ? 'ring-1 ring-gold' : 'opacity-70 hover:opacity-100',
                )}
              >
                <Image src={b.klein} alt="" fill unoptimized className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Auswahl */}
        <div className="mt-8 max-w-[31rem] lg:col-start-2 lg:row-start-2">
          <div>
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
                    'relative h-14 w-12 overflow-hidden rounded-[3px] bg-bg',
                    f.name === farbe ? 'ring-1 ring-gold ring-offset-2 ring-offset-bg' : 'opacity-80 hover:opacity-100',
                  )}
                >
                  {f.bilder[0] && <Image src={f.bilder[0].klein} alt="" fill unoptimized className="object-cover" />}
                </button>
              ))}
            </div>
          </div>

          <div ref={groesseRef} className="mt-8">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-body text-sm text-secondary">
                {t('groesse')}
                {groesse && <span className="text-primary">: {groesse}</span>}
              </p>
              {hat('groessen') && (
                <button
                  type="button"
                  onClick={() => zeigeReiter('groessen')}
                  className="-my-3 py-3 font-body text-sm text-gold underline-offset-4 hover:underline"
                >
                  {t('groessentabelle')} →
                </button>
              )}
            </div>
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
                      'rounded-[3px] border py-3 font-body text-sm transition-colors',
                      g === groesse ? 'border-gold text-primary' : 'border-white/20 text-secondary hover:border-white/40',
                      !geht && 'cursor-not-allowed line-through opacity-40',
                    )}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
            {/* Auf Bestellung gedruckt: gehört zur Grössenwahl, weil es der Grund ist,
                genau hinzusehen. Ein Punkt in Gold, kein Schild. */}
            <p className="mt-4 flex items-center gap-2 font-body text-sm text-secondary">
              <span aria-hidden className="inline-block h-1.5 w-1.5 flex-none rounded-full bg-gold" />
              {t('auf_bestellung')}
            </p>
          </div>

          <div ref={knopfRef} className="mt-7 flex flex-col gap-3">
            <Button
              type="button"
              onClick={hinzufuegen}
              disabled={gesperrt}
              className="w-full disabled:cursor-wait disabled:opacity-60"
              // Der Markenverlauf auf dem Kaufknopf: Labis Entscheid vom 21.11.2026
              // ("wie im Entwurf"). Auf den Shop-Seiten ist das die eine Hauptaktion;
              // "Join the Fam" in der Kopfzeile tritt dort zurück (components/Nav.tsx).
              // Die Schrift steht in der Mitte des breiten Knopfs, weit weg vom
              // violetten Ende — Kontrastregel in lib/brand.ts.
              style={{ background: BRAND_GRADIENT_CTA }}
            >
              {zustand === 'laeuft' ? t('wird_gelegt') : t('in_warenkorb')}
            </Button>
            <p className="min-h-6 font-body text-sm" aria-live="polite">
              {zustand === 'ohne_groesse' && <span className="text-secondary">{t('groesse_waehlen')}</span>}
              {zustand === 'fehler' && <span className="text-secondary">{t('fehler')}</span>}
              {zustand === 'drin' && (
                <span className="text-primary">
                  {t('hinzugefuegt')}{' '}
                  <Link href={warenkorbPfad} className="-my-3 inline-block py-3 text-gold underline-offset-4 hover:underline">
                    {t('zum_warenkorb')} →
                  </Link>
                </span>
              )}
            </p>
          </div>

          {/* Was vor dem Kauf zählt, direkt unter dem Knopf: wann es kommt und womit
              man zahlt. Die Lieferzeit-Zeile ist der Wortlaut des Shops (Snippet 102). */}
          <div className="border-t border-white/10 pt-5">
            {produkt.lieferzeit && <p className="font-body text-sm leading-[1.6] text-secondary">{produkt.lieferzeit}</p>}
            <ul aria-label={t('zahlarten')} className="mt-3 flex flex-wrap items-center gap-2">
              {ZAHLARTEN_BILDER.map((z) => (
                <li key={z.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={z.src} alt={z.name.replace('_', ' ')} height={22} className="h-[22px] w-auto" loading="lazy" />
                </li>
              ))}
            </ul>
          </div>

          {/* Die Angaben zum Teil: Schnitt, Stoff, Herkunft — eine Zeile aus dem Shop. */}
          {produkt.abschnitte.stueck && (
            <div
              className={clsx('mt-7', FLIESSTEXT)}
              dangerouslySetInnerHTML={{ __html: `<p>${produkt.abschnitte.stueck}</p>` }}
            />
          )}

          {/* Reiter. HTML aus dem Shop (Snippets 61, 62, 68, 69); gestaltet wird es hier. */}
          {reiter.length > 0 && (
            <div ref={reiterRef} className="mt-6 scroll-mt-24">
              {/* Am Handy enger und eine Stufe kleiner: Bei 412 px waren die vier Namen
                  27 px breiter als die Spalte, der letzte Reiter war angeschnitten. */}
              <div role="tablist" className="flex gap-4 overflow-x-auto border-b border-white/10 sm:gap-6">
                {reiter.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    role="tab"
                    id={`reiter-${r.id}`}
                    aria-selected={r.id === aktiv}
                    aria-controls={`feld-${r.id}`}
                    onClick={() => setAktiv(r.id)}
                    className={clsx(
                      '-mb-px flex-none whitespace-nowrap border-b py-3 font-serif text-base transition-colors sm:text-lg',
                      r.id === aktiv ? 'border-gold text-primary' : 'border-transparent text-faint hover:text-secondary',
                    )}
                  >
                    {r.titel}
                  </button>
                ))}
              </div>
              {reiter.map((r) => (
                <div
                  key={r.id}
                  role="tabpanel"
                  id={`feld-${r.id}`}
                  aria-labelledby={`reiter-${r.id}`}
                  hidden={r.id !== aktiv}
                  className={clsx('pt-6', FLIESSTEXT)}
                  dangerouslySetInnerHTML={{ __html: r.html }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kaufleiste am Handy. Schmal, ohne Schatten und ohne Bild: Preis links, der
          eine Knopf rechts. Ist keine Grösse gewählt, führt der Knopf zur Grössenwahl. */}
      <div
        className={clsx(
          'fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-bg/95 px-4 py-3 backdrop-blur-sm transition-transform duration-200 lg:hidden',
          knopfImBild ? 'pointer-events-none translate-y-full' : 'translate-y-0',
        )}
        aria-hidden={knopfImBild}
      >
        {zustand === 'drin' ? (
          // Nach dem Hineinlegen ist der nächste Schritt der Warenkorb — der Knopf
          // wechselt, statt daneben einen abgeschnittenen Link zu zeigen.
          <div className="flex items-center gap-4">
            <p className="min-w-0 flex-1 truncate font-body text-sm text-primary">{t('hinzugefuegt')}</p>
            <Button
              as="a"
              href={warenkorbPfad}
              variant="secondary"
              tabIndex={knopfImBild ? -1 : 0}
              className="flex-none !px-5 !py-3 !text-sm"
            >
              {t('zum_warenkorb')} →
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1 font-body">
              <p className="truncate text-base text-primary">{preis ?? ' '}</p>
              <p className="truncate text-xs text-secondary">
                {groesse ? `${farbe} · ${groesse}` : zustand === 'ohne_groesse' ? t('groesse_waehlen') : t('groesse_kurz')}
              </p>
            </div>
            <Button
              type="button"
              onClick={hinzufuegen}
              disabled={gesperrt}
              tabIndex={knopfImBild ? -1 : 0}
              className="flex-none !px-5 !py-3 !text-sm disabled:cursor-wait disabled:opacity-60"
              style={{ background: BRAND_GRADIENT_CTA }}
            >
              {t('in_warenkorb')}
            </Button>
          </div>
        )}
      </div>
      {/* Platz, damit die Leiste am Handy nicht die Fusszeile verdeckt. */}
      <div aria-hidden className="h-16 lg:hidden" />
    </>
  );
}
