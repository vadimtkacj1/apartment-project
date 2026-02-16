'use client';

import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Printer } from 'lucide-react';
import ContactForm from '@/components/layout/ContactForm';

export default function BuyingApartmentPage() {
  const sections = [
    {
      id: 1,
      title: 'בירור צרכים',
      image: '/Contact us-pana.svg',
      reverse: true,
      content: (
        <>
          <p className="text-gray-700">
            פגישת ייעוץ ראשונה ללא עלות עם אחד מסוכני המשרד<br />
            בפגישה נברר מהם העדפות חיפוש והצרכים שלכם.<br />
            ננתח יחד את מגמות שוק הנדל"ן והסביבה בהן אתם מעוניינים.<br />
            נתכנן יחד תהליך נכון עבורכם כדי שתעשו רכישה בטוחה ומוצלחת ללא "הפתעות בדרך".
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
          <div className="space-y-3 text-gray-700">
            <p>
              תקבלו מאיתנו אנשי קשר מומלצים בבנקים שיתנו לכם טיפול וייעוץ מסור ומהיר
            </p>
            <p>
              עד שתקבלו אישור עקרוני למימון העסקה וכך תוכלו לצאת לחיפוש דירה בבטחה כשאתם יודעים שתוכלו לממן את העסקה.
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
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>סוכני המשרד יאתרו עבורכם נכסים בדיוק ע"פ הצרכים והתקציב שלכם,</li>
            <li>משרדינו עובד עם התוכנות הדיגטאליות הכי מתקדמות, עם פילוח מדוייק לנכסים הרלוונטים עבורכם.</li>
            <li>תקבלו מידע מדוייק ואמין על נתוני הנכס.</li>
            <li>תקבלו דף עם מאפייני נכס עבור כל נכס שתגיעו להתרשם.</li>
            <li>נוציא עבורכם נסח טאבו ותרשים בית משותף.</li>
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
          <p className="text-gray-700">
            ננהל עבורכם מו"מ ונשיג לכם את העסקה והתנאים הכי טובים<br />
            נסגור לכם את כל פרטי העסקה<br />
            נלווה אתכם בבטחה ונפנה אתכם לעורכי דין, שמאי מקרקעין יועצי משכנתאות המומלצים ביותר.<br />
            נעשה תמונה מסורתית ונפתח יחד בקבוק יין.
          </p>
        </>
      ),
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-warm">
      {/* Hero Section */}
      <SecondaryHero
        img="/7.jpg"
        title="קונים דירה"
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

