export interface NotificationProvider {
  send(notification: NotificationRequest): Promise<NotificationResult>;
  getStatus(notificationId: string): Promise<NotificationStatus>;
}

export interface NotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  channels: NotificationChannel[];
  priority?: NotificationPriority;
  scheduledAt?: Date;
  expiresAt?: Date;
}

export interface NotificationResult {
  notificationId: string;
  status: 'sent' | 'failed' | 'scheduled';
  channels: ChannelResult[];
  sentAt?: Date;
  error?: string;
}

export interface ChannelResult {
  channel: NotificationChannel;
  status: 'sent' | 'failed' | 'scheduled';
  externalId?: string;
  error?: string;
  sentAt?: Date;
}

export interface NotificationStatus {
  notificationId: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'expired';
  channels: ChannelStatus[];
  sentAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
}

export interface ChannelStatus {
  channel: NotificationChannel;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'expired';
  externalId?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  failedAt?: Date;
  error?: string;
}

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_DUE = 'TASK_DUE',
  WORKFLOW_STEP = 'WORKFLOW_STEP',
  FILE_UPLOADED = 'FILE_UPLOADED',
  APPROVAL_REQUIRED = 'APPROVAL_REQUIRED'
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  SMS = 'sms',
  WEBHOOK = 'webhook',
  PUSH = 'push'
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface EmailProvider {
  sendEmail(request: EmailRequest): Promise<EmailResult>;
}

export interface EmailRequest {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  templateData?: Record<string, any>;
  attachments?: EmailAttachment[];
  priority?: NotificationPriority;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
  disposition?: 'attachment' | 'inline';
  cid?: string;
}

export interface EmailResult {
  messageId: string;
  status: 'sent' | 'failed';
  error?: string;
}

export interface SMSProvider {
  sendSMS(request: SMSRequest): Promise<SMSResult>;
}

export interface SMSRequest {
  to: string;
  message: string;
  from?: string;
  priority?: NotificationPriority;
}

export interface SMSResult {
  messageId: string;
  status: 'sent' | 'failed';
  error?: string;
}

export interface WebhookProvider {
  sendWebhook(request: WebhookRequest): Promise<WebhookResult>;
}

export interface WebhookRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

export interface WebhookResult {
  requestId: string;
  status: 'sent' | 'failed';
  statusCode?: number;
  response?: any;
  error?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  channel: NotificationChannel;
  subject?: string;
  template: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreference {
  userId: string;
  type: NotificationType;
  inApp: boolean;
  email: boolean;
  sms: boolean;
  webhook: boolean;
  push: boolean;
}

export interface NotificationConfig {
  email: {
    provider: 'sendgrid' | 'ses' | 'mailgun' | 'smtp';
    apiKey?: string;
    fromEmail: string;
    fromName?: string;
    baseUrl?: string;
  };
  sms: {
    provider: 'twilio' | 'aws-sns' | 'messagebird';
    apiKey?: string;
    fromNumber?: string;
    baseUrl?: string;
  };
  webhook: {
    timeout: number;
    retries: number;
    retryDelay: number;
  };
  templates: {
    baseUrl: string;
    cacheTtl: number;
  };
}
