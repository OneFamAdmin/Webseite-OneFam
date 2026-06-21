import type { createAdminClient } from '@/lib/supabase/admin';

type AdminClient = ReturnType<typeof createAdminClient>;

/**
 * Look up an auth user by e-mail (case-insensitive). Returns null if none.
 * Supabase admin has no direct get-by-email, so we scan the first page of users
 * — fine at OneFam's scale. SERVER-ONLY (needs the service-role admin client).
 */
export async function findAuthUserByEmail(admin: AdminClient, email: string) {
  const target = email.trim().toLowerCase();
  if (!target) return null;
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw new Error(error.message);
  return data.users.find((u) => (u.email ?? '').toLowerCase() === target) ?? null;
}
