'use client';

import { Card } from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { Label } from '@/components/shadcn/label';
import { Switch } from '@/components/shadcn/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/shadcn/select';
import { cn } from '@/lib/utils';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import { PropertyFormSectionProps } from '../types';
import { buildDealTypeOptions, buildStatusOptions } from '../constants';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

// Persisted vacancy-date sentinel values (stored in the DB and matched by the
// public site) — data values, not UI labels; they stay Hebrew in both locales.
const VACANCY_IMMEDIATE = 'מיד';
const VACANCY_FLEXIBLE = 'גמיש';

// Sentinel used in the status <Select> because Radix Select forbids an empty
// string as an item value; mapped back to '' on read/write.
const STATUS_NONE = '__none__';

export function BasicInfoSection({ formData, handleChange, errors }: PropertyFormSectionProps) {
  const t = useAdminMessages(propertyFormMessages);
  const [vacancyType, setVacancyType] = useState<'date' | 'immediately' | 'flexible'>('date');

  // Sync vacancyType with formData
  useEffect(() => {
    if (formData.vacancyDate === VACANCY_IMMEDIATE || formData.vacancyDate === 'immediately') {
      setVacancyType('immediately');
    } else if (formData.vacancyDate === VACANCY_FLEXIBLE || formData.vacancyDate === 'flexible') {
      setVacancyType('flexible');
    } else if (formData.vacancyDate && typeof formData.vacancyDate === 'string' && formData.vacancyDate.trim() !== '') {
      setVacancyType('date');
    } else if (formData.vacancyDate && typeof formData.vacancyDate === 'object') {
      setVacancyType('date');
    }
  }, [formData.vacancyDate]);

  // Value shown by the native date input (expects YYYY-MM-DD); the form stores
  // the DD/MM/YYYY string that the rest of the app relies on.
  const dateInputValue = (() => {
    const v: any = formData.vacancyDate;
    if (!v || v === VACANCY_IMMEDIATE || v === 'immediately' || v === VACANCY_FLEXIBLE || v === 'flexible') {
      return '';
    }
    if (typeof v === 'string') {
      const d = dayjs(v, 'DD/MM/YYYY', true);
      return d.isValid() ? d.format('YYYY-MM-DD') : '';
    }
    return dayjs.isDayjs(v) ? v.format('YYYY-MM-DD') : '';
  })();

  const vacancyOptions = [
    { label: t.basicInfo.vacancyPickDate, value: 'date' as const },
    { label: t.basicInfo.vacancyImmediate, value: 'immediately' as const },
    { label: t.basicInfo.vacancyFlexible, value: 'flexible' as const },
  ];

  return (
    <Card className="mb-4 p-5">
      <h3 className="mb-4 text-base font-semibold text-foreground">{t.basicInfo.cardTitle}</h3>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-6">
        <div className="md:col-span-4" id="field-title">
          <Label className="mb-1.5 block">
            {t.basicInfo.titleLabel} <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder={t.basicInfo.titlePlaceholder}
            value={formData.title ?? ''}
            onChange={(e) => handleChange('title', e.target.value)}
          />
          {errors?.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
        </div>
        <div className="md:col-span-1">
          <Label className="mb-1.5 block">{t.basicInfo.dealTypeLabel}</Label>
          <Select value={formData.dealType} onValueChange={(v) => handleChange('dealType', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {buildDealTypeOptions(t).map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-1">
          <Label className="mb-1.5 block">{t.basicInfo.statusLabel}</Label>
          <Select
            value={formData.status || STATUS_NONE}
            onValueChange={(v) => handleChange('status', v === STATUS_NONE ? '' : v)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {buildStatusOptions(t).map((o) => (
                <SelectItem key={o.value || STATUS_NONE} value={o.value || STATUS_NONE}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4" id="field-description">
        <Label className="mb-1.5 block">
          {t.basicInfo.descriptionLabel} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          rows={6}
          placeholder={t.basicInfo.descriptionPlaceholder}
          value={formData.description ?? ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
        {errors?.description && (
          <p className="mt-1 text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div id="field-price">
          <Label className="mb-1.5 block">
            {t.basicInfo.priceLabel} <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              className="pe-8"
              placeholder="1,200,000"
              value={formData.price ?? ''}
              onChange={(e) => handleChange('price', e.target.value)}
            />
            <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ₪
            </span>
          </div>
          {errors?.price && <p className="mt-1 text-sm text-destructive">{errors.price}</p>}
        </div>
        <div>
          <Label className="mb-1.5 block">{t.basicInfo.originalPriceLabel}</Label>
          <div className="relative">
            <Input
              className="pe-8"
              placeholder="1,500,000"
              value={formData.originalPrice ?? ''}
              onChange={(e) => handleChange('originalPrice', e.target.value)}
            />
            <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ₪
            </span>
          </div>
        </div>
        <div>
          <Label className="mb-1.5 block">{t.basicInfo.vacancyDateLabel}</Label>
          <div className="mb-2 flex w-full overflow-hidden rounded-md border border-input">
            {vacancyOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setVacancyType(opt.value);
                  if (opt.value === 'immediately') {
                    handleChange('vacancyDate', VACANCY_IMMEDIATE);
                  } else if (opt.value === 'flexible') {
                    handleChange('vacancyDate', VACANCY_FLEXIBLE);
                  } else {
                    handleChange('vacancyDate', '');
                  }
                }}
                className={cn(
                  'flex min-h-10 flex-1 items-center justify-center px-2 text-center text-sm transition-colors',
                  vacancyType === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground hover:bg-accent',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {vacancyType === 'date' && (
            <Input
              type="date"
              placeholder={t.basicInfo.vacancyDatePlaceholder}
              value={dateInputValue}
              onChange={(e) => {
                if (e.target.value) {
                  handleChange('vacancyDate', dayjs(e.target.value, 'YYYY-MM-DD').format('DD/MM/YYYY'));
                } else {
                  handleChange('vacancyDate', '');
                }
              }}
            />
          )}
          {vacancyType === 'immediately' && (
            <div className="rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">
              {t.basicInfo.vacancyImmediate}
            </div>
          )}
          {vacancyType === 'flexible' && (
            <div className="rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">
              {t.basicInfo.vacancyFlexible}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => handleChange('isActive', checked)}
          />
          <span className="text-sm text-muted-foreground">
            {formData.isActive ? t.basicInfo.activeOn : t.basicInfo.activeOff}
          </span>
          <span className="text-sm">{t.basicInfo.activeCaption}</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isSold}
            onCheckedChange={(checked) => handleChange('isSold', checked)}
          />
          <span className="text-sm text-muted-foreground">
            {formData.dealType === 'rent'
              ? (formData.isSold ? t.basicInfo.rentedOn : t.basicInfo.rentedOff)
              : (formData.isSold ? t.basicInfo.soldOn : t.basicInfo.soldOff)}
          </span>
          <span className="text-sm">{t.basicInfo.soldCaption}</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isPinned}
            onCheckedChange={(checked) => handleChange('isPinned', checked)}
          />
          <span className="text-sm text-muted-foreground">
            {formData.isPinned ? t.basicInfo.pinnedOn : t.basicInfo.pinnedOff}
          </span>
          <span className="text-sm">{t.basicInfo.pinnedCaption}</span>
        </div>
      </div>
    </Card>
  );
}
