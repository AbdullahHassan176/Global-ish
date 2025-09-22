import { Module } from '@nestjs/common';
import { CredentialVaultController } from './controllers/credential-vault.controller';
import { WebhookController } from './controllers/webhook.controller';
import { TokenizationBridgeController } from './controllers/tokenization-bridge.controller';
import { CredentialVaultService } from './services/credential-vault.service';
import { WebhookService } from './services/webhook.service';
import { TokenizationBridgeService } from './services/tokenization-bridge.service';
import { IntegrationsQueueService } from './services/integrations-queue.service';
import { WebhookDeliveryProcessor } from './processors/webhook-delivery.processor';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    CredentialVaultController,
    WebhookController,
    TokenizationBridgeController,
  ],
  providers: [
    CredentialVaultService,
    WebhookService,
    TokenizationBridgeService,
    IntegrationsQueueService,
    WebhookDeliveryProcessor,
  ],
  exports: [
    CredentialVaultService,
    WebhookService,
    TokenizationBridgeService,
    IntegrationsQueueService,
  ],
})
export class IntegrationsModule {}
