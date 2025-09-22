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
import { TasksService } from '../services/tasks.service';
import { 
  CreateTaskDto, 
  UpdateTaskDto, 
  AssignTaskDto, 
  AddCommentDto, 
  UpdateCommentDto,
  TaskQueryDto,
  TaskStatsDto
} from '../dto/task.dto';
import { JwtAuthGuard } from '@global-next/auth';
import { RequirePermission } from '@global-next/auth';
import { CurrentUser } from '@global-next/auth';
import { User } from '@global-next/types';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @RequirePermission('tasks', 'write')
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: User
  ) {
    return await this.tasksService.createTask(createTaskDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get tasks with filters' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @RequirePermission('tasks', 'read')
  async getTasks(
    @Query() query: TaskQueryDto,
    @CurrentUser() user: User
  ) {
    const result = await this.tasksService.getTasks(query, user.id);
    return {
      ...result,
      pagination: {
        page: query.page || 1,
        limit: query.limit || 20,
        totalPages: Math.ceil(result.total / (query.limit || 20))
      }
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get task statistics' })
  @ApiResponse({ status: 200, description: 'Task statistics retrieved successfully' })
  @RequirePermission('tasks', 'read')
  async getTaskStats(@CurrentUser() user: User): Promise<TaskStatsDto> {
    return await this.tasksService.getTaskStats(user.id);
  }

  @Get('my-tasks')
  @ApiOperation({ summary: 'Get my assigned tasks' })
  @ApiResponse({ status: 200, description: 'My tasks retrieved successfully' })
  @RequirePermission('tasks', 'read')
  async getMyTasks(
    @Query('status') status: string,
    @CurrentUser() user: User
  ) {
    return await this.tasksService.getMyTasks(user.id, status as any);
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Get overdue tasks' })
  @ApiResponse({ status: 200, description: 'Overdue tasks retrieved successfully' })
  @RequirePermission('tasks', 'read')
  async getOverdueTasks(@CurrentUser() user: User) {
    return await this.tasksService.getOverdueTasks(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @RequirePermission('tasks', 'read')
  async getTask(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.tasksService.getTaskById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @RequirePermission('tasks', 'write')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: User
  ) {
    return await this.tasksService.updateTask(id, updateTaskDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @RequirePermission('tasks', 'delete')
  async deleteTask(@Param('id') id: string, @CurrentUser() user: User) {
    await this.tasksService.deleteTask(id, user.id);
    return { message: 'Task deleted successfully' };
  }

  @Post(':id/assign')
  @ApiOperation({ summary: 'Assign task to users' })
  @ApiResponse({ status: 200, description: 'Task assigned successfully' })
  @RequirePermission('tasks', 'write')
  async assignTask(
    @Param('id') id: string,
    @Body() assignTaskDto: AssignTaskDto,
    @CurrentUser() user: User
  ) {
    return await this.tasksService.assignTask(id, assignTaskDto);
  }

  @Delete(':id/assign/:userId')
  @ApiOperation({ summary: 'Unassign user from task' })
  @ApiResponse({ status: 200, description: 'User unassigned successfully' })
  @RequirePermission('tasks', 'write')
  async unassignTask(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @CurrentUser() user: User
  ) {
    await this.tasksService.unassignTask(id, userId);
    return { message: 'User unassigned successfully' };
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add comment to task' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  @RequirePermission('tasks', 'write')
  async addComment(
    @Param('id') id: string,
    @Body() addCommentDto: AddCommentDto,
    @CurrentUser() user: User
  ) {
    return await this.tasksService.addComment(id, addCommentDto, user.id);
  }

  @Put('comments/:commentId')
  @ApiOperation({ summary: 'Update comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @RequirePermission('tasks', 'write')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: User
  ) {
    return await this.tasksService.updateComment(commentId, updateCommentDto, user.id);
  }

  @Delete('comments/:commentId')
  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @RequirePermission('tasks', 'write')
  async deleteComment(
    @Param('commentId') commentId: string,
    @CurrentUser() user: User
  ) {
    await this.tasksService.deleteComment(commentId, user.id);
    return { message: 'Comment deleted successfully' };
  }

  @Post(':id/attachments')
  @ApiOperation({ summary: 'Attach files to task' })
  @ApiResponse({ status: 200, description: 'Files attached successfully' })
  @RequirePermission('tasks', 'write')
  async attachFiles(
    @Param('id') id: string,
    @Body() body: { fileIds: string[] },
    @CurrentUser() user: User
  ) {
    return await this.tasksService.attachFiles(id, body.fileIds);
  }

  @Delete(':id/attachments/:fileId')
  @ApiOperation({ summary: 'Detach file from task' })
  @ApiResponse({ status: 200, description: 'File detached successfully' })
  @RequirePermission('tasks', 'write')
  async detachFile(
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @CurrentUser() user: User
  ) {
    await this.tasksService.detachFile(id, fileId);
    return { message: 'File detached successfully' };
  }
}
