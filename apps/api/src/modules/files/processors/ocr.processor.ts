import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../prisma/prisma.service';
import { OCRService } from '../services/ocr.service';
import { OCRStatus } from '@prisma/client';

@Processor('ocr-queue')
export class OCRProcessor extends WorkerHost {
  private readonly logger = new Logger(OCRProcessor.name);

  constructor(
    private prisma: PrismaService,
    private ocrService: OCRService
  ) {
    super();
  }

  async process(job: Job<{ fileId: string; fileBuffer: Buffer; mimeType: string }>): Promise<void> {
    const { fileId, fileBuffer, mimeType } = job.data;

    try {
      this.logger.log(`Starting OCR processing for file ${fileId}`);

      // Update file status
      await this.prisma.file.update({
        where: { id: fileId },
        data: { ocrStatus: OCRStatus.PROCESSING }
      });

      // Perform OCR
      const ocrResult = await this.ocrService.extractText(fileBuffer, mimeType);

      // Update file with OCR results
      await this.prisma.file.update({
        where: { id: fileId },
        data: {
          ocrStatus: OCRStatus.COMPLETED,
          ocrText: ocrResult.text,
          metadata: {
            ...(await this.getFileMetadata(fileId)),
            ocr: {
              confidence: ocrResult.confidence,
              language: ocrResult.language,
              pages: ocrResult.pages?.length || 0,
              processingTime: ocrResult.metadata?.processingTime || 0
            }
          }
        }
      });

      this.logger.log(`OCR processing completed for file ${fileId}. Extracted ${ocrResult.text.length} characters with ${ocrResult.confidence} confidence`);

    } catch (error) {
      this.logger.error(`OCR processing failed for file ${fileId}:`, error);
      
      // Update file with error status
      await this.prisma.file.update({
        where: { id: fileId },
        data: { ocrStatus: OCRStatus.FAILED }
      });

      throw error;
    }
  }

  private async getFileMetadata(fileId: string): Promise<Record<string, any>> {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
      select: { metadata: true }
    });

    return file?.metadata as Record<string, any> || {};
  }
}
