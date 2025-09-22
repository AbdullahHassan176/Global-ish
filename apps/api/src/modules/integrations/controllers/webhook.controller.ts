import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { WebhookService } from '../services/webhook.service';
import { 
  CreateWebhookEndpointDto, 
  UpdateWebhookEndpointDto,
  WebhookDeliveryQueryDto,
  TestWebhookDto
} from '../dto/integrations.dto';
import { JwtAuthGuard } from '../../../../packages/auth/src/guards/jwt-auth.guard';
import { RequirePermission } from '../../../../packages/auth/src/decorators/require-permission.decorator';
import { CurrentUser } from '../../../../packages/auth/src/decorators/current-user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('integrations/webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @RequirePermission('integrations.webhook.create')
  createWebhookEndpoint(
    @Body() createWebhookDto: CreateWebhookEndpointDto,
    @CurrentUser() user: User,
  ) {
    return this.webhookService.createWebhookEndpoint(createWebhookDto, user.id);
  }

  @Get()
  @RequirePermission('integrations.webhook.read')
  findAllWebhookEndpoints(@CurrentUser() user: User) {
    return this.webhookService.findAllWebhookEndpoints(user.id);
  }

  @Get(':id')
  @RequirePermission('integrations.webhook.read')
  findWebhookEndpointById(@Param('id') id: string) {
    return this.webhookService.findWebhookEndpointById(id);
  }

  @Patch(':id')
  @RequirePermission('integrations.webhook.update')
  updateWebhookEndpoint(
    @Param('id') id: string,
    @Body() updateWebhookDto: UpdateWebhookEndpointDto,
  ) {
    return this.webhookService.updateWebhookEndpoint(id, updateWebhookDto);
  }

  @Delete(':id')
  @RequirePermission('integrations.webhook.delete')
  deleteWebhookEndpoint(@Param('id') id: string) {
    return this.webhookService.deleteWebhookEndpoint(id);
  }

  @Post('test')
  @RequirePermission('integrations.webhook.test')
  testWebhookEndpoint(@Body() testWebhookDto: TestWebhookDto) {
    return this.webhookService.testWebhookEndpoint(
      testWebhookDto.webhookId,
      testWebhookDto.testPayload
    );
  }

  @Get('deliveries')
  @RequirePermission('integrations.webhook.read')
  getWebhookDeliveries(@Query() query: WebhookDeliveryQueryDto) {
    return this.webhookService.getWebhookDeliveries(query);
  }

  @Post('deliveries/:deliveryId/retry')
  @RequirePermission('integrations.webhook.update')
  retryWebhookDelivery(@Param('deliveryId') deliveryId: string) {
    return this.webhookService.retryFailedDelivery(deliveryId);
  }

  @Get('deliveries/:deliveryId/status')
  @RequirePermission('integrations.webhook.read')
  getWebhookDeliveryStatus(@Param('deliveryId') deliveryId: string) {
    return this.webhookService.getDeliveryStatus(deliveryId);
  }
}
