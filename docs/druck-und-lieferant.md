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

---

# Printful als Alternative — und die Verfahrensrichtung

**Aufgenommen am 08.09.2026.** Anlass: die Frage, wann welches Druckverfahren
gilt und ob ein Wechsel zu Printful sinnvoll waere.

> ⚠️ **Herkunft der Angaben in diesem Abschnitt:** eine KI-Recherche
> (Google AI Mode), **nicht bei Printful nachgemessen und nicht von Printful
> bestaetigt**. Alles darunter ist **Recherchestand, kein Befund.** Vor einer
> Entscheidung gilt Arbeitsregel 2 — messen, nicht raten: Testbestellung,
> Preisliste im eingeloggten Konto, Verfuegbarkeit je Land.
> Der Rest dieser Datei (Preise, Katalogzahlen, Roberts Zusagen) ist dagegen
> abgelesen bzw. schriftlich zugesagt.

## Die Verfahrensrichtung — unabhaengig vom Lieferanten

Der Konsens der Recherche deckt sich mit dem, was oben schon steht, und laesst
sich auf die drei Motivarten von OneFam abbilden:

| Motiv | Verfahren | Warum |
|---|---|---|
| **OneFam-Zeichen, einfarbig** | **DTG** | Tinte zieht in die Faser, kein Fremdkoerper auf der Brust. Traegt den „leises Erkennungszeichen"-Charakter. |
| **Verlaufsmotiv (Gradient)** | **DTG**, auf tiefschwarz eher **DTF** | DTG bildet Verlaeufe weich ab. Auf sehr dunklem Stoff braucht es die Weissunterlage — genau die Stelle, an der es heute flau wird. |
| **Laenderlinien, mehrfarbig** | **DTF** | Deckkraft ist im Film angelegt, feine bunte Linien bleiben scharf und versinken nicht im dunklen Stoff. |
| **Spaeter: Caps, Mischgewebe, Reisetextil** | **DTF** | DTG ist auf Baumwolle beschraenkt. |

**Das ist keine neue Erkenntnis, sondern bestaetigt die offene Frage oben:**
koennen Creator 2.0, Changer 2.0 und Cruiser 2.0 bei Shirt-King auf **DTF**
umgestellt werden? Solange die drei fest als DTG im Katalog stehen, laesst sich
die Zuordnung nicht umsetzen — **egal bei welchem Lieferanten.**

**Siebdruck bleibt draussen, solange Print-on-Demand laeuft.** Er rechnet sich ab
ca. 100 gleichen Teilen; fuer die mehrfarbigen Laenderlinien braucht jede Farbe
ein eigenes Sieb, und die Weissunterlage zaehlt mit (steht oben). Verlaeufe kann
er ohnehin nur rastern. Fuer ein einfarbiges Logo in Auflage waere er
unschlagbar — das ist aber ein anderes Geschaeftsmodell, siehe „Was der
Siebdruck kaputt machen wuerde".

## Was Printful anders macht

| | Shirt-King / Heldenwerbung | Printful |
|---|---|---|
| Produktion | **Teltow bei Berlin**, ein Ort | mehrere Werke; Stanley/Stella laut Recherche **nur in EU-Werken** (Lettland, Spanien) |
| Rohteile | Stanley/Stella u. a., Preise oben abgelesen | fuehrt **dieselben** Modelle: Creator 2.0 (STTU169), Changer 2.0 (STSU178), Cruiser 2.0 (STSU177) |
| Anbindung | PodOS, Projekt `onefam-441595` | eigenes **WooCommerce-Plugin**; verlangt Permalinks ausser „Einfach" und die **Legacy-REST-API** |
| Naehe | deutsches Familienunternehmen, Ansprechpartner mit Namen | Grosskonzern, standardisierter Ablauf |

**Der Vergleich ist ungewoehnlich sauber moeglich**, weil beide dieselben drei
Rohteile fuehren. Die Netto-Rohteilpreise bei Shirt-King stehen oben
(6,64 / 16,30 / 21,22 €) — ein Preisvergleich braucht also nur die
Printful-Seite.

## Vier Nebenwirkungen, die ein Wechsel haette — die wiegen schwerer als der Stueckpreis

1. **Die Steuerfrage verschiebt sich, sie verschwindet nicht.** Der ganze
   Vorbehalt in `behoerden-mwst-zoll.md` haengt daran, dass die Ware **in Teltow
   startet** und der Verkauf damit umsatzsteuerlich in Deutschland stattfindet.
   Produziert Printful in Lettland oder Spanien, ist es **ein anderes Land mit
   eigenen Regeln** — die offene Anfrage ans Finanzamt Konstanz waere dann
   womoeglich gegenstandslos, dafuer stellt sich dieselbe Frage neu. **Vor einem
   Wechsel gehoert das geklaert, nicht danach.**
