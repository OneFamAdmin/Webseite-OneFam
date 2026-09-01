# shop.onefam.ch — falsche Währung auf den Produktkarten der Startseite

> **ERLEDIGT am 01.09.2026.** Eingebaut und live geprüft. Das Dokument bleibt
> stehen, weil es die Ursache belegt und den Weg zurück beschreibt.
>
> Geändert wurde das Snippet **„OneFam Seiten (Router v4 – final)"** (Code
> Snippets, `id=11`, das einzige aktive der drei gleichnamigen). Es ist 2,4 MB
> gross und liefert die ganze Seite aus — Startseite, Shop, Produkte, Rechtstexte.
> Die Fundstelle kam darin **genau einmal** vor.

**Betrifft nicht dieses Repo**, sondern das Inline-Skript im WordPress/Divi-Theme
von `shop.onefam.ch`.

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

## Was eingebaut wurde

Statt die Kategorie aus dem Slug zu raten, merkt sich das Raster das Land, das es
gerade zeichnet. Zwei Änderungen, 53 Zeichen weniger als vorher:

```js
  function renderFeat(k){window.OF_AKT_LAND=k;        // <- hinzugefügt
```

```js
  var cat=window.OF_AKT_LAND;                          // <- ersetzt drei Zeilen:
  if(!cat) return;                                     //    var m=slugOf(cards[0]…).match(…)
                                                       //    if(!m) return;
                                                       //    var cat=m[1];
```

`window.` statt einer lokalen Variablen ist Absicht: `ofFeatPrices` steht in einer
eigenen IIFE, und so hängt der Fix nicht daran, ob die beiden im selben
Sichtbarkeitsbereich liegen.

`slugOf()` bleibt, es wird weiter gebraucht — `apply()` ordnet damit die geladenen
Preise den Karten zu, und das funktioniert unabhängig von der Kategorie.

### Live geprüft nach dem Einbau

Alle drei Länder des Umschalters auf der Startseite, Kopfzeile sagt CHF:

| Land | Hoodie | Sweater | Shirt |
|---|---|---|---|
| Albanien (war kaputt) | CHF 75.00 | CHF 65.00 | CHF 40.00 |
| Afghanistan | CHF 75.00 | CHF 65.00 | CHF 40.00 |
| Argentinien | CHF 75.00 | CHF 65.00 | CHF 40.00 |

Gegenprobe mit `wmc_current_currency=EUR` (echte EU-Kunden): € 69.99 / 59.99 /
34.95. Danach Cookie und Anzeige wieder auf den Ausgangszustand gesetzt.

Startseite, Shop-by-Country, Produktseite, About, /de/, /fr/, /es/ und eine
Kollektionsseite antworten mit 200 und ohne PHP-Fehler; `x-onefam-router: 1` steht
weiterhin im Kopf, das Snippet ist also aktiv.

**Andorra** steht nicht im Umschalter der Startseite (nur Albanien, Afghanistan,
Argentinien). Sein `-2`-Slug wäre also erst aufgefallen, wenn das Land dort
aufgenommen wird. Der Fix nimmt ihm das vorweg.

## Nachtrag: die Slug-Bereinigung, und was sie fast kaputt gemacht hätte

Am selben Tag wurden die vier schiefen Produkt-Slugs begradigt:

| Produkt | alt | neu |
|---|---|---|
| Albania Hoodie (2681) | `albanian-hoodie` | `albania-hoodie` |
| Andorra Hoodie (3968) | `andorra-hoodie-2` | `andorra-hoodie` |
| Andorra Sweater (3888) | `andorra-sweater-2` | `andorra-sweater` |
| Afghanistan Shirt (3786) | `afghanistan-shirt-2` | `afghanistan-shirt` |

Alle vier alten Adressen leiten mit **301** auf die neue — das macht WordPress von
selbst (`_wp_old_slug`), es bricht kein Link.

