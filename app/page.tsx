import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import HomePage from '@/components/HomePage';
import { homeMetadata } from '@/lib/seo';
import { DEFAULT_LOCALE } from '@/i18n/routing';

// Die Startseite ohne Präfix ist die englische Fassung — dasselbe Modell wie im
// Shop. /de, /fr und /es liegen in app/[locale]/page.tsx.
//
// Titel und Beschreibung kommen aus der Übersetzungsdatei statt aus einer
// zweiten Quelle im Code. Sonst laufen Suchergebnis und Seiteninhalt
// auseinander, sobald jemand den Hero ändert und die Metadaten vergisst.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: DEFAULT_LOCALE, namespace: 'seo' });

  return homeMetadata({
    locale: DEFAULT_LOCALE,
    title: t('title'),
    description: t('description'),
  });
}

export default function Home() {
  return <HomePage />;
}
