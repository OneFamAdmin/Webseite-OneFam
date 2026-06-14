-- OneFam — Phase 2 (revised): INDIVIDUAL guided destination vote.
-- Each buyer drills the world map themselves (continent → country → place) and
-- casts ONE full pick. They can change it any time (it's an upsert on user_id).
-- The community result = the aggregate of everyone's picks (tally functions below).
--
-- This replaces the earlier staged-community model (poll_rounds/poll_options/votes),
-- which is dropped. The buyers table + is_buyer() stay (voting is still buyer-only).
--
-- Apply by pasting into the Supabase SQL editor.

-- Drop the old staged-vote tables (test data only).
drop table if exists public.votes cascade;
drop table if exists public.poll_options cascade;
drop table if exists public.poll_rounds cascade;

-- One full destination pick per buyer.
create table if not exists public.destination_votes (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  continent   text not null,                 -- continent key, e.g. 'south-america'
  country_iso text,                           -- numeric ISO-3166-1, e.g. '076'
  place_code  text,                           -- city slug, e.g. 'rio'
  place_label text,
  place_lat   numeric(8, 4),
  place_lng   numeric(8, 4),
  updated_at  timestamptz not null default now()
);

alter table public.destination_votes enable row level security;

-- A buyer may write & read only their OWN pick.
create policy "dv_insert_own" on public.destination_votes
  for insert to authenticated with check (auth.uid() = user_id and public.is_buyer());
create policy "dv_update_own" on public.destination_votes
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id and public.is_buyer());
create policy "dv_select_own" on public.destination_votes
  for select to authenticated using (auth.uid() = user_id);

-- ── Public tallies (SECURITY DEFINER → return only aggregates, no rows/identities) ──
create or replace function public.continent_tallies()
returns table (continent text, votes bigint)
language sql stable security definer set search_path = public as $$
  select continent, count(*)::bigint from public.destination_votes group by continent;
$$;

create or replace function public.country_tallies(p_continent text)
returns table (country_iso text, votes bigint)
language sql stable security definer set search_path = public as $$
  select country_iso, count(*)::bigint
  from public.destination_votes
  where continent = p_continent and country_iso is not null
  group by country_iso;
$$;

create or replace function public.place_tallies(p_country text)
returns table (place_code text, place_label text, place_lat numeric, place_lng numeric, votes bigint)
language sql stable security definer set search_path = public as $$
  select place_code, max(place_label), max(place_lat), max(place_lng), count(*)::bigint
  from public.destination_votes
  where country_iso = p_country and place_code is not null
  group by place_code;
$$;

grant execute on function public.continent_tallies() to anon, authenticated;
grant execute on function public.country_tallies(text) to anon, authenticated;
grant execute on function public.place_tallies(text) to anon, authenticated;
