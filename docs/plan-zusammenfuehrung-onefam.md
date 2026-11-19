# Plan: Shop und Landing Page zusammenführen — ein WordPress auf onefam.ch

**Entschieden von Labi am 19.11.2026:**
1. **WordPress zieht auf `onefam.ch`.** `shop.onefam.ch` leitet danach dauerhaft dorthin um.
2. **Pool-Buchhaltung, Admin und Webhook bleiben** als unsichtbarer Hintergrund-Dienst
   (das heutige Next.js-Programm) unter einer Nebenadresse, vorgeschlagen `app.onefam.ch`.
   Keine öffentlichen Seiten mehr dort.
3. **Jetzt, vor der Vorbestellung Albanien.**

Stand dieses Plans: Bestandsaufnahme gemessen am 19.11.2026, **noch nichts umgebaut.**

---

## Bestand (gemessen 19.11.2026)

**DNS** liegt bei **Infomaniak** (ns11/ns12.infomaniak.ch):

| Name | heute | nach dem Umzug |
|---|---|---|
| `onefam.ch` A | 76.76.21.21 (Vercel) | **185.176.225.11** (+ AAAA 2001:1600:0:aaaa::80:7d), der Shop-Server |
| `www.onefam.ch` | CNAME cname.vercel-dns.com | auf onefam.ch (Umleitung www → ohne www) |
| `shop.onefam.ch` | 185.176.225.11 | bleibt, leitet per 301 auf onefam.ch um |
| `app.onefam.ch` | — | **neu**: CNAME cname.vercel-dns.com (Hintergrund-Dienst) |
| MX, SPF, DMARC, `send.` und `resend._domainkey` (Resend), google-site-verification | — | **unverändert lassen** — sonst bricht die Mail |

**WordPress:** Adresse in den Einstellungen `http://shop.onefam.ch` (http, nicht https —
beim Umzug auf `https://onefam.ch` korrigieren). Polylang mit en (ohne Präfix), de, fr, es.
Aktiv: code-snippets, woo-multi-currency (CURCY), https-redirection, fluent-smtp, polylang,
woocommerce, honeypot, wp-super-cache, duplicate-post, zahls-ch-payment-gateway,
classic-widgets, instant-images, wordpress-importer.

**Fest eingetragene Adressen in aktiven Snippets** (Anzahl `shop.onefam.ch` / `onefam.ch`):
11 Router ≈ 249 / 571 · 39 SEO-Technik 7 / 10 · 42 Übersetzungen 5 / 55 · 38 SEO-Meta 2 / 2 ·
67 Rücklink 1 / 7 · 41, 45, 46 je 1 · 28, 36, 44, 65, 69 nur `onefam.ch` (Mail, Links).
Dazu Snippet 26 (Kopf/Fusszeile, **base64** — dort nicht zählbar) und die Datenbank
(Seiten, Divi-Layouts, Optionen, Polylang).

**Was onefam.ch heute ausliefert** (Next.js): Startseite ×4 Sprachen, `/join` ×4 mit
Bestätigen/Abmelden, AGB/Datenschutz/Impressum ×4, `/login`, `/mein-bereich`, `/admin/*`,
`/api/woo/webhook`, `llms.txt`, `llms-full.txt`, `sitemap.xml`, `robots.txt`, Manifest,
**`/og/onefam-og-*.jpg`** (Snippet 38 im Shop verweist darauf!). Warteliste in Supabase:
0 bestätigt, 2 Altzeilen — es gibt nichts zu übertragen.

---

## Ablauf in fünf Schritten

### 1. Inhalte der Landing Page in den Shop holen — unter shop.onefam.ch, umkehrbar
Nichts an Domain oder DNS. Der Shop bekommt alles, was heute nur onefam.ch hat:
- **Geschichte und Haltung** (Was ist OneFam, Warum, Die Stücke, Philosophie, Family Code
  samt langer Fassung, Vision): in die bestehende Seite „Über uns" bzw. als Abschnitte der
  Startseite. Texte aus `messages/<sprache>.json`, alle vier Sprachen.
- **FAQ**: die sechs Fragen der Landing Page mit der Shop-FAQ zusammenlegen (keine Dubletten,
  Sprachregeln!).
- **`/join`** als eigene WordPress-Seite, damit die Adresse `/join`, `/de/join` usw. nach dem
  Umzug **gleich bleibt**. Anmeldung über die bestehende Länder-Warteliste (Snippet 18,
  doppelte Bestätigung) — ohne Land oder mit „Allgemein".
