import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductRegistrationService } from '../services/product-registration.service';
import { CreateProductRegistrationDto, UpdateProductRegistrationDto } from '../dto/product-registration.dto';

@ApiTags('product-registration')
@Controller('product-registration')
export class ProductRegistrationController {
  constructor(private readonly productRegistrationService: ProductRegistrationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all product registrations' })
  @ApiResponse({ status: 200, description: 'Product registrations retrieved successfully' })
  async getProductRegistrations(@Query() query: any) {
    return this.productRegistrationService.getProductRegistrations(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product registration' })
  @ApiResponse({ status: 201, description: 'Product registration created successfully' })
  async createProductRegistration(@Body() createDto: CreateProductRegistrationDto) {
    return this.productRegistrationService.createProductRegistration(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product registration' })
  @ApiResponse({ status: 200, description: 'Product registration updated successfully' })
  async updateProductRegistration(@Param('id') id: string, @Body() updateDto: UpdateProductRegistrationDto) {
    return this.productRegistrationService.updateProductRegistration(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product registration' })
  @ApiResponse({ status: 200, description: 'Product registration deleted successfully' })
  async deleteProductRegistration(@Param('id') id: string) {
    return this.productRegistrationService.deleteProductRegistration(id);
  }
}
