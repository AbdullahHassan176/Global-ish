import {
  IsString, IsOptional, IsEnum, IsBoolean, IsArray, IsObject, IsUrl, IsInt, IsDateString, IsNumber, IsDecimal
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CredentialType, DeliveryStatus, TokenizationEventType, KPIType
} from '@prisma/client';

// ===== CREDENTIAL VAULT DTOs =====

export class CreateIntegrationCredentialDto {
  @IsString()
  name: string;

  @IsEnum(CredentialType)
  type: CredentialType;

  @IsString()
  provider: string;

  @IsObject()
  credentials: Record<string, any>; // Will be encrypted

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}

export class UpdateIntegrationCredentialDto extends CreateIntegrationCredentialDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ===== WEBHOOK ENDPOINT DTOs =====

export class CreateWebhookEndpointDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  events: string[];

  @IsString()
  secret: string;

  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;

  @IsOptional()
  @IsInt()
  timeout?: number;

  @IsOptional()
  @IsObject()
  retryPolicy?: {
    maxAttempts?: number;
    backoffMultiplier?: number;
    initialDelay?: number;
    maxDelay?: number;
  };

  @IsOptional()
  @IsString()
  credentialId?: string;
}

export class UpdateWebhookEndpointDto extends CreateWebhookEndpointDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ===== WEBHOOK DELIVERY DTOs =====

export class CreateWebhookDeliveryDto {
  @IsString()
  webhookId: string;

  @IsString()
  eventType: string;

  @IsObject()
  payload: Record<string, any>;

  @IsString()
  signature: string;
}

export class UpdateWebhookDeliveryDto {
  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;

  @IsOptional()
  @IsInt()
  responseCode?: number;

  @IsOptional()
  @IsString()
  responseBody?: string;

  @IsOptional()
  @IsInt()
  attemptCount?: number;

  @IsOptional()
  @IsDateString()
  nextRetryAt?: Date;

  @IsOptional()
  @IsDateString()
  deliveredAt?: Date;

  @IsOptional()
  @IsDateString()
  failedAt?: Date;
}

// ===== TOKENIZATION EVENT DTOs =====

export class CreateTokenizationEventDto {
  @IsEnum(TokenizationEventType)
  eventType: TokenizationEventType;

  @IsString()
  entityId: string;

  @IsString()
  entityType: string;

  @IsObject()
  sanitizedData: Record<string, any>;

  @IsOptional()
  @IsObject()
  originalData?: Record<string, any>;
}

export class UpdateTokenizationEventDto {
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsDateString()
  publishedAt?: Date;
}

// ===== TOKENIZATION KPI DTOs =====

export class CreateTokenizationKPIDto {
  @IsEnum(KPIType)
  kpiType: KPIType;

  @IsString()
  period: string;

  @IsDecimal()
  value: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateTokenizationKPIDto {
  @IsOptional()
  @IsDecimal()
  value?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsDateString()
  publishedAt?: Date;
}

// ===== QUERY DTOs =====

export class WebhookDeliveryQueryDto {
  @IsOptional()
  @IsString()
  webhookId?: string;

  @IsOptional()
  @IsString()
  eventType?: string;

  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;

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

export class TokenizationEventQueryDto {
  @IsOptional()
  @IsEnum(TokenizationEventType)
  eventType?: TokenizationEventType;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

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

export class TokenizationKPIQueryDto {
  @IsOptional()
  @IsEnum(KPIType)
  kpiType?: KPIType;

  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsInt()
  offset?: number;
}

// ===== BRIDGE API DTOs =====

export class BridgeEventDto {
  @IsString()
  eventId: string;

  @IsEnum(TokenizationEventType)
  eventType: TokenizationEventType;

  @IsString()
  entityId: string;

  @IsString()
  entityType: string;

  @IsObject()
  data: Record<string, any>;

  @IsDateString()
  timestamp: Date;

  @IsString()
  signature: string;
}

export class BridgeKPIDto {
  @IsString()
  kpiId: string;

  @IsEnum(KPIType)
  kpiType: KPIType;

  @IsString()
  period: string;

  @IsDecimal()
  value: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsDateString()
  timestamp: Date;

  @IsString()
  signature: string;
}

// ===== WEBHOOK PAYLOAD DTOs =====

export class WebhookPayloadDto {
  @IsString()
  eventId: string;

  @IsString()
  eventType: string;

  @IsString()
  entityId: string;

  @IsString()
  entityType: string;

  @IsObject()
  data: Record<string, any>;

  @IsDateString()
  timestamp: Date;

  @IsString()
  signature: string;
}

// ===== TEST DTOs =====

export class TestWebhookDto {
  @IsString()
  webhookId: string;

  @IsOptional()
  @IsString()
  eventType?: string;

  @IsOptional()
  @IsObject()
  testPayload?: Record<string, any>;
}

export class TestCredentialDto {
  @IsString()
  credentialId: string;

  @IsOptional()
  @IsObject()
  testData?: Record<string, any>;
}
