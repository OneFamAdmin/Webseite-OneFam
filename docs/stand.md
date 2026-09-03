# Stand — 02.09.2026

Übergabe an die nächste Sitzung. Vor grösseren Aufgaben hier hineinsehen, vor
`/clear` oder `/compact` hier fortschreiben.

**Repo sauber, `main` deckungsgleich mit origin.**

---

## Das Wichtigste zuerst — offene Punkte

| # | Was | Warum eilig |
|---|---|---|
| 1 | ⚠️ **Einordnung von Bestellung #4145 klären** | Die Unterlagen führen sie als „genau einen echten Verkauf nach Deutschland" (39,57 EUR), am 03.09.2026 wurde sie als **Testbestellung** bezeichnet — und die Anfrage ans Finanzamt ging mit „keine Verkäufe an deutsche Kunden" hinaus. Beides zusammen geht nicht. War es eine Lieferung an einen Dritten, gehört es nachgereicht. → `behoerden-mwst-zoll.md` |
| 2 | **Antwort aus Konstanz abwarten** | Anfrage am 03.09.2026 raus, Bestätigung da. Antwort kommt **per Post nach Basel oder telefonisch**, nicht per Mail. Formlos und damit unverbindlich — reicht das nicht, folgt § 89 Abs. 2 AO (gebührenpflichtig). |
| 3 | **Ausführer-Vereinbarung mit Shirt-King** | Der deutsche Zoll gibt schriftliche Festlegung vor. Vor dem ersten echten Paket in ein Drittland klären, nicht danach. Dazu: fakturieren sie Drittlandsendungen mit oder ohne deutsche USt.? |
| 4 | Widerrufsrecht anwaltlich prüfen | Pauschaler Ausschluss ist nach deutschem Verbraucherrecht vermutlich angreifbar. Vor Launch. **Das geplante Siebdruck-Modell gehört mit auf den Tisch** — bei vorproduzierter Auflage fällt das Argument ganz. → `druck-und-lieferant.md` |
| 5 | **Antwort von Shirt-King abwarten** | Anfrage am 03.09.2026 raus, mit den Fotos der flauen DTG-Drucke und den Motiven als Vektor-PDF. Entscheidet, ob der Shop bei Print-on-Demand bleibt oder auf Vorbestellungen umgebaut wird — die DTF-Frage steht bewusst vorne. → `druck-und-lieferant.md` |

**Der Trichter bleibt geparkt** (freie Auswahl, Käufer-Voting) bis zur rechtlichen
Freigabe. Nicht als toten Code aufräumen.

---

## Was seit dem 01.09.2026 gemacht wurde

### Shop-Anbindung von Shopify auf WooCommerce

Den Shopify-Store gibt es nicht mehr; der alte Webhook hat nie eine Bestellung
geliefert. Neu `app/api/woo/webhook` + `lib/woo/`, live und Ende-zu-Ende geprüft.
Webhook id 4 im Shop ist aktiv. Der Shopify-Code ist entfernt.

### Pool rechnet jetzt mit echten Kosten

Vorher war `product_costs` leer → COGS 0 → der Anteil lag faktisch auf dem
**Umsatz**. Migrationen `0010`–`0013`:

- 42 Produktkosten, Schlüssel = WooCommerce-`product_id` (der Shop führt keine SKU)
- echte Versandstaffel von Shirt-King (nicht Gewichtsklassen, sondern
  „1 Shirt" gegen „alles andere")
- 19 % deutsche USt. auch auf den Versand
- ein Wechselkurs an einer Stelle (`fx_eur_chf`)
- **Pool-Anteil 10 % der Marge** — bewusst ein Startwert, steht in
  `cost_config.pool_share_pct`

**Referenzrechnung:** Hoodie CHF 75 + 7 Versand nach DE → Kosten 35.23,
Gebühr 2.68, **Marge 44.09, Pool 4.41**.

### Monatsabrechnung (P3)

`/admin/pool/abrechnung`, Migration `0014`/`0015`. **`overhead_costs` schreibt nie
ins `pool_ledger`** — Lohn und Fixkosten belasten den Pool nicht. Test 3 in
`abrechnung.test.ts` scheitert, wenn das jemand aufhebt.

Fixkosten werden **nach Kasse** gebucht (Entscheidung des Inhabers), nicht
abgegrenzt. Erfasst für Sep 2026: Claude Max 99.07, Higgsfield 125.01 CHF; dazu
Infomaniak in den Monaten der Abbuchung.

Nebenbei behoben: `purchases.gross_chf` trug die rohe Bestellsumme in der Währung
der Bestellung — `/admin/pool` summierte EUR und CHF in einen Topf.

