'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Spin, DatePicker, Select, Button, Popconfirm, Empty, App } from 'antd';
import {
  EyeOutlined,
  AppstoreOutlined,
  UserOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  DeleteOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ReloadOutlined,
  RiseOutlined,
  MobileOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useIsMobile } from '@/hooks/useIsMobile';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useAdminMessages, useAdminI18n } from '@/lib/adminI18n';
import { analyticsMessages } from '@/lib/adminI18n/messages/analytics';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import MetricCard from '@/components/admin/MetricCard';
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

const { RangePicker } = DatePicker;

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

/* Brand palette (matches src/lib/adminTheme.ts) — Aiterra: indigo · sky · deep navy, no rainbow */
const NAVY = '#354AC4';
const GOLD = '#5594F1'; // sky-blue accent
const GOLD_TEXT = '#2A69C4'; // AA-safe accent blue for text on light surfaces
const HAIRLINE = '#E4E8F2';
// Categorical sequence kept within the indigo/sky family + neutrals
const COLORS = ['#354AC4', '#5594F1', '#051150', '#2A69C4', '#7BAAF5', '#8F9BD8', '#9AA0AA', '#C9CDD6'];

// Referer buckets / Inquiry.source labels moved into analyticsMessages
// (t.trafficLabels / t.leadSourceLabels) — resolved per locale in the component.
// Matches STATUS_META in /admin/inquiries, tinted to the estate palette.
// Labels live in analyticsMessages (t.statusLabels).
const LEAD_STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  new: { color: '#2A69C4', bg: 'rgba(85,148,241,.16)' },
  in_progress: { color: NAVY, bg: 'rgba(53,74,196,.08)' },
  closed: { color: '#051150', bg: 'rgba(5,17,80,.07)' },
};

