# Stick, DTF oder DTG — je Land

Gemessen am **12.09.2026** an den 196 Motivdateien in `public/faces/`. Das ist die
erste Messung dieser Art; vorher lag hier eine **Einschaetzung nach Flaggenaufbau,
und die war falsch** — warum, steht gleich unten.

> **Vorbehalt, der mitzulesen ist:** gemessen wurden die **Webdateien** (256 × 256 px,
> PNG), nicht die Druck-PDF. Die liegen unter `~/Downloads/Designs/Muster shirt-king/`
> auf dem Mac und sind hier nicht erreichbar. Fuer die Geometrie des Motivs reicht
> das; fuer eine Freigabe an den Sticker ist **die Druckdatei** zu vermessen.
> Ausserdem stehen im Shop **252** Laender, hier sind **196** Dateien.

---

## Was das Motiv wirklich ist — die alte Annahme war falsch

Bis zum 12.09.2026 stand in `druck-und-lieferant.md`, die Motive seien „das lachende
Gesicht mit der **Flagge dahinter**, also flaechige Farbfelder". **Das stimmt nicht.**

Das Motiv ist eine **Strichzeichnung des Gesichts** — Brauen, Augen, Nase, Mund und
Wangenbogen als einzelne, **unterbrochene** Striche. Die Flagge ist **nicht
dahinter**, sie liegt **in den Strichen drin**: jeder Strich ist mit dem
Flaggenausschnitt gefuellt, der an dieser Stelle liegt. Ausserhalb der Striche ist
das Motiv **leer**.

Das dreht die ganze Beurteilung um. Nicht die Flagge entscheidet, ob ein Land
stickbar ist, sondern **wie klein die Farbstuecke innerhalb eines 5-mm-Strichs
werden**.

## Die Messwerte

| | Wert |
|---|---|
| Motivbreite auf dem Shirt (PodOS) | **80 mm** |
| Strichbreite, Mittel ueber alle 196 Motive | **5,35 mm** (Spanne 5,33 bis 5,42) |
| duennste Stellen (auslaufende Strichenden) | **rund 1,4 mm** |
| Hauptfarben je Motiv (ueber 2 % Flaeche) | Median **4**, Spanne **2 bis 18** |
| kleinste zusammenhaengende Farbflaeche | teils **1,0 mm²** |

**Die Strichzeichnung selbst ist fuer alle 196 Laender identisch** — gleiche
Bounding-Box, gleiche Deckung, gleiche Strichbreite. Nur die Fuellung wechselt.

**Damit ist der Strich kein Problem.** 5,35 mm liegt weit ueber der Stickgrenze von
3 bis 4 mm. Das Problem sind die **Farbwechsel im Strich**.

## Was das fuer die drei Verfahren heisst

| Verfahren | Urteil fuer dieses Motiv |
|---|---|
| **Stickerei** | Der Strich ist breit genug. Es scheitert oder gelingt an der Zahl der Farben und an Farbstuecken unter etwa 2 mm². |
| **DTF** | Unkritisch. Die Sorge „feine Linien brechen auf" gilt fuer echte Haarlinien; bei 5,35 mm breiten Strichen ist das kein Thema. Deckkraft schon im Film. |
| **DTG** | Technisch bei allen 252 moeglich. Haengt weiter am Test der Weissdeckung auf dunklem Stoff. |

**Zur Haltbarkeit, weil es leicht verwechselt wird:** DTG **blaettert nicht ab** — die
Tinte sitzt in der Faser, sie **verblasst** mit den Waeschen. Was abplatzen oder sich
an den Raendern loesen kann, ist die **DTF-Folie**, weil sie auf dem Stoff aufliegt.
Wer wegen „blaettert ab" von DTG auf DTF wechselt, tauscht also das Verblassen gegen
genau das Risiko ein, das er vermeiden wollte. Der Ausweg gegen beides heisst
**Stickerei** — dort gibt es weder Tinte noch Folie.

---

## Die Einteilung

Schwellen, offengelegt, damit sie nachpruefbar sind:

| Gruppe | Bedingung |
|---|---|
| **A — ohne Vorbehalt stickbar** | hoechstens 3 Hauptfarben, unter 1 % der Flaeche in Stuecken kleiner 4 mm², kleinstes Farbstueck mindestens 2 mm² |
| **B — stickbar, aber das Motiv muss vereinfacht werden** | hoechstens 5 Hauptfarben, hoechstens 8 % der Flaeche in Stuecken kleiner 4 mm² |
| **C — nicht sticken, sondern DTF** | alles andere: Wappen, Schrift oder viele kleine Sterne im Strich |

### A — ohne Vorbehalt stickbar (60 Laender)

Armenien, Bangladesch, Barbados, Benin, Bolivien, Botswana, Bulgarien, Chile,
DR Kongo, Deutschland, Dominik. Rep., Estland, Gabun, Georgien, Grenada,
Grossbritannien, Guinea, Indonesien, Irland, Island, Israel, Jamaika, Jemen,
Kanada, Kolumbien, Kongo, Kosovo, Laos, Lettland, Litauen, Luxemburg,
Madagaskar, Malediven, Mali, Mauretanien, Monaco, Niederlande, Niger,
Nigeria, Nordmaz., Norwegen, Panama, Peru, Polen, Rumänien, Schweden,
Schweiz, Sierra Leone, Somalia, St. Vincent, Togo, Trinidad & Tobago, Tschad,
Tschechien, Tunesien, Türkei, Ukraine, Ungarn, Vietnam, Österreich.

