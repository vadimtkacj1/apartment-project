'use client';

import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Printer } from 'lucide-react';
import ContactForm from '@/components/layout/ContactForm';

export default function SellingApartmentPage() {
  const sections = [
    {
      id: 1,
      title: 'בדיקות משפטיות ותכנוניות לפני מכירת דירה',
      image: '/Research paper-amico.svg',
      reverse: false,
      content: (
        <>
          <p className="text-gray-700 mb-4">
            לפני שמפרסמים נכס למכירה חשוב לבצע בדיקת כשירות מלאה לנכס כדי למנוע בעיות בהמשך העסקה.
          </p>
          <p className="text-gray-700 mb-4">
            אנו דואגים להפקת נסח טאבו עדכני, בדיקת ארנונה, הוצאת תשריט בית משותף ובדיקת תיק הבניין בעירייה כדי לוודא שהנכס נבנה לפי היתר בניה.
          </p>
          <p className="text-gray-700">
            נכס עם תיק מסודר נמכר מהר יותר, מקבל אמון גבוה יותר מקונים ומאפשר לסגור עסקה ללא הפתעות או עיכובים מיותרים.
          </p>
        </>
      ),
    },
    {
      id: 2,
      title: 'בדיקות מס לפני מכירת נכס',
      image: '/Finance-bro.svg',
      reverse: true,
      content: (
        <>
          <p className="mb-4 text-gray-700">
            לפני תמחור הדירה חשוב להבין את חבות המס הצפויה כדי למנוע הפסדים כספיים לאחר המכירה.
          </p>
          <p className="mb-4 text-gray-700">
            אנו מכוונים את בעלי הנכס לבדוק מראש מס שבח והיטל השבחה — שני המרכיבים המרכזיים שמשפיעים על הרווח נטו מהמכירה.
          </p>
          <p className="text-gray-700">
            בדיקה מוקדמת מאפשרת לקבוע מחיר נכון לשוק ולהימנע ממצב שבו העסקה נתקעת ברגע האחרון.
          </p>
        </>
      ),
    },
    {
      id: 3,
      title: 'בדיקת משכנתא ומימון בעת מכירת דירה',
      image: '/Finance-rafiki.svg',
      reverse: false,
      content: (
        <>
          <div className="space-y-3 text-gray-700">
            <p>
              במקרים רבים מוכרים הם משפרי דיור ולכן חשוב להבין את מצב ההלוואה הקיימת.
            </p>
            <p>
              יש להוציא מכתב כוונות מהבנק המפרט את יתרת המשכנתא כולל קנסות פירעון מוקדם ולבדוק האם כדאי לגרור את המשכנתא או למחזר אותה.
            </p>
            <p>
              במקביל מומלץ לקבל אישור עקרוני לנכס הבא כדי למנוע לחץ זמן ולשמור על רצף מעבר נכון בין הדירות.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 4,
      title: 'הערכת שווי נכס ותכנון אסטרטגיית מכירה',
      image: '/Conversation-amico.svg',
      reverse: true,
      content: (
        <>
          <div className="space-y-3 text-gray-700">
            <p>בפגישת היכרות אנו מבצעים ניתוח שוק מבוסס עסקאות שבוצעו באזור ולא הערכות כלליות.</p>
            <p>מגדירים קהל יעד מדויק, קובעים מחיר יציאה נכון ומעניקים המלצות לשיפור הנראות של הדירה כמו סידור חלל, תאורה והכנת הנכס לצילומים.</p>
            <p>המטרה היא ליצור ביקוש אמיתי כבר בתחילת הפרסום ולא להיגרר להורדות מחיר בהמשך.</p>
          </div>
        </>
      ),
    },
    {
      id: 5,
      title: 'שיווק דירה בצורה מקיפה ומתקדמת',
      image: '/Business deal-rafiki (1).svg',
      reverse: false,
      content: (
        <>
          <p className="mb-4 text-gray-700">הנכס משווק במקביל במספר ערוצים כדי להגיע לכמה שיותר קונים רלוונטיים:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>צילום מקצועי</li>
            <li>פרסום באתרי נדל״ן מובילים</li>
            <li>קמפיינים ממומנים ברשתות חברתיות ובגוגל</li>
            <li>חשיפה למאגר קונים קיים</li>
            <li>שיתופי פעולה עם מתווכים</li>
            <li>שילוט ופעילות שטח</li>
          </ul>
          <p className="mt-4 text-gray-700 font-medium">שיווק נכון מייצר תחרות בין קונים — ולא רק מציאת קונה אחד.</p>
        </>
      ),
    },
    {
      id: 6,
      title: 'ניהול משא ומתן וסגירת עסקת נדל״ן',
      image: '/Cohort analysis-rafiki.svg',
      reverse: true,
      content: (
        <>
          <div className="space-y-3 text-gray-700">
            <p>אנו מרכזים את כל הפניות וההצעות בתיק נכס מסודר ומבצעים ניתוח שקוף מול בעלי הדירה.</p>
            <p>מתבצע ניהול מו״מ מקצועי הכולל תנאי תשלום, לוחות זמנים ופינוי עד להשגת התנאים האופטימליים עבור המוכר.</p>
            <p>לאחר הסכמה מועברים הפרטים לעורכי הדין עד חתימת חוזה והשלמת העסקה בצורה בטוחה וחלקה.</p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-warm">
      {/* Hero Section */}
      <SecondaryHero
        img="/7.jpg"
        title="תהליך מכירת דירה עם משרד תיווך מקצועי"
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