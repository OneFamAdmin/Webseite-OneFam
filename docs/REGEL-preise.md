# REGEL: Preise — die einzige gültige Fassung

Stand 31.08.2026. Ersetzt alle früheren Preisangaben in den Protokollen.
Vor jeder Preisaussage **dieses Dokument** lesen, nicht messen.

---

## Die Preise

| | Hoodie | Sweater | Shirt |
|---|---|---|---|
| **CHF** (`regular_price` je Variation) | **75** | **65** | **40** |
| **EUR** (Festpreis, Meta `_regular_price_wmcp`) | **69,99** | **59,99** | **34,95** |

**Diese Preise gelten für ALLE Produkte** — Länder wie Logo-Linien, ohne Ausnahme.
Am 31.08.2026 wurden OneFam Logo und OneFam White Logo von CHF 70 / 60 / 35 auf
75 / 65 / 40 angehoben (542 Variationen), damit der Katalog einheitlich ist.
Entscheid Labi. Die EUR-Festpreise waren schon vorher überall gleich und blieben es.

### ⚠ Diese Angleichung hielt nicht — am 06.09.2026 stand sie wieder auf 70 / 60 / 35

Gemessen im eingeloggten wp-admin über `wc/v3`: **dieselben 542 Variationen**,
OneFam Logo und OneFam White Logo, wieder auf CHF 70 / 60 / 35. Die EUR-Festpreise
waren dabei durchgehend korrekt.

**Ein PodOS-Sync war es nicht.** Alle betroffenen Variationen tragen als Anlagedatum
den **22.07.2026** und wurden seither nicht neu erzeugt — das ist derselbe Tag wie bei
Logo Black, das korrekt auf 75 stand. Ein Sync, der Variationen neu anlegt, hätte ein
jüngeres Datum hinterlassen.

**Was tatsächlich geschah, ist nicht mehr feststellbar.** Zwei Möglichkeiten, keine
davon belegbar: die Angleichung wurde am 31.08. dokumentiert, aber nicht (vollständig)
ausgeführt — oder etwas hat sie später zurückgesetzt, ohne die Variationen anzufassen.
Für die erste Möglichkeit spricht, dass die Nachkontrolle vom selben Tag stammt wie die
im Abschnitt „Wie man Preise richtig misst" beschriebene Fehlmessung.

**Daraus die Regel: eine Preisangleichung ist erst fertig, wenn sie an einem
späteren Tag noch einmal nachgemessen wurde** — mit `wc/v3` im eingeloggten Backend,
nicht mit der Store-API.

**Stand am 06.09.2026, nach der erneuten Angleichung — alle Produkte einzeln
gemessen, nicht in Stichproben:**

| | |
|---|---|
| Produkte geprüft | **42** (18 öffentlich, 24 privat) |
| Variationen geprüft | **3'218** (1'426 öffentlich, 1'792 privat) |
| CHF-Stufen je Kleidungsstück | **eine** — 75 / 65 / 40 |
| EUR-Stufen je Kleidungsstück | **eine** — 69,99 / 59,99 / 34,95 |
| Variationen ohne EUR-Festpreis | **0** |
| Abweichungen | **0** |

Vorgehen beim Schreiben, das sich bewährt hat: erst den Bestand vollständig lesen,
dann **eine einzelne Variation** als Probe ändern und prüfen, ob
`_regular_price_wmcp` unberührt bleibt, erst dann der Rest über
`POST /wp-json/wc/v3/products/<id>/variations/batch` in Paketen zu 50.

## ⛔ 82,50 / 71,50 / 44,00 ist KEIN Preis

Das ist ein **Fehlerbild**: So sieht es aus, wenn der EUR-Festpreis auf einer Variation
fehlt und CURCY (Woo Multi Currency) stattdessen mit dem Kurs **1.10** hochrechnet —
75 × 1.10 = 82.50, 65 × 1.10 = 71.50, 40 × 1.10 = 44.00.

