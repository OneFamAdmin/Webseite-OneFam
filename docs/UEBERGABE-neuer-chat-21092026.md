# Übergabe für einen neuen Chat — Stand 21.09.2026

Einstiegsdokument. Wer hiermit anfängt, braucht keinen alten Chatverlauf mehr.
Zuerst lesen, dann `CLAUDE.md`, dann `docs/stand.md`.

Enthält zwei Stränge, die **getrennt** entstanden sind:

| Strang | Wo gearbeitet wurde | Inhalt |
|---|---|---|
| **A — Stickerei und Motive** | claude.ai-Projekt, 15.–17.09.2026 | Verfahren entschieden, alle 252 Motive als Stick-Fassung |
| **B — Shop, Brand-Site, Lieferant** | Claude Code auf dem Mac, 08.–14.09.2026 | Aufräumarbeiten, Bilder, PodOS-Befund, Nachricht an Shirt-King |

---

# A — Stickerei und Motive (Stand 17.09.2026)

## Die Entscheidung

**Ausschliesslich Stick.** Kein DTG, kein DTF, kein Print-on-Demand. Labi hat das
am 16.09.2026 festgelegt, weil die ersten Kunden den Ruf der Marke bestimmen.
Dazu **Drop-/Limited-Modell je Land mit Vorbestellung**.
→ `ENTSCHEID-nur-stick-und-stickereien-16092026` (im claude.ai-Projekt)

Alle **252 Motive** liegen als Stick-Fassung vor, vereinfacht auf **1,5 mm
Mindestbreite bei 8 cm Motivbreite**. **251 von 252** bestehen die Prüfung.
→ `PRODUKTION-stickfassung-1-5mm-alle-252-17092026`

## Die Kernzahlen zum Merken

- Die **Gesichtslinie ist auf allen 252 Motiven identisch**, 2,9–3,1 mm breit bei
  8 cm. **Das Gesicht ist nie das Problem.** Nur die Flaggenfärbung zerschneidet es.
- **Kennzahl:** Anteil der Motivfläche in Farbstücken unter 1,5 mm.
  **Schwelle stickbar = 12 %.** Technischer Bodensatz 7–8 %.
- **Ohne Änderung stickbar: 97 von 252.** → `LISTE-97-stickbar-korrigiert-16092026`
- **Mit 1,5-mm-Fassung: 251 von 252.**
- **Mit 1,0-mm-Fassung: nur 238 von 252** — deshalb 1,5 mm als einheitliche Regel.
  → `BEFUND-stickfassung-1-0-vs-1-5mm-alle-252-16092026`
- **Farbzahl nach Vereinfachung: median 3, max 8.** Wichtig für die Kalkulation,
  jeder Farbwechsel kostet.
- **Rohteilfarbe: Misty Grey passt zu 251 von 252 Motiven, Weiss nur zu 81.**
  → `BEFUND-rohteilfarbe-gegen-252-motive-15092026`
- **Seite → Land ist nicht ISO-alphabetisch. Nie rechnen, immer nachschlagen.**

## Offene Entscheidungen

1. **Kirgisistan (Seite 120).** Einziges Motiv, das die 1,5-mm-Regel nicht besteht
   (**18,6 %**; in der Messtabelle 16,8 %). Empfehlung **2,0 mm (5,0 %)**. Drei
   Varianten liegen im Paket.
2. **Stickbetrieb auswählen.** Angefragt ist bisher **niemand**. Kandidaten:
   massgestickt.de, paniho-shirt.de, stickbetrieb.de. Zu klären: **Punchkosten je
   Motiv, Stickkosten je Teil, Aufpreis je Garnfarbe, Mindestmenge, maximale
   Stickfläche**, und ob sie **Stanley/Stella** in den schweren Qualitäten beziehen.
3. **Rückfrage an Robert Koch (Shirt-King)** liegt entworfen, aber **ungesendet**.
   → `MAIL-ENTWURF-antwort-robert-15092026`
