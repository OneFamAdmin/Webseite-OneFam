-- OneFam — Phase 2: staged geographic destination voting ("Reiseziel-Voting").
-- The community decides the next OneFam trip in stages: continent → country → place.
-- Each stage is a "round" with options; the winning option scopes the next round.
-- The world map visualises the CURRENT round's vote counts (leader glows brightest).
--
-- Voting is a BUYER perk. Until Shopify is wired in, an admin grants buyer status
-- manually (public.buyers, source='manual'); later a Shopify webhook inserts with
-- source='shopify' and nothing else changes. The buyer gate is enforced in RLS,
-- not just in the app, so it can't be bypassed from the client.
--
-- Apply by pasting into the Supabase SQL editor, or via `supabase db push`.

-- ── Buyers ───────────────────────────────────────────────────────────────────
-- One row = this user is a buyer and may vote. Written only by the service role.
create table if not exists public.buyers (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  source     text not null default 'manual',  -- 'manual' now, 'shopify' later
  created_at timestamptz not null default now()
);

alter table public.buyers enable row level security;

-- A user may check whether THEY are a buyer (to show/hide the vote UI). No insert/
-- update/delete policies → only the service-role key (admin) can grant buyer status.
create policy "buyers_select_own" on public.buyers
  for select to authenticated using (auth.uid() = user_id);

-- SECURITY DEFINER helper: is the current user a buyer? Bypasses RLS cleanly so the
-- votes policy below doesn't depend on buyers' own select policy.
create or replace function public.is_buyer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.buyers b where b.user_id = auth.uid());
$$;

-- ── Rounds (the stages) ──────────────────────────────────────────────────────
-- level: which geographic tier this stage decides.
-- status: only one round per year is 'open' at a time (the current stage).
-- parent_round_id / winner: the previous stage's winner that scopes this stage.
create table if not exists public.poll_rounds (
  id              uuid primary key default gen_random_uuid(),
  year            int  not null,
  level           text not null check (level in ('continent', 'country', 'place')),
  title           text not null,                       -- e.g. "Welcher Kontinent?"
  status          text not null default 'open' check (status in ('open', 'closed')),
  parent_round_id uuid references public.poll_rounds (id) on delete set null,
  winner_option_id uuid,                               -- set when the round is closed
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── Options ──────────────────────────────────────────────────────────────────
-- code: stable geo id — a continent key ('south-america'), ISO-3 country code
--       ('BRA'), or a place slug ('rio'). Used to colour/locate it on the map.
-- lat/lng: map anchor (continent/country centroid, or the place itself).
-- vote_count: denormalised tally, maintained by the trigger below (public-readable).
create table if not exists public.poll_options (
  id         uuid primary key default gen_random_uuid(),
  round_id   uuid not null references public.poll_rounds (id) on delete cascade,
  label      text not null,                            -- e.g. "Brasilien"
  code       text not null,
  lat        numeric(8, 4),
  lng        numeric(8, 4),
  vote_count int not null default 0,
  created_at timestamptz not null default now(),
  unique (round_id, code)
);

create index if not exists poll_options_round_idx on public.poll_options (round_id);

-- ── Votes ────────────────────────────────────────────────────────────────────
-- One vote per buyer per round. The map's numbers come from poll_options.vote_count
-- (not from reading these rows), so individual votes stay private.
create table if not exists public.votes (
  id         uuid primary key default gen_random_uuid(),
  round_id   uuid not null references public.poll_rounds (id) on delete cascade,
  option_id  uuid not null references public.poll_options (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (round_id, user_id)                           -- one vote per person per round
);

create index if not exists votes_option_idx on public.votes (option_id);

-- Keep poll_options.vote_count in sync with the votes table.
create or replace function public.bump_vote_count()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    update public.poll_options set vote_count = vote_count + 1 where id = new.option_id;
  elsif tg_op = 'DELETE' then
    update public.poll_options set vote_count = greatest(vote_count - 1, 0) where id = old.option_id;
  end if;
  return null;
end;
$$;

drop trigger if exists votes_count_trg on public.votes;
create trigger votes_count_trg
  after insert or delete on public.votes
  for each row execute function public.bump_vote_count();

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.poll_rounds  enable row level security;
alter table public.poll_options enable row level security;
alter table public.votes        enable row level security;

-- Rounds & options are public (everyone sees the map + counts). No write policies
-- → only the service-role key (admin) can create/close rounds and options.
create policy "rounds_public_read" on public.poll_rounds
  for select to anon, authenticated using (true);
create policy "options_public_read" on public.poll_options
  for select to anon, authenticated using (true);

-- A buyer may cast their OWN vote, ONLY in a round that is currently open.
create policy "votes_insert_buyer" on public.votes
  for insert to authenticated
  with check (
    auth.uid() = user_id
    and public.is_buyer()
    and exists (
      select 1 from public.poll_rounds r
      where r.id = round_id and r.status = 'open'
    )
    -- the chosen option must belong to the same round
    and exists (
      select 1 from public.poll_options o
      where o.id = option_id and o.round_id = votes.round_id
    )
  );

-- A user may read & withdraw only their OWN vote.
create policy "votes_select_own" on public.votes
  for select to authenticated using (auth.uid() = user_id);
create policy "votes_delete_own" on public.votes
  for delete to authenticated using (auth.uid() = user_id);
