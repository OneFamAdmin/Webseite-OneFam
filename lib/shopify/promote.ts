import { createAdminClient } from '@/lib/supabase/admin';
import { grantShopifyBuyer } from '@/lib/shopify/buyers';

/**
 * Promote a freshly-logged-in user to buyer IF they bought in the shop before
 * having a OneFam account (their e-mail was parked in `pending_buyers`).
 *
 * Call this on every login/signup. It's cheap: one indexed lookup that returns
 * immediately when there's nothing pending. SERVER-ONLY (uses the admin client).
 *
 * On a match it: grants buyer status (traceable to the parked order), backfills
 * the purchase rows' user_id, then clears the pending entry. Best-effort — it
 * never throws into the auth flow, so a hiccup here can't block a login.
 */
export async function promotePendingBuyer(userId: string, email?: string | null): Promise<void> {
  const e = (email ?? '').trim().toLowerCase();
  if (!e) return;

  try {
    const admin = createAdminClient();

    const { data: pending } = await admin
      .from('pending_buyers')
      .select('email, order_id, shopify_customer_id')
      .eq('email', e)
      .maybeSingle();
    if (!pending) return; // nothing parked → done (the common case)

    await grantShopifyBuyer(admin, userId, pending.order_id ?? '', pending.shopify_customer_id ?? null);

    // Link any purchases made before the account existed, so the order ↔ user
    // trace is complete.
    await admin.from('purchases').update({ user_id: userId }).eq('email', e).is('user_id', null);

    await admin.from('pending_buyers').delete().eq('email', e);
  } catch (err) {
    console.error('[shopify] promotePendingBuyer failed', err);
  }
}
