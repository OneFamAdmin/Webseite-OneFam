import type { ReactNode } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { ArrowRight, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Button from '@/components/Button';
import { pageMetadata } from '@/lib/seo';

// noindex: persönlicher Bereich. Der Inhalt hängt am eingeloggten Konto,
// ein Suchtreffer darauf wäre für jeden anderen leer.
export const metadata = pageMetadata({
  title: 'Mein Bereich — OneFam',
  description: 'Dein OneFam-Bereich.',
  path: '/mein-bereich',
  noindex: true,
});

// guest = logged out · visitor = logged in, NOT a buyer · buyer = logged in + buyer
type State = 'guest' | 'visitor' | 'buyer';

export default async function MeinBereichPage({
  searchParams,
}: {
  searchParams: Promise<{ as?: string }>;
}) {
  const sp = await searchParams;

  let state: State = 'guest';
  let name = '';
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: b } = await supabase.from('buyers').select('user_id').eq('user_id', user.id).maybeSingle();
      state = b ? 'buyer' : 'visitor';
      name = (user.email?.split('@')[0] ?? '').replace(/\b\w/g, (c) => c.toUpperCase());
    }
  } catch {
    // never crash the page on an auth/db hiccup — fall back to the guest view
  }

  // DEV-ONLY preview switch so the look of every state can be reviewed without logging in.
  // e.g. /mein-bereich?as=buyer — ignored entirely in production.
  if (process.env.NODE_ENV === 'development' && sp.as && ['guest', 'visitor', 'buyer'].includes(sp.as)) {
    state = sp.as as State;
    if (!name && state !== 'guest') name = 'Gast';
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 md:py-16">
        <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">Mein Bereich</p>
        <h1 className="mt-2 font-display text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[0.02em] text-primary">
          {state === 'guest' ? 'Willkommen bei der Fam' : `Hey ${name || 'du'} 👋`}
        </h1>

        {/* ── GUEST: logged out ───────────────────────────────────────────── */}
        {state === 'guest' && (
          <>
            <p className="mt-3 max-w-[640px] font-body text-lg leading-[1.7] text-secondary">
              Melde dich an, um deinen Bereich zu sehen — als Käufer wartet dort später die Reiseziel-Wahl auf dich.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as="a" href="/login" variant="primary">
                Anmelden
                <ArrowRight size={18} strokeWidth={1.5} />
              </Button>
              <Button as="a" href="/join" variant="secondary">
                Auf die Warteliste
              </Button>
            </div>
          </>
        )}

        {/* ── VISITOR: logged in, not a buyer ─────────────────────────────── */}
        {state === 'visitor' && (
          <>
            <p className="mt-3 max-w-[660px] font-body text-lg leading-[1.7] text-secondary">
              Schön, dass du da bist. Hier ist dein Überblick.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card
                icon={<Sparkles size={20} strokeWidth={1.5} className="text-faint" />}
                title="Travel Pool — in Vorbereitung"
                body="Die gemeinsame Reise ist unser Ziel, noch nicht unser Angebot. Du hörst von uns, sobald es so weit ist."
                tone="soon"
              />
              <Card
                icon={<Sparkles size={20} strokeWidth={1.5} className="text-faint" />}
                title="Reiseziel-Wahl — in Vorbereitung"
                body="Das Mitbestimmen über das nächste Reiseziel ist als Käufer-Extra geplant."
                tone="soon"
                cta={
                  <Button as="a" href="/" variant="secondary" className="mt-1 px-5 py-2.5 text-sm">
                    Käufer werden
                    <ArrowRight size={16} strokeWidth={1.5} />
                  </Button>
                }
              />
            </div>
          </>
        )}

        {/* ── BUYER: logged in + buyer ────────────────────────────────────── */}
        {state === 'buyer' && (
          <>
            <p className="mt-3 max-w-[660px] font-body text-lg leading-[1.7] text-secondary">
              Willkommen zurück. Hier ist dein Überblick — und alles, was als Käufer dazukommt.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {/* Hier stand bis zum 08.09.2026 eine grosse Goldkachel "Reiseziel-Voting",
                  die auf /reiseziel verlinkte. Diese Route ist beim Umschwenken auf
                  trust-first (20.07.2026) geloescht worden — der Link lief seitdem auf
                  einen 404, und zwar ausgerechnet fuer eingeloggte Kaeufer, also fuer
                  die Leute, die schon gekauft haben. Aufgefallen ist es erst, weil beim
                  Aufraeumen nach Verweisen auf die geloeschte Route gesucht wurde.

                  Statt den Link zu flicken steht hier jetzt eine Karte ohne Ziel: das
                  Voting ist gebaut und getestet, aber bis zur rechtlichen Freigabe
                  geparkt. Eine Kachel, die "Jetzt mitbestimmen" verspricht, waere
                  genau das, was Arbeitsregel 7 verbietet.

                  Der Weg zurueck: Kachel wieder als <Link href="/reiseziel"> aufbauen,
                  sobald app/[locale]/reiseziel wieder existiert. Die Bausteine dafuer
                  liegen unangetastet in components/ (ReisezielVoting, VotingDesignMap)
                  und app/actions/reiseziel.ts — siehe docs/handover-shop-pool.md. */}
              <Card
                icon={<Sparkles size={20} strokeWidth={1.5} className="text-faint" />}
                title="Reiseziel-Voting — in Vorbereitung"
                body="Als Käufer bestimmst du später mit, wohin die OneFam-Reise geht — erst der Kontinent, dann das Land, dann der Ort. Wir sagen dir Bescheid, sobald die Runde offen ist."
                tone="soon"
              />

              <Card
                icon={<Sparkles size={20} strokeWidth={1.5} className="text-faint" />}
                title="Travel Pool — in Vorbereitung"
                body="Die gemeinsame Reise ist unser Ziel, noch nicht unser Angebot. Du hörst von uns, sobald es so weit ist."
                tone="soon"
              />
              <Card
                icon={<Sparkles size={20} strokeWidth={1.5} className="text-faint" />}
                title="Weitere Käufer-Extras"
                body="Bald mehr an dieser Stelle."
                tone="soon"
              />
            </div>
          </>
        )}

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-line pt-6">
            <span className="font-body text-xs uppercase tracking-[0.14em] text-faint">Vorschau (nur Dev):</span>
            {(['guest', 'visitor', 'buyer'] as const).map((s) => (
              <Link
                key={s}
                href={`/mein-bereich?as=${s}`}
                className={`rounded-[6px] border px-3 py-1.5 font-body text-xs transition-colors ${
                  state === s ? 'border-gold text-gold' : 'border-line text-secondary hover:text-primary'
                }`}
              >
                {s === 'guest' ? 'Ausgeloggt' : s === 'visitor' ? 'Nicht-Käufer' : 'Käufer'}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Card({
  icon,
  title,
  body,
  cta,
  tone,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  cta?: ReactNode;
  tone: 'active' | 'locked' | 'soon';
}) {
  return (
    <div
      className={`flex flex-col rounded-[14px] border bg-bg p-6 ${
        tone === 'active' ? 'border-gold/30' : 'border-line'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {icon}
        <h3 className="font-display text-lg font-semibold text-primary">{title}</h3>
      </div>
      <p className="mt-2.5 flex-1 font-body text-[15px] leading-relaxed text-secondary">{body}</p>
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}
