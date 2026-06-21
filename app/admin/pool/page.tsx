import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, Wallet, TrendingUp, Receipt, RefreshCw, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { podosConfigured } from '@/lib/podos/client';
import { saveCostConfig, saveProductCost, deleteProductCost, syncPodosCosts, addAdjustment } from './actions';

export const metadata = { title: 'Pool-Buchhaltung — OneFam Admin' };

const chf = (n: number | string | null | undefined) =>
  n == null ? '–' : 'CHF ' + new Intl.NumberFormat('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n));

const input =
  'mt-1 w-full rounded-[4px] border border-line bg-bg px-3 py-2.5 font-body text-base text-primary outline-none focus:border-gold/60';

type LedgerRow = { id: string; type: string; amount_chf: number; ref: string | null; note: string | null; created_at: string };
type CostRow = { sku: string; cost_chf: number; label: string | null; source: string; updated_at: string };
type PurchaseRow = { gross_chf: number | null; margin_chf: number | null; pool_credit_chf: number | null; status: string };

export default async function AdminPoolPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/join');
  if (user.email !== process.env.ADMIN_EMAIL) redirect('/');

  const year = new Date().getFullYear();
  const admin = createAdminClient();

  const [{ data: config }, { data: pool }, { data: costs }, { data: ledger }, { data: purchases }] = await Promise.all([
    admin.from('cost_config').select('*').eq('year', year).maybeSingle(),
    admin.from('pool_state').select('amount_chf, ref_cost_chf').eq('year', year).maybeSingle(),
    admin.from('product_costs').select('sku, cost_chf, label, source, updated_at').order('updated_at', { ascending: false }).limit(200),
    admin.from('pool_ledger').select('id, type, amount_chf, ref, note, created_at').eq('year', year).order('created_at', { ascending: false }).limit(25),
    admin.from('purchases').select('gross_chf, margin_chf, pool_credit_chf, status'),
  ]);

  const costRows = (costs ?? []) as CostRow[];
  const ledgerRows = (ledger ?? []) as LedgerRow[];
  const paid = ((purchases ?? []) as PurchaseRow[]).filter((p) => p.status === 'paid');
  const revenue = paid.reduce((s, p) => s + Number(p.gross_chf ?? 0), 0);
  const margin = paid.reduce((s, p) => s + Number(p.margin_chf ?? 0), 0);
  const podosCount = costRows.filter((c) => c.source === 'podos').length;
  const sharePct = Number(config?.pool_share_pct ?? 0);

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
            Admin
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:py-16">
        <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">Pool-Buchhaltung</p>
        <h1 className="mt-2 font-display text-[clamp(1.8rem,4vw,2.5rem)] font-semibold tracking-[0.02em] text-primary">
          Gewinn → Pool {year}
        </h1>
        <p className="mt-2 font-body text-sm leading-relaxed text-faint">
          Pro Verkauf: Marge = Brutto − Produktionskosten − Gebühren; davon {sharePct}% in den Pool. Die Auslosung bleibt
          gratis; Lohn/Fixkosten werden separat gegengerechnet (nie aus dem Pool).
        </p>

        {/* overview */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[10px] border border-line bg-surface p-5">
            <div className="flex items-center gap-2 text-faint">
              <Wallet size={16} strokeWidth={1.6} className="text-gold" />
              <span className="font-body text-xs uppercase tracking-[0.1em]">Travel Pool</span>
            </div>
            <p className="mt-2 font-display text-3xl font-semibold text-gold">{chf(pool?.amount_chf ?? 0)}</p>
          </div>
          <div className="rounded-[10px] border border-line bg-surface p-5">
            <div className="flex items-center gap-2 text-faint">
              <TrendingUp size={16} strokeWidth={1.6} className="text-gold" />
              <span className="font-body text-xs uppercase tracking-[0.1em]">Umsatz / Marge ({paid.length})</span>
            </div>
            <p className="mt-2 font-display text-2xl font-semibold text-primary">{chf(revenue)}</p>
            <p className="mt-1 font-body text-xs text-faint">Marge: {chf(margin)}</p>
          </div>
        </div>

        {/* config */}
        <section className="mt-8 rounded-[10px] border border-line bg-surface p-6">
          <h2 className="font-display text-xl font-semibold text-primary">Einstellungen</h2>
          <form action={saveCostConfig} className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-body text-sm text-secondary">Pool-Anteil (% der Marge)</span>
              <input name="poolSharePct" type="number" min={0} max={100} step="0.5" defaultValue={config?.pool_share_pct ?? 0} className={input} />
            </label>
            <label className="block">
              <span className="font-body text-sm text-secondary">Gebühren (% vom Brutto)</span>
              <input name="feePct" type="number" min={0} step="0.1" defaultValue={config?.fee_pct ?? 0} className={input} />
            </label>
            <label className="block">
              <span className="font-body text-sm text-secondary">Fixe Gebühr / Bestellung (CHF)</span>
              <input name="feeFixedChf" type="number" min={0} step="0.01" defaultValue={config?.fee_fixed_chf ?? 0} className={input} />
            </label>
            <label className="block">
              <span className="font-body text-sm text-secondary">Fallback-Kosten (% vom Brutto, falls SKU ohne Kosten)</span>
              <input name="defaultCogsPct" type="number" min={0} max={100} step="0.5" defaultValue={config?.default_cogs_pct ?? ''} placeholder="leer = 0" className={input} />
            </label>
            <div className="sm:col-span-2">
              <button type="submit" className="rounded-[4px] bg-gold px-6 py-2.5 font-body font-medium text-bg transition-colors duration-[180ms] hover:bg-gold-hover">
                Einstellungen speichern
              </button>
            </div>
          </form>
        </section>

        {/* PodOS sync */}
        <section className="mt-8 rounded-[10px] border border-line bg-surface p-6">
          <div className="flex items-center gap-2">
            <RefreshCw size={18} strokeWidth={1.6} className="text-gold" />
            <h2 className="font-display text-xl font-semibold text-primary">Produktionskosten (PodOS / ShirtKing)</h2>
          </div>
          <p className="mt-2 font-body text-sm leading-relaxed text-secondary">
            {podosConfigured() ? (
              <>PodOS-API konfiguriert. {podosCount} Kosten aus PodOS, {costRows.length - podosCount} manuell.</>
            ) : (
              <>
                PodOS-API noch nicht konfiguriert (<code className="text-gold">PODOS_API_KEY</code> /{' '}
                <code className="text-gold">PODOS_PROJECT</code> setzen). Bis dahin Kosten manuell pflegen oder den
                Fallback-Satz oben nutzen.
              </>
            )}
          </p>
          {podosConfigured() && (
            <form action={syncPodosCosts} className="mt-4">
              <button type="submit" className="inline-flex items-center gap-2 rounded-[4px] border border-gold px-5 py-2.5 font-body font-medium text-gold transition-colors duration-[180ms] hover:bg-gold hover:text-bg">
                <RefreshCw size={15} strokeWidth={1.8} />
                Kosten von PodOS synchronisieren
              </button>
            </form>
          )}

          {/* manual cost add */}
          <form action={saveProductCost} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1.4fr_auto]">
            <input name="sku" placeholder="SKU" className={input} />
            <input name="cost" type="number" min={0} step="0.01" placeholder="Kosten CHF" className={input} />
            <input name="label" placeholder="Bezeichnung (optional)" className={input} />
            <button type="submit" className="rounded-[4px] bg-gold px-5 py-2.5 font-body font-medium text-bg transition-colors duration-[180ms] hover:bg-gold-hover">
              Hinzufügen
            </button>
          </form>

          {costRows.length > 0 && (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full border-collapse font-body text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-faint">
                    <th className="py-2 pr-3 font-medium">SKU</th>
                    <th className="py-2 pr-3 font-medium">Kosten</th>
                    <th className="py-2 pr-3 font-medium">Quelle</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody>
                  {costRows.map((c) => (
                    <tr key={c.sku} className="border-b border-line/50">
                      <td className="py-2 pr-3 text-primary">{c.sku}{c.label ? <span className="text-faint"> · {c.label}</span> : null}</td>
                      <td className="py-2 pr-3 text-primary">{chf(c.cost_chf)}</td>
                      <td className="py-2 pr-3 text-faint">{c.source}</td>
                      <td className="py-2 text-right">
                        <form action={deleteProductCost}>
                          <input type="hidden" name="sku" value={c.sku} />
                          <button type="submit" aria-label="Löschen" className="text-faint transition-colors hover:text-primary">
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

        {/* ledger */}
        <section className="mt-8 rounded-[10px] border border-line bg-surface p-6">
          <div className="flex items-center gap-2">
            <Receipt size={18} strokeWidth={1.6} className="text-gold" />
            <h2 className="font-display text-xl font-semibold text-primary">Ledger (letzte 25)</h2>
          </div>
          {ledgerRows.length === 0 ? (
            <p className="mt-3 font-body text-sm text-faint">Noch keine Buchungen. Sobald eine Bestellung bezahlt wird, erscheint hier die Pool-Gutschrift.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse font-body text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-faint">
                    <th className="py-2 pr-3 font-medium">Datum</th>
                    <th className="py-2 pr-3 font-medium">Typ</th>
                    <th className="py-2 pr-3 font-medium">Betrag</th>
                    <th className="py-2 font-medium">Referenz</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerRows.map((l) => (
                    <tr key={l.id} className="border-b border-line/50">
                      <td className="py-2 pr-3 text-faint">{new Date(l.created_at).toLocaleDateString('de-CH')}</td>
                      <td className="py-2 pr-3 text-secondary">{l.type}</td>
                      <td className={`py-2 pr-3 ${Number(l.amount_chf) < 0 ? 'text-primary/70' : 'text-gold'}`}>{chf(l.amount_chf)}</td>
                      <td className="py-2 text-faint">{l.ref ?? l.note ?? '–'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* manual adjustment */}
          <form action={addAdjustment} className="mt-5 grid gap-3 sm:grid-cols-[auto_1fr_auto]">
            <input name="amount" type="number" step="0.01" placeholder="± CHF" className={input} />
            <input name="note" placeholder="Notiz (z. B. Korrektur)" className={input} />
            <button type="submit" className="rounded-[4px] border border-line px-5 py-2.5 font-body font-medium text-secondary transition-colors duration-[180ms] hover:border-gold/40 hover:text-primary">
              Buchung
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
