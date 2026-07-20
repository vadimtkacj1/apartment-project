"use client";
import React, { memo, useState } from 'react';
import Image from 'next/image';
import { m } from 'framer-motion';
import Link from 'next/link';
import {
  Bed, Maximize, MapPin, Wind, Warehouse, Sun,
  Droplet, Shield, ArrowUpDown, Building, ArrowLeft,
  CheckCircle2, Tag, ShieldCheck, GripVertical, Dog, Building2, Home
} from 'lucide-react';
import { Property } from '@/types/property.types';
import { analytics } from '@/lib/analytics';

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  'apartment': 'דירה',
  'garden-apartment': 'דירת גן',
  'cottage': 'קוטג׳',
  'house': 'בית',
  'duplex': 'דופלקס',
  'penthouse': 'פנטהאוז',
  'mini-penthouse': 'מיני פנטהאוז',
  'roof-apartment': 'דירת גג',
  'housing-unit': 'יחידת דיור',
  'studio': 'סטודיו',
  'basement-apartment': 'דירת מרתף',
  'villa': 'וילה'
};

const STATUS_LABELS: Record<string, string> = {
  'Exclusive': 'בלעדי',
  'Opportunity': 'הזדמנות',
  'New': 'חדש'
};

const STATUS_STYLES: Record<string, string> = {
  'Exclusive': 'bg-[#5594F1] text-[#051150]',
  'Opportunity': 'bg-white/95 text-[#051150]',
  'New': 'bg-[#051150] text-white'
};

const DEFAULT_IMAGE = '/images/hero/sales.jpg';

