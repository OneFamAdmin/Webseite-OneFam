# Entwurf: Nachricht an HW-Christian (PodOS-Chat, Kanal `onefam`) — 08.09.2026

**Zweck:** das Preisfeld aus ihrem WooCommerce-Sync nehmen lassen. Nicht bei ihnen
leeren — ein leeres Feld, das durchgeschrieben wird, macht die Variation unkaufbar
(am 08.09.2026 gemessen, siehe `docs/stand.md`).

---

Hallo Christian,

wir haben ein wiederkehrendes Problem mit dem WooCommerce-Sync und ich glaube, die
Loesung ist klein.

**Was passiert:** euer API-Schluessel („heldenwerbung-409340 – API", Lesen/Schreiben)
schreibt bei jedem Abgleich die Verkaufspreise in unseren Shop zurueck. Zuletzt:

- 07.09.2026, 07:56 und 20:24 Uhr — 364 Variationen
- 08.09.2026, 08:32 bis 08:34 Uhr — 188 Variationen

Gesetzt wird jedes Mal Sweater **60** und Shirt **35**. Bei uns muessen dort
**65** und **40** stehen. Das Feld, das ihr beschreibt, ist unser **Basispreis, und
der laeuft in CHF** — zwei der betroffenen Produkte sind oeffentlich, wir haben also
zwischenzeitlich 5 CHF pro Stueck zu billig verkauft. Aufgefallen ist es lange nicht,
weil unsere EUR-Preise separat hinterlegt sind und richtig blieben.

Auffaellig: 60 und 35 sind genau unsere gerundeten **EUR**-Preise (59,99 und 34,95).
Vermutlich stehen bei euch die Euro-Werte, und die landen bei uns im Franken-Feld.

**Unsere Bitte:** nehmt das **Preisfeld ganz aus dem Sync**. Ihr braucht unsere
Verkaufspreise nicht — sie stehen in jeder Bestellung, die ueber den Connector zu
euch geht (Webhook auf `connector.api.podos.io`, mit Betrag und Waehrung je Position).
Der Verkaufspreis ist unsere Seite, eure ist die Produktion.

**Drei Fragen dazu:**

1. Koennt ihr das Preisfeld aus dem Sync herausnehmen — oder gibt es dafuer einen
   Schalter im Projekt `onefam-441595`?
2. Falls es nicht geht: **kann PodOS CHF fuehren?** Dann tragen wir dort 40 / 65 / 75
   ein. Wenn PodOS nur EUR kann, hilft nur Punkt 1.
3. **Bitte das Feld bei euch nicht einfach leeren.** Wir haben geprueft, was ein leerer
   Wert bei uns anrichtet: WooCommerce nimmt ihn an, und die betroffene Variante ist
   danach **nicht mehr bestellbar** — ohne dass man es der Produktseite ansieht. Ein
   leeres Feld waere also schlimmer als ein falscher Preis.

**Noch eine Beobachtung**, falls sie euch etwas sagt: der Abgleich legt auch
Variationen an — zwischen dem 07. und 08.09. sind acht dazugekommen (3 210 → 3 218).

Danke dir!

---

**Nicht mitschicken, nur zur Erinnerung fuer uns:** die Wache (Snippet 106)
protokolliert jetzt auch leere Preise. Ob die Bitte gewirkt hat, sieht man daran, dass
`of_preis_abweichungen_zaehler` nicht weiter steigt — Stand beim Absenden: **189**.
