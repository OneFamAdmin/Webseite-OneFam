'use client';

import { useEffect, useRef } from 'react';

// Läuft auf jedem Gerät. Ein einzelnes play() beim Einhängen reicht nicht — das ist am
// 26.10.2026 aufgefallen: In Safari am Mac (privates Fenster) blieb das Standbild stehen,
// bis man scrollte. Deshalb stossen wir an mehreren Stellen erneut an: sobald Daten da
// sind, sobald die Seite fertig geladen ist, sobald das Video im Bild ist, nach kurzen
// Wartezeiten und bei der ersten Eingabe (Tippen, Klicken, Scrollen, Taste).
// Dazu haben hero*.mp4/webm keine Tonspur mehr (Originale mit Ton in
// onefam-material/videos/hero-original-mit-ton). Ein Video ohne Ton darf in Safari immer
// selbst starten, auch wenn „Medien mit Ton stoppen" eingestellt ist.
//
// Gemessen am selben Tag auf Labis iPhone (iOS 18.7, mit einer Messroute, die danach
// wieder entfernt wurde): Dort lädt iOS das Video gar nicht erst und lehnt jedes play()
// mit NotAllowedError ab, bis der Bildschirm berührt wird — bei fremden Seiten mit
// Vollbild-Video genauso. Das ist eine Sperre des Geräts (Stromspar- oder Datensparmodus),
// keine der Seite, und lässt sich nicht umgehen. Ein Versuch, die Sperre mit einem
// unsichtbaren 1-px-Scrollen zu lösen, hat nachweislich nichts gebracht und ist wieder raus.
const HeroVideo = () => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');

    const tryPlay = () => {
      if (!v.paused || document.hidden) return;
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    tryPlay();

    const mediaEvents = ['loadedmetadata', 'loadeddata', 'canplay'] as const;
    mediaEvents.forEach((e) => v.addEventListener(e, tryPlay));

    const inputEvents = ['touchstart', 'pointerdown', 'click', 'scroll', 'wheel', 'keydown'] as const;
    inputEvents.forEach((e) => window.addEventListener(e, tryPlay, { passive: true }));

    window.addEventListener('load', tryPlay);
    document.addEventListener('visibilitychange', tryPlay);

    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) tryPlay();
    });
    io.observe(v);

    const timers = [300, 1000, 2500].map((ms) => setTimeout(tryPlay, ms));

    // Sobald es einmal läuft, braucht es die Eingabe-Hilfen nicht mehr.
    const onPlaying = () => inputEvents.forEach((e) => window.removeEventListener(e, tryPlay));
    v.addEventListener('playing', onPlaying);

    return () => {
      mediaEvents.forEach((e) => v.removeEventListener(e, tryPlay));
      inputEvents.forEach((e) => window.removeEventListener(e, tryPlay));
      window.removeEventListener('load', tryPlay);
      document.removeEventListener('visibilitychange', tryPlay);
      v.removeEventListener('playing', onPlaying);
      io.disconnect();
      timers.forEach(clearTimeout);
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
      {/* Handy zuerst (26.10.2026): 960 × 540, H.264, 4,4 MB statt 9,5 MB (WebM) bzw.
          17,7 MB (MP4). Im Mobilfunk teilte sich das Video die Leitung mit allen Bildern;
          unter 55 % Abdunkelung ist der Unterschied zur 720p-Fassung nicht zu sehen.
          media auf <source> beachten Safari, Chrome ab 120 und Firefox ab 120. */}
      <source src="/hero-mobil.mp4" type="video/mp4" media="(max-width: 767px)" />
      {/* WebM first (smaller, modern browsers); MP4 fallback for Safari/iOS */}
      <source src="/hero.webm" type="video/webm" />
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  );
};

export default HeroVideo;
