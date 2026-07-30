import React from 'react';
import Link from 'next/link';
import LegalLayout, { Section, Bullets, ContactCard } from './LegalLayout';

/**
 * Rechtstexte als Daten statt als JSX.
 *
 * Vorher standen AGB und Datenschutzerklärung als fest verdrahtetes JSX in
 * app/agb/page.tsx und app/datenschutz/page.tsx — rund 1'700 Wörter deutscher
 * Fliesstext mitten im Code. Übersetzen hätte bedeutet, die Seite viermal zu
 * bauen und viermal zu pflegen.
 *
 * Jetzt liegt der Text in messages/legal/<sprache>.json und diese Komponente
 * rendert ihn. Eine Sprache dazuzunehmen heisst ab jetzt: eine Datei schreiben.
 *
 * Der Aufbau ist bewusst eine Liste typisierter Blöcke statt fester Felder:
 * In Ziffer 1 der AGB steht die Kontaktkarte MITTEN zwischen zwei Absätzen.
 * Mit festen Feldern („paragraphs", „contact") liesse sich diese Reihenfolge
 * nicht ausdrücken, ohne sie im Renderer festzunageln — und beim nächsten
 * Rechtstext, der anders aufgebaut ist, ginge es wieder von vorn los.
 */

export type Block =
  | { art: 'absatz'; text: string }
  | { art: 'liste'; punkte: string[] }
  | { art: 'kontakt' };

export type Abschnitt = {
  nr: string;
  titel: string;
  bloecke: Block[];
};

export type Rechtstext = {
  eyebrow: string;
  titel: string;
  stand: string;
  einleitung: string;
  abschnitte: Abschnitt[];
};

/**
 * Winziger Auszeichnungs-Übersetzer für die Textbausteine.
 *
 * Erlaubt sind genau drei Auszeichnungen, mehr braucht kein Rechtstext:
 *   <b>…</b>       hervorgehoben (weiss)
 *   <hinweis>…</hinweis>  gedämpft — die Klammervermerke, die noch
 *                          anwaltlich zu klären sind
 *   <ds>…</ds>     Verweis auf die Datenschutzerklärung
 *
 * Bewusst kein dangerouslySetInnerHTML: Der Text kommt zwar aus unseren
 * eigenen Dateien, aber eine Rechtstextseite ist der letzte Ort, an dem man
 * sich eine Lücke einbauen will, nur um sich einen Parser zu sparen.
 */
function RichText({ text, dsHref }: { text: string; dsHref: string }) {
  const teile = text.split(/(<b>.*?<\/b>|<hinweis>.*?<\/hinweis>|<ds>.*?<\/ds>)/g);

  return (
    <>
      {teile.map((teil, i) => {
        const b = teil.match(/^<b>([\s\S]*?)<\/b>$/);
        if (b) {
          return (
            <strong key={i} className="text-primary">
              {b[1]}
            </strong>
          );
        }

        const h = teil.match(/^<hinweis>([\s\S]*?)<\/hinweis>$/);
        if (h) {
          return (
            <span key={i} className="text-faint">
              {h[1]}
            </span>
          );
        }

        const d = teil.match(/^<ds>([\s\S]*?)<\/ds>$/);
        if (d) {
          return (
            <Link
              key={i}
              href={dsHref}
              className="text-gold transition-colors duration-[180ms] hover:text-gold-hover"
            >
              {d[1]}
            </Link>
          );
        }

        return <React.Fragment key={i}>{teil}</React.Fragment>;
      })}
    </>
  );
}

export default function LegalDoc({ doc, dsHref }: { doc: Rechtstext; dsHref: string }) {
  return (
    <LegalLayout
      eyebrow={doc.eyebrow}
      title={doc.titel}
      updated={doc.stand}
      lead={
        <p>
          <RichText text={doc.einleitung} dsHref={dsHref} />
        </p>
      }
    >
      {doc.abschnitte.map((a) => (
        <Section key={a.nr} n={a.nr} title={a.titel}>
          {a.bloecke.map((b, i) => {
            if (b.art === 'kontakt') return <ContactCard key={i} />;
            if (b.art === 'liste') return <Bullets key={i} items={b.punkte} />;
            return (
              <p key={i}>
                <RichText text={b.text} dsHref={dsHref} />
              </p>
            );
          })}
        </Section>
      ))}
    </LegalLayout>
  );
}
