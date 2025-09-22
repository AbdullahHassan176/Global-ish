export interface StorageProvider {
  upload(file: Buffer, key: string, metadata?: Record<string, any>): Promise<UploadResult>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
  exists(key: string): Promise<boolean>;
}

export interface UploadResult {
  key: string;
  url: string;
  etag?: string;
  metadata?: Record<string, any>;
}

export interface StorageConfig {
  provider: 's3' | 'azure' | 'local';
  bucket?: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  connectionString?: string;
  containerName?: string;
  localPath?: string;
}