4. **Rohteilwechsel in PodOS** (Sparker 2.0 Heavy / Slammer 2.0) — nie ausgeführt,
   durch die Stick-Entscheidung überholt. Muss neu bewertet werden.
5. **Widerrufsrecht bei Vorbestellung** — juristisch offen, gehört zum Anwalt.
6. **Umsatzsteuer / Zoll** — `BEHOERDEN-stand-zoll-bazg-estv-01092026` bzw.
   `docs/behoerden-mwst-zoll.md`.

## Geprüft und verworfen

- **Lasergravur** (17.09.): kennt nur **eine** Tonstufe, die aus der Rohteilfarbe
  kommt. Damit wären alle 252 Motive dasselbe Bild.
  → `BEFUND-lasergravur-geprueft-16092026`
- **Konturgeschnittener Patch:** unmöglich, das Motiv besteht aus mehreren
  freihängenden Teilen. → `BEFUND-patch-varianten-detail-und-mengen-16092026`
- **DTF als Zwischenlösung:** von Labi ausdrücklich abgelehnt.

## Zwei Fehler aus diesem Durchgang, die sich nicht wiederholen sollen

1. **Nicht die dünnste Stelle messen, sondern den Flächenanteil.** Die erste Liste
   (63 Länder) sortierte Deutschland wegen eines 0,24-mm-Zipfels aus. Solche
   Splitter verschluckt die Stickerei. → `LISTE-63-direkt-stickbar-16092026`
2. **Vereinfachung und Messung immer in derselben Auflösung.** Gemischte
   Auflösungen ergaben Unsinn (Belgien angeblich 83 % zu dünn).

## Wo die Dateien liegen

**Im claude.ai-Projekt (bleibt erhalten):** alle Befund- und Entscheidungsdokumente
unter `claude/`, dazu `REFERENZ-seite-zu-land-alle-252`, `CODE-stickfassung-pipeline`
und `OneFam_stickfassung_10_vs_15mm.csv`.

**Jetzt auch im Repo auf dem Mac (21.09.2026 gesichert):**

| Datei | Inhalt |
|---|---|
| `docs/UEBERGABE-neuer-chat-21092026.md` | dieses Dokument |
| `docs/sicherungen/stickfassung-messwerte-252.csv` | **alle 252 Messwerte** in allen Stufen, zugleich die vollständige Seite→ISO→Land-Tabelle inklusive Gebiets-Markierung |
| `tools/stickfassung/` | der lauffähige Code (siehe unten) |

**NICHT gesichert — nur im Chat vom 17.09.:**
- Das Paket **`OneFam_Stickfassung_1-5mm_alle-252.zip`** (10,5 MB, 504 SVG- und
  PNG-Dateien). **Labi sollte es lokal sichern.** Geht es verloren, lässt es sich
  mit dem Code unten aus der Original-PDF in rund **25 Minuten** vollständig neu
  erzeugen — das Ergebnis ist **deterministisch**, also identisch.
- Die Vergleichsbilder (`san_marino_stickfassung.png`, `haertefaelle_10_vs_15mm.png`,
  `kirgisistan_sonderfall.png`, `laser_vs_farbe.png`, `patch_vs_stick.png`,
  `konturpatch.png`, `argentinien_sonne.png`). Inhaltlich sind sie in den
  Befunddokumenten beschrieben, die Bilder selbst sind nicht gesichert.

**Gute Nachricht, am 21.09. geprüft:** Die Originaldatei
**`~/Downloads/loco-motive_Logo_rgb_flags_final 2.pdf`** liegt auf dem Mac. Die
Neuerzeugung ist also jederzeit möglich.

## Seite → Land: die Regel

**Nicht berechnet, sondern geprüft.** Die Seitenreihenfolge ist **nicht**
durchgehend ISO-alpha-2-alphabetisch. Die Regel wurde an 99 Seiten einzeln an der
Flaggenkachel visuell kontrolliert, ohne Abweichung.

