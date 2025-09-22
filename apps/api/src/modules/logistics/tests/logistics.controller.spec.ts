import { Test, TestingModule } from '@nestjs/testing';
import { LogisticsController } from '../controllers/logistics.controller';
import { LogisticsService } from '../services/logistics.service';
import { CarrierAdapterFactory } from '../adapters/carrier-adapter.factory';
import { PrismaService } from '../../../prisma/prisma.service';
import { Carrier, ShipmentStatus } from '@prisma/client';

describe('LogisticsController', () => {
  let controller: LogisticsController;
  let service: LogisticsService;

  const mockPrismaService = {
    shipment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    container: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    carrierEvent: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCarrierAdapterFactory = {
    getAdapter: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogisticsController],
      providers: [
        {
          provide: LogisticsService,
          useValue: {
            createShipment: jest.fn(),
            findAllShipments: jest.fn(),
            findShipmentById: jest.fn(),
            updateShipment: jest.fn(),
            deleteShipment: jest.fn(),
            trackShipment: jest.fn(),
            createContainer: jest.fn(),
            findAllContainers: jest.fn(),
            findContainerById: jest.fn(),
            updateContainer: jest.fn(),
            deleteContainer: jest.fn(),
            createCarrierEvent: jest.fn(),
            findAllCarrierEvents: jest.fn(),
            findCarrierEventById: jest.fn(),
            updateCarrierEvent: jest.fn(),
            deleteCarrierEvent: jest.fn(),
            getLiveContainerPositions: jest.fn(),
          },
        },
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

    controller = module.get<LogisticsController>(LogisticsController);
    service = module.get<LogisticsService>(LogisticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createShipment', () => {
    it('should create a shipment', async () => {
      const createShipmentDto = {
        shipmentNumber: 'MAEU1234567',
        carrier: Carrier.MAERSK,
        origin: 'Shanghai',
        destination: 'Rotterdam',
        etd: new Date('2024-01-10'),
        eta: new Date('2024-02-10'),
      };

      const mockUser = { id: 'user-1', email: 'test@example.com' };
      const mockShipment = {
        id: 'shipment-1',
        ...createShipmentDto,
        status: ShipmentStatus.PLANNED,
        createdBy: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'createShipment').mockResolvedValue(mockShipment as any);

      const result = await controller.createShipment(createShipmentDto, mockUser as any);

      expect(service.createShipment).toHaveBeenCalledWith(createShipmentDto, mockUser.id);
      expect(result).toEqual(mockShipment);
    });
  });

  describe('findAllShipments', () => {
    it('should return all shipments', async () => {
      const mockShipments = [
        {
          id: 'shipment-1',
          shipmentNumber: 'MAEU1234567',
          carrier: Carrier.MAERSK,
          status: ShipmentStatus.IN_TRANSIT,
          origin: 'Shanghai',
          destination: 'Rotterdam',
        },
        {
          id: 'shipment-2',
          shipmentNumber: 'MSCU2345678',
          carrier: Carrier.MSC,
          status: ShipmentStatus.AT_ORIGIN,
          origin: 'Hamburg',
          destination: 'New York',
        },
      ];

      jest.spyOn(service, 'findAllShipments').mockResolvedValue(mockShipments as any);

      const result = await controller.findAllShipments();

      expect(service.findAllShipments).toHaveBeenCalled();
      expect(result).toEqual(mockShipments);
    });
  });

  describe('findOneShipment', () => {
    it('should return a shipment by id', async () => {
      const shipmentId = 'shipment-1';
      const mockShipment = {
        id: shipmentId,
        shipmentNumber: 'MAEU1234567',
        carrier: Carrier.MAERSK,
        status: ShipmentStatus.IN_TRANSIT,
        origin: 'Shanghai',
        destination: 'Rotterdam',
      };

      jest.spyOn(service, 'findShipmentById').mockResolvedValue(mockShipment as any);

      const result = await controller.findOneShipment(shipmentId);

      expect(service.findShipmentById).toHaveBeenCalledWith(shipmentId);
      expect(result).toEqual(mockShipment);
    });
  });

  describe('updateShipment', () => {
    it('should update a shipment', async () => {
      const shipmentId = 'shipment-1';
      const updateShipmentDto = {
        status: ShipmentStatus.IN_TRANSIT,
        actualDeparture: new Date('2024-01-12'),
      };

      const mockUpdatedShipment = {
        id: shipmentId,
        shipmentNumber: 'MAEU1234567',
        carrier: Carrier.MAERSK,
        status: ShipmentStatus.IN_TRANSIT,
        actualDeparture: new Date('2024-01-12'),
        origin: 'Shanghai',
        destination: 'Rotterdam',
      };

      jest.spyOn(service, 'updateShipment').mockResolvedValue(mockUpdatedShipment as any);

      const result = await controller.updateShipment(shipmentId, updateShipmentDto);

      expect(service.updateShipment).toHaveBeenCalledWith(shipmentId, updateShipmentDto);
      expect(result).toEqual(mockUpdatedShipment);
    });
  });

  describe('removeShipment', () => {
    it('should delete a shipment', async () => {
      const shipmentId = 'shipment-1';

      jest.spyOn(service, 'deleteShipment').mockResolvedValue(undefined);

      await controller.removeShipment(shipmentId);

      expect(service.deleteShipment).toHaveBeenCalledWith(shipmentId);
    });
  });

  describe('trackShipment', () => {
    it('should track a shipment', async () => {
      const shipmentId = 'shipment-1';
      const mockTrackedShipment = {
        id: shipmentId,
        shipmentNumber: 'MAEU1234567',
        carrier: Carrier.MAERSK,
        status: ShipmentStatus.IN_TRANSIT,
        origin: 'Shanghai',
        destination: 'Rotterdam',
        containers: [],
        carrierEvents: [],
      };

      jest.spyOn(service, 'trackShipment').mockResolvedValue(mockTrackedShipment as any);

      const result = await controller.trackShipment(shipmentId);

      expect(service.trackShipment).toHaveBeenCalledWith(shipmentId);
      expect(result).toEqual(mockTrackedShipment);
    });
  });

  describe('createContainer', () => {
    it('should create a container', async () => {
      const createContainerDto = {
        containerNumber: 'MAEU1234567',
        type: 'DRY' as any,
        size: '40HC',
        shipmentId: 'shipment-1',
        weightKg: 20000,
      };

      const mockContainer = {
        id: 'container-1',
        ...createContainerDto,
        status: 'EMPTY' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'createContainer').mockResolvedValue(mockContainer as any);

      const result = await controller.createContainer(createContainerDto);

      expect(service.createContainer).toHaveBeenCalledWith(createContainerDto);
      expect(result).toEqual(mockContainer);
    });
  });

  describe('findAllContainers', () => {
    it('should return all containers', async () => {
      const mockContainers = [
        {
          id: 'container-1',
          containerNumber: 'MAEU1234567',
          type: 'DRY' as any,
          size: '40HC',
          status: 'IN_TRANSIT' as any,
          shipmentId: 'shipment-1',
        },
        {
          id: 'container-2',
          containerNumber: 'MSCU2345678',
          type: 'REEFER' as any,
          size: '20GP',
          status: 'AT_TERMINAL' as any,
          shipmentId: 'shipment-2',
        },
      ];

      jest.spyOn(service, 'findAllContainers').mockResolvedValue(mockContainers as any);

      const result = await controller.findAllContainers();

      expect(service.findAllContainers).toHaveBeenCalled();
      expect(result).toEqual(mockContainers);
    });
  });

  describe('createCarrierEvent', () => {
    it('should create a carrier event', async () => {
      const createCarrierEventDto = {
        shipmentId: 'shipment-1',
        eventCode: 'DEPARTED',
        description: 'Departed from origin port',
        eventDate: new Date('2024-01-12T10:00:00Z'),
        location: 'Shanghai',
      };

      const mockCarrierEvent = {
        id: 'event-1',
        ...createCarrierEventDto,
        vesselName: null,
        voyageNumber: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'createCarrierEvent').mockResolvedValue(mockCarrierEvent as any);

      const result = await controller.createCarrierEvent(createCarrierEventDto);

      expect(service.createCarrierEvent).toHaveBeenCalledWith(createCarrierEventDto);
      expect(result).toEqual(mockCarrierEvent);
    });
  });

  describe('getLivePositions', () => {
    it('should return live container positions', async () => {
      const query = {
        containerNumber: 'MAEU1234567',
      };

      const mockPositions = [
        {
          id: 'container-1',
          containerNumber: 'MAEU1234567',
          lastKnownLocation: 'Indian Ocean',
          lastReportedAt: new Date(),
        },
      ];

      jest.spyOn(service, 'getLiveContainerPositions').mockResolvedValue(mockPositions as any);

      const result = await controller.getLivePositions(query);

      expect(service.getLiveContainerPositions).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockPositions);
    });
  });
});