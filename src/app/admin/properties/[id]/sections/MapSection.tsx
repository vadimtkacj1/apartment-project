'use client';

import { MapPin, Info, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/shadcn/alert';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/shadcn/tooltip';
import LocationPicker from '@/components/admin/LocationPicker';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import { PropertyForm } from '../types';

interface MapSectionProps {
  formData: PropertyForm;
  handleChange: (field: keyof PropertyForm, value: any) => void;
  onAddressChange: (address: any) => void;
}

export function MapSection({ formData, handleChange, onAddressChange }: MapSectionProps) {
  const t = useAdminMessages(propertyFormMessages);
  const hasCoordinates = formData.latitude && formData.longitude;

  return (
    <Card className="mb-4 p-5">
      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
        <MapPin className="size-4" />
        {t.map.cardTitle}
      </h3>

      <Alert variant="info" className="mb-5">
        <Info className="size-4" />
        <AlertTitle>{t.map.helpTitle}</AlertTitle>
        <AlertDescription>
          <div className="flex flex-col gap-1">
            <span>{t.map.helpEnterAddress}</span>
            <span>{t.map.helpClickMap}</span>
            <span>{t.map.helpDragMarker}</span>
            <span>{t.map.helpManualEntry}</span>
          </div>
        </AlertDescription>
      </Alert>

      <LocationPicker
        position={
          hasCoordinates
            ? { lat: formData.latitude!, lng: formData.longitude! }
            : null
        }
        onPositionChange={(position) => {
          handleChange('latitude', position.lat);
          handleChange('longitude', position.lng);
        }}
        onAddressChange={onAddressChange}
      />

      {/* Manual Coordinate Input */}
      <div className="mt-6">
        <h5 className="mb-4 text-base font-semibold text-foreground">{t.map.manualTitle}</h5>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="mb-1.5 flex items-center gap-1">
              <Label>{t.map.latitudeLabel}</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-muted-foreground" aria-label={t.map.latitudeLabel}>
                    <Info className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{t.map.latitudeTooltip}</TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              placeholder="32.0853"
              step="0.000001"
              min={-90}
              max={90}
              value={formData.latitude ?? ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!Number.isNaN(value)) {
                  handleChange('latitude', value);
                }
              }}
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-1">
              <Label>{t.map.longitudeLabel}</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-muted-foreground" aria-label={t.map.longitudeLabel}>
                    <Info className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{t.map.longitudeTooltip}</TooltipContent>
              </Tooltip>
            </div>
            <Input
              type="number"
              placeholder="34.7818"
              step="0.000001"
              min={-180}
              max={180}
              value={formData.longitude ?? ''}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (!Number.isNaN(value)) {
                  handleChange('longitude', value);
                }
              }}
            />
          </div>
        </div>

        {hasCoordinates && (
          <Alert className="mt-3">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <AlertTitle>{t.map.savedTitle}</AlertTitle>
            <AlertDescription>
              {t.map.savedDescription(
                formData.latitude?.toFixed(6) ?? '',
                formData.longitude?.toFixed(6) ?? '',
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
}
