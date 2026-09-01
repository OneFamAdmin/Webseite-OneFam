# OneFam — Übergabe: Shopify-Anbindung & Pool-Buchhaltung (Stand 21. Juni 2026)

> ## ⚠️ Teilweise überholt — Stand 1. September 2026
>
> **Es gibt keinen Shopify-Store mehr.** Verkauft wird ausschliesslich über
> **shop.onefam.ch (WordPress/WooCommerce)**, angebunden an PodOS/ShirtKing.
> Alles, was unten Shopify-Webhooks, Shopify-Topics (`orders/paid`,
> `refunds/create`), `SHOPIFY_WEBHOOK_SECRET` oder den Store `uu5kyg-3t`
> beschreibt, ist damit hinfällig; der zugehörige Code wurde entfernt und durch
> `app/api/woo/webhook` + `lib/woo/` ersetzt (siehe CLAUDE.md).
>
> **Weiterhin gültig und der Grund, warum dieses Dokument bleibt:**
> die rechtlichen Leitplanken, das Pool-Modell (Gewinnanteil, Lohn nie aus dem
> Pool) und §3 zum Trust-first-Stand — darauf verweisen mehrere Kommentare im
> Code.
>
> Ausserdem gilt seither: der Pool wurde **nie** gespeist (es kam nie eine
> Bestellung an), im Shop gibt es **keine SKUs**, und Bestellungen laufen in
> **CHF und EUR**.


Dieses Dokument fasst die automatisierte **Käufer-Erkennung (P1)** und die
**Pool-/Gewinn-Buchhaltung (P2)** zusammen — inkl. Architektur, aktuellem Status,
Zugängen, offenen Punkten und den rechtlichen Leitplanken. Zum Weitergeben gedacht.

> ⚠️ **Keine Secrets** in diesem Dokument — nur die **Namen** der Umgebungs­variablen.
> Alle Schlüssel liegen ausschließlich in `.env.local` (lokal) bzw. Vercel → Environment Variables.

---

## 1. Überblick

OneFam ist eine Next.js-15-App (Tailwind v4, TypeScript). Öffentlich = Marken-/Community-Seite
mit **gratis Verlosung** von Community-Reisen; Käufer im Shopify-Shop erhalten Soft-Benefits
(u. a. Reiseziel-Voting). Diese Session hat die **Shopify-Automatisierung** gebaut:

- **P1 — Käufer-Erkennung:** Wer im Shop bezahlt, wird automatisch & rückverfolgbar Käufer.
- **P2 — Pool-Buchhaltung:** Aus dem Gewinn jedes Verkaufs fließt ein Anteil in den Reise-Pool.

Beides ist **gebaut, deployed und live verifiziert**.

### Live-Links
| Was | URL |
|---|---|
| Live-Seite | https://webseite-one-fam.vercel.app |
| Admin (gated) | `/admin` · `/admin/voting` · `/admin/pool` |
| Öffentlich | `/` · `/join` · `/reiseziel` · `/archiv` |
| Shopify-Webhook-Endpoint | `https://webseite-one-fam.vercel.app/api/shopify/webhook` |

