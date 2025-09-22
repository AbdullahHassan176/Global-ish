import { Processor, Worker, Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { CarrierAdapterFactory } from '../adapters/carrier-adapter.factory';
import { PrismaService } from '../../../prisma/prisma.service';
import { Carrier, ShipmentStatus } from '@prisma/client';

export interface WebhookJobData {
  carrier: Carrier;
  payload: any;
  webhookUrl?: string;
  signature?: string;
}

@Injectable()
export class WebhookProcessor {
  private readonly logger = new Logger(WebhookProcessor.name);

  constructor(
    private readonly carrierAdapterFactory: CarrierAdapterFactory,
    private readonly prisma: PrismaService,
  ) {}

  @Processor('webhook-processing')
  async processWebhook(job: Job<WebhookJobData>) {
    const { carrier, payload, webhookUrl, signature } = job.data;
    
    this.logger.log(`Processing webhook for ${carrier}`, {
      jobId: job.id,
      carrier,
      webhookUrl,
      payloadKeys: Object.keys(payload),
    });

    try {
      // Verify webhook signature if provided
      if (signature && !this.verifyWebhookSignature(payload, signature, carrier)) {
        throw new Error('Invalid webhook signature');
      }

      const adapter = this.carrierAdapterFactory.getAdapter(carrier);
      const events = await adapter.processWebhook(payload);

      // Process each event from the webhook
      for (const event of events) {
        await this.processWebhookEvent(carrier, event);
      }

      this.logger.log(`Successfully processed webhook for ${carrier}`, {
        jobId: job.id,
        eventsProcessed: events.length,
      });
    } catch (error) {
      this.logger.error(`Failed to process webhook for ${carrier}`, {
        jobId: job.id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  private async processWebhookEvent(carrier: Carrier, event: any) {
    try {
      // Find the shipment this event belongs to
      const shipment = await this.findShipmentForEvent(carrier, event);
      
      if (!shipment) {
        this.logger.warn(`No shipment found for webhook event`, {
          carrier,
          eventCode: event.eventCode,
          trackingNumber: event.trackingNumber,
        });
        return;
      }

      // Check if this event already exists
      const existingEvent = await this.prisma.carrierEvent.findFirst({
        where: {
          shipmentId: shipment.id,
          eventCode: event.eventCode,
          eventDate: event.eventDate,
        },
      });

      if (existingEvent) {
        this.logger.log(`Event already exists, skipping`, {
          shipmentId: shipment.id,
          eventCode: event.eventCode,
        });
        return;
      }

      // Create the carrier event
      const carrierEvent = await this.prisma.carrierEvent.create({
        data: {
          shipmentId: shipment.id,
          eventCode: event.eventCode,
          description: event.description,
          eventDate: event.eventDate,
          location: event.location,
          vesselName: event.vesselName,
          voyageNumber: event.voyageNumber,
        },
      });

      // Update shipment status based on event
      await this.updateShipmentFromEvent(shipment.id, event);

      // Create logistics alert if needed
      await this.createAlertIfNeeded(shipment.id, event);

      this.logger.log(`Processed webhook event for shipment ${shipment.id}`, {
        eventId: carrierEvent.id,
        eventCode: event.eventCode,
      });
    } catch (error) {
      this.logger.error(`Failed to process webhook event`, {
        carrier,
        event,
        error: error.message,
      });
    }
  }

  private async findShipmentForEvent(carrier: Carrier, event: any) {
    // Try to find shipment by various identifiers
    const trackingNumber = event.trackingNumber || event.shipmentNumber || event.billOfLading;
    const containerNumber = event.containerNumber;

    if (trackingNumber) {
      const shipment = await this.prisma.shipment.findFirst({
        where: {
          carrier,
          OR: [
            { shipmentNumber: trackingNumber },
            { billOfLading: trackingNumber },
            { containerNumber: trackingNumber },
          ],
        },
      });

      if (shipment) return shipment;
    }

    if (containerNumber) {
      const container = await this.prisma.container.findFirst({
        where: { containerNumber },
        include: { shipment: true },
      });

      if (container) return container.shipment;
    }

    return null;
  }

  private async updateShipmentFromEvent(shipmentId: string, event: any) {
    const statusMapping = {
      'DEPARTED': 'IN_TRANSIT',
      'ARRIVED': 'AT_DESTINATION',
      'DELIVERED': 'DELIVERED',
      'CUSTOMS_CLEARED': 'AT_DESTINATION',
      'OUT_FOR_DELIVERY': 'AT_DESTINATION',
    };

    const newStatus = statusMapping[event.eventCode];
    if (!newStatus) return;

    await this.prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        status: newStatus as ShipmentStatus,
        actualDeparture: event.eventCode === 'DEPARTED' ? event.eventDate : undefined,
        actualArrival: event.eventCode === 'ARRIVED' ? event.eventDate : undefined,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Updated shipment ${shipmentId} status to ${newStatus} from event ${event.eventCode}`);
  }

  private async createAlertIfNeeded(shipmentId: string, event: any) {
    const alertTypes = {
      'DELAYED': 'DELAY',
      'CUSTOMS_HOLD': 'CUSTOMS_ISSUE',
      'DAMAGED': 'DAMAGE',
      'MISSING': 'MISSING_CONTAINER',
    };

    const alertType = alertTypes[event.eventCode];
    if (!alertType) return;

    // Check if alert already exists
    const existingAlert = await this.prisma.logisticsAlert.findFirst({
      where: {
        shipmentId,
        type: alertType,
        isResolved: false,
      },
    });

    if (existingAlert) return;

    await this.prisma.logisticsAlert.create({
      data: {
        shipmentId,
        type: alertType,
        severity: this.getAlertSeverity(event.eventCode),
        title: `Shipment Alert: ${event.eventCode}`,
        message: event.description || `Alert triggered by event: ${event.eventCode}`,
        details: {
          eventCode: event.eventCode,
          eventDate: event.eventDate,
          location: event.location,
        },
      },
    });

    this.logger.log(`Created logistics alert for shipment ${shipmentId}`, {
      alertType,
      eventCode: event.eventCode,
    });
  }

  private getAlertSeverity(eventCode: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const severityMapping = {
      'DELAYED': 'MEDIUM',
      'CUSTOMS_HOLD': 'HIGH',
      'DAMAGED': 'HIGH',
      'MISSING': 'CRITICAL',
    };

    return severityMapping[eventCode] || 'LOW';
  }

  private verifyWebhookSignature(payload: any, signature: string, carrier: Carrier): boolean {
    // This is a placeholder implementation
    // In a real scenario, you would verify the webhook signature
    // using the carrier's webhook secret
    
    this.logger.log(`Verifying webhook signature for ${carrier}`, {
      signature: signature.substring(0, 10) + '...',
    });

    // For now, always return true
    // In production, implement proper signature verification
    return true;
  }
}
