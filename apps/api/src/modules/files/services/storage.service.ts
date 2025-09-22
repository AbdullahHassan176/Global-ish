import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageProvider, StorageConfig, UploadResult } from '../interfaces/storage.interface';
import * as AWS from 'aws-sdk';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService implements StorageProvider {
  private readonly logger = new Logger(StorageService.name);
  private s3Client?: AWS.S3;
  private blobClient?: BlobServiceClient;
  private containerClient?: ContainerClient;
  private config: StorageConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      provider: this.configService.get('STORAGE_PROVIDER', 'local'),
      bucket: this.configService.get('AWS_S3_BUCKET'),
      region: this.configService.get('AWS_REGION', 'us-east-1'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      connectionString: this.configService.get('AZURE_STORAGE_CONNECTION_STRING'),
      containerName: this.configService.get('AZURE_CONTAINER_NAME', 'files'),
      localPath: this.configService.get('LOCAL_STORAGE_PATH', './uploads')
    };

    this.initializeProvider();
  }

  private async initializeProvider() {
    switch (this.config.provider) {
      case 's3':
        this.initializeS3();
        break;
      case 'azure':
        this.initializeAzure();
        break;
      case 'local':
        await this.initializeLocal();
        break;
    }
  }

  private initializeS3() {
    if (!this.config.accessKeyId || !this.config.secretAccessKey) {
      throw new Error('AWS credentials not configured');
    }

    this.s3Client = new AWS.S3({
      accessKeyId: this.config.accessKeyId,
      secretAccessKey: this.config.secretAccessKey,
      region: this.config.region
    });
  }

  private initializeAzure() {
    if (!this.config.connectionString) {
      throw new Error('Azure storage connection string not configured');
    }

    this.blobClient = BlobServiceClient.fromConnectionString(this.config.connectionString);
    this.containerClient = this.blobClient.getContainerClient(this.config.containerName!);
  }

  private async initializeLocal() {
    try {
      await fs.mkdir(this.config.localPath!, { recursive: true });
    } catch (error) {
      this.logger.error('Failed to create local storage directory', error);
      throw error;
    }
  }

  async upload(file: Buffer, key: string, metadata?: Record<string, any>): Promise<UploadResult> {
    try {
      switch (this.config.provider) {
        case 's3':
          return await this.uploadToS3(file, key, metadata);
        case 'azure':
          return await this.uploadToAzure(file, key, metadata);
        case 'local':
          return await this.uploadToLocal(file, key, metadata);
        default:
          throw new Error(`Unsupported storage provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error(`Failed to upload file ${key}`, error);
      throw error;
    }
  }

  private async uploadToS3(file: Buffer, key: string, metadata?: Record<string, any>): Promise<UploadResult> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.config.bucket!,
      Key: key,
      Body: file,
      Metadata: metadata || {}
    };

    const result = await this.s3Client!.upload(params).promise();
    
    return {
      key,
      url: result.Location,
      etag: result.ETag,
      metadata
    };
  }

  private async uploadToAzure(file: Buffer, key: string, metadata?: Record<string, any>): Promise<UploadResult> {
    const blockBlobClient = this.containerClient!.getBlockBlobClient(key);
    
    const uploadOptions = {
      metadata: metadata || {},
      blobHTTPHeaders: {
        blobContentType: metadata?.contentType || 'application/octet-stream'
      }
    };

    await blockBlobClient.upload(file, file.length, uploadOptions);
    
    return {
      key,
      url: blockBlobClient.url,
      metadata
    };
  }

  private async uploadToLocal(file: Buffer, key: string, metadata?: Record<string, any>): Promise<UploadResult> {
    const filePath = path.join(this.config.localPath!, key);
    const dir = path.dirname(filePath);
    
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, file);
    
    return {
      key,
      url: `/uploads/${key}`,
      metadata
    };
  }

  async download(key: string): Promise<Buffer> {
    try {
      switch (this.config.provider) {
        case 's3':
          return await this.downloadFromS3(key);
        case 'azure':
          return await this.downloadFromAzure(key);
        case 'local':
          return await this.downloadFromLocal(key);
        default:
          throw new Error(`Unsupported storage provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error(`Failed to download file ${key}`, error);
      throw error;
    }
  }

  private async downloadFromS3(key: string): Promise<Buffer> {
    const params: AWS.S3.GetObjectRequest = {
      Bucket: this.config.bucket!,
      Key: key
    };

    const result = await this.s3Client!.getObject(params).promise();
    return result.Body as Buffer;
  }

  private async downloadFromAzure(key: string): Promise<Buffer> {
    const blockBlobClient = this.containerClient!.getBlockBlobClient(key);
    const downloadResponse = await blockBlobClient.download();
    
    const chunks: Buffer[] = [];
    for await (const chunk of downloadResponse.readableStreamBody!) {
      chunks.push(Buffer.from(chunk));
    }
    
    return Buffer.concat(chunks);
  }

  private async downloadFromLocal(key: string): Promise<Buffer> {
    const filePath = path.join(this.config.localPath!, key);
    return await fs.readFile(filePath);
  }

  async delete(key: string): Promise<void> {
    try {
      switch (this.config.provider) {
        case 's3':
          await this.deleteFromS3(key);
          break;
        case 'azure':
          await this.deleteFromAzure(key);
          break;
        case 'local':
          await this.deleteFromLocal(key);
          break;
        default:
          throw new Error(`Unsupported storage provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete file ${key}`, error);
      throw error;
    }
  }

  private async deleteFromS3(key: string): Promise<void> {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: this.config.bucket!,
      Key: key
    };

    await this.s3Client!.deleteObject(params).promise();
  }

  private async deleteFromAzure(key: string): Promise<void> {
    const blockBlobClient = this.containerClient!.getBlockBlobClient(key);
    await blockBlobClient.delete();
  }

  private async deleteFromLocal(key: string): Promise<void> {
    const filePath = path.join(this.config.localPath!, key);
    await fs.unlink(filePath);
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      switch (this.config.provider) {
        case 's3':
          return await this.getS3SignedUrl(key, expiresIn);
        case 'azure':
          return await this.getAzureSignedUrl(key, expiresIn);
        case 'local':
          return await this.getLocalUrl(key);
        default:
          throw new Error(`Unsupported storage provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error(`Failed to get signed URL for ${key}`, error);
      throw error;
    }
  }

  private async getS3SignedUrl(key: string, expiresIn: number): Promise<string> {
    const params: AWS.S3.GetObjectRequest = {
      Bucket: this.config.bucket!,
      Key: key
    };

    return this.s3Client!.getSignedUrl('getObject', {
      ...params,
      Expires: expiresIn
    });
  }

  private async getAzureSignedUrl(key: string, expiresIn: number): Promise<string> {
    const blockBlobClient = this.containerClient!.getBlockBlobClient(key);
    const expiryTime = new Date(Date.now() + expiresIn * 1000);
    
    return await blockBlobClient.generateSasUrl({
      permissions: 'r',
      expiresOn: expiryTime
    });
  }

  private async getLocalUrl(key: string): Promise<string> {
    return `/uploads/${key}`;
  }

  async exists(key: string): Promise<boolean> {
    try {
      switch (this.config.provider) {
        case 's3':
          return await this.existsInS3(key);
        case 'azure':
          return await this.existsInAzure(key);
        case 'local':
          return await this.existsInLocal(key);
        default:
          throw new Error(`Unsupported storage provider: ${this.config.provider}`);
      }
    } catch (error) {
      this.logger.error(`Failed to check if file exists ${key}`, error);
      return false;
    }
  }

  private async existsInS3(key: string): Promise<boolean> {
    try {
      await this.s3Client!.headObject({
        Bucket: this.config.bucket!,
        Key: key
      }).promise();
      return true;
    } catch (error) {
      return false;
    }
  }

  private async existsInAzure(key: string): Promise<boolean> {
    try {
      const blockBlobClient = this.containerClient!.getBlockBlobClient(key);
      await blockBlobClient.getProperties();
      return true;
    } catch (error) {
      return false;
    }
  }

  private async existsInLocal(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.config.localPath!, key);
      await fs.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
}
