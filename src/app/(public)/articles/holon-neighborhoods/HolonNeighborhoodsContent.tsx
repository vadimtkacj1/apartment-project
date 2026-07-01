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

export default function HolonNeighborhoodsContent() {
  const faqItems: FAQItem[] = [
    {
      question: '"איזו שכונה הכי מתאימה למשפחה צעירה?"',
      answer: '<strong>קרית שרת ונאות שושנים מובילות.</strong> בתי ספר טובים, פארקים, קהילה מבוססת ושקט. מי שמחפש בנייה חדשה ימצא אותה בשכונות החדשות במזרח העיר ובפרויקטים של התחדשות עירונית.'
    },
    {
      question: '"איפה הכי כדאי להשקיע?"',
      answer: '<strong>תלוי מה אתם מחפשים.</strong> לתשואת שכירות שוטפת — דירות קטנות ליד מוקדי תחבורה. לאפסייד הון — שכונות בתנופת התחדשות כמו ג׳סי כהן ותל גיבורים, שבהן דירה ישנה היום יכולה להפוך לדירה חדשה בעתיד.'
    },
    {
      question: '"אני מתלבט בין חולון לבת ים. מה ההבדל?"',
      answer: '<strong>שתי ערים מצוינות עם אופי שונה.</strong> חולון חזקה בחינוך, פארקים וקהילה משפחתית. בת ים מציעה קו ראשון לים ותנופת התחדשות אדירה. אנחנו עובדים בשתיהן — ונשמח להתאים לכם את המיקום לפי הצרכים והתקציב.'
    }
  ];

  return (
    <div className="article-page" dir="rtl">
      <SecondaryHero
        img="/7.jpg"
        title="שכונות חולון: איפה לגור, איפה להשקיע ולמה"
        centered={true}
      />

      <Breadcrumbs />

      <div className="article-container">
        <article className="article-content">
          <div className="article-body">
            <ArticleByline id="holon-neighborhoods" />
            <Image
              src={getArticle('holon-neighborhoods')!.image}
              alt={getArticle('holon-neighborhoods')!.title}
              width={1200}
              height={630}
              className="article-hero-image"
              priority
            />
            {/* Introduction */}
            <section className="article-section">
              <p className="lead-paragraph">
                &quot;תמצאו לי דירה בחולון&quot; — זו בקשה שאנחנו שומעים כל יום. אבל חולון היא לא מקום אחד: ההבדל בין שכונה לשכונה הוא הבדל של אופי, קהילה, מחיר — ופוטנציאל השבחה. דירה זהה יכולה להתאים בול למשפחה אחת ולאכזב אחרת, רק בגלל המיקום.
              </p>

              <p>
                חולון היא מהערים הגדולות בישראל — עיר של משפחות, עם מערכת חינוך שמדורגת בצמרת הארצית, מוזיאונים (מוזיאון הילדים, מוזיאון העיצוב), פארקים גדולים, וקרבה של דקות לתל אביב.
              </p>
              <p>
                אחרי 24 שנים שאנחנו מוכרים ומשכירים דירות בכל רחבי העיר, הנה המדריך שלנו לשכונות המרכזיות — <strong>בגובה העיניים, מנקודת מבט של מי שחי את השטח.</strong>
              </p>
            </section>

            {/* Section 1 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>השכונות המבוססות: למשפחות שמחפשות יציבות</h2>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>קרית שרת</h3>
              <p>
                מהשכונות המבוקשות בעיר: בנייה מגוונת, בתי ספר חזקים, מרכזים מסחריים שכונתיים והרבה ירוק. מתאימה למשפחות שרוצות שגרה נוחה — הכול במרחק הליכה. הביקוש הקבוע שומר על ערך הדירות גם בשוק תנודתי.
              </p>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>נאות שושנים</h3>
              <p>
                שכונה ירוקה ושקטה עם אוכלוסייה מבוססת, קרובה לפארק פרס ולמתחמי הקניות. דירות מרווחות בבנייה ותיקה ואיכותית, לצד פרויקטים חדשים נקודתיים. אופציה מצוינת למי שמחפש &quot;שכונה של פעם&quot; עם נוחות של היום.
              </p>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>מרכז העיר</h3>
              <p>
                קרבה לכל דבר: סוקולוב המסחרי, תחבורה ציבורית ענפה ומוסדות העירייה. היצע מגוון — מדירות ישנות במחירים נוחים ועד בניינים חדשים. מתאים גם לזוגות צעירים וגם למשקיעים שמחפשים ביקוש שכירות קבוע.
              </p>
            </section>

            {/* Section 2 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>השכונות המתחדשות: למי שמחפש פוטנציאל</h2>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>ג׳סי כהן</h3>
              <p>
                הסיפור הגדול של חולון. השכונה הוותיקה עוברת מהפכת <Link href="/articles/urban-renewal-holon">פינוי-בינוי</Link> רחבת היקף — אלפי יחידות דיור חדשות בשלבי תכנון וביצוע. מי שקונה נכון היום, במתחם עם פרויקט מתקדם, רוכש כרטיס לעתיד השכונה. דורש ידע — לא כל מתחם באמת יוצא לדרך.
              </p>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>תל גיבורים</h3>
              <p>
                השכונה הצפונית ביותר — וזה היתרון הגדול שלה: גובלת בתל אביב ובפארק החולות. השילוב של מחירי חולון עם קרבה אמיתית לתל אביב מושך זוגות צעירים ומשקיעים, ומתחמי התחדשות מקודמים גם כאן.
              </p>
            </section>

            {/* Section 3 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>השכונות החדשות: למי שרוצה חדש מהניילון</h2>
              <p>
                במזרח העיר ובשוליה צומחות שכונות חדשות עם מגדלים מודרניים, ממ״ד בכל דירה, חניונים ולובי מעוצב. המחירים גבוהים יותר, אבל מקבלים סטנדרט בנייה עכשווי והוצאות תחזוקה צפויות. חשוב לשקלל את <Link href="/articles/new-vs-secondhand">היתרונות והחסרונות של דירה חדשה מול יד שנייה</Link> — ההחלטה פחות מובנת מאליה ממה שנדמה.
              </p>
            </section>

            {/* Neighborhoods comparison table */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>שכונות חולון במבט מהיר</h2>
              <div className="geo-table-wrap">
                <table className="geo-table">
                  <caption>שכונות חולון לפי אופי, קהל יעד ושלב התחדשות</caption>
                  <thead>
                    <tr>
                      <th>שכונה</th>
                      <th>אופי / קהל יעד</th>
                      <th>שלב התחדשות</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>קרית שרת</td>
                      <td>מבוססת ומשפחתית; בתי ספר חזקים, מרכזים מסחריים והרבה ירוק במרחק הליכה</td>
                      <td>שכונה ותיקה ומבוססת, ללא התחדשות רחבת היקף</td>
                    </tr>
                    <tr>
                      <td>נאות שושנים</td>
                      <td>ירוקה ושקטה, אוכלוסייה מבוססת; דירות מרווחות בבנייה ותיקה ואיכותית</td>
                      <td>בנייה ותיקה לצד פרויקטים חדשים נקודתיים</td>
                    </tr>
                    <tr>
                      <td>מרכז העיר</td>
                      <td>קרבה לכל; זוגות צעירים ומשקיעים שמחפשים ביקוש שכירות קבוע</td>
                      <td>היצע מעורב — מדירות ישנות ועד בניינים חדשים</td>
                    </tr>
                    <tr>
                      <td>ג׳סי כהן</td>
                      <td>שכונה ותיקה עם פוטנציאל השבחה; מתאימה למשקיעים לטווח ארוך</td>
                      <td>פינוי-בינוי רחב היקף בשלבי תכנון וביצוע</td>
                    </tr>
                    <tr>
                      <td>תל גיבורים</td>
                      <td>גובלת בתל אביב ובפארק החולות; מושכת זוגות צעירים ומשקיעים</td>
                      <td>מתחמי התחדשות מקודמים</td>
                    </tr>
                    <tr>
                      <td>השכונות החדשות (מזרח העיר)</td>
                      <td>מי שרוצה חדש מהניילון; מגדלים מודרניים, ממ״ד, חניונים ולובי מעוצב</td>
                      <td>בנייה חדשה</td>
                    </tr>
                  </tbody>
                </table>
                <span className="source-note">מקור: סיווג איכותני על בסיס ניסיון השטח של רם נכסים חיים ענבי. שלבי ההתחדשות משתנים — בדקו את הסטטוס של מתחם ספציפי לפני רכישה. מחירי עסקאות אמת למ״ר זמינים במאגר עסקאות הנדל״ן של רשות המסים.</span>
              </div>
            </section>

            {/* Section 4 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>אז איפה כדאי לקנות?</h2>
              <p>
                <strong>למגורים</strong> — תבחרו לפי החיים שלכם, לא לפי הכותרות: קרבה לעבודה, בתי ספר, משפחה. שכונה &quot;פחות נוצצת&quot; שמתאימה לשגרה שלכם תנצח כל טרנד.
              </p>
              <p>
                <strong>להשקעה</strong> — תבחרו לפי נתונים: ביקוש שכירות בפועל, תשואה, ושלב ההתחדשות של המתחם. אנחנו רואים את העסקאות האמיתיות כל יום ונשמח לשתף.
              </p>
              <p>
                מוכנים לראות דירות? <Link href="/apartments">כל הדירות שלנו בחולון ובסביבה במקום אחד</Link>.
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
