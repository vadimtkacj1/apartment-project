'use client';
import React from 'react';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/ui/FAQ';
import './styles.css';

export default function ForeignInvestorsArticle() {
  const faqItems: FAQItem[] = [
    {
      question: '"האם אני חייב להגיע לארץ כדי לחתום?"',
      answer: '<strong>ברוב המקרים - לא.</strong> בעזרת ייפוי כוח נוטריוני ועורכי הדין שאנחנו עובדים איתם, ניתן לבצע את כל תהליך <em>הרכישה (Buying Property in Israel)</em> מרחוק בצורה מאובטחת וחוקית לחלוטין.'
    },
    {
      question: '"מי מבטיח לי שהשיפוץ יתבצע כמו שצריך?"',
      answer: '<strong>אנחנו.</strong> אנחנו שולחים לכם וידאו ותמונות בזמן אמת מהשטח. אתם רואים את הריצוף, את הצבע ואת המטבח החדש מתקדם, בלי לצאת מהבית בחו"ל.'
    },
    {
      question: '"אתם מטפלים גם בנכסים מסחריים?"',
      answer: '<strong>בהחלט.</strong> יש לנו ניסיון רב עם מגרשים, מפעלים ועסקים, כולל ניהול המורכבויות הייחודיות של נדל"ן מסחרי.'
    }
  ];

  return (
    <div className="article-page" dir="rtl">
      {/* Hero with Background Image */}
      <SecondaryHero
        img="/7.jpg"
        title="נדל״ן בשלט רחוק: כשאתם בחו״ל והלב רוצה"
        centered={true}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <div className="article-container">
        <article className="article-content">

          {/* Main Content */}
          <div className="article-body">
            {/* Introduction */}
            <section className="article-section">
              <p className="lead-paragraph">
                אין תחושה מתסכלת יותר מזו: אתם גרים מעבר לים, עובדים קשה, ורואים איך מחירי הנדל"ן בישראל ממשיכים לטוס למעלה בלעדיכם. אתם רוצים לקנות דירה להשקעה בחולון, דירה מול הים בבת ים, או ראשל"צ ולהבטיח את העתיד של הילדים, אבל המרחק משתק.
              </p>
              
              <div className="content-flex-layout">
                <div className="text-column">
                  <p>
                    איך אפשר לקנות דירה בלי לראות אותה? מי ישפץ אותה כשהקבלן יבריז? ומי ירדוף אחרי השוכר בראשון לחודש כשאתם נמצאים באזור זמן אחר לגמרי?
                  </p>
                  <p>
                    באותו רגע, הפחד מניצול או מהונאה גובר על הרצון להשקיע. הכסף נשאר בבנק ונשחק. אז רגע לפני שאתם מוותרים על החלום לדירה בארץ - עצרו רגע.
                  </p>
                  <p>
                    אנחנו במשרד מבינים את המצוקה הזו בדיוק. כבר שנים שאנחנו משמשים כ"עיניים והידיים" של תושבי חוץ ומשקיעים. והחדשות הטובות? <strong>אפשר לנהל נדל"ן בישראל באפס מאמץ</strong>, אם יש לכם ניהול נכס (Property Management) מקצועי בשטח.
                  </p>
                </div>
                <div className="image-column">
                  <img src="/images/LuxuryLiving.jpg" alt="נדל״ן בישראל" className="article-side-img" />
                </div>
              </div>
            </section>

            {/* Section 1: Why Foreign Investors Fear */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>למה משקיעים מחו"ל (Foreign Investors) מפחדים לקנות?</h2>
              <p>
                המרחק יוצר חוסר ודאות. כשאתם לא כאן, כל דבר קטן נראה כמו הר ענק:
              </p>
              <p>
                <strong>נורה אדומה:</strong> הדוד התפוצץ? הדייר לא משלם? הוועד בית רודף אחריכם?
              </p>
              <p>
                <strong>נורה שחורה:</strong> קניתם נכס שנראה טוב בתמונות, אבל בפועל הוא באזור מוזנח שמיועד להריסה.
              </p>
              <p>
                הבעיה היא שרוב המתווכים רק רוצים "לסגור עסקה" ולהיעלם. מבחינתם, השיפוץ והניהול זו הבעיה שלכם. <strong>מבחינתנו? העסקה היא רק תחילת היחסים.</strong> אנחנו בונים לכם "כיפת ברזל" ניהולית.
              </p>
            </section>

            {/* Section 2: The Biggest Mistake */}
            <section className="article-section">
              <div className="content-flex-layout reverse">
                <div className="text-column">
                  <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>הטעות הכי גדולה של תושבי חוץ: לסמוך על "מזל" או קרובי משפחה</h2>
                  <p>
                    הרבה משקיעים מפילים את התיק על "דוד שגר בארץ" או מנסים לנהל את השיפוץ בוואטסאפ מול קבלן מזדמן. <strong>זו טעות קריטית.</strong>
                  </p>
                  <p>
                    מעבר לכאב הראש, יש כאן מלכודות פיננסיות: החל מחישוב שגוי של <em>מס רכישה (Purchase Tax)</em> ועד אי-ידיעת החוקים לגבי <em>משכנתא לתושבי חוץ (Mortgage for Foreigners)</em>.
                  </p>
                  <p>
                    הדוד מתעייף, הקבלן מבין שאתם לא בשטח ומעגל פינות, והתשואה שלכם נפגעת. <strong>נדל"ן להשקעה חייב להיות מנוהל כמו עסק, לא כמו טובה משפחתית.</strong>
                  </p>
                </div>
                <div className="image-column">
                  <img src="/images/minimalist-tel-aviv-apartment.jpg" alt="ניהול נכסים" className="article-side-img" />
                </div>
              </div>
            </section>

            {/* Section 3: Our System */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>איך המעטפת שלנו עובדת?</h2>
              <p>
                כאן נכנס לתמונה היתרון העצום שלנו – <strong>אנחנו לא רק מתווכים, אנחנו מנהלי פרויקטים.</strong> התהליך אצלנו עובד מקצה לקצה:
              </p>

              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>1. איתור ההזדמנות</h3>
              <p>
                בזכות הוותק, אנחנו מגיעים לנכסים (דירות, מגרשים, מסחרי) עוד לפני שהם יוצאים לשוק - כולל פרויקטים של <strong>התחדשות עירונית (Urban Renewal)</strong> בחולון והזדמנויות ליד הרכבת הקלה בבת ים.
              </p>

              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>2. שיפוץ והשבחה</h3>
              <p>
                יש לנו <strong>צוותי שיפוץ ותחזוקה משלנו</strong>. אנחנו לא מפנים אתכם לקבלן - אנחנו מפקחים עליו. אנחנו נהפוך חורבה לדירת בונבוניירה שתניב שכירות גבוהה.
              </p>

              <div className="content-flex-layout">
                <div className="text-column">
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>3. מעטפת פיננסית</h3>
                  <p>
                    אנחנו עובדים צמוד עם <strong>אבי בוקעי ("אבי - הבית למשכנתאות")</strong> ועם עורכי דין המתמחים במיסוי לתושבי חוץ, כדי לוודא שהכסף עובר חלק והמימון (משכנתא) מאושר בתנאים הטובים ביותר.
                  </p>

                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>4. ניהול שוטף (השקט שלכם)</h3>
                  <p>
                    מציאת שוכרים, גביית תשלומים, ותיקון תקלות. <strong>אתם מקבלים רק את הדיווח בבנק.</strong>
                  </p>
                </div>
                <div className="image-column">
                  <img src="/images/360_F_651602712_C8pj3T2vA73H0oyL1tSF9pvU6ginjecp.jpg" alt="שירותי נדל״ן" className="article-side-img" />
                </div>
              </div>
            </section>

            {/* Section 4: Why Choose Us */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>למה דווקא אנחנו?</h2>
              <p>
                בניהול נכסים בשלט רחוק, <strong>אמון הוא המטבע החשוב ביותר</strong>. עם 24 שנות ניסיון ותעודות, אנחנו גוף יציב עם כתובת פיזית ומוניטין של אמינות וזמינות.
              </p>
              <p>
                אנחנו לא "חברה וירטואלית", אלא אנשים אמיתיים – <strong>רם, חיים והצוות</strong> - שדואגים לנכס שלכם כאילו הוא שלנו.
              </p>
            </section>

            {/* Section 5: FAQ */}
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
        .article-side-img {
          width: 100%;
          height: auto;
          border-radius: 8px;
          object-fit: cover;
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