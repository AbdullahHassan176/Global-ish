import { Injectable, Logger } from '@nestjs/common';
import { WebhookProvider, WebhookRequest, WebhookResult } from '../interfaces/notification.interface';
import * as axios from 'axios';

@Injectable()
export class WebhookService implements WebhookProvider {
  private readonly logger = new Logger(WebhookService.name);

  async sendWebhook(request: WebhookRequest): Promise<WebhookResult> {
    try {
      const config: any = {
        method: request.method,
        url: request.url,
        timeout: request.timeout || 30000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Global-Next-Webhook/1.0',
          ...request.headers
        }
      };

      if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        config.data = request.body;
      }

      const response = await axios.default(config);

      return {
        requestId: `webhook_${Date.now()}`,
        status: 'sent',
        statusCode: response.status,
        response: response.data
      };
    } catch (error) {
      this.logger.error('Webhook request failed', error);
      
      return {
        requestId: `webhook_${Date.now()}`,
        status: 'failed',
        statusCode: error.response?.status,
        error: error.message,
        response: error.response?.data
      };
    }
  }
}
