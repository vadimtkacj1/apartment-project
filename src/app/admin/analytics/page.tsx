'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Trash2, RotateCw, Plus } from 'lucide-react';
import dayjs from 'dayjs';
import { toast } from '@/components/shadcn/sonner';
import { Card } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Skeleton } from '@/components/shadcn/skeleton';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/shadcn/select';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/shadcn/alert-dialog';
import { useIsMobile } from '@/hooks/useIsMobile';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useAdminMessages, useAdminI18n } from '@/lib/adminI18n';
import { analyticsMessages } from '@/lib/adminI18n/messages/analytics';
import { boardMessages } from '@/lib/adminI18n/messages/board';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import WidgetBoard from '@/components/admin/board/WidgetBoard';
import AddWidgetDialog from '@/components/admin/board/AddWidgetDialog';
import { BoardControls, BoardHint, BoardStyles } from '@/components/admin/board/BoardChrome';
import { useWidgetLayout } from '@/components/admin/board/useWidgetLayout';

import { ANALYTICS_WIDGETS, WIDGETS_BY_ID } from './widgets';
import type {
  AnalyticsSummary,
  AnalyticsWidgetContext,
  ChartDataPoint,
  ClickEvent,
  PropertyView,
} from './types';

const LAYOUT_STORAGE_KEY = 'admin-analytics-layout-v1';

