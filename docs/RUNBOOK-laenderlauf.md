# RUNBOOK „LAENDERLAUF" – ein Land komplett (Hoodie · Sweater · Shirt)

**Codewort: `LAENDERLAUF <Land>`** — z. B. `LAENDERLAUF AFGHANISTAN`.
Wer dieses Wort liest: dieses Dokument von oben bis unten abarbeiten. Argentinien,
Albanien, Afghanistan und Andorra sind komplett durch und dienen als Vorlage. Nichts
raten – alle Masse stehen hier oder in den verlinkten Protokollen.

> ⚠ **Zwei Abschnitte dieses Runbooks sind überholt und stehen nur noch als Historie
> drin. Vor jedem Lauf zusätzlich lesen:**
> * **§3 Landmarken → ersetzt durch `claude/RUNBOOK-ERGAENZUNG-posenlandmarken-27082026.md`**
>   (MediaPipe Pose statt Hautfarben-Erkennung; Massstab pro Bild, nie als Gruppenmedian).
> * **§3b Freihängend aus PodOS → ersetzt durch
>   `claude/ghost-freihaengend-stanley-stella-24082026.md`** (Ghost-Mannequin aus dem
>   Stanley/Stella-Produktfoto mit rechnerisch eingerechnetem Druck).
> * **`claude/RUNBOOK-ERGAENZUNG-modellbilder-posenvariation.md`** für Anker und Posen.
> * **`claude/REGEL-posen-standbein-28082026.md`** — keine Standbein-Posen mehr.
> * **`claude/andorra-hautmaske-behoben-28082026.md`** — Farbkorrektur und Hautschutz.

---

## 0. Was zuerst zu klären ist (einmal pro Land)
1. **Druckdatei**, 4000 × 4000 RGBA. **Sie blockiert den Anfang nicht** —
   alle Bilder entstehen mit freier Brust, der Druck wird zuletzt eingerechnet (§4).
   **Sie liegt auf Labis Rechner unter `~/Downloads/Designs/<Land>.png`** — von dort
   in die WP-Mediathek laden (Claude in Chrome, `media-new.php?browser-uploader`,
   `file_upload` auf das `input[type=file]`), dann holt die Higgsfield-Sandbox sie über
   `/wp-content/uploads/<Jahr>/<Monat>/<Land>.png`. **WordPress behält das Original**
   neben der `-scaled`-Fassung, Snippet 94 wird dafür nicht gebraucht.
   Zum Vergleich Argentinien: Alpha-Bounding-Box 729,486 → 3236,3535 (2508 × 3049,
   Seitenverhältnis 0,8226); Albanien 729,487 → 3237,3537 (2508 × 3050);
   Andorra 729,486 → 3237,3536 (2508 × 3050).

   > ⚠ **Erst gegen den Illustrator-Master prüfen.** In 10 der 251 SVGs des Designers
   > fehlen durch einen Rotationsfehler ganze Wappen- und Sonnenteile — und die
   > Druckdatei erbt den Fehler stumm. Betroffen: Kroatien, Haiti, Kirgisistan,
   > Nicaragua, Philippinen, Portugal, Polen, Tadschikistan, Anguilla-UK-Blau
   > (Argentinien und Brunei sind repariert). Vor dem ersten Bild:
   > `claude/OFFEN-designer-svgs-rotationsfehler.md` lesen und die Druckdatei gegen
   > `OneFam/Done files/*.png` messen, **nie** gegen die SVG-Vorschau im Browser —
   > die zeigt denselben Fehler und bestätigt ihn nur.

   > ⚠ **Luminanz der Druckdatei prüfen.** Albanien ist schwarz+rot (Mittel 27),
   > Argentinien weiss+hellblau (Mittel 201). Ein dunkles Motiv verschwindet auf
   > schwarzem Stoff bis auf die farbigen Teile — das ist beim echten Produkt genauso,
   > aber Labi sollte es vorher wissen. Umgekehrt gilt dasselbe: Afghanistan ist zu
   > **68 % weiss** und damit auf hellen Grautönen fast unsichtbar — das war mit ein
   > Grund, dort die helle Grau-Variante ganz zu streichen (§0.6).

2. **Kopflose Stanley/Stella-Referenz** je Schnitt (§2) — für alle drei geeicht.
3. **Farbliste** über `/wp-json/wc/store/v1/products/<id>` → `attributes` (§6).
   **Genau die Farben machen, die das Land führt.** Keine doppelten, keine unnötigen.
4. **Sollfarben je Farbe bestimmen, bevor der erste Farbprompt geschrieben wird** (§3a).
   Führt das Land Farben, die in der Tabelle in §3a fehlen, zuerst deren S/S-Code
   heraussuchen und den Sollwert messen.
5. **Kaufbarkeit der drei Produkte prüfen, bevor Bilder entstehen** (§7a). Ein Produkt
   ohne Varianten fällt sonst erst am Ende auf.
6. **Führt das Land zwei Grautöne, fällt der hellere weg.** Zwei Verkaufsquellen
   (SellerMockups, Printful) setzen *Dark Gray Heather* über *Sport/Athletic Heather*.
   Bei Afghanistan blieb **Anthracite**, *Cool Heather Grey* wurde gestrichen — im Shop
   **und** in PodOS. **Reihenfolge beachten: erst PodOS, dann WooCommerce.** Ein
   Speichern in PodOS erzeugt alle Varianten neu und überschreibt die Galerie; nach dem
   Verdrahten (§7) darf in PodOS nichts mehr gespeichert werden.
   **Ausnahme Andorra:** dort waren Sweater und Shirt schon verdrahtet, deshalb wurde
   Heather Grey **rein in WooCommerce** gestrichen (Attributwert weg, verwaiste
   Varianten auf `private`) und PodOS gar nicht angefasst — PodOS führt dort weiterhin
   9 Farben, folgenlos, solange niemand speichert.
   Herleitung: `claude/afghanistan-grau-entfernt-und-druck-eingerechnet-24082026.md`.

## 1. Bildsatz pro Produkt: 7 Ansichten je Farbe — davon 6 aus der KI
`Freihaengend`, `Frau_frontal`, `Frau_Taschen`, `Frau_Huefte`,
`Mann_frontal`, `Mann_Taschen`, `Mann_Huefte`.

> ⚠ **`Freihaengend` wird nicht generiert.** Es entsteht rechnerisch aus dem
> **Stanley/Stella-Produktfoto** (Ghost-Mannequin) mit eingerechnetem Druck —
> `claude/ghost-freihaengend-stanley-stella-24082026.md`. **0 Credits.**
> Der PodOS-Weg (§3b) und die frühere KI-Generierung sind beide verworfen; wer einen
> von beiden wieder einbaut, baut einen Fehler wieder ein, den Labi schon zweimal
> gemeldet hat.

