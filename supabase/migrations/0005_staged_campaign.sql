-- OneFam — Phase 2 (revised AGAIN): STAGED year-campaign destination vote.
-- The community decides the next OneFam trip in 3 timed stages over a year:
--   continent (months 0–4) → country (4–8) → place (8–12) → draw.
-- Each stage is a "round" with a COUNTDOWN (closes_at). When it ends, the top
-- option wins and SCOPES the next stage (parent_round_id + winner_option_id).
-- Buyers may vote — and CHANGE their vote — until the round's deadline.
--
-- This revives the staged model (the dropped 0003) and ADDS deadlines + vote
-- changing. It is purely ADDITIVE: it creates new tables and does NOT touch the
-- live `destination_votes` model, so it is safe to apply at any time. The old
-- free-drill-down stays working until the app is switched over; a later
-- migration will drop `destination_votes` once nothing reads it.
--
-- `buyers` + `is_buyer()` already exist (kept since 0003) — voting stays buyer-only,
-- enforced in RLS. Voting is a SOFT BENEFIT and never touches the free draw
-- (`entries`/`draws`): the equal draw chance for everyone is untouched here.
--
-- Apply by pasting into the Supabase SQL editor — but ONLY when told the app code
-- is wired to it (until then nothing reads these tables; applying early is harmless).

