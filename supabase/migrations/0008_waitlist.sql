-- OneFam — Warteliste (Trust-first Launch).
--
-- Reines E-Mail-Signup, KEINE Teilnahme, KEIN Einsatz, KEIN Gewinnversprechen:
-- die aktive Pool-/Auslosungs-Mechanik ist bis zur anwaltlichen Prüfung offline
-- (siehe docs/handover-shopify-pool.md §3). Bis dahin sammelt die Seite nur
-- Interessenten — rechtlich ein gewöhnlicher Newsletter.
--
-- ADDITIV: legt eine neue Tabelle an, ändert nichts Bestehendes. Die Tabellen
-- `entries` / `draws` / `pool_state` bleiben unangetastet, damit die Mechanik
-- nach der Prüfung ohne Datenverlust wieder aktiviert werden kann.

create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text        not null,
  name       text,
  source     text        not null default 'site',
  created_at timestamptz not null default now()
);

-- Eine Eintragung pro Adresse, case-insensitive. Die App fängt den Konflikt ab
-- und meldet dem Besucher trotzdem Erfolg (kein E-Mail-Enumeration-Signal).
create unique index if not exists waitlist_email_uniq on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

-- Nur EINFÜGEN ist öffentlich. Bewusst KEINE select-/update-/delete-Policy:
-- die Liste ist damit ausschliesslich über den service-role-Key (Admin/Export)
-- lesbar, nie über den öffentlichen anon-Key.
--
-- Das WITH CHECK akzeptiert nur exakt die Form, die das Formular sendet
-- (plausible E-Mail, begrenzte Längen, source='site'), damit die offene REST-API
-- nicht für Blob-/Müll-Inserts taugt. Gegen reines Volumen hilft nur Rate-Limiting.
create policy "waitlist_public_insert" on public.waitlist
  for insert to anon, authenticated
  with check (
    email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and length(email) between 6 and 254
    and (name is null or length(name) <= 40)
    and source = 'site'
  );
