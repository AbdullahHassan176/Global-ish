import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from '../services/invoice.service';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    shipment: {
      findUnique: jest.fn(),
    },
    costItem: {
      findMany: jest.fn(),
    },
    invoice: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    container: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateInvoice', () => {
    it('should generate invoice successfully', async () => {
      const mockShipment = {
        id: 'shipment-1',
        shipmentNumber: 'SHIP001',
        clientId: 'client-1',
        projectId: 'project-1',
        client: { id: 'client-1', name: 'Test Client' },
        project: { id: 'project-1', name: 'Test Project' },
      };

      const mockCostItems = [
        {
          id: 'cost-1',
          amount: 1000,
          currency: 'USD',
          costType: 'FREIGHT',
          description: 'Ocean freight',
        },
        {
          id: 'cost-2',
          amount: 200,
          currency: 'USD',
          costType: 'CUSTOMS',
          description: 'Customs clearance',
        },
      ];

      const mockInvoice = {
        id: 'invoice-1',
        invoiceNumber: 'INV-001',
        totalAmount: 1200,
        currency: 'USD',
        shipmentId: 'shipment-1',
      };

      mockPrismaService.shipment.findUnique.mockResolvedValue(mockShipment);
      mockPrismaService.costItem.findMany.mockResolvedValue(mockCostItems);
      mockPrismaService.invoice.create.mockResolvedValue(mockInvoice);

      const result = await service.generateInvoice(
        'shipment-1',
        ['cost-1', 'cost-2'],
        {
          invoiceNumber: 'INV-001',
          invoiceDate: new Date('2024-01-01'),
          dueDate: new Date('2024-01-31'),
          taxRate: 0,
        }
      );

      expect(mockPrismaService.shipment.findUnique).toHaveBeenCalledWith({
        where: { id: 'shipment-1' },
        include: { client: true, project: true },
      });

      expect(mockPrismaService.costItem.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['cost-1', 'cost-2'] },
          shipmentId: 'shipment-1',
        },
      });

      expect(mockPrismaService.invoice.create).toHaveBeenCalledWith({
        data: {
          shipmentId: 'shipment-1',
          invoiceNumber: 'INV-001',
          invoiceDate: new Date('2024-01-01'),
          dueDate: new Date('2024-01-31'),
          totalAmount: 1200,
          currency: 'USD',
          clientId: 'client-1',
          projectId: 'project-1',
          notes: undefined,
        },
        include: expect.any(Object),
      });

      expect(result).toEqual(mockInvoice);
    });

    it('should throw error if shipment not found', async () => {
      mockPrismaService.shipment.findUnique.mockResolvedValue(null);

      await expect(
        service.generateInvoice(
          'non-existent',
          ['cost-1'],
          {
            invoiceNumber: 'INV-001',
            invoiceDate: new Date('2024-01-01'),
            dueDate: new Date('2024-01-31'),
          }
        )
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw error if no cost items found', async () => {
      const mockShipment = { id: 'shipment-1' };
      mockPrismaService.shipment.findUnique.mockResolvedValue(mockShipment);
      mockPrismaService.costItem.findMany.mockResolvedValue([]);

      await expect(
        service.generateInvoice(
          'shipment-1',
          ['cost-1'],
          {
            invoiceNumber: 'INV-001',
            invoiceDate: new Date('2024-01-01'),
            dueDate: new Date('2024-01-31'),
          }
        )
      ).rejects.toThrow('No cost items found for invoice generation');
    });
  });

  describe('getInvoiceData', () => {
    it('should return invoice data with cost breakdown', async () => {
      const mockInvoice = {
        id: 'invoice-1',
        invoiceNumber: 'INV-001',
        invoiceDate: new Date('2024-01-01'),
        dueDate: new Date('2024-01-31'),
        totalAmount: 1200,
        currency: 'USD',
        shipmentId: 'shipment-1',
        shipment: {
          id: 'shipment-1',
          shipmentNumber: 'SHIP001',
          origin: 'Shanghai',
          destination: 'Los Angeles',
        },
        client: {
          id: 'client-1',
          name: 'Test Client',
          email: 'client@test.com',
          address: '123 Test St',
        },
        project: {
          id: 'project-1',
          name: 'Test Project',
        },
      };

      const mockCostItems = [
        {
          id: 'cost-1',
          amount: 1000,
          currency: 'USD',
          costType: 'FREIGHT',
          description: 'Ocean freight',
        },
        {
          id: 'cost-2',
          amount: 200,
          currency: 'USD',
          costType: 'CUSTOMS',
          description: 'Customs clearance',
        },
      ];

      mockPrismaService.invoice.findUnique.mockResolvedValue(mockInvoice);
      mockPrismaService.costItem.findMany.mockResolvedValue(mockCostItems);

      const result = await service.getInvoiceData('invoice-1');

      expect(result.invoice).toEqual(mockInvoice);
      expect(result.costItems).toEqual(mockCostItems);
      expect(result.totalAmount).toBe(1200);
      expect(result.taxAmount).toBe(0);
      expect(result.grandTotal).toBe(1200);
      expect(result.costSummary).toHaveLength(2);
      expect(result.costSummary[0].costType).toBe('CUSTOMS');
      expect(result.costSummary[1].costType).toBe('FREIGHT');
    });

    it('should throw error if invoice not found', async () => {
      mockPrismaService.invoice.findUnique.mockResolvedValue(null);

      await expect(service.getInvoiceData('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getInvoiceSummary', () => {
    it('should return invoice summary with calculated status', async () => {
      const mockInvoice = {
        id: 'invoice-1',
        invoiceNumber: 'INV-001',
        invoiceDate: new Date('2024-01-01'),
        dueDate: new Date('2024-01-31'),
        totalAmount: 1200,
        currency: 'USD',
        client: { name: 'Test Client' },
        project: { name: 'Test Project' },
        shipment: { shipmentNumber: 'SHIP001' },
      };

      mockPrismaService.invoice.findUnique.mockResolvedValue(mockInvoice);

      const result = await service.getInvoiceSummary('invoice-1');

      expect(result.id).toBe('invoice-1');
      expect(result.invoiceNumber).toBe('INV-001');
      expect(result.totalAmount).toBe(1200);
      expect(result.currency).toBe('USD');
      expect(result.status).toBe('SENT'); // Default status
      expect(result.clientName).toBe('Test Client');
      expect(result.projectName).toBe('Test Project');
      expect(result.shipmentNumber).toBe('SHIP001');
    });
  });

  describe('getAllInvoiceSummaries', () => {
    it('should return all invoice summaries with filters', async () => {
      const mockInvoices = [
        {
          id: 'invoice-1',
          invoiceNumber: 'INV-001',
          invoiceDate: new Date('2024-01-01'),
          dueDate: new Date('2024-01-31'),
          totalAmount: 1200,
          currency: 'USD',
          client: { name: 'Test Client' },
          project: { name: 'Test Project' },
          shipment: { shipmentNumber: 'SHIP001' },
        },
      ];

      mockPrismaService.invoice.findMany.mockResolvedValue(mockInvoices);

      const result = await service.getAllInvoiceSummaries({
        clientId: 'client-1',
        dateFrom: new Date('2024-01-01'),
        dateTo: new Date('2024-01-31'),
      });

      expect(mockPrismaService.invoice.findMany).toHaveBeenCalledWith({
        where: {
          clientId: 'client-1',
          invoiceDate: {
            gte: new Date('2024-01-01'),
            lte: new Date('2024-01-31'),
          },
        },
        include: expect.any(Object),
        orderBy: { invoiceDate: 'desc' },
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('invoice-1');
    });
  });

  describe('getShipmentCostAnalysis', () => {
    it('should return cost analysis for shipment', async () => {
      const mockCostItems = [
        {
          id: 'cost-1',
          amount: 1000,
          costType: 'FREIGHT',
          isBillable: true,
        },
        {
          id: 'cost-2',
          amount: 200,
          costType: 'CUSTOMS',
          isBillable: true,
        },
        {
          id: 'cost-3',
          amount: 100,
          costType: 'OTHER',
          isBillable: false,
        },
      ];

      const mockContainers = [
        { id: 'container-1' },
        { id: 'container-2' },
      ];

      mockPrismaService.costItem.findMany.mockResolvedValue(mockCostItems);
      mockPrismaService.container.findMany.mockResolvedValue(mockContainers);

      const result = await service.getShipmentCostAnalysis('shipment-1');

      expect(result.totalCosts).toBe(1300);
      expect(result.billableCosts).toBe(1200);
      expect(result.nonBillableCosts).toBe(100);
      expect(result.averageCostPerContainer).toBe(650);
      expect(result.costBreakdown).toHaveLength(3);
    });
  });

  describe('generateInvoicePDF', () => {
    it('should generate PDF buffer', async () => {
      const mockInvoiceData = {
        invoice: {
          id: 'invoice-1',
          invoiceNumber: 'INV-001',
          invoiceDate: new Date('2024-01-01'),
          dueDate: new Date('2024-01-31'),
          currency: 'USD',
          notes: 'Test notes',
          client: {
            name: 'Test Client',
            email: 'client@test.com',
            address: '123 Test St',
          },
          shipment: {
            shipmentNumber: 'SHIP001',
            origin: 'Shanghai',
            destination: 'Los Angeles',
          },
        },
        costItems: [
          {
            description: 'Ocean freight',
            costType: 'FREIGHT',
            amount: 1000,
            currency: 'USD',
          },
        ],
        costSummary: [],
        totalAmount: 1000,
        taxAmount: 0,
        grandTotal: 1000,
      };

      jest.spyOn(service, 'getInvoiceData').mockResolvedValue(mockInvoiceData);

      const result = await service.generateInvoicePDF('invoice-1');

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
