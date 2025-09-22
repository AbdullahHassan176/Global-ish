import { IsString, IsOptional, IsArray, IsObject, IsBoolean, IsNumber, IsEnum, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkflowStepType, WorkflowActionType, WorkflowOperator } from '../interfaces/workflow.interface';

export class CreateWorkflowDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  definition: any; // WorkflowDefinition object
}

export class UpdateWorkflowDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  definition?: any; // WorkflowDefinition object

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class StartWorkflowDto {
  @IsString()
  workflowId: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[]; // File IDs
}

export class WorkflowStepDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEnum(WorkflowStepType)
  type: WorkflowStepType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedTo?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @IsOptional()
  @IsNumber()
  sla?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowActionDto)
  actions?: WorkflowActionDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nextSteps?: string[];

  @IsOptional()
  @IsBoolean()
  parallel?: boolean;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsBoolean()
  autoComplete?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class WorkflowActionDto {
  @IsEnum(WorkflowActionType)
  type: WorkflowActionType;

  @IsObject()
  config: Record<string, any>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowConditionDto)
  conditions?: WorkflowConditionDto[];
}

export class WorkflowConditionDto {
  @IsString()
  field: string;

  @IsEnum(WorkflowOperator)
  operator: WorkflowOperator;

  @IsOptional()
  value?: any;

  @IsOptional()
  @IsEnum(['AND', 'OR'])
  logicalOperator?: 'AND' | 'OR';
}

export class AdvanceWorkflowDto {
  @IsString()
  stepId: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsBoolean()
  approved?: boolean;
}

export class PauseWorkflowDto {
  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsDateString()
  resumeAt?: string;
}

export class WorkflowInstanceQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  workflowId?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 20;
}