| Seiten | Inhalt |
|---|---|
| 1–76 | ISO-Position 1–76 (AD … GA) |
| 77–80 | England, Nordirland, Schottland, Wales (**nicht ISO**) |
| 81–194 | ISO 77–190 (GB … RS) |
| 195–234 | ISO 192–231 — **Russland (RU) fehlt in der Datei** |
| 235–246 | ISO 233–244 — **US-Aussengebiete (UM) fehlen** |
| 247 | Kosovo (**nicht ISO**) |
| 248–252 | ISO 245–249 (YE … ZW) |

**Wer stur „Seite = ISO-Position" rechnet, liegt bis zu vier Seiten daneben.**

Die vollständige Zuordnung aller 252 Seiten steht in
`docs/sicherungen/stickfassung-messwerte-252.csv` (Spalten `Seite;ISO;Land`), dort
zusammen mit den Messwerten.

## Der Code

Vollständig lauffähig, liegt als Dateien unter `tools/stickfassung/`:
`mapping.py`, `v2.py`, `produktion.py`, `lauf_alle.py`, `namen.py`.

**Voraussetzungen:** Originaldatei (252 Seiten), `pdftoppm` (poppler-utils),
Python mit `numpy opencv-python scipy scikit-image pillow`. Laufzeit rund
**25 Minuten** auf zwei Kernen.

**Ablauf:** `mapping.py` liefert Seite → ISO · `v2.py` enthält Vereinfachung
(`vereinfache`) und Messung (`messe`) · `produktion.py` stellt frei, schreibt PNG
und vektorisiert nach SVG · `lauf_alle.py` fährt alle 252 Seiten ab.

**Kennzahl:** `messe()` liefert den Anteil der Motivfläche, der in Farbstücken
unter 1,5 mm liegt. Schwelle „stickbar" = **12 %**, technischer Bodensatz 7–8 %
bei 150 dpi. **Vereinfachung und Messung immer in derselben Auflösung** — sonst
sind die Werte nicht vergleichbar. Bezugsgrösse ist durchgehend **8 cm
Motivbreite**: `ppm = Motivbreite_in_Pixeln / 80`, Radius = `min_mm * ppm / 2`.

**Am 21.09. ergänzt, damit der Code ohne Handarbeit läuft:**
`namen.py` (ISO → Ländername, 252 Einträge) und `iso.txt` (249 ISO-Codes) wurden
aus der Messwert-CSV erzeugt — `iso.txt` als Tabelle ohne die vier UK-Nationen und
Kosovo, dafür mit **RU** und **UM**, die in der PDF fehlen.

**Geprüft:** `python3 mapping.py` meldet **keine Abweichung an allen 99
Kontrollpunkten**. Die rekonstruierte `iso.txt` und die Seitenregel stimmen also.

**Lauf:** `cd tools/stickfassung && python3 lauf_alle.py` — die PDF wird über die
Umgebungsvariable `PDF` gefunden, voreingestellt auf den Pfad im Downloads-Ordner.
Ergebnis landet in `tools/stickfassung/stick15/`.

---

# B — Shop, Brand-Site, Lieferant (08.–14.09.2026, Claude Code auf dem Mac)

Alles Folgende ist **gemessen**, nicht geschätzt, und vollständig in
`docs/stand.md` dokumentiert. Hier nur die Kurzfassung.

## Aufgeräumt an der Brand-Site (08.09.2026, live)

- **Toter Link hinter dem Login behoben.** `/mein-bereich` zeigte eingeloggten
  **Käufern** eine Goldkachel „Reiseziel-Voting" mit Link auf `/reiseziel` — diese
  Route ist seit dem 20.07. gelöscht, der Link lief auf **404**. Sichtbar war er
  nur im Zustand `buyer`, deshalb fiel er nie auf. Von zwölf Fundstellen war das
  die einzige öffentlich erreichbare.
