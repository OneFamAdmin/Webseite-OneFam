# Sicherung: Galerie Produkt 1787 „Argentinien Hoodie" — Stand vor dem 08.09.2026

Vor dem Entfernen von zehn schlecht erzeugten Modellbildern aufgenommen.
**42 Bilder**, Reihenfolge wie sie die `wc/v3`-Schnittstelle geliefert hat
(das erste ist das Hauptbild).

Zurueckdrehen: genau diese Reihenfolge wieder an
`POST /wp-json/wc/v3/products/1787` als `images: [{id: ...}, ...]` schicken —
im eingeloggten wp-admin, Nonce aus `wpApiSettings`.

## Die 42 Anhang-IDs in der urspruenglichen Reihenfolge

```
7112,7297,7328,7329,7333,7331,7332,7106,7324,7323,7322,7327,7326,7325,7108,
7318,7317,7316,7321,7319,7320,7109,7306,7305,7304,7309,7308,7307,7110,7312,
7311,7310,7315,7314,7313,7111,7298,7300,7299,7303,7302,7301
```

## Die zehn entfernten Bilder

Grund: **schlecht erzeugt** — der Druck sitzt verzerrt oder unsauber auf dem
Stoff. Es werden ausdruecklich **keine neuen Bilder** dafuer erzeugt; die
betroffenen Farben zeigen kuenftig weniger Ansichten.

| Anhang-ID | Datei |
|---|---|
| 7324 | `..._White_Frau_frontal_4k.webp` |
| 7323 | `..._White_Frau_Taschen_4k.webp` |
| 7325 | `..._White_Mann_Huefte_4k.webp` |
| 7317 | `..._Red_Frau_Taschen_4k.webp` |
| 7306 | `..._CottonPink_Frau_frontal_4k.webp` |
| 7309 | `..._CottonPink_Mann_frontal_4k.webp` |
| 7314 | `..._HeatherGrey_Mann_Taschen_4k.webp` |
| 7303 | `..._AquaBlue_Mann_frontal_4k.webp` |
| 7298 | `..._AquaBlue_Frau_frontal_4k.webp` |
| 7331 | `..._schwarz_Mann_Taschen_4k.webp` |

**Die Dateien liegen weiter in der Mediathek** — entfernt wurde nur die
Zuordnung zur Produktgalerie. Keine der **56 Variationen** benutzte eines der
zehn als Variationsbild; das wurde vorher geprueft.

## Wie die Bilder identifiziert wurden

Sieben ueber die **Position des markierten Thumbnails** (die Galerie zeigt bei
gewaehlter Farbe genau deren Bilder in der Galerie-Reihenfolge: 1 Freihaengend,
2 Frau_frontal, 3 Frau_Taschen, 4 Frau_Huefte, 5 Mann_frontal, 6 Mann_Taschen,
7 Mann_Huefte). Bei den drei weissen war die Thumbnail-Leiste abgeschnitten —
die wurden ueber die **Pose** zugeordnet und mit den Originalen verglichen:
Arme seitlich = frontal, Haende in der Bauchtasche = Taschen, Hand an der
Huefte = Huefte.
