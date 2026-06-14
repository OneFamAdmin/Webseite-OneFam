// @ts-check
/**
 * Verifiable, reproducible draw engine for the OneFam free-entry sweepstake.
 *
 * Pure & deterministic: given the same sealed entries and the same public
 * randomness, ANYONE recomputes the exact same winners. No network call in here
 * — the randomness is passed in — so the engine is fully testable offline and
 * every result is independently auditable.
 *
 * Groups ("Plätze im Preis"): one verified person = ONE entry = ONE ticket, but
 * a ticket may cover a travel group of up to 5 (the person + up to 4). The group
 * size is part of the sealed entry, so it is committed and cannot change later.
 *
 * Selection is BUDGET-CONSUMING: walk the entries in the reproducible random
 * order and fund each winner's full group while the pool can still cover it;
 * skip a group that no longer fits and keep going for smaller ones; stop once
 * not even a solo (refCost) fits. The remainder rolls over. For all-solo entries
 * this is exactly floor(pool / refCost) winners.
 *
 * Trust model:
 *   1. Before the draw we publish `commitment` = SHA-256 over the sealed list of
 *      "<id>:<groupSize>" (sorted) — proves the set AND the group sizes are fixed.
 *   2. The randomness comes from a PUBLIC beacon (e.g. a future drand round)
 *      that nobody can predict or manipulate, fetched at draw time.
 *   3. winners = budget-walk(shuffle(entries, commitment + randomness)).
 *
 * @typedef {{ id: string, groupSize?: number }} Entry
 * @typedef {{ id: string, groupSize: number, seats: number }} Winner
 * @typedef {{ entries: Entry[], poolChf: number, refCostChf: number, randomnessHex: string }} DrawInput
 * @typedef {{ winners: Winner[], winnerCount: number, seatsFunded: number, spentChf: number,
 *             rolloverChf: number, commitment: string, randomnessHex: string,
 *             sealedEntries: {id: string, groupSize: number}[] }} DrawResult
 */

const MAX_GROUP = 5;

/** @param {string} input */
async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Deterministic stream of 32-bit unsigned ints from a seed (SHA-256 counter mode).
 * @param {string} seed
 */
async function* hashStream(seed) {
  let counter = 0;
  while (true) {
    const h = await sha256Hex(`${seed}:${counter++}`);
    for (let i = 0; i < 64; i += 8) yield parseInt(h.slice(i, i + 8), 16) >>> 0;
  }
}

/**
 * Fisher–Yates shuffle driven by the deterministic hash stream.
 * @template T
 * @param {T[]} items
 * @param {string} seed
 */
async function deterministicShuffle(items, seed) {
  const a = [...items];
  const rng = hashStream(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const r = /** @type {number} */ ((await rng.next()).value);
    const j = r % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** @param {number} n */
function clampGroup(n) {
  return Math.max(1, Math.min(MAX_GROUP, Math.floor(n || 1)));
}

/**
 * Run a verifiable draw.
 * @param {DrawInput} input
 * @returns {Promise<DrawResult>}
 */
export async function runDraw({ entries, poolChf, refCostChf, randomnessHex }) {
  if (refCostChf <= 0) throw new Error('refCostChf must be > 0');

  // 1. Seal: unique by id, each with its clamped group size, canonical-sorted.
  const byId = new Map();
  for (const e of entries) byId.set(e.id, clampGroup(e.groupSize ?? 1));
  const sealed = [...byId.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([id, groupSize]) => ({ id, groupSize }));

  // 2. Commitment over id + groupSize, so neither can be altered afterwards.
  const commitment = await sha256Hex(sealed.map((e) => `${e.id}:${e.groupSize}`).join('\n'));

  // 3. Reproducible order seeded by commitment + public randomness.
  const order = await deterministicShuffle(sealed, `${commitment}:${randomnessHex}`);

  // 4. Budget-consuming selection (never promise more than the pool funds).
  /** @type {Winner[]} */
  const winners = [];
  let spent = 0;
  for (const e of order) {
    const cost = e.groupSize * refCostChf;
    if (spent + cost <= poolChf) {
      spent += cost;
      winners.push({ id: e.id, groupSize: e.groupSize, seats: e.groupSize });
    }
    if (poolChf - spent < refCostChf) break; // not even a solo fits anymore
  }

  return {
    winners,
    winnerCount: winners.length,
    seatsFunded: winners.reduce((n, w) => n + w.seats, 0),
    spentChf: spent,
    rolloverChf: poolChf - spent,
    commitment,
    randomnessHex,
    sealedEntries: sealed,
  };
}
