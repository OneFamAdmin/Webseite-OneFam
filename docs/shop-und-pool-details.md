# Shop und Pool — die Einzelheiten

Ausgelagert aus `CLAUDE.md` am 02.09.2026, damit dort nur steht, was in **jeder**
Sitzung gebraucht wird. Hier liegen die Belege, Messwerte und Herleitungen. Nichts
davon ist überholt — es ist nur zu lang für die Anweisungsdatei.

---

## WooCommerce — Bestandsaufnahme (01.09.2026)

`shop.onefam.ch` ist **WordPress/WooCommerce** (Divi, Polylang, Plugin *CURCY —
Multi Currency*, WooCommerce 10.9.4). **Einen Shopify-Store gibt es nicht mehr**;
`docs/handover-shop-pool.md` beschreibt ein abgeschaltetes System.

**Zugang:** REST-API v3 unter `https://shop.onefam.ch/wp-json/wc/v3/`, Basic-Auth
mit `WOO_KEY`/`WOO_SECRET` aus `.env.local` — **nur Leserechte**. Diese drei
Variablen stehen bewusst **nicht** in Vercel: kein Code liest sie, sie werden nur
lokal gebraucht. Ein Schlüssel weniger auf einem öffentlich erreichbaren Server.

- 42 Produkte (18 `publish`, 24 `private`), alle `variable`
- **Keine einzige SKU** — weder Produkt, Variante noch Bestellposition. Einziger
  stabiler Kostenschlüssel ist die `product_id`; `product_costs.sku` trägt sie als
  Text (Migration `0010`).
- 0 Kunden mit Konto (Gastbestellungen) → Käufer-Erkennung läuft über die
  **E-Mail** der Bestellung, nicht über Konten.
