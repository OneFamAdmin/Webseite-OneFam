# onefam — Arbeitsanweisungen

Antworte auf **Deutsch**, in klaren kurzen Sätzen. Keine Anglizismen, wo es ein
deutsches Wort gibt.

Kurz halten: hier steht nur, was in **jeder** Sitzung gilt. Alles Ausführliche
liegt in `docs/` und wird von hier verlinkt.

---

## Die zwei Systeme

| | |
|---|---|
| **Brand-Site** | `onefam.ch` — Next.js 15, Repo `OneFamAdmin/Webseite-OneFam`, Branch `main`. **Jeder Push nach `main` deployt sofort auf Vercel.** Das ist dieses Verzeichnis. |
| **Shop** | `shop.onefam.ch` — WordPress, Divi, WooCommerce, Plugin Code Snippets, Produkte über **PodOS** (Print-on-Demand). Liegt **nicht** in diesem Repo. |

Sprachen sind **Deutsch, Englisch, Französisch, Spanisch** — *kein Italienisch*
(geprüft am 02.09.2026: `messages/{de,en,fr,es}.json`, `/it` ist keine Route).

Auf der Brand-Site sind aber **nur** Startseite, `/join` und die drei Rechtstexte
übersetzt; alles andere ist bewusst deutsch. Wo übersetzt wird, gilt: eine
Textänderung ist erst fertig, wenn alle vier Sprachen nachgezogen sind — ein
Commit je Sprache.

---

## Was Labi selbst macht — nie ohne ihn

* **Passwörter und Anmeldungen.** Nie tippen, nie vorschlagen, nie in eine Datei schreiben.
* **`git push`** und alles, was einen Deploy auslöst. **Vorher fragen, immer.**
* **Zugangsdaten in Vercel** (Umgebungsvariablen, Secrets) ändern oder löschen.
* **Bestellungen, Zahlungen, Testkäufe.**

Sonst gilt: so viel wie möglich selbst erledigen und nur melden, was Labi zwingend
selbst tun muss.

---

## Preise — nur eine gültige Quelle

| | Hoodie | Sweater | Shirt |
|---|---|---|---|
| **CHF** | 75 | 65 | 40 |
| **EUR** (Festpreis) | 69,99 | 59,99 | 34,95 |

Gilt für **alle** Produkte, Länder wie Logo-Linien, ohne Ausnahme.

**⛔ 82,50 / 71,50 / 44,00 ist kein Preis, sondern ein Fehlerbild.** So sieht es aus,
wenn der EUR-Festpreis auf einer Variation fehlt und hochgerechnet wird.

**Die WooCommerce-Store-API taugt zum Preismessen nicht** — sie zeigt immer den
umgerechneten Wert, auch für gesunde Produkte. Belastbar ist nur die
`wc/v3`-Schnittstelle **im eingeloggten wp-admin** (Nonce aus `wpApiSettings`) oder
die gerenderte Produktseite. Von aussen mit dem REST-Schlüssel gemessen liefert
`regular_price` ebenfalls den umgerechneten Wert — auch das ist eine Fehlmessung.

Zwei Dinge, die dabei immer mitzudenken sind:

- **Ein PodOS-Sync legt Variationen neu an und verliert die CURCY-Meta.** Dagegen
  hängt seit 18.08.2026 Snippet 89 „OneFam EUR-Festpreis-Waechter". Nach einem Sync
  trotzdem nachmessen.
- **Snippet 11 trägt die EUR-Preise als feste Zeichenketten** — im `feat`-Objekt der
  Startseite und in den Kacheln der Länderseiten, 18× je Wert. Ändern sich die
  EUR-Preise, müssen sie dort **von Hand** nachgezogen werden.

Vollständig: `docs/REGEL-preise.md`.

**Währung folgt dem Gerät, nicht dem Standort:** Zeitzone → IP-Land → Browsersprache.
Ein Schweizer in Deutschland soll CHF sehen — **Absicht, kein Fehler.** Die
Umschalter sind bewusst abgeschaltet. Mechanik und Testhinweise:
`docs/shop-und-pool-details.md`.

