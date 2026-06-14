import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, ShoppingBag, BarChart3, RotateCcw } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { continentByKey, countryByIso } from '@/lib/geo/data';
import { grantBuyer, revokeBuyer, resetAllVotes } from './actions';

export const metadata = { title: 'Voting — Admin — OneFam' };

type Vote = { continent: string; country_iso: string | null; place_label: string | null };

export default async function AdminVotingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/join');
  if (user.email !== process.env.ADMIN_EMAIL) redirect('/');

  const admin = createAdminClient();

  const votesRes = await admin.from('destination_votes').select('continent, country_iso, place_label');
  const migrationMissing = Boolean(
    votesRes.error &&
      (votesRes.error.code === 'PGRST205' ||
        votesRes.error.code === '42P01' ||
        /does not exist|schema cache|could not find the table/i.test(votesRes.error.message ?? '')),
  );
  if (migrationMissing) return <MigrationNotice email={user.email!} />;

  const [buyersRes, usersRes] = await Promise.all([
    admin.from('buyers').select('user_id, source, created_at').order('created_at', { ascending: false }),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  const emailByUser = new Map<string, string>();
  for (const u of usersRes.data?.users ?? []) emailByUser.set(u.id, u.email ?? '—');
  const buyers = (buyersRes.data ?? []).map((b) => ({ ...b, email: emailByUser.get(b.user_id) ?? '(unbekannt)' }));

  const votes = (votesRes.data ?? []) as Vote[];
  const total = votes.length;

  const byContinent = tally(votes.map((v) => v.continent)).map(([key, n]) => ({
    label: continentByKey(key)?.label ?? key,
    n,
  }));
  const byPlace = tally(votes.filter((v) => v.place_label).map((v) => v.place_label as string)).slice(0, 8);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" aria-label="OneFam — Home" className="flex items-center gap-2.5">
            <img src="/assets/logo-face.svg" alt="" aria-hidden="true" className="h-7 w-7" />
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
        <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">Reiseziel-Voting</p>
        <h1 className="mt-2 font-display text-[clamp(1.8rem,4vw,2.5rem)] font-semibold tracking-[0.02em] text-primary">
          Käufer & Ergebnisse
        </h1>
        <p className="mt-2 font-body text-sm text-faint">
          Käufer dürfen abstimmen. Abgestimmt wird auf{' '}
          <Link href="/reiseziel" className="text-gold hover:text-gold-hover">
            /reiseziel
          </Link>{' '}
          (interaktive Karte).
        </p>

        {/* ── Buyers ── */}
        <section className="mt-8 rounded-[10px] border border-line bg-surface p-6">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} strokeWidth={1.6} className="text-gold" />
            <h2 className="font-display text-xl font-semibold text-primary">Käufer freischalten</h2>
          </div>
          <p className="mt-2 font-body text-sm leading-relaxed text-secondary">
            Bis Shopify angebunden ist, schaltest du Käufer hier manuell per E-Mail frei. Die Person muss sich vorher
            einmal bei OneFam angemeldet haben.
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

        {/* ── Results ── */}
        <section className="mt-8 rounded-[10px] border border-line bg-surface p-6">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} strokeWidth={1.6} className="text-gold" />
            <h2 className="font-display text-xl font-semibold text-primary">Ergebnisse</h2>
          </div>
          <p className="mt-1 font-body text-sm text-faint">
            {total} {total === 1 ? 'Stimme' : 'Stimmen'} insgesamt
          </p>

          {total === 0 ? (
            <p className="mt-4 font-body text-sm text-secondary">Noch keine Stimmen. Sobald Käufer abstimmen, erscheint hier die Auswertung.</p>
          ) : (
            <div className="mt-5 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-body text-xs uppercase tracking-[0.16em] text-faint">Nach Kontinent</h3>
                <ul className="mt-3 space-y-1.5">
                  {byContinent.map((c) => (
                    <li key={c.label} className="flex items-center justify-between font-body text-sm text-secondary">
                      <span>{c.label}</span>
                      <span className="font-display font-semibold text-gold">{c.n}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-body text-xs uppercase tracking-[0.16em] text-faint">Top-Ziele</h3>
                <ul className="mt-3 space-y-1.5">
                  {byPlace.map(([label, n]) => (
                    <li key={label} className="flex items-center justify-between font-body text-sm text-secondary">
                      <span>{label}</span>
                      <span className="font-display font-semibold text-gold">{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {total > 0 && (
            <form action={resetAllVotes} className="mt-7 border-t border-line pt-5">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-[4px] border border-line px-4 py-2.5 font-body text-sm text-faint transition-colors hover:border-red-500/40 hover:text-red-400"
              >
                <RotateCcw size={15} strokeWidth={1.6} /> Alle Stimmen zurücksetzen
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

function tally(items: string[]): [string, number][] {
  const m = new Map<string, number>();
  for (const it of items) m.set(it, (m.get(it) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
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
          Die Tabelle <code className="text-gold">destination_votes</code> fehlt. Spiele bitte{' '}
          <code className="text-gold">supabase/migrations/0004_destination_votes.sql</code> im Supabase&nbsp;SQL-Editor
          ein, dann lädt diese Seite. Eingeloggt als {email}.
        </p>
      </main>
    </div>
  );
}
