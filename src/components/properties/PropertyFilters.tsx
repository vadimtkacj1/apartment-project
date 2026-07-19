"use client";
import React from 'react';
import {
  MapPin, Ruler, Sparkles,
  Wind, ArrowUpDown, Sun, Shield, Warehouse, Accessibility,
  ShieldCheck, GripVertical, Dog, Building2, Home,
} from 'lucide-react';
import { FilterState } from '@/types/property.types';
import { ISRAELI_CITIES } from '@/data/cities';

interface PropertyFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
}

// Shared input/label styling — inputs sit on the blue-tinted section cards, so
// they use a white surface + hairline border to stand out.
const inputClass =
  "w-full px-4 py-3 bg-white border border-[#E4E8F2] rounded-xl font-semibold text-gray-900 focus:border-[#354AC4] focus:ring-2 focus:ring-[#354AC4]/20 focus:outline-none transition-all duration-200";
const labelClass = "block text-sm font-bold text-gray-700 mb-2";

// The 11 feature toggles, rendered as blue chips matching the property-card tags.
const FEATURE_OPTIONS: { key: string; label: string; icon: React.ElementType }[] = [
  { key: 'hasAirConditioning', label: 'מיזוג', icon: Wind },
  { key: 'hasElevator', label: 'מעלית', icon: ArrowUpDown },
  { key: 'hasSunBalcony', label: 'מ. שמש', icon: Sun },
  { key: 'hasSafeRoom', label: 'ממ״ד', icon: Shield },
  { key: 'hasStorage', label: 'מחסן', icon: Warehouse },
  { key: 'hasDisabledAccess', label: 'גישה לנכים', icon: Accessibility },
  { key: 'hasMamak', label: 'ממ״ק', icon: ShieldCheck },
  { key: 'hasBars', label: 'סורגים', icon: GripVertical },
  { key: 'hasPets', label: 'חיות מחמד', icon: Dog },
  { key: 'hasHousingUnit', label: 'יחידת דיור', icon: Building2 },
  { key: 'hasShelter', label: 'מקלט בבניין', icon: Home },
];

