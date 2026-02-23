"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

interface ValueCard {
  id: number;
  image: string;
  title: string;
  description: string;
}

const values: ValueCard[] = [
  {
    id: 1,
    image: "/Business deal-rafiki.svg",
    title: "יחס אישי וליווי צמוד",
    description: "אנו מאמינים שכל נכס וכל לקוח הם עולם בפני עצמו. לכן, אנו מלווים אתכם באופן אישי לאורך כל הדרך, זמינים לכל שאלה ומנהלים את התהליך בצורה שקופה, רגועה ומקצועית."
  },
  {
    id: 2,
    image: "/Create-rafiki.svg",
    title: "מעטפת שירותים מלאה",
    description: "היכרות עמוקה עם כל סוגי השירותים – מכירה, השכרה וניהול נכסים. אנו עובדים בשיתוף פעולה עם יועצי משכנתאות ועורכי דין כדי לספק פתרון כולל תחת קורת גג אחת."
  },
  {
    id: 3,
    image: "/Problem solving-rafiki.svg",
    title: "מקצועיות וניסיון מוכח",
    description: "עם מעל 24 שנות ניסיון ומאות עסקאות מוצלחות, השילוב בין הוותק לידע המקומי מאפשר לנו לנהל כל עסקה בצורה המדויקת והבטוחה ביותר עבורכם."
  }
];

