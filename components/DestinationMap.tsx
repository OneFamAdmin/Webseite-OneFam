'use client';

// Interactive guided destination vote. The BIG map is the interface: you click a
// continent on the map → "Weiter" zooms into it → click a country → "Weiter" zooms
// in → click a place → "Abstimmen". "Zurück" walks back up so you can switch freely.
// Tallies (how the community voted at each level) are fetched live; the leader glows.

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { geoNaturalEarth1, geoMercator, geoPath, geoCentroid } from 'd3-geo';
import { feature } from 'topojson-client';
import { ArrowLeft, ArrowRight, Check, Loader2, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  CONTINENTS,
  continentByKey,
  countriesByContinent,
  countryByIso,
  placesByCountry,
  placeByCode,
} from '@/lib/geo/data';
import { castDestinationVote } from '@/app/reiseziel/actions';

const SHOP_URL = 'https://onefam.shop';
const C = {
  land: '#15171b',
  landStroke: '#2A2A2A',
  gold: '#C9A84C',
  goldBright: '#E2BF6A',
  text: '#FFFFFF',
  faint: '#8A8A82',
};
const W = 920;
const H = 520;
const PAD = 32;
const EXTENT: [[number, number], [number, number]] = [
  [PAD, PAD],
  [W - PAD, H - PAD],
];

type Stage = 'continent' | 'country' | 'place';
type Tally = Record<string, number>;
type InitialVote = { continent: string | null; country_iso: string | null; place_code: string | null } | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Feat = any;

