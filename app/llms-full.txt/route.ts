import { llmsFullTxt } from '@/lib/llms';

// /llms-full.txt — der sichtbare Text der Startseite in allen vier Sprachen.
// Inhalt und Begründung: lib/llms.ts. Zur Middleware siehe app/llms.txt/route.ts.
export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsFullTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
