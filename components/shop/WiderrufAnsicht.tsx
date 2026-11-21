'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Button from '@/components/Button';
import { WIDERRUF_EMPFANG } from '@/lib/shop/kasse';

// Die Widerrufsfunktion (21.11.2026) — Art. 11a der Richtlinie 2011/83/EU,
// eingefügt durch die Richtlinie (EU) 2023/2673, anzuwenden seit 19.06.2026
// (Deutschland § 356a BGB). Wo ein Widerrufsrecht besteht, muss der Kunde online
// widerrufen können:
//
//   Abs. 2  Er nennt seinen Namen, den Vertrag und den elektronischen Weg für
//           die Bestätigung — deshalb genau diese drei Pflichtfelder. Mehr zu
//           verlangen wäre eine Hürde, die das Gesetz nicht vorsieht.
//   Abs. 3  Der Knopf ist AUSSCHLIESSLICH mit "Widerruf bestätigen" beschriftet
//           (en "confirm withdrawal", fr "confirmer la rétractation",
//           es "confirmar desistimiento" — Wortlaut der Richtlinie je Sprache).
//           Kein Pfeil, kein "wird gesendet …", kein Zusatz. Nicht ändern.
//   Abs. 4  Die Eingangsbestätigung mit Inhalt, Datum und Uhrzeit kommt per
//           Mail vom Shop (Snippet 116). Die Seite zeigt den Eingang zusätzlich.
//
// Die Erklärung geht direkt aus dem Browser an den Shop (wie die Warteliste):
// So sieht der Shop die echte IP und kann bremsen. Der Empfang prüft nicht, ob
// ein Widerrufsrecht besteht — das macht ein Mensch.
//
// Der Knopf trägt Gold, nicht den Markenverlauf: Der Verlauf gehört dem Kaufen.

type Zustand = 'frei' | 'sendet' | 'fertig';

const EINGABE =
  'mt-1.5 w-full rounded-[4px] border bg-transparent px-3.5 py-2.5 font-body text-primary focus:border-gold focus:outline-none';

