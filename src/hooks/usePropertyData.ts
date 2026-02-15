import { useState, useEffect } from 'react';
import { ArrowUpFromLine, Maximize, LayoutDashboard, Wind } from 'lucide-react';
import { PropertyData } from '@/components/apartment-detail/types';
import { analytics } from '@/lib/analytics';

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

        // Map API data to component format
        const mappedProperty: PropertyData = {
          id: data.id,
          title: data.title,
          location: data.location,
          price: data.price,
          originalPrice: data.originalPrice,
          bedrooms: data.rooms,
          bathrooms: data.bathrooms,
          area: data.area,
          floor: data.floor,
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
          specs: [
            {
              label: "קומה",
              value: data.floor ? `${data.floor}` : "לא צוין",
              icon: ArrowUpFromLine
            },
            {
              label: 'גודל במ"ר',
              value: `${data.area}`,
              icon: Maximize
            },
            {
              label: "חדרים",
              value: `${data.rooms}`,
              icon: LayoutDashboard
            },
            {
              label: "כיווני אוויר",
              value: data.directions && data.directions.length > 0
                ? data.directions.join(', ')
                : "לא צוין",
              icon: Wind
            },
          ],
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
