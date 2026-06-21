import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import VotingDesignMap, { type DesignOption } from '@/components/VotingDesignMap';
import ReisezielVoting from '@/components/ReisezielVoting';
import Countdown from '@/components/Countdown';
import { CONTINENTS, countriesByContinent, placesByCountry, continentByKey, countryByIso } from '@/lib/geo/data';

export const metadata = {
  title: 'Reiseziel-Voting — OneFam',
  description: 'Stimme mit, wohin die nächste OneFam-Reise geht — Kontinent, Land, Ort. Jede Phase mit eigenem Countdown.',
};

type Level = 'continent' | 'country' | 'place';
type PhaseView = {
  level: Level;
  eyebrow: string;
  title: string;
  options: DesignOption[];
  landIsos?: string[];
  faces?: boolean;
  heroIso?: string;
  closesAt: string;
  roundId?: string; // present only for a REAL open round (then voting is live)
};

const DAY = 86_400_000;
// descending demo tallies so there's always a clear leader to admire
const demoVotes = (n: number, top = 9200) =>
  Array.from({ length: n }, (_, i) => Math.round((top - i * (top / (n + 2))) * (0.88 + ((i * 37) % 13) / 50)));

function demoPhase(which: Level, c?: string): PhaseView {
  const now = Date.now();
  if (which === 'country') {
    const contKey = c && CONTINENTS.some((x) => x.key === c) ? c : 'asia';
    const cs = countriesByContinent(contKey);
    const v = demoVotes(cs.length);
    return {
      level: 'country',
      eyebrow: 'Stufe 2 · Land',
      title: continentByKey(contKey)?.label ?? 'Asien',
      faces: true,
      landIsos: cs.map((x) => x.iso),
      options: cs.map((x, i) => ({ label: x.label, code: x.iso, votes: v[i], lat: x.lat, lng: x.lng })),
      closesAt: new Date(now + 88 * DAY).toISOString(),
    };
  }
  if (which === 'place') {
    const iso = c && placesByCountry(c).length ? c : '724';
    const ps = placesByCountry(iso);
    const v = demoVotes(ps.length, 14000);
    return {
      level: 'place',
      eyebrow: 'Stufe 3 · Ort',
      title: countryByIso(iso)?.label ?? 'Spanien',
      heroIso: iso,
      landIsos: [iso],
      options: ps.map((p, i) => ({ label: p.label, code: p.code, votes: v[i], lat: p.lat, lng: p.lng })),
      closesAt: new Date(now + 33 * DAY).toISOString(),
    };
  }
  const v = demoVotes(CONTINENTS.length, 6400);
  return {
    level: 'continent',
    eyebrow: 'Stufe 1 · Kontinent',
    title: 'Wohin als Nächstes?',
    options: CONTINENTS.map((c, i) => ({ label: c.label, code: c.key, votes: v[i], lat: c.lat, lng: c.lng })),
    closesAt: new Date(now + 47 * DAY).toISOString(),
  };
}

// Map a real open round (from the current_round RPC) onto the view model.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function realPhase(row: any): PhaseView {
  const level = row.level as Level;
  const options: DesignOption[] = (row.options ?? []).map((o: DesignOption) => ({
    label: o.label,
    code: o.code,
    votes: Number(o.votes ?? 0),
    lat: o.lat != null ? Number(o.lat) : undefined,
    lng: o.lng != null ? Number(o.lng) : undefined,
  }));
  return {
    level,
    eyebrow: level === 'continent' ? 'Stufe 1 · Kontinent' : level === 'country' ? 'Stufe 2 · Land' : 'Stufe 3 · Ort',
    title: row.title,
    options,
    faces: level === 'country',
    landIsos: level === 'country' ? options.map((o) => o.code!).filter(Boolean) : level === 'place' ? undefined : undefined,
    closesAt: new Date(row.closes_at).toISOString(),
    roundId: row.round_id,
  };
}

