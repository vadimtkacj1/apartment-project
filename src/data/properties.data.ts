import { FilterState } from '@/types/property.types';

/** * Type definitions for categorized navigation and sorting 
 */
export type Category = 'all' | 'sales' | 'rentals' | 'management' | 'land' | 'commercial';
export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc';

/** * Configuration for the category navigation bar 
 */
export const CATEGORIES = [
  { id: 'all', label: 'הכל', value: 'all' },
  { id: 'sales', label: 'מכירה', value: 'sales' },
  { id: 'rentals', label: 'השכרה', value: 'rentals' },
  { id: 'management', label: 'ניהול נכסים', value: 'management' },
  { id: 'land', label: 'קרקעות', value: 'land' },
  { id: 'commercial', label: 'מסחרי', value: 'commercial' }
] as const;

/** * Static dataset containing all property listings 
 */
export const PROPERTIES = [
  { id: 1, image: "/images/hero/sales.jpg", title: "Spacious 4-Room Apartment in Holon Center", location: "חולון", price: "1,950,000", bedrooms: 4, bathrooms: 2, area: 110, status: "Exclusive", category: "sales" },
  { id: 2, image: "/images/hero/rentals.webp", title: "Renovated 3-Room Apartment - For Rent", location: "בת ים", price: "5,500", bedrooms: 3, bathrooms: 1.5, area: 85, status: "New", category: "rentals" },
  { id: 3, image: "/images/hero/rent.png", title: "Luxury Penthouse with Roof Deck", location: "ראשון לציון", price: "3,200,000", bedrooms: 5, bathrooms: 3, area: 160, status: "Exclusive", category: "sales" },
  { id: 4, image: "/images/hero/sales.jpg", title: "2-Room Apartment, High Floor", location: "חולון", price: "4,200", bedrooms: 2, bathrooms: 1, area: 65, category: "rentals" },
  { id: 5, image: "/images/hero/rentals.webp", title: "Central Building Lot", location: "ראשון לציון", price: "2,800,000", bedrooms: 0, bathrooms: 0, area: 500, status: "Opportunity", category: "land" },
  { id: 6, image: "/images/hero/rent.png", title: "Commercial Warehouse + Offices", location: "בת ים", price: "15,000", bedrooms: 0, bathrooms: 2, area: 250, category: "commercial" },
  { id: 7, image: "/images/hero/sales.jpg", title: "5-Room Garden Apartment with Yard", location: "חולון", price: "2,450,000", bedrooms: 5, bathrooms: 2, area: 130, status: "New", category: "sales" },
  { id: 8, image: "/images/hero/rentals.webp", title: "Renovated 3.5-Room Apartment", location: "בת ים", price: "6,200", bedrooms: 3, bathrooms: 2, area: 92, category: "rentals" },
  { id: 9, image: "/images/hero/rent.png", title: "Spacious Duplex with Elevator", location: "ראשון לציון", price: "3,750,000", bedrooms: 6, bathrooms: 3, area: 180, status: "Exclusive", category: "sales" },
  { id: 10, image: "/images/hero/sales.jpg", title: "Designer Studio in Center", location: "חולון", price: "3,800", bedrooms: 1, bathrooms: 1, area: 42, status: "New", category: "rentals" },
  { id: 11, image: "/images/hero/rentals.webp", title: "4-Room Apartment with Sea View", location: "בת ים", price: "2,200,000", bedrooms: 4, bathrooms: 2, area: 105, category: "sales" },
  { id: 12, image: "/images/hero/rent.png", title: "Office for Rent in Central Location", location: "ראשון לציון", price: "8,500", bedrooms: 0, bathrooms: 2, area: 85, category: "commercial" },
  { id: 13, image: "/images/hero/sales.jpg", title: "3-Room Apartment, High Floor", location: "חולון", price: "1,680,000", bedrooms: 3, bathrooms: 1, area: 75, status: "Opportunity", category: "sales" },
  { id: 14, image: "/images/hero/rentals.webp", title: "Renovated 4.5-Room Apartment", location: "בת ים", price: "7,200", bedrooms: 4, bathrooms: 2, area: 115, status: "Exclusive", category: "rentals" },
  { id: 15, image: "/images/hero/rent.png", title: "Mini Penthouse with Large Roof", location: "ראשון לציון", price: "4,100,000", bedrooms: 5, bathrooms: 3, area: 155, category: "sales" },
  { id: 16, image: "/images/hero/sales.jpg", title: "Central 2.5-Room Apartment", location: "חולון", price: "4,900", bedrooms: 2, bathrooms: 1, area: 68, category: "rentals" },
  { id: 17, image: "/images/hero/rentals.webp", title: "Corner Building Lot", location: "בת ים", price: "3,200,000", bedrooms: 0, bathrooms: 0, area: 420, status: "New", category: "land" },
  { id: 18, image: "/images/hero/rent.png", title: "Commercial Shop on Main Street", location: "ראשון לציון", price: "18,000", bedrooms: 0, bathrooms: 1, area: 120, category: "commercial" },
  { id: 19, image: "/images/hero/sales.jpg", title: "5-Room Apartment with Sukkah Balcony", location: "חולון", price: "2,650,000", bedrooms: 5, bathrooms: 2, area: 125, category: "sales" },
  { id: 20, image: "/images/hero/rentals.webp", title: "New Contractor Apartment - 3 Rooms", location: "בת ים", price: "6,800", bedrooms: 3, bathrooms: 2, area: 88, status: "New", category: "rentals" },
  { id: 21, image: "/images/hero/rent.png", title: "Luxury 6-Room Apartment", location: "ראשון לציון", price: "4,850,000", bedrooms: 6, bathrooms: 3, area: 200, status: "Exclusive", category: "sales" },
  { id: 22, image: "/images/hero/sales.jpg", title: "Renovated 3.5-Room Apartment", location: "חולון", price: "5,400", bedrooms: 3, bathrooms: 1, area: 82, category: "rentals" },
  { id: 23, image: "/images/hero/rentals.webp", title: "7-Room Cottage with Pool", location: "בת ים", price: "5,500,000", bedrooms: 7, bathrooms: 4, area: 250, status: "Opportunity", category: "sales" },
  { id: 24, image: "/images/hero/rent.png", title: "Luxury Office in Business Tower", location: "ראשון לציון", price: "22,000", bedrooms: 0, bathrooms: 3, area: 180, status: "New", category: "commercial" },
  { id: 25, image: "/images/hero/sales.jpg", title: "4-Room Apartment with Sun Balcony", location: "חולון", price: "2,100,000", bedrooms: 4, bathrooms: 2, area: 98, category: "sales" },
  { id: 26, image: "/images/hero/rentals.webp", title: "2-Room Apartment near Sea", location: "בת ים", price: "5,200", bedrooms: 2, bathrooms: 1, area: 62, status: "New", category: "rentals" },
  { id: 27, image: "/images/hero/rent.png", title: "8-Room Duplex Penthouse", location: "ראשון לציון", price: "6,200,000", bedrooms: 8, bathrooms: 4, area: 280, status: "Exclusive", category: "sales" },
  { id: 28, image: "/images/hero/sales.jpg", title: "3-Room Apartment with Covered Parking", location: "חולון", price: "1,780,000", bedrooms: 3, bathrooms: 1, area: 72, category: "sales" },
  { id: 29, image: "/images/hero/rentals.webp", title: "5-Room Apartment for Large Family", location: "בת ים", price: "8,500", bedrooms: 5, bathrooms: 2, area: 135, category: "rentals" },
  { id: 30, image: "/images/hero/rent.png", title: "Commercial Complex with Shops", location: "ראשון לציון", price: "35,000", bedrooms: 0, bathrooms: 4, area: 450, status: "Opportunity", category: "commercial" }
];

