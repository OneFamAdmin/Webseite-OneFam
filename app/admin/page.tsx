import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Users, Wallet, Dices, Vote, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { setPool, runDrawAction } from './actions';

export const metadata = { title: 'Admin — OneFam' };

const chf = (n: number | string | null | undefined) =>
  n == null ? '–' : 'CHF ' + new Intl.NumberFormat('de-CH').format(Number(n));

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/join');
  if (user.email !== process.env.ADMIN_EMAIL) redirect('/');

  const year = new Date().getFullYear();
  const admin = createAdminClient();
  const [{ data: pool }, { count: entryCount }, { data: lastDraw }] = await Promise.all([
    admin.from('pool_state').select('amount_chf, ref_cost_chf').eq('year', year).maybeSingle(),
    admin.from('entries').select('*', { count: 'exact', head: true }).eq('year', year),
    admin
      .from('draws')
      .select('created_at, winner_count, seats_funded, rollover_chf')
      .eq('year', year)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" aria-label="OneFam — Home" className="flex items-center gap-2.5">
            <img src="/assets/logo-face.svg" alt="" aria-hidden="true" className="h-7 w-7" />
            <Image src="/assets/logo-white.png" alt="OneFam" width={216} height={75} priority className="h-6 w-auto" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-body text-sm text-secondary transition-colors duration-[180ms] hover:text-primary"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            Zur Startseite
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:py-16">
        <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">Admin</p>
        <h1 className="mt-2 font-display text-[clamp(1.8rem,4vw,2.5rem)] font-semibold tracking-[0.02em] text-primary">
          Steuerung {year}
        </h1>
        <p className="mt-2 font-body text-sm text-faint">Eingeloggt als {user.email}</p>

        {/* stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[10px] border border-line bg-surface p-5">
            <div className="flex items-center gap-2 text-faint">
              <Users size={16} strokeWidth={1.6} className="text-gold" />
              <span className="font-body text-xs uppercase tracking-[0.1em]">Teilnehmer {year}</span>
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-primary">{entryCount ?? 0}</p>
          </div>
          <div className="rounded-[10px] border border-line bg-surface p-5">
            <div className="flex items-center gap-2 text-faint">
              <Wallet size={16} strokeWidth={1.6} className="text-gold" />
              <span className="font-body text-xs uppercase tracking-[0.1em]">Travel Pool</span>
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-gold">{chf(pool?.amount_chf)}</p>
            <p className="mt-1 font-body text-xs text-faint">Referenz / Reise: {chf(pool?.ref_cost_chf)}</p>
          </div>
        </div>

        {/* voting link */}
        <Link
          href="/admin/voting"
          className="mt-8 flex items-center justify-between rounded-[10px] border border-line bg-surface p-6 transition-colors duration-[180ms] hover:border-gold/40"
        >
          <div className="flex items-center gap-3">
            <Vote size={20} strokeWidth={1.6} className="text-gold" />
            <div>
              <h2 className="font-display text-xl font-semibold text-primary">Reiseziel-Voting</h2>
              <p className="mt-0.5 font-body text-sm text-faint">Käufer freischalten · Runden Kontinent → Land → Ort</p>
            </div>
          </div>
          <ChevronRight size={20} strokeWidth={1.6} className="text-faint" />
        </Link>

        {/* set pool */}
        <section className="mt-8 rounded-[10px] border border-line bg-surface p-6">
          <h2 className="font-display text-xl font-semibold text-primary">Pool setzen</h2>
          <form action={setPool} className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-body text-sm text-secondary">Pool-Betrag (CHF)</span>
              <input
                name="amount"
                type="number"
                min={0}
                step="1"
                required
                defaultValue={pool?.amount_chf ?? ''}
                className="mt-1 w-full rounded-[4px] border border-line bg-bg px-3 py-2.5 font-body text-base text-primary outline-none focus:border-gold/60"
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-secondary">Kosten pro Reise (CHF)</span>
              <input
                name="refCost"
                type="number"
                min={1}
                step="1"
                required
                defaultValue={pool?.ref_cost_chf ?? 4000}
                className="mt-1 w-full rounded-[4px] border border-line bg-bg px-3 py-2.5 font-body text-base text-primary outline-none focus:border-gold/60"
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-[4px] bg-gold px-6 py-2.5 font-body font-medium text-bg transition-colors duration-[180ms] hover:bg-gold-hover"
              >
                Pool speichern
              </button>
            </div>
          </form>
        </section>

        {/* run draw */}
        <section className="mt-8 rounded-[10px] border border-line bg-surface p-6">
          <div className="flex items-center gap-2">
            <Dices size={18} strokeWidth={1.6} className="text-gold" />
            <h2 className="font-display text-xl font-semibold text-primary">Ziehung starten</h2>
          </div>
          <p className="mt-2 font-body text-sm leading-relaxed text-secondary">
            Versiegelt die {entryCount ?? 0} Teilnehmer, holt die öffentliche drand-Zufallszahl und führt die faire,
            nachprüfbare Ziehung aus. Das Ergebnis erscheint danach öffentlich im{' '}
            <Link href="/archiv" className="text-gold hover:text-gold-hover">
              Archiv
            </Link>
            .
          </p>
          {lastDraw && (
            <p className="mt-3 font-body text-xs text-faint">
              Letzte Ziehung: {lastDraw.winner_count} Gewinner · {lastDraw.seats_funded} Plätze · Rollover{' '}
              {chf(lastDraw.rollover_chf)}
            </p>
          )}
          <form action={runDrawAction} className="mt-4">
            <button
              type="submit"
              className="rounded-[4px] border border-gold px-6 py-2.5 font-body font-medium text-gold transition-colors duration-[180ms] hover:bg-gold hover:text-bg"
            >
              Ziehung jetzt durchführen
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
