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

    // VORÜBERGEHENDE MESSUNG (26.10.2026), nur mit ?diag=1 in der Adresse: schreibt den
    // Ablauf mit und schickt ihn nach 6 s an /api/video-diagnose (landet im Vercel-
    // Protokoll). Mit &quelle=mp4 wird die MP4-Datei erzwungen, um zu prüfen, ob das
    // iPhone an der WebM-Datei hängt. Nach der Fehlersuche wieder entfernen.
    const params = new URLSearchParams(window.location.search);
    const diag = params.has('diag');
    const t0 = performance.now();
    const ablauf: string[] = [];
    const log = (was: string) => {
      if (diag) ablauf.push(`${Math.round(performance.now() - t0)} ${was}`);
    };
    if (params.get('quelle') === 'mp4') {
      v.querySelector('source[type="video/webm"]')?.remove();
      v.load();
      log('webm entfernt, load()');
    }
    const diagEvents = ['loadstart', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'play', 'playing', 'pause', 'waiting', 'stalled', 'suspend', 'error'] as const;
    const onDiag = (e: Event) => log(`${e.type} ready=${v.readyState} net=${v.networkState} paused=${v.paused}`);
    if (diag) diagEvents.forEach((e) => v.addEventListener(e, onDiag));
    const onScrollDiag = () => log(`scroll y=${Math.round(window.scrollY)}`);
    if (diag) window.addEventListener('scroll', onScrollDiag, { passive: true });
    const diagTimer = diag
      ? setTimeout(() => {
          const r = v.getBoundingClientRect();
          const bericht = {
            ua: navigator.userAgent,
            src: v.currentSrc,
            paused: v.paused,
            zeit: v.currentTime,
            ready: v.readyState,
            net: v.networkState,
            fehler: v.error?.code ?? null,
            muted: v.muted,
            sichtbar: document.visibilityState,
            rect: [Math.round(r.top), Math.round(r.width), Math.round(r.height)],
            fenster: [window.innerWidth, window.innerHeight],
            anstoesse,
            ablauf,
          };
          fetch('/api/video-diagnose', { method: 'POST', body: JSON.stringify(bericht), keepalive: true }).catch(() => {});
        }, 6000)
      : undefined;

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
      log(`anstoss ${anstoesse}`);
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
      log('play()');
      if (p && typeof p.catch === 'function') {
        p.catch((err: unknown) => {
          log(`abgelehnt ${err instanceof Error ? `${err.name}: ${err.message}` : String(err)}`);
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
      log(`im Bild=${entries.some((en) => en.isIntersecting)}`);
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
      diagEvents.forEach((e) => v.removeEventListener(e, onDiag));
      window.removeEventListener('scroll', onScrollDiag);
      if (diagTimer) clearTimeout(diagTimer);
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
