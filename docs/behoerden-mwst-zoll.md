# Behördenstand MWST und Zoll — was beantwortet ist, was fehlt

**Stand 02.09.2026.** Zusammenfassung der Recherche aus dem Projektordner (Übergabe-
protokolle, Behördenmails, Rechnungen). Hier im Repo, weil die Antworten die
Pool-Buchhaltung betreffen — siehe Abschnitt „Was das für die Zahlen bedeutet".

> Die ausführlichen Fassungen liegen im Projekt, nicht hier:
> `BEHOERDEN-stand-zoll-bazg-estv-01092026.md` und
> `MAIL-ENTWURF-finanzamt-konstanz-umsatzsteuer.md`.

---

## Der Punkt, an dem alles hängt

Die Ware startet in **Teltow bei Berlin**. Umsatzsteuerlich findet der Verkauf damit
in **Deutschland** statt, nicht in der Schweiz. Die Schweizer Nicht-Pflicht unter
CHF 100'000 hilft dort nicht — genau das hat die ESTV festgehalten.

## Drei Behörden haben geantwortet

**ESTV, 07.08.2026** (Geschäftsfall 65zq0017, Barbara Iseli) — Leistungsort
Deutschland, deshalb **keine MWST-Pflicht in der Schweiz**, auch über CHF 100'000
hinaus. Kein MwSt-Ausweis, solange nicht registriert. Umgesetzt am selben Tag über
Snippet 64 im Shop.

**BAZG, 20.07.2026** (Zoll Nord Basel, Barbara Götz) — Schweizer Einfuhrseite.
Sendungen aus dem Ausland sind grundsätzlich zoll- und mehrwertsteuerpflichtig,
aber Steuer- und Zollbeträge **bis CHF 5 werden nicht erhoben**. Der Zusatz, den man
leicht überliest: *„eine Einfuhrveranlagung muss jedoch trotzdem erstellt werden."*
Die MWST-Frage selbst hat die BAZG an die ESTV weitergereicht — befolgt, beantwortet.

**Deutsche Zollverwaltung** — zwei Aussagen, die vorher nur Annahme waren:

- **EORI:** für ein Unternehmen mit Sitz in der Schweiz **keine allgemeine Pflicht**.
  Nötig nur, wenn OneFam selbst als Anmelder oder Beförderer auftreten will.
- **Ausführer:** *„Mit Ausnahme der Ausfuhr von Waren durch eine Privatperson im
  persönlichen Gepäck ist Ausführer immer eine im Zollgebiet der Union ansässige
  Person."* Es kann also **nur Shirt-King/Heldenwerbung sein**. Und: die
  Geschäftspartner müssen **vertraglich festlegen**, wer die Rolle übernimmt.
  Die Grenzzonen-Ausnahme (10-km-Bezirke Ulm, Singen, Lörrach) greift nicht für
  Pakete, die in Teltow auf den Wagen gehen.

## Die Lücke

Alle drei Ketten enden an derselben vierten Stelle, und nur zwei wurden zu Ende
gegangen. Der deutsche Zoll schreibt ausdrücklich:

> „Die umsatzsteuerrechtliche Problematik wird in Deutschland nicht von der
> Zollverwaltung bearbeitet. Bitte wenden Sie sich daher an das **Finanzamt
> Konstanz** (ist für Unternehmen mit Sitz in der Schweiz zuständig) oder an das
> Bundeszentralamt für Steuern."

**Das Finanzamt Konstanz wurde nie angeschrieben.** Der Grund ist nachvollziehbar:
die ESTV-Auskunft war so klar, dass die deutsche Frage stillschweigend als
miterledigt galt. Sie wurde nie gestellt. Der Entwurf liegt im Projekt.

## Die deutsche Rechtslage, soweit ohne Behördenauskunft absehbar

- **Keine Kleinunternehmerregelung.** § 19 UStG gilt nur für im Inland Ansässige,
  seit 2025 über § 19 Abs. 4 zusätzlich für EU-Ansässige. Die Schweiz ist Drittland
  → Steuerpflicht **ab dem ersten Euro**.
- **Keine 10'000-€-Bagatellgrenze.** § 3c Abs. 4 UStG setzt Ansässigkeit in genau
  einem Mitgliedstaat voraus. OneFam ist in keinem ansässig → EU-Verkäufe ab dem
  ersten Euro im Zielland steuerpflichtig.
- **Zuständig:** Finanzamt Konstanz, Byk-Gulden-Str. 2a (§ 1 Abs. 1 Nr. 13 UStZustV).
- **OSS nutzbar**, obwohl kein EU-Sitz, weil die Ware in der EU losfährt —
  Registrierung beim BZSt über Deutschland. **Aber:** die deutschen Inlandsverkäufe
  gehören **nicht** in den OSS. Es braucht beides.
- **Vorsteuer:** nach Registrierung normaler Abzug in der Voranmeldung. Das
  BZSt-Vergütungsverfahren (Frist 30.06. des Folgejahres, Ausschlussfrist) ist nur
  für Unternehmer **ohne** steuerpflichtige Umsätze in Deutschland — für OneFam also
  versperrt, sobald ein deutscher Kunde beliefert wird.

## Sachstand der Umsätze

- **Genau ein echter Verkauf nach Deutschland:** Bestellung #4145, 23.07.2026,
  Argentina Shirt XS schwarz nach Rheinfelden (Baden), Bruttoerlös **39,57 EUR**.
  Keine weiteren Verkäufe nach Deutschland oder in die EU.
