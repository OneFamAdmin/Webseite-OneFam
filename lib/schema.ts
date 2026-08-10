import { SITE_NAME, SITE_URL } from '@/lib/seo';
import { DEFAULT_LOCALE, homePath, type Locale } from '@/i18n/routing';

// Strukturierte Daten nach schema.org, ausgegeben als JSON-LD auf der Startseite.
//
// Bis zum 10.08.2026 hatte die Seite davon nichts. Suchmaschinen mussten aus dem
// Fliesstext erraten, wer OneFam ist, wo die Firma sitzt und was die FAQ-Abschnitte
// bedeuten. Drei Typen decken das ab:
//
//   Organization  Wer wir sind. Verbindet Name, Anschrift, Kontakt und die
//                 Social-Profile zu einer Einheit.
//   WebSite       Die Seite selbst, mit Sprache und Verweis auf die Organisation.
//   FAQPage       Die sechs Fragen aus dem FAQ-Abschnitt. Google zeigt dafür seit
//                 2023 nur noch bei behördlichen und medizinischen Seiten eigene
//                 Suchergebnisse an — die Auszeichnung hilft trotzdem beim
//                 Verstehen der Seite und kostet nichts.
//
// ACHTUNG bei den Firmendaten unten: Sie stehen bewusst hier und nicht in den
// Übersetzungsdateien. Anschrift und Telefonnummer sind Tatsachen und dürfen
// sich nicht je nach Sprache unterscheiden — im Impressum steht der Ort übersetzt
// (Basel, Bäle, Basilea), und genau das darf hier nicht passieren. Wer das
// Impressum ändert, ändert diese Werte mit.
const FIRMA = {
  rechtsform: 'OneFam — Einzelfirma, Schweiz',
  inhaber: 'Labinot Bajrami',
  strasse: 'Riehenstrasse 236',
  plz: '4058',
  ort: 'Basel',
  land: 'CH',
  email: 'info@onefam.ch',
  telefon: '+41762258058',
};

const SOCIAL = [
  'https://www.instagram.com/onefam_official/',
  'https://www.facebook.com/profile.php?id=61568690728641',
];

export type FaqEintrag = { question: string; answer: string };

/** Feste Kennung, damit WebSite auf dieselbe Organisation zeigen kann. */
const ORGANISATION_ID = `${SITE_URL}/#organisation`;

export function organisationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANISATION_ID,
    name: SITE_NAME,
    legalName: FIRMA.rechtsform,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo-white.png`,
    email: FIRMA.email,
    telephone: FIRMA.telefon,
    founder: { '@type': 'Person', name: FIRMA.inhaber },
    address: {
      '@type': 'PostalAddress',
      streetAddress: FIRMA.strasse,
      postalCode: FIRMA.plz,
      addressLocality: FIRMA.ort,
      addressCountry: FIRMA.land,
    },
    sameAs: SOCIAL,
  };
}

export function webseiteSchema(locale: Locale, beschreibung: string) {
  const url = locale === DEFAULT_LOCALE ? SITE_URL : `${SITE_URL}${homePath(locale)}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url,
    description: beschreibung,
    inLanguage: locale,
    publisher: { '@id': ORGANISATION_ID },
  };
}

export function faqSchema(eintraege: FaqEintrag[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: eintraege.map((eintrag) => ({
      '@type': 'Question',
      name: eintrag.question,
      acceptedAnswer: { '@type': 'Answer', text: eintrag.answer },
    })),
  };
}
