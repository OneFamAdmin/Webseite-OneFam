'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Button from '@/components/Button';
import { BRAND_GRADIENT_CTA } from '@/lib/brand';
import {
  LAENDER_MIT_EINFUHR,
  hatWiderruf,
  LEERE_ADRESSE,
  ZAHLARTEN_BILDER,
  fehlendeFelder,
  type Adresse,
  type LandRegel,
  type RechtsSeite,
} from '@/lib/shop/kasse';
import { merkeKorbAnzahl } from '@/lib/shop/korbZaehler';
import type { Warenkorb } from '@/lib/shop/typen';
import { preisText } from '@/lib/shop/waehrung';
import { useWaehrung } from './useWaehrung';

// Die Kasse auf onefam.ch (21.11.2026). Aufbau wie die Kasse des Shops:
// Kontakt, Lieferadresse, wahlweise abweichende Rechnungsadresse, Zahlart,
// Bestellübersicht, AGB-Satz, Bestellknopf. Gastbestellung ohne Konto — so ist
// der Shop eingestellt.
//
// Summen und Versand rechnet WooCommerce; diese Seite zeigt nur an, was der
// Warenkorb liefert, und schickt beim Bestellen die GESEHENE Summe mit. Stimmt
// sie dann nicht mehr, bestellt der Server nicht (app/api/shop/kasse/route.ts).
//
// Weggelassen gegenüber der Kasse des Shops: das Gutscheinfeld (im Shop gibt es
// keinen einzigen Gutschein, gemessen 21.11.2026) und das Notizfeld.
//
// Der Bestellknopf trägt den Markenverlauf: Er ist auf dieser Seite die eine
// Hauptaktion (Labis Entscheid vom 21.11.2026).

type Zustand = 'frei' | 'sendet' | 'weiter' | 'gesperrt';

// h-12: 48 px hoch (vorher 42) — gut zu treffen, und der Text wird beim Antippen am iPhone nicht vergrössert.
const EINGABE =
  'mt-1.5 h-12 w-full rounded-[4px] border bg-transparent px-3.5 font-body text-base text-primary focus:border-gold focus:outline-none';

function Feld({
  label,
  optional,
  fehler,
  breit,
  children,
}: {
  label: string;
  optional?: string;
  fehler?: boolean;
  breit?: boolean;
  children: (klasse: string) => React.ReactNode;
}) {
  return (
    <label className={`block font-body text-sm text-secondary ${breit ? 'col-span-2' : ''}`}>
      {label}
      {optional && <span className="text-faint"> {optional}</span>}
      {children(`${EINGABE} ${fehler ? 'border-[#E0705F]' : 'border-white/20'}`)}
    </label>
  );
}

