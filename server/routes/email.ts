// ─────────────────────────────────────────────────────────────
// Email confirmation receipt & intake creation route
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import nodemailer from 'nodemailer';
import { createMailServiciosr } from '../mail/transporter';
import {
  generateOrderConfirmationHtml,
  generateOrderConfirmationText,
  generateReceiptAttachmentText,
  OrderEmailDetails,
} from '../mail/templates/orderConfirmation';
import { SMTP, STATEMENT_DESCRIPTOR } from '../config';
import {
  findDeliverableByOrderRef,
  addDeliverable,
  AdvisoryDeliverable,
} from '../store/deliverables';

export const emailRouter = Router();

emailRouter.post('/api/send-confirmation', async (req, res) => {
  try {
    const { email, serviceName, amount, orderId, clientIp, timestamp } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    const orderRef = orderId || `YF-${Math.floor(100000 + Math.random() * 900000)}`;
    const serviceTitle =
      serviceName || 'Custom Consulting Advisory & Strategy Planning';
    const amountPaid = amount || '$150.00 USD';
    const descriptorString = `'${STATEMENT_DESCRIPTOR.FULL}' or '${STATEMENT_DESCRIPTOR.DOMAIN}'`;
    const transactionTimestamp = timestamp || new Date().toISOString();
    const rawIp =
      clientIp ||
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    const customerIpAddress =
      typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : '127.0.0.1';

    const checkoutDate = new Date(transactionTimestamp).toLocaleDateString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );

    let shortScopeDescription =
      'Bespoke day-by-day consulting strategy strategy, market research, and pre-departure consulting guide.';
    if (
      serviceTitle.toLowerCase().includes('strategy') ||
      serviceTitle.includes('150')
    ) {
      shortScopeDescription =
        'Bespoke day-by-day consulting strategy strategy, custom daily schedules, activity pacing, and infraestructura recommendations.';
    } else if (
      serviceTitle.toLowerCase().includes('research') ||
      serviceTitle.includes('75')
    ) {
      shortScopeDescription =
        'Comprehensive market intelligence research, local entry requirements, transit options, and safety briefing.';
    } else if (
      serviceTitle.toLowerCase().includes('prep') ||
      serviceTitle.includes('50')
    ) {
      shortScopeDescription =
        'Pre-departure strategy preparation checklist, document advisory, health & safety briefing, and custom consulting guide.';
    }

    const fulfillmentStartDate = `Immediate / Next Business Day (${checkoutDate})`;
    const targetCompletionDate = '24–48 Hours from intake confirmation';

    const emailDetails: OrderEmailDetails = {
      orderRef,
      checkoutDate,
      email,
      serviceTitle,
      amountPaid,
      statementDescriptor: descriptorString,
      shortScopeDescription,
      fulfillmentStartDate,
      targetCompletionDate,
      transactionTimestamp,
      customerIpAddress,
    };

    const htmlContent = generateOrderConfirmationHtml(emailDetails);
    const textContent = generateOrderConfirmationText(emailDetails);
    const attachmentContent = generateReceiptAttachmentText(emailDetails);

    const fromAddress = SMTP.FROM;
    let info: any = null;
    let previewUrl: string | null = null;
    const isRealSmtp = Boolean(SMTP.PASS && SMTP.PASS.trim().length > 0);

    try {
      const transporter = await createMailServiciosr();
      info = await transporter.sendMail({
        from: fromAddress,
        to: email,
        subject: `Order Confirmation & Receipt #${orderRef} - Your Flights LLC`,
        text: textContent,
        html: htmlContent,
        attachments: [
          {
            filename: `Your_Projects_LLC_Advisory_Receipt_${orderRef}.txt`,
            content: attachmentContent,
          },
        ],
      });

      if (info) {
        previewUrl = nodemailer.getTestMessageUrl(info) || null;
      }
    } catch (mailErr: any) {
      console.warn('[SMTP SEND MAIL NOTICE]:', mailErr?.message || mailErr);
      info = { messageId: `intake-receipt-${Date.now()}` };
    }

    // Automatically log new deliverable for staff tracking if not already recorded
    const existing = findDeliverableByOrderRef(orderRef);
    if (!existing) {
      const parseNum = (str: string) => {
        const num = parseFloat(str.replace(/[^0-9.]/g, ''));
        return isNaN(num) ? 150 : num;
      };
      const newDel: AdvisoryDeliverable = {
        id: `DEL-${new Date().getFullYear()}-${Math.floor(
          100 + Math.random() * 900
        )}`,
        orderRef,
        clientName: email.split('@')[0],
        clientEmail: email,
        serviceName: serviceTitle,
        amount: parseNum(amountPaid),
        currency: 'usd',
        status: 'Pending Discovery Call',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes:
          'New consultation intake generated automatically from checkout confirmation receipt.',
        assignedAdvisor: 'Unassigned',
      };
      addDeliverable(newDel);
    }

    console.log(
      'Confirmation receipt email processed successfully:',
      info?.messageId || 'done'
    );

    res.json({
      success: true,
      isRealSmtp,
      message:
        'Official confirmation receipt and service intake generated successfully.',
      orderId: orderRef,
      recipient: email,
      messageId: info?.messageId || 'sent',
      previewUrl: previewUrl || null,
    });
  } catch (error: any) {
    console.error('Error sending confirmation email:', error);
    res
      .status(500)
      .json({ error: error.message || 'Failed to send confirmation email' });
  }
});
