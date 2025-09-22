import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsBoolean, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ContentType {
  POST = 'POST',
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  AD = 'AD',
  EMAIL = 'EMAIL',
  WEBINAR = 'WEBINAR'
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED'
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum SocialPlatform {
  LINKEDIN = 'LINKEDIN',
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  GOOGLE_ADS = 'GOOGLE_ADS',
  YOUTUBE = 'YOUTUBE'
}

export enum IntegrationStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  ERROR = 'ERROR',
  EXPIRED = 'EXPIRED'
}

// Campaign DTOs
export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}

export class UpdateCampaignDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}

// Content DTOs
export class CreateContentDto {
  @IsString()
  campaignId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ContentType)
  type: ContentType;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

// Approval DTOs
export class CreateApprovalDto {
  @IsString()
  contentId: string;

  @IsString()
  campaignId: string;

  @IsString()
  approverId: string;

  @IsOptional()
  @IsString()
  comments?: string;
}

export class UpdateApprovalDto {
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;

  @IsOptional()
  @IsString()
  comments?: string;
}

// Asset DTOs
export class CreateAssetDto {
  @IsString()
  contentId: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

// Integration DTOs
export class CreateIntegrationDto {
  @IsString()
  campaignId: string;

  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @IsOptional()
  @IsObject()
  credentials?: any;

  @IsOptional()
  @IsObject()
  settings?: any;
}

export class UpdateIntegrationDto {
  @IsOptional()
  @IsEnum(IntegrationStatus)
  status?: IntegrationStatus;

  @IsOptional()
  @IsObject()
  credentials?: any;

  @IsOptional()
  @IsObject()
  settings?: any;
}

// Query DTOs
export class CampaignQueryDto {
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

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

export class ContentQueryDto {
  @IsOptional()
  @IsString()
  campaignId?: string;

  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

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
