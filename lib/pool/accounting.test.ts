// Prüfungen der Pool-Buchhaltung. Ausführen:
//   node --experimental-strip-types lib/pool/accounting.test.ts
//
// Die Zahlen stammen aus OneFam_Margenrechner_20260807_1.xlsx, damit ein
// Rechenfehler hier gegen die geprüfte Kalkulation auffällt und nicht gegen
// eine zweite, selbst ausgedachte Wahrheit.
import { computeContribution, versandstufe, type CostConfig, type LineItem } from './accounting.ts';

let fehler = 0;
function pruefe(bedingung: boolean, text: string) {
  console.log(`${bedingung ? '✓' : '✗'} ${text}`);
  if (!bedingung) fehler++;
}
const nahe = (a: number, b: number, toleranz = 0.011) => Math.abs(a - b) <= toleranz;

// Konfiguration wie in cost_config ab Migration 0010
const CONFIG: CostConfig = {
  poolSharePct: 20,
  feePct: 2.9,
  feeFixedChf: 0.3,
  defaultCogsPct: null,
};

const KOSTEN: Record<string, number> = { '2681': 30.17, '3786': 14.12, '2722': 24.76 };
const kostenVon = (sku: string | null | undefined) => (sku && sku in KOSTEN ? KOSTEN[sku] : null);

const hoodie: LineItem[] = [{ sku: '2681', quantity: 1, unitPrice: 75 }];

// ── 1. Hoodie nach Deutschland: die Referenzrechnung ────────────────────────
// Brutto 82 = Produkt 75 + Versandpauschale 7. Was Shirt-King für einen Hoodie
// nach Deutschland abzieht: 4.60 EUR netto (Klasse 'heavy'; ein Shirt wäre mit
// 4.21 EUR günstiger), plus 19 % deutsche USt. wie auf der ganzen Rechnung, dann
// zum Kurs 0.925: 4.60 x 1.19 x 0.925 = 5.06 CHF. Gebühr 2.9 % + 0.30.
const VERSAND_DE_HEAVY = 5.06;
{
  const r = computeContribution(hoodie, 82, CONFIG, kostenVon, VERSAND_DE_HEAVY);
  const gebuehr = 82 * 0.029 + 0.3;
  const marge = 82 - 30.17 - VERSAND_DE_HEAVY - gebuehr;
  pruefe(nahe(r.feeChf, gebuehr), `Gebühr ${r.feeChf} = 2.9 % + 0.30`);
  pruefe(nahe(r.cogsChf, 30.17 + VERSAND_DE_HEAVY), `Kosten ${r.cogsChf} = Herstellung + Versand`);
  pruefe(nahe(r.marginChf, marge), `Marge ${r.marginChf} (erwartet ${marge.toFixed(2)})`);
  pruefe(nahe(r.poolCreditChf, marge * 0.2), `Pool ${r.poolCreditChf} = 20 % der Marge`);
  pruefe(r.poolCreditChf < 15.86, `Pool ${r.poolCreditChf} liegt deutlich unter dem alten Wert 15.86`);
}

// ── 1b. Gegenprobe gegen den Margenrechner, Blatt "Kalkulation" Zeile 7 ──────
// Dieselbe Bestellung, wie der Kunde sie in Deutschland sieht: EUR 69.99 Hoodie
// + EUR 7.70 Versandpauschale = EUR 77.69. Die Tabelle rechnet in EUR und kommt
// auf eine Marge von 37.0208 EUR; hier wird alles vorher in CHF umgerechnet
// (so macht es lib/pool/service.ts). Beide Wege müssen sich treffen — das ist
// der eigentliche Test gegen die geprüfte Kalkulation.
{
  const kurs = 0.925;
  const bruttoChf = 77.69 * kurs;
  const r = computeContribution(
    [{ sku: '2681', quantity: 1, unitPrice: 69.99 * kurs }],
    bruttoChf,
    CONFIG,
    kostenVon,
    VERSAND_DE_HEAVY,
  );
  const tabelleChf = 37.0207656756757 * kurs; // Blatt "Kalkulation", Zelle S7
  pruefe(nahe(r.marginChf, tabelleChf, 0.02), `Marge ${r.marginChf} CHF trifft die Tabelle (${tabelleChf.toFixed(2)})`);
}

