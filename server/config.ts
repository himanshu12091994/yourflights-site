// ─────────────────────────────────────────────────────────────
// Server configuration — environment variables & file paths.
// All server modules import from this single config file.
// ─────────────────────────────────────────────────────────────
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT || '3000', 10);

export const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

export const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || 'YourProjectsAdmin2026!';

export const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || '';
export const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || '';
export const PAYU_ENV = process.env.PAYU_ENV || 'TEST'; // 'TEST' or 'PROD'

export const SMTP = {
  HOST: process.env.SMTP_HOST || 'smtp.hostinger.com',
  PORT: parseInt(process.env.SMTP_PORT || '465', 10),
  USER: process.env.SMTP_USER || 'support@yourflightsllc.com',
  PASS:
    process.env.SMTP_PASS ||
    process.env.SMTP_PASSWORD ||
    process.env.EMAIL_PASS ||
    process.env.EMAIL_PASSWORD ||
    process.env.HOSTINGER_SMTP_PASS ||
    '',
  FROM:
    process.env.SMTP_FROM || 'Your Flights LLC <support@yourflightsllc.com>',
} as const;

// Persistent data file paths (stored at project root)
export const AUDIT_LOG_FILE = path.join(process.cwd(), 'audit_logs.json');
export const DELIVERABLES_FILE = path.join(process.cwd(), 'deliverables.json');

// Allowed Stripe currencies
export const ALLOWED_CURRENCIES = ['usd', 'eur', 'gbp', 'cad', 'aud'];

// MCC & Brand constants (mirrors src/config/constants.ts for server-side use)
export const BRAND = {
  DBA: 'Your Flights',
  LEGAL_ENTITY: 'Your Flights LLC',
  DOMAIN: 'yourflightsllc.com',
  WEBSITE: 'https://yourflightsllc.com',
} as const;

export const STATEMENT_DESCRIPTOR = {
  FULL: 'YOUR FLIGHTS ADVISORY',
  DOMAIN: 'YOURFLIGHTSLLC.COM',
  SUFFIX: 'ADVISORY',
} as const;

export const MCC = {
  PRIMARY_LABEL: 'MCC 8999 (Professional Services / Personal Concierge)',
  SECONDARY_LABEL: 'MCC 8999 (Professional Services / Independent Consulting)',
} as const;
