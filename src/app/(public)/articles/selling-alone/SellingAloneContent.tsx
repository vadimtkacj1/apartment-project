'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ArticleByline from '@/components/SEO/ArticleByline';
import FAQ, { FAQItem } from '@/components/ui/FAQ';
import '../foreign-investors/styles.css';

export default function SellingAloneContent() {
  const faqItems: FAQItem[] = [
    {
      question: '"האם זה אומר שאני אקבל פחות כסף בסוף?"',
      answer: '<strong>להפך.</strong> מהניסיון שלנו לאורך 24 שנה, דירה שנמכרת בעזרת מתווך מנוסה נסגרת לרוב במחיר הגבוה ב-5% עד 10% ממכירה עצמאית. הפער הזה מכסה את העמלה ומשאיר לכם עודף גדול בכיס.'
    },
    {
      question: '"למה שלא אפרסם לבד ורק אם לא ילך אפנה אליכם?"',
      answer: '<strong>כי השוק זוכר.</strong> דירה שפורסמה חודשיים ולא נמכרה מקבלת "סטיגמה". הקונים רואים ומציעים הצעות נמוכות. עדיף להתחיל חזק ונכון מהיום הראשון.'
    },
    {
      question: '"אתם עובדים בבלעדיות?"',
      answer: '<strong>כן, ובשבילכם זה יתרון.</strong> בבלעדיות אנחנו משקיעים כסף בפרסום, צילום מקצועי ושיתופי פעולה, כי אנחנו מחויבים לתוצאה. בלי בלעדיות? אף אחד לא באמת עובד בשבילכם.'
    },
    {
      question: '"כמה עולה למכור דירה לבד?"',
      answer: '<strong>לכאורה כלום — חוסכים את העמלה.</strong> בפועל מכירה עצמאית עולה לרוב הרבה יותר: תמחור שגוי, חודשים על השוק שיוצרים סטיגמה, והצעות נמוכות מקונים שמזהים חוסר ניסיון. מהניסיון שלנו דירה עם מתווך מנוסה נסגרת ב-5% עד 10% יותר — פער שמכסה את העמלה ומשאיר עודף בכיס.'
    },
    {
      question: '"איך למכור דירה ללא תיווך?"',
      answer: '<strong>אפשר — אבל לא כל אחד בנוי לזה.</strong> מכירה עצמאית דורשת תמחור מדויק מול עסקאות אמת ברחוב שלכם, צילום ושיווק מקצועי, סינון פיננסי של קונים, תיאום סיורים וניהול משא ומתן מול קונים מנוסים. טעות באחד מהשלבים עולה בדרך כלל יותר מהעמלה כולה — ולכן רוב מי שמתחיל לבד פונה אלינו בהמשך.'
    },
    {
      question: '"מדוע כדאי למכור דירה עם מתווך?"',
      answer: '<strong>כי מתווך מנוסה לא עולה לכם — הוא מרוויח לכם.</strong> תמחור נכון מהיום הראשון, חשיפה לקונים רציניים שלא יושבים כל היום ביד2, סינון שמכניס הביתה רק קונים עם יכולת כלכלית, ומשא ומתן קר ועסקי שמעלה את ההצעה למקסימום. השורה התחתונה: מחיר סופי גבוה יותר, פחות כאב ראש, ועסקה בטוחה.'
    }
  ];

  return (
    <div className="article-page" dir="rtl">
      <SecondaryHero
        img="/7.jpg"
        title='למכור לבד? כשה"חיסכון" בתיווך עולה לכם עשרות אלפי שקלים'
        centered={true}
      />
      <Breadcrumbs />
      <div className="article-container">
        <article className="article-content">
          <div className="article-body">
            <ArticleByline id="selling-alone" />
            <section className="article-section">
              <p className="lead-paragraph">
                אין תחושה מפתה יותר מזו: החלטתם למכור את הדירה, עשיתם חישוב מהיר במחשבון, ואמרתם לעצמכם: &quot;למה שנשלם 2% למתווך? נעלה מודעה ליד2, נראה את הבית פעמיים בשבוע, והכסף יישאר בכיס שלנו&quot;.
              </p>
              <div className="definition-block">
                <p><span className="definition-term">מכירה עצמאית</span> (FSBO – For Sale By Owner) היא מכירת דירה בידי הבעלים עצמם, ללא מתווך נדל&quot;ן: המוכר אחראי לבדו על התמחור, הפרסום, סינון הקונים, תיאום הסיורים וניהול המשא ומתן. הוא חוסך את עמלת התיווך, אך נושא לבדו בכל הסיכון והעומס.</p>
              </div>
              <div className="content-flex-layout">
                <div className="text-column">
                  <p>
                    על הנייר? זה נשמע גאוני. בין אם אתם מוכרים דירה בקרית שרת בחולון או דירת גן בבת ים, המחשבה הראשונה היא תמיד לחסוך בפועל. זה הרגע שבו הסיוט מתחיל. הטלפון לא מפסיק לצלצל בשעות לא סבירות, אנשים קובעים ולא מגיעים, אלו שכן מגיעים זורקים הערות מעליבות על הנכס שלכם, וההצעות שאתם מקבלים רחוקות שנות אור ממה שחשבתם.
                  </p>
                  <p>
                    באותו רגע, התחושה היא שאתם לבד במערכה. שכולם מנסים להוריד אתכם במחיר. אז רגע לפני שאתם מתייאשים ומורידים את המחיר ב-100,000 ש&quot;ח רק כדי &quot;לסיים עם זה&quot; - עצרו רגע.
                  </p>
                  <p>
                    אנחנו במשרד חיים את השטח בחולון, בת ים וראשל&quot;צ כבר 24 שנים. אנחנו יודעים בדיוק למה הדירה שלכם עדיין לא נמכרה, והחדשות הטובות? בהרבה מהמקרים, שינוי אסטרטגיה קטן יכול להביא את הקונה הנכון במחיר המקסימלי.
                  </p>
                </div>
                <div className="image-column">
                  <Image src="/images/masterkaspler_A_candid_photograph_of_a_stressed_homeowner_sit_6c1f29f0-7069-4770-a24a-f80d5f110b06_2.png" alt="מכירת דירה" width={600} height={450} loading="lazy" sizes="(max-width: 768px) 100vw, 45vw" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              </div>
            </section>

            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>למה הדירה &quot;נשרפת&quot; בשוק?</h2>
              <p>
                בשוק הנדל&quot;ן של היום, הרושם הראשוני הוא הכל. קונים פוטנציאליים סורקים עשרות מודעות בדקה ומשווים אתכם לדירות בשכונת אגרובנק בחולון או בפרויקטים החדשים בפארק הים בבת ים הם רואים מה שאנחנו קוראים לו &quot;רמזור&quot;:
              </p>
              <div className="geo-table-wrap">
                <table className="geo-table">
                  <caption>&quot;הרמזור&quot; של הקונים — איך נתפסת דירה בשוק</caption>
                  <thead>
                    <tr>
                      <th>רמזור</th>
                      <th>מאפייני הדירה</th>
                      <th>איך הקונים מגיבים</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ירוק</td>
                      <td>מתומחרת נכון, מוצגת מקצועית, תמונות מוארות</td>
                      <td>נכנסים לצפייה ומגישים הצעות רציניות במהירות</td>
                    </tr>
                    <tr>
                      <td>אדום</td>
                      <td>מחיר לא ריאלי, &quot;יושבת&quot; בשוק זמן רב, תמונות חשוכות</td>
                      <td>מדלגים, או מציעים הצעות נמוכות (&quot;כנראה יש כאן בעיה&quot;)</td>
                    </tr>
                  </tbody>
                </table>
                <span className="source-note">מקור: ניסיון המשרד בשוק חולון, בת ים וראשון לציון.</span>
              </div>
              <p>
                הבעיה היא שמוכר פרטי פועל מהבטן. הוא מתמחר לפי הרגש ולא לפי השוק. מבחינת הקונים? אתם &quot;מוכרים לא רציניים&quot;. <strong>מבחינתנו? יש כאן נכס יהלום שרק צריך ליטוש נכון כדי לזהור.</strong>
              </p>
            </section>

            <section className="article-section">
              <div className="content-flex-layout reverse">
                <div className="text-column">
                  <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>הטעות הכי גדולה של מוכרים לבד: להיות &quot;מדריך טיולים&quot;</h2>
                  <p>כשאתם מפרסמים לבד, אתם הופכים למוקדייה. כל אדם שמשעמם לו בערב מתקשר. <strong>זו טעות קריטית.</strong></p>
                  <p>
                    אתם מכניסים הביתה &quot;תיירי נדל&quot;ן&quot; – אנשים שאין להם אישור עקרוני למשכנתא, שרק &quot;בודקים דופק&quot;, או שחולמים על פנטהאוז בראשון לציון מערב אבל התקציב שלהם מתאים לדירת 3 חדרים ישנה.
                  </p>
                  <p>
                    אתם מבזבזים זמן יקר, מתסכלים את בני המשפחה, ושוחקים את הנכס. <strong>אצלנו? אף קונה לא נכנס בדלת לפני שעבר סינון קפדני.</strong>
                  </p>
                </div>
                <div className="image-column">
                  <Image src="/images/selling-alone.webp" alt="תיווך נדל״ן" width={600} height={450} loading="lazy" sizes="(max-width: 768px) 100vw, 45vw" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              </div>
            </section>

            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>איך השיטה שלנו מביאה את המחיר המקסימלי?</h2>
              <p>כאן נכנס לתמונה הניסיון של הצוות שלנו, בהובלת רם וחיים. התהליך אצלנו עובד כמו מבצע צבאי מדויק:</p>
              <div className="content-flex-layout">
                <div className="text-column">
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>תמחור כירורגי</h3>
                  <p>
                    אנחנו לא מנחשים. אנחנו מבצעים <strong>הערכת שווי נכס</strong> המבוססת על עסקאות אמת שנסגרו ברחוב שלכם (בין אם זה בנאות רחל או במתחם האלף) בחודש האחרון.
                  </p>
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>סינון פיננסי מקדים</h3>
                  <p>
                    אנחנו מוודאים שלקונה יש יכולת כלכלית (לעתים קרובות בעזרת שותפנו, <a href="https://avi-mashkanta.com/" className="hyper-link" target="_blank" rel="noopener noreferrer" title="אבי בוקעי | הבית למשכנתאות"><b>אבי בוקעי — &quot;אבי הבית למשכנתאות&quot;</b></a>, שבונה איתם את תקציב הרכישה המדויק לפני הביקור).
                  </p>
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>ניהול מו&quot;מ נטול רגשות</h3>
                  <p>
                    קשה לנהל משא ומתן על הבית שבו גדלו הילדים. כל הערה מרגישה אישית. אנחנו מהווים &quot;חגורת ביטחון&quot;, מנטרלים את הרגש ומנהלים מו&quot;מ עסקי קר כדי להעלות את ההצעה למקסימום.
                  </p>
                </div>
                <div className="image-column">
                  <Image src="/images/masterkaspler_Macro_photography_of_a_rough_unpolished_dirty_d_9ea3dc86-3e2d-4f5c-81f0-19cc7083f257_2.png" alt="ייעוץ מקצועי" width={600} height={450} loading="lazy" sizes="(max-width: 768px) 100vw, 45vw" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              </div>
            </section>

            <section className="article-section">
              <div className="content-flex-layout reverse">
                <div className="text-column">
                  <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>למה דווקא אנחנו?</h2>
                  <p>
                    במכירת הדירה היקרה לכם, אין מקום לניסוי וטעייה. מתווך מתחיל אולי ייקח עמלה נמוכה, אבל יעלה לכם ביוקר במחיר הסופי.
                  </p>
                  <p>
                    הוותק שלנו (24 שנים!) והעובדה שאנחנו עובדים ידנית ואישית, מאפשרים לנו להגיע לקונים שנמצאים &quot;מתחת לרדאר&quot; (כמו לדוגמה משקיעים שמחפשים דירות להשקעה ליד הרכבת הקלה) - <strong>משקיעים ולקוחות רציניים שלא יושבים כל היום ביד2.</strong>
                  </p>
                </div>
                <div className="image-column">
                  <Image src="/images/masterkaspler_A_close-up_photograph_of_a_firm_handshake_betwe_4d324466-a227-404c-b8fb-60648a16bfbd_2.png" alt="מכירת נכס" width={600} height={450} loading="lazy" sizes="(max-width: 768px) 100vw, 45vw" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              </div>
            </section>

            {/* Conversion CTA — funnels the DIY-intent reader to a free valuation
                rather than enabling a self-sale. */}
            <section className="article-section">
              <div dir="rtl" className="my-6 rounded-2xl bg-[#1c3664] p-8 text-center">
                <h2 className="text-3xl font-bold mb-3 text-white" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
                  רוצים לדעת כמה הדירה שלכם באמת שווה?
                </h2>
                <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto leading-relaxed">
                  במקום לנחש לבד — קבלו מאיתנו הערכת שווי חינם וללא התחייבות. נראה לכם בדיוק כמה אתם עלולים להפסיד במכירה עצמאית, ואיך אנחנו משיגים את המחיר המקסימלי.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/selling-apartment" className="px-8 py-3 rounded-sm bg-[#c5a357] text-[#1c3664] font-black hover:bg-[#d4b46b] transition-colors">
                    איך אנחנו מוכרים את הדירה שלכם
                  </Link>
                  <a href="tel:+972505496626" className="px-8 py-3 rounded-sm border-2 border-[#c5a357] text-[#c5a357] font-black hover:bg-[#c5a357] hover:text-[#1c3664] transition-colors">
                    דברו איתנו עכשיו
                  </a>
                </div>
              </div>
            </section>

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
