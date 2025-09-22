import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PIIEncryptionService } from './pii-encryption.service';
import { 
  CreateConsentRecordDto, 
  UpdateConsentRecordDto,
  CreateDataRequestDto,
  UpdateDataRequestDto,
  CreateDataRetentionPolicyDto,
  UpdateDataRetentionPolicyDto
} from '../dto/security.dto';
import { 
  ConsentRecord, 
  DataRequest, 
  DataRetentionPolicy,
  ConsentType,
  LegalBasis,
  DataRequestType,
  DataRequestStatus
} from '@prisma/client';
import { 
  GDPRComplianceService,
  ConsentManagement,
  DataLifecycleManagement,
  DataExportService,
  DataErasureService
} from '../interfaces/gdpr-compliance.interface';

@Injectable()
export class GDPRComplianceService implements GDPRComplianceService {
  private readonly logger = new Logger(GDPRComplianceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly piiEncryption: PIIEncryptionService,
  ) {}

  // ===== CONSENT MANAGEMENT =====

  /**
   * Create a new consent record
   */
  async createConsentRecord(
    createDto: CreateConsentRecordDto,
    userId: string
  ): Promise<ConsentRecord> {
    this.logger.log(`Creating consent record for user ${userId}: ${createDto.consentType}`);

    const consentRecord = await this.prisma.consentRecord.create({
      data: {
        userId,
        consentType: createDto.consentType,
        purpose: createDto.purpose,
        legalBasis: createDto.legalBasis,
        isGranted: createDto.isGranted,
        grantedAt: createDto.isGranted ? new Date() : null,
        expiresAt: createDto.expiresAt,
        version: createDto.version || '1.0',
        metadata: createDto.metadata,
      },
    });

    // Log consent event
    await this.logSecurityEvent(
      createDto.isGranted ? 'CONSENT_GRANTED' : 'CONSENT_WITHDRAWN',
      'MEDIUM',
      userId,
      `Consent ${createDto.isGranted ? 'granted' : 'withdrawn'} for ${createDto.consentType}`,
      { consentType: createDto.consentType, purpose: createDto.purpose }
    );

    return consentRecord;
  }

  /**
   * Get all consent records for a user
   */
  async getUserConsentRecords(userId: string): Promise<ConsentRecord[]> {
    return this.prisma.consentRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update consent record
   */
  async updateConsentRecord(
    id: string,
    updateDto: UpdateConsentRecordDto
  ): Promise<ConsentRecord> {
    const existingRecord = await this.prisma.consentRecord.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException(`Consent record with ID ${id} not found`);
    }

    const updatedRecord = await this.prisma.consentRecord.update({
      where: { id },
      data: {
        isGranted: updateDto.isGranted,
        withdrawnAt: updateDto.isGranted ? null : new Date(),
        expiresAt: updateDto.expiresAt,
        version: updateDto.version,
        metadata: updateDto.metadata,
      },
    });

    // Log consent change
    await this.logSecurityEvent(
      updateDto.isGranted ? 'CONSENT_GRANTED' : 'CONSENT_WITHDRAWN',
      'MEDIUM',
      existingRecord.userId,
      `Consent ${updateDto.isGranted ? 'granted' : 'withdrawn'} for ${existingRecord.consentType}`,
      { consentType: existingRecord.consentType, recordId: id }
    );

    return updatedRecord;
  }