2. **Das Preis-Rueckschreiben waere weg.** Vier belegte Vorfaelle (07.09. zweimal,
   08.09. zweimal), zuletzt 367 protokollierte Abweichungen — alle aus dem
   PodOS-Sync von Shirt-King. Ein Wechsel loest das an der Wurzel; Snippet 108
   und die Preis-Wache waeren nicht mehr noetig. **Das ist der staerkste
   sachliche Punkt fuer Printful.**
3. **Der Shop muesste neu bestueckt werden.** 42 Produkte, ueber 3 200
   Variationen, Slugs, EUR-Festpreise, die von Hand gepflegten Kacheln in
   Snippet 11 und die am 08.09. aufgeraeumten Galerien. Wer den Slug aendert,
   zerreisst ausserdem die Preis-Zuordnung im Router (Arbeitsregel 10).
   **Das ist Wochen, nicht Tage.**
4. **Die Modellbilder haengen nicht am Lieferanten.** Sie sind selbst erzeugt und
   bleiben nutzbar. Nur die **Druckdateien** muessten gegen Printfuls Vorgaben
   geprueft werden.

## Was zuerst passieren muss — die Reihenfolge

**Der Wechsel ist heute nicht zu entscheiden, weil die entscheidende Antwort
fehlt.** Offener Punkt 6 in `stand.md`: die Anfrage an Shirt-King vom
03.09.2026 ist unbeantwortet.

1. **Antwort von Shirt-King abwarten.** Zwei Fragen entscheiden alles:
   war die DTG-Einrichtung fehlerhaft (dann liefert DTG, ohne jeden Wechsel),
   und laesst sich auf **DTF** umstellen (dann ist die Verfahrensfrage geloest)?
2. **Faellt eine der beiden Antworten aus**, wird Printful zur ernsten Option —
   dann aber mit einer **Testbestellung derselben drei Modelle** und einem
   Vergleich der Weissdeckung auf dunklem Stoff. Nicht nach Prospekt entscheiden;
   genau daran ist die Sache bei Shirt-King ja gescheitert.
3. **Vor jedem Wechsel: die Steuerfrage neu stellen** (Nummer 1 oben).
4. **Nie beide Wege parallel bespielen.** Zwei Fulfiller auf denselben Produkten
   heisst zwei Sync-Quellen auf denselben Preisfeldern — das Problem, das gerade
   erst eingefangen wurde.

## Wenn OneFam eines Tages global verkauft

Die Recherche nennt einen Punkt, der zur Marke passt: „For souls who belong to
more than one place" heisst potenziell Kunden ausserhalb Europas. Shirt-King
versendet weltweit, aber **immer aus Teltow** — mit Zoll und Laufzeit fuer den
Kunden. Printful koennte in anderen Regionen lokal produzieren, **allerdings
laut Recherche nicht mit Stanley/Stella** (nur EU-Werke), sondern mit anderen
Rohteilen. Das hiesse: **anderes Produkt fuer andere Regionen** — und damit ein
Bruch in Haptik und Qualitaet, den eine Marke mit „Values, not facade" schwer
erklaeren kann. **Ungeloest, und vor einem globalen Start zu entscheiden.**


---

# Stickerei, Modellwechsel und Stick-oder-DTG je Land — 12.09.2026

Aufgenommen aus einer Fremdanalyse (KI, Marke und Produktion) und einer zweiten
KI-Sitzung mit Projektzugriff. **Recherche- und Einschaetzungsstand, nicht
gemessen** — mit Ausnahme der Zahlen, die weiter oben in dieser Datei bereits
belegt sind.

## Drei Punkte der Fremdanalyse — zwei stimmen nicht, einer nur halb

