'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Image as ImageIcon, Plus, ExternalLink } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/shadcn/skeleton';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';
import dayjs from 'dayjs';
import { getCityLabel } from '@/data/cities';
import { useAdminI18n, useAdminMessages, type MessagesShape } from '@/lib/adminI18n';
import { dashboardMessages } from '@/lib/adminI18n/messages/dashboard';

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

const WINDOW_DAYS = 14; // trend window; the full, filterable analytics lives on /admin/analytics

/** Resolved dashboard message record for the active locale. */
type DashboardT = MessagesShape<(typeof dashboardMessages)['he']>;

/* ===== types ===== */
interface PropertyRow {
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

interface Summary {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  clickTypes: Array<{ eventType: string; count: number }>;
  // Real lead/inquiry stats (from the Inquiry table)
  totalInquiries?: number;
  newInquiries?: number;
  inquiriesToday?: number;
  inquiriesLast7Days?: number;
  // 14-day sparkline + today's views, now aggregated server-side (was two
  // ≤1000-row analytics fetches bucketed on the client).
  dailySeries?: Array<{ date: string; views: number; clicks: number }>;
  viewsToday?: number;
}

/* ===== helpers ===== */
const parseMoney = (s: string | null | undefined): number =>
  parseInt(String(s ?? '0').replace(/[^0-9]/g, ''), 10) || 0;

const ils = (n: number): string => '₪' + n.toLocaleString('en-US');

/** Self-contained long date (no dayjs locale dependency): "1 ביולי 2026" / "1 July 2026". */
const formatLongDate = (d: ReturnType<typeof dayjs>, t: DashboardT): string => t.longDate(d.date(), d.month(), d.year());

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
    <div className={`ec-card${className ? ' ' + className : ''}`} style={style}>
      {(title || extra) && <div className="ec-card-head">{title}{extra}</div>}
      <div className="ec-card-body">{children}</div>
    </div>
  );
}

