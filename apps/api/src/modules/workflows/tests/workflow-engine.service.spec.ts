import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowEngineService } from '../services/workflow-engine.service';
import { SignatureService } from '../services/signature.service';
import { PrismaService } from '../../../common/prisma.service';
import { CreateWorkflowDto, StartWorkflowInstanceDto, AdvanceWorkflowStepDto, ApproveWorkflowStepDto } from '../dto/workflow.dto';
import { WorkflowStatus, StepStatus } from '@prisma/client';

describe('WorkflowEngineService', () => {
  let service: WorkflowEngineService;
  let prismaService: PrismaService;
  let signatureService: SignatureService;

  const mockPrismaService = {
    workflow: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    workflowInstance: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    workflowStep: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    workflowAttachment: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockSignatureService = {
    createSignatureRequest: jest.fn(),
    getSignatureStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowEngineService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: SignatureService,
          useValue: mockSignatureService,
        },
      ],
    }).compile();

    service = module.get<WorkflowEngineService>(WorkflowEngineService);
    prismaService = module.get<PrismaService>(PrismaService);
    signatureService = module.get<SignatureService>(SignatureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createWorkflow', () => {
    it('should create a new workflow', async () => {
      const createWorkflowDto: CreateWorkflowDto = {
        name: 'Contract Approval Process',
        description: 'Multi-step contract review and approval process',
        definition: {
          steps: [
            {
              id: 'legal-review',
              name: 'Legal Review',
              description: 'Review contract terms and conditions',
              type: 'approval',
              assignedTo: 'legal-team',
              conditions: [],
              sla: '2 days',
            },
            {
              id: 'finance-approval',
              name: 'Finance Approval',
              description: 'Review financial terms and budget impact',
              type: 'approval',
              assignedTo: 'finance-team',
              conditions: ['legal-review.completed'],
              sla: '3 days',
            },
          ],
        },
        isActive: true,
      };

      const userId = 'user1';

      const expectedWorkflow = {
        id: '1',
        name: 'Contract Approval Process',
        description: 'Multi-step contract review and approval process',
        definition: createWorkflowDto.definition,
        isActive: true,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.workflow.create.mockResolvedValue(expectedWorkflow);

      const result = await service.createWorkflow(createWorkflowDto, userId);

      expect(result).toEqual(expectedWorkflow);
      expect(mockPrismaService.workflow.create).toHaveBeenCalledWith({
        data: {
          name: 'Contract Approval Process',
          description: 'Multi-step contract review and approval process',
          definition: createWorkflowDto.definition,
          isActive: true,
          createdBy: userId,
        },
      });
    });
  });

  describe('getWorkflow', () => {
    it('should return workflow details', async () => {
      const workflowId = '1';
      const userId = 'user1';

      const expectedWorkflow = {
        id: '1',
        name: 'Contract Approval Process',
        description: 'Multi-step contract review and approval process',
        definition: {
          steps: [
            {
              id: 'legal-review',
              name: 'Legal Review',
              description: 'Review contract terms and conditions',
              type: 'approval',
              assignedTo: 'legal-team',
              conditions: [],
              sla: '2 days',
            },
          ],
        },
        isActive: true,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.workflow.findUnique.mockResolvedValue(expectedWorkflow);

      const result = await service.getWorkflow(workflowId, userId);

      expect(result).toEqual(expectedWorkflow);
      expect(mockPrismaService.workflow.findUnique).toHaveBeenCalledWith({
        where: { id: workflowId },
      });
    });
  });

  describe('startInstance', () => {
    it('should start a new workflow instance', async () => {
      const workflowId = '1';
      const userId = 'user1';
      const startInstanceDto: StartWorkflowInstanceDto = {
        data: {
          contractId: 'contract-123',
          contractType: 'service-agreement',
          amount: 50000,
        },
      };

      const mockWorkflow = {
        id: '1',
        name: 'Contract Approval Process',
        definition: {
          steps: [
            {
              id: 'legal-review',
              name: 'Legal Review',
              type: 'approval',
              assignedTo: 'legal-team',
              conditions: [],
              sla: '2 days',
            },
          ],
        },
        isActive: true,
      };

      const expectedInstance = {
        id: 'instance-1',
        workflowId: '1',
        status: WorkflowStatus.RUNNING,
        currentStep: 0,
        data: startInstanceDto.data,
        startedBy: userId,
        startedAt: new Date(),
        completedAt: null,
        pausedAt: null,
      };

      const expectedStep = {
        id: 'step-1',
        instanceId: 'instance-1',
        stepIndex: 0,
        name: 'Legal Review',
        status: StepStatus.PENDING,
        assignedTo: 'legal-team',
        data: {},
        startedAt: null,
        completedAt: null,
        dueDate: new Date(),
        sla: '2 days',
      };

      mockPrismaService.workflow.findUnique.mockResolvedValue(mockWorkflow);
      mockPrismaService.workflowInstance.create.mockResolvedValue(expectedInstance);
      mockPrismaService.workflowStep.create.mockResolvedValue(expectedStep);

      const result = await service.startInstance(workflowId, startInstanceDto, userId);

      expect(result).toEqual(expectedInstance);
      expect(mockPrismaService.workflowInstance.create).toHaveBeenCalledWith({
        data: {
          workflowId,
          status: WorkflowStatus.RUNNING,
          currentStep: 0,
          data: startInstanceDto.data,
          startedBy: userId,
          startedAt: expect.any(Date),
        },
      });
      expect(mockPrismaService.workflowStep.create).toHaveBeenCalledWith({
        data: {
          instanceId: 'instance-1',
          stepIndex: 0,
          name: 'Legal Review',
          status: StepStatus.PENDING,
          assignedTo: 'legal-team',
          data: {},
          dueDate: expect.any(Date),
          sla: '2 days',
        },
      });
    });
  });

  describe('getInstance', () => {
    it('should return workflow instance with steps', async () => {
      const instanceId = 'instance-1';
      const userId = 'user1';

      const expectedInstance = {
        id: 'instance-1',
        workflowId: '1',
        status: WorkflowStatus.RUNNING,
        currentStep: 1,
        data: {
          contractId: 'contract-123',
          contractType: 'service-agreement',
          amount: 50000,
        },
        startedBy: userId,
        startedAt: new Date(),
        completedAt: null,
        pausedAt: null,
        steps: [
          {
            id: 'step-1',
            instanceId: 'instance-1',
            stepIndex: 0,
            name: 'Legal Review',
            status: StepStatus.COMPLETED,
            assignedTo: 'legal-team',
            data: {},
            startedAt: new Date(),
            completedAt: new Date(),
            dueDate: new Date(),
            sla: '2 days',
          },
          {
            id: 'step-2',
            instanceId: 'instance-1',
            stepIndex: 1,
            name: 'Finance Approval',
            status: StepStatus.IN_PROGRESS,
            assignedTo: 'finance-team',
            data: {},
            startedAt: new Date(),
            completedAt: null,
            dueDate: new Date(),
            sla: '3 days',
          },
        ],
      };

      mockPrismaService.workflowInstance.findUnique.mockResolvedValue(expectedInstance);

      const result = await service.getInstance(instanceId, userId);

      expect(result).toEqual(expectedInstance);
      expect(mockPrismaService.workflowInstance.findUnique).toHaveBeenCalledWith({
        where: { id: instanceId },
        include: {
          steps: {
            orderBy: { stepIndex: 'asc' },
          },
          attachments: true,
        },
      });
    });
  });

  describe('advanceStep', () => {
    it('should advance workflow step', async () => {
      const instanceId = 'instance-1';
      const userId = 'user1';
      const advanceStepDto: AdvanceWorkflowStepDto = {
        stepIndex: 1,
        data: {
          comments: 'Approved with minor revisions',
          approvedBy: 'finance-manager',
        },
      };

      const mockInstance = {
        id: 'instance-1',
        workflowId: '1',
        status: WorkflowStatus.RUNNING,
        currentStep: 1,
        data: {},
        startedBy: userId,
        startedAt: new Date(),
        completedAt: null,
        pausedAt: null,
      };

      const mockWorkflow = {
        id: '1',
        definition: {
          steps: [
            { id: 'legal-review', name: 'Legal Review', type: 'approval' },
            { id: 'finance-approval', name: 'Finance Approval', type: 'approval' },
            { id: 'executive-signoff', name: 'Executive Sign-off', type: 'approval' },
          ],
        },
      };

      const expectedResult = {
        id: 'instance-1',
        currentStep: 2,
        status: WorkflowStatus.RUNNING,
        updatedAt: new Date(),
      };

      mockPrismaService.workflowInstance.findUnique.mockResolvedValue(mockInstance);
      mockPrismaService.workflow.findUnique.mockResolvedValue(mockWorkflow);
      mockPrismaService.workflowStep.update.mockResolvedValue({});
      mockPrismaService.workflowInstance.update.mockResolvedValue(expectedResult);

      const result = await service.advanceStep(instanceId, advanceStepDto, userId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.workflowStep.update).toHaveBeenCalledWith({
        where: {
          instanceId_stepIndex: {
            instanceId,
            stepIndex: 1,
          },
        },
        data: {
          status: StepStatus.COMPLETED,
          data: advanceStepDto.data,
          completedAt: expect.any(Date),
        },
      });
    });
  });

  describe('approveStep', () => {
    it('should approve workflow step', async () => {
      const instanceId = 'instance-1';
      const userId = 'user1';
      const approveStepDto: ApproveWorkflowStepDto = {
        stepIndex: 1,
        approved: true,
        comments: 'Approved by finance team',
      };

      const mockInstance = {
        id: 'instance-1',
        workflowId: '1',
        status: WorkflowStatus.RUNNING,
        currentStep: 1,
        data: {},
        startedBy: userId,
        startedAt: new Date(),
        completedAt: null,
        pausedAt: null,
      };

      const expectedResult = {
        id: 'instance-1',
        currentStep: 2,
        status: WorkflowStatus.RUNNING,
        updatedAt: new Date(),
      };

      mockPrismaService.workflowInstance.findUnique.mockResolvedValue(mockInstance);
      mockPrismaService.workflowStep.update.mockResolvedValue({});
      mockPrismaService.workflowInstance.update.mockResolvedValue(expectedResult);

      const result = await service.approveStep(instanceId, approveStepDto, userId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.workflowStep.update).toHaveBeenCalledWith({
        where: {
          instanceId_stepIndex: {
            instanceId,
            stepIndex: 1,
          },
        },
        data: {
          status: approveStepDto.approved ? StepStatus.COMPLETED : StepStatus.FAILED,
          data: {
            approved: approveStepDto.approved,
            comments: approveStepDto.comments,
            approvedBy: userId,
            approvedAt: expect.any(Date),
          },
          completedAt: expect.any(Date),
        },
      });
    });
  });

  describe('pauseInstance', () => {
    it('should pause workflow instance', async () => {
      const instanceId = 'instance-1';
      const userId = 'user1';

      const expectedResult = {
        id: 'instance-1',
        status: WorkflowStatus.PAUSED,
        pausedAt: new Date(),
      };

      mockPrismaService.workflowInstance.update.mockResolvedValue(expectedResult);

      const result = await service.pauseInstance(instanceId, userId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.workflowInstance.update).toHaveBeenCalledWith({
        where: { id: instanceId },
        data: {
          status: WorkflowStatus.PAUSED,
          pausedAt: expect.any(Date),
        },
      });
    });
  });

  describe('resumeInstance', () => {
    it('should resume workflow instance', async () => {
      const instanceId = 'instance-1';
      const userId = 'user1';

      const expectedResult = {
        id: 'instance-1',
        status: WorkflowStatus.RUNNING,
        pausedAt: null,
      };

      mockPrismaService.workflowInstance.update.mockResolvedValue(expectedResult);

      const result = await service.resumeInstance(instanceId, userId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.workflowInstance.update).toHaveBeenCalledWith({
        where: { id: instanceId },
        data: {
          status: WorkflowStatus.RUNNING,
          pausedAt: null,
        },
      });
    });
  });

  describe('cancelInstance', () => {
    it('should cancel workflow instance', async () => {
      const instanceId = 'instance-1';
      const userId = 'user1';

      const expectedResult = {
        id: 'instance-1',
        status: WorkflowStatus.CANCELLED,
        completedAt: new Date(),
      };

      mockPrismaService.workflowInstance.update.mockResolvedValue(expectedResult);

      const result = await service.cancelInstance(instanceId, userId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.workflowInstance.update).toHaveBeenCalledWith({
        where: { id: instanceId },
        data: {
          status: WorkflowStatus.CANCELLED,
          completedAt: expect.any(Date),
        },
      });
    });
  });
});