---

## Arbeitsregeln

1. **Vor dem Bauen nachsehen, ob es das schon gibt.** Der Shop hat 89 Snippets **und
   9 Plugins**. Für Währung, Preis-Festwerte, Kollektionspreise und HTTPS gibt es
   fertige Mechanismen. Doppelt gebaute Lösungen arbeiten gegeneinander. Am
   02.09.2026 wurde eine HTTPS-Umleitung von Hand in die `.htaccess` geschrieben —
   während „Easy HTTPS & SSL" installiert war und nur ein Speichern brauchte.
   **Und: ein gesetzter Haken in einem Plugin heisst nicht, dass es wirkt.**
   → `docs/shop-https.md`
2. **Messen, nicht raten.** Ausgeloggt messen, ohne Cache-Umgehung, ohne
   Query-Parameter — sonst misst man nicht das, was Besucher sehen.
3. **Bei „alle" auch alle prüfen**, nicht drei Stichproben. Und nie zweimal dieselbe.
4. **Ein Suchmuster ist erst ein Befund, wenn geprüft ist, dass es das Richtige trifft.**
5. **Bei einem Fehler, den ich nicht sehe, zuerst fragen: gibt es eine Seite, auf der
   es richtig aussieht?** Das löst mehr als jede weitere Messrunde.
6. **Bevor ein Fehler dem Zulieferer zugeschrieben wird, die Quelle messen.**
7. **Nichts auf der öffentlichen Seite darf etwas versprechen, das die AGB verneinen.**
8. **Snippets im Shop: der Formularknopf verwirft programmatisch gesetzten Code
   stillschweigend.** Der Editor ist React-gesteuert; wer den Inhalt per Skript setzt
   (`CodeMirror.setValue`, `textarea.value`, auch mit `cm.save()`), klickt danach ins
   Leere — dreimal geprüft am 02.09.2026, jedes Mal unverändert zurück.
   **Eine REST-Schnittstelle gibt es in dieser Plugin-Fassung nicht**
   (`/wp-json/code-snippets/v1/snippets` antwortet nicht); die ältere Anweisung, nur
   über REST zu speichern, geht also ins Leere. **Was funktioniert:** mit einem
   *echten Mausklick* in den Editor (Fokus!), die Stelle per `cm.setSelection()`
   markieren und mit einem *echten Tastendruck* löschen oder tippen — nur so sieht
   React die Änderung. Und bei 2,4 MB antwortet der Server mit leerem Rumpf: die
   Fehlermeldung sagt **nichts** darüber aus, ob gespeichert wurde. Immer die
   Zeichenlänge nach dem Neuladen nachprüfen **und** die Live-Seite messen.
9. **Kein JavaScript direkt in ein Code-Snippet.** Das Plugin schaltet den Snippet
   dann selbsttätig ab. CSS-only oder eigener Hook.
10. **Wer einen Produkt-Slug ändert, muss im Router-Snippet die fest verdrahteten
    Adressen nachziehen.** Die Preis-Zuordnung läuft über den Slug; eine 301 rettet
    den Besucher, aber nicht die Zuordnung. Belegt in `docs/shop-preisanzeige.md`.
11. **Bei Steuer- und Zollfragen zuerst in die Projektunterlagen sehen, nicht ins
    Gesetz.** Es liegen schriftliche Auskünfte von ESTV, BAZG und deutscher
    Zollverwaltung vor; sie beantworten mehr als man vermutet und widersprechen teils
    der eigenen Herleitung. → `docs/behoerden-mwst-zoll.md`
12. **Bei rechtlich heiklen Punkten** (Widerruf, AGB, Auswahl-Mechanik) nicht selbst
    entscheiden, sondern markieren und nachfragen.
13. Neue Methoden aus AI-Workflow-Videos werden gegen die bestehende Pipeline
    getestet, nicht auf Zuruf übernommen.

---

## Sprachregeln (rechtlich relevant — nicht abweichen)

Verwendete Begriffe: „Auswahl", „Jahreszyklus", „Entry", „Ausgewählt werden".

