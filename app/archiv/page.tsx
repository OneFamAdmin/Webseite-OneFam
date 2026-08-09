import { notFound } from 'next/navigation';

/**
 * /archiv - deaktiviert am 09.08.2026.
 *
 * Grund: Die Seite zeigte ein 'Archiv der Ziehungen' (Pool CHF 8000, Gewinner),
 * waehrend FAQ und AGB gleichzeitig festhalten, dass es keine Verlosung und kein
 * Geldspiel im Sinne des BGS gibt. Zwei oeffentlich einsehbare, einander
 * widersprechende Aussagen sind rechtlich die schlechtestmoegliche Ausgangslage.
 *
 * Zusaetzlich waren die beiden Eintraege in sich widerspruechlich: gleicher
 * Commitment-Hash und gleiches Datum, aber unterschiedliche drand-Runden und
 * unterschiedliche Gewinner - das widerlegt das Versprechen 'exakt reproduzierbar'.
 *
 * Die Seite liefert bewusst 404 statt einer Weiterleitung: Der Inhalt existiert
 * nicht mehr, das ist die ehrliche Aussage gegenueber Nutzern und Suchmaschinen.
 *
 * Wiederherstellung: Der vollstaendige fruehere Stand liegt in der Git-Historie
 * (Datei app/archiv/page.tsx vor diesem Commit). Vor einer Reaktivierung muss das
 * Verlosungskonzept rechtlich geprueft und mit FAQ + AGB in Einklang gebracht
 * werden. Die Supabase-Tabelle 'draws' ist unveraendert und wurde nicht geloescht.
 */
export default function ArchivPage() {
  notFound();
}
