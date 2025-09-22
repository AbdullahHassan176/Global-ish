import { Session, User } from '@global-next/types';
import { JWTService } from './jwt.service';

export interface SessionCreateData {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SessionValidationResult {
  isValid: boolean;
  session?: Session;
  user?: User;
  error?: string;
}

export class SessionService {
  constructor(
    private jwtService: JWTService,
    private redisClient?: any // Redis client instance
  ) {}

  async createSession(data: SessionCreateData): Promise<Session> {
    const sessionId = this.generateSessionId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session: Session = {
      id: sessionId,
      userId: data.userId,
      token: '', // Will be set after JWT generation
      expiresAt,
      createdAt: new Date(),
      lastAccessedAt: new Date(),
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      isActive: true
    };

    // Store session in Redis if available
    if (this.redisClient) {
      await this.redisClient.setex(
        `session:${sessionId}`,
        Math.floor((expiresAt.getTime() - Date.now()) / 1000),
        JSON.stringify(session)
      );
    }

    return session;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    if (this.redisClient) {
      const sessionData = await this.redisClient.get(`session:${sessionId}`);
      if (sessionData) {
        return JSON.parse(sessionData);
      }
    }

    return null;
  }

  async updateSession(sessionId: string, updates: Partial<Session>): Promise<Session | null> {
    const session = await this.getSession(sessionId);
    if (!session) {
      return null;
    }

    const updatedSession = { ...session, ...updates, lastAccessedAt: new Date() };

    if (this.redisClient) {
      const ttl = await this.redisClient.ttl(`session:${sessionId}`);
      await this.redisClient.setex(
        `session:${sessionId}`,
        ttl > 0 ? ttl : 7 * 24 * 60 * 60, // 7 days default
        JSON.stringify(updatedSession)
      );
    }

    return updatedSession;
  }

  async invalidateSession(sessionId: string): Promise<boolean> {
    if (this.redisClient) {
      const result = await this.redisClient.del(`session:${sessionId}`);
      return result > 0;
    }

    return false;
  }

  async invalidateUserSessions(userId: string): Promise<number> {
    if (!this.redisClient) {
      return 0;
    }

    // Get all session keys for the user
    const sessionKeys = await this.redisClient.keys(`session:*`);
    let invalidatedCount = 0;

    for (const key of sessionKeys) {
      const sessionData = await this.redisClient.get(key);
      if (sessionData) {
        const session: Session = JSON.parse(sessionData);
        if (session.userId === userId) {
          await this.redisClient.del(key);
          invalidatedCount++;
        }
      }
    }

    return invalidatedCount;
  }

  async validateSession(token: string): Promise<SessionValidationResult> {
    try {
      const payload = this.jwtService.verifyToken(token);
      const session = await this.getSession(payload.sessionId);

      if (!session) {
        return {
          isValid: false,
          error: 'Session not found'
        };
      }

      if (!session.isActive) {
        return {
          isValid: false,
          error: 'Session is inactive'
        };
      }

      if (session.expiresAt < new Date()) {
        return {
          isValid: false,
          error: 'Session expired'
        };
      }

      // Update last accessed time
      await this.updateSession(session.id, { lastAccessedAt: new Date() });

      return {
        isValid: true,
        session
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid token'
      };
    }
  }

  async refreshSession(sessionId: string, user: User): Promise<{ session: Session; token: string; refreshToken: string } | null> {
    const session = await this.getSession(sessionId);
    if (!session || !session.isActive) {
      return null;
    }

    // Generate new tokens
    const token = this.jwtService.generateToken(user, sessionId);
    const refreshToken = this.jwtService.generateRefreshToken(user, sessionId);

    // Update session with new token
    const updatedSession = await this.updateSession(sessionId, { token });

    return {
      session: updatedSession!,
      token,
      refreshToken
    };
  }

  async cleanupExpiredSessions(): Promise<number> {
    if (!this.redisClient) {
      return 0;
    }

    const sessionKeys = await this.redisClient.keys(`session:*`);
    let cleanedCount = 0;

    for (const key of sessionKeys) {
      const sessionData = await this.redisClient.get(key);
      if (sessionData) {
        const session: Session = JSON.parse(sessionData);
        if (session.expiresAt < new Date()) {
          await this.redisClient.del(key);
          cleanedCount++;
        }
      }
    }

    return cleanedCount;
  }

  private generateSessionId(): string {
    return Buffer.from(crypto.randomUUID()).toString('base64url');
  }
}