**Nie** Gewinnspiel-, Lotterie- oder Verlosungssprache. Kein „gewinnen",
„Verlosung", „Gewinnchance", „Teilnahme am Gewinnspiel", keine Glücks-Metaphern.
Der gesamte Launch-Text muss vor dem Livegang gegengelesen werden.

Wenn dir eine Formulierung einfällt, die in diese Richtung geht: nicht schreiben,
sondern nachfragen.

---

## Befehle

**Node ist nicht im PATH.** Jedem node/npm-Befehl voranstellen:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

| Aufgabe | Befehl |
|---|---|
| Dev-Server | Browser-Pane (`preview_start` mit `{name: "onefam-dev"}`), **nicht** Bash |
| Produktionsbau | `npm run build` |
| Lint · Typen | `npm run lint` · `npx tsc --noEmit` (beide sind sauber zu halten) |
| Ziehungs-Tests | `node lib/draw/engine.test.mjs` |
| Pool-Tests | `node --experimental-strip-types lib/pool/accounting.test.ts` |
| Abrechnungs-Tests | `node --experimental-strip-types lib/pool/abrechnung.test.ts` |

`*.test.ts` ist aus `tsconfig.json` ausgeschlossen, weil es mit expliziter
`.ts`-Endung importiert — das versteht nur node.

**Migrationen laufen über kein Skript.** Nummerierte Dateien in
`supabase/migrations/` werden im Supabase-SQL-Editor eingefügt oder über den
Supabase-MCP angewendet. Alle bisherigen sind additiv; **nie eine schon angewendete
ändern** — immer eine neue Nummer.

---

## Architektur

Next.js 15 App Router · React 19 · TypeScript strict · Tailwind v4 · Supabase ·
Vercel (`main` → Auto-Deploy). Pfad-Alias `@/*` → Repo-Wurzel.

### Middleware macht zwei Dinge, und die Reihenfolge zählt

`middleware.ts` erledigt Sprach-Routing **und** Supabase-Session in einem Durchlauf.
Zwei Fallen:

1. **Nie ein frisches `NextResponse.next()` bauen und zurückgeben** — das verwirft
   still die Sprach-Umschreibung von next-intl, und die ganze Seite fällt ohne
   Fehlermeldung auf Englisch zurück. Supabase-Cookies werden *auf* die
   intl-Antwort gesetzt.
2. **`OHNE_SPRACHE`** listet die Pfade ausserhalb von `app/[locale]/` (`/admin`,
   `/api`, `/auth`, `/login`, `/mein-bereich`, `/archiv`, `/join/bestaetigen`,
   `/dev`, `/design`) plus `DATEIEN_OHNE_SPRACHE` (`/sitemap.xml`, `/robots.txt`).
   Sie laufen weiter *durch* die Middleware (sie brauchen die Session), umgehen aber
   next-intl. Eine Seite übersetzen = unter `app/[locale]/` verschieben, Texte
   ergänzen **und** aus dieser Liste nehmen — sonst 404 oder unübersetzt.

### i18n

`next-intl`, Sprachen `en` (Standard, **ohne Präfix**) · `de` · `fr` · `es`. Die
Konfiguration steht vollständig in `i18n/routing.ts` — auch die Helfer `homePath`,
`joinPath`, `legalPath`, `shopUrl`; die benutzen statt Adressen zu tippen.

Es gibt **kein `app/page.tsx`**. Die präfixlose englische Seite kommt aus
`app/[locale]/page.tsx` über die interne Umschreibung `/` → `/en`.

Die Spracherkennung ist bewusst von Hand gebaut (`i18n/geo.ts`: Cookie →
nicht-englisches `Accept-Language` → Vercel-Länderkopf → Englisch), **nicht** die von
next-intl — daher `localeDetection: false`. Wieder einschalten hiesse zwei
konkurrierende Weiterleitungen.

Texte: `messages/<locale>.json`, in `i18n/request.ts` verschmolzen mit
`messages/legal/<locale>.json` unter dem Namensraum `legal`.