**Die Farbzahl schwankt.** Argentinien 6/7/7, Albanien 9/10/9, Afghanistan nach dem
Grau-Schnitt 9/9/9, Andorra 8/7/9. Erst die Farbliste ziehen, dann rechnen:
**6 KI-Bilder je Farbe**, 4 Credits je Bild.

### Die Modelle — stehende Vorgabe von Labi
**Pro Land ein weibliches und ein männliches Supermodel der Ethnizität des Landes.**
Supermodel-Niveau, nicht „hübsch".

> ⚠ **Pflichtlektüre vor dem ersten Prompt: `claude/REGEL-gesichter-nicht-austauschbar.md`.**
> Am 23.08. zurückgewiesen, weil die albanischen Gesichter aussahen wie die
> argentinischen — gemessener Abstand 20,9 bei der Frau. „Hohe Wangenknochen, gerade
> Nase, kantiger Kiefer, dunkles Haar" ist keine Ethnizität, das ist die
> Standard-Modellschablone.

Kurzfassung: Beschreibung des Vorgängerlandes danebenlegen · Schädel- und Gesichtsform,
Nasenprofil, Lidfalte, Haarstruktur und -ansatz, Statur benennen · Augenfarbe und
Hautton **innerhalb** des Landes variieren · mehrere echte Typen anbieten, nicht
Varianten eines Typs · **Regionsname statt Landesname** · Anti-Generik-Satz in jeden
Prompt · Hautmerkmale je Person einzeln erfinden · Mann und Frau dürfen nicht wie
Geschwister aussehen · Hauttextur bleibt drin, sonst wird das Gesicht zu Wachs ·
**Freigabe der Basisbilder abwarten**, jedes weitere Bild erbt das Gesicht.

> ⚠ **Erst ansehen, dann den Messwert lesen** (24.08. eingelaufen). Für Afghanistan
> habe ich den Kandidaten mit dem **grössten** Gesichtsabstand zum Vorgängerland
> empfohlen — 63,0, der Spitzenwert. Angesehen war er ein kupferrot-lockiger Mann,
> der irisch wirkte. Der Abstand misst „anders als Albanien", nicht „afghanisch".
> **Reihenfolge: Bild ansehen → Ethnizität beurteilen → Abstand nur noch als
> Gegenprobe.**

### Dieselben zwei Menschen über alle drei Kleidungsstücke
**Zwei Referenzbilder gleichzeitig** an `nano_banana_pro` geben:

```
medias: [ {image: <job_id des freigegebenen Personenbildes>},
          {image: <media_id des kopflosen S/S-Zuschnitts>} ]
Prompt: "Two reference images. The FIRST shows a <man/woman> wearing a <Stück>: keep
this person exactly — same face, … The SECOND reference shows only a garment on a
headless torso: replace the <altes Stück> with exactly that garment — <Beschreibung>,
no hood, no drawcords, no kangaroo pocket."
```
Gemessener Gesichtsabstand Hoodie → Sweater: Frau 11,9. Beim Shirt **kurze Ärmel und
nackte Arme ausdrücklich benennen**, sonst erfindet das Modell lange Ärmel.

### Posen — was verboten ist

> ⛔ **Keine Standbein-Posen.** Gewicht auf ein Bein, ausgestellte Hüfte, Standbein und
> Spielbein: **kommt immer schlecht raus, wird nicht mehr generiert** (Entscheid Labi,
> 28.08.). Formulierungen wie „weight on the right leg", „hip out", „hips out to the
> left" fallen ersatzlos weg. Stattdessen: **Gewicht gleichmässig auf beiden Füssen,
> Hüfte gerade.** Details: `claude/REGEL-posen-standbein-28082026.md`.

> ⛔ **Keine Oberkörperdrehungen.** Der Brustkorb bleibt zur Kamera, solange der Druck
> flach gestempelt wird — Begründung im Nachtrag von
> `claude/afghanistan-modelllauf-variation-24082026.md`.

**Zusammen: Brustkorb frontal, Gewicht auf beiden Beinen.** Die Variation kommt aus
Schulterlinie, Kopfdrehung und -neigung, Kinn, Blickrichtung, Ausdruck, Haarfall,
Armhaltung und Handposition.

### Technik
- **nano_banana_pro**, `4:5` → exakt 3712 × 4608. `gpt_image_2` ist ungeeignet
  (2480 × 3312, kein 4:5, dreifacher Preis). **Seedream 5.0 Lite ist ebenfalls
  ungeeignet** — es liefert 2688 × 3584 und schneidet die Köpfe an der Oberkante ab
  (bei Andorra 134 von 144 Bildern); der Satz musste komplett verworfen werden.
- ⚠ **Der Parameter heisst `resolution`, nicht `quality`.** `quality:"4k"` wird
  **stillschweigend ignoriert** — die Bilder kommen als 1856 × 2304 zurück.
  **Und selbst mit `resolution:"4k"` kommen einzelne Aufträge in 928 × 1152 oder
  2688 × 3584 zurück** (Andorra: 2 von 144). **Ausgabegrösse jedes Bildes prüfen**, in
  der Sandbox und nach dem Upload über `media_details`.
- **nano_banana_pro zoomt nicht heraus.** Zwei ausdrückliche „step back, don't crop the
  head"-Prompts reproduzieren beide die Rahmung der Referenz. Fehlt oben der Kopf, hilft
  nur die rechnerische Leinwandverlängerung — Rezept in
  `claude/RUNBOOK-ERGAENZUNG-modellbilder-posenvariation.md` §1.
- **Referenzkette:** `job_id` als `medias[].value` weitergeben und **genau eine Sache**
  ändern. Reihenfolge: Basisbild schwarz je Person → Posen → Farben.
- Echte **Posenwechsel**, nicht nur Mimik — aber **ohne Standbein und ohne Drehung**
  (siehe oben). Beim Sweater und Shirt gibt es keine Kängurutasche — `Taschen` heisst
  dort **Hosentaschen**.
- **Nie ein Referenzbild mit fremdem Gesicht.**
- **Ausfallquote 3–5 %.** Einzeln nachfassen; hängende Aufträge kommen meist nach
  2–3 Minuten doch noch durch. Erst nach einem `failed` neu einreichen.
- **Die Higgsfield-Generierungshistorie ist das eigentliche Protokoll.** Jede
  Generierung trägt Prompt, Referenzbild und Ergebnis-URL — verlorene Job-Listen lassen
  sich daraus in zehn Minuten rekonstruieren.
- Prompt-Details: `claude/hausmodell-prompt-hoodie-19082026.md`.

