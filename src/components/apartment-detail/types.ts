import { PropertyType, ParkingType, Position, FurnitureLevel, KitchenType, DealType } from '@/types/property.types';

export interface PropertyData {
  id: number;
  title: string;
  location: string;
  city?: string;
  street?: string;
  streetNumber?: string;
  neighborhood?: string;
  latitude?: number | null;
  longitude?: number | null;
  price: string;
  originalPrice?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  builtArea?: number | null;
  floor?: number;
  totalFloors?: number;
  buildingType?: string;
  availableFrom?: string;
  propertyType?: PropertyType;
  parking?: ParkingType;
  position?: Position;
  furniture?: FurnitureLevel;
  kitchen?: KitchenType;
  vacancyDate?: string | null;
  images: string[];
  amenities: {
    ac: boolean;
    handicap: boolean;
    solarHeater: boolean;
    storage: boolean;
    sunBalcony: boolean;
    boiler: boolean;
    mamad: boolean;
    elevator: boolean;
    mamak: boolean;
    bars: boolean;
    pets: boolean;
    housingUnit: boolean;
    shelter: boolean;
  };
  specs: Array<{ label: string; value: string; icon: any }>;
  description: string;
  directions?: string[];
  isSold?: boolean;
  dealType?: DealType;
  agents?: Array<{ id: number; name: string; phone?: string; whatsapp?: string }>;
  owners?: Array<{ id: number; name: string; phone?: string; whatsapp?: string }>;
}

export interface ContactFormData {
  name: string;
  phone: string;
  message: string;
}
