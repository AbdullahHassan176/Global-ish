import { ConsentType, LegalBasis, DataRequestType, DataRequestStatus } from '@prisma/client';

export interface GDPRComplianceService {
  createConsentRecord(createDto: any, userId: string): Promise<any>;
  getUserConsentRecords(userId: string): Promise<any[]>;
  updateConsentRecord(id: string, updateDto: any): Promise<any>;
  hasConsent(userId: string, consentType: ConsentType, purpose: string): Promise<boolean>;
  withdrawAllConsent(userId: string): Promise<void>;
  createDataRetentionPolicy(createDto: any, createdBy: string): Promise<any>;
  getAllDataRetentionPolicies(): Promise<any[]>;
  updateDataRetentionPolicy(id: string, updateDto: any): Promise<any>;
  getRecordsForDeletion(): Promise<Array<{ recordType: string; count: number; records: any[] }>>;
  createDataRequest(createDto: any, createdBy: string): Promise<any>;
  getUserDataRequests(userId: string): Promise<any[]>;
  processDataExport(requestId: string): Promise<any>;
  processDataErasure(requestId: string): Promise<any>;
}

export interface ConsentManagement {
  createConsent(consent: ConsentRecord): Promise<ConsentRecord>;
  updateConsent(consentId: string, updates: Partial<ConsentRecord>): Promise<ConsentRecord>;
  withdrawConsent(consentId: string): Promise<void>;
  getConsentHistory(userId: string): Promise<ConsentRecord[]>;
  validateConsent(userId: string, purpose: string): Promise<boolean>;
  getConsentSummary(userId: string): Promise<ConsentSummary>;
}

export interface DataLifecycleManagement {
  createRetentionPolicy(policy: DataRetentionPolicy): Promise<DataRetentionPolicy>;
  updateRetentionPolicy(policyId: string, updates: Partial<DataRetentionPolicy>): Promise<DataRetentionPolicy>;
  getRetentionPolicies(): Promise<DataRetentionPolicy[]>;
  identifyExpiredRecords(): Promise<ExpiredRecord[]>;
  processDataDeletion(recordIds: string[]): Promise<DeletionResult>;
  getDataLifecycleReport(): Promise<DataLifecycleReport>;
}

export interface DataExportService {
  createExportRequest(userId: string, requestType: DataRequestType): Promise<DataRequest>;
  processExportRequest(requestId: string): Promise<ExportResult>;
  getExportStatus(requestId: string): Promise<ExportStatus>;
  downloadExport(requestId: string): Promise<ExportDownload>;
  cleanupExpiredExports(): Promise<CleanupResult>;
}

