// Homepage teaser for the destination vote. Server component: reads the live
// continent tallies and renders the world map + current leader + a CTA into
// /reiseziel. Renders nothing until at least one vote exists.

import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { CONTINENTS } from '@/lib/geo/data';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';
import Button from './Button';
import VoteMap, { type MapOption } from './VoteMap';

export default async function DestinationVote() {
  let tallies: { continent: string; votes: number }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc('continent_tallies');
    tallies = (data ?? []).map((r: { continent: string; votes: number }) => ({
      continent: r.continent,
      votes: Number(r.votes),
    }));
  } catch {
    return null;
  }

  const total = tallies.reduce((s, t) => s + t.votes, 0);
  if (total === 0) return null;

  const tallyByKey = new Map(tallies.map((t) => [t.continent, t.votes]));
  const options: MapOption[] = CONTINENTS.map((c) => ({
    id: c.key,
    label: c.label,
    code: c.key,
    lat: c.lat,
    lng: c.lng,
    vote_count: tallyByKey.get(c.key) ?? 0,
  }));
  const leader = [...options].sort((a, b) => b.vote_count - a.vote_count)[0];

  return (
    <section id="reiseziel" className="relative overflow-hidden border-t border-line py-24 md:py-32">
      <MaxWidth className="flex flex-col items-center text-center">
        <Reveal>
          <p className="font-body text-sm uppercase tracking-[0.1em] text-faint">Reiseziel-Voting</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-4 max-w-[760px] font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.1] tracking-[0.01em] text-primary">
            Wohin reisen wir als Nächstes?
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-4 max-w-[560px] font-body text-lg leading-relaxed text-secondary">
            Die Community entscheidet gemeinsam.{' '}
            {leader.vote_count > 0 && (
              <>
                Aktuell vorne: <span className="font-medium text-gold">{leader.label}</span>.
              </>
            )}
          </p>
        </Reveal>

        <Reveal delay={0.18} className="mt-10 w-full">
          <div className="mx-auto max-w-[760px] overflow-hidden rounded-[14px] border border-line bg-bg/60 p-2 sm:p-4">
            <VoteMap level="continent" options={options} height={420} />
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
