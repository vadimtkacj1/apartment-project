'use client';
import Image from 'next/image';
import { getArticle } from '@/data/articles';
import React from 'react';
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
            <Image
              src={getArticle('pre-purchase-checklist')!.image}
              alt={getArticle('pre-purchase-checklist')!.title}
              width={1200}
              height={630}
              className="article-hero-image"
              priority
            />
            {/* Introduction */}
            <section className="article-section">
              <p className="lead-paragraph">
                הדירה מהממת, המוכר נחמד, והמחיר נראה הוגן. בדיוק ברגע הזה — כשהרגש אומר &quot;לחתום עכשיו לפני שמישהו אחר ייקח&quot; — מתרחשות הטעויות הכי יקרות בעולם הנדל״ן. כי את הבעיות האמיתיות של דירה לא רואים בסיור של 20 דקות.
              </p>

              <p>
                עיקול שלא הוזכר, מרפסת שנסגרה בלי היתר, רטיבות שהוסתרה מאחורי קיר טרי — כל אחד מאלה יכול להפוך עסקת חלומות לבור כספי.
              </p>
              <p>
                החדשות הטובות: כמעט כל הבעיות ניתנות לגילוי מראש, אם יודעים מה לבדוק. ריכזנו את הצ׳קליסט המלא שאנחנו עוברים עם הקונים שלנו — <strong>ארבע קבוצות בדיקה, לפי הסדר הנכון.</strong>
              </p>
            </section>

            {/* Section 1 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>1. בדיקות משפטיות: מי באמת הבעלים?</h2>
              <div className="definition-block"><p><span className="definition-term">נסח טאבו</span> הוא מסמך רשמי שמנפיק רשם המקרקעין (הטאבו) ומשמש כתעודת הזהות של הנכס: הוא מפרט מי הבעלים הרשום ואילו משכנתאות, עיקולים והערות אזהרה רשומים על הדירה. ניתן להפיק אותו אונליין באתר רשם המקרקעין תוך דקות, באגרה מקוונת.</p></div>
              <span className="source-note">מקור: <a href="https://www.gov.il" target="_blank" rel="noopener noreferrer">רשם המקרקעין, משרד המשפטים</a>.</span>
              <ul className="geo-list">
                <li><strong>נסח טאבו עדכני</strong> — הבדיקה הראשונה והחשובה ביותר. ודאו שהמוכר הוא הבעלים הרשום, ושאין משכנתאות, עיקולים או הערות אזהרה שלא סופרו לכם. נסח מוציאים אונליין בדקות.</li>
                <li><strong>זהות מוכרים</strong> — ירושה? גירושין? ודאו שלכל בעלי הזכויות יש הסכמה למכור. עסקה עם מוכר אחד מתוך שלושה יורשים — לא עסקה.</li>
                <li><strong>חובות על הנכס</strong> — ועד בית, ארנונה, היטלי השבחה צפויים. בחוזה טוב המוכר מתחייב לסלק הכול עד המסירה.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <figure className="article-inline-figure">
              <Image src="/images/articles/inbody/pre-purchase-checklist-a.jpg" alt={getArticle('pre-purchase-checklist')!.title} width={1200} height={675} className="article-inline-image" />
            </figure>
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>2. בדיקות תכנוניות: מה חוקי ומה לא?</h2>
              <ul className="geo-list">
                <li><strong>היתר בנייה מול מציאות</strong> — השוו את הדירה בפועל לתשריט בעירייה. מרפסת שנסגרה, מחסן שהפך לחדר, דירה שפוצלה — חריגות בנייה עלולות לגרור קנסות, צו הריסה וסירוב משכנתא.</li>
                <li><strong>זכויות בנייה ותוכניות עתידיות</strong> — מה ייבנה על המגרש הריק ממול? האם הבניין במסלול <Link href="/articles/urban-renewal-holon">התחדשות עירונית</Link>? תוכניות אפשר לבדוק באתר מינהל התכנון ובוועדה המקומית.</li>
                <li><strong>רישום הבית המשותף</strong> — ודאו שהצמדות (חניה, מחסן, גג) רשומות כדין ולא רק &quot;מובטחות בעל פה&quot;.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>3. בדיקה פיזית: מה מסתתר מאחורי הקירות?</h2>
              <ul className="geo-list">
                <li><strong>בדק בית מקצועי</strong> — בודק מוסמך עם ציוד ייעודי (מצלמה תרמית, מד לחות) מאתר רטיבות נסתרת, ליקויי איטום, חשמל לא תקני וצנרת גוססת. עלות: 1,500–3,000 ש״ח. שווי הממצאים: לפעמים עשרות אלפים.</li>
                <li><strong>ביקור שני בשעה אחרת</strong> — דירה נראית אחרת בבוקר ובערב: אור טבעי, רעש מהכביש, חניה בשעות העומס. לעולם אל תקנו אחרי ביקור אחד.</li>
                <li><strong>מצב הבניין</strong> — חדר מדרגות, גג, חניון. בניין מוזנח מספר על ועד בית חלש — וההוצאות האלה יגיעו אליכם.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <figure className="article-inline-figure">
              <Image src="/images/articles/inbody/pre-purchase-checklist-b.jpg" alt={getArticle('pre-purchase-checklist')!.title} width={1200} height={675} className="article-inline-image" />
            </figure>
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>4. בדיקות כלכליות: כמה זה באמת יעלה?</h2>
              <ul className="geo-list">
                <li><strong>שווי אמיתי</strong> — השוו לעסקאות אמת באזור (לא למחירי פרסום). חוששים שהמחיר מנופח? קראו את <Link href="/articles/apartment-pricing">המדריך שלנו לתמחור דירה</Link>.</li>
                <li><strong>מס רכישה</strong> — ודאו שאתם יודעים מראש כמה תשלמו. ברכישת דירה יחידה לא משלמים מס רכישה כלל עד שווי של 1,978,745 ש״ח (מדרגת 0%, נכון ל-2026; מקור: רשות המסים), ומעל סכום זה המס עולה במדרגות. <Link href="/articles/purchase-tax-guide">מדריך מס הרכישה המלא שלנו</Link> עושה סדר.</li>
                <li><strong>עלויות נלוות</strong> — עורך דין, שמאי מטעם הבנק, תיווך, הובלה ושיפוץ ראשוני. תכננו עוד כ-5% מעל מחיר הדירה.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="article-section">
              <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>איך אנחנו נכנסים לתמונה?</h2>
              <p>
                כשאתם קונים דירה דרכנו, חלק גדול מהצ׳קליסט הזה כבר עשוי: אנחנו מכירים את הבניינים, את ההיסטוריה של הנכסים ואת התוכניות בסביבה, ועובדים עם עורכי דין ובודקי בדק בית שאנחנו סומכים עליהם. קונים בביטחון — לא בהימור.
              </p>
              <p>
                מתחילים לחפש? <Link href="/apartments?dealType=sale">צפו בדירות למכירה בחולון ובסביבה</Link> או קראו על <Link href="/buying-apartment">תהליך הקנייה המלא אצלנו</Link>. נשארו שאלות? כל התשובות מחכות ב<Link href="/faq">עמוד השאלות והתשובות</Link>.
              </p>
            </section>

            {/* FAQ */}
            <FAQ items={faqItems} />
          </div>
        </article>
      </div>
    </div>
  );
}
