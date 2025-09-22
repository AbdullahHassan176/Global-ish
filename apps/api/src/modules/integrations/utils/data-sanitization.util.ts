import { EncryptionUtil } from './encryption.util';
import { PIIFieldMapping, InvestorSafeFieldMapping, DataSanitizationResult } from '../interfaces/tokenization.interface';

export class DataSanitizationUtil {
  private static readonly PII_FIELD_MAPPING: PIIFieldMapping = {
    shipment: {
      allowed: ['id', 'shipmentNumber', 'carrier', 'status', 'origin', 'destination', 'etd', 'eta', 'createdAt'],
      sanitized: ['origin', 'destination'], // Remove specific addresses
      encrypted: ['billOfLading', 'bookingNumber'],
      excluded: ['createdBy', 'updatedBy', 'clientId', 'projectId']
    },
    container: {
      allowed: ['id', 'containerNumber', 'type', 'size', 'status', 'weightKg', 'lastKnownLocation', 'lastReportedAt'],
      sanitized: ['lastKnownLocation'], // Generalize location
      encrypted: [],
      excluded: ['shipmentId']
    },
    milestone: {
      allowed: ['id', 'type', 'status', 'scheduledDate', 'actualDate', 'location', 'colorStatus'],
      sanitized: ['location'],
      encrypted: [],
      excluded: ['shipmentId']
    },
    invoice: {
      allowed: ['id', 'invoiceNumber', 'issueDate', 'dueDate', 'totalAmount', 'currency', 'status'],
      sanitized: [],
      encrypted: ['invoiceNumber'],
      excluded: ['shipmentId', 'projectId', 'clientId', 'createdBy']
    },
    user: {
      allowed: ['id', 'role', 'isActive', 'createdAt'],
      sanitized: [],
      encrypted: [],
      excluded: ['email', 'name', 'password', 'avatar', 'attributes', 'lastLoginAt']
    },
    client: {
      allowed: ['id', 'name', 'type', 'isActive', 'createdAt'],
      sanitized: ['name'], // Anonymize client names
      encrypted: [],
      excluded: ['email', 'phone', 'address', 'contactPerson']
    },
    project: {
      allowed: ['id', 'name', 'status', 'startDate', 'endDate', 'budget', 'currency'],
      sanitized: ['name'],
      encrypted: [],
      excluded: ['clientId', 'createdBy', 'description']
    }
  };

  private static readonly INVESTOR_SAFE_MAPPING: InvestorSafeFieldMapping = {
    shipment: {
      allowed: ['id', 'carrier', 'status', 'originCountry', 'destinationCountry', 'etd', 'eta', 'transitTime'],
      aggregated: ['totalShipments', 'averageTransitTime', 'onTimeDeliveryRate'],
      anonymized: ['carrier', 'originCountry', 'destinationCountry']
    },
    container: {
      allowed: ['type', 'size', 'status', 'weightCategory'],
      aggregated: ['containerUtilization', 'averageWeight'],
      anonymized: ['type', 'size']
    },
    milestone: {
      allowed: ['type', 'status', 'delayDays'],
      aggregated: ['milestoneCompletionRate', 'averageDelay'],
      anonymized: ['type']
    },
    invoice: {
      allowed: ['totalAmount', 'currency', 'status', 'paymentTerms'],
      aggregated: ['totalRevenue', 'averageInvoiceValue', 'paymentDelayRate'],
      anonymized: ['currency']
    }
  };

  /**
   * Sanitize data for PII removal and investor safety
   */
  static async sanitizeData(
    data: Record<string, any>,
    entityType: string,
    sanitizationLevel: 'basic' | 'investor' = 'basic'
  ): Promise<DataSanitizationResult> {
    const mapping = this.PII_FIELD_MAPPING[entityType];
    if (!mapping) {
      throw new Error(`No PII mapping found for entity type: ${entityType}`);
    }

    const result: DataSanitizationResult = {
      sanitizedData: {},
      originalData: sanitizationLevel === 'basic' ? { ...data } : undefined,
      piiRemoved: [],
      fieldsEncrypted: [],
      fieldsExcluded: []
    };

    // Process each field
    for (const [key, value] of Object.entries(data)) {
      if (mapping.excluded.includes(key)) {
        result.fieldsExcluded.push(key);
        continue;
      }

      if (mapping.encrypted.includes(key)) {
        const encryptedValue = await EncryptionUtil.encrypt(
          JSON.stringify(value),
          process.env.ENCRYPTION_KEY || 'default-key'
        );
        result.sanitizedData[key] = encryptedValue;
        result.fieldsEncrypted.push(key);
        continue;
      }

      if (mapping.sanitized.includes(key)) {
        result.sanitizedData[key] = this.sanitizeField(key, value);
        result.piiRemoved.push(key);
        continue;
      }

      if (mapping.allowed.includes(key)) {
        if (sanitizationLevel === 'investor') {
          result.sanitizedData[key] = this.makeInvestorSafe(key, value, entityType);
        } else {
          result.sanitizedData[key] = value;
        }
      }
    }

    return result;
  }

