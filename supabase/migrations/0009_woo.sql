-- OneFam — Umstellung der Shop-Anbindung von Shopify auf WooCommerce.
--
-- Hintergrund: Der Shopify-Store existiert nicht mehr (bestätigt am 01.09.2026).
-- Verkauft wird ausschliesslich über shop.onefam.ch (WordPress/WooCommerce,
-- angebunden an PodOS/ShirtKing). Die Tabellen aus 0006 bleiben unverändert
-- bestehen und werden weiterverwendet — nur die drei Spalten, die Shopify im
-- Namen tragen, werden neutral benannt.
--
-- GEFAHRLOS: Diese Tabellen wurden nie befüllt. Es hat nie ein Shopify-Webhook
-- die Seite erreicht, weshalb `purchases`, `pending_buyers` und `shop_events`
-- leer sind und der Pool nie eine Gutschrift gesehen hat. Eine Umbenennung
-- verliert hier also keine Daten. Trotzdem ist jede Anweisung unten so
-- geschrieben, dass ein zweiter Durchlauf folgenlos bleibt.
--
-- REIHENFOLGE: Diese Migration MUSS eingespielt sein, bevor der Webhook unter
-- /api/woo/webhook Bestellungen empfängt — der Code schreibt bereits
-- `shop_customer_id`. Beides gehört in denselben Arbeitsgang wie das Anlegen des
-- Webhooks im WooCommerce-Adminbereich.

-- ── shopify_customer_id → shop_customer_id (drei Tabellen) ───────────────────
-- Warum ein DO-Block statt eines schlichten ALTER: `rename column` kennt kein
-- "if exists" für die Quellspalte. Ohne diese Prüfung würde ein zweiter Lauf mit
-- einem Fehler abbrechen — und wer eine Migration zweimal einspielt, tut das
-- meist, weil beim ersten Mal etwas unklar war.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'buyers' and column_name = 'shopify_customer_id'
  ) then
    alter table public.buyers rename column shopify_customer_id to shop_customer_id;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'purchases' and column_name = 'shopify_customer_id'
  ) then
    alter table public.purchases rename column shopify_customer_id to shop_customer_id;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'pending_buyers' and column_name = 'shopify_customer_id'
  ) then
    alter table public.pending_buyers rename column shopify_customer_id to shop_customer_id;
  end if;
end $$;

-- Fällt die Umbenennung aus (etwa weil eine Tabelle von Hand angelegt wurde),
-- sorgt das hier dafür, dass die Spalte in jedem Fall existiert.
alter table public.buyers         add column if not exists shop_customer_id text;
alter table public.purchases      add column if not exists shop_customer_id text;
alter table public.pending_buyers add column if not exists shop_customer_id text;

-- ── Herkunft des Käuferstatus ────────────────────────────────────────────────
-- `buyers.source` hat bewusst KEINE Prüfbedingung (siehe 0003), deshalb ist für
-- den neuen Wert 'woocommerce' nichts zu ändern. Der Kommentar hält nur fest,
-- welche Werte vorkommen dürfen — 'shopify' ist Vergangenheit und wird von
-- keinem Codepfad mehr geschrieben.
comment on column public.buyers.source is
  'Herkunft des Käuferstatus: manual (Admin) | woocommerce (Webhook). shopify: historisch, wird nicht mehr vergeben.';

comment on column public.purchases.order_id is
  'WooCommerce-Bestellnummer. Anker für Idempotenz und für pool_ledger.ref.';
