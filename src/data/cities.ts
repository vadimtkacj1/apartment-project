/**
 * Israeli cities for property location selection.
 * Sorted by Hebrew name for RTL display.
 */

export interface CityOption {
  value: string;
  label: string; // Hebrew name
}

// Comprehensive list of Israeli cities (ערים בישראל)
// value: ASCII slug for DB/API, label: Hebrew display name
export const ISRAELI_CITIES: CityOption[] = [
  // Original 4 (keep first for compatibility)
  { value: 'holon', label: 'חולון' },
  { value: 'batyam', label: 'בת ים' },
  { value: 'rishon', label: 'ראשון לציון' },
  { value: 'telaviv', label: 'תל אביב' },
  // Rest - major Israeli cities
  { value: 'ashdod', label: 'אשדוד' },
  { value: 'ashkelon', label: 'אשקלון' },
  { value: 'arad', label: 'ערד' },
  { value: 'ariel', label: 'אריאל' },
  { value: 'beersheba', label: 'באר שבע' },
  { value: 'beit-shemesh', label: 'בית שמש' },
  { value: 'bnei-brak', label: 'בני ברק' },
  { value: 'dimona', label: 'דימונה' },
  { value: 'eilat', label: 'אילת' },
  { value: 'elyakhin', label: 'אליכין' },
  { value: 'givatayim', label: 'גבעתיים' },
  { value: 'givat-shmuel', label: 'גבעת שמואל' },
  { value: 'hadera', label: 'חדרה' },
  { value: 'haifa', label: 'חיפה' },
  { value: 'hertzliya', label: 'הרצליה' },
  { value: 'hod-hasharon', label: 'הוד השרון' },
  { value: 'jerusalem', label: 'ירושלים' },
  { value: 'karmiel', label: 'כרמיאל' },
  { value: 'kfar-saba', label: 'כפר סבא' },
  { value: 'kfar-yona', label: 'כפר יונה' },
  { value: 'kiryat-ata', label: 'קרית אתא' },
  { value: 'kiryat-bialik', label: 'קרית ביאליק' },
  { value: 'kiryat-gat', label: 'קרית גת' },
  { value: 'kiryat-malachi', label: 'קרית מלאכי' },
  { value: 'kiryat-motzkin', label: 'קרית מוצקין' },
  { value: 'kiryat-ono', label: 'קרית אונו' },
  { value: 'kiryat-shmona', label: 'קרית שמונה' },
  { value: 'kiryat-yam', label: 'קרית ים' },
  { value: 'lod', label: 'לוד' },
  { value: 'maale-adumim', label: 'מעלה אדומים' },
  { value: 'maalot-tarshiha', label: 'מעלות תרשיחא' },
  { value: 'migdal-haemek', label: 'מגדל העמק' },
  { value: 'modiin', label: 'מודיעין' },
  { value: 'modiin-illit', label: 'מודיעין עילית' },
  { value: 'nahariya', label: 'נהריה' },
  { value: 'nazareth', label: 'נצרת' },
  { value: 'nes-ziona', label: 'נס ציונה' },
  { value: 'netanya', label: 'נתניה' },
  { value: 'netivot', label: 'נתיבות' },
  { value: 'ofakim', label: 'אופקים' },
  { value: 'omert', label: 'עומר' },
  { value: 'or-akiva', label: 'אור עקיבא' },
  { value: 'or-yehuda', label: 'אור יהודה' },
  { value: 'petah-tikva', label: 'פתח תקווה' },
  { value: 'qalansuwa', label: 'קלנסואה' },
  { value: 'raanana', label: 'רעננה' },
  { value: 'rahat', label: 'רהט' },
  { value: 'ramat-gan', label: 'רמת גן' },
  { value: 'ramat-hasharon', label: 'רמת השרון' },
  { value: 'ramla', label: 'רמלה' },
  { value: 'rehovot', label: 'רחובות' },
  { value: 'rosh-haayin', label: 'ראש העין' },
  { value: 'safed', label: 'צפת' },
  { value: 'sakhnin', label: 'סכנין' },
  { value: 'sederot', label: 'שדרות' },
  { value: 'tamra', label: 'טמרה' },
  { value: 'tiberias', label: 'טבריה' },
  { value: 'tira', label: 'טירה' },
  { value: 'um-al-fahm', label: 'אום אל-פחם' },
  { value: 'yavne', label: 'יבנה' },
  { value: 'yokneam', label: 'יקנעם' },
  { value: 'azor', label: 'אזור' },
  { value: 'zichron-yaakov', label: 'זכרון יעקב' },
];

/** Get Hebrew label for a city slug. Falls back to raw value if unknown. */
export function getCityLabel(citySlug: string | null | undefined): string {
  if (!citySlug) return '';
  const city = ISRAELI_CITIES.find((c) => c.value === citySlug);
  return city?.label ?? citySlug;
}

/** Map: city name (Hebrew/English from geocoding) → slug. Built from ISRAELI_CITIES + common English variants. */
const CITY_NAME_TO_SLUG: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const c of ISRAELI_CITIES) {
    map[c.label] = c.value;
  }
  // Common English/OSM variants
  const en: [string, string][] = [
    ['Holon', 'holon'], ['Bat Yam', 'batyam'], ['Rishon LeZion', 'rishon'], ['Rishon Le Zion', 'rishon'],
    ['Tel Aviv', 'telaviv'], ['Tel Aviv-Yafo', 'telaviv'], ['Tel Aviv Yafo', 'telaviv'],
    ['Jerusalem', 'jerusalem'], ['Haifa', 'haifa'], ['Ashdod', 'ashdod'], ['Netanya', 'netanya'],
    ['Beer Sheva', 'beersheba'], ['Beersheba', 'beersheba'], ['Be\'er Sheva', 'beersheba'],
    ['Petah Tikva', 'petah-tikva'], ['Ramat Gan', 'ramat-gan'], ['Givatayim', 'givatayim'],
    ['Rehovot', 'rehovot'], ['Ashkelon', 'ashkelon'], ['Modiin', 'modiin'], ['Modi\'in', 'modiin'],
    ['Hertzliya', 'hertzliya'], ['Herzliya', 'hertzliya'], ['Kfar Saba', 'kfar-saba'],
    ['Ra\'anana', 'raanana'], ['Raanana', 'raanana'], ['Hod Hasharon', 'hod-hasharon'],
  ];
  for (const [name, slug] of en) map[name] = slug;
  return map;
})();

/** Convert city name (Hebrew/English from geocoding) to our slug. For map auto-fill. */
export function getCitySlug(nameOrLabel: string | null | undefined): string {
  if (!nameOrLabel) return '';
  const slug = CITY_NAME_TO_SLUG[nameOrLabel];
  if (slug) return slug;
  return nameOrLabel.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

/** City slugs for "center" region filter (Gush Dan area). */
export const CENTER_REGION_CITY_SLUGS = ['telaviv', 'holon', 'batyam', 'rishon', 'givatayim', 'ramat-gan', 'ramat-hasharon', 'hertzliya', 'hod-hasharon', 'kfar-saba', 'raanana', 'netanya', 'petah-tikva', 'rosh-haayin', 'or-yehuda'];
