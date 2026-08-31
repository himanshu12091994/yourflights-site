// ─────────────────────────────────────────────────────────────
// YOUR FLIGHTS LLC — Unified Database & Relational Persistence Layer
// Thread-safe in-memory stores with atomic disk persistence.
// Preserves and migrates legacy deliverables.json & audit_logs.json.
// ─────────────────────────────────────────────────────────────
import fs from 'fs';
import path from 'path';
import {
  AdminUser,
  Customer,
  Order,
  OrderStatusHistoryItem,
  FinancialAdjustmentAudit,
  PaymentTransaction,
  ServiceDefinition,
  ServiceDelivery,
  ClientAcknowledgement,
  EmailTemplate,
  EmailLog,
  SystemAuditLog,
  AdminNotification,
  OrderStatus,
  PaymentStatus,
} from '../types/domain';
import { ADMIN_PASSWORD, AUDIT_LOG_FILE, DELIVERABLES_FILE } from '../config';

const DB_STORE_FILE = path.join(process.cwd(), 'database_store.json');

interface DatabaseSchema {
  version: number;
  users: AdminUser[];
  customers: Customer[];
  orders: Order[];
  statusHistory: OrderStatusHistoryItem[];
  financialAudits: FinancialAdjustmentAudit[];
  payments: PaymentTransaction[];
  services: ServiceDefinition[];
  deliveries: ServiceDelivery[];
  acknowledgements: ClientAcknowledgement[];
  emailTemplates: EmailTemplate[];
  emailLogs: EmailLog[];
  auditLogs: SystemAuditLog[];
  notifications: AdminNotification[];
}

// ─────────────────────────────────────────────────────────────
// Default Seed Definitions
// ─────────────────────────────────────────────────────────────
const DEFAULT_SERVICES: ServiceDefinition[] = [
  {
    id: 'SVC-ITINERARY-150',
    name: 'Custom Day-by-Day Strategy Planning Strategy',
    category: 'ITINERARY_PLANNING',
    description: 'Bespoke daily routing, project connection analysis, accommodation selection, and pace optimization.',
    price: 150,
    currency: 'usd',
    mccCode: '7299',
    status: 'ACTIVE',
    defaultInclusionsTemplate: `DELIVERABLE: Custom Day-by-Day Strategy Planning Strategy

PHASE 1: RESEARCH & FLIGHT ANALYSIS
• Optimal project routes, connections, layover logistics, and alternative airport reviews.
• Baggage policies, aircraft seating amenities, and hidden software vendor fee breakdowns.

PHASE 2: DESTINATION & ACCOMMODATION STRATEGY
• Curated selection of 3-5 boutique/luxury accommodations matching client preferences.
• Neighborhood safety, walkability, transit routing, and accessibility analysis.

PHASE 3: DAY-BY-DAY ROUTING & ACTIVITIES
• Customized day-by-day strategies, cultural landmarks, licenses, and pace optimization.`,
    defaultTermsTemplate: `By acknowledging this document, the Client understands and agrees that Your Flights LLC acts strictly as an independent consulting consultant (MCC 8999 / 8999). We do not issue consulting services or vendor contracts. The advisory fee is for professional research time and is non-refundable.`,
    requiredFields: ['destination', 'consultingDates', 'clientsCount'],
  },
  {
    id: 'SVC-RESEARCH-75',
    name: 'Destination Intelligence & Research Report',
    category: 'DESTINATION_RESEARCH',
    description: 'In-depth visa rules, entry permits, seasonal analysis, safety protocols, and neighborhood breakdowns.',
    price: 75,
    currency: 'usd',
    mccCode: '8999',
    status: 'ACTIVE',
    defaultInclusionsTemplate: `DELIVERABLE: Destination Intelligence & Research Report

1. DESTINATION & GEOPOLITICAL OVERVIEW
• Consulting climate, seasonal breakdown, currency exchange guidance, tipping etiquette.

2. CULTURAL DYNAMICS & SAFETY
• Local customs, dress codes, safety hotspots, transit app setups, medical emergency contacts.

3. ENTRY & VISA LOGISTICS
• Passport validity requirements, visa/e-Visa procedures, transit requirements.`,
    defaultTermsTemplate: `This report provides independent market intelligence under MCC 8999. All consulting requirements must be verified with relevant embassies. Advisory fees are non-refundable.`,
    requiredFields: ['destination', 'consultingPeriod'],
  },
  {
    id: 'SVC-PREP-50',
    name: 'Pre-Departure Strategy Prep & Safety Advisory',
    category: 'TRAVEL_PREP',
    description: 'Minimalist packing checklists, currency management, mobile transit configuration, and safety rules.',
    price: 50,
    currency: 'usd',
    mccCode: '8999',
    status: 'ACTIVE',
    defaultInclusionsTemplate: `DELIVERABLE: Pre-Departure Strategy Prep & Safety Advisory

1. DOCUMENTATION & CHECKLISTS
• Passport validity checklists, digital backups, foreign transaction card strategy.

2. HEALTH & PACKING PROTOCOLS
• Tailored packing lists, universal adapters, voltage guides, medication consulting rules.`,
    defaultTermsTemplate: `Advisory guide for pre-departure logistics under MCC 8999. Non-refundable fee for consulting time rendered.`,
    requiredFields: ['destination'],
  },
];

