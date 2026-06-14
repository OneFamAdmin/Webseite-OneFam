// Fetches public randomness from the drand beacon (League of Entropy mainnet).
// The randomness for a given round is fixed and verifiable by anyone, so the
// draw can't be manipulated. Kept separate from the pure engine.
//
// NOTE (pre-launch hardening): for a fully trustless draw, announce a FUTURE
// drand round before sealing entries, then use that round once it publishes —
// so nobody (not even us) knows the randomness at commit time. Also define a
// fallback source (e.g. a pre-announced Bitcoin block hash) if drand is down.

const BASE = process.env.DRAND_CHAIN_URL || 'https://api.drand.sh';

export type DrandResult = { round: number; randomness: string };

export async function fetchLatestDrand(): Promise<DrandResult> {
  const res = await fetch(`${BASE}/public/latest`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`drand nicht erreichbar (HTTP ${res.status})`);
  const json = await res.json();
  if (!json?.randomness || typeof json.round !== 'number') {
    throw new Error('drand-Antwort unerwartet');
  }
  return { round: json.round, randomness: json.randomness };
}
