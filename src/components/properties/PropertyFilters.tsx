"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { FilterState } from '@/types/property.types';

interface PropertyFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFiltersChange,
  onApply,
  onReset
}) => {
  // State to manage the expansion of advanced filters
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg" dir="rtl">
      
      {/* --- BASIC FILTERS (Always Visible) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Filter: Deal Type */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
            סוג עסקה
          </label>
          <select
            value={filters.dealType}
            onChange={(e) => updateFilter('dealType', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
          >
            <option value="all">הכל</option>
            <option value="sale">מכירה</option>
            <option value="rent">השכרה</option>
          </select>
        </div>

        {/* Filter: City */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
            עיר
          </label>
          <select
            value={filters.city}
            onChange={(e) => updateFilter('city', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
          >
            <option value="all">הכל</option>
            <option value="holon">חולון</option>
            <option value="batyam">בת ים</option>
            <option value="rishon">ראשון לציון</option>
            <option value="telaviv">תל אביב</option>
          </select>
        </div>

        {/* Filter: Property Type */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
            סוג הנכס
          </label>
          <select
            value={filters.propertyType || 'all'}
            onChange={(e) => updateFilter('propertyType', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
          >
            <option value="all">הכל</option>
            <option value="apartment">דירה</option>
            <option value="garden-apartment">דירת גן</option>
            <option value="cottage">קוטג׳</option>
            <option value="house">בית</option>
            <option value="duplex">דופלקס</option>
            <option value="penthouse">פנטהאוס</option>
            <option value="rooftop">דירת גג</option>
            <option value="unit">יחידת דיור</option>
            <option value="divided">מחולקת</option>
            <option value="studio">סטודיו</option>
            <option value="basement">דירת מרתף</option>
            <option value="villa">וילה</option>
          </select>
        </div>

         {/* Filter: Rooms (Min/Max combined in one block for layout efficiency) */}
         <div className="flex gap-2">
            <div className="w-1/2">
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                    חדרים (מ-)
                </label>
                <input
                    type="number"
                    value={filters.minRooms || ''}
                    onChange={(e) => updateFilter('minRooms', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="מ-"
                    step="0.5"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                />
            </div>
            <div className="w-1/2">
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                    (עד-)
                </label>
                <input
                    type="number"
                    value={filters.maxRooms || ''}
                    onChange={(e) => updateFilter('maxRooms', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="עד"
                    step="0.5"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                />
            </div>
        </div>
      </div>

      {/* --- ADVANCED FILTERS (Collapsible) --- */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 pt-6 border-t-2 border-gray-100">
                
                {/* Neighborhood */}
                <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                    שכונה
                </label>
                <input
                    type="text"
                    value={filters.neighborhood || ''}
                    onChange={(e) => updateFilter('neighborhood', e.target.value)}
                    placeholder="הזן שכונה"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                />
                </div>

                {/* Price Range */}
                <div className="flex gap-2">
                    <div className="w-1/2">
                        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                        מחיר (מ-)
                        </label>
                        <input
                        type="number"
                        value={filters.minPrice || ''}
                        onChange={(e) => updateFilter('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="₪"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                        (עד-)
                        </label>
                        <input
                        type="number"
                        value={filters.maxPrice || ''}
                        onChange={(e) => updateFilter('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="₪"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Area Range */}
                <div className="flex gap-2">
                    <div className="w-1/2">
                        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                        מ״ר (מ-)
                        </label>
                        <input
                        type="number"
                        value={filters.minArea || ''}
                        onChange={(e) => updateFilter('minArea', e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="מ״ר"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                        (עד-)
                        </label>
                        <input
                        type="number"
                        value={filters.maxArea || ''}
                        onChange={(e) => updateFilter('maxArea', e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="מ״ר"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Floor */}
                <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                    קומה
                </label>
                <input
                    type="number"
                    value={filters.floor || ''}
                    onChange={(e) => updateFilter('floor', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="מספר קומה"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                />
                </div>

                {/* Parking */}
                <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                    חניה
                </label>
                <select
                    value={filters.parking || 'all'}
                    onChange={(e) => updateFilter('parking', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                >
                    <option value="all">הכל</option>
                    <option value="single">יש</option>
                    <option value="none">אין</option>
                    <option value="double">כפולה</option>
                    <option value="shared">משותפת</option>
                    <option value="covered">מקורה</option>
                    <option value="triple">שלוש</option>
                    <option value="robotic">רובוטית</option>
                    <option value="multiple">מכפיל</option>
                </select>
                </div>

                {/* Furniture */}
                <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                    ריהוט
                </label>
                <select
                    value={filters.furniture || 'all'}
                    onChange={(e) => updateFilter('furniture', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                >
                    <option value="all">הכל</option>
                    <option value="none">אין</option>
                    <option value="partial">חלקי</option>
                    <option value="full">מלא</option>
                </select>
                </div>

                 {/* Kitchen */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                    מטבח
                  </label>
                  <select
                    value={filters.kitchen || 'all'}
                    onChange={(e) => updateFilter('kitchen', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                  >
                    <option value="all">הכל</option>
                    <option value="upgraded">משופר</option>
                    <option value="standard">סטנדרט</option>
                  </select>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                    מיקום בבניין
                  </label>
                  <select
                    value={filters.position || 'all'}
                    onChange={(e) => updateFilter('position', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                  >
                    <option value="all">הכל</option>
                    <option value="front">חזית</option>
                    <option value="back">עורף</option>
                    <option value="front-back">ח\ע</option>
                    <option value="side">צד</option>
                    <option value="corner">פינה</option>
                  </select>
                </div>

                {/* Additional Text Inputs */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                    רחוב
                  </label>
                  <input
                    type="text"
                    placeholder="שם הרחוב"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                    תאריך פינוי
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                  />
                </div>

            </div>

             {/* Directions & Features Checkboxes */}
             <div className="mt-6 pt-6 border-t-2 border-gray-200">
                 <h3 className="text-lg font-black text-gray-900 mb-4 uppercase">מאפיינים נוספים</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.features?.hasAirConditioning || false}
                          onChange={() => toggleFeature('hasAirConditioning')}
                          className="w-5 h-5 rounded border-2 border-gray-300 text-[#C19A6B] focus:ring-[#C19A6B]"
                        />
                        <span className="text-sm font-semibold text-gray-700">מיזוג</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.features?.hasElevator || false}
                          onChange={() => toggleFeature('hasElevator')}
                          className="w-5 h-5 rounded border-2 border-gray-300 text-[#C19A6B] focus:ring-[#C19A6B]"
                        />
                        <span className="text-sm font-semibold text-gray-700">מעלית</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.features?.hasSunBalcony || false}
                          onChange={() => toggleFeature('hasSunBalcony')}
                          className="w-5 h-5 rounded border-2 border-gray-300 text-[#C19A6B] focus:ring-[#C19A6B]"
                        />
                        <span className="text-sm font-semibold text-gray-700">מ. שמש</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.features?.hasSafeRoom || false}
                          onChange={() => toggleFeature('hasSafeRoom')}
                          className="w-5 h-5 rounded border-2 border-gray-300 text-[#C19A6B] focus:ring-[#C19A6B]"
                        />
                        <span className="text-sm font-semibold text-gray-700">ממ״ד</span>
                      </label>
                       <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.features?.hasStorage || false}
                          onChange={() => toggleFeature('hasStorage')}
                          className="w-5 h-5 rounded border-2 border-gray-300 text-[#C19A6B] focus:ring-[#C19A6B]"
                        />
                        <span className="text-sm font-semibold text-gray-700">מחסן</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.features?.hasDisabledAccess || false}
                          onChange={() => toggleFeature('hasDisabledAccess')}
                          className="w-5 h-5 rounded border-2 border-gray-300 text-[#C19A6B] focus:ring-[#C19A6B]"
                        />
                        <span className="text-sm font-semibold text-gray-700">גישה לנכים</span>
                      </label>
                 </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FILTER CONTROL BUTTONS --- */}
      <div className="mt-6 flex flex-col md:flex-row gap-4 pt-4 border-t-2 border-gray-100">
        
        {/* Toggle Advanced Filters Button */}
        <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center gap-2 text-gray-600 font-bold hover:text-[#C19A6B] transition-colors"
        >
            {isExpanded ? (
                <>
                    <ChevronUp size={20} />
                    <span>פחות סינונים</span>
                </>
            ) : (
                <>
                    <ChevronDown size={20} />
                    <span>חיפוש מתקדם</span>
                </>
            )}
        </button>

        {/* Action Buttons (Apply / Reset) */}
        <div className="flex-1 flex gap-3 justify-end">
            <button
            onClick={onReset}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold text-base uppercase rounded-xl hover:bg-gray-200 transition-all duration-300"
            >
            אפס
            </button>
            <button
            onClick={onApply}
            className="px-8 py-3 bg-[#C19A6B] text-white font-black text-base uppercase rounded-xl hover:bg-gray-900 transition-all duration-300 shadow-lg"
            >
            החל פילטרים
            </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;