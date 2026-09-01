// OneFam — P3: die monatliche Abrechnung. Rein, ohne Abhaengigkeiten, testbar.
//
// Die Frage, die dieses Modul beantwortet: was hat ein Monat wirklich verdient,
// nachdem auch Lohn, Hosting und Werbung bezahlt sind — und was hat der Pool in
// demselben Monat bekommen?
//
// DIE REGEL: der Overhead wird hier nur GEGENUEBERGESTELLT, nie abgezogen.
// `pool_ledger` bleibt von dieser Rechnung unberuehrt. Ist `ergebnisChf` negativ,
// behaelt der Pool trotzdem jeden Franken; die Luecke traegt der Inhaber. Der
// Pool ist ein Anteil an der Marge einzelner Verkaeufe, und Betriebskosten sind
// keine Kosten eines Verkaufs — zoege man sie ab, waere die oeffentliche Zusage
// eine andere als die gemachte. Ausfuehrlich begruendet im Kopf von Migration
// 0014.
//
// ALLES IN CHF. Die Umrechnung passiert vorher in lib/pool/service.ts.

/** Eine bezahlte Bestellung, wie sie in `purchases` steht (Betraege in CHF). */
export type AbrechnungsPosten = {
  grossChf: number | null;
  cogsChf: number | null;
  feeChf: number | null;
  marginChf: number | null;
  poolCreditChf: number | null;
};

/** Eine Kostenzeile aus `overhead_costs`. Betrag immer positiv. */
export type OverheadPosten = {
  category: 'lohn' | 'hosting' | 'werbung' | 'software' | 'sonstiges';
  amountChf: number;
};

export type Monatsabrechnung = {
  /** Zahl der beruecksichtigten Bestellungen. */
  bestellungen: number;
  umsatzChf: number;
  /** Herstellung + Versand (was `purchases.cogs_chf` bereits zusammenfasst). */
  kostenChf: number;
  gebuehrenChf: number;
  margeChf: number;
  /** Was der Pool in diesem Monat gutgeschrieben bekam. */
  poolChf: number;
  overheadChf: number;
  /** Nur der Lohnanteil des Overheads — der Posten, um den es bei der Regel geht. */
  lohnChf: number;
  /** Was dem Unternehmen bleibt: Marge − Overhead − Pool. Darf negativ sein. */
  ergebnisChf: number;
  /** Hat die Marge Pool UND Overhead getragen? */
  gedeckt: boolean;
  /**
   * Bestellungen ohne `gross_chf` — also solche, die der Webhook erfasst hat,
   * fuer die die Buchhaltung aber nie durchlief (typisch: der Wechselkurs fehlte).
   * Sie fehlen im Umsatz und muessen nachgebucht werden; deshalb werden sie
   * gezaehlt statt stillschweigend als null Umsatz mitgerechnet.
   */
  unvollstaendig: number;
};

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const zahl = (n: number | null | undefined) => (n != null && Number.isFinite(Number(n)) ? Number(n) : 0);

/**
 * Stellt einen Monat auf: Verkaeufe gegen Fixkosten.
 *
 * `posten` sind die BEZAHLTEN Bestellungen des Monats. Eine spaeter stornierte
 * Bestellung faellt rueckwirkend aus dem Monat heraus, in dem sie steht — der
 * Aufrufer filtert auf `status = 'paid'`, und die Rueckbuchung im Ledger ist
 * davon unabhaengig. Das ist bewusst die einfachere von zwei Wahrheiten: ein
 * Monat zeigt immer den heutigen Stand seiner Bestellungen, nicht den Stand von
 * damals.
 */
export function rechneMonat(posten: AbrechnungsPosten[], overhead: OverheadPosten[]): Monatsabrechnung {
  let umsatz = 0;
  let kosten = 0;
  let gebuehren = 0;
  let marge = 0;
  let pool = 0;
  let unvollstaendig = 0;

  for (const p of posten) {
    if (p.grossChf == null) unvollstaendig++;
    umsatz += zahl(p.grossChf);
    kosten += zahl(p.cogsChf);
    gebuehren += zahl(p.feeChf);
    marge += zahl(p.marginChf);
    pool += zahl(p.poolCreditChf);
  }

  let overheadSumme = 0;
  let lohn = 0;
  for (const o of overhead) {
    // Ein negativer Betrag waere eine Einnahme und gehoert nicht hierher; die
    // Datenbank verbietet ihn (0014), hier wird er zusaetzlich ignoriert, damit
    // ein von Hand geschriebener Aufruf die Rechnung nicht ins Gegenteil dreht.
    const betrag = Math.max(0, zahl(o.amountChf));
    overheadSumme += betrag;
    if (o.category === 'lohn') lohn += betrag;
  }

  const ergebnis = marge - overheadSumme - pool;

  return {
    bestellungen: posten.length,
    umsatzChf: round2(umsatz),
    kostenChf: round2(kosten),
    gebuehrenChf: round2(gebuehren),
    margeChf: round2(marge),
    poolChf: round2(pool),
    overheadChf: round2(overheadSumme),
    lohnChf: round2(lohn),
    ergebnisChf: round2(ergebnis),
    gedeckt: ergebnis >= 0,
    unvollstaendig,
  };
}

/** Erster und letzter Zeitpunkt eines Monats als ISO-Text, fuer die Abfrage. */
export function monatsGrenzen(year: number, month: number): { von: string; bis: string } {
  const von = new Date(Date.UTC(year, month - 1, 1));
  // Tag 0 des Folgemonats ist der letzte Tag dieses Monats; so muss die Laenge
  // des Monats (und der Februar) nirgends von Hand gepflegt werden.
  const bis = new Date(Date.UTC(year, month, 1));
  return { von: von.toISOString(), bis: bis.toISOString() };
}
