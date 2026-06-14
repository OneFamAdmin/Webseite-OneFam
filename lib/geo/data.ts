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
export type Country = { iso: string; label: string; continent: string };

export const CONTINENTS: Continent[] = [
  { key: 'europe', label: 'Europa', lat: 52, lng: 15 },
  { key: 'africa', label: 'Afrika', lat: 2, lng: 20 },
  { key: 'asia', label: 'Asien', lat: 40, lng: 90 },
  { key: 'north-america', label: 'Nordamerika', lat: 45, lng: -100 },
  { key: 'south-america', label: 'Südamerika', lat: -15, lng: -58 },
  { key: 'oceania', label: 'Ozeanien', lat: -22, lng: 140 },
];

export const COUNTRIES: Country[] = [
  // Europe
  { iso: '380', label: 'Italien', continent: 'europe' },
  { iso: '724', label: 'Spanien', continent: 'europe' },
  { iso: '620', label: 'Portugal', continent: 'europe' },
  { iso: '300', label: 'Griechenland', continent: 'europe' },
  { iso: '191', label: 'Kroatien', continent: 'europe' },
  { iso: '352', label: 'Island', continent: 'europe' },
  { iso: '578', label: 'Norwegen', continent: 'europe' },

  // Africa
  { iso: '504', label: 'Marokko', continent: 'africa' },
  { iso: '818', label: 'Ägypten', continent: 'africa' },
  { iso: '404', label: 'Kenia', continent: 'africa' },
  { iso: '834', label: 'Tansania', continent: 'africa' },
  { iso: '710', label: 'Südafrika', continent: 'africa' },
  { iso: '516', label: 'Namibia', continent: 'africa' },

  // Asia
  { iso: '764', label: 'Thailand', continent: 'asia' },
  { iso: '392', label: 'Japan', continent: 'asia' },
  { iso: '360', label: 'Indonesien', continent: 'asia' },
  { iso: '704', label: 'Vietnam', continent: 'asia' },
  { iso: '356', label: 'Indien', continent: 'asia' },
  { iso: '524', label: 'Nepal', continent: 'asia' },
  { iso: '144', label: 'Sri Lanka', continent: 'asia' },

  // North America
  { iso: '484', label: 'Mexiko', continent: 'north-america' },
  { iso: '188', label: 'Costa Rica', continent: 'north-america' },
  { iso: '840', label: 'USA', continent: 'north-america' },
  { iso: '124', label: 'Kanada', continent: 'north-america' },
  { iso: '192', label: 'Kuba', continent: 'north-america' },

  // South America
  { iso: '076', label: 'Brasilien', continent: 'south-america' },
  { iso: '032', label: 'Argentinien', continent: 'south-america' },
  { iso: '604', label: 'Peru', continent: 'south-america' },
  { iso: '170', label: 'Kolumbien', continent: 'south-america' },
  { iso: '152', label: 'Chile', continent: 'south-america' },
  { iso: '218', label: 'Ecuador', continent: 'south-america' },

  // Oceania
  { iso: '036', label: 'Australien', continent: 'oceania' },
  { iso: '554', label: 'Neuseeland', continent: 'oceania' },
  { iso: '242', label: 'Fidschi', continent: 'oceania' },
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

export const PLACES: Record<string, Place[]> = {
  // Europe
  '380': [{ code: 'rom', label: 'Rom', lat: 41.9, lng: 12.5 }, { code: 'venedig', label: 'Venedig', lat: 45.44, lng: 12.33 }, { code: 'florenz', label: 'Florenz', lat: 43.77, lng: 11.26 }],
  '724': [{ code: 'barcelona', label: 'Barcelona', lat: 41.39, lng: 2.17 }, { code: 'madrid', label: 'Madrid', lat: 40.42, lng: -3.7 }, { code: 'sevilla', label: 'Sevilla', lat: 37.39, lng: -5.99 }],
  '620': [{ code: 'lissabon', label: 'Lissabon', lat: 38.72, lng: -9.14 }, { code: 'porto', label: 'Porto', lat: 41.15, lng: -8.61 }, { code: 'faro', label: 'Faro', lat: 37.02, lng: -7.93 }],
  '300': [{ code: 'athen', label: 'Athen', lat: 37.98, lng: 23.73 }, { code: 'santorin', label: 'Santorin', lat: 36.39, lng: 25.46 }, { code: 'kreta', label: 'Kreta', lat: 35.34, lng: 25.13 }],
  '191': [{ code: 'dubrovnik', label: 'Dubrovnik', lat: 42.65, lng: 18.09 }, { code: 'split', label: 'Split', lat: 43.51, lng: 16.44 }, { code: 'zagreb', label: 'Zagreb', lat: 45.81, lng: 15.98 }],
  '352': [{ code: 'reykjavik', label: 'Reykjavík', lat: 64.15, lng: -21.94 }, { code: 'akureyri', label: 'Akureyri', lat: 65.69, lng: -18.11 }],
  '578': [{ code: 'oslo', label: 'Oslo', lat: 59.91, lng: 10.75 }, { code: 'bergen', label: 'Bergen', lat: 60.39, lng: 5.32 }, { code: 'tromso', label: 'Tromsø', lat: 69.65, lng: 18.96 }],
  // Africa
  '504': [{ code: 'marrakesch', label: 'Marrakesch', lat: 31.63, lng: -7.99 }, { code: 'casablanca', label: 'Casablanca', lat: 33.57, lng: -7.59 }, { code: 'fes', label: 'Fès', lat: 34.04, lng: -5.0 }],
  '818': [{ code: 'kairo', label: 'Kairo', lat: 30.04, lng: 31.24 }, { code: 'luxor', label: 'Luxor', lat: 25.69, lng: 32.64 }, { code: 'hurghada', label: 'Hurghada', lat: 27.26, lng: 33.81 }],
  '404': [{ code: 'nairobi', label: 'Nairobi', lat: -1.29, lng: 36.82 }, { code: 'mombasa', label: 'Mombasa', lat: -4.04, lng: 39.67 }],
  '834': [{ code: 'sansibar', label: 'Sansibar', lat: -6.16, lng: 39.2 }, { code: 'daressalam', label: 'Daressalam', lat: -6.79, lng: 39.21 }, { code: 'arusha', label: 'Arusha', lat: -3.39, lng: 36.68 }],
  '710': [{ code: 'kapstadt', label: 'Kapstadt', lat: -33.92, lng: 18.42 }, { code: 'johannesburg', label: 'Johannesburg', lat: -26.2, lng: 28.05 }, { code: 'durban', label: 'Durban', lat: -29.86, lng: 31.02 }],
  '516': [{ code: 'windhoek', label: 'Windhoek', lat: -22.56, lng: 17.08 }, { code: 'swakopmund', label: 'Swakopmund', lat: -22.68, lng: 14.53 }],
  // Asia
  '764': [{ code: 'bangkok', label: 'Bangkok', lat: 13.76, lng: 100.5 }, { code: 'phuket', label: 'Phuket', lat: 7.88, lng: 98.39 }, { code: 'chiangmai', label: 'Chiang Mai', lat: 18.79, lng: 98.99 }],
  '392': [{ code: 'tokio', label: 'Tokio', lat: 35.68, lng: 139.69 }, { code: 'kyoto', label: 'Kyoto', lat: 35.01, lng: 135.77 }, { code: 'osaka', label: 'Osaka', lat: 34.69, lng: 135.5 }],
  '360': [{ code: 'bali', label: 'Bali', lat: -8.65, lng: 115.22 }, { code: 'jakarta', label: 'Jakarta', lat: -6.21, lng: 106.85 }, { code: 'yogyakarta', label: 'Yogyakarta', lat: -7.8, lng: 110.36 }],
  '704': [{ code: 'hanoi', label: 'Hanoi', lat: 21.03, lng: 105.85 }, { code: 'hcmc', label: 'Ho-Chi-Minh-Stadt', lat: 10.82, lng: 106.63 }, { code: 'danang', label: 'Da Nang', lat: 16.05, lng: 108.21 }],
  '356': [{ code: 'delhi', label: 'Delhi', lat: 28.61, lng: 77.21 }, { code: 'mumbai', label: 'Mumbai', lat: 19.08, lng: 72.88 }, { code: 'jaipur', label: 'Jaipur', lat: 26.91, lng: 75.79 }],
  '524': [{ code: 'kathmandu', label: 'Kathmandu', lat: 27.71, lng: 85.32 }, { code: 'pokhara', label: 'Pokhara', lat: 28.21, lng: 83.99 }],
  '144': [{ code: 'colombo', label: 'Colombo', lat: 6.93, lng: 79.86 }, { code: 'kandy', label: 'Kandy', lat: 7.29, lng: 80.64 }],
  // North America
  '484': [{ code: 'mexikostadt', label: 'Mexiko-Stadt', lat: 19.43, lng: -99.13 }, { code: 'cancun', label: 'Cancún', lat: 21.16, lng: -86.85 }, { code: 'oaxaca', label: 'Oaxaca', lat: 17.07, lng: -96.72 }],
  '188': [{ code: 'sanjose', label: 'San José', lat: 9.93, lng: -84.08 }, { code: 'lafortuna', label: 'La Fortuna', lat: 10.47, lng: -84.65 }],
  '840': [{ code: 'newyork', label: 'New York', lat: 40.71, lng: -74.01 }, { code: 'losangeles', label: 'Los Angeles', lat: 34.05, lng: -118.24 }, { code: 'miami', label: 'Miami', lat: 25.76, lng: -80.19 }],
  '124': [{ code: 'vancouver', label: 'Vancouver', lat: 49.28, lng: -123.12 }, { code: 'toronto', label: 'Toronto', lat: 43.65, lng: -79.38 }, { code: 'montreal', label: 'Montréal', lat: 45.5, lng: -73.57 }],
  '192': [{ code: 'havanna', label: 'Havanna', lat: 23.11, lng: -82.37 }, { code: 'varadero', label: 'Varadero', lat: 23.13, lng: -81.29 }, { code: 'trinidad', label: 'Trinidad', lat: 21.8, lng: -79.98 }],
  // South America
  '076': [{ code: 'rio', label: 'Rio de Janeiro', lat: -22.91, lng: -43.17 }, { code: 'saopaulo', label: 'São Paulo', lat: -23.55, lng: -46.63 }, { code: 'salvador', label: 'Salvador', lat: -12.97, lng: -38.5 }],
  '032': [{ code: 'buenosaires', label: 'Buenos Aires', lat: -34.6, lng: -58.38 }, { code: 'bariloche', label: 'Bariloche', lat: -41.13, lng: -71.31 }, { code: 'mendoza', label: 'Mendoza', lat: -32.89, lng: -68.85 }],
  '604': [{ code: 'lima', label: 'Lima', lat: -12.05, lng: -77.04 }, { code: 'cusco', label: 'Cusco', lat: -13.53, lng: -71.97 }, { code: 'arequipa', label: 'Arequipa', lat: -16.41, lng: -71.54 }],
  '170': [{ code: 'bogota', label: 'Bogotá', lat: 4.71, lng: -74.07 }, { code: 'cartagena', label: 'Cartagena', lat: 10.39, lng: -75.51 }, { code: 'medellin', label: 'Medellín', lat: 6.24, lng: -75.57 }],
  '152': [{ code: 'santiago', label: 'Santiago', lat: -33.45, lng: -70.67 }, { code: 'valparaiso', label: 'Valparaíso', lat: -33.05, lng: -71.62 }, { code: 'atacama', label: 'San Pedro de Atacama', lat: -22.91, lng: -68.2 }],
  '218': [{ code: 'quito', label: 'Quito', lat: -0.18, lng: -78.47 }, { code: 'guayaquil', label: 'Guayaquil', lat: -2.17, lng: -79.92 }],
  // Oceania
  '036': [{ code: 'sydney', label: 'Sydney', lat: -33.87, lng: 151.21 }, { code: 'melbourne', label: 'Melbourne', lat: -37.81, lng: 144.96 }, { code: 'cairns', label: 'Cairns', lat: -16.92, lng: 145.77 }],
  '554': [{ code: 'auckland', label: 'Auckland', lat: -36.85, lng: 174.76 }, { code: 'queenstown', label: 'Queenstown', lat: -45.03, lng: 168.66 }, { code: 'wellington', label: 'Wellington', lat: -41.29, lng: 174.78 }],
  '242': [{ code: 'nadi', label: 'Nadi', lat: -17.8, lng: 177.42 }, { code: 'suva', label: 'Suva', lat: -18.14, lng: 178.44 }],
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
