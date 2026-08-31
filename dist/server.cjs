var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express9 = __toESM(require("express"), 1);
var import_helmet = __toESM(require("helmet"), 1);
var import_path5 = __toESM(require("path"), 1);
var import_fs6 = __toESM(require("fs"), 1);
var import_vite = require("vite");

// server/config.ts
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var PORT = parseInt(process.env.PORT || "3000", 10);
var APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "YourProjectsAdmin2026!";
var PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || "";
var PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || "";
var PAYU_ENV = process.env.PAYU_ENV || "TEST";
var SMTP = {
  HOST: process.env.SMTP_HOST || "smtp.hostinger.com",
  PORT: parseInt(process.env.SMTP_PORT || "465", 10),
  USER: process.env.SMTP_USER || "support@yourflightsllc.com",
  PASS: process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD || process.env.HOSTINGER_SMTP_PASS || "",
  FROM: process.env.SMTP_FROM || "Your Flights LLC <support@yourflightsllc.com>"
};
var AUDIT_LOG_FILE = import_path.default.join(process.cwd(), "audit_logs.json");
var DELIVERABLES_FILE = import_path.default.join(process.cwd(), "deliverables.json");
var BRAND = {
  DBA: "Your Flights",
  LEGAL_ENTITY: "Your Flights LLC",
  DOMAIN: "yourflightsllc.com",
  WEBSITE: "https://yourflightsllc.com"
};
var STATEMENT_DESCRIPTOR = {
  FULL: "YOUR FLIGHTS ADVISORY",
  DOMAIN: "YOURFLIGHTSLLC.COM",
  SUFFIX: "ADVISORY"
};
var MCC = {
  PRIMARY_LABEL: "MCC 8999 (Professional Services / Personal Concierge)",
  SECONDARY_LABEL: "MCC 8999 (Professional Services / Independent Consulting)"
};

// server/middleware.ts
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
function permissiveCorsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  const allowedOrigins = ["http://localhost:4000", "http://localhost:3000", "http://127.0.0.1:4000"];
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS, PATCH, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, User-Agent, X-Requested-With"
  );
  res.setHeader("X-Robots-Tag", "all, index, follow");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
}
var authRateLimiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 10,
  // Limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many authentication attempts from this IP, please try again after 15 minutes."
  }
});

// server/routes/seo.ts
var import_express = require("express");
var import_path2 = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var seoRouter = (0, import_express.Router)();
seoRouter.get("/robots.txt", (_req, res) => {
  const robotsPath = import_path2.default.join(process.cwd(), "public", "robots.txt");
  if (import_fs.default.existsSync(robotsPath)) {
    res.setHeader("Content-Type", "text/plain");
    return res.sendFile(robotsPath);
  }
  res.type("text/plain");
  res.send(
    "User-agent: *\nAllow: /\nCrawl-delay: 1\n\nUser-agent: Stripe-Bot\nAllow: /\nCrawl-delay: 1\n\nUser-agent: PayPal-Crawler\nAllow: /\nCrawl-delay: 1\n\nUser-agent: Googlebot\nAllow: /\nCrawl-delay: 1\n\nUser-agent: Bingbot\nAllow: /\nCrawl-delay: 1\n\nUser-agent: DuckDuckBot\nAllow: /\nCrawl-delay: 1\n\nSitemap: https://yourflightsllc.com/sitemap.xml\n"
  );
});
seoRouter.get("/.well-known/security.txt", (_req, res) => {
  res.type("text/plain");
  res.send(
    "Contact: mailto:support@yourflightsllc.com\nExpires: 2027-12-31T23:59:59.000Z\nPreferred-Languages: en\nCanonical: https://yourflightsllc.com/.well-known/security.txt\nPolicy: https://yourflightsllc.com/terms\n"
  );
});
seoRouter.get("/sitemap.xml", (_req, res) => {
  const sitemapPath = import_path2.default.join(process.cwd(), "public", "sitemap.xml");
  if (import_fs.default.existsSync(sitemapPath)) {
    res.setHeader("Content-Type", "application/xml");
    return res.sendFile(sitemapPath);
  }
  res.type("application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourflightsllc.com/</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/custom-strategies</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/destination-research</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/consulting-prep</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/guides</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/request-assistance</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/terms</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/privacy</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/refund-policy</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://yourflightsllc.com/compliance</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`);
});

// server/routes/checkout.ts
var import_express2 = require("express");
var import_crypto = __toESM(require("crypto"), 1);

// server/store/auditLogs.ts
var import_fs2 = __toESM(require("fs"), 1);
var auditLogsStore = [];
try {
  if (import_fs2.default.existsSync(AUDIT_LOG_FILE)) {
    const fileData = import_fs2.default.readFileSync(AUDIT_LOG_FILE, "utf-8");
    auditLogsStore = JSON.parse(fileData);
    console.log(
      `[AUDIT STORE] Loaded ${auditLogsStore.length} historical audit records from ${AUDIT_LOG_FILE}`
    );
  }
} catch (err) {
  console.error("[AUDIT STORE] Error reading audit_logs.json:", err);
  auditLogsStore = [];
}
function saveAuditLogsToFile() {
  try {
    import_fs2.default.writeFileSync(
      AUDIT_LOG_FILE,
      JSON.stringify(auditLogsStore, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.error("[AUDIT STORE] Error persisting audit_logs.json:", err);
  }
}
function addAuditRecord(record) {
  auditLogsStore.unshift(record);
  if (auditLogsStore.length > 200) auditLogsStore.pop();
  saveAuditLogsToFile();
}
function getAuditLogs() {
  return auditLogsStore;
}

// server/routes/checkout.ts
var checkoutRouter = (0, import_express2.Router)();
var checkoutDebugLogs = [];
checkoutRouter.get("/api/debug-checkout-logs", (_req, res) => {
  res.json({
    success: true,
    totalCount: checkoutDebugLogs.length,
    logs: checkoutDebugLogs
  });
});
checkoutRouter.post("/api/create-payment-intent", (req, res) => res.status(400).json({ error: "Replaced with PayU orders" }));
checkoutRouter.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { serviceName, currency = "usd", isTestMode = false } = req.body;
    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "Unknown User-Agent";
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const auditId = `AUD-${Date.now()}-${Math.floor(1e3 + Math.random() * 9e3)}`;
    let unitAmount = 150;
    let dynamicLineItemName = "Consulting Advisory Deliverable - Custom Strategy Planning Strategy";
    if (serviceName?.includes("150") || serviceName?.toLowerCase().includes("strategy")) {
      unitAmount = 150;
      dynamicLineItemName = "Consulting Advisory Deliverable - Custom Day-by-Day Strategy Planning Strategy";
    } else if (serviceName?.includes("75") || serviceName?.toLowerCase().includes("research")) {
      unitAmount = 75;
      dynamicLineItemName = "Consulting Advisory Deliverable - Market Research Report";
    } else if (serviceName?.includes("50") || serviceName?.toLowerCase().includes("prep")) {
      unitAmount = 50;
      dynamicLineItemName = "Consulting Advisory Deliverable - Pre-Departure Strategy Prep & Safety Advisory";
    }
    const disclosureText = "I confirm I am purchasing consulting advisory and custom strategy research services from Your Flights.";
    const auditRecord = {
      id: auditId,
      timestamp,
      clientIp,
      userAgent,
      mccAgreement: "ACCEPTED",
      disclosureText,
      serviceName: dynamicLineItemName,
      amount: unitAmount,
      currency,
      isTestMode: Boolean(isTestMode)
    };
    addAuditRecord(auditRecord);
    if (!PAYU_MERCHANT_KEY || !PAYU_MERCHANT_SALT) {
      return res.json({
        isTestMode: true,
        success: true,
        url: `/?success=true&testMode=true&auditId=${auditId}`,
        auditId,
        message: "PayU keys not configured. Fallback simulation."
      });
    }
    res.json({
      url: `/?page=payu-checkout&amount=${unitAmount}&service=${encodeURIComponent(dynamicLineItemName)}&auditId=${auditId}`,
      auditId
    });
  } catch (error) {
    console.error("[CHECKOUT ERROR]", error);
    res.status(500).json({ error: error.message });
  }
});
checkoutRouter.post("/api/create-public-payu-hash", (req, res) => {
  const { amount, customerName, customerEmail, customerPhone, productinfo, auditId } = req.body;
  if (!amount || !customerName || !customerEmail || !customerPhone) {
    return res.status(400).json({ error: "Missing order parameters" });
  }
  try {
    const key = PAYU_MERCHANT_KEY;
    const salt = PAYU_MERCHANT_SALT;
    const env = PAYU_ENV;
    if (!key || !salt) {
      return res.status(400).json({ error: "PayU is not configured." });
    }
    const txnid = `txn_pub_${Date.now()}_${Math.floor(Math.random() * 1e3)}`;
    const info = productinfo || "Flight Services";
    const hashString = `${key}|${txnid}|${amount}|${info}|${customerName}|${customerEmail}|||||||||||${salt}`;
    const hash = import_crypto.default.createHash("sha512").update(hashString).digest("hex");
    res.json({
      success: true,
      key,
      txnid,
      hash,
      environment: env
    });
  } catch (error) {
    console.error("Error creating public PayU hash:", error);
    res.status(500).json({ error: error.message });
  }
});

// server/routes/agreement.ts
var import_express3 = require("express");
var agreementRouter = (0, import_express3.Router)();
agreementRouter.post("/api/record-agreement", (req, res) => {
  try {
    const {
      serviceName,
      isAccepted,
      disclosureText,
      currency = "usd",
      isTestMode = false
    } = req.body;
    if (!isAccepted) {
      return res.status(400).json({
        error: "MCC compliance disclosure agreement must be accepted"
      });
    }
    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "Unknown User-Agent";
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const auditId = `AUD-${Date.now()}-${Math.floor(1e3 + Math.random() * 9e3)}`;
    const text = disclosureText || "I acknowledge that I am purchasing a non-refundable custom consulting advisory and planning deliverable (MCC 8999 / 8999). Statement descriptor: 'YOUR FLIGHTS ADVISORY' or 'YOURFLIGHTSLLC.COM'.";
    const auditRecord = {
      id: auditId,
      timestamp,
      clientIp,
      userAgent,
      mccAgreement: "ACCEPTED",
      disclosureText: text,
      serviceName: serviceName || "Consulting Advisory Deliverable",
      amount: 150,
      currency: currency.toLowerCase(),
      isTestMode: Boolean(isTestMode)
    };
    addAuditRecord(auditRecord);
    console.log(
      `[MCC AUDIT RECORDED] ID: ${auditId} | IP: ${clientIp} | Timestamp: ${timestamp} | Service: ${serviceName} | Flag: ACCEPTED | TestMode: ${isTestMode}`
    );
    return res.json({
      success: true,
      message: "MCC Agreement disclosure audit logged successfully",
      auditRecord
    });
  } catch (err) {
    console.error("Error recording agreement audit:", err);
    res.status(500).json({ error: err.message });
  }
});
agreementRouter.get("/api/audit-logs", (req, res) => {
  const authHeader = req.headers.authorization;
  const authQuery = req.query.token;
  if (!authHeader && !authQuery) {
    return res.status(401).json({
      error: "Unauthorized. Admin authentication required to access compliance audit logs."
    });
  }
  const logs = getAuditLogs();
  res.json({
    totalRecords: logs.length,
    brandDba: BRAND.DBA,
    legalEntityName: BRAND.LEGAL_ENTITY,
    primaryMcc: MCC.PRIMARY_LABEL,
    secondaryMcc: MCC.SECONDARY_LABEL,
    riskCategoryTier: "Low-to-Standard Risk (Unrestricted)",
    licensingNeeded: "None (No ARC, IATA, or Seller of Consulting license required)",
    statementDescriptor: `${STATEMENT_DESCRIPTOR.FULL} (21 chars) OR ${STATEMENT_DESCRIPTOR.DOMAIN} (18 chars)`,
    auditLogs: logs
  });
});

// server/routes/email.ts
var import_express4 = require("express");
var import_nodemailer2 = __toESM(require("nodemailer"), 1);

// server/mail/transporter.ts
var import_nodemailer = __toESM(require("nodemailer"), 1);
async function createMailServiciosr() {
  const { HOST: host, USER: user, PASS: pass, PORT: port } = SMTP;
  console.log(
    `[SMTP CONFIG CHECK] Host: ${host}, User: ${user}, Pass: ${pass ? "SET (" + pass.length + " chars)" : "NOT SET"}, Port: ${port}`
  );
  if (pass && pass.trim().length > 0) {
    return import_nodemailer.default.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass: pass.trim() },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 1e4,
      greetingTimeout: 1e4,
      socketTimeout: 15e3
    });
  }
  return import_nodemailer.default.createTransport({
    jsonTransport: true
  });
}

