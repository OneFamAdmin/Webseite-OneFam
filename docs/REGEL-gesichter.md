# REGEL: Jedes Land bekommt wirklich andere Gesichter (23.08.2026)

**Beanstandung von Labi, 23.08.:** die ersten albanischen Basisbilder sahen aus wie
die argentinischen. *„Ich entscheide mich für keine Nummer, weil beide genauso
gleich aussehen wie bei Argentinien."*

Er hat recht, und der Fehler ist benennbar.

## Was schiefging

Der Albanien-Absatz war eine **Umschreibung des argentinischen**, nicht eine eigene
Beschreibung. Nebeneinandergelegt:

| | Argentinien (Mann) | Albanien (Mann), erster Versuch |
|---|---|---|
| Haut | warm light-olive | warm olive, golden undertone |
| Haar | thick straight black, **swept back** | thick dark-brown, **swept back** |
| Augen | dark, **deep-set** | dark-brown, **deep-set** |
| Brauen | **strong straight** | **heavy straight** |
| Kiefer | **broad square** | **wide square** |
| Bart | short trimmed black beard | short dark stubble beard |
| Nase | straight with slight bump | long straight, high bridge |

Das ist derselbe Mensch mit anderem Herkunftsort. Dazu kommt: rund 80 % des Prompts
(Licht, Objektiv, Hintergrund, Pose, Zahn-Satz, Hauttextur-Bausteine) sind über alle
Länder **wortgleich**. Diese Masse zieht das Modell in seinen Durchschnitts-
Modelltypus, und ein Absatz mit generischen Merkmalen kommt dagegen nicht an.

**Merksatz: „hohe Wangenknochen, gerade Nase, kantiger Kiefer, dunkles Haar" ist
keine Ethnizität. Das ist die Standard-Modellschablone.**

## Die Regel

1. **Vor dem Schreiben die Beschreibung des zuletzt gemachten Landes danebenlegen.**
   Wenn sich mehr als zwei Merkmale decken, ist sie nicht fertig.
2. **Merkmale wählen, die das Modell wirklich unterscheidet** — nicht die, die jede
   Modellbeschreibung enthält:
   - **Schädel- und Gesichtsform** (breit und kurz, lang und schmal, herzförmig,
     flacher Hinterkopf)
   - **Nasenprofil** (konvex mit hoher Wurzel, gerade, an der Spitze abfallend oder
     aufgestellt, breit mit runder Spitze)
   - **Augenform und Lidfalte** (tief liegend, hervortretend, mandelförmig mit
     Schlupflid, eng oder weit stehend)
   - **Haarstruktur und Ansatz** (fein und glatt, grob und wellig, enge Locken,
     tiefer Ansatz, Witwenspitze, Geheimratsecken)
   - **Statur und Proportion** (hochgewachsen und schlaksig, kompakt und athletisch)
3. **Augenfarbe und Hautton innerhalb eines Landes variieren**, wo es der Realität
   entspricht. In Nordalbanien sind graublaue Augen häufig — allein das bricht den
   Eindruck „immer dasselbe Gesicht".
4. **Immer mehrere echte Typen anbieten, nicht Varianten eines Typs.** Ein Land ist
   kein Gesicht. Für Albanien: Nord (Gege) hell und hochgewachsen, Süd (Toske)
   dunkler und kompakter, Stadt Tirana jünger und schmaler.
5. **Regionsnamen statt Landesname.** „from Shkodra in the northern highlands" trägt
   mehr als „from Albania" und verhindert das Länderklischee.
6. **Der Anti-Generik-Satz gehört in jeden Prompt:**
   > „Follow the bone structure described below literally. This must read as one
   > specific, individual, regionally distinctive human being, NOT a generic
   > international model face and not a symmetrical composite: the beauty comes
   > from the described structure itself."
7. **Hautmerkmale je Person einzeln erfinden** — Muttermal an anderer Stelle, Narbe,
   Sommersprossen, Äderchen, ein Lid tiefer. Die immer gleiche Liste
   („Muttermal linke Wange, Lachfältchen, eine Braue höher") erzeugt immer
   dasselbe Gesicht.
8. **Wortgleiche Blöcke stehen lassen, wo sie nötig sind** — Licht, Objektiv,
   Hintergrund, freie Brust. Die sichern die Serie. Aber der Personenteil muss
   dagegen anschreiben können, also lang und konkret sein.

## Gilt auch innerhalb eines Landes

Der Mann und die Frau eines Landes dürfen **nicht wie Geschwister** aussehen. Bei
Albanien wurden deshalb Herkunftsregion, Alter, Hautton und Augenfarbe des Paares
unterschiedlich gewählt.

## Umsetzung Albanien

Sechs Basisbilder, drei Typen je Geschlecht, statt zweier Varianten eines Typs.
Beschreibungen und job_ids: `claude/albanien-hoodie-basisbilder-23082026.md`.
