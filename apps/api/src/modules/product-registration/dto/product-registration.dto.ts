import { IsString, IsOptional, IsEnum, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductRegistrationDto {
  @ApiProperty()
  @IsString()
  productName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  modelNumber?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @ApiProperty()
  @IsString()
  createdBy: string;

  @ApiProperty()
  @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
  @IsOptional()
  status?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  documents?: string[];
}

export class UpdateProductRegistrationDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  productName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  manufacturer?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  modelNumber?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @ApiProperty()
  @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
  @IsOptional()
  status?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  documents?: string[];
}

export class UpdateChecklistItemDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsEnum(['PENDING', 'COMPLETED', 'SKIPPED'])
  @IsOptional()
  status?: string;
}