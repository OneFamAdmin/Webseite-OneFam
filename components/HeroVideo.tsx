'use client';

import { useEffect, useRef } from 'react';

// Läuft auf jedem Gerät. Ein einzelnes play() beim Einhängen reicht nicht — das ist am
// 26.10.2026 aufgefallen: In Safari (privates Fenster) blieb das Standbild stehen, bis man
// scrollte. Unser Code startete nur bei touchstart/click; dass es beim Scrollen losging,
// war also Safari selbst. WebKit hält ein stummes Selbststart-Video zurück, solange es
// nicht sicher ist, dass es sichtbar ist, und prüft das teils erst beim nächsten Scrollen.
// Das frühe play() beim Einhängen läuft dann ins Leere, und danach versuchte es niemand
// mehr. Deshalb stossen wir jetzt an mehreren Stellen erneut an: sobald Daten da sind,
// sobald die Seite fertig geladen ist, sobald das Video im Bild ist, nach kurzen
// Wartezeiten und bei der ersten Eingabe (Tippen, Klicken, Scrollen, Taste).
// Zweiter Teil derselben Änderung: hero.webm/hero.mp4 haben keine Tonspur mehr (Originale
// mit Ton in onefam-material/videos/hero-original-mit-ton). Ein Video ohne Ton darf in
// Safari immer selbst starten, auch wenn „Medien mit Ton stoppen" eingestellt ist.
// Deckt weiterhin den iPhone-Stromsparmodus ab: dort startet erst die erste Eingabe.
const HeroVideo = () => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');

    // Zweiter Fund am 26.10.2026, nur auf dem iPhone (Stromsparmodus aus): auch die
    // wiederholten play()-Aufrufe halfen dort nicht, das Video stand bis zum Scrollen. iOS
    // lässt ein stummes Video nur spielen, wenn es als „im Bild" vermerkt ist — und diesen
    // Vermerk setzt WebKit hier erst bei einer Scrollbewegung. Bis dahin lehnt es jedes
    // play() ab. Deshalb scrollen wir einmal um 1 px und sofort zurück: Das löst dieselbe
    // Prüfung aus wie der Finger, ist aber nicht zu sehen. „instant", weil html sonst
    // smooth scrollt. Höchstens dreimal, damit nichts in einer Schleife zuckt.
    let anstoesse = 0;
    const sichtbarkeitAnstossen = () => {
      if (!v.paused || anstoesse >= 3) return;
      anstoesse += 1;
      const x = window.scrollX;
      const y = window.scrollY;
      window.scrollTo({ left: x, top: y + 1, behavior: 'instant' });
      requestAnimationFrame(() => {
        window.scrollTo({ left: x, top: y, behavior: 'instant' });
        requestAnimationFrame(() => abspielen(false));
      });
    };

    const abspielen = (anstossen: boolean) => {
      if (!v.paused || document.hidden) return;
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          if (anstossen) sichtbarkeitAnstossen();
        });
      }
    };
    const tryPlay = () => abspielen(true);
    tryPlay();

    const mediaEvents = ['loadedmetadata', 'loadeddata', 'canplay'] as const;
    mediaEvents.forEach((e) => v.addEventListener(e, tryPlay));

    const inputEvents = ['touchstart', 'pointerdown', 'click', 'scroll', 'wheel', 'keydown'] as const;
    const onInput = () => tryPlay();
    inputEvents.forEach((e) => window.addEventListener(e, onInput, { passive: true }));

    window.addEventListener('load', tryPlay);
    document.addEventListener('visibilitychange', tryPlay);

    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) tryPlay();
    });
    io.observe(v);

    const timers = [300, 1000, 2500].map((ms) => setTimeout(tryPlay, ms));

    // Sobald es einmal läuft, braucht es die Eingabe-Hilfen nicht mehr.
    const onPlaying = () => inputEvents.forEach((e) => window.removeEventListener(e, onInput));
    v.addEventListener('playing', onPlaying);

    return () => {
      mediaEvents.forEach((e) => v.removeEventListener(e, tryPlay));
      inputEvents.forEach((e) => window.removeEventListener(e, onInput));
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
      {/* WebM first (smaller, modern browsers); MP4 fallback for Safari/iOS */}
      <source src="/hero.webm" type="video/webm" />
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  );
};

export default HeroVideo;