## 2. Kopflose Stanley/Stella-Referenz — pro Schnitt eigener Crop
Basis: `https://res.cloudinary.com/www-stanleystella-com/image/upload/<crop>/v1/TechnicalNames/SFC0_<STYLE>_C002.png`

| Stück | Style | Crop | Ergebnis |
|---|---|---|---|
| Shirt | **Creator 2.0 / STTU169** | `c_crop,x_1000,y_1140,w_2000,h_1600/w_1600` | 1600 × 1280 |
| Hoodie | **Cruiser 2.0 / STSU177** | `c_crop,x_1000,y_1520,w_2400,h_2900/w_1600` | 1600 × 1933 |
| Sweater | **Changer 2.0 / STSU178** | `c_crop,x_700,y_1640,w_2400,h_2800/w_1600` | 1600 × 1867 |

Der Crop gilt **pro Schnitt, nicht pro Land** — Hoodie und Sweater sind rund 1,6×
näher am Modell fotografiert. Neuen Schnitt eichen: Hautzeilen von oben zählen, Crop
beginnt knapp unter der letzten Hautzeile des Kopfes, endet ~100 px unter dem Saum;
Hautanteil im obersten Zehntel muss ~0 sein, Kleidungsstück ~75 % der Fläche.
Herleitung: `claude/ss-referenzen-cruiser-changer-23082026.md`.

**Präfixe:** `SFC0` Mann ganz, `SFM0` Frau ganz, **`SFD0` Halsdetail ohne Person** —
letzteres ist die beste Farbreferenz, weil kein Hautton mit ins Messfeld gerät.

## 3. Landmarken ⛔ ERSETZT AM 27.08.2026

> **Nicht mehr anwenden.** Der ganze Abschnitt hängt an einer **Hautfarben-Maske**.
> Die versagt bei dunklerer Haut (`R-G ≤ 60` schliesst den männlichen Andorra-Anker
> praktisch komplett aus), bei hellen und warmen Stoffen (Viva Yellow, White, Cotton
> Pink erfüllen die Hautregel selbst) und bei kurzen Ärmeln (das Maximum der Hautpixel
> liegt auf den Unterarmen). Bei Andorra hat das ein Dutzend Drucke auf Kragen und Kinn
> gesetzt und die Farbkorrektur auf die Haut laufen lassen.
>
> **Gültig ist `claude/RUNBOOK-ERGAENZUNG-posenlandmarken-27082026.md`:**
> Schultermitte und Rumpflänge aus MediaPipe Pose, **pro Bild**, Konstanten `k_y`/`k_w`
> je (Schnitt, Person).

Der historische Text — die beschriebenen Fallen sind echte Beobachtungen und erklären,
warum es so lange gehalten hat:

```
Hals_y  = unterste Zeile mit >= 15 Hautpixeln im Mittelband (+-200 px),
          Suche NUR im oberen 55 % des Bildes
```

1. **Die Suche muss auf das obere 55 % begrenzt werden.** Bei der Taschen-Pose stecken
   die Hände im Mittelband — ohne die Grenze landet der Hals *unter* dem Saum.
2. **Warme Stoffe erfüllen die Hautregel.** Rot und Cotton Pink melden in *jeder*
   Ansicht einen falschen Hals.
3. **Die Saumerkennung bricht bei Händen in den Hosentaschen ab.**

> ⛔ **Und daraus wurde die falsche Konsequenz gezogen:** „Spanne aus der frontalen
> Ansicht nehmen und für die ganze Gruppe verwenden." Das setzt allen Bildern denselben
> Massstab auf, obwohl der Abstand zur Kamera zwischen den Generaten schwankt. Schon am
> **25.08.** stand in `claude/UEBERGABE-HERZDRUCK-afghanistan-hoodie-25082026.md`
> ausdrücklich, dass diese Empfehlung widerlegt ist — sie wurde hier nicht korrigiert
> und der Andorra-Lauf ist ihr wieder gefolgt. **Eine widerlegte Regel gehört dort
> korrigiert, wo sie steht.**

### Freihängende Bilder — siehe `claude/ghost-freihaengend-stanley-stella-24082026.md`

Hier standen einmal Verhältniswerte `R_GHOST_W` / `R_GHOST_C` für KI-erzeugte
Ghost-Bilder, danach der PodOS-Weg (§3b). **Beides ist verworfen.** Gültig ist das
Ghost-Mannequin aus dem Stanley/Stella-Produktfoto.

### Druckmasse Modellbilder — kanonisch

Spanne = Hals → Saum. Diese Werte gelten **für alle Länder** (Argentinien-,
Albanien- und Afghanistan-Mockup stimmen auf 1–3 px überein).

| Stück | `R_WIDTH` = Druckbreite / Spanne | `CEN` = Motivmitte unter Hals / Spanne | in cm |
|---|---|---|---|
| **Hoodie** (Cruiser 2.0) | **0,2600** | **0,2882** | Breite 16,6 cm, Oberkante 8,3 cm |
| **Sweater** (Changer 2.0) | **0,1279** | **0,2804** | Breite 6,9 cm, Mitte 15,1 cm |
| **Shirt** (Creator 2.0) | **0,1254** | **0,2597** | Breite 6,9 cm, Mitte 14,3 cm |

**Diese Tabelle bleibt die kanonische Beschreibung der Geometrie.** Neu ist nur, worauf
sie bezogen wird: nicht mehr auf `hals` und `spanne` aus der Hautmaske, sondern auf
Schultermitte und Rumpflänge aus den Posen-Landmarken. Die Gegenprobe
`k_w · torso ≈ R_WIDTH · spanne` muss stimmen.

> ⚠ **Zwei Zahlen, die früher hier standen, waren falsch** (korrigiert 23.08. nachts):
> `y_oben = Hals + 0,515 × Spanne` beim Hoodie war die **Taschenoberkante**, nicht der
> Druck; und `R_WIDTH = 78/651 = 0,1198` beim Shirt war eine 900-px-Messung und 4 % zu
> klein. Herleitung: `claude/albanien-druck-eingerechnet-196-bilder-23082026.md`.

## 3b. Freihängend aus dem PodOS-Mockup ⛔ VERWORFEN

> **Labi hat diesen Weg am 24.08. abgelehnt und am 27.08. noch einmal.** Die
> PodOS-Renders sehen nicht aus wie Produktfotos. Gültig ist
> `claude/ghost-freihaengend-stanley-stella-24082026.md`.
>
> Was aus diesem Abschnitt **weiterhin nützlich** ist: die **Farbzuordnung nie nach der
> Dateinummer raten** (`1-01 … 1-18` ist keine Farbreihenfolge) und die Erkenntnis, dass
> die drei PodOS-Sätze **unterschiedlich belichtet** sind (Hoodie rendert Schwarz als
> `#5B5B5B`, Sweater `#2B2B2B`, Shirt `#0E0E0E`). Wer je wieder etwas aus PodOS holt,
> muss beides beachten.

