'use client';

/**
 * Widget registry for the admin dashboard (/admin).
 *
 * Each block is one entry: a title, a default width on the 6-column board and a
 * pure render function of DashboardContext. Every block renders its own card
 * chrome (`bare: true`) so the console's visual language is unchanged — the
 * board only owns order, width and visibility.
 */

import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { ArrowLeft, ArrowRight, Image as ImageIcon } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Skeleton } from '@/components/shadcn/skeleton';
import { getCityLabel } from '@/data/cities';
import { getMessages, type AdminLocale, type MessagesShape } from '@/lib/adminI18n';
import { analyticsMessages } from '@/lib/adminI18n/messages/analytics';
import type { dashboardMessages } from '@/lib/adminI18n/messages/dashboard';
import type { BoardWidgetDef } from '@/components/admin/board/types';

/* ===== palette — tokens from src/styles/admin-design.css (single source of truth).
   Indigo (BRAND / BRAND_SKY) is rationed to DATA MARKS ONLY (chart lines, composition
   bar fills) and to CTAs/active states. Every resting figure is ink. ===== */
const BRAND = '#354AC4';      // --brand — primary data line + composition fill + CTAs
const BRAND_SKY = '#5594F1';  // --brand-sky — secondary data line + composition fill
const BRAND_WASH = '#EEF1FB'; // --brand-wash — chart area fill
const INK = '#051150';        // --text-ink — every KPI / static figure
const MUTED = '#6C76A0';      // --text-muted — labels / axis
const DIVIDER = '#EEF1F7';    // --divider — gridlines / hairlines
const BORDER = '#E3E8F2';     // --border — tooltip hairline

export const WINDOW_DAYS = 14; // trend window; the full, filterable analytics lives on /admin/analytics
const NOTIFICATION_SOLD = 'property_sold'; // mirrors src/lib/notifications.ts
const BUBBLE_WINDOW_DAYS = 7; // a sale older than this is no longer "news" on the team card

/** Resolved dashboard message record for the active locale. */
export type DashboardT = MessagesShape<(typeof dashboardMessages)['he']>;

/* ===== types ===== */
export interface PropertyRow {
  id: number;
  dealType: 'sale' | 'rent';
  city: string;
  propertyType: string;
  rooms: number;
  area: number;
  price: string;
  originalPrice: string | null;
  images: string[];
  isActive: boolean;
  isSold: boolean;
  isPinned: boolean;
  isHotProposition?: boolean;
  isNoCommission?: boolean;
  title: string;
  location: string;
  createdAt: string;
}

export interface Summary {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  clickTypes: Array<{ eventType: string; count: number }>;
  // Real lead/inquiry stats (from the Inquiry table)
  totalInquiries?: number;
  newInquiries?: number;
  inquiriesToday?: number;
  inquiriesLast7Days?: number;
  // 14-day sparkline + today's views, aggregated server-side.
  dailySeries?: Array<{ date: string; views: number; clicks: number }>;
  viewsToday?: number;
  // Acquisition + per-property activity — same summary call, used by the
  // optional traffic blocks.
  trafficSources?: Array<{ source: string; count: number }>;
  topPropertiesByClicks?: Array<{
    propertyId: number;
    clicks: number;
    property?: { id: number; title: string; location: string } | null;
  }>;
}

export interface SeriesPoint {
  date: string;
  views: number;
  clicks: number;
}

export interface PortfolioStats {
  total: number;
  portfolioValue: number;
  activeCount: number;
  saleCount: number;
  rentCount: number;
  salePct: number;
  avgPrice: number;
  maxPrice: number;
  newThisWeek: number;
  priceDrops: number;
  noPhotos: number;
  hidden: number;
  soldCount: number;
  pinnedCount: number;
  hotCount: number;
  typeCounts: Array<{ type: string; count: number; label: string }>;
  cityCounts: Array<{ label: string; count: number }>;
  recentListings: PropertyRow[];
  oldestListings: PropertyRow[];
  /** Listing counts per PRICE_BUCKETS key. */
  priceBuckets: Record<string, number>;
  /** Listing counts per AREA_BUCKETS key. */
  areaBuckets: Record<string, number>;
  roomCounts: Array<{ rooms: number; count: number }>;
  avgPriceByCity: Array<{ label: string; avg: number; count: number }>;
  /** Actionable queues, biggest drop / newest first. */
  priceDropListings: Array<PropertyRow & { drop: number }>;
  noPhotoListings: PropertyRow[];
}

/** Fixed ILS price buckets — readable without a legend and stable as stock changes. */
export const PRICE_BUCKETS = [
  { key: 'b0', min: 0, max: 1_000_000 },
  { key: 'b1', min: 1_000_000, max: 2_000_000 },
  { key: 'b2', min: 2_000_000, max: 3_000_000 },
  { key: 'b3', min: 3_000_000, max: 5_000_000 },
  { key: 'b4', min: 5_000_000, max: Infinity },
] as const;

/** Floor-area buckets in m². */
export const AREA_BUCKETS = [
  { key: 'a0', min: 0, max: 60 },
  { key: 'a1', min: 60, max: 90 },
  { key: 'a2', min: 90, max: 120 },
  { key: 'a3', min: 120, max: 160 },
  { key: 'a4', min: 160, max: Infinity },
] as const;

export interface DashboardMetrics {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  leadSignals: number;
  engagement: string;
  conversion: string;
  viewsToday: number;
  leadsToday: number;
  viewsDelta: number | null;
  interactionsDelta: number | null;
  trendEmpty: boolean;
}

export interface TeamMemberRow {
  id: number;
  name: string;
  role: string;
  image: string | null;
  isActive: boolean;
  propertiesCount?: number;
  soldCount?: number;
}

/** Row of the admin activity feed — see src/lib/notifications.ts. */
export interface NotificationRow {
  id: number;
  type: string;
  agentId: string | null;
  agentName: string | null;
  propertyId: number | null;
  propertyTitle: string | null;
  createdAt: string;
  readAt: string | null;
}

