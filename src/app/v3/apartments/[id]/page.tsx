import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Phone, MapPin, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Card, RowHead, INK, SLATE, MIST, PILL_SHADOW, TYPE_LABELS, allImages, toV3Prop } from '../../ui';

/* V3 property detail — marketplace language: 5-photo mosaic, quiet fact line,
   amenity checklist, elevated price card with direct call/WhatsApp. */

export const revalidate = 60;

const AMENITIES: Array<[string, string]> = [
  ['hasAirConditioning', 'מיזוג אוויר'], ['hasElevator', 'מעלית'], ['hasStorage', 'מחסן'],
  ['hasSafeRoom', 'ממ״ד'], ['hasSunBalcony', 'מרפסת שמש'], ['hasBoiler', 'דוד שמש'],
];

export default async function V3Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pid = Number(id);
  if (!Number.isFinite(pid)) notFound();

  const p = await prisma.property.findFirst({
    where: { id: pid, isActive: true },
  });
  if (!p) notFound();

  const images = allImages(p.images);
  const photos = images.length ? images.slice(0, 5) : ['/images/hero/sales.jpg'];
  const dealType = p.category === 'rentals' || p.dealType === 'rent' ? 'rent' : 'sale';
  const typeLabel = p.propertyType ? (TYPE_LABELS[p.propertyType] ?? p.propertyType) : null;

  const facts = [
    p.rooms && `${p.rooms} חדרים`,
    typeof p.floor === 'number' && (p.floor === 0 ? 'קומת קרקע' : `קומה ${p.floor}${p.totalFloors ? ` מתוך ${p.totalFloors}` : ''}`),
    p.area && `${p.area} מ״ר`,
    typeLabel,
  ].filter(Boolean) as string[];

  const amenities = AMENITIES.filter(([k]) => Boolean((p as Record<string, unknown>)[k]));

  const [similarRaw, owner] = await Promise.all([
    prisma.property.findMany({
      where: { isActive: true, isSold: false, id: { not: pid }, city: p.city ?? undefined },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }], take: 4,
      select: { id: true, title: true, location: true, neighborhood: true, price: true, rooms: true, area: true, dealType: true, category: true, images: true, isPinned: true },
    }),
    prisma.owner.findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true, name: true } }).catch(() => null),
  ]);
  const similar = similarRaw.map(toV3Prop);
  const phone = owner?.phone ?? null;

  return (
    <div dir="rtl" className="max-w-[1240px] mx-auto px-6 md:px-10 py-8">

      <Link href="/v3/apartments" className="inline-flex items-center gap-1.5 text-[14px] hover:underline underline-offset-4" style={{ color: INK, fontWeight: 600 }}>
        <ArrowRight size={15} aria-hidden="true" />
        כל הנכסים
      </Link>

      {/* title */}
      <div className="mt-4 mb-5">
        <h1 style={{ fontWeight: 700, fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)', color: INK, letterSpacing: '-0.02em' }}>
          {p.title}
          {p.isSold ? <span className="ms-3 text-[15px] align-middle" style={{ color: SLATE, fontWeight: 600 }}>· נמכר</span> : null}
        </h1>
        <div className="mt-1.5 flex items-center gap-1.5 text-[14.5px]" style={{ color: SLATE }}>
          <MapPin size={14} aria-hidden="true" />
          {p.location}{p.neighborhood ? `, ${p.neighborhood}` : ''}
        </div>
      </div>

      {/* photo mosaic: 1 lead + up to 4 */}
      <div className={`grid gap-2 rounded-[20px] overflow-hidden ${photos.length > 1 ? 'grid-cols-2 md:grid-cols-4 md:grid-rows-2' : ''}`}>
        <div className={`relative ${photos.length > 1 ? 'col-span-2 row-span-2 aspect-[4/3] md:aspect-auto' : 'aspect-[16/9]'}`} style={{ background: '#dddddd' }}>
          <Image src={photos[0]} alt={p.title} fill priority sizes="(max-width: 768px) 100vw, 60vw" className={`object-cover ${p.isSold ? 'grayscale opacity-70' : ''}`} />
        </div>
        {photos.slice(1).map((src, i) => (
          <div key={i} className="relative aspect-[4/3] hidden md:block" style={{ background: '#dddddd' }}>
            <Image src={src} alt="" fill sizes="25vw" className={`object-cover ${p.isSold ? 'grayscale opacity-70' : ''}`} loading="lazy" />
          </div>
        ))}
      </div>

      {/* content + price card */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 min-w-0">
          <div className="text-[16px]" style={{ fontWeight: 600, color: INK }}>{facts.join(' · ')}</div>

          {p.description && (
            <>
              <hr className="my-6 border-0 h-px" style={{ background: MIST }} />
              <p className="text-[15.5px] leading-[1.8] whitespace-pre-line" style={{ color: '#3b3b3b', maxInlineSize: '65ch' }}>
                {p.description}
              </p>
            </>
          )}

          {amenities.length > 0 && (
            <>
              <hr className="my-6 border-0 h-px" style={{ background: MIST }} />
              <h2 className="text-[18px] mb-4" style={{ fontWeight: 600, color: INK }}>מה יש בנכס</h2>
              <ul className="grid grid-cols-2 gap-y-3 gap-x-6 max-w-[420px]">
                {amenities.map(([k, label]) => (
                  <li key={k} className="flex items-center gap-2.5 text-[14.5px]" style={{ color: '#3b3b3b' }}>
                    <span aria-hidden="true" className="inline-block size-1.5 rounded-full" style={{ background: INK }} />
                    {label}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* price card — elevated container (allowed shadow) */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-[100px] bg-white rounded-[20px] p-6" style={{ boxShadow: PILL_SHADOW }}>
            <div className="flex items-baseline gap-2">
              <span className="text-[24px] tabular-nums" style={{ fontWeight: 700, color: INK }} dir="ltr">₪{p.price}</span>
              <span className="text-[14px]" style={{ color: SLATE }}>{dealType === 'rent' ? 'לחודש' : 'מחיר מבוקש'}</span>
            </div>
            {phone && !p.isSold && (
              <>
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="mt-5 flex items-center justify-center gap-2 w-full py-3.5 rounded-lg text-white text-[15px] transition-opacity hover:opacity-90"
                  style={{ background: INK, fontWeight: 600 }}
                >
                  <Phone size={16} aria-hidden="true" />
                  התקשרו — <span dir="ltr">{phone}</span>
                </a>
                <a
                  href={`https://wa.me/${phone.replace(/\D/g, '').replace(/^0/, '972')}?text=${encodeURIComponent(`שלום, מתעניין/ת בנכס "${p.title}"`)}`}
                  target="_blank"
                  rel="noopener"
                  className="mt-2.5 flex items-center justify-center w-full py-3.5 rounded-lg text-[15px] transition-colors hover:bg-[#f7f7f7]"
                  style={{ border: `1px solid ${INK}`, color: INK, fontWeight: 600 }}
                >
                  WhatsApp
                </a>
              </>
            )}
            {owner?.name && (
              <div className="mt-4 pt-4 text-[13px]" style={{ borderTop: `1px solid ${MIST}`, color: SLATE }}>
                ליווי אישי · {owner.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* similar */}
      {similar.length > 0 && (
        <section className="mt-14">
          <RowHead title="עוד נכסים שיעניינו אתכם" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
            {similar.map((s) => <Card key={s.id} p={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}
