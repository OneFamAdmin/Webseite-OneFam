# Stick oder Druck — je Land

Gemessen am **12.09.2026** an den **253 EPS-Druckdaten** der Länderkollektion auf der
externen Platte „Labi Extern", Ordner `OneFam/NFTs /OneFam EPS Neu/eps neu`
(Stand 17.03.2024, die neueste der vier EPS-Fassungen auf der Platte).

> **Diese Messung ersetzt die vom selben Tag an den Webdateien `public/faces`.**
> Die alte stand unter dem Vorbehalt, dass 256 px für den Hoodie zu grob sind. Der
> Vorbehalt war richtig — und er galt, was damals nicht notiert wurde, **auch für die
> 69-mm-Tabelle**: das Skript hat für alle 196 Webdateien die Warnung „zu grob
> aufgelöst" ausgegeben, 0,44 mm je Pixel gegen 0,20 erlaubte. **Beide alten Tabellen
> waren Artefakte.** Was sich geändert hat, steht unten unter „Alt gegen neu".

---

## Was das Motiv ist

Eine **Strichzeichnung des Gesichts** — Brauen, Augen, Nase, Mund, Wangenbogen als
einzelne, **unterbrochene** Striche. Die Flagge liegt **in** den Strichen, nicht
dahinter; ausserhalb ist das Motiv leer. Die Strichzeichnung ist **für alle Länder
identisch**, nur die Füllung wechselt.

## Die Druckmasse

| Stück | Druckbreite | Strichbreite | Motivfläche (gemessen) |
|---|---|---|---|
| **Hoodie** (Cruiser 2.0) | **166 mm** | **11,1 mm** | **9 498 mm²** (8 831 bis 9 558) |
| Sweater (Changer 2.0) | 69 mm | 4,6 mm | **1 641 mm²** (1 526 bis 1 651) |
| Shirt (Creator 2.0) | 69 mm | 4,6 mm | **1 641 mm²** (1 526 bis 1 651) |

Quelle der Druckbreiten: `RUNBOOK-laenderlauf.md`, Abschnitt Druckmasse.
**Die Flächen sind neu.** An den Webdateien kamen 7 240 bzw. 1 250 mm² heraus; an den
Druckdaten deckt das Motiv mehr Fläche. Der Hoodie trägt **Faktor 2,4 in der Breite,
5,8 in der Fläche**.

---

## Wie gemessen wurde

`tools/motiv-messen.py` zählt je Motiv den **Anteil der Motivfläche, der in Teilen
steckt, die schmaler als 1 mm sind** — die Grenze, unter der ein Satinstich nicht mehr
ausführbar ist. **Null heisst: vollständig stickbar, ohne etwas wegzulassen.**

```
gs -dSAFER -sDEVICE=pngalpha -r400 -dEPSCrop -o <ziel>.png <quelle>.eps
python3 tools/motiv-messen.py <ordner> --breite-mm 166 --json /tmp/hoodie.json
python3 tools/motiv-messen.py <ordner> --breite-mm 69  --json /tmp/shirt.json
```

**Auflösung: 0,145 mm je Pixel am Hoodie, 0,060 mm am Shirt** — beides unter der
0,20-mm-Schwelle, ab der das Skript warnt. Kein Bild wurde beanstandet, die Zahlen
tragen also. Motivbreite einheitlich **1 142 bis 1 146 px**.

### Zwei Eingriffe an den Vorlagen, beide belegt

1. **Die EPS sind NFT-Bilder mit flächigem Hintergrund**, nicht freigestellte
   Druckdateien. Entfernt wurde genau die Farbe des Eckpunkts, exakt gleich, ohne
   Toleranz. Ihr Anteil liegt bei allen 253 Dateien zwischen **84,6 und 86,8 %** —
   kein Ausreisser, also hat die Entfernung nirgends ins Motiv geschnitten.
2. **Zwei Dateien tragen unten rechts eine kleine Flaggenkachel** (Kopie 220 und 249,
   237 × 159 px an derselben Stelle). Erkannt daran, dass sie ihren Rahmen ausfüllen,
   und entfernt — sonst hätten diese beiden Motive 1 408 statt 1 146 px Breite und
   damit eine andere Millimeter-Umrechnung bekommen.

### Woher die Ländernamen kommen

Die EPS heissen „Zeichenfläche 1 Kopie NNN" und tragen **keinen Ländernamen**.
Zugeordnet wurde über das Bild selbst — gegen die benannten PNG derselben Sammlung
(`NFTs /PNG`), als Zuweisungsproblem gelöst, **nicht** über eine Annahme zur
Reihenfolge.

