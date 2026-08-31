// ─────────────────────────────────────────────────────────────
// YOUR FLIGHTS LLC — Payment Service & Gateway Integration
// Enforces PCI-DSS safety: NO raw PAN, CVV, or PIN is ever received or stored.
// ─────────────────────────────────────────────────────────────

import { db } from '../store/db';
import { PaymentTransaction, PaymentStatus, Order } from '../types/domain';
import { CASHFREE_APP_ID, CASHFREE_SECRET_KEY, CASHFREE_ENV, APP_URL, PAYU_MERCHANT_KEY, PAYU_MERCHANT_SALT } from '../config';

export class PaymentService {
  public static async generatePaymentLink(
    orderId: string,
    amount: number,
    actorName: string,
    customTitle?: string
  ): Promise<{ success: boolean; url?: string; paymentId?: string; error?: string }> {
    const order = db.findOrderById(orderId);
    if (!order) {
      return { success: false, error: `Order ${orderId} not found` };
    }

    const payableAmount = Number(amount) || order.remainingAmount || order.finalAmount;
    const title = customTitle || `${order.serviceName} (#${order.id})`;
    const successUrl = `${APP_URL}/?page=checkout-success&orderId=${encodeURIComponent(order.id)}`;

    let paymentUrl = '';
    let providerTxnId = '';

    if (PAYU_MERCHANT_KEY && PAYU_MERCHANT_SALT) {
      try {
        paymentUrl = `${APP_URL}/?page=payu-checkout&orderId=${encodeURIComponent(order.id)}`;
        providerTxnId = `txn_${order.id}_${Date.now()}`;
      } catch (err: any) {
        console.error('[PAYU PAYMENT LINK ERROR]:', err);
        return { success: false, error: err.message || 'PayU payment link generation failed' };
      }
    } else {
      // Test / Simulation fallback link
      paymentUrl = `${APP_URL}/?page=checkout-simulation&orderId=${encodeURIComponent(order.id)}&amount=${payableAmount}`;
      providerTxnId = `sim_session_${Date.now()}`;
    }

    // Insert pending payment record
    const paymentRecord: PaymentTransaction = {
      id: `PAY-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      orderId: order.id,
      customerId: order.customerId,
      amount: payableAmount,
      currency: 'usd',
      status: 'Pending',
      provider: PAYU_MERCHANT_KEY ? 'payu' : 'simulation',
      providerTransactionId: providerTxnId,
      paymentUrl,
      isTestMode: !PAYU_MERCHANT_KEY,
      refundStatus: 'NONE',
      createdTime: new Date().toISOString(),
    };

    db.insertPayment(paymentRecord);

    // Audit log
    db.insertAuditLog({
      id: `AUD-PAYLINK-${Date.now()}`,
      actor: actorName,
      action: 'PAYMENT_LINK_GENERATED',
      entity: 'Payment',
      entityId: paymentRecord.id,
      timestamp: new Date().toISOString(),
      newValues: { orderId: order.id, amount: payableAmount, paymentUrl },
    });

    return {
      success: true,
      url: paymentUrl,
      paymentId: paymentRecord.id,
    };
  }

  public static async processSuccessfulPayment(
    orderId: string,
    amount: number,
    provider: PaymentTransaction['provider'],
    providerTransactionId: string,
    metadata: {
      cardBrand?: string;
      last4?: string;
      customerEmail?: string;
      source?: import('../types/domain').PaymentMethodType;
    } = {}
  ): Promise<Order | null> {
    const order = db.findOrderById(orderId);
    if (!order) return null;

    // Idempotency check: check if this transaction ID was already completed
    const existingPayment = db.getPayments().find(
      (p) => p.providerTransactionId === providerTransactionId && p.status === 'Successful'
    );
    if (existingPayment) {
      console.log(`[PAYMENT IDEMPOTENCY] Transaction ${providerTransactionId} already processed.`);
      return order;
    }

    const newAmountPaid = order.amountPaid + amount;
    const newRemaining = Math.max(0, order.finalAmount - newAmountPaid);
    const newPaymentStatus: PaymentStatus = newRemaining === 0 ? 'Successful' : 'Pending';

    // Record Payment
    const paymentRecord: PaymentTransaction = {
      id: `PAY-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      orderId: order.id,
      customerId: order.customerId,
      amount,
      currency: order.currency,
      status: 'Successful',
      provider,
      providerTransactionId,
      cardBrand: metadata.cardBrand,
      last4: metadata.last4,
      createdTime: new Date().toISOString(),
      completedTime: new Date().toISOString(),
    };
    db.insertPayment(paymentRecord);

    // Update Customer LTV
    const customer = db.findCustomerById(order.customerId);
    if (customer) {
      customer.totalSpent += amount;
      customer.updatedAt = new Date().toISOString();
    }

    // Update Order
    const nextOrderStatus = order.status === 'New' || order.status === 'Awaiting Payment' ? 'Payment Received' : order.status;
    const updatedOrder = db.updateOrder(order.id, {
      amountPaid: newAmountPaid,
      remainingAmount: newRemaining,
      paymentStatus: newPaymentStatus,
      status: nextOrderStatus,
      paymentMethod: metadata.source || order.paymentMethod,
    });

    // Audit Log
    db.insertAuditLog({
      id: `AUD-PAY-${Date.now()}`,
      actor: 'Payment Gateway / Webhook',
      action: 'PAYMENT_RECEIVED',
      entity: 'Payment',
      entityId: paymentRecord.id,
      timestamp: new Date().toISOString(),
      newValues: { orderId: order.id, amountPaid: amount, providerTransactionId },
    });

    // Notify Admin
    db.insertNotification({
      id: `NOTIF-PAY-${Date.now()}`,
      title: 'Payment Received',
      message: `Payment of $${amount.toFixed(2)} received for Order ${order.id}`,
      type: 'PAYMENT',
      read: false,
      link: `/admin?orderId=${order.id}`,
      createdAt: new Date().toISOString(),
    });

    return updatedOrder;
  }

  public static async issueRefund(
    orderId: string,
    refundAmount: number,
    actorName: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> {
    const order = db.findOrderById(orderId);
    if (!order) return { success: false, error: 'Order not found' };

    if (refundAmount <= 0 || refundAmount > order.amountPaid) {
      return {
        success: false,
        error: `Invalid refund amount. Maximum refundable amount is $${order.amountPaid.toFixed(2)} USD`,
      };
    }

    const newAmountPaid = order.amountPaid - refundAmount;
    const isFull = newAmountPaid === 0;

    db.updateOrder(order.id, {
      amountPaid: newAmountPaid,
      paymentStatus: isFull ? 'Refunded' : 'Partially Refunded',
      status: isFull ? 'Refunded' : order.status,
    });

    // Insert refund transaction record
    db.insertPayment({
      id: `REF-${Date.now()}`,
      orderId: order.id,
      customerId: order.customerId,
      amount: -refundAmount,
      currency: order.currency,
      status: isFull ? 'Refunded' : 'Partially Refunded',
      provider: 'stripe',
      refundStatus: isFull ? 'FULL' : 'PARTIAL',
      refundAmount,
      createdTime: new Date().toISOString(),
      completedTime: new Date().toISOString(),
    });

    // Audit Log
    db.insertAuditLog({
      id: `AUD-REF-${Date.now()}`,
      actor: actorName,
      action: 'REFUND_ISSUED',
      entity: 'Payment',
      entityId: order.id,
      timestamp: new Date().toISOString(),
      newValues: { refundAmount, isFull, reason },
      reason,
    });

    return { success: true };
  }
}
