// lib/shop/kachelbilder.ts
//
// Welches Bild zeigt die Kachel eines Produkts auf der Länderseite?
//
// Die heutigen Länderseiten des Shops (Router-Snippet 11) zeigen je Produkt ein
// von Hand gewähltes Bild: beim Hoodie den Mann von vorn, bei Sweater und Shirt
// die Frau von vorn, bei den Logo-Linien eigene Modellbilder. Eine Regel, die das
// aus der Galerie ableitet, gibt es nicht — ein Teil dieser Bilder liegt gar
// nicht in der Produktgalerie. Deshalb diese Liste, am 20.11.2026 maschinell aus
// dem Router übernommen (18 Einträge, alle erreichbar gemessen).
//
// Für ein Produkt ohne Eintrag nimmt die Seite das Produktbild aus WooCommerce.
// Pfade ohne Domain; die Adresse des Shops setzt lib/shop/katalog.ts davor.

export const KACHELBILD: Record<string, string> = {
  'albania-hoodie': '/wp-content/uploads/2026/08/OneFam_Albanien_Hoodie_schwarz_Mann_frontal_4k-600x745.webp',
  'albania-sweater': '/wp-content/uploads/2026/08/OneFam_Albanien_Sweater_schwarz_Frau_frontal_4k-600x745.webp',
  'albania-shirt': '/wp-content/uploads/2026/08/OneFam_Albanien_Shirt_schwarz_Frau_frontal_4k-600x745.webp',
  'afghanistan-hoodie': '/wp-content/uploads/2026/08/OneFam_Afghanistan_Hoodie_schwarz_Mann_frontal_4k-600x745.webp',
  'afghanistan-sweater': '/wp-content/uploads/2026/08/OneFam_Afghanistan_Sweater_schwarz_Frau_frontal_4k-600x745.webp',
  'afghanistan-shirt': '/wp-content/uploads/2026/08/OneFam_Afghanistan_Shirt_schwarz_Frau_frontal_4k-600x745.webp',
  'andorra-hoodie': '/wp-content/uploads/2026/08/OneFam_Andorra_Hoodie_schwarz_Mann_frontal_4k-1-600x745.webp',
  'andorra-sweater': '/wp-content/uploads/2026/08/OneFam_Andorra_Sweater_schwarz_Frau_frontal_4k-1-600x745.webp',
  'andorra-shirt': '/wp-content/uploads/2026/08/OneFam_Andorra_Shirt_schwarz_Frau_frontal_4k-1-600x745.webp',
  'argentina-hoodie': '/wp-content/uploads/2026/08/argentina-hoodie-model-mann-600x745.webp',
  'argentina-sweater': '/wp-content/uploads/2026/08/argentina-sweater-model-frau-600x745.webp',
  'argentina-shirt': '/wp-content/uploads/2026/08/argentina-shirt-model-frau-600x745.webp',
  'logo-black-hoodie': '/wp-content/uploads/2026/07/onefam-logo-black-hoodie-mann.webp',
  'logo-black-sweater': '/wp-content/uploads/onefam-assets/hf_20260714_210404_0116a320-4877-449c-b044-c2ad394e61d7.webp',
  'logo-black-shirt': '/wp-content/uploads/onefam-assets/hf_20260714_205720_45d8744e-f24c-4f4c-aa37-eb203a6caf53.webp',
  'onefam-logo-hoodie': '/wp-content/uploads/2026/07/onefam-onefam-logo-hoodie-mann.webp',
  'onefam-logo-sweater': '/wp-content/uploads/onefam-assets/hf_20260714_195302_d962f8af-991d-4c05-b19f-44d0e407dd13.webp',
  'onefam-logo-shirt': '/wp-content/uploads/onefam-assets/hf_20260714_192051_70fdfdb9-4c62-4b65-8d0c-502218b37b81.webp',
};
