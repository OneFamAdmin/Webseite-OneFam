'use client';

// Style study v6 — RESPONSIVE: the desktop map measures its own container and rebuilds
// the projection + emblem layout for the exact width × height it is given, so it fills
// ANY desktop screen ratio (4:3, 16:10, 16:9, 21:9 …) automatically.
//   continent → gold world land + continent plaques
//   country   → continent CONIC projection; face-flag emblems sit in the black space in
//               their country's compass direction, the leading country's land glows
//   place     → ONE country's land + hero face + popular-city plaques
// Desktop = full-width map with on-map emblems. Mobile = a square map + ranked list.

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { geoNaturalEarth1, geoMercator, geoConicConformal, geoPath, geoCentroid, geoArea, geoDistance, geoContains, geoBounds } from 'd3-geo';
import { worldNoAntarctica, featureByIso, mergedLand } from '@/lib/geo/worldmap';
import { continentByKey } from '@/lib/geo/data';

export type DesignOption = { label: string; votes: number; code?: string; lat?: number; lng?: number };

type Props = {
  level: 'continent' | 'country' | 'place';
  options: DesignOption[];
  landIsos?: string[];
  faces?: boolean;
  heroIso?: string;
  /** How the flag-face emblems render: full flag COLOUR, GOLD monochrome, or NONE (design study). */
  faceStyle?: 'color' | 'none' | 'gold';
  /** SSR fallback aspect — the real size is measured on the client. */
  width?: number;
  height?: number;
  /** When true, each option becomes a clickable button that fires onSelect(code) — buyers vote
   *  by tapping straight on the map (desktop emblems + mobile list). */
  votable?: boolean;
  /** The option code the current user has voted for — gets a "deine Wahl" highlight. */
  selectedCode?: string | null;
  /** The option code whose vote is being saved right now — shown muted while in flight. */
  pendingCode?: string | null;
  onSelect?: (code: string) => void;
};

const GOLD = '#C9A84C';
const GOLD_BRIGHT = '#E2BF6A';
const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '’');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mainlandCentroid(feature: any): [number, number] {
  const g = feature?.geometry;
  if (g && g.type === 'MultiPolygon' && Array.isArray(g.coordinates)) {
    let best: unknown = null;
    let bestA = -1;
    for (const coords of g.coordinates) {
      const poly = { type: 'Polygon', coordinates: coords };
      const a = geoArea(poly as never);
      if (a > bestA) {
        bestA = a;
        best = poly;
      }
    }
    if (best) return geoCentroid(best as never) as [number, number];
  }
  return geoCentroid(feature as never) as [number, number];
}

// The country's biggest single polygon (its mainland), as a Polygon feature. The pin is anchored
// to THIS so it always lands on the part of the country that is actually drawn (keepNearMainland
// keeps the largest polygon), never on a trimmed-away island or in the sea between polygons.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mainlandPolygon(feature: any): any {
  const g = feature?.geometry;
  if (g && g.type === 'MultiPolygon' && Array.isArray(g.coordinates)) {
    let best: unknown = null;
    let bestA = -1;
    for (const coords of g.coordinates) {
      const poly = { type: 'Polygon', coordinates: coords };
      const a = geoArea(poly as never);
      if (a > bestA) {
        bestA = a;
        best = poly;
      }
    }
    if (best) return best;
  }
  return g && g.type === 'Polygon' ? g : feature;
}

// A point GUARANTEED to lie inside the polygon (so a map pin never floats in the sea). The
// geographic centroid is used when it already falls inside; otherwise we scan a small lon/lat
// grid over the polygon's bounds and take the contained point nearest the centroid. Concave
// countries (a bay, a crescent, an arc of coast) are exactly the ones whose centroid is offshore.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function interiorGeo(poly: any, centroid: [number, number]): [number, number] {
  if (geoContains(poly as never, centroid as never)) return centroid;
  const b = geoBounds(poly as never);
  const [w, s] = b[0];
  const [e, n] = b[1];
  if (!(e > w) || !(n > s)) return centroid; // antimeridian / degenerate → leave as-is
  let best: [number, number] | null = null;
  let bestD = Infinity;
  const N = 10;
  for (let i = 1; i < N; i++) {
    for (let j = 1; j < N; j++) {
      const lng = w + ((e - w) * i) / N;
      const lat = s + ((n - s) * j) / N;
      if (geoContains(poly as never, [lng, lat] as never)) {
        const d = (lng - centroid[0]) ** 2 + (lat - centroid[1]) ** 2;
        if (d < bestD) {
          bestD = d;
          best = [lng, lat];
        }
      }
    }
  }
  return best ?? centroid;
}

// Per-ISO cache of the country's guaranteed-interior GEOGRAPHIC point. This value is projection-
// independent, so it is computed ONCE per country for the whole session — every map size, every
// resize and the desktop+mobile pair all reuse it. The geoContains search must never run per
// render: doing point-in-polygon per render across all maps is what caused a multi-second stall.
const interiorGeoCache = new Map<string | number, [number, number]>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function countryInteriorLngLat(code: string | number, feature: any): [number, number] {
  const hit = interiorGeoCache.get(code);
  if (hit) return hit;
  const main = mainlandPolygon(feature);
  const cen = geoCentroid(main as never) as [number, number];
  const ip = interiorGeo(main, cen);
  interiorGeoCache.set(code, ip);
  return ip;
}

// Drop a country's FAR-FLUNG polygons (overseas territories: French Guiana, Réunion,
// the Canaries, Svalbard…) so they don't blow up the map's bounding box. Keeps nearby
// islands (Sicily, Sardinia, Balearics, the Greek isles, the British Isles).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function keepNearMainland(feature: any, maxDeg = 10): any {
  const g = feature?.geometry;
  if (!g || g.type !== 'MultiPolygon' || !Array.isArray(g.coordinates) || g.coordinates.length < 2) return feature;
  let bestI = 0;
  let bestA = -1;
  const cents = g.coordinates.map((coords: unknown, i: number) => {
    const poly = { type: 'Polygon', coordinates: coords };
    const a = geoArea(poly as never);
    if (a > bestA) {
      bestA = a;
      bestI = i;
    }
    return geoCentroid(poly as never) as [number, number];
  });
  const main = cents[bestI];
  const maxRad = (maxDeg * Math.PI) / 180;
  const kept = g.coordinates.filter((_: unknown, i: number) => geoDistance(cents[i] as never, main as never) <= maxRad);
  return { ...feature, geometry: { type: 'MultiPolygon', coordinates: kept } };
}

// A small deterministic island silhouette for the FEW countries with no map geometry at all
// (Tuvalu, Kosovo) so they still read as a little landmass, not a bare dot. Lives in lng/lat;
// the country-scaling below sizes it up to a visible shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function synthIsland(iso: string | number, lat: number, lng: number, seed: number): any {
  const R = 0.5;
  const n = 11;
  const ring: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const wob = 0.6 + 0.4 * Math.abs(Math.sin(seed * 2.3 + i * 1.7));
    // clockwise (negated sin) so d3-geo reads the ring as a SMALL island, not "whole world
    // minus a hole" (wrong winding sent the conic projection to ±∞).
    ring.push([lng + Math.cos(a) * R * wob, lat - Math.sin(a) * R * wob * 0.8]);
  }
  ring.push(ring[0]);
  return { type: 'Feature', id: Number(iso), properties: { name: 'synth' }, geometry: { type: 'Polygon', coordinates: [ring] } };
}

// cx/cy = raw bbox centre (the scale pivot's source); tx/ty = where that centre lands AFTER
// scaling (nudged inward so a scaled-up island near an edge can't spill off the frame).
type LandPath = { d: string; i: number; isLeader: boolean; scale?: number; cx?: number; cy?: number; tx?: number; ty?: number };
type Plaque = DesignOption & { ax: number; ay: number; x: number; y: number; left: number; top: number; moved: boolean; hasLand: boolean };

