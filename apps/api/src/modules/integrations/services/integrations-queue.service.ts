import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Queue, Worker, QueueEvents } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { WebhookDeliveryProcessor } from '../processors/webhook-delivery.processor';
import { WebhookDeliveryJobData } from '../processors/webhook-delivery.processor';

@Injectable()
export class IntegrationsQueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(IntegrationsQueueService.name);
  
  // Queues
  private webhookDeliveryQueue: Queue<WebhookDeliveryJobData>;
  private webhookRetryQueue: Queue<{ deliveryId: string }>;
  private webhookCleanupQueue: Queue<{ olderThanDays: number }>;
  
  // Workers
  private webhookDeliveryWorker: Worker<WebhookDeliveryJobData>;
  private webhookRetryWorker: Worker<{ deliveryId: string }>;
  private webhookCleanupWorker: Worker<{ olderThanDays: number }>;
  
  // Queue Events
  private webhookDeliveryEvents: QueueEvents;
  private webhookRetryEvents: QueueEvents;
  private webhookCleanupEvents: QueueEvents;

  constructor(
    private readonly configService: ConfigService,
    private readonly webhookDeliveryProcessor: WebhookDeliveryProcessor,
  ) {}

  async onModuleInit() {
    const redisConfig = {
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
    };

    // Initialize Queues
    this.webhookDeliveryQueue = new Queue('webhook-delivery', {
      connection: redisConfig,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    });

    this.webhookRetryQueue = new Queue('webhook-retry', {
      connection: redisConfig,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 25,
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    });

    this.webhookCleanupQueue = new Queue('webhook-cleanup', {
      connection: redisConfig,
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
        attempts: 1,
      },
    });

    // Initialize Workers
    this.webhookDeliveryWorker = new Worker(
      'webhook-delivery',
      (job) => this.webhookDeliveryProcessor.processWebhookDelivery(job),
      {
        connection: redisConfig,
        concurrency: 10,
      },
    );

    this.webhookRetryWorker = new Worker(
      'webhook-retry',
      (job) => this.webhookDeliveryProcessor.processWebhookRetry(job),
      {
        connection: redisConfig,
        concurrency: 5,
      },
    );

    this.webhookCleanupWorker = new Worker(
      'webhook-cleanup',
      (job) => this.webhookDeliveryProcessor.processWebhookCleanup(job),
      {
        connection: redisConfig,
        concurrency: 1,
      },
    );

    // Initialize Queue Events
    this.webhookDeliveryEvents = new QueueEvents('webhook-delivery', {
      connection: redisConfig,
    });

    this.webhookRetryEvents = new QueueEvents('webhook-retry', {
      connection: redisConfig,
    });

    this.webhookCleanupEvents = new QueueEvents('webhook-cleanup', {
      connection: redisConfig,
    });

    // Set up event listeners
    this.setupEventListeners();

    // Schedule cleanup job to run daily
    this.scheduleCleanupJob();

    this.logger.log('Integrations queue service initialized successfully');
  }

  async onModuleDestroy() {
    await Promise.all([
      this.webhookDeliveryWorker?.close(),
      this.webhookRetryWorker?.close(),
      this.webhookCleanupWorker?.close(),
      this.webhookDeliveryQueue?.close(),
      this.webhookRetryQueue?.close(),
      this.webhookCleanupQueue?.close(),
      this.webhookDeliveryEvents?.close(),
      this.webhookRetryEvents?.close(),
      this.webhookCleanupEvents?.close(),
    ]);

    this.logger.log('Integrations queue service destroyed');
  }

  private setupEventListeners() {
    // Webhook Delivery Events
    this.webhookDeliveryEvents.on('completed', ({ jobId, returnvalue }) => {
      this.logger.log(`Webhook delivery job ${jobId} completed`);
    });

    this.webhookDeliveryEvents.on('failed', ({ jobId, failedReason }) => {
      this.logger.error(`Webhook delivery job ${jobId} failed: ${failedReason}`);
    });

    this.webhookDeliveryEvents.on('stalled', ({ jobId }) => {
      this.logger.warn(`Webhook delivery job ${jobId} stalled`);
    });

    // Webhook Retry Events
    this.webhookRetryEvents.on('completed', ({ jobId, returnvalue }) => {
      this.logger.log(`Webhook retry job ${jobId} completed`);
    });

    this.webhookRetryEvents.on('failed', ({ jobId, failedReason }) => {
      this.logger.error(`Webhook retry job ${jobId} failed: ${failedReason}`);
    });

    // Webhook Cleanup Events
    this.webhookCleanupEvents.on('completed', ({ jobId, returnvalue }) => {
      this.logger.log(`Webhook cleanup job ${jobId} completed: ${returnvalue?.deletedCount} deliveries cleaned`);
    });

    this.webhookCleanupEvents.on('failed', ({ jobId, failedReason }) => {
      this.logger.error(`Webhook cleanup job ${jobId} failed: ${failedReason}`);
    });
  }

  private scheduleCleanupJob() {
    // Schedule cleanup to run daily at 2 AM
    this.webhookCleanupQueue.add(
      'cleanup-old-deliveries',
      { olderThanDays: 30 },
      {
        repeat: { cron: '0 2 * * *' }, // Daily at 2 AM
        jobId: 'daily-webhook-cleanup',
      },
    );

    this.logger.log('Scheduled daily webhook cleanup job');
  }

  // Webhook Delivery Queue Methods
  async addWebhookDeliveryJob(data: WebhookDeliveryJobData, options?: any) {
    const job = await this.webhookDeliveryQueue.add('deliver-webhook', data, {
      priority: 5, // High priority for webhook deliveries
      ...options,
    });

    this.logger.log(`Added webhook delivery job ${job.id} for delivery ${data.deliveryId}`);
    return job;
  }

  async scheduleWebhookDelivery(data: WebhookDeliveryJobData, delay: number) {
    const job = await this.webhookDeliveryQueue.add('deliver-webhook', data, {
      delay,
      priority: 5,
    });

    this.logger.log(`Scheduled webhook delivery job ${job.id} for delivery ${data.deliveryId} in ${delay}ms`);
    return job;
  }

  // Webhook Retry Queue Methods
  async addWebhookRetryJob(deliveryId: string, options?: any) {
    const job = await this.webhookRetryQueue.add('retry-webhook', { deliveryId }, {
      priority: 3, // Medium priority for retries
      ...options,
    });

    this.logger.log(`Added webhook retry job ${job.id} for delivery ${deliveryId}`);
    return job;
  }

  // Webhook Cleanup Queue Methods
  async addWebhookCleanupJob(olderThanDays: number = 30, options?: any) {
    const job = await this.webhookCleanupQueue.add('cleanup-webhooks', { olderThanDays }, {
      priority: 1, // Low priority for cleanup
      ...options,
    });

    this.logger.log(`Added webhook cleanup job ${job.id} for deliveries older than ${olderThanDays} days`);
    return job;
  }

  // Queue Management Methods
  async getQueueStats() {
    const [webhookDeliveryStats, webhookRetryStats, webhookCleanupStats] = await Promise.all([
      this.getQueueStatsForQueue(this.webhookDeliveryQueue),
      this.getQueueStatsForQueue(this.webhookRetryQueue),
      this.getQueueStatsForQueue(this.webhookCleanupQueue),
    ]);

    return {
      webhookDelivery: webhookDeliveryStats,
      webhookRetry: webhookRetryStats,
      webhookCleanup: webhookCleanupStats,
    };
  }

  private async getQueueStatsForQueue(queue: Queue) {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed(),
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
    };
  }

  async pauseQueue(queueName: string) {
    const queue = this.getQueueByName(queueName);
    await queue.pause();
    this.logger.log(`Paused queue: ${queueName}`);
  }

  async resumeQueue(queueName: string) {
    const queue = this.getQueueByName(queueName);
    await queue.resume();
    this.logger.log(`Resumed queue: ${queueName}`);
  }

  async clearQueue(queueName: string) {
    const queue = this.getQueueByName(queueName);
    await queue.obliterate({ force: true });
    this.logger.log(`Cleared queue: ${queueName}`);
  }

  async getJobDetails(queueName: string, jobId: string) {
    const queue = this.getQueueByName(queueName);
    const job = await queue.getJob(jobId);
    
    if (!job) {
      return null;
    }

    return {
      id: job.id,
      name: job.name,
      data: job.data,
      progress: job.progress,
      returnvalue: job.returnvalue,
      failedReason: job.failedReason,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      timestamp: job.timestamp,
      attemptsMade: job.attemptsMade,
      opts: job.opts,
    };
  }

  async retryJob(queueName: string, jobId: string) {
    const queue = this.getQueueByName(queueName);
    const job = await queue.getJob(jobId);
    
    if (job) {
      await job.retry();
      this.logger.log(`Retried job ${jobId} in queue ${queueName}`);
    }
  }

  async removeJob(queueName: string, jobId: string) {
    const queue = this.getQueueByName(queueName);
    const job = await queue.getJob(jobId);
    
    if (job) {
      await job.remove();
      this.logger.log(`Removed job ${jobId} from queue ${queueName}`);
    }
  }

  private getQueueByName(queueName: string): Queue {
    switch (queueName) {
      case 'webhook-delivery':
        return this.webhookDeliveryQueue;
      case 'webhook-retry':
        return this.webhookRetryQueue;
      case 'webhook-cleanup':
        return this.webhookCleanupQueue;
      default:
        throw new Error(`Unknown queue: ${queueName}`);
    }
  }
}