- **Rechtstexte**: Was nur die Landing Page hat (Warteliste in der Datenschutzerklärung,
  Impressum-Angaben), in die Shop-Rechtstexte übernehmen. **Anwalt** — Arbeitsregel 12.
- **Vorschaubilder** `onefam-og-{en,de,fr,es}.jpg` in die WordPress-Mediathek laden und
  Snippet 38 darauf umstellen — sonst sind sie nach dem Umzug weg.
- `llms.txt` des Shops um den Inhalt von onefam.ch/llms.txt erweitern.

### 2. Hintergrund-Dienst auf app.onefam.ch
- Vercel: Domain `app.onefam.ch` zum Projekt hinzufügen; DNS-Eintrag bei Infomaniak.
- Öffentliche Seiten des Next-Programms abschalten oder auf onefam.ch umleiten; `noindex`.
  Bleiben: `/api/woo/webhook`, `/admin/*`, `/login`, `/auth/*`.
- Webhook 4 im Shop auf `https://app.onefam.ch/api/woo/webhook` umstellen.
- Supabase: erlaubte Rücksprungadressen um app.onefam.ch ergänzen. Vercel-Variablen
  (z. B. Seitenadresse) prüfen — **Labi** (Zugangsdaten).

### 3. Testlauf
- **Sicherung** des ganzen Shops (Dateien + Datenbank) bei Infomaniak — **Labi**.
- Wenn Infomaniak eine Testumgebung (Kopie) anbietet: Umzug dort zuerst durchspielen.

### 4. Umzug (ein Termin, ruhige Uhrzeit, ca. 2–3 Stunden)
1. Infomaniak: `onefam.ch` und `www.onefam.ch` dem WordPress-Hosting hinzufügen, SSL-Zertifikat
   ausstellen — **Labi** im Infomaniak Manager.
2. DNS: `onefam.ch` A/AAAA auf den Shop-Server, `www` umleiten. MX und Mail-Einträge **nicht**
   anfassen — **Labi** oder gemeinsam.
3. WordPress-Adresse auf `https://onefam.ch`; alle `shop.onefam.ch` in der Datenbank
   ersetzen (Suchen-und-Ersetzen mit Rücksicht auf serialisierte Daten, z. B. Plugin
   „Better Search Replace" — Installation mit Labis OK).
4. Snippets mit fester Adresse nachziehen (Liste oben), Snippet 11 und 26 mit besonderer
   Sorgfalt (Arbeitsregel 8: Länge nach dem Speichern prüfen).
5. Umleitungen: `shop.onefam.ch/*` → `onefam.ch/*` (301); alte Landing-Page-Adressen auf die
   neuen: `/agb` → AGB-Seite, `/datenschutz` → Datenschutz, `/impressum` → Impressum, je Sprache.
6. **PodOS** (Shirt-King): neue Shop-Adresse eintragen bzw. von Christian eintragen lassen —
   PodOS liest Produkte und Bestellungen über die Adresse. **Vorher ankündigen.**
7. **zahls.ch**: prüfen, ob die Domain im Konto hinterlegt ist; Testzahlung — **Labi**
   (Testkäufe macht Labi).
8. Search Console (Domain-Eigenschaft deckt beides ab): neue Sitemaps einreichen; Bing.

### 5. Nachmessen
Alle Seiten aus beiden Sitemaps, alle Umleitungen, Währung CHF/EUR, Warenkorb und Kasse,
Warteliste mit echter Mail, Webhook an app.onefam.ch, PodOS-Bestellweg, Ladezeit.

---

## Risiken, die man kennen muss
- **PodOS** ist der heikelste Teil: ein Sync hat schon einmal 94 Variationen gelöscht. Die
  Adressänderung vorher mit Shirt-King abstimmen.
- **Suchmaschinen**: Hunderte Adressen ändern sich. Mit sauberen 301 hält sich der Verlust in
  Grenzen, ein paar Wochen Schwankung sind normal.
- **Geschwindigkeit**: Der Shop-Server antwortet heute in 1–2 s, onefam.ch in 0,3 s. Die neue
  Startseite wird ohne Zwischenspeicher langsamer sein als die alte.
- **Rechtstexte**: Zusammenlegen ist rechtlich heikel (Widerruf, Warteliste) — Anwalt.