// The whole layout for one pixel box. Pure function of (w, h) + props → memoised per size.
function buildLayout(
  w: number,
  h: number,
  level: 'continent' | 'country' | 'place',
  options: DesignOption[],
  faces: boolean,
  landIsos: string[] | undefined,
  heroIso: string | undefined,
  // mobile renders only the land + a ranked LIST (never the on-map emblem positions), so it
  // passes false to skip the whole expensive placement pass.
  placeEmblems: boolean,
  // COUNTRY + PLACE stages: a resolver to the 50m geometry (small islands), loaded async; null
  // until it arrives (then the map re-renders with the real island outlines).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geo50: ((iso: string | number) => any) | null,
): {
  land: LandPath[];
  plaques: Plaque[];
  leaderVotes: number;
  ui: { faceCqw: number; leaderCqw: number; nameCqw: number; voteCqw: number };
  // cx/cy = bbox centre (used to size+centre the 'fill' face so it spans the whole spread);
  // ccx/ccy = land AREA centroid (the visual centre of mass — used to seat the 'inset' face).
  hero: { cx: number; cy: number; w: number; h: number; ccx: number; ccy: number } | null;
  // 'inset' = compact land → one centred, tilted face that sits cleanly WITHIN the country.
  // 'fill'  = scattered island groups / strongly elongated land → a COMPLETE face on each
  //           significant landmass (heroFaces); empty heroFaces → one spanning face (all-tiny).
  heroMode: 'inset' | 'fill';
  heroFaces: { cx: number; cy: number; size: number }[];
} {
  let landFeatures: never[]; // what we DRAW
  let fitFeatures: never[]; // what the projection is fit to (may differ for country)
  // PLACE stage: snapped on-land position for any city that falls just OFF the country's coarse
  // outline (keyed by place code). A coastal spot is nudged onto the shore; a true ocean island
  // gets a synthetic isle instead (handled below). Keeps every city dot on visible land.
  const placeSnap = new Map<string, [number, number]>();
  // PLACE stage: a place too far to draw at its true position (Hawaii for the USA, the Galápagos
  // for Ecuador, Madeira for Portugal…) is collected here and given a small synthetic island
  // pulled in to the country's edge AFTER the projection exists (so it stays in-frame, on land).
  const farPlaces: { code?: string; p: [number, number]; idx: number }[] = [];
  let placeMainCentroid: [number, number] | null = null;
  if (heroIso) {
    const f = (geo50 && geo50(heroIso)) || featureByIso(heroIso);
    // Build the country's MAIN drawn landmass: keep every polygon that is near the largest one
    // (the contiguous mainland + its close isles) OR is itself large (a second major landmass —
    // e.g. Malaysia's peninsula vs. Borneo, so the capital isn't pushed off-frame). Small far-
    // flung islands are NOT drawn at their true spot (they'd shrink the country); they become
    // edge-islands below. This replaces keepNearMainland for the hero (which trims by the LARGEST
    // polygon and so dropped Malaysia's whole peninsula).
    let mainFeat: unknown = f;
    const hg = (f as { geometry?: { type: string; coordinates: unknown[] } } | null)?.geometry;
    if (hg && hg.type === 'MultiPolygon' && Array.isArray(hg.coordinates) && hg.coordinates.length > 1) {
      const polys = hg.coordinates.map((c) => ({ type: 'Polygon', coordinates: c }));
      const areas = polys.map((p) => geoArea(p as never));
      const cents = polys.map((p) => geoCentroid(p as never) as [number, number]);
      let bi = 0;
      for (let i = 1; i < areas.length; i++) if (areas[i] > areas[bi]) bi = i;
      const keepRad = (10 * Math.PI) / 180;
      // a far polygon is drawn at its true spot ONLY if it's a major second landmass that actually
      // holds a candidate place (Malaysia's peninsula with Kuala Lumpur) — NOT empty far land like
      // Alaska, which would just expand the frame and shrink the rest with nothing to show there.
      const hasPlace = (poly: unknown) =>
        options.some((o) => o.lat != null && o.lng != null && geoContains(poly as never, [Number(o.lng), Number(o.lat)] as never));
      const kept = polys
        .filter((p, i) => geoDistance(cents[i] as never, cents[bi] as never) <= keepRad || (areas[i] >= 0.15 * areas[bi] && hasPlace(p)))
        .map((p) => p.coordinates);
      mainFeat = { ...(f as object), geometry: { type: 'MultiPolygon', coordinates: kept } };
    }
    landFeatures = (mainFeat ? [mainFeat] : []) as never[];
    const mainCen = mainFeat ? (geoCentroid(mainFeat as never) as [number, number]) : null;
    placeMainCentroid = mainCen;
    const FAR = (8 * Math.PI) / 180; // beyond this from the main land → an edge-island, not drawn in place
    if (mainFeat && mainCen) {
      options.forEach((o, idx) => {
        if (o.lat == null || o.lng == null) return;
        const p: [number, number] = [Number(o.lng), Number(o.lat)];
        if (geoContains(mainFeat as never, p as never)) return; // already on the drawn main land
        // a COASTAL spot just off the coarse outline → walk it onto the shore
        const dx = mainCen[0] - p[0];
        const dy = mainCen[1] - p[1];
        const dl = Math.hypot(dx, dy) || 1;
        let snapped: [number, number] | null = null;
        for (let d = 0.12; d <= 1.0; d += 0.12) {
          const q: [number, number] = [p[0] + (dx / dl) * d, p[1] + (dy / dl) * d];
          if (geoContains(mainFeat as never, q as never)) {
            snapped = q;
            break;
          }
        }
        if (snapped) {
          if (o.code) placeSnap.set(o.code, snapped);
          return;
        }
        // a NEAR ocean island the map omits (a Maldives atoll, Mallorca) → draw it at its true
        // position. A FAR one (Hawaii, Madeira, the Galápagos) is deferred to the edge-island pass.
        if (geoDistance(p as never, mainCen as never) <= FAR) landFeatures.push(synthIsland(`place-${idx}`, p[1], p[0], idx + 7) as never);
        else farPlaces.push({ code: o.code, p, idx });
      });
    }
    fitFeatures = landFeatures;
  } else if (level === 'continent') {
    // CONTINENT view: one merged land geometry → the world reads as CONTINENTS, with no
    // internal country borders (only the coastlines glow gold).
    landFeatures = [mergedLand] as never[];
    fitFeatures = landFeatures;
  } else if (level === 'country') {
    // Every voting country gets a REAL outline: 50m (has the small islands) → 110m → a small
    // synthetic island at its lat/lng (only Tuvalu/Kosovo need that) — so NONE is a bare dot.
    landFeatures = options
      .map((o, idx) => {
        if (!o.code) return null;
        let f = (geo50 && geo50(o.code)) || featureByIso(o.code);
        if (!f && o.lat != null && o.lng != null) f = synthIsland(o.code, Number(o.lat), Number(o.lng), idx + 1);
        return f;
      })
      .filter(Boolean) as never[];
    // Fit the projection to the MAINLAND (110m) so a country's far OVERSEAS bits don't blow up
    // the frame — BUT also fold in a single point for every voting nation that has NO 110m
    // mainland (the island / micro states: Palau, Nauru, the Micronesian north, Malta, Cape
    // Verde, the Seychelles…) so the frame still ENCOMPASSES them. Without this their land + pin
    // project off the edge and vanish — e.g. Palau at 7.5°N sat above an Oceania frame fitted
    // only to southern Australia/NZ, so it showed neither land nor dot.
    const set = landIsos ? new Set(landIsos.map((i) => Number(i))) : null;
    const mainland = (set
      ? (worldNoAntarctica.features as never[]).filter((f) => set.has(Number((f as { id?: string | number }).id)))
      : landFeatures) as never[];
    // ISOs that actually HAVE a 110m mainland in the fit. A country in landIsos but absent here is
    // an island nation with no 110m geometry (Palau, Fidschi, the Pacific/Caribbean micro-states) —
    // it MUST still contribute an anchor point or it falls off the frame entirely (it's neither in
    // `mainland` nor, previously, in the anchors). So skip only countries truly covered by mainland.
    const mainlandIsos = new Set(mainland.map((f) => Number((f as { id?: string | number }).id)));
    const anchorPts: never[] = [];
    for (const o of options) {
      if (o.code && mainlandIsos.has(Number(o.code))) continue; // already framed by its 110m mainland
      let ll: [number, number] | null = null;
      if (o.code) {
        const f = (geo50 && geo50(o.code)) || featureByIso(o.code);
        if (f) ll = mainlandCentroid(f);
      }
      if (!ll && o.lat != null && o.lng != null) ll = [Number(o.lng), Number(o.lat)];
      if (ll) anchorPts.push({ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: ll } } as never);
    }
    fitFeatures = [...mainland, ...anchorPts] as never[];
  } else if (landIsos) {
    const set = new Set(landIsos.map((i) => Number(i)));
    landFeatures = (worldNoAntarctica.features as never[]).filter((f) => set.has(Number((f as { id?: string | number }).id)));
    fitFeatures = landFeatures;
  } else {
    landFeatures = worldNoAntarctica.features as never[];
    fitFeatures = landFeatures;
  }
  if (level !== 'continent' && level !== 'place') {
    landFeatures = landFeatures.map((f) => keepNearMainland(f)) as never[];
    fitFeatures = fitFeatures.map((f) => keepNearMainland(f)) as never[];
  }
  const landFC = { type: 'FeatureCollection', features: landFeatures };
  const fitFC = { type: 'FeatureCollection', features: fitFeatures };

  let leaderCode: string | null = null;
  let leaderVotes = 0;
  for (const o of options) {
    if (o.votes > leaderVotes) {
      leaderVotes = o.votes;
      leaderCode = o.code ?? null;
    }
  }
  const leaderIsoNum = level === 'country' && leaderCode && leaderVotes > 0 ? Number(leaderCode) : null;

  // Face + label sizes scale DOWN as a continent gets more countries, so even the dense
  // ones (Africa 54, Asia 48) fit every face-WITH-LABEL without overlap.
  let faceUI = { faceCqw: 4.8, leaderCqw: 5.0, nameCqw: 0.88, voteCqw: 1.02 };
  if (level === 'country') {
    const n = options.length;
    const fc = n >= 46 ? 3.4 : n >= 34 ? 3.9 : n >= 24 ? 4.4 : 4.8;
    faceUI = { faceCqw: fc, leaderCqw: +(fc + 0.2).toFixed(2), nameCqw: +(fc * 0.185).toFixed(2), voteCqw: +(fc * 0.215).toFixed(2) };
  }
  // COUNTRY land size scales with how many countries there are: dense continents (Europe/
  // Africa/Asia) keep a big margin ring for all their faces; SPARSE ones (South America 12,
  // Oceania 14) get a much SMALLER margin → the land fills the free space, so each individual
  // country is clearly visible instead of a dot at the end of a connector line.
  const countryPad = options.length >= 38 ? 0.26 : options.length >= 20 ? 0.18 : 0.12;
  const pad = level === 'country' ? Math.round(Math.min(w, h) * countryPad) : level === 'place' ? Math.round(Math.min(w, h) * 0.18) : 28;
  const ext: [[number, number], [number, number]] = [
    [pad, pad],
    [w - pad, h - pad],
  ];
  let proj;
  if (level === 'continent') {
    proj = geoNaturalEarth1().fitExtent(ext, worldNoAntarctica as never);
  } else if (level === 'country') {
    const c = (geoCentroid(fitFC as never) as [number, number]) ?? [10, 50];
    proj = geoConicConformal()
      .rotate([-c[0], 0])
      .center([0, c[1]])
      .parallels([c[1] - 12, c[1] + 12])
      .fitExtent(ext, (fitFeatures.length ? fitFC : worldNoAntarctica) as never);
  } else {
    proj = geoMercator().fitExtent(ext, (landFeatures.length ? landFC : worldNoAntarctica) as never);
  }
  const pth = geoPath(proj);
  if (level === 'country') {
    // Guard: a conic projection can send a stray far-flung polygon (an overseas territory the
    // trimming missed) to ±∞. Drop any country whose projected box blew up so ONE bad feature
    // can't poison the land bbox or the placement mask.
    landFeatures = landFeatures.filter((f) => {
      const b = pth.bounds(f as never);
      return (
        Number.isFinite(b[0][0]) &&
        Number.isFinite(b[0][1]) &&
        Number.isFinite(b[1][0]) &&
        Number.isFinite(b[1][1]) &&
        b[1][0] - b[0][0] < w * 2.5 &&
        b[1][1] - b[0][1] < h * 2.5
      );
    }) as never[];
  }
  // PLACE 'edge-island' pass: a place too FAR to draw at its true spot (Hawaii, the Galápagos,
  // Madeira, Okinawa…) gets a small synthetic island pulled in to the country's edge, in the
  // place's true compass direction, so its dot always sits on visible land INSIDE the frame
  // ('kompakt am Landrand') instead of floating in open sea or off the map. Done now that the
  // projection exists: clamp a point along (place → land-centre) into the frame, invert it back
  // to lng/lat, drop a synth isle there and route the dot onto it. landFC.features === landFeatures
  // (same array), so the pushes are seen by the draw loop and the hero bbox below.
  if (level === 'place' && farPlaces.length && placeMainCentroid) {
    const cs = proj(placeMainCentroid as never);
    const lb0 = pth.bounds(landFC as never);
    const cx0 = cs && Number.isFinite(cs[0]) ? cs[0] : (lb0[0][0] + lb0[1][0]) / 2;
    const cy0 = cs && Number.isFinite(cs[1]) ? cs[1] : (lb0[0][1] + lb0[1][1]) / 2;
    const reach = Math.min(w, h) * 0.4;
    const mX = Math.min(w, h) * 0.1;
    for (const fp of farPlaces) {
      const ps = proj(fp.p as never);
      let dx = ps && Number.isFinite(ps[0]) ? ps[0] - cx0 : 0;
      let dy = ps && Number.isFinite(ps[1]) ? ps[1] - cy0 : 0;
      const dl = Math.hypot(dx, dy) || 1;
      dx /= dl;
      dy /= dl;
      const ex = Math.max(mX, Math.min(w - mX, cx0 + dx * reach));
      const ey = Math.max(mX, Math.min(h - mX, cy0 + dy * reach));
      const ll = proj.invert ? proj.invert([ex, ey] as never) : null;
      if (ll && Number.isFinite(ll[0]) && Number.isFinite(ll[1])) {
        landFeatures.push(synthIsland(`far-${fp.idx}`, ll[1], ll[0], fp.idx + 31) as never);
        if (fp.code) placeSnap.set(fp.code, [ll[0], ll[1]]);
      }
    }
  }
  const land: LandPath[] = [];
  // PLACE stage: the projected VISUAL box (after any island up-scaling) of every drawn land
  // polygon — so a COMPLETE face can be fitted into each significant landmass below.
  const placePolys: { cx: number; cy: number; w: number; h: number }[] = [];
  // COUNTRY stage bookkeeping: which ISOs actually got a drawn outline, and — for the tiny
  // countries we scale up around their bbox centre — that exact visual centre, so the map pin
  // can be planted on the centre of the *visible* (scaled) shape instead of drifting off it.
  const drawnIsos = new Set<number>();
  const scaledCentre = new Map<number, { cx: number; cy: number; tx: number; ty: number; s: number }>();
  if (level === 'place') {
    // Split the hero country into individual polygons so SMALL islands (Balearics, the Greek
    // isles, Caribbean specks…) can be scaled UP around their own centroid → the city dot fits
    // on a recognisable island shape instead of the island vanishing under the marker.
    const minIslandPx = Math.max(38, Math.min(w, h) * 0.062);
    let idx = 0;
    for (const f of landFeatures) {
      const g = (f as { geometry?: { type: string; coordinates: unknown[] } }).geometry;
      const polys =
        g && g.type === 'MultiPolygon' ? g.coordinates.map((c) => ({ type: 'Polygon', coordinates: c })) : g ? [g] : [];
      for (const poly of polys) {
        const d = pth(poly as never);
        if (!d) continue;
        const b = pth.bounds(poly as never);
        const maxDim = Math.max(b[1][0] - b[0][0], b[1][1] - b[0][1]);
        const cxp = (b[0][0] + b[1][0]) / 2;
        const cyp = (b[0][1] + b[1][1]) / 2;
        const lp: LandPath = { d, i: idx++, isLeader: false };
        let sc = 1;
        if (maxDim > 0 && maxDim < minIslandPx) {
          sc = Math.min(13, minIslandPx / maxDim);
          lp.scale = sc;
          lp.cx = cxp;
          lp.cy = cyp;
        }
        placePolys.push({ cx: cxp, cy: cyp, w: (b[1][0] - b[0][0]) * sc, h: (b[1][1] - b[0][1]) * sc });
        land.push(lp);
      }
    }
  } else if (level === 'country') {
    // each country drawn from its own (50m) feature; SMALL countries (Malta, the Maldives, the
    // Caribbean / Pacific micro-nations…) are scaled UP around their centroid so the outline reads
    // as a real LAND SHAPE — not a bare dot — and the pin sits on it. Big countries are untouched.
    // A generous floor + high cap so even a speck like the Maldives becomes a clearly visible isle.
    const minCountryPx = Math.max(40, Math.min(w, h) * 0.066);
    landFeatures.forEach((f, i) => {
      const d = pth(f as never);
      if (!d) return;
      const b = pth.bounds(f as never);
      const maxDim = Math.max(b[1][0] - b[0][0], b[1][1] - b[0][1]);
      const iso = Number((f as { id?: string | number }).id);
      const isLeader = leaderIsoNum != null && iso === leaderIsoNum;
      const cx = (b[0][0] + b[1][0]) / 2;
      const cy = (b[0][1] + b[1][1]) / 2;
      const lp: LandPath = { d, i, isLeader };
      if (maxDim > 0 && maxDim < minCountryPx) {
        const s = Math.min(28, minCountryPx / maxDim);
        // nudge the (scaled) shape's centre inward so an enlarged island at the frame edge
        // (e.g. Palau in the far north of Oceania) can't get pushed off-screen.
        const halfW = ((b[1][0] - b[0][0]) / 2) * s;
        const halfH = ((b[1][1] - b[0][1]) / 2) * s;
        const m = 5;
        const tx = Math.max(m + halfW, Math.min(w - m - halfW, cx));
        const ty = Math.max(m + halfH, Math.min(h - m - halfH, cy));
        lp.scale = s;
        lp.cx = cx;
        lp.cy = cy;
        lp.tx = tx;
        lp.ty = ty;
        if (Number.isFinite(iso)) scaledCentre.set(iso, { cx, cy, tx, ty, s });
      }
      if (Number.isFinite(iso)) drawnIsos.add(iso);
      land.push(lp);
    });
  } else {
    landFeatures.forEach((f, i) => {
      const d = pth(f as never);
      if (!d) return;
      const isLeader = leaderIsoNum != null && Number((f as { id?: string | number }).id) === leaderIsoNum;
      land.push({ d, i, isLeader });
    });
  }

  // The hero country's projected bounding box — used on the PLACE stage to lay the flag-face
  // into the land as a tilted watermark, centred and sized to the country.
  let hero: { cx: number; cy: number; w: number; h: number; ccx: number; ccy: number } | null = null;
  let heroMode: 'inset' | 'fill' = 'inset';
  if (heroIso && landFeatures.length) {
    const b = pth.bounds(landFC as never);
    const cx = (b[0][0] + b[1][0]) / 2;
    const cy = (b[0][1] + b[1][1]) / 2;
    // area centroid = the land's visual centre of mass. The bbox centre is skewed by thin
    // peninsulas / fjords (Islands Westfjorde ziehen es nach NW), which made the inset face look
    // off-centre; the area centroid sits where the bulk of the land actually is. NaN → bbox centre.
    const c = pth.centroid(landFC as never) as [number, number];
    hero = {
      cx,
      cy,
      w: b[1][0] - b[0][0],
      h: b[1][1] - b[0][1],
      ccx: Number.isFinite(c?.[0]) ? c[0] : cx,
      ccy: Number.isFinite(c?.[1]) ? c[1] : cy,
    };
    // Decide how to lay the flag-face into the land. fillFrac = how much of the country's bounding
    // box is ACTUALLY land (vs. open sea between scattered islands); aspect = how elongated it is.
    // A country whose land barely fills its box (Griechenland, Indonesien, Philippinen, Malediven…)
    // or is strongly elongated / curved (Italiens Stiefel, Norwegen, Japans Bogen, Chile) can't carry
    // a single centred face — it would float in the sea between the islands. Those switch to 'fill'.
    if (hero.w > 0 && hero.h > 0) {
      let landAreaPx = 0;
      for (const f of landFeatures) landAreaPx += Math.abs(pth.area(f as never));
      const fillFrac = landAreaPx / (hero.w * hero.h);
      const aspect = Math.max(hero.w, hero.h) / Math.max(1, Math.min(hero.w, hero.h));
      if (fillFrac < 0.36 || aspect >= 1.85) heroMode = 'fill';
    }
  }

  // FILL mode: instead of ONE big square face that gets cropped top/bottom on a wide country
  // (USA) or floats between two landmasses (Malaysia), drop a COMPLETE face onto EACH significant
  // landmass, sized to its SHORT side so the whole face is visible (never cropped) — one per
  // "field" (Borneo + the peninsula, each Japanese island…). Polygons too small to carry a
  // legible face are left as just land + dot. If NOTHING qualifies (all-tiny archipelagos like
  // the Malediven) heroFaces stays empty and the JSX falls back to the single spanning face.
  // How the flag-face(s) sit in a 'fill' country (see also the JSX spanning fallback):
  //  • 2+ significant landmasses (Malaysia = peninsula+Borneo, Japans Inseln) → one COMPLETE face
  //    per landmass, sized to its short side (never cropped).
  //  • exactly 1 significant landmass that is WIDE/TALL (USA, Italiens Stiefel) → one complete face
  //    fitted to its short side (a square spanning face would crop it top/bottom).
  //  • a single landmass with a roughly SQUARE spread of scattered isles (Griechenland) OR all-tiny
  //    square archipelagos → heroFaces stays EMPTY and the JSX lays ONE big face spanning the whole
  //    island group (the look the user liked) — mild crop is fine on a square-ish outline.
  //  • very thin land with no big-enough piece (Chile) → one small complete face on the largest.
  const heroFaces: { cx: number; cy: number; size: number }[] = [];
  if (heroMode === 'fill' && placePolys.length && hero) {
    const faceThresh = Math.min(w, h) * 0.14;
    const sig = placePolys.filter((pp) => Math.min(pp.w, pp.h) >= faceThresh);
    const aspect = Math.max(hero.w, hero.h) / Math.max(1, Math.min(hero.w, hero.h));
    if (sig.length >= 2) {
      for (const pp of sig) heroFaces.push({ cx: pp.cx, cy: pp.cy, size: Math.min(pp.w, pp.h) * 0.85 });
    } else if (sig.length === 1 && aspect >= 1.7) {
      const pp = sig[0];
      heroFaces.push({ cx: pp.cx, cy: pp.cy, size: Math.min(pp.w, pp.h) * 0.85 });
    } else if (sig.length === 0 && aspect >= 1.7) {
      let big = placePolys[0];
      for (const pp of placePolys) if (pp.w * pp.h > big.w * big.h) big = pp;
      heroFaces.push({ cx: big.cx, cy: big.cy, size: Math.min(big.w, big.h) * 0.85 });
    }
  }

  // emblem anchors (true projected positions)
  const anchored = options
    .map((o) => {
      let ll: [number, number] | null = null;
      if (level === 'continent') {
        const c = o.code ? continentByKey(o.code) : null;
        if (c) ll = [c.lng, c.lat];
      } else if (o.code && (level === 'country' || faces)) {
        const f = (geo50 && geo50(o.code)) || featureByIso(o.code);
        if (f) ll = mainlandCentroid(f);
        else if (o.lat != null && o.lng != null) ll = [Number(o.lng), Number(o.lat)];
      } else if (o.lat != null && o.lng != null) {
        // PLACE: a coastal spot just off the coarse coastline is snapped onto the shore so its
        // dot sits on land (ocean islands instead got their own isle in the land step above).
        ll = (o.code && placeSnap.get(o.code)) || [Number(o.lng), Number(o.lat)];
      }
      if (!ll) return null;
      const xy = proj(ll);
      if (!xy) return null;
      let ax = xy[0];
      let ay = xy[1];
      // COUNTRY: plant the pin on a point GUARANTEED to be inside the country's drawn mainland,
      // not on its raw centroid (which is offshore for concave countries) — so no dot ever sits
      // in empty sea. For a country we scaled up, run that interior point through the SAME scale
      // transform the land path uses, so the pin lands inside the enlarged blob.
      if (level === 'country' && o.code) {
        const f = (geo50 && geo50(o.code)) || featureByIso(o.code);
        // interior point is memoised per ISO (projection-independent) → no per-render geoContains
        const ip = f ? proj(countryInteriorLngLat(o.code, f)) : null;
        if (ip) {
          ax = ip[0];
          ay = ip[1];
          const sc = scaledCentre.get(Number(o.code));
          if (sc) {
            // same transform the land uses: scale about the raw centre, recentred at the
            // (edge-clamped) target so the pin stays on the visible, on-screen blob.
            ax = sc.tx + sc.s * (ip[0] - sc.cx);
            ay = sc.ty + sc.s * (ip[1] - sc.cy);
          }
        }
      }
      const hasLand = level === 'country' ? (o.code ? drawnIsos.has(Number(o.code)) : false) : true;
      return { ...o, ax, ay, x: ax, y: ay, hasLand };
    })
    .filter(Boolean) as (DesignOption & { ax: number; ay: number; x: number; y: number; hasLand: boolean })[];

  if (placeEmblems && (level === 'country' || level === 'place') && anchored.length > 1) {
    const isPlace = level === 'place';
    // Everything is sized off EM. COUNTRY = one face width; PLACE = a base unit for the
    // city-name labels. Grid spacing, land-dilation and de-overlap stay in lockstep at any
    // measured size — for PLACE this pushes each label OFF the country into the black ring,
    // in the city's geographic direction, joined to its dot by a line (not too close/far).
    const EM = isPlace ? w * 0.05 : w * (faceUI.faceCqw / 100);
    const clearR = EM * (isPlace ? 0.42 : 0.64);
    // ── Land mask: RASTERISE the land into a tiny canvas ONCE (the browser fills the polygons
    // in native code → sub-millisecond AND exact, so thin/small countries are captured), then
    // DILATE it so every emblem keeps a clear MARGIN from each coastline. Used for ALL land
    // tests below (slot clearing AND de-overlap). This replaced ~0.5 M geoContains/map. ──
    const cell = EM * 0.22;
    const mC = Math.min(180, Math.max(48, Math.round(w / cell)));
    const mR = Math.min(120, Math.max(30, Math.round(h / cell)));
    const baseMask = new Uint8Array(mC * mR);
    if (typeof document !== 'undefined') {
      const cv = document.createElement('canvas');
      cv.width = mC;
      cv.height = mR;
      const cx = cv.getContext('2d', { willReadFrequently: true });
      if (cx) {
        cx.scale(mC / w, mR / h);
        const rp = geoPath(proj, cx);
        cx.beginPath();
        for (const f of landFeatures) rp(f as never);
        cx.fill();
        const img = cx.getImageData(0, 0, mC, mR).data;
        for (let i = 0; i < mC * mR; i++) baseMask[i] = img[i * 4 + 3] > 12 ? 1 : 0;
      }
    }
    const dil = 2;
    const landMask = new Uint8Array(mC * mR);
    for (let r = 0; r < mR; r++)
      for (let c = 0; c < mC; c++) {
        let on = 0;
        for (let dr = -dil; dr <= dil && !on; dr++)
          for (let dc = -dil; dc <= dil && !on; dc++) {
            const rr = r + dr;
            const cc = c + dc;
            if (rr >= 0 && cc >= 0 && rr < mR && cc < mC && baseMask[rr * mC + cc]) on = 1;
          }
        landMask[r * mC + c] = on;
      }
    const landAt = (x: number, y: number): boolean => {
      const c = Math.floor((x / w) * mC);
      const r = Math.floor((y / h) * mR);
      if (c < 0 || r < 0 || c >= mC || r >= mR) return false;
      return landMask[r * mC + c] === 1;
    };
    // A slot is usable only if the emblem's whole footprint clears the (dilated) land.
    const clearOf = (x: number, y: number, r: number): boolean => {
      if (landAt(x, y)) return false;
      for (let a = 0; a < 8; a++) {
        const ang = (a / 8) * Math.PI * 2;
        if (landAt(x + Math.cos(ang) * r, y + Math.sin(ang) * r)) return false;
      }
      if (landAt(x, y + r * 1.35) || landAt(x - r * 0.6, y + r * 1.1) || landAt(x + r * 0.6, y + r * 1.1)) return false;
      return true;
    };
    const lb = geoPath(proj).bounds(landFC as never);
    const lcx = (lb[0][0] + lb[1][0]) / 2;
    const lcy = (lb[0][1] + lb[1][1]) / 2;
    // COUNTRY: assign each face to a grid slot across the whole black space. PLACE skips this
    // (its few city labels are pushed radially just off the coast below, so they hug the land
    // in the city's direction instead of flying into the far side-bars).
    if (!isPlace) {
    // grid spacing ≥ ~1.7 face-widths in both axes → neighbours never collide, with enough
    // free slots for all countries across whatever aspect ratio the screen has
    // row spacing must exceed the emblem HEIGHT (face + 2-line label ≈ 1.7·EM) so vertically
    // adjacent emblems' labels never touch; columns can sit a little tighter.
    const cols = Math.max(7, Math.round(w / (EM * 1.7)));
    const rows = Math.max(4, Math.round(h / (EM * 1.98)));
    const gmX = Math.round(EM * 1.0);
    const gmY = Math.round(EM * 0.95);
    const stepX = (w - 2 * gmX) / (cols - 1);
    const stepY = (h - 2 * gmY) / (rows - 1);
    const hash = (k: number) => {
      const s = Math.sin(k * 127.1) * 43758.5453;
      return s - Math.floor(s);
    };
    const slots: { x: number; y: number; free: boolean }[] = [];
    for (let r = 0; r < rows; r++) {
      const off = (r % 2) * stepX * 0.5; // brick offset on odd rows
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const sx = gmX + c * stepX + off + (hash(idx + 1) - 0.5) * stepX * 0.28;
        const sy = gmY + r * stepY + (hash(idx + 99) - 0.5) * stepY * 0.28;
        if (sx < gmX * 0.5 || sx > w - gmX * 0.5) continue;
        if (clearOf(sx, sy, clearR)) slots.push({ x: sx, y: sy, free: true });
      }
    }
    // Per-country target: push the real country position OUTWARD (cartesian, by a factor
    // that grows with how far out it already is) so central/landlocked countries snap to
    // the nearest black space while peripheral ones reach the edges/corners.
    const spread = Math.max(w, h) * (isPlace ? 0.1 : 0.19); // direction-stable outward scale
    const targets = anchored.map((a) => {
      const dx = a.ax - lcx;
      const dy = a.ay - lcy;
      const r = Math.hypot(dx, dy);
      // gentler outward push than before → emblems seat nearer their own country, so tether
      // lines stay shorter and cross each other less (cleaner, less "wire-jungle" look).
      const k = Math.min(isPlace ? 5 : 4, (r / spread) * (r / spread));
      return { tx: a.ax + dx * k, ty: a.ay + dy * k };
    });
    const pairs: { qi: number; si: number; d: number }[] = [];
    for (let qi = 0; qi < anchored.length; qi++) {
      for (let si = 0; si < slots.length; si++) {
        pairs.push({ qi, si, d: Math.hypot(targets[qi].tx - slots[si].x, targets[qi].ty - slots[si].y) });
      }
    }
    pairs.sort((a, b) => a.d - b.d);
    const done = new Array(anchored.length).fill(false);
    for (const p of pairs) {
      if (!done[p.qi] && slots[p.si].free) {
        done[p.qi] = true;
        slots[p.si].free = false;
        anchored[p.qi].x = slots[p.si].x;
        anchored[p.qi].y = slots[p.si].y;
      }
    }
    for (let qi = 0; qi < anchored.length; qi++) {
      if (done[qi]) continue;
      let best = -1;
      let bd = Infinity;
      for (let si = 0; si < slots.length; si++) {
        if (!slots[si].free) continue;
        const d = Math.hypot(targets[qi].tx - slots[si].x, targets[qi].ty - slots[si].y);
        if (d < bd) {
          bd = d;
          best = si;
        }
      }
      if (best >= 0) {
        slots[best].free = false;
        anchored[qi].x = slots[best].x;
        anchored[qi].y = slots[best].y;
        done[qi] = true;
      }
    }
    // 2-opt: swap two emblems' slots whenever it brings BOTH closer to their own targets.
    for (let pass = 0; pass < 10; pass++) {
      let improved = false;
      for (let i = 0; i < anchored.length; i++) {
        const ai = anchored[i];
        const ti = targets[i];
        for (let j = i + 1; j < anchored.length; j++) {
          const aj = anchored[j];
          const tj = targets[j];
          const cur = Math.hypot(ai.x - ti.tx, ai.y - ti.ty) + Math.hypot(aj.x - tj.tx, aj.y - tj.ty);
          const swp = Math.hypot(aj.x - ti.tx, aj.y - ti.ty) + Math.hypot(ai.x - tj.tx, ai.y - tj.ty);
          if (swp + 1e-6 < cur) {
            const tx = ai.x;
            const ty = ai.y;
            ai.x = aj.x;
            ai.y = aj.y;
            aj.x = tx;
            aj.y = ty;
            improved = true;
          }
        }
      }
      if (!improved) break;
    }
    } // end COUNTRY-only slot assignment
    // ── Label-aware de-overlap: each emblem reserves the width of its NAME label, and both
    // the face AND the label below it are kept off the land (uses the dilated `landAt` mask
    // built above). ──
    // per-emblem half-width = the WIDER of its two label lines (the votes line uses a
    // bigger font, so short-named countries are limited by it), never less than a face
    const nameCharW = EM * (isPlace ? 0.085 : 0.11);
    const voteCharW = EM * (isPlace ? 0.1 : 0.13);
    const padW = EM * (isPlace ? 0.32 : 0.42);
    const faceHW = EM * (isPlace ? 0.22 : 0.55);
    const hh = EM * (isPlace ? 0.42 : 0.84); // half-height of the item, centred on the point
    const hws = anchored.map((a) => {
      // place's votes line carries the word " Stimmen" → ~8 chars wider than the bare number
      const voteLen = fmt(a.votes).length + (isPlace ? 8 : 0);
      const lineW = Math.max(a.label.length * nameCharW, voteLen * voteCharW);
      return Math.max(faceHW, (lineW + padW) / 2);
    });
    const gap = EM * 0.16;
    const onLandBox = (x: number, y: number, hw: number): boolean => {
      const xs = [-hw, -hw * 0.5, 0, hw * 0.5, hw];
      const ys = [-hh, -hh * 0.4, hh * 0.1, hh * 0.55, hh];
      for (const ox of xs) for (const oy of ys) if (landAt(x + ox, y + oy)) return true;
      return false;
    };
    const place = (i: number, nx: number, ny: number): boolean => {
      const hw = hws[i];
      if (nx - hw < 2 || nx + hw > w - 2 || ny - hh < 2 || ny + hh > h - 2) return false;
      if (onLandBox(nx, ny, hw)) return false;
      anchored[i].x = nx;
      anchored[i].y = ny;
      return true;
    };
    const pushOffLand = () => {
      for (let i = 0; i < anchored.length; i++) {
        if (!onLandBox(anchored[i].x, anchored[i].y, hws[i])) continue;
        let dx = anchored[i].x - lcx;
        let dy = anchored[i].y - lcy;
        const dl = Math.hypot(dx, dy) || 1;
        dx /= dl;
        dy /= dl;
        for (let step = 1; step <= 80; step++) {
          if (place(i, anchored[i].x + dx * step * EM * 0.2, anchored[i].y + dy * step * EM * 0.2)) break;
        }
      }
    };
    const separate = () => {
      for (let it = 0; it < 160; it++) {
        let moved = false;
        for (let i = 0; i < anchored.length; i++) {
          for (let j = i + 1; j < anchored.length; j++) {
            const a = anchored[i];
            const b = anchored[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const ox = hws[i] + hws[j] + gap - Math.abs(dx);
            const oy = 2 * hh + gap - Math.abs(dy);
            if (ox > 0 && oy > 0) {
              const sepX = () => {
                const push = (ox + 2) / 2;
                const s = dx < 0 ? -1 : 1;
                return place(i, a.x - push * s, a.y) || place(j, b.x + push * s, b.y);
              };
              const sepY = () => {
                const push = (oy + 2) / 2;
                const s = dy < 0 ? -1 : 1;
                return place(i, a.x, a.y - push * s) || place(j, b.x, b.y + push * s);
              };
              if (ox <= oy) {
                if (!sepX()) sepY();
              } else {
                if (!sepY()) sepX();
              }
              moved = true;
            }
          }
        }
        if (!moved) break;
      }
    };
    // keep face AND label off the land, then resolve overlaps; a few rounds to settle
    for (let round = 0; round < 3; round++) {
      pushOffLand();
      separate();
    }
    // final guarantee: any emblem still on land or overlapping is relocated to the NEAREST
    // free lattice point (land-clear + clear of every other emblem's box). Handles the rare
    // straggler in a very dense cluster (e.g. the Gulf states) that local nudging can't seat.
    const overlapsOthers = (i: number, x: number, y: number): boolean => {
      for (let j = 0; j < anchored.length; j++) {
        if (j === i) continue;
        if (Math.abs(anchored[j].x - x) < hws[i] + hws[j] + gap && Math.abs(anchored[j].y - y) < 2 * hh + gap) return true;
      }
      return false;
    };
    const stepL = EM * 0.45;
    // PLACE: keep relocation within a band around the country so a label never jumps to the
    // far side-bar (it must stay close to its city). COUNTRY: the whole frame is fair game.
    const rbX0 = isPlace ? Math.max(hws[0] + 2, lb[0][0] - EM * 2.4) : 0;
    const rbX1 = isPlace ? lb[1][0] + EM * 2.4 : w;
    const rbY0 = isPlace ? Math.max(hh + 2, lb[0][1] - EM * 2.4) : 0;
    const rbY1 = isPlace ? lb[1][1] + EM * 2.4 : h;
    for (let i = 0; i < anchored.length; i++) {
      if (!onLandBox(anchored[i].x, anchored[i].y, hws[i]) && !overlapsOthers(i, anchored[i].x, anchored[i].y)) continue;
      let best: [number, number] | null = null;
      let bd = Infinity;
      for (let y = Math.max(hh + 2, rbY0); y <= Math.min(h - hh - 2, rbY1); y += stepL) {
        for (let x = Math.max(hws[i] + 2, rbX0); x <= Math.min(w - hws[i] - 2, rbX1); x += stepL) {
          if (onLandBox(x, y, hws[i]) || overlapsOthers(i, x, y)) continue;
          const d = Math.hypot(x - anchored[i].x, y - anchored[i].y);
          if (d < bd) {
            bd = d;
            best = [x, y];
          }
        }
      }
      if (best) {
        anchored[i].x = best[0];
        anchored[i].y = best[1];
      }
    }
    // PLACE: make sure every label sits far enough from its city dot that the DOT and a bit of
    // the connector LINE peek out from under the label box (else a label that landed right on
    // its dot — e.g. an island like Mallorca — hides both). Push it further outward if needed.
    if (isPlace) {
      for (let i = 0; i < anchored.length; i++) {
        const a = anchored[i];
        const minGap = Math.max(hh, hws[i]) + EM * 0.45;
        if (Math.hypot(a.x - a.ax, a.y - a.ay) >= minGap) continue;
        let ox = a.ax - lcx;
        let oy = a.ay - lcy;
        const ol = Math.hypot(ox, oy) || 1;
        ox /= ol;
        oy /= ol;
        for (let step = minGap; step <= minGap + EM * 5; step += EM * 0.3) {
          const nx = a.ax + ox * step;
          const ny = a.ay + oy * step;
          if (nx - hws[i] < 2 || nx + hws[i] > w - 2 || ny - hh < 2 || ny + hh > h - 2) continue;
          if (!onLandBox(nx, ny, hws[i]) && !overlapsOthers(i, nx, ny)) {
            a.x = nx;
            a.y = ny;
            break;
          }
        }
      }
    }
  } else if (placeEmblems) {
    const minDist = level === 'place' ? Math.max(w, h) * 0.13 : Math.max(w, h) * 0.11;
    for (let it = 0; it < 90; it++) {
      for (let i = 0; i < anchored.length; i++) {
        for (let j = i + 1; j < anchored.length; j++) {
          const a = anchored[i];
          const b = anchored[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.01;
          if (d < minDist) {
            const push = (minDist - d) / 2;
            a.x -= (dx / d) * push;
            a.y -= (dy / d) * push;
            b.x += (dx / d) * push;
            b.y += (dy / d) * push;
          }
        }
      }
      for (const q of anchored) {
        q.x += (q.ax - q.x) * 0.012;
        q.y += (q.ay - q.y) * 0.012;
        q.x = Math.max(60, Math.min(w - 60, q.x));
        q.y = Math.max(36, Math.min(h - 30, q.y));
      }
    }
  }

  const plaques: Plaque[] = anchored.map((p) => ({
    ...p,
    left: (p.x / w) * 100,
    top: (p.y / h) * 100,
    moved: level === 'country' || level === 'place' ? true : Math.hypot(p.x - p.ax, p.y - p.ay) > 8,
  }));
  return { land, plaques, leaderVotes, ui: faceUI, hero, heroMode, heroFaces };
}

