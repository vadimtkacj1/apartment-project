/**
 * MOONLIT CONTENT — everything the theme renders that isn't a property, a
 * contact or a section title. Stored in the `MoonlitContent` singleton and
 * edited from /admin/design.
 *
 * Every field falls back to the shipped default, so an empty table (or a
 * half-filled one) still renders the full page.
 */

export interface BannerSlideContent {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
  ctaHref: string;
  ctaLabel: string;
}

export interface FacilityContent {
  icon: string;
  title: string;
  text: string;
}

export interface TestimonialContent {
  text: string;
  author: string;
  context: string;
  avatar: string;
}

export interface NavItemContent {
  label: string;
  href: string;
  submenu?: { label: string; href: string }[];
}

export interface FooterColumnContent {
  title: string;
  links: { label: string; href: string }[];
}

export interface BudgetContent {
  value: string;
  label: string;
}

export interface MoonlitContentData {
  bannerSlides: BannerSlideContent[];
  facilities: FacilityContent[];
  testimonials: TestimonialContent[];
  aboutText: string;
  aboutImageMain: string;
  aboutImageInset: string;
  aboutBadgeValue: string;
  aboutBadgeLabel: string;
  aboutCtaLabel: string;
  bandImage: string;
  navItems: NavItemContent[];
  searchCities: string[];
  searchRooms: string[];
  searchBudgets: BudgetContent[];
  newsletterTitle: string;
  footerAbout: string;
  footerColumns: FooterColumnContent[];
}

const IMG = {
  hero: '/images/moonlit/hero.jpg',
  building: '/images/moonlit/building.jpg',
  keys: '/images/moonlit/keys.jpg',
  street: '/images/moonlit/street.jpg',
  balcony: '/images/moonlit/balcony.jpg',
};

export const MOONLIT_DEFAULTS: MoonlitContentData = {
  bannerSlides: [
    {
      image: IMG.balcony,
      eyebrow: 'ברוכים הבאים ל־Aiterra',
      title: 'הדירה הנכונה, עם מי שבאמת מכיר את השכונה',
      text: 'מאגר נכסים מדויק בחולון, בת ים והמרכז — עם ליווי אישי של המייסדים מהסיור הראשון ועד קבלת המפתח.',
      ctaHref: '/apartments',
      ctaLabel: 'לצפייה בנכסים',
    },
    {
      image: IMG.building,
      eyebrow: 'מוכרים דירה?',
      title: 'תמחור מדויק ומכירה בזמן סביר',
      text: 'הערכת שווי המבוססת על עסקאות אמיתיות באזור, שיווק ממוקד וניהול משא ומתן עד החתימה.',
      ctaHref: '/selling-apartment',
      ctaLabel: 'הערכת שווי לנכס שלי',
    },
    {
      image: IMG.hero,
      eyebrow: 'קונים דירה?',
      title: 'פחות סיורים, יותר התאמה',
      text: 'אנחנו מסננים עבורכם: מחיר הגיוני, מצב אמיתי ותשובה כנה על מה שלא רואים בתמונות.',
      ctaHref: '/buying-apartment',
      ctaLabel: 'מדריך לקונים',
    },
  ],
  facilities: [
    {
      icon: '/moonlit/images/icon/bed.svg',
      title: 'נכסים בבלעדיות',
      text: 'חלק מהנכסים שלנו לא מגיעים ללוחות המודעות — הם מוצעים קודם כול ללקוחות המשרד.',
    },
    {
      icon: '/moonlit/images/icon/security.svg',
      title: 'ליווי משפטי ובטוח',
      text: 'בדיקות טאבו, היתרים ומצב הנכס לפני חתימה, בשיתוף עורכי דין ושמאים שאנחנו עובדים איתם שנים.',
    },
    {
      icon: '/moonlit/images/icon/gym.svg',
      title: 'ליווי אישי של המייסדים',
      text: 'לא מוקד ולא סוכן מתחלף — אותו איש קשר מהסיור הראשון ועד קבלת המפתח.',
    },
    {
      icon: '/moonlit/images/icon/swimming-pool.svg',
      title: 'הערכת שווי חינם',
      text: 'תמחור על בסיס עסקאות שנסגרו באזור בפועל, בלי הבטחות באוויר ובלי לחץ למכור.',
    },
  ],
  testimonials: [
    {
      text: 'הגענו אחרי תקופה ארוכה של חיפושים ללא הצלחה. תוך פגישה אחת הבינו מה אנחנו מחפשים ומצאו לנו את הדירה תוך שבועיים.',
      author: 'דורון לוי',
      context: 'קניית דירה · בת ים',
      avatar: '/moonlit/images/author/author-2x.webp',
    },
    {
      text: 'ידעו להעריך נכון את שווי הדירה ולהביא רק קונים מתאימים. מכירה מהירה ומדויקת, בלי סיורים מיותרים ובלי משחקים.',
      author: 'עדן שליו',
      context: 'מכירת דירה · חולון',
      avatar: '/moonlit/images/author/author-4.webp',
    },
    {
      text: 'קיבלנו ליווי מלא מהשלב הראשון ועד החתימה. כל שאלה נענתה במהירות ובסבלנות, וברגעים הלחוצים ידעו להרגיע ולהסביר.',
      author: 'שירה מלמד',
      context: 'ליווי עסקה · חולון',
      avatar: '/moonlit/images/author/author-2x.webp',
    },
  ],
  aboutText:
    'משרד תיווך בוטיק שפועל בחולון, בת ים והמרכז מאז 2002. אנחנו לא מנהלים מאגר אינסופי של דירות — אנחנו מכירים כל נכס שאנחנו משווקים, יודעים בדיוק מה שווה השכונה וכמה באמת נסגרו בה עסקאות, וממליצים גם כשהתשובה הנכונה היא לחכות.',
  aboutImageMain: IMG.building,
  aboutImageInset: IMG.keys,
  aboutBadgeValue: '+24',
  aboutBadgeLabel: 'שנות ניסיון',
  aboutCtaLabel: 'הכירו אותנו',
  bandImage: IMG.street,
  navItems: [
    { label: 'דף הבית', href: '/' },
    { label: 'הנכסים שלנו', href: '/apartments' },
    {
      label: 'מידע מקצועי',
      href: '#',
      submenu: [
        { label: 'מוכרים דירה', href: '/selling-apartment' },
        { label: 'קונים דירה', href: '/buying-apartment' },
      ],
    },
    { label: 'מאמרים', href: '/articles' },
    {
      label: 'מידע וכלים',
      href: '#',
      submenu: [
        { label: 'קישורים שימושיים', href: '/links' },
        { label: 'שאלות ותשובות', href: '/faq' },
      ],
    },
    { label: 'אודות', href: '/about' },
  ],
  searchCities: ['holon', 'batyam', 'rishon', 'telaviv', 'ramat-gan', 'givatayim'],
  searchRooms: ['2', '3', '4', '5'],
  searchBudgets: [
    { value: '1500000', label: 'עד 1.5 מ׳ ₪' },
    { value: '2000000', label: 'עד 2 מ׳ ₪' },
    { value: '2500000', label: 'עד 2.5 מ׳ ₪' },
    { value: '3000000', label: 'עד 3 מ׳ ₪' },
    { value: '4000000', label: 'עד 4 מ׳ ₪' },
  ],
  newsletterTitle: 'קבלו נכסים חדשים למייל',
  footerAbout:
    'משרד תיווך נדל״ן למגורים בחולון, בת ים והמרכז. ליווי אישי מהסיור הראשון ועד קבלת המפתח.',
  footerColumns: [
    {
      title: 'ניווט מהיר',
      links: [
        { label: 'הנכסים שלנו', href: '/apartments' },
        { label: 'מוכרים דירה', href: '/selling-apartment' },
        { label: 'קונים דירה', href: '/buying-apartment' },
        { label: 'אודותינו', href: '/about' },
      ],
    },
    {
      title: 'מרכז הידע',
      links: [
        { label: 'מדריך משכנתא', href: '/articles/mortgage-guide' },
        { label: 'מס רכישה', href: '/articles/purchase-tax-guide' },
        { label: 'בדיקות לפני קנייה', href: '/articles/pre-purchase-checklist' },
        { label: 'שאלות ותשובות', href: '/faq' },
        { label: 'קישורים שימושיים', href: '/links' },
      ],
    },
  ],
};

