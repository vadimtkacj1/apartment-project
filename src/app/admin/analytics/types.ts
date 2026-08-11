import type { MessagesShape } from '@/lib/adminI18n';
import type { analyticsMessages } from '@/lib/adminI18n/messages/analytics';
import type { BoardWidgetDef } from '@/components/admin/board/types';

/** Resolved analytics message record for the active admin locale. */
export type AnalyticsText = MessagesShape<(typeof analyticsMessages)['he']>;

export interface AnalyticsSummary {
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

export interface PropertyView {
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

export interface ClickEvent {
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

export interface ChartDataPoint {
  date: string;
  views: number;
  clicks: number;
  uniqueUsers: number;
}

/**
 * Everything the analytics blocks render from. Widgets are pure functions of
 * this context — they never fetch, so the page stays the single loader and any
 * block can be added, moved or hidden without touching data flow.
 */
export interface AnalyticsWidgetContext {
  t: AnalyticsText;
  dir: 'rtl' | 'ltr';
  isMobile: boolean;
  reduced: boolean;
  summary: AnalyticsSummary | null;
  views: PropertyView[];
  clicks: ClickEvent[];
  chartData: ChartDataPoint[];
  selectedIP: string;
  setSelectedIP: (ip: string) => void;
  getVisitorNumber: (ipAddress: string) => string;
}

export type AnalyticsWidgetDef = BoardWidgetDef<AnalyticsWidgetContext>;