const Defs = (
  <defs>
    <filter id="vd-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2.6" />
    </filter>
    <filter id="vd-lead" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
    {/* Land = a softly-lit warm bronze relief (NOT near-black) so every country reads as a
        distinct gold landmass against the black velvet, not a black shape lost in the void. */}
    <linearGradient id="vd-land" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#473821" />
      <stop offset="55%" stopColor="#2c2212" />
      <stop offset="100%" stopColor="#20180d" />
    </linearGradient>
    {/* Pin halo: a small luminous glow so even a 1-pixel micro-state (Monaco, Vatikan…) has a
        clear, intentional gold presence on the map instead of an invisible fleck. */}
    <radialGradient id="vd-pin">
      <stop offset="0%" stopColor={GOLD_BRIGHT} stopOpacity={0.55} />
      <stop offset="42%" stopColor={GOLD} stopOpacity={0.22} />
      <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
    </radialGradient>
    {/* Recolour a flag-face to flat brand GOLD (keeps its alpha/shape) — for the gold-monochrome
        design variant, so the emblem stays inside the black + gold palette. #E2BF6A = (.886,.749,.416). */}
    <filter id="vd-goldify" x="-10%" y="-10%" width="120%" height="120%">
      <feColorMatrix type="matrix" values="0 0 0 0 0.886  0 0 0 0 0.749  0 0 0 0 0.416  0 0 0 1 0" />
    </filter>
  </defs>
);

