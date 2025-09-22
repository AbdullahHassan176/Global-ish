import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from '../services/files.service';
import { StorageService } from '../services/storage.service';
import { VirusScanService } from '../services/virus-scan.service';
import { OcrService } from '../services/ocr.service';
import { BlockchainService } from '../services/blockchain.service';
import { PrismaService } from '../../../common/prisma.service';
import { Queue } from 'bullmq';
import { UploadFileDto } from '../dto/upload-file.dto';
import { AccessLevel, FilePermission } from '@prisma/client';

describe('FilesService', () => {
  let service: FilesService;
  let prismaService: PrismaService;
  let storageService: StorageService;
  let virusScanService: VirusScanService;
  let ocrService: OcrService;
  let blockchainService: BlockchainService;
  let virusScanQueue: Queue;
  let ocrQueue: Queue;
  let blockchainQueue: Queue;

  const mockPrismaService = {
    file: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    fileAccessControl: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockStorageService = {
    uploadFile: jest.fn(),
    getFileUrl: jest.fn(),
    getSignedUrl: jest.fn(),
    deleteFile: jest.fn(),
  };

  const mockVirusScanService = {
    scanFile: jest.fn(),
  };

  const mockOcrService = {
    processFileForOcr: jest.fn(),
  };

  const mockBlockchainService = {
    anchorDocumentHash: jest.fn(),
  };

  const mockVirusScanQueue = {
    add: jest.fn(),
  };

  const mockOcrQueue = {
    add: jest.fn(),
  };

  const mockBlockchainQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
        {
          provide: VirusScanService,
          useValue: mockVirusScanService,
        },
        {
          provide: OcrService,
          useValue: mockOcrService,
        },
        {
          provide: BlockchainService,
          useValue: mockBlockchainService,
        },
        {
          provide: 'VIRUS_SCAN_QUEUE',
          useValue: mockVirusScanQueue,
        },
        {
          provide: 'OCR_QUEUE',
          useValue: mockOcrQueue,
        },
        {
          provide: 'BLOCKCHAIN_QUEUE',
          useValue: mockBlockchainQueue,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    prismaService = module.get<PrismaService>(PrismaService);
    storageService = module.get<StorageService>(StorageService);
    virusScanService = module.get<VirusScanService>(VirusScanService);
    ocrService = module.get<OcrService>(OcrService);
    blockchainService = module.get<BlockchainService>(BlockchainService);
    virusScanQueue = module.get<Queue>('VIRUS_SCAN_QUEUE');
    ocrQueue = module.get<Queue>('OCR_QUEUE');
    blockchainQueue = module.get<Queue>('BLOCKCHAIN_QUEUE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test content'),
      };

      const uploadDto: UploadFileDto = {
        name: 'Test File',
        tags: ['test', 'document'],
        accessLevel: AccessLevel.INTERNAL,
        parentId: null,
      };

      const userId = 'user1';
      const fileHash = 'sha256hash';
      const storagePath = '/uploads/test.pdf';
      const storageUrl = 'https://storage.example.com/test.pdf';

      const expectedFile = {
        id: '1',
        name: 'Test File',
        originalName: 'test.pdf',
        mimeType: 'application/pdf',
        size: 1024,
        path: storagePath,
        url: storageUrl,
        hash: fileHash,
        chainAnchor: null,
        version: 1,
        parentId: null,
        isVirusScanned: false,
        virusScanResult: null,
        ocrStatus: 'PENDING',
        ocrText: null,
        metadata: {},
        tags: ['test', 'document'],
        accessLevel: AccessLevel.INTERNAL,
        uploadedBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock storage service
      mockStorageService.uploadFile.mockResolvedValue({
        path: storagePath,
        url: storageUrl,
      });

      // Mock Prisma create
      mockPrismaService.file.create.mockResolvedValue(expectedFile);

      // Mock queue additions
      mockVirusScanQueue.add.mockResolvedValue({ id: 'job1' });
      mockOcrQueue.add.mockResolvedValue({ id: 'job2' });
      mockBlockchainQueue.add.mockResolvedValue({ id: 'job3' });

      const result = await service.uploadFile(mockFile, uploadDto, userId);

      expect(result).toEqual(expectedFile);
      expect(mockStorageService.uploadFile).toHaveBeenCalledWith(mockFile, storagePath);
      expect(mockPrismaService.file.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Test File',
          originalName: 'test.pdf',
          mimeType: 'application/pdf',
          size: 1024,
          path: storagePath,
          url: storageUrl,
          hash: expect.any(String),
          version: 1,
          parentId: null,
          isVirusScanned: false,
          virusScanResult: null,
          ocrStatus: 'PENDING',
          ocrText: null,
          metadata: {},
          tags: ['test', 'document'],
          accessLevel: AccessLevel.INTERNAL,
          uploadedBy: userId,
        }),
      });
      expect(mockVirusScanQueue.add).toHaveBeenCalledWith('scan-file', {
        fileId: '1',
        filePath: storagePath,
      });
      expect(mockOcrQueue.add).toHaveBeenCalledWith('process-ocr', {
        fileId: '1',
        filePath: storagePath,
        mimeType: 'application/pdf',
      });
      expect(mockBlockchainQueue.add).toHaveBeenCalledWith('anchor-document', {
        fileId: '1',
        fileHash: expect.any(String),
      });
    });

    it('should handle upload errors', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('test content'),
      };

      const uploadDto: UploadFileDto = {
        name: 'Test File',
        tags: ['test'],
        accessLevel: AccessLevel.INTERNAL,
        parentId: null,
      };

      const userId = 'user1';

      mockStorageService.uploadFile.mockRejectedValue(new Error('Storage upload failed'));

      await expect(service.uploadFile(mockFile, uploadDto, userId))
        .rejects.toThrow('Storage upload failed');
    });
  });

  describe('getFile', () => {
    it('should return file details', async () => {
      const fileId = '1';
      const userId = 'user1';
      const expectedFile = {
        id: '1',
        name: 'Test File',
        originalName: 'test.pdf',
        mimeType: 'application/pdf',
        size: 1024,
        path: '/uploads/test.pdf',
        url: 'https://storage.example.com/test.pdf',
        hash: 'sha256hash',
        chainAnchor: null,
        version: 1,
        parentId: null,
        isVirusScanned: true,
        virusScanResult: 'clean',
        ocrStatus: 'COMPLETED',
        ocrText: 'Extracted text content',
        metadata: {},
        tags: ['test'],
        accessLevel: AccessLevel.INTERNAL,
        uploadedBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.file.findUnique.mockResolvedValue(expectedFile);

      const result = await service.getFile(fileId, userId);

      expect(result).toEqual(expectedFile);
      expect(mockPrismaService.file.findUnique).toHaveBeenCalledWith({
        where: { id: fileId },
        include: {
          accessControls: true,
        },
      });
    });

    it('should handle file not found', async () => {
      const fileId = 'nonexistent';
      const userId = 'user1';

      mockPrismaService.file.findUnique.mockResolvedValue(null);

      await expect(service.getFile(fileId, userId))
        .rejects.toThrow('File not found');
    });
  });

  describe('getSignedUrl', () => {
    it('should return signed URL for file access', async () => {
      const fileId = '1';
      const userId = 'user1';
      const expectedUrl = 'https://storage.example.com/signed-url?token=abc123';

      const mockFile = {
        id: '1',
        path: '/uploads/test.pdf',
        accessLevel: AccessLevel.INTERNAL,
        uploadedBy: 'user1',
      };

      mockPrismaService.file.findUnique.mockResolvedValue(mockFile);
      mockStorageService.getSignedUrl.mockResolvedValue(expectedUrl);

      const result = await service.getSignedUrl(fileId, userId);

      expect(result).toEqual(expectedUrl);
      expect(mockStorageService.getSignedUrl).toHaveBeenCalledWith('/uploads/test.pdf');
    });
  });

  describe('updateFile', () => {
    it('should update file metadata', async () => {
      const fileId = '1';
      const userId = 'user1';
      const updateDto = {
        name: 'Updated File Name',
        tags: ['updated', 'document'],
        accessLevel: AccessLevel.PRIVATE,
      };

      const expectedResult = {
        id: '1',
        name: 'Updated File Name',
        tags: ['updated', 'document'],
        accessLevel: AccessLevel.PRIVATE,
        updatedAt: new Date(),
      };

      mockPrismaService.file.update.mockResolvedValue(expectedResult);

      const result = await service.updateFile(fileId, updateDto, userId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.file.update).toHaveBeenCalledWith({
        where: { id: fileId },
        data: updateDto,
      });
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', async () => {
      const fileId = '1';
      const userId = 'user1';

      const mockFile = {
        id: '1',
        path: '/uploads/test.pdf',
        uploadedBy: 'user1',
      };

      mockPrismaService.file.findUnique.mockResolvedValue(mockFile);
      mockStorageService.deleteFile.mockResolvedValue({ success: true });
      mockPrismaService.file.delete.mockResolvedValue({ id: '1' });

      const result = await service.deleteFile(fileId, userId);

      expect(result).toEqual({ success: true });
      expect(mockStorageService.deleteFile).toHaveBeenCalledWith('/uploads/test.pdf');
      expect(mockPrismaService.file.delete).toHaveBeenCalledWith({
        where: { id: fileId },
      });
    });
  });

  describe('addAccessControl', () => {
    it('should add access control to a file', async () => {
      const fileId = '1';
      const userId = 'user1';
      const accessControlDto = {
        userId: 'user2',
        role: 'viewer',
        permission: FilePermission.READ,
      };

      const expectedResult = {
        id: '1',
        fileId: '1',
        userId: 'user2',
        role: 'viewer',
        permission: FilePermission.READ,
        createdAt: new Date(),
      };

      mockPrismaService.fileAccessControl.create.mockResolvedValue(expectedResult);

      const result = await service.addAccessControl(fileId, accessControlDto, userId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.fileAccessControl.create).toHaveBeenCalledWith({
        data: {
          fileId,
          userId: accessControlDto.userId,
          role: accessControlDto.role,
          permission: accessControlDto.permission,
        },
      });
    });
  });

  describe('removeAccessControl', () => {
    it('should remove access control from a file', async () => {
      const fileId = '1';
      const accessControlId = 'ac1';
      const userId = 'user1';

      mockPrismaService.fileAccessControl.delete.mockResolvedValue({ id: 'ac1' });

      const result = await service.removeAccessControl(fileId, accessControlId, userId);

      expect(result).toEqual({ success: true });
      expect(mockPrismaService.fileAccessControl.delete).toHaveBeenCalledWith({
        where: { id: accessControlId },
      });
    });
  });

  describe('getAccessControls', () => {
    it('should return access controls for a file', async () => {
      const fileId = '1';
      const userId = 'user1';
      const expectedControls = [
        {
          id: '1',
          fileId: '1',
          userId: 'user1',
          role: 'owner',
          permission: FilePermission.MANAGE,
          createdAt: new Date(),
        },
        {
          id: '2',
          fileId: '1',
          userId: 'user2',
          role: 'viewer',
          permission: FilePermission.READ,
          createdAt: new Date(),
        },
      ];

      mockPrismaService.fileAccessControl.findMany.mockResolvedValue(expectedControls);

      const result = await service.getAccessControls(fileId, userId);

      expect(result).toEqual(expectedControls);
      expect(mockPrismaService.fileAccessControl.findMany).toHaveBeenCalledWith({
        where: { fileId },
      });
    });
  });

  describe('getVersions', () => {
    it('should return file versions', async () => {
      const fileId = '1';
      const userId = 'user1';
      const expectedVersions = [
        {
          id: '1',
          version: 1,
          name: 'Original File',
          size: 1024,
          createdAt: new Date(),
        },
        {
          id: '2',
          version: 2,
          name: 'Updated File',
          size: 2048,
          createdAt: new Date(),
        },
      ];

      mockPrismaService.file.findMany.mockResolvedValue(expectedVersions);

      const result = await service.getVersions(fileId, userId);

      expect(result).toEqual(expectedVersions);
      expect(mockPrismaService.file.findMany).toHaveBeenCalledWith({
        where: { parentId: fileId },
        orderBy: { version: 'desc' },
      });
    });
  });
});
