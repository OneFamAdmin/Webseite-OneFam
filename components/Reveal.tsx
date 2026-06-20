'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// Brief spec is opacity 0→1 + translateY + cubic-bezier(0.16,1,0.3,1), once.
// Softened per request to feel closer to the old site's reveal (longer, more travel).
const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: React.ReactNode;
  /** stagger delay in seconds */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'span';
};

export default function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [show, setShow] = useState(false);

  // Reveal on scroll for below-the-fold content.
  useEffect(() => {
    if (inView) setShow(true);
  }, [inView]);

  // Reveal immediately if already on screen — the in-view observer doesn't reliably fire for
  // content that's visible on first paint. A single synchronous check at mount is brittle: the
  // first-paint layout (before webfonts settle) can place above-the-fold content below the fold
  // for a frame, so it would stay invisible forever. Re-check after a frame + a short fallback.
  useEffect(() => {
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const check = () => {
      const el = ref.current;
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
      if (onScreen) setShow(true);
      return onScreen;
    };
    if (!check()) {
      raf = requestAnimationFrame(() => {
        if (!check()) timer = setTimeout(check, 220);
      });
    }
    return () => {
      cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const MotionTag = motion[as];

  return (
    <MotionTag
      ref={ref as never}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}
