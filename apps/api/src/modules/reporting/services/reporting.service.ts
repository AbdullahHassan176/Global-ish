import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { KpiCalculationService } from './kpi-calculation.service';
import { 
  ReportingService as IReportingService,
  ReportData,
  ReportSchedule,
  ReportExport,
  ReportFilters,
  ReportType,
  ReportFormat,
  ExportStatus
} from '../interfaces/reporting.interface';
import { KPICategory } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import * as csv from 'csv-writer';

@Injectable()
export class ReportingService implements IReportingService {
  private readonly logger = new Logger(ReportingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly kpiCalculationService: KpiCalculationService,
  ) {}

  /**
   * Generate a comprehensive report
   */
  async generateReport(reportType: ReportType, filters?: ReportFilters): Promise<ReportData> {
    this.logger.log(`Generating report: ${reportType}`);

    const startTime = Date.now();
    const period = this.getCurrentPeriod();

    // Calculate KPIs based on report type
    const kpis = await this.calculateKPIsForReport(reportType, filters);
    
    // Generate trends analysis
    const trends = await this.generateTrendAnalysis(kpis);
    
    // Get detailed data
    const details = await this.getReportDetails(reportType, filters);
    
    // Generate summary
    const summary = this.generateReportSummary(kpis, trends);

    const generationTime = Date.now() - startTime;

    return {
      reportType,
      period,
      generatedAt: new Date(),
      data: {
        summary,
        kpis,
        trends,
        details,
      },
      metadata: {
        filters: filters || {},
        recordCount: this.getRecordCount(details),
        generationTime,
      },
    };
  }

  /**
   * Schedule a recurring report
   */
  async scheduleReport(schedule: ReportSchedule): Promise<ReportSchedule> {
    this.logger.log(`Scheduling report: ${schedule.name}`);

    // Calculate next run time
    const nextRunAt = this.calculateNextRunTime(schedule.frequency);

    const createdSchedule = await this.prisma.reportSchedule.create({
      data: {
        name: schedule.name,
        description: schedule.description,
        reportType: schedule.reportType,
        frequency: schedule.frequency,
        recipients: schedule.recipients,
        webhookUrls: schedule.webhookUrls,
        filters: schedule.filters,
        format: schedule.format,
        isActive: schedule.isActive,
        nextRunAt,
        createdBy: schedule.createdBy,
      },
    });

    return {
      id: createdSchedule.id,
      name: createdSchedule.name,
      description: createdSchedule.description,
      reportType: createdSchedule.reportType,
      frequency: createdSchedule.frequency,
      recipients: createdSchedule.recipients,
      webhookUrls: createdSchedule.webhookUrls,
      filters: createdSchedule.filters as ReportFilters,
      format: createdSchedule.format,
      isActive: createdSchedule.isActive,
      lastRunAt: createdSchedule.lastRunAt,
      nextRunAt: createdSchedule.nextRunAt,
      createdBy: createdSchedule.createdBy,
    };
  }

  /**
   * Export a report in the specified format
   */
  async exportReport(reportId: string, format: ReportFormat): Promise<ReportExport> {
    this.logger.log(`Exporting report ${reportId} in ${format} format`);

    // Get the report data
    const reportData = await this.getReportData(reportId);
    if (!reportData) {
      throw new Error(`Report ${reportId} not found`);
    }

    // Create export record
    const exportRecord = await this.prisma.reportExport.create({
      data: {
        reportType: reportData.reportType,
        format,
        status: ExportStatus.PROCESSING,
        createdBy: 'system', // In real implementation, use actual user ID
      },
    });

    try {
      // Generate file based on format
      const fileUrl = await this.generateExportFile(reportData, format, exportRecord.id);
      
      // Update export record with file URL
      await this.prisma.reportExport.update({
        where: { id: exportRecord.id },
        data: {
          status: ExportStatus.COMPLETED,
          fileUrl,
          fileSize: await this.getFileSize(fileUrl),
          recordCount: reportData.metadata.recordCount,
        },
      });

      return {
        id: exportRecord.id,
        reportType: exportRecord.reportType,
        format: exportRecord.format,
        status: ExportStatus.COMPLETED,
        fileUrl,
        fileSize: await this.getFileSize(fileUrl),
        recordCount: reportData.metadata.recordCount,
        filters: reportData.metadata.filters,
        generatedAt: exportRecord.generatedAt,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdBy: exportRecord.createdBy,
      };
    } catch (error) {
      // Update export record with error status
      await this.prisma.reportExport.update({
        where: { id: exportRecord.id },
        data: {
          status: ExportStatus.FAILED,
        },
      });

      this.logger.error(`Failed to export report ${reportId}:`, error);
      throw error;
    }
  }

