import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../services/tasks.service';
import { PrismaService } from '../../../common/prisma.service';
import { CreateTaskDto, UpdateTaskDto, AssignTaskDto, AddCommentDto, AddAttachmentDto } from '../dto/task.dto';
import { TaskStatus, Priority } from '@prisma/client';

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    taskAssignment: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    taskComment: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    taskAttachment: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a new task with assignments', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Implement user authentication',
        description: 'Set up NextAuth with OIDC providers and MFA support',
        priority: Priority.HIGH,
        dueDate: new Date('2024-01-20'),
        assignedTo: ['user2', 'user3'],
      };

      const userId = 'user1';

      const expectedTask = {
        id: '1',
        title: 'Implement user authentication',
        description: 'Set up NextAuth with OIDC providers and MFA support',
        status: TaskStatus.TODO,
        priority: Priority.HIGH,
        progress: 0,
        dueDate: new Date('2024-01-20'),
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        assignments: [
          { id: '1', taskId: '1', userId: 'user2', assignedAt: new Date() },
          { id: '2', taskId: '1', userId: 'user3', assignedAt: new Date() },
        ],
        comments: [],
        attachments: [],
      };

      // Mock task creation
      mockPrismaService.task.create.mockResolvedValue({
        id: '1',
        title: 'Implement user authentication',
        description: 'Set up NextAuth with OIDC providers and MFA support',
        status: TaskStatus.TODO,
        priority: Priority.HIGH,
        progress: 0,
        dueDate: new Date('2024-01-20'),
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Mock assignment creation
      mockPrismaService.taskAssignment.create.mockResolvedValue({ id: '1' });

      // Mock task retrieval with relations
      mockPrismaService.task.findUnique.mockResolvedValue(expectedTask);

      const result = await service.createTask(createTaskDto, userId);

      expect(result).toEqual(expectedTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({
        data: {
          title: 'Implement user authentication',
          description: 'Set up NextAuth with OIDC providers and MFA support',
          status: TaskStatus.TODO,
          priority: Priority.HIGH,
          progress: 0,
          dueDate: new Date('2024-01-20'),
          createdBy: userId,
        },
      });
      expect(mockPrismaService.taskAssignment.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('getTask', () => {
    it('should return task with all relations', async () => {
      const taskId = '1';
      const userId = 'user1';

      const expectedTask = {
        id: '1',
        title: 'Implement user authentication',
        description: 'Set up NextAuth with OIDC providers and MFA support',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        progress: 75,
        dueDate: new Date('2024-01-20'),
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        assignments: [
          { id: '1', taskId: '1', userId: 'user2', assignedAt: new Date() },
        ],
        comments: [
          {
            id: '1',
            taskId: '1',
            userId: 'user2',
            content: 'Great progress on this task!',
            createdAt: new Date(),
          },
        ],
        attachments: [
          {
            id: '1',
            taskId: '1',
            fileId: 'file1',
            createdAt: new Date(),
          },
        ],
      };

      mockPrismaService.task.findUnique.mockResolvedValue(expectedTask);

      const result = await service.getTask(taskId, userId);

      expect(result).toEqual(expectedTask);
      expect(mockPrismaService.task.findUnique).toHaveBeenCalledWith({
        where: { id: taskId },
        include: {
          assignments: true,
          comments: {
            orderBy: { createdAt: 'desc' },
          },
          attachments: true,
        },
      });
    });

    it('should handle task not found', async () => {
      const taskId = 'nonexistent';
      const userId = 'user1';

      mockPrismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.getTask(taskId, userId))
        .rejects.toThrow('Task not found');
    });
  });

  describe('updateTask', () => {
    it('should update task details', async () => {
      const taskId = '1';
      const userId = 'user1';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task Title',
        description: 'Updated description',
        priority: Priority.MEDIUM,
        dueDate: new Date('2024-01-25'),
      };

      const expectedResult = {
        id: '1',
        title: 'Updated Task Title',
        description: 'Updated description',
        priority: Priority.MEDIUM,
        dueDate: new Date('2024-01-25'),
        updatedAt: new Date(),
      };

      mockPrismaService.task.update.mockResolvedValue(expectedResult);

      const result = await service.updateTask(taskId, updateTaskDto, userId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: updateTaskDto,
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const taskId = '1';
      const userId = 'user1';

      mockPrismaService.task.delete.mockResolvedValue({ id: '1' });

      const result = await service.deleteTask(taskId, userId);

      expect(result).toEqual({ success: true });
      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({
        where: { id: taskId },
      });
    });
  });

  describe('assignTask', () => {
    it('should assign task to users', async () => {
      const taskId = '1';
      const userId = 'user1';
      const assignTaskDto: AssignTaskDto = {
        userIds: ['user2', 'user3'],
      };

      const expectedResult = {
        id: '1',
        assignments: [
          { id: '1', taskId: '1', userId: 'user2', assignedAt: new Date() },
          { id: '2', taskId: '1', userId: 'user3', assignedAt: new Date() },
        ],
      };

      mockPrismaService.taskAssignment.create.mockResolvedValue({ id: '1' });
      mockPrismaService.task.findUnique.mockResolvedValue(expectedResult);

      const result = await service.assignTask(taskId, assignTaskDto, userId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.taskAssignment.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('addComment', () => {
    it('should add comment to task', async () => {
      const taskId = '1';
      const userId = 'user1';
      const addCommentDto: AddCommentDto = {
        content: 'This is a new comment',
      };

      const expectedResult = {
        id: '1',
        taskId: '1',
        userId: 'user1',
        content: 'This is a new comment',
        createdAt: new Date(),
      };

      mockPrismaService.taskComment.create.mockResolvedValue(expectedResult);

      const result = await service.addComment(taskId, addCommentDto, userId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.taskComment.create).toHaveBeenCalledWith({
        data: {
          taskId,
          userId,
          content: 'This is a new comment',
        },
      });
    });
  });

  describe('addAttachment', () => {
    it('should add attachment to task', async () => {
      const taskId = '1';
      const userId = 'user1';
      const addAttachmentDto: AddAttachmentDto = {
        fileId: 'file1',
      };

      const expectedResult = {
        id: '1',
        taskId: '1',
        fileId: 'file1',
        createdAt: new Date(),
      };

      mockPrismaService.taskAttachment.create.mockResolvedValue(expectedResult);

      const result = await service.addAttachment(taskId, addAttachmentDto, userId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.taskAttachment.create).toHaveBeenCalledWith({
        data: {
          taskId,
          fileId: 'file1',
        },
      });
    });
  });

  describe('updateProgress', () => {
    it('should update task progress', async () => {
      const taskId = '1';
      const userId = 'user1';
      const progressDto = { progress: 75 };

      const expectedResult = {
        id: '1',
        progress: 75,
        updatedAt: new Date(),
      };

      mockPrismaService.task.update.mockResolvedValue(expectedResult);

      const result = await service.updateProgress(taskId, progressDto, userId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: { progress: 75 },
      });
    });
  });

  describe('updateStatus', () => {
    it('should update task status', async () => {
      const taskId = '1';
      const userId = 'user1';
      const statusDto = { status: TaskStatus.COMPLETED };

      const expectedResult = {
        id: '1',
        status: TaskStatus.COMPLETED,
        updatedAt: new Date(),
      };

      mockPrismaService.task.update.mockResolvedValue(expectedResult);

      const result = await service.updateStatus(taskId, statusDto, userId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: { status: TaskStatus.COMPLETED },
      });
    });
  });

  describe('getTasks', () => {
    it('should return paginated tasks with filters', async () => {
      const query = {
        page: '1',
        limit: '10',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        assignedTo: 'user2',
      };
      const userId = 'user1';

      const mockTasks = [
        {
          id: '1',
          title: 'Implement user authentication',
          status: TaskStatus.IN_PROGRESS,
          priority: Priority.HIGH,
          progress: 75,
          dueDate: new Date('2024-01-20'),
          createdBy: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);
      mockPrismaService.task.count.mockResolvedValue(1);

      const result = await service.getTasks(query, userId);

      expect(result).toEqual({
        tasks: mockTasks,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: {
          status: TaskStatus.IN_PROGRESS,
          priority: Priority.HIGH,
          assignments: {
            some: {
              userId: 'user2',
            },
          },
        },
        include: {
          assignments: true,
          comments: true,
          attachments: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('getMyTasks', () => {
    it('should return user\'s assigned tasks', async () => {
      const query = {
        page: '1',
        limit: '10',
        status: TaskStatus.IN_PROGRESS,
      };
      const userId = 'user1';

      const mockTasks = [
        {
          id: '1',
          title: 'Implement user authentication',
          status: TaskStatus.IN_PROGRESS,
          priority: Priority.HIGH,
          progress: 75,
          dueDate: new Date('2024-01-20'),
          createdBy: 'user2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);
      mockPrismaService.task.count.mockResolvedValue(1);

      const result = await service.getMyTasks(query, userId);

      expect(result).toEqual({
        tasks: mockTasks,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: {
          status: TaskStatus.IN_PROGRESS,
          assignments: {
            some: {
              userId,
            },
          },
        },
        include: {
          assignments: true,
          comments: true,
          attachments: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10,
      });
    });
  });
});
