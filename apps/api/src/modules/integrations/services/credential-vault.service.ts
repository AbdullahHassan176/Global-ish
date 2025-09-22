import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { EncryptionUtil } from '../utils/encryption.util';
import { 
  CreateIntegrationCredentialDto, 
  UpdateIntegrationCredentialDto,
  CredentialValidationResult 
} from '../dto/integrations.dto';
import { 
  ICredentialVault, 
  ICredentialProvider,
  CredentialType,
  OAuth2Credentials,
  APIKeyCredentials,
  BasicAuthCredentials,
  JWTCredentials,
  WebhookSecretCredentials
} from '../interfaces/credential-vault.interface';
import { IntegrationCredential } from '@prisma/client';

@Injectable()
export class CredentialVaultService implements ICredentialVault {
  private readonly logger = new Logger(CredentialVaultService.name);
  private readonly encryptionKey: string;

  constructor(private readonly prisma: PrismaService) {
    this.encryptionKey = process.env.ENCRYPTION_KEY || 'default-encryption-key';
  }

  /**
   * Create a new integration credential
   */
  async createCredential(
    createDto: CreateIntegrationCredentialDto,
    userId: string
  ): Promise<IntegrationCredential> {
    this.logger.log(`Creating credential for provider: ${createDto.provider}`);

    // Validate credentials before storing
    const validationResult = await this.validateCredential(createDto.type, createDto.credentials);
    if (!validationResult.isValid) {
      throw new BadRequestException(`Invalid credentials: ${validationResult.error}`);
    }

    // Encrypt credentials
    const encryptedData = await this.encrypt(JSON.stringify(createDto.credentials));

    const credential = await this.prisma.integrationCredential.create({
      data: {
        name: createDto.name,
        type: createDto.type,
        provider: createDto.provider,
        encryptedData: { data: encryptedData },
        metadata: createDto.metadata,
        expiresAt: createDto.expiresAt,
        createdBy: userId,
      },
    });

    this.logger.log(`Created credential with ID: ${credential.id}`);
    return credential;
  }

  /**
   * Get all credentials for a user
   */
  async findAllCredentials(userId?: string): Promise<IntegrationCredential[]> {
    const where = userId ? { createdBy: userId } : {};
    
    return this.prisma.integrationCredential.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get credential by ID
   */
  async findCredentialById(id: string): Promise<IntegrationCredential> {
    const credential = await this.prisma.integrationCredential.findUnique({
      where: { id },
    });

    if (!credential) {
      throw new NotFoundException(`Credential with ID ${id} not found`);
    }

    return credential;
  }

  /**
   * Update credential
   */
  async updateCredential(
    id: string,
    updateDto: UpdateIntegrationCredentialDto
  ): Promise<IntegrationCredential> {
    const existingCredential = await this.findCredentialById(id);

    let encryptedData = existingCredential.encryptedData;
    if (updateDto.credentials) {
      // Validate new credentials
      const validationResult = await this.validateCredential(updateDto.type, updateDto.credentials);
      if (!validationResult.isValid) {
        throw new BadRequestException(`Invalid credentials: ${validationResult.error}`);
      }

      // Encrypt new credentials
      encryptedData = { data: await this.encrypt(JSON.stringify(updateDto.credentials)) };
    }

    const updatedCredential = await this.prisma.integrationCredential.update({
      where: { id },
      data: {
        name: updateDto.name,
        type: updateDto.type,
        provider: updateDto.provider,
        encryptedData,
        metadata: updateDto.metadata,
        expiresAt: updateDto.expiresAt,
        isActive: updateDto.isActive,
      },
    });

    this.logger.log(`Updated credential with ID: ${id}`);
    return updatedCredential;
  }

  /**
   * Delete credential
   */
  async deleteCredential(id: string): Promise<void> {
    await this.findCredentialById(id); // Check if exists

    await this.prisma.integrationCredential.delete({
      where: { id },
    });

    this.logger.log(`Deleted credential with ID: ${id}`);
  }

  /**
   * Get decrypted credentials
   */
  async getDecryptedCredentials(id: string): Promise<Record<string, any>> {
    const credential = await this.findCredentialById(id);
    
    if (!credential.isActive) {
      throw new BadRequestException('Credential is not active');
    }

    // Check if credential has expired
    if (credential.expiresAt && credential.expiresAt < new Date()) {
      throw new BadRequestException('Credential has expired');
    }

    const encryptedData = (credential.encryptedData as any).data;
    return JSON.parse(await this.decrypt(encryptedData));
  }

  /**
   * Test credential connection
   */
  async testCredential(id: string): Promise<CredentialValidationResult> {
    try {
      const credential = await this.findCredentialById(id);
      const decryptedCredentials = await this.getDecryptedCredentials(id);
      
      const result = await this.validateCredential(credential.type, decryptedCredentials);
      
      this.logger.log(`Tested credential ${id}: ${result.isValid ? 'SUCCESS' : 'FAILED'}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to test credential ${id}: ${error.message}`);
      return {
        isValid: false,
        error: error.message,
      };
    }
  }

  /**
   * Refresh OAuth2 credentials
   */
  async refreshOAuth2Credential(id: string): Promise<IntegrationCredential> {
    const credential = await this.findCredentialById(id);
    
    if (credential.type !== CredentialType.OAUTH2) {
      throw new BadRequestException('Credential is not OAuth2 type');
    }

    const decryptedCredentials = await this.getDecryptedCredentials(id) as OAuth2Credentials;
    
    // Implement OAuth2 refresh logic here
    // This would typically involve calling the provider's token endpoint
    const refreshedCredentials = await this.refreshOAuth2Token(decryptedCredentials);
    
    // Update credential with new tokens
    const encryptedData = await this.encrypt(JSON.stringify(refreshedCredentials));
    
    const updatedCredential = await this.prisma.integrationCredential.update({
      where: { id },
      data: {
        encryptedData: { data: encryptedData },
        expiresAt: refreshedCredentials.expiresAt,
      },
    });

    this.logger.log(`Refreshed OAuth2 credential with ID: ${id}`);
    return updatedCredential;
  }

  // ICredentialVault implementation
  async encrypt(credentials: string, key?: string): Promise<string> {
    return EncryptionUtil.encrypt(credentials, key || this.encryptionKey);
  }

  async decrypt(encryptedData: string, key?: string): Promise<string> {
    return EncryptionUtil.decrypt(encryptedData, key || this.encryptionKey);
  }

  generateSecret(): string {
    return EncryptionUtil.generateSecret();
  }

  async validateCredential(type: CredentialType, credentials: Record<string, any>): Promise<CredentialValidationResult> {
    try {
      switch (type) {
        case CredentialType.OAUTH2:
          return this.validateOAuth2Credentials(credentials as OAuth2Credentials);
        case CredentialType.API_KEY:
          return this.validateAPIKeyCredentials(credentials as APIKeyCredentials);
        case CredentialType.BASIC_AUTH:
          return this.validateBasicAuthCredentials(credentials as BasicAuthCredentials);
        case CredentialType.JWT:
          return this.validateJWTCredentials(credentials as JWTCredentials);
        case CredentialType.WEBHOOK_SECRET:
          return this.validateWebhookSecretCredentials(credentials as WebhookSecretCredentials);
        default:
          return {
            isValid: false,
            error: `Unsupported credential type: ${type}`,
          };
      }
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
      };
    }
  }