Genau dieser Schaden trat bei **Argentinien (15.08.)** und **Brunei (18.08.)** auf,
jeweils ausgelöst durch einen PodOS-Sync, der die Variationen neu anlegt und die
CURCY-Meta verliert. Seit dem 18.08. hängt **Snippet 89 „OneFam EUR-Festpreis-Waechter"**
dagegen — er trägt den EUR-Preis beim Speichern einer Variation nach, **falls er fehlt**,
und überschreibt einen bewusst abweichenden Preis nicht.

Wer 82,50 sieht, hat also entweder einen echten Schaden gefunden — oder falsch gemessen.

## ⚠ Wie man Preise richtig misst

**Die WooCommerce-Store-API taugt dafür nicht.**
`/wp-json/wc/store/v1/products/<id>` liefert **immer** den kursumgerechneten Wert,
niemals den CURCY-Festpreis — auch mit `?currency=EUR`. Sie zeigt für *jedes* Produkt
82,50 / 71,50 / 44,00, auch für die vollkommen gesunden.

**Am 31.08.2026 bin ich genau darauf hereingefallen** und habe die Startseite
„korrigiert", obwohl nichts kaputt war. Rückgängig gemacht.

**Der belastbare Weg** — im eingeloggten wp-admin, Nonce aus `wpApiSettings`:

```js
fetch('/wp-json/wc/v3/products/<id>/variations?per_page=100',
      { headers: { 'X-WP-Nonce': wpApiSettings.nonce }, credentials: 'same-origin' })
// je Variation: v.regular_price  → CHF
//               meta_data['_regular_price_wmcp'].EUR → EUR-Festpreis
```

`wpApiSettings` gibt es nur auf wp-admin-Seiten; auf der Snippet-Editor-Seite ist es
nicht definiert — dann vorher auf die Produktliste wechseln.

Alternativ: die **gerenderte Produktseite** ansehen. Was der Kunde sieht, zählt.

## ⚠ Seit dem 08.09.2026 werden Preise automatisch zurueckgestellt

**Snippet 108 „OneFam Preis-Rueckstellung"** (aktiv, global, Prioritaet 30) setzt an
jeder Variation den Sollwert, sobald ein anderer oder ein **leerer** Preis
geschrieben wird. Gebaut, weil der Schluessel von Shirt-King die Preise dreimal
zurueckgeschrieben hat (07.09. zweimal, 08.09. einmal) und sich das bei PodOS
absehbar nicht abstellen laesst.

**Das heisst fuer jede Preisaenderung:** die Sollwerte stehen jetzt an **drei**
Stellen, und alle drei muessen gemeinsam nachgezogen werden — sonst dreht die
Automatik die Aenderung im wp-admin sofort zurueck:

| | |
|---|---|
| **Snippet 108** | `of_preis_sollwert()` — die Automatik selbst |
| **Snippet 106** | die Wache, die Abweichungen nur protokolliert |
| **Snippet 11** | die festen Zeichenketten der Startseite und der Laenderkacheln |

Dazu die EUR-Festpreise je Variation (`_regular_price_wmcp`) und Snippet 89.

**Nachsehen, ob und wie oft eingegriffen wurde** (Einstellungen → Alle Einstellungen):
`of_preis_rueckstellung_zaehler` und `of_preis_rueckstellung_zuletzt`; die Versuche
selbst stehen weiter in `of_preis_abweichungen`.

**Aktionspreise (`sale_price`) fasst die Automatik nicht an** — sie notiert nur, dass
einer gefunden wurde. Am 08.09.2026 hatte keine der 438 geprueften Variationen einen.

**Ruecknahme:** Snippet 108 deaktivieren. Es schreibt nichts als den Preis.

## Wo Preise sonst noch stehen

**Snippet 11 trägt Preise als feste Zeichenketten**, nicht aus der Datenbank:
- `feat` auf der Startseite — 3 Länder × 3 Preise
- die Produktkacheln der Länderseiten — je 3 Preise

