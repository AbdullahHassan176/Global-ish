import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ReportingService } from '../services/reporting.service';
import { KpiCalculationService } from '../services/kpi-calculation.service';
import { PredictiveAnalyticsService } from '../services/predictive-analytics.service';
import { 
  GenerateReportDto,
  CreateReportScheduleDto,
  UpdateReportScheduleDto,
  ExportReportDto,
  KPICalculationDto,
  ETAPredictionDto,
  HSCodeSuggestionDto,
  DemurrageRiskDto,
  UtilizationForecastDto,
  KPIQueryDto,
  ReportQueryDto,
  ExportQueryDto
} from '../dto/reporting.dto';
import { JwtAuthGuard } from '../../../../packages/auth/src/guards/jwt-auth.guard';
import { RequirePermission } from '../../../../packages/auth/src/decorators/require-permission.decorator';
import { CurrentUser } from '../../../../packages/auth/src/decorators/current-user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('reporting')
export class ReportingController {
  constructor(
    private readonly reportingService: ReportingService,
    private readonly kpiCalculationService: KpiCalculationService,
    private readonly predictiveAnalyticsService: PredictiveAnalyticsService,
  ) {}

  // ===== KPI ENDPOINTS =====

  @Post('kpis/calculate')
  @RequirePermission('reporting.kpi.calculate')
  calculateKPIs(
    @Body() calculationDto: KPICalculationDto,
    @CurrentUser() user: User,
  ) {
    return this.kpiCalculationService.calculateKPIs(calculationDto.period, calculationDto.category);
  }

  @Get('kpis')
  @RequirePermission('reporting.kpi.read')
  getKPIs(@Query() query: KPIQueryDto) {
    // In real implementation, this would query the database for KPI records
    return { message: 'KPI records endpoint - to be implemented' };
  }

  @Get('kpis/:kpiType')
  @RequirePermission('reporting.kpi.read')
  getKPIByType(
    @Param('kpiType') kpiType: string,
    @Query('period') period: string,
  ) {
    return this.kpiCalculationService.calculateKPI(kpiType as any, period);
  }

  // ===== REPORT GENERATION =====

  @Post('reports/generate')
  @RequirePermission('reporting.report.generate')
  generateReport(
    @Body() generateDto: GenerateReportDto,
    @CurrentUser() user: User,
  ) {
    return this.reportingService.generateReport(generateDto.reportType, generateDto.filters);
  }

  @Get('reports/types')
  @RequirePermission('reporting.report.read')
  getReportTypes() {
    return {
      reportTypes: [
        {
          type: 'LOGISTICS_SUMMARY',
          name: 'Logistics Summary',
          description: 'Comprehensive logistics performance report',
          category: 'LOGISTICS',
        },
        {
          type: 'CONSULTING_UTILIZATION',
          name: 'Consulting Utilization',
          description: 'Consulting team utilization and billability report',
          category: 'CONSULTING',
        },
        {
          type: 'COMPLIANCE_STATUS',
          name: 'Compliance Status',
          description: 'Compliance and regulatory status report',
          category: 'COMPLIANCE',
        },
        {
          type: 'FINANCIAL_OVERVIEW',
          name: 'Financial Overview',
          description: 'Financial performance and metrics report',
          category: 'FINANCE',
        },
        {
          type: 'SECURITY_AUDIT',
          name: 'Security Audit',
          description: 'Security events and compliance report',
          category: 'SECURITY',
        },
        {
          type: 'CUSTOM_DASHBOARD',
          name: 'Custom Dashboard',
          description: 'Customizable dashboard report',
          category: 'OVERALL',
        },
      ],
    };
  }

  // ===== REPORT SCHEDULING =====

  @Post('schedules')
  @RequirePermission('reporting.schedule.create')
  createReportSchedule(
    @Body() createDto: CreateReportScheduleDto,
    @CurrentUser() user: User,
  ) {
    return this.reportingService.scheduleReport({
      ...createDto,
      createdBy: user.id,
    });
  }