### Supabase und die Auth-Grenze

Drei Clients, und der falsche ist ein Sicherheitsfehler:

- `lib/supabase/client.ts` — Browser
- `lib/supabase/server.ts` — Server-Komponenten/Actions, **nutzergebunden**. Bewusst
  fürs Voting benutzt, damit RLS die Prüfung übernimmt: Käuferstatus, offene Runde,
  Frist — alles in SQL, nicht in TypeScript.
- `lib/supabase/admin.ts` — Service-Rolle, **umgeht RLS, nur serverseitig**. Nie aus
  einer `'use client'`-Datei importieren.

Der Admin-Zugang ist eine `user.email === process.env.ADMIN_EMAIL`-Prüfung **in jeder
Datei einzeln** — es gibt kein Middleware-Gate. Jede neue Datei unter `app/admin/`
muss selbst prüfen.

### Fachmodule

- **Ziehung** (`lib/draw/`) — `engine.mjs` ist rein und ohne Abhängigkeiten (`.mjs` +
  `.d.mts`, damit der Test unter blossem node läuft). Ziehungen sind aus
  `(entries, pool, refCost, randomness)` reproduzierbar und ohne E-Mails prüfbar.
- **Pool** (`lib/pool/`) — `accounting.ts` ist rein:
  `Marge = Brutto − COGS − Versand − Gebühren`, `Gutschrift = max(0, Marge) × Anteil`.
  Ein Verlustgeschäft belastet den Pool **nie**. `service.ts` schreibt
  `pool_ledger`-Zeilen, ein DB-Trigger bewegt `pool_state.amount_chf`.
  **Anteil: 10 % der Marge** (Migration `0013`) — bewusst ein Startwert, er steht in
  `cost_config.pool_share_pct` und nirgends im Code.
- **Monatsabrechnung** (`lib/pool/abrechnung.ts`, `/admin/pool/abrechnung`,
  Migration `0014`) — **`overhead_costs` schreibt nie ins `pool_ledger`.** Lohn,
  Hosting und Werbung sind Kosten des Unternehmens, nicht eines Verkaufs; zöge man
  sie ab, wäre die Zusage „ein Anteil am Gewinn geht in den Pool" eine andere als die
  gemachte. Ist ein Monat rot, behält der Pool alles. Test 3 in `abrechnung.test.ts`
  scheitert, wenn das jemand aufhebt.
- **WooCommerce** (`app/api/woo/webhook/route.ts` + `lib/woo/`) — HMAC-SHA256 base64
  über den **Rohtext** gegen `X-WC-Webhook-Signature`. Drei Abweichungen von Shopify,
  alle im Code begründet:
  1. **Kein `orders/paid`** — nur `order.created`/`order.updated`; bezahlt bzw.
     rückabgewickelt steht im Feld `status`.
  2. **Der Idempotenzschlüssel enthält den Status** (`order:<id>:<status>`). Ohne ihn
     würde eine spätere Retoure stillschweigend verschluckt.
  3. **Der Einrichtungs-Ping** trägt weder Signatur noch Thema und muss mit 200
     beantwortet werden — sonst wird der Webhook nie aktiv.
- **PodOS** (`lib/podos/client.ts`) — nur lesender COGS-Abgleich.

> **⚠️ Vorbehalt über der ganzen Kalkulation** (02.09.2026): Die Ware startet in
> Teltow, umsatzsteuerlich findet der Verkauf in **Deutschland** statt. Ob dort
> Registrierungspflicht besteht, ist **nicht geklärt**. Käme sie, wäre es nicht mit
> `supplier_vat_pct` getan — dann müsste auch der **Umsatz netto** gerechnet werden,
> und `creditPoolForOrder` bekommt heute die Bruttosumme als Ertrag. Für einen Hoodie
> nach DE: Marge 44.09 → 36.62, Pool 4.41 → 3.66. → `docs/behoerden-mwst-zoll.md`

### Design und Marke

