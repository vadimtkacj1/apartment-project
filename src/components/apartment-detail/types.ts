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
  propertyType?: string;
  parking?: string;
  position?: string;
  furniture?: string;
  kitchen?: string;
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
  };
  specs: Array<{ label: string; value: string; icon: any }>;
  description: string;
  directions?: string[];
  isSold?: boolean;
}

export interface ContactFormData {
  name: string;
  phone: string;
  message: string;
}