**Gegenprobe an den 196 Webdateien** (die nach ISO-Nummer heissen): **161 stimmen
namensgleich**, 35 weichen nur in der Schreibweise ab (DR Kongo, Elfenbeinküste, USA,
Südsudan, Äquatorialguinea) oder das Land fehlt in der Weltkarte des Repos. In jedem
dieser Fälle liegt der zweitbeste Treffer weit entfernt — die Zuordnung ist eindeutig.

**Ein Motiv bleibt ohne Namen:** Kopie 99, dunkelblau mit Union Jack, ohne Stern und
ohne Wappen. Es hat weder in der benannten PNG-Sammlung noch unter den Webdateien
einen Partner und läuft in den Zahlen als „unbekannt" mit.

---

## Hoodie, 166 mm

| Verlust | Motive |
|---|---|
| **unter 0,5 %** — ohne Weglassen stickbar | **213** (davon 152 mit exakt 0,00 %) |
| 0,5 bis 2 % | 20 |
| 2 bis 5 % | 16 |
| **über 5 %** | **4** |

Median **0,00 %**, schlechtestes **7,1 % (Portugal)**.

**Über 5 %:** Portugal 7,1 · Haiti 6,9 · Serbien 6,5 · Spanien 6,2.

**2 bis 5 %:** Argentinien 4,7 · Vatikan 4,7 · Ecuador 4,4 · St. Barthélemy 4,2 ·
Wales 4,2 · Belize 3,6 · Nicaragua 3,2 · Guatemala 3,2 · Südgeorgien 3,1 ·
Brit. Jungferninseln 3,1 · Bhutan 2,9 · Bermuda 2,8 · Sint Maarten 2,4 ·
San Marino 2,2 · Amerikanisch-Samoa 2,1 · Kaimaninseln 2,0.

**0,5 bis 2 %:** Pitcairninseln 1,9 · Nördliche Marianen 1,9 · Mexiko 1,7 ·
Nordirland 1,6 · Paraguay 1,4 · Sambia 1,4 · Fidschi 1,3 · Montserrat 1,2 ·
Moldau 1,1 · Oman 1,0 · Kambodscha 1,0 · Montenegro 1,0 · Kroatien 0,9 ·
St. Helena 0,9 · Dominica 0,9 · Malta 0,8 · El Salvador 0,8 · Ägypten 0,7 ·
Falklandinseln 0,5 · Simbabwe 0,5.

**Die übrigen 213 liegen unter 0,5 %.**

## Shirt und Sweater, 69 mm

| Verlust | Motive |
|---|---|
| **unter 0,5 %** — ohne Weglassen stickbar | **173** (davon 105 mit exakt 0,00 %) |
| 0,5 bis 2 % | 28 |
| 2 bis 5 % | 20 |
| **über 5 %** — nicht stickbar, ohne etwas zu opfern | **32** |

Median **0,08 %**, schlechtestes **25,7 % (San Marino)**.

**Über 5 %:** San Marino 25,7 · Nicaragua 20,2 · Portugal 16,3 · Kambodscha 13,9 ·
Haiti 13,9 · Montenegro 13,0 · Argentinien 12,8 · Spanien 12,4 ·
Amerik. Jungferninseln 11,7 · Serbien 11,5 · Moldau 10,4 · Mexiko 10,4 ·
Mayotte 9,4 · Kaimaninseln 8,4 · Guatemala 8,4 · Turkmenistan 8,1 · Vatikan 8,1 ·
Ecuador 7,9 · Isle of Man 7,7 · Wales 7,7 · St. Barthélemy 7,2 · El Salvador 7,0 ·
Nördliche Marianen 6,9 · Belize 6,6 · Brit. Jungferninseln 6,6 · Südgeorgien 6,6 ·
Bhutan 6,4 · Amerikanisch-Samoa 6,3 · Andorra 6,2 · St. Helena 5,7 ·
St. Pierre & Miquelon 5,7 · Sri Lanka 5,5.

**2 bis 5 %:** Pitcairninseln 4,8 · Bermuda 4,6 · Iran 4,3 · Gibraltar 3,9 ·
Paraguay 3,8 · Brunei 3,8 · Montserrat 3,7 · Sambia 3,6 · Fidschi 3,3 ·
Liechtenstein 3,1 · Hongkong 2,8 · Dominica 2,8 · Nordirland 2,8 · Sint Maarten 2,8 ·
Afghanistan 2,7 · Ägypten 2,7 · Falklandinseln 2,3 · Simbabwe 2,3 · Costa Rica 2,1 ·
Malta 2,0.

