import { KPIType, KPICategory, KPITrend, ReportType, ReportFrequency, ReportFormat, ExportStatus } from '@prisma/client';

export interface KPICalculationService {
  calculateKPIs(period: string, category?: KPICategory): Promise<KPIMetrics[]>;
  calculateKPI(kpiType: KPIType, period: string): Promise<KPIMetrics | null>;
}

export interface ReportingService {
  generateReport(reportType: ReportType, filters?: ReportFilters): Promise<ReportData>;
  scheduleReport(schedule: ReportSchedule): Promise<ReportSchedule>;
  exportReport(reportId: string, format: ReportFormat): Promise<ReportExport>;
  getReportHistory(userId: string): Promise<ReportExport[]>;
}

export interface PredictiveAnalyticsService {
  predictETA(shipmentId: string, milestoneType: string): Promise<ETAPrediction>;
  suggestHSCode(productName: string, description: string): Promise<HSCodeSuggestion[]>;
  calculateDemurrageRisk(shipmentId: string): Promise<DemurrageRisk>;
  forecastUtilization(period: string): Promise<UtilizationForecast>;
}

export interface KPIMetrics {
  kpiType: KPIType;
  category: KPICategory;
  period: string;
  value: number;
  target?: number;
  previousValue?: number;
  trend?: KPITrend;
  metadata?: Record<string, any>;
}

export interface KPITrendAnalysis {
  kpiType: KPIType;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercentage: number;
  trend: KPITrend;
  period: string;
  isTargetMet: boolean;
  targetGap: number;
}

export interface ReportData {
  reportType: ReportType;
  period: string;
  generatedAt: Date;
  data: {
    summary: Record<string, any>;
    kpis: KPIMetrics[];
    trends: KPITrendAnalysis[];
    details: Record<string, any[]>;
  };
  metadata: {
    filters: ReportFilters;
    recordCount: number;
    generationTime: number;
  };
}

export interface ReportFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: KPICategory[];
  kpiTypes?: KPIType[];
  entities?: {
    type: string;
    ids: string[];
  };
  customFilters?: Record<string, any>;
}

export interface ReportSchedule {
  id?: string;
  name: string;
  description?: string;
  reportType: ReportType;
  frequency: ReportFrequency;
  recipients: string[];
  webhookUrls: string[];
  filters?: ReportFilters;
  format: ReportFormat;
  isActive: boolean;
  lastRunAt?: Date;
  nextRunAt?: Date;
  createdBy: string;
}

export interface ReportExport {
  id: string;
  scheduleId?: string;
  reportType: ReportType;
  format: ReportFormat;
  status: ExportStatus;
  fileUrl?: string;
  fileSize?: number;
  recordCount?: number;
  filters?: ReportFilters;
  generatedAt: Date;
  expiresAt?: Date;
  downloadedAt?: Date;
  createdBy: string;
}

export interface ETAPrediction {
  shipmentId: string;
  milestoneType: string;
  predictedDate: Date;
  confidence: number; // 0-1
  historicalDelta: number; // Days difference from historical average
  factors: {
    weather: number;
    portCongestion: number;
    carrierPerformance: number;
    routeEfficiency: number;
  };
  accuracy?: number; // Actual vs predicted accuracy
}

export interface HSCodeSuggestion {
  productName: string;
  description: string;
  suggestedCode: string;
  confidence: number; // 0-1
  reasoning: string;
  alternatives: Array<{
    code: string;
    confidence: number;
    reasoning: string;
  }>;
}

export interface DemurrageRisk {
  shipmentId: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number; // 0-100
  factors: {
    portCongestion: number;
    documentationDelays: number;
    weatherConditions: number;
    carrierReliability: number;
  };
  estimatedDemurrageDays: number;
  estimatedCost: number;
  recommendations: string[];
}

