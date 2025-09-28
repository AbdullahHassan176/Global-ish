import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateComplianceRecordDto, UpdateComplianceRecordDto } from '../dto/compliance.dto';

@Injectable()
export class ComplianceService {
  constructor(private prisma: PrismaService) {}

  async getComplianceRecords(query: any) {
    return this.prisma.complianceRecord.findMany({
      where: query,
      include: {
        reminders: true,
        creator: true,
      },
    });
  }

  async createComplianceRecord(createDto: CreateComplianceRecordDto) {
    return this.prisma.complianceRecord.create({
      data: createDto,
      include: {
        reminders: true,
        creator: true,
      },
    });
  }

  async updateComplianceRecord(id: string, updateDto: UpdateComplianceRecordDto) {
    const record = await this.prisma.complianceRecord.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('Compliance record not found');
    }

    return this.prisma.complianceRecord.update({
      where: { id },
      data: updateDto,
      include: {
        reminders: true,
        creator: true,
      },
    });
  }

  async deleteComplianceRecord(id: string) {
    const record = await this.prisma.complianceRecord.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('Compliance record not found');
    }

    return this.prisma.complianceRecord.delete({
      where: { id },
    });
  }
}