/** Everything the dashboard blocks render from. */
export interface DashboardContext {
  t: DashboardT;
  /** Needed by blocks that reuse the analytics label sets (traffic sources). */
  locale: AdminLocale;
  dir: 'rtl' | 'ltr';
  summary: Summary | null;
  propsLoading: boolean;
  trafficLoading: boolean;
  portfolio: PortfolioStats;
  series: SeriesPoint[];
  metrics: DashboardMetrics;
  /** Fetched only while the team block is on the board. */
  team: TeamMemberRow[];
  teamLoading: boolean;
  /** Fetched only while the team or notifications block is on the board. */
  notifications: NotificationRow[];
  notificationsLoading: boolean;
}

/** Blocks that need data beyond the two standing dashboard fetches. */
export const TEAM_WIDGET_ID = 'team-preview';
export const NOTIFICATIONS_WIDGET_ID = 'notifications';

export type DashboardWidgetDef = BoardWidgetDef<DashboardContext>;

/* ===== helpers ===== */
export const parseMoney = (s: string | null | undefined): number =>
  parseInt(String(s ?? '0').replace(/[^0-9]/g, ''), 10) || 0;

export const ils = (n: number): string => '₪' + n.toLocaleString('en-US');

/** Compact money for bucket labels: ₪1.5M / ₪800K. */
const ilsShort = (n: number): string =>
  n >= 1_000_000
    ? '₪' + (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + 'M'
    : '₪' + Math.round(n / 1000) + 'K';

/** Self-contained long date (no dayjs locale dependency): "1 ביולי 2026" / "1 July 2026". */
export const formatLongDate = (d: ReturnType<typeof dayjs>, t: DashboardT): string =>
  t.longDate(d.date(), d.month(), d.year());

/** Human relative age for a listing — keeps recent rows feeling live, not template-y. */
const relDaysLabel = (iso: string, t: DashboardT): string => {
  const days = dayjs().startOf('day').diff(dayjs(iso).startOf('day'), 'day');
  if (days <= 0) return t.addedToday;
  if (days === 1) return t.addedYesterday;
  if (days < 7) return t.daysAgo(days);
  if (days < 14) return t.weekAgo;
  return t.weeksAgo(Math.floor(days / 7));
};

/** Bidi-isolated, tabular-numeral wrapper so ₪/%/commas/digits never reorder in RTL. */
const Num: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span dir="ltr" style={{ fontVariantNumeric: 'tabular-nums', unicodeBidi: 'isolate', display: 'inline-block', ...style }}>
    {children}
  </span>
);

/** Quiet section micro-label — hierarchy via size + whitespace, no eyebrow trope. */
const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, ...style }}>{children}</div>
);

/** Section title — 15/600 ink, no letter-spacing (RTL hierarchy = weight + color). */
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontSize: 15, fontWeight: 600, color: INK }}>{children}</span>
);

/** Local card shell — quiet by default (`--shadow-card` + hairline); pass `className="ec-card--hero"` for the one data hero. */
function ECard({ title, extra, style, className, children }: { title?: React.ReactNode; extra?: React.ReactNode; style?: React.CSSProperties; className?: string; children: React.ReactNode }) {
  return (
    <div className={`ec-card${className ? ' ' + className : ''}`} style={{ height: '100%', ...style }}>
      {(title || extra) && <div className="ec-card-head">{title}{extra}</div>}
      <div className="ec-card-body">{children}</div>
    </div>
  );
}

