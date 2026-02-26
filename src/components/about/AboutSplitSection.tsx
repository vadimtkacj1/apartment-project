'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function AboutSplitSection() {
  const scrollToNextSection = () => {
    const nextSection = document.querySelector('.about-local-expertise, .about-services, section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative py-20 w-full bg-[#f5f5f0] overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Image Section - Left */}
          <motion.div
            className="relative h-[450px] lg:h-[550px] rounded-[2rem] overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/images/buildings.jpeg"
              alt="רם וחיים נכסים"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Text Content - Right */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Main Title */}
            <h1 className="text-4xl font-extrabold text-[#1c3664] mb-4" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
              אודות
            </h1>

            {/* Subtitle/Tagline - Bold */}
            <h2 className="text-3xl font-bold text-[#1c3664] leading-[1.6] mb-6" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
              רם שיווק נכסים & חיים עגבי הוא משרד תיווך ושיווק נכסים בעל ניסיון של למעלה מ24- שנה.
            </h2>

            {/* Description Paragraphs */}
            <div className="space-y-4 text-[#333333]">
              <p className="text-base lg:text-lg leading-relaxed">
                המשרד מתמחה במכירה, השכרה ותיווך נכסים בחולון, עם ניסיון מקצועי רב בניהול עסקאות נדל"ן בכלל אזורי חולון, בת ים וגוש דן הגדול. אנחנו מציעים ללקוחות מערך שירות מקיף בתחומי הנדל"ן, תוך גישה אישית ומקצועית לכל לקוח.
              </p>

              <p className="text-base lg:text-lg leading-relaxed">
                אנו מלווים את בעלי הנכסים באופן מלא בניהול, ניהול משא ומתן עד לסגירת עסקה בתנאים הטובים ביותר. המשרד מתמחה בתיווך והשכרה, בניהול נכסים, פרויקטים, נכסים להשקעה ופיתוח נכסים, וליווי מקצועי לאורך כל תהליך העסקה.
              </p>

              <p className="text-base lg:text-lg leading-relaxed">
                באמצעות ליווי אישי, תמחור מדויק ופרסום מקצועי, אנחנו מבטיחים שירות אישי, מחיר הוגן ושיווק חכם עם הבנה עמוקה של השוק המקומי והקונים הפוטנציאלים.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <button
                onClick={scrollToNextSection}
                className="group inline-flex items-center gap-3 bg-[#1c3664] hover:bg-[#2a4a8c] text-white px-8 py-4 rounded-xl font-bold text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>קרא עוד על המשרד</span>
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