  /**
   * Sanitize individual field values
   */
  private static sanitizeField(fieldName: string, value: any): any {
    if (typeof value !== 'string') {
      return value;
    }

    switch (fieldName) {
      case 'origin':
      case 'destination':
        return this.sanitizeLocation(value);
      case 'location':
        return this.sanitizeLocation(value);
      case 'name':
        return this.sanitizeName(value);
      case 'email':
        return this.sanitizeEmail(value);
      case 'phone':
        return this.sanitizePhone(value);
      default:
        return value;
    }
  }

  /**
   * Make data investor-safe by anonymizing and aggregating
   */
  private static makeInvestorSafe(fieldName: string, value: any, entityType: string): any {
    const mapping = this.INVESTOR_SAFE_MAPPING[entityType];
    if (!mapping) {
      return value;
    }

    if (mapping.anonymized.includes(fieldName)) {
      return this.anonymizeValue(fieldName, value);
    }

    return value;
  }

  /**
   * Sanitize location data
   */
  private static sanitizeLocation(location: string): string {
    // Extract country/region only
    const parts = location.split(',').map(p => p.trim());
    if (parts.length > 1) {
      return parts[parts.length - 1]; // Return country/region
    }
    return 'Unknown';
  }

  /**
   * Sanitize name data
   */
  private static sanitizeName(name: string): string {
    // Replace with generic identifier
    const hash = this.simpleHash(name);
    return `Client_${hash.substring(0, 6)}`;
  }

  /**
   * Sanitize email data
   */
  private static sanitizeEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const sanitizedLocal = localPart.substring(0, 2) + '***';
    return `${sanitizedLocal}@${domain}`;
  }

  /**
   * Sanitize phone data
   */
  private static sanitizePhone(phone: string): string {
    return phone.replace(/\d/g, '*');
  }

  /**
   * Anonymize values for investor safety
   */
  private static anonymizeValue(fieldName: string, value: any): any {
    switch (fieldName) {
      case 'carrier':
        return this.anonymizeCarrier(value);
      case 'originCountry':
      case 'destinationCountry':
        return this.anonymizeCountry(value);
      case 'type':
        return this.anonymizeType(value);
      case 'size':
        return this.anonymizeSize(value);
      case 'currency':
        return this.anonymizeCurrency(value);
      default:
        return value;
    }
  }

  /**
   * Anonymize carrier names
   */
  private static anonymizeCarrier(carrier: string): string {
    const carriers = ['Carrier_A', 'Carrier_B', 'Carrier_C', 'Carrier_D', 'Carrier_E'];
    const hash = this.simpleHash(carrier);
    return carriers[hash.charCodeAt(0) % carriers.length];
  }

  /**
   * Anonymize country names
   */
  private static anonymizeCountry(country: string): string {
    const regions = ['Region_A', 'Region_B', 'Region_C', 'Region_D', 'Region_E'];
    const hash = this.simpleHash(country);
    return regions[hash.charCodeAt(0) % regions.length];
  }

  /**
   * Anonymize type values
   */
  private static anonymizeType(type: string): string {
    const types = ['Type_A', 'Type_B', 'Type_C'];
    const hash = this.simpleHash(type);
    return types[hash.charCodeAt(0) % types.length];
  }

  /**
   * Anonymize size values
   */
  private static anonymizeSize(size: string): string {
    const sizes = ['Size_A', 'Size_B', 'Size_C'];
    const hash = this.simpleHash(size);
    return sizes[hash.charCodeAt(0) % sizes.length];
  }

  /**
   * Anonymize currency values
   */
  private static anonymizeCurrency(currency: string): string {
    const currencies = ['Currency_A', 'Currency_B', 'Currency_C'];
    const hash = this.simpleHash(currency);
    return currencies[hash.charCodeAt(0) % currencies.length];
  }

  /**
   * Simple hash function for anonymization
   */
  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Get allowed fields for entity type
   */
  static getAllowedFields(entityType: string): string[] {
    const mapping = this.PII_FIELD_MAPPING[entityType];
    return mapping ? mapping.allowed : [];
  }

  /**
   * Get excluded fields for entity type
   */
  static getExcludedFields(entityType: string): string[] {
    const mapping = this.PII_FIELD_MAPPING[entityType];
    return mapping ? mapping.excluded : [];
  }
}
