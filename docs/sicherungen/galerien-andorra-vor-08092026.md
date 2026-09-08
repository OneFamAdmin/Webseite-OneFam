# Sicherung: Galerien der drei Andorra-Produkte — Stand vor dem 08.09.2026

Vor dem Entfernen von 19 schlecht erzeugten Modellbildern aufgenommen.
Reihenfolge wie sie die `wc/v3`-Schnittstelle geliefert hat (das erste ist das
Hauptbild).

Zurueckdrehen: die jeweilige Reihenfolge wieder an
`POST /wp-json/wc/v3/products/<id>` als `images: [{id: ...}, ...]` schicken —
im eingeloggten wp-admin, Nonce aus `wpApiSettings`.

## Andorra Sweater — Produkt 3888, 39 Bilder

```
7665,7816,7815,7814,7818,7817,7661,7791,7790,7794,7793,7662,7798,7797,7796,
7801,7800,7799,7659,7780,7778,7782,7660,7786,7785,7789,7788,7664,7804,7803,
7802,7806,7805,7663,7810,7809,7808,7813,7811
```

Entfernt (**4**): `7799` MindfulBlue_Mann_Huefte · `7785` CottonPink_Frau_Taschen ·
`7806` Red_Mann_Taschen · `7818` schwarz_Mann_Taschen

## Andorra Hoodie — Produkt 3968, 42 Bilder

```
7649,7720,7719,7723,7722,7721,7643,7673,7672,7675,7647,7708,7707,7706,7711,
7709,7646,7691,7689,7699,7695,7644,7681,7678,7687,7683,7645,7701,7700,7705,
7703,7648,7713,7712,7716,7715,7642,7667,7666,7671,7670,7669
```

Entfernt (**5**): `7672` BrightBlue_Frau_Huefte · `7720` schwarz_Frau_frontal ·
`7671` Anthracite_Mann_frontal · `7670` Anthracite_Mann_Taschen ·
`7669` Anthracite_Mann_Huefte

## Andorra Shirt — Produkt 3108, 56 Bilder

```
7658,7774,7773,7772,7777,7776,7775,7657,7768,7767,7766,7771,7770,7769,7656,
7762,7761,7765,7655,7754,7757,7654,7750,7749,7748,7753,7752,7751,7653,7744,
7743,7742,7747,7746,7745,7652,7738,7737,7736,7741,7740,7739,7651,7732,7731,
7730,7735,7734,7733,7650,7726,7725,7724,7729,7728,7727
```

Entfernt (**10**): `7767` WorkerBlue_Frau_Taschen · `7753` MidHeatherGrey_Mann_frontal ·
`7776` schwarz_Mann_Taschen · `7734` AquaBlue_Mann_Taschen · und **alle sechs
Anthracite-Modellbilder**: `7726` Frau_frontal · `7725` Frau_Taschen ·
`7724` Frau_Huefte · `7729` Mann_frontal · `7728` Mann_Taschen · `7727` Mann_Huefte

**Anthracite zeigt danach nur noch das Shirt freihaengend.** Ausdruecklich so
bestaetigt; es werden keine neuen Bilder erzeugt.

## Zuordnung

Auch die Andorra-Galerien sind **unregelmaessig** (drei bis sieben Ansichten je
Farbe) — dieselbe Falle wie bei Afghanistan, die feste Argentinien-Tabelle gilt
hier nicht. Zugeordnet wurde je Farbe ueber die tatsaechliche Liste aus der
Schnittstelle, danach jedes Bild mit dem Original verglichen.

**Zwei Screenshots hatten zwei umrandete Thumbnails** (eines aktiv, eines unter
dem Mauszeiger). Aufgeloest am Bild: beim Hoodie in Schwarz lacht die Frau mit
haengenden Armen (`Frau_frontal`, nicht `Frau_Taschen`), beim Shirt in Worker
Blue lacht sie mit Haenden in den Hosentaschen (`Frau_Taschen`, nicht
`Frau_Huefte`).

**Die Dateien liegen weiter in der Mediathek.** Keine der Variationen
(76 / 82 / 80) benutzte eines der 19 Bilder als Variationsbild.