### B — stickbar nach Vereinfachung (112 Laender)

Sterne werden rundlich, Wappen werden zur Silhouette, benachbarte Toene fallen
zusammen. **Je Motiv einmal von Hand zu entscheiden** — das ist Arbeit, keine
Einstellung.

Albanien, Algerien, Angola, Antigua & B., Argentinien, Aserbaidschan,
Australien, Bahamas, Bahrain, Belarus, Belgien, Bosnien, Brasilien, Brunei,
Burkina Faso, Burundi, Costa Rica, Dschibuti, Dänemark, El Salvador,
Elfenbeinküste, Eritrea, Fidschi, Finnland, Frankreich, Gambia, Ghana,
Griechenland, Guatemala, Guinea-Bissau, Haiti, Honduras, Indien, Irak, Iran,
Italien, Japan, Jordanien, Kamerun, Kap Verde, Kasachstan, Katar, Kenia,
Kiribati, Komoren, Kroatien, Kuba, Kuwait, Lesotho, Libanon, Liberia, Libyen,
Liechtenstein, Malawi, Malaysia, Malta, Marokko, Marshallinseln, Mauritius,
Mexiko, Mikronesien, Mongolei, Mosambik, Myanmar, Namibia, Nauru, Nepal,
Neuseeland, Nordkorea, Oman, Pakistan, Palau, Palästina, Papua-Neuguinea,
Paraguay, Philippinen, Ruanda, Salomonen, Samoa, Seychellen, Simbabwe,
Singapur, Slowakei, Slowenien, St. Kitts & N., St. Lucia, Sudan, Suriname,
Syrien, São Tomé & P., Südafrika, Südkorea, Tadschikistan, Taiwan, Tansania,
Thailand, Timor-Leste, Tonga, Tuvalu, USA, Uganda, Uruguay, Usbekistan,
Vanuatu, Vatikan, Venezuela, Ver. Arab. Emirate, Zentralafr. Rep., Zypern,
Ägypten, Äquatorialguinea, Äthiopien.

### C — nicht sticken, mit DTF drucken (24 Laender)

Afghanistan, Andorra, Belize, Bhutan, China, Dominica, Ecuador, Eswatini,
Guyana, Kambodscha, Kirgisistan, Moldau, Montenegro, Nicaragua, Portugal,
Sambia, San Marino, Saudi-Arabien, Senegal, Serbien, Spanien, Sri Lanka,
Südsudan, Turkmenistan.

---

## Die Signature

Logo Black, Logo White und die einfarbigen Toene sind der **ideale** Stickfall: eine
Farbe, breite Striche, kein Detail. Das bunte Logo mit **Farbverlauf** laesst sich
nicht sticken — ein Verlauf waere in Farbstufen zu zerlegen und damit ein anderes
Motiv.

## Was gegen einen Alleingang spricht

**Stickerei bei Shirt-King gibt es ab 30 Stueck je Motiv** (Quelle: die
Produktseiten und die FAQ von shirt-king.de, gelesen am 12.09.2026). Das ist
**kein Print-on-Demand mehr**, sondern eine Auflage — wie der Siebdruck, nur mit
niedrigerer Schwelle (dort 100).

Fuer 252 Laender heisst das 252 × 30 Stueck, und dazu je Motiv einmal die
**Stickdatei** (Punchen), die ebenfalls je Motiv kostet. **Rechnerisch ist Stick
fuer die Laenderlinie kein Weg** — wohl aber fuer die **Signature**, wo es genau ein
Motiv in wenigen Farben ist.

## Garn: welcher Glanz

| | Viskose (Rayon) | Polyester |
|---|---|---|
| Glanz | **hoeher**, weicher Seidenglanz | etwas ruhiger, mit **trilobalem** Garn nahe dran |
| Haltbarkeit | verliert den Glanz nach mehreren Waeschen, wird matt | farb-, wasch-, UV- und chlorbestaendig |
| geeignet fuer | Dekoratives, selten Getragenes | **Kleidung, die oft gewaschen wird** |

**Empfehlung: trilobales Polyester.** Der gewuenschte leichte Glanz ist da, ohne dass
das Motiv nach zehn Waeschen stumpf aussieht — und ein Shirt, das getragen wird, wird
oft gewaschen. Reine Viskose nur, wenn der Glanz wichtiger ist als der Zustand nach
einem Jahr. **Das ist Recherche, nicht gemessen**; welche Garnreihen Shirt-King
fuehrt, ist zu erfragen.

## Was als Naechstes zu messen ist

1. Dieselbe Messung an den **Druck-PDF** statt an den Webdateien.
2. Die **56 fehlenden** Laender (196 Dateien gegen 252 Produkte im Shop).
3. Bei Shirt-King erfragen: Stickpreis je Stueck, Kosten fuers Punchen, gefuehrte
   Garnreihen, und ob die 30 Stueck je Motiv oder je Bestellung gelten.
