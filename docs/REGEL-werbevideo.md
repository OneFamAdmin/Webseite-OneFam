# REGEL: Werbevideo — Higgsfield, Serie, Druckgrenze (28.09.2026)

Entstanden beim ersten Werbelauf für Albanien. Hier steht, was gemessen wurde
und was daraus folgt. Vollständige Bildregeln stehen weiter in
`RUNBOOK-laenderlauf.md`, die Rasterregeln in `REGEL-instagram.md`.

---

## Die Regel, aus der alles folgt

> ~~**Wo sich der Stoff bewegt, ist der Druck nicht zu sehen.
> Wo der Druck zu sehen ist, bewegt sich der Stoff nicht.**~~
>
> ⛔ **AM 28.09.2026 WIDERLEGT — siehe „Fassung v5" am Ende dieser Datei.**
> Die Regel war nie gemessen, nur behauptet. Seedance haelt den Druck.

**Warum.** `RUNBOOK-laenderlauf.md` §4 rechnet den Druck **nachträglich** ins
Standbild — mit Faltenlicht, Verdeckung und Stoffmelierung. Ein Standbild kann man
so rechnen, 150 Einzelbilder mit wanderndem Faltenwurf nicht. Wer ein fertiges
Standbild an Kling oder Seedance weitergibt, bekommt ein Motiv zurück, das das
Modell in **jedem Bild neu erfindet**. Bei Länderflaggen wird daraus Matsch.

**Daraus folgt der wichtigste Befund dieses Laufs:**

### Produktclips brauchen Higgsfield gar nicht

Die Kamerafahrt am Druck entlang wird mit **ffmpeg aus dem 4k-Standbild
gerechnet** (`zoompan`). Dann fasst kein Modell den Druck an, er bleibt
pixelgenau der gerechnete — und es kostet **0 Credits**.

Higgsfield wird nur dort gebraucht, wo **kein Druck und kein Gesicht** im Bild
ist: für die Ortsbilder.

---

## Die drei Bausteine — eine Dreierreihe je Land

Passt zur Rasterregel „In Dreierreihen denken" aus `REGEL-instagram.md`.

| | Baustein | Länge | Erzeugung | Credits |
|---|---|---|---|---|
| **A** | *The Comma* — Person frontal, ruhig, Stück getragen und unbewegt | 6–8 s | Standbild aus dem Länderlauf → Bild-zu-Video, nur Atem und Lidschlag | offen, noch nicht gebaut |
| **B** | *Two Places* — zwei Orte, gleiche Brennweite, harter Schnitt | 13 s | Text-zu-Video, **kein Druck, kein Gesicht** | 60 je Clip |
| **C** | *The Piece* — Fahrt am Druck entlang | 5 s | **ffmpeg aus dem Standbild**, kein Modell | **0** |

B ist der günstigste **und** der stärkste — kein Gesicht, kein Druck, kein Risiko.
Damit anfangen.

---

## Was gemessen wurde (28.09.2026, Albanien)

### Kosten

| | |
|---|---|
| Seedance 2.5, 5 s, 1080p, 9:16 | **60 Credits** je Clip (vorab mit `get_cost` geprüft) |
| Verbraucht im ganzen Lauf | **120** (6 072,73 → 5 952,73), also genau 2 × 60 |
| Baustein C | **0** |

### Helligkeit — die drei Clips passen ohne Farbkorrektur zusammen

Gemessen mit PIL am Einzelbild bei Sekunde 2,5:

| Clip | Mittel | Median | fast schwarz (< 32) |
|---|---|---|---|
| Tirana | **35,8** | 26 | 64,4 % |
| Zürich | **34,5** | 14 | 80,7 % |
| The Piece | **36,2** | 37 | 23,4 % |

> ⚠️ **`ffmpeg signalstats` taugt dafür nicht.** Dieselben Clips wurden über
> `signalstats,metadata=print:key=lavfi.signalstats.YAVG` mit **188,6 / 183,4 / 47,7**
> gemessen — bei fast schwarzen Bildern unmöglich. Die Zahl wurde beim Auslesen
> verfälscht. **Helligkeit am Einzelbild mit PIL messen**, nicht mit signalstats.

### Stofffläche des Albanien-Sweaters (3712 × 4608)

Zeilenweise abgetastet, Schwelle < 80 für Stoff, > 140 für helle Stellen:

| | |
|---|---|
| Stoff beginnt | y ≈ 600 (Schultern), x 1312–2320 |
| volle Breite ab | y 1000, x 688–2944 |
| **helle Stellen** | nur **oberhalb y 800** (Kragen, weisses Innenetikett) und **ab y 3200** |
| **saubere Zone ums Motiv** | **y 800–3100** — dort keine einzige helle Stelle |
| Motivmitte | x 1804, y 1624 |

Der Ausschnitt für Baustein C ist deshalb **1294 × 2300 ab (1157, 800)** — voll
innerhalb der Stofffläche, Kragen und Etikett draussen.

> **Zwei Anläufe waren nötig.** Der erste Ausschnitt (2110 × 3750 ab 749, 0) hatte
> weissen Hintergrund am linken Rand, der zweite noch Kragen und Etikett oben.
> **Erst messen, dann schneiden** — das spart den dritten Anlauf.

### Kamerafahrt, gültige Werte

```
crop=1294:2300:1157:800, scale=2160:3840:flags=lanczos
zoompan z 1,0 → 1,35 über 150 Bilder, Zentrum y 1920 → 1502
Ausgabe 1080 × 1920, 30 fps, 5 s
```

Zoom **1,35 und nicht mehr**: der Endausschnitt ist dann noch 958 Originalpixel
breit, also nur 1,13× hochskaliert. Bei Zoom 2,0 wird das Bild am Ende weich.
Vorskalieren auf das Doppelte (`scale=2160:3840`) ist gegen das Ruckeln von
`zoompan` nötig.

---

## Zwei Werkzeugfallen

1. **`drawtext` fehlt in diesem ffmpeg-Bau** (8.1.2, `/usr/local/bin/ffmpeg`).
   Textkarten werden stattdessen mit **PIL** gerendert und mit `overlay`
   aufgelegt.
2. **Die Markenschrift liegt nur als woff2** (`app/fonts/CabinetGrotesk-Variable.woff2`).
   PIL braucht TTF. Umwandlung mit `fontTools` (venv im Kratzverzeichnis):
   `f = TTFont(woff2); f.flavor = None; f.save(ttf)`. Achse `wght` 100–900,
   **Vorgabe 900 ist zu fett** — für Werbetexte 400–500 setzen
   (`font.set_variation_by_axes([500])`).

**Wortmarke nach Höhe skalieren** (Regel aus `CLAUDE.md`): Höhe 104 → Breite 500,
Verhältnis **4,808** gegen Soll 4,81. ✅

---

## Sprache und Inhalt

**Alles auf Englisch, und zwar als Textkarte, nicht als Sprache.** Das löst drei
Dinge auf einmal: Higgsfield muss kein Deutsch, es läuft ohne Ton, und es liest
sich in jedem Land.

Gültige Texte:

```
Where are you from?
Tirana.
And Zürich.
Clothing for people who belong to more than one place.
```

### ⛔ Was nicht hineindarf

* **Kein Wort über Travel Pool, Auswahl oder Jahreszyklus.** Der Trichter ist bis
  zur rechtlichen Freigabe geparkt, `/join` ist heute eine schlichte Warteliste.
  Werbung, die mehr verspricht als die AGB hergeben, ist der Fehler aus Regel 7.
* **Jede Gewinnspielsprache** — hier schärfer als auf der Seite, weil der
  erklärende Zusammenhang fehlt.
* Kein Countdown, kein Glow, keine Verläufe als Deko, kein Clublicht, kein „free".
* **`generate_audio: false` setzen.** Seedance schaltet Ton von sich aus an und
  erfindet Musik dazu.
* **Effekt-Presets ablehnen.** Higgsfield schlug für den dunklen Prompt das Preset
  „IN THE DARK" vor (`24bae836-2c4a-48e0-89b6-49fcc0b21612`). Presets sind
  Effekte, und Effekte sind ausgeschlossen. Mit `declined_preset_id` literal
  generieren.

