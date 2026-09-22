# Stickdateien für Robert — was da ist, was fehlt

Geprüft am **22.09.2026**, nachdem Robert geschrieben hat, er brauche für die
Kalkulation „**1:1 die finalen Motive inklusive der gewünschten Stickgröße**".
Ohne diese Dateien gibt es keinen Stückpreis, und ohne Stückpreis keine
Kalkulation und keinen Drop-Termin.

---

## Was da ist

| | |
|---|---|
| **Original-PDF**, 252 Seiten | `~/Downloads/loco-motive_Logo_rgb_flags_final 2.pdf`, 12,4 MB ✅ |
| **Der Erzeugungs-Code** | `tools/stickfassung/` — `mapping.py`, `v2.py`, `produktion.py`, `lauf_alle.py`, `namen.py`, `iso.txt` ✅ |
| **Alle Messwerte** | `docs/sicherungen/stickfassung-messwerte-252.csv` ✅ |
| **Die EPS-Druckdaten** | liegen auf der externen Platte **„Labi Extern"** — die Platte **ist angeschlossen** |

## Was fehlt

| | |
|---|---|
| **Das ZIP `OneFam_Stickfassung_1-5mm_alle-252.zip`** | **nirgends auf dem Mac.** Downloads, Dokumente und Schreibtisch durchsucht. Es existierte nur im Chat vom 17.09. |
| `cv2` (opencv-python) | **nicht installiert** — `v2.py` braucht es |
| `skimage` (scikit-image) | **nicht installiert** — `v2.py` braucht es für `skeletonize` |
| `pdftoppm` (poppler) | **nicht installiert** — `lauf_alle.py` ruft es zum Rendern auf |

**Damit läuft die Pipeline aktuell nicht.** `pip` und Homebrew sind vorhanden,
die Nachinstallation ist also möglich.

## ⚠️ Die externe Platte ist gesperrt

`ls "/Volumes/Labi Extern/"` antwortet mit **„Operation not permitted"** — TCC
blockiert externe Datenträger für das Terminal. Die EPS sind also da, aber für
Claude Code nicht erreichbar. **Entweder Labi kopiert den Ordner auf die interne
Platte, oder dem Terminal wird Festplattenvollzugriff gegeben.**

---

## Die Entscheidung, die vor dem Erzeugen steht

**Welche Fassung bekommt Robert?**

| | **Original (EPS)** | **Stickfassung 1,5 mm** |
|---|---|---|
| Datenart | **echte Vektoren** aus Illustrator | aus Pixeln vektorisiert (`cv2.findContours`), also treppige Konturen |
| Detail | vollständig | vereinfacht, kleinste Farbfläche 1,5 mm |
| Farben | median 3, höchstens 10 | median 3, höchstens 8 |
| Erreichbar | Platte, aber gesperrt | muss erst erzeugt werden (~25 Min) |

**Was für das Original spricht:** Robert hat am 22.09. gesagt, beim Stick gehe
**1,0 mm** — die 1,5-mm-Fassung ist also konservativer als nötig. Und der
Puncher digitalisiert ohnehin neu; er braucht die beste Vorlage, nicht die schon
reduzierte.

**Was für die Stickfassung spricht:** Sie zeigt, wie es gemeint ist. Sonst
punched er Details, die nachher niemand sehen will, und das Ergebnis überrascht.

**Naheliegend ist beides zusammen:** das Original als Vorlage, die Stickfassung
als Absichtserklärung — mit einem Satz dazu, dass die Vereinfachung auf 1,5 mm
gerechnet ist und er bei 1,0 mm gern mehr stehenlassen darf.

## Welche Motive — nicht alle 252

Für eine Kalkulation braucht Robert die **Spanne**, nicht die Sammlung. Aus den
Messwerten der 1,5-mm-Fassung:

| Rolle | Motiv | Farben | Anteil unter 1,5 mm |
|---|---|---|---|
| **einfachster Fall** | Katar, Österreich, Schweiz, Bahrain | **2** | 1,5–1,6 % |
| **Mittelfeld** (der Normalfall) | 105 Motive mit **3 Farben** | 3 | — |
| **schwerster Fall** | **Guam**, **San Marino** | **8** | 4,0–4,3 % |
| **schlechtester Verlustwert** | **Nördliche Marianen** | 7 | **7,2 %** |

Farbverteilung über alle 252 nach der Vereinfachung:
**2 Farben: 54 · 3 Farben: 105 · 4 Farben: 58 · 5 Farben: 21 · 6 Farben: 7 ·
7 Farben: 4 · 8 Farben: 3**

## 💡 Der naheliegende erste Drop ist kein Land

**Die Signature-Linie.** Gründe, alle schon belegt:

- **Einfarbig** — „der ideale Stickfall: eine Farbe, breite Striche, kein Detail"
  (`stick-und-druck-je-land.md`). Kein Garnwechsel, kein Farbaufpreis.
- **Ein Motiv statt 252** — also **65 € Punchkosten statt 16 380 €**.
- **Die 30 Stück zählen über Shirt, Sweater und Hoodie zusammen** (Robert,
  16.09.) — bei einer einzigen Linie damit erreichbar.
- Es löst nebenbei das Weiss-Problem: Garn deckt immer.

**Für die Länderlinie gilt weiter:** 252 Motive × 65 € Punchen × 30 Stück
Mindestmenge. Das ist kein Vollausbau, das ist ein Drop nach dem anderen.
