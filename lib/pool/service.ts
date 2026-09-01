import type { createAdminClient } from '@/lib/supabase/admin';
import { computeContribution, versandstufe, type CostConfig, type ItemKind, type LineItem } from '@/lib/pool/accounting';

type AdminClient = ReturnType<typeof createAdminClient>;

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** Load the year's pool knobs; safe defaults (share 0 = credits nothing) when unset. */
async function loadConfig(
  admin: AdminClient,
  year: number,
): Promise<CostConfig & { fxEurChf: number | null; supplierVatPct: number }> {
  const { data } = await admin
    .from('cost_config')
    .select('pool_share_pct, fee_pct, fee_fixed_chf, default_cogs_pct, fx_eur_chf, supplier_vat_pct')
    .eq('year', year)
    .maybeSingle();
  return {
    poolSharePct: Number(data?.pool_share_pct ?? 0),
    feePct: Number(data?.fee_pct ?? 0),
    feeFixedChf: Number(data?.fee_fixed_chf ?? 0),
    defaultCogsPct: data?.default_cogs_pct != null ? Number(data.default_cogs_pct) : null,
    fxEurChf: data?.fx_eur_chf != null ? Number(data.fx_eur_chf) : null,
    // Fehlt der Satz, wird NICHT geraten: 0 heisst netto rechnen wie bisher.
    supplierVatPct: data?.supplier_vat_pct != null ? Number(data.supplier_vat_pct) : 0,
  };
}

type Kosten = { cost: number; kind: ItemKind };

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
      { cost: Number(r.cost_chf), kind: (r.item_kind as ItemKind) ?? null },
    ]),
  );
}

/**
 * Was Shirt-King OneFam für den Versand dieser Bestellung belastet, in CHF.
 *
 * Die Preisliste (client.shirt-king.cloud, Stand 16.03.2026) kennt je Land genau
 * ZWEI Tarife, und sie heissen dort woertlich:
 *
 *     "<Land> 1 T-Shirt"
 *     "<Land> ab 2 T-Shirts / 1 Hoodie / 1 Tasse"
 *
 * Die Grenze laeuft also zwischen genau einem Shirt und allem anderen — nicht
 * zwischen leicht und schwer, wie es bis zum 01.09.2026 hier modelliert war.
 * Zwei Shirts kosten bereits den teuren Tarif; das alte Modell hat dafuer den
 * billigen angesetzt und dem Pool zu viel gutgeschrieben.
 *
 * Auf den Tarif kommt die deutsche USt. (`supplierVatPct`). Shirt-Kings eigener
 * Produktrechner rechnet genauso: Rohteil + Druck + Handling + Versand ergeben
 * die "Zwischensumme netto", darauf die "MwSt. (19 %)". Belegt am Beispiel des
 * Rechners: 2.91 + 5.50 + 0.69 + 4.21 = 13.31 netto, MwSt. 2.53, Gesamt 15.84.
 * Als Schweizer Einzelfirma ohne USt.-Registrierung ist diese Vorsteuer nicht
 * rueckholbar — es sind echte Kosten. Siehe Migration 0011.
 *
 * Ein Land, das die Preisliste nicht einzeln fuehrt, bekommt den internationalen
 * Tarif ('*'). Das ist kein Schaetzwert, sondern eine Zeile derselben Liste.
 */
async function versandkosten(
  admin: AdminClient,
  countryCode: string | null,
  /** Stueckzahl und Gewichtsklasse je Position, in Bestellreihenfolge. */
  positionen: { menge: number; kind: ItemKind }[],
  fxEurChf: number | null,
  supplierVatPct: number,
): Promise<number> {
  const stufe = versandstufe(positionen);
  const land = (countryCode ?? '').trim().toUpperCase();

  const { data, error } = await admin
    .from('shipping_costs')
    .select('country_code, cost_eur')
    .eq('tier', stufe)
    .in('country_code', [land, '*']);
  if (error) throw new Error(error.message);
  if (!data?.length) return 0;

  const treffer = data.find((r) => r.country_code === land) ?? data.find((r) => r.country_code === '*');
  if (!treffer) return 0;

  const kurs = fxEurChf ?? 1;
  const mitUst = Number(treffer.cost_eur) * (1 + Math.max(0, supplierVatPct) / 100);
  return round2(mitUst * kurs);
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
    items.map((i) => ({
      menge: Number.isFinite(i.quantity) ? i.quantity : 0,
      kind: i.sku ? costMap.get(i.sku)?.kind ?? null : null,
    })),
    config.fxEurChf,
    config.supplierVatPct,
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
