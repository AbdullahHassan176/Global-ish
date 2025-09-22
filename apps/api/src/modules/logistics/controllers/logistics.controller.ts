import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../packages/auth/src/guards/jwt-auth.guard';
import { PolicyGuard } from '../../../packages/auth/src/guards/policy.guard';
import { RequirePermission } from '../../../packages/auth/src/decorators/require-permission.decorator';
import { CurrentUser } from '../../../packages/auth/src/decorators/current-user.decorator';
import { LogisticsService } from '../services/logistics.service';
import { CarrierIntegrationService } from '../services/carrier-integration.service';
import { 
  CreateShipmentDto, 
  UpdateShipmentDto,
  CreateContainerDto,
  UpdateContainerDto,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  CreateCarrierEventDto,
  CreateCostItemDto,
  UpdateCostItemDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  CreateLogisticsAlertDto,
  UpdateLogisticsAlertDto,
  CreateCarrierIntegrationDto,
  UpdateCarrierIntegrationDto,
  TrackShipmentDto,
  BulkTrackDto
} from '../dto/logistics.dto';

@Controller('logistics')
@UseGuards(JwtAuthGuard, PolicyGuard)
export class LogisticsController {
  constructor(
    private readonly logisticsService: LogisticsService,
    private readonly carrierIntegrationService: CarrierIntegrationService,
  ) {}

  // ===== SHIPMENT ENDPOINTS =====

  @Post('shipments')
  @RequirePermission('logistics:shipments:create')
  async createShipment(
    @Body() createShipmentDto: CreateShipmentDto,
    @CurrentUser() user: any,
  ) {
    return this.logisticsService.createShipment(createShipmentDto, user.id);
  }

  @Get('shipments')
  @RequirePermission('logistics:shipments:read')
  async findAllShipments(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('carrier') carrier?: string,
    @Query('projectId') projectId?: string,
    @Query('clientId') clientId?: string,
  ) {
    const filters = { status, carrier, projectId, clientId };
    return this.logisticsService.findAllShipments(user.id, filters);
  }

  @Get('shipments/:id')
  @RequirePermission('logistics:shipments:read')
  async findShipmentById(@Param('id') id: string) {
    return this.logisticsService.findShipmentById(id);
  }

  @Patch('shipments/:id')
  @RequirePermission('logistics:shipments:update')
  async updateShipment(
    @Param('id') id: string,
    @Body() updateShipmentDto: UpdateShipmentDto,
  ) {
    return this.logisticsService.updateShipment(id, updateShipmentDto);
  }

  @Delete('shipments/:id')
  @RequirePermission('logistics:shipments:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteShipment(@Param('id') id: string) {
    await this.logisticsService.deleteShipment(id);
  }

  // ===== CONTAINER ENDPOINTS =====

  @Post('containers')
  @RequirePermission('logistics:containers:create')
  async createContainer(@Body() createContainerDto: CreateContainerDto) {
    return this.logisticsService.createContainer(createContainerDto);
  }

  @Get('shipments/:shipmentId/containers')
  @RequirePermission('logistics:containers:read')
  async findContainersByShipment(@Param('shipmentId') shipmentId: string) {
    return this.logisticsService.findContainersByShipment(shipmentId);
  }

  @Patch('containers/:id')
  @RequirePermission('logistics:containers:update')
  async updateContainer(
    @Param('id') id: string,
    @Body() updateContainerDto: UpdateContainerDto,
  ) {
    return this.logisticsService.updateContainer(id, updateContainerDto);
  }

  @Delete('containers/:id')
  @RequirePermission('logistics:containers:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteContainer(@Param('id') id: string) {
    await this.logisticsService.deleteContainer(id);
  }

  // ===== MILESTONE ENDPOINTS =====

  @Post('milestones')
  @RequirePermission('logistics:milestones:create')
  async createMilestone(@Body() createMilestoneDto: CreateMilestoneDto) {
    return this.logisticsService.createMilestone(createMilestoneDto);
  }

  @Get('shipments/:shipmentId/milestones')
  @RequirePermission('logistics:milestones:read')
  async findMilestonesByShipment(@Param('shipmentId') shipmentId: string) {
    return this.logisticsService.findMilestonesByShipment(shipmentId);
  }

  @Patch('milestones/:id')
  @RequirePermission('logistics:milestones:update')
  async updateMilestone(
    @Param('id') id: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
  ) {
    return this.logisticsService.updateMilestone(id, updateMilestoneDto);
  }

  @Delete('milestones/:id')
  @RequirePermission('logistics:milestones:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMilestone(@Param('id') id: string) {
    await this.logisticsService.deleteMilestone(id);
  }

  // ===== CARRIER EVENT ENDPOINTS =====

  @Post('carrier-events')
  @RequirePermission('logistics:events:create')
  async createCarrierEvent(@Body() createCarrierEventDto: CreateCarrierEventDto) {
    return this.logisticsService.createCarrierEvent(createCarrierEventDto);
  }

  @Get('shipments/:shipmentId/carrier-events')
  @RequirePermission('logistics:events:read')
  async findCarrierEventsByShipment(@Param('shipmentId') shipmentId: string) {
    return this.logisticsService.findCarrierEventsByShipment(shipmentId);
  }

  // ===== COST ITEM ENDPOINTS =====

  @Post('cost-items')
  @RequirePermission('logistics:costs:create')
  async createCostItem(@Body() createCostItemDto: CreateCostItemDto) {
    return this.logisticsService.createCostItem(createCostItemDto);
  }

  @Get('shipments/:shipmentId/cost-items')
  @RequirePermission('logistics:costs:read')
  async findCostItemsByShipment(@Param('shipmentId') shipmentId: string) {
    return this.logisticsService.findCostItemsByShipment(shipmentId);
  }

