'use client';
import React from 'react';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function PrivacyPolicyContent() {
  return (
    <div className="article-page" dir="rtl">
      {/* Hero with Background Image */}
      <SecondaryHero
        img="/7.jpg"
        title="מדיניות פרטיות"
        centered={true}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <div className="privacy-container">
        <article className="privacy-content">
          {/* Main Content */}
          <div className="privacy-body">

            {/* Section: כללי */}
            <section className="privacy-section">
              <h2>כללי</h2>
              <ul>
                <li>
                  אנא קרא הוראות הסכם זה (להלן: "מדיניות הפרטיות") בקפידה, בטרם תעשה שימוש באתר האינטרנט (להלן: "האתר"). שימוש באתר מהווה הסכמה למדיניות זו. אם אינך מסכים לה, עליך להפסיק באופן מיידי את השימוש באתר.
                </li>
                <li>
                  ההגדרות הקבועות בתנאי השימוש של האתר יחולו גם על מדיניות פרטיות זו. המשרד "Aiterra" (להלן: "המשרד" או "בית העסק") רשאי לעדכן, לשנות או לתקן מעת לעת את תנאי השימוש ואת מדיניות הפרטיות, וזאת לפי שיקול דעתו הבלעדי, ופרסום השינויים באתר יהווה הודעה עליהם.
                </li>
                <li>
                  מדיניות הפרטיות ותנאי השימוש נכתבו בלשון זכר יחיד לשם נוחות בלבד, אולם הם מתייחסים לכל המינים ולרבים כאחד. הכותרות נועדו לנוחות בלבד ואין לייחס להן פרשנות משפטית.
                </li>
                <li>
                  מדיניות פרטיות זו חלה על השימוש באתר ועל הפעולות בו, לרבות מסירת מידע באמצעות טפסי צור קשר, הרשמה לניוזלטר, חיפוש נכסים וכל שימוש אחר באתר. המדיניות אינה חלה על שירותים או מוצרים אחרים של המשרד המוסדרים בהסכמים נפרדים (כגון הסכמי תיווך חתומים).
                </li>
                <li>
                  הדין החל על מדיניות פרטיות זו הוא הדין הישראלי, והיא כפופה להוראות חוק הגנת הפרטיות, התשמ"א–1981 (להלן: "חוק הגנת הפרטיות") ולכל הוראת דין קוגנטית אחרת.
                </li>
                <li>
                  במסגרת השימוש באתר, המשרד פועל בהתאם לעקרונות חוק הגנת הפרטיות.
                </li>
              </ul>
            </section>

            {/* Section: הסכמה */}
            <section className="privacy-section">
              <h2>הסכמה</h2>
              <ul>
                <li>
                  מעצם השימוש באתר האינטרנט, אתה מאשר מרצונך החופשי את תנאי השימוש ומדיניות הפרטיות של המשרד, ובכלל זאת אתה מאשר למשרד לאסוף, לעבד ולעשות שימוש במידע האישי שלך בהתאם להוראות מדיניות זו.
                </li>
                <li>
                  ידוע לך כי אינך חייב למסור כל מידע אישי במהלך השימוש באתר וכי מסירת המידע תלויה ברצונך ובהסכמתך בלבד. עם זאת, הימנעות ממסירת מידע עשויה לפגוע ביכולת השימוש או ההנאה שלך מן האתר או מן השירותים המוצעים בו (לדוגמה: יצירת קשר לצורך תיאום סיור בנכס).
                </li>
              </ul>
            </section>

            {/* Section: איסוף מידע */}
            <section className="privacy-section">
              <h2>איסוף מידע</h2>
              <p className="section-intro">
                במסגרת השימוש באתר, המשרד עשוי לאסוף את סוגי המידע הבאים:
              </p>

              <div className="info-item">
                <h3>פרטי התקשרות</h3>
                <p>
                  שם מלא, כתובת, דוא"ל, טלפון, והערות כלליות (כפי שנמסרו בטופס צור קשר או בטופס מתעניינים בנכס).
                </p>
              </div>

              <div className="info-item">
                <h3>פרטי התעניינות בנכס</h3>
                <p>
                  סוג הנכס המבוקש, תקציב, אזור מבוקש ונתונים רלוונטיים נוספים שנמסרו על ידך מרצונך החופשי.
                </p>
              </div>

              <div className="info-item">
                <h3>מידע טכני ושימושי</h3>
                <p>
                  תוני גלישה, כתובת IP, עוגיות (Cookies), סוג דפדפן, דפוסי שימוש באתר, חותמות שעה ותאריך.
                </p>
              </div>

              <div className="info-item">
                <h3>Google Analytics ועוגיות</h3>
                <p>
                  לידיעתכם, האתר עושה שימוש ב"עוגיות" (Cookies) ובממשקי סטטיסטיקה (כגון Google Analytics). השימוש נעשה לצורך שמירת תיעוד סטטיסטי אנונימי, ניתוח תנועת הגולשים, בדיקת דפוסי גלישה וזמני שהייה באתר, וזאת כדי לשפר את חווית המשתמש ולהתאים עבורו תכנים שיווקיים (Remarketing).
                </p>
              </div>

              <div className="info-item">
                <h3>מידע סטטיסטי</h3>
                <p>
                  נתונים שאינם מזהים אישית ואשר נוגעים לפעילות כללית באתר, ומשמשים לצורכי ניתוח ושיפור השירותים.
                </p>
              </div>

              <div className="info-item">
                <h3>מידע פיננסי</h3>
                <p>
                  האתר אינו שומר פרטי אשראי. תשלומים מתבצעים באמצעות חברות חיצוניות בלבד, ובית העסק אינו נחשף לפרטי כרטיסי האשראי של המשתמשים.
                </p>
              </div>
            </section>

            {/* Section: השימוש במידע */}
            <section className="privacy-section">
              <h2>השימוש במידע</h2>
              <p className="section-intro">
                המשרד לא יעשה שימוש ולא ימסור מידע אישי אודותיך אלא בהתאם למטרות המפורטות במדיניות זו ובהתאם להוראות הדין. השימוש במידע עשוי להיעשות, בין היתר, לצרכים הבאים:
              </p>
              <ul>
                <li>זיהוי משתמש לצורך שימוש באתר ומתן מענה לפניות.</li>
                <li>יצירת קשר עם המשתמש, תיאום פגישות, ומתן שירותי תיווך וייעוץ נדל"ן.</li>
                <li>הצגת נכסים רלוונטיים המותאמים להעדפות המשתמש.</li>
                <li>העברת מידע לספקי שירות רלוונטיים רק לצורך מתן השירות המבוקש (כגון ספקי תוכנה לניהול לקוחות).</li>
                <li>שמירת מידע לצורך תיעוד ובירור עתידי.</li>
                <li>מחקר, ניתוח נתונים והפקת סטטיסטיקות לשם שיפור השירותים.</li>
                <li>עמידה בהוראות דין, בירור תלונות, התמודדות עם הליכים משפטיים, מניעת הונאה או שימוש בלתי חוקי באתר.</li>
              </ul>

              <div className="info-item highlight">
                <h3>דיוור ישיר ודברי פרסומת</h3>
                <p>
                  בעת השארת פרטים באתר, המשתמש מאשר למשרד לשלוח אליו דיוור ישיר, עדכונים, הודעות שיווקיות, מבצעים ודברי פרסומת (לרבות של צדדים שלישיים המשתפים פעולה עם המשרד, כגון יועצי משכנתאות ועו"ד), וזאת באמצעות דוא"ל, מסרונים (SMS), וואטסאפ או אמצעי תקשורת אחרים. המשתמש רשאי בכל עת לבטל את הסכמתו ולהפסיק לקבל מידע זה באמצעות לחיצה על כפתור "הסר" המופיע בתחתית ההודעות, או על ידי פנייה ישירה למשרד.
                </p>
              </div>
            </section>

            {/* Section: שמירת המידע */}
            <section className="privacy-section">
              <h2>שמירת המידע</h2>
              <p>
                מידע שנמסר למשרד אגב השימוש באתר יישמר במאגרי המידע של המשרד ו/או אצל ספקי שירות מטעמו, לרבות ספקי אחסון, גיבוי וניהול מערכות מידע (CRM). לצורך הגנה על המידע האישי, המשרד מיישם אמצעי אבטחת מידע מקובלים וסבירים, בהתאם להוראות הדין.
              </p>
              <p>
                עם זאת, המשרד אינו יכול להתחייב כי האתר חסין לחלוטין מפני חדירה או גישה בלתי מורשית מצדדים שלישיים. לפיכך, המשרד לא יישא באחריות לכל נזק שייגרם עקב זליגת מידע, שינוי או שימוש בלתי מורשה, אלא אם יוכח כי הנזק נגרם עקב רשלנות חמורה או זדון מצד המשרד.
              </p>
            </section>

            {/* Section: שיתוף במידע */}
            <section className="privacy-section">
              <h2>שיתוף במידע</h2>
              <p>
                מידע אישי של משתמש עשוי להיות נגיש למשרד ולעובדיו (לרבות סוכני הנדל"ן), וכן לספקי שירות חיצוניים הפועלים מטעמו לצורך מתן שירותים למשתמש. המשרד רשאי להעביר מידע אישי לצדדים שלישיים, ללא צורך בהסכמה נוספת, במקרים הבאים:
              </p>
              <ul>
                <li>לשם מתן שירותים למשתמש (כגון ספקי דיוור, מערכות ניהול לקוחות).</li>
                <li>כאשר יש צורך למנוע נזק למשתמש או לצדדים שלישיים.</li>
                <li>כאשר מסירת המידע נדרשת לפי דין, צו שיפוטי או הוראת רשות מוסמכת.</li>
                <li>כאשר עולה חשש שהמשתמש ביצע פעולה אסורה על פי דין או בניגוד לתנאי השימוש.</li>
                <li>כאשר מסירת המידע דרושה לצורך ניהול הליכים משפטיים שבהם מעורב המשרד.</li>
                <li>במסגרת מיזוג, שינוי מבני או העברת פעילות עסקית של המשרד.</li>
              </ul>
            </section>

            {/* Section: זכויות בקשר למידע */}
            <section className="privacy-section">
              <h2>זכויות בקשר למידע</h2>

              <div className="info-item">
                <h3>זכות לעיון</h3>
                <p>
                  כל אדם זכאי לעיין במידע האישי השמור עליו במאגר המידע של המשרד, בעצמו או באמצעות בא כוחו המוסמך לכך.
                </p>
              </div>

              <div className="info-item">
                <h3>זכות לתיקון ומחיקה</h3>
                <p>
                  כל אדם רשאי לפנות למשרד בבקשה לתקן או למחוק מידע אישי הנוגע לו אם מצא כי אינו נכון, שלם, ברור או מעודכן. במקרה של סירוב, תימסר הודעה מנומקת למבקש בהתאם להוראות הדין.
                </p>
              </div>

              <div className="info-item">
                <h3>זכות להגבלת שימוש</h3>
                <p>
                  המשתמש רשאי לבקש כי המידע עליו לא ישמש למטרות מסוימות, אלא אם קיימת חובה חוקית אחרת.
                </p>
              </div>

              <div className="info-item">
                <h3>מימוש זכויות</h3>
                <p>
                  לשם מימוש הזכויות לעיון, תיקון או מחיקה, יש לפנות למשרד בפרטי ההתקשרות המופיעים בסוף מדיניות זו.
                </p>
              </div>
            </section>

            {/* Section: פרטיות ילדים וקטינים */}
            <section className="privacy-section">
              <h2>פרטיות ילדים וקטינים</h2>
              <p>
                האתר אינו מיועד לשימוש על ידי קטינים מתחת לגיל 18, אלא באישור הורה או אפוטרופוס.
              </p>
            </section>

            {/* Section: עדכון מדיניות פרטיות */}
            <section className="privacy-section">
              <h2>עדכון מדיניות פרטיות</h2>
              <p>
                המשרד רשאי לעדכן את מדיניות פרטיות זו מעת לעת. המשך השימוש באתר לאחר עדכון המדיניות מהווה הסכמה למדיניות המעודכנת.
              </p>
            </section>

            {/* Section: פרטי התקשרות */}
            <section className="privacy-section contact-section">
              <h2>פרטי התקשרות</h2>
              <p>
                בכל שאלה הנוגעת למדיניות פרטיות זו, ניתן לפנות אלינו בפרטים הבאים:
              </p>
              <div className="contact-details">
                <p><strong>שם בית העסק:</strong> Aiterra</p>
                <p><strong>דוא"ל:</strong> daniel.sharon.re@gmail.com</p>
                <p><strong>טלפון:</strong> 052-384-7291</p>
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
          background: #f5f7fb;
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
          background: #f5f7fb;
        }

        .privacy-section {
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(5, 17, 80, 0.1);
        }

        .privacy-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .privacy-section h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #051150;
          margin: 0 0 1.5rem 0;
          line-height: 1.3;
          font-family: var(--font-caramel), cursive, sans-serif;
        }

        .privacy-section h3 {
          font-size: 1.35rem;
          font-weight: 600;
          color: #051150;
          margin: 1.5rem 0 0.75rem 0;
          font-family: var(--font-caramel), cursive, sans-serif;
        }

        .privacy-section p {
          font-size: 1.05rem;
          line-height: 1.85;
          color: #374151;
          margin-bottom: 1rem;
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
          color: #2A69C4;
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
          border: 1px solid rgba(5, 17, 80, 0.08);
        }

        .info-item h3 {
          margin-top: 0;
        }

        .info-item p {
          margin-bottom: 0;
        }

        .info-item.highlight {
          background: rgba(85, 148, 241, 0.08);
          border-color: rgba(85, 148, 241, 0.2);
        }

        .contact-section {
          background: #f4f6fb;
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid rgba(5, 17, 80, 0.1);
        }

        .contact-details {
          margin-top: 1.5rem;
        }

        .contact-details p {
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
        }

        .contact-details strong {
          color: #051150;
          font-weight: 600;
        }

        strong {
          color: #051150;
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