  @Get('schedules')
  @RequirePermission('reporting.schedule.read')
  getReportSchedules(@Query() query: ReportQueryDto) {
    // In real implementation, this would query the database for report schedules
    return { message: 'Report schedules endpoint - to be implemented' };
  }

  @Patch('schedules/:id')
  @RequirePermission('reporting.schedule.update')
  updateReportSchedule(
    @Param('id') id: string,
    @Body() updateDto: UpdateReportScheduleDto,
  ) {
    // In real implementation, this would update the report schedule
    return { message: 'Update report schedule endpoint - to be implemented' };
  }

  @Delete('schedules/:id')
  @RequirePermission('reporting.schedule.delete')
  deleteReportSchedule(@Param('id') id: string) {
    // In real implementation, this would delete the report schedule
    return { message: 'Delete report schedule endpoint - to be implemented' };
  }

  // ===== REPORT EXPORTS =====

  @Post('exports')
  @RequirePermission('reporting.export.create')
  exportReport(
    @Body() exportDto: ExportReportDto,
    @CurrentUser() user: User,
  ) {
    return this.reportingService.exportReport(exportDto.reportId, exportDto.format);
  }

  @Get('exports')
  @RequirePermission('reporting.export.read')
  getReportExports(
    @Query() query: ExportQueryDto,
    @CurrentUser() user: User,
  ) {
    return this.reportingService.getReportHistory(user.id);
  }

  @Get('exports/:id')
  @RequirePermission('reporting.export.read')
  getReportExport(@Param('id') id: string) {
    // In real implementation, this would get a specific export
    return { message: 'Get report export endpoint - to be implemented' };
  }

  @Get('exports/:id/download')
  @RequirePermission('reporting.export.download')
  downloadReportExport(@Param('id') id: string) {
    // In real implementation, this would provide download link
    return { message: 'Download report export endpoint - to be implemented' };
  }

  // ===== PREDICTIVE ANALYTICS =====

  @Post('predictions/eta')
  @RequirePermission('reporting.prediction.eta')
  predictETA(
    @Body() predictionDto: ETAPredictionDto,
    @CurrentUser() user: User,
  ) {
    return this.predictiveAnalyticsService.predictETA(predictionDto.shipmentId, predictionDto.milestoneType);
  }

  @Post('predictions/hs-codes')
  @RequirePermission('reporting.prediction.hs-code')
  suggestHSCodes(
    @Body() suggestionDto: HSCodeSuggestionDto,
    @CurrentUser() user: User,
  ) {
    return this.predictiveAnalyticsService.suggestHSCode(suggestionDto.productName, suggestionDto.description);
  }

  @Post('predictions/demurrage-risk')
  @RequirePermission('reporting.prediction.demurrage')
  calculateDemurrageRisk(
    @Body() riskDto: DemurrageRiskDto,
    @CurrentUser() user: User,
  ) {
    return this.predictiveAnalyticsService.calculateDemurrageRisk(riskDto.shipmentId);
  }

  @Post('predictions/utilization')
  @RequirePermission('reporting.prediction.utilization')
  forecastUtilization(
    @Body() forecastDto: UtilizationForecastDto,
    @CurrentUser() user: User,
  ) {
    return this.predictiveAnalyticsService.forecastUtilization(forecastDto.period);
  }

  // ===== DASHBOARD ENDPOINTS =====

  @Get('dashboards/role/:role')
  @RequirePermission('reporting.dashboard.read')
  getRoleDashboard(
    @Param('role') role: string,
    @Query('period') period: string,
    @CurrentUser() user: User,
  ) {
    // In real implementation, this would generate role-specific dashboard data
    return this.generateRoleDashboard(role, period, user.id);
  }

