'use client';
import React from 'react';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function TermsOfUseContent() {
  return (
    <div className="article-page" dir="rtl">
      {/* Hero with Background Image */}
      <SecondaryHero
        img="/7.jpg"
        title="תקנון ותנאי שימוש"
        centered={true}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <div className="privacy-container">
        <article className="privacy-content">
          <div className="privacy-body">

            <p className="last-updated">עודכן לאחרונה: 07.07.2026</p>

            {/* Section 1: מבוא */}
            <section className="privacy-section">
              <h2>1. מבוא</h2>
              <p>
                ברוכים הבאים לאתר האינטרנט של משרד התיווך והנדל"ן "רם שיווק נכסים & חיים ענבי" (להלן: "האתר" ו-"המשרד" בהתאמה).
              </p>
              <p>
                השימוש באתר, לרבות גלישה בו, עיון בנכסים המוצעים, מילוי טפסים ויצירת קשר, כפוף לתנאי השימוש המפורטים להלן (להלן: "התקנון"). אנא קראו תנאים אלו בקפידה. עצם השימוש באתר מהווה את הסכמתך המלאה והבלתי חוזרת לתנאי תקנון זה ולמדיניות הפרטיות של האתר.
              </p>
              <p>
                אם אינך מסכים לאיזה מתנאי התקנון, הנך מתבקש לחדול מיד מכל שימוש באתר.
              </p>
              <p>
                התקנון מנוסח בלשון זכר מטעמי נוחות בלבד, אך מתייחס לכל המינים ולרבים כאחד.
              </p>
            </section>

            {/* Section 2: מהות האתר והמידע המוצג */}
            <section className="privacy-section">
              <h2>2. מהות האתר והמידע המוצג (ט.ל.ח)</h2>
              <p className="section-intro">
                האתר משמש כפלטפורמה שיווקית ותדמיתית להצגת נכסי נדל"ן למכירה, השכרה או השקעה, וכן להצגת שירותי המשרד.
              </p>

              <div className="info-item">
                <h3>היעדר מצג מחייב</h3>
                <p>
                  המידע המוצג באתר אודות הנכסים (לרבות מחירים, שטחים מ"ר, שנת בנייה, תמונות, שרטוטים, תוכניות, מפרטים טכניים וזמינות) נועד למטרות התרשמות ומידע כללי בלבד, ואינו מהווה הצעה מחייבת, מצג משפטי או בסיס להסתמכות לקראת חתימה על הסכם.
                </p>
              </div>

              <div className="info-item">
                <h3>מקור המידע</h3>
                <p>
                  חלק ניכר מהמידע אודות הנכסים נמסר למשרד על ידי צדדים שלישיים (בעלי הנכסים, יזמים או קבלנים). המשרד מציג את המידע כפי שהוא (AS IS) ואינו מתחייב לבדוק או לאמת את נכונותו, שלמותו או עדכניותו.
                </p>
              </div>

              <div className="info-item">
                <h3>טעות לעולם חוזרת (ט.ל.ח)</h3>
                <p>
                  ייתכנו שגיאות, אי-דיוקים או טעויות סופר בפרסומי הנכסים. המשרד שומר לעצמו את הזכות לתקן כל שגיאה, לשנות מחירים, או להסיר נכסים מהאתר בכל עת וללא הודעה מוקדמת. כל הנתונים כפופים לאישור סופי מול בעלי הנכס.
                </p>
              </div>
            </section>

            {/* Section 3: היעדר ייעוץ מקצועי */}
            <section className="privacy-section">
              <h2>3. היעדר ייעוץ מקצועי</h2>
              <p>
                התכנים, המאמרים והמידע המופיעים באתר אינם מהווים בשום אופן ייעוץ משפטי, ייעוץ פיננסי, ייעוץ משכנתאות, ייעוץ אדריכלי, ייעוץ שמאות או תחליף לייעוץ מקצועי הניתן על ידי בעל מקצוע מוסמך. כל החלטה על ביצוע עסקת נדל"ן או הסתמכות על המידע שבאתר נעשית על אחריותו הבלעדית של המשתמש, ומומלץ לו להיוועץ באנשי מקצוע מטעמו בטרם כל התקשרות בעסקה.
              </p>
            </section>

            {/* Section 4: זכויות קניין רוחני */}
            <section className="privacy-section">
              <h2>4. זכויות קניין רוחני</h2>
              <p>
                כל זכויות הקניין הרוחני באתר – לרבות, אך לא רק, קוד האתר, העיצוב הגרפי, הממשק, בסיסי הנתונים, הטקסטים, התמונות (לרבות צילומי הנכסים), הסרטונים, הסימנים המסחריים והלוגואים – הנם רכושו הבלעדי של המשרד (או של צדדים שלישיים שהעניקו למשרד הרשאה כדין להשתמש בהם).
              </p>
              <p>
                אין להעתיק, לשכפל, להפיץ, להציג בפומבי, לפרסם, לשנות או לעשות כל שימוש מסחרי במידע או בתמונות המופיעים באתר, במלואם או בחלקם, ללא קבלת אישור מראש ובכתב מהמשרד.
              </p>
            </section>

            {/* Section 5: שימוש באתר והתנהגות משתמשים */}
            <section className="privacy-section">
              <h2>5. שימוש באתר והתנהגות משתמשים</h2>
              <p className="section-intro">
                המשתמש מתחייב לעשות באתר שימוש חוקי והוגן בלבד. מבלי לגרוע מכלליות האמור, המשתמש מתחייב:
              </p>
              <ul>
                <li>לא להשתמש באתר למטרות הפצת מידע שקרי, מטעה, פוגעני או בלתי חוקי.</li>
                <li>לא להפעיל יישומי מחשב, בוטים, זחלנים (Crawlers) או אמצעים אוטומטיים אחרים לשם סריקה, העתקה או אחזור של תמונות ונכסים מתוך האתר.</li>
                <li>למסור פרטים נכונים, מדויקים ואמיתיים בלבד בעת מילוי טפסים באתר. מסירת פרטים כוזבים עלולה להוות עבירה פלילית.</li>
              </ul>
              <p>
                המשרד שומר לעצמו את הזכות לחסום גישה של משתמש או למנוע ממנו שירות, אם קיים חשש שהפר את תנאי התקנון.
              </p>
            </section>

            {/* Section 6: הגבלת אחריות */}
            <section className="privacy-section">
              <h2>6. הגבלת אחריות</h2>
              <p className="section-intro">
                השימוש באתר ניתן "כפי שהוא" (AS IS). המשרד, מנהליו, סוכניו ועובדיו לא יישאו בכל אחריות, ישירה או עקיפה, לכל נזק, הפסד, חסרון כיס או עוגמת נפש שייגרמו למשתמש כתוצאה מ:
              </p>
              <ul>
                <li>שימוש באתר או חוסר יכולת להשתמש בו (לרבות תקלות שרת, נפילות תקשורת או וירוסים).</li>
                <li>הסתמכות על מידע או תמונות המוצגים באתר.</li>
                <li>התקשרות עם צדדים שלישיים (כגון יועצי משכנתאות או עורכי דין) שפרטיהם הופיעו באתר או אליהם הופנה המשתמש באמצעות האתר.</li>
              </ul>
            </section>

            {/* Section 7: קישורים חיצוניים */}
            <section className="privacy-section">
              <h2>7. קישורים חיצוניים (Links)</h2>
              <p>
                האתר עשוי להכיל קישורים לאתרי אינטרנט חיצוניים או לרשתות חברתיות שאינם מופעלים על ידי המשרד. הקישורים נועדו לנוחות בלבד, והמשרד אינו שולט בתכנים המופיעים בהם ואינו נושא באחריות למדיניות הפרטיות או לאבטחת המידע של אותם אתרים.
              </p>
            </section>

            {/* Section 8: מדיניות פרטיות */}
            <section className="privacy-section">
              <h2>8. מדיניות פרטיות</h2>
              <p>
                המשרד מייחס חשיבות רבה לפרטיות הגולשים. אופן איסוף המידע אודות מתעניינים, הטיפול בלידים והשימוש בהם (לרבות שליחת דיוור שיווקי) מפורטים במלואם במסמך{' '}
                <a href="/privacy-policy">"מדיניות הפרטיות"</a> המופיע באתר. מדיניות הפרטיות מהווה חלק בלתי נפרד מתקנון זה.
              </p>
            </section>

            {/* Section 9: שינויים באתר ובתקנון */}
            <section className="privacy-section">
              <h2>9. שינויים באתר ובתקנון</h2>
              <p>
                המשרד רשאי, על פי שיקול דעתו הבלעדי, לשנות מעת לעת את מבנה האתר, מראהו, היקף השירותים המוצעים בו ואת תנאי התקנון, וזאת ללא צורך במתן הודעה מוקדמת. תוקפם של השינויים יהיה החל מרגע פרסומם באתר.
              </p>
            </section>

            {/* Section 10: דין וסמכות שיפוט */}
            <section className="privacy-section">
              <h2>10. דין וסמכות שיפוט</h2>
              <p>
                על תקנון זה ועל השימוש באתר יחולו אך ורק דיני מדינת ישראל. סמכות השיפוט הבלעדית והייחודית בכל עניין ומחלוקת הנובעים מהשימוש באתר תהא נתונה לבתי המשפט המוסמכים במחוז תל אביב-יפו.
              </p>
            </section>

            {/* Section 11: יצירת קשר */}
            <section className="privacy-section contact-section">
              <h2>11. יצירת קשר</h2>
              <p>
                נשמח לעמוד לרשותכם בכל שאלה או בירור בנוגע לתנאי השימוש או לתוכן האתר:
              </p>
              <div className="contact-details">
                <p><strong>שם המשרד:</strong> רם שיווק נכסים & חיים ענבי</p>
                <p><strong>דוא"ל:</strong> rammiz800@gmail.com</p>
                <p><strong>טלפון:</strong> 050-549-6626</p>
                <p><strong>כתובת:</strong> חנקין 83 חולון, ישראל</p>
              </div>
            </section>

          </div>
        </article>
      </div>

      <style jsx>{`
        .privacy-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 2rem 4rem;
          background: #faf7f2;
        }

        @media (min-width: 1920px) {
          .privacy-container {
            max-width: 1600px;
            padding: 3rem 4rem 6rem;
          }
        }

        .privacy-content {
          background: transparent;
          overflow: hidden;
        }

        .privacy-body {
          padding: 0;
          direction: rtl;
          text-align: right;
          background: #faf7f2;
        }

        .last-updated {
          font-size: 0.95rem;
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .privacy-section {
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(28, 54, 100, 0.1);
        }

        .privacy-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .privacy-section h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1c3664;
          margin: 0 0 1.5rem 0;
          line-height: 1.3;
          font-family: var(--font-caramel), cursive, sans-serif;
        }

        .privacy-section h3 {
          font-size: 1.35rem;
          font-weight: 600;
          color: #1c3664;
          margin: 1.5rem 0 0.75rem 0;
          font-family: var(--font-caramel), cursive, sans-serif;
        }

        .privacy-section p {
          font-size: 1.05rem;
          line-height: 1.85;
          color: #374151;
          margin-bottom: 1rem;
        }

        .privacy-section a {
          color: #B8821E;
          text-decoration: underline;
        }

        .section-intro {
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }

        .privacy-section ul {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }

        .privacy-section ul li {
          font-size: 1.05rem;
          line-height: 1.85;
          color: #374151;
          margin-bottom: 1rem;
          padding-right: 1.5rem;
          position: relative;
        }

        .privacy-section ul li::before {
          content: "•";
          color: #B8821E;
          font-weight: bold;
          font-size: 1.4rem;
          position: absolute;
          right: 0;
          top: -2px;
        }

        .info-item {
          background: rgba(255, 255, 255, 0.5);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(28, 54, 100, 0.08);
        }

        .info-item h3 {
          margin-top: 0;
        }

        .info-item p {
          margin-bottom: 0;
        }

        .contact-section {
          background: linear-gradient(135deg, rgba(28, 54, 100, 0.05) 0%, rgba(184, 130, 30, 0.05) 100%);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(28, 54, 100, 0.1);
        }

        .contact-details {
          margin-top: 1.5rem;
        }

        .contact-details p {
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
        }

        .contact-details strong {
          color: #1c3664;
          font-weight: 600;
        }

        strong {
          color: #1c3664;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .privacy-container {
            padding: 1.5rem 1rem 3rem;
          }

          .privacy-section h2 {
            font-size: 1.6rem;
            margin-bottom: 1.25rem;
          }

          .privacy-section h3 {
            font-size: 1.2rem;
          }

          .privacy-section p,
          .privacy-section ul li {
            font-size: 1rem;
          }

          .info-item {
            padding: 1.25rem;
          }

          .contact-section {
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .privacy-section h2 {
            font-size: 1.4rem;
          }

          .privacy-section h3 {
            font-size: 1.1rem;
          }

          .privacy-section ul li {
            padding-right: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