---

## Die Prompt-Vorlage für Baustein B

Beide Orte bekommen **denselben Satzbau** — die Gleichheit der Form trägt den
Schnitt, der Unterschied liegt nur im Ort:

```
Static locked-off shot, 35mm lens, eye level. A narrow residential street in
<ORT> at dusk. <zwei ortstypische Bauteile>, one warm lit window. Deeply
desaturated, crushed blacks, near-monochrome with only a faint warm accent from
the window. Empty street, no people, no vehicles moving. No text, no signage,
no logos. Fine film grain, natural available light, locked tripod, no camera
movement.
```

**Das erleuchtete Fenster ist das tragende Element.** Es steht in beiden Bildern
an fast derselben Stelle und ist der einzige Farbakzent — dadurch sitzt der
harte Schnitt, ohne dass ein Übergangseffekt nötig wäre.

---

## Dateien

Ergebnisse liegen in `~/Downloads/onefam-werbung/albanien/` (**nicht im Repo** —
jeder Push nach `main` deployt).

| Datei | |
|---|---|
| `B_two_places_albania.mp4` | 13 s, 1080 × 1920 — Karte, Tirana, Zürich, Schlusskarte |
| `C_the_piece_albania.mp4` | 5 s — Fahrt am Druck entlang |
| `roh_tirana.mp4`, `roh_zurich.mp4` | die ungeschnittenen Seedance-Clips |
| `karte1_frage.png`, `karte3_schluss.png` | die Textkarten |

---

## Offen

* **Baustein A ist noch nicht gebaut** — er braucht ein Modellfoto aus dem
  Länderlauf und ist der einzige der drei, bei dem Gesicht **und** Druck zugleich
  im Bild sind. Dort greift die Regel oben am schärfsten.
* **Das Ortspaar ist eine Markenentscheidung.** Tirana / Zürich ist die Achse der
  Marke selbst (`onefam.ch`, Preise zuerst in CHF). Die grösste albanische
  Diaspora sitzt aber in **Italien und Griechenland**. Der Tirana-Clip ist
  wiederverwendbar — für einen zweiten Zielmarkt wird nur die zweite Hälfte
  getauscht. Das ist der Vorteil der Serie.
* **Vor dem Livegang gegenlesen lassen**, wie jeder Launch-Text
  (Sprachregel in `CLAUDE.md`).

---

## Nachtrag 28.09.2026 — die Fassung „Really from"

Labis Einwand gegen die erste Fassung war richtig und ist der wichtigste Befund
dieses Laufs:

> **Zwei dunkle Gassen mit warmem Fenster sind dasselbe Bild.**
> Wenn der Schnitt nichts unterscheidet, sagt er nichts.

Die erste Fassung hatte ausserdem **keinen einzigen Menschen** — derselbe Fehler,
der am 24.09.2026 auf der Startseite behoben wurde, im Video wiederholt.

### Orte unterscheidbar machen: Farbtemperatur, nicht Architektur

Gemessen am Einzelbild bei Sekunde 2 (PIL, RGB-Mittel):

| Clip | R | G | B | **R − B** |
|---|---|---|---|---|
| Tirana, warm | 58,3 | 43,1 | 31,7 | **+26,6** |
| Zürich, kalt | 46,9 | 70,6 | 87,2 | **−40,2** |

**67 Punkte Spanne.** Das liest jeder, auch wer die Städte nicht kennt.
Dazu je zwei unverwechselbare Bauteile im Prompt:

* **Tirana:** sozialistischer Plattenbau in Ocker/Terrakotta, Satellitenschüsseln
  über die Balkone, Wäscheleine, alter Mercedes, kahler Berg über der Dachkante.
* **Zürich:** Tramoberleitung und Schiene in nassem Asphalt, graue
  Kalksteinfassaden, blaues Emailschild, Winternebel.

### Der Text ist der Sprung, nicht das Bild

```
"Where are you from?"   "Zurich."   "No — where are you really from?"
Too Swiss for Albania.   Too Albanian for Switzerland.
So we made our own place.
```

Die Nachfrage ist der Moment, den jeder Zweitgenerations-Mensch kennt. **„really"
steht in Gold** (`#C9A84C`) — der einzige Farbakzent im ganzen Film, damit
regelkonform und zugleich die Betonung.

> ⚠️ **Markieren, nicht selbst entscheiden:** Der Film benennt eine
> Ausgrenzungserfahrung. Das ist Absicht und es ist die Selbstbeschreibung der
> Zielgruppe, kein Angriff. Labi gibt es bewusst frei oder nicht.

### Gesichter — die Falle beim Bewegtbild

Zwei Gesichter erzeugt, **eines unbrauchbar**:

| | Ergebnis |
|---|---|
| Mann | ✅ schwarzes Oberteil, frontal, hält den Blick, ein Lidschlag |
| Frau | ❌ **Blick gesenkt statt in die Linse**, beiges statt schwarzes Oberteil |

„Looks straight into the lens" im Prompt genügt nicht — Seedance senkt den Blick.
**Zwei Varianten je Gesicht einplanen**, oder mit einer Zeitmarke arbeiten, an der
die Augen offen sind.

