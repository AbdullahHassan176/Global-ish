import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query,
  Patch,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../packages/auth/src/guards/jwt-auth.guard';
import { PolicyGuard } from '../../../packages/auth/src/guards/policy.guard';
import { RequirePermission } from '../../../packages/auth/src/decorators/require-permission.decorator';
import { CurrentUser } from '../../../packages/auth/src/decorators/current-user.decorator';
import { AlertsService } from '../services/alerts.service';

@Controller('logistics/alerts')
@UseGuards(JwtAuthGuard, PolicyGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @RequirePermission('logistics:alerts:read')
  async getAllActiveAlerts(
    @Query('severity') severity?: string,
    @Query('alertType') alertType?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('shipmentId') shipmentId?: string,
  ) {
    const filters: any = {};
    
    if (severity) filters.severity = severity;
    if (alertType) filters.alertType = alertType;
    if (assignedTo) filters.assignedTo = assignedTo;
    if (shipmentId) filters.shipmentId = shipmentId;

    return this.alertsService.getAllActiveAlerts(filters);
  }

  @Get('shipment/:shipmentId')
  @RequirePermission('logistics:alerts:read')
  async getActiveAlertsForShipment(@Param('shipmentId') shipmentId: string) {
    return this.alertsService.getActiveAlerts(shipmentId);
  }

  @Get('statistics')
  @RequirePermission('logistics:alerts:read')
  async getAlertStatistics() {
    return this.alertsService.getAlertStatistics();
  }

  @Post('check-delays')
  @RequirePermission('logistics:alerts:create')
  async checkDelayedShipments() {
    return this.alertsService.checkDelayedShipments();
  }

  @Post('check-eta-changes')
  @RequirePermission('logistics:alerts:create')
  async checkEtaChanges() {
    return this.alertsService.checkEtaChanges();
  }

  @Post('check-free-day-expiry')
  @RequirePermission('logistics:alerts:create')
  async checkFreeDayExpiry() {
    return this.alertsService.checkFreeDayExpiry();
  }

  @Post('check-customs-issues')
  @RequirePermission('logistics:alerts:create')
  async checkCustomsIssues() {
    return this.alertsService.checkCustomsIssues();
  }

  @Post('run-all-checks')
  @RequirePermission('logistics:alerts:create')
  async runAllAlertChecks() {
    return this.alertsService.runAllAlertChecks();
  }

  @Patch(':id/resolve')
  @RequirePermission('logistics:alerts:update')
  async resolveAlert(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: { resolutionNotes?: string }
  ) {
    return this.alertsService.resolveAlert(id, user.id, body.resolutionNotes);
  }
}