export default function DestinationMap({
  isLoggedIn,
  isBuyer,
  initialVote,
}: {
  isLoggedIn: boolean;
  isBuyer: boolean;
  initialVote: InitialVote;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [features, setFeatures] = useState<Feat[] | null>(null);
  const [stage, setStage] = useState<Stage>('continent');
  const [selCont, setSelCont] = useState<string | null>(initialVote?.continent ?? null);
  const [selCountry, setSelCountry] = useState<string | null>(initialVote?.country_iso ?? null);
  const [selPlace, setSelPlace] = useState<string | null>(initialVote?.place_code ?? null);

  const [contTally, setContTally] = useState<Tally>({});
  const [countryTally, setCountryTally] = useState<Tally>({});
  const [placeTally, setPlaceTally] = useState<Tally>({});

  const [saved, setSaved] = useState<boolean>(Boolean(initialVote?.place_code));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // load world geometry once
  useEffect(() => {
    let alive = true;
    fetch('/geo/countries-110m.json')
      .then((r) => r.json())
      .then((topo) => {
        if (!alive) return;
        const fc = feature(topo, topo.objects.countries) as unknown as { features: Feat[] };
        setFeatures(fc.features);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // load tallies for the current stage
  useEffect(() => {
    let alive = true;
    (async () => {
      if (stage === 'continent') {
        const { data } = await supabase.rpc('continent_tallies');
        if (alive && data) setContTally(Object.fromEntries(data.map((r: Feat) => [r.continent, Number(r.votes)])));
      } else if (stage === 'country' && selCont) {
        const { data } = await supabase.rpc('country_tallies', { p_continent: selCont });
        if (alive && data)
          setCountryTally(Object.fromEntries(data.map((r: Feat) => [String(Number(r.country_iso)), Number(r.votes)])));
      } else if (stage === 'place' && selCountry) {
        const { data } = await supabase.rpc('place_tallies', { p_country: selCountry });
        if (alive && data) setPlaceTally(Object.fromEntries(data.map((r: Feat) => [r.place_code, Number(r.votes)])));
      }
    })();
    return () => {
      alive = false;
    };
  }, [stage, selCont, selCountry, supabase]);

  const featByIso = (iso: string | number): Feat | null =>
    features?.find((f) => Number(f.id) === Number(iso)) ?? null;
  const worldFeatures = useMemo(() => (features ? features.filter((f) => Number(f.id) !== 10) : []), [features]);

  // projection + path for the current view
  const { projection, path } = useMemo(() => {
    if (!features) return { projection: null, path: null };
    let proj;
    if (stage === 'country' && selCont) {
      const feats = countriesByContinent(selCont)
        .map((c) => featByIso(c.iso))
        .filter(Boolean);
      proj = geoMercator().fitExtent(
        EXTENT,
        (feats.length ? { type: 'FeatureCollection', features: feats } : { type: 'FeatureCollection', features: worldFeatures }) as never,
      );
    } else if (stage === 'place' && selCountry) {
      const places = placesByCountry(selCountry);
      if (places.length) {
        const lats = places.map((p) => p.lat);
        const lngs = places.map((p) => p.lng);
        const pd = 3;
        const target = {
          type: 'MultiPoint',
          coordinates: [
            [Math.min(...lngs) - pd, Math.min(...lats) - pd],
            [Math.max(...lngs) + pd, Math.max(...lats) + pd],
          ],
        };
        proj = geoMercator().fitExtent(EXTENT, target as never);
      } else {
        const f = featByIso(selCountry);
        proj = geoMercator().fitExtent(EXTENT, (f ?? { type: 'FeatureCollection', features: worldFeatures }) as never);
      }
    } else {
      proj = geoNaturalEarth1().fitExtent(EXTENT, { type: 'FeatureCollection', features: worldFeatures } as never);
    }
    return { projection: proj, path: geoPath(proj) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features, stage, selCont, selCountry, worldFeatures]);

  // ── selection handlers (reset downstream picks when an upstream pick changes) ──
  const pickContinent = (key: string) => {
    if (key !== selCont) {
      setSelCont(key);
      setSelCountry(null);
      setSelPlace(null);
    }
  };
  const pickCountry = (iso: string) => {
    if (iso !== selCountry) {
      setSelCountry(iso);
      setSelPlace(null);
    }
  };
  const pickPlace = (code: string) => setSelPlace(code);

  const goNext = () => {
    if (stage === 'continent' && selCont) setStage('country');
    else if (stage === 'country' && selCountry) setStage('place');
  };
  const goBack = () => {
    if (stage === 'place') setStage('country');
    else if (stage === 'country') setStage('continent');
  };

  const submit = () => {
    setError(null);
    if (!selCont || !selCountry || !selPlace) return;
    const place = placeByCode(selCountry, selPlace);
    if (!place) return;
    startTransition(async () => {
      const res = await castDestinationVote({
        continent: selCont,
        countryIso: selCountry,
        placeCode: selPlace,
        placeLabel: place.label,
        placeLat: place.lat,
        placeLng: place.lng,
      });
      if (res.ok) {
        setSaved(true);
        // refresh place tallies so the new vote shows immediately
        const { data } = await supabase.rpc('place_tallies', { p_country: selCountry });
        if (data) setPlaceTally(Object.fromEntries(data.map((r: Feat) => [r.place_code, Number(r.votes)])));
      } else {
        setError(res.error === 'not-logged-in' ? 'Bitte melde dich an.' : 'Konnte nicht speichern.');
      }
    });
  };

  // ── loading skeleton ──
  if (!features || !projection || !path) {
    return (
      <div className="flex aspect-[920/520] w-full items-center justify-center rounded-[14px] border border-line bg-bg">
        <Loader2 className="animate-spin text-faint" size={28} />
      </div>
    );
  }

  // ── current-view helpers ──
  const tallyMax = (t: Tally) => Math.max(1, ...Object.values(t));

  const contLeader = bestKey(contTally);
  const countryLeader = bestKey(countryTally);
  const placeLeader = bestKey(placeTally);

  const canNext = (stage === 'continent' && selCont) || (stage === 'country' && selCountry);
  const canSubmit = stage === 'place' && selPlace && isLoggedIn && isBuyer;

  const hint =
    stage === 'continent'
      ? 'Wähle einen Kontinent auf der Karte'
      : stage === 'country'
        ? `Wähle ein Land in ${continentByKey(selCont!)?.label ?? ''}`
        : `Wähle einen Ort in ${countryByIso(selCountry!)?.label ?? ''}`;

  return (
    <div>
      {/* ── breadcrumb ── */}
      <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-sm">
        <Crumb label="Welt" active={stage === 'continent'} onClick={() => setStage('continent')} />
        {selCont && (
          <>
            <span className="text-faint">›</span>
            <Crumb
              label={continentByKey(selCont)?.label ?? selCont}
              active={stage === 'country'}
              onClick={() => setStage('country')}
            />
          </>
        )}
        {stage === 'place' && selCountry && (
          <>
            <span className="text-faint">›</span>
            <Crumb label={countryByIso(selCountry)?.label ?? selCountry} active onClick={() => {}} />
          </>
        )}
      </div>

      {/* ── the map ── */}
      <div className="overflow-hidden rounded-[14px] border border-line bg-bg">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Interaktive Abstimmungs-Weltkarte">
          <defs>
            <filter id="dm-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="7" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* base land */}
          <g>
            {worldFeatures.map((f, i) => {
              const d = path(f as never);
              if (!d) return null;
              const iso = String(Number((f as { id?: string | number }).id));
              const isCandidate = stage === 'country' && countriesByContinent(selCont ?? '').some((c) => String(Number(c.iso)) === iso);
              if (isCandidate) {
                const votes = countryTally[iso] ?? 0;
                const share = votes / tallyMax(countryTally);
                const isLeader = iso === countryLeader && votes > 0;
                const isSel = selCountry != null && Number(selCountry) === Number(iso);
                return (
                  <path
                    key={`c-${iso}-${i}`}
                    d={d}
                    onClick={() => pickCountry(iso)}
                    className="cursor-pointer transition-[fill-opacity] duration-150"
                    fill={isSel || isLeader ? C.goldBright : C.gold}
                    fillOpacity={isSel ? 0.95 : 0.25 + 0.5 * share}
                    stroke={isSel ? C.goldBright : C.gold}
                    strokeOpacity={0.7}
                    strokeWidth={isSel ? 1.4 : 0.6}
                    filter={isSel || isLeader ? 'url(#dm-glow)' : undefined}
                  />
                );
              }
              const isSelCountryPoly = stage === 'place' && selCountry != null && Number(selCountry) === Number(iso);
              return (
                <path
                  key={`l-${iso}-${i}`}
                  d={d}
                  fill={isSelCountryPoly ? '#2a2418' : C.land}
                  stroke={C.landStroke}
                  strokeWidth={0.4}
                />
              );
            })}
          </g>

          {/* continent zones (stage 1) */}
          {stage === 'continent' &&
            CONTINENTS.map((cont) => {
              const xy = projection([cont.lng, cont.lat]);
              if (!xy) return null;
              const votes = contTally[cont.key] ?? 0;
              const share = votes / tallyMax(contTally);
              const isSel = selCont === cont.key;
              const isLeader = cont.key === contLeader && votes > 0;
              const r = 26 + 16 * share;
              return (
                <g key={cont.key} onClick={() => pickContinent(cont.key)} className="cursor-pointer">
                  <circle
                    cx={xy[0]}
                    cy={xy[1]}
                    r={r}
                    fill={isSel || isLeader ? C.goldBright : C.gold}
                    fillOpacity={isSel ? 0.5 : 0.12 + 0.35 * share}
                    stroke={isSel || isLeader ? C.goldBright : C.gold}
                    strokeWidth={isSel ? 2.5 : 1.3}
                    strokeOpacity={0.9}
                    filter={isSel || isLeader ? 'url(#dm-glow)' : undefined}
                  />
                  <text x={xy[0]} y={xy[1] + 1} textAnchor="middle" className="pointer-events-none font-display" fontSize={15} fontWeight={700} fill={isSel ? '#0A0A0A' : C.text}>
                    {cont.label}
                  </text>
                  {votes > 0 && (
                    <text x={xy[0]} y={xy[1] + r + 15} textAnchor="middle" className="pointer-events-none font-body" fontSize={12} fill={isSel || isLeader ? C.goldBright : C.faint}>
                      {votes} {votes === 1 ? 'Stimme' : 'Stimmen'}
                    </text>
                  )}
                </g>
              );
            })}

          {/* country labels (stage 2) */}
          {stage === 'country' &&
            countriesByContinent(selCont ?? '').map((c) => {
              const f = featByIso(c.iso);
              if (!f) return null;
              const xy = projection(geoCentroid(f as never));
              if (!xy) return null;
              const votes = countryTally[String(Number(c.iso))] ?? 0;
              const isSel = Number(selCountry) === Number(c.iso);
              return (
                <g key={c.iso} onClick={() => pickCountry(String(Number(c.iso)))} className="cursor-pointer">
                  <text x={xy[0]} y={xy[1]} textAnchor="middle" className="font-body" fontSize={12} fontWeight={isSel ? 700 : 500} fill={isSel ? '#0A0A0A' : C.text} stroke="#0A0A0A" strokeWidth={isSel ? 0 : 2.5} paintOrder="stroke">
                    {c.label}
                  </text>
                  {votes > 0 && (
                    <text x={xy[0]} y={xy[1] + 14} textAnchor="middle" className="pointer-events-none font-body" fontSize={11} fill={C.goldBright} stroke="#0A0A0A" strokeWidth={2.5} paintOrder="stroke">
                      {votes}
                    </text>
                  )}
                </g>
              );
            })}

          {/* place pins (stage 3) */}
          {stage === 'place' &&
            placesByCountry(selCountry ?? '').map((p) => {
              const xy = projection([p.lng, p.lat]);
              if (!xy) return null;
              const votes = placeTally[p.code] ?? 0;
              const share = votes / tallyMax(placeTally);
              const isSel = selPlace === p.code;
              const isLeader = p.code === placeLeader && votes > 0;
              const r = 7 + 12 * share;
              return (
                <g key={p.code} onClick={() => pickPlace(p.code)} className="cursor-pointer">
                  <circle
                    cx={xy[0]}
                    cy={xy[1]}
                    r={isSel ? r + 3 : r}
                    fill={isSel || isLeader ? C.goldBright : C.gold}
                    fillOpacity={isSel ? 0.9 : 0.3 + 0.5 * share}
                    stroke={isSel || isLeader ? C.goldBright : C.gold}
                    strokeWidth={isSel ? 2.5 : 1.2}
                    filter={isSel || isLeader ? 'url(#dm-glow)' : undefined}
                  />
                  <text x={xy[0]} y={xy[1] - (isSel ? r + 8 : r + 5)} textAnchor="middle" className="pointer-events-none font-body" fontSize={12} fontWeight={isSel ? 700 : 500} fill={isSel ? C.goldBright : C.text} stroke="#0A0A0A" strokeWidth={2.5} paintOrder="stroke">
                    {p.label}
                    {votes > 0 ? ` · ${votes}` : ''}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>

      {/* ── controls ── */}
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {stage !== 'continent' && (
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-line px-4 py-2.5 font-body text-sm font-medium text-secondary transition-colors hover:border-gold/50 hover:text-primary"
            >
              <ArrowLeft size={16} strokeWidth={1.6} /> Zurück
            </button>
          )}
          <p className="font-body text-sm text-faint">{hint}</p>
        </div>

        <div className="flex items-center gap-3">
          {stage !== 'place' ? (
            <button
              onClick={goNext}
              disabled={!canNext}
              className="inline-flex items-center gap-1.5 rounded-[4px] bg-gold px-6 py-2.5 font-body font-medium text-bg transition-colors hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Weiter <ArrowRight size={16} strokeWidth={1.8} />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!canSubmit || pending}
              className="inline-flex items-center gap-1.5 rounded-[4px] bg-gold px-6 py-2.5 font-body font-medium text-bg transition-colors hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={2} />}
              {saved ? 'Auswahl ändern' : 'Abstimmen'}
            </button>
          )}
        </div>
      </div>

      {/* ── status line ── */}
      <div className="mt-4 min-h-[24px]">
        {error && <p className="font-body text-sm text-red-400">{error}</p>}
        {saved && !error && (
          <p className="flex items-center gap-2 font-body text-sm text-gold">
            <Check size={16} strokeWidth={2} /> Deine Wunsch-Reise ist gespeichert — du kannst sie jederzeit ändern.
          </p>
        )}
        {stage === 'place' && !isLoggedIn && (
          <p className="font-body text-sm text-secondary">
            <a href="/join" className="text-gold hover:text-gold-hover">
              Melde dich an
            </a>{' '}
            um deine Reise abzustimmen.
          </p>
        )}
        {stage === 'place' && isLoggedIn && !isBuyer && (
          <p className="flex items-center gap-2 font-body text-sm text-secondary">
            <Lock size={15} strokeWidth={1.6} className="text-faint" /> Abstimmen ist ein Käufer-Vorteil.{' '}
            <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-hover">
              Zum Shop
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

function Crumb({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={active ? 'font-medium text-gold' : 'text-secondary transition-colors hover:text-primary'}
    >
      {label}
    </button>
  );
}

function bestKey(t: Tally): string | null {
  let best: string | null = null;
  let max = 0;
  for (const [k, v] of Object.entries(t)) {
    if (v > max) {
      max = v;
      best = k;
    }
  }
  return best;
}
