# Stand — 08.09.2026

Übergabe an die nächste Sitzung. Vor grösseren Aufgaben hier hineinsehen, vor
`/clear` oder `/compact` hier fortschreiben.

**Repo sauber, `main` deckungsgleich mit origin.**

---

## Das Wichtigste zuerst — offene Punkte

| # | Was | Warum eilig |
|---|---|---|
| 1 | ✅ **Bestellung #4145 ist geklärt — es war eine Testbestellung** | Am 03.09.2026 in beiden Konten belegt: der Inhaber hat selbst gekauft (PayPal, eigene Kreditkarte; Belege liegen vor) und an einen Angehörigen nach Rheinfelden (Baden) liefern lassen. **Kein fremder deutscher Kunde** — die Aussage „keine Verkäufe an deutsche Kunden" gegenüber Konstanz hält also, es ist nichts nachzureichen. **Was bleibt:** die Lieferung nach Deutschland hat stattgefunden und ist umsatzsteuerlich eine Lieferung. → `behoerden-mwst-zoll.md` |
| 2 | **Antwort aus Konstanz abwarten** | Anfrage am 03.09.2026 raus, Bestätigung da. Antwort kommt **per Post nach Basel oder telefonisch**, nicht per Mail. Formlos und damit unverbindlich — reicht das nicht, folgt § 89 Abs. 2 AO (gebührenpflichtig). |
| 3 | **Ausführer-Vereinbarung mit Shirt-King** | Der deutsche Zoll gibt schriftliche Festlegung vor. Vor dem ersten echten Paket in ein Drittland klären, nicht danach. Dazu: fakturieren sie Drittlandsendungen mit oder ohne deutsche USt.? |
| 4 | Widerrufsrecht anwaltlich prüfen | Pauschaler Ausschluss ist nach deutschem Verbraucherrecht vermutlich angreifbar. Vor Launch. **Das geplante Siebdruck-Modell gehört mit auf den Tisch** — bei vorproduzierter Auflage fällt das Argument ganz. → `druck-und-lieferant.md` |
| 5 | **PayPal-Altkonto bereinigen** | Der Zahlungsweg läuft bereits über Payrexx Pay (am 04.09.2026 nachgemessen), es fliesst nichts mehr über PayPal. Übrig bleibt das alte Händlerkonto mit 38,23 EUR Guthaben, das für den Shop nicht taugt. Einzelheiten beim Inhaber. |
| 6 | **Antwort von Shirt-King abwarten** | Anfrage am 03.09.2026 raus, mit den Fotos der flauen DTG-Drucke und den Motiven als Vektor-PDF. Entscheidet, ob der Shop bei Print-on-Demand bleibt oder auf Vorbestellungen umgebaut wird — die DTF-Frage steht bewusst vorne. → `druck-und-lieferant.md` |
| 7 | ⚠️ **Preise gesetzt — Ursache gefunden, aber nicht behoben** | Am 07.09.2026 standen **364 Variationen** wieder auf der alten Reihe (Logo-Shirt 35 statt 40, Logo-Sweater 60 statt 65; zwei der vier Produkte **oeffentlich verkauft**). Gesetzt und vollstaendig nachgemessen: 42 Produkte, 3 210 Variationen, **0 Abweichungen**. **Die Ursache liegt bei Shirt-King:** deren Schluessel „heldenwerbung-409340" (Lesen/Schreiben) schrieb heute zweimal die alten Preise zurueck. **Es kommt wieder, solange PodOS die alten Werte fuehrt.** → siehe „Preise: die Ursache" unten und Punkt 11 |
| 8 | ⚠️ **zahls.ch geprueft — ein Punkt bleibt offen** | Am 08.09.2026 im eingeloggten Konto nachgesehen: **ein Auszahlungskonto ist hinterlegt**, keine Warnung, keine Rueckfrage, kein Verifizierungshinweis. **Aber der Kontoinhaber ist „Labinot Bajrami", eine Privatperson** — und zahls verlangt woertlich ein **geschaeftliches** Bankkonto. Beanstandet wird es nicht; es zeigt sich erst beim ersten echten Betrag. Guthaben ueberall CHF 0.00, nie eine Auszahlung erhalten. → „zahls.ch nachgesehen" unten |
| 9 | ✅ **Hero umgebaut — erledigt 07.09.2026** | Marke jetzt als quadratischer Block ueber der Ueberschrift statt als formatfuellender Hintergrund; Laenderkacheln direkt hinter den Hero gezogen. Erstes Kleidungsstueck: **920 → 438 px** (Referenzfenster 1440 × 685), **1519 → 540 px** (390 × 844). Entschieden: Kacheln, **nicht** das Lifestyle-Bild — das zeigt Brasilien, und `/brazil/` ist pausiert. → unten „Hero umgebaut" |
| 10 | 🎨 **Shop-Design: Startseite fertig, Unterseiten offen** | Stand 08.09.2026: der Hinweis „weitere Laender folgen" ist als Zeile unter der Kachelreihe zurueck, in allen vier Sprachen (Seite 4 666 → **4 712 px**). Die doppelten Fusszeilen und die 18 Galeriebilder waren **keine Befunde** — nachgeprueft, siehe unten. Die Signature-Reihe auf `/shop-by-country/` steht ebenfalls auf **vier** Kacheln (Seite 13 501 → **13 215 px**). **Die 14 Router-Seiten gehoeren nicht hierher:** den acht umgeleiteten fehlen die Modellbilder, das ist ein Laenderlauf, kein Design (→ „Die 14 Router-Seiten nachgezaehlt"). **Weiter offen im Design:** die Laenderwand von 249 „Bald verfuegbar"-Kacheln (11 706 px); die Produktseite nutzt nur **958 von 1440 px** Breite; der Sprach-Cookie-Fehler. |
| 11 | 🔴 **Shirt-King muss die CHF-Preise in PodOS korrigieren** | Ihr Schluessel schreibt sie sonst weiter zurueck — am 07.09.2026 zweimal (07:56 und 20:24 Uhr). Soll: **Shirt 40, Sweater 65, Hoodie 75**; sie senden 35 / 60. **Gehoert in die offene Anfrage aus Punkt 6.** Den Schluessel annullieren ist keine Loesung — er ist die Produktanbindung des Fulfillers. |

**Der Trichter bleibt geparkt** (freie Auswahl, Käufer-Voting) bis zur rechtlichen
Freigabe. Nicht als toten Code aufräumen.

**Am 06.09.2026 wurde der Shop gründlich überarbeitet** — Preise, Sprachen, Schriften,
Menü, Hero. Alles Einzelne steht weiter unten unter „Shop-Design unter der Lupe"; die
Sollwerte aus fünf Referenzshops in `REFERENZ-shopdesign.md`.

---

## Was zuletzt gemacht wurde — neueste zuerst

### Die 14 Router-Seiten nachgezaehlt — die Notiz war irrefuehrend (08.09.2026)

Punkt 10 fuehrte „im Router liegen 14 fertige Seiten, erreichbar sind 6". Die Zahlen
stimmen, **das Wort „fertig" nicht** — und das aendert, wer den Punkt loesen kann.

**Der Router hat 25 Seitenbloecke**, je `in_array($key, [...])` mit einem Heredoc
`OFPG_0` bis `OFPG_24`. Elf davon sind Geruest und Recht (Startseite,
`shop-by-country`, `produkt`, About, Kontakt, Kontaktangaben, Impressum, Rueckgabe,
Versand, Datenschutz, AGB), **vierzehn sind Kollektionsseiten**:

| erreichbar (6) | umgeleitet (8) |
|---|---|
| `afghanistan`, `albania`, `andorra`, `argentina` | `anguilla`, `antigua-barbuda`, `bosnia`, `brazil`, `brunei`, `mexico`, `peru` |
| `logo-black`, `onefam-logo` | **`onefam-white`** |

Die sechs antworten mit **200**, Kopfzeile `X-OneFam-Router: 1`, rund **114 600
Zeichen** je Seite. Die acht antworten mit **302 auf `/shop-by-country/``**.

**Die achte ist keine Laenderseite.** Frueher stand hier „sieben pausierte Laender" —
das stimmt, aber die Liste hat acht Eintraege: sieben Laender **und die Logo-Linie
Weiss** (`onefam-white`).

**Wer umleitet: Snippet 99** „OneFam pausierte Laender umleiten (31.08.2026)" —
**aktiv**, Geltungsbereich global, Prioritaet 10, 1 569 Zeichen, haengt an `init` mit
Prioritaet 0, schneidet das Sprachpraefix ab und leitet die gelisteten Slugs mit 302
um. Sein eigener Kommentar sagt den Grund: *„Die sieben Laender sind noch nicht fertig
bebildert; ihre Produkte stehen auf privat."*

**Nachgemessen, was den acht wirklich fehlt** — nicht aus dem Kommentar uebernommen:

| | die vier lebenden Laender | die acht umgeleiteten |
|---|---|---|
| Modellbilder im Router | `OneFam_<Land>_..._4k-600x745.webp` (2026/08) → **200** | `onefam-<land>-hoodie-mann.webp` (2026/07) → **404, alle acht** |
| Dateien mit „frontal" in der Mediathek | Albanien 56, Afghanistan 43, Argentinien 36, Andorra 34 | **keine einzige** |
| Produkte im Frontend | 200 | **404** |
| Produkte im wp-admin | veroeffentlicht | **privat**, Preise korrekt (Shirt 40 · Sweater 65 · Hoodie 75) |
| Produktbilder je Produkt | – | **8 bis 11** vorhanden (Freisteller je Farbe) |

**Die Modellbilder sind der Engpass, nicht der Router.** Von den 169 Dateien mit
„frontal" in der Mediathek gehoert **keine** zu einem der acht. Die Produkte liegen
fertig da, mit Preisen und Farbbildern — es fehlt der Bildersatz aus dem
Laenderlauf. **`onefam-white` hat ueberdies gar keine Produkte** (Suche nach
`white-logo` liefert nichts) — dort wartet laut Snippet-99-Kommentar der Siebdruck.

**Kein Loch in der Umleitung.** Geprueft: `/mexico`, `/de/mexico/`, `/en/mexico/`,
`/onefam-mexico.html`, `/onefam-brazil.html`, `/onefam-onefam-white.html` enden alle
auf `/shop-by-country/`. Zum Vergleich: `/onefam-albania.html` endet mit **200** auf
`/albania/`. Eine pausierte Seite ist auf keinem dieser Wege erreichbar.

#### Was ein Land wirklich braucht, um aufzugehen

Fuenf Schritte, drei davon ausserhalb des Routers. **Nur Schritt 1 ist Arbeit von
Stunden, der Rest sind Minuten:**

1. **Modellbilder erzeugen** — `RUNBOOK-laenderlauf.md`, Higgsfield. Das ist der
   Engpass.
2. **Im Router die Bildadressen des Landes** auf die neuen Dateinamen ziehen
   (heute zeigen sie auf den geloeschten Satz von 2026/07).
3. **Produkte von privat auf veroeffentlicht** — und dabei die **EUR-Festpreise je
   Variation** pruefen, sonst steht das Fehlerbild 82,50 / 71,50 / 44,00 da.
4. **Slug aus `$pausiert` in Snippet 99 entfernen.**
5. **In der Laenderliste von `/shop-by-country/`** den Eintrag von `"a":0,"u":""` auf
   `"a":1,"u":"/<slug>/"` setzen — die Liste ist fest verdrahtet, die Kachel wird
   sonst nicht golden. Heute stehen genau vier auf `"a":1`.

**Und zwei Stellen auf der Startseite, die niemand automatisch nachzieht:** die
Kachelreihe `.colgrid` ist **fest auf vier Kacheln** verdrahtet (vier Spalten, siehe
CSS-Kommentar), und die Hinweiszeile darunter sagt woertlich **„Vier Länder sind
fertig"** — in allen vier Sprachen in `OF_I18N`.

**Damit gehoert Punkt 10 nicht mehr ins Shop-Design.** Er ist ein Laenderlauf, und
der beginnt bei den Bildern.

### Signature-Reihe auf /shop-by-country/ auch auf vier Kacheln — 08.09.2026

Auf der Startseite steht die Signature-Reihe seit dem 07.09. auf vier Kacheln, auf
`/shop-by-country/` standen weiter **sieben**. `.sigrid` ist dort ebenfalls
vierspaltig — die fuenfte Kachel riss eine zweite Reihe auf, in der **drei Kacheln
standen und ein Platz leer blieb**.

**Der Eingriff ist derselbe wie am 07.09., aber die Stelle war anders gebaut.** Auf
der Startseite gab es bereits eine Liste `SOON`; hier waren die sieben Kacheln **fest
verkettet** (`kauf(...) + kauf(...) + bald(...) × 5`). Daraus ist jetzt eine Liste
`BALD` mit `BALD_ZEIGEN=2` und einer Schleife geworden. **Die Liste bleibt
vollstaendig** — Platinum, Bronze und Gold stehen mit ihren Bildadressen unveraendert
im Snippet, nur die Anzeige ist begrenzt. Damit ist die Mechanik auf beiden Seiten
dieselbe.

**Die Tiefenlinks bleiben fuer alle fuenf gueltig — nachgeprueft, nicht vermutet.**
`/shop-by-country/#sig-logo-<name>` ruft `openM()` ueber den **Namen**, nicht ueber
die Kachel:

| Adresse | Kachel sichtbar? | Fenster oeffnet |
|---|---|---|
| `#sig-logo-white` | ja | **„Logo White – Bald verfügbar"** |
| `#sig-logo-platinum` | **nein** | **„Logo Platinum – Bald verfügbar"** |
| `#sig-logo-gold` | **nein** | **„Logo Gold – Bald verfügbar"** |

Die Startseite verlinkt ohnehin nur White und Pink — sie baut ihre Links aus
`'/shop-by-country/#sig-'+slug(SOON[i][0])` und zeigt seit dem 07.09. nur die ersten
zwei.

**Nachgemessen, ausgeloggt, ohne Cache-Umgehung** (1440 × 820, `/de/`):

| | vorher | nachher |
|---|---|---|
| Kacheln in `#lltiles` | 7 (2 live, 5 bald) | **4** (2 live, 2 bald) |
| Reihen | 2, zweite mit einer Luecke | **1, voll** |
| Hoehe `#lltiles` | 564 px | **278 px** |
| Abschnitt `#signature` | 721 px | **435 px** |
| `#allc` beginnt bei | 1 219 px | **934 px** |
| Seitenhoehe | 13 501 px | **13 215 px** |
| Eintraege in `#allc` | 253 | **253, unveraendert** |

**Alle vier Sprachen, je mit geloeschtem `ofl`-Cookie:** vier Kacheln, Reihe 278 px,
Abzeichen uebersetzt — „Bald verfügbar", „Coming soon", „Bientôt disponible",
„Próximamente". Seitenhoehe fr 13 171, es 13 148, en 13 125 px. Konsole leer.

**Handy 390 × 844:** `.sigrid` faellt unter 860 px auf zwei Spalten, vier Kacheln
ergeben **zwei volle Reihen** (419 px), kein Querlauf. **Startseite unveraendert**
nachgemessen: 4 712 px, Hinweiszeile da, `#sgrid` weiter vier Kacheln.

**Snippet 11 vorher 2 489 599 Zeichen, nachher 2 490 562** — nach dem Neuladen
nachgeprueft, `active` weiter `true`, `code_error` leer. Sicherung des alten Blocks:
`docs/sicherung/snippet11-signature-shopbycountry-vor-08092026.js`.

**⚠️ Messfalle, in die ich zuerst hineingelaufen bin.** Der erste Test der Tiefenlinks
sagte „Fenster oeffnet nicht" — auch fuer die **sichtbare** Kachel White. Ursache:
das Browser-Werkzeug ruft die Adresse ohne Anker auf und **setzt den Anker erst nach
dem Laden**; beim Start war `location.hash` leer, und die Pruefung im Skript laeuft
genau einmal beim Laden. **Richtig gemessen wird so:** Anker setzen, **dann neu
laden**. Danach oeffneten alle drei Fenster. Haette ich der ersten Messung geglaubt,
haette ich einen Fehler gesucht, den es nicht gibt.

