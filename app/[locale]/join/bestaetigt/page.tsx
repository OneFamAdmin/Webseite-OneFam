import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, X } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Nav from '@/components/Nav';
import { createAdminClient } from '@/lib/supabase/admin';
import { GUELTIG_TAGE, TOKEN_MAX } from '@/lib/warteliste';
import { homePath, isLocale, joinPath } from '@/i18n/routing';

// Ziel des Links aus der Bestätigungsmail (doppelte Bestätigung, 18.10.2026).
//
// Liegt unter app/[locale]/, damit die Seite in der Sprache des Eintrags
// antwortet. Nicht zu verwechseln mit /join/bestaetigen (ausserhalb der
// Sprachstruktur): das ist die geparkte Teilnahme an der Auswahl und braucht ein
// Konto. Der Pfad hier heisst bewusst anders, sonst finge OHNE_SPRACHE ihn ab.
//
// Bestätigt wird beim Aufruf. Dass Virenscanner Links vorab öffnen, ist hier
// hinnehmbar: Den Link bekommt nur, wer Zugriff auf das Postfach hat — genau
// das soll die Bestätigung belegen. (Beim Abmelden ist es anders, siehe dort.)

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ t?: string }>;
};

type Ergebnis = 'ok' | 'schon' | 'abgelaufen' | 'ungueltig';

async function bestaetige(t: string | undefined): Promise<Ergebnis> {
  if (!t || t.length > TOKEN_MAX) return 'ungueltig';

  const db = createAdminClient();
  const { data, error } = await db
    .from('waitlist')
    .select('id, status, token_sent_at')
    .eq('confirm_token', t)
    .maybeSingle();
  if (error) throw error;
  if (!data) return 'ungueltig';
  if (data.status === 'confirmed') return 'schon';

  const alter = Date.now() - new Date(data.token_sent_at ?? 0).getTime();
  if (alter > GUELTIG_TAGE * 86_400_000) return 'abgelaufen';

  const { error: schreibfehler } = await db
    .from('waitlist')
    .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
    .eq('id', data.id)
    .eq('status', 'pending');
  if (schreibfehler) throw schreibfehler;
  return 'ok';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'waitlist_seiten' });
  return { title: t('bestaetigt_meta'), robots: { index: false, follow: false } };
}

export default async function BestaetigtPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const { t: token } = await searchParams;
  const ergebnis = await bestaetige(token);
  const t = await getTranslations({ locale, namespace: 'waitlist_seiten' });
  const gut = ergebnis === 'ok' || ergebnis === 'schon';

  return (
    <div className="flex min-h-screen flex-col bg-bg pt-14 md:pt-16">
      <Nav />
      <main className="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center px-6 py-16 text-center md:py-24">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40">
          {gut ? (
            <Check size={26} strokeWidth={2} className="text-gold" />
          ) : (
            <X size={26} strokeWidth={2} className="text-secondary" />
          )}
        </div>
        <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[0.02em] text-primary">
          {t(`${ergebnis}_titel`)}
        </h1>
        <p className="mt-5 font-body text-lg leading-[1.7] text-secondary">
          {t(`${ergebnis}_text`, { tage: GUELTIG_TAGE })}
        </p>
        <p className="mt-10">
          <Link
            href={gut ? homePath(locale) : joinPath(locale)}
            className="font-body text-sm text-gold underline-offset-4 hover:underline"
          >
            {gut ? t('zur_startseite') : t('neu_eintragen')}
          </Link>
        </p>
      </main>
    </div>
  );
}