**Und genau hier wäre der Preisfehler zurückgekommen.** `apply()` ordnet die
geladenen Preise den Karten über den Slug zu:

```js
ps.forEach(function(p){by[slugOf(p.permalink)]=p;});
var p = by[slugOf(c.getAttribute('href'))];
```

Die Karten-Adressen stehen **fest im Snippet** (`OF_PLINK` und die `fcard`-Links der
Kollektionsseiten), der Endpunkt liefert die **echten** Permalinks. Nach dem
Umbenennen zeigte die Karte auf `albanian-hoodie`, die API meldete
`albania-hoodie` — kein Treffer, EUR-Platzhalter blieb stehen. Live gemessen:
„Albania Hoodie = €69,99 EUR" neben zwei korrekten CHF-Preisen.

Deshalb wurden im selben Snippet **9 fest verdrahtete Adressen** nachgezogen
(3× `albanian-hoodie`, je 2× die anderen drei). Alle neun waren Produktlinks, keine
Weiterleitungsregel.

**Merksatz:** Wer einen Produkt-Slug ändert, muss im Router-Snippet nach der alten
Adresse suchen. Die 301 rettet den Besucher, aber nicht die Preis-Zuordnung.

### Falle beim Speichern

Bei 2,4 MB antwortet der Server auf das Speichern mit **HTTP 200 und leerem
Rumpf**. Code Snippets erwartet JSON und meldet daraufhin „Snippet konnte nicht
aktualisiert werden. Der Server hat keine gültige Antwort". Die Meldung sagt also
nichts darüber aus, ob geschrieben wurde — beim ersten Patch **war** gespeichert,
bei zwei weiteren Versuchen über den Knopf **nicht**.

**Nie nach der Meldung urteilen.** Immer nachsehen: Bearbeitungsseite neu laden und
die Zeichenlänge im Editor prüfen.

Verlässlich ging es erst direkt über die REST-Schnittstelle des Plugins, aus der
Konsole der Bearbeitungsseite heraus:

```js
const s = window.CODE_SNIPPETS_EDIT.snippet;
await fetch(window.CODE_SNIPPETS.restAPI.snippets + '/' + s.id, {
  method: 'POST', credentials: 'same-origin',
  headers: { 'Content-Type': 'application/json',
             'X-WP-Nonce': window.CODE_SNIPPETS.restAPI.nonce },
  body: JSON.stringify(Object.assign({}, s, { code: NEUER_CODE }))
});
```

Antwortet ebenfalls leer, schreibt aber zuverlässig.

### Weg zurück

Die drei ersetzten Zeilen wortwörtlich (124 Zeichen), falls jemand den alten Stand
braucht:

```js
var m=slugOf(cards[0].getAttribute('href')).match(/^(.+)-(hoodie|sweater|shirt)$/);
      if(!m) return;
      var cat=m[1];
```

und `window.OF_AKT_LAND=k;` hinter `function renderFeat(k){` wieder entfernen.

## Warum nicht einfach die Slugs umbenennen?

Ginge auch (`albanian-hoodie` → `albania-hoodie`, `andorra-hoodie-2` →
`andorra-hoodie`), und WordPress legt beim Umbenennen von selbst eine
Weiterleitung von der alten Adresse an, es bricht also kein Link.

Aber es behebt nur die zwei Länder von heute. Beim nächsten Land, das
versehentlich zweimal angelegt wird und ein `-2` bekommt, steht der Fehler wieder
da — und diesmal sucht ihn niemand, weil die Seite ja „schon mal in Ordnung war".
Die Slug-Ableitung ist die eigentliche Schwachstelle, nicht der einzelne Slug.

Beides ist inzwischen erledigt: das Skript ist korrigiert (die Ursache), und die
vier Slugs sind begradigt (die Kosmetik) — siehe Nachtrag oben. Der Reihenfolge nach
war das richtig so: erst die Ursache, dann die Namen. Umgekehrt hätte die
Slug-Änderung den Fehler nur verschoben.
