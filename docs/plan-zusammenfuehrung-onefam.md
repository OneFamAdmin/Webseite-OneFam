# Plan: Der Shop kommt in die Landing Page — onefam.ch als einzige Seite zum Stöbern

**Entschieden von Labi am 20.11.2026** („ja plane so", präzisiert: „halt stop. onefam.ch soll ja
die Hauptseite sein und der Shop muss nach onefam.ch, also auf die Domain"): **onefam.ch
(Next.js auf Vercel) ist die einzige Seite, die Kunden sehen — auch Warenkorb und Kasse.**
WooCommerce läuft nur noch unsichtbar im Hintergrund („headless"): Produkte, Preise,
Bestellungen, Zahlung (zahls.ch), PodOS. Kein Kunde soll shop.onefam.ch mehr sehen.

**Machbarkeit gemessen am 20.11.2026:** Die WooCommerce-Warenkorb-Schnittstelle (Store API,
`/wp-json/wc/store/v1/cart`) antwortet und führt **`zahls` als Zahlart** — zahls.ch unterstützt
also die moderne Kasse, über die onefam.ch bezahlen lassen kann.

> **Überholt:** Die erste Fassung dieses Plans (19.11.2026) wollte umgekehrt WordPress auf
> onefam.ch ziehen und die Landing Page in den Shop bauen. Verworfen, weil WordPress auf dem
> Infomaniak-Webhosting ohne OPcache beim ersten Aufruf ~0,7 s braucht (onefam.ch heute
> 0,36 s), ein Cloud-Server CHF 42.90/Monat ohne MWST kostet (Shop-Preis, Konto Labi,
> 20.11.2026; heute Webhosting CHF 141.50/Jahr) und der Umzug PodOS, zahls.ch und rund
> 250 fest eingetragene Adressen hätte anfassen müssen. Die Bestandsaufnahme unten gilt weiter.

---

## Zielbild

| | heute | danach |
|---|---|---|
| Startseite, Geschichte, Family Code, Warteliste | onefam.ch | onefam.ch (bleibt) |
| Länderseiten, Kollektionen, „Shop by country", Produktseiten | shop.onefam.ch (Router-Snippet 11, WooCommerce) | **onefam.ch**, Next.js, Daten aus WooCommerce |
| Warenkorb, Kasse | shop.onefam.ch | **onefam.ch** (`/warenkorb`, `/kasse`, `/danke`), über die Store API von WooCommerce; Zahlung weiter zahls.ch |
| shop.onefam.ch selbst | Shop für Kunden | nur noch Technik im Hintergrund; alle Kundenseiten leiten per 301 auf onefam.ch |
| Bestellungen, zahls.ch, PodOS, EUR-Festpreise, Warteliste je Land | WooCommerce / Snippets | **unverändert** in WooCommerce |
| Pool-Buchhaltung, Admin, Webhook | onefam.ch | onefam.ch (bleibt) |

---

## Bestand (gemessen 19./20.11.2026)

- **WooCommerce-Daten** (REST v3, Lese-Schlüssel): Albanien-Hoodie 2681 = `variable`, Attribute
  Size (10) und Colour (9), **84 Varianten**, 63 Bilder, Kategorie `albania`. Jede Variante trägt
  `_regular_price_wmcp` (EUR-Festpreis, CURCY), `regular_price` 75, eigenes Bild, Lagerstatus.
  Produktbeschreibung im Produkt nur 79 Zeichen — die eigentlichen Texte stehen in Snippets
  (68 Produkttexte je Motiv, 69 Grössentabelle/Details, 70 Kategorietexte, 102 Lieferzeit).
- **Store-API** (öffentlich): 0,94 s, nur CHF, **keine EUR-Festpreise** — als Quelle ungeeignet
  (siehe auch CLAUDE.md „Preise").
- Lese-Schlüssel `WOO_KEY/WOO_SECRET` liegen **bewusst nicht** in Vercel. Daran soll sich nichts
  ändern.
- Shop-Eigenheiten, die mitgedacht werden müssen: eigener Warenkorb-Handler
  (`of_warenkorb_hinzu`), Bestellpositionen mit `variation_id = 0`, Galerie je Farbe
  (Snippets 76, 77, 92), Währung nach Gerät (Snippet 25, Cookie `of_geo`), Sprache über Cookie
  `ofl` und Polylang.
- DNS bei Infomaniak; onefam.ch → Vercel, shop.onefam.ch → Infomaniak. **Muss nicht geändert
  werden.**

---

## Ablauf

### 0. Probeaufbau — nur lokal, nichts geht live (inkl. Warenkorb, ohne Bezahlen)
- **Katalog-Endpunkt im Shop** (neues Snippet, nur lesend, öffentlich, zwischengespeichert):
  `GET /wp-json/onefam/v1/katalog` liefert die **öffentlichen** Produkte mit Varianten,
  Bildern, CHF-Preis **und** EUR-Festpreis, Lagerstatus, Kategorie und den Texten aus den
  Snippets 68/69/70/102 je Sprache. Damit braucht Vercel keinen WooCommerce-Schlüssel.
- **Eine Produktseite auf onefam.ch**: `/de/produkt/albania-hoodie` (und EN/FR/ES), Farben,
  Grössen, Galerie je Farbe, Preis CHF/EUR, Lieferzeit, Grössentabelle.
- **In den Warenkorb** auf onefam.ch über die Store API (Variante, Grösse, Farbe), Warenkorb-Seite
  auf onefam.ch mit Summe und Versand. **Noch kein Bezahlen** im Probeaufbau.
- Messen: Ladezeit (`tools/ladezeit-messen.mjs`), Aussehen am Handy. **Labi schaut es an,
  bevor etwas weitergeht.**

### 1. Katalog auf onefam.ch
Alle 18 öffentlichen Produktseiten, Länderseiten (Albanien, Afghanistan, Andorra, Argentinien),
Kollektionen (Logo-Linien), „Shop by country" mit der Länder-Warteliste (Snippet 18 bleibt,
Anmeldung per Schnittstelle), Navigation. Vier Sprachen — Texte aus dem Katalog-Endpunkt bzw.
`messages/`. Seiten werden beim Bauen erzeugt und regelmässig neu geholt (ISR), damit Preise und
Lager aktuell bleiben.

### 2. Währung und Preise
Dieselbe Regel wie im Shop (CLAUDE.md, `docs/shop-und-pool-details.md`): Zeitzone → IP-Land →
Browsersprache, CHF für CH/LI, sonst EUR, EUR immer als Festpreis aus WooCommerce. Die Kasse
entscheidet weiter selbst nach denselben Regeln — die beiden dürfen nie auseinanderlaufen.
**Nachmessen in allen vier Sprachen und beiden Währungen**, EUR mit Hilfe aus Deutschland.

### 3. Warenkorb und Kasse auf onefam.ch
- onefam.ch spricht serverseitig mit der Store API (eigene Routen unter `/api/shop/…`). Der
  Warenkorb hängt an einem **Cart-Token** in einem Cookie von onefam.ch — keine Cookies einer
  fremden Domain, funktioniert auch in Safari.
- **Währung:** Die Anfragen tragen die Entscheidung des Kunden mit (Cookies `of_geo`,
  `wmc_current_currency`, echte IP als `X-Forwarded-For`). Sonst entschiede der Shop nach der IP
  des Vercel-Servers (z. B. Frankfurt → EUR) — genau das darf nicht passieren.
- **Kasse:** Adresse, Versand (die 21 Länder aus den WooCommerce-Zonen), AGB-Bestätigung,
  Bestellung über `/wc/store/v1/checkout` mit `zahls` → Weiterleitung zur Zahlseite von zahls.ch
  → zurück auf **onefam.ch/danke** (Rücksprung-Adresse per Snippet umbiegen).
- **Bestellung entsteht ganz normal in WooCommerce** → PodOS und Pool-Webhook laufen wie bisher.
  Zu prüfen: ob PodOS die Variante richtig erkennt (heute tragen Positionen `variation_id = 0`
  wegen des eigenen Handlers `of_warenkorb_hinzu`; über die Store API kommt die echte Variante).
- WooCommerce-Mails (Bestellbestätigung) verweisen danach auf onefam.ch.
- Rechtstexte der Kasse (AGB-Haken, Widerrufsbelehrung, Preisangaben) → **Anwalt**.
- **Testkauf macht Labi**, erst im Testmodus von zahls, dann echt.

### 4. Suchmaschinen und KI
- Produktdaten (JSON-LD Product mit Marke, Preis, Verfügbarkeit, Bild) auf onefam.ch;
  Vorschaubilder (die JPEGs aus `uploads/og-jpg/`), Sitemap mit hreflang, `llms.txt` mit
  Produkten.
- **301-Umleitungen** von den alten Shop-Adressen (Produktseiten, Länder, Kollektionen,
  Über uns, Kontakt) auf die neuen onefam.ch-Adressen; Shop-Sitemaps entsprechend kürzen.
- Search Console und Bing: neue Sitemap einreichen.

### 5. Shop verschlanken
Alle Kundenseiten von shop.onefam.ch (Startseite, Länder, Produkte, Warenkorb, Kasse, Rechtstexte)
leiten per 301 auf onefam.ch um; wp-admin, Schnittstellen und PodOS-Anbindung bleiben
(Rechtstexte zusammenlegen → **Anwalt**). Router-Snippet 11 und die Seiten-Snippets werden
danach schrittweise abgeschaltet. Der Zwischenspeicher (Snippet 113, WP Super Cache) bleibt.

### Und die Vorbestellung Albanien?
Passt in dieses Bild: Die Siebdruck-Produkte werden in WooCommerce angelegt (nicht über PodOS),
die Vorbestell-Seite mit Fortschrittsbalken und Frist entsteht auf onefam.ch.

---

## Was Labi selbst machen muss
- Den Probeaufbau ansehen und freigeben.
- **Testkauf** über den neuen Weg.
- **EUR-Prüfung aus Deutschland** (jemand vor Ort).
- **Anwalt**: zusammengelegte Rechtstexte.
- Jeder **Push** (Deploy) nach Rückfrage.

## Risiken
- **Preise**: Es darf nur eine Quelle geben — WooCommerce. Kein Preis fest im Next-Code.
  Fehlerbild 82,50 / 71,50 / 44,00 (fehlender EUR-Festpreis) auf onefam.ch genauso abfangen.
- **Währung**: onefam.ch und Kasse müssen dieselbe Währung zeigen.
- **Suchmaschinen**: Umstellung der Produktadressen kostet ein paar Wochen Schwankung; mit
  sauberen 301 begrenzt.
- **Doppelte Pflege während des Umbaus**: Solange beide Seiten leben, Texte nur an einer Stelle
  ändern (Katalog-Endpunkt).