/** Skeleton paragraph — a stack of full-width lines (replaces antd `Skeleton active paragraph`). */
function SkelLines({ rows }: { rows: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

/* ===== page ===== */
export default function AdminDashboard() {
  const t = useAdminMessages(dashboardMessages);
  const { data: session } = useSession();
  const userName = (session?.user as { name?: string; username?: string } | undefined)?.name
    ?? (session?.user as { username?: string } | undefined)?.username;

  // Time-of-day greeting. Computed after mount (client clock) so SSR/CSR never
  // disagree; until then the header shows the neutral page title.
  const [greeting, setGreeting] = useState<string | null>(null);
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? t.greetingMorning : h < 18 ? t.greetingAfternoon : t.greetingEvening);
  }, [t]);
  const { dir } = useAdminI18n();
  const Fwd = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const [props, setProps] = useState<PropertyRow[] | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [propsLoading, setPropsLoading] = useState(true);
  const [trafficLoading, setTrafficLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch('/api/admin/properties');
        const data = r.ok ? await r.json() : [];
        if (alive) setProps(Array.isArray(data) ? data : []);
      } catch {
        if (alive) setProps([]);
      } finally {
        if (alive) setPropsLoading(false);
      }
    })();
    (async () => {
      try {
        // Single call — the summary now carries the sparkline series and today's
        // views, so the dashboard no longer pulls the full views/clicks tables.
        const s = await fetch('/api/analytics/track?type=summary');
        if (alive && s.ok) setSummary(await s.json());
      } catch {
        /* analytics optional — blocks degrade to calm empty states */
      } finally {
        if (alive) setTrafficLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const p = useMemo(() => props ?? [], [props]);
  const portfolio = useMemo(() => {
    const total = p.length;
    const portfolioValue = p.reduce((a, x) => a + parseMoney(x.price), 0);
    const activeCount = p.filter((x) => x.isActive).length;
    const saleCount = p.filter((x) => x.dealType === 'sale').length;
    const rentCount = p.filter((x) => x.dealType === 'rent').length;
    const salePct = total ? Math.round((saleCount / total) * 100) : 0;
    const avgPrice = total ? Math.round(portfolioValue / total) : 0;
    const maxPrice = p.reduce((m, x) => Math.max(m, parseMoney(x.price)), 0);
    const newThisWeek = p.filter((x) => dayjs().diff(dayjs(x.createdAt), 'day') < 7).length;
    const priceDrops = p.filter((x) => x.originalPrice && parseMoney(x.originalPrice) > parseMoney(x.price)).length;
    const noPhotos = p.filter((x) => !x.images || x.images.length === 0).length;
    const hidden = p.filter((x) => !x.isActive).length;
    const soldCount = p.filter((x) => x.isSold).length;
    const pinnedCount = p.filter((x) => x.isPinned).length;
    const hotCount = p.filter((x) => x.isHotProposition).length;

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
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    const recentListings = [...p]
      .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix())
      .slice(0, 5);

    return {
      total, portfolioValue, activeCount, saleCount, rentCount, salePct, avgPrice, maxPrice,
      newThisWeek, priceDrops, noPhotos, hidden, soldCount, pinnedCount, hotCount,
      typeCounts, cityCounts, recentListings,
    };
  }, [p, t]);

  const totalViews = summary?.totalViews ?? 0;
  const totalClicks = summary?.totalClicks ?? 0;
  const uniqueVisitors = summary?.uniqueVisitors ?? 0;
  // Real leads from the Inquiry table (actual submitted contact forms) —
  // accurate, replaces the old clickEvent-derived "פניות" approximation.
  const leadSignals = summary?.totalInquiries ?? 0;
  // מעורבות (engagement) = interactions per view. This is what the panel used to
  // mislabel as "conversion" — an 83% "conversion" with 0 leads reads as fake.
  const engagement = totalViews ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';
  // יחס המרה (real conversion) = actual submitted inquiries per unique visitor.
  const conversion = uniqueVisitors ? ((leadSignals / uniqueVisitors) * 100).toFixed(1) : '0.0';

  const series = useMemo(
    () => (summary?.dailySeries ?? []).map((d) => ({ date: dayjs(d.date).format('DD/MM'), views: d.views, clicks: d.clicks })),
    [summary],
  );

  const viewsToday = summary?.viewsToday ?? 0;
  const leadsToday = summary?.inquiriesToday ?? 0;

  const trendEmpty = series.every((d) => d.views === 0 && d.clicks === 0);

  // Week-over-week deltas for the two series-backed KPIs (views, interactions).
  // Unique-visitors and inquiries carry no prior series, so they get no delta.
  const { viewsDelta, interactionsDelta } = useMemo(() => {
    const last7 = series.slice(-7);
    const prior7 = series.slice(-14, -7);
    const sum = (a: typeof series, k: 'views' | 'clicks') => a.reduce((s, d) => s + d[k], 0);
    const pct = (n: number, p: number): number | null => (p > 0 ? Math.round(((n - p) / p) * 100) : null);
    return {
      viewsDelta: pct(sum(last7, 'views'), sum(prior7, 'views')),
      interactionsDelta: pct(sum(last7, 'clicks'), sum(prior7, 'clicks')),
    };
  }, [series]);

  // Bidi-isolated delta line under a KPI value; ▲/▼ carry direction (not color alone),
  // token classes carry the pos/neg color. null when there's no prior week.
  const deltaEl = (d: number | null): React.ReactNode =>
    d === null ? null : (
      <div className={`delta ${d > 0 ? 'up' : d < 0 ? 'down' : 'ec-delta-flat'}`} aria-label={t.vsPrev7}>
        <bdi dir="ltr">{(d > 0 ? '▲ ' : d < 0 ? '▼ ' : '±') + Math.abs(d) + '%'}</bdi>
      </div>
    );

  /* ===== render ===== */
  return (
    <div className="estate-console">
      {/* ── 0. Page header — plain, on page bg (no gradient band). Title + faint date;
              the actionable new-leads count folds in at inline-end as a brand CTA. ── */}
      <header className="ec-pagehead">
        <div>
          <h1 className="ec-h1">
            {greeting ? (userName ? `${greeting}, ${userName}` : greeting) : t.pageTitle}
          </h1>
          <p className="ec-subtitle">{formatLongDate(dayjs(), t)} · {t.pageTitle}</p>
        </div>
        <div className="ec-quick">
          <a href="/" target="_blank" rel="noopener" className="ec-quick-ghost">
            <ExternalLink className="size-4" aria-hidden="true" />
            {t.quickViewSite}
          </a>
          <Link href="/admin/properties/new" className="ec-quick-primary">
            <Plus className="size-4" aria-hidden="true" />
            {t.quickAddProperty}
          </Link>
        </div>
      </header>

      {/* ── 1. Focal hero — dark navy card holding the portfolio headline + facts + CTA ── */}
      {propsLoading ? (
        <Skeleton className="w-full" style={{ height: 108, marginBlock: '6px 24px', borderRadius: 16 }} />
      ) : (
        <div className="ec-focal">
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
      )}

      {/* ── 2. KPI strip — one card, 4 hairline-divided tiles. Numbers = ink, no icons ── */}
      <div className="ec-kpi-strip" style={{ marginBottom: 24 }}>
        <KpiTile label={t.kpiUniqueVisitors} value={uniqueVisitors} loading={trafficLoading} />
        <KpiTile label={t.kpiViews} value={totalViews} delta={deltaEl(viewsDelta)} loading={trafficLoading} />
        <KpiTile label={t.kpiInteractions} value={totalClicks} delta={deltaEl(interactionsDelta)} loading={trafficLoading} />
        <KpiTile label={t.kpiInquiries} value={leadSignals} loading={trafficLoading} />
      </div>

      {/* ── 3. Traffic chart — the ONE data hero (--shadow-hero, radius 16) ── */}
      <ECard
        className={trendEmpty ? '' : 'ec-card--hero'}
        style={{ marginBottom: 24 }}
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
            {trendEmpty ? (
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
                {t.conversionRate} <Num style={{ color: INK, fontWeight: 600 }}>{conversion}%</Num> · {t.engagement} <Num style={{ color: INK, fontWeight: 600 }}>{engagement}%</Num>
              </span>
              <span>
                {t.todayLabel} <Num style={{ color: INK, fontWeight: 600 }}>{viewsToday}</Num> {t.viewsLower} · <Num style={{ color: INK, fontWeight: 600 }}>{leadsToday}</Num> {t.inquiriesLower}
              </span>
            </div>
          </>
        )}
      </ECard>

      {/* ── 4. Composition + Attention queue ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[13fr_11fr] gap-6" style={{ marginBottom: 24 }}>
        <ECard style={{ height: '100%' }} title={<SectionTitle>{t.portfolioComposition}</SectionTitle>}>
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
                      {portfolio.cityCounts.map((c) => (
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

        <ECard style={{ height: '100%' }} title={<SectionTitle>{t.needsAttention}</SectionTitle>}>
            {propsLoading ? (
              <SkelLines rows={4} />
            ) : (
              <div>
                {/* Actionable rows lead with a warn/neg dot; informational rows a muted dot.
                    Whole row is the click target; chevron surfaces on hover. */}
                <AttentionRow label={t.priceDrops} count={portfolio.priceDrops} tone="warn" href="/admin/properties?attention=price-drop" />
                <AttentionRow label={t.propertiesWithoutPhotos} count={portfolio.noPhotos} tone="neg" href="/admin/properties?attention=no-photos" />
                <AttentionRow label={t.hiddenProperties} count={portfolio.hidden} tone="warn" href="/admin/properties?attention=hidden" />
                <AttentionRow label={t.soldProperties} count={portfolio.soldCount} tone="muted" />
                {portfolio.hotCount > 0 && <AttentionRow label={t.hotOffers} count={portfolio.hotCount} tone="muted" />}
                {portfolio.pinnedCount > 0 && <AttentionRow label={t.pinnedProperties} count={portfolio.pinnedCount} tone="muted" />}
              </div>
            )}
        </ECard>
      </div>

      {/* ── 5. Recent listings ── */}
      <ECard title={<SectionTitle>{t.recentlyAdded}</SectionTitle>} extra={<Link href="/admin/properties" className="ec-viewall">{t.viewAll} <Fwd className="size-3" /></Link>}>
        {propsLoading ? (
          <SkelLines rows={4} />
        ) : portfolio.recentListings.length === 0 ? (
          <EmptyBlock height={120} text={t.noProperties} />
        ) : (
          <div>
            {portfolio.recentListings.map((x) => (
              <Link key={x.id} href="/admin/properties" className="ec-row ec-listrow">
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
                <span className="ec-listprice"><Num>{ils(parseMoney(x.price))}</Num></span>
                <span className={`ec-dealpill ${x.dealType === 'sale' ? 'sale' : 'rent'}`}>
                  {x.dealType === 'sale' ? t.dealSale : t.dealRent}
                </span>
              </Link>
            ))}
          </div>
        )}
      </ECard>

      <DashboardStyles />
    </div>
  );
}

