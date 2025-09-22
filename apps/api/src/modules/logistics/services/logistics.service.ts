import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CarrierAdapterFactory, CarrierType } from '../adapters/carrier-adapter.factory';
import { 
  CreateShipmentDto, 
  UpdateShipmentDto,
  CreateContainerDto,
  UpdateContainerDto,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  CreateCarrierEventDto,
  CreateCostItemDto,
  UpdateCostItemDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  CreateLogisticsAlertDto,
  UpdateLogisticsAlertDto,
  TrackShipmentDto,
  BulkTrackDto
} from '../dto/logistics.dto';
import { Shipment, Container, Milestone, CarrierEvent, CostItem, Invoice, LogisticsAlert } from '@prisma/client';

@Injectable()
export class LogisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly carrierAdapterFactory: CarrierAdapterFactory,
  ) {}

  // ===== SHIPMENT METHODS =====

  async createShipment(createShipmentDto: CreateShipmentDto, userId: string): Promise<Shipment> {
    return this.prisma.shipment.create({
      data: {
        ...createShipmentDto,
        createdBy: userId,
      },
      include: {
        containers: true,
        milestones: true,
        costItems: true,
        invoices: true,
        creator: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true },
        },
        client: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findAllShipments(userId: string, filters?: any): Promise<Shipment[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.carrier) {
      where.carrier = filters.carrier;
    }
    if (filters?.projectId) {
      where.projectId = filters.projectId;
    }
    if (filters?.clientId) {
      where.clientId = filters.clientId;
    }

    return this.prisma.shipment.findMany({
      where,
      include: {
        containers: true,
        milestones: true,
        costItems: true,
        invoices: true,
        creator: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true },
        },
        client: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findShipmentById(id: string): Promise<Shipment> {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id },
      include: {
        containers: true,
        milestones: {
          orderBy: { plannedDate: 'asc' },
        },
        carrierEvents: {
          orderBy: { eventDate: 'desc' },
        },
        costItems: true,
        invoices: true,
        logisticsAlerts: {
          where: { isResolved: false },
          orderBy: { createdAt: 'desc' },
        },
        creator: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true },
        },
        client: {
          select: { id: true, name: true },
        },
      },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    return shipment;
  }

  async updateShipment(id: string, updateShipmentDto: UpdateShipmentDto): Promise<Shipment> {
    const existingShipment = await this.findShipmentById(id);
    
    return this.prisma.shipment.update({
      where: { id },
      data: updateShipmentDto,
      include: {
        containers: true,
        milestones: true,
        costItems: true,
        invoices: true,
        creator: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true },
        },
        client: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async deleteShipment(id: string): Promise<void> {
    const existingShipment = await this.findShipmentById(id);
    
    await this.prisma.shipment.delete({
      where: { id },
    });
  }

  // ===== CONTAINER METHODS =====

  async createContainer(createContainerDto: CreateContainerDto): Promise<Container> {
    const shipment = await this.findShipmentById(createContainerDto.shipmentId);
    
    return this.prisma.container.create({
      data: createContainerDto,
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
      },
    });
  }

  async findContainersByShipment(shipmentId: string): Promise<Container[]> {
    return this.prisma.container.findMany({
      where: { shipmentId },
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
      },
    });
  }

  async updateContainer(id: string, updateContainerDto: UpdateContainerDto): Promise<Container> {
    return this.prisma.container.update({
      where: { id },
      data: updateContainerDto,
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
      },
    });
  }

  async deleteContainer(id: string): Promise<void> {
    await this.prisma.container.delete({
      where: { id },
    });
  }

  // ===== MILESTONE METHODS =====

  async createMilestone(createMilestoneDto: CreateMilestoneDto): Promise<Milestone> {
    const shipment = await this.findShipmentById(createMilestoneDto.shipmentId);
    
    return this.prisma.milestone.create({
      data: createMilestoneDto,
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
      },
    });
  }

  async findMilestonesByShipment(shipmentId: string): Promise<Milestone[]> {
    return this.prisma.milestone.findMany({
      where: { shipmentId },
      orderBy: { plannedDate: 'asc' },
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
      },
    });
  }

  async updateMilestone(id: string, updateMilestoneDto: UpdateMilestoneDto): Promise<Milestone> {
    return this.prisma.milestone.update({
      where: { id },
      data: updateMilestoneDto,
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
      },
    });
  }

  async deleteMilestone(id: string): Promise<void> {
    await this.prisma.milestone.delete({
      where: { id },
    });
  }

  async findMilestoneById(id: string): Promise<Milestone> {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id },
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
      },
    });

    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }

    return milestone;
  }

  // ===== CARRIER EVENT METHODS =====

  async createCarrierEvent(createCarrierEventDto: CreateCarrierEventDto): Promise<CarrierEvent> {
    const shipment = await this.findShipmentById(createCarrierEventDto.shipmentId);
    
    return this.prisma.carrierEvent.create({
      data: createCarrierEventDto,
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
      },
    });
  }

  async findCarrierEventsByShipment(shipmentId: string): Promise<CarrierEvent[]> {
    return this.prisma.carrierEvent.findMany({
      where: { shipmentId },
      orderBy: { eventDate: 'desc' },
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
      },
    });
  }

  // ===== COST ITEM METHODS =====

  async createCostItem(createCostItemDto: CreateCostItemDto): Promise<CostItem> {
    const shipment = await this.findShipmentById(createCostItemDto.shipmentId);
    
    return this.prisma.costItem.create({
      data: createCostItemDto,
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findCostItemsByShipment(shipmentId: string): Promise<CostItem[]> {
    return this.prisma.costItem.findMany({
      where: { shipmentId },
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async updateCostItem(id: string, updateCostItemDto: UpdateCostItemDto): Promise<CostItem> {
    return this.prisma.costItem.update({
      where: { id },
      data: updateCostItemDto,
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async deleteCostItem(id: string): Promise<void> {
    await this.prisma.costItem.delete({
      where: { id },
    });
  }

  // ===== INVOICE METHODS =====

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const shipment = await this.findShipmentById(createInvoiceDto.shipmentId);
    
    return this.prisma.invoice.create({
      data: createInvoiceDto,
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
        client: {
          select: { id: true, name: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findInvoicesByShipment(shipmentId: string): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      where: { shipmentId },
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
        client: {
          select: { id: true, name: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async updateInvoice(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    return this.prisma.invoice.update({
      where: { id },
      data: updateInvoiceDto,
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
        client: {
          select: { id: true, name: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async deleteInvoice(id: string): Promise<void> {
    await this.prisma.invoice.delete({
      where: { id },
    });
  }

  // ===== LOGISTICS ALERT METHODS =====

  async createLogisticsAlert(createLogisticsAlertDto: CreateLogisticsAlertDto): Promise<LogisticsAlert> {
    const shipment = await this.findShipmentById(createLogisticsAlertDto.shipmentId);
    
    return this.prisma.logisticsAlert.create({
      data: createLogisticsAlertDto,
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
        assignedToUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findLogisticsAlertsByShipment(shipmentId: string): Promise<LogisticsAlert[]> {
    return this.prisma.logisticsAlert.findMany({
      where: { shipmentId },
      orderBy: { createdAt: 'desc' },
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

  async updateLogisticsAlert(id: string, updateLogisticsAlertDto: UpdateLogisticsAlertDto): Promise<LogisticsAlert> {
    return this.prisma.logisticsAlert.update({
      where: { id },
      data: updateLogisticsAlertDto,
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

  async deleteLogisticsAlert(id: string): Promise<void> {
    await this.prisma.logisticsAlert.delete({
      where: { id },
    });
  }

  // ===== TRACKING METHODS =====

  async trackShipment(trackShipmentDto: TrackShipmentDto): Promise<any> {
    const { identifier, carrier } = trackShipmentDto;

    // If carrier is specified, use that adapter
    if (carrier && this.carrierAdapterFactory.isCarrierSupported(carrier)) {
      const adapter = this.carrierAdapterFactory.getAdapter(carrier as CarrierType);
      const integration = await this.getCarrierIntegration(carrier as CarrierType);
      
      if (!integration) {
        throw new BadRequestException(`No integration configured for carrier: ${carrier}`);
      }

      return await adapter.getTrackingData(identifier, integration.credentials);
    }

    // Otherwise, try to find the shipment in our database first
    const shipment = await this.prisma.shipment.findFirst({
      where: {
        OR: [
          { containerNumber: identifier },
          { billOfLading: identifier },
          { bookingNumber: identifier },
        ],
      },
    });

    if (shipment) {
      // Return our internal tracking data
      return {
        containerNumber: shipment.containerNumber,
        billOfLading: shipment.billOfLading,
        bookingNumber: shipment.bookingNumber,
        status: shipment.status,
        location: shipment.destination,
        vesselName: shipment.vesselName,
        voyageNumber: shipment.voyageNumber,
        etd: shipment.etd,
        eta: shipment.eta,
        actualDeparture: shipment.actualDeparture,
        actualArrival: shipment.actualArrival,
        events: await this.findCarrierEventsByShipment(shipment.id),
      };
    }

    throw new NotFoundException(`No tracking data found for identifier: ${identifier}`);
  }

  async bulkTrackShipments(bulkTrackDto: BulkTrackDto): Promise<any[]> {
    const { identifiers, carrier } = bulkTrackDto;

    if (carrier && this.carrierAdapterFactory.isCarrierSupported(carrier)) {
      const adapter = this.carrierAdapterFactory.getAdapter(carrier as CarrierType);
      const integration = await this.getCarrierIntegration(carrier as CarrierType);
      
      if (!integration) {
        throw new BadRequestException(`No integration configured for carrier: ${carrier}`);
      }

      return await adapter.getBulkTrackingData(identifiers, integration.credentials);
    }

    // Otherwise, track each identifier individually
    const results = [];
    for (const identifier of identifiers) {
      try {
        const result = await this.trackShipment({ identifier, carrier });
        results.push(result);
      } catch (error) {
        results.push({
          identifier,
          error: error.message,
        });
      }
    }

    return results;
  }

  // ===== HELPER METHODS =====

  private async getCarrierIntegration(carrier: CarrierType): Promise<any> {
    return this.prisma.carrierIntegration.findFirst({
      where: {
        carrier,
        enabled: true,
      },
    });
  }

  async getShipmentStatistics(userId: string): Promise<any> {
    const totalShipments = await this.prisma.shipment.count();
    const activeShipments = await this.prisma.shipment.count({
      where: { status: { in: ['PLANNED', 'IN_TRANSIT', 'CUSTOMS'] } },
    });
    const deliveredShipments = await this.prisma.shipment.count({
      where: { status: 'DELIVERED' },
    });
    const delayedShipments = await this.prisma.shipment.count({
      where: {
        status: { in: ['IN_TRANSIT', 'CUSTOMS'] },
        eta: { lt: new Date() },
      },
    });

    const totalCosts = await this.prisma.costItem.aggregate({
      _sum: { amount: true },
    });

    const totalInvoices = await this.prisma.invoice.aggregate({
      _sum: { totalAmount: true },
    });

    return {
      totalShipments,
      activeShipments,
      deliveredShipments,
      delayedShipments,
      totalCosts: totalCosts._sum.amount || 0,
      totalInvoices: totalInvoices._sum.totalAmount || 0,
    };
  }
}