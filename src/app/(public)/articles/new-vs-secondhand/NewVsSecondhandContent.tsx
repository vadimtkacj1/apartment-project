'use client';
import Image from 'next/image';
import { getArticle } from '@/data/articles';
import React from 'react';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ArticleByline from '@/components/SEO/ArticleByline';
import FAQ, { FAQItem } from '@/components/ui/FAQ';
import ArticleToc from '../ArticleToc';
import ArticleCta from '../ArticleCta';
import RelatedArticles from '../RelatedArticles';
import '../foreign-investors/styles.css';

export default function NewVsSecondhandContent() {
  const faqItems: FAQItem[] = [
    {
      question: '"מה זה מדד תשומות הבנייה ולמה זה מייקר את הדירה?"',
      answer: '<strong>זו ההצמדה שאף משווק לא מבליט.</strong> בחוזה מקבלן, יתרת התשלומים צמודה למדד תשומות הבנייה. כשהמדד עולה — החוב שלכם גדל. בתקופות התייקרות, ההצמדה מוסיפה עשרות אלפי שקלים למחיר שסגרתם &quot;סופית&quot;.'
    },
    {
      question: '"דירה יד שנייה באמת זולה יותר?"',
      answer: '<strong>בדרך כלל כן — והמחיר סגור.</strong> על אותו מספר חדרים באותו אזור, יד שנייה תעלה פחות, בלי הצמדות ובלי הפתעות. מנגד, חשבו על שיפוץ והתאמה. ההשוואה הנכונה היא על העלות הכוללת: מחיר + הצמדות + שיפוץ + נלוות.'
    },
    {
      question: '"איך בודקים שהקבלן אמין לפני שקונים על הנייר?"',
      answer: '<strong>בודקים עבר, לא הבטחות.</strong> פרויקטים קודמים ועמידה בלוחות זמנים, איתנות פיננסית, ערבויות חוק המכר על כל שקל, ומה אומרים דיירים שכבר קיבלו מפתח. אנחנו מכירים את היזמים הפעילים באזור — ויודעים על מי אפשר לסמוך.'
    }
  ];

  return (
    <div className="article-page" dir="rtl">
      <SecondaryHero
        img="/7.jpg"
        title="קבלן או יד שנייה? ההשוואה שאף משווק לא יעשה לכם"
        centered={true}
      />

      <Breadcrumbs />

      <div className="article-container">
        <article className="article-content">
          <div className="article-body">
            <ArticleByline id="new-vs-secondhand" />
            <Image
              src={getArticle('new-vs-secondhand')!.image}
              alt={getArticle('new-vs-secondhand')!.title}
              width={1200}
              height={630}
              className="article-hero-image"
              priority
            />
            {/* Introduction */}
            <section className="article-section">
              <p className="lead-paragraph">
                מצד אחד: דירה חדשה ונוצצת מקבלן, עם ממ״ד, מרפסת שמש ולובי ממוזג — ומשרד מכירות שמגיש קפה ומבטיח עולם. מצד שני: דירה יד שנייה בשכונה ותיקה, עם עצים ברחוב, שכנים שכבר מכירים — ומחיר שסגור היום. אז מה באמת משתלם יותר?
              </p>

              <p>
                זו אחת השאלות הנפוצות שאנחנו מקבלים, והתשובה הכנה היא: תלוי — בתקציב, בלוח הזמנים שלכם, וביכולת שלכם לספוג הפתעות.
              </p>
              <p>
                מה שבטוח: ההחלטה לא צריכה להתקבל במשרד מכירות מעוצב, מול הדמיה ממוחשבת. <strong>הנה ההשוואה המלאה — כולל הסעיפים הקטנים שמשנים את התמונה.</strong>
              </p>
            </section>

            <ArticleToc />

            {/* Section 1 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>היתרונות האמיתיים של דירה מקבלן</h2>
              <p>
                <strong>סטנדרט בנייה עכשווי</strong> — ממ״ד, בידוד אקוסטי ותרמי, חניון, מעלית, ותשתיות חכמות. דברים שבדירה ישנה עולים הון להוסיף.
              </p>
              <p>
                <strong>אפס תחזוקה בשנים הראשונות</strong> — הכול חדש, והקבלן אחראי לתיקון ליקויים בתקופת הבדק לפי חוק המכר.
              </p>
              <p>
                <strong>פריסת תשלומים</strong> — ברכישה על הנייר משלמים בהדרגה לפי קצב הבנייה, מה שנותן זמן להתארגן.
              </p>
              <p>
                <strong>התאמה אישית</strong> — בשלבי בנייה מוקדמים אפשר לשנות פריסה, לבחור ריצוף ומטבח.
              </p>
            </section>

            {/* Section 2 */}
            <figure className="article-inline-figure">
              <Image src="/images/articles/inbody/new-vs-secondhand-a.jpg" alt={getArticle('new-vs-secondhand')!.title} width={1200} height={675} className="article-inline-image" />
            </figure>
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>החסרונות שלא מספרים לכם במשרד המכירות</h2>
              <p>
                <strong>מדד תשומות הבנייה</strong> — יתרת התשלומים צמודה למדד, וכשהוא עולה, המחיר &quot;הסגור&quot; שלכם גדל בעשרות אלפי שקלים. את זה מגלים בקטנות, בעמוד 47 של החוזה.
              </p>
              <div className="definition-block">
                <p><span className="definition-term">מדד תשומות הבנייה</span> הוא מדד שמפרסמת הלשכה המרכזית לסטטיסטיקה (הלמ״ס) ומשקף את השינוי בעלויות חומרי הגלם והעבודה בענף הבנייה. בחוזה רכישה מקבלן הצמוד למדד, יתרת התשלומים גדלה ככל שהמדד עולה לאורך תקופת הבנייה — כך שהמחיר ה&quot;סופי&quot; אינו באמת סופי. להמחשה: בין ינואר 2025 לינואר 2026 עלה המדד בכ-2.5%.</p>
              </div>
              <p><span className="source-note">מקור: הלשכה המרכזית לסטטיסטיקה (הלמ״ס), cbs.gov.il.</span></p>
              <p>
                <strong>איחורים במסירה</strong> — נפוצים מאוד. אם אתם משלמים שכירות במקביל, כל חודש איחור הוא הוצאה כפולה.
              </p>
              <p>
                <strong>הפער בין ההדמיה למציאות</strong> — &quot;נוף לפארק&quot; שהופך לנוף למגדל הבא, מפרט טכני שמתפרש לטובת הקבלן.
              </p>
              <p>
                <strong>שכונה בהתהוות</strong> — גרים באתר בנייה: אבק, רעש, ובלי גינות, גני ילדים ומסחר — לפעמים שנים.
              </p>
              <p>
                <strong>עלויות שמתווספות</strong> — מחסן וחניה בתשלום נפרד, שדרוגים, וחיבורים. המחיר בפרסום הוא כמעט אף פעם לא המחיר הסופי.
              </p>
            </section>

            {/* Section 3 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>היתרונות השקטים של יד שנייה</h2>
              <p>
                <strong>מה שרואים זה מה שמקבלים</strong> — הדירה קיימת. אפשר לבדוק רטיבות, לשמוע את הרעש מהכביש, לפגוש את השכנים, ולעשות <Link href="/articles/pre-purchase-checklist">בדק בית מקצועי</Link> לפני חתימה.
              </p>
              <p>
                <strong>מחיר סגור — ולרוב נמוך יותר</strong> — בלי הצמדות למדד. אותו תקציב משיג בדרך כלל יותר חדרים או מיקום טוב יותר.
              </p>
              <p>
                <strong>מיקום מבוסס</strong> — שכונות ותיקות נבנו סביב החיים: בתי ספר, גינות, מסחר ותחבורה כבר שם, לא &quot;בתוכנית&quot;.
              </p>
              <p>
                <strong>כניסה מיידית</strong> — מפתח תוך חודשים, לא שנים. ופוטנציאל: דירה ישנה בבניין שמיועד ל<Link href="/articles/urban-renewal-holon">התחדשות עירונית</Link> יכולה להיות ההשקעה החכמה באמת.
              </p>
            </section>

            {/* Comparison table */}
            <figure className="article-inline-figure">
              <Image src="/images/articles/inbody/new-vs-secondhand-b.jpg" alt={getArticle('new-vs-secondhand')!.title} width={1200} height={675} className="article-inline-image" />
            </figure>
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>טבלת השוואה: דירה מקבלן מול יד שנייה</h2>
              <div className="geo-table-wrap">
                <table className="geo-table">
                  <caption>השוואה בין דירה מקבלן לדירה יד שנייה לפי שיקולי הרכישה המרכזיים</caption>
                  <thead>
                    <tr>
                      <th>שיקול</th>
                      <th>דירה מקבלן</th>
                      <th>דירה יד שנייה</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>מחיר ותשלום</td>
                      <td>תשלום בפריסה לפי קצב הבנייה; מחיר הבסיס עשוי לגדול עקב הצמדה</td>
                      <td>מחיר סגור וידוע מראש, לרוב נמוך יותר על אותו מפרט ואזור</td>
                    </tr>
                    <tr>
                      <td>הצמדה למדד תשומות הבנייה</td>
                      <td>יתרת התשלומים צמודה למדד; עלייה במדד מגדילה את החוב במהלך הבנייה</td>
                      <td>אין הצמדה — המחיר נסגר במועד החתימה</td>
                    </tr>
                    <tr>
                      <td>מועד כניסה</td>
                      <td>כניסה עתידית, תלוית קצב בנייה; עלולים להיות איחורים במסירה</td>
                      <td>כניסה מהירה — תוך חודשים, לא שנים</td>
                    </tr>
                    <tr>
                      <td>מצב ותחזוקה</td>
                      <td>חדש; תחזוקה מינימלית בשנים הראשונות</td>
                      <td>ייתכן צורך בשיפוץ והתאמה; ניתן לבדוק את מצב הנכס בפועל לפני קנייה</td>
                    </tr>
                    <tr>
                      <td>התאמה אישית</td>
                      <td>בשלבי בנייה מוקדמים אפשר לשנות פריסה, ריצוף ומטבח</td>
                      <td>מקבלים את הקיים; שינויים מהותיים דורשים שיפוץ</td>
                    </tr>
                    <tr>
                      <td>אחריות / חוק המכר</td>
                      <td>תקופת בדק ואחריות לתיקון ליקויים; כספי הרוכש מובטחים בערבות לפי חוק המכר (דירות) (הבטחת השקעות של רוכשי דירות), תשל״ה-1974</td>
                      <td>ללא ערבות יזם ותקופת בדק; חיוני לבצע בדיקה משפטית ובדק בית לפני חתימה</td>
                    </tr>
                  </tbody>
                </table>
                <span className="source-note">השוואה איכותית; שם החוק לפי לשון החקיקה. ההשוואה הכספית המלאה תלויה בנכס הספציפי.</span>
              </div>
            </section>

            {/* Section 4 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>אז מה בוחרים? השורה התחתונה שלנו</h2>
              <p>
                <strong>בחרו קבלן אם:</strong> חשוב לכם חדש ומודרני, יש לכם גמישות בלוח הזמנים ובתקציב לספוג הצמדות ואיחורים, ואתם קונים מיזם מבוסס עם ערבויות מלאות.
              </p>
              <p>
                <strong>בחרו יד שנייה אם:</strong> אתם צריכים ודאות — במחיר, במועד הכניסה ובסביבה. ובמיוחד אם המיקום חשוב לכם יותר מהריצוף.
              </p>
              <p>
                ובכל מקרה — אל תשוו &quot;מחיר מודעה מול מחיר מודעה&quot;. השוו עלות כוללת: מחיר + הצמדות + שיפוץ + עלויות נלוות + שכירות בתקופת ההמתנה. אנחנו עושים את החישוב הזה עם הלקוחות שלנו על כל נכס.
              </p>
              <p>
                רוצים לראות מה יש בשוק עכשיו? <Link href="/apartments?dealType=sale">כל הדירות למכירה אצלנו</Link> — חדשות ויד שנייה, עם ליווי מלא בכל מסלול.
              </p>
            </section>

            {/* FAQ */}
            <FAQ items={faqItems} />

            {/* End CTA + related guides (shared components) */}
            <ArticleCta articleId="new-vs-secondhand" />
            <RelatedArticles currentId="new-vs-secondhand" />
          </div>
        </article>
      </div>
    </div>
  );
}