  @Get('dashboards/executive')
  @RequirePermission('reporting.dashboard.executive')
  getExecutiveDashboard(
    @Query('period') period: string,
    @CurrentUser() user: User,
  ) {
    return this.generateExecutiveDashboard(period, user.id);
  }

  @Get('dashboards/logistics')
  @RequirePermission('reporting.dashboard.logistics')
  getLogisticsDashboard(
    @Query('period') period: string,
    @CurrentUser() user: User,
  ) {
    return this.generateLogisticsDashboard(period, user.id);
  }

  @Get('dashboards/consulting')
  @RequirePermission('reporting.dashboard.consulting')
  getConsultingDashboard(
    @Query('period') period: string,
    @CurrentUser() user: User,
  ) {
    return this.generateConsultingDashboard(period, user.id);
  }

  @Get('dashboards/compliance')
  @RequirePermission('reporting.dashboard.compliance')
  getComplianceDashboard(
    @Query('period') period: string,
    @CurrentUser() user: User,
  ) {
    return this.generateComplianceDashboard(period, user.id);
  }

  @Get('dashboards/finance')
  @RequirePermission('reporting.dashboard.finance')
  getFinanceDashboard(
    @Query('period') period: string,
    @CurrentUser() user: User,
  ) {
    return this.generateFinanceDashboard(period, user.id);
  }

  @Get('dashboards/marketing')
  @RequirePermission('reporting.dashboard.marketing')
  getMarketingDashboard(
    @Query('period') period: string,
    @CurrentUser() user: User,
  ) {
    return this.generateMarketingDashboard(period, user.id);
  }

  // ===== ANALYTICS EVENTS =====

  @Post('analytics/events')
  @RequirePermission('reporting.analytics.track')
  trackAnalyticsEvent(
    @Body() eventData: any,
    @CurrentUser() user: User,
  ) {
    // In real implementation, this would track analytics events
    return { message: 'Analytics event tracked successfully' };
  }

  @Get('analytics/events')
  @RequirePermission('reporting.analytics.read')
  getAnalyticsEvents(@Query() query: any) {
    // In real implementation, this would query analytics events
    return { message: 'Analytics events endpoint - to be implemented' };
  }

  // ===== PRIVATE HELPER METHODS =====

  private async generateRoleDashboard(role: string, period: string, userId: string) {
    // Generate role-specific dashboard data
    const kpis = await this.kpiCalculationService.calculateKPIs(period);
    
    return {
      role,
      period,
      userId,
      kpis: kpis.filter(kpi => this.getKPIsForRole(role).includes(kpi.kpiType)),
      lastUpdated: new Date(),
    };
  }

  private async generateExecutiveDashboard(period: string, userId: string) {
    const kpis = await this.kpiCalculationService.calculateKPIs(period);
    
    return {
      role: 'EXECUTIVE',
      period,
      userId,
      summary: {
        totalRevenue: 2500000,
        totalShipments: 1250,
        utilizationRate: 85,
        onTimeDelivery: 92,
        complianceScore: 95,
      },
      kpis: kpis.filter(kpi => 
        ['SHIPMENT_VOLUME', 'REVENUE_PER_CLIENT', 'UTILIZATION_RATE', 'ON_TIME_DELIVERY_RATE', 'COMPLIANCE_SCORE'].includes(kpi.kpiType)
      ),
      trends: [],
      alerts: [],
      lastUpdated: new Date(),
    };
  }

  private async generateLogisticsDashboard(period: string, userId: string) {
    const kpis = await this.kpiCalculationService.calculateKPIs(period, 'LOGISTICS' as any);
    
    return {
      role: 'LOGISTICS',
      period,
      userId,
      summary: {
        activeShipments: 45,
        containersInTransit: 23,
        averageLeadTime: 14.5,
        demurrageCosts: 12500,
      },
      kpis,
      trends: [],
      alerts: [],
      lastUpdated: new Date(),
    };
  }

