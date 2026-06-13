'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ArticleByline from '@/components/SEO/ArticleByline';
import FAQ, { FAQItem } from '@/components/ui/FAQ';
import '../foreign-investors/styles.css';

export default function PrePurchaseContent() {
  const faqItems: FAQItem[] = [
    {
      question: '"מה זה נסח טאבו ואיך מוציאים אותו?"',
      answer: '<strong>תעודת הזהות של הנכס.</strong> הנסח מראה מי הבעלים הרשום ואילו משכנתאות, עיקולים והערות אזהרה רובצים על הדירה. מוציאים אונליין באתר רשם המקרקעין, תוך דקות ובעלות סמלית — וזו הבדיקה הראשונה, לפני כל התקדמות.'
    },
    {
      question: '"שווה לשלם על בדק בית לדירה יד שנייה?"',
      answer: '<strong>חד משמעית כן.</strong> בדיקה מקצועית עולה 1,500–3,000 ש״ח ומגלה רטיבות נסתרת, צנרת ישנה ובעיות חשמל. ממצא אחד משמעותי חוסך עשרות אלפי שקלים — או הופך לקלף מיקוח על המחיר.'
    },
    {
      question: '"מצאנו דירה מושלמת אבל יש בה חריגת בנייה. לוותר?"',
      answer: '<strong>לא בהכרח — אבל לא לחתום כרגיל.</strong> יש חריגות שניתן להכשיר בהיתר ויש כאלה שגוררות צו הריסה. ההבדל הוא משפטי ותכנוני, וחובה לבדוק אותו לפני החתימה ולעגן את הטיפול בחוזה. עורך דין מקרקעין מנוסה יידע לכוון.'
    }
  ];

  return (
    <div className="article-page" dir="rtl">
      <SecondaryHero
        img="/7.jpg"
        title="הצ׳קליסט שיציל אתכם: כל הבדיקות לפני קניית דירה"
        centered={true}
      />

      <Breadcrumbs />

      <div className="article-container">
        <article className="article-content">
          <div className="article-body">
            <ArticleByline id="pre-purchase-checklist" />
            {/* Introduction */}
            <section className="article-section">
              <p className="lead-paragraph">
                הדירה מהממת, המוכר נחמד, והמחיר נראה הוגן. בדיוק ברגע הזה — כשהרגש אומר &quot;לחתום עכשיו לפני שמישהו אחר ייקח&quot; — מתרחשות הטעויות הכי יקרות בעולם הנדל״ן. כי את הבעיות האמיתיות של דירה לא רואים בסיור של 20 דקות.
              </p>

              <div className="content-flex-layout">
                <div className="text-column">
                  <p>
                    עיקול שלא הוזכר, מרפסת שנסגרה בלי היתר, רטיבות שהוסתרה מאחורי קיר טרי — כל אחד מאלה יכול להפוך עסקת חלומות לבור כספי.
                  </p>
                  <p>
                    החדשות הטובות: כמעט כל הבעיות ניתנות לגילוי מראש, אם יודעים מה לבדוק. ריכזנו את הצ׳קליסט המלא שאנחנו עוברים עם הקונים שלנו — <strong>ארבע קבוצות בדיקה, לפי הסדר הנכון.</strong>
                  </p>
                </div>
                <div className="image-column">
                  <Image src="/images/articles/pre-purchase.jpg" alt="בדיקה מקצועית של דירה לפני קנייה" width={600} height={450} loading="lazy" sizes="(max-width: 768px) 100vw, 45vw" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              </div>
            </section>

            {/* Section 1 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>1. בדיקות משפטיות: מי באמת הבעלים?</h2>
              <p>
                <strong>נסח טאבו עדכני</strong> — הבדיקה הראשונה והחשובה ביותר. ודאו שהמוכר הוא הבעלים הרשום, ושאין משכנתאות, עיקולים או הערות אזהרה שלא סופרו לכם. נסח מוציאים אונליין בדקות.
              </p>
              <p>
                <strong>זהות מוכרים</strong> — ירושה? גירושין? ודאו שלכל בעלי הזכויות יש הסכמה למכור. עסקה עם מוכר אחד מתוך שלושה יורשים — לא עסקה.
              </p>
              <p>
                <strong>חובות על הנכס</strong> — ועד בית, ארנונה, היטלי השבחה צפויים. בחוזה טוב המוכר מתחייב לסלק הכול עד המסירה.
              </p>
            </section>

            {/* Section 2 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>2. בדיקות תכנוניות: מה חוקי ומה לא?</h2>
              <p>
                <strong>היתר בנייה מול מציאות</strong> — השוו את הדירה בפועל לתשריט בעירייה. מרפסת שנסגרה, מחסן שהפך לחדר, דירה שפוצלה — חריגות בנייה עלולות לגרור קנסות, צו הריסה וסירוב משכנתא.
              </p>
              <p>
                <strong>זכויות בנייה ותוכניות עתידיות</strong> — מה ייבנה על המגרש הריק ממול? האם הבניין במסלול <Link href="/articles/urban-renewal-holon">התחדשות עירונית</Link>? תוכניות אפשר לבדוק באתר מינהל התכנון ובוועדה המקומית.
              </p>
              <p>
                <strong>רישום הבית המשותף</strong> — ודאו שהצמדות (חניה, מחסן, גג) רשומות כדין ולא רק &quot;מובטחות בעל פה&quot;.
              </p>
            </section>

            {/* Section 3 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>3. בדיקה פיזית: מה מסתתר מאחורי הקירות?</h2>
              <p>
                <strong>בדק בית מקצועי</strong> — בודק מוסמך עם ציוד ייעודי (מצלמה תרמית, מד לחות) מאתר רטיבות נסתרת, ליקויי איטום, חשמל לא תקני וצנרת גוססת. עלות: 1,500–3,000 ש״ח. שווי הממצאים: לפעמים עשרות אלפים.
              </p>
              <p>
                <strong>ביקור שני בשעה אחרת</strong> — דירה נראית אחרת בבוקר ובערב: אור טבעי, רעש מהכביש, חניה בשעות העומס. לעולם אל תקנו אחרי ביקור אחד.
              </p>
              <p>
                <strong>מצב הבניין</strong> — חדר מדרגות, גג, חניון. בניין מוזנח מספר על ועד בית חלש — וההוצאות האלה יגיעו אליכם.
              </p>
            </section>

            {/* Section 4 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>4. בדיקות כלכליות: כמה זה באמת יעלה?</h2>
              <p>
                <strong>שווי אמיתי</strong> — השוו לעסקאות אמת באזור (לא למחירי פרסום). חוששים שהמחיר מנופח? קראו את <Link href="/articles/apartment-pricing">המדריך שלנו לתמחור דירה</Link>.
              </p>
              <p>
                <strong>מס רכישה</strong> — ודאו שאתם יודעים מראש כמה תשלמו. <Link href="/articles/purchase-tax-guide">מדריך מס הרכישה המלא שלנו</Link> עושה סדר.
              </p>
              <p>
                <strong>עלויות נלוות</strong> — עורך דין, שמאי מטעם הבנק, תיווך, הובלה ושיפוץ ראשוני. תכננו עוד כ-5% מעל מחיר הדירה.
              </p>
            </section>

            {/* Section 5 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>איך אנחנו נכנסים לתמונה?</h2>
              <p>
                כשאתם קונים דירה דרכנו, חלק גדול מהצ׳קליסט הזה כבר עשוי: אנחנו מכירים את הבניינים, את ההיסטוריה של הנכסים ואת התוכניות בסביבה, ועובדים עם עורכי דין ובודקי בדק בית שאנחנו סומכים עליהם. קונים בביטחון — לא בהימור.
              </p>
              <p>
                מתחילים לחפש? <Link href="/apartments?dealType=sale">צפו בדירות למכירה בחולון ובסביבה</Link> או קראו על <Link href="/buying-apartment">תהליך הקנייה המלא אצלנו</Link>.
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
