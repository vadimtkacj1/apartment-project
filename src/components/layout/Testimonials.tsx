"use client";
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  context?: string;
}

const Testimonials: React.FC = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [title, setTitle] = useState<string>('מה הלקוחות שלנו אומרים');
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const response = await fetch('/api/homepage-titles', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setTitle(data.testimonialsTitle || 'מה הלקוחות שלנו אומרים');
        }
      } catch (error) {
        console.error('Error fetching title:', error);
      }
    };
    fetchTitle();
  }, []);

  const testimonials: Testimonial[] = [
    { id: 1, name: "מיכל דרור", rating: 5, context: "ליווי עסקה · חולון", text: "עברנו כמה מתווכים לפניו - ההבדל היה משמעותי. סדר, ארגון ותחושת ביטחון מהרגע הראשון." },
    { id: 2, name: "דורון לוי", rating: 5, context: "קניית דירה · בת ים", text: "הגענו ליואב אלמוג אחרי תקופה ארוכה של חיפושים ללא הצלחה. יואב הבין תוך פגישה אחת מה אנחנו מחפשים ומצא לנו את דירת החלומות תוך שבועיים. המקצועיות והרוגע שלו הפכו את כל התהליך לפשוט ונעים." },
    { id: 3, name: "עדן שליו", rating: 5, context: "מכירת דירה · חולון", text: "יואב ידע להעריך נכון את שווי הדירה ולהביא רק קונים מתאימים. מכירה מהירה ומדויקת." },
    { id: 4, name: "רועי אזולאי", rating: 5, context: "מכירת בית · מרכז", text: "חוויית השירות ב'Aiterra' היא ברמה הגבוהה ביותר. השילוב של דניאל ויואב יוצר מעטפת מקצועית שקשה למצוא היום. הם מכרו את הבית שלנו במחיר שיא ותוך זמן קצר מאוד. פשוט תענוג לעבוד איתם." },
    { id: 5, name: "בר פלד", rating: 5, context: "ליווי עסקה · חולון", text: "שירות אישי ואכפתי. הרגשנו שהוא באמת רוצה שנעשה את העסקה הנכונה ולא רק לסגור מכירה." },
    { id: 6, name: "אורי גלילי", rating: 5, context: "קניית נכס · בת ים", text: "מקצועיות יוצאת דופן. הבין את הצרכים שלנו בצורה מושלמת והתאים את הנכס במדויק. חסך לנו חודשים של חיפושים." },
    { id: 7, name: "רוני אבידן", rating: 5, context: "ליווי עסקה · חולון", text: "היה זמין תמיד גם מעבר לשעות העבודה. כל התהליך עבר בנעימים וללא הפתעות." },
    { id: 8, name: "מיכל אברהם", rating: 5, context: "נכס להשקעה · מרכז", text: "חיפשתי נכס להשקעה והיה לי חשוב לעבוד עם מישהו שאפשר לסמוך עליו בעיניים עצומות. יואב אלמוג הפגין בקיאות מדהימה בשוק הנדל\"ן המקומי והיה זמין לכל שאלה שלי, גם בשעות לא שגרתיות. מומלץ בחום!" },
    { id: 9, name: "גל סער", rating: 5, context: "מכירת דירה · חולון", text: "ניהול משא ומתן חכם והוגן לשני הצדדים. הרגשנו שאנחנו עובדים עם אדם ישר שמכבד גם את המוכרים וגם את הקונים." },
    { id: 10, name: "איתן מורג", rating: 5, context: "ליווי עסקה · בת ים", text: "העסקה נראתה תקועה, אבל יואב הצליח לפתור את המחלוקות ולהוביל לחתימה. מקצוען אמיתי." },
    { id: 11, name: "אלון שמואלי", rating: 5, context: "עסקת מקרקעין · חולון", text: "שילוב של מקצועיות ואנושיות. תמיד בגובה העיניים ובלי משחקים. בדיוק מה שצריך בעולם הנדל\"ן." },
    { id: 12, name: "נתלי רוזן", rating: 5, context: "מכירת דירה · מרכז", text: "העסקה הייתה מורכבת מאוד, אבל דניאל ניהל את המשא ומתן בתבונה וגישר על הפערים. שירות ברמה גבוהה." },
    { id: 13, name: "יניב כהן", rating: 5, context: "קניית דירה · חולון", text: "יואב אלמוג הוא מקצוען אמיתי. הוא ניהל עבורנו משא ומתן קשוח בצורה מעוררת השראה ודאג שנקבל את התנאים הטובים ביותר. אם אתם מחפשים מתווך שנלחם עבור הלקוחות שלו – זה האיש." },
    { id: 14, name: "יובל פרקש", rating: 5, context: "ניהול נכסים · בת ים", text: "ניהול נכסים ברמה גבוהה. לא היינו צריכים להתעסק בכלום - טיפול בתיקונים, חוזים ודיירים, הכל עבר דרכו בצורה חלקה." },
    { id: 15, name: "שירה מלמד", rating: 5, context: "ליווי עסקה · חולון", text: "קיבלנו ליווי מלא מהשלב הראשון ועד החתימה. כל שאלה נענתה במהירות ובסבלנות. דניאל ידע להרגיע ברגעים לחוצים." },
    { id: 16, name: "רותם כנפי", rating: 5, context: "עסקת מקרקעין · מרכז", text: "אדם נעים, ישר והגון. בדיוק מי שתרצו לצידכם בעסקת מקרקעין. ממליץ בחום לכל מי שמחפש תיווך איכותי." },
    { id: 17, name: "הילה בר-און", rating: 5, context: "מכירת דירה · חולון", text: "מהפגישה הראשונה ידענו שאנחנו בידיים טובות. מכר את הדירה במהירות ובמחיר מצוין. ממליצה בחום." },
    { id: 18, name: "עידו בר-לב", rating: 5, context: "מכירת דירה · בת ים", text: "פנינו לדניאל אחרי תקופה ארוכה שניסינו למכור לבד ללא הצלחה. מהרגע הראשון הרגשנו שיש על מי לסמוך. התהליך נוהל במקצועיות והדירה נמכרה במחיר גבוה מהמצופה." },
    { id: 19, name: "נועם רפאלי", rating: 5, context: "דירה ראשונה · חולון", text: "יואב ליווה אותנו ברכישת הדירה הראשונה שלנו. הסביר הכל בסבלנות, בדק פרטים שלא חשבנו עליהם ונתן לנו ביטחון לאורך כל הדרך." },
    { id: 20, name: "מיה הדרי", rating: 5, context: "השכרת דירה · חולון", text: "השכרנו דירה דרך דניאל והוא מצא דיירים איכותיים בזמן קצר מאוד. ההתנהלות הייתה נעימה וברורה לאורך כל הדרך." },
    { id: 21, name: "תומר כהנא", rating: 5, context: "ליווי עסקה · מרכז", text: "עבדנו עם הרבה אנשי מקצוע, אבל רמת הדיוק, האמינות והיחס האישי שקיבלנו כאן הייתה מעל הכל. היה לו חשוב האינטרס שלנו." },
    { id: 22, name: "דנה קסטן", rating: 5, context: "מכירת דירה · חולון", text: "מקצוען אמיתי. למד את השוק לעומק, תמחר נכון והביא רק קונים רציניים. חסך לנו המון זמן וכאב ראש." },
    { id: 23, name: "לירון ברקאי", rating: 5, context: "השכרת נכס · בת ים", text: "ניהל עבורנו השכרת נכס - הכל נעשה בצורה מסודרת, חוזים ברורים ודיירים מצוינים. שקט נפשי אמיתי." },
    { id: 24, name: "איתי מזרחי", rating: 5, context: "מכירת דירה · חולון", text: "דניאל ויואב הם השילוב המושלם בין ידע שיווקי רחב ליחס אישי וחם. מהרגע שהנכס פורסם ועד לחתימה על החוזה, הכל תוקתק בשקיפות מלאה ובמקצוענות ללא פשרות. תודה רבה לכם!" },
    { id: 25, name: "אוראל סויסה", rating: 5, context: "ליווי עסקה · חולון", text: "לא רק מתווך אלא יועץ. הסביר כל שלב והיה זמין תמיד. הרגשנו שיש מישהו שבאמת מייצג אותנו." }
  ];

  const reviewCount = testimonials.length;
  const avgRating = (testimonials.reduce((sum, t) => sum + t.rating, 0) / reviewCount).toFixed(1);
  // White text sits on every avatar colour — all AA on white, none the bright #5594F1.
  const avatarColors = ['#354AC4', '#2A69C4', '#051150', '#4A5FD6', '#28389B'];

  return (
    <section className="relative w-full py-16 md:py-20 overflow-hidden bg-white" dir="rtl">
      <div className="relative z-10 max-w-[1300px] mx-auto px-4">

        <div className="text-center">
          <div className="inline-block mb-4">
            <span className="block text-[13px] md:text-sm font-semibold text-[#354AC4]">
              חוות דעת
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
            {title || 'מה הלקוחות שלנו אומרים'}
          </h2>
        </div>

        {/* Aggregate credibility strip */}
        <div className="flex justify-center mb-12 md:mb-16">
          <div
            className="inline-flex items-center gap-2.5 rounded-2xl bg-white border border-[#E4E8F2] px-5 py-2.5"
            style={{ boxShadow: '0 2px 10px rgba(5,17,80,0.06)' }}
          >
            <span className="font-bold text-[#051150]">Google</span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-bold text-[#051150]">
              <span dir="ltr">{avgRating}</span>
              <Star size={16} className="fill-amber-400 text-amber-400" aria-hidden="true" />
            </span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-sm md:text-base text-slate-500">
              <span dir="ltr">{reviewCount}</span> ביקורות
            </span>
          </div>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay, Pagination, EffectCoverflow]}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1.15}
            loop={true}
            autoplay={reduced ? false : { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: false,
            }}
            onSwiper={setSwiperInstance}
            breakpoints={{
              768: { slidesPerView: 1.8 },
              1024: { slidesPerView: 2.5 },
            }}
            pagination={{
              clickable: true,
              el: '.testimonial-pagination',
              bulletClass: 'testimonial-bullet',
              bulletActiveClass: 'testimonial-bullet-active',
            }}
            className="!pt-5 !pb-12 overflow-visible"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                {({ isActive }) => (
                  <div
                    aria-hidden={!isActive}
                    className={`relative bg-white rounded-2xl p-8 md:p-12 flex flex-col items-center text-center transition-all duration-700 h-full border
                    ${isActive
                      ? 'border-[#E4E8F2] scale-100'
                      : 'border-[#EEF1F8] scale-90 blur-[2px]'}`}
                    style={isActive ? { boxShadow: '0 4px 20px rgba(5,17,80,0.12)' } : undefined}
                  >

                    <div className="flex gap-1.5 mb-6">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} size={20} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                      ))}
                    </div>

                    <div className="min-h-[120px] md:min-h-[140px] flex items-center">
                      <p className={`text-lg md:text-2xl leading-[1.6] md:leading-[1.8] transition-colors duration-500
                        ${isActive ? 'text-gray-700 font-medium italic' : 'text-gray-500'}`}>
                        "{testimonial.text}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-8 md:mt-10">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                        style={{ background: avatarColors[testimonial.id % avatarColors.length] }}
                        aria-hidden="true"
                      >
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="text-start">
                        <h3 className={`text-lg font-black leading-tight ${isActive ? 'text-[#051150]' : 'text-gray-500'}`}>
                          {testimonial.name}
                        </h3>
                        {testimonial.context && (
                          <p className="mt-0.5 text-sm text-slate-500 leading-tight">{testimonial.context}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Buttons: Desktop only */}
          <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 z-30 pointer-events-none justify-between px-4">
            <button
              onClick={() => swiperInstance?.slideNext()} // במצב RTL, Next זה שמאלה
              aria-label="חוות הדעת הבאה"
              className="pointer-events-auto w-14 h-14 rounded-full bg-[#354ac4] text-white flex items-center justify-center shadow-md hover:bg-[#28389b] transition-colors"
            >
              <ChevronRight size={32} aria-hidden="true" />
            </button>
            <button
              onClick={() => swiperInstance?.slidePrev()} // במצב RTL, Prev זה ימינה
              aria-label="חוות הדעת הקודמת"
              className="pointer-events-auto w-14 h-14 rounded-full bg-[#354ac4] text-white flex items-center justify-center shadow-md hover:bg-[#28389b] transition-colors"
            >
              <ChevronLeft size={32} aria-hidden="true" />
            </button>
          </div>

          <div className="testimonial-pagination flex items-center justify-center gap-2 mt-4 md:mt-10"></div>
        </div>
      </div>

      <style jsx global>{`
        .testimonial-bullet {
          width: 8px;
          height: 8px;
          background: #D1D5DB;
          border-radius: 50%;
          transition: all 0.4s ease;
          cursor: pointer;
        }
        .testimonial-bullet-active {
          width: 30px;
          background: #354ac4;
          border-radius: 10px;
        }
        @media (min-width: 768px) {
          .testimonial-bullet { width: 10px; height: 10px; }
          .testimonial-bullet-active { width: 35px; }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;