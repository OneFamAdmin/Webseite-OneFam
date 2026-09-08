# Preis-Wache: Protokollstand vor dem Zuruecksetzen — 08.09.2026, 22:5x

Gesichert, bevor Zaehler und Protokoll ueber **WooCommerce → OneFam Preis-Wache**
auf Null gestellt wurden. Danach beginnt die Zaehlung neu, damit der naechste
Vorfall sofort als neuer erkennbar ist.

## Stand zum Zeitpunkt der Sicherung

| | |
|---|---|
| Letzte Pruefung | **2026-09-08 20:36:34** |
| Vorfaelle seit Inbetriebnahme von Snippet 106 (07.09.2026) | **367** |
| Im Protokoll gehaltene Zeilen | **50** (Ringpuffer, aeltere fallen heraus) |

## Auswertung der 50 gehaltenen Zeilen

| | |
|---|---|
| Zeitraum | **20:35:54 bis 20:36:24** — 30 Sekunden |
| Betroffenes Produkt | **ausschliesslich** `onefam-white-logo-shirt` (ID 466, **privat**) |
| Verschiedene Variationen | **50** (IDs 467 bis 516, fortlaufend) |
| Muster | **ausschliesslich** „35 statt 40" |

Erste Zeile: `2026-09-08 20:36:24 | onefam-white-logo-shirt | Variation 467 | 35 statt 40`
Letzte Zeile: `2026-09-08 20:35:54 | onefam-white-logo-shirt | Variation 516 | 35 statt 40`

## Was daraus abzulesen ist

**Der vierte belegte Preis-Vorfall.** Die drei frueheren: 07.09. zweimal,
08.09. morgens einmal (188 Variationen, „60 statt 65").

- **35 ist der gerundete EUR-Preis des Shirts** (34,95), der im **CHF**-Feld
  landet — dasselbe Muster wie bei „60 statt 65" am Morgen. Das stuetzt die
  Annahme, dass in PodOS die EUR-Reihe steht.
- **Der Lauf war schnell:** 50 Variationen in 30 Sekunden, fortlaufende IDs —
  ein maschineller Durchlauf, kein Einzelzugriff.
- **Snippet 108 hat alles zurueckgestellt.** Nachgemessen am selben Abend:
  92 Variationen, **0 Abweichungen**, alle CHF 40.
- **Kein Schaden im Laden:** das Produkt ist `private`, also nicht kaufbar.
- **Der gleiche Sync hat keine Galeriebilder angefasst** — keine der 61 am
  08.09. entfernten Anhang-IDs ist zurueckgekehrt.

## Warum ueberhaupt 367 bei nur 50 Zeilen

Der Zaehler laeuft seit dem 07.09.2026 durch, das Protokoll haelt nur die
letzten 50 Zeilen. Die Differenz sind die drei frueheren Vorfaelle, deren Zeilen
inzwischen aus dem Ringpuffer gefallen sind.
