import { CredentialType } from '@prisma/client';

export interface ICredentialVault {
  encrypt(credentials: Record<string, any>, key?: string): Promise<string>;
  decrypt(encryptedData: string, key?: string): Promise<Record<string, any>>;
  generateSecret(): string;
  validateCredential(type: CredentialType, credentials: Record<string, any>): Promise<boolean>;
}

export interface ICredentialProvider {
  name: string;
  type: CredentialType;
  validate(credentials: Record<string, any>): Promise<boolean>;
  refresh?(credentials: Record<string, any>): Promise<Record<string, any>>;
  revoke?(credentials: Record<string, any>): Promise<void>;
}

export interface OAuth2Credentials {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresAt?: Date;
  scope?: string[];
}

export interface APIKeyCredentials {
  apiKey: string;
  apiSecret?: string;
  baseUrl?: string;
  headers?: Record<string, string>;
}

export interface BasicAuthCredentials {
  username: string;
  password: string;
  baseUrl?: string;
}

export interface JWTCredentials {
  token: string;
  secret?: string;
  algorithm?: string;
  expiresAt?: Date;
}

export interface WebhookSecretCredentials {
  secret: string;
  algorithm?: string;
}

export type CredentialData = 
  | OAuth2Credentials 
  | APIKeyCredentials 
  | BasicAuthCredentials 
  | JWTCredentials 
  | WebhookSecretCredentials;

export interface CredentialValidationResult {
  isValid: boolean;
  error?: string;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}
