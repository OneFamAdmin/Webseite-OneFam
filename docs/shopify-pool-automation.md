# Konzept: Shopify-Anbindung + automatische Käufer-Erkennung + Pool-Buchhaltung

Status: **P1 GEBAUT** (Webhook-Endpoint + automatische Käufer-Erkennung), **P2/P3 noch Konzept**
(Pool-/Gewinn-Buchhaltung). Ersetzt langfristig das manuelle Käufer-Freischalten und das manuelle
Setzen des Pool-Betrags.

> **P1 fertig (Käufer-Erkennung über Webhooks):** Endpoint `app/api/shopify/webhook/route.ts`
> (HMAC-Prüfung gegen `SHOPIFY_WEBHOOK_SECRET` → 401, Idempotenz über `shop_events`,
> Service-Role-Client). Bei `orders/paid` → E-Mail mit `auth.users` matchen → `buyers` (source
> `shopify`, mit `first_order_id`) + `purchases`-Zeile; kein Match → `pending_buyers` (beim
> nächsten Login/Signup automatisch befördert, siehe `app/auth/callback/route.ts`). Bei
> `refunds/create` + `orders/cancelled` → `purchases` auf `refunded`/`cancelled`, und falls keine
> bezahlte Bestellung mehr übrig ist, wird ein **shopify**-Käuferstatus entzogen (ein **manueller**
> Admin-Grant bleibt). Migration: `supabase/migrations/0006_shopify.sql` (additiv) — der User spielt
> sie im Supabase-SQL-Editor ein. **P2 (Live-Pool-Gutschrift) + P3 (Monats-Abgleich) folgen.**

---

## 1. Ziel

1. **Käufer automatisch & rückverfolgbar erkennen** — wer im Shopify-Shop kauft, wird automatisch
   Käufer (Voting frei), verknüpft mit Bestellung + OneFam-Konto.
2. **Retouren automatisch zurückbuchen** — Erstattung/Storno entzieht den Pool-Anteil wieder und
   ggf. den Käufer-Status.
3. **Pool aus dem GEWINN speisen** — eine Buchhaltungs-Schicht rechnet
   `Umsatz − Produktionskosten − Gebühren − Fixkosten − Lohn = Gewinn`, davon ein fixer Anteil → Pool.

**Rechtliche Leitplanken (verbindlich vom Anwalt zu bestätigen):**
- Die **Auslosung bleibt gratis für alle** (kein Kauf-Zwang) — der Käufer-Status schaltet nur das
  **Voting** frei (Soft-Benefit), nicht die Gewinnchance.
- Der **Lohn ist eine Kosten-Position** (vor dem Gewinn abgezogen), wird **nie aus dem Pool** entnommen.
- Pool = Gewinn-Bonus → stützt GmbH + separates Pool-Konto.

---

## 2. Ist-Zustand

- `buyers` (user_id, source `'manual'|'shopify'`) — heute nur `manual`, per Admin-E-Mail.
- `pool_state` (year, amount_chf, ref_cost_chf) — heute manuell im Admin gesetzt.
- Käufer ↔ Bestellung gibt es noch nicht; Pool ist nicht aus echten Zahlen abgeleitet.

---

## 3. Architektur (3 Bausteine)

```
Shopify (Käufe/Retouren)  ─┐
ShirtKing (Produktion)    ─┼──►  OneFam-Engine (Buchhaltung)  ──►  buyers (Voting)
Fixkosten + Lohn          ─┘            Umsatz − Kosten = Gewinn ──►  Travel-Pool (pool_state)
                                                                       (Auslosung bleibt gratis, separat)
```

### A) Shopify-Webhooks → `/api/shopify/webhook`
- Events: `orders/paid`, `refunds/create`, `orders/cancelled`.
- **HMAC-Verifikation** (`X-Shopify-Hmac-Sha256` gegen das Webhook-Secret) — sonst 401.
- **Idempotenz**: jede Webhook-/Order-ID nur einmal verarbeiten (Tabelle `shop_events`).
- Läuft server-seitig mit Service-Role (kein RLS-Bypass im Client).

### B) Käufer-Grant (bei `orders/paid`)
1. Kunden-E-Mail aus der Bestellung → OneFam-`auth.users` per E-Mail matchen.
   - Match → `buyers` upsert (`source='shopify'`), `purchases`-Zeile anlegen.
   - Kein Match (kauft, aber nicht angemeldet) → `pending_buyers` (E-Mail vormerken); beim nächsten
     Login/Signup automatisch zu `buyers` befördern. *(Empfehlung: im Checkout/Shop zur OneFam-
     Anmeldung einladen, damit das Matching klappt.)*
