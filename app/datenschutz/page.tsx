import type { Metadata } from 'next';
import LegalLayout, { Section, Bullets, ContactCard } from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung — OneFam',
  description: 'Wie OneFam mit deinen Daten umgeht – Datenschutzerklärung nach dem Schweizer Datenschutzgesetz (DSG).',
};

export default function DatenschutzPage() {
  return (
    <LegalLayout
      title="Datenschutzerklärung"
      updated="Juli 2026"
      lead={
        <p>
          Der Schutz deiner Daten ist uns wichtig. Diese Erklärung informiert dich darüber, welche Personendaten wir
          beim Besuch dieser Website bearbeiten und welche Rechte dir zustehen. Sie richtet sich nach dem revidierten
          Schweizer Datenschutzgesetz (DSG).
        </p>
      }
    >
      <Section n="1" title="Verantwortlicher">
        <p>Verantwortlich für die Bearbeitung von Personendaten auf dieser Website ist:</p>
        <ContactCard />
      </Section>

      <Section n="2" title="Geltungsbereich">
        <p>
          Diese Erklärung gilt für diese Website (onefam.ch). Unser Online-Shop unter shop.onefam.ch wird über eine
          separate Plattform betrieben und verfügt über eine eigene Datenschutzerklärung. Für Bestellungen,
          Kundenkonten und Zahlungen im Shop gelten ausschliesslich die dortigen Bestimmungen.
        </p>
      </Section>

      <Section n="3" title="Grundsätze">
        <p>
          Personendaten sind alle Angaben, die sich auf eine bestimmte oder bestimmbare Person beziehen. Wir bearbeiten
          Daten nach den Grundsätzen von Treu und Glauben, Verhältnismässigkeit und Zweckbindung – und nur, soweit dies
          für den Betrieb dieser Website erforderlich ist.
        </p>
      </Section>

      <Section n="4" title="Server-Logfiles und Hosting">
        <p>
          Beim Aufruf dieser Website werden durch unseren Hosting-Provider automatisch Daten erhoben und vorübergehend
          in sogenannten Server-Logfiles gespeichert. Dazu gehören:
        </p>
        <Bullets
          items={[
            'die IP-Adresse des zugreifenden Geräts',
            'Datum und Uhrzeit des Zugriffs',
            'die aufgerufene Seite bzw. Datei',
            'die zuvor besuchte Seite (Referrer-URL)',
            'Browsertyp und -version sowie das Betriebssystem',
          ]}
        />
        <p>
          Diese Daten dienen ausschliesslich dem technischen Betrieb, der Sicherheit und der Stabilität der Website und
          werden nicht mit anderen Datenquellen zusammengeführt.
        </p>
        <p>
          Hosting-Provider ist <span className="text-secondary">Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789,
          USA</span> <span className="text-faint">[bei abweichendem Hosting anpassen]</span>. Die Bearbeitung erfolgt
          teilweise auf Servern ausserhalb der Schweiz (siehe Ziffer 10).
        </p>
      </Section>

      <Section n="5" title="Cookies und Tracking">
        <p>
          Diese Website setzt <span className="text-primary">keine Analyse-, Tracking- oder Werbe-Tools</span> ein
          (z. B. Google Analytics, Meta-Pixel o. Ä.). Es werden keine Nutzungsprofile erstellt und keine Daten zu
          Werbezwecken an Dritte weitergegeben.
        </p>
        <p>
          Verwendet werden ausschliesslich <span className="text-primary">technisch notwendige Cookies</span>: Wenn du
          dich anmeldest, speichert dein Browser ein Sitzungs-Cookie, damit du eingeloggt bleibst. Ohne dieses Cookie
          funktioniert die Anmeldung nicht. Meldest du dich nicht an, werden keine Cookies gesetzt. Sollten wir künftig
          weitere Cookies einsetzen, wird diese Erklärung angepasst und – soweit erforderlich – deine Einwilligung
          eingeholt.
        </p>
      </Section>

      <Section n="6" title="Warteliste (Newsletter)">
        <p>
          Trägst du dich in unsere Warteliste ein, bearbeiten wir deine E-Mail-Adresse, einen freiwillig angegebenen
          Namen sowie den Zeitpunkt der Eintragung. Zweck ist ausschliesslich, dich über OneFam zu informieren.
          Grundlage ist deine Einwilligung.
        </p>
        <p>
          Du kannst dich jederzeit abmelden – über den Abmeldelink in jeder E-Mail oder formlos an info@onefam.ch.
          Danach löschen wir deinen Eintrag. Wir geben diese Daten nicht an Dritte weiter und nutzen sie nicht für
          Werbung anderer Unternehmen.
        </p>
      </Section>

      <Section n="7" title="Mitgliederkonto und Datenbank">
        <p>
          Für die Anmeldung bearbeiten wir deine E-Mail-Adresse sowie technische Angaben zur Sitzung. Die Anmeldung
          erfolgt über einen Login-Link per E-Mail; ein Passwort speichern wir nicht. Hast du in unserem Shop bestellt,
          speichern wir zudem die Information, dass eine Bestellung vorliegt, um dir Zusatzfunktionen freizuschalten.
        </p>
        <p>
          Warteliste und Kontodaten werden bei{' '}
          <span className="text-secondary">Supabase (Region Zürich, Schweiz)</span> gespeichert. Der Versand von
          E-Mails erfolgt über einen Dienstleister, der die Adressen ausschliesslich in unserem Auftrag bearbeitet.{' '}
          <span className="text-faint">[Auftragsbearbeitungsverträge sind abzuschliessen bzw. zu dokumentieren.]</span>
        </p>
      </Section>

      <Section n="8" title="Kontaktaufnahme">
        <p>
          Wenn du uns per E-Mail, Telefon oder über einen Messenger-Dienst kontaktierst, werden die von dir gemachten
          Angaben (z. B. Name, Kontaktdaten und Inhalt der Nachricht) zur Bearbeitung deiner Anfrage gespeichert und
          verwendet. Wir geben diese Daten nicht ohne deine Einwilligung weiter und löschen sie, sobald sie nicht mehr
          benötigt werden und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </p>
      </Section>

      <Section n="9" title="Messenger und Social Media">
        <p>
          Auf dieser Website verlinken wir auf externe Plattformen und Messenger-Dienste (u. a. Instagram, Facebook,
          WhatsApp, Telegram, Threema). Diese Links sind reine Verweise – beim blossen Aufruf unserer Website werden
          keine Daten an diese Anbieter übermittelt. Erst wenn du einen Link anklickst, gelangst du auf die jeweilige
          Plattform, für die deren eigene Datenschutzbestimmungen gelten und auf deren Datenbearbeitung wir keinen
          Einfluss haben. Kontaktierst du uns über einen Messenger, werden deine Daten zusätzlich über die Server des
          jeweiligen Anbieters verarbeitet.
        </p>
      </Section>

      <Section n="10" title="Datenübermittlung ins Ausland">
        <p>
          Im Rahmen des Hostings sowie bei der Nutzung von Messenger- und Social-Media-Diensten können Daten ins Ausland
          – auch in die USA – übermittelt werden. Eine Übermittlung erfolgt nur, wenn ein angemessenes Datenschutzniveau
          gewährleistet ist oder geeignete Garantien (z. B. Standardvertragsklauseln) bestehen, wie es das DSG verlangt.
        </p>
      </Section>

      <Section n="11" title="Aufbewahrung">
        <p>
          Wir bewahren Personendaten nur so lange auf, wie es für die jeweiligen Zwecke erforderlich ist oder gesetzliche
          Aufbewahrungsfristen es verlangen. Danach werden die Daten gelöscht oder anonymisiert.
        </p>
      </Section>

      <Section n="12" title="Datensicherheit">
        <p>
          Diese Website wird verschlüsselt über HTTPS (TLS) ausgeliefert. Wir treffen angemessene technische und
          organisatorische Massnahmen, um deine Daten vor unbefugtem Zugriff, Verlust oder Missbrauch zu schützen.
        </p>
      </Section>

      <Section n="13" title="Deine Rechte">
        <p>Im Rahmen des anwendbaren Datenschutzrechts stehen dir insbesondere folgende Rechte zu:</p>
        <Bullets
          items={[
            'Auskunft über die zu deiner Person bearbeiteten Daten',
            'Berichtigung unrichtiger Daten',
            'Löschung oder Vernichtung deiner Daten',
            'Einschränkung der Bearbeitung sowie Widerspruch gegen eine Bearbeitung',
            'Herausgabe oder Übertragung deiner Daten',
          ]}
        />
        <p>
          Zur Ausübung genügt eine Mitteilung an die oben genannten Kontaktdaten. Zur Bearbeitung deiner Anfrage müssen
          wir gegebenenfalls deine Identität überprüfen.
        </p>
      </Section>

      <Section n="14" title="Beschwerderecht">
        <p>
          Du hast das Recht, dich bei der zuständigen Aufsichtsbehörde zu beschweren. In der Schweiz ist dies der
          Eidgenössische Datenschutz- und Öffentlichkeitsbeauftragte (EDÖB), Feldeggweg 1, 3003 Bern
          (www.edoeb.admin.ch).
        </p>
      </Section>

      <Section n="15" title="Änderungen dieser Erklärung">
        <p>
          Wir können diese Datenschutzerklärung jederzeit anpassen, etwa wenn sich die Datenbearbeitung oder die
          Rechtslage ändert. Es gilt die jeweils auf dieser Website veröffentlichte Fassung.
        </p>
      </Section>
    </LegalLayout>
  );
}
