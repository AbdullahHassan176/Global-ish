# Global Next - Enterprise Monorepo

A comprehensive enterprise-grade monorepo for the Global Next Unified Portal, featuring authentication, authorization, audit logging, and modern development practices. Built with Vue.js 3 and NestJS.

## 🏗️ Architecture

This monorepo contains:

- **`apps/web`** - Vue.js 3 web application with Vite and TypeScript
- **`apps/api`** - NestJS API server with comprehensive auth & RBAC
- **`packages/types`** - Shared TypeScript type definitions
- **`packages/auth`** - Authentication and authorization utilities
- **`packages/ui`** - Shared Vue.js UI components
- **`packages/client-sdk`** - API client SDK (to be implemented)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd global-next-monorepo
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   # Copy example files
   cp apps/web/env.example apps/web/.env
   cp apps/api/env.example apps/api/.env
   
   # Edit the files with your configuration
   ```

3. **Start infrastructure services:**
   ```bash
   docker-compose up -d postgres redis
   ```

4. **Set up the database:**
   ```bash
   # Generate Prisma client
   pnpm db:generate
   
   # Run migrations
   pnpm db:migrate
   ```

5. **Start development servers:**
   ```bash
   # Start all services
   pnpm dev
   
   # Or start individually
   pnpm dev --filter=@global-next/web  # Vue.js app on http://localhost:3000
   pnpm dev --filter=@global-next/api  # NestJS API on http://localhost:3001
   ```

## 🔐 Authentication & Authorization

### Features

- **Multi-Provider Authentication:**
  - Azure AD (Enterprise SSO)
  - Google OAuth
  - Email/Password fallback

- **Multi-Factor Authentication (MFA):**
  - TOTP (Time-based One-Time Password)
  - WebAuthn (FIDO2/Passkeys)
  - Backup codes

- **Role-Based Access Control (RBAC):**
  - Policy-based permissions
  - Attribute-based access control (ABAC)
  - Resource-level permissions

- **Session Management:**
  - JWT tokens with Redis storage
  - Session invalidation
  - Concurrent session limits

### Usage

```typescript
// API Route Protection
@Controller('users')
@UseGuards(JwtAuthGuard, PolicyGuard)
export class UsersController {
  @Get()
  @RequirePermission('users', 'read')
  async getUsers(@CurrentUser() user: User) {
    // Implementation
  }
}

// Frontend Permission Check
import { usePermission } from '@global-next/auth';

function UserManagement() {
  const canManageUsers = usePermission('users', 'manage');
  
  if (!canManageUsers) {
    return <AccessDenied />;
  }
  
  return <UserManagementInterface />;
}
```

## 📊 Audit Logging

All user actions are automatically logged with:

- Actor identification
- Action performed
- Resource affected
- Before/after state hashes
- IP address and user agent
- Timestamp

```typescript
// Automatic audit logging via interceptor
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    // Logs all API calls automatically
  }
}
```

## 🛡️ Security Features

- **Helmet** - Security headers
- **CORS** - Environment-driven configuration
- **Rate Limiting** - Redis-backed with configurable limits
- **CSRF Protection** - For form routes
- **Content Security Policy** - With nonces
- **Input Validation** - Class-validator decorators
- **SQL Injection Protection** - Prisma ORM

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev                    # Start all services
pnpm dev --filter=web      # Start only web app
pnpm dev --filter=api      # Start only API

# Building
pnpm build                 # Build all packages
pnpm build --filter=web   # Build only web app

# Testing
pnpm test                  # Run all tests
pnpm test --filter=api    # Run API tests only

# Linting & Formatting
pnpm lint                  # Lint all packages
pnpm format               # Format all code
pnpm typecheck            # Type check all packages

# Database
pnpm db:generate          # Generate Prisma client
pnpm db:push              # Push schema to database
pnpm db:migrate           # Run migrations
```

### Code Quality

- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks
- **lint-staged** - Run linters on staged files
- **TypeScript** - Strict type checking

## 🐳 Docker Deployment

### Development

```bash
# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 📁 Project Structure

```
global-next-monorepo/
├── apps/
│   ├── web/                 # Vue.js 3 web application
│   │   ├── src/
│   │   │   ├── views/       # Vue.js pages
│   │   │   ├── components/  # Vue.js components
│   │   │   ├── stores/      # Pinia stores
│   │   │   └── router/      # Vue Router config
│   │   └── Dockerfile
│   └── api/                 # NestJS API server
│       ├── src/
│       │   ├── auth/        # Authentication modules
│       │   ├── users/       # User management
│       │   └── audit/       # Audit logging
│       ├── prisma/          # Database schema
│       └── Dockerfile
├── packages/
│   ├── types/               # Shared TypeScript types
│   ├── auth/                # Auth utilities
│   ├── ui/                  # Shared Vue.js UI components
│   └── client-sdk/          # API client
├── .github/workflows/       # CI/CD pipelines
├── docker-compose.yml       # Development services
└── turbo.json              # Turborepo configuration
```

## 🛠️ Technology Stack

### Frontend (Vue.js)
- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management for Vue
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Vue** - Beautiful icon library

### Backend (NestJS)
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **Redis** - In-memory data store
- **BullMQ** - Job queue system
- **JWT** - JSON Web Tokens for auth

### DevOps & Tools
- **pnpm** - Fast, disk space efficient package manager
- **Turborepo** - High-performance build system
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **ESLint & Prettier** - Code quality and formatting
- **Husky** - Git hooks

## 🔄 CI/CD Pipeline

GitHub Actions workflow includes:

1. **Install** - Dependency installation with caching
2. **Lint** - ESLint and Prettier checks
3. **TypeCheck** - TypeScript compilation
4. **Test** - Unit and integration tests
5. **Build** - Production builds
6. **Prisma Migrate** - Database migrations (main branch)
7. **Docker Build** - Container image building

## 🌐 Environment Configuration

### Web App (.env)

```env
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=10000
VITE_AUTH_URL=http://localhost:3001/auth
VITE_AUTH_REDIRECT_URL=http://localhost:3000/auth/callback
VITE_ENABLE_DEBUG=true
VITE_DEV_MODE=true
```

### API Server (.env)

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/global_next_dev"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-jwt-secret"
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
# ... Security and provider configs
```

## 📚 API Documentation

API documentation is available at:
- Development: `http://localhost:3001/api/docs`
- Production: `https://api.globalnext.com/api/docs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**Built with ❤️ by the Global Next Team**