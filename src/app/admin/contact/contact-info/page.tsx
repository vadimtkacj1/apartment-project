'use client';

import React, { useState, useEffect } from 'react';
import { Save, Info, Loader2 } from 'lucide-react';
import LocationPicker from '@/components/admin/LocationPicker';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { toast } from '@/components/shadcn/sonner';
import { Card, CardTitle } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import {
  Tooltip, TooltipTrigger, TooltipContent,
} from '@/components/shadcn/tooltip';
import { cn } from '@/lib/utils';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import { useAdminMessages } from '@/lib/adminI18n';
import { contactMessages } from '@/lib/adminI18n/messages/contact';

interface ContactInfoForm {
  phone: string;
  phoneName?: string;
  phone2?: string;
  phoneName2?: string;
  email: string;
  email2?: string;
  whatsapp?: string;
  whatsappName?: string;
  whatsapp2?: string;
  whatsappName2?: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  weekdayHours: string;
  fridayHours: string;
  facebook: string;
  facebookName?: string;
  facebook2?: string;
  facebookName2?: string;
  instagram: string;
  instagramName?: string;
  instagram2?: string;
  instagramName2?: string;
  linkedin: string;
}

const INITIAL_FORM: Omit<ContactInfoForm, 'weekdayHours' | 'fridayHours'> = {
  phone: '',
  phoneName: '',
  phone2: '',
  phoneName2: '',
  email: '',
  email2: '',
  whatsapp: '',
  whatsappName: '',
  whatsapp2: '',
  whatsappName2: '',
  address: '',
  city: '',
  latitude: null,
  longitude: null,
  facebook: '',
  facebookName: '',
  facebook2: '',
  facebookName2: '',
  instagram: '',
  instagramName: '',
  instagram2: '',
  instagramName2: '',
  linkedin: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Module scope so the components keep a stable identity across renders
// (defining them inside the page remounts every field on each keystroke).
const FieldLabel = ({
  htmlFor,
  tooltip,
  tooltipAriaLabel,
  required,
  children,
}: {
  htmlFor?: string;
  tooltip?: string;
  tooltipAriaLabel?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <Label htmlFor={htmlFor} className="flex items-center gap-1.5">
    <span>
      {children}
      {required && <span className="ms-0.5 text-destructive">*</span>}
    </span>
    {tooltip && (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            tabIndex={-1}
            aria-label={tooltipAriaLabel}
            className="inline-flex text-muted-foreground hover:text-foreground"
          >
            <Info className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    )}
  </Label>
);

const SectionCard = ({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card className="mb-4 p-5">
    <div className="mb-4 border-b border-border pb-3">
      <CardTitle className="text-base font-semibold">{title}</CardTitle>
    </div>
    <div className="space-y-4">{children}</div>
  </Card>
);

export default function ContactInfoPage() {
  const t = useAdminMessages(contactMessages);
  const [values, setValues] = useState<ContactInfoForm>(() => ({
    ...INITIAL_FORM,
    weekdayHours: t.weekdayHoursExample,
    fridayHours: t.fridayHoursExample,
  }));
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInfoForm, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mapPosition, setMapPosition] = useState<{ lat: number; lng: number } | null>(null);
  // Track unsaved edits so we can warn before the user navigates away / closes the tab.
  const [dirty, setDirty] = useState(false);
  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/admin/contact-info');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          // Merge only the known form fields (ignore server-only keys like id/links).
          setValues((prev) => {
            const next: ContactInfoForm = { ...prev };
            const target = next as unknown as Record<string, unknown>;
            for (const key of Object.keys(prev)) {
              if (data[key] !== undefined) {
                target[key] = data[key];
              }
            }
            return next;
          });
          // Update map position if coordinates exist
          if (data.latitude && data.longitude) {
            setMapPosition({ lat: data.latitude, lng: data.longitude });
          }
        }
      }
    } catch (err) {
      console.error('Error fetching contact info:', err);
      toast.error(t.loadError);
    } finally {
      setLoading(false);
    }
  };

  const setField = (name: keyof ContactInfoForm, value: string | number | null) => {
    setValues((v) => ({ ...v, [name]: value }));
    setDirty(true);
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  };

  const validate = (): Partial<Record<keyof ContactInfoForm, string>> => {
    const e: Partial<Record<keyof ContactInfoForm, string>> = {};
    if (!values.phone?.trim()) e.phone = t.phoneRequired;
    if (!values.email?.trim()) e.email = t.emailRequired;
    else if (!EMAIL_RE.test(values.email)) e.email = t.emailInvalid;
    if (values.email2 && !EMAIL_RE.test(values.email2)) e.email2 = t.emailInvalid;
    if (!values.address?.trim()) e.address = t.addressRequired;
    if (!values.city?.trim()) e.city = t.cityRequired;
    if (!values.weekdayHours?.trim()) e.weekdayHours = t.hoursRequired;
    if (!values.fridayHours?.trim()) e.fridayHours = t.hoursRequired;
    return e;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSaving(true);

    try {
      // Auto-generate links
      const phoneNumber = values.phone.replace(/\D/g, '');
      const phoneLink = `tel:${phoneNumber}`;
      const phone2Number = values.phone2 ? values.phone2.replace(/\D/g, '') : '';
      const phoneLink2 = phone2Number ? `tel:${phone2Number}` : '';
      const emailLink = `mailto:${values.email}`;
      const emailLink2 = values.email2 ? `mailto:${values.email2}` : '';
      const mapUrl = values.latitude && values.longitude
        ? `https://www.google.com/maps?q=${values.latitude},${values.longitude}`
        : '';

      // Combine form data with auto-generated fields
      const dataToSave = {
        ...values,
        phoneLink,
        phoneLink2,
        emailLink,
        emailLink2,
        mapUrl,
      };

      const response = await fetch('/api/admin/contact-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        setDirty(false);
        toast.success(t.saveSuccess);
        fetchContactInfo();
      } else {
        toast.error(t.saveError);
      }
    } catch (err) {
      toast.error(t.saveError);
    } finally {
      setSaving(false);
    }
  };

  const renderText = (
    name: keyof ContactInfoForm,
    label: React.ReactNode,
    opts: {
      placeholder?: string;
      tooltip?: string;
      type?: string;
      required?: boolean;
      className?: string;
    } = {},
  ) => (
    <div className={cn('space-y-2', opts.className)}>
      <FieldLabel
        htmlFor={name}
        tooltip={opts.tooltip}
        tooltipAriaLabel={t.infoTooltipAria}
        required={opts.required}
      >
        {label}
      </FieldLabel>
      <Input
        id={name}
        type={opts.type}
        placeholder={opts.placeholder}
        value={(values[name] as string | null | undefined) ?? ''}
        onChange={(e) => setField(name, e.target.value)}
      />
      {errors[name] && (
        <p className="text-sm font-medium text-destructive">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div>
      <AdminPageHeader title={t.title} />

      <form onSubmit={handleSubmit}>
        <fieldset disabled={loading} className="m-0 min-w-0 border-0 p-0">
          {/* Contact Details */}
          <SectionCard title={t.contactCard1}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderText('phone', t.phone1Label, { placeholder: '03-1234567', required: true })}
              {renderText('phoneName', t.phoneName1Label, {
                placeholder: t.personPlaceholder1,
                tooltip: t.phoneName1Tooltip,
              })}
            </div>
            {/* single field — full-width row (no empty grid cell) */}
            <div className="grid grid-cols-1 gap-4">
              {renderText('email', t.email1Label, {
                placeholder: 'info@example.com',
                type: 'email',
                required: true,
              })}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderText('whatsapp', 'WhatsApp 1', {
                placeholder: '972501234567',
                tooltip: t.whatsapp1Tooltip,
              })}
              {renderText('whatsappName', t.whatsappName1Label, {
                placeholder: t.personPlaceholder1,
                tooltip: t.whatsappNameTooltip,
              })}
            </div>
          </SectionCard>

          {/* Second Contact Details */}
          <SectionCard title={t.contactCard2}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderText('phone2', t.phone2Label, { placeholder: '03-7654321' })}
              {renderText('phoneName2', t.phoneName2Label, {
                placeholder: t.personPlaceholder2,
                tooltip: t.phoneName2Tooltip,
              })}
            </div>
            {/* single field — full-width row (no empty grid cell) */}
            <div className="grid grid-cols-1 gap-4">
              {renderText('email2', t.email2Label, {
                placeholder: 'info2@example.com',
                type: 'email',
              })}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderText('whatsapp2', 'WhatsApp 2', {
                placeholder: '972507654321',
                tooltip: t.whatsapp2Tooltip,
              })}
              {renderText('whatsappName2', t.whatsappName2Label, {
                placeholder: t.personPlaceholder2,
                tooltip: t.whatsappNameTooltip,
              })}
            </div>
          </SectionCard>

          {/* Address */}
          <SectionCard title={t.addressCard}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {renderText('address', t.addressLabel, {
                placeholder: t.addressPlaceholder,
                required: true,
                className: 'md:col-span-2',
              })}
              {renderText('city', t.cityLabel, {
                placeholder: t.cityPlaceholder,
                required: true,
              })}
            </div>

            {/* Map Location Picker */}
            <div className="space-y-2">
              <Label>{t.mapLabel}</Label>
              <LocationPicker
                position={mapPosition}
                onPositionChange={(coords: { lat: number; lng: number }) => {
                  setMapPosition(coords);
                  setValues((v) => ({ ...v, latitude: coords.lat, longitude: coords.lng }));
                  setDirty(true);
                }}
              />
            </div>

            {/* Coordinates Display */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="latitude">{t.latitudeLabel}</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="32.0853"
                  value={values.latitude ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const num = raw === '' ? null : parseFloat(raw);
                    setField('latitude', num);
                    if (
                      typeof num === 'number' &&
                      !Number.isNaN(num) &&
                      typeof values.longitude === 'number'
                    ) {
                      setMapPosition({ lat: num, lng: values.longitude });
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">{t.longitudeLabel}</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="34.7818"
                  value={values.longitude ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const num = raw === '' ? null : parseFloat(raw);
                    setField('longitude', num);
                    if (
                      typeof num === 'number' &&
                      !Number.isNaN(num) &&
                      typeof values.latitude === 'number'
                    ) {
                      setMapPosition({ lat: values.latitude, lng: num });
                    }
                  }}
                />
              </div>
            </div>
          </SectionCard>

          {/* Working Hours */}
          <SectionCard title={t.hoursCard}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderText('weekdayHours', t.weekdayHoursLabel, {
                placeholder: t.weekdayHoursExample,
                required: true,
              })}
              {renderText('fridayHours', t.fridayHoursLabel, {
                placeholder: t.fridayHoursExample,
                required: true,
              })}
            </div>
          </SectionCard>

          {/* Social Media */}
          <SectionCard title={t.socialCard1}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderText('facebook', 'Facebook 1 URL', { placeholder: 'https://facebook.com/...' })}
              {renderText('facebookName', t.facebookName1Label, { placeholder: t.personPlaceholder1 })}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderText('instagram', 'Instagram 1 URL', { placeholder: 'https://instagram.com/...' })}
              {renderText('instagramName', t.instagramName1Label, { placeholder: t.personPlaceholder1 })}
            </div>
            {/* single field — full-width row (no empty grid cell) */}
            <div className="grid grid-cols-1 gap-4">
              {renderText('linkedin', 'LinkedIn', { placeholder: 'https://linkedin.com/...' })}
            </div>
          </SectionCard>

          {/* Second Social Media */}
          <SectionCard title={t.socialCard2}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderText('facebook2', 'Facebook 2 URL', { placeholder: 'https://facebook.com/...' })}
              {renderText('facebookName2', t.facebookName2Label, { placeholder: t.personPlaceholder2 })}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderText('instagram2', 'Instagram 2 URL', { placeholder: 'https://instagram.com/...' })}
              {renderText('instagramName2', t.instagramName2Label, { placeholder: t.personPlaceholder2 })}
            </div>
          </SectionCard>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit" size="lg" disabled={saving}>
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {t.saveButton}
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
