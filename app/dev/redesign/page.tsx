export const metadata = { title: 'Redesign-Test — Hauptlogo (Gradient)' };

// The OneFam brand gradient, lifted straight from logo-face-gradient.svg (bottom→top in the mark).
const BRAND = 'linear-gradient(135deg, #FAD649 0%, #EF8031 28%, #EB356A 55%, #C131BF 78%, #6B46F1 100%)';
const GOLD = '#c9a84c';

function Nav() {
  return (
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
      <div className="flex items-center gap-2.5">
        <img src="/assets/logo-face-gradient.svg" alt="" className="h-7 w-7" />
        <span className="font-display text-lg font-semibold tracking-[0.04em] text-white">OneFam</span>
      </div>
      <div className="hidden gap-8 font-body text-sm text-secondary sm:flex">
        <span>About</span>
        <span>Reiseziel</span>
        <span>Code</span>
        <span>Shop</span>
      </div>
      <span className="rounded-[4px] px-4 py-2 font-body text-sm font-medium text-bg" style={{ background: BRAND }}>
        Join the Fam
      </span>
    </div>
  );
}

/* ── Variant 1: gradient-forward — the brand gradient becomes the accent language ── */
function HeroGradient() {
  return (
    <section className="relative overflow-hidden" style={{ background: 'radial-gradient(120% 90% at 50% -10%, #1a1326 0%, #0a0a0a 55%)' }}>
      <Nav />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-10 text-center">
        {/* the real brand mark, large, with its own gradient glow */}
        <div className="relative mb-8">
          <div className="absolute inset-0 -z-10 blur-3xl" style={{ background: BRAND, opacity: 0.35, transform: 'scale(1.4)' }} />
          <img src="/assets/logo-face-gradient.svg" alt="OneFam" className="h-32 w-32" />
        </div>
        <p className="font-body text-xs uppercase tracking-[0.34em]" style={{ color: GOLD }}>OneFam</p>
        <h1 className="mt-4 font-display font-semibold uppercase leading-[0.98] text-white" style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', letterSpacing: '0.01em' }}>
          For good souls
          <br />
          <span style={{ background: BRAND, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>worldwide</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-body text-base leading-[1.7] text-secondary">
          Eine globale Community für Menschen mit guter Energie — die sich respektieren, inspirieren und gemeinsam mehr aus
          ihrem Leben machen.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-[5px] px-7 py-3.5 font-body text-base font-medium text-bg" style={{ background: BRAND }}>Join the Fam</span>
          <span className="rounded-[5px] border px-7 py-3.5 font-body text-base font-medium text-white" style={{ borderColor: 'rgba(255,255,255,0.25)' }}>
            Entdecke OneFam
          </span>
        </div>
        <div className="mt-12 h-px w-56" style={{ background: BRAND, opacity: 0.7 }} />
      </div>
    </section>
  );
}

/* ── Variant 2: gold-restrained — current luxury palette kept, the gradient LOGO is the single
   colour anchor, everything else stays gold (the "stay true but quiet" option) ── */
function HeroRestrained() {
  return (
    <section className="relative overflow-hidden" style={{ background: 'radial-gradient(120% 90% at 50% -10%, #15110a 0%, #0a0a0a 55%)' }}>
      <Nav />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-10 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 -z-10 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(226,191,106,0.4), transparent 65%)', transform: 'scale(1.5)' }} />
          <img src="/assets/logo-face-gradient.svg" alt="OneFam" className="h-32 w-32" />
        </div>
        <p className="font-body text-xs uppercase tracking-[0.34em]" style={{ color: GOLD }}>OneFam</p>
        <h1 className="mt-4 font-display font-semibold uppercase leading-[0.98]" style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', letterSpacing: '0.01em', color: '#EBD9A6' }}>
          For good souls worldwide
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-body text-base leading-[1.7] text-secondary">
          Eine globale Community für Menschen mit guter Energie — die sich respektieren, inspirieren und gemeinsam mehr aus
          ihrem Leben machen.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-[5px] px-7 py-3.5 font-body text-base font-medium text-bg" style={{ background: GOLD }}>Join the Fam</span>
          <span className="rounded-[5px] border px-7 py-3.5 font-body text-base font-medium" style={{ borderColor: 'rgba(201,168,76,0.5)', color: GOLD }}>
            Entdecke OneFam
          </span>
        </div>
        <div className="mt-12 h-px w-56" style={{ background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }} />
      </div>
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-2 pt-10">
      <span className="font-body text-[11px] uppercase tracking-[0.24em] text-faint">{children}</span>
    </div>
  );
}

export default function RedesignTest() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Tag>Variante 1 — Gradient-forward (Markenfarbverlauf als Akzent)</Tag>
      <HeroGradient />
      <div className="h-3" style={{ background: '#000' }} />
      <Tag>Variante 2 — Gold zurückhaltend (Gradient nur im Logo, Rest bleibt gold)</Tag>
      <HeroRestrained />
    </div>
  );
}
