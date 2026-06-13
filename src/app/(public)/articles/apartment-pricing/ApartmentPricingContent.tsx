'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/ui/FAQ';
import '../foreign-investors/styles.css';

export default function ApartmentPricingContent() {
  const faqItems: FAQItem[] = [
    {
      question: '"איך אני יודע כמה הדירה שלי שווה באמת?"',
      answer: '<strong>משלבים שלושה מקורות.</strong> עסקאות אמת באזור (אתר רשות המיסים), שמאי מקרקעין מוסמך, והערכה של מתווך מקומי שמכיר את הביקושים החיים בשטח. כל מקור לבד — חלקי. השילוב — מדויק.'
    },
    {
      question: '"למה לא לפרסם גבוה וליתר ביטחון לרדת אחר כך?"',
      answer: '<strong>כי השוק זוכר.</strong> דירה שמפורסמת במחיר מנופח לא מקבלת פניות, &quot;נשרפת&quot; בלוחות, ואחרי חודשיים הקונים מתייחסים אליה כאל נכס בעייתי — ומציעים פחות מהשווי האמיתי.'
    },
    {
      question: '"השכן מכר ב-X. למה הדירה שלי מוערכת בפחות?"',
      answer: '<strong>כי אין שתי דירות זהות.</strong> קומה, מצב תחזוקתי, כיווני אוויר, מרפסת, חניה — כל אחד מאלה משנה את המחיר בעשרות אלפי שקלים. וגם: המחיר שהשכן &quot;ביקש&quot; הוא לא המחיר שבו העסקה נסגרה בפועל.'
    }
  ];

  return (
    <div className="article-page" dir="rtl">
      <SecondaryHero
        img="/7.jpg"
        title="כמה שווה הדירה שלכם באמת? המדריך לתמחור נכון"
        centered={true}
      />

      <Breadcrumbs />

      <div className="article-container">
        <article className="article-content">
          <div className="article-body">
            {/* Introduction */}
            <section className="article-section">
              <p className="lead-paragraph">
                זו השאלה הראשונה של כל מוכר דירה — וגם הטעות הראשונה. רוב המוכרים קובעים את המחיר לפי מה ש&quot;השכן ביקש&quot;, לפי כתבה בעיתון, או לפי הסכום שהם צריכים לדירה הבאה. אף אחד מהשלושה הוא לא שווי השוק של הדירה.
              </p>

              <div className="content-flex-layout">
                <div className="text-column">
                  <p>
                    תמחור הוא ההחלטה הקריטית ביותר בכל עסקת מכירה. מחיר נמוך מדי — והפסדתם כסף שמגיע לכם. מחיר גבוה מדי — והדירה &quot;תישרף&quot; בשוק ותימכר בסוף בפחות ממה שהייתה שווה ביום הראשון.
                  </p>
                  <p>
                    אחרי אלפי עסקאות בחולון, בת ים וראשון לציון, אנחנו יכולים להגיד בביטחון: <strong>ההבדל בין תמחור נכון לשגוי הוא בממוצע 5%–10% ממחיר הדירה.</strong> על דירה של 2 מיליון ש״ח — זה עד 200,000 ש״ח.
                  </p>
                </div>
                <div className="image-column">
                  <Image src="/images/articles/apartment-pricing.jpg" alt="הערכת שווי דירה למכירה" width={600} height={450} loading="lazy" sizes="(max-width: 768px) 100vw, 45vw" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              </div>
            </section>

            {/* Section 1 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>מה באמת קובע את שווי הדירה?</h2>
              <p>
                <strong>מיקום, מיקום, מיקום</strong> — הקלישאה נכונה. אותה דירה בדיוק שווה אחרת בקרית שרת, בנאות שושנים או בג׳סי כהן. גם בתוך שכונה, רחוב שקט מול ציר ראשי משנה את התמונה.
              </p>
              <p>
                <strong>קומה ומעלית</strong> — קומה רביעית בלי מעלית מורידה את המחיר משמעותית; קומה גבוהה עם מעלית ונוף מוסיפה.
              </p>
              <p>
                <strong>מצב הדירה</strong> — דירה משופצת נמכרת מהר ויקר יותר, אבל לא כל שיפוץ מחזיר את ההשקעה. משופצת חלקית לפעמים עדיפה על &quot;שמורה&quot;.
              </p>
              <p>
                <strong>תוספות ששוות כסף אמיתי</strong> — ממ״ד, מרפסת שמש, חניה בטאבו ומחסן. בשוק של היום אלה לא &quot;בונוסים&quot;, אלה רכיבי מחיר לכל דבר.
              </p>
              <p>
                <strong>פוטנציאל עתידי</strong> — בניין במתחם <Link href="/articles/urban-renewal-holon">התחדשות עירונית</Link> או באזור עם תוכניות פיתוח שווה יותר, גם אם הדירה עצמה ישנה.
              </p>
            </section>

            {/* Section 2 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>שלושת הכלים להערכת שווי</h2>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>1. עסקאות אמת — לא מחירי פרסום</h3>
              <p>
                באתר רשות המיסים מתפרסמות כל העסקאות שנסגרו בפועל. זה המקור האמין ביותר — אבל הוא מציג את העבר, לא את הביקוש של היום, ולא מספר לכם באיזה מצב הייתה הדירה שנמכרה.
              </p>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>2. שמאי מקרקעין</h3>
              <p>
                הערכה מקצועית ואובייקטיבית, חיונית במיוחד בנכסים מורכבים (ירושות, גירושין, זכויות בנייה). העלות — בדרך כלל כמה אלפי שקלים.
              </p>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>3. מתווך מקומי שחי את השטח</h3>
              <p>
                מתווך שעובד בשכונה יודע דבר שאף מאגר לא יודע: <strong>מי מחפש עכשיו, כמה הוא מוכן לשלם, ומה נסגר בבניין ליד לפני שבועיים.</strong> אצלנו הערכת השווי היא ללא עלות וללא התחייבות — כי אנחנו רוצים שתתחילו את המכירה מנקודת פתיחה נכונה.
              </p>
            </section>

            {/* Section 3 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>מלכודת &quot;המחיר הגבוה ליתר ביטחון&quot;</h2>
              <p>
                ההיגיון נשמע מושלם: &quot;נפרסם ב-2.3 מיליון, תמיד אפשר לרדת&quot;. בפועל קורה התהליך ההפוך:
              </p>
              <p>
                <strong>שבועות 1–3:</strong> הקונים הרציניים — אלה שעוקבים אחרי השוק ויודעים מחירים — רואים את המודעה, מזהים תמחור מנופח, ומדלגים.
              </p>
              <p>
                <strong>חודש 2:</strong> המודעה צוברת &quot;ותק&quot; בלוחות. קונים חדשים שואלים: &quot;למה היא לא נמכרת? מה הבעיה בדירה?&quot;
              </p>
              <p>
                <strong>חודש 3 והלאה:</strong> אתם מורידים את המחיר — אבל עכשיו אתם מנהלים משא ומתן מעמדת חולשה, מול קונים שיודעים שאתם לחוצים.
              </p>
              <p>
                התוצאה הסטטיסטית: דירות שמתחילות במחיר מנופח נמכרות בסוף <strong>במחיר נמוך יותר</strong> מדירות שתומחרו נכון מהיום הראשון.
              </p>
            </section>

            {/* Section 4 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>איך אנחנו מתמחרים דירה?</h2>
              <p>
                אנחנו משלבים את כל המקורות: עסקאות אמת מהאזור, היכרות יומיומית עם הביקושים, ובדיקה פיזית של הנכס — כולל הפוטנציאל התכנוני שלו. המטרה היא לא &quot;להחמיא&quot; לכם עם מספר גבוה כדי לזכות בבלעדיות, אלא לקבוע מחיר שמביא קונים אמיתיים ומשאיר מקום למשא ומתן חכם.
              </p>
              <p>
                שוקלים למכור? קראו גם על <Link href="/selling-apartment">תהליך מכירת דירה אצלנו</Link>, או על <Link href="/articles/home-staging">הכנת הדירה למכירה</Link> — הצעד שמוסיף עוד אחוזים למחיר הסופי.
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
