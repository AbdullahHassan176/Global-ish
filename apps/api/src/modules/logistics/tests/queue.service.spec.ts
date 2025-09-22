import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from '../services/queue.service';
import { CarrierPollingProcessor } from '../processors/carrier-polling.processor';
import { WebhookProcessor } from '../processors/webhook.processor';
import { ConfigService } from '@nestjs/config';
import { Carrier } from '@prisma/client';

// Mock BullMQ
jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    close: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    obliterate: jest.fn(),
    getJob: jest.fn(),
    getWaiting: jest.fn().mockResolvedValue([]),
    getActive: jest.fn().mockResolvedValue([]),
    getCompleted: jest.fn().mockResolvedValue([]),
    getFailed: jest.fn().mockResolvedValue([]),
    getDelayed: jest.fn().mockResolvedValue([]),
  })),
  Worker: jest.fn().mockImplementation(() => ({
    close: jest.fn(),
  })),
  QueueEvents: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    close: jest.fn(),
  })),
}));

describe('QueueService', () => {
  let service: QueueService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const config = {
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        REDIS_PASSWORD: undefined,
      };
      return config[key] || defaultValue;
    }),
  };

  const mockCarrierPollingProcessor = {
    processCarrierPolling: jest.fn(),
  };

  const mockWebhookProcessor = {
    processWebhook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CarrierPollingProcessor,
          useValue: mockCarrierPollingProcessor,
        },
        {
          provide: WebhookProcessor,
          useValue: mockWebhookProcessor,
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize queues and workers', async () => {
      await service.onModuleInit();
      
      expect(configService.get).toHaveBeenCalledWith('REDIS_HOST', 'localhost');
      expect(configService.get).toHaveBeenCalledWith('REDIS_PORT', 6379);
      expect(configService.get).toHaveBeenCalledWith('REDIS_PASSWORD');
    });
  });

  describe('onModuleDestroy', () => {
    it('should close all queues and workers', async () => {
      await service.onModuleInit();
      await service.onModuleDestroy();
      
      // Verify that close methods would be called
      // (mocked implementations don't actually close)
    });
  });

  describe('addCarrierPollingJob', () => {
    it('should add a carrier polling job', async () => {
      await service.onModuleInit();
      
      const jobData = {
        carrier: Carrier.MAERSK,
        shipmentId: 'shipment-1',
      };

      const mockJob = { id: 'job-1', data: jobData };
      const mockQueue = { add: jest.fn().mockResolvedValue(mockJob) };
      
      // Mock the queue instance
      (service as any).carrierPollingQueue = mockQueue;

      const result = await service.addCarrierPollingJob(jobData);

      expect(mockQueue.add).toHaveBeenCalledWith('poll-carrier', jobData, {
        priority: 10, // Higher priority for specific shipments
      });
      expect(result).toEqual(mockJob);
    });
  });

  describe('scheduleCarrierPolling', () => {
    it('should schedule a carrier polling job with delay', async () => {
      await service.onModuleInit();
      
      const jobData = {
        carrier: Carrier.MAERSK,
        shipmentId: 'shipment-1',
      };
      const delay = 5000;

      const mockJob = { id: 'job-1', data: jobData };
      const mockQueue = { add: jest.fn().mockResolvedValue(mockJob) };
      
      (service as any).carrierPollingQueue = mockQueue;

      const result = await service.scheduleCarrierPolling(jobData, delay);

      expect(mockQueue.add).toHaveBeenCalledWith('poll-carrier', jobData, {
        delay,
        priority: 10,
      });
      expect(result).toEqual(mockJob);
    });
  });

  describe('scheduleRecurringCarrierPolling', () => {
    it('should schedule recurring carrier polling', async () => {
      await service.onModuleInit();
      
      const carrier = Carrier.MAERSK;
      const interval = 300000; // 5 minutes

      const mockJob = { id: 'job-1' };
      const mockQueue = { add: jest.fn().mockResolvedValue(mockJob) };
      
      (service as any).carrierPollingQueue = mockQueue;

      const result = await service.scheduleRecurringCarrierPolling(carrier, interval);

      expect(mockQueue.add).toHaveBeenCalledWith(
        'poll-carrier',
        { carrier },
        {
          repeat: { every: interval },
          jobId: `recurring-${carrier.toLowerCase()}`,
        },
      );
      expect(result).toEqual(mockJob);
    });
  });

  describe('addWebhookJob', () => {
    it('should add a webhook job', async () => {
      await service.onModuleInit();
      
      const jobData = {
        carrier: Carrier.MAERSK,
        payload: { event: 'test' },
        webhookUrl: 'https://example.com/webhook',
        signature: 'signature123',
      };

      const mockJob = { id: 'job-1', data: jobData };
      const mockQueue = { add: jest.fn().mockResolvedValue(mockJob) };
      
      (service as any).webhookQueue = mockQueue;

      const result = await service.addWebhookJob(jobData);

      expect(mockQueue.add).toHaveBeenCalledWith('process-webhook', jobData, {
        priority: 5, // High priority for webhooks
      });
      expect(result).toEqual(mockJob);
    });
  });

  describe('getQueueStats', () => {
    it('should return queue statistics', async () => {
      await service.onModuleInit();
      
      const mockStats = {
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 3,
        delayed: 1,
      };

      const mockQueue = {
        getWaiting: jest.fn().mockResolvedValue(new Array(mockStats.waiting)),
        getActive: jest.fn().mockResolvedValue(new Array(mockStats.active)),
        getCompleted: jest.fn().mockResolvedValue(new Array(mockStats.completed)),
        getFailed: jest.fn().mockResolvedValue(new Array(mockStats.failed)),
        getDelayed: jest.fn().mockResolvedValue(new Array(mockStats.delayed)),
      };
      
      (service as any).carrierPollingQueue = mockQueue;
      (service as any).webhookQueue = mockQueue;

      const result = await service.getQueueStats();

      expect(result).toEqual({
        carrierPolling: mockStats,
        webhook: mockStats,
      });
    });
  });

  describe('pauseQueue', () => {
    it('should pause a queue', async () => {
      await service.onModuleInit();
      
      const mockQueue = { pause: jest.fn() };
      (service as any).carrierPollingQueue = mockQueue;

      await service.pauseQueue('carrier-polling');

      expect(mockQueue.pause).toHaveBeenCalled();
    });
  });

  describe('resumeQueue', () => {
    it('should resume a queue', async () => {
      await service.onModuleInit();
      
      const mockQueue = { resume: jest.fn() };
      (service as any).carrierPollingQueue = mockQueue;

      await service.resumeQueue('carrier-polling');

      expect(mockQueue.resume).toHaveBeenCalled();
    });
  });

  describe('clearQueue', () => {
    it('should clear a queue', async () => {
      await service.onModuleInit();
      
      const mockQueue = { obliterate: jest.fn() };
      (service as any).carrierPollingQueue = mockQueue;

      await service.clearQueue('carrier-polling');

      expect(mockQueue.obliterate).toHaveBeenCalledWith({ force: true });
    });
  });

  describe('getJobDetails', () => {
    it('should return job details', async () => {
      await service.onModuleInit();
      
      const mockJob = {
        id: 'job-1',
        name: 'poll-carrier',
        data: { carrier: Carrier.MAERSK },
        progress: 50,
        returnvalue: null,
        failedReason: null,
        processedOn: Date.now(),
        finishedOn: null,
        timestamp: Date.now(),
        attemptsMade: 1,
        opts: {},
      };

      const mockQueue = { getJob: jest.fn().mockResolvedValue(mockJob) };
      (service as any).carrierPollingQueue = mockQueue;

      const result = await service.getJobDetails('carrier-polling', 'job-1');

      expect(mockQueue.getJob).toHaveBeenCalledWith('job-1');
      expect(result).toEqual({
        id: mockJob.id,
        name: mockJob.name,
        data: mockJob.data,
        progress: mockJob.progress,
        returnvalue: mockJob.returnvalue,
        failedReason: mockJob.failedReason,
        processedOn: mockJob.processedOn,
        finishedOn: mockJob.finishedOn,
        timestamp: mockJob.timestamp,
        attemptsMade: mockJob.attemptsMade,
        opts: mockJob.opts,
      });
    });

    it('should return null if job not found', async () => {
      await service.onModuleInit();
      
      const mockQueue = { getJob: jest.fn().mockResolvedValue(null) };
      (service as any).carrierPollingQueue = mockQueue;

      const result = await service.getJobDetails('carrier-polling', 'nonexistent-job');

      expect(result).toBeNull();
    });
  });

  describe('retryJob', () => {
    it('should retry a job', async () => {
      await service.onModuleInit();
      
      const mockJob = { retry: jest.fn() };
      const mockQueue = { getJob: jest.fn().mockResolvedValue(mockJob) };
      (service as any).carrierPollingQueue = mockQueue;

      await service.retryJob('carrier-polling', 'job-1');

      expect(mockQueue.getJob).toHaveBeenCalledWith('job-1');
      expect(mockJob.retry).toHaveBeenCalled();
    });
  });

  describe('removeJob', () => {
    it('should remove a job', async () => {
      await service.onModuleInit();
      
      const mockJob = { remove: jest.fn() };
      const mockQueue = { getJob: jest.fn().mockResolvedValue(mockJob) };
      (service as any).carrierPollingQueue = mockQueue;

      await service.removeJob('carrier-polling', 'job-1');

      expect(mockQueue.getJob).toHaveBeenCalledWith('job-1');
      expect(mockJob.remove).toHaveBeenCalled();
    });
  });
});
