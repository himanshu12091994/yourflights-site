// ─────────────────────────────────────────────────────────────
// YOUR FLIGHTS LLC — Core Domain Entities & Types
// Enterprise Operations, CRM, Payments, Service Delivery, and Compliance
// Primary MCC: 7299 (Personal Concierge) | Secondary MCC: 8999 (Independent Consulting)
// ─────────────────────────────────────────────────────────────

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'OPERATIONS'
  | 'FINANCE'
  | 'SUPPORT'
  | 'READ_ONLY';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  passwordHash?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string; // e.g. "CUST-2026-0012"
  name: string;
  email: string;
  phone?: string;
  country?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number; // in USD
  outstandingBalance: number;
  lastOrderDate?: string;
  internalNotes?: string;
  status: 'ACTIVE' | 'VIP' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'New'
  | 'Under Review'
  | 'Awaiting Payment'
  | 'Payment Received'
  | 'Processing'
  | 'Ready for Delivery'
  | 'Delivered'
  | 'Acknowledgement Pending'
  | 'Acknowledged'
  | 'Completed'
  | 'On Hold'
  | 'Cancelled'
  | 'Payment Failed'
  | 'Refund Pending'
  | 'Refunded';

export type PaymentStatus =
  | 'Pending'
  | 'Successful'
  | 'Failed'
  | 'Cancelled'
  | 'Refund Pending'
  | 'Refunded'
  | 'Partially Refunded';

export type PaymentMethodType = 'card' | 'payment_link' | 'virtual_terminal' | 'manual';
export type PaymentProvider = 'stripe' | 'razorpay' | 'paypal' | 'simulation' | 'cashfree';

export interface Order {
  id: string; // Human-readable, e.g. "YF-2026-000182"
  orderRef: string; // e.g. "YF-892104"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCountry?: string;
  
  serviceId: string;
  serviceName: string;
  serviceCategory: 'ITINERARY_PLANNING' | 'DESTINATION_RESEARCH' | 'TRAVEL_PREP' | 'CUSTOM_ADVISORY';
  
  status: OrderStatus;
  
  // Financial fields
  originalAmount: number;
  discount: number;
  finalAmount: number;
  amountPaid: number;
  remainingAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethodType;
  
  assignedAdvisor: string;
  customerNotes?: string;
  internalNotes?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistoryItem {
  id: string;
  orderId: string;
  previousStatus: OrderStatus;
  newStatus: OrderStatus;
  changedBy: string;
  reason?: string;
  timestamp: string;
}

export interface FinancialAdjustmentAudit {
  id: string;
  orderId: string;
  previousAmount: number;
  newAmount: number;
  previousDiscount: number;
  newDiscount: number;
  changedBy: string;
  reason: string;
  timestamp: string;
}

export interface PaymentTransaction {
  id: string; // e.g. "PAY-2026-00123"
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  providerTransactionId?: string; // Stripe PaymentIntent ID or Session ID
  providerPaymentMethodId?: string;
  cardBrand?: string;
  last4?: string;
  paymentUrl?: string;
  isTestMode?: boolean;
  refundStatus?: 'NONE' | 'PARTIAL' | 'FULL';
  refundAmount?: number;
  createdTime: string;
  completedTime?: string;
}

export interface ServiceDefinition {
  id: string;
  name: string;
  category: 'ITINERARY_PLANNING' | 'DESTINATION_RESEARCH' | 'TRAVEL_PREP' | 'CUSTOM_ADVISORY';
  description: string;
  price: number;
  currency: string;
  mccCode: '7299' | '8999';
  status: 'ACTIVE' | 'ARCHIVED';
  defaultInclusionsTemplate: string;
  defaultTermsTemplate: string;
  requiredFields: string[];
}

export interface ServiceDelivery {
  id: string; // e.g. "DEL-2026-101"
  orderId: string;
  customerId: string;
  version: number;
  inclusions: string;
  terms: string;
  notes?: string;
  status: 'Draft' | 'Ready' | 'Sent' | 'Acknowledged';
  sentAt?: string;
  acknowledgedAt?: string;
  signedToken?: string;
  tokenExpiresAt?: string;
  compiledHtml?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientAcknowledgement {
  id: string; // e.g. "ACK-1715000000"
  orderId: string;
  customerId: string;
  deliveryId: string;
  timestamp: string;
  clientIp: string;
  userAgent: string;
  browser: string;
  os: string;
  deviceType: string;
  approxLocation?: string;
  mccAgreement: 'ACCEPTED';
  disclosuresText: string;
  serviceName: string;
  amount: number;
  currency: string;
  isTestMode?: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  description: string;
  variables: string[];
}

export interface EmailLog {
  id: string;
  orderId?: string;
  customerId?: string;
  recipient: string;
  subject: string;
  bodyHtml?: string;
  bodyText?: string;
  templateId?: string;
  emailType: string;
  sentTimestamp: string;
  deliveryStatus: 'SENT' | 'FAILED' | 'SIMULATED';
  providerMessageId?: string;
  failureReason?: string;
}

export interface SystemAuditLog {
  id: string;
  actor: string;
  actorRole?: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  clientIp?: string;
  oldValues?: any;
  newValues?: any;
  reason?: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PAYMENT' | 'DELIVERY' | 'ACKNOWLEDGEMENT' | 'SYSTEM' | 'SECURITY';
  read: boolean;
  link?: string;
  createdAt: string;
}
