'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/ui/FAQ';
import '../foreign-investors/styles.css';

export default function LandlordGuideContent() {
  const faqItems: FAQItem[] = [
    {
      question: '"אילו ביטחונות לדרוש מהשוכר?"',
      answer: '<strong>אל תתביישו לדרוש.</strong> המקובל: שטר חוב חתום עם ערבים, צ׳ק ביטחון או ערבות בנקאית, ופיקדון. ערבים עם תלושי שכר — חובה. שוכר רציני לא נבהל מביטחונות; מי שנבהל — סימן אזהרה.'
    },
    {
      question: '"צריך לשלם מס על שכר הדירה?"',
      answer: '<strong>תלוי כמה אתם מקבלים.</strong> יש מסלול פטור מלא עד תקרה חודשית (כ-5,600 ש״ח, מתעדכנת מדי שנה), מסלול 10% מס על כל ההכנסה, ומסלול מס שולי עם ניכוי הוצאות. בחירת המסלול הנכון שווה אלפי שקלים בשנה — שווה שיחה עם רואה חשבון.'
    },
    {
      question: '"הדירה עומדת ריקה כבר חודש. מה עושים?"',
      answer: '<strong>כל חודש ריק = 8% מההכנסה השנתית שנמחקו.</strong> בדרך כלל הבעיה היא תמחור גבוה מדי, תמונות גרועות או זמינות נמוכה לתיאום ביקורים. אצלנו דירה להשכרה מקבלת צילום מקצועי, פרסום ממוקד וסינון שוכרים — והיא לא עומדת ריקה.'
    }
  ];

  return (
    <div className="article-page" dir="rtl">
      <SecondaryHero
        img="/7.jpg"
        title="השכרת דירה בלי כאבי ראש: המדריך לבעלי נכסים"
        centered={true}
      />

      <Breadcrumbs />

      <div className="article-container">
        <article className="article-content">
          <div className="article-body">
            {/* Introduction */}
            <section className="article-section">
              <p className="lead-paragraph">
                על הנייר, השכרת דירה נשמעת כמו הכנסה פסיבית מושלמת: שוכר נכנס, כסף נכנס, החיים יפים. בפועל, כל בעל דירה ותיק מכיר את הצד השני — שוכר שמפסיק לשלם, דוד שמתפוצץ בשישי בערב, ודירה שחוזרת אליכם במצב שדורש שיפוץ.
              </p>

              <div className="content-flex-layout">
                <div className="text-column">
                  <p>
                    ההבדל בין השכרה רווחית לסיוט מתמשך הוא לא מזל — הוא תהליך נכון: תמחור מדויק, סינון קפדני, חוזה שמגן עליכם, וניהול שוטף מסודר.
                  </p>
                  <p>
                    אחרי 24 שנים שבהן אנחנו משכירים ומנהלים נכסים בחולון, בת ים וראשון לציון — עבור בעלי דירות בארץ ו<Link href="/articles/foreign-investors">תושבי חוץ</Link> — ריכזנו כאן את השיטה המלאה. <strong>ככה משכירים דירה כמו מקצוענים.</strong>
                  </p>
                </div>
                <div className="image-column">
                  <Image src="/images/articles/landlord.jpg" alt="השכרת דירה לבעלי נכסים" width={600} height={450} loading="lazy" sizes="(max-width: 768px) 100vw, 45vw" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              </div>
            </section>

            {/* Section 1 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>שלב 1: כמה שווה הדירה שלכם בשוק השכירות?</h2>
              <p>
                גם כאן, כמו במכירה, תמחור שגוי עולה כסף. מחיר גבוה מדי — והדירה עומדת ריקה (כל חודש ריק מוחק כ-8% מההכנסה השנתית). מחיר נמוך מדי — והפסדתם הכנסה לכל אורך החוזה.
              </p>
              <p>
                שכר הדירה נקבע לפי שכונה, גודל, קומה, מצב הדירה ותוספות: ממ״ד, מרפסת, חניה ומיזוג תקין. <strong>דירה מתוחזקת ומוצגת היטב משיגה עד 15% יותר מדירה זהה ומוזנחת באותו בניין</strong> — ושוכרים טובים יותר.
              </p>
            </section>

            {/* Section 2 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>שלב 2: סינון שוכרים — השלב שקובע הכול</h2>
              <p>
                שוכר בעייתי הוא ההוצאה הגדולה ביותר של בעל דירה: חודשי שכירות אבודים, הליכי פינוי ונזק לנכס. הסינון הוא לא חשדנות — הוא מקצועיות:
              </p>
              <p>
                <strong>הוכחת הכנסה</strong> — תלושי שכר אחרונים או אישור רואה חשבון לעצמאים. כלל אצבע: שכר הדירה לא יעלה על שליש מההכנסה.
              </p>
              <p>
                <strong>שיחה עם המשכיר הקודם</strong> — שאלה אחת פשוטה: &quot;היית משכיר לו שוב?&quot;
              </p>
              <p>
                <strong>פגישה אישית</strong> — אין תחליף להתרשמות פנים מול פנים לפני חתימה.
              </p>
              <p>
                <strong>ביטחונות</strong> — שטר חוב עם ערבים, פיקדון או ערבות בנקאית, וצ׳קים לוועד ולחשבונות.
              </p>
            </section>

            {/* Section 3 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>שלב 3: חוזה שכירות שבאמת מגן עליכם</h2>
              <p>
                חוזה &quot;מהאינטרנט&quot; הוא הימור. חוזה טוב מסדיר מראש את כל נקודות החיכוך:
              </p>
              <p>
                <strong>תחזוקה ותיקונים</strong> — מי אחראי על מה, ומהו &quot;בלאי סביר&quot;.
              </p>
              <p>
                <strong>מנגנון יציאה</strong> — מה קורה אם השוכר עוזב באמצע, ומי מביא שוכר חלופי.
              </p>
              <p>
                <strong>אופציה והעלאות</strong> — תנאי הארכה ומנגנון עדכון שכר הדירה, בהתאם לחוק שכירות הוגנת.
              </p>
              <p>
                <strong>פרוטוקול מסירה</strong> — תיעוד מצולם של מצב הדירה ומוני חשמל/מים ביום הכניסה. החיסכון הגדול ביותר במחלוקות עתידיות.
              </p>
            </section>

            {/* Section 4 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>שלב 4: מיסוי — שלושה מסלולים, בחירה אחת חכמה</h2>
              <p>
                <strong>מסלול הפטור</strong> — הכנסה משכירות למגורים פטורה ממס עד תקרה חודשית (כ-5,600 ש״ח, מתעדכנת מדי שנה). מעל התקרה הפטור נשחק בהדרגה.
              </p>
              <p>
                <strong>מסלול 10%</strong> — מס קבוע של 10% על כל ההכנסה, בלי ניכוי הוצאות. פשוט ומשתלם להכנסות בינוניות.
              </p>
              <p>
                <strong>מסלול מס שולי</strong> — מס לפי מדרגות ההכנסה שלכם, אבל עם ניכוי הוצאות (תיקונים, פחת, ריבית משכנתא). רלוונטי בעיקר כשיש הוצאות גבוהות.
              </p>
              <p>
                הבחירה בין המסלולים יכולה להיות שווה אלפי שקלים בשנה — והיא תלויה בנתונים האישיים שלכם. אל תחליטו לבד; שיחה אחת עם רואה חשבון מחזירה את עצמה.
              </p>
            </section>

            {/* Section 5 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>או: תנו לנו לעשות את זה בשבילכם</h2>
              <p>
                אם כל זה נשמע כמו עבודה — זה כי זו באמת עבודה. אנחנו מציעים לבעלי נכסים שירות מלא: תמחור, צילום ושיווק, סינון שוכרים, חוזה מסודר, וניהול שוטף כולל טיפול בתקלות וגבייה. אתם מקבלים את ההכנסה — בלי הטלפונים בשישי בערב.
              </p>
              <p>
                רוצים לדעת כמה הדירה שלכם יכולה להכניס? <Link href="/apartments?dealType=rent">צפו בדירות להשכרה באזור</Link> או דברו איתנו להערכה ללא התחייבות.
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
