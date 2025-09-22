import {
  IsString, IsOptional, IsEnum, IsBoolean, IsDateString, IsObject, IsInt, IsNumber
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ConsentType, LegalBasis, DataRequestType, DeviceType, RateLimitType, SecurityEventType, SecuritySeverity
} from '@prisma/client';

// ===== CONSENT MANAGEMENT DTOs =====

export class CreateConsentRecordDto {
  @IsEnum(ConsentType)
  consentType: ConsentType;

  @IsString()
  purpose: string;

  @IsEnum(LegalBasis)
  legalBasis: LegalBasis;

  @IsBoolean()
  isGranted: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: Date;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateConsentRecordDto {
  @IsOptional()
  @IsBoolean()
  isGranted?: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: Date;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

// ===== DATA RETENTION POLICY DTOs =====

export class CreateDataRetentionPolicyDto {
  @IsString()
  recordType: string;

  @IsInt()
  retentionPeriod: number; // Days

  @IsOptional()
  @IsBoolean()
  autoDelete?: boolean;

  @IsOptional()
  @IsString()
  legalBasis?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateDataRetentionPolicyDto {
  @IsOptional()
  @IsInt()
  retentionPeriod?: number;

  @IsOptional()
  @IsBoolean()
  autoDelete?: boolean;

  @IsOptional()
  @IsString()
  legalBasis?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ===== DATA REQUEST DTOs =====

export class CreateDataRequestDto {
  @IsString()
  userId: string;

  @IsEnum(DataRequestType)
  requestType: DataRequestType;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateDataRequestDto {
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

// ===== SESSION MANAGEMENT DTOs =====

export class CreateUserSessionDto {
  @IsString()
  ipAddress: string;

  @IsString()
  userAgent: string;

  @IsOptional()
  @IsString()
  fingerprint?: string;

  @IsOptional()
  @IsString()
  deviceFingerprint?: string;

  @IsOptional()
  @IsString()
  deviceName?: string;

  @IsOptional()
  @IsEnum(DeviceType)
  deviceType?: DeviceType;

  @IsOptional()
  @IsString()
  osName?: string;

  @IsOptional()
  @IsString()
  osVersion?: string;

  @IsOptional()
  @IsString()
  browserName?: string;

  @IsOptional()
  @IsString()
  browserVersion?: string;
}

export class UpdateUserSessionDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  lastActivityAt?: Date;

  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}

// ===== DEVICE MANAGEMENT DTOs =====

export class CreateUserDeviceDto {
  @IsString()
  deviceFingerprint: string;

  @IsOptional()
  @IsString()
  deviceName?: string;

  @IsEnum(DeviceType)
  deviceType: DeviceType;

  @IsOptional()
  @IsString()
  osName?: string;

  @IsOptional()
  @IsString()
  osVersion?: string;

  @IsOptional()
  @IsString()
  browserName?: string;

  @IsOptional()
  @IsString()
  browserVersion?: string;

  @IsOptional()
  @IsBoolean()
  isTrusted?: boolean;
}

export class UpdateUserDeviceDto {
  @IsOptional()
  @IsString()
  deviceName?: string;

  @IsOptional()
  @IsEnum(DeviceType)
  deviceType?: DeviceType;

  @IsOptional()
  @IsString()
  osName?: string;

  @IsOptional()
  @IsString()
  osVersion?: string;

  @IsOptional()
  @IsString()
  browserName?: string;

  @IsOptional()
  @IsString()
  browserVersion?: string;

  @IsOptional()
  @IsBoolean()
  isTrusted?: boolean;
}

// ===== RATE LIMITING DTOs =====

export class RateLimitConfigDto {
  @IsString()
  identifier: string;

  @IsEnum(RateLimitType)
  type: RateLimitType;

  @IsInt()
  requestsPerWindow: number;

  @IsInt()
  windowMs: number;

  @IsInt()
  blockDurationMs: number;

  @IsOptional()
  @IsString()
  route?: string;
}

export class RateLimitStatsDto {
  @IsInt()
  totalRequests: number;

  @IsInt()
  blockedRequests: number;

  @IsInt()
  activeBlocks: number;

  @IsObject()
  topViolators: Array<{
    identifier: string;
    type: RateLimitType;
    route?: string;
    requestCount: number;
    blockedAt: Date;
  }>;

  @IsObject()
  timeRange: {
    start: Date;
    end: Date;
  };
}

// ===== SECURITY EVENT DTOs =====

export class CreateSecurityEventDto {
  @IsEnum(SecurityEventType)
  eventType: SecurityEventType;

  @IsEnum(SecuritySeverity)
  severity: SecuritySeverity;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  route?: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateSecurityEventDto {
  @IsOptional()
  @IsBoolean()
  isResolved?: boolean;

  @IsOptional()
  @IsDateString()
  resolvedAt?: Date;

  @IsOptional()
  @IsString()
  resolvedBy?: string;
}

// ===== PII ENCRYPTION DTOs =====

export class CreatePIIEncryptionKeyDto {
  @IsString()
  keyId: string;

  @IsString()
  keyVersion: string;

  @IsOptional()
  @IsString()
  algorithm?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: Date;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdatePIIEncryptionKeyDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: Date;

  @IsOptional()
  @IsDateString()
  rotatedAt?: Date;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

// ===== QUERY DTOs =====

export class ConsentRecordQueryDto {
  @IsOptional()
  @IsEnum(ConsentType)
  consentType?: ConsentType;

  @IsOptional()
  @IsBoolean()
  isGranted?: boolean;

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

export class DataRequestQueryDto {
  @IsOptional()
  @IsEnum(DataRequestType)
  requestType?: DataRequestType;

  @IsOptional()
  @IsString()
  status?: string;

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

export class SecurityEventQueryDto {
  @IsOptional()
  @IsEnum(SecurityEventType)
  eventType?: SecurityEventType;

  @IsOptional()
  @IsEnum(SecuritySeverity)
  severity?: SecuritySeverity;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsBoolean()
  isResolved?: boolean;

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

// ===== DEVICE FINGERPRINT DTOs =====

export class DeviceFingerprintDto {
  @IsString()
  userAgent: string;

  @IsOptional()
  @IsString()
  screenResolution?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsBoolean()
  cookieEnabled?: boolean;

  @IsOptional()
  @IsString()
  doNotTrack?: string;
}

// ===== GDPR COMPLIANCE DTOs =====

export class GDPRComplianceReportDto {
  @IsInt()
  totalEncryptedFields: number;

  @IsInt()
  totalDecryptionOperations: number;

  @IsObject()
  keyRotationHistory: Array<{
    oldKeyId: string;
    newKeyId: string;
    rotatedAt: Date;
    rotatedBy: string;
    status: string;
  }>;

  @IsObject()
  auditLogs: Array<{
    operation: string;
    fieldName: string;
    userId?: string;
    timestamp: Date;
    success: boolean;
  }>;

  @IsNumber()
  complianceScore: number;

  @IsDateString()
  lastAuditDate: Date;

  @IsDateString()
  nextAuditDate: Date;
}

// ===== DATA EXPORT/ERASURE DTOs =====

export class DataExportRequestDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class DataErasureRequestDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

// ===== SECURITY SCAN DTOs =====

export class SecurityScanResultDto {
  @IsString()
  scanId: string;

  @IsString()
  scanType: string;

  @IsEnum(SecuritySeverity)
  severity: SecuritySeverity;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  filePath?: string;

  @IsOptional()
  @IsInt()
  lineNumber?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsDateString()
  scannedAt: Date;
}

export class VulnerabilityReportDto {
  @IsString()
  vulnerabilityId: string;

  @IsString()
  title: string;

  @IsEnum(SecuritySeverity)
  severity: SecuritySeverity;

  @IsString()
  description: string;

  @IsString()
  remediation: string;

  @IsOptional()
  @IsString()
  cveId?: string;

  @IsOptional()
  @IsString()
  cvssScore?: string;

  @IsOptional()
  @IsObject()
  affectedPackages?: Record<string, string>;

  @IsDateString()
  discoveredAt: Date;

  @IsOptional()
  @IsDateString()
  fixedAt?: Date;
}