export default function WiderrufAnsicht({ startPfad }: { startPfad: string }) {
  const t = useTranslations('shop_widerruf');
  const locale = useLocale();
  const [name, setName] = useState('');
  const [bestellung, setBestellung] = useState('');
  const [email, setEmail] = useState('');
  const [teile, setTeile] = useState('');
  // Falle für Formular-Roboter: für Menschen unsichtbar, der Shop verwirft Gefülltes.
  const [falle, setFalle] = useState('');
  const [fehlt, setFehlt] = useState<Set<string>>(new Set());
  const [meldung, setMeldung] = useState<string | null>(null);
  const [zustand, setZustand] = useState<Zustand>('frei');
  const [eingang, setEingang] = useState<{ zeit: string; mail: boolean } | null>(null);

  async function absenden(e: React.FormEvent) {
    e.preventDefault();
    if (zustand !== 'frei') return;

    const leer = new Set<string>();
    if (!name.trim()) leer.add('name');
    if (!bestellung.trim()) leer.add('bestellung');
    if (!email.trim()) leer.add('email');
    setFehlt(leer);
    if (leer.size > 0) {
      setMeldung(t('pflicht'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFehlt(new Set(['email']));
      setMeldung(t('email_ungueltig'));
      return;
    }

    setMeldung(null);
    setZustand('sendet');
    try {
      const antwort = await fetch(WIDERRUF_EMPFANG, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          bestellung: bestellung.trim(),
          email: email.trim(),
          teile: teile.trim(),
          lang: locale,
          website: falle,
        }),
      });
      const daten = (await antwort.json().catch(() => null)) as {
        ok?: boolean;
        anzeige?: string;
        bestaetigung?: boolean;
        message?: string;
      } | null;
      if (antwort.ok && daten?.ok) {
        setEingang({
          zeit: daten.anzeige ?? new Date().toLocaleString(locale),
          mail: daten.bestaetigung !== false,
        });
        setZustand('fertig');
        return;
      }
      if (antwort.status === 429) setMeldung(t('bremse'));
      else if (daten?.message === 'email') {
        setFehlt(new Set(['email']));
        setMeldung(t('email_ungueltig'));
      } else setMeldung(t('fehler'));
    } catch {
      setMeldung(t('fehler'));
    }
    setZustand('frei');
  }

  if (zustand === 'fertig' && eingang) {
    return (
      <div role="status" className="mt-10 rounded-[4px] border border-white/15 p-6">
        <h2 className="font-serif text-2xl font-normal text-primary">{t('eingegangen_titel')}</h2>
        <p className="mt-3 font-body leading-[1.75] tracking-[0.012em] text-secondary">
          {eingang.mail
            ? t('eingegangen_text', { zeit: eingang.zeit, email: email.trim() })
            : t('eingegangen_ohne_mail', { zeit: eingang.zeit })}
        </p>
        <Link href={startPfad} className="mt-6 inline-block font-body text-gold underline-offset-4 hover:underline">
          {t('zurueck')}
        </Link>
      </div>
    );
  }

  const rand = (feld: string) => (fehlt.has(feld) ? 'border-[#E0705F]' : 'border-white/20');

  return (
    <form onSubmit={absenden} noValidate className="mt-10 space-y-5">
      <label className="block font-body text-sm text-secondary">
        {t('name')}
        <input
          className={`${EINGABE} ${rand('name')}`}
          autoComplete="name"
          maxLength={120}
          value={name}
          aria-invalid={fehlt.has('name') || undefined}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="block font-body text-sm text-secondary">
        {t('bestellung')}
        <input
          className={`${EINGABE} ${rand('bestellung')}`}
          inputMode="numeric"
          maxLength={40}
          value={bestellung}
          aria-invalid={fehlt.has('bestellung') || undefined}
          onChange={(e) => setBestellung(e.target.value)}
        />
        <span className="mt-1.5 block text-xs text-faint">{t('bestellung_hilfe')}</span>
      </label>
      <label className="block font-body text-sm text-secondary">
        {t('email')}
        <input
          type="email"
          className={`${EINGABE} ${rand('email')}`}
          autoComplete="email"
          maxLength={254}
          value={email}
          aria-invalid={fehlt.has('email') || undefined}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span className="mt-1.5 block text-xs text-faint">{t('email_hilfe')}</span>
      </label>
      <label className="block font-body text-sm text-secondary">
        {t('teile')} <span className="text-faint">{t('optional')}</span>
        <textarea
          className={`${EINGABE} border-white/20`}
          rows={3}
          maxLength={600}
          value={teile}
          onChange={(e) => setTeile(e.target.value)}
        />
        <span className="mt-1.5 block text-xs text-faint">{t('teile_hilfe')}</span>
      </label>
      {/* Roboter-Falle: ausserhalb des Bildes, nicht per Tastatur erreichbar, für Vorlesehilfen verborgen. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={falle} onChange={(e) => setFalle(e.target.value)} />
        </label>
      </div>

      {meldung && (
        <p role="alert" className="font-body text-sm leading-[1.6] text-[#E0705F]">
          {meldung}
        </p>
      )}

      <Button type="submit" disabled={zustand !== 'frei'} className="w-full disabled:cursor-wait disabled:opacity-60">
        {t('bestaetigen')}
      </Button>
      {/* Der Stand steht UNTER dem Knopf, nie darauf: Der Knopf darf nur die Worte
          des Gesetzes tragen. Der Shop braucht für die Mail zwischen 1 und 17
          Sekunden (gemessen 21.11.2026) — ohne diese Zeile sähe das wie ein
          Hänger aus. */}
      <p aria-live="polite" className="min-h-[1.4em] text-center font-body text-sm text-faint">
        {zustand === 'sendet' ? t('sendet') : ''}
      </p>
    </form>
  );
}