/** Skeleton paragraph — a stack of full-width lines. */
function SkelLines({ rows }: { rows: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

/** One KPI tile inside `.ec-kpi-strip`: muted label → ink tabular value → optional delta. */
function KpiTile({ label, value, delta, loading }: { label: string; value: number | string; delta?: React.ReactNode; loading?: boolean }) {
  return (
    <div className="ec-kpi-tile">
      <div className="lbl">{label}</div>
      <div className="val">
        {loading
          ? <Skeleton className="h-8.25 w-16" />
          : <bdi dir="ltr">{typeof value === 'number' ? value.toLocaleString('en-US') : value}</bdi>}
      </div>
      {!loading && delta}
    </div>
  );
}

/**
 * Ranked rows in the console's own language: label · count with a proportional
 * hairline bar. Used by the distribution blocks (rooms, area, cities, traffic).
 */
function BarRows({ items, emptyText, max = 8 }: {
  items: Array<{ key: string; label: string; count: number; note?: string }>;
  emptyText: string;
  max?: number;
}) {
  const data = items.slice(0, max);
  const top = data.reduce((m, d) => Math.max(m, d.count), 0);
  if (!top) return <EmptyBlock height={120} text={emptyText} />;
  return (
    <div>
      {data.map((d) => (
        <div key={d.key} style={{ paddingBlock: 9 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBlockEnd: 6 }}>
            <span className="ec-typelabel">{d.label}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {d.note && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}><Num>{d.note}</Num></span>}
              <span className="ec-countbadge"><Num>{d.count}</Num></span>
            </span>
          </div>
          <div style={{ position: 'relative', height: 6, borderRadius: 4, background: 'var(--surface-sunken)' }}>
            <div style={{ position: 'absolute', insetInlineStart: 0, top: 0, height: 6, borderRadius: 4, width: `${Math.round((d.count / top) * 100)}%`, background: BRAND }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Attention row — whole-row click target, tone-coded dot, neutral count badge, hover chevron. */
function AttentionRow({ label, count, tone, href = '/admin/properties', t, dir }: {
  label: string; count: number; tone: 'warn' | 'neg' | 'muted'; href?: string; t: DashboardT; dir: 'rtl' | 'ltr';
}) {
  const Fwd = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const ok = count === 0;
  const dotColor = ok
    ? 'var(--text-faint)'
    : tone === 'neg'
      ? 'var(--neg)'
      : tone === 'warn'
        ? 'var(--warn)'
        : 'var(--text-faint)';
  return (
    <Link href={href} className="ec-row ec-attrow">
      <span className="ec-attdot" style={{ background: dotColor }} />
      <span className="ec-attlabel" style={{ color: ok ? 'var(--text-muted)' : 'var(--text-body)' }}>{label}</span>
      {ok ? (
        <span className="ec-att-clear">{t.allClear}</span>
      ) : (
        <>
          <span className="ec-att-count"><bdi dir="ltr">{count}</bdi></span>
          <Fwd className="ec-att-chev size-4" />
        </>
      )}
    </Link>
  );
}

function EmptyBlock({ height, text }: { height: number; text: string }) {
  return (
    <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13.5, textAlign: 'center', padding: 16 }}>
      {text}
    </div>
  );
}

/** Listing row shared by the listing blocks; `priceNote` shows the previous price. */
function ListingRow({ x, t, priceNote }: { x: PropertyRow; t: DashboardT; priceNote?: string }) {
  return (
    <Link href="/admin/properties" className="ec-row ec-listrow">
      {x.images && x.images.length > 0 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={x.images[0]} alt={x.title} className="ec-thumb" loading="lazy" />
      ) : (
        <span className="ec-thumb ec-thumb-empty">
          <ImageIcon style={{ color: 'var(--text-faint)' }} className="size-4" />
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="ec-listtitle">{x.title}</div>
        <div className="ec-listmeta">
          {getCityLabel(x.city) || x.location} · <Num>{x.rooms}</Num> {t.roomsAbbr} · <Num>{x.area}</Num> {t.sqmAbbr} · {relDaysLabel(x.createdAt, t)}
        </div>
      </div>
      <span className="ec-listprice">
        <Num>{ils(parseMoney(x.price))}</Num>
        {priceNote && (
          <span style={{ display: 'block', fontSize: 11.5, fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
            {priceNote}
          </span>
        )}
      </span>
      <span className={`ec-dealpill ${x.dealType === 'sale' ? 'sale' : 'rent'}`}>
        {x.dealType === 'sale' ? t.dealSale : t.dealRent}
      </span>
    </Link>
  );
}

/* ===== derived data (pure — the page memoises these) ===== */
export function computePortfolio(p: PropertyRow[], t: DashboardT): PortfolioStats {
  const total = p.length;
  const portfolioValue = p.reduce((a, x) => a + parseMoney(x.price), 0);
  const byDate = [...p].sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix());

  const typeLabels: Record<string, string> = t.propertyTypes;
  const typeMap = new Map<string, number>();
  p.forEach((x) => typeMap.set(x.propertyType, (typeMap.get(x.propertyType) || 0) + 1));
  const typeCounts = Array.from(typeMap.entries())
    .map(([type, count]) => ({ type, count, label: typeLabels[type] || type }))
    .sort((a, b) => b.count - a.count);

  const cityMap = new Map<string, number>();
  p.forEach((x) => cityMap.set(x.city, (cityMap.get(x.city) || 0) + 1));
  const cityCounts = Array.from(cityMap.entries())
    .map(([city, count]) => ({ label: getCityLabel(city) || city, count }))
    .sort((a, b) => b.count - a.count);

  const priceBuckets: Record<string, number> = Object.fromEntries(PRICE_BUCKETS.map((b) => [b.key, 0]));
  const areaBuckets: Record<string, number> = Object.fromEntries(AREA_BUCKETS.map((b) => [b.key, 0]));
  const roomMap = new Map<number, number>();
  const cityTotals = new Map<string, { sum: number; count: number }>();

  p.forEach((x) => {
    const price = parseMoney(x.price);
    const priceBucket = PRICE_BUCKETS.find((b) => price >= b.min && price < b.max);
    if (priceBucket) priceBuckets[priceBucket.key] += 1;

    const areaBucket = AREA_BUCKETS.find((b) => x.area >= b.min && x.area < b.max);
    if (areaBucket) areaBuckets[areaBucket.key] += 1;

    if (x.rooms) roomMap.set(x.rooms, (roomMap.get(x.rooms) || 0) + 1);

    // Rentals and sales have incomparable price scales — average sale prices only.
    if (x.dealType === 'sale' && price > 0) {
      const label = getCityLabel(x.city) || x.city;
      const acc = cityTotals.get(label) || { sum: 0, count: 0 };
      acc.sum += price;
      acc.count += 1;
      cityTotals.set(label, acc);
    }
  });

  const roomCounts = Array.from(roomMap.entries())
    .map(([rooms, count]) => ({ rooms, count }))
    .sort((a, b) => a.rooms - b.rooms);

  const avgPriceByCity = Array.from(cityTotals.entries())
    .map(([label, acc]) => ({ label, avg: Math.round(acc.sum / acc.count), count: acc.count }))
    .sort((a, b) => b.avg - a.avg);

  const priceDropListings = p
    .filter((x) => x.originalPrice && parseMoney(x.originalPrice) > parseMoney(x.price))
    .map((x) => ({ ...x, drop: parseMoney(x.originalPrice) - parseMoney(x.price) }))
    .sort((a, b) => b.drop - a.drop)
    .slice(0, 6);

  const noPhotoListings = p.filter((x) => !x.images || x.images.length === 0).slice(0, 6);

  return {
    total,
    portfolioValue,
    activeCount: p.filter((x) => x.isActive).length,
    saleCount: p.filter((x) => x.dealType === 'sale').length,
    rentCount: p.filter((x) => x.dealType === 'rent').length,
    salePct: total ? Math.round((p.filter((x) => x.dealType === 'sale').length / total) * 100) : 0,
    avgPrice: total ? Math.round(portfolioValue / total) : 0,
    maxPrice: p.reduce((m, x) => Math.max(m, parseMoney(x.price)), 0),
    newThisWeek: p.filter((x) => dayjs().diff(dayjs(x.createdAt), 'day') < 7).length,
    priceDrops: p.filter((x) => x.originalPrice && parseMoney(x.originalPrice) > parseMoney(x.price)).length,
    noPhotos: p.filter((x) => !x.images || x.images.length === 0).length,
    hidden: p.filter((x) => !x.isActive).length,
    soldCount: p.filter((x) => x.isSold).length,
    pinnedCount: p.filter((x) => x.isPinned).length,
    hotCount: p.filter((x) => x.isHotProposition).length,
    typeCounts,
    cityCounts,
    recentListings: byDate.slice(0, 5),
    oldestListings: byDate.slice(-5).reverse(),
    priceBuckets,
    areaBuckets,
    roomCounts,
    avgPriceByCity,
    priceDropListings,
    noPhotoListings,
  };
}

export function computeMetrics(summary: Summary | null, series: SeriesPoint[]): DashboardMetrics {
  const totalViews = summary?.totalViews ?? 0;
  const totalClicks = summary?.totalClicks ?? 0;
  const uniqueVisitors = summary?.uniqueVisitors ?? 0;
  // Real leads from the Inquiry table (actual submitted contact forms).
  const leadSignals = summary?.totalInquiries ?? 0;

  const last7 = series.slice(-7);
  const prior7 = series.slice(-14, -7);
  const sum = (a: SeriesPoint[], k: 'views' | 'clicks') => a.reduce((s, d) => s + d[k], 0);
  const pct = (n: number, p: number): number | null => (p > 0 ? Math.round(((n - p) / p) * 100) : null);

  return {
    totalViews,
    totalClicks,
    uniqueVisitors,
    leadSignals,
    // מעורבות (engagement) = interactions per view — NOT conversion.
    engagement: totalViews ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0',
    // יחס המרה (real conversion) = submitted inquiries per unique visitor.
    conversion: uniqueVisitors ? ((leadSignals / uniqueVisitors) * 100).toFixed(1) : '0.0',
    viewsToday: summary?.viewsToday ?? 0,
    leadsToday: summary?.inquiriesToday ?? 0,
    viewsDelta: pct(sum(last7, 'views'), sum(prior7, 'views')),
    interactionsDelta: pct(sum(last7, 'clicks'), sum(prior7, 'clicks')),
    trendEmpty: series.every((d) => d.views === 0 && d.clicks === 0),
  };
}

/* Bidi-isolated delta line under a KPI value; ▲/▼ carry direction (not color alone). */
const deltaEl = (d: number | null, t: DashboardT): React.ReactNode =>
  d === null ? null : (
    <div className={`delta ${d > 0 ? 'up' : d < 0 ? 'down' : 'ec-delta-flat'}`} aria-label={t.vsPrev7}>
      <bdi dir="ltr">{(d > 0 ? '▲ ' : d < 0 ? '▼ ' : '±') + Math.abs(d) + '%'}</bdi>
    </div>
  );

/* ===== the registry ===== */
export const DASHBOARD_WIDGETS: DashboardWidgetDef[] = [
  {
    id: 'portfolio-hero',
    title: ({ t }) => t.blockPortfolio,
    defaultSpan: 6,
    defaultVisible: true,
    bare: true,
    render: ({ t, dir, portfolio, summary, propsLoading, trafficLoading }) => {
      const Fwd = dir === 'rtl' ? ArrowLeft : ArrowRight;
      if (propsLoading) {
        return <Skeleton className="w-full" style={{ height: 108, borderRadius: 16 }} />;
      }
      return (
        <div className="ec-focal" style={{ marginBlock: 0 }}>
          <div className="ec-focal-main">
            <span className="ec-focal-label">{t.portfolioValue}</span>
            <span className="ec-focal-value"><bdi dir="ltr">{ils(portfolio.portfolioValue)}</bdi></span>
            <span className="ec-focal-sub">
              <bdi dir="ltr">{portfolio.activeCount}</bdi> {t.activeProperties}
              {' · '}<bdi dir="ltr">{portfolio.saleCount}</bdi> {t.forSaleLower}
              {' · '}<bdi dir="ltr">{portfolio.rentCount}</bdi> {t.forRentLower}
            </span>
          </div>
          <div className="ec-focal-side">
            <div className="ec-focal-stats">
              <div>
                <span className="fk">{t.mostExpensive}</span>
                <span className="fv"><bdi dir="ltr">{ils(portfolio.maxPrice)}</bdi></span>
              </div>
              <div>
                <span className="fk">{t.averageLabel}</span>
                <span className="fv"><bdi dir="ltr">{ils(portfolio.avgPrice)}</bdi></span>
              </div>
            </div>
            {!trafficLoading && (summary?.newInquiries ?? 0) > 0 && (
              <Link href="/admin/inquiries" className="ec-focal-cta">
                <bdi dir="ltr">{summary?.newInquiries}</bdi> {t.newInquiries}
                <Fwd className="size-3.5" />
              </Link>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: 'traffic-kpis',
    title: ({ t }) => t.blockTrafficKpis,
    defaultSpan: 6,
    defaultVisible: true,
    allowedSpans: [3, 6],
    bare: true,
    render: ({ t, metrics, trafficLoading }) => (
      <div className="ec-kpi-strip">
        <KpiTile label={t.kpiUniqueVisitors} value={metrics.uniqueVisitors} loading={trafficLoading} />
        <KpiTile label={t.kpiViews} value={metrics.totalViews} delta={deltaEl(metrics.viewsDelta, t)} loading={trafficLoading} />
        <KpiTile label={t.kpiInteractions} value={metrics.totalClicks} delta={deltaEl(metrics.interactionsDelta, t)} loading={trafficLoading} />
        <KpiTile label={t.kpiInquiries} value={metrics.leadSignals} loading={trafficLoading} />
      </div>
    ),
  },
  {
    id: 'traffic-chart',
    title: ({ t }) => t.siteTraffic,
    defaultSpan: 6,
    defaultVisible: true,
    allowedSpans: [3, 4, 6],
    bare: true,
    render: ({ t, dir, series, metrics, trafficLoading }) => {
      const Fwd = dir === 'rtl' ? ArrowLeft : ArrowRight;
      return (
        <ECard
          className={metrics.trendEmpty ? '' : 'ec-card--hero'}
          title={
            <div>
              <SectionTitle>{t.siteTraffic}</SectionTitle>
              <div className="ec-card-subtitle">{t.lastDays(WINDOW_DAYS)}</div>
            </div>
          }
          extra={
            <div className="ec-chart-tools">
              <span className="ec-spark-legend">
                <span className="ec-legend-item"><span className="ec-dot" style={{ background: BRAND }} />{t.chartViews}</span>
                <span className="ec-legend-item"><span className="ec-dot" style={{ background: BRAND_SKY }} />{t.chartInteractions}</span>
              </span>
              <Link href="/admin/analytics" className="ec-viewall">
                {t.fullAnalytics} <Fwd className="size-3" />
              </Link>
            </div>
          }
        >
          {trafficLoading ? (
            <SkelLines rows={5} />
          ) : (
            <>
              {metrics.trendEmpty ? (
                <EmptyBlock height={72} text={t.noTrafficData} />
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={series} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke={DIVIDER} />
                    <XAxis dataKey="date" reversed={dir === 'rtl'} tick={{ fontSize: 11, fill: MUTED }} axisLine={{ stroke: DIVIDER }} tickLine={false} minTickGap={24} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ borderRadius: 10, border: `1px solid ${BORDER}`, direction: dir, textAlign: 'start', boxShadow: '0 6px 20px -8px rgba(5,17,80,.10)', fontSize: 12 }}
                      labelStyle={{ fontWeight: 600, marginBottom: 4, color: INK }}
                    />
                    <Area type="monotone" dataKey="views" name={t.chartViews} stroke={BRAND} strokeWidth={2} fill={BRAND_WASH} fillOpacity={1} activeDot={{ r: 4 }} isAnimationActive={false} />
                    <Area type="monotone" dataKey="clicks" name={t.chartInteractions} stroke={BRAND_SKY} strokeWidth={2} fill="transparent" activeDot={{ r: 4 }} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              <div className="ec-chart-foot">
                <span>
                  {t.conversionRate} <Num style={{ color: INK, fontWeight: 600 }}>{metrics.conversion}%</Num> · {t.engagement} <Num style={{ color: INK, fontWeight: 600 }}>{metrics.engagement}%</Num>
                </span>
                <span>
                  {t.todayLabel} <Num style={{ color: INK, fontWeight: 600 }}>{metrics.viewsToday}</Num> {t.viewsLower} · <Num style={{ color: INK, fontWeight: 600 }}>{metrics.leadsToday}</Num> {t.inquiriesLower}
                </span>
              </div>
            </>
          )}
        </ECard>
      );
    },
  },
  {
    id: 'composition',
    title: ({ t }) => t.portfolioComposition,
    defaultSpan: 3,
    defaultVisible: true,
    bare: true,
    render: ({ t, portfolio, propsLoading }) => (
      <ECard title={<SectionTitle>{t.portfolioComposition}</SectionTitle>}>
        {propsLoading ? (
          <SkelLines rows={5} />
        ) : portfolio.total === 0 ? (
          <EmptyBlock height={160} text={t.noPropertiesInSystem} />
        ) : (
          <>
            <div className="ec-splitbar" role="img" aria-label={t.splitBarAria}>
              {portfolio.salePct > 0 && <div className="ec-bar-fill" style={{ inlineSize: `${portfolio.salePct}%`, background: BRAND }} />}
              {portfolio.salePct < 100 && <div className="ec-bar-fill" style={{ inlineSize: `${100 - portfolio.salePct}%`, background: BRAND_SKY }} />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              <span className="ec-comp-legend">
                <span className="ec-dot" style={{ background: BRAND }} />
                <Num>{portfolio.salePct}%</Num> · <Num>{portfolio.saleCount}</Num> {t.forSaleLower}
              </span>
              <span className="ec-comp-legend">
                <span className="ec-dot" style={{ background: BRAND_SKY }} />
                <Num>{100 - portfolio.salePct}%</Num> · <Num>{portfolio.rentCount}</Num> {t.forRentLower}
              </span>
            </div>

            <Label style={{ marginTop: 22, marginBottom: 8 }}>{t.byPropertyType}</Label>
            <div>
              {portfolio.typeCounts.map((tc) => (
                <div key={tc.type} className="ec-typerow">
                  <span className="ec-typelabel">{tc.label}</span>
                  <span className="ec-countbadge"><Num>{tc.count}</Num></span>
                </div>
              ))}
            </div>

            {portfolio.cityCounts.length > 0 && (
              <>
                <Label style={{ marginTop: 18, marginBottom: 10 }}>{t.topCities}</Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {portfolio.cityCounts.slice(0, 4).map((c) => (
                    <span key={c.label} className="ec-citychip">
                      {c.label} <Num style={{ color: INK, fontWeight: 600, marginInlineStart: 4 }}>{c.count}</Num>
                    </span>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </ECard>
    ),
  },
  {
    id: 'attention',
    title: ({ t }) => t.needsAttention,
    defaultSpan: 3,
    defaultVisible: true,
    bare: true,
    render: ({ t, dir, portfolio, propsLoading }) => (
      <ECard title={<SectionTitle>{t.needsAttention}</SectionTitle>}>
        {propsLoading ? (
          <SkelLines rows={4} />
        ) : (
          <div>
            {/* Actionable rows lead with a warn/neg dot; informational rows a muted dot. */}
            <AttentionRow t={t} dir={dir} label={t.priceDrops} count={portfolio.priceDrops} tone="warn" href="/admin/properties?attention=price-drop" />
            <AttentionRow t={t} dir={dir} label={t.propertiesWithoutPhotos} count={portfolio.noPhotos} tone="neg" href="/admin/properties?attention=no-photos" />
            <AttentionRow t={t} dir={dir} label={t.hiddenProperties} count={portfolio.hidden} tone="warn" href="/admin/properties?attention=hidden" />
            <AttentionRow t={t} dir={dir} label={t.soldProperties} count={portfolio.soldCount} tone="muted" />
            {portfolio.hotCount > 0 && <AttentionRow t={t} dir={dir} label={t.hotOffers} count={portfolio.hotCount} tone="muted" />}
            {portfolio.pinnedCount > 0 && <AttentionRow t={t} dir={dir} label={t.pinnedProperties} count={portfolio.pinnedCount} tone="muted" />}
          </div>
        )}
      </ECard>
    ),
  },
  {
    id: 'recent-listings',
    title: ({ t }) => t.recentlyAdded,
    defaultSpan: 6,
    defaultVisible: true,
    bare: true,
    render: ({ t, dir, portfolio, propsLoading }) => {
      const Fwd = dir === 'rtl' ? ArrowLeft : ArrowRight;
      return (
        <ECard
          title={<SectionTitle>{t.recentlyAdded}</SectionTitle>}
          extra={<Link href="/admin/properties" className="ec-viewall">{t.viewAll} <Fwd className="size-3" /></Link>}
        >
          {propsLoading ? (
            <SkelLines rows={4} />
          ) : portfolio.recentListings.length === 0 ? (
            <EmptyBlock height={120} text={t.noProperties} />
          ) : (
            <div>
              {portfolio.recentListings.map((x) => <ListingRow key={x.id} x={x} t={t} />)}
            </div>
          )}
        </ECard>
      );
    },
  },

  /* ---- optional blocks: off by default, added from the block picker ---- */
  {
    id: 'lead-kpis',
    title: ({ t }) => t.blockLeadKpis,
    defaultSpan: 6,
    defaultVisible: false,
    allowedSpans: [3, 6],
    bare: true,
    render: ({ t, summary, trafficLoading }) => (
      <div className="ec-kpi-strip">
        <KpiTile label={t.totalInquiriesLabel} value={summary?.totalInquiries ?? 0} loading={trafficLoading} />
        <KpiTile label={t.newInquiriesLabel} value={summary?.newInquiries ?? 0} loading={trafficLoading} />
        <KpiTile label={t.inquiriesTodayLabel} value={summary?.inquiriesToday ?? 0} loading={trafficLoading} />
        <KpiTile label={t.inquiriesLast7DaysLabel} value={summary?.inquiriesLast7Days ?? 0} loading={trafficLoading} />
      </div>
    ),
  },
  {
    id: 'top-cities',
    title: ({ t }) => t.topCities,
    defaultSpan: 3,
    defaultVisible: false,
    bare: true,
    render: ({ t, portfolio, propsLoading }) => (
      <ECard title={<SectionTitle>{t.topCities}</SectionTitle>}>
        {propsLoading ? (
          <SkelLines rows={4} />
        ) : portfolio.cityCounts.length === 0 ? (
          <EmptyBlock height={120} text={t.noCitiesYet} />
        ) : (
          <div>
            {portfolio.cityCounts.slice(0, 8).map((c) => (
              <div key={c.label} className="ec-typerow">
                <span className="ec-typelabel">{c.label}</span>
                <span className="ec-countbadge"><Num>{c.count}</Num></span>
              </div>
            ))}
          </div>
        )}
      </ECard>
    ),
  },
  {
    id: 'price-ranges',
    title: ({ t }) => t.blockPriceRanges,
    defaultSpan: 3,
    defaultVisible: false,
    bare: true,
    render: ({ t, portfolio, propsLoading }) => {
      const buckets = PRICE_BUCKETS.map((b) => ({
        key: b.key,
        label: b.min === 0
          ? t.priceUnder(ilsShort(b.max))
          : b.max === Infinity
            ? t.priceOver(ilsShort(b.min))
            : t.priceBetween(ilsShort(b.min), ilsShort(b.max)),
      }));
      return (
        <ECard title={<SectionTitle>{t.blockPriceRanges}</SectionTitle>}>
          {propsLoading ? (
            <SkelLines rows={4} />
          ) : portfolio.total === 0 ? (
            <EmptyBlock height={120} text={t.noPropertiesInSystem} />
          ) : (
            <div>
              {buckets.map((b) => {
                const count = portfolio.priceBuckets[b.key] ?? 0;
                const pct = portfolio.total ? Math.round((count / portfolio.total) * 100) : 0;
                return (
                  <div key={b.key} style={{ paddingBlock: 9, borderBlockEnd: '1px solid var(--divider)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 6, fontSize: 13.5 }}>
                      <span style={{ color: 'var(--text-body)' }}>{b.label}</span>
                      <span className="ec-countbadge"><Num>{count}</Num></span>
                    </div>
                    <div style={{ position: 'relative', height: 6, borderRadius: 4, background: 'var(--surface-sunken)' }}>
                      <div style={{ position: 'absolute', insetInlineStart: 0, top: 0, height: 6, borderRadius: 4, width: `${pct}%`, background: BRAND }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ECard>
      );
    },
  },
  {
    id: 'oldest-listings',
    title: ({ t }) => t.blockOldestListings,
    defaultSpan: 6,
    defaultVisible: false,
    bare: true,
    render: ({ t, portfolio, propsLoading }) => (
      <ECard title={<SectionTitle>{t.blockOldestListings}</SectionTitle>}>
        {propsLoading ? (
          <SkelLines rows={4} />
        ) : portfolio.oldestListings.length === 0 ? (
          <EmptyBlock height={120} text={t.noProperties} />
        ) : (
          <div>
            {portfolio.oldestListings.map((x) => <ListingRow key={x.id} x={x} t={t} />)}
          </div>
        )}
      </ECard>
    ),
  },
  {
    id: 'portfolio-kpis',
    title: ({ t }) => t.blockPortfolioKpis,
    defaultSpan: 6,
    defaultVisible: false,
    allowedSpans: [3, 6],
    bare: true,
    render: ({ t, portfolio, propsLoading }) => (
      <div className="ec-kpi-strip">
        <KpiTile label={t.totalProperties} value={portfolio.total} loading={propsLoading} />
        <KpiTile label={t.activePropertiesLabel} value={portfolio.activeCount} loading={propsLoading} />
        <KpiTile label={t.newThisWeekLabel} value={portfolio.newThisWeek} loading={propsLoading} />
        <KpiTile label={t.avgPriceLabel} value={ils(portfolio.avgPrice)} loading={propsLoading} />
      </div>
    ),
  },
  {
    id: 'rooms-distribution',
    title: ({ t }) => t.blockRooms,
    defaultSpan: 3,
    defaultVisible: false,
    bare: true,
    render: ({ t, portfolio, propsLoading }) => (
      <ECard title={<SectionTitle>{t.blockRooms}</SectionTitle>}>
        {propsLoading ? <SkelLines rows={4} /> : (
          <BarRows
            emptyText={t.noPropertiesInSystem}
            items={portfolio.roomCounts.map((r) => ({ key: String(r.rooms), label: t.roomsCount(r.rooms), count: r.count }))}
          />
        )}
      </ECard>
    ),
  },
  {
    id: 'area-ranges',
    title: ({ t }) => t.blockAreas,
    defaultSpan: 3,
    defaultVisible: false,
    bare: true,
    render: ({ t, portfolio, propsLoading }) => (
      <ECard title={<SectionTitle>{t.blockAreas}</SectionTitle>}>
        {propsLoading ? <SkelLines rows={4} /> : (
          <BarRows
            emptyText={t.noPropertiesInSystem}
            items={AREA_BUCKETS.map((b) => ({
              key: b.key,
              label: b.max === Infinity ? t.areaOver(b.min) : t.areaRange(b.min, b.max),
              count: portfolio.areaBuckets[b.key] ?? 0,
            }))}
          />
        )}
      </ECard>
    ),
  },
  {
    id: 'avg-price-by-city',
    title: ({ t }) => t.blockAvgPriceByCity,
    defaultSpan: 3,
    defaultVisible: false,
    bare: true,
    render: ({ t, portfolio, propsLoading }) => (
      <ECard title={<SectionTitle>{t.blockAvgPriceByCity}</SectionTitle>}>
        {propsLoading ? <SkelLines rows={4} /> : portfolio.avgPriceByCity.length === 0 ? (
          <EmptyBlock height={120} text={t.noCitiesYet} />
        ) : (
          <div>
            {portfolio.avgPriceByCity.slice(0, 8).map((c) => (
              <div key={c.label} className="ec-typerow">
                <span className="ec-typelabel">{c.label}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <span className="ec-listprice"><Num>{ils(c.avg)}</Num></span>
                  <span className="ec-countbadge"><Num>{c.count}</Num></span>
                </span>
              </div>
            ))}
          </div>
        )}
      </ECard>
    ),
  },
  {
    id: 'price-drops-list',
    title: ({ t }) => t.blockPriceDrops,
    defaultSpan: 6,
    defaultVisible: false,
    bare: true,
    render: ({ t, dir, portfolio, propsLoading }) => {
      const Fwd = dir === 'rtl' ? ArrowLeft : ArrowRight;
      return (
        <ECard
          title={<SectionTitle>{t.blockPriceDrops}</SectionTitle>}
          extra={<Link href="/admin/properties?attention=price-drop" className="ec-viewall">{t.viewAll} <Fwd className="size-3" /></Link>}
        >
          {propsLoading ? <SkelLines rows={3} /> : portfolio.priceDropListings.length === 0 ? (
            <EmptyBlock height={100} text={t.noPriceDrops} />
          ) : (
            <div>
              {portfolio.priceDropListings.map((x) => (
                <ListingRow
                  key={x.id}
                  x={x}
                  t={t}
                  priceNote={t.priceWas(ils(parseMoney(x.originalPrice)))}
                />
              ))}
            </div>
          )}
        </ECard>
      );
    },
  },
  {
    id: 'no-photos-list',
    title: ({ t }) => t.blockNoPhotos,
    defaultSpan: 6,
    defaultVisible: false,
    bare: true,
    render: ({ t, dir, portfolio, propsLoading }) => {
      const Fwd = dir === 'rtl' ? ArrowLeft : ArrowRight;
      return (
        <ECard
          title={<SectionTitle>{t.blockNoPhotos}</SectionTitle>}
          extra={<Link href="/admin/properties?attention=no-photos" className="ec-viewall">{t.viewAll} <Fwd className="size-3" /></Link>}
        >
          {propsLoading ? <SkelLines rows={3} /> : portfolio.noPhotoListings.length === 0 ? (
            <EmptyBlock height={100} text={t.noMissingPhotos} />
          ) : (
            <div>
              {portfolio.noPhotoListings.map((x) => <ListingRow key={x.id} x={x} t={t} />)}
            </div>
          )}
        </ECard>
      );
    },
  },
  {
    id: 'traffic-sources',
    title: ({ t }) => t.blockTrafficSources,
    defaultSpan: 3,
    defaultVisible: false,
    bare: true,
    render: ({ t, locale, summary, trafficLoading }) => {
      // The acquisition buckets and their labels are owned by the analytics
      // console; reuse them rather than keeping a second translation in sync.
      const labels = getMessages(analyticsMessages, locale).trafficLabels as Record<string, string>;
      return (
        <ECard title={<SectionTitle>{t.blockTrafficSources}</SectionTitle>}>
          {trafficLoading ? <SkelLines rows={4} /> : (
            <BarRows
              emptyText={t.noTrafficSources}
              items={(summary?.trafficSources || []).map((s) => ({
                key: s.source,
                label: labels[s.source] || s.source,
                count: s.count,
              }))}
            />
          )}
        </ECard>
      );
    },
  },
  {
    id: 'daily-activity',
    title: ({ t }) => t.blockDailyActivity,
    defaultSpan: 3,
    defaultVisible: false,
    bare: true,
    render: ({ t, dir, series, summary, metrics, trafficLoading }) => {
      const today = summary?.viewsToday ?? 0;
      const yesterday = series.length > 1 ? series[series.length - 2].views : 0;
      const delta = yesterday > 0 ? Math.round(((today - yesterday) / yesterday) * 100) : null;
      const avg = series.length ? Math.round(series.reduce((s, d) => s + d.views, 0) / series.length) : 0;
      const lastIndex = series.length - 1;
      return (
        <ECard
          title={
            <div>
              <SectionTitle>{t.blockDailyActivity}</SectionTitle>
              <div className="ec-card-subtitle">{t.lastDays(WINDOW_DAYS)}</div>
            </div>
          }
        >
          {trafficLoading ? (
            <SkelLines rows={4} />
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBlockEnd: 14 }}>
                <span style={{ fontSize: 30, fontWeight: 700, color: INK, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
                  <bdi dir="ltr">{today.toLocaleString('en-US')}</bdi>
                </span>
                <span style={{ fontSize: 13, color: MUTED }}>{t.visitsToday}</span>
                {delta !== null && (
                  <span className={`delta ${delta > 0 ? 'up' : delta < 0 ? 'down' : 'ec-delta-flat'}`} style={{ fontSize: 12, fontWeight: 600 }} aria-label={t.vsYesterday}>
                    <bdi dir="ltr">{(delta > 0 ? '▲ ' : delta < 0 ? '▼ ' : '±') + Math.abs(delta) + '%'}</bdi>
                  </span>
                )}
              </div>
              {/* A window of all-zero days draws an empty axis — say so instead. */}
              {series.length === 0 || metrics.trendEmpty ? (
                <EmptyBlock height={96} text={t.noTrafficData} />
              ) : (
                <ResponsiveContainer width="100%" height={170}>
                  <BarChart data={series} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke={DIVIDER} />
                    <XAxis dataKey="date" reversed={dir === 'rtl'} tick={{ fontSize: 11, fill: MUTED }} axisLine={{ stroke: DIVIDER }} tickLine={false} interval="preserveStartEnd" minTickGap={16} />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ fill: 'rgba(53,74,196,.06)' }}
                      contentStyle={{ borderRadius: 10, border: `1px solid ${BORDER}`, direction: dir, textAlign: 'start', fontSize: 12 }}
                    />
                    {/* Today's bar carries the accent so "today" reads at a glance. */}
                    <Bar dataKey="views" name={t.chartViews} radius={[4, 4, 0, 0]} isAnimationActive={false}>
                      {series.map((d, i) => (
                        <Cell key={d.date} fill={i === lastIndex ? BRAND_SKY : BRAND} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div className="ec-chart-foot">
                <span>{t.visitsAvgPerDay} <Num style={{ color: INK, fontWeight: 600 }}>{avg}</Num></span>
                <span>{t.allTime} <Num style={{ color: INK, fontWeight: 600 }}>{(summary?.totalViews ?? 0).toLocaleString('en-US')}</Num></span>
              </div>
            </>
          )}
        </ECard>
      );
    },
  },
  {
    id: TEAM_WIDGET_ID,
    title: ({ t }) => t.blockTeam,
    defaultSpan: 6,
    defaultVisible: false,
    allowedSpans: [3, 4, 6],
    bare: true,
    render: ({ t, dir, team, teamLoading, notifications }) => {
      const Fwd = dir === 'rtl' ? ArrowLeft : ArrowRight;
      const members = team.filter((m) => m.isActive);

      // A fresh sale is the news: the newest sold-notification from the past
      // week wins, pinned to the agent it names.
      const recentSale = notifications.find((n) => {
        if (n.type !== NOTIFICATION_SOLD || !n.agentId) return false;
        return dayjs().diff(dayjs(n.createdAt), 'day') <= BUBBLE_WINDOW_DAYS
          && members.some((m) => `team-${m.id}` === n.agentId);
      });

      let highlight: TeamMemberRow | undefined;
      let highlightText: string | null = null;

      if (recentSale) {
        highlight = members.find((m) => `team-${m.id}` === recentSale.agentId);
        const name = recentSale.agentName || highlight?.name || '';
        const days = dayjs().startOf('day').diff(dayjs(recentSale.createdAt).startOf('day'), 'day');
        highlightText = days <= 0
          ? t.teamBubbleSoldToday(name)
          : days === 1
            ? t.teamBubbleSoldYesterday(name)
            : t.teamBubbleSoldDaysAgo(name, days);
      } else {
        // No recent sale — fall back to whoever leads on sales (or on volume),
        // never a claim the data does not support.
        highlight = members
          .slice()
          .sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0) || (b.propertiesCount ?? 0) - (a.propertiesCount ?? 0))[0];
        highlightText = !highlight
          ? null
          : (highlight.soldCount ?? 0) > 0
            ? t.teamBubbleSold(highlight.name, highlight.soldCount ?? 0)
            : (highlight.propertiesCount ?? 0) > 0
              ? t.teamBubbleManages(highlight.name, highlight.propertiesCount ?? 0)
              : null;
      }

      return (
        <ECard
          title={<SectionTitle>{t.blockTeam}</SectionTitle>}
          extra={<Link href="/admin/team" className="ec-viewall">{t.viewAll} <Fwd className="size-3" /></Link>}
        >
          {teamLoading ? (
            <SkelLines rows={3} />
          ) : members.length === 0 ? (
            <EmptyBlock height={110} text={t.noTeamMembers} />
          ) : (
            <div className="ec-team-row">
              {members.slice(0, 8).map((m) => {
                const isHighlight = highlight?.id === m.id && !!highlightText;
                return (
                  <div key={m.id} className={`ec-team-card${isHighlight ? ' is-highlight' : ''}`}>
                    {isHighlight && (
                      <span className="ec-team-bubble" role="status">{highlightText}</span>
                    )}
                    {m.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.image} alt={m.name} className="ec-team-avatar" loading="lazy" />
                    ) : (
                      <span className="ec-team-avatar ec-team-avatar--empty">{m.name.trim().charAt(0)}</span>
                    )}
                    <span className="ec-team-name">{m.name}</span>
                    <span className="ec-team-role">{m.role}</span>
                    <span className="ec-team-stats">
                      <Num>{t.teamProperties(m.propertiesCount ?? 0)}</Num>
                      {(m.soldCount ?? 0) > 0 && <> · <Num>{t.teamSold(m.soldCount ?? 0)}</Num></>}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </ECard>
      );
    },
  },
  {
    id: NOTIFICATIONS_WIDGET_ID,
    title: ({ t }) => t.blockNotifications,
    defaultSpan: 3,
    defaultVisible: false,
    bare: true,
    render: ({ t, notifications, notificationsLoading }) => (
      <ECard title={<SectionTitle>{t.blockNotifications}</SectionTitle>}>
        {notificationsLoading ? (
          <SkelLines rows={3} />
        ) : notifications.length === 0 ? (
          <EmptyBlock height={110} text={t.noNotifications} />
        ) : (
          <div>
            {notifications.slice(0, 8).map((n) => {
              const when = dayjs(n.createdAt);
              const days = dayjs().startOf('day').diff(when.startOf('day'), 'day');
              const whenLabel = days <= 0 ? t.whenToday : days === 1 ? t.whenYesterday : t.daysAgo(days);
              const text = n.propertyTitle
                ? n.agentName
                  ? t.notificationSold(n.agentName, n.propertyTitle)
                  : t.notificationSoldNoAgent(n.propertyTitle)
                : t.notificationSoldGeneric;
              return (
                <div key={n.id} className="ec-noti-row">
                  <span className={`ec-noti-dot${n.readAt ? '' : ' is-unread'}`} />
                  <span className="ec-noti-text">{text}</span>
                  <span className="ec-noti-when">{whenLabel} · {when.format('HH:mm')}</span>
                </div>
              );
            })}
          </div>
        )}
      </ECard>
    ),
  },
  {
    id: 'top-properties',
    title: ({ t }) => t.blockTopProperties,
    defaultSpan: 3,
    defaultVisible: false,
    bare: true,
    render: ({ t, summary, trafficLoading }) => (
      <ECard title={<SectionTitle>{t.blockTopProperties}</SectionTitle>}>
        {trafficLoading ? <SkelLines rows={4} /> : (
          <BarRows
            emptyText={t.noPropertyActivity}
            items={(summary?.topPropertiesByClicks || []).map((p) => ({
              key: String(p.propertyId),
              label: p.property?.title || t.propertyFallback(p.propertyId),
              count: p.clicks,
            }))}
          />
        )}
      </ECard>
    ),
  },
];

export const DASHBOARD_WIDGETS_BY_ID: Record<string, DashboardWidgetDef> = Object.fromEntries(
  DASHBOARD_WIDGETS.map((w) => [w.id, w])
);
