import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComplianceRecordDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsEnum(['GDPR', 'CCPA', 'SOC2', 'ISO27001', 'HIPAA'])
  type: string;

  @ApiProperty()
  @IsString()
  createdBy: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty()
  @IsEnum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'])
  @IsOptional()
  status?: string;
}

export class UpdateComplianceRecordDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsEnum(['GDPR', 'CCPA', 'SOC2', 'ISO27001', 'HIPAA'])
  @IsOptional()
  type?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty()
  @IsEnum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'])
  @IsOptional()
  status?: string;
}
