-- OneFam — Phase 2 (Shopify P1): automatic, traceable buyer recognition via webhooks.
--
-- When someone pays in the Shopify shop, Shopify POSTs a webhook to
-- /api/shopify/webhook. The endpoint verifies the HMAC signature, dedupes the
-- event, then matches the order's e-mail to a OneFam account and grants buyer
-- status — traceably linked to the order. No Shopify Admin-API token is needed.
--
-- This is purely ADDITIVE: it creates new tables and only ADDS columns to the
-- existing `buyers` table (from 0003). It drops nothing and is safe to apply at
-- any time. `buyers` + `is_buyer()` already exist.
--
-- LEGAL GUARDRAIL (do not break): the free draw stays open to EVERYONE — buyer
-- status only unlocks VOTING (a soft benefit), never the draw chance. Wages are a
-- cost, never paid out of the pool. The pool/accounting layer is P2/P3, not here.
--
-- Apply by pasting into the Supabase SQL editor — but the app code that reads/
-- writes these tables ships with this migration, so apply it now.

-- ── buyers: add Shopify traceability ─────────────────────────────────────────
-- shopify_customer_id : the Shopify customer behind the grant.
-- first_order_id      : the order that first earned buyer status (audit trail).
-- `source` already exists ('manual' | 'shopify'); the webhook writes 'shopify'.
alter table public.buyers add column if not exists shopify_customer_id text;
alter table public.buyers add column if not exists first_order_id      text;

-- ── purchases: one row per paid Shopify order (traceable buyer ↔ order) ───────
-- user_id is nullable: a buyer may order BEFORE creating a OneFam account; the
-- row is backfilled when they sign up (see pending_buyers + promotePendingBuyer).
-- The *_chf accounting columns (fee/cogs/margin) are filled by the P2 pool engine;
-- the webhook only records gross + currency for now.
create table if not exists public.purchases (
  id                  uuid primary key default gen_random_uuid(),
  order_id            text not null unique,           -- Shopify order id (idempotency anchor)
  user_id             uuid references auth.users (id) on delete set null,
  email               text,                           -- order e-mail, lower-cased
  shopify_customer_id text,
  gross_chf           numeric(12, 2),                 -- order total in the store currency
  currency            text,
  fee_chf             numeric(12, 2),                 -- P2: payment/Shopify fees
  cogs_chf            numeric(12, 2),                 -- P2: ShirtKing production cost
  margin_chf          numeric(12, 2),                 -- P2: gross − fee − cogs
  status              text not null default 'paid'
                        check (status in ('paid', 'refunded', 'cancelled')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists purchases_user_idx   on public.purchases (user_id);
create index if not exists purchases_email_idx   on public.purchases (email);
create index if not exists purchases_status_idx  on public.purchases (status);

-- ── pending_buyers: bought without a OneFam account yet ──────────────────────
-- Their e-mail is remembered here; on the next login/signup with a matching
-- e-mail they are promoted to `buyers` and the purchase is linked to them.
create table if not exists public.pending_buyers (
  email               text primary key,               -- lower-cased order e-mail
  order_id            text,
  shopify_customer_id text,
  created_at          timestamptz not null default now()
);

-- ── shop_events: webhook idempotency ledger ──────────────────────────────────
-- event_id = "<topic>:<stable-business-id>" (e.g. "orders/paid:1234567890").
-- The endpoint records each event once so retries / duplicate deliveries are
-- no-ops. Processed AFTER the work succeeds, so a failed run is retried.
create table if not exists public.shop_events (
  event_id     text primary key,
  topic        text,
  processed_at timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────────────────────
-- All three tables hold shop/financial data and are written ONLY by the
-- service-role key (the webhook + the login-time promotion). RLS is enabled with
-- NO policies → every client (anon/authenticated) is denied; the service role
-- bypasses RLS. This mirrors how `buyers` is locked down.
alter table public.purchases      enable row level security;
alter table public.pending_buyers enable row level security;
alter table public.shop_events    enable row level security;
