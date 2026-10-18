# Referenzwerte für die Brand-Site — gemessen am 18.10.2026

**Wozu das da ist.** Labi wünscht sich onefam.ch „elitär, edel, exklusiv, evtl. old
fashion". Damit das nicht Geschmackssache bleibt, wurden fünf Referenzen und onefam.ch
mit **demselben Skript** (`tools/referenz-messen.js`) im **selben Fenster** vermessen.
Das Gegenstück für den Shop ist `docs/REFERENZ-shopdesign.md` (06.09.2026).

**Gemessen wurden nur Masse und Verhältnisse.** Kein fremder Code, keine Texte und keine
Bilder wurden übernommen. Messen ist zulässig, nachbauen wäre es nicht.

**Fenster: 1512 × 861**, nicht 1440 × 685 wie am 06.09. Das Chrome-Fenster stand im
Vollbild und liess sich nicht verkleinern. Für den Vergleich zählt, dass alle sechs gleich
gemessen sind. Mit den Zahlen vom 06.09. sind die Pixelwerte nicht direkt vergleichbar.

**Bedingungen:** ausgeloggt, ohne Query-Parameter. Cookie-Banner wurden mit „Ablehnen"
geschlossen, das Länderfenster bei Casablanca mit dem Kreuz. Gemessen wurde onefam.ch/de,
also das, was ein Besucher aus der Schweiz sieht.

## Die Auswahl und warum

| Referenz | Adresse | warum |
|---|---|---|
| **Aimé Leon Dore** | https://www.aimeleondore.com | Familie und Herkunft als Kern, die Bildsprache trägt die Marke |
| **Casablanca** | https://www.casablancaparis.com | Luxus mit Club-Gefühl, Reise, zwei Herkünfte |
| **Bode** | https://bode.com | am meisten „old fashion": Archiv, Handwerk, Geschichte |
| **Soho House** | https://www.sohohouse.com | exklusiv durch Zugehörigkeit, Mitgliedschaft und Warteliste |
| **Patek Philippe** | https://www.patek.com | Erbe, Generationen, Familie als Luxus |

## Messwerte Startseite

| | **OneFam** | Aimé Leon Dore | Casablanca | Bode | Soho House | Patek Philippe |
|---|---|---|---|---|---|---|
| Seitenhöhe (Bildschirme) | **10,1** | 1,0 | 5,5 | 5,2 | 3,8 | 9,8 |
| erstes Bild ab | 0 px (Video mit poster) | 0 px (Video) | 38 px | 88 px | 68 px | 0 px (Video) |
| Bildfläche 1. Bildschirm | 100 % | 100 % | 95 % | 88 % | 88 % | 100 % |
| Bilder auf der Seite | **9** | 1 | 40 | 16 | 38 | 11 |
| grösster Text 1. Bildschirm | **76 px, Gewicht 800, VERSAL** (Cabinet) | 17 px (Logo) | Logo als Bild | 16 px | 48 px, Gewicht 400, normal (Cardo, Serife) | 40 px, Gewicht **300**, VERSAL (Open Sans) |
| h2-Grössen | 48 / 52 / 64 / 72 | – | 44 / 28 (Goldenbook, Serife) | – | 48 (Cardo, Serife) | 40 / 32 / 24 |
| Fliesstext | 16 px Satoshi, Zeile 26 | – | – | 12–16 px | 16 px HK Grotesk | 16 px **Lora (Serife)**, Zeile 26 |
| Textspalte (Median) | **640 px ≈ 81 Zeichen/Zeile** | – | – | – | 423 px ≈ 53 | 400 px ≈ 50 |
| Schriften nach Zeichen | Satoshi 86 %, Cabinet 14 % | Söhne 100 % | Futura 97 %, Goldenbook 3 % | Neue Haas Unica 94 %, ITC Blair 5 % | HK Grotesk 92 %, Cardo 8 % | Lora 69 %, Open Sans 31 % |
| Hintergrund | **#0A0A0A, 95 %** | Video | weiss (Fusszeile dunkelgrün) | weiss | **Creme** rgb(255, 254, 247) | schwarz 47 %, weiss 41 % |
| Hauptknopf | Verlauf, Ecke 4 px, 15–16 px | – | – | – | schwarz/hell, **rund (40 px)**, 14 px | weiss, rund, „DISCOVER MORE" |
| Kopfzeile | 64 px | 61 px | 80 px | 88 px | 68 px | 99 px |
| Wörter 1. Bildschirm | 28 | 6 | 30 | 14 | 35 | 43 |
| **Wörter gesamt** | **1'067** | 40 | 645 | 728 | 323 | 558 |

Hinweise zu den Zahlen:
- Bei Casablanca meldet das Skript dunkelgrün als Hintergrund mit 100 %. Das ist nur die
  Fusszeile mit gesetzter Farbe. Auf dem Bildschirmfoto ist die Seite weiss.
- Bei Bode und Casablanca bestehen die Wörter fast nur aus Produktnamen, Preisen und der
  Fusszeile. Erzählender Text ist es kaum.
- Die erste Messung übersah das Vollbild-Video von Aimé Leon Dore. Es ist fest
  positioniert, und das Skript hatte feste Ebenen als Banner aussortiert. Korrigiert, siehe
  Kommentar im Skript. **Nach jeder Messung hinsehen** gilt weiter.

## Was man nur im Bild sieht

