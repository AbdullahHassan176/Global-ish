import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Queue, Worker, QueueEvents } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { Carrier } from '@prisma/client';
import { CarrierPollingProcessor } from '../processors/carrier-polling.processor';
import { WebhookProcessor } from '../processors/webhook.processor';
import { CarrierPollingJobData, WebhookJobData } from '../processors/carrier-polling.processor';

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  
  // Queues
  private carrierPollingQueue: Queue<CarrierPollingJobData>;
  private webhookQueue: Queue<WebhookJobData>;
  
  // Workers
  private carrierPollingWorker: Worker<CarrierPollingJobData>;
  private webhookWorker: Worker<WebhookJobData>;
  
  // Queue Events
  private carrierPollingEvents: QueueEvents;
  private webhookEvents: QueueEvents;

  constructor(
    private readonly configService: ConfigService,
    private readonly carrierPollingProcessor: CarrierPollingProcessor,
    private readonly webhookProcessor: WebhookProcessor,
  ) {}

  async onModuleInit() {
    const redisConfig = {
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
    };

    // Initialize Queues
    this.carrierPollingQueue = new Queue('carrier-polling', {
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

    this.webhookQueue = new Queue('webhook-processing', {
      connection: redisConfig,
      defaultJobOptions: {
        removeOnComplete: 200,
        removeOnFail: 100,
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    });

    // Initialize Workers
    this.carrierPollingWorker = new Worker(
      'carrier-polling',
      (job) => this.carrierPollingProcessor.processCarrierPolling(job),
      {
        connection: redisConfig,
        concurrency: 5,
      },
    );

    this.webhookWorker = new Worker(
      'webhook-processing',
      (job) => this.webhookProcessor.processWebhook(job),
      {
        connection: redisConfig,
        concurrency: 10,
      },
    );

    // Initialize Queue Events
    this.carrierPollingEvents = new QueueEvents('carrier-polling', {
      connection: redisConfig,
    });

    this.webhookEvents = new QueueEvents('webhook-processing', {
      connection: redisConfig,
    });

    // Set up event listeners
    this.setupEventListeners();

    this.logger.log('Queue service initialized successfully');
  }

  async onModuleDestroy() {
    await Promise.all([
      this.carrierPollingWorker?.close(),
      this.webhookWorker?.close(),
      this.carrierPollingQueue?.close(),
      this.webhookQueue?.close(),
      this.carrierPollingEvents?.close(),
      this.webhookEvents?.close(),
    ]);

    this.logger.log('Queue service destroyed');
  }

  private setupEventListeners() {
    // Carrier Polling Events
    this.carrierPollingEvents.on('completed', ({ jobId, returnvalue }) => {
      this.logger.log(`Carrier polling job ${jobId} completed`);
    });

    this.carrierPollingEvents.on('failed', ({ jobId, failedReason }) => {
      this.logger.error(`Carrier polling job ${jobId} failed: ${failedReason}`);
    });

    this.carrierPollingEvents.on('stalled', ({ jobId }) => {
      this.logger.warn(`Carrier polling job ${jobId} stalled`);
    });

    // Webhook Events
    this.webhookEvents.on('completed', ({ jobId, returnvalue }) => {
      this.logger.log(`Webhook job ${jobId} completed`);
    });

    this.webhookEvents.on('failed', ({ jobId, failedReason }) => {
      this.logger.error(`Webhook job ${jobId} failed: ${failedReason}`);
    });

    this.webhookEvents.on('stalled', ({ jobId }) => {
      this.logger.warn(`Webhook job ${jobId} stalled`);
    });
  }

  // Carrier Polling Queue Methods
  async addCarrierPollingJob(data: CarrierPollingJobData, options?: any) {
    const job = await this.carrierPollingQueue.add('poll-carrier', data, {
      priority: data.shipmentId ? 10 : 1, // Higher priority for specific shipments
      ...options,
    });

    this.logger.log(`Added carrier polling job ${job.id} for ${data.carrier}`);
    return job;
  }

  async scheduleCarrierPolling(data: CarrierPollingJobData, delay: number) {
    const job = await this.carrierPollingQueue.add('poll-carrier', data, {
      delay,
      priority: data.shipmentId ? 10 : 1,
    });

    this.logger.log(`Scheduled carrier polling job ${job.id} for ${data.carrier} in ${delay}ms`);
    return job;
  }

  async scheduleRecurringCarrierPolling(carrier: Carrier, interval: number = 300000) { // 5 minutes default
    const job = await this.carrierPollingQueue.add(
      'poll-carrier',
      { carrier },
      {
        repeat: { every: interval },
        jobId: `recurring-${carrier.toLowerCase()}`,
      },
    );

    this.logger.log(`Scheduled recurring carrier polling for ${carrier} every ${interval}ms`);
    return job;
  }

  // Webhook Queue Methods
  async addWebhookJob(data: WebhookJobData, options?: any) {
    const job = await this.webhookQueue.add('process-webhook', data, {
      priority: 5, // High priority for webhooks
      ...options,
    });

    this.logger.log(`Added webhook job ${job.id} for ${data.carrier}`);
    return job;
  }

  // Queue Management Methods
  async getQueueStats() {
    const [carrierPollingStats, webhookStats] = await Promise.all([
      this.getQueueStatsForQueue(this.carrierPollingQueue),
      this.getQueueStatsForQueue(this.webhookQueue),
    ]);

    return {
      carrierPolling: carrierPollingStats,
      webhook: webhookStats,
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
    const queue = queueName === 'carrier-polling' ? this.carrierPollingQueue : this.webhookQueue;
    await queue.pause();
    this.logger.log(`Paused queue: ${queueName}`);
  }

  async resumeQueue(queueName: string) {
    const queue = queueName === 'carrier-polling' ? this.carrierPollingQueue : this.webhookQueue;
    await queue.resume();
    this.logger.log(`Resumed queue: ${queueName}`);
  }

  async clearQueue(queueName: string) {
    const queue = queueName === 'carrier-polling' ? this.carrierPollingQueue : this.webhookQueue;
    await queue.obliterate({ force: true });
    this.logger.log(`Cleared queue: ${queueName}`);
  }

  async getJobDetails(queueName: string, jobId: string) {
    const queue = queueName === 'carrier-polling' ? this.carrierPollingQueue : this.webhookQueue;
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
    const queue = queueName === 'carrier-polling' ? this.carrierPollingQueue : this.webhookQueue;
    const job = await queue.getJob(jobId);
    
    if (job) {
      await job.retry();
      this.logger.log(`Retried job ${jobId} in queue ${queueName}`);
    }
  }

  async removeJob(queueName: string, jobId: string) {
    const queue = queueName === 'carrier-polling' ? this.carrierPollingQueue : this.webhookQueue;
    const job = await queue.getJob(jobId);
    
    if (job) {
      await job.remove();
      this.logger.log(`Removed job ${jobId} from queue ${queueName}`);
    }
  }
}
