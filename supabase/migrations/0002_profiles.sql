-- OneFam — profiles: an optional, self-chosen display name shown in the public
-- draw archive when you win. Available to everyone (buyer or not). Leaving it
-- empty keeps the participant fully pseudonymous (only the entry id).

create table if not exists public.profiles (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A user may read & write ONLY their own profile. Display names are NOT publicly
-- readable here — only WINNERS' names are published, snapshotted into the draw
-- by the server (service role) at draw time. Losers stay anonymous.
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
