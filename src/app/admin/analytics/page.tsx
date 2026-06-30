'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Spin, DatePicker, Select, Tag, Button, Popconfirm, App } from 'antd';
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

/* Brand palette (matches src/lib/adminTheme.ts) — navy · gold · cream, no rainbow */
const NAVY = '#1C3664';
const GOLD = '#C5A357';
const GOLD_TEXT = '#8A6D2F'; // AA-safe gold for text on light surfaces
const HAIRLINE = '#E6E8EC';
// Categorical sequence kept within the navy/gold family + neutrals
const COLORS = ['#1C3664', '#C5A357', '#2A4A8A', '#8A6D2F', '#5B6B8C', '#B8A98A', '#9AA0AA', '#C9CDD6'];

export default function AnalyticsPage() {
  const { message } = App.useApp();
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
      message.error('שגיאה בטעינת הנתונים');
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
        message.success('האנליטיקה נמחקה בהצלחה');
        fetchAnalytics();
      } else {
        message.error('שגיאה במחיקת האנליטיקה');
      }
    } catch (error) {
      console.error('Error deleting analytics:', error);
      message.error('שגיאה במחיקת האנליטיקה');
    }
  };

  const getVisitorNumber = (ipAddress: string): string => {
    const visitorNum = ipToVisitorMap.get(ipAddress);
    return visitorNum ? `מבקר #${visitorNum}` : 'מבקר #?';
  };

  const getEventTypeLabel = (eventType: string) => {
    const labels: Record<string, string> = {
      'property_view': 'צפייה בנכס',
      'click_property': 'לחיצה על נכס',
      'click_phone': 'לחיצה על טלפון',
      'click_email': 'לחיצה על אימייל',
      'click_whatsapp': 'לחיצה על וואטסאפ',
      'contact_form': 'שליחת טופס',
      'click_button': 'לחיצה על כפתור',
    };
    return labels[eventType] || eventType;
  };

  // Restrained, brand-aligned chip: leads in gold, views in navy, the rest neutral —
  // replaces the previous rainbow of antd tag presets.
  const LEAD_EVENTS = ['click_phone', 'click_whatsapp', 'click_email', 'contact_form'];
  const getEventChipStyle = (eventType: string): React.CSSProperties => {
    const lead = LEAD_EVENTS.includes(eventType);
    const isView = eventType === 'property_view';
    return {
      background: lead ? 'rgba(197,163,87,.14)' : isView ? 'rgba(28,54,100,.08)' : '#F2F1EE',
      color: lead ? GOLD_TEXT : isView ? NAVY : '#6B7280',
      borderRadius: 6,
      padding: '2px 9px',
      fontSize: 12,
      fontWeight: 600,
      display: 'inline-block',
      whiteSpace: 'nowrap',
    };
  };

  // --- Calculate Conversion Rate ---
  const conversionRate = summary?.totalViews 
    ? ((summary.totalClicks / summary.totalViews) * 100).toFixed(1) 
    : '0.0';

  const viewsColumns: ColumnsType<PropertyView> = [
    {
      title: 'נכס',
      dataIndex: 'property',
      key: 'property',
      width: '35%',
      ellipsis: { showTitle: true },
      render: (property) => property ? (
        <div style={{ fontWeight: 500 }}>
          <div>{property.title}</div>
          <div style={{color: '#999', fontSize: '0.85em', marginTop: '2px'}}>{property.location}</div>
        </div>
      ) : <span style={{color: '#ccc'}}>לא זמין</span>,
    },
    {
      title: 'מזהה מבקר',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: '20%',
      render: (ip) => (
        <span style={{ fontWeight: 600, fontSize: '0.9em', color: '#1C3664' }}>
          {getVisitorNumber(ip)}
        </span>
      ),
    },
    {
      title: 'דפדפן',
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
      title: 'תאריך',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '25%',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
  ];

  const clicksColumns: ColumnsType<ClickEvent> = [
    {
      title: 'נכס',
      dataIndex: 'property',
      key: 'property',
      width: '25%',
      ellipsis: { showTitle: true },
      render: (property, record) => property ? (
        <div>
          <div style={{ fontWeight: 600 }}>{property.title}</div>
          <div style={{ fontSize: '0.85em', color: '#999' }}>#{record.propertyId}</div>
        </div>
      ) : record.propertyId ? <Tag>#{record.propertyId}</Tag> : '-',
    },
    {
      title: 'פעולה',
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
      title: 'מזהה מבקר',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: '18%',
      render: (ip) => (
        <span style={{ fontWeight: 600, fontSize: '0.9em', color: '#1C3664' }}>
          {getVisitorNumber(ip)}
        </span>
      ),
    },
    {
      title: 'דפדפן',
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
      title: 'תאריך',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '25%',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
  ];

  if (loading && !summary) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" description="טוען נתונים..." />
      </div>
    );
  }

  // Prepare pie chart data
  const pieChartData = (summary?.clickTypes || []).map(ct => ({
    name: getEventTypeLabel(ct.eventType),
    value: ct.count,
  }));

  // Prepare bar chart data
  const barChartData = (summary?.topPropertiesByClicks || [])
    .slice(0, 8)
    .map(p => ({
      name: p.property ? (p.property.title.length > 15 ? p.property.title.substring(0, 15) + '...' : p.property.title) : `נכס #${p.propertyId}`,
      clicks: p.clicks,
      fullTitle: p.property?.title || '',
      propertyId: p.propertyId,
    }));

  return (
    <div className="px-2 sm:px-4 md:px-0 analytics-console">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="text-4xl font-bold" style={{ margin: 0, color: '#1C3664' }}>דשבורד אנליטיקה</h1>
          <div style={{ color: '#8c8c8c', marginTop: '4px' }}>צפה בביצועי האתר והנכסים שלך בזמן אמת</div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
            <Button icon={<ReloadOutlined />} onClick={fetchAnalytics} loading={loading}>
                רענן
            </Button>
            <Popconfirm
            title="מחיקת נתונים"
            description="האם אתה בטוח שברצונך למחוק את כל ההיסטוריה? פעולה זו אינה הפיכה."
            onConfirm={() => handleDeleteAnalytics('all')}
            okText="מחק הכל"
            cancelText="ביטול"
            okButtonProps={{ danger: true }}
            >
            <Button danger icon={<DeleteOutlined />}>
                איפוס נתונים
            </Button>
            </Popconfirm>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="mb-6">
        <Row gutter={24} align="middle">
          <Col xs={24} md={12} lg={8}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>טווח תאריכים:</div>
            <RangePicker
              style={{ width: '100%' }}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
              format="DD/MM/YYYY"
              placeholder={['מתאריך', 'עד תאריך']}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>סינון לפי נכס:</div>
            <Select
              style={{ width: '100%' }}
              value={selectedProperty}
              onChange={setSelectedProperty}
              placeholder="בחר נכס"
              showSearch={{
                filterOption: (input, option) =>
                  (option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0,
              }}
            >
              <Select.Option value="all">הצג הכל</Select.Option>
              {(summary?.topProperties || []).map((p) => (
                <Select.Option key={p.propertyId} value={p.propertyId.toString()}>
                  נכס #{p.propertyId} ({p.views} צפיות)
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>סינון לפי מבקר:</div>
            <Select
              style={{ width: '100%' }}
              value={selectedIP}
              onChange={setSelectedIP}
              placeholder="בחר מבקר"
              showSearch={{
                filterOption: (input, option) =>
                  (option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0,
              }}
            >
              <Select.Option value="all">הצג הכל</Select.Option>
              {(summary?.topUsersByClicks || []).map((user) => (
                <Select.Option key={user.ipAddress} value={user.ipAddress}>
                  {getVisitorNumber(user.ipAddress)} ({user.clicks} לחיצות)
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
              <UserOutlined style={{ fontSize: '32px', color: '#1C3664' }} />
            </Col>
            <Col flex="auto">
              <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
                פעילות משתמש: <span style={{ fontWeight: 700, color: '#1C3664' }}>{getVisitorNumber(selectedIP)}</span>
              </div>
              <div style={{ color: '#666' }}>
                {summary?.topUsersByClicks?.find(u => u.ipAddress === selectedIP) && (
                  <>
                    {summary.topUsersByClicks.find(u => u.ipAddress === selectedIP)!.clicks} לחיצות סה״כ
                  </>
                )}
              </div>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={() => setSelectedIP('all')}
                icon={<ReloadOutlined />}
              >
                נקה סינון
              </Button>
            </Col>
          </Row>
        </Card>
      )}

      {/* Key Metrics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
            <Card style={{ height: '100%' }}>
            <Statistic
                title="סה״כ צפיות"
                value={summary?.totalViews || 0}
                prefix={<EyeOutlined style={{ color: '#1C3664' }} />}
                styles={{ content: { fontWeight: 'bold', color: '#1C3664' } }}
            />
            </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
            <Card style={{ height: '100%' }}>
            <Statistic
                title="סה״כ לחיצות (פעולות)"
                value={summary?.totalClicks || 0}
                prefix={<AppstoreOutlined style={{ color: NAVY }} />}
                styles={{ content: { fontWeight: 'bold', color: NAVY } }}
            />
            </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
            <Card style={{ height: '100%' }}>
            <Statistic
                title="יחס המרה (CTR)"
                value={conversionRate}
                suffix="%"
                prefix={<RiseOutlined style={{ color: GOLD }} />}
                styles={{ content: { fontWeight: 'bold', color: GOLD_TEXT } }}
                precision={1}
            />
            </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
            <Card style={{ height: '100%' }}>
            <Statistic
                title="משתמשים ייחודיים"
                value={summary?.uniqueVisitors || 0}
                prefix={<UserOutlined style={{ color: NAVY }} />}
                styles={{ content: { fontWeight: 'bold', color: NAVY } }}
            />
            </Card>
        </Col>
      </Row>

      {/* Main Charts Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* Line Chart */}
        <Col xs={24} lg={16}>
          <Card
            title={<span style={{ fontWeight: 600 }}>מגמות לאורך זמן</span>}
            style={{ height: '100%' }}
          >
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1C3664" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1C3664" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.7}/>
                    <stop offset="95%" stopColor={GOLD} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="views" stroke="#1C3664" fillOpacity={1} fill="url(#colorViews)" name="צפיות" activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="clicks" stroke={GOLD} fillOpacity={1} fill="url(#colorClicks)" name="לחיצות" activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Pie Chart */}
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontWeight: 600 }}>התפלגות פעולות</span>}
            style={{ height: '100%' }}
          >
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
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Charts Row - Properties & Users */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {/* Bar Chart - Popular Properties */}
        {barChartData.length > 0 && (
          <Col xs={24} lg={12}>
            <Card
              title={<span style={{ fontWeight: 600 }}>נכסים מובילים (לפי פעולות)</span>}
              style={{ height: '100%' }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                                <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                                    <p style={{ fontWeight: 'bold', margin: 0 }}>{data.fullTitle}</p>
                                    <p style={{ margin: 0, color: GOLD_TEXT }}>{data.clicks} לחיצות</p>
                                </div>
                            );
                        }
                        return null;
                    }}
                  />
                  <Bar dataKey="clicks" name="לחיצות" radius={[0, 4, 4, 0]} barSize={24}>
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
              title={<span style={{ fontWeight: 600 }}>מבקרים פעילים</span>}
              style={{ height: '100%' }}
            >
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {summary.topUsersByClicks.map((user, index) => {
                  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
                  const browser = user.userAgent ? browsers.find(b => user.userAgent!.includes(b)) || 'Unknown' : 'Unknown';
                  const isMobile = !!user.userAgent?.includes('Mobile');
                  const isSelected = selectedIP === user.ipAddress;

                  return (
                    <div
                      key={user.ipAddress}
                      onClick={() => setSelectedIP(user.ipAddress)}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: isSelected ? 'rgba(28, 54, 100, 0.06)' : 'transparent',
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
                          <Tag color={index < 3 ? 'gold' : 'default'}>#{index + 1}</Tag>
                          <span style={{ fontSize: '0.95em', fontWeight: 700, color: '#1C3664' }}>
                            {getVisitorNumber(user.ipAddress)}
                          </span>
                          {isSelected && (
                            <Tag color="gold">מסונן</Tag>
                          )}
                        </div>
                        <div style={{ fontSize: '0.85em', color: '#888', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {isMobile ? <MobileOutlined /> : <DesktopOutlined />}
                          {browser}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '1.5em',
                        fontWeight: 'bold',
                        color: '#1C3664',
                        minWidth: '60px',
                        textAlign: 'center',
                      }}>
                        {user.clicks}
                        <div style={{ fontSize: '0.4em', color: '#999', fontWeight: 'normal' }}>לחיצות</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </Col>
        )}
      </Row>

      {/* Recent Activity Tables */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
            <Card title="פעולות אחרונות">
                <Table
                columns={clicksColumns}
                dataSource={Array.isArray(clicks) ? clicks.slice(0, 10) : []}
                rowKey="id"
                pagination={false}
                scroll={{ x: 800 }}
                />
            </Card>
        </Col>

        <Col xs={24} lg={12}>
            <Card title="צפיות אחרונות">
                <Table
                columns={viewsColumns}
                dataSource={Array.isArray(views) ? views.slice(0, 10) : []}
                rowKey="id"
                pagination={false}
                scroll={{ x: 700 }}
                />
            </Card>
        </Col>
      </Row>

      <style
        dangerouslySetInnerHTML={{
          __html: `
/* Flatten cards: one hairline enclosure, no border+shadow stacking — matches the dashboard */
.layout-dashboard .analytics-console .ant-card{box-shadow:none;border:1px solid ${HAIRLINE};border-radius:12px;}
.layout-dashboard .analytics-console .ant-card-head{border-bottom:1px solid ${HAIRLINE};}
.analytics-console .recharts-default-legend{font-size:12px;}
`,
        }}
      />
    </div>
  );
}