- `lib/brand.ts` hält den Marken-Verlauf — einzige Quelle für Gesichtsmarke,
  Pool-Zahl und jeden „Join the Fam"-Knopf. Die Stufen nicht einbetten.
- `app/globals.css` definiert Palette und Schriften als CSS-Variablen, für Tailwind
  über `@theme inline` (`bg-bg`, `text-secondary`, `text-gold`, `font-display`,
  `font-body`). **Tokens benutzen, keine rohen Hex-Werte.**
- Hintergrund `#0A0A0A`, Gold `#C9A84C`. Cabinet Grotesk (Überschriften) + Satoshi
  (Fliesstext), lokal als woff2 über `next/font/local`. Mobile-first.
- **Nicht erwünscht:** Countdown-Timer, dekorative Verläufe, Glow, Orbs, Stockfotos.
  Der eine Marken-Verlauf ist die Ausnahme — Hintergrund in
  `docs/shop-und-pool-details.md`.
- Wortmarke **nach Höhe skalieren**, nie nach Breite. Seitenverhältnis 4,81:1,
  Strichstärke 17,5 Einheiten. Im Verbund sitzt sie auf **45 %** der Höhe der
  Gesichtsmarke.
- **SVG-Data-URIs ohne `width`/`height` versagen in iOS Safari** — echte Bilddatei
  nehmen.
- Bausteine: `MaxWidth` (1680 px), `Nav` (`ueberHero` nur auf der Startseite),
  `SectionBg`, `Reveal`.

### SEO

`SITE_URL` in `lib/seo.ts` ist absichtlich fest auf `https://onefam.ch` — aus der
Umgebung abgeleitet würde jede Vercel-Vorschau sich selbst als kanonisch ausgeben.
`next.config.ts` setzt `X-Robots-Tag: noindex` für jeden `*.vercel.app`-Host.

---

## Bildproduktion (Modellbilder, Mockups)

Läuft über Higgsfield. **Vollständiges Vorgehen für ein Land: `docs/RUNBOOK-laenderlauf.md`**
(Bildsatz, Sollfarben, Druckmasse, Dateinamen, Produkt verdrahten, Länderseite,
Aufräumen). Diese Regeln gelten immer und werden nicht neu verhandelt:

* **Keine Standbein-Posen.** Gewicht gleichmässig auf beiden Füssen, Hüfte gerade.
* **Keine Oberkörperdrehungen.** Brustkorb frontal zur Kamera, sonst sitzt der flach
  gestempelte Druck nicht.
* **Motive immer auf hellem und auf dunklem Stoff ansehen.** Auf Weiss verschwinden
  weisse Flaggenteile und damit die halbe Information.
* Druckdateien vor dem ersten Bild gegen den Illustrator-Master prüfen, **nie** gegen
  die SVG-Vorschau im Browser — die zeigt denselben Rotationsfehler und bestätigt ihn.
* Ländermodelle: Supermodel-Niveau, Ethnizität passend zum Land, Mann und Frau eines
  Paares dürfen **nicht wie Geschwister aussehen**.
* **Kein ByteDance-4K-Upscale** — schärft Gesichter, erfindet aber eine Rippenstruktur
  im Stoff.
* **Gesichter sind nicht austauschbar.** „Hohe Wangenknochen, gerade Nase, kantiger
  Kiefer, dunkles Haar" ist keine Ethnizität, sondern die Standard-Modellschablone.
  Vor dem Schreiben die Beschreibung des zuletzt gemachten Landes danebenlegen —
  decken sich mehr als zwei Merkmale, ist sie nicht fertig.
  → `docs/REGEL-gesichter.md`

---

## Aktueller Stand — vor Arbeit am Trichter lesen

Die Seite steht **trust-first**: die kostenlose Auswahl und das Käufer-Voting sind
gebaut und getestet, aber **bis zur rechtlichen Freigabe geparkt**. `/join` ist eine
schlichte Warteliste (`app/actions/join.ts` → `waitlist`, Migration `0008`),
`/reiseziel` ist **gelöscht**, während mehrere Verweise noch dorthin zeigen.
`HowItWorks`, `DestinationVote`, `JoinForm`, `CountUp`, `ReisezielVoting` liegen
absichtlich unbenutzt in `components/`. **Nicht als toten Code aufräumen** — das ist
der Weg zurück, beschrieben in `docs/handover-shop-pool.md`.

