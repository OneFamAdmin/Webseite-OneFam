import Link from 'next/link';

export const metadata = { title: 'OneFam — Dev-Übersicht' };

// Dev-only hub: every route in the app, grouped by mechanism, one click away.
// (Remove or guard this page before production.)

const GOLD = '#C9A84C';

type Item = { href: string; label: string; note: string; external?: boolean };
type Group = { title: string; items: Item[] };

const GROUPS: Group[] = [
  {
    title: 'Design & Voting-Look',
    items: [{ href: '/design', label: '/design', note: 'Design-Vorschau des Reiseziel-Votings (3 Stufen, Demo-Daten)' }],
  },
  {
    title: 'Reiseziel-Voting (echt)',
    items: [{ href: '/reiseziel', label: '/reiseziel', note: 'Interaktive Voting-Karte für Käufer (leerer Zustand, bis eine Runde läuft)' }],
  },
  {
    title: 'Teilnahme & Ziehung',
    items: [
      { href: '/join', label: '/join', note: 'Gratis-Anmeldung „Join the Fam" (Magic-Link)' },
      { href: '/join/bestaetigen', label: '/join/bestaetigen', note: 'Bestätigung nach Magic-Link — ohne Login → leitet zu /join' },
      { href: '/archiv', label: '/archiv', note: 'Öffentliche, nachprüfbare Ziehungsergebnisse' },
    ],
  },
  {
    title: 'Admin (Login als josefgnther@gmail.com nötig)',
    items: [
      { href: '/admin', label: '/admin', note: 'Pool setzen, Ziehung starten — ohne Login → leitet zur Startseite' },
      { href: '/admin/voting', label: '/admin/voting', note: 'Käufer freischalten + Voting-Ergebnisse' },
    ],
  },
  {
    title: 'Rechtliches (Entwürfe)',
    items: [
      { href: '/agb', label: '/agb', note: 'AGB / Teilnahmebedingungen (Entwurf)' },
      { href: '/datenschutz', label: '/datenschutz', note: 'Datenschutzerklärung (Entwurf)' },
    ],
  },
  {
    title: 'Startseite',
    items: [{ href: '/', label: '/', note: 'Komplette Marketing-Seite + Live-Pool + Voting-Teaser' }],
  },
];

export default function DevHub() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#EFE6CF', padding: '48px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <p style={{ fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD }}>OneFam · Dev</p>
        <h1 style={{ fontSize: 34, fontWeight: 700, margin: '8px 0 4px' }}>Alle Links auf einen Blick</h1>
        <p style={{ color: '#8A8A82', fontSize: 14, marginBottom: 32 }}>
          Lokale Übersicht aller Routen. Nur für die Entwicklung — vor dem Go-Live entfernen.
        </p>

        {GROUPS.map((g) => (
          <section key={g.title} style={{ marginBottom: 26 }}>
            <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.14em', color: GOLD, marginBottom: 10 }}>{g.title}</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {g.items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    padding: '12px 16px',
                    borderRadius: 8,
                    background: '#141414',
                    border: '1px solid #2A2A2A',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <span style={{ color: GOLD, fontFamily: 'monospace', fontSize: 15 }}>{it.label}</span>
                  <span style={{ color: '#8A8A82', fontSize: 13 }}>{it.note}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
