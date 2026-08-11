'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, Loader2, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';

import { toast } from '@/components/shadcn/sonner';
import { Button } from '@/components/shadcn/button';
import { Card, CardTitle } from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Textarea } from '@/components/shadcn/textarea';
import { Skeleton } from '@/components/shadcn/skeleton';
import ImageUploader from '@/components/admin/ImageUploader';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import { useAdminMessages } from '@/lib/adminI18n';
import { designMessages } from '@/lib/adminI18n/messages/design';
import { MOONLIT_DEFAULTS, type MoonlitContentData } from '@/themes/moonlit/content';

/* Every editable field of the Moonlit theme. The repeaters are driven by these
   specs so adding a field later is one line, not a new form. */

type FieldKind = 'text' | 'area' | 'image';
interface FieldSpec {
  key: string;
  label: string;
  kind?: FieldKind;
}

const SLIDE_FIELDS: FieldSpec[] = [
  { key: 'image', label: 'תמונה', kind: 'image' },
  { key: 'eyebrow', label: 'כותרת עליונה' },
  { key: 'title', label: 'כותרת ראשית', kind: 'area' },
  { key: 'text', label: 'טקסט', kind: 'area' },
  { key: 'ctaLabel', label: 'טקסט כפתור' },
  { key: 'ctaHref', label: 'קישור כפתור' },
];

const FACILITY_FIELDS: FieldSpec[] = [
  { key: 'icon', label: 'אייקון (נתיב)' },
  { key: 'title', label: 'כותרת' },
  { key: 'text', label: 'טקסט', kind: 'area' },
];

const TESTIMONIAL_FIELDS: FieldSpec[] = [
  { key: 'text', label: 'תוכן ההמלצה', kind: 'area' },
  { key: 'author', label: 'שם' },
  { key: 'context', label: 'הקשר (עסקה · עיר)' },
  { key: 'avatar', label: 'תמונת פרופיל', kind: 'image' },
];

const BUDGET_FIELDS: FieldSpec[] = [
  { key: 'value', label: 'מחיר מקסימלי (₪)' },
  { key: 'label', label: 'תווית' },
];

const LINK_FIELDS: FieldSpec[] = [
  { key: 'label', label: 'טקסט' },
  { key: 'href', label: 'קישור' },
];

/** A repeater row — shape depends on the field spec it is rendered with. */
type Row = Record<string, unknown>;

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <ImageUploader
      images={value ? [value] : []}
      onImagesChange={(imgs) => onChange(imgs[0] ?? '')}
      maxImages={1}
    />
  );
}

function FieldInput({ spec, value, onChange }: { spec: FieldSpec; value: unknown; onChange: (v: string) => void }) {
  const str = typeof value === 'string' ? value : '';
  if (spec.kind === 'image') return <ImageField value={str} onChange={onChange} />;
  if (spec.kind === 'area') {
    return <Textarea rows={2} value={str} onChange={(e) => onChange(e.target.value)} />;
  }
  return <Input value={str} onChange={(e) => onChange(e.target.value)} />;
}

/** List of records, each rendered from a field spec. */
function Repeater({
  rows,
  fields,
  onChange,
  addLabel,
  emptyRow,
}: {
  rows: Row[];
  fields: FieldSpec[];
  onChange: (rows: Row[]) => void;
  addLabel: string;
  emptyRow: Row;
}) {
  const patch = (i: number, key: string, v: string) =>
    onChange(rows.map((r, idx) => (idx === i ? { ...r, [key]: v } : r)));

  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="rounded-lg border border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] font-medium text-muted-foreground">#{i + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(rows.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.kind === 'area' || f.kind === 'image' ? 'md:col-span-2' : ''}>
                <Label className="mb-1.5 block text-[13px]">{f.label}</Label>
                <FieldInput spec={f} value={row[f.key]} onChange={(v) => patch(i, f.key, v)} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...rows, { ...emptyRow }])}>
        <Plus className="size-3.5" />
        {addLabel}
      </Button>
    </div>
  );
}

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between py-4 text-start"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold text-foreground">{title}</span>
        <ChevronDown
          className="size-4 text-muted-foreground transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : undefined }}
        />
      </button>
      {open && <div className="pb-6">{children}</div>}
    </div>
  );
}

