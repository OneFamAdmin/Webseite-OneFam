// Server-only world geometry for the vote map. Loaded once at module load and
// cached. Never import this from a 'use client' file — it would pull the ~108 KB
// TopoJSON into the browser bundle. VoteMap is a server component, so it stays put.

import { feature, merge } from 'topojson-client';
import topology from 'world-atlas/countries-110m.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFeature = any;

const fc = feature(topology as any, (topology as any).objects.countries) as any;

/** All country features (numeric string `id`, e.g. "076" = Brazil; `properties.name`). */
export const countryFeatures: AnyFeature[] = fc.features;

const ANTARCTICA_ID = 10;

/** World minus Antarctica — a nicer frame for the global (continent) view. */
export const worldNoAntarctica = {
  type: 'FeatureCollection',
  features: countryFeatures.filter((f) => Number(f.id) !== ANTARCTICA_ID),
} as const;

/**
 * All land merged into a single geometry: the borders shared by adjacent countries
 * dissolve, leaving only true coastlines. Drawn as one path this reads as the
 * CONTINENTS (no internal country lines) — used for the continent-level world view.
 */
export const mergedLand = {
  type: 'Feature',
  properties: {},
  geometry: merge(
    topology as any,
    ((topology as any).objects.countries.geometries as AnyFeature[]).filter((g) => Number(g.id) !== ANTARCTICA_ID),
  ),
} as const;

/** Lookup a country feature by ISO-3166-1 numeric code (padding-agnostic). */
export function featureByIso(iso: string | number): AnyFeature | null {
  return countryFeatures.find((f) => Number(f.id) === Number(iso)) ?? null;
}
