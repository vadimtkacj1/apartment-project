'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import Image from 'next/image';
import { m } from 'framer-motion';
import ContactForm from '@/components/layout/ContactForm';
import FAQ, { FAQItem } from '@/components/ui/FAQ';

// Plain-text answers (no markup) so the visible FAQ text matches the FAQPage
// JSON-LD in page.tsx verbatim — a mismatch is a structured-data spam signal.
const faqItems: FAQItem[] = [
  {
    question: 'מהן העלויות הנלוות ברכישת דירה?',
    answer: 'מעבר למחיר הדירה כדאי להיערך לכ-3%–5% הוצאות נלוות: מס רכישה, שכר טרחת עורך דין, דמי תיווך ועלויות שיפוץ. אנחנו דואגים שהתקציב שלכם יכסה את כל ההוצאות מראש, בלי הפתעות.',
  },
  {
    question: 'מה זה אישור עקרוני ולמה כדאי להוציא אותו מראש?',
    answer: 'אישור עקרוני הוא התחייבות ראשונית של הבנק לסכום המימון. מומלץ להוציא אותו לפני שמתחילים לחפש דירה, כדי לנהל משא ומתן בביטחון ולא לפספס דירה טובה בגלל עיכובים בנקאיים.',
  },
  {
    question: 'אילו מסמכים בודקים לפני קניית דירה?',
    answer: 'לכל נכס שמעניין אתכם אנחנו מוציאים נסח טאבו ותרשים בית משותף, ובודקים היסטוריית מחירים ועסקאות שבוצעו באותו בניין ובאותה שכונה — כדי שתדעו בדיוק מה אתם קונים.',
  },
  {
    question: 'באילו שכונות בחולון אתם מתמחים?',
    answer: 'אנחנו מכירים לעומק את כל שכונות העיר — גרין, נווה רמז, רסקו, קרית שרת, נאות שושנים ועוד — ומתאימים את החיפוש לצרכים ולתקציב שלכם על בסיס עסקאות שבוצעו באזור.',
  },
];

