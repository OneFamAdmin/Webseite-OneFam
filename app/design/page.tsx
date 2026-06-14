import VotingDesignMap, { type DesignOption } from '@/components/VotingDesignMap';
import { EUROPE_ISOS } from '@/lib/geo/data';
import { CONTINENT_VIEWS } from '@/lib/geo/continents.generated';

export const metadata = { title: 'Design-Vorschau — Reiseziel-Voting' };

const CONTINENTS: DesignOption[] = [
  { label: 'Nordamerika', code: 'north-america', votes: 1200 },
  { label: 'Südamerika', code: 'south-america', votes: 850 },
  { label: 'Europa', code: 'europe', votes: 1100 },
  { label: 'Afrika', code: 'africa', votes: 300 },
  { label: 'Asien', code: 'asia', votes: 1500 },
  { label: 'Ozeanien', code: 'oceania', votes: 490 },
];

const EUROPE: DesignOption[] = [
  { label: 'Frankreich', code: '250', votes: 8200 },
  { label: 'Italien', code: '380', votes: 7600 },
  { label: 'Spanien', code: '724', votes: 7100 },
  { label: 'Griechenland', code: '300', votes: 6100 },
  { label: 'Deutschland', code: '276', votes: 5400 },
  { label: 'Portugal', code: '620', votes: 4800 },
  { label: 'Grossbritannien', code: '826', votes: 3900 },
  { label: 'Kroatien', code: '191', votes: 3300 },
  { label: 'Schweiz', code: '756', votes: 2900 },
  { label: 'Norwegen', code: '578', votes: 2600 },
  { label: 'Island', code: '352', votes: 2400 },
  { label: 'Polen', code: '616', votes: 2200 },
  { label: 'Niederlande', code: '528', votes: 2100 },
  { label: 'Zypern', code: '196', votes: 1900, lat: 35.1, lng: 33.4 },
  { label: 'Österreich', code: '040', votes: 1800 },
  { label: 'Irland', code: '372', votes: 1700 },
  { label: 'Ukraine', code: '804', votes: 1600 },
  { label: 'Schweden', code: '752', votes: 1500 },
  { label: 'Rumänien', code: '642', votes: 1400 },
  { label: 'Dänemark', code: '208', votes: 1300 },
  { label: 'Malta', code: '470', votes: 1250, lat: 35.9, lng: 14.4 },
  { label: 'Belgien', code: '056', votes: 1200 },
  { label: 'Finnland', code: '246', votes: 1100 },
  { label: 'Tschechien', code: '203', votes: 1000 },
  { label: 'Monaco', code: '492', votes: 990, lat: 43.73, lng: 7.42 },
  { label: 'Slowenien', code: '705', votes: 950 },
  { label: 'Ungarn', code: '348', votes: 900 },
  { label: 'Montenegro', code: '499', votes: 850, lat: 42.5, lng: 19.3 },
  { label: 'Bulgarien', code: '100', votes: 800 },
  { label: 'Bosnien', code: '070', votes: 720 },
  { label: 'Serbien', code: '688', votes: 700 },
  { label: 'Slowakei', code: '703', votes: 650 },
  { label: 'Albanien', code: '008', votes: 600 },
  { label: 'Litauen', code: '440', votes: 520 },
  { label: 'Estland', code: '233', votes: 500 },
  { label: 'Luxemburg', code: '442', votes: 480, lat: 49.8, lng: 6.1 },
  { label: 'Lettland', code: '428', votes: 450 },
  { label: 'Nordmaz.', code: '807', votes: 420 },
  { label: 'Belarus', code: '112', votes: 400 },
  { label: 'Kosovo', code: '383', votes: 350, lat: 42.6, lng: 20.9 },
  { label: 'Moldau', code: '498', votes: 300 },
  { label: 'Andorra', code: '020', votes: 280, lat: 42.5, lng: 1.5 },
  { label: 'Liechtenstein', code: '438', votes: 260, lat: 47.16, lng: 9.55 },
  { label: 'San Marino', code: '674', votes: 240, lat: 43.94, lng: 12.46 },
  { label: 'Vatikan', code: '336', votes: 200, lat: 41.9, lng: 12.45 },
];