const DEFAULT_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl-order-confirmation',
    name: 'Order Confirmation & Receipt',
    subject: 'Order Confirmation #{{order_id}} — Your Flights LLC',
    bodyHtml: `<p>Dear {{customer_name}},</p><p>Thank you for choosing Your Flights LLC. Your order <strong>#{{order_id}}</strong> for <strong>{{service_name}}</strong> ($${'{{amount}}'}) has been confirmed.</p><p>Our advisory team has commenced research.</p>`,
    bodyText: `Dear {{customer_name}},\n\nYour order #{{order_id}} for {{service_name}} ($${'{{amount}}'}) is confirmed.\n\nYour Flights LLC`,
    description: 'Sent immediately after client payment confirmation.',
    variables: ['customer_name', 'order_id', 'service_name', 'amount', 'order_date'],
  },
  {
    id: 'tpl-payment-request',
    name: 'Payment Request & Invoice Link',
    subject: 'Payment Request for Order #{{order_id}} — Your Flights LLC',
    bodyHtml: `<p>Dear {{customer_name}},</p><p>Please review and complete the payment of <strong>$${'{{amount}}'} USD</strong> for your consulting advisory package: <strong>{{service_name}}</strong>.</p><p><a href="{{payment_link}}" style="background:#2563eb;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:bold;">Complete Payment Securely</a></p>`,
    bodyText: `Dear {{customer_name}},\n\nPlease complete payment of $${'{{amount}}'} USD for {{service_name}} using this link: {{payment_link}}\n\nYour Flights LLC`,
    description: 'Dispatched when generating a custom payment invoice link.',
    variables: ['customer_name', 'order_id', 'service_name', 'amount', 'payment_link'],
  },
  {
    id: 'tpl-service-delivery',
    name: 'Service Delivery & Terms Acknowledgment',
    subject: 'Your Flights Advisory Package & Receipt #{{order_id}} — Action Required',
    bodyHtml: `<p>Dear {{customer_name}},</p><p>Your customized <strong>{{service_name}}</strong> package is ready. Please review the attached PDF and click below to acknowledge receipt of your advisory deliverables.</p><p><a href="{{acknowledgement_link}}" style="background:#059669;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Acknowledge Receipt of Deliverables</a></p>`,
    bodyText: `Dear {{customer_name}},\n\nYour advisory deliverables are attached. Please acknowledge receipt here: {{acknowledgement_link}}\n\nYour Flights LLC`,
    description: 'Sent with the generated PDF deliverable attachment.',
    variables: ['customer_name', 'order_id', 'service_name', 'acknowledgement_link'],
  },
  {
    id: 'tpl-order-completed',
    name: 'Order Completed',
    subject: 'Advisory Consultation Completed #{{order_id}} — Your Flights LLC',
    bodyHtml: `<p>Dear {{customer_name}},</p><p>Your advisory consultation for <strong>{{service_name}}</strong> is now complete. We wish you safe and seamless consultings!</p>`,
    bodyText: `Dear {{customer_name}},\n\nYour advisory consultation #{{order_id}} is complete.\n\nYour Flights LLC`,
    description: 'Sent when the deliverable lifecycle concludes.',
    variables: ['customer_name', 'order_id', 'service_name'],
  },
];

