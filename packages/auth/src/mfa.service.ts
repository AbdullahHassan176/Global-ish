import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { MFASecret } from '@global-next/types';

export interface TOTPConfig {
  issuer: string;
  label: string;
}

export class MFAService {
  constructor(private config: TOTPConfig) {}

  generateSecret(userEmail: string): { secret: string; qrCodeUrl: string } {
    const secret = speakeasy.generateSecret({
      name: `${this.config.label} (${userEmail})`,
      issuer: this.config.issuer,
      length: 32
    });

    return {
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url!
    };
  }

  generateQRCode(secret: string, userEmail: string): Promise<string> {
    const otpauthUrl = speakeasy.otpauthURL({
      secret,
      label: `${this.config.label} (${userEmail})`,
      issuer: this.config.issuer,
      encoding: 'base32'
    });

    return QRCode.toDataURL(otpauthUrl);
  }

  verifyTOTP(token: string, secret: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2 // Allow 2 time steps before/after current time
    });
  }

  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    for (let i = 0; i < count; i++) {
      let code = '';
      for (let j = 0; j < 8; j++) {
        code += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      codes.push(code);
    }
    
    return codes;
  }

  verifyBackupCode(code: string, usedCodes: string[]): boolean {
    // Check if code is valid format (8 alphanumeric characters)
    if (!/^[A-Z0-9]{8}$/.test(code)) {
      return false;
    }

    // Check if code has already been used
    return !usedCodes.includes(code);
  }

  hashBackupCode(code: string): string {
    // Simple hash for backup codes (they're single-use anyway)
    return Buffer.from(code).toString('base64');
  }

  createMFASecret(userId: string, userEmail: string): {
    mfaSecret: Omit<MFASecret, 'id' | 'createdAt' | 'verifiedAt'>;
    qrCodeUrl: string;
  } {
    const { secret, qrCodeUrl } = this.generateSecret(userEmail);
    const backupCodes = this.generateBackupCodes();

    const mfaSecret: Omit<MFASecret, 'id' | 'createdAt' | 'verifiedAt'> = {
      userId,
      secret,
      backupCodes: backupCodes.map(code => this.hashBackupCode(code))
    };

    return {
      mfaSecret,
      qrCodeUrl
    };
  }
}
