import de from '@/messages/de.json';
import en from '@/messages/en.json';
import es from '@/messages/es.json';
import fr from '@/messages/fr.json';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import { FIRMA } from '@/lib/schema';
import { DEFAULT_LOCALE, LOCALES, homePath, joinPath, legalPath, shopUrl, type Locale } from '@/i18n/routing';

// /llms.txt und /llms-full.txt — eingeführt am 19.11.2026.
//
// Was das ist: ein Vorschlag (llmstxt.org), kein Standard. Google nutzt die Dateien
// nicht für die Suche; einige KI-Dienste lesen sie, um eine Seite zu verstehen, ohne
// HTML, Menü und Skripte durchkauen zu müssen. Der Nutzen ist klein, der Aufwand auch.
//
// Warum die Texte NICHT hier stehen, sondern aus messages/<sprache>.json kommen:
// Eine zweite Fassung der Seitentexte würde auseinanderlaufen — und dann erzählt
// llms.txt einer KI etwas anderes als die Seite einem Menschen. Gerade bei den
// rechtlich heiklen Sätzen (keine Verlosung, keine Reise versprochen, siehe
// Sprachregeln in CLAUDE.md) darf es nur eine Quelle geben. Wer einen Text auf der
// Startseite ändert, ändert ihn damit automatisch auch hier.
//
// Übernommen werden NUR die Abschnitte, die components/HomePage.tsx tatsächlich
// zeigt. how_it_works steht zwar noch in den Übersetzungen, gehört aber zum
// geparkten Auswahl-Trichter (CLAUDE.md, „Aktueller Stand") und hat hier nichts
// verloren. Wer einen Abschnitt auf der Startseite ein- oder ausbaut, zieht
// abschnitte() unten nach.

const TEXTE = { en, de, fr, es } as const;

type Texte = typeof en;

const SPRACHNAME: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
};

function adresse(pfad: string): string {
  return pfad === '/' ? SITE_URL : `${SITE_URL}${pfad}`;
}

/** Kurzfassung nach llmstxt.org: Titel, Zusammenfassung, Linklisten. Englisch, weil Standardsprache. */
export function llmsTxt(): string {
  const t = TEXTE[DEFAULT_LOCALE];
  const zeilen: string[] = [
    `# ${SITE_NAME}`,
    '',
    `> ${t.seo.description}`,
    '',
    `${t.what_is_onefam.intro}`,
    '',
    'Key facts:',
    `- Sole proprietorship based in ${FIRMA.ort}, Switzerland. Contact: ${FIRMA.email}`,
    '- Sells clothing (logo line and country lines) in a separate shop.',
    '- The site is available in English, German, French and Spanish.',
    // Bewusst kein eigener Satz zur Reise oder zur Auswahl: Hier steht wörtlich die
    // Antwort aus der FAQ der Seite. Eigene Formulierungen in diese Richtung verbieten
    // die Sprachregeln in CLAUDE.md — sie müssten erst gegengelesen werden.
    `- ${t.faq.items[0].question} ${t.faq.items[0].answer}`,
    '',
    '## Pages',
    '',
  ];

  for (const l of LOCALES) {
    zeilen.push(`- [${SPRACHNAME[l]}: home](${adresse(homePath(l))})`);
  }
  for (const l of LOCALES) {
    zeilen.push(`- [${SPRACHNAME[l]}: join the waiting list](${adresse(joinPath(l))})`);
  }
  zeilen.push(`- [Shop](${shopUrl(DEFAULT_LOCALE)}): clothing, separate WooCommerce shop`);

  zeilen.push('', '## Legal', '');
  zeilen.push(`- [Imprint](${adresse(legalPath(DEFAULT_LOCALE, 'impressum'))})`);
  zeilen.push(`- [Privacy policy](${adresse(legalPath(DEFAULT_LOCALE, 'datenschutz'))})`);
  zeilen.push(`- [Terms](${adresse(legalPath(DEFAULT_LOCALE, 'agb'))})`);

  zeilen.push('', '## Optional', '');
  zeilen.push(`- [Full text of the home page in all four languages](${SITE_URL}/llms-full.txt)`);
  zeilen.push(`- [Instagram](https://www.instagram.com/onefam_official/)`);

  return zeilen.join('\n') + '\n';
}

/** Die Abschnitte der Startseite in der Reihenfolge, in der HomePage.tsx sie zeigt. */
function abschnitte(t: Texte): string[] {
  const z: string[] = [];

  z.push(`### ${t.hero.kicker}`, '', `**${t.hero.claim}**`, '', t.hero.subline, '');

  z.push(`### ${t.what_is_onefam.label}`, '', `**${t.what_is_onefam.title}**`, '', t.what_is_onefam.intro, '');

  z.push(`### ${t.why_we_do_this.label}`, '', `**${t.why_we_do_this.title}**`, '');
  for (const absatz of t.why_we_do_this.paragraphs) z.push(absatz, '');

  z.push(`### ${t.product_bridge.label}`, '', `**${t.product_bridge.title}**`, '');
  z.push(t.product_bridge.intro, '', t.product_bridge.haltung, '');
  for (const linie of t.product_bridge.lines) z.push(`- **${linie.name}:** ${linie.text}`);
  z.push('');

  z.push(`### ${t.philosophy.label}`, '', `> ${t.philosophy.quote}`, '');

  z.push(`### ${t.values.label}: ${t.values.title}`, '', t.values.intro, '');
  for (const wert of t.values.items) z.push(`- **${wert.title}:** ${wert.text}`);
  z.push('', `#### ${t.values.long_label}`, '');
  for (const absatz of t.values.long) z.push(absatz, '');

  z.push(`### ${t.travel_pool.label}`, '', `**${t.travel_pool.title}**`, '', t.travel_pool.description, '');
  for (const punkt of t.travel_pool.points) z.push(`- ${punkt}`);
  z.push('');

  z.push(`### ${t.faq.label}`, '');
  for (const eintrag of t.faq.items) z.push(`**${eintrag.question}**`, '', eintrag.answer, '');

  z.push(`### ${t.final_cta.title}`, '', t.final_cta.text, '');

  return z;
}

/** Langfassung: der sichtbare Text der Startseite, in allen vier Sprachen. */
export function llmsFullTxt(): string {
  const zeilen: string[] = [
    `# ${SITE_NAME} — full text`,
    '',
    `> ${TEXTE[DEFAULT_LOCALE].seo.description}`,
    '',
    'This file contains the visible text of the home page of onefam.ch in all four',
    'languages, taken from the same source as the page itself. Short version: /llms.txt',
    '',
    `Company: ${FIRMA.rechtsform}. Owner: ${FIRMA.inhaber}. ${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}, Switzerland. ${FIRMA.email}`,
    '',
  ];

  for (const l of LOCALES) {
    const t = TEXTE[l];
    zeilen.push(`## ${SPRACHNAME[l]} — ${adresse(homePath(l))}`, '', `**${t.seo.title}**`, '');
    zeilen.push(...abschnitte(t));
    zeilen.push(
      `Links: [${t.final_cta.cta_primary}](${adresse(joinPath(l))}) · [Shop](${shopUrl(l)}) · ` +
        `[Impressum](${adresse(legalPath(l, 'impressum'))}) · ` +
        `[Datenschutz](${adresse(legalPath(l, 'datenschutz'))}) · [AGB](${adresse(legalPath(l, 'agb'))})`,
      '',
    );
  }

  return zeilen.join('\n');
}
