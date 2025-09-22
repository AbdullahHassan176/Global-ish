export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  version: string;
  steps: WorkflowStep[];
  variables?: WorkflowVariable[];
  conditions?: WorkflowCondition[];
  sla?: WorkflowSLA;
  metadata?: Record<string, any>;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: WorkflowStepType;
  description?: string;
  assignedTo?: string | string[]; // User ID(s) or role(s)
  roles?: string[];
  conditions?: WorkflowCondition[];
  sla?: number; // SLA in minutes
  actions?: WorkflowAction[];
  nextSteps?: string[]; // IDs of next steps
  parallel?: boolean; // Can run in parallel with other steps
  required?: boolean; // Must be completed to proceed
  autoComplete?: boolean; // Auto-complete when conditions are met
  metadata?: Record<string, any>;
}

export enum WorkflowStepType {
  MANUAL = 'manual',
  AUTOMATED = 'automated',
  APPROVAL = 'approval',
  SIGNATURE = 'signature',
  NOTIFICATION = 'notification',
  CONDITION = 'condition',
  PARALLEL = 'parallel',
  SEQUENTIAL = 'sequential'
}

export interface WorkflowAction {
  type: WorkflowActionType;
  config: Record<string, any>;
  conditions?: WorkflowCondition[];
}

export enum WorkflowActionType {
  SEND_EMAIL = 'send_email',
  SEND_SMS = 'send_sms',
  CREATE_TASK = 'create_task',
  UPDATE_DATA = 'update_data',
  CALL_WEBHOOK = 'call_webhook',
  GENERATE_DOCUMENT = 'generate_document',
  REQUEST_SIGNATURE = 'request_signature'
}

export interface WorkflowCondition {
  field: string;
  operator: WorkflowOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export enum WorkflowOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  IN = 'in',
  NOT_IN = 'not_in',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty'
}

export interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  defaultValue?: any;
  required?: boolean;
  description?: string;
}

export interface WorkflowSLA {
  overall: number; // Overall SLA in minutes
  steps: Record<string, number>; // Step-specific SLAs
  escalation?: {
    enabled: boolean;
    levels: WorkflowEscalationLevel[];
  };
}

export interface WorkflowEscalationLevel {
  level: number;
  delay: number; // Delay in minutes
  action: WorkflowAction;
  notify?: string[]; // User IDs to notify
}

export interface WorkflowInstanceData {
  [key: string]: any;
}

export interface WorkflowExecutionContext {
  instanceId: string;
  currentStep: number;
  data: WorkflowInstanceData;
  variables: Record<string, any>;
  user: {
    id: string;
    role: string;
    attributes: Record<string, any>;
  };
  metadata: Record<string, any>;
}
