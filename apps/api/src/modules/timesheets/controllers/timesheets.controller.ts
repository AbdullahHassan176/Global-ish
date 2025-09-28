import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TimesheetsService } from '../services/timesheets.service';
import { CreateTimesheetDto, UpdateTimesheetDto } from '../dto/timesheet.dto';

@ApiTags('timesheets')
@Controller('timesheets')
export class TimesheetsController {
  constructor(private readonly timesheetsService: TimesheetsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all timesheets' })
  @ApiResponse({ status: 200, description: 'Timesheets retrieved successfully' })
  async getTimesheets(@Query() query: any) {
    return this.timesheetsService.getTimesheets(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new timesheet' })
  @ApiResponse({ status: 201, description: 'Timesheet created successfully' })
  async createTimesheet(@Body() createDto: CreateTimesheetDto) {
    return this.timesheetsService.createTimesheet(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a timesheet' })
  @ApiResponse({ status: 200, description: 'Timesheet updated successfully' })
  async updateTimesheet(@Param('id') id: string, @Body() updateDto: UpdateTimesheetDto) {
    return this.timesheetsService.updateTimesheet(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a timesheet' })
  @ApiResponse({ status: 200, description: 'Timesheet deleted successfully' })
  async deleteTimesheet(@Param('id') id: string) {
    return this.timesheetsService.deleteTimesheet(id);
  }
}