export default function BuyingApartmentContent() {
  const sections = [
    {
      id: 1,
      title: 'בירור צרכים',
      image: '/Contact us-pana.svg',
      reverse: true,
      content: (
        <>
          <p className="text-gray-700 mb-4">
            תהליך רכישת דירה בחולון מתחיל בפגישת ייעוץ ראשונה ללא עלות עם אחד מסוכני המשרד.
            בפגישה נברר יחד את הצרכים, העדפות המיקום, מספר החדרים הנדרש, קומה, חניה ופרמטרים נוספים.
          </p>
          <p className="text-gray-700 mb-4">
            ננתח יחד את מגמות שוק הנדל״ן בחולון ובת ים — מחירי עסקאות אחרונות, שכונות עם פוטנציאל,
            ואזורים שמתאימים לתקציב שלכם. הידע המקומי שלנו לאחר 24 שנות פעילות בחולון הוא יתרון
            שקשה למצוא במקום אחר.
          </p>
          <p className="text-gray-700">
            בסוף הפגישה נתכנן יחד מפת דרכים ברורה — כדי שתעשו רכישה בטוחה ומוצלחת ללא הפתעות בדרך.
          </p>
        </>
      ),
    },
    {
      id: 2,
      title: 'בדיקת מימון',
      image: '/Mind map-rafiki.svg',
      reverse: false,
      content: (
        <>
          <div className="space-y-4 text-gray-700">
            <p>
              לפני שמתחילים לחפש דירה, חשוב לדעת בדיוק כמה אפשר להוציא. אנו מפנים אתכם ליועצי
              משכנתאות ואנשי קשר מומלצים בבנקים שיתנו לכם טיפול מהיר ומסור.
            </p>
            <p>
              תקבלו אישור עקרוני למימון העסקה עוד לפני שאתם יוצאים לחפש — כך תוכלו לנהל מו״מ
              בביטחון ולא לפספס דירה טובה בגלל עיכובים בנקאיים.
            </p>
            <p>
              חשוב לדעת: מס רכישה, שכר טרחת עורך דין, דמי תיווך ועלויות שיפוץ יכולים להגיע ל-3%–5%
              מעבר למחיר הדירה. נדאג שהתקציב שלכם יכסה את כל ההוצאות הנלוות.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 3,
      title: 'איתור נכס',
      image: '/Shared goals-cuate.svg',
      reverse: true,
      content: (
        <>
          <p className="text-gray-700 mb-4">
            לאחר שהגדרנו את הצרכים ואישרנו מימון — הסוכנים שלנו מתחילים לאתר עבורכם נכסים
            מתאימים בחולון ובסביבה. אנו עובדים עם תוכנות מתקדמות לפילוח מדויק ומכירים את
            כל שכונות העיר לעומק: גרין, נווה רמז, רסקו, קרית שרת, נאות שושנים ועוד.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>נאתר עבורכם נכסים לפי הצרכים והתקציב המדויקים שלכם.</li>
            <li>תקבלו מידע מדויק ואמין על כל נכס — גודל, קומה, מצב, חניה, מעלית.</li>
            <li>נוציא עבורכם נסח טאבו ותרשים בית משותף לכל נכס שמעניין אתכם.</li>
            <li>נבדוק היסטוריית מחירים ועסקאות שבוצעו באותו בניין ובאותה שכונה.</li>
            <li>נסנן בשבילכם — רק נכסים שעומדים בקריטריונים, ללא בזבוז זמן.</li>
          </ol>
        </>
      ),
    },
    {
      id: 4,
      title: 'ניהול מו"מ וסגירת עסקה',
      image: '/Consulting-rafiki.svg',
      reverse: false,
      content: (
        <>
          <p className="text-gray-700 mb-4">
            ניהול משא ומתן נכון יכול לחסוך לכם עשרות אלפי שקלים. אנו מנהלים את המו״מ עבורכם
            מול המוכר ומייצגים את האינטרסים שלכם בכל שלב — ממחיר הדירה ועד לתנאי התשלום,
            מועד הפינוי ומה נכלל בעסקה.
          </p>
          <p className="text-gray-700 mb-4">
            לאחר הסכמה על מחיר, נפנה אתכם לעורכי דין ושמאי מקרקעין מהמומלצים ביותר שאנו
            עובדים איתם — כדי לוודא שהעסקה תקינה מבחינה משפטית ותכנונית.
          </p>
          <p className="text-gray-700">
            אנחנו לא נעלמים אחרי החתימה: נלווה אתכם עד לקבלת המפתחות, ונוודא שהכל עובר
            בצורה חלקה ובלי הפתעות.
          </p>
        </>
      ),
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-warm">
      <SecondaryHero
        img="/7.jpg"
        title="קונים דירה"
        centered={true}
      />
      <Breadcrumbs />
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {sections.map((section, index) => (
          <Fragment key={section.id}>
            <m.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className={`mb-20 flex flex-col ${section.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-4 lg:gap-6 items-center`}
            >
              <div className="flex-1 space-y-6">
                <div>
                  <SectionEyebrow tone="light" align="start">שלב {section.id}</SectionEyebrow>
                  <h2 className="mt-2 text-3xl md:text-4xl font-black text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <div className="text-lg leading-relaxed">
                  {section.content}
                </div>
              </div>
              {/* Decorative illustration — capped so the text leads */}
              <div className="flex-1 relative w-full max-w-md mx-auto h-56 lg:h-96">
                <Image
                  src={section.image}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </m.section>
            {index === 1 && (
              <div className="-mt-10 mb-20">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-xl font-bold text-[#354AC4] transition-colors hover:text-[#28389B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#354AC4]"
                >
                  דברו איתנו ←
                </Link>
              </div>
            )}
          </Fragment>
        ))}
        <FAQ items={faqItems} />
        <m.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12"
          id="contact"
        >
          <ContactForm />
        </m.section>
      </main>
    </div>
  );
}