- Bestellpositionen tragen `variation_id = 0`, Grösse und Farbe stehen nur im
  `name` („Argentina Shirt - XS, Black"). Ungewöhnlich für ein variables Produkt,
  vermutlich Folge des eigenen Warenkorb-Handlers (`of_warenkorb_hinzu`).
  **Offen:** ob PodOS daraus die richtige Variante ableitet.
- Webhooks nach dem Aufräumen am 01.09.2026: **zwei, beide aktiv** — id 2 auf
  `connector.api.podos.io` (Produktion, **nicht anfassen**) und id 4 auf
  `onefam.ch/api/woo/webhook`. Die Dublette und ein Test-Mitschnitt sind gelöscht.

---

## Wie die Währung im Shop entschieden wird

Nachgemessen am 01.09.2026, weil CHF-Preise auf einer deutschen Leitung erschienen:

1. Ein Inline-Skript liest `Intl.DateTimeFormat().resolvedOptions().timeZone` und
   setzt das Cookie `of_geo=ch` bei `Europe/Zurich|Vaduz|Busingen`, sonst
   `of_geo=x` — Laufzeit **ein Jahr**, danach einmal `location.reload()`.
2. Der Server setzt daraufhin `wmc_current_currency`: mit `of_geo=ch` → **CHF**,
   sonst nach IP → für deutsche IPs **EUR**.

**`of_geo` schlägt die IP.** Ein Mac mit Schweizer Zeitzone sieht CHF, egal in
welchem Land er surft. Für echte deutsche Kunden (Zeitzone `Europe/Berlin`) greift
korrekt EUR.

**Beim Testen der EU-Ansicht** das Cookie `of_geo` löschen oder ein Gerät mit
passender Zeitzone nehmen — ein privates Fenster genügt **nicht**, das Skript setzt
`of_geo` sofort neu.

---

## Pool-Kostenmodell — woher jede Zahl kommt

Quelle aller Zahlen: `~/Downloads/OneFam_Margenrechner_20260807_1.xlsx` (Einkauf
Shirt-King, 07.08.2026). Ändert sich dort etwas, gehört es in eine neue Migration.

- **`product_costs`** — 42 Zeilen, Schlüssel = WooCommerce-`product_id` als Text.
  Shirt 14.12, Sweater 24.76, Hoodie 30.17 CHF (Rohteil + DTG + Handling, +19 %
  deutsche USt., Kurs 0.925).
- **`shipping_costs`** — was Shirt-King je Land vom PodOS-Guthaben abzieht. **Nicht**
  die Versandpauschale des Kunden; die steckt bereits in der Bestellsumme und muss
  gegengerechnet werden, sonst wäre Versand reiner Gewinn. Seit Migration `0012` die
  echte Staffel aus dem Portal (44 Tarife, 22 Länder inkl. Rückfall `*`), am
  01.09.2026 direkt von `client.shirt-king.cloud` gelesen.
- **`cost_config.fx_eur_chf`** — der **einzige** Wechselkurs im System. Fehlt er,
  wirft `creditPoolForOrder` bei einer EUR-Bestellung, statt Euro als Franken zu
  verbuchen (~8 % zu viel).

### Die Versandstaffel läuft nicht über Gewichtsklassen

Shirt-King führt je Land genau zwei Tarife, wörtlich `"<Land> 1 T-Shirt"` und
`"<Land> ab 2 T-Shirts / 1 Hoodie / 1 Tasse"`. Die Grenze liegt bei **genau einem
Shirt** — zwei Shirts kosten bereits den teuren Tarif, nicht erst ein Hoodie.
`versandstufe()` in `lib/pool/accounting.ts` bildet das ab und ist dort getestet.

Bis Migration `0012` war es als `light`/`heavy` modelliert; zwei Shirts nach
Norwegen kosteten dadurch 6.27 statt 21.46 CHF.

Eine **dritte Stufe gibt es nicht**: zwei Hoodies kosten laut Liste dasselbe wie
einer. Ein Land ohne eigenen Eintrag bekommt den internationalen Tarif (`*`) —
ebenfalls eine Zeile der Liste, kein Schätzwert.

Unsauber ist nur Deutschland: national gibt es `DHL Warenpost 4.21` (durch Rechnung
bestätigt, 1 Shirt) und `DHL Paket National 4.60`, aber keinen Tarif mit „1 Hoodie"
im Namen. Warenpost trägt keinen Hoodie, also bleibt das Paket.

### 19 % deutsche USt. auch auf den Versand

Migration `0011`. Shirt-King stellt eine Rechnung über die gesamte Leistung, und der
Versand steht innerhalb der Bemessungsgrundlage — belegt durch Rechnung
`inv-skc-26-30031` vom 07.08.2026: `6.64 + 5.50 + 0.69 + 4.21 = 17.04` netto, darauf
19 % = 20.28 EUR.

`shipping_costs.cost_eur` trägt weiterhin den **Netto**-Tarif, damit die Zahl mit der
Preisliste vergleichbar bleibt; der Aufschlag steht als `cost_config.supplier_vat_pct`
an einer Stelle. Ohne ihn bekam der Pool rund 0.16 CHF je Bestellung zu viel.

**Offen:** ob bei Ausfuhr (CH/GB/NO) 0 % gilt. Bis dahin überall 19 %, was im Zweifel
zu hohe Kosten annimmt und dem Pool eher zu wenig gutschreibt. Siehe
`docs/behoerden-mwst-zoll.md`.

### Die Referenzrechnung

Live nachgerechnet am 01.09.2026, deckungsgleich mit `accounting.test.ts`:
Hoodie CHF 75 + 7 Versand nach DE → Kosten 35.23, Gebühr 2.68, Marge 44.09,
**Pool 4.41** (10 % der Marge).

Vor Migration `0010` wären es 15.86 gewesen — das war aber der Anteil vom **Umsatz**,
nicht vom Gewinn; die beiden Zahlen sind nicht vergleichbar.

`accounting.test.ts` prüft dieselbe Bestellung zusätzlich in EUR gegen Zelle S7 des
Blattes „Kalkulation" — beide Rechenwege müssen sich treffen.

---

## Travel Pool — Planungsstand gegen Gebautes

Der ursprüngliche Plan sah vor: Live-Zähler mit Nettoumsatz nach Kosten, Gating über
den **Shopify App Proxy**, Ledger per Shopify-Webhooks, stündlicher Snapshot-Job.

**Gebaut ist es anders, und das Gebaute gilt:**

- Käufer-Gating über **Supabase-RLS + `buyers`-Tabelle**
- Ledger-Zuschreibung über den **WooCommerce**-Webhook (`app/api/woo/webhook`),
  Ledger `pool_ledger` in Supabase/Zürich, Migration `0007`
- **Kein App Proxy, kein Snapshot-Job**
- Der Live-Zähler ist im Trust-first-Stand ausgebaut (`CountUp` geparkt) — es gibt
  derzeit **gar keine öffentliche Pool-Zahl**

Unverändert gültig: **Gating passiert nie clientseitig.**

Zum Countdown: `components/Countdown.tsx` liegt ungenutzt im Repo, die geparkte
gestufte Abstimmung arbeitet aber pro Phase mit einer Frist (Text „Countdown" in
`/admin/voting` und `/mein-bereich`). **Öffentlich sichtbar ist keiner.**

---

## Laufende Kosten (Stand 01.09.2026)

In EUR, deshalb mit `amount_original`/`currency` erfasst:
**Claude Max € 107.10/Monat**, **Higgsfield € 135.15/Monat** (hängt am Dollar,
schwankt — Betrag monatlich prüfen).

In CHF bei Infomaniak: **Web Hosting 1 141.50/Jahr** (fällig August, trägt den
WooCommerce-Shop — `shop.onefam.ch` zeigt auf einen Infomaniak-Server, `onefam.ch`
auf Vercel), **onefam.ch 10.70/Jahr** (fällig Mai), **loco-motive.ch 32.05 für drei
Jahre** bis 08.11.2028.

**Vercel, Supabase, Make und Airtable kosten derzeit nichts** — nachtragen, sobald
dort ein Tarif greift.

Gebucht wird nach **Kasse**, nicht abgegrenzt: eine Jahresrechnung steht mit vollem
Betrag im Monat der Abbuchung. Entscheidung des Inhabers am 01.09.2026, damit die
Abrechnung Zeile für Zeile mit dem Bankauszug übereinstimmt. Der Preis dafür ist
bekannt und akzeptiert: Monate mit einer Jahresrechnung springen nach oben.

**Wer das später auf anteilige Buchung umstellt, ändert die Bedeutung jeder
bestehenden Zeile** — dann alle Altzeilen mit umrechnen, nicht nur die neuen.

---

## Marken-Verlauf — warum „keine Gradients" nicht mehr gilt

Die alte Regel lautete: keine Verläufe. Der Marken-Verlauf aus `lib/brand.ts`
(`BRAND_GRADIENT`, Gold → Orange → Pink → Magenta → Violett) ist inzwischen bewusst
gesetzt und trägt Gesichtsmarke, Pool-Zahl und jeden „Join the Fam"-Knopf; die
Kopfzeile blendet seit `b539cef` mit einem Verlauf aus, statt mit einer Kante
abzuschliessen. Aktiv in `Nav`, `Hero`, `FinalCta`, `TravelPool`, `WhyWeDoThis`.

Die Regel ist heute enger gemeint: **keine dekorativen Verläufe, kein Glow, keine
Orbs.** Der eine Marken-Verlauf ist die Ausnahme und kommt immer aus `lib/brand.ts`.