## 3a. Sollfarben — die Quellenregel

1. **Erste Quelle: das Stanley/Stella-Technikbild.**
   `…/image/upload/w_1000/v1/TechnicalNames/SFC0_<STYLE>_<CODE>.png`
   Median im Brustfeld (30–45 % der Bildhöhe, mittlere 16 % der Breite).
   Fehlt `SFC0` für eine Farbe: `SFM0` versuchen, dann `SFD0` (Halsdetail).
   **Fehlt das Technikbild für einen Schnitt ganz, andere Schnitte durchprobieren** —
   Bright Blue gibt es für STSU177 nicht, wohl aber für STTU755 und STTU170; daraus
   `#6078A6`. Das PodOS-Mockup hätte hier ein viel zu gesättigtes Blau geliefert.
2. **Zweite Quelle zur Gegenprobe: das PodOS-Mockup im eigenen Shop**
   (`/uploads/2026/07/<land>-<stueck>-<farbe>.webp`, 900 × 900 auf Weiss).
3. **Vor jedem Vergleich den Schwarzpunkt des Satzes abziehen.** Die PodOS-Mockups
   haben starkes Aufhelllicht in den Tiefen — gegen S/S gemessen Faktor 1,86 bei
   Schwarz, 1,25 bei Heather Grey. **Farbton ja, Helligkeit nein.**
4. **Weichen zwei Quellen nach dieser Normierung noch ab, stimmt eine Datei nicht.**
   Genau so sind der Albanien-Sweater-„Black" (ist 1-06) und der -„French Navy"
   (ist ein Petrol) aufgeflogen. Herleitung: `claude/sollfarben-quellenkritik-23082026.md`.
5. **Ein Sollwert je Farbname über alle drei Kleidungsstücke.**
6. **Steht der Farbname nirgends, hilft die Artikelnummer eines Händlers**
   (Bauart `STSU177C088`).

**Kanonische Sollwerte** (S/S-Codes sind produktübergreifend, also landunabhängig):

| Farbe | Code | Sollwert |
|---|---|---|
| Black | C002 | `#272B2C` |
| Anthracite | C253 | `#4E5254` |
| Heather Grey | C250 | `#B1B1B1` |
| Mid Heather Grey | — | `#848483` |
| Cool Heather Grey | C146 | `#E6E1E4` |
| Eco Heather | C147 | `#E6E2DB` |
| White | C001 | `#EFEFEE` |
| Red | C004 | `#BF2936` |
| Cotton Pink | C005 | `#EDB7C3` |
| Viva Yellow | — | `#F3D693` |
| Green Bay | C144 | `#9CABA0` |
| Glazed Green | C036 | `#28403C` |
| Aloe | C089 | `#AFC7AE` |
| French Navy | C727 | `#283241` |
| Worker Blue | C088 | `#253477` |
| Bright Blue | C053 | `#6078A6` |
| Stargazer | C702 | `#324B52` |
| Mindful Blue | C729 | `#496DA0` |
| Aqua Blue | C145 | `#77BBE2` (nur `SFM0`/`SFD0`, kein `SFC0`) |

