import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ComplianceService } from '../services/compliance.service';
import { CreateComplianceRecordDto, UpdateComplianceRecordDto } from '../dto/compliance.dto';

@ApiTags('compliance')
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all compliance records' })
  @ApiResponse({ status: 200, description: 'Compliance records retrieved successfully' })
  async getComplianceRecords(@Query() query: any) {
    return this.complianceService.getComplianceRecords(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new compliance record' })
  @ApiResponse({ status: 201, description: 'Compliance record created successfully' })
  async createComplianceRecord(@Body() createDto: CreateComplianceRecordDto) {
    return this.complianceService.createComplianceRecord(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a compliance record' })
  @ApiResponse({ status: 200, description: 'Compliance record updated successfully' })
  async updateComplianceRecord(@Param('id') id: string, @Body() updateDto: UpdateComplianceRecordDto) {
    return this.complianceService.updateComplianceRecord(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a compliance record' })
  @ApiResponse({ status: 200, description: 'Compliance record deleted successfully' })
  async deleteComplianceRecord(@Param('id') id: string) {
    return this.complianceService.deleteComplianceRecord(id);
  }
}
