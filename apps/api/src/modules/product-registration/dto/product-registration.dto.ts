import { IsString, IsOptional, IsEnum, IsDateString, IsBoolean, IsNumber, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export enum RegistrationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ISSUE = 'ISSUE',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export enum DocumentType {
  APPLICATION = 'APPLICATION',
  CERTIFICATE = 'CERTIFICATE',
  MANUAL = 'MANUAL',
  SPECIFICATION = 'SPECIFICATION',
  TEST_REPORT = 'TEST_REPORT',
  OTHER = 'OTHER'
}

export enum SubmissionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ISSUE = 'ISSUE',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum CommunicationType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  LETTER = 'LETTER',
  MEETING = 'MEETING',
  OTHER = 'OTHER'
}

export enum CommunicationDirection {
  OUTBOUND = 'OUTBOUND',
  INBOUND = 'INBOUND'
}

// Product Registration DTOs
export class CreateProductRegistrationDto {
  @IsString()
  productName: string;

  @IsString()
  productCode: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class UpdateProductRegistrationDto {
  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  productCode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsEnum(RegistrationStatus)
  status?: RegistrationStatus;

  @IsOptional()
  @IsDateString()
  submittedAt?: string;

  @IsOptional()
  @IsDateString()
  approvedAt?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

// Checklist DTOs
export class CreateChecklistItemDto {
  @IsString()
  item: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateChecklistItemDto {
  @IsOptional()
  @IsString()
  item?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class BulkUpdateChecklistDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateChecklistItemDto)
  items: UpdateChecklistItemDto[];
}

// Document DTOs
export class CreateDocumentDto {
  @IsString()
  name: string;

  @IsEnum(DocumentType)
  type: DocumentType;

  @IsString()
  url: string;

  @IsOptional()
  @IsBoolean()
  isGenerated?: boolean;
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsBoolean()
  isGenerated?: boolean;
}

// Submission DTOs
export class CreateSubmissionDto {
  @IsString()
  authority: string;

  @IsOptional()
  @IsString()
  submissionId?: string;

  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

  @IsOptional()
  @IsDateString()
  submittedAt?: string;

  @IsOptional()
  @IsString()
  response?: string;
}

export class UpdateSubmissionDto {
  @IsOptional()
  @IsString()
  authority?: string;

  @IsOptional()
  @IsString()
  submissionId?: string;

  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

  @IsOptional()
  @IsDateString()
  submittedAt?: string;

  @IsOptional()
  @IsDateString()
  responseAt?: string;

  @IsOptional()
  @IsString()
  response?: string;
}

// Communication DTOs
export class CreateCommunicationDto {
  @IsEnum(CommunicationType)
  type: CommunicationType;

  @IsString()
  subject: string;

  @IsString()
  content: string;

  @IsEnum(CommunicationDirection)
  direction: CommunicationDirection;

  @IsOptional()
  @IsDateString()
  sentAt?: string;

  @IsOptional()
  @IsDateString()
  receivedAt?: string;
}

export class UpdateCommunicationDto {
  @IsOptional()
  @IsEnum(CommunicationType)
  type?: CommunicationType;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(CommunicationDirection)
  direction?: CommunicationDirection;

  @IsOptional()
  @IsDateString()
  sentAt?: string;

  @IsOptional()
  @IsDateString()
  receivedAt?: string;
}

// Query DTOs
export class ProductRegistrationQueryDto {
  @IsOptional()
  @IsEnum(RegistrationStatus)
  status?: RegistrationStatus;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class ChecklistQueryDto {
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;
}

export class DocumentQueryDto {
  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

  @IsOptional()
  @IsBoolean()
  isGenerated?: boolean;
}

export class SubmissionQueryDto {
  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

  @IsOptional()
  @IsString()
  authority?: string;
}

export class CommunicationQueryDto {
  @IsOptional()
  @IsEnum(CommunicationType)
  type?: CommunicationType;

  @IsOptional()
  @IsEnum(CommunicationDirection)
  direction?: CommunicationDirection;
}

// Document Generation DTOs
export class GenerateDocumentDto {
  @IsString()
  templateId: string;

  @IsOptional()
  @IsObject()
  variables?: any;
}

export class DocumentTemplateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(DocumentType)
  type: DocumentType;

  @IsString()
  content: string;

  @IsOptional()
  @IsObject()
  variables?: any;

  @IsOptional()
  @IsString()
  country?: string;
}

// Expiry Alert DTOs
export class ExpiryAlertDto {
  @IsString()
  registrationId: string;

  @IsNumber()
  daysBeforeExpiry: number;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recipients?: string[];
}
