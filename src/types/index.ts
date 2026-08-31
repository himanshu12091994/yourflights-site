// ─────────────────────────────────────────────────────────────
// Shared TypeScript types for Your Flights LLC
// Single source of truth for all type definitions used
// across both client (src/) and referenced by server logic.
// ─────────────────────────────────────────────────────────────

export type PageView =
  | 'home'
  | 'about'
  | 'contact'
  | 'custom_strategies'
  | 'market_research'
  | 'strategy_prep'
  | 'book_consult'
  | 'terms'
  | 'privacy'
  | 'refund'
  | 'cancellation'
  | 'shipping'
  | 'compliance'
  | 'guides'
  | 'admin'
  | 'payu-checkout'
  | 'acknowledge';

// Re-export Locale from translations to avoid duplicate type definitions
export type { Locale } from '../translations';

export type LegalModalType = 'terms' | 'privacy' | 'refund' | 'compliance';

export type ServiceModalType =
  | 'custom_strategy'
  | 'market_research'
  | 'strategy_prep'
  | null;

export type NewsletterStatus = 'idle' | 'submitting' | 'subscribed';

export interface AuditRecord {
  id: string;
  timestamp: string;
  mccAgreement: 'ACCEPTED';
  [key: string]: unknown;
}

export interface CheckoutState {
  purchasedServiceName: string;
  purchasedAmount: string;
  purchasedAuditRecord: AuditRecord | null;
  isTestModeActive: boolean;
}