2. Voting ist damit automatisch frei (bestehende `is_buyer()`-Logik, unverändert).

### C) Retoure (bei `refunds/create` / `orders/cancelled`)
- Betroffene `purchases`-Zeile als erstattet markieren, Pool-Anteil per Gegenbuchung abziehen.
- Hat der Kunde **keine** gültige Bestellung mehr → Käufer-Status entziehen.

### D) Buchhaltungs-/Pool-Engine
Pro Bestellung: `Marge = Brutto − ShirtKing-Produktionskosten − Shopify/Payment-Gebühren`.
- **Live-Pool (Marketing):** `Pool += Marge × Anteil%` → die Zahl wächst sichtbar mit jedem Verkauf.
- **Monats-Abgleich (ehrlich):** einmal pro Monat echte Fixkosten + Lohn gegenrechnen; war der
  Monat nicht profitabel, Pool-Gutschrift entsprechend korrigieren.
- Alles als **Ledger** (`pool_ledger`: type, amount, ref, created_at) → `pool_state.amount` ist die
  Summe → jederzeit auditierbar (passt zur „öffentlich nachprüfbar"-Linie).

---

## 4. Daten-Modell (neu, Entwurf)

| Tabelle | Zweck (Kernfelder) |
|---|---|
| `purchases` | order_id, user_id, email, gross_chf, fee_chf, cogs_chf, margin_chf, status (`paid`/`refunded`), created_at |
| `pool_ledger` | year, type (`sale`/`refund`/`overhead`/`adjustment`), amount_chf, ref (order_id), created_at |
| `product_costs` | sku → cost_chf (ShirtKing-Produktionskosten, falls keine API) |
| `cost_config` | monatliche Fixkosten, Lohn, `pool_share_pct` |
| `shop_events` | event_id (Idempotenz), processed_at |
| `pending_buyers` | email, order_id (kauft ohne Konto → später befördern) |

`buyers` erweitern um `shopify_customer_id`, `first_order_id` (Rückverfolgbarkeit).

---

## 5. ShirtKing — die offene Frage

- **Wenn ShirtKing eine API/Webhooks hat** → Produktionskosten + Retouren-Events automatisch ziehen.
- **Wenn nicht** (häufig bei Print-on-Demand) → `product_costs`-Tabelle pflegen (SKU → Stückkosten),
  Retouren per Shopify-Refund-Event abdecken; ShirtKing-Storno ggf. manueller CSV-Import.
  → **Empfehlung:** mit der Kostentabelle starten (funktioniert sofort), API später ergänzen.
- *Bitte klären: hat ShirtKing eine API / Export? (Doku-Link genügt.)*

---

## 6. Was du beisteuern musst

- Shopify: **Store + Admin-API-Zugang** (Custom App Token) + **Webhook-Secret**.
- **Anteil%** für den Pool (z.B. „X % vom Gewinn").
- **Fixkosten** (Hosting, Domain, Shopify-Abo …) + **Lohn** als Monatswerte.
- ShirtKing: API-Doku **oder** eine Produktkosten-Liste (SKU → Kosten).

(Keys/Secrets kommen in `.env` / Vercel — ich kann sie nicht für dich anlegen.)

---

## 7. Bau-Reihenfolge (Vorschlag)

1. **P1** Webhook-Endpoint (HMAC + Idempotenz) + Käufer-Auto-Grant + `purchases`/`pending_buyers`.
2. **P2** Pool-Engine: Live-Gutschrift pro Verkauf → `pool_ledger` → `pool_state` automatisch.
3. **P3** Retouren-Rückbuchung + Monats-Abgleich (Fixkosten/Lohn) + Admin-Übersicht (Umsatz/Kosten/Pool).
4. **P4** ShirtKing-API (falls vorhanden) statt Kostentabelle.

P1–P3 sind **unabhängig von der Anwalt-Freigabe** baubar/testbar (die blockt nur die echte Ziehung).

---

## 8. Offene Punkte (Entscheidungen)

- ShirtKing API ja/nein? → bestimmt P4 vs. Kostentabelle.
- Pool: nur Live-Gutschrift, oder Live + Monats-Abgleich? (Empfehlung: beides.)
- Käufer ohne Konto: `pending_buyers` + Anmelde-Einladung im Shop — ok?
- Anteil%, Fixkosten, Lohn — konkrete Zahlen.
