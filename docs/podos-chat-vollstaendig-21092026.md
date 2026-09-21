# PodOS-Chat, Kanal `onefam` — vollstaendig durchgesehen am 21.09.2026

Alle fuenf Threads geoeffnet und gelesen, nicht stichprobenweise:
**13 + 9 + 4 + 1 + 14 = 41 Antworten** plus die Nachrichten im Hauptfaden.

**Warum das noetig war:** Mehrere Punkte, die in `stand.md` und in der Uebergabe
als „offen" oder „Antwort steht aus" gefuehrt werden, **sind laengst beantwortet**
— die Antworten lagen in eingeklappten Threads.

---

## 1. Retouren: beantwortet, und es kostet Geld

**HW-Christian, vor 6 Tagen** (ca. 15.09.2026), Antwort auf Labis Frage vom 14.09.:

> **Returenmanagement: Aktuell in Planung**
> Ablauf jetzt, bestenfalls zu dir um es ggf. wieder zuverkaufen
> **keine Erstattung unsererseits fuer die Produktion, POD** (Qualitaetsanspruche
> natuerlich bleiben Bestehen im Fall von Reklamation etc.)
> Endpunkte bzw. API Anbindungsinformationen findest du links oberhalb von
> Settings steht `<>Developer`.

**In der Uebergabe steht „Antwort steht noch aus". Das ist ueberholt.**

**Die Folge fuer die Kalkulation, und sie ist unangenehm:** Bei einer
Ruecksendung gibt es **keine Gutschrift der Produktionskosten**. Der
WooCommerce-Webhook bucht ueber `reversePoolForOrder` den Pool-Anteil zurueck —
**die COGS und der Versand bleiben aber bei OneFam haengen.** Eine Retoure ist
also nicht neutral, sondern ein Verlust in Hoehe von COGS + Versand, abzueglich
dessen, was sich beim Weiterverkauf noch erloesen laesst.

**Gehoert ins Kostenmodell** (`docs/shop-und-pool-details.md`) und in die
Abwaegung zum Widerrufsrecht: Je hoeher die Retourenquote, desto teurer.

## 2. Der Connector-Fehler ist behoben — mit Wortlaut

**HW-Christian, vor 18 Tagen** (ca. 03.09.2026):

> Yes, exactly, we have made the change to Woocomm integration to make sure that
> if a payment link is shared from woocomm, podOS will not pick this order up as
> paid until the status changes in Woocomm to confirm the order is actually paid.

**Und #5164 ist erledigt:** Die Gutschrift ist auf der Kreditkarte eingegangen,
Labi hat es im Chat bestaetigt. Belastung war „SHIRT-KING PRINT-ON-DE", 42,82 €
am 18.08.2026.

## 3. Siebdruck ueber PodOS ist ausgeschlossen — und Vorbestellungen bringen dort nichts

**HW-Christian, vor 21 Tagen:**

> Siebdruck ist kein Bestandteil der Cloud bzw. des print on demand Angebotes, da
> die Stueckzahlen hierfuer deutlich hoeher sind, als der uebliche pod Kunde
> benoetigt. Du kannst, dass lediglich als Anfrage an `hello@shirt-king.de`
> zuschicken. **Da innerhalb der Cloud, es keine Staffeln gibt, wuerden
> Vorbestellungen keinen preislichen Vorteil mit sich bringen.**

**Der letzte Satz ist der wichtige.** Ein Drop-Modell mit Vorbestellungen bringt
**ueber PodOS** keinen besseren Einkaufspreis — die Mengenersparnis gibt es nur
ausserhalb der Cloud, als Auflage bei Shirt-King direkt. Das ist genau der Weg,
den Robert beschreibt (100 Stueck Siebdruck, 30 Stueck Stick).

## 4. Die Bestellungen hingen an fehlenden Adressdaten

**HW-Christian, vor 2 Monaten**, im Thread „Orders stuck at New":

> die Bestellung koennen nicht ausgeloest werden durhc die Fehlenden Angaben
> unter Settings. Bitte ergaenze alle Adressdaten.

Dazu zwei Dinge, die man wissen muss:

> Wir koennen leider keinen job anstossen, **dass muss aus dem Shop geschehen.**
> Was die „Tests" betrifft, diese koennen wir aus der Uebersicht nicht entfernen.
> **Sie werden aber nicht ausgefuehrt und verursachen auch keine Kosten.**

## 5. Der aelteste Thread: Rohteil-Freischaltung

**HW-Christian, vor 3 Monaten:** `STSU177` ist freigeschaltet, bei `STSU178`
wurde die Freischaltung nicht uebernommen, Entwickler informiert. Ob das je
erledigt wurde, steht nirgends.

---

## Was als Einziges nie beantwortet wurde

**Die Ausfuehrer-Frage.** Sie steckt im 9-Replies-Thread, in derselben Nachricht
wie die WooCommerce-Frage:

> 1) Zoll / Ausfuehrer — kurze Bestaetigung erbeten […] Koennt ihr
> (Heldenwerbung) mir bitte kurz bestaetigen, dass ihr beim Versand aus
> Deutschland als Ausfuehrer/Anmelder auftretet?

Christians einzige Reaktion darauf: *„zur eins ist dein Fall sehr Speziell,
hatten wir so noch nicht und muessen das noch pruefen lassen."* Danach hat sich
der Begriff **„Spezialfall" auf das Shopify-/WooCommerce-Thema verschoben**, und
mit dessen Erledigung galt auch die Zollfrage als erledigt. **Sie wurde nie
beantwortet.**

**Der Entwurf dafuer liegt in `docs/entwuerfe/anfrage-ausfuehrer-heldenwerbung.md`.**

---

## Die Lehre, die sich zweimal bestaetigt hat

**Zwei Themen in einer Nachricht — eins faellt raus.** Das ist im selben Kanal
zweimal passiert:

1. **Zoll + WooCommerce** in einer Nachricht → die Zollfrage ging unter.
2. **DTF-Umstellung**: Robert sagt „machen wir", Christian sagt „mach du" → seit
   dem 15.09. passiert nichts, weil niemand sich zustaendig fuehlt.

Christian hat es am 31.07. selbst benannt: *„bei der ganzen AI Auflistung
verlieret sich die Kernfrage."* **Eine Frage je Nachricht, und nachfassen, bis
sie beantwortet ist.**
