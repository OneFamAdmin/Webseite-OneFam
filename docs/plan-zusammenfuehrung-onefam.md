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

### Stand Probeaufbau (20.11.2026, nur lokal, nichts gepusht)

**Gebaut:** `/[locale]/produkt/[slug]` (vorgebaut, alle 5 Minuten aufgefrischt, `noindex`),
`/[locale]/warenkorb`, Route `/api/shop/warenkorb`, `lib/shop/` (Typen, Währungsregel,
Katalog, Store-API). Im Shop **Snippet 114** „OneFam Headless: Katalog und Waehrung fuer
onefam.ch“ (Quelle: `docs/shop-snippets/onefam-headless-katalog.php`).

**Gemessen:**
- Katalog-Endpunkt: 84 Varianten, alle mit EUR-Festpreis 69,99 und CHF 75, 0,7 s, Bilder in
  WordPress-Grössen (825×1024, 300×300) statt 2,3-MB-Original.
- Store API: Warenkorb ohne Nonce, sobald ein Cart-Token da ist. **Ohne Token → 401** (beim
  ersten Klick im frischen Browser) — die Route holt deshalb zuerst einen. Versandland nur mit
  geleertem Bundesland (Vorgabe „BS“ ist für DE ungültig). Merkmalsnamen kommen übersetzt
  („Farbe“) — gelesen wird `raw_attribute`.
- **Währung:** CURCY entscheidet in der Store API allein nach IP (`X-Forwarded-For` wird
  geglaubt). Mit Snippet 114 und `X-OneFam-Waehrung`: Schweizer Gerät → CHF 75, sonst →
  69,99 € Festpreis. Ohne die Kopfzeile verhält sich der Shop unverändert.
