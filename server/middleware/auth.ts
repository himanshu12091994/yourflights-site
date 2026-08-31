// ─────────────────────────────────────────────────────────────
// YOUR FLIGHTS LLC — Express Authentication & RBAC Middleware
// ─────────────────────────────────────────────────────────────
import { Request, Response, NextFunction } from 'express';
import { verifyAuthToken, hasPermission, AuthTokenPayload } from '../auth';
import { AdminRole } from '../types/domain';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const tokenQuery = req.query.token as string;
  
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (authHeader) {
    token = authHeader.trim();
  } else if (tokenQuery) {
    token = tokenQuery.trim();
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token required',
    });
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication token',
    });
  }

  req.user = payload;
  next();
}

export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        success: false,
        error: `Permission denied: required role capability '${permission}' is missing for role '${req.user.role}'`,
      });
    }

    next();
  };
}

export function requireRole(...allowedRoles: AdminRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Allowed roles: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
}