  /**
   * Check if user has given consent for a specific purpose
   */
  async hasConsent(userId: string, consentType: ConsentType, purpose: string): Promise<boolean> {
    const consentRecord = await this.prisma.consentRecord.findFirst({
      where: {
        userId,
        consentType,
        purpose,
        isGranted: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return !!consentRecord;
  }

  /**
   * Withdraw all consent for a user
   */
  async withdrawAllConsent(userId: string): Promise<void> {
    await this.prisma.consentRecord.updateMany({
      where: {
        userId,
        isGranted: true,
      },
      data: {
        isGranted: false,
        withdrawnAt: new Date(),
      },
    });

    // Log consent withdrawal
    await this.logSecurityEvent(
      'CONSENT_WITHDRAWN',
      'HIGH',
      userId,
      'All consent withdrawn by user',
      { userId }
    );
  }

  // ===== DATA RETENTION POLICIES =====

  /**
   * Create a new data retention policy
   */
  async createDataRetentionPolicy(
    createDto: CreateDataRetentionPolicyDto,
    createdBy: string
  ): Promise<DataRetentionPolicy> {
    this.logger.log(`Creating data retention policy for record type: ${createDto.recordType}`);

    const policy = await this.prisma.dataRetentionPolicy.create({
      data: {
        recordType: createDto.recordType,
        retentionPeriod: createDto.retentionPeriod,
        autoDelete: createDto.autoDelete,
        legalBasis: createDto.legalBasis,
        description: createDto.description,
        createdBy,
      },
    });

    return policy;
  }

  /**
   * Get all data retention policies
   */
  async getAllDataRetentionPolicies(): Promise<DataRetentionPolicy[]> {
    return this.prisma.dataRetentionPolicy.findMany({
      where: { isActive: true },
      orderBy: { recordType: 'asc' },
    });
  }

  /**
   * Update data retention policy
   */
  async updateDataRetentionPolicy(
    id: string,
    updateDto: UpdateDataRetentionPolicyDto
  ): Promise<DataRetentionPolicy> {
    const existingPolicy = await this.prisma.dataRetentionPolicy.findUnique({
      where: { id },
    });

    if (!existingPolicy) {
      throw new NotFoundException(`Data retention policy with ID ${id} not found`);
    }

    const updatedPolicy = await this.prisma.dataRetentionPolicy.update({
      where: { id },
      data: {
        retentionPeriod: updateDto.retentionPeriod,
        autoDelete: updateDto.autoDelete,
        legalBasis: updateDto.legalBasis,
        description: updateDto.description,
        isActive: updateDto.isActive,
      },
    });

    return updatedPolicy;
  }

  /**
   * Get records that should be deleted based on retention policies
   */
  async getRecordsForDeletion(): Promise<Array<{ recordType: string; count: number; records: any[] }>> {
    const policies = await this.getAllDataRetentionPolicies();
    const recordsToDelete: Array<{ recordType: string; count: number; records: any[] }> = [];

    for (const policy of policies) {
      if (!policy.autoDelete) continue;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - policy.retentionPeriod);

      // Get records older than retention period
      const records = await this.getRecordsByType(policy.recordType, cutoffDate);
      
      if (records.length > 0) {
        recordsToDelete.push({
          recordType: policy.recordType,
          count: records.length,
          records,
        });
      }
    }

    return recordsToDelete;
  }

  // ===== DATA EXPORT/ERASURE REQUESTS =====

  /**
   * Create a new data request (export/erasure)
   */
  async createDataRequest(
    createDto: CreateDataRequestDto,
    createdBy: string
  ): Promise<DataRequest> {
    this.logger.log(`Creating data request for user ${createDto.userId}: ${createDto.requestType}`);

    // Set expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const dataRequest = await this.prisma.dataRequest.create({
      data: {
        userId: createDto.userId,
        requestType: createDto.requestType,
        expiresAt,
        metadata: createDto.metadata,
        createdBy,
      },
    });

    // Log data request
    await this.logSecurityEvent(
      createDto.requestType === 'EXPORT' ? 'DATA_EXPORT' : 'DATA_ERASURE',
      'HIGH',
      createDto.userId,
      `Data ${createDto.requestType.toLowerCase()} request created`,
      { requestType: createDto.requestType, requestId: dataRequest.id }
    );

    return dataRequest;
  }

  /**
   * Get all data requests for a user
   */
  async getUserDataRequests(userId: string): Promise<DataRequest[]> {
    return this.prisma.dataRequest.findMany({
      where: { userId },
      orderBy: { requestedAt: 'desc' },
    });
  }

  /**
   * Process data export request
   */
  async processDataExport(requestId: string): Promise<DataRequest> {
    const request = await this.prisma.dataRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException(`Data request with ID ${requestId} not found`);
    }

    if (request.requestType !== 'EXPORT') {
      throw new BadRequestException('Request is not a data export request');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request has already been processed');
    }

    // Update status to processing
    await this.prisma.dataRequest.update({
      where: { id: requestId },
      data: { status: 'PROCESSING' },
    });

