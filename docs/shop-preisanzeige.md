# shop.onefam.ch — falsche Währung auf den Produktkarten der Startseite

**Stand 01.09.2026.** Betrifft **nicht** dieses Repo, sondern das Inline-Skript im
WordPress/Divi-Theme von `shop.onefam.ch`. Hier steht es, weil die Ursache
vollständig belegt ist und der Fix eine Zeile lang ist — wer ihn einbaut, soll
nicht noch einmal suchen müssen.

## Symptom

Im Kopf steht „CHF Fr.", die Karten darunter zeigen „€69,99 EUR". Zwei Währungen
auf einer Seite.

## Ursache — Schritt für Schritt nachvollzogen

Die Startseite baut das Karten-Raster im Browser auf:

```js
renderFeat('albania');            // <- das Land steht hier, ausgeschrieben
```

`renderFeat(k)` schreibt die Karten aus `feat[k]` ins `#fgrid`. Der Preis in der
Karte ist zu diesem Zeitpunkt ein **fest im Skript hinterlegter EUR-Text**
(`'€69,99 EUR'`). Er ist nur ein Platzhalter; die richtige Währung soll gleich
danach nachgeladen werden:

```js
var m = slugOf(cards[0].getAttribute('href')).match(/^(.+)-(hoodie|sweater|shirt)$/);
if (!m) return;
var cat = m[1];
fetch('/wp-json/onefam/v1/cat-prices?category=' + encodeURIComponent(cat))
```

Und genau hier bricht es: Statt das Land zu benutzen, das zwei Zeilen weiter oben
schon dasteht, **rät das Skript die Kategorie aus dem Slug der ersten Karte**.

Für Albanien heisst die erste Karte `Albania Hoodie`, ihr Slug ist aber
`albanian-hoodie` (mit „n", als einziges der drei Albanien-Produkte). Daraus wird
`cat = 'albanian'`, und:

```
/wp-json/onefam/v1/cat-prices?category=albanian  ->  []
/wp-json/onefam/v1/cat-prices?category=albania   ->  3 Produkte, korrekte Preise
```

Bei `[]` bricht `apply()` sofort ab — der EUR-Platzhalter aus dem Skript bleibt
stehen. Der Kopf zeigt derweil CHF, weil er der CURCY-Währung folgt und nicht
diesem Skript.

## Es betrifft zwei von vier Ländern, nicht nur Albanien

Die Regex verlangt, dass der Slug auf `-hoodie`, `-sweater` oder `-shirt` endet.
Die erste Karte ist immer der Hoodie. Geprüft am 01.09.2026:

| Land | Slug der ersten Karte | abgeleitete Kategorie | Ergebnis |
|---|---|---|---|
| Argentinien | `argentina-hoodie` | `argentina` | funktioniert |
| Afghanistan | `afghanistan-hoodie` | `afghanistan` | funktioniert |
| Albanien | `albanian-hoodie` | `albanian` | **leer → EUR bleibt stehen** |
| Andorra | `andorra-hoodie-2` | — Regex greift nicht | **`return` → EUR bleibt stehen** |

Andorra scheitert also aus einem *anderen* Grund als Albanien: dort endet der
Slug auf `-2` (WordPress' Zusatz bei doppelt angelegten Produkten), die Regex
greift gar nicht erst, und das Skript steigt vor dem Laden aus.

## Der Fix — die Kategorie nicht raten, sondern merken

Das Raster weiss, welches Land es zeigt. Zwei kleine Änderungen im selben Skript:

```js
  var AKTUELLES_LAND = null;                    // NEU

  function renderFeat(k){
    AKTUELLES_LAND = k;                         // NEU — k ist bereits 'albania'
    document.getElementById('fgrid').innerHTML = feat[k].map(...).join('');
  }
```

```js
  window.ofFeatPrices = function(){
    var cards = [].slice.call(document.querySelectorAll('#fgrid .fcard'));
    if (!cards.length) return;
    var CUR = (document.cookie.match(/wmc_current_currency=([A-Z]{3})/) || [])[1] || 'CHF';

    var cat = AKTUELLES_LAND;                   // STATT der Slug-Ableitung
    if (!cat) return;
    // ... ab hier unverändert
```

Die drei Zeilen mit `slugOf(cards[0]...)`, `if(!m) return;` und `var cat = m[1];`
entfallen ersatzlos.

Das repariert Albanien und Andorra zugleich und ist gegen jedes künftige Land
unempfindlich — egal wie dessen Slugs heissen. `slugOf()` wird weiter gebraucht:
`apply()` ordnet damit die geladenen Preise den Karten zu, und das funktioniert
unabhängig von der Kategorie.

## Warum nicht einfach die Slugs umbenennen?

Ginge auch (`albanian-hoodie` → `albania-hoodie`, `andorra-hoodie-2` →
`andorra-hoodie`), und WordPress legt beim Umbenennen von selbst eine
Weiterleitung von der alten Adresse an, es bricht also kein Link.

Aber es behebt nur die zwei Länder von heute. Beim nächsten Land, das
versehentlich zweimal angelegt wird und ein `-2` bekommt, steht der Fehler wieder
da — und diesmal sucht ihn niemand, weil die Seite ja „schon mal in Ordnung war".
Die Slug-Ableitung ist die eigentliche Schwachstelle, nicht der einzelne Slug.

Beides zusammen ist am saubersten: Skript korrigieren (behebt die Ursache) und
die Slugs bei Gelegenheit begradigen (der Ordnung halber).
