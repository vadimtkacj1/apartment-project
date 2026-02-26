"use client";
import React, { useState, useEffect } from 'react';
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
  const [title, setTitle] = useState<string>('מה הלקוחות שלנו אומרים');

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
    { id: 1, name: "רותם כנפי", rating: 5, text: "אדם נעים, ישר והגון. בדיוק מי שתרצו לצידכם בעסקת מקרקעין. ממליץ בחום לכל מי שמחפש תיווך איכותי." },
    { id: 2, name: "אלון שמואלי", rating: 5, text: "שילוב של מקצועיות ואנושיות. תמיד בגובה העיניים ובלי משחקים. בדיוק מה שצריך בעולם הנדל\"ן." },
    { id: 3, name: "אורי גלילי", rating: 5, text: "מקצועיות יוצאת דופן. הבין את הצרכים שלנו בצורה מושלמת והתאים את הנכס במדויק. חסך לנו חודשים של חיפושים." },
    { id: 4, name: "עידו בר-לב", rating: 5, text: "פנינו לרם אחרי תקופה ארוכה שניסינו למכור לבד ללא הצלחה. מהרגע הראשון הרגשנו שיש על מי לסמוך. התהליך נוהל במקצועיות והדירה נמכרה במחיר גבוה מהמצופה." },
    { id: 5, name: "מיכל דרור", rating: 5, text: "עברנו כמה מתווכים לפניו - ההבדל היה משמעותי. סדר, ארגון ותחושת ביטחון מהרגע הראשון." },
    { id: 6, name: "יובל פרקש", rating: 5, text: "ניהול נכסים ברמה גבוהה. לא היינו צריכים להתעסק בכלום - טיפול בתיקונים, חוזים ודיירים, הכל עבר דרכו בצורה חלקה." },
    { id: 7, name: "לירון ברקאי", rating: 5, text: "ניהל עבורנו השכרת נכס - הכל נעשה בצורה מסודרת, חוזים ברורים ודיירים מצוינים. שקט נפשי אמיתי." },
    { id: 8, name: "דנה קסטן", rating: 5, text: "מקצוען אמיתי. למד את השוק לעומק, תמחר נכון והביא רק קונים רציניים. חסך לנו המון זמן וכאב ראש." },
    { id: 9, name: "נועם רפאלי", rating: 5, text: "חיים ליווה אותנו ברכישת הדירה הראשונה שלנו. הסביר הכל בסבלנות, בדק פרטים שלא חשבנו עליהם ונתן לנו ביטחון לאורך כל הדרך." },
    { id: 10, name: "אוראל סויסה", rating: 5, text: "לא רק מתווך אלא יועץ. הסביר כל שלב והיה זמין תמיד. הרגשנו שיש מישהו שבאמת מייצג אותנו." },
    { id: 11, name: "רוני אבידן", rating: 5, text: "היה זמין תמיד גם מעבר לשעות העבודה. כל התהליך עבר בנעימים וללא הפתעות." },
    { id: 12, name: "שירה מלמד", rating: 5, text: "קיבלנו ליווי מלא מהשלב הראשון ועד החתימה. כל שאלה נענתה במהירות ובסבלנות. רם ידע להרגיע ברגעים לחוצים." },
    { id: 13, name: "בר פלד", rating: 5, text: "שירות אישי ואכפתי. הרגשנו שהוא באמת רוצה שנעשה את העסקה הנכונה ולא רק לסגור מכירה." },
    { id: 14, name: "גל סער", rating: 5, text: "ניהול משא ומתן חכם והוגן לשני הצדדים. הרגשנו שאנחנו עובדים עם אדם ישר שמכבד גם את המוכרים וגם את הקונים." },
    { id: 15, name: "הילה בר-און", rating: 5, text: "מהפגישה הראשונה ידענו שאנחנו בידיים טובות. מכר את הדירה במהירות ובמחיר מצוין. ממליצה בחום." },
    { id: 16, name: "תומר כהנא", rating: 5, text: "עבדנו עם הרבה אנשי מקצוע, אבל רמת הדיוק, האמינות והיחס האישי שקיבלנו כאן הייתה מעל הכל. היה לו חשוב האינטרס שלנו." },
    { id: 17, name: "עדן שליו", rating: 5, text: "חיים ידע להעריך נכון את שווי הדירה ולהביא רק קונים מתאימים. מכירה מהירה ומדויקת." },
    { id: 18, name: "מיה הדרי", rating: 5, text: "השכרנו דירה דרך רם והוא מצא דיירים איכותיים בזמן קצר מאוד. ההתנהלות הייתה נעימה וברורה לאורך כל הדרך." },
    { id: 19, name: "איתן מורג", rating: 5, text: "העסקה נראתה תקועה, אבל חיים הצליח לפתור את המחלוקות ולהוביל לחתימה. מקצוען אמיתי." },
    { id: 20, name: "נתלי רוזן", rating: 5, text: "העסקה הייתה מורכבת מאוד, אבל רם ניהל את המשא ומתן בתבונה וגישר על הפערים. שירות ברמה גבוהה." }
  ];

  return (
    <section className="relative w-full py-16 md:py-20 overflow-hidden bg-warm" dir="rtl">
      <div className="relative z-10 max-w-[1300px] mx-auto px-4">
        
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-[#1c3664] font-bold text-lg uppercase tracking-wider">
              חוות דעת
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
            {title || 'מה הלקוחות שלנו אומרים'}
          </h2>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay, Pagination, EffectCoverflow]}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1.15}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
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
                  <div className={`
                    relative bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-14 flex flex-col items-center text-center transition-all duration-700 h-full shadow-none
                    ${isActive 
                      ? 'scale-100 opacity-100' 
                      : 'scale-90 opacity-40 blur-[0.5px]'}
                  `}>
                    
                    <div className="flex gap-1.5 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <div className="min-h-[120px] md:min-h-[140px] flex items-center">
                      <p className={`text-lg md:text-2xl leading-[1.6] md:leading-[1.8] transition-colors duration-500
                        ${isActive ? 'text-gray-700 font-medium italic' : 'text-gray-400'}`}>
                        "{testimonial.text}"
                      </p>
                    </div>

                    <h4 className={`text-xl font-black mt-8 md:mt-10 ${isActive ? 'text-[#1c3664]' : 'text-gray-300'}`}>
                      {testimonial.name}
                    </h4>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Buttons: Desktop only */}
          <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 z-30 pointer-events-none justify-between px-4">
            <button 
              onClick={() => swiperInstance?.slideNext()} // במצב RTL, Next זה שמאלה
              className="pointer-events-auto w-14 h-14 rounded-full bg-[#1c3664] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all"
            >
              <ChevronRight size={32} />
            </button>
            <button 
              onClick={() => swiperInstance?.slidePrev()} // במצב RTL, Prev זה ימינה
              className="pointer-events-auto w-14 h-14 rounded-full bg-[#1c3664] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all"
            >
              <ChevronLeft size={32} />
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
          background: #1c3664;
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