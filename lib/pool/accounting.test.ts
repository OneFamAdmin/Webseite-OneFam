// Prüfungen der Pool-Buchhaltung. Ausführen:
//   node --experimental-strip-types lib/pool/accounting.test.ts
//
// Die Zahlen stammen aus OneFam_Margenrechner_20260807_1.xlsx, damit ein
// Rechenfehler hier gegen die geprüfte Kalkulation auffällt und nicht gegen
// eine zweite, selbst ausgedachte Wahrheit.
import { computeContribution, type CostConfig, type LineItem } from './accounting.ts';

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
// Brutto 82 = Produkt 75 + Versandpauschale 7. Versandkosten Shirt-King
// 4.21 EUR x 0.925 = 3.89 CHF. Gebühr 2.9 % + 0.30.
{
  const r = computeContribution(hoodie, 82, CONFIG, kostenVon, 3.89);
  const gebuehr = 82 * 0.029 + 0.3;
  const marge = 82 - 30.17 - 3.89 - gebuehr;
  pruefe(nahe(r.feeChf, gebuehr), `Gebühr ${r.feeChf} = 2.9 % + 0.30`);
  pruefe(nahe(r.cogsChf, 30.17 + 3.89), `Kosten ${r.cogsChf} = Herstellung + Versand`);
  pruefe(nahe(r.marginChf, marge), `Marge ${r.marginChf} (erwartet ${marge.toFixed(2)})`);
  pruefe(nahe(r.poolCreditChf, marge * 0.2), `Pool ${r.poolCreditChf} = 20 % der Marge`);
  pruefe(r.poolCreditChf < 16.4, `Pool ${r.poolCreditChf} liegt deutlich unter 20 % vom Umsatz (16.40)`);
}

// ── 2. Versandkosten müssen die Marge senken ────────────────────────────────
{
  const ohne = computeContribution(hoodie, 82, CONFIG, kostenVon, 0);
  const mit = computeContribution(hoodie, 82, CONFIG, kostenVon, 3.89);
  pruefe(nahe(ohne.marginChf - mit.marginChf, 3.89), 'Versand senkt die Marge um exakt den Versandbetrag');
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
  const r = computeContribution(hoodie, 20, CONFIG, kostenVon, 3.89);
  pruefe(r.marginChf < 0, `Marge ist negativ (${r.marginChf})`);
  pruefe(r.poolCreditChf === 0, 'Gutschrift bleibt 0, kein Abzug vom Pool');
}

// ── 5. Anteil 0 schreibt nichts gut, rechnet aber weiter ────────────────────
{
  const r = computeContribution(hoodie, 82, CONFIG_NULL(), kostenVon, 3.89);
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
    3.89,
  );
  pruefe(nahe(r.cogsChf, 30.17 * 2 + 14.12 + 3.89), `Kosten ${r.cogsChf} über drei Stück plus einmal Versand`);
}

console.log(`\n${fehler === 0 ? '✓ ALLE PRÜFUNGEN BESTANDEN' : `✗ ${fehler} PRÜFUNG(EN) FEHLGESCHLAGEN`}`);
process.exit(fehler === 0 ? 0 : 1);
