'use client';

import { useEffect, useState } from 'react';

const GOLD = '#E2BF6A';

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    Tage: Math.floor(s / 86400),
    Std: Math.floor((s % 86400) / 3600),
    Min: Math.floor((s % 3600) / 60),
    Sek: s % 60,
  };
}

// Ticking countdown to a deadline. Renders zeros on the server / first paint (so there's no
// hydration mismatch), then fills in and ticks every second once mounted in the browser.
export default function Countdown({ deadline, label }: { deadline: string; label?: string }) {
  const target = new Date(deadline).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const p = split(now == null ? 0 : target - now);
  const over = now != null && target - now <= 0;

  return (
    <div className="flex flex-col items-center gap-2.5">
      {label && (
        <span className="font-body text-xs uppercase tracking-[0.22em]" style={{ color: '#8A8A82' }}>
          {over ? 'Abstimmung beendet' : label}
        </span>
      )}
      <div className="flex gap-2 sm:gap-2.5">
        {(['Tage', 'Std', 'Min', 'Sek'] as const).map((unit) => (
          <div
            key={unit}
            className="rounded-[10px] px-3 py-2 text-center sm:px-4 sm:py-2.5"
            style={{ background: '#15171b', border: '0.5px solid #2A2A2A', minWidth: 58 }}
          >
            <div className="font-display text-2xl font-semibold tabular-nums sm:text-3xl" style={{ color: GOLD }}>
              {String(p[unit]).padStart(2, '0')}
            </div>
            <div className="font-body text-[10px] uppercase tracking-[0.12em]" style={{ color: '#8A8A82' }}>
              {unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
