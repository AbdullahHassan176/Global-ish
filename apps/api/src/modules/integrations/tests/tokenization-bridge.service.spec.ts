import { Test, TestingModule } from '@nestjs/testing';
import { TokenizationBridgeService } from '../services/tokenization-bridge.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { WebhookService } from '../services/webhook.service';
import { TokenizationEventType, KPIType } from '@prisma/client';

describe('TokenizationBridgeService', () => {
  let service: TokenizationBridgeService;
  let prismaService: PrismaService;
  let webhookService: WebhookService;

  const mockPrismaService = {
    tokenizationEvent: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    tokenizationKPI: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    webhookEndpoint: {
      findMany: jest.fn(),
    },
  };

  const mockWebhookService = {
    deliverWebhook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenizationBridgeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: WebhookService,
          useValue: mockWebhookService,
        },
      ],
    }).compile();

    service = module.get<TokenizationBridgeService>(TokenizationBridgeService);
    prismaService = module.get<PrismaService>(PrismaService);
    webhookService = module.get<WebhookService>(WebhookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTokenizationEvent', () => {
    it('should create a new tokenization event', async () => {
      const createDto = {
        eventType: TokenizationEventType.SHIPMENT_CREATED,
        entityId: 'shipment-1',
        entityType: 'shipment',
        sanitizedData: {
          id: 'shipment-1',
          carrier: 'Carrier_A',
          status: 'IN_TRANSIT',
        },
      };

      const mockTokenizationEvent = {
        id: 'event-1',
        ...createDto,
        originalData: null,
        isPublished: false,
        publishedAt: null,
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'sanitizeData').mockResolvedValue(createDto.sanitizedData);
      mockPrismaService.tokenizationEvent.create.mockResolvedValue(mockTokenizationEvent);

      const result = await service.createTokenizationEvent(createDto, 'user-1');

      expect(service.sanitizeData).toHaveBeenCalledWith(createDto.sanitizedData, createDto.entityType, 'investor');
      expect(mockPrismaService.tokenizationEvent.create).toHaveBeenCalledWith({
        data: {
          eventType: createDto.eventType,
          entityId: createDto.entityId,
          entityType: createDto.entityType,
          sanitizedData: createDto.sanitizedData,
          originalData: null,
          createdBy: 'user-1',
        },
      });
      expect(result).toEqual(mockTokenizationEvent);
    });
  });

  describe('findAllTokenizationEvents', () => {
    it('should return all tokenization events with filters', async () => {
      const query = {
        eventType: TokenizationEventType.SHIPMENT_CREATED,
        entityType: 'shipment',
        isPublished: true,
        limit: 10,
        offset: 0,
      };

      const mockEvents = [
        {
          id: 'event-1',
          eventType: TokenizationEventType.SHIPMENT_CREATED,
          entityId: 'shipment-1',
          entityType: 'shipment',
          sanitizedData: { carrier: 'Carrier_A' },
          isPublished: true,
        },
        {
          id: 'event-2',
          eventType: TokenizationEventType.SHIPMENT_CREATED,
          entityId: 'shipment-2',
          entityType: 'shipment',
          sanitizedData: { carrier: 'Carrier_B' },
          isPublished: true,
        },
      ];

      mockPrismaService.tokenizationEvent.findMany.mockResolvedValue(mockEvents);

      const result = await service.findAllTokenizationEvents(query);

      expect(mockPrismaService.tokenizationEvent.findMany).toHaveBeenCalledWith({
        where: {
          eventType: query.eventType,
          entityType: query.entityType,
          isPublished: query.isPublished,
        },
        orderBy: { createdAt: 'desc' },
        take: query.limit,
        skip: query.offset,
      });
      expect(result).toEqual(mockEvents);
    });
  });

  describe('findTokenizationEventById', () => {
    it('should return a tokenization event by ID', async () => {
      const mockEvent = {
        id: 'event-1',
        eventType: TokenizationEventType.SHIPMENT_CREATED,
        entityId: 'shipment-1',
        entityType: 'shipment',
        sanitizedData: { carrier: 'Carrier_A' },
      };

      mockPrismaService.tokenizationEvent.findUnique.mockResolvedValue(mockEvent);

      const result = await service.findTokenizationEventById('event-1');

      expect(mockPrismaService.tokenizationEvent.findUnique).toHaveBeenCalledWith({
        where: { id: 'event-1' },
      });
      expect(result).toEqual(mockEvent);
    });

    it('should throw error if event not found', async () => {
      mockPrismaService.tokenizationEvent.findUnique.mockResolvedValue(null);

      await expect(service.findTokenizationEventById('nonexistent')).rejects.toThrow(
        'Tokenization event with ID nonexistent not found'
      );
    });
  });

  describe('updateTokenizationEvent', () => {
    it('should update a tokenization event', async () => {
      const existingEvent = {
        id: 'event-1',
        eventType: TokenizationEventType.SHIPMENT_CREATED,
        entityId: 'shipment-1',
        entityType: 'shipment',
        isPublished: false,
      };

      const updateDto = {
        isPublished: true,
        publishedAt: new Date('2024-01-20T15:30:00Z'),
      };

      const updatedEvent = {
        ...existingEvent,
        ...updateDto,
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'findTokenizationEventById').mockResolvedValue(existingEvent as any);
      mockPrismaService.tokenizationEvent.update.mockResolvedValue(updatedEvent);

      const result = await service.updateTokenizationEvent('event-1', updateDto);

      expect(service.findTokenizationEventById).toHaveBeenCalledWith('event-1');
      expect(mockPrismaService.tokenizationEvent.update).toHaveBeenCalledWith({
        where: { id: 'event-1' },
        data: updateDto,
      });
      expect(result).toEqual(updatedEvent);
    });
  });

  describe('deleteTokenizationEvent', () => {
    it('should delete a tokenization event', async () => {
      const mockEvent = {
        id: 'event-1',
        eventType: TokenizationEventType.SHIPMENT_CREATED,
      };

      jest.spyOn(service, 'findTokenizationEventById').mockResolvedValue(mockEvent as any);
      mockPrismaService.tokenizationEvent.delete.mockResolvedValue(mockEvent);

      await service.deleteTokenizationEvent('event-1');

      expect(service.findTokenizationEventById).toHaveBeenCalledWith('event-1');
      expect(mockPrismaService.tokenizationEvent.delete).toHaveBeenCalledWith({
        where: { id: 'event-1' },
      });
    });
  });

  describe('createTokenizationKPI', () => {
    it('should create a new tokenization KPI', async () => {
      const createDto = {
        kpiType: KPIType.SHIPMENT_VOLUME,
        period: '2024-01',
        value: 1000,
        metadata: { region: 'North America' },
      };

      const mockKPI = {
        id: 'kpi-1',
        ...createDto,
        isPublished: false,
        publishedAt: null,
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.tokenizationKPI.create.mockResolvedValue(mockKPI);

      const result = await service.createTokenizationKPI(createDto, 'user-1');

      expect(mockPrismaService.tokenizationKPI.create).toHaveBeenCalledWith({
        data: {
          kpiType: createDto.kpiType,
          period: createDto.period,
          value: createDto.value,
          metadata: createDto.metadata,
          createdBy: 'user-1',
        },
      });
      expect(result).toEqual(mockKPI);
    });
  });

  describe('findAllTokenizationKPIs', () => {
    it('should return all tokenization KPIs with filters', async () => {
      const query = {
        kpiType: KPIType.SHIPMENT_VOLUME,
        period: '2024-01',
        isPublished: true,
        limit: 10,
        offset: 0,
      };

      const mockKPIs = [
        {
          id: 'kpi-1',
          kpiType: KPIType.SHIPMENT_VOLUME,
          period: '2024-01',
          value: 1000,
          isPublished: true,
        },
        {
          id: 'kpi-2',
          kpiType: KPIType.SHIPMENT_VOLUME,
          period: '2024-02',
          value: 1200,
          isPublished: true,
        },
      ];

      mockPrismaService.tokenizationKPI.findMany.mockResolvedValue(mockKPIs);

      const result = await service.findAllTokenizationKPIs(query);

      expect(mockPrismaService.tokenizationKPI.findMany).toHaveBeenCalledWith({
        where: {
          kpiType: query.kpiType,
          period: query.period,
          isPublished: query.isPublished,
        },
        orderBy: { createdAt: 'desc' },
        take: query.limit,
        skip: query.offset,
      });
      expect(result).toEqual(mockKPIs);
    });
  });

  describe('publishEvent', () => {
    it('should publish an event and deliver to webhooks', async () => {
      const event = {
        eventType: TokenizationEventType.SHIPMENT_CREATED,
        entityId: 'shipment-1',
        entityType: 'shipment',
        sanitizedData: { carrier: 'Carrier_A' },
      };

      const mockTokenizationEvent = {
        id: 'event-1',
        ...event,
        originalData: null,
        isPublished: true,
        publishedAt: new Date(),
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockWebhookEndpoints = [
        { id: 'webhook-1', isActive: true, events: ['shipment.created'] },
        { id: 'webhook-2', isActive: true, events: ['shipment.created'] },
      ];

      jest.spyOn(service, 'sanitizeData').mockResolvedValue(event.sanitizedData);
      mockPrismaService.tokenizationEvent.create.mockResolvedValue(mockTokenizationEvent);
      mockPrismaService.webhookEndpoint.findMany.mockResolvedValue(mockWebhookEndpoints);
      mockWebhookService.deliverWebhook.mockResolvedValue({ status: 'DELIVERED' });

      const result = await service.publishEvent(event);

      expect(service.sanitizeData).toHaveBeenCalledWith(event.sanitizedData, event.entityType, 'investor');
      expect(mockPrismaService.tokenizationEvent.create).toHaveBeenCalledWith({
        data: {
          eventType: event.eventType,
          entityId: event.entityId,
          entityType: event.entityType,
          sanitizedData: event.sanitizedData,
          originalData: null,
          isPublished: true,
          publishedAt: expect.any(Date),
          createdBy: 'system',
        },
      });
      expect(mockWebhookService.deliverWebhook).toHaveBeenCalledTimes(2);
      expect(result).toBe('event-1');
    });
  });

  describe('publishKPI', () => {
    it('should publish a KPI and deliver to webhooks', async () => {
      const kpi = {
        kpiType: KPIType.SHIPMENT_VOLUME,
        period: '2024-01',
        value: 1000,
        metadata: { region: 'North America' },
      };

      const mockTokenizationKPI = {
        id: 'kpi-1',
        ...kpi,
        isPublished: true,
        publishedAt: new Date(),
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockWebhookEndpoints = [
        { id: 'webhook-1', isActive: true, events: ['KPI_UPDATED'] },
      ];

      mockPrismaService.tokenizationKPI.create.mockResolvedValue(mockTokenizationKPI);
      mockPrismaService.webhookEndpoint.findMany.mockResolvedValue(mockWebhookEndpoints);
      mockWebhookService.deliverWebhook.mockResolvedValue({ status: 'DELIVERED' });

      const result = await service.publishKPI(kpi);

      expect(mockPrismaService.tokenizationKPI.create).toHaveBeenCalledWith({
        data: {
          kpiType: kpi.kpiType,
          period: kpi.period,
          value: kpi.value,
          metadata: kpi.metadata,
          isPublished: true,
          publishedAt: expect.any(Date),
          createdBy: 'system',
        },
      });
      expect(mockWebhookService.deliverWebhook).toHaveBeenCalledWith('webhook-1', {
        eventId: 'kpi-1',
        eventType: 'KPI_UPDATED',
        entityId: 'kpi-1',
        entityType: 'kpi',
        data: {
          kpiType: kpi.kpiType,
          period: kpi.period,
          value: kpi.value,
          metadata: kpi.metadata,
        },
        timestamp: expect.any(Date),
      });
      expect(result).toBe('kpi-1');
    });
  });

  describe('sanitizeData', () => {
    it('should sanitize data for investor safety', async () => {
      const data = {
        id: 'shipment-1',
        carrier: 'Maersk',
        origin: 'Shanghai, China',
        destination: 'Rotterdam, Netherlands',
        clientName: 'Acme Corp',
        clientEmail: 'contact@acme.com',
      };

      const expectedSanitized = {
        id: 'shipment-1',
        carrier: 'Carrier_A',
        originCountry: 'Region_A',
        destinationCountry: 'Region_B',
        clientName: 'Client_abc123',
        clientEmail: 'co***@acme.com',
      };

      const result = await service.sanitizeData(data, 'shipment');

      expect(result).toEqual(expectedSanitized);
    });
  });

  describe('generateSignature', () => {
    it('should generate HMAC signature for bridge events', () => {
      const payload = {
        eventId: 'event-1',
        eventType: 'shipment.created',
        entityId: 'shipment-1',
        data: { carrier: 'Carrier_A' },
      };

      const signature = service.generateSignature(payload);

      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature.length).toBeGreaterThan(0);
    });
  });

  describe('validateSignature', () => {
    it('should validate HMAC signature for bridge events', () => {
      const payload = {
        eventId: 'event-1',
        eventType: 'shipment.created',
        entityId: 'shipment-1',
        data: { carrier: 'Carrier_A' },
      };

      const signature = service.generateSignature(payload);
      const isValid = service.validateSignature(payload, signature);

      expect(isValid).toBe(true);
    });

    it('should reject invalid signature', () => {
      const payload = {
        eventId: 'event-1',
        eventType: 'shipment.created',
        entityId: 'shipment-1',
        data: { carrier: 'Carrier_A' },
      };

      const invalidSignature = 'invalid-signature';
      const isValid = service.validateSignature(payload, invalidSignature);

      expect(isValid).toBe(false);
    });
  });
});