### Shop-Startseite: Preisanzeige repariert

Das Karten-Skript riet die Kategorie aus dem Slug der ersten Karte. Albanien
zeigte deshalb EUR unter einer CHF-Kopfzeile. Jetzt merkt sich `renderFeat` das
Land. Anschliessend vier schiefe Produkt-Slugs begradigt — und dabei die fest
verdrahteten Links im Router-Snippet nachgezogen, sonst wäre der Fehler sofort
zurückgekommen. → `shop-preisanzeige.md`

### Aufgeräumt

Resend-Schlüssel rotiert (der alte war in einen Chat geraten),
`SHOPIFY_WEBHOOK_SECRET` in Vercel gelöscht, doppelter PodOS-Webhook und
Test-Mitschnitt im Shop entfernt.

### Dokumentation

CLAUDE.md zusammengeführt und von 26'458 auf rund 17'000 Zeichen gekürzt; die
Belege liegen in `docs/`. `RUNBOOK-laenderlauf.md`, `REGEL-preise.md` und
`REGEL-gesichter.md` sind aus dem claude.ai-Projekt hierher gekommen.

---

### Behördenoriginale nachgetragen — 03.09.2026

Die Antworten von ESTV und deutschem Zoll lagen bisher nur als Zusammenfassung vor.
Jetzt sind sie im Wortlaut in `behoerden-mwst-zoll.md`, mit Aktenzeichen und
Kontaktdaten. **Zwei Dinge waren dabei verkürzt:**

- **Es gibt sehr wohl eine Schwelle für Schweizer MWST-Pflicht.** Die Sonderregelung
  Versandhandel (Art. 7 Abs. 3 Bst. b MWSTG): ab **CHF 100'000 Jahresumsatz aus
  Kleinsendungen** (Einfuhrsteuer unter CHF 5) gelten die Lieferungen als
  Inlandlieferungen, Pflicht ab dem Folgejahr — und dann fuer **alle** Sendungen,
  nicht nur die kleinen. Der bisherige Satz „keine Pflicht, auch ueber CHF 100'000
  hinaus" galt nur fuer die allgemeine Grenze nach Art. 10. **Diese Zahl gehoert ab
  sofort mitgezaehlt.**
- **Die Unterstellungserklaerung Ausland ist eine offene Option**, die nie geprueft
  wurde: Einfuhr im eigenen Namen, dafuer MWST-Registrierung in der Schweiz — mit
  dem Recht, die Schweizer MWST offen zu ueberwaelzen und die Einfuhrsteuer als
  Vorsteuer zu ziehen. Fuer ein Geschaeft mit Schwerpunkt Schweiz eine Rechnung,
  die sich lohnen koennte.

Beide Behoerdenauskuenfte sind ausdruecklich **unverbindlich** — der Zoll schreibt
das woertlich hin.

### Druck und Lieferant — 03.09.2026

Zwei Straenge, festgehalten in `druck-und-lieferant.md`:

**Das Weiss deckt nicht.** Bereits produzierte DTG-Teile kamen mit flauem,
graustichigem Weiss — bei allen, nicht vereinzelt. Fotos liegen vor. Offen ist,
ob ueberhaupt vorbehandelt wurde; das entscheidet, ob das Verfahren schuld ist
oder die Einrichtung. **DTF kostet dasselbe wie DTG (5,50 €), ist fuer unsere
drei Artikel aber nicht freigeschaltet** — die Kindergroessen derselben Modelle
dagegen schon. Wenn Shirt-King umstellt, loest sich das 100-Stueck-Problem, und
Lieferzeit, Widerruf und Vorkasse-Konstrukt bleiben unberuehrt.

**Siebdruck:** Robert Koch hat geantwortet — Mindestmenge 100 je Motiv (nicht je
Textilfarbe), Einzelversand an Endkunden auch in die Schweiz und EU zugesagt,
Vorlaufzeit 10–12 Werktage, kein Ueberschuss, Rohteile von ihnen. Zu Groessen und
Kleidungsstuecken sagt er nichts — das ist die teuerste offene Frage.

### PodOS: unbezahlte Bestellungen gingen in Produktion — behoben 03.09.2026

Ein geteilter WooCommerce-Zahlungslink genuegte, damit PodOS eine Bestellung als
bezahlt uebernahm und in Produktion gab. HW-Christian hat die Anbindung
geaendert; die Gutschrift fuer den betroffenen Auftrag ist auf der Kreditkarte
eingegangen und am 03.09.2026 gegenueber Christian bestaetigt — mit einem
geschwaerzten Auszug als Beleg. **Vorgang abgeschlossen.**

