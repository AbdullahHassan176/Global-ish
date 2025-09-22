import { Policy, PolicyEffect, PolicyCondition, User, UserRole, Permission } from '@global-next/types';

export interface PolicyEvaluationContext {
  user: User;
  resource: string;
  action: string;
  resourceAttributes?: Record<string, any>;
  environment?: Record<string, any>;
}

export class PolicyService {
  constructor(private policies: Policy[] = []) {}

  setPolicies(policies: Policy[]): void {
    this.policies = policies;
  }

  addPolicy(policy: Policy): void {
    this.policies.push(policy);
  }

  removePolicy(policyId: string): void {
    this.policies = this.policies.filter(p => p.id !== policyId);
  }

  evaluatePolicy(context: PolicyEvaluationContext): PolicyEffect {
    const applicablePolicies = this.getApplicablePolicies(context);
    
    if (applicablePolicies.length === 0) {
      return PolicyEffect.DENY; // Default deny
    }

    // Check for explicit DENY policies first
    const denyPolicies = applicablePolicies.filter(p => p.effect === PolicyEffect.DENY);
    if (denyPolicies.length > 0) {
      return PolicyEffect.DENY;
    }

    // Check for ALLOW policies
    const allowPolicies = applicablePolicies.filter(p => p.effect === PolicyEffect.ALLOW);
    if (allowPolicies.length > 0) {
      return PolicyEffect.ALLOW;
    }

    return PolicyEffect.DENY;
  }

  hasPermission(context: PolicyEvaluationContext): boolean {
    return this.evaluatePolicy(context) === PolicyEffect.ALLOW;
  }

  getUserPermissions(user: User): Permission[] {
    const permissions: Permission[] = [];
    
    for (const policy of this.policies) {
      if (this.isPolicyApplicableToUser(policy, user)) {
        permissions.push({
          resource: policy.resource,
          action: policy.action,
          conditions: policy.conditions
        });
      }
    }

    return permissions;
  }

  private getApplicablePolicies(context: PolicyEvaluationContext): Policy[] {
    return this.policies.filter(policy => {
      // Check if policy applies to the resource and action
      if (!this.matchesResourceAndAction(policy, context.resource, context.action)) {
        return false;
      }

      // Check if policy applies to the user
      if (!this.isPolicyApplicableToUser(policy, context.user)) {
        return false;
      }

      // Check conditions
      if (policy.conditions && !this.evaluateConditions(policy.conditions, context)) {
        return false;
      }

      return true;
    });
  }

  private matchesResourceAndAction(policy: Policy, resource: string, action: string): boolean {
    // Support wildcards and patterns
    const resourceMatch = this.matchesPattern(policy.resource, resource);
    const actionMatch = this.matchesPattern(policy.action, action);
    
    return resourceMatch && actionMatch;
  }

  private isPolicyApplicableToUser(policy: Policy, user: User): boolean {
    if (typeof policy.subject === 'string') {
      // Direct user ID match
      if (policy.subject === user.id) {
        return true;
      }
      
      // Role match
      if (policy.subject === user.role) {
        return true;
      }
    }

    return false;
  }

  private evaluateConditions(conditions: PolicyCondition[], context: PolicyEvaluationContext): boolean {
    return conditions.every(condition => {
      const attributeValue = this.getAttributeValue(condition.attribute, context);
      return this.evaluateCondition(condition, attributeValue);
    });
  }

  private getAttributeValue(attribute: string, context: PolicyEvaluationContext): any {
    // Check user attributes first
    if (attribute.startsWith('user.')) {
      const userAttribute = attribute.substring(5);
      return this.getNestedValue(context.user, userAttribute);
    }

    // Check resource attributes
    if (attribute.startsWith('resource.')) {
      const resourceAttribute = attribute.substring(9);
      return this.getNestedValue(context.resourceAttributes || {}, resourceAttribute);
    }

    // Check environment attributes
    if (attribute.startsWith('env.')) {
      const envAttribute = attribute.substring(4);
      return this.getNestedValue(context.environment || {}, envAttribute);
    }

    // Direct attribute access
    return this.getNestedValue(context, attribute);
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  private evaluateCondition(condition: PolicyCondition, attributeValue: any): boolean {
    const { operator, value } = condition;

    switch (operator) {
      case 'equals':
        return attributeValue === value;
      case 'not_equals':
        return attributeValue !== value;
      case 'contains':
        return typeof attributeValue === 'string' && attributeValue.includes(value);
      case 'starts_with':
        return typeof attributeValue === 'string' && attributeValue.startsWith(value);
      case 'ends_with':
        return typeof attributeValue === 'string' && attributeValue.endsWith(value);
      case 'greater_than':
        return typeof attributeValue === 'number' && attributeValue > value;
      case 'less_than':
        return typeof attributeValue === 'number' && attributeValue < value;
      case 'in':
        return Array.isArray(value) && value.includes(attributeValue);
      case 'not_in':
        return Array.isArray(value) && !value.includes(attributeValue);
      default:
        return false;
    }
  }

  private matchesPattern(pattern: string, value: string): boolean {
    if (pattern === '*') {
      return true;
    }

    if (pattern.includes('*')) {
      const regexPattern = pattern.replace(/\*/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(value);
    }

    return pattern === value;
  }

  // Helper methods for common permission checks
  canRead(user: User, resource: string, resourceAttributes?: Record<string, any>): boolean {
    return this.hasPermission({
      user,
      resource,
      action: 'read',
      resourceAttributes
    });
  }

  canWrite(user: User, resource: string, resourceAttributes?: Record<string, any>): boolean {
    return this.hasPermission({
      user,
      resource,
      action: 'write',
      resourceAttributes
    });
  }

  canDelete(user: User, resource: string, resourceAttributes?: Record<string, any>): boolean {
    return this.hasPermission({
      user,
      resource,
      action: 'delete',
      resourceAttributes
    });
  }

  canManage(user: User, resource: string, resourceAttributes?: Record<string, any>): boolean {
    return this.hasPermission({
      user,
      resource,
      action: 'manage',
      resourceAttributes
    });
  }
}
