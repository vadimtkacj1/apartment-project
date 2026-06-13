import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import './articles.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export const metadata: Metadata = {
  title: 'מאמרים ומדריכים | נדל״ן בחולון',
  description: 'מדריכים מקצועיים בנושאי נדל״ן: רכישת דירה בישראל עבור תושבי חוץ, מכירת דירה עם מתווך לעומת עצמאית, ועוד טיפים ממומחי רם נכסים.',
  alternates: {
    canonical: `${siteUrl}/articles`,
  },
  openGraph: {
    title: 'מאמרים ומדריכים | נדל״ן בחולון',
    description: 'מדריכים מקצועיים בנושאי נדל״ן מאת צוות רם נכסים חיים ענבי.',
    url: `${siteUrl}/articles`,
  },
};

interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
}

const articles: Article[] = [
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

export default function ArticlesPage() {
  return (
    <div className="articles-page" dir="rtl">
      <BreadcrumbSchema items={[{ name: 'מאמרים', path: '/articles' }]} />
      <SecondaryHero
        img="/7.jpg"
        title="מאמרים ומדריכים"
        centered={true}
      />
      <Breadcrumbs />
      <div className="articles-container">
        <div className="articles-grid">
          {articles.map((article, index) => (
            <article key={article.id} className="article-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="card-accent"></div>
              <Link href={`/articles/${article.id}`} className="article-image-container">
                <div className="image-overlay"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="article-image"
                  loading="lazy"
                />
                <span className="category-badge">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="badge-icon">
                    <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {article.category}
                </span>
              </Link>
              <div className="article-content">
                <div className="article-meta">
                  <span className="article-date">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="meta-icon">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M7 3.5V7L9.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {new Date(article.date).toLocaleDateString('he-IL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="separator">•</span>
                  <span className="read-time">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="meta-icon">
                      <path d="M2 3h10a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M4 1v2M10 1v2M1 6h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {article.readTime}
                  </span>
                </div>
                <h2 className="article-title">
                  <Link href={`/articles/${article.id}`}>
                    {article.title}
                  </Link>
                </h2>
                <p className="article-description">
                  {article.description}
                </p>
                <div className="article-tags">
                  {article.tags.map((tag, i) => (
                    <span key={i} className="tag">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="tag-icon">
                        <path d="M2 2L6 1L10 2L11 6L10 10L6 11L2 10L1 6L2 2Z" stroke="currentColor" strokeWidth="1"/>
                      </svg>
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/articles/${article.id}`} className="read-more">
                  <span>קרא עוד</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="arrow-icon">
                    <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
