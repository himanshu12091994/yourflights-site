// ─────────────────────────────────────────────────────────────
// MCC Agreement & Compliance Audit Routes
// Records legal acceptance logs to ensure non-repudiation and chargeback defense.
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import { addAuditRecord, getAuditLogs, ComplianceAuditRecord } from '../store/auditLogs';
import { BRAND, MCC, STATEMENT_DESCRIPTOR } from '../config';

export const agreementRouter = Router();

// Dedicated API endpoint to record MCC compliance agreement audit trail
agreementRouter.post('/api/record-agreement', (req, res) => {
  try {
    const {
      serviceName,
      isAccepted,
      disclosureText,
      currency = 'usd',
      isTestMode = false,
    } = req.body;

    if (!isAccepted) {
      return res.status(400).json({
        error: 'MCC compliance disclosure agreement must be accepted',
      });
    }

    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown User-Agent';
    const timestamp = new Date().toISOString();
    const auditId = `AUD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const text =
      disclosureText ||
      "I acknowledge that I am purchasing a non-refundable custom consulting advisory and planning deliverable (MCC 8999 / 8999). Statement descriptor: 'YOUR FLIGHTS ADVISORY' or 'YOURFLIGHTSLLC.COM'.";

    const auditRecord: ComplianceAuditRecord = {
      id: auditId,
      timestamp,
      clientIp,
      userAgent,
      mccAgreement: 'ACCEPTED',
      disclosureText: text,
      serviceName: serviceName || 'Consulting Advisory Deliverable',
      amount: 150,
      currency: currency.toLowerCase(),
      isTestMode: Boolean(isTestMode),
    };

    addAuditRecord(auditRecord);

    console.log(
      `[MCC AUDIT RECORDED] ID: ${auditId} | IP: ${clientIp} | Timestamp: ${timestamp} | Service: ${serviceName} | Flag: ACCEPTED | TestMode: ${isTestMode}`
    );

    return res.json({
      success: true,
      message: 'MCC Agreement disclosure audit logged successfully',
      auditRecord,
    });
  } catch (err: any) {
    console.error('Error recording agreement audit:', err);
    res.status(500).json({ error: err.message });
  }
});

// Query Server Audit Logs Endpoint (Protected - Requires Admin Auth)
agreementRouter.get('/api/audit-logs', (req, res) => {
  const authHeader = req.headers.authorization;
  const authQuery = req.query.token as string;

  if (!authHeader && !authQuery) {
    return res.status(401).json({
      error:
        'Unauthorized. Admin authentication required to access compliance audit logs.',
    });
  }

  const logs = getAuditLogs();

  res.json({
    totalRecords: logs.length,
    brandDba: BRAND.DBA,
    legalEntityName: BRAND.LEGAL_ENTITY,
    primaryMcc: MCC.PRIMARY_LABEL,
    secondaryMcc: MCC.SECONDARY_LABEL,
    riskCategoryTier: 'Low-to-Standard Risk (Unrestricted)',
    licensingNeeded:
      'None (No ARC, IATA, or Seller of Consulting license required)',
    statementDescriptor: `${STATEMENT_DESCRIPTOR.FULL} (21 chars) OR ${STATEMENT_DESCRIPTOR.DOMAIN} (18 chars)`,
    auditLogs: logs,
  });
});
