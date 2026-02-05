'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import './about.css';

export default function AboutPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const numOfPages = 5;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;

      // Если контент показан - разрешаем обычный скролл
      if (showContent && window.scrollY > 0) return;

      e.preventDefault();

      if (e.deltaY < 0) {
        // Скролл вверх
        if (currentPage > 1) {
          setCurrentPage(prev => prev - 1);
          setIsScrolling(true);
          setTimeout(() => setIsScrolling(false), 1000);
        }
      } else {
        // Скролл вниз
        if (currentPage < numOfPages) {
          setCurrentPage(prev => prev + 1);
          setIsScrolling(true);
          setTimeout(() => setIsScrolling(false), 1000);
        } else if (currentPage === numOfPages && !showContent) {
          // На последней странице - показываем контент
          setShowContent(true);
          setTimeout(() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }, 100);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling || showContent) return;

      if (e.key === 'ArrowUp' && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 1000);
      } else if (e.key === 'ArrowDown' && currentPage < numOfPages) {
        setCurrentPage(prev => prev + 1);
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 1000);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, isScrolling, showContent]);

  const scrollToContent = () => {
    setShowContent(true);
    setTimeout(() => {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div dir="rtl">
      {/* Skewed Slider Hero Section */}
      <div className="skw-pages">
        {/* Page 1 */}
        <div className={`skw-page skw-page-1 ${currentPage === 1 ? 'active' : ''} ${Math.abs(currentPage - 1) === 1 ? 'inactive' : ''}`}>
          <div className="skw-page__half skw-page__half--left">
            <div className="skw-page__skewed">
              <div className="skw-page__content skw-page-1-left"></div>
            </div>
          </div>
          <div className="skw-page__half skw-page__half--right">
            <div className="skw-page__skewed">
              <div className="skw-page__content skw-page-1-right">
                <h2 className="skw-page__heading">אודות זמיר נדל״ן</h2>
                <p className="skw-page__description">
                  משרד תיווך ושיווק נכסים ופרויקטים של נדל״ן
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Page 2 */}
        <div className={`skw-page skw-page-2 ${currentPage === 2 ? 'active' : ''} ${Math.abs(currentPage - 2) === 1 ? 'inactive' : ''}`}>
          <div className="skw-page__half skw-page__half--left">
            <div className="skw-page__skewed">
              <div className="skw-page__content skw-page-2-left">
                <h2 className="skw-page__heading">מי אנחנו</h2>
                <p className="skw-page__description">
                  משרד תיווך למכירה והשכרה בחולון, בת-ים, יפו ודרום תל אביב
                </p>
              </div>
            </div>
          </div>
          <div className="skw-page__half skw-page__half--right">
            <div className="skw-page__skewed">
              <div className="skw-page__content skw-page-2-right"></div>
            </div>
          </div>
        </div>

        {/* Page 3 */}
        <div className={`skw-page skw-page-3 ${currentPage === 3 ? 'active' : ''} ${Math.abs(currentPage - 3) === 1 ? 'inactive' : ''}`}>
          <div className="skw-page__half skw-page__half--left">
            <div className="skw-page__skewed">
              <div className="skw-page__content skw-page-3-left"></div>
            </div>
          </div>
          <div className="skw-page__half skw-page__half--right">
            <div className="skw-page__skewed">
              <div className="skw-page__content skw-page-3-right">
                <h2 className="skw-page__heading">צוות מקצועי</h2>
                <p className="skw-page__description">
                  סוכנים בעלי רישיון תיווך וניסיון של מינימום שנתיים
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Page 4 */}
        <div className={`skw-page skw-page-4 ${currentPage === 4 ? 'active' : ''} ${Math.abs(currentPage - 4) === 1 ? 'inactive' : ''}`}>
          <div className="skw-page__half skw-page__half--left">
            <div className="skw-page__skewed">
              <div className="skw-page__content skw-page-4-left">
                <h2 className="skw-page__heading">TOP 10 המשרדים</h2>
                <p className="skw-page__description">
                  אחד מ-10 המשרדים הטובים ביותר בחולון ובת-ים
                </p>
              </div>
            </div>
          </div>
          <div className="skw-page__half skw-page__half--right">
            <div className="skw-page__skewed">
              <div className="skw-page__content skw-page-4-right"></div>
            </div>
          </div>
        </div>

        {/* Page 5 */}
        <div className={`skw-page skw-page-5 ${currentPage === 5 ? 'active' : ''} ${Math.abs(currentPage - 5) === 1 ? 'inactive' : ''}`}>
          <div className="skw-page__half skw-page__half--left">
            <div className="skw-page__skewed">
              <div className="skw-page__content skw-page-5-left"></div>
            </div>
          </div>
          <div className="skw-page__half skw-page__half--right">
            <div className="skw-page__skewed">
              <div className="skw-page__content skw-page-5-right">
                <h2 className="skw-page__heading">טכנולוגיה מתקדמת</h2>
                <p className="skw-page__description">
                  מערכת ניהול דיגיטלית עם CRM וקמפיינים לנכסים
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Skip to content button */}
        <button
          onClick={scrollToContent}
          className="skip-to-content"
        >
          עבור לתוכן ↓
        </button>

        {/* Page indicator */}
        <div className="page-indicator">
          {Array.from({ length: numOfPages }, (_, i) => (
            <div
              key={i}
              className={`page-dot ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => {
                if (!isScrolling) {
                  setCurrentPage(i + 1);
                  setIsScrolling(true);
                  setTimeout(() => setIsScrolling(false), 1000);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Additional Content Below Slider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white"
        style={{
          pointerEvents: showContent ? 'auto' : 'none',
          minHeight: showContent ? 'auto' : 0
        }}
      >
        {/* Stats Section */}
        <section className="py-24 md:py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                המספרים שלנו
              </h2>
              <p className="text-xl text-gray-600">
                הישגים שמדברים בעד עצמם
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: '1000+', label: 'לקוחות מרוצים', icon: '👥' },
                { number: '500+', label: 'נכסים במאגר', icon: '🏠' },
                { number: '10+', label: 'שנות ניסיון', icon: '⭐' },
                { number: '24/7', label: 'שירות לקוחות', icon: '💼' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl p-8 text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-6xl mb-4">{stat.icon}</div>
                  <div className="text-4xl font-black text-[#C19A6B] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-lg">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <div className="inline-block px-6 py-2 bg-[#C19A6B]/10 rounded-full">
                  <span className="text-[#C19A6B] font-bold text-sm uppercase tracking-wide">
                    הצוות שלנו
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                  מומחים בתחום הנדל״ן
                </h2>

                <p className="text-xl text-gray-700 leading-relaxed">
                  במשרדינו עובדים סוכנים מקצועיים בעלי רישיון תיווך וניסיון של מינימום שנתיים בתחום הנדל״ן. כל סוכן עבר הכשרה מקצועית ומתמחה בתחום המומחיות שלו.
                </p>

                <div className="space-y-4">
                  {[
                    'רישיון תיווך מורשה',
                    'ניסיון של מעל שנתיים',
                    'הכשרה מקצועית מתמשכת',
                    'שירות אישי ומסור'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#C19A6B] flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span className="text-lg text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative h-125 rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="/images/hero/sales.jpg"
                  alt="Team"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="py-32 bg-linear-to-br from-[#C19A6B] to-[#A67C52] text-white"
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-5xl md:text-6xl font-black mb-6 uppercase">
              מוכנים למצוא את הבית החדש?
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-white/90">
              הצטרפו למאות לקוחות מרוצים שמצאו את הנכס המושלם עם זמיר נדל״ן
            </p>
            <Link
              href="/contact"
              className="inline-block px-16 py-6 bg-white text-gray-900 font-black text-xl uppercase tracking-tight rounded-sm shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95"
            >
              צרו קשר
            </Link>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
