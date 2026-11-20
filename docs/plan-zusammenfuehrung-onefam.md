# Plan: Der Shop kommt in die Landing Page — onefam.ch als einzige Seite zum Stöbern

**Entschieden von Labi am 20.11.2026** („ja plane so"): **onefam.ch (Next.js auf Vercel) bleibt
die Hauptseite**, der Shop wird dort hineingebaut. WooCommerce läuft im Hintergrund weiter
(„headless"): Produkte, Preise, Bestellungen, Zahlung (zahls.ch), PodOS. **Warenkorb und Kasse
bleiben in WooCommerce.**

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
| Warenkorb, Kasse, Kundenkonto | shop.onefam.ch | WooCommerce, vorerst **weiter auf shop.onefam.ch** (später ggf. `kasse.onefam.ch`) |
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

### 0. Probeaufbau — nur lokal, nichts geht live
- **Katalog-Endpunkt im Shop** (neues Snippet, nur lesend, öffentlich, zwischengespeichert):
  `GET /wp-json/onefam/v1/katalog` liefert die **öffentlichen** Produkte mit Varianten,
  Bildern, CHF-Preis **und** EUR-Festpreis, Lagerstatus, Kategorie und den Texten aus den
  Snippets 68/69/70/102 je Sprache. Damit braucht Vercel keinen WooCommerce-Schlüssel.
- **Eine Produktseite auf onefam.ch**: `/de/produkt/albania-hoodie` (und EN/FR/ES), Farben,
  Grössen, Galerie je Farbe, Preis CHF/EUR, Lieferzeit, Grössentabelle.
- **Kaufen-Knopf** übergibt an den WooCommerce-Warenkorb (Variante, Grösse, Farbe) und
  landet in der bestehenden Kasse. Prüfen, wie das mit `of_warenkorb_hinzu` zusammenspielt.
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

### 3. Warenkorb und Kasse
Übergabe Ende-zu-Ende: Produkt wählen auf onefam.ch → Warenkorb und Kasse im Shop → Bestellung
→ PodOS, Pool-Webhook. **Testkauf macht Labi.** Vom Warenkorb aus führen Links zurück auf
onefam.ch.

### 4. Suchmaschinen und KI
- Produktdaten (JSON-LD Product mit Marke, Preis, Verfügbarkeit, Bild) auf onefam.ch;
  Vorschaubilder (die JPEGs aus `uploads/og-jpg/`), Sitemap mit hreflang, `llms.txt` mit
  Produkten.
- **301-Umleitungen** von den alten Shop-Adressen (Produktseiten, Länder, Kollektionen,
  Über uns, Kontakt) auf die neuen onefam.ch-Adressen; Shop-Sitemaps entsprechend kürzen.
- Search Console und Bing: neue Sitemap einreichen.

### 5. Shop verschlanken
WooCommerce behält Warenkorb, Kasse, Konto und die Rechtstexte bzw. leitet auf die von onefam.ch
um (Rechtstexte zusammenlegen → **Anwalt**). Router-Snippet 11 und die Seiten-Snippets werden
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
