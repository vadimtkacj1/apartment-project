import { useState, useEffect } from 'react';
import { ArrowUpFromLine, Maximize, LayoutDashboard, Wind, Home, Car, MapPin, Calendar, UtensilsCrossed, Sun } from 'lucide-react';
import { PropertyData } from '@/components/apartment-detail/types';
import { analytics } from '@/lib/analytics';

// Helper functions for Hebrew localization
const getPropertyTypeLabel = (type?: string) => {
  const labels: Record<string, string> = {
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
  return type ? labels[type] || type : '';
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
    'multiple': 'מכפיל',
    'yes': 'יש'
  };
  return parkingType ? labels[parkingType] || parkingType : 'לא צוין';
};

const getPositionLabel = (pos?: string) => {
  const labels: Record<string, string> = {
    'front': 'חזית',
    'back': 'עורף',
    'front-back': 'ח/ע',
    'side': 'צד',
    'corner': 'פינה'
  };
  return pos ? labels[pos] || pos : '';
};

const getFurnitureLabel = (furn?: string) => {
  const labels: Record<string, string> = {
    'none': 'אין',
    'partial': 'חלקי',
    'full': 'מלא'
  };
  return furn ? labels[furn] || furn : '';
};

const getKitchenLabel = (kitchen?: string) => {
  const labels: Record<string, string> = {
    'upgraded': 'משודרג',
    'standard': 'סטנדרט'
  };
  return kitchen ? labels[kitchen] || kitchen : '';
};

const getDirectionLabel = (dir: string) => {
  // Normalize input: trim and convert to lowercase
  const normalized = dir.trim().toLowerCase();
  
  const labels: Record<string, string> = {
    'north': 'צפון',
    'south': 'דרום',
    'east': 'מזרח',
    'west': 'מערב',
    // Handle Hebrew input as well (in case it's already in Hebrew)
    'צפון': 'צפון',
    'דרום': 'דרום',
    'מזרח': 'מזרח',
    'מערב': 'מערב'
  };
  
  return labels[normalized] || dir;
};

