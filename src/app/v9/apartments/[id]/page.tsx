import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Phone, MapPin, ArrowRight, BedDouble, Maximize, Building2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { NAVY, BLUE, INKV, SLATEV, allImages, formatPrice, toV9, RoomCard } from '../../ui';

/* V9 detail — resort-room page anatomy: airy gallery, centered facts,
   navy contact band, similar rooms row. Own code, Aiterra content. */

export const revalidate = 60;

const FEATURES: Array<[string, string]> = [
  ['hasAirConditioning', 'מיזוג אוויר'], ['hasElevator', 'מעלית'], ['hasStorage', 'מחסן'],
  ['hasSafeRoom', 'ממ״ד'], ['hasSunBalcony', 'מרפסת שמש'], ['hasBoiler', 'דוד שמש'],
];

export default async function V9Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pid = Number(id);
  if (!Number.isFinite(pid)) notFound();

  const p = await prisma.property.findFirst({ where: { id: pid, isActive: true } });
  if (!p) notFound();

  const photos = (() => { const a = allImages(p.images); return a.length ? a.slice(0, 3) : ['/images/hero/sales.jpg']; })();
  const dealType = p.category === 'rentals' || p.dealType === 'rent' ? 'rent' : 'sale';
  const feats = FEATURES.filter(([k]) => Boolean((p as Record<string, unknown>)[k]));

  const [similarRaw, owner] = await Promise.all([
    prisma.property.findMany({
      where: { isActive: true, isSold: false, id: { not: pid }, city: p.city ?? undefined },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }], take: 3,
      select: { id: true, title: true, location: true, neighborhood: true, price: true, rooms: true, area: true, dealType: true, category: true, images: true },
    }),
    prisma.owner.findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true, name: true } }).catch(() => null),
  ]);
  const similar = similarRaw.map(toV9);
  const phone = owner?.phone ?? null;

  return (
    <div dir="rtl">
      <div className="max-w-[1180px] mx-auto px-5 md:px-8 py-10">
        <Link href="/v9/apartments" className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold hover:underline underline-offset-4" style={{ color: BLUE }}>
          <ArrowRight size={14} aria-hidden="true" />
          חזרה לנכסים
        </Link>

        {/* airy gallery: one wide + two beneath */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="col-span-2 relative aspect-[21/9] rounded-2xl overflow-hidden" style={{ boxShadow: '0 14px 34px -16px rgba(23,26,45,0.3)' }}>
            <Image src={photos[0]} alt={p.title} fill priority sizes="(max-width:1180px) 100vw, 1180px" className={`object-cover ${p.isSold ? 'grayscale opacity-70' : ''}`} />
          </div>
          {photos.slice(1).map((src, i) => (
            <div key={i} className="relative aspect-[16/9] rounded-2xl overflow-hidden" style={{ boxShadow: '0 10px 26px -14px rgba(23,26,45,0.25)' }}>
              <Image src={src} alt="" fill sizes="46vw" className={`object-cover ${p.isSold ? 'grayscale opacity-70' : ''}`} loading="lazy" />
            </div>
          ))}
        </div>

        {/* centered title + facts */}
        <div className="mt-10 text-center max-w-[720px] mx-auto">
          <h1 className="text-[26px] md:text-[34px] font-semibold" style={{ color: INKV, lineHeight: 1.2 }}>{p.title}</h1>
          <div className="mt-2 inline-flex items-center gap-1.5 text-[14px]" style={{ color: SLATEV }}>
            <MapPin size={14} aria-hidden="true" />
            {p.location}{p.neighborhood ? `, ${p.neighborhood}` : ''}
          </div>
          <div className="mt-4 text-[24px] font-bold tabular-nums" style={{ color: BLUE }}>
            <span dir="ltr">₪{formatPrice(p.price)}</span>
            {dealType === 'rent' ? <span className="text-[14px] font-semibold" style={{ color: SLATEV }}> לחודש</span> : null}
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-x-7 gap-y-2.5 text-[14px] font-semibold" style={{ color: INKV }}>
            {p.rooms && <span className="inline-flex items-center gap-2"><BedDouble size={16} style={{ color: BLUE }} aria-hidden="true" />{p.rooms} חדרים</span>}
            {p.area && <span className="inline-flex items-center gap-2"><Maximize size={16} style={{ color: BLUE }} aria-hidden="true" />{p.area} מ״ר</span>}
            {typeof p.floor === 'number' && (
              <span className="inline-flex items-center gap-2"><Building2 size={16} style={{ color: BLUE }} aria-hidden="true" />{p.floor === 0 ? 'קומת קרקע' : `קומה ${p.floor}${p.totalFloors ? ` מתוך ${p.totalFloors}` : ''}`}</span>
            )}
          </div>

          {p.description && (
            <p className="mt-6 text-[14.5px] leading-[1.85] text-start whitespace-pre-line" style={{ color: SLATEV }}>
              {p.description}
            </p>
          )}

          {feats.length > 0 && (
            <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
              {feats.map(([k, label]) => (
                <li key={k} className="rounded-full bg-white px-4 py-1.5 text-[12.5px] font-semibold" style={{ color: INKV, boxShadow: '0 6px 18px -8px rgba(23,26,45,0.2)' }}>
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* navy contact band */}
      {!p.isSold && phone && (
        <section style={{ background: NAVY }}>
          <div className="max-w-[760px] mx-auto px-5 py-12 text-center">
            <h2 className="text-[22px] md:text-[26px] font-semibold text-white">מעוניינים בנכס הזה?</h2>
            <p className="mt-2 text-[13.5px] text-white/70">
              {owner?.name ? `${owner.name} עונה בדרך כלל בתוך שעה, בימי א׳–ה׳` : 'עונים בדרך כלל בתוך שעה, בימי א׳–ה׳'}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3.5">
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14.5px] font-semibold text-white transition-[filter] hover:brightness-110"
                style={{ background: BLUE }}
              >
                <Phone size={15} aria-hidden="true" />
                <span dir="ltr">{phone}</span>
              </a>
              <a
                href={`https://wa.me/${phone.replace(/\D/g, '').replace(/^0/, '972')}?text=${encodeURIComponent(`שלום, ראיתי את "${p.title}" באתר ואשמח לפרטים`)}`}
                target="_blank" rel="noopener"
                className="inline-flex items-center rounded-full px-7 py-3 text-[14.5px] font-semibold text-white border border-white/40 transition-colors hover:bg-white/10"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section className="max-w-[1180px] mx-auto px-5 md:px-8 py-14">
          <h2 className="text-center text-[24px] md:text-[30px] font-semibold mb-8" style={{ color: INKV }}>נכסים דומים</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similar.map((s) => <RoomCard key={s.id} p={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}