Aktuell stehen dort **€69,99 / €59,99 / €34,95**, also 18× je Wert. **Ändern sich die
EUR-Preise je, müssen sie dort von Hand nachgezogen werden.** Die CHF-Anhebung vom
31.08. betraf sie nicht, weil dort nur EUR steht.

## Was der Preis trägt

Laut `OneFam_Margenrechner_20260807_1.xlsx` liegen alle Kombinationen zwischen **55 %
und 66 % Marge**. Einkauf je Stück netto: Shirt 6.64 + 5.50 Druck + 0.69 Handling,
Sweater 16.30, Hoodie 21.22, dazu Versand je Zone und 19 % USt. auf die Herstellkosten.

**Offen und bewusst so:** EUR 34.95 für CHF 40 entspricht 0.874 € je CHF, der Marktkurs
liegt bei rund 1.08. EUR-Kunden zahlen dadurch etwa ein Fünftel weniger als
Schweizer Kunden. Das steht seit dem Übergabeprotokoll vom 01.08. als bewusst zu
treffende Entscheidung — **wenn die EUR-Preise steigen sollen, betrifft das alle
Produkte gemeinsam**, plus die festen Zeichenketten in Snippet 11.

---

## Messung vom 21.09.2026 — ausgeloggt, gerenderte Seiten

