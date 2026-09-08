# Sicherung: Galerie Produkt 2985 „Argentinien Shirt" — Stand vor dem 08.09.2026

Vor dem Entfernen von zwoelf schlecht erzeugten Modellbildern aufgenommen.
**49 Bilder**, Reihenfolge wie sie die `wc/v3`-Schnittstelle geliefert hat
(das erste ist das Hauptbild).

Zurueckdrehen: genau diese Reihenfolge wieder an
`POST /wp-json/wc/v3/products/2985` als `images: [{id: ...}, ...]` schicken —
im eingeloggten wp-admin, Nonce aus `wpApiSettings`.

## Die 49 Anhang-IDs in der urspruenglichen Reihenfolge

```
7125,7371,7372,7370,7375,7374,7373,7120,7365,7366,7364,7369,7368,7367,7121,
7359,7360,7358,7363,7362,7361,7123,7348,7347,7346,7351,7350,7349,7124,7342,
7341,7340,7344,7345,7343,7126,7336,7335,7334,7339,7338,7337,7122,7354,7353,
7352,7357,7356,7355
```

## Die zwoelf entfernten Bilder

| Anhang-ID | Datei |
|---|---|
| 7359 | `..._Red_Frau_frontal` |
| 7361 | `..._Red_Mann_Huefte` |
| 7354 | `..._MindfulBlue_Frau_frontal` |
| 7352 | `..._MindfulBlue_Frau_Huefte` |
| 7355 | `..._MindfulBlue_Mann_Huefte` |
| 7348 | `..._CottonPink_Frau_frontal` |
| 7349 | `..._CottonPink_Mann_Huefte` |
| 7342 | `..._CoolHeatherGrey_Frau_frontal` |
| 7343 | `..._CoolHeatherGrey_Mann_Huefte` |
| 7371 | `..._schwarz_Frau_frontal` |
| 7374 | `..._schwarz_Mann_Taschen` |
| 7336 | `..._AquaBlue_Frau_frontal` |

**Die Dateien liegen weiter in der Mediathek** — entfernt wurde nur die
Zuordnung zur Produktgalerie. Keine der **62 Variationen** benutzte eines der
zwoelf als Variationsbild; das wurde vorher geprueft.

## Wie die Bilder identifiziert wurden

Alle zwoelf ueber die **Position des markierten Thumbnails** — bei diesem
Durchgang war die Leiste auf jedem Screenshot sichtbar. Reihenfolge je Farbe:
1 Freihaengend, 2 Frau_frontal, 3 Frau_Taschen, 4 Frau_Huefte, 5 Mann_frontal,
6 Mann_Taschen, 7 Mann_Huefte. Anschliessend jedes Bild mit dem Original
verglichen.

**Ein Sonderfall:** auf dem roten Screenshot waren **zwei** Thumbnails umrandet
(Position 2 und 3) — eines aktiv, eines unter dem Mauszeiger. Aufgeloest wurde
das am Bild: die Frau hat die Arme seitlich haengen, nicht in den Hosentaschen,
also `Frau_frontal` und nicht `Frau_Taschen`.
