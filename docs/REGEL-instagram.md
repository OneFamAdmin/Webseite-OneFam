# REGEL: Instagram — Bio und Raster (25.09.2026)

Entstanden aus Labis Frage, ob Bio und Beschreibung zur Seite passen. Antwort:
der Text arbeitete gegen sie, und das groessere Problem war gar nicht der Text.

Stand bei der Pruefung: `onefam_official`, 4 Beitraege, 89 Follower.

---

## Die Bio

### Was vorher dastand — und warum es weg musste

```
For souls who belong to more than one place 🌍
A global Fam — good energy, real connections, real journeys.
Join the Fam — free 👇
```

Drei Befunde:

1. **„good energy, real connections, real journeys"** sind drei abstrakte
   Woerter hintereinander. Genau das Register, das am 24.09.2026 aus dem Family
   Code entfernt wurde („Gratitude", „Growth"). Es kostet nichts, schliesst
   niemanden aus und koennte unter jedem Profil stehen — in den 150 Zeichen, die
   am meisten gelesen werden.
2. **„free" ist das teuerste Wort da oben.** Staerkstes Preissignal, das es gibt,
   und Premium-Marken schreiben es nie. Dazu: die Seite wird bewusst frei von
   Gewinnspiel-Sprache gehalten, und „join … free" zeigt genau dorthin. Auf der
   Seite steht der Zusammenhang dabei, in der Bio steht der Satz allein.
3. **👇 ist die Wachstums-Geste schlechthin.** Die Designregel verbietet
   Countdown, Glow und Deko — der Pfeil gehoert in dieselbe Familie. Der Link
   steht ohnehin direkt darunter.

Nebenbei: im Namensfeld stand „Global Community", waehrend die Kategorie darueber
schon „Community" heisst. Das Namensfeld ist der **einzige durchsuchbare Text**
des Profils; ein Wort zu verschenken, das ohnehin dasteht, ist Verschwendung.

### Was jetzt dasteht

**Namensfeld** (29 von 30 Zeichen):

```
OneFam — Clothing & Community
```

**Bio, Englisch** (125 von 150 Zeichen):

```
Where are you from?
If your answer has a comma in it, this is for you.
Clothing for people who belong to more than one place.
```

Kein „free", kein Emoji, kein Pfeil. Der Kommaspruch ist der staerkste Satz der
Marke — er steht auf der Startseite und seit dem 24.09.2026 auch ueber der
Shop-Hero. Er schliesst von selbst aus; dafuer braucht es keine Geste.

### ⚠ Nur eine Sprache ins Profil — die Umschaltung ist schon gebaut

Instagram hat **ein** Bio-Feld mit 150 Zeichen. Vier Sprachen hineinzuquetschen
macht aus dem staerksten Satz einen Zettel.

**Es ist auch unnoetig:** `i18n/geo.ts` erkennt die Sprache ueber Cookie, dann
`Accept-Language`, dann Laenderkopf. Wer aus Spanien auf `onefam.ch` tippt,
landet auf `/es`, ohne dass im Profil ein Wort Spanisch steht. Englisch ist
ausserdem die Standardsprache der Seite, die ohne Praefix laeuft.

### Die anderen drei Fassungen — wofuer sie da sind

**Nicht fuer die Bio.** Fuer **Beitragstexte, Story-Text und Untertitel**, wenn
ein Land gezielt angesprochen wird — beim Albanien-Drop etwa der deutsche oder
albanische Text im Beitrag, waehrend die Bio englisch bleibt. Und als Bio, falls
spaeter eigene Laenderkonten entstehen.

Alle gemessen, alle unter 150 Zeichen:

| | Zeichen | Text |
|---|---|---|
| **de** | 126 | Woher kommst du?<br>Wenn deine Antwort ein Komma hat, bist du hier richtig.<br>Kleidung fuer alle, die zu mehr als einem Ort gehoeren. |
| **fr** | 126 | D'ou viens-tu ?<br>Si ta reponse contient une virgule, c'est pour toi.<br>Pour celles et ceux qui appartiennent a plus d'un endroit. |
| **es** | 112 | ¿De donde eres?<br>Si tu respuesta lleva una coma, esto es para ti.<br>Ropa para quienes pertenecen a mas de un lugar. |

