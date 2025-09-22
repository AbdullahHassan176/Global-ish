import { createCipher, createDecipher, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class EncryptionUtil {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 16;
  private static readonly TAG_LENGTH = 16;

  /**
   * Encrypt data using AES-256-GCM
   */
  static async encrypt(data: string, password: string): Promise<string> {
    const iv = randomBytes(this.IV_LENGTH);
    const key = await this.deriveKey(password);
    
    const cipher = createCipher(this.ALGORITHM, key);
    cipher.setAAD(Buffer.from('global-next-integrations', 'utf8'));
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Combine IV + tag + encrypted data
    const combined = iv.toString('hex') + tag.toString('hex') + encrypted;
    
    return Buffer.from(combined, 'hex').toString('base64');
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  static async decrypt(encryptedData: string, password: string): Promise<string> {
    const combined = Buffer.from(encryptedData, 'base64').toString('hex');
    
    const iv = Buffer.from(combined.substring(0, this.IV_LENGTH * 2), 'hex');
    const tag = Buffer.from(
      combined.substring(this.IV_LENGTH * 2, (this.IV_LENGTH + this.TAG_LENGTH) * 2), 
      'hex'
    );
    const encrypted = combined.substring((this.IV_LENGTH + this.TAG_LENGTH) * 2);
    
    const key = await this.deriveKey(password);
    
    const decipher = createDecipher(this.ALGORITHM, key);
    decipher.setAAD(Buffer.from('global-next-integrations', 'utf8'));
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Derive encryption key from password using scrypt
   */
  private static async deriveKey(password: string): Promise<Buffer> {
    const salt = Buffer.from('global-next-integrations-salt', 'utf8');
    return (await scryptAsync(password, salt, this.KEY_LENGTH)) as Buffer;
  }

  /**
   * Generate a random secret key
   */
  static generateSecret(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  /**
   * Hash data using SHA-256
   */
  static hash(data: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
