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
  /** payment/Shopify fee estimate, % of gross */
  feePct: number;
  /** fixed fee per order */
  feeFixedChf: number;
  /** fallback COGS as % of gross when a SKU's cost is unknown (null = treat as 0) */
  defaultCogsPct: number | null;
};

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
 * Compute one order's pool contribution. `gross` is the order total in the store
 * currency; line items drive the COGS. When a line item's SKU has no cost, the
 * config's defaultCogsPct (× that line's gross) is used, or 0 if unset.
 */
export function computeContribution(
  items: LineItem[],
  gross: number,
  config: CostConfig,
  costOf: UnitCostLookup,
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

  const fees = gross * (config.feePct / 100) + config.feeFixedChf;
  const margin = gross - cogs - fees;
  const poolCredit = Math.max(0, margin) * (config.poolSharePct / 100);

  return {
    cogsChf: round2(cogs),
    feeChf: round2(fees),
    marginChf: round2(margin),
    poolCreditChf: round2(poolCredit),
    missingSkus: [...missing],
  };
}