**Unsere Seite war nie betroffen** — `BEZAHLT` kennt nur `processing` und
`completed`, `on-hold` bewusst nicht.

---

### Kosmetik-Punkte am 02.09.2026 nachgemessen — das meiste war schon in Ordnung

Der Sammelposten „tote Links, Footer-Branding, doppelte Rechtsseiten" ist beim
Messen weitgehend zerfallen:

- **Tote Links: keine.** 149 interne Adressen des Shops geprüft, alle erreichbar;
  im gerenderten DOM 55 Links, keiner kaputt. `xmlrpc.php` antwortet mit 403, das
  ist Absicht. Auf onefam.ch ebenfalls keine.
- **Footer-Branding:** der Shopify-Knopf „♥ Follow on shop" steht noch im
  Quelltext, wird aber beim Laden per Skript entfernt. Sichtbar ist er nirgends.
- **Doppelte Rechtsseiten:** schon sauber gelöst. `/agb/` trägt `canonical` auf
  `/de/terms-of-service/`, `/versand/` auf `/de/shipping-policy/`, `/impressum/`
  auf `/de/legal-notice/`.
- **Fusslinks:** anders als von mir gemeldet fehlt das Sprachpräfix bei **allen**,
  nicht bei sieben von neun. Der Klick landet aber auf einer Seite, die vollständig
  in der Cookie-Sprache rendert — für Besucher nichts kaputt. Bleibt ein
  Schönheitsfehler beim Teilen von Adressen. → `shop-fusslinks.md`

**Wirklich behoben:** die Aussage „und 253 Länder" auf der Shop-Startseite. Es gibt
11 Länderseiten, davon 4 mit Produkten; acht Stichproben nicht verlinkter Länder
antworten mit 404. Die Zahl ist in allen vier Sprachen raus (Snippet 11,
2'423'744 → 2'423'682), der Satz endet jetzt auf „Nur ein Zeichen — damit deins
dabei ist." Dazu die Fusszeile auf onefam.ch: nur noch „© 2026 OneFam", die
Rechtsform steht im Impressum und als `legalName` in den strukturierten Daten.

Und `sample-page` ist im Papierkorb: `/sample-page/` antwortet mit 404, die
Seitenliste zaehlt noch 25 statt 26.

---

### Lieferzeit auf der Produktseite — ergänzt 02.09.2026

Die Versandrichtlinie sagte zu, die Lieferzeit stehe bei jedem Produkt auf der
Produktseite; sie stand nirgends. Neues Snippet **102 „OneFam Lieferzeit
Produktseite"** (aktiv, `woocommerce_single_product_summary`, Priorität 25) setzt
sie unter den Preis: **3–7 Werktage (Produktion 2–4, Versand 1–3), in die Schweiz
zzgl. Zollabfertigung** — in allen vier Sprachen, Zahlen aus der Richtlinie.
Geprüft: alle 18 Produkte, keine Lücke; Kontrast 15,6:1, gleiche Farbe wie der
Preis darüber.

**Bewusst ohne MwSt-Hinweis** — siehe Falle 6 weiter unten.

Dazu der Halbsatz „und richtet sich nach der Menge in deinem Warenkorb" aus der
Versandrichtlinie **entfernt** — er widersprach der festen Spanne. Betroffen waren
zwei Snippets: **42** (Übersetzungstabelle, 5 Vorkommen, 187'739 → 187'481 Zeichen)
und **11** (der englische Satz im HTML, 2'423'797 → 2'423'744). Der Satz ist der
Schlüssel der Übersetzungstabelle — wer nur eines von beiden ändert, bekommt auf
den fremdsprachigen Seiten Englisch. Nachgemessen in allen vier Sprachen.

### Shop war unverschlüsselt erreichbar — behoben 02.09.2026

`http://shop.onefam.ch` lieferte den kompletten Shop im Klartext aus, das
Anmeldeformular eingeschlossen. Behoben nicht von Hand, sondern durch einmaliges
Speichern im schon installierten Plugin „Easy HTTPS & SSL" — der Haken war
gesetzt, der `.htaccess`-Block fehlte trotzdem. Jetzt 301 auf jedem Pfad, HTTPS
unverändert. Die ganze Geschichte samt Proxy-Falle und dem Absturzfehler im
Web-FTP-Editor: `shop-https.md`.

---

## Fallen, die Zeit gekostet haben — nicht noch einmal hineinlaufen

1. **Code Snippets meldet bei Snippet 11 (2,4 MB) einen Speicherfehler, der nichts
   bedeutet.** HTTP 200 mit leerem Rumpf. Beim ersten Patch **war** gespeichert, bei
   zwei weiteren Knopfdrücken **nicht**. Nie nach der Meldung urteilen — Seite neu
   laden und die Zeichenlänge prüfen. Zuverlässig geht nur die REST-Schnittstelle.
