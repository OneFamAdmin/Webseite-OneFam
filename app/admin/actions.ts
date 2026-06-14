'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { fetchLatestDrand } from '@/lib/draw/drand';
import { runDraw } from '@/lib/draw/engine.mjs';

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Nicht autorisiert.');
  }
  return user;
}

const currentYear = () => new Date().getFullYear();

export async function setPool(formData: FormData) {
  await assertAdmin();
  const amount = Number(formData.get('amount'));
  const refCost = Number(formData.get('refCost'));
  if (!Number.isFinite(amount) || amount < 0) throw new Error('Pool-Betrag ungültig.');
  if (!Number.isFinite(refCost) || refCost <= 0) throw new Error('Reisekosten ungültig.');

  const admin = createAdminClient();
  const { error } = await admin.from('pool_state').upsert({
    year: currentYear(),
    amount_chf: amount,
    ref_cost_chf: refCost,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  revalidatePath('/admin');
}

export async function runDrawAction() {
  await assertAdmin();
  const year = currentYear();
  const admin = createAdminClient();

  const { data: pool } = await admin
    .from('pool_state')
    .select('amount_chf, ref_cost_chf')
    .eq('year', year)
    .maybeSingle();
  if (!pool) throw new Error('Bitte zuerst den Pool setzen.');

  const { data: entries } = await admin.from('entries').select('id, user_id, group_size').eq('year', year);
  if (!entries || entries.length === 0) throw new Error('Noch keine Teilnehmer für dieses Jahr.');

  const { round, randomness } = await fetchLatestDrand();

  const result = await runDraw({
    entries: entries.map((e) => ({ id: e.id, groupSize: e.group_size })),
    poolChf: Number(pool.amount_chf),
    refCostChf: Number(pool.ref_cost_chf),
    randomnessHex: randomness,
  });

  // attach opt-in display names to the winners (snapshot for the public archive)
  const userByEntry = new Map<string, string>(entries.map((e) => [e.id, e.user_id]));
  const winnerUserIds = result.winners
    .map((w) => userByEntry.get(w.id))
    .filter((id): id is string => Boolean(id));
  const nameByUser = new Map<string, string>();
  if (winnerUserIds.length) {
    const { data: profs } = await admin
      .from('profiles')
      .select('user_id, display_name')
      .in('user_id', winnerUserIds);
    for (const p of profs ?? []) if (p.display_name) nameByUser.set(p.user_id, p.display_name);
  }
  const winnersWithNames = result.winners.map((w) => ({
    ...w,
    displayName: nameByUser.get(userByEntry.get(w.id) ?? '') ?? null,
  }));

  const { error } = await admin.from('draws').insert({
    year,
    pool_chf: pool.amount_chf,
    ref_cost_chf: pool.ref_cost_chf,
    winner_count: result.winnerCount,
    rollover_chf: result.rolloverChf,
    commitment: result.commitment,
    drand_round: round,
    randomness,
    sealed_entries: result.sealedEntries,
    winners: winnersWithNames,
    seats_funded: result.seatsFunded,
  });
  if (error) throw new Error(error.message);

  revalidatePath('/archiv');
  revalidatePath('/admin');
}