export default function AnalyticsPage() {
  const t = useAdminMessages(analyticsMessages);
  const board = useAdminMessages(boardMessages);
  const { dir } = useAdminI18n();
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [views, setViews] = useState<PropertyView[]>([]);
  const [clicks, setClicks] = useState<ClickEvent[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [selectedIP, setSelectedIP] = useState<string>('all');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [ipToVisitorMap, setIpToVisitorMap] = useState<Map<string, number>>(new Map());
  const [resetOpen, setResetOpen] = useState(false);

  // Dashboard customisation: block order / width / visibility (persisted locally).
  const {
    visibleItems, hiddenWidgets, isCustomized,
    moveWidget, setSpan, hideWidget, addWidget, resetLayout,
  } = useWidgetLayout(LAYOUT_STORAGE_KEY, ANALYTICS_WIDGETS);
  const [editing, setEditing] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, selectedProperty, selectedIP]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      const [start, end] = dateRange;
      if (start && end) {
        params.append('startDate', start.toISOString());
        params.append('endDate', end.toISOString());
      }
      if (selectedProperty !== 'all') {
        params.append('propertyId', selectedProperty);
      }
      if (selectedIP !== 'all') {
        params.append('ipAddress', selectedIP);
      }

      const queryString = params.toString();

      // 1. Fetch all data in parallel
      const [summaryRes, viewsRes, clicksRes] = await Promise.all([
        fetch(`/api/analytics/track?type=summary&${queryString}`),
        fetch(`/api/analytics/track?type=views&${queryString}`),
        fetch(`/api/analytics/track?type=clicks&${queryString}`)
      ]);

      let loadedViews: PropertyView[] = [];
      let loadedClicks: ClickEvent[] = [];

      // 2. Process Summary
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        setSummary(summaryData);
      } else {
        console.error('Failed to fetch summary');
      }

      // 3. Process Views
      if (viewsRes.ok) {
        const viewsData = await viewsRes.json();
        loadedViews = Array.isArray(viewsData) ? viewsData : [];
        setViews(loadedViews);
      }

      // 4. Process Clicks
      if (clicksRes.ok) {
        const clicksData = await clicksRes.json();
        loadedClicks = Array.isArray(clicksData) ? clicksData : [];
        setClicks(loadedClicks);
      }

      // 5. Process Charts (using the local variables, fixing the scope error)
      processChartData(loadedViews, loadedClicks);

      // 6. Create IP to Visitor Number mapping
      const allIPs = new Set<string>();
      loadedViews.forEach(v => allIPs.add(v.ipAddress));
      loadedClicks.forEach(c => allIPs.add(c.ipAddress));

      const ipMap = new Map<string, number>();
      const sortedIPs = Array.from(allIPs).sort();
      sortedIPs.forEach((ip, index) => {
        ipMap.set(ip, index + 1);
      });
      setIpToVisitorMap(ipMap);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error(t.loadError);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (viewsData: PropertyView[], clicksData: ClickEvent[]) => {
    // Key buckets by full ISO date (YYYY-MM-DD) so they sort chronologically
    // without relying on the customParseFormat plugin; keep DD/MM only for display.
    const dateMap = new Map<
      string,
      { label: string; views: Set<number>; clicks: number; uniqueIPs: Set<string> }
    >();

    const bucketFor = (dateStr: string) => {
      const d = dayjs(dateStr);
      const key = d.format('YYYY-MM-DD');
      let bucket = dateMap.get(key);
      if (!bucket) {
        bucket = { label: d.format('DD/MM'), views: new Set(), clicks: 0, uniqueIPs: new Set() };
        dateMap.set(key, bucket);
      }
      return bucket;
    };

    viewsData.forEach(view => {
      const bucket = bucketFor(view.createdAt);
      bucket.views.add(view.id);
      bucket.uniqueIPs.add(view.ipAddress);
    });

    clicksData.forEach(click => {
      const bucket = bucketFor(click.createdAt);
      bucket.clicks++;
      bucket.uniqueIPs.add(click.ipAddress);
    });

    const chartData: ChartDataPoint[] = Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b)) // ISO keys sort chronologically
      .map(([, data]) => ({
        date: data.label,
        views: data.views.size,
        clicks: data.clicks,
        uniqueUsers: data.uniqueIPs.size,
      }))
      .slice(-30); // Show last 30 days max to avoid overcrowding

    setChartData(chartData);
  };

  const handleDeleteAnalytics = async (type: 'all' | 'views' | 'clicks') => {
    try {
      const response = await fetch('/api/analytics/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        toast.success(t.deleteSuccess);
        fetchAnalytics();
      } else {
        toast.error(t.deleteError);
      }
    } catch (error) {
      console.error('Error deleting analytics:', error);
      toast.error(t.deleteError);
    }
  };

  const getVisitorNumber = useCallback((ipAddress: string): string => {
    const visitorNum = ipToVisitorMap.get(ipAddress);
    return visitorNum ? t.visitor(visitorNum) : t.visitor('?');
  }, [ipToVisitorMap, t]);

  // Everything the blocks render from — they are pure functions of this.
  const widgetCtx: AnalyticsWidgetContext = useMemo(() => ({
    t, dir, isMobile, reduced,
    summary, views, clicks, chartData,
    selectedIP, setSelectedIP, getVisitorNumber,
  }), [t, dir, isMobile, reduced, summary, views, clicks, chartData, selectedIP, getVisitorNumber]);

  const handleHide = useCallback((id: string) => {
    hideWidget(id);
    const def = WIDGETS_BY_ID[id];
    if (def) toast.success(board.blockHidden(def.title(widgetCtx)));
  }, [hideWidget, board, widgetCtx]);

  const handleAdd = useCallback((id: string) => {
    addWidget(id);
    const def = WIDGETS_BY_ID[id];
    if (def) toast.success(board.blockAdded(def.title(widgetCtx)));
  }, [addWidget, board, widgetCtx]);

  const handleResetLayout = useCallback(() => {
    resetLayout();
    toast.success(board.layoutReset);
  }, [resetLayout, board]);

  if (loading && !summary) {
    // Same skeleton vocabulary as /admin: one hero-sized block + a stack of lines.
    return (
      <div className="analytics-console" role="status" aria-busy="true" aria-label={t.loadingData}>
        <Skeleton className="w-full" style={{ height: 108, marginBlock: '6px 24px', borderRadius: 16 }} />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-console">
      {/* Header */}
      <AdminPageHeader
        title={t.title}
        subtitle={t.subtitle}
        extra={
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <BoardControls
              editing={editing}
              onEdit={() => setEditing(true)}
              onDone={() => setEditing(false)}
              onAdd={() => setPickerOpen(true)}
              onReset={handleResetLayout}
              canReset={isCustomized}
              labels={board}
            />
            {!editing && (
              <>
                <Button type="button" variant="outline" onClick={fetchAnalytics} disabled={loading}>
                  <RotateCw className="size-4" />
                  {t.refresh}
                </Button>
                <Button type="button" variant="destructive" onClick={() => setResetOpen(true)}>
                  <Trash2 className="size-4" />
                  {t.resetData}
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Filters Bar */}
      <Card className="ec-card p-6" style={{ marginBottom: 28 }}>
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="mb-2 text-xs font-semibold text-muted-foreground">{t.dateRangeLabel}</div>
            <div className="admin-filter-full flex flex-wrap items-center gap-2">
              <input
                type="date"
                aria-label={t.fromDate}
                className="h-10 min-w-0 flex-1 rounded-md border border-input bg-card px-3 text-sm"
                value={dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setDateRange((prev) => [v ? dayjs(v) : null, prev[1]]);
                }}
              />
              <input
                type="date"
                aria-label={t.toDate}
                className="h-10 min-w-0 flex-1 rounded-md border border-input bg-card px-3 text-sm"
                value={dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setDateRange((prev) => [prev[0], v ? dayjs(v) : null]);
                }}
              />
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold text-muted-foreground">{t.filterByProperty}</div>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.selectProperty} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.showAll}</SelectItem>
                {(summary?.topProperties || []).map((p) => (
                  <SelectItem key={p.propertyId} value={p.propertyId.toString()}>
                    {t.propertyOption(p.propertyId, p.views)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold text-muted-foreground">{t.filterByVisitor}</div>
            <Select value={selectedIP} onValueChange={setSelectedIP}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t.selectVisitor} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.showAll}</SelectItem>
                {(summary?.topUsersByClicks || []).map((user) => (
                  <SelectItem key={user.ipAddress} value={user.ipAddress}>
                    {getVisitorNumber(user.ipAddress)} ({t.clicksCount(user.clicks)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Selected User Info */}
      {selectedIP !== 'all' && (
        <Card className="ec-card p-6" style={{ marginBottom: 28 }}>
          <div className="flex flex-wrap items-center gap-4">
            <User className="size-8 shrink-0" style={{ color: 'var(--brand)' }} />
            <div className="min-w-0 flex-1">
              <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
                {t.userActivity} <span style={{ fontWeight: 700, color: 'var(--brand)' }}>{getVisitorNumber(selectedIP)}</span>
              </div>
              <div style={{ color: '#64748B' }}>
                {summary?.topUsersByClicks?.find(u => u.ipAddress === selectedIP) && (
                  <>
                    {t.totalClicksOf(summary.topUsersByClicks.find(u => u.ipAddress === selectedIP)!.clicks)}
                  </>
                )}
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => setSelectedIP('all')}>
              <RotateCw className="size-4" />
              {t.clearFilter}
            </Button>
          </div>
        </Card>
      )}

      {/* Customisation hint — only while editing, so read mode stays clean */}
      {editing && <BoardHint labels={board} />}

      {/* The board — order, width and visibility come from the layout store */}
      <WidgetBoard
        items={visibleItems}
        widgets={ANALYTICS_WIDGETS}
        ctx={widgetCtx}
        labels={board}
        editing={editing}
        rtl={dir === 'rtl'}
        onMove={moveWidget}
        onSpanChange={setSpan}
        onHide={handleHide}
      />

      {visibleItems.length === 0 && (
        <Card className="ec-card p-6" style={{ textAlign: 'center' }}>
          <p className="m-0 text-sm text-muted-foreground">{board.emptyBoard}</p>
          <Button type="button" className="mt-4" onClick={() => { setEditing(true); setPickerOpen(true); }}>
            <Plus className="size-4" />
            {board.addBlock}
          </Button>
        </Card>
      )}

      {/* Block picker */}
      <AddWidgetDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        hidden={hiddenWidgets}
        onAdd={handleAdd}
        ctx={widgetCtx}
        labels={board}
      />
      <BoardStyles />

      {/* Reset-all confirmation */}
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.deleteConfirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => handleDeleteAnalytics('all')}>
              {t.deleteAll}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style
        dangerouslySetInnerHTML={{
          __html: `
/* Flatten cards: one hairline enclosure, no border+shadow stacking — same values as
   the /admin dashboard's .ec-card (--border / --r-card 14px / --shadow-card). */
.layout-dashboard .analytics-console .ec-card{box-shadow:0 1px 2px rgba(5,17,80,0.04);border:1px solid var(--border,#e4e8f2);border-radius:14px;}
.analytics-console .recharts-default-legend{font-size:12px;}
/* Active-visitors rows are real buttons; background lives here so :hover isn't overridden by inline styles */
.analytics-console .analytics-visitor-row{background:transparent;}
.analytics-console .analytics-visitor-row:hover{background:rgba(53,74,196,.05);}
.analytics-console .analytics-visitor-row.is-selected{background:rgba(53,74,196,.07);}
.analytics-console .analytics-visitor-row:focus-visible{outline:2px solid var(--brand,#354ac4);outline-offset:-2px;}
`,
        }}
      />
    </div>
  );
}
