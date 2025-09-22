import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { QueueService } from '../services/queue.service';
import { JwtAuthGuard } from '../../../../packages/auth/src/guards/jwt-auth.guard';
import { RequirePermission } from '../../../../packages/auth/src/decorators/require-permission.decorator';
import { CurrentUser } from '../../../../packages/auth/src/decorators/current-user.decorator';
import { User, Carrier } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('logistics/queues')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get('stats')
  @RequirePermission('logistics.queue.read')
  async getQueueStats() {
    return this.queueService.getQueueStats();
  }

  @Get('jobs/:queueName')
  @RequirePermission('logistics.queue.read')
  async getQueueJobs(
    @Param('queueName') queueName: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
  ) {
    // This would need to be implemented in QueueService
    // For now, return queue stats
    const stats = await this.queueService.getQueueStats();
    return stats[queueName] || null;
  }

  @Get('jobs/:queueName/:jobId')
  @RequirePermission('logistics.queue.read')
  async getJobDetails(
    @Param('queueName') queueName: string,
    @Param('jobId') jobId: string,
  ) {
    return this.queueService.getJobDetails(queueName, jobId);
  }

  @Post('carrier-polling')
  @RequirePermission('logistics.queue.create')
  async addCarrierPollingJob(
    @Body() data: {
      carrier: Carrier;
      shipmentId?: string;
      containerNumber?: string;
      trackingNumber?: string;
      delay?: number;
    },
    @CurrentUser() user: User,
  ) {
    const { carrier, shipmentId, containerNumber, trackingNumber, delay } = data;

    if (delay) {
      return this.queueService.scheduleCarrierPolling(
        { carrier, shipmentId, containerNumber, trackingNumber },
        delay,
      );
    } else {
      return this.queueService.addCarrierPollingJob({
        carrier,
        shipmentId,
        containerNumber,
        trackingNumber,
      });
    }
  }

  @Post('carrier-polling/recurring')
  @RequirePermission('logistics.queue.create')
  async scheduleRecurringCarrierPolling(
    @Body() data: {
      carrier: Carrier;
      interval?: number;
    },
    @CurrentUser() user: User,
  ) {
    const { carrier, interval = 300000 } = data; // 5 minutes default
    return this.queueService.scheduleRecurringCarrierPolling(carrier, interval);
  }

  @Post('webhook')
  @RequirePermission('logistics.queue.create')
  async addWebhookJob(
    @Body() data: {
      carrier: Carrier;
      payload: any;
      webhookUrl?: string;
      signature?: string;
    },
    @CurrentUser() user: User,
  ) {
    const { carrier, payload, webhookUrl, signature } = data;
    return this.queueService.addWebhookJob({
      carrier,
      payload,
      webhookUrl,
      signature,
    });
  }

  @Patch('pause/:queueName')
  @RequirePermission('logistics.queue.update')
  async pauseQueue(
    @Param('queueName') queueName: string,
    @CurrentUser() user: User,
  ) {
    await this.queueService.pauseQueue(queueName);
    return { message: `Queue ${queueName} paused successfully` };
  }

  @Patch('resume/:queueName')
  @RequirePermission('logistics.queue.update')
  async resumeQueue(
    @Param('queueName') queueName: string,
    @CurrentUser() user: User,
  ) {
    await this.queueService.resumeQueue(queueName);
    return { message: `Queue ${queueName} resumed successfully` };
  }

  @Post('retry/:queueName/:jobId')
  @RequirePermission('logistics.queue.update')
  async retryJob(
    @Param('queueName') queueName: string,
    @Param('jobId') jobId: string,
    @CurrentUser() user: User,
  ) {
    await this.queueService.retryJob(queueName, jobId);
    return { message: `Job ${jobId} retried successfully` };
  }

  @Delete('jobs/:queueName/:jobId')
  @RequirePermission('logistics.queue.delete')
  async removeJob(
    @Param('queueName') queueName: string,
    @Param('jobId') jobId: string,
    @CurrentUser() user: User,
  ) {
    await this.queueService.removeJob(queueName, jobId);
    return { message: `Job ${jobId} removed successfully` };
  }

  @Delete('clear/:queueName')
  @RequirePermission('logistics.queue.delete')
  async clearQueue(
    @Param('queueName') queueName: string,
    @CurrentUser() user: User,
  ) {
    await this.queueService.clearQueue(queueName);
    return { message: `Queue ${queueName} cleared successfully` };
  }
}
