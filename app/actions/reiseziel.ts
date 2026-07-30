'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * Cast — or change — the current user's vote in a staged round (0005 model).
 *
 * We deliberately use the USER's server client (not the service role) so that the RLS
 * policies do the gating for us: the voter must be a buyer, the round must be open, and
 * now() must be before its deadline, and the option must belong to the round. A buyer has
 * exactly one (changeable) vote per round — enforced by the unique (round_id, user_id)
 * constraint, which the upsert rides on; the bump_vote_count trigger moves the tally when
 * the choice changes. Voting is a buyer SOFT-BENEFIT and never touches the free draw.
 */
export async function castStagedVote(
  roundId: string,
  code: string,
): Promise<{ ok: boolean; error?: 'not-logged-in' | 'unknown-option' | 'not-allowed' | 'failed' }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'not-logged-in' };

  // Resolve the option id for (round, code). poll_options is public-read.
  const { data: opt, error: optErr } = await supabase
    .from('poll_options')
    .select('id')
    .eq('round_id', roundId)
    .eq('code', code)
    .maybeSingle();
  if (optErr) return { ok: false, error: 'failed' };
  if (!opt) return { ok: false, error: 'unknown-option' };

  const { error } = await supabase.from('votes').upsert(
    { round_id: roundId, option_id: opt.id, user_id: user.id, updated_at: new Date().toISOString() },
    { onConflict: 'round_id,user_id' },
  );
  if (error) {
    // The RLS policy rejects non-buyers, closed/expired rounds, foreign options, etc.
    const rls = /row-level security|violates|policy/i.test(error.message);
    return { ok: false, error: rls ? 'not-allowed' : 'failed' };
  }

  revalidatePath('/reiseziel');
  revalidatePath('/');
  return { ok: true };
}
