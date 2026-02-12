'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Spin, Typography, DatePicker, Select, Tag, Button, Popconfirm, message } from 'antd';
import {
  EyeOutlined,
  AppstoreOutlined,
  UserOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  BarChartOutlined,
  DeleteOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ReloadOutlined,
  RiseOutlined
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

const { Title } = Typography;
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

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [views, setViews] = useState<PropertyView[]>([]);
  const [clicks, setClicks] = useState<ClickEvent[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, selectedProperty]);

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

    } catch (error) {
      console.error('Error fetching analytics:', error);
      message.error('שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (viewsData: PropertyView[], clicksData: ClickEvent[]) => {
    const dateMap = new Map<string, { views: Set<number>; clicks: number; uniqueIPs: Set<string> }>();

    // Helper to get date key
    const getDateKey = (dateStr: string) => dayjs(dateStr).format('DD/MM');

    // Initialize map for the date range if needed, but dynamic is fine for now
    
    // Process views
    viewsData.forEach(view => {
      const date = getDateKey(view.createdAt);
      if (!dateMap.has(date)) {
        dateMap.set(date, { views: new Set(), clicks: 0, uniqueIPs: new Set() });
      }
      const data = dateMap.get(date)!;
      data.views.add(view.id);
      data.uniqueIPs.add(view.ipAddress);
    });

    // Process clicks
    clicksData.forEach(click => {
      const date = getDateKey(click.createdAt);
      if (!dateMap.has(date)) {
        dateMap.set(date, { views: new Set(), clicks: 0, uniqueIPs: new Set() });
      }
      const data = dateMap.get(date)!;
      data.clicks++;
      data.uniqueIPs.add(click.ipAddress);
    });

    // Convert to array, sort by date logic (simple string sort works for DD/MM if within same year, 
    // strictly speaking should use full date for sort but keep DD/MM for display)
    const chartData: ChartDataPoint[] = Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        views: data.views.size,
        clicks: data.clicks,
        uniqueUsers: data.uniqueIPs.size,
        timestamp: dayjs(date, 'DD/MM').unix() // helper for sorting
      }))
      .sort((a, b) => a.timestamp - b.timestamp) // Sort by time
      .map(({ date, views, clicks, uniqueUsers }) => ({ date, views, clicks, uniqueUsers }))
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

  const getEventTypeColor = (eventType: string) => {
    const colors: Record<string, string> = {
      'property_view': 'blue',
      'click_property': 'green',
      'click_phone': 'orange',
      'click_email': 'purple',
      'click_whatsapp': 'green',
      'contact_form': 'red',
      'click_button': 'cyan',
    };
    return colors[eventType] || 'default';
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
      render: (property) => property ? (
        <span style={{ fontWeight: 500 }}>{property.title} <span style={{color: '#999', fontSize: '0.9em'}}>({property.location})</span></span>
      ) : <span style={{color: '#ccc'}}>לא זמין</span>,
    },
    {
      title: 'כתובת IP',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 140,
    },
    {
      title: 'תאריך',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
  ];

  const clicksColumns: ColumnsType<ClickEvent> = [
    {
      title: 'ID',
      dataIndex: 'propertyId',
      key: 'propertyId',
      width: 80,
      render: (id) => id ? <Tag>#{id}</Tag> : '-',
    },
    {
      title: 'פעולה',
      dataIndex: 'eventType',
      key: 'eventType',
      width: 140,
      render: (eventType) => (
        <Tag color={getEventTypeColor(eventType)}>
          {getEventTypeLabel(eventType)}
        </Tag>
      ),
    },
    {
      title: 'נכס',
      dataIndex: 'property',
      key: 'property',
      render: (property) => property ? property.title : '-',
    },
    {
      title: 'תאריך',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
  ];

  if (loading && !summary) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip="טוען נתונים..." />
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
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
            <Title level={2} style={{ margin: 0, color: '#001529' }}>
            <BarChartOutlined style={{ marginLeft: '12px' }} />
            דשבורד אנליטיקה
            </Title>
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
      <Card style={{ marginBottom: '24px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: '16px 24px' }}>
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
              showSearch
              filterOption={(input, option) => 
                (option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Select.Option value="all">הצג הכל</Select.Option>
              {(summary?.topProperties || []).map((p) => (
                <Select.Option key={p.propertyId} value={p.propertyId.toString()}>
                  נכס #{p.propertyId} ({p.views} צפיות)
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Key Metrics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ borderRadius: '8px', height: '100%' }}>
            <Statistic
                title="סה״כ צפיות"
                value={summary?.totalViews || 0}
                prefix={<EyeOutlined style={{ color: '#1890ff', backgroundColor: '#e6f7ff', padding: '8px', borderRadius: '50%' }} />}
                valueStyle={{ fontWeight: 'bold', color: '#1890ff' }}
            />
            </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ borderRadius: '8px', height: '100%' }}>
            <Statistic
                title="סה״כ לחיצות (פעולות)"
                value={summary?.totalClicks || 0}
                prefix={<AppstoreOutlined style={{ color: '#52c41a', backgroundColor: '#f6ffed', padding: '8px', borderRadius: '50%' }} />}
                valueStyle={{ fontWeight: 'bold', color: '#52c41a' }}
            />
            </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ borderRadius: '8px', height: '100%' }}>
            <Statistic
                title="יחס המרה (CTR)"
                value={conversionRate}
                suffix="%"
                prefix={<RiseOutlined style={{ color: '#722ed1', backgroundColor: '#f9f0ff', padding: '8px', borderRadius: '50%' }} />}
                valueStyle={{ fontWeight: 'bold', color: '#722ed1' }}
                precision={1}
            />
            </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ borderRadius: '8px', height: '100%' }}>
            <Statistic
                title="משתמשים ייחודיים"
                value={summary?.uniqueVisitors || 0}
                prefix={<UserOutlined style={{ color: '#faad14', backgroundColor: '#fffbe6', padding: '8px', borderRadius: '50%' }} />}
                valueStyle={{ fontWeight: 'bold', color: '#faad14' }}
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
            style={{ borderRadius: '8px', height: '100%' }}
          >
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#52c41a" stopOpacity={0.1}/>
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
                <Area type="monotone" dataKey="views" stroke="#1890ff" fillOpacity={1} fill="url(#colorViews)" name="צפיות" activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="clicks" stroke="#52c41a" fillOpacity={1} fill="url(#colorClicks)" name="לחיצות" activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Pie Chart */}
        <Col xs={24} lg={8}>
          <Card
            title={<span style={{ fontWeight: 600 }}>התפלגות פעולות</span>}
            style={{ borderRadius: '8px', height: '100%' }}
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

      {/* Bar Chart - Popular Properties */}
      {barChartData.length > 0 && (
        <Card
          title={<span style={{ fontWeight: 600 }}>נכסים מובילים (לפי פעולות)</span>}
          style={{ marginBottom: '24px', borderRadius: '8px' }}
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
                                <p style={{ margin: 0, color: '#52c41a' }}>{data.clicks} לחיצות</p>
                            </div>
                        );
                    }
                    return null;
                }}
              />
              <Bar dataKey="clicks" name="לחיצות" radius={[0, 4, 4, 0]} barSize={24}>
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Recent Activity Tables */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
            <Card
                title="פעולות אחרונות"
                style={{ borderRadius: '8px' }}
                bodyStyle={{ padding: 0 }}
            >
                <Table
                columns={clicksColumns}
                dataSource={Array.isArray(clicks) ? clicks.slice(0, 10) : []}
                rowKey="id"
                pagination={false}
                size="small"
                />
                <div style={{ padding: '12px', textAlign: 'center' }}>
                    <Button type="link">צפה בכל הפעולות</Button>
                </div>
            </Card>
        </Col>
        
        <Col xs={24} lg={12}>
            <Card
                title="צפיות אחרונות"
                style={{ borderRadius: '8px' }}
                bodyStyle={{ padding: 0 }}
            >
                <Table
                columns={viewsColumns}
                dataSource={Array.isArray(views) ? views.slice(0, 10) : []}
                rowKey="id"
                pagination={false}
                size="small"
                />
                <div style={{ padding: '12px', textAlign: 'center' }}>
                    <Button type="link">צפה בכל הצפיות</Button>
                </div>
            </Card>
        </Col>
      </Row>
    </div>
  );
}