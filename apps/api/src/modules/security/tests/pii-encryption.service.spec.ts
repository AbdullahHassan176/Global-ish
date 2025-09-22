import { Test, TestingModule } from '@nestjs/testing';
import { PIIEncryptionService } from '../services/pii-encryption.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('PIIEncryptionService', () => {
  let service: PIIEncryptionService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    pIIEncryptionKey: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    securityEvent: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PIIEncryptionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PIIEncryptionService>(PIIEncryptionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encryptPII', () => {
    it('should encrypt PII data successfully', async () => {
      const mockKey = {
        keyId: 'test-key-1',
        jwk: {
          kty: 'RSA',
          use: 'enc',
          alg: 'RSA-OAEP-256',
        },
      };

      jest.spyOn(service as any, 'getCurrentEncryptionKey').mockResolvedValue(mockKey);
      jest.spyOn(service as any, 'logEncryptionEvent').mockResolvedValue(undefined);

      const result = await service.encryptPII('sensitive-data', 'email', 'user-1');

      expect(result).toHaveProperty('encryptedData');
      expect(result).toHaveProperty('keyId', 'test-key-1');
      expect(result).toHaveProperty('algorithm');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.encryptedData).toBe('string');
    });

    it('should throw error when no encryption key is available', async () => {
      jest.spyOn(service as any, 'getCurrentEncryptionKey').mockResolvedValue(null);

      await expect(service.encryptPII('sensitive-data', 'email', 'user-1')).rejects.toThrow(
        'No active encryption key found'
      );
    });
  });

  describe('decryptPII', () => {
    it('should decrypt PII data successfully', async () => {
      const mockKey = {
        keyId: 'test-key-1',
        jwk: {
          kty: 'RSA',
          use: 'enc',
          alg: 'RSA-OAEP-256',
        },
      };

      const mockEncryptedData = 'encrypted-jwe-token';
      const mockDecryptedPayload = {
        data: 'sensitive-data',
        fieldName: 'email',
        userId: 'user-1',
        timestamp: Date.now(),
        version: '1.0',
      };

      jest.spyOn(service as any, 'parseJWEHeader').mockResolvedValue({ kid: 'test-key-1' });
      jest.spyOn(service as any, 'getEncryptionKeyById').mockResolvedValue(mockKey);
      jest.spyOn(service as any, 'logEncryptionEvent').mockResolvedValue(undefined);

      // Mock JWE decryption
      const mockJWE = {
        createDecrypt: jest.fn().mockReturnValue({
          decrypt: jest.fn().mockResolvedValue({
            payload: Buffer.from(JSON.stringify(mockDecryptedPayload)),
          }),
        }),
      };

      jest.spyOn(require('node-jose'), 'JWE').mockReturnValue(mockJWE);

      const result = await service.decryptPII(mockEncryptedData, 'email', 'user-1');

      expect(result).toHaveProperty('data', 'sensitive-data');
      expect(result).toHaveProperty('fieldName', 'email');
      expect(result).toHaveProperty('userId', 'user-1');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('version', '1.0');
    });

    it('should throw error for field name mismatch', async () => {
      const mockKey = {
        keyId: 'test-key-1',
        jwk: { kty: 'RSA' },
      };

      const mockDecryptedPayload = {
        data: 'sensitive-data',
        fieldName: 'phone', // Different from requested field
        userId: 'user-1',
        timestamp: Date.now(),
        version: '1.0',
      };

      jest.spyOn(service as any, 'parseJWEHeader').mockResolvedValue({ kid: 'test-key-1' });
      jest.spyOn(service as any, 'getEncryptionKeyById').mockResolvedValue(mockKey);

      const mockJWE = {
        createDecrypt: jest.fn().mockReturnValue({
          decrypt: jest.fn().mockResolvedValue({
            payload: Buffer.from(JSON.stringify(mockDecryptedPayload)),
          }),
        }),
      };

      jest.spyOn(require('node-jose'), 'JWE').mockReturnValue(mockJWE);

      await expect(service.decryptPII('encrypted-data', 'email', 'user-1')).rejects.toThrow(
        'Field name mismatch in encrypted payload'
      );
    });

    it('should throw error for user ID mismatch', async () => {
      const mockKey = {
        keyId: 'test-key-1',
        jwk: { kty: 'RSA' },
      };

      const mockDecryptedPayload = {
        data: 'sensitive-data',
        fieldName: 'email',
        userId: 'user-2', // Different from requested user
        timestamp: Date.now(),
        version: '1.0',
      };

      jest.spyOn(service as any, 'parseJWEHeader').mockResolvedValue({ kid: 'test-key-1' });
      jest.spyOn(service as any, 'getEncryptionKeyById').mockResolvedValue(mockKey);

      const mockJWE = {
        createDecrypt: jest.fn().mockReturnValue({
          decrypt: jest.fn().mockResolvedValue({
            payload: Buffer.from(JSON.stringify(mockDecryptedPayload)),
          }),
        }),
      };

      jest.spyOn(require('node-jose'), 'JWE').mockReturnValue(mockJWE);

      await expect(service.decryptPII('encrypted-data', 'email', 'user-1')).rejects.toThrow(
        'User ID mismatch in encrypted payload'
      );
    });
  });

  describe('encryptRecord', () => {
    it('should encrypt PII fields in a record', async () => {
      const mockRecord = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        role: 'admin',
      };

      const mockKey = {
        keyId: 'test-key-1',
        jwk: { kty: 'RSA' },
      };

      jest.spyOn(service as any, 'getCurrentEncryptionKey').mockResolvedValue(mockKey);
      jest.spyOn(service as any, 'logEncryptionEvent').mockResolvedValue(undefined);

      // Mock JWE encryption
      const mockJWE = {
        createEncrypt: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnThis(),
          final: jest.fn().mockResolvedValue('encrypted-jwe-token'),
        }),
      };

      jest.spyOn(require('node-jose'), 'JWE').mockReturnValue(mockJWE);

      const result = await service.encryptRecord(mockRecord, 'user-1');

      expect(result).toHaveProperty('email_encrypted', true);
      expect(result).toHaveProperty('email_keyId', 'test-key-1');
      expect(result).toHaveProperty('phone_encrypted', true);
      expect(result).toHaveProperty('phone_keyId', 'test-key-1');
      expect(result.name).toBe('John Doe'); // Non-PII field unchanged
      expect(result.role).toBe('admin'); // Non-PII field unchanged
    });

    it('should handle encryption failures gracefully', async () => {
      const mockRecord = {
        id: 'user-1',
        email: 'john@example.com',
      };

      jest.spyOn(service as any, 'getCurrentEncryptionKey').mockResolvedValue(null);

      const result = await service.encryptRecord(mockRecord, 'user-1');

      expect(result).not.toHaveProperty('email');
      expect(result).not.toHaveProperty('email_encrypted');
    });
  });

  describe('decryptRecord', () => {
    it('should decrypt PII fields in a record', async () => {
      const mockRecord = {
        id: 'user-1',
        email: 'encrypted-email-token',
        email_encrypted: true,
        email_keyId: 'test-key-1',
        phone: 'encrypted-phone-token',
        phone_encrypted: true,
        phone_keyId: 'test-key-1',
        name: 'John Doe',
      };

      const mockKey = {
        keyId: 'test-key-1',
        jwk: { kty: 'RSA' },
      };

      const mockDecryptedPayload = {
        data: 'john@example.com',
        fieldName: 'email',
        userId: 'user-1',
        timestamp: Date.now(),
        version: '1.0',
      };

      jest.spyOn(service as any, 'parseJWEHeader').mockResolvedValue({ kid: 'test-key-1' });
      jest.spyOn(service as any, 'getEncryptionKeyById').mockResolvedValue(mockKey);
      jest.spyOn(service as any, 'logEncryptionEvent').mockResolvedValue(undefined);

      const mockJWE = {
        createDecrypt: jest.fn().mockReturnValue({
          decrypt: jest.fn().mockResolvedValue({
            payload: Buffer.from(JSON.stringify(mockDecryptedPayload)),
          }),
        }),
      };

      jest.spyOn(require('node-jose'), 'JWE').mockReturnValue(mockJWE);

      const result = await service.decryptRecord(mockRecord, 'user-1');

      expect(result.email).toBe('john@example.com');
      expect(result).not.toHaveProperty('email_encrypted');
      expect(result).not.toHaveProperty('email_keyId');
      expect(result.name).toBe('John Doe'); // Non-encrypted field unchanged
    });
  });

  describe('createEncryptionKey', () => {
    it('should create a new encryption key', async () => {
      const mockKeyPair = {
        kty: 'RSA',
        use: 'enc',
        alg: 'RSA-OAEP-256',
      };

      const mockEncryptionKey = {
        id: 'key-1',
        keyId: 'pii-key-1234567890',
        keyVersion: '1.0',
        algorithm: 'RSA-OAEP-256',
        isActive: true,
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(require('node-jose'), 'JWK').mockReturnValue({
        createKey: jest.fn().mockResolvedValue(mockKeyPair),
      });

      jest.spyOn(service as any, 'storeKeyInKMS').mockResolvedValue({
        kmsKeyId: 'kms-key-123',
        keyMaterial: mockKeyPair,
        createdAt: new Date(),
        region: 'us-east-1',
        keyType: 'RSA',
        keySize: 2048,
      });

      mockPrismaService.pIIEncryptionKey.create.mockResolvedValue(mockEncryptionKey);

      const result = await service.createEncryptionKey('user-1');

      expect(result).toEqual(mockEncryptionKey);
      expect(mockPrismaService.pIIEncryptionKey.create).toHaveBeenCalledWith({
        data: {
          keyId: expect.stringMatching(/^pii-key-\d+$/),
          keyVersion: '1.0',
          algorithm: 'RSA-OAEP-256',
          isActive: true,
          metadata: expect.objectContaining({
            kmsKeyId: 'kms-key-123',
            keyType: 'RSA',
            keySize: 2048,
          }),
          createdBy: 'user-1',
        },
      });
    });
  });

  describe('rotateEncryptionKey', () => {
    it('should rotate encryption key successfully', async () => {
      const currentKeyId = 'current-key-1';
      const newKeyId = 'new-key-1';

      const mockNewKey = {
        id: 'key-2',
        keyId: newKeyId,
        keyVersion: '1.0',
        algorithm: 'RSA-OAEP-256',
        isActive: true,
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'createEncryptionKey').mockResolvedValue(mockNewKey);
      mockPrismaService.pIIEncryptionKey.update.mockResolvedValue({
        id: 'key-1',
        keyId: currentKeyId,
        isActive: false,
        rotatedAt: new Date(),
      });

      const result = await service.rotateEncryptionKey(currentKeyId, 'user-1');

      expect(result).toEqual(mockNewKey);
      expect(service.createEncryptionKey).toHaveBeenCalledWith('user-1');
      expect(mockPrismaService.pIIEncryptionKey.update).toHaveBeenCalledWith({
        where: { keyId: currentKeyId },
        data: {
          isActive: false,
          rotatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('getPIIFields', () => {
    it('should return PII fields for user record type', () => {
      const record = { email: 'test@example.com', name: 'John', role: 'admin' };
      const piiFields = (service as any).getPIIFields(record);

      expect(piiFields).toContain('email');
      expect(piiFields).toContain('name');
      expect(piiFields).toContain('phone');
      expect(piiFields).toContain('address');
    });

    it('should return PII fields for client record type', () => {
      const record = { clientName: 'Acme Corp', email: 'contact@acme.com' };
      const piiFields = (service as any).getPIIFields(record);

      expect(piiFields).toContain('name');
      expect(piiFields).toContain('email');
      expect(piiFields).toContain('phone');
      expect(piiFields).toContain('address');
      expect(piiFields).toContain('contactPerson');
    });

    it('should return empty array for unknown record type', () => {
      const record = { unknownField: 'value' };
      const piiFields = (service as any).getPIIFields(record);

      expect(piiFields).toEqual([]);
    });
  });

  describe('detectRecordType', () => {
    it('should detect user record type', () => {
      const record = { email: 'test@example.com', name: 'John' };
      const recordType = (service as any).detectRecordType(record);

      expect(recordType).toBe('user');
    });

    it('should detect client record type', () => {
      const record = { clientName: 'Acme Corp' };
      const recordType = (service as any).detectRecordType(record);

      expect(recordType).toBe('client');
    });

    it('should detect shipment record type', () => {
      const record = { shipmentNumber: 'SN001' };
      const recordType = (service as any).detectRecordType(record);

      expect(recordType).toBe('shipment');
    });

    it('should detect invoice record type', () => {
      const record = { invoiceNumber: 'INV001' };
      const recordType = (service as any).detectRecordType(record);

      expect(recordType).toBe('invoice');
    });

    it('should return unknown for unrecognized record', () => {
      const record = { unknownField: 'value' };
      const recordType = (service as any).detectRecordType(record);

      expect(recordType).toBe('unknown');
    });
  });
});