function AdressFelder({
  wert,
  setze,
  regeln,
  fehlt,
  vorsilbe,
}: {
  wert: Adresse;
  setze: (a: Adresse) => void;
  regeln: LandRegel[];
  fehlt: Set<string>;
  /** 'shipping' oder 'billing' — für die Autovervollständigung des Browsers. */
  vorsilbe: 'shipping' | 'billing';
}) {
  const t = useTranslations('shop_kasse');
  const regel = regeln.find((r) => r.code === wert.land);
  const feld = (name: keyof Adresse) => ({
    value: wert[name],
    'aria-invalid': fehlt.has(name) || undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setze({ ...wert, [name]: e.target.value }),
  });

  return (
    // Zwei Spalten auch am Telefon: Vorname neben Nachname, PLZ neben Ort. Untereinander war
    // die Lieferadresse 800 px hoch und der Bestellknopf lag bei 1906 von 2846 px (gemessen
    // 22.11.2026 bei 606 px Breite).
    <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4">
      <Feld label={t('land')} fehler={fehlt.has('land')} breit>
        {(k) => (
          <select
            className={`${k} bg-bg`}
            autoComplete={`${vorsilbe} country`}
            value={wert.land}
            aria-invalid={fehlt.has('land') || undefined}
            // Mit dem Land wechseln die Kantone — die alte Auswahl gälte dort nicht.
            onChange={(e) => setze({ ...wert, land: e.target.value, region: '' })}
          >
            {!regel && <option value="">{t('bitte_waehlen')}</option>}
            {regeln.map((r) => (
              <option key={r.code} value={r.code}>
                {r.name}
              </option>
            ))}
          </select>
        )}
      </Feld>
      <Feld label={t('vorname')} fehler={fehlt.has('vorname')}>
        {(k) => <input className={k} autoComplete={`${vorsilbe} given-name`} maxLength={100} {...feld('vorname')} />}
      </Feld>
      <Feld label={t('nachname')} fehler={fehlt.has('nachname')}>
        {(k) => <input className={k} autoComplete={`${vorsilbe} family-name`} maxLength={100} {...feld('nachname')} />}
      </Feld>
      <Feld label={t('adresse1')} fehler={fehlt.has('adresse1')} breit>
        {(k) => <input className={k} autoComplete={`${vorsilbe} address-line1`} maxLength={100} {...feld('adresse1')} />}
      </Feld>
      <Feld label={t('adresse2')} optional={t('optional')} breit>
        {(k) => <input className={k} autoComplete={`${vorsilbe} address-line2`} maxLength={100} {...feld('adresse2')} />}
      </Feld>
      {!regel?.plz.versteckt && (
        <Feld label={regel?.plz.label ?? t('plz')} optional={regel?.plz.pflicht === false ? t('optional') : undefined} fehler={fehlt.has('plz')}>
          {(k) => <input className={k} autoComplete={`${vorsilbe} postal-code`} maxLength={20} {...feld('plz')} />}
        </Feld>
      )}
      <Feld label={t('ort')} fehler={fehlt.has('ort')}>
        {(k) => <input className={k} autoComplete={`${vorsilbe} address-level2`} maxLength={100} {...feld('ort')} />}
      </Feld>
      {/* Kanton, Bundesland, Provinz nur dort, wo der Shop sie VERLANGT (z. B. Italien,
          Spanien). Bis 21.11.2026 stand das Feld auch als freiwillige Auswahl da —
          für Deutschland eine Liste von 16 Bundesländern, die niemand braucht: Die
          Post stellt nach Postleitzahl zu. Jedes unnötige Feld kostet Abschlüsse. */}
      {regel && !regel.region.versteckt && regel.region.pflicht && (
        <Feld
          label={regel.region.label ?? t('region')}
          optional={regel.region.pflicht ? undefined : t('optional')}
          fehler={fehlt.has('region')}
        >
          {(k) =>
            regel.region.auswahl.length > 0 ? (
              <select className={`${k} bg-bg`} autoComplete={`${vorsilbe} address-level1`} {...feld('region')}>
                <option value="">{t('bitte_waehlen')}</option>
                {regel.region.auswahl.map((o) => (
                  <option key={o.code} value={o.code}>
                    {o.name}
                  </option>
                ))}
              </select>
            ) : (
              <input className={k} autoComplete={`${vorsilbe} address-level1`} maxLength={100} {...feld('region')} />
            )
          }
        </Feld>
      )}
      <Feld label={t('telefon')} optional={t('optional')}>
        {(k) => <input className={k} type="tel" autoComplete={`${vorsilbe} tel`} maxLength={40} {...feld('telefon')} />}
      </Feld>
    </div>
  );
}

