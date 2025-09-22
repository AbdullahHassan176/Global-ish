import { Test, TestingModule } from '@nestjs/testing';
import { CarrierIntegrationService } from '../services/carrier-integration.service';
import { CarrierAdapterFactory } from '../adapters/carrier-adapter.factory';
import { PrismaService } from '../../../common/prisma/prisma.service';

describe('CarrierIntegrationService', () => {
  let service: CarrierIntegrationService;
  let prismaService: PrismaService;
  let carrierAdapterFactory: CarrierAdapterFactory;

  const mockPrismaService = {
    carrierIntegration: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCarrierAdapterFactory = {
    getAdapter: jest.fn(),
    getSupportedCarriers: jest.fn(),
    getCarrierDisplayName: jest.fn(),
    getCarrierType: jest.fn(),
  };

  const mockAdapter = {
    validateCredentials: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarrierIntegrationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CarrierAdapterFactory,
          useValue: mockCarrierAdapterFactory,
        },
      ],
    }).compile();

    service = module.get<CarrierIntegrationService>(CarrierIntegrationService);
    prismaService = module.get<PrismaService>(PrismaService);
    carrierAdapterFactory = module.get<CarrierAdapterFactory>(CarrierAdapterFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createIntegration', () => {
    it('should create integration with valid credentials', async () => {
      const createDto = {
        carrier: 'MAERSK',
        enabled: true,
        credentials: { apiKey: 'test-key' },
        pollingInterval: 60,
        webhookEnabled: true,
        rateLimitPerMinute: 100,
      };

      const mockIntegration = {
        id: 'integration-1',
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCarrierAdapterFactory.getAdapter.mockReturnValue(mockAdapter);
      mockAdapter.validateCredentials.mockResolvedValue(true);
      mockPrismaService.carrierIntegration.create.mockResolvedValue(mockIntegration);

      const result = await service.createIntegration(createDto);

      expect(mockCarrierAdapterFactory.getAdapter).toHaveBeenCalledWith('MAERSK');
      expect(mockAdapter.validateCredentials).toHaveBeenCalledWith({ apiKey: 'test-key' });
      expect(mockPrismaService.carrierIntegration.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(result).toEqual(mockIntegration);
    });

    it('should throw error for invalid credentials', async () => {
      const createDto = {
        carrier: 'MAERSK',
        enabled: true,
        credentials: { apiKey: 'invalid-key' },
        pollingInterval: 60,
        webhookEnabled: true,
        rateLimitPerMinute: 100,
      };

      mockCarrierAdapterFactory.getAdapter.mockReturnValue(mockAdapter);
      mockAdapter.validateCredentials.mockResolvedValue(false);

      await expect(service.createIntegration(createDto)).rejects.toThrow(
        'Invalid credentials for carrier: MAERSK'
      );
    });
  });

  describe('findIntegrationByCarrier', () => {
    it('should return integration for enabled carrier', async () => {
      const mockIntegration = {
        id: 'integration-1',
        carrier: 'MAERSK',
        enabled: true,
        credentials: { apiKey: 'test-key' },
      };

      mockPrismaService.carrierIntegration.findFirst.mockResolvedValue(mockIntegration);

      const result = await service.findIntegrationByCarrier('MAERSK');

      expect(mockPrismaService.carrierIntegration.findFirst).toHaveBeenCalledWith({
        where: { carrier: 'MAERSK', enabled: true },
      });
      expect(result).toEqual(mockIntegration);
    });

    it('should return null if no integration found', async () => {
      mockPrismaService.carrierIntegration.findFirst.mockResolvedValue(null);

      const result = await service.findIntegrationByCarrier('MAERSK');

      expect(result).toBeNull();
    });
  });

  describe('testIntegration', () => {
    it('should return success for valid integration', async () => {
      const mockIntegration = {
        id: 'integration-1',
        carrier: 'MAERSK',
        enabled: true,
        credentials: { apiKey: 'test-key' },
      };

      mockPrismaService.carrierIntegration.findFirst.mockResolvedValue(mockIntegration);
      mockCarrierAdapterFactory.getAdapter.mockReturnValue(mockAdapter);
      mockAdapter.validateCredentials.mockResolvedValue(true);

      const result = await service.testIntegration('MAERSK');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Integration for MAERSK is working correctly');
    });

    it('should return failure for invalid credentials', async () => {
      const mockIntegration = {
        id: 'integration-1',
        carrier: 'MAERSK',
        enabled: true,
        credentials: { apiKey: 'invalid-key' },
      };

      mockPrismaService.carrierIntegration.findFirst.mockResolvedValue(mockIntegration);
      mockCarrierAdapterFactory.getAdapter.mockReturnValue(mockAdapter);
      mockAdapter.validateCredentials.mockResolvedValue(false);

      const result = await service.testIntegration('MAERSK');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid credentials for carrier: MAERSK');
    });

    it('should return failure if no integration found', async () => {
      mockPrismaService.carrierIntegration.findFirst.mockResolvedValue(null);

      const result = await service.testIntegration('MAERSK');

      expect(result.success).toBe(false);
      expect(result.message).toBe('No integration found for carrier: MAERSK');
    });
  });

  describe('getSupportedCarriers', () => {
    it('should return supported carriers with display names and types', async () => {
      const mockSupportedCarriers = ['MAERSK', 'MSC', 'DHL', 'FEDEX'];
      
      mockCarrierAdapterFactory.getSupportedCarriers.mockReturnValue(mockSupportedCarriers);
      mockCarrierAdapterFactory.getCarrierDisplayName
        .mockReturnValueOnce('Maersk Line')
        .mockReturnValueOnce('Mediterranean Shipping Company')
        .mockReturnValueOnce('DHL Express')
        .mockReturnValueOnce('FedEx');
      mockCarrierAdapterFactory.getCarrierType
        .mockReturnValueOnce('OCEAN')
        .mockReturnValueOnce('OCEAN')
        .mockReturnValueOnce('EXPRESS')
        .mockReturnValueOnce('EXPRESS');

      const result = await service.getSupportedCarriers();

      expect(result).toEqual([
        { carrier: 'MAERSK', displayName: 'Maersk Line', type: 'OCEAN' },
        { carrier: 'MSC', displayName: 'Mediterranean Shipping Company', type: 'OCEAN' },
        { carrier: 'DHL', displayName: 'DHL Express', type: 'EXPRESS' },
        { carrier: 'FEDEX', displayName: 'FedEx', type: 'EXPRESS' },
      ]);
    });
  });

  describe('getIntegrationStatus', () => {
    it('should return integration status for all supported carriers', async () => {
      const mockSupportedCarriers = ['MAERSK', 'MSC'];
      const mockIntegrations = [
        {
          carrier: 'MAERSK',
          enabled: true,
          updatedAt: new Date('2024-01-01'),
        },
      ];

      mockCarrierAdapterFactory.getSupportedCarriers.mockReturnValue(mockSupportedCarriers);
      mockPrismaService.carrierIntegration.findMany.mockResolvedValue(mockIntegrations);

      const result = await service.getIntegrationStatus();

      expect(result).toEqual([
        {
          carrier: 'MAERSK',
          configured: true,
          enabled: true,
          lastTested: new Date('2024-01-01'),
        },
        {
          carrier: 'MSC',
          configured: false,
          enabled: false,
          lastTested: undefined,
        },
      ]);
    });
  });

  describe('enableIntegration', () => {
    it('should enable integration after successful test', async () => {
      const mockIntegration = {
        id: 'integration-1',
        carrier: 'MAERSK',
        enabled: false,
        credentials: { apiKey: 'test-key' },
      };

      const mockUpdatedIntegration = {
        ...mockIntegration,
        enabled: true,
      };

      mockPrismaService.carrierIntegration.findUnique.mockResolvedValue(mockIntegration);
      mockCarrierAdapterFactory.getAdapter.mockReturnValue(mockAdapter);
      mockAdapter.validateCredentials.mockResolvedValue(true);
      mockPrismaService.carrierIntegration.update.mockResolvedValue(mockUpdatedIntegration);

      const result = await service.enableIntegration('integration-1');

      expect(mockPrismaService.carrierIntegration.update).toHaveBeenCalledWith({
        where: { id: 'integration-1' },
        data: { enabled: true },
      });
      expect(result).toEqual(mockUpdatedIntegration);
    });

    it('should throw error if test fails', async () => {
      const mockIntegration = {
        id: 'integration-1',
        carrier: 'MAERSK',
        enabled: false,
        credentials: { apiKey: 'invalid-key' },
      };

      mockPrismaService.carrierIntegration.findUnique.mockResolvedValue(mockIntegration);
      mockCarrierAdapterFactory.getAdapter.mockReturnValue(mockAdapter);
      mockAdapter.validateCredentials.mockResolvedValue(false);

      await expect(service.enableIntegration('integration-1')).rejects.toThrow(
        'Cannot enable integration: Invalid credentials for carrier: MAERSK'
      );
    });
  });

  describe('disableIntegration', () => {
    it('should disable integration', async () => {
      const mockIntegration = {
        id: 'integration-1',
        carrier: 'MAERSK',
        enabled: true,
      };

      const mockUpdatedIntegration = {
        ...mockIntegration,
        enabled: false,
      };

      mockPrismaService.carrierIntegration.findUnique.mockResolvedValue(mockIntegration);
      mockPrismaService.carrierIntegration.update.mockResolvedValue(mockUpdatedIntegration);

      const result = await service.disableIntegration('integration-1');

      expect(mockPrismaService.carrierIntegration.update).toHaveBeenCalledWith({
        where: { id: 'integration-1' },
        data: { enabled: false },
      });
      expect(result).toEqual(mockUpdatedIntegration);
    });
  });

  describe('getIntegrationMetrics', () => {
    it('should return integration metrics', async () => {
      const mockIntegrations = [
        { carrier: 'MAERSK', enabled: true },
        { carrier: 'MSC', enabled: false },
        { carrier: 'DHL', enabled: true },
      ];

      const mockSupportedCarriers = ['MAERSK', 'MSC', 'DHL', 'FEDEX'];

      mockPrismaService.carrierIntegration.findMany.mockResolvedValue(mockIntegrations);
      mockCarrierAdapterFactory.getSupportedCarriers.mockReturnValue(mockSupportedCarriers);
      mockCarrierAdapterFactory.getCarrierType
        .mockReturnValueOnce('OCEAN')
        .mockReturnValueOnce('OCEAN')
        .mockReturnValueOnce('EXPRESS');

      const result = await service.getIntegrationMetrics();

      expect(result.totalIntegrations).toBe(3);
      expect(result.enabledIntegrations).toBe(2);
      expect(result.oceanCarriers).toBe(2);
      expect(result.expressCarriers).toBe(1);
    });
  });
});
