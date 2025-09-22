import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { SecurityController } from './controllers/security.controller';
import { GDPRComplianceService } from './services/gdpr-compliance.service';
import { SessionManagementService } from './services/session-management.service';
import { RateLimitingService } from './services/rate-limiting.service';
import { PIIEncryptionService } from './services/pii-encryption.service';
import { RateLimitingMiddleware } from './middleware/rate-limiting.middleware';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SecurityController],
  providers: [
    GDPRComplianceService,
    SessionManagementService,
    RateLimitingService,
    PIIEncryptionService,
    RateLimitingMiddleware,
  ],
  exports: [
    GDPRComplianceService,
    SessionManagementService,
    RateLimitingService,
    PIIEncryptionService,
    RateLimitingMiddleware,
  ],
})
export class SecurityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply rate limiting middleware to all routes
    consumer
      .apply(RateLimitingMiddleware)
      .forRoutes('*');
  }
}
