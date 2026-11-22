'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Button from '@/components/Button';
import type { KachelProdukt } from '@/lib/shop/typen';
import { kategoriePfad, type Locale } from '@/i18n/routing';
import { preisText } from '@/lib/shop/waehrung';
import { useWaehrung } from './useWaehrung';

// "Nach Land shoppen" auf onefam.ch (21.11.2026): Suche, die Länder und Linien,
// die es schon gibt, und die Wunschwand mit allen übrigen Ländern samt
// Warteliste. Vorlage ist die Seite /shop-by-country/ des Shops (Router-Snippet
// 11); Texte und Länderliste sind von dort übernommen.
//
// DIE WARTELISTE BLEIBT IM SHOP (Snippet 18) und wird vom Browser DIREKT
// angesprochen, nicht über den Server von onefam.ch. Grund: Sie bremst
// Massen-Einträge je IP-Adresse (höchstens 8 in der Stunde). Liefe sie über
// onefam.ch, kämen alle Besucher von derselben Adresse — der Server von Vercel —
// und sperrten sich gegenseitig aus. Der Shop erlaubt den Zugriff von onefam.ch
// (am 21.11.2026 gemessen: Vorabfrage 200, Zähler und Ablehnung einer
// ungültigen Adresse kommen an). Bestätigungsmail, doppelte Bestätigung,
// Abmeldelink und Aufräumen nach 30 Tagen macht weiter Snippet 18.
//
// Was von der Vorlage abweicht:
//   - Die kaufbaren Länder stehen als grosse Karten mit Produktbild und Preis
//     ganz oben (im Shop: kleine Kacheln unter den Logo-Linien). Was man kaufen
//     kann, soll man zuerst sehen.
//   - Ein Suchfeld statt zwei. Das zweite gab es im Shop, weil das erste 650 px
//     über der Wand stand; hier rücken die Treffer beim Tippen nach oben.
//   - Kein "Mitentscheiden"-Schildchen auf jeder der rund 250 Kacheln; der Satz
//     über der Wand sagt es einmal.
//
// UMBAU AM 22.11.2026 (Labi nach drei Vorbildern von awwwards: "ja oval so wie du
// es vorschlägst, mach Punkt 2 und 3 gleich mit"):
//   1. Die Karte eines Landes zeigt das ZEICHEN GROSS, so wie es auf dem Stoff
//      sitzt, statt des ganzen Hoodies (lib/shop/zeichenbilder.ts). Vorher standen
//      vier fast gleiche schwarze Hoodies nebeneinander, das Zeichen rund 15 % der
//      Karte breit. Vorbild Thebe Magugu: jede Kollektion ist ein eigenes Ding.
//   2. Darunter drei ruhige Zeilen mit feinen Linien — Land und Preis, die Teile,
//      die Farben — wie auf der Länderseite und wie bei Unimatic. Vorher zwei
//      Zeilen, Preis und Teile in einem Satz.
//   3. Die Wunschwand ist eine nummerierte Namensliste statt eines Rasters aus
//      Kästchen (Vorbild Offform). Das Wort "Mitentscheiden" erscheint erst beim
//      Darüberfahren; am Telefon steht nur der Pfeil.

const WARTELISTE = 'https://shop.onefam.ch/wp-json/onefam/v1/waitlist';
const KACHELBILDER = 'https://shop.onefam.ch/wp-content/uploads/onefam-assets/collections';

/** Ab so vielen Einträgen plant OneFam die Auflage — derselbe Wert wie im Shop (WZIEL). */
const ZIEL = 100;
/** Erst ab so vielen bestätigten Einträgen wird der Stand gezeigt — wie im Shop. */
const STAND_AB = 10;
/**
 * Eingeklappt zeigt die Wand so viele Länder. Muss durch 3 und 2 teilbar sein
 * (die Liste steht in einer, zwei oder drei Spalten), sonst bleibt in der letzten
 * Reihe eine Lücke. Ausgeklappt wären es am Telefon rund 190 Zeilen; gesucht wird
 * ohnehin das eigene Land.
 */
const ZEIGEN = 24;

