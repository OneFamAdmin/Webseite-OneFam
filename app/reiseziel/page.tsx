import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import DestinationMap from '@/components/DestinationMap';

export const metadata = {
  title: 'Reiseziel-Voting — OneFam',
  description: 'Klick dich durch die Weltkarte und stimme ab, wohin die nächste OneFam-Reise geht.',
};

export default async function ReisezielPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isBuyer = false;
  let initialVote: { continent: string | null; country_iso: string | null; place_code: string | null } | null = null;

  if (user) {
    const [{ data: b }, { data: v }] = await Promise.all([
      supabase.from('buyers').select('user_id').eq('user_id', user.id).maybeSingle(),
      supabase
        .from('destination_votes')
        .select('continent, country_iso, place_code')
        .eq('user_id', user.id)
        .maybeSingle(),
    ]);
    isBuyer = Boolean(b);
    initialVote = v ?? null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" aria-label="OneFam — Home" className="flex items-center gap-2.5">
            <img src="/assets/logo-face.svg" alt="" aria-hidden="true" className="h-7 w-7" />
            <Image src="/assets/logo-white.png" alt="OneFam" width={216} height={75} priority className="h-6 w-auto" />
          </Link>
          <Link href="/" className="font-body text-sm text-secondary transition-colors duration-[180ms] hover:text-primary">
            Zur Startseite
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 md:py-16">
        <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">Reiseziel-Voting</p>
        <h1 className="mt-2 font-display text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[0.02em] text-primary">
          Wohin reisen wir als Nächstes?
        </h1>
        <p className="mt-3 max-w-[680px] font-body text-lg leading-[1.7] text-secondary">
          Klick dich durch die Karte: erst der Kontinent, dann das Land, dann der Ort. Deine ganze Wunsch-Reise zählt als
          eine Stimme — und du kannst sie jederzeit ändern.
        </p>

        <div className="mt-8">
          <DestinationMap isLoggedIn={Boolean(user)} isBuyer={isBuyer} initialVote={initialVote} />
        </div>
      </main>
    </div>
  );
}
