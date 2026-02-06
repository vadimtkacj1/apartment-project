// Property Types for Real Estate Application

export type DealType = 'sale' | 'rent';

export type City = 'holon' | 'batyam' | 'rishon' | 'telaviv' | 'all';

export type PropertyType = 
  | 'apartment'        // דירה
  | 'garden-apartment' // דירת גן
  | 'cottage'          // קוטג
  | 'house'            // בית
  | 'duplex'           // דופלקס
  | 'penthouse'        // פנטהאוס
  | 'rooftop'          // דירת גג
  | 'unit'             // יחידת דיור
  | 'divided'          // מחולקת
  | 'studio'           // סטודיו
  | 'basement'         // דירת מרתף
  | 'villa';           // וילה

export type ParkingType = 
  | 'none'      // אין
  | 'single'    // יש
  | 'double'    // כפולה
  | 'shared'    // משותפת
  | 'covered'   // מקורה
  | 'triple'    // שלוש
  | 'robotic'   // רובוטית
  | 'multiple'; // מכפיל

export type Position = 
  | 'front'        // חזית
  | 'back'         // עורף
  | 'front-back'   // ח\ע
  | 'side'         // צד
  | 'corner';      // פינה

export type FurnitureLevel = 
  | 'none'     // אין
  | 'partial'  // חלקי
  | 'full';    // מלא

export type Direction = 'north' | 'south' | 'east' | 'west';

export type KitchenType = 
  | 'upgraded'  // משופר
  | 'standard'; // סטנדרט

export interface PropertyFeatures {
  hasAirConditioning: boolean;  // מיזוג
  hasDisabledAccess: boolean;   // ג' לנכה
  hasSunBalcony: boolean;       // מ. שמש
  hasStorage: boolean;          // מחסן
  hasSunroom: boolean;          // מרפסת שמש
  hasBoiler: boolean;           // דוד
  hasSafeRoom: boolean;         // ממ"ד
  hasElevator: boolean;         // מעלית
}

export interface Property {
  id: number;
  dealType: DealType;           // מכירה / השכרה
  
  // Location
  city: City;                   // עיר
  neighborhood?: string;        // שכונה
  street?: string;              // רחוב
  streetNumber?: string;        // מס' רחוב
  apartmentNumber?: string;     // מס' דירה
  
  // Property Details
  propertyType: PropertyType;   // סוג הנכס
  floor?: number;               // קומה
  parking: ParkingType;         // חניה
  position?: Position;          // חזית / עורף
  furniture: FurnitureLevel;    // ריהוט
  directions: Direction[];      // כיוונים
  kitchen?: KitchenType;        // מטבח
  
  // Measurements
  rooms: number;                // מס' חדרים
  area: number;                 // מס' מטר מרובע
  builtArea?: number;           // מס' מטר מרובע בנוי
  
  // Additional Info
  vacancyDate?: string;         // תאריך פינוי
  features: PropertyFeatures;   // יש או אין
  
  // Display Info
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  images: string[];
  status?: string;
  location: string;             // Display location
  bedrooms: number;             // For compatibility
  bathrooms: number;            // For compatibility
}

export interface FilterState {
  dealType: DealType | 'all';
  city: City;
  neighborhood?: string;
  propertyType?: PropertyType | 'all';
  minRooms?: number;
  maxRooms?: number;
  minArea?: number;
  maxArea?: number;
  minPrice?: number;
  maxPrice?: number;
  parking?: ParkingType | 'all';
  furniture?: FurnitureLevel | 'all';
  floor?: number;
  position?: Position | 'all';
  kitchen?: KitchenType | 'all';
  directions?: Direction[];
  features?: Partial<PropertyFeatures>;
}
