import { Injectable, Logger } from '@nestjs/common';
import { RequestInit } from 'node-fetch';
import { 
  CarrierAdapter, 
  CarrierTrackingData, 
  CarrierCredentials, 
  CarrierEventData 
} from '../interfaces/carrier-adapter.interface';

@Injectable()
export abstract class BaseCarrierAdapter implements CarrierAdapter {
  protected readonly logger = new Logger(this.constructor.name);

  abstract getTrackingData(identifier: string, credentials: CarrierCredentials): Promise<CarrierTrackingData>;
  abstract getBulkTrackingData(identifiers: string[], credentials: CarrierCredentials): Promise<CarrierTrackingData[]>;
  abstract subscribeToWebhooks(identifiers: string[], credentials: CarrierCredentials): Promise<void>;
  abstract unsubscribeFromWebhooks(identifiers: string[], credentials: CarrierCredentials): Promise<void>;
  abstract validateCredentials(credentials: CarrierCredentials): Promise<boolean>;
  abstract getAvailableServices(origin: string, destination: string, credentials: CarrierCredentials): Promise<any[]>;
  abstract getRates(shipmentData: any, credentials: CarrierCredentials): Promise<any[]>;

  /**
   * Common method to make HTTP requests with error handling
   */
  protected async makeRequest(
    url: string, 
    options: RequestInit, 
    credentials: CarrierCredentials
  ): Promise<any> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'GlobalNext-Logistics/1.0',
          ...this.getAuthHeaders(credentials),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error(`Request failed for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Get authentication headers based on carrier type
   */
  protected abstract getAuthHeaders(credentials: CarrierCredentials): Record<string, string>;

  /**
   * Parse carrier-specific event data into standardized format
   */
  protected abstract parseEventData(rawEvent: any): CarrierEventData;

  /**
   * Parse carrier-specific tracking data into standardized format
   */
  protected abstract parseTrackingData(rawData: any): CarrierTrackingData;

  /**
   * Handle rate limiting
   */
  protected async handleRateLimit(delay: number = 1000): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Validate required credentials
   */
  protected validateRequiredCredentials(credentials: CarrierCredentials, required: string[]): void {
    for (const field of required) {
      if (!credentials[field as keyof CarrierCredentials]) {
        throw new Error(`Missing required credential: ${field}`);
      }
    }
  }
}
