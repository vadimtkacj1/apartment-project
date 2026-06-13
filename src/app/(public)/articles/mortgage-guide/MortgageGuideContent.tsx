'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
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
            {/* Introduction */}
            <section className="article-section">
              <p className="lead-paragraph">
                בשביל רוב הישראלים, משכנתא היא ההלוואה הגדולה ביותר שייקחו אי פעם — מיליון שקל ויותר, ל-20 או 30 שנה. ובכל זאת, רבים מקדישים לבחירת המשכנתא פחות זמן מאשר לבחירת המקרר לדירה החדשה.
              </p>

              <div className="content-flex-layout">
                <div className="text-column">
                  <p>
                    ההבדל בין תמהיל משכנתא טוב לבינוני הוא לא &quot;כמה עשיריות אחוז&quot; — הוא מאות שקלים בחודש, שמצטברים לעשרות ומאות אלפי שקלים לאורך חיי ההלוואה.
                  </p>
                  <p>
                    במדריך הזה ריכזנו את מה שכל רוכש צריך לדעת לפני שנכנס לסניף: מה להוציא קודם, כמה הון עצמי צריך, איך עובדים המסלולים, ואיך משיגים תנאים טובים יותר. <strong>בלי ז׳רגון בנקאי — רק מה שחשוב באמת.</strong>
                  </p>
                </div>
                <div className="image-column">
                  <Image src="/images/articles/mortgage.jpg" alt="תכנון משכנתא לדירה" width={600} height={450} loading="lazy" sizes="(max-width: 768px) 100vw, 45vw" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              </div>
            </section>

            {/* Section 1 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>הצעד הראשון: אישור עקרוני — לפני שמחפשים דירה</h2>
              <p>
                אישור עקרוני הוא מסמך שבו הבנק מתחייב עקרונית לסכום ההלוואה, על בסיס ההכנסות, ההתחייבויות וההיסטוריה הפיננסית שלכם. הוא בחינם, מתקבל בתוך ימים, ולא מחייב אתכם לקחת את המשכנתא דווקא באותו בנק.
              </p>
              <p>
                למה זה קריטי? כי הוא הופך את התקציב שלכם ממשאלת לב למספר אמיתי. הוא גם משדר למוכרים שאתם קונים רציניים — יתרון של ממש במשא ומתן על <Link href="/apartments?dealType=sale">דירות מבוקשות בחולון</Link>.
              </p>
            </section>

            {/* Section 2 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>כמה הון עצמי צריך? המספרים של בנק ישראל</h2>
              <p>
                <strong>דירה ראשונה (יחידה):</strong> מימון של עד 75% משווי הדירה — כלומר לפחות 25% הון עצמי.
              </p>
              <p>
                <strong>משפרי דיור:</strong> עד 70% מימון.
              </p>
              <p>
                <strong>דירה להשקעה:</strong> עד 50% מימון בלבד.
              </p>
              <p>
                חשוב לזכור: אלה התקרות הרגולטוריות. הבנק בוחן גם את יחס ההחזר להכנסה — ההחזר החודשי לא יעלה בדרך כלל על 40% מההכנסה הפנויה, ובפועל כדאי לשאוף לשליש לכל היותר.
              </p>
            </section>

            {/* Section 3 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>מסלולי המשכנתא — המדריך המקוצר</h2>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>ריבית פריים</h3>
              <p>
                צמודה לריבית בנק ישראל. זולה יחסית וגמישה לפירעון מוקדם, אבל ההחזר החודשי עולה ויורד עם הריבית במשק — מי שלקח פריים גבוה ב-2021 הרגיש את זה היטב ב-2023.
              </p>
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
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>איך משיגים תנאים טובים יותר?</h2>
              <p>
                <strong>1. תתמקחו — תמיד.</strong> ההצעה הראשונה של הבנק היא נקודת פתיחה, לא מחיר סופי. קחו הצעות מ-3 בנקים לפחות ותנו להם להתחרות.
              </p>
              <p>
                <strong>2. סדרו את התיק הפיננסי.</strong> סגרו מינוס והלוואות קטנות לפני הבקשה — הם פוגעים ביחס ההחזר שהבנק מחשב.
              </p>
              <p>
                <strong>3. שקלו יועץ משכנתאות.</strong> אנחנו עובדים צמוד עם אבי בוקעי (&quot;אבי — הבית למשכנתאות&quot;), שמלווה את הלקוחות שלנו משלב האישור העקרוני ועד החתימה — ויודע בדיוק איפה אפשר ללחוץ.
              </p>
              <p>
                <strong>4. אל תמתחו את התקציב לקצה.</strong> השאירו כרית ביטחון. דירה קצת יותר צנועה עם שינה טובה בלילה מנצחת דירה גדולה עם החזר שחונק.
              </p>
              <p>
                מתכננים את הרכישה הראשונה? המשיכו ל<Link href="/articles/first-apartment-guide">מדריך המלא לרוכשי דירה ראשונה</Link>.
              </p>
            </section>

            {/* FAQ */}
            <FAQ items={faqItems} />
          </div>
        </article>
      </div>

      <style jsx>{`
        .content-flex-layout {
          display: flex;
          gap: 40px;
          align-items: flex-start;
          margin: 30px 0;
        }
        .content-flex-layout.reverse {
          flex-direction: row-reverse;
        }
        .text-column {
          flex: 1.3;
        }
        .image-column {
          flex: 1.2;
        }
        @media (max-width: 768px) {
          .content-flex-layout, .content-flex-layout.reverse {
            flex-direction: column;
          }
          .image-column {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