// scale a small island UP around its own centroid, re-centred at the edge-clamped target
// (tx/ty fall back to cx/cy when no clamp was needed) so it grows but never spills off-frame.
const landTf = (p: LandPath) =>
  p.scale
    ? `translate(${p.tx ?? p.cx} ${p.ty ?? p.cy}) scale(${p.scale}) translate(${-(p.cx ?? 0)} ${-(p.cy ?? 0)})`
    : undefined;

function renderLand(l: LandPath[]) {
  return (
    <>
      {l.map((p) => (p.isLeader ? <path key={`lead-${p.i}`} d={p.d} fill={GOLD_BRIGHT} filter="url(#vd-lead)" transform={landTf(p)} /> : null))}
      <g filter="url(#vd-glow)" opacity="0.85">
        {l.map((p) => (
          <path key={`g-${p.i}`} d={p.d} fill="none" stroke={GOLD} strokeWidth={1.6} vectorEffect="non-scaling-stroke" transform={landTf(p)} />
        ))}
      </g>
      <g>
        {l.map((p) => (
          <path
            key={`l-${p.i}`}
            d={p.d}
            fill={p.isLeader ? GOLD_BRIGHT : 'url(#vd-land)'}
            fillOpacity={p.isLeader ? 0.92 : 1}
            stroke={p.isLeader ? GOLD_BRIGHT : GOLD}
            strokeOpacity={p.isLeader ? 1 : 0.95}
            strokeWidth={p.isLeader ? 1.1 : 0.9}
            vectorEffect="non-scaling-stroke"
            transform={landTf(p)}
          />
        ))}
      </g>
    </>
  );
}

