import { createAdminClient } from '@/lib/supabase/admin';
import { grantWooBuyer } from '@/lib/woo/buyers';

/**
 * Einen gerade angemeldeten Nutzer zum Käufer befördern, FALLS er im Shop gekauft
 * hat, bevor es sein OneFam-Konto gab (seine E-Mail liegt dann in `pending_buyers`).
 *
 * Wird bei jeder Anmeldung aufgerufen. Das ist billig: eine indizierte Abfrage,
 * die im Normalfall sofort leer zurückkommt. NUR SERVERSEITIG (Admin-Client).
 *
 * Bei einem Treffer: Käuferstatus vergeben (nachvollziehbar zur geparkten
 * Bestellung), die vorhandenen Bestellzeilen dem Nutzer zuordnen, dann den
 * geparkten Eintrag löschen. Absichtlich fehlertolerant — ein Aussetzer hier darf
 * niemals eine Anmeldung blockieren.
 */
export async function promotePendingBuyer(userId: string, email?: string | null): Promise<void> {
  const e = (email ?? '').trim().toLowerCase();
  if (!e) return;

  try {
    const admin = createAdminClient();

    const { data: pending } = await admin
      .from('pending_buyers')
      .select('email, order_id, shop_customer_id')
      .eq('email', e)
      .maybeSingle();
    if (!pending) return; // nichts geparkt → fertig (der Normalfall)

    await grantWooBuyer(admin, userId, pending.order_id ?? '', pending.shop_customer_id ?? null);

    // Bestellungen aus der Zeit vor dem Konto verknüpfen, damit die Spur
    // Bestellung ↔ Nutzer vollständig ist.
    await admin.from('purchases').update({ user_id: userId }).eq('email', e).is('user_id', null);

    await admin.from('pending_buyers').delete().eq('email', e);
  } catch (err) {
    console.error('[woo] promotePendingBuyer fehlgeschlagen', err);
  }
}
