'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ArticleByline from '@/components/SEO/ArticleByline';
import FAQ, { FAQItem } from '@/components/ui/FAQ';
import '../foreign-investors/styles.css';

export default function HomeStagingContent() {
  const faqItems: FAQItem[] = [
    {
      question: '"כדאי לשפץ לפני שמוכרים?"',
      answer: '<strong>קוסמטי — כן. עומק — לא.</strong> צביעה, תיקון נזילות, החלפת ידיות וגופי תאורה מחזירים את עצמם. מטבח חדש וריצוף — בדרך כלל לא: הקונה ממילא ירצה לעצב לפי טעמו, ורוב ההשקעה לא תחזור במחיר.'
    },
    {
      question: '"כמה הום סטיילינג באמת מוסיף למחיר?"',
      answer: '<strong>אחוזים בודדים — שהם הרבה כסף.</strong> דירה מסודרת, מוארת ומצולמת מקצועית נמכרת מהר יותר וביוקר — תוספת של עד 5%–10% לעומת אותה דירה מוזנחת. על דירה של 2 מיליון ש״ח, גם 3% הם 60,000 ש״ח, על השקעה של אלפי שקלים.'
    },
    {
      question: '"הדירה שלנו מלאה בחפצים של 20 שנה. מאיפה מתחילים?"',
      answer: '<strong>מהכלל הפשוט: פחות זה יותר.</strong> מתחילים מחדר אחד, מוציאים כל מה שלא הכרחי (אחסון זמני אצל המשפחה או במחסן שכור), ומשאירים רק מה שגורם לחלל להיראות גדול ומזמין. אנחנו מלווים את התהליך הזה עם המוכרים שלנו — צעד אחר צעד.'
    }
  ];

  return (
    <div className="article-page" dir="rtl">
      <SecondaryHero
        img="/7.jpg"
        title="הום סטיילינג: ההשקעה הקטנה שמחזירה את עצמה פי עשרה"
        centered={true}
      />

      <Breadcrumbs />

      <div className="article-container">
        <article className="article-content">
          <div className="article-body">
            <ArticleByline id="home-staging" />
            {/* Introduction */}
            <section className="article-section">
              <p className="lead-paragraph">
                שני מוכרים, שתי דירות זהות באותו בניין בחולון. האחת נמכרה תוך שלושה שבועות, ב-80,000 ש״ח יותר מהשנייה. ההבדל? לא מזל ולא קונה תמים — אלא הכנה: קיר צבוע, סלון מאוורר, תמונות שצולמו נכון, ודירה שהריחה כמו בית ולא כמו מחסן.
              </p>

              <div className="content-flex-layout">
                <div className="text-column">
                  <p>
                    קונים מחליטים ב-90 השניות הראשונות. הם לא קונים &quot;מטרים רבועים&quot; — הם קונים תחושה: &quot;אני רואה את עצמי גר כאן&quot;. הום סטיילינג (Home Staging) הוא בדיוק האומנות הזו — להציג את הדירה כך שהקונה יתאהב.
                  </p>
                  <p>
                    והחלק הטוב? <strong>זו ההשקעה עם התשואה הגבוהה ביותר בכל תהליך המכירה</strong> — אלפי שקלים שמחזירים עשרות אלפים. הנה השיטה המלאה.
                  </p>
                </div>
                <div className="image-column">
                  <Image src="/images/articles/home-staging.jpg" alt="דירה מסודרת ומוכנה למכירה" width={600} height={450} loading="lazy" sizes="(max-width: 768px) 100vw, 45vw" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              </div>
            </section>

            {/* Section 1 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>מה כדאי לתקן — ומה חבל על הכסף</h2>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>משתלם כמעט תמיד</h3>
              <p>
                <strong>צביעה טרייה</strong> — ההשקעה המשתלמת ביותר. קירות לבנים ונקיים מגדילים ומאירים כל חלל.
              </p>
              <p>
                <strong>תיקון כל מה ש&quot;צועק&quot; הזנחה</strong> — נזילה מטפטפת, ידית שבורה, חלון שלא נסגר, רובה מתפוררת באמבטיה. כל פגם קטן כזה מתורגם אצל הקונה ל&quot;מה עוד מוזנח כאן?&quot; — ולהצעה נמוכה.
              </p>
              <p>
                <strong>תאורה</strong> — נורות חזקות וחמות בכל החדרים. דירה מוארת נתפסת גדולה, נקייה ושווה יותר.
              </p>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>כמעט אף פעם לא משתלם</h3>
              <p>
                מטבח חדש, החלפת ריצוף, שיפוץ אמבטיה יסודי — שיפוצי עומק לפני מכירה כמעט אף פעם לא מחזירים את עצמם. הקונה ירצה לעצב לפי הטעם שלו, ואתם תשלמו על שיפוץ שמישהו אחר יהרוס. את הכסף הגדול שומרים — ואת המחיר קובעים נכון מראש (איך? <Link href="/articles/apartment-pricing">מדריך התמחור שלנו</Link>).
              </p>
            </section>

            {/* Section 2 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>כללי הזהב של הצגת דירה</h2>
              <p>
                <strong>1. לרוקן</strong> — להוציא רהיטים עודפים וחפצים אישיים. חצי מהארונות ריקים = &quot;יש כאן המון מקום אחסון&quot;. תמונות משפחתיות יורדות: הקונה צריך לדמיין את המשפחה שלו, לא את שלכם.
              </p>
              <p>
                <strong>2. לנקות — ברמה של מלון</strong> — כולל חלונות, מסילות תריסים ומצנן. ריח של נקי מוכר דירות.
              </p>
              <p>
                <strong>3. לאוורר ולהאיר</strong> — לפני כל ביקור: חלונות פתוחים, תריסים מורמים, כל האורות דולקים. גם בצהריים.
              </p>
              <p>
                <strong>4. לנטרל ריחות</strong> — בישולים, עישון, בעלי חיים. הקונה מריח את זה בשנייה הראשונה — ואתם כבר לא.
              </p>
              <p>
                <strong>5. פינות חמות</strong> — שמיכה מקופלת על הספה, צמח ירוק, קפה ריחני. נשמע שיווקי? זה עובד.
              </p>
            </section>

            {/* Section 3 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>צילום מקצועי: המודעה שלכם — לא תמונות מהנייד</h2>
              <p>
                90% מהקונים מסננים דירות לפי תמונות, לפני שהם בכלל קוראים את הטקסט. תמונה חשוכה ועקומה מהנייד גוזרת על הדירה שלכם דילוג — גם אם היא נכס מעולה.
              </p>
              <p>
                צלם נדל״ן מקצועי יודע לתפוס זוויות רחבות, לאזן אור, ולספר את הסיפור של הדירה ב-12 תמונות. אצלנו כל דירה בבלעדיות מקבלת צילום מקצועי — זה חלק מהשירות, לא תוספת בתשלום.
              </p>
            </section>

            {/* Section 4 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>החשבון הסופי: כמה משקיעים וכמה מקבלים</h2>
              <p>
                הכנה טיפוסית של דירת 4 חדרים: צביעה (4,000–7,000 ש״ח), תיקונים קטנים (1,000–3,000 ש״ח), ניקיון עומק (800–1,500 ש״ח), וסידור והצגה — בעיקר עבודה ולא כסף. סך הכול: <strong>פחות מ-12,000 ש״ח.</strong>
              </p>
              <p>
                התמורה: מכירה מהירה יותר (פחות חודשי &quot;שריפה&quot; בשוק), פחות הצעות נמוכות, ומחיר סופי גבוה יותר — בשוק שלנו, ההבדל מגיע לעשרות אלפי שקלים.
              </p>
              <p>
                מתכננים למכור? אנחנו עוברים עם כל מוכר על רשימת ההכנה, מחברים לבעלי מקצוע אמינים, ומלווים עד החתימה. קראו על <Link href="/selling-apartment">תהליך המכירה המלא אצלנו</Link> — או על <Link href="/articles/selling-alone">למה למכור לבד עולה ביוקר</Link>.
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
