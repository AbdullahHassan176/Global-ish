import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { ReportingController } from './controllers/reporting.controller';
import { ReportingService } from './services/reporting.service';
import { KpiCalculationService } from './services/kpi-calculation.service';
import { PredictiveAnalyticsService } from './services/predictive-analytics.service';

@Module({
  imports: [PrismaModule],
  controllers: [ReportingController],
  providers: [
    ReportingService,
    KpiCalculationService,
    PredictiveAnalyticsService,
  ],
  exports: [
    ReportingService,
    KpiCalculationService,
    PredictiveAnalyticsService,
  ],
})
export class ReportingModule {}