export interface UtilizationForecast {
  period: string;
  predictedUtilization: number;
  confidence: number;
  factors: {
    historicalTrend: number;
    seasonalAdjustment: number;
    projectPipeline: number;
    resourceAvailability: number;
  };
  scenarios: {
    optimistic: number;
    realistic: number;
    pessimistic: number;
  };
}

export interface AnalyticsEvent {
  eventType: string;
  category: KPICategory;
  entityId?: string;
  entityType?: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface DashboardData {
  userId: string;
  role: string;
  period: string;
  kpis: KPIMetrics[];
  trends: KPITrendAnalysis[];
  alerts: DashboardAlert[];
  widgets: DashboardWidget[];
  lastUpdated: Date;
}

export interface DashboardAlert {
  id: string;
  type: 'KPI_THRESHOLD' | 'TREND_ANOMALY' | 'DEADLINE_APPROACHING' | 'SYSTEM_ISSUE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  kpiType?: KPIType;
  threshold?: number;
  currentValue?: number;
  createdAt: Date;
  isRead: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'KPI_CARD' | 'CHART' | 'TABLE' | 'ALERT_LIST' | 'CUSTOM';
  title: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: Record<string, any>;
  data: any;
}

export interface RoleSpecificDashboard {
  role: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  kpis: KPIType[];
  refreshInterval: number; // minutes
  permissions: string[];
}

export interface KPIComparison {
  kpiType: KPIType;
  current: {
    value: number;
    period: string;
  };
  previous: {
    value: number;
    period: string;
  };
  target: {
    value: number;
    period: string;
  };
  benchmark: {
    value: number;
    source: string;
  };
  analysis: {
    vsPrevious: {
      change: number;
      changePercentage: number;
      trend: KPITrend;
    };
    vsTarget: {
      gap: number;
      gapPercentage: number;
      isMet: boolean;
    };
    vsBenchmark: {
      difference: number;
      differencePercentage: number;
      performance: 'ABOVE' | 'BELOW' | 'AT';
    };
  };
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  reportType: ReportType;
  category: KPICategory;
  template: {
    sections: ReportSection[];
    filters: ReportFilterTemplate[];
    formatting: ReportFormatting;
  };
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'KPI_SUMMARY' | 'CHART' | 'TABLE' | 'TEXT' | 'CUSTOM';
  order: number;
  config: Record<string, any>;
  dataSource: {
    kpiTypes?: KPIType[];
    entityTypes?: string[];
    aggregation?: 'SUM' | 'AVERAGE' | 'COUNT' | 'MIN' | 'MAX';
  };
}

export interface ReportFilterTemplate {
  id: string;
  name: string;
  type: 'DATE_RANGE' | 'SELECT' | 'MULTI_SELECT' | 'TEXT' | 'NUMBER';
  required: boolean;
  options?: string[];
  defaultValue?: any;
  validation?: Record<string, any>;
}

export interface ReportFormatting {
  theme: 'LIGHT' | 'DARK' | 'CUSTOM';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  layout: {
    orientation: 'PORTRAIT' | 'LANDSCAPE';
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    header: {
      show: boolean;
      title: string;
      logo?: string;
    };
    footer: {
      show: boolean;
      text: string;
    };
  };
  charts: {
    defaultType: 'LINE' | 'BAR' | 'PIE' | 'AREA' | 'SCATTER';
    showLegend: boolean;
    showGrid: boolean;
    showLabels: boolean;
  };
}

export interface WebhookPayload {
  event: string;
  occurred_at: string;
  tenant_id: string;
  data: Record<string, any>;
  hmac: string;
}

export interface TokenizationEvent {
  event: 'doc.hashed' | 'shipment.created' | 'milestone.updated' | 'invoice.created' | 'kpi.updated';
  occurred_at: string;
  tenant_id: string;
  data: {
    document_id?: string;
    shipment_id?: string;
    milestone_id?: string;
    invoice_id?: string;
    kpi_id?: string;
    sha256?: string;
    anchor_tx?: string;
    resource_type?: string;
    shipment_ref?: string;
    [key: string]: any;
  };
  hmac: string;
}
