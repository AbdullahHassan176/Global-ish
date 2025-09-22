import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CarrierAdapterFactory, CarrierType } from '../adapters/carrier-adapter.factory';
import { 
  CreateCarrierIntegrationDto, 
  UpdateCarrierIntegrationDto 
} from '../dto/logistics.dto';
import { CarrierIntegration } from '@prisma/client';

@Injectable()
export class CarrierIntegrationService {
  private readonly logger = new Logger(CarrierIntegrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly carrierAdapterFactory: CarrierAdapterFactory,
  ) {}

  async createIntegration(createDto: CreateCarrierIntegrationDto): Promise<CarrierIntegration> {
    // Validate credentials before saving
    const adapter = this.carrierAdapterFactory.getAdapter(createDto.carrier as CarrierType);
    const isValid = await adapter.validateCredentials(createDto.credentials);
    
    if (!isValid) {
      throw new Error(`Invalid credentials for carrier: ${createDto.carrier}`);
    }

    return this.prisma.carrierIntegration.create({
      data: createDto,
    });
  }

  async findAllIntegrations(): Promise<CarrierIntegration[]> {
    return this.prisma.carrierIntegration.findMany({
      orderBy: { carrier: 'asc' },
    });
  }

  async findIntegrationById(id: string): Promise<CarrierIntegration> {
    const integration = await this.prisma.carrierIntegration.findUnique({
      where: { id },
    });

    if (!integration) {
      throw new Error(`Carrier integration with ID ${id} not found`);
    }

    return integration;
  }

  async findIntegrationByCarrier(carrier: CarrierType): Promise<CarrierIntegration | null> {
    return this.prisma.carrierIntegration.findFirst({
      where: { carrier, enabled: true },
    });
  }

  async updateIntegration(id: string, updateDto: UpdateCarrierIntegrationDto): Promise<CarrierIntegration> {
    const existingIntegration = await this.findIntegrationById(id);

    // If credentials are being updated, validate them
    if (updateDto.credentials) {
      const adapter = this.carrierAdapterFactory.getAdapter(existingIntegration.carrier as CarrierType);
      const isValid = await adapter.validateCredentials(updateDto.credentials);
      
      if (!isValid) {
        throw new Error(`Invalid credentials for carrier: ${existingIntegration.carrier}`);
      }
    }

    return this.prisma.carrierIntegration.update({
      where: { id },
      data: updateDto,
    });
  }

  async deleteIntegration(id: string): Promise<void> {
    const existingIntegration = await this.findIntegrationById(id);
    
    await this.prisma.carrierIntegration.delete({
      where: { id },
    });
  }

  async testIntegration(carrier: CarrierType): Promise<{ success: boolean; message: string }> {
    try {
      const integration = await this.findIntegrationByCarrier(carrier);
      
      if (!integration) {
        return {
          success: false,
          message: `No integration found for carrier: ${carrier}`,
        };
      }

      const adapter = this.carrierAdapterFactory.getAdapter(carrier);
      const isValid = await adapter.validateCredentials(integration.credentials);
      
      if (isValid) {
        return {
          success: true,
          message: `Integration for ${carrier} is working correctly`,
        };
      } else {
        return {
          success: false,
          message: `Invalid credentials for carrier: ${carrier}`,
        };
      }
    } catch (error) {
      this.logger.error(`Error testing integration for ${carrier}:`, error);
      return {
        success: false,
        message: `Error testing integration: ${error.message}`,
      };
    }
  }

  async getSupportedCarriers(): Promise<{ carrier: CarrierType; displayName: string; type: 'OCEAN' | 'EXPRESS' }[]> {
    const supportedCarriers = this.carrierAdapterFactory.getSupportedCarriers();
    
    return supportedCarriers.map(carrier => ({
      carrier,
      displayName: this.carrierAdapterFactory.getCarrierDisplayName(carrier),
      type: this.carrierAdapterFactory.getCarrierType(carrier),
    }));
  }

  async getIntegrationStatus(): Promise<{ carrier: CarrierType; configured: boolean; enabled: boolean; lastTested?: Date }[]> {
    const supportedCarriers = this.carrierAdapterFactory.getSupportedCarriers();
    const integrations = await this.prisma.carrierIntegration.findMany();
    
    return supportedCarriers.map(carrier => {
      const integration = integrations.find(i => i.carrier === carrier);
      
      return {
        carrier,
        configured: !!integration,
        enabled: integration?.enabled || false,
        lastTested: integration?.updatedAt,
      };
    });
  }

  async enableIntegration(id: string): Promise<CarrierIntegration> {
    const integration = await this.findIntegrationById(id);
    
    // Test the integration before enabling
    const testResult = await this.testIntegration(integration.carrier as CarrierType);
    
    if (!testResult.success) {
      throw new Error(`Cannot enable integration: ${testResult.message}`);
    }

    return this.prisma.carrierIntegration.update({
      where: { id },
      data: { enabled: true },
    });
  }

  async disableIntegration(id: string): Promise<CarrierIntegration> {
    const integration = await this.findIntegrationById(id);
    
    return this.prisma.carrierIntegration.update({
      where: { id },
      data: { enabled: false },
    });
  }

  async getIntegrationMetrics(): Promise<{
    totalIntegrations: number;
    enabledIntegrations: number;
    oceanCarriers: number;
    expressCarriers: number;
  }> {
    const integrations = await this.prisma.carrierIntegration.findMany();
    const supportedCarriers = this.carrierAdapterFactory.getSupportedCarriers();
    
    const enabledIntegrations = integrations.filter(i => i.enabled).length;
    const oceanCarriers = integrations.filter(i => 
      this.carrierAdapterFactory.getCarrierType(i.carrier as CarrierType) === 'OCEAN'
    ).length;
    const expressCarriers = integrations.filter(i => 
      this.carrierAdapterFactory.getCarrierType(i.carrier as CarrierType) === 'EXPRESS'
    ).length;

    return {
      totalIntegrations: integrations.length,
      enabledIntegrations,
      oceanCarriers,
      expressCarriers,
    };
  }
}