    try {
      // Collect all user data
      const userData = await this.collectUserData(request.userId);
      
      // Generate export file
      const fileUrl = await this.generateExportFile(userData, request.userId);
      
      // Update request with file URL
      const updatedRequest = await this.prisma.dataRequest.update({
        where: { id: requestId },
        data: {
          status: 'COMPLETED',
          processedAt: new Date(),
          fileUrl,
        },
      });

      // Log successful export
      await this.logSecurityEvent(
        'DATA_EXPORT',
        'HIGH',
        request.userId,
        'Data export completed successfully',
        { requestId, fileUrl }
      );

      return updatedRequest;
    } catch (error) {
      // Update request with failure status
      await this.prisma.dataRequest.update({
        where: { id: requestId },
        data: {
          status: 'FAILED',
          processedAt: new Date(),
          metadata: {
            ...request.metadata,
            error: error.message,
          },
        },
      });

      // Log failed export
      await this.logSecurityEvent(
        'DATA_EXPORT',
        'HIGH',
        request.userId,
        'Data export failed',
        { requestId, error: error.message }
      );

      throw error;
    }
  }

  /**
   * Process data erasure request
   */
  async processDataErasure(requestId: string): Promise<DataRequest> {
    const request = await this.prisma.dataRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException(`Data request with ID ${requestId} not found`);
    }

    if (request.requestType !== 'ERASURE') {
      throw new BadRequestException('Request is not a data erasure request');
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException('Request has already been processed');
    }

    // Update status to processing
    await this.prisma.dataRequest.update({
      where: { id: requestId },
      data: { status: 'PROCESSING' },
    });

    try {
      // Erase user data
      await this.eraseUserData(request.userId);
      
      // Update request status
      const updatedRequest = await this.prisma.dataRequest.update({
        where: { id: requestId },
        data: {
          status: 'COMPLETED',
          processedAt: new Date(),
        },
      });

      // Log successful erasure
      await this.logSecurityEvent(
        'DATA_ERASURE',
        'CRITICAL',
        request.userId,
        'Data erasure completed successfully',
        { requestId }
      );

      return updatedRequest;
    } catch (error) {
      // Update request with failure status
      await this.prisma.dataRequest.update({
        where: { id: requestId },
        data: {
          status: 'FAILED',
          processedAt: new Date(),
          metadata: {
            ...request.metadata,
            error: error.message,
          },
        },
      });

      // Log failed erasure
      await this.logSecurityEvent(
        'DATA_ERASURE',
        'CRITICAL',
        request.userId,
        'Data erasure failed',
        { requestId, error: error.message }
      );

      throw error;
    }
  }

  // ===== PRIVATE HELPER METHODS =====

  /**
   * Get records by type and date
   */
  private async getRecordsByType(recordType: string, cutoffDate: Date): Promise<any[]> {
    // This would need to be implemented based on the specific record types
    // For now, we'll return an empty array
    return [];
  }

  /**
   * Collect all user data for export
   */
  private async collectUserData(userId: string): Promise<Record<string, any>> {
    const userData: Record<string, any> = {};

    // Get user profile
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (user) {
      userData.profile = user;
    }

    // Get user sessions
    const sessions = await this.prisma.userSession.findMany({
      where: { userId },
    });
    userData.sessions = sessions;

    // Get user devices
    const devices = await this.prisma.userDevice.findMany({
      where: { userId },
    });
    userData.devices = devices;

    // Get consent records
    const consentRecords = await this.prisma.consentRecord.findMany({
      where: { userId },
    });
    userData.consentRecords = consentRecords;

    // Get audit logs
    const auditLogs = await this.prisma.auditLog.findMany({
      where: { userId },
    });
    userData.auditLogs = auditLogs;

    // Add more data collection as needed
    // This would include shipments, invoices, etc.

    return userData;
  }

  /**
   * Generate export file
   */
  private async generateExportFile(userData: Record<string, any>, userId: string): Promise<string> {
    // In a real implementation, this would generate a JSON/XML file
    // and upload it to a secure storage location
    const fileName = `user-data-export-${userId}-${Date.now()}.json`;
    const fileUrl = `https://secure-storage.example.com/exports/${fileName}`;
    
    // Simulate file generation
    this.logger.log(`Generated export file: ${fileUrl}`);
    
    return fileUrl;
  }

  /**
   * Erase user data
   */
  private async eraseUserData(userId: string): Promise<void> {
    // This would need to be implemented carefully to ensure data is properly erased
    // while maintaining referential integrity and legal requirements
    
    // Delete user sessions
    await this.prisma.userSession.deleteMany({
      where: { userId },
    });

    // Delete user devices
    await this.prisma.userDevice.deleteMany({
      where: { userId },
    });

    // Delete consent records
    await this.prisma.consentRecord.deleteMany({
      where: { userId },
    });

    // Anonymize user profile (don't delete for audit purposes)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted-${userId}@example.com`,
        name: 'Deleted User',
        isActive: false,
      },
    });

    // Add more data erasure as needed
    // This would include anonymizing related records
  }

  /**
   * Log security event
   */
  private async logSecurityEvent(
    eventType: string,
    severity: string,
    userId?: string,
    description?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await this.prisma.securityEvent.create({
        data: {
          eventType: eventType as any,
          severity: severity as any,
          userId,
          description: description || `Security event: ${eventType}`,
          metadata,
        },
      });
    } catch (error) {
      this.logger.error('Failed to log security event:', error);
    }
  }
}
