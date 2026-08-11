'use client';

/**
 * Widget registry for /admin/analytics.
 *
 * Every block on the page is one entry here: a title, a default width on the
 * 6-column grid, whether it ships in the stock layout, and a pure render
 * function of AnalyticsWidgetContext. The page owns fetching and the layout
 * store owns order/width/visibility, so adding a new block is a single entry
 * in ANALYTICS_WIDGETS — no changes to the page.
 */

import React from 'react';
import dayjs from 'dayjs';
import { Monitor, Smartphone } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import AdminEmptyState from '@/components/admin/AdminEmptyState';
import MetricCardGrid from '@/components/admin/MetricCardGrid';
import {
  IcChat, IcClock, IcCursor, IcEye, IcMail, IcPhone, IcTrendUp, IcUser,
} from '@/components/admin/AdminIcons';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/shadcn/table';

import type {
  AnalyticsText,
  AnalyticsWidgetContext,
  AnalyticsWidgetDef,
  ClickEvent,
  PropertyView,
} from './types';

/* Brand palette — Aiterra: indigo · sky · deep navy, no rainbow */
export const NAVY = '#354AC4';
export const SKY = '#5594F1'; // sky-blue accent
export const SKY_TEXT = '#2A69C4'; // AA-safe accent blue for text on light surfaces
// Categorical sequence kept within the indigo/sky family + neutrals
const COLORS = ['#354AC4', '#5594F1', '#051150', '#2A69C4', '#7BAAF5', '#8F9BD8', '#9AA0AA', '#C9CDD6'];

// Matches STATUS_META in /admin/inquiries, tinted to the estate palette.
// Labels live in analyticsMessages (t.statusLabels).
const LEAD_STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  new: { color: SKY_TEXT, bg: 'rgba(85,148,241,.16)' },
  in_progress: { color: NAVY, bg: 'rgba(53,74,196,.08)' },
  closed: { color: '#051150', bg: 'rgba(5,17,80,.07)' },
};

const LEAD_EVENTS = ['click_phone', 'click_whatsapp', 'click_email', 'contact_form'];
const BROWSERS = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];

/* ------------------------------------------------------------------ helpers */

function eventTypeLabel(t: AnalyticsText, eventType: string) {
  const labels = t.eventTypes as unknown as Record<string, string>;
  return labels[eventType] || eventType;
}

// Restrained, brand-aligned chip: leads in sky, views in indigo, the rest neutral.
function eventChipStyle(eventType: string): React.CSSProperties {
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
}

function browserOf(userAgent: string | null | undefined) {
  if (!userAgent) return 'Unknown';
  return BROWSERS.find((b) => userAgent.includes(b)) || 'Unknown';
}

