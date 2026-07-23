'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Trash2,
  RotateCw,
  Smartphone,
  Monitor,
} from 'lucide-react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { toast } from '@/components/shadcn/sonner';
import { Card } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Skeleton } from '@/components/shadcn/skeleton';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/shadcn/select';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/shadcn/table';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/shadcn/alert-dialog';
import { useIsMobile } from '@/hooks/useIsMobile';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useAdminMessages, useAdminI18n } from '@/lib/adminI18n';
import { analyticsMessages } from '@/lib/adminI18n/messages/analytics';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import MetricCardGrid from '@/components/admin/MetricCardGrid';
import { IcEye, IcCursor, IcTrendUp, IcUser, IcChat, IcPhone, IcMail } from '@/components/admin/AdminIcons';
import SectionHeading from '@/components/admin/SectionHeading';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface AnalyticsSummary {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  topProperties: Array<{ propertyId: number; views: number }>;
  topPropertiesByClicks: Array<{
    propertyId: number;
    clicks: number;
    property?: { id: number; title: string; location: string } | null;
  }>;
  clickTypes: Array<{ eventType: string; count: number }>;
  topUsersByClicks?: Array<{ ipAddress: string; clicks: number; userAgent: string | null }>;
  // Real leads (Inquiry table) + acquisition — all computed server-side in the summary endpoint.
  totalInquiries?: number;
  newInquiries?: number;
  inquiriesToday?: number;
  inquiriesLast7Days?: number;
  inquiriesBySource?: Array<{ source: string; count: number }>;
  inquiriesByStatus?: Array<{ status: string; count: number }>;
  trafficSources?: Array<{ source: string; count: number }>;
}

interface PropertyView {
  id: number;
  propertyId: number;
  ipAddress: string;
  userAgent: string | null;
  referer: string | null;
  createdAt: string;
  property: {
    id: number;
    title: string;
    location: string;
  } | null;
}

interface ClickEvent {
  id: number;
  propertyId: number | null;
  eventType: string;
  elementId: string | null;
  elementType: string | null;
  ipAddress: string;
  userAgent: string | null;
  createdAt: string;
  property: {
    id: number;
    title: string;
    location: string;
  } | null;
}

interface ChartDataPoint {
  date: string;
  views: number;
  clicks: number;
  uniqueUsers: number;
}

/* Brand palette — Aiterra: indigo · sky · deep navy, no rainbow */
const NAVY = '#354AC4';
const SKY = '#5594F1'; // sky-blue accent
const SKY_TEXT = '#2A69C4'; // AA-safe accent blue for text on light surfaces
// Categorical sequence kept within the indigo/sky family + neutrals
const COLORS = ['#354AC4', '#5594F1', '#051150', '#2A69C4', '#7BAAF5', '#8F9BD8', '#9AA0AA', '#C9CDD6'];

// Referer buckets / Inquiry.source labels moved into analyticsMessages
// (t.trafficLabels / t.leadSourceLabels) — resolved per locale in the component.
// Matches STATUS_META in /admin/inquiries, tinted to the estate palette.
// Labels live in analyticsMessages (t.statusLabels).
const LEAD_STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  new: { color: SKY_TEXT, bg: 'rgba(85,148,241,.16)' },
  in_progress: { color: NAVY, bg: 'rgba(53,74,196,.08)' },
  closed: { color: '#051150', bg: 'rgba(5,17,80,.07)' },
};

