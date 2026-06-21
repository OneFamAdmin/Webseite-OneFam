import crypto from 'node:crypto';

// Verify a Shopify webhook's authenticity. Shopify signs the RAW request body
// with HMAC-SHA256 using the webhook signing secret and sends the result,
// base64-encoded, in the `X-Shopify-Hmac-Sha256` header.
//
// IMPORTANT: this must run against the exact raw body bytes — never re-serialised
// JSON — or the signature won't match. The comparison is timing-safe.
export function verifyShopifyHmac(rawBody: string, hmacHeader: string | null, secret: string): boolean {
  if (!hmacHeader || !secret) return false;

  const digest = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest();

  let provided: Buffer;
  try {
    provided = Buffer.from(hmacHeader, 'base64');
  } catch {
    return false;
  }

  // timingSafeEqual throws on length mismatch — guard it (a wrong length is a fail).
  if (provided.length !== digest.length) return false;
  return crypto.timingSafeEqual(provided, digest);
}
