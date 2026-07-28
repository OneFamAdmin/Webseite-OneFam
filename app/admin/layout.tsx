import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Der Adminbereich ist bereits durch den ADMIN_EMAIL-Abgleich geschützt — Suchmaschinen
// kämen ohnehin nur bis zur Weiterleitung. Trotzdem gehört hier ein ausdrückliches
// noindex hin: sonst erbt /admin den Canonical der Startseite aus dem Root-Layout und
// meldet Google eine Adresse, die es gar nicht geben soll.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  openGraph: undefined,
  twitter: undefined,
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