export interface DataErasureService {
  createErasureRequest(userId: string): Promise<DataRequest>;
  processErasureRequest(requestId: string): Promise<ErasureResult>;
  getErasureStatus(requestId: string): Promise<ErasureStatus>;
  validateErasureRequest(requestId: string): Promise<ValidationResult>;
  getErasureReport(requestId: string): Promise<ErasureReport>;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: ConsentType;
  purpose: string;
  legalBasis: LegalBasis;
  isGranted: boolean;
  grantedAt?: Date;
  withdrawnAt?: Date;
  expiresAt?: Date;
  version: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataRetentionPolicy {
  id: string;
  recordType: string;
  retentionPeriod: number; // Days
  autoDelete: boolean;
  legalBasis?: string;
  description?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataRequest {
  id: string;
  userId: string;
  requestType: DataRequestType;
  status: DataRequestStatus;
  requestedAt: Date;
  processedAt?: Date;
  expiresAt: Date;
  fileUrl?: string;
  metadata?: Record<string, any>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsentSummary {
  userId: string;
  totalConsents: number;
  activeConsents: number;
  withdrawnConsents: number;
  expiredConsents: number;
  consentTypes: Record<ConsentType, {
    granted: number;
    withdrawn: number;
    expired: number;
  }>;
  lastUpdated: Date;
}

export interface ExpiredRecord {
  id: string;
  recordType: string;
  createdAt: Date;
  retentionPeriod: number;
  shouldDelete: boolean;
  legalBasis?: string;
  metadata?: Record<string, any>;
}

export interface DeletionResult {
  deletedRecords: number;
  failedDeletions: number;
  errors: Array<{
    recordId: string;
    error: string;
  }>;
  deletionTime: Date;
  deletedBy: string;
}

export interface DataLifecycleReport {
  totalRecords: number;
  recordsByType: Record<string, {
    count: number;
    oldestRecord: Date;
    newestRecord: Date;
    retentionPolicy?: DataRetentionPolicy;
  }>;
  expiredRecords: number;
  scheduledForDeletion: number;
  lastCleanup: Date;
  nextCleanup: Date;
}

export interface ExportResult {
  requestId: string;
  status: 'SUCCESS' | 'FAILED';
  fileUrl?: string;
  fileSize?: number;
  recordCount: number;
  exportedAt: Date;
  expiresAt: Date;
  error?: string;
}

export interface ExportStatus {
  requestId: string;
  status: DataRequestStatus;
  progress: number; // 0-100
  estimatedCompletion?: Date;
  recordCount?: number;
  fileSize?: number;
  error?: string;
}

export interface ExportDownload {
  requestId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  expiresAt: Date;
  downloadToken: string;
}

export interface ErasureResult {
  requestId: string;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  erasedRecords: number;
  failedErasures: number;
  errors: Array<{
    recordType: string;
    recordId: string;
    error: string;
  }>;
  erasedAt: Date;
  verificationHash: string;
}

export interface ErasureStatus {
  requestId: string;
  status: DataRequestStatus;
  progress: number; // 0-100
  estimatedCompletion?: Date;
  erasedRecords?: number;
  totalRecords?: number;
  error?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
  estimatedRecords: number;
  estimatedTime: number; // minutes
}

export interface ErasureReport {
  requestId: string;
  userId: string;
  erasedRecords: Array<{
    recordType: string;
    recordId: string;
    erasedAt: Date;
    method: 'DELETE' | 'ANONYMIZE' | 'PSEUDONYMIZE';
  }>;
  verificationHash: string;
  completedAt: Date;
  verifiedBy: string;
  verifiedAt: Date;
}

export interface CleanupResult {
  expiredExports: number;
  expiredErasures: number;
  totalCleaned: number;
  cleanupTime: Date;
  nextCleanup: Date;
}

export interface GDPRComplianceReport {
  totalUsers: number;
  consentCompliance: {
    totalConsents: number;
    activeConsents: number;
    withdrawnConsents: number;
    expiredConsents: number;
    complianceRate: number;
  };
  dataRetention: {
    totalPolicies: number;
    activePolicies: number;
    expiredRecords: number;
    scheduledDeletions: number;
    complianceRate: number;
  };
  dataRequests: {
    totalRequests: number;
    exportRequests: number;
    erasureRequests: number;
    completedRequests: number;
    pendingRequests: number;
    averageProcessingTime: number; // hours
  };
  privacyIncidents: {
    totalIncidents: number;
    resolvedIncidents: number;
    averageResolutionTime: number; // hours
    severityDistribution: Record<string, number>;
  };
  lastAudit: Date;
  nextAudit: Date;
  complianceScore: number; // 0-100
}

export interface PrivacyImpactAssessment {
  id: string;
  title: string;
  description: string;
  dataTypes: string[];
  processingPurposes: string[];
  legalBasis: LegalBasis[];
  dataSubjects: string[];
  dataRetention: number; // days
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  mitigationMeasures: string[];
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataProcessingRecord {
  id: string;
  purpose: string;
  legalBasis: LegalBasis;
  dataTypes: string[];
  dataSubjects: string[];
  recipients: string[];
  thirdCountryTransfers: string[];
  retentionPeriod: number; // days
  securityMeasures: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
