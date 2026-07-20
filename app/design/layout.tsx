import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

// Design-Vorschau des Reiseziel-Votings mit Demo-Daten: lokal nutzbar, in Produktion 404.
// Siehe app/dev/layout.tsx — gleiche Begründung.
export default function DesignLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound();
  return <>{children}</>;
}
