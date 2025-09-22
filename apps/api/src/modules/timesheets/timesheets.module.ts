import { Module } from '@nestjs/common';
import { TimesheetsController } from './controllers/timesheets.controller';
import { TimesheetsService } from './services/timesheets.service';
import { PrismaModule } from '../../common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TimesheetsController],
  providers: [TimesheetsService],
  exports: [TimesheetsService],
})
export class TimesheetsModule {}
