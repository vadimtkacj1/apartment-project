import { useState, useEffect } from 'react';
import { ArrowUpFromLine, Maximize, LayoutDashboard, Wind, Home, Car, MapPin, Calendar, UtensilsCrossed } from 'lucide-react';
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
    'penthouse': 'נטהאוס',
    'rooftop': 'דירת גג',
    'unit': 'יחידת דיור',
    'studio': 'סטודיו',
    'basement': 'דירת מרתף',
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
    'standard': 'סטנדרטי'
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
            value: `${data.floor}`,
            icon: ArrowUpFromLine
          });
        }

        specs.push({
          label: 'גודל במ"ר',
          value: `${data.area}`,
          icon: Maximize
        });

        if (data.builtArea) {
          specs.push({
            label: 'שטח בנוי במ"ר',
            value: `${data.builtArea}`,
            icon: Maximize
          });
        }

        specs.push({
          label: "חדרים",
          value: `${data.rooms}`,
          icon: LayoutDashboard
        });

        if (data.bathrooms) {
          specs.push({
            label: "חדרי רחצה",
            value: `${data.bathrooms}`,
            icon: LayoutDashboard
          });
        }

        if (data.propertyType) {
          specs.push({
            label: "סוג נכס",
            value: getPropertyTypeLabel(data.propertyType),
            icon: Home
          });
        }

        if (data.parking) {
          specs.push({
            label: "חניה",
            value: getParkingLabel(data.parking),
            icon: Car
          });
        }

        if (data.position) {
          specs.push({
            label: "מיקום בבניין",
            value: getPositionLabel(data.position),
            icon: MapPin
          });
        }

        if (data.furniture) {
          specs.push({
            label: "ריהוט",
            value: getFurnitureLabel(data.furniture),
            icon: Home
          });
        }

        if (data.kitchen) {
          specs.push({
            label: "מטבח",
            value: getKitchenLabel(data.kitchen),
            icon: UtensilsCrossed
          });
        }

        if (data.vacancyDate) {
          specs.push({
            label: "תאריך פינוי",
            value: data.vacancyDate,
            icon: Calendar
          });
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
          propertyType: data.propertyType,
          parking: data.parking,
          position: data.position,
          furniture: data.furniture,
          kitchen: data.kitchen,
          vacancyDate: data.vacancyDate,
          images: data.images && data.images.length > 0 ? data.images : ["/images/hero/sales.jpg"],
          description: data.description || 'אין תיאור זמין',
          isSold: data.isSold || false,
          amenities: {
            ac: data.hasAirConditioning || false,
            handicap: data.hasDisabledAccess || false,
            solarHeater: false, // Not in DB, keeping for compatibility
            storage: data.hasStorage || false,
            sunBalcony: data.hasSunBalcony || false,
            boiler: data.hasBoiler || false,
            mamad: data.hasSafeRoom || false,
            elevator: data.hasElevator || false,
          },
          specs,
          directions: data.directions || [],
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