/** * Business logic to filter the property list based on user selections 
 */
export const filterProperties = (properties: typeof PROPERTIES, selectedCategory: Category, filters: FilterState) => {
  return properties.filter(property => {
    // Top-level navigation category check
    if (selectedCategory !== 'all' && property.category !== selectedCategory) return false;
    
    // City selection mapping
    if (filters.city !== 'all') {
      const cityMap: Record<string, string> = {
        'holon': 'חולון',
        'batyam': 'בת ים',
        'rishon': 'ראשון לציון',
        'telaviv': 'תל אביב'
      };
      if (property.location !== cityMap[filters.city]) return false;
    }
    
    // Deal Type grouping (Sale vs Rent)
    if (filters.dealType !== 'all') {
      const isDealMatch = 
        (filters.dealType === 'sale' && (property.category === 'sales' || property.category === 'land')) ||
        (filters.dealType === 'rent' && (property.category === 'rentals' || property.category === 'commercial'));
      if (!isDealMatch) return false;
    }
    
    // Numerical range filtering (Rooms & Area)
    if (filters.minRooms && property.bedrooms < filters.minRooms) return false;
    if (filters.maxRooms && property.bedrooms > filters.maxRooms) return false;
    if (filters.minArea && property.area < filters.minArea) return false;
    if (filters.maxArea && property.area > filters.maxArea) return false;
    
    // Price parsing and range check
    const propertyPrice = parseInt(property.price.replace(/,/g, ''));
    if (filters.minPrice && propertyPrice < filters.minPrice) return false;
    if (filters.maxPrice && propertyPrice > filters.maxPrice) return false;
    
    return true;
  });
};