// ── 2. Versandkosten müssen die Marge senken ────────────────────────────────
{
  const ohne = computeContribution(hoodie, 82, CONFIG, kostenVon, 0);
  const mit = computeContribution(hoodie, 82, CONFIG, kostenVon, VERSAND_DE_HEAVY);
  pruefe(nahe(ohne.marginChf - mit.marginChf, VERSAND_DE_HEAVY), 'Versand senkt die Marge um exakt den Versandbetrag');
  pruefe(mit.poolCreditChf < ohne.poolCreditChf, 'und damit auch die Gutschrift');
}

// ── 3. Ein unbekanntes Produkt darf nicht als kostenlos durchgehen ──────────
{
  const r = computeContribution([{ sku: '99999', quantity: 1, unitPrice: 75 }], 75, CONFIG, kostenVon, 0);
  pruefe(r.missingSkus.includes('99999'), 'unbekanntes Produkt wird gemeldet');
  pruefe(r.cogsChf === 0, 'ohne Pauschale bleiben die Kosten 0 — der Aufrufer muss die Meldung auswerten');

  const mitPauschale = computeContribution(
    [{ sku: '99999', quantity: 1, unitPrice: 75 }],
    75,
    { ...CONFIG, defaultCogsPct: 40 },
    kostenVon,
    0,
  );
  pruefe(nahe(mitPauschale.cogsChf, 30), 'mit Pauschale 40 % greift der Rückfall (30.00)');
}

// ── 4. Ein Verlustgeschäft darf den Pool niemals belasten ───────────────────
{
  const r = computeContribution(hoodie, 20, CONFIG, kostenVon, VERSAND_DE_HEAVY);
  pruefe(r.marginChf < 0, `Marge ist negativ (${r.marginChf})`);
  pruefe(r.poolCreditChf === 0, 'Gutschrift bleibt 0, kein Abzug vom Pool');
}

// ── 5. Anteil 0 schreibt nichts gut, rechnet aber weiter ────────────────────
{
  const r = computeContribution(hoodie, 82, CONFIG_NULL(), kostenVon, VERSAND_DE_HEAVY);
  pruefe(r.poolCreditChf === 0, 'Anteil 0 % → keine Gutschrift');
  pruefe(r.marginChf > 0, 'die Marge wird trotzdem ausgewiesen');
}
function CONFIG_NULL(): CostConfig {
  return { ...CONFIG, poolSharePct: 0 };
}

// ── 6. Mehrere Positionen summieren sich ────────────────────────────────────
{
  const r = computeContribution(
    [
      { sku: '2681', quantity: 2, unitPrice: 75 },
      { sku: '3786', quantity: 1, unitPrice: 40 },
    ],
    190,
    CONFIG,
    kostenVon,
    VERSAND_DE_HEAVY,
  );
  pruefe(nahe(r.cogsChf, 30.17 * 2 + 14.12 + VERSAND_DE_HEAVY), `Kosten ${r.cogsChf} über drei Stück plus einmal Versand`);
}

// ── 7. Die Versandstufe folgt der Shirt-King-Preisliste ─────────────────────
// "<Land> 1 T-Shirt" gegen "<Land> ab 2 T-Shirts / 1 Hoodie / 1 Tasse".
// Die Grenze liegt bei genau EINEM Shirt — nicht bei leicht gegen schwer.
{
  const L = (menge: number) => ({ menge, kind: 'light' as const });
  const H = (menge: number) => ({ menge, kind: 'heavy' as const });

  pruefe(versandstufe([L(1)]) === 'single_shirt', 'ein Shirt → günstige Stufe');
  pruefe(versandstufe([L(2)]) === 'standard', 'ZWEI Shirts → schon die teure Stufe');
  pruefe(versandstufe([L(1), L(1)]) === 'standard', 'zwei Shirts auf zwei Positionen ebenso');
  pruefe(versandstufe([H(1)]) === 'standard', 'ein Hoodie → teure Stufe');
  pruefe(versandstufe([H(2)]) === 'standard', 'zwei Hoodies → dieselbe Stufe, die Liste kennt keine dritte');
  pruefe(versandstufe([L(1), H(1)]) === 'standard', 'Shirt plus Hoodie → teure Stufe');
  pruefe(versandstufe([{ menge: 1, kind: null }]) === 'standard', 'unbekannte Ware → im Zweifel teurer');
  pruefe(versandstufe([]) === 'standard', 'leere Bestellung → teurer, nicht gratis');
}

console.log(`\n${fehler === 0 ? '✓ ALLE PRÜFUNGEN BESTANDEN' : `✗ ${fehler} PRÜFUNG(EN) FEHLGESCHLAGEN`}`);
process.exit(fehler === 0 ? 0 : 1);
