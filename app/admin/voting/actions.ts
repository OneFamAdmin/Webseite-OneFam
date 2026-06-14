'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Nicht autorisiert.');
  }
  return user;
}

type AdminClient = ReturnType<typeof createAdminClient>;

/** Look up an auth user by e-mail (case-insensitive). Returns null if none. */
async function findUserByEmail(admin: AdminClient, email: string) {
  const target = email.trim().toLowerCase();
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw new Error(error.message);
  return data.users.find((u) => (u.email ?? '').toLowerCase() === target) ?? null;
}

export async function grantBuyer(formData: FormData) {
  await assertAdmin();
  const email = String(formData.get('email') ?? '').trim();
  if (!email) throw new Error('Bitte eine E-Mail angeben.');

  const admin = createAdminClient();
  const user = await findUserByEmail(admin, email);
  if (!user) {
    throw new Error('Kein Nutzer mit dieser E-Mail. Die Person muss sich zuerst bei OneFam anmelden.');
  }
  const { error } = await admin.from('buyers').upsert({ user_id: user.id, source: 'manual' }, { onConflict: 'user_id' });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/voting');
}

export async function revokeBuyer(formData: FormData) {
  await assertAdmin();
  const userId = String(formData.get('userId') ?? '');
  if (!userId) throw new Error('userId fehlt.');
  const admin = createAdminClient();
  const { error } = await admin.from('buyers').delete().eq('user_id', userId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/voting');
}

/** Wipe all destination votes (start the vote over). */
export async function resetAllVotes() {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from('destination_votes')
    .delete()
    .gte('updated_at', '1970-01-01T00:00:00Z');
  if (error) throw new Error(error.message);
  revalidatePath('/admin/voting');
  revalidatePath('/reiseziel');
  revalidatePath('/');
}
