"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Bed, Maximize, MapPin, Car, Home, Compass, 
  Wind, Warehouse, Sun, Droplet, Shield, ArrowUpDown,
  Building, Calendar
} from 'lucide-react';
import { Property } from '@/types/property.types';

interface PropertyCardProps extends Partial<Property> {
  id: number;
  image?: string;
  title: string;
  location: string;
  price: string;
  originalPrice?: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  status?: string;
  index?: number;
  mapUrl?: string;
  images?: string[];
}

const PropertyCard: React.FC<PropertyCardProps> = ({
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
  // Extended Property fields
  dealType,
  street,
  streetNumber,
  neighborhood,
  propertyType,
  floor,
  parking,
  position,
  furniture,
  directions,
  kitchen,
  vacancyDate,
  features
}) => {

  // --- Helper functions for Hebrew localization ---

  const getPropertyTypeLabel = (type?: string) => {
    const labels: Record<string, string> = {
      'apartment': 'דירה',
      'garden-apartment': 'דירת גן',
      'cottage': 'קוטג׳',
      'house': 'בית',
      'duplex': 'דופלקס',
      'penthouse': 'פנטהאוס',
      'rooftop': 'דירת גג',
      'unit': 'יחידת דיור',
      'divided': 'מחולקת',
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
      'triple': 'שלוש',
      'robotic': 'רובוטית',
      'multiple': 'מכפיל'
    };
    return parkingType ? labels[parkingType] : 'לא צוין'; // Default: "Not specified"
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

  // --- Component Logic ---
  
  // Determine the main image to display
  const displayImage = image || (images && images.length > 0 ? images[0] : '/images/placeholder.webp');
  
  // Normalize room count
  const displayRooms = rooms || bedrooms || 0;
  
  // Determine deal type label (Sale/Rent)
  const dealTypeLabel = dealType === 'sale' ? 'למכירה' : dealType === 'rent' ? 'להשכרה' : 'למכירה';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      dir="rtl"
    >
      {/* Property Image */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <Image
          src={displayImage}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Dark overlay for text contrast if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>

        {/* Status Badge (e.g., Sold, New) */}
        {status && (
          <div className="absolute top-4 right-4 bg-[#C19A6B] text-white px-3 py-1 text-sm font-bold rounded shadow-md">
            {status}
          </div>
        )}

        {/* Property Type Badge (e.g., Apartment, Villa) */}
        {propertyType && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1 text-xs font-bold rounded shadow-sm">
            {getPropertyTypeLabel(propertyType)}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Address & Title */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium mb-2">
            <MapPin size={16} className="text-[#C19A6B]" />
            <span className="truncate">
              {location} 
              {neighborhood && ` • ${neighborhood}`}
              {street && ` • ${street} ${streetNumber || ''}`}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 leading-snug line-clamp-2 min-h-[3.5rem]">
            {title}
          </h3>
        </div>

        {/* Main Statistics Grid (Rooms, Floor, Area) */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-2">
            <Bed size={20} className="text-[#C19A6B] mb-1" />
            <span className="text-sm font-bold text-gray-900">{displayRooms} חדרים</span>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-2">
            <Building size={20} className="text-[#C19A6B] mb-1" />
            <span className="text-sm font-bold text-gray-900">
               {floor !== undefined ? `קומה ${floor}` : '-'}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-2">
            <Maximize size={20} className="text-[#C19A6B] mb-1" />
            <span className="text-sm font-bold text-gray-900">{area} מ״ר</span>
          </div>
        </div>

        {/* Detailed Information List */}
        <div className="space-y-2 mb-5 text-sm text-gray-700">
          {parking && (
            <div className="flex items-center gap-2">
              <Car size={16} className="text-gray-400" />
              <span className="text-gray-500">חניה:</span>
              <span className="font-semibold mr-auto">{getParkingLabel(parking)}</span>
            </div>
          )}
          {position && (
            <div className="flex items-center gap-2">
              <Home size={16} className="text-gray-400" />
              <span className="text-gray-500">מיקום:</span>
              <span className="font-semibold mr-auto">{getPositionLabel(position)}</span>
            </div>
          )}
          {furniture && furniture !== 'none' && (
            <div className="flex items-center gap-2">
              <Home size={16} className="text-gray-400" />
              <span className="text-gray-500">ריהוט:</span>
              <span className="font-semibold mr-auto">{getFurnitureLabel(furniture)}</span>
            </div>
          )}
          {directions && directions.length > 0 && (
             <div className="flex items-center gap-2">
               <Compass size={16} className="text-gray-400" />
               <span className="text-gray-500">כיוונים:</span>
               <span className="font-semibold mr-auto">{getDirectionsLabel(directions)}</span>
             </div>
          )}
          {vacancyDate && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-gray-500">תאריך פינוי:</span>
              <span className="font-semibold mr-auto">{new Date(vacancyDate).toLocaleDateString('he-IL')}</span>
            </div>
          )}
        </div>

        {/* Feature Tags */}
        {features && (
          <div className="flex flex-wrap gap-2 mb-5">
            {features.hasAirConditioning && (
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md text-xs font-semibold text-blue-700">
                <Wind size={14} /> <span>מיזוג</span>
              </div>
            )}
            {features.hasElevator && (
              <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-md text-xs font-semibold text-purple-700">
                <ArrowUpDown size={14} /> <span>מעלית</span>
              </div>
            )}
            {features.hasStorage && (
              <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-md text-xs font-semibold text-orange-700">
                <Warehouse size={14} /> <span>מחסן</span>
              </div>
            )}
            {features.hasSafeRoom && (
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md text-xs font-semibold text-green-700">
                <Shield size={14} /> <span>ממ״ד</span>
              </div>
            )}
            {features.hasSunBalcony && (
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md text-xs font-semibold text-yellow-700">
                <Sun size={14} /> <span>מ. שמש</span>
              </div>
            )}
            {features.hasBoiler && (
              <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md text-xs font-semibold text-red-700">
                <Droplet size={14} /> <span>דוד</span>
              </div>
            )}
          </div>
        )}

        {/* Footer: Price & Action Button */}
        <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between">
          <div>
             {originalPrice && (
              <p className="text-xs text-gray-400 line-through mb-0.5">
                {originalPrice}
              </p>
            )}
            <p className="text-2xl font-black text-[#C19A6B]">
              {price} <span className="text-lg">₪</span>
            </p>
          </div>
          
          <Link
            href={`/apartments/${id}`}
            className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-[#C19A6B] transition-colors shadow-lg hover:shadow-xl"
          >
            {dealTypeLabel}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;