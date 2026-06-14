import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Archiv & Transparenz — OneFam',
  description: 'Jede Ziehung – öffentlich dokumentiert und für jeden nachprüfbar.',
};

const chf = (n: number | string | null | undefined) =>
  n == null ? '–' : 'CHF ' + new Intl.NumberFormat('de-CH').format(Number(n));

type Winner = { id: string; groupSize: number; seats: number; displayName?: string | null };
type Draw = {
  id: string;
  year: number;
  pool_chf: number;
  ref_cost_chf: number;
  winner_count: number;
  seats_funded: number;
  rollover_chf: number;
  commitment: string;
  drand_round: number | null;
  randomness: string | null;
  winners: Winner[];
  created_at: string;
};

export default async function ArchivPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('draws').select('*').order('created_at', { ascending: false });
  const draws = (data ?? []) as Draw[];

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

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 md:py-24">
        <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">Transparenz</p>
        <h1 className="mt-2 font-display text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[0.02em] text-primary">
          Archiv der Ziehungen
        </h1>
        <p className="mt-4 font-body text-lg leading-[1.7] text-secondary">
          Jede Ziehung ist hier dokumentiert – mit allen Daten, um sie selbst nachzurechnen. Niemand, auch wir nicht,
          kann das Ergebnis nachträglich verändern.
        </p>

        {/* how to verify */}
        <div className="mt-8 flex gap-3 rounded-[8px] border border-line bg-surface p-4">
          <ShieldCheck size={18} strokeWidth={1.6} className="mt-0.5 flex-none text-gold" />
          <p className="font-body text-sm leading-relaxed text-secondary">
            <span className="font-medium text-primary">So ist es nachprüfbar:</span> Der{' '}
            <span className="text-gold">Fingerabdruck</span> (Commitment) ist der SHA-256-Hash der versiegelten
            Teilnehmerliste – er steht fest, bevor die Zufallszahl bekannt ist. Die{' '}
            <span className="text-gold">Zufallszahl</span> stammt aus der öffentlichen drand-Runde. Aus beidem ergeben
            sich die Gewinner – exakt reproduzierbar.
          </p>
        </div>

        {/* draws */}
        {draws.length === 0 ? (
          <p className="mt-12 rounded-[10px] border border-dashed border-line p-8 text-center font-body text-secondary">
            Noch keine Ziehung. Sobald die erste läuft, erscheint sie hier.
          </p>
        ) : (
          <div className="mt-10 space-y-6">
            {draws.map((d) => (
              <article key={d.id} className="rounded-[10px] border border-line bg-surface p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-2xl font-semibold text-primary">Ziehung {d.year}</h2>
                  <span className="font-body text-xs text-faint">
                    {new Date(d.created_at).toLocaleDateString('de-CH', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Stat label="Pool" value={chf(d.pool_chf)} gold />
                  <Stat label="Gewinner" value={String(d.winner_count)} />
                  <Stat label="Plätze" value={String(d.seats_funded)} />
                  <Stat label="Rollover" value={chf(d.rollover_chf)} />
                </div>

                {/* winners */}
                <div className="mt-5">
                  <p className="font-body text-xs uppercase tracking-[0.1em] text-faint">Gewinner</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {d.winners.map((w, i) => (
                      <span
                        key={i}
                        title={w.id}
                        className={`rounded-[4px] border border-line bg-bg px-2.5 py-1 text-xs ${
                          w.displayName ? 'font-body text-primary' : 'font-mono text-secondary'
                        }`}
                      >
                        {w.displayName ? w.displayName : `${w.id.slice(0, 8)}…`}
                        {w.groupSize > 1 ? ` ×${w.groupSize}` : ''}
                      </span>
                    ))}
                  </div>
                </div>

                {/* proof */}
                <dl className="mt-5 space-y-2 border-t border-line pt-4">
                  <Proof label="Commitment (SHA-256)" value={d.commitment} />
                  <Proof label="drand-Runde" value={d.drand_round != null ? String(d.drand_round) : '–'} />
                  <Proof label="Zufallszahl" value={d.randomness ?? '–'} />
                </dl>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div>
      <p className="font-body text-xs uppercase tracking-[0.1em] text-faint">{label}</p>
      <p className={`mt-1 font-display text-lg font-semibold ${gold ? 'text-gold' : 'text-primary'}`}>{value}</p>
    </div>
  );
}

function Proof({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
      <dt className="w-40 flex-none font-body text-xs uppercase tracking-[0.1em] text-faint">{label}</dt>
      <dd className="break-all font-mono text-xs text-secondary">{value}</dd>
    </div>
  );
}
