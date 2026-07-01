'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Skeleton } from 'antd';
import { ArrowLeftOutlined, PictureOutlined } from '@ant-design/icons';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';
import dayjs from 'dayjs';
import { getCityLabel } from '@/data/cities';

/* ===== palette (matches src/lib/adminTheme.ts) — Clean Slate: navy · gold · cool-neutral ===== */
const NAVY = '#1C3664';
const GOLD = '#C5A357'; // accent on dark surfaces / chart / pills
const GOLD_TEXT = '#8A6D2F'; // gold that clears WCAG AA on light surfaces
const HAIRLINE = '#E6E8EC'; // neutral slate hairline (single enclosure method)
const INK = '#1F2733';
const MUTED = '#64748B';
const HOVER_BG = '#F4F6F8'; // slate page tint

const WINDOW_DAYS = 14; // sparkline window; the full, filterable trend lives on /admin/analytics

const PROPERTY_TYPE_HE: Record<string, string> = {
  apartment: 'דירה',
  'garden-apartment': 'דירת גן',
  cottage: 'קוטג׳',
  house: 'בית פרטי',
  duplex: 'דופלקס',
  penthouse: 'פנטהאוז',
  'mini-penthouse': 'מיני פנטהאוז',
  'roof-apartment': 'דירת גג',
  'housing-unit': 'יחידת דיור',
  studio: 'סטודיו',
  'basement-apartment': 'דירת מרתף',
  villa: 'וילה',
};

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

/** Self-contained Hebrew long date (no dayjs locale dependency): "1 ביולי 2026". */
const HE_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const formatHeDate = (d: ReturnType<typeof dayjs>): string => `${d.date()} ב${HE_MONTHS[d.month()]} ${d.year()}`;

/** Human relative age for a listing — keeps recent rows feeling live, not template-y. */
const relDaysLabel = (iso: string): string => {
  const days = dayjs().startOf('day').diff(dayjs(iso).startOf('day'), 'day');
  if (days <= 0) return 'נוסף היום';
  if (days === 1) return 'נוסף אתמול';
  if (days < 7) return `לפני ${days} ימים`;
  if (days < 14) return 'לפני שבוע';
  return `לפני ${Math.floor(days / 7)} שבועות`;
};

/** Bidi-isolated, tabular-numeral wrapper so ₪/%/commas/digits never reorder in RTL. */
const Num: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span dir="ltr" style={{ fontVariantNumeric: 'tabular-nums', unicodeBidi: 'isolate', display: 'inline-block', ...style }}>
    {children}
  </span>
);

/** Quiet section label — no gold/uppercase "eyebrow" trope; hierarchy via size + whitespace. */
const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 12.5, fontWeight: 600, color: MUTED, ...style }}>{children}</div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{children}</span>
);

const cardBody: { body: React.CSSProperties } = { body: { padding: 22 } };