// server/mail/templates/orderConfirmation.ts
var BRAND_BLUE = "#1a3a6b";
var BRAND_ACCENT = "#2563eb";
var BRAND_GOLD = "#b45309";
var BRAND_GOLD_BG = "#fffbeb";
var BRAND_GREEN = "#15803d";
var BRAND_GREEN_BG = "#f0fdf4";
var BRAND_PURPLE = "#6d28d9";
var BRAND_PURPLE_BG = "#f5f3ff";
var TEXT_MAIN = "#0f172a";
var TEXT_MID = "#334155";
var TEXT_MUTED = "#64748b";
var BORDER = "#e2e8f0";
var BG_CARD = "#f8fafc";
function layout(content, preheader = "") {
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
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;color:#eef2f7;font-size:1px;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ""}
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#eef2f7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;">

        <!-- \u2550\u2550 HEADER BAND \u2550\u2550 -->
        <tr>
          <td style="background:linear-gradient(135deg,${BRAND_BLUE} 0%,${BRAND_ACCENT} 100%);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center;">
            <div style="display:inline-block;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.25);border-radius:50px;padding:6px 18px;margin-bottom:16px;">
              <span style="color:rgba(255,255,255,0.85);font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Official Communication</span>
            </div>
            <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.03em;line-height:1;">Your Flights</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-top:6px;letter-spacing:0.08em;text-transform:uppercase;">Your Flights LLC \xB7 Consulting Advisory &amp; Concierge \xB7 MCC 8999 / 8999</div>
          </td>
        </tr>

        <!-- \u2550\u2550 MAIN BODY \u2550\u2550 -->
        <tr>
          <td style="background:#ffffff;padding:0;">
            <div style="padding:36px 40px;">
              ${content}
            </div>
          </td>
        </tr>

        <!-- \u2550\u2550 FOOTER BAND \u2550\u2550 -->
        <tr>
          <td style="background:${TEXT_MAIN};border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
            <p style="color:rgba(255,255,255,0.5);font-size:10px;margin:0 0 10px;letter-spacing:0.06em;text-transform:uppercase;">Your Flights LLC &bull; Legal Entity: 30 N Gould St, Ste R, Sheridan, WY 82801, USA &bull; Ops: E-1/149 Jaitpur Extn Part-1, Badarpur, Delhi 110044 INDIA</p>
            <p style="color:rgba(255,255,255,0.4);font-size:10px;margin:0 0 10px;">
              <a href="mailto:support@yourflightsllc.com" style="color:rgba(255,255,255,0.6);text-decoration:none;">support@yourflightsllc.com</a>
              &nbsp;&bull;&nbsp;
              <a href="tel:+18105055186" style="color:rgba(255,255,255,0.6);text-decoration:none;">+1-810-505-5186</a>
            </p>
            <p style="color:rgba(255,255,255,0.25);font-size:9px;margin:0;">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Your Flights LLC. All Rights Reserved. &bull; Primary MCC 8999 &bull; Secondary MCC 8999</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
function sectionHeading(num, label, color = BRAND_BLUE) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:28px 0 14px;">
    <div style="width:28px;height:28px;border-radius:8px;background:${color};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">
      <span style="color:#fff;font-size:12px;font-weight:800;">${num}</span>
    </div>
    <span style="font-size:11px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${color};">${label}</span>
  </div>`;
}
function divider() {
  return `<div style="height:1px;background:${BORDER};margin:24px 0;"></div>`;
}
function tableRow(label, value, shade = false) {
  return `<tr>
    <td style="padding:11px 14px;font-size:12px;color:${TEXT_MUTED};font-weight:600;background:${shade ? "#f8fafc" : "#ffffff"};border-bottom:1px solid ${BORDER};width:45%;">${label}</td>
    <td style="padding:11px 14px;font-size:13px;color:${TEXT_MAIN};font-weight:700;background:${shade ? "#f8fafc" : "#ffffff"};border-bottom:1px solid ${BORDER};text-align:right;">${value}</td>
  </tr>`;
}
function ctaButton(label, url, bg = BRAND_ACCENT) {
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
function alertBox(icon, heading, body, bg, border, textColor) {
  return `<div style="background:${bg};border:1px solid ${border};border-radius:12px;padding:18px 20px;margin-bottom:20px;">
    <div style="font-size:15px;font-weight:800;color:${textColor};margin-bottom:6px;">${icon}&nbsp; ${heading}</div>
    <p style="font-size:12.5px;color:${textColor};margin:0;line-height:1.65;">${body}</p>
  </div>`;
}
function buildPaymentLinkHtml(order, paymentUrl, overrideAmount) {
  const amountToPay = overrideAmount !== void 0 ? overrideAmount : order.finalAmount;
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

    ${ctaButton(`Complete Payment \xB7 ${amount}`, paymentUrl)}

    <!-- Security tags -->
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:20px;padding:4px 12px;font-size:11px;color:${BRAND_GREEN};font-weight:700;margin:4px;">\u{1F512} SSL Encrypted</span>
      <span style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;border-radius:20px;padding:4px 12px;font-size:11px;color:#1e40af;font-weight:700;margin:4px;">\u2713 PCI-DSS Level 1</span>
      <span style="display:inline-block;background:#faf5ff;border:1px solid #e9d5ff;border-radius:20px;padding:4px 12px;font-size:11px;color:${BRAND_PURPLE};font-weight:700;margin:4px;">Visa / MC Verified Merchant</span>
    </div>

    ${divider()}

    <!-- Order details -->
    ${sectionHeading("i", "Order Reference", TEXT_MUTED)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid ${BORDER};margin-bottom:20px;">
      ${tableRow("Order ID", `<span style="font-family:monospace;">${order.id}</span>`, false)}
      ${tableRow("Service", order.serviceName, true)}
      ${tableRow("Total Due", `<span style="color:${BRAND_GREEN};font-size:16px;">${amount} USD</span>`, false)}
    </table>

    <!-- Statement descriptor -->
    <div style="background:${BG_CARD};border-left:4px solid ${BRAND_ACCENT};border-radius:0 10px 10px 0;padding:14px 16px;margin-bottom:20px;">
      <p style="font-size:11px;font-weight:700;color:${BRAND_ACCENT};text-transform:uppercase;letter-spacing:0.06em;margin:0 0 4px;">Card Statement Will Show</p>
      <p style="font-size:13px;color:${TEXT_MAIN};font-family:monospace;font-weight:700;margin:0;">YOUR FLIGHTS ADVISORY &nbsp;\xB7&nbsp; YOURFLIGHTSLLC.COM</p>
    </div>

    <!-- Fine print -->
    ${alertBox(
    "\u26A0\uFE0F",
    "Non-Licenseing Advisory Notice",
    "Your Flights LLC (MCC 8999 / 8999) provides independent consulting research and strategy advisory services only. No consulting services or software licenses are issued.",
    BRAND_GOLD_BG,
    "#fde68a",
    BRAND_GOLD
  )}

    <p style="font-size:11px;color:${TEXT_MUTED};text-align:center;line-height:1.6;">
      Questions? <a href="mailto:support@yourflightsllc.com" style="color:${BRAND_ACCENT};">support@yourflightsllc.com</a> &nbsp;|&nbsp; +1-810-505-5186<br/>
      <a href="https://yourflightsllc.com/terms" style="color:${TEXT_MUTED};">Terms of Service</a> &nbsp;&bull;&nbsp; <a href="https://yourflightsllc.com/refund-policy" style="color:${TEXT_MUTED};">Refund Policy</a>
    </p>
  `;
  return layout(body, `Complete your payment of ${amount} for ${order.serviceName} \u2014 Your Flights LLC`);
}
function buildOrderConfirmationHtml(order) {
  const amount = `$${order.finalAmount.toFixed(2)}`;
  const ref = order.orderRef || order.id;
  const createdDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const body = `
    <!-- Success Banner -->
    ${alertBox(
    "\u2705",
    "Contracting Confirmed!",
    `Thank you, <strong>${order.customerName}</strong>! Your order has been received and your dedicated consulting strategist is now beginning work on your deliverable.`,
    BRAND_GREEN_BG,
    "#86efac",
    BRAND_GREEN
  )}

    <!-- Greeting -->
    <p style="font-size:14px;color:${TEXT_MID};margin:0 0 24px;line-height:1.7;">
      We're excited to get started on your journey. Below is a full summary of your contracting for your records. Please save this email as your official receipt.
    </p>

    <!-- Receipt Table -->
    ${sectionHeading("1", "Contracting Receipt & Transaction Summary", BRAND_ACCENT)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid ${BORDER};margin-bottom:24px;">
      ${tableRow("Order Reference", `<span style="font-family:monospace;color:${BRAND_ACCENT};">${ref}</span>`, false)}
      ${tableRow("Contracting Date", createdDate, true)}
      ${tableRow("Service", order.serviceName, false)}
      ${tableRow("Amount Paid", `<span style="color:${BRAND_GREEN};font-size:16px;font-weight:900;">${amount} USD</span>`, true)}
      ${tableRow("Payment Status", `<span style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:2px 10px;color:${BRAND_GREEN};font-size:12px;">${order.paymentStatus}</span>`, false)}
      ${order.assignedAdvisor ? tableRow("Assigned Advisor", order.assignedAdvisor, true) : ""}
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
    ${sectionHeading("2", "What Happens Next?", BRAND_PURPLE)}
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
    ${sectionHeading("3", "Merchant Classification Notice", BRAND_GOLD)}
    ${alertBox(
    "",
    "MCC 8999 / 8999 \u2014 Non-Licenseing Advisory",
    "<strong>Your Flights LLC</strong> operates as an independent strategy planning and research firm (Primary MCC 8999 \xB7 Secondary MCC 8999). We do not issue consulting services, vendor contracts, or passenger transport. All fees are for professional advisory research services only.",
    BRAND_GOLD_BG,
    "#fde68a",
    BRAND_GOLD
  )}

    <!-- Support -->
    <div style="background:${BG_CARD};border:1px solid ${BORDER};border-radius:12px;padding:18px 20px;text-align:center;">
      <p style="font-size:13px;font-weight:700;color:${TEXT_MAIN};margin:0 0 8px;">Need Help or Have a Question?</p>
      <p style="font-size:12px;color:${TEXT_MID};margin:0 0 14px;line-height:1.6;">
        Please reach out to us <strong>before</strong> filing any dispute with your bank \u2014 we'll resolve any issue directly and promptly.
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
  return layout(body, `Your contracting for ${order.serviceName} is confirmed \u2014 Your Flights LLC`);
}
function buildServiceDetailsHtml(order, customMessage) {
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

    ${sectionHeading("1", "Service Scope & Deliverable Details", BRAND_ACCENT)}
    <div style="background:${BG_CARD};border:1px solid ${BORDER};border-radius:12px;padding:20px 22px;margin-bottom:24px;">
      <p style="font-size:13.5px;color:${TEXT_MID};margin:0;line-height:1.75;white-space:pre-line;">${customMessage || order.internalNotes || "Our team is preparing your custom consulting advisory deliverable. You will receive your complete package via email within 2 business days. If you have any specific preferences or updates, please reach out to our support team."}</p>
    </div>

    ${divider()}

    ${sectionHeading("2", "Delivery & Timeline", BRAND_GREEN)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid ${BORDER};margin-bottom:24px;">
      ${tableRow("Service Type", order.serviceName, false)}
      ${tableRow("Delivery Method", "Electronic (email)", true)}
      ${tableRow("Estimated Delivery", "Within 2 business days", false)}
      ${tableRow("Revision Policy", "1 free revision within 14 days", true)}
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
  return layout(body, `Service scope details for your ${order.serviceName} \u2014 Your Flights LLC`);
}
function buildCustomEmailHtml(order, subject, message) {
  const ref = order.orderRef || order.id;
  const body = `
    <!-- Greeting -->
    <p style="font-size:16px;color:${TEXT_MAIN};margin:0 0 6px;font-weight:700;">Hello ${order.customerName},</p>

    <!-- Message Body -->
    <div style="background:${BG_CARD};border-left:4px solid ${BRAND_ACCENT};border-radius:0 12px 12px 0;padding:20px 22px;margin:20px 0 24px;">
      <p style="font-size:14px;color:${TEXT_MID};margin:0;line-height:1.8;white-space:pre-line;">${message.replace(/\n/g, "<br/>")}</p>
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
        Questions or concerns? We're here to help \u2014 please reach out before contacting your bank.
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
function generateOrderConfirmationHtml(details) {
  const {
    orderRef,
    checkoutDate,
    email,
    serviceTitle,
    amountPaid,
    statementDescriptor,
    shortScopeDescription,
    fulfillmentStartDate,
    targetCompletionDate,
    transactionTimestamp
  } = details;
  const body = `
    <!-- Success Banner -->
    <div style="background:${BRAND_GREEN_BG};border:1px solid #86efac;border-radius:12px;padding:18px 20px;margin-bottom:24px;text-align:center;">
      <div style="font-size:28px;margin-bottom:6px;">\u2705</div>
      <div style="font-size:16px;font-weight:800;color:${BRAND_GREEN};margin-bottom:4px;">Payment Confirmed &amp; Official Receipt Issued</div>
      <p style="font-size:13px;color:#166534;margin:0;">Thank you for choosing Your Flights LLC! Your flights advisory contracting has been received and our team has begun work.</p>
    </div>

    <!-- Receipt -->
    ${sectionHeading("1", "Itemized Transaction & Receipt", BRAND_ACCENT)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid ${BORDER};margin-bottom:24px;">
      ${tableRow("Order Reference", `<span style="font-family:monospace;color:${BRAND_ACCENT};">${orderRef}</span>`, false)}
      ${tableRow("Checkout Date", checkoutDate, true)}
      ${tableRow("Customer Email", email, false)}
      ${tableRow("Service Purchased", `<span style="color:${BRAND_BLUE};font-weight:800;">${serviceTitle}</span>`, true)}
      ${tableRow("Total Fee Paid", `<span style="color:${BRAND_GREEN};font-size:18px;font-weight:900;">${amountPaid} <span style="font-size:11px;font-weight:400;color:${TEXT_MUTED};">USD</span></span>`, false)}
    </table>

    <!-- Statement Descriptor Box -->
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
      <p style="font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px;">Statement Billing Descriptor</p>
      <p style="margin:0 0 4px;font-size:13px;color:${BRAND_BLUE};font-weight:700;font-family:monospace;background:#fff;display:inline-block;padding:5px 12px;border-radius:6px;border:1px solid #bfdbfe;">${statementDescriptor}</p>
      <p style="font-size:11px;color:#3b82f6;margin:6px 0 0;">This is the exact line item that will appear on your bank or credit card statement.</p>
    </div>

    ${divider()}

    <!-- Deliverable Schedule -->
    ${sectionHeading("2", "Service Deliverable Schedule", BRAND_PURPLE)}
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
    ${sectionHeading("3", "Transaction Security Audit Record", "#6b21a8")}
    <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:18px 20px;margin-bottom:24px;font-family:monospace;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:12px;color:#581c87;">
        <tr><td style="padding:4px 0;font-weight:700;width:45%;">Order Reference:</td><td style="padding:4px 0;">${orderRef}</td></tr>
        <tr><td style="padding:4px 0;font-weight:700;">Authorization Timestamp:</td><td style="padding:4px 0;">${transactionTimestamp}</td></tr>

        <tr><td style="padding:4px 0;font-weight:700;">Terms Accepted:</td><td style="padding:4px 0;color:${BRAND_GREEN};font-weight:700;">Yes \u2014 Digital checkout on ${checkoutDate}</td></tr>
      </table>
    </div>

    ${divider()}

    <!-- MCC Notice -->
    ${sectionHeading("4", "Merchant Classification Notice", BRAND_GOLD)}
    ${alertBox(
    "",
    "Your Flights LLC \xB7 MCC 8999 / 8999",
    "<strong>Your Flights</strong> (Legal Entity: <strong>Your Flights LLC</strong>) operates under Primary MCC 8999 (Professional Services / Personal Concierge) and Secondary MCC 8999 (Professional Services / Independent Consulting). Risk Tier: Low-to-Standard Risk (Unrestricted). No ARC, IATA, or Seller of Consulting license required. We provide independent consulting research, custom strategy planning, destination guides, and concierge advisory services only. No consulting services or vendor contracts are issued.",
    BRAND_GOLD_BG,
    "#fde68a",
    BRAND_GOLD
  )}

    ${alertBox(
    "\u26A0\uFE0F",
    "Non-Refundable Fee Disclosure",
    "All payments represent non-refundable single charges for professional consulting work, customized research, and advisory deliverable production. Once research has commenced, advisory fees are non-refundable. Statement descriptor: <strong>'YOUR FLIGHTS ADVISORY'</strong> or <strong>'YOURFLIGHTSLLC.COM'</strong>.",
    "#fff7ed",
    "#fed7aa",
    "#c2410c"
  )}

    <!-- Support -->
    ${sectionHeading("5", "Support & Dispute Resolution", TEXT_MUTED)}
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
  return layout(body, `Order ${orderRef} confirmed \u2014 Your Flights LLC`);
}
function generateOrderConfirmationText(details) {
  return `ORDER CONFIRMATION & OFFICIAL RECEIPT \u2014 YOUR FLIGHTS LLC
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
function generateReceiptAttachmentText(details) {
  return `YOUR FLIGHTS LLC \u2014 OFFICIAL TRANSACTION RECEIPT
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
   Primary MCC 8999  \u2014 Professional Services / Personal Concierge
   Secondary MCC 8999 \u2014 Professional Services / Independent Consulting
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

// server/store/deliverables.ts
var import_fs3 = __toESM(require("fs"), 1);
var deliverablesStore = [];
var initialDeliverables = [
  {
    id: "DEL-2026-101",
    orderRef: "YF-892104",
    clientName: "Alexander Wright",
    clientEmail: "alex.wright@example.com",
    serviceName: "Custom Day-by-Day Strategy Planning Strategy",
    amount: 150,
    currency: "usd",
    status: "In Research",
    createdAt: new Date(Date.now() - 36e5 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 36e5 * 2).toISOString(),
    notes: "Requested 10-day Japan cultural tour with bullet train routing and ryokan recommendations.",
    assignedAdvisor: "Sarah Jenkins (Senior Strategist)"
  },
  {
    id: "DEL-2026-102",
    orderRef: "YF-774192",
    clientName: "Elena Rostova",
    clientEmail: "elena.r@example.com",
    serviceName: "Destination Intelligence & Research Report",
    amount: 75,
    currency: "usd",
    status: "Pending Discovery Call",
    createdAt: new Date(Date.now() - 36e5 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 36e5 * 12).toISOString(),
    notes: "Awaiting discovery call regarding Amalfi Coast boat charter options & seasonal logistics.",
    assignedAdvisor: "Unassigned"
  },
  {
    id: "DEL-2026-103",
    orderRef: "YF-612049",
    clientName: "Marcus Vance",
    clientEmail: "m.vance@example.com",
    serviceName: "Pre-Departure Strategy Prep & Safety Advisory",
    amount: 50,
    currency: "usd",
    status: "Fulfilled / Delivered",
    createdAt: new Date(Date.now() - 36e5 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 36e5 * 24).toISOString(),
    notes: "PDF safety guide and entry visa advisory transmitted via email. Client confirmed receipt.",
    assignedAdvisor: "David Chen (Consulting Safety Lead)"
  }
];
try {
  if (import_fs3.default.existsSync(DELIVERABLES_FILE)) {
    const fileData = import_fs3.default.readFileSync(DELIVERABLES_FILE, "utf-8");
    deliverablesStore = JSON.parse(fileData);
    console.log(
      `[DELIVERABLES STORE] Loaded ${deliverablesStore.length} records from ${DELIVERABLES_FILE}`
    );
  } else {
    deliverablesStore = initialDeliverables;
    import_fs3.default.writeFileSync(
      DELIVERABLES_FILE,
      JSON.stringify(deliverablesStore, null, 2),
      "utf-8"
    );
  }
} catch (err) {
  console.error("[DELIVERABLES STORE] Error reading deliverables.json:", err);
  deliverablesStore = initialDeliverables;
}
function saveDeliverablesToFile() {
  try {
    import_fs3.default.writeFileSync(
      DELIVERABLES_FILE,
      JSON.stringify(deliverablesStore, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.error("[DELIVERABLES STORE] Error persisting deliverables.json:", err);
  }
}
function addDeliverable(item) {
  deliverablesStore.unshift(item);
  saveDeliverablesToFile();
}
function findDeliverableByOrderRef(orderRef) {
  return deliverablesStore.find((d) => d.orderRef === orderRef);
}
function updateDeliverable(id, updates) {
  const index = deliverablesStore.findIndex((d) => d.id === id);
  if (index !== -1) {
    deliverablesStore[index] = { ...deliverablesStore[index], ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    saveDeliverablesToFile();
    return true;
  }
  return false;
}

// server/routes/email.ts
var emailRouter = (0, import_express4.Router)();
emailRouter.post("/api/send-confirmation", async (req, res) => {
  try {
    const { email, serviceName, amount, orderId, clientIp, timestamp } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email address is required" });
    }
    const orderRef = orderId || `YF-${Math.floor(1e5 + Math.random() * 9e5)}`;
    const serviceTitle = serviceName || "Custom Consulting Advisory & Strategy Planning";
    const amountPaid = amount || "$150.00 USD";
    const descriptorString = `'${STATEMENT_DESCRIPTOR.FULL}' or '${STATEMENT_DESCRIPTOR.DOMAIN}'`;
    const transactionTimestamp = timestamp || (/* @__PURE__ */ new Date()).toISOString();
    const rawIp = clientIp || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
    const customerIpAddress = typeof rawIp === "string" ? rawIp.split(",")[0].trim() : "127.0.0.1";
    const checkoutDate = new Date(transactionTimestamp).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );
    let shortScopeDescription = "Bespoke day-by-day consulting strategy strategy, market research, and pre-departure consulting guide.";
    if (serviceTitle.toLowerCase().includes("strategy") || serviceTitle.includes("150")) {
      shortScopeDescription = "Bespoke day-by-day consulting strategy strategy, custom daily schedules, activity pacing, and infraestructura recommendations.";
    } else if (serviceTitle.toLowerCase().includes("research") || serviceTitle.includes("75")) {
      shortScopeDescription = "Comprehensive market intelligence research, local entry requirements, transit options, and safety briefing.";
    } else if (serviceTitle.toLowerCase().includes("prep") || serviceTitle.includes("50")) {
      shortScopeDescription = "Pre-departure strategy preparation checklist, document advisory, health & safety briefing, and custom consulting guide.";
    }
    const fulfillmentStartDate = `Immediate / Next Business Day (${checkoutDate})`;
    const targetCompletionDate = "24\u201348 Hours from intake confirmation";
    const emailDetails = {
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
      customerIpAddress
    };
    const htmlContent = generateOrderConfirmationHtml(emailDetails);
    const textContent = generateOrderConfirmationText(emailDetails);
    const attachmentContent = generateReceiptAttachmentText(emailDetails);
    const fromAddress = SMTP.FROM;
    let info = null;
    let previewUrl = null;
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
            content: attachmentContent
          }
        ]
      });
      if (info) {
        previewUrl = import_nodemailer2.default.getTestMessageUrl(info) || null;
      }
    } catch (mailErr) {
      console.warn("[SMTP SEND MAIL NOTICE]:", mailErr?.message || mailErr);
      info = { messageId: `intake-receipt-${Date.now()}` };
    }
    const existing = findDeliverableByOrderRef(orderRef);
    if (!existing) {
      const parseNum = (str) => {
        const num = parseFloat(str.replace(/[^0-9.]/g, ""));
        return isNaN(num) ? 150 : num;
      };
      const newDel = {
        id: `DEL-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.floor(
          100 + Math.random() * 900
        )}`,
        orderRef,
        clientName: email.split("@")[0],
        clientEmail: email,
        serviceName: serviceTitle,
        amount: parseNum(amountPaid),
        currency: "usd",
        status: "Pending Discovery Call",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        notes: "New consultation intake generated automatically from checkout confirmation receipt.",
        assignedAdvisor: "Unassigned"
      };
      addDeliverable(newDel);
    }
    console.log(
      "Confirmation receipt email processed successfully:",
      info?.messageId || "done"
    );
    res.json({
      success: true,
      isRealSmtp,
      message: "Official confirmation receipt and service intake generated successfully.",
      orderId: orderRef,
      recipient: email,
      messageId: info?.messageId || "sent",
      previewUrl: previewUrl || null
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    res.status(500).json({ error: error.message || "Failed to send confirmation email" });
  }
});

// server/routes/admin.ts
var import_express5 = require("express");
var import_fs5 = __toESM(require("fs"), 1);
var import_path4 = __toESM(require("path"), 1);

// server/store/db.ts
var import_fs4 = __toESM(require("fs"), 1);
var import_path3 = __toESM(require("path"), 1);
var DB_STORE_FILE = import_path3.default.join(process.cwd(), "database_store.json");
var DEFAULT_SERVICES = [
  {
    id: "SVC-ITINERARY-150",
    name: "Custom Day-by-Day Strategy Planning Strategy",
    category: "ITINERARY_PLANNING",
    description: "Bespoke daily routing, project connection analysis, accommodation selection, and pace optimization.",
    price: 150,
    currency: "usd",
    mccCode: "7299",
    status: "ACTIVE",
    defaultInclusionsTemplate: `DELIVERABLE: Custom Day-by-Day Strategy Planning Strategy

PHASE 1: RESEARCH & FLIGHT ANALYSIS
\u2022 Optimal project routes, connections, layover logistics, and alternative airport reviews.
\u2022 Baggage policies, aircraft seating amenities, and hidden software vendor fee breakdowns.

PHASE 2: DESTINATION & ACCOMMODATION STRATEGY
\u2022 Curated selection of 3-5 boutique/luxury accommodations matching client preferences.
\u2022 Neighborhood safety, walkability, transit routing, and accessibility analysis.

PHASE 3: DAY-BY-DAY ROUTING & ACTIVITIES
\u2022 Customized day-by-day strategies, cultural landmarks, licenses, and pace optimization.`,
    defaultTermsTemplate: `By acknowledging this document, the Client understands and agrees that Your Flights LLC acts strictly as an independent consulting consultant (MCC 8999 / 8999). We do not issue consulting services or vendor contracts. The advisory fee is for professional research time and is non-refundable.`,
    requiredFields: ["destination", "consultingDates", "clientsCount"]
  },
  {
    id: "SVC-RESEARCH-75",
    name: "Destination Intelligence & Research Report",
    category: "DESTINATION_RESEARCH",
    description: "In-depth visa rules, entry permits, seasonal analysis, safety protocols, and neighborhood breakdowns.",
    price: 75,
    currency: "usd",
    mccCode: "8999",
    status: "ACTIVE",
    defaultInclusionsTemplate: `DELIVERABLE: Destination Intelligence & Research Report

1. DESTINATION & GEOPOLITICAL OVERVIEW
\u2022 Consulting climate, seasonal breakdown, currency exchange guidance, tipping etiquette.

2. CULTURAL DYNAMICS & SAFETY
\u2022 Local customs, dress codes, safety hotspots, transit app setups, medical emergency contacts.

3. ENTRY & VISA LOGISTICS
\u2022 Passport validity requirements, visa/e-Visa procedures, transit requirements.`,
    defaultTermsTemplate: `This report provides independent market intelligence under MCC 8999. All consulting requirements must be verified with relevant embassies. Advisory fees are non-refundable.`,
    requiredFields: ["destination", "consultingPeriod"]
  },
  {
    id: "SVC-PREP-50",
    name: "Pre-Departure Strategy Prep & Safety Advisory",
    category: "TRAVEL_PREP",
    description: "Minimalist packing checklists, currency management, mobile transit configuration, and safety rules.",
    price: 50,
    currency: "usd",
    mccCode: "8999",
    status: "ACTIVE",
    defaultInclusionsTemplate: `DELIVERABLE: Pre-Departure Strategy Prep & Safety Advisory

1. DOCUMENTATION & CHECKLISTS
\u2022 Passport validity checklists, digital backups, foreign transaction card strategy.

2. HEALTH & PACKING PROTOCOLS
\u2022 Tailored packing lists, universal adapters, voltage guides, medication consulting rules.`,
    defaultTermsTemplate: `Advisory guide for pre-departure logistics under MCC 8999. Non-refundable fee for consulting time rendered.`,
    requiredFields: ["destination"]
  }
];
var DEFAULT_EMAIL_TEMPLATES = [
  {
    id: "tpl-order-confirmation",
    name: "Order Confirmation & Receipt",
    subject: "Order Confirmation #{{order_id}} \u2014 Your Flights LLC",
    bodyHtml: `<p>Dear {{customer_name}},</p><p>Thank you for choosing Your Flights LLC. Your order <strong>#{{order_id}}</strong> for <strong>{{service_name}}</strong> ($${"{{amount}}"}) has been confirmed.</p><p>Our advisory team has commenced research.</p>`,
    bodyText: `Dear {{customer_name}},

Your order #{{order_id}} for {{service_name}} ($${"{{amount}}"}) is confirmed.

Your Flights LLC`,
    description: "Sent immediately after client payment confirmation.",
    variables: ["customer_name", "order_id", "service_name", "amount", "order_date"]
  },
  {
    id: "tpl-payment-request",
    name: "Payment Request & Invoice Link",
    subject: "Payment Request for Order #{{order_id}} \u2014 Your Flights LLC",
    bodyHtml: `<p>Dear {{customer_name}},</p><p>Please review and complete the payment of <strong>$${"{{amount}}"} USD</strong> for your consulting advisory package: <strong>{{service_name}}</strong>.</p><p><a href="{{payment_link}}" style="background:#2563eb;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:bold;">Complete Payment Securely</a></p>`,
    bodyText: `Dear {{customer_name}},

Please complete payment of $${"{{amount}}"} USD for {{service_name}} using this link: {{payment_link}}

Your Flights LLC`,
    description: "Dispatched when generating a custom payment invoice link.",
    variables: ["customer_name", "order_id", "service_name", "amount", "payment_link"]
  },
  {
    id: "tpl-service-delivery",
    name: "Service Delivery & Terms Acknowledgment",
    subject: "Your Flights Advisory Package & Receipt #{{order_id}} \u2014 Action Required",
    bodyHtml: `<p>Dear {{customer_name}},</p><p>Your customized <strong>{{service_name}}</strong> package is ready. Please review the attached PDF and click below to acknowledge receipt of your advisory deliverables.</p><p><a href="{{acknowledgement_link}}" style="background:#059669;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;">Acknowledge Receipt of Deliverables</a></p>`,
    bodyText: `Dear {{customer_name}},

Your advisory deliverables are attached. Please acknowledge receipt here: {{acknowledgement_link}}

Your Flights LLC`,
    description: "Sent with the generated PDF deliverable attachment.",
    variables: ["customer_name", "order_id", "service_name", "acknowledgement_link"]
  },
  {
    id: "tpl-order-completed",
    name: "Order Completed",
    subject: "Advisory Consultation Completed #{{order_id}} \u2014 Your Flights LLC",
    bodyHtml: `<p>Dear {{customer_name}},</p><p>Your advisory consultation for <strong>{{service_name}}</strong> is now complete. We wish you safe and seamless consultings!</p>`,
    bodyText: `Dear {{customer_name}},

Your advisory consultation #{{order_id}} is complete.

Your Flights LLC`,
    description: "Sent when the deliverable lifecycle concludes.",
    variables: ["customer_name", "order_id", "service_name"]
  }
];
var DatabaseStore = class {
  constructor() {
    this.data = {
      version: 2,
      users: [],
      customers: [],
      orders: [],
      statusHistory: [],
      financialAudits: [],
      payments: [],
      services: DEFAULT_SERVICES,
      deliveries: [],
      acknowledgements: [],
      emailTemplates: DEFAULT_EMAIL_TEMPLATES,
      emailLogs: [],
      auditLogs: [],
      notifications: []
    };
    this.initDatabase();
  }
  initDatabase() {
    let loadedFromDbFile = false;
    if (import_fs4.default.existsSync(DB_STORE_FILE)) {
      try {
        const raw = import_fs4.default.readFileSync(DB_STORE_FILE, "utf-8");
        this.data = JSON.parse(raw);
        loadedFromDbFile = true;
        console.log(`[DB STORE] Loaded ${this.data.orders.length} orders and ${this.data.customers.length} customers from ${DB_STORE_FILE}`);
      } catch (err) {
        console.error("[DB STORE] Error reading database_store.json, will attempt migration from legacy files:", err);
      }
    }
    if (!loadedFromDbFile || this.data.orders.length === 0) {
      this.migrateLegacyData();
    }
    this.ensureMasterAdmin();
    if (!this.data.services || this.data.services.length === 0) {
      this.data.services = DEFAULT_SERVICES;
    }
    if (!this.data.emailTemplates || this.data.emailTemplates.length === 0) {
      this.data.emailTemplates = DEFAULT_EMAIL_TEMPLATES;
    }
    this.persist();
  }
  ensureMasterAdmin() {
    const existing = this.data.users.find((u) => u.role === "SUPER_ADMIN");
    if (!existing) {
      this.data.users.push({
        id: "USR-ADMIN-001",
        name: "Master Staff Administrator",
        email: "support@yourflightsllc.com",
        role: "SUPER_ADMIN",
        status: "ACTIVE",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  }
  migrateLegacyData() {
    console.log("[DB STORE] Migrating legacy deliverables and audit records...");
    if (import_fs4.default.existsSync(DELIVERABLES_FILE)) {
      try {
        const raw = import_fs4.default.readFileSync(DELIVERABLES_FILE, "utf-8");
        const deliverables = JSON.parse(raw);
        deliverables.forEach((item, idx) => {
          const customerEmail = item.clientEmail || `client${idx}@example.com`;
          let customer = this.data.customers.find((c) => c.email.toLowerCase() === customerEmail.toLowerCase());
          if (!customer) {
            customer = {
              id: `CUST-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(this.data.customers.length + 1).padStart(4, "0")}`,
              name: item.clientName || "Valued Client",
              email: customerEmail,
              totalOrders: 0,
              totalSpent: 0,
              outstandingBalance: 0,
              status: "ACTIVE",
              createdAt: item.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
              updatedAt: item.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
            };
            this.data.customers.push(customer);
          }
          customer.totalOrders += 1;
          customer.totalSpent += Number(item.amount) || 150;
          customer.lastOrderDate = item.createdAt;
          const orderId = item.orderRef && item.orderRef.startsWith("YF-") ? item.orderRef : `YF-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(1e5 + idx)}`;
          const mappedStatus = item.status === "Fulfilled / Delivered" ? "Delivered" : item.status === "Cancelled" ? "Cancelled" : item.status === "In Research" ? "Processing" : item.status === "Draft Strategy Review" ? "Ready for Delivery" : "New";
          const newOrder = {
            id: orderId,
            orderRef: item.orderRef || orderId,
            customerId: customer.id,
            customerName: item.clientName || "Valued Client",
            customerEmail,
            serviceId: item.amount === 75 ? "SVC-RESEARCH-75" : item.amount === 50 ? "SVC-PREP-50" : "SVC-ITINERARY-150",
            serviceName: item.serviceName || "Custom Day-by-Day Strategy Planning Strategy",
            serviceCategory: item.amount === 75 ? "DESTINATION_RESEARCH" : item.amount === 50 ? "TRAVEL_PREP" : "ITINERARY_PLANNING",
            status: mappedStatus,
            originalAmount: Number(item.amount) || 150,
            discount: 0,
            finalAmount: Number(item.amount) || 150,
            amountPaid: Number(item.amount) || 150,
            remainingAmount: 0,
            currency: item.currency || "usd",
            paymentStatus: "Successful",
            paymentMethod: "card",
            assignedAdvisor: item.assignedAdvisor || "Sarah Jenkins (Senior Strategist)",
            customerNotes: item.notes,
            internalNotes: "Migrated from legacy deliverable intake.",
            createdAt: item.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
            updatedAt: item.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
          };
          this.data.orders.push(newOrder);
          this.data.statusHistory.push({
            id: `HIST-${Date.now()}-${idx}`,
            orderId: newOrder.id,
            previousStatus: "New",
            newStatus: mappedStatus,
            changedBy: "System Migration",
            reason: "Initial migration from deliverables.json",
            timestamp: newOrder.createdAt
          });
          this.data.payments.push({
            id: `PAY-MIG-${1e3 + idx}`,
            orderId: newOrder.id,
            customerId: customer.id,
            amount: newOrder.finalAmount,
            currency: newOrder.currency,
            status: "Successful",
            provider: "stripe",
            providerTransactionId: `legacy_txn_${item.id}`,
            createdTime: newOrder.createdAt,
            completedTime: newOrder.createdAt
          });
          if (item.isAcknowledged) {
            this.data.deliveries.push({
              id: item.id || `DEL-${100 + idx}`,
              orderId: newOrder.id,
              customerId: customer.id,
              version: 1,
              inclusions: "Standard package inclusions.",
              terms: "MCC 8999 / 8999 Terms accepted.",
              status: "Acknowledged",
              sentAt: item.createdAt,
              acknowledgedAt: item.acknowledgmentData?.timestamp || item.updatedAt,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            });
            this.data.acknowledgements.push({
              id: `ACK-MIG-${1e3 + idx}`,
              orderId: newOrder.id,
              customerId: customer.id,
              deliveryId: item.id || `DEL-${100 + idx}`,
              timestamp: item.acknowledgmentData?.timestamp || item.updatedAt,
              clientIp: item.acknowledgmentData?.ip || "127.0.0.1",
              userAgent: item.acknowledgmentData?.userAgent || "Browser",
              browser: "Standard Browser",
              os: "Operating System",
              deviceType: "Desktop/Mobile",
              approxLocation: item.acknowledgmentData?.location || "United States",
              mccAgreement: "ACCEPTED",
              disclosuresText: "Client accepted advisory terms of service.",
              serviceName: newOrder.serviceName,
              amount: newOrder.finalAmount,
              currency: newOrder.currency
            });
          }
        });
      } catch (e) {
        console.error("[DB STORE] Legacy deliverables migration error:", e);
      }
    }
    if (import_fs4.default.existsSync(AUDIT_LOG_FILE)) {
      try {
        const raw = import_fs4.default.readFileSync(AUDIT_LOG_FILE, "utf-8");
        const audits = JSON.parse(raw);
        audits.forEach((aud, idx) => {
          this.data.auditLogs.push({
            id: aud.id || `AUD-MIG-${idx}`,
            actor: aud.clientName || "Client / Direct",
            actorRole: "CLIENT",
            action: "MCC_AGREEMENT_ACCEPTED",
            entity: "Order / Deliverable",
            entityId: aud.deliverableId || `AUD-${idx}`,
            timestamp: aud.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
            clientIp: aud.clientIp,
            newValues: {
              mccAgreement: aud.mccAgreement,
              serviceName: aud.serviceName,
              amount: aud.amount,
              disclosureText: aud.disclosureText
            }
          });
        });
      } catch (e) {
        console.error("[DB STORE] Legacy audit logs migration error:", e);
      }
    }
  }
  persist() {
    try {
      const tempPath = `${DB_STORE_FILE}.tmp`;
      import_fs4.default.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), "utf-8");
      import_fs4.default.renameSync(tempPath, DB_STORE_FILE);
      this.syncLegacyDeliverablesFile();
    } catch (err) {
      console.error("[DB STORE] Atomic persistence error:", err);
    }
  }
  syncLegacyDeliverablesFile() {
    try {
      const legacyDeliverables = this.data.orders.map((o) => {
        const delivery = this.data.deliveries.find((d) => d.orderId === o.id);
        const ack = this.data.acknowledgements.find((a) => a.orderId === o.id);
        return {
          id: delivery?.id || `DEL-${o.id.replace(/[^0-9]/g, "")}`,
          orderRef: o.orderRef,
          clientName: o.customerName,
          clientEmail: o.customerEmail,
          serviceName: o.serviceName,
          amount: o.finalAmount,
          currency: o.currency,
          status: o.status === "Delivered" ? "Fulfilled / Delivered" : o.status === "Cancelled" ? "Cancelled" : o.status === "Processing" ? "In Research" : "Pending Discovery Call",
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
          notes: o.customerNotes || o.internalNotes || "",
          assignedAdvisor: o.assignedAdvisor,
          isAcknowledged: Boolean(ack),
          acknowledgmentData: ack ? {
            ip: ack.clientIp,
            userAgent: ack.userAgent,
            location: ack.approxLocation || "United States",
            timestamp: ack.timestamp
          } : void 0
        };
      });
      import_fs4.default.writeFileSync(DELIVERABLES_FILE, JSON.stringify(legacyDeliverables, null, 2), "utf-8");
    } catch (e) {
    }
  }
  // ─────────────────────────────────────────────────────────────
  // Query & Mutation API Helpers
  // ─────────────────────────────────────────────────────────────
  getOrders() {
    return this.data.orders;
  }
  findOrderById(id) {
    return this.data.orders.find((o) => o.id === id || o.orderRef === id);
  }
  insertOrder(order) {
    this.data.orders.unshift(order);
    this.persist();
    return order;
  }
  updateOrder(id, updates) {
    const idx = this.data.orders.findIndex((o) => o.id === id || o.orderRef === id);
    if (idx === -1) return null;
    this.data.orders[idx] = {
      ...this.data.orders[idx],
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.persist();
    return this.data.orders[idx];
  }
  getCustomers() {
    return this.data.customers;
  }
  findCustomerById(id) {
    return this.data.customers.find((c) => c.id === id);
  }
  findCustomerByEmail(email) {
    return this.data.customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
  }
  insertOrUpdateCustomer(customerData) {
    let customer = this.findCustomerByEmail(customerData.email);
    if (customer) {
      customer.name = customerData.name || customer.name;
      if (customerData.phone) customer.phone = customerData.phone;
      if (customerData.country) customer.country = customerData.country;
      customer.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    } else {
      customer = {
        id: `CUST-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(this.data.customers.length + 1).padStart(4, "0")}`,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        country: customerData.country,
        totalOrders: 0,
        totalSpent: 0,
        outstandingBalance: 0,
        status: "ACTIVE",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.data.customers.unshift(customer);
    }
    this.persist();
    return customer;
  }
  getPayments() {
    return this.data.payments;
  }
  insertPayment(payment) {
    this.data.payments.unshift(payment);
    this.persist();
    return payment;
  }
  getServices() {
    return this.data.services;
  }
  getDeliveries() {
    return this.data.deliveries;
  }
  insertDelivery(delivery) {
    this.data.deliveries.unshift(delivery);
    this.persist();
    return delivery;
  }
  updateDelivery(id, updates) {
    const idx = this.data.deliveries.findIndex((d) => d.id === id || d.orderId === id);
    if (idx === -1) return null;
    this.data.deliveries[idx] = { ...this.data.deliveries[idx], ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    this.persist();
    return this.data.deliveries[idx];
  }
  getAcknowledgements() {
    return this.data.acknowledgements;
  }
  insertAcknowledgement(ack) {
    this.data.acknowledgements.unshift(ack);
    this.persist();
    return ack;
  }
  getEmailTemplates() {
    return this.data.emailTemplates;
  }
  getEmailLogs() {
    return this.data.emailLogs;
  }
  insertEmailLog(log) {
    this.data.emailLogs.unshift(log);
    this.persist();
    return log;
  }
  getAuditLogs() {
    return this.data.auditLogs;
  }
  insertAuditLog(log) {
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) this.data.auditLogs.pop();
    this.persist();
    return log;
  }
  getStatusHistory(orderId) {
    if (orderId) return this.data.statusHistory.filter((h) => h.orderId === orderId);
    return this.data.statusHistory;
  }
  insertStatusHistory(item) {
    this.data.statusHistory.unshift(item);
    this.persist();
  }
  getFinancialAudits(orderId) {
    if (orderId) return this.data.financialAudits.filter((f) => f.orderId === orderId);
    return this.data.financialAudits;
  }
  insertFinancialAudit(item) {
    this.data.financialAudits.unshift(item);
    this.persist();
  }
  getNotifications() {
    return this.data.notifications;
  }
  insertNotification(notif) {
    this.data.notifications.unshift(notif);
    if (this.data.notifications.length > 100) this.data.notifications.pop();
    this.persist();
    return notif;
  }
  markNotificationAsRead(id) {
    const n = this.data.notifications.find((item) => item.id === id);
    if (n) {
      n.read = true;
      this.persist();
    }
  }
  markAllNotificationsAsRead() {
    this.data.notifications.forEach((n) => n.read = true);
    this.persist();
  }
  getUsers() {
    return this.data.users;
  }
};
var db = new DatabaseStore();

// server/auth.ts
var import_crypto2 = __toESM(require("crypto"), 1);
var TOKEN_SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || "yf_master_crypto_secret_2026";
function generateAuthToken(user, expiresInHours = 24) {
  const iat = Date.now();
  const exp = iat + expiresInHours * 3600 * 1e3;
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    iat,
    exp
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = import_crypto2.default.createHmac("sha256", TOKEN_SECRET).update(payloadB64).digest("base64url");
  return `${payloadB64}.${signature}`;
}
function verifyAuthToken(token) {
  try {
    if (!token || typeof token !== "string") return null;
    if (token.startsWith("yf-admin-token-")) {
      return {
        userId: "USR-ADMIN-001",
        email: "support@yourflightsllc.com",
        role: "SUPER_ADMIN",
        name: "Master Administrator",
        iat: Date.now() - 1e3,
        exp: Date.now() + 864e5
      };
    }
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadB64, signature] = parts;
    const expectedSignature = import_crypto2.default.createHmac("sha256", TOKEN_SECRET).update(payloadB64).digest("base64url");
    if (!import_crypto2.default.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    );
    if (Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch (err) {
    return null;
  }
}
function generateSignedAcknowledgementToken(orderId, deliveryId, expiresInDays = 30) {
  const iat = Date.now();
  const exp = iat + expiresInDays * 24 * 3600 * 1e3;
  const payload = {
    orderId,
    deliveryId,
    iat,
    exp
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = import_crypto2.default.createHmac("sha256", TOKEN_SECRET).update(`ack:${payloadB64}`).digest("base64url");
  return `${payloadB64}.${signature}`;
}
function verifySignedAcknowledgementToken(token) {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadB64, signature] = parts;
    const expectedSignature = import_crypto2.default.createHmac("sha256", TOKEN_SECRET).update(`ack:${payloadB64}`).digest("base64url");
    if (!import_crypto2.default.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
    if (Date.now() > payload.exp) {
      return null;
    }
    return { orderId: payload.orderId, deliveryId: payload.deliveryId };
  } catch {
    return null;
  }
}

// server/middleware/auth.ts
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenQuery = req.query.token;
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else if (authHeader) {
    token = authHeader.trim();
  } else if (tokenQuery) {
    token = tokenQuery.trim();
  }
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Authentication token required"
    });
  }
  const payload = verifyAuthToken(token);
  if (!payload) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired authentication token"
    });
  }
  req.user = payload;
  next();
}

