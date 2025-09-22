import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Milestone, MilestoneType, MilestoneStatus } from '@prisma/client';

export interface MilestoneStatusInfo {
  status: MilestoneStatus;
  color: string;
  description: string;
  isOverdue: boolean;
  daysOverdue?: number;
}

export interface DemurrageRiskInfo {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
  description: string;
  freeDaysRemaining?: number;
  estimatedDemurrageCost?: number;
  dailyRate?: number;
}

@Injectable()
export class MilestoneService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get milestone status with color coding and overdue information
   */
  getMilestoneStatus(milestone: Milestone): MilestoneStatusInfo {
    const now = new Date();
    const plannedDate = milestone.plannedDate;
    const actualDate = milestone.actualDate;

    // If milestone is completed
    if (actualDate) {
      const isOverdue = plannedDate && actualDate > plannedDate;
      const daysOverdue = isOverdue && plannedDate 
        ? Math.ceil((actualDate.getTime() - plannedDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      return {
        status: 'COMPLETED',
        color: isOverdue ? '#ef4444' : '#10b981', // red if overdue, green if on time
        description: isOverdue ? `Completed ${daysOverdue} days late` : 'Completed on time',
        isOverdue,
        daysOverdue: isOverdue ? daysOverdue : undefined,
      };
    }

    // If milestone is not completed yet
    if (plannedDate) {
      const isOverdue = now > plannedDate;
      const daysOverdue = isOverdue 
        ? Math.ceil((now.getTime() - plannedDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      if (isOverdue) {
        return {
          status: 'OVERDUE',
          color: '#ef4444', // red
          description: `${daysOverdue} days overdue`,
          isOverdue: true,
          daysOverdue,
        };
      } else {
        const daysUntilDue = Math.ceil((plannedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue <= 1) {
          return {
            status: 'DUE_SOON',
            color: '#f59e0b', // amber
            description: 'Due within 24 hours',
            isOverdue: false,
          };
        } else if (daysUntilDue <= 3) {
          return {
            status: 'DUE_SOON',
            color: '#f59e0b', // amber
            description: `Due in ${daysUntilDue} days`,
            isOverdue: false,
          };
        } else {
          return {
            status: 'ON_TRACK',
            color: '#10b981', // green
            description: `Due in ${daysUntilDue} days`,
            isOverdue: false,
          };
        }
      }
    }

    // No planned date
    return {
      status: 'PENDING',
      color: '#6b7280', // gray
      description: 'No planned date',
      isOverdue: false,
    };
  }

  /**
   * Calculate demurrage risk for a container
   */
  calculateDemurrageRisk(
    milestone: Milestone,
    containerType: string,
    freeDays: number = 7,
    dailyRate: number = 100
  ): DemurrageRiskInfo {
    const now = new Date();
    const plannedDate = milestone.plannedDate;
    const actualDate = milestone.actualDate;

    // Only calculate for arrival milestones
    if (milestone.milestoneType !== 'ARRIVAL' && milestone.milestoneType !== 'CUSTOMS') {
      return {
        riskLevel: 'LOW',
        color: '#10b981',
        description: 'Not applicable for this milestone type',
      };
    }

    // If milestone is not completed yet, use planned date
    const referenceDate = actualDate || plannedDate;
    
    if (!referenceDate) {
      return {
        riskLevel: 'LOW',
        color: '#6b7280',
        description: 'No reference date available',
      };
    }

    // Calculate days since reference date
    const daysSinceReference = Math.ceil((now.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
    const freeDaysRemaining = Math.max(0, freeDays - daysSinceReference);
    const daysOverFree = Math.max(0, daysSinceReference - freeDays);

    // Calculate estimated demurrage cost
    const estimatedDemurrageCost = daysOverFree * dailyRate;

    // Determine risk level
    if (freeDaysRemaining > 3) {
      return {
        riskLevel: 'LOW',
        color: '#10b981', // green
        description: `${freeDaysRemaining} free days remaining`,
        freeDaysRemaining,
        dailyRate,
      };
    } else if (freeDaysRemaining > 0) {
      return {
        riskLevel: 'MEDIUM',
        color: '#f59e0b', // amber
        description: `${freeDaysRemaining} free days remaining`,
        freeDaysRemaining,
        estimatedDemurrageCost: 0,
        dailyRate,
      };
    } else if (daysOverFree <= 3) {
      return {
        riskLevel: 'HIGH',
        color: '#ef4444', // red
        description: `${daysOverFree} days over free time`,
        freeDaysRemaining: 0,
        estimatedDemurrageCost,
        dailyRate,
      };
    } else {
      return {
        riskLevel: 'CRITICAL',
        color: '#dc2626', // dark red
        description: `${daysOverFree} days over free time - urgent action required`,
        freeDaysRemaining: 0,
        estimatedDemurrageCost,
        dailyRate,
      };
    }
  }

  /**
   * Get milestone timeline with status information
   */
  async getMilestoneTimeline(shipmentId: string): Promise<Array<Milestone & { statusInfo: MilestoneStatusInfo; demurrageRisk?: DemurrageRiskInfo }>> {
    const milestones = await this.prisma.milestone.findMany({
      where: { shipmentId },
      orderBy: { plannedDate: 'asc' },
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
      },
    });

    return milestones.map(milestone => ({
      ...milestone,
      statusInfo: this.getMilestoneStatus(milestone),
      demurrageRisk: this.calculateDemurrageRisk(milestone),
    }));
  }

  /**
   * Get shipment progress percentage based on completed milestones
   */
  async getShipmentProgress(shipmentId: string): Promise<{
    progressPercentage: number;
    completedMilestones: number;
    totalMilestones: number;
    nextMilestone?: Milestone;
    estimatedCompletion?: Date;
  }> {
    const milestones = await this.prisma.milestone.findMany({
      where: { shipmentId },
      orderBy: { plannedDate: 'asc' },
    });

    const completedMilestones = milestones.filter(m => m.actualDate).length;
    const totalMilestones = milestones.length;
    const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    const nextMilestone = milestones.find(m => !m.actualDate);
    const lastMilestone = milestones[milestones.length - 1];
    const estimatedCompletion = lastMilestone?.plannedDate;

    return {
      progressPercentage,
      completedMilestones,
      totalMilestones,
      nextMilestone,
      estimatedCompletion,
    };
  }

  /**
   * Get overdue milestones across all shipments
   */
  async getOverdueMilestones(): Promise<Array<Milestone & { statusInfo: MilestoneStatusInfo; demurrageRisk?: DemurrageRiskInfo }>> {
    const now = new Date();
    const overdueMilestones = await this.prisma.milestone.findMany({
      where: {
        actualDate: null, // Not completed
        plannedDate: {
          lt: now, // Planned date is in the past
        },
      },
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true, carrier: true },
        },
      },
      orderBy: { plannedDate: 'asc' },
    });

    return overdueMilestones.map(milestone => ({
      ...milestone,
      statusInfo: this.getMilestoneStatus(milestone),
      demurrageRisk: this.calculateDemurrageRisk(milestone),
    }));
  }

  /**
   * Get milestones due within specified days
   */
  async getUpcomingMilestones(days: number = 7): Promise<Array<Milestone & { statusInfo: MilestoneStatusInfo }>> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));

    const upcomingMilestones = await this.prisma.milestone.findMany({
      where: {
        actualDate: null, // Not completed
        plannedDate: {
          gte: now,
          lte: futureDate,
        },
      },
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true, carrier: true },
        },
      },
      orderBy: { plannedDate: 'asc' },
    });

    return upcomingMilestones.map(milestone => ({
      ...milestone,
      statusInfo: this.getMilestoneStatus(milestone),
    }));
  }

  /**
   * Get milestone statistics
   */
  async getMilestoneStatistics(): Promise<{
    totalMilestones: number;
    completedMilestones: number;
    overdueMilestones: number;
    upcomingMilestones: number;
    averageDelay: number;
    onTimePercentage: number;
  }> {
    const now = new Date();
    
    const totalMilestones = await this.prisma.milestone.count();
    const completedMilestones = await this.prisma.milestone.count({
      where: { actualDate: { not: null } },
    });
    const overdueMilestones = await this.prisma.milestone.count({
      where: {
        actualDate: null,
        plannedDate: { lt: now },
      },
    });
    const upcomingMilestones = await this.prisma.milestone.count({
      where: {
        actualDate: null,
        plannedDate: { gte: now },
      },
    });

    // Calculate average delay for completed milestones
    const completedMilestonesWithDelay = await this.prisma.milestone.findMany({
      where: {
        actualDate: { not: null },
        plannedDate: { not: null },
      },
      select: {
        plannedDate: true,
        actualDate: true,
      },
    });

    const totalDelay = completedMilestonesWithDelay.reduce((sum, milestone) => {
      const delay = Math.ceil((milestone.actualDate!.getTime() - milestone.plannedDate!.getTime()) / (1000 * 60 * 60 * 24));
      return sum + Math.max(0, delay);
    }, 0);

    const averageDelay = completedMilestonesWithDelay.length > 0 
      ? Math.round(totalDelay / completedMilestonesWithDelay.length) 
      : 0;

    const onTimeMilestones = completedMilestonesWithDelay.filter(milestone => {
      const delay = Math.ceil((milestone.actualDate!.getTime() - milestone.plannedDate!.getTime()) / (1000 * 60 * 60 * 24));
      return delay <= 0;
    }).length;

    const onTimePercentage = completedMilestonesWithDelay.length > 0
      ? Math.round((onTimeMilestones / completedMilestonesWithDelay.length) * 100)
      : 0;

    return {
      totalMilestones,
      completedMilestones,
      overdueMilestones,
      upcomingMilestones,
      averageDelay,
      onTimePercentage,
    };
  }
}
