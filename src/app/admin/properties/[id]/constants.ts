import { type MessagesShape } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import { PropertyForm } from './types';

/**
 * i18n consumption pattern for the property-form section components:
 *
 *   const t = useAdminMessages(propertyFormMessages);   // top level of the component
 *   <Select options={buildDealTypeOptions(t)} ... />    // locale-aware { value, label }[]
 *
 * All option labels live in src/lib/adminI18n/messages/propertyForm.ts under
 * `options.*`; the build*Options(t) helpers below turn the resolved messages
 * record into antd option arrays. ROOMS_OPTIONS is locale-neutral (numeric
 * labels) and is used directly.
 */

/** Resolved propertyForm messages record (either locale). */
export type PropertyFormT = MessagesShape<(typeof propertyFormMessages)['he']>;

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
  hasMamak: false,
  hasBars: false,
  hasPets: false,
  hasHousingUnit: false,
  hasShelter: false,
  title: '',
  description: '',
  price: '',
  originalPrice: '',
  images: [],
  status: '',
  location: '',
  metaTitle: '',
  metaDescription: '',
  ogImage: '',
  bedrooms: '3',
  bathrooms: 1,
  isActive: true,
  isSold: false,
  isPinned: false,
  agentIds: [],
};

export function buildDealTypeOptions(t: PropertyFormT) {
  return [
    { value: 'sale', label: t.options.dealType.sale },
    { value: 'rent', label: t.options.dealType.rent },
  ];
}

export function buildStatusOptions(t: PropertyFormT) {
  return [
    { value: '', label: t.options.status.none },
    { value: 'Exclusive', label: t.options.status.exclusive },
    { value: 'New', label: t.options.status.new },
    { value: 'Opportunity', label: t.options.status.opportunity },
  ];
}

export function buildPropertyTypeOptions(t: PropertyFormT) {
  return [
    { value: 'apartment', label: t.options.propertyType.apartment },
    { value: 'garden-apartment', label: t.options.propertyType.gardenApartment },
    { value: 'cottage', label: t.options.propertyType.cottage },
    { value: 'house', label: t.options.propertyType.house },
    { value: 'duplex', label: t.options.propertyType.duplex },
    { value: 'penthouse', label: t.options.propertyType.penthouse },
    { value: 'mini-penthouse', label: t.options.propertyType.miniPenthouse },
    { value: 'roof-apartment', label: t.options.propertyType.roofApartment },
    { value: 'housing-unit', label: t.options.propertyType.housingUnit },
    { value: 'studio', label: t.options.propertyType.studio },
    { value: 'basement-apartment', label: t.options.propertyType.basementApartment },
    { value: 'villa', label: t.options.propertyType.villa },
  ];
}

export function buildPositionOptions(t: PropertyFormT) {
  return [
    { value: 'front', label: t.options.position.front },
    { value: 'back', label: t.options.position.back },
    { value: 'front-back', label: t.options.position.frontBack },
    { value: 'side', label: t.options.position.side },
    { value: 'corner', label: t.options.position.corner },
  ];
}

export function buildFurnitureOptions(t: PropertyFormT) {
  return [
    { value: 'none', label: t.options.furniture.none },
    { value: 'partial', label: t.options.furniture.partial },
    { value: 'full', label: t.options.furniture.full },
  ];
}

export function buildKitchenOptions(t: PropertyFormT) {
  return [
    { value: 'standard', label: t.options.kitchen.standard },
    { value: 'upgraded', label: t.options.kitchen.upgraded },
  ];
}

export function buildParkingOptions(t: PropertyFormT) {
  return [
    { value: 'yes', label: t.options.parking.yes },
    { value: 'none', label: t.options.parking.none },
    { value: 'double', label: t.options.parking.double },
    { value: 'two-separate', label: t.options.parking.twoSeparate },
    { value: 'shared', label: t.options.parking.shared },
    // Legacy misspelled value kept for backward compatibility with stored data.
    { value: 'two-seperate', label: t.options.parking.twoSeparate },
    { value: 'covered', label: t.options.parking.covered },
    { value: 'three', label: t.options.parking.three },
    { value: 'robotic', label: t.options.parking.robotic },
    { value: 'multiplier', label: t.options.parking.multiplier },
  ];
}

export function buildDirectionOptions(t: PropertyFormT) {
  return [
    { label: t.options.direction.north, value: 'north' },
    { label: t.options.direction.south, value: 'south' },
    { label: t.options.direction.east, value: 'east' },
    { label: t.options.direction.west, value: 'west' },
  ];
}

/** Locale-neutral numeric labels — safe to use directly in any locale. */
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