export default function KasseAnsicht({
  regeln,
  recht,
  warenkorbPfad,
  weiterPfad,
}: {
  regeln: LandRegel[];
  recht: Record<RechtsSeite, string>;
  warenkorbPfad: string;
  weiterPfad: string;
}) {
  const t = useTranslations('shop_kasse');
  const tShop = useTranslations('shop_seiten');
  const locale = useLocale();
  // Setzt das Cookie of_geo, bevor der Warenkorb geladen wird.
  const waehrung = useWaehrung();

  const [korb, setKorb] = useState<Warenkorb | null>(null);
  const [email, setEmail] = useState('');
  const [lieferung, setLieferung] = useState<Adresse>(LEERE_ADRESSE);
  const [gleich, setGleich] = useState(true);
  const [rechnung, setRechnung] = useState<Adresse>(LEERE_ADRESSE);
  const [zustand, setZustand] = useState<Zustand>('frei');
  const [meldung, setMeldung] = useState<string | null>(null);
  const [fehlt, setFehlt] = useState<Set<string>>(new Set());
  const [fehltRechnung, setFehltRechnung] = useState<Set<string>>(new Set());
  const [emailFalsch, setEmailFalsch] = useState(false);

  const korbAnfrage = useCallback(
    async (koerper?: object) => {
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
      return neu;
    },
    [locale],
  );

  // Warenkorb laden; das Versandland des Warenkorbs ist die Vorgabe für die Adresse.
  useEffect(() => {
    if (!waehrung) return;
    korbAnfrage()
      .then((k) => {
        const land = regeln.some((r) => r.code === k.land) ? k.land : (regeln[0]?.code ?? '');
        setLieferung((a) => (a.land ? a : { ...a, land }));
        setRechnung((a) => (a.land ? a : { ...a, land }));
      })
      .catch(() => setMeldung(t('fehler')));
  }, [waehrung, korbAnfrage, regeln, t]);

  // Wechselt das Lieferland, rechnet WooCommerce den Versand neu.
  function setzeLieferung(neu: Adresse) {
    const landGewechselt = neu.land !== lieferung.land;
    setLieferung(neu);
    if (landGewechselt && neu.land) {
      korbAnfrage({ aktion: 'land', land: neu.land }).catch(() => setMeldung(t('fehler')));
    }
  }

  async function bestellen(ereignis: React.FormEvent) {
    ereignis.preventDefault();
    if (!korb || zustand !== 'frei') return;

    const f1 = new Set<string>(fehlendeFelder(lieferung, regeln));
    const f2 = new Set<string>(gleich ? [] : fehlendeFelder(rechnung, regeln));
    const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setFehlt(f1);
    setFehltRechnung(f2);
    setEmailFalsch(!mailOk);
    if (!mailOk) return setMeldung(t('email_ungueltig'));
    if (f1.size || f2.size) return setMeldung(t('pflicht'));

    setZustand('sendet');
    setMeldung(null);
    try {
      const antwort = await fetch('/api/shop/kasse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-onefam-sprache': locale },
        body: JSON.stringify({
          email: email.trim(),
          lieferung,
          rechnung: gleich ? null : rechnung,
          gesehenTotal: korb.total,
          gesehenWaehrung: korb.waehrung,
        }),
      });
      const daten = (await antwort.json().catch(() => null)) as {
        weiter?: string;
        fehler?: string;
        meldung?: string | null;
        felder?: string[];
      } | null;

      if (antwort.ok && daten?.weiter) {
        setZustand('weiter');
        window.location.assign(daten.weiter);
        return;
      }
      if (daten?.fehler === 'summe') {
        // Die Summe ist eine andere als die gezeigte: neu laden, nichts bestellt.
        await korbAnfrage().catch(() => {});
        setMeldung(t('summe_geaendert'));
      } else if (daten?.fehler === 'zahlung') {
        // Bestellung angelegt, kein Zahlungsfenster: der Knopf bleibt gesperrt,
        // sonst entstünde beim zweiten Klick eine zweite Bestellung.
        setMeldung(t('zahlung_fehlt'));
        return setZustand('gesperrt');
      } else if (daten?.fehler === 'pflicht') {
        setFehlt(new Set(daten.felder ?? []));
        setMeldung(t('pflicht'));
      } else if (daten?.fehler === 'email') {
        setEmailFalsch(true);
        setMeldung(t('email_ungueltig'));
      } else {
        setMeldung(daten?.meldung || t('fehler'));
      }
      setZustand('frei');
    } catch {
      setMeldung(t('fehler'));
      setZustand('frei');
    }
  }

  const geld = (rappen: number) => (korb ? preisText(rappen / 100, korb.waehrung, locale) : '');
  const titel = 'font-serif text-2xl font-normal text-primary';

  if (!korb) {
    return <p className="font-body text-secondary">{meldung ?? ' '}</p>;
  }
  if (korb.positionen.length === 0) {
    return (
      <div>
        <p className="font-body text-lg text-secondary">{tShop('leer')}</p>
        <Link href={weiterPfad} className="mt-6 inline-block font-body text-gold underline-offset-4 hover:underline">
          {tShop('weiter')} →
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={bestellen}
      noValidate
      className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16"
    >
      <div className="space-y-12">
        <section>
          <h2 className={titel}>{t('kontakt')}</h2>
          <div className="mt-5 max-w-[31rem]">
            <Feld label={t('email')} fehler={emailFalsch}>
              {(k) => (
                <input
                  className={k}
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  value={email}
                  aria-invalid={emailFalsch || undefined}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}
            </Feld>
          </div>
        </section>

        <section>
          <h2 className={titel}>{t('lieferadresse')}</h2>
          <div className="mt-5">
            <AdressFelder wert={lieferung} setze={setzeLieferung} regeln={regeln} fehlt={fehlt} vorsilbe="shipping" />
          </div>
          <label className="mt-4 flex min-h-[44px] cursor-pointer items-center gap-3 font-body text-sm text-secondary">
            <input
              type="checkbox"
              checked={gleich}
              onChange={(e) => setGleich(e.target.checked)}
              className="h-5 w-5 flex-none accent-[#C9A84C]"
            />
            {t('gleiche_adresse')}
          </label>
        </section>

        {!gleich && (
          <section>
            <h2 className={titel}>{t('rechnungsadresse')}</h2>
            <div className="mt-5">
              <AdressFelder wert={rechnung} setze={setRechnung} regeln={regeln} fehlt={fehltRechnung} vorsilbe="billing" />
            </div>
          </section>
        )}

        <section>
          <h2 className={titel}>{t('zahlung')}</h2>
          <div className="mt-5 rounded-[4px] border border-white/10 p-5">
            <p className="font-body text-primary">{t('zahlung_titel')}</p>
            <p className="mt-2 font-body text-sm leading-[1.7] text-secondary">{t('zahlung_text')}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {ZAHLARTEN_BILDER.map((z) => (
                // Kleine Zeichen des zahls-Plugins, fertig als SVG — nichts umzurechnen.
                // eslint-disable-next-line @next/next/no-img-element
                <img key={z.name} src={z.src} alt={z.name.replace('_', ' ')} height={26} className="h-[26px] w-auto" loading="lazy" />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Bestellübersicht */}
      <aside className="h-fit rounded-[4px] border border-white/10 p-6 lg:sticky lg:top-24">
        <h2 className={titel}>{t('uebersicht')}</h2>
        <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
          {korb.positionen.map((p) => (
            <li key={p.key} className="flex gap-4 py-4">
              <div className="h-20 w-16 flex-none overflow-hidden rounded-[3px] bg-[#F1F1F1]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.bild && <img src={p.bild} alt="" className="h-full w-full object-cover" loading="lazy" />}
              </div>
              <div className="flex-1 font-body">
                <p className="text-primary">{p.name}</p>
                <p className="text-sm text-secondary">
                  {p.farbe} · {p.groesse} · {p.menge}×
                </p>
              </div>
              <p className="font-body text-primary">{geld(p.summe)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 font-body text-secondary" aria-live="polite">
          <div className="flex justify-between">
            <dt>{tShop('zwischensumme')}</dt>
            <dd className="text-primary">{geld(korb.zwischensumme)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>{tShop('versand')}</dt>
            <dd className="text-primary">{korb.versand == null ? '–' : geld(korb.versand)}</dd>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-3 text-lg">
            <dt className="text-primary">{tShop('total')}</dt>
            <dd className="text-primary">{geld(korb.total)}</dd>
          </div>
        </dl>

        {/* Einfuhrabgaben gehören zum Preis, den der Kunde am Ende zahlt, stehen
            aber nicht in der Summe. Der Hinweis steht deshalb direkt unter ihr —
            Wortlaut aus der Rückgaberichtlinie des Shops, Ziff. 6. */}
        {LAENDER_MIT_EINFUHR.includes(lieferung.land) && (
          <p className="mt-4 rounded-[4px] border border-white/15 p-3 font-body text-sm leading-[1.6] text-primary">
            {t('einfuhr')}
          </p>
        )}

        <p className="mt-6 font-body text-sm leading-[1.7] text-secondary">
          {t.rich('agb_satz', {
            agb: (teile) => (
              <a href={recht.agb} target="_blank" rel="noopener" className="text-gold underline-offset-4 hover:underline">
                {teile}
              </a>
            ),
            datenschutz: (teile) => (
              <a href={recht.datenschutz} target="_blank" rel="noopener" className="text-gold underline-offset-4 hover:underline">
                {teile}
              </a>
            ),
          })}
        </p>

        {/* Die Rückgaberegel des Shops, bevor der Kunde sich bindet (Wortlaut aus
            Snippet 69, dritte Klappe der Produktseite). Wer bestellt, soll sie
            gesehen haben — nicht erst in den AGB suchen müssen.
            Für Lieferländer in EU und EWR steht hier das Widerrufsrecht, sobald
            WIDERRUF_EU_AKTIV eingeschaltet ist (lib/shop/kasse.ts) — bis dahin
            für alle derselbe Satz wie im Shop. */}
        <p className="mt-3 font-body text-sm leading-[1.7] text-secondary">
          {hatWiderruf(lieferung.land) ? t('widerruf_eu') : t('kein_widerruf')}{' '}
          <a href={recht.rueckgabe} target="_blank" rel="noopener" className="text-gold underline-offset-4 hover:underline">
            {t('link_rueckgabe')}
          </a>
        </p>

        {/* DER BESTELLKNOPF. Beschriftet NUR mit der Formel des Gesetzes, in jeder
            Sprache — kein Pfeil, kein Zusatz:
              de  "Zahlungspflichtig bestellen"            § 312j Abs. 3 BGB, § 8 Abs. 2 FAGG (AT)
              fr  "Commande avec obligation de paiement"   Art. L221-14 Code de la consommation
              es  "Pedido con obligación de pago"          Art. 98.2 TRLGDCU
              en  "Order with obligation to pay"           reg. 14(4) Consumer Contracts Regulations 2013
            alle nach Art. 8 Abs. 2 der Richtlinie 2011/83/EU. Steht dort etwas
            anderes, ist der Kunde an die Bestellung nicht gebunden (in Deutschland
            kommt gar kein Vertrag zustande, § 312j Abs. 4 BGB). Der EuGH (C-249/21)
            lässt allein die Worte auf dem Knopf gelten, nicht das Umfeld. Die
            WooCommerce-Texte "Commander", "Realizar el pedido", "Place Order"
            nennen die Zahlung nicht — am 21.11.2026 ersetzt. Nicht kürzen. */}
        <Button
          type="submit"
          disabled={zustand !== 'frei'}
          className="mt-5 w-full disabled:cursor-wait disabled:opacity-60"
          style={{ background: BRAND_GRADIENT_CTA }}
        >
          {t('bestellen')}
        </Button>
        <p className="mt-3 min-h-5 font-body text-sm text-secondary" role="status" aria-live="polite">
          {zustand === 'weiter' ? t('weiter') : meldung}
        </p>
        <Link href={warenkorbPfad} className="inline-block py-3 font-body text-sm text-secondary underline-offset-4 hover:text-primary hover:underline">
          ← {t('zurueck')}
        </Link>

        {/* Alle Rechtstexte des Shops in Reichweite, bevor bestellt wird. */}
        <ul className="mt-3 flex flex-wrap gap-x-5 border-t border-white/10 pt-2 font-body text-xs text-faint">
          {(['agb', 'rueckgabe', 'versand', 'datenschutz', 'impressum'] as const).map((s) => (
            <li key={s}>
              <a href={recht[s]} target="_blank" rel="noopener" className="flex min-h-[44px] items-center underline-offset-4 hover:text-gold hover:underline">
                {t(`link_${s}`)}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </form>
  );
}
