import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { promotePendingBuyer } from '@/lib/shopify/promote';

// Handles the magic-link click: establishes the session, then forwards to the
// confirm page carrying the chosen group size (g). Supports both the PKCE code
// flow and the token_hash flow, so it works regardless of the email template.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type') as EmailOtpType | null;
  const g = url.searchParams.get('g') ?? '1';
  const n = url.searchParams.get('n') ?? '';
  const origin = url.origin;

  const supabase = await createClient();
  let ok = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    ok = !error;
  }

  if (ok) {
    // Every magic-link login/signup passes through here — the single chokepoint to
    // promote a buyer who ordered in the shop before having a OneFam account.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) await promotePendingBuyer(user.id, user.email);

    const next = `${origin}/join/bestaetigen?g=${encodeURIComponent(g)}${n ? `&n=${encodeURIComponent(n)}` : ''}`;
    return NextResponse.redirect(next);
  }
  return NextResponse.redirect(`${origin}/join?fehler=link`);
}
