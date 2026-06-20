// Shared geo reference data for the staged destination vote + world map.
//
// - CONTINENTS: the 6 options of the first ("continent") stage. lat/lng are label
//   anchors for the map (rough visual centroids, not precise geographic ones).
// - COUNTRIES: a CURATED, travel-relevant shortlist per continent (not all ~200) so
//   the admin picks from a clean dropdown. `iso` is the numeric ISO-3166-1 code as a
//   string, matching the world-atlas TopoJSON feature ids. The map compares by
//   Number(iso) so zero-padding ("076" vs "76") never matters.
//
// Place-stage options (cities) are entered by the admin with their own lat/lng, so
// they don't live here.

export type Continent = { key: string; label: string; lat: number; lng: number };
// lat/lng are an OPTIONAL map anchor — only the island/micro nations that the 110m
// world atlas lacks need them; mainland countries are located from their geometry.
export type Country = { iso: string; label: string; continent: string; lat?: number; lng?: number };

export const CONTINENTS: Continent[] = [
  { key: 'europe', label: 'Europa', lat: 52, lng: 15 },
  { key: 'africa', label: 'Afrika', lat: 2, lng: 20 },
  { key: 'asia', label: 'Asien', lat: 40, lng: 90 },
  { key: 'north-america', label: 'Nordamerika', lat: 45, lng: -100 },
  { key: 'south-america', label: 'Südamerika', lat: -15, lng: -58 },
  { key: 'oceania', label: 'Ozeanien', lat: -22, lng: 140 },
];

// Curated travel-relevant shortlist per continent (~12–15 each) — aspirational, safe,
// desirable family destinations, NOT every official country. All have a face PNG in
// public/faces/{iso}.png. Island/micro nations carry a lat/lng anchor (no 110m geometry).
export const COUNTRIES: Country[] = [
  // ── Europe ──
  { iso: '380', label: 'Italien', continent: 'europe' },
  { iso: '724', label: 'Spanien', continent: 'europe' },
  { iso: '300', label: 'Griechenland', continent: 'europe' },
  { iso: '250', label: 'Frankreich', continent: 'europe' },
  { iso: '620', label: 'Portugal', continent: 'europe' },
  { iso: '191', label: 'Kroatien', continent: 'europe' },
  { iso: '352', label: 'Island', continent: 'europe' },
  { iso: '578', label: 'Norwegen', continent: 'europe' },
  { iso: '756', label: 'Schweiz', continent: 'europe' },
  { iso: '040', label: 'Österreich', continent: 'europe' },
  { iso: '528', label: 'Niederlande', continent: 'europe' },
  { iso: '372', label: 'Irland', continent: 'europe' },
  { iso: '470', label: 'Malta', continent: 'europe', lat: 35.9, lng: 14.4 },
  { iso: '196', label: 'Zypern', continent: 'europe', lat: 35.1, lng: 33.4 },

  // ── Africa ──
  { iso: '504', label: 'Marokko', continent: 'africa' },
  { iso: '818', label: 'Ägypten', continent: 'africa' },
  { iso: '404', label: 'Kenia', continent: 'africa' },
  { iso: '834', label: 'Tansania', continent: 'africa' },
  { iso: '710', label: 'Südafrika', continent: 'africa' },
  { iso: '516', label: 'Namibia', continent: 'africa' },
  { iso: '072', label: 'Botswana', continent: 'africa' },
  { iso: '450', label: 'Madagaskar', continent: 'africa' },
  { iso: '788', label: 'Tunesien', continent: 'africa' },
  { iso: '646', label: 'Ruanda', continent: 'africa' },
  { iso: '480', label: 'Mauritius', continent: 'africa', lat: -20.3, lng: 57.55 },
  { iso: '690', label: 'Seychellen', continent: 'africa', lat: -4.6, lng: 55.5 },
  { iso: '132', label: 'Kap Verde', continent: 'africa', lat: 16.0, lng: -24.0 },

  // ── Asia ──
  { iso: '764', label: 'Thailand', continent: 'asia' },
  { iso: '392', label: 'Japan', continent: 'asia' },
  { iso: '360', label: 'Indonesien', continent: 'asia' },
  { iso: '704', label: 'Vietnam', continent: 'asia' },
  { iso: '356', label: 'Indien', continent: 'asia' },
  { iso: '524', label: 'Nepal', continent: 'asia' },
  { iso: '144', label: 'Sri Lanka', continent: 'asia' },
  { iso: '458', label: 'Malaysia', continent: 'asia' },
  { iso: '608', label: 'Philippinen', continent: 'asia' },
  { iso: '410', label: 'Südkorea', continent: 'asia' },
  { iso: '400', label: 'Jordanien', continent: 'asia' },
  { iso: '512', label: 'Oman', continent: 'asia' },
  { iso: '462', label: 'Malediven', continent: 'asia', lat: 3.2, lng: 73.2 },
  { iso: '702', label: 'Singapur', continent: 'asia', lat: 1.35, lng: 103.8 },
  { iso: '784', label: 'Ver. Arab. Emirate', continent: 'asia', lat: 24.0, lng: 54.0 },

  // ── North America ──
  { iso: '484', label: 'Mexiko', continent: 'north-america' },
  { iso: '840', label: 'USA', continent: 'north-america' },
  { iso: '124', label: 'Kanada', continent: 'north-america' },
  { iso: '192', label: 'Kuba', continent: 'north-america' },
  { iso: '188', label: 'Costa Rica', continent: 'north-america' },
  { iso: '320', label: 'Guatemala', continent: 'north-america' },
  { iso: '591', label: 'Panama', continent: 'north-america' },
  { iso: '084', label: 'Belize', continent: 'north-america' },
  { iso: '214', label: 'Dominik. Rep.', continent: 'north-america', lat: 18.7, lng: -70.2 },
  { iso: '388', label: 'Jamaika', continent: 'north-america', lat: 18.1, lng: -77.3 },
  { iso: '044', label: 'Bahamas', continent: 'north-america', lat: 24.5, lng: -76.5 },
  { iso: '052', label: 'Barbados', continent: 'north-america', lat: 13.2, lng: -59.5 },
  { iso: '662', label: 'St. Lucia', continent: 'north-america', lat: 13.9, lng: -61.0 },

  // ── South America ──
  { iso: '076', label: 'Brasilien', continent: 'south-america' },
  { iso: '032', label: 'Argentinien', continent: 'south-america' },
  { iso: '604', label: 'Peru', continent: 'south-america' },
  { iso: '170', label: 'Kolumbien', continent: 'south-america' },
  { iso: '152', label: 'Chile', continent: 'south-america' },
  { iso: '218', label: 'Ecuador', continent: 'south-america' },
  { iso: '068', label: 'Bolivien', continent: 'south-america' },
  { iso: '858', label: 'Uruguay', continent: 'south-america' },
  { iso: '600', label: 'Paraguay', continent: 'south-america' },
  { iso: '862', label: 'Venezuela', continent: 'south-america' },

  // ── Oceania ──
  { iso: '036', label: 'Australien', continent: 'oceania' },
  { iso: '554', label: 'Neuseeland', continent: 'oceania' },
  { iso: '242', label: 'Fidschi', continent: 'oceania', lat: -17.8, lng: 178.0 },
  { iso: '598', label: 'Papua-Neuguinea', continent: 'oceania' },
  { iso: '090', label: 'Salomonen', continent: 'oceania', lat: -9.6, lng: 160.2 },
  { iso: '548', label: 'Vanuatu', continent: 'oceania', lat: -17.7, lng: 168.3 },
  { iso: '882', label: 'Samoa', continent: 'oceania', lat: -13.8, lng: -172.1 },
  { iso: '776', label: 'Tonga', continent: 'oceania', lat: -21.2, lng: -175.2 },
  { iso: '585', label: 'Palau', continent: 'oceania', lat: 7.5, lng: 134.6 },
];

