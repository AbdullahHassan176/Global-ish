import { SetMetadata } from '@nestjs/common';

export interface PermissionMetadata {
  resource: string;
  action: string;
}

export const RequirePermission = (resource: string, action: string) =>
  SetMetadata('permission', { resource, action });
