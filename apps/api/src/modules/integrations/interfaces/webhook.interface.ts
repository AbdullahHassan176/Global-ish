export interface IWebhookService {
  registerEndpoint(endpoint: WebhookEndpointConfig): Promise<string>;
  unregisterEndpoint(endpointId: string): Promise<void>;
  deliverWebhook(endpointId: string, event: WebhookEvent): Promise<WebhookDeliveryResult>;
  retryFailedDelivery(deliveryId: string): Promise<WebhookDeliveryResult>;
  getDeliveryStatus(deliveryId: string): Promise<WebhookDeliveryStatus>;
}

export interface WebhookEndpointConfig {
  id?: string;
  name: string;
  url: string;
  description?: string;
  events: string[];
  secret: string;
  headers?: Record<string, string>;
  timeout?: number;
  retryPolicy?: RetryPolicy;
  credentialId?: string;
}

export interface WebhookEvent {
  eventId: string;
  eventType: string;
  entityId: string;
  entityType: string;
  data: Record<string, any>;
  timestamp: Date;
}

export interface WebhookDeliveryResult {
  deliveryId: string;
  status: DeliveryStatus;
  responseCode?: number;
  responseBody?: string;
  attemptCount: number;
  nextRetryAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  error?: string;
}

export interface WebhookDeliveryStatus {
  id: string;
  status: DeliveryStatus;
  attemptCount: number;
  maxAttempts: number;
  responseCode?: number;
  responseBody?: string;
  nextRetryAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RetryPolicy {
  maxAttempts: number;
  backoffMultiplier: number;
  initialDelay: number;
  maxDelay: number;
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING',
  EXPIRED = 'EXPIRED'
}

export interface WebhookSignature {
  signature: string;
  timestamp: string;
  algorithm: string;
}

export interface WebhookValidationResult {
  isValid: boolean;
  error?: string;
  payload?: Record<string, any>;
}
