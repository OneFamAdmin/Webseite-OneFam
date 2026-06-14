-- OneFam — Phase 1 schema (free-entry sweepstake core)
-- Apply by pasting into the Supabase SQL editor, or via `supabase db push`.
--
-- Identity is handled by Supabase Auth (auth.users). The PUBLIC-facing winner
-- identifiers are the pseudonymous entry uuids — never e-mail addresses — so the
-- archive stays verifiable without exposing personal data.

-- 1. Entries: exactly one free participation per person per year.
--    group_size = travel group covered by this entry (the person + up to 4).
--    It is ONE ticket regardless of size; the size only scopes the prize.
create table if not exists public.entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  year       int  not null,
  group_size int  not null default 1 check (group_size between 1 and 5),
  created_at timestamptz not null default now(),
  unique (user_id, year) -- enforces "one entry per person per year"
);

-- 2. Pool state per year (set by admin; later optionally synced from shop sales).
create table if not exists public.pool_state (
  year         int primary key,
  amount_chf   numeric(12, 2) not null default 0, -- current travel pool
  ref_cost_chf numeric(12, 2) not null,           -- reference cost of one trip
  updated_at   timestamptz not null default now()
);

-- 3. Draws: the public, verifiable record (= the archive).
create table if not exists public.draws (
  id               uuid primary key default gen_random_uuid(),
  year             int not null,
  pool_chf         numeric(12, 2) not null,
  ref_cost_chf     numeric(12, 2) not null,
  winner_count     int not null,
  rollover_chf     numeric(12, 2) not null,
  commitment       text not null,  -- SHA-256 over the sealed "<id>:<groupSize>" list
  drand_round      bigint,         -- public randomness source (the round number)
  randomness       text,           -- that round's randomness (hex)
  sealed_entries   jsonb not null, -- [{id, groupSize}] committed to (for re-verification)
  winners          jsonb not null, -- [{id, groupSize, seats}] in selection order
  seats_funded     int not null,   -- total people sent (sum of winner seats)
  created_at       timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.entries    enable row level security;
alter table public.pool_state enable row level security;
alter table public.draws      enable row level security;

-- Entries: a logged-in user may create & read only their OWN entry.
create policy "entries_insert_own" on public.entries
  for insert to authenticated with check (auth.uid() = user_id);
create policy "entries_select_own" on public.entries
  for select to authenticated using (auth.uid() = user_id);

-- Pool & draws are publicly readable (transparency). There are deliberately NO
-- write policies here, so only the server-side service-role key (used in the
-- admin) can change them — RLS denies anything not explicitly allowed.
create policy "pool_public_read" on public.pool_state
  for select to anon, authenticated using (true);
create policy "draws_public_read" on public.draws
  for select to anon, authenticated using (true);