/** Non-empty array from the DB, or the shipped default. */
function list<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) && value.length > 0 ? (value as T[]) : fallback;
}

function text(value: string | null | undefined, fallback: string): string {
  return value && value.trim() ? value : fallback;
}

/** Merge the singleton row over the defaults. Safe on an empty database. */
export function mergeMoonlitContent(row: Record<string, unknown> | null): MoonlitContentData {
  const d = MOONLIT_DEFAULTS;
  if (!row) return d;

  return {
    bannerSlides: list<BannerSlideContent>(row.bannerSlides, d.bannerSlides),
    facilities: list<FacilityContent>(row.facilities, d.facilities),
    testimonials: list<TestimonialContent>(row.testimonials, d.testimonials),
    aboutText: text(row.aboutText as string, d.aboutText),
    aboutImageMain: text(row.aboutImageMain as string, d.aboutImageMain),
    aboutImageInset: text(row.aboutImageInset as string, d.aboutImageInset),
    aboutBadgeValue: text(row.aboutBadgeValue as string, d.aboutBadgeValue),
    aboutBadgeLabel: text(row.aboutBadgeLabel as string, d.aboutBadgeLabel),
    aboutCtaLabel: text(row.aboutCtaLabel as string, d.aboutCtaLabel),
    bandImage: text(row.bandImage as string, d.bandImage),
    navItems: list<NavItemContent>(row.navItems, d.navItems),
    searchCities: list<string>(row.searchCities, d.searchCities),
    searchRooms: list<string>(row.searchRooms, d.searchRooms),
    searchBudgets: list<BudgetContent>(row.searchBudgets, d.searchBudgets),
    newsletterTitle: text(row.newsletterTitle as string, d.newsletterTitle),
    footerAbout: text(row.footerAbout as string, d.footerAbout),
    footerColumns: list<FooterColumnContent>(row.footerColumns, d.footerColumns),
  };
}
