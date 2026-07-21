'use client';

import { Card } from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Checkbox } from '@/components/shadcn/checkbox';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/shadcn/select';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import { PropertyFormSectionProps } from '../types';
import {
  buildPropertyTypeOptions,
  buildPositionOptions,
  buildFurnitureOptions,
  buildKitchenOptions,
  buildParkingOptions,
  buildDirectionOptions,
  ROOMS_OPTIONS,
} from '../constants';

export function PropertyDetailsSection({ formData, handleChange, errors }: PropertyFormSectionProps) {
  const t = useAdminMessages(propertyFormMessages);

  const directions = formData.directions ?? [];
  const toggleDirection = (value: string, checked: boolean) => {
    const next = checked
      ? [...directions, value]
      : directions.filter((v) => v !== value);
    handleChange('directions', next);
  };

  return (
    <Card className="mb-4 p-5">
      <h3 className="mb-4 text-base font-semibold text-foreground">{t.details.cardTitle}</h3>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Label className="mb-1.5 block">{t.details.propertyTypeLabel}</Label>
          <Select value={formData.propertyType} onValueChange={(v) => handleChange('propertyType', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {buildPropertyTypeOptions(t).map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 block">{t.details.positionLabel}</Label>
          <Select value={formData.position} onValueChange={(v) => handleChange('position', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {buildPositionOptions(t).map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 block">{t.details.furnitureLabel}</Label>
          <Select value={formData.furniture} onValueChange={(v) => handleChange('furniture', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {buildFurnitureOptions(t).map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 block">{t.details.kitchenLabel}</Label>
          <Select value={formData.kitchen} onValueChange={(v) => handleChange('kitchen', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {buildKitchenOptions(t).map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <Label className="mb-1.5 block">{t.details.floorLabel}</Label>
          <Input
            type="number"
            value={formData.floor ?? ''}
            onChange={(e) => handleChange('floor', Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label className="mb-1.5 block">{t.details.totalFloorsLabel}</Label>
          <Input
            type="number"
            value={formData.totalFloors ?? ''}
            onChange={(e) => handleChange('totalFloors', Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label className="mb-1.5 block">{t.details.parkingLabel}</Label>
          <Select value={formData.parking} onValueChange={(v) => handleChange('parking', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {buildParkingOptions(t).map((o, i) => (
                <SelectItem key={`${o.value}-${i}`} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div id="field-rooms">
          <Label className="mb-1.5 block">
            {t.details.roomsLabel} <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.rooms}
            onValueChange={(v) => {
              handleChange('rooms', v);
              handleChange('bedrooms', v);
            }}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ROOMS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.rooms && <p className="mt-1 text-sm text-destructive">{errors.rooms}</p>}
        </div>
        <div>
          <Label className="mb-1.5 block">{t.details.bathroomsLabel}</Label>
          <Input
            type="number"
            min={1}
            value={formData.bathrooms ?? ''}
            onChange={(e) => handleChange('bathrooms', Number(e.target.value) || 1)}
          />
        </div>
        <div id="field-area">
          <Label className="mb-1.5 block">
            {t.details.areaLabel} <span className="text-destructive">*</span>
          </Label>
          <Input
            type="number"
            min={0}
            value={formData.area ?? ''}
            onChange={(e) => handleChange('area', Number(e.target.value) || 0)}
          />
          {errors?.area && <p className="mt-1 text-sm text-destructive">{errors.area}</p>}
        </div>
        <div>
          <Label className="mb-1.5 block">{t.details.builtAreaLabel}</Label>
          <Input
            type="number"
            min={0}
            value={formData.builtArea ?? ''}
            onChange={(e) => handleChange('builtArea', Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label className="mb-1.5 block">{t.details.balconySizeLabel}</Label>
          <Input
            type="number"
            min={0}
            value={formData.balconySize ?? ''}
            onChange={(e) => handleChange('balconySize', Number(e.target.value) || null)}
          />
        </div>
      </div>

      <div>
        <Label className="mb-2 block">{t.details.directionsLabel}</Label>
        <div className="flex flex-wrap gap-4">
          {buildDirectionOptions(t).map((o) => (
            <label key={o.value} className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={directions.includes(o.value)}
                onCheckedChange={(c) => toggleDirection(o.value, c === true)}
              />
              <span className="text-sm">{o.label}</span>
            </label>
          ))}
        </div>
      </div>
    </Card>
  );
}