/* ===== page ===== */
export default function AdminDashboard() {
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

    const typeMap = new Map<string, number>();
    p.forEach((x) => typeMap.set(x.propertyType, (typeMap.get(x.propertyType) || 0) + 1));
    const typeCounts = Array.from(typeMap.entries())
      .map(([type, count]) => ({ type, count, label: PROPERTY_TYPE_HE[type] || type }))
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
  }, [p]);

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

  /* ===== render ===== */
  return (
    <div className="px-2 sm:px-4 md:px-0 estate-console">
      <h1 className="ec-sr-only">לוח בקרה</h1>

      {/* ── Masthead — a slim navy bar (brand + date, one honest stat line, thin detail),
              with the new-leads CTA folded in. No billboard number, no separate strip. ── */}
      <div className="ec-masthead">
        <div className="ec-mast-top">
          <span className="ec-mast-title">רם נכסים · לוח בקרה</span>
          <span className="ec-mast-date">{formatHeDate(dayjs())}</span>
        </div>

        {propsLoading ? (
          <Skeleton.Button active style={{ width: 340, height: 22, borderRadius: 6, marginTop: 14 }} />
        ) : (
          <>
            <div className="ec-mast-line">
              <span className="ec-mast-stat">
                <Num style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{ils(portfolio.portfolioValue)}</Num>
                <span className="ec-mast-cap">שווי תיק</span>
              </span>
              <span className="ec-mast-sep">·</span>
              <span className="ec-mast-stat"><Num style={{ fontWeight: 700 }}>{portfolio.activeCount}</Num> נכסים פעילים</span>
              <span className="ec-mast-sep">·</span>
              <span className="ec-mast-stat">
                <Num style={{ fontWeight: 700 }}>{portfolio.saleCount}</Num> למכירה · <Num style={{ fontWeight: 700 }}>{portfolio.rentCount}</Num> להשכרה
              </span>

              {!trafficLoading && (summary?.newInquiries ?? 0) > 0 && (
                <Link href="/admin/inquiries" className="ec-mast-cta">
                  <Num style={{ fontWeight: 700 }}>{summary?.newInquiries}</Num> פניות חדשות
                  <ArrowLeftOutlined style={{ fontSize: 11 }} />
                </Link>
              )}
            </div>

            <div className="ec-mast-detail">
              יקר ביותר <Num>{ils(portfolio.maxPrice)}</Num> · ממוצע <Num>{ils(portfolio.avgPrice)}</Num>
              {portfolio.newThisWeek > 0 && <> · נוספו השבוע <Num>{portfolio.newThisWeek}</Num></>}
            </div>
          </>
        )}
      </div>

      {/* ── Traffic at a glance — headline KPIs + sparkline; full, filterable analytics lives on /admin/analytics ── */}
      <Card
        styles={cardBody}
        style={{ marginBottom: 24 }}
        title={<SectionTitle>תנועת האתר</SectionTitle>}
        extra={
          <Link href="/admin/analytics" className="ec-viewall">
            לאנליטיקה המלאה <ArrowLeftOutlined style={{ fontSize: 11 }} />
          </Link>
        }
      >
        {trafficLoading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          <div className="ec-traffic">
            {/* Funnel order (visitors → views → interactions → leads) reads like a story,
                not an even grid of interchangeable numbers. Rates live in the foot, honest. */}
            <div className="ec-kpis">
              <Kpi label="מבקרים ייחודיים" value={uniqueVisitors} />
              <Kpi label="צפיות" value={totalViews} />
              <Kpi label="אינטראקציות" value={totalClicks} />
              <Kpi label="פניות" value={leadSignals} accent />
            </div>

            <div className="ec-spark">
              {trendEmpty ? (
                <EmptyBlock height={72} text="אין עדיין נתוני תנועה" />
              ) : (
                <ResponsiveContainer width="100%" height={72}>
                  <AreaChart data={series} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ecSparkViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={NAVY} stopOpacity={0.22} />
                        <stop offset="95%" stopColor={NAVY} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="ecSparkClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GOLD} stopOpacity={0.22} />
                        <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" reversed hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ borderRadius: 10, border: `1px solid ${HAIRLINE}`, direction: 'rtl', textAlign: 'right', boxShadow: '0 6px 18px rgba(0,0,0,.06)', fontSize: 12 }}
                      labelStyle={{ fontWeight: 700, marginBottom: 4, color: NAVY }}
                    />
                    <Area type="monotone" dataKey="views" name="צפיות" stroke={NAVY} strokeWidth={2} fill="url(#ecSparkViews)" activeDot={{ r: 4 }} />
                    <Area type="monotone" dataKey="clicks" name="אינטראקציות" stroke={GOLD} strokeWidth={2} fill="url(#ecSparkClicks)" activeDot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              <div className="ec-spark-foot">
                יחס המרה <Num style={{ color: GOLD_TEXT, fontWeight: 600 }}>{conversion}%</Num> · מעורבות <Num style={{ color: INK, fontWeight: 600 }}>{engagement}%</Num>
                <br />
                {WINDOW_DAYS} הימים האחרונים · היום <Num style={{ color: INK, fontWeight: 600 }}>{viewsToday}</Num> צפיות · <Num style={{ color: GOLD_TEXT, fontWeight: 600 }}>{leadsToday}</Num> פניות
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ── Composition + Attention queue ── */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }} align="stretch">
        <Col xs={24} lg={13}>
          <Card style={{ height: '100%' }} styles={cardBody} title={<SectionTitle>הרכב התיק</SectionTitle>}>
            {propsLoading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : portfolio.total === 0 ? (
              <EmptyBlock height={160} text="אין עדיין נכסים במערכת" />
            ) : (
              <>
                <div className="ec-splitbar" role="img" aria-label="חלוקה למכירה והשכרה">
                  {portfolio.salePct > 0 && <div className="ec-bar-fill" style={{ width: `${portfolio.salePct}%`, background: NAVY }} />}
                  {portfolio.salePct < 100 && <div className="ec-bar-fill" style={{ width: `${100 - portfolio.salePct}%`, background: GOLD }} />}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 13 }}>
                  <span style={{ color: NAVY, fontWeight: 600 }}>
                    <span className="ec-dot" style={{ background: NAVY }} />
                    <Num>{portfolio.salePct}%</Num> · <Num>{portfolio.saleCount}</Num> למכירה
                  </span>
                  <span style={{ color: GOLD_TEXT, fontWeight: 600 }}>
                    <span className="ec-dot" style={{ background: GOLD }} />
                    <Num>{100 - portfolio.salePct}%</Num> · <Num>{portfolio.rentCount}</Num> להשכרה
                  </span>
                </div>

                <Label style={{ marginTop: 22, marginBottom: 8 }}>לפי סוג נכס</Label>
                <div>
                  {portfolio.typeCounts.map((t) => (
                    <div key={t.type} className="ec-typerow">
                      <span style={{ color: INK, fontSize: 13.5 }}>{t.label}</span>
                      <span className="ec-countbadge"><Num>{t.count}</Num></span>
                    </div>
                  ))}
                </div>

                {portfolio.cityCounts.length > 0 && (
                  <>
                    <Label style={{ marginTop: 18, marginBottom: 10 }}>ערים מובילות</Label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {portfolio.cityCounts.map((c) => (
                        <span key={c.label} className="ec-citychip">
                          {c.label} <Num style={{ color: GOLD_TEXT, fontWeight: 700, marginInlineStart: 4 }}>{c.count}</Num>
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={11}>
          <Card style={{ height: '100%' }} styles={cardBody} title={<SectionTitle>דורש טיפול</SectionTitle>}>
            {propsLoading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <div>
                <AttentionRow label="ירידות מחיר" count={portfolio.priceDrops} />
                <AttentionRow label="נכסים ללא תמונות" count={portfolio.noPhotos} />
                <AttentionRow label="נכסים מוסתרים" count={portfolio.hidden} />
                <AttentionRow label="נכסים שנמכרו" count={portfolio.soldCount} muted />
                {portfolio.hotCount > 0 && <AttentionRow label="הצעות חמות" count={portfolio.hotCount} muted />}
                {portfolio.pinnedCount > 0 && <AttentionRow label="נכסים מוצמדים" count={portfolio.pinnedCount} muted />}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* ── Recent listings ── */}
      <Card styles={cardBody} title={<SectionTitle>נכסים שנוספו לאחרונה</SectionTitle>} extra={<Link href="/admin/properties" className="ec-viewall">צפה בהכל <ArrowLeftOutlined style={{ fontSize: 11 }} /></Link>}>
        {propsLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : portfolio.recentListings.length === 0 ? (
          <EmptyBlock height={120} text="אין עדיין נכסים" />
        ) : (
          <div>
            {portfolio.recentListings.map((x) => (
              <Link key={x.id} href="/admin/properties" className="ec-row ec-listrow">
                {x.images && x.images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={x.images[0]} alt={x.title} className="ec-thumb" loading="lazy" />
                ) : (
                  <span className="ec-thumb ec-thumb-empty">
                    <PictureOutlined style={{ color: 'rgba(255,255,255,.7)', fontSize: 16 }} />
                  </span>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: NAVY, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{x.title}</div>
                  <div style={{ fontSize: 12.5, color: MUTED }}>
                    {getCityLabel(x.city) || x.location} · <Num>{x.rooms}</Num> חד׳ · <Num>{x.area}</Num> מ״ר · {relDaysLabel(x.createdAt)}
                  </div>
                </div>
                <Num style={{ fontWeight: 700, color: INK, fontSize: 14 }}>{ils(parseMoney(x.price))}</Num>
                <span className={`ec-dealpill ${x.dealType === 'sale' ? 'sale' : 'rent'}`}>
                  {x.dealType === 'sale' ? 'למכירה' : 'להשכרה'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <DashboardStyles />
    </div>
  );
}

/* ===== sub-components ===== */
function Kpi({ label, value, text, accent }: { label: string; value?: number; text?: string; accent?: boolean }) {
  return (
    <div className="ec-kpi">
      <div className="ec-kpi-label">{label}</div>
      <Num style={{ fontSize: 24, fontWeight: 700, color: accent ? GOLD_TEXT : NAVY }}>
        {text ?? (value ?? 0).toLocaleString('en-US')}
      </Num>
    </div>
  );
}

function AttentionRow({ label, count, muted }: { label: string; count: number; muted?: boolean }) {
  const ok = count === 0;
  return (
    <Link href="/admin/properties" className="ec-row ec-attrow">
      <span className="ec-attdot" style={{ background: ok ? '#DAD5CB' : muted ? '#C9CDD6' : GOLD }} />
      <span style={{ flex: 1, color: ok ? '#9AA0AA' : INK, fontSize: 14 }}>{label}</span>
      {ok ? (
        <span style={{ color: '#9AA0AA', fontSize: 13 }}>הכל תקין ✓</span>
      ) : (
        <>
          <Num style={{ fontWeight: 700, color: muted ? '#6B7280' : NAVY, fontSize: 15, marginInlineEnd: 10 }}>{count}</Num>
          <span className="ec-att-cta">צפה <ArrowLeftOutlined style={{ fontSize: 10 }} /></span>
        </>
      )}
    </Link>
  );
}

function EmptyBlock({ height, text }: { height: number; text: string }) {
  return (
    <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0A6B0', fontSize: 13.5, textAlign: 'center', padding: 16 }}>
      {text}
    </div>
  );
}

/* ===== scoped styles — one enclosure method per element, brand palette only ===== */
function DashboardStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
.ec-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}

/* Cards: a single hairline (no border+shadow stacking) on cream — flat & editorial */
.layout-dashboard .estate-console .ant-card{box-shadow:none;border:1px solid ${HAIRLINE};border-radius:12px;}
.layout-dashboard .estate-console .ant-card-head{border-bottom:1px solid ${HAIRLINE};}

/* Masthead — slim navy bar, one soft navy-tinted shadow. Informative, not a billboard. */
.estate-console .ec-masthead{
  background:${NAVY};border-radius:12px;padding:18px 26px;margin-bottom:22px;
  box-shadow:0 4px 16px rgba(28,54,100,.10);
}
.estate-console .ec-mast-top{display:flex;align-items:baseline;justify-content:space-between;gap:16px;}
.estate-console .ec-mast-title{color:#fff;font-size:15.5px;font-weight:700;letter-spacing:-.01em;}
.estate-console .ec-mast-date{color:rgba(255,255,255,.45);font-size:12.5px;white-space:nowrap;}
.estate-console .ec-mast-line{display:flex;align-items:center;gap:11px;flex-wrap:wrap;margin-top:13px;color:rgba(255,255,255,.9);font-size:14px;}
.estate-console .ec-mast-stat{display:inline-flex;align-items:baseline;gap:6px;}
.estate-console .ec-mast-cap{color:rgba(255,255,255,.55);font-size:12px;}
.estate-console .ec-mast-sep{color:rgba(255,255,255,.28);}
.estate-console .ec-mast-cta{margin-inline-start:auto;display:inline-flex;align-items:center;gap:7px;background:${GOLD};color:${NAVY};font-weight:700;font-size:13px;padding:6px 14px;border-radius:999px;text-decoration:none;white-space:nowrap;transition:filter .15s ease;}
.estate-console .ec-mast-cta:hover{filter:brightness(1.06);}
.estate-console .ec-mast-detail{color:rgba(255,255,255,.5);font-size:12px;margin-top:9px;}

/* Traffic at a glance — compact KPI strip + sparkline (deep analytics on /admin/analytics) */
.estate-console .ec-traffic{display:flex;gap:32px;align-items:center;flex-wrap:wrap;}
.estate-console .ec-kpis{display:flex;gap:30px;flex-wrap:wrap;flex:1;min-width:240px;}
.estate-console .ec-kpi{display:flex;flex-direction:column;gap:3px;}
.estate-console .ec-kpi-label{font-size:12.5px;font-weight:600;color:${MUTED};}
.estate-console .ec-spark{width:320px;max-width:100%;flex-shrink:0;}
.estate-console .ec-spark-foot{font-size:11.5px;color:#A0A6B0;margin-top:6px;text-align:center;}
@media (max-width:767px){.estate-console .ec-spark{width:100%;}}

/* Composition */
.estate-console .ec-splitbar{display:flex;height:12px;border-radius:6px;overflow:hidden;background:#EEECE7;}
.estate-console .ec-bar-fill{height:100%;transition:width .8s cubic-bezier(.22,1,.36,1);}
.estate-console .ec-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-inline-end:6px;vertical-align:middle;}
.estate-console .ec-typerow{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid #F5F2EC;}
.estate-console .ec-typerow:last-child{border-bottom:none;}
.estate-console .ec-countbadge{background:rgba(197,163,87,.14);color:${GOLD_TEXT};font-weight:700;font-size:12.5px;min-width:26px;text-align:center;padding:1px 8px;border-radius:7px;}
.estate-console .ec-citychip{background:#F6F3ED;border:1px solid ${HAIRLINE};border-radius:8px;padding:4px 10px;font-size:12.5px;color:${INK};}

/* Rows (attention / listings) — hover via background, no extra borders */
.estate-console .ec-row{transition:background .15s ease;}
.estate-console .ec-row:hover{background:${HOVER_BG};}
.estate-console .ec-attrow{display:flex;align-items:center;gap:10px;padding:12px 8px;margin-inline:-8px;border-radius:8px;text-decoration:none;border-bottom:1px solid #F5F2EC;}
.estate-console .ec-attrow:last-child{border-bottom:none;}
.estate-console .ec-attdot{width:9px;height:9px;border-radius:50%;flex-shrink:0;transition:transform .15s ease;}
.estate-console .ec-attrow:hover .ec-attdot{transform:scale(1.25);}
.estate-console .ec-att-cta{color:${GOLD_TEXT};font-size:12.5px;font-weight:600;white-space:nowrap;}

/* Recent listings */
.estate-console .ec-listrow{display:flex;align-items:center;gap:14px;padding:11px 8px;margin-inline:-8px;border-radius:10px;text-decoration:none;border-bottom:1px solid #F5F2EC;}
.estate-console .ec-listrow:last-child{border-bottom:none;}
.estate-console .ec-thumb{width:46px;height:46px;border-radius:9px;object-fit:cover;flex-shrink:0;}
.estate-console .ec-thumb-empty{display:inline-flex;align-items:center;justify-content:center;background:${NAVY};}
.estate-console .ec-dealpill{font-size:11.5px;font-weight:600;padding:3px 11px;border-radius:999px;white-space:nowrap;}
.estate-console .ec-dealpill.sale{background:rgba(28,54,100,.08);color:${NAVY};}
.estate-console .ec-dealpill.rent{background:rgba(197,163,87,.16);color:${GOLD_TEXT};}
.estate-console .ec-viewall{color:${GOLD_TEXT};font-weight:600;font-size:13px;text-decoration:none;}
.estate-console .ec-viewall:hover{color:${NAVY};}

@media (max-width:575px){
  .estate-console .ec-masthead{padding:16px 18px;}
  .estate-console .ec-mast-cta{margin-inline-start:0;margin-top:2px;}
}
@media (prefers-reduced-motion: reduce){
  .estate-console .ec-bar-fill{transition:none;}
}
`,
      }}
    />
  );
}
