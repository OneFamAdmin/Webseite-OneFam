import crypto from 'node:crypto';

// Echtheitsprüfung eines WooCommerce-Webhooks.
//
// WooCommerce signiert den ROHEN Anfragerumpf mit HMAC-SHA256 und dem
// Webhook-Geheimnis und schickt das Ergebnis base64-kodiert im Kopfzeilenfeld
// `X-WC-Webhook-Signature`. Das Verfahren ist identisch mit dem, das Shopify
// benutzt hat — nur der Name der Kopfzeile ist ein anderer. Deshalb ist diese
// Datei die fast unveränderte Übernahme von lib/shopify/verify.ts.
//
// WICHTIG: Die Prüfung muss gegen die exakten Rohbytes laufen, niemals gegen ein
// neu serialisiertes JSON — sonst stimmt die Signatur nie. Der Vergleich ist
// zeitkonstant, damit er nichts über den erwarteten Wert verrät.
export function verifyWooHmac(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader || !secret) return false;

  const digest = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest();

  let provided: Buffer;
  try {
    provided = Buffer.from(signatureHeader, 'base64');
  } catch {
    return false;
  }

  // timingSafeEqual wirft bei ungleicher Länge — abfangen (falsche Länge = ungültig).
  if (provided.length !== digest.length) return false;
  return crypto.timingSafeEqual(provided, digest);
}

/**
 * Erkennt den „Ping", den WooCommerce beim ANLEGEN eines Webhooks einmalig
 * schickt, um die Adresse zu prüfen.
 *
 * Dieser Ping ist eine Besonderheit, an der die Einrichtung sonst scheitert:
 * Er trägt **keine Signatur**, kein Topic und ist auch kein JSON, sondern der
 * formularkodierte Rumpf `webhook_id=<zahl>`. Antwortet der Endpunkt darauf mit
 * 401, schaltet WooCommerce den Webhook gar nicht erst frei — er landet
 * dauerhaft auf „deaktiviert", ohne dass irgendwo eine brauchbare Fehlermeldung
 * steht. Deshalb wird der Ping erkannt und mit 200 bestätigt, bevor die
 * Signaturprüfung greift.
 *
 * Das ist kein Loch in der Prüfung: Ein Ping trägt keine Nutzdaten, löst keine
 * Verarbeitung aus und kann folglich nichts verändern.
 */
export function istPing(rawBody: string, topic: string | null): boolean {
  if (topic) return false;
  return /^webhook_id=\d+$/.test(rawBody.trim());
}
