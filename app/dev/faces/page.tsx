import VotingDesignMap, { type DesignOption } from '@/components/VotingDesignMap';
import { placesByCountry, countriesByContinent } from '@/lib/geo/data';

export const metadata = { title: 'Gesichter-Vergleich — Design-Studie' };

// descending demo tallies so there's always a clear leader to look at
const votes = (n: number, top: number) => Array.from({ length: n }, (_, i) => Math.round(top - i * (top / (n + 2))));

const placeOpts = (iso: string): DesignOption[] => {
  const ps = placesByCountry(iso);
  const v = votes(ps.length, 14000);
  return ps.map((p, i) => ({ label: p.label, code: p.code, votes: v[i], lat: p.lat, lng: p.lng }));
};

const usa = placeOpts('840');
const greece = placeOpts('300');

const euCountries = countriesByContinent('europe');
const euVotes = votes(euCountries.length, 9000);
const europe: DesignOption[] = euCountries.map((c, i) => ({ label: c.label, code: c.iso, votes: euVotes[i], lat: c.lat, lng: c.lng }));
const euIsos = euCountries.map((c) => c.iso);

const VARIANTS = [
  { key: 'color', label: 'A — Aktuell (Flaggenfarben)', note: 'die bunten Nationalfarben' },
  { key: 'none', label: 'B — Ohne Gesicht (pures Gold)', note: 'nur Goldland + Marker' },
  { key: 'gold', label: 'C — Gold-monochrom', note: 'Gesicht in Markengold' },
] as const;

const serif = "'Cormorant Garamond', Georgia, serif";

function Cap({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-8 text-center" style={{ color: '#8A8A82', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
      {children}
    </p>
  );
}

export default function FacesComparePage() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="px-6 pt-10 text-center">
        <h1 style={{ fontFamily: serif, color: '#EBD9A6', fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Gesichter in den Ländern — A / B / C
        </h1>
        <p className="mx-auto mt-3 max-w-[640px]" style={{ color: '#8A8A82', fontSize: 14, lineHeight: 1.7 }}>
          Dreimal dieselben Karten, nur die Behandlung der Gesichter ändert sich. Scrolle und vergleiche, welche Variante
          am besten zum schwarz-goldenen Luxus-Look der Seite passt.
        </p>
      </div>

      {VARIANTS.map((v) => (
        <section key={v.key} className="mt-10" style={{ borderTop: '1px solid #2a2a2a', paddingTop: '2rem' }}>
          <h2 className="text-center" style={{ fontFamily: serif, color: '#E2BF6A', fontSize: '2rem', letterSpacing: '0.05em' }}>
            {v.label}
          </h2>
          <p className="mt-1 text-center" style={{ color: '#6f6f68', fontSize: 13, fontStyle: 'italic' }}>{v.note}</p>

          <div className="mx-auto mt-4 w-full max-w-[1500px] px-4">
            <Cap>Stufe 3 · Ort — USA (breite Einzelfläche)</Cap>
            <VotingDesignMap level="place" heroIso="840" landIsos={['840']} options={usa} faceStyle={v.key} width={1500} height={760} />

            <Cap>Stufe 3 · Ort — Griechenland (Inselgruppe)</Cap>
            <VotingDesignMap level="place" heroIso="300" landIsos={['300']} options={greece} faceStyle={v.key} width={1500} height={760} />

            <Cap>Stufe 2 · Land — Europa (kleine Embleme)</Cap>
            <VotingDesignMap level="country" faces landIsos={euIsos} options={europe} faceStyle={v.key} width={1700} height={820} />
          </div>
        </section>
      ))}
    </div>
  );
}