const ValuesSection: React.FC = () => {
  return (
    <section dir="rtl" className="relative w-full py-20 md:py-32 overflow-hidden bg-warm">

      {/* ── Dot grid ── */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="vDots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.2" fill="#1c3664" opacity="0.12"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vDots)"/>
        </svg>
      </div>

      {/* ── Decorative shapes: top-left + top-right ── */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">

          {/* TOP LEFT — concentric arcs */}
          <circle cx="0" cy="0" r="160" fill="none" stroke="#1c3664" strokeWidth="2.5" opacity="0.35"/>
          <circle cx="0" cy="0" r="110" fill="none" stroke="#1c3664" strokeWidth="2.5" opacity="0.28"/>
          <circle cx="0" cy="0" r="65"  fill="#1c3664" opacity="0.18"/>

          {/* TOP LEFT — small rotated square */}
          <rect x="120" y="55" width="28" height="28" rx="4"
            fill="#1c3664" opacity="0.22"
            transform="rotate(20 134 69)"
          />

          {/* TOP RIGHT — concentric arcs */}
          <circle cx="100%" cy="0" r="170" fill="none" stroke="#1c3664" strokeWidth="2.5" opacity="0.35"/>
          <circle cx="100%" cy="0" r="115" fill="none" stroke="#1c3664" strokeWidth="2.5" opacity="0.28"/>
          <circle cx="100%" cy="0" r="65"  fill="#1c3664" opacity="0.18"/>

          {/* TOP RIGHT — small rotated square */}
          <rect x="0" y="55" width="28" height="28" rx="4"
            fill="#1c3664" opacity="0.22"
            transform="translate(1310,0) rotate(-20 14 69)"
          />

          {/* LEFT mid — floating diamond */}
          <rect x="18" y="200" width="22" height="22"
            fill="#1c3664" opacity="0.35"
            transform="rotate(45 29 211)"
          />
          <rect x="14" y="320" width="14" height="14"
            fill="#1c3664" opacity="0.25"
            transform="rotate(45 21 327)"
          />

          {/* RIGHT mid — floating diamond */}
          <rect x="1400" y="200" width="22" height="22"
            fill="#1c3664" opacity="0.35"
            transform="rotate(45 1411 211)"
          />
          <rect x="1412" y="320" width="14" height="14"
            fill="#1c3664" opacity="0.25"
            transform="rotate(45 1419 327)"
          />

        </svg>
      </div>

      {/* ── Floating accent dots (left & right) ── */}
      <div className="absolute left-6  top-[28%] w-3   h-3   rounded-full bg-[#1c3664] opacity-40 pointer-events-none z-0"/>
      <div className="absolute left-14 top-[42%] w-2   h-2   rounded-full bg-[#1c3664] opacity-45 pointer-events-none z-0"/>
      <div className="absolute left-8  top-[60%] w-4   h-4   rounded-full bg-[#1c3664] opacity-30 pointer-events-none z-0"/>
      <div className="absolute right-6  top-[28%] w-3   h-3   rounded-full bg-[#1c3664] opacity-40 pointer-events-none z-0"/>
      <div className="absolute right-14 top-[42%] w-2   h-2   rounded-full bg-[#1c3664] opacity-45 pointer-events-none z-0"/>
      <div className="absolute right-8  top-[60%] w-4   h-4   rounded-full bg-[#1c3664] opacity-30 pointer-events-none z-0"/>

      {/* ── City skyline — raised higher (bottom 55% of section) ── */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0" aria-hidden="true">
        <svg
          viewBox="0 0 1440 340"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax meet"
          className="w-full"
        >
          {/* Back layer — tall buildings, light blue */}
          <path
            d="
              M0,340 L0,250
              L18,250 L18,225 L28,225 L28,202 L36,202 L36,180 L44,180 L44,160 L50,160 L50,142 L57,142 L57,125 L63,125 L63,110 L70,110 L70,125 L76,125 L76,142 L83,142 L83,160 L89,160 L89,180 L97,180 L97,202 L105,202 L105,225 L115,225 L115,250
              L132,250 L132,225 L144,225 L144,200 L154,200 L154,178 L163,178 L163,157 L172,157 L172,138 L181,138 L181,122 L189,122 L189,107 L196,107 L196,94  L202,94  L202,82  L208,82  L208,94  L214,94  L214,107 L221,107 L221,122 L229,122 L229,138 L238,138 L238,157 L247,157 L247,178 L256,178 L256,200 L266,200 L266,225 L278,225 L278,250
              L296,250 L296,228 L308,228 L308,208 L318,208 L318,189 L327,189 L327,172 L336,172 L336,157 L344,157 L344,143 L351,143 L351,157 L358,157 L358,172 L366,172 L366,189 L375,189 L375,208 L385,208 L385,228 L397,228 L397,250
              L415,250 L415,225 L427,225 L427,202 L438,202 L438,180 L447,180 L447,158 L457,158 L457,138 L466,138 L466,120 L475,120 L475,103 L483,103 L483,88  L490,88  L490,75  L496,75  L496,88  L502,88  L502,103 L510,103 L510,120 L519,120 L519,138 L528,138 L528,158 L538,158 L538,180 L547,180 L547,202 L558,202 L558,225 L570,225 L570,250
              L588,250 L588,228 L600,228 L600,208 L610,208 L610,190 L619,190 L619,173 L628,173 L628,158 L636,158 L636,144 L643,144 L643,158 L650,158 L650,173 L659,173 L659,190 L668,190 L668,208 L678,208 L678,228 L690,228 L690,250
              L708,250 L708,225 L720,225 L720,200 L731,200 L731,176 L741,176 L741,155 L751,155 L751,135 L761,135 L761,117 L770,117 L770,100 L778,100 L778,85  L785,85  L785,72  L791,72  L791,85  L797,85  L797,100 L805,100 L805,117 L814,117 L814,135 L824,135 L824,155 L834,155 L834,176 L844,176 L844,200 L855,200 L855,225 L867,225 L867,250
              L885,250 L885,228 L897,228 L897,208 L907,208 L907,190 L916,190 L916,173 L925,173 L925,158 L933,158 L933,144 L940,144 L940,158 L947,158 L947,173 L956,173 L956,190 L965,190 L965,208 L975,208 L975,228 L987,228 L987,250
              L1005,250 L1005,225 L1017,225 L1017,202 L1028,202 L1028,180 L1037,180 L1037,158 L1047,158 L1047,138 L1056,138 L1056,120 L1065,120 L1065,103 L1073,103 L1073,88  L1080,88  L1080,75  L1086,75  L1086,88  L1092,88  L1092,103 L1100,103 L1100,120 L1109,120 L1109,138 L1118,138 L1118,158 L1128,158 L1128,180 L1137,180 L1137,202 L1148,202 L1148,225 L1160,225 L1160,250
              L1178,250 L1178,228 L1190,228 L1190,208 L1200,208 L1200,190 L1209,190 L1209,173 L1218,173 L1218,158 L1226,158 L1226,144 L1233,144 L1233,158 L1240,158 L1240,173 L1249,173 L1249,190 L1258,190 L1258,208 L1268,208 L1268,228 L1280,228 L1280,250
              L1298,250 L1298,225 L1310,225 L1310,202 L1321,202 L1321,180 L1330,180 L1330,160 L1339,160 L1339,142 L1348,142 L1348,125 L1355,125 L1355,110 L1362,110 L1362,125 L1369,125 L1369,142 L1378,142 L1378,160 L1387,160 L1387,180 L1396,180 L1396,202 L1407,202 L1407,225 L1420,225 L1420,250
              L1440,250 L1440,340 Z
            "
            fill="#4a7ab5"
            opacity="0.12"
          />

          {/* Front layer — lower buildings, darker blue */}
          <path
            d="
              M0,340 L0,278
              L22,278 L22,260 L35,260 L35,244 L46,244 L46,260 L59,260 L59,278
              L78,278 L78,258 L91,258 L91,240 L102,240 L102,224 L111,224 L111,210 L119,210 L119,198 L126,198 L126,187 L132,187 L132,198 L138,198 L138,210 L147,210 L147,224 L156,224 L156,240 L167,240 L167,258 L180,258 L180,278
              L200,278 L200,260 L213,260 L213,244 L224,244 L224,260 L237,260 L237,278
              L256,278 L256,255 L269,255 L269,236 L281,236 L281,219 L291,219 L291,204 L300,204 L300,191 L309,191 L309,179 L317,179 L317,169 L323,169 L323,179 L329,179 L329,191 L338,191 L338,204 L347,204 L347,219 L357,219 L357,236 L369,236 L369,255 L382,255 L382,278
              L401,278 L401,260 L414,260 L414,244 L425,244 L425,260 L438,260 L438,278
              L457,278 L457,255 L470,255 L470,235 L482,235 L482,217 L492,217 L492,201 L502,201 L502,187 L511,187 L511,174 L519,174 L519,163 L525,163 L525,174 L531,174 L531,187 L540,187 L540,201 L550,201 L550,217 L560,217 L560,235 L572,235 L572,255 L585,255 L585,278
              L604,278 L604,260 L617,260 L617,244 L628,244 L628,260 L641,260 L641,278
              L660,278 L660,255 L673,255 L673,235 L685,235 L685,216 L695,216 L695,199 L706,199 L706,184 L715,184 L715,171 L724,171 L724,159 L730,159 L730,171 L736,171 L736,184 L745,184 L745,199 L756,199 L756,216 L766,216 L766,235 L778,235 L778,255 L791,255 L791,278
              L810,278 L810,260 L823,260 L823,244 L834,244 L834,260 L847,260 L847,278
              L866,278 L866,255 L879,255 L879,235 L891,235 L891,217 L901,217 L901,201 L911,201 L911,187 L920,187 L920,174 L928,174 L928,163 L934,163 L934,174 L940,174 L940,187 L949,187 L949,201 L959,201 L959,217 L969,217 L969,235 L981,235 L981,255 L994,255 L994,278
              L1013,278 L1013,260 L1026,260 L1026,244 L1037,244 L1037,260 L1050,260 L1050,278
              L1069,278 L1069,255 L1082,255 L1082,235 L1094,235 L1094,217 L1104,217 L1104,200 L1114,200 L1114,185 L1124,185 L1124,172 L1132,172 L1132,161 L1138,161 L1138,172 L1144,172 L1144,185 L1154,185 L1154,200 L1164,200 L1164,217 L1174,217 L1174,235 L1186,235 L1186,255 L1199,255 L1199,278
              L1218,278 L1218,260 L1231,260 L1231,244 L1242,244 L1242,260 L1255,260 L1255,278
              L1274,278 L1274,258 L1287,258 L1287,240 L1298,240 L1298,224 L1307,224 L1307,210 L1315,210 L1315,198 L1322,198 L1322,187 L1328,187 L1328,198 L1334,198 L1334,210 L1343,210 L1343,224 L1352,224 L1352,240 L1363,240 L1363,258 L1376,258 L1376,278
              L1396,278 L1396,262 L1420,262 L1420,278 L1440,278 L1440,340 Z
            "
            fill="#1c3664"
            opacity="0.15"
          />
        </svg>
      </div>

      <style jsx global>{`
        .values-swiper .swiper-pagination {
          position: relative !important;
          bottom: 0 !important;
          margin-top: 24px !important;
        }
        .values-swiper .swiper-pagination-bullet-active {
          background: #1e3a8a !important;
        }
      `}</style>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-20 max-w-[1400px] 2xl:max-w-[1800px]">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            למה לבחור בנו?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            שלושת העמודים המרכזיים שעליהם בנוי השירות שלנו
          </p>
        </motion.div>

        {/* Mobile View */}
        <div className="block lg:hidden">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="values-swiper"
          >
            {values.map((value) => (
              <SwiperSlide key={value.id}>
                <div className="flex flex-col items-center text-center px-4">
                  <div className="flex justify-center mb-6">
                    <img src={value.image} alt={value.title} className="w-56 h-56 object-contain"/>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative p-8 text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-56 h-56">
                  <img src={value.image} alt={value.title} className="w-full h-full object-contain"/>
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{value.title}</h3>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ValuesSection;