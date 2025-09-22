import { RateLimitType } from '@prisma/client';

export interface RateLimitingService {
  checkRateLimit(identifier: string, type: RateLimitType, route?: string): Promise<RateLimitResult>;
  getRateLimitStats(): Promise<RateLimitStats>;
  unblockIdentifier(identifier: string, type: RateLimitType, route?: string): Promise<void>;
  cleanupOldRecords(): Promise<number>;
  getRateLimitConfig(): RateLimitRule[];
  updateRateLimitConfig(rules: RateLimitRule[]): void;
  isBlocked(identifier: string, type: RateLimitType, route?: string): Promise<boolean>;
  getRemainingRequests(identifier: string, type: RateLimitType, route?: string): Promise<number>;
}

export interface RateLimitRule {
  identifier: string;
  type: RateLimitType;
  requestsPerWindow: number;
  windowMs: number;
  blockDurationMs: number;
  route?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: any) => string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter: number;
  reason?: string;
}

export interface RateLimitViolation {
  identifier: string;
  type: RateLimitType;
  route?: string;
  requestCount: number;
  limit: number;
  windowMs: number;
  blockedUntil?: Date;
  violatedAt: Date;
  userAgent?: string;
  ipAddress?: string;
}

export interface RateLimitStats {
  totalRequests: number;
  blockedRequests: number;
  activeBlocks: number;
  topViolators: Array<{
    identifier: string;
    type: RateLimitType;
    route?: string;
    requestCount: number;
    blockedAt: Date;
  }>;
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface RateLimitConfig {
  rules: RateLimitRule[];
  skipSuccessfulRequests: boolean;
  skipFailedRequests: boolean;
  keyGenerator: (req: any) => string;
  onLimitReached: (req: any, res: any, next: any) => void;
  standardHeaders: boolean;
  legacyHeaders: boolean;
}

export interface RateLimitMiddleware {
  use(req: any, res: any, next: any): void;
}

export interface RateLimitStore {
  increment(key: string, windowMs: number): Promise<{ totalHits: number; resetTime: Date }>;
  decrement(key: string): Promise<void>;
  resetKey(key: string): Promise<void>;
  shutdown(): Promise<void>;
}

export interface RateLimitAlgorithm {
  name: string;
  getNextResetTime(windowMs: number): Date;
  calculateRemaining(limit: number, totalHits: number): number;
  calculateRetryAfter(resetTime: Date): number;
}

export interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
  'Retry-After'?: string;
}

export interface RateLimitError extends Error {
  status: number;
  statusCode: number;
  retryAfter?: number;
  resetTime?: Date;
  limit?: number;
  remaining?: number;
}

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: any) => string;
  skip?: (req: any, res: any) => boolean;
  onLimitReached?: (req: any, res: any, next: any) => void;
  handler?: (req: any, res: any, next: any) => void;
  store?: RateLimitStore;
}

export interface RateLimitInfo {
  limit: number;
  current: number;
  remaining: number;
  resetTime: Date;
  retryAfter: number;
}

export interface RateLimitResponse {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter: number;
  message?: string;
}

export interface RateLimitViolationReport {
  identifier: string;
  type: RateLimitType;
  route?: string;
  violations: RateLimitViolation[];
  totalViolations: number;
  firstViolation: Date;
  lastViolation: Date;
  isCurrentlyBlocked: boolean;
  blockedUntil?: Date;
  recommendations: string[];
}

export interface RateLimitAnalytics {
  totalRequests: number;
  blockedRequests: number;
  successRate: number;
  averageResponseTime: number;
  peakRequestsPerMinute: number;
  topBlockedIdentifiers: Array<{
    identifier: string;
    type: RateLimitType;
    blockCount: number;
    lastBlocked: Date;
  }>;
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface RateLimitCleanupResult {
  oldRecordsDeleted: number;
  expiredBlocksRemoved: number;
  totalCleaned: number;
  cleanupTime: Date;
  nextCleanupScheduled: Date;
}
