import { Test, TestingModule } from '@nestjs/testing';
import { LogisticsService } from '../services/logistics.service';
import { CarrierAdapterFactory } from '../adapters/carrier-adapter.factory';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('LogisticsService', () => {
  let service: LogisticsService;
  let prismaService: PrismaService;
  let carrierAdapterFactory: CarrierAdapterFactory;

  const mockPrismaService = {
    shipment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    container: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    milestone: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    carrierEvent: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    costItem: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      aggregate: jest.fn(),
    },
    invoice: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      aggregate: jest.fn(),
    },
    logisticsAlert: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    carrierIntegration: {
      findFirst: jest.fn(),
    },
  };

  const mockCarrierAdapterFactory = {
    isCarrierSupported: jest.fn(),
    getAdapter: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogisticsService,
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

    service = module.get<LogisticsService>(LogisticsService);
    prismaService = module.get<PrismaService>(PrismaService);
    carrierAdapterFactory = module.get<CarrierAdapterFactory>(CarrierAdapterFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createShipment', () => {
    it('should create a shipment successfully', async () => {
      const createShipmentDto = {
        shipmentNumber: 'SHIP001',
        carrier: 'MAERSK',
        origin: 'Shanghai',
        destination: 'Los Angeles',
      };
      const userId = 'user-1';
      const expectedShipment = {
        id: 'shipment-1',
        ...createShipmentDto,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.shipment.create.mockResolvedValue(expectedShipment);

      const result = await service.createShipment(createShipmentDto, userId);

      expect(mockPrismaService.shipment.create).toHaveBeenCalledWith({
        data: {
          ...createShipmentDto,
          createdBy: userId,
        },
        include: expect.any(Object),
      });
      expect(result).toEqual(expectedShipment);
    });
  });

  describe('findShipmentById', () => {
    it('should return a shipment when found', async () => {
      const shipmentId = 'shipment-1';
      const expectedShipment = {
        id: shipmentId,
        shipmentNumber: 'SHIP001',
        carrier: 'MAERSK',
        origin: 'Shanghai',
        destination: 'Los Angeles',
      };

      mockPrismaService.shipment.findUnique.mockResolvedValue(expectedShipment);

      const result = await service.findShipmentById(shipmentId);

      expect(mockPrismaService.shipment.findUnique).toHaveBeenCalledWith({
        where: { id: shipmentId },
        include: expect.any(Object),
      });
      expect(result).toEqual(expectedShipment);
    });

    it('should throw NotFoundException when shipment not found', async () => {
      const shipmentId = 'non-existent';
      mockPrismaService.shipment.findUnique.mockResolvedValue(null);

      await expect(service.findShipmentById(shipmentId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllShipments', () => {
    it('should return all shipments with filters', async () => {
      const userId = 'user-1';
      const filters = { status: 'IN_TRANSIT', carrier: 'MAERSK' };
      const expectedShipments = [
        {
          id: 'shipment-1',
          shipmentNumber: 'SHIP001',
          status: 'IN_TRANSIT',
          carrier: 'MAERSK',
        },
      ];

      mockPrismaService.shipment.findMany.mockResolvedValue(expectedShipments);

      const result = await service.findAllShipments(userId, filters);

      expect(mockPrismaService.shipment.findMany).toHaveBeenCalledWith({
        where: {
          status: 'IN_TRANSIT',
          carrier: 'MAERSK',
        },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(expectedShipments);
    });
  });

  describe('createContainer', () => {
    it('should create a container successfully', async () => {
      const createContainerDto = {
        containerNumber: 'MSKU1234567',
        shipmentId: 'shipment-1',
        containerType: '40FT',
      };
      const expectedContainer = {
        id: 'container-1',
        ...createContainerDto,
      };

      // Mock the shipment exists check
      mockPrismaService.shipment.findUnique.mockResolvedValue({ id: 'shipment-1' });
      mockPrismaService.container.create.mockResolvedValue(expectedContainer);

      const result = await service.createContainer(createContainerDto);

      expect(mockPrismaService.container.create).toHaveBeenCalledWith({
        data: createContainerDto,
        include: expect.any(Object),
      });
      expect(result).toEqual(expectedContainer);
    });
  });

  describe('trackShipment', () => {
    it('should track shipment using carrier adapter when carrier is specified', async () => {
      const trackShipmentDto = {
        identifier: 'MSKU1234567',
        carrier: 'MAERSK',
      };
      const mockAdapter = {
        getTrackingData: jest.fn(),
      };
      const mockIntegration = {
        credentials: { apiKey: 'test-key' },
      };
      const expectedTrackingData = {
        containerNumber: 'MSKU1234567',
        status: 'IN_TRANSIT',
        location: 'Pacific Ocean',
      };

      mockCarrierAdapterFactory.isCarrierSupported.mockReturnValue(true);
      mockCarrierAdapterFactory.getAdapter.mockReturnValue(mockAdapter);
      mockPrismaService.carrierIntegration.findFirst.mockResolvedValue(mockIntegration);
      mockAdapter.getTrackingData.mockResolvedValue(expectedTrackingData);

      const result = await service.trackShipment(trackShipmentDto);

      expect(mockCarrierAdapterFactory.isCarrierSupported).toHaveBeenCalledWith('MAERSK');
      expect(mockCarrierAdapterFactory.getAdapter).toHaveBeenCalledWith('MAERSK');
      expect(mockAdapter.getTrackingData).toHaveBeenCalledWith('MSKU1234567', mockIntegration.credentials);
      expect(result).toEqual(expectedTrackingData);
    });

    it('should throw BadRequestException when carrier integration is not configured', async () => {
      const trackShipmentDto = {
        identifier: 'MSKU1234567',
        carrier: 'MAERSK',
      };

      mockCarrierAdapterFactory.isCarrierSupported.mockReturnValue(true);
      mockCarrierAdapterFactory.getAdapter.mockReturnValue({});
      mockPrismaService.carrierIntegration.findFirst.mockResolvedValue(null);

      await expect(service.trackShipment(trackShipmentDto)).rejects.toThrow(BadRequestException);
    });

    it('should return internal tracking data when shipment exists in database', async () => {
      const trackShipmentDto = {
        identifier: 'MSKU1234567',
      };
      const mockShipment = {
        id: 'shipment-1',
        containerNumber: 'MSKU1234567',
        status: 'IN_TRANSIT',
        destination: 'Los Angeles',
      };
      const mockEvents = [
        {
          id: 'event-1',
          eventType: 'DEPARTURE',
          eventDate: new Date(),
        },
      ];

      mockPrismaService.shipment.findFirst.mockResolvedValue(mockShipment);
      mockPrismaService.carrierEvent.findMany.mockResolvedValue(mockEvents);

      const result = await service.trackShipment(trackShipmentDto);

      expect(mockPrismaService.shipment.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { containerNumber: 'MSKU1234567' },
            { billOfLading: 'MSKU1234567' },
            { bookingNumber: 'MSKU1234567' },
          ],
        },
      });
      expect(result.containerNumber).toBe('MSKU1234567');
      expect(result.events).toEqual(mockEvents);
    });

    it('should throw NotFoundException when no tracking data is found', async () => {
      const trackShipmentDto = {
        identifier: 'NON_EXISTENT',
      };

      mockPrismaService.shipment.findFirst.mockResolvedValue(null);

      await expect(service.trackShipment(trackShipmentDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getShipmentStatistics', () => {
    it('should return shipment statistics', async () => {
      const userId = 'user-1';
      const mockStats = {
        totalShipments: 100,
        activeShipments: 25,
        deliveredShipments: 70,
        delayedShipments: 5,
        totalCosts: 50000,
        totalInvoices: 45000,
      };

      mockPrismaService.shipment.count
        .mockResolvedValueOnce(100) // totalShipments
        .mockResolvedValueOnce(25)  // activeShipments
        .mockResolvedValueOnce(70)  // deliveredShipments
        .mockResolvedValueOnce(5);  // delayedShipments

      mockPrismaService.costItem.aggregate.mockResolvedValue({
        _sum: { amount: 50000 },
      });

      mockPrismaService.invoice.aggregate.mockResolvedValue({
        _sum: { totalAmount: 45000 },
      });

      const result = await service.getShipmentStatistics(userId);

      expect(result).toEqual(mockStats);
    });
  });
});
