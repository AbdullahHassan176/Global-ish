import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request as NestRequest,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express-serve-static-core';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FilesService } from '../services/files.service';
import { UploadFileDto, CreateSignedUrlDto, UpdateFileDto } from '../dto/upload-file.dto';
import { JwtAuthGuard } from '@global-next/auth';
import { RequirePermission } from '@global-next/auth';
import { CurrentUser } from '@global-next/auth';
import { User } from '@global-next/types';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Create signed URL for file upload' })
  @ApiResponse({ status: 201, description: 'Signed URL created successfully' })
  @RequirePermission('files', 'write')
  async createSignedUrl(
    @Body() createSignedUrlDto: CreateSignedUrlDto,
    @CurrentUser() user: User
  ) {
    return await this.filesService.createSignedUrl(createSignedUrlDto, user.id);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload file directly' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @UseInterceptors(FileInterceptor('file'))
  @RequirePermission('files', 'write')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @CurrentUser() user: User
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileBuffer = file.buffer;
    const uploadData: UploadFileDto = {
      name: file.originalname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      hash: '', // Will be calculated in service
      tags: uploadFileDto.tags,
      accessLevel: uploadFileDto.accessLevel,
      metadata: uploadFileDto.metadata
    };

    return await this.filesService.uploadFile(uploadData, fileBuffer, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file metadata' })
  @ApiResponse({ status: 200, description: 'File metadata retrieved successfully' })
  @RequirePermission('files', 'read')
  async getFile(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.filesService.getFile(id, user.id);
  }

  @Get(':id/content')
  @ApiOperation({ summary: 'Download file content' })
  @ApiResponse({ status: 200, description: 'File content retrieved successfully' })
  @RequirePermission('files', 'read')
  async getFileContent(@Param('id') id: string, @CurrentUser() user: User) {
    const content = await this.filesService.getFileContent(id, user.id);
    return content;
  }

  @Get(':id/download-url')
  @ApiOperation({ summary: 'Get signed download URL' })
  @ApiResponse({ status: 200, description: 'Download URL generated successfully' })
  @RequirePermission('files', 'read')
  async getSignedDownloadUrl(
    @Param('id') id: string,
    @Query('expires') expires: string,
    @CurrentUser() user: User
  ) {
    const expiresIn = expires ? parseInt(expires) : 3600;
    const url = await this.filesService.getSignedDownloadUrl(id, user.id, expiresIn);
    return { downloadUrl: url };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update file metadata' })
  @ApiResponse({ status: 200, description: 'File updated successfully' })
  @RequirePermission('files', 'write')
  async updateFile(
    @Param('id') id: string,
    @Body() updateFileDto: UpdateFileDto,
    @CurrentUser() user: User
  ) {
    return await this.filesService.updateFile(id, updateFileDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @RequirePermission('files', 'delete')
  async deleteFile(@Param('id') id: string, @CurrentUser() user: User) {
    await this.filesService.deleteFile(id, user.id);
    return { message: 'File deleted successfully' };
  }

  @Get()
  @ApiOperation({ summary: 'Get user files' })
  @ApiResponse({ status: 200, description: 'Files retrieved successfully' })
  @RequirePermission('files', 'read')
  async getUserFiles(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @CurrentUser() user: User
  ) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    return await this.filesService.getFilesByUser(user.id, pageNum, limitNum);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search files' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  @RequirePermission('files', 'read')
  async searchFiles(
    @Query('q') query: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @CurrentUser() user: User
  ) {
    if (!query) {
      throw new BadRequestException('Search query is required');
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    return await this.filesService.searchFiles(query, user.id, pageNum, limitNum);
  }

  @Post(':id/access')
  @ApiOperation({ summary: 'Set file access for user' })
  @ApiResponse({ status: 200, description: 'File access updated successfully' })
  @RequirePermission('files', 'manage')
  async setFileAccess(
    @Param('id') id: string,
    @Body() body: { userId: string; permission: string },
    @CurrentUser() user: User
  ) {
    await this.filesService.setFileAccess(id, user.id, body.userId, body.permission as any);
    return { message: 'File access updated successfully' };
  }

  @Post(':id/role-access')
  @ApiOperation({ summary: 'Set file access for role' })
  @ApiResponse({ status: 200, description: 'File role access updated successfully' })
  @RequirePermission('files', 'manage')
  async setFileRoleAccess(
    @Param('id') id: string,
    @Body() body: { role: string; permission: string },
    @CurrentUser() user: User
  ) {
    await this.filesService.setFileRoleAccess(id, user.id, body.role, body.permission as any);
    return { message: 'File role access updated successfully' };
  }

  @Get(':id/versions')
  @ApiOperation({ summary: 'Get file versions' })
  @ApiResponse({ status: 200, description: 'File versions retrieved successfully' })
  @RequirePermission('files', 'read')
  async getFileVersions(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.filesService.getFileVersions(id, user.id);
  }

  @Get(':id/hash-anchor')
  @ApiOperation({ summary: 'Get file hash and blockchain anchor' })
  @ApiResponse({ status: 200, description: 'File hash and anchor retrieved successfully' })
  @RequirePermission('files', 'read')
  async getFileHashAnchor(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.filesService.getFileHashAnchor(id, user.id);
  }
}
