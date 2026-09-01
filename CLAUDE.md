# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Node is not on PATH.** Prefix every node/npm command:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

| Task | Command |
|---|---|
| Dev server | Use the Browser pane (`preview_start` with `{name: "onefam-dev"}`, see `.claude/launch.json`) — not Bash. Manually: `npm run dev` (Next + Turbopack, port 3000) |
| Production build | `npm run build` |
| Lint | `npm run lint` |
| Typecheck | `npx tsc --noEmit` (both lint and tsc are expected to be clean) |
| Draw-engine tests | `node lib/draw/engine.test.mjs` — self-contained assertions, exits non-zero on failure. The only automated test suite in the repo. |

Migrations are **not** applied by any script. Numbered files in `supabase/migrations/` are pasted into the Supabase SQL editor by the user (or applied with the Supabase MCP `apply_migration`). Every migration so far is additive; never edit one that has already been applied — add a new numbered file.

## Architecture

Next.js 15 App Router · React 19 · TypeScript strict · Tailwind v4 · Supabase · deployed on Vercel (`main` → auto-deploy). Path alias `@/*` → repo root.

### Middleware does two jobs, and order matters

`middleware.ts` runs locale routing *and* Supabase session refresh in one pass. Two traps:

1. **Never build a fresh `NextResponse.next()` and return it** — that silently discards next-intl's locale rewrite and the whole site falls back to English with no error. Supabase cookies are *set onto* the intl response.
2. **`OHNE_SPRACHE`** lists the path prefixes that live outside `app/[locale]/` (`/admin`, `/api`, `/auth`, `/login`, `/mein-bereich`, `/archiv`, `/join/bestaetigen`, `/dev`, `/design`) plus `DATEIEN_OHNE_SPRACHE` (`/sitemap.xml`, `/robots.txt`). They still pass *through* the middleware (they need the session) but bypass next-intl. Translating a page = move it under `app/[locale]/`, add the messages, **and** remove it from this list — otherwise it 404s or stays untranslated.

### i18n

`next-intl`, locales `en` (default, **no prefix**) · `de` · `fr` · `es`, mirroring shop.onefam.ch's URL model. Config lives entirely in `i18n/routing.ts` (locale list, `localePrefix: 'as-needed'`, `localeDetection: false`, plus the `homePath`/`joinPath`/`legalPath`/`shopUrl` helpers — use these instead of hardcoding prefixed URLs).

There is **no `app/page.tsx`**. The prefix-less English site is served by `app/[locale]/page.tsx` through the internal `/` → `/en` rewrite. Only the home page, `/join` and the three legal pages are localised; everything else is German-only by design.

Locale detection is deliberately hand-rolled in `i18n/geo.ts` (cookie → non-English `Accept-Language` → Vercel country header → English), *not* next-intl's — hence `localeDetection: false`. Turning it back on would produce two competing redirects.

Messages: `messages/<locale>.json` merged in `i18n/request.ts` with `messages/legal/<locale>.json` under the `legal` namespace (legal texts change at a different rhythm and would swamp the main file). All four locales must be edited together — commits here are one language per commit.

### Supabase and the auth boundary

Three clients, and picking the wrong one is a security bug:

- `lib/supabase/client.ts` — browser.
- `lib/supabase/server.ts` — Server Components / Actions / Route Handlers, **user-scoped**. Used deliberately for voting (`app/actions/reiseziel.ts`) so RLS does the gating: buyer status, round open, deadline, option-belongs-to-round are all enforced in SQL, not in TypeScript.
- `lib/supabase/admin.ts` — service role, **bypasses RLS, server-only**. Never import from a `'use client'` file.

Admin access is an `user.email === process.env.ADMIN_EMAIL` check repeated in each admin page and action — there is no middleware gate. Any new file under `app/admin/` must do the check itself.

### Domain modules

