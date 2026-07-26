import React from 'react';
import { prisma } from '@/lib/prisma';
import { INKV, SLATEV, BLUE, CITIES, toV9, RoomCard, SectionHead } from '../ui';

/* V9 catalog — resort-style: centered head, rounded filter bar, card grid. */

export const revalidate = 60;
const CITY_LABEL = new Map(CITIES);

export default async function V9Catalog({
  searchParams,
}: {
  searchParams: Promise<{ dealType?: string; city?: string }>;
}) {
  const sp = await searchParams;
  const dealType = sp.dealType === 'rent' ? 'rent' : sp.dealType === 'sale' ? 'sale' : null;
  const city = sp.city && CITY_LABEL.has(sp.city) ? sp.city : null;

  const raw = await prisma.property.findMany({
    where: {
      isActive: true, isSold: false,
      ...(dealType === 'rent' ? { OR: [{ dealType: 'rent' }, { category: 'rentals' }] } : {}),
      ...(dealType === 'sale' ? { OR: [{ dealType: 'sale' }, { category: 'sales' }] } : {}),
      ...(city ? { city } : {}),
    },
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    take: 24,
    select: { id: true, title: true, location: true, neighborhood: true, price: true, rooms: true, area: true, dealType: true, category: true, images: true },
  });
  const props = raw.map(toV9);

  const title = dealType === 'rent' ? 'דירות להשכרה' : dealType === 'sale' ? 'דירות למכירה' : 'כל הנכסים';

  return (
    <div dir="rtl" className="max-w-[1180px] mx-auto px-5 md:px-8 py-14">
      <SectionHead
        title={city ? `${title} ב${CITY_LABEL.get(city)}` : title}
        sub={`${props.length} נכסים פעילים במאגר · מתעדכן כל יום`}
      />

      <form action="/v9/apartments" method="GET" className="mx-auto mb-10 max-w-[560px] flex items-stretch bg-white rounded-xl overflow-hidden" style={{ boxShadow: '0 10px 30px -12px rgba(23,26,45,0.18)' }}>
        <label className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 py-2.5 ps-5 pe-3 text-start">
          <span className="text-[11px] font-bold" style={{ color: SLATEV }}>סוג עסקה</span>
          <select name="dealType" defaultValue={dealType ?? ''} className="bg-transparent text-[13.5px] font-semibold focus:outline-none cursor-pointer" style={{ color: INKV }}>
            <option value="">הכל</option>
            <option value="sale">לקנייה</option>
            <option value="rent">להשכרה</option>
          </select>
        </label>
        <span aria-hidden="true" className="self-center h-8 w-px" style={{ background: '#E3EDED' }} />
        <label className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 py-2.5 ps-4 pe-3 text-start">
          <span className="text-[11px] font-bold" style={{ color: SLATEV }}>עיר</span>
          <select name="city" defaultValue={city ?? ''} className="bg-transparent text-[13.5px] font-semibold focus:outline-none cursor-pointer" style={{ color: INKV }}>
            <option value="">כל הערים</option>
            {CITIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <button type="submit" className="px-6 text-[13.5px] font-semibold text-white transition-[filter] hover:brightness-110" style={{ background: BLUE }}>
          סינון
        </button>
      </form>

      {props.length === 0 ? (
        <p className="py-20 text-center text-[15px]" style={{ color: SLATEV }}>
          אין כרגע נכסים שתואמים לחיפוש — נסו עיר אחרת או דברו איתנו.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {props.map((p, i) => <RoomCard key={p.id} p={p} priority={i < 3} />)}
        </div>
      )}
    </div>
  );
}
