# Deploy auf Vercel — Klick-für-Klick

Der Code wird bei jedem Push auf `origin/main` (Repo `OneFamAdmin/Webseite-OneFam`) von Vercel
automatisch gebaut. Damit die App funktioniert, müssen die 8 Umgebungsvariablen in Vercel gesetzt
sein. **Die Werte stehen in deiner lokalen `.env.local`** — von dort kopieren (außer SITE_URL).

> Keys sind geheim — nur in Vercel/.env, nie in Chat/Code.

---

## 1. Umgebungsvariablen in Vercel setzen

Vercel → dein Projekt → **Settings** → **Environment Variables**. Jede Zeile anlegen, **Environments:
Production + Preview** ankreuzen, **Save**.

| Variable | Wert |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | aus `.env.local` kopieren |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | aus `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | aus `.env.local` |
| `DRAND_CHAIN_URL` | aus `.env.local` |
| `ADMIN_EMAIL` | aus `.env.local` (`josefgnther@gmail.com`) |
| `RESEND_API_KEY` | aus `.env.local` |
| `EMAIL_FROM` | aus `.env.local` (Resend-Test-Sender; später `info@onefam.ch`) |
| `NEXT_PUBLIC_SITE_URL` | ⚠️ **NICHT** localhost — die **Vercel-Prod-Adresse** (z.B. `https://webseite-onefam.vercel.app` oder später `https://onefam.ch`) |

⚠️ `NEXT_PUBLIC_*` werden **beim Build eingebacken** → nach dem Setzen/Ändern **neu deployen**.

---

## 2. Neu deployen

Vercel → **Deployments** → das neueste → **⋯** → **Redeploy**. (Nach jeder Änderung an einer
`NEXT_PUBLIC_*`-Variable nötig.)

---

## 3. Supabase-URLs auf die Prod-Adresse umstellen

Sonst funktionieren die Login-/Magic-Links nicht.
Supabase → **Authentication** → **URL Configuration**:
- **Site URL** = deine Prod-Adresse (z.B. `https://webseite-onefam.vercel.app`)
- **Redirect URLs** = dieselbe Adresse + `/**` (z.B. `https://webseite-onefam.vercel.app/**`)

---

## 4. Testen (auf der Prod-Adresse)

- Startseite lädt, Hero + „So funktioniert" + Footer.
- `/join` → E-Mail eintragen → Magic-Link kommt (im Resend-Test nur an die Account-Mail).
- `/admin/voting` → als Admin (`josefgnther@gmail.com`) eingeloggt sichtbar.
- `/reiseziel` → Karte lädt.

---

## Domain & später

- Eigene Domain `onefam.ch`: Vercel → Settings → Domains → hinzufügen (DNS beim Registrar setzen).
  Danach `NEXT_PUBLIC_SITE_URL` + Supabase-URLs auf `https://onefam.ch` umstellen + neu deployen.
- `EMAIL_FROM` auf `info@onefam.ch` erst, wenn die Domain in Resend verifiziert ist.
- Shopify-Webhooks zeigen später auf `https://<prod-adresse>/api/shopify/webhook`.

> Hinweis: Solange noch keine echte Ziehung freigegeben ist (Anwalt), bleibt die Seite zwar live,
> aber es wird keine echte Auslosung mit Preisen durchgeführt.
