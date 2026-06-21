# Shopify einrichten — aktualisiert (Stand 2026)

Ziel: Shopify so anbinden, dass OneFam bezahlte Käufe + Retouren automatisch erkennt.

> **2026-Änderung:** Der frühere einfache Weg (Shop-Admin → „Apps und Vertriebskanäle" →
> „Apps entwickeln" → Admin-API-Token anzeigen) ist bei neuen Apps oft nicht mehr verfügbar;
> neue Custom-Apps laufen übers **Dev Dashboard mit OAuth** (App-URL, Redirect-URLs, „Release",
> kein direkt sichtbarer Token). **Das brauchen wir NICHT** — siehe unten.

---

## Der einfache Weg: nur Webhooks (kein Token, keine OAuth-App)

Shopify schickt bei jeder Bestellung/Retoure eine **Webhook-Nachricht** an OneFam. Diese
Nachricht enthält bereits Kunden-E-Mail, Artikel (inkl. SKU), Beträge und Retouren-Infos —
genug, um den Käufer zu erkennen und den Pool zu berechnen. **Kein Admin-API-Token nötig.**

➡️ Das **Dev-Dashboard-App „OneFam Intigration"** brauchst du dafür **nicht** — kannst du liegen
lassen oder löschen. (Falls wir später Daten aktiv *abfragen* wollen, holen wir einen Token dann
über den Client-Credentials-Flow — nicht jetzt nötig.)

---

## Voraussetzung: die Seite muss live sein

Webhooks brauchen eine **öffentlich erreichbare Adresse**, an die Shopify melden kann
(z.B. `https://onefam.ch/api/shopify/webhook`). Auf `localhost` kann Shopify nicht zugreifen.
→ Erst wenn die Seite deployed ist (Vercel), funktionieren die Webhooks.

---

## Reihenfolge

1. **OneFam:** ich baue den Webhook-Endpoint `/api/shopify/webhook` (HMAC-Prüfung + Idempotenz +
   automatischer Käufer-Grant). *(Bau-Schritt P1)*
2. **Deploy:** Seite auf Vercel live stellen (Pre-Launch-Punkt #3, Env-Variablen setzen).
3. **Du, im Shop-Admin (klickbar, ~5 Min):**
   - Einstellungen → **Benachrichtigungen** (Notifications) → ganz unten **Webhooks**.
   - **Webhook erstellen**, drei Stück, Format **JSON**, URL = der OneFam-Endpoint:
     - **Bezahlung der Bestellung** (Order payment)
     - **Erstattung erstellt** (Refund creation)
     - **Stornierung der Bestellung** (Order cancellation)
   - Unter dem Webhook-Bereich steht ein **Signatur-Schlüssel** (signing secret) → den kopieren =
     `SHOPIFY_WEBHOOK_SECRET` (kommt in Vercel → Environment Variables).

> **Sicherheit:** den Signatur-Schlüssel nie im Klartext teilen — nur in `.env.local` / Vercel.

---

## Optional, erst falls später nötig (Daten aktiv abfragen)

Wenn wir irgendwann mehr Daten *ziehen* müssen (statt nur Webhooks zu empfangen), holen wir einen
Admin-API-Zugang über den **Client-Credentials-Flow** der Dev-Dashboard-App. Das ist Entwickler-
Arbeit auf OneFam-Seite, kein Klick-Job für dich. Für P1–P3 nicht nötig.
