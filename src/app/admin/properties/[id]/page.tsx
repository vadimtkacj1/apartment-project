'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminFormActions from '@/components/admin/AdminFormActions';
import { usePropertyForm } from './usePropertyForm';
import {
  BasicInfoSection,
  AgentSection,
  LocationSection,
  PropertyDetailsSection,
  FeaturesSection,
  MapSection,
  ImagesSection,
  SeoSection,
} from './sections';

// Stable anchors for the 8 section cards, in render order (scrollspy relies on it).
const SECTION_IDS = [
  'section-basics',
  'section-agent',
  'section-location',
  'section-details',
  'section-features',
  'section-map',
  'section-images',
  'section-seo',
] as const;

// Clears the sticky admin chrome when jumping to an anchor.
const SECTION_SCROLL_MARGIN = '[scroll-margin-block-start:90px]';

export default function PropertyEditPage() {
  const params = useParams();
  const router = useRouter();
  const t = useAdminMessages(propertyFormMessages);
  const isNew = params.id === 'new';
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    formData,
    loading,
    saving,
    handleChange,
    handleSubmit,
    handleAddressFromMap,
  } = usePropertyForm(params.id, isNew);

  // --- Anchor navigation (scrollspy) over the section cards ---
  const [activeSectionId, setActiveSectionId] = useState<string>(SECTION_IDS[0]);

  useEffect(() => {
    if (loading) return;
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Active = topmost section inside the observation band (between the
        // sticky admin chrome and ~45% of the viewport) — one at a time.
        const current = SECTION_IDS.find((id) => visible.has(id));
        if (current) setActiveSectionId(current);
      },
      { rootMargin: '-90px 0px -55% 0px', threshold: 0 },
    );
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [loading]);

  const scrollToSection = (id: string) => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  // Simple per-section completion: key fields for basics/location/images,
  // "any field filled" for the rest (only fields whose defaults are empty).
  const anyFeature = Object.entries(formData).some(
    ([key, value]) => key.startsWith('has') && value === true,
  );
  const sectionNav: { id: string; label: string; filled: boolean }[] = [
    {
      id: 'section-basics',
      label: t.basicInfo.cardTitle,
      filled: Boolean(
        String(formData.title ?? '').trim() &&
          String(formData.price ?? '').trim() &&
          formData.rooms &&
          formData.area > 0,
      ),
    },
    {
      id: 'section-agent',
      label: t.agent.cardTitle,
      filled: (formData.agentIds?.length ?? 0) > 0,
    },
    {
      id: 'section-location',
      label: t.location.cardTitle,
      filled: Boolean(formData.city && String(formData.street ?? '').trim()),
    },
    {
      id: 'section-details',
      label: t.details.cardTitle,
      filled:
        formData.area > 0 ||
        formData.builtArea > 0 ||
        formData.floor > 0 ||
        formData.totalFloors > 0 ||
        formData.balconySize != null ||
        formData.directions.length > 0,
    },
    { id: 'section-features', label: t.features.cardTitle, filled: anyFeature },
    {
      id: 'section-map',
      label: t.map.cardTitle,
      filled: formData.latitude != null || formData.longitude != null,
    },
    {
      id: 'section-images',
      label: t.images.cardTitle,
      filled: formData.images.length > 0,
    },
    {
      id: 'section-seo',
      label: t.seo.cardTitle,
      filled: Boolean(formData.metaTitle || formData.metaDescription || formData.ogImage),
    },
  ];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!String(formData.title ?? '').trim()) e.title = t.basicInfo.titleRequired;
    if (!String(formData.description ?? '').trim())
      e.description = t.basicInfo.descriptionRequired;
    if (!String(formData.price ?? '').trim()) e.price = t.basicInfo.priceRequired;
    if (!formData.agentIds || formData.agentIds.length === 0)
      e.agentIds = t.agent.required;
    if (!formData.city) e.city = t.location.cityRequired;
    if (!formData.rooms) e.rooms = t.details.roomsRequired;
    if (formData.area === undefined || formData.area === null)
      e.area = t.details.areaRequired;
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const order = ['title', 'description', 'price', 'agentIds', 'city', 'rooms', 'area'];
      const first = order.find((k) => e[k]);
      if (first) {
        document
          .getElementById(`field-${first}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    handleSubmit(() => router.push('/admin/properties'));
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={
          <span className="inline-flex items-center gap-2">
            <Home className="size-6" />
            {isNew ? t.page.addTitle : t.page.editTitle}
          </span>
        }
        extra={
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => router.push('/admin/properties')}
          >
            {t.page.backToList}
            <ArrowLeft className="size-4" />
          </Button>
        }
      />

      {/* Mobile/tablet: compact horizontal anchor chip row */}
      <nav aria-label={t.nav.ariaLabel} className="mb-5 xl:hidden">
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {sectionNav.map((section) => {
            const active = activeSectionId === section.id;
            return (
              <li key={section.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-card px-3 py-1.5 text-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    active
                      ? 'border-primary font-medium text-primary'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'size-2 shrink-0 rounded-full',
                      section.filled ? 'bg-primary' : 'border border-border',
                    )}
                  />
                  {section.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="xl:flex xl:items-start xl:gap-8">
        <form onSubmit={onSubmit} noValidate className="min-w-0 xl:flex-1">
          <div id="section-basics" className={SECTION_SCROLL_MARGIN}>
            <BasicInfoSection formData={formData} handleChange={handleChange} errors={errors} />
          </div>
          <div id="section-agent" className={SECTION_SCROLL_MARGIN}>
            <AgentSection formData={formData} handleChange={handleChange} errors={errors} />
          </div>
          <div id="section-location" className={SECTION_SCROLL_MARGIN}>
            <LocationSection formData={formData} handleChange={handleChange} errors={errors} />
          </div>
          <div id="section-details" className={SECTION_SCROLL_MARGIN}>
            <PropertyDetailsSection formData={formData} handleChange={handleChange} errors={errors} />
          </div>
          <div id="section-features" className={SECTION_SCROLL_MARGIN}>
            <FeaturesSection formData={formData} handleChange={handleChange} />
          </div>
          <div id="section-map" className={SECTION_SCROLL_MARGIN}>
            <MapSection
              formData={formData}
              handleChange={handleChange}
              onAddressChange={handleAddressFromMap}
            />
          </div>
          <div id="section-images" className={SECTION_SCROLL_MARGIN}>
            <ImagesSection formData={formData} handleChange={handleChange} />
          </div>
          <div id="section-seo" className={SECTION_SCROLL_MARGIN}>
            <SeoSection formData={formData} handleChange={handleChange} />
          </div>

          <AdminFormActions
            saveLabel={t.page.save}
            cancelLabel={t.page.cancel}
            saving={saving}
            submit
            onCancel={() => router.push('/admin/properties')}
          />
        </form>

        {/* Desktop: sticky anchor rail at the inline-end of the form column */}
        <nav
          aria-label={t.nav.ariaLabel}
          className="sticky top-24 hidden w-50 shrink-0 xl:block"
        >
          <ul className="space-y-0.5">
            {sectionNav.map((section) => {
              const active = activeSectionId === section.id;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'relative flex w-full items-center gap-2 rounded-md py-1.5 pe-2 ps-3 text-start text-sm transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                      active
                        ? 'font-medium text-primary'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute bottom-1 start-0 top-1 w-0.5 rounded-full bg-primary"
                      />
                    )}
                    <span
                      aria-hidden
                      className={cn(
                        'size-2 shrink-0 rounded-full',
                        section.filled ? 'bg-primary' : 'border border-border',
                      )}
                    />
                    {section.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