// Kuratierte Luxus- / "old money"-Reiseziele in Spanien (wohin die Zielgruppe gern reist).
const SPAIN: DesignOption[] = [
  { label: 'Marbella', lat: 36.51, lng: -4.88, votes: 14200 }, // Costa del Sol, Puerto Banús
  { label: 'Ibiza', lat: 38.91, lng: 1.43, votes: 12800 },
  { label: 'Mallorca', lat: 39.57, lng: 2.65, votes: 11500 }, // Palma / Port d'Andratx
  { label: 'San Sebastián', lat: 43.32, lng: -1.98, votes: 8600 },
  { label: 'Sotogrande', lat: 36.28, lng: -5.29, votes: 6400 }, // Polo & Marina
  { label: 'Madrid', lat: 40.42, lng: -3.69, votes: 5900 }, // Barrio de Salamanca
  { label: 'Barcelona', lat: 41.39, lng: 2.17, votes: 5200 },
  { label: 'Costa Brava', lat: 41.97, lng: 3.21, votes: 3800 }, // Cadaqués / S'Agaró
];

const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";

function Stage({
  eyebrow,
  title,
  level,
  options,
  faces,
  landIsos,
  heroIso,
  mapWidth = 1000,
  mapHeight = 560,
}: {
  eyebrow: string;
  title: string;
  level: 'continent' | 'country' | 'place';
  options: DesignOption[];
  faces?: boolean;
  landIsos?: string[];
  heroIso?: string;
  mapWidth?: number;
  mapHeight?: number;
}) {
  return (
    <section
      className="relative overflow-hidden px-6 py-16"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 0%, #1a1326 0%, #0a0a0a 55%), radial-gradient(80% 60% at 100% 100%, rgba(120,60,160,0.22), transparent 60%)',
      }}
    >
      <div className="mx-auto max-w-[1100px] text-center">
        <p className="font-body text-xs uppercase tracking-[0.32em]" style={{ color: '#C9A84C' }}>
          {eyebrow}
        </p>
        <h2
          className="mx-auto mt-3"
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#EBD9A6',
          }}
        >
          {title}
        </h2>
        <div className="mx-auto mt-3 h-px w-48" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
      </div>

      {/* map breaks out of the text column so it can use the full width of large screens */}
      <div className="mx-auto mt-8 w-full max-w-[2200px]">
        <VotingDesignMap level={level} options={options} faces={faces} landIsos={landIsos} heroIso={heroIso} width={mapWidth} height={mapHeight} />
      </div>
    </section>
  );
}

export default function DesignPreview() {
  return (
    <div style={{ background: '#0a0a0a' }}>
      <div className="flex items-center justify-center gap-3 px-6 pt-10" style={{ background: '#0a0a0a' }}>
        <span className="font-body text-xs uppercase tracking-[0.2em]" style={{ color: '#8A8A82' }}>
          Kontinent-Wahl endet in
        </span>
        <div className="flex gap-2">
          {[
            ['23', 'Tage'],
            ['14', 'Std'],
            ['08', 'Min'],
            ['55', 'Sek'],
          ].map(([n, l]) => (
            <div key={l} className="rounded-[8px] px-3 py-1.5 text-center" style={{ background: '#15171b', border: '0.5px solid #2A2A2A', minWidth: 54 }}>
              <div className="font-display text-xl font-semibold" style={{ color: '#E2BF6A' }}>{n}</div>
              <div className="font-body text-[10px] uppercase tracking-[0.12em]" style={{ color: '#8A8A82' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <Stage eyebrow="Stufe 1 · Kontinent" title="Wohin als Nächstes?" level="continent" options={CONTINENTS} />
      <Stage eyebrow="Stufe 2 · Land" title="Europa" level="country" options={EUROPE} faces landIsos={EUROPE_ISOS} mapWidth={1800} mapHeight={840} />
      {CONTINENT_VIEWS.map((v) => (
        <Stage key={v.key} eyebrow="Stufe 2 · Land" title={v.title} level="country" options={v.options} faces landIsos={v.isos} mapWidth={1800} mapHeight={840} />
      ))}
      <Stage eyebrow="Stufe 3 · Ort" title="Spanien" level="place" options={SPAIN} heroIso="724" landIsos={['724']} />
    </div>
  );
}
