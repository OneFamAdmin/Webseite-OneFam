// Builds the country-level face-flag views for the 5 non-Europe continents.
//  - copies each country's flag-face PNG → public/faces/{ISO}.png
//  - generates lib/geo/continents.generated.ts (ISO land lists + demo vote options)
// Entries with an explicit {lat,lng} are island/micro states absent from the 110m map
// (drawn only as an anchored face, like the European microstates). Run with node.

import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { feature } from 'topojson-client';

const FACE_DIR = 'Transparent PNG Logo';
const OUT_FACES = 'public/faces';
if (!existsSync(OUT_FACES)) mkdirSync(OUT_FACES, { recursive: true });

// which ISO numbers actually have land in the 110m world map
const topo = JSON.parse(readFileSync('node_modules/world-atlas/countries-110m.json', 'utf8'));
const fc = feature(topo, topo.objects.countries);
const inMap = new Set(fc.features.map((f) => Number(f.id)).filter((n) => Number.isFinite(n)));

// Master table. Each entry: { iso, de, face, lat?, lng? }
// Ordered marquee-first per continent so the demo leader (gold) is a sensible country.
const CONTINENTS = [
  {
    key: 'africa',
    title: 'Afrika',
    list: [
      { iso: '710', de: 'Südafrika', face: 'South-Africa' },
      { iso: '504', de: 'Marokko', face: 'Morocco' },
      { iso: '818', de: 'Ägypten', face: 'Egypt' },
      { iso: '834', de: 'Tansania', face: 'Tanzania' },
      { iso: '404', de: 'Kenia', face: 'Kenya' },
      { iso: '516', de: 'Namibia', face: 'Namibia' },
      { iso: '788', de: 'Tunesien', face: 'Tunisia' },
      { iso: '231', de: 'Äthiopien', face: 'Ethiopia' },
      { iso: '566', de: 'Nigeria', face: 'Nigeria' },
      { iso: '288', de: 'Ghana', face: 'Ghana' },
      { iso: '686', de: 'Senegal', face: 'Senegal' },
      { iso: '012', de: 'Algerien', face: 'Algeria' },
      { iso: '024', de: 'Angola', face: 'Angola' },
      { iso: '204', de: 'Benin', face: 'Benin' },
      { iso: '072', de: 'Botswana', face: 'Botswana' },
      { iso: '854', de: 'Burkina Faso', face: 'Burkina-Faso' },
      { iso: '108', de: 'Burundi', face: 'Burundi' },
      { iso: '120', de: 'Kamerun', face: 'Cameroon' },
      { iso: '132', de: 'Kap Verde', face: 'Cape-Verde', lat: 16.0, lng: -24.0 },
      { iso: '140', de: 'Zentralafr. Rep.', face: 'Central-African-Republic' },
      { iso: '148', de: 'Tschad', face: 'Chad' },
      { iso: '174', de: 'Komoren', face: 'Comoros', lat: -11.6, lng: 43.3 },
      { iso: '178', de: 'Kongo', face: 'Republic-of-the-Congo' },
      { iso: '180', de: 'DR Kongo', face: 'DR-Congo' },
      { iso: '262', de: 'Dschibuti', face: 'Djibouti' },
      { iso: '226', de: 'Äquatorialguinea', face: 'Equatorial-Guinea' },
      { iso: '232', de: 'Eritrea', face: 'Eritrea' },
      { iso: '748', de: 'Eswatini', face: 'Eswatini' },
      { iso: '266', de: 'Gabun', face: 'Gabon' },
      { iso: '270', de: 'Gambia', face: 'Gambia' },
      { iso: '324', de: 'Guinea', face: 'Guinea' },
      { iso: '624', de: 'Guinea-Bissau', face: 'Guinea-Bissau' },
      { iso: '384', de: 'Elfenbeinküste', face: 'Ivory-Coast' },
      { iso: '426', de: 'Lesotho', face: 'Lesotho' },
      { iso: '430', de: 'Liberia', face: 'Liberia' },
      { iso: '434', de: 'Libyen', face: 'Libya' },
      { iso: '450', de: 'Madagaskar', face: 'Madagascar' },
      { iso: '454', de: 'Malawi', face: 'Malawi' },
      { iso: '466', de: 'Mali', face: 'Mali' },
      { iso: '478', de: 'Mauretanien', face: 'Mauritania' },
      { iso: '480', de: 'Mauritius', face: 'Mauritius', lat: -20.3, lng: 57.6 },
      { iso: '508', de: 'Mosambik', face: 'Mozambique' },
      { iso: '562', de: 'Niger', face: 'Niger' },
      { iso: '646', de: 'Ruanda', face: 'Rwanda' },
      { iso: '678', de: 'São Tomé & P.', face: 'São-Tomé-and-Príncipe', lat: 0.3, lng: 6.6 },
      { iso: '690', de: 'Seychellen', face: 'Seychelles', lat: -4.6, lng: 55.5 },
      { iso: '694', de: 'Sierra Leone', face: 'Sierra-Leone' },
      { iso: '706', de: 'Somalia', face: 'Somalia' },
      { iso: '728', de: 'Südsudan', face: 'South-Sudan' },
      { iso: '729', de: 'Sudan', face: 'Sudan' },
      { iso: '768', de: 'Togo', face: 'Togo' },
      { iso: '800', de: 'Uganda', face: 'Uganda' },
      { iso: '894', de: 'Sambia', face: 'Zambia' },
      { iso: '716', de: 'Simbabwe', face: 'Zimbabwe' },
    ],
  },
  {
    key: 'asia',
    title: 'Asien',
    list: [
      { iso: '764', de: 'Thailand', face: 'Thailand' },
      { iso: '392', de: 'Japan', face: 'Japan' },
      { iso: '360', de: 'Indonesien', face: 'Indonesia' },
      { iso: '704', de: 'Vietnam', face: 'Vietnam' },
      { iso: '356', de: 'Indien', face: 'India' },
      { iso: '524', de: 'Nepal', face: 'Nepal' },
      { iso: '144', de: 'Sri Lanka', face: 'Sri-Lanka' },
      { iso: '462', de: 'Malediven', face: 'Maldives', lat: 3.2, lng: 73.2 },
      { iso: '458', de: 'Malaysia', face: 'Malaysia' },
      { iso: '608', de: 'Philippinen', face: 'Philippines' },
      { iso: '702', de: 'Singapur', face: 'Singapore', lat: 1.35, lng: 103.8 },
      { iso: '410', de: 'Südkorea', face: 'South-Korea' },
      { iso: '156', de: 'China', face: 'China' },
      { iso: '004', de: 'Afghanistan', face: 'Afghanistan' },
      { iso: '051', de: 'Armenien', face: 'Armenia' },
      { iso: '031', de: 'Aserbaidschan', face: 'Azerbaijan' },
      { iso: '048', de: 'Bahrain', face: 'Bahrain', lat: 26.0, lng: 50.5 },
      { iso: '050', de: 'Bangladesch', face: 'Bangladesh' },
      { iso: '064', de: 'Bhutan', face: 'Bhutan' },
      { iso: '096', de: 'Brunei', face: 'Brunei' },
      { iso: '116', de: 'Kambodscha', face: 'Cambodia' },
      { iso: '268', de: 'Georgien', face: 'Georgia' },
      { iso: '364', de: 'Iran', face: 'Iran' },
      { iso: '368', de: 'Irak', face: 'Iraq' },
      { iso: '376', de: 'Israel', face: 'Israel' },
      { iso: '400', de: 'Jordanien', face: 'Jordan' },
      { iso: '398', de: 'Kasachstan', face: 'Kazakhstan' },
      { iso: '414', de: 'Kuwait', face: 'Kuwait' },
      { iso: '417', de: 'Kirgisistan', face: 'Kyrgyzstan' },
      { iso: '418', de: 'Laos', face: 'Laos' },
      { iso: '422', de: 'Libanon', face: 'Lebanon' },
      { iso: '496', de: 'Mongolei', face: 'Mongolia' },
      { iso: '104', de: 'Myanmar', face: 'Myanmar' },
      { iso: '408', de: 'Nordkorea', face: 'North-Korea' },
      { iso: '512', de: 'Oman', face: 'Oman' },
      { iso: '586', de: 'Pakistan', face: 'Pakistan' },
      { iso: '275', de: 'Palästina', face: 'Palestine' },
      { iso: '634', de: 'Katar', face: 'Qatar' },
      { iso: '682', de: 'Saudi-Arabien', face: 'Saudi-Arabia' },
      { iso: '760', de: 'Syrien', face: 'Syria' },
      { iso: '158', de: 'Taiwan', face: 'Taiwan' },
      { iso: '762', de: 'Tadschikistan', face: 'Tajikistan' },
      { iso: '626', de: 'Timor-Leste', face: 'Timor-Leste' },
      { iso: '792', de: 'Türkei', face: 'Turkey' },
      { iso: '795', de: 'Turkmenistan', face: 'Turkmenistan' },
      { iso: '784', de: 'Ver. Arab. Emirate', face: 'United-Arab-Emirates' },
      { iso: '860', de: 'Usbekistan', face: 'Uzbekistan' },
      { iso: '887', de: 'Jemen', face: 'Yemen' },
    ],
  },
  {
    key: 'north-america',
    title: 'Nordamerika',
    list: [
      { iso: '484', de: 'Mexiko', face: 'Mexico' },
      { iso: '840', de: 'USA', face: 'USA' },
      { iso: '124', de: 'Kanada', face: 'Canada' },
      { iso: '192', de: 'Kuba', face: 'Cuba' },
      { iso: '188', de: 'Costa Rica', face: 'Costa Rica' },
      { iso: '320', de: 'Guatemala', face: 'Guatemala' },
      { iso: '591', de: 'Panama', face: 'Panama' },
      { iso: '214', de: 'Dominik. Rep.', face: 'Dominican-Republic' },
      { iso: '388', de: 'Jamaika', face: 'Jamaica' },
      { iso: '044', de: 'Bahamas', face: 'Bahamas' },
      { iso: '084', de: 'Belize', face: 'Belize' },
      { iso: '222', de: 'El Salvador', face: 'El-Salvador' },
      { iso: '340', de: 'Honduras', face: 'Honduras' },
      { iso: '558', de: 'Nicaragua', face: 'Nicaragua' },
      { iso: '332', de: 'Haiti', face: 'Haiti' },
      { iso: '780', de: 'Trinidad & Tobago', face: 'Trinidad-and-Tobago' },
      { iso: '028', de: 'Antigua & B.', face: 'Antigua-and-Barbuda', lat: 17.1, lng: -61.8 },
      { iso: '052', de: 'Barbados', face: 'Barbados', lat: 13.2, lng: -59.5 },
      { iso: '212', de: 'Dominica', face: 'Dominica', lat: 15.4, lng: -61.4 },
      { iso: '308', de: 'Grenada', face: 'Grenada', lat: 12.1, lng: -61.7 },
      { iso: '659', de: 'St. Kitts & N.', face: 'Saint-Kitts-and-Nevis', lat: 17.3, lng: -62.7 },
      { iso: '662', de: 'St. Lucia', face: 'Saint-Lucia', lat: 13.9, lng: -61.0 },
      { iso: '670', de: 'St. Vincent', face: 'Saint-Vincent-and-the-Grenadines', lat: 13.0, lng: -61.2 },
    ],
  },
  {
    key: 'south-america',
    title: 'Südamerika',
    list: [
      { iso: '076', de: 'Brasilien', face: 'Brazil' },
      { iso: '032', de: 'Argentinien', face: 'Argentina' },
      { iso: '604', de: 'Peru', face: 'Peru' },
      { iso: '170', de: 'Kolumbien', face: 'Colombia' },
      { iso: '152', de: 'Chile', face: 'Chile' },
      { iso: '218', de: 'Ecuador', face: 'Ecuador' },
      { iso: '862', de: 'Venezuela', face: 'Venezuela' },
      { iso: '068', de: 'Bolivien', face: 'Bolivien' },
      { iso: '600', de: 'Paraguay', face: 'Paraguay' },
      { iso: '858', de: 'Uruguay', face: 'Uruguay' },
      { iso: '328', de: 'Guyana', face: 'Guyana' },
      { iso: '740', de: 'Suriname', face: 'Surinam' },
    ],
  },
  {
    key: 'oceania',
    title: 'Ozeanien',
    list: [
      { iso: '036', de: 'Australien', face: 'Australia' },
      { iso: '554', de: 'Neuseeland', face: 'New-Zealand' },
      { iso: '242', de: 'Fidschi', face: 'Fiji' },
      { iso: '598', de: 'Papua-Neuguinea', face: 'Papua-New-Guinea' },
      { iso: '090', de: 'Salomonen', face: 'Solomon-Islands' },
      { iso: '548', de: 'Vanuatu', face: 'Vanuatu' },
      { iso: '882', de: 'Samoa', face: 'Samoa', lat: -13.8, lng: -172.1 },
      { iso: '776', de: 'Tonga', face: 'Tonga', lat: -21.2, lng: -175.2 },
      { iso: '296', de: 'Kiribati', face: 'Kiribati', lat: 1.4, lng: 173.0 },
      { iso: '583', de: 'Mikronesien', face: 'Micronesia', lat: 6.9, lng: 158.2 },
      { iso: '584', de: 'Marshallinseln', face: 'Marshall-Islands', lat: 7.1, lng: 171.2 },
      { iso: '585', de: 'Palau', face: 'Palau', lat: 7.5, lng: 134.6 },
      { iso: '520', de: 'Nauru', face: 'Nauru', lat: -0.5, lng: 166.9 },
      { iso: '798', de: 'Tuvalu', face: 'Tuvalu', lat: -7.5, lng: 178.7 },
    ],
  },
];

