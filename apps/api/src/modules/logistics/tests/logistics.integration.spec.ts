import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { LogisticsModule } from '../logistics.module';
import { LogisticsService } from '../services/logistics.service';
import { CarrierIntegrationService } from '../services/carrier-integration.service';
import { AlertsService } from '../services/alerts.service';

describe('Logistics Integration Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let logisticsService: LogisticsService;
  let carrierIntegrationService: CarrierIntegrationService;
  let alertsService: AlertsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [LogisticsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    logisticsService = moduleFixture.get<LogisticsService>(LogisticsService);
    carrierIntegrationService = moduleFixture.get<CarrierIntegrationService>(CarrierIntegrationService);
    alertsService = moduleFixture.get<AlertsService>(AlertsService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await prismaService.logisticsAlert.deleteMany();
    await prismaService.invoice.deleteMany();
    await prismaService.costItem.deleteMany();
    await prismaService.carrierEvent.deleteMany();
    await prismaService.milestone.deleteMany();
    await prismaService.container.deleteMany();
    await prismaService.shipment.deleteMany();
    await prismaService.carrierIntegration.deleteMany();
  });

  describe('Complete Shipment Workflow', () => {
    it('should handle complete shipment lifecycle', async () => {
      const userId = 'user-1';
      const clientId = 'client-1';
      const projectId = 'project-1';

      // 1. Create a shipment
      const shipment = await logisticsService.createShipment({
        shipmentNumber: 'SHIP001',
        carrier: 'MAERSK',
        origin: 'Shanghai',
        destination: 'Los Angeles',
        originPort: 'Port of Shanghai',
        destinationPort: 'Port of Los Angeles',
        vesselName: 'MAERSK SHANGHAI',
        voyageNumber: '001E',
        etd: new Date('2024-01-01'),
        eta: new Date('2024-01-15'),
        projectId,
        clientId,
      }, userId);

      expect(shipment.shipmentNumber).toBe('SHIP001');
      expect(shipment.carrier).toBe('MAERSK');

      // 2. Add containers
      const container = await logisticsService.createContainer({
        containerNumber: 'MSKU1234567',
        shipmentId: shipment.id,
        containerType: '40FT',
        sealNumber: 'SEAL001',
        weight: 25000,
        volume: 67.7,
        cargoDescription: 'Electronics',
      });

      expect(container.containerNumber).toBe('MSKU1234567');

      // 3. Add milestones
      const milestones = [
        {
          shipmentId: shipment.id,
          milestoneType: 'ETD',
          location: 'Port of Shanghai',
          plannedDate: new Date('2024-01-01'),
          vesselName: 'MAERSK SHANGHAI',
          voyageNumber: '001E',
        },
        {
          shipmentId: shipment.id,
          milestoneType: 'ARRIVAL',
          location: 'Port of Los Angeles',
          plannedDate: new Date('2024-01-15'),
          vesselName: 'MAERSK SHANGHAI',
          voyageNumber: '001E',
        },
      ];

      for (const milestoneData of milestones) {
        await logisticsService.createMilestone(milestoneData);
      }

      // 4. Add cost items
      const costItems = [
        {
          shipmentId: shipment.id,
          costType: 'FREIGHT',
          description: 'Ocean freight',
          amount: 2000,
          currency: 'USD',
          vendor: 'Maersk Line',
          isBillable: true,
          projectId,
        },
        {
          shipmentId: shipment.id,
          costType: 'CUSTOMS',
          description: 'Customs clearance',
          amount: 300,
          currency: 'USD',
          vendor: 'Customs Broker',
          isBillable: true,
          projectId,
        },
      ];

      for (const costItemData of costItems) {
        await logisticsService.createCostItem(costItemData);
      }

      // 5. Generate invoice
      const invoice = await logisticsService.createInvoice({
        shipmentId: shipment.id,
        invoiceNumber: 'INV-001',
        invoiceDate: new Date('2024-01-16'),
        dueDate: new Date('2024-02-15'),
        totalAmount: 2300,
        currency: 'USD',
        clientId,
        projectId,
        notes: 'Invoice for shipment SHIP001',
      });

      expect(invoice.invoiceNumber).toBe('INV-001');
      expect(invoice.totalAmount).toBe(2300);

      // 6. Add carrier events
      const carrierEvent = await logisticsService.createCarrierEvent({
        shipmentId: shipment.id,
        eventType: 'DEPARTURE',
        eventDate: new Date('2024-01-01'),
        location: 'Port of Shanghai',
        description: 'Vessel departed from origin port',
        status: 'DEPARTED',
        vesselName: 'MAERSK SHANGHAI',
        voyageNumber: '001E',
      });

      expect(carrierEvent.eventType).toBe('DEPARTURE');

      // 7. Update shipment status
      const updatedShipment = await logisticsService.updateShipment(shipment.id, {
        status: 'IN_TRANSIT',
        actualDeparture: new Date('2024-01-01'),
      });

      expect(updatedShipment.status).toBe('IN_TRANSIT');

      // 8. Get shipment details
      const shipmentDetails = await logisticsService.findShipmentById(shipment.id);
      expect(shipmentDetails.containers).toHaveLength(1);
      expect(shipmentDetails.milestones).toHaveLength(2);
      expect(shipmentDetails.costItems).toHaveLength(2);
      expect(shipmentDetails.invoices).toHaveLength(1);
      expect(shipmentDetails.carrierEvents).toHaveLength(1);
    });
  });

  describe('Carrier Integration Workflow', () => {
    it('should handle carrier integration setup and testing', async () => {
      // 1. Get supported carriers
      const supportedCarriers = await carrierIntegrationService.getSupportedCarriers();
      expect(supportedCarriers.length).toBeGreaterThan(0);
      expect(supportedCarriers.some(c => c.carrier === 'MAERSK')).toBe(true);

      // 2. Create carrier integration
      const integration = await carrierIntegrationService.createIntegration({
        carrier: 'MAERSK',
        enabled: true,
        credentials: { apiKey: 'test-key' },
        pollingInterval: 60,
        webhookEnabled: true,
        rateLimitPerMinute: 100,
      });

      expect(integration.carrier).toBe('MAERSK');
      expect(integration.enabled).toBe(true);

      // 3. Test integration
      const testResult = await carrierIntegrationService.testIntegration('MAERSK');
      expect(testResult.success).toBeDefined();

      // 4. Get integration status
      const status = await carrierIntegrationService.getIntegrationStatus();
      const maerskStatus = status.find(s => s.carrier === 'MAERSK');
      expect(maerskStatus?.configured).toBe(true);
      expect(maerskStatus?.enabled).toBe(true);

      // 5. Get integration metrics
      const metrics = await carrierIntegrationService.getIntegrationMetrics();
      expect(metrics.totalIntegrations).toBe(1);
      expect(metrics.enabledIntegrations).toBe(1);
    });
  });

  describe('Alerts System Workflow', () => {
    it('should handle alert creation and resolution', async () => {
      const userId = 'user-1';

      // 1. Create a delayed shipment
      const shipment = await logisticsService.createShipment({
        shipmentNumber: 'SHIP002',
        carrier: 'MSC',
        origin: 'Hamburg',
        destination: 'New York',
        eta: new Date('2024-01-01'), // Past date
        status: 'IN_TRANSIT',
      }, userId);

      // 2. Check for delayed shipments
      const delayAlerts = await alertsService.checkDelayedShipments();
      expect(delayAlerts.length).toBeGreaterThan(0);

      // 3. Create a customs issue
      const customsShipment = await logisticsService.createShipment({
        shipmentNumber: 'SHIP003',
        carrier: 'CMA_CGM',
        origin: 'Rotterdam',
        destination: 'Miami',
        status: 'CUSTOMS',
      }, userId);

      // Add customs milestone
      await logisticsService.createMilestone({
        shipmentId: customsShipment.id,
        milestoneType: 'CUSTOMS',
        location: 'Port of Miami',
        actualDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      });

      // 4. Check for customs issues
      const customsAlerts = await alertsService.checkCustomsIssues();
      expect(customsAlerts.length).toBeGreaterThan(0);

      // 5. Get all active alerts
      const activeAlerts = await alertsService.getAllActiveAlerts();
      expect(activeAlerts.length).toBeGreaterThan(0);

      // 6. Resolve an alert
      if (activeAlerts.length > 0) {
        const alert = activeAlerts[0];
        const resolvedAlert = await alertsService.resolveAlert(
          alert.id,
          userId,
          'Issue resolved'
        );
        expect(resolvedAlert.isResolved).toBe(true);
        expect(resolvedAlert.resolvedBy).toBe(userId);
      }

      // 7. Get alert statistics
      const statistics = await alertsService.getAlertStatistics();
      expect(statistics.totalActiveAlerts).toBeDefined();
      expect(statistics.alertsBySeverity).toBeDefined();
      expect(statistics.alertsByType).toBeDefined();
    });
  });

  describe('Map and Tracking Workflow', () => {
    it('should handle map data and tracking', async () => {
      const userId = 'user-1';

      // 1. Create active shipments
      const shipments = [
        {
          shipmentNumber: 'SHIP004',
          carrier: 'MAERSK',
          origin: 'Shanghai',
          destination: 'Los Angeles',
          status: 'IN_TRANSIT',
        },
        {
          shipmentNumber: 'SHIP005',
          carrier: 'MSC',
          origin: 'Hamburg',
          destination: 'New York',
          status: 'CUSTOMS',
        },
      ];

      for (const shipmentData of shipments) {
        await logisticsService.createShipment(shipmentData, userId);
      }

      // 2. Get active shipment locations
      const locations = await logisticsService.getActiveShipmentLocations();
      expect(locations.length).toBe(2);

      // 3. Search shipments
      const searchResults = await logisticsService.searchShipments('SHIP004');
      expect(searchResults.shipments.length).toBe(1);
      expect(searchResults.shipments[0].shipmentNumber).toBe('SHIP004');

      // 4. Get map statistics
      const mapStats = await logisticsService.getMapStatistics();
      expect(mapStats.totalActiveShipments).toBe(2);
      expect(mapStats.shipmentsByStatus).toBeDefined();
      expect(mapStats.shipmentsByCarrier).toBeDefined();
    });
  });

  describe('Cost Analysis and Invoicing Workflow', () => {
    it('should handle cost analysis and invoice generation', async () => {
      const userId = 'user-1';
      const clientId = 'client-1';
      const projectId = 'project-1';

      // 1. Create shipment with cost items
      const shipment = await logisticsService.createShipment({
        shipmentNumber: 'SHIP006',
        carrier: 'DHL',
        origin: 'Singapore',
        destination: 'Dubai',
        projectId,
        clientId,
      }, userId);

      // 2. Add various cost items
      const costItems = [
        {
          shipmentId: shipment.id,
          costType: 'FREIGHT',
          description: 'Express freight',
          amount: 1500,
          currency: 'USD',
          isBillable: true,
          projectId,
        },
        {
          shipmentId: shipment.id,
          costType: 'CUSTOMS',
          description: 'Customs clearance',
          amount: 200,
          currency: 'USD',
          isBillable: true,
          projectId,
        },
        {
          shipmentId: shipment.id,
          costType: 'OTHER',
          description: 'Documentation',
          amount: 100,
          currency: 'USD',
          isBillable: false,
          projectId,
        },
      ];

      for (const costItemData of costItems) {
        await logisticsService.createCostItem(costItemData);
      }

      // 3. Get cost analysis
      const costAnalysis = await logisticsService.getShipmentCostAnalysis(shipment.id);
      expect(costAnalysis.totalCosts).toBe(1800);
      expect(costAnalysis.billableCosts).toBe(1700);
      expect(costAnalysis.nonBillableCosts).toBe(100);
      expect(costAnalysis.costBreakdown.length).toBe(3);

      // 4. Generate invoice
      const invoice = await logisticsService.createInvoice({
        shipmentId: shipment.id,
        invoiceNumber: 'INV-002',
        invoiceDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        totalAmount: 1700, // Only billable costs
        currency: 'USD',
        clientId,
        projectId,
        notes: 'Invoice for express shipment',
      });

      expect(invoice.totalAmount).toBe(1700);

      // 5. Get invoice summary
      const invoiceSummary = await logisticsService.getInvoiceSummary(invoice.id);
      expect(invoiceSummary.invoiceNumber).toBe('INV-002');
      expect(invoiceSummary.totalAmount).toBe(1700);
    });
  });
});
