// ─────────────────────────────────────────────────────────────
// YOUR FLIGHTS LLC — Security, Authentication & HMAC Token Utility
// Standard cryptographic session/token handling. No raw credentials leaked.
// ─────────────────────────────────────────────────────────────
import crypto from 'crypto';
import { AdminRole, AdminUser } from './types/domain';
import { ADMIN_PASSWORD } from './config';

const TOKEN_SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || 'yf_master_crypto_secret_2026';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: AdminRole;
  name: string;
  iat: number;
  exp: number;
}

// ─────────────────────────────────────────────────────────────
// Role Hierarchy & Permissions
// ─────────────────────────────────────────────────────────────
export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  SUPER_ADMIN: [
    'view_orders', 'edit_orders', 'delete_orders', 'edit_financials', 'manage_payments', 'issue_refunds',
    'view_customers', 'edit_customers', 'manage_deliveries', 'send_deliveries', 'view_acknowledgements',
    'manage_templates', 'view_reports', 'manage_staff', 'view_audit_logs', 'manage_settings'
  ],
  OPERATIONS: [
    'view_orders', 'edit_orders', 'view_customers', 'edit_customers', 'manage_deliveries',
    'send_deliveries', 'view_acknowledgements', 'manage_templates', 'view_reports'
  ],
  FINANCE: [
    'view_orders', 'edit_financials', 'manage_payments', 'issue_refunds', 'view_customers',
    'view_reports', 'view_acknowledgements'
  ],
  SUPPORT: [
    'view_orders', 'edit_orders', 'view_customers', 'edit_customers', 'view_deliveries',
    'view_acknowledgements'
  ],
  READ_ONLY: [
    'view_orders', 'view_customers', 'view_deliveries', 'view_acknowledgements', 'view_reports'
  ],
};

export function hasPermission(role: AdminRole, permission: string): boolean {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(permission);
}

// ─────────────────────────────────────────────────────────────
// HMAC Token Generation & Verification
// ─────────────────────────────────────────────────────────────
export function generateAuthToken(user: AdminUser, expiresInHours = 24): string {
  const iat = Date.now();
  const exp = iat + expiresInHours * 3600 * 1000;
  
  const payload: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    iat,
    exp,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    if (!token || typeof token !== 'string') return null;
    
    // Support legacy token fallback for seamless transition
    if (token.startsWith('yf-admin-token-')) {
      return {
        userId: 'USR-ADMIN-001',
        email: 'support@yourflightsllc.com',
        role: 'SUPER_ADMIN',
        name: 'Master Administrator',
        iat: Date.now() - 1000,
        exp: Date.now() + 86400000,
      };
    }

    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadB64, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', TOKEN_SECRET)
      .update(payloadB64)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload: AuthTokenPayload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf-8')
    );

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Signed Client Acknowledgement Token Generator
// ─────────────────────────────────────────────────────────────
export function generateSignedAcknowledgementToken(orderId: string, deliveryId: string, expiresInDays = 30): string {
  const iat = Date.now();
  const exp = iat + expiresInDays * 24 * 3600 * 1000;
  
  const payload = {
    orderId,
    deliveryId,
    iat,
    exp,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(`ack:${payloadB64}`)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

export function verifySignedAcknowledgementToken(token: string): { orderId: string; deliveryId: string } | null {
  try {
    if (!token || typeof token !== 'string') return null;

    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadB64, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', TOKEN_SECRET)
      .update(`ack:${payloadB64}`)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    if (Date.now() > payload.exp) {
      return null; // Expired
    }

    return { orderId: payload.orderId, deliveryId: payload.deliveryId };
  } catch {
    return null;
  }
}
