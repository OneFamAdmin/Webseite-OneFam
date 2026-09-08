# Sicherung: Galerien der drei Afghanistan-Produkte — Stand vor dem 08.09.2026

Vor dem Entfernen von 15 schlecht erzeugten Modellbildern aufgenommen.
Reihenfolge wie sie die `wc/v3`-Schnittstelle geliefert hat (das erste ist das
Hauptbild).

Zurueckdrehen: die jeweilige Reihenfolge wieder an
`POST /wp-json/wc/v3/products/<id>` als `images: [{id: ...}, ...]` schicken —
im eingeloggten wp-admin, Nonce aus `wpApiSettings`.

## Afghanistan Shirt — Produkt 3786, 47 Bilder

```
7078,7245,7253,7261,7270,7288,7128,7244,7254,7263,7271,7281,7290,7071,7246,
7255,7264,7279,7074,7247,7257,7243,7292,7076,7248,7256,7273,7283,7129,7252,
7266,7275,7284,7077,7259,7267,7276,7285,7070,7262,7268,7287,7075,7250,7269,
7277,7295
```

Entfernt (**2**): `7244` Anthracite_Frau_frontal · `7271` Anthracite_Mann_frontal

## Afghanistan Hoodie — Produkt 2566, 46 Bilder

```
7059,7420,7428,7421,7423,7432,7426,7062,7429,7430,7435,7058,7422,7060,7442,
7445,7446,7440,7449,7055,7437,7444,7057,7448,7460,7463,7056,7452,7459,7453,
7456,7464,7455,7053,7462,7457,7461,7465,7458,7054,7468,7472,7467,7469,7470,
7471
```

Entfernt (**8**): `7469` Stargazer_Mann_frontal · `7457` WorkerBlue_Frau_Taschen ·
`7464` GlazedGreen_Mann_Taschen · `7445` Red_Frau_Huefte · `7446` Red_Mann_frontal ·
`7440` Red_Mann_Taschen · `7449` Red_Mann_Huefte · `7422` White_Mann_frontal

## Afghanistan Sweater — Produkt 2668, 48 Bilder

```
7068,7198,7207,7217,7226,7234,7072,7190,7199,7209,7218,7233,7236,7067,7191,
7200,7208,7216,7235,7069,7193,7211,7227,7238,7064,7192,7201,7210,7220,7228,
7130,7194,7212,7221,7239,7066,7196,7204,7213,7230,7131,7206,7214,7224,7242,
7063,7195,7241
```

Entfernt (**5**): `7228` CottonPink_Mann_Taschen · `7192` CottonPink_Frau_frontal ·
`7196` GlazedGreen_Frau_frontal · `7213` GlazedGreen_Frau_Huefte ·
`7226` schwarz_Mann_Taschen

## Wichtig fuer die Zuordnung — anders als bei Argentinien

**Die Afghanistan-Galerien sind NICHT regelmaessig.** Bei Argentinien hatte jede
Farbe genau sieben Ansichten, weshalb sich die Thumbnail-Position mit einer
festen Tabelle aufloesen liess. Hier hat jede Farbe **zwischen zwei und sieben**
Ansichten — der Hoodie in Weiss zum Beispiel hatte nur `Freihaengend` und
`Mann_frontal`.

Wer hier ueber die Thumbnail-Position zuordnet, muss **je Farbe die tatsaechliche
Liste** aus der Schnittstelle nehmen. Die feste Tabelle waere hier falsch.

**Die Dateien liegen weiter in der Mediathek** — entfernt wurde nur die Zuordnung
zur Produktgalerie. Keine der Variationen (84 / 86 / 86) benutzte eines der 15
Bilder als Variationsbild; das wurde vorher geprueft.
