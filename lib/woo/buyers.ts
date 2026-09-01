import type { createAdminClient } from '@/lib/supabase/admin';

type AdminClient = ReturnType<typeof createAdminClient>;

/** Herkunft eines automatisch vergebenen Käuferstatus. Ein Wert, eine Stelle. */
export const WOO_SOURCE = 'woocommerce';

/**
 * Käuferstatus aus einer WooCommerce-Bestellung vergeben (oder auffrischen),
 * nachvollziehbar mit der Bestellung verknüpft.
 * NUR MIT SERVICE-ROLLE (buyers hat keine Schreibregel für Clients).
 *
 * - Neuer Käufer      → Zeile mit source='woocommerce', first_order_id, shop_customer_id.
 * - Bestehender Käufer → nur die shop_customer_id anhängen und first_order_id
 *   nachtragen, falls sie fehlt. Ein 'manual' vergebener Status wird bewusst
 *   NICHT herabgestuft, und die erste Bestellung bleibt erhalten — die Spur soll
 *   die FRÜHESTE Bestellung zeigen, nicht die letzte.
 */
export async function grantWooBuyer(
  admin: AdminClient,
  userId: string,
  orderId: string,
  shopCustomerId: string | null,
): Promise<void> {
  const { data: existing, error } = await admin
    .from('buyers')
    .select('user_id, first_order_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error(error.message);

  if (!existing) {
    const { error: insErr } = await admin.from('buyers').insert({
      user_id: userId,
      source: WOO_SOURCE,
      first_order_id: orderId,
      shop_customer_id: shopCustomerId,
    });
    // Ein gleichzeitiger Insert kann den Primärschlüssel treffen — unkritisch,
    // der Nutzer ist dann bereits Käufer.
    if (insErr && insErr.code !== '23505') throw new Error(insErr.message);
    return;
  }

  const patch: { shop_customer_id: string | null; first_order_id?: string } = {
    shop_customer_id: shopCustomerId,
  };
  if (!existing.first_order_id) patch.first_order_id = orderId;
  const { error: updErr } = await admin.from('buyers').update(patch).eq('user_id', userId);
  if (updErr) throw new Error(updErr.message);
}

/**
 * Käuferstatus nach einer Retoure oder Stornierung neu bewerten. Bleibt keine
 * bezahlte Bestellung übrig, wird die Käufer-Zeile entfernt — aber AUSSCHLIESSLICH
 * ein automatisch vergebener Status, niemals ein 'manual' vom Admin gesetzter.
 * Der steht, bis ein Admin ihn selbst entfernt.
 */
export async function recomputeWooBuyer(admin: AdminClient, userId: string): Promise<void> {
  const { count, error } = await admin
    .from('purchases')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'paid');
  if (error) throw new Error(error.message);

  if ((count ?? 0) === 0) {
    const { error: delErr } = await admin
      .from('buyers')
      .delete()
      .eq('user_id', userId)
      .eq('source', WOO_SOURCE);
    if (delErr) throw new Error(delErr.message);
  }
}
