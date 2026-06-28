// Single source of truth for the article catalog. Consumed by the /articles
// index grid and by sitemap.ts (URL + lastModified). Adding a new guide here
// makes it appear in the grid AND the sitemap automatically — no second list to
// keep in sync. `date` is the publish date; keep it equal to the article page's
// schema datePublished so on-page, JSON-LD, and sitemap never disagree.
export interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string; // ISO yyyy-mm-dd — publish date (must equal the page's JSON-LD datePublished)
  updated?: string; // ISO yyyy-mm-dd — last revision; overrides the catalog default below
  category: string;
  readTime: string;
  tags: string[];
}

// The whole catalog was last revised in the June 2026 GEO content pass; this equals
// every article page's JSON-LD `dateModified`. The sitemap uses it for <lastmod> so
// the sitemap stops contradicting the on-page structured data (which it did when it
// derived lastmod from the older publish date). Bump per-article via `updated`.
export const ARTICLES_LAST_REVISED = '2026-06-13';

export const articles: Article[] = [
  {
    id: 'home-staging',
    title: 'הום סטיילינג: ההשקעה הקטנה שמחזירה את עצמה פי עשרה',
    description: 'שני מוכרים, שתי דירות זהות באותו בניין בחולון. האחת נמכרה תוך שלושה שבועות, ב-80,000 ש"ח יותר מהשנייה. ההבדל? הכנה נכונה: קיר צבוע, סלון מאוורר, תמונות שצולמו מקצועית. במדריך: מה כדאי לתקן לפני מכירה ומה חבל על הכסף, כללי הזהב של הצגת דירה לקונים, ולמה צילום מקצועי הוא המודעה האמיתית שלכם.',
    image: '/images/articles/home-staging.jpg',
    date: '2026-06-09',
    category: 'קניה ומכירה',
    readTime: '7 דקות קריאה',
    tags: ['הום סטיילינג', 'הכנת דירה למכירה', 'שיפוץ לפני מכירה', 'מכירת דירה']
  },
  {
    id: 'new-vs-secondhand',
    title: 'קבלן או יד שנייה? ההשוואה שאף משווק לא יעשה לכם',
    description: 'מצד אחד: דירה חדשה ונוצצת מקבלן עם ממ"ד ולובי ממוזג. מצד שני: דירה יד שנייה בשכונה ותיקה במחיר סגור. במדריך: היתרונות האמיתיים של כל מסלול, מדד תשומות הבנייה והעלויות הנסתרות שמגלים בעמוד 47 של החוזה, ואיך עושים את ההשוואה הנכונה — על העלות הכוללת ולא על מחיר המודעה.',
    image: '/images/articles/new-vs-secondhand.jpg',
    date: '2026-06-02',
    category: 'קניה ומכירה',
    readTime: '8 דקות קריאה',
    tags: ['דירה מקבלן', 'דירה יד שנייה', 'מדד תשומות הבנייה', 'קניית דירה']
  },
  {
    id: 'pre-purchase-checklist',
    title: 'הצ׳קליסט שיציל אתכם: כל הבדיקות לפני קניית דירה',
    description: 'הדירה מהממת, המוכר נחמד, והמחיר נראה הוגן — ובדיוק ברגע הזה מתרחשות הטעויות הכי יקרות בנדל"ן. עיקול שלא הוזכר, מרפסת שנסגרה בלי היתר, רטיבות שהוסתרה מאחורי קיר טרי. הצ׳קליסט המלא: בדיקות משפטיות, תכנוניות, פיזיות וכלכליות — לפי הסדר הנכון, לפני שחותמים.',
    image: '/images/articles/pre-purchase.jpg',
    date: '2026-05-19',
    category: 'קניה ומכירה',
    readTime: '9 דקות קריאה',
    tags: ['בדיקות לפני קנייה', 'נסח טאבו', 'בדק בית', 'חריגות בנייה']
  },
  {
    id: 'holon-neighborhoods',
    title: 'שכונות חולון: איפה לגור, איפה להשקיע ולמה',
    description: 'חולון היא לא מקום אחד: ההבדל בין שכונה לשכונה הוא הבדל של אופי, קהילה, מחיר ופוטנציאל השבחה. קרית שרת ונאות שושנים למשפחות, ג׳סי כהן ותל גיבורים למחפשי פוטנציאל התחדשות, והשכונות החדשות למי שרוצה חדש מהניילון. המדריך המלא — מנקודת מבט של מי שחי את השטח 24 שנים.',
    image: '/images/articles/holon-neighborhoods.jpg',
    date: '2026-05-05',
    category: 'אזור ומיקום',
    readTime: '8 דקות קריאה',
    tags: ['שכונות חולון', 'איפה לגור בחולון', 'השקעה בחולון', 'קרית שרת']
  },
  {
    id: 'landlord-guide',
    title: 'השכרת דירה בלי כאבי ראש: המדריך לבעלי נכסים',
    description: 'על הנייר, השכרת דירה היא הכנסה פסיבית מושלמת. בפועל — שוכר שמפסיק לשלם, דוד שמתפוצץ בשישי בערב, ודירה שחוזרת במצב שדורש שיפוץ. ההבדל בין השכרה רווחית לסיוט הוא תהליך נכון: תמחור מדויק, סינון שוכרים קפדני, חוזה שמגן עליכם, ובחירת מסלול מס חכמה. השיטה המלאה — במדריך.',
    image: '/images/articles/landlord.jpg',
    date: '2026-04-21',
    category: 'השכרה וניהול',
    readTime: '8 דקות קריאה',
    tags: ['השכרת דירה', 'חוזה שכירות', 'מיסוי שכר דירה', 'ניהול נכסים']
  },
  {
    id: 'mortgage-guide',
    title: 'משכנתא בלי פאניקה: המדריך המעשי לרוכשי דירות',
    description: 'בשביל רוב הישראלים, משכנתא היא ההלוואה הגדולה בחיים — מיליון שקל ויותר ל-20 או 30 שנה. ובכל זאת רבים מקדישים לה פחות זמן מאשר לבחירת המקרר. במדריך: מה זה אישור עקרוני ולמה מוציאים אותו לפני שמחפשים דירה, כמה הון עצמי דורש הבנק, איך עובדים מסלולי הריבית, ואיך משיגים תנאים טובים יותר.',
    image: '/images/articles/mortgage.jpg',
    date: '2026-04-07',
    category: 'מימון ומיסוי',
    readTime: '9 דקות קריאה',
    tags: ['משכנתא', 'אישור עקרוני', 'מסלולי משכנתא', 'יועץ משכנתאות']
  },
  {
    id: 'first-apartment-guide',
    title: 'דירה ראשונה: המדריך שיחסוך לכם שנים של טעויות',
    description: 'אתם חוסכים כבר שנים, גרים בשכירות שרק עולה, וכל ביקור אצל ההורים מסתיים ב"נו, מתי כבר תקנו דירה?". קניית דירה ראשונה היא העסקה הגדולה בחיים — והיא מגיעה בדיוק כשיש לכם הכי פחות ניסיון. המדריך המלא לזוגות צעירים: תקציב אמיתי, הון עצמי, אישור עקרוני, ולמה חולון היא בחירה חכמה.',
    image: '/images/articles/first-apartment.jpg',
    date: '2026-03-24',
    category: 'קניה ומכירה',
    readTime: '9 דקות קריאה',
    tags: ['דירה ראשונה', 'זוגות צעירים', 'הון עצמי', 'קניית דירה בחולון']
  },
  {
    id: 'apartment-pricing',
    title: 'כמה שווה הדירה שלכם באמת? המדריך לתמחור נכון',
    description: 'רוב המוכרים קובעים מחיר לפי מה ש"השכן ביקש" — וזו הטעות הראשונה. תמחור שגוי עולה בממוצע 5%-10% ממחיר הדירה: מחיר נמוך מדי מפסיד כסף, מחיר גבוה מדי "שורף" את הדירה בשוק. במדריך: מה באמת קובע את שווי הדירה, שלושת הכלים להערכת שווי, ולמה מלכודת "המחיר הגבוה ליתר ביטחון" עולה ביוקר.',
    image: '/images/articles/apartment-pricing.jpg',
    date: '2026-03-10',
    category: 'קניה ומכירה',
    readTime: '8 דקות קריאה',
    tags: ['הערכת שווי דירה', 'תמחור דירה', 'כמה שווה הדירה שלי', 'מכירת דירה']
  },
  {
    id: 'urban-renewal-holon',
    title: 'התחדשות עירונית בחולון: ההזדמנות שמתחת לאף',
    description: 'מנופים בג׳סי כהן, שלטי "כאן ייבנה" בתל גיבורים — ההתחדשות העירונית משנה את פני חולון ואת מחירי הדירות. לבעלי דירות ותיקים זו הזדמנות של פעם בחיים; לקונים ומשקיעים — דרך לקנות במחיר של "ישן" ולקבל נכס חדש. במדריך: ההבדל בין פינוי-בינוי לתמ"א 38, השכונות שבתנופה, ואיך מזהים הזדמנות אמיתית.',
    image: '/images/articles/urban-renewal.jpg',
    date: '2026-02-24',
    category: 'אזור ומיקום',
    readTime: '9 דקות קריאה',
    tags: ['התחדשות עירונית', 'פינוי בינוי', 'תמ"א 38', 'השקעה בחולון']
  },
  {
    id: 'purchase-tax-guide',
    title: 'מס רכישה על דירה: המדריך שיחסוך לכם עשרות אלפי שקלים',
    description: 'מצאתם את דירת החלומות, סגרתם מחיר, ואז עורך הדין שואל: "זו הדירה היחידה שלכם?" — והתשובה יכולה לשנות את העסקה במאות אלפי שקלים. במדריך: מדרגות מס הרכישה לדירה יחידה ולמשקיעים, ההקלות לעולים חדשים, מלכודת המועדים של משפרי דיור, ואיך מתכננים את העסקה נכון מראש.',
    image: '/images/articles/purchase-tax.jpg',
    date: '2026-02-10',
    category: 'מימון ומיסוי',
    readTime: '8 דקות קריאה',
    tags: ['מס רכישה', 'מדרגות מס', 'מיסוי מקרקעין', 'דירה להשקעה']
  },
  {
    id: 'foreign-investors',
    title: 'נדל"ן בשלט רחוק: כשאתם בחו"ל והלב רוצה',
    description: 'אין תחושה מתסכלת יותר מזו: אתם גרים מעבר לים, עובדים קשה, ורואים איך מחירי הנדל"ן בישראל ממשיכים לטוס למעלה בלעדיכם. אתם רוצים לקנות דירה להשקעה בחולון, דירה מול הים בבת ים, או ראשל"צ ולהבטיח את העתיד של הילדים, אבל המרחק משתק. איך אפשר לקנות דירה בלי לראות אותה? מי ישפץ אותה כשהקבלן יבריז? ומי ירדוף אחרי השוכר בראשון לחודש כשאתם נמצאים באזור זמן אחר לגמרי? באותו רגע, הפחד מניצול או מהונאה גובר על הרצון להשקיע. הכסף נשאר בבנק ונשחק. אז רגע לפני שאתם מוותרים על החלום לדירה בארץ - עצרו רגע. אנחנו במשרד מבינים את המצוקה הזו בדיוק. כבר שנים שאנחנו משמשים כ"עיניים והידיים" של תושבי חוץ ומשקיעים.',
    image: '/images/balconies-blue-sky-clouds-part-residential-building-israel-balconies-blue-sky-clouds-part-199519995.webp',
    date: '2026-01-15',
    category: 'משקיעים זרים',
    readTime: '8 דקות קריאה',
    tags: ['השקעות נדל"ן בישראל', 'משקיעים זרים', 'ניהול נכסים', 'תושבי חוץ']
  },
  {
    id: 'selling-alone',
    title: 'למכור לבד? כשה"חיסכון" בתיווך עולה לכם עשרות אלפי שקלים',
    description: 'אין תחושה מפתה יותר מזו: החלטתם למכור את הדירה, עשיתם חישוב מהיר במחשבון, ואמרתם לעצמכם: "למה שנשלם 2% למתווך? נעלה מודעה ליד2, נראה את הבית פעמיים בשבוע, והכסף יישאר בכיס שלנו". על הנייר? זה נשמע גאוני. בין אם אתם מוכרים דירה בקרית שרת בחולון או דירת גן בבת ים, המחשבה הראשונה היא תמיד לחסוך בפועל. זה הרגע שבו הסיוט מתחיל. הטלפון לא מפסיק לצלצל בשעות לא סבירות, אנשים קובעים ולא מגיעים, אלו שכן מגיעים זורקים הערות מעליבות על הנכס שלכם, וההצעות שאתם מקבלים רחוקות שנות אור ממה שחשבתם.',
    image: '/images/69ef77086aacb86d69234e7084c060e7.jpg',
    date: '2026-01-14',
    category: 'קניה ומכירה',
    readTime: '7 דקות קריאה',
    tags: ['מכירת דירה', 'תיווך נדל"ן', 'הערכת שווי נכס', 'מכירה עצמאית']
  }
];

