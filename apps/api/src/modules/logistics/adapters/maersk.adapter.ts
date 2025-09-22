import { Injectable } from '@nestjs/common';
import { BaseCarrierAdapter } from './base-carrier.adapter';
import { 
  CarrierTrackingData, 
  CarrierCredentials, 
  CarrierEventData 
} from '../interfaces/carrier-adapter.interface';

@Injectable()
export class MaerskAdapter extends BaseCarrierAdapter {
  private readonly baseUrl = 'https://api.maersk.com';

  async getTrackingData(identifier: string, credentials: CarrierCredentials): Promise<CarrierTrackingData> {
    this.validateRequiredCredentials(credentials, ['apiKey']);
    
    try {
      const url = `${this.baseUrl}/tracking/v1/containers/${identifier}`;
      const rawData = await this.makeRequest(url, {
        method: 'GET',
      }, credentials);

      return this.parseTrackingData(rawData);
    } catch (error) {
      this.logger.error(`Failed to get tracking data for ${identifier}:`, error);
      throw error;
    }
  }

  async getBulkTrackingData(identifiers: string[], credentials: CarrierCredentials): Promise<CarrierTrackingData[]> {
    this.validateRequiredCredentials(credentials, ['apiKey']);
    
    const results: CarrierTrackingData[] = [];
    
    // Maersk supports bulk tracking via batch API
    try {
      const url = `${this.baseUrl}/tracking/v1/containers/batch`;
      const rawData = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({ containerNumbers: identifiers }),
      }, credentials);

      for (const item of rawData.containers || []) {
        results.push(this.parseTrackingData(item));
      }
    } catch (error) {
      this.logger.error('Failed to get bulk tracking data:', error);
      throw error;
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
          containerNumbers: identifiers,
          webhookUrl: credentials.webhookUrl,
          events: ['status_change', 'location_update', 'eta_change'],
        }),
      }, credentials);

      this.logger.log(`Subscribed to webhooks for ${identifiers.length} containers`);
    } catch (error) {
      this.logger.error('Failed to subscribe to webhooks:', error);
      throw error;
    }
  }

  async unsubscribeFromWebhooks(identifiers: string[], credentials: CarrierCredentials): Promise<void> {
    this.validateRequiredCredentials(credentials, ['apiKey']);
    
    try {
      const url = `${this.baseUrl}/webhooks/v1/subscriptions`;
      await this.makeRequest(url, {
        method: 'DELETE',
        body: JSON.stringify({ containerNumbers: identifiers }),
      }, credentials);

      this.logger.log(`Unsubscribed from webhooks for ${identifiers.length} containers`);
    } catch (error) {
      this.logger.error('Failed to unsubscribe from webhooks:', error);
      throw error;
    }
  }

  async validateCredentials(credentials: CarrierCredentials): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/auth/v1/validate`;
      await this.makeRequest(url, { method: 'GET' }, credentials);
      return true;
    } catch (error) {
      this.logger.warn('Invalid Maersk credentials:', error);
      return false;
    }
  }

  async getAvailableServices(origin: string, destination: string, credentials: CarrierCredentials): Promise<any[]> {
    this.validateRequiredCredentials(credentials, ['apiKey']);
    
    try {
      const url = `${this.baseUrl}/services/v1/routes`;
      const params = new URLSearchParams({
        origin,
        destination,
        serviceType: 'container',
      });

      const rawData = await this.makeRequest(`${url}?${params}`, {
        method: 'GET',
      }, credentials);

      return rawData.services || [];
    } catch (error) {
      this.logger.error('Failed to get available services:', error);
      throw error;
    }
  }

  async getRates(shipmentData: any, credentials: CarrierCredentials): Promise<any[]> {
    this.validateRequiredCredentials(credentials, ['apiKey']);
    
    try {
      const url = `${this.baseUrl}/rates/v1/quote`;
      const rawData = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(shipmentData),
      }, credentials);

      return rawData.rates || [];
    } catch (error) {
      this.logger.error('Failed to get rates:', error);
      throw error;
    }
  }

  protected getAuthHeaders(credentials: CarrierCredentials): Record<string, string> {
    return {
      'Authorization': `Bearer ${credentials.apiKey}`,
      'X-API-Version': 'v1',
    };
  }

  protected parseEventData(rawEvent: any): CarrierEventData {
    return {
      eventType: rawEvent.eventType || 'unknown',
      eventDate: new Date(rawEvent.eventDate),
      location: rawEvent.location,
      description: rawEvent.description,
      status: rawEvent.status,
      vesselName: rawEvent.vesselName,
      voyageNumber: rawEvent.voyageNumber,
    };
  }

  protected parseTrackingData(rawData: any): CarrierTrackingData {
    const events = (rawData.events || []).map((event: any) => this.parseEventData(event));

    return {
      containerNumber: rawData.containerNumber,
      billOfLading: rawData.billOfLading,
      bookingNumber: rawData.bookingNumber,
      status: rawData.status || 'unknown',
      location: rawData.currentLocation,
      vesselName: rawData.vesselName,
      voyageNumber: rawData.voyageNumber,
      etd: rawData.etd ? new Date(rawData.etd) : undefined,
      eta: rawData.eta ? new Date(rawData.eta) : undefined,
      actualDeparture: rawData.actualDeparture ? new Date(rawData.actualDeparture) : undefined,
      actualArrival: rawData.actualArrival ? new Date(rawData.actualArrival) : undefined,
      events,
    };
  }
}