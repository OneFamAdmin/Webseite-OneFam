-- OneFam — Phase 2 (Shopify P2): pool / profit accounting.
--
-- Feeds the Travel-Pool automatically from PROFIT, per paid Shopify order:
--   margin = gross − production cost (COGS) − fees
--   pool  += margin × pool_share_pct
-- Everything is booked as a LEDGER (pool_ledger) → pool_state.amount_chf is the
-- running sum → fully auditable ("öffentlich nachprüfbar"-Linie).
--
-- ADDITIVE: creates new tables, adds one column to `purchases` (from 0006) and a
-- default to `pool_state.ref_cost_chf` (from 0001). Drops nothing. Safe to apply
-- anytime. The app code ships with this migration.
--
-- LEGAL GUARDRAIL (do not break): the free draw stays open to EVERYONE — the pool
-- is only a PROFIT bonus that funds trips; buyer status unlocks VOTING, never the
-- draw chance. WAGES + fixed costs are a COST and are reconciled MONTHLY (P3) —
-- they are NEVER paid out of the pool, and the live per-sale credit here only ever
-- ADDS a share of the per-order margin (never a negative pool credit).
--
-- COGS source = PodOS/ShirtKing. `product_costs` is the materialised SKU→cost cache
-- (synced from the PodOS API, or set manually); the live margin calc reads it.

-- ── cost_config: the knobs (one row per year) ────────────────────────────────
-- pool_share_pct : share of per-order MARGIN credited to the pool. Default 0 →
--                  the engine credits NOTHING until the admin sets a real value
--                  (safe: no wrong numbers before it's configured).
-- fee_pct/fixed  : payment+Shopify fee estimate used for the LIVE margin (the
--                  honest monthly truth is reconciled in P3).
-- default_cogs_pct: fallback COGS as % of gross when a line item's SKU has no
--                  entry in product_costs yet (nullable → unknown = treat as 0).
create table if not exists public.cost_config (
  year             int primary key,
  pool_share_pct   numeric(5, 2) not null default 0,
  fee_pct          numeric(5, 2) not null default 0,
  fee_fixed_chf    numeric(12, 2) not null default 0,
  default_cogs_pct numeric(5, 2),
  updated_at       timestamptz not null default now()
);

-- ── product_costs: SKU → production cost (COGS) ──────────────────────────────
-- Materialised from PodOS (source='podos') or set by hand (source='manual').
create table if not exists public.product_costs (
  sku        text primary key,
  cost_chf   numeric(12, 2) not null,
  label      text,
  source     text not null default 'manual',  -- 'manual' | 'podos'
  updated_at timestamptz not null default now()
);

-- ── pool_ledger: every credit/debit to the pool ──────────────────────────────
-- type: 'sale' (+credit per paid order), 'refund' (−reversal), 'overhead'
--       (−monthly costs, P3), 'adjustment' (manual correction).
-- amount_chf: signed (+ adds to the pool, − removes). ref = order_id (or note).
-- pool_state.amount_chf = sum(amount_chf) for the year.
create table if not exists public.pool_ledger (
  id         uuid primary key default gen_random_uuid(),
  year       int  not null,
  type       text not null check (type in ('sale', 'refund', 'overhead', 'adjustment')),
  amount_chf numeric(12, 2) not null,
  ref        text,
  note       text,
  created_at timestamptz not null default now()
);

create index if not exists pool_ledger_year_idx on public.pool_ledger (year);
create index if not exists pool_ledger_ref_idx  on public.pool_ledger (ref);
-- One 'sale' credit per order (idempotency backstop on top of shop_events).
create unique index if not exists pool_ledger_sale_ref_idx
  on public.pool_ledger (ref) where type = 'sale';

-- Keep pool_state.amount_chf = sum(pool_ledger.amount_chf) per year, automatically.
-- The app only ever writes LEDGER rows; this trigger materialises the running total
-- (race-free: it recomputes the full sum inside the ledger write's transaction).
-- SECURITY DEFINER is REQUIRED: pool_state has RLS with no write policy, so a plain
-- trigger write would be silently RLS-filtered to 0 rows (the lesson from the votes
-- trigger). Running as owner bypasses RLS; search_path pinned for safety.
create or replace function public.recompute_pool_state()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  y int := coalesce(new.year, old.year);
  s numeric(12, 2);
begin
  select coalesce(sum(amount_chf), 0) into s from public.pool_ledger where year = y;
  insert into public.pool_state (year, amount_chf, updated_at)
    values (y, s, now())
  on conflict (year) do update set amount_chf = excluded.amount_chf, updated_at = now();
  return null;
end;
$$;

drop trigger if exists pool_ledger_sync_trg on public.pool_ledger;
create trigger pool_ledger_sync_trg
  after insert or update or delete on public.pool_ledger
  for each row execute function public.recompute_pool_state();

-- ── purchases: remember the exact pool credit (for precise refund reversal) ──
alter table public.purchases add column if not exists pool_credit_chf numeric(12, 2);

-- ── pool_state: allow the live credit to create a year row ───────────────────
-- ref_cost_chf was NOT NULL with no default (0001); give it a default so the
-- per-sale credit can upsert a fresh year. The admin still sets the real
-- reference cost in /admin.
alter table public.pool_state alter column ref_cost_chf set default 0;

-- ── Row Level Security ───────────────────────────────────────────────────────
-- Config, costs and the raw ledger are commercially sensitive (per-order margins)
-- → service-role only (admin), like buyers/purchases. The PUBLIC pool figure stays
-- the already-public `pool_state.amount_chf` (0001). RLS on, no policies → clients
-- denied, service role bypasses.
alter table public.cost_config   enable row level security;
alter table public.product_costs enable row level security;
alter table public.pool_ledger   enable row level security;
