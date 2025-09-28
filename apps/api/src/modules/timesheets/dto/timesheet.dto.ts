import { IsString, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTimesheetDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  projectId: string;

  @ApiProperty()
  @IsNumber()
  hours: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsString()
  createdBy: string;

  @ApiProperty()
  @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
  @IsOptional()
  status?: string;
}

export class UpdateTimesheetDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  hours?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty()
  @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
  @IsOptional()
  status?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  approvedBy?: string;
}
