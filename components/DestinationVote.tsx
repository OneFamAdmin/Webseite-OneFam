// Homepage teaser for the staged destination vote. Server component: reads the current OPEN
// round (continent / country / place) via the current_round RPC and renders the world map +
// the current leader + a CTA into /reiseziel. Renders nothing when no round is open, so the
// homepage stays clean before a campaign starts.

import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';
import Button from './Button';
import VoteMap, { type MapOption } from './VoteMap';

const STAGE: Record<string, string> = {
  continent: 'Stufe 1 · Kontinent',
  country: 'Stufe 2 · Land',
  place: 'Stufe 3 · Ort',
};

type RoundOption = { code: string; label: string; lat: number | null; lng: number | null; votes: number };

export default async function DestinationVote() {
  let level: string | null = null;
  let title = '';
  let raw: RoundOption[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc('current_round', { p_year: new Date().getFullYear() });
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.round_id) return null;
    level = row.level;
    title = row.title;
    raw = (row.options ?? []) as RoundOption[];
  } catch {
    return null;
  }
  if (!level) return null;

  const options: MapOption[] = raw.map((o) => ({
    id: o.code,
    label: o.label,
    code: o.code,
    lat: o.lat != null ? Number(o.lat) : null,
    lng: o.lng != null ? Number(o.lng) : null,
    vote_count: Number(o.votes ?? 0),
  }));
  const leader = [...options].sort((a, b) => b.vote_count - a.vote_count)[0];

  return (
    <section id="reiseziel" className="relative overflow-hidden border-t border-line py-24 md:py-32">
      <MaxWidth className="flex flex-col items-center text-center">
        <Reveal>
          <p className="font-body text-sm uppercase tracking-[0.1em] text-faint">Reiseziel-Voting · {STAGE[level] ?? ''}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-4 max-w-[760px] font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.1] tracking-[0.01em] text-primary">
            {title || 'Wohin reisen wir als Nächstes?'}
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-4 max-w-[560px] font-body text-lg leading-relaxed text-secondary">
            Die Community entscheidet gemeinsam.{' '}
            {leader && leader.vote_count > 0 && (
              <>
                Aktuell vorne: <span className="font-medium text-gold">{leader.label}</span>.
              </>
            )}
          </p>
        </Reveal>

        <Reveal delay={0.18} className="mt-10 w-full">
          <div className="mx-auto max-w-[760px] overflow-hidden rounded-[14px] border border-line bg-bg/60 p-2 sm:p-4">
            <VoteMap level={level} options={options} height={420} />
          </div>
        </Reveal>

        <Reveal delay={0.24} className="mt-10">
          <Button as="a" href="/reiseziel" variant="primary">
            Jetzt mitbestimmen
            <ArrowRight size={18} strokeWidth={1.5} />
          </Button>
        </Reveal>
      </MaxWidth>
    </section>
  );
}