// Blue-tinted elevated section card with a lead icon.
const FilterSection: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode }> = ({
  icon: Icon,
  title,
  children,
}) => (
  <div className="rounded-2xl bg-[#f5f7fb] border border-[#E4E8F2] p-5 shadow-[0_2px_10px_rgba(53,74,196,0.06)]">
    <div className="mb-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF1FE] text-[#354AC4]">
          <Icon size={16} />
        </span>
        <h3 className="text-base font-black text-[#051150]">{title}</h3>
      </div>
    </div>
    {children}
  </div>
);

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFiltersChange,
  onApply,
  onReset
}) => {
  // Helper to update a specific filter key
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Helper to toggle boolean features
  const toggleFeature = (feature: string) => {
    const currentFeatures = filters.features || {};
    onFiltersChange({
      ...filters,
      features: {
        ...currentFeatures,
        [feature]: (currentFeatures as any)[feature] === undefined ? true : !(currentFeatures as any)[feature]
      }
    });
  };

  return (
    <div
      className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E4E8F2] shadow-[0_4px_20px_rgba(5,17,80,0.08)] space-y-5"
      dir="rtl"
    >
      {/* --- SECTION: LOCATION --- */}
      <FilterSection icon={MapPin} title="מיקום">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>עיר</label>
            <select
              value={filters.city}
              onChange={(e) => updateFilter('city', e.target.value)}
              className={inputClass}
            >
              <option value="all">הכל</option>
              {ISRAELI_CITIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>שכונה</label>
            <input
              type="text"
              value={filters.neighborhood || ''}
              onChange={(e) => updateFilter('neighborhood', e.target.value)}
              placeholder="הזן שכונה"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>רחוב</label>
            <input
              type="text"
              value={filters.street || ''}
              onChange={(e) => updateFilter('street', e.target.value)}
              placeholder="שם הרחוב"
              className={inputClass}
            />
          </div>
        </div>
      </FilterSection>

      {/* --- SECTION: SIZE & PRICE --- */}
      <FilterSection icon={Ruler} title="גודל ומחיר">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rooms */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className={labelClass}>חדרים (מ-)</label>
              <input
                type="number"
                value={filters.minRooms || ''}
                onChange={(e) => updateFilter('minRooms', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="מ-"
                step="0.5"
                className={inputClass}
              />
            </div>
            <div className="w-1/2">
              <label className={labelClass}>(עד-)</label>
              <input
                type="number"
                value={filters.maxRooms || ''}
                onChange={(e) => updateFilter('maxRooms', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="עד"
                step="0.5"
                className={inputClass}
              />
            </div>
          </div>

          {/* Price */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className={labelClass}>מחיר (מ-)</label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="₪"
                className={inputClass}
              />
            </div>
            <div className="w-1/2">
              <label className={labelClass}>(עד-)</label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="₪"
                className={inputClass}
              />
            </div>
          </div>

          {/* Area */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className={labelClass}>מ״ר (מ-)</label>
              <input
                type="number"
                value={filters.minArea || ''}
                onChange={(e) => updateFilter('minArea', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="מ״ר"
                className={inputClass}
              />
            </div>
            <div className="w-1/2">
              <label className={labelClass}>(עד-)</label>
              <input
                type="number"
                value={filters.maxArea || ''}
                onChange={(e) => updateFilter('maxArea', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="מ״ר"
                className={inputClass}
              />
            </div>
          </div>

          {/* Floor */}
          <div>
            <label className={labelClass}>קומה</label>
            <input
              type="number"
              value={filters.floor || ''}
              onChange={(e) => updateFilter('floor', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="מספר קומה"
              className={inputClass}
            />
          </div>
        </div>
      </FilterSection>

      {/* --- SECTION: FEATURES & ATTRIBUTES --- */}
      <FilterSection icon={Sparkles} title="מאפיינים">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Deal Type */}
          <div>
            <label className={labelClass}>סוג עסקה</label>
            <select
              value={filters.dealType}
              onChange={(e) => updateFilter('dealType', e.target.value)}
              className={inputClass}
            >
              <option value="all">הכל</option>
              <option value="sale">מכירה</option>
              <option value="rent">השכרה</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className={labelClass}>סוג הנכס</label>
            <select
              value={filters.propertyType || 'all'}
              onChange={(e) => updateFilter('propertyType', e.target.value)}
              className={inputClass}
            >
              <option value="all">הכל</option>
              <option value="apartment">דירה</option>
              <option value="garden-apartment">דירת גן</option>
              <option value="cottage">קוטג׳</option>
              <option value="house">בית</option>
              <option value="duplex">דופלקס</option>
              <option value="penthouse">פנטהאוז</option>
              <option value="mini-penthouse">מיני פנטהאוז</option>
              <option value="roof-apartment">דירת גג</option>
              <option value="housing-unit">יחידת דיור</option>
              <option value="studio">סטודיו</option>
              <option value="basement-apartment">דירת מרתף</option>
              <option value="villa">וילה</option>
            </select>
          </div>

          {/* Parking */}
          <div>
            <label className={labelClass}>חניה</label>
            <select
              value={filters.parking || 'all'}
              onChange={(e) => updateFilter('parking', e.target.value)}
              className={inputClass}
            >
              <option value="all">הכל</option>
              <option value="yes">יש</option>
              <option value="none">אין</option>
              <option value="double">כפולה</option>
              <option value="shared">משותפת</option>
              <option value="two-seperate">שניים נפרדות</option>
              <option value="covered">מקורה</option>
              <option value="three">שלוש</option>
              <option value="robotic">רובוטית</option>
              <option value="multiplier">מכפיל</option>
            </select>
          </div>

          {/* Furniture */}
          <div>
            <label className={labelClass}>ריהוט</label>
            <select
              value={filters.furniture || 'all'}
              onChange={(e) => updateFilter('furniture', e.target.value)}
              className={inputClass}
            >
              <option value="all">הכל</option>
              <option value="none">אין</option>
              <option value="partial">חלקי</option>
              <option value="full">מלא</option>
            </select>
          </div>

          {/* Kitchen */}
          <div>
            <label className={labelClass}>מטבח</label>
            <select
              value={filters.kitchen || 'all'}
              onChange={(e) => updateFilter('kitchen', e.target.value)}
              className={inputClass}
            >
              <option value="all">הכל</option>
              <option value="upgraded">משופר</option>
              <option value="standard">סטנדרט</option>
            </select>
          </div>

          {/* Position */}
          <div>
            <label className={labelClass}>מיקום בבניין</label>
            <select
              value={filters.position || 'all'}
              onChange={(e) => updateFilter('position', e.target.value)}
              className={inputClass}
            >
              <option value="all">הכל</option>
              <option value="front">חזית</option>
              <option value="back">עורף</option>
              <option value="front-back">ח\ע</option>
              <option value="side">צד</option>
              <option value="corner">פינה</option>
            </select>
          </div>

          {/* Vacancy Date */}
          <div>
            <label className={labelClass}>תאריך פינוי</label>
            <input
              type="date"
              value={filters.vacancyDate || ''}
              onChange={(e) => updateFilter('vacancyDate', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Feature toggle chips */}
        <div className="mt-6 pt-5 border-t border-[#E4E8F2]">
          <div className="flex flex-wrap gap-2.5">
            {FEATURE_OPTIONS.map(({ key, label, icon: Icon }) => {
              const active = Boolean((filters.features as any)?.[key]);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleFeature(key)}
                  aria-pressed={active}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    active
                      ? 'bg-[#354AC4] text-white border-transparent shadow-sm'
                      : 'bg-[#EAF1FE] text-[#354AC4] border-[#dbe6fd] hover:bg-[#dce8fd]'
                  }`}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </FilterSection>

      {/* --- FILTER CONTROL BUTTONS --- */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-1">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-white text-[#354AC4] font-bold text-base rounded-2xl border border-[#E4E8F2] hover:bg-[#f5f7fb] transition-all duration-300"
        >
          אפס
        </button>
        <button
          onClick={onApply}
          className="px-8 py-3 bg-[#354AC4] hover:bg-[#28389B] text-white font-black text-base rounded-xl transition-colors duration-200"
        >
          החל פילטרים
        </button>
      </div>
    </div>
  );
};

export default PropertyFilters;
