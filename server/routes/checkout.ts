// ─────────────────────────────────────────────────────────────
// Stripe/PayU Checkout Routes
// Fully configured for MCC 8999 / 8999 Consulting Advisory compliance.
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import crypto from 'crypto';

import { PAYU_MERCHANT_KEY, PAYU_MERCHANT_SALT, PAYU_ENV, APP_URL, ALLOWED_CURRENCIES } from '../config';
import { addAuditRecord, ComplianceAuditRecord } from '../store/auditLogs';

export const checkoutRouter = Router();

// In-memory debug log buffer for payment debugging
const checkoutDebugLogs: Array<{
  timestamp: string;
  auditId: string;
  errorType?: string;
  errorCode?: string;
  declineCode?: string;
  param?: string;
  message: string;
  rawError?: any;
  requestBody: any;
}> = [];

checkoutRouter.get('/api/debug-checkout-logs', (_req, res) => {
  res.json({
    success: true,
    totalCount: checkoutDebugLogs.length,
    logs: checkoutDebugLogs,
  });
});

checkoutRouter.post('/api/create-payment-intent', (req, res) => res.status(400).json({error: 'Replaced with PayU orders'}));

checkoutRouter.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { serviceName, currency = 'usd', isTestMode = false } = req.body;
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown User-Agent';
    const timestamp = new Date().toISOString();
    const auditId = `AUD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

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

    const disclosureText = 'I confirm I am purchasing consulting advisory and custom strategy research services from Your Flights.';
    const auditRecord = {
      id: auditId,
      timestamp,
      clientIp,
      userAgent,
      mccAgreement: 'ACCEPTED' as const,
      disclosureText,
      serviceName: dynamicLineItemName,
      amount: unitAmount,
      currency,
      isTestMode: Boolean(isTestMode),
    };
    addAuditRecord(auditRecord);

    if (!PAYU_MERCHANT_KEY || !PAYU_MERCHANT_SALT) {
      return res.json({
        isTestMode: true,
        success: true,
        url: `/?success=true&testMode=true&auditId=${auditId}`,
        auditId,
        message: 'PayU keys not configured. Fallback simulation.'
      });
    }

    // Redirect user to the PayU custom checkout page with amount and service name
    res.json({ 
      url: `/?page=payu-checkout&amount=${unitAmount}&service=${encodeURIComponent(dynamicLineItemName)}&auditId=${auditId}`, 
      auditId 
    });

  } catch (error: any) {
    console.error('[CHECKOUT ERROR]', error);
    res.status(500).json({ error: error.message });
  }
});

// Public endpoint for frontend to generate PayU hash for public website checkout
checkoutRouter.post('/api/create-public-payu-hash', (req, res) => {
  const { amount, customerName, customerEmail, customerPhone, productinfo, auditId } = req.body;
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

    const txnid = `txn_pub_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
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
    console.error('Error creating public PayU hash:', error);
    res.status(500).json({ error: error.message });
  }
});
