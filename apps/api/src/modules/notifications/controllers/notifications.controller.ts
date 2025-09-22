import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from '../services/notification.service';
import { JwtAuthGuard } from '@global-next/auth';
import { RequirePermission } from '@global-next/auth';
import { CurrentUser } from '@global-next/auth';
import { User } from '@global-next/types';
import { NotificationType, NotificationChannel } from '../interfaces/notification.interface';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  @RequirePermission('notifications', 'read')
  async getNotifications(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('unreadOnly') unreadOnly: string = 'false',
    @CurrentUser() user: User
  ) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const unreadOnlyBool = unreadOnly === 'true';

    const result = await this.notificationService.getUserNotifications(
      user.id, 
      pageNum, 
      limitNum, 
      unreadOnlyBool
    );

    return {
      ...result,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(result.total / limitNum)
      }
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get notification statistics' })
  @ApiResponse({ status: 200, description: 'Notification statistics retrieved successfully' })
  @RequirePermission('notifications', 'read')
  async getNotificationStats(@CurrentUser() user: User) {
    return await this.notificationService.getNotificationStats(user.id);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get user notification preferences' })
  @ApiResponse({ status: 200, description: 'Notification preferences retrieved successfully' })
  @RequirePermission('notifications', 'read')
  async getPreferences(
    @Query('type') type: string,
    @CurrentUser() user: User
  ) {
    return await this.notificationService.getUserPreferences(
      user.id, 
      type as NotificationType
    );
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Update user notification preferences' })
  @ApiResponse({ status: 200, description: 'Notification preferences updated successfully' })
  @RequirePermission('notifications', 'write')
  async updatePreferences(
    @Body() body: {
      preferences: Array<{
        type: NotificationType;
        inApp: boolean;
        email: boolean;
        sms: boolean;
        webhook: boolean;
      }>;
    },
    @CurrentUser() user: User
  ) {
    await this.notificationService.updateUserPreferences(user.id, body.preferences);
    return { message: 'Notification preferences updated successfully' };
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read successfully' })
  @RequirePermission('notifications', 'write')
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    await this.notificationService.markAsRead(id, user.id);
    return { message: 'Notification marked as read successfully' };
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read successfully' })
  @RequirePermission('notifications', 'write')
  async markAllAsRead(@CurrentUser() user: User) {
    await this.notificationService.markAllAsRead(user.id);
    return { message: 'All notifications marked as read successfully' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted successfully' })
  @RequirePermission('notifications', 'write')
  async deleteNotification(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    await this.notificationService.deleteNotification(id, user.id);
    return { message: 'Notification deleted successfully' };
  }

  @Post('send')
  @ApiOperation({ summary: 'Send notification (admin only)' })
  @ApiResponse({ status: 201, description: 'Notification sent successfully' })
  @RequirePermission('notifications', 'manage')
  async sendNotification(
    @Body() body: {
      userId: string;
      type: NotificationType;
      title: string;
      message: string;
      data?: Record<string, any>;
      channels: NotificationChannel[];
      priority?: string;
    },
    @CurrentUser() user: User
  ) {
    const result = await this.notificationService.sendNotification({
      userId: body.userId,
      type: body.type,
      title: body.title,
      message: body.message,
      data: body.data,
      channels: body.channels,
      priority: body.priority as any
    });

    return result;
  }

  @Post('send-bulk')
  @ApiOperation({ summary: 'Send bulk notifications (admin only)' })
  @ApiResponse({ status: 201, description: 'Bulk notifications sent successfully' })
  @RequirePermission('notifications', 'manage')
  async sendBulkNotifications(
    @Body() body: {
      requests: Array<{
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
        data?: Record<string, any>;
        channels: NotificationChannel[];
        priority?: string;
      }>;
    },
    @CurrentUser() user: User
  ) {
    const results = await this.notificationService.sendBulkNotifications(body.requests);
    return results;
  }
}
