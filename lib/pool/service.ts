import type { createAdminClient } from '@/lib/supabase/admin';
import { computeContribution, type CostConfig, type LineItem } from '@/lib/pool/accounting';

type AdminClient = ReturnType<typeof createAdminClient>;

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** Load the year's pool knobs; safe defaults (share 0 = credits nothing) when unset. */
async function loadConfig(admin: AdminClient, year: number): Promise<CostConfig> {
  const { data } = await admin
    .from('cost_config')
    .select('pool_share_pct, fee_pct, fee_fixed_chf, default_cogs_pct')
    .eq('year', year)
    .maybeSingle();
  return {
    poolSharePct: Number(data?.pool_share_pct ?? 0),
    feePct: Number(data?.fee_pct ?? 0),
    feeFixedChf: Number(data?.fee_fixed_chf ?? 0),
    defaultCogsPct: data?.default_cogs_pct != null ? Number(data.default_cogs_pct) : null,
  };
}

/** SKU → unit cost map from product_costs (PodOS-synced or manual). */
async function loadCosts(admin: AdminClient, skus: (string | null | undefined)[]): Promise<Map<string, number>> {
  const list = [...new Set(skus.filter((s): s is string => !!s))];
  if (!list.length) return new Map();
  const { data, error } = await admin.from('product_costs').select('sku, cost_chf').in('sku', list);
  if (error) throw new Error(error.message);
  return new Map((data ?? []).map((r) => [r.sku as string, Number(r.cost_chf)]));
}

/**
 * Credit the pool for a paid order: compute the contribution, stamp the accounting
 * onto the purchase row, and write the 'sale' ledger entry (the DB trigger then
 * moves pool_state.amount_chf). Idempotent — the unique partial index on
 * pool_ledger(ref) where type='sale' makes a re-credit a no-op. Returns the
 * contribution (incl. any SKUs missing a cost, so the caller can flag a PodOS sync).
 */
export async function creditPoolForOrder(
  admin: AdminClient,
  args: { orderId: string; year: number; gross: number; items: LineItem[] },
) {
  const { orderId, year, gross, items } = args;
  const config = await loadConfig(admin, year);
  const costMap = await loadCosts(admin, items.map((i) => i.sku));

  const contrib = computeContribution(items, gross, config, (sku) =>
    sku && costMap.has(sku) ? (costMap.get(sku) as number) : null,
  );

  // Stamp the per-order accounting on the purchase (for the admin + refund reversal).
  await admin
    .from('purchases')
    .update({
      cogs_chf: contrib.cogsChf,
      fee_chf: contrib.feeChf,
      margin_chf: contrib.marginChf,
      pool_credit_chf: contrib.poolCreditChf,
      updated_at: new Date().toISOString(),
    })
    .eq('order_id', orderId);

  if (contrib.poolCreditChf > 0) {
    const { error } = await admin.from('pool_ledger').insert({
      year,
      type: 'sale',
      amount_chf: contrib.poolCreditChf,
      ref: orderId,
      note: contrib.missingSkus.length ? `COGS geschätzt – SKUs ohne Kosten: ${contrib.missingSkus.join(', ')}` : null,
    });
    // 23505 = already credited (unique sale ref) → idempotent no-op.
    if (error && error.code !== '23505') throw new Error(error.message);
  }
  return contrib;
}

/**
 * Reverse a previous pool credit when an order is refunded/cancelled: write a
 * negative 'refund' ledger entry (trigger lowers pool_state). Idempotent — skips
 * if there was no credit or it was already reversed. Wages/overhead are untouched
 * (those are the separate monthly P3 reconciliation).
 */
export async function reversePoolForOrder(admin: AdminClient, args: { orderId: string; year: number }) {
  const { orderId, year } = args;

  const { data: sale, error: sErr } = await admin
    .from('pool_ledger')
    .select('amount_chf')
    .eq('ref', orderId)
    .eq('type', 'sale')
    .maybeSingle();
  if (sErr) throw new Error(sErr.message);
  const credited = Number(sale?.amount_chf ?? 0);
  if (!sale || credited === 0) return; // nothing to reverse

  const { data: already, error: rErr } = await admin
    .from('pool_ledger')
    .select('id')
    .eq('ref', orderId)
    .eq('type', 'refund')
    .maybeSingle();
  if (rErr) throw new Error(rErr.message);
  if (already) return; // already reversed

  const { error } = await admin.from('pool_ledger').insert({
    year,
    type: 'refund',
    amount_chf: round2(-credited),
    ref: orderId,
    note: 'Rückbuchung (Retoure/Storno)',
  });
  if (error) throw new Error(error.message);
}
