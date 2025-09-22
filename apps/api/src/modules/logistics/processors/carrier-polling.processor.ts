import { Processor, Worker, Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { CarrierAdapterFactory } from '../adapters/carrier-adapter.factory';
import { PrismaService } from '../../../prisma/prisma.service';
import { Carrier, ShipmentStatus } from '@prisma/client';

export interface CarrierPollingJobData {
  carrier: Carrier;
  shipmentId?: string;
  containerNumber?: string;
  trackingNumber?: string;
}

@Injectable()
export class CarrierPollingProcessor {
  private readonly logger = new Logger(CarrierPollingProcessor.name);

  constructor(
    private readonly carrierAdapterFactory: CarrierAdapterFactory,
    private readonly prisma: PrismaService,
  ) {}

  @Processor('carrier-polling')
  async processCarrierPolling(job: Job<CarrierPollingJobData>) {
    const { carrier, shipmentId, containerNumber, trackingNumber } = job.data;
    
    this.logger.log(`Processing carrier polling job for ${carrier}`, {
      jobId: job.id,
      carrier,
      shipmentId,
      containerNumber,
      trackingNumber,
    });

    try {
      const adapter = this.carrierAdapterFactory.getAdapter(carrier);
      
      if (shipmentId) {
        await this.pollShipmentUpdates(adapter, shipmentId);
      } else if (containerNumber) {
        await this.pollContainerUpdates(adapter, containerNumber);
      } else if (trackingNumber) {
        await this.pollTrackingUpdates(adapter, trackingNumber);
      } else {
        // Poll all active shipments for this carrier
        await this.pollAllCarrierShipments(adapter, carrier);
      }

      this.logger.log(`Successfully processed carrier polling job for ${carrier}`, {
        jobId: job.id,
      });
    } catch (error) {
      this.logger.error(`Failed to process carrier polling job for ${carrier}`, {
        jobId: job.id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  private async pollShipmentUpdates(adapter: any, shipmentId: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { containers: true, carrierEvents: true },
    });

    if (!shipment) {
      this.logger.warn(`Shipment ${shipmentId} not found`);
      return;
    }

    try {
      // Get latest tracking information from carrier
      const carrierShipment = await adapter.trackShipment(shipment.shipmentNumber);
      
      // Update shipment status if changed
      if (carrierShipment.status !== shipment.status) {
        await this.prisma.shipment.update({
          where: { id: shipmentId },
          data: {
            status: carrierShipment.status as ShipmentStatus,
            actualDeparture: carrierShipment.actualDeparture,
            actualArrival: carrierShipment.actualArrival,
            updatedAt: new Date(),
          },
        });

        this.logger.log(`Updated shipment ${shipmentId} status to ${carrierShipment.status}`);
      }

      // Get and process carrier events
      const events = await adapter.getShipmentEvents(shipment.shipmentNumber);
      await this.processCarrierEvents(shipmentId, events);

      // Update container information
      for (const container of shipment.containers) {
        try {
          const carrierContainer = await adapter.getContainerDetails(container.containerNumber);
          await this.updateContainerFromCarrier(container.id, carrierContainer);
        } catch (error) {
          this.logger.warn(`Failed to update container ${container.containerNumber}`, {
            error: error.message,
          });
        }
      }
    } catch (error) {
      this.logger.error(`Failed to poll shipment updates for ${shipmentId}`, {
        error: error.message,
      });
    }
  }

  private async pollContainerUpdates(adapter: any, containerNumber: string) {
    const container = await this.prisma.container.findFirst({
      where: { containerNumber },
      include: { shipment: true },
    });

    if (!container) {
      this.logger.warn(`Container ${containerNumber} not found`);
      return;
    }

    try {
      const carrierContainer = await adapter.getContainerDetails(containerNumber);
      await this.updateContainerFromCarrier(container.id, carrierContainer);
    } catch (error) {
      this.logger.error(`Failed to poll container updates for ${containerNumber}`, {
        error: error.message,
      });
    }
  }

  private async pollTrackingUpdates(adapter: any, trackingNumber: string) {
    // Find shipment by tracking number (could be shipment number, BL, or container number)
    const shipment = await this.prisma.shipment.findFirst({
      where: {
        OR: [
          { shipmentNumber: trackingNumber },
          { billOfLading: trackingNumber },
          { containerNumber: trackingNumber },
        ],
      },
    });

    if (shipment) {
      await this.pollShipmentUpdates(adapter, shipment.id);
    } else {
      this.logger.warn(`No shipment found for tracking number ${trackingNumber}`);
    }
  }

  private async pollAllCarrierShipments(adapter: any, carrier: Carrier) {
    const activeShipments = await this.prisma.shipment.findMany({
      where: {
        carrier,
        status: {
          in: ['PLANNED', 'AT_ORIGIN', 'IN_TRANSIT', 'AT_DESTINATION'],
        },
      },
      take: 50, // Limit to avoid overwhelming the carrier API
    });

    this.logger.log(`Polling ${activeShipments.length} active shipments for ${carrier}`);

    for (const shipment of activeShipments) {
      try {
        await this.pollShipmentUpdates(adapter, shipment.id);
        // Add delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        this.logger.error(`Failed to poll shipment ${shipment.id}`, {
          error: error.message,
        });
      }
    }
  }

  private async processCarrierEvents(shipmentId: string, events: any[]) {
    for (const event of events) {
      // Check if event already exists
      const existingEvent = await this.prisma.carrierEvent.findFirst({
        where: {
          shipmentId,
          eventCode: event.eventCode,
          eventDate: event.eventDate,
        },
      });

      if (!existingEvent) {
        await this.prisma.carrierEvent.create({
          data: {
            shipmentId,
            eventCode: event.eventCode,
            description: event.description,
            eventDate: event.eventDate,
            location: event.location,
            vesselName: event.vesselName,
            voyageNumber: event.voyageNumber,
          },
        });

        this.logger.log(`Created new carrier event for shipment ${shipmentId}`, {
          eventCode: event.eventCode,
          description: event.description,
        });
      }
    }
  }

  private async updateContainerFromCarrier(containerId: string, carrierContainer: any) {
    await this.prisma.container.update({
      where: { id: containerId },
      data: {
        status: carrierContainer.status,
        lastKnownLocation: carrierContainer.lastKnownLocation,
        lastReportedAt: carrierContainer.lastReportedAt,
        weightKg: carrierContainer.weightKg,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Updated container ${containerId} from carrier data`);
  }
}
