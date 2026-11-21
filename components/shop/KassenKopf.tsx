import Image from 'next/image';
import Link from 'next/link';
import MaxWidth from '@/components/MaxWidth';

// Kopfzeile der Kasse (21.11.2026): nur die Wortmarke und der Weg zurück.
//
// Vorher stand hier die volle Kopfzeile der Website — "Über uns", "Code",
// "Häufige Fragen", "Shop" und der Knopf "Join the Fam", direkt über dem
// Bestellknopf. An der Kasse gibt es genau eine Aufgabe; jeder weitere Weg ist
// einer aus dem Kauf hinaus (Befund der Durchsicht vom 21.11.2026). Vorbild für
// die Ruhe auf Schwarz: banham.co.uk.
//
// Bewusst auch ohne Sprachwahl und ohne Warenkorb-Symbol: Ein Sprachwechsel
// leerte die halb ausgefüllte Adresse, und der Warenkorb ist der Link rechts.
// Gleiche Höhe wie components/Nav.tsx (h-14 / h-16), damit die Seite darunter
// denselben Abstand behält.
export default function KassenKopf({
  startPfad,
  warenkorbPfad,
  zurueck,
}: {
  startPfad: string;
  warenkorbPfad: string;
  zurueck: string;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-bg">
      <MaxWidth className="flex h-14 items-center justify-between md:h-16">
        <Link href={startPfad} aria-label="OneFam — Home" className="-my-3 py-3">
          <Image src="/assets/logo-white.png" alt="OneFam" width={656} height={137} priority className="h-5 w-auto md:h-6" />
        </Link>
        <Link
          href={warenkorbPfad}
          className="-my-3 py-3 font-body text-sm text-secondary underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          ← {zurueck}
        </Link>
      </MaxWidth>
    </header>
  );
}