- **Versand in EUR ist umgerechnet** (CHF × 1,1: DE 7,70 €, CH 19,80 €) — genauso wie heute im
  Shop (Bestellung #4145: 4,62 € = CHF 4.20 × 1,1). Ob das so gewollt ist, entscheidet Labi.
- Ladezeit (gedrosselt wie Handy, lokaler Produktionsbau gegen heutigen Shop): grösster Inhalt
  1,98 s gegen 6,68 s, Ladeende 2,9 s gegen 10,5 s, 41 gegen 188 Anfragen, 533 gegen 2014 KB,
  Verschiebung 0 gegen 0,22.

**Nachgezogen am 20.11.2026 (Abend) — die vier offenen Punkte sind erledigt:**

- **Texte in allen vier Sprachen.** Ursache: Der Shop legt die Sprache EINMAL je Anfrage fest
  (Snippet 28 `of_visitor_lang()`: Adresspräfix → Cookie `ofl` → Browsersprache → IP-Land).
  Daran hängen WordPress-Sprache, Produktnamen (Snippet 57), Motivtext (Snippet 68, gibt bei
  abweichender Sprache absichtlich nichts aus), Grössentabelle/Details (61, 62, 69). Eine
  REST-Adresse hat kein Präfix → alles fiel auf Deutsch (Schweizer IP). Lösung: onefam.ch schickt
  **Cookie `ofl=<sprache>`** mit; passt es nicht zu `?lang`, antwortet der Endpunkt mit 409.
- **Gemessen, alle 18 Produkte:** Text des Endpunkts = Text der Shop-Seite (erste 1500 Zeichen
  je Produkt, Albanien-Hoodie in allen vier Sprachen), 0 Abweichungen. Lokal gebaut 72 Seiten
  (18 × 4): alle 200, richtige Sprache, Namen wie im Shop („Albanien Hoodie“, „Albanie Hoodie“,
  „Afganistán Hoodie“), Preise je Produkt genau CHF 75/65/40 und EUR 69,99/59,99/34,95,
  kein fehlender Festpreis, Lieferzeit und Grössentabelle überall da.
- **Zwei Shop-Snippets haben dafür je eine Funktion bekommen, Ausgabe unverändert:**
  102 `onefam_lieferzeit_texte()` (1623 → 1910 Zeichen; Lieferzeit im Shop in vier Sprachen
  nachgemessen, frisch und normal) und 71 `onefam_podos_rest_entfernen()` (3458 → 3770; der
  Rest der alten PodOS-Beschreibung fehlt weiterhin auf allen 18 Shop-Seiten). So gibt es für
  Lieferzeit und Aufräum-Regel weiter nur eine Quelle.
- **Snippet 114** jetzt 10 562 Zeichen, per Prüfsumme gleich wie
  `docs/shop-snippets/onefam-headless-katalog.php`. Neu: `GET /onefam/v1/katalog` (18 Produkte,
  21 Lieferländer) — **onefam.ch braucht für den Shop-Teil keinen WooCommerce-Schlüssel mehr**;
  Produktname im Warenkorb in der Seitensprache (die Store API nimmt `get_title()`, daran hängt
  Snippet 57 nicht), nur für Anfragen mit der Kopfzeile von onefam.ch.
- **Galerie:** Nur nach Dateinamen zuzuordnen liess die sechs Logo-Produkte ohne Bilder
  (Dateien heissen `logo-black-hoodie-red.webp` bzw. `hf_…`). Jetzt: Variantenbild der Farbe
  zuerst (jede Farbe hat genau eines), dann Bilder mit der Farbe im Dateinamen, dann Bilder ohne
  Farbe. Alle 18 Produkte: keine Farbe ohne Bild. Im Bestand haben einzelne Farben nur ein Bild
  (z. B. Afghanistan-Hoodie, Andorra-Shirt).
- **Versandregel** (aus den WooCommerce-Zonen gelesen, deckt sich mit der Versandseite des
  Shops): eine Pauschale je Bestellung, festgelegt in CHF — Deutschland 7 · Kern- und West-EU
  samt Liechtenstein 12 · Ost-EU und Baltikum 16 · Schweiz und UK 18 · Nordeuropa 26. In EUR
  wird sie umgerechnet (× 1,1), es gibt keine festen Euro-Beträge und keine Versandklassen. Der
  Warenkorb auf onefam.ch übernimmt die Summe unverändert von WooCommerce.
- **Snippet-Export** (nur lokal, `docs/privat/shop-snippets/`): 11, 25, 28, 42, 57, 61, 62, 68,
  69, 70, 71, 102, 114. Chrome erlaubt je Tab einen Download ohne Klick — für weitere Exporte
  einen neuen Tab öffnen.

**Beiläufig gefunden, nicht behoben:** Die deutsche Versandseite des Shops
(`/de/shipping-policy/`) zeigt englischen Fliesstext.

**Länderseiten und Kollektionen (20.11.2026, spät):** `/[locale]/[kategorie]` für die vier Länder
und die zwei Logo-Linien, 24 Seiten, lokal gebaut und alle geprüft (0 Abweichungen): Name und
Einleitungssatz wie im Router-Snippet (maschinell übernommen nach `messages/*`,
`shop_kategorien`), drei Kacheln in der Reihenfolge Hoodie, Sweater, Shirt mit denselben Bildern
wie heute (`lib/shop/kachelbilder.ts`), Preise CHF 75/65/40 und EUR 69,99/59,99/34,95, dazu der
Kategorietext aus Snippet 70. Adressen wie im Shop (`/de/albania`, `/logo-black`), damit die
alten Adressen später eins zu eins umgeleitet werden können. Unbekannte Adressen bleiben 404,
ohne den Shop zu fragen. Snippet 114 dafür um
`GET /onefam/v1/katalog/kategorie/<slug>` erweitert (15 046 Zeichen, Prüfsumme gleich wie im
Repo). Die Produktseite verlinkt jetzt auf ihre Länderseite.
**Noch nicht gebaut:** Übersicht „Shop by Country“ mit Länder-Warteliste, Shop-Einträge in der
Navigation, Kasse.

**Länderseite nach dem Entwurf „Premium One-Page“ umgebaut (21.11.2026).** Labi: „bau die
Länderseite nach dem Entwurf um, aber nur wenn sie zur Landing Page und dem Edlen passt und ob
sie wirklich verkaufspsychologisch Sinn macht“; Kaufknopf „wie im Entwurf“ (Markenverlauf).
- **Aufbau:** Einstieg (Land als goldene Zeile, „Für alle, …“ gross im Ton des Hero-Claims,
  Motivsatz, Verlaufsknopf zu den Teilen, Preis direkt daneben) → „Drei Teile. Ein Lachen.“ mit
  Kacheln, darunter Sachangaben und aufklappbar Versand/Rückgabe → Erzählung → „Das Zeichen.“ /
  „Für wen.“ → Schlusszeile mit Verlaufsknopf.
- **Kein Wort neu geschrieben ausser sieben kurzen Bedientexten** (vier Sprachen). Erzählung,
  „Das Zeichen“, „Für wen“ und Schlusszeile kommen aus Snippet 68 (dort für alle 14 Motive und
  vier Sprachen gleich aufgebaut: letzter Absatz „Für wen“, vorletzter „Das Zeichen“), Versand
  und Rückgabe aus Snippet 69, Sachangaben aus Snippet 70. Snippet 114 liefert sie über die
  Kategorie-Abfrage (16 544 Zeichen, Prüfsumme gleich wie im Repo).
- **Nicht übernommen, mit Grund:** Farbschimmer, blasse Riesen-Gesichter, schwere Schatten
  (Designregel); DM Sans (dritte Schrift); mitlaufende Kaufleiste (drängt, verdeckt Inhalt);
  Laufzeile mit Küstenorten, Lookbook, „Was drin steckt“ (keine Texte/Bilder für sechs Linien in
  vier Sprachen — nichts erfunden); Kundenstimme (es gibt keine echte); Zahlarten (an der Kasse
  nicht geprüft); Kaufbereich auf der Länderseite (wäre bei zehn Farben die Produktseite ein
  zweites Mal — sinnvoll erst für die Vorbestellung mit einer Farbe).
- **Kopfzeile auf Shop-Seiten** (`<Nav shop />`): Warenkorb-Symbol mit Ziffer (aus dem
  Gedächtnis des Browsers, keine Anfrage an den Shop), „Join the Fam“ dort als Umrissknopf,
  damit der Verlauf die eine Hauptaktion bleibt. Startseite unverändert.
- **Behoben:** Links in den Shop-Texten (`/shipping-policy/`, `/refund-policy/`) liefen auf
  onefam.ch ins Leere, auch auf den Produktseiten — sie zeigen jetzt auf den Shop, mit Sprache.
- **Geprüft:** 24 Seiten, je 15 Punkte, 0 Abweichungen (h1, alle Absätze, Preise 75/65/40 und
  69,99/59,99/34,95, genau zwei Verlaufsknöpfe, keine losen Links, kein Verlosungswort);
  Handy 412 px ohne Überstand; Kaufknopf und Zähler im Browser getestet, Test-Warenkorb geleert.
- **Gelernt:** Der Bau nimmt Shop-Antworten aus dem Zwischenspeicher des vorigen Baus; die
  Seiten erneuern sich erst beim ersten Aufruf. Nach einer Änderung am Endpunkt deshalb die
  Seiten zweimal abrufen, bevor man prüft.

**„Nach Land shoppen“ und Navigation (21.11.2026).** Labi: „mach weiter mit shop by country und
der navigation“.
- **Seite** `/[locale]/shop-by-country` (Adresse wie im Shop): Suche → „Jetzt verfügbar“ (vier
  Länder als Karten mit Produktbild und „ab“-Preis) → „Signature — das Zeichen selbst“ (zwei
  Logo-Linien, dazu „Logo White“ und „Logo Pink“ als „Bald verfügbar“) → „Alle Länder“
  (Wunschwand, eingeklappt 24, Knopf „Alle 249 Länder anzeigen“).
- **Was kaufbar ist, entscheidet der Katalog** (Kategorie mit Produkten), nicht mehr ein Schalter
  in der Länderliste. Ein neues Land wandert von selbst nach oben.
- **Länderliste** `lib/shop/laender.ts`: 253 Länder, Namen de/fr/es aus Snippet 42, Artikelformen
  („Ich will die Schweiz“) aus der Tabelle LA — maschinell übernommen, kein Land ohne Namen.
  Alle 253 Kachelbilder mit 200 gemessen (176 × 176, 6–10 KB).
- **Texte** der Seite und des Fensters aus den Tabellen des Router-Snippets (OF_I18N, WTXT, KT,
  MT, LT, WM) nach `messages/*`, `shop_laender` — nichts neu geschrieben ausser „Schliessen“.
- **Warteliste bleibt Snippet 18 und wird vom Browser direkt angesprochen**, nicht über den
  Server von onefam.ch: Sie bremst je IP (8 je Stunde), über Vercel kämen alle von derselben
  Adresse. Gemessen: Vorabfrage (CORS) von onefam.ch 200, Zähler antwortet, ungültige Adresse →
  400 `invalid_email`, auch aus dem echten Browser. **Ein echter Eintrag wurde nicht getestet**
  (er schreibt in die Liste und verschickt eine Mail) — das macht Labi mit der eigenen Adresse.
  Die Bestätigungs- und Abmeldelinks der Mail führen weiter auf shop.onefam.ch.
- **Suche** wie im Shop: trifft den übersetzten und den englischen Namen, ohne Akzente
  („turkei“) und mit ausgeschriebenen Umlauten („tuerkei“) — im Browser getestet.
- **Navigation hinter einem Schalter:** `NEXT_PUBLIC_SHOP_AUF_ONEFAM=1` (lokal in `.env.local`).
  Seit 21.11.2026 sperrt er auch die Seiten selbst (ohne ihn 404) — der Stand ist seit dem Push
  `f108165` auf der Live-Seite, weil `/widerruf` gebraucht wurde. Livegang des Shops heisst jetzt nur
  noch: Variable in Vercel setzen und neu deployen (nach Labis Testkauf).
  Mit Schalter führen die fünf „Shop“-Links der Startseite auf `/shop-by-country`, ohne ihn
  weiter auf shop.onefam.ch — beides gebaut und gemessen (5/0 und 0/5). Grund: Ohne Kasse darf
  die Live-Navigation niemanden in einen Shop schicken, in dem man nicht bezahlen kann. Zum
  Livegang trägt Labi die Variable in Vercel ein (`docs/deploy-vercel.md`).
- **Geprüft:** vier Sprachen je elf Punkte, 0 Abweichungen; Handy 412 px ohne Überstand;
  Fenster im Browser geöffnet („Ich will die Türkei“).
- **Anders als im Shop, bewusst:** kaufbare Länder zuerst und als grosse Karten; ein Suchfeld
  statt zwei; kein „Mitentscheiden“-Schildchen auf jeder Kachel; kein Zähl-Signal an Snippet 101;
  kein Facebook-Teilen-Knopf (WhatsApp, Teilen, Link kopieren bleiben).
- **Noch offen:** Kasse (Plan Schritt 3); Seiten „Über uns“ und „Kontakt“ des Shops; die
  Rechtsseiten des Shops (Versand, Rückgabe) — die Links dorthin zeigen vorerst auf den Shop.

**Kasse auf onefam.ch (21.11.2026).** Labi: „ja, mach weiter mit der kasse“.
- **Befund vorab:** Der Shop nutzt bereits die Block-Kasse von WooCommerce, und die bestellt selbst
  über die Store API. Die Kasse auf onefam.ch geht also denselben Weg wie heute jede Bestellung.
  Einstellung des Shops: Gastbestellung, kein Konto, nur zahls („Kreditkarte, TWINT und Mobile
  Pay“), Steuern aus, keine Datenschutzseite hinterlegt, kein Gutschein vorhanden (0).
  Kein Snippet greift in den Bestellvorgang ein (alle 115 durchsucht).
- **zahls-Plugin 2.0.7 gelesen** (Kopie nur lokal, `docs/privat/zahls-plugin/`): `process_payment`
  legt ein Zahlungsfenster an (15 Minuten gültig), Erfolg → `get_return_url()`, Abbruch/Fehler →
  `wc_get_cart_url() . '?zahls_error=1&order_id=…'`; den Bestellstatus setzt die Rückmeldung
  `wc-api=wc_zahls_gateway`. Betrag aus der Bestellung, Währung aus `get_woocommerce_currency()`.
- **Snippet 114** (21 131 Zeichen, Prüfsumme gleich wie im Repo): `GET /onefam/v1/kasse` (21
  Lieferländer mit Namen je Sprache und den Regeln für Kanton/Provinz und Postleitzahl aus
  `get_address_fields`), und für Store-API-Anfragen mit `X-OneFam-Rueckkehr` aus einer festen Liste
  (onefam.ch, localhost:3000/3001) zeigen Erfolgs- und Abbruch-Adresse auf onefam.ch
  (`/danke`, `/warenkorb`); die Bestellung bekommt `_onefam_herkunft = onefam.ch`.
- **onefam.ch:** `/[locale]/kasse` (Kontakt, Lieferadresse, wahlweise Rechnungsadresse, Zahlart,
  Bestellübersicht), `/[locale]/danke`, Route `POST /api/shop/kasse`. Die Route prüft die
  Eingaben, lässt WooCommerce rechnen, **vergleicht die Summe mit der gesehenen** (bei Abweichung
  wird nicht bestellt) und gibt als Weiterleitung nur zahls.ch oder die eigene Adresse heraus.
  Warenkorb wird nach bezahlter Bestellung nur mit dem Merker `of_bestellt` vergessen.
- **Wortlaut:** Feldnamen, „Zahlungspflichtig bestellen“ und der AGB-Satz stammen aus der
  WooCommerce-Kasse des Shops in der jeweiligen Sprache; AGB-Links auf die Seiten des Shops.
- **Geprüft ohne Bestellung:** zehn Fälle der Route (Tabelle in `docs/testkauf-kasse-onefam.md`),
  Klick auf den Bestellknopf mit leerem Formular (0 Anfragen), `/danke` ohne Bestellung,
  Abbruch-Hinweis, Handy 412 px. Der Shop selbst unverändert (Seiten 200).
- **NICHT GEPRÜFT: das Anlegen der Bestellung, das Zahlungsfenster und die Rückkehr.** Das ist
  Labis Testkauf — Protokoll: `docs/testkauf-kasse-onefam.md`. Wichtigster Punkt darin: ob PodOS
  die Bestellung mit echter Varianten-Nummer richtig übernimmt.

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
- **Kasse:** Adresse, Versand (die Länder aus den WooCommerce-Zonen — 21, seit 21.11.2026 noch 19), AGB-Bestätigung,
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
