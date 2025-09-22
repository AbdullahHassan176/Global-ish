import { Request, Response, NextFunction } from 'express';
import { SessionService } from '../session.service';
import { AuthenticationError } from '@global-next/types';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    sessionId: string;
    mfaVerified?: boolean;
  };
  session?: any;
}

export class AuthMiddleware {
  constructor(private sessionService: SessionService) {}

  authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.extractToken(req);
      
      if (!token) {
        throw new AuthenticationError('No authentication token provided');
      }

      const validation = await this.sessionService.validateSession(token);
      
      if (!validation.isValid) {
        throw new AuthenticationError(validation.error || 'Invalid session');
      }

      // Attach user info to request
      req.user = {
        id: validation.session!.userId,
        email: '', // Will be populated by the service
        role: '', // Will be populated by the service
        sessionId: validation.session!.id,
        mfaVerified: false // Will be populated by the service
      };

      req.session = validation.session;
      next();
    } catch (error) {
      next(error);
    }
  };

  optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = this.extractToken(req);
      
      if (token) {
        const validation = await this.sessionService.validateSession(token);
        
        if (validation.isValid) {
          req.user = {
            id: validation.session!.userId,
            email: '',
            role: '',
            sessionId: validation.session!.id,
            mfaVerified: false
          };
          req.session = validation.session;
        }
      }
      
      next();
    } catch (error) {
      // For optional auth, we don't throw errors
      next();
    }
  };

  requireMFA = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!req.user.mfaVerified) {
      res.status(403).json({
        success: false,
        error: 'MFA verification required',
        code: 'MFA_REQUIRED'
      });
      return;
    }

    next();
  };

  private extractToken(req: Request): string | null {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check cookies
    if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }

    // Check query parameter (for WebSocket connections)
    if (req.query && req.query.token) {
      return req.query.token as string;
    }

    return null;
  }
}
