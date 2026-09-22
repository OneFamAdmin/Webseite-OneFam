# Siebdruck statt Stick — was die Motive bei welcher Groesse hergeben

Gemessen am **21.09.2026** an der Originaldatei
`~/Downloads/loco-motive_Logo_rgb_flags_final 2.pdf`, **alle 252 Seiten**, mit
`tools/sieb-messen.py`. Vollstaendige Zahlen je Land:
`docs/sicherungen/siebdruck-messwerte-252.csv`.

Anlass war Labis Frage: *koennte man, wenn der Stick nicht kommt, den Siebdruck
mit der 1,0-mm-Fassung machen — und das Motiv kleiner als 8 cm?*

> ## ⚠️ Zweimal nachgetragen — gueltig ist der Stand vom 22.09.2026
>
> **21.09., Roberts erste Zahl:** „Fuer alle Druck- und Stickverfahren sollte
> diese [die Mindeststrichstaerke] mindestens 1 bis 1,5 mm betragen." Eine Zahl
> fuer alle Verfahren, obwohl nach einer je Verfahren gefragt war.
>
> **22.09., auf Nachfrage aufgeschluesselt — und das ist die gueltige Auskunft:**
>
> | Verfahren | Mindeststrichstaerke |
> |---|---|
> | Digitaldruck (DTG/DTF) und **Stick** | **1,0 bis 1,5 mm** („1mm geht eben auch - 1,5mm ist halt besser") |
> | **Siebdruck** | **0,5 bis 1,0 mm** |
>
> **Damit ist der Vorteil des Siebdrucks wiederhergestellt**, aber kleiner als die
> urspruengliche Rechnung mit 0,3 mm annahm. Gueltig sind die Zeilen **0,5 mm**
> und **1,0 mm** der Tabelle unten, nicht die Zeile 0,3 mm.
>
> **Bei 8 cm Motivbreite, alle 252 Motive:**
>
> | Grenze | Motive ueber 5 % Verlust |
> |---|---|
> | Siebdruck bei 0,5 mm | **7** |
> | Siebdruck bei 1,0 mm | **36** |
> | Stick bei 1,5 mm | **45** |
>
> **Die Spanne ist das Problem.** Zwischen 0,5 und 1,0 mm liegen 7 gegen 36
> Motive, die angefasst werden muessen — ein Faktor fuenf. **Fuer eine Planung
> das konservative Ende nehmen (1,0 mm)**, oder bei Robert nachfassen, welche
> Zahl fuer seine Partnerbetriebe wirklich gilt.
>
> Er nennt ausserdem **8–10 cm** als Breite fuer ein Brustmotiv. Bei 10 cm und
> 0,5 mm faellt der Verlust auf **3 Motive ueber 5 %**.
>
> **Sein Fazit zum Siebdruck bleibt:** „eher unrentabel", Empfehlung DTF.
> → `docs/druck-und-lieferant.md`

---

## Die kurze Antwort zuerst

1. **Die 1,0-mm-Fassung ist fuer den Siebdruck die falsche Datei.** Sie ist eine
   Stick-Vereinfachung und wirft Detail weg, das der Siebdruck tragen koennte.
   Fuer Siebdruck nimmt man das **Original**.
2. **Kleiner als 8 cm geht** — wie weit, haengt an der Verfahrensgrenze. Bei
   Roberts **0,5 mm** fuer Siebdruck entspricht ein 4-cm-Motiv der 1,0-mm-Zeile:
   **36 Motive ueber 5 %**, also etwa das Niveau eines 8-cm-Sticks. **Bei 8 cm
   und 0,5 mm sind es nur 7.** Er empfiehlt ohnehin 8–10 cm.
3. **Die Grenze des Siebdrucks ist nicht die Feinheit, sondern die Farbzahl** —
   und die Mindestmenge von 100 statt 30 Stueck je Motiv.

---

## Wie gemessen wurde, und warum nicht mit dem alten Skript

`tools/motiv-messen.py` (12.09.2026) beantwortet genau eine Frage gegen genau
eine Grenze und zaehlt **nur Farben ueber 2 % der Motivflaeche**. Fuer den Stick
ist dieser Blindfleck harmlos — was darunter liegt, verschwindet ohnehin. Fuer
den Siebdruck ist es der ganze Punkt: das Verfahren kann das Feine, also muss es
mitgezaehlt werden.

`tools/sieb-messen.py` misst deshalb

* **neun Grenzen auf einmal** (0,2 bis 2,0 mm) — die Distanzkarte muss ohnehin
  nur einmal gerechnet werden;
* mit **0,1 % Farbschwelle** statt 2 %, damit Wappen, Schrift und Sterne als
  eigene Farbe ueberleben.

**Gegenprobe, dass die Quelle stimmt:** Motivbreite **1 142 bis 1 146 px** bei
400 dpi — genau die Spanne, die am 12.09.2026 an den EPS-Druckdaten gemessen
wurde. PDF und EPS liefern dieselbe Motivgroesse. Die nicht zugeordnete
Restflaeche liegt bei **median 0,00 %, hoechstens 0,45 %** — gegen 14,2 % bei der
alten 2-%-Schwelle. Der Blindfleck ist praktisch weg.

**Die Kennzahl ist massstabsfrei.** Der Anteil unter `g` mm bei einer
Motivbreite von `B` cm ist derselbe wie der Anteil unter `g * 8 / B` mm bei
8 cm. Deshalb reicht eine Messreihe fuer jede Druckgroesse.

---

## Die Messreihe — alle 252 Motive, bezogen auf 8 cm Motivbreite

| Grenze | Median | schlechtestes | unter 0,5 % | 0,5–2 % | 2–5 % | ueber 5 % |
|---|---|---|---|---|---|---|
| 0,2 mm | 0,00 % | 2,2 % | **245** | 5 | 2 | **0** |
| 0,3 mm | 0,00 % | 3,6 % | **233** | 16 | 3 | **0** |
| 0,4 mm | 0,00 % | 6,7 % | 214 | 25 | 10 | 3 |
| 0,5 mm | 0,00 % | 9,0 % | 208 | 22 | 15 | 7 |
| 0,6 mm | 0,00 % | 12,7 % | 198 | 15 | 23 | 16 |
| 0,8 mm | 0,00 % | 17,8 % | 187 | 17 | 23 | 25 |
| 1,0 mm | 0,01 % | 23,1 % | 178 | 20 | 18 | 36 |
| **1,5 mm** | 0,19 % | 36,2 % | 157 | 28 | 22 | **45** |
| 2,0 mm | 0,60 % | 43,8 % | 119 | 42 | 30 | 61 |

Die Zeile **1,5 mm** ist die Stickwelt bei 8 cm. Alles darueber ist der
Spielraum, den der Siebdruck dazugewinnt.

## Dieselben Zahlen als Druckgroesse gelesen

Siebdruck traegt eine tragende Farbflaeche erfahrungsgemaess bis rund **0,3 mm**
herunter (**Recherchewert, nicht von Shirt-King bestaetigt** — genau danach ist
in der Mail vom 15.09.2026 gefragt, Punkt 4). Damit liest sich die Tabelle so:

| Motivbreite | entspricht Zeile | unter 0,5 % | ueber 5 % | schlechtestes |
|---|---|---|---|---|
| 16,6 cm (Hoodie heute) | unter 0,2 mm | 245+ | **0** | — |
| 12 cm | 0,2 mm | **245** | **0** | 2,2 % |
| **8 cm** | 0,3 mm | **233** | **0** | 3,6 % (Ecuador) |
| 6 cm | 0,4 mm | 214 | 3 | 6,7 % |
| 4,8 cm | 0,5 mm | 208 | 7 | 9,0 % (Ecuador) |
| **4 cm** | 0,6 mm | 198 | 16 | 12,7 % (Portugal) |
| 3 cm | 0,8 mm | 187 | 25 | 17,8 % (Portugal) |
| 2,4 cm | 1,0 mm | 178 | 36 | 23,1 % (San Marino) |
| *Stick, 8 cm* | *1,5 mm* | *157* | *45* | *36,2 %* |

**Der Satz, auf den es ankommt:** Selbst ein Siebdruck mit **2,4 cm**
Motivbreite hat weniger Motive ueber der 5-%-Marke (36) als ein Stick mit
**8 cm** (45). Die Groesse ist im Siebdruck nicht der Engpass.

## Was im Siebdruck frueh kippt

| bei dieser Grenze (Breite) | Die schlechtesten Motive, Anteil in % |
|---|---|
| 0,3 mm (8 cm) | Ecuador 3,6 · Guatemala 3,1 · Turkmenistan 2,7 · Belize 1,9 · Haiti 1,7 · Falklandinseln 1,4 |
| 0,5 mm (4,8 cm) | Ecuador 9,0 · Guatemala 8,0 · Haiti 5,8 · Portugal 5,6 · Belize 5,5 · Saint-Barthelemy 5,4 · Bhutan 5,3 |
| 0,6 mm (4 cm) | Portugal 12,7 · Ecuador 11,2 · Haiti 10,9 · Spanien 10,4 · Serbien 10,3 · Guatemala 10,0 |

Es sind durchweg die **Wappenflaggen** — dieselben, die am Hoodie auch beim Stick
draussen bleiben (Portugal, Haiti, Serbien, Spanien).

---

## Der eigentliche Engpass: die Farbzahl

Jede Farbe ist im Siebdruck ein eigenes Sieb, und **die weisse Unterlage auf
dunklem Stoff zaehlt als zusaetzliche Druckfarbe** (Robert Koch, 15.09.2026).

**Gemessen am Original, ohne Vereinfachung: median 3 Farbflaechen, Mittel 4,4,
hoechstens 26.**

| Farben | 2 | 3 | 4 | 5 | 6 | 7–8 | 9–12 | ueber 12 |
|---|---|---|---|---|---|---|---|---|
| Motive | 46 | 92 | 54 | 20 | 9 | 9 | 15 | 7 |

**31 Motive brauchen mehr als 6 Farben, 22 mehr als 8.** Die Spitze:
Ecuador 26 · Falklandinseln 23 · Mexiko 22 · Nicaragua 20 · Suedgeorgien 18 ·
Guatemala 16 · Belize 15 · Noerdliche Marianen 12 · St. Helena 12 · San Marino 12.

Ecuador mit 26 Sieben plus Weissunterlage ist keine Kalkulation, sondern ein
Ausschluss. **Hier — nicht bei der Feinheit — braeuchte der Siebdruck eine
vereinfachte Fassung**, und zwar eine nach Farbzahl vereinfachte, nicht die
Stickfassung nach Strichbreite. Zum Vergleich: die 1,5-mm-Stickfassung kommt auf
median 3, hoechstens 8 Farben — sie loest dieses Problem nebenbei mit, aber um
den Preis des Details.

---

## Was am Verfahren haengt, unabhaengig vom Bild

| | Stick | Siebdruck |
|---|---|---|
| Mindestmenge je Motiv | **30** | **100** |
| ueber alle 252 Laender | 7 560 Teile | **25 200 Teile** |
| Shirt + Sweater + Hoodie zusammen? | gefragt am 15.09., offen | ja — **nur bei gleicher Druckgroesse** |
| Nachauflage guenstiger | offen | **nein**, Einrichtung faellt jedes Mal neu an |
| Kosten je Farbe | Garnwechsel | eigenes Sieb, Weissunterlage zaehlt mit |
| Textil-Haken | 8 x 10 cm wird auf 180 g/m² steif | keiner |

**Beide sind eine Auflage, kein Print-on-Demand.** Lieferzeit 10–12 Werktage
statt der live zugesagten 3–7, Widerrufsausschluss faellt, Produktseiten und
Versandrichtlinie in vier Sprachen neu. → `docs/druck-und-lieferant.md`,
Abschnitt „Was der Siebdruck kaputt machen wuerde".

## Zwei Vorbehalte, die diese Messung nicht aufloest

1. ~~**Die 0,3 mm sind Recherche**~~ **Erledigt am 22.09.2026:** Robert nennt
   fuer Siebdruck **0,5 bis 1,0 mm**, fuer Digitaldruck und Stick 1,0 bis 1,5 mm.
   Die 0,3-mm-Zeile der Tabelle ist damit gegenstandslos; gueltig sind 0,5 und
   1,0 mm. Siehe Nachtrag am Anfang.
2. **Der Passer ist bei diesen Motiven vermutlich die haertere Grenze als die
   Strichbreite.** Die Flagge liegt *in* den Strichen, die Farben stossen direkt
   aneinander; jede ist ein eigener Siebdurchgang. Die Passgenauigkeit auf Textil
   liegt erfahrungsgemaess bei 0,3–0,5 mm. Bei 8 cm und 2,9 mm Gesichtslinie ist
   das mit Ueberfuellung loesbar, bei 4 cm nicht mehr selbstverstaendlich.
   **Gehoert in dieselbe Rueckfrage an Robert** — bisher unbeantwortet.

## Die 8 cm sind ohnehin nicht die geltende Zahl

8 cm ist die **Bezugsgroesse der Stickmessung**, keine Druckvorgabe. Die echten
Druckbreiten sind heute **6,9 cm** (Shirt, Sweater) und **16,6 cm** (Hoodie).
„8 cm Motivbreite" wurde vor dem Senden aus der Robert-Mail gestrichen, weil die
Zahl am 12.09.2026 als falsch erkannt wurde. Im Siebdruck muss ohnehin **eine**
Druckgroesse fuer alle drei Teile gelten, sonst zwei Siebsaetze und die 100
teilen sich — kleiner werden hilft dort also, die Menge ueberhaupt zu erreichen.