// Compact ranked bar list — used for both traffic sources and lead sources.
// One hairline-separated row per bucket: label · count · share, with a proportional
// bar (top bucket in gold). Deliberately not another pie chart.
function SourceBars({ items, labels }: { items?: Array<{ source: string; count: number }>; labels: Record<string, string> }) {
  const t = useAdminMessages(analyticsMessages);
  const data = (items || []).slice(0, 8);
  const total = data.reduce((s, d) => s + d.count, 0);
  if (!total) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t.noDataInRange} style={{ margin: '16px 0' }} />;
  return (
    <div>
      {data.map((d, i) => {
        const pct = Math.round((d.count / total) * 100);
        return (
          <div key={d.source} style={{ padding: '9px 0', borderBottom: i === data.length - 1 ? 'none' : `1px solid ${HAIRLINE}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>{labels[d.source] || d.source}</span>
              <span style={{ color: '#475569' }}>{d.count} · {pct}%</span>
            </div>
            <div style={{ position: 'relative', height: 6, borderRadius: 4, background: '#F0F1F3' }}>
              <div style={{ position: 'absolute', insetInlineStart: 0, top: 0, height: 6, borderRadius: 4, width: `${pct}%`, background: i === 0 ? GOLD : NAVY }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Section heading (matches AdminPageHeader). Top margin separates it from the
   previous section (24px row margin + 16px = 40px break); the smaller bottom
   margin keeps it visually attached to its own cards. */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: '16px 2px 16px' }}>
      <div style={{ fontWeight: 700, color: '#051150', fontSize: 18, letterSpacing: '-0.01em' }}>{children}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { message } = App.useApp();
  const t = useAdminMessages(analyticsMessages);
  const { dir } = useAdminI18n();
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [views, setViews] = useState<PropertyView[]>([]);
  const [clicks, setClicks] = useState<ClickEvent[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [selectedIP, setSelectedIP] = useState<string>('all');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [ipToVisitorMap, setIpToVisitorMap] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, selectedProperty, selectedIP]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.append('startDate', dateRange[0].toISOString());
        params.append('endDate', dateRange[1].toISOString());
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
      message.error(t.loadError);
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
        message.success(t.deleteSuccess);
        fetchAnalytics();
      } else {
        message.error(t.deleteError);
      }
    } catch (error) {
      console.error('Error deleting analytics:', error);
      message.error(t.deleteError);
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

  // Restrained, brand-aligned chip: leads in gold, views in navy, the rest neutral —
  // replaces the previous rainbow of antd tag presets.
  const LEAD_EVENTS = ['click_phone', 'click_whatsapp', 'click_email', 'contact_form'];
  const getEventChipStyle = (eventType: string): React.CSSProperties => {
    const lead = LEAD_EVENTS.includes(eventType);
    const isView = eventType === 'property_view';
    return {
      background: lead ? 'rgba(85,148,241,.14)' : isView ? 'rgba(53,74,196,.08)' : '#EEF1F7',
      color: lead ? GOLD_TEXT : isView ? NAVY : '#475569',
      borderRadius: 6,
      padding: '2px 9px',
      fontSize: 12,
      fontWeight: 600,
      display: 'inline-block',
      whiteSpace: 'nowrap',
    };
  };

  // Engagement = interactions (clicks) per view. This is NOT a conversion rate —
  // real conversion is leads/visitors (shown in the פניות section below). Labeling
  // clicks/views "יחס המרה" (conversion) next to 0 leads read as fake/"каша", so it
  // is honestly surfaced as "מעורבות" (matches the /admin dashboard terminology).
  const engagementRate = summary?.totalViews
    ? ((summary.totalClicks / summary.totalViews) * 100).toFixed(1)
    : '0.0';

  const viewsColumns: ColumnsType<PropertyView> = [
    {
      title: t.colProperty,
      dataIndex: 'property',
      key: 'property',
      width: '35%',
      ellipsis: { showTitle: true },
      render: (property) => property ? (
        <div style={{ fontWeight: 500 }}>
          <div>{property.title}</div>
          <div style={{color: '#64748B', fontSize: '0.85em', marginTop: '2px'}}>{property.location}</div>
        </div>
      ) : <span style={{color: '#94A3B8'}}>{t.notAvailable}</span>,
    },
    {
      title: t.colVisitorId,
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: '20%',
      render: (ip) => (
        <span style={{ fontWeight: 600, fontSize: '0.9em', color: '#354AC4' }}>
          {getVisitorNumber(ip)}
        </span>
      ),
    },
    {
      title: t.colBrowser,
      dataIndex: 'userAgent',
      key: 'userAgent',
      width: '20%',
      render: (userAgent) => {
        if (!userAgent) return '-';
        const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
        const browser = browsers.find(b => userAgent.includes(b)) || 'Unknown';
        const isMobile = userAgent.includes('Mobile');
        return (
          <span title={userAgent} style={{ fontSize: '0.9em', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {isMobile ? <MobileOutlined /> : <DesktopOutlined />}
            {browser}
          </span>
        );
      },
    },
    {
      title: t.colDate,
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '25%',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
  ];

  const clicksColumns: ColumnsType<ClickEvent> = [
    {
      title: t.colProperty,
      dataIndex: 'property',
      key: 'property',
      width: '25%',
      ellipsis: { showTitle: true },
      render: (property, record) => property ? (
        <div>
          <div style={{ fontWeight: 600 }}>{property.title}</div>
          <div style={{ fontSize: '0.85em', color: '#64748B' }}>#{record.propertyId}</div>
        </div>
      ) : record.propertyId ? <span className="admin-pill admin-pill--neutral">#{record.propertyId}</span> : '-',
    },
    {
      title: t.colAction,
      dataIndex: 'eventType',
      key: 'eventType',
      width: '15%',
      render: (eventType) => (
        <span style={getEventChipStyle(eventType)}>
          {getEventTypeLabel(eventType)}
        </span>
      ),
    },
    {
      title: t.colVisitorId,
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: '18%',
      render: (ip) => (
        <span style={{ fontWeight: 600, fontSize: '0.9em', color: '#354AC4' }}>
          {getVisitorNumber(ip)}
        </span>
      ),
    },
    {
      title: t.colBrowser,
      dataIndex: 'userAgent',
      key: 'userAgent',
      width: '17%',
      render: (userAgent) => {
        if (!userAgent) return '-';
        // Extract browser info
        const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
        const browser = browsers.find(b => userAgent.includes(b)) || 'Unknown';
        const isMobile = userAgent.includes('Mobile');
        return (
          <span title={userAgent} style={{ fontSize: '0.9em', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {isMobile ? <MobileOutlined /> : <DesktopOutlined />}
            {browser}
          </span>
        );
      },
    },
    {
      title: t.colDate,
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '25%',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
  ];

  if (loading && !summary) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, height: '400px' }}>
        <Spin size="large" />
        <span style={{ color: '#64748B' }}>{t.loadingData}</span>
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
    <div className="analytics-console" style={{ maxWidth: 1440, marginInline: 'auto' }}>
      {/* Header */}
      <AdminPageHeader
        title={t.title}
        subtitle={t.subtitle}
        extra={
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button icon={<ReloadOutlined />} onClick={fetchAnalytics} loading={loading}>
              {t.refresh}
            </Button>
            <Popconfirm
              title={t.deleteConfirmTitle}
              description={t.deleteConfirmDescription}
              onConfirm={() => handleDeleteAnalytics('all')}
              okText={t.deleteAll}
              cancelText={t.cancel}
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />}>
                {t.resetData}
              </Button>
            </Popconfirm>
          </div>
        }
      />

      {/* Filters Bar */}
      <Card className="mb-6">
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} md={12} lg={8}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>{t.dateRangeLabel}</div>
            <RangePicker
              style={{ width: '100%' }}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
              format="DD/MM/YYYY"
              placeholder={[t.fromDate, t.toDate]}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>{t.filterByProperty}</div>
            <Select
              style={{ width: '100%' }}
              value={selectedProperty}
              onChange={setSelectedProperty}
              placeholder={t.selectProperty}
              showSearch={{
                filterOption: (input, option) =>
                  (option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0,
              }}
            >
              <Select.Option value="all">{t.showAll}</Select.Option>
              {(summary?.topProperties || []).map((p) => (
                <Select.Option key={p.propertyId} value={p.propertyId.toString()}>
                  {t.propertyOption(p.propertyId, p.views)}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>{t.filterByVisitor}</div>
            <Select
              style={{ width: '100%' }}
              value={selectedIP}
              onChange={setSelectedIP}
              placeholder={t.selectVisitor}
              showSearch={{
                filterOption: (input, option) =>
                  (option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0,
              }}
            >
              <Select.Option value="all">{t.showAll}</Select.Option>
              {(summary?.topUsersByClicks || []).map((user) => (
                <Select.Option key={user.ipAddress} value={user.ipAddress}>
                  {getVisitorNumber(user.ipAddress)} ({t.clicksCount(user.clicks)})
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Selected User Info */}
      {selectedIP !== 'all' && (
        <Card className="mb-6">
          <Row align="middle" gutter={16}>
            <Col>
              <UserOutlined style={{ fontSize: '32px', color: '#354AC4' }} />
            </Col>
            <Col xs={24} flex="auto">
              <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
                {t.userActivity} <span style={{ fontWeight: 700, color: '#354AC4' }}>{getVisitorNumber(selectedIP)}</span>
              </div>
              <div style={{ color: '#64748B' }}>
                {summary?.topUsersByClicks?.find(u => u.ipAddress === selectedIP) && (
                  <>
                    {t.totalClicksOf(summary.topUsersByClicks.find(u => u.ipAddress === selectedIP)!.clicks)}
                  </>
                )}
              </div>
            </Col>
            <Col xs={24}>
              <Button
                type="primary"
                onClick={() => setSelectedIP('all')}
                icon={<ReloadOutlined />}
              >
                {t.clearFilter}
              </Button>
            </Col>
          </Row>
        </Card>
      )}

      {/* Key Metrics Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard icon={<EyeOutlined />} label={t.totalViews} value={summary?.totalViews || 0} accent={NAVY} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard icon={<AppstoreOutlined />} label={t.totalClicks} value={summary?.totalClicks || 0} accent={NAVY} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard icon={<RiseOutlined />} label={t.engagement} value={Number(engagementRate || 0).toFixed(1)} suffix="%" accent={GOLD} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard icon={<UserOutlined />} label={t.uniqueUsers} value={summary?.uniqueVisitors || 0} accent={NAVY} />
        </Col>
      </Row>

      {/* Leads (Inquiry table) — the money metric — plus where traffic and leads come
          from. All values are computed server-side in /api/analytics/track (summary). */}
      <SectionHeading>{t.inquiriesSection}</SectionHeading>
      <Row gutter={[20, 20]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard icon={<MessageOutlined />} label={t.totalInquiries} value={summary?.totalInquiries || 0} accent={NAVY} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard icon={<RiseOutlined />} label={t.newInquiries} value={summary?.newInquiries || 0} accent={GOLD} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard icon={<PhoneOutlined />} label={t.inquiriesToday} value={summary?.inquiriesToday || 0} accent={NAVY} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard icon={<MailOutlined />} label={t.inquiriesLast7Days} value={summary?.inquiriesLast7Days || 0} accent={NAVY} />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={8}>
          <Card title={<span style={{ fontWeight: 600 }}>{t.trafficSources}</span>} style={{ height: '100%' }}>
            <SourceBars items={summary?.trafficSources} labels={t.trafficLabels} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<span style={{ fontWeight: 600 }}>{t.inquiriesBySource}</span>} style={{ height: '100%' }}>
            <SourceBars items={summary?.inquiriesBySource} labels={t.leadSourceLabels} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<span style={{ fontWeight: 600 }}>{t.inquiriesByStatus}</span>} style={{ height: '100%' }}>
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
        </Col>
      </Row>

      {/* Main Charts Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* Line Chart */}
        <Col xs={24} lg={16}>
          <Card
            title={<span style={{ fontWeight: 600 }}>{t.trendsOverTime}</span>}
            style={{ height: '100%' }}
          >
            {displayChartData.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t.noDataInRange} style={{ margin: '48px 0' }} />
            ) : (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={displayChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#354AC4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#354AC4" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.7}/>
                    <stop offset="95%" stopColor={GOLD} stopOpacity={0.05}/>
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
                <Area type="monotone" dataKey="clicks" stroke={GOLD} fillOpacity={1} fill="url(#colorClicks)" name={t.clicksLegend} activeDot={{ r: 6 }} isAnimationActive={!reduced} />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </Card>
        </Col>

        {/* Pie Chart */}
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontWeight: 600 }}>{t.actionsDistribution}</span>}
            style={{ height: '100%' }}
          >
            {pieChartData.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t.noDataInRange} style={{ margin: '48px 0' }} />
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
                  label={({ name, percent }) => `${(percent ? percent * 100 : 0).toFixed(0)}%`}
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
        </Col>
      </Row>

      {/* Charts Row - Properties & Users */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* Bar Chart - Popular Properties */}
        {barChartData.length > 0 && (
          <Col xs={24} lg={12}>
            <Card
              title={<span style={{ fontWeight: 600 }}>{t.topProperties}</span>}
              style={{ height: '100%' }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={isMobile ? 90 : 150}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                                <div style={{ backgroundColor: '#fff', padding: '10px 12px', border: '1px solid #E4E8F2', borderRadius: 10, boxShadow: '0 6px 18px rgba(5,17,80,0.08)' }}>
                                    <p style={{ fontWeight: 'bold', margin: 0 }}>{data.fullTitle}</p>
                                    <p style={{ margin: 0, color: GOLD_TEXT }}>{t.clicksCount(data.clicks)}</p>
                                </div>
                            );
                        }
                        return null;
                    }}
                  />
                  <Bar dataKey="clicks" name={t.clicksLegend} radius={[0, 4, 4, 0]} barSize={24} isAnimationActive={!reduced}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? GOLD : NAVY} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        )}

        {/* Top Users by Clicks */}
        {summary?.topUsersByClicks && summary.topUsersByClicks.length > 0 && (
          <Col xs={24} lg={barChartData.length > 0 ? 12 : 24}>
            <Card
              title={<span style={{ fontWeight: 600 }}>{t.activeVisitors}</span>}
              style={{ height: '100%' }}
            >
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
                        borderBottom: `1px solid ${HAIRLINE}`,
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
                          <span style={{ fontSize: '0.95em', fontWeight: 700, color: '#354AC4' }}>
                            {getVisitorNumber(user.ipAddress)}
                          </span>
                          {isSelected && (
                            <span className="admin-pill admin-pill--neutral">{t.filteredTag}</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.85em', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {isMobile ? <MobileOutlined /> : <DesktopOutlined />}
                          {browser}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '1.5em',
                        fontWeight: 'bold',
                        color: '#354AC4',
                        minWidth: '60px',
                        textAlign: 'center',
                      }}>
                        {user.clicks}
                        <div style={{ fontSize: '0.4em', color: '#64748B', fontWeight: 'normal' }}>{t.clicksLegend}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </Col>
        )}
      </Row>

      {/* Recent Activity Tables — full-width, stacked one under the other so the
          5-column clicks table has room (side-by-side clipped the date column). */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={24} xl={12}>
            <Card title={t.recentActions}>
                <Table
                columns={clicksColumns}
                dataSource={Array.isArray(clicks) ? clicks.slice(0, 10) : []}
                rowKey="id"
                pagination={false}
                scroll={{ x: 640 }}
                />
            </Card>
        </Col>

        <Col xs={24} lg={24} xl={12}>
            <Card title={t.recentViews}>
                <Table
                columns={viewsColumns}
                dataSource={Array.isArray(views) ? views.slice(0, 10) : []}
                rowKey="id"
                pagination={false}
                scroll={{ x: 640 }}
                />
            </Card>
        </Col>
      </Row>

      <style
        dangerouslySetInnerHTML={{
          __html: `
/* Flatten cards: one hairline enclosure, no border+shadow stacking — matches the dashboard */
.layout-dashboard .analytics-console .ant-card{box-shadow:0 2px 10px rgba(53,74,196,.06);border:1px solid ${HAIRLINE};border-radius:12px;}
.layout-dashboard .analytics-console .ant-card-head{border-bottom:none;}
.analytics-console .recharts-default-legend{font-size:12px;}
/* Active-visitors rows are real buttons; background lives here so :hover isn't overridden by inline styles */
.analytics-console .analytics-visitor-row{background:transparent;}
.analytics-console .analytics-visitor-row:hover{background:rgba(53,74,196,.05);}
.analytics-console .analytics-visitor-row.is-selected{background:rgba(53,74,196,.07);}
.analytics-console .analytics-visitor-row:focus-visible{outline:2px solid ${NAVY};outline-offset:-2px;}
`,
        }}
      />
    </div>
  );
}