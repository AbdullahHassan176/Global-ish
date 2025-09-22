# Pull Request

## Description
Brief description of the changes made in this PR.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Security enhancement
- [ ] Refactoring (no functional changes)

## Related Issues
Fixes #(issue number)

## Security Checklist
Please ensure all security requirements are met:

### Input Validation
- [ ] Server-side input validation implemented for all user inputs
- [ ] Client-side validation schemas updated
- [ ] SQL injection prevention measures in place
- [ ] XSS prevention measures implemented
- [ ] File upload validation and sanitization

### Authentication & Authorization
- [ ] All API endpoints protected with proper authentication
- [ ] Authorization verified on every handler using PolicyService
- [ ] Role-based access control (RBAC) implemented where needed
- [ ] Permission checks added for sensitive operations
- [ ] Session management properly implemented

### Data Protection
- [ ] Sensitive fields encrypted at rest using PII encryption service
- [ ] Secrets and sensitive data not logged
- [ ] PII data properly sanitized in logs and responses
- [ ] Data retention policies applied
- [ ] GDPR compliance measures implemented

### Rate Limiting & Anti-Automation
- [ ] Rate limits implemented on authentication flows
- [ ] API endpoints protected with appropriate rate limiting
- [ ] Anti-automation measures in place for sensitive operations
- [ ] CAPTCHA or similar protection where needed

### External Integrations
- [ ] All external API calls use signed requests
- [ ] Webhook signatures verified with HMAC
- [ ] Timestamp validation implemented for webhooks
- [ ] API keys and secrets properly secured
- [ ] Error handling for external service failures

### Audit & Compliance
- [ ] Audit trail implemented for mutating actions
- [ ] Reason strings provided for all overrides
- [ ] Security events logged appropriately
- [ ] Compliance requirements met (GDPR, SOX, etc.)
- [ ] Data export/erasure functionality tested

### Testing
- [ ] Unit tests written for new functionality
- [ ] Integration tests added for API endpoints
- [ ] Security tests implemented
- [ ] Data export/erasure tested
- [ ] Retention jobs scheduled and tested
- [ ] Performance tests run for critical paths

### Documentation
- [ ] API documentation updated
- [ ] Security considerations documented
- [ ] Configuration changes documented
- [ ] Migration scripts provided if needed

## Testing
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed
- [ ] Security testing performed
- [ ] Performance testing completed (if applicable)

## Deployment Notes
- [ ] Environment variables updated
- [ ] Database migrations provided
- [ ] Configuration changes documented
- [ ] Rollback plan prepared
- [ ] Monitoring and alerting updated

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information that reviewers should know.

---

## Reviewer Checklist
- [ ] Code follows project style guidelines
- [ ] Security requirements met
- [ ] Performance implications considered
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] Breaking changes documented
- [ ] Migration scripts provided (if needed)
