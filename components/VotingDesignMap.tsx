'use client';

// Style study v6 — RESPONSIVE: the desktop map measures its own container and rebuilds
// the projection + emblem layout for the exact width × height it is given, so it fills
// ANY desktop screen ratio (4:3, 16:10, 16:9, 21:9 …) automatically.
//   continent → gold world land + continent plaques
//   country   → continent CONIC projection; face-flag emblems sit in the black space in
//               their country's compass direction, the leading country's land glows
//   place     → ONE country's land + hero face + popular-city plaques
// Desktop = full-width map with on-map emblems. Mobile = a square map + ranked list.

import { useEffect, useMemo, useRef, useState } from 'react';
import { geoNaturalEarth1, geoMercator, geoConicConformal, geoPath, geoCentroid, geoArea, geoDistance } from 'd3-geo';
import { worldNoAntarctica, featureByIso, mergedLand } from '@/lib/geo/worldmap';
import { continentByKey } from '@/lib/geo/data';

export type DesignOption = { label: string; votes: number; code?: string; lat?: number; lng?: number };

type Props = {
  level: 'continent' | 'country' | 'place';
  options: DesignOption[];
  landIsos?: string[];
  faces?: boolean;
  heroIso?: string;
  /** SSR fallback aspect — the real size is measured on the client. */
  width?: number;
  height?: number;
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

type LandPath = { d: string; i: number; isLeader: boolean; scale?: number; cx?: number; cy?: number };
type Plaque = DesignOption & { ax: number; ay: number; x: number; y: number; left: number; top: number; moved: boolean };

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
  // place stage only: the hero country's 50m feature (with its small islands), loaded async;
  // null until it arrives (then the map re-renders with the islands).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  heroGeo: any,
): {
  land: LandPath[];
  plaques: Plaque[];
  leaderVotes: number;
  ui: { faceCqw: number; leaderCqw: number; nameCqw: number; voteCqw: number };
  hero: { cx: number; cy: number; w: number; h: number } | null;
} {
  let landFeatures: never[];
  if (heroIso) {
    const f = heroGeo ?? featureByIso(heroIso);
    landFeatures = (f ? [f] : []) as never[];
  } else if (landIsos) {
    const set = new Set(landIsos.map((i) => Number(i)));
    landFeatures = (worldNoAntarctica.features as never[]).filter((f) => set.has(Number((f as { id?: string | number }).id)));
  } else if (level === 'continent') {
    // CONTINENT view: one merged land geometry → the world reads as CONTINENTS, with no
    // internal country borders (only the coastlines glow gold).
    landFeatures = [mergedLand] as never[];
  } else {
    landFeatures = worldNoAntarctica.features as never[];
  }
  if (level !== 'continent') landFeatures = landFeatures.map((f) => keepNearMainland(f)) as never[];
  const landFC = { type: 'FeatureCollection', features: landFeatures };

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
    const c = (geoCentroid(landFC as never) as [number, number]) ?? [10, 50];
    proj = geoConicConformal()
      .rotate([-c[0], 0])
      .center([0, c[1]])
      .parallels([c[1] - 12, c[1] + 12])
      .fitExtent(ext, (landFeatures.length ? landFC : worldNoAntarctica) as never);
  } else {
    proj = geoMercator().fitExtent(ext, (landFeatures.length ? landFC : worldNoAntarctica) as never);
  }
  const pth = geoPath(proj);
  const land: LandPath[] = [];
  if (level === 'place') {
    // Split the hero country into individual polygons so SMALL islands (Balearics, the Greek
    // isles, Caribbean specks…) can be scaled UP around their own centroid → the city dot fits
    // on a recognisable island shape instead of the island vanishing under the marker.
    const minIslandPx = Math.max(30, Math.min(w, h) * 0.05);
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
        const lp: LandPath = { d, i: idx++, isLeader: false };
        if (maxDim > 0 && maxDim < minIslandPx) {
          lp.scale = Math.min(6, minIslandPx / maxDim);
          lp.cx = (b[0][0] + b[1][0]) / 2;
          lp.cy = (b[0][1] + b[1][1]) / 2;
        }
        land.push(lp);
      }
    }
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
  let hero: { cx: number; cy: number; w: number; h: number } | null = null;
  if (heroIso && landFeatures.length) {
    const b = pth.bounds(landFC as never);
    hero = { cx: (b[0][0] + b[1][0]) / 2, cy: (b[0][1] + b[1][1]) / 2, w: b[1][0] - b[0][0], h: b[1][1] - b[0][1] };
  }

  // emblem anchors (true projected positions)
  const anchored = options
    .map((o) => {
      let ll: [number, number] | null = null;
      if (level === 'continent') {
        const c = o.code ? continentByKey(o.code) : null;
        if (c) ll = [c.lng, c.lat];
      } else if (o.code && (level === 'country' || faces)) {
        const f = featureByIso(o.code);
        if (f) ll = mainlandCentroid(f);
        else if (o.lat != null && o.lng != null) ll = [Number(o.lng), Number(o.lat)];
      } else if (o.lat != null && o.lng != null) {
        ll = [Number(o.lng), Number(o.lat)];
      }
      if (!ll) return null;
      const xy = proj(ll);
      if (!xy) return null;
      return { ...o, ax: xy[0], ay: xy[1], x: xy[0], y: xy[1] };
    })
    .filter(Boolean) as (DesignOption & { ax: number; ay: number; x: number; y: number })[];

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
    const spread = Math.max(w, h) * (isPlace ? 0.1 : 0.16); // direction-stable outward scale
    const targets = anchored.map((a) => {
      const dx = a.ax - lcx;
      const dy = a.ay - lcy;
      const r = Math.hypot(dx, dy);
      const k = Math.min(5, (r / spread) * (r / spread));
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
  return { land, plaques, leaderVotes, ui: faceUI, hero };
}

const Defs = (
  <defs>
    <filter id="vd-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2.6" />
    </filter>
    <filter id="vd-lead" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
  </defs>
);

// scale a small island UP around its own centroid (keeps it in place, just bigger)
const landTf = (p: LandPath) =>
  p.scale ? `translate(${p.cx} ${p.cy}) scale(${p.scale}) translate(${-(p.cx ?? 0)} ${-(p.cy ?? 0)})` : undefined;

function renderLand(l: LandPath[]) {
  return (
    <>
      {l.map((p) => (p.isLeader ? <path key={`lead-${p.i}`} d={p.d} fill={GOLD_BRIGHT} filter="url(#vd-lead)" transform={landTf(p)} /> : null))}
      <g filter="url(#vd-glow)" opacity="0.7">
        {l.map((p) => (
          <path key={`g-${p.i}`} d={p.d} fill="none" stroke={GOLD} strokeWidth={1.4} vectorEffect="non-scaling-stroke" transform={landTf(p)} />
        ))}
      </g>
      <g>
        {l.map((p) => (
          <path
            key={`l-${p.i}`}
            d={p.d}
            fill={p.isLeader ? GOLD_BRIGHT : '#181206'}
            fillOpacity={p.isLeader ? 0.92 : 1}
            stroke={p.isLeader ? GOLD_BRIGHT : GOLD}
            strokeOpacity={p.isLeader ? 1 : 0.85}
            strokeWidth={p.isLeader ? 1 : 0.5}
            vectorEffect="non-scaling-stroke"
            transform={landTf(p)}
          />
        ))}
      </g>
    </>
  );
}

export default function VotingDesignMap({ level, options, landIsos, faces = false, heroIso }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // null until measured in the browser — the d3 geometry isn't bit-identical between Node
  // and the browser, so we DON'T render it during SSR (that would hydration-mismatch).
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

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

  // place stage: lazily pull the hero country's 50m geometry (with its islands) — code-split
  // so the continent/country stages never download the 739 KB file.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [heroGeo, setHeroGeo] = useState<any>(null);
  useEffect(() => {
    if (level !== 'place' || !heroIso) return;
    let alive = true;
    import('@/lib/geo/worldmap50').then((m) => {
      if (alive) setHeroGeo(m.featureByIso50m(heroIso));
    });
    return () => {
      alive = false;
    };
  }, [level, heroIso]);

  const ready = dims !== null;
  const desktop = useMemo(
    () => (dims ? buildLayout(dims.w, dims.h, level, options, faces, landIsos, heroIso, true, heroGeo) : null),
    [dims, level, options, faces, landIsos, heroIso, heroGeo],
  );
  // mobile shows only the land + a ranked list → skip the (expensive) emblem placement
  const mobile = useMemo(
    () => (ready ? buildLayout(760, 760, level, options, faces, landIsos, heroIso, false, heroGeo) : null),
    [ready, level, options, faces, landIsos, heroIso, heroGeo],
  );
  const leaderVotes = desktop?.leaderVotes ?? 0;
  const ranked = useMemo(() => (mobile ? [...mobile.plaques].sort((a, b) => b.votes - a.votes) : []), [mobile]);

  return (
    <div>
      {/* ── Desktop: full-width map that fills the screen ratio + on-map emblems ── */}
      <div
        ref={ref}
        className="relative mx-auto hidden w-full sm:block"
        style={{
          height: 'clamp(460px, 76vh, 1080px)',
          // keep the map within a layout-tested aspect band: 16:9/16:10/4K fill fully,
          // only extreme ultra-wide gets small side margins (avoids a broken, too-flat grid)
          maxWidth: 'calc(clamp(460px, 76vh, 1080px) * 2.3)',
          containerType: 'inline-size',
        }}
      >
        {dims && desktop && (
          <>
        <svg viewBox={`0 0 ${dims.w} ${dims.h}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" role="img" aria-label="Weltkarte der Abstimmung">
          {Defs}
          {renderLand(desktop.land)}
        </svg>

        {/* Place stage: the country's flag-face laid into its land as a tilted watermark */}
        {heroIso && desktop.hero && (
          <img
            src={`/faces/${heroIso}.png`}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute"
            style={{
              left: `${(desktop.hero.cx / dims.w) * 100}%`,
              top: `${(desktop.hero.cy / dims.h) * 100}%`,
              width: `${((Math.min(desktop.hero.w, desktop.hero.h) * 0.74) / dims.w) * 100}%`,
              transform: 'translate(-50%, -50%) rotate(-7deg)',
              opacity: 0.52,
              objectFit: 'contain',
              maxWidth: 'none',
              filter: 'drop-shadow(0 0 26px rgba(226,191,106,0.5))',
            }}
          />
        )}

        <svg viewBox={`0 0 ${dims.w} ${dims.h}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {desktop.plaques.map((p, i) => {
            const showDot = level === 'place' || p.moved;
            if (!showDot) return null;
            return (
              <g key={`conn-${i}`}>
                {p.moved && <line x1={p.ax} y1={p.ay} x2={p.x} y2={p.y} stroke={GOLD} strokeOpacity={0.26} strokeWidth={0.7} />}
                {level === 'place' && <circle cx={p.ax} cy={p.ay} r={5.2} fill={GOLD_BRIGHT} fillOpacity={0.18} />}
                <circle cx={p.ax} cy={p.ay} r={level === 'place' ? 3 : 2.6} fill={GOLD_BRIGHT} fillOpacity={0.95} />
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
            return (
              <div key={i} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: `${p.left}%`, top: `${p.top}%` }}>
                <img src={`/faces/${p.code}.png`} alt={p.label} loading="lazy" decoding="async" className="shrink-0" style={{ width: size, height: size, maxWidth: 'none', objectFit: 'contain', filter: `drop-shadow(0 0 ${blur} rgba(226,191,106,${isLeader ? 0.65 : 0.4}))` }} />
                <span className="flex flex-col items-center whitespace-nowrap text-center font-display leading-none" style={{ marginTop: '-0.3cqw', borderRadius: '0.5cqw', padding: '0.3cqw 0.5cqw', background: 'rgba(10,9,7,0.94)', border: `1px solid ${isLeader ? GOLD_BRIGHT : 'rgba(201,168,76,0.5)'}` }}>
                  <span className="font-medium" style={{ fontSize: `${ui.nameCqw}cqw`, color: '#EFE6CF' }}>{p.label}</span>
                  <span className="font-semibold" style={{ fontSize: `${ui.voteCqw}cqw`, marginTop: '0.15cqw', color: isLeader ? GOLD_BRIGHT : GOLD }}>{fmt(p.votes)}</span>
                </span>
              </div>
            );
          }
          if (level === 'place') {
            // city marker label: name over the gold vote count, sitting next to its dot
            return (
              <div
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[7px] text-center"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  padding: '0.34cqw 0.7cqw',
                  background: 'rgba(10,9,7,0.92)',
                  border: `1px solid ${isLeader ? GOLD_BRIGHT : 'rgba(201,168,76,0.5)'}`,
                  boxShadow: isLeader ? '0 0 16px rgba(226,191,106,0.45)' : '0 0 8px rgba(0,0,0,0.55)',
                }}
              >
                <div className="font-display font-medium leading-tight" style={{ fontSize: '1.12cqw', color: '#EFE6CF' }}>{p.label}</div>
                <div className="font-display font-semibold leading-tight" style={{ fontSize: '1.32cqw', color: isLeader ? GOLD_BRIGHT : GOLD }}>
                  {fmt(p.votes)}{' '}
                  <span className="font-body uppercase" style={{ fontSize: '0.6cqw', letterSpacing: '0.14em', color: 'rgba(201,168,76,0.7)' }}>Stimmen</span>
                </div>
              </div>
            );
          }
          return (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[8px]" style={{ left: `${p.left}%`, top: `${p.top}%`, padding: '0.6cqw 1.1cqw', background: 'rgba(10,9,7,0.82)', border: `1px solid ${isLeader ? GOLD_BRIGHT : 'rgba(201,168,76,0.55)'}`, boxShadow: isLeader ? '0 0 18px rgba(226,191,106,0.45)' : '0 0 10px rgba(0,0,0,0.5)' }}>
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
            const share = leaderVotes > 0 ? (p.votes / leaderVotes) * 100 : 0;
            return (
              <li key={i} className="relative flex items-center gap-3 overflow-hidden rounded-[8px] px-3 py-2.5" style={{ background: 'rgba(10,9,7,0.82)', border: `1px solid ${isLeader ? GOLD_BRIGHT : 'rgba(201,168,76,0.4)'}` }}>
                <div className="absolute inset-y-0 left-0" style={{ width: `${share}%`, background: 'rgba(201,168,76,0.12)' }} aria-hidden="true" />
                {faces && p.code ? (
                  <img src={`/faces/${p.code}.png`} alt="" loading="lazy" decoding="async" className="relative" style={{ width: 30, height: 30, maxWidth: 'none', objectFit: 'contain' }} />
                ) : (
                  <span className="relative inline-block h-2.5 w-2.5 rounded-full" style={{ background: GOLD }} aria-hidden="true" />
                )}
                <span className="relative flex-1 text-left font-display text-sm font-medium" style={{ color: '#EFE6CF' }}>{p.label}</span>
                <span className="relative font-display text-sm font-semibold" style={{ color: isLeader ? GOLD_BRIGHT : GOLD }}>{fmt(p.votes)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