export default function MoonlitContentEditor() {
  const t = useAdminMessages(designMessages);
  const [data, setData] = useState<MoonlitContentData | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/moonlit-content');
        if (!res.ok) throw new Error('failed');
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) {
          toast.error(t.loadFailed);
          setData(MOONLIT_DEFAULTS);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = <K extends keyof MoonlitContentData>(key: K, value: MoonlitContentData[K]) => {
    setData((prev) => (prev ? { ...prev, [key]: value } : prev));
    setDirty(true);
  };

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/moonlit-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('failed');
      setDirty(false);
      toast.success(t.contentSaved);
    } catch {
      toast.error(t.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <Card className="mt-4 p-5">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-4 h-40 w-full" />
      </Card>
    );
  }

  return (
    <Card className="mt-4 p-5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <CardTitle className="text-base font-semibold">{t.contentCard}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{t.contentHelper}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{dirty ? t.unsaved : t.allSaved}</span>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setData(MOONLIT_DEFAULTS);
              setDirty(true);
            }}
          >
            <RotateCcw className="size-4" />
            {t.resetDefaults}
          </Button>
          <Button onClick={save} disabled={!dirty || saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? t.saving : t.saveContent}
          </Button>
        </div>
      </div>

      <Section title={t.secBanner} defaultOpen>
        <Repeater
          rows={data.bannerSlides as unknown as Row[]}
          fields={SLIDE_FIELDS}
          onChange={(rows) => set('bannerSlides', rows as unknown as MoonlitContentData['bannerSlides'])}
          addLabel={t.addSlide}
          emptyRow={{ image: '', eyebrow: '', title: '', text: '', ctaHref: '/apartments', ctaLabel: '' }}
        />
      </Section>

      <Section title={t.secAbout}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label className="mb-1.5 block text-[13px]">{t.aboutText}</Label>
            <Textarea rows={5} value={data.aboutText} onChange={(e) => set('aboutText', e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block text-[13px]">{t.aboutBadgeValue}</Label>
            <Input value={data.aboutBadgeValue} onChange={(e) => set('aboutBadgeValue', e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block text-[13px]">{t.aboutBadgeLabel}</Label>
            <Input value={data.aboutBadgeLabel} onChange={(e) => set('aboutBadgeLabel', e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block text-[13px]">{t.aboutCtaLabel}</Label>
            <Input value={data.aboutCtaLabel} onChange={(e) => set('aboutCtaLabel', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1.5 block text-[13px]">{t.aboutImageMain}</Label>
            <ImageField value={data.aboutImageMain} onChange={(v) => set('aboutImageMain', v)} />
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1.5 block text-[13px]">{t.aboutImageInset}</Label>
            <ImageField value={data.aboutImageInset} onChange={(v) => set('aboutImageInset', v)} />
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1.5 block text-[13px]">{t.bandImage}</Label>
            <ImageField value={data.bandImage} onChange={(v) => set('bandImage', v)} />
          </div>
        </div>
      </Section>

      <Section title={t.secFacilities}>
        <Repeater
          rows={data.facilities as unknown as Row[]}
          fields={FACILITY_FIELDS}
          onChange={(rows) => set('facilities', rows as unknown as MoonlitContentData['facilities'])}
          addLabel={t.addCard}
          emptyRow={{ icon: '/moonlit/images/icon/bed.svg', title: '', text: '' }}
        />
      </Section>

      <Section title={t.secTestimonials}>
        <Repeater
          rows={data.testimonials as unknown as Row[]}
          fields={TESTIMONIAL_FIELDS}
          onChange={(rows) => set('testimonials', rows as unknown as MoonlitContentData['testimonials'])}
          addLabel={t.addTestimonial}
          emptyRow={{ text: '', author: '', context: '', avatar: '' }}
        />
      </Section>

      <Section title={t.secSearch}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label className="mb-1.5 block text-[13px]">{t.searchCities}</Label>
            <Input
              value={data.searchCities.join(', ')}
              onChange={(e) =>
                set('searchCities', e.target.value.split(',').map((v) => v.trim()).filter(Boolean))
              }
            />
            <p className="mt-1 text-[12px] text-muted-foreground">{t.searchCitiesHint}</p>
          </div>
          <div>
            <Label className="mb-1.5 block text-[13px]">{t.searchRooms}</Label>
            <Input
              value={data.searchRooms.join(', ')}
              onChange={(e) =>
                set('searchRooms', e.target.value.split(',').map((v) => v.trim()).filter(Boolean))
              }
            />
          </div>
          <div>
            <Label className="mb-2 block text-[13px]">{t.searchBudgets}</Label>
            <Repeater
              rows={data.searchBudgets as unknown as Row[]}
              fields={BUDGET_FIELDS}
              onChange={(rows) => set('searchBudgets', rows as unknown as MoonlitContentData['searchBudgets'])}
              addLabel={t.addBudget}
              emptyRow={{ value: '', label: '' }}
            />
          </div>
        </div>
      </Section>

      <Section title={t.secNav}>
        <Repeater
          rows={data.navItems as unknown as Row[]}
          fields={LINK_FIELDS}
          onChange={(rows) => set('navItems', rows as unknown as MoonlitContentData['navItems'])}
          addLabel={t.addLink}
          emptyRow={{ label: '', href: '/' }}
        />
        <p className="mt-2 text-[12px] text-muted-foreground">{t.navHint}</p>
      </Section>

      <Section title={t.secFooter}>
        <div className="space-y-4">
          <div>
            <Label className="mb-1.5 block text-[13px]">{t.newsletterTitle}</Label>
            <Input value={data.newsletterTitle} onChange={(e) => set('newsletterTitle', e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block text-[13px]">{t.footerAbout}</Label>
            <Textarea rows={3} value={data.footerAbout} onChange={(e) => set('footerAbout', e.target.value)} />
          </div>
          {data.footerColumns.map((col, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <Label className="mb-1.5 block text-[13px]">{t.columnTitle}</Label>
              <Input
                value={col.title}
                onChange={(e) =>
                  set(
                    'footerColumns',
                    data.footerColumns.map((c, idx) => (idx === i ? { ...c, title: e.target.value } : c))
                  )
                }
              />
              <div className="mt-3">
                <Repeater
                  rows={col.links as unknown as Row[]}
                  fields={LINK_FIELDS}
                  onChange={(rows) =>
                    set(
                      'footerColumns',
                      data.footerColumns.map((c, idx) =>
                        idx === i ? { ...c, links: rows as unknown as { label: string; href: string }[] } : c
                      )
                    )
                  }
                  addLabel={t.addLink}
                  emptyRow={{ label: '', href: '/' }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Card>
  );
}