> ⚠ **Die Farbkreise auf der Produktseite sind eine ZWEITE Kopie dieser Tabelle.** Sie
> stehen in **Snippet 23** („OneFam Produktseite – Farbkreise & Grössen-Buttons") als
> JSON-Zeichenkette mit maskierten Anführungszeichen. Wer hier etwas ergänzt oder
> korrigiert, muss Snippet 23 im selben Zug nachziehen. Am 27.08. waren dort 19 von 29
> Werten falsch — Glazed Green und Green Bay praktisch vertauscht.

**Formulierungen, die nachweislich tragen:**
- **Hex-Code plus Klartext.** Der Code allein bringt nur ein Drittel der Korrektur.
  **Ergebnis immer nachmessen.**
- **Rot:** „a BRIGHT, clear, saturated signal red, luminous rather than deep; never
  burgundy, wine or oxblood."
- **Heather Grey:** „a MID marled grey … definitely NOT a pale near-white grey."
- **Helle Stoffe:** „Keep the fold shadows soft so the pale garment stays clearly
  separated from the light-grey backdrop."
- **Glazed Green trifft das Modell nicht** — rechnerisch korrigieren.
- **Rechnen oder neu generieren?** Liegt der Stoff farblich nah am **Hintergrund**
  (helle Farben), gibt es keine sichere Maske — dann **neu generieren**, nicht rechnen.
  Ebenso über ~40 % nötiger Verschiebung.

## 4. Druck einrechnen

Geometrie nach `claude/RUNBOOK-ERGAENZUNG-posenlandmarken-27082026.md`, dann:

```python
L  = luminanz(bildausschnitt); Lb = median(L)
f  = clip((L+6)/(Lb+6), 0.55, 1.45)      # Falten laufen durch den Druck
ink = clip(artwork_rgb * f)
```

**Verdeckung — was vor dem Druck liegt, bleibt frei:**
```python
occ = farbabstand_zum_stoffmedian > 150            # Haar, Haende
occ = Opening(occ, r=12)                           # Melierungsflocken fallen raus
if Hoodie:                                         # Kordeln
    hp   = L - waagrechter Boxfilter(L, 61)
    c    = hp > max(22, 3*median(|hp|))
    c   &= NICHT (waagrechte Erosion 25 px ueberlebt)   # Falten sind breit
    occ |= senkrechtes Opening von c (Lauflaenge >= 41 px)
alpha *= (1 - occ)
```
**Beide Zusätze sind Pflicht.** Ohne das Opening mit r=12 frisst der Abstandstest bei
meliertem Stoff bis zu **73 %** des Drucks weg (Mid Heather Grey Hoodie); ohne die
Breitenschranke hält der Kordelfilter Faltenschatten für Kordeln. Mit beidem liegt die
Verdeckung beim Hoodie im Median bei 1,9 %, bei Sweater und Shirt bei 0.

Speichern als **WebP, quality 88–90, method 4–6**.

> ⚠ **Speicher.** 3712 × 4608 mal viele Bilder mit 16 Threads killt die Sandbox
> (exit 137). **3–6 Prozesse**, sofort auf das Messfeld zuschneiden, Bild danach
> freigeben. Dasselbe gilt fürs Fingerabdruck-Rechnen: **369 Vorschaubilder
> gleichzeitig im Speicher killt den Prozess** — Fingerabdruck im Thread rechnen und
> das Bild sofort verwerfen.

### Farbkorrektur — gültige Fassung seit 28.08.2026

Vollständig in `claude/andorra-hautmaske-behoben-28082026.md`. Kurz:

1. **Ein** Helligkeitsfaktor, **ein** additiver Buntheitsversatz — beide konstant über
   das ganze Kleidungsstück. **Keine ortsabhängige Gewichtung** (die erzeugte am 27.08.
   erst den Schulterstreifen, dann den Halsring).
2. Maske hart an der Stoffkante, rund 8 px Übergang — nicht 400.
3. **Haut ausschliessen über den helligkeitsnormierten Vergleich:** ein Bildpunkt gehört
   nur zum Stoff, wenn er der auf seine Helligkeit skalierten Stofffarbe näher ist als
   der ebenso skalierten Hautfarbe. Ohne das läuft die Korrektur bei Rot, Cotton Pink
   und Viva Yellow ins Gesicht.
4. **Drei Abnahmen, alle drei Pflicht:** Hintergrund-Drift ≤ 3 · **Gesichtsfeld gegen
   Rohbild ≤ 3** · Maskendeckung (Anteil Gewicht > 0,99) ≥ 0,95.

> ⛔ **Die alte Prüfung sah nur den Hintergrund an.** Läuft die Korrektur auf die Haut,
> bleibt der Hintergrund unberührt und die Prüfung geht durch — so entstanden bei
> Andorra ein türkiser Pulli, ein grünes Gesicht und rosarote Flecken auf Stirn und Wange.

> **Prüfrezept, um ein fertiges Land auf den Halsfehler abzuklopfen** (28.08. an
> Albanien / Argentinien / Afghanistan angewandt): bei den **roten** Modelbildern zwei
> Stofffenster links und rechts der Mitte (x = 22–36 % und 64–78 % der Breite) messen,
> das obere bei 3–13 % der Stoffhöhe, das untere bei 40–60 %; Haut und Druck über die
> Farbmaske ausschliessen. Ein korrekt gerechnetes Land zeigt ΔHelligkeit ≈ 5 und
> ΔR/G ≈ 0,4, **konsistent über alle Bilder**. Grössere Werte oder ein **wechselndes
> Vorzeichen** verraten die alte ortsabhängige Rechnung.
> Messwerte: `claude/BEFUND-halsfehler-albanien-argentinien-afghanistan-28082026.md`.

## 5. Dateinamen — hier liegt die grösste Falle
```
OneFam_<Land>_<Stueck>_<Farbe>_<Ansicht>_4k.webp
```
Die Galerie sucht den **normalisierten Farbnamen als Teilstring**
(`(s||'').toLowerCase().replace(/[^a-z]/g,'')`).

- **`Black` heisst im Dateinamen `schwarz`**. `_Black_`-Dateien werden **ohne
  Fehlermeldung** ignoriert.
- Andere Farben: Attributwert ohne Leerzeichen (`CoolHeatherGrey`, `CottonPink`).
- Der Vergleich ist `indexOf`: `heathergrey` matcht auch `midheathergrey`.
- **Vor dem Erzeugen die ganze Namensliste durchrechnen** — und zählen, ob der Filter
  je Farbe genau 7 Dateien findet.
- **`Freihaengend` heisst `_Freihaengend_4k`, ohne `_v2`.** Gegen die Verwechslung mit
  alten Beständen hilft nicht ein anderes Namensmuster, sondern der **Anhang-ID-Bereich**.

> ⚠ **Der Dateiname taugt nicht zur Unterscheidung alt/neu.** Lädt man einen Satz hoch,
> während die alten Dateien noch dieselben Namen tragen, hängt WordPress `-1`, beim
> nächsten Mal `-2` an — und der **zu löschende** Anhang kann dann `-1` heissen und der
> **bleibende** `-2`. Titel und Alt-Text sind bei beiden identisch.
> **Beim Aufräumen entscheidet ausschliesslich die Anhang-ID.**

## 6. Lesen und Hochladen

**Lesen geht ohne Anmeldung.** Der **Higgsfield-Sandkasten** (`sandbox_exec`) kommt an
`shop.onefam.ch`, an Cloudinary und an CloudFront heran — **weder der Cloud-Container
noch Labis Rechner** (`device_bash`) haben Netz.

**Messen immer am `_min.webp`**, nicht am `.png`: gleiche Auflösung, 300 KB statt 20 MB.

**Der Sandkasten wird ~10 s nach jedem Vordergrundaufruf verworfen.** Nur
`background: true` bekommt eine 15-Minuten-Lease. Alles, was überleben muss, gehört in
**einen** Hintergrundaufruf — oder sofort an eine `media_upload`-Presigned-URL.
Ein Vordergrundaufruf wird serverseitig nach **60 s** abgebrochen.

> ⚠ **Abfragen verlängern die Lease NICHT.** Wer länger als 15 Minuten arbeitet, muss
> regelmässig einen **neuen** Hintergrundjob starten. Und: **Skripte, Zuordnung und
> Konstanten sofort als ZIP an eine presigned URL sichern** — ein Wiederaufbau ist dann
> ein `curl` plus `unzip` statt einer halben Stunde.

**Bilder ansehen:**
1. **Lokale Dateien**: `device_stage_files` → `Read`.
2. **Aus der Sandbox**: Kontaktbogen bauen → an eine `media_upload`-Presigned-URL legen
   → CloudFront-URL in Chrome öffnen → `computer`-Screenshot. Zum Beurteilen im
   Bildbetrachter **auf 100 % klicken und durchscrollen**; die eingepasste Ansicht ist
   zu klein.
   > ⚠ **CloudFront cached die URL.** Ein zweiter PUT auf dieselbe presigned URL kommt
   > im Browser nicht an. **Für jede neue Fassung eine neue `media_upload`-URL.**
3. **Livebilder ansehen, ohne die Sandbox:** im WP-Admin ein `<div>` mit `<img>`-Gitter
   bauen (`/wp-content/uploads/…-600x745.webp`, 6 Spalten = Ansichten, eine Zeile je
   Farbe) und einen `computer`-Screenshot machen. Schnellster Weg, einen ganzen Schnitt
   zu prüfen — **so wurde am 28.08. der vertauschte Sweater im schwarzen Hoodie
   gefunden.**

**Schreiben** braucht den Browser:
1. Bündel in der Sandbox bauen (8 Byte ASCII-Länge + JSON-Index + Rohdaten), per
   presigned S3-URL hoch (`media_upload` → `curl -X PUT --data-binary` → optional
   `media_confirm`). 164 MB in ~40 s.
2. **Im Browser** (Claude in Chrome, WP-Admin): `fetch` von CloudFront (CORS erlaubt),
   Index lesen, Blobs schneiden.
3. **Snippet 94 aktivieren**, sonst rechnet WordPress alles über 2560 px herunter.
   **Per REST prüfen** (`/code-snippets/v1/snippets/94` → `active`) — der Zähler auf der
   Listenseite ist veraltet.
4. Je Bild `wp.apiFetch({path:'/wp/v2/media', method:'POST', body: FormData})` mit
   `file`, `title` und `alt_text` in einem Aufruf.
   **`wpApiSettings` ist im Skript-Kontext nicht sichtbar, `wp.apiFetch` schon.**
   ⚠ **`javascript_tool` bricht nach 45 s ab, der Lauf läuft aber weiter.** Deshalb als
   Promise ohne `await` starten und einen Zähler auf `window` pollen — sonst entstehen
   Dubletten (Andorra: 10 Stück). Rund 6 Bilder je 35 s, 144 Bilder ≈ 14 Minuten.
5. **Snippet 94 wieder deaktivieren** und per REST nachprüfen.
6. **Ausgabegrösse aller Anhänge prüfen** (`media_details`), bevor verdrahtet wird.

**Bestehende Bilddateien austauschen** (Anhang-ID, Dateiname und Galerie bleiben):
Snippet **97** „TEMP Bilddatei ersetzen" aktivieren, dann
`wp.apiFetch({path:'/onefam/v1/replace/<id>', method:'POST', body: <Blob>,
headers:{'Content-Type':'application/octet-stream'}})` — der Endpunkt nimmt die **rohen
Bytes** entgegen und rechnet alle 19 Vorschaugrössen neu. Danach Snippet 97 wieder aus
und per REST prüfen, dass die Route 404 liefert.

> ⚠ **Snippet 97 ist am 28.08. gelöscht worden** (Papierkorb). Wird es wieder gebraucht,
> steht der Code in `claude/andorra-farbstreifen-behoben-27082026.md` §4.
> **Snippet 94 bleibt bestehen und inaktiv** — es wird bei jedem Länderlauf gebraucht.
> Ebenso **Snippet 96 „TEMP Mediathek 200 pro Seite"**, hilfreich beim Aufräumen.

**Dateien von Labis Rechner in die Mediathek:**
1. auf dem Rechner rechnen (`device_bash` — dort liegen python3, PIL, ImageMagick),
2. `device_stage_files` in den Cloud-Container,
3. `file_upload` (Claude in Chrome) auf ein **selbst angelegtes** `<input type=file>`
   — **nicht** auf das von plupload,
4. im Browser `wp.apiFetch('/wp/v2/media', POST, body: File)`.

Grenzen: `file_upload` **10 MB je Aufruf**; `device_bash` bricht nach **45 s** ab.

> ⚠ **Rückgabewerte von `javascript_tool` werden blockiert, wenn sie wie
> Cookies oder Query-Strings aussehen.** Nonces, `?…=…`-URLs und ganze HTML-Blöcke
> lösen das aus. Lösung: nur kurze, gefilterte Werte zurückgeben.

## 7. Produkt verdrahten
```js
PUT /wc/v3/products/<id>  { images:[{id},…] }               // images[0] = Beitragsbild
POST /wc/v3/products/<id>/variations/batch  { update:[{id,image:{id}},…] }
```
Galerie: Farbe × Ansicht, **schwarz zuerst**, je Farbe `Freihaengend, Frau_frontal,
Frau_Taschen, Frau_Huefte, Mann_frontal, Mann_Taschen, Mann_Huefte`.
Beitragsbild = `<Land>_<Stueck>_schwarz_Freihaengend_4k`.
Variantenbild = freihängendes Bild der jeweiligen Farbe.
**Prüfen:** je Farbe genau 7 Thumbnails. Cache leeren.

> **Immer über die Anhang-ID verdrahten, nie über den Namen** — WordPress hängt `-1` an,
> wenn der Dateiname schon belegt ist.
> **Beim Austausch nur der Modelbilder** (bestehendes Land): Freihängend-Einträge
> stehenlassen, jeden Modelbild-Eintrag über den Titel auf die neue ID mappen, und
> danach prüfen, dass keine alte ID mehr in einer Galerie **oder Variante** hängt.
> **Die Varianten müssen dabei nicht angefasst werden** — die zeigen die
> Freihaengend-Bilder.

**Einzelne Bilder aus der Galerie nehmen** (ohne die Datei zu löschen): Produkt im
klassischen Editor öffnen, das versteckte Feld `#product_image_gallery` enthält die
Anhang-IDs als Komma-Liste. IDs entfernen, die zugehörigen `li.image` im
`#product_images_container` entfernen, „Aktualisieren" klicken, danach über
`/wp-json/wc/store/v1/products/<id>` gegenprüfen.
**Die WooCommerce-Galerie liegt nicht in der WP-REST-API** — `/wp/v2/product` zeigt
`_product_image_gallery` nicht.

## 7a. Kaufbarkeit prüfen
Am 23.08. hatte der **Albanien-Sweater (2722) null Varianten** und war damit nicht
kaufbar. **Deshalb am Anfang und am Ende jedes Länderlaufs für alle drei Produkte
abfragen:**

```
/wp-json/wc/store/v1/products/<id> → is_purchasable, variations.length, prices.price
```

Fehlen Varianten, nach diesem Muster anlegen (`/variations/batch` mit `create[]`):

| | |
|---|---|
| Preis | Hoodie **75**, Sweater **65**, Shirt **40** CHF · Meta `_regular_price_wmcp` |
| Lager | `manage_stock: true`, `stock_quantity: 10000`, `instock`, `backorders: "no"` |
| Steuer | `taxable`, keine Steuerklasse · **SKU bleibt leer** |
| Bild | freihängendes Bild der Farbe |
| Grössen | XXS · XS · S · M · L · XL · 2XL · 3XL · 4XL · 5XL |

**Grössenregel:** **Cotton Pink, Green Bay und Aloe haben kein 4XL und kein 5XL.**
Bei Andorra fehlten sie zusätzlich bei **Bright Blue, Viva Yellow und Mid Heather
Grey** — **nicht selbst anlegen**, sondern bei S/S nachschlagen und Labi fragen.

> ⚠ **Ein PodOS-Sync kann auf halbem Weg stehenbleiben.** Beim Afghanistan-Hoodie
> kamen 58 von 86 Varianten an, beim Andorra-Sweater blieben 10 verwaiste
> Anthracite-Varianten übrig. Fehlende nachlegen und dabei eine **vorhandene Variante
> Feld für Feld spiegeln**.

## 8. Länderseite `/<land>/` — nicht vergessen!
Kommt aus Snippet **11 „OneFam Seiten (Router v4 – final)"**. Das Snippet ist **2,4 MB
gross**.

> ⚠ **Ein Land steht an ZWEI Stellen in Snippet 11** — Länderseite und Startseite
> (`const feat = {…}`). Wer nur die erste tauscht, lässt auf der Startseite das alte
> Gesicht stehen. **`feat` führt aber nicht jedes Land** — derzeit nur mexico,
> afghanistan, brazil. Vorher nachsehen, statt beide Stellen zu suchen.

- **Das Kartenbild kommt NICHT aus dem Beitragsbild.** Auf die Karte gehört ein
  **Modellbild**, nicht das freihängende.
- **Einfachster Weg:** direkt auf die `woocommerce_single`-Grösse eines schon
  hochgeladenen Galeriebildes zeigen —
  `/wp-content/uploads/<Jahr>/<Monat>/OneFam_<Land>_<Stueck>_schwarz_<Mann|Frau>_frontal_4k-600x745.webp`.
  Aufteilung: **Hoodie Mann, Sweater Frau, Shirt Frau.**
  > ⚠ **Werden die Modelbilder später ersetzt, bricht diese URL.** Beim Austausch die
  > Länderseite mitziehen — der neue Anhang heisst `…_4k-1-600x745.webp`, wenn der alte
  > Dateiname noch belegt war.
  > **Wird die Bilddatei dagegen über Snippet 97 an Ort und Stelle ersetzt, bleibt die
  > URL gültig** und die Setkarte zieht automatisch nach — WordPress rechnet alle
  > Vorschaugrössen neu. Am 28.08. am Datum der `-600x745`-Dateien nachgeprüft.
  > ⚠ **Und wenn ein Bild aus der Galerie genommen wird, muss geprüft werden, ob genau
  > dieses Bild die Setkarte trägt** — die Karte hängt an der URL, nicht an der Galerie.
- **Bearbeiten:** `admin.php?page=edit-snippet&id=11`, Code über
  `document.querySelector('.CodeMirror').CodeMirror.getValue()` holen, im Skript
  ersetzen, `setValue()`, dann `save_snippet` klicken.
  **Vorher zählen, dass jeder Suchtext genau einmal vorkommt.**
  **Die REST-Schnittstelle kann Snippet 11 nicht lesen** — 2,4 MB sind zu viel.
  Der Klick auf `save_snippet` läuft in das 45-Sekunden-Limit; das ist **kein Fehler**.
  Warten, dann am ausgelieferten HTML prüfen — nie am Editor.
- **Danach alle Länderseiten plus Startseite und `/shop-by-country/` auf HTTP 200
  und `fcard` im HTML testen**, und alle `src="/wp-content/uploads/…"` per **HEAD**.

## 9. Aufräumen
**Löschen macht Labi selbst**, der Assistent bereitet nur die Auswahl vor.
Vor jedem Löschen prüfen, ob eine Datei live ist — **Produkte, Varianten, Kategorien
und WP-Seiten reichen nicht**:
- Divi liefert Layouts nicht über `content` — nur die **gerenderten Seiten** zeigen es.
- **Die Router-Seiten `/<land>/` einzeln abklopfen** — und **die Startseite mit jedem
  `feat`-Schlüssel** durchschalten.
- **Die Seitenliste aus den Produktkategorien bzw. der Seitenübersicht bauen, nie aus
  Menü-Links** — `/argentina/` hängt nicht im Menü und wäre nie gescannt worden.
- Prüfmethode: alle `/wp-content/uploads/…`-URLs der Seite per **HEAD**.
- **Bei Dateinamen immer auf die Endung mitprüfen** —
  `(<Land>)(-scaled|-\d+x\d+)?\.(png|webp|jpg)`, sonst trifft die Suche den Fliesstext.
- In der Mediathek-Suche **nie mit Bindestrich beginnen** (`-2560-` liest WordPress
  als Ausschluss).
- **Die hochgeladene Druckdatei nach dem Lauf wieder löschen.**
- **Empfindlichkeitsprobe:** vor einem grossen Löschschritt einmal prüfen, ob der
  Seitentest überhaupt anschlägt. Ein Test, der nie etwas findet, beweist nichts.

### Die entscheidende Prüfung vor dem Löschen

**Dateipfade aller Anhänge des Landes vergleichen: teilt sich ein Löschkandidat eine
Datei mit einem Live-Anhang?** Wenn nein, kann endgültiges Löschen kein Bild im Shop
zerstören — das ist die einzige Prüfung, die eine echte Garantie gibt. Alles andere
(Galerien, Beitragsbilder, Varianten, gerendertes HTML) prüft nur, ob jemand *heute*
darauf zeigt.

### 185 Häkchen in einem Rutsch (Rezept vom 28.08.)

1. Mediathek in der **Listenansicht** auf das Land filtern:
   `upload.php?mode=list&s=OneFam_<Land>&orderby=title&order=asc`.
   Die Trefferzahl muss unter „Einträge pro Seite" liegen (999 über „Ansicht anpassen"),
   damit alle Ziel-IDs auf **einer** Seite stehen.
