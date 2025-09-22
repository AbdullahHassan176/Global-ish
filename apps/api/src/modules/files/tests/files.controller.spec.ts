import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from '../controllers/files.controller';
import { FilesService } from '../services/files.service';
import { StorageService } from '../services/storage.service';
import { VirusScanService } from '../services/virus-scan.service';
import { OcrService } from '../services/ocr.service';
import { BlockchainService } from '../services/blockchain.service';
import { UploadFileDto } from '../dto/upload-file.dto';
import { AccessLevel, FilePermission } from '@prisma/client';

describe('FilesController', () => {
  let controller: FilesController;
  let filesService: FilesService;
  let storageService: StorageService;

  const mockFilesService = {
    uploadFile: jest.fn(),
    getFile: jest.fn(),
    getSignedUrl: jest.fn(),
    updateFile: jest.fn(),
    deleteFile: jest.fn(),
    addAccessControl: jest.fn(),
    removeAccessControl: jest.fn(),
    getAccessControls: jest.fn(),
    getVersions: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesService,
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
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    filesService = module.get<FilesService>(FilesService);
    storageService = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const expectedResult = {
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
        isVirusScanned: false,
        virusScanResult: null,
        ocrStatus: 'PENDING',
        ocrText: null,
        metadata: {},
        tags: ['test', 'document'],
        accessLevel: AccessLevel.INTERNAL,
        uploadedBy: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFilesService.uploadFile.mockResolvedValue(expectedResult);

      const result = await controller.uploadFile(mockFile, uploadDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockFilesService.uploadFile).toHaveBeenCalledWith(mockFile, uploadDto, 'user1');
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

      mockFilesService.uploadFile.mockRejectedValue(new Error('Upload failed'));

      await expect(controller.uploadFile(mockFile, uploadDto, { user: { id: 'user1' } }))
        .rejects.toThrow('Upload failed');
    });
  });

  describe('getFile', () => {
    it('should return file details', async () => {
      const fileId = '1';
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

      mockFilesService.getFile.mockResolvedValue(expectedFile);

      const result = await controller.getFile(fileId, { user: { id: 'user1' } });

      expect(result).toEqual(expectedFile);
      expect(mockFilesService.getFile).toHaveBeenCalledWith(fileId, 'user1');
    });

    it('should handle file not found', async () => {
      const fileId = 'nonexistent';
      mockFilesService.getFile.mockRejectedValue(new Error('File not found'));

      await expect(controller.getFile(fileId, { user: { id: 'user1' } }))
        .rejects.toThrow('File not found');
    });
  });

  describe('getSignedUrl', () => {
    it('should return signed URL for file access', async () => {
      const fileId = '1';
      const expectedUrl = 'https://storage.example.com/signed-url?token=abc123';

      mockFilesService.getSignedUrl.mockResolvedValue(expectedUrl);

      const result = await controller.getSignedUrl(fileId, { user: { id: 'user1' } });

      expect(result).toEqual({ url: expectedUrl });
      expect(mockFilesService.getSignedUrl).toHaveBeenCalledWith(fileId, 'user1');
    });
  });

  describe('updateFile', () => {
    it('should update file metadata', async () => {
      const fileId = '1';
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

      mockFilesService.updateFile.mockResolvedValue(expectedResult);

      const result = await controller.updateFile(fileId, updateDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockFilesService.updateFile).toHaveBeenCalledWith(fileId, updateDto, 'user1');
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', async () => {
      const fileId = '1';
      mockFilesService.deleteFile.mockResolvedValue({ success: true });

      const result = await controller.deleteFile(fileId, { user: { id: 'user1' } });

      expect(result).toEqual({ success: true });
      expect(mockFilesService.deleteFile).toHaveBeenCalledWith(fileId, 'user1');
    });
  });

  describe('addAccessControl', () => {
    it('should add access control to a file', async () => {
      const fileId = '1';
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

      mockFilesService.addAccessControl.mockResolvedValue(expectedResult);

      const result = await controller.addAccessControl(fileId, accessControlDto, { user: { id: 'user1' } });

      expect(result).toEqual(expectedResult);
      expect(mockFilesService.addAccessControl).toHaveBeenCalledWith(fileId, accessControlDto, 'user1');
    });
  });

  describe('removeAccessControl', () => {
    it('should remove access control from a file', async () => {
      const fileId = '1';
      const accessControlId = 'ac1';
      mockFilesService.removeAccessControl.mockResolvedValue({ success: true });

      const result = await controller.removeAccessControl(fileId, accessControlId, { user: { id: 'user1' } });

      expect(result).toEqual({ success: true });
      expect(mockFilesService.removeAccessControl).toHaveBeenCalledWith(fileId, accessControlId, 'user1');
    });
  });

  describe('getAccessControls', () => {
    it('should return access controls for a file', async () => {
      const fileId = '1';
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

      mockFilesService.getAccessControls.mockResolvedValue(expectedControls);

      const result = await controller.getAccessControls(fileId, { user: { id: 'user1' } });

      expect(result).toEqual(expectedControls);
      expect(mockFilesService.getAccessControls).toHaveBeenCalledWith(fileId, 'user1');
    });
  });

  describe('getVersions', () => {
    it('should return file versions', async () => {
      const fileId = '1';
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

      mockFilesService.getVersions.mockResolvedValue(expectedVersions);

      const result = await controller.getVersions(fileId, { user: { id: 'user1' } });

      expect(result).toEqual(expectedVersions);
      expect(mockFilesService.getVersions).toHaveBeenCalledWith(fileId, 'user1');
    });
  });
});
