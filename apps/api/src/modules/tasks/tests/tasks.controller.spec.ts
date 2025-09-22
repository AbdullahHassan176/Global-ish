import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../controllers/tasks.controller';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto, AssignTaskDto, AddCommentDto, AddAttachmentDto } from '../dto/task.dto';
import { TaskStatus, Priority } from '@prisma/client';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  const mockTasksService = {
    createTask: jest.fn(),
    getTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    assignTask: jest.fn(),
    addComment: jest.fn(),
    addAttachment: jest.fn(),
    updateProgress: jest.fn(),
    updateStatus: jest.fn(),
    getTasks: jest.fn(),
    getMyTasks: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Implement user authentication',
        description: 'Set up NextAuth with OIDC providers and MFA support',
        priority: Priority.HIGH,
        dueDate: new Date('2024-01-20'),
        assignedTo: ['user2', 'user3'],
      };

      const expectedTask = {
        id: '1',
        title: 'Implement user authentication',
        description: 'Set up NextAuth with OIDC providers and MFA support',
        status: TaskStatus.TODO,
        priority: Priority.HIGH,
        progress: 0,
        dueDate: new Date('2024-01-20'),
        createdBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
        assignments: [
          { id: '1', taskId: '1', userId: 'user2', assignedAt: new Date() },
          { id: '2', taskId: '1', userId: 'user3', assignedAt: new Date() },
        ],
        comments: [],
        attachments: [],
      };

      mockTasksService.createTask.mockResolvedValue(expectedTask);

      const result = await controller.createTask(createTaskDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedTask);
      expect(mockTasksService.createTask).toHaveBeenCalledWith(createTaskDto, 'user1');
    });
  });

  describe('getTask', () => {
    it('should return task details', async () => {
      const taskId = '1';
      const expectedTask = {
        id: '1',
        title: 'Implement user authentication',
        description: 'Set up NextAuth with OIDC providers and MFA support',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        progress: 75,
        dueDate: new Date('2024-01-20'),
        createdBy: 'user1',
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

      mockTasksService.getTask.mockResolvedValue(expectedTask);

      const result = await controller.getTask(taskId, { user: { id: 'user1' } });

      expect(result).toEqual(expectedTask);
      expect(mockTasksService.getTask).toHaveBeenCalledWith(taskId, 'user1');
    });
  });

  describe('updateTask', () => {
    it('should update task details', async () => {
      const taskId = '1';
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

      mockTasksService.updateTask.mockResolvedValue(expectedResult);

      const result = await controller.updateTask(taskId, updateTaskDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockTasksService.updateTask).toHaveBeenCalledWith(taskId, updateTaskDto, 'user1');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const taskId = '1';
      mockTasksService.deleteTask.mockResolvedValue({ success: true });

      const result = await controller.deleteTask(taskId, { user: { id: 'user1' } });

      expect(result).toEqual({ success: true });
      expect(mockTasksService.deleteTask).toHaveBeenCalledWith(taskId, 'user1');
    });
  });

  describe('assignTask', () => {
    it('should assign task to users', async () => {
      const taskId = '1';
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

      mockTasksService.assignTask.mockResolvedValue(expectedResult);

      const result = await controller.assignTask(taskId, assignTaskDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockTasksService.assignTask).toHaveBeenCalledWith(taskId, assignTaskDto, 'user1');
    });
  });

  describe('addComment', () => {
    it('should add comment to task', async () => {
      const taskId = '1';
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

      mockTasksService.addComment.mockResolvedValue(expectedResult);

      const result = await controller.addComment(taskId, addCommentDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockTasksService.addComment).toHaveBeenCalledWith(taskId, addCommentDto, 'user1');
    });
  });

  describe('addAttachment', () => {
    it('should add attachment to task', async () => {
      const taskId = '1';
      const addAttachmentDto: AddAttachmentDto = {
        fileId: 'file1',
      };

      const expectedResult = {
        id: '1',
        taskId: '1',
        fileId: 'file1',
        createdAt: new Date(),
      };

      mockTasksService.addAttachment.mockResolvedValue(expectedResult);

      const result = await controller.addAttachment(taskId, addAttachmentDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockTasksService.addAttachment).toHaveBeenCalledWith(taskId, addAttachmentDto, 'user1');
    });
  });

  describe('updateProgress', () => {
    it('should update task progress', async () => {
      const taskId = '1';
      const progressDto = { progress: 75 };

      const expectedResult = {
        id: '1',
        progress: 75,
        updatedAt: new Date(),
      };

      mockTasksService.updateProgress.mockResolvedValue(expectedResult);

      const result = await controller.updateProgress(taskId, progressDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockTasksService.updateProgress).toHaveBeenCalledWith(taskId, progressDto, 'user1');
    });
  });

  describe('updateStatus', () => {
    it('should update task status', async () => {
      const taskId = '1';
      const statusDto = { status: TaskStatus.COMPLETED };

      const expectedResult = {
        id: '1',
        status: TaskStatus.COMPLETED,
        updatedAt: new Date(),
      };

      mockTasksService.updateStatus.mockResolvedValue(expectedResult);

      const result = await controller.updateStatus(taskId, statusDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockTasksService.updateStatus).toHaveBeenCalledWith(taskId, statusDto, 'user1');
    });
  });

  describe('getTasks', () => {
    it('should return paginated tasks', async () => {
      const query = {
        page: '1',
        limit: '10',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        assignedTo: 'user2',
      };

      const expectedResult = {
        tasks: [
          {
            id: '1',
            title: 'Implement user authentication',
            status: TaskStatus.IN_PROGRESS,
            priority: Priority.HIGH,
            progress: 75,
            dueDate: new Date('2024-01-20'),
            createdBy: 'user1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockTasksService.getTasks.mockResolvedValue(expectedResult);

      const result = await controller.getTasks(query, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockTasksService.getTasks).toHaveBeenCalledWith(query, 'user1');
    });
  });

  describe('getMyTasks', () => {
    it('should return user\'s assigned tasks', async () => {
      const query = {
        page: '1',
        limit: '10',
        status: TaskStatus.IN_PROGRESS,
      };

      const expectedResult = {
        tasks: [
          {
            id: '1',
            title: 'Implement user authentication',
            status: TaskStatus.IN_PROGRESS,
            priority: Priority.HIGH,
            progress: 75,
            dueDate: new Date('2024-01-20'),
            createdBy: 'user1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockTasksService.getMyTasks.mockResolvedValue(expectedResult);

      const result = await controller.getMyTasks(query, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockTasksService.getMyTasks).toHaveBeenCalledWith(query, 'user1');
    });
  });
});
