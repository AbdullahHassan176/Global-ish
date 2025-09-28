import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { HMACUtil } from '../utils/hmac.util';
import { DataSanitizationUtil } from '../utils/data-sanitization.util';
import { WebhookService } from './webhook.service';
import { 
  CreateTokenizationEventDto, 
  UpdateTokenizationEventDto,
  CreateTokenizationKPIDto,
  UpdateTokenizationKPIDto,
  TokenizationEventQueryDto,
  TokenizationKPIQueryDto
} from '../dto/integrations.dto';
import { 
  ITokenizationBridge,
  TokenizationEvent,
  TokenizationKPI,
  TokenizationEventQuery,
  TokenizationKPIQuery,
  BridgeEventPayload,
  BridgeKPIPayload,
  EventPublisher
} from '../interfaces/tokenization.interface';
import { TokenizationEvent as TokenizationEventModel, TokenizationKPI as TokenizationKPIModel, TokenizationEventType, KPIType } from '@prisma/client';

@Injectable()
export class TokenizationBridgeService implements ITokenizationBridge, EventPublisher {
  private readonly logger = new Logger(TokenizationBridgeService.name);
  private readonly bridgeSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly webhookService: WebhookService,
  ) {
    this.bridgeSecret = process.env.BRIDGE_SECRET || 'default-bridge-secret';
  }

  /**
   * Create a new tokenization event
   */
  async createTokenizationEvent(
    createDto: CreateTokenizationEventDto,
    userId: string
  ): Promise<TokenizationEventModel> {
    this.logger.log(`Creating tokenization event: ${createDto.eventType}`);

    // Sanitize the data
    const sanitizationResult = await DataSanitizationUtil.sanitizeData(
      createDto.sanitizedData,
      createDto.entityType,
      'investor'
    );

    const tokenizationEvent = await this.prisma.tokenizationEvent.create({
      data: {
        eventType: createDto.eventType,
        entityId: createDto.entityId,
        entityType: createDto.entityType,
        sanitizedData: sanitizationResult.sanitizedData,
        originalData: sanitizationResult.originalData,
        createdBy: userId,
      },
    });

    this.logger.log(`Created tokenization event with ID: ${tokenizationEvent.id}`);
    return tokenizationEvent;
  }

  /**
   * Get all tokenization events
   */
  async findAllTokenizationEvents(query: TokenizationEventQueryDto): Promise<TokenizationEventModel[]> {
    const where: any = {};

    if (query.eventType) {
      where.eventType = query.eventType;
    }

    if (query.entityType) {
      where.entityType = query.entityType;
    }

    if (query.isPublished !== undefined) {
      where.isPublished = query.isPublished;
    }

    if (query.fromDate || query.toDate) {
      where.createdAt = {};
      if (query.fromDate) {
        where.createdAt.gte = query.fromDate;
      }
      if (query.toDate) {
        where.createdAt.lte = query.toDate;
      }
    }

    return this.prisma.tokenizationEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: query.limit || 50,
      skip: query.offset || 0,
    });
  }

  /**
   * Get tokenization event by ID
   */
  async findTokenizationEventById(id: string): Promise<TokenizationEventModel> {
    const tokenizationEvent = await this.prisma.tokenizationEvent.findUnique({
      where: { id },
    });

    if (!tokenizationEvent) {
      throw new NotFoundException(`Tokenization event with ID ${id} not found`);
    }

    return tokenizationEvent;
  }

  /**
   * Update tokenization event
   */
  async updateTokenizationEvent(
    id: string,
    updateDto: UpdateTokenizationEventDto
  ): Promise<TokenizationEventModel> {
    await this.findTokenizationEventById(id); // Check if exists

    const updatedTokenizationEvent = await this.prisma.tokenizationEvent.update({
      where: { id },
      data: {
        isPublished: updateDto.isPublished,
        publishedAt: updateDto.publishedAt,
      },
    });

    this.logger.log(`Updated tokenization event with ID: ${id}`);
    return updatedTokenizationEvent;
  }

  /**
   * Delete tokenization event
   */
  async deleteTokenizationEvent(id: string): Promise<void> {
    await this.findTokenizationEventById(id); // Check if exists

    await this.prisma.tokenizationEvent.delete({
      where: { id },
    });

    this.logger.log(`Deleted tokenization event with ID: ${id}`);
  }

  /**
   * Create a new tokenization KPI
   */
  async createTokenizationKPI(
    createDto: CreateTokenizationKPIDto,
    userId: string
  ): Promise<TokenizationKPIModel> {
    this.logger.log(`Creating tokenization KPI: ${createDto.kpiType}`);

    const tokenizationKPI = await this.prisma.tokenizationKPI.create({
      data: {
        kpiType: createDto.kpiType,
        period: createDto.period,
        value: createDto.value,
        metadata: createDto.metadata,
        createdBy: userId,
      },
    });

    this.logger.log(`Created tokenization KPI with ID: ${tokenizationKPI.id}`);
    return tokenizationKPI;
  }

  /**
   * Get all tokenization KPIs
   */
  async findAllTokenizationKPIs(query: TokenizationKPIQueryDto): Promise<TokenizationKPIModel[]> {
    const where: any = {};

    if (query.kpiType) {
      where.kpiType = query.kpiType;
    }

    if (query.period) {
      where.period = query.period;
    }

    if (query.isPublished !== undefined) {
      where.isPublished = query.isPublished;
    }

    return this.prisma.tokenizationKPI.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: query.limit || 50,
      skip: query.offset || 0,
    });
  }

  /**
   * Get tokenization KPI by ID
   */
  async findTokenizationKPIById(id: string): Promise<TokenizationKPIModel> {
    const tokenizationKPI = await this.prisma.tokenizationKPI.findUnique({
      where: { id },
    });

    if (!tokenizationKPI) {
      throw new NotFoundException(`Tokenization KPI with ID ${id} not found`);
    }

    return tokenizationKPI;
  }

  /**
   * Update tokenization KPI
   */
  async updateTokenizationKPI(
    id: string,
    updateDto: UpdateTokenizationKPIDto
  ): Promise<TokenizationKPIModel> {
    await this.findTokenizationKPIById(id); // Check if exists

    const updatedTokenizationKPI = await this.prisma.tokenizationKPI.update({
      where: { id },
      data: {
        value: updateDto.value,
        metadata: updateDto.metadata,
        isPublished: updateDto.isPublished,
        publishedAt: updateDto.publishedAt,
      },
    });

    this.logger.log(`Updated tokenization KPI with ID: ${id}`);
    return updatedTokenizationKPI;
  }

  /**
   * Delete tokenization KPI
   */
  async deleteTokenizationKPI(id: string): Promise<void> {
    await this.findTokenizationKPIById(id); // Check if exists

    await this.prisma.tokenizationKPI.delete({
      where: { id },
    });

    this.logger.log(`Deleted tokenization KPI with ID: ${id}`);
  }

  // ITokenizationBridge implementation
  async publishEvent(event: TokenizationEvent): Promise<string> {
    const sanitizationResult = await DataSanitizationUtil.sanitizeData(
      event.sanitizedData,
      event.entityType,
      'investor'
    );

    const tokenizationEvent = await this.prisma.tokenizationEvent.create({
      data: {
        eventType: event.eventType,
        entityId: event.entityId,
        entityType: event.entityType,
        sanitizedData: sanitizationResult.sanitizedData,
        originalData: sanitizationResult.originalData,
        isPublished: true,
        publishedAt: new Date(),
        createdBy: 'system', // Or get from context
      },
    });

    // Publish to webhook endpoints
    await this.publishEventToWebhooks(tokenizationEvent);

    return tokenizationEvent.id;
  }

  async publishKPI(kpi: TokenizationKPI): Promise<string> {
    const tokenizationKPI = await this.prisma.tokenizationKPI.create({
      data: {
        kpiType: kpi.kpiType,
        period: kpi.period,
        value: kpi.value,
        metadata: kpi.metadata,
        isPublished: true,
        publishedAt: new Date(),
        createdBy: 'system', // Or get from context
      },
    });

    // Publish to webhook endpoints
    await this.publishKPIToWebhooksFromModel(tokenizationKPI);

    return tokenizationKPI.id;
  }

  async getEvents(query: TokenizationEventQuery): Promise<TokenizationEventModel[]> {
    return this.findAllTokenizationEvents(query as TokenizationEventQueryDto);
  }

  async getKPIs(query: TokenizationKPIQuery): Promise<TokenizationKPIModel[]> {
    return this.findAllTokenizationKPIs(query as TokenizationKPIQueryDto);
  }

  async sanitizeData(data: Record<string, any>, entityType: string): Promise<Record<string, any>> {
    const result = await DataSanitizationUtil.sanitizeData(data, entityType, 'investor');
    return result.sanitizedData;
  }

  // EventPublisher implementation
  async publish(payload: BridgeEventPayload): Promise<void> {
    // Find webhook endpoints that subscribe to this event type
    const webhookEndpoints = await this.prisma.webhookEndpoint.findMany({
      where: {
        isActive: true,
        events: {
          has: payload.eventType,
        },
      },
    });

    // Deliver to each webhook endpoint
    for (const endpoint of webhookEndpoints) {
      try {
        await this.webhookService.deliverWebhook(endpoint.id, {
          eventId: payload.eventId,
          eventType: payload.eventType,
          entityId: payload.entityId,
          entityType: payload.entityType,
          data: payload.data,
          timestamp: payload.timestamp,
        });
      } catch (error) {
        this.logger.error(`Failed to deliver event to webhook ${endpoint.id}: ${error.message}`);
      }
    }
  }

  async publishKPIToWebhooks(kpi: BridgeKPIPayload): Promise<void> {
    // Find webhook endpoints that subscribe to KPI events
    const webhookEndpoints = await this.prisma.webhookEndpoint.findMany({
      where: {
        isActive: true,
        events: {
          has: 'KPI_UPDATED',
        },
      },
    });

    // Deliver to each webhook endpoint
    for (const endpoint of webhookEndpoints) {
      try {
        await this.webhookService.deliverWebhook(endpoint.id, {
          eventId: kpi.kpiId,
          eventType: 'KPI_UPDATED',
          entityId: kpi.kpiId,
          entityType: 'kpi',
          data: {
            kpiType: kpi.kpiType,
            period: kpi.period,
            value: kpi.value,
            metadata: kpi.metadata,
          },
          timestamp: kpi.timestamp,
        });
      } catch (error) {
        this.logger.error(`Failed to deliver KPI to webhook ${endpoint.id}: ${error.message}`);
      }
    }
  }

  generateSignature(payload: Record<string, any>): string {
    return HMACUtil.generateBridgeSignature(
      payload.eventId || payload.kpiId,
      payload.eventType || 'KPI_UPDATED',
      payload.entityId || payload.kpiId,
      payload.data || payload,
      this.bridgeSecret
    );
  }

  validateSignature(payload: Record<string, any>, signature: string): boolean {
    return HMACUtil.verifyBridgeSignature(
      payload.eventId || payload.kpiId,
      payload.eventType || 'KPI_UPDATED',
      payload.entityId || payload.kpiId,
      payload.data || payload,
      signature,
      this.bridgeSecret
    );
  }

  private async publishEventToWebhooks(event: TokenizationEventModel): Promise<void> {
    const payload: BridgeEventPayload = {
      eventId: event.id,
      eventType: event.eventType,
      entityId: event.entityId,
      entityType: event.entityType,
      data: event.sanitizedData as Record<string, any>,
      timestamp: event.createdAt,
      signature: this.generateSignature({
        eventId: event.id,
        eventType: event.eventType,
        entityId: event.entityId,
        data: event.sanitizedData,
      }),
    };

    await this.publish(payload);
  }

  private async publishKPIToWebhooksFromModel(kpi: TokenizationKPIModel): Promise<void> {
    const payload: BridgeKPIPayload = {
      kpiId: kpi.id,
      kpiType: kpi.kpiType,
      period: kpi.period,
      value: kpi.value,
      metadata: kpi.metadata as Record<string, any>,
      timestamp: kpi.createdAt,
      signature: this.generateSignature({
        kpiId: kpi.id,
        kpiType: kpi.kpiType,
        period: kpi.period,
        value: kpi.value,
        metadata: kpi.metadata,
      }),
    };

    await this.publishKPI(payload);
  }
}