### System-Koordinaten
| System | Kennung |
|---|---|
| GitHub-Repo | `OneFamAdmin/Webseite-OneFam` (Branch `main`, Direkt-Push) |
| Vercel-Projekt | `webseite-one-fam` (Team `one-fam-admin-s-projects`) |
| Supabase-Projekt | Ref `yemcjottasfsdahzsjie` · Region **eu-central-2 (Zürich)** |
| Shopify-Store | `uu5kyg-3t` (onefam.shop) |
| PodOS-Projekt | `onefam-441595` (Print-Backend, Marke „Shirt-King" / Heldenwerbung GmbH) |
| Admin-Login | `josefgnther@gmail.com` (= `ADMIN_EMAIL`) |

---

## 2. Shopify P1 — automatische Käufer-Erkennung (Webhooks)

**Prinzip:** Shopify schickt bei Bestellungen/Retouren einen Webhook an OneFam. Kein
Admin-API-Token nötig — nur Webhooks + Signatur-Prüfung.

### Ablauf
1. **HMAC-Verifikation** (`X-Shopify-Hmac-Sha256` vs. `SHOPIFY_WEBHOOK_SECRET`) → sonst **401**.
2. **Idempotenz** über Tabelle `shop_events` (jede Event-ID nur einmal; Retries = No-Op).
3. **`orders/paid`** → Kunden-E-Mail mit OneFam-`auth.users` matchen:
   - Treffer → `buyers`-Eintrag (`source='shopify'`, `first_order_id`) + `purchases`-Zeile.
   - Kein Treffer → `pending_buyers` (E-Mail vormerken → beim nächsten Login/Signup automatisch befördert).
4. **`refunds/create`** + **`orders/cancelled`** → `purchases` auf `refunded`/`cancelled`;
   Käufer-Status wird entzogen, **wenn keine bezahlte Bestellung mehr übrig ist** und **nur**
   bei `source='shopify'` (ein **manueller** Admin-Grant bleibt bestehen).

### Beteiligte Dateien
- `app/api/shopify/webhook/route.ts` — Endpoint (Node-Runtime).
- `lib/shopify/verify.ts` — HMAC-Prüfung (timing-safe).
- `lib/shopify/buyers.ts` — Käufer gewähren/entziehen.
- `lib/shopify/promote.ts` — Beförderung vorgemerkter Käufer beim Login.
- `lib/supabase/users.ts` — E-Mail → `auth.users`.
- Beförderung eingehängt in `app/auth/callback/route.ts` (+ Backstop in `app/join/bestaetigen/page.tsx`).
- Migration `supabase/migrations/0006_shopify.sql`.

### Status
✅ Deployed · ✅ 3 Webhooks in Shopify (Order payment / Refund creation / Order cancellation,
Format **JSON**, API-Version **2026-04**) · ✅ `SHOPIFY_WEBHOOK_SECRET` in Vercel gesetzt ·
✅ **E2E live getestet** (Test-Order → `purchases` + `pending_buyers` + `shop_events`; danach
Testdaten gelöscht).

---

## 3. Shopify P2 — Pool-/Gewinn-Buchhaltung

**Prinzip:** Pro bezahlter Bestellung wird der Reise-Pool aus dem **Gewinn** gespeist.

```
Marge  = Brutto − Produktionskosten (COGS) − Gebühren
Pool  += max(0, Marge) × Pool-Anteil %
```

Alles als **Ledger** (`pool_ledger`) → `pool_state.amount_chf` = laufende Summe (per DB-Trigger,
race-frei) → jederzeit auditierbar.

### Wichtige Eigenschaften
- **Sichere Defaults:** Ohne Konfiguration ist der Pool-Anteil 0 % → es wird **nichts** gebucht.
- **Kein Pool-Abzug bei Verlust:** Ein defizitärer Verkauf bucht nie negativ (Clamping auf 0).
- **Idempotent:** Eine Bestellung wird nur einmal gutgeschrieben (Unique-Index auf `pool_ledger`).
- **Retouren:** Refund/Storno bucht die Pool-Gutschrift automatisch zurück.

### Beteiligte Dateien
- `lib/pool/accounting.ts` — reine Rechen-Engine (**15/15 Tests**).
- `lib/pool/service.ts` — Ledger-Buchung + Order-Buchhaltung, Retouren-Rückbuchung.
- `app/api/shopify/webhook/route.ts` — verbucht bei `orders/paid`, bucht zurück bei Refund/Cancel.
- `lib/podos/client.ts` — **read-only** PodOS-API-Client für die Produktionskosten (COGS).
- `app/admin/pool/{page,actions}.ts` — Admin-Oberfläche.
- Migration `supabase/migrations/0007_pool.sql`.

### Admin-Oberfläche `/admin/pool`
- **Pool-Anteil %**, Gebühren-%, fixe Gebühr, Fallback-Kosten-% setzen.
- **Kosten von PodOS synchronisieren** (sobald API-Key gesetzt).
- **SKU-Kosten** manuell pflegen (Tabelle `product_costs`).
- **Ledger** ansehen + manuelle Korrektur-Buchung.
- Übersicht: Pool, Umsatz, Marge.

### Status
✅ Migration `0007` in Produktion angewandt + Trigger **funktional verifiziert** ·
✅ Engine + Webhook-Verbuchung deployed · ✅ `/admin/pool` live (gated) ·
🟡 **Pool-Anteil aktuell auf 20 % gesetzt**, aber **noch keine COGS hinterlegt** →
siehe „Offene Punkte".

---

## 4. PodOS / Shirt-King (Produktions-Backend + COGS-Quelle)

- **PodOS** = die Print-on-Demand-Fabriksoftware (Web-to-Print, Auftrags-/Retourenverwaltung),
  an die der Shopify-Shop angebunden ist. **Shirt-King** ist der Druck-/Produktionsanbieter darin
  (Marke der **Heldenwerbung GmbH**, Teltow/Berlin).
- **REST-API:** Base `https://api.podos.io/v1`, Auth `Authorization: Bearer <key>` +
  GET-Param `?project=onefam-441595`. Endpunkte u. a. `products`, `variants`, `orders`,
  `fulfillments`. API-Key in **PodOS → Settings → Developer**.
- **Zweck für OneFam:** Die **Stückkosten (COGS)** je Produkt/Variante liefern, damit die Marge
  echt berechnet wird. Der Client `lib/podos/client.ts` zieht diese Kosten (nur **GET**, nie POST —
  ein POST würde eine echte Produktionsbestellung auslösen).
- **Offen:** `PODOS_API_KEY` muss gesetzt werden. Das genaue Kostenfeld (`cost`/`base_cost`/…)
  wird an der Live-API bestätigt, sobald der Key da ist (per `PODOS_COST_FIELD` überschreibbar).

> **Hinweis Shirt-King-Support:** Eine Standard-Antwort sprach von „temporärem Aufnahmestopp
> für neue POD-Anmeldungen". OneFam ist **kein Neuzugang**, sondern bereits migrierter Partner
> (Projekt `onefam-441595`) — Ansprechpartner **Christian**. Der Developer-API-Key ist
> voraussichtlich unabhängig davon nutzbar.

---

## 5. Datenbank (Supabase, Postgres)

Migrationen liegen in `supabase/migrations/` und sind **alle in Produktion angewandt**:

| Migration | Inhalt |
|---|---|
| `0001_init.sql` | `entries`, `pool_state`, `draws` (Gratis-Verlosung + Ziehung) |
| `0002_profiles.sql` | `profiles` (Anzeigename) |
| `0003`–`0005` | Reiseziel-Voting (`buyers`, `is_buyer()`, `poll_rounds/options/votes`, gestaffelte Kampagne) |
| **`0006_shopify.sql`** | **P1:** `purchases`, `pending_buyers`, `shop_events` + `buyers`-Spalten |
| **`0007_pool.sql`** | **P2:** `cost_config`, `product_costs`, `pool_ledger` + Trigger `recompute_pool_state` |

**RLS:** Alle Käufer-/Finanz-Tabellen sind **service-role-only** (kein Client-Zugriff). Öffentlich
lesbar sind nur `pool_state`, `draws`, `poll_rounds/options` (Transparenz). Die öffentliche
Pool-Zahl ist `pool_state.amount_chf`.

---

## 6. Umgebungs-Variablen

**Bereits gesetzt** (Vercel Production + lokal `.env.local`):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`DRAND_CHAIN_URL`, `ADMIN_EMAIL`, `RESEND_API_KEY`, `EMAIL_FROM`, `NEXT_PUBLIC_SITE_URL`,
**`SHOPIFY_WEBHOOK_SECRET`**.

**Noch offen** (für den PodOS-COGS-Sync):
`PODOS_API_BASE` (= `https://api.podos.io/v1`), `PODOS_PROJECT` (= `onefam-441595`),
**`PODOS_API_KEY`** (aus PodOS → Settings → Developer), optional `PODOS_COST_FIELD` /
`PODOS_SKU_FIELD`.

Vorlage: `.env.local.example` (im Repo, mit Kommentaren).

---

## 7. Offene Punkte / To-Do

**Damit der Pool korrekt zu buchen beginnt:**
1. **Echte Produktionskosten (COGS)** hinterlegen — per PodOS-Sync (`PODOS_API_KEY` setzen) oder
   manuell in `/admin/pool`. ⚠️ **Ohne COGS** würde der Pool bei einem echten Verkauf 20 % vom
   **Umsatz** statt vom **Gewinn** buchen. Empfehlung: bis dahin Pool-Anteil auf **0** lassen und
   erst gemeinsam mit echten COGS auf 20 % scharf schalten.
2. Shirt-King/Christian: bestehenden Zugang bestätigen + API/Retouren-Daten freigeben.

**Nächster Bau-Schritt — P3:**
- **Monats-Abgleich:** Fixkosten + Lohn als `overhead`-Buchung gegenrechnen (Admin-Monatsübersicht).

**Pre-Launch (unabhängig, aus früheren Sessions):**
- Anwaltliche Freigabe der Teilnahmebedingungen / „kein Geldspiel".
- Firmenstruktur (GmbH + separates Pool-Konto).
- SMS-Verifikation, Resend-Domain `onefam.ch`, drand-Fallback.
- Dev-Routen `/dev` + `/design` vor Produktion entfernen.

---

## 8. Rechtliche Leitplanken (nicht brechen)

1. **Die Auslosung bleibt GRATIS für alle** — kein Kauf-Zwang. Der Käufer-Status schaltet nur
   **Soft-Benefits** (Voting) frei, **nie** die Gewinnchance. *(Das ist die tragende Ausnahme,
   die OneFam aus dem bewilligungspflichtigen Geldspiel hält: kein Einsatz.)*
2. **Lohn und Fixkosten sind Kosten** — sie werden vor dem Gewinn abgezogen (Monats-Abgleich P3)
   und **niemals aus dem Pool** entnommen.
3. **Der Pool ist ein Gewinn-Bonus** an die Community (separates Konto empfohlen).

---

## 9. Verifikation (was getestet wurde)

- **HMAC:** Unit-Test 7/7 (gültig/ungültig/manipuliert) + Live-Endpoint 401 bei falscher Signatur.
- **P1 E2E:** echter Shopify-Test-Webhook → korrekt in `purchases`/`pending_buyers`/`shop_events`;
  bestehender manueller Käufer unberührt.
- **P2 Trigger:** Funktionstest auf Wegwerf-Jahr → `pool_state` folgt dem Ledger (Insert +, Delete −);
  echter 2026-Pool unberührt.
- **Engine:** 15/15 (bekannte/unbekannte Kosten, Verlust-Clamping, Mehrpositionen, Anteil 0).
- **Build:** `tsc` + `eslint` sauber; Deploy grün; `/admin/pool` gated (307).

---

## 10. Relevante Commits

- `0ba4b37` — Shopify P1 (Käufer-Erkennung über Webhooks)
- `5ba60f7` — Shopify P2 (Pool-Buchhaltung, Kern)
- `6db71e5` — Shopify P2 (Admin `/admin/pool` + PodOS-Client)

Weiterführende Docs im Repo: `docs/shopify-setup.md`, `docs/shopify-pool-automation.md`,
`docs/deploy-vercel.md`.
