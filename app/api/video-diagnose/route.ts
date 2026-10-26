import { NextResponse } from 'next/server';

// VORÜBERGEHEND (26.10.2026): Das Hero-Video steht auf dem iPhone (Safari und Chrome),
// bis man scrollt — am Mac läuft es. Ein iPhone-Simulator fehlt auf dem Mac, also misst
// die Seite selbst: Mit ?diag=1 schickt HeroVideo nach sechs Sekunden den Ablauf hierher
// (Ereignisse, abgelehnte play()-Aufrufe, gewählte Datei). Hier wird nur ins
// Vercel-Laufzeitprotokoll geschrieben, nichts gespeichert. Keine Personendaten ausser
// der Browserkennung. Nach der Fehlersuche wieder entfernen.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const text = (await req.text()).slice(0, 6000);
  console.log('[video-diagnose]', text);
  return NextResponse.json({ ok: true });
}