-- ── Rounds (the 3 timed stages) ──────────────────────────────────────────────
-- level         : which geographic tier this stage decides.
-- status        : 'open' while the countdown runs, 'closed' after it's finalised.
-- opens_at /
--   closes_at   : the countdown window. closes_at is the deadline shown on the site
--                 AND the hard cut-off enforced in the vote policy below.
-- parent_round_id / winner_option_id : the previous stage's winner that scopes this
--                 stage (e.g. country round's parent = the won continent round).
create table if not exists public.poll_rounds (
  id               uuid primary key default gen_random_uuid(),
  year             int  not null,
  level            text not null check (level in ('continent', 'country', 'place')),
  title            text not null,                         -- e.g. "Welcher Kontinent?"
  status           text not null default 'open' check (status in ('open', 'closed')),
  parent_round_id  uuid references public.poll_rounds (id) on delete set null,
  winner_option_id uuid,                                  -- set when the round closes
  opens_at         timestamptz not null default now(),
  closes_at        timestamptz not null,                  -- the countdown end / deadline
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Only one round per (year, level); and at most one 'open' round at a time is a
-- soft invariant the app enforces (a partial unique index keeps it honest).
create unique index if not exists poll_rounds_one_open_idx
  on public.poll_rounds (year) where status = 'open';

-- ── Options ──────────────────────────────────────────────────────────────────
-- code : stable geo id — continent key ('oceania'), numeric ISO ('036'), or a place
--        slug ('marbella'). Used to locate/draw it on the premium map.
-- lat/lng    : map anchor (continent/country centroid, or the place itself).
-- vote_count : denormalised tally maintained by the trigger below (public-readable),
--              so the map's numbers never expose who voted.
create table if not exists public.poll_options (
  id         uuid primary key default gen_random_uuid(),
  round_id   uuid not null references public.poll_rounds (id) on delete cascade,
  label      text not null,                               -- e.g. "Australien"
  code       text not null,
  lat        numeric(8, 4),
  lng        numeric(8, 4),
  vote_count int  not null default 0,
  created_at timestamptz not null default now(),
  unique (round_id, code)
);

create index if not exists poll_options_round_idx on public.poll_options (round_id);

-- ── Votes ────────────────────────────────────────────────────────────────────
-- One vote per buyer per round, CHANGEABLE until the deadline (update option_id).
-- The map's numbers come from poll_options.vote_count, not from reading these rows,
-- so individual votes stay private.
create table if not exists public.votes (
  id         uuid primary key default gen_random_uuid(),
  round_id   uuid not null references public.poll_rounds (id) on delete cascade,
  option_id  uuid not null references public.poll_options (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (round_id, user_id)                              -- one (changeable) vote per person
);

create index if not exists votes_option_idx on public.votes (option_id);

-- Keep poll_options.vote_count in sync — handles a CHANGED vote (UPDATE) too, so the
-- old option loses a vote and the new one gains it.
-- SECURITY DEFINER is REQUIRED: the trigger fires as the voting user (`authenticated`), and
-- poll_options has RLS enabled with NO update policy → a SECURITY INVOKER trigger's UPDATE would
-- be silently filtered to 0 rows (the vote inserts but the count never moves). Running as the
-- owner bypasses RLS so the denormalised tally actually updates. search_path pinned for safety.
create or replace function public.bump_vote_count()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.poll_options set vote_count = vote_count + 1 where id = new.option_id;
  elsif tg_op = 'DELETE' then
    update public.poll_options set vote_count = greatest(vote_count - 1, 0) where id = old.option_id;
  elsif tg_op = 'UPDATE' and new.option_id is distinct from old.option_id then
    update public.poll_options set vote_count = greatest(vote_count - 1, 0) where id = old.option_id;
    update public.poll_options set vote_count = vote_count + 1               where id = new.option_id;
  end if;
  return null;
end;
$$;

drop trigger if exists votes_count_trg on public.votes;
create trigger votes_count_trg
  after insert or update or delete on public.votes
  for each row execute function public.bump_vote_count();

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.poll_rounds  enable row level security;
alter table public.poll_options enable row level security;
alter table public.votes        enable row level security;

-- Rounds & options are public (everyone sees the map + counts + countdown). No write
-- policies → only the service-role key (admin / scheduled job) can create/close rounds.
drop policy if exists "rounds_public_read" on public.poll_rounds;
create policy "rounds_public_read" on public.poll_rounds
  for select to anon, authenticated using (true);

drop policy if exists "options_public_read" on public.poll_options;
create policy "options_public_read" on public.poll_options
  for select to anon, authenticated using (true);

-- A buyer may cast their OWN vote, only in a round that is open AND before its
-- deadline, and only for an option that belongs to that round.
drop policy if exists "votes_insert_buyer" on public.votes;
create policy "votes_insert_buyer" on public.votes
  for insert to authenticated
  with check (
    auth.uid() = user_id
    and public.is_buyer()
    and exists (
      select 1 from public.poll_rounds r
      where r.id = round_id and r.status = 'open' and now() < r.closes_at
    )
    and exists (
      select 1 from public.poll_options o
      where o.id = option_id and o.round_id = votes.round_id
    )
  );

-- A buyer may CHANGE their vote (same rules) until the deadline.
drop policy if exists "votes_update_buyer" on public.votes;
create policy "votes_update_buyer" on public.votes
  for update to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and public.is_buyer()
    and exists (
      select 1 from public.poll_rounds r
      where r.id = round_id and r.status = 'open' and now() < r.closes_at
    )
    and exists (
      select 1 from public.poll_options o
      where o.id = option_id and o.round_id = votes.round_id
    )
  );

-- A user may read & withdraw only their OWN vote.
drop policy if exists "votes_select_own" on public.votes;
create policy "votes_select_own" on public.votes
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "votes_delete_own" on public.votes;
create policy "votes_delete_own" on public.votes
  for delete to authenticated using (auth.uid() = user_id);

-- ── Read helper: the current open round + its options (public, single round-trip) ──
-- Returns the open round for a year with its options as json, so the page can render
-- the map + countdown without multiple queries. Aggregates only — no voter identities.
create or replace function public.current_round(p_year int)
returns table (
  round_id   uuid,
  level      text,
  title      text,
  opens_at   timestamptz,
  closes_at  timestamptz,
  options    jsonb
)
language sql stable security definer set search_path = public as $$
  select r.id, r.level, r.title, r.opens_at, r.closes_at,
         coalesce(
           jsonb_agg(
             jsonb_build_object('code', o.code, 'label', o.label,
                                'lat', o.lat, 'lng', o.lng, 'votes', o.vote_count)
             order by o.vote_count desc
           ) filter (where o.id is not null),
           '[]'::jsonb
         )
  from public.poll_rounds r
  left join public.poll_options o on o.round_id = r.id
  where r.year = p_year and r.status = 'open'
  group by r.id
  limit 1;
$$;

grant execute on function public.current_round(int) to anon, authenticated;