2. **Preise nur im eingeloggten wp-admin messen.** Store-API *und* `wc/v3` von aussen
   liefern beide den umgerechneten Wert. Von aussen meldet der Hoodie
   `regular_price` 69.99, im wp-admin korrekt 75.
3. **Wer einen Produkt-Slug ändert, muss Snippet 11 nachziehen.** Die
   Preis-Zuordnung läuft über den Slug; eine 301 rettet den Besucher, nicht die
   Zuordnung.
4. **Bei Steuer- und Zollfragen zuerst in die Projektunterlagen sehen.** Es liegen
   Auskünfte von ESTV, BAZG und deutschem Zoll vor. Ich habe einmal aus dem Gesetz
   geantwortet, obwohl die halbe Antwort seit August dokumentiert war.
5. **Die zwei aktiven Webhooks im Shop unterscheiden sich nur durch Nummer und
   Status.** Vor jeder Aktion filtern, sonst erwischt man die Produktion.
6. **Der fehlende MwSt-Hinweis auf der Produktseite ist kein Fehler.** Er wurde am
   07.08.2026 auf Weisung der ESTV entfernt (Geschaeftsfall 65zq0017): Leistungsort
   Deutschland, keine MWST-Pflicht in der Schweiz, **kein Ausweis solange nicht
   registriert**. Dafuer laeuft das aktive Snippet „OneFam Steuerhinweis Produktseite
   entfernen (ESTV-Vorgabe)", und „Steuern aktivieren" ist in WooCommerce bewusst
   aus. Der scheinbare Widerspruch zur PAngV steht als Pruefpunkt A3 in
   `behoerden-mwst-zoll.md` und loest sich mit Frage 7 an Konstanz. Ich habe das am
   02.09.2026 als Blocker gemeldet, weil ich aus dem Gesetz hergeleitet habe statt
   nachzulesen — **zum zweiten Mal dieselbe Falle** (siehe Punkt 4).
7. **`wp-json` taugt nicht, um `siteurl` zu bestimmen.** Es spiegelt das Schema der
   eigenen Anfrage zurück. Über HTTP gefragt meldet es `http://`, obwohl in der
   Datenbank `https://` steht. Ich habe daraus einen Fehler abgeleitet, den es nicht
   gab. Für `siteurl` und `home` in wp-admin nachsehen.
8. **Ein Snippet laesst sich nur mit echten Eingabeereignissen aendern.** Der Editor
   ist React-gesteuert: `setValue`, `textarea.value`, `cm.save()` — alles wird beim
   Speichern stillschweigend verworfen (dreimal geprueft). Was geht: echter Mausklick
   in den Editor, dann `cm.setSelection()`, dann echter Tastendruck. Eine
   REST-Schnittstelle gibt es in dieser Fassung nicht. Danach IMMER die Zeichenlaenge
   nach dem Neuladen pruefen und die Live-Seite messen.
9. **Vor dem Selberbauen im Shop erst die Plugin-Liste ansehen.** Neun Stück, und
   zwei davon machen HTTPS. Ein gesetzter Haken heisst dabei nicht, dass die Regel
   auch geschrieben wurde.

---

## Der Vorbehalt über allen Zahlen

Die Ware startet in Teltow. Umsatzsteuerlich findet der Verkauf in **Deutschland**
statt. Ob dort Registrierungspflicht besteht, ist **nicht geklärt**.

Käme sie, wäre es nicht mit `supplier_vat_pct` getan — dann müsste auch der
**Umsatz netto** gerechnet werden, und `creditPoolForOrder` bekommt heute die
Bruttosumme als Ertrag. Für einen Hoodie nach Deutschland: Marge 44.09 → 36.62,
Pool 4.41 → 3.66 (−16,9 %). Der Preis, der die heutige Marge hielte, läge bei
CHF 91.20 statt 82.00.

**Bis eine belastbare Auskunft vorliegt bleibt alles wie es ist.** Das ist der
Stand, der sich belegen lässt.

---

## Zahlen, die man im Kopf haben sollte

- Ein normaler Monat kostet **CHF 224.08** an Fixkosten → rund **6 Bestellungen**,
  um ihn zu decken
- Infomaniak im Jahr: **CHF 162.88** (Hosting 141.50, onefam.ch 10.70,
  loco-motive.ch 10.68)
- Vercel, Supabase, Make und Airtable sind **derzeit kostenlos**
- Pool-Stand 2026: **0.00** — es gab noch keinen echten Verkauf über den Webhook