2. Über die Konsole genau die Ziel-IDs anhaken, alles andere abhaken, Zielzeilen rot
   hinterlegen, Rest ausgrauen:

```js
const ziel = new Set([/* IDs */]);
document.querySelectorAll('#the-list tr').forEach(tr => {
  const cb = tr.querySelector('input[name="media[]"]'); if (!cb) return;
  if (ziel.has(+cb.value)) { cb.checked = true;  tr.style.background = '#ffe0e0'; }
  else                     { cb.checked = false; tr.style.opacity    = '0.45';    }
});
document.querySelectorAll('#cb-select-all-1,#cb-select-all-2').forEach(c => c.checked = false);
document.getElementById('bulk-action-selector-top').value = 'delete'; // Endgültig löschen
```

3. Markierte zählen lassen, **dann erst** Labi „Anwenden" klicken lassen.
4. **Kopfhäkchen nicht anfassen** (markiert alle Treffer der Seite) und **Seite nicht
   neu laden** — die Markierung lebt nur im DOM.
5. Die Mediathek hat hier **keinen Papierkorb**: „Endgültig löschen" entfernt sofort.
6. Danach gegenprüfen: alle Bild-URLs der Produktseiten, `/<land>/`,
   `/shop-by-country/` und der Startseite per HEAD auf 200.

