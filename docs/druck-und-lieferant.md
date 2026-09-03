# Druckverfahren und Lieferant

Festgehalten am 03.09.2026. Zwei Straenge, die zusammengehoeren: was Shirt-King
zum Siebdruck zugesagt hat, und warum das heutige DTG nicht liefert.

Lieferant ist **Heldenwerbung GmbH**, Oderstr. 63, 14513 Teltow — Marken
Shirt-King und Button-King, Bestellabwicklung ueber PodOS
(Projekt `onefam-441595`).

| Rolle | Person | Kanal |
|---|---|---|
| Vertrieb / Angebote | Robert Koch, Head of Commercial | `robert.koch@heldenwerbung.de`, Anfragen an `hello@shirt-king.de` |
| Technik / PodOS | „HW-Christian" | PodOS-Chat, Kanal `onefam` |

---

## Das eigentliche Problem: das Weiss deckt nicht

Bereits produzierte Teile kamen mit **flauem, graustichigem Weiss** aus dem
DTG-Druck — bei **allen** Teilen, nicht vereinzelt. Fotos liegen vor.

DTG auf dunklem Stoff braucht zwingend eine **Vorbehandlung**, darauf eine
**Weissunterlage**, erst dann die Farben. Fehlt die Vorbehandlung oder ist sie zu
duenn, wird das Weiss grau und waescht sich aus — genau das Schadensbild.

**Die Frage vor der Verfahrensfrage lautet deshalb: wurde ueberhaupt richtig
eingerichtet?** Wenn nicht, ist nicht das Verfahren schuld, sondern die
Einstellung — und DTG koennte liefern, was gebraucht wird, ohne jeden Wechsel.

Dazu der Punkt, der bei einem Shop schwerer wiegt als ein einzelnes Muster:
**haengt das Ergebnis daran, wer an der Maschine sitzt?** Ein gelungenes Muster
nuetzt nichts, wenn der naechste Lauf anders aussieht. Zu klaeren ist deshalb, ob
sich die Einstellungen **als Profil je Artikel hinterlegen** lassen.

## DTF kostet dasselbe wie DTG — und ist nicht freigeschaltet

Aus dem Kundenportal `client.shirt-king.cloud`, Reiter „Optionen",
Preisstand 16.03.2026 (abgelesen, nicht von Shirt-King bestaetigt):

| Position | Netto |
|---|---|
| DTG pro Seite | 5,50 € |
| **DTF pro Seite** | **5,50 €** |
| Neck DTF | 1,49 € |
| Manual Print | 5,50 € |
| other Transfer | 5,50 € |
| Mug Sublimation | 5,50 € |
| Order Handling Fee | 0,69 € |
| Special Application | 0,39 € |

**Der Preis haengt nicht am Verfahren.** Der Haken sitzt woanders: die Druckart
steht **fest am Rohteil im Katalog** und ist keine waehlbare Option.

| Artikel | Rohteil | Druckart |
|---|---|---|
| Creator 2.0 Shirt | 6,64 € | DTG |
| Changer 2.0 Sweater | 16,30 € | DTG |
| Cruiser 2.0 Hoodie | 21,22 € | DTG |

Von 383 Katalogeintraegen sind 218 DTG und 153 DTF — DTF ist also breit im
Einsatz. **Kurios: dieselben Modelle in Kindergroesse (Mini-Creator 2.0,
Mini-Changer 2.0, Mini-Cruiser 2.0) sind als DTF gefuehrt.** Es liegt also nicht
am Stoff und nicht am Schnitt.

Daraus folgt die entscheidende Frage an Shirt-King: **koennen die drei Artikel
auf DTF umgestellt werden?** Bei DTF ist die Deckkraft schon im Film angelegt,
das Ergebnis haengt also weniger an der Tagesform der Maschine.

Siebdruck taucht in der Preisliste **nicht** auf — er wird individuell
kalkuliert, deshalb braucht Robert das Motiv.

## Was Robert zum Siebdruck zugesagt hat

- **Mindestmenge 100 Stueck je Motiv.** Darunter empfiehlt er DTG oder DTF.
- **Die 100 gelten je Motiv, nicht je Textilfarbe.** Dasselbe Motiv darf auf
  verschiedene Stofffarben, solange die Gesamtmenge stimmt. Damit faellt die
  Ueberlegung weg, die Vorbestellrunde auf Schwarz und Weiss zu beschraenken.
