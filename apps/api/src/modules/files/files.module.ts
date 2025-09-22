import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { FilesController } from './controllers/files.controller';
import { FilesService } from './services/files.service';
import { StorageService } from './services/storage.service';
import { VirusScanService } from './services/virus-scan.service';
import { OCRService } from './services/ocr.service';
import { BlockchainService } from './services/blockchain.service';
import { VirusScanProcessor } from './processors/virus-scan.processor';
import { OCRProcessor } from './processors/ocr.processor';
import { BlockchainProcessor } from './processors/blockchain.processor';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue(
      {
        name: 'virus-scan-queue',
        defaultJobOptions: {
          removeOnComplete: 10,
          removeOnFail: 5,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      },
      {
        name: 'ocr-queue',
        defaultJobOptions: {
          removeOnComplete: 10,
          removeOnFail: 5,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      },
      {
        name: 'blockchain-queue',
        defaultJobOptions: {
          removeOnComplete: 10,
          removeOnFail: 5,
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
        },
      }
    ),
  ],
  controllers: [FilesController],
  providers: [
    FilesService,
    StorageService,
    VirusScanService,
    OCRService,
    BlockchainService,
    VirusScanProcessor,
    OCRProcessor,
    BlockchainProcessor,
  ],
  exports: [FilesService],
})
export class FilesModule {}
