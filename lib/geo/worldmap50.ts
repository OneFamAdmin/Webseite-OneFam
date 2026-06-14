// Higher-resolution (50m) country geometry, loaded ONLY for the place stage (via dynamic
// import) so a country's small islands (Balearics, Greek/Croatian isles, the Caribbean,
// Pacific…) actually exist as polygons. 110m drops them, so the place map showed bare dots.
// ~739 KB — never import this statically; the component code-splits it behind `import()`.

import { feature } from 'topojson-client';
import topology from 'world-atlas/countries-50m.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fc = feature(topology as any, (topology as any).objects.countries) as any;

/** A country's 50m feature by numeric ISO code (padding-agnostic), or null. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function featureByIso50m(iso: string | number): any {
  return fc.features.find((f: { id?: string | number }) => Number(f.id) === Number(iso)) ?? null;
}