  /**
   * Get report history for a user
   */
  async getReportHistory(userId: string): Promise<ReportExport[]> {
    const exports = await this.prisma.reportExport.findMany({
      where: { createdBy: userId },
      orderBy: { generatedAt: 'desc' },
      take: 50, // Last 50 exports
    });

    return exports.map(exp => ({
      id: exp.id,
      scheduleId: exp.scheduleId,
      reportType: exp.reportType,
      format: exp.format,
      status: exp.status,
      fileUrl: exp.fileUrl,
      fileSize: exp.fileSize,
      recordCount: exp.recordCount,
      filters: exp.filters as ReportFilters,
      generatedAt: exp.generatedAt,
      expiresAt: exp.expiresAt,
      downloadedAt: exp.downloadedAt,
      createdBy: exp.createdBy,
    }));
  }

  // ===== PRIVATE HELPER METHODS =====

  private async calculateKPIsForReport(reportType: ReportType, filters?: ReportFilters): Promise<any[]> {
    const category = this.getCategoryForReportType(reportType);
    const period = this.getCurrentPeriod();
    
    return this.kpiCalculationService.calculateKPIs(period, category);
  }

  private async generateTrendAnalysis(kpis: any[]): Promise<any[]> {
    const trends: any[] = [];
    
    for (const kpi of kpis) {
      if (kpi.previousValue !== null) {
        const change = kpi.value - kpi.previousValue;
        const changePercentage = kpi.previousValue !== 0 ? (change / kpi.previousValue) * 100 : 0;
        
        trends.push({
          kpiType: kpi.kpiType,
          currentValue: kpi.value,
          previousValue: kpi.previousValue,
          change,
          changePercentage,
          trend: kpi.trend,
          period: kpi.period,
          isTargetMet: kpi.target ? kpi.value >= kpi.target : false,
          targetGap: kpi.target ? kpi.value - kpi.target : 0,
        });
      }
    }
    
    return trends;
  }

  private async getReportDetails(reportType: ReportType, filters?: ReportFilters): Promise<Record<string, any[]>> {
    const details: Record<string, any[]> = {};
    
    switch (reportType) {
      case ReportType.LOGISTICS_SUMMARY:
        details.shipments = await this.getShipmentDetails(filters);
        details.milestones = await this.getMilestoneDetails(filters);
        details.costs = await this.getCostDetails(filters);
        break;
        
      case ReportType.CONSULTING_UTILIZATION:
        details.timesheets = await this.getTimesheetDetails(filters);
        details.projects = await this.getProjectDetails(filters);
        details.clients = await this.getClientDetails(filters);
        break;
        
      case ReportType.COMPLIANCE_STATUS:
        details.contracts = await this.getContractDetails(filters);
        details.licenses = await this.getLicenseDetails(filters);
        details.audits = await this.getAuditDetails(filters);
        break;
        
      case ReportType.FINANCIAL_OVERVIEW:
        details.invoices = await this.getInvoiceDetails(filters);
        details.payments = await this.getPaymentDetails(filters);
        details.costs = await this.getCostDetails(filters);
        break;
        
      case ReportType.SECURITY_AUDIT:
        details.securityEvents = await this.getSecurityEventDetails(filters);
        details.sessions = await this.getSessionDetails(filters);
        details.consentRecords = await this.getConsentDetails(filters);
        break;
        
      default:
        this.logger.warn(`Unknown report type: ${reportType}`);
    }
    
    return details;
  }

  private generateReportSummary(kpis: any[], trends: any[]): Record<string, any> {
    const totalKPIs = kpis.length;
    const kpisMeetingTarget = kpis.filter(kpi => kpi.target && kpi.value >= kpi.target).length;
    const kpisImproving = trends.filter(trend => trend.trend === 'UP').length;
    const kpisDeclining = trends.filter(trend => trend.trend === 'DOWN').length;
    
    return {
      totalKPIs,
      kpisMeetingTarget,
      kpisImproving,
      kpisDeclining,
      overallPerformance: totalKPIs > 0 ? (kpisMeetingTarget / totalKPIs) * 100 : 0,
      averageTrend: trends.length > 0 ? trends.reduce((sum, t) => sum + t.changePercentage, 0) / trends.length : 0,
    };
  }

  private getCategoryForReportType(reportType: ReportType): KPICategory {
    const categoryMap: Record<ReportType, KPICategory> = {
      [ReportType.LOGISTICS_SUMMARY]: KPICategory.LOGISTICS,
      [ReportType.CONSULTING_UTILIZATION]: KPICategory.CONSULTING,
      [ReportType.COMPLIANCE_STATUS]: KPICategory.COMPLIANCE,
      [ReportType.FINANCIAL_OVERVIEW]: KPICategory.FINANCE,
      [ReportType.SECURITY_AUDIT]: KPICategory.SECURITY,
      [ReportType.CUSTOM_DASHBOARD]: KPICategory.OVERALL,
    };
    
    return categoryMap[reportType] || KPICategory.OVERALL;
  }

