import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CreateTimesheetDto, UpdateTimesheetDto } from '../dto/timesheet.dto';

@Injectable()
export class TimesheetsService {
  constructor(private prisma: PrismaService) {}

  async getTimesheets(query: any) {
    return this.prisma.timesheet.findMany({
      where: query,
      include: {
        user: true,
        creator: true,
        approver: true,
      },
    });
  }

  async createTimesheet(createDto: CreateTimesheetDto) {
    return this.prisma.timesheet.create({
      data: createDto,
      include: {
        user: true,
        creator: true,
        approver: true,
      },
    });
  }

  async updateTimesheet(id: string, updateDto: UpdateTimesheetDto) {
    const timesheet = await this.prisma.timesheet.findUnique({
      where: { id },
    });

    if (!timesheet) {
      throw new NotFoundException('Timesheet not found');
    }

    return this.prisma.timesheet.update({
      where: { id },
      data: updateDto,
      include: {
        user: true,
        creator: true,
        approver: true,
      },
    });
  }

  async deleteTimesheet(id: string) {
    const timesheet = await this.prisma.timesheet.findUnique({
      where: { id },
    });

    if (!timesheet) {
      throw new NotFoundException('Timesheet not found');
    }

    return this.prisma.timesheet.delete({
      where: { id },
    });
  }
}