- **Draw** (`lib/draw/`) — `engine.mjs` is pure and dependency-free (plain `.mjs` + `.d.mts` so it runs under bare `node` for the test); `drand.ts` fetches public League-of-Entropy randomness. Draws are reproducible from `(entries, pool, refCost, randomness)` and publish a commitment hash; the archive is verifiable without exposing e-mails.
- **Pool accounting** (`lib/pool/`) — `accounting.ts` is pure (`margin = gross − COGS − fees`, `credit = max(0, margin) × share`; a losing order never debits the pool, wages are never taken from it); `service.ts` writes `pool_ledger` rows and a DB trigger moves `pool_state.amount_chf`. Idempotent via a unique partial index on `pool_ledger(ref)`.
- **WooCommerce** (`app/api/woo/webhook/route.ts` + `lib/woo/`) — der Shop-Pfad seit dem 01.09.2026; der frühere Shopify-Code ist entfernt (es gibt keinen Shopify-Store mehr). HMAC-SHA256 base64 über den **Rohtext** gegen `X-WC-Webhook-Signature`, Käufer über die Bestell-E-Mail, ohne Konto → `pending_buyers`, befördert in `app/auth/callback/route.ts`. Drei Dinge weichen von Shopify ab und sind im Code kommentiert:
  1. **Kein `orders/paid`.** WooCommerce sendet nur `order.created`/`order.updated`; bezahlt/rückabgewickelt steht im Feld `status` (`processing`/`completed` bzw. `refunded`/`cancelled`/`failed`).
  2. **Der Idempotenzschlüssel enthält den Status** (`order:<id>:<status>`). Ohne ihn würde nur die erste Meldung je Bestellung verarbeitet und eine spätere Retoure stillschweigend verschluckt.
  3. **Der Einrichtungs-Ping** trägt weder Signatur noch Thema (Rumpf `webhook_id=<n>`) und muss mit 200 beantwortet werden — sonst lässt WooCommerce den Webhook gar nicht erst aktiv werden.
- **PodOS** (`lib/podos/client.ts`) — read-only COGS sync, ShirtKing's print backend.

### Design system

- `lib/brand.ts` holds the brand gradient — the single source for the logo mark, the pool number and every "Join the Fam" CTA. Don't inline the stops.
- `app/globals.css` defines the dark palette and fonts as CSS vars, exposed to Tailwind through `@theme inline` (`bg-bg`, `text-secondary`, `text-gold`, `font-display`, `font-body`) plus a set of custom breakpoints (`md-1`, `lg-2`, `xl-3`, …). Use the tokens, not raw hex.
- Fonts are local variable woff2 loaded via `next/font/local` in `app/layout.tsx` (Cabinet Grotesk = display, Satoshi = body).
- Shared primitives: `MaxWidth` (1680px + responsive padding), `Nav` (`ueberHero` on the home page only), `SectionBg`, `Reveal` (framer-motion, `MotionConfig reducedMotion="user"` from `layout/index.tsx`).

### SEO

`SITE_URL` in `lib/seo.ts` is hardcoded to `https://onefam.ch` on purpose — deriving it from the environment would make every Vercel preview declare itself canonical. `next.config.ts` adds `X-Robots-Tag: noindex` for any `*.vercel.app` host and redirects the retired `loco-motive.ch` domain.

## Current state — read before touching the funnel

The site is in a **trust-first** configuration: the free-entry draw and the buyer voting are built and tested but **parked pending legal sign-off**. `/join` is a plain waitlist (`app/actions/join.ts` → `waitlist` table, migration `0008`), `/reiseziel` has been **deleted** while several links and `revalidatePath('/reiseziel')` calls still point at it, and `HowItWorks`, `DestinationVote`, `JoinForm`, `CountUp`, `ReisezielVoting` are intentionally parked in `components/` unreferenced. Don't "clean up" these as dead code — they are the reactivation path, described in `docs/handover-shop-pool.md`.

`/dev` and `/design` are internal preview routes (map/face experiments) to be removed before the public launch.

## Conventions

- Comments are German, long, and explain **why** a decision was made — often with the date it changed and what the previous behaviour broke. When you change one of these decisions, update its comment rather than deleting it; that history is the reason the same bug hasn't been reintroduced.
- Commit messages are German, lower-case-ish, plain-ASCII (`ue`/`ae`/`oe` for umlauts), describing the effect: `Kopfzeile: Verlauf statt Balken mit Kante`.
- Legal/company facts (address, phone) live in `lib/schema.ts`, deliberately **not** in the translation files — they must not vary by language. Change them together with the Impressum.
- Secrets belong in `.env.local` (see `.env.local.example`) and Vercel env vars only. `NEXT_PUBLIC_*` are baked at build time — changing one requires a redeploy.

