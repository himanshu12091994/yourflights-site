const fs = require('fs');
let content = fs.readFileSync('server/routes/checkout.ts', 'utf8');

// Replace imports
content = content.replace("import Stripe from 'stripe';", "");
content = content.replace(
  "import { STRIPE_SECRET_KEY, APP_URL, ALLOWED_CURRENCIES } from '../config';",
  "import { CASHFREE_APP_ID, CASHFREE_SECRET_KEY, CASHFREE_ENV, APP_URL, ALLOWED_CURRENCIES } from '../config';"
);

// We'll just write a whole new /api/create-checkout-session endpoint since the stripe one is huge.
const newCreateCheckoutSession = `checkoutRouter.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { serviceName, currency = 'usd', isTestMode = false } = req.body;
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown User-Agent';
    const timestamp = new Date().toISOString();
    const auditId = \`AUD-\${Date.now()}-\${Math.floor(1000 + Math.random() * 9000)}\`;

    let unitAmount = 150; // $150.00 USD
    let dynamicLineItemName = 'Consulting Advisory Deliverable - Custom Strategy Planning Strategy';

    if (serviceName?.includes('150') || serviceName?.toLowerCase().includes('strategy')) {
      unitAmount = 150; 
      dynamicLineItemName = 'Consulting Advisory Deliverable - Custom Day-by-Day Strategy Planning Strategy';
    } else if (serviceName?.includes('75') || serviceName?.toLowerCase().includes('research')) {
      unitAmount = 75; 
      dynamicLineItemName = 'Consulting Advisory Deliverable - Market Research Report';
    } else if (serviceName?.includes('50') || serviceName?.toLowerCase().includes('prep')) {
      unitAmount = 50; 
      dynamicLineItemName = 'Consulting Advisory Deliverable - Pre-Departure Strategy Prep & Safety Advisory';
    }

    const disclosureText = 'I confirm I am purchasing consulting advisory and custom strategy research services from Your Consulting.';
    const auditRecord = {
      id: auditId,
      timestamp,
      clientIp,
      userAgent,
      mccAgreement: 'ACCEPTED',
      disclosureText,
      serviceName: dynamicLineItemName,
      amount: unitAmount,
      currency,
      isTestMode: Boolean(isTestMode),
    };
    addAuditRecord(auditRecord);

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      return res.json({
        isTestMode: true,
        success: true,
        url: \`\${APP_URL}/?success=true&testMode=true&auditId=\${auditId}\`,
        auditId,
        message: 'Cashfree keys not configured. Fallback simulation.'
      });
    }

    const baseUrl = CASHFREE_ENV === 'PRODUCTION' ? 'https://api.cashfree.com' : 'https://sandbox.cashfree.com';
    const cfOrderId = \`CF-\${Date.now()}-\${Math.floor(Math.random()*1000)}\`;

    const response = await fetch(\`\${baseUrl}/pg/orders\`, {
      method: 'POST',
      headers: {
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_amount: unitAmount,
        order_currency: 'USD',
        order_id: cfOrderId,
        customer_details: {
          customer_id: \`CUST_\${Date.now()}\`,
          customer_email: 'client@example.com',
          customer_phone: '9999999999',
          customer_name: 'Consulting Client'
        },
        order_meta: {
          return_url: \`\${APP_URL}/?success=true&order_id={order_id}\`
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create Cashfree order');
    }

    // Since we use Redirect Web-checkout, we return the paymentSessionId and let the frontend do the redirect
    // OR we return a special URL on our domain to handle the Cashfree SDK redirect.
    // We'll return our wrapper page URL.
    res.json({ url: \`\${APP_URL}/?page=cashfree-checkout&paymentSessionId=\${data.payment_session_id}\`, auditId, session: data });

  } catch (error: any) {
    console.error('[CASHFREE CHECKOUT ERROR]', error);
    res.status(500).json({ error: error.message });
  }
});`;

// Remove everything from checkoutRouter.post('/api/create-checkout-session' to the end of the file.
const startIndex = content.indexOf("checkoutRouter.post('/api/create-checkout-session'");
if (startIndex !== -1) {
    content = content.substring(0, startIndex) + newCreateCheckoutSession + "\n";
}

// Same for create-payment-intent
const createPaymentIntentStart = content.indexOf("checkoutRouter.post('/api/create-payment-intent'");
if (createPaymentIntentStart !== -1) {
    const end = content.indexOf("});", createPaymentIntentStart) + 3;
    content = content.substring(0, createPaymentIntentStart) + 
      `checkoutRouter.post('/api/create-payment-intent', (req, res) => res.status(400).json({error: 'Replaced with Cashfree orders'}));\n` + 
      content.substring(end);
}

fs.writeFileSync('server/routes/checkout.ts', content, 'utf8');
console.log('Done refactoring checkout.ts');