// Compact ranked bar list — used for both traffic sources and lead sources.
// One hairline-separated row per bucket: label · count · share, with a proportional
// bar (top bucket in sky). Deliberately not another pie chart.
function SourceBars({ items, labels }: { items?: Array<{ source: string; count: number }>; labels: Record<string, string> }) {
  const t = useAdminMessages(analyticsMessages);
  const data = (items || []).slice(0, 8);
  const total = data.reduce((s, d) => s + d.count, 0);
  if (!total) return <AdminEmptyState message={t.noDataInRange} />;
  return (
    <div>
      {data.map((d, i) => {
        const pct = Math.round((d.count / total) * 100);
        return (
          <div key={d.source} style={{ padding: '9px 0', borderBottom: i === data.length - 1 ? 'none' : '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>{labels[d.source] || d.source}</span>
              <span style={{ color: '#475569' }}>{d.count} · {pct}%</span>
            </div>
            <div style={{ position: 'relative', height: 6, borderRadius: 4, background: '#F0F1F3' }}>
              <div style={{ position: 'absolute', insetInlineStart: 0, top: 0, height: 6, borderRadius: 4, width: `${pct}%`, background: i === 0 ? SKY : NAVY }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}


export default function AnalyticsPage() {
  const t = useAdminMessages(analyticsMessages);
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

  const getVisitorNumber = (ipAddress: string): string => {
    const visitorNum = ipToVisitorMap.get(ipAddress);
    return visitorNum ? t.visitor(visitorNum) : t.visitor('?');
  };

  const getEventTypeLabel = (eventType: string) => {
    const labels = t.eventTypes as Record<string, string>;
    return labels[eventType] || eventType;
  };

  // Restrained, brand-aligned chip: leads in sky, views in indigo, the rest neutral —
  // replaces the previous rainbow of antd tag presets. Text colors are AA on their tints.
  const LEAD_EVENTS = ['click_phone', 'click_whatsapp', 'click_email', 'contact_form'];
  const getEventChipStyle = (eventType: string): React.CSSProperties => {
    const lead = LEAD_EVENTS.includes(eventType);
    const isView = eventType === 'property_view';
    return {
      background: lead ? 'rgba(85,148,241,.14)' : isView ? 'rgba(53,74,196,.08)' : '#EEF1F7',
      color: lead ? SKY_TEXT : isView ? NAVY : '#475569',
      borderRadius: 9999,
      padding: '2px 9px',
      fontSize: 12,
      fontWeight: 600,
      display: 'inline-block',
      whiteSpace: 'nowrap',
    };
  };

  // Browser + device chip shared by both recent-activity tables and the active-visitors list.
  const renderBrowser = (userAgent: string | null) => {
    if (!userAgent) return '-';
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
    const browser = browsers.find(b => userAgent.includes(b)) || 'Unknown';
    const mobile = userAgent.includes('Mobile');
    return (
      <span title={userAgent} style={{ fontSize: '0.9em', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {mobile ? <Smartphone className="size-4" /> : <Monitor className="size-4" />}
        {browser}
      </span>
    );
  };

  // Engagement = interactions (clicks) per view. This is NOT a conversion rate —
  // real conversion is leads/visitors (shown in the פניות section below). Labeling
  // clicks/views "יחס המרה" (conversion) next to 0 leads read as fake/"каша", so it
  // is honestly surfaced as "מעורבות" (matches the /admin dashboard terminology).
  const engagementRate = summary?.totalViews
    ? ((summary.totalClicks / summary.totalViews) * 100).toFixed(1)
    : '0.0';

  const recentClicks = Array.isArray(clicks) ? clicks.slice(0, 10) : [];
  const recentViews = Array.isArray(views) ? views.slice(0, 10) : [];

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

  // Prepare pie chart data
  const pieChartData = (summary?.clickTypes || []).map(ct => ({
    name: getEventTypeLabel(ct.eventType),
    value: ct.count,
  }));

  // Fewer points on phone (last 7) vs desktop (last 30) — chartData itself is
  // untouched; this is purely a display slice for the area chart.
  const chartMaxChars = isMobile ? 10 : 15;
  const displayChartData = isMobile ? chartData.slice(-7) : chartData.slice(-30);

  // Prepare bar chart data
  const barChartData = (summary?.topPropertiesByClicks || [])
    .slice(0, 8)
    .map(p => ({
      name: p.property ? (p.property.title.length > chartMaxChars ? p.property.title.substring(0, chartMaxChars) + '...' : p.property.title) : t.propertyFallback(p.propertyId),
      clicks: p.clicks,
      fullTitle: p.property?.title || '',
      propertyId: p.propertyId,
    }));

  return (
    <div className="analytics-console">
      {/* Header */}
      <AdminPageHeader
        title={t.title}
        subtitle={t.subtitle}
        extra={
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="button" variant="outline" onClick={fetchAnalytics} disabled={loading}>
              <RotateCw className="size-4" />
              {t.refresh}
            </Button>
            <Button type="button" variant="destructive" onClick={() => setResetOpen(true)}>
              <Trash2 className="size-4" />
              {t.resetData}
            </Button>
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

      {/* Key Metrics Cards */}
      <MetricCardGrid
        items={[
          { icon: <IcEye className="size-5" />, label: t.totalViews, value: summary?.totalViews || 0, accent: NAVY },
          { icon: <IcCursor className="size-5" />, label: t.totalClicks, value: summary?.totalClicks || 0, accent: NAVY },
          { icon: <IcTrendUp className="size-5" />, label: t.engagement, value: Number(engagementRate || 0).toFixed(1), suffix: '%', accent: SKY },
          { icon: <IcUser className="size-5" />, label: t.uniqueUsers, value: summary?.uniqueVisitors || 0, accent: NAVY },
        ]}
      />

      {/* Leads (Inquiry table) — the money metric — plus where traffic and leads come
          from. All values are computed server-side in /api/analytics/track (summary). */}
      <SectionHeading>{t.inquiriesSection}</SectionHeading>
      <MetricCardGrid
        items={[
          { icon: <IcChat className="size-5" />, label: t.totalInquiries, value: summary?.totalInquiries || 0, accent: NAVY },
          { icon: <IcTrendUp className="size-5" />, label: t.newInquiries, value: summary?.newInquiries || 0, accent: SKY },
          { icon: <IcPhone className="size-5" />, label: t.inquiriesToday, value: summary?.inquiriesToday || 0, accent: NAVY },
          { icon: <IcMail className="size-5" />, label: t.inquiriesLast7Days, value: summary?.inquiriesLast7Days || 0, accent: NAVY },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3" style={{ marginBottom: '28px' }}>
        <Card className="ec-card h-full p-6">
          <div className="mb-4" style={{ fontWeight: 600 }}>{t.trafficSources}</div>
          <SourceBars items={summary?.trafficSources} labels={t.trafficLabels} />
        </Card>
        <Card className="ec-card h-full p-6">
          <div className="mb-4" style={{ fontWeight: 600 }}>{t.inquiriesBySource}</div>
          <SourceBars items={summary?.inquiriesBySource} labels={t.leadSourceLabels} />
        </Card>
        <Card className="ec-card h-full p-6">
          <div className="mb-4" style={{ fontWeight: 600 }}>{t.inquiriesByStatus}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(['new', 'in_progress', 'closed'] as const).map((st) => {
              const meta = LEAD_STATUS_STYLES[st];
              const count = summary?.inquiriesByStatus?.find((s) => s.status === st)?.count || 0;
              return (
                <div key={st} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: meta.bg }}>
                  <span style={{ fontWeight: 600, color: meta.color }}>{t.statusLabels[st]}</span>
                  <span style={{ fontWeight: 700, fontSize: 18, color: meta.color }}>{count}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3" style={{ marginBottom: '28px' }}>
        {/* Line Chart */}
        <Card className="ec-card h-full p-6 lg:col-span-2">
          <div className="mb-4" style={{ fontWeight: 600 }}>{t.trendsOverTime}</div>
          {displayChartData.length === 0 ? (
            <AdminEmptyState message={t.noDataInRange} />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={displayChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#354AC4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#354AC4" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={SKY} stopOpacity={0.7}/>
                    <stop offset="95%" stopColor={SKY} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  reversed={dir === 'rtl'}
                  tick={{fontSize: 12}}
                  interval="preserveStartEnd"
                  minTickGap={24}
                  {...(isMobile ? { angle: -45, textAnchor: 'end', height: 50 } : {})}
                />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', direction: dir, textAlign: 'start' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="views" stroke="#354AC4" fillOpacity={1} fill="url(#colorViews)" name={t.viewsLegend} activeDot={{ r: 6 }} isAnimationActive={!reduced} />
                <Area type="monotone" dataKey="clicks" stroke={SKY} fillOpacity={1} fill="url(#colorClicks)" name={t.clicksLegend} activeDot={{ r: 6 }} isAnimationActive={!reduced} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Pie Chart */}
        <Card className="ec-card h-full p-6">
          <div className="mb-4" style={{ fontWeight: 600 }}>{t.actionsDistribution}</div>
          {pieChartData.length === 0 ? (
            <AdminEmptyState message={t.noDataInRange} />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ percent }) => `${(percent ? percent * 100 : 0).toFixed(0)}%`}
                  isAnimationActive={!reduced}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Charts Row - Properties & Users */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" style={{ marginBottom: '28px' }}>
        {/* Bar Chart - Popular Properties */}
        {barChartData.length > 0 && (
          <Card className="ec-card h-full p-6">
            <div className="mb-4" style={{ fontWeight: 600 }}>{t.topProperties}</div>
            <ResponsiveContainer width="100%" height={300}>
              {/* RTL mirror — same approach as the AreaChart above: reverse the value
                  axis so bars grow from the inline-start edge, move category labels to
                  the inline-start side, and swap the asymmetric margins. */}
              <BarChart
                data={barChartData}
                layout="vertical"
                margin={dir === 'rtl' ? { top: 5, right: 20, left: 30, bottom: 5 } : { top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" reversed={dir === 'rtl'} />
                <YAxis
                  dataKey="name"
                  type="category"
                  orientation={dir === 'rtl' ? 'right' : 'left'}
                  width={isMobile ? 90 : 150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                              <div style={{ backgroundColor: '#fff', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, boxShadow: '0 6px 18px rgba(5,17,80,0.08)' }}>
                                  <p style={{ fontWeight: 'bold', margin: 0 }}>{data.fullTitle}</p>
                                  <p style={{ margin: 0, color: SKY_TEXT }}>{t.clicksCount(data.clicks)}</p>
                              </div>
                          );
                      }
                      return null;
                  }}
                />
                <Bar dataKey="clicks" name={t.clicksLegend} radius={(dir === 'rtl' ? [4, 0, 0, 4] : [0, 4, 4, 0]) as [number, number, number, number]} barSize={24} isAnimationActive={!reduced}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? SKY : NAVY} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Top Users by Clicks */}
        {summary?.topUsersByClicks && summary.topUsersByClicks.length > 0 && (
          <Card className={cn('ec-card h-full p-6', barChartData.length === 0 && 'lg:col-span-2')}>
            <div className="mb-4" style={{ fontWeight: 600 }}>{t.activeVisitors}</div>
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {summary.topUsersByClicks.map((user, index) => {
                const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
                const browser = user.userAgent ? browsers.find(b => user.userAgent!.includes(b)) || 'Unknown' : 'Unknown';
                const isMobile = !!user.userAgent?.includes('Mobile');
                const isSelected = selectedIP === user.ipAddress;

                return (
                  <button
                    type="button"
                    key={user.ipAddress}
                    onClick={() => setSelectedIP(user.ipAddress)}
                    className={`analytics-visitor-row${isSelected ? ' is-selected' : ''}`}
                    style={{
                      width: '100%',
                      textAlign: 'start',
                      border: 0,
                      color: 'inherit',
                      font: 'inherit',
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="admin-pill admin-pill--neutral">#{index + 1}</span>
                        <span style={{ fontSize: '0.95em', fontWeight: 700, color: 'var(--brand)' }}>
                          {getVisitorNumber(user.ipAddress)}
                        </span>
                        {isSelected && (
                          <span className="admin-pill admin-pill--neutral">{t.filteredTag}</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85em', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {isMobile ? <Smartphone className="size-4" /> : <Monitor className="size-4" />}
                        {browser}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '1.5em',
                      fontWeight: 'bold',
                      color: 'var(--brand)',
                      minWidth: '60px',
                      textAlign: 'center',
                    }}>
                      {user.clicks}
                      <div className="text-xs font-normal text-muted-foreground">{t.clicksLegend}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      {/* Recent Activity Tables — full-width, stacked one under the other so the
          5-column clicks table has room (side-by-side clipped the date column). */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="ec-card p-6">
          <div className="mb-4" style={{ fontWeight: 600 }}>{t.recentActions}</div>
          {recentClicks.length === 0 ? (
            <AdminEmptyState message={t.noDataInRange} />
          ) : (
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: '25%' }}>{t.colProperty}</TableHead>
                  <TableHead style={{ width: '15%' }}>{t.colAction}</TableHead>
                  <TableHead style={{ width: '18%' }}>{t.colVisitorId}</TableHead>
                  <TableHead style={{ width: '17%' }}>{t.colBrowser}</TableHead>
                  <TableHead style={{ width: '25%' }}>{t.colDate}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentClicks.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {record.property ? (
                        <div>
                          <div style={{ fontWeight: 600 }}>{record.property.title}</div>
                          <div style={{ fontSize: '0.85em', color: '#64748B' }}>#{record.propertyId}</div>
                        </div>
                      ) : record.propertyId ? (
                        <span className="admin-pill admin-pill--neutral">#{record.propertyId}</span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <span style={getEventChipStyle(record.eventType)}>{getEventTypeLabel(record.eventType)}</span>
                    </TableCell>
                    <TableCell>
                      <span style={{ fontWeight: 600, fontSize: '0.9em', color: '#354AC4' }}>{getVisitorNumber(record.ipAddress)}</span>
                    </TableCell>
                    <TableCell>{renderBrowser(record.userAgent)}</TableCell>
                    <TableCell>{dayjs(record.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        <Card className="ec-card p-6">
          <div className="mb-4" style={{ fontWeight: 600 }}>{t.recentViews}</div>
          {recentViews.length === 0 ? (
            <AdminEmptyState message={t.noDataInRange} />
          ) : (
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: '35%' }}>{t.colProperty}</TableHead>
                  <TableHead style={{ width: '20%' }}>{t.colVisitorId}</TableHead>
                  <TableHead style={{ width: '20%' }}>{t.colBrowser}</TableHead>
                  <TableHead style={{ width: '25%' }}>{t.colDate}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentViews.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {record.property ? (
                        <div style={{ fontWeight: 500 }}>
                          <div>{record.property.title}</div>
                          <div style={{ color: '#64748B', fontSize: '0.85em', marginTop: '2px' }}>{record.property.location}</div>
                        </div>
                      ) : (
                        <span style={{ color: '#94A3B8' }}>{t.notAvailable}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span style={{ fontWeight: 600, fontSize: '0.9em', color: '#354AC4' }}>{getVisitorNumber(record.ipAddress)}</span>
                    </TableCell>
                    <TableCell>{renderBrowser(record.userAgent)}</TableCell>
                    <TableCell>{dayjs(record.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

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
