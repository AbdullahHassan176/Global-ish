export interface PIIEncryptionKey {
  id: string;
  keyId: string;
  keyVersion: string;
  algorithm: string;
  isActive: boolean;
  expiresAt?: Date;
  rotatedAt?: Date;
  metadata?: Record<string, any>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PIIFieldMapping {
  [recordType: string]: string[];
}

export interface EncryptionResult {
  encryptedData: string;
  keyId: string;
  algorithm: string;
  timestamp: Date;
}

export interface DecryptionResult {
  data: string;
  fieldName: string;
  userId?: string;
  timestamp: Date;
  version: string;
}

export interface KMSKeyInfo {
  kmsKeyId: string;
  keyMaterial: any;
  createdAt: Date;
  region: string;
  keyType: string;
  keySize: number;
}

export interface PIIEncryptionService {
  encryptPII(data: string, fieldName: string, userId?: string): Promise<EncryptionResult>;
  decryptPII(encryptedData: string, fieldName: string, userId?: string): Promise<DecryptionResult>;
  encryptRecord(record: Record<string, any>, userId?: string): Promise<Record<string, any>>;
  decryptRecord(record: Record<string, any>, userId?: string): Promise<Record<string, any>>;
  createEncryptionKey(createdBy: string): Promise<PIIEncryptionKey>;
  rotateEncryptionKey(currentKeyId: string, createdBy: string): Promise<PIIEncryptionKey>;
}

export interface FieldLevelEncryption {
  fieldName: string;
  isEncrypted: boolean;
  keyId?: string;
  algorithm?: string;
  encryptedAt?: Date;
}

export interface EncryptionMetadata {
  keyId: string;
  algorithm: string;
  timestamp: Date;
  version: string;
  fieldName: string;
  userId?: string;
}

export interface PIIAuditLog {
  id: string;
  operation: 'ENCRYPT' | 'DECRYPT' | 'KEY_ROTATION' | 'KEY_CREATION';
  fieldName: string;
  userId?: string;
  keyId: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface EncryptionKeyRotation {
  oldKeyId: string;
  newKeyId: string;
  rotatedAt: Date;
  rotatedBy: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  reEncryptionProgress?: number;
  totalRecords?: number;
  processedRecords?: number;
}

export interface PIIComplianceReport {
  totalEncryptedFields: number;
  totalDecryptionOperations: number;
  keyRotationHistory: EncryptionKeyRotation[];
  auditLogs: PIIAuditLog[];
  complianceScore: number;
  lastAuditDate: Date;
  nextAuditDate: Date;
}