- **Aimé Leon Dore:** Die Startseite ist ein einziger Bildschirm. Ein Video füllt ihn ganz,
  davor stehen nur das Logo und eine Zeile mit Ort und Zeit („Queens, NY | Sunday, October
  18, 2026 | 14:30 EST"). Kein Satz, kein Knopf.
- **Casablanca:** Ein Kampagnenbild füllt den Bildschirm, „CASA" oben und „BLANCA" unten als
  riesiger Schriftzug im Bild. Danach Produkte auf Weiss, Überschriften in einer Serife in
  dunklem Grün.
- **Bode:** Old fashion entsteht nur über die Bilder: eine alte Ansichtskarte als Hero,
  Schwarz-Weiss-Archivfotos als Kategorien, Kleidung an Haken vor einer Holzwand. Die Schrift
  ist dagegen winzig und neutral.
- **Soho House:** „A home for the world's creatives to come together and belong" in einer
  klassischen Serife über einem Foto. Darunter kurzer, zentrierter Text auf Creme und ein
  runder Knopf „Apply for membership". Danach Fotos der Häuser.
- **Patek Philippe:** Bildschirmhohe Bildabschnitte nacheinander. Die Überschriften sind
  dünn (Gewicht 300) und in Versalien, der Fliesstext steht in einer Serife.

## Umgesetzt am 18.10.2026

Labi hat sich die Vorschläge in einer Vorschau angesehen (Zweig `vorschau-edel`, Umschalter
auf der echten Startseite: heute / leiser / Serife, drei Serifen, Abschnitte ausblenden)
und **„Serife mit EB Garamond"** gewählt. Umgesetzt auf `main` sind damit die Punkte 1, 3
und 4:

- Hero-Überschrift: EB Garamond, Gewicht 400, normal geschrieben, `clamp(2.288rem,
  4.784vw, 4.16rem)` (bei 1440 px 66,6 px statt 76 px fett in Versalien), zwei Zeilen;
  Goldstrich 1 px statt 3 px.
- Alle h2 der Startseite EB Garamond 400, einheitlich `clamp(2.08rem, 4.16vw, 3.12rem)`;
  h3 EB Garamond 400 in der bisherigen Grösse.
- Philosophie-Zitat und Pointe „Nicht lauter. Echter.": EB Garamond kursiv, 1,95rem
  (Handy 1,625rem — die Vorschau hatte dort fest 31 px, zu gross).
- Textspalten: Fliesstext höchstens 31rem, kleinerer Text 28rem.

Nachgemessen gegen die Vorschau, 60 Elemente bei 1440 und 390 px: gleich bis auf die
beabsichtigte Handy-Grösse von Zitat und Pointe. Bei 390 px keine seitliche Scrollleiste.
**Nicht umgesetzt:** Punkt 2 (Abschnitte kürzen) — Labi hat keinen Abschnitt
ausgewählt. Die Unterseiten (`/join`, Bestätigen/Abmelden, Login, Mein Bereich,
Rechtstexte, Impressum) wurden am selben Tag auf Labis Wunsch nachgezogen.

## Was daraus folgt (Vorschläge vom 18.10.2026)

1. **Die Hero-Überschrift ist die lauteste von allen.** OneFam hat 76 px mit Gewicht 800 in
   Versalien. Edel wirken die Referenzen mit **weniger Gewicht**: Soho House 48 px in einer
   Serife mit Gewicht 400, Patek 40 px in Versalien, aber dünn (300). Keine Referenz setzt
   eine fette Überschrift. Das ist der stärkste einzelne Hebel.
2. **OneFam sagt am meisten.** 1'067 Wörter gegen 40 bis 728, Soho House kommt mit 323 aus.
   Exklusiv heisst hier: weniger erklären. Die Philosophie bleibt (Labis Wunsch), aber nicht
   jeder Abschnitt muss auf der Startseite stehen.
3. **Die Textspalte ist zu breit.** 640 px, etwa 81 Zeichen pro Zeile, gegen 400–423 px und
   etwa 50 Zeichen bei Soho House und Patek. Schmalere Spalten lesen sich wie ein Buch.
4. **Drei von fünf setzen eine Serife ein.** Casablanca und Soho House für Überschriften,
   Patek für den Fliesstext, Bode eine gestochene Versalschrift für Beschriftungen. OneFam
   hat keine. Eine Serife für Philosophie und Zitate wäre der direkteste Weg zu „old
   fashion". **Achtung:** Cabinet Grotesk und Satoshi sind in `CLAUDE.md` als Markenschriften
   festgelegt. Eine dritte Schrift ist eine Markenentscheidung von Labi.
5. **OneFam hat am wenigsten Bilder.** 9 gegen 11–40. Old fashion entsteht bei Bode
   **nur** über Bilder (Archiv, Ansichtskarte, Schwarz-Weiss). Für OneFam hiesse das eigene
   Bilder mit Geschichte, etwa Familienfotos oder Orte. Stockfotos bleiben ausgeschlossen.
6. **Dunkel bleibt.** Nur Patek arbeitet mit Schwarz, und dort im Wechsel mit Weiss. Der
   dunkle Hintergrund ist eure Marke und hebt euch ab. Eine Möglichkeit wäre, einzelne
   Abschnitte warm abzusetzen, so wie die Creme bei Soho House.
7. **Nicht anfassen:** Bildfläche im ersten Bildschirm (100 %, wie die Besten), Höhe der
   Kopfzeile, der Verlaufsknopf als einzige Verlaufsausnahme der Marke.

## Für den Shop später

Dieselbe Messung auf shop.onefam.ch laufen lassen, sobald die Brand-Site steht. Die
Shop-Referenzen vom 06.09. (Colorful Standard, Asket, Everlane, Aimé Leon Dore, Carhartt
WIP) waren auf Produktdarstellung ausgerichtet, nicht auf „edel". Für den Shop eignen sich
Casablanca und Bode besser, weil beide Produkte zeigen.