1. **Die Laendermotive sind keine Routen — aber sehr wohl eine Strichzeichnung.**
   Am 12.09.2026 nachgemessen: unterbrochene Striche, die Flagge liegt **in** den
   Strichen. **Die hier zuvor notierte Gegendarstellung („Flagge dahinter, also
   Flaechen") war selbst falsch** und ist korrigiert → `stick-und-druck-je-land.md`.
   Die dort empfohlene 1-mm-Vorbereitung fuer DTF bleibt trotzdem gegenstandslos:
   unsere Striche sind **4,6 mm** breit (Hoodie 11,1 mm), nicht 1 mm.
2. **„Shirt-King bietet Stickerei direkt an" — richtig, aber nicht im Selbstbedienungsweg.**
   Am 12.09.2026 auf shirt-king.de gelesen: Stickerei wird angeboten, **ab 30 Stueck
   je Motiv**. Im Katalog des Kundenportals (acht Optionen, Preisstand 16.03.2026)
   steht sie nicht — sie laeuft also **ueber Anfrage und als Auflage**, nicht ueber
   Print-on-Demand.
3. **DTG oder DTF ist nicht frei waehlbar.** Die Druckart haengt bei Shirt-King
   **fest am Rohteil im Katalog** (steht oben). Eine Empfehlung „fuer das Logo
   DTG, fuer die Laender DTF" laesst sich heute gar nicht einstellen.

## Stickerei als drittes Verfahren

| | |
|---|---|
| **Idealfall** | die **einfarbige Signature** (Logo Black, Logo White, Volltoene). Garn deckt immer — damit waere das Weiss-auf-Schwarz-Problem der Signature geloest, **ohne Siebdruck**. |
| **Geht nicht** | das bunte Logo mit **Farbverlauf**. Stickbar nur in Farbstufen, das ist ein anderes Motiv. |
| **Mindestmenge** | **30 Stueck je Motiv** (shirt-king.de, gelesen 12.09.2026). Damit ist Stick **kein Print-on-Demand**, sondern eine Auflage — wie der Siebdruck, nur mit niedrigerer Schwelle als dessen 100. |
| **Haken Textil** | ein vollflaechiger Stick von rund **8 × 10 cm** wird auf dem duennen Creator-Shirt (180 g/m²) steif und zieht den Stoff zusammen. Auf Sweater und Hoodie (350 g/m²) ist das unkritisch. |
| **Haken Kosten** | jedes Motiv muss einmal **fuers Sticken aufbereitet** werden (Punchen), und das kostet **je Motiv**. Bei **252 Laendern** lohnt das nur fuer wenige. |
| **Garn** | **trilobales Polyester** statt Viskose. Viskose glaenzt staerker, wird aber nach mehreren Waeschen matt; Polyester ist farb-, wasch-, UV- und chlorbestaendig und mit trilobalem Garn nahe am selben Glanz. Recherche, nicht gemessen — welche Reihen Shirt-King fuehrt, ist zu erfragen. |

**Damit steht der Vorschlag: die Signature sticken** — ein Motiv, wenige Farben,
30 Stueck sind erreichbar. **Die Laender bleiben beim Druck**, weil 252 Motive
252 Stickdateien und 252 × 30 Stueck hiessen.

**Offen bei Shirt-King:** Stickpreis je Stueck, Kosten fuers Punchen, gefuehrte
Garnreihen, und ob die 30 Stueck je Motiv oder je Bestellung gelten. Gehoert in
dieselbe Anfrage wie die DTF-Umstellung.

## Stick, DTF oder DTG je Land — am 12.09.2026 gemessen und neu gefasst

**Was hier bis zum 12.09.2026 stand, war falsch.** Die Einteilung ging davon aus,
die Motive seien „das Gesicht mit der Flagge dahinter, also flaechige Farbfelder",
und leitete daraus ab, welches Land stickbar ist. Nachgemessen an den 196 Dateien
in `public/faces/` stimmt die Annahme nicht:

**Das Motiv ist eine Strichzeichnung mit unterbrochenen Strichen, und die Flagge
liegt *in* den Strichen.** Die Striche sind ueber alle Laender identisch: **4,6 mm**
bei 69 mm Druckbreite (Shirt und Sweater), **11,1 mm** bei 166 mm (Hoodie) — also
**nicht** das Problem. Das Problem sind die Farbstuecke **innerhalb** eines Strichs.

**Die vollstaendige Einteilung mit Messwerten und allen 196 Laendern steht in
`docs/stick-und-druck-je-land.md`.** Sie ist am 12.09.2026 **neu gefasst worden**,
weil zwei Vorgaben dazukamen: **es darf nichts weggelassen werden**, und der
**Hoodie** traegt 166 statt 69 mm. Gemessen wird seitdem der **Anteil der Flaeche
in Teilen unter 1 mm** — am Shirt sind **116 von 196** Motiven ohne Verlust stickbar,
**26** verlieren ueber 5 %. **Am Hoodie kann die Webdatei die Frage nicht
beantworten** (ein Pixel waere dort 1,05 mm) — dafuer braucht es die EPS-Dateien.

**Zur Haltbarkeit, weil es verwechselt wird:** DTG **blaettert nicht ab**, es
**verblasst** — die Tinte sitzt in der Faser. Was sich loesen kann, ist die
**DTF-Folie**, weil sie aufliegt.

### Wie scharf DTG wird — aus der ersten Runde ueber elf Motive

| Ergebnis | Laender |
|---|---|
| Sauber | Peru, Bosnien, **Albanien** (gemessen, der Adler ist kraeftig genug) |
| Gut, Kleinteile werden weich | Argentinien (Sonne), Andorra (Wappen), Antigua (Sonne), Anguilla (Delfine) |
| Details gehen verloren | Mexiko (Adler im Mund wird ein Farbfleck), Brunei (Wappen unscharf), Brasilien (Schriftzug auf dem Band nicht lesbar), **Afghanistan** (Schrift laeuft zu) |

**Die Signature:** Logo Black, Logo White und die einfarbigen Toene sind der
ideale Fall fuers Sticken. Das bunte Logo mit Verlauf nur per DTG oder DTF.

## Modellwechsel Shirt und Hoodie — gerechnet, nicht empfohlen

Die Analyse raet zu **Oversize**, weil der Medium-Fit bei der Zielgruppe wie
Werbe-Merch wirke:

| | heute | Vorschlag |
|---|---|---|
| Shirt | Creator 2.0, 180 g/m² | **Freestyler STTU788**, 240 g/m², Relaxed Fit |
| Sweater | Changer 2.0, 350 g/m² | **bleibt** — kein Aenderungsbedarf |
| Hoodie | Cruiser 2.0, 350 g/m² | **Slammer** (im Shirt-King-Katalog „Oversized Hoodie") oder **Striker** (schwer) |

**Der in der Analyse genannte „Ledger" existiert im Katalog nicht**, und der
Slammer ist dort nicht das schwere Modell, sondern das Oversize-Modell.

### Was der Wechsel im Einkauf kostet

| | Rohteil heute | Rohteil neu | Mehrkosten |
|---|---|---|---|
| Shirt | 6,64 € | Freestyler **13,36 €** | **+6,72 €** |
| Hoodie | 21,22 € | Slammer **31,76 €** | **+10,54 €** |
| Hoodie | 21,22 € | Striker | **+19,10 €** |

Auf die Herstellkosten in `supabase/migrations/0010_kosten.sql` gerechnet
(Rohteil + 5,50 Druck + 0,69 Handling, × 1,19 USt, × 0,925 CHF):

| | heute | mit Wechsel |
|---|---|---|
| Shirt | 14,12 CHF | **21,52 CHF** |
| Hoodie (Slammer) | 30,17 CHF | **41,77 CHF** |
| Hoodie (Striker) | 30,17 CHF | **51,20 CHF** |

**Beim Shirt wird es eng.** 40 CHF Verkaufspreis gegen 21,52 CHF Herstellkosten,
davon gehen **Versand und Gebuehren noch ab**. Die Verkaufspreise 75 / 65 / 40
sind gesetzt (`docs/REGEL-preise.md`) — der Wechsel geht also **voll zulasten
der Marge und damit des Pool-Anteils**.

### Was am Wechsel sonst noch haengt

1. **Neue Migration fuer die Herstellkosten** — `0010` ist angewendet und wird
   **nie geaendert**; es braucht eine neue Nummer mit neuen `product_costs`.
   Dabei `item_kind` (`light` / `heavy`) pruefen: ein 240-g-Shirt kann in der
   Versandstaffel kippen.
2. **Alle Modellbilder und Mockups neu.** Die Druckmasse sind **je Schnitt**
   geeicht und die Ghost-Referenz haengt an der Stanley/Stella-Bildadresse mit
   dem Modellcode im Pfad → `docs/RUNBOOK-laenderlauf.md`, Abschnitt 2.
3. **Slugs nicht anfassen** — sonst reisst die Preis-Zuordnung im Router
   (Arbeitsregel 10).

### Die Empfehlung aus der Sitzung

**Jetzt nicht wechseln.** Ein **Freestyler-Muster** zu den ohnehin faelligen
Drucktests dazubestellen und erst **mit der ersten Siebdruck- oder
Stickauflage** umstellen. Ein Argument spricht wirklich fuer den Wechsel: **ein
schweres Shirt vertraegt einen Stick deutlich besser als der duenne Creator.**

## Was an diesem Abschnitt ungeprueft ist

- Die Rohteilpreise **13,36 / 31,76 €** und der Striker-Aufschlag stammen aus
  der zweiten Sitzung und sind **hier nicht nachgemessen**.
- **STTU788** sowie die Grammaturen 240 und 400 g/m² sind Prospektangaben.
- **Bei Shirt-King ist der Stickpreis nicht angefragt.** Belegt ist nur, dass es
  Stickerei gibt und sie **ab 30 Stueck** laeuft (Website, 12.09.2026).
- Die Laendereinteilung in `stick-und-druck-je-land.md` ist an den **Webdateien**
  (256 px) gemessen, nicht an den Druck-PDF, und deckt **196 von 252** Laendern ab.
