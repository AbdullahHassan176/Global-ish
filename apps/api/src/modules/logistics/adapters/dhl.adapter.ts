import { Injectable } from '@nestjs/common';
import { BaseCarrierAdapter } from './base-carrier.adapter';
import { 
  CarrierTrackingData, 
  CarrierCredentials, 
  CarrierEventData 
} from '../interfaces/carrier-adapter.interface';

@Injectable()
export class DhlAdapter extends BaseCarrierAdapter {
  private readonly baseUrl = 'https://api-eu.dhl.com';

  async getTrackingData(identifier: string, credentials: CarrierCredentials): Promise<CarrierTrackingData> {
    this.validateRequiredCredentials(credentials, ['apiKey']);
    
    try {
      const url = `${this.baseUrl}/track/shipments`;
      const params = new URLSearchParams({
        trackingNumber: identifier,
        service: 'express',
      });

      const rawData = await this.makeRequest(`${url}?${params}`, {
        method: 'GET',
      }, credentials);

      return this.parseTrackingData(rawData);
    } catch (error) {
      this.logger.error(`Failed to get DHL tracking data for ${identifier}:`, error);
      throw error;
    }
  }

  async getBulkTrackingData(identifiers: string[], credentials: CarrierCredentials): Promise<CarrierTrackingData[]> {
    this.validateRequiredCredentials(credentials, ['apiKey']);
    
    const results: CarrierTrackingData[] = [];
    
    // DHL processes bulk requests individually
    for (const identifier of identifiers) {
      try {
        const trackingData = await this.getTrackingData(identifier, credentials);
        results.push(trackingData);
        await this.handleRateLimit(200); // DHL rate limit
      } catch (error) {
        this.logger.warn(`Failed to get DHL tracking data for ${identifier}:`, error);
        // Continue with other shipments
      }
    }

    return results;
  }

  async subscribeToWebhooks(identifiers: string[], credentials: CarrierCredentials): Promise<void> {
    this.validateRequiredCredentials(credentials, ['apiKey', 'webhookUrl']);
    
    try {
      const url = `${this.baseUrl}/webhooks/v1/subscriptions`;
      await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          trackingNumbers: identifiers,
          webhookUrl: credentials.webhookUrl,
          events: ['SHIPMENT_PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'EXCEPTION'],
          language: 'en',
        }),
      }, credentials);

      this.logger.log(`Subscribed to DHL webhooks for ${identifiers.length} shipments`);
    } catch (error) {
      this.logger.error('Failed to subscribe to DHL webhooks:', error);
      throw error;
    }
  }

  async unsubscribeFromWebhooks(identifiers: string[], credentials: CarrierCredentials): Promise<void> {
    this.validateRequiredCredentials(credentials, ['apiKey']);
    
    try {
      const url = `${this.baseUrl}/webhooks/v1/subscriptions`;
      await this.makeRequest(url, {
        method: 'DELETE',
        body: JSON.stringify({ trackingNumbers: identifiers }),
      }, credentials);

      this.logger.log(`Unsubscribed from DHL webhooks for ${identifiers.length} shipments`);
    } catch (error) {
      this.logger.error('Failed to unsubscribe from DHL webhooks:', error);
      throw error;
    }
  }

  async validateCredentials(credentials: CarrierCredentials): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/auth/v1/validate`;
      await this.makeRequest(url, { method: 'GET' }, credentials);
      return true;
    } catch (error) {
      this.logger.warn('Invalid DHL credentials:', error);
      return false;
    }
  }

  async getAvailableServices(origin: string, destination: string, credentials: CarrierCredentials): Promise<any[]> {
    this.validateRequiredCredentials(credentials, ['apiKey']);
    
    try {
      const url = `${this.baseUrl}/services/v1/products`;
      const params = new URLSearchParams({
        originCountryCode: origin,
        destinationCountryCode: destination,
        serviceType: 'express',
      });

      const rawData = await this.makeRequest(`${url}?${params}`, {
        method: 'GET',
      }, credentials);

      return rawData.products || [];
    } catch (error) {
      this.logger.error('Failed to get DHL available services:', error);
      throw error;
    }
  }

  async getRates(shipmentData: any, credentials: CarrierCredentials): Promise<any[]> {
    this.validateRequiredCredentials(credentials, ['apiKey']);
    
    try {
      const url = `${this.baseUrl}/rates/v1/quote`;
      const rawData = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          ...shipmentData,
          serviceType: 'express',
          currency: shipmentData.currency || 'USD',
        }),
      }, credentials);

      return rawData.rates || [];
    } catch (error) {
      this.logger.error('Failed to get DHL rates:', error);
      throw error;
    }
  }

  protected getAuthHeaders(credentials: CarrierCredentials): Record<string, string> {
    return {
      'Authorization': `Bearer ${credentials.apiKey}`,
      'DHL-API-Key': credentials.apiKey,
      'Accept': 'application/json',
    };
  }

  protected parseEventData(rawEvent: any): CarrierEventData {
    return {
      eventType: rawEvent.eventType || rawEvent.status || 'unknown',
      eventDate: new Date(rawEvent.eventDate || rawEvent.timestamp),
      location: rawEvent.location || rawEvent.address?.city,
      description: rawEvent.description || rawEvent.remarks,
      status: rawEvent.status || rawEvent.condition,
      vesselName: undefined, // DHL doesn't use vessels
      voyageNumber: undefined, // DHL doesn't use voyages
    };
  }

  protected parseTrackingData(rawData: any): CarrierTrackingData {
    const events = (rawData.events || rawData.trackingEvents || []).map((event: any) => this.parseEventData(event));

    return {
      containerNumber: rawData.trackingNumber || rawData.shipmentId,
      billOfLading: rawData.waybillNumber,
      bookingNumber: rawData.bookingNumber,
      status: rawData.status || rawData.currentStatus || 'unknown',
      location: rawData.currentLocation || rawData.lastLocation,
      vesselName: undefined, // DHL doesn't use vessels
      voyageNumber: undefined, // DHL doesn't use voyages
      etd: rawData.etd ? new Date(rawData.etd) : undefined,
      eta: rawData.eta ? new Date(rawData.eta) : undefined,
      actualDeparture: rawData.actualDeparture ? new Date(rawData.actualDeparture) : undefined,
      actualArrival: rawData.actualArrival ? new Date(rawData.actualArrival) : undefined,
      events,
    };
  }
}
