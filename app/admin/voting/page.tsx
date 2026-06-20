import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Flag, Trophy, CalendarClock, RotateCcw, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  grantBuyer,
  revokeBuyer,
  startContinentRound,
  closeAndAdvance,
  closeFinalRound,
  advanceToNext,
  resetCampaign,
} from './actions';

export const metadata = { title: 'Voting — Admin — OneFam' };

const LEVEL_LABEL: Record<string, string> = { continent: 'Kontinent', country: 'Land', place: 'Ort' };
const STAGE_NO: Record<string, string> = { continent: 'Stufe 1 / 3', country: 'Stufe 2 / 3', place: 'Stufe 3 / 3' };
const nextLevelOf = (level: string) => (level === 'continent' ? 'country' : level === 'country' ? 'place' : null);

const pad = (n: number) => String(n).padStart(2, '0');
function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())} Uhr`;
}
function toLocalInput(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type Round = {
  id: string;
  level: string;
  title: string;
  status: string;
  winner_option_id: string | null;
  opens_at: string;
  closes_at: string;
  parent_round_id: string | null;
  created_at: string;
};

export default async function AdminVotingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/join');
  if (user.email !== process.env.ADMIN_EMAIL) redirect('/');

  const admin = createAdminClient();
  const year = new Date().getFullYear();

  const roundsRes = await admin
    .from('poll_rounds')
    .select('id, level, title, status, winner_option_id, opens_at, closes_at, parent_round_id, created_at')
    .eq('year', year)
    .order('created_at', { ascending: true });

  const migrationMissing = Boolean(
    roundsRes.error &&
      (roundsRes.error.code === 'PGRST205' ||
        roundsRes.error.code === '42P01' ||
        /does not exist|schema cache|could not find the table/i.test(roundsRes.error.message ?? '')),
  );
  if (migrationMissing) return <MigrationNotice email={user.email!} />;

  const rounds = (roundsRes.data ?? []) as Round[];
  const openRound = rounds.find((r) => r.status === 'open') ?? null;
  const closedRounds = rounds.filter((r) => r.status === 'closed');
  const lastClosed = closedRounds.length ? closedRounds[closedRounds.length - 1] : null;

  // standings for the open round
  let openOptions: { code: string; label: string; vote_count: number }[] = [];
  if (openRound) {
    const { data } = await admin
      .from('poll_options')
      .select('code, label, vote_count')
      .eq('round_id', openRound.id)
      .order('vote_count', { ascending: false });
    openOptions = data ?? [];
  }

  // winner labels for closed rounds
  const winnerIds = closedRounds.map((r) => r.winner_option_id).filter(Boolean) as string[];
  const winnerLabel = new Map<string, string>();
  if (winnerIds.length) {
    const { data } = await admin.from('poll_options').select('id, label').in('id', winnerIds);
    for (const o of data ?? []) winnerLabel.set(o.id, o.label);
  }

  // buyers + emails
  const [buyersRes, usersRes] = await Promise.all([
    admin.from('buyers').select('user_id, source, created_at').order('created_at', { ascending: false }),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);
  const emailByUser = new Map<string, string>();
  for (const u of usersRes.data?.users ?? []) emailByUser.set(u.id, u.email ?? '—');
  const buyers = (buyersRes.data ?? []).map((b) => ({ ...b, email: emailByUser.get(b.user_id) ?? '(unbekannt)' }));

  // campaign state
  const state: 'none' | 'open' | 'between' | 'done' = !rounds.length
    ? 'none'
    : openRound
      ? 'open'
      : lastClosed && nextLevelOf(lastClosed.level)
        ? 'between'
        : 'done';

  const totalVotes = openOptions.reduce((s, o) => s + o.vote_count, 0);
  const leaderVotes = openOptions[0]?.vote_count ?? 0;
  const defClose = toLocalInput(new Date(Date.now() + 120 * 86_400_000)); // ~4 months per stage

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" aria-label="OneFam — Home" className="flex items-center gap-2.5">
            <img src="/assets/logo-face-gradient.svg" alt="" aria-hidden="true" className="h-7 w-7" />
            <Image src="/assets/logo-white.png" alt="OneFam" width={216} height={75} priority className="h-6 w-auto" />
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 font-body text-sm text-secondary transition-colors duration-[180ms] hover:text-primary"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            Zurück zum Admin
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:py-16">
        <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">Reiseziel-Voting {year}</p>
        <h1 className="mt-2 font-display text-[clamp(1.8rem,4vw,2.5rem)] font-semibold tracking-[0.02em] text-primary">
          Kampagne steuern
        </h1>
        <p className="mt-2 font-body text-sm text-faint">
          Gestufte Abstimmung: Kontinent → Land → Ort. Pro Phase ein Countdown; am Ende gewinnt die führende Option und
          legt die nächste Phase fest. Käufer stimmen auf{' '}
          <Link href="/reiseziel" className="text-gold hover:text-gold-hover">
            /reiseziel
          </Link>{' '}
          ab.
        </p>

        {/* ── Campaign state machine ── */}
        <section className="mt-8 rounded-[10px] border border-line bg-surface p-6">
          <div className="flex items-center gap-2">
            <Flag size={18} strokeWidth={1.6} className="text-gold" />
            <h2 className="font-display text-xl font-semibold text-primary">Phase</h2>
          </div>

          {/* progress chain */}
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-sm">
            {(['continent', 'country', 'place'] as const).map((lvl, i) => {
              const closed = closedRounds.find((r) => r.level === lvl);
              const isOpen = openRound?.level === lvl;
              const win = closed?.winner_option_id ? winnerLabel.get(closed.winner_option_id) : null;
              return (
                <span key={lvl} className="inline-flex items-center gap-2">
                  {i > 0 && <ChevronRight size={14} className="text-faint" />}
                  <span
                    className={
                      isOpen ? 'text-gold' : win ? 'text-primary' : 'text-faint'
                    }
                  >
                    {LEVEL_LABEL[lvl]}
                    {win ? `: ${win}` : isOpen ? ' · läuft' : ''}
                  </span>
                </span>
              );
            })}
          </div>

          {state === 'none' && (
            <div className="mt-6">
              <p className="font-body text-sm leading-relaxed text-secondary">
                Noch keine Kampagne für {year}. Starte die erste Phase (Kontinent) — die sechs Kontinente werden als
                Optionen gesetzt.
              </p>
              <form action={startContinentRound} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <DeadlineField name="closesAt" label="Phase endet am" def={defClose} />
                <SubmitBtn>Kampagne starten</SubmitBtn>
              </form>
            </div>
          )}

          {state === 'open' && openRound && (
            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-lg font-semibold text-primary">
                  <span className="text-gold">{STAGE_NO[openRound.level]}</span> · {openRound.title}
                </span>
                <span className="inline-flex items-center gap-1.5 font-body text-sm text-secondary">
                  <CalendarClock size={15} strokeWidth={1.6} className="text-faint" />
                  endet {fmtDateTime(openRound.closes_at)}
                </span>
              </div>

              {/* live standings */}
              <p className="mt-4 font-body text-xs uppercase tracking-[0.16em] text-faint">
                Zwischenstand · {totalVotes} {totalVotes === 1 ? 'Stimme' : 'Stimmen'}
              </p>
              <ul className="mt-2 space-y-1.5">
                {openOptions.map((o, i) => {
                  const isLeader = i === 0 && o.vote_count > 0;
                  const share = leaderVotes > 0 ? (o.vote_count / leaderVotes) * 100 : 0;
                  return (
                    <li
                      key={o.code}
                      className="relative flex items-center justify-between overflow-hidden rounded-[6px] border border-line px-3 py-1.5 font-body text-sm"
                    >
                      <span className="absolute inset-y-0 left-0" style={{ width: `${share}%`, background: 'rgba(201,168,76,0.10)' }} />
                      <span className={`relative ${isLeader ? 'text-primary' : 'text-secondary'}`}>{o.label}</span>
                      <span className={`relative font-display font-semibold ${isLeader ? 'text-gold' : 'text-secondary'}`}>
                        {o.vote_count}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* close control */}
              {nextLevelOf(openRound.level) ? (
                <form action={closeAndAdvance} className="mt-6 border-t border-line pt-5">
                  <p className="font-body text-sm text-secondary">
                    Phase schließen → Gewinner wird gesetzt und die nächste Phase ({LEVEL_LABEL[nextLevelOf(openRound.level)!]})
                    automatisch eröffnet.
                  </p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <WinnerField options={openOptions} />
                    <DeadlineField name="nextClosesAt" label="Nächste Phase endet am" def={defClose} />
                    <SubmitBtn>Schließen &amp; weiter</SubmitBtn>
                  </div>
                </form>
              ) : (
                <form action={closeFinalRound} className="mt-6 border-t border-line pt-5">
                  <p className="font-body text-sm text-secondary">
                    Letzte Phase schließen → das Reiseziel steht fest. Danach geht es (nach rechtlicher Freigabe) zur
                    Auslosung.
                  </p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <WinnerField options={openOptions} />
                    <SubmitBtn>
                      <Trophy size={16} strokeWidth={1.6} /> Kampagne abschließen
                    </SubmitBtn>
                  </div>
                </form>
              )}
            </div>
          )}

          {state === 'between' && lastClosed && (
            <div className="mt-6">
              <p className="font-body text-sm leading-relaxed text-secondary">
                Die {LEVEL_LABEL[lastClosed.level]}-Phase ist geschlossen, aber die nächste Phase wurde noch nicht
                eröffnet. Jetzt {LEVEL_LABEL[nextLevelOf(lastClosed.level)!]}-Phase starten.
              </p>
              <form action={advanceToNext} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <DeadlineField name="nextClosesAt" label="Phase endet am" def={defClose} />
                <SubmitBtn>Nächste Phase starten</SubmitBtn>
              </form>
            </div>
          )}

          {state === 'done' && lastClosed && (
            <div className="mt-6 rounded-[8px] border border-gold/40 bg-bg p-5">
              <div className="flex items-center gap-2">
                <Trophy size={18} strokeWidth={1.6} className="text-gold" />
                <span className="font-display text-lg font-semibold text-primary">Reiseziel steht fest</span>
              </div>
              <p className="mt-2 font-body text-2xl font-semibold text-gold">
                {lastClosed.winner_option_id ? winnerLabel.get(lastClosed.winner_option_id) ?? '—' : '—'}
              </p>
              <p className="mt-1 font-body text-sm text-secondary">
                {closedRounds
                  .map((r) => (r.winner_option_id ? winnerLabel.get(r.winner_option_id) : null))
                  .filter(Boolean)
                  .join(' → ')}
              </p>
            </div>
          )}

          {rounds.length > 0 && (
            <form action={resetCampaign} className="mt-6 border-t border-line pt-5">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-[4px] border border-line px-4 py-2.5 font-body text-sm text-faint transition-colors hover:border-red-500/40 hover:text-red-400"
              >
                <RotateCcw size={15} strokeWidth={1.6} /> Kampagne {year} zurücksetzen
              </button>
            </form>
          )}
        </section>

        {/* ── Buyers ── */}
        <section className="mt-8 rounded-[10px] border border-line bg-surface p-6">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} strokeWidth={1.6} className="text-gold" />
            <h2 className="font-display text-xl font-semibold text-primary">Käufer freischalten</h2>
          </div>
          <p className="mt-2 font-body text-sm leading-relaxed text-secondary">
            Bis Shopify angebunden ist, schaltest du Käufer hier manuell per E-Mail frei. Die Person muss sich vorher
            einmal bei OneFam angemeldet haben. Nur Käufer dürfen abstimmen — die Gewinnchance bei der Auslosung bleibt
            davon unberührt.
          </p>
          <form action={grantBuyer} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              name="email"
              type="email"
              required
              placeholder="kaeufer@beispiel.ch"
              className="w-full rounded-[4px] border border-line bg-bg px-3 py-2.5 font-body text-base text-primary outline-none focus:border-gold/60"
            />
            <button
              type="submit"
              className="shrink-0 rounded-[4px] bg-gold px-6 py-2.5 font-body font-medium text-bg transition-colors duration-[180ms] hover:bg-gold-hover"
            >
              Freischalten
            </button>
          </form>

          {buyers.length > 0 && (
            <ul className="mt-5 divide-y divide-line border-t border-line">
              {buyers.map((b) => (
                <li key={b.user_id} className="flex items-center justify-between py-2.5">
                  <span className="font-body text-sm text-secondary">
                    {b.email}
                    <span className="ml-2 text-xs text-faint">({b.source})</span>
                  </span>
                  <form action={revokeBuyer}>
                    <input type="hidden" name="userId" value={b.user_id} />
                    <button type="submit" className="font-body text-xs text-faint hover:text-primary">
                      entfernen
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function DeadlineField({ name, label, def }: { name: string; label: string; def: string }) {
  return (
    <label className="flex flex-1 flex-col gap-1.5">
      <span className="font-body text-xs uppercase tracking-[0.14em] text-faint">{label}</span>
      <input
        type="datetime-local"
        name={name}
        required
        defaultValue={def}
        className="rounded-[4px] border border-line bg-bg px-3 py-2.5 font-body text-base text-primary outline-none focus:border-gold/60"
      />
    </label>
  );
}

function WinnerField({ options }: { options: { code: string; label: string; vote_count: number }[] }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-body text-xs uppercase tracking-[0.14em] text-faint">Gewinner</span>
      <select
        name="winnerCode"
        defaultValue=""
        className="rounded-[4px] border border-line bg-bg px-3 py-2.5 font-body text-base text-primary outline-none focus:border-gold/60"
      >
        <option value="">Automatisch (Führender)</option>
        {options.map((o) => (
          <option key={o.code} value={o.code}>
            {o.label} ({o.vote_count})
          </option>
        ))}
      </select>
    </label>
  );
}

function SubmitBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[4px] bg-gold px-6 py-2.5 font-body font-medium text-bg transition-colors duration-[180ms] hover:bg-gold-hover"
    >
      {children}
    </button>
  );
}

function MigrationNotice({ email }: { email: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/admin" className="inline-flex items-center gap-2 font-body text-sm text-secondary hover:text-primary">
            <ArrowLeft size={16} strokeWidth={1.5} />
            Zurück zum Admin
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="font-display text-2xl font-semibold text-primary">Migration noch nicht eingespielt</h1>
        <p className="mt-3 font-body text-sm leading-relaxed text-secondary">
          Die Tabellen für die gestufte Abstimmung fehlen. Spiele bitte{' '}
          <code className="text-gold">supabase/migrations/0005_staged_campaign.sql</code> im Supabase&nbsp;SQL-Editor ein,
          dann lädt diese Seite. Eingeloggt als {email}.
        </p>
      </main>
    </div>
  );
}