**Anlass:** In PodOS steht die Signature-Linie auf **35 / 60 / 70**, die
Laenderlinie auf **40 / 65 / 75** (Power Edit, Feld „Price", Waehrungszeichen €).
Das sind genau die Werte, die am 31.08.2026 angehoben und am 06.09.2026 wieder
zurueckgefallen waren. → `docs/druck-und-lieferant.md`

**Gemessen ausgeloggt, ohne Query-Parameter, ohne Cache-Umgehung.** Das Geraet
steht in der Schweiz, angezeigt wird also CHF — das ist genau die Stufe, um die
es geht.

### Alle 18 oeffentlichen Produkte: korrekt

| Produkt | Hoodie | Sweater | Shirt |
|---|---|---|---|
| Afghanistan | CHF 75.00 | CHF 65.00 | CHF 40.00 |
| Albanien | CHF 75.00 | CHF 65.00 | CHF 40.00 |
| Andorra | CHF 75.00 | CHF 65.00 | CHF 40.00 |
| Argentinien | CHF 75.00 | CHF 65.00 | CHF 40.00 |
| **Logo Black** | CHF 75.00 | CHF 65.00 | CHF 40.00 |
| **OneFam Logo** | CHF 75.00 | CHF 65.00 | CHF 40.00 |

**Keine Abweichung. Die Signature-Linie steht im Shop auf demselben Niveau wie
die Laenderlinie** — anders als in PodOS. Gegengeprueft auf der Einzelseite
`/produkt/onefam-logo-hoodie/`: CHF 75.00.

### Was diese Messung NICHT abdeckt — und warum

1. **Die White-Logo-Linie ist nicht oeffentlich.**
   `/produkt/onefam-white-logo-hoodie/` antwortet ausgeloggt mit **404**. Genau
   die Linie, die in PodOS auf 70 steht, laesst sich ohne Anmeldung nicht messen.
   Von 42 Produkten sind 18 oeffentlich und 24 privat.
2. **Die Variationsebene fehlt.** Die Produktseite traegt
   `data-product_variations="false"` — bei mehr als 30 Variationen laedt
   WooCommerce sie per AJAX nach, statt sie einzubetten. Der angezeigte Preis ist
   der Produktpreis, **nicht** der Beleg, dass jede einzelne Variation stimmt.
   Genau auf Variationsebene sind die bisherigen Vorfaelle aufgetreten.
3. **EUR ist so nicht messbar.** Der EUR-Festpreis steht in
   `_regular_price_wmcp` je Variation und ist nur im Backend lesbar. Die Anzeige
   folgt dem Geraet, und der Umschalter ist bewusst aus.

**Fuer eine vollstaendige Aussage braucht es den eingeloggten wp-admin und
`wc/v3` mit dem Nonce aus `wpApiSettings`** — so wie am 06.09.2026 (42 Produkte,
3'218 Variationen, 0 Abweichungen). Alles andere ist eine Teilmessung und muss
als solche benannt werden.

---

## Vollmessung vom 21.09.2026 im eingeloggten wp-admin — und der Beleg

Gemessen ueber `wc/v3` mit dem Nonce aus `wpApiSettings`, **alle Produkte, alle
Variationen einzeln**, nicht in Stichproben.

| | |
|---|---|
| Produkte geprueft | **42** |
| Variationen geprueft | **3'218** |
| CHF-Stufen | **genau drei**: 40 (1'030×) · 65 (1'128×) · 75 (1'060×) |
| EUR-Stufen | **genau drei**: 34,95 (1'030×) · 59,99 (1'128×) · 69,99 (1'060×) |
| Variationen ohne EUR-Festpreis | **0** |
| Abweichungen vom Sollwert | **0** |

**Identisch mit der Messung vom 06.09.2026.** Auch die White-Logo-Linie, die den
Verdacht ausgeloest hatte, steht vollstaendig richtig:

| Produkt | ID | Status | Variationen | CHF | EUR |
|---|---|---|---|---|---|
| OneFam White Logo Shirt | 466 | privat | 92 | **40** (alle) | **34,95** (alle) |
| OneFam White Logo Sweater | 365 | privat | 94 | **65** (alle) | **59,99** (alle) |
| OneFam White Logo Hoodie | 69 | privat | 84 | **75** (alle) | **69,99** (alle) |

### ⚠ Der Shop ist nur deshalb richtig, weil die Automatik laeuft

**Preis-Wache am 21.09.2026 abgerufen** (WooCommerce → OneFam Preis-Wache):

| | |
|---|---|
| Letzte Pruefung | **2026-09-21 11:27:20** |
| Vorfaelle seit dem letzten Zuruecksetzen | **3'430** |

Das Protokoll zeigt fuer **denselben Tag, 11:26:51 bis 11:27:20**, einen
zusammenhaengenden Durchlauf ueber `onefam-white-logo-sweater`, Variationen 366
bis 415, durchgehend mit dem Muster **„60 statt 65"**.

**Damit ist die Frage beantwortet, die seit dem 06.09.2026 offen stand.** Die
Werte, die dort hineingeschrieben werden, sind **exakt die PodOS-Werte**:
Sweater 60, und in PodOS steht die Signature-Linie auf **35 / 60 / 70**. Die
WooCommerce-IDs stimmen ebenfalls ueberein — Power Edit nennt fuer diese drei
Produkte 466, 365 und 69, genau die IDs oben.

**Schluss:** Etwas schreibt fortlaufend die PodOS-Preise in den Shop, und
**Snippet 108 stellt sie jedes Mal zurueck**. Der Zaehler stand am 08.09.2026
bei 367 und wurde damals zurueckgesetzt; heute steht er bei **3'430**.

**Die alte Notiz „was tatsaechlich geschah, ist nicht mehr feststellbar" ist
damit ueberholt.** Es war kein einmaliger Vorfall, sondern ein Dauerzustand.

**Zwei Dinge, die daraus folgen:**

1. **Schaltet jemand Snippet 108 ab, fallen die Preise binnen Minuten zurueck**
   auf 35 / 60 / 70. Das Snippet ist keine Absicherung mehr, sondern
   Betriebsvoraussetzung.
2. **Die Ursache liegt bei PodOS, nicht im Shop.** Der Shop repariert
   zuverlaessig, aber er repariert etwas, das gar nicht kaputtgehen muesste.
   **Der richtige Ort fuer die Korrektur ist das PodOS-Preisfeld** — dort stehen
   fuer die Signature-Linie 35 / 60 / 70 statt 40 / 65 / 75.

**Nicht gemacht:** Zaehler und Protokoll wurden **nicht** zurueckgesetzt, und in
PodOS wurde **kein** Preis geaendert. Beides gehoert Labi.

### Offene Frage an den Lieferanten

~~**Ist das PodOS-Preisfeld die Quelle der Rueckfaelle auf 70 / 60 / 35?**~~
**Am 21.09.2026 belegt, siehe oben:** ja. Der Schreibvorgang laeuft
fortlaufend, das Muster im Protokoll ist „60 statt 65" auf genau den Produkten,
die in PodOS auf 35 / 60 / 70 stehen.

**Was jetzt noch zu klaeren ist — mit Shirt-King, nicht im Shop:**
Warum steht die Signature-Linie in PodOS auf einem anderen Preis als die
Laenderlinie, und wie wird das dort dauerhaft korrigiert? Solange das offen ist,
laeuft Snippet 108 als Dauerreparatur.

---

## ⛔ 21.09.2026: PodOS-Preise korrigiert — und dabei 94 Variationen verloren

**Auf Labis Auftrag** wurden in PodOS (Power Edit, Feld „Price") die drei
Signature-Produkte von **35 / 60 / 70** auf **40 / 65 / 75** gesetzt. Vorgehen
nach Regel: erst der Hoodie allein als Probe, gespeichert, neu geladen, geprueft
— dann Shirt und Sweater.

**Beides hat gewirkt, und beides hatte eine Folge.**

### Was funktioniert hat

| Produkt | WooCommerce-ID | Variationen | CHF | EUR |
|---|---|---|---|---|
| OneFam White Logo Shirt | 466 | 92 | **40** (alle) | **34,95** (alle) |
| OneFam White Logo Hoodie | 69 | 84 | **75** (alle) | **69,99** (alle) |

In PodOS steht die Variantenebene des Hoodie jetzt auf **75** statt 70. Der
Preis-Wache-Zaehler blieb bei **3'430** stehen — **keine neuen Rueckstellungen**.
Die Korrektur an der Wurzel wirkt also.

### Was kaputtgegangen ist

**`OneFam White Logo Sweater` (ID 365, privat) hat seine 94 Variationen
verloren.**

| | |
|---|---|
| Variationen vorher | **94** |
| Variationen jetzt | **0** |
| `date_modified` | **2026-09-21T16:46:37** (Serverzeit ≈ 18:46 lokal) |
| Gesamtbestand vorher | **3'218** |
| Gesamtbestand jetzt | **3'124** |
| Betroffene Produkte | **genau eines** — die uebrigen 41 sind vollstaendig |

**Der Zeitstempel faellt mit dem Speichern in PodOS zusammen.** Ueber 30 Sekunden
sechsmal nachgemessen: der Stand bleibt bei 0, es baut sich **nicht** von selbst
wieder auf.

**Eingrenzung:** Das Produkt ist **privat**, im Laden also nicht sichtbar. Die
oeffentlichen Geschwister sind unberuehrt (Logo Black Sweater 70, OneFam Logo
Sweater 94).

### Was das ueber den Sync sagt

Bekannt war: „Ein Sync legt nicht nur Preise zurueck, er legt auch Variationen
an" (07.09. → 08.09.: 3'210 → 3'218). **Neu belegt: er kann sie auch entfernen.**
Und es trifft ausgerechnet wieder den Sweater — dasselbe Produkt, das am
08.09.2026 und heute um 11:27 die Rueckstellungs-Durchlaeufe hatte.

**Daraus die Regel: Wer in PodOS einen Preis aendert, muss danach den
Variationsbestand zaehlen, nicht nur die Preise pruefen.** Der Sollwert ist
**3'218** ueber 42 Produkte.

### Stand: nicht repariert

**Bewusst nichts wiederhergestellt.** 94 Variationen neu anzulegen ist ein
Eingriff, der Labi gehoert — und es ist offen, ob ein erneuter PodOS-Sync sie
selbst zurueckbringt (das waere der Weg, der den Schaden verursacht hat) oder ob
sie im Shop von Hand aufgebaut werden muessen.