> Die Umlaute und Akzente sind in dieser Tabelle bewusst vereinfacht, weil
> Commit-Nachrichten und Dateien hier ASCII bleiben. **Beim Eintragen ins Profil
> die richtigen Zeichen setzen:** „für", „gehören", „D'où", „réponse",
> „appartiennent à", „¿De dónde", „más".

---

## Das Raster

### Die eine Regel, aus der alles folgt

**Das Raster ist ein Raum, kein Schaufenster.** Auf der Seite steht: „Wer nur
gesehen werden will, ist im falschen Raum." Jeder Beitrag wird daran gemessen.
Ein Beitrag, der um Aufmerksamkeit bittet, widerlegt den eigenen Text.

### Was hineingehoert

- **Getragene Stuecke, ruhig.** Dieselbe Machart wie im Abschnitt „Die Stuecke":
  frontal, ruhiger Blick, Mund zu, niemand verkauft etwas.
- **Das Zeichen als Detail.** Nah, halb verdeckt, beilaeufig — wie etwas, das man
  bemerkt, nicht wie ein Logo, das gezeigt wird.
- **Orte, die eine Antwort mit Komma haben.** Eine Strasse, ein Fenster, ein
  Tisch. Ohne Menschen, die posieren.
- **Textkarten** in Cabinet Grotesk auf `#0A0A0A`, Gold `#C9A84C` als einziger
  Akzent. Ein Satz, keine Absaetze.

### Was nicht hineingehoert

- **Nachtleben und Clublicht.** Die drei Reels, die am 25.09.2026 oben standen,
  waren genau das: Netzwerk-Bar, jemand unter gruenem Licht, eine Nahaufnahme mit
  Sonnenbrille im Mund.
- **Selfies mit offenem Mund, Grimassen.** Privatperson, nicht Marke.
- **Fremde Musik-Cover als Beitrag** — das erzaehlt von jemand anderem.
- **Countdown, Glow, Verlaeufe als Deko, Stockfotos.** Dieselbe Liste wie in
  `CLAUDE.md` fuer die Seite. Der Marken-Verlauf ist die einzige Ausnahme.
- ⛔ **Jede Gewinnspiel-Sprache.** Kein „gewinnen", keine „Verlosung", keine
  „Teilnahme", keine Glucks-Metaphern. Die Sprachregel gilt hier **schaerfer** als
  auf der Seite, weil der erklaerende Zusammenhang fehlt.

### Wie es zusammenhaelt

- **In Dreierreihen denken.** Das Raster wird als Block gesehen, nicht als
  Einzelbild. Drei Beitraege, die zusammengehoeren, schlagen neun gemischte.
- **Wenige und gleich schlagen viele und bunt.** Vier Beitraege mit einer
  Handschrift wirken teurer als vierzig.
- **Dieselbe Farbwelt wie die Seite:** dunkel, entsaettigt, Gold als einziger
  Akzent. Helle, voll gesaettigte Bilder brechen die Reihe — derselbe Fehler, der
  am 24.09.2026 im Stuecke-Abschnitt behoben wurde.
- **Die ersten neun Beitraege sind der Raum.** Wer neu kommt, sieht sie als Ganzes
  und entscheidet daran. Bei 89 Followern ist das keine Nebensache, sondern die
  eigentliche Arbeit.

---

## Zur Frage nach dem Prestige

Labi fragte, ob es „Kim-Kardashian-like" genug sei. Zwei Antworten.

**Praktisch:** Prestige entsteht dort nicht im Text — solche Bios sind meist fast
leer. Es entsteht aus **Konsistenz und Zurueckhaltung**: immer dieselbe
Bildsprache, nie erklaerend, nie bittend.

**Unbequem:** Dieses Register lebt davon, **gesehen zu werden**. Die Seite sagt in
zwei Abschnitten das Gegenteil. Gemeint ist vermutlich nicht Promi-Glanz, sondern
**Club-Zurueckhaltung** — der Raum, in den nicht jeder kommt. Das ist erreichbar
und passt zusammen; das andere wuerde den eigenen Text widerlegen.
