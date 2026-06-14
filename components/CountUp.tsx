'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

// Swiss formatting: thousands separator is the apostrophe (U+2019), e.g. 4'280
const swiss = (n: number) =>
  Math.round(n)
    .toLocaleString('de-CH')
    .replace(/[  ,.]/g, '’');

type CountUpProps = {
  to: number;
  prefix?: string; // e.g. "CHF "
  duration?: number; // seconds
  className?: string;
};

export default function CountUp({ to, prefix = '', duration = 1.6, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(swiss(0));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(swiss(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
    </span>
  );
}
