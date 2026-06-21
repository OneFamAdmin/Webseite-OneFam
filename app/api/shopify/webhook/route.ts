import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { findAuthUserByEmail } from '@/lib/supabase/users';
import { grantShopifyBuyer, recomputeShopifyBuyer } from '@/lib/shopify/buyers';
import { verifyShopifyHmac } from '@/lib/shopify/verify';

// Node runtime: we need `node:crypto` for the HMAC and the service-role client.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AdminClient = ReturnType<typeof createAdminClient>;

// ── Shopify payload shapes (only the fields we read) ─────────────────────────
type ShopifyOrder = {
  id?: number | string;
  email?: string | null;
  currency?: string | null;
  total_price?: string | null;
  customer?: { id?: number | string | null; email?: string | null } | null;
};
type ShopifyRefund = {
  id?: number | string;
  order_id?: number | string;
};

const lower = (s: string | null | undefined) => (s ?? '').trim().toLowerCase();
const str = (v: unknown) => (v === null || v === undefined ? '' : String(v));

/**
 * Shopify webhook receiver — buyer auto-recognition (P1).
 *
 * Security:  HMAC-SHA256 over the raw body vs. X-Shopify-Hmac-Sha256 → 401 on fail.
 * Idempotency:  every event recorded once in `shop_events` → retries are no-ops.
 *
 * Returns 200 on success (and on already-handled / ignored topics) so Shopify
 * stops retrying; 401 on a bad signature; 500 only on a genuine processing error
 * (so Shopify retries later).
 */
export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[shopify] SHOPIFY_WEBHOOK_SECRET is not set — rejecting webhook');
    return new NextResponse('Webhook not configured', { status: 500 });
  }

  // Raw body is required for HMAC — read it as text BEFORE parsing.
  const rawBody = await request.text();
  const hmac = request.headers.get('x-shopify-hmac-sha256');
  if (!verifyShopifyHmac(rawBody, hmac, secret)) {
    return new NextResponse('Invalid HMAC signature', { status: 401 });
  }

  const topic = request.headers.get('x-shopify-topic') ?? '';

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new NextResponse('Invalid JSON', { status: 400 });
  }

  // Stable per-topic idempotency key (business id, not the delivery id, so a
  // retry of the SAME event with a new delivery id still dedupes).
  const eventId = dedupeKey(topic, payload);
  if (!eventId) {
    // A topic we don't handle (or no id) — ack so Shopify doesn't retry.
    return NextResponse.json({ ok: true, ignored: topic });
  }

  const admin = createAdminClient();

  // Already processed? (retry / duplicate delivery) → ack without re-doing work.
  const { data: seen, error: seenErr } = await admin
    .from('shop_events')
    .select('event_id')
    .eq('event_id', eventId)
    .maybeSingle();
  if (seenErr) {
    console.error('[shopify] shop_events lookup failed', seenErr);
    return new NextResponse('DB error', { status: 500 });
  }
  if (seen) return NextResponse.json({ ok: true, duplicate: eventId });

  try {
    switch (topic) {
      case 'orders/paid':
        await handleOrderPaid(admin, payload as ShopifyOrder);
        break;
      case 'refunds/create':
        await handleRefund(admin, payload as ShopifyRefund);
        break;
      case 'orders/cancelled':
        await handleOrderCancelled(admin, payload as ShopifyOrder);
        break;
      default:
        return NextResponse.json({ ok: true, ignored: topic });
    }
  } catch (err) {
    // Don't record the event → Shopify will retry later.
    console.error(`[shopify] processing failed for ${eventId}`, err);
    return new NextResponse('Processing error', { status: 500 });
  }

  // Mark processed only AFTER the work succeeded.
  const { error: recErr } = await admin.from('shop_events').insert({ event_id: eventId, topic });
  // A racing duplicate may insert first (unique PK) — that's fine, work was idempotent.
  if (recErr && recErr.code !== '23505') {
    console.error('[shopify] failed to record shop_event', recErr);
  }

  return NextResponse.json({ ok: true, processed: eventId });
}