interface PropertyCardProps extends Partial<Property> {
  id: number;
  image?: string;
  title: string;
  location: string;
  price: string;
  originalPrice?: string;
  bedrooms?: string;
  bathrooms?: number;
  area: number;
  status?: string;
  category?: string; // 'sales' | 'rentals' | etc. — fallback для dealType
  index?: number;
  mapUrl?: string;
  images?: string[];
  isSold?: boolean;
  showImage?: boolean;
  totalFloors?: number;
  disableClick?: boolean;
  /** Eager-load this card's image (LCP) instead of lazy — pass true for the first few cards. */
  priority?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = memo(({
  id,
  image,
  images,
  title,
  location,
  price,
  originalPrice,
  bedrooms,
  rooms,
  area,
  status,
  dealType,
  category,
  neighborhood,
  propertyType,
  floor,
  totalFloors,
  features,
  isSold,
  showImage = true,
  disableClick = false,
  priority = false
}) => {
  // Состояние
  const displayImage = image || images?.find(img => img?.trim()) || DEFAULT_IMAGE;
  const [imageSrc, setImageSrc] = useState(displayImage);
  const [imageError, setImageError] = useState(false);

  const fromCategory = category === 'rentals' || category === 'commercial' ? 'rent'
    : category === 'sales' || category === 'land' ? 'sale' : null;
  const rawDealType = typeof dealType === 'string' ? dealType : (dealType as any)?.dealType;
  const fromDealType = rawDealType === 'rent' || rawDealType === 'sale' ? rawDealType : null;
  const actualDealType = fromCategory ?? fromDealType ?? 'sale';
  const dealTypeLabel = actualDealType === 'rent' ? 'להשכרה' : 'למכירה';
  const soldLabel = actualDealType === 'rent' ? 'מושכר' : 'נמכר';
  const displayRooms = rooms || bedrooms || 0;
  const propertyTypeLabel = propertyType ? (PROPERTY_TYPE_LABELS[propertyType] || propertyType) : '';
  // Declutter: show at most the 4 most-relevant amenities on the card (the full
  // list lives on the detail page) — Trulia-style minimal card.
  const featureChips = (features
    ? [
        { on: features.hasAirConditioning, icon: Wind, label: 'מיזוג' },
        { on: features.hasElevator, icon: ArrowUpDown, label: 'מעלית' },
        { on: features.hasStorage, icon: Warehouse, label: 'מחסן' },
        { on: features.hasSafeRoom, icon: Shield, label: 'ממ״ד' },
        { on: features.hasSunBalcony, icon: Sun, label: 'מ. שמש' },
        { on: features.hasBoiler, icon: Droplet, label: 'דוד' },
        { on: features.hasMamak, icon: ShieldCheck, label: 'ממ״ק' },
        { on: features.hasBars, icon: GripVertical, label: 'סורגים' },
        { on: features.hasPets, icon: Dog, label: 'חיות מחמד' },
        { on: features.hasHousingUnit, icon: Building2, label: 'יחידת דיור' },
        { on: features.hasShelter, icon: Home, label: 'מקלט בבניין' },
      ].filter((f) => f.on)
    : []
  ).slice(0, 4);

  const handleImageError = () => {
    if (imageSrc !== DEFAULT_IMAGE && !imageError) {
      setImageSrc(DEFAULT_IMAGE);
    } else {
      setImageError(true);
    }
  };

  const cardClasses = `group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
    isSold ? 'bg-[#F8FAFC] border border-[#E4E8F2] opacity-80' : 'bg-white border border-[#E9EDF5] hover:border-[#354AC4]/40'
  }`;

  // Calm, grounded elevation: one soft directional shadow (light from above) plus
  // the hairline border — no omnidirectional blue glow. Matches HotPropositionCard.
  const cardShadow = isSold
    ? '0 1px 2px rgba(5, 17, 80, 0.05), 0 6px 14px -10px rgba(5, 17, 80, 0.12)'
    : '0 1px 2px rgba(5, 17, 80, 0.05), 0 14px 30px -14px rgba(5, 17, 80, 0.20)';

  const cardInner = (
      <m.div
        whileHover={isSold ? {} : { y: -4 }}
        className={cardClasses}
        style={{ boxShadow: cardShadow }}
        dir="rtl"
      >
        {showImage && (
          <div className="relative w-full aspect-4/3 overflow-hidden bg-gray-100">
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 46vw, 23vw"
              className={`object-cover object-center transition-transform duration-700 ${
                isSold ? 'grayscale opacity-60' : 'group-hover:scale-105'
              }`}
              onError={handleImageError}
              {...(priority ? { priority: true } : { loading: 'lazy' as const })}
            />

            {imageError && (
              <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">תמונה לא זמינה</span>
              </div>
            )}

            <div className={`absolute inset-0 bg-linear-to-t from-[#051150]/35 via-[#051150]/0 to-transparent ${
              isSold ? 'opacity-50' : ''
            }`} />

            {/* Штамп продано/сдано */}
            {isSold && (
              <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                <img
                  src={actualDealType === 'rent' ? '/Rented.svg' : '/Sold.svg'}
                  alt={soldLabel}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Бейдж типа сделки */}
            <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg shadow-lg backdrop-blur-sm bg-[#051150]/90 text-white border border-white/20">
              <Tag size={13} />
              <span>{dealTypeLabel}</span>
            </div>

            {/* Бейдж статуса */}
            {status && !isSold && (
              <div className={`absolute top-4 right-4 z-30 px-3 py-1 text-xs font-black rounded-md shadow-md ${
                STATUS_STYLES[status] || 'bg-white/90 text-[#051150]'
              }`}>
                {STATUS_LABELS[status] || status}
              </div>
            )}

          </div>
        )}

        {/* Контент карточки */}
        <div className={`p-4 sm:p-5 flex flex-col flex-1 ${isSold ? 'bg-[#F8FAFC]' : ''}`}>
          {/* Заголовок */}
          <div className="mb-3">
            <h3 className={`text-base sm:text-lg font-bold leading-tight mb-1.5 ${
              isSold ? 'text-[#94A3B8] line-through' : 'text-[#051150]'
            }`}>
              {title}
            </h3>
            <div className={`flex items-start gap-1.5 text-xs mb-2 ${isSold ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              <MapPin size={12} className={`shrink-0 mt-0.5 ${isSold ? 'text-[#94A3B8]' : 'text-[#354AC4]'}`} />
              <span className="break-words">
                {propertyTypeLabel && `${propertyTypeLabel} • `}{location}{neighborhood && ` • ${neighborhood}`}
              </span>
            </div>
            {isSold && (
              <div className="flex items-center gap-1 bg-[#64748B] text-white px-2 py-1 rounded text-xs font-bold w-fit mb-2">
                <CheckCircle2 size={10} />
                <span>{soldLabel}</span>
              </div>
            )}
          </div>

          {/* Основная информация */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-4 sm:mb-5">
            <StatBox isSold={isSold} icon={Bed} label={`${displayRooms} חדרים`} />
            <StatBox
              isSold={isSold}
              icon={Building}
              label={floor !== undefined && floor !== null && typeof floor === 'number'
                ? (totalFloors && totalFloors > 0 ? `קומה ${floor} מתוך ${totalFloors}` : `קומה ${floor}`)
                : '-'
              }
            />
            <StatBox isSold={isSold} icon={Maximize} label={`${area} מ״ר`} />
          </div>

          {/* Amenities — top 4 only (declutter; the full list lives on the detail page) */}
          {featureChips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
              {featureChips.map((f, i) => (
                <FeatureTag key={i} icon={f.icon} label={f.label} />
              ))}
            </div>
          )}

          {/* Цена и кнопка */}
          <div className={`mt-auto border-t pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isSold ? 'border-[#E4E8F2]' : 'border-[#E9EDF5]'
          }`}>
            <div className="w-full sm:w-auto">
              {originalPrice && (
                <p className="text-xs text-[#94A3B8] line-through mb-0.5"><span dir="ltr">{originalPrice} <span className="text-[0.65em]">₪</span></span></p>
              )}
              <p className={`text-xl sm:text-2xl font-black tracking-tight ${
                isSold ? 'text-[#94A3B8] line-through' : 'text-[#051150]'
              }`}>
                <span dir="ltr">{price} <span className="text-sm sm:text-base font-bold">₪</span></span>
              </p>
            </div>

            {isSold ? (
              <div className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#94A3B8] text-white font-bold text-sm sm:text-base rounded-xl opacity-70 w-full sm:w-auto justify-center">
                {soldLabel}
                <CheckCircle2 size={18} />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#354AC4] text-white font-bold text-sm sm:text-base rounded-xl hover:bg-[#28389B] transition-colors w-full sm:w-auto justify-center whitespace-nowrap">
                <span>לפרטים נוספים</span>
                <ArrowLeft size={18} className="hidden sm:block" />
                <ArrowLeft size={16} className="sm:hidden" />
              </div>
            )}
          </div>
        </div>
      </m.div>
  );

  // When a parent already wraps the card in its own link (e.g. the marquee),
  // render a plain non-link container to avoid nested anchors.
  if (disableClick) {
    return <div className="block h-full">{cardInner}</div>;
  }

  // Real next/link: restores keyboard focus + Enter + cmd/middle-click.
  return (
    <Link
      href={`/apartments/${id}`}
      onClick={() => {
        if (!isSold) analytics.trackPropertyClick(id, 'card');
      }}
      className="block h-full cursor-pointer"
    >
      {cardInner}
    </Link>
  );
});

// Вспомогательные компоненты
const StatBox: React.FC<{ isSold?: boolean; icon: any; label: string }> = ({ isSold, icon: Icon, label }) => (
  <div className={`flex flex-col items-center justify-center rounded-lg py-2 sm:py-3 ${
    isSold ? 'bg-[#EEF1F6]' : 'bg-[#F4F6FB]'
  }`}>
    <Icon size={18} className={`sm:w-5 sm:h-5 ${isSold ? 'text-[#94A3B8]' : 'text-[#354AC4]'} mb-1`} />
    <span className={`text-xs sm:text-sm font-bold ${isSold ? 'text-[#94A3B8]' : 'text-[#1E293B]'}`}>
      {label}
    </span>
  </div>
);

const FeatureTag: React.FC<{ icon: any; label: string }> = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-0.5 sm:gap-1 bg-[#EAF1FE] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold text-[#354AC4]">
    <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
    <span>{label}</span>
  </div>
);

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;