// Browser + device chip shared by both recent-activity tables and the active-visitors list.
function renderBrowser(userAgent: string | null) {
  if (!userAgent) return '-';
  const mobile = userAgent.includes('Mobile');
  return (
    <span title={userAgent} style={{ fontSize: '0.9em', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {mobile ? <Smartphone className="size-4" /> : <Monitor className="size-4" />}
      {browserOf(userAgent)}
    </span>
  );
}

/** All tracked events in one list — used by the derived (client-computed) widgets. */
function allEvents(ctx: AnalyticsWidgetContext): Array<PropertyView | ClickEvent> {
  return [...ctx.views, ...ctx.clicks];
}

/**
 * visitor IP → number of distinct days they showed up. Sessions aren't stored
 * on the rows the console loads, so "one visit per active day" is the honest
 * proxy for repeat visits.
 */
function visitsPerVisitor(ctx: AnalyticsWidgetContext): Map<string, number> {
  const days = new Map<string, Set<string>>();
  allEvents(ctx).forEach((e) => {
    const key = e.ipAddress;
    if (!key) return;
    const set = days.get(key) ?? new Set<string>();
    set.add(dayjs(e.createdAt).format('YYYY-MM-DD'));
    days.set(key, set);
  });
  return new Map(Array.from(days.entries()).map(([ip, set]) => [ip, set.size]));
}

/** propertyId → title, harvested from the joined rows the API already returns. */
function propertyTitles(ctx: AnalyticsWidgetContext): Map<number, string> {
  const map = new Map<number, string>();
  ctx.views.forEach((v) => { if (v.property) map.set(v.property.id, v.property.title); });
  ctx.clicks.forEach((c) => { if (c.property) map.set(c.property.id, c.property.title); });
  (ctx.summary?.topPropertiesByClicks || []).forEach((p) => {
    if (p.property) map.set(p.property.id, p.property.title);
  });
  return map;
}

function truncate(value: string, max: number) {
  return value.length > max ? `${value.substring(0, max)}...` : value;
}

/* ---------------------------------------------------------- shared renderers */

/**
 * Compact ranked bar list — one hairline-separated row per bucket: label · count
 * · share, with a proportional bar (top bucket in sky). Deliberately not another
 * pie chart; reused by traffic sources, lead sources, browsers and properties.
 */
function RankedBars({
  items,
  emptyMessage,
  max = 8,
}: {
  items: Array<{ key: string; label: string; count: number }>;
  emptyMessage: string;
  max?: number;
}) {
  const data = items.slice(0, max);
  const total = data.reduce((s, d) => s + d.count, 0);
  if (!total) return <AdminEmptyState message={emptyMessage} />;
  return (
    <div>
      {data.map((d, i) => {
        const pct = Math.round((d.count / total) * 100);
        return (
          <div key={d.key} style={{ padding: '9px 0', borderBottom: i === data.length - 1 ? 'none' : '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 6, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</span>
              <span style={{ color: '#475569', whiteSpace: 'nowrap' }}>{d.count} · {pct}%</span>
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

/** Ranked bars over an API bucket list ({ source, count }) with a label lookup. */
function SourceBars({
  items,
  labels,
  emptyMessage,
}: {
  items?: Array<{ source: string; count: number }>;
  labels: Record<string, string>;
  emptyMessage: string;
}) {
  return (
    <RankedBars
      emptyMessage={emptyMessage}
      items={(items || []).map((d) => ({ key: d.source, label: labels[d.source] || d.source, count: d.count }))}
    />
  );
}

/* ------------------------------------------------------------- the registry */

export const ANALYTICS_WIDGETS: AnalyticsWidgetDef[] = [
  /* ---- KPI rows ---- */
  {
    id: 'kpi-traffic',
    title: ({ t }) => t.trafficKpis,
    defaultSpan: 6,
    defaultVisible: true,
    allowedSpans: [3, 6],
    bare: true,
    render: ({ summary, t }) => {
      // Engagement = interactions (clicks) per view. This is NOT a conversion
      // rate — real conversion is leads/visitors (the leads KPIs below).
      const engagement = summary?.totalViews
        ? ((summary.totalClicks / summary.totalViews) * 100).toFixed(1)
        : '0.0';
      return (
        <MetricCardGrid
          style={{ marginBottom: 0 }}
          items={[
            { icon: <IcEye className="size-5" />, label: t.totalViews, value: summary?.totalViews || 0, accent: NAVY },
            { icon: <IcCursor className="size-5" />, label: t.totalClicks, value: summary?.totalClicks || 0, accent: NAVY },
            { icon: <IcTrendUp className="size-5" />, label: t.engagement, value: engagement, suffix: '%', accent: SKY },
            { icon: <IcUser className="size-5" />, label: t.uniqueUsers, value: summary?.uniqueVisitors || 0, accent: NAVY },
          ]}
        />
      );
    },
  },
  {
    id: 'kpi-leads',
    title: ({ t }) => t.inquiriesSection,
    defaultSpan: 6,
    defaultVisible: true,
    allowedSpans: [3, 6],
    bare: true,
    render: ({ summary, t }) => (
      <MetricCardGrid
        style={{ marginBottom: 0 }}
        items={[
          { icon: <IcChat className="size-5" />, label: t.totalInquiries, value: summary?.totalInquiries || 0, accent: NAVY },
          { icon: <IcTrendUp className="size-5" />, label: t.newInquiries, value: summary?.newInquiries || 0, accent: SKY },
          { icon: <IcPhone className="size-5" />, label: t.inquiriesToday, value: summary?.inquiriesToday || 0, accent: NAVY },
          { icon: <IcMail className="size-5" />, label: t.inquiriesLast7Days, value: summary?.inquiriesLast7Days || 0, accent: NAVY },
        ]}
      />
    ),
  },

  /* ---- acquisition ---- */
  {
    id: 'traffic-sources',
    title: ({ t }) => t.trafficSources,
    defaultSpan: 2,
    defaultVisible: true,
    render: ({ summary, t }) => (
      <SourceBars items={summary?.trafficSources} labels={t.trafficLabels} emptyMessage={t.noDataInRange} />
    ),
  },
  {
    id: 'lead-sources',
    title: ({ t }) => t.inquiriesBySource,
    defaultSpan: 2,
    defaultVisible: true,
    render: ({ summary, t }) => (
      <SourceBars items={summary?.inquiriesBySource} labels={t.leadSourceLabels} emptyMessage={t.noDataInRange} />
    ),
  },
  {
    id: 'lead-status',
    title: ({ t }) => t.inquiriesByStatus,
    defaultSpan: 2,
    defaultVisible: true,
    render: ({ summary, t }) => (
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
    ),
  },

  /* ---- charts ---- */
  {
    id: 'trends',
    title: ({ t }) => t.trendsOverTime,
    defaultSpan: 4,
    defaultVisible: true,
    render: ({ chartData, isMobile, reduced, dir, t }) => {
      // Fewer points on phone (last 7) vs desktop (last 30).
      const data = isMobile ? chartData.slice(-7) : chartData.slice(-30);
      if (data.length === 0) return <AdminEmptyState message={t.noDataInRange} />;
      return (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={NAVY} stopOpacity={0.8} />
                <stop offset="95%" stopColor={NAVY} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={SKY} stopOpacity={0.7} />
                <stop offset="95%" stopColor={SKY} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              reversed={dir === 'rtl'}
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
              minTickGap={24}
              {...(isMobile ? { angle: -45, textAnchor: 'end', height: 50 } : {})}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', direction: dir, textAlign: 'start' }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
            />
            <Legend verticalAlign="top" height={36} />
            <Area type="monotone" dataKey="views" stroke={NAVY} fillOpacity={1} fill="url(#colorViews)" name={t.viewsLegend} activeDot={{ r: 6 }} isAnimationActive={!reduced} />
            <Area type="monotone" dataKey="clicks" stroke={SKY} fillOpacity={1} fill="url(#colorClicks)" name={t.clicksLegend} activeDot={{ r: 6 }} isAnimationActive={!reduced} />
          </AreaChart>
        </ResponsiveContainer>
      );
    },
  },
  {
    id: 'actions-pie',
    title: ({ t }) => t.actionsDistribution,
    defaultSpan: 2,
    defaultVisible: true,
    render: ({ summary, reduced, t }) => {
      const data = (summary?.clickTypes || []).map((ct) => ({
        name: eventTypeLabel(t, ct.eventType),
        value: ct.count,
      }));
      if (data.length === 0) return <AdminEmptyState message={t.noDataInRange} />;
      return (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ percent }) => `${(percent ? percent * 100 : 0).toFixed(0)}%`}
              isAnimationActive={!reduced}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '8px' }} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      );
    },
  },
  {
    id: 'top-properties-clicks',
    title: ({ t }) => t.topProperties,
    defaultSpan: 3,
    defaultVisible: true,
    render: ({ summary, isMobile, reduced, dir, t }) => {
      const maxChars = isMobile ? 10 : 15;
      const data = (summary?.topPropertiesByClicks || []).slice(0, 8).map((p) => ({
        name: p.property ? truncate(p.property.title, maxChars) : t.propertyFallback(p.propertyId),
        clicks: p.clicks,
        fullTitle: p.property?.title || '',
        propertyId: p.propertyId,
      }));
      if (data.length === 0) return <AdminEmptyState message={t.noDataInRange} />;
      return (
        <ResponsiveContainer width="100%" height={300}>
          {/* RTL mirror — reverse the value axis so bars grow from the inline-start
              edge, move category labels to the inline-start side, swap margins. */}
          <BarChart
            data={data}
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
                  const row = payload[0].payload;
                  return (
                    <div style={{ backgroundColor: '#fff', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, boxShadow: '0 6px 18px rgba(5,17,80,0.08)' }}>
                      <p style={{ fontWeight: 'bold', margin: 0 }}>{row.fullTitle}</p>
                      <p style={{ margin: 0, color: SKY_TEXT }}>{t.clicksCount(row.clicks)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="clicks"
              name={t.clicksLegend}
              radius={(dir === 'rtl' ? [4, 0, 0, 4] : [0, 4, 4, 0]) as [number, number, number, number]}
              barSize={24}
              isAnimationActive={!reduced}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? SKY : NAVY} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    },
  },
  {
    id: 'active-visitors',
    title: ({ t }) => t.activeVisitors,
    defaultSpan: 3,
    defaultVisible: true,
    render: ({ summary, selectedIP, setSelectedIP, getVisitorNumber, t }) => {
      const users = summary?.topUsersByClicks || [];
      if (users.length === 0) return <AdminEmptyState message={t.noDataInRange} />;
      return (
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {users.map((user, index) => {
            const mobile = !!user.userAgent?.includes('Mobile');
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
                    {isSelected && <span className="admin-pill admin-pill--neutral">{t.filteredTag}</span>}
                  </div>
                  <div style={{ fontSize: '0.85em', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {mobile ? <Smartphone className="size-4" /> : <Monitor className="size-4" />}
                    {browserOf(user.userAgent)}
                  </div>
                </div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'var(--brand)', minWidth: '60px', textAlign: 'center' }}>
                  {user.clicks}
                  <div className="text-xs font-normal text-muted-foreground">{t.clicksLegend}</div>
                </div>
              </button>
            );
          })}
        </div>
      );
    },
  },

  /* ---- recent activity tables ---- */
  {
    id: 'recent-actions',
    title: ({ t }) => t.recentActions,
    defaultSpan: 3,
    defaultVisible: true,
    render: ({ clicks, getVisitorNumber, t }) => {
      const rows = clicks.slice(0, 10);
      if (rows.length === 0) return <AdminEmptyState message={t.noDataInRange} />;
      return (
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
            {rows.map((record) => (
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
                  <span style={eventChipStyle(record.eventType)}>{eventTypeLabel(t, record.eventType)}</span>
                </TableCell>
                <TableCell>
                  <span style={{ fontWeight: 600, fontSize: '0.9em', color: NAVY }}>{getVisitorNumber(record.ipAddress)}</span>
                </TableCell>
                <TableCell>{renderBrowser(record.userAgent)}</TableCell>
                <TableCell>{dayjs(record.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    },
  },
  {
    id: 'recent-views',
    title: ({ t }) => t.recentViews,
    defaultSpan: 3,
    defaultVisible: true,
    render: ({ views, getVisitorNumber, t }) => {
      const rows = views.slice(0, 10);
      if (rows.length === 0) return <AdminEmptyState message={t.noDataInRange} />;
      return (
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
            {rows.map((record) => (
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
                  <span style={{ fontWeight: 600, fontSize: '0.9em', color: NAVY }}>{getVisitorNumber(record.ipAddress)}</span>
                </TableCell>
                <TableCell>{renderBrowser(record.userAgent)}</TableCell>
                <TableCell>{dayjs(record.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    },
  },

  /* ---- optional blocks: off by default, added from the block picker ---- */
  {
    id: 'visitors-trend',
    title: ({ t }) => t.visitorsTrend,
    defaultSpan: 3,
    defaultVisible: false,
    render: ({ chartData, isMobile, reduced, dir, t }) => {
      const data = isMobile ? chartData.slice(-7) : chartData.slice(-30);
      if (data.length === 0) return <AdminEmptyState message={t.noDataInRange} />;
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={SKY} stopOpacity={0.75} />
                <stop offset="95%" stopColor={SKY} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" reversed={dir === 'rtl'} tick={{ fontSize: 12 }} interval="preserveStartEnd" minTickGap={24} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', direction: dir, textAlign: 'start' }} />
            <Area type="monotone" dataKey="uniqueUsers" stroke={SKY} fillOpacity={1} fill="url(#colorVisitors)" name={t.uniqueUsers} activeDot={{ r: 6 }} isAnimationActive={!reduced} />
          </AreaChart>
        </ResponsiveContainer>
      );
    },
  },
  {
    id: 'top-properties-views',
    title: ({ t }) => t.topPropertiesViews,
    defaultSpan: 3,
    defaultVisible: false,
    render: (ctx) => {
      const { summary, t } = ctx;
      const titles = propertyTitles(ctx);
      const items = (summary?.topProperties || []).map((p) => ({
        key: String(p.propertyId),
        label: titles.get(p.propertyId) || t.propertyFallback(p.propertyId),
        count: p.views,
      }));
      return <RankedBars items={items} emptyMessage={t.noDataInRange} />;
    },
  },
  {
    id: 'device-split',
    title: ({ t }) => t.deviceSplit,
    defaultSpan: 2,
    defaultVisible: false,
    render: (ctx) => {
      const { t, reduced } = ctx;
      let mobile = 0;
      let desktop = 0;
      allEvents(ctx).forEach((e) => {
        if (!e.userAgent) return;
        if (e.userAgent.includes('Mobile')) mobile++;
        else desktop++;
      });
      if (mobile + desktop === 0) return <AdminEmptyState message={t.noDataInRange} />;
      const data = [
        { name: t.deviceMobile, value: mobile },
        { name: t.deviceDesktop, value: desktop },
      ];
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={5}
              dataKey="value"
              label={({ percent }) => `${(percent ? percent * 100 : 0).toFixed(0)}%`}
              isAnimationActive={!reduced}
            >
              <Cell fill={SKY} />
              <Cell fill={NAVY} />
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 8 }} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      );
    },
  },
  {
    id: 'browser-split',
    title: ({ t }) => t.browserSplit,
    defaultSpan: 2,
    defaultVisible: false,
    render: (ctx) => {
      const counts = new Map<string, number>();
      allEvents(ctx).forEach((e) => {
        const name = browserOf(e.userAgent);
        counts.set(name, (counts.get(name) || 0) + 1);
      });
      const items = Array.from(counts.entries())
        .map(([name, count]) => ({ key: name, label: name, count }))
        .sort((a, b) => b.count - a.count);
      return <RankedBars items={items} emptyMessage={ctx.t.noDataInRange} />;
    },
  },
  {
    id: 'hourly-activity',
    title: ({ t }) => t.hourlyActivity,
    defaultSpan: 3,
    defaultVisible: false,
    render: (ctx) => {
      const { t, dir, reduced } = ctx;
      const events = allEvents(ctx);
      if (events.length === 0) return <AdminEmptyState message={t.noDataInRange} />;
      const buckets = Array.from({ length: 24 }, (_, h) => ({ label: `${String(h).padStart(2, '0')}:00`, events: 0 }));
      events.forEach((e) => { buckets[dayjs(e.createdAt).hour()].events++; });
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={buckets} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" reversed={dir === 'rtl'} tick={{ fontSize: 11 }} interval={ctx.isMobile ? 5 : 2} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip cursor={{ fill: 'rgba(53,74,196,.06)' }} contentStyle={{ borderRadius: 8, direction: dir, textAlign: 'start' }} />
            <Bar dataKey="events" name={t.eventsLegend} fill={NAVY} radius={[4, 4, 0, 0]} isAnimationActive={!reduced} />
          </BarChart>
        </ResponsiveContainer>
      );
    },
  },
  {
    id: 'weekday-activity',
    title: ({ t }) => t.weekdayActivity,
    defaultSpan: 3,
    defaultVisible: false,
    render: (ctx) => {
      const { t, dir, reduced } = ctx;
      const events = allEvents(ctx);
      if (events.length === 0) return <AdminEmptyState message={t.noDataInRange} />;
      const buckets = Array.from({ length: 7 }, (_, d) => ({ label: t.weekdayShort(d), views: 0, clicks: 0 }));
      ctx.views.forEach((v) => { buckets[dayjs(v.createdAt).day()].views++; });
      ctx.clicks.forEach((c) => { buckets[dayjs(c.createdAt).day()].clicks++; });
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={buckets} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" reversed={dir === 'rtl'} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip cursor={{ fill: 'rgba(53,74,196,.06)' }} contentStyle={{ borderRadius: 8, direction: dir, textAlign: 'start' }} />
            <Legend verticalAlign="top" height={30} />
            <Bar dataKey="views" name={t.viewsLegend} fill={NAVY} radius={[4, 4, 0, 0]} isAnimationActive={!reduced} />
            <Bar dataKey="clicks" name={t.clicksLegend} fill={SKY} radius={[4, 4, 0, 0]} isAnimationActive={!reduced} />
          </BarChart>
        </ResponsiveContainer>
      );
    },
  },
  {
    id: 'funnel',
    title: ({ t }) => t.funnel,
    defaultSpan: 2,
    defaultVisible: false,
    render: ({ summary, t }) => {
      const steps = [
        { key: 'views', label: t.totalViews, value: summary?.totalViews || 0, color: NAVY },
        { key: 'clicks', label: t.totalClicks, value: summary?.totalClicks || 0, color: SKY },
        { key: 'leads', label: t.totalInquiries, value: summary?.totalInquiries || 0, color: SKY_TEXT },
      ];
      const top = steps[0].value;
      if (!top) return <AdminEmptyState message={t.noDataInRange} />;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((step, i) => {
            const prev = i === 0 ? 0 : steps[i - 1].value;
            const share = Math.min(100, Math.round((step.value / top) * 100));
            const rate = i === 0 || !prev ? null : ((step.value / prev) * 100).toFixed(1);
            return (
              <div key={step.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 6, fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{step.label}</span>
                  <span style={{ color: '#475569', whiteSpace: 'nowrap' }}>
                    {step.value.toLocaleString('en-US')}
                    {rate !== null && <span style={{ color: '#94A3B8' }}> · {t.ofPrevious(rate)}</span>}
                  </span>
                </div>
                <div style={{ position: 'relative', height: 12, borderRadius: 6, background: '#F0F1F3' }}>
                  <div style={{ position: 'absolute', insetInlineStart: 0, top: 0, height: 12, borderRadius: 6, width: `${Math.max(share, 2)}%`, background: step.color }} />
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    id: 'averages-kpis',
    title: ({ t }) => t.averagesKpis,
    defaultSpan: 6,
    defaultVisible: false,
    allowedSpans: [3, 6],
    bare: true,
    render: (ctx) => {
      const { t, chartData } = ctx;
      const days = chartData.length || 1;
      const avgViews = Math.round(chartData.reduce((s, d) => s + d.views, 0) / days);
      const avgClicks = Math.round(chartData.reduce((s, d) => s + d.clicks, 0) / days);

      const events = allEvents(ctx);
      const hours = new Array(24).fill(0);
      const weekdays = new Array(7).fill(0);
      events.forEach((e) => {
        const d = dayjs(e.createdAt);
        hours[d.hour()]++;
        weekdays[d.day()]++;
      });
      const peakHour = events.length ? hours.indexOf(Math.max(...hours)) : -1;
      const peakDay = events.length ? weekdays.indexOf(Math.max(...weekdays)) : -1;

      return (
        <MetricCardGrid
          style={{ marginBottom: 0 }}
          items={[
            { icon: <IcEye className="size-5" />, label: t.avgViewsPerDay, value: avgViews, accent: NAVY },
            { icon: <IcCursor className="size-5" />, label: t.avgClicksPerDay, value: avgClicks, accent: NAVY },
            { icon: <IcClock className="size-5" />, label: t.peakHour, value: peakHour < 0 ? t.noHourData : `${String(peakHour).padStart(2, '0')}:00`, accent: SKY },
            { icon: <IcTrendUp className="size-5" />, label: t.peakDay, value: peakDay < 0 ? t.noHourData : t.weekdayShort(peakDay), accent: NAVY },
          ]}
        />
      );
    },
  },
  {
    id: 'property-performance',
    title: ({ t }) => t.propertyPerformance,
    defaultSpan: 3,
    defaultVisible: false,
    render: (ctx) => {
      const { summary, t } = ctx;
      const titles = propertyTitles(ctx);
      // Views and clicks arrive as two separate top-lists — join them per property
      // so the table can show the action rate, which neither list carries alone.
      const rows = new Map<number, { views: number; clicks: number }>();
      (summary?.topProperties || []).forEach((p) => {
        rows.set(p.propertyId, { views: p.views, clicks: 0 });
      });
      (summary?.topPropertiesByClicks || []).forEach((p) => {
        const row = rows.get(p.propertyId) || { views: 0, clicks: 0 };
        row.clicks = p.clicks;
        rows.set(p.propertyId, row);
      });
      const data = Array.from(rows.entries())
        .map(([propertyId, r]) => ({ propertyId, ...r }))
        .sort((a, b) => b.views + b.clicks - (a.views + a.clicks))
        .slice(0, 10);
      if (data.length === 0) return <AdminEmptyState message={t.noDataInRange} />;
      return (
        <Table className="min-w-[420px]">
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: '46%' }}>{t.colProperty}</TableHead>
              <TableHead style={{ width: '18%' }}>{t.colViews}</TableHead>
              <TableHead style={{ width: '18%' }}>{t.colClicks}</TableHead>
              <TableHead style={{ width: '18%' }}>{t.colCtr}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.propertyId}>
                <TableCell>
                  <span style={{ fontWeight: 600 }}>{titles.get(row.propertyId) || t.propertyFallback(row.propertyId)}</span>
                </TableCell>
                <TableCell><span style={{ fontVariantNumeric: 'tabular-nums' }}>{row.views}</span></TableCell>
                <TableCell><span style={{ fontVariantNumeric: 'tabular-nums' }}>{row.clicks}</span></TableCell>
                <TableCell>
                  <span style={{ color: SKY_TEXT, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {row.views ? `${Math.round((row.clicks / row.views) * 100)}%` : '—'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    },
  },
  {
    id: 'event-types-table',
    title: ({ t }) => t.eventTypesTable,
    defaultSpan: 2,
    defaultVisible: false,
    render: ({ summary, t }) => {
      const rows = (summary?.clickTypes || []).slice().sort((a, b) => b.count - a.count);
      const total = rows.reduce((s, r) => s + r.count, 0);
      if (!total) return <AdminEmptyState message={t.noDataInRange} />;
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: '54%' }}>{t.colAction}</TableHead>
              <TableHead style={{ width: '23%' }}>{t.clicksLegend}</TableHead>
              <TableHead style={{ width: '23%' }}>{t.colShare}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.eventType}>
                <TableCell>
                  <span style={eventChipStyle(r.eventType)}>{eventTypeLabel(t, r.eventType)}</span>
                </TableCell>
                <TableCell><span style={{ fontVariantNumeric: 'tabular-nums' }}>{r.count}</span></TableCell>
                <TableCell>
                  <span style={{ color: '#475569', fontVariantNumeric: 'tabular-nums' }}>
                    {Math.round((r.count / total) * 100)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    },
  },
  {
    id: 'returning-visitors',
    title: ({ t }) => t.returningVisitors,
    defaultSpan: 2,
    defaultVisible: false,
    render: (ctx) => {
      const { t, reduced } = ctx;
      const perIp = visitsPerVisitor(ctx);
      if (perIp.size === 0) return <AdminEmptyState message={t.noDataInRange} />;
      let one = 0;
      let many = 0;
      perIp.forEach((count) => { if (count > 1) many++; else one++; });
      const data = [
        { name: t.visitorReturning, value: many },
        { name: t.visitorNew, value: one },
      ];
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={5}
              dataKey="value"
              label={({ percent }) => `${(percent ? percent * 100 : 0).toFixed(0)}%`}
              isAnimationActive={!reduced}
            >
              <Cell fill={SKY} />
              <Cell fill={NAVY} />
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 8 }} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      );
    },
  },
  {
    id: 'visit-frequency',
    title: ({ t }) => t.visitFrequency,
    defaultSpan: 2,
    defaultVisible: false,
    render: (ctx) => {
      const { t } = ctx;
      const perIp = visitsPerVisitor(ctx);
      const buckets = [
        { key: '1', label: t.visitBucketOne, min: 1, max: 1 },
        { key: '2-3', label: t.visitBucket('2–3'), min: 2, max: 3 },
        { key: '4-10', label: t.visitBucket('4–10'), min: 4, max: 10 },
        { key: '11+', label: t.visitBucket('11+'), min: 11, max: Infinity },
      ];
      const items = buckets.map((b) => {
        let count = 0;
        perIp.forEach((n) => { if (n >= b.min && n <= b.max) count++; });
        return { key: b.key, label: b.label, count };
      });
      return <RankedBars items={items} emptyMessage={t.noDataInRange} />;
    },
  },
  {
    id: 'engagement-trend',
    title: ({ t }) => t.engagementTrend,
    defaultSpan: 3,
    defaultVisible: false,
    render: ({ chartData, isMobile, reduced, dir, t }) => {
      const source = isMobile ? chartData.slice(-7) : chartData.slice(-30);
      const data = source.map((d) => ({
        date: d.date,
        rate: d.views ? Math.round((d.clicks / d.views) * 100) : 0,
      }));
      if (data.length === 0) return <AdminEmptyState message={t.noDataInRange} />;
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={SKY_TEXT} stopOpacity={0.7} />
                <stop offset="95%" stopColor={SKY_TEXT} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" reversed={dir === 'rtl'} tick={{ fontSize: 12 }} interval="preserveStartEnd" minTickGap={24} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 8, direction: dir, textAlign: 'start' }} />
            <Area type="monotone" dataKey="rate" stroke={SKY_TEXT} fillOpacity={1} fill="url(#colorEngagement)" name={t.engagementLegend} activeDot={{ r: 6 }} isAnimationActive={!reduced} />
          </AreaChart>
        </ResponsiveContainer>
      );
    },
  },
  {
    id: 'busiest-days',
    title: ({ t }) => t.busiestDays,
    defaultSpan: 2,
    defaultVisible: false,
    render: ({ chartData, t }) => {
      const items = chartData
        .map((d) => ({ key: d.date, label: d.date, count: d.views + d.clicks }))
        .filter((d) => d.count > 0)
        .sort((a, b) => b.count - a.count);
      return <RankedBars items={items} emptyMessage={t.noDataInRange} />;
    },
  },
];

export const WIDGETS_BY_ID: Record<string, AnalyticsWidgetDef> = Object.fromEntries(
  ANALYTICS_WIDGETS.map((w) => [w.id, w])
);
