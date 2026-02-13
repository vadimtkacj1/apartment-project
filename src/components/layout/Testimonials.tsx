"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
}

const Testimonials: React.FC = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "רותם כנפי",
      rating: 5,
      text: "אדם נעים, ישר והגון. בדיוק מי שרוצים לידכם בעסקת נדל״ן. ממליץ לכל מי שמחפש תיווך איכותי."
    },
    {
      id: 2,
      name: "אלון שמואלי",
      rating: 5,
      text: "שילוב של מקצועיות ואנושיות. תמיד בגובה העיניים ובלי משחקים. בדיוק מה שצריך בעולם הנדל״ן."
    },
    {
      id: 3,
      name: "אורי גלילי",
      rating: 5,
      text: "מקצועיות יוצאת דופן. הבין בדיוק את הצרכים שלנו והתאים נכס בצורה מדויקת. חסך לנו חודשים של חיפושים."
    },
    {
      id: 4,
      name: "עידו בר-לב",
      rating: 5,
      text: "פנינו לרם אחרי תקופה ארוכה שניסינו למכור לבד ללא הצלחה. מהרגע הראשון הרגשנו שיש על מי לסמוך. התהליך נוהל בצורה מסודרת, שקופה ומקצועית ובסוף נמכר במחיר טוב משציפינו."
    },
    {
      id: 5,
      name: "מיכל דרור",
      rating: 5,
      text: "עברנו כמה מתווכים לפניו — ההבדל היה משמעותי. סדר, ארגון ותחושת ביטחון מהרגע הראשון."
    },
    {
      id: 6,
      name: "יובל פרקש",
      rating: 5,
      text: "ניהול נכס ברמה גבוהה. לא היינו צריכים להתעסק עם כלום — טיפול בתקלות, חוזים ושוכרים הכל עבר דרכו בצורה חלקה."
    },
    {
      id: 7,
      name: "לירון ברקאי",
      rating: 5,
      text: "ניהל עבורנו השכרת נכס — הכל נעשה מסודר, חוזים ברורים ושוכרים מצוינים. ראש שקט אמיתי."
    },
    {
      id: 8,
      name: "דנה קסטן",
      rating: 5,
      text: "מקצוען אמיתי. בדק את השוק לעומק, תימחר נכון והביא קונים רציניים בלבד. חסך לנו המון זמן והתעסקות."
    },
    {
      id: 9,
      name: "נועם רפאלי",
      rating: 5,
      text: "חיים ליווה אותנו ברכישת דירה ראשונה. הסביר הכל בסבלנות, בדק פרטים שלא חשבנו עליהם ונתן ביטחון לאורך כל הדרך."
    },
    {
      id: 10,
      name: "אוראל סויסה",
      rating: 5,
      text: "לא רק מתווך אלא יועץ. הסביר כל שלב בתהליך והיה זמין תמיד. הרגשנו שיש מי שמייצג אותנו באמת."
    },
    {
      id: 11,
      name: "רוני אבידן",
      rating: 5,
      text: "היה זמין תמיד גם מעבר לשעות העבודה. כל התהליך עבר בצורה נעימה וללא הפתעות."
    },
    {
      id: 12,
      name: "שירה מלמד",
      rating: 5,
      text: "קיבלנו ליווי מלא מהשלב הראשון ועד חתימה. כל שאלה קיבלה מענה במהירות ובסבלנות. רם ידע להרגיע ברגעים מלחיצים ולנווט את העסקה בצורה חכמה."
    },
    {
      id: 13,
      name: "בר פלד",
      rating: 5,
      text: "שירות אישי ואכפתי. הרגשנו שהוא באמת רוצה שנעשה עסקה נכונה ולא סתם לסגור עסקה."
    },
    {
      id: 14,
      name: "גל סער",
      rating: 5,
      text: "משא ומתן חכם והוגן לשני הצדדים. הרגשנו שמדובר באדם ישר שמכבד גם מוכרים וגם קונים."
    },
    {
      id: 15,
      name: "הילה בר-און",
      rating: 5,
      text: "מהפגישה הראשונה ידענו שאנחנו בידיים טובות. מכר את הדירה במהירות ובמחיר מצוין. ממליצה בחום."
    },
    {
      id: 16,
      name: "תומר כהנא",
      rating: 5,
      text: "עבדנו עם הרבה אנשי מקצוע בעבר, אבל רמת הדיוק, האמינות והיחס האישי שקיבלנו כאן הייתה מעל הכל. דאג לאינטרסים שלנו ולא לחץ לשום החלטה."
    },
    {
      id: 17,
      name: "עדן שלו",
      rating: 5,
      text: "חיים ידע להעריך נכון את שווי הדירה ולהביא קונים מתאימים בלבד. מכירה מהירה ומדויקת."
    },
    {
      id: 18,
      name: "מאיה הדרי",
      rating: 5,
      text: "השכרנו דירה דרך רם והוא מצא שוכרים איכותיים בזמן קצר מאוד. ההתנהלות הייתה נעימה וברורה לאורך כל הדרך."
    },
    {
      id: 19,
      name: "איתן מורג",
      rating: 5,
      text: "העסקה נראתה תקועה אבל חיים הצליח לפתור את המחלוקות ולהוביל לחתימה. מקצוען אמיתי."
    },
    {
      id: 20,
      name: "נטלי רוזן",
      rating: 5,
      text: "העסקה הייתה מורכבת מאוד, אבל רם ניהל משא ומתן בצורה חכמה והצליח לגשר בין הצדדים. שירות ברמה גבוהה."
    }
  ];

  return (
    <section dir="rtl" className="relative w-full py-20 overflow-hidden bg-warm">
      <div className="relative z-10 max-w-[1300px] mx-auto px-6">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-[#1c3664]">הלקוחות שלנו משתפים</h2>
        </div>

        <div className="relative px-2 md:px-16">
          <Swiper
            modules={[Navigation, Autoplay, Pagination, EffectCoverflow]}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1.2}
            loop={true}
            autoplay={{ delay: 5000 }}
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
            className="!pt-5 overflow-visible"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                {({ isActive }) => (
                  <div className={`
                    relative bg-white rounded-[2.5rem] p-10 md:p-14 flex flex-col items-center text-center transition-all duration-700
                    ${isActive 
                      ? 'shadow-[0_40px_100px_-20px_rgba(28,54,100,0.15)] scale-100 opacity-100 z-20' 
                      : 'shadow-none scale-90 opacity-40 blur-[1px] z-10'}
                  `}>
                    
                    {/* Звезды */}
                    <div className="flex gap-1.5 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={22} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Текст */}
                    <div className="min-h-[140px] flex items-center">
                      <p className={`text-xl md:text-2xl leading-[1.8] transition-colors duration-500
                        ${isActive ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                        "{testimonial.text}"
                      </p>
                    </div>

                    {/* Имя */}
                    <h4 className={`text-2xl md:text-3xl font-black mt-10 ${isActive ? 'text-[#1c3664]' : 'text-gray-300'}`}>
                      {testimonial.name}
                    </h4>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Синие кнопки */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-30 pointer-events-none flex justify-between px-0 md:px-4">
            <button 
              onClick={() => swiperInstance?.slidePrev()}
              className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#1c3664] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronRight size={32} />
            </button>
            <button 
              onClick={() => swiperInstance?.slideNext()}
              className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#1c3664] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronLeft size={32} />
            </button>
          </div>

          <div className="testimonial-pagination flex items-center justify-center gap-2.5 mt-10"></div>
        </div>
      </div>

      <style jsx global>{`
        .testimonial-bullet {
          width: 10px;
          height: 10px;
          background: #D1D5DB;
          border-radius: 50%;
          transition: all 0.4s ease;
          cursor: pointer;
        }
        .testimonial-bullet-active {
          width: 35px;
          background: #1c3664;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;