export interface PropertyData {
  id: number;
  title: string;
  location: string;
  price: string;
  originalPrice?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  totalFloors?: number;
  buildingType?: string;
  availableFrom?: string;
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
