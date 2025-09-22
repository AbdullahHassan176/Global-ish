import {
  IsString, IsOptional, IsEnum, IsBoolean, IsDateString, IsObject, IsInt, IsNumber, IsArray
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  KPIType, KPICategory, KPITrend, ReportType, ReportFrequency, ReportFormat, ExportStatus, ModelType
} from '@prisma/client';

// ===== KPI DTOs =====

export class CreateKPIRecordDto {
  @IsEnum(KPIType)
  kpiType: KPIType;

  @IsEnum(KPICategory)
  category: KPICategory;

  @IsString()
  period: string;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsNumber()
  target?: number;

  @IsOptional()
  @IsNumber()
  previousValue?: number;

  @IsOptional()
  @IsEnum(KPITrend)
  trend?: KPITrend;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateKPIRecordDto {
  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsNumber()
  target?: number;

  @IsOptional()
  @IsNumber()
  previousValue?: number;

  @IsOptional()
  @IsEnum(KPITrend)
  trend?: KPITrend;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class KPICalculationDto {
  @IsString()
  period: string;

  @IsOptional()
  @IsEnum(KPICategory)
  category?: KPICategory;

  @IsOptional()
  @IsArray()
  @IsEnum(KPIType, { each: true })
  kpiTypes?: KPIType[];
}

// ===== REPORT DTOs =====

export class GenerateReportDto {
  @IsEnum(ReportType)
  reportType: ReportType;

  @IsOptional()
  @IsObject()
  filters?: ReportFiltersDto;

  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat;
}

export class ReportFiltersDto {
  @IsOptional()
  @IsObject()
  dateRange?: {
    start: Date;
    end: Date;
  };

  @IsOptional()
  @IsArray()
  @IsEnum(KPICategory, { each: true })
  categories?: KPICategory[];

  @IsOptional()
  @IsArray()
  @IsEnum(KPIType, { each: true })
  kpiTypes?: KPIType[];

  @IsOptional()
  @IsObject()
  entities?: {
    type: string;
    ids: string[];
  };

  @IsOptional()
  @IsObject()
  customFilters?: Record<string, any>;
}

export class CreateReportScheduleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ReportType)
  reportType: ReportType;

  @IsEnum(ReportFrequency)
  frequency: ReportFrequency;

  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  webhookUrls?: string[];

  @IsOptional()
  @IsObject()
  filters?: ReportFiltersDto;

  @IsEnum(ReportFormat)
  format: ReportFormat;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateReportScheduleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ReportFrequency)
  frequency?: ReportFrequency;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recipients?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  webhookUrls?: string[];

  @IsOptional()
  @IsObject()
  filters?: ReportFiltersDto;

  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ExportReportDto {
  @IsString()
  reportId: string;

  @IsEnum(ReportFormat)
  format: ReportFormat;
}

// ===== PREDICTIVE ANALYTICS DTOs =====

export class ETAPredictionDto {
  @IsString()
  shipmentId: string;

  @IsString()
  milestoneType: string;
}

export class HSCodeSuggestionDto {
  @IsString()
  productName: string;

  @IsString()
  description: string;
}

export class DemurrageRiskDto {
  @IsString()
  shipmentId: string;
}

export class UtilizationForecastDto {
  @IsString()
  period: string;
}

export class CreatePredictiveModelDto {
  @IsString()
  name: string;

  @IsEnum(ModelType)
  modelType: ModelType;

  @IsEnum(KPICategory)
  category: KPICategory;

  @IsString()
  algorithm: string;

  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  accuracy?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdatePredictiveModelDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  accuracy?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

// ===== DASHBOARD DTOs =====

export class DashboardDataDto {
  @IsString()
  userId: string;

  @IsString()
  role: string;

  @IsString()
  period: string;
}

export class CreateDashboardWidgetDto {
  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsObject()
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  @IsObject()
  config: Record<string, any>;
}

export class UpdateDashboardWidgetDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsObject()
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

// ===== ANALYTICS EVENT DTOs =====

export class CreateAnalyticsEventDto {
  @IsString()
  eventType: string;