export default function VotingDesignMap({
  level,
  options,
  landIsos,
  faces = false,
  heroIso,
  faceStyle = 'color',
  votable = false,
  selectedCode = null,
  pendingCode = null,
  onSelect,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  // namespace SVG gradient ids per map instance — the page stacks several maps, and the tether
  // gradients carry absolute coordinates, so a shared id would point every map at the first one's.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  // null until measured in the browser — the d3 geometry isn't bit-identical between Node
  // and the browser, so we DON'T render it during SSR (that would hydration-mismatch).
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  // A page can stack many of these maps (the /design demo has 8). Building all of them on load
  // means 16 d3 layouts (desktop+mobile) in one burst → a slow first paint. So each map only
  // builds (and only downloads the 50m geometry) once it is near the viewport.
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '800px 0px 800px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    let raf = 0;
    const apply = (w: number, h: number) => {
      if (w < 80 || h < 80) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setDims((prev) => (!prev || Math.abs(prev.w - w) > 12 || Math.abs(prev.h - h) > 12 ? { w, h } : prev));
      });
    };
    const r0 = el.getBoundingClientRect();
    apply(Math.round(r0.width), Math.round(r0.height));
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      apply(Math.round(cr.width), Math.round(cr.height));
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  // COUNTRY + PLACE stages: lazily pull the 50m geometry (real small-island outlines) —
  // code-split so the continent stage never downloads the 739 KB file.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [geo50, setGeo50] = useState<((iso: string | number) => any) | null>(null);
  useEffect(() => {
    if (level === 'continent' || !near) return;
    let alive = true;
    import('@/lib/geo/worldmap50').then((m) => {
      if (alive) setGeo50(() => m.featureByIso50m);
    });
    return () => {
      alive = false;
    };
  }, [level, near]);

  const ready = dims !== null;
  const desktop = useMemo(
    () => (dims && near ? buildLayout(dims.w, dims.h, level, options, faces, landIsos, heroIso, true, geo50) : null),
    [dims, near, level, options, faces, landIsos, heroIso, geo50],
  );
  // mobile shows only the land + a ranked list → skip the (expensive) emblem placement
  const mobile = useMemo(
    () => (ready && near ? buildLayout(760, 760, level, options, faces, landIsos, heroIso, false, geo50) : null),
    [ready, near, level, options, faces, landIsos, heroIso, geo50],
  );
  const leaderVotes = desktop?.leaderVotes ?? 0;
  // below this gap an emblem already sits on its own country → no tether line needed
  const minLine = dims ? Math.min(dims.w, dims.h) * 0.02 : 0;
  // Guard against the brief first-paint frame where an island nation (Malediven, Palau…) has no
  // land yet (110m has none; the 50m outlines are still loading) → its land-centroid, and thus a
  // plaque's anchor/position, is NaN. Skip those so no tether/pin renders with NaN coordinates.
  const finitePlaque = (p: Plaque) =>
    Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.ax) && Number.isFinite(p.ay);
  const ranked = useMemo(() => (mobile ? [...mobile.plaques].sort((a, b) => b.votes - a.votes) : []), [mobile]);

  // When the map is votable, every option div becomes a real button: click or Enter/Space fires
  // onSelect(code). Geometry/positions are untouched — this only adds handlers + a11y attributes.
  const interactiveProps = (code?: string) =>
    votable && code
      ? {
          role: 'button' as const,
          tabIndex: 0,
          'aria-pressed': code === selectedCode,
          onClick: () => onSelect?.(code),
          onKeyDown: (e: { key: string; preventDefault: () => void }) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect?.(code);
            }
          },
        }
      : {};
  // "Deine Wahl" check badge for the option the user picked — palette-safe (gold), and distinct
  // from the leader glow because only the selected option carries the ✓.
  const SelectedBadge = () => (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -right-2 -top-2 flex items-center justify-center rounded-full font-body font-bold leading-none"
      style={{ width: 18, height: 18, fontSize: 12, background: GOLD_BRIGHT, color: '#0a0a0a', boxShadow: '0 0 10px rgba(226,191,106,0.6)' }}
    >
      ✓
    </span>
  );

  return (
    <div ref={rootRef}>
      {/* ── Desktop: full-width map that fills the screen ratio + on-map emblems ── */}
      <div
        ref={ref}
        className="relative mx-auto hidden w-full sm:block"
        style={{
          // cap raised (1080→1300 tall, ~2990 wide) so big 4K/5K screens fill much fuller —
          // the 1300 max only kicks in on very tall screens, so laptops are UNCHANGED (their
          // 76vh stays well under the cap). Aspect band kept so ultra-wide doesn't go too flat.
          height: 'clamp(460px, 76vh, 1300px)',
          maxWidth: 'calc(clamp(460px, 76vh, 1300px) * 2.3)',
          containerType: 'inline-size',
        }}
      >
        {dims && desktop && (
          <>
        <svg viewBox={`0 0 ${dims.w} ${dims.h}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" role="img" aria-label="Weltkarte der Abstimmung">
          {Defs}
          {renderLand(desktop.land)}
          {/* Scattered / elongated countries: a COMPLETE flag-face on each significant landmass
              (USA = one on the mainland; Malaysia = one on the peninsula + one on Borneo; Japan =
              one per island), sized to the landmass' short side so the whole face stays visible,
              clipped to the land so nothing spills into the sea. All-tiny archipelagos (Malediven)
              keep ONE spanning face. */}
          {heroIso &&
            desktop.hero &&
            desktop.heroMode === 'fill' &&
            faceStyle !== 'none' &&
            (() => {
              const faces =
                desktop.heroFaces.length > 0
                  ? desktop.heroFaces
                  : [{ cx: desktop.hero.cx, cy: desktop.hero.cy, size: Math.max(desktop.hero.w, desktop.hero.h) * 1.12 }];
              const gold = faceStyle === 'gold';
              return (
                <>
                  <clipPath id={`${uid}-heroclip`} clipPathUnits="userSpaceOnUse">
                    {desktop.land.map((p) => (
                      <path key={`hc-${p.i}`} d={p.d} transform={landTf(p)} />
                    ))}
                  </clipPath>
                  {faces.map((hf, fi) => (
                    <image
                      key={`hf-${fi}`}
                      href={`/faces/${heroIso}.png`}
                      x={hf.cx - hf.size / 2}
                      y={hf.cy - hf.size / 2}
                      width={hf.size}
                      height={hf.size}
                      preserveAspectRatio="xMidYMid meet"
                      clipPath={`url(#${uid}-heroclip)`}
                      filter={gold ? 'url(#vd-goldify)' : undefined}
                      opacity={gold ? 0.6 : 0.72}
                    />
                  ))}
                </>
              );
            })()}
        </svg>

        {/* Place stage: a compact country's flag-face laid into its land as a tilted watermark */}
        {heroIso &&
          desktop.hero &&
          desktop.heroMode === 'inset' &&
          faceStyle !== 'none' &&
          (() => {
            const gold = faceStyle === 'gold';
            const left = `${(desktop.hero.ccx / dims.w) * 100}%`;
            // nudge the face DOWN from the mass-centre by ~8% of the short side: the top of the
            // emblem otherwise pokes into a country's northern bays/fjords (Island) and reads as
            // cheaply pasted-on; lower, it sits over the solid body and stays clearly legible.
            const top = `${((desktop.hero.ccy + Math.min(desktop.hero.w, desktop.hero.h) * 0.08) / dims.h) * 100}%`;
            const width = `${((Math.min(desktop.hero.w, desktop.hero.h) * 0.74) / dims.w) * 100}%`;
            if (gold) {
              const url = `/faces/${heroIso}.png`;
              return (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute"
                  style={{
                    left,
                    top,
                    width,
                    aspectRatio: '1 / 1',
                    transform: 'translate(-50%, -50%) rotate(-7deg)',
                    opacity: 0.5,
                    background: GOLD_BRIGHT,
                    WebkitMaskImage: `url(${url})`,
                    maskImage: `url(${url})`,
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                  }}
                />
              );
            }
            return (
              <img
                src={`/faces/${heroIso}.png`}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="pointer-events-none absolute"
                style={{
                  left,
                  top,
                  width,
                  transform: 'translate(-50%, -50%) rotate(-7deg)',
                  opacity: 0.52,
                  objectFit: 'contain',
                  maxWidth: 'none',
                  filter: 'drop-shadow(0 0 26px rgba(226,191,106,0.5))',
                }}
              />
            );
          })()}

        <svg viewBox={`0 0 ${dims.w} ${dims.h}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {/* Per-tether gradients: bright where the line meets the land pin, dissolving to nothing
              before it reaches the emblem — so no connector ever reads as a hard stroke ending in
              empty black. IDs are namespaced per map instance (uid) because the page stacks several
              maps and these gradients carry absolute userSpaceOnUse coordinates. */}
          <defs>
            {desktop.plaques.map((p, i) => {
              if (!p.hasLand || !finitePlaque(p) || Math.hypot(p.x - p.ax, p.y - p.ay) < minLine) return null;
              return (
                <linearGradient key={`tg-${i}`} id={`${uid}-tether-${i}`} gradientUnits="userSpaceOnUse" x1={p.ax} y1={p.ay} x2={p.x} y2={p.y}>
                  <stop offset="0%" stopColor={GOLD_BRIGHT} stopOpacity={0.9} />
                  <stop offset="55%" stopColor={GOLD} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0.22} />
                </linearGradient>
              );
            })}
          </defs>
          {desktop.plaques.map((p, i) =>
            !p.hasLand || !finitePlaque(p) || Math.hypot(p.x - p.ax, p.y - p.ay) < minLine ? null : (
              <line key={`tl-${i}`} x1={p.ax} y1={p.ay} x2={p.x} y2={p.y} stroke={`url(#${uid}-tether-${i})`} strokeWidth={1.4} strokeLinecap="round" />
            ),
          )}
          {desktop.plaques.map((p, i) => {
            const showDot = level === 'place' || p.moved;
            if (!showDot || !p.hasLand || !finitePlaque(p)) return null;
            const isLeader = p.votes === leaderVotes && p.votes > 0;
            const isPlace = level === 'place';
            return (
              <g key={`pin-${i}`}>
                {/* soft halo — gives even a 1-pixel micro-state a clear, intentional gold presence */}
                <circle cx={p.ax} cy={p.ay} r={isPlace ? 7.5 : 6} fill="url(#vd-pin)" />
                <circle cx={p.ax} cy={p.ay} r={isPlace ? 3.4 : 2.9} fill="none" stroke={isLeader ? GOLD_BRIGHT : GOLD} strokeOpacity={isLeader ? 0.95 : 0.6} strokeWidth={0.8} />
                <circle cx={p.ax} cy={p.ay} r={isPlace ? 1.8 : 1.7} fill={GOLD_BRIGHT} />
              </g>
            );
          })}
        </svg>

        {desktop.plaques.map((p, i) => {
          const isLeader = p.votes === leaderVotes && p.votes > 0;
          if (faces && p.code) {
            const ui = desktop.ui;
            const size = `${isLeader ? ui.leaderCqw : ui.faceCqw}cqw`;
            const blur = `${(isLeader ? ui.faceCqw * 0.23 : ui.faceCqw * 0.15).toFixed(2)}cqw`;
            const isSelected = votable && p.code === selectedCode;
            const isPending = votable && p.code === pendingCode;
            return (
              <div
                key={i}
                {...interactiveProps(p.code)}
                className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center outline-none ${votable ? 'cursor-pointer' : ''}`}
                style={{ left: `${p.left}%`, top: `${p.top}%`, opacity: isPending ? 0.5 : 1, transition: 'opacity 150ms' }}
              >
                {isSelected && <SelectedBadge />}
                {faceStyle === 'none' ? null : faceStyle === 'gold' ? (
                  <div
                    className="shrink-0"
                    style={{
                      width: size,
                      height: size,
                      background: isLeader ? GOLD_BRIGHT : GOLD,
                      WebkitMaskImage: `url(/faces/${p.code}.png)`,
                      maskImage: `url(/faces/${p.code}.png)`,
                      WebkitMaskSize: 'contain',
                      maskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center',
                      filter: `drop-shadow(0 0 ${blur} rgba(226,191,106,${isLeader ? 0.65 : 0.4}))`,
                    }}
                  />
                ) : (
                  <img src={`/faces/${p.code}.png`} alt={p.label} loading="lazy" decoding="async" className="shrink-0" style={{ width: size, height: size, maxWidth: 'none', objectFit: 'contain', filter: `drop-shadow(0 0 ${blur} rgba(226,191,106,${isLeader ? 0.65 : 0.4}))` }} />
                )}
                <span className="flex flex-col items-center whitespace-nowrap text-center font-display leading-none" style={{ marginTop: '-0.3cqw', borderRadius: '0.5cqw', padding: '0.3cqw 0.5cqw', background: 'rgba(10,9,7,0.94)', border: `1px solid ${isSelected || isLeader ? GOLD_BRIGHT : 'rgba(201,168,76,0.5)'}`, boxShadow: isSelected ? '0 0 0 1.5px rgba(226,191,106,0.85), 0 0 14px rgba(226,191,106,0.45)' : undefined }}>
                  <span className="font-medium" style={{ fontSize: `${ui.nameCqw}cqw`, color: '#EFE6CF' }}>{p.label}</span>
                  <span className="font-semibold" style={{ fontSize: `${ui.voteCqw}cqw`, marginTop: '0.15cqw', color: isLeader ? GOLD_BRIGHT : GOLD }}>{fmt(p.votes)}</span>
                </span>
              </div>
            );
          }
          if (level === 'place') {
            const isSelected = votable && p.code === selectedCode;
            const isPending = votable && p.code === pendingCode;
            // city marker label: name over the gold vote count, sitting next to its dot
            return (
              <div
                key={i}
                {...interactiveProps(p.code)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[7px] text-center outline-none ${votable ? 'cursor-pointer' : ''}`}
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  padding: '0.34cqw 0.7cqw',
                  opacity: isPending ? 0.5 : 1,
                  transition: 'opacity 150ms',
                  background: 'rgba(10,9,7,0.92)',
                  border: `1px solid ${isSelected || isLeader ? GOLD_BRIGHT : 'rgba(201,168,76,0.5)'}`,
                  boxShadow: isSelected
                    ? '0 0 0 1.5px rgba(226,191,106,0.85), 0 0 16px rgba(226,191,106,0.5)'
                    : isLeader
                      ? '0 0 16px rgba(226,191,106,0.45)'
                      : '0 0 8px rgba(0,0,0,0.55)',
                }}
              >
                {isSelected && <SelectedBadge />}
                <div className="font-display font-medium leading-tight" style={{ fontSize: '1.12cqw', color: '#EFE6CF' }}>{p.label}</div>
                <div className="font-display font-semibold leading-tight" style={{ fontSize: '1.32cqw', color: isLeader ? GOLD_BRIGHT : GOLD }}>
                  {fmt(p.votes)}{' '}
                  <span className="font-body uppercase" style={{ fontSize: '0.6cqw', letterSpacing: '0.14em', color: 'rgba(201,168,76,0.7)' }}>Stimmen</span>
                </div>
              </div>
            );
          }
          const isSelected = votable && p.code === selectedCode;
          const isPending = votable && p.code === pendingCode;
          return (
            <div
              key={i}
              {...interactiveProps(p.code)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[8px] outline-none ${votable ? 'cursor-pointer' : ''}`}
              style={{ left: `${p.left}%`, top: `${p.top}%`, padding: '0.6cqw 1.1cqw', opacity: isPending ? 0.5 : 1, transition: 'opacity 150ms', background: 'rgba(10,9,7,0.82)', border: `1px solid ${isSelected || isLeader ? GOLD_BRIGHT : 'rgba(201,168,76,0.55)'}`, boxShadow: isSelected ? '0 0 0 1.5px rgba(226,191,106,0.85), 0 0 18px rgba(226,191,106,0.5)' : isLeader ? '0 0 18px rgba(226,191,106,0.45)' : '0 0 10px rgba(0,0,0,0.5)' }}
            >
              {isSelected && <SelectedBadge />}
              <span className="font-display font-medium tracking-[0.01em]" style={{ fontSize: '1.4cqw', color: '#EFE6CF' }}>{p.label}</span>{' '}
              <span className="font-display font-semibold" style={{ fontSize: '1.6cqw', color: isLeader ? GOLD_BRIGHT : GOLD }}>{fmt(p.votes)}</span>
              <span className="ml-1 font-body uppercase tracking-[0.14em]" style={{ fontSize: '0.85cqw', color: 'rgba(201,168,76,0.7)' }}>Stimmen</span>
            </div>
          );
        })}
          </>
        )}
      </div>

      {/* ── Mobile: big square map (leader glows) + ranked list ── */}
      <div className="sm:hidden">
        <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
          <svg viewBox="0 0 760 760" className="absolute inset-0 h-full w-full" role="img" aria-label="Karte der Abstimmung">
            {Defs}
            {mobile && renderLand(mobile.land)}
          </svg>
        </div>
        <ul className="mt-4 space-y-2">
          {ranked.map((p, i) => {
            const isLeader = i === 0 && p.votes > 0;
            const isSelected = votable && p.code === selectedCode;
            const isPending = votable && p.code === pendingCode;
            const share = leaderVotes > 0 ? (p.votes / leaderVotes) * 100 : 0;
            return (
              <li
                key={i}
                {...interactiveProps(p.code)}
                className={`relative flex items-center gap-3 overflow-hidden rounded-[8px] px-3 py-2.5 outline-none ${votable ? 'cursor-pointer' : ''}`}
                style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 150ms', background: 'rgba(10,9,7,0.82)', border: `1px solid ${isSelected || isLeader ? GOLD_BRIGHT : 'rgba(201,168,76,0.4)'}`, boxShadow: isSelected ? 'inset 0 0 0 1.5px rgba(226,191,106,0.8)' : undefined }}
              >
                <div className="absolute inset-y-0 left-0" style={{ width: `${share}%`, background: 'rgba(201,168,76,0.12)' }} aria-hidden="true" />
                {faces && p.code ? (
                  <img src={`/faces/${p.code}.png`} alt="" loading="lazy" decoding="async" className="relative" style={{ width: 30, height: 30, maxWidth: 'none', objectFit: 'contain' }} />
                ) : (
                  <span className="relative inline-block h-2.5 w-2.5 rounded-full" style={{ background: GOLD }} aria-hidden="true" />
                )}
                <span className="relative flex-1 text-left font-display text-sm font-medium" style={{ color: '#EFE6CF' }}>{p.label}</span>
                {isSelected && (
                  <span className="relative font-body text-[10px] font-medium uppercase tracking-[0.12em]" style={{ color: GOLD_BRIGHT }}>
                    deine Wahl
                  </span>
                )}
                <span className="relative font-display text-sm font-semibold" style={{ color: isSelected || isLeader ? GOLD_BRIGHT : GOLD }}>{fmt(p.votes)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
