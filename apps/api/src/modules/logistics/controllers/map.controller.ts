import { 
  Controller, 
  Get, 
  Query,
  Param,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../packages/auth/src/guards/jwt-auth.guard';
import { PolicyGuard } from '../../../packages/auth/src/guards/policy.guard';
import { RequirePermission } from '../../../packages/auth/src/decorators/require-permission.decorator';
import { MapService, MapBounds } from '../services/map.service';

@Controller('logistics/map')
@UseGuards(JwtAuthGuard, PolicyGuard)
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('shipments')
  @RequirePermission('logistics:map:read')
  async getActiveShipmentLocations() {
    return this.mapService.getActiveShipmentLocations();
  }

  @Get('search')
  @RequirePermission('logistics:map:read')
  async searchShipments(
    @Query('q') query: string,
    @Query('north') north?: string,
    @Query('south') south?: string,
    @Query('east') east?: string,
    @Query('west') west?: string,
    @Query('limit') limit?: string,
  ) {
    if (!query) {
      throw new Error('Search query is required');
    }

    let bounds: MapBounds | undefined;
    if (north && south && east && west) {
      bounds = {
        north: parseFloat(north),
        south: parseFloat(south),
        east: parseFloat(east),
        west: parseFloat(west),
      };
    }

    const limitNumber = limit ? parseInt(limit, 10) : 50;

    return this.mapService.searchShipments(query, bounds, limitNumber);
  }

  @Get('bounds')
  @RequirePermission('logistics:map:read')
  async getShipmentsInBounds(
    @Query('north') north: string,
    @Query('south') south: string,
    @Query('east') east: string,
    @Query('west') west: string,
  ) {
    const bounds: MapBounds = {
      north: parseFloat(north),
      south: parseFloat(south),
      east: parseFloat(east),
      west: parseFloat(west),
    };

    return this.mapService.getShipmentsInBounds(bounds);
  }

  @Get('shipment/:shipmentId/tracking')
  @RequirePermission('logistics:map:read')
  async getShipmentTrackingHistory(@Param('shipmentId') shipmentId: string) {
    return this.mapService.getShipmentTrackingHistory(shipmentId);
  }

  @Get('statistics')
  @RequirePermission('logistics:map:read')
  async getMapStatistics() {
    return this.mapService.getMapStatistics();
  }
}
