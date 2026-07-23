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

export default function FirstApartmentContent() {
  const faqItems: FAQItem[] = [
    {
      question: '"כמה הון עצמי אנחנו באמת צריכים?"',
      answer: '<strong>לפחות 25% משווי הדירה — ועוד קצת.</strong> הבנקים מממנים עד 75% לדירה ראשונה. על דירה של 1.8 מיליון ש״ח צריך 450,000 ש״ח הון עצמי, ועוד כ-5% לעלויות נלוות: עורך דין, תיווך, מעבר ושיפוצים קלים.'
    },
    {
      question: '"כדאי לחכות שהמחירים יירדו?"',
      answer: '<strong>זו הימור, לא תוכנית.</strong> מי שחיכה &quot;לירידת מחירים&quot; בעשור האחרון שילם ביוקר. אם מצאתם דירה מתאימה, במחיר הוגן, עם משכנתא שאתם עומדים בה בנוחות — העיתוי הנכון הוא כשאתם מוכנים, לא כשהכותרות אומרות.'
    },
    {
      question: '"דירה קטנה במרכז או גדולה בפריפריה?"',
      answer: '<strong>יש דרך שלישית.</strong> ערים כמו חולון נותנות את שני העולמות: 10 דקות מתל אביב, ומחיר שמאפשר 4 חדרים במקום 2.5. בדירה ראשונה, קרבה לעבודה ולמשפחה שווה יותר מעוד חדר — אבל אל תקנו דירה שתהיה קטנה עליכם בעוד שנתיים.'
    }
  ];

  return (
    <div className="article-page" dir="rtl">
      <SecondaryHero
        img="/7.jpg"
        title="דירה ראשונה: המדריך שיחסוך לכם שנים של טעויות"
        centered={true}
      />

      <Breadcrumbs />

      <div className="article-container">
        <article className="article-content">
          <div className="article-body">
            <ArticleByline id="first-apartment-guide" />
            <Image
              src={getArticle('first-apartment-guide')!.image}
              alt={getArticle('first-apartment-guide')!.title}
              width={1200}
              height={630}
              className="article-hero-image"
              priority
            />
            {/* Introduction */}
            <section className="article-section">
              <p className="lead-paragraph">
                אתם חוסכים כבר שנים, גרים בשכירות שרק עולה, וכל ביקור אצל ההורים מסתיים באותה שאלה: &quot;נו, מתי כבר תקנו דירה?&quot;. אבל בין הרצון לבין המפתח ביד עומד מסע שרוב הזוגות הצעירים עושים בפעם הראשונה בחייהם — בלי מפה.
              </p>

              <p>
                קניית דירה ראשונה היא העסקה הכלכלית הגדולה בחיים, והיא מגיעה דווקא בשלב שבו יש לכם הכי פחות ניסיון. טעות בתקציב, במיקום או בבדיקות יכולה ללוות אתכם 20 שנה.
              </p>
              <p>
                ריכזנו כאן את כל מה שלמדנו מליווי מאות זוגות צעירים בחולון ובסביבה — שלב אחרי שלב, בלי ז׳רגון ובלי הפחדות. <strong>המטרה: שתגיעו לחתימה בטוחים, מוכנים, ועם הדירה הנכונה.</strong>
              </p>
            </section>

            <ArticleToc />

            {/* Section 1 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>שלב 1: תקציב אמיתי — לא חלום</h2>
              <p>
                לפני שפותחים אפליקציות נדל״ן, פותחים אקסל. התקציב האמיתי שלכם מורכב משלושה חלקים:
              </p>

              <ul className="geo-list">
                <li>
                  <strong>הון עצמי</strong> — לדירה ראשונה (יחידה) הבנק רשאי לממן עד 75% משווי הדירה, לפי הנחיות בנק ישראל. כלומר אתם צריכים לפחות 25% מכספכם (חסכונות, קרנות, עזרה מההורים).
                </li>
                <li>
                  <strong>החזר חודשי שתעמדו בו</strong> — כלל אצבע בריא: ההחזר לא יעלה על שליש מההכנסה הפנויה של שניכם. זכרו שהריבית יכולה לעלות — בדקו שתעמדו גם בהחזר גבוה יותר.
                </li>
                <li>
                  <strong>עלויות נלוות</strong> — עורך דין, תיווך, שמאי, הובלה ושיפוץ ראשוני. תכננו עוד כ-5% מעל מחיר הדירה.
                </li>
              </ul>

              <p>
                אחוז המימון תלוי בסוג הרוכש ונקבע בהוראת ניהול בנקאי תקין 329 של בנק ישראל:
              </p>

              <div className="geo-table-wrap">
                <table className="geo-table">
                  <caption>אחוז מימון מרבי לפי סוג רוכש</caption>
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
                <span className="source-note">מקור: <a href="https://www.boi.org.il" target="_blank" rel="noopener noreferrer">בנק ישראל</a>, הוראת ניהול בנקאי תקין 329.</span>
              </div>

              <p>
                חדשות טובות לתקציב: על רכישת <strong>דירה יחידה</strong> לא משלמים מס רכישה כלל במדרגה הראשונה — שיעור של 0% על שווי של עד ₪1,978,745 (נכון ל-2026; המדרגות מוקפאות לשנים 2025–2027). מעבר לסכום זה המס עולה מדרגתית. פירוט מלא ב<Link href="/articles/purchase-tax-guide">מדריך מס הרכישה</Link>.
              </p>
              <span className="source-note">מקור: <a href="https://www.gov.il" target="_blank" rel="noopener noreferrer">רשות המסים</a>, מדרגות מס רכישה 2026.</span>
            </section>

            {/* Section 2 */}
            <figure className="article-inline-figure">
              <Image src="/images/articles/inbody/first-apartment-guide-a.jpg" alt={getArticle('first-apartment-guide')!.title} width={1200} height={675} className="article-inline-image" />
            </figure>
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>שלב 2: אישור עקרוני לפני הכול</h2>
              <p>
                הטעות הקלאסית: למצוא דירה, להתאהב, ורק אז ללכת לבנק. הסדר הנכון הפוך — <strong>קודם אישור עקרוני למשכנתא, ורק אחר כך חיפוש.</strong>
              </p>
              <p>
                אישור עקרוני הוא מסמך מהבנק שקובע כמה הוא מוכן להלוות לכם, על סמך ההכנסות וההתחייבויות שלכם. הוא בחינם, תקף לתקופה מוגבלת, ולא מחייב אתכם לכלום — אבל הוא הופך אתכם מ&quot;מתעניינים&quot; ל&quot;קונים רציניים&quot; שמוכרים מתייחסים אליהם אחרת. עוד על כך ב<Link href="/articles/mortgage-guide">מדריך המשכנתא המלא שלנו</Link>.
              </p>
            </section>

            {/* Section 3 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>שלב 3: איפה לקנות? למה דווקא חולון</h2>
              <p>
                כשהתקציב לא מספיק לתל אביב, מתחיל החיפוש אחרי &quot;הדבר הבא&quot;. חולון מציעה שילוב שקשה למצוא במקום אחר:
              </p>
              <p>
                <strong>קרבה אמיתית למרכז</strong> — 10–15 דקות נסיעה לתל אביב, גישה מהירה לאיילון ולנתיבי תחבורה ציבורית.
              </p>
              <p>
                <strong>מחירים שפויים יחסית</strong> — על המחיר של 2.5 חדרים בתל אביב תקנו בחולון דירת 4 חדרים עם מרפסת.
              </p>
              <p>
                <strong>עיר של משפחות</strong> — מערכת חינוך מהמובילות בארץ, פארקים, מוזיאונים ותרבות ילדים שהפכו לשם דבר.
              </p>
              <p>
                <strong>פוטנציאל השבחה</strong> — תנופת <Link href="/articles/urban-renewal-holon">התחדשות עירונית</Link> שמושכת ביקושים וצפויה להמשיך להעלות ערך. רוצים להשוות שכונות? קראו את <Link href="/articles/holon-neighborhoods">מדריך השכונות של חולון</Link>.
              </p>
            </section>

            {/* Section 4 */}
            <figure className="article-inline-figure">
              <Image src="/images/articles/inbody/first-apartment-guide-b.jpg" alt={getArticle('first-apartment-guide')!.title} width={1200} height={675} className="article-inline-image" />
            </figure>
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>שלב 4: הבדיקות שאסור לדלג עליהן</h2>
              <p>
                מצאתם דירה? עכשיו עוצרים את ההתרגשות לרגע ועושים שיעורי בית: נסח טאבו נקי, היתרי בנייה תקינים, בדיקת רטיבות ותשתיות, והבנה מה מתוכנן להיבנות מסביב. הכנו לכם <Link href="/articles/pre-purchase-checklist">רשימת בדיקות מלאה לפני קניית דירה</Link> — אל תחתמו בלעדיה.
              </p>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>הטעויות שאנחנו רואים שוב ושוב</h3>
              <p>
                <strong>קנייה רגשית</strong> — מטבח מעוצב מסנוור, אבל צנרת ישנה עולה יותר לתקן.
              </p>
              <p>
                <strong>התעלמות מהוצאות עתידיות</strong> — ועד בית גבוה, ארנונה, חניה בתשלום.
              </p>
              <p>
                <strong>ויתור על ליווי מקצועי</strong> — עורך דין מטעם המוכר לא מייצג אתכם. לעולם.
              </p>
            </section>

            {/* Section 5 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>איך אנחנו מלווים זוגות צעירים?</h2>
              <p>
                אנחנו לא &quot;מראים דירות&quot; — אנחנו בונים איתכם תהליך: הגדרת תקציב ריאלי, חיבור ליועצי משכנתאות ועורכי דין שאנחנו סומכים עליהם, סינון דירות שעומדות בקריטריונים שלכם, וניהול המשא ומתן עד לחתימה.
              </p>
              <p>
                מוכנים להתחיל? <Link href="/apartments?dealType=sale">צפו בדירות למכירה בחולון ובסביבה</Link> — או דברו איתנו ונבנה יחד את המסלול שלכם לדירה הראשונה.
              </p>
            </section>

            {/* FAQ */}
            <FAQ items={faqItems} />

            {/* End CTA + related guides (shared components) */}
            <ArticleCta articleId="first-apartment-guide" />
            <RelatedArticles currentId="first-apartment-guide" />
          </div>
        </article>
      </div>
    </div>
  );
}
