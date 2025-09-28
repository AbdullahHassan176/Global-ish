export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationRequest {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  channels: string[];
  priority?: string;
}

export interface TaskQueryDto {
  page: number;
  limit: number;
  status?: string;
  priority?: string;
  assignedTo?: string;
}

export interface UploadFileDto {
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  hash: string;
  tags?: string[];
  accessLevel?: string;
  parentId?: string;
}