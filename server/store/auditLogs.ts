// ─────────────────────────────────────────────────────────────
// Audit Logs Store — in-memory + file persistence.
// Stores MCC compliance consent records for payment dispute defense.
// ─────────────────────────────────────────────────────────────
import fs from 'fs';
import { AUDIT_LOG_FILE } from '../config';

export interface ComplianceAuditRecord {
  id: string;
  timestamp: string;
  clientIp: string;
  userAgent: string;
  location?: string;
  clientName?: string;
  clientEmail?: string;
  deliverableId?: string;
  mccAgreement: 'ACCEPTED';
  mcc7399Agreement?: 'ACCEPTED';
  disclosureText: string;
  serviceName: string;
  amount: number;
  currency: string;
  isTestMode?: boolean;
}

let auditLogsStore: ComplianceAuditRecord[] = [];

// Load existing records from disk on startup
try {
  if (fs.existsSync(AUDIT_LOG_FILE)) {
    const fileData = fs.readFileSync(AUDIT_LOG_FILE, 'utf-8');
    auditLogsStore = JSON.parse(fileData);
    console.log(
      `[AUDIT STORE] Loaded ${auditLogsStore.length} historical audit records from ${AUDIT_LOG_FILE}`
    );
  }
} catch (err) {
  console.error('[AUDIT STORE] Error reading audit_logs.json:', err);
  auditLogsStore = [];
}

export function saveAuditLogsToFile(): void {
  try {
    fs.writeFileSync(
      AUDIT_LOG_FILE,
      JSON.stringify(auditLogsStore, null, 2),
      'utf-8'
    );
  } catch (err) {
    console.error('[AUDIT STORE] Error persisting audit_logs.json:', err);
  }
}

export function addAuditRecord(record: ComplianceAuditRecord): void {
  auditLogsStore.unshift(record);
  if (auditLogsStore.length > 200) auditLogsStore.pop();
  saveAuditLogsToFile();
}

export function getAuditLogs(): ComplianceAuditRecord[] {
  return auditLogsStore;
}
