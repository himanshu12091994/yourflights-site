// ─────────────────────────────────────────────────────────────
// YOUR FLIGHTS LLC — Client Acknowledgement & Forensic Verification Service
// Verifies HMAC-signed tokens and records non-repudiation audit evidence.
// ─────────────────────────────────────────────────────────────
import { verifySignedAcknowledgementToken } from '../auth';
import { db } from '../store/db';
import { ClientAcknowledgement, Order } from '../types/domain';

export class AcknowledgementService {
  public static verifyToken(token: string): {
    valid: boolean;
    order?: Order;
    deliveryId?: string;
    alreadyAcknowledged?: boolean;
    error?: string;
  } {
    const verified = verifySignedAcknowledgementToken(token);
    if (!verified) {
      return { valid: false, error: 'The acknowledgement link is invalid or has expired. Please contact support.' };
    }

    const order = db.findOrderById(verified.orderId);
    if (!order) {
      return { valid: false, error: 'Order associated with this token was not found.' };
    }

    const existingAck = db.getAcknowledgements().find(
      (a) => a.orderId === order.id || a.deliveryId === verified.deliveryId
    );

    return {
      valid: true,
      order,
      deliveryId: verified.deliveryId,
      alreadyAcknowledged: Boolean(existingAck),
    };
  }

  public static async recordAcknowledgement(payload: {
    token?: string;
    orderId?: string;
    clientIp: string;
    userAgent: string;
    browser?: string;
    os?: string;
    deviceType?: string;
    location?: string;
  }): Promise<{ success: boolean; error?: string; ackId?: string }> {
    let orderId = payload.orderId;
    let deliveryId = `DEL-${Date.now()}`;

    if (payload.token) {
      const verified = verifySignedAcknowledgementToken(payload.token);
      if (!verified) {
        return { success: false, error: 'Invalid or expired acknowledgement token.' };
      }
      orderId = verified.orderId;
      deliveryId = verified.deliveryId;
    }

    if (!orderId) {
      return { success: false, error: 'Order reference required.' };
    }

    const order = db.findOrderById(orderId);
    if (!order) {
      return { success: false, error: `Order ${orderId} not found.` };
    }

    // Resolve approx location if unknown
    let location = payload.location || 'United States';
    if (payload.clientIp && payload.clientIp !== '127.0.0.1' && payload.clientIp !== '::1') {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${payload.clientIp}`);
        const geoData = await geoRes.json();
        if (geoData && geoData.status === 'success') {
          location = `${geoData.city}, ${geoData.regionName}, ${geoData.country}`;
        }
      } catch {
        // Non-blocking
      }
    }

    const ackId = `ACK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const ackRecord: ClientAcknowledgement = {
      id: ackId,
      orderId: order.id,
      customerId: order.customerId,
      deliveryId,
      timestamp: new Date().toISOString(),
      clientIp: payload.clientIp,
      userAgent: payload.userAgent,
      browser: payload.browser || 'Web Browser',
      os: payload.os || 'Operating System',
      deviceType: payload.deviceType || 'Desktop/Mobile',
      approxLocation: location,
      mccAgreement: 'ACCEPTED',
      disclosuresText: `Client officially acknowledged receipt of ${order.serviceName} deliverables and agreed to MCC 8999/8999 non-refundable terms.`,
      serviceName: order.serviceName,
      amount: order.finalAmount,
      currency: order.currency,
    };

    db.insertAcknowledgement(ackRecord);

    // Transition Order Status to Acknowledged
    db.updateOrder(order.id, {
      status: 'Acknowledged',
    });

    // Update Delivery Status
    db.updateDelivery(deliveryId, {
      status: 'Acknowledged',
      acknowledgedAt: ackRecord.timestamp,
    });

    // Immutable Status History
    db.insertStatusHistory({
      id: `HIST-${Date.now()}`,
      orderId: order.id,
      previousStatus: order.status,
      newStatus: 'Acknowledged',
      changedBy: `Client (${order.customerEmail})`,
      reason: `Client accepted terms via signed link from IP: ${payload.clientIp}`,
      timestamp: new Date().toISOString(),
    });

    // System Audit Log
    db.insertAuditLog({
      id: `AUD-ACK-${Date.now()}`,
      actor: order.customerEmail,
      action: 'CLIENT_ACKNOWLEDGEMENT_RECORDED',
      entity: 'Acknowledgement',
      entityId: ackId,
      clientIp: payload.clientIp,
      timestamp: new Date().toISOString(),
      newValues: { orderId: order.id, location, ip: payload.clientIp },
    });

    // Notify Admin
    db.insertNotification({
      id: `NOTIF-ACK-${Date.now()}`,
      title: 'Deliverables Acknowledged',
      message: `Client ${order.customerName} acknowledged receipt for Order ${order.id}`,
      type: 'ACKNOWLEDGEMENT',
      read: false,
      link: `/admin?orderId=${order.id}`,
      createdAt: new Date().toISOString(),
    });

    return { success: true, ackId };
  }
}
