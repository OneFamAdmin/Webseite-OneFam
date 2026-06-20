'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { CONTINENTS, countriesByContinent, placesByCountry } from '@/lib/geo/data';

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

type AdminClient = ReturnType<typeof createAdminClient>;

/** Look up an auth user by e-mail (case-insensitive). Returns null if none. */
async function findUserByEmail(admin: AdminClient, email: string) {
  const target = email.trim().toLowerCase();
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw new Error(error.message);
  return data.users.find((u) => (u.email ?? '').toLowerCase() === target) ?? null;
}

const currentYear = () => new Date().getFullYear();

function revalidateVoting() {
  revalidatePath('/admin/voting');
  revalidatePath('/reiseziel');
  revalidatePath('/');
}

/** Parse a datetime-local form value → ISO; must be a valid future instant. */
function parseDeadline(raw: string): string {
  const t = new Date(raw);
  if (Number.isNaN(t.getTime())) throw new Error('Bitte ein gültiges Enddatum wählen.');
  if (t.getTime() <= Date.now()) throw new Error('Das Enddatum muss in der Zukunft liegen.');
  return t.toISOString();
}

// ── Buyer management ─────────────────────────────────────────────────────────
export async function grantBuyer(formData: FormData) {
  await assertAdmin();
  const email = String(formData.get('email') ?? '').trim();
  if (!email) throw new Error('Bitte eine E-Mail angeben.');

  const admin = createAdminClient();
  const user = await findUserByEmail(admin, email);
  if (!user) {
    throw new Error('Kein Nutzer mit dieser E-Mail. Die Person muss sich zuerst bei OneFam anmelden.');
  }
  const { error } = await admin.from('buyers').upsert({ user_id: user.id, source: 'manual' }, { onConflict: 'user_id' });
  if (error) throw new Error(error.message);
  revalidateVoting();
}

export async function revokeBuyer(formData: FormData) {
  await assertAdmin();
  const userId = String(formData.get('userId') ?? '');
  if (!userId) throw new Error('userId fehlt.');
  const admin = createAdminClient();
  const { error } = await admin.from('buyers').delete().eq('user_id', userId);
  if (error) throw new Error(error.message);
  revalidateVoting();
}

// ── Staged campaign state machine ────────────────────────────────────────────
type OptionRow = { code: string; label: string; lat: number | null; lng: number | null };

function nextLevelOf(level: string): 'country' | 'place' | null {
  return level === 'continent' ? 'country' : level === 'country' ? 'place' : null;
}

/** The next stage's title + options, scoped by the winning option of the stage that just closed. */
function nextRoundSpec(closedLevel: string, winnerCode: string, winnerLabel: string) {
  const level = nextLevelOf(closedLevel);
  if (!level) return null;
  if (level === 'country') {
    return {
      level,
      title: `Welches Land in ${winnerLabel}?`,
      rows: countriesByContinent(winnerCode).map<OptionRow>((c) => ({
        code: c.iso,
        label: c.label,
        lat: c.lat ?? null,
        lng: c.lng ?? null,
      })),
    };
  }
  return {
    level,
    title: `Welcher Ort in ${winnerLabel}?`,
    rows: placesByCountry(winnerCode).map<OptionRow>((p) => ({ code: p.code, label: p.label, lat: p.lat, lng: p.lng })),
  };
}

/** Open a new round with its options. parentId is null for the first (continent) round. */
async function openRound(
  admin: AdminClient,
  year: number,
  level: string,
  title: string,
  rows: OptionRow[],
  parentId: string | null,
  closesAt: string,
) {
  if (rows.length === 0) throw new Error('Keine Optionen für diese Phase gefunden.');
  const { data: round, error } = await admin
    .from('poll_rounds')
    .insert({ year, level, title, status: 'open', parent_round_id: parentId, closes_at: closesAt })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  const { error: oErr } = await admin.from('poll_options').insert(rows.map((r) => ({ ...r, round_id: round.id })));
  if (oErr) throw new Error(oErr.message);
  return round.id as string;
}

