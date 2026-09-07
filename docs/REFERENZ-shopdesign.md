# Referenzwerte aus fremden Shops — gemessen am 06.09.2026

**Wozu das da ist.** Der Eindruck „der Shop wirkt billig" sollte nicht mit Geschmack
beantwortet werden, sondern mit Zahlen. Fünf Shops wurden mit **demselben Messskript**
und **demselben Fenster (1440 × 685)** vermessen, danach OneFam mit genau demselben.

**Was hier NICHT passiert ist: fremder Code wurde nicht übernommen.** Gemessen wurden
nur Masse und Verhältnisse — Höhe, Fläche, Schriftgrösse, Seitenverhältnis. Das ist
zulässig; Layout-Code aus fremden Themes zu kopieren wäre es nicht.

## Die Auswahl und warum

| Shop | warum als Referenz |
|---|---|
| **Colorful Standard** | dasselbe Problem wie OneFam: ein Basic in vielen Farben |
| **Asket** | radikal reduziert, bewusst textlicher Einstieg — der Gegenpol |
| **Everlane** | Premium-Basics mit starker Produktfotografie |
| **Aimé Leon Dore** | Bildsprache trägt die ganze Marke |
| **Carhartt WIP** | grosse Variantenauswahl, bewegter Hero |

## Startseiten

| Shop | erstes Bild ab | Bildfläche 1. Bildschirm | Seitenhöhe | H1 |
|---|---|---|---|---|
| Aimé Leon Dore | **0 px** | 100 % | 2,1 Bildschirme | 17 px |
| Carhartt WIP | **0 px** | 99 % | 8,2 | 16 px |
| Colorful Standard | **0 px** (3 Kacheln) | 98 % | 4,4 | 14 px |
| Everlane | **106 px** (0,15 × Fenster) | 110 % | 8,8 | 32 px |
| Asket | **279 px** (0,41 × Fenster) | 0 % | 10,4 | 13,5 px |
| **OneFam** (06.09., vorher) | **Video, aber ohne Vorschaubild** | **0 %, bis es geladen ist** | **9,8** | **64 px** |
| **OneFam** (07.09., jetzt) | **438 px** (0,64 × Fenster) | **36 %** | **9,6** | **32 px** |

**Zwei Werte springen heraus.**

1. **Die Überschrift.** OneFam 64 px, alle fünf Referenzen zwischen 13,5 und 32 px —
   Faktor 2 bis 5. Keiner dieser Shops schreibt gross; sie zeigen gross.
2. **Der Bildeinstieg.** Bei vier von fünf beginnt das Bild zwischen 0 und 106 px.
   Selbst Asket, das bewusst mit Text anfängt, hat nach 279 px (41 % des Fensters)
   das erste Bild — und dieser Text ist **13,5 px** klein.

**Seitenhöhe ist kein Kriterium.** Sie reicht von 2,1 (Aimé Leon Dore) bis 10,4
Bildschirmen (Asket). OneFam liegt mit 9,8 im Rahmen. Die Länge der Startseite ist
also nicht das Problem — der Einstieg ist es.

## ⚠️ Der Hero von OneFam — die frühere Aussage war falsch

Am 06.09.2026 hiess es in dieser Dokumentation, der Hero habe **kein Bild**. Das
stimmt nicht. Er hat ein **Video**:

| | |
|---|---|
| Datei | `88fbdf03c77046019c9d400743b2ed69.HD-1080p-2.5Mbps-88218841.mp4` |
| Grösse | **6,0 MB** (HD 1080p, 2,5 Mbit/s) |
| Attribute | `autoplay muted loop playsinline` |
| **`poster`** | **fehlt** — im ganzen HTML kein einziges `poster=` |

**Das ist der eigentliche Fehler.** Ohne Vorschaubild zeigt der Hero bis zum Laden
des Videos nur die Hintergrundfarbe `#2C2620` — und darüber die 64-px-Überschrift.
Bei 6 MB dauert das auf einer Mobilverbindung mehrere Sekunden. Betroffen sind
ausserdem alle, bei denen Autoplay nicht läuft: iOS im Stromsparmodus, Datensparmodus,
entsprechende Browsereinstellungen. Die sehen **nie** ein Bild.

Die erste Messung hat das Video übersehen, weil sie nur nach `background-image` und
`<img>` gesucht hat. Ein `<video>` ohne `poster` sieht in einer solchen Messung aus
wie „kein Bild" — und für einen Teil der Besucher ist es das auch.

## Produktseiten

| | Colorful Standard | OneFam |
|---|---|---|
| Galeriebilder | 10 | 9 (7 nach Farbwahl) |
| Bildformat | 4:5 hoch | **4:5 hoch** |
| H1 | 22 px | 30 px |
| Seitenhöhe | 3,6 Bildschirme | 4,8 |

**Die Produktseite ist nicht das Problem.** Bei jeder gemessenen Kennzahl liegt
OneFam im selben Bereich wie die Referenz. Bildformat sogar identisch.

Bildformate der übrigen Referenzen: Asket 3:4 hoch (32 Bilder), Everlane gemischt
(8 × 4:5 hoch, 5 × quer), Colorful Standard 4:5 hoch (164 Bilder). **Hochformat ist
der Standard**, das Verhältnis liegt zwischen 3:4 und 4:5 — OneFam liegt richtig.

## Was daraus folgt

1. **Ein `poster` für das Hero-Video.** Der kleinste Eingriff mit der grössten
   Wirkung: ein Standbild aus dem Video, das sofort steht. Kostet nichts ausser dem
   Bild.
2. **Die Überschrift kleiner.** 64 px gegen 13,5–32 px bei allen Referenzen.
3. **Video verkleinern.** 6 MB für einen Hintergrundlauf ist viel; 1080p bei 2,5 Mbit/s
   ist für eine stumme Endlosschleife überdimensioniert.
4. **Nicht anfassen:** Produktseite, Bildformat, Seitenlänge — die sind in Ordnung.

---

## Nachtrag 07.09.2026 — beide Abweichungen sind behoben

| | Referenzen | OneFam vorher | OneFam jetzt |
|---|---|---|---|
| Ueberschrift | 13,5 – 32 px | 64 px | **32 px** |
| erstes Bild ab | 0 – 279 px | Video ohne Vorschaubild, erstes Kleidungsstueck bei 920 px | **438 px, Kleidungsstueck** |

Damit liegt OneFam bei beiden Werten im Feld der fuenf Referenzen. Was gemacht wurde,
steht in `stand.md` unter „Hero umgebaut".

**Eine Erkenntnis gehoert hierher, weil sie die Messung selbst betrifft:** die erste
Messung sah im Hero „kein Bild", die zweite „ein Video ohne poster". Beides war
richtig gemessen und beides hat die Ursache verfehlt. Die lag im **Zuschnitt** des
Videos — die Marke nimmt darin nur 24,6 % der Breite ein, weshalb `object-fit:cover`
sie aufblaeht und die Ueberschrift in ihr landet. Das sieht man in keiner Kennzahl,
nur im Bild. **Nach der Messung hinsehen.**
