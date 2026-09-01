// OneFam — P2 pool accounting (pure, dependency-free, fully testable).
//
// Per paid order: margin = gross − COGS − fees; pool credit = max(0, margin) × share.
// The pool credit is NEVER negative (a money-losing order doesn't DEBIT the pool —
// real fixed-cost/wage reconciliation is the separate monthly P3 step). Wages are a
// cost and never come out of the pool.

export type LineItem = {
  sku?: string | null;
  quantity: number;
  /** unit gross price (store currency) */
  unitPrice: number;
};

export type CostConfig = {
  /** % of margin credited to the pool */
  poolSharePct: number;
  /** payment/shop fee estimate, % of gross */
  feePct: number;
  /** fixed fee per order */
  feeFixedChf: number;
  /** fallback COGS as % of gross when a SKU's cost is unknown (null = treat as 0) */
  defaultCogsPct: number | null;
};

/** Gewichtsklasse einer Position, wie sie product_costs.item_kind fuehrt. */
export type ItemKind = 'light' | 'heavy' | null;

/** Versandstufe von Shirt-King: die Preisliste kennt je Land genau zwei. */
export type ShippingTier = 'single_shirt' | 'standard';

/**
 * Welche Versandstufe gilt fuer diese Bestellung?
 *
 * Shirt-King nennt die beiden Tarife woertlich "<Land> 1 T-Shirt" und
 * "<Land> ab 2 T-Shirts / 1 Hoodie / 1 Tasse" (client.shirt-king.cloud,
 * Preisliste 16.03.2026). Die Grenze liegt also bei GENAU EINEM SHIRT — zwei
 * Shirts kosten bereits den teuren Tarif, nicht erst ein Hoodie.
 *
 * Eine Position ohne bekannte Gewichtsklasse zaehlt als 'standard': im Zweifel
 * der teurere Tarif, damit dem Pool eher zu wenig als zu viel gutgeschrieben wird.
 */
export function versandstufe(positionen: { menge: number; kind: ItemKind }[]): ShippingTier {
  const stueck = positionen.reduce((n, p) => n + (Number.isFinite(p.menge) ? Math.max(0, p.menge) : 0), 0);
  return stueck === 1 && positionen.every((p) => p.kind === 'light') ? 'single_shirt' : 'standard';
}

/** Unit production cost for a SKU; return null when unknown (→ default applies). */
export type UnitCostLookup = (sku: string | null | undefined) => number | null;

export type Contribution = {
  cogsChf: number;
  feeChf: number;
  marginChf: number;
  poolCreditChf: number;
  /** SKUs in the order that had no cost entry (so the caller can flag/sync them) */
  missingSkus: string[];
};

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Compute one order's pool contribution.
 *
 * ALLES IN CHF. Der Aufrufer rechnet eine EUR-Bestellung vorher um (siehe
 * lib/pool/service.ts) — dieses Modul kennt bewusst nur eine Währung, sonst
 * müsste jede Formel hier den Kurs mitschleppen.
 *
 * `gross` ist die Bestellsumme INKLUSIVE der Versandpauschale, die der Kunde
 * bezahlt hat. Deshalb muss `shippingCostChf` gegengerechnet werden: das ist,
 * was Shirt-King OneFam für denselben Versand vom PodOS-Guthaben abzieht.
 * Ohne diesen Posten wäre der Versand reiner Gewinn, und der Pool bekäme
 * mehrere Franken je Bestellung zu viel.
 */
export function computeContribution(
  items: LineItem[],
  gross: number,
  config: CostConfig,
  costOf: UnitCostLookup,
  shippingCostChf = 0,
): Contribution {
  const missing = new Set<string>();
  let cogs = 0;

  for (const it of items) {
    const qty = Number.isFinite(it.quantity) ? it.quantity : 0;
    const unit = costOf(it.sku);
    if (unit == null) {
      // Unknown SKU → fall back to a % of this line's gross (or 0).
      if (it.sku) missing.add(it.sku);
      const lineGross = qty * (Number.isFinite(it.unitPrice) ? it.unitPrice : 0);
      cogs += config.defaultCogsPct != null ? lineGross * (config.defaultCogsPct / 100) : 0;
    } else {
      cogs += qty * unit;
    }
  }

  const versand = Number.isFinite(shippingCostChf) ? Math.max(0, shippingCostChf) : 0;
  const fees = gross * (config.feePct / 100) + config.feeFixedChf;
  const margin = gross - cogs - versand - fees;
  const poolCredit = Math.max(0, margin) * (config.poolSharePct / 100);

  return {
    cogsChf: round2(cogs + versand),
    feeChf: round2(fees),
    marginChf: round2(margin),
    poolCreditChf: round2(poolCredit),
    missingSkus: [...missing],
  };
}
