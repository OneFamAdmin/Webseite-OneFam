// lib/shop/schwebebilder.ts
//
// Freistehende Produkt- und Modellbilder auf onefam.ch.
//
// Die Bilder des Shops haben einen hellen Studio-Hintergrund und standen auf der schwarzen
// Seite als heller Kasten — der stärkste Bruch zur Startseite (Befund 6 der Durchsicht vom
// 21.11.2026). Labi am 22.11.2026 zur Vorschau: kein Kasten, die Stücke und die Models sollen
// "in der Webseite schweben" — "passt perfekt, so können wir es weiterführen".
//
// Für die Bilder in der Liste unten liegt deshalb eine freigestellte Fassung in
// public/shop/schwebend/: dasselbe Bild mit durchsichtigem Hintergrund (WebP), Figur, Stoff
// und Druck sind die Originalpixel. Models laufen unten weich aus, weil sie angeschnitten sind.
// Erzeugt werden sie ausserhalb des Repos (onefam-material/mockups/
// albanien-dunkler-grund-probe-21112026/, LIESMICH.md dort) — das Repo trägt nur das Ergebnis.
//
// Die Seite bekommt weiter die Bildadressen des Shops (WooCommerce bleibt die Quelle für
// Galerie, Reihenfolge und Farbzuordnung). schwebeBild() tauscht eine Adresse genau dann, wenn
// ihr Dateiname in der Liste steht — unabhängig von der Grösse, die der Shop anhängt
// ("…_4k-825x1024.webp", "…_4k-1-300x300.webp"). Alles andere bleibt, wie es ist.
//
// STAND 22.11.2026: Albanien in Schwarz — alle sieben Ansichten von Hoodie, Sweater und Shirt,
// dazu Hoodie Red (Mann von vorn). Die übrigen Farben und Länder zeigen noch das Shop-Bild.
// Weiss und Heather Grey lassen sich mit dem heutigen Verfahren nicht freistellen.
//
// EIN BILD DAZU: Datei <Name>.webp (1200 x 1490) und <Name>_k.webp (240 x 298) nach
// public/shop/schwebend/ legen und den Namen hier eintragen. <Name> = Dateiname im Shop ohne
// Grössenanhang und ohne ".webp".

const ORDNER = '/shop/schwebend';

const FREISTEHEND = new Set<string>([
  'OneFam_Albanien_Hoodie_Red_Mann_frontal_4k',
  'OneFam_Albanien_Hoodie_schwarz_Frau_Huefte_4k',
  'OneFam_Albanien_Hoodie_schwarz_Frau_Taschen_4k',
  'OneFam_Albanien_Hoodie_schwarz_Frau_frontal_4k',
  'OneFam_Albanien_Hoodie_schwarz_Freihaengend_4k-1',
  'OneFam_Albanien_Hoodie_schwarz_Mann_Huefte_4k',
  'OneFam_Albanien_Hoodie_schwarz_Mann_Taschen_4k',
  'OneFam_Albanien_Hoodie_schwarz_Mann_frontal_4k',
  'OneFam_Albanien_Shirt_schwarz_Frau_Huefte_4k',
  'OneFam_Albanien_Shirt_schwarz_Frau_Taschen_4k',
  'OneFam_Albanien_Shirt_schwarz_Frau_frontal_4k',
  'OneFam_Albanien_Shirt_schwarz_Freihaengend_4k-1',
  'OneFam_Albanien_Shirt_schwarz_Mann_Huefte_4k',
  'OneFam_Albanien_Shirt_schwarz_Mann_Taschen_4k',
  'OneFam_Albanien_Shirt_schwarz_Mann_frontal_4k',
  'OneFam_Albanien_Sweater_schwarz_Frau_Huefte_4k',
  'OneFam_Albanien_Sweater_schwarz_Frau_Taschen_4k',
  'OneFam_Albanien_Sweater_schwarz_Frau_frontal_4k',
  'OneFam_Albanien_Sweater_schwarz_Freihaengend_4k-1',
  'OneFam_Albanien_Sweater_schwarz_Mann_Huefte_4k',
  'OneFam_Albanien_Sweater_schwarz_Mann_Taschen_4k',
  'OneFam_Albanien_Sweater_schwarz_Mann_frontal_4k',
]);

/** "…/OneFam_Albanien_Hoodie_schwarz_Mann_frontal_4k-825x1024.webp" → "OneFam_…_frontal_4k" */
function stamm(adresse: string): string | null {
  const datei = adresse.split('?')[0].split('/').pop() ?? '';
  const treffer = datei.match(/^(.+?_4k(?:-\d)?)(?:-\d+x\d+)?\.webp$/);
  return treffer ? treffer[1] : null;
}

/**
 * Die freistehende Fassung eines Shop-Bildes, wenn es eine gibt — sonst die Adresse unverändert.
 * `klein` für Vorschauleiste, Farbwahl und Warenkorb.
 */
export function schwebeBild(adresse: string, klein = false): string {
  const name = stamm(adresse);
  return name && FREISTEHEND.has(name) ? `${ORDNER}/${name}${klein ? '_k' : ''}.webp` : adresse;
}
