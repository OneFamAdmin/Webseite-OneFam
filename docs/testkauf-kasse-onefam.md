# Testkauf über die Kasse von onefam.ch — Protokoll für Labi

Stand 21.11.2026. Die Kasse auf onefam.ch ist gebaut und bis **vor** die Bestellung geprüft.
Der letzte Schritt — Bestellung in WooCommerce anlegen, Zahlungsfenster von zahls.ch öffnen,
Rückkehr — **ist ungetestet**, weil er eine echte Bestellung auslöst. Bestellungen, Zahlungen und
Testkäufe macht Labi (CLAUDE.md). Dieses Blatt sagt, was dabei zu prüfen ist.

## Vorher wissen

- **Eine bezahlte Testbestellung ist eine echte Bestellung.** Sie geht an PodOS/Shirt-King und
  wird gedruckt, wenn sie nicht rechtzeitig storniert wird. Entweder bewusst ein Teil bestellen,
  das du haben willst, oder die Bestellung direkt nach dem Test im wp-admin stornieren und bei
  Shirt-King Bescheid geben.
- **Variante A (Abbruch) kostet nichts** und prüft schon das meiste. Damit anfangen.
- Getestet wird lokal: Der Server muss laufen (`http://localhost:3001`). Läuft er nicht:
  `export PATH="$HOME/.local/node/bin:$PATH" && npm run build && npx next start -p 3001`.
- Die Rückkehr von zahls.ch funktioniert nur von `https://onefam.ch`, `http://localhost:3000`
  und `http://localhost:3001` (feste Liste in Shop-Snippet 114).

## Variante A — bis ins Zahlungsfenster, dann abbrechen

1. `http://localhost:3001/de/shop-by-country` öffnen, ein Teil wählen, Farbe und Grösse, „In den
   Warenkorb“, „Zum Warenkorb“, „Zur Kasse“.
2. E-Mail und Adresse eintragen. Summe in der Bestellübersicht merken.
3. „Zahlungspflichtig bestellen“ klicken.

**Soll:**
- [ ] Es öffnet sich das Zahlungsfenster von zahls.ch, auf Deutsch.
- [ ] Betrag und Währung dort = Total der Bestellübersicht (z. B. Hoodie in die Schweiz:
      CHF 93.00 = 75 + 18 Versand).
- [ ] Im wp-admin gibt es eine neue Bestellung „Zahlung ausstehend“ mit: richtigem Produkt,
      **Farbe und Grösse an der Position**, Versand, Adresse, E-Mail.
- [ ] An der Bestellung steht das Feld `_onefam_herkunft` = `onefam.ch` (unter „Individuelle
      Felder“, falls eingeblendet).

4. Im Zahlungsfenster **abbrechen** (zurück / schliessen).

**Soll:**
- [ ] Du landest auf `http://localhost:3001/de/warenkorb?zahls_error=1&…`.
- [ ] Dort steht „Die Zahlung wurde nicht abgeschlossen. Dein Warenkorb ist noch da.“ — und das
      Teil liegt noch im Warenkorb.
- [ ] Die Bestellung im wp-admin danach auf „Storniert“ setzen.

Wenn hier etwas anders ist: **welcher Punkt, was stattdessen** — das genügt als Meldung.

## Variante B — bezahlen

Wie A, aber im Zahlungsfenster wirklich bezahlen (TWINT oder Karte).

**Soll:**
- [ ] Du landest auf `http://localhost:3001/de/danke` („Vielen Dank.“).
- [ ] Die Ziffer am Warenkorb-Symbol ist weg, der Warenkorb leer.
- [ ] Bestellung im wp-admin: „In Bearbeitung“ (setzt die Rückmeldung von zahls.ch).
- [ ] Bestätigungsmail von WooCommerce kommt an.
- [ ] **PodOS:** Die Bestellung erscheint dort mit dem richtigen Motiv, der richtigen Farbe und
      Grösse. Das ist der wichtigste Punkt — siehe unten.
- [ ] Pool-Buchhaltung (`/admin/pool`): Die Bestellung ist gutgeschrieben wie jede andere.

## Worauf es besonders ankommt

- **PodOS und die Variante.** Die bisherige Shop-Seite legte Teile über einen eigenen Weg in den
  Warenkorb; in alten Bestellungen steht an der Position `variation_id = 0`. Über onefam.ch kommt
  die echte Varianten-Nummer von WooCommerce mit — das ist der Normalfall von WooCommerce, aber
  **ob PodOS damit genauso druckt, zeigt erst diese Bestellung.**
- **Euro.** Auf einem Schweizer Gerät zeigt alles CHF. Für die Euro-Probe: jemand in Deutschland,
  oder am Mac vorübergehend die Zeitzone auf Berlin stellen (Systemeinstellungen → Allgemein →
  Datum & Uhrzeit) und die Seite neu laden. Soll: Hoodie 69,99 €, nach Deutschland plus 7,70 €
  Versand; im Zahlungsfenster derselbe Betrag in EUR. **82,50 € wäre das Fehlerbild** (fehlender
  Festpreis).
- **Andere Sprache.** Einmal über `/fr/…` bis ins Zahlungsfenster: es soll französisch sein.

## Was schon geprüft ist (ohne Bestellung)

Bestell-Route `/api/shop/kasse`, am 21.11.2026:

| Fall | Antwort |
|---|---|
| kein Warenkorb | 400 `leer` |
| E-Mail ungültig | 400 `email` |
| Nachname und Ort fehlen | 400 `pflicht` (nachname, ort) |
| Italien ohne Provinz (dort Pflicht) | 400 `pflicht` (region) |
| Land ohne Lieferung (US) | 400 `pflicht` (land) |
| Kanton, den es nicht gibt | 400 `pflicht` (region) |
| gültig, aber gesehene Summe falsch (CH gesehen, nach DE geliefert) | 409 `summe`, neue Summe 82.00 |
| gesehene Währung falsch | 409 `summe` |
| Feld über 100 Zeichen | 400 `eingabe` |

Dazu: Klick auf den Bestellknopf mit leerem Formular → keine Anfrage an die Route, sechs Felder
rot; `/danke` ohne vorherige Bestellung lässt den Warenkorb stehen; `/warenkorb?zahls_error=1`
zeigt den Hinweis. Format der Bestellung gegen die Beschreibung der Schnittstelle geprüft
(`OPTIONS /wc/store/v1/checkout`).

## Bekannte Lücken

- Kein Gutscheinfeld (im Shop gibt es keinen Gutschein) und kein Notizfeld.
- Der Hinweistext zur Zahlart ist auf Englisch, Französisch und Spanisch von Claude übersetzt;
  im Shop steht er nur deutsch. Gegenlesen.
- AGB und Datenschutzerklärung verlinken auf die Seiten des **Shops**. Die Kasse des Shops zeigt
  „Datenschutzerklärung“ ohne Link; hier ist es ein Link. Rechtstexte zusammenlegen → Anwalt.
- Bestellknopf und AGB-Satz sind der Wortlaut von WooCommerce in der jeweiligen Sprache
  (deutsch „Zahlungspflichtig bestellen“, französisch „Commander“, spanisch „Realizar el pedido“,
  englisch „Place Order“). Ob das je Land genügt → Anwalt.
- `localhost` steht in der Liste der erlaubten Rückkehr-Adressen (Snippet 114). Nach dem Livegang
  herausnehmen.
