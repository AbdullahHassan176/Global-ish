import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type GenerateRegistrationOptionsOpts,
  type GenerateAuthenticationOptionsOpts,
  type VerifyRegistrationResponseOpts,
  type VerifyAuthenticationResponseOpts
} from '@simplewebauthn/server';
import { WebAuthnCredential } from '@global-next/types';

export interface WebAuthnConfig {
  rpName: string;
  rpID: string;
  origin: string;
}

export interface RegistrationOptions {
  challenge: string;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    type: 'public-key';
    alg: number;
  }>;
  authenticatorSelection: {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    userVerification?: 'required' | 'preferred' | 'discouraged';
    residentKey?: 'required' | 'preferred' | 'discouraged';
  };
  timeout: number;
  attestation: 'none' | 'indirect' | 'direct';
}

export interface AuthenticationOptions {
  challenge: string;
  timeout: number;
  rpId: string;
  allowCredentials?: Array<{
    type: 'public-key';
    id: string;
    transports?: Array<'usb' | 'nfc' | 'ble' | 'internal'>;
  }>;
  userVerification?: 'required' | 'preferred' | 'discouraged';
}

export class WebAuthnService {
  constructor(private config: WebAuthnConfig) {}

  async generateRegistrationOptions(
    userId: string,
    userEmail: string,
    existingCredentials: WebAuthnCredential[] = []
  ): Promise<RegistrationOptions> {
    const options: GenerateRegistrationOptionsOpts = {
      rpName: this.config.rpName,
      rpID: this.config.rpID,
      userID: userId,
      userName: userEmail,
      userDisplayName: userEmail,
      attestationType: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'preferred',
        residentKey: 'preferred'
      },
      supportedAlgorithmIDs: [-7, -257], // ES256 and RS256
      excludeCredentials: existingCredentials.map(cred => ({
        id: Buffer.from(cred.credentialId, 'base64'),
        type: 'public-key',
        transports: ['internal', 'hybrid']
      }))
    };

    return await generateRegistrationOptions(options);
  }

  async verifyRegistrationResponse(
    response: any,
    expectedChallenge: string,
    expectedOrigin: string
  ): Promise<{
    verified: boolean;
    credentialId: string;
    publicKey: string;
  }> {
    const verification: VerifyRegistrationResponseOpts = {
      response,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: this.config.rpID
    };

    const result = await verifyRegistrationResponse(verification);

    if (result.verified && result.registrationInfo) {
      return {
        verified: true,
        credentialId: Buffer.from(result.registrationInfo.credentialID).toString('base64'),
        publicKey: Buffer.from(result.registrationInfo.credentialPublicKey).toString('base64')
      };
    }

    return {
      verified: false,
      credentialId: '',
      publicKey: ''
    };
  }

  async generateAuthenticationOptions(
    existingCredentials: WebAuthnCredential[]
  ): Promise<AuthenticationOptions> {
    const options: GenerateAuthenticationOptionsOpts = {
      rpID: this.config.rpID,
      allowCredentials: existingCredentials.map(cred => ({
        id: Buffer.from(cred.credentialId, 'base64'),
        type: 'public-key',
        transports: ['internal', 'hybrid']
      })),
      userVerification: 'preferred'
    };

    return await generateAuthenticationOptions(options);
  }

  async verifyAuthenticationResponse(
    response: any,
    expectedChallenge: string,
    expectedOrigin: string,
    credential: WebAuthnCredential
  ): Promise<{
    verified: boolean;
    newCounter: number;
  }> {
    const verification: VerifyAuthenticationResponseOpts = {
      response,
      expectedChallenge,
      expectedOrigin,
      expectedRPID: this.config.rpID,
      credential: {
        credentialID: Buffer.from(credential.credentialId, 'base64'),
        credentialPublicKey: Buffer.from(credential.publicKey, 'base64'),
        counter: credential.counter
      }
    };

    const result = await verifyAuthenticationResponse(verification);

    return {
      verified: result.verified,
      newCounter: result.authenticationInfo?.newCounter || credential.counter
    };
  }

  createWebAuthnCredential(
    userId: string,
    credentialId: string,
    publicKey: string,
    name: string
  ): Omit<WebAuthnCredential, 'id' | 'createdAt' | 'lastUsedAt'> {
    return {
      userId,
      credentialId,
      publicKey,
      counter: 0,
      name
    };
  }
}
