const fs = require('fs');
let content = fs.readFileSync('server/routes/webhooks.ts', 'utf8');

const newWebhookRouter = `import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { CASHFREE_SECRET_KEY } from '../config';
import { PaymentService } from '../services/paymentService';
import { EmailService } from '../services/emailService';
import { db } from '../store/db';

export const webhookRouter = Router();

webhookRouter.post('/api/webhooks/cashfree', async (req: Request, res: Response) => {
  const timestamp = req.headers['x-webhook-timestamp'] as string;
  const signature = req.headers['x-webhook-signature'] as string;
  const rawBody = (req as any).rawBody || JSON.stringify(req.body);

  if (CASHFREE_SECRET_KEY && timestamp && signature) {
    const computedHash = crypto
      .createHmac('sha256', CASHFREE_SECRET_KEY)
      .update(timestamp + rawBody)
      .digest('base64');
    
    if (computedHash !== signature) {
      console.error('[CASHFREE WEBHOOK SIGNATURE VERIFICATION FAILED]');
      return res.status(400).send('Webhook Signature Error');
    }
  }

  const event = req.body;
  console.log(\`[CASHFREE WEBHOOK RECEIVED]: Type: \${event.type}\`);

  try {
    if (event.type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const orderData = event.data.order;
      const paymentData = event.data.payment;
      const customerData = event.data.customer_details;

      const cfOrderId = orderData.order_id as string;
      const amount = paymentData.payment_amount;
      const customerEmail = customerData?.customer_email;
      
      // Our order IDs are often prefixed like CF-ORDER123-123456
      // Let's try to extract the real Order ID if it exists
      let orderId = cfOrderId;
      if (cfOrderId.startsWith('CF-')) {
        const parts = cfOrderId.split('-');
        if (parts.length >= 3) {
           orderId = parts[1]; // Real order ID
        }
      }

      // If we found an order in the database
      const existingOrder = db.findOrderById(orderId);
      if (existingOrder) {
        const updatedOrder = await PaymentService.processSuccessfulPayment(
          existingOrder.id,
          amount,
          'cashfree',
          paymentData.cf_payment_id ? String(paymentData.cf_payment_id) : cfOrderId,
          { customerEmail }
        );

        if (updatedOrder && customerEmail) {
          EmailService.sendTemplateEmail({
            templateId: 'tpl-order-confirmation',
            to: customerEmail,
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
    }
    
    res.json({ received: true });
  } catch (err: any) {
    console.error('[CASHFREE WEBHOOK PROCESSING ERROR]:', err);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});
`;

fs.writeFileSync('server/routes/webhooks.ts', newWebhookRouter, 'utf8');
console.log('Done refactoring webhooks.ts');
