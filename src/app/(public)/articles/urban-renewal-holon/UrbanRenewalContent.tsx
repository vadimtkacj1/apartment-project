'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ArticleByline from '@/components/SEO/ArticleByline';
import FAQ, { FAQItem } from '@/components/ui/FAQ';
import '../foreign-investors/styles.css';

export default function UrbanRenewalContent() {
  const faqItems: FAQItem[] = [
    {
      question: '"מה ההבדל בין פינוי-בינוי לתמ״א 38?"',
      answer: '<strong>בקצרה: היקף.</strong> בפינוי-בינוי הורסים מתחם שלם ובונים שכונה חדשה — הדיירים מקבלים דירה חדשה לגמרי. בתמ״א 38 מחזקים את הבניין הקיים ומוסיפים קומות וממ״דים, או הורסים ובונים אותו מחדש (תמ״א 38/2).'
    },
    {
      question: '"כמה זמן לוקח פרויקט פינוי-בינוי?"',
      answer: '<strong>סבלנות היא שם המשחק.</strong> מהחתימה הראשונה ועד קבלת מפתח לדירה החדשה עוברות בממוצע 8–15 שנים. לכן חשוב להבין: מי שקונה דירה במתחם מיועד — קונה אופציה לטווח ארוך, לא רווח מהיר.'
    },
    {
      question: '"יש לי דירה בבניין שמיועד לפינוי-בינוי. למכור עכשיו או לחכות?"',
      answer: '<strong>תלוי בשלב של הפרויקט.</strong> ככל שהפרויקט מתקדם (חתימות, הפקדת תוכנית, היתר), שווי הדירה עולה. לפעמים שווה למכור באמצע הדרך ולקבל פרמיה בלי לחכות עשור. אנחנו נשמח לתת לכם הערכת שווי עדכנית — בלי התחייבות.'
    }
  ];

  return (
    <div className="article-page" dir="rtl">
      <SecondaryHero
        img="/7.jpg"
        title="התחדשות עירונית בחולון: ההזדמנות שמתחת לאף"
        centered={true}
      />

      <Breadcrumbs />

      <div className="article-container">
        <article className="article-content">
          <div className="article-body">
            <ArticleByline id="urban-renewal-holon" />
            {/* Introduction */}
            <section className="article-section">
              <p className="lead-paragraph">
                כל מי שמסתובב בחולון בשנים האחרונות רואה את זה במו עיניו: מנופים בג׳סי כהן, שלטי &quot;כאן ייבנה&quot; בתל גיבורים, ובניינים בני 60 שנה שמפנים את מקומם למגדלים חדשים. ההתחדשות העירונית כבר לא תיאוריה — היא משנה את פני העיר, ואת מחירי הדירות יחד איתה.
              </p>

              <div className="content-flex-layout">
                <div className="text-column">
                  <p>
                    בשביל בעלי דירות ותיקים מדובר בהזדמנות של פעם בחיים: דירה ישנה בת 3 חדרים יכולה להפוך לדירה חדשה עם ממ״ד, מרפסת ומעלית — בלי לשלם שקל. בשביל קונים ומשקיעים, זו דרך לקנות היום במחיר של &quot;ישן&quot; ולקבל בעתיד נכס חדש.
                  </p>
                  <p>
                    אבל בין ההבטחה למציאות יש פערים: פרויקטים שנתקעים, יזמים שנעלמים, והסכמים שכובלים דיירים לשנים. <strong>אחרי 24 שנים בשטח של חולון, אנחנו מכירים כל מתחם — ויודעים להבדיל בין הזדמנות אמיתית לחלום באספמיה.</strong>
                  </p>
                </div>
                <div className="image-column">
                  <Image src="/images/articles/urban-renewal.jpg" alt="התחדשות עירונית ובנייה בחולון" width={600} height={450} loading="lazy" sizes="(max-width: 768px) 100vw, 45vw" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              </div>
            </section>

            {/* Section 1 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>פינוי-בינוי: שכונה שלמה נולדת מחדש</h2>
              <p>
                בפינוי-בינוי, יזם מחתים את דיירי מתחם שלם של בניינים ישנים. הדיירים מתפנים לדיור חלופי (על חשבון היזם), הבניינים נהרסים, ובמקומם קמה שכונה חדשה. כל דייר מקבל דירה חדשה — בדרך כלל גדולה יותר, עם ממ״ד, מרפסת וחניה.
              </p>
              <p>
                <strong>היתרון הגדול:</strong> שדרוג מלא של איכות החיים והנכס, ללא עלות לדייר.
              </p>
              <p>
                <strong>האתגר:</strong> תהליך ארוך — בממוצע 8 עד 15 שנים מהחתימות ועד המפתח — שתלוי בהסכמת רוב הדיירים, באישורי תכנון ובחוסן הכלכלי של היזם.
              </p>
            </section>

            {/* Section 2 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>תמ״א 38: השדרוג של הבניין הבודד</h2>
              <p>
                תוכנית מתאר ארצית 38 נולדה כדי לחזק מבנים ישנים מפני רעידות אדמה. בפועל היא הפכה למנוע התחדשות לבניינים בודדים, בשני מסלולים:
              </p>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>תמ״א 38/1 — חיזוק ותוספת</h3>
              <p>
                הבניין הקיים מחוזק, נוספים לו ממ״דים, מרפסות ומעלית, והיזם מקבל בתמורה זכויות לבנות קומות נוספות. הדיירים נשארים בדירותיהם במהלך העבודות.
              </p>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>תמ״א 38/2 — הריסה ובנייה מחדש</h3>
              <p>
                הבניין נהרס ונבנה מחדש מהיסוד. הדיירים מקבלים דירה חדשה לחלוטין בבניין חדש — מסלול שדומה במהותו לפינוי-בינוי, אבל בקנה מידה של בניין אחד ולוחות זמנים קצרים יותר.
              </p>
            </section>

            {/* Section 3 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>איפה זה קורה בחולון?</h2>
              <p>
                <strong>ג׳סי כהן</strong> — חלוצת ההתחדשות של חולון. במתחמים שונים בשכונה מקודמים פרויקטים של אלפי יחידות דיור חדשות. מי שקנה שם לפני עשור — הכפיל את כספו.
              </p>
              <p>
                <strong>תל גיבורים</strong> — הקרבה לתל אביב ולפארק החולות הופכת את השכונה למוקד ביקוש, עם מתחמי התחדשות בשלבי קידום.
              </p>
              <p>
                <strong>קרית שרת ומרכז העיר</strong> — בניינים ותיקים רבים מתאימים לתמ״א 38, ופרויקטים נקודתיים צצים בכל שנה.
              </p>
              <p>
                העירייה מקדמת גם תוכניות מתאר שמגדילות זכויות בנייה לאורך צירים מרכזיים — מה שמייצר עוד ועוד מתחמים פוטנציאליים.
              </p>
            </section>

            {/* Section 4 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>מה זה אומר לבעלי דירות — ולמשקיעים?</h2>
              <p>
                <strong>לבעלי דירה במתחם מתחדש:</strong> שווי הנכס שלכם עולה עם כל שלב שהפרויקט עובר — חתימות, הפקדת תוכנית, היתר בנייה. לפני שאתם חותמים ליזם או מוכרים, בדקו באיזה שלב נמצא המתחם שלכם. ההבדל במחיר יכול להגיע למאות אלפי שקלים.
              </p>
              <p>
                <strong>למשקיעים:</strong> רכישת דירה ישנה במתחם מיועד היא אסטרטגיה מוכרת — קונים נכס מניב היום, ומקבלים דירה חדשה בעתיד. אבל היא דורשת בדיקה מעמיקה: לא כל מתחם &quot;מיועד&quot; באמת יוצא לדרך. אצלנו תקבלו תמונת מצב אמיתית, לא סיפורי מכירות.
              </p>
              <p>
                רוצים לדעת מה קורה במתחם שלכם, או מחפשים הזדמנות השקעה? <Link href="/apartments">צפו בדירות שלנו בחולון</Link> או קראו על <Link href="/articles/holon-neighborhoods">השכונות של חולון</Link>.
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
