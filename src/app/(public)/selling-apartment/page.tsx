'use client';

import Hero from '@/components/layout/Hero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Printer } from 'lucide-react';
import ContactForm from '@/components/layout/ContactForm';

export default function SellingApartmentPage() {
  const sections = [
    {
      id: 1,
      title: 'בדיקת כשירות הנכס, תכנוני ומשפטי.',
      image: '/Research paper-amico.svg',
      reverse: false,
      content: (
        <>
          <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">
            <li>הוצאת נסח טאבו עדכני</li>
            <li>בדיקת טופס ארנונה עדכני.</li>
            <li>הוצאת תשריט בית משותף.</li>
            <li>בדיקת תשריטים בעירייה לוודא שהדירה נבנתה ע"פ היתר.</li>
          </ol>
          <p className="text-gray-700">
            חובה להמציא את כל המסמכים האלו כדי לחסוך ממכם עוגמת נפש ובזבוז זמן מיותר, 
            ניירת מסודרת לנכס מעלה את ערכו והופכת את הנכס לכזה שניתן למכור בקלות ללא בעיות לא צפויות.
          </p>
        </>
      ),
    },
    {
      id: 2,
      title: 'בדיקת מיסוי',
      image: '/Finance-bro.svg',
      reverse: true,
      content: (
        <>
          <p className="mb-4 text-gray-700">
            בעת מכירת הנכס ישנם שני היבטי מיסוי עיקריים שמומלץ לבדוק לפני תמחור הנכס והוצאת הנכס לשוק:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">
            <li>מס שבח – יחול בדרך כלל כשלמוכר דירה יש שתי דירות ויותר או כשמוכרים דירה שמחזיקים בה פחות משנה וחצי.</li>
            <li>היטל השבחה – משלמים לעיריה בגין זכויות בניה\ הקלות בניה אשר נקבעו בתכנית של העירייה שחלה גם על בתיכם.( לדוגמא אפשרות לבנות על הגג לדירה בקומה אחרונה).<br />
            בעת מכירת הנכס יתכן ותידרשו ע"י העירייה לשאת בתשלום היטל השבחה</li>
          </ol>
          <p className="text-gray-700">
            מומלץ להתייעץ עם עורך דין בעת בדיקות המיסוי.
          </p>
        </>
      ),
    },
    {
      id: 3,
      title: 'מימון ובדיקת משכנתא שנותרה לדירה.',
      image: '/Finance-rafiki.svg',
      reverse: false,
      content: (
        <>
          <div className="space-y-3 text-gray-700">
            <p>
              רבים מהמוכרים הם משפרי דיור שמתכננים למכור ולקנות נכס חדש, 
              מומלץ לגשת לבנק ולבקש מכתב כוונות, במכתב כוונות הבנק מצהיר על יתרת המשכנתא שנותרה לדירה הקיימת, גובה הסכום כולל עמלת פירעון מוקדם.
            </p>
            <p>
              מומלץ גם לקבל אישור עקרוני במידה ומגדילים את המשכנתא לנכס החדש ולעשות בדיקה האם כדאי לגרור את המשכנתא הקיימת או לחסל אותה ולקחת מחדש ולוודא כמובן שמאושר לכם גובה הסכום אותו אתם מתכננים לקחת.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 4,
      title: 'פגישת היכרות עם יועץ נדל"ן',
      image: '/Conversation-amico.svg',
      reverse: true,
      content: (
        <>
          <div className="space-y-3 text-gray-700">
            <p>בפגישה ננתח את מחירי השוק באזור שלכם ע"י דירות שנמכרו ומוצעות למכירה.</p>
            <p>נאפיין את קהל היעד שלכם.</p>
            <p>נעריך מחיר שנכון לצאת איתו לשיווק.</p>
            <p>
              ניתן טיפים להצגת הנכס – לדוגמא : סידור הרהיטים בנכס, צביעת הנכס וכל דבר שיכול לגרום לנכס להיות אסטטי ומוכן לבואם של רוכשים פוטנציאלים.
            </p>
            <p>נבנה תוכנית שיווקית להשגת המטרה ונצא לדרך.</p>
          </div>
        </>
      ),
    },
    {
      id: 5,
      title: 'שיווק הנכס',
      image: '/Business deal-rafiki (1).svg',
      reverse: false,
      content: (
        <>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>צילום מקצועי של הנכס.</li>
            <li>שיווק למאגרי קונים פוטנציאלי של המשרד, ע"י תוכנות דיוור ייעודיות.</li>
            <li>פרסום באתרי אינטרנט הנחשפים ביותר</li>
            <li>פרסום ברשתות חברתיות</li>
            <li>קמפיינים דיגטאלים בפייסבוק וגוגל.</li>
            <li>פרסום בשילוט</li>
            <li>הזמנת 100% מהמתווכים בעירכם להביא קונים פוטנציאלים לדירה.</li>
            <li>פרסום בעיתונות</li>
            <li>פליירים ומכתבי שכנים.</li>
          </ol>
        </>
      ),
    },
    {
      id: 6,
      title: 'ייצוג מקצועי, ניהול מו"מ וסגירת עסקה',
      image: '/Cohort analysis-rafiki.svg',
      reverse: true,
      content: (
        <>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>פתיחה תיק נכס מסודר עם ניהול כל הפרסומים.</li>
            <li>בתיק נכס יופיעו כל הרוכשים הפוטנציאלים שראו את הנכס עם שליטה מלאה ועם אפשרות לעדכן בכל רגע נתון על תנאי העסקה ( הכל מתנהל באוטומציה משרדית)</li>
            <li>בתיק נכס יופיעו כל הצעות הרכישה לנכס.</li>
            <li>ניתוח הצעות רכישה בשקיפות עם בעלי הנכס וניהול מו"מ מקצועי אחרי תיאום ציפיות.</li>
            <li>סגירת כל פרטי העסקה כולל מחיר, תנאי תשלום ופינוי והעברת פרטי העסקה לעורכי דין.</li>
            <li>חתימת חוזה, צילום מסורתי של הקונים והמוכרים ופתיחת בקבוק יין.</li>
          </ol>
        </>
      ),
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-warm">
      {/* Hero Section */}
      <Hero
        img="/images/hero/other-hero.jpeg"
        staticTitle="מוכרים דירה"
        centered={true}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* Sections */}
        {sections.map((section, index) => (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            className={`mb-20 flex flex-col ${section.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-4 lg:gap-6 items-center`}
          >
            {/* Text Content */}
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                {section.title}
              </h2>
              <div className="text-lg leading-relaxed">
                {section.content}
              </div>
            </div>

            {/* Image */}
            <div className="flex-1 relative w-full h-[500px] lg:h-[600px]">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-contain"
              />
            </div>
          </motion.section>
        ))}

      
        {/* Contact Form Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12"
          id="contact"
        >
          <ContactForm />
        </motion.section>
      </main>
    </div>
  );
}

