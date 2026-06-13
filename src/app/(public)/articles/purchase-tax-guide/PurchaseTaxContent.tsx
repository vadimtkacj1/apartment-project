'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/ui/FAQ';
import '../foreign-investors/styles.css';

export default function PurchaseTaxContent() {
  const faqItems: FAQItem[] = [
    {
      question: '"כמה מס רכישה אשלם על דירה יחידה?"',
      answer: '<strong>ברוב המקרים — אפס.</strong> רוכשי דירה יחידה נהנים ממדרגת מס של 0% עד לתקרה של כ-2 מיליון ש״ח (מתעדכנת מדי שנה). מעל התקרה המס עולה בהדרגה: 3.5%, 5%, 8% ו-10% על חלקי השווי הגבוהים יותר.'
    },
    {
      question: '"ומה אם יש לי כבר דירה ואני קונה עוד אחת?"',
      answer: '<strong>כאן המס מתחיל מהשקל הראשון.</strong> משקיעים משלמים 8% על חלק השווי עד כ-6 מיליון ש״ח ו-10% מעל לכך. אבל אם אתם משפרי דיור ומוכרים את הדירה הקיימת בתוך התקופה הקבועה בחוק — תיהנו ממדרגות של דירה יחידה.'
    },
    {
      question: '"האם אפשר לקבל החזר מס רכישה?"',
      answer: '<strong>כן, במקרים מסוימים.</strong> אם שילמתם מס כמשקיעים ומכרתם את הדירה הישנה בתוך התקופה הקבועה בחוק, מגיע לכם החזר על ההפרש. חשוב לעקוב אחרי המועדים ולהגיש את הבקשה בזמן.'
    }
  ];

  return (
    <div className="article-page" dir="rtl">
      <SecondaryHero
        img="/7.jpg"
        title="מס רכישה על דירה: המדריך שיחסוך לכם עשרות אלפי שקלים"
        centered={true}
      />

      <Breadcrumbs />

      <div className="article-container">
        <article className="article-content">
          <div className="article-body">
            {/* Introduction */}
            <section className="article-section">
              <p className="lead-paragraph">
                מצאתם את דירת החלומות בחולון, סגרתם מחיר עם המוכר, וכבר מדמיינים את עצמכם בסלון החדש. ואז עורך הדין שואל שאלה קטנה: &quot;זו הדירה היחידה שלכם?&quot; — והתשובה יכולה לשנות את העסקה בעשרות ואף מאות אלפי שקלים.
              </p>

              <div className="content-flex-layout">
                <div className="text-column">
                  <p>
                    מס רכישה הוא המס שמשלם כל מי שרוכש זכות במקרקעין בישראל, והוא מחושב לפי מדרגות — בדיוק כמו מס הכנסה. הבעיה? רוב הרוכשים מגלים את הסכום האמיתי רק אחרי שכבר התחייבו.
                  </p>
                  <p>
                    אחרי 24 שנים של ליווי עסקאות בחולון, בת ים וראשון לציון, ראינו לא מעט עסקאות שכמעט התפוצצו בגלל תכנון מס שגוי. <strong>החדשות הטובות: עם תכנון נכון מראש, אפשר לחסוך הרבה מאוד כסף — באופן חוקי לחלוטין.</strong>
                  </p>
                </div>
                <div className="image-column">
                  <Image src="/images/articles/purchase-tax.jpg" alt="חישוב מס רכישה על דירה" width={600} height={450} loading="lazy" sizes="(max-width: 768px) 100vw, 45vw" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              </div>
            </section>

            {/* Section 1 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>מהו מס רכישה ומי משלם אותו?</h2>
              <p>
                מס רכישה הוא תשלום חובה לרשות המיסים שחל על הקונה (לא על המוכר), והוא משולם בתוך 60 יום ממועד החתימה על החוזה. גובה המס תלוי בשלושה גורמים עיקריים:
              </p>
              <p>
                <strong>1. שווי העסקה</strong> — ככל שהדירה יקרה יותר, אחוז המס עולה במדרגות.
              </p>
              <p>
                <strong>2. מספר הדירות שבבעלותכם</strong> — דירה יחידה נהנית ממדרגות מס מופחתות משמעותית לעומת דירה שנייה.
              </p>
              <p>
                <strong>3. הסטטוס האישי שלכם</strong> — עולים חדשים, נכים ואוכלוסיות נוספות זכאים להקלות.
              </p>
            </section>

            {/* Section 2 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>מדרגות המס לדירה יחידה — כך זה עובד</h2>
              <p>
                אם זו הדירה היחידה שלכם, המדינה מקלה עליכם משמעותית: עד תקרה של כ-2 מיליון ש״ח (הסכום המדויק מתעדכן מדי ינואר) — <strong>המס הוא 0%</strong>. כלומר, רוב רוכשי הדירות בחולון ובבת ים לא משלמים מס רכישה כלל על דירה ראשונה.
              </p>
              <p>
                מעל התקרה, המס מחושב במדרגות עולות — 3.5%, 5%, 8% ו-10% — כאשר כל מדרגה חלה רק על חלק השווי שבתוכה, לא על כל הסכום. לכן ההבדל בין דירה של 2 מיליון לדירה של 2.2 מיליון קטן בהרבה ממה שנדמה.
              </p>
              <p>
                <em>חשוב לדעת:</em> &quot;דירה יחידה&quot; היא הגדרה משפטית מדויקת. גם דירה שירשתם או חלק מדירה עשויים להשפיע על הסטטוס שלכם — ולכן שווה לבדוק לפני שחותמים.
              </p>
            </section>

            {/* Section 3 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>דירה שנייה ומשקיעים: 8% מהשקל הראשון</h2>
              <p>
                כאן התמונה משתנה לחלוטין. מי שכבר מחזיק דירה ורוכש דירה נוספת משלם <strong>8% על חלק השווי עד כ-6 מיליון ש״ח ו-10% מעל לכך</strong> — מהשקל הראשון, בלי שום פטור.
              </p>
              <p>
                על דירת השקעה של 2 מיליון ש״ח בחולון, מדובר ב-160,000 ש״ח מס. זה סכום שחייב להיכנס לתחשיב התשואה שלכם לפני שמתחייבים לעסקה.
              </p>
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>משפרי דיור — שימו לב לשעון</h3>
              <p>
                קניתם דירה חדשה לפני שמכרתם את הישנה? אתם לא נחשבים אוטומטית משקיעים. החוק מעניק תקופת חפיפה שבה אפשר להחזיק שתי דירות וליהנות ממדרגות דירה יחידה — בתנאי שמוכרים את הדירה הישנה בזמן. פספוס המועד = תשלום מס משקיעים מלא.
              </p>
            </section>

            {/* Section 4 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>פטורים והקלות שכדאי להכיר</h2>
              <p>
                <strong>עולים חדשים</strong> — זכאים למדרגות מס מופחתות ברכישת דירת מגורים, בתקופה שסביב מועד העלייה.
              </p>
              <p>
                <strong>נכים, נפגעי פעולות איבה ומשפחות שכולות</strong> — זכאים למס רכישה מופחת של 0.5% בתנאים מסוימים.
              </p>
              <p>
                <strong>העברה בין קרובים</strong> — העברת דירה במתנה לקרוב משפחה נהנית ממס מופחת, אך כפופה לכללים מיוחדים.
              </p>
              <p>
                בכל אחד מהמקרים האלה מדובר בחיסכון של עשרות אלפי שקלים — אבל גם בתנאים מדויקים שחייבים לעמוד בהם. <strong>אל תסתמכו על מחשבונים באינטרנט בלבד; התייעצו עם עורך דין מקרקעין.</strong>
              </p>
            </section>

            {/* Section 5 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>איך אנחנו עוזרים לתכנן את העסקה נכון?</h2>
              <p>
                במשרד שלנו, שאלת המיסוי עולה כבר בפגישה הראשונה — לא אחרי שמצאתם דירה. אנחנו עובדים עם עורכי דין ויועצי מס המתמחים במקרקעין, ומוודאים שהתקציב שלכם כולל את כל העלויות הנלוות: מס רכישה, שכר טרחה, תיווך ושיפוצים.
              </p>
              <p>
                מחפשים דירה בחולון או בבת ים? התחילו מ<Link href="/apartments">מאגר הדירות שלנו</Link>, או קראו את <Link href="/articles/first-apartment-guide">המדריך המלא לרוכשי דירה ראשונה</Link>.
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
