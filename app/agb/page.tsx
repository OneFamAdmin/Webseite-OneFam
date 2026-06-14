import type { Metadata } from 'next';
import Link from 'next/link';
import LegalLayout, { Section, Bullets, ContactCard } from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: 'AGB & Teilnahmebedingungen — OneFam',
  description:
    'Allgemeine Geschäfts- und Teilnahmebedingungen für die OneFam-Community und das Travel-Pool-Programm.',
};

export default function AgbPage() {
  return (
    <LegalLayout
      eyebrow="Rechtliches"
      title="AGB & Teilnahmebedingungen"
      updated="Juni 2026"
      lead={
        <p>
          Diese Bedingungen regeln die Teilnahme an der OneFam-Community und am jährlichen Travel-Pool-Programm. Sie
          sind bewusst so gestaltet, dass das Modell kein Geldspiel darstellt. Bitte lies sie aufmerksam.
        </p>
      }
    >
      <Section n="1" title="Anbieter und Geltungsbereich">
        <p>Anbieter ist:</p>
        <ContactCard />
        <p>
          Diese Bedingungen gelten für die Teilnahme an der OneFam-Community und am Travel-Pool-Programm über diese
          Website. Für Käufe in unserem Online-Shop (onefam.shop) gelten ausschliesslich die dort hinterlegten,
          separaten Geschäftsbedingungen.
        </p>
      </Section>

      <Section n="2" title="Was OneFam ist">
        <p>
          OneFam ist eine globale Community für Menschen mit guter Energie. Im Zentrum stehen Zusammenhalt, gemeinsame
          Werte (siehe «The Family Code») und echte Erlebnisse. Die Reiseplätze werden über eine kostenlose, faire
          Verlosung vergeben (siehe Ziffer 5).
        </p>
      </Section>

      <Section n="3" title="Teilnahme – kostenlos und für alle offen">
        <Bullets
          items={[
            'Die Teilnahme am Travel-Pool-Programm ist kostenlos.',
            'Sie steht allen offen – unabhängig davon, ob jemand etwas kauft oder nicht.',
            'Es ist kein Kauf und kein vermögenswerter Einsatz erforderlich.',
            'Teilnahmeberechtigt sind natürliche Personen ab 21 Jahren.',
            'Pro Person ist eine Teilnahme pro Jahr möglich.',
            <span key="laender" className="text-faint">
              [Zugelassene bzw. ausgeschlossene Teilnahmeländer sind noch festzulegen.]
            </span>,
          ]}
        />
      </Section>

      <Section n="4" title="Keine Bevorzugung von Käuferinnen und Käufern">
        <p>
          Käufe in unserem Shop sind reine Unterstützung der Community und verbessern die Auswahlchancen in keiner
          Weise. Alle Teilnehmenden – ob mit oder ohne Kauf – sind bei der Auswahl vollständig gleichgestellt.
          Käuferinnen und Käufer erhalten lediglich zusätzliche Community-Funktionen (z. B. World Map, Voting,
          Live-Pool, Archiv, Early Access), die keinen Einfluss auf die Auswahl haben.
        </p>
      </Section>

      <Section n="5" title="Kein Glücksspiel / kein Geldspiel">
        <p>
          Das OneFam-Modell ist nach unserer Auffassung kein Geldspiel im Sinne des Schweizer Geldspielgesetzes (BGS),
          da die Teilnahme kostenlos und ohne vermögenswerten Einsatz möglich ist. Damit fehlt ein wesentliches Element
          eines Geldspiels. <span className="text-faint">[Diese rechtliche Einordnung ist anwaltlich zu bestätigen.]</span>
        </p>
      </Section>

      <Section n="6" title="Finanzierung des Travel Pools">
        <p>
          Der Travel Pool wird vollständig aus dem Unternehmensgewinn von OneFam finanziert – als freiwilliger Bonus an
          die Community. Teilnehmende zahlen zu keinem Zeitpunkt Geld in den Pool ein. Am Jahresende fliesst der Betrag
          vollständig in gemeinsame Community-Erlebnisse.
        </p>
      </Section>

      <Section n="7" title="Auswahl und Transparenz">
        <p>
          Die Reiseplätze werden über eine öffentlich nachprüfbare Zufallsziehung vergeben. Das Verfahren ist im Voraus
          festgelegt, klar dokumentiert und wird öffentlich archiviert.{' '}
          <span className="text-faint">
            [Das konkrete Ziehungsverfahren – inkl. Zufallsquelle und Ausfall-Fallback – ist hier zu beschreiben.]
          </span>
        </p>
      </Section>

      <Section n="8" title="Pflichten der Teilnehmenden">
        <p>
          Mit der Teilnahme verpflichtest du dich, die Werte der Community («The Family Code») zu respektieren, korrekte
          Angaben zu machen und die Teilnahme nicht zu manipulieren (z. B. durch Mehrfachanmeldungen). Bei Verstössen
          können wir Teilnehmende von der Teilnahme ausschliessen.
        </p>
      </Section>

      <Section n="9" title="Kein Rechtsanspruch">
        <p>
          Es besteht kein Rechtsanspruch auf Auswahl, auf Teilnahme an einem bestimmten Erlebnis oder auf eine
          Barauszahlung des Pools oder einzelner Beträge.{' '}
          <span className="text-faint">[Details zu Leistungen, Ersatz und Nichtantritt sind festzulegen.]</span>
        </p>
      </Section>

      <Section n="10" title="Haftung">
        <p>
          Soweit gesetzlich zulässig, ist die Haftung von OneFam für Schäden im Zusammenhang mit der Nutzung dieser
          Website und der Teilnahme am Programm ausgeschlossen. Ausgenommen sind Schäden aus grober Fahrlässigkeit oder
          Absicht sowie Fälle zwingender gesetzlicher Haftung.{' '}
          <span className="text-faint">[Haftungsregelung anwaltlich zu prüfen.]</span>
        </p>
      </Section>

      <Section n="11" title="Datenschutz">
        <p>
          Informationen zur Bearbeitung deiner Daten findest du in unserer{' '}
          <Link href="/datenschutz" className="text-gold transition-colors duration-[180ms] hover:text-gold-hover">
            Datenschutzerklärung
          </Link>
          .
        </p>
      </Section>

      <Section n="12" title="Änderungen der Bedingungen">
        <p>
          Wir können diese Bedingungen jederzeit anpassen. Massgebend ist die zum Zeitpunkt der Teilnahme veröffentlichte
          Fassung.
        </p>
      </Section>

      <Section n="13" title="Anwendbares Recht und Gerichtsstand">
        <p>
          Es gilt ausschliesslich Schweizer Recht. Ausschliesslicher Gerichtsstand ist – soweit gesetzlich zulässig –
          der Sitz des Anbieters in Basel.{' '}
          <span className="text-faint">[Gerichtsstand anwaltlich zu bestätigen.]</span>
        </p>
      </Section>
    </LegalLayout>
  );
}
