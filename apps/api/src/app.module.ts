import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './packages/auth/src/auth.module';

// Core Modules
import { FilesModule } from './modules/files/files.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

// Consulting Modules
import { MarketingModule } from './modules/marketing/marketing.module';
import { ProductRegistrationModule } from './modules/product-registration/product-registration.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { TimesheetsModule } from './modules/timesheets/timesheets.module';

// Logistics Module
import { LogisticsModule } from './modules/logistics/logistics.module';

// Integrations Module
import { IntegrationsModule } from './modules/integrations/integrations.module';

// Security Module
import { SecurityModule } from './modules/security/security.module';

// Reporting Module
import { ReportingModule } from './modules/reporting/reporting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    
    // Core Modules
    FilesModule,
    WorkflowsModule,
    TasksModule,
    NotificationsModule,
    
    // Consulting Modules
    MarketingModule,
    ProductRegistrationModule,
    ComplianceModule,
    TimesheetsModule,
    
    // Logistics Module
    LogisticsModule,
    
    // Integrations Module
    IntegrationsModule,
    
    // Security Module
    SecurityModule,
    
    // Reporting Module
    ReportingModule,
  ],
})
export class AppModule {}
