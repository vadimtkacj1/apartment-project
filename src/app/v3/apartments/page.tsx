import React from 'react';
import { Search } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Card, CITIES, INK, SLATE, MIST, CORAL, PILL_SHADOW, toV3Prop } from '../ui';

/* V3 catalog — same marketplace language: compact search pill + responsive grid.
   Accepts dealType / city / neighborhood (neighborhood arrives from homepage chips). */

export const revalidate = 60;

const CITY_LABEL = new Map(CITIES);

export default async function V3Catalog({
  searchParams,
}: {
  searchParams: Promise<{ dealType?: string; city?: string; neighborhood?: string }>;
}) {
  const sp = await searchParams;
  const dealType = sp.dealType === 'rent' ? 'rent' : sp.dealType === 'sale' ? 'sale' : null;
  const city = sp.city && CITY_LABEL.has(sp.city) ? sp.city : null;
  const neighborhood = sp.neighborhood?.trim() || null;

  const raw = await prisma.property.findMany({
    where: {
      isActive: true,
      isSold: false,
      ...(dealType === 'rent' ? { OR: [{ dealType: 'rent' }, { category: 'rentals' }] } : {}),
      ...(dealType === 'sale' ? { OR: [{ dealType: 'sale' }, { category: 'sales' }] } : {}),
      ...(city ? { city } : {}),
      ...(neighborhood ? { neighborhood } : {}),
    },
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    take: 24,
    select: { id: true, title: true, location: true, neighborhood: true, price: true, rooms: true, area: true, dealType: true, category: true, images: true, isPinned: true, createdAt: true },
  });
  const props = raw.map(toV3Prop);

  const heading = [
    dealType === 'rent' ? 'דירות להשכרה' : dealType === 'sale' ? 'דירות למכירה' : 'כל הנכסים',
    city ? `ב${CITY_LABEL.get(city)}` : '',
    neighborhood ? `· ${neighborhood}` : '',
  ].filter(Boolean).join(' ');

  return (
    <div dir="rtl" className="max-w-[1760px] mx-auto px-6 md:px-10 py-10">

      {/* compact search pill, prefilled from URL */}
      <form
        action="/v3/apartments"
        method="GET"
        className="flex items-stretch bg-white rounded-full max-w-[560px]"
        style={{ boxShadow: PILL_SHADOW }}
      >
        <label className="flex-1 min-w-0 flex flex-col justify-center ps-6 pe-4 py-2.5 text-start rounded-s-full">
          <span className="text-[11.5px]" style={{ fontWeight: 600, color: INK }}>סוג עסקה</span>
          <select name="dealType" defaultValue={dealType ?? ''} className="bg-transparent text-[13.5px] focus:outline-none cursor-pointer" style={{ color: SLATE }}>
            <option value="">הכל</option>
            <option value="sale">לקנייה</option>
            <option value="rent">להשכרה</option>
          </select>
        </label>
        <span aria-hidden="true" className="self-center h-7 w-px" style={{ background: MIST }} />
        <label className="flex-1 min-w-0 flex flex-col justify-center ps-5 pe-4 py-2.5 text-start">
          <span className="text-[11.5px]" style={{ fontWeight: 600, color: INK }}>איפה</span>
          <select name="city" defaultValue={city ?? ''} className="bg-transparent text-[13.5px] focus:outline-none cursor-pointer" style={{ color: SLATE }}>
            <option value="">כל הערים</option>
            {CITIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <div className="flex items-center pe-2 ps-1">
          <button
            type="submit"
            aria-label="חיפוש"
            className="inline-flex items-center justify-center size-10 rounded-full text-white transition-[filter] hover:brightness-95"
            style={{ background: CORAL }}
          >
            <Search size={16} aria-hidden="true" />
          </button>
        </div>
      </form>

      <div className="mt-8 mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-[24px]" style={{ fontWeight: 600, color: INK, letterSpacing: '-0.2px' }}>{heading}</h1>
        <span className="text-[14px]" style={{ color: SLATE }}>
          <span dir="ltr">{props.length}</span> נכסים
        </span>
        {props.length > 0 && (
          <span className="text-[13px] ms-auto" style={{ color: SLATE }}>
            ממוין לפי: חדשים קודם
          </span>
        )}
      </div>

      {props.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-[17px]" style={{ fontWeight: 600, color: INK }}>לא נמצאו נכסים התואמים לחיפוש</p>
          <p className="mt-1.5 text-[14.5px]" style={{ color: SLATE }}>נסו לשנות עיר או סוג עסקה — או דברו איתנו ונמצא עבורכם</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {props.map((p, i) => <Card key={p.id} p={p} priority={i < 4} />)}
        </div>
      )}
    </div>
  );
}
