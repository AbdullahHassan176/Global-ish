import { TokenizationEventType, KPIType } from '@prisma/client';

export interface ITokenizationBridge {
  publishEvent(event: TokenizationEvent): Promise<string>;
  publishKPI(kpi: TokenizationKPI): Promise<string>;
  getEvents(query: TokenizationEventQuery): Promise<TokenizationEvent[]>;
  getKPIs(query: TokenizationKPIQuery): Promise<TokenizationKPI[]>;
  sanitizeData(data: Record<string, any>, entityType: string): Record<string, any>;
}

export interface TokenizationEvent {
  id?: string;
  eventType: TokenizationEventType;
  entityId: string;
  entityType: string;
  sanitizedData: Record<string, any>;
  originalData?: Record<string, any>;
  isPublished?: boolean;
  publishedAt?: Date;
}

export interface TokenizationKPI {
  id?: string;
  kpiType: KPIType;
  period: string;
  value: number;
  metadata?: Record<string, any>;
  isPublished?: boolean;
  publishedAt?: Date;
}

export interface TokenizationEventQuery {
  eventType?: TokenizationEventType;
  entityType?: string;
  isPublished?: boolean;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
}

export interface TokenizationKPIQuery {
  kpiType?: KPIType;
  period?: string;
  isPublished?: boolean;
  limit?: number;
  offset?: number;
}

export interface PIIFieldMapping {
  [entityType: string]: {
    allowed: string[];
    sanitized: string[];
    encrypted: string[];
    excluded: string[];
  };
}

export interface InvestorSafeFieldMapping {
  [entityType: string]: {
    allowed: string[];
    aggregated: string[];
    anonymized: string[];
  };
}

export interface DataSanitizationResult {
  sanitizedData: Record<string, any>;
  originalData?: Record<string, any>;
  piiRemoved: string[];
  fieldsEncrypted: string[];
  fieldsExcluded: string[];
}

export interface BridgeEventPayload {
  eventId: string;
  eventType: TokenizationEventType;
  entityId: string;
  entityType: string;
  data: Record<string, any>;
  timestamp: Date;
  signature: string;
}

export interface BridgeKPIPayload {
  kpiId: string;
  kpiType: KPIType;
  period: string;
  value: number;
  metadata?: Record<string, any>;
  timestamp: Date;
  signature: string;
}

export interface EventPublisher {
  publish(event: BridgeEventPayload): Promise<void>;
  publishKPI(kpi: BridgeKPIPayload): Promise<void>;
  generateSignature(payload: Record<string, any>): string;
  validateSignature(payload: Record<string, any>, signature: string): boolean;
}
