'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FAQ, { FAQItem } from '@/components/ui/FAQ';
import '../foreign-investors/styles.css';

export default function NewVsSecondhandContent() {
  const faqItems: FAQItem[] = [
    {
      question: '"מה זה מדד תשומות הבנייה ולמה זה מייקר את הדירה?"',
      answer: '<strong>זו ההצמדה שאף משווק לא מבליט.</strong> בחוזה מקבלן, יתרת התשלומים צמודה למדד תשומות הבנייה. כשהמדד עולה — החוב שלכם גדל. בתקופות התייקרות, ההצמדה מוסיפה עשרות אלפי שקלים למחיר שסגרתם &quot;סופית&quot;.'
    },
    {
      question: '"דירה יד שנייה באמת זולה יותר?"',
      answer: '<strong>בדרך כלל כן — והמחיר סגור.</strong> על אותו מספר חדרים באותו אזור, יד שנייה תעלה פחות, בלי הצמדות ובלי הפתעות. מנגד, חשבו על שיפוץ והתאמה. ההשוואה הנכונה היא על העלות הכוללת: מחיר + הצמדות + שיפוץ + נלוות.'
    },
    {
      question: '"איך בודקים שהקבלן אמין לפני שקונים על הנייר?"',
      answer: '<strong>בודקים עבר, לא הבטחות.</strong> פרויקטים קודמים ועמידה בלוחות זמנים, איתנות פיננסית, ערבויות חוק המכר על כל שקל, ומה אומרים דיירים שכבר קיבלו מפתח. אנחנו מכירים את היזמים הפעילים באזור — ויודעים על מי אפשר לסמוך.'
    }
  ];

  return (
    <div className="article-page" dir="rtl">
      <SecondaryHero
        img="/7.jpg"
        title="קבלן או יד שנייה? ההשוואה שאף משווק לא יעשה לכם"
        centered={true}
      />

      <Breadcrumbs />

      <div className="article-container">
        <article className="article-content">
          <div className="article-body">
            {/* Introduction */}
            <section className="article-section">
              <p className="lead-paragraph">
                מצד אחד: דירה חדשה ונוצצת מקבלן, עם ממ״ד, מרפסת שמש ולובי ממוזג — ומשרד מכירות שמגיש קפה ומבטיח עולם. מצד שני: דירה יד שנייה בשכונה ותיקה, עם עצים ברחוב, שכנים שכבר מכירים — ומחיר שסגור היום. אז מה באמת משתלם יותר?
              </p>

              <div className="content-flex-layout">
                <div className="text-column">
                  <p>
                    זו אחת השאלות הנפוצות שאנחנו מקבלים, והתשובה הכנה היא: תלוי — בתקציב, בלוח הזמנים שלכם, וביכולת שלכם לספוג הפתעות.
                  </p>
                  <p>
                    מה שבטוח: ההחלטה לא צריכה להתקבל במשרד מכירות מעוצב, מול הדמיה ממוחשבת. <strong>הנה ההשוואה המלאה — כולל הסעיפים הקטנים שמשנים את התמונה.</strong>
                  </p>
                </div>
                <div className="image-column">
                  <Image src="/images/articles/new-vs-secondhand.jpg" alt="דירה חדשה מקבלן מול דירה יד שנייה" width={600} height={450} loading="lazy" sizes="(max-width: 768px) 100vw, 45vw" style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              </div>
            </section>

            {/* Section 1 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>היתרונות האמיתיים של דירה מקבלן</h2>
              <p>
                <strong>סטנדרט בנייה עכשווי</strong> — ממ״ד, בידוד אקוסטי ותרמי, חניון, מעלית, ותשתיות חכמות. דברים שבדירה ישנה עולים הון להוסיף.
              </p>
              <p>
                <strong>אפס תחזוקה בשנים הראשונות</strong> — הכול חדש, והקבלן אחראי לתיקון ליקויים בתקופת הבדק לפי חוק המכר.
              </p>
              <p>
                <strong>פריסת תשלומים</strong> — ברכישה על הנייר משלמים בהדרגה לפי קצב הבנייה, מה שנותן זמן להתארגן.
              </p>
              <p>
                <strong>התאמה אישית</strong> — בשלבי בנייה מוקדמים אפשר לשנות פריסה, לבחור ריצוף ומטבח.
              </p>
            </section>

            {/* Section 2 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>החסרונות שלא מספרים לכם במשרד המכירות</h2>
              <p>
                <strong>מדד תשומות הבנייה</strong> — יתרת התשלומים צמודה למדד, וכשהוא עולה, המחיר &quot;הסגור&quot; שלכם גדל בעשרות אלפי שקלים. את זה מגלים בקטנות, בעמוד 47 של החוזה.
              </p>
              <p>
                <strong>איחורים במסירה</strong> — נפוצים מאוד. אם אתם משלמים שכירות במקביל, כל חודש איחור הוא הוצאה כפולה.
              </p>
              <p>
                <strong>הפער בין ההדמיה למציאות</strong> — &quot;נוף לפארק&quot; שהופך לנוף למגדל הבא, מפרט טכני שמתפרש לטובת הקבלן.
              </p>
              <p>
                <strong>שכונה בהתהוות</strong> — גרים באתר בנייה: אבק, רעש, ובלי גינות, גני ילדים ומסחר — לפעמים שנים.
              </p>
              <p>
                <strong>עלויות שמתווספות</strong> — מחסן וחניה בתשלום נפרד, שדרוגים, וחיבורים. המחיר בפרסום הוא כמעט אף פעם לא המחיר הסופי.
              </p>
            </section>

            {/* Section 3 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>היתרונות השקטים של יד שנייה</h2>
              <p>
                <strong>מה שרואים זה מה שמקבלים</strong> — הדירה קיימת. אפשר לבדוק רטיבות, לשמוע את הרעש מהכביש, לפגוש את השכנים, ולעשות <Link href="/articles/pre-purchase-checklist">בדק בית מקצועי</Link> לפני חתימה.
              </p>
              <p>
                <strong>מחיר סגור — ולרוב נמוך יותר</strong> — בלי הצמדות למדד. אותו תקציב משיג בדרך כלל יותר חדרים או מיקום טוב יותר.
              </p>
              <p>
                <strong>מיקום מבוסס</strong> — שכונות ותיקות נבנו סביב החיים: בתי ספר, גינות, מסחר ותחבורה כבר שם, לא &quot;בתוכנית&quot;.
              </p>
              <p>
                <strong>כניסה מיידית</strong> — מפתח תוך חודשים, לא שנים. ופוטנציאל: דירה ישנה בבניין שמיועד ל<Link href="/articles/urban-renewal-holon">התחדשות עירונית</Link> יכולה להיות ההשקעה החכמה באמת.
              </p>
            </section>

            {/* Section 4 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>אז מה בוחרים? השורה התחתונה שלנו</h2>
              <p>
                <strong>בחרו קבלן אם:</strong> חשוב לכם חדש ומודרני, יש לכם גמישות בלוח הזמנים ובתקציב לספוג הצמדות ואיחורים, ואתם קונים מיזם מבוסס עם ערבויות מלאות.
              </p>
              <p>
                <strong>בחרו יד שנייה אם:</strong> אתם צריכים ודאות — במחיר, במועד הכניסה ובסביבה. ובמיוחד אם המיקום חשוב לכם יותר מהריצוף.
              </p>
              <p>
                ובכל מקרה — אל תשוו &quot;מחיר מודעה מול מחיר מודעה&quot;. השוו עלות כוללת: מחיר + הצמדות + שיפוץ + עלויות נלוות + שכירות בתקופת ההמתנה. אנחנו עושים את החישוב הזה עם הלקוחות שלנו על כל נכס.
              </p>
              <p>
                רוצים לראות מה יש בשוק עכשיו? <Link href="/apartments?dealType=sale">כל הדירות למכירה אצלנו</Link> — חדשות ויד שנייה, עם ליווי מלא בכל מסלול.
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
