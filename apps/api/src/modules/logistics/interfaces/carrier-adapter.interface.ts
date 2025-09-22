import { Shipment, Container, Milestone, CarrierEvent } from '@prisma/client';

export interface CarrierTrackingData {
  containerNumber: string;
  billOfLading?: string;
  bookingNumber?: string;
  status: string;
  location?: string;
  vesselName?: string;
  voyageNumber?: string;
  etd?: Date;
  eta?: Date;
  actualDeparture?: Date;
  actualArrival?: Date;
  events: CarrierEventData[];
}

export interface CarrierEventData {
  eventType: string;
  eventDate: Date;
  location?: string;
  description?: string;
  status?: string;
  vesselName?: string;
  voyageNumber?: string;
}

export interface CarrierCredentials {
  apiKey?: string;
  apiSecret?: string;
  username?: string;
  password?: string;
  baseUrl?: string;
  webhookUrl?: string;
}

export interface CarrierAdapter {
  /**
   * Get tracking information for a container or shipment
   */
  getTrackingData(identifier: string, credentials: CarrierCredentials): Promise<CarrierTrackingData>;

  /**
   * Get multiple containers tracking data
   */
  getBulkTrackingData(identifiers: string[], credentials: CarrierCredentials): Promise<CarrierTrackingData[]>;

  /**
   * Subscribe to webhook notifications for tracking updates
   */
  subscribeToWebhooks(identifiers: string[], credentials: CarrierCredentials): Promise<void>;

  /**
   * Unsubscribe from webhook notifications
   */
  unsubscribeFromWebhooks(identifiers: string[], credentials: CarrierCredentials): Promise<void>;

  /**
   * Validate carrier credentials
   */
  validateCredentials(credentials: CarrierCredentials): Promise<boolean>;

  /**
   * Get available services/routes
   */
  getAvailableServices(origin: string, destination: string, credentials: CarrierCredentials): Promise<any[]>;

  /**
   * Get rates for a shipment
   */
  getRates(shipmentData: any, credentials: CarrierCredentials): Promise<any[]>;
}

export interface CarrierIntegrationConfig {
  carrier: string;
  enabled: boolean;
  credentials: CarrierCredentials;
  pollingInterval: number; // in minutes
  webhookEnabled: boolean;
  rateLimitPerMinute: number;
}

export interface CarrierPollingJob {
  id: string;
  carrier: string;
  identifiers: string[];
  lastPolled: Date;
  nextPoll: Date;
  status: 'active' | 'paused' | 'error';
  errorCount: number;
  lastError?: string;
}