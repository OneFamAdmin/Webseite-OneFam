# Shopify einrichten — Klick-für-Klick (für die OneFam-Integration)

Ziel: die Zugangsdaten besorgen, die OneFam braucht, um Käufe automatisch zu erkennen
(API-Token + API-Secret + Webhooks). **Du brauchst dafür Shopify-Inhaber- oder Admin-Rechte.**

> Wichtig: **Keys/Token niemals in Chat, E-Mail oder Code posten.** Sie kommen später in
> `.env.local` (lokal) bzw. in Vercel → Settings → Environment Variables. Bis dahin: sicher
> ablegen (Passwort-Manager).

---

## Teil A — Custom App + API-Zugang (kann man JETZT machen)

1. Shopify-Admin öffnen → unten links **Einstellungen** (Settings).
2. **Apps und Vertriebskanäle** (Apps and sales channels) anklicken.
3. Oben rechts **Apps entwickeln** (Develop apps).
   - Falls eine Meldung kommt: **Entwicklung von Custom-Apps erlauben** (Allow custom app
     development) → bestätigen. (Nur Inhaber kann das.)
4. **App erstellen** (Create an app) → Name z.B. `OneFam Integration` → **App erstellen**.
5. Tab **API-Berechtigungen konfigurieren** (Configure Admin API scopes). Folgende Häkchen setzen:
   - `read_orders` (Bestellungen lesen)
   - `read_customers` (Kund:innen lesen)
   - `read_products` (Produkte lesen)
   - `read_fulfillments` (Versand lesen) — optional
   → **Speichern**.
6. Tab **API-Zugangsdaten** (API credentials) → **App installieren** (Install app) → bestätigen.
7. Jetzt erscheinen zwei Dinge — **beide sicher kopieren**:
   - **Admin-API-Zugriffstoken** (Admin API access token) — wird nur EINMAL angezeigt! Beginnt mit `shpat_…`.
   - **API-Schlüssel-Geheimnis / API secret key** — braucht man, um Webhooks zu prüfen (Signatur).

➡️ Damit hast du: `SHOPIFY_STORE` (deine `xxx.myshopify.com`-Adresse), `SHOPIFY_ADMIN_TOKEN`
(`shpat_…`), `SHOPIFY_API_SECRET`. Die gibst du mir später für `.env` / Vercel.

---

## Teil B — Webhooks registrieren (ERST wenn der Endpoint steht)

Webhooks brauchen die OneFam-Adresse, an die Shopify melden soll (z.B.
`https://onefam.ch/api/shopify/webhook`). Die gibt es erst nach Bau-Schritt P1. Dann:

1. Einstellungen → **Benachrichtigungen** (Notifications) → ganz unten **Webhooks**.
2. **Webhook erstellen** — drei Stück anlegen, jeweils Format **JSON**, URL = der OneFam-Endpoint:
   - Ereignis **Bezahlung der Bestellung** (Order payment)
   - Ereignis **Erstattung erstellt** (Refund creation)
   - Ereignis **Stornierung der Bestellung** (Order cancellation)
3. Unter dem Webhook-Bereich steht ein **Signatur-Schlüssel** (Webhook signing secret) — den auch
   sicher kopieren (`SHOPIFY_WEBHOOK_SECRET`).

*(Alternativ registriere ich die Webhooks programmatisch über den Admin-API-Token — dann entfällt
Schritt B.1–B.3. Sag Bescheid, was dir lieber ist.)*

---

## Was du am Ende an mich gibst (für `.env` / Vercel)

| Variable | Woher |
|---|---|
| `SHOPIFY_STORE` | deine `…​.myshopify.com`-Adresse |
| `SHOPIFY_ADMIN_TOKEN` | Teil A, Schritt 7 (`shpat_…`) |
| `SHOPIFY_API_SECRET` | Teil A, Schritt 7 |
| `SHOPIFY_WEBHOOK_SECRET` | Teil B, Schritt 3 |

Wenn Teil A erledigt ist, sag Bescheid — dann baue ich P1 (Webhook-Endpoint + automatischer
Käufer-Grant), und wir machen Teil B gemeinsam.
