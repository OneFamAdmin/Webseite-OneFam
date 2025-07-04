'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion'; 
import FancyGradient from './FancyGradient';

const GradientCursor = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

//   const springConfig = { damping: 25, stiffness: 700 };
   const springConfig = { damping: 5, stiffness: 20 }; 
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 75); // center the 150px container
      cursorY.set(e.clientY - 75);

      const target = e.target as HTMLElement;
      if (window.getComputedStyle(target).cursor === 'pointer') {
        containerRef.current?.classList.add('scale-125', 'opacity-90');
      } else {
        containerRef.current?.classList.remove('scale-125', 'opacity-90');
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      ref={containerRef}
      style={{
        position: 'fixed',
        left: cursorXSpring,
        top: cursorYSpring,
        width: 160,
        height: 160,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
        transition: 'transform 0.s ease',
      }}
      className="transition-all duration-300 ease-out"
    >
      <FancyGradient className="w-full h-full" />
    </motion.div>
  );
};

export default GradientCursor;