/* ===== sub-components ===== */
/** One KPI tile inside `.ec-kpi-strip`: muted label → ink tabular value → optional delta. */
function KpiTile({ label, value, delta, loading }: { label: string; value: number; delta?: React.ReactNode; loading?: boolean }) {
  return (
    <div className="ec-kpi-tile">
      <div className="lbl">{label}</div>
      <div className="val">
        {loading ? <Skeleton className="h-8.25 w-16" /> : <bdi dir="ltr">{value.toLocaleString('en-US')}</bdi>}
      </div>
      {!loading && delta}
    </div>
  );
}

/** Attention row — whole-row click target, tone-coded dot, neutral count badge, hover chevron. */
function AttentionRow({ label, count, tone, href = '/admin/properties' }: { label: string; count: number; tone: 'warn' | 'neg' | 'muted'; href?: string }) {
  const t = useAdminMessages(dashboardMessages);
  const { dir } = useAdminI18n();
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

/* ===== scoped styles — tokens only (var(--…)); RTL logical properties throughout ===== */
function DashboardStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
/* Page header */
.estate-console .ec-pagehead{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.estate-console .ec-h1{font-size:26px;line-height:1.25;font-weight:700;letter-spacing:-.01em;color:var(--text-ink);}
.estate-console .ec-subtitle{font-size:13px;line-height:1.4;color:var(--text-muted);margin-block-start:4px;}

/* Quick actions at the header's inline-end */
.estate-console .ec-quick{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.estate-console .ec-quick-primary,.estate-console .ec-quick-ghost{display:inline-flex;align-items:center;gap:7px;height:38px;padding:0 16px;border-radius:var(--r-control);font-size:13.5px;font-weight:600;line-height:1;text-decoration:none;transition:background-color .15s ease,border-color .15s ease,color .15s ease;white-space:nowrap;}
.estate-console .ec-quick-primary{background:var(--brand);color:#fff;}
.estate-console .ec-quick-primary:hover{background:var(--brand-deep,#2c3ea6);}
.estate-console .ec-quick-ghost{background:var(--surface);color:var(--text-soft,#333e66);border:1px solid var(--border);}
.estate-console .ec-quick-ghost:hover{border-color:rgba(53,74,196,.4);color:var(--brand);}
.estate-console .ec-kpi-tile .delta.ec-delta-flat{color:var(--text-muted);}

/* Focal hero — the one dark premium card on the light page (Runey cashflow-card move) */
.estate-console .ec-focal{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;background:#051150;border-radius:var(--r-hero);box-shadow:var(--shadow-hero);padding:22px 26px;margin-block:6px 24px;}
.estate-console .ec-focal::after{content:"";position:absolute;inset-block-start:-60%;inset-inline-end:-8%;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(85,148,241,.28) 0%,rgba(85,148,241,0) 70%);pointer-events:none;}
.estate-console .ec-focal-main{position:relative;z-index:1;min-width:0;}
.estate-console .ec-focal-label{display:block;font-size:12.5px;font-weight:600;color:rgba(255,255,255,.55);}
.estate-console .ec-focal-value{display:block;font-size:34px;font-weight:800;letter-spacing:-.02em;line-height:1.1;color:#fff;margin-block-start:4px;font-variant-numeric:tabular-nums;}
.estate-console .ec-focal-sub{display:block;font-size:13px;color:rgba(255,255,255,.72);margin-block-start:8px;}
.estate-console .ec-focal-side{position:relative;z-index:1;display:flex;align-items:center;gap:28px;flex-wrap:wrap;}
.estate-console .ec-focal-stats{display:flex;gap:26px;}
.estate-console .ec-focal-stats>div{display:flex;flex-direction:column;gap:3px;}
.estate-console .ec-focal-stats .fk{font-size:12px;color:rgba(255,255,255,.5);}
.estate-console .ec-focal-stats .fv{font-size:15px;font-weight:600;color:#fff;font-variant-numeric:tabular-nums;}
.estate-console .ec-focal-cta{display:inline-flex;align-items:center;gap:7px;background:#5594f1;color:#051150;font-weight:700;font-size:13px;line-height:1;padding:9px 16px;border-radius:var(--r-pill);text-decoration:none;white-space:nowrap;transition:filter .15s ease;}
.estate-console .ec-focal-cta:hover{filter:brightness(1.08);}
@media (max-width:640px){.estate-console .ec-focal-value{font-size:28px;}.estate-console .ec-focal-stats{gap:18px;}}

/* Cards — quiet by default (hairline + soft shadow); ONE hero variant */
.estate-console .ec-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-card);box-shadow:var(--shadow-card);}
.estate-console .ec-card--hero{border-radius:var(--r-hero);box-shadow:var(--shadow-hero);}
.estate-console .ec-card-head{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;padding:18px 22px 0;}
.estate-console .ec-card--hero .ec-card-head{align-items:flex-start;}
.estate-console .ec-card-body{padding:22px;}
.estate-console .ec-card-subtitle{font-size:12.5px;line-height:1.4;color:var(--text-muted);margin-block-start:3px;}

/* Chart card tools (legend + link) + honest rate foot */
.estate-console .ec-chart-tools{display:inline-flex;align-items:center;gap:16px;flex-wrap:wrap;}
.estate-console .ec-spark-legend{display:inline-flex;align-items:center;gap:14px;font-size:12px;color:var(--text-muted);}
.estate-console .ec-legend-item{display:inline-flex;align-items:center;}
.estate-console .ec-chart-foot{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-block-start:16px;padding-block-start:14px;border-block-start:1px solid var(--divider);font-size:12.5px;color:var(--text-muted);}

/* Composition — horizontal stacked bar (data marks keep brand) */
.estate-console .ec-splitbar{display:flex;block-size:12px;border-radius:6px;overflow:hidden;background:var(--surface-sunken);}
.estate-console .ec-bar-fill{block-size:100%;transition:inline-size .8s cubic-bezier(.22,1,.36,1);}
.estate-console .ec-dot{display:inline-block;inline-size:8px;block-size:8px;border-radius:50%;margin-inline-end:6px;vertical-align:middle;}
.estate-console .ec-comp-legend{display:inline-flex;align-items:center;color:var(--text-body);font-weight:600;font-size:13px;font-variant-numeric:tabular-nums;}
.estate-console .ec-typerow{display:flex;align-items:center;justify-content:space-between;padding-block:8px;border-block-end:1px solid var(--divider);}
.estate-console .ec-typerow:last-child{border-block-end:none;}
.estate-console .ec-typelabel{color:var(--text-body);font-size:13.5px;}
.estate-console .ec-countbadge{background:var(--surface-sunken);color:var(--text-body);font-weight:600;font-size:12.5px;min-inline-size:26px;text-align:center;padding:1px 9px;border-radius:var(--r-pill);font-variant-numeric:tabular-nums;}
.estate-console .ec-citychip{display:inline-flex;align-items:center;background:var(--surface-sunken);border:1px solid var(--divider);border-radius:var(--r-tile);padding:4px 10px;font-size:12.5px;color:var(--text-body);}

/* Rows (attention / listings) — full-bleed hover, hairline separators, no zebra */
.estate-console .ec-row{transition:background .15s ease;}
.estate-console .ec-row:hover{background:var(--surface-hover);}
.estate-console .ec-attrow{display:flex;align-items:center;gap:10px;padding:12px 22px;margin-inline:-22px;text-decoration:none;border-block-end:1px solid var(--divider);}
.estate-console .ec-attrow:last-child{border-block-end:none;}
.estate-console .ec-attdot{inline-size:9px;block-size:9px;border-radius:50%;flex-shrink:0;}
.estate-console .ec-attlabel{flex:1;font-size:14px;}
.estate-console .ec-att-count{background:var(--surface-sunken);color:var(--text-body);font-weight:600;font-size:12.5px;min-inline-size:24px;text-align:center;padding:2px 9px;border-radius:var(--r-pill);font-variant-numeric:tabular-nums;}
.estate-console .ec-att-clear{color:var(--text-muted);font-size:13px;}
.estate-console .ec-att-chev{color:var(--text-faint);opacity:0;flex-shrink:0;transition:opacity .15s ease;}
.estate-console .ec-attrow:hover .ec-att-chev,.estate-console .ec-attrow:focus-visible .ec-att-chev{opacity:1;}

/* Recent listings — calm 64px rows */
.estate-console .ec-listrow{display:flex;align-items:center;gap:14px;min-block-size:64px;padding:11px 22px;margin-inline:-22px;text-decoration:none;border-block-end:1px solid var(--divider);}
.estate-console .ec-listrow:last-child{border-block-end:none;}
.estate-console .ec-thumb{inline-size:56px;block-size:42px;border-radius:8px;object-fit:cover;flex-shrink:0;background:var(--surface-sunken);}
.estate-console .ec-thumb-empty{display:inline-flex;align-items:center;justify-content:center;background:var(--surface-sunken);}
.estate-console .ec-listtitle{font-weight:600;color:var(--text-ink);font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.estate-console .ec-listmeta{font-size:12.5px;color:var(--text-muted);margin-block-start:2px;}
.estate-console .ec-listprice{font-weight:600;color:var(--text-ink);font-size:14px;font-variant-numeric:tabular-nums;}
.estate-console .ec-dealpill{font-size:11.5px;font-weight:600;padding:3px 11px;border-radius:var(--r-pill);white-space:nowrap;}
.estate-console .ec-dealpill.sale{background:var(--brand-tint);color:var(--brand);}
.estate-console .ec-dealpill.rent{background:#e8f1fe;color:#2f6fd0;}

/* Links / CTAs — brand is allowed here */
.estate-console .ec-viewall{color:var(--brand);font-weight:600;font-size:13px;text-decoration:none;display:inline-flex;align-items:center;gap:4px;}
.estate-console .ec-viewall:hover{color:var(--brand-hover);}

@media (prefers-reduced-motion: reduce){
  .estate-console .ec-bar-fill{transition:none;}
}
`,
      }}
    />
  );
}