  private async generateConsultingDashboard(period: string, userId: string) {
    const kpis = await this.kpiCalculationService.calculateKPIs(period, 'CONSULTING' as any);
    
    return {
      role: 'CONSULTING',
      period,
      userId,
      summary: {
        totalHours: 1200,
        billableHours: 900,
        utilizationRate: 75,
        averageCycleTime: 7.2,
      },
      kpis,
      trends: [],
      alerts: [],
      lastUpdated: new Date(),
    };
  }

  private async generateComplianceDashboard(period: string, userId: string) {
    const kpis = await this.kpiCalculationService.calculateKPIs(period, 'COMPLIANCE' as any);
    
    return {
      role: 'COMPLIANCE',
      period,
      userId,
      summary: {
        contractsExpiring: 8,
        licensesRenewed: 12,
        complianceScore: 95,
        auditFindings: 2,
      },
      kpis,
      trends: [],
      alerts: [],
      lastUpdated: new Date(),
    };
  }

  private async generateFinanceDashboard(period: string, userId: string) {
    const kpis = await this.kpiCalculationService.calculateKPIs(period, 'FINANCE' as any);
    
    return {
      role: 'FINANCE',
      period,
      userId,
      summary: {
        totalRevenue: 2500000,
        outstandingAR: 125000,
        averageAging: 28,
        profitMargin: 18.5,
      },
      kpis,
      trends: [],
      alerts: [],
      lastUpdated: new Date(),
    };
  }

  private async generateMarketingDashboard(period: string, userId: string) {
    const kpis = await this.kpiCalculationService.calculateKPIs(period, 'MARKETING' as any);
    
    return {
      role: 'MARKETING',
      period,
      userId,
      summary: {
        activeCampaigns: 5,
        leadConversion: 15,
        contentEngagement: 75,
        campaignROI: 250,
      },
      kpis,
      trends: [],
      alerts: [],
      lastUpdated: new Date(),
    };
  }

  private getKPIsForRole(role: string): string[] {
    const roleKPIMap: Record<string, string[]> = {
      EXECUTIVE: [
        'SHIPMENT_VOLUME',
        'REVENUE_PER_CLIENT',
        'UTILIZATION_RATE',
        'ON_TIME_DELIVERY_RATE',
        'COMPLIANCE_SCORE',
        'PROFIT_MARGIN',
      ],
      LOGISTICS: [
        'LEAD_TIME_AVERAGE',
        'ON_TIME_DELIVERY_RATE',
        'CLEARANCE_DELAY_DAYS',
        'DEMURRAGE_DAYS',
        'CONTAINER_UTILIZATION',
        'SHIPMENT_VOLUME',
        'COST_PER_SHIPMENT',
        'CARRIER_PERFORMANCE',
      ],
      CONSULTING: [
        'UTILIZATION_RATE',
        'BILLABILITY_RATE',
        'CYCLE_TIME_AVERAGE',
        'PROJECT_MARGIN',
        'CLIENT_SATISFACTION',
        'HOURS_BILLED',
        'HOURS_UNBILLED',
      ],
      COMPLIANCE: [
        'RENEWALS_PIPELINE',
        'CONTRACT_EXPIRY_RISK',
        'LICENSE_RENEWAL_RATE',
        'COMPLIANCE_SCORE',
        'AUDIT_FINDINGS',
        'POLICY_VIOLATIONS',
      ],
      FINANCE: [
        'AR_AGING',
        'CASH_FLOW',
        'REVENUE_PER_CLIENT',
        'COST_PER_CONTAINER',
        'PROFIT_MARGIN',
      ],
      MARKETING: [
        'CAMPAIGN_ROI',
        'LEAD_CONVERSION_RATE',
        'CONTENT_ENGAGEMENT',
        'SEMRUSH_RANKINGS',
        'APPROVAL_CYCLE_TIME',
      ],
    };

    return roleKPIMap[role] || [];
  }
}
