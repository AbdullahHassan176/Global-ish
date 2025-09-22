import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { 
  CreateTaskDto, 
  UpdateTaskDto, 
  AssignTaskDto, 
  AddCommentDto, 
  UpdateCommentDto,
  TaskQueryDto,
  TaskStatsDto
} from '../dto/task.dto';
import { Task, TaskStatus, Priority, TaskAssignment, TaskComment, TaskAttachment } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  async createTask(createTaskDto: CreateTaskDto, creatorId: string): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        priority: createTaskDto.priority || Priority.MEDIUM,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        createdBy: creatorId
      }
    });

    // Assign users if provided
    if (createTaskDto.assigneeIds && createTaskDto.assigneeIds.length > 0) {
      await this.assignTask(task.id, { userIds: createTaskDto.assigneeIds });
    }

    // Attach files if provided
    if (createTaskDto.attachmentIds && createTaskDto.attachmentIds.length > 0) {
      await this.attachFiles(task.id, createTaskDto.attachmentIds);
    }

    return this.getTaskById(task.id);
  }

  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        assignments: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        attachments: {
          include: {
            file: true
          }
        }
      }
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateTask(taskId: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.getTaskById(taskId);

    // Check if user has permission to update (creator or assignee)
    const canUpdate = task.createdBy === userId || 
      task.assignments.some(assignment => assignment.userId === userId);

    if (!canUpdate) {
      throw new BadRequestException('You do not have permission to update this task');
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: updateTaskDto.title,
        description: updateTaskDto.description,
        status: updateTaskDto.status,
        priority: updateTaskDto.priority,
        progress: updateTaskDto.progress,
        dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : null
      }
    });

    return this.getTaskById(taskId);
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await this.getTaskById(taskId);

    // Only creator can delete task
    if (task.createdBy !== userId) {
      throw new BadRequestException('You do not have permission to delete this task');
    }

    await this.prisma.task.delete({
      where: { id: taskId }
    });
  }

  async getTasks(query: TaskQueryDto, userId: string): Promise<{ tasks: Task[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      OR: [
        { createdBy: userId },
        { assignments: { some: { userId } } }
      ]
    };

    if (query.status) {
      where.status = query.status;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.assigneeId) {
      where.assignments = { some: { userId: query.assigneeId } };
    }

    if (query.creatorId) {
      where.createdBy = query.creatorId;
    }

    if (query.overdue) {
      where.dueDate = { lt: new Date() };
      where.status = { not: TaskStatus.COMPLETED };
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          },
          assignments: {
            include: {
              user: {
                select: { id: true, name: true, email: true }
              }
            }
          },
          _count: {
            select: { comments: true, attachments: true }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { dueDate: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      this.prisma.task.count({ where })
    ]);

    return { tasks, total };
  }

  async assignTask(taskId: string, assignTaskDto: AssignTaskDto): Promise<TaskAssignment[]> {
    const task = await this.getTaskById(taskId);

    const assignments: TaskAssignment[] = [];

    for (const userId of assignTaskDto.userIds) {
      // Check if user is already assigned
      const existingAssignment = await this.prisma.taskAssignment.findUnique({
        where: {
          taskId_userId: {
            taskId,
            userId
          }
        }
      });

      if (!existingAssignment) {
        const assignment = await this.prisma.taskAssignment.create({
          data: {
            taskId,
            userId
          },
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        });
        assignments.push(assignment);
      }
    }

    return assignments;
  }

  async unassignTask(taskId: string, userId: string): Promise<void> {
    await this.prisma.taskAssignment.delete({
      where: {
        taskId_userId: {
          taskId,
          userId
        }
      }
    });
  }

  async addComment(taskId: string, addCommentDto: AddCommentDto, userId: string): Promise<TaskComment> {
    const task = await this.getTaskById(taskId);

    // Check if user has access to task
    const hasAccess = task.createdBy === userId || 
      task.assignments.some(assignment => assignment.userId === userId);

    if (!hasAccess) {
      throw new BadRequestException('You do not have access to this task');
    }

    const comment = await this.prisma.taskComment.create({
      data: {
        taskId,
        userId,
        content: addCommentDto.content
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return comment;
  }

  async updateComment(commentId: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<TaskComment> {
    const comment = await this.prisma.taskComment.findUnique({
      where: { id: commentId },
      include: { task: true }
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Only comment author can update
    if (comment.userId !== userId) {
      throw new BadRequestException('You can only update your own comments');
    }

    const updatedComment = await this.prisma.taskComment.update({
      where: { id: commentId },
      data: {
        content: updateCommentDto.content
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return updatedComment;
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.prisma.taskComment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Only comment author can delete
    if (comment.userId !== userId) {
      throw new BadRequestException('You can only delete your own comments');
    }

    await this.prisma.taskComment.delete({
      where: { id: commentId }
    });
  }

  async attachFiles(taskId: string, fileIds: string[]): Promise<TaskAttachment[]> {
    const task = await this.getTaskById(taskId);

    const attachments: TaskAttachment[] = [];

    for (const fileId of fileIds) {
      // Check if file is already attached
      const existingAttachment = await this.prisma.taskAttachment.findUnique({
        where: {
          taskId_fileId: {
            taskId,
            fileId
          }
        }
      });

      if (!existingAttachment) {
        const attachment = await this.prisma.taskAttachment.create({
          data: {
            taskId,
            fileId
          },
          include: {
            file: true
          }
        });
        attachments.push(attachment);
      }
    }

    return attachments;
  }

  async detachFile(taskId: string, fileId: string): Promise<void> {
    await this.prisma.taskAttachment.delete({
      where: {
        taskId_fileId: {
          taskId,
          fileId
        }
      }
    });
  }

  async getTaskStats(userId: string): Promise<TaskStatsDto> {
    const where = {
      OR: [
        { createdBy: userId },
        { assignments: { some: { userId } } }
      ]
    };

    const [
      total,
      byStatus,
      byPriority,
      overdue,
      dueToday,
      dueThisWeek
    ] = await Promise.all([
      this.prisma.task.count({ where }),
      this.prisma.task.groupBy({
        by: ['status'],
        where,
        _count: { status: true }
      }),
      this.prisma.task.groupBy({
        by: ['priority'],
        where,
        _count: { priority: true }
      }),
      this.prisma.task.count({
        where: {
          ...where,
          dueDate: { lt: new Date() },
          status: { not: TaskStatus.COMPLETED }
        }
      }),
      this.prisma.task.count({
        where: {
          ...where,
          dueDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          },
          status: { not: TaskStatus.COMPLETED }
        }
      }),
      this.prisma.task.count({
        where: {
          ...where,
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          status: { not: TaskStatus.COMPLETED }
        }
      })
    ]);

    const statusStats = byStatus.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {} as Record<string, number>);

    const priorityStats = byPriority.reduce((acc, item) => {
      acc[item.priority] = item._count.priority;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byStatus: statusStats,
      byPriority: priorityStats,
      overdue,
      dueToday,
      dueThisWeek
    };
  }

  async getMyTasks(userId: string, status?: TaskStatus): Promise<Task[]> {
    const where: any = {
      assignments: { some: { userId } }
    };

    if (status) {
      where.status = status;
    }

    return this.prisma.task.findMany({
      where,
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        assignments: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        _count: {
          select: { comments: true, attachments: true }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' }
      ]
    });
  }

  async getOverdueTasks(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        OR: [
          { createdBy: userId },
          { assignments: { some: { userId } } }
        ],
        dueDate: { lt: new Date() },
        status: { not: TaskStatus.COMPLETED }
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        assignments: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      },
      orderBy: { dueDate: 'asc' }
    });
  }
}
