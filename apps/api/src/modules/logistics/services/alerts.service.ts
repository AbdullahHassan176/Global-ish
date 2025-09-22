import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LogisticsAlert, Shipment, Milestone } from '@prisma/client';

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  alertType: 'DELAY' | 'ETA_CHANGE' | 'FREE_DAY_EXPIRY' | 'CUSTOMS_ISSUE' | 'VESSEL_CHANGE' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  conditions: {
    field: string;
    operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'is_null' | 'is_not_null';
    value?: any;
  }[];
  enabled: boolean;
  notificationChannels: ('EMAIL' | 'SMS' | 'IN_APP' | 'WEBHOOK')[];
  assignedTo?: string;
}

export interface AlertTrigger {
  shipmentId: string;
  alertType: string;
  severity: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  assignedTo?: string;
}

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Check for delayed shipments and create alerts
   */
  async checkDelayedShipments(): Promise<LogisticsAlert[]> {
    const now = new Date();
    const delayedShipments = await this.prisma.shipment.findMany({
      where: {
        status: { in: ['IN_TRANSIT', 'CUSTOMS'] },
        eta: { lt: now },
        actualArrival: null,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        client: {
          select: { id: true, name: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });

    const alerts: LogisticsAlert[] = [];

    for (const shipment of delayedShipments) {
      const daysDelayed = Math.ceil((now.getTime() - shipment.eta!.getTime()) / (1000 * 60 * 60 * 24));
      
      // Check if alert already exists
      const existingAlert = await this.prisma.logisticsAlert.findFirst({
        where: {
          shipmentId: shipment.id,
          alertType: 'DELAY',
          isResolved: false,
        },
      });

      if (!existingAlert) {
        const severity = this.calculateDelaySeverity(daysDelayed);
        
        const alert = await this.createAlert({
          shipmentId: shipment.id,
          alertType: 'DELAY',
          severity,
          title: `Shipment ${shipment.shipmentNumber} is delayed`,
          message: `Shipment ${shipment.shipmentNumber} is ${daysDelayed} days overdue. ETA was ${shipment.eta?.toLocaleDateString()}.`,
          assignedTo: shipment.createdBy,
          metadata: {
            daysDelayed,
            originalEta: shipment.eta,
            currentStatus: shipment.status,
          },
        });

        alerts.push(alert);
      }
    }

    this.logger.log(`Created ${alerts.length} delay alerts`);
    return alerts;
  }

  /**
   * Check for ETA changes and create alerts
   */
  async checkEtaChanges(): Promise<LogisticsAlert[]> {
    // This would typically be triggered by carrier webhook updates
    // For now, we'll check for recent ETA updates
    const recentEtaUpdates = await this.prisma.shipment.findMany({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
        eta: { not: null },
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        carrierEvents: {
          where: {
            eventType: 'ETA_UPDATE',
            eventDate: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { eventDate: 'desc' },
          take: 1,
        },
      },
    });

    const alerts: LogisticsAlert[] = [];

    for (const shipment of recentEtaUpdates) {
      if (shipment.carrierEvents.length > 0) {
        const event = shipment.carrierEvents[0];
        
        // Check if alert already exists for this ETA change
        const existingAlert = await this.prisma.logisticsAlert.findFirst({
          where: {
            shipmentId: shipment.id,
            alertType: 'ETA_CHANGE',
            isResolved: false,
            createdAt: {
              gte: new Date(Date.now() - 2 * 60 * 60 * 1000), // Last 2 hours
            },
          },
        });

        if (!existingAlert) {
          const alert = await this.createAlert({
            shipmentId: shipment.id,
            alertType: 'ETA_CHANGE',
            severity: 'MEDIUM',
            title: `ETA updated for shipment ${shipment.shipmentNumber}`,
            message: `New ETA for shipment ${shipment.shipmentNumber}: ${shipment.eta?.toLocaleDateString()}. ${event.description || ''}`,
            assignedTo: shipment.createdBy,
            metadata: {
              newEta: shipment.eta,
              eventDescription: event.description,
              eventDate: event.eventDate,
            },
          });

          alerts.push(alert);
        }
      }
    }

    this.logger.log(`Created ${alerts.length} ETA change alerts`);
    return alerts;
  }

  /**
   * Check for free day expiry and create alerts
   */
  async checkFreeDayExpiry(): Promise<LogisticsAlert[]> {
    const now = new Date();
    
    // Get milestones that might be approaching free day expiry
    const arrivalMilestones = await this.prisma.milestone.findMany({
      where: {
        milestoneType: { in: ['ARRIVAL', 'CUSTOMS'] },
        actualDate: { not: null },
        shipment: {
          status: { in: ['CUSTOMS', 'IN_TRANSIT'] },
        },
      },
      include: {
        shipment: {
          select: {
            id: true,
            shipmentNumber: true,
            createdBy: true,
            creator: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    const alerts: LogisticsAlert[] = [];

    for (const milestone of arrivalMilestones) {
      const daysSinceArrival = Math.ceil((now.getTime() - milestone.actualDate!.getTime()) / (1000 * 60 * 60 * 24));
      const freeDays = 7; // Default free days
      const daysRemaining = freeDays - daysSinceArrival;

      // Create alerts based on remaining free days
      if (daysRemaining <= 1 && daysRemaining >= 0) {
        // Check if alert already exists
        const existingAlert = await this.prisma.logisticsAlert.findFirst({
          where: {
            shipmentId: milestone.shipmentId,
            alertType: 'FREE_DAY_EXPIRY',
            isResolved: false,
            severity: daysRemaining === 0 ? 'CRITICAL' : 'HIGH',
          },
        });

        if (!existingAlert) {
          const severity = daysRemaining === 0 ? 'CRITICAL' : 'HIGH';
          const title = daysRemaining === 0 
            ? `Free days expired for shipment ${milestone.shipment.shipmentNumber}`
            : `Free days expiring soon for shipment ${milestone.shipment.shipmentNumber}`;
          
          const message = daysRemaining === 0
            ? `Free days have expired for shipment ${milestone.shipment.shipmentNumber}. Demurrage charges may apply.`
            : `Only ${daysRemaining} free day(s) remaining for shipment ${milestone.shipment.shipmentNumber}.`;

          const alert = await this.createAlert({
            shipmentId: milestone.shipmentId,
            alertType: 'FREE_DAY_EXPIRY',
            severity,
            title,
            message,
            assignedTo: milestone.shipment.createdBy,
            metadata: {
              daysRemaining,
              freeDays,
              arrivalDate: milestone.actualDate,
              location: milestone.location,
            },
          });

          alerts.push(alert);
        }
      }
    }

    this.logger.log(`Created ${alerts.length} free day expiry alerts`);
    return alerts;
  }

  /**
   * Check for customs issues and create alerts
   */
  async checkCustomsIssues(): Promise<LogisticsAlert[]> {
    const customsIssues = await this.prisma.shipment.findMany({
      where: {
        status: 'CUSTOMS',
        updatedAt: {
          lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Stuck in customs for 3+ days
        },
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        milestones: {
          where: {
            milestoneType: 'CUSTOMS',
          },
          orderBy: { actualDate: 'desc' },
          take: 1,
        },
      },
    });

    const alerts: LogisticsAlert[] = [];

    for (const shipment of customsIssues) {
      // Check if alert already exists
      const existingAlert = await this.prisma.logisticsAlert.findFirst({
        where: {
          shipmentId: shipment.id,
          alertType: 'CUSTOMS_ISSUE',
          isResolved: false,
        },
      });

      if (!existingAlert) {
        const daysInCustoms = shipment.milestones.length > 0 
          ? Math.ceil((Date.now() - shipment.milestones[0].actualDate!.getTime()) / (1000 * 60 * 60 * 24))
          : 3;

        const alert = await this.createAlert({
          shipmentId: shipment.id,
          alertType: 'CUSTOMS_ISSUE',
          severity: daysInCustoms > 7 ? 'CRITICAL' : 'HIGH',
          title: `Customs delay for shipment ${shipment.shipmentNumber}`,
          message: `Shipment ${shipment.shipmentNumber} has been in customs for ${daysInCustoms} days. Please investigate.`,
          assignedTo: shipment.createdBy,
          metadata: {
            daysInCustoms,
            customsLocation: shipment.milestones[0]?.location,
          },
        });

        alerts.push(alert);
      }
    }

    this.logger.log(`Created ${alerts.length} customs issue alerts`);
    return alerts;
  }

  /**
   * Run all alert checks
   */
  async runAllAlertChecks(): Promise<{
    delayAlerts: LogisticsAlert[];
    etaChangeAlerts: LogisticsAlert[];
    freeDayAlerts: LogisticsAlert[];
    customsAlerts: LogisticsAlert[];
    totalAlerts: number;
  }> {
    this.logger.log('Running all alert checks...');

    const [delayAlerts, etaChangeAlerts, freeDayAlerts, customsAlerts] = await Promise.all([
      this.checkDelayedShipments(),
      this.checkEtaChanges(),
      this.checkFreeDayExpiry(),
      this.checkCustomsIssues(),
    ]);

    const totalAlerts = delayAlerts.length + etaChangeAlerts.length + freeDayAlerts.length + customsAlerts.length;

    this.logger.log(`Alert check completed. Created ${totalAlerts} total alerts.`);

    return {
      delayAlerts,
      etaChangeAlerts,
      freeDayAlerts,
      customsAlerts,
      totalAlerts,
    };
  }

  /**
   * Create a logistics alert
   */
  async createAlert(alertData: AlertTrigger): Promise<LogisticsAlert> {
    const alert = await this.prisma.logisticsAlert.create({
      data: {
        shipmentId: alertData.shipmentId,
        alertType: alertData.alertType as any,
        title: alertData.title,
        message: alertData.message,
        severity: alertData.severity as any,
        assignedTo: alertData.assignedTo,
        metadata: alertData.metadata,
      },
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
        assignedToUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // TODO: Send notifications based on alert severity and user preferences
    await this.sendAlertNotifications(alert);

    return alert;
  }

  /**
   * Get active alerts for a shipment
   */
  async getActiveAlerts(shipmentId: string): Promise<LogisticsAlert[]> {
    return this.prisma.logisticsAlert.findMany({
      where: {
        shipmentId,
        isResolved: false,
      },
      include: {
        assignedToUser: {
          select: { id: true, name: true, email: true },
        },
        resolvedByUser: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get all active alerts with filters
   */
  async getAllActiveAlerts(filters?: {
    severity?: string;
    alertType?: string;
    assignedTo?: string;
    shipmentId?: string;
  }): Promise<LogisticsAlert[]> {
    const where: any = {
      isResolved: false,
    };

    if (filters?.severity) {
      where.severity = filters.severity;
    }
    if (filters?.alertType) {
      where.alertType = filters.alertType;
    }
    if (filters?.assignedTo) {
      where.assignedTo = filters.assignedTo;
    }
    if (filters?.shipmentId) {
      where.shipmentId = filters.shipmentId;
    }

    return this.prisma.logisticsAlert.findMany({
      where,
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true, carrier: true },
        },
        assignedToUser: {
          select: { id: true, name: true, email: true },
        },
        resolvedByUser: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  /**
   * Resolve an alert
   */
  async resolveAlert(
    alertId: string,
    resolvedBy: string,
    resolutionNotes?: string
  ): Promise<LogisticsAlert> {
    return this.prisma.logisticsAlert.update({
      where: { id: alertId },
      data: {
        isResolved: true,
        resolvedBy,
        resolvedAt: new Date(),
        resolutionNotes,
      },
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
        assignedToUser: {
          select: { id: true, name: true, email: true },
        },
        resolvedByUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  /**
   * Get alert statistics
   */
  async getAlertStatistics(): Promise<{
    totalActiveAlerts: number;
    alertsBySeverity: Record<string, number>;
    alertsByType: Record<string, number>;
    averageResolutionTime: number;
  }> {
    const activeAlerts = await this.prisma.logisticsAlert.findMany({
      where: { isResolved: false },
    });

    const resolvedAlerts = await this.prisma.logisticsAlert.findMany({
      where: {
        isResolved: true,
        resolvedAt: { not: null },
      },
      select: {
        createdAt: true,
        resolvedAt: true,
      },
    });

    const alertsBySeverity = activeAlerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const alertsByType = activeAlerts.reduce((acc, alert) => {
      acc[alert.alertType] = (acc[alert.alertType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalResolutionTime = resolvedAlerts.reduce((sum, alert) => {
      const resolutionTime = alert.resolvedAt!.getTime() - alert.createdAt.getTime();
      return sum + resolutionTime;
    }, 0);

    const averageResolutionTime = resolvedAlerts.length > 0
      ? Math.round(totalResolutionTime / resolvedAlerts.length / (1000 * 60 * 60)) // Convert to hours
      : 0;

    return {
      totalActiveAlerts: activeAlerts.length,
      alertsBySeverity,
      alertsByType,
      averageResolutionTime,
    };
  }

  /**
   * Calculate delay severity based on days delayed
   */
  private calculateDelaySeverity(daysDelayed: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (daysDelayed <= 1) return 'LOW';
    if (daysDelayed <= 3) return 'MEDIUM';
    if (daysDelayed <= 7) return 'HIGH';
    return 'CRITICAL';
  }

  /**
   * Send alert notifications
   */
  private async sendAlertNotifications(alert: LogisticsAlert): Promise<void> {
    // TODO: Implement notification sending logic
    // This would integrate with the notifications module
    this.logger.log(`Sending notifications for alert ${alert.id} of severity ${alert.severity}`);
  }
}
