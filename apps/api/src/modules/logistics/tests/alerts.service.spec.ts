import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from '../services/alerts.service';
import { PrismaService } from '../../../common/prisma/prisma.service';

describe('AlertsService', () => {
  let service: AlertsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    shipment: {
      findMany: jest.fn(),
    },
    milestone: {
      findMany: jest.fn(),
    },
    logisticsAlert: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkDelayedShipments', () => {
    it('should create delay alerts for overdue shipments', async () => {
      const mockDelayedShipments = [
        {
          id: 'shipment-1',
          shipmentNumber: 'SHIP001',
          eta: new Date('2024-01-01'),
          status: 'IN_TRANSIT',
          createdBy: 'user-1',
          creator: { id: 'user-1', name: 'Test User', email: 'user@test.com' },
          client: { id: 'client-1', name: 'Test Client' },
          project: { id: 'project-1', name: 'Test Project' },
        },
      ];

      // Mock current date to be 5 days after ETA
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-06'));

      mockPrismaService.shipment.findMany.mockResolvedValue(mockDelayedShipments);
      mockPrismaService.logisticsAlert.findFirst.mockResolvedValue(null); // No existing alert
      mockPrismaService.logisticsAlert.create.mockResolvedValue({
        id: 'alert-1',
        shipmentId: 'shipment-1',
        alertType: 'DELAY',
        severity: 'HIGH',
        title: 'Shipment SHIP001 is delayed',
        message: 'Shipment SHIP001 is 5 days overdue. ETA was 1/1/2024.',
        assignedTo: 'user-1',
        metadata: {
          daysDelayed: 5,
          originalEta: new Date('2024-01-01'),
          currentStatus: 'IN_TRANSIT',
        },
      });

      const result = await service.checkDelayedShipments();

      expect(mockPrismaService.shipment.findMany).toHaveBeenCalledWith({
        where: {
          status: { in: ['IN_TRANSIT', 'CUSTOMS'] },
          eta: { lt: new Date('2024-01-06') },
          actualArrival: null,
        },
        include: expect.any(Object),
      });

      expect(mockPrismaService.logisticsAlert.create).toHaveBeenCalledWith({
        data: {
          shipmentId: 'shipment-1',
          alertType: 'DELAY',
          severity: 'HIGH',
          title: 'Shipment SHIP001 is delayed',
          message: 'Shipment SHIP001 is 5 days overdue. ETA was 1/1/2024.',
          assignedTo: 'user-1',
          metadata: {
            daysDelayed: 5,
            originalEta: new Date('2024-01-01'),
            currentStatus: 'IN_TRANSIT',
          },
        },
        include: expect.any(Object),
      });

      expect(result).toHaveLength(1);
      expect(result[0].alertType).toBe('DELAY');
      expect(result[0].severity).toBe('HIGH');

      jest.useRealTimers();
    });

    it('should not create duplicate delay alerts', async () => {
      const mockDelayedShipments = [
        {
          id: 'shipment-1',
          shipmentNumber: 'SHIP001',
          eta: new Date('2024-01-01'),
          status: 'IN_TRANSIT',
          createdBy: 'user-1',
          creator: { id: 'user-1', name: 'Test User', email: 'user@test.com' },
          client: { id: 'client-1', name: 'Test Client' },
          project: { id: 'project-1', name: 'Test Project' },
        },
      ];

      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-06'));

      mockPrismaService.shipment.findMany.mockResolvedValue(mockDelayedShipments);
      mockPrismaService.logisticsAlert.findFirst.mockResolvedValue({
        id: 'existing-alert-1',
        alertType: 'DELAY',
        isResolved: false,
      }); // Existing alert found

      const result = await service.checkDelayedShipments();

      expect(mockPrismaService.logisticsAlert.create).not.toHaveBeenCalled();
      expect(result).toHaveLength(0);

      jest.useRealTimers();
    });
  });

  describe('checkFreeDayExpiry', () => {
    it('should create free day expiry alerts', async () => {
      const mockMilestones = [
        {
          id: 'milestone-1',
          milestoneType: 'ARRIVAL',
          actualDate: new Date('2024-01-01'),
          location: 'Port of Los Angeles',
          shipmentId: 'shipment-1',
          shipment: {
            id: 'shipment-1',
            shipmentNumber: 'SHIP001',
            createdBy: 'user-1',
            creator: { id: 'user-1', name: 'Test User', email: 'user@test.com' },
          },
        },
      ];

      // Mock current date to be 7 days after arrival (free days expired)
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-08'));

      mockPrismaService.milestone.findMany.mockResolvedValue(mockMilestones);
      mockPrismaService.logisticsAlert.findFirst.mockResolvedValue(null); // No existing alert
      mockPrismaService.logisticsAlert.create.mockResolvedValue({
        id: 'alert-1',
        shipmentId: 'shipment-1',
        alertType: 'FREE_DAY_EXPIRY',
        severity: 'CRITICAL',
        title: 'Free days expired for shipment SHIP001',
        message: 'Free days have expired for shipment SHIP001. Demurrage charges may apply.',
        assignedTo: 'user-1',
        metadata: {
          daysRemaining: 0,
          freeDays: 7,
          arrivalDate: new Date('2024-01-01'),
          location: 'Port of Los Angeles',
        },
      });

      const result = await service.checkFreeDayExpiry();

      expect(mockPrismaService.milestone.findMany).toHaveBeenCalledWith({
        where: {
          milestoneType: { in: ['ARRIVAL', 'CUSTOMS'] },
          actualDate: { not: null },
          shipment: {
            status: { in: ['CUSTOMS', 'IN_TRANSIT'] },
          },
        },
        include: expect.any(Object),
      });

      expect(result).toHaveLength(1);
      expect(result[0].alertType).toBe('FREE_DAY_EXPIRY');
      expect(result[0].severity).toBe('CRITICAL');

      jest.useRealTimers();
    });
  });

  describe('checkCustomsIssues', () => {
    it('should create customs issue alerts for stuck shipments', async () => {
      const mockCustomsIssues = [
        {
          id: 'shipment-1',
          shipmentNumber: 'SHIP001',
          status: 'CUSTOMS',
          updatedAt: new Date('2024-01-01'), // 5 days ago
          createdBy: 'user-1',
          creator: { id: 'user-1', name: 'Test User', email: 'user@test.com' },
          milestones: [
            {
              milestoneType: 'CUSTOMS',
              actualDate: new Date('2024-01-01'),
              location: 'Customs Port',
            },
          ],
        },
      ];

      // Mock current date to be 5 days after customs entry
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-06'));

      mockPrismaService.shipment.findMany.mockResolvedValue(mockCustomsIssues);
      mockPrismaService.logisticsAlert.findFirst.mockResolvedValue(null); // No existing alert
      mockPrismaService.logisticsAlert.create.mockResolvedValue({
        id: 'alert-1',
        shipmentId: 'shipment-1',
        alertType: 'CUSTOMS_ISSUE',
        severity: 'HIGH',
        title: 'Customs delay for shipment SHIP001',
        message: 'Shipment SHIP001 has been in customs for 5 days. Please investigate.',
        assignedTo: 'user-1',
        metadata: {
          daysInCustoms: 5,
          customsLocation: 'Customs Port',
        },
      });

      const result = await service.checkCustomsIssues();

      expect(mockPrismaService.shipment.findMany).toHaveBeenCalledWith({
        where: {
          status: 'CUSTOMS',
          updatedAt: {
            lt: new Date('2024-01-03'), // 3 days ago
          },
        },
        include: expect.any(Object),
      });

      expect(result).toHaveLength(1);
      expect(result[0].alertType).toBe('CUSTOMS_ISSUE');
      expect(result[0].severity).toBe('HIGH');

      jest.useRealTimers();
    });
  });

  describe('createAlert', () => {
    it('should create a logistics alert', async () => {
      const mockAlert = {
        id: 'alert-1',
        shipmentId: 'shipment-1',
        alertType: 'DELAY',
        title: 'Test Alert',
        message: 'Test message',
        severity: 'HIGH',
        assignedTo: 'user-1',
        metadata: { test: 'data' },
      };

      mockPrismaService.logisticsAlert.create.mockResolvedValue(mockAlert);

      const result = await service.createAlert({
        shipmentId: 'shipment-1',
        alertType: 'DELAY',
        severity: 'HIGH',
        title: 'Test Alert',
        message: 'Test message',
        assignedTo: 'user-1',
        metadata: { test: 'data' },
      });

      expect(mockPrismaService.logisticsAlert.create).toHaveBeenCalledWith({
        data: {
          shipmentId: 'shipment-1',
          alertType: 'DELAY',
          title: 'Test Alert',
          message: 'Test message',
          severity: 'HIGH',
          assignedTo: 'user-1',
          metadata: { test: 'data' },
        },
        include: expect.any(Object),
      });

      expect(result).toEqual(mockAlert);
    });
  });

  describe('getActiveAlerts', () => {
    it('should return active alerts for a shipment', async () => {
      const mockAlerts = [
        {
          id: 'alert-1',
          shipmentId: 'shipment-1',
          alertType: 'DELAY',
          severity: 'HIGH',
          isResolved: false,
        },
      ];

      mockPrismaService.logisticsAlert.findMany.mockResolvedValue(mockAlerts);

      const result = await service.getActiveAlerts('shipment-1');

      expect(mockPrismaService.logisticsAlert.findMany).toHaveBeenCalledWith({
        where: {
          shipmentId: 'shipment-1',
          isResolved: false,
        },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });

      expect(result).toEqual(mockAlerts);
    });
  });

  describe('resolveAlert', () => {
    it('should resolve an alert', async () => {
      const mockResolvedAlert = {
        id: 'alert-1',
        isResolved: true,
        resolvedBy: 'user-1',
        resolvedAt: new Date(),
        resolutionNotes: 'Issue resolved',
      };

      mockPrismaService.logisticsAlert.update.mockResolvedValue(mockResolvedAlert);

      const result = await service.resolveAlert('alert-1', 'user-1', 'Issue resolved');

      expect(mockPrismaService.logisticsAlert.update).toHaveBeenCalledWith({
        where: { id: 'alert-1' },
        data: {
          isResolved: true,
          resolvedBy: 'user-1',
          resolvedAt: expect.any(Date),
          resolutionNotes: 'Issue resolved',
        },
        include: expect.any(Object),
      });

      expect(result).toEqual(mockResolvedAlert);
    });
  });

  describe('getAlertStatistics', () => {
    it('should return alert statistics', async () => {
      const mockActiveAlerts = [
        { severity: 'HIGH', alertType: 'DELAY' },
        { severity: 'MEDIUM', alertType: 'ETA_CHANGE' },
        { severity: 'HIGH', alertType: 'CUSTOMS_ISSUE' },
      ];

      const mockResolvedAlerts = [
        {
          createdAt: new Date('2024-01-01'),
          resolvedAt: new Date('2024-01-02'),
        },
        {
          createdAt: new Date('2024-01-01'),
          resolvedAt: new Date('2024-01-03'),
        },
      ];

      mockPrismaService.logisticsAlert.findMany
        .mockResolvedValueOnce(mockActiveAlerts) // Active alerts
        .mockResolvedValueOnce(mockResolvedAlerts); // Resolved alerts

      const result = await service.getAlertStatistics();

      expect(result.totalActiveAlerts).toBe(3);
      expect(result.alertsBySeverity).toEqual({
        'HIGH': 2,
        'MEDIUM': 1,
      });
      expect(result.alertsByType).toEqual({
        'DELAY': 1,
        'ETA_CHANGE': 1,
        'CUSTOMS_ISSUE': 1,
      });
      expect(result.averageResolutionTime).toBe(24); // 24 hours average
    });
  });

  describe('runAllAlertChecks', () => {
    it('should run all alert checks and return summary', async () => {
      const mockDelayAlerts = [{ id: 'delay-1', alertType: 'DELAY' }];
      const mockEtaAlerts = [{ id: 'eta-1', alertType: 'ETA_CHANGE' }];
      const mockFreeDayAlerts = [{ id: 'free-1', alertType: 'FREE_DAY_EXPIRY' }];
      const mockCustomsAlerts = [{ id: 'customs-1', alertType: 'CUSTOMS_ISSUE' }];

      jest.spyOn(service, 'checkDelayedShipments').mockResolvedValue(mockDelayAlerts as any);
      jest.spyOn(service, 'checkEtaChanges').mockResolvedValue(mockEtaAlerts as any);
      jest.spyOn(service, 'checkFreeDayExpiry').mockResolvedValue(mockFreeDayAlerts as any);
      jest.spyOn(service, 'checkCustomsIssues').mockResolvedValue(mockCustomsAlerts as any);

      const result = await service.runAllAlertChecks();

      expect(result.delayAlerts).toEqual(mockDelayAlerts);
      expect(result.etaChangeAlerts).toEqual(mockEtaAlerts);
      expect(result.freeDayAlerts).toEqual(mockFreeDayAlerts);
      expect(result.customsAlerts).toEqual(mockCustomsAlerts);
      expect(result.totalAlerts).toBe(4);
    });
  });
});
