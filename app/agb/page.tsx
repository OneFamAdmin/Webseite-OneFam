import type { Metadata } from 'next';
import Link from 'next/link';
import LegalLayout, { Section, Bullets, ContactCard } from '@/components/LegalLayout';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'AGB & Nutzungsbedingungen — OneFam',
  description: 'Nutzungsbedingungen für die OneFam-Website, die Warteliste und das Mitgliederkonto.',
  path: '/agb',
});

// Stand Juli 2026: an den Trust-first-Launch angepasst. Es läuft KEINE Verlosung und
// KEIN Travel-Pool-Programm mehr — die Seite bietet nur noch eine Warteliste (reiner
// Newsletter) und ein Mitgliederkonto an. Alles, was eine Auswahl, einen Gewinn oder
// einen Einsatz beschrieb, ist entfernt; Ziffer 6 hält den Ist-Zustand ausdrücklich
// fest. Siehe docs/handover-shopify-pool.md §3.
export default function AgbPage() {
  return (
    <LegalLayout
      eyebrow="Rechtliches"
      title="AGB & Nutzungsbedingungen"
      updated="Juli 2026"
      lead={
        <p>
          Diese Bedingungen regeln die Nutzung dieser Website, die Eintragung in unsere Warteliste und das
          OneFam-Mitgliederkonto. Es findet derzeit <strong className="text-primary">kein Gewinnspiel, keine Verlosung
          und kein Travel-Pool-Programm</strong> statt. Bitte lies sie aufmerksam.
        </p>
      }
    >
      <Section n="1" title="Anbieter und Geltungsbereich">
        <p>Anbieter ist:</p>
        <ContactCard />
        <p>
          Diese Bedingungen gelten für die Nutzung dieser Website (Warteliste, Mitgliederkonto, Community-Inhalte). Für
          Bestellungen in unserem Online-Shop (shop.onefam.ch) gelten ausschliesslich die dort hinterlegten, separaten
          Geschäftsbedingungen.
        </p>
      </Section>

      <Section n="2" title="Was OneFam ist – und was aktuell nicht">
        <p>
          OneFam ist eine Kleidermarke mit eigenem Online-Shop und eine Community für Menschen, die zu mehr als einem Ort
          gehören. Im Zentrum stehen Zusammenhalt und gemeinsame Werte (siehe «The Family Code»).
        </p>
        <p>
          Wir verfolgen das langfristige Ziel, eines Tages gemeinsame Reisen zu ermöglichen. Das ist eine{' '}
          <strong className="text-primary">Absichtserklärung, kein Angebot</strong>: Es gibt derzeit kein
          Travel-Pool-Programm, keine Vergabe von Reiseplätzen und keinerlei Anspruch auf eine Reise oder eine sonstige
          Leistung. Aussagen zu diesem Ziel auf unserer Website sind unverbindlich und begründen keine Zusicherung.
        </p>
      </Section>

      <Section n="3" title="Warteliste (Newsletter)">
        <Bullets
          items={[
            'Die Eintragung ist kostenlos und setzt keinen Kauf voraus.',
            'Erhoben wird deine E-Mail-Adresse; die Angabe eines Namens ist freiwillig.',
            'Mit der Eintragung willigst du ein, von uns E-Mails über OneFam zu erhalten.',
            'Du kannst die Einwilligung jederzeit und ohne Angabe von Gründen widerrufen – über den Abmeldelink in jeder E-Mail oder formlos an info@onefam.ch.',
            'Die Eintragung begründet keine Mitgliedschaft, keine Teilnahme an einer Auswahl und keinen Anspruch auf eine Leistung.',
          ]}
        />
        <p>
          Wir versenden Werbe-E-Mails nur an Personen, die sich selbst eingetragen haben, und weisen in jeder Nachricht
          auf die Abmeldemöglichkeit hin (Art. 3 Abs. 1 lit. o UWG).
        </p>
      </Section>

      <Section n="4" title="Mitgliederkonto">
        <p>
          Für einzelne Bereiche kannst du dich mit deiner E-Mail-Adresse anmelden; die Anmeldung erfolgt über einen
          Login-Link ohne Passwort. Du bist dafür verantwortlich, den Zugriff auf dein E-Mail-Konto zu schützen. Wir
          können Konten sperren oder löschen, wenn diese Bedingungen verletzt werden. Ein Anspruch auf Bereitstellung
          oder Fortbestand des Kontos besteht nicht.
        </p>
      </Section>

      <Section n="5" title="Zusatzfunktionen für Käuferinnen und Käufer">
        <p>
          Personen, die in unserem Shop bestellt haben, können zusätzliche Funktionen nutzen – etwa die unverbindliche
          Abstimmung über ein mögliches künftiges Reiseziel und die Weltkarte. Diese Funktionen sind ein freiwilliges
          Dankeschön ohne Vermögenswert. Sie begründen keinen Anspruch auf eine Reise, auf die Umsetzung eines
          Abstimmungsergebnisses oder auf eine sonstige Leistung, und wir können sie jederzeit ändern oder einstellen.
        </p>
      </Section>

      <Section n="6" title="Kein Gewinnspiel, keine Verlosung, kein Geldspiel">
        <p>
          Über diese Website findet derzeit kein Gewinnspiel, keine Verlosung und kein Geldspiel im Sinne des Schweizer
          Geldspielgesetzes (BGS) statt. Es wird kein Einsatz geleistet, keine Auswahl durchgeführt und kein
          vermögenswerter Gewinn in Aussicht gestellt.
        </p>
        <p>
          Sollten wir künftig eine Vergabe von Reiseplätzen einführen, geschieht dies ausschliesslich auf Grundlage
          eigener, vorab veröffentlichter Teilnahmebedingungen und einer vorgängigen rechtlichen Prüfung.{' '}
          <span className="text-faint">
            [Vor jeder Einführung anwaltlich zu prüfen: Qualifikation nach BGS, Ausgestaltung der Teilnahme ohne
            Kaufzwang, Teilnahmeländer, Mindestalter, Ziehungsverfahren inkl. Zufallsquelle und Ausfall-Fallback.]
          </span>
        </p>
      </Section>

      <Section n="7" title="Käufe im Shop">
        <p>
          Bestellungen kommen ausschliesslich über shop.onefam.ch zustande; dafür gelten die dortigen Geschäftsbedingungen
          samt Regelungen zu Preisen, Versand, Widerruf und Gewährleistung. Ein Kauf verschafft keine Vorteile ausserhalb
          der in Ziffer 5 genannten Zusatzfunktionen.
        </p>
      </Section>

      <Section n="8" title="Pflichten der Nutzenden">
        <p>
          Du verpflichtest dich, die Werte der Community («The Family Code») zu respektieren, korrekte Angaben zu machen
          und unsere Dienste nicht zu manipulieren – insbesondere nicht durch Mehrfach- oder Fremdanmeldungen, das
          Eintragen fremder E-Mail-Adressen oder automatisierte Zugriffe. Bei Verstössen können wir Einträge und Konten
          entfernen.
        </p>
      </Section>

      <Section n="9" title="Verfügbarkeit und Änderungen der Website">
        <p>
          Wir stellen diese Website unentgeltlich bereit und schulden keine bestimmte Verfügbarkeit. Wir können Inhalte
          und Funktionen jederzeit ändern, einschränken oder einstellen.
        </p>
      </Section>

      <Section n="10" title="Rechte an Inhalten">
        <p>
          Sämtliche Inhalte dieser Website – insbesondere Texte, Bilder, Grafiken, Logo und Designs – sind geschützt und
          dürfen ohne unsere vorgängige schriftliche Zustimmung nicht ausserhalb der üblichen privaten Nutzung verwendet
          werden.
        </p>
      </Section>

      <Section n="11" title="Haftung">
        <p>
          Soweit gesetzlich zulässig, ist die Haftung von OneFam für Schäden im Zusammenhang mit der Nutzung dieser
          Website ausgeschlossen. Ausgenommen sind Schäden aus grober Fahrlässigkeit oder Absicht sowie Fälle zwingender
          gesetzlicher Haftung.{' '}
          <span className="text-faint">[Haftungsregelung anwaltlich zu prüfen.]</span>
        </p>
      </Section>

      <Section n="12" title="Datenschutz">
        <p>
          Informationen zur Bearbeitung deiner Daten – auch zu den Daten der Warteliste – findest du in unserer{' '}
          <Link href="/datenschutz" className="text-gold transition-colors duration-[180ms] hover:text-gold-hover">
            Datenschutzerklärung
          </Link>
          .
        </p>
      </Section>

      <Section n="13" title="Änderungen der Bedingungen">
        <p>
          Wir können diese Bedingungen jederzeit anpassen. Massgebend ist die zum Zeitpunkt der Nutzung veröffentlichte
          Fassung.
        </p>
      </Section>

      <Section n="14" title="Anwendbares Recht und Gerichtsstand">
        <p>
          Es gilt ausschliesslich Schweizer Recht. Ausschliesslicher Gerichtsstand ist – soweit gesetzlich zulässig –
          der Sitz des Anbieters in Basel.{' '}
          <span className="text-faint">
            [Gerichtsstand anwaltlich zu bestätigen; gegenüber Konsumentinnen und Konsumenten ist er nur beschränkt
            wirksam.]
          </span>
        </p>
      </Section>
    </LegalLayout>
  );
}
