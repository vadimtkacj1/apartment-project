import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Phone, MapPin, ArrowRight, BedDouble, Bath, Maximize, Building2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { INK, SLATE, LINE, FOG, GREEN, allImages, formatPrice, toV8, TCard } from '../../ui';

/* V8 detail — Trulia listing page: photo mosaic, price-first header with fact
   icons, description + features, sticky green contact card, similar homes. */

export const revalidate = 60;

const FEATURES: Array<[string, string]> = [
  ['hasAirConditioning', 'מיזוג אוויר'], ['hasElevator', 'מעלית'], ['hasStorage', 'מחסן'],
  ['hasSafeRoom', 'ממ״ד'], ['hasSunBalcony', 'מרפסת שמש'], ['hasBoiler', 'דוד שמש'],
];

export default async function V8Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pid = Number(id);
  if (!Number.isFinite(pid)) notFound();

  const p = await prisma.property.findFirst({ where: { id: pid, isActive: true } });
  if (!p) notFound();

  const photos = (() => { const a = allImages(p.images); return a.length ? a.slice(0, 5) : ['/images/hero/sales.jpg']; })();
  const dealType = p.category === 'rentals' || p.dealType === 'rent' ? 'rent' : 'sale';
  const feats = FEATURES.filter(([k]) => Boolean((p as Record<string, unknown>)[k]));

  const [similarRaw, owner] = await Promise.all([
    prisma.property.findMany({
      where: { isActive: true, isSold: false, id: { not: pid }, city: p.city ?? undefined },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }], take: 4,
      select: { id: true, title: true, location: true, neighborhood: true, price: true, rooms: true, bathrooms: true, area: true, floor: true, dealType: true, category: true, images: true, isPinned: true, createdAt: true },
    }),
    prisma.owner.findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true, name: true } }).catch(() => null),
  ]);
  const similar = similarRaw.map(toV8);
  const phone = owner?.phone ?? null;

  return (
    <div dir="rtl" className="max-w-[1200px] mx-auto px-5 md:px-8 py-6">
      <Link href="/v8/apartments" className="inline-flex items-center gap-1.5 text-[13.5px] font-bold hover:underline underline-offset-4" style={{ color: GREEN }}>
        <ArrowRight size={14} aria-hidden="true" />
        חזרה לתוצאות
      </Link>

      {/* mosaic */}
      <div className={`mt-4 grid gap-1.5 rounded-lg overflow-hidden ${photos.length > 1 ? 'grid-cols-2 md:grid-cols-4 md:grid-rows-2' : ''}`}>
        <div className={`relative ${photos.length > 1 ? 'col-span-2 row-span-2 aspect-[4/3] md:aspect-auto' : 'aspect-[16/9]'}`} style={{ background: FOG }}>
          <Image src={photos[0]} alt={p.title} fill priority sizes="(max-width:768px) 100vw, 60vw" className={`object-cover ${p.isSold ? 'grayscale opacity-70' : ''}`} />
        </div>
        {photos.slice(1).map((src, i) => (
          <div key={i} className="relative aspect-[4/3] hidden md:block" style={{ background: FOG }}>
            <Image src={src} alt="" fill sizes="25vw" className={`object-cover ${p.isSold ? 'grayscale opacity-70' : ''}`} loading="lazy" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 min-w-0">
          {/* price-first header */}
          <div className="text-[26px] font-extrabold tabular-nums" style={{ color: INK }}>
            <span dir="ltr">₪{formatPrice(p.price)}</span>
            {dealType === 'rent' ? <span className="text-[15px] font-semibold" style={{ color: SLATE }}> לחודש</span> : null}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[14px]" style={{ color: SLATE }}>
            <MapPin size={13} aria-hidden="true" />
            {p.title} · {p.location}{p.neighborhood ? `, ${p.neighborhood}` : ''}
          </div>

          {/* fact icons row */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5 py-3.5 text-[14px] font-bold" style={{ borderBlock: `1px solid ${LINE}`, color: INK }}>
            {p.rooms && <span className="inline-flex items-center gap-2"><BedDouble size={17} style={{ color: GREEN }} aria-hidden="true" />{p.rooms} חדרים</span>}
            {p.bathrooms ? <span className="inline-flex items-center gap-2"><Bath size={17} style={{ color: GREEN }} aria-hidden="true" />{p.bathrooms} שירותים</span> : null}
            {p.area && <span className="inline-flex items-center gap-2"><Maximize size={17} style={{ color: GREEN }} aria-hidden="true" />{p.area} מ״ר</span>}
            {typeof p.floor === 'number' && (
              <span className="inline-flex items-center gap-2"><Building2 size={17} style={{ color: GREEN }} aria-hidden="true" />{p.floor === 0 ? 'קומת קרקע' : `קומה ${p.floor}${p.totalFloors ? ` מתוך ${p.totalFloors}` : ''}`}</span>
            )}
          </div>

          {p.description && (
            <>
              <h2 className="mt-6 text-[17px] font-extrabold" style={{ color: INK }}>על הנכס</h2>
              <p className="mt-2.5 text-[14.5px] leading-[1.8] whitespace-pre-line" style={{ color: '#3c3c44', maxInlineSize: '68ch' }}>
                {p.description}
              </p>
            </>
          )}

          {feats.length > 0 && (
            <>
              <h2 className="mt-7 text-[17px] font-extrabold" style={{ color: INK }}>מה כלול</h2>
              <ul className="mt-3 grid grid-cols-2 gap-y-2.5 gap-x-6 max-w-[420px]">
                {feats.map(([k, label]) => (
                  <li key={k} className="flex items-center gap-2.5 text-[14px]" style={{ color: '#3c3c44' }}>
                    <span aria-hidden="true" className="inline-block size-1.5 rounded-full" style={{ background: GREEN }} />
                    {label}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* sticky contact card */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-[84px] rounded-lg p-5" style={{ border: `1px solid ${LINE}`, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <div className="text-[15px] font-extrabold" style={{ color: INK }}>מעוניינים בנכס?</div>
            <div className="mt-1 text-[13px]" style={{ color: SLATE }}>
              {owner?.name ? `${owner.name} עונה בדרך כלל בתוך שעה, בימי א׳–ה׳` : 'עונים בדרך כלל בתוך שעה, בימי א׳–ה׳'}
            </div>
            {phone && !p.isSold && (
              <>
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-lg text-white text-[14.5px] font-bold transition-[filter] hover:brightness-110"
                  style={{ background: GREEN }}
                >
                  <Phone size={15} aria-hidden="true" />
                  <span dir="ltr">{phone}</span>
                </a>
                <a
                  href={`https://wa.me/${phone.replace(/\D/g, '').replace(/^0/, '972')}?text=${encodeURIComponent(`שלום, ראיתי את "${p.title}" באתר ואשמח לפרטים`)}`}
                  target="_blank" rel="noopener"
                  className="mt-2 flex items-center justify-center w-full py-3 rounded-lg text-[14.5px] font-bold transition-colors hover:bg-[#F7F7F8]"
                  style={{ border: `1px solid ${INK}`, color: INK }}
                >
                  WhatsApp
                </a>
              </>
            )}
            {p.isSold && <div className="mt-4 rounded-lg py-3 text-center text-[14px] font-bold" style={{ background: FOG, color: SLATE }}>הנכס נמכר</div>}
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="text-[19px] font-extrabold mb-4" style={{ color: INK }}>נכסים דומים באזור</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similar.map((s) => <TCard key={s.id} p={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}