### Hinweiszeile auf der Startseite: weitere Laender folgen — 08.09.2026

Punkt 10 fuehrte als offen: seit dem Entfernen der Wappenreihe am 07.09.2026 stand
auf der Startseite **nirgends mehr, dass weitere Laender kommen** — die Kachel „Bald
verfuegbar" war Teil der entfernten Reihe.

**Eingebaut ist eine Zeile, keine fuenfte Kachel.** `.colgrid` ist vierspaltig; eine
fuenfte Kachel reisst eine zweite Reihe auf und drueckt die Gesichter unter 200 px —
davor warnt der CSS-Kommentar an derselben Stelle seit dem 07.09. Die Zeile sitzt
unter den vier Kacheln, links der Satz, rechts der Link auf `/shop-by-country/`:

> Vier Länder sind fertig — weitere folgen.    Alle Länder ansehen →

**Der Link fuehrt bewusst dorthin**, weil diese Seite ein Suchfeld je Land und eine
E-Mail-Anmeldung hat — der Weg fuer jemanden, dessen Land noch fehlt.

**Nur ein neuer Woerterbuch-Eintrag noetig.** Vor dem Schreiben nachgesehen (Regel 1):
`OF_I18N` fuehrte den Schluessel **`Shop all countries`** bereits in allen vier
Sprachen („Alle Länder ansehen", „Voir tous les pays", „Ver todos los países"). Neu
dazu kam nur der Satz. **Die Uebersetzung laeuft ueber `tx()`**, das Textknoten
getrimmt gegen `OF_I18N` schlaegt — deshalb steht im Markup der **englische**
Schluessel, wie ueberall sonst.

**Das Woerterbuch steht 25 Mal im Snippet**, einmal je Router-Seite. Der Eintrag ist
**nur in die erste Kopie** gesetzt (Position 100 031, vor der zweiten bei 210 011) —
die gehoert zur Startseite, und nur die hat eine Kachelreihe.

**Nachgemessen, ausgeloggt, ohne Cache-Umgehung** (1440 × 820 und 390 × 844):

| | vorher | nachher |
|---|---|---|
| Seitenhoehe 1440 × 820 | 4 666 px | **4 712 px** |
| `collage` | 402 px | **448 px** |
| `siga` ab · `featured` ab | 1 012 · 1 558 | **1 057 · 1 603** |
| Kachelbreite Desktop · Handy | 317 · 162 px | **unveraendert** |
| Zeile ab · Hoehe (Desktop) | – | **923 px · 28 px**, einzeilig |
| Zeile ab · Hoehe (390 × 844) | – | **961 px · 57 px**, zweizeilig, 14 px |
| Querlauf am Handy | – | **keiner** |
| Fehler in der Konsole | – | **keine** |

**Kontrast auf `#0A0A0A` gerechnet:** Satz `rgba(199,199,190,.72)` → **6,3:1**,
Link `#C9A84C` → **8,6:1**. Beide ueber der Schwelle 4,5:1.

**In allen vier Sprachen geprueft** — jeweils mit geloeschtem `ofl`-Cookie, sonst
misst man den Cookie und nicht die Adresse:

| | |
|---|---|
| `/en/` | Four countries are ready — more will follow. · Shop all countries → |
| `/de/` | Vier Länder sind fertig — weitere folgen. · Alle Länder ansehen → |
| `/fr/` | Quatre pays sont prêts — d’autres suivront. · Voir tous les pays → |
| `/es/` | Cuatro países ya están listos — pronto llegan más. · Ver todos los países → |

**Snippet 11 vorher 2 487 858 Zeichen, nachher 2 489 599** — nach dem Neuladen
nachgeprueft, `active` weiter `true`, `code_error` leer. Der REST-Aufruf antwortete
wie erwartet mit **200 und leerem Rumpf**; das sagt nichts, die Pruefung war das
Nachladen und die Live-Messung. Sicherung des Zustands davor:
`docs/sicherung/snippet11-collage-vor-08092026.html`.

**⚠️ Die Vier steht als Text im Woerterbuch.** Wer ein fuenftes Land aufschaltet, muss
sie in allen vier Sprachen nachziehen — der Hinweis steht als Kommentar neben dem CSS.

**Nebenbei aufgefallen, noch offen:** die vier Kacheln und der Hero-Knopf verlinken
**ohne Sprachpraefix** (`/albania/`, `/shop-by-country/`), die Menuelinks seit dem
06.09. **mit** (`/de/shop-by-country/`). Die Sprache geht dabei nicht verloren — am
08.09. auf `/albania/` mit Cookie `ofl=de` geprueft: Seite deutsch. Die neue Zeile
folgt dem Umfeld und bleibt praefixlos. **Einheitlich ist es nicht.**

### Drei Befunde aus Punkt 10 nachgeprueft — 08.09.2026

| Befund von frueher | Messung am 08.09.2026 |
|---|---|
| „Zwei Fusszeilen-Fassungen nebeneinander" | **Gibt es nicht mehr.** Produktseite und Router-Seite zeigen wortgleich dieselbe: „Startseite · Nach Land shoppen · Ueber uns · Kontakt" und „Datenschutz · Rueckgabe · Versand · AGB". Der Fusszeilen-Fix vom 06.09. hat das miterledigt. |
| „Produktseite mit 18 Galeriebildern als Kachelwand" | **War eine Fehlzaehlung.** Im Markup liegen 18 Bilder, **sichtbar sind 9** — als Schieber uebereinander (alle bei `top` 218) plus 9 Vorschaubilder bei 827 px. Der Kaufknopf sitzt bei **624 px**, also ueber der Falz. |
| Ueberschrift „Country" unuebersetzt | **Kein Fehler.** Das ist der Platzhalter-Titel `#csm-title` im **ausgeblendeten** „Bald verfuegbar"-Fenster; er wird beim Klick auf eine Kachel gefuellt. |

**Der echte offene Punkt der Produktseite ist die Breite:** Galerie 479 px + Textspalte
479 px = **958 von 1440 px**. Rechts bleibt eine Leerflaeche, und der helle Bereich
`#F4EFE6` steht weiter im schwarzen Markenraum.

**`/shop-by-country/` gemessen** (1440 × 820, ausgeloggt): **13 501 px hoch**,
`#allc` allein **11 706 px** mit **253 Kacheln — 4 verlinkt, 249 „Bald verfuegbar"**
(als `<button>`, sie laufen also in kein 404). Die Wand hat aber ein **Suchfeld**
(„Nach deinem Land suchen…") und je Land eine E-Mail-Anmeldung, sie ist nicht nur
Deko. ~~Offen bleibt: die Signature-Reihe zeigt dort weiter sieben Kacheln.~~
**Erledigt am 08.09.2026** — auch dort vier, siehe „Signature-Reihe auf
/shop-by-country/" oben.

### zahls.ch nachgesehen — 08.09.2026

Punkt 8 sagte: „ab dem 08.09.2026 nachsehen, ob der Auszahlungsstatus gruen ist".
**Einen ausdruecklichen Status gibt es nicht.** Was es gibt, ist ein hinterlegtes
Konto ohne Beanstandung — und eine Regel, die es nicht erfuellt.

**Gemessen im eingeloggten Konto** (`onefam.zahls.ch/cadmin/`, FREE Plan, Labinot
Bajrami / info@onefam.ch, 2FA per E-Mail eingerichtet):

| | |
|---|---|
| Auszahlungskonto | **hinterlegt** — Schweiz, Waehrung CHF, BIC leer *(IBAN bewusst nicht notiert)* |
| **Kontoinhaber** | **„Labinot Bajrami"** |
| Guthaben Payrexx Pay / Pay Plus | CHF 0.00 / CHF 0.00, verfuegbar wie „bald verfuegbar" |
| Total zur Auszahlung | **CHF 0.00** |
| bisherige Auszahlungen | **keine** („Sie haben noch keine Auszahlungen erhalten") |
| Auszahlungsrhythmus | **monatlich, jeweils am 31.**, enthaelt E-Commerce-Transaktionen **aelter als 8 Tage** |
| Dashboard EUR | 1 Zahlung, Umsatz EUR 39.57, letzte 30 Tage EUR 0.00 / −100 % |
| Warnungen, Rueckfragen, Verifizierungshinweise | **keine** |

**Der offene Punkt, woertlich aus dem Formular:**

> „Es muss sich um ein **geschaeftliches Bankkonto** (keine QR-IBAN) handeln und der
> Name des Kontoinhabers muss mit der tatsaechlichen Bezeichnung des Kontos
> uebereinstimmen, damit die Auszahlung **von Ihrer Bank** akzeptiert wird."

Hinterlegt ist ein Konto auf eine **Privatperson**. **zahls.ch beanstandet das nicht** —
es gibt keine Fehlermeldung und keine Sperre. Die Regel sagt aber, dass die **Bank**
die Gutschrift ablehnen kann. Da nie eine Auszahlung stattgefunden hat (Guthaben 0),
ist das **ungetestet** und faellt erst beim ersten echten Betrag auf.

**Zahlungsanbieter, mitgeprueft:** **Payrexx Pay ist eingerichtet**, Payrexx Pay Plus
(Auszahlung durch Partnerbank) ist **nicht** aktiviert, und **PayPal steht wieder unter
„hinzufuegen"** — ist also nicht mehr als Anbieter eingerichtet. Das bestaetigt die
Messung vom 04.09.: neues Geld landet bei zahls.ch, nicht mehr direkt bei PayPal.
Damit wird die Kontofrage beim ersten Verkauf real.

**Zu tun:** entweder ein geschaeftliches Konto hinterlegen (haengt an der GmbH, die
ohnehin auf der Liste vor dem Launch steht) oder bei zahls.ch vorab klaeren, ob sie
fuer ein Einzelunternehmen ein Privatkonto akzeptieren. **Vor dem ersten echten
Verkauf klaeren, nicht danach** — sonst haengt der erste Betrag fest.

### Signature eingedampft: von sieben Kacheln auf vier — 07.09.2026

Der Abschnitt zeigte **zwei lebende Kollektionen und fuenf „Bald verfuegbar"** — er
bestand also zu fuenf Siebteln aus Ankuendigungen, war mit **902 px der zweitgroesste
Block der Startseite**, enthielt **keinen einzigen Preis und keinen Produktlink**, und
stand direkt **vor** der einzigen Stelle mit Ware.

Dazu kam eine Doppelung im Kleinen: der Untertitel sagt bereits „heute in Farbe und
Schwarz, **bald in weiteren Farben**" — die fuenf Kacheln wiederholten denselben Satz
noch einmal im Bild.

**Geaendert:** eine Konstante `SOON_ZEIGEN=2` im Signature-Skript, die Schleife laeuft
jetzt ueber `Math.min(SOON_ZEIGEN, SOON.length)`. **Die Liste `SOON` bleibt
vollstaendig** — sie ist der Fahrplan, nur die Anzeige ist begrenzt.

**Warum genau zwei:** `.sgrid` ist vierspaltig. Zwei lebende plus zwei angekuendigte
fuellen die Reihe **genau** — eine fuenfte Kachel reisst eine zweite Reihe auf. Wer
mehr zeigen will, erhoeht den Wert und rechnet die Reihe neu; der Hinweis steht als
Kommentar daneben.

**Nachgemessen, ausgeloggt:**

| | vorher | nachher |
|---|---|---|
| Signature-Hoehe | 902 px | **546 px** |
| Kacheln | 7 (2 live, 5 bald) | **4** (2 live, 2 bald) |
| Reihen | 2 | **1** |
| Seitenhoehe gesamt | 5 405 px | **4 666 px (5,7 Bildschirme)** |

Konsole leer.

#### Wo die Startseite jetzt steht

| | Sitzungsbeginn | jetzt |
|---|---|---|
| Seitenhoehe | 6 787 px (9,8 Bildschirme) | **4 666 px (5,7)** |
| erstes Kleidungsstueck | 920 px / 1 519 px (Handy) | **525 px** |
| Produktlinks auf der Seite | 3, hinter Reitern | **4, alle sichtbar** |
| Featured-Abschnitt ab | 1 936 px | **1 558 px** |
| erster sichtbarer Preis | nicht gemessen | **2 264 px**, drei Stufen nebeneinander |
| Nennungen je Land | 3× | **1×** |
| Knopfkontrast | 3,56:1 | **4,95:1** |

**Die Abschnitte der Startseite, in dieser Reihenfolge** (gemessen 1440 × 820,
ausgeloggt):

| Abschnitt | ab | Hoehe | was er zeigt |
|---|---|---|---|
| `hero` | 0 | 525 | Marke als Block, Ueberschrift, Knopf |
| `collage` | 525 | 402 | **vier Laenderkacheln**, vier Spalten, Ware und Gesichter |
| `tagband` | 927 | 85 | One Love · One Culture · One Fam |
| `siga` | 1 012 | 546 | Signature, **vier Kacheln in einer Reihe** (2 live, 2 bald) |
| `featured` | 1 558 | 930 | **vier Produktkarten mit Preis**, je ein Land |
| `story` | 2 487 | 640 | „Zwei Orte, ein Mensch", Lifestyle-Bild Albanien |
| `faq` | 3 127 | 1 043 | Fragen |
| Fusszeile | 4 170 | 435 | |

**Entfallen am 07.09.2026:** die Wappenreihe `.countries` (Doppelung) und das
Lifestyle-Band `.worn` (warb fuer das pausierte Brasilien). Beide liegen mit
Rueckholanleitung in `docs/sicherung/`; ihr CSS steht unangetastet im Snippet.

### Preis-Wache gebaut: Snippet 106 — 07.09.2026

Damit ein Abdriften nicht wieder wochenlang unbemerkt bleibt, gibt es jetzt einen
**Beobachter, der keine Preise schreibt**: Snippet **106**, „OneFam Preis-Waechter:
unerwartete CHF-Werte protokollieren", aktiv, Bereich global.

Er haengt an `woocommerce_update_product_variation` und
`woocommerce_new_product_variation`, liest `_regular_price`, leitet den Sollwert aus
dem Produkt-Slug ab (hoodie 75, sweater 65, shirt 40) und notiert jede Abweichung.

**Nachsehen unter Einstellungen → Alle Einstellungen (`options.php`):**

| Option | Inhalt |
|---|---|
| `of_preis_abweichungen` | letzte 50 Faelle, neueste zuerst, eine Zeile je Fall |
| `of_preis_abweichungen_zaehler` | wie oft insgesamt |
| `of_preis_wache_zuletzt` | wann die Wache zuletzt gelaufen ist (Lebenszeichen) |

**Warum ein eigener Snippet und keine Aenderung an 89.** Der Rumpf von Snippet 89
laesst sich in dieser Umgebung nicht vollstaendig lesen (der Inhaltsfilter sperrt ihn),
und ein Beobachter gehoert ohnehin getrennt von etwas, das schreibt. Es ist keine
doppelte Loesung im Sinn von Regel 1: 89 uebersetzt Preise, 106 sieht nur zu.

**Geprueft, nicht nur gebaut.** An einer Variation des **privaten** Produkts
`onefam-white-logo-shirt` (558) den Preis kurz auf 35 gesetzt:

| | |
|---|---|
| Zaehler danach | **1** |
| Protokollzeile | `… | onefam-white-logo-shirt | Variation 558 | 35 statt 40` |
| nach Ruecksetzung auf 40 | **kein** neuer Eintrag, Zaehler bleibt 1 |
| Lebenszeichen | bei jedem Lauf aktualisiert |
| Preis danach | 40 ✓ |

Die Liste wird bewusst als **Zeichenkette** gespeichert, nicht als Array — ein Array
zeigt `options.php` nur als „SERIALIZED DATA", und genau dort soll man ohne Werkzeug
nachsehen koennen. Die erste Fassung hatte diesen Fehler; der Rest wurde mit einem
Einmal-Werkzeug (Snippet 107, nach dem Lauf geloescht) weggeraeumt.

**Grenze der Wache:** sie schlaegt erst an, wenn etwas schreibt. Sie ersetzt nicht die
Korrektur bei Shirt-King (Punkt 11), sondern macht sichtbar, ob sie gewirkt hat.

### Preise: die Ursache gefunden und die Werte gesetzt — 07.09.2026

**Aufgefallen ist es zufaellig**, beim Abfragen der Preise fuer den Signature-Umbau:
`cat-prices?category=onefam-logo` lieferte **75 / 60 / 35** statt 75 / 65 / 40.

**Vollstaendig nachgemessen** mit `wc/v3` im eingeloggten Backend — der einzigen
belastbaren Methode:

| Produkt | war | soll | Variationen | Status |
|---|---|---|---|---|
| `onefam-logo-shirt` | **35** | 40 | 84 | **publish** |
| `onefam-logo-sweater` | **60** | 65 | 94 | **publish** |
| `onefam-white-logo-shirt` | 35 | 40 | 92 | private |
| `onefam-white-logo-sweater` | 60 | 65 | 94 | private |

**Zwei davon wurden oeffentlich verkauft — CHF 5 zu billig pro Stueck.** Die uebrigen
38 Produkte waren korrekt.

#### Die Spur

**1. Die 542 stimmen.** Die sechs Produkte der beiden Logo-Linien haben zusammen
**exakt 542 Variationen** — genau die Zahl aus der Angleichung vom 06.09. Die
Angleichung war also **vollstaendig**; sie wurde danach rueckgaengig gemacht.

**2. Das Muster.** Beide **Hoodies** korrekt, zuletzt geaendert am 06.09. um 13:06 und
13:08. Alle vier **Shirts und Sweater** falsch, zuletzt geaendert **heute**, und zwar
paarweise ueber beide Linien: Sweater 07:56 und 07:57, Shirts 20:24 und 20:25. Ein
Prozess, der die Linien nacheinander durchgeht.

**3. Der Schluessel.** In den WooCommerce-REST-Schluesseln steht
**„heldenwerbung-409340 – API" (ID 3, Lesen/Schreiben), zuletzt benutzt am 07.09. um
20:26 Uhr** — eine Minute nach dem Ueberschreiben der Shirts. Angelegt am 22.07.2026
um 16:48, **demselben Tag, an dem alle Variationen entstanden**.

**Heldenwerbung ist Shirt-King** (bestaetigt vom Inhaber), PodOS ist deren Programm
fuer die Produktanbindung. **Der Schluessel muss bleiben** — er ist die Verbindung zum
Fulfiller. Die alten Preise stehen auf deren Seite.

**4. Warum es nie auffiel.** Snippet 89 uebersetzt CHF → EUR und **akzeptiert dabei
ausdrücklich beide Reihen**:

```
// 40 CHF -> 34.95 EUR      35 CHF -> 34.95 EUR   (Logo-Serie)
// 65 CHF -> 59.99 EUR      60 CHF -> 59.99 EUR
```

Ein falscher CHF-Preis erzeugt also einen **richtigen** EUR-Preis. Die Seite sieht
gesund aus, und nur wer CHF im Backend misst, sieht den Fehler. Der Waechter fuehrt
zudem Buch (`of_eur_wmcp_zaehler` = 489, `of_eur_wmcp_zuletzt`), hat aber **seit dem
24.08. nicht mehr gefeuert** — er schreibt laut eigenem Kommentar „nur dort, wo nichts
steht", und ein Sync, der nur CHF aendert, laesst die EUR-Meta stehen. **Deshalb
schweigt selbst das Protokoll.**

#### Gesetzt, nach dem vorgeschriebenen Weg

Erst **eine einzelne Variation** als Probe (753, onefam-logo-shirt): 35 → 40, und
`_regular_price_wmcp` blieb unberuehrt bei `{"EUR":"34.95"}`. Dann der Rest ueber
`variations/batch` in Paketen zu 50.

**Ergebnis, vollstaendig nachgemessen:**

| | |
|---|---|
| Produkte geprueft | **42** |
| Variationen geprueft | **3 210** |
| CHF-Abweichungen | **0** |
| EUR-Abweichungen | **0** |
| Variationen ohne EUR-Festpreis | **0** |
| gerenderte Produktseiten | 34.95 / 59.99 / 69.99 — korrekt |

#### ⚠️ Es kommt wieder

**Solange PodOS die alten Werte fuehrt, schreibt der naechste Sync sie zurueck** —
heute waren es zwei. Das gehoert in die offene Anfrage an Shirt-King (Punkt 6): **ihre
CHF-Preise muessen auf 40 / 65 / 75.**

Ein Vorschlag, der unabhaengig davon hilft und keine Preise anruehrt: **Snippet 89
sollte einen unerwarteten CHF-Wert protokollieren, statt ihn stillschweigend zu
schlucken.** Dann wird aus dem unsichtbaren Abdriften ein sichtbares Signal. Noch
nicht gebaut.

**Und eine Messregel, die hier zum ersten Mal getragen hat:** die Zahl der Variationen
gegen die Notiz halten. Dass die sechs Produkte **exakt 542** ergeben, hat die
Erklaerung „die Angleichung war unvollstaendig" widerlegt und den Blick auf das
Zurueckschreiben gelenkt.

### Featured umgebaut: Reiter raus, vier Laender nebeneinander — 07.09.2026

**Die Messung, die den Ausschlag gab.** Auf der Frage „macht Andorra als vierter
Reiter ueberhaupt Sinn" wurde die Startseite durchgezaehlt:

| Abschnitt | Hoehe | Produktlinks | Preis sichtbar |
|---|---|---|---|
| Hero | 525 | 0 | – |
| Kachelreihe | 402 | 0 | – |
| Signature | **924** | **0** | **–** |
| Featured | 1019 | **3** | **ja** |
| Story | 640 | 0 | – |
| FAQ | 1043 | 0 | – |

**Die ganze Startseite hatte drei Produktlinks**, alle im Featured-Abschnitt, alle vom
aktiven Reiter. **Der Featured-Abschnitt begann bei 1 936 px — 2,4 Bildschirme weit
unten**, und davor gab es auf der Seite ueberhaupt keinen Preis.

**Achtung bei dieser Zahl:** 1 936 ist der Anfang des Abschnitts, **nicht** die Stelle,
an der ein Preis steht — der sitzt in den Karten unter den Bildern. Wer „ab wann sieht
man einen Preis" messen will, muss den Text messen, nicht den Abschnitt. Heute steht
der erste Preis bei **2 264 px**; ein Vergleichswert von vorher wurde nie erhoben.
Featured war also nicht die Dopplung, sondern die **einzige** Stelle mit Ware.

**Warum die Reiter weg mussten.** Ein Reiter-Element zeigt nur seinen aktiven Zustand;
die grosse Mehrheit klickt keinen Reiter an. Bei drei Reitern blieben zwei Drittel
unsichtbar. Ein vierter Reiter haette das Modul vollstaendiger gemacht, aber nicht
wirksamer — er haette nur den verborgenen Anteil erhoeht. **Mein „Fehlbefund" vom
selben Tag (es zeige nur Albanien) beschrieb genau das, was Besucher sehen.**

**Was jetzt steht:** vier Karten, je ein Stueck aus einem anderen Land.

| | |
|---|---|
| Albanien Hoodie | CHF 75.00 |
| Argentinien Sweater | CHF 65.00 |
| Afghanistan Shirt | CHF 40.00 |
| Andorra Hoodie | CHF 75.00 |

Damit stehen **drei Preisstufen nebeneinander** statt dreier Preise desselben Landes —
40 als Einstieg laesst 75 kleiner wirken. Alle vier Laender sind ohne Klick sichtbar,
Andorra ist als **Ware** dabei statt als weiteres Etikett.

**Die Falle steckte in den Preisen.** `ofFeatPrices()` holte die sichtbaren Preise ueber
`cat-prices?category=<land>` fuer **ein** Land, gesteuert von `OF_AKT_LAND`. Bei
gemischten Laendern haetten drei Karten den **festen EUR-Notbehelf** aus dem
`feat`-Objekt behalten (`€69,99 EUR`) und eine den CHF-Preis. Deshalb laedt die
Funktion jetzt ueber `OF_FEAT_LAENDER` **alle** vorkommenden Laender und mischt die
Ergebnisse; `apply()` ordnet ohnehin ueber den Produkt-Slug zu und vertraegt mehrere
Durchlaeufe. **Nachgemessen: 0 von 4 Karten zeigen den EUR-Notbehelf.**

**Zweite Falle, dieselbe wie bei `cgrid`:** der Reiter-Zuhoerer rief
`document.getElementById('tabs').addEventListener(...)` **ohne Pruefung** auf. Ein
blosses Entfernen des Markups haette die Startseite in einen JS-Fehler laufen lassen.
Der Zuhoerer ist mit entfernt worden.

**Geaendert in Snippet 11** (2 485 970 → **2 487 049**): Reiter-Markup raus,
`andorra:` in `feat` ergaenzt, `FEAT_MIX` eingefuehrt, `renderFeat` und `ofFeatPrices`
umgestellt, Reiter-Zuhoerer entfernt, `.fgrid` von drei auf **vier Spalten** (unter
1100 px zwei, unter 760 px eine).

**Keine Uebersetzung noetig:** Ueberschrift und Unterzeile bleiben unveraendert und
sind mit vier Laendern weiter richtig; die Produktnamen laufen ueber die bestehende
Tabelle.

**Nachgemessen, ausgeloggt:** vier Karten bei 1440 / 1000 / 390 px, Spalten 4 / 2 / 1,
Preise ueberall CHF 75 / 65 / 40 / 75, alle vier Bilder liefern 200, Konsole leer.

**Dabei aufgefallen:** der **Signature-Abschnitt war mit 924 px der zweitgroesste
Block der Seite und verkaufte nichts** — kein Preis, kein Produktlink, und **fuenf von
sieben Kacheln „Bald verfuegbar"**, direkt **vor** der einzigen Stelle mit Ware.
**Noch am selben Tag behoben** → „Signature eingedampft" weiter oben.

### Laenderreihe entfernt: jedes Land stand zweimal auf der Startseite — 07.09.2026

Die Wappenreihe `.countries` (1012–1284 px) zeigte **dieselben vier Laender** wie die
Kachelreihe darueber (525–927 px) und verlinkte **dieselben vier Seiten** — dazwischen
lagen 85 px Tagband. Die Kachelreihe ist die staerkere von beiden: Ware, Gesichter,
Namen. Die Wappenreihe zeigte nur Wappen.

**Was dabei verloren geht — bitte nicht uebersehen:** die fuenfte Kachel **„Bald
verfuegbar"**. Das war auf der Startseite der **einzige** Hinweis, dass weitere Laender
kommen. In die Kachelreihe passt sie nicht: dort stehen vier Kacheln in vier Spalten,
eine fuenfte erzeugt wieder eine Waise. **Das ist ein offener Punkt, kein erledigter.**

**Eine Falle steckte darin.** Das fuellende Skript rief
`document.getElementById('cgrid').innerHTML` **ohne Pruefung** auf. Ein blosses
Entfernen des Abschnitts haette die Startseite in einen JS-Fehler laufen lassen — und
zwar in dem Skriptblock, der auch Waehrung und Uebersetzung bedient. Steht jetzt als
`(document.getElementById('cgrid')||{}).innerHTML`.

**Und eine Fehlzaehlung, die fast in die Irre gefuehrt haette:** eine erste Suche
meldete den Kasten `id="cgrid"` **zweimal**. Tatsaechlich gibt es ihn **einmal** — die
Zeile enthaelt „cgrid" zweimal (`class="cgrid" id="cgrid"`), und die Suchschleife
zaehlte dieselbe Zeile doppelt. Haette ich das geglaubt, waere die Absicherung als
unnoetig durchgegangen. **Beim Zaehlen von Vorkommen immer pruefen, ob das Muster in
derselben Zeile mehrfach steht.** `/shop-by-country/` hat eine eigene Reihe unter der
Kennung `allc` und ist nicht betroffen.

**Nachgemessen, ausgeloggt:**

| | vorher | nachher |
|---|---|---|
| Nennungen je Land auf der Startseite | 2 | **1** |
| Links auf die vier Laenderseiten | 8 | **4** |
| Seitenhoehe | 5 405 px (6,6 Bildschirme) | **5 133 px (6,3)** |
| Fehler in der Konsole | – | **keine** |
| `/shop-by-country/` | 253 Eintraege | 253, unveraendert |
| Startseite Franzoesisch | – | Kacheln uebersetzt, keine Fehler |

Markup in `docs/sicherung/snippet11-laenderreihe-entfernt-07092026.html`, das CSS
(`.countries`, `.cgrid`, `.cbadge`) steht unangetastet und wird von
`/shop-by-country/` ohnehin gebraucht. Snippet 11 nachher **2 485 970 Zeichen**.

~~Beim Pruefen aufgefallen: `.featured` traegt die Ueberschrift „Ausgewaehlte
Laender", zeigt aber nur Albanien.~~ **Das war ein Messfehler** — ich hatte nur die
gerenderten Links gelesen. Es war ein Reiter-Umschalter, Albanien war der aktive
Reiter. Siehe „Featured umgebaut" oben.

### Lifestyle-Band entfernt: es warb fuer ein pausiertes Land — 07.09.2026

Der Band „Weltweit getragen" zeigte `onefam-lifestyle-hero-v2.webp` — ein Paar mit
**Brasilien-Druck**. `/brazil/` ist pausiert und leitet mit 302 um. Der Shop warb also
oberhalb der Signature-Kollektion mit einem Produkt, das man nicht kaufen kann.

**Ein Ersatzbild gibt es nicht.** In `onefam-assets` liegt genau **ein** weiteres
Lifestyle-Foto — die Albanerin vor dem Cafe (`hf_20260201_173000…`) — und das traegt
bereits den `.story`-Abschnitt. Die uebrigen **20 Dateien dort sind freigestellte
Produktkarten auf Schwarz**, keine Lifestyle-Aufnahmen. In der Mediathek findet sich
unter „lifestyle", „street", „couple", „paar" **nichts**: diese Bilder liegen wie das
alte Hero-Video von Hand unter `onefam-assets/` und tauchen in keiner Mediensuche auf.

**Dazu kam, dass der Band nichts Eigenes beitrug.** Gemessen auf der Startseite:

| | |
|---|---|
| seine Aussage | „finde das Land, das sich wie Zuhause anfuehlt" — sagt der Hero bereits |
| sein Knopf | `/shop-by-country/` — **dorthin zeigten sechs Links derselben Seite** |
| sein einziger eigener Beitrag | das Bild — und das war das Problem |

**Deshalb entfernt statt ersetzt.** Das Markup liegt vollstaendig in
`docs/sicherung/snippet11-worn-band-entfernt-07092026.html`, **das CSS `.worn` steht
unangetastet in Snippet 11** — Zurueckholen ist Einfuegen, mehr nicht. Bedingung
dafuer: vorher ein Lifestyle-Bild eines **lebenden** Landes hinterlegen, sonst ist der
Fehler zurueck.

**Nachgemessen, ausgeloggt:**

| | vorher | nachher |
|---|---|---|
| Seitenhoehe | 6 065 px (7,4 Bildschirme) | **5 405 px (6,6)** |
| Brasilien-Bild auf der Seite | 1× | **0×** |
| Links auf `/shop-by-country/` | 6 | **5** |
| Luecke, wo der Band stand | – | **0 px**, Laenderreihe stoesst direkt an Signature |
| Hero und Kachelreihe | 525 / 525 | unveraendert |

Konsole leer. Snippet 11 nachher **2 485 423 Zeichen**.

**Zur Kommentar-Falle von heute Vormittag:** der eingesetzte Ersatzkommentar wurde
diesmal vor dem Speichern geprueft — Anfaenge und Enden im ganzen Snippet bleiben bei
**20/20**. Die erste Pruefung schlug faelschlich an, weil das Fenster bis in den
naechsten Abschnitt reichte; zu zaehlen ist der eingefuegte Kommentar selbst, nicht
seine Umgebung.

### Die zwei toten Adressen gab es nicht — dafuer eine echte — 07.09.2026

In dieser Datei stand: „`/white-logo/` und `/antigua-and-barbuda/` antworten 404 statt
umzuleiten." **Beides waren falsch notierte Slugs**, keine kaputten Seiten.

**Antigua & Barbuda.** Der Router fuehrt `antigua-barbuda`, ohne „and":

```
if ( in_array($key, ['antigua-barbuda', 'onefam-antigua-barbuda.html'], true) ) { … }
```

| Adresse | Antwort |
|---|---|
| `/antigua-barbuda/` | **302** → `/shop-by-country/` |
| `/onefam-antigua-barbuda.html` | **301** → `/antigua-barbuda/` |
| `/antigua-and-barbuda/` | 404 — **ein Slug, den es nie gab** |

**Damit sind es sieben pausierte Laender, nicht sechs.** Die Liste in Snippet 99
lautet: `anguilla, antigua-barbuda, bosnia, brazil, brunei, mexico, peru`.

**White Logo.** Auch `/white-logo/` ist nicht der Slug — die Seite im Router traegt
`data-of-cat="onefam-white-logo"`. Geroutet ist **keine** der beiden Schreibweisen,
und **die Produkte gibt es ebenfalls nicht** (`/produkt/onefam-white-logo-hoodie/` →
404). Die Kollektion ist bewusst „Bald verfuegbar"; die Kachel auf der Startseite
zeigt korrekt auf `/shop-by-country/#sig-logo-white`.

**Fuer Besucher war nie etwas kaputt:** keine der beiden Adressen ist verlinkt — nicht
auf der Startseite, nicht auf `/shop-by-country/`, nicht auf den Laenderseiten — und
keine steht in der Sitemap. Erreichbar nur durch Eintippen.

#### Der echte Fund: `/bosnia-and-herzegovina/` lief auf 404

Die Laenderliste im Router fuehrt den Slug **`bosnia-and-herzegovina`**, die Umleitung
in Snippet 99 kannte aber nur **`bosnia`**. `/bosnia/` leitete korrekt um,
`/bosnia-and-herzegovina/` lief auf 404. **Bosnien ist die einzige der sieben, bei der
Liste und Route auseinanderfielen.**

Heute schadete das nichts, weil der Listeneintrag kein `u` traegt und nichts dorthin
verlinkt. **Aber an dem Tag, an dem Bosnien live geht, baut alles, was Adressen aus
dieser Liste erzeugt, einen 404** — genau der Fall aus Regel 10 in CLAUDE.md.

**Behoben in Snippet 99** (1 229 → 1 569 Zeichen): die zweite Schreibweise steht jetzt
mit in der Liste, samt Begruendung als Kommentar. Bewusst *ergaenzt* statt den
Listeneintrag zu aendern, damit beide Schreibweisen weiter funktionieren.

**Nachgemessen, ausgeloggt:**

| | vorher | nachher |
|---|---|---|
| `/bosnia-and-herzegovina/` | **404** | **302** → `/shop-by-country/` |
| die uebrigen sechs pausierten | 302 | 302 (unveraendert) |
| die vier aktiven Laender | 200 | 200 (unveraendert) |
| `/australia/`, `/austria/`, `/algeria/` | 404 | 404 (unveraendert) |

**Regel daraus:** wenn eine Liste Slugs fuehrt und eine Route sie einloest, gehoeren
beide gegeneinander geprueft — nicht nur die Route allein. Die 242 uebrigen Laender
der Liste antworten korrekt mit 404, geprueft in Stichproben.

### Knopfkontrast behoben: 3,56 auf 4,95 — 07.09.2026

**Der Befund.** Alle Verlaufsknoepfe trugen dunklen Text `#0A0A0A` auf dem vollen
Markenverlauf. Gegen die einzelnen Stufen gemessen:

| Stufe | Farbe | Kontrast |
|---|---|---|
| 0 % | `#FAD649` Gelb | 13,93 ✓ |
| 28 % | `#EF8031` Orange | 7,36 ✓ |
| 55 % | `#EB356A` Pink | 4,95 ✓ |
| 78 % | `#C131BF` Magenta | **4,20 ✗** |
| 100 % | `#6B46F1` Violett | **3,56 ✗** |

Mindestwert ist 4,5:1. Das **letzte Drittel** jedes Knopfes war nicht normgerecht —
und das ist die Flaeche, auf der gekauft wird.

**Warum nicht einfach weisse Schrift.** Weiss gegen Violett waere 5,57 ✓, gegen Gelb
aber **1,6** — komplett unlesbar. **Ein Verlauf ueber diese ganze Bandbreite kann gar
keine Schrift tragen**, weder helle noch dunkle. Das ist der Kern des Problems und
der Grund, warum es keine Loesung ueber die Textfarbe gibt.

**Was gemacht wurde.** Eine **zweite** Variable nur fuer Knopfflaechen:

```
--of-grad:     linear-gradient(135deg,#FAD649 0%,#EF8031 28%,#EB356A 55%,#C131BF 78%,#6B46F1 100%)
--of-grad-cta: linear-gradient(135deg,#FAD649 0%,#EF8031 42%,#EB356A 100%)
```

Die helle Haelfte derselben Rampe, schlechtester Wert **4,95:1**. **Der Markenverlauf
`--of-grad` bleibt unangetastet** und gilt weiter fuer Gesichtsmarke und Pool-Zahl —
die Regel aus CLAUDE.md, dass es fuer den Verlauf eine einzige Quelle gibt, ist damit
nicht gebrochen, sondern um einen zweiten benannten Zweck ergaenzt.

**Das ist eine Marken-Entscheidung und in einer Zeile umkehrbar:** wer den vollen
Verlauf auf Knoepfen zurueckwill, setzt `--of-grad-cta` auf denselben Wert wie
`--of-grad` — und nimmt den Kontrastfehler wieder in Kauf.

**Geaendert in zwei Snippets:**

| Snippet | was | Stellen |
|---|---|---|
| **13** (WooCommerce Reskin) | Variable + Knopfregel | 1 + 1 |
| **11** (Router) | Variable + Knopfregel | 25 + 25 |
| **11** | `.waitform button` (Warteliste, Verlauf fest verdrahtet) | 1 |

**Der Wartelisten-Knopf war der versteckte vierte.** Er nutzt die Variable nicht,
sondern hatte den Verlauf ausgeschrieben — gefunden nur, weil die Zaehlung nicht
aufging: 26 Fundstellen von `#FAD649`, aber nur 25 Variablendefinitionen. **Wer
Farben im Shop aendert, sollte immer die Differenz zwischen Definitionen und
Vorkommen pruefen** — genau in dieser Luecke sitzen die fest verdrahteten Stellen.

**Nachgemessen, ausgeloggt, an allen vier Knopfarten:**

| Knopf | Seite | vorher | nachher |
|---|---|---|---|
| „Laender entdecken" | Startseite (Hero) | 3,56 | **4,95** |
| „Alle Laender ansehen" | Startseite (Lifestyle-Band) | 3,56 | **4,95** |
| „In den Warenkorb" | Produktseite | 3,56 | **4,95** |
| „Benachrichtige mich" | `/shop-by-country/` | 3,56 | **4,95** |

Snippet 11 nachher **2 485 087 Zeichen**, Snippet 13 **13 095**.

### Alte Hero-Dateien geprueft: 7828 und 7829 sind unbenutzt — 07.09.2026

Nach dem Hero-Umbau blieb offen, ob die abgeloesten Dateien noch irgendwo haengen.
An vier Stellen gesucht, nach `onefam-hero-2026.mp4`, `onefam-hero-poster.webp` und
dem noch aelteren `88fbdf03…`:

| geprueft | Umfang | Treffer 7828/7829 |
|---|---|---|
| Anhang-Zuordnung der Dateien | beide | **keine** (`post: null`) |
| Code-Snippets | **alle 95** | **keine** |
| Beitraege, Seiten, Produkte (veroeffentlicht) | 25 + 1 + 18 | **keine** |
| ausgelieferte Seiten, ausgeloggt | **90 Adressen** | **keine** |

**Ergebnis: 7828 (`onefam-hero-poster.webp`) und 7829 (`onefam-hero-2026.mp4`) waren
unbenutzt.** Sie haben genau einen Tag gelebt — angelegt am 06.09., abgeloest am 07.09.
**Am 07.09.2026 vom Inhaber geloescht**; danach nachgemessen: beide Kennungen liefern
404 ueber die REST-Schnittstelle und beide Dateien 404 am Server. Startseite in
Deutsch und Franzoesisch sowie `/albania/` unveraendert, Hero-Video spielt
(`readyState 4`, 560x560, kein Fehler), **kein einziger fehlgeschlagener Abruf und
kein kaputtes Bild**, Konsole leer.

**Das aeltere 6-MB-Video `88fbdf03…` ist etwas anderes und darf nicht mit weg** — es
ist unangetastet (07.09.2026 geprueft: **200, 6 261 774 B**). Achtung bei der Suche
danach: es liegt **nicht in der Mediathek**, sondern von Hand unter
`/wp-content/uploads/onefam-assets/`. Deshalb findet es die Medien-Suche ueber REST
nicht — die richtige Adresse steht im Markup von Snippet 103. Es
steht in **sechs inaktiven Snippets**: 9 (Home 1:1), 10 (Router alle Seiten), 16
(Asset-Migration), 88 und 98 (Router-Duplikate) sowie **103 (die Sicherung vom
06.09.)**. Wer 103 je zuruecksetzt, braucht diese Datei.

**Was die Pruefung nicht abdeckt:** Entwuerfe und private Inhalte (ohne REST-Nonce
nicht lesbar), Theme-Dateien, Divi-Theme-Optionen und Widget-Inhalte. Fuer die Frage
„liegt es auf der Live-Seite" ist das ohne Belang, fuer ein Loeschen sollte man es
wissen.

**Die Snippets 88, 98 und 103 antworten ueber REST mit leerem Rumpf** — dieselbe
2,4-MB-Grenze wie bei Snippet 11. Sie waren nur ueber `CODE_SNIPPETS_EDIT.snippet.code`
auf der jeweiligen Bearbeitungsseite lesbar. Wer kuenftig „alle Snippets" durchsucht,
muss diese drei plus die 11 gesondert holen, sonst hat er vier stille Luecken.

### Kachelreihe auf vier Spalten — 07.09.2026

Bei drei Spalten und vier Laendern stand die vierte Kachel allein in einer zweiten
Reihe. Jetzt:

| Fenster | Spalten | Kachel | Waise |
|---|---|---|---|
| 1440 px | **4** | 317 × 364 | nein |
| 1200 px | 4 | 273 × 314 | nein |
| 1024 px | **2** | 472 × 542 | nein |
| 900 px | 2 | 410 × 471 | nein |
| 390 px | 2 | 162 × 186 | nein |

**Warum unter 1100 px zwei und nicht drei.** Mit genau vier Kacheln geht eine Reihe
ohne Waise nur bei **4, 2 oder 1** Spalte auf. Drei Spalten braechten die Waise
zurueck; vier Spalten waeren bei 900 px nur noch gut 200 px breit, dann werden die
Gesichter zu klein. Deshalb: ueber 1100 px vier, darunter zwei.

**Wer ein fuenftes Land aufschaltet, muss hier neu rechnen** — bei fuenf Kacheln
faengt die Waise von vorne an. Der Hinweis steht auch als Kommentar im CSS.

Am Desktop steht die Reihe damit **in einer Zeile ab 541 px**, Unterkante 905 px bei
820 px Fensterhoehe — die Kacheln reichen also weiter ueber die Falz hinaus und laden
zum Weiterscrollen ein. Seitenhoehe 6 610 → **6 065 px**.

Snippet 11 nachher **2 473 611 Zeichen**.

### Kachelreihe gemischt: Mann und Hoodie rein — 07.09.2026

**Vorher vier Mal dasselbe:** Frau, schwarzes Shirt, frontal. Jetzt Frau/Mann im
Wechsel und drei Hoodies.

| Kachel | vorher | nachher |
|---|---|---|
| Albanien | Frau, Shirt schwarz | **Frau, Shirt weiss** (`OneFam_Albanien_Shirt_White_Frau_frontal_4k`) |
| Argentinien | Frau, Shirt | **Mann, Hoodie schwarz** (`OneFam_Argentinien_Hoodie_schwarz_Mann_frontal_4k`) |
| Afghanistan | Frau, Shirt schwarz | **Frau, Hoodie schwarz** (`OneFam_Afghanistan_Hoodie_schwarz_Frau_frontal_v3_4k`) |
| Andorra | Frau, Shirt schwarz | **Mann, Hoodie schwarz** (`OneFam_Andorra_Hoodie_schwarz_Mann_frontal_4k-1`) |

**Der eigentliche Grund ist nicht Abwechslung, sondern Lesbarkeit.** Beim Ansehen der
Kandidaten fiel auf: **der Hoodie traegt einen grossen Brustdruck, Shirt und Sweater
einen kleinen.** Auf einer Kachel von 427 px ist der kleine Druck auf schwarzem Stoff
kaum zu erkennen — die alte Reihe zeigte vier schwarze Oberteile, aber praktisch kein
Motiv. Am schwaechsten war `Albanien_Sweater_schwarz_Frau`: rot/schwarz auf Schwarz,
so gut wie unsichtbar.

**Albanien bleibt das Shirt, aber in Weiss** — damit ist das Einstiegsprodukt (40 CHF)
weiter in der Reihe, der Stoff wechselt, und rot/schwarz liest sich auf Weiss.
**Afghanistan darf nicht auf Weiss**: dessen Motiv hat weisse Teile und wuerde
verschwinden — die Regel aus CLAUDE.md, hier praktisch geworden.

Vier verschiedene Gesichter, Geschlechter wechseln sich ab (F, M, F, M) — am Desktop
in der Dreierreihe F, M, F, am Handy zeilenweise.

**Geprueft:** alle vier Bilder liefern 200 (25–34 kB), alle vier Laenderseiten liefern
200. Snippet 11 nachher **2 472 951 Zeichen**.

**Falle, in die ich gelaufen bin und die wiederkommen kann:** beim Ergaenzen des
Kommentars ueber der Kachelreihe kam ein zweites `-->` in die Mitte des bestehenden
Kommentars. Der Kommentar brach dort auf, und der Rest stand als **sichtbarer Text auf
der Startseite**. Aufgefallen ist es nur im Bildschirmfoto — in den Kennzahlen nicht.
**Wer einen HTML-Kommentar erweitert: zaehlen, wie viele `-->` danach im Block stehen.
Es darf genau eines sein.**

### Hero umgebaut: Marke aus dem Weg, Ware in den ersten Bildschirm — 07.09.2026

**Der Befund, den die Zahlen vom 06.09. nicht hergaben.** Die Ueberschrift stand *im
Gesicht der Marke*. Ursache gemessen: das Hero-Video war ein 16:9-Rahmen, in dem die
Marke nur **x 37,1–61,7 %** und **y 23,0–76,3 %** einnimmt — ueber alle 17,5 Sekunden
unveraendert, sie bewegt sich nicht, nur die Farbe wechselt. `object-fit:cover`
skaliert so einen Rahmen auf die Breite; die Marke wird dadurch riesig, und mittig
gesetzter Text landet zwangslaeufig darin. **Das war kein Textproblem, sondern ein
Zuschnitt-Problem** — die Verkleinerung der Ueberschrift am 06.09. hat es gelindert,
nicht behoben.

**Neue Dateien.** Video mit ffmpeg auf die Marke zugeschnitten (`crop=820:820:538:126`
aus dem Original), dann auf 560×560 skaliert, CRF 30:

| | vorher | nachher |
|---|---|---|
| Video | `onefam-hero-2026.mp4`, 1920×1080, **217 388 B** | `hero-mark.mp4` (**Mediathek 7830**), 560×560, **109 513 B** |
| Vorschaubild | `onefam-hero-poster.webp` (7828), 1280×720, 10 468 B | `hero-mark-poster.webp` (**7831**), 560×560, **9 900 B** |
| Summe | 227 856 B | **119 413 B (−48 %)** |

Das Vorschaubild wurde als PNG hochgeladen und von **Snippet 35 automatisch nach WebP
gewandelt** (78 268 → 9 900 B). **Die alten Dateien 7828/7829 liegen weiter in der
Mediathek** — nicht geloescht, weil unklar ist, ob sie anderswo verwendet werden.

**Geaendert in Snippet 11** (dem Router; die Startseiten-CSS steht dort im selben
Snippet), drei Eingriffe:

1. **Hero-CSS neu.** `height:calc(100vh - 122px)` → `clamp(430px,64vh,580px)`.
   `.hero .in` ist jetzt eine zentrierte Spalte mit `gap`; das Video sitzt in
   `.hero .markbox` (Quadrat, `clamp(160px,25vh,225px)`) **im Textfluss** ueber der
   Ueberschrift. Hintergrund `#2c2620` → `#000`, weil das Video schwarz ist
   (Randfarbe gemessen: `rgb(1,1,1)`).
2. **`<div class="ov"></div>` entfernt** — der Verlaufsschleier war auf Schwarz
   wirkungslos.
3. **`<!-- CATEGORY COLLAGE -->` direkt hinter den Hero gezogen.** Reihenfolge danach:
   Hero → Kacheln → Tagband → Laenderreihe → „Weltweit getragen" → Signature.
   **Achtung, das galt nur wenige Stunden:** noch am 07.09.2026 sind „Weltweit
   getragen" und die Laenderreihe entfallen. Die heutige Reihenfolge steht unter
   „Wo die Startseite jetzt steht".

**Warum die Kacheln und nicht das Lifestyle-Bild.** Beides wurde gebaut und
angesehen. Das Lifestyle-Band waere die naheliegende Wahl gewesen — es heisst sogar
`onefam-lifestyle-hero-v2.webp`. Dagegen sprach dreierlei, alles im Bild sichtbar:
der Kopf des Mannes wird oben abgeschnitten, die Ueberschrift „Weltweit getragen"
liegt genau auf den Kleidungsstuecken, und der Knopf rutscht unter die Falz. Dazu
der harte Grund: **der Druck ist Brasilien, und `/brazil/` antwortet mit 302** — der
erste Eindruck waere ein Produkt, das es nicht zu kaufen gibt. Die Kacheln zeigen
vier Laender, vier lesbare Drucke auf schwarzem Stoff, und jede Kachel ist ein
lebender Link.

**Nachgemessen, ausgeloggt, ohne Cache-Umgehung** (Referenzfenster 1440 × 685 wie bei
den fuenf Referenzshops, Handy 390 × 844):

| | vorher | nachher |
|---|---|---|
| Hero-Hoehe 1440×685 | 563 px | **438 px** |
| Hero-Hoehe 390×844 | 722 px (85 % des Bildschirms) | **540 px (64 %)** |
| erstes Kleidungsstueck, Desktop | 920 px = 1,34 Bildschirme | **438 px = 0,64** |
| erstes Kleidungsstueck, Handy | 1519 px = 1,80 Bildschirme | **540 px = 0,64** |
| davon ueber der Falz sichtbar | 0 px | **247 px** (Desktop) |
| Seitenhoehe | 6 787 px | 6 610 px |

**In allen vier Sprachen geprueft**, 1440 × 685 und 390 × 844: Ueberschrift ueberall
**drei Zeilen, 32 px am Desktop, 24 px am Handy, kein Ueberlauf**. Laengster Text ist
weiter der franzoesische („Pour celles et ceux qui appartiennent à plus d'un
endroit"). Laenderseite (`/albania/`) unveraendert, keine Fehler in der Konsole.

**Snippet 11 vorher 2 470 661 Zeichen, nachher 2 472 428** — nach dem Neuladen
nachgeprueft, Wert stimmt. Der REST-Aufruf antwortete wie erwartet mit **200 und
leerem Rumpf**; das sagt weiterhin nichts aus, die Pruefung war das Nachladen.

**Sicherung der geaenderten Stellen:** `docs/sicherung/snippet11-hero-css-vor-07092026.css`
und `docs/sicherung/snippet11-hero-markup-vor-07092026.html`. Vollsicherung des
Routers vom 06.09. liegt weiter als **Snippet 103**.

**Nebenbefund, der eine alte Notiz korrigiert:** die 2,4 MB von Snippet 11 kommen
nicht von der Startseite. Der Dark-Theme-Block (`/* hero */ .hero h1{color:#EDE7D6…`)
steht **25 Mal** im Snippet — einmal je Router-Seite. Die eigentliche Startseiten-CSS
und das Startseiten-Markup gibt es **je genau einmal**.


### Shop-Design unter der Lupe — 06.09.2026

#### Hero: Vorschaubild gesetzt, Video von 6,0 MB auf 0,21 MB — 06.09.2026

**Das Problem, in drei Teilen:**

1. Kein `poster` — bis das Video Daten hatte, zeigte der Hero nur die
   Hintergrundfarbe `#2C2620`. Wer Autoplay aus hat (iOS-Stromsparmodus,
   Datensparmodus), sah **nie** ein Bild.
2. Das Video wog **6,0 MB** (1920×1080, 22 s, 2,27 Mbit/s).
3. Es beginnt und endet mit einer **Schwarzblende** — bei jedem Schleifendurchlauf
   blitzte der Hero also schwarz.

**Was gemacht wurde.** Das Video zeigt die Gesichtsmarke in wechselnden Farben auf
Schwarz — gemessen ueber die ganze Laufzeit liegt die mittlere Helligkeit zwischen
**0 und 6,8 von 255**, es ist also von Haus aus sehr dunkel.

- **Schnitt auf 2,0–19,5 s.** Die Farben an diesen beiden Punkten sind fast identisch
  (rgb(45,27,23) gegen rgb(46,29,24)), der Schleifensprung faellt daher nicht auf —
  und die Schwarzblenden sind weg.
- **Neu kodiert:** gleiche Aufloesung 1920×1080, CRF 30. **6,0 MB → 0,21 MB, 97 %
  kleiner**, Qualitaet nachgemessen mit SSIM **0,993** (visuell kein Unterschied).
- **Vorschaubild** aus Sekunde 9 (helles cremefarbenes Logo), 1280 px breit. Beim
  Hochladen hat Snippet 35 es automatisch in WebP gewandelt: **10,2 kB**.
- Im Router: `poster="…"` und `preload="metadata"` ergaenzt, Quelle getauscht.

| | vorher | nachher |
|---|---|---|
| Video | 6,0 MB | **0,21 MB** |
| Vorschaubild | – | **0,010 MB** |
| Summe | 6,0 MB | **0,22 MB (96 % weniger)** |

**Neue Dateien:** `onefam-hero-poster.webp` (ID 7828),
`onefam-hero-2026.mp4` (ID 7829), beide unter `/wp-content/uploads/2026/09/`.
**Das alte Video liegt noch in der Mediathek** — nicht geloescht, weil unklar ist, ob
es anderswo verwendet wird.

**Geprueft:** `poster` und neue Quelle auf allen vier Startseiten im HTML; im Browser
zeigt der Hero jetzt das Vorschaubild, auch wenn das Video nicht laedt (`readyState 0`)
— genau der Fall, den Besucher ohne Autoplay sehen.

**Ueberschrift von 64 px auf 32 px — 06.09.2026, Entscheid des Inhabers.**
Die Regel steht **einmal** in Snippet 11:
`.hero h1{...font-size:clamp(30px,5vw,64px)...}` → `clamp(24px,2.6vw,32px)`.

| Fenster | vorher | nachher |
|---|---|---|
| 375 px | 30 px | 24 px |
| 768 px | 38 px | 24 px |
| 1024 px | 51 px | 27 px |
| ab 1230 px | 64 px | **32 px** |

`max-width:17ch` blieb unveraendert — die Zeilenlaenge haengt an der Schriftgroesse,
der Umbruch bleibt daher bei **drei Zeilen**, nur alles wird kleiner.

**Geprueft in allen vier Sprachen, bei 1440 px und 390 px Fensterbreite:** ueberall
drei Zeilen, **kein Ueberlauf**, 32 px am Desktop, 24 px am Handy. Der laengste Text
ist der franzoesische („Pour celles et ceux qui appartiennent à plus d'un endroit") —
auch dort drei Zeilen. Die Gesichtsmarke im Hintergrund ist jetzt sichtbar, statt vom
Text verdeckt zu werden.

**Offen bleibt der inhaltliche Punkt:** der Hero zeigt die Marke, kein Kleidungsstueck.
Alle fuenf Referenzshops zeigen an dieser Stelle Ware oder Menschen
(→ `REFERENZ-shopdesign.md`).


#### Referenzshops vermessen — 06.09.2026 → `REFERENZ-shopdesign.md`

Fuenf Shops mit demselben Skript und demselben Fenster (1440 × 685) vermessen, danach
OneFam mit genau demselben: **Colorful Standard, Asket, Everlane, Aimé Leon Dore,
Carhartt WIP**. Kein fremder Code uebernommen — nur Masse und Verhaeltnisse.

**Zwei Werte trennen OneFam von allen fuenf:**

| | Referenzen | OneFam |
|---|---|---|
| Ueberschrift der Startseite | 13,5 – 32 px | **64 px** |
| erstes Bild ab | 0 – 279 px (4 von 5 unter 106 px) | **Video ohne Vorschaubild** |

Seitenhoehe ist **kein** Kriterium: die Referenzen reichen von 2,1 bis 10,4
Bildschirmen, OneFam liegt mit 9,8 mittendrin. Auch die **Produktseite ist in
Ordnung** — 9 Bilder im Format 4:5 gegen 10 Bilder im Format 4:5 bei Colorful
Standard, H1 30 gegen 22 px.

#### ⚠️ Korrektur: der Hero hat sehr wohl ein Bild — ein Video ohne `poster`

Weiter unten in dieser Datei steht „Hero der Startseite: 597 px hoch, Hintergrund
`#2C2620`, **kein Bild**". **Das ist falsch.** Der Hero enthaelt ein
`<video autoplay muted loop playsinline>`:

| | |
|---|---|
| Datei | `88fbdf03…HD-1080p-2.5Mbps-88218841.mp4` |
| Groesse | **6,0 MB** |
| `poster` | **fehlt** — im ganzen HTML kein einziges `poster=` |

Ohne Vorschaubild zeigt der Hero bis zum Laden nur die Hintergrundfarbe, darueber die
64-px-Ueberschrift. Bei 6 MB dauert das mobil mehrere Sekunden — und wer Autoplay aus
hat (iOS-Stromsparmodus, Datensparmodus), sieht **nie** ein Bild. Die erste Messung
hat das Video uebersehen, weil sie nur `background-image` und `<img>` geprueft hat.

**Naechste Schritte in der Reihenfolge ihrer Wirkung:** `poster` setzen (kleinster
Eingriff, groesste Wirkung), Ueberschrift verkleinern, Video verkleinern. Produktseite,
Bildformat und Seitenlaenge **nicht** anfassen.


#### Fusszeile der Shop-Seiten war fest deutsch — behoben 06.09.2026

**Befund:** Kopf- und Fusszeile der WooCommerce-Seiten kommen aus Snippet 26 und
liegen dort als base64-Bloecke mit **fest deutschen Texten**. Auf den Router-Seiten
uebersetzt eine Tabelle im Browser; auf den Shop-Seiten gibt es die nicht — auf
`/de/produkt/albania-hoodie/` mit Cookie `ofl=fr`, `es` oder `en` blieb die Fusszeile
jedes Mal deutsch. Ein Franzose las dort „Hauptmenue / Schnelllinks / Rueckgabe / AGB".

**Behoben** mit einer neuen Funktion `of_shell_uebersetzen()` in Snippet 26: sie
uebersetzt den Fusszeilen-Block per `strtr` in die Sprache aus `of_visitor_lang()`.
Deutsch ist die Vorlage und bleibt unberuehrt. **Die Wortwahl ist absichtlich aus der
Uebersetzungstabelle in Snippet 11 uebernommen**, damit Router- und Shop-Seiten
dieselben Begriffe benutzen — wer sie an einer Stelle aendert, muss die andere
mitziehen.

Geprueft ueber die vier Sprachadressen: *Hauptmenue · Menu principal · Menú principal ·
Main Menu*, samt allen Links (Confidentialité / Remboursements / Livraison /
Conditions générales usw.).

**Am selben Tag nachgezogen: Kopfzeile und mobiles Menue.** `of_shell_uebersetzen()`
laeuft jetzt ueber **vier** base64-Bloecke statt einem — Kopfzeile (0), Fusszeile (1),
mobiles Menue (2) und den Icon-Block (5). Die Wortliste wurde um `Suche`, `Konto`,
`Warenkorb` und `Menu` erweitert; diese vier standen **nicht** in der Tabelle von
Snippet 11, weil sie dort nur als `aria-label` vorkommen — die Uebersetzungen sind
also neu gesetzt (Search/Account/Cart, Recherche/Compte/Panier, Buscar/Cuenta/Carrito).

Zwei Dinge, auf die dabei zu achten war: die Menuelisten im JS-Block stehen in
`'...'`-Zeichenketten (`[['/','Startseite'],...]`), eine Uebersetzung mit Apostroph
wuerde sie zerbrechen — keine der eingetragenen hat einen. Und vor der Ersetzung
wurde geprueft, dass `Suche`, `Konto`, `Warenkorb` und `Menu` in den JS-Bloecken
**nirgends als Bezeichner** vorkommen, sondern nur als Text.

Geprueft:

| Adresse | Kopfzeile (`aria-label`) | mobiles Menue, erster Eintrag |
|---|---|---|
| `/de/produkt/…` | Konto · Menu · Suche · Warenkorb | Startseite |
| `/fr/produkt/…` | Compte · Menu · Panier · Recherche | Accueil |
| `/es/produkt/…` | Buscar · Carrito · Cuenta · Menú | Inicio |
| `/produkt/…` (en) | Account · Cart · Menu · Search | Home |

Acht Seitentypen danach: alle 200, unveraenderte Groesse.

**Auch die Router-Kopfzeile nachgezogen — 06.09.2026.** Dort waren die `aria-label`
ebenfalls fest deutsch (`Land suchen`, `Mein Konto`, `Warenkorb`, `Menu`, je 25×), in
allen vier Sprachen. Betrifft nur Screenreader, ist also unsichtbar, war aber
derselbe Fehler.

**Gelöst ueber den vorhandenen Mechanismus statt mit einem zweiten.** Snippet 11
uebersetzt im Browser Textknoten (`tx`) und `placeholder` (`ph`) gegen die Tabelle
`OF_I18N` — fuer Attribute wie `aria-label` gab es nichts. Neu:

1. Die vier Labels im HTML auf **englische Schluessel** umgestellt
   (`Search countries`, `My account`, `Cart`, `Menu`) — so wie jeder andere Text im
   Router auch, damit die Tabelle greift. 75 Ersetzungen.
2. Vier Eintraege in `OF_I18N` ergaenzt.
3. Eine Funktion `al(l)` nach dem Vorbild von `ph(l)` eingesetzt (25×) und in
   `apply()` aufgerufen: `tx(l);ph(l);al(l);links(l);`. Sie merkt sich den
   Ausgangswert in `data-al`, damit ein Sprachwechsel ohne Neuladen nicht auf einem
   bereits uebersetzten Wert aufsetzt — genau wie `ph()` es mit `data-ph` macht.

Gemessen im Browser (die Uebersetzung passiert dort, im Quelltext steht Englisch):

| Adresse | aria-label |
|---|---|
| `/de/albania/` | Land suchen · Mein Konto · Menü · Warenkorb |
| `/fr/albania/` | Rechercher un pays · Mon compte · Menu · Panier |
| `/es/albania/` | Buscar país · Mi cuenta · Menú · Carrito |
| `?lang=en` | Search countries · My account · Menu · Cart |

40 Router-Seiten geprueft: alle 200, alle mit englischem Schluessel im Quelltext,
kein deutscher Rest, `al()` ueberall vorhanden.

#### Cookie-Banner: Sprache hinkte hinterher — behoben 06.09.2026

Mit `?lang=en` stand die Ueberschrift des Banners noch auf „Respetamos tu privacidad",
mit `?lang=fr` auf „We respect your privacy" — jeweils die Sprache des **vorherigen**
Aufrufs.

**Ursache:** Snippet 37 liefert das Banner als base64-kodiertes Skript ueber
`/wp-json/onefam/v1/consent`. Darin stand:

```js
var L=(function(){ var m=document.cookie.match(/(?:^|; )ofl=([a-z]{2})/); if(m) return m[1];
                   return (document.documentElement.lang||"en").slice(0,2); })();
```

Das **Cookie zuerst** — waehrend `cur()` in Snippet 11 die Adresse (`?lang=`) zuerst
liest. Bei einem Sprachwechsel steht im Cookie noch die alte Sprache, weil `apply()`
sie erst danach schreibt. Reihenfolge auf `?lang=` → Cookie → `documentElement.lang`
angeglichen, mit Pruefung gegen die vier erlaubten Sprachen.

**Nachgemessen, alle vier Sprachen:**

| | Ueberschrift | Knopf |
|---|---|---|
| `?lang=de` | Wir respektieren deine Privatsphäre | Alle akzeptieren |
| `?lang=en` | We respect your privacy | – |
| `?lang=fr` | Nous respectons votre vie privée | – |
| `?lang=es` | Respetamos tu privacidad | Aceptar todo |

⚠️ **Die Falle dabei: `/wp-json/onefam/v1/consent` wird mit
`cache-control: public, max-age=86400` ausgeliefert.** Nach dem Schreiben zeigte der
Testbrowser weiter die alte Fassung — erst ein erzwungener Neuabruf
(`fetch(..., {cache:'reload'})`) brachte die neue. **Wer das Banner-Skript aendert,
muss damit rechnen, dass wiederkehrende Besucher bis zu 24 Stunden die alte Fassung
sehen.** Eine Versionsnummer in der Adresse (`?v=…`) waere hier die saubere Loesung —
noch nicht gebaut.

**Neubeschriftung bei Sprachwechsel: eingebaut, gemessen, wieder zurueckgebaut.**

Eingebaut war eine Neubelegung von `L`, `t`, `PRIV` und `IMP` bei einer Aenderung von
`documentElement.lang`, ausgeloest ueber einen `MutationObserver`.

⚠️ **Beim Nachmessen zeigte sich, dass es den Fall nicht gibt.** Der Sprachumschalter
wechselt die **Adresse**: Snippet 53 („OneFam Sprachumschalter wechselt die Adresse")
ruft `location.assign(ziel(l))`. Die Seite laedt neu, das Banner wird ohnehin in der
neuen Sprache aufgebaut. Nachgemessen: nach `OF_setLang('fr')` zaehlt ein Beobachter
**genau eine** Aenderung am `lang`-Attribut, danach steht es wieder auf `de` — die
Navigation uebernimmt. Ein dauerhafter Sprachwechsel ohne Neuladen existiert im Shop
nicht.

Der urspruengliche Befund („Banner hinkt eine Sprache hinterher") stammte aus
`?lang=`-Aufrufen, die zum Testen selbst gebaut worden waren. **Die
Reihenfolge-Korrektur oben bleibt richtig und wirksam** — `links()` in Snippet 11
haengt `?lang=` an interne Verweise, solche Adressen kommen real vor.

**Am 06.09.2026 auf Entscheid des Inhabers wieder zurueckgebaut.** Ungenutzter Code in
einem Einwilligungselement ist Risiko ohne Nutzen. Der Rueckbau wurde als exakte
Umkehrung der vier Einzelaenderungen gemacht, nicht als Block geschnitten; das
Consent-Skript ist danach wieder **10'284 Zeichen** lang — Zeichen fuer Zeichen der
Stand vor dem Einbau. Keine Reste von `ofSprache`, `ofAnsicht`, `ofNeuBeschriften`
oder `MutationObserver`, Syntax geprueft, `?lang=`-Korrektur erhalten.

**Funktionstest des Banners nach dem Rueckbau:** oeffnet auf `/de/albania/` mit
„Wir respektieren deine Privatsphäre", auf `/albania/?lang=fr` mit „Nous respectons
votre vie privée"; ein Klick auf „Nur notwendige" schreibt
`{"necessary":true,"stats":false,"marketing":false,"v":"1"}`. Zuvor mit dem
eingebauten Stand ebenso geprueft, inklusive Einstellungen, Haken und Speichern.
Die Einwilligungslogik war zu keinem Zeitpunkt veraendert.

#### Sprach-Cookie ueberstimmte die Adresse — behoben 06.09.2026

**Die Ursache war eine einzige Zeile Reihenfolge.** Snippet 69 („Produktseite:
Groessentabelle und Details als Kacheln") las **zuerst das Cookie `ofl`** und erst
danach `of_visitor_lang()`. Alle anderen Snippets machen es umgekehrt — 57
(Produktnamen), 61 (Groessentabellen), 62 (Produktdetails) nehmen direkt
`of_visitor_lang()`.

Dadurch zerfiel die Seite in zwei Sprachen. Gemessen vorher:

| Adresse | Cookie | Fusszeile (`of_visitor_lang`) | Kacheltitel (Cookie) |
|---|---|---|---|
| `/de/produkt/…` | `es` | Hauptmenü | **¿Me quedará bien?** |
| `/fr/produkt/…` | `de` | Menu principal | **Passt mir das?** |
| `/es/produkt/…` | `de` | Menú principal | **Passt mir das?** |

In Snippet 69 die Reihenfolge umgedreht: `of_visitor_lang()` zuerst, das Cookie nur
noch als Rueckfall. **`of_visitor_lang()` beruecksichtigt das Praefix der Adresse** —
steht dort `/de/`, gewinnt Deutsch.

**Nachher, mit absichtlich gegenlaeufigem Cookie `ofl=es` gemessen:**

| Adresse | Produktname | Lieferzeit | Fusszeile | Kacheltitel | Farbe/Grösse |
|---|---|---|---|---|---|
| `/de/produkt/…` | Albanien Hoodie | deutsch | Hauptmenü | Passt mir das? | Farbe / Grösse |
| `/fr/produkt/…` | Albanie Hoodie | franzoesisch | Menu principal | Est-ce que ça me va ? | Couleur / Taille |
| `/es/produkt/…` | Albania Hoodie | spanisch | Menú principal | ¿Me quedará bien? | Color / Talla |
| `/produkt/…` (ohne Praefix) | Albania Hoodie | spanisch | Menú principal | ¿Me quedará bien? | Color / Talla |

**Jede Seite ist in sich einsprachig.** Ohne Sprachpraefix entscheidet weiterhin der
Besucher (Cookie, Browser, Land) — das ist die vorgesehene Mechanik, kein Rest des
Fehlers.


#### Google Fonts ganz abgeschaltet, Kaufknopf, Galerie — 06.09.2026

**Open Sans / Divi.** Die letzte Fremdschrift kam nicht aus einem Snippet, sondern aus
dem Theme: Divi laedt Open Sans von Google. Abgeschaltet ueber **Divi →
Theme-Optionen → Allgemein → „Google Fonts Verwenden"** (Feld
`et_use_google_fonts`, Schalter aus, gespeichert). Nach dem Neuladen geprueft: der
Schalter bleibt aus.

**Ergebnis, ausgeloggt ueber zehn Seitentypen:** `fonts.googleapis.com` **0** auf
allen, Fontshare (Cabinet Grotesk + Satoshi) auf allen vorhanden, alle Seiten 200.
Damit geht **keine Besucher-IP mehr an Google** — das ist neben der Optik auch ein
Datenschutzpunkt.

Auf der Produktseite steht `Open Sans` noch als `font-family` im Divi-Grundstil, die
Schrift wird aber nicht mehr geladen. **Sichtbarer Text nutzt jetzt ausschliesslich
Cabinet Grotesk (12 Elemente) und Satoshi (108).** Die restlichen Treffer sitzen auf
unsichtbaren Elementen — nachgemessen, nicht angenommen.

⚠️ **Beim Speichern der Divi-Optionen ging meine Sicherung der 144 Felder verloren**
(window-Variable, die den Seitenwechsel nicht ueberlebt). Ich kann daher **nicht
belegen**, dass beim Speichern kein anderes Feld mitverstellt wurde. Alle zehn
Seitentypen antworten unveraendert mit 200 und normaler Groesse; wer ganz sicher gehen
will, sieht die Theme-Optionen einmal durch.

#### Kaufknopf: zwei eigene Fehlmessungen, ein echter Punkt

**Was ich zuerst gemeldet hatte und was davon stimmt:**

- „`opacity: 0.45` beim Ankommen" — **stimmt**, das ist der deaktivierte Zustand vor
  der Variantenwahl. Die Regel steht in Snippet 13:
  `.woocommerce .single_add_to_cart_button.disabled{opacity:.45!important;}`
- „Der Knopf bleibt auch nach der Variantenwahl blass" — **falsch.** Diese
  „Korrektur" war selbst ein Messfehler.

⚠️ **Die Ursache ist eine Falle, die jede kuenftige Messung betrifft: im versteckten
Chrome-Tab friert die Renderpipeline ein.** `getComputedStyle` liefert dann den
eingefrorenen Zwischenwert einer laufenden CSS-Transition statt des Zielwerts. Der
Beleg: `button.getAnimations()[0].effect.getKeyframes()` gibt im aktiven Zustand
`['0.45','1']` (Ziel 1, Dauer 250 ms), im deaktivierten `['1','0.45']`. **Wer eine
`opacity`, eine Groesse oder eine Position misst, muss den Zielwert aus den Keyframes
lesen oder in einem sichtbaren Fenster messen** — sonst misst man Zwischenbilder.
Dasselbe erklaert die schwarzen Screenshots im Browser-Pane zu Beginn der Sitzung und
warum programmatisches Scrollen dort nicht wirkte.

**Der Knopf verhaelt sich also richtig:** deaktiviert 0.45, nach der Wahl 1, und ein
Klick ohne Auswahl zeigt bereits einen Hinweis (`C.txt.wahl` in Snippet 13).

**Tatsaechlich geaendert:** Schriftgroesse **13 px → 15 px**, Polsterung 15 → 16 px.
13 px war fuer den wichtigsten Knopf der Seite zu klein. Kontrast des Textes gegen den
Verlauf im Bereich, den der Text ueberdeckt: **4,2 bis 7,4:1** — ausreichend; nur die
aeusseren Enden des Verlaufs liegen darunter (3,56:1 am violetten Ende), dort steht
aber kein Text.

#### Galerie: in Ordnung, mein Befund war eine Fehlzaehlung

„18 Bilder als Kachelwand" war **Hauptbilder plus Vorschaubilder zusammengezaehlt**.
Sauber getrennt gemessen:

| | Hauptbilder | Vorschaubilder |
|---|---|---|
| beim Laden | 9 | 9 |
| nach Farbwahl „Black" | 7 | 7 |

Keine Dublette, alle sichtbar. Snippet 92 „Galerie nach Farbe filtern" zeigt beim
Laden je Farbe ein Freihaengend-Bild (9 Farben) und schaltet bei der Farbwahl auf die
sieben Ansichten dieser Farbe um. **Das ist vernuenftig — hier ist nichts zu kuerzen.**

Offen bleibt eine Beobachtung vom Anfang der Sitzung: im allerersten Screenshot war
kurz eine Kachelwand aller Bilder zu sehen, bevor der Filter griff (er laeuft auf
`window.load` plus Verzoegerung). **Wie lange das dauert, konnte ich nicht verlaesslich
messen** — im versteckten Tab feuert `load` im eingebetteten Rahmen nicht zuverlaessig.
Das gehoert in einem sichtbaren Fenster nachgemessen.


#### Fremdschriften raus: Trirong, Quattrocento Sans und Inter — 06.09.2026

**Befund vorher:** Der Shop lud **zwei** Fremdschriften von Google Fonts und benutzte
sie ueberall dort, wo Cabinet Grotesk und Satoshi stehen muessten. Auf der
Produktseite waren acht Schriftfamilien im Einsatz. Trirong (eine Serifenschrift) trug
die Kartenueberschriften, die Laendernamen und die Fusszeilen-Ueberschriften — das war
der Hauptgrund, warum die Fusszeile nach Standard-Theme aussah.

**Ersetzt** — Trirong → Cabinet Grotesk, Quattrocento Sans → Satoshi, Inter → Satoshi:

| Snippet | was | Anzahl |
|---|---|---|
| 11 Router | `font-family:'Trirong',serif` | **140** |
| 11 Router | `font-family:'Cabinet Grotesk','Trirong',serif` | 2 |
| 11 Router | `font-family:'Quattrocento Sans',sans-serif` | **66** |
| 11 Router | `font-family:'Satoshi','Quattrocento Sans',sans-serif!important` | 25 |
| 11 Router | Google-Fonts-`<link>` (googleapis + gstatic) | **75** |
| 11 Router | `.mnu .x` (Schliessen-Knopf stand auf Arial) | 25 |
| 26 Kopf-/Fusszeile | im base64-Block: Trirong 5, Quattrocento 4 | 9 |
| 13 Reskin | `'Inter'` 2, Quattrocento 1 | 3 |
| 67 Ruecklink | Quattrocento-Rueckfall | 1 |
| 90 Warenkorb-Hinweis | Quattrocento-Rueckfall | 1 |

⚠️ **Die Falle, die dabei Zeit gekostet hat: in Snippet 26 steckt das CSS
base64-kodiert.** `echo '<style id="of-shell-css">' . base64_decode('Lm9mc2h7...')` —
elf solcher Bloecke. Eine Textsuche nach „Trirong" in diesem Snippet meldet **0
Treffer**, obwohl die Live-Seite die Schrift fuenfmal benutzt. Ich habe daraus zuerst
geschlossen, das CSS komme von woanders, und die falsche Quelle gesucht. **Wer in
Snippet 26 etwas sucht, muss die base64-Bloecke vorher dekodieren.** Zum Aendern:
dekodieren (`atob`, UTF-8-sicher ueber `decodeURIComponent(escape(...))`), ersetzen,
mit `btoa(unescape(encodeURIComponent(...)))` zurueckkodieren und die alte
Zeichenkette im Code austauschen. Vorher pruefen, ob der Hin- und Rueckweg die
gleiche Zeichenkette ergibt — bei Block 3 war das der Fall.

**Endstand, ausgeloggt ueber zehn Seitentypen gemessen:** Trirong **0**, Quattrocento
**0**, Inter **0**. Fontshare (Cabinet Grotesk + Satoshi) auf allen Seiten vorhanden.
Auf den Router-Seiten sind jetzt nur noch **Cabinet Grotesk und Satoshi** im Einsatz.

Auf der Produktseite bleiben Treffer stehen, die aber **kein Besucher sieht** —
nachgemessen: der `a.logo` mit Schriftgroesse **0 px** und transparenter Farbe (die
Wortmarke ist ein Hintergrundbild, der Text nur fuer Screenreader), die
`<option>`-Eintraege der ausgeblendeten Auswahllisten (10 px hoch, unsichtbar, weil
Snippet 23 Farbkreise darueberlegt) und der abgeschaltete Waehrungsumschalter.

**Offen: Divi laedt Open Sans von Google.** Auf Produktseite, Warenkorb und Mein Konto
haengt noch `et-divi-open-sans-css` → `fonts.googleapis.com`. Das ist eine
Theme-Einstellung, kein Snippet (Divi → Theme-Optionen → Google Fonts abschalten).
Zwei Gruende, es abzuschalten: es ist die letzte Fremdschrift, und Google Fonts
uebertraegt bei jedem Aufruf die IP des Besuchers.

#### Menuelinks tragen jetzt das Sprachpraefix — 06.09.2026

Der Schoenheitsfehler aus `shop-fusslinks.md`, jetzt fuer das Hauptmenue behoben. Die
Links zeigten auf `/shop-by-country/` statt `/fr/shop-by-country/`; die Seite blieb in
der richtigen Sprache (die kommt aus dem Cookie), aber eine geteilte Adresse verlor
sie. Im Menue-Block wird das Praefix jetzt aus `location.pathname` abgeleitet;
Englisch hat keins und bekommt bewusst keins.

Geprueft in allen vier Sprachen: `/de/…`, `/fr/…`, `/es/…` und praefixlos fuer
Englisch. Ein Klick von einer Laenderseite auf „Signature" landet auf
`/de/shop-by-country/#signature`, springt an die Marke und behaelt die Sprache.


#### Menue: Signature und Nach Land als zwei Wege — 06.09.2026

**Warum:** Das Hauptmenue hatte vier Eintraege — Startseite, Nach Land shoppen,
Ueber uns, Kontakt — und **keinen fuer Signature**. Die einzige Kollektion, die
jeder kaufen kann, egal woher er kommt, lag damit hinter einem Menuepunkt, der
Laender verspricht. Wer kein zweites Land hat, klickt da nie hin.

**Geaendert in Snippet 11**, im gemeinsamen Menue-Block. Vier Eingriffe:

1. **`items` erweitert** — `Signature` → `/shop-by-country/#signature`,
   `Shop by Country` → `/shop-by-country/#laender`. Signature steht vor den
   Laendern. **25 Vorkommen**, alle identisch, eine Ersetzung.
   „Signature" bleibt in allen vier Sprachen gleich (Markenwort), fuer die anderen
   Eintraege greift die vorhandene Uebersetzungstabelle.
2. **Sprungmarke `id="laender"`** an `<div class="secttl"><h2>All countries</h2></div>`
   gehaengt (1 Vorkommen). `id="signature"` gab es schon.
3. **Menue schliesst beim Klick auf einen Eintrag.** Das fehlte bisher ganz und faellt
   erst mit Sprungmarken auf: klickt man sie an, waehrend man schon auf der Seite ist,
   laedt nichts neu — das Menue waere offen ueber der Sprungstelle stehen geblieben.
   ⚠️ **Der Block liegt in zwei Fassungen vor**, die sich nur in den Funktionsnamen
   unterscheiden: **22×** mit `op`/`cl`, **3×** mit `open`/`close`. Wer hier etwas
   aendert, muss beide treffen — eine Ersetzung erwischt sonst nur einen Teil.
4. **Sprungmarken werden selbst angesprungen**, samt `scroll-margin-top:90px`, damit
   die Ueberschrift nicht unter der Kopfzeile klebt.

⚠️ **Die Falle, die dabei Zeit gekostet hat: `scroll-behavior: smooth` steht auf
`html`.** Ein `scrollIntoView({behavior:'auto'})` uebernimmt genau diesen Wert — der
sanfte Lauf wird dann vom Nachladen der Kacheln abgebrochen und die Seite bleibt oben
stehen. Gemessen am 06.09.2026 auf `/de/shop-by-country/#laender`: mit `'auto'`
scrollY **0**, mit `'instant'` scrollY **1125**. **Nur `'instant'` schlaegt das CSS.**
Das gilt fuer jeden kuenftigen Ankersprung auf diesen Seiten.

Aus demselben Grund springt der Browser den Anker auch nicht von selbst an: die
Abschnitte oberhalb werden erst per Skript gefuellt, die Zielposition verschiebt sich
danach. Darum wird zweimal nachgesprungen (350 ms und 1'400 ms nach `load`).

**Geprueft:**

- **40 Router-Seiten** (10 Seiten × 4 Sprachen): alle 200, alle genau ein Menue-Block,
  alle mit Signature-Eintrag.
- Menue auf Franzoesisch: *Accueil · Signature · Acheter par pays · À propos · Contact*.
- Klick auf einen Sprungeintrag: Menue schliesst, Sprung sitzt (scrollY 1'035,
  Ueberschrift 90 px unter dem oberen Rand).
- `#signature` ebenso (scrollY 251, 90 px Versatz).
- Produktseite, Warenkorb und Mein Konto unveraendert.

**Offen geblieben:** die Menuelinks tragen **kein Sprachpraefix** (`/shop-by-country/`
statt `/fr/shop-by-country/`). Das war schon vorher so und ist derselbe
Schoenheitsfehler wie bei den Fusslinks (`shop-fusslinks.md`) — die Seite rendert in
der Cookie-Sprache weiter, nur die geteilte Adresse verliert die Sprache. Nicht
angefasst, weil es ueber den Auftrag hinausging.


Ausloeser: „der Shop wirkt billig nach Shopify-Store". Gemessen wurde ausgeloggt,
ohne Cookies, auf Startseite, Laenderseite und Produktseite.

**Der Kern des Eindrucks ist belegbar: das Theme spricht Shopify.** Im rohen
Server-HTML von `/de/albania/` stehen `Main Menu`, `Quick links`,
`Subscribe To Our Emails`, `Country/region · Germany | EUR €` und
**`♥ Follow on shop`**. Erst ein Skript malt Deutsch darueber. Das sichtbarste
Ueberbleibsel war „REGULAERER PREIS" ueber jedem Preis (aus *Regular price*) —
sinnlos ohne Streichpreis.

**Erledigt: „Regular price" ist raus.** 43 Vorkommen von
`<div class="rp">Regular price</div>` aus Snippet 11 entfernt. Snippet danach
**2'422'177 statt 2'423'682 Zeichen** (Differenz exakt 43 × 35), weiter aktiv,
Prioritaet 1. Nachgemessen auf 8 Seiten × 4 Sprachen = **32 Aufrufe, ueberall 0**.
Die tote CSS-Regel `.fcard .rp` steht noch drin.

**Sicherungen liegen als inaktive Snippets:** **103** (Router v4 vor der Aenderung,
wortgleich, 2'706'005 Zeichen roh) und **104** (Preis-API vor dem Zwischenspeicher).
Neu angelegt und **aktiv**: **105** (Kartenpreise serverseitig, siehe unten).

#### Der Preis flackerte — behoben

Die Kartenpreise stehen als **EUR-Festwerte im HTML** des Routers; erst danach
ersetzt ein Skript Name **und** Preis mit den echten Werten aus
`/wp-json/onefam/v1/cat-prices`. Bis dahin sieht ein Schweizer Besucher
„€69,99 EUR" statt „CHF 75.00" — und englische Produktnamen.

Gemessen auf `/de/albania/`, echter Seitenaufruf (nicht im Rahmen):

| | vorher | nachher |
|---|---|---|
| DOM interaktiv | 1'335 ms | 1'281 ms |
| API-Aufruf startet | 1'332 ms | 1'279 ms |
| API-Dauer | **1'261 ms** | **733 ms** |
| Preis springt auf CHF | **2'593 ms** | **2'012 ms** |

⚠️ **Eine frueher gemeldete Zahl war falsch.** Eine erste Messung in einem
eingebetteten Rahmen ergab 4'358–7'737 ms; der Rahmen lief parallel zur Seite und
hat sie ausgebremst. Belastbar sind die Werte oben aus dem echten Aufruf.

**Was gemacht wurde:** Snippet 15 bekam einen Zwischenspeicher (Transient,
15 Minuten, `?debug=1` umgeht ihn). Grund: die Route baute fuer **jedes** Produkt
und **jede** Waehrung eine frische `wc_get_product()`-Instanz und jagte sie durch
die volle CURCY-Filterkette. Die Antwort haengt nicht am Besucher — sie enthaelt
alle Waehrungen nebeneinander —, darf also zwischengespeichert werden. Geleert
wird ueber `delete_transient` je Produktkategorie an `woocommerce_update_product`,
`woocommerce_new_product`, `save_post_product` und gefiltertem `updated_post_meta`;
eine statische Sperre verhindert, dass ein PodOS-Sync hunderte Male aufraeumt.
API danach: kalt 826–1'192 ms, **warm 529–718 ms**.

**Alle 18 Preise der sechs erreichbaren Kollektionen vorher/nachher verglichen —
unveraendert.**

**Danach serverseitig geloest — neues Snippet 105 „OneFam Kartenpreise
serverseitig einsetzen".** Es setzt Produktname und Preis schon beim Ausliefern in
die Kacheln, aus demselben Zwischenspeicher. Drei Entscheidungen darin:

1. **Es rechnet nie neu, es liest nur.** Ist der Speicher kalt, bleibt das HTML
   unveraendert und das Skript aus Snippet 11 springt ein wie vorher. Die
   Auslieferung darf durch diese Ergaenzung nie langsamer werden.
2. **Ist der Speicher kalt, wird er nach der Auslieferung gefuellt** — ueber
   `register_shutdown_function` plus `fastcgi_finish_request`, der Besucher wartet
   also keine Millisekunde. Ohne das profitierten nur haeufig besuchte Seiten:
   beim ersten Test war von sechs Kollektionen genau eine warm.
3. **Zuordnung ueber den Slug im href**, nicht ueber die Reihenfolge der Karten wie
   im Skript. Wer eine Karte umsortiert, bekommt so keine vertauschten Preise.

Serverseitig ist das unbedenklich, weil die Router-Seiten nicht zwischengespeichert
werden — gemessen: `cache-control: no-cache, must-revalidate, max-age=0, no-store,
private`. Jede Auslieferung sieht Waehrung und Sprache ihres eigenen Besuchers.
Die Waehrung kommt aus `of_target_currency()` (Snippet 25), die Sprache aus
`of_visitor_lang()`.

**Ergebnis auf `/de/albania/`, im Browser gemessen:** Namen und Preise stehen
sofort nach dem Parsen richtig da (`Albanien Hoodie` / `CHF 75.00`) und sind nach
vier Sekunden **unveraendert** — das Skript findet nichts mehr zu tun. DOM
interaktiv 1'070 ms, `load` 1'123 ms.

**Vollpruefung: 48 Kombinationen** (6 Kollektionen × 4 Sprachen × CH/DE) — kein
einziger EUR-Notpreis bei einem CH-Besucher, Namen ueberall in der richtigen
Sprache (`Argentinien` / `Argentina` / `Argentine` / `Argentina`). Warenkorb,
Produktseite, Kasse, Mein Konto und die Info-Seiten unveraendert in Groesse und
Status.

⚠️ **Ein Fehler, der dabei zuerst eingebaut und dann behoben wurde:** der erste
Zwischenspeicher hatte nur den Slug im Schluessel. Die Route liefert aber je nach
Cookie `ofl` andere Produktnamen — „Albanien Hoodie" (de), „Albanie Hoodie" (fr),
„Albania Hoodie" (en/es), weil Snippet 57 den angezeigten Namen ersetzt. Damit
haette jeder die Namen in der Sprache des Besuchers bekommen, der den Speicher
zufaellig als erster fuellte. Der Schluessel heisst jetzt
`of_catprices_<sprache>_<slug>`, und geleert wird ueber alle vier Sprachen.
Nachgemessen: jede Sprache bekommt ihre eigenen Namen, auch beim zweiten Aufruf.

Laufzeit des Speichers steht auf **12 Stunden** (vorher 15 Minuten): seit die Werte
serverseitig eingesetzt werden, entscheidet sie darueber, wie oft eine selten
besuchte Seite wieder mit EUR-Notpreisen ausgeliefert wird.

#### ✅ Preisabweichung OneFam-Logo-Kollektion — behoben am 06.09.2026

Auf der **gerenderten Produktseite** gemessen (die belastbare Quelle):

| Produkt | CHF | Regel | EUR | Regel |
|---|---|---|---|---|
| OneFam Logo Hoodie | **70.00** | 75 | 69,99 | 69,99 |
| OneFam Logo Sweater | **60.00** | 65 | 59,99 | 59,99 |
| OneFam Logo Shirt | **35.00** | 40 | 34,95 | 34,95 |
| Logo Black Hoodie | 75.00 | 75 | 69,99 | 69,99 |
| Albanien Hoodie | 75.00 | 75 | 69,99 | 69,99 |

Nur die OneFam-Logo-Linie liegt in CHF **unter** dem Regelpreis, in EUR aber auf
Regelniveau. `REGEL-preise.md` sagt „ohne Ausnahme". Entweder ist es ein Fehler
oder eine nicht aufgeschriebene Absicht — **nicht selbst geaendert**.

**Umfang, im eingeloggten wp-admin ueber `wc/v3` gemessen** (die belastbare Quelle):

| Produkt | ID | Variationen | `regular_price` ist | soll |
|---|---|---|---|---|
| OneFam Logo Hoodie | 263 | 94 | **70** | 75 |
| OneFam Logo Sweater | 568 | 94 | **60** | 65 |
| OneFam Logo Shirt | 665 | 84 | **35** | 40 |
| OneFam White Logo Hoodie | 69 | 84 | **70** | 75 |
| OneFam White Logo Sweater | 365 | 94 | **60** | 65 |
| OneFam White Logo Shirt | 466 | 92 | **35** | 40 |

**542 Variationen, alle durchgaengig CHF 5 zu niedrig** — kein einziger Ausreisser,
jede Variation eines Produkts traegt denselben falschen Wert. Betroffen ist auch
die White-Logo-Linie, die noch als „bald verfuegbar" gefuehrt wird. Nicht
betroffen: Logo Black (75/65/40 korrekt) und alle Laenderprodukte.

**Behoben am 06.09.2026 nach Freigabe des Inhabers.** Alle 542 Variationen ueber
`wc/v3` im eingeloggten Backend auf die Regelpreise gesetzt.

Vorgehen, das sich bewaehrt hat und beim naechsten Mal wieder so laufen sollte:

1. **Erst den Bestand erfassen.** Alle 542 Variationen mit `regular_price` und
   `_regular_price_wmcp` gelesen. Befund: vollkommen einheitlich — je Produkt ein
   einziger CHF-Wert und ein einziger EUR-Wert, kein Ausreisser, kein Leerwert.
2. **Dann eine einzelne Variation als Probe** (263/357, 5XL Worker Blue) von 70 auf
   75. Ergebnis: `regular_price` 75, `_regular_price_wmcp` unveraendert
   `{"EUR":"69.99"}`. Damit war belegt, dass ein Schreiben auf `regular_price` den
   EUR-Festpreis nicht mitreisst — genau das Risiko, gegen das Snippet 89 haengt.
3. **Danach der Rest** in Paketen zu 50 ueber
   `POST /wp-json/wc/v3/products/<id>/variations/batch`. 541 weitere, keine Fehler.

**Der EUR-Festpreis liegt je Variation im Meta `_regular_price_wmcp`**, Form
`{"EUR":"69.99"}` — so, wie es `REGEL-preise.md` beschreibt. Das ist die Stelle, die
ein PodOS-Sync verliert und die Snippet 89 wieder herstellt.

**Nachkontrolle, alles gemessen:**

- **542 Variationen einzeln nachgelesen: 0 Abweichungen in CHF, 0 in EUR.**
- Gerenderte Produktseiten: OneFam Logo Hoodie CHF 75.00, Sweater CHF 65.00,
  Shirt CHF 40.00.
- **Fehlerbild-Kontrolle:** 12 Produktseiten (6 Produkte × CH/DE) auf
  82,50 / 71,50 / 44,00 geprueft — **kein einziges Vorkommen**.
- API ueber alle sechs Kollektionen, beide Waehrungen: durchgaengig
  **CHF 75/65/40** und **EUR 69,99/59,99/34,95**.

**Und dann die vollstaendige Kontrolle ueber den ganzen Katalog** — nicht nur ueber
die sechs geaenderten Produkte:

| | |
|---|---|
| Produkte geprueft | **42** (18 oeffentlich, 24 privat) |
| Variationen geprueft | **3'218** (1'426 oeffentlich, 1'792 privat) |
| CHF-Stufen | **eine** je Kleidungsstueck — 75 / 65 / 40 |
| EUR-Stufen | **eine** je Kleidungsstueck — 69,99 / 59,99 / 34,95 |
| Variationen ohne EUR-Festpreis | **0** |
| Abweichungen | **0** |

⚠️ **Das war nicht das erste Mal.** `REGEL-preise.md` haelt fest, dass **dieselben
542 Variationen schon am 31.08.2026** von 70/60/35 auf 75/65/40 angehoben wurden.
Am 06.09.2026 standen sie wieder auf 70/60/35.

**Ein PodOS-Sync war es nicht:** alle betroffenen Variationen tragen als Anlagedatum
den **22.07.2026** und wurden seither nicht neu erzeugt — derselbe Tag wie bei Logo
Black, das korrekt auf 75 stand. Ein Sync haette ein juengeres Datum hinterlassen.
Was tatsaechlich geschah, ist nicht mehr feststellbar: entweder wurde die Angleichung
am 31.08. dokumentiert aber nicht ausgefuehrt, oder etwas hat sie zurueckgesetzt, ohne
die Variationen anzufassen. Fuer das Erste spricht, dass die Nachkontrolle vom selben
Tag stammt wie eine dort eingestandene Fehlmessung.

**Daraus die neue Regel in `REGEL-preise.md`: eine Preisangleichung ist erst fertig,
wenn sie an einem spaeteren Tag noch einmal nachgemessen wurde.** Also: diese hier
in ein paar Tagen erneut pruefen, bevor sie als erledigt gilt.

**Nebenbei bestaetigt:** der Zwischenspeicher aus Snippet 15 leert sich bei einer
Produktaenderung tatsaechlich selbst. Direkt nach dem Schreiben lieferte
`/de/onefam-logo/` einmal wieder den statischen EUR-Notpreis, beim naechsten Aufruf
die korrigierten Werte — das Nachfuellen aus Snippet 105 hat gegriffen, wie gebaut.

#### Weitere Befunde, noch offen

- ✅ **Produktnamen englisch auf deutschen Seiten — erledigt.** `Albania Shirt`,
  `Albania Sweater`, **`Albanian Hoodie`** standen im Router hartkodiert und liefen
  deshalb nicht durch Snippet 57. Snippet 105 setzt jetzt den Namen aus derselben
  Quelle ein. **Im Router steht der falsche Text weiter** — er ist nur noch der
  Notbehelf fuer den Fall, dass der Zwischenspeicher kalt ist. Wer ihn dort
  aufraeumt, sollte „Albanian Hoodie" gleich auf „Albania Hoodie" vereinheitlichen.
- ~~Zwei tote Adressen: `/white-logo/` und `/antigua-and-barbuda/`.~~ **Beides war
  falsch notiert** — am 07.09.2026 geprueft, siehe „Die zwei toten Adressen gab es
  nicht" weiter oben. Es sind **sieben** pausierte Laender, nicht sechs: Anguilla,
  **Antigua & Barbuda**, Bosnien, Brasilien, Brunei, Mexiko, Peru. Alle leiten mit
  302 auf `/shop-by-country/`.
- ~~Im Router liegen 14 fertige Seiten, erreichbar sind nur 6.~~ **Irrefuehrend
  formuliert, am 08.09.2026 nachgemessen:** die 14 Kollektionsseiten sind **nicht
  fertig** — den acht umgeleiteten fehlen die Modellbilder (alle Bildadressen 404,
  keine Datei in der Mediathek), ihre Produkte stehen auf privat. Umgeleitet wird von
  **Snippet 99**. Es sind sieben Laender **und** die Logo-Linie Weiss. → „Die 14
  Router-Seiten nachgezaehlt" oben.
- ~~Die Signature-Kollektion ist praktisch versteckt.~~ **Erledigt.** Am 07.09.2026
  nachgemessen: das Menue hat jetzt fuenf Eintraege — Startseite, **Signature**,
  Nach Land shoppen, Ueber uns, Kontakt.
- ~~Vier Schriften im Einsatz (Inter, Trirong).~~ **Ueberholt.** Am 07.09.2026 auf
  der Produktseite gezaehlt: Satoshi (490 Elemente), Cabinet Grotesk (23), Open Sans
  (23) — Letzteres nur auf einem versteckten `<select>` und damit unsichtbar.
  **Inter und Trirong sind nicht mehr da.**
- ~~Kaufknopf `opacity: 0.45`, Schrift 13 px, Kontrast 3,56:1.~~ **Erledigt am
  07.09.2026.** Deckkraft ist 1, Schrift 15 px, Kontrast ueberall **4,95:1** —
  siehe „Knopfkontrast" oben.
- **Produktseite:** heller Bereich `#F4EFE6` im schwarzen Markenraum `#0A0A0A`,
  und **958 von 1440 px** Breite genutzt — rechts bleibt Leerflaeche. ~~18
  Galeriebilder als Kachelwand~~ war eine **Fehlzaehlung**: 18 im Markup, **9
  sichtbar**, Kaufknopf bei 624 px ueber der Falz (08.09.2026).
- ~~Hero der Startseite: 597 px hoch, `#2C2620`, kein Bild.~~ **Zweimal ueberholt.**
  Es war ein Video ohne Vorschaubild (Korrektur weiter oben), und am 07.09.2026 wurde
  der Hero umgebaut: 525 px, Marke als Block, Kacheln direkt darunter.
- ~~Startseite 6'787 px hoch, die Laender kommen dreimal vor.~~ **Ueberholt am
  07.09.2026:** **4 666 px (5,7 Bildschirme)**, und jedes Land kommt genau **einmal**
  vor. → „Wo die Startseite jetzt steht" weiter oben.
- ~~Zwei Fusszeilen-Fassungen nebeneinander.~~ **Gibt es nicht mehr** — am
  08.09.2026 auf Produkt- und Router-Seite wortgleich gemessen. Siehe „Drei Befunde
  aus Punkt 10 nachgeprueft" oben.
- **Sprach-Cookie schlaegt die Adresse:** mit Cookie `ofl=es` zeigt
  `/de/produkt/albania-hoodie/` spanische Akkordeon-Titel („¿Me quedará bien?"),
  EUR-Preise bei „CHF Fr." im Kopf und den Seitentitel „Modus fuer alle …" statt
  „Mode". Nach dem Loeschen der Cookies alles korrekt.


### zahls.ch nachgesehen — 03.09.2026: es gab nie etwas auszuzahlen

Frage war, warum keine Auszahlung kam. **Antwort: weil bei zahls.ch nie Geld lag.**
Alle Werte im eingeloggten Konto `onefam.zahls.ch` gemessen (FREE Plan, Labinot
Bajrami, info@onefam.ch).

**Die einzige Transaktion überhaupt** — zugleich der Zahlungsbeleg für #4145:

| Feld | Wert |
|---|---|
| Datum | 23.07.2026 19:30:40 |
| Betrag / Status | EUR 39.57 · Bestätigt |
| **Zahlungsanbieter** | **PayPal** |
| Zahlungsart | PayPal |
| **Referenz ID** | **4145** |
| Typ | E-Commerce |
| zahls.ch-Gebühr | EUR 0.63 |
| Position | Argentina Shirt EUR 34.95 + Versand |

**Dashboard:** EUR Gesamtzahlungen 1 · EUR Gesamtumsatz 39.57 · zur Auszahlung
verfügbar EUR 0.00 · letzte 30 Tage EUR 0.00 / 0 Zahlungen / −100 %.

**Auszahlungsseite:** Payrexx Pay CHF 0.00 verfügbar und 0.00 bald verfügbar,
Payrexx Pay Plus ebenso, Total CHF 0.00, „Sie haben noch keine Auszahlungen
erhalten".

**Der Grund steht auf derselben Seite im Klartext:** „Transaktionen, die über einen
externen Zahlungsanbieter abgewickelt wurden, werden nicht von zahls.ch, sondern
direkt vom jeweiligen Anbieter ausbezahlt." Die Zahlung lief über PayPal — das Geld
ging direkt aufs PayPal-Konto, zahls.ch war nur Kasse und hat dafür EUR 0.63
genommen. Bei zahls.ch gibt es nichts auszuzahlen, und das ist kein Fehler.

Nicht die Ursache, obwohl zuerst vermutet: das Konto ist verifiziert, Payrexx Pay
ist eingerichtet, ein Auszahlungskonto ist hinterlegt.

**Im PayPal-Konto nachgemessen.** Das im Shop benutzte Käuferkonto führt den
Vorgang als **Abgang** von 39,57 € — der Inhaber hat die eigene Bestellung mit der
eigenen Kreditkarte bezahlt. Auf dem **Händlerkonto `info@onefam.ch`** steht
derselbe Vorgang als Eingang: 39,57 € abzüglich 1,34 € PayPal-Gebühr =
**38,23 EUR gutgeschrieben**, seit 23.07.2026 unverändert als Guthaben liegend.
Einziger Posten des Kontos in 90 Tagen. Ertrag ist keiner entstanden, nur Gebühren
(zahls.ch 0,63 € plus PayPal 1,34 €).

**Warum davon nie etwas auf die UBS kam:** in diesem PayPal-Konto ist **kein
Bankkonto und keine Karte hinterlegt** — PayPal hatte kein Ziel, wohin es
auszahlen könnte. Die UBS-IBAN liegt bei zahls.ch, und dort ist nie Geld
durchgelaufen. Beides zusammen ergibt die Antwort auf die Ausgangsfrage.

⚠️ **Das PayPal-Händlerkonto ist ein Privatkonto und für den Shop nicht geeignet.**
Gewerbliche Einnahmen über ein Privatkonto sind nach den PayPal-Bedingungen nicht
vorgesehen, und die Stammdaten passen nicht zum Betrieb. Einzelheiten liegen beim
Inhaber, nicht in dieser Datei.

### Zahlungswege im Shop — am 04.09.2026 gemessen

**Der Weg über PayPal ist schon zu.** In WooCommerce ist **zahls.ch der einzige
Zahlungsanbieter** und aktiv; das PayPal-Plugin ist nicht einmal installiert. In
zahls.ch ist **Payrexx Pay der einzige eingerichtete Anbieter** — PayPal steht dort
wieder unter „Neue Zahlungsanbieter hinzufügen", ist also entfernt worden. Damit
**kann an der Kasse kein PayPal mehr gewählt werden**, und jeder neue Verkauf läuft
über zahls.ch auf das Auszahlungskonto.

Was der Kunde sieht: Titel „Kreditkarte, TWINT und Mobile Pay", Logos **TWINT,
Mastercard, Visa, Apple Pay, Google Pay, Samsung Pay** (PayPal ist nicht
ausgewählt). Payrexx Pay deckt zusätzlich reka, PostFinance-Karte und Pay by Bank.

**Payrexx Pay Plus ist nicht aktiviert.** Damit fehlen American Express, Diners,
Discover, Klarna, iDEAL, Bancontact und EPS — für deutsche und niederländische
Kunden die üblichen Zahlungsmittel. Vor einem EU-Launch prüfen; die Auszahlung
liefe dort über eine Partnerbank, das ist gesondert anzusehen.

**Am 03.09.2026 behoben:** der Kontoinhaber des Auszahlungskontos hiess bei
zahls.ch „OneFam", das UBS-Konto lautet aber auf **Labinot Bajrami**. Geändert und
nach dem Neuladen nachgeprüft. Damit wäre eine Auszahlung nicht mehr an der
Namensprüfung der Bank gescheitert.

**Folge dieser Änderung — am 04.09.2026:** zahls.ch wertet jede Änderung der
Bankverbindung als meldepflichtig und hat **die Auszahlungen pausiert**, bis ein
aktueller Bankkontoauszug des neuen Kontos vorliegt (PDF aus dem E-Banking,
Erstellungsdatum sichtbar und nicht älter als 3 Monate, Name und IBAN lesbar;
Kontostand und Buchungen dürfen geschwärzt werden — Screenshots werden nicht
akzeptiert). Der Beleg wurde am 04.09.2026 eingereicht, geschwärzt bis auf Name,
IBAN und Erstellungsdatum.

**Stand danach:** die Menüzeile „Kontoprüfung abschliessen" ist verschwunden, unter
Payrexx Pay steht „Kontoangaben werden überprüft", Modus **Live**, Status
**Zahlungen grün · Auszahlungen rot**. Der Shop kann also weiter kassieren, nur die
Auszahlung ist gesperrt. **Verifizierung dauert ein bis zwei Werktage — ab dem
08.09.2026 nachsehen, ob der Auszahlungsstatus grün ist.** Mögliche Rückfrage:
zahls verlangt ein *geschäftliches* Bankkonto, eingereicht wurde ein UBS-Privatkonto.

**Drei Dinge, die beim ersten echten Verkauf über Payrexx Pay Geld kosten:**

1. **Nur ein CHF-Auszahlungskonto** (Schweiz, auf den Inhaber lautend), Standardwährung CHF. Im Konto steht: „Für Transaktionen einer
   Währung ohne Auszahlungskonto wird zusätzlich zur Umrechnung in die
   Standard-Währung (Tageskurs) eine **Umrechnungsgebühr von 2 %** belastet." Der
   Shop verkauft in EUR → jeder EUR-Verkauf kostet 2 % extra, solange kein
   **EUR-Auszahlungskonto** hinterlegt ist.
2. ~~**Kontoinhaber ist als „OneFam" eingetragen.**~~ **Erledigt am 03.09.2026** —
   steht jetzt auf „Labinot Bajrami", passend zum UBS-Konto. zahls.ch warnt
   ausdrücklich, der Name müsse mit der tatsächlichen Bezeichnung des Bankkontos
   übereinstimmen, sonst lehnt die Bank die Auszahlung ab.
3. **Auszahlung monatlich, jeweils am 31. Tag**, und nur E-Commerce-Transaktionen,
   die älter als 8 Tage sind. Ein anderer Rhythmus ist im Konto nicht wählbar —
   laut Hilfe erst nach drei Monaten Verlauf und nur über den Support.

**Tarif:** FREE Plan, keine Monatsgebühr, 2,9 % + CHF 0.30 je Transaktion. Die
Händler-Werkzeuge sind vollständig; die Werbeaussage „alle Funktionen in jedem Abo"
gilt aber **nicht** für die externen Zahlungsanbieter — im Backend sind welche mit
`UPGRADE` markiert und im FREE Plan gesperrt. Payrexx Pay Plus ist eingerichtet,
aber **nicht aktiviert**.


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
   laden und die Zeichenlänge prüfen. **Auch über REST bleibt der Rumpf leer**, und
   `GET` auf Snippet 11 liefert ebenfalls nichts — den Code dieses einen Snippets holt
   man aus `CODE_SNIPPETS_EDIT.snippet.code` auf `admin.php?page=edit-snippet&id=11`
   (2'706'005 Zeichen roh, 2'423'682 entschluesselt, gemessen am 06.09.2026).
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
8. **Die REST-Schnittstelle fuer Snippets gibt es doch — korrigiert am 06.09.2026.**
   Der Satz „gibt es in dieser Fassung nicht" war eine Fehlmessung: ohne Nonce
   antwortet `/wp-json/code-snippets/v1/snippets` mit 403 `rest_cookie_invalid_nonce`
   und wirkt tot. Der Nonce steht im eingeloggten wp-admin auf jeder
   Snippet-Bearbeitungsseite in **`CODE_SNIPPETS.restAPI.nonce`** — nicht in
   `wpApiSettings`, das war der Irrweg. Lesen mit `GET .../snippets/<id>`, schreiben
   mit `POST` auf dieselbe Adresse und dem **vollstaendigen** Objekt (`name`, `desc`,
   `code`, `scope`, `active`, `priority`, `tags`); fehlt `active: true`, ist das
   Snippet danach aus. Am 06.09.2026 an Snippet 4 durchgespielt: geschrieben,
   nachgemessen, zurueckgesetzt. Der Editorweg (echter Mausklick, `cm.setSelection()`,
   echter Tastendruck) bleibt nur noch der Notnagel — programmatisch gesetzter Code
   wird dort weiterhin still verworfen. Danach IMMER die Zeichenlaenge nach dem
   Neuladen pruefen und die Live-Seite messen.
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
- zahls.ch laeuft im **FREE Plan**: keine Monatsgebuehr, 2,9 % + CHF 0.30 je
  Transaktion. Bisher einzige Belastung: EUR 0.63 auf Bestellung #4145
- Pool-Stand 2026: **0.00** — es gab noch keinen echten Verkauf über den Webhook
