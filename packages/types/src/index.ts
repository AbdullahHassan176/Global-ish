// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  attributes: UserAttributes;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  mfaEnabled: boolean;
  webauthnEnabled: boolean;
}

export interface UserAttributes {
  department?: string;
  location?: string;
  clearanceLevel?: number;
  customAttributes?: Record<string, any>;
}

export enum UserRole {
  ADMIN = 'admin',
  OPS_MANAGER = 'ops_manager',
  FINANCE_MANAGER = 'finance_manager',
  CONSULTANT = 'consultant',
  PARTNER = 'partner',
  VIEWER = 'viewer'
}

// RBAC/ABAC Types
export interface Policy {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  subject: string | UserRole;
  conditions?: PolicyCondition[];
  effect: PolicyEffect;
  createdAt: Date;
  updatedAt: Date;
}

export interface PolicyCondition {
  attribute: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: any;
}

export enum PolicyEffect {
  ALLOW = 'allow',
  DENY = 'deny'
}

export interface Permission {
  resource: string;
  action: string;
  conditions?: PolicyCondition[];
}

// Audit Types
export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  beforeHash?: string;
  afterHash?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// Session Types
export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  lastAccessedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

// MFA Types
export interface MFASecret {
  id: string;
  userId: string;
  secret: string;
  backupCodes: string[];
  createdAt: Date;
  verifiedAt?: Date;
}

export interface WebAuthnCredential {
  id: string;
  userId: string;
  credentialId: string;
  publicKey: string;
  counter: number;
  name: string;
  createdAt: Date;
  lastUsedAt?: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Database Types
export interface DatabaseConfig {
  url: string;
  ssl?: boolean;
  maxConnections?: number;
  connectionTimeout?: number;
}

export interface RedisConfig {
  url: string;
  password?: string;
  db?: number;
  keyPrefix?: string;
}

// Environment Types
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  ENCRYPTION_KEY: string;
  AZURE_AD_CLIENT_ID?: string;
  AZURE_AD_CLIENT_SECRET?: string;
  AZURE_AD_TENANT_ID?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
  CORS_ORIGINS: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}

// Error Types
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