- **`/dev` und `/design` entfernt** (sechs Dateien; in Git bis Commit `8e37e8e`
  zurückholbar), dazu `middleware.ts` und `app/robots.ts` nachgezogen.
- **Sprache der präfixlosen Seiten berichtigt.** `/mein-bereich` und `/login`
  zeigten die **britische Flagge** und `<html lang="en">` über durchgehend
  deutschem Text. Jetzt `lang="de"`, kein Sprachumschalter mehr (es gibt dort
  nichts zu wechseln), Menü-Beschriftungen deutsch. `OHNE_SPRACHE` liegt dafür
  jetzt in `i18n/routing.ts` statt doppelt.

## Shop-Bilder: 61 von 407 entfernt (08.09.2026)

Schlecht erzeugte Modellbilder, auf Zuruf entfernt. **Dateien bleiben in der
Mediathek**, nur die Zuordnung zur Galerie wurde gelöst. Jede Galerie ist über
`docs/sicherungen/` vollständig zurückdrehbar.

| Land | vorher | entfernt | jetzt |
|---|---|---|---|
| Argentinien (Sweater 1963, Hoodie 1787, Shirt 2985) | 129 | 27 | 102 |
| Afghanistan (Shirt 3786, Hoodie 2566, Sweater 2668) | 141 | 15 | 126 |
| Andorra (Sweater 3888, Hoodie 3968, Shirt 3108) | 137 | 19 | 118 |

**Zwei Farben stehen seitdem ohne Modellbild da:** Afghanistan-Hoodie in **Weiss**
und Andorra-Shirt in **Anthracite**. Beide zeigen das Kleidungsstück freihängend.
Bewusst so — es werden keine neuen Bilder erzeugt.

**Falle für den nächsten Durchgang:** Die Galerie-Struktur ist **je Land
verschieden**. Argentinien hatte exakt 7 Ansichten je Farbe, Afghanistan und
Andorra zwischen 2 und 7. Wer die feste Positionstabelle blind überträgt, greift
auf Bilder zu, die es dort nicht gibt.

## Shop-Startseite neu bestückt (08.09.2026, live)

Beide Kachelreihen zeigten fast nur Schwarz. Jetzt acht verschiedene Bilder:

