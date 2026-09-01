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

**Stand nach der Angleichung, an allen 21 Live-Produkten einzeln gemessen:**
21 Produkte, **eine** CHF-Stufe je Kleidungsstück, **eine** EUR-Stufe,
**0 Variationen ohne Festpreis**.

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
