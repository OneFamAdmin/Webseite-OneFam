import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import MaxWidth from './MaxWidth';
import Reveal from './Reveal';
import Button from './Button';
import CountUp from './CountUp';
import MarbleBg from './MarbleBg';

const SHOP_URL = 'https://onefam.shop';
const FALLBACK_AMOUNT = 4280; // shown only until the admin has set a real pool

/** Reads the live travel-pool amount for the current year (admin-set, RLS public-read).
 *  Falls back to a tasteful number only when no row exists yet, so the homepage never
 *  shows "CHF 0" before launch. Once the admin sets the pool, this reflects it live. */
async function getPool() {
  const year = new Date().getFullYear();
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('pool_state')
      .select('amount_chf, ref_cost_chf')
      .eq('year', year)
      .maybeSingle();
    if (!data) return { amount: FALLBACK_AMOUNT, fundedTrips: 0 };
    const amount = Number(data.amount_chf ?? 0);
    const ref = Number(data.ref_cost_chf ?? 0);
    return { amount, fundedTrips: ref > 0 ? Math.floor(amount / ref) : 0 };
  } catch {
    return { amount: FALLBACK_AMOUNT, fundedTrips: 0 };
  }
}

const TravelPool = async () => {
  const t = await getTranslations('travel_pool');
  const { amount, fundedTrips } = await getPool();

  return (
    <section
      id="travelpool"
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          'linear-gradient(180deg, var(--bg) 0px, var(--surface) 110px, var(--surface) calc(100% - 110px), var(--bg) 100%)',
      }}
    >
      <MarbleBg opacity={0.5} />
      <MaxWidth className="relative z-10 flex flex-col items-center text-center">
        <Reveal>
          <p className="font-body text-sm uppercase tracking-[0.1em] text-faint">{t('label')}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <CountUp
            to={amount}
            prefix="CHF "
            className="mt-4 block font-display text-[clamp(3.25rem,10vw,6rem)] font-extrabold leading-none tracking-[0.01em] text-gold"
          />
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-4 font-body text-base text-faint">
            {fundedTrips > 0
              ? `${fundedTrips} ${fundedTrips === 1 ? 'Reise' : 'Reisen'} bereits finanziert · ${t('note')}`
              : t('note')}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-[520px] font-body text-lg leading-relaxed text-secondary">
            {t('description')}
          </p>
        </Reveal>

        <Reveal delay={0.26} className="mt-10">
          <Button as="a" href={SHOP_URL} target="_blank" rel="noopener noreferrer" variant="ghost">
            {t('cta')}
            <ArrowRight size={18} strokeWidth={1.5} />
          </Button>
        </Reveal>
      </MaxWidth>
    </section>
  );
};

export default TravelPool;
