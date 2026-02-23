import { PropertyForm } from './types';

export const INITIAL_FORM: PropertyForm = {
  dealType: 'sale',
  city: 'holon',
  neighborhood: '',
  street: '',
  streetNumber: '',
  apartmentNumber: '',
  latitude: null,
  longitude: null,
  propertyType: 'apartment',
  floor: 0,
  totalFloors: 0,
  parking: 'none',
  position: 'front',
  furniture: 'none',
  directions: [],
  kitchen: 'standard',
  rooms: '3',
  area: 0,
  builtArea: 0,
  balconySize: null,
  vacancyDate: '',
  hasAirConditioning: false,
  hasDisabledAccess: false,
  hasSunBalcony: false,
  hasStorage: false,
  hasSunroom: false,
  hasBoiler: false,
  hasSafeRoom: false,
  hasElevator: false,
  title: '',
  description: '',
  price: '',
  originalPrice: '',
  images: [],
  status: '',
  location: '',
  bedrooms: '3',
  bathrooms: 1,
  isActive: true,
  isSold: false,
  isPinned: false,
  isHotProposition: false,
  isNoCommission: false,
};

export const DEAL_TYPE_OPTIONS = [
  { value: 'sale', label: 'מכירה' },
  { value: 'rent', label: 'השכרה' },
];

export const STATUS_OPTIONS = [
  { value: '', label: 'ללא' },
  { value: 'Exclusive', label: 'בלעדי' },
  { value: 'New', label: 'חדש' },
  { value: 'Opportunity', label: 'הזדמנות' },
];

export const CITY_OPTIONS = [
  { value: 'holon', label: 'חולון' },
  { value: 'batyam', label: 'בת ים' },
  { value: 'rishon', label: 'ראשון לציון' },
  { value: 'telaviv', label: 'תל אביב' },
];

export const PROPERTY_TYPE_OPTIONS = [
  { value: 'apartment', label: 'דירה' },
  { value: 'garden-apartment', label: 'דירת גן' },
  { value: 'cottage', label: "קוטג'" },
  { value: 'house', label: 'בית' },
  { value: 'duplex', label: 'דופלקס' },
  { value: 'penthouse', label: 'פנטהאוס' },
  { value: 'roof-apartment', label: 'דירת גג' },
  { value: 'housing-unit', label: 'יחידת דיור' },
  { value: 'studio', label: 'סטודיו' },
  { value: 'basement-apartment', label: 'דירת מרתף' },
  { value: 'villa', label: 'וילה' },
];

export const POSITION_OPTIONS = [
  { value: 'front', label: 'חזית' },
  { value: 'back', label: 'עורף' },
  { value: 'front-back', label: 'ח\\ע' },
  { value: 'side', label: 'צד' },
  { value: 'corner', label: 'פינה' },
];

export const FURNITURE_OPTIONS = [
  { value: 'none', label: 'ללא' },
  { value: 'partial', label: 'חלקי' },
  { value: 'full', label: 'מלא' },
];

export const KITCHEN_OPTIONS = [
  { value: 'standard', label: 'סטנדרט' },
  { value: 'upgraded', label: 'משודרג' },
];

export const PARKING_OPTIONS = [
  { value: 'yes', label: 'יש' },
  { value: 'none', label: 'אין' },
  { value: 'double', label: 'כפולה' },
  { value: 'shared', label: 'משותפת' },
  { value: 'covered', label: 'מקורה' },
  { value: 'three', label: 'שלוש' },
  { value: 'robotic', label: 'רובוטית' },
  { value: 'multiplier', label: 'מכפיל' },
];

export const DIRECTION_OPTIONS = [
  { label: 'צפון', value: 'north' },
  { label: 'דרום', value: 'south' },
  { label: 'מזרח', value: 'east' },
  { label: 'מערב', value: 'west' },
];

export const ROOMS_OPTIONS = [
  { value: '1', label: '1' },
  { value: '1.5', label: '1.5' },
  { value: '2', label: '2' },
  { value: '2.5', label: '2.5' },
  { value: '3', label: '3' },
  { value: '3.5', label: '3.5' },
  { value: '4', label: '4' },
  { value: '4.5', label: '4.5' },
  { value: '5', label: '5' },
  { value: '5.5', label: '5.5' },
  { value: '6', label: '6' },
  { value: '6+', label: '6+' },
];