  @Patch('cost-items/:id')
  @RequirePermission('logistics:costs:update')
  async updateCostItem(
    @Param('id') id: string,
    @Body() updateCostItemDto: UpdateCostItemDto,
  ) {
    return this.logisticsService.updateCostItem(id, updateCostItemDto);
  }

  @Delete('cost-items/:id')
  @RequirePermission('logistics:costs:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCostItem(@Param('id') id: string) {
    await this.logisticsService.deleteCostItem(id);
  }

  // ===== INVOICE ENDPOINTS =====

  @Post('invoices')
  @RequirePermission('logistics:invoices:create')
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.logisticsService.createInvoice(createInvoiceDto);
  }

  @Get('shipments/:shipmentId/invoices')
  @RequirePermission('logistics:invoices:read')
  async findInvoicesByShipment(@Param('shipmentId') shipmentId: string) {
    return this.logisticsService.findInvoicesByShipment(shipmentId);
  }

  @Patch('invoices/:id')
  @RequirePermission('logistics:invoices:update')
  async updateInvoice(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.logisticsService.updateInvoice(id, updateInvoiceDto);
  }

  @Delete('invoices/:id')
  @RequirePermission('logistics:invoices:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteInvoice(@Param('id') id: string) {
    await this.logisticsService.deleteInvoice(id);
  }

  // ===== LOGISTICS ALERT ENDPOINTS =====

  @Post('alerts')
  @RequirePermission('logistics:alerts:create')
  async createLogisticsAlert(@Body() createLogisticsAlertDto: CreateLogisticsAlertDto) {
    return this.logisticsService.createLogisticsAlert(createLogisticsAlertDto);
  }

  @Get('shipments/:shipmentId/alerts')
  @RequirePermission('logistics:alerts:read')
  async findLogisticsAlertsByShipment(@Param('shipmentId') shipmentId: string) {
    return this.logisticsService.findLogisticsAlertsByShipment(shipmentId);
  }

  @Patch('alerts/:id')
  @RequirePermission('logistics:alerts:update')
  async updateLogisticsAlert(
    @Param('id') id: string,
    @Body() updateLogisticsAlertDto: UpdateLogisticsAlertDto,
  ) {
    return this.logisticsService.updateLogisticsAlert(id, updateLogisticsAlertDto);
  }

  @Delete('alerts/:id')
  @RequirePermission('logistics:alerts:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLogisticsAlert(@Param('id') id: string) {
    await this.logisticsService.deleteLogisticsAlert(id);
  }

  // ===== TRACKING ENDPOINTS =====

  @Post('track')
  @RequirePermission('logistics:tracking:read')
  async trackShipment(@Body() trackShipmentDto: TrackShipmentDto) {
    return this.logisticsService.trackShipment(trackShipmentDto);
  }

  @Post('track/bulk')
  @RequirePermission('logistics:tracking:read')
  async bulkTrackShipments(@Body() bulkTrackDto: BulkTrackDto) {
    return this.logisticsService.bulkTrackShipments(bulkTrackDto);
  }

  // ===== CARRIER INTEGRATION ENDPOINTS =====

  @Post('integrations')
  @RequirePermission('logistics:integrations:create')
  async createCarrierIntegration(@Body() createDto: CreateCarrierIntegrationDto) {
    return this.carrierIntegrationService.createIntegration(createDto);
  }

  @Get('integrations')
  @RequirePermission('logistics:integrations:read')
  async findAllIntegrations() {
    return this.carrierIntegrationService.findAllIntegrations();
  }

  @Get('integrations/supported-carriers')
  @RequirePermission('logistics:integrations:read')
  async getSupportedCarriers() {
    return this.carrierIntegrationService.getSupportedCarriers();
  }

  @Get('integrations/status')
  @RequirePermission('logistics:integrations:read')
  async getIntegrationStatus() {
    return this.carrierIntegrationService.getIntegrationStatus();
  }

  @Get('integrations/:id')
  @RequirePermission('logistics:integrations:read')
  async findIntegrationById(@Param('id') id: string) {
    return this.carrierIntegrationService.findIntegrationById(id);
  }

  @Patch('integrations/:id')
  @RequirePermission('logistics:integrations:update')
  async updateIntegration(
    @Param('id') id: string,
    @Body() updateDto: UpdateCarrierIntegrationDto,
  ) {
    return this.carrierIntegrationService.updateIntegration(id, updateDto);
  }

  @Delete('integrations/:id')
  @RequirePermission('logistics:integrations:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteIntegration(@Param('id') id: string) {
    await this.carrierIntegrationService.deleteIntegration(id);
  }

  @Post('integrations/:id/enable')
  @RequirePermission('logistics:integrations:update')
  async enableIntegration(@Param('id') id: string) {
    return this.carrierIntegrationService.enableIntegration(id);
  }

  @Post('integrations/:id/disable')
  @RequirePermission('logistics:integrations:update')
  async disableIntegration(@Param('id') id: string) {
    return this.carrierIntegrationService.disableIntegration(id);
  }

  @Post('integrations/test/:carrier')
  @RequirePermission('logistics:integrations:read')
  async testIntegration(@Param('carrier') carrier: string) {
    return this.carrierIntegrationService.testIntegration(carrier as any);
  }

  // ===== STATISTICS ENDPOINTS =====

  @Get('statistics')
  @RequirePermission('logistics:statistics:read')
  async getShipmentStatistics(@CurrentUser() user: any) {
    return this.logisticsService.getShipmentStatistics(user.id);
  }

  @Get('integrations/metrics')
  @RequirePermission('logistics:integrations:read')
  async getIntegrationMetrics() {
    return this.carrierIntegrationService.getIntegrationMetrics();
  }
}