export const continentByKey = (key: string) => CONTINENTS.find((c) => c.key === key);
export const countriesByContinent = (continentKey: string) =>
  COUNTRIES.filter((c) => c.continent === continentKey);
export const countryByIso = (iso: string) =>
  COUNTRIES.find((c) => Number(c.iso) === Number(iso));

// ── Places (cities) per country, for the "Ort" stage of the drill-down vote ──
// Keyed by the same numeric ISO string as COUNTRIES. Coords are approximate city
// centers — precise enough for a glowing pin on the map.
export type Place = { code: string; label: string; lat: number; lng: number };

// Curated travel hotspots per country — the spots people actually dream of: old-money/
// luxury (Marbella, St-Tropez, Comer See), young & party (Ibiza, Mykonos, Tulum, Bali),
// and the iconic must-sees (Santorini, Machu Picchu, Maldives, Bora Bora). 5–8 per popular
// country. lat/lng are approximate centres — precise enough for a glowing map pin.
export const PLACES: Record<string, Place[]> = {
  // ── Europe ──
  '380': [ // Italien
    { code: 'amalfi', label: 'Amalfiküste', lat: 40.63, lng: 14.6 }, { code: 'capri', label: 'Capri', lat: 40.55, lng: 14.24 },
    { code: 'comersee', label: 'Comer See', lat: 45.99, lng: 9.26 }, { code: 'rom', label: 'Rom', lat: 41.9, lng: 12.5 },
    { code: 'venedig', label: 'Venedig', lat: 45.44, lng: 12.33 }, { code: 'florenz', label: 'Florenz', lat: 43.77, lng: 11.26 },
    { code: 'sardinien', label: 'Sardinien', lat: 41.13, lng: 9.51 }, { code: 'taormina', label: 'Taormina', lat: 37.85, lng: 15.29 },
  ],
  '724': [ // Spanien
    { code: 'ibiza', label: 'Ibiza', lat: 38.91, lng: 1.43 }, { code: 'mallorca', label: 'Mallorca', lat: 39.57, lng: 2.65 },
    { code: 'marbella', label: 'Marbella', lat: 36.51, lng: -4.88 }, { code: 'barcelona', label: 'Barcelona', lat: 41.39, lng: 2.17 },
    { code: 'madrid', label: 'Madrid', lat: 40.42, lng: -3.7 }, { code: 'sansebastian', label: 'San Sebastián', lat: 43.32, lng: -1.98 },
    { code: 'sevilla', label: 'Sevilla', lat: 37.39, lng: -5.99 }, { code: 'costabrava', label: 'Costa Brava', lat: 41.97, lng: 3.21 },
  ],
  '300': [ // Griechenland
    { code: 'mykonos', label: 'Mykonos', lat: 37.45, lng: 25.37 }, { code: 'santorin', label: 'Santorin', lat: 36.39, lng: 25.46 },
    { code: 'kreta', label: 'Kreta', lat: 35.34, lng: 25.13 }, { code: 'korfu', label: 'Korfu', lat: 39.62, lng: 19.92 },
    { code: 'rhodos', label: 'Rhodos', lat: 36.43, lng: 28.22 }, { code: 'athen', label: 'Athen', lat: 37.98, lng: 23.73 },
    { code: 'paros', label: 'Paros', lat: 37.08, lng: 25.15 },
  ],
  '250': [ // Frankreich
    { code: 'sttropez', label: 'St-Tropez', lat: 43.27, lng: 6.64 }, { code: 'nizza', label: 'Nizza / Côte d’Azur', lat: 43.7, lng: 7.27 },
    { code: 'cannes', label: 'Cannes', lat: 43.55, lng: 7.02 }, { code: 'paris', label: 'Paris', lat: 48.86, lng: 2.35 },
    { code: 'korsika', label: 'Korsika', lat: 41.92, lng: 8.74 }, { code: 'chamonix', label: 'Chamonix', lat: 45.92, lng: 6.87 },
  ],
  '620': [ // Portugal
    { code: 'lissabon', label: 'Lissabon', lat: 38.72, lng: -9.14 }, { code: 'algarve', label: 'Algarve', lat: 37.09, lng: -8.25 },
    { code: 'comporta', label: 'Comporta', lat: 38.38, lng: -8.78 }, { code: 'madeira', label: 'Madeira', lat: 32.65, lng: -16.91 },
    { code: 'porto', label: 'Porto', lat: 41.15, lng: -8.61 }, { code: 'sintra', label: 'Sintra', lat: 38.8, lng: -9.39 },
  ],
  '191': [ // Kroatien
    { code: 'dubrovnik', label: 'Dubrovnik', lat: 42.65, lng: 18.09 }, { code: 'hvar', label: 'Hvar', lat: 43.17, lng: 16.44 },
    { code: 'split', label: 'Split', lat: 43.51, lng: 16.44 }, { code: 'rovinj', label: 'Rovinj', lat: 45.08, lng: 13.64 },
  ],
  '352': [ // Island
    { code: 'reykjavik', label: 'Reykjavík', lat: 64.15, lng: -21.94 }, { code: 'blaue-lagune', label: 'Blaue Lagune', lat: 63.88, lng: -22.45 },
    { code: 'vik', label: 'Vík', lat: 63.42, lng: -19.0 }, { code: 'akureyri', label: 'Akureyri', lat: 65.69, lng: -18.11 },
  ],
  '578': [ // Norwegen
    { code: 'lofoten', label: 'Lofoten', lat: 68.2, lng: 13.6 }, { code: 'geiranger', label: 'Geirangerfjord', lat: 62.1, lng: 7.0 },
    { code: 'bergen', label: 'Bergen', lat: 60.39, lng: 5.32 }, { code: 'tromso', label: 'Tromsø', lat: 69.65, lng: 18.96 },
    { code: 'oslo', label: 'Oslo', lat: 59.91, lng: 10.75 },
  ],
  '756': [ // Schweiz
    { code: 'zermatt', label: 'Zermatt', lat: 46.02, lng: 7.75 }, { code: 'stmoritz', label: 'St. Moritz', lat: 46.49, lng: 9.84 },
    { code: 'interlaken', label: 'Interlaken', lat: 46.69, lng: 7.85 }, { code: 'luzern', label: 'Luzern', lat: 47.05, lng: 8.31 },
    { code: 'genf', label: 'Genf', lat: 46.2, lng: 6.14 },
  ],
  '040': [ // Österreich
    { code: 'kitzbuehel', label: 'Kitzbühel', lat: 47.45, lng: 12.39 }, { code: 'wien', label: 'Wien', lat: 48.21, lng: 16.37 },
    { code: 'salzburg', label: 'Salzburg', lat: 47.81, lng: 13.04 }, { code: 'hallstatt', label: 'Hallstatt', lat: 47.56, lng: 13.65 },
  ],
  '528': [ // Niederlande
    { code: 'amsterdam', label: 'Amsterdam', lat: 52.37, lng: 4.9 }, { code: 'rotterdam', label: 'Rotterdam', lat: 51.92, lng: 4.48 },
  ],
  '372': [ // Irland
    { code: 'dublin', label: 'Dublin', lat: 53.35, lng: -6.26 }, { code: 'kerry', label: 'Ring of Kerry', lat: 51.88, lng: -9.57 },
    { code: 'galway', label: 'Galway', lat: 53.27, lng: -9.05 },
  ],
  '470': [ // Malta
    { code: 'valletta', label: 'Valletta', lat: 35.9, lng: 14.51 }, { code: 'gozo', label: 'Gozo', lat: 36.04, lng: 14.24 },
    { code: 'comino', label: 'Comino', lat: 36.01, lng: 14.33 },
  ],
  '196': [ // Zypern
    { code: 'ayianapa', label: 'Ayia Napa', lat: 34.99, lng: 34.0 }, { code: 'paphos', label: 'Paphos', lat: 34.77, lng: 32.42 },
    { code: 'limassol', label: 'Limassol', lat: 34.71, lng: 33.02 },
  ],

  // ── Africa ──
  '504': [ // Marokko
    { code: 'marrakesch', label: 'Marrakesch', lat: 31.63, lng: -7.99 }, { code: 'chefchaouen', label: 'Chefchaouen', lat: 35.17, lng: -5.27 },
    { code: 'essaouira', label: 'Essaouira', lat: 31.51, lng: -9.77 }, { code: 'fes', label: 'Fès', lat: 34.04, lng: -5.0 },
    { code: 'sahara', label: 'Sahara / Merzouga', lat: 31.1, lng: -4.0 },
  ],
  '818': [ // Ägypten
    { code: 'gizeh', label: 'Kairo / Gizeh', lat: 29.98, lng: 31.13 }, { code: 'luxor', label: 'Luxor', lat: 25.69, lng: 32.64 },
    { code: 'sharm', label: 'Sharm el-Sheikh', lat: 27.91, lng: 34.33 }, { code: 'hurghada', label: 'Hurghada', lat: 27.26, lng: 33.81 },
  ],
  '404': [ // Kenia
    { code: 'masaimara', label: 'Masai Mara', lat: -1.5, lng: 35.14 }, { code: 'diani', label: 'Diani Beach', lat: -4.3, lng: 39.59 },
    { code: 'amboseli', label: 'Amboseli', lat: -2.65, lng: 37.26 }, { code: 'nairobi', label: 'Nairobi', lat: -1.29, lng: 36.82 },
  ],
  '834': [ // Tansania
    { code: 'sansibar', label: 'Sansibar', lat: -6.16, lng: 39.2 }, { code: 'serengeti', label: 'Serengeti', lat: -2.33, lng: 34.83 },
    { code: 'kilimandscharo', label: 'Kilimandscharo', lat: -3.07, lng: 37.35 }, { code: 'ngorongoro', label: 'Ngorongoro', lat: -3.2, lng: 35.5 },
  ],
  '710': [ // Südafrika
    { code: 'kapstadt', label: 'Kapstadt', lat: -33.92, lng: 18.42 }, { code: 'krueger', label: 'Krüger-Nationalpark', lat: -24.0, lng: 31.5 },
    { code: 'gardenroute', label: 'Garden Route', lat: -34.05, lng: 23.37 }, { code: 'johannesburg', label: 'Johannesburg', lat: -26.2, lng: 28.05 },
  ],
  '516': [ // Namibia
    { code: 'sossusvlei', label: 'Sossusvlei', lat: -24.73, lng: 15.4 }, { code: 'etosha', label: 'Etosha', lat: -18.85, lng: 16.33 },
    { code: 'swakopmund', label: 'Swakopmund', lat: -22.68, lng: 14.53 },
  ],
  '072': [ // Botswana
    { code: 'okavango', label: 'Okavango-Delta', lat: -19.28, lng: 22.9 }, { code: 'chobe', label: 'Chobe', lat: -17.8, lng: 25.07 },
  ],
  '450': [ // Madagaskar
    { code: 'nosybe', label: 'Nosy Be', lat: -13.32, lng: 48.26 }, { code: 'baobabs', label: 'Baobab-Allee', lat: -20.25, lng: 44.42 },
    { code: 'antananarivo', label: 'Antananarivo', lat: -18.91, lng: 47.54 },
  ],
  '788': [ // Tunesien
    { code: 'djerba', label: 'Djerba', lat: 33.8, lng: 10.86 }, { code: 'sidibou', label: 'Sidi Bou Saïd', lat: 36.87, lng: 10.35 },
    { code: 'hammamet', label: 'Hammamet', lat: 36.4, lng: 10.61 },
  ],
  '646': [ // Ruanda
    { code: 'volcanoes', label: 'Volcanoes NP (Gorillas)', lat: -1.47, lng: 29.49 }, { code: 'kigali', label: 'Kigali', lat: -1.94, lng: 30.06 },
  ],
  '480': [ // Mauritius
    { code: 'lemorne', label: 'Le Morne', lat: -20.45, lng: 57.31 }, { code: 'grandbaie', label: 'Grand Baie', lat: -20.01, lng: 57.58 },
    { code: 'portlouis', label: 'Port Louis', lat: -20.16, lng: 57.5 },
  ],
  '690': [ // Seychellen
    { code: 'ladigue', label: 'La Digue', lat: -4.36, lng: 55.84 }, { code: 'praslin', label: 'Praslin', lat: -4.32, lng: 55.74 },
    { code: 'mahe', label: 'Mahé', lat: -4.68, lng: 55.48 },
  ],
  '132': [ // Kap Verde
    { code: 'sal', label: 'Sal', lat: 16.6, lng: -22.92 }, { code: 'boavista', label: 'Boa Vista', lat: 16.1, lng: -22.81 },
    { code: 'mindelo', label: 'Mindelo', lat: 16.89, lng: -25.0 },
  ],

  // ── Asia ──
  '764': [ // Thailand
    { code: 'phuket', label: 'Phuket', lat: 7.88, lng: 98.39 }, { code: 'phiphi', label: 'Ko Phi Phi', lat: 7.74, lng: 98.78 },
    { code: 'kosamui', label: 'Ko Samui', lat: 9.51, lng: 100.01 }, { code: 'phangan', label: 'Ko Pha-ngan', lat: 9.73, lng: 100.03 },
    { code: 'bangkok', label: 'Bangkok', lat: 13.76, lng: 100.5 }, { code: 'chiangmai', label: 'Chiang Mai', lat: 18.79, lng: 98.99 },
    { code: 'krabi', label: 'Krabi', lat: 8.09, lng: 98.91 },
  ],
  '392': [ // Japan
    { code: 'tokio', label: 'Tokio', lat: 35.68, lng: 139.69 }, { code: 'kyoto', label: 'Kyoto', lat: 35.01, lng: 135.77 },
    { code: 'osaka', label: 'Osaka', lat: 34.69, lng: 135.5 }, { code: 'niseko', label: 'Niseko (Hokkaido)', lat: 42.8, lng: 140.69 },
    { code: 'okinawa', label: 'Okinawa', lat: 26.34, lng: 127.8 },
  ],
  '360': [ // Indonesien
    { code: 'bali', label: 'Bali (Seminyak)', lat: -8.69, lng: 115.17 }, { code: 'ubud', label: 'Ubud', lat: -8.51, lng: 115.26 },
    { code: 'gili', label: 'Gili Islands', lat: -8.35, lng: 116.04 }, { code: 'komodo', label: 'Komodo', lat: -8.55, lng: 119.49 },
    { code: 'jakarta', label: 'Jakarta', lat: -6.21, lng: 106.85 },
  ],
  '704': [ // Vietnam
    { code: 'halong', label: 'Halong-Bucht', lat: 20.91, lng: 107.18 }, { code: 'hoian', label: 'Hoi An', lat: 15.88, lng: 108.33 },
    { code: 'hanoi', label: 'Hanoi', lat: 21.03, lng: 105.85 }, { code: 'hcmc', label: 'Ho-Chi-Minh-Stadt', lat: 10.82, lng: 106.63 },
    { code: 'phuquoc', label: 'Phú Quốc', lat: 10.23, lng: 103.96 },
  ],
  '356': [ // Indien
    { code: 'goa', label: 'Goa', lat: 15.3, lng: 74.08 }, { code: 'jaipur', label: 'Jaipur', lat: 26.91, lng: 75.79 },
    { code: 'udaipur', label: 'Udaipur', lat: 24.58, lng: 73.68 }, { code: 'kerala', label: 'Kerala', lat: 9.5, lng: 76.34 },
    { code: 'tajmahal', label: 'Agra / Taj Mahal', lat: 27.17, lng: 78.04 }, { code: 'delhi', label: 'Delhi', lat: 28.61, lng: 77.21 },
  ],
  '524': [ // Nepal
    { code: 'kathmandu', label: 'Kathmandu', lat: 27.71, lng: 85.32 }, { code: 'pokhara', label: 'Pokhara', lat: 28.21, lng: 83.99 },
    { code: 'everest', label: 'Everest Base Camp', lat: 28.0, lng: 86.85 },
  ],
  '144': [ // Sri Lanka
    { code: 'galle', label: 'Galle', lat: 6.03, lng: 80.22 }, { code: 'ella', label: 'Ella', lat: 6.87, lng: 81.05 },
    { code: 'sigiriya', label: 'Sigiriya', lat: 7.95, lng: 80.76 }, { code: 'kandy', label: 'Kandy', lat: 7.29, lng: 80.64 },
    { code: 'colombo', label: 'Colombo', lat: 6.93, lng: 79.86 },
  ],
  '458': [ // Malaysia
    { code: 'langkawi', label: 'Langkawi', lat: 6.35, lng: 99.8 }, { code: 'kualalumpur', label: 'Kuala Lumpur', lat: 3.14, lng: 101.69 },
    { code: 'penang', label: 'Penang', lat: 5.41, lng: 100.33 }, { code: 'borneo', label: 'Borneo / Kota Kinabalu', lat: 5.98, lng: 116.07 },
  ],
  '608': [ // Philippinen
    { code: 'elnido', label: 'El Nido (Palawan)', lat: 11.18, lng: 119.39 }, { code: 'boracay', label: 'Boracay', lat: 11.96, lng: 121.92 },
    { code: 'siargao', label: 'Siargao', lat: 9.85, lng: 126.05 }, { code: 'cebu', label: 'Cebu', lat: 10.32, lng: 123.89 },
  ],
  '410': [ // Südkorea
    { code: 'seoul', label: 'Seoul', lat: 37.57, lng: 126.98 }, { code: 'jeju', label: 'Jeju', lat: 33.49, lng: 126.5 },
    { code: 'busan', label: 'Busan', lat: 35.18, lng: 129.08 },
  ],
  '400': [ // Jordanien
    { code: 'petra', label: 'Petra', lat: 30.33, lng: 35.44 }, { code: 'wadirum', label: 'Wadi Rum', lat: 29.58, lng: 35.42 },
    { code: 'totesmeer', label: 'Totes Meer', lat: 31.5, lng: 35.5 }, { code: 'amman', label: 'Amman', lat: 31.95, lng: 35.93 },
  ],
  '512': [ // Oman
    { code: 'muscat', label: 'Muscat', lat: 23.59, lng: 58.41 }, { code: 'wahiba', label: 'Wahiba Sands', lat: 22.0, lng: 58.5 },
    { code: 'salalah', label: 'Salalah', lat: 17.02, lng: 54.09 },
  ],
  '462': [ // Malediven
    { code: 'male', label: 'Malé', lat: 4.18, lng: 73.51 }, { code: 'baa', label: 'Baa-Atoll', lat: 5.2, lng: 73.05 },
    { code: 'ari', label: 'Ari-Atoll', lat: 3.9, lng: 72.85 },
  ],
  '702': [ // Singapur
    { code: 'marinabay', label: 'Marina Bay', lat: 1.28, lng: 103.86 }, { code: 'sentosa', label: 'Sentosa', lat: 1.25, lng: 103.83 },
  ],
  '784': [ // VAE
    { code: 'dubai', label: 'Dubai', lat: 25.2, lng: 55.27 }, { code: 'abudhabi', label: 'Abu Dhabi', lat: 24.45, lng: 54.38 },
    { code: 'rasalkhaimah', label: 'Ras Al Khaimah', lat: 25.79, lng: 55.94 },
  ],

  // ── North America ──
  '484': [ // Mexiko
    { code: 'tulum', label: 'Tulum', lat: 20.21, lng: -87.46 }, { code: 'cancun', label: 'Cancún', lat: 21.16, lng: -86.85 },
    { code: 'cabo', label: 'Cabo San Lucas', lat: 22.89, lng: -109.91 }, { code: 'playadelcarmen', label: 'Playa del Carmen', lat: 20.63, lng: -87.07 },
    { code: 'mexikostadt', label: 'Mexiko-Stadt', lat: 19.43, lng: -99.13 }, { code: 'oaxaca', label: 'Oaxaca', lat: 17.07, lng: -96.72 },
  ],
  '840': [ // USA
    { code: 'newyork', label: 'New York', lat: 40.71, lng: -74.01 }, { code: 'miami', label: 'Miami', lat: 25.76, lng: -80.19 },
    { code: 'losangeles', label: 'Los Angeles', lat: 34.05, lng: -118.24 }, { code: 'hamptons', label: 'Hamptons', lat: 40.96, lng: -72.18 },
    { code: 'aspen', label: 'Aspen', lat: 39.19, lng: -106.82 }, { code: 'hawaii', label: 'Hawaii (Maui)', lat: 20.8, lng: -156.33 },
    { code: 'lasvegas', label: 'Las Vegas', lat: 36.17, lng: -115.14 },
  ],
  '124': [ // Kanada
    { code: 'banff', label: 'Banff', lat: 51.18, lng: -115.57 }, { code: 'vancouver', label: 'Vancouver', lat: 49.28, lng: -123.12 },
    { code: 'whistler', label: 'Whistler', lat: 50.12, lng: -122.95 }, { code: 'toronto', label: 'Toronto', lat: 43.65, lng: -79.38 },
    { code: 'montreal', label: 'Montréal', lat: 45.5, lng: -73.57 },
  ],
  '192': [ // Kuba
    { code: 'havanna', label: 'Havanna', lat: 23.11, lng: -82.37 }, { code: 'varadero', label: 'Varadero', lat: 23.13, lng: -81.29 },
    { code: 'trinidad', label: 'Trinidad', lat: 21.8, lng: -79.98 },
  ],
  '188': [ // Costa Rica
    { code: 'manuelantonio', label: 'Manuel Antonio', lat: 9.39, lng: -84.14 }, { code: 'tamarindo', label: 'Tamarindo', lat: 10.3, lng: -85.84 },
    { code: 'lafortuna', label: 'La Fortuna / Arenal', lat: 10.47, lng: -84.65 }, { code: 'monteverde', label: 'Monteverde', lat: 10.3, lng: -84.81 },
  ],
  '320': [ // Guatemala
    { code: 'antigua', label: 'Antigua', lat: 14.56, lng: -90.73 }, { code: 'atitlan', label: 'Lake Atitlán', lat: 14.69, lng: -91.2 },
    { code: 'tikal', label: 'Tikal', lat: 17.22, lng: -89.62 },
  ],
  '591': [ // Panama
    { code: 'panamacity', label: 'Panama City', lat: 8.98, lng: -79.52 }, { code: 'bocas', label: 'Bocas del Toro', lat: 9.34, lng: -82.24 },
    { code: 'sanblas', label: 'San Blas', lat: 9.57, lng: -78.95 },
  ],
  '084': [ // Belize
    { code: 'ambergris', label: 'Ambergris Caye', lat: 17.92, lng: -87.96 }, { code: 'bluehole', label: 'Blue Hole', lat: 17.32, lng: -87.53 },
    { code: 'cayecaulker', label: 'Caye Caulker', lat: 17.74, lng: -88.02 },
  ],
  '214': [ // Dominik. Rep.
    { code: 'puntacana', label: 'Punta Cana', lat: 18.58, lng: -68.4 }, { code: 'samana', label: 'Samaná', lat: 19.2, lng: -69.33 },
    { code: 'santodomingo', label: 'Santo Domingo', lat: 18.49, lng: -69.93 },
  ],
  '388': [ // Jamaika
    { code: 'montegobay', label: 'Montego Bay', lat: 18.47, lng: -77.92 }, { code: 'negril', label: 'Negril', lat: 18.27, lng: -78.35 },
    { code: 'ochorios', label: 'Ocho Rios', lat: 18.4, lng: -77.1 },
  ],
  '044': [ // Bahamas
    { code: 'nassau', label: 'Nassau', lat: 25.06, lng: -77.34 }, { code: 'exuma', label: 'Exuma', lat: 23.62, lng: -75.95 },
    { code: 'harbourisland', label: 'Harbour Island', lat: 25.5, lng: -76.63 },
  ],
  '052': [ // Barbados
    { code: 'bridgetown', label: 'Bridgetown', lat: 13.1, lng: -59.62 }, { code: 'stlawrence', label: 'St. Lawrence Gap', lat: 13.07, lng: -59.58 },
  ],
  '662': [ // St. Lucia
    { code: 'pitons', label: 'Soufrière / Pitons', lat: 13.85, lng: -61.05 }, { code: 'rodneybay', label: 'Rodney Bay', lat: 14.07, lng: -60.95 },
  ],

  // ── South America ──
  '076': [ // Brasilien
    { code: 'rio', label: 'Rio de Janeiro', lat: -22.91, lng: -43.17 }, { code: 'noronha', label: 'Fernando de Noronha', lat: -3.85, lng: -32.42 },
    { code: 'florianopolis', label: 'Florianópolis', lat: -27.6, lng: -48.55 }, { code: 'buzios', label: 'Búzios', lat: -22.75, lng: -41.88 },
    { code: 'saopaulo', label: 'São Paulo', lat: -23.55, lng: -46.63 }, { code: 'salvador', label: 'Salvador', lat: -12.97, lng: -38.5 },
  ],
  '032': [ // Argentinien
    { code: 'buenosaires', label: 'Buenos Aires', lat: -34.6, lng: -58.38 }, { code: 'patagonien', label: 'Patagonien / El Calafate', lat: -50.34, lng: -72.27 },
    { code: 'mendoza', label: 'Mendoza', lat: -32.89, lng: -68.85 }, { code: 'bariloche', label: 'Bariloche', lat: -41.13, lng: -71.31 },
    { code: 'iguazu', label: 'Iguazú', lat: -25.69, lng: -54.44 },
  ],
  '604': [ // Peru
    { code: 'machupicchu', label: 'Machu Picchu', lat: -13.16, lng: -72.54 }, { code: 'cusco', label: 'Cusco', lat: -13.53, lng: -71.97 },
    { code: 'heiligestal', label: 'Heiliges Tal', lat: -13.32, lng: -72.08 }, { code: 'lima', label: 'Lima', lat: -12.05, lng: -77.04 },
  ],
  '170': [ // Kolumbien
    { code: 'cartagena', label: 'Cartagena', lat: 10.39, lng: -75.51 }, { code: 'tayrona', label: 'Tayrona', lat: 11.3, lng: -74.07 },
    { code: 'medellin', label: 'Medellín', lat: 6.24, lng: -75.57 }, { code: 'bogota', label: 'Bogotá', lat: 4.71, lng: -74.07 },
  ],
  '152': [ // Chile
    { code: 'atacama', label: 'Atacama', lat: -22.91, lng: -68.2 }, { code: 'torresdelpaine', label: 'Torres del Paine', lat: -51.0, lng: -73.0 },
    { code: 'osterinsel', label: 'Osterinsel', lat: -27.11, lng: -109.35 }, { code: 'santiago', label: 'Santiago', lat: -33.45, lng: -70.67 },
  ],
  '218': [ // Ecuador
    { code: 'galapagos', label: 'Galápagos', lat: -0.74, lng: -90.34 }, { code: 'quito', label: 'Quito', lat: -0.18, lng: -78.47 },
    { code: 'banos', label: 'Baños', lat: -1.4, lng: -78.42 },
  ],
  '068': [ // Bolivien
    { code: 'uyuni', label: 'Uyuni-Salzsee', lat: -20.13, lng: -67.49 }, { code: 'titicaca', label: 'Titicacasee', lat: -16.0, lng: -69.0 },
    { code: 'lapaz', label: 'La Paz', lat: -16.5, lng: -68.15 },
  ],
  '858': [ // Uruguay
    { code: 'puntadeleste', label: 'Punta del Este', lat: -34.96, lng: -54.95 }, { code: 'joseignacio', label: 'José Ignacio', lat: -34.84, lng: -54.62 },
    { code: 'montevideo', label: 'Montevideo', lat: -34.9, lng: -56.16 },
  ],
  '600': [ // Paraguay
    { code: 'asuncion', label: 'Asunción', lat: -25.28, lng: -57.63 }, { code: 'encarnacion', label: 'Encarnación', lat: -27.33, lng: -55.86 },
  ],
  '862': [ // Venezuela
    { code: 'losroques', label: 'Los Roques', lat: 11.85, lng: -66.76 }, { code: 'angelfalls', label: 'Angel Falls', lat: 5.97, lng: -62.53 },
    { code: 'merida', label: 'Mérida', lat: 8.6, lng: -71.14 },
  ],

  // ── Oceania ──
  '036': [ // Australien
    { code: 'sydney', label: 'Sydney', lat: -33.87, lng: 151.21 }, { code: 'greatbarrierreef', label: 'Great Barrier Reef', lat: -16.92, lng: 145.77 },
    { code: 'whitsundays', label: 'Whitsundays', lat: -20.28, lng: 148.78 }, { code: 'byronbay', label: 'Byron Bay', lat: -28.64, lng: 153.61 },
    { code: 'melbourne', label: 'Melbourne', lat: -37.81, lng: 144.96 }, { code: 'uluru', label: 'Uluru', lat: -25.34, lng: 131.04 },
  ],
  '554': [ // Neuseeland
    { code: 'queenstown', label: 'Queenstown', lat: -45.03, lng: 168.66 }, { code: 'milfordsound', label: 'Milford Sound', lat: -44.64, lng: 167.9 },
    { code: 'auckland', label: 'Auckland', lat: -36.85, lng: 174.76 }, { code: 'rotorua', label: 'Rotorua', lat: -38.14, lng: 176.25 },
  ],
  '242': [ // Fidschi
    { code: 'mamanuca', label: 'Mamanuca-Inseln', lat: -17.66, lng: 177.1 }, { code: 'yasawa', label: 'Yasawa-Inseln', lat: -16.9, lng: 177.5 },
    { code: 'nadi', label: 'Nadi', lat: -17.8, lng: 177.42 },
  ],
  '598': [ // Papua-Neuguinea
    { code: 'portmoresby', label: 'Port Moresby', lat: -9.44, lng: 147.18 }, { code: 'kokopo', label: 'Kokopo', lat: -4.35, lng: 152.27 },
  ],
  '090': [ // Salomonen
    { code: 'honiara', label: 'Honiara', lat: -9.43, lng: 159.95 }, { code: 'munda', label: 'Munda', lat: -8.33, lng: 157.26 },
  ],
  '548': [ // Vanuatu
    { code: 'portvila', label: 'Port Vila', lat: -17.74, lng: 168.31 }, { code: 'tanna', label: 'Tanna', lat: -19.5, lng: 169.27 },
  ],
  '882': [ // Samoa
    { code: 'apia', label: 'Apia', lat: -13.83, lng: -171.77 }, { code: 'lalomanu', label: 'Lalomanu', lat: -14.03, lng: -171.46 },
  ],
  '776': [ // Tonga
    { code: 'nukualofa', label: 'Nukuʻalofa', lat: -21.14, lng: -175.2 }, { code: 'vavau', label: 'Vavaʻu', lat: -18.65, lng: -173.98 },
  ],
  '585': [ // Palau
    { code: 'koror', label: 'Koror', lat: 7.34, lng: 134.48 }, { code: 'rockislands', label: 'Rock Islands', lat: 7.15, lng: 134.37 },
  ],
};

export const placesByCountry = (iso: string): Place[] => {
  const key = Object.keys(PLACES).find((k) => Number(k) === Number(iso));
  return key ? PLACES[key] : [];
};
export const placeByCode = (iso: string, code: string): Place | undefined =>
  placesByCountry(iso).find((p) => p.code === code);

// Numeric ISO codes of European countries — used to draw ONLY Europe as land at the
// country stage (no African/Middle-Eastern neighbours). Small states absent from the
// 110m world data are simply skipped.
export const EUROPE_ISOS: string[] = [
  '008', '020', '040', '056', '070', '100', '112', '191', '196', '203', '208', '233',
  '246', '250', '276', '300', '336', '348', '352', '372', '380', '383', '428', '438',
  '440', '442', '470', '492', '498', '499', '528', '578', '616', '620', '642', '674',
  '688', '703', '705', '724', '752', '756', '804', '807', '826',
];
