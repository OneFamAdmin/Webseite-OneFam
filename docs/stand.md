# Stand — 02.09.2026

Übergabe an die nächste Sitzung. Vor grösseren Aufgaben hier hineinsehen, vor
`/clear` oder `/compact` hier fortschreiben.

**Repo sauber, `main` deckungsgleich mit origin, letzter Commit `fd4e7d4`.**

---

## Das Wichtigste zuerst — offene Punkte

| # | Was | Warum eilig |
|---|---|---|
| 1 | **Anfrage ans Finanzamt Konstanz** stellen | Ab dem ersten Verkauf an einen deutschen Kunden entsteht dort Umsatzsteuer, ob registriert oder nicht. Bisher gab es **genau einen** (#4145, 23.07.2026, 39,57 EUR). Solange noch nichts weiter verkauft ist, ist Luft — die sollte genutzt werden. Entwurf liegt im claude.ai-Projekt. → `behoerden-mwst-zoll.md` |
| 2 | **Ausführer-Vereinbarung mit Shirt-King** | Der deutsche Zoll gibt schriftliche Festlegung vor. Vor dem ersten echten Paket in ein Drittland klären, nicht danach. Dazu: fakturieren sie Drittlandsendungen mit oder ohne deutsche USt.? |
| 3 | Widerrufsrecht anwaltlich prüfen | Pauschaler Ausschluss ist nach deutschem Verbraucherrecht vermutlich angreifbar. Vor Launch. |
| 4 | Tote Links, Footer-Branding-Zeile | Kosmetik, aber sichtbar. |

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
