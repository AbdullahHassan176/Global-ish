import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../prisma/prisma.service';
import { BlockchainService } from '../services/blockchain.service';

@Processor('blockchain-queue')
export class BlockchainProcessor extends WorkerHost {
  private readonly logger = new Logger(BlockchainProcessor.name);

  constructor(
    private prisma: PrismaService,
    private blockchainService: BlockchainService
  ) {
    super();
  }

  async process(job: Job<{ fileId: string; hash: string }>): Promise<void> {
    const { fileId, hash } = job.data;

    try {
      this.logger.log(`Starting blockchain anchoring for file ${fileId}`);

      // Check if file already has a chain anchor
      const file = await this.prisma.file.findUnique({
        where: { id: fileId },
        select: { chainAnchor: true }
      });

      if (file?.chainAnchor) {
        this.logger.log(`File ${fileId} already has a chain anchor: ${file.chainAnchor}`);
        return;
      }

      // Create blockchain anchor
      const anchor = await this.blockchainService.anchorDocument(hash, {
        fileId,
        timestamp: new Date().toISOString(),
        type: 'document_hash'
      });

      // Update file with chain anchor
      await this.prisma.file.update({
        where: { id: fileId },
        data: {
          chainAnchor: anchor.anchorId,
          metadata: {
            ...(await this.getFileMetadata(fileId)),
            blockchain: {
              anchorId: anchor.anchorId,
              transactionHash: anchor.transactionHash,
              blockNumber: anchor.blockNumber,
              network: anchor.network,
              timestamp: anchor.timestamp,
              metadata: anchor.metadata
            }
          }
        }
      });

      this.logger.log(`Blockchain anchoring completed for file ${fileId}. Anchor ID: ${anchor.anchorId}`);

    } catch (error) {
      this.logger.error(`Blockchain anchoring failed for file ${fileId}:`, error);
      
      // In a real implementation, you might want to:
      // 1. Retry the operation
      // 2. Log the failure for manual intervention
      // 3. Notify administrators
      
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