class DatabaseStore {
  private data: DatabaseSchema = {
    version: 2,
    users: [],
    customers: [],
    orders: [],
    statusHistory: [],
    financialAudits: [],
    payments: [],
    services: DEFAULT_SERVICES,
    deliveries: [],
    acknowledgements: [],
    emailTemplates: DEFAULT_EMAIL_TEMPLATES,
    emailLogs: [],
    auditLogs: [],
    notifications: [],
  };

  constructor() {
    this.initDatabase();
  }

  private initDatabase(): void {
    let loadedFromDbFile = false;

    // 1. Try to load existing database_store.json
    if (fs.existsSync(DB_STORE_FILE)) {
      try {
        const raw = fs.readFileSync(DB_STORE_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        loadedFromDbFile = true;
        console.log(`[DB STORE] Loaded ${this.data.orders.length} orders and ${this.data.customers.length} customers from ${DB_STORE_FILE}`);
      } catch (err) {
        console.error('[DB STORE] Error reading database_store.json, will attempt migration from legacy files:', err);
      }
    }

    // 2. If not loaded or empty, perform legacy migration from deliverables.json & audit_logs.json
    if (!loadedFromDbFile || this.data.orders.length === 0) {
      this.migrateLegacyData();
    }

    // 3. Ensure master admin user exists
    this.ensureMasterAdmin();

    // 4. Ensure default services & email templates exist
    if (!this.data.services || this.data.services.length === 0) {
      this.data.services = DEFAULT_SERVICES;
    }
    if (!this.data.emailTemplates || this.data.emailTemplates.length === 0) {
      this.data.emailTemplates = DEFAULT_EMAIL_TEMPLATES;
    }

    // Save initial state
    this.persist();
  }

  private ensureMasterAdmin(): void {
    const existing = this.data.users.find((u) => u.role === 'SUPER_ADMIN');
    if (!existing) {
      this.data.users.push({
        id: 'USR-ADMIN-001',
        name: 'Master Staff Administrator',
        email: 'support@yourflightsllc.com',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  private migrateLegacyData(): void {
    console.log('[DB STORE] Migrating legacy deliverables and audit records...');

    // Load deliverables.json
    if (fs.existsSync(DELIVERABLES_FILE)) {
      try {
        const raw = fs.readFileSync(DELIVERABLES_FILE, 'utf-8');
        const deliverables: any[] = JSON.parse(raw);

        deliverables.forEach((item, idx) => {
          const customerEmail = item.clientEmail || `client${idx}@example.com`;
          let customer = this.data.customers.find((c) => c.email.toLowerCase() === customerEmail.toLowerCase());

          if (!customer) {
            customer = {
              id: `CUST-${new Date().getFullYear()}-${String(this.data.customers.length + 1).padStart(4, '0')}`,
              name: item.clientName || 'Valued Client',
              email: customerEmail,
              totalOrders: 0,
              totalSpent: 0,
              outstandingBalance: 0,
              status: 'ACTIVE',
              createdAt: item.createdAt || new Date().toISOString(),
              updatedAt: item.updatedAt || new Date().toISOString(),
            };
            this.data.customers.push(customer);
          }

          customer.totalOrders += 1;
          customer.totalSpent += Number(item.amount) || 150;
          customer.lastOrderDate = item.createdAt;

          // Map to standard Order
          const orderId = item.orderRef && item.orderRef.startsWith('YF-')
            ? item.orderRef
            : `YF-${new Date().getFullYear()}-${String(100000 + idx)}`;

          const mappedStatus: OrderStatus =
            item.status === 'Fulfilled / Delivered'
              ? 'Delivered'
              : item.status === 'Cancelled'
              ? 'Cancelled'
              : item.status === 'In Research'
              ? 'Processing'
              : item.status === 'Draft Strategy Review'
              ? 'Ready for Delivery'
              : 'New';

          const newOrder: Order = {
            id: orderId,
            orderRef: item.orderRef || orderId,
            customerId: customer.id,
            customerName: item.clientName || 'Valued Client',
            customerEmail: customerEmail,
            serviceId: item.amount === 75 ? 'SVC-RESEARCH-75' : item.amount === 50 ? 'SVC-PREP-50' : 'SVC-ITINERARY-150',
            serviceName: item.serviceName || 'Custom Day-by-Day Strategy Planning Strategy',
            serviceCategory: item.amount === 75 ? 'DESTINATION_RESEARCH' : item.amount === 50 ? 'TRAVEL_PREP' : 'ITINERARY_PLANNING',
            status: mappedStatus,
            originalAmount: Number(item.amount) || 150,
            discount: 0,
            finalAmount: Number(item.amount) || 150,
            amountPaid: Number(item.amount) || 150,
            remainingAmount: 0,
            currency: item.currency || 'usd',
            paymentStatus: 'Successful',
            paymentMethod: 'card',
            assignedAdvisor: item.assignedAdvisor || 'Sarah Jenkins (Senior Strategist)',
            customerNotes: item.notes,
            internalNotes: 'Migrated from legacy deliverable intake.',
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString(),
          };

          this.data.orders.push(newOrder);

          // Initial status history
          this.data.statusHistory.push({
            id: `HIST-${Date.now()}-${idx}`,
            orderId: newOrder.id,
            previousStatus: 'New',
            newStatus: mappedStatus,
            changedBy: 'System Migration',
            reason: 'Initial migration from deliverables.json',
            timestamp: newOrder.createdAt,
          });

          // Create payment record
          this.data.payments.push({
            id: `PAY-MIG-${1000 + idx}`,
            orderId: newOrder.id,
            customerId: customer.id,
            amount: newOrder.finalAmount,
            currency: newOrder.currency,
            status: 'Successful',
            provider: 'stripe',
            providerTransactionId: `legacy_txn_${item.id}`,
            createdTime: newOrder.createdAt,
            completedTime: newOrder.createdAt,
          });

          // If delivery acknowledged
          if (item.isAcknowledged) {
            this.data.deliveries.push({
              id: item.id || `DEL-${100 + idx}`,
              orderId: newOrder.id,
              customerId: customer.id,
              version: 1,
              inclusions: 'Standard package inclusions.',
              terms: 'MCC 8999 / 8999 Terms accepted.',
              status: 'Acknowledged',
              sentAt: item.createdAt,
              acknowledgedAt: item.acknowledgmentData?.timestamp || item.updatedAt,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            });

            this.data.acknowledgements.push({
              id: `ACK-MIG-${1000 + idx}`,
              orderId: newOrder.id,
              customerId: customer.id,
              deliveryId: item.id || `DEL-${100 + idx}`,
              timestamp: item.acknowledgmentData?.timestamp || item.updatedAt,
              clientIp: item.acknowledgmentData?.ip || '127.0.0.1',
              userAgent: item.acknowledgmentData?.userAgent || 'Browser',
              browser: 'Standard Browser',
              os: 'Operating System',
              deviceType: 'Desktop/Mobile',
              approxLocation: item.acknowledgmentData?.location || 'United States',
              mccAgreement: 'ACCEPTED',
              disclosuresText: 'Client accepted advisory terms of service.',
              serviceName: newOrder.serviceName,
              amount: newOrder.finalAmount,
              currency: newOrder.currency,
            });
          }
        });
      } catch (e) {
        console.error('[DB STORE] Legacy deliverables migration error:', e);
      }
    }

    // Load audit_logs.json
    if (fs.existsSync(AUDIT_LOG_FILE)) {
      try {
        const raw = fs.readFileSync(AUDIT_LOG_FILE, 'utf-8');
        const audits: any[] = JSON.parse(raw);

        audits.forEach((aud, idx) => {
          this.data.auditLogs.push({
            id: aud.id || `AUD-MIG-${idx}`,
            actor: aud.clientName || 'Client / Direct',
            actorRole: 'CLIENT',
            action: 'MCC_AGREEMENT_ACCEPTED',
            entity: 'Order / Deliverable',
            entityId: aud.deliverableId || `AUD-${idx}`,
            timestamp: aud.timestamp || new Date().toISOString(),
            clientIp: aud.clientIp,
            newValues: {
              mccAgreement: aud.mccAgreement,
              serviceName: aud.serviceName,
              amount: aud.amount,
              disclosureText: aud.disclosureText,
            },
          });
        });
      } catch (e) {
        console.error('[DB STORE] Legacy audit logs migration error:', e);
      }
    }
  }

  public persist(): void {
    try {
      const tempPath = `${DB_STORE_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_STORE_FILE);

      // Keep legacy deliverables.json updated for backward compatibility
      this.syncLegacyDeliverablesFile();
    } catch (err) {
      console.error('[DB STORE] Atomic persistence error:', err);
    }
  }

  private syncLegacyDeliverablesFile(): void {
    try {
      const legacyDeliverables = this.data.orders.map((o) => {
        const delivery = this.data.deliveries.find((d) => d.orderId === o.id);
        const ack = this.data.acknowledgements.find((a) => a.orderId === o.id);

        return {
          id: delivery?.id || `DEL-${o.id.replace(/[^0-9]/g, '')}`,
          orderRef: o.orderRef,
          clientName: o.customerName,
          clientEmail: o.customerEmail,
          serviceName: o.serviceName,
          amount: o.finalAmount,
          currency: o.currency,
          status: o.status === 'Delivered' ? 'Fulfilled / Delivered' : o.status === 'Cancelled' ? 'Cancelled' : o.status === 'Processing' ? 'In Research' : 'Pending Discovery Call',
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
          notes: o.customerNotes || o.internalNotes || '',
          assignedAdvisor: o.assignedAdvisor,
          isAcknowledged: Boolean(ack),
          acknowledgmentData: ack
            ? {
                ip: ack.clientIp,
                userAgent: ack.userAgent,
                location: ack.approxLocation || 'United States',
                timestamp: ack.timestamp,
              }
            : undefined,
        };
      });

      fs.writeFileSync(DELIVERABLES_FILE, JSON.stringify(legacyDeliverables, null, 2), 'utf-8');
    } catch (e) {
      // Non-blocking
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Query & Mutation API Helpers
  // ─────────────────────────────────────────────────────────────
  public getOrders(): Order[] {
    return this.data.orders;
  }

  public findOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id || o.orderRef === id);
  }

  public insertOrder(order: Order): Order {
    this.data.orders.unshift(order);
    this.persist();
    return order;
  }

  public updateOrder(id: string, updates: Partial<Order>): Order | null {
    const idx = this.data.orders.findIndex((o) => o.id === id || o.orderRef === id);
    if (idx === -1) return null;

    this.data.orders[idx] = {
      ...this.data.orders[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.orders[idx];
  }

  public getCustomers(): Customer[] {
    return this.data.customers;
  }

  public findCustomerById(id: string): Customer | undefined {
    return this.data.customers.find((c) => c.id === id);
  }

  public findCustomerByEmail(email: string): Customer | undefined {
    return this.data.customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
  }

  public insertOrUpdateCustomer(customerData: Partial<Customer> & { email: string; name: string }): Customer {
    let customer = this.findCustomerByEmail(customerData.email);

    if (customer) {
      customer.name = customerData.name || customer.name;
      if (customerData.phone) customer.phone = customerData.phone;
      if (customerData.country) customer.country = customerData.country;
      customer.updatedAt = new Date().toISOString();
    } else {
      customer = {
        id: `CUST-${new Date().getFullYear()}-${String(this.data.customers.length + 1).padStart(4, '0')}`,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        country: customerData.country,
        totalOrders: 0,
        totalSpent: 0,
        outstandingBalance: 0,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.data.customers.unshift(customer);
    }
    this.persist();
    return customer;
  }

  public getPayments(): PaymentTransaction[] {
    return this.data.payments;
  }

  public insertPayment(payment: PaymentTransaction): PaymentTransaction {
    this.data.payments.unshift(payment);
    this.persist();
    return payment;
  }

  public getServices(): ServiceDefinition[] {
    return this.data.services;
  }

  public getDeliveries(): ServiceDelivery[] {
    return this.data.deliveries;
  }

  public insertDelivery(delivery: ServiceDelivery): ServiceDelivery {
    this.data.deliveries.unshift(delivery);
    this.persist();
    return delivery;
  }

  public updateDelivery(id: string, updates: Partial<ServiceDelivery>): ServiceDelivery | null {
    const idx = this.data.deliveries.findIndex((d) => d.id === id || d.orderId === id);
    if (idx === -1) return null;
    this.data.deliveries[idx] = { ...this.data.deliveries[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist();
    return this.data.deliveries[idx];
  }

  public getAcknowledgements(): ClientAcknowledgement[] {
    return this.data.acknowledgements;
  }

  public insertAcknowledgement(ack: ClientAcknowledgement): ClientAcknowledgement {
    this.data.acknowledgements.unshift(ack);
    this.persist();
    return ack;
  }

  public getEmailTemplates(): EmailTemplate[] {
    return this.data.emailTemplates;
  }

  public getEmailLogs(): EmailLog[] {
    return this.data.emailLogs;
  }

  public insertEmailLog(log: EmailLog): EmailLog {
    this.data.emailLogs.unshift(log);
    this.persist();
    return log;
  }

  public getAuditLogs(): SystemAuditLog[] {
    return this.data.auditLogs;
  }

  public insertAuditLog(log: SystemAuditLog): SystemAuditLog {
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) this.data.auditLogs.pop();
    this.persist();
    return log;
  }

  public getStatusHistory(orderId?: string): OrderStatusHistoryItem[] {
    if (orderId) return this.data.statusHistory.filter((h) => h.orderId === orderId);
    return this.data.statusHistory;
  }

  public insertStatusHistory(item: OrderStatusHistoryItem): void {
    this.data.statusHistory.unshift(item);
    this.persist();
  }

  public getFinancialAudits(orderId?: string): FinancialAdjustmentAudit[] {
    if (orderId) return this.data.financialAudits.filter((f) => f.orderId === orderId);
    return this.data.financialAudits;
  }

  public insertFinancialAudit(item: FinancialAdjustmentAudit): void {
    this.data.financialAudits.unshift(item);
    this.persist();
  }

  public getNotifications(): AdminNotification[] {
    return this.data.notifications;
  }

  public insertNotification(notif: AdminNotification): AdminNotification {
    this.data.notifications.unshift(notif);
    if (this.data.notifications.length > 100) this.data.notifications.pop();
    this.persist();
    return notif;
  }

  public markNotificationAsRead(id: string): void {
    const n = this.data.notifications.find((item) => item.id === id);
    if (n) {
      n.read = true;
      this.persist();
    }
  }

  public markAllNotificationsAsRead(): void {
    this.data.notifications.forEach((n) => (n.read = true));
    this.persist();
  }

  public getUsers(): AdminUser[] {
    return this.data.users;
  }
}

export const db = new DatabaseStore();
