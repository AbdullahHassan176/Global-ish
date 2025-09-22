# Global Next Portal - Handover Documentation

## Project Overview

The Global Next Portal is a comprehensive unified platform that combines logistics management, consulting services, compliance tracking, marketing automation, financial management, security controls, and advanced analytics into a single enterprise-grade solution.

## Architecture

### Technology Stack
- **Frontend**: Vue.js 3 with Vite, Vue Router, Pinia, Tailwind CSS
- **Backend**: NestJS with TypeScript, Prisma ORM, PostgreSQL
- **Authentication**: NextAuth.js with OIDC (Azure AD/Google), MFA (TOTP + WebAuthn)
- **Caching**: Redis for sessions and rate limiting
- **Storage**: S3/Azure Blob for file storage
- **Queues**: BullMQ for background processing
- **Security**: Helmet, CORS, Rate Limiting, CSRF, CSP
- **Monitoring**: Application Insights, Sentry
- **CI/CD**: GitHub Actions with security scanning

### Monorepo Structure
```
phase1-monorepo/
├── apps/
│   ├── web/                 # Vue.js frontend
│   └── api/                 # NestJS backend
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── types/               # Shared TypeScript types
│   ├── auth/                # Authentication utilities
│   └── client-sdk/          # API client SDK
├── .github/
│   └── workflows/           # CI/CD pipelines
└── docs/                    # Documentation
```

## Implemented Modules

### Phase 1: Core Infrastructure
- ✅ Monorepo setup with pnpm
- ✅ Authentication system (OIDC + MFA)
- ✅ Database schema with Prisma
- ✅ Security middleware and guards
- ✅ Docker containerization
- ✅ CI/CD pipeline

### Phase 2: Business Modules
- ✅ Files module (upload, virus scan, OCR, blockchain anchoring)
- ✅ Workflows module (JSON-defined steps, approvals)
- ✅ Tasks module (CRUD, assignments, tracking)
- ✅ Notifications module (multi-channel, templating)

### Phase 3: Consulting Modules
- ✅ Marketing module (content calendar, approval flow, integrations)
- ✅ Product Registration module (checklist builder, submission tracker)
- ✅ Compliance module (contract templates, e-signature, sensitive records)
- ✅ Timesheets module (tracking, billability, exports)

### Phase 4: Logistics & Container Tracking
- ✅ Logistics domain models (shipment, container, milestone, costs)
- ✅ Carrier adapter interface (Maersk, MSC, CMA, DHL, FedEx)
- ✅ Map view with live positions
- ✅ Cost management and invoicing
- ✅ Alerts and notifications

### Phase 5: Integrations Hub & Tokenization Bridge
- ✅ Integrations module (credential vault, webhook registry)
- ✅ Tokenization bridge (event publishing, PII sanitization)
- ✅ Signed webhooks with HMAC-SHA256
- ✅ Delivery tracking with retries

### Phase 6: Security Hardening & Privacy
- ✅ PII encryption (field-level JWE with KMS envelope keys)
- ✅ GDPR compliance (consent, export/erasure, retention policies)
- ✅ Session & device management with fingerprinting
- ✅ Rate limiting (multi-tier with Redis)
- ✅ Security scanning (SAST/DAST, dependency audit, SBOM)

### Phase 7: Reporting, KPIs & Advanced Analytics
- ✅ Comprehensive reporting service
- ✅ KPI calculation engine (logistics, consulting, compliance, marketing, finance)
- ✅ Predictive analytics (ETA predictions, HS code suggestions, demurrage risk)
- ✅ Role-specific dashboards
- ✅ Export functionality (CSV/XLSX/PDF/JSON)
- ✅ Scheduled reports with email/webhook delivery

## Database Migration Plan

### Switching to Cosmos DB

1. **Prisma Provider Swap**:
   ```typescript
   // In prisma/schema.prisma
   generator client {
     provider = "prisma-client-js"
     previewFeatures = ["cosmosdb"]
   }
   
   datasource db {
     provider = "cosmosdb"
     url      = env("COSMOS_DB_CONNECTION_STRING")
   }
   ```

2. **Repository Pattern Implementation**:
   - All database operations go through repository interfaces
   - Implement `CosmosRepository` class behind existing interfaces
   - Update dependency injection to use Cosmos repositories

3. **Data Migration Script**:
   ```typescript
   // scripts/migrate-to-cosmos.ts
   import { PrismaClient } from '@prisma/client'
   import { CosmosClient } from '@azure/cosmos'
   
   async function migrateData() {
     // Export from PostgreSQL
     // Transform data for Cosmos DB
     // Import to Cosmos DB
   }
   ```

## SDK Package (packages/client-sdk)

### Implementation
```typescript
// packages/client-sdk/src/index.ts
export class GlobalNextClient {
  constructor(private config: ClientConfig) {}
  
  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResult> {}
  async refreshToken(): Promise<AuthResult> {}
  
  // Logistics
  async getShipments(filters?: ShipmentFilters): Promise<Shipment[]> {}
  async getContainer(id: string): Promise<Container> {}
  async trackShipment(id: string): Promise<TrackingInfo> {}
  
  // Reporting
  async getKPIs(category: KPICategory): Promise<KPIMetrics[]> {}
  async generateReport(type: ReportType): Promise<ReportData> {}
  async predictETA(shipmentId: string): Promise<ETAPrediction> {}
  
  // Files
  async uploadFile(file: File, metadata?: FileMetadata): Promise<FileUploadResult> {}
  async getFile(id: string): Promise<File> {}
  
  // Webhooks
  async registerWebhook(config: WebhookConfig): Promise<WebhookEndpoint> {}
  async verifyWebhookSignature(payload: string, signature: string): Promise<boolean> {}
}
```

