import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { GDPRComplianceService } from '../services/gdpr-compliance.service';
import { SessionManagementService } from '../services/session-management.service';
import { RateLimitingService } from '../services/rate-limiting.service';
import { PIIEncryptionService } from '../services/pii-encryption.service';
import { 
  CreateConsentRecordDto, 
  UpdateConsentRecordDto,
  CreateDataRequestDto,
  CreateDataRetentionPolicyDto,
  UpdateDataRetentionPolicyDto,
  ConsentRecordQueryDto,
  DataRequestQueryDto,
  CreatePIIEncryptionKeyDto,
  UpdatePIIEncryptionKeyDto
} from '../dto/security.dto';
import { JwtAuthGuard } from '../../../../packages/auth/src/guards/jwt-auth.guard';
import { RequirePermission } from '../../../../packages/auth/src/decorators/require-permission.decorator';
import { CurrentUser } from '../../../../packages/auth/src/decorators/current-user.decorator';
import { User } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('security')
export class SecurityController {
  constructor(
    private readonly gdprComplianceService: GDPRComplianceService,
    private readonly sessionManagementService: SessionManagementService,
    private readonly rateLimitingService: RateLimitingService,
    private readonly piiEncryptionService: PIIEncryptionService,
  ) {}

  // ===== CONSENT MANAGEMENT =====

  @Post('consent')
  @RequirePermission('security.consent.create')
  createConsentRecord(
    @Body() createConsentDto: CreateConsentRecordDto,
    @CurrentUser() user: User,
  ) {
    return this.gdprComplianceService.createConsentRecord(createConsentDto, user.id);
  }

  @Get('consent')
  @RequirePermission('security.consent.read')
  getConsentRecords(
    @Query() query: ConsentRecordQueryDto,
    @CurrentUser() user: User,
  ) {
    return this.gdprComplianceService.getUserConsentRecords(user.id);
  }

  @Patch('consent/:id')
  @RequirePermission('security.consent.update')
  updateConsentRecord(
    @Param('id') id: string,
    @Body() updateConsentDto: UpdateConsentRecordDto,
  ) {
    return this.gdprComplianceService.updateConsentRecord(id, updateConsentDto);
  }

  @Post('consent/withdraw-all')
  @RequirePermission('security.consent.update')
  withdrawAllConsent(@CurrentUser() user: User) {
    return this.gdprComplianceService.withdrawAllConsent(user.id);
  }

  // ===== DATA RETENTION POLICIES =====

  @Post('retention-policies')
  @RequirePermission('security.retention.create')
  createDataRetentionPolicy(
    @Body() createPolicyDto: CreateDataRetentionPolicyDto,
    @CurrentUser() user: User,
  ) {
    return this.gdprComplianceService.createDataRetentionPolicy(createPolicyDto, user.id);
  }

  @Get('retention-policies')
  @RequirePermission('security.retention.read')
  getAllDataRetentionPolicies() {
    return this.gdprComplianceService.getAllDataRetentionPolicies();
  }

  @Patch('retention-policies/:id')
  @RequirePermission('security.retention.update')
  updateDataRetentionPolicy(
    @Param('id') id: string,
    @Body() updatePolicyDto: UpdateDataRetentionPolicyDto,
  ) {
    return this.gdprComplianceService.updateDataRetentionPolicy(id, updatePolicyDto);
  }

  @Get('retention-policies/expired-records')
  @RequirePermission('security.retention.read')
  getRecordsForDeletion() {
    return this.gdprComplianceService.getRecordsForDeletion();
  }

  // ===== DATA REQUESTS (GDPR) =====

  @Post('data-requests')
  @RequirePermission('security.data-request.create')
  createDataRequest(
    @Body() createRequestDto: CreateDataRequestDto,
    @CurrentUser() user: User,
  ) {
    return this.gdprComplianceService.createDataRequest(createRequestDto, user.id);
  }

  @Get('data-requests')
  @RequirePermission('security.data-request.read')
  getDataRequests(
    @Query() query: DataRequestQueryDto,
    @CurrentUser() user: User,
  ) {
    return this.gdprComplianceService.getUserDataRequests(user.id);
  }

  @Post('data-requests/:id/export')
  @RequirePermission('security.data-request.process')
  processDataExport(@Param('id') id: string) {
    return this.gdprComplianceService.processDataExport(id);
  }