# onefam — Projektkontext

> Dieser Block gehört unter den von `/init` erzeugten technischen Teil.
> Kurz halten: hier stehen nur Fakten, die in **jeder** Session gebraucht werden.
> Lange Prozeduren (Länderlauf) gehören in einen Skill, nicht hierher.

> **Vorrang (01.09.2026):** Wo dieser Block dem technischen Teil oben widerspricht,
> gilt der technische Teil — er ist gegen den Code geprüft, dieser Block beschreibt
> teils einen älteren Planungsstand. Die betroffenen Stellen sind unten einzeln
> mit „**Stand:**" markiert.

## Was onefam ist

onefam ist eine bestehende Marke, Schweizer Einzelfirma — kein Greenfield-Projekt.
Kleidung plus Community. Der Shopify-Shop ist live; dieses Repo ist der Rebuild
der Webseite mit Shopify-Anbindung.

Daneben existiert die **Länderlinie** auf `shop.onefam.ch` (WooCommerce, separat
von diesem Repo): pro Land ein Hoodie, ein Sweater und ein Shirt, produziert über
PodOS auf Stanley/Stella-Blanks. Argentinien, Albanien, Afghanistan und Andorra
sind live.

> **Stand (01.09.2026, live geprüft + vom Inhaber bestätigt):** Stimmt —
> `shop.onefam.ch` ist **WordPress/WooCommerce** (Divi, Polylang, Plugin
> *CURCY — Multi Currency*, WooCommerce 10.9.4). **Einen Shopify-Store gibt es
> nicht mehr**; `docs/handover-shop-pool.md` und `docs/shopify-*.md`
> beschreiben ein abgeschaltetes System. WooCommerce ist per Webhook an
> **PodOS/ShirtKing** angebunden (Produktion), die Webseite hängt bisher an
> **nichts** davon.
>
> **Zugang für Claude:** REST-API v3 unter `https://shop.onefam.ch/wp-json/wc/v3/`,
> Basic-Auth mit `WOO_KEY`/`WOO_SECRET` aus `.env.local` (**nur Leserechte**).
> Ohne Schlüssel liefert die öffentliche Store-API (`/wp-json/wc/store/v1/`)
> bereits Katalog, Preise und Warenkorb-Verhalten.
>
> **Bestandsaufnahme (01.09.2026):**
> - 42 Produkte (18 `publish`, 24 `private`), alle `variable`
> - **Keine einzige SKU** — weder Produkt, Variante noch Bestellposition. Der
>   COGS-Zuordnungsschlüssel in `lib/pool/accounting.ts` (`product_costs.sku`)
>   läuft damit garantiert ins Leere. Einziger stabiler Schlüssel: `product_id`.
> - 5 Bestellungen (4 storniert, 1 `processing`), **gemischte Währungen CHF und
>   EUR** — die Pool-Rechnung kennt bisher nur eine Währung, hier fehlt eine
>   Umrechnung auf CHF.
> - 0 Kunden mit Konto (Gastbestellungen) → Käufer-Erkennung muss wie beim
>   Shopify-Entwurf über die **E-Mail** der Bestellung laufen, nicht über Konten.
> - Bestellpositionen tragen `variation_id = 0`, Grösse/Farbe stehen nur im
>   `name` („Argentina Shirt - XS, Black"). Ungewöhnlich für ein variables
>   Produkt — vermutlich Folge des eigenen Warenkorb-Handlers
>   (`of_warenkorb_hinzu`). **Vor der Portierung prüfen, ob PodOS daraus die
>   richtige Variante ableitet.**
> - 3 Webhooks: zwei auf `connector.api.podos.io` (einer aktiv, einer doppelt und
>   deaktiviert), einer deaktiviert auf `onefam/v1/whlog-…`. **Beim Anlegen eines
>   eigenen Webhooks den aktiven PodOS-Hook nicht anfassen.**

## Travel Pool

Der Live-Zähler zeigt den **Nettoumsatz nach Kosten** (Shopify, Hosting, Domains,
Arcads) — nicht den Bruttoumsatz. Animiert.

- Die Detail-Aufschlüsselung sehen **nur Käufer**.
- Gating passiert **serverseitig über den Shopify App Proxy**, nie clientseitig.
- Datenbasis ist ein Postgres-Ledger, per Shopify-Webhooks synchronisiert,
  plus stündlicher Snapshot-Job.
- **Kein Countdown.** Nirgends.

> **Stand:** Gebaut ist das anders — und das Gebaute gilt. Käufer-Gating läuft über
> **Supabase-RLS + `buyers`-Tabelle**, die Ledger-Zuschreibung über **Shopify-Webhooks**
> (`app/api/shopify/webhook`, Ledger `pool_ledger` in Supabase/Zürich, Migration `0007`).
> **Kein App Proxy, kein Snapshot-Job.** Der Live-Zähler ist im Trust-first-Stand
> ausgebaut (`CountUp` geparkt) — es gibt derzeit gar keine öffentliche Pool-Zahl.
> Der Grundsatz „Gating nie clientseitig" gilt unverändert.
>
> Zum Countdown: `components/Countdown.tsx` liegt ungenutzt im Repo, die geparkte
> gestufte Abstimmung arbeitet aber pro Phase mit einer Frist (Text „Countdown" in
> `/admin/voting` und `/mein-bereich`). Öffentlich sichtbar ist keiner.

## Sprachregeln (rechtlich relevant — nicht abweichen)

Verwendete Begriffe: „Auswahl", „Jahreszyklus", „Entry", „Ausgewählt werden".

**Nie** Gewinnspiel-, Lotterie- oder Verlosungssprache. Kein „gewinnen",
„Verlosung", „Gewinnchance", „Teilnahme am Gewinnspiel", keine Glücks-Metaphern.
Der gesamte Launch-Text muss vor dem Livegang gegengelesen werden.

Wenn dir eine Formulierung einfällt, die in diese Richtung geht: nicht schreiben,
sondern nachfragen.

## Design-System

- Hintergrund `#0A0A0A`
- Gold-Akzent `#C9A84C`
- Schriften: Cabinet Grotesk (Headlines) + Satoshi (Fließtext)
- Mobile-first

Ausdrücklich nicht erwünscht: Countdown-Timer, Gradients, Glow-/Orb-Effekte,
Stockfotos. Wenn ein Platzhalterbild nötig ist, lieber eine flache Fläche als
ein Stockfoto.

> **Stand:** „Keine Gradients" gilt so **nicht mehr**. Der Marken-Verlauf aus
> `lib/brand.ts` (`BRAND_GRADIENT`, Gold → Orange → Pink → Magenta → Violett) ist
> bewusst gesetzt und trägt Gesichtsmarke, Pool-Zahl und jeden „Join the Fam"-Knopf;
> die Kopfzeile blendet seit `b539cef` mit einem Verlauf aus, statt mit einer Kante
> abzuschliessen. Aktiv in `Nav`, `Hero`, `FinalCta`, `TravelPool`, `WhyWeDoThis`.
> Gemeint ist die Regel heute enger: **keine dekorativen Verläufe, kein Glow, keine
> Orbs** — der eine Marken-Verlauf ist die Ausnahme und kommt immer aus `lib/brand.ts`.
> Gold `#C9A84C` und Hintergrund `#0A0A0A` stimmen unverändert (`app/globals.css`).

## Preise

Die Basispreise sind in **CHF** und korrekt. Ungerade EUR-Beträge im Shop sind
nur das Währungs-Plugin, das mit Faktor 1.1 umrechnet — kein Bug, nicht
„korrigieren".

> **Stand (01.09.2026):** So funktioniert die Währungswahl im WooCommerce-Shop —
> nachgemessen, weil CHF-Preise auf einer deutschen Leitung erschienen:
>
> 1. Ein Inline-Skript liest **`Intl.DateTimeFormat().resolvedOptions().timeZone`**
>    und setzt das Cookie `of_geo=ch` bei `Europe/Zurich|Vaduz|Busingen`, sonst
>    `of_geo=x` — Laufzeit **ein Jahr**, danach einmal `location.reload()`.
> 2. Der Server setzt daraufhin `wmc_current_currency`: mit `of_geo=ch` → **CHF**,
>    sonst nach IP → für deutsche IPs **EUR**.
>
> **`of_geo` schlägt die IP.** Ein Mac mit Schweizer Zeitzone sieht CHF, egal in
> welchem Land er surft — das ist der Grund, warum die Preise auf einer deutschen
> Leitung in CHF erscheinen und im Kopf „CHF Fr." steht. Für echte deutsche Kunden
> (Zeitzone `Europe/Berlin`) greift korrekt EUR. Beim Testen der EU-Ansicht also
> **Cookie `of_geo` löschen** oder ein Gerät mit passender Zeitzone nehmen —
> ein privates Fenster allein genügt nicht, das Skript setzt `of_geo` sofort neu.

## Ländermodelle (Bildproduktion)

- Supermodel-Niveau
- Ethnizität passend zum jeweiligen Land
- Mann und Frau eines Paares dürfen **nicht wie Geschwister aussehen**
- Kein ByteDance-4K-Upscale: schärft Gesichter, erfindet aber eine Rippenstruktur
  im Stoff

## Offene Baustellen

- Footer-Branding-Zeile untergräbt die Premium-Wirkung
- Tote Links
- **Shop, Startseite: Kopf sagt „CHF Fr.", die Produktkarten zeigen EUR** (belegt
  01.09.2026). Ursache: Das Karten-Skript leitet die Kategorie aus dem Slug der
  **ersten** Karte ab; die heisst `albanian-hoodie` statt `albania-hoodie`, also
  fragt es `/wp-json/onefam/v1/cat-prices?category=albanian` ab → `[]` → die Preise
  werden nie umgeschrieben und der EUR-Fallback aus dem HTML bleibt stehen.
  Fix: entweder den Produkt-Slug auf `albania-hoodie` korrigieren (mit 301 auf den
  alten) oder die Kategorie nicht aus dem Slug raten.
