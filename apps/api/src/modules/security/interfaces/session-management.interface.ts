import { DeviceType } from '@prisma/client';

export interface SessionManagementService {
  createUserSession(createDto: any, userId: string): Promise<any>;
  getUserSessions(userId: string): Promise<any[]>;
  getSessionByToken(sessionToken: string): Promise<any | null>;
  updateSessionActivity(sessionId: string): Promise<any>;
  revokeSession(sessionId: string, revokedBy?: string): Promise<void>;
  revokeAllUserSessions(userId: string, revokedBy?: string): Promise<void>;
  cleanupExpiredSessions(): Promise<number>;
}

export interface DeviceManagementService {
  getOrCreateDevice(userId: string, deviceFingerprint: string, deviceInfo: Partial<DeviceInfo>): Promise<any>;
  getUserDevices(userId: string): Promise<any[]>;
  updateDevice(deviceId: string, updateDto: any): Promise<any>;
  trustDevice(deviceId: string, trustedBy: string): Promise<any>;
  untrustDevice(deviceId: string, untrustedBy: string): Promise<any>;
  removeDevice(deviceId: string, removedBy: string): Promise<void>;
  generateDeviceFingerprint(deviceInfo: DeviceInfo): string;
  detectDeviceType(userAgent: string): DeviceType;
  parseUserAgent(userAgent: string): Partial<DeviceInfo>;
}

export interface DeviceFingerprint {
  userAgent: string;
  screenResolution?: string;
  timezone?: string;
  language?: string;
  platform?: string;
  cookieEnabled?: boolean;
  doNotTrack?: string;
  canvas?: string;
  webgl?: string;
  audio?: string;
  fonts?: string[];
  plugins?: string[];
  hardware?: {
    cores?: number;
    memory?: number;
    storage?: number;
  };
}

export interface DeviceInfo {
  userAgent: string;
  deviceName?: string;
  deviceType: DeviceType;
  osName?: string;
  osVersion?: string;
  browserName?: string;
  browserVersion?: string;
  screenResolution?: string;
  timezone?: string;
  language?: string;
  platform?: string;
  cookieEnabled?: boolean;
  doNotTrack?: string;
}

export interface SessionInfo {
  id: string;
  userId: string;
  sessionToken: string;
  deviceId?: string;
  ipAddress: string;
  userAgent: string;
  fingerprint?: string;
  isActive: boolean;
  lastActivityAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeviceSession {
  device: DeviceInfo;
  sessions: SessionInfo[];
  isTrusted: boolean;
  lastSeenAt: Date;
  createdAt: Date;
}

export interface SessionSecurityEvent {
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'SESSION_EXPIRED' | 'SESSION_REVOKED' | 'SUSPICIOUS_ACTIVITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  userId?: string;
  sessionId?: string;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
  description: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface SessionAnalytics {
  totalSessions: number;
  activeSessions: number;
  expiredSessions: number;
  revokedSessions: number;
  uniqueDevices: number;
  trustedDevices: number;
  suspiciousActivity: number;
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface DeviceAnalytics {
  totalDevices: number;
  trustedDevices: number;
  untrustedDevices: number;
  deviceTypes: Record<DeviceType, number>;
  osDistribution: Record<string, number>;
  browserDistribution: Record<string, number>;
  timeRange: {
    start: Date;
    end: Date;
  };
}

export interface SessionCleanupResult {
  expiredSessions: number;
  revokedSessions: number;
  orphanedSessions: number;
  totalCleaned: number;
  cleanupTime: Date;
}

export interface DeviceTrustScore {
  deviceId: string;
  score: number; // 0-100
  factors: {
    isTrusted: boolean;
    sessionCount: number;
    lastSeenDays: number;
    osKnown: boolean;
    browserKnown: boolean;
    locationConsistent: boolean;
    timePatternConsistent: boolean;
  };
  recommendations: string[];
}

export interface SuspiciousActivityDetection {
  userId: string;
  deviceId?: string;
  activityType: 'UNUSUAL_LOCATION' | 'UNUSUAL_TIME' | 'MULTIPLE_DEVICES' | 'RAPID_SESSIONS' | 'UNKNOWN_DEVICE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  metadata: Record<string, any>;
  detectedAt: Date;
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}
