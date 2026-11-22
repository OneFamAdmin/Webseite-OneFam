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
- Getestet wird lokal: Auf der Live-Seite sind Warenkorb und Kasse gesperrt (404), bis in Vercel
  `NEXT_PUBLIC_SHOP_AUF_ONEFAM=1` gesetzt ist. Der Server muss laufen (`http://localhost:3001`). Läuft er nicht:
  `export PATH="$HOME/.local/node/bin:$PATH" && npm run build && npx next start -p 3001`.
- Die Rückkehr von zahls.ch funktioniert nur von `https://onefam.ch`, `http://localhost:3000`
  und `http://localhost:3001` (feste Liste in Shop-Snippet 114).

## Variante A — bis ins Zahlungsfenster, dann abbrechen

> **✅ Am 22.11.2026 durchgeführt** (Labi: „Stufe a kannst du doch selber machen los bitte“; von
> Claude am Bildschirm geklickt, lokal auf `localhost:3001`, Schweizer Gerät, Deutsch). Bezahlt
> wurde nichts. Besteller: Testname „Test Testkauf Stufe A“, Firmenadresse, info@onefam.ch.
>
> | Soll | gemessen |
> |---|---|
> | Zahlungsfenster von zahls.ch öffnet sich, auf Deutsch | ✅ `onefam.zahls.ch/de/`, „Zahlungsmittel wählen“ |
> | Betrag und Währung = Total der Bestellübersicht | ✅ 93.00 CHF = 75 + 18 Versand in die Schweiz |
> | Neue Bestellung „Zahlung ausstehend“ mit Produkt, Farbe und Grösse an der Position | ✅ Nr. 8246, `pending`, „Albania Hoodie - M, Black“, Colour Black, Size M, **`variation_id` 2750** (nicht 0) |
> | Versand, Adresse, E-Mail | ✅ Standard 18.00, Adresse und E-Mail wie eingegeben, Rechnung = Lieferung |
> | `_onefam_herkunft` = `onefam.ch` | ✅, dazu `_onefam_sprache` = `de`, angelegt über `store-api`, Zahlart `zahls` |
> | Abbruch führt auf `/de/warenkorb?zahls_error=1&…` | ✅ mit `order_id=8246` |
> | Hinweis „Die Zahlung wurde nicht abgeschlossen. Dein Warenkorb ist noch da.“, Teil noch im Warenkorb | ✅ |
> | Bestellung danach auf „Storniert“ | ⏳ **offen** — der Admin war abgemeldet, der Schlüssel im Projekt darf nur lesen. An der Bestellung steht „Bestandssperre von 60 Minuten“; WooCommerce storniert unbezahlte Bestellungen danach meist von selbst. Nachsehen. |
>
> Sonst beobachtet: An der Kasse stand für die Schweiz „kein Rückgaberecht“ und der Hinweis auf
> Einfuhrabgaben. Im Posteingang kam in 30 Minuten keine Mail mit der Bestellnummer an. Gelesen
> wurde die Bestellung über `wc/v3/orders/8246` mit dem Nur-Lese-Schlüssel aus `.env.local`.
> **Nicht geprüft:** Euro (Gerät in Deutschland), Französisch, Lieferung nach Deutschland — und
> alles aus Variante B.

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
- `localhost` steht in der Liste der erlaubten Rückkehr-Adressen (Snippet 114). Nach dem Livegang
  herausnehmen.

## Rechtsprüfung der Kasse (21.11.2026)

Am Wortlaut der Gesetze geprüft (EU-Richtlinie 2011/83/EU, Deutschland, Österreich, Frankreich,
Spanien, Vereinigtes Königreich, Schweiz). Umgesetzt:

- **Bestellknopf** in der Formel des jeweiligen Gesetzes — deutsch „Zahlungspflichtig bestellen“,
  französisch „Commande avec obligation de paiement“, spanisch „Pedido con obligación de pago“,
  englisch „Order with obligation to pay“ (Art. 8 Abs. 2 der Richtlinie verlangt die Zahlung im
  Knopftext; die WooCommerce-Texte „Commander“, „Realizar el pedido“ und „Place Order“ nannten sie
  nicht). **Nicht kürzen.**
- AGB werden akzeptiert, die Datenschutzerklärung wird verlinkt und zur Kenntnis gegeben (keine
  „Zustimmung“ zur Datenschutzerklärung).
- Rückgaberegel des Shops mit Link direkt vor dem Knopf; Links auf alle fünf Rechtstexte.
- Lieferländer und Zahlmittel schon im Warenkorb; Hinweis auf Einfuhrabgaben bei Lieferung in
  die Schweiz und nach Liechtenstein (Grossbritannien und Norwegen werden seit 21.11.2026 nicht
  mehr beliefert).
- Zahlart-Hinweis gegengelesen (deutsch Du-Form, französisch Sie-Form wie die Rechtstexte).

Dieselben Knopftexte trägt seit 21.11.2026 auch die Kasse des Shops (Snippet 115).

Seit 21.11.2026 gilt für Lieferungen in EU und EWR das Widerrufsrecht: Die Kasse zeigt je
Lieferland „14 Tage Widerruf“ (z. B. Deutschland) oder „kein Rückgaberecht“ (Schweiz) — beim
Testkauf beide Länder einmal wählen und den Satz über dem Knopf lesen. Weitere offene Punkte
stehen in `docs/stand.md`.