  private getCurrentPeriod(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  private calculateNextRunTime(frequency: any): Date {
    const now = new Date();
    
    switch (frequency) {
      case 'DAILY':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'WEEKLY':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'MONTHLY':
        return new Date(now.getFullYear(), now.getMonth() + 1, 1);
      case 'QUARTERLY':
        return new Date(now.getFullYear(), now.getMonth() + 3, 1);
      case 'YEARLY':
        return new Date(now.getFullYear() + 1, 0, 1);
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to daily
    }
  }

  private async getReportData(reportId: string): Promise<ReportData | null> {
    // In real implementation, this would retrieve stored report data
    // For now, generate a sample report
    return this.generateReport(ReportType.LOGISTICS_SUMMARY);
  }

  private async generateExportFile(reportData: ReportData, format: ReportFormat, exportId: string): Promise<string> {
    const fileName = `report-${exportId}-${Date.now()}`;
    
    switch (format) {
      case ReportFormat.CSV:
        return this.generateCSVFile(reportData, fileName);
      case ReportFormat.XLSX:
        return this.generateXLSXFile(reportData, fileName);
      case ReportFormat.PDF:
        return this.generatePDFFile(reportData, fileName);
      case ReportFormat.JSON:
        return this.generateJSONFile(reportData, fileName);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private async generateCSVFile(reportData: ReportData, fileName: string): Promise<string> {
    // Generate CSV file
    const csvWriter = csv.createObjectCsvWriter({
      path: `./exports/${fileName}.csv`,
      header: [
        { id: 'kpiType', title: 'KPI Type' },
        { id: 'value', title: 'Value' },
        { id: 'target', title: 'Target' },
        { id: 'trend', title: 'Trend' },
        { id: 'period', title: 'Period' },
      ],
    });

    await csvWriter.writeRecords(reportData.data.kpis);
    
    return `https://storage.example.com/exports/${fileName}.csv`;
  }

  private async generateXLSXFile(reportData: ReportData, fileName: string): Promise<string> {
    // Generate Excel file
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('KPI Report');
    
    // Add headers
    worksheet.columns = [
      { header: 'KPI Type', key: 'kpiType', width: 30 },
      { header: 'Value', key: 'value', width: 15 },
      { header: 'Target', key: 'target', width: 15 },
      { header: 'Trend', key: 'trend', width: 15 },
      { header: 'Period', key: 'period', width: 15 },
    ];
    
    // Add data
    worksheet.addRows(reportData.data.kpis);
    
    // Save file
    await workbook.xlsx.writeFile(`./exports/${fileName}.xlsx`);
    
    return `https://storage.example.com/exports/${fileName}.xlsx`;
  }

  private async generatePDFFile(reportData: ReportData, fileName: string): Promise<string> {
    // In real implementation, use a PDF generation library like puppeteer or jsPDF
    // For now, return a placeholder URL
    return `https://storage.example.com/exports/${fileName}.pdf`;
  }

  private async generateJSONFile(reportData: ReportData, fileName: string): Promise<string> {
    // Generate JSON file
    const fs = require('fs');
    const path = `./exports/${fileName}.json`;
    
    fs.writeFileSync(path, JSON.stringify(reportData, null, 2));
    
    return `https://storage.example.com/exports/${fileName}.json`;
  }

  private async getFileSize(fileUrl: string): Promise<number> {
    // In real implementation, get actual file size
    return 1024; // Placeholder
  }

  private getRecordCount(details: Record<string, any[]>): number {
    return Object.values(details).reduce((total, records) => total + records.length, 0);
  }

  // Placeholder methods for getting detailed data
  private async getShipmentDetails(filters?: ReportFilters): Promise<any[]> {
    return []; // Placeholder
  }

  private async getMilestoneDetails(filters?: ReportFilters): Promise<any[]> {
    return []; // Placeholder
  }

  private async getCostDetails(filters?: ReportFilters): Promise<any[]> {
    return []; // Placeholder
  }

  private async getTimesheetDetails(filters?: ReportFilters): Promise<any[]> {
    return []; // Placeholder
  }

  private async getProjectDetails(filters?: ReportFilters): Promise<any[]> {
    return []; // Placeholder
  }

  private async getClientDetails(filters?: ReportFilters): Promise<any[]> {
    return []; // Placeholder
  }

  private async getContractDetails(filters?: ReportFilters): Promise<any[]> {
    return []; // Placeholder
  }

  private async getLicenseDetails(filters?: ReportFilters): Promise<any[]> {
    return []; // Placeholder
  }

  private async getAuditDetails(filters?: ReportFilters): Promise<any[]> {
    return []; // Placeholder
  }

  private async getInvoiceDetails(filters?: ReportFilters): Promise<any[]> {
    return []; // Placeholder
  }

  private async getPaymentDetails(filters?: ReportFilters): Promise<any[]> {
    return []; // Placeholder
  }

  private async getSecurityEventDetails(filters?: ReportFilters): Promise<any[]> {
    return []; // Placeholder
  }

  private async getSessionDetails(filters?: ReportFilters): Promise<any[]> {
    return []; // Placeholder
  }

  private async getConsentDetails(filters?: ReportFilters): Promise<any[]> {
    return []; // Placeholder
  }
}
