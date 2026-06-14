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

  // Reveal immediately if already on screen at mount — the in-view observer
  // doesn't reliably fire for content that's visible on first paint, which
  // would otherwise leave the hero/above-the-fold invisible.
  useEffect(() => {
    const el = ref.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) setShow(true);
    }
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
