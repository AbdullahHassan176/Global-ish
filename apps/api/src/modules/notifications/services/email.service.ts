import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailProvider, EmailRequest, EmailResult } from '../interfaces/notification.interface';
import * as axios from 'axios';

@Injectable()
export class EmailService implements EmailProvider {
  private readonly logger = new Logger(EmailService.name);
  private config: any;

  constructor(private configService: ConfigService) {
    this.config = {
      provider: this.configService.get('EMAIL_PROVIDER', 'sendgrid'),
      apiKey: this.configService.get('EMAIL_API_KEY'),
      fromEmail: this.configService.get('EMAIL_FROM', 'noreply@globalnext.com'),
      fromName: this.configService.get('EMAIL_FROM_NAME', 'Global Next'),
      baseUrl: this.configService.get('EMAIL_BASE_URL')
    };
  }

  async sendEmail(request: EmailRequest): Promise<EmailResult> {
    try {
      switch (this.config.provider) {
        case 'sendgrid':
          return await this.sendWithSendGrid(request);
        case 'ses':
          return await this.sendWithSES(request);
        case 'mailgun':
          return await this.sendWithMailgun(request);
        case 'smtp':
          return await this.sendWithSMTP(request);
        default:
          throw new Error(`Unsupported email provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error('Failed to send email', error);
      return {
        messageId: '',
        status: 'failed',
        error: error.message
      };
    }
  }

  private async sendWithSendGrid(request: EmailRequest): Promise<EmailResult> {
    if (!this.config.apiKey) {
      throw new Error('SendGrid API key not configured');
    }

    try {
      const emailData = {
        personalizations: [
          {
            to: Array.isArray(request.to) ? request.to.map(email => ({ email })) : [{ email: request.to }],
            cc: request.cc ? (Array.isArray(request.cc) ? request.cc.map(email => ({ email })) : [{ email: request.cc }]) : undefined,
            bcc: request.bcc ? (Array.isArray(request.bcc) ? request.bcc.map(email => ({ email })) : [{ email: request.bcc }]) : undefined
          }
        ],
        from: {
          email: this.config.fromEmail,
          name: this.config.fromName
        },
        subject: request.subject,
        content: [
          {
            type: 'text/plain',
            value: request.text || ''
          },
          {
            type: 'text/html',
            value: request.html || ''
          }
        ],
        attachments: request.attachments?.map(attachment => ({
          content: attachment.content.toString('base64'),
          type: attachment.contentType,
          filename: attachment.filename,
          disposition: attachment.disposition || 'attachment',
          content_id: attachment.cid
        }))
      };

      const response = await axios.default.post(
        'https://api.sendgrid.com/v3/mail/send',
        emailData,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        messageId: response.headers['x-message-id'] || 'unknown',
        status: 'sent'
      };
    } catch (error) {
      this.logger.error('SendGrid email failed', error);
      return {
        messageId: '',
        status: 'failed',
        error: error.response?.data?.errors?.[0]?.message || error.message
      };
    }
  }

  private async sendWithSES(request: EmailRequest): Promise<EmailResult> {
    // Mock AWS SES implementation
    this.logger.log('Sending email with AWS SES (mock implementation)');
    
    return {
      messageId: `ses_${Date.now()}`,
      status: 'sent'
    };
  }

  private async sendWithMailgun(request: EmailRequest): Promise<EmailResult> {
    if (!this.config.apiKey || !this.config.baseUrl) {
      throw new Error('Mailgun API key and base URL not configured');
    }

    try {
      const formData = new FormData();
      formData.append('from', `${this.config.fromName} <${this.config.fromEmail}>`);
      formData.append('to', Array.isArray(request.to) ? request.to.join(',') : request.to);
      formData.append('subject', request.subject);
      
      if (request.text) {
        formData.append('text', request.text);
      }
      
      if (request.html) {
        formData.append('html', request.html);
      }

      if (request.cc) {
        formData.append('cc', Array.isArray(request.cc) ? request.cc.join(',') : request.cc);
      }

      if (request.bcc) {
        formData.append('bcc', Array.isArray(request.bcc) ? request.bcc.join(',') : request.bcc);
      }

      const response = await axios.default.post(
        `${this.config.baseUrl}/messages`,
        formData,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`api:${this.config.apiKey}`).toString('base64')}`
          }
        }
      );

      return {
        messageId: response.data.id,
        status: 'sent'
      };
    } catch (error) {
      this.logger.error('Mailgun email failed', error);
      return {
        messageId: '',
        status: 'failed',
        error: error.response?.data?.message || error.message
      };
    }
  }

  private async sendWithSMTP(request: EmailRequest): Promise<EmailResult> {
    // Mock SMTP implementation
    this.logger.log('Sending email with SMTP (mock implementation)');
    
    return {
      messageId: `smtp_${Date.now()}`,
      status: 'sent'
    };
  }
}
