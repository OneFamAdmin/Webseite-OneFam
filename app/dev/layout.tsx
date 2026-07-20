import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

// Interne Vorschau-Routen (/dev, /dev/faces, /dev/redesign): lokal voll nutzbar,
// in Produktion 404. Die Übersicht unter /dev listet die komplette Routenstruktur
// inklusive /admin auf — das gehört nicht auf die öffentliche Seite.
// Gilt für alle verschachtelten Seiten; keine einzelne Datei muss sich darum kümmern.
export default function DevLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound();
  return <>{children}</>;
}