## 10. Feste Regeln
- Passwörter gibt Labi selbst ein; der Assistent loggt sich nicht ein.
- `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `SHOPIFY_WEBHOOK_SECRET`,
  `PODOS_API_KEY` werden nicht angefasst.
- Kontoebene, Zahlungen, Kündigungen, endgültiges Löschen: macht Labi.
- Im PodOS-Studio setzt schon ein Klick das Flag für ungespeicherte Änderungen —
  **nicht speichern**. Nach dem Verdrahten (§7) gilt das absolut.
- Snippets 94, 95 und 97 nach Gebrauch wieder deaktivieren **und per REST nachprüfen**.
- **Modelle: Supermodel-Niveau, Ethnizität des Landes, pro Land wirklich andere
  Gesichter** — `claude/REGEL-gesichter-nicht-austauschbar.md` ist verbindlich.
- **Keine Standbein-Posen und keine Oberkörperdrehungen** —
  `claude/REGEL-posen-standbein-28082026.md`.
- **Nur die Farben machen, die das Land führt.**
- **Messwerte sind Warnlampen, keine Urteile. Erst ansehen, dann messen.** Bei Andorra
  habe ich drei Verlaufs-Kennzahlen gebaut, die alle am Motiv vorbeimassen, während der
  Fehler im Kontaktbogen sofort sichtbar war.
- **Bei Bildzuordnungen mit knapper Marge entscheidet das Auge.** Formfingerabdrücke
  unterscheiden zwei Ansichten derselben Farbe oft nur um 0,01 — dann die sechs
  Ansichten nebeneinanderlegen und hinsehen. Am 28.08. lag die Rechnung bei 2 von 16
  Bildern daneben.
- **Vor dem Melden „fertig" die Seite ansehen, die der Kunde sieht**, nicht nur die
  API-Antwort. Andorra stand zweimal auf „fertig" und war es nicht.
- **Widerlegte Regeln dort korrigieren, wo sie stehen** — nicht nur im Protokoll des
  Tages. Sonst folgt ihnen der nächste Lauf wieder.

## 11. Stand 28.08.2026

**Argentinien fertig:** Hoodie (1787), Sweater (1963), Shirt (2985).

**Albanien fertig und live:**

| Produkt | ID | Bilder | Varianten | Preis |
|---|---|---|---|---|
| Albanien Hoodie | 2681 | 63 | 84 | CHF 75 |
| Albanien Sweater | 2722 | 70 | 94 | CHF 65 |
| Albanien Shirt | 3168 | 63 | 82 | CHF 40 |

**Afghanistan fertig und live:**

| Produkt | ID | Bilder | Varianten | Preis | Farben |
|---|---|---|---|---|---|
| Afghanistan Hoodie | 2566 | 63 | 86 | CHF 75 | 9 |
| Afghanistan Sweater | 2668 | 63 | 86 | CHF 65 | 9 |
| Afghanistan Shirt | 3786 | 63 | 84 | CHF 40 | 9 |

**Andorra fertig, live und aufgeräumt** (Galerie am 28.08. auf Labis Auswahl gekürzt):

| Produkt | ID | Bilder in der Galerie | Varianten | Preis | Farben |
|---|---|---|---|---|---|
| Andorra Hoodie | 3968 | 42 (von 56) | 72 | CHF 75 | 8 |
| Andorra Sweater | 3888 | 39 (von 49) | 66 | CHF 65 | 7 |
| Andorra Shirt | 3108 | 56 (von 63) | 80 | CHF 40 | 9 |

Modelbilder **7666–7819**, freihängend **7642–7665**. Alle 144 Modelbilder wurden am
28.08. mit der korrigierten Farbkorrektur neu gerechnet und an Ort und Stelle ersetzt.
31 davon hat Labi anschliessend aus den Galerien nehmen lassen.

> ⚠ **Andorra Shirt Mindful Blue führt nur noch 3 Bilder und Red nur noch 4** (die
> anderen sieben Farben je 7). Bei Mindful Blue sind die zwei verbliebenen Modelbilder
> ausgerechnet Standbein-Posen. Nachgenerieren nur mit frontal/Taschen.

**Aufräumen abgeschlossen (28.08.):** Labi hat **185 Anhänge endgültig gelöscht** —
den alten Seedream-Satz 7474–7617, die 10 Doppelten aus dem Upload und die 31
aussortierten Modelbilder. Mediathek 1.172 → 987. **Snippet 97 ist im Papierkorb.**
Gegenprobe über 449 Bild-URLs der drei Produktseiten, `/andorra/`,
`/shop-by-country/` und der Startseite: alle HTTP 200, kein totes Bild.
Beleg: `claude/LOESCHLISTE-andorra-185-anhaenge-28082026.md`.

Protokolle: `claude/andorra-hautmaske-behoben-28082026.md` (gültig),
`claude/andorra-galerie-gekuerzt-28082026.md`,
`claude/andorra-halsring-behoben-27082026.md`,
`claude/andorra-farbstreifen-ursache-gefunden-27082026.md`,
`claude/andorra-freihaengende-neu-27082026.md`,
`claude/UEBERGABE-ANDORRA-FERTIGSTELLEN.md`.

**Offen, unabhängig vom nächsten Land:**
1. **Vier falsche Farbzuordnungen in PodOS** (24.08. gemessen).
2. **Argentinien nach den korrigierten Druckmassen neu rechnen?** Entscheidung Labi.
3. **Grössenmatrix des Albanien-Sweaters gegen Stanley/Stella prüfen**, ebenso die
   fehlenden 4XL/5XL beim Andorra-Hoodie.
4. **Warum kam der Albanien-Sweater ohne Varianten aus PodOS?** Und warum blieb der
   Afghanistan-Hoodie bei 58 von 86 stehen?
5. Weitere Länderseiten mit alten oder leeren Karten: anguilla, antigua-barbuda,
   bosnia, brazil, brunei, mexico, peru.
6. KI-Kennzeichnung.
7. **Korrigierte SVGs beim Designer anfordern** — 9 Länder mit dem Rotationsfehler.
   **Wieder hochholen, sobald ein Länderlauf eines der betroffenen Länder ansteht.**
8. Andorra Shirt Mindful Blue und Red auf sechs Modelbilder auffüllen (siehe oben).

**Erledigt und geschlossen:**
- Aufräumliste Andorra — 185 Anhänge am 28.08. gelöscht, siehe oben.
- **Halsfehler in Albanien / Argentinien / Afghanistan: gemessen, Entscheid „so lassen"**
  (Labi, 28.08.). Der Fehler ist vorhanden, aber schwächer als bei Andorra vor der
  Korrektur. Messwerte und die Kostenrechnung für eine spätere Behebung stehen in
  `claude/BEFUND-halsfehler-albanien-argentinien-afghanistan-28082026.md`.
  **Nicht wieder als offene Aufgabe aufnehmen**, solange Labi nichts anderes sagt.
