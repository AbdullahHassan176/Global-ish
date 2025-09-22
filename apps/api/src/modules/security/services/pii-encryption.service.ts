import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JWE, JWK } from 'node-jose';
import { randomBytes, createCipher, createDecipher } from 'crypto';
import { 
  PIIEncryptionKey, 
  PIIFieldMapping, 
  EncryptionResult, 
  DecryptionResult,
  KMSKeyInfo 
} from '../interfaces/pii-encryption.interface';

@Injectable()
export class PIIEncryptionService {
  private readonly logger = new Logger(PIIEncryptionService.name);
  private readonly keyStore: JWK.KeyStore;
  private readonly currentKeyId: string;

  constructor(private readonly prisma: PrismaService) {
    this.keyStore = new JWK.KeyStore();
    this.currentKeyId = process.env.CURRENT_PII_KEY_ID || 'default-key';
    this.initializeKeyStore();
  }

  /**
   * Initialize the key store with current encryption keys
   */
  private async initializeKeyStore() {
    try {
      const activeKeys = await this.prisma.pIIEncryptionKey.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });

      for (const key of activeKeys) {
        await this.loadKeyFromKMS(key);
      }

      this.logger.log(`Initialized PII encryption service with ${activeKeys.length} active keys`);
    } catch (error) {
      this.logger.error('Failed to initialize PII encryption service', error);
    }
  }

  /**
   * Encrypt PII data using JWE with KMS envelope encryption
   */
  async encryptPII(data: string, fieldName: string, userId?: string): Promise<EncryptionResult> {
    try {
      const key = await this.getCurrentEncryptionKey();
      if (!key) {
        throw new Error('No active encryption key found');
      }

      // Create JWE payload
      const payload = {
        data,
        fieldName,
        userId,
        timestamp: Date.now(),
        version: '1.0',
      };

      // Encrypt using JWE
      const jwe = await JWE.createEncrypt(
        {
          format: 'compact',
          fields: {
            alg: 'RSA-OAEP-256',
            enc: 'A256GCM',
            kid: key.keyId,
          },
        },
        key.jwk
      )
        .update(JSON.stringify(payload))
        .final();

      // Log encryption event
      await this.logEncryptionEvent('ENCRYPT', fieldName, userId);

      return {
        encryptedData: jwe,
        keyId: key.keyId,
        algorithm: 'JWE-RSA-OAEP-256-A256GCM',
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Failed to encrypt PII data for field ${fieldName}:`, error);
      throw error;
    }
  }

  /**
   * Decrypt PII data using JWE
   */
  async decryptPII(encryptedData: string, fieldName: string, userId?: string): Promise<DecryptionResult> {
    try {
      // Parse JWE header to get key ID
      const jweHeader = await this.parseJWEHeader(encryptedData);
      const keyId = jweHeader.kid;

      if (!keyId) {
        throw new Error('No key ID found in JWE header');
      }

      // Get the encryption key
      const key = await this.getEncryptionKeyById(keyId);
      if (!key) {
        throw new Error(`Encryption key ${keyId} not found`);
      }

      // Decrypt using JWE
      const result = await JWE.createDecrypt(key.jwk).decrypt(encryptedData);
      const payload = JSON.parse(result.payload.toString());

      // Validate payload
      if (payload.fieldName !== fieldName) {
        throw new Error('Field name mismatch in encrypted payload');
      }

      if (userId && payload.userId !== userId) {
        throw new Error('User ID mismatch in encrypted payload');
      }

      // Log decryption event
      await this.logEncryptionEvent('DECRYPT', fieldName, userId);

      return {
        data: payload.data,
        fieldName: payload.fieldName,
        userId: payload.userId,
        timestamp: new Date(payload.timestamp),
        version: payload.version,
      };
    } catch (error) {
      this.logger.error(`Failed to decrypt PII data for field ${fieldName}:`, error);
      throw error;
    }
  }

  /**
   * Encrypt multiple PII fields in a record
   */
  async encryptRecord(record: Record<string, any>, userId?: string): Promise<Record<string, any>> {
    const encryptedRecord = { ...record };
    const piiFields = this.getPIIFields(record);

    for (const fieldName of piiFields) {
      if (record[fieldName] && typeof record[fieldName] === 'string') {
        try {
          const encryptionResult = await this.encryptPII(record[fieldName], fieldName, userId);
          encryptedRecord[fieldName] = encryptionResult.encryptedData;
          encryptedRecord[`${fieldName}_encrypted`] = true;
          encryptedRecord[`${fieldName}_keyId`] = encryptionResult.keyId;
        } catch (error) {
          this.logger.error(`Failed to encrypt field ${fieldName}:`, error);
          // Remove the field if encryption fails
          delete encryptedRecord[fieldName];
        }
      }
    }

    return encryptedRecord;
  }

  /**
   * Decrypt multiple PII fields in a record
   */
  async decryptRecord(record: Record<string, any>, userId?: string): Promise<Record<string, any>> {
    const decryptedRecord = { ...record };
    const encryptedFields = this.getEncryptedFields(record);

    for (const fieldName of encryptedFields) {
      if (record[fieldName] && typeof record[fieldName] === 'string') {
        try {
          const decryptionResult = await this.decryptPII(record[fieldName], fieldName, userId);
          decryptedRecord[fieldName] = decryptionResult.data;
          delete decryptedRecord[`${fieldName}_encrypted`];
          delete decryptedRecord[`${fieldName}_keyId`];
        } catch (error) {
          this.logger.error(`Failed to decrypt field ${fieldName}:`, error);
          // Keep the encrypted value if decryption fails
        }
      }
    }

    return decryptedRecord;
  }

  /**
   * Create a new encryption key in KMS
   */
  async createEncryptionKey(createdBy: string): Promise<PIIEncryptionKey> {
    try {
      // Generate new key pair
      const keyPair = await JWK.createKey('RSA', 2048, {
        use: 'enc',
        alg: 'RSA-OAEP-256',
      });

      const keyId = `pii-key-${Date.now()}`;
      const keyVersion = '1.0';

      // Store key in KMS (simulated)
      const kmsKeyInfo = await this.storeKeyInKMS(keyId, keyPair);

      // Create database record
      const encryptionKey = await this.prisma.pIIEncryptionKey.create({
        data: {
          keyId,
          keyVersion,
          algorithm: 'RSA-OAEP-256',
          isActive: true,
          metadata: {
            kmsKeyId: kmsKeyInfo.kmsKeyId,
            keyType: 'RSA',
            keySize: 2048,
            createdInKMS: kmsKeyInfo.createdAt,
          },
          createdBy,
        },
      });

      // Add to key store
      await this.keyStore.add(keyPair);

      this.logger.log(`Created new PII encryption key: ${keyId}`);

      return encryptionKey;
    } catch (error) {
      this.logger.error('Failed to create encryption key:', error);
      throw error;
    }
  }

  /**
   * Rotate encryption key
   */
  async rotateEncryptionKey(currentKeyId: string, createdBy: string): Promise<PIIEncryptionKey> {
    try {
      // Create new key
      const newKey = await this.createEncryptionKey(createdBy);

      // Mark old key as inactive
      await this.prisma.pIIEncryptionKey.update({
        where: { keyId: currentKeyId },
        data: {
          isActive: false,
          rotatedAt: new Date(),
        },
      });

      // Update current key ID
      this.currentKeyId = newKey.keyId;

      this.logger.log(`Rotated encryption key from ${currentKeyId} to ${newKey.keyId}`);

      return newKey;
    } catch (error) {
      this.logger.error('Failed to rotate encryption key:', error);
      throw error;
    }
  }

  /**
   * Get current active encryption key
   */
  private async getCurrentEncryptionKey(): Promise<{ keyId: string; jwk: JWK.Key } | null> {
    const key = this.keyStore.get({ kid: this.currentKeyId });
    if (key) {
      return { keyId: this.currentKeyId, jwk: key };
    }

    // Load from database if not in key store
    const dbKey = await this.prisma.pIIEncryptionKey.findUnique({
      where: { keyId: this.currentKeyId },
    });

    if (dbKey && dbKey.isActive) {
      await this.loadKeyFromKMS(dbKey);
      const loadedKey = this.keyStore.get({ kid: this.currentKeyId });
      return loadedKey ? { keyId: this.currentKeyId, jwk: loadedKey } : null;
    }

    return null;
  }

  /**
   * Get encryption key by ID
   */
  private async getEncryptionKeyById(keyId: string): Promise<{ keyId: string; jwk: JWK.Key } | null> {
    let key = this.keyStore.get({ kid: keyId });
    if (key) {
      return { keyId, jwk: key };
    }

    // Load from database if not in key store
    const dbKey = await this.prisma.pIIEncryptionKey.findUnique({
      where: { keyId },
    });

    if (dbKey) {
      await this.loadKeyFromKMS(dbKey);
      key = this.keyStore.get({ kid: keyId });
      return key ? { keyId, jwk: key } : null;
    }

    return null;
  }

  /**
   * Load key from KMS and add to key store
   */
  private async loadKeyFromKMS(encryptionKey: PIIEncryptionKey): Promise<void> {
    try {
      // Simulate KMS key retrieval
      const kmsKeyInfo = await this.retrieveKeyFromKMS(encryptionKey.keyId);
      
      // Import key into key store
      const jwk = await JWK.asKey(kmsKeyInfo.keyMaterial);
      await this.keyStore.add(jwk);

      this.logger.debug(`Loaded encryption key ${encryptionKey.keyId} from KMS`);
    } catch (error) {
      this.logger.error(`Failed to load key ${encryptionKey.keyId} from KMS:`, error);
    }
  }

  /**
   * Store key in KMS (simulated)
   */
  private async storeKeyInKMS(keyId: string, keyPair: JWK.Key): Promise<KMSKeyInfo> {
    // In a real implementation, this would store the key in AWS KMS, Azure Key Vault, etc.
    // For now, we'll simulate the KMS operations
    
    const kmsKeyId = `kms-${keyId}`;
    const keyMaterial = keyPair.toJSON(true); // Include private key for simulation

    // Simulate KMS storage
    this.logger.debug(`Storing key ${keyId} in KMS with ID ${kmsKeyId}`);

    return {
      kmsKeyId,
      keyMaterial,
      createdAt: new Date(),
      region: 'us-east-1',
      keyType: 'RSA',
      keySize: 2048,
    };
  }

  /**
   * Retrieve key from KMS (simulated)
   */
  private async retrieveKeyFromKMS(keyId: string): Promise<KMSKeyInfo> {
    // In a real implementation, this would retrieve the key from KMS
    // For now, we'll simulate the KMS retrieval
    
    const dbKey = await this.prisma.pIIEncryptionKey.findUnique({
      where: { keyId },
    });

    if (!dbKey || !dbKey.metadata) {
      throw new Error(`Key ${keyId} not found in KMS`);
    }

    const metadata = dbKey.metadata as any;
    
    return {
      kmsKeyId: metadata.kmsKeyId,
      keyMaterial: metadata.keyMaterial,
      createdAt: new Date(metadata.createdInKMS),
      region: 'us-east-1',
      keyType: 'RSA',
      keySize: 2048,
    };
  }

  /**
   * Parse JWE header to extract key ID
   */
  private async parseJWEHeader(jwe: string): Promise<any> {
    const parts = jwe.split('.');
    if (parts.length !== 5) {
      throw new Error('Invalid JWE format');
    }

    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
    return header;
  }

  /**
   * Get PII fields from a record
   */
  private getPIIFields(record: Record<string, any>): string[] {
    const piiFieldMapping: PIIFieldMapping = {
      user: ['email', 'name', 'phone', 'address'],
      client: ['name', 'email', 'phone', 'address', 'contactPerson'],
      shipment: ['billOfLading', 'bookingNumber'],
      invoice: ['invoiceNumber'],
      // Add more mappings as needed
    };

    const recordType = this.detectRecordType(record);
    return piiFieldMapping[recordType] || [];
  }

  /**
   * Get encrypted fields from a record
   */
  private getEncryptedFields(record: Record<string, any>): string[] {
    return Object.keys(record).filter(key => 
      record[`${key}_encrypted`] === true
    );
  }

  /**
   * Detect record type based on fields
   */
  private detectRecordType(record: Record<string, any>): string {
    if (record.email && record.name) return 'user';
    if (record.clientName) return 'client';
    if (record.shipmentNumber) return 'shipment';
    if (record.invoiceNumber) return 'invoice';
    return 'unknown';
  }

  /**
   * Log encryption/decryption events
   */
  private async logEncryptionEvent(operation: 'ENCRYPT' | 'DECRYPT', fieldName: string, userId?: string): Promise<void> {
    try {
      await this.prisma.securityEvent.create({
        data: {
          eventType: 'DATA_ACCESS',
          severity: 'LOW',
          userId,
          description: `PII ${operation.toLowerCase()} operation on field ${fieldName}`,
          metadata: {
            operation,
            fieldName,
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      this.logger.error('Failed to log encryption event:', error);
    }
  }
}
