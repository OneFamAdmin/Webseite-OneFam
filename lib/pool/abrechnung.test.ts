// Prüfungen der Monatsabrechnung. Ausführen:
//   node --experimental-strip-types lib/pool/abrechnung.test.ts
//
// Die wichtigste Prüfung ist Nummer 3: der Pool darf auch dann nichts verlieren,
// wenn der Monat unter dem Strich rot ist. Diese Zusage steht sonst nur in
// Kommentaren — hier scheitert der Test, wenn sie jemand aufhebt.
import { rechneMonat, monatsGrenzen, type AbrechnungsPosten, type OverheadPosten } from './abrechnung.ts';

let fehler = 0;
function pruefe(bedingung: boolean, text: string) {
  console.log(`${bedingung ? '✓' : '✗'} ${text}`);
  if (!bedingung) fehler++;
}
const nahe = (a: number, b: number, toleranz = 0.011) => Math.abs(a - b) <= toleranz;

// Die Referenzbestellung aus accounting.test.ts: Hoodie nach Deutschland,
// Brutto 82.00, Kosten 35.23, Gebühr 2.68, Marge 44.09, Pool 10 % = 4.41.
const hoodieDe: AbrechnungsPosten = {
  grossChf: 82.0,
  cogsChf: 35.23,
  feeChf: 2.68,
  marginChf: 44.09,
  poolCreditChf: 4.41,
};

// ── 1. Ein Monat ohne Fixkosten ist die Summe der Bestellungen ──────────────
{
  const r = rechneMonat([hoodieDe, hoodieDe, hoodieDe], []);
  pruefe(r.bestellungen === 3, 'drei Bestellungen gezählt');
  pruefe(nahe(r.umsatzChf, 246.0), `Umsatz ${r.umsatzChf} = 3 x 82.00`);
  pruefe(nahe(r.margeChf, 132.27), `Marge ${r.margeChf} = 3 x 44.09`);
  pruefe(nahe(r.poolChf, 13.23), `Pool ${r.poolChf} = 3 x 4.41`);
  pruefe(nahe(r.ergebnisChf, 132.27 - 13.23), `Ergebnis ${r.ergebnisChf} = Marge − Pool`);
  pruefe(r.gedeckt, 'ohne Fixkosten ist der Monat gedeckt');
}

// ── 2. Fixkosten senken das Ergebnis, nicht den Pool ────────────────────────
{
  const overhead: OverheadPosten[] = [
    { category: 'lohn', amountChf: 40 },
    { category: 'hosting', amountChf: 12 },
    { category: 'werbung', amountChf: 8 },
  ];
  const ohne = rechneMonat([hoodieDe, hoodieDe, hoodieDe], []);
  const mit = rechneMonat([hoodieDe, hoodieDe, hoodieDe], overhead);

  pruefe(nahe(mit.overheadChf, 60), `Overhead ${mit.overheadChf} = 40 + 12 + 8`);
  pruefe(nahe(mit.lohnChf, 40), `davon Lohn ${mit.lohnChf}`);
  pruefe(mit.poolChf === ohne.poolChf, 'der Pool ist derselbe wie ohne Fixkosten');
  pruefe(nahe(ohne.ergebnisChf - mit.ergebnisChf, 60), 'nur das Ergebnis sinkt, und zwar um genau den Overhead');
  pruefe(mit.gedeckt, `Ergebnis ${mit.ergebnisChf} ist noch positiv`);
}

// ── 3. DIE ZUSAGE: ein roter Monat nimmt dem Pool nichts ────────────────────
// Eine einzige Bestellung, daneben ein voller Monatslohn. Das Unternehmen macht
// Verlust — der Pool behält trotzdem seine 4.41.
{
  const r = rechneMonat([hoodieDe], [{ category: 'lohn', amountChf: 3000 }]);
  pruefe(r.ergebnisChf < 0, `Ergebnis ist negativ (${r.ergebnisChf})`);
  pruefe(!r.gedeckt, 'der Monat ist nicht gedeckt');
  pruefe(nahe(r.poolChf, 4.41), `der Pool behält seine ${r.poolChf} — er wird NICHT belastet`);
  pruefe(r.poolChf > 0, 'die Gutschrift bleibt positiv, egal wie tief das Ergebnis liegt');
}

// ── 4. Ein negativer Kostenbetrag dreht die Rechnung nicht um ───────────────
// Die Datenbank verbietet ihn (0014), ein von Hand geschriebener Aufruf nicht.
{
  const r = rechneMonat([hoodieDe], [{ category: 'sonstiges', amountChf: -500 }]);
  pruefe(r.overheadChf === 0, 'ein negativer Posten zählt als 0, nicht als Einnahme');
}

// ── 5. Eine nicht abgerechnete Bestellung wird gemeldet, nicht verschluckt ──
// gross_chf ist leer, wenn die Buchhaltung nie lief (typisch: Wechselkurs fehlte).
{
  const offen: AbrechnungsPosten = { grossChf: null, cogsChf: null, feeChf: null, marginChf: null, poolCreditChf: null };
  const r = rechneMonat([hoodieDe, offen], []);
  pruefe(r.unvollstaendig === 1, 'eine unvollständige Bestellung wird gezählt');
  pruefe(r.bestellungen === 2, 'sie zählt trotzdem als Bestellung des Monats');
  pruefe(nahe(r.umsatzChf, 82.0), `Umsatz ${r.umsatzChf} enthält nur die abgerechnete Bestellung`);
}

// ── 6. Ein leerer Monat rechnet, statt zu werfen ────────────────────────────
{
  const r = rechneMonat([], []);
  pruefe(r.umsatzChf === 0 && r.margeChf === 0 && r.poolChf === 0, 'alles 0');
  pruefe(r.gedeckt, 'ein leerer Monat gilt als gedeckt (0 ≥ 0)');
}

// ── 7. Monatsgrenzen, inklusive Jahreswechsel und Schaltjahr ────────────────
{
  const jan = monatsGrenzen(2026, 1);
  pruefe(jan.von.startsWith('2026-01-01T00:00:00'), `Januar beginnt ${jan.von}`);
  pruefe(jan.bis.startsWith('2026-02-01T00:00:00'), `Januar endet vor ${jan.bis}`);

  const dez = monatsGrenzen(2026, 12);
  pruefe(dez.bis.startsWith('2027-01-01T00:00:00'), `Dezember endet vor ${dez.bis} — Jahreswechsel stimmt`);

  const feb = monatsGrenzen(2028, 2); // Schaltjahr
  pruefe(feb.bis.startsWith('2028-03-01T00:00:00'), `Februar 2028 endet vor ${feb.bis} — 29 Tage`);
}

console.log(`\n${fehler === 0 ? '✓ ALLE PRÜFUNGEN BESTANDEN' : `✗ ${fehler} PRÜFUNG(EN) FEHLGESCHLAGEN`}`);
process.exit(fehler === 0 ? 0 : 1);
