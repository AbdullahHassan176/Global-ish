import { Test, TestingModule } from '@nestjs/testing';
import { CredentialVaultService } from '../services/credential-vault.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { CredentialType } from '@prisma/client';

describe('CredentialVaultService', () => {
  let service: CredentialVaultService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    integrationCredential: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialVaultService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CredentialVaultService>(CredentialVaultService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCredential', () => {
    it('should create a new credential', async () => {
      const createDto = {
        name: 'Test Credential',
        type: CredentialType.OAUTH2,
        provider: 'salesforce',
        credentials: {
          clientId: 'test-client-id',
          clientSecret: 'test-client-secret',
        },
      };

      const mockCredential = {
        id: 'credential-1',
        ...createDto,
        encryptedData: { data: 'encrypted-data' },
        isActive: true,
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'validateCredential').mockResolvedValue({
        isValid: true,
        expiresAt: new Date('2024-12-31'),
      });

      jest.spyOn(service, 'encrypt').mockResolvedValue('encrypted-data');

      mockPrismaService.integrationCredential.create.mockResolvedValue(mockCredential);

      const result = await service.createCredential(createDto, 'user-1');

      expect(service.validateCredential).toHaveBeenCalledWith(createDto.type, createDto.credentials);
      expect(service.encrypt).toHaveBeenCalledWith(JSON.stringify(createDto.credentials));
      expect(mockPrismaService.integrationCredential.create).toHaveBeenCalledWith({
        data: {
          name: createDto.name,
          type: createDto.type,
          provider: createDto.provider,
          encryptedData: { data: 'encrypted-data' },
          metadata: undefined,
          expiresAt: undefined,
          createdBy: 'user-1',
        },
      });
      expect(result).toEqual(mockCredential);
    });

    it('should throw error for invalid credentials', async () => {
      const createDto = {
        name: 'Test Credential',
        type: CredentialType.OAUTH2,
        provider: 'salesforce',
        credentials: {
          clientId: 'test-client-id',
          // Missing clientSecret
        },
      };

      jest.spyOn(service, 'validateCredential').mockResolvedValue({
        isValid: false,
        error: 'Missing required OAuth2 fields: clientId, clientSecret',
      });

      await expect(service.createCredential(createDto, 'user-1')).rejects.toThrow(
        'Invalid credentials: Missing required OAuth2 fields: clientId, clientSecret'
      );
    });
  });

  describe('findAllCredentials', () => {
    it('should return all credentials for a user', async () => {
      const mockCredentials = [
        {
          id: 'credential-1',
          name: 'Test Credential 1',
          type: CredentialType.OAUTH2,
          provider: 'salesforce',
          isActive: true,
          createdBy: 'user-1',
        },
        {
          id: 'credential-2',
          name: 'Test Credential 2',
          type: CredentialType.API_KEY,
          provider: 'hubspot',
          isActive: true,
          createdBy: 'user-1',
        },
      ];

      mockPrismaService.integrationCredential.findMany.mockResolvedValue(mockCredentials);

      const result = await service.findAllCredentials('user-1');

      expect(mockPrismaService.integrationCredential.findMany).toHaveBeenCalledWith({
        where: { createdBy: 'user-1' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockCredentials);
    });
  });

  describe('findCredentialById', () => {
    it('should return a credential by ID', async () => {
      const mockCredential = {
        id: 'credential-1',
        name: 'Test Credential',
        type: CredentialType.OAUTH2,
        provider: 'salesforce',
        isActive: true,
      };

      mockPrismaService.integrationCredential.findUnique.mockResolvedValue(mockCredential);

      const result = await service.findCredentialById('credential-1');

      expect(mockPrismaService.integrationCredential.findUnique).toHaveBeenCalledWith({
        where: { id: 'credential-1' },
      });
      expect(result).toEqual(mockCredential);
    });

    it('should throw error if credential not found', async () => {
      mockPrismaService.integrationCredential.findUnique.mockResolvedValue(null);

      await expect(service.findCredentialById('nonexistent')).rejects.toThrow(
        'Credential with ID nonexistent not found'
      );
    });
  });

  describe('updateCredential', () => {
    it('should update a credential', async () => {
      const existingCredential = {
        id: 'credential-1',
        name: 'Old Name',
        type: CredentialType.OAUTH2,
        provider: 'salesforce',
        encryptedData: { data: 'old-encrypted-data' },
        isActive: true,
      };

      const updateDto = {
        name: 'New Name',
        type: CredentialType.OAUTH2,
        provider: 'salesforce',
        credentials: {
          clientId: 'new-client-id',
          clientSecret: 'new-client-secret',
        },
        isActive: false,
      };

      const updatedCredential = {
        id: 'credential-1',
        ...updateDto,
        encryptedData: { data: 'new-encrypted-data' },
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'findCredentialById').mockResolvedValue(existingCredential as any);
      jest.spyOn(service, 'validateCredential').mockResolvedValue({ isValid: true });
      jest.spyOn(service, 'encrypt').mockResolvedValue('new-encrypted-data');

      mockPrismaService.integrationCredential.update.mockResolvedValue(updatedCredential);

      const result = await service.updateCredential('credential-1', updateDto);

      expect(service.validateCredential).toHaveBeenCalledWith(updateDto.type, updateDto.credentials);
      expect(service.encrypt).toHaveBeenCalledWith(JSON.stringify(updateDto.credentials));
      expect(mockPrismaService.integrationCredential.update).toHaveBeenCalledWith({
        where: { id: 'credential-1' },
        data: {
          name: updateDto.name,
          type: updateDto.type,
          provider: updateDto.provider,
          encryptedData: { data: 'new-encrypted-data' },
          metadata: undefined,
          expiresAt: undefined,
          isActive: updateDto.isActive,
        },
      });
      expect(result).toEqual(updatedCredential);
    });
  });

  describe('deleteCredential', () => {
    it('should delete a credential', async () => {
      const mockCredential = {
        id: 'credential-1',
        name: 'Test Credential',
      };

      jest.spyOn(service, 'findCredentialById').mockResolvedValue(mockCredential as any);
      mockPrismaService.integrationCredential.delete.mockResolvedValue(mockCredential);

      await service.deleteCredential('credential-1');

      expect(service.findCredentialById).toHaveBeenCalledWith('credential-1');
      expect(mockPrismaService.integrationCredential.delete).toHaveBeenCalledWith({
        where: { id: 'credential-1' },
      });
    });
  });

  describe('getDecryptedCredentials', () => {
    it('should return decrypted credentials', async () => {
      const mockCredential = {
        id: 'credential-1',
        isActive: true,
        expiresAt: new Date('2024-12-31'),
        encryptedData: { data: 'encrypted-data' },
      };

      const decryptedCredentials = {
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
      };

      jest.spyOn(service, 'findCredentialById').mockResolvedValue(mockCredential as any);
      jest.spyOn(service, 'decrypt').mockResolvedValue(JSON.stringify(decryptedCredentials));

      const result = await service.getDecryptedCredentials('credential-1');

      expect(service.findCredentialById).toHaveBeenCalledWith('credential-1');
      expect(service.decrypt).toHaveBeenCalledWith('encrypted-data');
      expect(result).toEqual(decryptedCredentials);
    });

    it('should throw error for inactive credential', async () => {
      const mockCredential = {
        id: 'credential-1',
        isActive: false,
        encryptedData: { data: 'encrypted-data' },
      };

      jest.spyOn(service, 'findCredentialById').mockResolvedValue(mockCredential as any);

      await expect(service.getDecryptedCredentials('credential-1')).rejects.toThrow(
        'Credential is not active'
      );
    });

    it('should throw error for expired credential', async () => {
      const mockCredential = {
        id: 'credential-1',
        isActive: true,
        expiresAt: new Date('2020-01-01'), // Expired
        encryptedData: { data: 'encrypted-data' },
      };

      jest.spyOn(service, 'findCredentialById').mockResolvedValue(mockCredential as any);

      await expect(service.getDecryptedCredentials('credential-1')).rejects.toThrow(
        'Credential has expired'
      );
    });
  });

  describe('testCredential', () => {
    it('should test credential successfully', async () => {
      const mockCredential = {
        id: 'credential-1',
        type: CredentialType.OAUTH2,
        isActive: true,
        expiresAt: new Date('2024-12-31'),
        encryptedData: { data: 'encrypted-data' },
      };

      const decryptedCredentials = {
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
      };

      jest.spyOn(service, 'findCredentialById').mockResolvedValue(mockCredential as any);
      jest.spyOn(service, 'getDecryptedCredentials').mockResolvedValue(decryptedCredentials);
      jest.spyOn(service, 'validateCredential').mockResolvedValue({
        isValid: true,
        expiresAt: new Date('2024-12-31'),
      });

      const result = await service.testCredential('credential-1');

      expect(service.findCredentialById).toHaveBeenCalledWith('credential-1');
      expect(service.getDecryptedCredentials).toHaveBeenCalledWith('credential-1');
      expect(service.validateCredential).toHaveBeenCalledWith(CredentialType.OAUTH2, decryptedCredentials);
      expect(result).toEqual({
        isValid: true,
        expiresAt: new Date('2024-12-31'),
      });
    });

    it('should return failed result for invalid credential', async () => {
      const mockCredential = {
        id: 'credential-1',
        type: CredentialType.OAUTH2,
        isActive: true,
        expiresAt: new Date('2024-12-31'),
        encryptedData: { data: 'encrypted-data' },
      };

      jest.spyOn(service, 'findCredentialById').mockResolvedValue(mockCredential as any);
      jest.spyOn(service, 'getDecryptedCredentials').mockRejectedValue(new Error('Decryption failed'));

      const result = await service.testCredential('credential-1');

      expect(result).toEqual({
        isValid: false,
        error: 'Decryption failed',
      });
    });
  });

  describe('validateCredential', () => {
    it('should validate OAuth2 credentials', async () => {
      const credentials = {
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
      };

      const result = await service.validateCredential(CredentialType.OAUTH2, credentials);

      expect(result).toEqual({
        isValid: true,
        expiresAt: undefined,
        metadata: {
          scope: undefined,
          tokenType: undefined,
        },
      });
    });

    it('should validate API key credentials', async () => {
      const credentials = {
        apiKey: 'test-api-key',
      };

      const result = await service.validateCredential(CredentialType.API_KEY, credentials);

      expect(result).toEqual({
        isValid: true,
        metadata: {
          baseUrl: undefined,
          headers: undefined,
        },
      });
    });

    it('should validate basic auth credentials', async () => {
      const credentials = {
        username: 'test-user',
        password: 'test-password',
      };

      const result = await service.validateCredential(CredentialType.BASIC_AUTH, credentials);

      expect(result).toEqual({
        isValid: true,
        metadata: {
          baseUrl: undefined,
        },
      });
    });

    it('should validate JWT credentials', async () => {
      const credentials = {
        token: 'test-jwt-token',
      };

      const result = await service.validateCredential(CredentialType.JWT, credentials);

      expect(result).toEqual({
        isValid: true,
        expiresAt: undefined,
        metadata: {
          algorithm: undefined,
        },
      });
    });

    it('should validate webhook secret credentials', async () => {
      const credentials = {
        secret: 'test-webhook-secret',
      };

      const result = await service.validateCredential(CredentialType.WEBHOOK_SECRET, credentials);

      expect(result).toEqual({
        isValid: true,
        metadata: {
          algorithm: 'sha256',
        },
      });
    });

    it('should return error for missing OAuth2 fields', async () => {
      const credentials = {
        clientId: 'test-client-id',
        // Missing clientSecret
      };

      const result = await service.validateCredential(CredentialType.OAUTH2, credentials);

      expect(result).toEqual({
        isValid: false,
        error: 'Missing required OAuth2 fields: clientId, clientSecret',
      });
    });

    it('should return error for missing API key', async () => {
      const credentials = {};

      const result = await service.validateCredential(CredentialType.API_KEY, credentials);

      expect(result).toEqual({
        isValid: false,
        error: 'Missing required API key',
      });
    });

    it('should return error for missing basic auth fields', async () => {
      const credentials = {
        username: 'test-user',
        // Missing password
      };

      const result = await service.validateCredential(CredentialType.BASIC_AUTH, credentials);

      expect(result).toEqual({
        isValid: false,
        error: 'Missing required basic auth fields: username, password',
      });
    });

    it('should return error for missing JWT token', async () => {
      const credentials = {};

      const result = await service.validateCredential(CredentialType.JWT, credentials);

      expect(result).toEqual({
        isValid: false,
        error: 'Missing required JWT token',
      });
    });

    it('should return error for missing webhook secret', async () => {
      const credentials = {};

      const result = await service.validateCredential(CredentialType.WEBHOOK_SECRET, credentials);

      expect(result).toEqual({
        isValid: false,
        error: 'Missing required webhook secret',
      });
    });

    it('should return error for unsupported credential type', async () => {
      const credentials = {};

      const result = await service.validateCredential('UNSUPPORTED' as CredentialType, credentials);

      expect(result).toEqual({
        isValid: false,
        error: 'Unsupported credential type: UNSUPPORTED',
      });
    });
  });
});