## Was der Hoodie rettet

**Sieben Länder springen vom Ausschluss in die beste Gruppe** — am Shirt über 5 %, am
Hoodie unter 0,5 %: **Amerik. Jungferninseln, Andorra, Isle of Man, Mayotte,
Sri Lanka, St. Pierre & Miquelon, Turkmenistan**.

Die grössten Sprünge: San Marino 25,7 → 2,2 · Nicaragua 20,2 → 3,2 ·
Kambodscha 13,9 → 1,0 · Montenegro 13,0 → 1,0 · Amerik. Jungferninseln 11,7 → 0,1 ·
Moldau 10,4 → 1,1.

**Vier bleiben auch am Hoodie draussen:** Portugal, Haiti, Serbien, Spanien. Bei allen
vieren ist es das Wappen in der Flagge, nicht die Streifen.

---

## Was die Zahl nicht enthält

Das Skript zählt nur Farben, die **über 2 % der Motivfläche** einnehmen
(`--mindestanteil`). Alles darunter — Wappen, Schrift, Sterne, feine Embleme — fällt
aus der Rechnung: es wird weder als Verlust noch als heil gezählt. **Genau dieses
Feine ist aber das, was beim Sticken zuerst verloren geht.**

Nachgemessen, wie viel Fläche das ist: **Median 0,38 %, Mittel 1,23 %, grösster Wert
14,2 % (Falklandinseln)**. Bei **44 Motiven über 2 %**, bei **15 über 5 %**.

Rechnet man diese Fläche vollständig als Verlust dazu — die **obere Schranke**, also
der ungünstigste Fall:

| | Hoodie 166 mm | Shirt 69 mm |
|---|---|---|
| unter 0,5 % | 152 | 132 |
| 0,5 bis 2 % | 51 | 51 |
| 2 bis 5 % | 22 | 26 |
| über 5 % | 28 | 44 |

Schlechteste obere Schranke am Hoodie: Ecuador 16,4 · Mexiko 15,9 ·
Falklandinseln 14,7 · St. Barthélemy 13,0 · Belize 12,4.

**Die Wahrheit liegt zwischen beiden Tabellen.** Für eine Zusage an einen Kunden ist
die obere Schranke die ehrliche Zahl.

---

## Alt gegen neu — was die grobe Vorlage angerichtet hat

An denselben **196 Ländern**, beide Male 69 mm:

| | alt (Webdatei, 0,44 mm/px) | neu (EPS, 0,060 mm/px) |
|---|---|---|
| Median | 0,24 % | **0,06 %** |
| über 5 % | 26 | **20** |
| schlechtestes | 39,6 % | **25,7 %** |
| Farben je Motiv, höchstens | 15 | **10** |

**Der Fehler ging in beide Richtungen:** 114 Länder werden jetzt niedriger gemessen,
**36 höher**, 46 gleich. Die Vorlage war also nicht bloss zu vorsichtig — sie war
unbrauchbar.

Grösste Abweichungen nach unten: Afghanistan 16,7 → 2,7 · Sri Lanka 19,2 → 5,5 ·
Bhutan 18,1 → 6,4 · Senegal 10,3 → 0,0 · Saudi-Arabien 10,6 → 0,6 · China 8,8 → 0,1 ·
Aserbaidschan 7,4 → 0,0.

Nach oben: **Nicaragua 6,4 → 20,2 · Argentinien 0,1 → 12,8 · Haiti 6,3 → 13,9 ·
El Salvador 1,8 → 7,0 · Mexiko 5,4 → 10,4**. Argentinien stand in der alten Tabelle in
der **besten** Gruppe.

---

## Drei Grenzen, die die Grösse nicht aufhebt

1. **Die Nadel.** Unter rund 1 mm gibt es keinen Satinstich, Schrift braucht 4 bis
   5 mm Zeichenhöhe.
2. **Jede Farbe ist ein Fadenwechsel.** An den Druckdaten: **Median 3 Hauptfarben,
   höchstens 10** (Ecuador). Das ist deutlich weniger als die 18, die an den
   Webdateien herauskamen — auch das war ein Artefakt der groben Vorlage. Die Farben
   wechseln **innerhalb** eines Strichs; das bleibt Maschinenzeit.
