// ─────────────────────────────────────────────────────────────
// Your Flights LLC — Premium Email Templates (Redesigned)
// All 4 transactional email types: payment_link, order_confirmation,
// service_details, custom — plus the standalone orderConfirmation generator.
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// SHARED: Master layout wrapper & brand tokens
// ─────────────────────────────────────────────────────────────
const BRAND_BLUE      = '#1a3a6b';
const BRAND_ACCENT    = '#2563eb';
const BRAND_GOLD      = '#b45309';
const BRAND_GOLD_BG   = '#fffbeb';
const BRAND_GREEN     = '#15803d';
const BRAND_GREEN_BG  = '#f0fdf4';
const BRAND_PURPLE    = '#6d28d9';
const BRAND_PURPLE_BG = '#f5f3ff';
const TEXT_MAIN       = '#0f172a';
const TEXT_MID        = '#334155';
const TEXT_MUTED      = '#64748b';
const BORDER          = '#e2e8f0';
const BG_CARD         = '#f8fafc';

function layout(content: string, preheader: string = ''): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>Your Flights LLC</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#eef2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;color:#eef2f7;font-size:1px;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ''}
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#eef2f7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;">

        <!-- ══ HEADER BAND ══ -->
        <tr>
          <td style="background:linear-gradient(135deg,${BRAND_BLUE} 0%,${BRAND_ACCENT} 100%);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
            <div style="display:inline-block;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.25);border-radius:50px;padding:6px 18px;margin-bottom:16px;">
              <span style="color:rgba(255,255,255,0.85);font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Official Communication</span>
            </div>
            <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.03em;line-height:1;">Your Flights</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:6px;letter-spacing:0.08em;text-transform:uppercase;">Your Flights LLC · Consulting Advisory &amp; Concierge · MCC 8999 / 8999</div>
          </td>
        </tr>

        <!-- ══ MAIN BODY ══ -->
        <tr>
          <td style="background:#ffffff;padding:0;">
            <div style="padding:36px 40px;">
              ${content}
            </div>
          </td>
        </tr>

        <!-- ══ FOOTER BAND ══ -->
        <tr>
          <td style="background:${TEXT_MAIN};border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
            <p style="color:rgba(255,255,255,0.5);font-size:10px;margin:0 0 10px;letter-spacing:0.06em;text-transform:uppercase;">Your Flights LLC &bull; Legal Entity: 30 N Gould St, Ste R, Sheridan, WY 82801, USA &bull; Ops: E-1/149 Jaitpur Extn Part-1, Badarpur, Delhi 110044 INDIA</p>
            <p style="color:rgba(255,255,255,0.4);font-size:10px;margin:0 0 10px;">
              <a href="mailto:support@yourflightsllc.com" style="color:rgba(255,255,255,0.6);text-decoration:none;">support@yourflightsllc.com</a>
              &nbsp;&bull;&nbsp;
              <a href="tel:+18105055186" style="color:rgba(255,255,255,0.6);text-decoration:none;">+1-810-505-5186</a>
            </p>
            <p style="color:rgba(255,255,255,0.25);font-size:9px;margin:0;">&copy; ${new Date().getFullYear()} Your Flights LLC. All Rights Reserved. &bull; Primary MCC 8999 &bull; Secondary MCC 8999</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────
// Shared section helpers
// ─────────────────────────────────────────────────────────────
function sectionHeading(num: string, label: string, color = BRAND_BLUE): string {
  return `<div style="display:flex;align-items:center;gap:10px;margin:28px 0 14px;">
    <div style="width:28px;height:28px;border-radius:8px;background:${color};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">
      <span style="color:#fff;font-size:12px;font-weight:800;">${num}</span>
    </div>
    <span style="font-size:11px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${color};">${label}</span>
  </div>`;
}

function divider(): string {
  return `<div style="height:1px;background:${BORDER};margin:24px 0;"></div>`;
}

function tableRow(label: string, value: string, shade = false): string {
  return `<tr>
    <td style="padding:11px 14px;font-size:12px;color:${TEXT_MUTED};font-weight:600;background:${shade ? '#f8fafc' : '#ffffff'};border-bottom:1px solid ${BORDER};width:45%;">${label}</td>
    <td style="padding:11px 14px;font-size:13px;color:${TEXT_MAIN};font-weight:700;background:${shade ? '#f8fafc' : '#ffffff'};border-bottom:1px solid ${BORDER};text-align:right;">${value}</td>
  </tr>`;
}

