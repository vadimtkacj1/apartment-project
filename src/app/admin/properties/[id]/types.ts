export interface PropertyForm {
  dealType: string;
  city: string;
  neighborhood: string;
  street: string;
  streetNumber: string;
  apartmentNumber: string;
  latitude: number | null;
  longitude: number | null;
  propertyType: string;
  floor: number;
  totalFloors: number;
  parking: string;
  position: string;
  furniture: string;
  directions: string[];
  kitchen: string;
  rooms: string;
  area: number;
  builtArea: number;
  balconySize: number | null;
  vacancyDate: string;
  hasAirConditioning: boolean;
  hasDisabledAccess: boolean;
  hasSunBalcony: boolean;
  hasStorage: boolean;
  hasSunroom: boolean;
  hasBoiler: boolean;
  hasSafeRoom: boolean;
  hasElevator: boolean;
  hasMamak: boolean;
  hasBars: boolean;
  hasPets: boolean;
  hasHousingUnit: boolean;
  hasShelter: boolean;
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  images: string[];
  status: string;
  location: string;
  // SEO overrides (optional — fall back to title/description/first image)
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  bedrooms: string;
  bathrooms: number;
  isActive: boolean;
  isSold: boolean;
  isPinned: boolean;
  // Note: isHotProposition and isNoCommission are managed only through Homepage settings
  // They are not editable in the property form
  isHotProposition?: boolean;
  isNoCommission?: boolean;
  agentIds?: string[]; // Format: ["owner-1", "team-2"]
}

export interface PropertyFormSectionProps {
  formData: PropertyForm;
  handleChange: (field: keyof PropertyForm, value: any) => void;
  errors?: Record<string, string>;
}
