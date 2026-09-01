import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, CalendarDays, Scale, Trash2, TriangleAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { rechneMonat, monatsGrenzen, type AbrechnungsPosten, type OverheadPosten } from '@/lib/pool/abrechnung';
import { addOverhead, deleteOverhead } from './actions';
import Lockup from '@/components/Lockup';

export const metadata = { title: 'Monatsabrechnung — OneFam Admin' };

const chf = (n: number | string | null | undefined) =>
  n == null
    ? '–'
    : 'CHF ' + new Intl.NumberFormat('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n));

const input =
  'mt-1 w-full rounded-[4px] border border-line bg-bg px-3 py-2.5 font-body text-base text-primary outline-none focus:border-gold/60';

const MONATE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

const KATEGORIE_LABEL: Record<string, string> = {
  lohn: 'Lohn',
  hosting: 'Hosting & Domains',
  werbung: 'Werbung',
  software: 'Software',
  sonstiges: 'Sonstiges',
};

type OverheadRow = {
  id: string;
  category: string;
  label: string;
  amount_chf: number;
  note: string | null;
};

type PurchaseRow = {
  gross_chf: number | null;
  cogs_chf: number | null;
  fee_chf: number | null;
  margin_chf: number | null;
  pool_credit_chf: number | null;
};

/** Eine Zahl aus der Adresszeile, die im erlaubten Bereich liegt — sonst der Rückfall. */
function zahlAusQuery(raw: string | string[] | undefined, min: number, max: number, rueckfall: number) {
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isInteger(n) && n >= min && n <= max ? n : rueckfall;
}

export default async function AbrechnungPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  // Kein Middleware-Gate unter /admin — jede Seite prüft selbst (siehe CLAUDE.md).
  if (user.email !== process.env.ADMIN_EMAIL) redirect('/');

  const sp = await searchParams;
  const jetzt = new Date();
  const year = zahlAusQuery(sp.jahr, 2020, 2100, jetzt.getFullYear());
  const month = zahlAusQuery(sp.monat, 1, 12, jetzt.getMonth() + 1);
  const { von, bis } = monatsGrenzen(year, month);

  const admin = createAdminClient();
  const [{ data: purchases }, { data: overhead }] = await Promise.all([
    admin
      .from('purchases')
      .select('gross_chf, cogs_chf, fee_chf, margin_chf, pool_credit_chf')
      // Nur bezahlte Bestellungen. Eine stornierte fällt rückwirkend aus ihrem
      // Monat heraus — die Rückbuchung im Ledger ist davon unabhängig.
      .eq('status', 'paid')
      .gte('created_at', von)
      .lt('created_at', bis),
    admin
      .from('overhead_costs')
      .select('id, category, label, amount_chf, note')
      .eq('year', year)
      .eq('month', month)
      .order('category'),
  ]);

  const overheadRows = (overhead ?? []) as OverheadRow[];
  const posten: AbrechnungsPosten[] = ((purchases ?? []) as PurchaseRow[]).map((p) => ({
    grossChf: p.gross_chf,
    cogsChf: p.cogs_chf,
    feeChf: p.fee_chf,
    marginChf: p.margin_chf,
    poolCreditChf: p.pool_credit_chf,
  }));
  const kosten: OverheadPosten[] = overheadRows.map((o) => ({
    category: o.category as OverheadPosten['category'],
    amountChf: Number(o.amount_chf),
  }));

  const a = rechneMonat(posten, kosten);

  const zeilen: { label: string; wert: number; ton?: 'gold' | 'abzug' }[] = [
    { label: 'Umsatz', wert: a.umsatzChf },
    { label: 'Herstellung & Versand', wert: -a.kostenChf, ton: 'abzug' },
    { label: 'Zahlungsgebühren', wert: -a.gebuehrenChf, ton: 'abzug' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" aria-label="OneFam — Home" className="flex items-center">
            <Lockup />
          </Link>
          <Link
            href="/admin/pool"
            className="inline-flex items-center gap-2 font-body text-sm text-secondary transition-colors duration-[180ms] hover:text-primary"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            Pool
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:py-16">
        <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">Monatsabrechnung</p>
        <h1 className="mt-2 font-display text-[clamp(1.8rem,4vw,2.5rem)] font-semibold tracking-[0.02em] text-primary">
          {MONATE[month - 1]} {year}
        </h1>
        <p className="mt-2 font-body text-sm leading-relaxed text-faint">
          Was der Monat nach allen Kosten verdient hat. Lohn und Fixkosten werden hier gegengerechnet, aber{' '}
          <strong className="text-secondary">nie vom Pool abgezogen</strong> — ein roter Monat nimmt der Community
          nichts.
        </p>

        {/* Monatswahl */}
        <form method="get" className="mt-8 flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="font-body text-sm text-secondary">Monat</span>
            <select name="monat" defaultValue={month} className={input}>
              {MONATE.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="font-body text-sm text-secondary">Jahr</span>
            <input name="jahr" type="number" min={2020} max={2100} defaultValue={year} className={input} />
          </label>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-[4px] border border-line px-5 py-2.5 font-body font-medium text-secondary transition-colors duration-[180ms] hover:border-gold/40 hover:text-primary"
          >
            <CalendarDays size={15} strokeWidth={1.8} />
            Anzeigen
          </button>
        </form>

        {/* Aufstellung */}
        <section className="mt-8 rounded-[10px] border border-line bg-surface p-6">
          <div className="flex items-center gap-2">
            <Scale size={18} strokeWidth={1.6} className="text-gold" />
            <h2 className="font-display text-xl font-semibold text-primary">
              Aufstellung ({a.bestellungen} {a.bestellungen === 1 ? 'Bestellung' : 'Bestellungen'})
            </h2>
          </div>

          <dl className="mt-5 font-body text-sm">
            {zeilen.map((z) => (
              <div key={z.label} className="flex items-baseline justify-between border-b border-line/50 py-2.5">
                <dt className="text-secondary">{z.label}</dt>
                <dd className={z.ton === 'abzug' ? 'text-primary/70' : 'text-primary'}>{chf(z.wert)}</dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between border-b border-line py-3">
              <dt className="font-medium text-primary">Marge</dt>
              <dd className="font-display text-lg font-semibold text-primary">{chf(a.margeChf)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-b border-line/50 py-2.5">
              <dt className="text-secondary">In den Travel Pool</dt>
              <dd className="text-gold">{chf(-a.poolChf)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-b border-line/50 py-2.5">
              <dt className="text-secondary">
                Fixkosten & Lohn
                {a.lohnChf > 0 ? <span className="text-faint"> · davon Lohn {chf(a.lohnChf)}</span> : null}
              </dt>
              <dd className="text-primary/70">{chf(-a.overheadChf)}</dd>
            </div>
            <div className="flex items-baseline justify-between py-3">
              <dt className="font-medium text-primary">Ergebnis</dt>
              <dd className={`font-display text-2xl font-semibold ${a.gedeckt ? 'text-primary' : 'text-primary/60'}`}>
                {chf(a.ergebnisChf)}
              </dd>
            </div>
          </dl>

          {!a.gedeckt && (
            <div className="mt-4 flex gap-3 rounded-[8px] border border-line bg-bg p-4">
              <TriangleAlert size={18} strokeWidth={1.7} className="mt-0.5 shrink-0 text-gold" />
              <p className="font-body text-sm leading-relaxed text-secondary">
                Der Monat ist nicht gedeckt — die Marge hat Pool und Fixkosten nicht getragen. Der Pool behält
                trotzdem seine {chf(a.poolChf)}: er wird nie belastet. Die Lücke von {chf(Math.abs(a.ergebnisChf))}{' '}
                trägt die Firma.
              </p>
            </div>
          )}

          {a.unvollstaendig > 0 && (
            <div className="mt-4 flex gap-3 rounded-[8px] border border-line bg-bg p-4">
              <TriangleAlert size={18} strokeWidth={1.7} className="mt-0.5 shrink-0 text-gold" />
              <p className="font-body text-sm leading-relaxed text-secondary">
                {a.unvollstaendig}{' '}
                {a.unvollstaendig === 1 ? 'Bestellung ist erfasst, aber nicht abgerechnet' : 'Bestellungen sind erfasst, aber nicht abgerechnet'}{' '}
                (kein Franken-Betrag). Häufigste Ursache: der Wechselkurs fehlte beim Eingang. Der Umsatz oben ist
                deshalb zu niedrig.
              </p>
            </div>
          )}
        </section>

        {/* Fixkosten */}
        <section className="mt-8 rounded-[10px] border border-line bg-surface p-6">
          <h2 className="font-display text-xl font-semibold text-primary">
            Fixkosten & Lohn — {MONATE[month - 1]} {year}
          </h2>
          <p className="mt-2 font-body text-sm leading-relaxed text-secondary">
            Alles, was der Monat unabhängig von einzelnen Verkäufen gekostet hat. Beträge positiv eintragen; das Minus
            entsteht in der Aufstellung.
          </p>

          <form action={addOverhead} className="mt-5 grid gap-3 sm:grid-cols-[auto_1.4fr_auto_auto]">
            <input type="hidden" name="year" value={year} />
            <input type="hidden" name="month" value={month} />
            <select name="category" defaultValue="hosting" className={input} aria-label="Kategorie">
              {Object.entries(KATEGORIE_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <input name="label" placeholder="Bezeichnung (z. B. Vercel Pro)" className={input} />
            <input name="amount" type="number" min="0.01" step="0.01" placeholder="CHF" className={input} />
            <button
              type="submit"
              className="rounded-[4px] bg-gold px-5 py-2.5 font-body font-medium text-bg transition-colors duration-[180ms] hover:bg-gold-hover"
            >
              Hinzufügen
            </button>
          </form>

          {overheadRows.length === 0 ? (
            <p className="mt-5 font-body text-sm text-faint">
              Für diesen Monat ist noch nichts erfasst. Ohne Fixkosten zeigt die Aufstellung oben nur Marge minus Pool.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full border-collapse font-body text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-faint">
                    <th className="py-2 pr-3 font-medium">Kategorie</th>
                    <th className="py-2 pr-3 font-medium">Bezeichnung</th>
                    <th className="py-2 pr-3 font-medium">Betrag</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody>
                  {overheadRows.map((o) => (
                    <tr key={o.id} className="border-b border-line/50">
                      <td className="py-2 pr-3 text-secondary">{KATEGORIE_LABEL[o.category] ?? o.category}</td>
                      <td className="py-2 pr-3 text-primary">
                        {o.label}
                        {o.note ? <span className="text-faint"> · {o.note}</span> : null}
                      </td>
                      <td className="py-2 pr-3 text-primary">{chf(o.amount_chf)}</td>
                      <td className="py-2 text-right">
                        <form action={deleteOverhead}>
                          <input type="hidden" name="id" value={o.id} />
                          <button
                            type="submit"
                            aria-label="Löschen"
                            className="text-faint transition-colors hover:text-primary"
                          >
                            <Trash2 size={15} strokeWidth={1.6} />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