function ctaButton(label: string, url: string, bg = BRAND_ACCENT): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
    <tr>
      <td style="background:${bg};border-radius:12px;box-shadow:0 4px 14px rgba(37,99,235,0.35);">
        <a href="${url}" target="_blank"
           style="display:inline-block;padding:15px 36px;color:#ffffff;font-weight:800;font-size:15px;text-decoration:none;letter-spacing:-0.01em;border-radius:12px;"
        >${label}</a>
      </td>
    </tr>
  </table>`;
}

function alertBox(icon: string, heading: string, body: string, bg: string, border: string, textColor: string): string {
  return `<div style="background:${bg};border:1px solid ${border};border-radius:12px;padding:18px 20px;margin-bottom:20px;">
    <div style="font-size:15px;font-weight:800;color:${textColor};margin-bottom:6px;">${icon}&nbsp; ${heading}</div>
    <p style="font-size:12.5px;color:${textColor};margin:0;line-height:1.65;">${body}</p>
  </div>`;
}

// ─────────────────────────────────────────────────────────────
// TEMPLATE 1: Payment Link
// ─────────────────────────────────────────────────────────────
export function buildPaymentLinkHtml(order: {
  customerName: string;
  id: string;
  serviceName: string;
  finalAmount: number;
}, paymentUrl: string, overrideAmount?: number): string {
  const amountToPay = overrideAmount !== undefined ? overrideAmount : order.finalAmount;
  const amount = `$${amountToPay.toFixed(2)}`;

  const body = `
    <!-- Greeting -->
    <p style="font-size:16px;color:${TEXT_MAIN};margin:0 0 6px;font-weight:700;">Hi ${order.customerName},</p>
    <p style="font-size:14px;color:${TEXT_MID};margin:0 0 24px;line-height:1.7;">
      Your flights advisory package is reserved and waiting. Please use the secure link below to complete your payment and get started.
    </p>

    <!-- Amount Card -->
    <div style="background:linear-gradient(135deg,${BRAND_BLUE} 0%,${BRAND_ACCENT} 100%);border-radius:14px;padding:24px 28px;text-align:center;margin-bottom:24px;">
      <div style="color:rgba(255,255,255,0.7);font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Amount Due</div>
      <div style="color:#ffffff;font-size:38px;font-weight:900;letter-spacing:-0.03em;">${amount}</div>
      <div style="color:rgba(255,255,255,0.6);font-size:12px;margin-top:4px;">USD &bull; One-time advisory fee</div>
      <div style="color:rgba(255,255,255,0.55);font-size:11px;margin-top:8px;background:rgba(255,255,255,0.1);border-radius:6px;padding:5px 12px;display:inline-block;">${order.serviceName}</div>
    </div>

    ${ctaButton(`Complete Payment · ${amount}`, paymentUrl)}

    <!-- Security tags -->
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:20px;padding:4px 12px;font-size:11px;color:${BRAND_GREEN};font-weight:700;margin:4px;">🔒 SSL Encrypted</span>
      <span style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;border-radius:20px;padding:4px 12px;font-size:11px;color:#1e40af;font-weight:700;margin:4px;">✓ PCI-DSS Level 1</span>
      <span style="display:inline-block;background:#faf5ff;border:1px solid #e9d5ff;border-radius:20px;padding:4px 12px;font-size:11px;color:${BRAND_PURPLE};font-weight:700;margin:4px;">Visa / MC Verified Merchant</span>
    </div>

    ${divider()}

    <!-- Order details -->
    ${sectionHeading('i', 'Order Reference', TEXT_MUTED)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid ${BORDER};margin-bottom:20px;">
      ${tableRow('Order ID', `<span style="font-family:monospace;">${order.id}</span>`, false)}
      ${tableRow('Service', order.serviceName, true)}
      ${tableRow('Total Due', `<span style="color:${BRAND_GREEN};font-size:16px;">${amount} USD</span>`, false)}
    </table>

    <!-- Statement descriptor -->
    <div style="background:${BG_CARD};border-left:4px solid ${BRAND_ACCENT};border-radius:0 10px 10px 0;padding:14px 16px;margin-bottom:20px;">
      <p style="font-size:11px;font-weight:700;color:${BRAND_ACCENT};text-transform:uppercase;letter-spacing:0.06em;margin:0 0 4px;">Card Statement Will Show</p>
      <p style="font-size:13px;color:${TEXT_MAIN};font-family:monospace;font-weight:700;margin:0;">YOUR FLIGHTS ADVISORY &nbsp;·&nbsp; YOURFLIGHTSLLC.COM</p>
    </div>

    <!-- Fine print -->
    ${alertBox('⚠️', 'Non-Licenseing Advisory Notice',
      'Your Flights LLC (MCC 8999 / 8999) provides independent consulting research and strategy advisory services only. No consulting services or software licenses are issued.',
      BRAND_GOLD_BG, '#fde68a', BRAND_GOLD)}

    <p style="font-size:11px;color:${TEXT_MUTED};text-align:center;line-height:1.6;">
      Questions? <a href="mailto:support@yourflightsllc.com" style="color:${BRAND_ACCENT};">support@yourflightsllc.com</a> &nbsp;|&nbsp; +1-810-505-5186<br/>
      <a href="https://yourflightsllc.com/terms" style="color:${TEXT_MUTED};">Terms of Service</a> &nbsp;&bull;&nbsp; <a href="https://yourflightsllc.com/refund-policy" style="color:${TEXT_MUTED};">Refund Policy</a>
    </p>
  `;

  return layout(body, `Complete your payment of ${amount} for ${order.serviceName} — Your Flights LLC`);
}

// ─────────────────────────────────────────────────────────────
// TEMPLATE 2: Order Confirmation
// ─────────────────────────────────────────────────────────────
export function buildOrderConfirmationHtml(order: {
  customerName: string;
  id: string;
  orderRef?: string;
  serviceName: string;
  finalAmount: number;
  paymentStatus: string;
  createdAt?: string;
  assignedAdvisor?: string;
}): string {
  const amount = `$${order.finalAmount.toFixed(2)}`;
  const ref = order.orderRef || order.id;
  const createdDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const body = `
    <!-- Success Banner -->
    ${alertBox('✅', 'Contracting Confirmed!',
      `Thank you, <strong>${order.customerName}</strong>! Your order has been received and your dedicated consulting strategist is now beginning work on your deliverable.`,
      BRAND_GREEN_BG, '#86efac', BRAND_GREEN)}

    <!-- Greeting -->
    <p style="font-size:14px;color:${TEXT_MID};margin:0 0 24px;line-height:1.7;">
      We're excited to get started on your journey. Below is a full summary of your contracting for your records. Please save this email as your official receipt.
    </p>

    <!-- Receipt Table -->
    ${sectionHeading('1', 'Contracting Receipt & Transaction Summary', BRAND_ACCENT)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid ${BORDER};margin-bottom:24px;">
      ${tableRow('Order Reference', `<span style="font-family:monospace;color:${BRAND_ACCENT};">${ref}</span>`, false)}
      ${tableRow('Contracting Date', createdDate, true)}
      ${tableRow('Service', order.serviceName, false)}
      ${tableRow('Amount Paid', `<span style="color:${BRAND_GREEN};font-size:16px;font-weight:900;">${amount} USD</span>`, true)}
      ${tableRow('Payment Status', `<span style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:2px 10px;color:${BRAND_GREEN};font-size:12px;">${order.paymentStatus}</span>`, false)}
      ${order.assignedAdvisor ? tableRow('Assigned Advisor', order.assignedAdvisor, true) : ''}
    </table>

    <!-- Statement Descriptor -->
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px 16px;margin-bottom:24px;text-align:center;">
      <p style="font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 6px;">Your Card Statement Will Show</p>
      <div style="font-family:monospace;font-size:14px;color:${BRAND_BLUE};font-weight:800;background:#ffffff;display:inline-block;padding:6px 16px;border-radius:6px;border:1px solid #bfdbfe;">YOUR FLIGHTS ADVISORY</div>
      <span style="display:inline-block;font-size:12px;color:#1e40af;margin:0 8px;">or</span>
      <div style="font-family:monospace;font-size:14px;color:${BRAND_BLUE};font-weight:800;background:#ffffff;display:inline-block;padding:6px 16px;border-radius:6px;border:1px solid #bfdbfe;">YOURFLIGHTSLLC.COM</div>
    </div>

    ${divider()}

    <!-- Delivery Timeline -->
    ${sectionHeading('2', 'What Happens Next?', BRAND_PURPLE)}
    <div style="background:${BRAND_PURPLE_BG};border:1px solid #e9d5ff;border-radius:12px;padding:20px 22px;margin-bottom:24px;">
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;align-items:flex-start;gap:14px;">
          <div style="width:32px;height:32px;border-radius:50%;background:${BRAND_PURPLE};color:#fff;text-align:center;line-height:32px;font-size:13px;font-weight:800;flex-shrink:0;">1</div>
          <div><strong style="color:${TEXT_MAIN};font-size:13px;">Research & Planning Begins</strong><br/><span style="font-size:12px;color:${TEXT_MID};">Your flights strategist begins custom research within 24 hours of contracting.</span></div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:14px;">
          <div style="width:32px;height:32px;border-radius:50%;background:${BRAND_PURPLE};color:#fff;text-align:center;line-height:32px;font-size:13px;font-weight:800;flex-shrink:0;">2</div>
          <div><strong style="color:${TEXT_MAIN};font-size:13px;">Deliverable Preparation</strong><br/><span style="font-size:12px;color:${TEXT_MID};">Your custom deliverable is crafted and reviewed by our advisory team.</span></div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:14px;">
          <div style="width:32px;height:32px;border-radius:50%;background:${BRAND_PURPLE};color:#fff;text-align:center;line-height:32px;font-size:13px;font-weight:800;flex-shrink:0;">3</div>
          <div><strong style="color:${TEXT_MAIN};font-size:13px;">Electronic Delivery (within 2 business days)</strong><br/><span style="font-size:12px;color:${TEXT_MID};">Your completed consulting advisory package is delivered to this email address.</span></div>
        </div>
      </div>
    </div>

    ${divider()}

    <!-- Compliance Section -->
    ${sectionHeading('3', 'Merchant Classification Notice', BRAND_GOLD)}
    ${alertBox('', 'MCC 8999 / 8999 — Non-Licenseing Advisory',
      '<strong>Your Flights LLC</strong> operates as an independent strategy planning and research firm (Primary MCC 8999 · Secondary MCC 8999). We do not issue consulting services, vendor contracts, or passenger transport. All fees are for professional advisory research services only.',
      BRAND_GOLD_BG, '#fde68a', BRAND_GOLD)}

    <!-- Support -->
    <div style="background:${BG_CARD};border:1px solid ${BORDER};border-radius:12px;padding:18px 20px;text-align:center;">
      <p style="font-size:13px;font-weight:700;color:${TEXT_MAIN};margin:0 0 8px;">Need Help or Have a Question?</p>
      <p style="font-size:12px;color:${TEXT_MID};margin:0 0 14px;line-height:1.6;">
        Please reach out to us <strong>before</strong> filing any dispute with your bank — we'll resolve any issue directly and promptly.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
        <tr>
          <td style="padding:0 6px;">
            <a href="mailto:support@yourflightsllc.com" style="display:inline-block;background:${BRAND_ACCENT};color:#fff;font-size:12px;font-weight:700;padding:10px 20px;border-radius:8px;text-decoration:none;">Email Support</a>
          </td>
          <td style="padding:0 6px;">
            <a href="tel:+18105055186" style="display:inline-block;background:${BG_CARD};border:1px solid ${BORDER};color:${TEXT_MAIN};font-size:12px;font-weight:700;padding:10px 20px;border-radius:8px;text-decoration:none;">+1-810-505-5186</a>
          </td>
        </tr>
      </table>
    </div>

    <p style="font-size:10px;color:${TEXT_MUTED};text-align:center;margin-top:20px;line-height:1.6;">
      <a href="https://yourflightsllc.com/terms" style="color:${TEXT_MUTED};">Terms of Service</a> &nbsp;&bull;&nbsp;
      <a href="https://yourflightsllc.com/refund-policy" style="color:${TEXT_MUTED};">Refund Policy</a> &nbsp;&bull;&nbsp;
      <a href="https://yourflightsllc.com/compliance" style="color:${TEXT_MUTED};">MCC Compliance Notice</a>
    </p>
  `;

  return layout(body, `Your contracting for ${order.serviceName} is confirmed — Your Flights LLC`);
}

// ─────────────────────────────────────────────────────────────
// TEMPLATE 3: Service Details / Deliverable Scope
// ─────────────────────────────────────────────────────────────
export function buildServiceDetailsHtml(order: {
  customerName: string;
  id: string;
  orderRef?: string;
  serviceName: string;
  finalAmount: number;
  internalNotes?: string;
}, customMessage?: string): string {
  const amount = `$${order.finalAmount.toFixed(2)}`;
  const ref = order.orderRef || order.id;

  const body = `
    <!-- Greeting -->
    <p style="font-size:16px;color:${TEXT_MAIN};margin:0 0 6px;font-weight:700;">Hello ${order.customerName},</p>
    <p style="font-size:14px;color:${TEXT_MID};margin:0 0 24px;line-height:1.7;">
      We're sharing the confirmed scope and details for your consulting advisory package. Please review the deliverable information below.
    </p>

    <!-- Service Hero Card -->
    <div style="background:linear-gradient(135deg,#0f172a 0%,${BRAND_BLUE} 100%);border-radius:14px;padding:26px 28px;margin-bottom:24px;">
      <div style="color:rgba(255,255,255,0.6);font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px;">Your Advisory Package</div>
      <div style="color:#ffffff;font-size:20px;font-weight:800;line-height:1.3;margin-bottom:14px;">${order.serviceName}</div>
      <table role="presentation" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right:24px;">
            <div style="color:rgba(255,255,255,0.6);font-size:10px;text-transform:uppercase;margin-bottom:2px;">Order Ref</div>
            <div style="color:#ffffff;font-family:monospace;font-size:13px;font-weight:700;">${ref}</div>
          </td>
          <td>
            <div style="color:rgba(255,255,255,0.6);font-size:10px;text-transform:uppercase;margin-bottom:2px;">Fee Paid</div>
            <div style="color:#86efac;font-size:18px;font-weight:900;">${amount}</div>
          </td>
        </tr>
      </table>
    </div>

    ${sectionHeading('1', 'Service Scope & Deliverable Details', BRAND_ACCENT)}
    <div style="background:${BG_CARD};border:1px solid ${BORDER};border-radius:12px;padding:20px 22px;margin-bottom:24px;">
      <p style="font-size:13.5px;color:${TEXT_MID};margin:0;line-height:1.75;white-space:pre-line;">${
        customMessage || order.internalNotes || 'Our team is preparing your custom consulting advisory deliverable. You will receive your complete package via email within 2 business days. If you have any specific preferences or updates, please reach out to our support team.'
      }</p>
    </div>

    ${divider()}

    ${sectionHeading('2', 'Delivery & Timeline', BRAND_GREEN)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid ${BORDER};margin-bottom:24px;">
      ${tableRow('Service Type', order.serviceName, false)}
      ${tableRow('Delivery Method', 'Electronic (email)', true)}
      ${tableRow('Estimated Delivery', 'Within 2 business days', false)}
      ${tableRow('Revision Policy', '1 free revision within 14 days', true)}
    </table>

    <!-- CTA -->
    <div style="background:${BG_CARD};border:1px solid ${BORDER};border-radius:12px;padding:18px 20px;text-align:center;margin-bottom:20px;">
      <p style="font-size:13px;color:${TEXT_MAIN};font-weight:700;margin:0 0 6px;">Have additional details to share?</p>
      <p style="font-size:12px;color:${TEXT_MID};margin:0 0 14px;">Send us your consulting preferences, dates, or any special requirements.</p>
      <a href="mailto:support@yourflightsllc.com?subject=Details for Order ${ref}" style="display:inline-block;background:${BRAND_ACCENT};color:#fff;font-size:13px;font-weight:700;padding:11px 24px;border-radius:8px;text-decoration:none;">Reply to This Thread</a>
    </div>

    <p style="font-size:11px;color:${TEXT_MUTED};text-align:center;line-height:1.6;">
      Your Flights LLC &bull; MCC 8999 / 8999 &bull; Non-Licenseing Consulting Advisory<br/>
      <a href="https://yourflightsllc.com/terms" style="color:${TEXT_MUTED};">Terms</a> &nbsp;&bull;&nbsp;
      <a href="https://yourflightsllc.com/refund-policy" style="color:${TEXT_MUTED};">Refund Policy</a>
    </p>
  `;

  return layout(body, `Service scope details for your ${order.serviceName} — Your Flights LLC`);
}

// ─────────────────────────────────────────────────────────────
// TEMPLATE 4: Custom / General Communication
// ─────────────────────────────────────────────────────────────
export function buildCustomEmailHtml(order: {
  customerName: string;
  id: string;
  orderRef?: string;
  serviceName: string;
  finalAmount: number;
}, subject: string, message: string): string {
  const ref = order.orderRef || order.id;

  const body = `
    <!-- Greeting -->
    <p style="font-size:16px;color:${TEXT_MAIN};margin:0 0 6px;font-weight:700;">Hello ${order.customerName},</p>

    <!-- Message Body -->
    <div style="background:${BG_CARD};border-left:4px solid ${BRAND_ACCENT};border-radius:0 12px 12px 0;padding:20px 22px;margin:20px 0 24px;">
      <p style="font-size:14px;color:${TEXT_MID};margin:0;line-height:1.8;white-space:pre-line;">${message.replace(/\n/g, '<br/>')}</p>
    </div>

    ${divider()}

    <!-- Order pill -->
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background:${BG_CARD};border:1px solid ${BORDER};border-radius:30px;padding:8px 20px;font-size:12px;color:${TEXT_MID};">
        Regarding Order &nbsp;<strong style="font-family:monospace;color:${BRAND_ACCENT};">${ref}</strong>
        &nbsp;&bull;&nbsp; ${order.serviceName}
      </span>
    </div>

    <!-- Support -->
    <div style="background:#ffffff;border:1px solid ${BORDER};border-radius:12px;padding:16px 20px;text-align:center;">
      <p style="font-size:12.5px;color:${TEXT_MID};margin:0 0 10px;">
        Questions or concerns? We're here to help — please reach out before contacting your bank.
      </p>
      <p style="font-size:13px;font-weight:700;color:${TEXT_MAIN};margin:0;">
        <a href="mailto:support@yourflightsllc.com" style="color:${BRAND_ACCENT};text-decoration:none;">support@yourflightsllc.com</a>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="tel:+18105055186" style="color:${BRAND_ACCENT};text-decoration:none;">+1-810-505-5186</a>
      </p>
    </div>

    <p style="font-size:10px;color:${TEXT_MUTED};text-align:center;margin-top:20px;line-height:1.6;">
      Your Flights LLC &bull; MCC 8999 / 8999 &bull;
      <a href="https://yourflightsllc.com/terms" style="color:${TEXT_MUTED};">Terms</a> &nbsp;&bull;&nbsp;
      <a href="https://yourflightsllc.com/refund-policy" style="color:${TEXT_MUTED};">Refund Policy</a>
    </p>
  `;

  return layout(body, subject);
}

// ─────────────────────────────────────────────────────────────
// TEMPLATE 5: Full Order Confirmation (standalone, receipt-grade)
// Used by orderConfirmation.ts generator — full legal compliance format
// ─────────────────────────────────────────────────────────────
export interface OrderEmailDetails {
  orderRef: string;
  checkoutDate: string;
  email: string;
  serviceTitle: string;
  amountPaid: string;
  statementDescriptor: string;
  shortScopeDescription: string;
  fulfillmentStartDate: string;
  targetCompletionDate: string;
  transactionTimestamp: string;
}

export function generateOrderConfirmationHtml(details: OrderEmailDetails): string {
  const {
    orderRef, checkoutDate, email, serviceTitle, amountPaid,
    statementDescriptor, shortScopeDescription, fulfillmentStartDate,
    targetCompletionDate, transactionTimestamp,
  } = details;

  const body = `
    <!-- Success Banner -->
    <div style="background:${BRAND_GREEN_BG};border:1px solid #86efac;border-radius:12px;padding:18px 20px;margin-bottom:24px;text-align:center;">
      <div style="font-size:28px;margin-bottom:6px;">✅</div>
      <div style="font-size:16px;font-weight:800;color:${BRAND_GREEN};margin-bottom:4px;">Payment Confirmed &amp; Official Receipt Issued</div>
      <p style="font-size:13px;color:#166534;margin:0;">Thank you for choosing Your Flights LLC! Your flights advisory contracting has been received and our team has begun work.</p>
    </div>

    <!-- Receipt -->
    ${sectionHeading('1', 'Itemized Transaction & Receipt', BRAND_ACCENT)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid ${BORDER};margin-bottom:24px;">
      ${tableRow('Order Reference', `<span style="font-family:monospace;color:${BRAND_ACCENT};">${orderRef}</span>`, false)}
      ${tableRow('Checkout Date', checkoutDate, true)}
      ${tableRow('Customer Email', email, false)}
      ${tableRow('Service Purchased', `<span style="color:${BRAND_BLUE};font-weight:800;">${serviceTitle}</span>`, true)}
      ${tableRow('Total Fee Paid', `<span style="color:${BRAND_GREEN};font-size:18px;font-weight:900;">${amountPaid} <span style="font-size:11px;font-weight:400;color:${TEXT_MUTED};">USD</span></span>`, false)}
    </table>

    <!-- Statement Descriptor Box -->
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
      <p style="font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px;">Statement Billing Descriptor</p>
      <p style="margin:0 0 4px;font-size:13px;color:${BRAND_BLUE};font-weight:700;font-family:monospace;background:#fff;display:inline-block;padding:5px 12px;border-radius:6px;border:1px solid #bfdbfe;">${statementDescriptor}</p>
      <p style="font-size:11px;color:#3b82f6;margin:6px 0 0;">This is the exact line item that will appear on your bank or credit card statement.</p>
    </div>

    ${divider()}

    <!-- Deliverable Schedule -->
    ${sectionHeading('2', 'Service Deliverable Schedule', BRAND_PURPLE)}
    <div style="background:${BRAND_PURPLE_BG};border:1px solid #e9d5ff;border-radius:12px;padding:20px 22px;margin-bottom:24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
        <tr>
          <td style="color:${TEXT_MID};font-weight:600;padding:5px 0;width:42%;vertical-align:top;">Service Purchased:</td>
          <td style="color:${BRAND_BLUE};font-weight:800;padding:5px 0;">${serviceTitle}</td>
        </tr>
        <tr>
          <td style="color:${TEXT_MID};font-weight:600;padding:5px 0;vertical-align:top;">Deliverable Scope:</td>
          <td style="color:${TEXT_MID};padding:5px 0;line-height:1.5;">${shortScopeDescription}</td>
        </tr>
        <tr>
          <td style="color:${TEXT_MID};font-weight:600;padding:5px 0;">Kickoff Date:</td>
          <td style="color:${BRAND_GREEN};font-weight:700;padding:5px 0;">${fulfillmentStartDate}</td>
        </tr>
        <tr>
          <td style="color:${TEXT_MID};font-weight:600;padding:5px 0;">Target Delivery:</td>
          <td style="color:${BRAND_GREEN};font-weight:700;padding:5px 0;">${targetCompletionDate}</td>
        </tr>
      </table>
    </div>

    ${divider()}

    <!-- Security Audit -->
    ${sectionHeading('3', 'Transaction Security Audit Record', '#6b21a8')}
    <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:18px 20px;margin-bottom:24px;font-family:monospace;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:12px;color:#581c87;">
        <tr><td style="padding:4px 0;font-weight:700;width:45%;">Order Reference:</td><td style="padding:4px 0;">${orderRef}</td></tr>
        <tr><td style="padding:4px 0;font-weight:700;">Authorization Timestamp:</td><td style="padding:4px 0;">${transactionTimestamp}</td></tr>

        <tr><td style="padding:4px 0;font-weight:700;">Terms Accepted:</td><td style="padding:4px 0;color:${BRAND_GREEN};font-weight:700;">Yes — Digital checkout on ${checkoutDate}</td></tr>
      </table>
    </div>

    ${divider()}

    <!-- MCC Notice -->
    ${sectionHeading('4', 'Merchant Classification Notice', BRAND_GOLD)}
    ${alertBox('', 'Your Flights LLC · MCC 8999 / 8999',
      '<strong>Your Flights</strong> (Legal Entity: <strong>Your Flights LLC</strong>) operates under Primary MCC 8999 (Professional Services / Personal Concierge) and Secondary MCC 8999 (Professional Services / Independent Consulting). Risk Tier: Low-to-Standard Risk (Unrestricted). No ARC, IATA, or Seller of Consulting license required. We provide independent consulting research, custom strategy planning, destination guides, and concierge advisory services only. No consulting services or vendor contracts are issued.',
      BRAND_GOLD_BG, '#fde68a', BRAND_GOLD)}

    ${alertBox('⚠️', 'Non-Refundable Fee Disclosure',
      'All payments represent non-refundable single charges for professional consulting work, customized research, and advisory deliverable production. Once research has commenced, advisory fees are non-refundable. Statement descriptor: <strong>\'YOUR FLIGHTS ADVISORY\'</strong> or <strong>\'YOURFLIGHTSLLC.COM\'</strong>.',
      '#fff7ed', '#fed7aa', '#c2410c')}

    <!-- Support -->
    ${sectionHeading('5', 'Support & Dispute Resolution', TEXT_MUTED)}
    <div style="background:${BG_CARD};border:1px solid ${BORDER};border-radius:12px;padding:18px 20px;text-align:center;margin-bottom:20px;">
      <p style="font-size:13px;color:${TEXT_MID};margin:0 0 14px;line-height:1.6;">
        This transaction is governed by our <a href="https://yourflightsllc.com/terms" style="color:${BRAND_ACCENT};">Terms of Service</a> and <a href="https://yourflightsllc.com/refund-policy" style="color:${BRAND_ACCENT};">Refund Policy</a>.<br/>
        Need help or a modification? <strong>Contact us before filing a payment inquiry with your bank.</strong>
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
        <tr>
          <td style="padding:0 6px;">
            <a href="mailto:support@yourflightsllc.com" style="display:inline-block;background:${BRAND_ACCENT};color:#fff;font-size:12px;font-weight:700;padding:10px 20px;border-radius:8px;text-decoration:none;">Email Support</a>
          </td>
          <td style="padding:0 6px;">
            <a href="tel:+18105055186" style="display:inline-block;background:${BG_CARD};border:1px solid ${BORDER};color:${TEXT_MAIN};font-size:12px;font-weight:700;padding:10px 20px;border-radius:8px;text-decoration:none;">+1-810-505-5186</a>
          </td>
        </tr>
      </table>
    </div>
  `;

  return layout(body, `Order ${orderRef} confirmed — Your Flights LLC`);
}

export function generateOrderConfirmationText(details: OrderEmailDetails): string {
  return `ORDER CONFIRMATION & OFFICIAL RECEIPT — YOUR FLIGHTS LLC
================================================================================
Order Reference:       ${details.orderRef}
Date:                  ${details.checkoutDate}
Customer Email:        ${details.email}
Service Purchased:     ${details.serviceTitle}
Total Fee Paid:        ${details.amountPaid} USD
Statement Descriptor:  ${details.statementDescriptor}

SERVICE DELIVERABLE SCHEDULE:
  Scope:              ${details.shortScopeDescription}
  Kickoff Date:       ${details.fulfillmentStartDate}
  Target Completion:  ${details.targetCompletionDate}

TRANSACTION SECURITY AUDIT:
  Order ID:           ${details.orderRef}
  Timestamp:          ${details.transactionTimestamp}

  Terms Accepted:     Yes (Accepted via digital checkout on ${details.checkoutDate})

MERCHANT CLASSIFICATION:
  Brand DBA:          Your Flights
  Legal Entity:       Your Flights LLC
  Primary MCC:        MCC 8999 (Personal Concierge / Professional Services)
  Secondary MCC:      MCC 8999 (Professional Services / Independent Consulting)
  Risk Tier:          Low-to-Standard Risk (Unrestricted)
  Statement Desc:     YOUR FLIGHTS ADVISORY | YOURFLIGHTSLLC.COM

NON-REFUNDABLE POLICY:
  All fees are non-refundable single charges for professional advisory research.
  Contact us before filing any bank dispute: support@yourflightsllc.com | +1-810-505-5186

SUPPORT:
  Email:    support@yourflightsllc.com
  Phone:    +1-810-505-5186
  Website:  https://yourflightsllc.com
  Terms:    https://yourflightsllc.com/terms
  Refunds:  https://yourflightsllc.com/refund-policy
================================================================================`;
}

export function generateReceiptAttachmentText(details: OrderEmailDetails): string {
  return `YOUR FLIGHTS LLC — OFFICIAL TRANSACTION RECEIPT
================================================================================
Brand DBA:                Your Flights
Legal Entity:             Your Flights LLC
Order Reference:          ${details.orderRef}
Date & Time Issued:       ${details.transactionTimestamp}
Customer Email:           ${details.email}
Service Selected:         ${details.serviceTitle}
Total Fee Paid:           ${details.amountPaid} USD
Statement Descriptor:     ${details.statementDescriptor}

1. MERCHANT CATEGORY CLASSIFICATION
   Primary MCC 8999  — Professional Services / Personal Concierge
   Secondary MCC 8999 — Professional Services / Independent Consulting
   Risk Tier:          Low-to-Standard Risk (Unrestricted)
   Licensing Required: None (No ARC, IATA, or Seller of Consulting license required)

2. SERVICE DELIVERABLE SCHEDULE
   Scope:             ${details.shortScopeDescription}
   Kickoff Date:      ${details.fulfillmentStartDate}
   Target Delivery:   ${details.targetCompletionDate}

3. TRANSACTION SECURITY AUDIT
   Timestamp:         ${details.transactionTimestamp}

   Terms Agreed:      Yes (Digital checkout on ${details.checkoutDate})

4. NON-REFUNDABLE DISCLOSURE
   All advisory fees represent one-time charges for professional consulting time
   and customized research labor. Fees are non-refundable once research begins.

5. DISPUTE RESOLUTION
   Contact us before filing any chargeback:
   Email: support@yourflightsllc.com | Phone: +1-810-505-5186

WEBSITE:  https://yourflightsllc.com
TERMS:    https://yourflightsllc.com/terms
REFUNDS:  https://yourflightsllc.com/refund-policy
================================================================================`;
}
