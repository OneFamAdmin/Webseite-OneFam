import type { createAdminClient } from '@/lib/supabase/admin';

type AdminClient = ReturnType<typeof createAdminClient>;

/**
 * Grant (or refresh) buyer status from a Shopify order — traceable to the order.
 * SERVICE-ROLE ONLY (buyers has no client write policy).
 *
 * - New buyer       → insert source='shopify', first_order_id, shopify_customer_id.
 * - Existing buyer  → only attach the shopify_customer_id and backfill
 *   first_order_id if missing. We deliberately do NOT downgrade a 'manual' grant
 *   nor overwrite the first order — the audit trail keeps the EARLIEST order.
 */
export async function grantShopifyBuyer(
  admin: AdminClient,
  userId: string,
  orderId: string,
  shopifyCustomerId: string | null,
): Promise<void> {
  const { data: existing, error } = await admin
    .from('buyers')
    .select('user_id, first_order_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);

  if (!existing) {
    const { error: insErr } = await admin.from('buyers').insert({
      user_id: userId,
      source: 'shopify',
      first_order_id: orderId,
      shopify_customer_id: shopifyCustomerId,
    });
    // A racing insert can hit the PK — that's fine, the user is already a buyer.
    if (insErr && insErr.code !== '23505') throw new Error(insErr.message);
    return;
  }

  const patch: { shopify_customer_id: string | null; first_order_id?: string } = {
    shopify_customer_id: shopifyCustomerId,
  };
  if (!existing.first_order_id) patch.first_order_id = orderId;
  const { error: updErr } = await admin.from('buyers').update(patch).eq('user_id', userId);
  if (updErr) throw new Error(updErr.message);
}

/**
 * Re-evaluate a user's buyer status after a refund/cancellation. If they have no
 * remaining 'paid' purchase, revoke their buyer row — but ONLY a 'shopify' grant,
 * never a 'manual' one (an admin grant stands until an admin removes it).
 */
export async function recomputeShopifyBuyer(admin: AdminClient, userId: string): Promise<void> {
  const { count, error } = await admin
    .from('purchases')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'paid');
  if (error) throw new Error(error.message);

  if ((count ?? 0) === 0) {
    const { error: delErr } = await admin
      .from('buyers')
      .delete()
      .eq('user_id', userId)
      .eq('source', 'shopify');
    if (delErr) throw new Error(delErr.message);
  }
}
