import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { 
  RateLimitConfig,
  RateLimitResult,
  RateLimitType,
  RateLimitRecord
} from '@prisma/client';
import { 
  RateLimitingService,
  RateLimitRule,
  RateLimitViolation,
  RateLimitStats
} from '../interfaces/rate-limiting.interface';

@Injectable()
export class RateLimitingService implements RateLimitingService {
  private readonly logger = new Logger(RateLimitingService.name);
  private readonly defaultRules: RateLimitRule[] = [
    {
      identifier: 'global',
      type: RateLimitType.GLOBAL,
      requestsPerWindow: 10000,
      windowMs: 60000, // 1 minute
      blockDurationMs: 300000, // 5 minutes
    },
    {
      identifier: 'user',
      type: RateLimitType.USER_ID,
      requestsPerWindow: 1000,
      windowMs: 60000, // 1 minute
      blockDurationMs: 300000, // 5 minutes
    },
    {
      identifier: 'ip',
      type: RateLimitType.IP_ADDRESS,
      requestsPerWindow: 500,
      windowMs: 60000, // 1 minute
      blockDurationMs: 300000, // 5 minutes
    },
    {
      identifier: 'login',
      type: RateLimitType.ROUTE,
      requestsPerWindow: 5,
      windowMs: 900000, // 15 minutes
      blockDurationMs: 1800000, // 30 minutes
      route: '/auth/login',
    },
    {
      identifier: 'password-reset',
      type: RateLimitType.ROUTE,
      requestsPerWindow: 3,
      windowMs: 3600000, // 1 hour
      blockDurationMs: 3600000, // 1 hour
      route: '/auth/password-reset',
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Check if request is within rate limits
   */
  async checkRateLimit(
    identifier: string,
    type: RateLimitType,
    route?: string
  ): Promise<RateLimitResult> {
    try {
      // Get applicable rate limit rules
      const rules = this.getApplicableRules(type, route);
      
      for (const rule of rules) {
        const result = await this.checkRule(identifier, rule);
        if (!result.allowed) {
          return result;
        }
      }

      // All rules passed, record the request
      await this.recordRequest(identifier, type, route);
      
      return {
        allowed: true,
        remaining: 0, // Will be calculated per rule
        resetTime: 0,
        retryAfter: 0,
      };
    } catch (error) {
      this.logger.error('Rate limit check failed:', error);
      // Fail open - allow request if rate limiting fails
      return {
        allowed: true,
        remaining: 0,
        resetTime: 0,
        retryAfter: 0,
      };
    }
  }

  /**
   * Check a specific rate limit rule
   */
  private async checkRule(identifier: string, rule: RateLimitRule): Promise<RateLimitResult> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - rule.windowMs);
    const windowEnd = new Date(now.getTime() + rule.windowMs);

    // Get current rate limit record
    const record = await this.prisma.rateLimitRecord.findUnique({
      where: {
        identifier_identifierType_route_windowStart: {
          identifier,
          identifierType: rule.type,
          route: rule.route || null,
          windowStart,
        },
      },
    });

    if (record) {
      // Check if currently blocked
      if (record.isBlocked && record.blockedUntil && record.blockedUntil > now) {
        const retryAfter = Math.ceil((record.blockedUntil.getTime() - now.getTime()) / 1000);
        
        // Log rate limit violation
        await this.logRateLimitViolation(identifier, rule, 'BLOCKED');
        
        return {
          allowed: false,
          remaining: 0,
          resetTime: record.windowEnd.getTime(),
          retryAfter,
          reason: 'Rate limit exceeded - currently blocked',
        };
      }

      // Check if limit exceeded
      if (record.requestCount >= rule.requestsPerWindow) {
        // Block the identifier
        const blockedUntil = new Date(now.getTime() + rule.blockDurationMs);
        
        await this.prisma.rateLimitRecord.update({
          where: { id: record.id },
          data: {
            isBlocked: true,
            blockedUntil,
          },
        });

        // Log rate limit violation
        await this.logRateLimitViolation(identifier, rule, 'EXCEEDED');

        return {
          allowed: false,
          remaining: 0,
          resetTime: record.windowEnd.getTime(),
          retryAfter: Math.ceil(rule.blockDurationMs / 1000),
          reason: 'Rate limit exceeded',
        };
      }

      // Within limits
      const remaining = rule.requestsPerWindow - record.requestCount;
      return {
        allowed: true,
        remaining,
        resetTime: record.windowEnd.getTime(),
        retryAfter: 0,
      };
    }

    // No record exists, request is allowed
    return {
      allowed: true,
      remaining: rule.requestsPerWindow - 1,
      resetTime: windowEnd.getTime(),
      retryAfter: 0,
    };
  }

