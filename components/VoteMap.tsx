// Server-rendered vote map. No client JS, no d3 in the browser bundle: d3-geo runs
// here and we emit a plain SVG. Drill-down by stage:
//   continent → glowing bubbles at continent centroids on a faint world map
//   country   → zoom to the candidate countries, fill each polygon by vote share
//   place     → zoom to the places, glowing point markers
// The leader glows brightest gold with its vote count on it.

import { geoNaturalEarth1, geoMercator, geoPath, geoCentroid } from 'd3-geo';
import { countryFeatures, featureByIso, worldNoAntarctica } from '@/lib/geo/worldmap';
import { continentByKey } from '@/lib/geo/data';

const C = {
  land: '#15171b',
  landStroke: '#2A2A2A',
  gold: '#C9A84C',
  goldBright: '#E2BF6A',
  text: '#FFFFFF',
  faint: '#8A8A82',
};

export type MapOption = {
  id: string;
  label: string;
  code: string;
  lat: number | null;
  lng: number | null;
  vote_count: number;
};

type Props = { level: string; options: MapOption[]; width?: number; height?: number };

export default function VoteMap({ level, options, width = 880, height = 460 }: Props) {
  const pad = 28;
  const extent: [[number, number], [number, number]] = [
    [pad, pad],
    [width - pad, height - pad],
  ];

  const total = options.reduce((s, o) => s + o.vote_count, 0);
  const hasVotes = total > 0;
  const maxVotes = Math.max(1, ...options.map((o) => o.vote_count));
  const sorted = [...options].sort((a, b) => b.vote_count - a.vote_count);
  const leaderId = hasVotes && sorted.length ? sorted[0].id : null;

  // ── projection per stage ──────────────────────────────────────────────────
  let projection;
  if (level === 'country') {
    const feats = options.map((o) => featureByIso(o.code)).filter(Boolean);
    const target = feats.length
      ? { type: 'FeatureCollection', features: feats }
      : worldNoAntarctica;
    projection = geoMercator().fitExtent(extent, target as never);
  } else if (level === 'place') {
    const pts = options.filter((o) => Number.isFinite(Number(o.lat)) && Number.isFinite(Number(o.lng)));
    if (pts.length) {
      const padDeg = 3;
      const lats = pts.map((o) => Number(o.lat));
      const lngs = pts.map((o) => Number(o.lng));
      // MultiPoint of the padded corners — points have no ring-winding ambiguity,
      // so fitExtent zooms to this bbox reliably (a hand-made Polygon can flip and
      // be read as "the whole sphere minus the box").
      const target = {
        type: 'MultiPoint',
        coordinates: [
          [Math.min(...lngs) - padDeg, Math.min(...lats) - padDeg],
          [Math.max(...lngs) + padDeg, Math.max(...lats) + padDeg],
        ],
      };
      projection = geoMercator().fitExtent(extent, target as never);
    } else {
      projection = geoNaturalEarth1().fitExtent(extent, worldNoAntarctica as never);
    }
  } else {
    projection = geoNaturalEarth1().fitExtent(extent, worldNoAntarctica as never);
  }

  const path = geoPath(projection);

  // map of highlighted ISO → option (country stage only)
  const optionByIso = new Map<string, MapOption>(
    level === 'country' ? options.map((o) => [String(Number(o.code)), o]) : [],
  );

  // ── base land ───────────────────────────────────────────────────────────────
  const land = (worldNoAntarctica.features as never[]).map((f, i) => {
    const d = path(f as never);
    if (!d) return null;
    const feat = f as { id?: string | number };
    const opt = optionByIso.get(String(Number(feat.id)));
    if (opt) {
      const share = opt.vote_count / maxVotes;
      const isLeader = opt.id === leaderId;
      return (
        <path
          key={`c-${feat.id ?? i}`}
          d={d}
          fill={isLeader ? C.goldBright : C.gold}
          fillOpacity={hasVotes ? 0.2 + 0.65 * share : 0.16}
          stroke={C.gold}
          strokeOpacity={0.5}
          strokeWidth={0.6}
          filter={isLeader ? 'url(#vm-glow)' : undefined}
        />
      );
    }
    return (
      <path key={`l-${feat.id ?? i}`} d={d} fill={C.land} stroke={C.landStroke} strokeWidth={0.4} />
    );
  });

  // ── markers (continent + place) ──────────────────────────────────────────────
  const markers =
    level === 'continent' || level === 'place'
      ? options.map((o) => {
          let lnglat: [number, number] | null = null;
          if (level === 'continent') {
            const cont = continentByKey(o.code);
            if (cont) lnglat = [cont.lng, cont.lat];
          } else if (o.lng != null && o.lat != null) {
            lnglat = [Number(o.lng), Number(o.lat)];
          }
          if (!lnglat) return null;
          const xy = projection(lnglat);
          if (!xy) return null;

          const share = o.vote_count / maxVotes;
          const isLeader = o.id === leaderId;
          const r = (level === 'continent' ? 9 : 6) + (level === 'continent' ? 30 : 16) * share;
          const fill = isLeader ? C.goldBright : C.gold;

          return (
            <g key={o.id}>
              <circle
                cx={xy[0]}
                cy={xy[1]}
                r={r}
                fill={fill}
                fillOpacity={hasVotes ? 0.22 + 0.5 * share : 0.18}
                stroke={fill}
                strokeOpacity={0.85}
                strokeWidth={1.2}
                filter={isLeader ? 'url(#vm-glow)' : undefined}
              />
              {hasVotes && (
                <text
                  x={xy[0]}
                  y={xy[1] + 4}
                  textAnchor="middle"
                  className="font-display"
                  fontSize={13}
                  fontWeight={700}
                  fill={isLeader ? '#0A0A0A' : C.text}
                >
                  {o.vote_count}
                </text>
              )}
              <text
                x={xy[0]}
                y={xy[1] + r + 14}
                textAnchor="middle"
                className="font-body"
                fontSize={12}
                fontWeight={isLeader ? 600 : 400}
                fill={isLeader ? C.goldBright : C.faint}
              >
                {o.label}
              </text>
            </g>
          );
        })
      : null;

  // ── country labels (country stage) ───────────────────────────────────────────
  const countryLabels =
    level === 'country'
      ? options.map((o) => {
          const f = featureByIso(o.code);
          if (!f) return null;
          const xy = projection(geoCentroid(f as never));
          if (!xy) return null;
          const isLeader = o.id === leaderId;
          return (
            <g key={o.id}>
              <text
                x={xy[0]}
                y={xy[1]}
                textAnchor="middle"
                className="font-display"
                fontSize={16}
                fontWeight={800}
                fill={isLeader ? '#0A0A0A' : C.text}
                stroke={isLeader ? 'none' : '#0A0A0A'}
                strokeWidth={isLeader ? 0 : 3}
                paintOrder="stroke"
              >
                {hasVotes ? o.vote_count : ''}
              </text>
              <text
                x={xy[0]}
                y={xy[1] + 16}
                textAnchor="middle"
                className="font-body"
                fontSize={11}
                fontWeight={isLeader ? 600 : 400}
                fill={isLeader ? C.goldBright : C.faint}
                stroke="#0A0A0A"
                strokeWidth={2.5}
                paintOrder="stroke"
              >
                {o.label}
              </text>
            </g>
          );
        })
      : null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Weltkarte der laufenden Abstimmung"
    >
      <defs>
        <filter id="vm-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g>{land}</g>
      {countryLabels && <g>{countryLabels}</g>}
      {markers && <g>{markers}</g>}
    </svg>
  );
}
