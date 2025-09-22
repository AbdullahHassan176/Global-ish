import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ShipmentLocation {
  id: string;
  shipmentNumber: string;
  containerNumber?: string;
  billOfLading?: string;
  latitude: number;
  longitude: number;
  location: string;
  status: string;
  carrier: string;
  vesselName?: string;
  voyageNumber?: string;
  eta?: Date;
  lastUpdated: Date;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapSearchResult {
  shipments: ShipmentLocation[];
  total: number;
  bounds?: MapBounds;
}

@Injectable()
export class MapService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all active shipments with their current locations
   */
  async getActiveShipmentLocations(): Promise<ShipmentLocation[]> {
    const shipments = await this.prisma.shipment.findMany({
      where: {
        status: {
          in: ['PLANNED', 'IN_TRANSIT', 'CUSTOMS'],
        },
      },
      include: {
        containers: true,
        milestones: {
          where: {
            milestoneType: {
              in: ['ARRIVAL', 'CUSTOMS', 'DELIVERY'],
            },
          },
          orderBy: {
            plannedDate: 'desc',
          },
          take: 1,
        },
        carrierEvents: {
          orderBy: {
            eventDate: 'desc',
          },
          take: 1,
        },
      },
    });

    return shipments.map(shipment => this.mapShipmentToLocation(shipment));
  }

  /**
   * Search shipments by container number, bill of lading, or invoice number
   */
  async searchShipments(
    query: string,
    bounds?: MapBounds,
    limit: number = 50
  ): Promise<MapSearchResult> {
    const where: any = {
      OR: [
        { containerNumber: { contains: query, mode: 'insensitive' } },
        { billOfLading: { contains: query, mode: 'insensitive' } },
        { bookingNumber: { contains: query, mode: 'insensitive' } },
        { shipmentNumber: { contains: query, mode: 'insensitive' } },
      ],
    };

    // Add status filter to only show active shipments
    where.status = {
      in: ['PLANNED', 'IN_TRANSIT', 'CUSTOMS'],
    };

    const shipments = await this.prisma.shipment.findMany({
      where,
      include: {
        containers: true,
        milestones: {
          where: {
            milestoneType: {
              in: ['ARRIVAL', 'CUSTOMS', 'DELIVERY'],
            },
          },
          orderBy: {
            plannedDate: 'desc',
          },
          take: 1,
        },
        carrierEvents: {
          orderBy: {
            eventDate: 'desc',
          },
          take: 1,
        },
        invoices: {
          where: {
            invoiceNumber: { contains: query, mode: 'insensitive' },
          },
        },
      },
      take: limit,
    });

    const locations = shipments.map(shipment => this.mapShipmentToLocation(shipment));

    // Calculate bounds if not provided
    let calculatedBounds: MapBounds | undefined;
    if (locations.length > 0 && !bounds) {
      calculatedBounds = this.calculateBounds(locations);
    }

    return {
      shipments: locations,
      total: locations.length,
      bounds: bounds || calculatedBounds,
    };
  }

  /**
   * Get shipments within specific geographic bounds
   */
  async getShipmentsInBounds(bounds: MapBounds): Promise<ShipmentLocation[]> {
    // This is a simplified implementation
    // In a real application, you would use PostGIS or similar for spatial queries
    const allLocations = await this.getActiveShipmentLocations();
    
    return allLocations.filter(location => 
      location.latitude >= bounds.south &&
      location.latitude <= bounds.north &&
      location.longitude >= bounds.west &&
      location.longitude <= bounds.east
    );
  }

  /**
   * Get shipment tracking history for map visualization
   */
  async getShipmentTrackingHistory(shipmentId: string): Promise<Array<{
    latitude: number;
    longitude: number;
    location: string;
    timestamp: Date;
    eventType: string;
    description?: string;
  }>> {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        carrierEvents: {
          orderBy: {
            eventDate: 'asc',
          },
        },
        milestones: {
          orderBy: {
            plannedDate: 'asc',
          },
        },
      },
    });

    if (!shipment) {
      return [];
    }

    const trackingHistory = [];

    // Add origin location
    if (shipment.origin) {
      const originCoords = this.getLocationCoordinates(shipment.origin);
      if (originCoords) {
        trackingHistory.push({
          latitude: originCoords.latitude,
          longitude: originCoords.longitude,
          location: shipment.origin,
          timestamp: shipment.createdAt,
          eventType: 'ORIGIN',
          description: 'Shipment origin',
        });
      }
    }

    // Add carrier events
    for (const event of shipment.carrierEvents) {
      if (event.location) {
        const coords = this.getLocationCoordinates(event.location);
        if (coords) {
          trackingHistory.push({
            latitude: coords.latitude,
            longitude: coords.longitude,
            location: event.location,
            timestamp: event.eventDate,
            eventType: event.eventType,
            description: event.description,
          });
        }
      }
    }

    // Add destination location
    if (shipment.destination) {
      const destCoords = this.getLocationCoordinates(shipment.destination);
      if (destCoords) {
        trackingHistory.push({
          latitude: destCoords.latitude,
          longitude: destCoords.longitude,
          location: shipment.destination,
          timestamp: shipment.eta || new Date(),
          eventType: 'DESTINATION',
          description: 'Shipment destination',
        });
      }
    }

    return trackingHistory;
  }

  /**
   * Get map statistics
   */
  async getMapStatistics(): Promise<{
    totalActiveShipments: number;
    shipmentsByStatus: Record<string, number>;
    shipmentsByCarrier: Record<string, number>;
    averageTransitTime: number;
  }> {
    const activeShipments = await this.prisma.shipment.findMany({
      where: {
        status: {
          in: ['PLANNED', 'IN_TRANSIT', 'CUSTOMS'],
        },
      },
    });

    const shipmentsByStatus = activeShipments.reduce((acc, shipment) => {
      acc[shipment.status] = (acc[shipment.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const shipmentsByCarrier = activeShipments.reduce((acc, shipment) => {
      acc[shipment.carrier] = (acc[shipment.carrier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate average transit time for completed shipments
    const completedShipments = await this.prisma.shipment.findMany({
      where: {
        status: 'DELIVERED',
        actualArrival: { not: null },
        actualDeparture: { not: null },
      },
      select: {
        actualDeparture: true,
        actualArrival: true,
      },
    });

    const totalTransitTime = completedShipments.reduce((sum, shipment) => {
      if (shipment.actualDeparture && shipment.actualArrival) {
        const transitTime = shipment.actualArrival.getTime() - shipment.actualDeparture.getTime();
        return sum + transitTime;
      }
      return sum;
    }, 0);

    const averageTransitTime = completedShipments.length > 0 
      ? Math.round(totalTransitTime / completedShipments.length / (1000 * 60 * 60 * 24)) // Convert to days
      : 0;

    return {
      totalActiveShipments: activeShipments.length,
      shipmentsByStatus,
      shipmentsByCarrier,
      averageTransitTime,
    };
  }

  /**
   * Map shipment data to location format
   */
  private mapShipmentToLocation(shipment: any): ShipmentLocation {
    // Get current location from latest milestone or carrier event
    let currentLocation = shipment.destination; // Default to destination
    let coordinates = this.getLocationCoordinates(currentLocation);

    // Try to get more specific location from milestones or events
    if (shipment.milestones && shipment.milestones.length > 0) {
      const latestMilestone = shipment.milestones[0];
      if (latestMilestone.location) {
        currentLocation = latestMilestone.location;
        coordinates = this.getLocationCoordinates(currentLocation);
      }
    }

    if (shipment.carrierEvents && shipment.carrierEvents.length > 0) {
      const latestEvent = shipment.carrierEvents[0];
      if (latestEvent.location) {
        currentLocation = latestEvent.location;
        coordinates = this.getLocationCoordinates(currentLocation);
      }
    }

    // Default coordinates if not found
    if (!coordinates) {
      coordinates = { latitude: 0, longitude: 0 };
    }

    return {
      id: shipment.id,
      shipmentNumber: shipment.shipmentNumber,
      containerNumber: shipment.containerNumber,
      billOfLading: shipment.billOfLading,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      location: currentLocation,
      status: shipment.status,
      carrier: shipment.carrier,
      vesselName: shipment.vesselName,
      voyageNumber: shipment.voyageNumber,
      eta: shipment.eta,
      lastUpdated: shipment.updatedAt,
    };
  }

  /**
   * Get coordinates for a location (simplified implementation)
   * In a real application, you would use a geocoding service
   */
  private getLocationCoordinates(location: string): { latitude: number; longitude: number } | null {
    // Simplified location mapping - in production, use a proper geocoding service
    const locationMap: Record<string, { latitude: number; longitude: number }> = {
      'Shanghai': { latitude: 31.2304, longitude: 121.4737 },
      'Los Angeles': { latitude: 34.0522, longitude: -118.2437 },
      'New York': { latitude: 40.7128, longitude: -74.0060 },
      'Hamburg': { latitude: 53.5511, longitude: 9.9937 },
      'Rotterdam': { latitude: 51.9244, longitude: 4.4777 },
      'Singapore': { latitude: 1.3521, longitude: 103.8198 },
      'Dubai': { latitude: 25.2048, longitude: 55.2708 },
      'Hong Kong': { latitude: 22.3193, longitude: 114.1694 },
      'Tokyo': { latitude: 35.6762, longitude: 139.6503 },
      'Busan': { latitude: 35.1796, longitude: 129.0756 },
      'Long Beach': { latitude: 33.7701, longitude: -118.1937 },
      'Oakland': { latitude: 37.8044, longitude: -122.2712 },
      'Seattle': { latitude: 47.6062, longitude: -122.3321 },
      'Vancouver': { latitude: 49.2827, longitude: -123.1207 },
      'Miami': { latitude: 25.7617, longitude: -80.1918 },
      'Savannah': { latitude: 32.0835, longitude: -81.0998 },
      'Charleston': { latitude: 32.7765, longitude: -79.9311 },
      'Norfolk': { latitude: 36.8468, longitude: -76.2852 },
      'Baltimore': { latitude: 39.2904, longitude: -76.6122 },
      'Philadelphia': { latitude: 39.9526, longitude: -75.1652 },
    };

    // Try exact match first
    if (locationMap[location]) {
      return locationMap[location];
    }

    // Try partial match
    for (const [key, coords] of Object.entries(locationMap)) {
      if (location.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(location.toLowerCase())) {
        return coords;
      }
    }

    return null;
  }

  /**
   * Calculate bounds from a list of locations
   */
  private calculateBounds(locations: ShipmentLocation[]): MapBounds {
    if (locations.length === 0) {
      return { north: 0, south: 0, east: 0, west: 0 };
    }

    let north = locations[0].latitude;
    let south = locations[0].latitude;
    let east = locations[0].longitude;
    let west = locations[0].longitude;

    for (const location of locations) {
      north = Math.max(north, location.latitude);
      south = Math.min(south, location.latitude);
      east = Math.max(east, location.longitude);
      west = Math.min(west, location.longitude);
    }

    // Add some padding
    const latPadding = (north - south) * 0.1;
    const lngPadding = (east - west) * 0.1;

    return {
      north: north + latPadding,
      south: south - latPadding,
      east: east + lngPadding,
      west: west - lngPadding,
    };
  }
}
