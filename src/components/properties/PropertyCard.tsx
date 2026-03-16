"use client";
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bed, Maximize, MapPin, Car, Home, Compass,
  Wind, Warehouse, Sun, Droplet, Shield, ArrowUpDown,
  Building, Calendar, ArrowLeft, CheckCircle2, Tag, DollarSign
} from 'lucide-react';
import { Property } from '@/types/property.types';
import { analytics } from '@/lib/analytics';

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
  street,
  streetNumber,
  neighborhood,
  propertyType,
  floor,
  totalFloors,
  parking,
  position,
  furniture,
  directions,
  kitchen,
  vacancyDate,
  features,
  isSold,
  showImage = true,
  disableClick = false
}) => {
  const router = useRouter();

  const getPropertyTypeLabel = (type?: string) => {
    const labels: Record<string, string> = {
      'apartment': 'דירה',
      'garden-apartment': 'דירת גן',
      'cottage': 'קוטג׳',
      'house': 'בית',
      'duplex': 'דופלקס',
      'penthouse': 'פנטהאוז',
      'mini-penthouse': 'מיני פנטהאוז',
      'rooftop': 'דירת גג',
      'unit': 'יחידת דיור',
      'studio': 'סטודיו',
      'basement': 'דירת מרתף',
      'villa': 'וילה'
    };
    return type ? labels[type] : '';
  };

  const getParkingLabel = (parkingType?: string) => {
    const labels: Record<string, string> = {
      'single': 'יש',
      'none': 'אין',
      'double': 'כפולה',
      'shared': 'משותפת',
      'covered': 'מקורה',
      'triple': 'שלש',
      'robotic': 'רובוטית',
      'multiple': 'מכפיל'
    };
    return parkingType ? labels[parkingType] : 'לא צוין';
  };

  const getPositionLabel = (pos?: string) => {
    const labels: Record<string, string> = {
      'front': 'חזית',
      'back': 'עורף',
      'front-back': 'ח/ע',
      'side': 'צד',
      'corner': 'פינה'
    };
    return pos ? labels[pos] : '';
  };

  const getFurnitureLabel = (furn?: string) => {
    const labels: Record<string, string> = {
      'none': 'אין',
      'partial': 'חלקי',
      'full': 'מלא'
    };
    return furn ? labels[furn] : 'לא צוין';
  };

  const getDirectionsLabel = (dirs?: string[]) => {
    const labels: Record<string, string> = {
      'north': 'צפון',
      'south': 'דרום',
      'east': 'מזרח',
      'west': 'מערב'
    };
    return dirs ? dirs.map(d => labels[d]).join(', ') : '';
  };

  const getStatusLabel = (status?: string) => {
    const labels: Record<string, string> = {
      'Exclusive': 'בלעדי',
      'Opportunity': 'הזדמנות',
      'New': 'חדש'
    };
    return status ? labels[status] || status : '';
  };

  // Status badge styles — brand colors: gold for exclusive, white/blue for others
  const getStatusStyle = (status?: string) => {
    switch (status) {
      case 'Exclusive':
        // Brand gold — premium feel, clearly readable
        return 'bg-[#c5a357] text-[#1c3664]';
      case 'Opportunity':
        // White with dark blue text — clean, not loud
        return 'bg-white/95 text-[#1c3664]';
      case 'New':
        // Dark blue with white — consistent with brand
        return 'bg-[#1c3664] text-white';
      default:
        return 'bg-white/90 text-[#1c3664]';
    }
  };

  // Use first available image, fallback to local images
  const getDisplayImage = () => {
    if (image) return image;
    if (images && images.length > 0) {
      // Filter out empty or invalid URLs
      const validImage = images.find(img => img && img.trim() !== '');
      if (validImage) return validImage;
    }
    // Fallback to local hero images
    return '/images/hero/sales.jpg';
  };
  const displayImage = getDisplayImage();
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(displayImage);
  const displayRooms = rooms || bedrooms || 0;
  const dealTypeLabel = dealType === 'sale' ? 'למכירה' : dealType === 'rent' ? 'להשכרה' : 'למכירה';

  const handleClick = () => {
    if (!isSold) {
      analytics.trackPropertyClick(id, 'card');
    }
    router.push(`/apartments/${id}`);
  };

  return (
    <div
      onClick={disableClick ? undefined : handleClick}
      className={`block h-full ${disableClick ? '' : 'cursor-pointer'}`}
    >
      <motion.div
        whileHover={isSold ? {} : { y: -5 }}
        className={`group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
          isSold
            ? 'bg-gray-100 border-2 border-gray-300 opacity-75'
            : 'bg-white border border-gray-100'
        }`}
        style={{
          boxShadow: isSold
            ? '0 2px 10px rgba(0, 0, 0, 0.1)'
            : '0 4px 20px rgba(28, 54, 100, 0.15), 0 0 40px rgba(28, 54, 100, 0.08)'
        }}
        dir="rtl"
      >
        {/* Property Image */}
        {showImage && (
          <div className="relative w-full aspect-4/3 overflow-hidden bg-gray-100">
            <img
              src={imageSrc}
              alt={title}
              className={`absolute inset-0 w-full h-full object-contain transition-transform duration-700 z-0 ${
                isSold ? 'grayscale opacity-60' : 'group-hover:scale-105'
              }`}
              onError={() => {
                // Fallback to local image if external image fails to load
                if (imageSrc !== '/images/hero/sales.jpg' && !imageError) {
                  setImageSrc('/images/hero/sales.jpg');
                } else {
                  setImageError(true);
                }
              }}
              loading="lazy"
            />
            {imageError && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center z-10">
                <span className="text-gray-500 text-sm">תמונה לא זמינה</span>
              </div>
            )}

            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 ${
              isSold ? 'opacity-40' : 'opacity-60'
            }`} style={{ pointerEvents: 'none' }} />

            {/* Sold overlays */}
            {isSold && (
              <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
                <Image
                  src={dealType === 'rent' ? '/Rented.svg' : '/Sold.svg'}
                  alt={dealType === 'rent' ? 'מושכר' : 'נמכר'}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                  quality={90}
                />
              </div>
            )}

            {/* Deal Type Badge — refined, not dollar-green */}
            {dealType && (
              <div className={`absolute bottom-4 right-4 z-30 flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg shadow-lg backdrop-blur-sm ${
                dealType === 'sale'
                  ? 'bg-[#1c3664]/90 text-white border border-white/20'
                  : 'bg-[#1c3664]/90 text-white border border-white/20'
              }`} style={{ pointerEvents: 'none' }}>
                <Tag size={13} className="shrink-0" />
                <span>{dealTypeLabel}</span>
              </div>
            )}

            {/* Status Badge — distinct color per status, never dark-on-dark */}
            {status && !isSold && (
              <div className={`absolute top-4 right-4 z-30 px-3 py-1 text-xs font-black rounded-md shadow-md tracking-wide uppercase ${getStatusStyle(status)}`} style={{ pointerEvents: 'none' }}>
                {getStatusLabel(status)}
              </div>
            )}

            {/* Property Type Badge */}
            {propertyType && (
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1 text-xs font-bold rounded shadow-sm z-30" style={{ pointerEvents: 'none' }}>
                {getPropertyTypeLabel(propertyType)}
              </div>
            )}
          </div>
        )}

        {/* Badges when image is hidden */}
        {!showImage && (
          <div className="relative p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {dealType && (
                <div className="bg-[#1c3664] text-white px-4 py-2 text-sm font-bold rounded-lg shadow flex items-center gap-1.5">
                  <Tag size={14} className="shrink-0" />
                  <span>{dealTypeLabel}</span>
                </div>
              )}

              {isSold && (
                <div className="bg-red-600 text-white px-3 py-1.5 text-sm font-bold rounded-lg shadow flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  <span>{dealType === 'rent' ? 'מושכר' : 'נמכר'}</span>
                </div>
              )}

              {status && !isSold && (
                <div className={`px-3 py-1 text-xs font-black rounded-md shadow tracking-wide uppercase ${getStatusStyle(status)}`}>
                  {getStatusLabel(status)}
                </div>
              )}

              {propertyType && (
                <div className="bg-white border border-gray-200 text-gray-900 px-3 py-1 text-xs font-bold rounded shadow-sm">
                  {getPropertyTypeLabel(propertyType)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card Content */}
        <div className={`p-4 sm:p-5 flex flex-col flex-1 ${isSold ? 'bg-gray-50' : ''}`}>

          {/* Title & Address */}
          <div className="mb-3">
            <h3 className={`text-base sm:text-lg font-bold leading-tight mb-1.5 ${
              isSold ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {title}
            </h3>
            <div className={`flex items-start gap-1.5 text-xs mb-2 ${
              isSold ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <MapPin size={12} className={`shrink-0 mt-0.5 ${isSold ? 'text-gray-400' : 'text-[#1c3664]'}`} />
              <span className="break-words">
                {location}
                {neighborhood && ` • ${neighborhood}`}
              </span>
            </div>
            {isSold && (
              <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold w-fit mb-2">
                <CheckCircle2 size={10} />
                <span>{dealType === 'rent' ? 'מושכר' : 'נמכר'}</span>
              </div>
            )}
          </div>

          {/* Main Statistics Grid */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-4 sm:mb-5">
            <div className={`flex flex-col items-center justify-center rounded-lg py-2 sm:py-3 ${
              isSold ? 'bg-gray-200' : 'bg-gray-50'
            }`}>
              <Bed size={18} className={`sm:w-5 sm:h-5 ${isSold ? 'text-gray-400' : 'text-[#1c3664]'} mb-1`} />
              <span className={`text-xs sm:text-sm font-bold ${isSold ? 'text-gray-500' : 'text-gray-900'}`}>
                {displayRooms} חדרים
              </span>
            </div>

            <div className={`flex flex-col items-center justify-center rounded-lg py-2 sm:py-3 ${
              isSold ? 'bg-gray-200' : 'bg-gray-50'
            }`}>
              <Building size={18} className={`sm:w-5 sm:h-5 ${isSold ? 'text-gray-400' : 'text-[#1c3664]'} mb-1`} />
              <span className={`text-xs sm:text-sm font-bold ${isSold ? 'text-gray-500' : 'text-gray-900'}`}>
                {floor !== undefined && floor !== null && typeof floor === 'number'
                  ? ((totalFloors !== null && totalFloors !== undefined && totalFloors > 0)
                    ? `קומה ${floor} מתוך ${totalFloors}`
                    : `קומה ${floor}`)
                  : '-'}
              </span>
            </div>

            <div className={`flex flex-col items-center justify-center rounded-lg py-2 sm:py-3 ${
              isSold ? 'bg-gray-200' : 'bg-gray-50'
            }`}>
              <Maximize size={18} className={`sm:w-5 sm:h-5 ${isSold ? 'text-gray-400' : 'text-[#1c3664]'} mb-1`} />
              <span className={`text-xs sm:text-sm font-bold ${isSold ? 'text-gray-500' : 'text-gray-900'}`}>
                {area} מ״ר
              </span>
            </div>
          </div>

          {/* Feature Tags */}
          {features && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
              {features.hasAirConditioning && (
                <div className="flex items-center gap-0.5 sm:gap-1 bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold text-blue-700">
                  <Wind size={12} className="sm:w-3.5 sm:h-3.5" /> <span>מיזוג</span>
                </div>
              )}
              {features.hasElevator && (
                <div className="flex items-center gap-0.5 sm:gap-1 bg-purple-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold text-purple-700">
                  <ArrowUpDown size={12} className="sm:w-3.5 sm:h-3.5" /> <span>מעלית</span>
                </div>
              )}
              {features.hasStorage && (
                <div className="flex items-center gap-0.5 sm:gap-1 bg-orange-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold text-orange-700">
                  <Warehouse size={12} className="sm:w-3.5 sm:h-3.5" /> <span>מחסן</span>
                </div>
              )}
              {features.hasSafeRoom && (
                <div className="flex items-center gap-0.5 sm:gap-1 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold text-green-700">
                  <Shield size={12} className="sm:w-3.5 sm:h-3.5" /> <span>ממ״ד</span>
                </div>
              )}
              {features.hasSunBalcony && (
                <div className="flex items-center gap-0.5 sm:gap-1 bg-yellow-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold text-yellow-700">
                  <Sun size={12} className="sm:w-3.5 sm:h-3.5" /> <span>מ. שמש</span>
                </div>
              )}
              {features.hasBoiler && (
                <div className="flex items-center gap-0.5 sm:gap-1 bg-red-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold text-red-700">
                  <Droplet size={12} className="sm:w-3.5 sm:h-3.5" /> <span>דוד</span>
                </div>
              )}
            </div>
          )}

          {/* Footer: Price & Action Button */}
          <div className={`mt-auto border-t pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isSold ? 'border-gray-300' : 'border-gray-100'
          }`}>
            <div className="w-full sm:w-auto">
              {originalPrice && (
                <p className="text-xs text-gray-400 line-through mb-0.5">
                  {originalPrice} ₪
                </p>
              )}
              <p className={`text-lg sm:text-xl font-black ${
                isSold ? 'text-gray-400 line-through' : 'text-[#1c3664]'
              }`}>
                {price} ₪
              </p>
            </div>

            {isSold ? (
              <div className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-400 text-white font-bold text-sm sm:text-base rounded-xl opacity-60 w-full sm:w-auto justify-center">
                {dealType === 'rent' ? 'מושכר' : 'נמכר'}
                <CheckCircle2 size={18} />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#1c3664] text-white font-bold text-sm sm:text-base rounded-xl hover:bg-[#162d54] transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto justify-center whitespace-nowrap" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
                <span className="whitespace-nowrap">לפרטים נוספים</span>
                <ArrowLeft size={16} className="sm:hidden shrink-0" />
                <ArrowLeft size={18} className="hidden sm:block shrink-0" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;