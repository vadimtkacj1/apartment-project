'use client';

import { Info } from 'lucide-react';
import { Card } from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { Label } from '@/components/shadcn/label';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/shadcn/tooltip';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import { PropertyFormSectionProps } from '../types';

export function SeoSection({ formData, handleChange }: PropertyFormSectionProps) {
  const t = useAdminMessages(propertyFormMessages);

  const metaTitle = formData.metaTitle ?? '';
  const metaDescription = formData.metaDescription ?? '';

  return (
    <Card className="mb-4 p-5">
      <h3 className="mb-4 text-base font-semibold text-foreground">{t.seo.cardTitle}</h3>
      <p className="mb-4 mt-0 text-muted-foreground">{t.seo.helpText}</p>

      <div className="flex flex-col gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-1">
            <Label>{t.seo.metaTitleLabel}</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground" aria-label={t.seo.metaTitleLabel}>
                  <Info className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{t.seo.metaTitleTooltip}</TooltipContent>
            </Tooltip>
          </div>
          <Input
            maxLength={70}
            placeholder={t.seo.metaTitlePlaceholder}
            value={metaTitle}
            onChange={(e) => handleChange('metaTitle', e.target.value)}
          />
          <div className="mt-1 text-end text-xs text-muted-foreground">{metaTitle.length} / 70</div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center gap-1">
            <Label>{t.seo.metaDescriptionLabel}</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground" aria-label={t.seo.metaDescriptionLabel}>
                  <Info className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{t.seo.metaDescriptionTooltip}</TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            rows={3}
            maxLength={170}
            placeholder={t.seo.metaDescriptionPlaceholder}
            value={metaDescription}
            onChange={(e) => handleChange('metaDescription', e.target.value)}
          />
          <div className="mt-1 text-end text-xs text-muted-foreground">{metaDescription.length} / 170</div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center gap-1">
            <Label>{t.seo.ogImageLabel}</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground" aria-label={t.seo.ogImageLabel}>
                  <Info className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{t.seo.ogImageTooltip}</TooltipContent>
            </Tooltip>
          </div>
          <Input
            placeholder={t.seo.ogImagePlaceholder}
            value={formData.ogImage ?? ''}
            onChange={(e) => handleChange('ogImage', e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}