// deterministic small jitter so demo votes aren't a perfect staircase
const jit = (i) => Math.floor((Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 * 90);

const warnings = [];
const views = CONTINENTS.map((cont) => {
  const N = cont.list.length;
  const isos = [];
  const options = cont.list.map((c, i) => {
    // copy face
    const src = `${FACE_DIR}/${c.face}.png`;
    if (existsSync(src)) {
      const dest = `${OUT_FACES}/${c.iso}.png`;
      copyFileSync(src, dest);
      // originals are 4000×4000 (~64 MB decoded each!) — downscale to 256 px so the
      // /design page stays light (faces render at ≤ ~90 px). macOS `sips`.
      try {
        execSync(`sips -Z 256 "${dest}"`, { stdio: 'ignore' });
      } catch {
        warnings.push(`RESIZE FAILED (sips): ${c.iso}`);
      }
    } else warnings.push(`MISSING FACE: ${cont.key} ${c.iso} ${c.de} (${c.face}.png)`);
    // land vs anchor
    const hasLand = inMap.has(Number(c.iso));
    if (hasLand) isos.push(c.iso);
    else if (c.lat == null || c.lng == null) warnings.push(`NO ANCHOR + NO LAND: ${cont.key} ${c.iso} ${c.de}`);
    const votes = 480 + (N - 1 - i) * 170 + jit(i);
    const o = { label: c.de, code: c.iso, votes };
    if (!hasLand) {
      o.lat = c.lat;
      o.lng = c.lng;
    }
    return o;
  });
  return { key: cont.key, title: cont.title, isos, options };
});

// emit TS
const ts = `// AUTO-GENERATED by _build_continents.mjs — do not edit by hand.
// Country-level face-flag views for the 5 non-Europe continents (demo vote data).
import type { DesignOption } from '@/components/VotingDesignMap';

export type ContinentView = { key: string; title: string; isos: string[]; options: DesignOption[] };

export const CONTINENT_VIEWS: ContinentView[] = ${JSON.stringify(views, null, 2)};
`;
writeFileSync('lib/geo/continents.generated.ts', ts);

console.log('Generated lib/geo/continents.generated.ts');
for (const v of views) console.log(`  ${v.title}: ${v.options.length} countries, ${v.isos.length} with land, ${v.options.length - v.isos.length} anchored`);
console.log(warnings.length ? '\nWARNINGS:\n' + warnings.join('\n') : '\nNo warnings — all faces copied, all anchors present.');
