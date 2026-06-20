'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import VotingDesignMap, { type DesignOption } from '@/components/VotingDesignMap';
import { castStagedVote } from '@/app/reiseziel/actions';

type Props = {
  roundId: string;
  level: 'continent' | 'country' | 'place';
  options: DesignOption[];
  faces?: boolean;
  landIsos?: string[];
  heroIso?: string;
  faceStyle?: 'color' | 'none' | 'gold';
  /** The option code the buyer has already voted for in this round (or null). */
  initialSelected?: string | null;
};

// Buyer-facing voting surface: the premium map made clickable. Tapping an option saves the vote
// (the staged `votes` table, RLS-gated to buyers + open round + before deadline) and the choice can
// be changed until the phase deadline. The selection updates instantly; the numeric tallies refresh
// softly afterwards (no realtime — a reload also shows them, per the agreed model).
export default function ReisezielVoting({
  roundId,
  level,
  options,
  faces,
  landIsos,
  heroIso,
  faceStyle,
  initialSelected = null,
}: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(initialSelected);
  const [pending, setPending] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'error'; msg?: string }>({ kind: 'idle' });
  const [, startTransition] = useTransition();

  const labelOf = (code: string) => options.find((o) => o.code === code)?.label ?? code;

  async function vote(code: string) {
    if (pending || code === selected) return; // ignore re-tapping the current choice / double-clicks
    setPending(code);
    setStatus({ kind: 'idle' });
    const res = await castStagedVote(roundId, code);
    if (res.ok) {
      setSelected(code);
      setStatus({ kind: 'ok', msg: labelOf(code) });
      startTransition(() => router.refresh()); // pull fresh tallies without a full reload
    } else {
      setStatus({
        kind: 'error',
        msg:
          res.error === 'not-allowed'
            ? 'Abstimmen ist gerade nicht möglich — die Phase ist beendet oder dein Käufer-Zugang fehlt.'
            : res.error === 'not-logged-in'
              ? 'Bitte melde dich an, um abzustimmen.'
              : 'Konnte nicht gespeichert werden. Bitte versuch es noch einmal.',
      });
    }
    setPending(null);
  }

  return (
    <>
      <VotingDesignMap
        level={level}
        options={options}
        faces={faces}
        landIsos={landIsos}
        heroIso={heroIso}
        faceStyle={faceStyle}
        votable
        selectedCode={selected}
        pendingCode={pending}
        onSelect={vote}
      />

      <div className="mx-auto mt-10 max-w-[640px] text-center" aria-live="polite">
        {status.kind === 'ok' ? (
          <p className="font-body text-base" style={{ color: '#E2BF6A' }}>
            ✓ Gespeichert: <span className="font-medium">{status.msg}</span> — du kannst deine Stimme bis zum Phasenende
            jederzeit ändern.
          </p>
        ) : status.kind === 'error' ? (
          <p className="font-body text-base text-red-400">{status.msg}</p>
        ) : selected ? (
          <p className="font-body text-base text-secondary">
            Deine Wahl: <span className="font-medium text-primary">{labelOf(selected)}</span>. Tippe ein anderes Ziel an,
            um zu wechseln.
          </p>
        ) : (
          <p className="font-body text-base text-secondary">
            Du bist Käufer — tippe dein Reiseziel direkt auf der Karte an. Du kannst deine Stimme bis zum Phasenende
            jederzeit ändern.
          </p>
        )}
      </div>
    </>
  );
}
