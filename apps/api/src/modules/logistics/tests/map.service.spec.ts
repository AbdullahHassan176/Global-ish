import { Test, TestingModule } from '@nestjs/testing';
import { MapService } from '../services/map.service';
import { PrismaService } from '../../../common/prisma/prisma.service';

describe('MapService', () => {
  let service: MapService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    shipment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MapService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MapService>(MapService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getActiveShipmentLocations', () => {
    it('should return active shipment locations', async () => {
      const mockShipments = [
        {
          id: 'shipment-1',
          shipmentNumber: 'SHIP001',
          containerNumber: 'MSKU1234567',
          status: 'IN_TRANSIT',
          carrier: 'MAERSK',
          destination: 'Los Angeles',
          vesselName: 'MAERSK SHANGHAI',
          voyageNumber: '001E',
          eta: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-10'),
          containers: [],
          milestones: [],
          carrierEvents: [],
        },
      ];

      mockPrismaService.shipment.findMany.mockResolvedValue(mockShipments);

      const result = await service.getActiveShipmentLocations();

      expect(mockPrismaService.shipment.findMany).toHaveBeenCalledWith({
        where: {
          status: {
            in: ['PLANNED', 'IN_TRANSIT', 'CUSTOMS'],
          },
        },
        include: {
          containers: true,
          milestones: {
            where: {
              milestoneType: {
                in: ['ARRIVAL', 'CUSTOMS', 'DELIVERY'],
              },
            },
            orderBy: {
              plannedDate: 'desc',
            },
            take: 1,
          },
          carrierEvents: {
            orderBy: {
              eventDate: 'desc',
            },
            take: 1,
          },
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0].shipmentNumber).toBe('SHIP001');
      expect(result[0].latitude).toBe(34.0522); // Los Angeles coordinates
      expect(result[0].longitude).toBe(-118.2437);
    });
  });

  describe('searchShipments', () => {
    it('should search shipments by container number', async () => {
      const mockShipments = [
        {
          id: 'shipment-1',
          shipmentNumber: 'SHIP001',
          containerNumber: 'MSKU1234567',
          status: 'IN_TRANSIT',
          carrier: 'MAERSK',
          destination: 'Los Angeles',
          updatedAt: new Date('2024-01-10'),
          containers: [],
          milestones: [],
          carrierEvents: [],
          invoices: [],
        },
      ];

      mockPrismaService.shipment.findMany.mockResolvedValue(mockShipments);

      const result = await service.searchShipments('MSKU1234567');

      expect(mockPrismaService.shipment.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { containerNumber: { contains: 'MSKU1234567', mode: 'insensitive' } },
            { billOfLading: { contains: 'MSKU1234567', mode: 'insensitive' } },
            { bookingNumber: { contains: 'MSKU1234567', mode: 'insensitive' } },
            { shipmentNumber: { contains: 'MSKU1234567', mode: 'insensitive' } },
          ],
          status: {
            in: ['PLANNED', 'IN_TRANSIT', 'CUSTOMS'],
          },
        },
        include: expect.any(Object),
        take: 50,
      });

      expect(result.shipments).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.bounds).toBeDefined();
    });

    it('should search shipments with bounds', async () => {
      const bounds = {
        north: 35,
        south: 33,
        east: -117,
        west: -119,
      };

      mockPrismaService.shipment.findMany.mockResolvedValue([]);

      const result = await service.searchShipments('SHIP001', bounds, 10);

      expect(result.bounds).toEqual(bounds);
    });
  });

  describe('getShipmentsInBounds', () => {
    it('should filter shipments by geographic bounds', async () => {
      const mockLocations = [
        {
          id: 'shipment-1',
          shipmentNumber: 'SHIP001',
          latitude: 34.0522, // Los Angeles
          longitude: -118.2437,
          location: 'Los Angeles',
          status: 'IN_TRANSIT',
          carrier: 'MAERSK',
          lastUpdated: new Date(),
        },
        {
          id: 'shipment-2',
          shipmentNumber: 'SHIP002',
          latitude: 31.2304, // Shanghai
          longitude: 121.4737,
          location: 'Shanghai',
          status: 'IN_TRANSIT',
          carrier: 'MSC',
          lastUpdated: new Date(),
        },
      ];

      // Mock getActiveShipmentLocations
      jest.spyOn(service, 'getActiveShipmentLocations').mockResolvedValue(mockLocations);

      const bounds = {
        north: 35,
        south: 33,
        east: -117,
        west: -119,
      };

      const result = await service.getShipmentsInBounds(bounds);

      expect(result).toHaveLength(1);
      expect(result[0].shipmentNumber).toBe('SHIP001');
    });
  });

  describe('getShipmentTrackingHistory', () => {
    it('should return tracking history for a shipment', async () => {
      const mockShipment = {
        id: 'shipment-1',
        origin: 'Shanghai',
        destination: 'Los Angeles',
        createdAt: new Date('2024-01-01'),
        eta: new Date('2024-01-15'),
        carrierEvents: [
          {
            location: 'Pacific Ocean',
            eventDate: new Date('2024-01-05'),
            eventType: 'IN_TRANSIT',
            description: 'Vessel in transit',
          },
        ],
        milestones: [],
      };

      mockPrismaService.shipment.findUnique.mockResolvedValue(mockShipment);

      const result = await service.getShipmentTrackingHistory('shipment-1');

      expect(result).toHaveLength(3); // origin, carrier event, destination
      expect(result[0].eventType).toBe('ORIGIN');
      expect(result[0].location).toBe('Shanghai');
      expect(result[1].eventType).toBe('IN_TRANSIT');
      expect(result[1].location).toBe('Pacific Ocean');
      expect(result[2].eventType).toBe('DESTINATION');
      expect(result[2].location).toBe('Los Angeles');
    });

    it('should return empty array for non-existent shipment', async () => {
      mockPrismaService.shipment.findUnique.mockResolvedValue(null);

      const result = await service.getShipmentTrackingHistory('non-existent');

      expect(result).toHaveLength(0);
    });
  });

  describe('getMapStatistics', () => {
    it('should return map statistics', async () => {
      const mockActiveShipments = [
        { status: 'IN_TRANSIT', carrier: 'MAERSK' },
        { status: 'IN_TRANSIT', carrier: 'MSC' },
        { status: 'CUSTOMS', carrier: 'MAERSK' },
      ];

      const mockCompletedShipments = [
        {
          actualDeparture: new Date('2024-01-01'),
          actualArrival: new Date('2024-01-15'),
        },
        {
          actualDeparture: new Date('2024-01-02'),
          actualArrival: new Date('2024-01-16'),
        },
      ];

      mockPrismaService.shipment.findMany
        .mockResolvedValueOnce(mockActiveShipments) // Active shipments
        .mockResolvedValueOnce(mockCompletedShipments); // Completed shipments

      const result = await service.getMapStatistics();

      expect(result.totalActiveShipments).toBe(3);
      expect(result.shipmentsByStatus).toEqual({
        'IN_TRANSIT': 2,
        'CUSTOMS': 1,
      });
      expect(result.shipmentsByCarrier).toEqual({
        'MAERSK': 2,
        'MSC': 1,
      });
      expect(result.averageTransitTime).toBe(14); // 14 days average
    });
  });

  describe('getLocationCoordinates', () => {
    it('should return coordinates for known locations', () => {
      const service = new MapService(prismaService);
      
      // Access private method for testing
      const getLocationCoordinates = (service as any).getLocationCoordinates.bind(service);
      
      const shanghaiCoords = getLocationCoordinates('Shanghai');
      expect(shanghaiCoords).toEqual({ latitude: 31.2304, longitude: 121.4737 });

      const laCoords = getLocationCoordinates('Los Angeles');
      expect(laCoords).toEqual({ latitude: 34.0522, longitude: -118.2437 });
    });

    it('should return null for unknown locations', () => {
      const service = new MapService(prismaService);
      const getLocationCoordinates = (service as any).getLocationCoordinates.bind(service);
      
      const unknownCoords = getLocationCoordinates('Unknown City');
      expect(unknownCoords).toBeNull();
    });

    it('should handle partial matches', () => {
      const service = new MapService(prismaService);
      const getLocationCoordinates = (service as any).getLocationCoordinates.bind(service);
      
      const partialMatch = getLocationCoordinates('Port of Los Angeles');
      expect(partialMatch).toEqual({ latitude: 34.0522, longitude: -118.2437 });
    });
  });
});
