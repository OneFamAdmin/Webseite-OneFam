import type { createAdminClient } from '@/lib/supabase/admin';
import { computeContribution, type CostConfig, type LineItem } from '@/lib/pool/accounting';

type AdminClient = ReturnType<typeof createAdminClient>;

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** Load the year's pool knobs; safe defaults (share 0 = credits nothing) when unset. */
async function loadConfig(admin: AdminClient, year: number): Promise<CostConfig & { fxEurChf: number | null }> {
  const { data } = await admin
    .from('cost_config')
    .select('pool_share_pct, fee_pct, fee_fixed_chf, default_cogs_pct, fx_eur_chf')
    .eq('year', year)
    .maybeSingle();
  return {
    poolSharePct: Number(data?.pool_share_pct ?? 0),
    feePct: Number(data?.fee_pct ?? 0),
    feeFixedChf: Number(data?.fee_fixed_chf ?? 0),
    defaultCogsPct: data?.default_cogs_pct != null ? Number(data.default_cogs_pct) : null,
    fxEurChf: data?.fx_eur_chf != null ? Number(data.fx_eur_chf) : null,
  };
}

type Kosten = { cost: number; kind: 'light' | 'heavy' | null };

/** Produktschlüssel → Stückkosten + Gewichtsklasse aus product_costs.
 *  Der Schlüssel ist die WooCommerce-product_id als Text (der Shop führt keine SKUs). */
async function loadCosts(admin: AdminClient, skus: (string | null | undefined)[]): Promise<Map<string, Kosten>> {
  const list = [...new Set(skus.filter((s): s is string => !!s))];
  if (!list.length) return new Map();
  const { data, error } = await admin
    .from('product_costs')
    .select('sku, cost_chf, item_kind')
    .in('sku', list);
  if (error) throw new Error(error.message);
  return new Map(
    (data ?? []).map((r) => [
      r.sku as string,
      { cost: Number(r.cost_chf), kind: (r.item_kind as 'light' | 'heavy' | null) ?? null },
    ]),
  );
}

/**
 * Was Shirt-King OneFam für den Versand dieser Bestellung belastet, in CHF.
 *
 * Zwei bewusste Vereinfachungen, die im Zweifel zu HOHE Kosten annehmen und den
 * Pool damit eher zu niedrig als zu hoch gutschreiben:
 *
 * 1. Eine Bestellung = ein Paket. Shirt-King staffelt nach Gewichtsklasse, nicht
 *    nach Stückzahl; für gemischte Bestellungen wird der teurere 'heavy'-Tarif
 *    angesetzt, sobald ein Hoodie oder Sweater dabei ist.
 * 2. Ist das Zielland nicht hinterlegt (Bestellung ausserhalb der 21 belieferten
 *    Länder), wird der teuerste bekannte Tarif dieser Klasse verwendet.
 */
async function versandkosten(
  admin: AdminClient,
  countryCode: string | null,
  kinds: (('light' | 'heavy') | null)[],
  fxEurChf: number | null,
): Promise<number> {
  const klasse: 'light' | 'heavy' = kinds.includes('heavy') ? 'heavy' : 'light';
  const land = (countryCode ?? '').trim().toUpperCase();

  const { data, error } = await admin
    .from('shipping_costs')
    .select('country_code, cost_eur')
    .eq('item_kind', klasse);
  if (error) throw new Error(error.message);
  if (!data?.length) return 0;

  const treffer = data.find((r) => r.country_code === land);
  const eur = treffer
    ? Number(treffer.cost_eur)
    : Math.max(...data.map((r) => Number(r.cost_eur))); // unbekanntes Land → teuerster Tarif
  const kurs = fxEurChf ?? 1;
  return round2(eur * kurs);
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
  args: {
    orderId: string;
    year: number;
    gross: number;
    items: LineItem[];
    /** Währung der Bestellung ('CHF' | 'EUR'); fehlt sie, wird CHF angenommen. */
    currency?: string | null;
    /** Zielland (ISO-2) für die Versandkosten. */
    countryCode?: string | null;
  },
) {
  const { orderId, year, items, currency, countryCode } = args;
  const config = await loadConfig(admin, year);
  const costMap = await loadCosts(admin, items.map((i) => i.sku));

  // Umrechnung auf CHF. Die Buchhaltung darunter rechnet ausschliesslich in
  // Franken — eine EUR-Bestellung ungerechnet durchzureichen hiesse, Euro als
  // Franken zu verbuchen (rund 8 % zu viel).
  //
  // Fehlt der Kurs, wird NICHT geraten: dann bleibt die Gutschrift aus und die
  // Bestellung ist trotzdem vollstaendig in `purchases` erfasst, laesst sich
  // also spaeter nachbuchen.
  const waehrung = (currency ?? 'CHF').toUpperCase();
  if (waehrung !== 'CHF' && config.fxEurChf == null) {
    throw new Error(`Kein Wechselkurs fuer ${waehrung} in cost_config hinterlegt (Bestellung ${orderId})`);
  }
  const kurs = waehrung === 'CHF' ? 1 : (config.fxEurChf as number);

  const gross = round2(args.gross * kurs);
  const itemsChf: LineItem[] = items.map((i) => ({ ...i, unitPrice: i.unitPrice * kurs }));

  const versand = await versandkosten(
    admin,
    countryCode ?? null,
    items.map((i) => (i.sku ? costMap.get(i.sku)?.kind ?? null : null)),
    config.fxEurChf,
  );

  const contrib = computeContribution(
    itemsChf,
    gross,
    config,
    (sku) => (sku && costMap.has(sku) ? (costMap.get(sku) as Kosten).cost : null),
    versand,
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
