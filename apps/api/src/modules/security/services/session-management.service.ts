import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { 
  CreateUserSessionDto, 
  UpdateUserSessionDto,
  CreateUserDeviceDto,
  UpdateUserDeviceDto
} from '../dto/security.dto';
import { 
  UserSession, 
  UserDevice,
  DeviceType
} from '@prisma/client';
import { 
  SessionManagementService,
  DeviceManagementService,
  DeviceFingerprint,
  SessionInfo,
  DeviceInfo
} from '../interfaces/session-management.interface';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class SessionManagementService implements SessionManagementService, DeviceManagementService {
  private readonly logger = new Logger(SessionManagementService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ===== SESSION MANAGEMENT =====

  /**
   * Create a new user session
   */
  async createUserSession(
    createDto: CreateUserSessionDto,
    userId: string
  ): Promise<UserSession> {
    this.logger.log(`Creating session for user ${userId}`);

    // Generate session token
    const sessionToken = this.generateSessionToken();
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours default

    // Get or create device
    let deviceId: string | undefined;
    if (createDto.deviceFingerprint) {
      const device = await this.getOrCreateDevice(userId, createDto.deviceFingerprint, {
        deviceName: createDto.deviceName,
        deviceType: createDto.deviceType,
        osName: createDto.osName,
        osVersion: createDto.osVersion,
        browserName: createDto.browserName,
        browserVersion: createDto.browserVersion,
      });
      deviceId = device.id;
    }

    const session = await this.prisma.userSession.create({
      data: {
        userId,
        sessionToken,
        deviceId,
        ipAddress: createDto.ipAddress,
        userAgent: createDto.userAgent,
        fingerprint: createDto.fingerprint,
        expiresAt,
      },
    });

    // Log session creation
    await this.logSecurityEvent(
      'LOGIN_SUCCESS',
      'LOW',
      userId,
      'User session created',
      { sessionId: session.id, ipAddress: createDto.ipAddress }
    );

    return session;
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(userId: string): Promise<UserSession[]> {
    return this.prisma.userSession.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      include: {
        device: true,
      },
      orderBy: { lastActivityAt: 'desc' },
    });
  }

  /**
   * Get session by token
   */
  async getSessionByToken(sessionToken: string): Promise<UserSession | null> {
    return this.prisma.userSession.findUnique({
      where: { sessionToken },
      include: {
        device: true,
        user: true,
      },
    });
  }

  /**
   * Update session activity
   */
  async updateSessionActivity(sessionId: string): Promise<UserSession> {
    const session = await this.prisma.userSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (!session.isActive || session.expiresAt < new Date()) {
      throw new BadRequestException('Session is not active or has expired');
    }

    const updatedSession = await this.prisma.userSession.update({
      where: { id: sessionId },
      data: { lastActivityAt: new Date() },
    });

    return updatedSession;
  }

  /**
   * Revoke a session
   */
  async revokeSession(sessionId: string, revokedBy?: string): Promise<void> {
    const session = await this.prisma.userSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    await this.prisma.userSession.update({
      where: { id: sessionId },
      data: { isActive: false },
    });

    // Log session revocation
    await this.logSecurityEvent(
      'SESSION_REVOKED',
      'MEDIUM',
      session.userId,
      'User session revoked',
      { sessionId, revokedBy }
    );
  }

  /**
   * Revoke all sessions for a user
   */
  async revokeAllUserSessions(userId: string, revokedBy?: string): Promise<void> {
    await this.prisma.userSession.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });

    // Log session revocation
    await this.logSecurityEvent(
      'SESSION_REVOKED',
      'MEDIUM',
      userId,
      'All user sessions revoked',
      { userId, revokedBy }
    );
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.prisma.userSession.updateMany({
      where: {
        expiresAt: { lt: new Date() },
        isActive: true,
      },
      data: { isActive: false },
    });

    this.logger.log(`Cleaned up ${result.count} expired sessions`);
    return result.count;
  }

  // ===== DEVICE MANAGEMENT =====

  /**
   * Get or create a device
   */
  async getOrCreateDevice(
    userId: string,
    deviceFingerprint: string,
    deviceInfo: Partial<DeviceInfo>
  ): Promise<UserDevice> {
    let device = await this.prisma.userDevice.findUnique({
      where: { deviceFingerprint },
    });

    if (!device) {
      device = await this.prisma.userDevice.create({
        data: {
          userId,
          deviceFingerprint,
          deviceName: deviceInfo.deviceName,
          deviceType: deviceInfo.deviceType || DeviceType.UNKNOWN,
          osName: deviceInfo.osName,
          osVersion: deviceInfo.osVersion,
          browserName: deviceInfo.browserName,
          browserVersion: deviceInfo.browserVersion,
        },
      });

      this.logger.log(`Created new device for user ${userId}: ${deviceFingerprint}`);
    } else {
      // Update last seen
      await this.prisma.userDevice.update({
        where: { id: device.id },
        data: { lastSeenAt: new Date() },
      });
    }

    return device;
  }

  /**
   * Get all devices for a user
   */
  async getUserDevices(userId: string): Promise<UserDevice[]> {
    return this.prisma.userDevice.findMany({
      where: { userId },
      include: {
        sessions: {
          where: { isActive: true },
          orderBy: { lastActivityAt: 'desc' },
        },
      },
      orderBy: { lastSeenAt: 'desc' },
    });
  }

  /**
   * Update device information
   */
  async updateDevice(
    deviceId: string,
    updateDto: UpdateUserDeviceDto
  ): Promise<UserDevice> {
    const existingDevice = await this.prisma.userDevice.findUnique({
      where: { id: deviceId },
    });

    if (!existingDevice) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }

    const updatedDevice = await this.prisma.userDevice.update({
      where: { id: deviceId },
      data: {
        deviceName: updateDto.deviceName,
        deviceType: updateDto.deviceType,
        osName: updateDto.osName,
        osVersion: updateDto.osVersion,
        browserName: updateDto.browserName,
        browserVersion: updateDto.browserVersion,
        isTrusted: updateDto.isTrusted,
        lastSeenAt: new Date(),
      },
    });

    return updatedDevice;
  }

  /**
   * Trust a device
   */
  async trustDevice(deviceId: string, trustedBy: string): Promise<UserDevice> {
    const device = await this.prisma.userDevice.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }

    const updatedDevice = await this.prisma.userDevice.update({
      where: { id: deviceId },
      data: { isTrusted: true },
    });

    // Log device trust
    await this.logSecurityEvent(
      'DEVICE_TRUSTED',
      'LOW',
      device.userId,
      'Device marked as trusted',
      { deviceId, trustedBy }
    );

    return updatedDevice;
  }

  /**
   * Untrust a device
   */
  async untrustDevice(deviceId: string, untrustedBy: string): Promise<UserDevice> {
    const device = await this.prisma.userDevice.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }

    const updatedDevice = await this.prisma.userDevice.update({
      where: { id: deviceId },
      data: { isTrusted: false },
    });

    // Log device untrust
    await this.logSecurityEvent(
      'DEVICE_UNTRUSTED',
      'MEDIUM',
      device.userId,
      'Device marked as untrusted',
      { deviceId, untrustedBy }
    );

    return updatedDevice;
  }

  /**
   * Remove a device and all its sessions
   */
  async removeDevice(deviceId: string, removedBy: string): Promise<void> {
    const device = await this.prisma.userDevice.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }

    // Revoke all sessions for this device
    await this.prisma.userSession.updateMany({
      where: { deviceId, isActive: true },
      data: { isActive: false },
    });

    // Delete the device
    await this.prisma.userDevice.delete({
      where: { id: deviceId },
    });

    // Log device removal
    await this.logSecurityEvent(
      'DEVICE_REMOVED',
      'MEDIUM',
      device.userId,
      'Device removed',
      { deviceId, removedBy }
    );
  }

  // ===== DEVICE FINGERPRINTING =====

  /**
   * Generate device fingerprint
   */
  generateDeviceFingerprint(deviceInfo: DeviceInfo): string {
    const fingerprintData = {
      userAgent: deviceInfo.userAgent,
      screenResolution: deviceInfo.screenResolution,
      timezone: deviceInfo.timezone,
      language: deviceInfo.language,
      platform: deviceInfo.platform,
      cookieEnabled: deviceInfo.cookieEnabled,
      doNotTrack: deviceInfo.doNotTrack,
    };

    const fingerprintString = JSON.stringify(fingerprintData);
    return createHash('sha256').update(fingerprintString).digest('hex');
  }

  /**
   * Detect device type from user agent
   */
  detectDeviceType(userAgent: string): DeviceType {
    const ua = userAgent.toLowerCase();
    
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return DeviceType.MOBILE;
    }
    
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return DeviceType.TABLET;
    }
    
    if (ua.includes('desktop') || ua.includes('windows') || ua.includes('macintosh') || ua.includes('linux')) {
      return DeviceType.DESKTOP;
    }
    
    return DeviceType.UNKNOWN;
  }

  /**
   * Parse user agent for device information
   */
  parseUserAgent(userAgent: string): Partial<DeviceInfo> {
    const ua = userAgent.toLowerCase();
    
    const deviceInfo: Partial<DeviceInfo> = {
      userAgent,
      deviceType: this.detectDeviceType(userAgent),
    };

    // Parse OS
    if (ua.includes('windows')) {
      deviceInfo.osName = 'Windows';
      const versionMatch = ua.match(/windows nt (\d+\.\d+)/);
      if (versionMatch) {
        deviceInfo.osVersion = versionMatch[1];
      }
    } else if (ua.includes('macintosh')) {
      deviceInfo.osName = 'macOS';
      const versionMatch = ua.match(/mac os x (\d+[._]\d+)/);
      if (versionMatch) {
        deviceInfo.osVersion = versionMatch[1].replace('_', '.');
      }
    } else if (ua.includes('linux')) {
      deviceInfo.osName = 'Linux';
    } else if (ua.includes('android')) {
      deviceInfo.osName = 'Android';
      const versionMatch = ua.match(/android (\d+\.\d+)/);
      if (versionMatch) {
        deviceInfo.osVersion = versionMatch[1];
      }
    } else if (ua.includes('iphone') || ua.includes('ipad')) {
      deviceInfo.osName = 'iOS';
      const versionMatch = ua.match(/os (\d+[._]\d+)/);
      if (versionMatch) {
        deviceInfo.osVersion = versionMatch[1].replace('_', '.');
      }
    }

    // Parse browser
    if (ua.includes('chrome')) {
      deviceInfo.browserName = 'Chrome';
      const versionMatch = ua.match(/chrome\/(\d+\.\d+)/);
      if (versionMatch) {
        deviceInfo.browserVersion = versionMatch[1];
      }
    } else if (ua.includes('firefox')) {
      deviceInfo.browserName = 'Firefox';
      const versionMatch = ua.match(/firefox\/(\d+\.\d+)/);
      if (versionMatch) {
        deviceInfo.browserVersion = versionMatch[1];
      }
    } else if (ua.includes('safari')) {
      deviceInfo.browserName = 'Safari';
      const versionMatch = ua.match(/version\/(\d+\.\d+)/);
      if (versionMatch) {
        deviceInfo.browserVersion = versionMatch[1];
      }
    } else if (ua.includes('edge')) {
      deviceInfo.browserName = 'Edge';
      const versionMatch = ua.match(/edge\/(\d+\.\d+)/);
      if (versionMatch) {
        deviceInfo.browserVersion = versionMatch[1];
      }
    }

    return deviceInfo;
  }

  // ===== PRIVATE HELPER METHODS =====

  /**
   * Generate a secure session token
   */
  private generateSessionToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Log security event
   */
  private async logSecurityEvent(
    eventType: string,
    severity: string,
    userId?: string,
    description?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await this.prisma.securityEvent.create({
        data: {
          eventType: eventType as any,
          severity: severity as any,
          userId,
          description: description || `Security event: ${eventType}`,
          metadata,
        },
      });
    } catch (error) {
      this.logger.error('Failed to log security event:', error);
    }
  }
}
