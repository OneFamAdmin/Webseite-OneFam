'use client';

import { useEffect, useRef } from 'react';

// Plays on every device. Nudges play() on mount and on the first user
// interaction (covers strict mobile autoplay blocks like iOS Low Power Mode).
const HeroVideo = () => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    tryPlay();

    const onInteract = () => tryPlay();
    window.addEventListener('touchstart', onInteract, { once: true, passive: true });
    window.addEventListener('click', onInteract, { once: true });
    document.addEventListener('visibilitychange', tryPlay);
    return () => {
      window.removeEventListener('touchstart', onInteract);
      window.removeEventListener('click', onInteract);
      document.removeEventListener('visibilitychange', tryPlay);
    };
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 z-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster="/assets/hero-poster.jpg"
    >
      {/* WebM first (smaller, modern browsers); MP4 fallback for Safari/iOS */}
      <source src="/hero.webm" type="video/webm" />
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  );
};

export default HeroVideo;