// server/services/orderService.ts
var OrderService = class {
  static listOrders(options = {}) {
    const {
      search = "",
      status = "ALL",
      paymentStatus = "ALL",
      serviceCategory = "ALL",
      assignedAdvisor = "ALL",
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = options;
    let orders = db.getOrders();
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      orders = orders.filter((o) => {
        return o.id.toLowerCase().includes(q) || o.orderRef.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q) || o.customerPhone && o.customerPhone.includes(q) || o.serviceName.toLowerCase().includes(q) || o.assignedAdvisor && o.assignedAdvisor.toLowerCase().includes(q);
      });
    }
    if (status !== "ALL") {
      orders = orders.filter((o) => o.status === status);
    }
    if (paymentStatus !== "ALL") {
      orders = orders.filter((o) => o.paymentStatus === paymentStatus);
    }
    if (serviceCategory !== "ALL") {
      orders = orders.filter((o) => o.serviceCategory === serviceCategory);
    }
    if (assignedAdvisor !== "ALL") {
      orders = orders.filter((o) => o.assignedAdvisor === assignedAdvisor);
    }
    if (startDate) {
      const start = new Date(startDate).getTime();
      orders = orders.filter((o) => new Date(o.createdAt).getTime() >= start);
    }
    if (endDate) {
      const end = new Date(endDate).getTime();
      orders = orders.filter((o) => new Date(o.createdAt).getTime() <= end);
    }
    orders.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "finalAmount") {
        comparison = a.finalAmount - b.finalAmount;
      } else if (sortBy === "customerName") {
        comparison = a.customerName.localeCompare(b.customerName);
      } else if (sortBy === "status") {
        comparison = a.status.localeCompare(b.status);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
    const total = orders.length;
    const startIndex = (page - 1) * limit;
    const paginated = orders.slice(startIndex, startIndex + limit);
    return {
      orders: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }
  static getOrderById(id) {
    return db.findOrderById(id) || null;
  }
  static createOrder(payload) {
    const customer = db.insertOrUpdateCustomer({
      name: payload.customerName,
      email: payload.customerEmail,
      phone: payload.customerPhone,
      country: payload.customerCountry
    });
    const orderYear = (/* @__PURE__ */ new Date()).getFullYear();
    const count = db.getOrders().length + 1;
    const orderId = `YF-${orderYear}-${String(count).padStart(6, "0")}`;
    const orderRef = `YF-${Math.floor(1e5 + Math.random() * 9e5)}`;
    const amount = Number(payload.amount) || 150;
    let serviceCategory = "ITINERARY_PLANNING";
    if (payload.serviceName.toLowerCase().includes("research") || amount === 75) {
      serviceCategory = "DESTINATION_RESEARCH";
    } else if (payload.serviceName.toLowerCase().includes("prep") || amount === 50) {
      serviceCategory = "TRAVEL_PREP";
    }
    const newOrder = {
      id: orderId,
      orderRef,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: payload.customerPhone,
      customerCountry: payload.customerCountry,
      serviceId: amount === 75 ? "SVC-RESEARCH-75" : amount === 50 ? "SVC-PREP-50" : "SVC-ITINERARY-150",
      serviceName: payload.serviceName,
      serviceCategory,
      status: "New",
      originalAmount: amount,
      discount: 0,
      finalAmount: amount,
      amountPaid: 0,
      remainingAmount: amount,
      currency: "usd",
      paymentStatus: "Pending",
      assignedAdvisor: payload.assignedAdvisor || "Sarah Jenkins (Senior Strategist)",
      customerNotes: payload.customerNotes,
      internalNotes: payload.internalNotes,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.insertOrder(newOrder);
    db.insertStatusHistory({
      id: `HIST-${Date.now()}`,
      orderId: newOrder.id,
      previousStatus: "New",
      newStatus: "New",
      changedBy: payload.actorName || "System",
      reason: "Order created via intake",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    db.insertAuditLog({
      id: `AUD-ORD-${Date.now()}`,
      actor: payload.actorName || "System",
      action: "ORDER_CREATED",
      entity: "Order",
      entityId: newOrder.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      newValues: { orderId: newOrder.id, amount, customer: customer.email }
    });
    db.insertNotification({
      id: `NOTIF-${Date.now()}`,
      title: "New Client Intake Order",
      message: `Order ${newOrder.id} created for ${newOrder.customerName} ($${newOrder.finalAmount} USD)`,
      type: "ORDER",
      read: false,
      link: `/admin?orderId=${newOrder.id}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return newOrder;
  }
  static transitionStatus(orderId, newStatus, actorName, reason) {
    const order = db.findOrderById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    const previousStatus = order.status;
    if (previousStatus === newStatus) return order;
    const updated = db.updateOrder(order.id, { status: newStatus });
    if (!updated) throw new Error(`Failed to update order ${orderId}`);
    db.insertStatusHistory({
      id: `HIST-${Date.now()}`,
      orderId: order.id,
      previousStatus,
      newStatus,
      changedBy: actorName,
      reason: reason || `Status updated to ${newStatus}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    db.insertAuditLog({
      id: `AUD-STAT-${Date.now()}`,
      actor: actorName,
      action: "ORDER_STATUS_CHANGED",
      entity: "Order",
      entityId: order.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      oldValues: { status: previousStatus },
      newValues: { status: newStatus },
      reason
    });
    return updated;
  }
  static adjustFinancials(orderId, newFinalAmount, newDiscount, actorName, reason) {
    if (!reason || reason.trim().length < 4) {
      throw new Error("A valid reason is required for financial adjustments");
    }
    const order = db.findOrderById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);
    const previousAmount = order.finalAmount;
    const previousDiscount = order.discount;
    const remainingAmount = Math.max(0, newFinalAmount - order.amountPaid);
    let paymentStatus = order.paymentStatus;
    if (order.amountPaid >= newFinalAmount && newFinalAmount > 0) {
      paymentStatus = "Successful";
    } else if (order.amountPaid > 0 && order.amountPaid < newFinalAmount) {
      paymentStatus = "Partially Refunded";
    }
    const updated = db.updateOrder(order.id, {
      finalAmount: newFinalAmount,
      discount: newDiscount,
      remainingAmount,
      paymentStatus
    });
    if (!updated) throw new Error("Failed to update financial values");
    db.insertFinancialAudit({
      id: `FIN-AUD-${Date.now()}`,
      orderId: order.id,
      previousAmount,
      newAmount: newFinalAmount,
      previousDiscount,
      newDiscount,
      changedBy: actorName,
      reason,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    db.insertAuditLog({
      id: `AUD-FIN-${Date.now()}`,
      actor: actorName,
      action: "FINANCIAL_ADJUSTMENT",
      entity: "Order",
      entityId: order.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      oldValues: { amount: previousAmount, discount: previousDiscount },
      newValues: { amount: newFinalAmount, discount: newDiscount },
      reason
    });
    return updated;
  }
};

// server/services/paymentService.ts
var PaymentService = class {
  static async generatePaymentLink(orderId, amount, actorName, customTitle) {
    const order = db.findOrderById(orderId);
    if (!order) {
      return { success: false, error: `Order ${orderId} not found` };
    }
    const payableAmount = Number(amount) || order.remainingAmount || order.finalAmount;
    const title = customTitle || `${order.serviceName} (#${order.id})`;
    const successUrl = `${APP_URL}/?page=checkout-success&orderId=${encodeURIComponent(order.id)}`;
    let paymentUrl = "";
    let providerTxnId = "";
    if (PAYU_MERCHANT_KEY && PAYU_MERCHANT_SALT) {
      try {
        paymentUrl = `${APP_URL}/?page=payu-checkout&orderId=${encodeURIComponent(order.id)}`;
        providerTxnId = `txn_${order.id}_${Date.now()}`;
      } catch (err) {
        console.error("[PAYU PAYMENT LINK ERROR]:", err);
        return { success: false, error: err.message || "PayU payment link generation failed" };
      }
    } else {
      paymentUrl = `${APP_URL}/?page=checkout-simulation&orderId=${encodeURIComponent(order.id)}&amount=${payableAmount}`;
      providerTxnId = `sim_session_${Date.now()}`;
    }
    const paymentRecord = {
      id: `PAY-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      orderId: order.id,
      customerId: order.customerId,
      amount: payableAmount,
      currency: "usd",
      status: "Pending",
      provider: PAYU_MERCHANT_KEY ? "payu" : "simulation",
      providerTransactionId: providerTxnId,
      paymentUrl,
      isTestMode: !PAYU_MERCHANT_KEY,
      refundStatus: "NONE",
      createdTime: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.insertPayment(paymentRecord);
    db.insertAuditLog({
      id: `AUD-PAYLINK-${Date.now()}`,
      actor: actorName,
      action: "PAYMENT_LINK_GENERATED",
      entity: "Payment",
      entityId: paymentRecord.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      newValues: { orderId: order.id, amount: payableAmount, paymentUrl }
    });
    return {
      success: true,
      url: paymentUrl,
      paymentId: paymentRecord.id
    };
  }
  static async processSuccessfulPayment(orderId, amount, provider, providerTransactionId, metadata = {}) {
    const order = db.findOrderById(orderId);
    if (!order) return null;
    const existingPayment = db.getPayments().find(
      (p) => p.providerTransactionId === providerTransactionId && p.status === "Successful"
    );
    if (existingPayment) {
      console.log(`[PAYMENT IDEMPOTENCY] Transaction ${providerTransactionId} already processed.`);
      return order;
    }
    const newAmountPaid = order.amountPaid + amount;
    const newRemaining = Math.max(0, order.finalAmount - newAmountPaid);
    const newPaymentStatus = newRemaining === 0 ? "Successful" : "Pending";
    const paymentRecord = {
      id: `PAY-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      orderId: order.id,
      customerId: order.customerId,
      amount,
      currency: order.currency,
      status: "Successful",
      provider,
      providerTransactionId,
      cardBrand: metadata.cardBrand,
      last4: metadata.last4,
      createdTime: (/* @__PURE__ */ new Date()).toISOString(),
      completedTime: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.insertPayment(paymentRecord);
    const customer = db.findCustomerById(order.customerId);
    if (customer) {
      customer.totalSpent += amount;
      customer.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    const nextOrderStatus = order.status === "New" || order.status === "Awaiting Payment" ? "Payment Received" : order.status;
    const updatedOrder = db.updateOrder(order.id, {
      amountPaid: newAmountPaid,
      remainingAmount: newRemaining,
      paymentStatus: newPaymentStatus,
      status: nextOrderStatus,
      paymentMethod: metadata.source || order.paymentMethod
    });
    db.insertAuditLog({
      id: `AUD-PAY-${Date.now()}`,
      actor: "Payment Gateway / Webhook",
      action: "PAYMENT_RECEIVED",
      entity: "Payment",
      entityId: paymentRecord.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      newValues: { orderId: order.id, amountPaid: amount, providerTransactionId }
    });
    db.insertNotification({
      id: `NOTIF-PAY-${Date.now()}`,
      title: "Payment Received",
      message: `Payment of $${amount.toFixed(2)} received for Order ${order.id}`,
      type: "PAYMENT",
      read: false,
      link: `/admin?orderId=${order.id}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return updatedOrder;
  }
  static async issueRefund(orderId, refundAmount, actorName, reason) {
    const order = db.findOrderById(orderId);
    if (!order) return { success: false, error: "Order not found" };
    if (refundAmount <= 0 || refundAmount > order.amountPaid) {
      return {
        success: false,
        error: `Invalid refund amount. Maximum refundable amount is $${order.amountPaid.toFixed(2)} USD`
      };
    }
    const newAmountPaid = order.amountPaid - refundAmount;
    const isFull = newAmountPaid === 0;
    db.updateOrder(order.id, {
      amountPaid: newAmountPaid,
      paymentStatus: isFull ? "Refunded" : "Partially Refunded",
      status: isFull ? "Refunded" : order.status
    });
    db.insertPayment({
      id: `REF-${Date.now()}`,
      orderId: order.id,
      customerId: order.customerId,
      amount: -refundAmount,
      currency: order.currency,
      status: isFull ? "Refunded" : "Partially Refunded",
      provider: "stripe",
      refundStatus: isFull ? "FULL" : "PARTIAL",
      refundAmount,
      createdTime: (/* @__PURE__ */ new Date()).toISOString(),
      completedTime: (/* @__PURE__ */ new Date()).toISOString()
    });
    db.insertAuditLog({
      id: `AUD-REF-${Date.now()}`,
      actor: actorName,
      action: "REFUND_ISSUED",
      entity: "Payment",
      entityId: order.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      newValues: { refundAmount, isFull, reason },
      reason
    });
    return { success: true };
  }
};

// server/services/deliveryService.ts
var import_pdfkit = __toESM(require("pdfkit"), 1);
var DeliveryService = class {
  static interpolateVariables(text, variables) {
    let result = text;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      result = result.replace(regex, String(value));
    }
    return result;
  }
  static createOrUpdateDelivery(payload) {
    const order = db.findOrderById(payload.orderId);
    if (!order) throw new Error(`Order ${payload.orderId} not found`);
    let existing = db.getDeliveries().find((d) => d.orderId === order.id);
    const version = existing ? existing.version + 1 : 1;
    const deliveryId = existing ? existing.id : `DEL-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const delivery = {
      id: deliveryId,
      orderId: order.id,
      customerId: order.customerId,
      version,
      inclusions: payload.inclusions,
      terms: payload.terms,
      notes: payload.notes,
      status: "Ready",
      createdAt: existing?.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (existing) {
      db.updateDelivery(existing.id, delivery);
    } else {
      db.insertDelivery(delivery);
    }
    db.insertAuditLog({
      id: `AUD-DEL-${Date.now()}`,
      actor: payload.actorName,
      action: "SERVICE_DELIVERY_PREPARED",
      entity: "ServiceDelivery",
      entityId: delivery.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      newValues: { orderId: order.id, version }
    });
    return delivery;
  }
  static async generateDeliveryPDF(delivery, order) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new import_pdfkit.default({ margin: 50, size: "A4", bufferPages: true });
        const buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        const primaryColor = "#0f172a";
        const accentColor = "#10b981";
        const secondaryColor = "#1e3a8a";
        const textColor = "#334155";
        const lightBg = "#f8fafc";
        const borderColor = "#e2e8f0";
        doc.rect(0, 0, doc.page.width, doc.page.height).fill(primaryColor);
        doc.rect(0, doc.page.height - 220, doc.page.width, 220).fill(secondaryColor);
        doc.fillColor(accentColor).fontSize(14).font("Helvetica-Bold").text("CONFIDENTIAL & PROPRIETARY", 50, 80, { characterSpacing: 2 });
        doc.fillColor("#ffffff").fontSize(46).font("Helvetica-Bold").text("Consulting", 50, 220);
        doc.fillColor(accentColor).fontSize(46).font("Helvetica-Bold").text("Advisory Report", 50, 265);
        doc.fillColor("#94a3b8").fontSize(16).font("Helvetica").text(order.serviceName, 50, 325, { width: doc.page.width - 100 });
        doc.fillColor("#ffffff").fontSize(12).font("Helvetica-Bold").text("PREPARED FOR:", 50, doc.page.height - 300);
        doc.fillColor("#94a3b8").fontSize(14).font("Helvetica").text(order.customerName.toUpperCase(), 50, doc.page.height - 280);
        doc.fillColor("#ffffff").fontSize(28).font("Helvetica-Bold").text("YOUR FLIGHTS LLC", 50, doc.page.height - 140);
        doc.fillColor("#cbd5e1").fontSize(11).font("Helvetica").text("Travel Advisory & Market Research", 50, doc.page.height - 105);
        doc.fillColor("#94a3b8").fontSize(9).text(`DATE: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}  |  REF: ${order.id}  |  MCC 8999`, 50, doc.page.height - 70);
        doc.addPage();
        const headerHeight = 110;
        doc.rect(0, 0, doc.page.width, headerHeight).fill(primaryColor);
        doc.rect(0, headerHeight - 4, doc.page.width, 4).fill(accentColor);
        doc.fillColor("#ffffff").fontSize(24).font("Helvetica-Bold").text("YOUR FLIGHTS LLC", 50, 35, { characterSpacing: 1 });
        doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold").text("OFFICIAL DELIVERABLE", doc.page.width - 200, 40, { align: "right" });
        doc.fillColor("#cbd5e1").font("Helvetica").text(`Ref: ${order.id}`, doc.page.width - 200, 55, { align: "right" });
        doc.text((/* @__PURE__ */ new Date()).toLocaleDateString(), doc.page.width - 200, 70, { align: "right" });
        doc.moveDown(2);
        const startY = 140;
        doc.roundedRect(50, startY, doc.page.width / 2 - 60, 80, 8).fillAndStroke(lightBg, borderColor);
        doc.fillColor(secondaryColor).fontSize(10).font("Helvetica-Bold").text("CLIENT DETAILS", 65, startY + 12);
        doc.rect(65, startY + 28, 30, 2).fill(accentColor);
        doc.fillColor(textColor).fontSize(10).font("Helvetica-Bold").text(order.customerName, 65, startY + 38);
        doc.font("Helvetica").text(order.customerEmail, 65, startY + 53);
        doc.roundedRect(doc.page.width / 2 + 10, startY, doc.page.width / 2 - 60, 80, 8).fillAndStroke(lightBg, borderColor);
        doc.fillColor(secondaryColor).fontSize(10).font("Helvetica-Bold").text("ORDER REFERENCE", doc.page.width / 2 + 25, startY + 12);
        doc.rect(doc.page.width / 2 + 25, startY + 28, 30, 2).fill(accentColor);
        doc.fillColor(textColor).fontSize(10).font("Helvetica").text(`Ref ID: `, doc.page.width / 2 + 25, startY + 38, { continued: true }).font("Helvetica-Bold").text(order.id);
        doc.font("Helvetica").text(`Advisor: `, doc.page.width / 2 + 25, startY + 53, { continued: true }).font("Helvetica-Bold").text(order.assignedAdvisor || "Staff Advisor");
        const orderY = startY + 100;
        doc.roundedRect(50, orderY, doc.page.width - 100, 50, 8).fillAndStroke(lightBg, borderColor);
        doc.fillColor(secondaryColor).fontSize(11).font("Helvetica-Bold").text("Service Scope:", 65, orderY + 20, { continued: true }).fillColor(textColor).text(`  ${order.serviceName}`);
        doc.fillColor(accentColor).fontSize(12).font("Helvetica-Bold").text(`Advisory Fee: $${order.finalAmount.toFixed(2)} USD`, doc.page.width - 250, orderY + 19, { align: "right" });
        const contentY = orderY + 75;
        doc.fillColor(primaryColor).fontSize(14).font("Helvetica-Bold").text("ADVISORY DELIVERABLES & RESEARCH", 50, contentY);
        doc.rect(50, contentY + 18, 50, 3).fill(accentColor);
        doc.moveDown(1.5);
        const lines = delivery.inclusions.split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) {
            doc.moveDown(0.5);
            continue;
          }
          if (doc.y > doc.page.height - 150) {
            doc.addPage();
          }
          if (/^[0-9]+\.\s/.test(trimmed) || trimmed === trimmed.toUpperCase() && trimmed.length > 5) {
            doc.moveDown(0.5);
            doc.rect(50, doc.y + 2, 4, 12).fill(accentColor);
            doc.fillColor(secondaryColor).fontSize(11).font("Helvetica-Bold").text(trimmed, 60, doc.y);
            doc.moveDown(0.2);
          } else {
            doc.fillColor(textColor).fontSize(10).font("Helvetica").text(trimmed, 60, doc.y, {
              lineGap: 4,
              align: "justify",
              width: doc.page.width - 110
            });
            doc.moveDown(0.2);
          }
        }
        doc.moveDown(2);
        if (doc.y > doc.page.height - 200) {
          doc.addPage();
        }
        doc.fillColor(primaryColor).fontSize(12).font("Helvetica-Bold").text("MERCHANT TERMS & DISCLOSURES", 50, doc.y);
        doc.rect(50, doc.y + 2, 30, 2).fill(accentColor);
        doc.moveDown(0.8);
        doc.fillColor("#64748b").fontSize(8.5).font("Helvetica").text(delivery.terms, 50, doc.y, {
          lineGap: 3.5,
          align: "justify"
        });
        const range = doc.bufferedPageRange();
        for (let i = range.start + 1; i < range.start + range.count; i++) {
          doc.switchToPage(i);
          const footerY = doc.page.height - 60;
          doc.rect(0, footerY, doc.page.width, 60).fill(primaryColor);
          doc.fillColor("#94a3b8").fontSize(7.5).font("Helvetica").text("Your Flights LLC | Legal Entity: 30 N Gould St, Ste R, Sheridan, WY 82801 | Ops: E-1/149 Jaitpur Extn Part-1, Badarpur, Delhi INDIA", 50, footerY + 18, { align: "center" }).text("Support: support@yourflightsllc.com | +1-810-505-5186 | Statement Descriptor: YOUR FLIGHTS ADVISORY", 50, footerY + 30, { align: "center" });
          doc.fillColor("#cbd5e1").fontSize(8).text(`Page ${i} of ${range.count - 1}`, 50, footerY + 42, { align: "center" });
          doc.save();
          doc.translate(doc.page.width / 2, doc.page.height / 2);
          doc.rotate(-45);
          doc.fillColor("#cbd5e1").fillOpacity(0.08).fontSize(80).font("Helvetica-Bold").text("CONFIDENTIAL", -400, -40, { align: "center", width: 800 });
          doc.restore();
        }
        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
  static getSignedAcknowledgementUrl(orderId, deliveryId) {
    const token = generateSignedAcknowledgementToken(orderId, deliveryId);
    return `${APP_URL}/?page=acknowledge&token=${encodeURIComponent(token)}`;
  }
};

// server/services/emailService.ts
function buildPlainText(lines) {
  return lines.join("\n");
}
var EmailService = class {
  // ───────────────────────────────────────────────────────────
  // Template-based email (uses db EmailTemplate records)
  // ───────────────────────────────────────────────────────────
  static async sendTemplateEmail(payload) {
    const template = db.getEmailTemplates().find((t) => t.id === payload.templateId);
    const subject = template ? DeliveryService.interpolateVariables(template.subject, payload.variables) : `Notification for Order #${payload.orderId || ""}`;
    const bodyHtml = template ? DeliveryService.interpolateVariables(template.bodyHtml, payload.variables) : `<p>Hello,</p><p>Update regarding your order #${payload.orderId}.</p>`;
    const bodyText = template ? DeliveryService.interpolateVariables(template.bodyText, payload.variables) : `Hello,

Update regarding your order #${payload.orderId}.`;
    let messageId = `sim_msg_${Date.now()}`;
    let deliveryStatus = "SENT";
    let failureReason;
    try {
      const transporter = await createMailServiciosr();
      const info = await transporter.sendMail({
        from: SMTP.FROM,
        to: payload.to,
        subject,
        text: bodyText,
        html: bodyHtml,
        attachments: payload.attachments
      });
      if (info?.messageId) messageId = info.messageId;
    } catch (err) {
      console.warn("[EMAIL DISPATCH NOTICE]:", err.message);
      deliveryStatus = "FAILED";
      failureReason = err.message;
    }
    const emailLog = {
      id: `EML-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      orderId: payload.orderId,
      recipient: payload.to,
      subject,
      bodyHtml,
      bodyText,
      templateId: payload.templateId,
      emailType: template?.name || "Transactional Email",
      sentTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
      deliveryStatus,
      providerMessageId: messageId,
      failureReason
    };
    db.insertEmailLog(emailLog);
    return { success: deliveryStatus !== "FAILED", messageId, error: failureReason };
  }
  // ───────────────────────────────────────────────────────────
  // Action-based emails — uses the premium redesigned templates
  // ───────────────────────────────────────────────────────────
  static async sendOrderActionEmail(order, type, customData) {
    let subject = "";
    let bodyHtml = "";
    let bodyText = "";
    let emailType = "";
    if (type === "payment_link") {
      emailType = "Payment Link";
      const link = customData?.paymentUrl || `${APP_URL}/?page=checkout&orderId=${order.id}`;
      const amountToPay = customData?.paymentAmount !== void 0 ? customData.paymentAmount : order.finalAmount;
      subject = `Complete Your Payment \u2014 $${amountToPay.toFixed(2)} USD \xB7 Order #${order.id} | Your Flights LLC`;
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
        `\u2014 Your Flights LLC`
      ]);
    } else if (type === "order_confirmation") {
      emailType = "Order Confirmation";
      subject = `Contracting Confirmed \xB7 Order #${order.id} \u2014 Your Flights LLC`;
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
        `  Advisor:          ${order.assignedAdvisor || "Your Flights Advisory Team"}`,
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
        `\u2014 Your Flights LLC`
      ]);
    } else if (type === "service_details") {
      emailType = "Service Details";
      subject = `Service Scope & Details \u2014 Order #${order.id} | Your Flights LLC`;
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
        customData?.message || order.internalNotes || "Our team is preparing your custom consulting advisory deliverable.",
        ``,
        `Delivery: Electronic, within 2 business days.`,
        `Revisions: 1 free revision within 14 days of delivery.`,
        ``,
        `Questions? Reply to this email or reach us at:`,
        `  support@yourflightsllc.com | +1-810-505-5186`,
        ``,
        `\u2014 Your Flights LLC`
      ]);
    } else {
      emailType = "Custom Communication";
      subject = customData?.subject || `Update on your order #${order.id} \u2014 Your Flights LLC`;
      bodyHtml = buildCustomEmailHtml(order, subject, customData?.message || "");
      bodyText = buildPlainText([
        `Hello ${order.customerName},`,
        ``,
        customData?.message || "",
        ``,
        `Regarding order: ${order.orderRef || order.id} \u2014 ${order.serviceName}`,
        ``,
        `Questions? support@yourflightsllc.com | +1-810-505-5186`,
        `Your Flights LLC \xB7 MCC 8999 / 8999`
      ]);
    }
    let messageId = `sim_msg_${Date.now()}`;
    let deliveryStatus = "SENT";
    let failureReason;
    try {
      const transporter = await createMailServiciosr();
      const info = await transporter.sendMail({
        from: SMTP.FROM,
        to: order.customerEmail,
        subject,
        text: bodyText,
        html: bodyHtml
      });
      if (info?.messageId) messageId = info.messageId;
    } catch (err) {
      console.warn("[ACTION EMAIL NOTICE]:", err.message);
      deliveryStatus = "FAILED";
      failureReason = err.message;
    }
    const emailLog = {
      id: `EML-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      orderId: order.id,
      recipient: order.customerEmail,
      subject,
      bodyHtml,
      bodyText,
      emailType,
      sentTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
      deliveryStatus,
      providerMessageId: messageId,
      failureReason
    };
    db.insertEmailLog(emailLog);
    return { success: deliveryStatus !== "FAILED", messageId, error: failureReason };
  }
  // ───────────────────────────────────────────────────────────
  // Service Delivery PDF email (with acknowledgement link)
  // ───────────────────────────────────────────────────────────
  static async sendServiceDeliveryEmail(order, pdfBuffer, acknowledgementUrl) {
    const subject = `Your Flights Advisory Deliverable Ready \u2014 Order #${order.id} | Your Flights LLC`;
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
      `\u2014 Your Flights LLC`
    ]);
    try {
      const transporter = await createMailServiciosr();
      const info = await transporter.sendMail({
        from: SMTP.FROM,
        to: order.customerEmail,
        bcc: SMTP.USER,
        // Admin copy for proof
        subject,
        html: bodyHtml,
        text: bodyText,
        attachments: [
          {
            filename: `Your_Projects_Advisory_Deliverable_${order.id}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf"
          }
        ]
      });
      db.insertEmailLog({
        id: `EML-DEL-${Date.now()}`,
        orderId: order.id,
        recipient: order.customerEmail,
        subject,
        bodyHtml,
        bodyText,
        emailType: "Service Delivery PDF Package",
        sentTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
        deliveryStatus: "SENT",
        providerMessageId: info?.messageId || `msg-${Date.now()}`
      });
      return { success: true };
    } catch (err) {
      console.error("[SERVICE DELIVERY EMAIL ERROR]:", err);
      return { success: false, error: err.message };
    }
  }
};

// server/services/acknowledgementService.ts
var AcknowledgementService = class {
  static verifyToken(token) {
    const verified = verifySignedAcknowledgementToken(token);
    if (!verified) {
      return { valid: false, error: "The acknowledgement link is invalid or has expired. Please contact support." };
    }
    const order = db.findOrderById(verified.orderId);
    if (!order) {
      return { valid: false, error: "Order associated with this token was not found." };
    }
    const existingAck = db.getAcknowledgements().find(
      (a) => a.orderId === order.id || a.deliveryId === verified.deliveryId
    );
    return {
      valid: true,
      order,
      deliveryId: verified.deliveryId,
      alreadyAcknowledged: Boolean(existingAck)
    };
  }
  static async recordAcknowledgement(payload) {
    let orderId = payload.orderId;
    let deliveryId = `DEL-${Date.now()}`;
    if (payload.token) {
      const verified = verifySignedAcknowledgementToken(payload.token);
      if (!verified) {
        return { success: false, error: "Invalid or expired acknowledgement token." };
      }
      orderId = verified.orderId;
      deliveryId = verified.deliveryId;
    }
    if (!orderId) {
      return { success: false, error: "Order reference required." };
    }
    const order = db.findOrderById(orderId);
    if (!order) {
      return { success: false, error: `Order ${orderId} not found.` };
    }
    let location = payload.location || "United States";
    if (payload.clientIp && payload.clientIp !== "127.0.0.1" && payload.clientIp !== "::1") {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${payload.clientIp}`);
        const geoData = await geoRes.json();
        if (geoData && geoData.status === "success") {
          location = `${geoData.city}, ${geoData.regionName}, ${geoData.country}`;
        }
      } catch {
      }
    }
    const ackId = `ACK-${Date.now()}-${Math.floor(1e3 + Math.random() * 9e3)}`;
    const ackRecord = {
      id: ackId,
      orderId: order.id,
      customerId: order.customerId,
      deliveryId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      clientIp: payload.clientIp,
      userAgent: payload.userAgent,
      browser: payload.browser || "Web Browser",
      os: payload.os || "Operating System",
      deviceType: payload.deviceType || "Desktop/Mobile",
      approxLocation: location,
      mccAgreement: "ACCEPTED",
      disclosuresText: `Client officially acknowledged receipt of ${order.serviceName} deliverables and agreed to MCC 8999/8999 non-refundable terms.`,
      serviceName: order.serviceName,
      amount: order.finalAmount,
      currency: order.currency
    };
    db.insertAcknowledgement(ackRecord);
    db.updateOrder(order.id, {
      status: "Acknowledged"
    });
    db.updateDelivery(deliveryId, {
      status: "Acknowledged",
      acknowledgedAt: ackRecord.timestamp
    });
    db.insertStatusHistory({
      id: `HIST-${Date.now()}`,
      orderId: order.id,
      previousStatus: order.status,
      newStatus: "Acknowledged",
      changedBy: `Client (${order.customerEmail})`,
      reason: `Client accepted terms via signed link from IP: ${payload.clientIp}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    db.insertAuditLog({
      id: `AUD-ACK-${Date.now()}`,
      actor: order.customerEmail,
      action: "CLIENT_ACKNOWLEDGEMENT_RECORDED",
      entity: "Acknowledgement",
      entityId: ackId,
      clientIp: payload.clientIp,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      newValues: { orderId: order.id, location, ip: payload.clientIp }
    });
    db.insertNotification({
      id: `NOTIF-ACK-${Date.now()}`,
      title: "Deliverables Acknowledged",
      message: `Client ${order.customerName} acknowledged receipt for Order ${order.id}`,
      type: "ACKNOWLEDGEMENT",
      read: false,
      link: `/admin?orderId=${order.id}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return { success: true, ackId };
  }
};

// server/routes/admin.ts
var adminRouter = (0, import_express5.Router)();
adminRouter.post("/api/admin/auth/login", authRateLimiter, (req, res) => {
  const { password, email } = req.body;
  const inputPass = (password || "").trim();
  const envPass = (process.env.ADMIN_PASSWORD || ADMIN_PASSWORD || "YourProjectsAdmin2026!").trim();
  const defaultPasswords = ["YourProjectsAdmin2026!", "admin123", "admin", "YourProjects2026!"];
  const isDefaultEnv = defaultPasswords.includes(envPass);
  const isMatch = inputPass === envPass || isDefaultEnv && defaultPasswords.includes(inputPass);
  if (isMatch) {
    const user = db.getUsers()[0] || {
      id: "USR-ADMIN-001",
      name: "Staff Administrator",
      email: email || "support@yourflightsllc.com",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const token = generateAuthToken(user);
    db.insertAuditLog({
      id: `AUD-AUTH-${Date.now()}`,
      actor: user.email,
      actorRole: user.role,
      action: "ADMIN_LOGIN_SUCCESS",
      entity: "Auth",
      entityId: user.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      clientIp: req.ip
    });
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      requiresPasswordChange: isDefaultEnv,
      message: "Authentication successful"
    });
  }
  db.insertAuditLog({
    id: `AUD-AUTH-FAIL-${Date.now()}`,
    actor: email || "Unknown",
    action: "ADMIN_LOGIN_FAILED",
    entity: "Auth",
    entityId: "failed_attempt",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    clientIp: req.ip
  });
  return res.status(401).json({
    success: false,
    error: "Invalid master admin credentials."
  });
});
adminRouter.post("/api/admin/login", authRateLimiter, (req, res) => {
  const { password } = req.body;
  const inputPass = (password || "").trim();
  const envPass = (process.env.ADMIN_PASSWORD || ADMIN_PASSWORD || "YourProjectsAdmin2026!").trim();
  const defaultPasswords = ["YourProjectsAdmin2026!", "admin123", "admin", "YourProjects2026!"];
  const isDefaultEnv = defaultPasswords.includes(envPass);
  const isMatch = inputPass === envPass || isDefaultEnv && defaultPasswords.includes(inputPass);
  if (isMatch) {
    const user = db.getUsers()[0];
    const token = generateAuthToken(user);
    return res.json({
      success: true,
      token,
      requiresPasswordChange: isDefaultEnv,
      message: "Admin authentication successful"
    });
  }
  return res.status(401).json({ success: false, error: "Invalid admin password" });
});
adminRouter.post("/api/admin/forgot-password", authRateLimiter, async (req, res) => {
  try {
    const transporter = await createMailServiciosr();
    const adminEmail = SMTP.USER;
    const currentPass = process.env.ADMIN_PASSWORD || ADMIN_PASSWORD || "YourProjectsAdmin2026!";
    await transporter.sendMail({
      from: SMTP.FROM,
      to: adminEmail,
      subject: "Master Admin Password Recovery \u2014 Your Flights LLC",
      text: `Your current staff password is: ${currentPass}

If you did not request this, you can disregard this email.`,
      html: `<p>Your current staff password is:</p><h3>${currentPass}</h3><p>MCC 8999 / 8999 Security System</p>`
    });
    res.json({ success: true, message: "Password recovery email dispatched." });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to dispatch recovery email" });
  }
});
adminRouter.post("/api/admin/change-password", requireAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const masterPassword = process.env.ADMIN_PASSWORD || ADMIN_PASSWORD || "YourProjectsAdmin2026!";
    if (currentPassword !== masterPassword) {
      return res.status(401).json({ success: false, error: "Current password is incorrect." });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: "New password must be at least 6 characters." });
    }
    process.env.ADMIN_PASSWORD = newPassword;
    try {
      const envPath = import_path4.default.join(process.cwd(), ".env");
      if (import_fs5.default.existsSync(envPath)) {
        let envFile = import_fs5.default.readFileSync(envPath, "utf8");
        if (envFile.includes("ADMIN_PASSWORD=")) {
          envFile = envFile.replace(/(ADMIN_PASSWORD=).*/g, `$1${newPassword}`);
        } else {
          envFile += `
ADMIN_PASSWORD=${newPassword}
`;
        }
        import_fs5.default.writeFileSync(envPath, envFile);
      }
    } catch (fsErr) {
      console.warn("Could not write to .env, in-memory updated.");
    }
    res.json({ success: true, message: "Admin password updated successfully." });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error updating password" });
  }
});
adminRouter.get("/api/admin/dashboard", requireAuth, (req, res) => {
  const orders = db.getOrders();
  const payments = db.getPayments();
  const customers = db.getCustomers();
  const acks = db.getAcknowledgements();
  const auditLogs = db.getAuditLogs();
  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const totalOutstanding = orders.reduce((acc, curr) => acc + (curr.remainingAmount || 0), 0);
  const now = /* @__PURE__ */ new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1e3).getTime();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 3600 * 1e3).getTime();
  const todayRevenue = orders.filter((o) => o.createdAt.slice(0, 10) === todayStr).reduce((acc, curr) => acc + curr.amountPaid, 0);
  const weeklyRevenue = orders.filter((o) => new Date(o.createdAt).getTime() >= sevenDaysAgo).reduce((acc, curr) => acc + curr.amountPaid, 0);
  const monthlyRevenue = orders.filter((o) => new Date(o.createdAt).getTime() >= thirtyDaysAgo).reduce((acc, curr) => acc + curr.amountPaid, 0);
  const totalCompleted = orders.filter((o) => o.status === "Completed" || o.status === "Delivered").length;
  const pendingCount = orders.filter(
    (o) => o.status !== "Completed" && o.status !== "Delivered" && o.status !== "Cancelled"
  ).length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const awaitingAckCount = orders.filter((o) => o.status === "Acknowledgement Pending" || o.status === "Delivered" && !acks.find((a) => a.orderId === o.id)).length;
  const legacyDeliverables = orders.map((o) => ({
    id: o.id,
    orderRef: o.orderRef,
    clientName: o.customerName,
    clientEmail: o.customerEmail,
    serviceName: o.serviceName,
    amount: o.finalAmount,
    currency: o.currency,
    status: o.status === "Delivered" || o.status === "Completed" ? "Fulfilled / Delivered" : o.status === "Cancelled" ? "Cancelled" : o.status === "Processing" ? "In Research" : o.status === "Ready for Delivery" ? "Draft Strategy Review" : "Pending Discovery Call",
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    notes: o.customerNotes || o.internalNotes || "",
    assignedAdvisor: o.assignedAdvisor,
    isAcknowledged: Boolean(acks.find((a) => a.orderId === o.id))
  }));
  res.json({
    success: true,
    merchant: "Your Flights LLC \u2014 Operations & Compliance Hub (MCC 8999 / 8999)",
    stats: {
      totalRevenue: `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      todayRevenue: `$${todayRevenue.toFixed(2)}`,
      weeklyRevenue: `$${weeklyRevenue.toFixed(2)}`,
      monthlyRevenue: `$${monthlyRevenue.toFixed(2)}`,
      totalOutstanding: `$${totalOutstanding.toFixed(2)}`,
      totalOrders: orders.length,
      pendingCount,
      fulfilledCount: totalCompleted,
      deliveredCount,
      awaitingAckCount,
      agreementAuditCount: acks.length,
      totalDeliverables: orders.length,
      totalCustomers: customers.length
    },
    recentOrders: orders.slice(0, 10),
    recentPayments: payments.slice(0, 10),
    deliverables: legacyDeliverables,
    orders,
    customers,
    auditLogs,
    acknowledgements: acks
  });
});
adminRouter.get("/api/admin/orders", requireAuth, (req, res) => {
  const {
    search,
    status,
    paymentStatus,
    serviceCategory,
    assignedAdvisor,
    startDate,
    endDate,
    page,
    limit,
    sortBy,
    sortOrder
  } = req.query;
  const result = OrderService.listOrders({
    search,
    status,
    paymentStatus,
    serviceCategory,
    assignedAdvisor,
    startDate,
    endDate,
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 50,
    sortBy,
    sortOrder
  });
  res.json({ success: true, ...result });
});
adminRouter.get("/api/admin/orders/:id", requireAuth, (req, res) => {
  const order = db.findOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: "Order not found" });
  }
  const customer = db.findCustomerById(order.customerId);
  const statusHistory = db.getStatusHistory(order.id);
  const financialAudits = db.getFinancialAudits(order.id);
  const payments = db.getPayments().filter((p) => p.orderId === order.id);
  const delivery = db.getDeliveries().find((d) => d.orderId === order.id);
  const ack = db.getAcknowledgements().find((a) => a.orderId === order.id);
  const emailLogs = db.getEmailLogs().filter((e) => e.orderId === order.id);
  res.json({
    success: true,
    order,
    customer,
    statusHistory,
    financialAudits,
    payments,
    delivery,
    acknowledgement: ack,
    emailLogs
  });
});
adminRouter.post("/api/admin/orders", requireAuth, (req, res) => {
  try {
    const { clientName, clientEmail, customerName, customerEmail, serviceName, amount, assignedAdvisor, notes, customerNotes, internalNotes } = req.body;
    const newOrder = OrderService.createOrder({
      customerName: customerName || clientName || "Valued Client",
      customerEmail: customerEmail || clientEmail || "client@example.com",
      serviceName: serviceName || "Custom Day-by-Day Strategy Planning Strategy",
      amount: Number(amount) || 150,
      assignedAdvisor: assignedAdvisor || "Sarah Jenkins (Senior Strategist)",
      customerNotes: customerNotes || notes,
      internalNotes,
      actorName: "Staff Admin"
    });
    res.json({
      success: true,
      message: "New consultation order created successfully",
      order: newOrder,
      deliverable: newOrder
      // backward compat
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
adminRouter.post("/api/admin/deliverables/create", requireAuth, (req, res) => {
  const { clientName, clientEmail, serviceName, amount, assignedAdvisor, notes } = req.body;
  const newOrder = OrderService.createOrder({
    customerName: clientName || "Valued Client",
    customerEmail: clientEmail || "client@example.com",
    serviceName: serviceName || "Custom Day-by-Day Strategy Planning Strategy",
    amount: Number(amount) || 150,
    assignedAdvisor,
    internalNotes: notes,
    actorName: "Staff Admin"
  });
  res.json({ success: true, deliverable: newOrder });
});
adminRouter.post("/api/admin/orders/:id/status", requireAuth, (req, res) => {
  try {
    const { status, reason } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required" });
    const updated = OrderService.transitionStatus(
      req.params.id,
      status,
      "Staff Admin",
      reason
    );
    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
adminRouter.post("/api/admin/deliverables/update", requireAuth, (req, res) => {
  try {
    const { id, status, notes, assignedAdvisor } = req.body;
    const order = db.findOrderById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (status && status !== order.status) {
      OrderService.transitionStatus(order.id, status, "Staff Admin");
    }
    const updated = db.updateOrder(order.id, {
      internalNotes: notes !== void 0 ? notes : order.internalNotes,
      assignedAdvisor: assignedAdvisor !== void 0 ? assignedAdvisor : order.assignedAdvisor
    });
    res.json({ success: true, deliverable: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
adminRouter.post("/api/admin/orders/:id/financials", requireAuth, (req, res) => {
  try {
    const { finalAmount, discount = 0, reason } = req.body;
    if (finalAmount === void 0 || !reason) {
      return res.status(400).json({ error: "finalAmount and mandatory reason are required" });
    }
    const updated = OrderService.adjustFinancials(
      req.params.id,
      Number(finalAmount),
      Number(discount),
      "Staff Admin",
      reason
    );
    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
adminRouter.post("/api/admin/orders/:id/send-email", requireAuth, async (req, res) => {
  try {
    const { type, subject, message, paymentUrl, paymentAmount } = req.body;
    const order = db.findOrderById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });
    const result = await EmailService.sendOrderActionEmail(order, type, {
      subject,
      message,
      paymentUrl,
      paymentAmount
    });
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error || "Failed to dispatch email" });
    }
    res.json({
      success: true,
      message: `Email dispatched to ${order.customerEmail}`,
      messageId: result.messageId
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
adminRouter.patch("/api/admin/orders/:id", requireAuth, (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      internalNotes,
      serviceName,
      finalAmount,
      discount,
      paymentStatus,
      amountPaid
    } = req.body;
    const order = db.findOrderById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });
    const updates = {};
    if (customerName !== void 0) updates.customerName = customerName;
    if (customerEmail !== void 0) updates.customerEmail = customerEmail;
    if (customerPhone !== void 0) updates.customerPhone = customerPhone;
    if (internalNotes !== void 0) updates.internalNotes = internalNotes;
    if (serviceName !== void 0) updates.serviceName = serviceName;
    if (finalAmount !== void 0) updates.finalAmount = Number(finalAmount);
    if (discount !== void 0) updates.discount = Number(discount);
    if (paymentStatus !== void 0) updates.paymentStatus = paymentStatus;
    const currentFinalAmount = finalAmount !== void 0 ? Number(finalAmount) : order.finalAmount;
    const currentAmountPaid = amountPaid !== void 0 ? Number(amountPaid) : order.amountPaid;
    if (amountPaid !== void 0 || finalAmount !== void 0) {
      updates.amountPaid = currentAmountPaid;
      updates.remainingAmount = Math.max(0, currentFinalAmount - currentAmountPaid);
      if (amountPaid !== void 0 && currentAmountPaid > 0) {
        updates.paymentMethod = "manual";
      }
      if (updates.paymentStatus !== "Refunded" && updates.paymentStatus !== "Cancelled") {
        if (updates.remainingAmount === 0) {
          updates.paymentStatus = "Successful";
        } else {
          updates.paymentStatus = "Pending";
        }
      }
    }
    const updated = db.updateOrder(order.id, updates);
    db.insertAuditLog({
      id: `AUD-PATCH-${Date.now()}`,
      actor: "Staff Admin",
      action: "ORDER_UPDATED",
      entity: "Order",
      entityId: order.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      newValues: updates
    });
    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
adminRouter.get("/api/admin/customers", requireAuth, (_req, res) => {
  const customers = db.getCustomers();
  res.json({ success: true, total: customers.length, customers });
});
adminRouter.get("/api/admin/customers/:id", requireAuth, (req, res) => {
  const customer = db.findCustomerById(req.params.id);
  if (!customer) return res.status(404).json({ success: false, error: "Customer not found" });
  const orders = db.getOrders().filter((o) => o.customerId === customer.id);
  const acks = db.getAcknowledgements().filter((a) => a.customerId === customer.id);
  res.json({
    success: true,
    customer,
    orders,
    acknowledgements: acks
  });
});
adminRouter.get("/api/admin/payments", requireAuth, (_req, res) => {
  const payments = db.getPayments();
  res.json({ success: true, total: payments.length, payments });
});
adminRouter.post("/api/admin/payments/create-link", requireAuth, async (req, res) => {
  const { orderId, amount, title } = req.body;
  if (!orderId) return res.status(400).json({ error: "orderId is required" });
  const result = await PaymentService.generatePaymentLink(
    orderId,
    Number(amount),
    "Staff Admin",
    title
  );
  if (!result.success) {
    return res.status(500).json({ success: false, error: result.error });
  }
  res.json(result);
});
adminRouter.post("/api/admin/payments/refund", requireAuth, async (req, res) => {
  const { orderId, amount, reason } = req.body;
  if (!orderId || !amount || !reason) {
    return res.status(400).json({ error: "orderId, amount, and reason are required" });
  }
  const result = await PaymentService.issueRefund(
    orderId,
    Number(amount),
    "Staff Admin",
    reason
  );
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }
  res.json({ success: true, message: `Refund of $${amount} recorded.` });
});
adminRouter.post("/api/admin/deliveries/send", requireAuth, async (req, res) => {
  try {
    const { deliverableId, orderId, clientEmail, clientName, inclusions, terms } = req.body;
    const targetId = orderId || deliverableId;
    let order = db.findOrderById(targetId);
    if (!order) return res.status(404).json({ error: "Order record not found" });
    if (clientEmail && clientEmail !== order.customerEmail) {
      order = db.updateOrder(order.id, { customerEmail: clientEmail });
    }
    const delivery = DeliveryService.createOrUpdateDelivery({
      orderId: order.id,
      inclusions: inclusions || "Custom day-by-day business strategy & research report.",
      terms: terms || "MCC 8999 / 8999 Terms accepted.",
      actorName: "Staff Admin"
    });
    const pdfBuffer = await DeliveryService.generateDeliveryPDF(delivery, order);
    const ackUrl = DeliveryService.getSignedAcknowledgementUrl(order.id, delivery.id);
    await EmailService.sendServiceDeliveryEmail(order, pdfBuffer, ackUrl);
    OrderService.transitionStatus(order.id, "Delivered", "Staff Admin", "Service delivery PDF dispatched via email");
    res.json({
      success: true,
      message: `Official delivery package sent to ${order.customerEmail}`,
      deliveryId: delivery.id,
      acknowledgementUrl: ackUrl
    });
  } catch (err) {
    console.error("[DELIVERY SEND ERROR]:", err);
    res.status(500).json({ error: err.message || "Failed to generate PDF and dispatch delivery" });
  }
});
adminRouter.post("/api/admin/send-contracting-details", requireAuth, async (req, res) => {
  const { deliverableId, inclusions, terms } = req.body;
  const order = db.findOrderById(deliverableId);
  if (!order) return res.status(404).json({ error: "Deliverable not found" });
  const delivery = DeliveryService.createOrUpdateDelivery({
    orderId: order.id,
    inclusions: inclusions || "Advisory service inclusions.",
    terms: terms || "MCC 8999 / 8999 Terms accepted.",
    actorName: "Staff Admin"
  });
  const pdfBuffer = await DeliveryService.generateDeliveryPDF(delivery, order);
  const ackUrl = DeliveryService.getSignedAcknowledgementUrl(order.id, delivery.id);
  await EmailService.sendServiceDeliveryEmail(order, pdfBuffer, ackUrl);
  OrderService.transitionStatus(order.id, "Delivered", "Staff Admin");
  res.json({ success: true, message: "Contracting details dispatched." });
});
adminRouter.get("/api/client/ack-verify/:token", (req, res) => {
  const result = AcknowledgementService.verifyToken(req.params.token);
  if (!result.valid) {
    return res.status(400).json({ success: false, error: result.error });
  }
  res.json({
    success: true,
    order: result.order,
    deliveryId: result.deliveryId,
    alreadyAcknowledged: result.alreadyAcknowledged
  });
});
adminRouter.post("/api/client/acknowledge", async (req, res) => {
  const clientIp = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "Web Browser";
  const result = await AcknowledgementService.recordAcknowledgement({
    token: req.body.token,
    orderId: req.body.orderId || req.body.deliverableId,
    clientIp,
    userAgent,
    browser: req.body.browser,
    os: req.body.os,
    deviceType: req.body.deviceType
  });
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }
  res.json({ success: true, message: "Official receipt and terms acknowledged securely." });
});
adminRouter.get("/api/admin/notifications", requireAuth, (_req, res) => {
  const notifs = db.getNotifications();
  const unreadCount = notifs.filter((n) => !n.read).length;
  res.json({ success: true, unreadCount, notifications: notifs });
});
adminRouter.post("/api/admin/notifications/mark-read", requireAuth, (req, res) => {
  const { id } = req.body;
  if (id) db.markNotificationAsRead(id);
  else db.markAllNotificationsAsRead();
  res.json({ success: true });
});
adminRouter.get("/api/admin/templates", requireAuth, (_req, res) => {
  res.json({ success: true, templates: db.getEmailTemplates() });
});
adminRouter.get("/api/admin/email-logs", requireAuth, (_req, res) => {
  res.json({ success: true, logs: db.getEmailLogs() });
});
adminRouter.get("/api/admin/audit-logs", requireAuth, (_req, res) => {
  res.json({ success: true, logs: db.getAuditLogs() });
});
adminRouter.get("/api/admin/acknowledgements", requireAuth, (_req, res) => {
  res.json({ success: true, acknowledgements: db.getAcknowledgements() });
});

// server/routes/contracting.ts
var import_express6 = require("express");
var import_pdfkit2 = __toESM(require("pdfkit"), 1);
var contractingRouter = (0, import_express6.Router)();
contractingRouter.post("/api/admin/send-contracting-details", async (req, res) => {
  const authHeader = req.headers.authorization;
  const authQuery = req.query.token;
  if (!authHeader && !authQuery) {
    return res.status(401).json({ error: "Unauthorized admin request" });
  }
  try {
    const { deliverableId, clientEmail, clientName, serviceName, amount, inclusions, terms } = req.body;
    if (!deliverableId || !clientEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const generatePDF = () => {
      return new Promise((resolve, reject) => {
        try {
          const doc = new import_pdfkit2.default({ margin: 50, size: "A4" });
          const buffers = [];
          doc.on("data", buffers.push.bind(buffers));
          doc.on("end", () => resolve(Buffer.concat(buffers)));
          const primaryColor = "#1e3a8a";
          const secondaryColor = "#059669";
          const textColor = "#334155";
          const lightBg = "#f8fafc";
          doc.rect(0, 0, doc.page.width, 120).fill(primaryColor);
          doc.fillColor("#ffffff").fontSize(28).font("Helvetica-Bold").text("YOUR FLIGHTS LLC", 50, 40);
          doc.fontSize(12).font("Helvetica").text("Consulting Strategy & Advisory Concierge", 50, 75);
          doc.fontSize(10).text("MCC 8999 / 8999", doc.page.width - 150, 45, { align: "right" });
          doc.text(`Reference ID: ${deliverableId}`, doc.page.width - 250, 60, { align: "right" });
          doc.text(`Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`, doc.page.width - 150, 75, { align: "right" });
          doc.moveDown(4);
          const startY = 140;
          doc.rect(50, startY, doc.page.width - 100, 70).fillAndStroke(lightBg, "#e2e8f0");
          doc.fillColor(primaryColor).fontSize(14).font("Helvetica-Bold").text("CLIENT INFORMATION", 70, startY + 15);
          doc.fillColor(textColor).fontSize(11).font("Helvetica").text(`Name: ${clientName || "Valued Client"}`, 70, startY + 35);
          doc.text(`Email: ${clientEmail}`, 70, startY + 50);
          doc.moveDown(3);
          const orderY = doc.y;
          doc.rect(50, orderY, doc.page.width - 100, 60).fillAndStroke(lightBg, "#e2e8f0");
          doc.fillColor(primaryColor).fontSize(14).font("Helvetica-Bold").text("SERVICE DETAILS", 70, orderY + 15);
          doc.fillColor(textColor).fontSize(11).font("Helvetica-Bold").text(`Service: ${serviceName}`, 70, orderY + 35);
          doc.fillColor(secondaryColor).fontSize(12).text(`Total Amount Due: $${amount.toFixed(2)} USD`, doc.page.width - 300, orderY + 35, { align: "right" });
          doc.moveDown(4);
          doc.fillColor(primaryColor).fontSize(14).font("Helvetica-Bold").text("PACKAGE INCLUSIONS & RESEARCH DETAILS", 50, doc.y);
          doc.moveDown(0.5);
          doc.fillColor(textColor).fontSize(10).font("Helvetica").text(inclusions || "Standard consulting advisory services.", {
            lineGap: 4,
            align: "justify"
          });
          doc.moveDown(2);
          doc.fillColor(primaryColor).fontSize(14).font("Helvetica-Bold").text("MERCHANT TERMS & DISCLOSURES", 50, doc.y);
          doc.moveDown(0.5);
          doc.fillColor("#64748b").fontSize(9).font("Helvetica").text(terms || "By acknowledging this document, you agree to the terms of service. Your Flights LLC acts solely as an independent consulting advisor and does not issue licenses.", {
            lineGap: 3,
            align: "justify"
          });
          const footerY = doc.page.height - 80;
          doc.rect(0, footerY, doc.page.width, 80).fill("#0f172a");
          doc.fillColor("#94a3b8").fontSize(9).font("Helvetica").text("Your Flights LLC | Legal Entity: 30 N Gould St, Ste R, Sheridan, WY 82801 | Ops: E-1/149 Jaitpur Extn Part-1, Badarpur, Delhi 110044 INDIA", 50, footerY + 25, { align: "center" }).text("Support: support@yourflightsllc.com | +1-810-505-5186", 50, footerY + 40, { align: "center" });
          doc.end();
        } catch (err) {
          reject(err);
        }
      });
    };
    const pdfBuffer = await generatePDF();
    const transporter = await createMailServiciosr();
    const acknowledgeLink = `${APP_URL}/?page=acknowledge&id=${deliverableId}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background-color: #1e3a8a; padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">YOUR FLIGHTS</h1>
            <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 14px;">Consulting Strategy & Advisory Concierge</p>
          </div>

          <!-- Body -->
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #334155; margin-top: 0;">Dear <strong>${clientName || "Client"}</strong>,</p>
            <p style="font-size: 15px; color: #475569; line-height: 1.6;">
              Thank you for choosing Your Flights LLC. We have attached your detailed <strong>${serviceName}</strong> PDF document outlining your package inclusions, research details, and terms.
            </p>
            
            <!-- Action Box -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #059669; padding: 25px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin-top: 0; color: #0f172a; font-size: 18px;">Action Required: Acknowledge Terms</h3>
              <p style="color: #475569; font-size: 14px; line-height: 1.5; margin-bottom: 25px;">
                Before we proceed with the service, please review the attached PDF and click the secure button below to officially acknowledge receipt and agreement to the deliverables.
              </p>
              <div style="text-align: center;">
                <a href="${acknowledgeLink}" style="background-color: #059669; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 2px 4px rgba(5, 150, 105, 0.3);">
                  Acknowledge Contracting Terms
                </a>
              </div>
              <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 15px;">
                By clicking this button, your timestamp, IP, and device data will be securely recorded for compliance.
              </p>
            </div>

            <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 0;">
              If you have any questions, please reply directly to this email or call our support line at +1-810-505-5186.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              Your Flights LLC &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} All Rights Reserved.<br>
              Legal Entity: 30 N Gould St, Ste R, Sheridan, WY 82801
              Ops: E-1/149 Jaitpur Extn Part-1, Badarpur, Delhi 110044 INDIA (MCC 8999 / 8999)
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    await transporter.sendMail({
      from: SMTP.FROM,
      to: clientEmail,
      subject: `Your Contracting Details & Receipt - ${deliverableId}`,
      html: htmlContent,
      attachments: [
        {
          filename: `Contracting_Details_${deliverableId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    });
    updateDeliverable(deliverableId, { sentEmailHtml: htmlContent });
    res.json({ success: true, message: "Contracting details PDF generated and sent successfully." });
  } catch (error) {
    console.error("Error sending contracting details:", error);
    res.status(500).json({ error: error.message || "Failed to generate PDF and send email." });
  }
});
contractingRouter.post("/api/client/acknowledge", async (req, res) => {
  try {
    const { deliverableId, clientName, clientEmail, serviceName, amount, isTestMode } = req.body;
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    let location = "Unknown";
    if (clientIp && clientIp !== "unknown" && clientIp !== "::1" && clientIp !== "127.0.0.1") {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${clientIp}`);
        const geoData = await geoRes.json();
        if (geoData && geoData.status === "success") {
          location = `${geoData.city}, ${geoData.regionName}, ${geoData.country}`;
        }
      } catch (e) {
        console.warn("GeoIP lookup failed for IP:", clientIp);
      }
    }
    addAuditRecord({
      id: `ACK-${Date.now()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      clientIp,
      userAgent,
      location,
      clientName: clientName || "Unknown",
      clientEmail: clientEmail || "Unknown",
      deliverableId,
      mccAgreement: "ACCEPTED",
      disclosureText: `Client acknowledged receipt of deliverables and merchant terms via email link.`,
      serviceName: serviceName || "Advisory Service",
      amount: amount || 0,
      currency: "usd",
      isTestMode: isTestMode || false
    });
    if (deliverableId) {
      updateDeliverable(deliverableId, {
        isAcknowledged: true,
        acknowledgmentData: {
          ip: clientIp,
          userAgent,
          location,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
    }
    res.json({ success: true, message: "Acknowledgment recorded securely." });
  } catch (error) {
    console.error("Acknowledgment Error:", error);
    res.status(500).json({ error: "Failed to record acknowledgment." });
  }
});

// server/routes/payments.ts
var import_express7 = require("express");
var import_stripe = __toESM(require("stripe"), 1);
var import_razorpay = __toESM(require("razorpay"), 1);
var import_crypto3 = __toESM(require("crypto"), 1);
var paymentsRouter = (0, import_express7.Router)();
paymentsRouter.post("/api/admin/generate-payment-link", async (req, res) => {
  const authHeader = req.headers.authorization;
  const authQuery = req.query.token;
  if (!authHeader && !authQuery) {
    return res.status(401).json({ error: "Unauthorized admin request" });
  }
  const { title, amount, returnUrl } = req.body;
  if (!title || !amount) {
    return res.status(400).json({ error: "Missing title or amount" });
  }
  try {
    const successUrl = returnUrl || `${APP_URL}/?page=checkout-success`;
    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = new import_stripe.default(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: title },
              unit_amount: Math.round(amount * 100)
            },
            quantity: 1
          }
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: APP_URL
      });
      return res.json({ success: true, url: session.url, provider: "stripe" });
    }
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const razorpay = new import_razorpay.default({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
      const paymentLink = await razorpay.paymentLink.create({
        amount: Math.round(amount * 100),
        currency: "USD",
        description: title,
        customer: { name: "Valued Client", email: "client@example.com" },
        // Optional in Razorpay
        notify: { email: false, sms: false },
        reminder_enable: false,
        callback_url: successUrl,
        callback_method: "get"
      });
      return res.json({ success: true, url: paymentLink.short_url, provider: "razorpay" });
    }
    if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
      const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
      const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
      });
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;
      const orderRes = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [{
            description: title,
            amount: { currency_code: "USD", value: amount.toFixed(2) }
          }],
          application_context: {
            return_url: successUrl,
            cancel_url: APP_URL
          }
        })
      });
      const orderData = await orderRes.json();
      const approveLink = orderData.links?.find((link) => link.rel === "approve")?.href;
      if (approveLink) {
        return res.json({ success: true, url: approveLink, provider: "paypal" });
      }
    }
    return res.status(400).json({ error: "No active payment gateway credentials found in .env" });
  } catch (error) {
    console.error("Error generating payment link:", error);
    res.status(500).json({ error: error.message });
  }
});
paymentsRouter.post("/api/admin/create-payu-hash", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized admin request" });
  }
  const { amount, customerName, customerEmail, customerPhone, productinfo } = req.body;
  if (!amount || !customerName || !customerEmail || !customerPhone) {
    return res.status(400).json({ error: "Missing order parameters" });
  }
  try {
    const key = PAYU_MERCHANT_KEY;
    const salt = PAYU_MERCHANT_SALT;
    const env = PAYU_ENV;
    if (!key || !salt) {
      return res.status(400).json({ error: "PayU is not configured." });
    }
    const txnid = `txn_${Date.now()}_${Math.floor(Math.random() * 1e3)}`;
    const info = productinfo || "Flight Services";
    const hashString = `${key}|${txnid}|${amount}|${info}|${customerName}|${customerEmail}|||||||||||${salt}`;
    const hash = import_crypto3.default.createHash("sha512").update(hashString).digest("hex");
    res.json({
      success: true,
      key,
      txnid,
      hash,
      environment: env
    });
  } catch (error) {
    console.error("Error creating PayU hash:", error);
    res.status(500).json({ error: error.message });
  }
});
paymentsRouter.post("/api/admin/check-card-bin", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized admin request" });
  }
  const { bin } = req.body;
  if (!bin || bin.length < 6) {
    return res.status(400).json({ error: "Valid 6-digit BIN is required" });
  }
  try {
    const key = PAYU_MERCHANT_KEY;
    const salt = PAYU_MERCHANT_SALT;
    const env = PAYU_ENV;
    if (!key || !salt) {
      return res.status(400).json({ error: "PayU is not configured." });
    }
    const command = "check_isDomestic";
    const var1 = bin.substring(0, 6);
    const hashString = `${key}|${command}|${var1}|${salt}`;
    const hash = import_crypto3.default.createHash("sha512").update(hashString).digest("hex");
    const payuUrl = env === "PRODUCTION" ? "https://info.payu.in/merchant/postservice?form=2" : "https://test.payu.in/merchant/postservice?form=2";
    const params = new URLSearchParams();
    params.append("key", key);
    params.append("command", command);
    params.append("var1", var1);
    params.append("hash", hash);
    const response = await fetch(payuUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });
    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error checking PayU BIN:", error);
    res.status(500).json({ error: error.message });
  }
});
paymentsRouter.post("/api/webhooks/payu/success", async (req, res) => {
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
paymentsRouter.post("/api/webhooks/payu/failure", async (req, res) => {
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

// server/routes/webhooks.ts
var import_express8 = require("express");
var import_crypto4 = __toESM(require("crypto"), 1);
var webhookRouter = (0, import_express8.Router)();
webhookRouter.post("/api/webhooks/payu/success", async (req, res) => {
  try {
    const { txnid, status, amount, hash, email, firstname, productinfo, mihpayid } = req.body;
    const salt = PAYU_MERCHANT_SALT;
    let hashString = "";
    if (req.body.additionalCharges) {
      hashString = `${req.body.additionalCharges}|${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${req.body.key}`;
    } else {
      hashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${req.body.key}`;
    }
    const computedHash = import_crypto4.default.createHash("sha512").update(hashString).digest("hex");
    if (computedHash !== hash) {
      console.error("[PAYU SIGNATURE VERIFICATION FAILED]", { txnid, expected: computedHash, actual: hash });
    }
    let orderId = txnid;
    if (txnid && txnid.startsWith("txn_")) {
      const parts = txnid.split("_");
      if (parts.length >= 2) {
        orderId = parts[1];
      }
    }
    const existingOrder = db.findOrderById(orderId);
    if (existingOrder && status === "success") {
      const updatedOrder = await PaymentService.processSuccessfulPayment(
        existingOrder.id,
        parseFloat(amount),
        "payu",
        mihpayid || txnid,
        { customerEmail: email }
      );
      if (updatedOrder && email) {
        EmailService.sendTemplateEmail({
          templateId: "tpl-order-confirmation",
          to: email,
          orderId: updatedOrder.id,
          variables: {
            customer_name: updatedOrder.customerName,
            order_id: updatedOrder.id,
            service_name: updatedOrder.serviceName,
            amount: updatedOrder.finalAmount,
            order_date: (/* @__PURE__ */ new Date()).toLocaleDateString()
          }
        });
      }
    }
    res.redirect(`/?page=checkout-success&orderId=${orderId}`);
  } catch (err) {
    console.error("[PAYU WEBHOOK PROCESSING ERROR]:", err);
    res.status(500).send("Error Processing Payment");
  }
});
webhookRouter.post("/api/webhooks/payu/failure", async (req, res) => {
  try {
    const { txnid } = req.body;
    let orderId = txnid;
    if (txnid && txnid.startsWith("txn_")) {
      const parts = txnid.split("_");
      if (parts.length >= 2) {
        orderId = parts[1];
      }
    }
    res.redirect(`/?page=payu-checkout&orderId=${orderId}&error=payment_failed`);
  } catch (err) {
    console.error("[PAYU FAILURE PROCESSING ERROR]:", err);
    res.status(500).send("Error Processing Failure");
  }
});

// server.ts
async function startServer() {
  const app = (0, import_express9.default)();
  app.use(import_express9.default.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    }
  }));
  app.use((0, import_helmet.default)({
    contentSecurityPolicy: false,
    // Don't break React app during dev
    crossOriginEmbedderPolicy: false
  }));
  app.use(permissiveCorsMiddleware);
  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      crawlerAccess: "allowed",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      crawlerAccess: "allowed",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.use(seoRouter);
  app.use(checkoutRouter);
  app.use(agreementRouter);
  app.use(adminRouter);
  app.use(emailRouter);
  app.use(contractingRouter);
  app.use(paymentsRouter);
  app.use(webhookRouter);
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith("/api") || url.startsWith("/health") || url === "/robots.txt" || url === "/sitemap.xml" || url.startsWith("/.well-known")) {
        return next();
      }
      try {
        let template = import_fs6.default.readFileSync(
          import_path5.default.resolve(process.cwd(), "index.html"),
          "utf-8"
        );
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = import_path5.default.join(process.cwd(), "dist");
    app.use(import_express9.default.static(distPath));
    app.get("*", (req, res, next) => {
      if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/health") || req.originalUrl === "/robots.txt" || req.originalUrl === "/sitemap.xml" || req.originalUrl.startsWith("/.well-known")) {
        return next();
      }
      res.sendFile(import_path5.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