  @Post('data-requests/:id/erasure')
  @RequirePermission('security.data-request.process')
  processDataErasure(@Param('id') id: string) {
    return this.gdprComplianceService.processDataErasure(id);
  }

  // ===== SESSION MANAGEMENT =====

  @Get('sessions')
  @RequirePermission('security.session.read')
  getUserSessions(@CurrentUser() user: User) {
    return this.sessionManagementService.getUserSessions(user.id);
  }

  @Delete('sessions/:id')
  @RequirePermission('security.session.revoke')
  revokeSession(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.sessionManagementService.revokeSession(id, user.id);
  }

  @Delete('sessions')
  @RequirePermission('security.session.revoke')
  revokeAllSessions(@CurrentUser() user: User) {
    return this.sessionManagementService.revokeAllUserSessions(user.id, user.id);
  }

  @Get('devices')
  @RequirePermission('security.device.read')
  getUserDevices(@CurrentUser() user: User) {
    return this.sessionManagementService.getUserDevices(user.id);
  }

  @Patch('devices/:id/trust')
  @RequirePermission('security.device.trust')
  trustDevice(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.sessionManagementService.trustDevice(id, user.id);
  }

  @Patch('devices/:id/untrust')
  @RequirePermission('security.device.trust')
  untrustDevice(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.sessionManagementService.untrustDevice(id, user.id);
  }

  @Delete('devices/:id')
  @RequirePermission('security.device.delete')
  removeDevice(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.sessionManagementService.removeDevice(id, user.id);
  }

  // ===== RATE LIMITING =====

  @Get('rate-limits/stats')
  @RequirePermission('security.rate-limit.read')
  getRateLimitStats() {
    return this.rateLimitingService.getRateLimitStats();
  }

  @Get('rate-limits/config')
  @RequirePermission('security.rate-limit.read')
  getRateLimitConfig() {
    return this.rateLimitingService.getRateLimitConfig();
  }

  @Post('rate-limits/unblock')
  @RequirePermission('security.rate-limit.manage')
  unblockIdentifier(
    @Body() body: { identifier: string; type: string; route?: string },
  ) {
    return this.rateLimitingService.unblockIdentifier(
      body.identifier,
      body.type as any,
      body.route
    );
  }

  // ===== PII ENCRYPTION =====

  @Post('pii-encryption/keys')
  @RequirePermission('security.encryption.create')
  createEncryptionKey(@CurrentUser() user: User) {
    return this.piiEncryptionService.createEncryptionKey(user.id);
  }

  @Post('pii-encryption/encrypt')
  @RequirePermission('security.encryption.encrypt')
  encryptPII(
    @Body() body: { data: string; fieldName: string },
    @CurrentUser() user: User,
  ) {
    return this.piiEncryptionService.encryptPII(body.data, body.fieldName, user.id);
  }

  @Post('pii-encryption/decrypt')
  @RequirePermission('security.encryption.decrypt')
  decryptPII(
    @Body() body: { encryptedData: string; fieldName: string },
    @CurrentUser() user: User,
  ) {
    return this.piiEncryptionService.decryptPII(body.encryptedData, body.fieldName, user.id);
  }

  @Post('pii-encryption/encrypt-record')
  @RequirePermission('security.encryption.encrypt')
  encryptRecord(
    @Body() body: { record: Record<string, any> },
    @CurrentUser() user: User,
  ) {
    return this.piiEncryptionService.encryptRecord(body.record, user.id);
  }

  @Post('pii-encryption/decrypt-record')
  @RequirePermission('security.encryption.decrypt')
  decryptRecord(
    @Body() body: { record: Record<string, any> },
    @CurrentUser() user: User,
  ) {
    return this.piiEncryptionService.decryptRecord(body.record, user.id);
  }

  // ===== SECURITY EVENTS =====

  @Get('events')
  @RequirePermission('security.event.read')
  getSecurityEvents(@Query() query: any) {
    // This would be implemented in a security events service
    return { message: 'Security events endpoint - to be implemented' };
  }

  // ===== COMPLIANCE REPORTS =====

  @Get('compliance/report')
  @RequirePermission('security.compliance.read')
  getComplianceReport() {
    // This would generate a comprehensive compliance report
    return { message: 'Compliance report endpoint - to be implemented' };
  }

  @Get('compliance/audit')
  @RequirePermission('security.compliance.audit')
  getAuditLog() {
    // This would return audit logs for compliance
    return { message: 'Audit log endpoint - to be implemented' };
  }
}
