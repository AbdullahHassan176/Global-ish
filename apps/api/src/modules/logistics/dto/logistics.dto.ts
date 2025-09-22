import { IsString, IsOptional, IsEnum, IsDateString, IsBoolean, IsNumber, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

// ===== SHIPMENT DTOs =====

export class CreateShipmentDto {
  @IsString()
  shipmentNumber: string;

  @IsOptional()
  @IsString()
  billOfLading?: string;

  @IsOptional()
  @IsString()
  bookingNumber?: string;

  @IsOptional()
  @IsString()
  containerNumber?: string;

  @IsEnum(['MAERSK', 'MSC', 'CMA_CGM', 'DHL', 'FEDEX'])
  carrier: string;

  @IsString()
  origin: string;

  @IsString()
  destination: string;

  @IsOptional()
  @IsString()
  originPort?: string;

  @IsOptional()
  @IsString()
  destinationPort?: string;

  @IsOptional()
  @IsString()
  vesselName?: string;

  @IsOptional()
  @IsString()
  voyageNumber?: string;

  @IsOptional()
  @IsDateString()
  etd?: string;

  @IsOptional()
  @IsDateString()
  eta?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  clientId?: string;
}

export class UpdateShipmentDto {
  @IsOptional()
  @IsString()
  billOfLading?: string;

  @IsOptional()
  @IsString()
  bookingNumber?: string;

  @IsOptional()
  @IsString()
  containerNumber?: string;

  @IsOptional()
  @IsEnum(['MAERSK', 'MSC', 'CMA_CGM', 'DHL', 'FEDEX'])
  carrier?: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsString()
  originPort?: string;

  @IsOptional()
  @IsString()
  destinationPort?: string;

  @IsOptional()
  @IsString()
  vesselName?: string;

  @IsOptional()
  @IsString()
  voyageNumber?: string;

  @IsOptional()
  @IsDateString()
  etd?: string;

  @IsOptional()
  @IsDateString()
  eta?: string;

  @IsOptional()
  @IsDateString()
  actualDeparture?: string;

  @IsOptional()
  @IsDateString()
  actualArrival?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  clientId?: string;
}

// ===== CONTAINER DTOs =====

export class CreateContainerDto {
  @IsString()
  containerNumber: string;

  @IsString()
  shipmentId: string;

  @IsEnum(['20FT', '40FT', '40FT_HC', '45FT_HC', 'REEFER', 'TANK', 'FLAT_RACK', 'OPEN_TOP'])
  containerType: string;

  @IsOptional()
  @IsString()
  sealNumber?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  volume?: number;

  @IsOptional()
  @IsString()
  cargoDescription?: string;

  @IsOptional()
  @IsString()
  customsStatus?: string;
}

export class UpdateContainerDto {
  @IsOptional()
  @IsString()
  sealNumber?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  volume?: number;

  @IsOptional()
  @IsString()
  cargoDescription?: string;

  @IsOptional()
  @IsString()
  customsStatus?: string;
}

// ===== MILESTONE DTOs =====

export class CreateMilestoneDto {
  @IsString()
  shipmentId: string;

  @IsEnum(['ETD', 'ETA', 'DEPARTURE', 'TRANSSHIPMENT', 'ARRIVAL', 'CUSTOMS', 'DELIVERY'])
  milestoneType: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsDateString()
  plannedDate?: string;

  @IsOptional()
  @IsDateString()
  actualDate?: string;

  @IsOptional()
  @IsString()
  vesselName?: string;

  @IsOptional()
  @IsString()
  voyageNumber?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateMilestoneDto {
  @IsOptional()
  @IsDateString()
  plannedDate?: string;

  @IsOptional()
  @IsDateString()
  actualDate?: string;

  @IsOptional()
  @IsString()
  vesselName?: string;

  @IsOptional()
  @IsString()
  voyageNumber?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

// ===== CARRIER EVENT DTOs =====

export class CreateCarrierEventDto {
  @IsString()
  shipmentId: string;

  @IsString()
  eventType: string;

  @IsDateString()
  eventDate: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  vesselName?: string;

  @IsOptional()
  @IsString()
  voyageNumber?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

// ===== COST ITEM DTOs =====

export class CreateCostItemDto {
  @IsString()
  shipmentId: string;

  @IsEnum(['FREIGHT', 'CUSTOMS', 'WAREHOUSE', 'TRUCKING', 'DOCUMENTATION', 'INSURANCE', 'OTHER'])
  costType: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  vendor?: string;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  isBillable?: boolean;

  @IsOptional()
  @IsString()
  projectId?: string;
}

export class UpdateCostItemDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  vendor?: string;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  isBillable?: boolean;

  @IsOptional()
  @IsString()
  projectId?: string;
}

// ===== INVOICE DTOs =====

export class CreateInvoiceDto {
  @IsString()
  shipmentId: string;

  @IsString()
  invoiceNumber: string;

  @IsDateString()
  invoiceDate: string;

  @IsDateString()
  dueDate: string;

  @IsNumber()
  totalAmount: number;

  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  costItemIds?: string[];
}

export class UpdateInvoiceDto {
  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsDateString()
  invoiceDate?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

// ===== CARRIER INTEGRATION DTOs =====

export class CreateCarrierIntegrationDto {
  @IsEnum(['MAERSK', 'MSC', 'CMA_CGM', 'DHL', 'FEDEX'])
  carrier: string;

  @IsBoolean()
  enabled: boolean;

  @IsObject()
  credentials: Record<string, any>;

  @IsNumber()
  pollingInterval: number;

  @IsBoolean()
  webhookEnabled: boolean;

  @IsNumber()
  rateLimitPerMinute: number;
}

export class UpdateCarrierIntegrationDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsObject()
  credentials?: Record<string, any>;

  @IsOptional()
  @IsNumber()
  pollingInterval?: number;

  @IsOptional()
  @IsBoolean()
  webhookEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  rateLimitPerMinute?: number;
}

// ===== LOGISTICS ALERT DTOs =====

export class CreateLogisticsAlertDto {
  @IsString()
  shipmentId: string;

  @IsEnum(['DELAY', 'ETA_CHANGE', 'FREE_DAY_EXPIRY', 'CUSTOMS_ISSUE', 'VESSEL_CHANGE', 'OTHER'])
  alertType: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  severity: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}

export class UpdateLogisticsAlertDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  severity?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsBoolean()
  isResolved?: boolean;

  @IsOptional()
  @IsString()
  resolvedBy?: string;

  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}

// ===== TRACKING DTOs =====

export class TrackShipmentDto {
  @IsString()
  identifier: string; // container number, bill of lading, or tracking number

  @IsOptional()
  @IsEnum(['MAERSK', 'MSC', 'CMA_CGM', 'DHL', 'FEDEX'])
  carrier?: string;
}

export class BulkTrackDto {
  @IsArray()
  @IsString({ each: true })
  identifiers: string[];

  @IsOptional()
  @IsEnum(['MAERSK', 'MSC', 'CMA_CGM', 'DHL', 'FEDEX'])
  carrier?: string;
}