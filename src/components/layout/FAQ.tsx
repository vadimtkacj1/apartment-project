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
      question: "אילו הוצאות נוספות צריך לקחת בחשבון בעת רכישת דירה?",
      answer: "מעבר למחיר הדירה עצמה, יש הוצאות נוספות כמו מס רכישה, שכר טרחת עורך דין, דמי תיווך, שמאות, הובלה ושיפוצים במידת הצורך. חשוב לתכנן את התקציב מראש כדי להימנע מהפתעות בהמשך."
    },
    {
      id: 2,
      question: "כמה זמן לוקח בדרך כלל למכור דירה?",
      answer: "משך הזמן משתנה לפי מחיר הנכס, מיקום, מצב הדירה והביקוש באזור. דירה שמתומחרת נכון ומשווקת בצורה מקצועית יכולה להימכר בתוך שבועות ספורים, בעוד נכסים שמתומחרים גבוה מדי עלולים להישאר זמן רב בשוק."
    },
    {
      id: 3,
      question: "איך ניתן למכור דירה במהירות ובמחיר טוב?",
      answer: "המפתח הוא תמחור נכון מההתחלה, צילום איכותי, שיווק ממוקד וניהול משא ומתן מקצועי. שילוב של כל הגורמים האלו מגדיל משמעותית את הסיכוי למכירה מהירה ובתנאים טובים."
    },
    {
      id: 4,
      question: "איך יודעים שהמחיר של הדירה ריאלי?",
      answer: "בדיקת מחיר מתבצעת לפי עסקאות שבוצעו באזור, מצב הנכס, קומה, גודל, חניה, מעלית ומאפיינים נוספים. מתווך שמכיר היטב את השוק המקומי יכול לתת הערכת מחיר מדויקת המבוססת על נתונים אמיתיים ולא על תחושות."
    },
    {
      id: 5,
      question: "האם אפשר לשפר את ערך הדירה לפני מכירה?",
      answer: "כן. לעיתים שיפוצים קלים, צביעה, סידור וניקיון מקצועי יכולים לשפר משמעותית את הרושם על קונים פוטנציאליים ולהוביל להצעות מחיר גבוהות יותר."
    },
    {
      id: 6,
      question: "כמה זמן לוקח לקבל משכנתא לאחר חתימת חוזה?",
      answer: "ברוב המקרים התהליך לוקח בין שלושה לשישה שבועות, תלוי בבנק, במורכבות התיק ובמסמכים הנדרשים. תכנון נכון והכנה מוקדמת יכולים לקצר את התהליך."
    },
    {
      id: 7,
      question: "מה צריך לבדוק לפני רכישת דירה יד שנייה?",
      answer: "חשוב לבדוק את מצבה הפיזי של הדירה, רישום בטאבו, חריגות בנייה, חובות קיימים, מצב הבניין והסביבה. בדיקה יסודית מונעת בעיות משפטיות והוצאות בלתי צפויות."
    },
    {
      id: 8,
      question: "האם כדאי למכור דירה לבד או עם מתווך?",
      answer: "מכירה עם מתווך מקצועי חוסכת זמן, טעויות ולחצים מיותרים. מתווך מנוסה מבצע תמחור מדויק, משווק את הנכס לקהל יעד נכון ומנהל את המשא ומתן בצורה שתשיג את התנאים הטובים ביותר עבור המוכר."
    },
    {
      id: 9,
      question: "מה כולל תהליך ליווי במכירת נכס?",
      answer: "התהליך כולל הערכת שווי, בניית אסטרטגיית שיווק, צילום מקצועי, פרסום הנכס, סינון פניות, תיאום ביקורים, ניהול משא ומתן וליווי עד חתימת החוזה."
    }
  ];

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      dir="rtl"
      className="relative w-full py-24 md:py-32 overflow-hidden bg-warm"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#1c3664] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-[#1c3664] rounded-full blur-3xl"></div>
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
            <HelpCircle className="text-[#1c3664]" size={32} />
            <span className="text-[#1c3664] font-bold text-lg uppercase tracking-wider">
              שאלות נפוצות
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight">
            שאלות ותשובות
          </h1>

          <div className="w-32 h-1 bg-[#1c3664] mx-auto mb-6"></div>

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
                      openId === item.id ? 'text-[#1c3664]' : 'text-gray-400'
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
          <div className="bg-gradient-to-br from-[#1c3664] to-[#152a4f] rounded-3xl p-8 md:p-12 shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
              לא מצאתם תשובה?
            </h3>
            <p className="text-lg md:text-xl text-white/90 mb-6">
              צרו איתנו קשר ונשמח לענות על כל שאלה
            </p>
            <a
              href="/#contact"
              className="inline-block bg-white text-[#1c3664] font-bold text-lg px-8 py-4 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300"
              style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}
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
