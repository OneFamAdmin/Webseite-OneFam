-- OneFam — Länderwunsch auf der Warteliste.
--
-- Die Startseite sagt im Family Code (messages/<sprache>.json, „Wir machen uns
-- nützlich"): „Das läuft schon. Welches Land als Nächstes gemacht wird,
-- entscheidet die Fam mit — gebaut wird, wofür sich genug Leute eintragen."
-- Bis zu dieser Migration gab es dafür keinen Mechanismus: die Warteliste
-- speicherte nur E-Mail und Namen (0008). Aufgefallen am 17.10.2026.
--
-- Gefragt wird bewusst nach einem PRODUKTWUNSCH („Für welches Land soll es als
-- Nächstes Kleidung geben?"), nicht nach der Herkunft. Angaben zur ethnischen
-- Herkunft sind nach nDSG besonders schützenswert; ein Kleidungswunsch ist das
-- nicht. Das Feld ist freiwillig.
--
-- Gespeichert wird der ISO-3166-1-alpha-2-Code (gross, zwei Buchstaben), nicht
-- der Ländername — der hängt von der Sprache ab, in der sich jemand eingetragen
-- hat, und liesse sich sonst nicht zählen. „XK" (Kosovo) ist kein offizieller
-- ISO-Code, passt aber in dasselbe Muster.
--
-- ADDITIV: neue, nullbare Spalte. Bestandszeilen bleiben ohne Wunsch. Die
-- Einfüge-Policy aus 0008 schränkt keine Spalten ein und muss nicht angefasst
-- werden; die Form prüft der CHECK unten.

alter table public.waitlist add column if not exists country_wish text;

alter table public.waitlist drop constraint if exists waitlist_country_wish_form;
alter table public.waitlist
  add constraint waitlist_country_wish_form
  check (country_wish is null or country_wish ~ '^[A-Z]{2}$');
