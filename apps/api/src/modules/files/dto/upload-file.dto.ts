import { IsString, IsOptional, IsArray, IsEnum, IsInt, Min, Max } from 'class-validator';
import { AccessLevel } from '@prisma/client';

export class UploadFileDto {
  @IsString()
  name: string;

  @IsString()
  originalName: string;

  @IsString()
  mimeType: string;

  @IsInt()
  @Min(1)
  size: number;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsString()
  hash: string;

  @IsOptional()
  @IsString()
  chainAnchor?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(AccessLevel)
  accessLevel?: AccessLevel;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreateSignedUrlDto {
  @IsString()
  filename: string;

  @IsString()
  mimeType: string;

  @IsInt()
  @Min(1)
  @Max(100 * 1024 * 1024) // 100MB max
  size: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(AccessLevel)
  accessLevel?: AccessLevel;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateFileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(AccessLevel)
  accessLevel?: AccessLevel;

  @IsOptional()
  metadata?: Record<string, any>;
}
