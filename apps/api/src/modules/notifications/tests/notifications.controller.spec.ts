import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from '../controllers/notifications.controller';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '@prisma/client';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let notificationService: NotificationService;

  const mockNotificationService = {
    getNotifications: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    deleteNotification: jest.fn(),
    getPreferences: jest.fn(),
    updatePreferences: jest.fn(),
    sendNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNotifications', () => {
    it('should return paginated notifications', async () => {
      const query = {
        page: '1',
        limit: '10',
        type: NotificationType.TASK_ASSIGNED,
        isRead: 'false',
      };

      const expectedResult = {
        notifications: [
          {
            id: '1',
            userId: 'user1',
            type: NotificationType.TASK_ASSIGNED,
            title: 'New Task Assigned',
            message: 'You have been assigned to "Implement user authentication" task',
            data: { taskId: '1', taskTitle: 'Implement user authentication' },
            isRead: false,
            sentAt: new Date('2024-01-17T10:30:00Z'),
            readAt: null,
            createdAt: new Date('2024-01-17T10:30:00Z'),
          },
          {
            id: '2',
            userId: 'user1',
            type: NotificationType.WORKFLOW_STEP,
            title: 'Workflow Step Completed',
            message: 'Legal Review step has been completed in Contract Approval Process',
            data: { workflowId: '1', stepName: 'Legal Review' },
            isRead: false,
            sentAt: new Date('2024-01-17T09:15:00Z'),
            readAt: null,
            createdAt: new Date('2024-01-17T09:15:00Z'),
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      };

      mockNotificationService.getNotifications.mockResolvedValue(expectedResult);

      const result = await controller.getNotifications(query, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockNotificationService.getNotifications).toHaveBeenCalledWith(query, 'user1');
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notificationId = '1';
      const expectedResult = {
        id: '1',
        isRead: true,
        readAt: new Date(),
      };

      mockNotificationService.markAsRead.mockResolvedValue(expectedResult);

      const result = await controller.markAsRead(notificationId, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockNotificationService.markAsRead).toHaveBeenCalledWith(notificationId, 'user1');
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const expectedResult = {
        success: true,
        updatedCount: 5,
      };

      mockNotificationService.markAllAsRead.mockResolvedValue(expectedResult);

      const result = await controller.markAllAsRead({ user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockNotificationService.markAllAsRead).toHaveBeenCalledWith('user1');
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      const notificationId = '1';
      const expectedResult = {
        success: true,
      };

      mockNotificationService.deleteNotification.mockResolvedValue(expectedResult);

      const result = await controller.deleteNotification(notificationId, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockNotificationService.deleteNotification).toHaveBeenCalledWith(notificationId, 'user1');
    });
  });

  describe('getPreferences', () => {
    it('should return user notification preferences', async () => {
      const expectedResult = [
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
        {
          id: '3',
          userId: 'user1',
          type: NotificationType.WORKFLOW_STEP,
          inApp: true,
          email: true,
          sms: false,
          webhook: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockNotificationService.getPreferences.mockResolvedValue(expectedResult);

      const result = await controller.getPreferences({ user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockNotificationService.getPreferences).toHaveBeenCalledWith('user1');
    });
  });

  describe('updatePreferences', () => {
    it('should update user notification preferences', async () => {
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

      const expectedResult = {
        success: true,
        updatedCount: 2,
      };

      mockNotificationService.updatePreferences.mockResolvedValue(expectedResult);

      const result = await controller.updatePreferences(updatePreferencesDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockNotificationService.updatePreferences).toHaveBeenCalledWith(updatePreferencesDto, 'user1');
    });
  });

  describe('sendTestNotification', () => {
    it('should send a test notification', async () => {
      const testNotificationDto = {
        type: NotificationType.INFO,
        title: 'Test Notification',
        message: 'This is a test notification',
        channels: ['in_app', 'email'],
      };

      const expectedResult = {
        success: true,
        notificationId: 'test-1',
        sentChannels: ['in_app', 'email'],
      };

      mockNotificationService.sendNotification.mockResolvedValue(expectedResult);

      const result = await controller.sendTestNotification(testNotificationDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
        'user1',
        testNotificationDto.type,
        testNotificationDto.title,
        testNotificationDto.message,
        {},
        testNotificationDto.channels
      );
    });
  });

  describe('getNotificationStats', () => {
    it('should return notification statistics', async () => {
      const expectedResult = {
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
      };

      mockNotificationService.getNotificationStats.mockResolvedValue(expectedResult);

      const result = await controller.getNotificationStats({ user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockNotificationService.getNotificationStats).toHaveBeenCalledWith('user1');
    });
  });
});
