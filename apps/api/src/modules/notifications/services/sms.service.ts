import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SMSProvider, SMSRequest, SMSResult } from '../interfaces/notification.interface';
import * as axios from 'axios';

@Injectable()
export class SMSService implements SMSProvider {
  private readonly logger = new Logger(SMSService.name);
  private config: any;

  constructor(private configService: ConfigService) {
    this.config = {
      provider: this.configService.get('SMS_PROVIDER', 'twilio'),
      apiKey: this.configService.get('SMS_API_KEY'),
      apiSecret: this.configService.get('SMS_API_SECRET'),
      fromNumber: this.configService.get('SMS_FROM_NUMBER'),
      baseUrl: this.configService.get('SMS_BASE_URL')
    };
  }

  async sendSMS(request: SMSRequest): Promise<SMSResult> {
    try {
      switch (this.config.provider) {
        case 'twilio':
          return await this.sendWithTwilio(request);
        case 'aws-sns':
          return await this.sendWithAWSSNS(request);
        case 'messagebird':
          return await this.sendWithMessageBird(request);
        default:
          throw new Error(`Unsupported SMS provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error('Failed to send SMS', error);
      return {
        messageId: '',
        status: 'failed',
        error: error.message
      };
    }
  }

  private async sendWithTwilio(request: SMSRequest): Promise<SMSResult> {
    if (!this.config.apiKey || !this.config.apiSecret) {
      throw new Error('Twilio API key and secret not configured');
    }

    try {
      const auth = Buffer.from(`${this.config.apiKey}:${this.config.apiSecret}`).toString('base64');
      
      const response = await axios.default.post(
        'https://api.twilio.com/2010-04-01/Accounts/' + this.config.apiKey + '/Messages.json',
        new URLSearchParams({
          To: request.to,
          From: request.from || this.config.fromNumber,
          Body: request.message
        }),
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return {
        messageId: response.data.sid,
        status: 'sent'
      };
    } catch (error) {
      this.logger.error('Twilio SMS failed', error);
      return {
        messageId: '',
        status: 'failed',
        error: error.response?.data?.message || error.message
      };
    }
  }

  private async sendWithAWSSNS(request: SMSRequest): Promise<SMSResult> {
    // Mock AWS SNS implementation
    this.logger.log('Sending SMS with AWS SNS (mock implementation)');
    
    return {
      messageId: `sns_${Date.now()}`,
      status: 'sent'
    };
  }

  private async sendWithMessageBird(request: SMSRequest): Promise<SMSResult> {
    if (!this.config.apiKey) {
      throw new Error('MessageBird API key not configured');
    }

    try {
      const response = await axios.default.post(
        'https://rest.messagebird.com/messages',
        {
          recipients: [request.to],
          originator: request.from || this.config.fromNumber,
          body: request.message
        },
        {
          headers: {
            'Authorization': `AccessKey ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        messageId: response.data.id,
        status: 'sent'
      };
    } catch (error) {
      this.logger.error('MessageBird SMS failed', error);
      return {
        messageId: '',
        status: 'failed',
        error: error.response?.data?.errors?.[0]?.description || error.message
      };
    }
  }
}
