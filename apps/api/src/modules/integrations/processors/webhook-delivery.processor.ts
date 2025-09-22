import { Processor, Worker, Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { WebhookService } from '../services/webhook.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { DeliveryStatus } from '../interfaces/webhook.interface';

export interface WebhookDeliveryJobData {
  deliveryId: string;
  webhookId: string;
  eventType: string;
  payload: Record<string, any>;
  signature: string;
  attemptCount: number;
  maxAttempts: number;
}

@Injectable()
export class WebhookDeliveryProcessor {
  private readonly logger = new Logger(WebhookDeliveryProcessor.name);

  constructor(
    private readonly webhookService: WebhookService,
    private readonly prisma: PrismaService,
  ) {}

  @Processor('webhook-delivery')
  async processWebhookDelivery(job: Job<WebhookDeliveryJobData>) {
    const { deliveryId, webhookId, eventType, payload, signature, attemptCount, maxAttempts } = job.data;
    
    this.logger.log(`Processing webhook delivery job ${deliveryId} (attempt ${attemptCount}/${maxAttempts})`);

    try {
      // Get webhook endpoint
      const webhookEndpoint = await this.prisma.webhookEndpoint.findUnique({
        where: { id: webhookId },
      });

      if (!webhookEndpoint) {
        throw new Error(`Webhook endpoint ${webhookId} not found`);
      }

      if (!webhookEndpoint.isActive) {
        throw new Error(`Webhook endpoint ${webhookId} is not active`);
      }

      // Prepare the webhook event
      const webhookEvent = {
        eventId: payload.eventId,
        eventType: eventType,
        entityId: payload.entityId,
        entityType: payload.entityType,
        data: payload.data,
        timestamp: new Date(payload.timestamp),
      };

      // Deliver the webhook
      const result = await this.webhookService.deliverWebhook(webhookId, webhookEvent);

      this.logger.log(`Successfully processed webhook delivery job ${deliveryId}`, {
        status: result.status,
        responseCode: result.responseCode,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to process webhook delivery job ${deliveryId}`, {
        error: error.message,
        attemptCount,
        maxAttempts,
      });

      // Check if we should retry
      if (attemptCount < maxAttempts) {
        const nextRetryAt = this.calculateNextRetryTime(attemptCount);
        
        // Update delivery record with retry information
        await this.prisma.webhookDelivery.update({
          where: { id: deliveryId },
          data: {
            status: DeliveryStatus.RETRYING,
            attemptCount: attemptCount + 1,
            nextRetryAt,
            responseCode: error.response?.status,
            responseBody: error.response?.data,
          },
        });

        // Schedule retry
        throw new Error(`Webhook delivery failed, will retry at ${nextRetryAt.toISOString()}`);
      } else {
        // Max attempts reached, mark as failed
        await this.prisma.webhookDelivery.update({
          where: { id: deliveryId },
          data: {
            status: DeliveryStatus.FAILED,
            attemptCount: attemptCount + 1,
            failedAt: new Date(),
            responseCode: error.response?.status,
            responseBody: error.response?.data,
          },
        });

        throw error;
      }
    }
  }

  /**
   * Calculate next retry time using exponential backoff
   */
  private calculateNextRetryTime(attemptCount: number): Date {
    const baseDelay = 1000; // 1 second
    const maxDelay = 300000; // 5 minutes
    const backoffMultiplier = 2;

    const delay = Math.min(
      baseDelay * Math.pow(backoffMultiplier, attemptCount - 1),
      maxDelay
    );

    return new Date(Date.now() + delay);
  }

  /**
   * Process failed webhook deliveries for retry
   */
  @Processor('webhook-retry')
  async processWebhookRetry(job: Job<{ deliveryId: string }>) {
    const { deliveryId } = job.data;
    
    this.logger.log(`Processing webhook retry for delivery ${deliveryId}`);

    try {
      const result = await this.webhookService.retryFailedDelivery(deliveryId);
      
      this.logger.log(`Successfully retried webhook delivery ${deliveryId}`, {
        status: result.status,
      });

      return result;
    } catch (error) {
      this.logger.error(`Failed to retry webhook delivery ${deliveryId}`, {
        error: error.message,
      });

      throw error;
    }
  }

  /**
   * Clean up expired webhook deliveries
   */
  @Processor('webhook-cleanup')
  async processWebhookCleanup(job: Job<{ olderThanDays: number }>) {
    const { olderThanDays = 30 } = job.data;
    
    this.logger.log(`Cleaning up webhook deliveries older than ${olderThanDays} days`);

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const result = await this.prisma.webhookDelivery.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
          status: {
            in: [DeliveryStatus.DELIVERED, DeliveryStatus.FAILED, DeliveryStatus.EXPIRED],
          },
        },
      });

      this.logger.log(`Cleaned up ${result.count} webhook deliveries`);

      return { deletedCount: result.count };
    } catch (error) {
      this.logger.error(`Failed to clean up webhook deliveries`, {
        error: error.message,
      });

      throw error;
    }
  }
}
