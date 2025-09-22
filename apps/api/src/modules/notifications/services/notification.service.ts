import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { 
  NotificationRequest, 
  NotificationResult, 
  NotificationType,
  NotificationChannel,
  NotificationPriority
} from '../interfaces/notification.interface';
import { EmailService } from './email.service';
import { SMSService } from './sms.service';
import { WebhookService } from './webhook.service';
import { TemplateService } from './template.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private smsService: SMSService,
    private webhookService: WebhookService,
    private templateService: TemplateService
  ) {}

  async sendNotification(request: NotificationRequest): Promise<NotificationResult> {
    try {
      // Get user preferences
      const preferences = await this.getUserPreferences(request.userId, request.type);
      
      // Filter channels based on preferences
      const enabledChannels = request.channels.filter(channel => 
        this.isChannelEnabled(channel, preferences)
      );

      if (enabledChannels.length === 0) {
        this.logger.warn(`No enabled channels for user ${request.userId} and type ${request.type}`);
        return {
          notificationId: '',
          status: 'failed',
          channels: [],
          error: 'No enabled channels'
        };
      }

      // Create notification record
      const notification = await this.prisma.notification.create({
        data: {
          userId: request.userId,
          type: request.type,
          title: request.title,
          message: request.message,
          data: request.data || {},
          sentAt: new Date()
        }
      });

      // Send through each enabled channel
      const channelResults = await Promise.allSettled(
        enabledChannels.map(channel => this.sendToChannel(notification.id, request, channel))
      );

      const results: any[] = [];
      let hasSuccess = false;

      channelResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
          hasSuccess = true;
        } else {
          results.push({
            channel: enabledChannels[index],
            status: 'failed',
            error: result.reason?.message || 'Unknown error'
          });
        }
      });

      // Update notification status
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          sentAt: hasSuccess ? new Date() : null
        }
      });

      return {
        notificationId: notification.id,
        status: hasSuccess ? 'sent' : 'failed',
        channels: results,
        sentAt: hasSuccess ? new Date() : undefined
      };

    } catch (error) {
      this.logger.error('Failed to send notification', error);
      throw error;
    }
  }

  async sendBulkNotifications(requests: NotificationRequest[]): Promise<NotificationResult[]> {
    const results = await Promise.allSettled(
      requests.map(request => this.sendNotification(request))
    );

    return results.map(result => 
      result.status === 'fulfilled' ? result.value : {
        notificationId: '',
        status: 'failed',
        channels: [],
        error: result.reason?.message || 'Unknown error'
      }
    );
  }

  async getUserNotifications(
    userId: string, 
    page: number = 1, 
    limit: number = 20,
    unreadOnly: boolean = false
  ): Promise<{ notifications: any[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: any = { userId };

    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.notification.count({ where })
    ]);

    return { notifications, total };
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    await this.prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId
      }
    });
  }

  async getUserPreferences(userId: string, type?: NotificationType): Promise<any[]> {
    const where: any = { userId };
    if (type) {
      where.type = type;
    }

    return this.prisma.notificationPreference.findMany({
      where
    });
  }

  async updateUserPreferences(
    userId: string, 
    preferences: Array<{
      type: NotificationType;
      inApp: boolean;
      email: boolean;
      sms: boolean;
      webhook: boolean;
    }>
  ): Promise<void> {
    for (const pref of preferences) {
      await this.prisma.notificationPreference.upsert({
        where: {
          userId_type: {
            userId,
            type: pref.type
          }
        },
        update: {
          inApp: pref.inApp,
          email: pref.email,
          sms: pref.sms,
          webhook: pref.webhook
        },
        create: {
          userId,
          type: pref.type,
          inApp: pref.inApp,
          email: pref.email,
          sms: pref.sms,
          webhook: pref.webhook
        }
      });
    }
  }

  async getNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
  }> {
    const [total, unread, byType] = await Promise.all([
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
      this.prisma.notification.groupBy({
        by: ['type'],
        where: { userId },
        _count: { type: true }
      })
    ]);

    const typeStats = byType.reduce((acc, item) => {
      acc[item.type] = item._count.type;
      return acc;
    }, {} as Record<string, number>);

    return { total, unread, byType: typeStats };
  }

  private async sendToChannel(
    notificationId: string, 
    request: NotificationRequest, 
    channel: NotificationChannel
  ): Promise<any> {
    try {
      switch (channel) {
        case NotificationChannel.IN_APP:
          return await this.sendInApp(notificationId, request);
        case NotificationChannel.EMAIL:
          return await this.sendEmail(notificationId, request);
        case NotificationChannel.SMS:
          return await this.sendSMS(notificationId, request);
        case NotificationChannel.WEBHOOK:
          return await this.sendWebhook(notificationId, request);
        case NotificationChannel.PUSH:
          return await this.sendPush(notificationId, request);
        default:
          throw new Error(`Unsupported notification channel: ${channel}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send notification to ${channel}`, error);
      return {
        channel,
        status: 'failed',
        error: error.message
      };
    }
  }

  private async sendInApp(notificationId: string, request: NotificationRequest): Promise<any> {
    // In-app notifications are already stored in the database
    return {
      channel: NotificationChannel.IN_APP,
      status: 'sent',
      sentAt: new Date()
    };
  }

  private async sendEmail(notificationId: string, request: NotificationRequest): Promise<any> {
    // Get user email
    const user = await this.prisma.user.findUnique({
      where: { id: request.userId },
      select: { email: true, name: true }
    });

    if (!user?.email) {
      throw new Error('User email not found');
    }

    // Get template
    const template = await this.templateService.getTemplate(request.type, NotificationChannel.EMAIL);
    
    // Render template
    const rendered = await this.templateService.renderTemplate(template, {
      title: request.title,
      message: request.message,
      userName: user.name,
      data: request.data
    });

    // Send email
    const result = await this.emailService.sendEmail({
      to: user.email,
      subject: rendered.subject || request.title,
      html: rendered.html,
      text: rendered.text,
      priority: request.priority
    });

    return {
      channel: NotificationChannel.EMAIL,
      status: result.status,
      externalId: result.messageId,
      sentAt: new Date(),
      error: result.error
    };
  }

  private async sendSMS(notificationId: string, request: NotificationRequest): Promise<any> {
    // Get user phone number
    const user = await this.prisma.user.findUnique({
      where: { id: request.userId },
      select: { attributes: true }
    });

    const phoneNumber = user?.attributes?.phoneNumber;
    if (!phoneNumber) {
      throw new Error('User phone number not found');
    }

    // Send SMS
    const result = await this.smsService.sendSMS({
      to: phoneNumber,
      message: request.message,
      priority: request.priority
    });

    return {
      channel: NotificationChannel.SMS,
      status: result.status,
      externalId: result.messageId,
      sentAt: new Date(),
      error: result.error
    };
  }

  private async sendWebhook(notificationId: string, request: NotificationRequest): Promise<any> {
    // Get user webhook URL
    const user = await this.prisma.user.findUnique({
      where: { id: request.userId },
      select: { attributes: true }
    });

    const webhookUrl = user?.attributes?.webhookUrl;
    if (!webhookUrl) {
      throw new Error('User webhook URL not found');
    }

    // Send webhook
    const result = await this.webhookService.sendWebhook({
      url: webhookUrl,
      method: 'POST',
      body: {
        notificationId,
        type: request.type,
        title: request.title,
        message: request.message,
        data: request.data,
        timestamp: new Date().toISOString()
      }
    });

    return {
      channel: NotificationChannel.WEBHOOK,
      status: result.status,
      externalId: result.requestId,
      sentAt: new Date(),
      error: result.error
    };
  }

  private async sendPush(notificationId: string, request: NotificationRequest): Promise<any> {
    // Mock push notification implementation
    this.logger.log(`Sending push notification to user ${request.userId}`);
    
    return {
      channel: NotificationChannel.PUSH,
      status: 'sent',
      sentAt: new Date()
    };
  }

  private isChannelEnabled(channel: NotificationChannel, preferences: any[]): boolean {
    const preference = preferences.find(p => p.type === channel);
    if (!preference) return true; // Default to enabled if no preference set

    switch (channel) {
      case NotificationChannel.IN_APP:
        return preference.inApp;
      case NotificationChannel.EMAIL:
        return preference.email;
      case NotificationChannel.SMS:
        return preference.sms;
      case NotificationChannel.WEBHOOK:
        return preference.webhook;
      case NotificationChannel.PUSH:
        return preference.push;
      default:
        return false;
    }
  }
}
