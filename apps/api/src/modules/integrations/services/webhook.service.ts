import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { HMACUtil } from '../utils/hmac.util';
import { CredentialVaultService } from './credential-vault.service';
import { 
  CreateWebhookEndpointDto, 
  UpdateWebhookEndpointDto,
  CreateWebhookDeliveryDto,
  UpdateWebhookDeliveryDto,
  WebhookDeliveryQueryDto
} from '../dto/integrations.dto';
import { 
  IWebhookService,
  WebhookEndpointConfig,
  WebhookEvent,
  WebhookDeliveryResult,
  WebhookDeliveryStatus,
  RetryPolicy,
  DeliveryStatus
} from '../interfaces/webhook.interface';
import { WebhookEndpoint, WebhookDelivery } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class WebhookService implements IWebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly credentialVault: CredentialVaultService,
  ) {}

  /**
   * Create a new webhook endpoint
   */
  async createWebhookEndpoint(
    createDto: CreateWebhookEndpointDto,
    userId: string
  ): Promise<WebhookEndpoint> {
    this.logger.log(`Creating webhook endpoint: ${createDto.name}`);

    const webhookEndpoint = await this.prisma.webhookEndpoint.create({
      data: {
        name: createDto.name,
        url: createDto.url,
        description: createDto.description,
        events: createDto.events,
        secret: createDto.secret,
        headers: createDto.headers,
        timeout: createDto.timeout || 30000,
        retryPolicy: createDto.retryPolicy,
        credentialId: createDto.credentialId,
        createdBy: userId,
      },
    });

    this.logger.log(`Created webhook endpoint with ID: ${webhookEndpoint.id}`);
    return webhookEndpoint;
  }

  /**
   * Get all webhook endpoints
   */
  async findAllWebhookEndpoints(userId?: string): Promise<WebhookEndpoint[]> {
    const where = userId ? { createdBy: userId } : {};
    
    return this.prisma.webhookEndpoint.findMany({
      where,
      include: {
        credential: true,
        deliveries: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get webhook endpoint by ID
   */
  async findWebhookEndpointById(id: string): Promise<WebhookEndpoint> {
    const webhookEndpoint = await this.prisma.webhookEndpoint.findUnique({
      where: { id },
      include: {
        credential: true,
        deliveries: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!webhookEndpoint) {
      throw new NotFoundException(`Webhook endpoint with ID ${id} not found`);
    }

    return webhookEndpoint;
  }

  /**
   * Update webhook endpoint
   */
  async updateWebhookEndpoint(
    id: string,
    updateDto: UpdateWebhookEndpointDto
  ): Promise<WebhookEndpoint> {
    await this.findWebhookEndpointById(id); // Check if exists

    const updatedWebhookEndpoint = await this.prisma.webhookEndpoint.update({
      where: { id },
      data: {
        name: updateDto.name,
        url: updateDto.url,
        description: updateDto.description,
        events: updateDto.events,
        secret: updateDto.secret,
        headers: updateDto.headers,
        timeout: updateDto.timeout,
        retryPolicy: updateDto.retryPolicy,
        credentialId: updateDto.credentialId,
        isActive: updateDto.isActive,
      },
    });

    this.logger.log(`Updated webhook endpoint with ID: ${id}`);
    return updatedWebhookEndpoint;
  }

  /**
   * Delete webhook endpoint
   */
  async deleteWebhookEndpoint(id: string): Promise<void> {
    await this.findWebhookEndpointById(id); // Check if exists

    await this.prisma.webhookEndpoint.delete({
      where: { id },
    });

    this.logger.log(`Deleted webhook endpoint with ID: ${id}`);
  }

  /**
   * Test webhook endpoint
   */
  async testWebhookEndpoint(id: string, testPayload?: Record<string, any>): Promise<WebhookDeliveryResult> {
    const webhookEndpoint = await this.findWebhookEndpointById(id);
    
    if (!webhookEndpoint.isActive) {
      throw new BadRequestException('Webhook endpoint is not active');
    }

    const testEvent: WebhookEvent = {
      eventId: `test-${Date.now()}`,
      eventType: 'test',
      entityId: 'test-entity',
      entityType: 'test',
      data: testPayload || { message: 'Test webhook delivery' },
      timestamp: new Date(),
    };

    return this.deliverWebhook(webhookEndpoint.id, testEvent);
  }

  /**
   * Get webhook delivery history
   */
  async getWebhookDeliveries(query: WebhookDeliveryQueryDto): Promise<WebhookDelivery[]> {
    const where: any = {};

    if (query.webhookId) {
      where.webhookId = query.webhookId;
    }

    if (query.eventType) {
      where.eventType = query.eventType;
    }

    if (query.status) {
      where.status = query.status;
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

    return this.prisma.webhookDelivery.findMany({
      where,
      include: {
        webhook: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit || 50,
      skip: query.offset || 0,
    });
  }

  // IWebhookService implementation
  async registerEndpoint(endpoint: WebhookEndpointConfig): Promise<string> {
    const webhookEndpoint = await this.prisma.webhookEndpoint.create({
      data: {
        name: endpoint.name,
        url: endpoint.url,
        description: endpoint.description,
        events: endpoint.events,
        secret: endpoint.secret,
        headers: endpoint.headers,
        timeout: endpoint.timeout || 30000,
        retryPolicy: endpoint.retryPolicy,
        credentialId: endpoint.credentialId,
        createdBy: 'system', // Or get from context
      },
    });

    return webhookEndpoint.id;
  }

  async unregisterEndpoint(endpointId: string): Promise<void> {
    await this.prisma.webhookEndpoint.delete({
      where: { id: endpointId },
    });
  }

  async deliverWebhook(endpointId: string, event: WebhookEvent): Promise<WebhookDeliveryResult> {
    const webhookEndpoint = await this.findWebhookEndpointById(endpointId);
    
    if (!webhookEndpoint.isActive) {
      throw new BadRequestException('Webhook endpoint is not active');
    }

    // Check if webhook subscribes to this event type
    if (!webhookEndpoint.events.includes(event.eventType)) {
      throw new BadRequestException(`Webhook does not subscribe to event type: ${event.eventType}`);
    }

    // Create delivery record
    const delivery = await this.createDeliveryRecord(webhookEndpoint, event);

    try {
      // Prepare payload
      const payload = this.prepareWebhookPayload(event, webhookEndpoint.secret);
      
      // Prepare headers
      const headers = await this.prepareHeaders(webhookEndpoint);
      
      // Make HTTP request
      const response = await this.makeWebhookRequest(
        webhookEndpoint.url,
        payload,
        headers,
        webhookEndpoint.timeout
      );

      // Update delivery record with success
      await this.updateDeliveryRecord(delivery.id, {
        status: DeliveryStatus.DELIVERED,
        responseCode: response.status,
        responseBody: response.data,
        deliveredAt: new Date(),
      });

      this.logger.log(`Successfully delivered webhook ${delivery.id} to ${webhookEndpoint.url}`);

      return {
        deliveryId: delivery.id,
        status: DeliveryStatus.DELIVERED,
        responseCode: response.status,
        responseBody: response.data,
        attemptCount: 1,
        deliveredAt: new Date(),
      };
    } catch (error) {
      // Update delivery record with failure
      await this.updateDeliveryRecord(delivery.id, {
        status: DeliveryStatus.FAILED,
        responseCode: error.response?.status,
        responseBody: error.response?.data,
        failedAt: new Date(),
      });

      this.logger.error(`Failed to deliver webhook ${delivery.id}: ${error.message}`);

      return {
        deliveryId: delivery.id,
        status: DeliveryStatus.FAILED,
        responseCode: error.response?.status,
        responseBody: error.response?.data,
        attemptCount: 1,
        failedAt: new Date(),
        error: error.message,
      };
    }
  }

  async retryFailedDelivery(deliveryId: string): Promise<WebhookDeliveryResult> {
    const delivery = await this.prisma.webhookDelivery.findUnique({
      where: { id: deliveryId },
      include: { webhook: true },
    });

    if (!delivery) {
      throw new NotFoundException(`Webhook delivery with ID ${deliveryId} not found`);
    }

    if (delivery.status === DeliveryStatus.DELIVERED) {
      throw new BadRequestException('Webhook delivery is already successful');
    }

    if (delivery.attemptCount >= delivery.maxAttempts) {
      throw new BadRequestException('Maximum retry attempts exceeded');
    }

    // Update attempt count
    await this.prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: {
        attemptCount: delivery.attemptCount + 1,
        status: DeliveryStatus.RETRYING,
      },
    });

    // Retry delivery
    const event: WebhookEvent = {
      eventId: delivery.payload['eventId'],
      eventType: delivery.eventType,
      entityId: delivery.payload['entityId'],
      entityType: delivery.payload['entityType'],
      data: delivery.payload['data'],
      timestamp: new Date(delivery.payload['timestamp']),
    };

    return this.deliverWebhook(delivery.webhookId, event);
  }

  async getDeliveryStatus(deliveryId: string): Promise<WebhookDeliveryStatus> {
    const delivery = await this.prisma.webhookDelivery.findUnique({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new NotFoundException(`Webhook delivery with ID ${deliveryId} not found`);
    }

    return {
      id: delivery.id,
      status: delivery.status as DeliveryStatus,
      attemptCount: delivery.attemptCount,
      maxAttempts: delivery.maxAttempts,
      responseCode: delivery.responseCode,
      responseBody: delivery.responseBody,
      nextRetryAt: delivery.nextRetryAt,
      deliveredAt: delivery.deliveredAt,
      failedAt: delivery.failedAt,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
    };
  }

  private async createDeliveryRecord(
    webhookEndpoint: WebhookEndpoint,
    event: WebhookEvent
  ): Promise<WebhookDelivery> {
    const payload = this.prepareWebhookPayload(event, webhookEndpoint.secret);
    const signature = HMACUtil.generateWebhookSignature(payload, webhookEndpoint.secret);

    return this.prisma.webhookDelivery.create({
      data: {
        webhookId: webhookEndpoint.id,
        eventType: event.eventType,
        payload,
        signature,
        status: DeliveryStatus.PENDING,
        maxAttempts: (webhookEndpoint.retryPolicy as any)?.maxAttempts || 3,
      },
    });
  }

  private async updateDeliveryRecord(
    deliveryId: string,
    updateData: Partial<WebhookDelivery>
  ): Promise<void> {
    await this.prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: updateData,
    });
  }

  private prepareWebhookPayload(event: WebhookEvent, secret: string): Record<string, any> {
    const payload = {
      eventId: event.eventId,
      eventType: event.eventType,
      entityId: event.entityId,
      entityType: event.entityType,
      data: event.data,
      timestamp: event.timestamp.toISOString(),
    };

    const signature = HMACUtil.generateWebhookSignature(payload, secret);
    return {
      ...payload,
      signature,
    };
  }

  private async prepareHeaders(webhookEndpoint: WebhookEndpoint): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Global-Next-Webhook/1.0',
    };

    // Add custom headers
    if (webhookEndpoint.headers) {
      Object.assign(headers, webhookEndpoint.headers);
    }

    // Add authentication headers if credential is provided
    if (webhookEndpoint.credentialId) {
      try {
        const credentials = await this.credentialVault.getDecryptedCredentials(webhookEndpoint.credentialId);
        // Add authentication headers based on credential type
        // This would depend on the specific credential type and provider
      } catch (error) {
        this.logger.warn(`Failed to get credentials for webhook ${webhookEndpoint.id}: ${error.message}`);
      }
    }

    return headers;
  }

  private async makeWebhookRequest(
    url: string,
    payload: Record<string, any>,
    headers: Record<string, string>,
    timeout: number
  ): Promise<AxiosResponse> {
    return axios.post(url, payload, {
      headers,
      timeout,
      validateStatus: (status) => status < 500, // Don't throw for 4xx errors
    });
  }
}