export default async function ReisezielPage({ searchParams }: { searchParams: Promise<{ demo?: string; c?: string }> }) {
  const sp = await searchParams;
  const year = new Date().getFullYear();

  let user: { id: string } | null = null;
  let isBuyer = false;
  let phase: PhaseView | null = null;
  let myVote: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    user = u ? { id: u.id } : null;
    if (u) {
      const { data: b } = await supabase.from('buyers').select('user_id').eq('user_id', u.id).maybeSingle();
      isBuyer = Boolean(b);
    }
    const { data } = await supabase.rpc('current_round', { p_year: year });
    const row = Array.isArray(data) ? data[0] : data;
    if (row?.round_id) phase = realPhase(row);

    // Place stage: tell the map WHICH country to draw — the parent (country) round's winner.
    // current_round doesn't return the scope, so resolve it: place round → parent country round
    // → its winner option's code (= country ISO). Without heroIso the map can't zoom and renders
    // the whole world (the ?demo= preview masked this because it sets heroIso directly).
    if (phase?.level === 'place' && phase.roundId) {
      const { data: pr } = await supabase
        .from('poll_rounds')
        .select('parent_round_id')
        .eq('id', phase.roundId)
        .maybeSingle();
      const parentId = (pr?.parent_round_id as string | null) ?? null;
      if (parentId) {
        const { data: parent } = await supabase
          .from('poll_rounds')
          .select('winner_option_id')
          .eq('id', parentId)
          .maybeSingle();
        const winId = (parent?.winner_option_id as string | null) ?? null;
        if (winId) {
          const { data: opt } = await supabase.from('poll_options').select('code').eq('id', winId).maybeSingle();
          if (opt?.code) {
            phase.heroIso = opt.code as string;
            phase.landIsos = [opt.code as string];
          }
        }
      }
    }

    // The buyer's existing vote for this round (RLS: select-own), so the map shows their choice.
    if (phase?.roundId && u) {
      const { data: v } = await supabase
        .from('votes')
        .select('poll_options(code)')
        .eq('round_id', phase.roundId)
        .maybeSingle();
      const rel = (v as { poll_options?: { code?: string } | { code?: string }[] } | null)?.poll_options;
      const opt = Array.isArray(rel) ? rel[0] : rel;
      myVote = opt?.code ?? null;
    }
  } catch {
    // no DB / not migrated yet → fall through to the demo or empty state
  }

  // DEV-ONLY preview of each phase with demo data, so the look can be reviewed before the
  // staged rounds go live. Ignored entirely in production.
  const demoReq = process.env.NODE_ENV === 'development' && sp.demo;
  if (!phase && demoReq && ['continent', 'country', 'place'].includes(sp.demo!)) {
    phase = demoPhase(sp.demo as Level, sp.c);
  }

  // Live voting requires a REAL open round (roundId), a logged-in user, AND buyer status.
  const canVote = Boolean(phase?.roundId && user && isBuyer);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" aria-label="OneFam — Home" className="flex items-center gap-2.5">
            <img src="/assets/logo-face-gradient.svg" alt="" aria-hidden="true" className="h-7 w-7" />
            <Image src="/assets/logo-white.png" alt="OneFam" width={216} height={75} priority className="h-6 w-auto" />
          </Link>
          <Link href="/mein-bereich" className="font-body text-sm text-secondary transition-colors duration-[180ms] hover:text-primary">
            Mein Bereich
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {phase ? (
          <section
            className="relative overflow-hidden px-6 py-14 md:py-16"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 0%, #1a1326 0%, #0a0a0a 55%), radial-gradient(80% 60% at 100% 100%, rgba(120,60,160,0.18), transparent 60%)',
            }}
          >
            <div className="mx-auto max-w-[1100px] text-center">
              <p className="font-body text-xs uppercase tracking-[0.32em] text-gold">{phase.eyebrow}</p>
              <h1
                className="mx-auto mt-3 font-display font-semibold uppercase text-primary"
                style={{ fontSize: 'clamp(2rem,5vw,3.4rem)', letterSpacing: '0.03em', color: '#EBD9A6' }}
              >
                {phase.title}
              </h1>
              <div className="mx-auto mt-6 flex justify-center">
                <Countdown deadline={phase.closesAt} label="Diese Phase endet in" />
              </div>
            </div>

            {/* premium map: full-width on large screens (cap raised so 4K/5K fill fuller). Buyers in
                a live round get the CLICKABLE map (ReisezielVoting); everyone else sees it read-only.
                Stufe 3 (Ort): KEIN Gesicht ins Land legen — nur Goldland + Marker. Stufe 2 (Land)
                behält die Flaggen-Gesichter als Embleme. */}
            <div className="mx-auto mt-10 w-full max-w-[3000px]">
              {canVote ? (
                <ReisezielVoting
                  roundId={phase.roundId!}
                  level={phase.level}
                  options={phase.options}
                  faces={phase.faces}
                  landIsos={phase.landIsos}
                  heroIso={phase.heroIso}
                  faceStyle={phase.level === 'place' ? 'none' : 'color'}
                  initialSelected={myVote}
                />
              ) : (
                <VotingDesignMap
                  level={phase.level}
                  options={phase.options}
                  faces={phase.faces}
                  landIsos={phase.landIsos}
                  heroIso={phase.heroIso}
                  faceStyle={phase.level === 'place' ? 'none' : 'color'}
                />
              )}
            </div>

            {/* state-aware call to action — buyers in a live round get their status from the voting
                surface above, so a CTA only shows when the visitor can't vote (yet). */}
            {!canVote && (
              <div className="mx-auto mt-10 max-w-[640px] text-center">
                {!user ? (
                  <CTA
                    text="Melde dich an, um mitzustimmen — Käufer bestimmen das Reiseziel mit."
                    href="/mein-bereich"
                    label="Anmelden"
                  />
                ) : !isBuyer ? (
                  <CTA
                    text="Mitbestimmen ist ein Käufer-Extra. Deine Gewinnchance bei der Auslosung bleibt für alle gleich."
                    href="/mein-bereich"
                    label="Zu meinem Bereich"
                  />
                ) : (
                  <p className="font-body text-sm text-faint">
                    Vorschau — die echte Abstimmung startet, sobald die erste Phase eröffnet ist.
                  </p>
                )}
              </div>
            )}
          </section>
        ) : (
          <section className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col items-center justify-center px-6 text-center">
            <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">Reiseziel-Voting</p>
            <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-semibold text-primary">Bald geht&apos;s los.</h1>
            <p className="mt-4 font-body text-lg leading-[1.7] text-secondary">
              Die nächste Abstimmung über das OneFam-Reiseziel startet in Kürze. Schau bald wieder vorbei.
            </p>
            <Link
              href="/mein-bereich"
              className="mt-8 inline-flex items-center gap-2 font-body text-sm font-medium text-gold hover:text-gold-hover"
            >
              Zu meinem Bereich
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </section>
        )}

        {process.env.NODE_ENV === 'development' && (
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6 py-6">
            <span className="font-body text-xs uppercase tracking-[0.14em] text-faint">Vorschau (nur Dev):</span>
            {(['continent', 'country', 'place'] as const).map((d) => (
              <Link
                key={d}
                href={`/reiseziel?demo=${d}`}
                className={`rounded-[6px] border px-3 py-1.5 font-body text-xs transition-colors ${
                  phase?.level === d && !phase?.roundId
                    ? 'border-gold text-gold'
                    : 'border-line text-secondary hover:text-primary'
                }`}
              >
                {d === 'continent' ? 'Kontinent' : d === 'country' ? 'Land (Asien)' : 'Ort (Spanien)'}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function CTA({ text, href, label }: { text: string; href: string; label: string }) {
  return (
    <>
      <p className="font-body text-base leading-relaxed text-secondary">{text}</p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-2 rounded-[4px] bg-gold px-7 py-3.5 font-body text-base font-medium text-bg transition-[transform,background-color] duration-[180ms] hover:scale-[1.02] hover:bg-gold-hover"
      >
        {label}
        <ArrowRight size={18} strokeWidth={1.5} />
      </Link>
    </>
  );
}
