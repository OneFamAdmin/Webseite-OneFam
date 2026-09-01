-- OneFam — Fixkosten in fremder Waehrung sauber festhalten.
--
-- Migration 0014 hat `overhead_costs` mit einer einzigen Spalte `amount_chf`
-- angelegt. Beim ersten echten Befuellen (01.09.2026) fiel auf, dass das genau
-- derselbe Fehler waere, den 0014 in `purchases` behoben hat:
--
--   Die beiden groessten laufenden Posten werden in EURO bezahlt — Claude Max
--   107.10 EUR und Higgsfield 135.15 EUR im Monat. Schriebe man nur den
--   umgerechneten Franken-Betrag weg, waere in drei Monaten nicht mehr
--   nachvollziehbar, ob sich der Preis geaendert hat oder nur der Kurs. Und beim
--   Higgsfield-Abo ist das keine graue Theorie: es haengt am Dollar und schwankt
--   von Monat zu Monat.
--
-- Deshalb dieselbe Trennung wie bei den Bestellungen:
--   amount_original + currency = was tatsaechlich abgebucht wurde
--   amount_chf                 = derselbe Betrag in Franken, umgerechnet
--
-- Umgerechnet wird mit `cost_config.fx_eur_chf` — dem EINEN Kurs im System.
-- `amount_chf` bleibt NOT NULL: die Abrechnung rechnet ausschliesslich in
-- Franken, und ein Kostenposten ohne Franken-Betrag waere unsichtbar. Fehlt der
-- Kurs, weist die Server-Action den Eintrag ab, statt zu raten.
--
-- Bestandszeilen: keine. Die Tabelle ist zum Zeitpunkt dieser Migration leer.

alter table public.overhead_costs add column if not exists amount_original numeric(12, 2);
alter table public.overhead_costs add column if not exists currency text;

-- Entweder beide Spalten oder keine — eine Zahl ohne Waehrung ist wertlos, und
-- eine Waehrung ohne Zahl ist ein halb gespeicherter Eintrag.
alter table public.overhead_costs drop constraint if exists overhead_costs_original_vollstaendig;
alter table public.overhead_costs add constraint overhead_costs_original_vollstaendig
  check ((amount_original is null) = (currency is null));

comment on column public.overhead_costs.amount_original is
  'Betrag in der Waehrung, in der tatsaechlich bezahlt wurde (siehe currency). '
  'Leer, wenn ohnehin in CHF bezahlt wurde.';
comment on column public.overhead_costs.currency is
  'Waehrung von amount_original (ISO-4217, z. B. EUR). Leer = CHF.';
