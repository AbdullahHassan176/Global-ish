import { Module } from '@nestjs/common';
import { MarketingController } from './controllers/marketing.controller';
import { MarketingService } from './services/marketing.service';
import { SocialIntegrationService } from './services/social-integration.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MarketingController],
  providers: [MarketingService, SocialIntegrationService],
  exports: [MarketingService, SocialIntegrationService],
})
export class MarketingModule {}