  private async validateOAuth2Credentials(credentials: OAuth2Credentials): Promise<CredentialValidationResult> {
    if (!credentials.clientId || !credentials.clientSecret) {
      return {
        isValid: false,
        error: 'Missing required OAuth2 fields: clientId, clientSecret',
      };
    }

    // In a real implementation, you would validate the credentials with the provider
    // For now, we'll do basic validation
    return {
      isValid: true,
      expiresAt: credentials.expiresAt,
      metadata: {
        scope: credentials.scope,
        tokenType: credentials.tokenType,
      },
    };
  }

  private async validateAPIKeyCredentials(credentials: APIKeyCredentials): Promise<CredentialValidationResult> {
    if (!credentials.apiKey) {
      return {
        isValid: false,
        error: 'Missing required API key',
      };
    }

    // In a real implementation, you would test the API key with the provider
    return {
      isValid: true,
      metadata: {
        baseUrl: credentials.baseUrl,
        headers: credentials.headers,
      },
    };
  }

  private async validateBasicAuthCredentials(credentials: BasicAuthCredentials): Promise<CredentialValidationResult> {
    if (!credentials.username || !credentials.password) {
      return {
        isValid: false,
        error: 'Missing required basic auth fields: username, password',
      };
    }

    // In a real implementation, you would test the credentials with the provider
    return {
      isValid: true,
      metadata: {
        baseUrl: credentials.baseUrl,
      },
    };
  }

  private async validateJWTCredentials(credentials: JWTCredentials): Promise<CredentialValidationResult> {
    if (!credentials.token) {
      return {
        isValid: false,
        error: 'Missing required JWT token',
      };
    }

    // In a real implementation, you would validate the JWT token
    return {
      isValid: true,
      expiresAt: credentials.expiresAt,
      metadata: {
        algorithm: credentials.algorithm,
      },
    };
  }

  private async validateWebhookSecretCredentials(credentials: WebhookSecretCredentials): Promise<CredentialValidationResult> {
    if (!credentials.secret) {
      return {
        isValid: false,
        error: 'Missing required webhook secret',
      };
    }

    return {
      isValid: true,
      metadata: {
        algorithm: credentials.algorithm || 'sha256',
      },
    };
  }

  private async refreshOAuth2Token(credentials: OAuth2Credentials): Promise<OAuth2Credentials> {
    // In a real implementation, you would call the provider's token endpoint
    // For now, we'll return the same credentials
    return credentials;
  }
}
