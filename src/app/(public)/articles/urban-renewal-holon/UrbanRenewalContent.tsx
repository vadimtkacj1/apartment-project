'use client';
import React from 'react';
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

              <p>
                בשביל בעלי דירות ותיקים מדובר בהזדמנות של פעם בחיים: דירה ישנה בת 3 חדרים יכולה להפוך לדירה חדשה עם ממ״ד, מרפסת ומעלית — בלי לשלם שקל. בשביל קונים ומשקיעים, זו דרך לקנות היום במחיר של &quot;ישן&quot; ולקבל בעתיד נכס חדש.
              </p>
              <p>
                אבל בין ההבטחה למציאות יש פערים: פרויקטים שנתקעים, יזמים שנעלמים, והסכמים שכובלים דיירים לשנים. <strong>אחרי 24 שנים בשטח של חולון, אנחנו מכירים כל מתחם — ויודעים להבדיל בין הזדמנות אמיתית לחלום באספמיה.</strong>
              </p>
            </section>

            {/* Definition: פינוי-בינוי מול תמ״א 38 */}
            <div className="definition-block">
              <p><span className="definition-term">פינוי-בינוי</span> הוא הליך שבו מפנים מתחם שלם של בניינים ישנים, הורסים אותו ובונים במקומו שכונה חדשה בצפיפות גבוהה יותר — פרויקט רחב היקף וארוך טווח. <span className="definition-term">תמ״א 38</span>, לעומת זאת, חלה על בניין בודד: חיזוקו ותוספת קומות, ממ״דים ומעלית (38/1), או הריסתו ובנייתו מחדש (38/2).</p>
            </div>

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
                תוכנית מתאר ארצית 38 (תמ״א 38) אושרה בשנת 2005 במטרה לחזק מבנים ישנים מפני רעידות אדמה. בפועל היא הפכה למנוע התחדשות לבניינים בודדים, בשני מסלולים:
              </p>
              <span className="source-note">מקור: מינהל התכנון — הרשות הממשלתית להתחדשות עירונית, <a href="https://www.gov.il" target="_blank" rel="noopener noreferrer">gov.il</a></span>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>תמ״א 38/1 — חיזוק ותוספת</h3>
              <p>
                הבניין הקיים מחוזק, נוספים לו ממ״דים, מרפסות ומעלית, והיזם מקבל בתמורה זכויות לבנות קומות נוספות. הדיירים נשארים בדירותיהם במהלך העבודות.
              </p>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>תמ״א 38/2 — הריסה ובנייה מחדש</h3>
              <p>
                הבניין נהרס ונבנה מחדש מהיסוד. הדיירים מקבלים דירה חדשה לחלוטין בבניין חדש — מסלול שדומה במהותו לפינוי-בינוי, אבל בקנה מידה של בניין אחד ולוחות זמנים קצרים יותר.
              </p>

              <div className="geo-table-wrap">
                <table className="geo-table">
                  <caption>פינוי-בינוי מול תמ״א 38/1 ותמ״א 38/2 — השוואה</caption>
                  <thead>
                    <tr>
                      <th>היבט</th>
                      <th>פינוי-בינוי</th>
                      <th>תמ״א 38/1</th>
                      <th>תמ״א 38/2</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>מהות והיקף</td>
                      <td>הריסת מתחם שלם והקמת שכונה חדשה בצפיפות גבוהה יותר</td>
                      <td>חיזוק הבניין הקיים ותוספת קומות, ממ״דים ומעלית</td>
                      <td>הריסת הבניין הבודד ובנייתו מחדש</td>
                    </tr>
                    <tr>
                      <td>מי נשאר במהלך הבנייה</td>
                      <td>הדיירים מתפנים לדיור חלופי (על חשבון היזם)</td>
                      <td>הדיירים נשארים בדירותיהם</td>
                      <td>הדיירים מתפנים לדיור חלופי</td>
                    </tr>
                    <tr>
                      <td>משך משוער</td>
                      <td>8–15 שנים</td>
                      <td>קצר יותר מפינוי-בינוי</td>
                      <td>קצר יותר מפינוי-בינוי</td>
                    </tr>
                    <tr>
                      <td>התוצר</td>
                      <td>דירה חדשה בשכונה חדשה</td>
                      <td>דירה משודרגת בבניין מחוזק</td>
                      <td>דירה חדשה בבניין חדש</td>
                    </tr>
                  </tbody>
                </table>
                <span className="source-note">מקור: הרשות הממשלתית להתחדשות עירונית, gov.il. משכי הזמן הם הערכה ומשתנים בין פרויקטים.</span>
              </div>
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
    </div>
  );
}
