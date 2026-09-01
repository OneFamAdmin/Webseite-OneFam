-- OneFam — P3: die monatliche Abrechnung (Fixkosten und Lohn).
--
-- Zwei Dinge in einer Migration, weil sie dieselbe Frage beantworten: "Was hat
-- der Monat wirklich verdient?"
--
--
-- 1. overhead_costs — Fixkosten und Lohn, monatlich erfasst
-- ─────────────────────────────────────────────────────────
-- DIE REGEL, die diese Tabelle traegt: Overhead belastet den Pool NICHT.
--
-- Es waere technisch ein Zweizeiler, hier eine negative `pool_ledger`-Zeile vom
-- Typ 'overhead' zu schreiben — der Typ steht seit Migration 0007 sogar in der
-- Pruefbedingung. Genau das passiert bewusst nicht, und zwar dauerhaft:
--
--   Der Pool ist ein Anteil an der MARGE einzelner Verkaeufe. Lohn, Hosting und
--   Werbung sind Kosten des Unternehmens, nicht Kosten eines Verkaufs. Zoege man
--   sie vom Pool ab, schrumpfte das Reisebudget der Community, weil der Inhaber
--   Betriebskosten hat — und die oeffentliche Zusage "ein Anteil am Gewinn geht
--   in den Pool" waere eine andere als die, die gemacht wurde.
--
-- Deshalb liegt der Overhead in einer EIGENEN Tabelle. Die Abrechnung stellt ihn
-- der Marge gegenueber und zeigt, was dem Unternehmen bleibt. Ist dieses Ergebnis
-- negativ, behaelt der Pool trotzdem alles, was er bekommen hat; die Luecke traegt
-- der Inhaber. Das ist keine Nachlaessigkeit, sondern die Zusage.
--
-- Wer diese Regel spaeter aendern will, aendert eine Zusage an die Community und
-- nicht nur eine Tabelle.
--
--
-- 2. purchases.gross_original — der Waehrungsfehler in `gross_chf`
-- ────────────────────────────────────────────────────────────────
-- `purchases.gross_chf` trug bisher die ROHE Bestellsumme in der Waehrung der
-- Bestellung, nicht in Franken. Der Name log also bei jeder EUR-Bestellung.
--
-- Sichtbar wurde es in /admin/pool: dort wurden alle `gross_chf` aufsummiert und
-- als "Umsatz" ausgewiesen — EUR und CHF in einem Topf, rund 8 % zu hoch, und
-- direkt daneben stand die Marge, die korrekt in Franken gerechnet war. Zwei
-- Waehrungen in zwei Kacheln nebeneinander.
--
-- Ab jetzt: `gross_original` + `currency` tragen die Bestellung so, wie der Kunde
-- sie bezahlt hat, und `gross_chf` traegt ausschliesslich Franken. Gefuellt wird
-- `gross_chf` erst von der Buchhaltung (lib/pool/service.ts), nicht schon beim
-- Empfang des Webhooks. Fehlt der Wechselkurs, bleibt die Spalte leer statt
-- falsch — die Bestellung ist dann trotzdem vollstaendig erfasst und laesst sich
-- nachbuchen.
--
-- Kein Backfill noetig: `purchases` ist zum Zeitpunkt dieser Migration leer
-- (alle Testspuren entfernt).

-- ── Fixkosten und Lohn ───────────────────────────────────────────────────────
create table if not exists public.overhead_costs (
  id         uuid primary key default gen_random_uuid(),
  year       int  not null,
  month      int  not null check (month between 1 and 12),
  -- 'lohn' bewusst als eigene Kategorie: es ist der Posten, bei dem die Frage
  -- "kommt das aus dem Pool?" ueberhaupt aufkommt. Die Antwort steht oben.
  category   text not null check (category in ('lohn', 'hosting', 'werbung', 'software', 'sonstiges')),
  label      text not null,
  -- Immer POSITIV. Das Vorzeichen entsteht erst in der Abrechnung, wenn der
  -- Posten von der Marge abgezogen wird. Eine Kostenzeile mit negativem Betrag
  -- waere eine Einnahme und gehoert nicht in diese Tabelle.
  amount_chf numeric(12, 2) not null check (amount_chf > 0),
  note       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists overhead_costs_periode_idx on public.overhead_costs (year, month);

comment on table public.overhead_costs is
  'Fixkosten und Lohn je Monat. Belastet den Pool NIE — siehe Kopf von Migration '
  '0014. Die Gegenueberstellung passiert in lib/pool/abrechnung.ts.';

-- Betriebswirtschaftlich heikel (Loehne, Werbebudget) → nur der service-role-
-- Schluessel liest und schreibt. RLS an, keine Policy: fuer jeden Client leer.
alter table public.overhead_costs enable row level security;

-- ── Waehrung der Bestellung sauber trennen ───────────────────────────────────
alter table public.purchases add column if not exists gross_original numeric(12, 2);

comment on column public.purchases.gross_original is
  'Bestellsumme in der Waehrung der Bestellung (siehe currency), so wie der Kunde '
  'sie bezahlt hat.';
comment on column public.purchases.gross_chf is
  'Bestellsumme in FRANKEN, umgerechnet mit cost_config.fx_eur_chf. Wird von '
  'lib/pool/service.ts gesetzt, nicht vom Webhook. Leer = noch nicht abgerechnet '
  '(z. B. Wechselkurs fehlte), NICHT null Umsatz.';
