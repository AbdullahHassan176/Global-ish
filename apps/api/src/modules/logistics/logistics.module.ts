import { Module } from '@nestjs/common';
import { LogisticsController } from './controllers/logistics.controller';
import { MilestoneController } from './controllers/milestone.controller';
import { MapController } from './controllers/map.controller';
import { InvoiceController } from './controllers/invoice.controller';
import { AlertsController } from './controllers/alerts.controller';
import { QueueController } from './controllers/queue.controller';
import { LogisticsService } from './services/logistics.service';
import { MilestoneService } from './services/milestone.service';
import { MapService } from './services/map.service';
import { InvoiceService } from './services/invoice.service';
import { AlertsService } from './services/alerts.service';
import { CarrierIntegrationService } from './services/carrier-integration.service';
import { CarrierAdapterFactory } from './adapters/carrier-adapter.factory';
import { MaerskAdapter } from './adapters/maersk.adapter';
import { MscAdapter } from './adapters/msc.adapter';
import { CmaCgmAdapter } from './adapters/cma-cgm.adapter';
import { DhlAdapter } from './adapters/dhl.adapter';
import { FedexAdapter } from './adapters/fedex.adapter';
import { CarrierPollingProcessor } from './processors/carrier-polling.processor';
import { WebhookProcessor } from './processors/webhook.processor';
import { QueueService } from './services/queue.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LogisticsController, MilestoneController, MapController, InvoiceController, AlertsController, QueueController],
  providers: [
    LogisticsService,
    MilestoneService,
    MapService,
    InvoiceService,
    AlertsService,
    CarrierIntegrationService,
    CarrierAdapterFactory,
    MaerskAdapter,
    MscAdapter,
    CmaCgmAdapter,
    DhlAdapter,
    FedexAdapter,
    CarrierPollingProcessor,
    WebhookProcessor,
    QueueService,
  ],
  exports: [
    LogisticsService,
    MilestoneService,
    MapService,
    InvoiceService,
    AlertsService,
    CarrierIntegrationService,
    CarrierAdapterFactory,
    QueueService,
  ],
})
export class LogisticsModule {}