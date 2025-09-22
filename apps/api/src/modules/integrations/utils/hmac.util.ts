import { createHmac, timingSafeEqual } from 'crypto';

export class HMACUtil {
  private static readonly ALGORITHM = 'sha256';

  /**
   * Generate HMAC-SHA256 signature
   */
  static generateSignature(payload: string, secret: string): string {
    const hmac = createHmac(this.ALGORITHM, secret);
    hmac.update(payload);
    return hmac.digest('hex');
  }

  /**
   * Generate HMAC-SHA256 signature for webhook payload
   */
  static generateWebhookSignature(
    payload: Record<string, any>, 
    secret: string, 
    timestamp?: number
  ): string {
    const payloadString = JSON.stringify(payload);
    const timestampString = timestamp ? timestamp.toString() : Date.now().toString();
    const message = `${timestampString}.${payloadString}`;
    
    return this.generateSignature(message, secret);
  }

  /**
   * Verify HMAC-SHA256 signature
   */
  static verifySignature(
    payload: string, 
    signature: string, 
    secret: string
  ): boolean {
    const expectedSignature = this.generateSignature(payload, secret);
    return this.timingSafeCompare(signature, expectedSignature);
  }

  /**
   * Verify webhook signature with timestamp
   */
  static verifyWebhookSignature(
    payload: Record<string, any>,
    signature: string,
    secret: string,
    timestamp: number,
    tolerance: number = 300000 // 5 minutes
  ): boolean {
    const now = Date.now();
    const timeDiff = Math.abs(now - timestamp);
    
    // Check timestamp tolerance
    if (timeDiff > tolerance) {
      return false;
    }
    
    const expectedSignature = this.generateWebhookSignature(payload, secret, timestamp);
    return this.timingSafeCompare(signature, expectedSignature);
  }

  /**
   * Timing-safe string comparison to prevent timing attacks
   */
  private static timingSafeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }
    
    const bufferA = Buffer.from(a, 'hex');
    const bufferB = Buffer.from(b, 'hex');
    
    return timingSafeEqual(bufferA, bufferB);
  }

  /**
   * Generate signature for tokenization bridge events
   */
  static generateBridgeSignature(
    eventId: string,
    eventType: string,
    entityId: string,
    data: Record<string, any>,
    secret: string
  ): string {
    const payload = {
      eventId,
      eventType,
      entityId,
      data,
      timestamp: Date.now()
    };
    
    return this.generateSignature(JSON.stringify(payload), secret);
  }

  /**
   * Verify tokenization bridge signature
   */
  static verifyBridgeSignature(
    eventId: string,
    eventType: string,
    entityId: string,
    data: Record<string, any>,
    signature: string,
    secret: string
  ): boolean {
    const expectedSignature = this.generateBridgeSignature(
      eventId,
      eventType,
      entityId,
      data,
      secret
    );
    
    return this.timingSafeCompare(signature, expectedSignature);
  }
}
