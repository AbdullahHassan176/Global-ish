import { Injectable } from '@nestjs/common';
import { BaseCarrierAdapter } from './base-carrier.adapter';
import { 
  CarrierTrackingData, 
  CarrierCredentials, 
  CarrierEventData 
} from '../interfaces/carrier-adapter.interface';

@Injectable()
export class MscAdapter extends BaseCarrierAdapter {
  private readonly baseUrl = 'https://api.msc.com';

  async getTrackingData(identifier: string, credentials: CarrierCredentials): Promise<CarrierTrackingData> {
    this.validateRequiredCredentials(credentials, ['apiKey']);
    
    try {
      const url = `${this.baseUrl}/tracking/v2/containers/${identifier}`;
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
    
    // MSC processes bulk requests individually
    for (const identifier of identifiers) {
      try {
        const trackingData = await this.getTrackingData(identifier, credentials);
        results.push(trackingData);
        await this.handleRateLimit(500); // MSC rate limit
      } catch (error) {
        this.logger.warn(`Failed to get tracking data for ${identifier}:`, error);
        // Continue with other containers
      }
    }

    return results;
  }

  async subscribeToWebhooks(identifiers: string[], credentials: CarrierCredentials): Promise<void> {
    this.validateRequiredCredentials(credentials, ['apiKey', 'webhookUrl']);
    
    try {
      const url = `${this.baseUrl}/notifications/v1/subscribe`;
      await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          containerNumbers: identifiers,
          callbackUrl: credentials.webhookUrl,
          notificationTypes: ['STATUS_UPDATE', 'LOCATION_UPDATE', 'ETA_UPDATE'],
        }),
      }, credentials);

      this.logger.log(`Subscribed to MSC webhooks for ${identifiers.length} containers`);
    } catch (error) {
      this.logger.error('Failed to subscribe to MSC webhooks:', error);
      throw error;
    }
  }

  async unsubscribeFromWebhooks(identifiers: string[], credentials: CarrierCredentials): Promise<void> {
    this.validateRequiredCredentials(credentials, ['apiKey']);
    
    try {
      const url = `${this.baseUrl}/notifications/v1/unsubscribe`;
      await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({ containerNumbers: identifiers }),
      }, credentials);

      this.logger.log(`Unsubscribed from MSC webhooks for ${identifiers.length} containers`);
    } catch (error) {
      this.logger.error('Failed to unsubscribe from MSC webhooks:', error);
      throw error;
    }
  }

  async validateCredentials(credentials: CarrierCredentials): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/auth/v1/token/validate`;
      await this.makeRequest(url, { method: 'GET' }, credentials);
      return true;
    } catch (error) {
      this.logger.warn('Invalid MSC credentials:', error);
      return false;
    }
  }

  async getAvailableServices(origin: string, destination: string, credentials: CarrierCredentials): Promise<any[]> {
    this.validateRequiredCredentials(credentials, ['apiKey']);
    
    try {
      const url = `${this.baseUrl}/services/v1/schedules`;
      const params = new URLSearchParams({
        originPort: origin,
        destinationPort: destination,
        serviceType: 'FCL',
      });

      const rawData = await this.makeRequest(`${url}?${params}`, {
        method: 'GET',
      }, credentials);

      return rawData.schedules || [];
    } catch (error) {
      this.logger.error('Failed to get MSC available services:', error);
      throw error;
    }
  }

  async getRates(shipmentData: any, credentials: CarrierCredentials): Promise<any[]> {
    this.validateRequiredCredentials(credentials, ['apiKey']);
    
    try {
      const url = `${this.baseUrl}/rates/v1/request`;
      const rawData = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(shipmentData),
      }, credentials);

      return rawData.rateQuotes || [];
    } catch (error) {
      this.logger.error('Failed to get MSC rates:', error);
      throw error;
    }
  }

  protected getAuthHeaders(credentials: CarrierCredentials): Record<string, string> {
    return {
      'Authorization': `Bearer ${credentials.apiKey}`,
      'X-MSC-Client': 'GlobalNext-Logistics',
      'Accept': 'application/json',
    };
  }

  protected parseEventData(rawEvent: any): CarrierEventData {
    return {
      eventType: rawEvent.eventType || rawEvent.type || 'unknown',
      eventDate: new Date(rawEvent.eventDate || rawEvent.date),
      location: rawEvent.location || rawEvent.port,
      description: rawEvent.description || rawEvent.remarks,
      status: rawEvent.status || rawEvent.state,
      vesselName: rawEvent.vesselName || rawEvent.vessel,
      voyageNumber: rawEvent.voyageNumber || rawEvent.voyage,
    };
  }

  protected parseTrackingData(rawData: any): CarrierTrackingData {
    const events = (rawData.trackingEvents || rawData.events || []).map((event: any) => this.parseEventData(event));

    return {
      containerNumber: rawData.containerNumber || rawData.container,
      billOfLading: rawData.billOfLading || rawData.blNumber,
      bookingNumber: rawData.bookingNumber || rawData.booking,
      status: rawData.status || rawData.currentStatus || 'unknown',
      location: rawData.currentLocation || rawData.location,
      vesselName: rawData.vesselName || rawData.vessel,
      voyageNumber: rawData.voyageNumber || rawData.voyage,
      etd: rawData.etd ? new Date(rawData.etd) : undefined,
      eta: rawData.eta ? new Date(rawData.eta) : undefined,
      actualDeparture: rawData.actualDeparture ? new Date(rawData.actualDeparture) : undefined,
      actualArrival: rawData.actualArrival ? new Date(rawData.actualArrival) : undefined,
      events,
    };
  }
}