`/dev` und `/design` sind interne Vorschauen und müssen vor dem Launch weg.

---

## Konventionen

- Kommentare auf Deutsch, lang, und sie erklären **warum** — oft mit dem Datum der
  Änderung und dem, was das alte Verhalten kaputt gemacht hat. Wer eine solche
  Entscheidung ändert, **aktualisiert den Kommentar, statt ihn zu löschen**.
- Commit-Nachrichten auf Deutsch, reines ASCII (`ue`/`ae`/`oe`), beschreiben die
  Wirkung: `Kopfzeile: Verlauf statt Balken mit Kante`.
- Rechts- und Firmenangaben (Adresse, Telefon) stehen in `lib/schema.ts`, bewusst
  **nicht** in den Übersetzungen — sie dürfen nicht je Sprache abweichen.
- Geheimnisse gehören in `.env.local` und die Vercel-Variablen. `NEXT_PUBLIC_*`
  werden beim Bauen eingebacken — ändern heisst neu deployen.

---

## Offene Baustellen

- **Anfrage ans Finanzamt Konstanz** — nie gestellt, obwohl der deutsche Zoll
  ausdrücklich dorthin verweist. Entwurf im claude.ai-Projekt.
  → `docs/behoerden-mwst-zoll.md`
- **Ausführer-Vereinbarung mit Shirt-King** — schriftlich festzulegen, vor dem ersten
  echten Paket in ein Drittland.
- Footer-Branding-Zeile untergräbt die Premium-Wirkung
- Tote Links
- Pauschaler Ausschluss des Widerrufsrechts ist nach deutschem Verbraucherrecht
  vermutlich angreifbar — vor Launch prüfen lassen

---

## Beim Komprimieren

Immer erhalten: die vollständige Liste geänderter Dateien, offene Punkte mit Frist,
und **alle Messwerte, die in dieser Sitzung erhoben wurden**. Zusammenfassungen von
Messungen sind wertlos — die Zahlen selbst zählen.

## Stand und Übergaben

**Der aktuelle Arbeitsstand steht in `docs/stand.md`** — offene Punkte, was zuletzt
gemacht wurde, und die Fallen, die schon einmal Zeit gekostet haben. Vor grösseren
Aufgaben dort hineinsehen. Vor `/clear` oder `/compact` den Stand dorthin
fortschreiben.

| Datei | Inhalt |
|---|---|
| `docs/stand.md` | **Hier zuerst.** Offene Punkte, letzter Stand, bekannte Fallen |
| `docs/shop-und-pool-details.md` | WooCommerce-Bestand, Währungsmechanik, Kostenmodell, Versandstaffel |
| `docs/behoerden-mwst-zoll.md` | ESTV, BAZG, deutscher Zoll — was beantwortet ist, was fehlt |
| `docs/shop-preisanzeige.md` | Preis-Skript der Startseite, Slug-Falle, Speicher-Falle |
| `docs/shop-fusslinks.md` | Fusslinks ohne Sprachpraefix, doppelte Rechtsseiten |
| `docs/shop-https.md` | HTTPS erzwingen, Proxy-Falle, Web-FTP-Editor-Fehler |
| `docs/druck-und-lieferant.md` | DTG/DTF/Siebdruck, Shirt-King, PodOS-Zahlungsfehler |
| `docs/handover-shop-pool.md` | Übergabe Shop/Pool (teilweise überholt) |
| `docs/deploy-vercel.md` | Vercel-Projekt, Umgebungsvariablen |
| `docs/REGEL-preise.md` | Preise, Fehlerbild 82,50, richtige Messmethode |
| `docs/RUNBOOK-laenderlauf.md` | Ein Land komplett — Bild bis Länderseite |
| `docs/REGEL-gesichter.md` | Warum jedes Land eigene Gesichter braucht |
