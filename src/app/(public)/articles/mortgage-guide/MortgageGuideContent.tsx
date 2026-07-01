'use client';
import Image from 'next/image';
import { getArticle } from '@/data/articles';
import React from 'react';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ArticleByline from '@/components/SEO/ArticleByline';
import FAQ, { FAQItem } from '@/components/ui/FAQ';
import '../foreign-investors/styles.css';

export default function MortgageGuideContent() {
  const faqItems: FAQItem[] = [
    {
      question: '"מה זה אישור עקרוני וכמה זה עולה?"',
      answer: '<strong>זה בחינם — ותעשו את זה ראשון.</strong> אישור עקרוני הוא התחייבות ראשונית של הבנק לסכום שיעמיד לכם, על סמך הכנסות והתחייבויות. הוא ניתן בתוך ימים ספורים ותקף לתקופה מוגבלת. בלעדיו אתם מחפשים דירה על עיוור.'
    },
    {
      question: '"כמה הון עצמי הבנק דורש?"',
      answer: '<strong>תלוי בסטטוס שלכם.</strong> לפי הנחיות בנק ישראל: דירה ראשונה — עד 75% מימון (25% הון עצמי), משפרי דיור — עד 70%, דירה להשקעה — עד 50% בלבד.'
    },
    {
      question: '"שווה לשלם ליועץ משכנתאות?"',
      answer: '<strong>ברוב המקרים — בהחלט.</strong> יועץ טוב בונה תמהיל מותאם, מריץ מכרז בין הבנקים ומשיג ריביות שלקוח בודד לא מקבל. עלות של כמה אלפי שקלים יכולה להתגלגל לחיסכון של עשרות ומאות אלפים לאורך חיי ההלוואה.'
    }
  ];

  return (
    <div className="article-page" dir="rtl">
      <SecondaryHero
        img="/7.jpg"
        title="משכנתא בלי פאניקה: המדריך המעשי לרוכשי דירות"
        centered={true}
      />

      <Breadcrumbs />

      <div className="article-container">
        <article className="article-content">
          <div className="article-body">
            <ArticleByline id="mortgage-guide" />
            <Image
              src={getArticle('mortgage-guide')!.image}
              alt={getArticle('mortgage-guide')!.title}
              width={1200}
              height={630}
              className="article-hero-image"
              priority
            />
            {/* Introduction */}
            <section className="article-section">
              <p className="lead-paragraph">
                בשביל רוב הישראלים, משכנתא היא ההלוואה הגדולה ביותר שייקחו אי פעם — מיליון שקל ויותר, ל-20 או 30 שנה. ובכל זאת, רבים מקדישים לבחירת המשכנתא פחות זמן מאשר לבחירת המקרר לדירה החדשה.
              </p>

              <p>
                ההבדל בין תמהיל משכנתא טוב לבינוני הוא לא &quot;כמה עשיריות אחוז&quot; — הוא מאות שקלים בחודש, שמצטברים לעשרות ומאות אלפי שקלים לאורך חיי ההלוואה.
              </p>
              <p>
                במדריך הזה ריכזנו את מה שכל רוכש צריך לדעת לפני שנכנס לסניף: מה להוציא קודם, כמה הון עצמי צריך, איך עובדים המסלולים, ואיך משיגים תנאים טובים יותר. <strong>בלי ז׳רגון בנקאי — רק מה שחשוב באמת.</strong>
              </p>
            </section>

            {/* Section 1 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>הצעד הראשון: אישור עקרוני — לפני שמחפשים דירה</h2>
              <div className="definition-block">
                <p><span className="definition-term">אישור עקרוני למשכנתא</span> הוא התחייבות ראשונית (ולא סופית) של הבנק להעמיד לכם סכום הלוואה מוגדר, על בסיס ההכנסות, ההתחייבויות וההיסטוריה הפיננסית שלכם. הוא ניתן בחינם, מתקבל בתוך ימים ספורים, תקף לתקופה מוגבלת, ואינו מחייב אתכם לקחת את המשכנתא דווקא באותו בנק.</p>
              </div>
              <p>
                אישור עקרוני הוא מסמך שבו הבנק מתחייב עקרונית לסכום ההלוואה, על בסיס ההכנסות, ההתחייבויות וההיסטוריה הפיננסית שלכם. הוא בחינם, מתקבל בתוך ימים, ולא מחייב אתכם לקחת את המשכנתא דווקא באותו בנק.
              </p>
              <p>
                למה זה קריטי? כי הוא הופך את התקציב שלכם ממשאלת לב למספר אמיתי. הוא גם משדר למוכרים שאתם קונים רציניים — יתרון של ממש במשא ומתן על <Link href="/apartments?dealType=sale">דירות מבוקשות בחולון</Link>.
              </p>
            </section>

            {/* Section 2 */}
            <figure className="article-inline-figure">
              <Image src="/images/articles/inbody/mortgage-guide-a.jpg" alt={getArticle('mortgage-guide')!.title} width={1200} height={675} className="article-inline-image" />
            </figure>
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>כמה הון עצמי צריך? המספרים של בנק ישראל</h2>
              <p>
                אחוז המימון המרבי (LTV) שבנק רשאי להעמיד נקבע בהוראת ניהול בנקאי תקין 329 של בנק ישראל, לפי סוג הרוכש. ההון העצמי המינימלי הוא ההשלמה ל-100%:
              </p>

              <div className="geo-table-wrap">
                <table className="geo-table">
                  <caption>אחוזי מימון מרביים והון עצמי מינימלי לפי סוג רוכש</caption>
                  <thead>
                    <tr>
                      <th>סוג רוכש</th>
                      <th>אחוז מימון מרבי</th>
                      <th>הון עצמי מינימלי</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>דירה יחידה (ראשונה)</td>
                      <td>75%</td>
                      <td>25%</td>
                    </tr>
                    <tr>
                      <td>משפר דיור</td>
                      <td>70%</td>
                      <td>30%</td>
                    </tr>
                    <tr>
                      <td>דירה להשקעה / נוספת</td>
                      <td>50%</td>
                      <td>50%</td>
                    </tr>
                  </tbody>
                </table>
                <span className="source-note">מקור: <a href="https://www.boi.org.il" target="_blank" rel="noopener noreferrer">בנק ישראל</a>, הוראת ניהול בנקאי תקין 329 (מגבלות הלוואות לדיור).</span>
              </div>

              <p>
                חשוב לזכור: אלה התקרות הרגולטוריות. בנוסף לאחוז המימון, אותה הוראה (329) מגבילה גם את <strong>יחס ההחזר להכנסה</strong>: ההחזר החודשי לא יעלה על 50% מההכנסה הפנויה, וכאשר הוא חוצה את רף ה-40% הבנק נדרש לשקלל את ההלוואה במשקל סיכון מוגבר. בפועל, כדי לישון טוב בלילה, כדאי לשאוף לשליש מההכנסה לכל היותר.
              </p>
            </section>

            {/* Section 3 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>מסלולי המשכנתא — המדריך המקוצר</h2>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>ריבית פריים</h3>
              <p>
                צמודה לריבית בנק ישראל. זולה יחסית וגמישה לפירעון מוקדם, אבל ההחזר החודשי עולה ויורד עם הריבית במשק — מי שלקח פריים גבוה ב-2021 הרגיש את זה היטב ב-2023.
              </p>
              <p>
                הנוסחה קבועה ושקופה: <strong>ריבית פריים = ריבית בנק ישראל + 1.5%</strong>. כלומר כל שינוי בריבית בנק ישראל מגלגל מיד שינוי זהה בריבית הפריים — ובהחזר החודשי שלכם על רכיב זה.
              </p>
              <span className="source-note">מקור: <a href="https://www.boi.org.il" target="_blank" rel="noopener noreferrer">בנק ישראל</a>.</span>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>ריבית קבועה לא צמודה (קל״צ)</h3>
              <p>
                ההחזר קבוע וידוע מראש עד סוף התקופה — שקט נפשי מוחלט. המחיר: ריבית התחלתית גבוהה יותר ועמלת פירעון מוקדם אפשרית.
              </p>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>ריבית קבועה / משתנה צמודת מדד</h3>
              <p>
                הריבית נמוכה יותר על הנייר, אבל הקרן צמודה למדד המחירים לצרכן — באינפלציה גבוהה החוב &quot;מתנפח&quot; גם כשמשלמים כל חודש.
              </p>
              <p>
                <strong>השורה התחתונה:</strong> אין מסלול &quot;הכי טוב&quot; — יש תמהיל נכון לפרופיל שלכם: גיל, יציבות הכנסה, תוכניות למכור או לפרוע מוקדם, וסיבולת סיכון.
              </p>
            </section>

            {/* Section 4 */}
            <figure className="article-inline-figure">
              <Image src="/images/articles/inbody/mortgage-guide-b.jpg" alt={getArticle('mortgage-guide')!.title} width={1200} height={675} className="article-inline-image" />
            </figure>
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>איך משיגים תנאים טובים יותר?</h2>
              <p>
                <strong>1. תתמקחו — תמיד.</strong> ההצעה הראשונה של הבנק היא נקודת פתיחה, לא מחיר סופי. קחו הצעות מ-3 בנקים לפחות ותנו להם להתחרות.
              </p>
              <p>
                <strong>2. סדרו את התיק הפיננסי.</strong> סגרו מינוס והלוואות קטנות לפני הבקשה — הם פוגעים ביחס ההחזר שהבנק מחשב.
              </p>
              <p>
                <strong>3. שקלו יועץ משכנתאות.</strong> אנחנו עובדים צמוד עם <a href="https://avi-mashkanta.com" target="_blank" rel="noopener" className="text-[#1c3664] underline decoration-[#c5a357] underline-offset-2 hover:text-[#c5a357]">אבי בוקעי (&quot;אבי — הבית למשכנתאות&quot;)</a>, שמלווה את הלקוחות שלנו משלב האישור העקרוני ועד החתימה — ויודע בדיוק איפה אפשר ללחוץ.
              </p>
              <p>
                <strong>4. אל תמתחו את התקציב לקצה.</strong> השאירו כרית ביטחון. דירה קצת יותר צנועה עם שינה טובה בלילה מנצחת דירה גדולה עם החזר שחונק.
              </p>
              <p>
                מתכננים את הרכישה הראשונה? המשיכו ל<Link href="/articles/first-apartment-guide">מדריך המלא לרוכשי דירה ראשונה</Link>. ועוד שאלות על משכנתא ותהליך הרכישה? ריכזנו את התשובות ב<Link href="/faq">עמוד השאלות והתשובות</Link>.
              </p>
            </section>

            {/* FAQ */}
            <FAQ items={faqItems} />
          </div>
        </article>
      </div>
    </div>
  );
}
