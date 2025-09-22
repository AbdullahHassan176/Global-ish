import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimitingService } from '../services/rate-limiting.service';
import { RateLimitType } from '@prisma/client';

@Injectable()
export class RateLimitingMiddleware implements NestMiddleware {
  constructor(private readonly rateLimitingService: RateLimitingService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract identifiers
      const userId = (req as any).user?.id;
      const ipAddress = this.getClientIP(req);
      const route = req.route?.path || req.path;

      // Check rate limits
      const checks = await Promise.all([
        // Global rate limit
        this.rateLimitingService.checkRateLimit('global', RateLimitType.GLOBAL),
        
        // IP-based rate limit
        this.rateLimitingService.checkRateLimit(ipAddress, RateLimitType.IP_ADDRESS),
        
        // User-based rate limit (if authenticated)
        userId ? this.rateLimitingService.checkRateLimit(userId, RateLimitType.USER_ID) : null,
        
        // Route-based rate limit
        this.rateLimitingService.checkRateLimit(route, RateLimitType.ROUTE, route),
      ]);

      // Check if any rate limit was exceeded
      const failedCheck = checks.find(check => check && !check.allowed);
      
      if (failedCheck) {
        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', '1000'); // Default limit
        res.setHeader('X-RateLimit-Remaining', failedCheck.remaining || 0);
        res.setHeader('X-RateLimit-Reset', failedCheck.resetTime || 0);
        
        if (failedCheck.retryAfter) {
          res.setHeader('Retry-After', failedCheck.retryAfter);
        }

        throw new HttpException(
          {
            message: 'Rate limit exceeded',
            reason: failedCheck.reason,
            retryAfter: failedCheck.retryAfter,
          },
          HttpStatus.TOO_MANY_REQUESTS
        );
      }

      // Set rate limit headers for successful request
      const userCheck = checks[2]; // User-based check
      if (userCheck) {
        res.setHeader('X-RateLimit-Limit', '1000');
        res.setHeader('X-RateLimit-Remaining', userCheck.remaining || 0);
        res.setHeader('X-RateLimit-Reset', userCheck.resetTime || 0);
      }

      next();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Log error but don't block request
      console.error('Rate limiting middleware error:', error);
      next();
    }
  }

  /**
   * Get client IP address from request
   */
  private getClientIP(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'] as string;
    const realIP = req.headers['x-real-ip'] as string;
    const remoteAddress = req.connection?.remoteAddress || req.socket?.remoteAddress;
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    return remoteAddress || 'unknown';
  }
}
