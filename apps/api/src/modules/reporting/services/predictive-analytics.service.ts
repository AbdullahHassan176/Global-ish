import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { 
  PredictiveAnalyticsService,
  ETAPrediction,
  HSCodeSuggestion,
  DemurrageRisk,
  UtilizationForecast
} from '../interfaces/reporting.interface';
import { ModelType, KPICategory } from '@prisma/client';

@Injectable()
export class PredictiveAnalyticsService implements PredictiveAnalyticsService {
  private readonly logger = new Logger(PredictiveAnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Predict ETA for a shipment milestone using historical data
   */
  async predictETA(shipmentId: string, milestoneType: string): Promise<ETAPrediction> {
    this.logger.log(`Predicting ETA for shipment ${shipmentId}, milestone ${milestoneType}`);

    // Get historical data for similar shipments
    const historicalData = await this.getHistoricalMilestoneData(milestoneType);
    
    // Get current shipment data
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        milestones: {
          where: { type: milestoneType },
          orderBy: { scheduledDate: 'asc' },
        },
        carrier: true,
        route: true,
      },
    });

    if (!shipment) {
      throw new Error(`Shipment ${shipmentId} not found`);
    }

    // Calculate base prediction from historical average
    const historicalAverage = this.calculateHistoricalAverage(historicalData);
    
    // Apply adjustment factors
    const factors = await this.calculateAdjustmentFactors(shipment, milestoneType);
    const adjustedPrediction = this.applyAdjustmentFactors(historicalAverage, factors);
    
    // Calculate confidence based on data quality and factors
    const confidence = this.calculateConfidence(historicalData, factors);
    
    // Calculate historical delta
    const historicalDelta = adjustedPrediction - historicalAverage;

    const prediction: ETAPrediction = {
      shipmentId,
      milestoneType,
      predictedDate: new Date(adjustedPrediction),
      confidence,
      historicalDelta,
      factors: {
        weather: factors.weather,
        portCongestion: factors.portCongestion,
        carrierPerformance: factors.carrierPerformance,
        routeEfficiency: factors.routeEfficiency,
      },
    };

    // Store prediction in database
    await this.storeETAPrediction(prediction);

    return prediction;
  }

  /**
   * Suggest HS codes for a product using rule-based matching
   */
  async suggestHSCode(productName: string, description: string): Promise<HSCodeSuggestion[]> {
    this.logger.log(`Suggesting HS codes for product: ${productName}`);

    // Get historical HS code data
    const historicalCodes = await this.getHistoricalHSCodes();
    
    // Rule-based matching
    const suggestions = this.matchHSCodes(productName, description, historicalCodes);
    
    // Calculate confidence scores
    const scoredSuggestions = suggestions.map(suggestion => ({
      ...suggestion,
      confidence: this.calculateHSCodeConfidence(suggestion, productName, description),
    }));

    // Sort by confidence
    const sortedSuggestions = scoredSuggestions.sort((a, b) => b.confidence - a.confidence);

    // Store suggestions in database
    await this.storeHSCodeSuggestions(productName, description, sortedSuggestions);

    return sortedSuggestions.slice(0, 5); // Return top 5 suggestions
  }

  /**
   * Calculate demurrage risk for a shipment
   */
  async calculateDemurrageRisk(shipmentId: string): Promise<DemurrageRisk> {
    this.logger.log(`Calculating demurrage risk for shipment ${shipmentId}`);

    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        milestones: true,
        carrier: true,
        route: true,
        costItems: {
          where: { category: 'DEMURRAGE' },
        },
      },
    });

    if (!shipment) {
      throw new Error(`Shipment ${shipmentId} not found`);
    }

    // Calculate risk factors
    const factors = await this.calculateDemurrageFactors(shipment);
    
    // Calculate risk score (0-100)
    const riskScore = this.calculateRiskScore(factors);
    
    // Determine risk level
    const riskLevel = this.determineRiskLevel(riskScore);
    
    // Estimate demurrage days and cost
    const estimatedDemurrageDays = this.estimateDemurrageDays(factors);
    const estimatedCost = this.estimateDemurrageCost(estimatedDemurrageDays, shipment);
    
    // Generate recommendations
    const recommendations = this.generateDemurrageRecommendations(factors, riskLevel);

    return {
      shipmentId,
      riskLevel,
      riskScore,
      factors: {
        portCongestion: factors.portCongestion,
        documentationDelays: factors.documentationDelays,
        weatherConditions: factors.weatherConditions,
        carrierReliability: factors.carrierReliability,
      },
      estimatedDemurrageDays,
      estimatedCost,
      recommendations,
    };
  }

  /**
   * Forecast utilization for a given period
   */
  async forecastUtilization(period: string): Promise<UtilizationForecast> {
    this.logger.log(`Forecasting utilization for period: ${period}`);

    // Get historical utilization data
    const historicalData = await this.getHistoricalUtilizationData(period);
    
    // Calculate trend factors
    const factors = await this.calculateUtilizationFactors(period);
    
    // Generate forecast
    const predictedUtilization = this.calculateUtilizationForecast(historicalData, factors);
    
    // Calculate confidence
    const confidence = this.calculateUtilizationConfidence(historicalData, factors);
    
    // Generate scenarios
    const scenarios = this.generateUtilizationScenarios(predictedUtilization, factors);

    return {
      period,
      predictedUtilization,
      confidence,
      factors: {
        historicalTrend: factors.historicalTrend,
        seasonalAdjustment: factors.seasonalAdjustment,
        projectPipeline: factors.projectPipeline,
        resourceAvailability: factors.resourceAvailability,
      },
      scenarios: {
        optimistic: scenarios.optimistic,
        realistic: scenarios.realistic,
        pessimistic: scenarios.pessimistic,
      },
    };
  }

  // ===== PRIVATE HELPER METHODS =====

  private async getHistoricalMilestoneData(milestoneType: string): Promise<any[]> {
    // Get historical milestone data for the same type
    const milestones = await this.prisma.milestone.findMany({
      where: {
        type: milestoneType,
        actualDate: { not: null },
        scheduledDate: { not: null },
      },
      include: {
        shipment: {
          include: {
            carrier: true,
            route: true,
          },
        },
      },
      orderBy: { actualDate: 'desc' },
      take: 100, // Last 100 milestones
    });

    return milestones.map(milestone => ({
      actualDate: milestone.actualDate,
      scheduledDate: milestone.scheduledDate,
      delay: milestone.actualDate!.getTime() - milestone.scheduledDate!.getTime(),
      carrier: milestone.shipment.carrier,
      route: milestone.shipment.route,
    }));
  }

  private calculateHistoricalAverage(historicalData: any[]): number {
    if (historicalData.length === 0) {
      return Date.now() + (7 * 24 * 60 * 60 * 1000); // Default 7 days from now
    }

    const totalDelay = historicalData.reduce((sum, data) => sum + data.delay, 0);
    const averageDelay = totalDelay / historicalData.length;
    
    return Date.now() + averageDelay;
  }

  private async calculateAdjustmentFactors(shipment: any, milestoneType: string): Promise<any> {
    // Weather factor (simplified - in real implementation, integrate with weather API)
    const weather = this.getWeatherFactor(shipment.route?.destinationPort);
    
    // Port congestion factor (simplified)
    const portCongestion = this.getPortCongestionFactor(shipment.route?.destinationPort);
    
    // Carrier performance factor
    const carrierPerformance = await this.getCarrierPerformanceFactor(shipment.carrier?.id);
    
    // Route efficiency factor
    const routeEfficiency = this.getRouteEfficiencyFactor(shipment.route);

    return {
      weather,
      portCongestion,
      carrierPerformance,
      routeEfficiency,
    };
  }

  private applyAdjustmentFactors(basePrediction: number, factors: any): number {
    // Apply adjustment factors to base prediction
    let adjustment = 0;
    
    // Weather adjustment (0-2 days)
    adjustment += factors.weather * 2 * 24 * 60 * 60 * 1000;
    
    // Port congestion adjustment (0-5 days)
    adjustment += factors.portCongestion * 5 * 24 * 60 * 60 * 1000;
    
    // Carrier performance adjustment (-1 to 1 days)
    adjustment += (factors.carrierPerformance - 0.5) * 2 * 24 * 60 * 60 * 1000;
    
    // Route efficiency adjustment (-0.5 to 0.5 days)
    adjustment += (factors.routeEfficiency - 0.5) * 24 * 60 * 60 * 1000;

    return basePrediction + adjustment;
  }

  private calculateConfidence(historicalData: any[], factors: any): number {
    // Base confidence from data quality
    let confidence = Math.min(0.9, historicalData.length / 50); // Max 90% from data quality
    
    // Adjust based on factor reliability
    const factorReliability = (
      factors.weather * 0.2 +
      factors.portCongestion * 0.3 +
      factors.carrierPerformance * 0.3 +
      factors.routeEfficiency * 0.2
    );
    
    confidence *= factorReliability;
    
    return Math.max(0.1, Math.min(0.95, confidence)); // Between 10% and 95%
  }

  private async storeETAPrediction(prediction: ETAPrediction): Promise<void> {
    await this.prisma.eTAPrediction.create({
      data: {
        shipmentId: prediction.shipmentId,
        milestoneType: prediction.milestoneType,
        predictedDate: prediction.predictedDate,
        confidence: prediction.confidence,
        historicalDelta: prediction.historicalDelta,
        factors: prediction.factors,
        createdBy: 'system', // In real implementation, use actual user ID
      },
    });
  }

  private async getHistoricalHSCodes(): Promise<any[]> {
    // Get historical HS code data
    const suggestions = await this.prisma.hSCodeSuggestion.findMany({
      where: {
        isAccepted: true,
      },
      select: {
        productName: true,
        description: true,
        suggestedCode: true,
        confidence: true,
      },
      take: 1000,
    });

    return suggestions;
  }

  private matchHSCodes(productName: string, description: string, historicalCodes: any[]): any[] {
    const suggestions: any[] = [];
    
    // Simple keyword matching (in real implementation, use more sophisticated NLP)
    const keywords = this.extractKeywords(productName + ' ' + description);
    
    for (const code of historicalCodes) {
      const codeKeywords = this.extractKeywords(code.productName + ' ' + code.description);
      const similarity = this.calculateSimilarity(keywords, codeKeywords);
      
      if (similarity > 0.3) { // 30% similarity threshold
        suggestions.push({
          productName,
          description,
          suggestedCode: code.suggestedCode,
          confidence: similarity,
          reasoning: `Matched based on similarity to "${code.productName}"`,
          alternatives: [], // Would be populated with alternative codes
        });
      }
    }

    return suggestions;
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction (in real implementation, use proper NLP)
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .slice(0, 10); // Top 10 keywords
  }

  private calculateSimilarity(keywords1: string[], keywords2: string[]): number {
    const set1 = new Set(keywords1);
    const set2 = new Set(keywords2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size; // Jaccard similarity
  }

  private calculateHSCodeConfidence(suggestion: any, productName: string, description: string): number {
    // Base confidence from similarity
    let confidence = suggestion.confidence;
    
    // Adjust based on keyword match quality
    const productKeywords = this.extractKeywords(productName);
    const descriptionKeywords = this.extractKeywords(description);
    const allKeywords = [...productKeywords, ...descriptionKeywords];
    
    const keywordMatch = allKeywords.filter(keyword => 
      suggestion.reasoning.toLowerCase().includes(keyword)
    ).length;
    
    confidence += (keywordMatch / allKeywords.length) * 0.2; // Up to 20% bonus
    
    return Math.min(0.95, confidence);
  }

  private async storeHSCodeSuggestions(productName: string, description: string, suggestions: any[]): Promise<void> {
    for (const suggestion of suggestions) {
      await this.prisma.hSCodeSuggestion.create({
        data: {
          productName,
          description,
          suggestedCode: suggestion.suggestedCode,
          confidence: suggestion.confidence,
          reasoning: suggestion.reasoning,
          createdBy: 'system', // In real implementation, use actual user ID
        },
      });
    }
  }

  private async calculateDemurrageFactors(shipment: any): Promise<any> {
    // Port congestion factor
    const portCongestion = this.getPortCongestionFactor(shipment.route?.destinationPort);
    
    // Documentation delays factor
    const documentationDelays = this.getDocumentationDelayFactor(shipment);
    
    // Weather conditions factor
    const weatherConditions = this.getWeatherFactor(shipment.route?.destinationPort);
    
    // Carrier reliability factor
    const carrierReliability = await this.getCarrierPerformanceFactor(shipment.carrier?.id);

    return {
      portCongestion,
      documentationDelays,
      weatherConditions,
      carrierReliability,
    };
  }

  private calculateRiskScore(factors: any): number {
    // Weighted risk score calculation
    const weights = {
      portCongestion: 0.3,
      documentationDelays: 0.25,
      weatherConditions: 0.2,
      carrierReliability: 0.25,
    };

    const riskScore = (
      factors.portCongestion * weights.portCongestion +
      factors.documentationDelays * weights.documentationDelays +
      factors.weatherConditions * weights.weatherConditions +
      (1 - factors.carrierReliability) * weights.carrierReliability // Invert carrier reliability
    ) * 100;

    return Math.min(100, Math.max(0, riskScore));
  }

  private determineRiskLevel(riskScore: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (riskScore < 25) return 'LOW';
    if (riskScore < 50) return 'MEDIUM';
    if (riskScore < 75) return 'HIGH';
    return 'CRITICAL';
  }

  private estimateDemurrageDays(factors: any): number {
    // Estimate demurrage days based on risk factors
    const baseDays = 2; // Base 2 days
    const riskMultiplier = (
      factors.portCongestion * 0.4 +
      factors.documentationDelays * 0.3 +
      factors.weatherConditions * 0.2 +
      (1 - factors.carrierReliability) * 0.1
    );

    return Math.round(baseDays * (1 + riskMultiplier));
  }

  private estimateDemurrageCost(demurrageDays: number, shipment: any): number {
    // Estimate cost based on demurrage days and container type
    const baseCostPerDay = 100; // $100 per day base cost
    const containerMultiplier = shipment.containerType === '40FT' ? 1.5 : 1.0;
    
    return demurrageDays * baseCostPerDay * containerMultiplier;
  }

  private generateDemurrageRecommendations(factors: any, riskLevel: string): string[] {
    const recommendations: string[] = [];

    if (factors.portCongestion > 0.7) {
      recommendations.push('Consider alternative ports or earlier arrival to avoid congestion');
    }

    if (factors.documentationDelays > 0.6) {
      recommendations.push('Ensure all documentation is complete and submitted early');
    }

    if (factors.weatherConditions > 0.5) {
      recommendations.push('Monitor weather conditions and consider route adjustments');
    }

    if (factors.carrierReliability < 0.6) {
      recommendations.push('Consider using a more reliable carrier or adding buffer time');
    }

    if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
      recommendations.push('Implement contingency plans and monitor closely');
    }

    return recommendations;
  }

  private async getHistoricalUtilizationData(period: string): Promise<any[]> {
    // Get historical utilization data
    const startDate = this.getPeriodStart(period);
    const endDate = this.getPeriodEnd(period);
    
    const timesheets = await this.prisma.timesheet.findMany({
      where: {
        date: {
          gte: new Date(startDate.getTime() - 365 * 24 * 60 * 60 * 1000), // Last year
          lte: endDate,
        },
      },
    });

    // Group by period and calculate utilization
    const utilizationData: any[] = [];
    const periodGroups = this.groupByPeriod(timesheets);
    
    for (const [periodKey, data] of periodGroups) {
      const totalHours = data.reduce((sum, ts) => sum + ts.hours, 0);
      const billableHours = data.filter(ts => ts.isBillable).reduce((sum, ts) => sum + ts.hours, 0);
      const utilization = totalHours > 0 ? (billableHours / totalHours) * 100 : 0;
      
      utilizationData.push({
        period: periodKey,
        utilization,
        totalHours,
        billableHours,
      });
    }

    return utilizationData.sort((a, b) => a.period.localeCompare(b.period));
  }

  private async calculateUtilizationFactors(period: string): Promise<any> {
    // Historical trend factor
    const historicalTrend = await this.getHistoricalTrend(period);
    
    // Seasonal adjustment factor
    const seasonalAdjustment = this.getSeasonalAdjustment(period);
    
    // Project pipeline factor
    const projectPipeline = await this.getProjectPipelineFactor(period);
    
    // Resource availability factor
    const resourceAvailability = await this.getResourceAvailabilityFactor(period);

    return {
      historicalTrend,
      seasonalAdjustment,
      projectPipeline,
      resourceAvailability,
    };
  }

  private calculateUtilizationForecast(historicalData: any[], factors: any): number {
    if (historicalData.length === 0) {
      return 75; // Default 75% utilization
    }

    // Calculate trend from historical data
    const recentData = historicalData.slice(-6); // Last 6 periods
    const trend = this.calculateTrend(recentData.map(d => d.utilization));
    
    // Apply factors
    const baseUtilization = recentData[recentData.length - 1]?.utilization || 75;
    const adjustedUtilization = baseUtilization + trend + factors.seasonalAdjustment + factors.projectPipeline;
    
    return Math.max(0, Math.min(100, adjustedUtilization));
  }

  private calculateUtilizationConfidence(historicalData: any[], factors: any): number {
    // Base confidence from data quality
    let confidence = Math.min(0.9, historicalData.length / 12); // Max 90% from data quality
    
    // Adjust based on factor reliability
    const factorReliability = (
      Math.abs(factors.historicalTrend) * 0.3 +
      Math.abs(factors.seasonalAdjustment) * 0.2 +
      factors.projectPipeline * 0.3 +
      factors.resourceAvailability * 0.2
    );
    
    confidence *= factorReliability;
    
    return Math.max(0.1, Math.min(0.95, confidence));
  }

  private generateUtilizationScenarios(predictedUtilization: number, factors: any): any {
    const variance = 10; // 10% variance
    
    return {
      optimistic: Math.min(100, predictedUtilization + variance),
      realistic: predictedUtilization,
      pessimistic: Math.max(0, predictedUtilization - variance),
    };
  }

  // Placeholder methods for factor calculations
  private getWeatherFactor(port: string): number {
    // In real implementation, integrate with weather API
    return Math.random() * 0.5; // 0-0.5 factor
  }

  private getPortCongestionFactor(port: string): number {
    // In real implementation, integrate with port congestion data
    return Math.random() * 0.8; // 0-0.8 factor
  }

  private async getCarrierPerformanceFactor(carrierId: string): Promise<number> {
    // In real implementation, calculate from historical performance
    return 0.7 + Math.random() * 0.3; // 0.7-1.0 factor
  }

  private getRouteEfficiencyFactor(route: any): number {
    // In real implementation, calculate from route data
    return 0.6 + Math.random() * 0.4; // 0.6-1.0 factor
  }

  private getDocumentationDelayFactor(shipment: any): number {
    // In real implementation, analyze documentation status
    return Math.random() * 0.6; // 0-0.6 factor
  }

  private async getHistoricalTrend(period: string): Promise<number> {
    // In real implementation, calculate trend from historical data
    return (Math.random() - 0.5) * 10; // -5 to +5 trend
  }

  private getSeasonalAdjustment(period: string): number {
    // In real implementation, apply seasonal adjustments
    return (Math.random() - 0.5) * 5; // -2.5 to +2.5 adjustment
  }

  private async getProjectPipelineFactor(period: string): Promise<number> {
    // In real implementation, analyze project pipeline
    return (Math.random() - 0.5) * 8; // -4 to +4 factor
  }

  private async getResourceAvailabilityFactor(period: string): Promise<number> {
    // In real implementation, analyze resource availability
    return 0.8 + Math.random() * 0.2; // 0.8-1.0 factor
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const first = values[0];
    const last = values[values.length - 1];
    
    return (last - first) / values.length;
  }

  private groupByPeriod(timesheets: any[]): Map<string, any[]> {
    const groups = new Map<string, any[]>();
    
    for (const timesheet of timesheets) {
      const period = this.getPeriodFromDate(timesheet.date);
      if (!groups.has(period)) {
        groups.set(period, []);
      }
      groups.get(period)!.push(timesheet);
    }
    
    return groups;
  }

  private getPeriodFromDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  private getPeriodStart(period: string): Date {
    const [year, month] = period.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, 1);
  }

  private getPeriodEnd(period: string): Date {
    const start = this.getPeriodStart(period);
    return new Date(start.getFullYear(), start.getMonth() + 1, 0);
  }
}
