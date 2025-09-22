import { Module } from '@nestjs/common';
import { ComplianceController } from './controllers/compliance.controller';
import { ComplianceService } from './services/compliance.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ComplianceController],
  providers: [ComplianceService],
  exports: [ComplianceService],
})
export class ComplianceModule {}