export type Linie = {
  slug: string;
  name: string;
  bild: string;
  /** Das Zeichen gross auf dem Stoff (lib/shop/zeichenbilder.ts); fehlt es, steht das Produktbild im Kasten. */
  zeichen?: string | null;
  produkte: KachelProdukt[];
};
export type WandLand = { id: string; en: string; name: string; satz: string };
export type BaldKarte = { en: string; bild: string };

/** "Türkei" → "turkei": Akzente weg, damit die Suche auch ohne sie trifft. */
function ohneAkzente(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}
/** "Türkei" → "tuerkei": wer keine Umlaute tippt, schreibt genau so. Beide Wege gibt es im Shop seit 08.09.2026. */
function umlauteAus(s: string) {
  return s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/å/g, 'aa').trim();
}
function trifft(suche: string, ...namen: string[]) {
  if (!suche.trim()) return true;
  const a = ohneAkzente(suche);
  const b = umlauteAus(suche);
  return namen.some((n) => ohneAkzente(n).includes(a) || umlauteAus(n).includes(b));
}

function LinienKarte({ linie, locale }: { linie: Linie; locale: Locale }) {
  const t = useTranslations('shop_laender');
  const tSeiten = useTranslations('shop_seiten');
  const waehrung = useWaehrung();

  // "Hoodie · Sweater · Shirt": das letzte Wort jedes Produktnamens, wie in PreisZeile.
  const arten = linie.produkte.map((p) => p.name.trim().split(/\s+/).pop()).join(' · ');
  const farben = linie.produkte.map((p) => p.farben);
  const meiste = Math.max(...farben);

  // Der günstigste Preis der Linie. Die Währung kennt erst der Browser (Zeitzone);
  // in EUR nur, wenn jedes Teil einen Festpreis hat — sonst lieber keiner als ein falscher.
  let preis: string | null = null;
  if (waehrung === 'CHF') {
    preis = preisText(Math.min(...linie.produkte.map((p) => p.chf)), 'CHF', locale);
  } else if (waehrung === 'EUR' && linie.produkte.every((p) => p.eur != null)) {
    preis = preisText(Math.min(...linie.produkte.map((p) => p.eur as number)), 'EUR', locale);
  }

  return (
    <li>
      <Link href={kategoriePfad(locale, linie.slug)} className="group block">
        {linie.zeichen ? (
          // Kein Kasten, keine Fläche: Das Bild ist am Rand durchsichtig und steht direkt auf der Seite.
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={linie.zeichen}
              alt={linie.name}
              fill
              unoptimized
              className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-[#F1F1F1]">
            {linie.bild && (
              <Image
                src={linie.bild}
                alt={linie.name}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            )}
          </div>
        )}
        {/* Drei Zeilen, durch feine Linien getrennt. flex-wrap: am Telefon (Karte rund 180 px)
            passen "Afghanistan" und der Preis nicht nebeneinander — dann steht der Preis darunter. */}
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className="font-serif text-xl font-normal text-primary sm:text-2xl">{linie.name}</h3>
          {/* Feste Mindesthöhe: der Preis erscheint erst mit der Währung und soll nichts verschieben. */}
          <p className="min-h-[1.25rem] font-body text-sm text-primary" aria-live="polite">
            {preis ? tSeiten('ab_preis', { preis }) : ' '}
          </p>
        </div>
        <p className="mt-3 border-t border-white/10 pt-3 font-body text-sm text-secondary">{arten}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-white/10 pt-3 font-body text-sm">
          <span className="text-secondary">
            {farben.every((f) => f === meiste) ? tSeiten('farben', { n: meiste }) : t('farben_bis', { n: meiste })}
          </span>
          <span className="text-gold underline-offset-4 group-hover:underline">{t('ansehen')} →</span>
        </div>
      </Link>
    </li>
  );
}

export default function LaenderWand({
  verfuegbar,
  linien,
  bald,
  wand,
  teilenUrl,
}: {
  verfuegbar: (Linie & { en: string })[];
  linien: Linie[];
  bald: BaldKarte[];
  wand: WandLand[];
  teilenUrl: string;
}) {
  const t = useTranslations('shop_laender');
  const tWarte = useTranslations('waitlist');
  const locale = useLocale() as Locale;

  const [suche, setSuche] = useState('');
  const [offen, setOffen] = useState(false);

  // Das Fenster der Warteliste
  const fenster = useRef<HTMLDialogElement>(null);
  const [wunsch, setWunsch] = useState<WandLand | null>(null);
  const [email, setEmail] = useState('');
  const [zustand, setZustand] = useState<'frei' | 'sendet' | 'ok' | 'fehler'>('frei');
  const [bestaetigt, setBestaetigt] = useState<number | null>(null);
  const [kopiert, setKopiert] = useState(false);

  const treffer = useMemo(() => wand.filter((l) => trifft(suche, l.name, l.en)), [wand, suche]);
  const trefferVerfuegbar = useMemo(
    () => verfuegbar.filter((l) => trifft(suche, l.name, l.en)),
    [verfuegbar, suche],
  );
  const sucht = suche.trim() !== '';
  const gezeigt = sucht || offen ? treffer : treffer.slice(0, ZEIGEN);
  // Die Nummer eines Landes ist sein Platz in der ganzen Liste — sie bleibt beim Suchen dieselbe.
  const nummer = useMemo(() => new Map(wand.map((l, i) => [l.id, String(i + 1).padStart(2, '0')])), [wand]);

  function oeffnen(land: WandLand) {
    setWunsch(land);
    setEmail('');
    setZustand('frei');
    setBestaetigt(null);
    setKopiert(false);
    fenster.current?.showModal();
  }

  // Stand der Warteliste für das gewählte Land. Scheitert die Abfrage, bleibt es
  // beim Satz ohne Zahl — das Fenster funktioniert trotzdem.
  useEffect(() => {
    if (!wunsch) return;
    let aktuell = true;
    fetch(`${WARTELISTE}/count?country=${encodeURIComponent(wunsch.en)}`)
      .then((r) => r.json())
      .then((j: { ok?: boolean; confirmed?: number }) => {
        if (aktuell && j?.ok && typeof j.confirmed === 'number') setBestaetigt(j.confirmed);
      })
      .catch(() => {});
    return () => {
      aktuell = false;
    };
  }, [wunsch]);

  async function eintragen(ereignis: React.FormEvent) {
    ereignis.preventDefault();
    if (!wunsch) return;
    setZustand('sendet');
    try {
      const antwort = await fetch(WARTELISTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // `country` ist der englische Name — unter ihm führt der Shop die Liste.
        body: JSON.stringify({ email, country: wunsch.en, lang: locale }),
      });
      const daten = (await antwort.json().catch(() => null)) as { ok?: boolean } | null;
      setZustand(antwort.ok && daten?.ok === true ? 'ok' : 'fehler');
    } catch {
      setZustand('fehler');
    }
  }

  const teilenText = wunsch ? `${t('teilen_text', { land: wunsch.satz })} ${teilenUrl}` : '';
  const kannTeilen = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const teilKnopf =
    'rounded-full border border-white/25 px-4 py-2 font-body text-xs text-primary transition-colors hover:border-white/50';

  return (
    <>
      <label className="mt-6 block max-w-[31rem]">
        <span className="sr-only">{t('suche')}</span>
        <input
          type="search"
          value={suche}
          onChange={(e) => setSuche(e.target.value)}
          placeholder={t('suche')}
          autoComplete="off"
          className="w-full rounded-[4px] border border-white/20 bg-transparent px-4 py-3 font-body text-primary placeholder:text-faint focus:border-gold focus:outline-none"
        />
      </label>

      {/* Jetzt verfügbar */}
      {trefferVerfuegbar.length > 0 && (
        <section id="jetzt" className="scroll-mt-20 pt-10 md:pt-12">
          <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2.1rem)] font-normal text-primary">{t('jetzt')}</h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {trefferVerfuegbar.map((l) => (
              <LinienKarte key={l.slug} linie={l} locale={locale} />
            ))}
          </ul>
        </section>
      )}

      {/* Signature — beim Suchen ausgeblendet: gesucht wird ein Land, und die Treffer sollen nicht darunter liegen. */}
      {!sucht && (linien.length > 0 || bald.length > 0) && (
        <section id="signature" className="scroll-mt-20 pt-14 md:pt-20">
          <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2.1rem)] font-normal text-primary">
            {t('signature_titel')}
          </h2>
          <p className="mt-3 max-w-[31rem] font-body leading-[1.75] tracking-[0.012em] text-secondary">
            {t('signature_text')}
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {linien.map((l) => (
              <LinienKarte key={l.slug} linie={l} locale={locale} />
            ))}
            {bald.map((b) => (
              <li key={b.en}>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => oeffnen({ id: b.en, en: b.en, name: b.en, satz: b.en })}
                  className="group block w-full text-left"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-[#F1F1F1]">
                    <Image src={b.bild} alt={b.en} fill unoptimized className="object-cover opacity-80" />
                    <span className="absolute left-3 top-3 rounded-full bg-bg/85 px-3 py-1 font-body text-[11px] uppercase tracking-[0.14em] text-primary">
                      {t('bald')}
                    </span>
                  </div>
                  <span className="mt-4 block font-serif text-2xl font-normal text-secondary group-hover:text-primary">
                    {b.en}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Alle Länder */}
      <section id="laender" className="scroll-mt-20 pt-14 md:pt-20">
        <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2.1rem)] font-normal text-primary">{t('alle')}</h2>
        <p className="mt-3 max-w-[31rem] font-body leading-[1.75] tracking-[0.012em] text-secondary">
          {t('alle_text')}
        </p>

        {treffer.length === 0 && trefferVerfuegbar.length === 0 ? (
          <p className="mt-8 font-body text-secondary">{t('kein_treffer')}</p>
        ) : (
          // Namensliste statt Kästchen. Die Linie über der ersten Zeile braucht je Spaltenzahl
          // eine eigene Regel (eine, zwei oder drei Spalten), sonst fehlt sie in Spalte zwei und drei.
          <ol className="mt-8 grid grid-cols-1 gap-x-12 md:grid-cols-2 xl:grid-cols-3">
            {gezeigt.map((l) => (
              <li
                key={l.id}
                className="border-b border-white/10 first:border-t md:[&:nth-child(-n+2)]:border-t xl:[&:nth-child(-n+3)]:border-t"
              >
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => oeffnen(l)}
                  className="group relative flex min-h-[3.5rem] w-full items-center gap-4 py-2 text-left"
                >
                  <span aria-hidden="true" className="w-8 flex-none font-body text-xs tabular-nums text-faint">
                    {nummer.get(l.id)}
                  </span>
                  <Image
                    src={`${KACHELBILDER}/${l.id}.webp`}
                    alt=""
                    width={40}
                    height={40}
                    unoptimized
                    loading="lazy"
                    className="flex-none transition-transform duration-300 ease-out group-hover:scale-[1.3]"
                  />
                  {/* Der Name bricht um, statt abgeschnitten zu werden ("Amerikanische Jungferninseln",
                      "Südgeorgien und die Südlichen Sandwichinseln"). */}
                  <span className="min-w-0 flex-1 font-body text-base leading-snug text-primary transition-colors group-hover:text-gold">
                    {l.name}
                  </span>
                  {/* Liegt ÜBER der Zeile und belegt keinen Platz: Als unsichtbares Wort im Fluss nahm es dem
                      Namen rund 130 px weg, lange Namen wurden abgeschnitten (gemessen am 22.11.2026). Der
                      Grund in Seitenfarbe deckt das Ende eines langen Namens ab, solange das Wort zu sehen ist. */}
                  <span className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 bg-bg pl-3 font-body text-[11px] uppercase tracking-[0.14em] text-gold opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 max-lg:hidden">
                    {t('mitentscheiden')}
                  </span>
                  <span aria-hidden="true" className="flex-none font-body text-faint transition-colors group-hover:text-gold">
                    →
                  </span>
                </button>
              </li>
            ))}
          </ol>
        )}

        {!sucht && !offen && treffer.length > ZEIGEN && (
          <p className="mt-8">
            <Button type="button" variant="secondary" onClick={() => setOffen(true)}>
              {t('mehr', { n: treffer.length })}
            </Button>
          </p>
        )}
      </section>

      {/* Fenster der Warteliste */}
      <dialog
        ref={fenster}
        onClose={() => setWunsch(null)}
        onClick={(e) => {
          // Klick auf den abgedunkelten Rand schliesst — der Rand ist das dialog-Element selbst.
          if (e.target === fenster.current) fenster.current?.close();
        }}
        className="m-auto w-[min(92vw,30rem)] rounded-[4px] border border-white/15 bg-bg p-0 text-primary backdrop:bg-black/75"
      >
        {wunsch && (
          <div className="p-7">
            <div className="flex items-start justify-between gap-4">
              <p className="font-body text-xs font-medium uppercase tracking-[0.22em] text-gold">
                {t('mitentscheiden')}
              </p>
              <button
                type="button"
                onClick={() => fenster.current?.close()}
                aria-label={t('schliessen')}
                className="-mr-2 -mt-2 px-2 py-1 font-body text-lg text-secondary hover:text-primary"
              >
                ✕
              </button>
            </div>
            <h2 className="mt-3 font-serif text-3xl font-normal text-primary">{wunsch.name}</h2>
            <p className="mt-4 font-body leading-[1.7] text-secondary">{t('dialog_intro', { land: wunsch.satz })}</p>
            <p className="mt-3 font-body text-sm text-faint" aria-live="polite">
              {bestaetigt != null && bestaetigt >= STAND_AB
                ? t('stand', { n: bestaetigt, ziel: ZIEL })
                : t('ziel', { ziel: ZIEL })}
            </p>

            {zustand !== 'ok' ? (
              <form onSubmit={eintragen} className="mt-6 flex flex-col gap-3">
                <label>
                  <span className="sr-only">{t('email')}</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('email')}
                    autoComplete="email"
                    className="w-full rounded-[4px] border border-white/20 bg-transparent px-4 py-3 font-body text-primary placeholder:text-faint focus:border-gold focus:outline-none"
                  />
                </label>
                <Button type="submit" disabled={zustand === 'sendet'} className="w-full disabled:cursor-wait disabled:opacity-60">
                  {t('knopf', { land: wunsch.satz })}
                </Button>
                {/* Derselbe Hinweis wie an der Warteliste der Startseite. */}
                <p className="font-body text-xs text-faint">{tWarte('hinweis')}</p>
                {zustand === 'fehler' && (
                  <p className="font-body text-sm text-secondary" role="alert">
                    {t('fehler')}
                  </p>
                )}
              </form>
            ) : (
              <div className="mt-6">
                <p className="font-body text-primary" role="status">
                  {t('ok')}
                </p>
                <p className="mt-6 font-body text-sm text-secondary">{t('teilen_titel', { land: wunsch.satz })}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    className={teilKnopf}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://wa.me/?text=${encodeURIComponent(teilenText)}`}
                  >
                    {t('whatsapp')}
                  </a>
                  {kannTeilen && (
                    <button
                      type="button"
                      className={teilKnopf}
                      onClick={() => navigator.share({ text: teilenText, url: teilenUrl }).catch(() => {})}
                    >
                      {t('teilen')}
                    </button>
                  )}
                  <button
                    type="button"
                    className={teilKnopf}
                    onClick={() =>
                      navigator.clipboard
                        .writeText(teilenUrl)
                        .then(() => setKopiert(true))
                        .catch(() => {})
                    }
                  >
                    {kopiert ? t('kopiert') : t('kopieren')}
                  </button>
                </div>
                {linien.length > 0 && (
                  <p className="mt-6 border-t border-white/10 pt-5 font-body text-sm text-secondary">
                    <a
                      href="#signature"
                      onClick={() => fenster.current?.close()}
                      className="text-gold underline-offset-4 hover:underline"
                    >
                      {t('bis_dahin')} →
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
