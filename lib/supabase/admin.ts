import { createClient } from '@supabase/supabase-js';

// Service-role client — bypasses Row Level Security. SERVER-ONLY: never import
// this into a 'use client' component. Used by admin actions to set the pool,
// read all entries, and write draws.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
