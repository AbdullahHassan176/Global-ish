import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowsController } from '../controllers/workflows.controller';
import { WorkflowEngineService } from '../services/workflow-engine.service';
import { SignatureService } from '../services/signature.service';
import { CreateWorkflowDto, UpdateWorkflowDto, StartWorkflowInstanceDto, UpdateWorkflowInstanceDto, AdvanceWorkflowStepDto, ApproveWorkflowStepDto } from '../dto/workflow.dto';

describe('WorkflowsController', () => {
  let controller: WorkflowsController;
  let workflowEngineService: WorkflowEngineService;
  let signatureService: SignatureService;

  const mockWorkflowEngineService = {
    createWorkflow: jest.fn(),
    getWorkflow: jest.fn(),
    updateWorkflow: jest.fn(),
    deleteWorkflow: jest.fn(),
    startInstance: jest.fn(),
    getInstance: jest.fn(),
    updateInstance: jest.fn(),
    advanceStep: jest.fn(),
    approveStep: jest.fn(),
    pauseInstance: jest.fn(),
    resumeInstance: jest.fn(),
    cancelInstance: jest.fn(),
  };

  const mockSignatureService = {
    createSignatureRequest: jest.fn(),
    getSignatureStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowsController],
      providers: [
        {
          provide: WorkflowEngineService,
          useValue: mockWorkflowEngineService,
        },
        {
          provide: SignatureService,
          useValue: mockSignatureService,
        },
      ],
    }).compile();

    controller = module.get<WorkflowsController>(WorkflowsController);
    workflowEngineService = module.get<WorkflowEngineService>(WorkflowEngineService);
    signatureService = module.get<SignatureService>(SignatureService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const expectedWorkflow = {
        id: '1',
        name: 'Contract Approval Process',
        description: 'Multi-step contract review and approval process',
        definition: createWorkflowDto.definition,
        isActive: true,
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockWorkflowEngineService.createWorkflow.mockResolvedValue(expectedWorkflow);

      const result = await controller.createWorkflow(createWorkflowDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedWorkflow);
      expect(mockWorkflowEngineService.createWorkflow).toHaveBeenCalledWith(createWorkflowDto, 'user1');
    });
  });

  describe('getWorkflow', () => {
    it('should return workflow details', async () => {
      const workflowId = '1';
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
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockWorkflowEngineService.getWorkflow.mockResolvedValue(expectedWorkflow);

      const result = await controller.getWorkflow(workflowId, { user: { id: 'user1' } });

      expect(result).toEqual(expectedWorkflow);
      expect(mockWorkflowEngineService.getWorkflow).toHaveBeenCalledWith(workflowId, 'user1');
    });
  });

  describe('updateWorkflow', () => {
    it('should update workflow details', async () => {
      const workflowId = '1';
      const updateWorkflowDto: UpdateWorkflowDto = {
        name: 'Updated Contract Approval Process',
        description: 'Updated description',
        isActive: false,
      };

      const expectedResult = {
        id: '1',
        name: 'Updated Contract Approval Process',
        description: 'Updated description',
        isActive: false,
        updatedAt: new Date(),
      };

      mockWorkflowEngineService.updateWorkflow.mockResolvedValue(expectedResult);

      const result = await controller.updateWorkflow(workflowId, updateWorkflowDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockWorkflowEngineService.updateWorkflow).toHaveBeenCalledWith(workflowId, updateWorkflowDto, 'user1');
    });
  });

  describe('deleteWorkflow', () => {
    it('should delete a workflow', async () => {
      const workflowId = '1';
      mockWorkflowEngineService.deleteWorkflow.mockResolvedValue({ success: true });

      const result = await controller.deleteWorkflow(workflowId, { user: { id: 'user1' } });

      expect(result).toEqual({ success: true });
      expect(mockWorkflowEngineService.deleteWorkflow).toHaveBeenCalledWith(workflowId, 'user1');
    });
  });

  describe('startInstance', () => {
    it('should start a new workflow instance', async () => {
      const workflowId = '1';
      const startInstanceDto: StartWorkflowInstanceDto = {
        data: {
          contractId: 'contract-123',
          contractType: 'service-agreement',
          amount: 50000,
        },
      };

      const expectedInstance = {
        id: 'instance-1',
        workflowId: '1',
        status: 'RUNNING',
        currentStep: 0,
        data: startInstanceDto.data,
        startedBy: 'user1',
        startedAt: new Date(),
        completedAt: null,
        pausedAt: null,
      };

      mockWorkflowEngineService.startInstance.mockResolvedValue(expectedInstance);

      const result = await controller.startInstance(workflowId, startInstanceDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedInstance);
      expect(mockWorkflowEngineService.startInstance).toHaveBeenCalledWith(workflowId, startInstanceDto, 'user1');
    });
  });

  describe('getInstance', () => {
    it('should return workflow instance details', async () => {
      const instanceId = 'instance-1';
      const expectedInstance = {
        id: 'instance-1',
        workflowId: '1',
        status: 'RUNNING',
        currentStep: 1,
        data: {
          contractId: 'contract-123',
          contractType: 'service-agreement',
          amount: 50000,
        },
        startedBy: 'user1',
        startedAt: new Date(),
        completedAt: null,
        pausedAt: null,
        steps: [
          {
            id: 'step-1',
            instanceId: 'instance-1',
            stepIndex: 0,
            name: 'Legal Review',
            status: 'COMPLETED',
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
            status: 'IN_PROGRESS',
            assignedTo: 'finance-team',
            data: {},
            startedAt: new Date(),
            completedAt: null,
            dueDate: new Date(),
            sla: '3 days',
          },
        ],
      };

      mockWorkflowEngineService.getInstance.mockResolvedValue(expectedInstance);

      const result = await controller.getInstance(instanceId, { user: { id: 'user1' } });

      expect(result).toEqual(expectedInstance);
      expect(mockWorkflowEngineService.getInstance).toHaveBeenCalledWith(instanceId, 'user1');
    });
  });

  describe('updateInstance', () => {
    it('should update workflow instance data', async () => {
      const instanceId = 'instance-1';
      const updateInstanceDto: UpdateWorkflowInstanceDto = {
        data: {
          contractId: 'contract-123',
          contractType: 'service-agreement',
          amount: 60000, // Updated amount
        },
      };

      const expectedResult = {
        id: 'instance-1',
        data: updateInstanceDto.data,
        updatedAt: new Date(),
      };

      mockWorkflowEngineService.updateInstance.mockResolvedValue(expectedResult);

      const result = await controller.updateInstance(instanceId, updateInstanceDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockWorkflowEngineService.updateInstance).toHaveBeenCalledWith(instanceId, updateInstanceDto, 'user1');
    });
  });

  describe('advanceStep', () => {
    it('should advance workflow step', async () => {
      const instanceId = 'instance-1';
      const advanceStepDto: AdvanceWorkflowStepDto = {
        stepIndex: 1,
        data: {
          comments: 'Approved with minor revisions',
          approvedBy: 'finance-manager',
        },
      };

      const expectedResult = {
        id: 'instance-1',
        currentStep: 2,
        status: 'RUNNING',
        updatedAt: new Date(),
      };

      mockWorkflowEngineService.advanceStep.mockResolvedValue(expectedResult);

      const result = await controller.advanceStep(instanceId, advanceStepDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockWorkflowEngineService.advanceStep).toHaveBeenCalledWith(instanceId, advanceStepDto, 'user1');
    });
  });

  describe('approveStep', () => {
    it('should approve workflow step', async () => {
      const instanceId = 'instance-1';
      const approveStepDto: ApproveWorkflowStepDto = {
        stepIndex: 1,
        approved: true,
        comments: 'Approved by finance team',
      };

      const expectedResult = {
        id: 'instance-1',
        currentStep: 2,
        status: 'RUNNING',
        updatedAt: new Date(),
      };

      mockWorkflowEngineService.approveStep.mockResolvedValue(expectedResult);

      const result = await controller.approveStep(instanceId, approveStepDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockWorkflowEngineService.approveStep).toHaveBeenCalledWith(instanceId, approveStepDto, 'user1');
    });
  });

  describe('pauseInstance', () => {
    it('should pause workflow instance', async () => {
      const instanceId = 'instance-1';
      const expectedResult = {
        id: 'instance-1',
        status: 'PAUSED',
        pausedAt: new Date(),
      };

      mockWorkflowEngineService.pauseInstance.mockResolvedValue(expectedResult);

      const result = await controller.pauseInstance(instanceId, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockWorkflowEngineService.pauseInstance).toHaveBeenCalledWith(instanceId, 'user1');
    });
  });

  describe('resumeInstance', () => {
    it('should resume workflow instance', async () => {
      const instanceId = 'instance-1';
      const expectedResult = {
        id: 'instance-1',
        status: 'RUNNING',
        pausedAt: null,
      };

      mockWorkflowEngineService.resumeInstance.mockResolvedValue(expectedResult);

      const result = await controller.resumeInstance(instanceId, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockWorkflowEngineService.resumeInstance).toHaveBeenCalledWith(instanceId, 'user1');
    });
  });

  describe('cancelInstance', () => {
    it('should cancel workflow instance', async () => {
      const instanceId = 'instance-1';
      const expectedResult = {
        id: 'instance-1',
        status: 'CANCELLED',
        completedAt: new Date(),
      };

      mockWorkflowEngineService.cancelInstance.mockResolvedValue(expectedResult);

      const result = await controller.cancelInstance(instanceId, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockWorkflowEngineService.cancelInstance).toHaveBeenCalledWith(instanceId, 'user1');
    });
  });
});