export const getArticle = (id: string): Article | undefined =>
  articles.find((a) => a.id === id);

// Real, licensed agency principals (see src/app/(public)/about/aboutData.ts).
// personId matches the Person @id emitted by PersonSchema on /about, so an
// article's visible/structured author links to the canonical person entity.
export interface ArticleAuthor {
  name: string;
  jobTitle: string;
  license: string;
  personId: string;
}

export const ARTICLE_AUTHORS: Record<'ram' | 'chaim', ArticleAuthor> = {
  ram: { name: 'רם מזרחי', jobTitle: 'מתווך נדל״ן מורשה ומייסד', license: '3019640', personId: 'owner-1' },
  chaim: { name: 'חיים ענבי', jobTitle: 'מתווך נדל״ן מורשה ומייסד', license: '3164492', personId: 'owner-2' },
};

// Which principal authored each guide (kept in sync with the inline author in each
// article page.tsx). Defaults to chaim if a slug is missing.
export const ARTICLE_AUTHOR_BY_SLUG: Record<string, 'ram' | 'chaim'> = {
  'home-staging': 'ram',
  'new-vs-secondhand': 'ram',
  'pre-purchase-checklist': 'ram',
  'apartment-pricing': 'ram',
  'selling-alone': 'ram',
  'holon-neighborhoods': 'chaim',
  'landlord-guide': 'chaim',
  'mortgage-guide': 'chaim',
  'first-apartment-guide': 'chaim',
  'urban-renewal-holon': 'chaim',
  'purchase-tax-guide': 'chaim',
  'foreign-investors': 'chaim',
};

export const getArticleAuthor = (id: string): ArticleAuthor =>
  ARTICLE_AUTHORS[ARTICLE_AUTHOR_BY_SLUG[id] ?? 'chaim'];