Ersetzt wurde die Frau durch **dieselbe Aufnahme des Manns, 1,15× enger
beschnitten**. Das schliesst den Kreis („er stand die ganze Zeit da") und kostet
nichts. Ein gesenkter Blick am Ende wäre ausserdem Resignation — die Marke will
Haltung.

### Textauflage nie über das Zeichen

Erster Schnitt legte „So we made our own place." **genau über das Motiv** —
ausgerechnet im Bild, wo man es sehen soll. Textauflagen gehören nach unten
(`y = H − 300`), das Zeichen bleibt frei.

### Kosten dieses Laufs

4 Clips × 60 = **240 Credits** (5 952,73 → 5 712,73 erwartet). Schnitt, Karten und
Produktfahrt weiterhin **0**.

### Datei

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_20s.mp4` — 19,8 s,
1080 × 1920.

---

## Fassung v2, 28.09.2026 — vier Korrekturen von Labi

### 1. Schriften: beide, nicht eine

`app/globals.css` legt zwei fest, und **v1 hat nur eine benutzt**:

| | | wofuer im Video |
|---|---|---|
| **Cabinet Grotesk** | `--font-display` | Dialog und Aussagen („Too Swiss for Albania.") |
| **Satoshi** | `--font-body` | nur der Schlusssatz unter der Wortmarke |

**Die Wortmarke ist keine Schrift.** `onefam-wortmarke.svg` enthaelt
**einen `<path>` und kein `<text>`** — die Buchstaben sind zu Kurven eingefroren.
Damit laesst sich nur das Wort „onefam" setzen, kein Saetzchen. Sie bleibt Bild.

Beide woff2 werden mit `fontTools` nach TTF gewandelt. Achsen: Cabinet `wght`
100–900, Satoshi `wght` 300–900, **beide mit Vorgabe 900** — fuer Werbetexte
400–600 setzen.

### 2. Druck auf getragener Kleidung — geloest

Der Grund, warum v1 einen Pulli **ohne** Logo zeigte, ist mit einer Messung
weggefallen: **bewegte Bildflaeche im Portraetclip 1,6 %.** Der Brustbereich steht
still, also traegt ein **fester Overlay ueber alle 150 Bilder**.

Gerechnet wird wie `RUNBOOK-laenderlauf.md` §4, Bild fuer Bild:

```
f = clip((L+6)/(Lb+6), 0.55, 1.45)      # L = lokale Helligkeit, Lb = Median des Feldes
Ergebnis = Untergrund*(1-a) + clip(Motivfarbe*f, 0, 255)*a
```

Skript: `logo_auf_clip.py <clip> <ziel> <X> <Y> <Breite>`. Gueltige Werte:

| | X | Y | Motivbreite |
|---|---|---|---|
| Mann | 372 | 1105 | **160** (Lb = 11,0) |
| Frau | 352 | 1150 | **145** (Lb = 14,3) |

Motivbreite ≈ **16 % der Schulterbreite im Bild** — das entspricht den 6,9 cm
Druckbreite aus dem RUNBOOK. Quelle: `Transparent PNG Logo/Albania.png`,
4000 × 4000 mit Alphakanal, sichtbarer Bereich 2508 × 3050.

**Auf fast schwarzem Stoff bleibt nur das Rot stehen** — die schwarzen Linien des
Motivs versinken. Das ist physikalisch richtig und sieht auch so aus.

### 3. Die Frau gehoert hinein

`RUNBOOK-laenderlauf.md` schreibt „dieselben zwei Menschen ueber alle drei
Kleidungsstuecke" vor. In v1 war sie gestrichen statt ersetzt — falsch.

Zwei Varianten erzeugt, **die zweite ist brauchbar**. Der Prompt, der wirkt,
sagt es dreifach: „Her eyes stay open for the entire shot and stay locked on the
camera lens. She never looks down and never turns away. One single slow blink."

### 4. Bewegung — v1 hatte sie selbst wegprogrammiert

Der Prompt von v1 verbot Bewegung dreimal („no people", „no vehicles moving",
„no camera movement"). Ergebnis, gemessen als Anteil bewegter Bildflaeche:

| Clip | v1 | **v2** |
|---|---|---|
| Tirana | 0,4 % | **35,6 %** |
| Zuerich | **0,0 %** | **27,6 %** |

Zuerich war in v1 **buchstaeblich ein Standbild**.

Was die Bewegung bringt, ohne eine Regel zu brechen — die Rasterregel verbietet
**Menschen, die posieren**, nicht Menschen; und das Effektverbot meint Glow und
Countdown, keine Kamerafahrt:

* `Slow steady dolly movement to the right/left` statt `locked tripod`
* ein Mensch **von hinten**, der durchs Bild geht und nicht zurueckschaut
* das Tram, das durch Zuerich faehrt — es ist die Stadt selbst
* Waesche im Wind

### 5. Ton — Higgsfield kann hier keine Musik

> ⛔ **`generate_audio` ist ausschliesslich Sprache.** Die Musik- und
> Geraeuschmodelle (`sonilo_music`, `mirelo_text_to_audio`) sind laut Werkzeug
> **fuer die Spiele-Pipeline gesperrt** und duerfen nicht fuer eigenstaendigen Ton
> benutzt werden. Ein Musikstueck kommt also nicht aus Higgsfield.

Gebaut wurde stattdessen ein **selbst erzeugter Grundton** — damit lizenzfrei:

```
A1 55 Hz + 55,4 Hz (Schwebung) + E2 82,4 Hz, Tiefpass 220 Hz
Puls: 48 Hz, exponentiell gedaempft, alle 2,5 s, zweiter Schlag nach 0,34 s
beides schwillt ueber 14 s an, alimiter 0,89
```

Datei `ton_grundton_puls.m4a`. **Das ist ein Platzhalter, keine Musik.**

> ⚠️ **Rechtlicher Punkt, vor dem Schalten zu klaeren.** Instagrams Musikbibliothek
> ist fuer **organische** Reels lizenziert, fuer **Werbeanzeigen nicht**. Wer den
> Film als Ad schaltet, braucht eine eigene Lizenz. Dasselbe Muster wie bei den
> geloeschten Erfolgskurse-Videos: die Lizenz deckt nicht, was man annimmt.

### Kosten

4 Clips × 60 = **240** (5 712,73 → 5 472,73). Logo-Einrechnen, Schnitt, Karten und
Ton: **0**.

### Datei

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_20s_v2.mp4` — 19,6 s,
1080 × 1920, h264 + aac.

---

## Fassung v3, 28.09.2026 — zwei Korrekturen von Labi

### 1. ⛔ Der Brustdruck sitzt MITTIG, nicht auf Herzhoehe

**Am Mockup nachgemessen** (`OneFam_Albanien_Sweater_schwarz_Freihaengend_v2_4k.webp`,
Motiv ueber seinen Rotanteil gefunden):

| | |
|---|---|
| Motiv | x 1621–2018, y 1372–1875, Mitte x **1820** |
| Koerper auf Motivhoehe | x 499–3157, Mitte **1828** |
| **Versatz** | **−8 px = −0,3 % der Koerperbreite** |

**Also mittig.** In v2 sass das Motiv auf „Herzhoehe" links — das war eine
Annahme aus der Bekleidungswelt, **nicht das OneFam-Produkt**. Bei der Frau lag
es rund **200 px** neben ihrer Koerperachse.

> **Regel:** Das Motiv sitzt auf der **Koerperachse**. Die Achse wird gemessen,
> nicht geschaetzt — die Person steht selten in der Bildmitte.

Gueltige Werte fuer die Albanien-Portraets (1080 × 1920):

| | Koerperachse | X (= Achse − Breite/2) | Y | Motivbreite |
|---|---|---|---|---|
| Mann | **425** | 345 | 1105 | 160 |
| Frau | **625** | 552 | 1160 | 145 |

**Wie die Achse gefunden wurde:** Helligkeitsschwerpunkt schlaegt fehl (faengt das
Fenster mit ein), Hauttonmaske schlaegt beim Mann fehl (sein Bild ist praktisch
schwarzweiss, R ≈ G ≈ B). Was funktioniert: **Raster ueber das aufgehellte
Standbild legen und ablesen.** Bei zwei Bildern schneller als jede Heuristik.

### 2. „Too Swiss for Albania" hat niemand verstanden

**Labi — selbst die Zielgruppe — ist an dem Satz gescheitert.** Das ist das
haerteste Testergebnis, das es gibt: wenn die Zielperson stolpert, stolpern alle.

**Warum er nicht funktioniert:** Ueber dem Albanien-Bild steht „Too **Swiss** for
Albania". Man sieht Albanien, liest „Swiss" und muss rueckwaerts denken. Bei 3,5
Sekunden je Karte liest niemand zweimal.

**Gueltige Fassung — Ort zuerst, dann die Pointe** (von Labi gewaehlt):

```
BILD Tirana     In Albania,
                I'm the Swiss one.

BILD Zuerich    In Switzerland,
                I'm the Albanian one.

BILD Zeichen    So we made
                our own place.
```

Der Text nennt denselben Ort, den das Bild zeigt. Kein Rueckwaertsdenken.

> **Merksatz:** Bild und Text muessen **denselben** Ort nennen. Eine Konstruktion,
> die den Zuschauer gegenrechnen laesst, ist im Reel verloren.

### Was Labi gut fand

**Der Puls.** Der selbst erzeugte Grundton bleibt unveraendert.

### Datei

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_20s_v3.mp4` — 19,6 s.
**Keine neuen Credits** (5 472,73 unveraendert): nur Neuberechnung und Schnitt.

---

## Fassung v4, 28.09.2026 — warum der Druck auf KI-Menschen nicht geht

### Die Messung, die den Versuch beendet

Am Mockup auf der Mittelachse abgetastet:

| | |
|---|---|
| Kragen-Unterkante | y 544 |
| Saum | y 3959 |
| Rumpflaenge | 3415 |
| Motivmitte | y 1624 = **31,6 % der Rumpflaenge unter dem Kragen** |

Auf die Videoportraets uebertragen (1080 × 1920):

| | Kragen | Motivmitte muesste liegen bei | gesetzt war sie bei |
|---|---|---|---|
| Mann | y 970 | **y 1745–1865** | y 1202 |
| Frau | y 1085 | **y 1860–1980** | y 1248 |

**Das Bild endet bei y 1920.** Bei der Frau liegt die richtige Stelle teils
**ausserhalb des Bildes**. In einer Brustaufnahme dieser Naehe kann der Druck
nicht richtig sitzen — er landet zwangslaeufig direkt unter dem Kragen.

> **Regel:** Der Druck gehoert nur dort ins Bild, wo **der ganze Rumpf** zu sehen
> ist. In einer Nahaufnahme traegt die Person ein einfarbiges Teil ohne Motiv.
> Das Produkt kommt aus dem Mockup.

### Mockups freistellen — das Rezept

Quelle: `~/Downloads/OneFam Mockups/_neu/OneFam_Albanien_<Teil>_<Farbe>_Freihaengend_v2_4k.webp`
(3712 × 4608, **28 Farbvarianten** ueber Hoodie, Sweater und Shirt).
Die 1000 × 1000-Mockups aus `Albania ( Hoodie + Sweater + Shirt )` sind flach
und **nicht** zu verwenden.

Die Dateien haben **keinen Alphakanal**, der Grund ist weiss:

```python
hell  = rgb.min(axis=2)                  # weisser Grund: alle Kanaele hoch
alpha = clip((248 - hell) / 22.0, 0, 1)  # weicher Uebergang statt harter Kante
alpha = GaussianBlur(alpha, 1.2)         # gegen Treppchen
```

Ergebnis auf `#0A0A0A` gesetzt: keine weissen Kanten, Teil bedeckt 52,6 % der
Flaeche. **Schwarze Teile verschwinden auf Markenschwarz** — fuer den Film
Anthracite, Red, GreenBay oder FrenchNavy nehmen.

Produktmoment: Teil auf eine 9:16-Leinwand in `#0A0A0A` setzen, Fahrt
`zoompan` 1,00 → 1,11 ueber 2,8 s. Text **unten**, das Teil bleibt frei.

### Musik — der Grundton war zu duenn

Labi: der Herzschlag ist gut, der Grundton „total lame". Higgsfield liefert keine
Musik (`sonilo_music` = „Game pipeline only", nachgeprueft ueber `models_explore`),
also selbst gebaut — jetzt mit **Akkordfolge statt Dauerton**:

```
Am (0–5,2) -> F (5,2–8,7) -> C (8,7–12,2) -> G (12,2–15,0) -> C (15,0–20,4)
```

Moll nach Dur, Ankunft auf C genau bei „So we made our own place".

* **Pad:** drei verstimmte Saegezahnstimmen je Akkordton (±0,15 Hz)
* **Bass:** Grundton plus Oktave
* **Arpeggio:** Pluck mit `exp(-7,5t)`, Schritt 0,3125 s, **kommt erst ab Sek. 4,6 dazu**
* **Tiefpass oeffnet sich** ueber den Film von 420 Hz auf 3000 Hz
* **Herzschlag unveraendert** — 48 Hz, alle 2,5 s, zweiter Schlag nach 0,34 s
* Hall ueber Faltung mit exponentiell abfallendem Rauschen (0,26 s)

Nachgemessen, der Bogen stimmt:

| Sekunde | Pegel | tief | mitte | **hoch** |
|---|---|---|---|---|
| 0 | 0,42 | 38 % | 52 % | **9 %** |
| 12 | **0,84** | 39 % | 49 % | 11 % |
| 18 | 0,50 | 15 % | 61 % | **24 %** |

Der Klang oeffnet sich messbar nach oben, waehrend der Pegel wieder zurueckgeht.
Skript: `musik.py` im Kratzverzeichnis. Braucht `numpy` und `scipy`.

### Datei

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_v4.mp4` — 19,9 s.
Dazu `ton_akkorde_puls.wav` und vier freigestellte Mockups.
**Keine neuen Credits** (5 472,73 unveraendert).

---

## Fassung v5, 28.09.2026 — die Grundregel dieser Datei war falsch

**Labi:** „wieso nimmst du nicht die mockups die freistehenden und laedst sie in
higgsfield hoch und generiest so die videos"

**Er hatte recht.** Die Regel ganz oben („wo sich der Stoff bewegt, ist der Druck
nicht zu sehen") stand seit dem ersten Lauf in dieser Datei und war **nie
nachgemessen** — ein Verstoss gegen Arbeitsregel 2.

### Der Versuch

Freigestelltes Mockup auf `#0A0A0A`, 1080 × 1920 JPEG, ueber `media_upload`
hochgeladen (presigned PUT, dann `media_confirm`). Dann Bild-zu-Video:

> ⚠️ **`seedance_2_5` braucht `mode: "omni_reference"`.** Ohne das antwortet der
> Server mit 422: „mode 't2v' does not accept reference media; start_image and
> end_image are only allowed for mode 'omni_reference'". Die fehlgeschlagene
> Einreichung kostet **nichts**.

### Das Ergebnis: der Druck haelt

Drei Clips, Motiv bei Sekunde 0,1 / 2,5 / 4,8 vergroessert verglichen:

| Clip | bewegte Flaeche | Druck |
|---|---|---|
| Push-in anthrazit | **49,2 %** | **unveraendert, scharf** |
| Drehung anthrazit | 15,1 % | **unveraendert, scharf** |
| Push-in rot | 43,7 % | **unveraendert, scharf** |

Zickzack-Kante, Augenlinien und Nase bleiben ueber die ganze Bewegung erhalten.
Selbst bei fast 50 % bewegter Bildflaeche wird nichts neu erfunden.

**Die Formulierung im Prompt, die das traegt:**

```
The printed graphic on the chest stays exactly as it is, unchanged, sharp,
never distorted, never redrawn.
```

### Was daraus folgt

* **Produktclips kommen aus Higgsfield, nicht aus ffmpeg.** Die gerechnete
  `zoompan`-Fahrt bleibt der kostenlose Notnagel, ist aber die schwaechere Bildidee.
* **Das Einrechnen des Logos auf KI-Menschen ist ueberfluessig geworden** —
  zusammen mit dem Befund aus v4 (richtige Druckstelle liegt bei Nahaufnahmen
  ausserhalb des Bildes) heisst das: **Produkt immer aus dem Mockup.**
* Die 28 freigestellten Farbvarianten sind damit 28 moegliche Clips.

### Ton — der letzte ungepruefte Weg

`generate_audio: true` auf einem Seedance-Clip **erzeugt tatsaechlich eine
Tonspur** (5,1 s, 32 kHz, stereo, Spitzenpegel 0,45). Ob es Musik oder
Umgebungsgeraeusch ist, laesst sich aus dem Spektrum nicht entscheiden —
**das muss jemand hoeren.** Probe: `TONPROBE_higgsfield.mp4`.

> **Offen und ehrlich:** Selbst gebaute Synthese klingt nach Synthese. Wenn die
> Tonprobe nichts taugt, bleiben nur zwei Wege: **Instagrams Musikbibliothek**
> (nur fuer organische Reels lizenziert) oder eine **gekaufte Lizenz**
> (Epidemic Sound, Artlist, Musicbed) fuer Anzeigen.

### Kosten

3 Produktclips + 1 Tonprobe = **215 Credits** (5 472,73 → 5 257,73).
Die drei abgelehnten 422-Einreichungen kosteten nichts.

---

## Fassung v6, 28.09.2026 — das Mockup als Referenz, nicht als Bild

**Labi:** „du sollst nicht die mockups einzeln zeigen du sollst sie seedance
sagen das die person im klip das anhat."

Der Unterschied ist die **Rolle** des hochgeladenen Bildes:

| Rolle | Wirkung |
|---|---|
| `start_image` | das Mockup **ist** das erste Bild — ein Produktclip (v5) |
| **`image_references`** | das Mockup ist **Vorlage** — der Mensch im Clip **traegt** das Teil |

**Das ist der Weg.** Mann und Frau tragen den Albanien-Sweater, das Motiv sitzt
mittig auf der Brust, in richtiger Groesse, ohne dass irgendetwas nachtraeglich
eingerechnet wird. Damit ist das ganze Logo-Einrechnen aus v2 bis v4 hinfaellig.

### Was im Prompt stehen muss

```
He is wearing the exact dark grey crew-neck sweatshirt from the reference image,
with the same printed graphic on his chest, unchanged, same size, same position,
same colours, sitting centred on his chest. His whole upper body and the print
are fully visible inside the frame, nothing cropped.
```

Zwei Teile davon sind entscheidend:

1. **„sitting centred on his chest"** — sonst wandert das Motiv.
2. **„whole upper body ... fully visible, nothing cropped"** — sonst waehlt das
   Modell eine Nahaufnahme, und dann liegt die richtige Druckstelle wieder
   ausserhalb des Bildes (der Befund aus v4).

### Ausbeute

Vier Generierungen, **drei brauchbar** (ein Mann-Clip lief noch). Gewaehlt:
Mann-Variante 1 und Frau-Variante 2. Die Frau-Variante 1 liegt als Reserve dabei.

### Der Film

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_v6.mp4` — 20,0 s.

| Zeit | Bild | Text |
|---|---|---|
| 0–1,8 | Mann, traegt den Sweater | „Where are you from?" |
| 1,8–3,0 | derselbe | „Zurich." |
| 3,0–5,2 | derselbe | „No — where are you **really** from?" |
| 5,2–8,7 | Tirana, warm | In Albania, I'm the Swiss one. |
| 8,7–12,2 | Zuerich, kalt | In Switzerland, I'm the Albanian one. |
| 12,2–15,0 | Frau, traegt den Sweater | — |
| 15,0–17,6 | Produkt, Drehung | So we made our own place. |
| 17,6–20,0 | Wortmarke | Clothing for people who belong… |

Ton: die Akkordfassung mit Herzschlag. **Bleibt der offene Punkt** — siehe v5.

---

## Fassung v7, 28.09.2026 — Druckgroesse und Ton aus Higgsfield

### Der Druck war 2,5-fach zu gross — und der Prompt steuert das nicht

Gemessen an Standbildern (Druckbreite gegen Koerperbreite auf Motivhoehe):

| | Anteil |
|---|---|
| Mockup (Soll) | **15,0 %** |
| Traegerclip v6 | **38,4 %** |

**Prompt-Anweisungen helfen nicht.** „The chest print is SMALL and discreet,
about the width of a hand's palm, no wider than one sixth of his chest" brachte
383 → 339 px, also praktisch nichts — das Modell nimmt die Groesse aus dem
**Referenzbild**, nicht aus dem Text.

### Was wirkt: das Referenzbild vorverkleinern

Weil Seedance den Druck um rund Faktor 2,5 vergroessert, wird er im Referenzbild
vorher verkleinert:

1. Vorhandenes Motiv im Mockup **mit Stofffarbe ueberdecken** — Median der Raender
   oberhalb und unterhalb, dann `GaussianBlur(9)` fuer den Uebergang.
2. Motiv **auf 160 px statt 399 px** neu setzen (6,0 % statt 15,0 % der
   Koerperbreite), an der gemessenen Motivmitte x 1820 / y 1624.
3. Faltenlicht nach `RUNBOOK` §4 einrechnen, freistellen, 9:16, hochladen.

**Ergebnis:** klein und beilaeufig, wie das echte Produkt.
Referenzbild: `referenz_kleiner_druck.jpg`.

> ⚠ **Noch offen:** Auf dem Produktclip am Schluss hat der Druck weiterhin
> **Originalgroesse** (das freistehende Mockup ist ja korrekt). Neben den Traegern
> mit dem verkleinerten Druck ist das ein Bruch. Entweder den Produktclip aus
> derselben kleinen Referenz neu erzeugen, oder die Traeger etwas groesser —
> **Labis Entscheidung.**

### Ton kommt doch aus Higgsfield

`generate_audio: true` auf einem **20-Sekunden**-Clip liefert 20 s Ton am Stueck.
**Eine 20-s-Generierung kostet dieselben 60 Credits wie eine 5-s** (mit `get_cost`
vorab geprueft) — bei 480p ist das der guenstigste Weg zu einer Tonspur.

Zwei Fassungen erzeugt, beide mit Aufbau:

| | Laenge | Anfang → Ende | tief am Anfang → am Ende |
|---|---|---|---|
| **Ton A** (Tirana-Hof) | 20,1 s | 0,21 → 0,33 | — |
| **Ton B** (leerer Raum) | 20,1 s | **0,15 → 0,37** | **49 % → 22 %** |

**Ton B liegt im Film**, Ton A als zweite Fassung daneben
(`REALLY_FROM_albanien_v7_tonA.mp4`).

Der Prompt, der das erzeugt — das Bild ist Nebensache, der Musikteil traegt:

```
A slow cinematic instrumental score plays over the whole scene and builds across
twenty seconds: deep sustained strings and a low heartbeat pulse at the start,
a lone piano note pattern entering, warm low brass swelling gently in the last
third, resolving into calm. Restrained, never loud, melancholic turning hopeful.
No vocals, no speech, no ambient room noise, only the music.
```

Wichtig sind die Ausschluesse: **„no ambient noise, only the music"** — sonst
liefert Seedance Strassengeraeusch statt Musik.

> Damit ist die selbst gebaute Synthese (v4, `musik.py`) **ueberholt**. Sie bleibt
> als Notnagel im Kratzverzeichnis.

### Datei

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_v7.mp4` — 20,0 s.

---

## Fassung v8, 28.09.2026 — Produktclip aus derselben Referenz

Der Bruch aus v7 ist behoben: der Schlussclip kommt jetzt aus **demselben
Referenzbild** wie die Traeger, der Druck ist ueberall gleich gross.

### Die Falle: eine grobe Retusche wandert ins Video

Der erste Versuch zeigte im fertigen Clip **ein dunkles Rechteck um den Druck**.
Ursache: meine Retusche im Referenzbild. Bei `start_image` uebernimmt Seedance das
Bild **unveraendert** — jeder Fehler darin landet im Video. Bei
`image_references` faellt es nicht auf, weil das Kleidungsstueck ohnehin neu
gezeichnet wird.

**Erster, untauglicher Versuch:** Feld mit dem Median der Raender fuellen und
`GaussianBlur(9)`. Der Stoff hat einen Helligkeitsverlauf — eine Einheitsfarbe
setzt sich als Fleck ab. Dazu war das Feld (x 1580–2060, y 1330–1920) mit einem
weichen Rand von 70 px **zu knapp**: der Uebergang lag noch ueber dem alten Motiv
(x 1621–2018), sodass blasse Reste durchschienen.

**Gueltiges Rezept:**

```
Feld   x 1490–2150, y 1240–2010      # deutlich groesser als das Motiv
Quelle a[y1+30 : y1+30+h, x0:x1][::-1]   # Stoff von DARUNTER, vertikal gespiegelt
       skaliert auf die mittlere Helligkeit ueber dem Feld
Maske  Abstand zum Rand / 90, geklemmt auf 0..1   # weicher Rand AUSSERHALB des Motivs
dann   GaussianBlur(3.0), zu 60 % eingeblendet
```

Kontrollen, die beide bestanden werden muessen:

| Pruefung | Ergebnis |
|---|---|
| Rote Reste des alten Motivs | **0 Pixel** |
| Reparierter Bereich gegen Umfeld | 75,4 gegen 77,2 → **Abweichung 1,8** |
| Im fertigen Clip: Stoff neben dem Druck gegen Stoff weiter weg | 74,8 gegen 71,9 → **Abweichung 3,0** |

Motivbreite im Referenzbild: **170 px** (Original 399).

### Datei

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_v8.mp4` — 20,0 s,
Ton B. Dazu `produkt_kleiner_druck.mp4` und `referenz_kleiner_druck.jpg`.

---

## Fassung v9, 28.09.2026 — ⛔ NIE ein retuschiertes Referenzbild

**Labi:** „man sieht einen rechteckigen hochkant anthrazit Kasten und dann das
Logo dort hinterlegt … das sieht man eindeutig, dass das billig eingearbeitet
wurde. Ausserdem ist das Motiv viel zu klein."

Beide Fehler kamen aus **derselben Ursache**: meinem selbst retuschierten
Referenzbild. Der Kasten war die Retusche, und die 170-px-Verkleinerung war eine
Ueberkorrektur auf Grundlage einer **falschen Messung**.

> ⛔ **Regel: Referenzbilder werden nicht retuschiert.** Jede Reparatur am Stoff
> ist im Video sichtbar. Wenn die Druckgroesse nicht stimmt, wird ein **anderes
> echtes Bild** als Referenz genommen, nie ein bearbeitetes.

### Die Loesung: das echte Traegerfoto als zweite Referenz

`public/assets/traeger-albanien.webp` (1200 × 1500) — das Foto aus dem Abschnitt
„Die Stuecke" der Startseite. Ein echter Mensch, echtes Teil, Druck in der
Groesse, **die Labi auf der eigenen Seite verwendet.**

Zwei `image_references` zusammen:

| | Rolle |
|---|---|
| Anthrazit-Mockup (unretuschiert) | Farbe, Schnitt, Motivzeichnung |
| **Traegerfoto** | **Groesse, Hoehe und Sitz des Drucks auf einem Menschen** |

Dazu im Prompt, gegen den Kasten:

```
The print sits directly on the fabric with no box, no panel, no patch and no
rectangle of different colour behind or around it.
```

**Ergebnis:** Druck direkt auf dem Stoff, Stoffstruktur laeuft durch, richtige
Groesse, kein Kasten. Der Produktclip kommt wieder aus dem **unretuschierten**
Mockup.

### Und noch etwas: die automatische Groessenmessung war unbrauchbar

Die Werte „38,4 %" und „5,5 %" stammen aus einer Rot-Maske gegen eine ueber
Helligkeit geschaetzte Koerperbreite. Diese Schaetzung hat wiederholt Fenster und
Hauttoene mitgezaehlt — beim Traegerfoto kam **95,4 %** heraus, was offensichtlich
Unsinn ist. **Druckgroessen nicht automatisch messen.** Entweder ein Raster ueber
das aufgehellte Standbild legen und ablesen, oder gleich am Bild entscheiden.

### Datei

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_v9.mp4` — 20,0 s,
Ton B. Dazu `traeger_mann_final.mp4` und `traeger_frau_final.mp4`.

---

## Fassung v10, 28.09.2026 — die richtigen Bilder lagen im Shop

**Labi:** „es gibt vom shop viel bessere mockups als wo du sie her hast das sind
die alten."

Richtig. `~/Downloads/OneFam Mockups/_neu/` ist ein **alter Stand**. Die aktuellen
liegen in der Shop-Mediathek und sind ohne Anmeldung zu holen:

```
https://shop.onefam.ch/wp-json/wc/store/v1/products?search=albania&per_page=5
```

Das liefert je Produkt die Bild-URLs. Fuer den Albanien-Sweater (alle 3712 × 4608):

| Datei | was es ist |
|---|---|
| `OneFam_Albanien_Sweater_schwarz_Freihaengend_4k-1.webp` | freihaengend, sauber |
| `..._Mann_frontal_4k.webp` | **echtes Modellfoto, Teil getragen** |
| `..._Frau_frontal_4k.webp` | dito |
| `..._{Mann,Frau}_{Huefte,Taschen}_4k.webp` | weitere Ansichten |

> **Regel: Bildmaterial immer aus dem Shop holen, nie aus den lokalen Ordnern.**
> Die Store-API ist die einzige Quelle, die den aktuellen Stand fuehrt.

### Der weisse Rand — Freistellen ganz vermeiden

Der Halo kam von meinem Freistellen ueber eine Helligkeitsschwelle. **Nicht
freistellen.** Stattdessen das Original mit hellem Studiogrund als Referenz geben
und den Hintergrund **im Prompt** ersetzen lassen:

```
The studio background is replaced by a deep even black void that fills the entire
frame edge to edge, with no seam, no outline, no white halo and no cut-out edge
anywhere around the garment.
```

Gemessene Bildraender danach: **2,7 / 9,6 / 10,2** (Markenschwarz ist 10) — keine
helle Kante.

### Die Frau: „androgyn" war ein Prompt-Problem

Gegen den Standardfehler helfen ausdruecklich weibliche Merkmale statt nur einer
Altersangabe: „a soft oval face, clearly feminine features, arched dark brows,
full lips, long black hair worn loose over one shoulder, small gold hoop
earrings". Dazu das **Frau-Modellfoto aus dem Shop** als Referenz.

### Schrift: Outfit statt Cabinet Grotesk

`~/Downloads/One Fam Fonts/Outfit (1)/Outfit-VariableFont_wght.ttf`, Achse `wght`
100–900, **Vorgabe 100** — fuer Werbetexte 500–600 setzen. Geometrisch wie die
Wortmarke, aber deutlich eigenstaendig gegenueber der Website.

> ⛔ **`newyork/NewYork PERSONAL USE.otf` darf nicht in Werbung verwendet werden.**
> „PERSONAL USE" schliesst kommerzielle Nutzung aus. Wo sie im Einsatz ist, gehoert
> sie geprueft und ersetzt.

### Datei

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_v10.mp4` — 20,0 s,
Ton B, Texte in Outfit. Kosten dieses Durchgangs: **180 Credits**.

---

## Fassung v11, 28.09.2026 — Bewegung, Textlage, weiche Uebergaenge

### Menschen duerfen sich bewegen — der Druck haelt trotzdem

In v10 standen beide praktisch still. Gemessen als Anteil bewegter Bildflaeche:

| | v10 | **v11** |
|---|---|---|
| Mann | 0,2 % | **4,7 %** |
| Frau | 0,6 % | **3,8 %** |

Was im Prompt dafuer sorgt — Bewegung **benennen, aber begrenzen**:

```
He is alive but calm: he breathes visibly, his shoulders rise and settle, he
shifts his weight slightly from one foot to the other, he turns his head a few
degrees and comes back, and he blinks twice slowly. He never smiles, mouth stays
closed, and his eyes return to the lens each time.
```

Der Zusatz **„his eyes return to the lens each time"** ist wichtig: ohne ihn
wandert der Blick ab und der Moment geht verloren.

### Textlage bei Portraets

Der Dialogtext sass am unteren Rand (y 1590) und wirkte abgesetzt. Jetzt **y 1430**
— das ist die hoechste Lage, die moeglich ist: der Brustdruck reicht bis etwa
y 1400, darueber wuerde der Text ihn verdecken.

> Bei Ortsaufnahmen (leere Fassade) steht der Text mittig auf `H/2 − 110`. Bei
> Portraets geht das **nicht** — dort ist die Bildmitte der Druck.

### Weiche Uebergaenge nur am Schluss

Harte Schnitte im Hauptteil bleiben. Am Ende zweimal `xfade`:

```
Frau -> Produkt      xfade=transition=fade:duration=0.8:offset=2.4
Produkt -> Wortmarke xfade=transition=fade:duration=0.5:offset=5.1
```

Jeder `xfade` verkuerzt den Film um seine Dauer — die Musik (20,1 s) deckt das ab.

### Datei

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_v11.mp4` — 19,4 s.
Kosten: **120 Credits**.

---

## Fassung v14, 29.09.2026 — Stillstand, Schlussaufbau, Herzschlag

### Bewegung: benennen reicht nicht, sie muss VERBOTEN werden

In v11 „lebte" der Mann — aber er trat zur Seite, und die Frau machte am Schluss
eine fremde Bewegung. Was hilft, ist eine ausdrueckliche Verbotsliste:

```
HE DOES NOT MOVE HIS BODY. He does not shift his weight, does not step, does not
sway, does not lean, does not turn or tilt his head, and never moves sideways.
His feet, hips and shoulders stay fixed in place for the entire shot. The only
movement in the frame is his breathing, chest and shoulders rising and settling
slowly, and two slow blinks.
```

Bei der Frau zusaetzlich **„including the last second"** — die Ausreisser kamen am
Schluss des Clips.

Seitliche Wanderung der Koerperachse, gemessen ueber fuenf Zeitpunkte:

| | v11 | **v14** |
|---|---|---|
| Mann | 7,4 px | **1,8 px** |
| Frau | 3,9 px | **3,1 px** |

### Schlussaufbau: hart, dann Fade aus Schwarz, dann hart

Kein Crossfade mehr von der Frau ins Mockup. Statt `xfade`:

```
Frau        endet hart
Mockup      fade=t=in:st=0:d=1.6      aus Schwarz aufblenden, Teil steht STILL
Text        fade=t=in:st=1.4:d=0.9:alpha=1   erscheint spaeter als das Bild
Wortmarke   harter Schnitt
```

> ⚠ **Zwei ffmpeg-Fallen, beide haben je einen Durchgang gekostet:**
> 1. **Ein Text-PNG als Overlay braucht ebenfalls `-loop 1`.** Ohne das liefert es
>    genau ein Einzelbild, und der Text erscheint im fertigen Clip gar nicht.
> 2. **`fade=...:alpha=1` braucht ein Format mit Alphakanal** — `format=rgba`
>    davorsetzen, sonst wird der Fade still verworfen.

Und: **ein Standbild aus einem Clip mit Drehung ist nicht frontal.** Fuer ein
stehendes Mockup einen eigenen Clip erzeugen, mit der Verbotsliste im Prompt:
„It does not rotate, does not turn, does not tip and does not swing. It stays
completely frontal and completely still for the entire shot."

### Ton: Higgsfield-Musik plus eigener Herzschlag

Der Seedance-Ton ist gut, aber der Herzschlag darin zu leise. Loesung: **beide
Quellen mischen** — Higgsfield liefert die Musik, der synthetische Puls aus v4
kommt darueber:

```
Musik   Hochpass 110 Hz zu 62 % + Original zu 38 %   (Platz im Bass schaffen)
Puls    48 Hz + 44 Hz, exp(-4.2) bzw. exp(-5.6), alle 2,5 s, 0,45 -> 1,0 anwachsend
Mischung  Musik 0,80 + Puls 0,62, normiert auf 0,93
```

Nachgemessen: Schlagspitze **0,82** gegen Musik dazwischen **0,17** — der
Herzschlag ist **4,7-fach lauter** und traegt den Takt hoerbar.
Datei: `ton_C_mit_herzschlag.wav`.

### Datei

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_v14.mp4` — 20,1 s.
Kosten: **180 Credits**.

---

## Fassung v15, 29.09.2026 — Mockup heller, Herzschlag raus, Ton faedet aus

**Keine neuen Credits** — reine Nachbearbeitung.

### Das Schlussmockup war zu dunkel

Die Mittelwerte taeuschten: Stoffhelligkeit 33,5 gegen 34,0 beim Mann — fast
gleich. Der Unterschied liegt in der **Bildfuellung**: das Teil bedeckte nur
**24,2 %** des Bildes, der Mann **67,5 %**. Dadurch wirkt es verloren im Schwarz.

> **Nicht die mittlere Helligkeit vergleichen, sondern wie viel Bild das Motiv
> fuellt.** Zwei Bilder mit demselben Mittelwert koennen voellig verschieden wirken.

Zwei Eingriffe:

```python
SCHWARZ = 0.055
n = clip((a - SCHWARZ) / (1 - SCHWARZ), 0, 1)   # Schwarzpunkt abziehen
hell = n ** 0.68                                 # dann Mitten anheben
# danach 1,18x vergroessern und mittig beschneiden
```

> ⚠ **Ein blosses Gamma hebt auch den Hintergrund.** Der erste Versuch mit
> `a**0.66` machte aus Markenschwarz (10) ein Grau (29) — der Hintergrund war
> keine Marke mehr. **Immer erst den Schwarzpunkt abziehen.**

| | vorher | **jetzt** |
|---|---|---|
| Stoffhelligkeit Mittel | 33,5 | **55,9** |
| Bildfuellung | 24,2 % | **18,3 %** bei engerem Ausschnitt, Teil deutlich groesser |
| Hintergrund an den Raendern | 10 | **15** (bleibt dunkel) |

### Herzschlag wieder raus

Der verstaerkte Puls aus v14 (4,7-fach ueber der Musik) war **zu heftig**. Gueltig
ist wieder die reine Higgsfield-Musik `tonB.wav`, ohne eigenen Puls.
`ton_C_mit_herzschlag.wav` bleibt liegen, wird aber nicht verwendet.

### Ton blendet am Ende aus

Der Seedance-Ton hat von sich aus ein Einblenden am Anfang, aber kein Ausblenden.
Ergaenzt: `afade=t=out:st=17.6:d=2.4` → `tonD.wav`.

Gemessener Verlauf im fertigen Film:

| Sekunde | 0 | 5 | 10 | 15 | 18 | 19 |
|---|---|---|---|---|---|---|
| Pegel | 0,08 | 0,14 | 0,29 | 0,30 | 0,21 | **0,07** |

### Datei

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_v15.mp4` — 20,1 s.

---

## Fassung v16, 29.09.2026 — Nahaufnahme, Licht auf dem Mockup, Takt

### ⚠ Zuerst: das Kratzverzeichnis ueberlebt die Sitzung nicht

Am naechsten Morgen war `/private/tmp/claude-501/.../scratchpad` leer. Die
Videodateien lagen in `~/Downloads/onefam-werbung/albanien/` und waren da, aber
**Textauflagen, Schriften und Schnittskripte mussten neu gebaut werden.**

Seitdem liegen sie in **`~/Downloads/onefam-werbung/_werkzeug/`**:
`n1`–`n7`, `karte_schluss.png`, `Outfit.ttf`, `Satoshi.ttf`, `mockup_hell.png`,
`schnitt_v16.sh`. Wer weiterarbeitet, kopiert sie von dort ins Kratzverzeichnis.

### Schnittlaengen auf den Musiktakt

Der Higgsfield-Ton hat einen messbaren Takt. Gemessen ueber die Tiefenanteile
(Tiefpass 200 Hz, Huellkurve, Spitzen): **Abstand 1,02 s = 59 je Minute.**

Alle Schnitte sind jetzt Vielfache davon:

| Abschnitt | Takte | Dauer |
|---|---|---|
| Mann, Frage | 2 | 2,04 s |
| Mann, „Zurich." | 1 | 1,02 s |
| Mann, Nachfrage | 2 | 2,04 s |
| **Nahaufnahme Gesicht** | **3** | **3,06 s** |
| Tirana | 3 | 3,06 s |
| Zuerich | 3 | 3,06 s |
| Frau | 2 | 2,04 s |
| Mockup | 2 | 2,04 s |
| Wortmarke | 2 | 2,04 s |

Summe 20,4 s; der Ton wird mit `apad` auf dieselbe Laenge gebracht.

### Die Nahaufnahme

Referenz ist **ein Standbild aus dem vorhandenen Traegerclip** — so bleibt es
dieselbe Person. Im Prompt: „The frame is filled by his face from the top of his
head to just below the chin, no shoulders, no garment visible."

### Ein schwarzes Teil auf Schwarz braucht Licht, keine Nachbearbeitung

Das Aufhellen in v15 (Gamma mit Schwarzpunkt) reichte nicht — der Pullover war
weiter kaum als Kleidungsstueck zu erkennen. **Das Licht gehoert in den Prompt**,
nicht in die Bildbearbeitung:

```
IT IS BRIGHTLY AND CLEARLY LIT like a studio product shot: a strong soft key
light from the front left models the whole garment, a bright rim light runs along
both shoulders and both sleeves so the silhouette reads clearly, and a soft fill
light on the chest makes the fabric texture and the seams plainly visible. The
sweatshirt reads as a dark charcoal grey garment, clearly lighter than the
background, never merging into it, never a black silhouette.
```

| | v15 (nachbearbeitet) | **v16 (beleuchtet)** |
|---|---|---|
| Stoff Mittel | 55,9 | 51,8 |
| Bildfuellung | 18,3 % | **33,5 %** |
| Hintergrund | 15,0 | **4,7** |

Der Stoffwert ist aehnlich — aber das Teil **liest** als Pullover, weil Kantenlicht
die Silhouette zeichnet, und der Hintergrund ist tiefer schwarz statt angehoben.

### Lidschlaege messen, nicht schaetzen

Die Frau blinzelte unnatuerlich. Gemessen ueber den Kontrast im Augenband
(`g[380:560, 380:720].std()` an 50 Zeitpunkten), Schwelle `Mittel − 0,8·Streuung`:

| | Lidschlaege | Dauern |
|---|---|---|
| v15 | 4 | 0,33 / 0,25 / 0,50 / 0,08 s |
| v16 roh | 2 | 0,42 / **0,83 s** |

**0,83 s ist Zeitlupe** — ein menschlicher Lidschlag dauert 0,1 bis 0,4 s. Der
Prompt („two completely natural, relaxed, ordinary blinks … never in slow motion")
hat die Zahl gesenkt, aber die Dauer nicht.

**Geloest ueber den Schnitt:** Der ruhige Abschnitt ohne Lidschlag liegt bei
**0,42 bis 2,60 s** — genau die 2,04 s, die der Takt vorgibt. Bei zwei Sekunden
faellt ein fehlender Lidschlag nicht auf; Menschen blinzeln etwa alle vier
Sekunden.

> **Merksatz:** Wenn ein Modell eine Bewegung falsch taktet, hilft oft kein neuer
> Prompt, sondern die Wahl des Ausschnitts.

### Datei

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_v16.mp4` — 20,2 s.
Kosten: **180 Credits** (3 937 → 3 757).

---

## Fassung v17, 29.09.2026 — die Nahaufnahme lebt

Labi: am Anfang starr, das Blinzeln unnatuerlich.

### Gemessen, nicht geschaetzt

Messskript `lidschlag.py` (liegt im Werkzeugordner): tastet 60 Zeitpunkte ab,
misst die Streuung im Augenband (`g[0,28h:0,42h, 0,28w:0,72w].std()`), Schwelle
`Mittel − 0,75·Streuung`. Dazu die bewegte Bildflaeche in der ersten Sekunde.

| | Lidschlaege | Bewegung 1. Sekunde |
|---|---|---|
| v16 (verworfen) | 3 → **0,42** / 0,17 / 0,33 s | **0,15 %** |
| Variante A | 4 → 0,33 / **0,17** / **0,25** / **0,25** s | 0,23 % |
| Variante B | 4 → viermal **0,25** s | 0,31 % |

**0,15 % bewegte Flaeche ist ein Standbild.** Ein menschlicher Lidschlag dauert
0,1 bis 0,4 s — die 0,42 s aus v16 lagen darueber.

### Was im Prompt hilft

```
FROM THE VERY FIRST FRAME HE IS ALREADY ALIVE AND BREATHING — nothing is frozen,
there is no still moment at the start. Throughout the shot there is continuous
subtle life: the faintest movement of the nostrils as he breathes, a barely
visible shift of the jaw, and small natural eye movements as his gaze settles.
His blinks are quick and ordinary, the eyelids closing and reopening in a
fraction of a second exactly like a real person, never slow, never held shut,
never fluttering, never in slow motion.
```

Die **Mikrobewegungen einzeln zu benennen** (Nasenfluegel, Kiefer, Augen-Saccaden)
wirkt besser als „he is alive". Und die Lidschlagdauer muss als **Bruchteil einer
Sekunde** beschrieben werden, nicht als „natural".

### Und trotzdem: den Ausschnitt waehlen

Auch mit gutem Prompt bleibt das **erste Bild** am ruhigsten. Gewaehlt wurde
Variante A **ab Sekunde 1,0** — damit ist der starre Auftakt weg und es liegen
nur zwei Lidschlaege im 3,06-s-Fenster statt drei.

Bewegung an derselben Stelle im fertigen Film: **2,51 %** gegen vorher 0,15 %.

> **Regel: zwei Varianten je Portraet generieren.** Lidschlagtakt und Startruhe
> lassen sich nicht zuverlaessig erzwingen — man waehlt sie aus.

### Datei

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_v17.mp4` — 20,2 s.
Beide Varianten liegen als `nahaufnahme_mann_A.mp4` und `_B.mp4` daneben.
Kosten: **120 Credits**.

---

## Fassung v18, 29.09.2026 — der Schlusssatz gehoert zum Menschen

**Keine neuen Credits** — nur Schnitt.

„So we made our own place." steht jetzt **unter der Frau**, der Sweater blendet
**ohne Text** auf.

**Warum das besser ist:** Der Satz ist ein *Wir*. Ueber dem Mockup behauptet ein
Produkt, es sei ein Ort; ueber ihrem Gesicht sagt es die Person, die dazugehoert.
Und der Sweater gewinnt dadurch eine Begruendung — die Abfolge ist jetzt
**Mensch sagt es → das Ding, das daraus entstand → Marke**, statt dass ein
Kleidungsstueck den Satz fuer sich beansprucht.

### Die Einschraenkung, und wie sie geloest ist

Die Frau hat nur 2,04 s (2 Takte). Fuenf Woerter in zwei Zeilen sind darin knapp.
Deshalb:

* Schriftgrad **64 statt 78**
* **kein Einblenden** — der Text steht von der ersten Bildzeile an
* Lage **y 1396**, also dieselbe Hoehe wie der Dialog beim Mann; der Blick springt
  beim Schnitt nicht

Ihr Abschnitt bleibt bei 0,45–2,49 s, dem gemessenen Fenster ohne den
Zeitlupen-Lidschlag.

### Ablauf, Stand v18

| Takte | Dauer | Bild | Text |
|---|---|---|---|
| 2 | 2,04 | Mann | „Where are you from?" |
| 1 | 1,02 | Mann | „Zurich." |
| 2 | 2,04 | Mann | „No — where are you **really** from?" |
| 3 | 3,06 | **Nahaufnahme** | — |
| 3 | 3,06 | Tirana, warm | In Albania, I'm the Swiss one. |
| 3 | 3,06 | Zuerich, kalt | In Switzerland, I'm the Albanian one. |
| 2 | 2,04 | **Frau** | **So we made our own place.** |
| 2 | 2,04 | Mockup, blendet auf | — |
| 2 | 2,04 | Wortmarke | Clothing for people who belong… |

### Datei

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_v18.mp4` — 20,2 s.

---

## Fassung v19, 29.09.2026 — der Moment, der nachhallt

Labis Vorschlag: die Frau laenger zeigen, den Satz einblenden, damit ihr Gesicht
nach dem Lesen noch einmal wirkt.

**Warum das richtig ist.** Bis dahin ist der Film reine Funktion — Text, Schnitt,
Text, Schnitt. Jedes Bild arbeitet. Der letzte Moment vor dem Produkt darf nicht
arbeiten, er muss **nachhallen**. Blendet der Satz ein und bleibt danach Zeit,
liest der Zuschauer ihr Gesicht ein zweites Mal, diesmal mit dem Satz im Kopf.
Das macht sie zum **Gesicht der Aussage** statt zur Traegerin einer Bildunterschrift.

> ⚠ **Drei Takte, nicht mehr.** Bei vier faellt der Film auseinander. Ein
> Nachhall-Moment ist kein Standbild.

### Aufbau des Abschnitts (3,06 s)

| | |
|---|---|
| 0,0–0,9 s | nur ihr Gesicht, Ankunft nach dem Schnitt |
| 0,9–1,6 s | der Satz blendet ein (`fade=t=in:st=0.9:d=0.7:alpha=1`) |
| 1,6–3,06 s | Satz steht, das Gesicht wirkt nach |

### Zwei Varianten, gemessen

| | Lidschlaege | Bewegung 1. Sek |
|---|---|---|
| A | 0,42 / 0,08 / 0,17 / 0,25 s | 0,02 % |
| **B (gewaehlt)** | 0,42 / 0,33 / **0,08 s** | 0,04 % |

B ist heller, der Blick offener. Gewaehlt ab **0,95 s** — damit liegen die beiden
langen Lidschlaege am Clipanfang ausserhalb, und im Fenster bleibt **genau einer
von 0,08 s**. Er faellt bei 2,22 s, also kurz nach dem Texteinblenden: es wirkt,
als lese sie mit.

> **Der Glücksfall ist kein Zufall, sondern Auswahl.** Zwei Varianten erzeugen,
> die Lidschlaege messen, das Fenster danach legen.

### Film jetzt 21,2 s

Ein Takt mehr als vorher. Der Ton wurde mit `apad=pad_dur=1.6` auf 21,42 s
gebracht, das Ausblenden auf `st=18.9:d=2.5` verschoben.

### Datei

`~/Downloads/onefam-werbung/albanien/REALLY_FROM_albanien_v19.mp4` — 21,2 s.
Beide Varianten liegen als `frau_lang_A.mp4` und `_B.mp4` daneben.
Kosten: **120 Credits**.
