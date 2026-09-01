-- OneFam — die echte Versandstaffel von Shirt-King, direkt aus dem Portal.
--
-- QUELLE: client.shirt-king.cloud, Abschnitt VERSAND, ausgelesen am 01.09.2026.
-- Die Preisliste dort ist auf "Stand: 16.03.2026" datiert und fuehrt 45 Tarife.
-- Rohteile, DTG (5.50) und Handling (0.69) aus Migration 0010 wurden am selben
-- Tag gegen dieselbe Seite geprueft und stimmen unveraendert.
--
-- WAS FALSCH WAR: Migration 0010 hat die Stufen als Gewichtsklassen modelliert
-- ('light' = Shirt, 'heavy' = Hoodie/Sweater). So heissen sie bei Shirt-King aber
-- nicht. Die Tarife heissen woertlich:
--
--     "<Land> 1 T-Shirt"
--     "<Land> ab 2 T-Shirts / 1 Hoodie / 1 Tasse"
--
-- Die Grenze laeuft also nicht zwischen leicht und schwer, sondern zwischen
-- GENAU EINEM SHIRT und allem anderen. Zwei Shirts fallen bereits in die teure
-- Stufe. Das alte Modell hat fuer zwei Shirts nach Oesterreich 5.70 statt 7.72
-- angesetzt und dem Pool damit zu viel gutgeschrieben.
--
-- WAS DIE LISTE NICHT HERGIBT: eine dritte Stufe. Zwei Hoodies kosten laut
-- Preisliste dasselbe wie einer. Falls Shirt-King fuer groessere Sendungen mehr
-- verrechnet, steht das nicht in der Liste und liesse sich nur an einer echten
-- Rechnung ablesen — dann hier eine weitere Stufe nachziehen.
--
-- DEUTSCHLAND ist der einzige unsaubere Fall. National gibt es nur zwei Eintraege,
-- "DHL Warenpost 4.21" und "DHL Paket National 1 T-Shirt 4.60"; ein Tarif mit
-- "1 Hoodie" im Namen fehlt. Warenpost ist das Briefformat und traegt keinen
-- Hoodie, also bleibt das Paket. 4.21 ist durch Rechnung inv-skc-26-30031
-- bestaetigt (1 Shirt). Nach oben ist das Risiko begrenzt: einen teureren
-- nationalen Tarif fuehrt die Liste nicht.
--
-- Die Tabelle wird neu aufgebaut statt umgebaut: sie ist reine Referenzdaten aus
-- einer fremden Preisliste, ohne Fremdschluessel, und die Stufen sind andere.
drop table if exists public.shipping_costs;

create table public.shipping_costs (
  -- ISO-2 des Ziellandes, oder '*' fuer den internationalen Rueckfalltarif.
  country_code text not null,
  -- 'single_shirt' = genau ein Shirt; 'standard' = alles andere.
  tier         text not null check (tier in ('single_shirt', 'standard')),
  cost_eur     numeric(12, 2) not null,
  -- Der Name des Tarifs bei Shirt-King, damit sich die Zeile ohne Umweg mit dem
  -- Portal vergleichen laesst.
  label        text,
  primary key (country_code, tier)
);

alter table public.shipping_costs enable row level security;
-- Keine Policy: nur der service-role-Schluessel liest hier.

comment on table public.shipping_costs is
  'Netto-Versandtarife von Shirt-King in EUR, Stand Preisliste 16.03.2026. Die '
  'deutsche USt. kommt NICHT hier drauf, sondern ueber cost_config.supplier_vat_pct '
  '(siehe Migration 0011) — so bleibt die Zahl hier mit dem Portal vergleichbar.';

insert into public.shipping_costs (country_code, tier, cost_eur, label) values
  ('DE','single_shirt', 4.21,'DHL Warenpost'),
  ('DE','standard',     4.60,'DHL Paket National'),
  ('AT','single_shirt', 5.70,'Oesterreich 1 T-Shirt'),
  ('AT','standard',     7.72,'Oesterreich ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('BE','single_shirt', 5.70,'Belgien 1 T-Shirt'),
  ('BE','standard',     7.72,'Belgien ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('CZ','single_shirt', 5.70,'Tschechische Republik 1 T-Shirt'),
  ('CZ','standard',     7.72,'Tschechische Republik ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('DK','single_shirt', 5.70,'Daenemark 1 T-Shirt'),
  ('DK','standard',     7.72,'Daenemark ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('FR','single_shirt', 5.70,'Frankreich 1 T-Shirt'),
  ('FR','standard',     7.72,'Frankreich ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('LI','single_shirt', 5.70,'Liechtenstein 1 T-Shirt'),
  ('LI','standard',     7.72,'Liechtenstein ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('LU','single_shirt', 5.70,'Luxemburg 1 T-Shirt'),
  ('LU','standard',     7.72,'Luxemburg ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('NL','single_shirt', 5.70,'Niederlande 1 T-Shirt'),
  ('NL','standard',     7.72,'Niederlande ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('PL','single_shirt', 5.70,'Polen 1 T-Shirt'),
  ('PL','standard',     7.72,'Polen ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('IT','single_shirt', 5.70,'Italien 1 T-Shirt'),
  ('IT','standard',     8.90,'Italien ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('ES','single_shirt', 5.70,'Spanien 1 T-Shirt'),
  ('ES','standard',     8.90,'Spanien ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('EE','single_shirt', 5.70,'Estland 1 T-Shirt'),
  ('EE','standard',    12.00,'Estland ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('HR','single_shirt', 5.70,'Kroatien 1 T-Shirt'),
  ('HR','standard',    12.00,'Kroatien ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('LV','single_shirt', 5.70,'Lettland 1 T-Shirt'),
  ('LV','standard',    12.00,'Lettland ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('LT','single_shirt', 5.70,'Litauen 1 T-Shirt'),
  ('LT','standard',    12.00,'Litauen ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('PT','single_shirt', 5.70,'Portugal 1 T-Shirt'),
  ('PT','standard',    16.50,'Portugal ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('FI','single_shirt', 5.70,'Finnland 1 T-Shirt'),
  ('FI','standard',    18.50,'Finnland ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('NO','single_shirt', 5.70,'Norwegen 1 T-Shirt'),
  ('NO','standard',    19.50,'Norwegen ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('CH','single_shirt', 7.50,'Schweiz 1 T-Shirt'),
  ('CH','standard',    13.50,'Schweiz ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  ('GB','single_shirt', 7.50,'Vereinigtes Koenigreich und NordIrland 1 T-Shirt'),
  ('GB','standard',    13.50,'Vereinigtes Koenigreich und NordIrland ab 2 T-Shirts / 1 Hoodie / 1 Tasse'),
  -- Rueckfall fuer jedes Land, das die Preisliste nicht einzeln fuehrt. Das ist
  -- kein geschaetzter Wert, sondern der internationale Tarif aus derselben Liste.
  ('*','single_shirt',  5.70,'DHL International 1 T-Shirt'),
  ('*','standard',     12.00,'DHL International ab 2 T-Shirts / 1 Hoodie / 1 Tasse');
