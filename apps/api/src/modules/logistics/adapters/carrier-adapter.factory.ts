import { Injectable } from '@nestjs/common';
import { CarrierAdapter, CarrierCredentials } from '../interfaces/carrier-adapter.interface';
import { MaerskAdapter } from './maersk.adapter';
import { MscAdapter } from './msc.adapter';
import { CmaCgmAdapter } from './cma-cgm.adapter';
import { DhlAdapter } from './dhl.adapter';
import { FedexAdapter } from './fedex.adapter';

export type CarrierType = 'MAERSK' | 'MSC' | 'CMA_CGM' | 'DHL' | 'FEDEX';

@Injectable()
export class CarrierAdapterFactory {
  constructor(
    private readonly maerskAdapter: MaerskAdapter,
    private readonly mscAdapter: MscAdapter,
    private readonly cmaCgmAdapter: CmaCgmAdapter,
    private readonly dhlAdapter: DhlAdapter,
    private readonly fedexAdapter: FedexAdapter,
  ) {}

  getAdapter(carrier: CarrierType): CarrierAdapter {
    switch (carrier) {
      case 'MAERSK':
        return this.maerskAdapter;
      case 'MSC':
        return this.mscAdapter;
      case 'CMA_CGM':
        return this.cmaCgmAdapter;
      case 'DHL':
        return this.dhlAdapter;
      case 'FEDEX':
        return this.fedexAdapter;
      default:
        throw new Error(`Unsupported carrier: ${carrier}`);
    }
  }

  async validateCarrierCredentials(carrier: CarrierType, credentials: CarrierCredentials): Promise<boolean> {
    try {
      const adapter = this.getAdapter(carrier);
      return await adapter.validateCredentials(credentials);
    } catch (error) {
      return false;
    }
  }

  getSupportedCarriers(): CarrierType[] {
    return ['MAERSK', 'MSC', 'CMA_CGM', 'DHL', 'FEDEX'];
  }

  isCarrierSupported(carrier: string): carrier is CarrierType {
    return this.getSupportedCarriers().includes(carrier as CarrierType);
  }

  getCarrierDisplayName(carrier: CarrierType): string {
    const names: Record<CarrierType, string> = {
      'MAERSK': 'Maersk Line',
      'MSC': 'Mediterranean Shipping Company',
      'CMA_CGM': 'CMA CGM',
      'DHL': 'DHL Express',
      'FEDEX': 'FedEx',
    };
    return names[carrier];
  }

  getCarrierType(carrier: CarrierType): 'OCEAN' | 'EXPRESS' {
    const oceanCarriers: CarrierType[] = ['MAERSK', 'MSC', 'CMA_CGM'];
    return oceanCarriers.includes(carrier) ? 'OCEAN' : 'EXPRESS';
  }
}
