import { llmsTxt } from '@/lib/llms';

// /llms.txt — Kurzfassung für KI-Dienste. Inhalt und Begründung: lib/llms.ts.
// Statisch beim Bauen erzeugt; die Texte ändern sich nur mit einem Deploy.
// Der Pfad steht in DATEIEN_OHNE_SPRACHE (i18n/routing.ts) — ohne den Eintrag
// leitet die Middleware auf /de/llms.txt um, und das endet mit 404
// (so gemessen am 19.11.2026, bevor es diese Datei gab).
export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
