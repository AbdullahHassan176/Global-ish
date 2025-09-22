import { Injectable } from '@nestjs/common';
import { BaseCarrierAdapter } from './base-carrier.adapter';
import { 
  CarrierTrackingData, 
  CarrierCredentials, 
  CarrierEventData 
} from '../interfaces/carrier-adapter.interface';

@Injectable()
export class CmaCgmAdapter extends BaseCarrierAdapter {
  private readonly baseUrl = 'https://api.cma-cgm.com';

  async getTrackingData(identifier: string, credentials: CarrierCredentials): Promise<CarrierTrackingData> {
    this.validateRequiredCredentials(credentials, ['apiKey', 'apiSecret']);
    
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
    this.validateRequiredCredentials(credentials, ['apiKey', 'apiSecret']);
    
    const results: CarrierTrackingData[] = [];
    
    // CMA CGM supports batch tracking
    try {
      const url = `${this.baseUrl}/tracking/v1/containers/batch`;
      const rawData = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({ 
          containerNumbers: identifiers,
          includeEvents: true,
        }),
      }, credentials);

      for (const item of rawData.containers || []) {
        results.push(this.parseTrackingData(item));
      }
    } catch (error) {
      this.logger.error('Failed to get CMA CGM bulk tracking data:', error);
      throw error;
    }

    return results;
  }

  async subscribeToWebhooks(identifiers: string[], credentials: CarrierCredentials): Promise<void> {
    this.validateRequiredCredentials(credentials, ['apiKey', 'apiSecret', 'webhookUrl']);
    
    try {
      const url = `${this.baseUrl}/webhooks/v1/subscriptions`;
      await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          containerNumbers: identifiers,
          webhookUrl: credentials.webhookUrl,
          events: ['CONTAINER_STATUS_CHANGE', 'LOCATION_UPDATE', 'ETA_UPDATE', 'VESSEL_CHANGE'],
          retryPolicy: {
            maxRetries: 3,
            retryDelay: 300, // seconds
          },
        }),
      }, credentials);

      this.logger.log(`Subscribed to CMA CGM webhooks for ${identifiers.length} containers`);
    } catch (error) {
      this.logger.error('Failed to subscribe to CMA CGM webhooks:', error);
      throw error;
    }
  }

  async unsubscribeFromWebhooks(identifiers: string[], credentials: CarrierCredentials): Promise<void> {
    this.validateRequiredCredentials(credentials, ['apiKey', 'apiSecret']);
    
    try {
      const url = `${this.baseUrl}/webhooks/v1/subscriptions`;
      await this.makeRequest(url, {
        method: 'DELETE',
        body: JSON.stringify({ containerNumbers: identifiers }),
      }, credentials);

      this.logger.log(`Unsubscribed from CMA CGM webhooks for ${identifiers.length} containers`);
    } catch (error) {
      this.logger.error('Failed to unsubscribe from CMA CGM webhooks:', error);
      throw error;
    }
  }

  async validateCredentials(credentials: CarrierCredentials): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/auth/v1/validate`;
      await this.makeRequest(url, { method: 'GET' }, credentials);
      return true;
    } catch (error) {
      this.logger.warn('Invalid CMA CGM credentials:', error);
      return false;
    }
  }

  async getAvailableServices(origin: string, destination: string, credentials: CarrierCredentials): Promise<any[]> {
    this.validateRequiredCredentials(credentials, ['apiKey', 'apiSecret']);
    
    try {
      const url = `${this.baseUrl}/services/v1/schedules`;
      const params = new URLSearchParams({
        originPort: origin,
        destinationPort: destination,
        serviceType: 'FCL',
        includeTransshipment: 'true',
      });

      const rawData = await this.makeRequest(`${url}?${params}`, {
        method: 'GET',
      }, credentials);

      return rawData.schedules || [];
    } catch (error) {
      this.logger.error('Failed to get CMA CGM available services:', error);
      throw error;
    }
  }

  async getRates(shipmentData: any, credentials: CarrierCredentials): Promise<any[]> {
    this.validateRequiredCredentials(credentials, ['apiKey', 'apiSecret']);
    
    try {
      const url = `${this.baseUrl}/rates/v1/quote`;
      const rawData = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          ...shipmentData,
          currency: shipmentData.currency || 'USD',
          includeSurcharges: true,
        }),
      }, credentials);

      return rawData.rates || [];
    } catch (error) {
      this.logger.error('Failed to get CMA CGM rates:', error);
      throw error;
    }
  }

  protected getAuthHeaders(credentials: CarrierCredentials): Record<string, string> {
    // CMA CGM uses API key + secret authentication
    const authString = Buffer.from(`${credentials.apiKey}:${credentials.apiSecret}`).toString('base64');
    
    return {
      'Authorization': `Basic ${authString}`,
      'X-CMA-CGM-Client': 'GlobalNext-Logistics',
      'Accept': 'application/json',
    };
  }

  protected parseEventData(rawEvent: any): CarrierEventData {
    return {
      eventType: rawEvent.eventType || rawEvent.type || 'unknown',
      eventDate: new Date(rawEvent.eventDate || rawEvent.date || rawEvent.timestamp),
      location: rawEvent.location || rawEvent.port || rawEvent.terminal,
      description: rawEvent.description || rawEvent.remarks || rawEvent.comments,
      status: rawEvent.status || rawEvent.state || rawEvent.condition,
      vesselName: rawEvent.vesselName || rawEvent.vessel,
      voyageNumber: rawEvent.voyageNumber || rawEvent.voyage,
    };
  }

  protected parseTrackingData(rawData: any): CarrierTrackingData {
    const events = (rawData.trackingEvents || rawData.events || rawData.milestones || []).map((event: any) => this.parseEventData(event));

    return {
      containerNumber: rawData.containerNumber || rawData.container,
      billOfLading: rawData.billOfLading || rawData.blNumber || rawData.bl,
      bookingNumber: rawData.bookingNumber || rawData.booking || rawData.bookingRef,
      status: rawData.status || rawData.currentStatus || rawData.condition || 'unknown',
      location: rawData.currentLocation || rawData.location || rawData.port,
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
