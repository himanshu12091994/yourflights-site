// ─────────────────────────────────────────────────────────────
// Deliverables Store — in-memory + file persistence.
// Tracks client consulting advisory fulfillment orders and statuses.
// ─────────────────────────────────────────────────────────────
import fs from 'fs';
import { DELIVERABLES_FILE } from '../config';

export interface AdvisoryDeliverable {
  id: string;
  orderRef: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  amount: number;
  currency: string;
  status:
    | 'Pending Discovery Call'
    | 'In Research'
    | 'Draft Strategy Review'
    | 'Fulfilled / Delivered'
    | 'Cancelled';
  createdAt: string;
  updatedAt: string;
  notes: string;
  assignedAdvisor: string;
  isAcknowledged?: boolean;
  acknowledgmentData?: {
    ip: string;
    userAgent: string;
    location: string;
    timestamp: string;
  };
  sentEmailHtml?: string;
}

let deliverablesStore: AdvisoryDeliverable[] = [];

// Default initial seeds if deliverables.json does not exist
const initialDeliverables: AdvisoryDeliverable[] = [
  {
    id: 'DEL-2026-101',
    orderRef: 'YF-892104',
    clientName: 'Alexander Wright',
    clientEmail: 'alex.wright@example.com',
    serviceName: 'Custom Day-by-Day Strategy Planning Strategy',
    amount: 150,
    currency: 'usd',
    status: 'In Research',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: 'Requested 10-day Japan cultural tour with bullet train routing and ryokan recommendations.',
    assignedAdvisor: 'Sarah Jenkins (Senior Strategist)',
  },
  {
    id: 'DEL-2026-102',
    orderRef: 'YF-774192',
    clientName: 'Elena Rostova',
    clientEmail: 'elena.r@example.com',
    serviceName: 'Destination Intelligence & Research Report',
    amount: 75,
    currency: 'usd',
    status: 'Pending Discovery Call',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    notes: 'Awaiting discovery call regarding Amalfi Coast boat charter options & seasonal logistics.',
    assignedAdvisor: 'Unassigned',
  },
  {
    id: 'DEL-2026-103',
    orderRef: 'YF-612049',
    clientName: 'Marcus Vance',
    clientEmail: 'm.vance@example.com',
    serviceName: 'Pre-Departure Strategy Prep & Safety Advisory',
    amount: 50,
    currency: 'usd',
    status: 'Fulfilled / Delivered',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    notes: 'PDF safety guide and entry visa advisory transmitted via email. Client confirmed receipt.',
    assignedAdvisor: 'David Chen (Consulting Safety Lead)',
  },
];

try {
  if (fs.existsSync(DELIVERABLES_FILE)) {
    const fileData = fs.readFileSync(DELIVERABLES_FILE, 'utf-8');
    deliverablesStore = JSON.parse(fileData);
    console.log(
      `[DELIVERABLES STORE] Loaded ${deliverablesStore.length} records from ${DELIVERABLES_FILE}`
    );
  } else {
    deliverablesStore = initialDeliverables;
    fs.writeFileSync(
      DELIVERABLES_FILE,
      JSON.stringify(deliverablesStore, null, 2),
      'utf-8'
    );
  }
} catch (err) {
  console.error('[DELIVERABLES STORE] Error reading deliverables.json:', err);
  deliverablesStore = initialDeliverables;
}

export function saveDeliverablesToFile(): void {
  try {
    fs.writeFileSync(
      DELIVERABLES_FILE,
      JSON.stringify(deliverablesStore, null, 2),
      'utf-8'
    );
  } catch (err) {
    console.error('[DELIVERABLES STORE] Error persisting deliverables.json:', err);
  }
}

export function getDeliverables(): AdvisoryDeliverable[] {
  return deliverablesStore;
}

export function addDeliverable(item: AdvisoryDeliverable): void {
  deliverablesStore.unshift(item);
  saveDeliverablesToFile();
}

export function findDeliverableByOrderRef(orderRef: string): AdvisoryDeliverable | undefined {
  return deliverablesStore.find((d) => d.orderRef === orderRef);
}

export function findDeliverableById(id: string): AdvisoryDeliverable | undefined {
  return deliverablesStore.find((d) => d.id === id);
}

export function updateDeliverable(id: string, updates: Partial<AdvisoryDeliverable>): boolean {
  const index = deliverablesStore.findIndex(d => d.id === id);
  if (index !== -1) {
    deliverablesStore[index] = { ...deliverablesStore[index], ...updates, updatedAt: new Date().toISOString() };
    saveDeliverablesToFile();
    return true;
  }
  return false;
}
