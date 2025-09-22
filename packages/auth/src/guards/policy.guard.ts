import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PolicyService, PolicyEvaluationContext } from '../policy.service';
import { User } from '@global-next/types';

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private policyService: PolicyService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Get permission metadata from decorator
    const permission = this.reflector.get<{ resource: string; action: string }>(
      'permission',
      context.getHandler()
    );

    if (!permission) {
      return true; // No permission required
    }

    // Create evaluation context
    const evaluationContext: PolicyEvaluationContext = {
      user,
      resource: permission.resource,
      action: permission.action,
      resourceAttributes: this.getResourceAttributes(request),
      environment: {
        ip: request.ip,
        userAgent: request.get('User-Agent'),
        timestamp: new Date().toISOString()
      }
    };

    const hasPermission = this.policyService.hasPermission(evaluationContext);

    if (!hasPermission) {
      throw new ForbiddenException(
        `Insufficient permissions to ${permission.action} ${permission.resource}`
      );
    }

    return true;
  }

  private getResourceAttributes(request: any): Record<string, any> {
    const attributes: Record<string, any> = {};

    // Add route parameters
    if (request.params) {
      Object.assign(attributes, request.params);
    }

    // Add query parameters
    if (request.query) {
      Object.assign(attributes, request.query);
    }

    // Add body data (for write operations)
    if (request.body) {
      Object.assign(attributes, request.body);
    }

    return attributes;
  }
}
