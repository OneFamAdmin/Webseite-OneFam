-- OneFam — echte Produktions- und Versandkosten fuer die Pool-Rechnung.
--
-- Bis hierher rechnete der Pool mit COGS = 0: `product_costs` war leer, und weil
-- der Shop bei keinem Produkt eine SKU fuehrt, konnte die Zuordnung ohnehin nie
-- greifen. Ergebnis war eine Gutschrift auf den BRUTTOUMSATZ statt auf den
-- Gewinn (gemessen am 01.09.2026: CHF 75 Bestellung -> CHF 15 statt ~9).
--
-- QUELLE aller Zahlen unten: OneFam_Margenrechner_20260807_1.xlsx, Blatt
-- "Annahmen" und "Versandtarife", Stand 07.08.2026, Einkaufspreise aus
-- client.shirt-king.cloud. Aendert sich dort etwas, gehoert es hier nachgezogen.
--
-- ZUORDNUNGSSCHLUESSEL: `product_costs.sku` traegt die WooCommerce-**product_id**
-- als Text, nicht eine Artikelnummer. Das ist Absicht und kein Missbrauch der
-- Spalte: eine SKU gibt es in diesem Shop nirgends, die product_id ist der
-- einzige stabile Schluessel, den eine Bestellposition mitliefert. Der Webhook
-- legt sie genau dort ab (siehe app/api/woo/webhook/route.ts).

-- ── Wechselkurs in die Konfiguration ─────────────────────────────────────────
-- Der Shop verkauft in CHF UND in EUR. Die Pool-Rechnung fuehrt CHF; ohne einen
-- Kurs an einer einzigen Stelle wuerde jede EUR-Bestellung als Franken verbucht.
alter table public.cost_config add column if not exists fx_eur_chf numeric(10, 4);

comment on column public.cost_config.fx_eur_chf is
  'CHF je 1 EUR. Quelle Margenrechner 07.08.2026 (finanzen.net/cash.ch). Bei groesseren Kursbewegungen nachfuehren.';

update public.cost_config
   set fee_pct       = 2.90,   -- Payrexx, Uebergabeprotokoll
       fee_fixed_chf = 0.30,   -- Payrexx Fixanteil je Zahlung
       fx_eur_chf    = 0.9250
 where year = 2026;

-- ── Versandkosten, die Shirt-King OneFam belastet ────────────────────────────
-- Diese Kosten sind echt: sie werden vom PodOS-Guthaben abgezogen. Sie sind NICHT
-- zu verwechseln mit der Versandpauschale, die der Kunde im Checkout bezahlt —
-- die steckt bereits in der Bestellsumme.
--
-- 'light' = Shirt, 'heavy' = Hoodie und Sweater. Shirt-King staffelt nur nach
-- diesen beiden Gewichtsklassen, nicht nach Produkt.
--
-- Betraege in EUR, weil Shirt-King in EUR abrechnet. Die Umrechnung passiert
-- ueber cost_config.fx_eur_chf, damit es genau einen Kurs im System gibt.
create table if not exists public.shipping_costs (
  country_code text not null,
  item_kind    text not null check (item_kind in ('light', 'heavy')),
  cost_eur     numeric(12, 2) not null,
  primary key (country_code, item_kind)
);

alter table public.shipping_costs enable row level security;
-- Keine Policy: nur der service-role-Schluessel liest und schreibt hier.

insert into public.shipping_costs (country_code, item_kind, cost_eur) values
  ('DE','light',4.21),
  ('DE','heavy',4.60),
  ('AT','light',5.70),
  ('AT','heavy',7.72),
  ('BE','light',5.70),
  ('BE','heavy',7.72),
  ('CZ','light',5.70),
  ('CZ','heavy',7.72),
  ('DK','light',5.70),
  ('DK','heavy',7.72),
  ('FR','light',5.70),
  ('FR','heavy',7.72),
  ('LU','light',5.70),
  ('LU','heavy',7.72),
  ('NL','light',5.70),
  ('NL','heavy',7.72),
  ('PL','light',5.70),
  ('PL','heavy',7.72),
  ('LI','light',5.70),
  ('LI','heavy',7.72),
  ('IT','light',5.70),
  ('IT','heavy',8.90),
  ('ES','light',5.70),
  ('ES','heavy',8.90),
  ('HR','light',5.70),
  ('HR','heavy',12.00),
  ('EE','light',5.70),
  ('EE','heavy',12.00),
  ('LV','light',5.70),
  ('LV','heavy',12.00),
  ('LT','light',5.70),
  ('LT','heavy',12.00),
  ('FI','light',5.70),
  ('FI','heavy',18.50),
  ('NO','light',5.70),
  ('NO','heavy',19.50),
  ('PT','light',5.70),
  ('PT','heavy',16.50),
  ('CH','light',7.50),
  ('CH','heavy',13.50),
  ('GB','light',7.50),
  ('GB','heavy',13.50)
on conflict (country_code, item_kind) do update set cost_eur = excluded.cost_eur;

-- ── Herstellkosten je Produkt ────────────────────────────────────────────────
-- Rohteil + Druck DTG (eine Seite) + Order Handling, danach 19 % deutsche USt.,
-- die Shirt-King in Rechnung stellt, dann zum Kurs 0.925 in CHF:
--
--   Shirt   (Creator 2.0)  6.64 + 5.50 + 0.69 = 12.83 EUR -> x1.19 -> x0.925 = 14.12 CHF
--   Sweater (Changer 2.0) 16.30 + 5.50 + 0.69 = 22.49 EUR -> x1.19 -> x0.925 = 24.76 CHF
--   Hoodie  (Cruiser 2.0) 21.22 + 5.50 + 0.69 = 27.41 EUR -> x1.19 -> x0.925 = 30.17 CHF
--
-- OHNE Versand — der haengt am Zielland und steht oben in shipping_costs.
-- Gewichtsklasse je Produkt, damit die Versandkosten oben zugeordnet werden
-- koennen: Shirt-King staffelt nur nach 'light' (Shirt) und 'heavy' (Hoodie,
-- Sweater), nicht nach Produkt.
alter table public.product_costs add column if not exists item_kind text
  check (item_kind in ('light', 'heavy'));