  /**
   * Record a request
   */
  private async recordRequest(
    identifier: string,
    type: RateLimitType,
    route?: string
  ): Promise<void> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - 60000); // 1 minute window
    const windowEnd = new Date(now.getTime() + 60000);

    await this.prisma.rateLimitRecord.upsert({
      where: {
        identifier_identifierType_route_windowStart: {
          identifier,
          identifierType: type,
          route: route || null,
          windowStart,
        },
      },
      update: {
        requestCount: {
          increment: 1,
        },
        updatedAt: now,
      },
      create: {
        identifier,
        identifierType: type,
        route: route || null,
        requestCount: 1,
        windowStart,
        windowEnd,
        isBlocked: false,
      },
    });
  }

  /**
   * Get applicable rate limit rules
   */
  private getApplicableRules(type: RateLimitType, route?: string): RateLimitRule[] {
    return this.defaultRules.filter(rule => {
      if (rule.type !== type) return false;
      if (rule.route && route && rule.route !== route) return false;
      return true;
    });
  }

  /**
   * Get rate limit statistics
   */
  async getRateLimitStats(): Promise<RateLimitStats> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000);

    const [
      totalRequests,
      blockedRequests,
      activeBlocks,
      topViolators,
    ] = await Promise.all([
      this.prisma.rateLimitRecord.aggregate({
        where: {
          createdAt: { gte: oneHourAgo },
        },
        _sum: { requestCount: true },
      }),
      this.prisma.rateLimitRecord.count({
        where: {
          isBlocked: true,
          createdAt: { gte: oneHourAgo },
        },
      }),
      this.prisma.rateLimitRecord.count({
        where: {
          isBlocked: true,
          blockedUntil: { gt: now },
        },
      }),
      this.prisma.rateLimitRecord.findMany({
        where: {
          isBlocked: true,
          createdAt: { gte: oneHourAgo },
        },
        orderBy: { requestCount: 'desc' },
        take: 10,
        select: {
          identifier: true,
          identifierType: true,
          route: true,
          requestCount: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      totalRequests: totalRequests._sum.requestCount || 0,
      blockedRequests,
      activeBlocks,
      topViolators: topViolators.map(v => ({
        identifier: v.identifier,
        type: v.identifierType,
        route: v.route,
        requestCount: v.requestCount,
        blockedAt: v.createdAt,
      })),
      timeRange: {
        start: oneHourAgo,
        end: now,
      },
    };
  }

  /**
   * Unblock an identifier
   */
  async unblockIdentifier(
    identifier: string,
    type: RateLimitType,
    route?: string
  ): Promise<void> {
    const now = new Date();
    
    await this.prisma.rateLimitRecord.updateMany({
      where: {
        identifier,
        identifierType: type,
        route: route || null,
        isBlocked: true,
      },
      data: {
        isBlocked: false,
        blockedUntil: null,
      },
    });

    this.logger.log(`Unblocked identifier: ${identifier} (${type})`);
  }

  /**
   * Clean up old rate limit records
   */
  async cleanupOldRecords(): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7); // Keep records for 7 days

    const result = await this.prisma.rateLimitRecord.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        isBlocked: false,
      },
    });

    this.logger.log(`Cleaned up ${result.count} old rate limit records`);
    return result.count;
  }

  /**
   * Get rate limit configuration
   */
  getRateLimitConfig(): RateLimitRule[] {
    return [...this.defaultRules];
  }

  /**
   * Update rate limit configuration
   */
  updateRateLimitConfig(rules: RateLimitRule[]): void {
    this.defaultRules.splice(0, this.defaultRules.length, ...rules);
    this.logger.log('Updated rate limit configuration');
  }

  /**
   * Log rate limit violation
   */
  private async logRateLimitViolation(
    identifier: string,
    rule: RateLimitRule,
    reason: string
  ): Promise<void> {
    try {
      await this.prisma.securityEvent.create({
        data: {
          eventType: 'RATE_LIMIT_EXCEEDED',
          severity: 'MEDIUM',
          description: `Rate limit exceeded for ${identifier}`,
          metadata: {
            identifier,
            rule: rule.identifier,
            type: rule.type,
            route: rule.route,
            reason,
            requestsPerWindow: rule.requestsPerWindow,
            windowMs: rule.windowMs,
            blockDurationMs: rule.blockDurationMs,
          },
        },
      });
    } catch (error) {
      this.logger.error('Failed to log rate limit violation:', error);
    }
  }

  /**
   * Check if identifier is blocked
   */
  async isBlocked(
    identifier: string,
    type: RateLimitType,
    route?: string
  ): Promise<boolean> {
    const now = new Date();
    
    const record = await this.prisma.rateLimitRecord.findFirst({
      where: {
        identifier,
        identifierType: type,
        route: route || null,
        isBlocked: true,
        blockedUntil: { gt: now },
      },
    });

    return !!record;
  }

  /**
   * Get remaining requests for identifier
   */
  async getRemainingRequests(
    identifier: string,
    type: RateLimitType,
    route?: string
  ): Promise<number> {
    const rules = this.getApplicableRules(type, route);
    if (rules.length === 0) return 0;

    const rule = rules[0]; // Use first applicable rule
    const now = new Date();
    const windowStart = new Date(now.getTime() - rule.windowMs);

    const record = await this.prisma.rateLimitRecord.findUnique({
      where: {
        identifier_identifierType_route_windowStart: {
          identifier,
          identifierType: rule.type,
          route: rule.route || null,
          windowStart,
        },
      },
    });

    if (!record) {
      return rule.requestsPerWindow;
    }

    return Math.max(0, rule.requestsPerWindow - record.requestCount);
  }
}
