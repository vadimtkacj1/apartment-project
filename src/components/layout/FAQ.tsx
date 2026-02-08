"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "מהו העלויות הנוספות שצריך לקחת בחשבון בעת רכישת דירה?",
      answer: "בנוסף למחיר הדירה, יש לקחת בחשבון: מס רכישה (בהתאם לסוג הדירה והמחיר), שכר טרחת עורך דין (כ-1-2% מערך הנכס), דמי תיווך (עד 2% + מע\"ם), אגרות רישום בטאבו, בדיקות מהנדס, ועלויות שיפוצים אפשריות. כמו כן, יש להתחשב בוועד בית או הוצאות שוטפות אחרות."
    },
    {
      id: 2,
      question: "מהו זמן ההמתנה הממוצע למכירת דירה?",
      answer: "זמן המכירה הממוצע תלוי במיקום, מחיר, ומצב הנכס. בממוצע, תהליך מכירה יכול לקחת בין 3-6 חודשים. עם זאת, נכסים במיקומים מבוקשים ובמחיר תחרותי עשויים להימכר תוך מספר שבועות. שיווק נכון, תמחור מדויק ושיפוצים קלים יכולים לקצר משמעותית את זמן המכירה."
    },
    {
      id: 3,
      question: "כיצד אוכל להבטיח מכירה מהירה של הדירה שלי?",
      answer: "כדי להבטיח מכירה מהירה: תמחרו את הדירה במחיר תחרותי על פי שווי השוק, בצעו שיפוצי קוסמטיקה (צביעה, תיקונים קלים), ערכו סטיילינג מקצועי, צלמו תמונות איכותיות, שווקו בערוצים מגוונים, עבדו עם סוכן מקצועי שמכיר את השוק, והיו גמישים בתיאום ביקורים. חשוב גם להכין את כל המסמכים מראש."
    },
    {
      id: 4,
      question: "איך אני יודע אם מחיר הוא אמיתי?",
      answer: "כדי לבדוק אם מחיר אמיתי: השוו מחירי דירות דומות באזור, בדקו מחירי עסקאות שהתבצעו לאחרונה, התייעצו עם מספר סוכנים מקצועיים, בדקו מחירים באתרי נדל\"ן מובילים, קחו בחשבון את מצב הנכס, המיקום המדויק, קומה, כיווני אוויר ומתקנים בבניין. מומלץ גם להזמין שמאי מקרקעין לחוות דעת מקצועית."
    },
    {
      id: 5,
      question: "האם ניתן לשפר את ערך הדירה לפני מכירה?",
      answer: "בהחלט! ניתן לשפר את ערך הדירה באמצעות: צביעה רעננה, תיקון פגמים קטנים, שדרוג תאורה, החלפת ברזים ואביזרים ישנים, ניקיון יסודי, סילוק עודפים, שיפוץ מטבח או אמבטיה (ROI גבוה), שדרוג רצפה, טיפול בגינה או במרפסת, ושיפור כניסה לבניין. השקעות קטנות יכולות להניב תוספת ערך משמעותית."
    },
    {
      id: 6,
      question: "כמה זמן לוקח לקבל משכנתא?",
      answer: "תהליך אישור משכנתא לוקח בדרך כלל בין 2-4 שבועות, תלוי בבנק ובמורכבות המקרה. התהליך כולל: הגשת בקשה ומסמכים ראשוניים (1-2 ימים), בדיקת כושר פירעון והון עצמי (שבוע), שמאות (שבוע-שבועיים), ואישור סופי. מומלץ להתחיל תהליך זה מוקדם, עוד לפני מציאת נכס, כדי לקצר זמנים."
    },
    {
      id: 7,
      question: "מה לבדוק לפני רכישת דירה יד שנייה?",
      answer: "חשוב לבדוק: מצב הבניין והדירה (סדקים, רטיבות, אינסטלציה), תקינות המערכות (חשמל, אינסטלציה, מיזוג), מסמכים משפטיים (טאבו, היעדר עיקולים, תביעות), תב\"ע ואפשרויות בנייה, ארנונה וחובות ועד בית, רמת בידוד אקוסטי, חניה וזכויות שימוש במרחבים משותפים. מומלץ להיעזר במהנדס בודק ובעורך דין מקרקעין."
    }
  ];

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section dir="rtl" className="relative w-full py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#C19A6B] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-[#C19A6B] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <HelpCircle className="text-[#C19A6B]" size={32} />
            <span className="text-[#C19A6B] font-bold text-lg uppercase tracking-wider">
              שאלות נפוצות
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight">
            שאלות ותשובות
          </h1>

          <div className="w-32 h-1 bg-[#C19A6B] mx-auto mb-6"></div>

          <p className="text-xl md:text-2xl text-gray-600 font-semibold max-w-3xl mx-auto">
            מצאנו עבורכם את התשובות לשאלות הנפוצות ביותר בתחום הנדל&quot;ן
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <button
                onClick={() => toggleFAQ(item.id)}
                className="w-full text-right p-6 md:p-8 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors duration-200"
                aria-expanded={openId === item.id}
              >
                <span className="text-lg md:text-xl font-bold text-gray-900 flex-1">
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: openId === item.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown
                    className={`${
                      openId === item.id ? 'text-[#C19A6B]' : 'text-gray-400'
                    } transition-colors duration-200`}
                    size={28}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2">
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>
                      <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-[#C19A6B] to-[#A6835B] rounded-3xl p-8 md:p-12 shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
              לא מצאתם תשובה?
            </h3>
            <p className="text-lg md:text-xl text-white/90 mb-6">
              צרו איתנו קשר ונשמח לענות על כל שאלה
            </p>
            <a
              href="/#contact"
              className="inline-block bg-white text-[#C19A6B] font-bold text-lg px-8 py-4 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              צור קשר
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