- **Stueckpreise erst nach Ansicht des Motivs.** Anzahl Druckfarben und
  Druckgroesse bestimmen den Preis.
- **Die weisse Unterlage auf dunklem Stoff zaehlt als zusaetzliche Druckfarbe.**
  Bei ueberwiegend schwarzen Teilen trifft das jedes mehrfarbige Laendermotiv.
- **Einrichte- und Siebkosten sind im Druckpreis enthalten.**
- **Einzelversand an Privatadressen: ja** — Kommissionierung in Einzelpakete und
  Direktversand an Endkunden, **auch in die Schweiz und die EU**. OneFam liefert
  die Adressliste, Heldenwerbung uebernimmt Verpackung und Versand.
  Sammellieferung an eine Adresse ebenfalls moeglich.
- **Vorlaufzeit 10–12 Werktage** nach Druckfreigabe bis zum Versand, plus 1–2
  Tage Kommissionierung bei Einzelversand an viele Adressen. Verbindliches
  Lieferdatum bei Auftragserteilung.
- **Kein pauschaler Ueberschuss** — es wird auf die gewuenschte Stueckzahl genau
  produziert.
- **Rohteile kommen von ihnen.** Angelieferte Textilien werden nicht bedruckt.

### Was daraus schon feststeht

Weil die Rohware von ihnen kommt, ist es eine **Warenlieferung, keine
Veredelungsleistung**. Die 19 % auf ihrer Rechnung sind bei **deutschen**
Lieferungen strukturell richtig. Fuer Ausfuhren bleibt es bei dem, was in
`behoerden-mwst-zoll.md` steht — dort ist die Frage offen.

## Was der Siebdruck kaputt machen wuerde

Drei Dinge, die heute erledigt oder wenigstens stabil sind, gingen bei einer
Vorbestell-Auflage wieder auf:

