import jwt from 'jsonwebtoken';
import { User, Session } from '@global-next/types';

export interface JWTPayload {
  sub: string; // user id
  email: string;
  role: string;
  sessionId: string;
  iat: number;
  exp: number;
  mfaVerified?: boolean;
}

export class JWTService {
  constructor(private secret: string, private expiresIn: string = '1h') {}

  generateToken(user: User, sessionId: string, mfaVerified: boolean = false): string {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId,
      mfaVerified
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
      issuer: 'global-next',
      audience: 'global-next-api'
    });
  }

  generateRefreshToken(user: User, sessionId: string): string {
    const payload = {
      sub: user.id,
      sessionId,
      type: 'refresh'
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: '7d',
      issuer: 'global-next',
      audience: 'global-next-api'
    });
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.secret, {
        issuer: 'global-next',
        audience: 'global-next-api'
      }) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  verifyRefreshToken(token: string): { sub: string; sessionId: string; type: string } {
    try {
      const payload = jwt.verify(token, this.secret, {
        issuer: 'global-next',
        audience: 'global-next-api'
      }) as any;

      if (payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return payload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;
    
    return Date.now() >= payload.exp * 1000;
  }
}
