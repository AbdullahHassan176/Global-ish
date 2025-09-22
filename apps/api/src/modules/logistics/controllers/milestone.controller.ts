import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../packages/auth/src/guards/jwt-auth.guard';
import { PolicyGuard } from '../../../packages/auth/src/guards/policy.guard';
import { RequirePermission } from '../../../packages/auth/src/decorators/require-permission.decorator';
import { MilestoneService } from '../services/milestone.service';
import { LogisticsService } from '../services/logistics.service';
import { 
  CreateMilestoneDto, 
  UpdateMilestoneDto 
} from '../dto/logistics.dto';

@Controller('logistics/milestones')
@UseGuards(JwtAuthGuard, PolicyGuard)
export class MilestoneController {
  constructor(
    private readonly milestoneService: MilestoneService,
    private readonly logisticsService: LogisticsService,
  ) {}

  @Post()
  @RequirePermission('logistics:milestones:create')
  async createMilestone(@Body() createMilestoneDto: CreateMilestoneDto) {
    return this.logisticsService.createMilestone(createMilestoneDto);
  }

  @Get('shipment/:shipmentId')
  @RequirePermission('logistics:milestones:read')
  async findMilestonesByShipment(@Param('shipmentId') shipmentId: string) {
    return this.logisticsService.findMilestonesByShipment(shipmentId);
  }

  @Get('shipment/:shipmentId/timeline')
  @RequirePermission('logistics:milestones:read')
  async getMilestoneTimeline(@Param('shipmentId') shipmentId: string) {
    return this.milestoneService.getMilestoneTimeline(shipmentId);
  }

  @Get('shipment/:shipmentId/progress')
  @RequirePermission('logistics:milestones:read')
  async getShipmentProgress(@Param('shipmentId') shipmentId: string) {
    return this.milestoneService.getShipmentProgress(shipmentId);
  }

  @Get('overdue')
  @RequirePermission('logistics:milestones:read')
  async getOverdueMilestones() {
    return this.milestoneService.getOverdueMilestones();
  }

  @Get('upcoming')
  @RequirePermission('logistics:milestones:read')
  async getUpcomingMilestones(@Query('days') days?: string) {
    const daysNumber = days ? parseInt(days, 10) : 7;
    return this.milestoneService.getUpcomingMilestones(daysNumber);
  }

  @Get('statistics')
  @RequirePermission('logistics:milestones:read')
  async getMilestoneStatistics() {
    return this.milestoneService.getMilestoneStatistics();
  }

  @Patch(':id')
  @RequirePermission('logistics:milestones:update')
  async updateMilestone(
    @Param('id') id: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
  ) {
    return this.logisticsService.updateMilestone(id, updateMilestoneDto);
  }

  @Delete(':id')
  @RequirePermission('logistics:milestones:delete')
  async deleteMilestone(@Param('id') id: string) {
    await this.logisticsService.deleteMilestone(id);
  }

  @Get(':id/status')
  @RequirePermission('logistics:milestones:read')
  async getMilestoneStatus(@Param('id') id: string) {
    const milestone = await this.logisticsService.findMilestoneById(id);
    return this.milestoneService.getMilestoneStatus(milestone);
  }

  @Get(':id/demurrage-risk')
  @RequirePermission('logistics:milestones:read')
  async getDemurrageRisk(
    @Param('id') id: string,
    @Query('freeDays') freeDays?: string,
    @Query('dailyRate') dailyRate?: string,
  ) {
    const milestone = await this.logisticsService.findMilestoneById(id);
    const freeDaysNumber = freeDays ? parseInt(freeDays, 10) : 7;
    const dailyRateNumber = dailyRate ? parseFloat(dailyRate) : 100;
    
    return this.milestoneService.calculateDemurrageRisk(
      milestone,
      '40FT', // Default container type
      freeDaysNumber,
      dailyRateNumber
    );
  }
}