1. **Die Lieferzeit steht seit 02.09.2026 live auf jeder Produktseite**
   („3–7 Werktage"). Bei einer Auflage waeren es 10–12 Werktage plus
   Kommissionierung plus Laufzeit. Produktseiten **und** Versandrichtlinie
   muessten neu, in vier Sprachen.
2. **Der Widerrufsausschluss faellt.** Print-on-Demand haelt das Argument
   „nach Kundenspezifikation" wenigstens diskutabel. Eine vorproduzierte Auflage
   von 100 Stueck ist Vorratsware — dann ist es weg, nicht bloss angreifbar.
   → offener Punkt 3 in `stand.md`
3. **Vorbestellung heisst Geld fuer Ware, die es noch nicht gibt.** Eigener
   verbraucherrechtlicher Aufbau mit Lieferdatum-Zusage obendrauf.

**Bleibt der Shop bei Print-on-Demand und wird nur das Druckverfahren getauscht,
aendert sich an alldem nichts.** Das ist mehr wert als der Stueckpreisvergleich —
und der Grund, warum die DTF-Frage vor der Siebdruck-Frage steht.

Dazu: „kein pauschaler Ueberschuss" steht gegen Ziffer 3 der Rueckgaberichtlinie,
die bei Mangel kostenlosen Ersatz zusagt. Bei exakt 100 Stueck ohne Reserve heisst
ein Ersatzstueck: neue Auflage oder DTG. Ein Puffer gehoert in die Kalkulation,
nicht in die Vorsichtsabteilung.

## Gefragt am 03.09.2026 — Antwort steht aus

Die Anfrage an Robert Koch ist raus, **mit den Fotos der bisherigen DTG-Drucke**
als Beleg fuer das flaue Weiss und mit den drei Ländermotiven als Vektor-PDF.

Aufbau der Mail: erst die DTG-Qualitaet (weil sie entscheidet, ob ueberhaupt
Siebdruck noetig ist), dann DTF als Alternative, dann der Siebdruck. Diese
Reihenfolge ist Absicht — wenn DTF freigeschaltet wird, erledigt sich der Rest.

**Diese Punkte sind gestellt und offen:**

1. **DTF fuer die drei Artikel freischalten?** Dazu ein Muster auf dem echten
   schwarzen Rohteil, und eines nach mehreren Waeschen. Bei CHF 75 fuer einen
   Hoodie ist die Waschbestaendigkeit das Entscheidende.
2. **Wurde bei den bisherigen Auftraegen vorbehandelt und mit Weissunterlage
   gedruckt — und mit welchen Einstellungen?** Auftragsnummern beilegen, sonst
   wird es eine Meinungsdiskussion statt eines Blicks in die Auftragsdaten.
3. **Lassen sich die Einstellungen als Profil je Artikel hinterlegen?**
4. **Zaehlen die 100 Stueck ueber Kleidungsstuecke UND Groessen hinweg?** Robert
   hat nur die Textilfarbe beantwortet. Bei XXS–5XL und drei Kleidungsstuecken
   ist das der Unterschied zwischen 100 und einem Vielfachen davon.
5. **Gibt es eine Mindestmenge je Groesse oder eine feste Groessenstaffel?** Bei
   Vorbestellungen laesst sich die Groessenverteilung nicht steuern — sie ergibt
   sich aus den Bestellungen.
6. **Eine Druckgroesse fuer XXS bis 5XL, oder je Groesse ein eigenes Sieb?** Und
   falls ja: **zaehlt eine zweite Druckgroesse als zweites Motiv?** Wenn ja,
   verdoppelt sich die Mindestmenge.
7. **Wird auch die Siebdruck-Auflage aus Teltow versendet?** Daran haengt die
   ganze ESTV-Auskunft.
8. **Kosten fuer Kommissionierung und Einzelversand je Paket**, getrennt nach
   Deutschland, EU und Schweiz. Und ob eine Wiederholungsauflage guenstiger wird.

Nicht in die Preisanfrage gehoeren die **Ausfuehrer-Vereinbarung** und die Frage
nach USt. bei Drittlandsendungen — eigener Vorgang, schriftlich und fuer sich.

## Motivdateien

Robert braucht **Vektordaten**, kein PNG — aus einem Pixelbild lassen sich weder
Farbauszuege separieren noch Preise rechnen. Vorbereitet unter
`~/Downloads/Designs/Muster shirt-king/`:

`OneFam_Albanien_S6.pdf` · `OneFam_Montenegro_S144.pdf` ·
`OneFam_San-Marino_S207.pdf` · `OneFam_Muster_Uebersicht.png`

Die Logo-Linie liegt bereits als EPS bei ihm.

---

## PodOS: unbezahlte Bestellungen gingen in Produktion — behoben

Eine Bestellung wurde von PodOS als **bezahlt** uebernommen und in Produktion
gegeben, sobald aus WooCommerce ein **Zahlungslink geteilt** wurde — obwohl kein
Geld geflossen war.

**Behoben.** HW-Christian, 03.09.2026 im PodOS-Chat:

> „we have made the change to Woocomm integration to make sure that if a payment
> link is shared from woocomm, podOS will not pick this order up as paid until
> the status changes in Woocomm to confirm the order is actually paid."

Die **Gutschrift fuer den betroffenen Auftrag ist eingegangen** (Kreditkarte).
Christian hat um Bestaetigung gebeten; sie ist am **03.09.2026 raus**, zusammen
mit einem **geschwaerzten Auszug** als Beleg — nur die Zeile
`SHIRT-KING PRINT-ON-DE ... +42,82 EUR, 03.09.2026` ist sichtbar, alle uebrigen
Buchungen sind ueberdeckt. Die Balken wurden bewusst stehen gelassen statt die
Zeilen herauszuschneiden: ein zusammengeschnittenes Bild saehe so aus, als waere
Shirt-King der erste Eintrag. Datei:
`Downloads/Gutschrift_ShirtKing_03-09-2026_geschwaerzt.png`. **Damit ist der
Vorgang von unserer Seite abgeschlossen.**

**Unsere Seite war nie betroffen** — und aus demselben Grund. In
`app/api/woo/webhook/route.ts` gilt:

```ts
// 'processing' und 'completed' heissen: Geld ist da. 'on-hold' bewusst NICHT —
// das ist die Vorkasse-Warteschleife, da ist noch nichts bezahlt.
const BEZAHLT = new Set(['processing', 'completed']);
```

Ein geteilter Zahlungslink laesst die Bestellung auf `pending` oder `on-hold`
stehen — beides ist nicht in dieser Menge, der Pool wird also nicht
gutgeschrieben. Und `markReversed` steigt bei einer Bestellung, die nie bezahlt
war, wortlos aus. **Nicht aendern**, ohne diesen Absatz zu lesen.
