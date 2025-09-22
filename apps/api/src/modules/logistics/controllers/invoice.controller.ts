import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query,
  Res,
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../../packages/auth/src/guards/jwt-auth.guard';
import { PolicyGuard } from '../../../packages/auth/src/guards/policy.guard';
import { RequirePermission } from '../../../packages/auth/src/decorators/require-permission.decorator';
import { InvoiceService } from '../services/invoice.service';

@Controller('logistics/invoices')
@UseGuards(JwtAuthGuard, PolicyGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('generate')
  @RequirePermission('logistics:invoices:create')
  async generateInvoice(
    @Body() body: {
      shipmentId: string;
      costItemIds: string[];
      invoiceNumber: string;
      invoiceDate: string;
      dueDate: string;
      clientId?: string;
      projectId?: string;
      notes?: string;
      taxRate?: number;
    }
  ) {
    return this.invoiceService.generateInvoice(
      body.shipmentId,
      body.costItemIds,
      {
        invoiceNumber: body.invoiceNumber,
        invoiceDate: new Date(body.invoiceDate),
        dueDate: new Date(body.dueDate),
        clientId: body.clientId,
        projectId: body.projectId,
        notes: body.notes,
        taxRate: body.taxRate,
      }
    );
  }

  @Get()
  @RequirePermission('logistics:invoices:read')
  async getAllInvoiceSummaries(
    @Query('status') status?: string,
    @Query('clientId') clientId?: string,
    @Query('projectId') projectId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const filters: any = {};
    
    if (status) filters.status = status;
    if (clientId) filters.clientId = clientId;
    if (projectId) filters.projectId = projectId;
    if (dateFrom) filters.dateFrom = new Date(dateFrom);
    if (dateTo) filters.dateTo = new Date(dateTo);

    return this.invoiceService.getAllInvoiceSummaries(filters);
  }

  @Get(':id')
  @RequirePermission('logistics:invoices:read')
  async getInvoiceData(@Param('id') id: string) {
    return this.invoiceService.getInvoiceData(id);
  }

  @Get(':id/summary')
  @RequirePermission('logistics:invoices:read')
  async getInvoiceSummary(@Param('id') id: string) {
    return this.invoiceService.getInvoiceSummary(id);
  }

  @Get(':id/pdf')
  @RequirePermission('logistics:invoices:read')
  async generateInvoicePDF(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    try {
      const pdfBuffer = await this.invoiceService.generateInvoicePDF(id);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${id}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });

      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  }

  @Get('shipment/:shipmentId/cost-analysis')
  @RequirePermission('logistics:invoices:read')
  async getShipmentCostAnalysis(@Param('shipmentId') shipmentId: string) {
    return this.invoiceService.getShipmentCostAnalysis(shipmentId);
  }
}
