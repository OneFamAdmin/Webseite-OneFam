-- OneFam — Warteliste mit doppelter Bestätigung (18.10.2026).
--
-- Bis hierher trug /join jede Adresse SOFORT ein. Jeder konnte fremde Adressen
-- eintragen, und die Datenschutzerklärung versprach einen Abmeldelink "in jeder
-- E-Mail", den es nicht gab. Die Länder-Warteliste im Shop (Snippet 18) arbeitet
-- seit Juli mit Bestätigungslink; Labis Vorgabe vom 18.10.2026: überall so.
--
-- Ablauf jetzt: Eintragen → Zeile mit status 'pending' + Bestätigungsmail →
-- Klick auf den Link → status 'confirmed'. Nur 'confirmed' darf später
-- angeschrieben werden. Unbestätigte Zeilen löscht app/actions/join.ts nach 30
-- Tagen (bei jeder neuen Eintragung, ohne geplanten Auftrag).
--
-- ADDITIV: neue Spalten, kein Datenverlust (das Abschalten der Policy folgt in 0018). Die beiden Zeilen,
-- die vor dieser Migration da waren, haben nie bestätigt und bekommen 'alt' —
-- sie dürfen NICHT angeschrieben werden, bis sie sich selbst neu eintragen.

alter table public.waitlist
  add column if not exists status        text,
  add column if not exists lang          text,
  add column if not exists confirm_token text,
  add column if not exists token_sent_at timestamptz,
  add column if not exists confirmed_at  timestamptz,
  add column if not exists unsub_token   text;

update public.waitlist set status = 'alt' where status is null;

alter table public.waitlist alter column status set default 'pending';
alter table public.waitlist alter column status set not null;

alter table public.waitlist drop constraint if exists waitlist_status_form;
alter table public.waitlist
  add constraint waitlist_status_form check (status in ('pending', 'confirmed', 'alt'));

create unique index if not exists waitlist_confirm_token_uniq
  on public.waitlist (confirm_token) where confirm_token is not null;
create unique index if not exists waitlist_unsub_token_uniq
  on public.waitlist (unsub_token) where unsub_token is not null;

-- Die öffentliche Einfüge-Policy fällt erst mit 0018 weg — NACH dem Deploy des
-- neuen Codes. Hier entfernt, liefe das alte Formular bis zum Deploy ins Leere.
