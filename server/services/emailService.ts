// ─────────────────────────────────────────────────────────────
// YOUR FLIGHTS LLC — Email Dispatcher
// Uses the premium redesigned template library for all outbound emails.
// ─────────────────────────────────────────────────────────────
import { createMailServiciosr } from '../mail/transporter';
import { db } from '../store/db';
import { SMTP, APP_URL } from '../config';
import { DeliveryService } from './deliveryService';
import { EmailLog, Order } from '../types/domain';
import {
  buildPaymentLinkHtml,
  buildOrderConfirmationHtml,
  buildServiceDetailsHtml,
  buildCustomEmailHtml,
} from '../mail/templates/orderConfirmation';

// ─────────────────────────────────────────────────────────────
// Shared plain-text builder
// ─────────────────────────────────────────────────────────────
function buildPlainText(lines: string[]): string {
  return lines.join('\n');
}

export class EmailService {
  // ───────────────────────────────────────────────────────────
  // Template-based email (uses db EmailTemplate records)
  // ───────────────────────────────────────────────────────────
  public static async sendTemplateEmail(payload: {
    templateId: string;
    to: string;
    orderId?: string;
    variables: Record<string, string | number>;
    attachments?: Array<{ filename: string; content: Buffer | string; contentType?: string }>;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const template = db.getEmailTemplates().find((t) => t.id === payload.templateId);
    const subject = template
      ? DeliveryService.interpolateVariables(template.subject, payload.variables)
      : `Notification for Order #${payload.orderId || ''}`;
    const bodyHtml = template
      ? DeliveryService.interpolateVariables(template.bodyHtml, payload.variables)
      : `<p>Hello,</p><p>Update regarding your order #${payload.orderId}.</p>`;
    const bodyText = template
      ? DeliveryService.interpolateVariables(template.bodyText, payload.variables)
      : `Hello,\n\nUpdate regarding your order #${payload.orderId}.`;

    let messageId = `sim_msg_${Date.now()}`;
    let deliveryStatus: EmailLog['deliveryStatus'] = 'SENT';
    let failureReason: string | undefined;

    try {
      const transporter = await createMailServiciosr();
      const info = await transporter.sendMail({
        from: SMTP.FROM,
        to: payload.to,
        subject,
        text: bodyText,
        html: bodyHtml,
        attachments: payload.attachments,
      });
      if (info?.messageId) messageId = info.messageId;
    } catch (err: any) {
      console.warn('[EMAIL DISPATCH NOTICE]:', err.message);
      deliveryStatus = 'FAILED';
      failureReason = err.message;
    }

    const emailLog: EmailLog = {
      id: `EML-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      orderId: payload.orderId,
      recipient: payload.to,
      subject,
      bodyHtml,
      bodyText,
      templateId: payload.templateId,
      emailType: template?.name || 'Transactional Email',
      sentTimestamp: new Date().toISOString(),
      deliveryStatus,
      providerMessageId: messageId,
      failureReason,
    };
    db.insertEmailLog(emailLog);

    return { success: deliveryStatus !== 'FAILED', messageId, error: failureReason };
  }

  // ───────────────────────────────────────────────────────────
  // Action-based emails — uses the premium redesigned templates
  // ───────────────────────────────────────────────────────────
  public static async sendOrderActionEmail(
    order: Order,
    type: 'payment_link' | 'order_confirmation' | 'service_details' | 'custom',
    customData?: { subject?: string; message?: string; paymentUrl?: string; paymentAmount?: number }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    let subject = '';
    let bodyHtml = '';
    let bodyText = '';
    let emailType = '';

    // ── 1. Payment Link ────────────────────────────────────────
    if (type === 'payment_link') {
      emailType = 'Payment Link';
      const link = customData?.paymentUrl || `${APP_URL}/?page=checkout&orderId=${order.id}`;
      const amountToPay = customData?.paymentAmount !== undefined ? customData.paymentAmount : order.finalAmount;
      
      subject = `Complete Your Payment — $${amountToPay.toFixed(2)} USD · Order #${order.id} | Your Flights LLC`;
      bodyHtml = buildPaymentLinkHtml(order, link, amountToPay);
      bodyText = buildPlainText([
        `Hi ${order.customerName},`,
        ``,
        `Your flights advisory package is ready. Please complete your payment of $${amountToPay.toFixed(2)} USD for "${order.serviceName}".`,
        ``,
        `Secure Payment Link: ${link}`,
        ``,
        `Order Reference: ${order.id}`,
        `Statement Descriptor: YOUR FLIGHTS ADVISORY | YOURFLIGHTSLLC.COM`,
        `Merchant: Your Flights LLC (MCC 8999 / 8999)`,
        ``,
        `Questions? support@yourflightsllc.com | +1-810-505-5186`,
        `Terms: https://yourflightsllc.com/terms`,
        `Refund Policy: https://yourflightsllc.com/refund-policy`,
        ``,
        `— Your Flights LLC`,
      ]);

    // ── 2. Order Confirmation ──────────────────────────────────
    } else if (type === 'order_confirmation') {
      emailType = 'Order Confirmation';
      subject = `Contracting Confirmed · Order #${order.id} — Your Flights LLC`;
      bodyHtml = buildOrderConfirmationHtml(order);
      bodyText = buildPlainText([
        `Hi ${order.customerName},`,
        ``,
        `Your contracting is confirmed! Here are your order details:`,
        ``,
        `  Order Reference:  ${order.orderRef || order.id}`,
        `  Service:          ${order.serviceName}`,
        `  Amount Paid:      $${order.finalAmount.toFixed(2)} USD`,
        `  Payment Status:   ${order.paymentStatus}`,
        `  Advisor:          ${order.assignedAdvisor || 'Your Flights Advisory Team'}`,
        ``,
        `Your card statement will show: YOUR FLIGHTS ADVISORY | YOURFLIGHTSLLC.COM`,
        ``,
        `WHAT HAPPENS NEXT:`,
        `1. Your flights strategist begins research within 24 hours.`,
        `2. Your custom deliverable is crafted and reviewed.`,
        `3. Electronic delivery within 2 business days.`,
        ``,
        `Questions? Contact us BEFORE filing any bank dispute:`,
        `  Email: support@yourflightsllc.com`,
        `  Phone: +1-810-505-5186`,
        ``,
        `This is an independent consulting advisory service (MCC 8999 / 8999). No consulting services or vendor contracts are issued.`,
        ``,
        `— Your Flights LLC`,
      ]);

    // ── 3. Service Details ─────────────────────────────────────
    } else if (type === 'service_details') {
      emailType = 'Service Details';
      subject = `Service Scope & Details — Order #${order.id} | Your Flights LLC`;
      bodyHtml = buildServiceDetailsHtml(order, customData?.message);
      bodyText = buildPlainText([
        `Hello ${order.customerName},`,
        ``,
        `Here are the details for your consulting advisory package:`,
        ``,
        `  Service:    ${order.serviceName}`,
        `  Order Ref:  ${order.orderRef || order.id}`,
        `  Amount:     $${order.finalAmount.toFixed(2)} USD`,
        ``,
        `SCOPE & DETAILS:`,
        customData?.message || order.internalNotes || 'Our team is preparing your custom consulting advisory deliverable.',
        ``,
        `Delivery: Electronic, within 2 business days.`,
        `Revisions: 1 free revision within 14 days of delivery.`,
        ``,
        `Questions? Reply to this email or reach us at:`,
        `  support@yourflightsllc.com | +1-810-505-5186`,
        ``,
        `— Your Flights LLC`,
      ]);

    // ── 4. Custom ──────────────────────────────────────────────
    } else {
      emailType = 'Custom Communication';
      subject = customData?.subject || `Update on your order #${order.id} — Your Flights LLC`;
      bodyHtml = buildCustomEmailHtml(order, subject, customData?.message || '');
      bodyText = buildPlainText([
        `Hello ${order.customerName},`,
        ``,
        customData?.message || '',
        ``,
        `Regarding order: ${order.orderRef || order.id} — ${order.serviceName}`,
        ``,
        `Questions? support@yourflightsllc.com | +1-810-505-5186`,
        `Your Flights LLC · MCC 8999 / 8999`,
      ]);
    }

    // ── Dispatch ───────────────────────────────────────────────
    let messageId = `sim_msg_${Date.now()}`;
    let deliveryStatus: EmailLog['deliveryStatus'] = 'SENT';
    let failureReason: string | undefined;

    try {
      const transporter = await createMailServiciosr();
      const info = await transporter.sendMail({
        from: SMTP.FROM,
        to: order.customerEmail,
        subject,
        text: bodyText,
        html: bodyHtml,
      });
      if (info?.messageId) messageId = info.messageId;
    } catch (err: any) {
      console.warn('[ACTION EMAIL NOTICE]:', err.message);
      deliveryStatus = 'FAILED';
      failureReason = err.message;
    }

    const emailLog: EmailLog = {
      id: `EML-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      orderId: order.id,
      recipient: order.customerEmail,
      subject,
      bodyHtml,
      bodyText,
      emailType,
      sentTimestamp: new Date().toISOString(),
      deliveryStatus,
      providerMessageId: messageId,
      failureReason,
    };
    db.insertEmailLog(emailLog);

    return { success: deliveryStatus !== 'FAILED', messageId, error: failureReason };
  }

  // ───────────────────────────────────────────────────────────
  // Service Delivery PDF email (with acknowledgement link)
  // ───────────────────────────────────────────────────────────
  public static async sendServiceDeliveryEmail(
    order: Order,
    pdfBuffer: Buffer,
    acknowledgementUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    const subject = `Your Flights Advisory Deliverable Ready — Order #${order.id} | Your Flights LLC`;

    // Use the premium service_details template with ACK CTA injected
    const bodyHtml = buildServiceDetailsHtml(
      order,
      `Your customized advisory report for <strong>${order.serviceName}</strong> is attached as a PDF.<br/><br/>
      Please <a href="${acknowledgementUrl}" style="color:#2563eb;font-weight:700;">click here to acknowledge receipt</a> and confirm you've received and reviewed your deliverable.<br/><br/>
      This acknowledgement step is required to complete your order. If you have any questions about your deliverable, simply reply to this email.`
    );

    const bodyText = buildPlainText([
      `Dear ${order.customerName},`,
      ``,
      `Your advisory deliverables for order #${order.id} (${order.serviceName}) are attached.`,
      ``,
      `IMPORTANT: Please acknowledge receipt by visiting:`,
      acknowledgementUrl,
      ``,
      `Questions? support@yourflightsllc.com | +1-810-505-5186`,
      ``,
      `— Your Flights LLC`,
    ]);

    try {
      const transporter = await createMailServiciosr();
      const info = await transporter.sendMail({
        from: SMTP.FROM,
        to: order.customerEmail,
        bcc: SMTP.USER, // Admin copy for proof
        subject,
        html: bodyHtml,
        text: bodyText,
        attachments: [
          {
            filename: `Your_Projects_Advisory_Deliverable_${order.id}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      });

      db.insertEmailLog({
        id: `EML-DEL-${Date.now()}`,
        orderId: order.id,
        recipient: order.customerEmail,
        subject,
        bodyHtml,
        bodyText,
        emailType: 'Service Delivery PDF Package',
        sentTimestamp: new Date().toISOString(),
        deliveryStatus: 'SENT',
        providerMessageId: info?.messageId || `msg-${Date.now()}`,
      });

      return { success: true };
    } catch (err: any) {
      console.error('[SERVICE DELIVERY EMAIL ERROR]:', err);
      return { success: false, error: err.message };
    }
  }
}
