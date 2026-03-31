"use client";
import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
  'Exclusive': 'bg-[#c5a357] text-[#1c3664]',
  'Opportunity': 'bg-white/95 text-[#1c3664]',
  'New': 'bg-[#1c3664] text-white'
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
  disableClick = false
}) => {
  const router = useRouter();

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

  // Обработчики
  const handleClick = () => {
    if (!isSold) analytics.trackPropertyClick(id, 'card');
    router.push(`/apartments/${id}`);
  };

  const handleImageError = () => {
    if (imageSrc !== DEFAULT_IMAGE && !imageError) {
      setImageSrc(DEFAULT_IMAGE);
    } else {
      setImageError(true);
    }
  };

  const cardClasses = `group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
    isSold ? 'bg-gray-100 border-2 border-gray-300 opacity-75' : 'bg-white border border-gray-100'
  }`;

  const cardShadow = isSold
    ? '0 2px 10px rgba(0, 0, 0, 0.1)'
    : '0 4px 20px rgba(28, 54, 100, 0.15), 0 0 40px rgba(28, 54, 100, 0.08)';

  return (
    <div
      onClick={disableClick ? undefined : handleClick}
      className={`block h-full ${disableClick ? '' : 'cursor-pointer'}`}
    >
      <motion.div
        whileHover={isSold ? {} : { y: -5 }}
        className={cardClasses}
        style={{ boxShadow: cardShadow }}
        dir="rtl"
      >
        {showImage && (
          <div className="relative w-full aspect-4/3 overflow-hidden bg-gray-100">
            <img
              src={imageSrc}
              alt={title}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                isSold ? 'grayscale opacity-60' : 'group-hover:scale-105'
              }`}
              style={{ objectPosition: 'center 60%' }}
              onError={handleImageError}
              loading="lazy"
            />

            {imageError && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-sm">תמונה לא זמינה</span>
              </div>
            )}

            <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent ${
              isSold ? 'opacity-40' : 'opacity-60'
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
            <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg shadow-lg backdrop-blur-sm bg-[#1c3664]/90 text-white border border-white/20">
              <Tag size={13} />
              <span>{dealTypeLabel}</span>
            </div>

            {/* Бейдж статуса */}
            {status && !isSold && (
              <div className={`absolute top-4 right-4 z-30 px-3 py-1 text-xs font-black rounded-md shadow-md tracking-wide uppercase ${
                STATUS_STYLES[status] || 'bg-white/90 text-[#1c3664]'
              }`}>
                {STATUS_LABELS[status] || status}
              </div>
            )}

            {/* Тип недвижимости */}
            {propertyType && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1 text-xs font-bold rounded shadow-sm z-30">
                {PROPERTY_TYPE_LABELS[propertyType] || propertyType}
              </div>
            )}
          </div>
        )}

        {/* Контент карточки */}
        <div className={`p-4 sm:p-5 flex flex-col flex-1 ${isSold ? 'bg-gray-50' : ''}`}>
          {/* Заголовок */}
          <div className="mb-3">
            <h3 className={`text-base sm:text-lg font-bold leading-tight mb-1.5 ${
              isSold ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {title}
            </h3>
            <div className={`flex items-start gap-1.5 text-xs mb-2 ${isSold ? 'text-gray-400' : 'text-gray-500'}`}>
              <MapPin size={12} className={`shrink-0 mt-0.5 ${isSold ? 'text-gray-400' : 'text-[#1c3664]'}`} />
              <span className="break-words">
                {location}{neighborhood && ` • ${neighborhood}`}
              </span>
            </div>
            {isSold && (
              <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold w-fit mb-2">
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

          {/* Особенности */}
          {features && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
              {features.hasAirConditioning && <FeatureTag icon={Wind} label="מיזוג" color="blue" />}
              {features.hasElevator && <FeatureTag icon={ArrowUpDown} label="מעלית" color="purple" />}
              {features.hasStorage && <FeatureTag icon={Warehouse} label="מחסן" color="orange" />}
              {features.hasSafeRoom && <FeatureTag icon={Shield} label="ממ״ד" color="green" />}
              {features.hasSunBalcony && <FeatureTag icon={Sun} label="מ. שמש" color="yellow" />}
              {features.hasBoiler && <FeatureTag icon={Droplet} label="דוד" color="red" />}
              {features.hasMamak && <FeatureTag icon={ShieldCheck} label="ממ״ק" color="green" />}
              {features.hasBars && <FeatureTag icon={GripVertical} label="סורגים" color="blue" />}
              {features.hasPets && <FeatureTag icon={Dog} label="חיות מחמד" color="purple" />}
              {features.hasHousingUnit && <FeatureTag icon={Building2} label="יחידת דיור" color="orange" />}
              {features.hasShelter && <FeatureTag icon={Home} label="מקלט בבניין" color="green" />}
            </div>
          )}

          {/* Цена и кнопка */}
          <div className={`mt-auto border-t pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isSold ? 'border-gray-300' : 'border-gray-100'
          }`}>
            <div className="w-full sm:w-auto">
              {originalPrice && (
                <p className="text-xs text-gray-400 line-through mb-0.5">{originalPrice} ₪</p>
              )}
              <p className={`text-lg sm:text-xl font-black ${
                isSold ? 'text-gray-400 line-through' : 'text-[#1c3664]'
              }`}>
                {price} ₪
              </p>
            </div>

            {isSold ? (
              <div className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-400 text-white font-bold text-sm sm:text-base rounded-xl opacity-60 w-full sm:w-auto justify-center">
                {soldLabel}
                <CheckCircle2 size={18} />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#1c3664] text-white font-bold text-sm sm:text-base rounded-xl hover:bg-[#162d54] transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto justify-center whitespace-nowrap">
                <span>לפרטים נוספים</span>
                <ArrowLeft size={18} className="hidden sm:block" />
                <ArrowLeft size={16} className="sm:hidden" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
});

// Вспомогательные компоненты
const StatBox: React.FC<{ isSold?: boolean; icon: any; label: string }> = ({ isSold, icon: Icon, label }) => (
  <div className={`flex flex-col items-center justify-center rounded-lg py-2 sm:py-3 ${
    isSold ? 'bg-gray-200' : 'bg-gray-50'
  }`}>
    <Icon size={18} className={`sm:w-5 sm:h-5 ${isSold ? 'text-gray-400' : 'text-[#1c3664]'} mb-1`} />
    <span className={`text-xs sm:text-sm font-bold ${isSold ? 'text-gray-500' : 'text-gray-900'}`}>
      {label}
    </span>
  </div>
);

const FeatureTag: React.FC<{ icon: any; label: string; color: string }> = ({ icon: Icon, label, color }) => (
  <div className={`flex items-center gap-0.5 sm:gap-1 bg-${color}-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold text-${color}-700`}>
    <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
    <span>{label}</span>
  </div>
);

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
