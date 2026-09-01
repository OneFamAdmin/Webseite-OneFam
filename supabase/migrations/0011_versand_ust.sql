-- OneFam — die 19 % deutsche USt. gelten auch auf den Versand.
--
-- Migration 0010 hat die Herstellkosten korrekt mit 19 % erfasst (sie stecken in
-- product_costs.cost_chf bereits drin), den Versand aber NETTO angesetzt. Das war
-- falsch: Shirt-King stellt eine Rechnung ueber die GESAMTE Leistung, und die
-- Umsatzsteuer laeuft ueber alles.
--
-- BELEG, Rechnung inv-skc-26-30031 vom 07.08.2026 (Bestellung #4145, Lieferung
-- Deutschland), zitiert in OneFam_Margenrechner_20260807_1.xlsx, Blatt
-- "Versandtarife" A2 und Blatt "Annahmen" A10:
--
--   Rohteil 6.64 + Druck 5.50 + Handling 0.69 + Versand 4.21 = 17.04 netto
--   + 19 % MwSt. 3.24                                        = 20.28 EUR belastet
--
-- Der Versand steht also INNERHALB der Bemessungsgrundlage. Genauso rechnet das
-- Blatt "Kalkulation": Spalte P (Herstellkosten netto) enthaelt den Versand,
-- Spalte Q legt 19 % auf diese Summe.
--
-- Wirkung: der Pool bekam je Bestellung rund 0.16 CHF zu viel gutgeschrieben
-- (Hoodie nach DE: Pool 8.98 statt richtig 8.82). Klein, aber es ist echtes Geld,
-- das dem Reisebudget zugeschrieben wurde, obwohl es nie da war.
--
-- Warum der Satz hier in die Konfiguration kommt und nicht in shipping_costs:
-- shipping_costs traegt genau das, was in der Shirt-King-Preisliste steht (netto
-- EUR). Wer den Tarif dort mit der Preisliste vergleicht, soll dieselbe Zahl
-- sehen. Die Steuer ist eine Eigenschaft des Lieferanten, nicht des Tarifs.
alter table public.cost_config add column if not exists supplier_vat_pct numeric(5, 2);

comment on column public.cost_config.supplier_vat_pct is
  'USt.-Satz, den Shirt-King auf seine Rechnung legt (deutsche USt.). Wird auf die '
  'Versandkosten aus shipping_costs aufgeschlagen; in product_costs.cost_chf ist er '
  'bereits eingerechnet. Als Schweizer Einzelfirma ohne USt.-Registrierung ist diese '
  'Vorsteuer NICHT rueckholbar, also echte Kosten. Bestaetigt durch Rechnung '
  'inv-skc-26-30031 vom 07.08.2026.';

update public.cost_config set supplier_vat_pct = 19.00 where year = 2026;

-- OFFEN, bewusst nicht entschieden (Blatt "Annahmen", Zelle C10):
-- Ob Shirt-King bei Lieferungen ausserhalb der EU (CH, GB, NO) 0 % berechnet, weil
-- es eine Ausfuhr ist, ist ungeprueft — es gab bisher keine solche Bestellung. Der
-- Margenrechner setzt vorsichtshalber ueberall 19 % an, und diese Migration folgt
-- ihm. Das nimmt im Zweifel zu HOHE Kosten an und schreibt dem Pool eher zu wenig
-- gut. Bei der ersten CH-Bestellung die Rechnung pruefen und, falls dort 0 % steht,
-- hier eine laenderabhaengige Regel nachziehen.