| Land | Reihe 1 (Länderkacheln) | Reihe 2 („Ausgewählte Länder") |
|---|---|---|
| Albanien | Mann · Schwarz · Hoodie | Frau · Weiss · Hoodie |
| Argentinien | Frau · Aqua Blue · Shirt | Mann · Mindful Blue · Sweater |
| Afghanistan | Mann · Rot · Sweater | Frau · Glazed Green · Shirt |
| Andorra | Frau · Viva Yellow · Hoodie | Mann · Rot · Hoodie |

Beide Reihen wechseln sauber Mann/Frau. Dazu der **Signature-Satz** neu, in allen
vier Sprachen: „**Ein Zeichen, kein Land. Wer es trägt, weiss warum — wer es
erkennt, gehört dazu.**"

**Fallen bei Snippet 11** (2,4 MB, „OneFam Seiten (Router v4 – final)"):
- Das Speichern antwortet **immer** mit Status 200 und **leerem Rumpf**. Das sagt
  nichts über den Erfolg. Belastbar sind nur **Zeichenlänge nach dem Neuladen**
  und die **ausgeloggte Live-Messung**.
- Bei **gleich langen** Ersetzungen ist die Zeichenlänge **kein** Nachweis.
- Im `feat`-Objekt (Position ~47 000–51 500) **positionsgenau** ersetzen: die
  Dateinamen kommen mehrfach vor, `fcard` steht 528× im Snippet.

## Preis-Wache sichtbar gemacht (08.09.2026)

**Neu: Snippet 109 „OneFam Preis-Wache: Ausgabe unter WooCommerce"**, aktiv, Scope
`admin`, erreichbar unter **WooCommerce → OneFam Preis-Wache**. Zeigt letzte
Prüfung, Zähler und Protokoll, mit Knopf zum Zurücksetzen. Reines PHP ohne
JavaScript (das Plugin schaltet Snippets mit JS sonst ab).

**Damit wurde der vierte Preis-Vorfall belegt:** 08.09., 20:35:54–20:36:24, 50
Variationen mit fortlaufenden IDs, ausschliesslich `onefam-white-logo-shirt`
(privat), Muster „**35 statt 40**" — der gerundete EUR-Preis landet im CHF-Feld.
**Snippet 108 hat alles zurückgestellt** (nachgemessen: 0 Abweichungen). Zähler
stand auf 367 und wurde nach dem Sichern zurückgesetzt.
→ `docs/sicherungen/preis-wache-protokoll-vor-reset-08092026.md`

**Wichtiger Nebenbefund:** Derselbe Sync hat die **Galeriebilder nicht angefasst**.
Keine der 61 entfernten Anhang-IDs kam zurück.

## PodOS: der Abgleich ist bewusst überholt (14.09.2026)

**Kernbefund, damit niemand wieder danach sucht:**

- `/admin/pool` meldet „**PodOS-API noch nicht konfiguriert**", es gibt **keinen**
  Sync-Knopf.
- In Vercel (`webseite-one-fam`) **existieren** `PODOS_API_KEY`, `PODOS_PROJECT`,
  `PODOS_API_BASE`, `PODOS_COST_FIELD`, alle „Production and Preview", angelegt
  **4. Juli**. Produktion ist Commit `4108140` vom 08.09., also **nach** dem
  Eintrag gebaut. Der Code liest seit dem ersten Commit exakt diese Namen.
  **Schluss: mindestens einer der Werte ist leer** (nicht einsehbar, geschützt).
- **Das ist kein verlorener Stand.** Am 04.07. war der Schlüssel noch bei Christian
  ausstehend, und die Entscheidung lautete: **mit Kosten warten, bis echte Werte
  da sind**. Am 01.09. wurden die Kosten dann **von Hand** hinterlegt
  (Migrationen `0010`–`0013`): **42 Einträge**, Quelle `kalkulation-20260807`,
  **Hoodie 30.17, Sweater 24.76, Shirt 14.12**, Pool-Anteil **10 %**.
- **Der Abgleich würde ohnehin nichts treffen:** Er schreibt nach **PodOS-SKU**,
  der Pool sucht nach **WooCommerce-`product_id`** — der Shop führt **keine
  einzige SKU**.
- **Er verschluckt Fehler:** `fetchProductCosts` fängt alles mit `catch { break; }`
  ab. Ein falscher Schlüssel ergibt „erfolgreich, nichts geschrieben", kein 401.
  **„Es passiert nichts" ist deshalb kein Befund.**
- **Überschreib-Risiko:** bei gleicher SKU ersetzt der `upsert` einen Handwert.

**Wer das je wieder anfasst**, nur sinnvoll wenn Kosten automatisch kommen sollen:
(1) Abgleich so umbauen, dass er Fehler meldet, (2) SKU-Zuordnung klären,
(3) **Private Secure Key** aus PodOS → Projects → Settings → **API Settings** in
Vercel eintragen und **neu bereitstellen**. Bis dahin ist nichts zu tun.

## Nachricht an HW-Christian (14.09.2026, gesendet)

Christian hatte am 14.09. nachgefragt, ob eine ältere Anfrage erledigt sei (drei
Punkte: laufender Zugang, API-Freischaltung, Retouren-Daten). **Antwort ist im
PodOS-Chat, Kanal `onefam`, als Antwort in seinem Faden gesendet:**

> Hallo Christian, danke fürs Nachfassen. Punkt 1 und 2 sind erledigt: Das Projekt
> läuft, und der API-Zugang ist freigeschaltet und hinterlegt. Zu Punkt 3 nur noch
> eine Frage: Erstattungen und Stornos bekommen wir bereits über WooCommerce. Uns
> interessieren nur physische Rücksendungen an euch. Gibt es dazu Daten über die
> API (in Orders oder Fulfillments?) oder ein Ereignis, das wir abonnieren können?
> Und falls ihr bei einer Rücksendung Produktionskosten gutschreibt: Wo sehen wir
> das? Die Detailseiten der API-Doku laden bei uns übrigens nicht, sie bleiben beim
> Ladekreis hängen. VG Labi

**Antwort steht noch aus.** Hintergrund: Die **Geldseite** der Retouren ist schon
gelöst — der WooCommerce-Webhook behandelt `refunded`, `cancelled`, `failed` und
bucht den Pool-Anteil automatisch zurück (`reversePoolForOrder`). Die PodOS-API
listet **20 Schnittstellen, keine für Retouren und keine Webhooks**; die
Detailseiten der Doku laden nicht, eine öffentliche Doku gibt es nicht.

## Druckverfahren-Recherche (08.09.2026)

In `docs/druck-und-lieferant.md` ergänzt: DTG/DTF-Zuordnung je Motivart und
**Printful als Alternative** (als **Recherchestand gekennzeichnet**, nicht
gemessen). **Durch die Stick-Entscheidung vom 16.09. ist dieser Strang überholt**
— die Nebenwirkungen eines Lieferantenwechsels bleiben aber lesenswert, besonders:
Ein Wechsel **verschiebt die Steuerfrage** (Ware startet dann nicht mehr in
Teltow), und **zwei Fulfiller parallel** auf denselben Preisfeldern wären genau
das Problem, das gerade eingefangen wurde.

---

# C — Zustand der Werkzeuge und des Repos (21.09.2026)

- **Zweig:** Dieser Ordner steht auf `claude/brave-ritchie-fwnlgw`, **nicht** auf
  `main`. Dort liegen **ungesicherte Änderungen einer anderen Sitzung** zur
  Stickerei (`docs/stick-und-druck-je-land.md` rund 370 Zeilen, `CLAUDE.md`,
  `tools/motiv-messen.py`) **plus** meine PodOS-Notiz in `docs/stand.md`.
  **Nicht committen, ohne die fremde Arbeit zu prüfen.**
- **`docs/stick-und-druck-je-land.md` ist der ältere Stand vom 12.09.** und kennt
  die 1,5-mm-Fassung **nicht**. Der 17.09-Stand steht in diesem Dokument.
- **Supabase-Werkzeug:** Am 14.09. lief **jede** SQL-Abfrage, auch `select 1`, in
  einen Verbindungs-Timeout, während die Live-Seite ihre Daten normal las. Ein
  Werkzeug-, kein Datenbankproblem.
- **Vercel-Logs** reichen im Hobby-Tarif nur **eine Stunde** zurück.
- **Nach dem Löschen einer Next-Route `rm -rf .next`**, sonst meldet `tsc` Fehler
  aus liegengebliebenen Typdateien.

---

# D — Was als Nächstes ansteht

1. **Stickbetrieb anfragen** (Punkt 2 oben) — der eigentliche Engpass. Ohne
   Stückpreise keine Kalkulation und kein Drop-Termin.
2. **Kirgisistan entscheiden** (2,0 mm) — eine Minute Arbeit, blockiert sonst die
   Vollständigkeit.
3. **ZIP lokal sichern** oder bewusst auf Neuerzeugung setzen (Code liegt jetzt im
   Repo, PDF ist da).
4. **Antwort von Christian** zu den Retouren abwarten.
5. **Anwalt:** Widerruf bei Vorbestellung.
6. **Offen aus Strang B:** Konstanz (Umsatzsteuer), Geschäftskonto bei zahls.ch,
   Ausführer-Vereinbarung.

**Was ausdrücklich NICHT mehr ansteht:** PodOS-COGS-Abgleich, DTF-Freischaltung,
Printful-Wechsel, Rohteilwechsel in PodOS. Alles durch die Stick-Entscheidung oder
durch die Handkalkulation überholt.