/** Build the idempotency key for a topic, or null if we don't handle it. */
function dedupeKey(topic: string, payload: unknown): string | null {
  const p = payload as Record<string, unknown>;
  if (topic === 'orders/paid' || topic === 'orders/cancelled') {
    const id = str(p?.id);
    return id ? `${topic}:${id}` : null;
  }
  if (topic === 'refunds/create') {
    const id = str(p?.id); // the refund id (multiple refunds per order possible)
    return id ? `${topic}:${id}` : null;
  }
  return null;
}

// ── orders/paid → grant buyer (or park as pending) + record the purchase ─────
async function handleOrderPaid(admin: AdminClient, order: ShopifyOrder) {
  const orderId = str(order.id);
  if (!orderId) return;

  const email = lower(order.email ?? order.customer?.email);
  const shopifyCustomerId = order.customer?.id != null ? str(order.customer.id) : null;
  const gross = order.total_price != null ? Number(order.total_price) : null;
  const currency = order.currency ?? null;

  // Match the order's e-mail to a OneFam account.
  const user = email ? await findAuthUserByEmail(admin, email) : null;

  // Record / refresh the purchase (idempotent on order_id) and mark it paid
  // again in case this order was previously cancelled then re-paid.
  const { error: pErr } = await admin.from('purchases').upsert(
    {
      order_id: orderId,
      user_id: user?.id ?? null,
      email: email || null,
      shopify_customer_id: shopifyCustomerId,
      gross_chf: Number.isFinite(gross) ? gross : null,
      currency,
      status: 'paid',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'order_id' },
  );
  if (pErr) throw new Error(pErr.message);

  if (user) {
    // Account exists → grant buyer status, traceable to this order.
    await grantShopifyBuyer(admin, user.id, orderId, shopifyCustomerId);
  } else if (email) {
    // No account yet → park the e-mail; promoted on next login/signup.
    const { error: pbErr } = await admin
      .from('pending_buyers')
      .upsert(
        { email, order_id: orderId, shopify_customer_id: shopifyCustomerId },
        { onConflict: 'email', ignoreDuplicates: true }, // keep the FIRST parked order
      );
    if (pbErr) throw new Error(pbErr.message);
  }
}

// ── refunds/create → mark refunded + maybe revoke buyer ──────────────────────
async function handleRefund(admin: AdminClient, refund: ShopifyRefund) {
  const orderId = str(refund.order_id);
  if (!orderId) return;
  await markReversed(admin, orderId, 'refunded');
}

// ── orders/cancelled → mark cancelled + maybe revoke buyer ───────────────────
async function handleOrderCancelled(admin: AdminClient, order: ShopifyOrder) {
  const orderId = str(order.id);
  if (!orderId) return;
  await markReversed(admin, orderId, 'cancelled');
}

/**
 * Shared reversal path for refunds & cancellations: flip the purchase status,
 * then re-evaluate the buyer (revoke a 'shopify' grant if no paid order remains).
 * If the buyer never had an account, drop the parked pending entry too.
 */
async function markReversed(admin: AdminClient, orderId: string, status: 'refunded' | 'cancelled') {
  const { data: purchase, error: selErr } = await admin
    .from('purchases')
    .select('user_id, email')
    .eq('order_id', orderId)
    .maybeSingle();
  if (selErr) throw new Error(selErr.message);

  const { error: updErr } = await admin
    .from('purchases')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('order_id', orderId);
  if (updErr) throw new Error(updErr.message);

  if (purchase?.user_id) {
    await recomputeShopifyBuyer(admin, purchase.user_id);
  } else if (purchase?.email) {
    // Reversed before they ever signed up → don't promote them later.
    const { error: pbErr } = await admin
      .from('pending_buyers')
      .delete()
      .eq('email', purchase.email)
      .eq('order_id', orderId);
    if (pbErr) throw new Error(pbErr.message);
  }
}
