"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import './SkewedSlider.css';

interface SliderPage {
  id: number;
  leftImage?: string;
  rightImage?: string;
  leftContent?: {
    heading: string;
    description: string;
  };
  rightContent?: {
    heading: string;
    description: string;
  };
}

const SkewedSlider: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLocked, setIsLocked] = useState(true); // Блокуємо одразу при завантаженні
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const lastScrollDirectionRef = useRef<'up' | 'down' | null>(null);
  const consecutiveScrollCountRef = useRef(0);

  const pages: SliderPage[] = [
    {
      id: 1,
      leftImage: '/images/hero/sales.jpg',
      rightContent: {
        heading: 'שיווק נכסים מקצועי',
        description: 'גלו את הדרך החדשה לשווק נכסים עם מובילי השוק'
      }
    },
    {
      id: 2,
      leftContent: {
        heading: 'מומחיות מקומית',
        description: 'היכרות עמוקה עם השוק המקומי בחולון ובת ים'
      },
      rightImage: '/images/hero/aboutus.webp'
    },
    {
      id: 3,
      leftImage: '/images/hero/rentals.webp',
      rightContent: {
        heading: 'השכרה ומכירה',
        description: 'ליווי מלא בכל שלבי תהליך העסקה'
      }
    },
    {
      id: 4,
      leftContent: {
        heading: 'ניסיון של 24+ שנים',
        description: 'מאות עסקאות מוצלחות ולקוחות מרוצים'
      },
      rightImage: '/images/hero/rent.webp'
    },
    {
      id: 5,
      leftImage: '/images/car.jpeg',
      rightContent: {
        heading: 'תוצאות מוכחות',
        description: 'שירות אישי ומקצועי שמביא לתוצאות'
      }
    }
  ];

  const numOfPages = pages.length;

  // Блокування/розблокування скролу
  useEffect(() => {
    if (isLocked) {
      // Зберігаємо поточну позицію скролу
      scrollPositionRef.current = window.pageYOffset;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
    } else {
      // Відновлюємо скрол
      const scrollY = scrollPositionRef.current;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isLocked]);

  // Відслідковування скролу назад до початку
  useEffect(() => {
    const handleScroll = () => {
      // Якщо користувач проскролив до самого верху і слайдер не заблокований
      if (!isLocked && window.pageYOffset === 0) {
        setIsLocked(true);
        setCurrentPage(1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLocked]);

  // Функція виходу зі слайдера
  const exitSlider = useCallback((direction: 'up' | 'down') => {
    setIsScrolling(true);

    // Розблоковуємо скрол
    setIsLocked(false);

    setTimeout(() => {
      setIsScrolling(false);
      consecutiveScrollCountRef.current = 0;
      lastScrollDirectionRef.current = null;

      // Даємо користувачеві можливість продовжити скрол
      if (direction === 'down') {
        window.scrollBy({
          top: 100,
          behavior: 'smooth'
        });
      }
    }, 300);
  }, []);

  // Навігація слайдером
  const navigate = useCallback((direction: 'up' | 'down') => {
    if (isScrolling) return;

    // Відстежуємо послідовні скроли в одному напрямку
    if (lastScrollDirectionRef.current === direction) {
      consecutiveScrollCountRef.current += 1;
    } else {
      consecutiveScrollCountRef.current = 1;
      lastScrollDirectionRef.current = direction;
    }

    if (direction === 'down') {
      if (currentPage < numOfPages) {
        setIsScrolling(true);
        setCurrentPage(prev => prev + 1);
        setTimeout(() => setIsScrolling(false), 1000);
      } else {
        // На останній сторінці - вийти зі слайдера і продовжити скрол
        exitSlider('down');
      }
    } else {
      if (currentPage > 1) {
        setIsScrolling(true);
        setCurrentPage(prev => prev - 1);
        setTimeout(() => setIsScrolling(false), 1000);
      }
      // На першій сторінці скрол вверх нічого не робить (ми вже на початку)
    }
  }, [currentPage, numOfPages, isScrolling, exitSlider]);

  // Обробка колеса миші
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isLocked) return;

      e.preventDefault();
      e.stopPropagation();

      if (e.deltaY > 0) {
        navigate('down');
      } else {
        navigate('up');
      }
    };

    if (isLocked) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isLocked, navigate]);

  // Обробка клавіш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLocked) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigate('down');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigate('up');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        // Вихід зі слайдера при натисканні ESC - завжди вниз до контенту
        exitSlider('down');
      }
    };

    if (isLocked) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLocked, navigate, exitSlider, currentPage, numOfPages]);

  return (
    <div ref={containerRef} className="skw-container">
      <div
        ref={sliderRef}
        className={`skw-pages ${isLocked ? 'locked' : ''}`}
        dir="rtl"
      >
        {pages.map((page) => (
          <div
            key={page.id}
            className={`skw-page skw-page-${page.id} ${
              currentPage === page.id ? 'active' :
              Math.abs(currentPage - page.id) === 1 ? 'inactive' : ''
            }`}
          >
            {/* Left Half */}
            <div className="skw-page__half skw-page__half--left">
              <div className="skw-page__skewed">
                <div
                  className={`skw-page__content ${page.leftImage ? 'has-image' : 'has-gradient'}`}
                  style={{
                    backgroundImage: page.leftImage ? `url(${page.leftImage})` : undefined
                  }}
                >
                  {page.leftContent && (
                    <>
                      <h2 className="skw-page__heading">{page.leftContent.heading}</h2>
                      <p className="skw-page__description">{page.leftContent.description}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Half */}
            <div className="skw-page__half skw-page__half--right">
              <div className="skw-page__skewed">
                <div
                  className={`skw-page__content ${page.rightImage ? 'has-image' : 'has-gradient'}`}
                  style={{
                    backgroundImage: page.rightImage ? `url(${page.rightImage})` : undefined
                  }}
                >
                  {page.rightContent && (
                    <>
                      <h2 className="skw-page__heading">{page.rightContent.heading}</h2>
                      <p className="skw-page__description">{page.rightContent.description}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Scroll Hint */}
        {isLocked && (
          <>
            {currentPage === 1 && (
              <div className="skw-scroll-hint">
                גלול להמשך • ESC לדלג
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            )}
            {currentPage > 1 && currentPage < numOfPages && (
              <div className="skw-scroll-hint">
                ESC לדלג
              </div>
            )}
            {currentPage === numOfPages && (
              <div className="skw-scroll-hint skw-scroll-hint-exit">
                גלול להמשך • ESC לדלג
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            )}
          </>
        )}

        {/* Navigation Dots */}
        <div className="skw-navigation">
          {pages.map((_, index) => (
            <button
              key={index}
              className={`skw-nav-dot ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => {
                if (!isScrolling && isLocked) {
                  setIsScrolling(true);
                  setCurrentPage(index + 1);
                  setTimeout(() => setIsScrolling(false), 1000);
                }
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkewedSlider;
