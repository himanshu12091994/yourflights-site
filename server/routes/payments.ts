import { Router } from 'express';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { APP_URL, PAYU_MERCHANT_KEY, PAYU_MERCHANT_SALT, PAYU_ENV } from '../config';

export const paymentsRouter = Router();

// Unified Payment Link Generator
paymentsRouter.post('/api/admin/generate-payment-link', async (req, res) => {
  const authHeader = req.headers.authorization;
  const authQuery = req.query.token as string;

  if (!authHeader && !authQuery) {
    return res.status(401).json({ error: 'Unauthorized admin request' });
  }

  const { title, amount, returnUrl } = req.body;
  if (!title || !amount) {
    return res.status(400).json({ error: 'Missing title or amount' });
  }

  try {
    const successUrl = returnUrl || `${APP_URL}/?page=checkout-success`;

    // 1. Try Stripe
    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: title },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: APP_URL,
      });
      return res.json({ success: true, url: session.url, provider: 'stripe' });
    }

    // 2. Try Razorpay
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      // Razorpay Payment Link API
      const paymentLink = await razorpay.paymentLink.create({
        amount: Math.round(amount * 100),
        currency: 'USD',
        description: title,
        customer: { name: 'Valued Client', email: 'client@example.com' }, // Optional in Razorpay
        notify: { email: false, sms: false },
        reminder_enable: false,
        callback_url: successUrl,
        callback_method: 'get'
      });
      return res.json({ success: true, url: paymentLink.short_url, provider: 'razorpay' });
    }

    // 3. PayPal (Simplistic Link Return for Demo, requires complex token exchange in reality)
    if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
      // Due to PayPal's complex server-sdk setup for order links without frontend buttons,
      // a direct checkout URL requires building an Order and returning the 'approve' link.
      const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
      const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      const orderRes = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            description: title,
            amount: { currency_code: 'USD', value: amount.toFixed(2) }
          }],
          application_context: {
            return_url: successUrl,
            cancel_url: APP_URL
          }
        })
      });
      const orderData = await orderRes.json();
      const approveLink = orderData.links?.find((link: any) => link.rel === 'approve')?.href;
      
      if (approveLink) {
        return res.json({ success: true, url: approveLink, provider: 'paypal' });
      }
    }

    return res.status(400).json({ error: 'No active payment gateway credentials found in .env' });
  } catch (error: any) {
    console.error('Error generating payment link:', error);
    res.status(500).json({ error: error.message });
  }
});

// Virtual Terminal - Create PayU Hash
paymentsRouter.post('/api/admin/create-payu-hash', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized admin request' });
  }

  const { amount, customerName, customerEmail, customerPhone, productinfo } = req.body;
  if (!amount || !customerName || !customerEmail || !customerPhone) {
    return res.status(400).json({ error: 'Missing order parameters' });
  }

  try {
    const key = PAYU_MERCHANT_KEY;
    const salt = PAYU_MERCHANT_SALT;
    const env = PAYU_ENV;

    if (!key || !salt) {
      return res.status(400).json({ error: 'PayU is not configured.' });
    }

    const txnid = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const info = productinfo || 'Flight Services';

    // PayU Hash string: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
    const hashString = `${key}|${txnid}|${amount}|${info}|${customerName}|${customerEmail}|||||||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    res.json({ 
      success: true, 
      key,
      txnid,
      hash,
      environment: env 
    });
  } catch (error: any) {
    console.error('Error creating PayU hash:', error);
    res.status(500).json({ error: error.message });
  }
});

// Virtual Terminal - Check Card BIN (International vs Domestic)
paymentsRouter.post('/api/admin/check-card-bin', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized admin request' });
  }

  const { bin } = req.body;
  if (!bin || bin.length < 6) {
    return res.status(400).json({ error: 'Valid 6-digit BIN is required' });
  }

  try {
    const key = PAYU_MERCHANT_KEY;
    const salt = PAYU_MERCHANT_SALT;
    const env = PAYU_ENV;

    if (!key || !salt) {
      return res.status(400).json({ error: 'PayU is not configured.' });
    }

    const command = 'check_isDomestic';
    const var1 = bin.substring(0, 6);
    // Hash: key|command|var1|salt
    const hashString = `${key}|${command}|${var1}|${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    const payuUrl = env === 'PRODUCTION'
      ? 'https://info.payu.in/merchant/postservice?form=2'
      : 'https://test.payu.in/merchant/postservice?form=2';

    const params = new URLSearchParams();
    params.append('key', key);
    params.append('command', command);
    params.append('var1', var1);
    params.append('hash', hash);

    const response = await fetch(payuUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Error checking PayU BIN:', error);
    res.status(500).json({ error: error.message });
  }
});

// PayU Webhook Success (iframe callback)
paymentsRouter.post('/api/webhooks/payu/success', async (req, res) => {
  res.send(`
    <html>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f0fdf4;">
        <div style="text-align: center;">
          <h2 style="color: #166534; font-size: 24px; margin-bottom: 8px;">Payment Successful!</h2>
          <p style="color: #14532d;">The transaction has been approved. You can close this window.</p>
        </div>
        <script>
          setTimeout(() => {
            if (window.parent) {
              window.parent.postMessage('PAYU_SUCCESS', '*');
            }
          }, 1000);
        </script>
      </body>
    </html>
  `);
});

// PayU Webhook Failure (iframe callback)
paymentsRouter.post('/api/webhooks/payu/failure', async (req, res) => {
  res.send(`
    <html>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #fef2f2;">
        <div style="text-align: center;">
          <h2 style="color: #991b1b; font-size: 24px; margin-bottom: 8px;">Payment Failed</h2>
          <p style="color: #7f1d1d;">The transaction was declined or cancelled. Please try again.</p>
        </div>
        <script>
          setTimeout(() => {
            if (window.parent) {
              window.parent.postMessage('PAYU_FAILURE', '*');
            }
          }, 1500);
        </script>
      </body>
    </html>
  `);
});
