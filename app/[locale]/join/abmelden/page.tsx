import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import { abmelden } from '@/app/actions/join';
import { createAdminClient } from '@/lib/supabase/admin';
import { TOKEN_MAX } from '@/lib/warteliste';
import { homePath, isLocale } from '@/i18n/routing';

// Ziel des Abmeldelinks aus den Mails der Warteliste (18.10.2026).
//
// Der Aufruf löscht noch nichts, er zeigt nur einen Knopf. Grund: Virenscanner
// mancher Mailanbieter öffnen Links vorab. Löschte schon der Aufruf, wären Leute
// abgemeldet, die nie geklickt haben. Gelöscht wird erst in der Server-Action
// abmelden(), die danach mit ?fertig=1 hierher zurückleitet.

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ t?: string; fertig?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'waitlist_seiten' });
  return { title: t('abmelden_meta'), robots: { index: false, follow: false } };
}

export default async function AbmeldenPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const { t: token, fertig } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'waitlist_seiten' });

  let zustand: 'fertig' | 'frage' | 'ungueltig' = 'ungueltig';
  if (fertig) {
    zustand = 'fertig';
  } else if (token && token.length <= TOKEN_MAX) {
    const { data } = await createAdminClient()
      .from('waitlist')
      .select('id')
      .eq('unsub_token', token)
      .maybeSingle();
    if (data) zustand = 'frage';
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav />
      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center px-6 py-16 text-center md:py-24">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[0.02em] text-primary">
          {zustand === 'fertig' ? t('abgemeldet_titel') : t('abmelden_titel')}
        </h1>
        <p className="mt-5 font-body text-lg leading-[1.7] text-secondary">
          {zustand === 'fertig'
            ? t('abgemeldet_text')
            : zustand === 'frage'
              ? t('abmelden_frage')
              : t('abmelden_ungueltig')}
        </p>

        {zustand === 'frage' && (
          <form action={abmelden} className="mt-8">
            <input type="hidden" name="t" value={token} />
            <input type="hidden" name="sprache" value={locale} />
            <button
              type="submit"
              className="rounded-[4px] border border-line px-6 py-3 font-body text-sm font-medium text-primary transition-colors duration-[180ms] hover:border-gold/60"
            >
              {t('abmelden_knopf')}
            </button>
          </form>
        )}

        <p className="mt-10">
          <Link href={homePath(locale)} className="font-body text-sm text-gold underline-offset-4 hover:underline">
            {t('zur_startseite')}
          </Link>
        </p>
      </main>
    </div>
  );
}