export function usePropertyData(propertyId: string) {
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${propertyId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }

        const data = await response.json();

        // Build specs array with all available data
        const specs: Array<{ label: string; value: string; icon: any }> = [];

        if (data.floor !== null && data.floor !== undefined) {
          specs.push({
            label: "קומה",
            value: (data.totalFloors !== null && data.totalFloors !== undefined && data.totalFloors > 0)
              ? `${data.floor} מתוך ${data.totalFloors}`
              : `${data.floor}`,
            icon: ArrowUpFromLine
          });
        }

        specs.push({
          label: 'גודל במ"ר',
          value: `${data.area}`,
          icon: Maximize
        });

        if (data.builtArea !== null && data.builtArea !== undefined && data.builtArea > 0) {
          specs.push({
            label: 'שטח בנוי במ"ר',
            value: `${data.builtArea}`,
            icon: Maximize
          });
        }

        if (data.balconySize !== null && data.balconySize !== undefined && data.balconySize > 0) {
          specs.push({
            label: 'גודל מרפסת שמש (מ״ר)',
            value: `${data.balconySize}`,
            icon: Sun
          });
        }

        specs.push({
          label: "חדרים",
          value: `${data.rooms}`,
          icon: LayoutDashboard
        });

        if (data.bathrooms !== null && data.bathrooms !== undefined && data.bathrooms > 0) {
          specs.push({
            label: "חדרי רחצה",
            value: `${data.bathrooms}`,
            icon: LayoutDashboard
          });
        }

        if (data.propertyType !== null && data.propertyType !== undefined && data.propertyType !== '') {
          specs.push({
            label: "סוג נכס",
            value: getPropertyTypeLabel(data.propertyType),
            icon: Home
          });
        }

        if (data.parking !== null && data.parking !== undefined && data.parking !== '') {
          specs.push({
            label: "חניה",
            value: getParkingLabel(data.parking),
            icon: Car
          });
        }

        if (data.position !== null && data.position !== undefined && data.position !== '') {
          specs.push({
            label: "מיקום בבניין",
            value: getPositionLabel(data.position),
            icon: MapPin
          });
        }

        if (data.furniture !== null && data.furniture !== undefined && data.furniture !== '') {
          specs.push({
            label: "ריהוט",
            value: getFurnitureLabel(data.furniture),
            icon: Home
          });
        }

        if (data.kitchen !== null && data.kitchen !== undefined && data.kitchen !== '') {
          specs.push({
            label: "מטבח",
            value: getKitchenLabel(data.kitchen),
            icon: UtensilsCrossed
          });
        }

        // Always show vacancy date if it exists (even if empty string, check for null/undefined)
        if (data.vacancyDate !== null && data.vacancyDate !== undefined && typeof data.vacancyDate === 'string' && data.vacancyDate.trim() !== '') {
          const trimmedDate = data.vacancyDate.trim();
          
          // Check if it's "מיד" (immediately) or "גמיש" (flexible)
          if (trimmedDate === 'מיד' || trimmedDate === 'immediately') {
            specs.push({
              label: "תאריך פינוי",
              value: 'מיד',
              icon: Calendar
            });
          } else if (trimmedDate === 'גמיש' || trimmedDate === 'flexible') {
            specs.push({
              label: "תאריך פינוי",
              value: 'גמיש',
              icon: Calendar
            });
          } else {
            // Format date from ISO string or DD/MM/YYYY to DD/MM/YYYY
            let formattedDate = trimmedDate;
            try {
              // Check if it's an ISO date string (contains T or ends with Z)
              if (formattedDate.includes('T') || formattedDate.endsWith('Z')) {
                const date = new Date(formattedDate);
                if (!isNaN(date.getTime())) {
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = date.getFullYear();
                  formattedDate = `${day}/${month}/${year}`;
                }
              } else if (formattedDate.includes('/')) {
                // Already in DD/MM/YYYY format, use as is
                formattedDate = formattedDate;
              } else {
                // Try to parse as date and format
                const date = new Date(formattedDate);
                if (!isNaN(date.getTime())) {
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = date.getFullYear();
                  formattedDate = `${day}/${month}/${year}`;
                }
              }
            } catch (e) {
              // If parsing fails, use original value
              console.warn('Failed to format date:', data.vacancyDate, e);
            }
            
            specs.push({
              label: "תאריך פינוי",
              value: formattedDate,
              icon: Calendar
            });
          }
        }

        if (data.directions && data.directions.length > 0) {
          // Ensure directions is an array and map each direction to Hebrew
          const directionsArray = Array.isArray(data.directions) 
            ? data.directions 
            : typeof data.directions === 'string' 
              ? data.directions.split(',').map((d: string) => d.trim())
              : [];
          
          const directionsLabels = directionsArray
            .filter((d: string) => d && d.trim())
            .map((d: string) => getDirectionLabel(d));
          
          if (directionsLabels.length > 0) {
            specs.push({
              label: "כיווני אוויר",
              value: directionsLabels.join(', '),
              icon: Wind
            });
          }
        }

        // Map API data to component format
        const mappedProperty: PropertyData = {
          id: data.id,
          title: data.title,
          location: data.location,
          city: data.city,
          street: data.street,
          streetNumber: data.streetNumber,
          neighborhood: data.neighborhood,
          latitude: data.latitude,
          longitude: data.longitude,
          price: data.price,
          originalPrice: data.originalPrice,
          bedrooms: data.rooms,
          bathrooms: data.bathrooms,
          area: data.area,
          builtArea: data.builtArea,
          floor: data.floor,
          totalFloors: data.totalFloors,
          propertyType: data.propertyType,
          parking: data.parking,
          position: data.position,
          furniture: data.furniture,
          kitchen: data.kitchen,
          vacancyDate: data.vacancyDate,
          images: data.images && data.images.length > 0 ? data.images : ["/images/hero/sales.jpg"],
          description: data.description || 'אין תיאור זמין',
          isSold: data.isSold || false,
          dealType: data.dealType,
          amenities: {
            ac: data.hasAirConditioning || false,
            handicap: data.hasDisabledAccess || false,
            solarHeater: data.hasSunroom || false,
            storage: data.hasStorage || false,
            sunBalcony: data.hasSunBalcony || false,
            boiler: data.hasBoiler || false,
            mamad: data.hasSafeRoom || false,
            elevator: data.hasElevator || false,
            mamak: data.hasMamak || false,
            bars: data.hasBars || false,
            pets: data.hasPets || false,
            housingUnit: data.hasHousingUnit || false,
            shelter: data.hasShelter || false,
          },
          specs,
          directions: data.directions || [],
          agents: data.agents || [],
          owners: data.owners || [],
        };

        setProperty(mappedProperty);
        setError(null);

        // Track property view
        analytics.trackPropertyView(propertyId);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('שגיאה בטעינת הנכס');
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  return { property, loading, error };
}