### Usage Examples
```typescript
import { GlobalNextClient } from '@global-next/client-sdk'

const client = new GlobalNextClient({
  baseUrl: 'https://api.global-next.com',
  apiKey: 'your-api-key'
})

// Get logistics KPIs
const kpis = await client.getKPIs('LOGISTICS')

// Predict ETA
const prediction = await client.predictETA('shipment-123')

// Upload file
const result = await client.uploadFile(file, {
  tags: ['invoice', 'urgent'],
  metadata: { clientId: 'client-456' }
})
```

## Demo Tenant Setup

### Sample Data
```typescript
// scripts/seed-demo-data.ts
const demoData = {
  users: [
    {
      email: 'demo@global-next.com',
      role: 'ADMIN',
      profile: { name: 'Demo Admin' }
    },
    {
      email: 'logistics@global-next.com',
      role: 'LOGISTICS_MANAGER',
      profile: { name: 'Logistics Manager' }
    }
  ],
  shipments: [
    {
      shipmentNumber: 'SHP-2024-001',
      origin: 'Shanghai',
      destination: 'Los Angeles',
      status: 'IN_TRANSIT',
      milestones: [
        { type: 'ETD', scheduledDate: '2024-01-15', actualDate: '2024-01-15' },
        { type: 'ETA', scheduledDate: '2024-01-25', actualDate: null }
      ]
    }
  ],
  containers: [
    {
      containerNumber: 'MSKU1234567',
      type: '40FT',
      status: 'IN_TRANSIT',
      currentLocation: 'Pacific Ocean'
    }
  ],
  kpis: [
    {
      type: 'LEAD_TIME_AVERAGE',
      value: 14.5,
      target: 14,
      period: '2024-01'
    }
  ]
}
```

### E2E Flow Examples
1. **Logistics Flow**: Create shipment → Add container → Track milestones → Generate invoice
2. **Consulting Flow**: Create project → Log timesheets → Generate utilization report
3. **Compliance Flow**: Upload contract → Request signature → Track renewal
4. **Marketing Flow**: Create campaign → Schedule content → Track performance

## API Contracts

### OpenAPI Specification
- Complete OpenAPI 3.1.0 specification in `apps/api/openapi.yaml`
- Includes all endpoints, schemas, and examples
- Ready for code generation and documentation

### Webhook Contracts
```typescript
// Tokenization Event Example
{
  "event": "doc.hashed",
  "occurred_at": "2024-01-15T10:15:00Z",
  "tenant_id": "tn_123",
  "data": {
    "document_id": "doc_abc",
    "sha256": "a1b2c3d4e5f6...",
    "anchor_tx": null,
    "resource_type": "BillOfLading",
    "shipment_ref": "SHP-2024-0091"
  },
  "hmac": "base64(HMAC-SHA256(body, secret))"
}
```

## Environment Configuration

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/globalnext

# Authentication
NEXTAUTH_SECRET=your-secret
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret

# Storage
S3_BUCKET=globalnext-files
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret

# External APIs
SEMRUSH_API_KEY=your-key
DOCUSIGN_CLIENT_ID=your-id
MAPBOX_TOKEN=your-token

# Security
ENCRYPTION_KEY=your-encryption-key
WEBHOOK_SECRET=your-webhook-secret
```

## Security Checklist

### Pre-Deployment
- [ ] Input validation on all endpoints
- [ ] Authentication/authorization verified
- [ ] Sensitive data encrypted
- [ ] Rate limiting configured
- [ ] External API calls signed
- [ ] Audit trails implemented
- [ ] Security scanning passed
- [ ] Dependency vulnerabilities resolved

### Post-Deployment
- [ ] Monitor security events
- [ ] Review audit logs
- [ ] Test data export/erasure
- [ ] Verify webhook signatures
- [ ] Check rate limiting effectiveness
- [ ] Validate encryption keys
- [ ] Test backup/restore procedures

## Performance Considerations

### Database Optimization
- Indexes on frequently queried fields
- Connection pooling configured
- Query optimization for large datasets
- Read replicas for reporting queries

### Caching Strategy
- Redis for session storage
- API response caching
- Static asset caching
- CDN for file storage

### Monitoring
- Application performance monitoring
- Database query monitoring
- Error tracking and alerting
- Uptime monitoring

## Deployment Guide

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Services included:
# - PostgreSQL database
# - Redis cache
# - NestJS API
# - Vue.js frontend
# - Nginx reverse proxy
```

### Production Deployment
1. Set up production environment variables
2. Configure SSL certificates
3. Set up monitoring and alerting
4. Configure backup procedures
5. Deploy with zero-downtime strategy

## Support & Maintenance

### Monitoring
- Application Insights for performance
- Sentry for error tracking
- Custom dashboards for business metrics
- Automated alerting for critical issues

### Backup Strategy
- Daily database backups
- File storage replication
- Configuration backup
- Disaster recovery procedures

### Update Procedures
- Staged deployment process
- Database migration scripts
- Feature flag management
- Rollback procedures

## Contact Information

- **Technical Lead**: [Your Name]
- **Email**: [your-email@company.com]
- **Documentation**: [Link to full documentation]
- **Repository**: [GitHub repository URL]
- **API Documentation**: [Swagger/OpenAPI URL]

---

*This handover document provides a comprehensive overview of the Global Next Portal implementation. For detailed technical documentation, refer to the individual module documentation and API specifications.*