3. **Die Stichmasse.** **9 498 mm²** Stickfläche am Hoodie, nach demselben Faustwert
   wie bisher (rund 1,5 Stiche je mm²) **etwa 14 000 Stiche**; Shirt 1 641 mm²,
   **etwa 2 500 Stiche**. Das ist eine grossflächige Stickerei auf der Brust — steif,
   schwer, und im Preis läuft die Stichzahl mit.

---

## Die Sammlung selbst

- **253 Motive** liegen als EPS vor, der Shop führt 252 Länder. Die frühere Notiz „196
  von 252 gemessen" ist damit erledigt — **es sind jetzt alle**.
- **Russland fehlt in der Sammlung** — weder EPS noch benanntes PNG. Nicht geprüft, ob
  das Absicht ist.
- **Mayotte liegt zweimal vor** (`Mayotte` und `Mayotte-FR`), als zwei verschiedene
  Motive. Die Zahlen oben nennen nur „Mayotte": 9,4 % am Shirt, 5 Farben. Die zweite
  Datei hat nur 3 Farben und **0,00 % an beiden Druckbreiten** — es ist also nicht
  dieselbe Flagge. Welche die gültige ist, ist nicht geklärt.
- Ein Motiv (Kopie 99) ist keinem Land zuzuordnen.

## Die Signature

Logo Black, Logo White und die einfarbigen Töne sind der **ideale** Stickfall: eine
Farbe, breite Striche, kein Detail. Das bunte Logo mit **Farbverlauf** lässt sich
nicht sticken.

## Was gegen Stick auf der Länderlinie spricht

**Stickerei bei Shirt-King gibt es ab 30 Stück je Motiv** (Website, gelesen
12.09.2026). Das ist **kein Print-on-Demand**, sondern eine Auflage. Für 252 Länder
hiesse das 252 Stickdateien und 252 × 30 Stück. **Für die Signature ist es erreichbar,
für die Länder nicht** — solange keine Vorbestellrunde läuft.

**Das ist und bleibt der harte Punkt.** Die Messung sagt jetzt, dass der Hoodie
technisch fast überall stickbar wäre; sie sagt nichts über die Mindestauflage.

## Garn

**Trilobales Polyester**, nicht Viskose. Viskose glänzt stärker, wird aber nach
mehreren Wäschen matt; Polyester hält Farbe, Wäsche, UV und Chlor und kommt trilobal
nah an denselben Glanz. Recherche, nicht gemessen.

## Was als Nächstes zu messen ist

1. Bei Shirt-King: **Stichpreis je 1 000 Stiche**, Kosten fürs Punchen, Garnreihen,
   und ob die 30 Stück je Motiv oder je Bestellung gelten.
2. **Ein Probestück** für eines der vier am Hoodie ausgeschlossenen Länder (Portugal,
   Haiti, Serbien, Spanien) — die Rechnung sagt „nicht ohne Weglassen", ein gestickter
   Musterlappen sagt, wie es aussieht.
3. Die beiden **Mayotte**-Dateien klären und das **unbenannte Motiv** (Kopie 99)
   bestimmen.

---

## Wo die Arbeitsdateien liegen

Ausserhalb des Repos, weil es 253 PNG mit 16 MB sind:

| | |
|---|---|
| `~/Documents/onefam-stickmessung/roh/` | die gerenderten EPS, mit Hintergrund |
| `~/Documents/onefam-stickmessung/motive/` | freigestellt, nach Land benannt — **darauf laufen die Messungen** |
| `~/Documents/onefam-stickmessung/messung-hoodie.txt` · `messung-shirt.txt` | die vollständigen Protokolle, Zeile je Land |
| `/tmp/hoodie.json` · `/tmp/shirt.json` | dieselben Zahlen als JSON |

**Am Werkzeug wurde etwas geändert:** `tools/motiv-messen.py` brauchte am 1 146-px-Bild
**5 min 20 s je Motiv** — 253 Motive mal zwei Druckbreiten wären über 40 Stunden
gewesen. Es nutzt jetzt scipy, wenn es vorhanden ist, und fällt sonst auf den reinen
numpy-Weg zurück. **Beide rechnen dasselbe**, am Motiv „Kopie 10" gegengerechnet:
2,07 % Verlust, 8 Farben, beide Male. Mit scipy: 6,7 s.

Dafür wurde lokal nachinstalliert: **Ghostscript** (Homebrew), **numpy** und **scipy**
für Python 3.9.
