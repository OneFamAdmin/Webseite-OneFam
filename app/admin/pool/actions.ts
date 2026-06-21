'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { fetchProductCosts, podosConfigured } from '@/lib/podos/client';

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) throw new Error('Nicht autorisiert.');
  return user;
}

const currentYear = () => new Date().getFullYear();

function revalidate() {
  revalidatePath('/admin/pool');
  revalidatePath('/admin');
  revalidatePath('/'); // homepage Travel-Pool figure
}

/** Parse a "12,50" / "12.50" number; empty → null. */
function parseNum(raw: FormDataEntryValue | null): number | null {
  const s = String(raw ?? '').trim().replace(',', '.');
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) throw new Error('Bitte eine gültige Zahl eingeben.');
  return n;
}

/** Save the year's pool knobs (share %, fee estimate, COGS fallback). */
export async function saveCostConfig(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();
  const year = currentYear();

  const poolShare = parseNum(formData.get('poolSharePct')) ?? 0;
  const feePct = parseNum(formData.get('feePct')) ?? 0;
  const feeFixed = parseNum(formData.get('feeFixedChf')) ?? 0;
  const defaultCogs = parseNum(formData.get('defaultCogsPct')); // nullable

  if (poolShare < 0 || poolShare > 100) throw new Error('Pool-Anteil muss zwischen 0 und 100 % liegen.');

  const { error } = await admin.from('cost_config').upsert(
    {
      year,
      pool_share_pct: poolShare,
      fee_pct: feePct,
      fee_fixed_chf: feeFixed,
      default_cogs_pct: defaultCogs,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'year' },
  );
  if (error) throw new Error(error.message);
  revalidate();
}

/** Add or update one SKU's production cost by hand. */
export async function saveProductCost(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();
  const sku = String(formData.get('sku') ?? '').trim();
  const cost = parseNum(formData.get('cost'));
  const label = String(formData.get('label') ?? '').trim() || null;
  if (!sku) throw new Error('Bitte eine SKU angeben.');
  if (cost == null || cost < 0) throw new Error('Bitte gültige Kosten angeben.');

  const { error } = await admin.from('product_costs').upsert(
    { sku, cost_chf: cost, label, source: 'manual', updated_at: new Date().toISOString() },
    { onConflict: 'sku' },
  );
  if (error) throw new Error(error.message);
  revalidate();
}

export async function deleteProductCost(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();
  const sku = String(formData.get('sku') ?? '');
  if (!sku) throw new Error('SKU fehlt.');
  const { error } = await admin.from('product_costs').delete().eq('sku', sku);
  if (error) throw new Error(error.message);
  revalidate();
}

/** Pull SKU→cost from the PodOS API and upsert into product_costs (source='podos'). */
export async function syncPodosCosts() {
  await assertAdmin();
  if (!podosConfigured()) {
    throw new Error('PodOS ist nicht konfiguriert — bitte PODOS_PROJECT und PODOS_API_KEY setzen.');
  }
  const admin = createAdminClient();
  const costs = await fetchProductCosts();
  if (costs.length) {
    const { error } = await admin.from('product_costs').upsert(
      costs.map((c) => ({
        sku: c.sku,
        cost_chf: c.cost,
        label: c.label,
        source: 'podos',
        updated_at: new Date().toISOString(),
      })),
      { onConflict: 'sku' },
    );
    if (error) throw new Error(error.message);
  }
  revalidate();
}

/** Manual pool correction (audited as an 'adjustment' ledger row). */
export async function addAdjustment(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();
  const amount = parseNum(formData.get('amount'));
  const note = String(formData.get('note') ?? '').trim() || null;
  if (amount == null || amount === 0) throw new Error('Bitte einen Betrag ≠ 0 angeben (− zum Abziehen).');
  const { error } = await admin
    .from('pool_ledger')
    .insert({ year: currentYear(), type: 'adjustment', amount_chf: amount, note });
  if (error) throw new Error(error.message);
  revalidate();
}