  @IsEnum(KPICategory)
  category: KPICategory;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsObject()
  properties?: Record<string, any>;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

// ===== QUERY DTOs =====

export class KPIQueryDto {
  @IsOptional()
  @IsEnum(KPICategory)
  category?: KPICategory;

  @IsOptional()
  @IsArray()
  @IsEnum(KPIType, { each: true })
  kpiTypes?: KPIType[];

  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: Date;

  @IsOptional()
  @IsDateString()
  toDate?: Date;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsInt()
  offset?: number;
}

export class ReportQueryDto {
  @IsOptional()
  @IsEnum(ReportType)
  reportType?: ReportType;

  @IsOptional()
  @IsEnum(ReportFrequency)
  frequency?: ReportFrequency;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  fromDate?: Date;

  @IsOptional()
  @IsDateString()
  toDate?: Date;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsInt()
  offset?: number;
}

export class ExportQueryDto {
  @IsOptional()
  @IsEnum(ReportType)
  reportType?: ReportType;

  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat;

  @IsOptional()
  @IsEnum(ExportStatus)
  status?: ExportStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: Date;

  @IsOptional()
  @IsDateString()
  toDate?: Date;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsInt()
  offset?: number;
}

// ===== RESPONSE DTOs =====

export class KPIMetricsResponseDto {
  kpiType: KPIType;
  category: KPICategory;
  period: string;
  value: number;
  target?: number;
  previousValue?: number;
  trend?: KPITrend;
  metadata?: Record<string, any>;
  calculatedAt: Date;
}

export class ReportDataResponseDto {
  reportType: ReportType;
  period: string;
  generatedAt: Date;
  data: {
    summary: Record<string, any>;
    kpis: KPIMetricsResponseDto[];
    trends: any[];
    details: Record<string, any[]>;
  };
  metadata: {
    filters: ReportFiltersDto;
    recordCount: number;
    generationTime: number;
  };
}

export class ReportScheduleResponseDto {
  id: string;
  name: string;
  description?: string;
  reportType: ReportType;
  frequency: ReportFrequency;
  recipients: string[];
  webhookUrls: string[];
  filters?: ReportFiltersDto;
  format: ReportFormat;
  isActive: boolean;
  lastRunAt?: Date;
  nextRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class ReportExportResponseDto {
  id: string;
  scheduleId?: string;
  reportType: ReportType;
  format: ReportFormat;
  status: ExportStatus;
  fileUrl?: string;
  fileSize?: number;
  recordCount?: number;
  filters?: ReportFiltersDto;
  generatedAt: Date;
  expiresAt?: Date;
  downloadedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class ETAPredictionResponseDto {
  shipmentId: string;
  milestoneType: string;
  predictedDate: Date;
  confidence: number;
  historicalDelta: number;
  factors: {
    weather: number;
    portCongestion: number;
    carrierPerformance: number;
    routeEfficiency: number;
  };
  accuracy?: number;
}

export class HSCodeSuggestionResponseDto {
  productName: string;
  description: string;
  suggestedCode: string;
  confidence: number;
  reasoning: string;
  alternatives: Array<{
    code: string;
    confidence: number;
    reasoning: string;
  }>;
}

export class DemurrageRiskResponseDto {
  shipmentId: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
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

export class UtilizationForecastResponseDto {
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

// ===== WEBHOOK DTOs =====

export class WebhookPayloadDto {
  @IsString()
  event: string;

  @IsString()
  occurred_at: string;

  @IsString()
  tenant_id: string;

  @IsObject()
  data: Record<string, any>;

  @IsString()
  hmac: string;
}

export class TokenizationEventDto {
  @IsString()
  event: 'doc.hashed' | 'shipment.created' | 'milestone.updated' | 'invoice.created' | 'kpi.updated';

  @IsString()
  occurred_at: string;

  @IsString()
  tenant_id: string;

  @IsObject()
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

  @IsString()
  hmac: string;
}
