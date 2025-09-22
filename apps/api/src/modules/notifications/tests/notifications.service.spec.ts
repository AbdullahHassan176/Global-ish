import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../services/notification.service';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { WebhookService } from '../services/webhook.service';
import { TemplateService } from '../services/template.service';
import { PrismaService } from '../../../common/prisma.service';
import { NotificationType } from '@prisma/client';

describe('NotificationService', () => {
  let service: NotificationService;
  let prismaService: PrismaService;
  let emailService: EmailService;
  let smsService: SmsService;
  let webhookService: WebhookService;
  let templateService: TemplateService;

  const mockPrismaService = {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    notificationPreference: {
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
  };

  const mockEmailService = {
    sendEmail: jest.fn(),
  };

  const mockSmsService = {
    sendSms: jest.fn(),
  };

  const mockWebhookService = {
    sendWebhook: jest.fn(),
  };

  const mockTemplateService = {
    renderTemplate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: SmsService,
          useValue: mockSmsService,
        },
        {
          provide: WebhookService,
          useValue: mockWebhookService,
        },
        {
          provide: TemplateService,
          useValue: mockTemplateService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prismaService = module.get<PrismaService>(PrismaService);
    emailService = module.get<EmailService>(EmailService);
    smsService = module.get<SmsService>(SmsService);
    webhookService = module.get<WebhookService>(WebhookService);
    templateService = module.get<TemplateService>(TemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendNotification', () => {
    it('should send notification through multiple channels', async () => {
      const userId = 'user1';
      const type = NotificationType.TASK_ASSIGNED;
      const title = 'New Task Assigned';
      const message = 'You have been assigned to a new task';
      const data = { taskId: '1', taskTitle: 'Implement authentication' };
      const channels = ['in_app', 'email', 'sms'];

      const expectedNotification = {
        id: '1',
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
        sentAt: new Date(),
        readAt: null,
        createdAt: new Date(),
      };

      // Mock preferences
      mockPrismaService.notificationPreference.findMany.mockResolvedValue([
        {
          type: NotificationType.TASK_ASSIGNED,
          inApp: true,
          email: true,
          sms: true,
          webhook: false,
        },
      ]);

      // Mock notification creation
      mockPrismaService.notification.create.mockResolvedValue(expectedNotification);

      // Mock template rendering
      mockTemplateService.renderTemplate.mockResolvedValue({
        email: { subject: 'New Task Assigned', html: '<p>You have been assigned to a new task</p>' },
        sms: 'New Task Assigned: You have been assigned to a new task',
      });

      // Mock channel services
      mockEmailService.sendEmail.mockResolvedValue({ success: true });
      mockSmsService.sendSms.mockResolvedValue({ success: true });

      const result = await service.sendNotification(userId, type, title, message, data, channels);

      expect(result).toEqual(expectedNotification);
      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId,
          type,
          title,
          message,
          data,
          isRead: false,
          sentAt: expect.any(Date),
        },
      });
      expect(mockEmailService.sendEmail).toHaveBeenCalled();
      expect(mockSmsService.sendSms).toHaveBeenCalled();
    });

    it('should respect user preferences', async () => {
      const userId = 'user1';
      const type = NotificationType.TASK_ASSIGNED;
      const title = 'New Task Assigned';
      const message = 'You have been assigned to a new task';
      const data = {};
      const channels = ['in_app', 'email', 'sms'];

      // Mock preferences - user has disabled email and SMS
      mockPrismaService.notificationPreference.findMany.mockResolvedValue([
        {
          type: NotificationType.TASK_ASSIGNED,
          inApp: true,
          email: false,
          sms: false,
          webhook: false,
        },
      ]);

      mockPrismaService.notification.create.mockResolvedValue({
        id: '1',
        userId,
        type,
        title,
        message,
        data,
        isRead: false,
        sentAt: new Date(),
        readAt: null,
        createdAt: new Date(),
      });

      const result = await service.sendNotification(userId, type, title, message, data, channels);

      expect(result).toBeDefined();
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
      expect(mockSmsService.sendSms).not.toHaveBeenCalled();
    });
  });

  describe('getNotifications', () => {
    it('should return paginated notifications', async () => {
      const query = {
        page: '1',
        limit: '10',
        type: NotificationType.TASK_ASSIGNED,
        isRead: 'false',
      };
      const userId = 'user1';

      const mockNotifications = [
        {
          id: '1',
          userId: 'user1',
          type: NotificationType.TASK_ASSIGNED,
          title: 'New Task Assigned',
          message: 'You have been assigned to a new task',
          data: { taskId: '1' },
          isRead: false,
          sentAt: new Date(),
          readAt: null,
          createdAt: new Date(),
        },
        {
          id: '2',
          userId: 'user1',
          type: NotificationType.TASK_ASSIGNED,
          title: 'Another Task Assigned',
          message: 'You have been assigned to another task',
          data: { taskId: '2' },
          isRead: false,
          sentAt: new Date(),
          readAt: null,
          createdAt: new Date(),
        },
      ];

      mockPrismaService.notification.findMany.mockResolvedValue(mockNotifications);
      mockPrismaService.notification.count.mockResolvedValue(2);

      const result = await service.getNotifications(query, userId);

      expect(result).toEqual({
        notifications: mockNotifications,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      });
      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          type: NotificationType.TASK_ASSIGNED,
          isRead: false,
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notificationId = '1';
      const userId = 'user1';

      const expectedResult = {
        id: '1',
        isRead: true,
        readAt: new Date(),
      };

      mockPrismaService.notification.update.mockResolvedValue(expectedResult);

      const result = await service.markAsRead(notificationId, userId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.notification.update).toHaveBeenCalledWith({
        where: { id: notificationId, userId },
        data: { isRead: true, readAt: expect.any(Date) },
      });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const userId = 'user1';

      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markAllAsRead(userId);

      expect(result).toEqual({ success: true, updatedCount: 5 });
      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: { userId, isRead: false },
        data: { isRead: true, readAt: expect.any(Date) },
      });
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      const notificationId = '1';
      const userId = 'user1';

      mockPrismaService.notification.delete.mockResolvedValue({ id: '1' });

      const result = await service.deleteNotification(notificationId, userId);

      expect(result).toEqual({ success: true });
      expect(mockPrismaService.notification.delete).toHaveBeenCalledWith({
        where: { id: notificationId, userId },
      });
    });
  });

  describe('getPreferences', () => {
    it('should return user notification preferences', async () => {
      const userId = 'user1';

      const mockPreferences = [
        {
          id: '1',
          userId: 'user1',
          type: NotificationType.TASK_ASSIGNED,
          inApp: true,
          email: true,
          sms: false,
          webhook: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: 'user1',
          type: NotificationType.TASK_DUE,
          inApp: true,
          email: true,
          sms: true,
          webhook: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.notificationPreference.findMany.mockResolvedValue(mockPreferences);

      const result = await service.getPreferences(userId);

      expect(result).toEqual(mockPreferences);
      expect(mockPrismaService.notificationPreference.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { type: 'asc' },
      });
    });
  });

  describe('updatePreferences', () => {
    it('should update user notification preferences', async () => {
      const userId = 'user1';
      const updatePreferencesDto = {
        preferences: [
          {
            type: NotificationType.TASK_ASSIGNED,
            inApp: true,
            email: false,
            sms: false,
            webhook: false,
          },
          {
            type: NotificationType.TASK_DUE,
            inApp: true,
            email: true,
            sms: true,
            webhook: false,
          },
        ],
      };

      mockPrismaService.notificationPreference.upsert.mockResolvedValue({});

      const result = await service.updatePreferences(updatePreferencesDto, userId);

      expect(result).toEqual({ success: true, updatedCount: 2 });
      expect(mockPrismaService.notificationPreference.upsert).toHaveBeenCalledTimes(2);
    });
  });

  describe('getNotificationStats', () => {
    it('should return notification statistics', async () => {
      const userId = 'user1';

      // Mock total count
      mockPrismaService.notification.count.mockResolvedValueOnce(25);

      // Mock unread count
      mockPrismaService.notification.count.mockResolvedValueOnce(8);

      // Mock counts by type
      mockPrismaService.notification.count.mockResolvedValueOnce(5); // TASK_ASSIGNED
      mockPrismaService.notification.count.mockResolvedValueOnce(3); // TASK_DUE
      mockPrismaService.notification.count.mockResolvedValueOnce(4); // WORKFLOW_STEP
      mockPrismaService.notification.count.mockResolvedValueOnce(2); // FILE_UPLOADED
      mockPrismaService.notification.count.mockResolvedValueOnce(1); // APPROVAL_REQUIRED

      const result = await service.getNotificationStats(userId);

      expect(result).toEqual({
        total: 25,
        unread: 8,
        byType: {
          [NotificationType.TASK_ASSIGNED]: 5,
          [NotificationType.TASK_DUE]: 3,
          [NotificationType.WORKFLOW_STEP]: 4,
          [NotificationType.FILE_UPLOADED]: 2,
          [NotificationType.APPROVAL_REQUIRED]: 1,
        },
        byChannel: {
          in_app: 25,
          email: 18,
          sms: 5,
          webhook: 3,
        },
      });
    });
  });
});
