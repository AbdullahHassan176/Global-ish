import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { 
  WorkflowDefinition, 
  WorkflowStep, 
  WorkflowExecutionContext, 
  WorkflowInstanceData,
  WorkflowStepType,
  WorkflowActionType,
  WorkflowOperator
} from '../interfaces/workflow.interface';
import { WorkflowStatus, StepStatus } from '@prisma/client';
import { NotificationService } from '../../notifications/services/notification.service';
import { SignatureService } from './signature.service';

@Injectable()
export class WorkflowEngineService {
  private readonly logger = new Logger(WorkflowEngineService.name);

  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    private signatureService: SignatureService
  ) {}

  async startWorkflow(workflowId: string, startedBy: string, data?: WorkflowInstanceData): Promise<string> {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId, isActive: true }
    });

    if (!workflow) {
      throw new Error('Workflow not found or inactive');
    }

    const definition = workflow.definition as WorkflowDefinition;

    // Create workflow instance
    const instance = await this.prisma.workflowInstance.create({
      data: {
        workflowId,
        status: WorkflowStatus.RUNNING,
        currentStep: 0,
        data: data || {},
        startedBy
      }
    });

    // Create initial steps
    await this.createWorkflowSteps(instance.id, definition);

    // Start the workflow
    await this.advanceWorkflow(instance.id, startedBy);

    this.logger.log(`Workflow instance ${instance.id} started for workflow ${workflowId}`);
    return instance.id;
  }

  async advanceWorkflow(instanceId: string, userId: string, stepData?: Record<string, any>): Promise<void> {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { id: instanceId },
      include: {
        workflow: true,
        steps: {
          orderBy: { stepIndex: 'asc' }
        }
      }
    });

    if (!instance) {
      throw new Error('Workflow instance not found');
    }

    const definition = instance.workflow.definition as WorkflowDefinition;
    const currentStep = instance.steps.find(step => step.stepIndex === instance.currentStep);

    if (!currentStep) {
      throw new Error('Current step not found');
    }

    // Update current step with data
    if (stepData) {
      await this.prisma.workflowStep.update({
        where: { id: currentStep.id },
        data: {
          data: { ...currentStep.data, ...stepData },
          completedAt: new Date()
        }
      });
    }

    // Mark current step as completed
    await this.prisma.workflowStep.update({
      where: { id: currentStep.id },
      data: { status: StepStatus.COMPLETED }
    });

    // Determine next steps
    const nextSteps = await this.determineNextSteps(instance, definition, currentStep);

    if (nextSteps.length === 0) {
      // Workflow completed
      await this.completeWorkflow(instanceId);
      return;
    }

    // Update current step index
    const nextStepIndex = Math.min(...nextSteps.map(step => step.stepIndex));
    await this.prisma.workflowInstance.update({
      where: { id: instanceId },
      data: { currentStep: nextStepIndex }
    });

    // Execute next steps
    for (const step of nextSteps) {
      await this.executeStep(instanceId, step, definition);
    }
  }

  async pauseWorkflow(instanceId: string, reason?: string): Promise<void> {
    await this.prisma.workflowInstance.update({
      where: { id: instanceId },
      data: {
        status: WorkflowStatus.PAUSED,
        pausedAt: new Date()
      }
    });

    this.logger.log(`Workflow instance ${instanceId} paused: ${reason || 'No reason provided'}`);
  }

  async resumeWorkflow(instanceId: string, userId: string): Promise<void> {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { id: instanceId },
      include: {
        workflow: true,
        steps: {
          orderBy: { stepIndex: 'asc' }
        }
      }
    });

    if (!instance) {
      throw new Error('Workflow instance not found');
    }

    if (instance.status !== WorkflowStatus.PAUSED) {
      throw new Error('Workflow is not paused');
    }

    await this.prisma.workflowInstance.update({
      where: { id: instanceId },
      data: {
        status: WorkflowStatus.RUNNING,
        pausedAt: null
      }
    });

    // Continue from current step
    const definition = instance.workflow.definition as WorkflowDefinition;
    const currentStep = instance.steps.find(step => step.stepIndex === instance.currentStep);

    if (currentStep) {
      await this.executeStep(instanceId, currentStep, definition);
    }

    this.logger.log(`Workflow instance ${instanceId} resumed`);
  }

  async cancelWorkflow(instanceId: string, reason?: string): Promise<void> {
    await this.prisma.workflowInstance.update({
      where: { id: instanceId },
      data: {
        status: WorkflowStatus.CANCELLED,
        completedAt: new Date()
      }
    });

    // Cancel all pending steps
    await this.prisma.workflowStep.updateMany({
      where: {
        instanceId,
        status: { in: [StepStatus.PENDING, StepStatus.IN_PROGRESS] }
      },
      data: { status: StepStatus.SKIPPED }
    });

    this.logger.log(`Workflow instance ${instanceId} cancelled: ${reason || 'No reason provided'}`);
  }

  private async createWorkflowSteps(instanceId: string, definition: WorkflowDefinition): Promise<void> {
    const steps = definition.steps.map((step, index) => ({
      instanceId,
      stepIndex: index,
      name: step.name,
      status: StepStatus.PENDING,
      assignedTo: Array.isArray(step.assignedTo) ? step.assignedTo[0] : step.assignedTo,
      data: {},
      sla: step.sla
    }));

    await this.prisma.workflowStep.createMany({
      data: steps
    });
  }

  private async determineNextSteps(instance: any, definition: WorkflowDefinition, currentStep: any): Promise<any[]> {
    const currentStepDef = definition.steps[currentStep.stepIndex];
    const nextSteps: any[] = [];

    if (currentStepDef.nextSteps && currentStepDef.nextSteps.length > 0) {
      // Explicit next steps defined
      for (const nextStepId of currentStepDef.nextSteps) {
        const nextStepIndex = definition.steps.findIndex(step => step.id === nextStepId);
        if (nextStepIndex !== -1) {
          const nextStep = instance.steps.find(step => step.stepIndex === nextStepIndex);
          if (nextStep && nextStep.status === StepStatus.PENDING) {
            nextSteps.push(nextStep);
          }
        }
      }
    } else {
      // Default: next sequential step
      const nextStepIndex = currentStep.stepIndex + 1;
      const nextStep = instance.steps.find(step => step.stepIndex === nextStepIndex);
      if (nextStep && nextStep.status === StepStatus.PENDING) {
        nextSteps.push(nextStep);
      }
    }

    return nextSteps;
  }

  private async executeStep(instanceId: string, step: any, definition: WorkflowDefinition): Promise<void> {
    const stepDef = definition.steps[step.stepIndex];
    const context: WorkflowExecutionContext = {
      instanceId,
      currentStep: step.stepIndex,
      data: step.data || {},
      variables: {},
      user: {
        id: step.assignedTo || '',
        role: '',
        attributes: {}
      },
      metadata: {}
    };

    // Update step status
    await this.prisma.workflowStep.update({
      where: { id: step.id },
      data: {
        status: StepStatus.IN_PROGRESS,
        startedAt: new Date()
      }
    });

    try {
      // Execute step based on type
      switch (stepDef.type) {
        case WorkflowStepType.MANUAL:
          await this.executeManualStep(step, stepDef, context);
          break;
        case WorkflowStepType.APPROVAL:
          await this.executeApprovalStep(step, stepDef, context);
          break;
        case WorkflowStepType.SIGNATURE:
          await this.executeSignatureStep(step, stepDef, context);
          break;
        case WorkflowStepType.NOTIFICATION:
          await this.executeNotificationStep(step, stepDef, context);
          break;
        case WorkflowStepType.AUTOMATED:
          await this.executeAutomatedStep(step, stepDef, context);
          break;
        default:
          this.logger.warn(`Unknown step type: ${stepDef.type}`);
      }

      // Execute actions
      if (stepDef.actions) {
        for (const action of stepDef.actions) {
          await this.executeAction(action, context);
        }
      }

    } catch (error) {
      this.logger.error(`Error executing step ${step.id}:`, error);
      
      await this.prisma.workflowStep.update({
        where: { id: step.id },
        data: { status: StepStatus.FAILED }
      });

      throw error;
    }
  }

  private async executeManualStep(step: any, stepDef: any, context: WorkflowExecutionContext): Promise<void> {
    // Manual steps require human intervention
    // Just mark as in progress and wait for manual completion
    this.logger.log(`Manual step ${step.id} is waiting for human intervention`);
  }

  private async executeApprovalStep(step: any, stepDef: any, context: WorkflowExecutionContext): Promise<void> {
    // Send approval notification to assigned users
    if (stepDef.assignedTo) {
      const assignees = Array.isArray(stepDef.assignedTo) ? stepDef.assignedTo : [stepDef.assignedTo];
      
      for (const assignee of assignees) {
        await this.notificationService.sendNotification({
          userId: assignee,
          type: 'APPROVAL_REQUIRED',
          title: `Approval Required: ${stepDef.name}`,
          message: `You have a pending approval for: ${stepDef.name}`,
          data: {
            workflowInstanceId: context.instanceId,
            stepId: step.id,
            stepName: stepDef.name
          }
        });
      }
    }
  }

  private async executeSignatureStep(step: any, stepDef: any, context: WorkflowExecutionContext): Promise<void> {
    // Create signature request
    const signatureRequest = {
      title: stepDef.name,
      message: stepDef.description,
      documents: [], // Would be populated from workflow attachments
      signers: stepDef.assignedTo ? stepDef.assignedTo.map((assignee: string) => ({
        id: assignee,
        email: '', // Would be fetched from user data
        name: '' // Would be fetched from user data
      })) : [],
      metadata: {
        workflowInstanceId: context.instanceId,
        stepId: step.id
      }
    };

    const result = await this.signatureService.createSignatureRequest(signatureRequest);
    
    // Store signature request ID in step data
    await this.prisma.workflowStep.update({
      where: { id: step.id },
      data: {
        data: {
          ...step.data,
          signatureRequestId: result.requestId
        }
      }
    });
  }

  private async executeNotificationStep(step: any, stepDef: any, context: WorkflowExecutionContext): Promise<void> {
    // Send notifications to assigned users
    if (stepDef.assignedTo) {
      const assignees = Array.isArray(stepDef.assignedTo) ? stepDef.assignedTo : [stepDef.assignedTo];
      
      for (const assignee of assignees) {
        await this.notificationService.sendNotification({
          userId: assignee,
          type: 'WORKFLOW_STEP',
          title: stepDef.name,
          message: stepDef.description || `Workflow step: ${stepDef.name}`,
          data: {
            workflowInstanceId: context.instanceId,
            stepId: step.id,
            stepName: stepDef.name
          }
        });
      }
    }

    // Auto-complete notification steps
    await this.prisma.workflowStep.update({
      where: { id: step.id },
      data: {
        status: StepStatus.COMPLETED,
        completedAt: new Date()
      }
    });
  }

  private async executeAutomatedStep(step: any, stepDef: any, context: WorkflowExecutionContext): Promise<void> {
    // Automated steps are executed immediately
    // Implementation would depend on the specific automation logic
    
    await this.prisma.workflowStep.update({
      where: { id: step.id },
      data: {
        status: StepStatus.COMPLETED,
        completedAt: new Date()
      }
    });
  }

  private async executeAction(action: any, context: WorkflowExecutionContext): Promise<void> {
    switch (action.type) {
      case WorkflowActionType.SEND_EMAIL:
        await this.sendEmailAction(action, context);
        break;
      case WorkflowActionType.CREATE_TASK:
        await this.createTaskAction(action, context);
        break;
      case WorkflowActionType.CALL_WEBHOOK:
        await this.callWebhookAction(action, context);
        break;
      default:
        this.logger.warn(`Unknown action type: ${action.type}`);
    }
  }

  private async sendEmailAction(action: any, context: WorkflowExecutionContext): Promise<void> {
    // Implementation for sending emails
    this.logger.log(`Sending email action: ${action.config.subject}`);
  }

  private async createTaskAction(action: any, context: WorkflowExecutionContext): Promise<void> {
    // Implementation for creating tasks
    this.logger.log(`Creating task action: ${action.config.title}`);
  }

  private async callWebhookAction(action: any, context: WorkflowExecutionContext): Promise<void> {
    // Implementation for calling webhooks
    this.logger.log(`Calling webhook action: ${action.config.url}`);
  }

  private async completeWorkflow(instanceId: string): Promise<void> {
    await this.prisma.workflowInstance.update({
      where: { id: instanceId },
      data: {
        status: WorkflowStatus.COMPLETED,
        completedAt: new Date()
      }
    });

    this.logger.log(`Workflow instance ${instanceId} completed`);
  }
}
