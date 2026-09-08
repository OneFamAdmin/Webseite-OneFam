# Sicherung: Galerie Produkt 1963 „Argentinien Sweater" — Stand vor dem 08.09.2026

Vor dem Entfernen von fuenf Modellbildern aufgenommen. **38 Bilder**, Reihenfolge
wie sie die `wc/v3`-Schnittstelle geliefert hat (das erste ist das Hauptbild).

Wer den Stand zurueckdrehen will, schickt genau diese Reihenfolge wieder an
`POST /wp-json/wc/v3/products/1963` als `images: [{id: ...}, ...]` — im
eingeloggten wp-admin, Nonce aus `wpApiSettings`.

## Die 38 Anhang-IDs in der urspruenglichen Reihenfolge

```
7118,7414,7413,7412,7417,7416,7415,7113,7408,7407,7406,7410,7409,7114,7402,
7401,7400,7405,7403,7404,7115,7383,7382,7387,7385,7117,7388,7393,7119,7378,
7376,7379,7116,7396,7395,7394,7399,7398
```

## Die fuenf entfernten Bilder

| Anhang-ID | Datei | Wie sie identifiziert wurde |
|---|---|---|
| 7413 | `OneFam_Argentinien_Sweater_schwarz_Frau_Taschen_4k.webp` | Thumbnail-Position 3 bei Schwarz + Bildvergleich |
| 7412 | `OneFam_Argentinien_Sweater_schwarz_Frau_Huefte_4k.webp` | Adresse war im Screenshot sichtbar |
| 7416 | `OneFam_Argentinien_Sweater_schwarz_Mann_Taschen_4k.webp` | Adresse war im Screenshot sichtbar |
| 7395 | `OneFam_Argentinien_Sweater_MindfulBlue_Frau_Taschen_4k.webp` | Thumbnail-Position 3 bei Mindful Blue + Bildvergleich |
| 7403 | `OneFam_Argentinien_Sweater_Red_Mann_Taschen_4k.webp` | Thumbnail-Position 6 bei Rot, an der Produktseite nachgemessen |

**Die Dateien liegen weiter in der Mediathek** — entfernt wurde nur die Zuordnung
zur Produktgalerie. Keine der 66 Variationen benutzte eines der fuenf Bilder als
Variationsbild; das wurde vorher geprueft.

**Warum die Thumbnail-Position als Beweis taugt:** die Galerie zeigt bei gewaehlter
Farbe genau die Bilder dieser Farbe in der Galerie-Reihenfolge. Zwei der fuenf
Screenshots trugen die Adresse in der Statuszeile — bei beiden stimmte die
abgeleitete Position exakt. Erst danach wurden die uebrigen drei ueber die Position
zugeordnet, und die Reihenfolge wurde an der echten Produktseite nachgemessen,
nicht angenommen.
