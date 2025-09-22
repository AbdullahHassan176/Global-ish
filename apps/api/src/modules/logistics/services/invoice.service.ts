import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Invoice, CostItem } from '@prisma/client';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

export interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  totalAmount: number;
  currency: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  clientName?: string;
  projectName?: string;
  shipmentNumber?: string;
}

export interface CostSummary {
  costType: string;
  totalAmount: number;
  itemCount: number;
  items: CostItem[];
}

export interface InvoiceData {
  invoice: Invoice;
  costItems: CostItem[];
  costSummary: CostSummary[];
  totalAmount: number;
  taxAmount: number;
  grandTotal: number;
}

@Injectable()
export class InvoiceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate invoice from cost items
   */
  async generateInvoice(
    shipmentId: string,
    costItemIds: string[],
    invoiceData: {
      invoiceNumber: string;
      invoiceDate: Date;
      dueDate: Date;
      clientId?: string;
      projectId?: string;
      notes?: string;
      taxRate?: number;
    }
  ): Promise<Invoice> {
    // Get shipment details
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        client: true,
        project: true,
      },
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${shipmentId} not found`);
    }

    // Get cost items
    const costItems = await this.prisma.costItem.findMany({
      where: {
        id: { in: costItemIds },
        shipmentId,
      },
    });

    if (costItems.length === 0) {
      throw new Error('No cost items found for invoice generation');
    }

    // Calculate totals
    const subtotal = costItems.reduce((sum, item) => sum + item.amount, 0);
    const taxRate = invoiceData.taxRate || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    // Create invoice
    const invoice = await this.prisma.invoice.create({
      data: {
        shipmentId,
        invoiceNumber: invoiceData.invoiceNumber,
        invoiceDate: invoiceData.invoiceDate,
        dueDate: invoiceData.dueDate,
        totalAmount,
        currency: costItems[0].currency, // Assume all cost items have same currency
        clientId: invoiceData.clientId || shipment.clientId,
        projectId: invoiceData.projectId || shipment.projectId,
        notes: invoiceData.notes,
      },
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true },
        },
        client: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });

    return invoice;
  }

  /**
   * Get invoice data for PDF generation
   */
  async getInvoiceData(invoiceId: string): Promise<InvoiceData> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        shipment: {
          select: { id: true, shipmentNumber: true, origin: true, destination: true },
        },
        client: {
          select: { id: true, name: true, email: true, address: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    // Get cost items for this shipment
    const costItems = await this.prisma.costItem.findMany({
      where: { shipmentId: invoice.shipmentId },
      orderBy: { costType: 'asc' },
    });

    // Group cost items by type
    const costSummary = this.groupCostItemsByType(costItems);

    // Calculate totals
    const totalAmount = costItems.reduce((sum, item) => sum + item.amount, 0);
    const taxRate = 0; // Could be configurable
    const taxAmount = totalAmount * (taxRate / 100);
    const grandTotal = totalAmount + taxAmount;

    return {
      invoice,
      costItems,
      costSummary,
      totalAmount,
      taxAmount,
      grandTotal,
    };
  }

  /**
   * Generate PDF invoice
   */
  async generateInvoicePDF(invoiceId: string): Promise<Buffer> {
    const invoiceData = await this.getInvoiceData(invoiceId);
    
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Header
        doc.fontSize(20).text('INVOICE', 50, 50);
        doc.fontSize(12).text(`Invoice #: ${invoiceData.invoice.invoiceNumber}`, 50, 80);
        doc.text(`Date: ${invoiceData.invoice.invoiceDate.toLocaleDateString()}`, 50, 100);
        doc.text(`Due Date: ${invoiceData.invoice.dueDate.toLocaleDateString()}`, 50, 120);

        // Client information
        if (invoiceData.invoice.client) {
          doc.fontSize(14).text('Bill To:', 350, 80);
          doc.fontSize(12).text(invoiceData.invoice.client.name, 350, 100);
          if (invoiceData.invoice.client.email) {
            doc.text(invoiceData.invoice.client.email, 350, 120);
          }
          if (invoiceData.invoice.client.address) {
            doc.text(invoiceData.invoice.client.address, 350, 140);
          }
        }

        // Shipment information
        doc.fontSize(14).text('Shipment Details:', 50, 180);
        doc.fontSize(12).text(`Shipment #: ${invoiceData.invoice.shipment.shipmentNumber}`, 50, 200);
        doc.text(`Route: ${invoiceData.invoice.shipment.origin} → ${invoiceData.invoice.shipment.destination}`, 50, 220);

        // Cost items table
        let yPosition = 280;
        doc.fontSize(14).text('Cost Breakdown:', 50, yPosition);
        yPosition += 30;

        // Table header
        doc.fontSize(10).text('Description', 50, yPosition);
        doc.text('Type', 250, yPosition);
        doc.text('Amount', 400, yPosition);
        yPosition += 20;

        // Draw line under header
        doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
        yPosition += 10;

        // Cost items
        for (const item of invoiceData.costItems) {
          doc.text(item.description, 50, yPosition);
          doc.text(item.costType, 250, yPosition);
          doc.text(`${item.currency} ${item.amount.toFixed(2)}`, 400, yPosition);
          yPosition += 20;
        }

        // Draw line under items
        doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
        yPosition += 20;

        // Totals
        doc.fontSize(12).text('Subtotal:', 400, yPosition);
        doc.text(`${invoiceData.invoice.currency} ${invoiceData.totalAmount.toFixed(2)}`, 500, yPosition);
        yPosition += 20;

        if (invoiceData.taxAmount > 0) {
          doc.text('Tax:', 400, yPosition);
          doc.text(`${invoiceData.invoice.currency} ${invoiceData.taxAmount.toFixed(2)}`, 500, yPosition);
          yPosition += 20;
        }

        doc.fontSize(14).text('Total:', 400, yPosition);
        doc.text(`${invoiceData.invoice.currency} ${invoiceData.grandTotal.toFixed(2)}`, 500, yPosition);

        // Notes
        if (invoiceData.invoice.notes) {
          yPosition += 40;
          doc.fontSize(12).text('Notes:', 50, yPosition);
          doc.fontSize(10).text(invoiceData.invoice.notes, 50, yPosition + 20);
        }

        // Footer
        doc.fontSize(8).text('Thank you for your business!', 50, 750);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get invoice summary for listing
   */
  async getInvoiceSummary(invoiceId: string): Promise<InvoiceSummary> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: {
          select: { name: true },
        },
        project: {
          select: { name: true },
        },
        shipment: {
          select: { shipmentNumber: true },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }

    const now = new Date();
    const status = this.calculateInvoiceStatus(invoice.dueDate, now);

    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      totalAmount: invoice.totalAmount,
      currency: invoice.currency,
      status,
      clientName: invoice.client?.name,
      projectName: invoice.project?.name,
      shipmentNumber: invoice.shipment.shipmentNumber,
    };
  }

  /**
   * Get all invoices with summary information
   */
  async getAllInvoiceSummaries(filters?: {
    status?: string;
    clientId?: string;
    projectId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<InvoiceSummary[]> {
    const where: any = {};

    if (filters?.clientId) {
      where.clientId = filters.clientId;
    }
    if (filters?.projectId) {
      where.projectId = filters.projectId;
    }
    if (filters?.dateFrom || filters?.dateTo) {
      where.invoiceDate = {};
      if (filters.dateFrom) {
        where.invoiceDate.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.invoiceDate.lte = filters.dateTo;
      }
    }

    const invoices = await this.prisma.invoice.findMany({
      where,
      include: {
        client: {
          select: { name: true },
        },
        project: {
          select: { name: true },
        },
        shipment: {
          select: { shipmentNumber: true },
        },
      },
      orderBy: { invoiceDate: 'desc' },
    });

    const now = new Date();
    return invoices.map(invoice => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      totalAmount: invoice.totalAmount,
      currency: invoice.currency,
      status: this.calculateInvoiceStatus(invoice.dueDate, now),
      clientName: invoice.client?.name,
      projectName: invoice.project?.name,
      shipmentNumber: invoice.shipment.shipmentNumber,
    }));
  }

  /**
   * Get cost analysis for a shipment
   */
  async getShipmentCostAnalysis(shipmentId: string): Promise<{
    totalCosts: number;
    costBreakdown: CostSummary[];
    billableCosts: number;
    nonBillableCosts: number;
    averageCostPerContainer: number;
  }> {
    const costItems = await this.prisma.costItem.findMany({
      where: { shipmentId },
    });

    const containers = await this.prisma.container.findMany({
      where: { shipmentId },
    });

    const costBreakdown = this.groupCostItemsByType(costItems);
    const totalCosts = costItems.reduce((sum, item) => sum + item.amount, 0);
    const billableCosts = costItems
      .filter(item => item.isBillable)
      .reduce((sum, item) => sum + item.amount, 0);
    const nonBillableCosts = totalCosts - billableCosts;
    const averageCostPerContainer = containers.length > 0 ? totalCosts / containers.length : 0;

    return {
      totalCosts,
      costBreakdown,
      billableCosts,
      nonBillableCosts,
      averageCostPerContainer,
    };
  }

  /**
   * Group cost items by type
   */
  private groupCostItemsByType(costItems: CostItem[]): CostSummary[] {
    const grouped = costItems.reduce((acc, item) => {
      if (!acc[item.costType]) {
        acc[item.costType] = {
          costType: item.costType,
          totalAmount: 0,
          itemCount: 0,
          items: [],
        };
      }
      acc[item.costType].totalAmount += item.amount;
      acc[item.costType].itemCount += 1;
      acc[item.costType].items.push(item);
      return acc;
    }, {} as Record<string, CostSummary>);

    return Object.values(grouped);
  }

  /**
   * Calculate invoice status based on due date
   */
  private calculateInvoiceStatus(dueDate: Date, currentDate: Date): 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED' {
    // This is a simplified implementation
    // In a real application, you would have a status field in the database
    if (currentDate > dueDate) {
      return 'OVERDUE';
    }
    return 'SENT'; // Default status
  }
}
