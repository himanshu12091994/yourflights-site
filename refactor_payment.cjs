const fs = require('fs');
let content = fs.readFileSync('server/services/paymentService.ts', 'utf8');

// Replace imports
content = content.replace("import Stripe from 'stripe';", '');
content = content.replace(
  "import { STRIPE_SECRET_KEY, APP_URL } from '../config';",
  "import { CASHFREE_APP_ID, CASHFREE_SECRET_KEY, CASHFREE_ENV, APP_URL } from '../config';"
);

// Replace generatePaymentLink body
const oldStripeBlock = `if (STRIPE_SECRET_KEY && STRIPE_SECRET_KEY.trim().length > 0) {
      try {
        const stripe = new Stripe(STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: title,
                  description: \`Your Consulting LLC Consulting Advisory (MCC 8999 / 8999). Order ID: \${order.id}\`,
                },
                unit_amount: Math.round(payableAmount * 100),
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: successUrl,
          cancel_url: APP_URL,
          client_reference_id: order.id,
          metadata: {
            orderId: order.id,
            customerId: order.customerId,
            serviceName: order.serviceName,
            mcc: '7299/8999',
            statement_descriptor: 'YOUR CONSULTING ADVISORY',
          },
        });

        paymentUrl = session.url || '';
        providerTxnId = session.id;
      } catch (err: any) {
        console.error('[STRIPE PAYMENT LINK ERROR]:', err);
        return { success: false, error: err.message || 'Stripe payment link generation failed' };
      }
    } else {`;

const newCashfreeBlock = `if (CASHFREE_APP_ID && CASHFREE_SECRET_KEY) {
      try {
        const baseUrl = CASHFREE_ENV === 'PRODUCTION' ? 'https://api.cashfree.com' : 'https://sandbox.cashfree.com';
        
        const cfOrderId = \`CF-\${order.id}-\${Date.now()}\`;
        
        // Ensure amount is valid minimum
        const validAmount = Math.max(1, payableAmount);

        const response = await fetch(\`\${baseUrl}/pg/orders\`, {
          method: 'POST',
          headers: {
            'x-client-id': CASHFREE_APP_ID,
            'x-client-secret': CASHFREE_SECRET_KEY,
            'x-api-version': '2023-08-01',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_amount: validAmount,
            order_currency: 'INR', // Default to INR to avoid foreign currency issues in testing, but you can change to USD.
            order_id: cfOrderId,
            customer_details: {
              customer_id: order.customerId || \`CUST_\${Date.now()}\`,
              customer_email: 'support@yourflightsllc.com', // fallback
              customer_phone: '9999999999',
              customer_name: actorName || 'Corporate Client'
            },
            order_meta: {
              return_url: \`\${APP_URL}/?page=checkout-success&orderId=\${encodeURIComponent(order.id)}\`
            }
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error('[CASHFREE ERROR]:', data);
          throw new Error(data.message || 'Failed to create Cashfree order');
        }

        // Return a special internal URL that our frontend will use to load the Cashfree SDK
        paymentUrl = \`\${APP_URL}/?page=cashfree-checkout&paymentSessionId=\${data.payment_session_id}\`;
        providerTxnId = data.cf_order_id ? String(data.cf_order_id) : data.payment_session_id;
      } catch (err: any) {
        console.error('[CASHFREE PAYMENT LINK ERROR]:', err);
        return { success: false, error: err.message || 'Cashfree payment link generation failed' };
      }
    } else {`;

content = content.replace(oldStripeBlock, newCashfreeBlock);

// Replace STRIPE_SECRET_KEY references at the bottom of generatePaymentLink
content = content.replace(/provider: STRIPE_SECRET_KEY \? 'stripe' : 'simulation'/g, "provider: CASHFREE_APP_ID ? 'cashfree' : 'simulation'");
content = content.replace(/isTestMode: !STRIPE_SECRET_KEY/g, "isTestMode: !CASHFREE_APP_ID");

fs.writeFileSync('server/services/paymentService.ts', content, 'utf8');
console.log('Done refactoring paymentService.ts');
