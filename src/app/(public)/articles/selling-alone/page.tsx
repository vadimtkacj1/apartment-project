'use client';
import React from 'react';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/ui/FAQ';
import '../foreign-investors/styles.css';

export default function SellingAloneArticle() {
  const faqItems: FAQItem[] = [
    {
      question: '"האם זה אומר שאני אקבל פחות כסף בסוף?"',
      answer: '<strong>להפך.</strong> הסטטיסטיקה מראה שדירה שנמכרת בעזרת מתווך מנוסה נסגרת במחיר הגבוה ב-5% עד 10% ממכירה עצמאית. זה מכסה את העמלה ומשאיר לכם עודף גדול בכיס.'
    },
    {
      question: '"למה שלא אפרסם לבד ורק אם לא ילך אפנה אליכם?"',
      answer: '<strong>כי השוק זוכר.</strong> דירה שפורסמה חודשיים ולא נמכרה מקבלת "סטיגמה". הקונים רואים ומציעים הצעות נמוכות. עדיף להתחיל חזק ונכון מהיום הראשון.'
    },
    {
      question: '"אתם עובדים בבלעדיות?"',
      answer: '<strong>כן, ובשבילכם זה יתרון.</strong> בבלעדיות אנחנו משקיעים כסף בפרסום, צילום מקצועי ושיתופי פעולה, כי אנחנו מחויבים לתוצאה. בלי בלעדיות? אף אחד לא באמת עובד בשבילכם.'
    }
  ];

  return (
    <div className="article-page" dir="rtl">
      {/* Hero with Background Image */}
      <SecondaryHero
        img="/7.jpg"
        title='למכור לבד? כשה"חיסכון" בתיווך עולה לכם עשרות אלפי שקלים'
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
                אין תחושה מפתה יותר מזו: החלטתם למכור את הדירה, עשיתם חישוב מהיר במחשבון, ואמרתם לעצמכם: "למה שנשלם 2% למתווך? נעלה מודעה ליד2, נראה את הבית פעמיים בשבוע, והכסף יישאר בכיס שלנו".
              </p>
              
              <div className="content-flex-layout">
                <div className="text-column">
                  <p>
                    על הנייר? זה נשמע גאוני. בין אם אתם מוכרים דירה בקרית שרת בחולון או דירת גן בבת ים, המחשבה הראשונה היא תמיד לחסוך בפועל. זה הרגע שבו הסיוט מתחיל. הטלפון לא מפסיק לצלצל בשעות לא סבירות, אנשים קובעים ולא מגיעים, אלו שכן מגיעים זורקים הערות מעליבות על הנכס שלכם, וההצעות שאתם מקבלים רחוקות שנות אור ממה שחשבתם.
                  </p>
                  <p>
                    באותו רגע, התחושה היא שאתם לבד במערכה. שכולם מנסים להוריד אתכם במחיר. אז רגע לפני שאתם מתייאשים ומורידים את המחיר ב-100,000 ש"ח רק כדי "לסיים עם זה" - עצרו רגע.
                  </p>
                  <p>
                    אנחנו במשרד חיים את השטח בחולון, בת ים וראשל"צ כבר 24 שנים. אנחנו יודעים בדיוק למה הדירה שלכם עדיין לא נמכרה, והחדשות הטובות? בהרבה מהמקרים, שינוי אסטרטגיה קטן יכול להביא את הקונה הנכון במחיר המקסימלי.
                  </p>
                </div>
                <div className="image-column">
                  <img src="/images/masterkaspler_A_candid_photograph_of_a_stressed_homeowner_sit_6c1f29f0-7069-4770-a24a-f80d5f110b06_2.png" alt="מכירת דירה" className="article-side-img" />
                </div>
              </div>
            </section>

            {/* Section 1: Why the apartment is burning */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>למה הדירה "נשרפת" בשוק?</h2>
              <p>
                בשוק הנדל"ן של היום, הרושם הראשוני הוא הכל. קונים פוטנציאליים סורקים עשרות מודעות בדקה ומשווים אתכם לדירות בשכונת אגרובנק בחולון או בפרויקטים החדשים בפארק הים בבת ים הם רואים מה שאנחנו קוראים לו "רמזור":
              </p>
              <p>
                <strong>ירוק:</strong> דירה אטרקטיבית, מתומחרת נכון, מוצגת מקצועית.
              </p>
              <p>
                <strong>אדום:</strong> דירה ש"יושבת" הרבה זמן, מחיר לא ריאלי, תמונות חשוכות.
              </p>
              <p>
                הבעיה היא שמוכר פרטי פועל מהבטן. הוא מתמחר לפי הרגש ולא לפי השוק. מבחינת הקונים? אתם "מוכרים לא רציניים". <strong>מבחינתנו? יש כאן נכס יהלום שרק צריך ליטוש נכון כדי לזהור.</strong>
              </p>
            </section>

            {/* Section 2: The Biggest Mistake */}
            <section className="article-section">
              <div className="content-flex-layout reverse">
                <div className="text-column">
                  <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>הטעות הכי גדולה של מוכרים לבד: להיות "מדריך טיולים"</h2>
                  <p>
                    כשאתם מפרסמים לבד, אתם הופכים למוקדייה. כל אדם שמשעמם לו בערב מתקשר. <strong>זו טעות קריטית.</strong>
                  </p>
                  <p>
                    אתם מכניסים הביתה "תיירי נדל"ן" – אנשים שאין להם אישור עקרוני למשכנתא, שרק "בודקים דופק", או שחולמים על פנטהאוז בראשון לציון מערב אבל התקציב שלהם מתאים לדירת 3 חדרים ישנה.
                  </p>
                  <p>
                    אתם מבזבזים זמן יקר, מתסכלים את בני המשפחה, ושוחקים את הנכס. <strong>אצלנו? אף קונה לא נכנס בדלת לפני שעבר סינון קפדני.</strong>
                  </p>
                </div>
                <div className="image-column">
                  <img src="/images/Gemini_Generated_Image_u7vh7fu7vh7fu7vh - Edited.png" alt="תיווך נדל״ן" className="article-side-img" />
                </div>
              </div>
            </section>

            {/* Section 3: Our System */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>איך השיטה שלנו מביאה את המחיר המקסימלי?</h2>
              <p>
                כאן נכנס לתמונה הניסיון של הצוות שלנו, בהובלת רם וחיים. התהליך אצלנו עובד כמו מבצע צבאי מדויק:
              </p>

              <div className="content-flex-layout">
                <div className="text-column">
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>תמחור כירורגי</h3>
                  <p>
                    אנחנו לא מנחשים. אנחנו מבצעים <strong>הערכת שווי נכס</strong> המבוססת על עסקאות אמת שנסגרו ברחוב שלכם (בין אם זה בנאות רחל או במתחם האלף) בחודש האחרון.
                  </p>

                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>סינון פיננסי מקדים</h3>
                  <p>
                    אנחנו מוודאים שלקונה יש יכולת כלכלית (לעתים קרובות בעזרת שותפנו, <a href="https://avi-mashkanta.com/" className="hyper-link" target="_blank" title="אבי בוקעי | הבית למשכנתאות"><b>אבי בוקעי — "אבי הבית למשכנתאות"</b></a>, שבונה איתם את תקציב הרכישה המדויק לפני הביקור).
                  </p>

                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>ניהול מו"מ נטול רגשות</h3>
                  <p>
                    קשה לנהל משא ומתן על הבית שבו גדלו הילדים. כל הערה מרגישה אישית. אנחנו מהווים "חגורת ביטחון", מנטרלים את הרגש ומנהלים מו"מ עסקי קר כדי להעלות את ההצעה למקסימום.
                  </p>
                </div>
                <div className="image-column">
                  <img src="/images/masterkaspler_Macro_photography_of_a_rough_unpolished_dirty_d_9ea3dc86-3e2d-4f5c-81f0-19cc7083f257_2.png" alt="ייעוץ מקצועי" className="article-side-img" />
                </div>
              </div>
            </section>

            {/* Section 4: Why Choose Us */}
            <section className="article-section">
              <div className="content-flex-layout reverse">
                <div className="text-column">
                  <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>למה דווקא אנחנו?</h2>
                  <p>
                    במכירת הדירה היקרה לכם, אין מקום לניסוי וטעייה. מתווך מתחיל אולי ייקח עמלה נמוכה, אבל יעלה לכם ביוקר במחיר הסופי.
                  </p>
                  <p>
                    הוותק שלנו (24 שנים!) והעובדה שאנחנו עובדים ידנית ואישית, מאפשרים לנו להגיע לקונים שנמצאים "מתחת לרדאר" (כמו לדוגמה משקיעים שמחפשים דירות להשקעה ליד הרכבת הקלה) - <strong>משקיעים ולקוחות רציניים שלא יושבים כל היום ביד2.</strong>
                  </p>
                </div>
                <div className="image-column">
                  <img src="/images/masterkaspler_A_close-up_photograph_of_a_firm_handshake_betwe_4d324466-a227-404c-b8fb-60648a16bfbd_2.png" alt="מכירת נכס" className="article-side-img" />
                </div>
              </div>
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