- **Bestellung #5164 (Basel) zählt nicht** — Fehlbestellung, vom Connector
  ausgelöst, **nie ausgeliefert**, Erstattung von Christian zugesagt.

### Rechnungen des Dienstleisters

| Beleg | Datum | Vorgang | USt. |
|---|---|---|---|
| `wtu-skc-26-30001` | 23.07. | Wallet-Aufladung 50,00 € | 0,00 € |
| `inv-skc-26-30031` | 07.08. | #4145 → Rheinfelden, DE | 17,04 netto + 3,24 = **19 %** |
| `inv-skc-26-30044` | 18.08. | #5164 → Basel, CH (storniert) | 35,99 netto + 6,84 = **19 %** |

Die 0 % beim Top-up sind **kein** Widerspruch: eine Guthabenaufladung ist noch keine
Leistung. Damit ist der alte Protokollpunkt vom 01.08. („Rechner sagt 19 %,
Belastung sagt 0 %") erledigt — es sind 19 %.

---

## Was das für die Zahlen in diesem Repo bedeutet

**Das ist der Teil, der die Pool-Buchhaltung betrifft, und er geht in die andere
Richtung als zuerst gedacht.**

Die zurückholbare Vorsteuer wurde in diesem Chat zunächst als reiner Gewinn
dargestellt (CHF 5.63 je Hoodie nach DE). Das ist nur die halbe Rechnung. Wer
Vorsteuer abziehen darf, **schuldet auch Umsatzsteuer auf seine Verkäufe** — und
dieser Posten ist mehr als doppelt so gross.

Referenzbestellung Hoodie CHF 75 + 7 Versand = 82 nach Deutschland:

| | heute | nach Registrierung, Preis gleich |
|---|---|---|
| Umsatz | 82.00 | 68.91 *(USt.-Schuld 13.09)* |
| Ware | −30.17 *(inkl. USt.)* | −25.35 *(Vorsteuer +4.82)* |
| Versand | −5.06 *(inkl. USt.)* | −4.25 *(Vorsteuer +0.81)* |
| Gebühr | −2.68 | −2.68 |
| **Marge** | **44.09** | **36.62** |
| **Pool 10 %** | **4.41** | **3.66** |

Unter dem Strich **−7.47 CHF je Bestellung, also −16.9 % Marge**: minus 13.09
Umsatzsteuer, plus 5.63 Vorsteuer. Der Preis, der die heutige Marge halten würde,
läge bei **CHF 91.20 statt 82.00 (+11,2 %)**.

**Konsequenz für die Kalkulation:** Sollte die Registrierung kommen, ist es **nicht**
mit einem Umstellen von `supplier_vat_pct` getan. Dann muss auch der **Umsatz** netto
gerechnet werden — `creditPoolForOrder` bekommt heute die Bruttosumme der Bestellung
und behandelt sie vollständig als Ertrag. Das wäre dann falsch, und zwar um 19 % des
Umsatzes.

Bis eine belastbare Auskunft vorliegt bleibt alles wie es ist: 19 % als echte Kosten,
Bruttoumsatz als Ertrag. Das ist der Stand, der sich belegen lässt.

---

## Offen

1. **Anfrage ans Finanzamt Konstanz.** Entwurf liegt im Projekt, sieben Fragen,
   davon 1–3 eilig (sie entscheiden, ob vor dem Albanien-Start registriert werden
   muss). Formlose Auskunft ist kostenlos aber unverbindlich; die verbindliche nach
   § 89 Abs. 2 AO ist gebührenpflichtig und förmlich zu beantragen.
2. **Ausführer-Vereinbarung mit Shirt-King.** Der Zoll gibt schriftliche Festlegung
   vor. Dazu die Frage, ob Drittlandsendungen mit oder ohne deutsche USt. fakturiert
   werden — vor dem ersten echten Paket in die Schweiz zu klären, nicht danach.
3. **Audit-Punkt A3 löst sich mit derselben Antwort.** Der vermeintliche Widerspruch
   „PAngV verlangt MwSt-Angabe bei DE-Lieferungen" gegen „ESTV verbietet MwSt-Ausweis"
   ist keiner: die ESTV verbietet den Ausweis der **Schweizer** Steuer. Was bei
   deutschen Lieferungen unter dem Preis stehen muss, klärt Frage 7 an Konstanz.

## Korrekturen, die diese Recherche ausgelöst hat

- Die Notiz „Deutscher Zoll & BAZG: **Entwürfe**" im Übergabeprotokoll ist
  **überholt** — beide Anfragen sind abgeschickt und beantwortet.
- „Die 19 % bei Ausfuhren sind trotzdem korrekt" war **zu schnell**. Wenn
  Heldenwerbung Ausführer ist und selbst versendet, ist **deren** Lieferung an OneFam
  die Ausfuhrlieferung und gehört nach § 4 Nr. 1a, § 6 UStG steuerfrei fakturiert.
- „`inv-skc-26-30044` ist zu reklamieren" war **zu forsch**. Die Bestellung wurde nie
  ausgeliefert und die Erstattung ist zugesagt — es gibt nichts zu reklamieren. Der
  Beleg zeigt nur, wie deren System kalkuliert, nicht wie sie eine echte Ausfuhr
  fakturieren.
- Die zurückholbare Vorsteuer als „bares Geld" darzustellen war **einseitig** — siehe
  die Rechnung oben. Netto kostet die Registrierung beim heutigen Preis Marge.
