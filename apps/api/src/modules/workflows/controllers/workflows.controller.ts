import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowEngineService } from '../services/workflow-engine.service';
import { SignatureService } from '../services/signature.service';
import { 
  CreateWorkflowDto, 
  UpdateWorkflowDto, 
  StartWorkflowDto, 
  AdvanceWorkflowDto, 
  PauseWorkflowDto,
  WorkflowInstanceQueryDto
} from '../dto/workflow.dto';
import { JwtAuthGuard } from '@global-next/auth';
import { RequirePermission } from '@global-next/auth';
import { CurrentUser } from '@global-next/auth';
import { User } from '@global-next/types';
import { PrismaService } from '../../../prisma/prisma.service';

@ApiTags('Workflows')
@ApiBearerAuth()
@Controller('workflows')
@UseGuards(JwtAuthGuard)
export class WorkflowsController {
  constructor(
    private readonly workflowEngine: WorkflowEngineService,
    private readonly signatureService: SignatureService,
    private readonly prisma: PrismaService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new workflow' })
  @ApiResponse({ status: 201, description: 'Workflow created successfully' })
  @RequirePermission('workflows', 'write')
  async createWorkflow(
    @Body() createWorkflowDto: CreateWorkflowDto,
    @CurrentUser() user: User
  ) {
    const workflow = await this.prisma.workflow.create({
      data: {
        name: createWorkflowDto.name,
        description: createWorkflowDto.description,
        definition: createWorkflowDto.definition,
        createdBy: user.id
      }
    });

    return workflow;
  }

  @Get()
  @ApiOperation({ summary: 'Get all workflows' })
  @ApiResponse({ status: 200, description: 'Workflows retrieved successfully' })
  @RequirePermission('workflows', 'read')
  async getWorkflows(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @CurrentUser() user: User
  ) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [workflows, total] = await Promise.all([
      this.prisma.workflow.findMany({
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { instances: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      this.prisma.workflow.count()
    ]);

    return {
      workflows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow by ID' })
  @ApiResponse({ status: 200, description: 'Workflow retrieved successfully' })
  @RequirePermission('workflows', 'read')
  async getWorkflow(@Param('id') id: string, @CurrentUser() user: User) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        instances: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            starter: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!workflow) {
      throw new Error('Workflow not found');
    }

    return workflow;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update workflow' })
  @ApiResponse({ status: 200, description: 'Workflow updated successfully' })
  @RequirePermission('workflows', 'write')
  async updateWorkflow(
    @Param('id') id: string,
    @Body() updateWorkflowDto: UpdateWorkflowDto,
    @CurrentUser() user: User
  ) {
    const workflow = await this.prisma.workflow.update({
      where: { id },
      data: {
        name: updateWorkflowDto.name,
        description: updateWorkflowDto.description,
        definition: updateWorkflowDto.definition,
        isActive: updateWorkflowDto.isActive
      }
    });

    return workflow;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workflow' })
  @ApiResponse({ status: 200, description: 'Workflow deleted successfully' })
  @RequirePermission('workflows', 'delete')
  async deleteWorkflow(@Param('id') id: string, @CurrentUser() user: User) {
    await this.prisma.workflow.delete({
      where: { id }
    });

    return { message: 'Workflow deleted successfully' };
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start workflow instance' })
  @ApiResponse({ status: 201, description: 'Workflow instance started successfully' })
  @RequirePermission('workflows', 'write')
  async startWorkflow(
    @Param('id') workflowId: string,
    @Body() startWorkflowDto: StartWorkflowDto,
    @CurrentUser() user: User
  ) {
    const instanceId = await this.workflowEngine.startWorkflow(
      workflowId,
      user.id,
      startWorkflowDto.data
    );

    // Attach files if provided
    if (startWorkflowDto.attachments && startWorkflowDto.attachments.length > 0) {
      for (const fileId of startWorkflowDto.attachments) {
        await this.prisma.workflowAttachment.create({
          data: {
            instanceId,
            fileId
          }
        });
      }
    }

    return { instanceId, message: 'Workflow instance started successfully' };
  }

  @Get('instances')
  @ApiOperation({ summary: 'Get workflow instances' })
  @ApiResponse({ status: 200, description: 'Workflow instances retrieved successfully' })
  @RequirePermission('workflows', 'read')
  async getWorkflowInstances(
    @Query() query: WorkflowInstanceQueryDto,
    @CurrentUser() user: User
  ) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.workflowId) {
      where.workflowId = query.workflowId;
    }

    if (query.assignedTo) {
      where.steps = {
        some: {
          assignedTo: query.assignedTo
        }
      };
    }

    const [instances, total] = await Promise.all([
      this.prisma.workflowInstance.findMany({
        where,
        include: {
          workflow: {
            select: { id: true, name: true }
          },
          starter: {
            select: { id: true, name: true, email: true }
          },
          steps: {
            orderBy: { stepIndex: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.workflowInstance.count({ where })
    ]);

    return {
      instances,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  @Get('instances/:id')
  @ApiOperation({ summary: 'Get workflow instance by ID' })
  @ApiResponse({ status: 200, description: 'Workflow instance retrieved successfully' })
  @RequirePermission('workflows', 'read')
  async getWorkflowInstance(@Param('id') id: string, @CurrentUser() user: User) {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { id },
      include: {
        workflow: true,
        starter: {
          select: { id: true, name: true, email: true }
        },
        steps: {
          orderBy: { stepIndex: 'asc' }
        },
        attachments: {
          include: {
            file: true
          }
        }
      }
    });

    if (!instance) {
      throw new Error('Workflow instance not found');
    }

    return instance;
  }

  @Post('instances/:id/advance')
  @ApiOperation({ summary: 'Advance workflow instance' })
  @ApiResponse({ status: 200, description: 'Workflow instance advanced successfully' })
  @RequirePermission('workflows', 'write')
  async advanceWorkflow(
    @Param('id') instanceId: string,
    @Body() advanceWorkflowDto: AdvanceWorkflowDto,
    @CurrentUser() user: User
  ) {
    await this.workflowEngine.advanceWorkflow(instanceId, user.id, advanceWorkflowDto.data);
    return { message: 'Workflow instance advanced successfully' };
  }

  @Post('instances/:id/pause')
  @ApiOperation({ summary: 'Pause workflow instance' })
  @ApiResponse({ status: 200, description: 'Workflow instance paused successfully' })
  @RequirePermission('workflows', 'write')
  async pauseWorkflow(
    @Param('id') instanceId: string,
    @Body() pauseWorkflowDto: PauseWorkflowDto,
    @CurrentUser() user: User
  ) {
    await this.workflowEngine.pauseWorkflow(instanceId, pauseWorkflowDto.reason);
    return { message: 'Workflow instance paused successfully' };
  }

  @Post('instances/:id/resume')
  @ApiOperation({ summary: 'Resume workflow instance' })
  @ApiResponse({ status: 200, description: 'Workflow instance resumed successfully' })
  @RequirePermission('workflows', 'write')
  async resumeWorkflow(
    @Param('id') instanceId: string,
    @CurrentUser() user: User
  ) {
    await this.workflowEngine.resumeWorkflow(instanceId, user.id);
    return { message: 'Workflow instance resumed successfully' };
  }

  @Post('instances/:id/cancel')
  @ApiOperation({ summary: 'Cancel workflow instance' })
  @ApiResponse({ status: 200, description: 'Workflow instance cancelled successfully' })
  @RequirePermission('workflows', 'write')
  async cancelWorkflow(
    @Param('id') instanceId: string,
    @Body() body: { reason?: string },
    @CurrentUser() user: User
  ) {
    await this.workflowEngine.cancelWorkflow(instanceId, body.reason);
    return { message: 'Workflow instance cancelled successfully' };
  }

  @Get('instances/:id/steps')
  @ApiOperation({ summary: 'Get workflow instance steps' })
  @ApiResponse({ status: 200, description: 'Workflow steps retrieved successfully' })
  @RequirePermission('workflows', 'read')
  async getWorkflowSteps(@Param('id') instanceId: string, @CurrentUser() user: User) {
    const steps = await this.prisma.workflowStep.findMany({
      where: { instanceId },
      orderBy: { stepIndex: 'asc' }
    });

    return steps;
  }

  @Get('signature-requests/:id')
  @ApiOperation({ summary: 'Get signature request status' })
  @ApiResponse({ status: 200, description: 'Signature request status retrieved successfully' })
  @RequirePermission('workflows', 'read')
  async getSignatureRequest(@Param('id') requestId: string, @CurrentUser() user: User) {
    return await this.signatureService.getSignatureRequest(requestId);
  }

  @Post('signature-requests/:id/cancel')
  @ApiOperation({ summary: 'Cancel signature request' })
  @ApiResponse({ status: 200, description: 'Signature request cancelled successfully' })
  @RequirePermission('workflows', 'write')
  async cancelSignatureRequest(@Param('id') requestId: string, @CurrentUser() user: User) {
    await this.signatureService.cancelSignatureRequest(requestId);
    return { message: 'Signature request cancelled successfully' };
  }

  @Get('signature-requests/:id/download')
  @ApiOperation({ summary: 'Download signed document' })
  @ApiResponse({ status: 200, description: 'Signed document downloaded successfully' })
  @RequirePermission('workflows', 'read')
  async downloadSignedDocument(@Param('id') requestId: string, @CurrentUser() user: User) {
    const document = await this.signatureService.downloadSignedDocument(requestId);
    return document;
  }
}