- Plattform-Inkonsistenz: WooCommerce/Divi neben Shopify
- Pauschaler Ausschluss des Widerrufsrechts ist nach deutschem Verbraucherrecht
  vermutlich angreifbar — vor Launch prüfen lassen

## Arbeitsweise

- Bei rechtlich heiklen Punkten (Widerruf, AGB, Auswahl-Mechanik) nicht selbst
  entscheiden, sondern markieren und nachfragen.
- Neue Methoden aus AI-Workflow-Videos werden gegen die bestehende Pipeline
  getestet, nicht auf Zuruf übernommen.

## Noch zu ergänzen

- ~~Framework und Build-Befehle~~ → steht oben unter „Commands".
- ~~Liegt das Backend mit Postgres-Ledger in diesem Repo oder separat?~~ → **In diesem
  Repo.** Es gibt keinen eigenen Backend-Dienst: das Ledger ist Supabase-Postgres
  (Projekt `yemcjottasfsdahzsjie`, Region eu-central-2 Zürich), Migrationen unter
  `supabase/migrations/`, Schreibpfad `app/api/shopify/webhook` + `lib/pool/`.
  Einen App Proxy gibt es nicht.
- ~~Deployment~~ → Vercel-Projekt `webseite-one-fam` (Team `one-fam-admin-s-projects`),
  Production-Branch **`main`**, Repo `OneFamAdmin/Webseite-OneFam`, Push auf `main`
  deployt automatisch. Details: `docs/deploy-vercel.md`.
- **Offen:** Hosting-Entscheidung Backend (Hetzner vs. IONOS) — durch die Supabase-Lösung
  aktuell gegenstandslos; nur relevant, falls doch ein eigener Dienst dazukommt.
- ~~Währungsanzeige im Shop für EU-Besucher~~ → geklärt, siehe „Preise": die
  Zeitzone entscheidet, nicht die IP. Offen bleibt nur die Entscheidung, **ob**
  die Zeitzone die IP weiterhin überstimmen soll.
