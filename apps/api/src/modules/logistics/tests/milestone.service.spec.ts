import { Test, TestingModule } from '@nestjs/testing';
import { MilestoneService } from '../services/milestone.service';
import { PrismaService } from '../../../common/prisma/prisma.service';

describe('MilestoneService', () => {
  let service: MilestoneService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    milestone: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MilestoneService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MilestoneService>(MilestoneService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMilestoneStatus', () => {
    it('should return completed status for milestone with actual date', () => {
      const milestone = {
        id: 'milestone-1',
        plannedDate: new Date('2024-01-01'),
        actualDate: new Date('2024-01-01'),
        milestoneType: 'ARRIVAL',
        location: 'Port of Los Angeles',
      } as any;

      const result = service.getMilestoneStatus(milestone);

      expect(result.status).toBe('COMPLETED');
      expect(result.color).toBe('#10b981');
      expect(result.isOverdue).toBe(false);
    });

    it('should return overdue status for milestone past planned date', () => {
      const milestone = {
        id: 'milestone-1',
        plannedDate: new Date('2024-01-01'),
        actualDate: null,
        milestoneType: 'ARRIVAL',
        location: 'Port of Los Angeles',
      } as any;

      // Mock current date to be after planned date
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-05'));

      const result = service.getMilestoneStatus(milestone);

      expect(result.status).toBe('OVERDUE');
      expect(result.color).toBe('#ef4444');
      expect(result.isOverdue).toBe(true);
      expect(result.daysOverdue).toBe(4);

      jest.useRealTimers();
    });

    it('should return due soon status for milestone due within 24 hours', () => {
      const milestone = {
        id: 'milestone-1',
        plannedDate: new Date('2024-01-05T12:00:00Z'),
        actualDate: null,
        milestoneType: 'ARRIVAL',
        location: 'Port of Los Angeles',
      } as any;

      // Mock current date to be 12 hours before planned date
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-05T00:00:00Z'));

      const result = service.getMilestoneStatus(milestone);

      expect(result.status).toBe('DUE_SOON');
      expect(result.color).toBe('#f59e0b');
      expect(result.isOverdue).toBe(false);

      jest.useRealTimers();
    });

    it('should return on track status for milestone with future planned date', () => {
      const milestone = {
        id: 'milestone-1',
        plannedDate: new Date('2024-01-10'),
        actualDate: null,
        milestoneType: 'ARRIVAL',
        location: 'Port of Los Angeles',
      } as any;

      // Mock current date to be 5 days before planned date
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-05'));

      const result = service.getMilestoneStatus(milestone);

      expect(result.status).toBe('ON_TRACK');
      expect(result.color).toBe('#10b981');
      expect(result.isOverdue).toBe(false);

      jest.useRealTimers();
    });
  });

  describe('calculateDemurrageRisk', () => {
    it('should return low risk for milestone with many free days remaining', () => {
      const milestone = {
        id: 'milestone-1',
        plannedDate: new Date('2024-01-01'),
        actualDate: new Date('2024-01-01'),
        milestoneType: 'ARRIVAL',
        location: 'Port of Los Angeles',
      } as any;

      // Mock current date to be 2 days after reference date
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-03'));

      const result = service.calculateDemurrageRisk(milestone, '40FT', 7, 100);

      expect(result.riskLevel).toBe('LOW');
      expect(result.color).toBe('#10b981');
      expect(result.freeDaysRemaining).toBe(5);

      jest.useRealTimers();
    });

    it('should return medium risk for milestone with few free days remaining', () => {
      const milestone = {
        id: 'milestone-1',
        plannedDate: new Date('2024-01-01'),
        actualDate: new Date('2024-01-01'),
        milestoneType: 'ARRIVAL',
        location: 'Port of Los Angeles',
      } as any;

      // Mock current date to be 6 days after reference date
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-07'));

      const result = service.calculateDemurrageRisk(milestone, '40FT', 7, 100);

      expect(result.riskLevel).toBe('MEDIUM');
      expect(result.color).toBe('#f59e0b');
      expect(result.freeDaysRemaining).toBe(1);

      jest.useRealTimers();
    });

    it('should return high risk for milestone over free time', () => {
      const milestone = {
        id: 'milestone-1',
        plannedDate: new Date('2024-01-01'),
        actualDate: new Date('2024-01-01'),
        milestoneType: 'ARRIVAL',
        location: 'Port of Los Angeles',
      } as any;

      // Mock current date to be 9 days after reference date
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-10'));

      const result = service.calculateDemurrageRisk(milestone, '40FT', 7, 100);

      expect(result.riskLevel).toBe('HIGH');
      expect(result.color).toBe('#ef4444');
      expect(result.freeDaysRemaining).toBe(0);
      expect(result.estimatedDemurrageCost).toBe(200); // 2 days over * $100

      jest.useRealTimers();
    });

    it('should return critical risk for milestone significantly over free time', () => {
      const milestone = {
        id: 'milestone-1',
        plannedDate: new Date('2024-01-01'),
        actualDate: new Date('2024-01-01'),
        milestoneType: 'ARRIVAL',
        location: 'Port of Los Angeles',
      } as any;

      // Mock current date to be 15 days after reference date
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-16'));

      const result = service.calculateDemurrageRisk(milestone, '40FT', 7, 100);

      expect(result.riskLevel).toBe('CRITICAL');
      expect(result.color).toBe('#dc2626');
      expect(result.freeDaysRemaining).toBe(0);
      expect(result.estimatedDemurrageCost).toBe(800); // 8 days over * $100

      jest.useRealTimers();
    });

    it('should return low risk for non-arrival milestone types', () => {
      const milestone = {
        id: 'milestone-1',
        plannedDate: new Date('2024-01-01'),
        actualDate: new Date('2024-01-01'),
        milestoneType: 'ETD',
        location: 'Port of Shanghai',
      } as any;

      const result = service.calculateDemurrageRisk(milestone, '40FT', 7, 100);

      expect(result.riskLevel).toBe('LOW');
      expect(result.color).toBe('#10b981');
      expect(result.description).toBe('Not applicable for this milestone type');
    });
  });

  describe('getShipmentProgress', () => {
    it('should calculate progress percentage correctly', async () => {
      const mockMilestones = [
        { id: '1', actualDate: new Date('2024-01-01') }, // completed
        { id: '2', actualDate: new Date('2024-01-02') }, // completed
        { id: '3', actualDate: null }, // not completed
        { id: '4', actualDate: null }, // not completed
      ];

      mockPrismaService.milestone.findMany.mockResolvedValue(mockMilestones);

      const result = await service.getShipmentProgress('shipment-1');

      expect(result.progressPercentage).toBe(50); // 2 out of 4 completed
      expect(result.completedMilestones).toBe(2);
      expect(result.totalMilestones).toBe(4);
      expect(result.nextMilestone).toEqual(mockMilestones[2]);
    });

    it('should return 0% progress for shipment with no milestones', async () => {
      mockPrismaService.milestone.findMany.mockResolvedValue([]);

      const result = await service.getShipmentProgress('shipment-1');

      expect(result.progressPercentage).toBe(0);
      expect(result.completedMilestones).toBe(0);
      expect(result.totalMilestones).toBe(0);
    });
  });

  describe('getMilestoneStatistics', () => {
    it('should return correct statistics', async () => {
      const mockCompletedMilestones = [
        { plannedDate: new Date('2024-01-01'), actualDate: new Date('2024-01-01') }, // on time
        { plannedDate: new Date('2024-01-01'), actualDate: new Date('2024-01-02') }, // 1 day late
        { plannedDate: new Date('2024-01-01'), actualDate: new Date('2024-01-03') }, // 2 days late
      ];

      mockPrismaService.milestone.count
        .mockResolvedValueOnce(10) // totalMilestones
        .mockResolvedValueOnce(5)  // completedMilestones
        .mockResolvedValueOnce(2)  // overdueMilestones
        .mockResolvedValueOnce(3); // upcomingMilestones

      mockPrismaService.milestone.findMany.mockResolvedValue(mockCompletedMilestones);

      const result = await service.getMilestoneStatistics();

      expect(result.totalMilestones).toBe(10);
      expect(result.completedMilestones).toBe(5);
      expect(result.overdueMilestones).toBe(2);
      expect(result.upcomingMilestones).toBe(3);
      expect(result.averageDelay).toBe(1); // (0 + 1 + 2) / 3 = 1
      expect(result.onTimePercentage).toBe(33); // 1 out of 3 on time
    });
  });
});
