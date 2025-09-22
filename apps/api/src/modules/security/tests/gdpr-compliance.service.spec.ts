import { Test, TestingModule } from '@nestjs/testing';
import { GDPRComplianceService } from '../services/gdpr-compliance.service';
import { PIIEncryptionService } from '../services/pii-encryption.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConsentType, LegalBasis, DataRequestType, DataRequestStatus } from '@prisma/client';

describe('GDPRComplianceService', () => {
  let service: GDPRComplianceService;
  let prismaService: PrismaService;
  let piiEncryptionService: PIIEncryptionService;

  const mockPrismaService = {
    consentRecord: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      findFirst: jest.fn(),
    },
    dataRetentionPolicy: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    dataRequest: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    userSession: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    userDevice: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    auditLog: {
      findMany: jest.fn(),
    },
    securityEvent: {
      create: jest.fn(),
    },
  };

  const mockPIIEncryptionService = {
    encryptPII: jest.fn(),
    decryptPII: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GDPRComplianceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PIIEncryptionService,
          useValue: mockPIIEncryptionService,
        },
      ],
    }).compile();

    service = module.get<GDPRComplianceService>(GDPRComplianceService);
    prismaService = module.get<PrismaService>(PrismaService);
    piiEncryptionService = module.get<PIIEncryptionService>(PIIEncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createConsentRecord', () => {
    it('should create a consent record successfully', async () => {
      const createDto = {
        consentType: ConsentType.DATA_PROCESSING,
        purpose: 'Service provision',
        legalBasis: LegalBasis.CONTRACT,
        isGranted: true,
        version: '1.0',
      };

      const mockConsentRecord = {
        id: 'consent-1',
        userId: 'user-1',
        ...createDto,
        grantedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.consentRecord.create.mockResolvedValue(mockConsentRecord);
      mockPrismaService.securityEvent.create.mockResolvedValue({});

      const result = await service.createConsentRecord(createDto, 'user-1');

      expect(result).toEqual(mockConsentRecord);
      expect(mockPrismaService.consentRecord.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          consentType: createDto.consentType,
          purpose: createDto.purpose,
          legalBasis: createDto.legalBasis,
          isGranted: createDto.isGranted,
          grantedAt: expect.any(Date),
          expiresAt: undefined,
          version: createDto.version,
          metadata: undefined,
        },
      });
      expect(mockPrismaService.securityEvent.create).toHaveBeenCalledWith({
        data: {
          eventType: 'CONSENT_GRANTED',
          severity: 'MEDIUM',
          userId: 'user-1',
          description: 'Consent granted for DATA_PROCESSING',
          metadata: {
            consentType: createDto.consentType,
            purpose: createDto.purpose,
          },
        },
      });
    });

    it('should create a withdrawn consent record', async () => {
      const createDto = {
        consentType: ConsentType.MARKETING,
        purpose: 'Marketing communications',
        legalBasis: LegalBasis.CONSENT,
        isGranted: false,
        version: '1.0',
      };

      const mockConsentRecord = {
        id: 'consent-2',
        userId: 'user-1',
        ...createDto,
        grantedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.consentRecord.create.mockResolvedValue(mockConsentRecord);
      mockPrismaService.securityEvent.create.mockResolvedValue({});

      const result = await service.createConsentRecord(createDto, 'user-1');

      expect(result).toEqual(mockConsentRecord);
      expect(mockPrismaService.securityEvent.create).toHaveBeenCalledWith({
        data: {
          eventType: 'CONSENT_WITHDRAWN',
          severity: 'MEDIUM',
          userId: 'user-1',
          description: 'Consent withdrawn for MARKETING',
          metadata: {
            consentType: createDto.consentType,
            purpose: createDto.purpose,
          },
        },
      });
    });
  });

  describe('getUserConsentRecords', () => {
    it('should return user consent records', async () => {
      const mockConsentRecords = [
        {
          id: 'consent-1',
          userId: 'user-1',
          consentType: ConsentType.DATA_PROCESSING,
          purpose: 'Service provision',
          legalBasis: LegalBasis.CONTRACT,
          isGranted: true,
          createdAt: new Date(),
        },
        {
          id: 'consent-2',
          userId: 'user-1',
          consentType: ConsentType.MARKETING,
          purpose: 'Marketing communications',
          legalBasis: LegalBasis.CONSENT,
          isGranted: false,
          createdAt: new Date(),
        },
      ];

      mockPrismaService.consentRecord.findMany.mockResolvedValue(mockConsentRecords);

      const result = await service.getUserConsentRecords('user-1');

      expect(result).toEqual(mockConsentRecords);
      expect(mockPrismaService.consentRecord.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('updateConsentRecord', () => {
    it('should update consent record successfully', async () => {
      const existingRecord = {
        id: 'consent-1',
        userId: 'user-1',
        consentType: ConsentType.MARKETING,
        purpose: 'Marketing communications',
        legalBasis: LegalBasis.CONSENT,
        isGranted: true,
        grantedAt: new Date(),
        withdrawnAt: null,
      };

      const updateDto = {
        isGranted: false,
        version: '1.1',
      };

      const updatedRecord = {
        ...existingRecord,
        ...updateDto,
        withdrawnAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.consentRecord.findUnique.mockResolvedValue(existingRecord);
      mockPrismaService.consentRecord.update.mockResolvedValue(updatedRecord);
      mockPrismaService.securityEvent.create.mockResolvedValue({});

      const result = await service.updateConsentRecord('consent-1', updateDto);

      expect(result).toEqual(updatedRecord);
      expect(mockPrismaService.consentRecord.update).toHaveBeenCalledWith({
        where: { id: 'consent-1' },
        data: {
          isGranted: updateDto.isGranted,
          withdrawnAt: expect.any(Date),
          expiresAt: undefined,
          version: updateDto.version,
          metadata: undefined,
        },
      });
    });

    it('should throw error when consent record not found', async () => {
      mockPrismaService.consentRecord.findUnique.mockResolvedValue(null);

      await expect(service.updateConsentRecord('nonexistent', {})).rejects.toThrow(
        'Consent record with ID nonexistent not found'
      );
    });
  });

  describe('hasConsent', () => {
    it('should return true when user has valid consent', async () => {
      const mockConsentRecord = {
        id: 'consent-1',
        userId: 'user-1',
        consentType: ConsentType.DATA_PROCESSING,
        purpose: 'Service provision',
        isGranted: true,
        expiresAt: null,
        createdAt: new Date(),
      };

      mockPrismaService.consentRecord.findFirst.mockResolvedValue(mockConsentRecord);

      const result = await service.hasConsent('user-1', ConsentType.DATA_PROCESSING, 'Service provision');

      expect(result).toBe(true);
      expect(mockPrismaService.consentRecord.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          consentType: ConsentType.DATA_PROCESSING,
          purpose: 'Service provision',
          isGranted: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: expect.any(Date) } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return false when user has no consent', async () => {
      mockPrismaService.consentRecord.findFirst.mockResolvedValue(null);

      const result = await service.hasConsent('user-1', ConsentType.MARKETING, 'Marketing communications');

      expect(result).toBe(false);
    });

    it('should return false when consent has expired', async () => {
      const expiredConsent = {
        id: 'consent-1',
        userId: 'user-1',
        consentType: ConsentType.MARKETING,
        purpose: 'Marketing communications',
        isGranted: true,
        expiresAt: new Date(Date.now() - 86400000), // 1 day ago
        createdAt: new Date(),
      };

      mockPrismaService.consentRecord.findFirst.mockResolvedValue(expiredConsent);

      const result = await service.hasConsent('user-1', ConsentType.MARKETING, 'Marketing communications');

      expect(result).toBe(false);
    });
  });

  describe('withdrawAllConsent', () => {
    it('should withdraw all consent for a user', async () => {
      mockPrismaService.consentRecord.updateMany.mockResolvedValue({ count: 3 });
      mockPrismaService.securityEvent.create.mockResolvedValue({});

      await service.withdrawAllConsent('user-1');

      expect(mockPrismaService.consentRecord.updateMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          isGranted: true,
        },
        data: {
          isGranted: false,
          withdrawnAt: expect.any(Date),
        },
      });
      expect(mockPrismaService.securityEvent.create).toHaveBeenCalledWith({
        data: {
          eventType: 'CONSENT_WITHDRAWN',
          severity: 'HIGH',
          userId: 'user-1',
          description: 'All consent withdrawn by user',
          metadata: { userId: 'user-1' },
        },
      });
    });
  });

  describe('createDataRetentionPolicy', () => {
    it('should create a data retention policy', async () => {
      const createDto = {
        recordType: 'user',
        retentionPeriod: 2555, // 7 years
        autoDelete: false,
        legalBasis: 'Legal obligation',
        description: 'User data retention for legal compliance',
      };

      const mockPolicy = {
        id: 'policy-1',
        ...createDto,
        isActive: true,
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.dataRetentionPolicy.create.mockResolvedValue(mockPolicy);

      const result = await service.createDataRetentionPolicy(createDto, 'user-1');

      expect(result).toEqual(mockPolicy);
      expect(mockPrismaService.dataRetentionPolicy.create).toHaveBeenCalledWith({
        data: {
          recordType: createDto.recordType,
          retentionPeriod: createDto.retentionPeriod,
          autoDelete: createDto.autoDelete,
          legalBasis: createDto.legalBasis,
          description: createDto.description,
          createdBy: 'user-1',
        },
      });
    });
  });

  describe('getAllDataRetentionPolicies', () => {
    it('should return all active data retention policies', async () => {
      const mockPolicies = [
        {
          id: 'policy-1',
          recordType: 'user',
          retentionPeriod: 2555,
          autoDelete: false,
          isActive: true,
        },
        {
          id: 'policy-2',
          recordType: 'session',
          retentionPeriod: 90,
          autoDelete: true,
          isActive: true,
        },
      ];

      mockPrismaService.dataRetentionPolicy.findMany.mockResolvedValue(mockPolicies);

      const result = await service.getAllDataRetentionPolicies();

      expect(result).toEqual(mockPolicies);
      expect(mockPrismaService.dataRetentionPolicy.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { recordType: 'asc' },
      });
    });
  });

  describe('createDataRequest', () => {
    it('should create a data export request', async () => {
      const createDto = {
        userId: 'user-1',
        requestType: DataRequestType.EXPORT,
        metadata: { reason: 'User requested data export' },
      };

      const mockDataRequest = {
        id: 'request-1',
        ...createDto,
        status: DataRequestStatus.PENDING,
        requestedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.dataRequest.create.mockResolvedValue(mockDataRequest);
      mockPrismaService.securityEvent.create.mockResolvedValue({});

      const result = await service.createDataRequest(createDto, 'user-1');

      expect(result).toEqual(mockDataRequest);
      expect(mockPrismaService.dataRequest.create).toHaveBeenCalledWith({
        data: {
          userId: createDto.userId,
          requestType: createDto.requestType,
          expiresAt: expect.any(Date),
          metadata: createDto.metadata,
          createdBy: 'user-1',
        },
      });
      expect(mockPrismaService.securityEvent.create).toHaveBeenCalledWith({
        data: {
          eventType: 'DATA_EXPORT',
          severity: 'HIGH',
          userId: createDto.userId,
          description: 'Data export request created',
          metadata: {
            requestType: createDto.requestType,
            requestId: mockDataRequest.id,
          },
        },
      });
    });

    it('should create a data erasure request', async () => {
      const createDto = {
        userId: 'user-1',
        requestType: DataRequestType.ERASURE,
        metadata: { reason: 'User requested data deletion' },
      };

      const mockDataRequest = {
        id: 'request-2',
        ...createDto,
        status: DataRequestStatus.PENDING,
        requestedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.dataRequest.create.mockResolvedValue(mockDataRequest);
      mockPrismaService.securityEvent.create.mockResolvedValue({});

      const result = await service.createDataRequest(createDto, 'user-1');

      expect(result).toEqual(mockDataRequest);
      expect(mockPrismaService.securityEvent.create).toHaveBeenCalledWith({
        data: {
          eventType: 'DATA_ERASURE',
          severity: 'HIGH',
          userId: createDto.userId,
          description: 'Data erasure request created',
          metadata: {
            requestType: createDto.requestType,
            requestId: mockDataRequest.id,
          },
        },
      });
    });
  });

  describe('processDataExport', () => {
    it('should process data export request successfully', async () => {
      const mockRequest = {
        id: 'request-1',
        userId: 'user-1',
        requestType: DataRequestType.EXPORT,
        status: DataRequestStatus.PENDING,
        metadata: {},
      };

      const mockUserData = {
        profile: { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
        sessions: [],
        devices: [],
        consentRecords: [],
        auditLogs: [],
      };

      const mockUpdatedRequest = {
        ...mockRequest,
        status: DataRequestStatus.COMPLETED,
        processedAt: new Date(),
        fileUrl: 'https://secure-storage.example.com/exports/user-data-export-user-1-1234567890.json',
      };

      mockPrismaService.dataRequest.findUnique.mockResolvedValue(mockRequest);
      mockPrismaService.dataRequest.update.mockResolvedValue(mockUpdatedRequest);
      mockPrismaService.securityEvent.create.mockResolvedValue({});

      // Mock the private methods
      jest.spyOn(service as any, 'collectUserData').mockResolvedValue(mockUserData);
      jest.spyOn(service as any, 'generateExportFile').mockResolvedValue(mockUpdatedRequest.fileUrl);

      const result = await service.processDataExport('request-1');

      expect(result).toEqual(mockUpdatedRequest);
      expect(mockPrismaService.dataRequest.update).toHaveBeenCalledWith({
        where: { id: 'request-1' },
        data: { status: 'PROCESSING' },
      });
      expect(mockPrismaService.dataRequest.update).toHaveBeenCalledWith({
        where: { id: 'request-1' },
        data: {
          status: 'COMPLETED',
          processedAt: expect.any(Date),
          fileUrl: mockUpdatedRequest.fileUrl,
        },
      });
    });

    it('should handle data export failure', async () => {
      const mockRequest = {
        id: 'request-1',
        userId: 'user-1',
        requestType: DataRequestType.EXPORT,
        status: DataRequestStatus.PENDING,
        metadata: {},
      };

      const error = new Error('Failed to collect user data');

      mockPrismaService.dataRequest.findUnique.mockResolvedValue(mockRequest);
      mockPrismaService.dataRequest.update.mockResolvedValue({
        ...mockRequest,
        status: DataRequestStatus.FAILED,
        processedAt: new Date(),
        metadata: { error: error.message },
      });
      mockPrismaService.securityEvent.create.mockResolvedValue({});

      jest.spyOn(service as any, 'collectUserData').mockRejectedValue(error);

      await expect(service.processDataExport('request-1')).rejects.toThrow('Failed to collect user data');

      expect(mockPrismaService.dataRequest.update).toHaveBeenCalledWith({
        where: { id: 'request-1' },
        data: {
          status: 'FAILED',
          processedAt: expect.any(Date),
          metadata: {
            error: error.message,
          },
        },
      });
    });

    it('should throw error for non-export request', async () => {
      const mockRequest = {
        id: 'request-1',
        userId: 'user-1',
        requestType: DataRequestType.ERASURE,
        status: DataRequestStatus.PENDING,
      };

      mockPrismaService.dataRequest.findUnique.mockResolvedValue(mockRequest);

      await expect(service.processDataExport('request-1')).rejects.toThrow(
        'Request is not a data export request'
      );
    });

    it('should throw error for already processed request', async () => {
      const mockRequest = {
        id: 'request-1',
        userId: 'user-1',
        requestType: DataRequestType.EXPORT,
        status: DataRequestStatus.COMPLETED,
      };

      mockPrismaService.dataRequest.findUnique.mockResolvedValue(mockRequest);

      await expect(service.processDataExport('request-1')).rejects.toThrow(
        'Request has already been processed'
      );
    });
  });

  describe('processDataErasure', () => {
    it('should process data erasure request successfully', async () => {
      const mockRequest = {
        id: 'request-1',
        userId: 'user-1',
        requestType: DataRequestType.ERASURE,
        status: DataRequestStatus.PENDING,
        metadata: {},
      };

      const mockUpdatedRequest = {
        ...mockRequest,
        status: DataRequestStatus.COMPLETED,
        processedAt: new Date(),
      };

      mockPrismaService.dataRequest.findUnique.mockResolvedValue(mockRequest);
      mockPrismaService.dataRequest.update.mockResolvedValue(mockUpdatedRequest);
      mockPrismaService.securityEvent.create.mockResolvedValue({});

      jest.spyOn(service as any, 'eraseUserData').mockResolvedValue(undefined);

      const result = await service.processDataErasure('request-1');

      expect(result).toEqual(mockUpdatedRequest);
      expect(mockPrismaService.dataRequest.update).toHaveBeenCalledWith({
        where: { id: 'request-1' },
        data: { status: 'PROCESSING' },
      });
      expect(mockPrismaService.dataRequest.update).toHaveBeenCalledWith({
        where: { id: 'request-1' },
        data: {
          status: 'COMPLETED',
          processedAt: expect.any(Date),
        },
      });
    });

    it('should handle data erasure failure', async () => {
      const mockRequest = {
        id: 'request-1',
        userId: 'user-1',
        requestType: DataRequestType.ERASURE,
        status: DataRequestStatus.PENDING,
        metadata: {},
      };

      const error = new Error('Failed to erase user data');

      mockPrismaService.dataRequest.findUnique.mockResolvedValue(mockRequest);
      mockPrismaService.dataRequest.update.mockResolvedValue({
        ...mockRequest,
        status: DataRequestStatus.FAILED,
        processedAt: new Date(),
        metadata: { error: error.message },
      });
      mockPrismaService.securityEvent.create.mockResolvedValue({});

      jest.spyOn(service as any, 'eraseUserData').mockRejectedValue(error);

      await expect(service.processDataErasure('request-1')).rejects.toThrow('Failed to erase user data');

      expect(mockPrismaService.dataRequest.update).toHaveBeenCalledWith({
        where: { id: 'request-1' },
        data: {
          status: 'FAILED',
          processedAt: expect.any(Date),
          metadata: {
            error: error.message,
          },
        },
      });
    });
  });

  describe('collectUserData', () => {
    it('should collect all user data for export', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const mockSessions = [
        { id: 'session-1', userId: 'user-1', ipAddress: '192.168.1.1' },
      ];

      const mockDevices = [
        { id: 'device-1', userId: 'user-1', deviceName: 'MacBook Pro' },
      ];

      const mockConsentRecords = [
        { id: 'consent-1', userId: 'user-1', consentType: 'DATA_PROCESSING' },
      ];

      const mockAuditLogs = [
        { id: 'log-1', userId: 'user-1', action: 'LOGIN' },
      ];

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.userSession.findMany.mockResolvedValue(mockSessions);
      mockPrismaService.userDevice.findMany.mockResolvedValue(mockDevices);
      mockPrismaService.consentRecord.findMany.mockResolvedValue(mockConsentRecords);
      mockPrismaService.auditLog.findMany.mockResolvedValue(mockAuditLogs);

      const result = await (service as any).collectUserData('user-1');

      expect(result).toEqual({
        profile: mockUser,
        sessions: mockSessions,
        devices: mockDevices,
        consentRecords: mockConsentRecords,
        auditLogs: mockAuditLogs,
      });
    });
  });

  describe('eraseUserData', () => {
    it('should erase user data successfully', async () => {
      mockPrismaService.userSession.deleteMany.mockResolvedValue({ count: 2 });
      mockPrismaService.userDevice.deleteMany.mockResolvedValue({ count: 1 });
      mockPrismaService.consentRecord.deleteMany.mockResolvedValue({ count: 3 });
      mockPrismaService.user.update.mockResolvedValue({
        id: 'user-1',
        email: 'deleted-user-1@example.com',
        name: 'Deleted User',
        isActive: false,
      });

      await (service as any).eraseUserData('user-1');

      expect(mockPrismaService.userSession.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(mockPrismaService.userDevice.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(mockPrismaService.consentRecord.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: {
          email: 'deleted-user-1@example.com',
          name: 'Deleted User',
          isActive: false,
        },
      });
    });
  });
});
