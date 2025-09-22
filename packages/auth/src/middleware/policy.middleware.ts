import { Request, Response, NextFunction } from 'express';
import { PolicyService, PolicyEvaluationContext } from '../policy.service';
import { AuthenticatedRequest } from './auth.middleware';
import { AuthorizationError } from '@global-next/types';

export interface PolicyMiddlewareOptions {
  resource: string;
  action: string;
  resourceIdParam?: string; // Parameter name for resource ID
  resourceAttributes?: (req: Request) => Record<string, any>;
}

export class PolicyMiddleware {
  constructor(private policyService: PolicyService) {}

  requirePermission = (options: PolicyMiddlewareOptions) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          throw new AuthorizationError('Authentication required');
        }

        // Get resource ID if specified
        let resourceId: string | undefined;
        if (options.resourceIdParam && req.params[options.resourceIdParam]) {
          resourceId = req.params[options.resourceIdParam];
        }

        // Get resource attributes if provided
        let resourceAttributes: Record<string, any> = {};
        if (options.resourceAttributes) {
          resourceAttributes = options.resourceAttributes(req);
        }

        // Add resource ID to attributes
        if (resourceId) {
          resourceAttributes.id = resourceId;
        }

        // Create evaluation context
        const context: PolicyEvaluationContext = {
          user: {
            id: req.user.id,
            email: req.user.email,
            name: '',
            role: req.user.role as any,
            attributes: {},
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            mfaEnabled: false,
            webauthnEnabled: false
          },
          resource: options.resource,
          action: options.action,
          resourceAttributes,
          environment: {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
          }
        };

        // Check permission
        const hasPermission = this.policyService.hasPermission(context);

        if (!hasPermission) {
          throw new AuthorizationError(
            `Insufficient permissions to ${options.action} ${options.resource}`
          );
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };

  // Convenience methods for common operations
  requireRead = (resource: string, resourceIdParam?: string) => {
    return this.requirePermission({
      resource,
      action: 'read',
      resourceIdParam
    });
  };

  requireWrite = (resource: string, resourceIdParam?: string) => {
    return this.requirePermission({
      resource,
      action: 'write',
      resourceIdParam
    });
  };

  requireDelete = (resource: string, resourceIdParam?: string) => {
    return this.requirePermission({
      resource,
      action: 'delete',
      resourceIdParam
    });
  };

  requireManage = (resource: string, resourceIdParam?: string) => {
    return this.requirePermission({
      resource,
      action: 'manage',
      resourceIdParam
    });
  };
}
