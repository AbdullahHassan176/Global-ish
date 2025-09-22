import { Injectable } from '@nestjs/common';
import { BaseCarrierAdapter } from './base-carrier.adapter';
import { 
  CarrierTrackingData, 
  CarrierCredentials, 
  CarrierEventData 
} from '../interfaces/carrier-adapter.interface';

@Injectable()
export class FedexAdapter extends BaseCarrierAdapter {
  private readonly baseUrl = 'https://api.fedex.com';

  async getTrackingData(identifier: string, credentials: CarrierCredentials): Promise<CarrierTrackingData> {
    this.validateRequiredCredentials(credentials, ['apiKey', 'apiSecret']);
    
    try {
      const url = `${this.baseUrl}/track/v1/trackingnumbers`;
      const rawData = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          includeDetailedScans: true,
          trackingInfo: [{
            trackingNumberInfo: {
              trackingNumber: identifier,
            },
          }],
        }),
      }, credentials);

      return this.parseTrackingData(rawData);
    } catch (error) {
      this.logger.error(`Failed to get FedEx tracking data for ${identifier}:`, error);
      throw error;
    }
  }

  async getBulkTrackingData(identifiers: string[], credentials: CarrierCredentials): Promise<CarrierTrackingData[]> {
    this.validateRequiredCredentials(credentials, ['apiKey', 'apiSecret']);
    
    const results: CarrierTrackingData[] = [];
    
    // FedEx supports bulk tracking
    try {
      const url = `${this.baseUrl}/track/v1/trackingnumbers`;
      const rawData = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          includeDetailedScans: true,
          trackingInfo: identifiers.map(id => ({
            trackingNumberInfo: {
              trackingNumber: id,
            },
          })),
        }),
      }, credentials);

      for (const item of rawData.output?.completeTrackResults || []) {
        results.push(this.parseTrackingData(item));
      }
    } catch (error) {
      this.logger.error('Failed to get FedEx bulk tracking data:', error);
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
          trackingNumbers: identifiers,
          webhookUrl: credentials.webhookUrl,
          events: ['TRACKING_UPDATE', 'DELIVERY_UPDATE', 'EXCEPTION_UPDATE'],
          includeDetailedScans: true,
        }),
      }, credentials);

      this.logger.log(`Subscribed to FedEx webhooks for ${identifiers.length} shipments`);
    } catch (error) {
      this.logger.error('Failed to subscribe to FedEx webhooks:', error);
      throw error;
    }
  }

  async unsubscribeFromWebhooks(identifiers: string[], credentials: CarrierCredentials): Promise<void> {
    this.validateRequiredCredentials(credentials, ['apiKey', 'apiSecret']);
    
    try {
      const url = `${this.baseUrl}/webhooks/v1/subscriptions`;
      await this.makeRequest(url, {
        method: 'DELETE',
        body: JSON.stringify({ trackingNumbers: identifiers }),
      }, credentials);

      this.logger.log(`Unsubscribed from FedEx webhooks for ${identifiers.length} shipments`);
    } catch (error) {
      this.logger.error('Failed to unsubscribe from FedEx webhooks:', error);
      throw error;
    }
  }

  async validateCredentials(credentials: CarrierCredentials): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/oauth/token`;
      const response = await this.makeRequest(url, {
        method: 'POST',
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: credentials.apiKey!,
          client_secret: credentials.apiSecret!,
        }).toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }, credentials);
      
      return !!response.access_token;
    } catch (error) {
      this.logger.warn('Invalid FedEx credentials:', error);
      return false;
    }
  }

  async getAvailableServices(origin: string, destination: string, credentials: CarrierCredentials): Promise<any[]> {
    this.validateRequiredCredentials(credentials, ['apiKey', 'apiSecret']);
    
    try {
      const url = `${this.baseUrl}/rate/v1/rates/quotes`;
      const rawData = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          accountNumber: {
            value: credentials.username, // FedEx account number
          },
          requestedShipment: {
            shipper: {
              address: {
                countryCode: origin,
              },
            },
            recipients: [{
              address: {
                countryCode: destination,
              },
            }],
            serviceType: 'INTERNATIONAL_PRIORITY',
            rateRequestType: ['ACCOUNT'],
          },
        }),
      }, credentials);

      return rawData.output?.rateReplyDetails || [];
    } catch (error) {
      this.logger.error('Failed to get FedEx available services:', error);
      throw error;
    }
  }

  async getRates(shipmentData: any, credentials: CarrierCredentials): Promise<any[]> {
    this.validateRequiredCredentials(credentials, ['apiKey', 'apiSecret']);
    
    try {
      const url = `${this.baseUrl}/rate/v1/rates/quotes`;
      const rawData = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify({
          accountNumber: {
            value: credentials.username, // FedEx account number
          },
          requestedShipment: {
            ...shipmentData,
            rateRequestType: ['ACCOUNT', 'LIST'],
          },
        }),
      }, credentials);

      return rawData.output?.rateReplyDetails || [];
    } catch (error) {
      this.logger.error('Failed to get FedEx rates:', error);
      throw error;
    }
  }

  protected getAuthHeaders(credentials: CarrierCredentials): Record<string, string> {
    return {
      'Authorization': `Bearer ${credentials.apiKey}`,
      'X-locale': 'en_US',
      'Content-Type': 'application/json',
    };
  }

  protected parseEventData(rawEvent: any): CarrierEventData {
    return {
      eventType: rawEvent.eventType || rawEvent.eventDescription || 'unknown',
      eventDate: new Date(rawEvent.timestamp || rawEvent.date),
      location: rawEvent.address?.city || rawEvent.location,
      description: rawEvent.eventDescription || rawEvent.description,
      status: rawEvent.eventType || rawEvent.status,
      vesselName: undefined, // FedEx doesn't use vessels
      voyageNumber: undefined, // FedEx doesn't use voyages
    };
  }

  protected parseTrackingData(rawData: any): CarrierTrackingData {
    const trackingResult = rawData.trackResults?.[0] || rawData;
    const events = (trackingResult.scanEvents || trackingResult.events || []).map((event: any) => this.parseEventData(event));

    return {
      containerNumber: trackingResult.trackingNumber || trackingResult.trackingNumberInfo?.trackingNumber,
      billOfLading: trackingResult.waybillNumber,
      bookingNumber: trackingResult.bookingNumber,
      status: trackingResult.latestStatusDetail?.code || trackingResult.status || 'unknown',
      location: trackingResult.latestStatusDetail?.scanLocation?.city || trackingResult.currentLocation,
      vesselName: undefined, // FedEx doesn't use vessels
      voyageNumber: undefined, // FedEx doesn't use voyages
      etd: trackingResult.estimatedDeliveryTimestamp ? new Date(trackingResult.estimatedDeliveryTimestamp) : undefined,
      eta: trackingResult.estimatedDeliveryTimestamp ? new Date(trackingResult.estimatedDeliveryTimestamp) : undefined,
      actualDeparture: trackingResult.actualPickupTimestamp ? new Date(trackingResult.actualPickupTimestamp) : undefined,
      actualArrival: trackingResult.actualDeliveryTimestamp ? new Date(trackingResult.actualDeliveryTimestamp) : undefined,
      events,
    };
  }
}
