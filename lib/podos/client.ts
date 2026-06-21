// PodOS / ShirtKing API client — pulls per-SKU production costs (COGS) for the
// pool accounting. READ-ONLY: only GET endpoints. We NEVER POST (that would
// create a real production order).
//
// Auth (per the PodOS API docs): GET param `project` + header
// `Authorization: Bearer <PODOS_API_KEY>`. Base `https://api.podos.io/v1`.
//
// The exact cost/sku field names aren't pinned yet — once the API key is in the
// env we curl the live /products + /variants response and confirm them. Until
// then this tries the common candidates AND honours optional env overrides
// (PODOS_COST_FIELD / PODOS_SKU_FIELD) so the field can be fixed with NO code change.

const BASE = process.env.PODOS_API_BASE || 'https://api.podos.io/v1';
const PROJECT = process.env.PODOS_PROJECT || '';
const KEY = process.env.PODOS_API_KEY || '';

/** True when both the project name and the API key are configured. */
export function podosConfigured(): boolean {
  return Boolean(PROJECT && KEY);
}

type Json = Record<string, unknown>;

async function podosGet(resource: string, params: Record<string, string | number> = {}): Promise<unknown> {
  if (!podosConfigured()) throw new Error('PodOS ist nicht konfiguriert (PODOS_PROJECT / PODOS_API_KEY fehlen).');
  const url = new URL(`${BASE.replace(/\/$/, '')}/${resource}`);
  url.searchParams.set('project', PROJECT);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${KEY}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`PodOS GET ${resource} → ${res.status} ${res.statusText}${body ? `: ${body.slice(0, 200)}` : ''}`);
  }
  return res.json();
}

// Candidate field names — the real one is confirmed against the live API and can
// be locked via PODOS_COST_FIELD / PODOS_SKU_FIELD without touching this file.
const COST_FIELDS = [
  process.env.PODOS_COST_FIELD,
  'cost', 'base_cost', 'production_cost', 'unit_cost', 'cost_price', 'purchase_price', 'net_cost', 'price_net',
].filter(Boolean) as string[];
const SKU_FIELDS = [process.env.PODOS_SKU_FIELD, 'sku', 'SKU', 'article_number', 'articleNumber', 'ean', 'id'].filter(
  Boolean,
) as string[];

const num = (v: unknown): number | null => {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

function pick(obj: Json, fields: string[]): unknown {
  for (const f of fields) if (obj[f] != null && obj[f] !== '') return obj[f];
  return null;
}

/** Normalise the many shapes an API list endpoint can return into an array. */
function asArray(data: unknown): Json[] {
  if (Array.isArray(data)) return data as Json[];
  const d = data as Json;
  for (const key of ['data', 'items', 'results', 'records', 'variants', 'products']) {
    if (Array.isArray(d?.[key])) return d[key] as Json[];
  }
  return [];
}

export type PodosCost = { sku: string; cost: number; label: string | null };

/**
 * Fetch SKU→cost from PodOS. Tries `variants` first (per-size cost is usually
 * there), falls back to `products`. Paginates defensively. Returns the de-duped
 * list of SKUs that have a numeric cost.
 */
export async function fetchProductCosts(): Promise<PodosCost[]> {
  const out = new Map<string, PodosCost>();

  for (const resource of ['variants', 'products']) {
    let page = 1;
    for (;;) {
      let items: Json[];
      try {
        items = asArray(await podosGet(resource, { page, per_page: 100 }));
      } catch {
        break; // resource not available / errored → try the next one
      }
      if (!items.length) break;
      for (const it of items) {
        const sku = pick(it, SKU_FIELDS);
        const cost = num(pick(it, COST_FIELDS));
        if (sku != null && cost != null) {
          const key = String(sku);
          if (!out.has(key)) {
            out.set(key, { sku: key, cost, label: (pick(it, ['name', 'title', 'label']) as string) ?? null });
          }
        }
      }
      if (items.length < 100) break;
      if (++page > 50) break; // safety cap
    }
    if (out.size) break; // got costs from variants → don't double-count products
  }

  return [...out.values()];
}
