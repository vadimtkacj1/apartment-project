'use client';

import React from 'react';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import './styles.css';

export default function ForeignInvestorsArticle() {
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
              <p>
                איך אפשר לקנות דירה בלי לראות אותה? מי ישפץ אותה כשהקבלן יבריז? ומי ירדוף אחרי השוכר בראשון לחודש כשאתם נמצאים באזור זמן אחר לגמרי?
              </p>
              <p>
                באותו רגע, הפחד מניצול או מהונאה גובר על הרצון להשקיע. הכסף נשאר בבנק ונשחק. אז רגע לפני שאתם מוותרים על החלום לדירה בארץ - עצרו רגע.
              </p>
              <p>
                אנחנו במשרד מבינים את המצוקה הזו בדיוק. כבר שנים שאנחנו משמשים כ"עיניים והידיים" של תושבי חוץ ומשקיעים. והחדשות הטובות? <strong>אפשר לנהל נדל"ן בישראל באפס מאמץ</strong>, אם יש לכם ניהול נכס (Property Management) מקצועי בשטח.
              </p>
            </section>

            {/* Image */}
            <div className="article-image-section">
              <img src="/images/buildings.jpeg" alt="נדל״ן בישראל" className="content-image" />
            </div>

            {/* Section 1: Why Foreign Investors Fear */}
            <section className="article-section">
              <h2>למה משקיעים מחו"ל (Foreign Investors) מפחדים לקנות?</h2>
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
              <h2>הטעות הכי גדולה של תושבי חוץ: לסמוך על "מזל" או קרובי משפחה</h2>
              <p>
                הרבה משקיעים מפילים את התיק על "דוד שגר בארץ" או מנסים לנהל את השיפוץ בוואטסאפ מול קבלן מזדמן. <strong>זו טעות קריטית.</strong>
              </p>
              <p>
                מעבר לכאב הראש, יש כאן מלכודות פיננסיות: החל מחישוב שגוי של <em>מס רכישה (Purchase Tax)</em> ועד אי-ידיעת החוקים לגבי <em>משכנתא לתושבי חוץ (Mortgage for Foreigners)</em>.
              </p>
              <p>
                הדוד מתעייף, הקבלן מבין שאתם לא בשטח ומעגל פינות, והתשואה שלכם נפגעת. <strong>נדל"ן להשקעה חייב להיות מנוהל כמו עסק, לא כמו טובה משפחתית.</strong>
              </p>
            </section>

            {/* Image */}
            <div className="article-image-section">
              <img src="/images/info-card-1.jpg" alt="ניהול נכסים" className="content-image" />
            </div>

            {/* Section 3: Our System */}
            <section className="article-section">
              <h2>איך המעטפת שלנו עובדת?</h2>
              <p>
                כאן נכנס לתמונה היתרון העצום שלנו – <strong>אנחנו לא רק מתווכים, אנחנו מנהלי פרויקטים.</strong> התהליך אצלנו עובד מקצה לקצה:
              </p>

              <h3>1. איתור ההזדמנות</h3>
              <p>
                בזכות הוותק, אנחנו מגיעים לנכסים (דירות, מגרשים, מסחרי) עוד לפני שהם יוצאים לשוק - כולל פרויקטים של <strong>התחדשות עירונית (Urban Renewal)</strong> בחולון והזדמנויות ליד הרכבת הקלה בבת ים.
              </p>

              <h3>2. שיפוץ והשבחה</h3>
              <p>
                יש לנו <strong>צוותי שיפוץ ותחזוקה משלנו</strong>. אנחנו לא מפנים אתכם לקבלן - אנחנו מפקחים עליו. אנחנו נהפוך חורבה לדירת בונבוניירה שתניב שכירות גבוהה.
              </p>

              <h3>3. מעטפת פיננסית</h3>
              <p>
                אנחנו עובדים צמוד עם <strong>אבי בוקעי ("אבי - הבית למשכנתאות")</strong> ועם עורכי דין המתמחים במיסוי לתושבי חוץ, כדי לוודא שהכסף עובר חלק והמימון (משכנתא) מאושר בתנאים הטובים ביותר.
              </p>

              <h3>4. ניהול שוטף (השקט שלכם)</h3>
              <p>
                מציאת שוכרים, גביית תשלומים, ותיקון תקלות. <strong>אתם מקבלים רק את הדיווח בבנק.</strong>
              </p>
            </section>

            {/* Image */}
            <div className="article-image-section">
              <img src="/images/info-card-2.jpg" alt="שירותי נדל״ן" className="content-image" />
            </div>

            {/* Section 4: Why Choose Us */}
            <section className="article-section">
              <h2>למה דווקא אנחנו?</h2>
              <p>
                בניהול נכסים בשלט רחוק, <strong>אמון הוא המטבע החשוב ביותר</strong>. עם 24 שנות ניסיון ותעודות, אנחנו גוף יציב עם כתובת פיזית ומוניטין של אמינות וזמינות.
              </p>
              <p>
                אנחנו לא "חברה וירטואלית", אלא אנשים אמיתיים – <strong>רם, חיים והצוות</strong> - שדואגים לנכס שלכם כאילו הוא שלנו.
              </p>
            </section>

            {/* Section 5: FAQ */}
            <section className="article-section faq-section">
              <h2>שאלות נפוצות – רם וחיים עונים</h2>

              <div className="faq-item">
                <h3>"האם אני חייב להגיע לארץ כדי לחתום?"</h3>
                <p>
                  <strong>ברוב המקרים - לא.</strong> בעזרת ייפוי כוח נוטריוני ועורכי הדין שאנחנו עובדים איתם, ניתן לבצע את כל תהליך <em>הרכישה (Buying Property in Israel)</em> מרחוק בצורה מאובטחת וחוקית לחלוטין.
                </p>
              </div>

              <div className="faq-item">
                <h3>"מי מבטיח לי שהשיפוץ יתבצע כמו שצריך?"</h3>
                <p>
                  <strong>אנחנו.</strong> אנחנו שולחים לכם וידאו ותמונות בזמן אמת מהשטח. אתם רואים את הריצוף, את הצבע ואת המטבח החדש מתקדם, בלי לצאת מהבית בחו"ל.
                </p>
              </div>

              <div className="faq-item">
                <h3>"אתם מטפלים גם בנכסים מסחריים?"</h3>
                <p>
                  <strong>בהחלט.</strong> יש לנו ניסיון רב עם מגרשים, מפעלים ועסקים, כולל ניהול המורכבויות הייחודיות של נדל"ן מסחרי.
                </p>
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
