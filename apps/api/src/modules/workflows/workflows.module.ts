import { Module } from '@nestjs/common';
import { WorkflowsController } from './controllers/workflows.controller';
import { WorkflowEngineService } from './services/workflow-engine.service';
import { SignatureService } from './services/signature.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [WorkflowsController],
  providers: [WorkflowEngineService, SignatureService],
  exports: [WorkflowEngineService, SignatureService],
})
export class WorkflowsModule {}
