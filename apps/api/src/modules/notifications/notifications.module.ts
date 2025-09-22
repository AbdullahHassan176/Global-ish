import { Module } from '@nestjs/common';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationService } from './services/notification.service';
import { EmailService } from './services/email.service';
import { SMSService } from './services/sms.service';
import { WebhookService } from './services/webhook.service';
import { TemplateService } from './services/template.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [
    NotificationService,
    EmailService,
    SMSService,
    WebhookService,
    TemplateService
  ],
  exports: [NotificationService],
})
export class NotificationsModule {}
