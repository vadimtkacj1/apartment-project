import React from 'react';
import { prisma } from '@/lib/prisma';
import { INK, SLATE, LINE, FOG, CITIES, toV8, TCard } from '../ui';

/* V8 catalog — Trulia results page: sticky filter bar (deal segments + city
   select + live count), dense card grid. */

export const revalidate = 60;
const CITY_LABEL = new Map(CITIES);

export default async function V8Catalog({
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
    select: { id: true, title: true, location: true, neighborhood: true, price: true, rooms: true, bathrooms: true, area: true, floor: true, dealType: true, category: true, images: true, isPinned: true, createdAt: true },
  });
  const props = raw.map(toV8);

  const heading = [
    city ? CITY_LABEL.get(city) : 'חולון והמרכז',
    dealType === 'rent' ? '— דירות להשכרה' : dealType === 'sale' ? '— דירות למכירה' : '— כל הנכסים',
  ].join(' ');

  const chip = (active: boolean): React.CSSProperties => ({
    border: `1px solid ${active ? INK : LINE}`,
    background: active ? INK : '#fff',
    color: active ? '#fff' : INK,
  });

  return (
    <div dir="rtl">
      {/* sticky filter bar */}
      <div className="sticky top-[64px] z-40 bg-white" style={{ borderBottom: `1px solid ${LINE}` }}>
        <form action="/v8/apartments" method="GET" className="max-w-[1440px] mx-auto px-5 md:px-8 py-2.5 flex flex-wrap items-center gap-2.5">
          <div className="flex gap-1.5" role="tablist" aria-label="סוג עסקה">
            {([['', 'הכל'], ['sale', 'לקנייה'], ['rent', 'להשכרה']] as const).map(([v, l]) => (
              <label key={v} className="cursor-pointer">
                <input type="radio" name="dealType" value={v} defaultChecked={(dealType ?? '') === v} className="peer sr-only" />
                <span className="inline-flex px-4 py-1.5 rounded-full text-[13.5px] font-bold transition-colors peer-checked:!bg-[#2A2A33] peer-checked:!text-white" style={chip(false)}>
                  {l}
                </span>
              </label>
            ))}
          </div>
          <select name="city" defaultValue={city ?? ''} aria-label="עיר" className="h-[36px] px-3 rounded-full text-[13.5px] font-bold bg-white focus:outline-none cursor-pointer" style={{ border: `1px solid ${LINE}`, color: INK }}>
            <option value="">כל הערים</option>
            {CITIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <button type="submit" className="h-[36px] px-5 rounded-full text-[13.5px] font-bold text-white transition-[filter] hover:brightness-110" style={{ background: INK }}>
            עדכון
          </button>
          <span className="ms-auto text-[13px] font-semibold tabular-nums" style={{ color: SLATE }}>
            {props.length} נכסים · ממוין לפי חדשים
          </span>
        </form>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-8 py-7" style={{ background: '#fff' }}>
        <h1 className="text-[21px] font-extrabold mb-5" style={{ color: INK }}>{heading}</h1>

        {props.length === 0 ? (
          <div className="py-24 text-center rounded-lg" style={{ background: FOG }}>
            <p className="text-[16px] font-bold" style={{ color: INK }}>אין כרגע נכסים שתואמים לחיפוש</p>
            <p className="mt-1.5 text-[14px]" style={{ color: SLATE }}>נסו עיר אחרת — או השאירו פרטים ונחזור כשמשהו מתאים ייכנס למאגר</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {props.map((p, i) => <TCard key={p.id} p={p} priority={i < 4} />)}
          </div>
        )}
      </div>
    </div>
  );
}
