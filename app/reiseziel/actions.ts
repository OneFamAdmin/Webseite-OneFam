'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export type VoteInput = {
  continent: string;
  countryIso: string;
  placeCode: string;
  placeLabel: string;
  placeLat: number;
  placeLng: number;
};

/** Upsert the current user's full destination pick. RLS enforces buyer-only +
 *  own-row; changing your mind just overwrites the single row. */
export async function castDestinationVote(input: VoteInput): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'not-logged-in' };

  const { error } = await supabase.from('destination_votes').upsert({
    user_id: user.id,
    continent: input.continent,
    country_iso: input.countryIso,
    place_code: input.placeCode,
    place_label: input.placeLabel,
    place_lat: input.placeLat,
    place_lng: input.placeLng,
    updated_at: new Date().toISOString(),
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath('/reiseziel');
  revalidatePath('/');
  return { ok: true };
}
