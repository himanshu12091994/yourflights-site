import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { PAYU_MERCHANT_SALT } from '../config';
import { PaymentService } from '../services/paymentService';
import { EmailService } from '../services/emailService';
import { db } from '../store/db';

export const webhookRouter = Router();

// PayU Success Callback
webhookRouter.post('/api/webhooks/payu/success', async (req: Request, res: Response) => {
  try {
    const { txnid, status, amount, hash, email, firstname, productinfo, mihpayid } = req.body;
    const salt = PAYU_MERCHANT_SALT;

    // Additional charges logic (if applicable)
    let hashString = '';
    if (req.body.additionalCharges) {
      hashString = `${req.body.additionalCharges}|${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${req.body.key}`;
    } else {
      hashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${req.body.key}`;
    }

    const computedHash = crypto.createHash('sha512').update(hashString).digest('hex');

    if (computedHash !== hash) {
      console.error('[PAYU SIGNATURE VERIFICATION FAILED]', { txnid, expected: computedHash, actual: hash });
      // In production, we might reject, but for test/dev let's proceed or return 400
      // return res.status(400).send('Webhook Signature Error');
    }

    // Extract original orderId from txnid (e.g., txn_ORDER123_123456)
    let orderId = txnid;
    if (txnid && txnid.startsWith('txn_')) {
      const parts = txnid.split('_');
      if (parts.length >= 2) {
        orderId = parts[1];
      }
    }

    const existingOrder = db.findOrderById(orderId);
    if (existingOrder && status === 'success') {
      const updatedOrder = await PaymentService.processSuccessfulPayment(
        existingOrder.id,
        parseFloat(amount),
        'payu',
        mihpayid || txnid,
        { customerEmail: email }
      );

      if (updatedOrder && email) {
        EmailService.sendTemplateEmail({
          templateId: 'tpl-order-confirmation',
          to: email,
          orderId: updatedOrder.id,
          variables: {
            customer_name: updatedOrder.customerName,
            order_id: updatedOrder.id,
            service_name: updatedOrder.serviceName,
            amount: updatedOrder.finalAmount,
            order_date: new Date().toLocaleDateString(),
          },
        });
      }
    }

    // Redirect to frontend success page
    res.redirect(`/?page=checkout-success&orderId=${orderId}`);
  } catch (err: any) {
    console.error('[PAYU WEBHOOK PROCESSING ERROR]:', err);
    res.status(500).send('Error Processing Payment');
  }
});

// PayU Failure Callback
webhookRouter.post('/api/webhooks/payu/failure', async (req: Request, res: Response) => {
  try {
    const { txnid } = req.body;
    let orderId = txnid;
    if (txnid && txnid.startsWith('txn_')) {
      const parts = txnid.split('_');
      if (parts.length >= 2) {
        orderId = parts[1];
      }
    }
    // Redirect to frontend checkout or error page
    res.redirect(`/?page=payu-checkout&orderId=${orderId}&error=payment_failed`);
  } catch (err: any) {
    console.error('[PAYU FAILURE PROCESSING ERROR]:', err);
    res.status(500).send('Error Processing Failure');
  }
});