/** Find the current open round (≤1 per year by the partial unique index). */
async function getOpenRound(admin: AdminClient, year: number) {
  const { data, error } = await admin
    .from('poll_rounds')
    .select('id, level, title')
    .eq('year', year)
    .eq('status', 'open')
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

/** Close the open round, returning the chosen winning option. Winner = admin override (winnerCode)
 *  else the top vote_count (ties broken by which option was created first). */
async function closeOpenRound(admin: AdminClient, year: number, overrideCode: string) {
  const round = await getOpenRound(admin, year);
  if (!round) throw new Error('Es läuft gerade keine Phase.');

  const { data: opts, error: oErr } = await admin
    .from('poll_options')
    .select('id, code, label, vote_count, created_at')
    .eq('round_id', round.id);
  if (oErr) throw new Error(oErr.message);
  if (!opts || opts.length === 0) throw new Error('Diese Phase hat keine Optionen.');

  const sorted = [...opts].sort((a, b) => b.vote_count - a.vote_count || (a.created_at < b.created_at ? -1 : 1));
  const winner = (overrideCode && opts.find((o) => o.code === overrideCode)) || sorted[0];

  const { error: cErr } = await admin
    .from('poll_rounds')
    .update({ status: 'closed', winner_option_id: winner.id, updated_at: new Date().toISOString() })
    .eq('id', round.id);
  if (cErr) throw new Error(cErr.message);

  return { round, winner };
}

/** Start a brand-new campaign: open the continent round. Only valid when no rounds exist this year. */
export async function startContinentRound(formData: FormData) {
  await assertAdmin();
  const closesAt = parseDeadline(String(formData.get('closesAt') ?? ''));
  const admin = createAdminClient();
  const year = currentYear();

  const { data: existing, error } = await admin.from('poll_rounds').select('id').eq('year', year).limit(1);
  if (error) throw new Error(error.message);
  if (existing && existing.length) {
    throw new Error('Für dieses Jahr läuft bereits eine Kampagne. Erst zurücksetzen, um neu zu starten.');
  }

  await openRound(
    admin,
    year,
    'continent',
    'Welcher Kontinent?',
    CONTINENTS.map<OptionRow>((c) => ({ code: c.key, label: c.label, lat: c.lat, lng: c.lng })),
    null,
    closesAt,
  );
  revalidateVoting();
}

/** Close the current (continent OR country) phase and immediately open the next, scoped by the winner. */
export async function closeAndAdvance(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();
  const year = currentYear();
  const nextClosesAt = parseDeadline(String(formData.get('nextClosesAt') ?? ''));

  const { round, winner } = await closeOpenRound(admin, year, String(formData.get('winnerCode') ?? '').trim());
  const spec = nextRoundSpec(round.level, winner.code, winner.label);
  if (!spec) throw new Error('Diese Phase ist die letzte — bitte „Kampagne abschließen“ verwenden.');

  await openRound(admin, year, spec.level, spec.title, spec.rows, round.id, nextClosesAt);
  revalidateVoting();
}

/** Close the final (place) phase — the destination is decided, no further round opens. */
export async function closeFinalRound(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();
  const year = currentYear();
  const { round } = await closeOpenRound(admin, year, String(formData.get('winnerCode') ?? '').trim());
  if (nextLevelOf(round.level)) {
    throw new Error('Diese Phase ist nicht die letzte — bitte „schließen & weiter“ verwenden.');
  }
  revalidateVoting();
}

/** Recovery: a phase was closed but the next never opened — seed the next stage from the last winner. */
export async function advanceToNext(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();
  const year = currentYear();
  const closesAt = parseDeadline(String(formData.get('nextClosesAt') ?? ''));

  if (await getOpenRound(admin, year)) throw new Error('Es läuft bereits eine Phase.');

  const { data: last, error } = await admin
    .from('poll_rounds')
    .select('id, level, winner_option_id')
    .eq('year', year)
    .eq('status', 'closed')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!last) throw new Error('Keine abgeschlossene Phase gefunden.');
  if (!last.winner_option_id) throw new Error('Der letzten Phase fehlt ein Gewinner.');

  const { data: win, error: wErr } = await admin
    .from('poll_options')
    .select('code, label')
    .eq('id', last.winner_option_id)
    .single();
  if (wErr) throw new Error(wErr.message);

  const spec = nextRoundSpec(last.level, win.code, win.label);
  if (!spec) throw new Error('Die Kampagne ist bereits abgeschlossen.');

  await openRound(admin, year, spec.level, spec.title, spec.rows, last.id, closesAt);
  revalidateVoting();
}

/** Wipe the whole campaign for the year (rounds → cascades options + votes). Start over. */
export async function resetCampaign() {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('poll_rounds').delete().eq('year', currentYear());
  if (error) throw new Error(error.message);
  revalidateVoting();
}
