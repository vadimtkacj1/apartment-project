'use client';
import React from 'react';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ArticleByline from '@/components/SEO/ArticleByline';
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
            <ArticleByline id="apartment-pricing" />
            {/* Introduction */}
            <section className="article-section">
              <p className="lead-paragraph">
                זו השאלה הראשונה של כל מוכר דירה — וגם הטעות הראשונה. רוב המוכרים קובעים את המחיר לפי מה ש&quot;השכן ביקש&quot;, לפי כתבה בעיתון, או לפי הסכום שהם צריכים לדירה הבאה. אף אחד מהשלושה הוא לא שווי השוק של הדירה.
              </p>

              <p>
                תמחור הוא ההחלטה הקריטית ביותר בכל עסקת מכירה. מחיר נמוך מדי — והפסדתם כסף שמגיע לכם. מחיר גבוה מדי — והדירה &quot;תישרף&quot; בשוק ותימכר בסוף בפחות ממה שהייתה שווה ביום הראשון.
              </p>
              <p>
                אחרי אלפי עסקאות בחולון, בת ים וראשון לציון, אנחנו רואים תבנית חוזרת: <strong>מניסיון המשרד, ההבדל בין תמחור נכון לשגוי מגיע לרוב לכ-5%–10% ממחיר הדירה.</strong> על דירה של 2 מיליון ש״ח — זה עד 200,000 ש״ח. (הערכה מניסיוננו בשטח, לא נתון רשמי.)
              </p>
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
              <p>
                להערכת שווי אמינה כדאי לשלב שלושה מקורות — לכל אחד יתרון וחיסרון משלו:
              </p>

              <div className="definition-block">
                <p><span className="definition-term">מאגר עסקאות הנדל״ן של רשות המיסים</span> הוא מאגר ציבורי שבו מתפרסמות עסקאות אמת שדווחו לרשות — המחירים שבהם דירות נמכרו בפועל, להבדיל ממחירי הפרסום בלוחות.</p>
              </div>

              <div className="geo-table-wrap">
                <table className="geo-table">
                  <caption>שלושת הכלים להערכת שווי דירה</caption>
                  <thead>
                    <tr>
                      <th>כלי הערכה</th>
                      <th>עלות</th>
                      <th>יתרון / דיוק</th>
                      <th>חיסרון</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>עסקאות אמת (אתר רשות המיסים)</td>
                      <td>ללא עלות</td>
                      <td>המקור האמין ביותר — מחירים שנסגרו בפועל</td>
                      <td>מציג את העבר בלבד, לא את הביקוש הנוכחי ולא את מצב הדירה שנמכרה</td>
                    </tr>
                    <tr>
                      <td>שמאי מקרקעין מוסמך</td>
                      <td>בדרך כלל כמה אלפי שקלים</td>
                      <td>הערכה מקצועית ואובייקטיבית, חיונית בנכסים מורכבים (ירושות, גירושין, זכויות בנייה)</td>
                      <td>כרוכה בעלות; לא תמיד משקפת את הביקוש העדכני בשטח</td>
                    </tr>
                    <tr>
                      <td>מתווך מקומי שחי את השטח</td>
                      <td>לרוב ללא עלות</td>
                      <td>מכיר את הביקוש החי — מי מחפש עכשיו ומה נסגר בבניין הסמוך לאחרונה</td>
                      <td>ההערכה תלויה בניסיון המתווך ובהיכרותו עם האזור</td>
                    </tr>
                  </tbody>
                </table>
                <span className="source-note">מקור עסקאות האמת: רשות המיסים, <a href="https://www.gov.il" target="_blank" rel="noopener noreferrer">gov.il</a></span>
              </div>

              <p>
                כל מקור לבדו נותן תמונה חלקית — השילוב ביניהם הוא שמדייק. אצלנו הערכת השווי היא <strong>ללא עלות וללא התחייבות</strong>, כי אנחנו רוצים שתתחילו את המכירה מנקודת פתיחה נכונה.
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
                התוצאה שאנחנו רואים שוב ושוב בשטח: דירות שמתחילות במחיר מנופח נוטות להימכר בסוף <strong>במחיר נמוך יותר</strong> מדירות שתומחרו נכון מהיום הראשון.
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
    </div>
  );
}