insert into public.product_costs (sku, cost_chf, item_kind, label, source) values
  ('2566', 30.17, 'heavy', 'Afghanistan Hoodie (hoodie)', 'kalkulation-20260807'),
  ('3786', 14.12, 'light', 'Afghanistan Shirt (shirt)', 'kalkulation-20260807'),
  ('2668', 24.76, 'heavy', 'Afghanistan Sweater (sweater)', 'kalkulation-20260807'),
  ('2681', 30.17, 'heavy', 'Albania Hoodie (hoodie)', 'kalkulation-20260807'),
  ('3168', 14.12, 'light', 'Albania Shirt (shirt)', 'kalkulation-20260807'),
  ('2722', 24.76, 'heavy', 'Albania Sweater (sweater)', 'kalkulation-20260807'),
  ('3968', 30.17, 'heavy', 'Andorra Hoodie (hoodie)', 'kalkulation-20260807'),
  ('3108', 14.12, 'light', 'Andorra Shirt (shirt)', 'kalkulation-20260807'),
  ('3888', 24.76, 'heavy', 'Andorra Sweater (sweater)', 'kalkulation-20260807'),
  ('2087', 30.17, 'heavy', 'Anguilla Hoodie (hoodie)', 'kalkulation-20260807'),
  ('3045', 14.12, 'light', 'Anguilla Shirt (shirt)', 'kalkulation-20260807'),
  ('4056', 24.76, 'heavy', 'Anguilla Sweater (sweater)', 'kalkulation-20260807'),
  ('1990', 30.17, 'heavy', 'Antigua and Barbuda Hoodie (hoodie)', 'kalkulation-20260807'),
  ('3513', 14.12, 'light', 'Antigua and Barbuda Shirt (shirt)', 'kalkulation-20260807'),
  ('2035', 24.76, 'heavy', 'Antigua and Barbuda Sweater (sweater)', 'kalkulation-20260807'),
  ('1787', 30.17, 'heavy', 'Argentina Hoodie (hoodie)', 'kalkulation-20260807'),
  ('2985', 14.12, 'light', 'Argentina Shirt (shirt)', 'kalkulation-20260807'),
  ('1963', 24.76, 'heavy', 'Argentina Sweater (sweater)', 'kalkulation-20260807'),
  ('1705', 30.17, 'heavy', 'Bosnia Hoodie (hoodie)', 'kalkulation-20260807'),
  ('3440', 14.12, 'light', 'Bosnia Shirt (shirt)', 'kalkulation-20260807'),
  ('1760', 24.76, 'heavy', 'Bosnia Sweater (sweater)', 'kalkulation-20260807'),
  ('1476', 30.17, 'heavy', 'Brazil Hoodie (hoodie)', 'kalkulation-20260807'),
  ('3666', 14.12, 'light', 'Brazil Shirt (shirt)', 'kalkulation-20260807'),
  ('1687', 24.76, 'heavy', 'Brazil Sweater (sweater)', 'kalkulation-20260807'),
  ('1406', 30.17, 'heavy', 'Brunei Darussalam Hoodie (hoodie)', 'kalkulation-20260807'),
  ('3404', 14.12, 'light', 'Brunei Darussalam Shirt (shirt)', 'kalkulation-20260807'),
  ('1434', 24.76, 'heavy', 'Brunei Darussalam Sweater (sweater)', 'kalkulation-20260807'),
  ('758', 30.17, 'heavy', 'Logo Black Hoodie (hoodie)', 'kalkulation-20260807'),
  ('928', 14.12, 'light', 'Logo Black Shirt (shirt)', 'kalkulation-20260807'),
  ('849', 24.76, 'heavy', 'Logo Black Sweater (sweater)', 'kalkulation-20260807'),
  ('1295', 30.17, 'heavy', 'Mexico Hoodie (hoodie)', 'kalkulation-20260807'),
  ('2784', 14.12, 'light', 'Mexico Shirt (shirt)', 'kalkulation-20260807'),
  ('1373', 24.76, 'heavy', 'Mexico Sweater (sweater)', 'kalkulation-20260807'),
  ('263', 30.17, 'heavy', 'OneFam Logo Hoodie (hoodie)', 'kalkulation-20260807'),
  ('665', 14.12, 'light', 'OneFam Logo Shirt (shirt)', 'kalkulation-20260807'),
  ('568', 24.76, 'heavy', 'OneFam Logo Sweater (sweater)', 'kalkulation-20260807'),
  ('69', 30.17, 'heavy', 'OneFam White Logo Hoodie (hoodie)', 'kalkulation-20260807'),
  ('466', 14.12, 'light', 'OneFam White Logo Shirt (shirt)', 'kalkulation-20260807'),
  ('365', 24.76, 'heavy', 'OneFam White Logo Sweater (sweater)', 'kalkulation-20260807'),
  ('1075', 30.17, 'heavy', 'Peru Hoodie (hoodie)', 'kalkulation-20260807'),
  ('3380', 14.12, 'light', 'Peru Shirt (shirt)', 'kalkulation-20260807'),
  ('1101', 24.76, 'heavy', 'Peru Sweater (sweater)', 'kalkulation-20260807')
on conflict (sku) do update
  set cost_chf = excluded.cost_chf, item_kind = excluded.item_kind,
      label = excluded.label, source = excluded.source, updated_at = now();
