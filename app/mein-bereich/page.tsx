import type { ReactNode } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { ArrowRight, Check, Lock, MapPin, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Button from '@/components/Button';

export const metadata = {
  title: 'Mein Bereich — OneFam',
  description: 'Dein OneFam-Bereich: Auslosungs-Teilnahme und — als Käufer — die Reiseziel-Wahl.',
};

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
              Melde dich an, um deinen Bereich zu sehen — deine kostenlose Teilnahme an der Auslosung und, als Käufer, die
              Mitbestimmung über das nächste Reiseziel.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as="a" href="/join" variant="primary">
                Anmelden / kostenlos dabei sein
                <ArrowRight size={18} strokeWidth={1.5} />
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
                icon={<Check size={20} strokeWidth={1.5} className="text-gold" />}
                title="Auslosung — du bist dabei"
                body="Deine kostenlose Teilnahme an der nächsten Reise-Auslosung ist aktiv. Gleiche Chance für alle."
                tone="active"
              />
              <Card
                icon={<Lock size={20} strokeWidth={1.5} className="text-faint" />}
                title="Reiseziel-Wahl — Käufer-Extra"
                body="Das Mitbestimmen über das nächste Reiseziel ist ein Extra für Käufer. Dein Vorteil bei der Auslosung bleibt davon unberührt."
                tone="locked"
                cta={
                  <Button as="a" href="/" variant="secondary" className="mt-1 px-5 py-2.5 text-sm">
                    Käufer werden
                    <ArrowRight size={16} strokeWidth={1.5} />
                  </Button>
                }
              />
            </div>

            <p className="mt-6 max-w-[660px] font-body text-sm leading-relaxed text-faint">
              Hinweis: Die Reiseziel-Wahl ist ein Soft-Benefit und hat <span className="text-secondary">keinen</span>{' '}
              Einfluss auf deine Gewinnchance — die ist für alle gleich.
            </p>
          </>
        )}

        {/* ── BUYER: logged in + buyer ────────────────────────────────────── */}
        {state === 'buyer' && (
          <>
            <p className="mt-3 max-w-[660px] font-body text-lg leading-[1.7] text-secondary">
              Willkommen zurück. Hier bestimmst du mit, wohin die OneFam-Reise als Nächstes geht.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link
                href="/reiseziel"
                className="group relative col-span-full overflow-hidden rounded-[14px] border border-gold/40 bg-bg p-6 transition-colors duration-200 hover:border-gold sm:p-7"
                style={{ background: 'radial-gradient(120% 140% at 0% 0%, rgba(201,168,76,0.10), transparent 60%)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin size={18} strokeWidth={1.5} className="text-gold" />
                      <span className="font-body text-xs font-medium uppercase tracking-[0.18em] text-gold">
                        Käufer-Extra
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-2xl font-semibold text-primary">Reiseziel-Voting</h2>
                    <p className="mt-2 max-w-[460px] font-body text-base leading-relaxed text-secondary">
                      Stimme mit, wohin es geht — erst der Kontinent, dann das Land, dann der Ort. Jede Phase mit eigenem
                      Countdown.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 font-body text-sm font-medium text-gold">
                      Jetzt mitbestimmen
                      <ArrowRight size={16} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>

              <Card
                icon={<Check size={20} strokeWidth={1.5} className="text-gold" />}
                title="Auslosung — du bist dabei"
                body="Deine kostenlose Teilnahme an der nächsten Reise-Auslosung ist aktiv."
                tone="active"
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
