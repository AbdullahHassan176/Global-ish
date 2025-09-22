import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../prisma/prisma.service';
import { VirusScanService } from '../services/virus-scan.service';

@Processor('virus-scan-queue')
export class VirusScanProcessor extends WorkerHost {
  private readonly logger = new Logger(VirusScanProcessor.name);

  constructor(
    private prisma: PrismaService,
    private virusScanService: VirusScanService
  ) {
    super();
  }

  async process(job: Job<{ fileId: string; fileBuffer: Buffer; filename: string }>): Promise<void> {
    const { fileId, fileBuffer, filename } = job.data;

    try {
      this.logger.log(`Starting virus scan for file ${fileId}`);

      // Update file status
      await this.prisma.file.update({
        where: { id: fileId },
        data: { isVirusScanned: false }
      });

      // Perform virus scan
      const scanResult = await this.virusScanService.scanFile(fileBuffer, filename);

      // Update file with scan results
      await this.prisma.file.update({
        where: { id: fileId },
        data: {
          isVirusScanned: true,
          virusScanResult: scanResult.isClean ? 'CLEAN' : 'INFECTED'
        }
      });

      if (!scanResult.isClean) {
        this.logger.warn(`File ${fileId} is infected with threats:`, scanResult.threats);
        
        // In a real implementation, you might want to:
        // 1. Quarantine the file
        // 2. Notify administrators
        // 3. Delete the file
        // 4. Log security events
      }

      this.logger.log(`Virus scan completed for file ${fileId}: ${scanResult.isClean ? 'CLEAN' : 'INFECTED'}`);

    } catch (error) {
      this.logger.error(`Virus scan failed for file ${fileId}:`, error);
      
      // Update file with error status
      await this.prisma.file.update({
        where: { id: fileId },
        data: {
          isVirusScanned: true,
          virusScanResult: 'SCAN_FAILED'
        }
      });

      throw error;
    }
  }
}
