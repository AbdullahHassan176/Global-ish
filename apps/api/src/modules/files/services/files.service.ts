import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { StorageService } from './storage.service';
import { VirusScanService } from './virus-scan.service';
import { OCRService } from './ocr.service';
import { BlockchainService } from './blockchain.service';
import { UploadFileDto, CreateSignedUrlDto, UpdateFileDto } from '../dto/upload-file.dto';
import { File, AccessLevel, OCRStatus, FilePermission } from '@prisma/client';
import * as crypto from 'crypto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private virusScanService: VirusScanService,
    private ocrService: OCRService,
    private blockchainService: BlockchainService,
    @InjectQueue('ocr-queue') private ocrQueue: Queue,
    @InjectQueue('virus-scan-queue') private virusScanQueue: Queue,
    @InjectQueue('blockchain-queue') private blockchainQueue: Queue
  ) {}

  async createSignedUrl(createSignedUrlDto: CreateSignedUrlDto, userId: string): Promise<{ signedUrl: string; fileId: string }> {
    const fileId = crypto.randomUUID();
    const key = `uploads/${userId}/${fileId}/${createSignedUrlDto.filename}`;

    // Create file record first
    const file = await this.prisma.file.create({
      data: {
        id: fileId,
        name: createSignedUrlDto.filename,
        originalName: createSignedUrlDto.filename,
        mimeType: createSignedUrlDto.mimeType,
        size: createSignedUrlDto.size,
        path: key,
        hash: '', // Will be updated after upload
        tags: createSignedUrlDto.tags || [],
        accessLevel: createSignedUrlDto.accessLevel || AccessLevel.PRIVATE,
        uploadedBy: userId,
        metadata: createSignedUrlDto.metadata || {}
      }
    });

    const signedUrl = await this.storageService.getSignedUrl(key, 3600); // 1 hour expiry

    return { signedUrl, fileId };
  }

  async uploadFile(uploadFileDto: UploadFileDto, fileBuffer: Buffer, userId: string): Promise<File> {
    // Calculate file hash
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Check if file already exists
    const existingFile = await this.prisma.file.findUnique({
      where: { hash }
    });

    if (existingFile) {
      // Create a new version of the existing file
      const newFile = await this.prisma.file.create({
        data: {
          name: uploadFileDto.name,
          originalName: uploadFileDto.originalName,
          mimeType: uploadFileDto.mimeType,
          size: uploadFileDto.size,
          path: uploadFileDto.path || `uploads/${userId}/${crypto.randomUUID()}/${uploadFileDto.name}`,
          url: uploadFileDto.url,
          hash,
          chainAnchor: uploadFileDto.chainAnchor,
          version: uploadFileDto.version || 1,
          parentId: existingFile.id,
          tags: uploadFileDto.tags || [],
          accessLevel: uploadFileDto.accessLevel || AccessLevel.PRIVATE,
          uploadedBy: userId,
          metadata: uploadFileDto.metadata || {}
        }
      });

      // Upload to storage
      await this.storageService.upload(fileBuffer, newFile.path, {
        contentType: uploadFileDto.mimeType,
        originalName: uploadFileDto.originalName,
        uploadedBy: userId
      });

      // Queue background processes
      await this.queueBackgroundProcesses(newFile.id, fileBuffer);

      return newFile;
    }

    // Create new file
    const file = await this.prisma.file.create({
      data: {
        name: uploadFileDto.name,
        originalName: uploadFileDto.originalName,
        mimeType: uploadFileDto.mimeType,
        size: uploadFileDto.size,
        path: uploadFileDto.path || `uploads/${userId}/${crypto.randomUUID()}/${uploadFileDto.name}`,
        url: uploadFileDto.url,
        hash,
        chainAnchor: uploadFileDto.chainAnchor,
        version: uploadFileDto.version || 1,
        parentId: uploadFileDto.parentId,
        tags: uploadFileDto.tags || [],
        accessLevel: uploadFileDto.accessLevel || AccessLevel.PRIVATE,
        uploadedBy: userId,
        metadata: uploadFileDto.metadata || {}
      }
    });

    // Upload to storage
    await this.storageService.upload(fileBuffer, file.path, {
      contentType: uploadFileDto.mimeType,
      originalName: uploadFileDto.originalName,
      uploadedBy: userId
    });

    // Queue background processes
    await this.queueBackgroundProcesses(file.id, fileBuffer);

    return file;
  }

  async getFile(fileId: string, userId: string): Promise<File> {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
      include: {
        uploader: true,
        accessControls: {
          include: {
            user: true
          }
        },
        versions: true
      }
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Check access permissions
    await this.checkFileAccess(file, userId, FilePermission.READ);

    return file;
  }

  async getFileContent(fileId: string, userId: string): Promise<Buffer> {
    const file = await this.getFile(fileId, userId);
    
    return await this.storageService.download(file.path);
  }

  async getSignedDownloadUrl(fileId: string, userId: string, expiresIn: number = 3600): Promise<string> {
    const file = await this.getFile(fileId, userId);
    
    return await this.storageService.getSignedUrl(file.path, expiresIn);
  }

  async updateFile(fileId: string, updateFileDto: UpdateFileDto, userId: string): Promise<File> {
    const file = await this.getFile(fileId, userId);
    
    // Check write permissions
    await this.checkFileAccess(file, userId, FilePermission.WRITE);

    const updatedFile = await this.prisma.file.update({
      where: { id: fileId },
      data: {
        name: updateFileDto.name,
        tags: updateFileDto.tags,
        accessLevel: updateFileDto.accessLevel,
        metadata: updateFileDto.metadata
      }
    });

    return updatedFile;
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    const file = await this.getFile(fileId, userId);
    
    // Check delete permissions
    await this.checkFileAccess(file, userId, FilePermission.DELETE);

    // Delete from storage
    await this.storageService.delete(file.path);

    // Delete from database
    await this.prisma.file.delete({
      where: { id: fileId }
    });
  }

  async getFilesByUser(userId: string, page: number = 1, limit: number = 20): Promise<{ files: File[]; total: number }> {
    const skip = (page - 1) * limit;

    const [files, total] = await Promise.all([
      this.prisma.file.findMany({
        where: { uploadedBy: userId },
        include: {
          uploader: true,
          versions: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.file.count({
        where: { uploadedBy: userId }
      })
    ]);

    return { files, total };
  }

  async searchFiles(query: string, userId: string, page: number = 1, limit: number = 20): Promise<{ files: File[]; total: number }> {
    const skip = (page - 1) * limit;

    const [files, total] = await Promise.all([
      this.prisma.file.findMany({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { originalName: { contains: query, mode: 'insensitive' } },
                { tags: { has: query } },
                { ocrText: { contains: query, mode: 'insensitive' } }
              ]
            },
            {
              OR: [
                { uploadedBy: userId },
                { accessLevel: AccessLevel.PUBLIC },
                { accessLevel: AccessLevel.INTERNAL },
                {
                  accessControls: {
                    some: {
                      OR: [
                        { userId: userId },
                        { role: { in: await this.getUserRoles(userId) } }
                      ]
                    }
                  }
                }
              ]
            }
          ]
        },
        include: {
          uploader: true,
          versions: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.file.count({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { originalName: { contains: query, mode: 'insensitive' } },
                { tags: { has: query } },
                { ocrText: { contains: query, mode: 'insensitive' } }
              ]
            },
            {
              OR: [
                { uploadedBy: userId },
                { accessLevel: AccessLevel.PUBLIC },
                { accessLevel: AccessLevel.INTERNAL },
                {
                  accessControls: {
                    some: {
                      OR: [
                        { userId: userId },
                        { role: { in: await this.getUserRoles(userId) } }
                      ]
                    }
                  }
                }
              ]
            }
          ]
        }
      })
    ]);

    return { files, total };
  }

  async setFileAccess(fileId: string, userId: string, targetUserId: string, permission: FilePermission): Promise<void> {
    const file = await this.getFile(fileId, userId);
    
    // Check manage permissions
    await this.checkFileAccess(file, userId, FilePermission.MANAGE);

    await this.prisma.fileAccessControl.upsert({
      where: {
        fileId_userId: {
          fileId,
          userId: targetUserId
        }
      },
      update: {
        permission
      },
      create: {
        fileId,
        userId: targetUserId,
        permission
      }
    });
  }

  async setFileRoleAccess(fileId: string, userId: string, role: string, permission: FilePermission): Promise<void> {
    const file = await this.getFile(fileId, userId);
    
    // Check manage permissions
    await this.checkFileAccess(file, userId, FilePermission.MANAGE);

    await this.prisma.fileAccessControl.upsert({
      where: {
        fileId_role: {
          fileId,
          role
        }
      },
      update: {
        permission
      },
      create: {
        fileId,
        role,
        permission
      }
    });
  }

  async getFileVersions(fileId: string, userId: string): Promise<File[]> {
    const file = await this.getFile(fileId, userId);
    
    const versions = await this.prisma.file.findMany({
      where: {
        OR: [
          { id: fileId },
          { parentId: fileId }
        ]
      },
      include: {
        uploader: true
      },
      orderBy: { version: 'desc' }
    });

    return versions;
  }

  async getFileHashAnchor(fileId: string, userId: string): Promise<{ hash: string; chainAnchor?: string }> {
    const file = await this.getFile(fileId, userId);
    
    return {
      hash: file.hash,
      chainAnchor: file.chainAnchor || undefined
    };
  }

  private async queueBackgroundProcesses(fileId: string, fileBuffer: Buffer): Promise<void> {
    // Queue virus scan
    await this.virusScanQueue.add('scan-file', {
      fileId,
      fileBuffer,
      filename: 'uploaded-file'
    });

    // Queue OCR processing for supported file types
    const supportedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/tiff',
      'application/pdf',
      'image/bmp',
      'image/gif'
    ];

    const file = await this.prisma.file.findUnique({
      where: { id: fileId }
    });

    if (file && supportedMimeTypes.includes(file.mimeType)) {
      await this.ocrQueue.add('extract-text', {
        fileId,
        fileBuffer,
        mimeType: file.mimeType
      });
    }

    // Queue blockchain anchoring
    await this.blockchainQueue.add('anchor-document', {
      fileId,
      hash: file?.hash
    });
  }

  private async checkFileAccess(file: File, userId: string, permission: FilePermission): Promise<void> {
    // Owner has all permissions
    if (file.uploadedBy === userId) {
      return;
    }

    // Check public access
    if (file.accessLevel === AccessLevel.PUBLIC && permission === FilePermission.READ) {
      return;
    }

    // Check internal access
    if (file.accessLevel === AccessLevel.INTERNAL && permission === FilePermission.READ) {
      // In a real implementation, you'd check if user is internal
      return;
    }

    // Check specific access controls
    const accessControl = await this.prisma.fileAccessControl.findFirst({
      where: {
        fileId: file.id,
        OR: [
          { userId: userId },
          { role: { in: await this.getUserRoles(userId) } }
        ]
      }
    });

    if (!accessControl) {
      throw new BadRequestException('Insufficient permissions to access this file');
    }

    // Check permission level
    const permissionLevels = {
      [FilePermission.READ]: 1,
      [FilePermission.WRITE]: 2,
      [FilePermission.DELETE]: 3,
      [FilePermission.MANAGE]: 4
    };

    if (permissionLevels[accessControl.permission] < permissionLevels[permission]) {
      throw new BadRequestException('Insufficient permissions for this operation');
    }
  }

  private async getUserRoles(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    return user ? [user.role] : [];
  }
}
