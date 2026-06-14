// Self-contained checks for the draw engine. Run: node lib/draw/engine.test.mjs
import { runDraw } from './engine.mjs';

let failed = 0;
/** @param {boolean} cond @param {string} msg */
function check(cond, msg) {
  console.log(`${cond ? '✓' : '✗'} ${msg}`);
  if (!cond) failed++;
}

// ── all-solo: must behave exactly like floor(pool / refCost) ──
const solo = Array.from({ length: 1000 }, (_, i) => ({ id: `user-${i + 1}` }));
const base = { entries: solo, poolChf: 42000, refCostChf: 4000, randomnessHex: 'a1b2c3d4e5f6' };

const r1 = await runDraw(base);
const r2 = await runDraw(base); // identical inputs → identical output
const r3 = await runDraw({ ...base, randomnessHex: 'ffffffffffff' }); // different randomness

check(r1.winnerCount === 10, `solo: 10 winners = floor(42000/4000) (got ${r1.winnerCount})`);
check(r1.seatsFunded === 10, `solo: 10 seats funded (got ${r1.seatsFunded})`);
check(r1.rolloverChf === 2000, `solo: rollover 2000 (got ${r1.rolloverChf})`);
check(new Set(r1.winners.map((w) => w.id)).size === 10, 'solo: winners unique');
check(JSON.stringify(r1.winners) === JSON.stringify(r2.winners), 'reproducible: same inputs → same winners');
check(JSON.stringify(r3.winners) !== JSON.stringify(r1.winners), 'different randomness → different winners');

// ── groups: budget-consuming, never overspends the pool ──
const groups = [
  { id: 'a', groupSize: 5 },
  { id: 'b', groupSize: 2 },
  { id: 'c', groupSize: 1 },
  { id: 'd', groupSize: 3 },
  { id: 'e', groupSize: 4 },
  { id: 'f', groupSize: 1 },
];
const g = await runDraw({ entries: groups, poolChf: 24000, refCostChf: 4000, randomnessHex: 'deadbeef' });
check(g.spentChf <= 24000, `groups: never overspends pool (spent ${g.spentChf} ≤ 24000)`);
check(g.spentChf === g.seatsFunded * 4000, 'groups: spent = seats × refCost (consistent)');
check(g.rolloverChf === 24000 - g.spentChf, 'groups: rollover = pool − spent');
check(g.winners.every((w) => w.groupSize >= 1 && w.groupSize <= 5), 'groups: every group size 1..5');

// commitment must change if a group size changes (sizes are committed)
const gAlt = await runDraw({
  entries: groups.map((e) => (e.id === 'a' ? { ...e, groupSize: 1 } : e)),
  poolChf: 24000,
  refCostChf: 4000,
  randomnessHex: 'deadbeef',
});
check(g.commitment !== gAlt.commitment, 'groups: changing a group size changes the commitment');

// a group too big to ever fit the leftover is skipped, smaller ones still win
const tight = await runDraw({
  entries: [
    { id: 'big', groupSize: 5 },
    { id: 's1', groupSize: 1 },
    { id: 's2', groupSize: 1 },
  ],
  poolChf: 8000, // funds 2 solos, never the group of 5 (20000)
  refCostChf: 4000,
  randomnessHex: 'cafe',
});
check(
  tight.seatsFunded === 2 && tight.winners.every((w) => w.groupSize === 1),
  'tight pool: funds the 2 solos, skips the unaffordable group of 5',
);

console.log('\n--- example public proof (groups) ---');
console.log('commitment :', g.commitment.slice(0, 32) + '…');
console.log('seats sent :', g.seatsFunded, '| spent CHF:', g.spentChf, '| rollover:', g.rolloverChf);
console.log('winners    :', g.winners.map((w) => `${w.id}(×${w.groupSize})`).join(', '));

console.log(`\n${failed === 0 ? '✓ ALL CHECKS PASSED' : `✗ ${failed} CHECK(S) FAILED`}`);
process.exit(failed === 0 ? 0 : 1);
