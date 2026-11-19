import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { homePath, isLocale, DEFAULT_LOCALE, type Locale } from '@/i18n/routing';

// Eigene 404-Seite, seit 19.11.2026. Vorher lief die Vorgabe von Next.js: englischer
// Satz „This page could not be found." auf jeder Sprache, und im <head> standen ZWEI
// <title>-Elemente (das von Next.js und der Rückfall-Titel aus app/layout.tsx).
// noindex setzt Next.js für 404 selbst (ein eigenes robots hier ergab es doppelt);
// der Status bleibt 404.
//
// Die Texte stehen hier und nicht in messages/, weil die Seite auch für Adressen
// ausserhalb der Sprachstruktur greift. Dort meldet next-intl die Standardsprache.
const TEXT: Record<Locale, { meta: string; titel: string; text: string; link: string }> = {
  en: { meta: 'Page not found', titel: 'This page does not exist.', text: 'The address may have changed.', link: 'To the home page' },
  de: { meta: 'Seite nicht gefunden', titel: 'Diese Seite gibt es nicht.', text: 'Vielleicht hat sich die Adresse geändert.', link: 'Zur Startseite' },
  fr: { meta: 'Page introuvable', titel: "Cette page n'existe pas.", text: "L'adresse a peut-être changé.", link: "Vers l'accueil" },
  es: { meta: 'Página no encontrada', titel: 'Esta página no existe.', text: 'Puede que la dirección haya cambiado.', link: 'Ir al inicio' },
};

async function sprache(): Promise<Locale> {
  const roh = await getLocale();
  return isLocale(roh) ? roh : DEFAULT_LOCALE;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: `${TEXT[await sprache()].meta} — OneFam` };
}

export default async function NichtGefunden() {
  const locale = await sprache();
  const t = TEXT[locale];

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-bg px-6 text-center">
      <p className="font-body text-sm font-medium uppercase tracking-[0.22em] text-gold">404</p>
      <h1 className="mt-4 font-serif text-4xl font-normal text-primary md:text-5xl">{t.titel}</h1>
      <p className="mt-4 max-w-[31rem] font-body text-lg text-secondary">{t.text}</p>
      <a href={homePath(locale)} className="mt-8 font-body text-gold underline-offset-4 hover:underline">
        {t.link}
      </a>
    </main>
  );
}
