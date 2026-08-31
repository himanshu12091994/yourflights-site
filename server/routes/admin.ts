// ─────────────────────────────────────────────────────────────
// YOUR FLIGHTS LLC — Comprehensive Admin & Back-Office REST API Router
// Full Operations, CRM, Orders, Payments, Delivery, Audit, & Reports
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { db } from '../store/db';
import { generateAuthToken } from '../auth';
import { requireAuth, requirePermission, AuthenticatedRequest } from '../middleware/auth';
import { OrderService } from '../services/orderService';
import { PaymentService } from '../services/paymentService';
import { DeliveryService } from '../services/deliveryService';
import { EmailService } from '../services/emailService';
import { AcknowledgementService } from '../services/acknowledgementService';
import { authRateLimiter } from '../middleware';
import { ADMIN_PASSWORD, SMTP } from '../config';
import { createMailServiciosr } from '../mail/transporter';
import { Order, OrderStatus, PaymentStatus } from '../types/domain';

export const adminRouter = Router();

// ─────────────────────────────────────────────────────────────
// 1. Authentication & Session Management
// ─────────────────────────────────────────────────────────────
adminRouter.post('/api/admin/auth/login', authRateLimiter, (req, res) => {
  const { password, email } = req.body;
  const inputPass = (password || '').trim();
  const envPass = (process.env.ADMIN_PASSWORD || ADMIN_PASSWORD || 'YourProjectsAdmin2026!').trim();
  const defaultPasswords = ['YourProjectsAdmin2026!', 'admin123', 'admin', 'YourProjects2026!'];
  
  const isDefaultEnv = defaultPasswords.includes(envPass);
  
  const isMatch = inputPass === envPass || (isDefaultEnv && defaultPasswords.includes(inputPass));

  if (isMatch) {
    const user = db.getUsers()[0] || {
      id: 'USR-ADMIN-001',
      name: 'Staff Administrator',
      email: email || 'support@yourflightsllc.com',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const token = generateAuthToken(user);

    db.insertAuditLog({
      id: `AUD-AUTH-${Date.now()}`,
      actor: user.email,
      actorRole: user.role,
      action: 'ADMIN_LOGIN_SUCCESS',
      entity: 'Auth',
      entityId: user.id,
      timestamp: new Date().toISOString(),
      clientIp: req.ip,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      requiresPasswordChange: isDefaultEnv,
      message: 'Authentication successful',
    });
  }

  db.insertAuditLog({
    id: `AUD-AUTH-FAIL-${Date.now()}`,
    actor: email || 'Unknown',
    action: 'ADMIN_LOGIN_FAILED',
    entity: 'Auth',
    entityId: 'failed_attempt',
    timestamp: new Date().toISOString(),
    clientIp: req.ip,
  });

  return res.status(401).json({
    success: false,
    error: 'Invalid master admin credentials.',
  });
});

adminRouter.post('/api/admin/login', authRateLimiter, (req, res) => {
  const { password } = req.body;
  const inputPass = (password || '').trim();
  const envPass = (process.env.ADMIN_PASSWORD || ADMIN_PASSWORD || 'YourProjectsAdmin2026!').trim();
  const defaultPasswords = ['YourProjectsAdmin2026!', 'admin123', 'admin', 'YourProjects2026!'];
  
  const isDefaultEnv = defaultPasswords.includes(envPass);
  
  const isMatch = inputPass === envPass || (isDefaultEnv && defaultPasswords.includes(inputPass));

  if (isMatch) {
    const user = db.getUsers()[0];
    const token = generateAuthToken(user);
    return res.json({
      success: true,
      token,
      requiresPasswordChange: isDefaultEnv,
      message: 'Admin authentication successful',
    });
  }
  return res.status(401).json({ success: false, error: 'Invalid admin password' });
});

adminRouter.post('/api/admin/forgot-password', authRateLimiter, async (req, res) => {
  try {
    const transporter = await createMailServiciosr();
    const adminEmail = SMTP.USER;
    const currentPass = process.env.ADMIN_PASSWORD || ADMIN_PASSWORD || 'YourProjectsAdmin2026!';

    await transporter.sendMail({
      from: SMTP.FROM,
      to: adminEmail,
      subject: 'Master Admin Password Recovery — Your Flights LLC',
      text: `Your current staff password is: ${currentPass}\n\nIf you did not request this, you can disregard this email.`,
      html: `<p>Your current staff password is:</p><h3>${currentPass}</h3><p>MCC 8999 / 8999 Security System</p>`,
    });

    res.json({ success: true, message: 'Password recovery email dispatched.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to dispatch recovery email' });
  }
});

adminRouter.post('/api/admin/change-password', requireAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const masterPassword = process.env.ADMIN_PASSWORD || ADMIN_PASSWORD || 'YourProjectsAdmin2026!';

    if (currentPassword !== masterPassword) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters.' });
    }

    process.env.ADMIN_PASSWORD = newPassword;

    try {
      const envPath = path.join(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        let envFile = fs.readFileSync(envPath, 'utf8');
        if (envFile.includes('ADMIN_PASSWORD=')) {
          envFile = envFile.replace(/(ADMIN_PASSWORD=).*/g, `$1${newPassword}`);
        } else {
          envFile += `\nADMIN_PASSWORD=${newPassword}\n`;
        }
        fs.writeFileSync(envPath, envFile);
      }
    } catch (fsErr) {
      console.warn('Could not write to .env, in-memory updated.');
    }

    res.json({ success: true, message: 'Admin password updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Server error updating password' });
  }
});

// ─────────────────────────────────────────────────────────────
// 2. Executive Dashboard Overview Metrics
// ─────────────────────────────────────────────────────────────
adminRouter.get('/api/admin/dashboard', requireAuth, (req, res) => {
  const orders = db.getOrders();
  const payments = db.getPayments();
  const customers = db.getCustomers();
  const acks = db.getAcknowledgements();
  const auditLogs = db.getAuditLogs();

  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const totalOutstanding = orders.reduce((acc, curr) => acc + (curr.remainingAmount || 0), 0);

  // Time-based calculations
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000).getTime();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 3600 * 1000).getTime();

  const todayRevenue = orders
    .filter((o) => o.createdAt.slice(0, 10) === todayStr)
    .reduce((acc, curr) => acc + curr.amountPaid, 0);

  const weeklyRevenue = orders
    .filter((o) => new Date(o.createdAt).getTime() >= sevenDaysAgo)
    .reduce((acc, curr) => acc + curr.amountPaid, 0);

  const monthlyRevenue = orders
    .filter((o) => new Date(o.createdAt).getTime() >= thirtyDaysAgo)
    .reduce((acc, curr) => acc + curr.amountPaid, 0);

  const totalCompleted = orders.filter((o) => o.status === 'Completed' || o.status === 'Delivered').length;
  const pendingCount = orders.filter(
    (o) => o.status !== 'Completed' && o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;

  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const awaitingAckCount = orders.filter((o) => o.status === 'Acknowledgement Pending' || (o.status === 'Delivered' && !acks.find(a => a.orderId === o.id))).length;

  // Deliverables mapping for backward compatibility
  const legacyDeliverables = orders.map((o) => ({
    id: o.id,
    orderRef: o.orderRef,
    clientName: o.customerName,
    clientEmail: o.customerEmail,
    serviceName: o.serviceName,
    amount: o.finalAmount,
    currency: o.currency,
    status: o.status === 'Delivered' || o.status === 'Completed' ? 'Fulfilled / Delivered' : o.status === 'Cancelled' ? 'Cancelled' : o.status === 'Processing' ? 'In Research' : o.status === 'Ready for Delivery' ? 'Draft Strategy Review' : 'Pending Discovery Call',
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    notes: o.customerNotes || o.internalNotes || '',
    assignedAdvisor: o.assignedAdvisor,
    isAcknowledged: Boolean(acks.find((a) => a.orderId === o.id)),
  }));

  res.json({
    success: true,
    merchant: 'Your Flights LLC — Operations & Compliance Hub (MCC 8999 / 8999)',
    stats: {
      totalRevenue: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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
      totalCustomers: customers.length,
    },
    recentOrders: orders.slice(0, 10),
    recentPayments: payments.slice(0, 10),
    deliverables: legacyDeliverables,
    orders,
    customers,
    auditLogs,
    acknowledgements: acks,
  });
});

// ─────────────────────────────────────────────────────────────
// 3. Orders Management Endpoints
// ─────────────────────────────────────────────────────────────
adminRouter.get('/api/admin/orders', requireAuth, (req, res) => {
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
    sortOrder,
  } = req.query;

  const result = OrderService.listOrders({
    search: search as string,
    status: status as string,
    paymentStatus: paymentStatus as string,
    serviceCategory: serviceCategory as string,
    assignedAdvisor: assignedAdvisor as string,
    startDate: startDate as string,
    endDate: endDate as string,
    page: page ? parseInt(page as string, 10) : 1,
    limit: limit ? parseInt(limit as string, 10) : 50,
    sortBy: sortBy as any,
    sortOrder: sortOrder as any,
  });

  res.json({ success: true, ...result });
});

adminRouter.get('/api/admin/orders/:id', requireAuth, (req, res) => {
  const order = db.findOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
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
    emailLogs,
  });
});

adminRouter.post('/api/admin/orders', requireAuth, (req, res) => {
  try {
    const { clientName, clientEmail, customerName, customerEmail, serviceName, amount, assignedAdvisor, notes, customerNotes, internalNotes } = req.body;

    const newOrder = OrderService.createOrder({
      customerName: customerName || clientName || 'Valued Client',
      customerEmail: customerEmail || clientEmail || 'client@example.com',
      serviceName: serviceName || 'Custom Day-by-Day Strategy Planning Strategy',
      amount: Number(amount) || 150,
      assignedAdvisor: assignedAdvisor || 'Sarah Jenkins (Senior Strategist)',
      customerNotes: customerNotes || notes,
      internalNotes,
      actorName: 'Staff Admin',
    });

    res.json({
      success: true,
      message: 'New consultation order created successfully',
      order: newOrder,
      deliverable: newOrder, // backward compat
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

adminRouter.post('/api/admin/deliverables/create', requireAuth, (req, res) => {
  // Alias for /api/admin/orders
  const { clientName, clientEmail, serviceName, amount, assignedAdvisor, notes } = req.body;
  const newOrder = OrderService.createOrder({
    customerName: clientName || 'Valued Client',
    customerEmail: clientEmail || 'client@example.com',
    serviceName: serviceName || 'Custom Day-by-Day Strategy Planning Strategy',
    amount: Number(amount) || 150,
    assignedAdvisor,
    internalNotes: notes,
    actorName: 'Staff Admin',
  });

  res.json({ success: true, deliverable: newOrder });
});

adminRouter.post('/api/admin/orders/:id/status', requireAuth, (req, res) => {
  try {
    const { status, reason } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const updated = OrderService.transitionStatus(
      req.params.id,
      status as OrderStatus,
      'Staff Admin',
      reason
    );

    res.json({ success: true, order: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

adminRouter.post('/api/admin/deliverables/update', requireAuth, (req, res) => {
  try {
    const { id, status, notes, assignedAdvisor } = req.body;
    const order = db.findOrderById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (status && status !== order.status) {
      OrderService.transitionStatus(order.id, status as OrderStatus, 'Staff Admin');
    }

    const updated = db.updateOrder(order.id, {
      internalNotes: notes !== undefined ? notes : order.internalNotes,
      assignedAdvisor: assignedAdvisor !== undefined ? assignedAdvisor : order.assignedAdvisor,
    });

    res.json({ success: true, deliverable: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

adminRouter.post('/api/admin/orders/:id/financials', requireAuth, (req, res) => {
  try {
    const { finalAmount, discount = 0, reason } = req.body;
    if (finalAmount === undefined || !reason) {
      return res.status(400).json({ error: 'finalAmount and mandatory reason are required' });
    }

    const updated = OrderService.adjustFinancials(
      req.params.id,
      Number(finalAmount),
      Number(discount),
      'Staff Admin',
      reason
    );

    res.json({ success: true, order: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

adminRouter.post('/api/admin/orders/:id/send-email', requireAuth, async (req, res) => {
  try {
    const { type, subject, message, paymentUrl, paymentAmount } = req.body;
    const order = db.findOrderById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    const result = await EmailService.sendOrderActionEmail(order, type, { 
      subject, 
      message, 
      paymentUrl,
      paymentAmount 
    });

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error || 'Failed to dispatch email' });
    }

    res.json({
      success: true,
      message: `Email dispatched to ${order.customerEmail}`,
      messageId: result.messageId,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/orders/:id — Update customer contact info & notes
adminRouter.patch('/api/admin/orders/:id', requireAuth, (req, res) => {
  try {
    const { 
      customerName, customerEmail, customerPhone, internalNotes, 
      serviceName, finalAmount, discount,
      paymentStatus, amountPaid
    } = req.body;
    const order = db.findOrderById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

    const updates: Partial<Order> = {};
    if (customerName !== undefined) updates.customerName = customerName;
    if (customerEmail !== undefined) updates.customerEmail = customerEmail;
    if (customerPhone !== undefined) updates.customerPhone = customerPhone;
    if (internalNotes !== undefined) updates.internalNotes = internalNotes;
    if (serviceName !== undefined) updates.serviceName = serviceName;
    if (finalAmount !== undefined) updates.finalAmount = Number(finalAmount);
    if (discount !== undefined) updates.discount = Number(discount);
    if (paymentStatus !== undefined) updates.paymentStatus = paymentStatus;
    
    // Auto-sync remainingAmount and paymentStatus based on amounts
    const currentFinalAmount = finalAmount !== undefined ? Number(finalAmount) : order.finalAmount;
    const currentAmountPaid = amountPaid !== undefined ? Number(amountPaid) : order.amountPaid;
    
    if (amountPaid !== undefined || finalAmount !== undefined) {
      updates.amountPaid = currentAmountPaid;
      updates.remainingAmount = Math.max(0, currentFinalAmount - currentAmountPaid);
      
      // Auto-flag as manual entry if amountPaid was manually provided in the patch
      if (amountPaid !== undefined && currentAmountPaid > 0) {
        updates.paymentMethod = 'manual';
      }
      
      // Enforce status auto-sync if we aren't explicitly marking as refunded/cancelled
      if (updates.paymentStatus !== 'Refunded' && updates.paymentStatus !== 'Cancelled') {
        if (updates.remainingAmount === 0) {
          updates.paymentStatus = 'Successful';
        } else {
          updates.paymentStatus = 'Pending';
        }
      }
    }

    const updated = db.updateOrder(order.id, updates);

    db.insertAuditLog({
      id: `AUD-PATCH-${Date.now()}`,
      actor: 'Staff Admin',
      action: 'ORDER_UPDATED',
      entity: 'Order',
      entityId: order.id,
      timestamp: new Date().toISOString(),
      newValues: updates,
    });

    res.json({ success: true, order: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// 4. Customer CRM Endpoints
// ─────────────────────────────────────────────────────────────
adminRouter.get('/api/admin/customers', requireAuth, (_req, res) => {
  const customers = db.getCustomers();
  res.json({ success: true, total: customers.length, customers });
});

adminRouter.get('/api/admin/customers/:id', requireAuth, (req, res) => {
  const customer = db.findCustomerById(req.params.id);
  if (!customer) return res.status(404).json({ success: false, error: 'Customer not found' });

  const orders = db.getOrders().filter((o) => o.customerId === customer.id);
  const acks = db.getAcknowledgements().filter((a) => a.customerId === customer.id);

  res.json({
    success: true,
    customer,
    orders,
    acknowledgements: acks,
  });
});

// ─────────────────────────────────────────────────────────────
// 5. Payment Management Endpoints
// ─────────────────────────────────────────────────────────────
adminRouter.get('/api/admin/payments', requireAuth, (_req, res) => {
  const payments = db.getPayments();
  res.json({ success: true, total: payments.length, payments });
});

adminRouter.post('/api/admin/payments/create-link', requireAuth, async (req, res) => {
  const { orderId, amount, title } = req.body;
  if (!orderId) return res.status(400).json({ error: 'orderId is required' });

  const result = await PaymentService.generatePaymentLink(
    orderId,
    Number(amount),
    'Staff Admin',
    title
  );

  if (!result.success) {
    return res.status(500).json({ success: false, error: result.error });
  }
  res.json(result);
});

adminRouter.post('/api/admin/payments/refund', requireAuth, async (req, res) => {
  const { orderId, amount, reason } = req.body;
  if (!orderId || !amount || !reason) {
    return res.status(400).json({ error: 'orderId, amount, and reason are required' });
  }

  const result = await PaymentService.issueRefund(
    orderId,
    Number(amount),
    'Staff Admin',
    reason
  );

  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }
  res.json({ success: true, message: `Refund of $${amount} recorded.` });
});

// ─────────────────────────────────────────────────────────────
// 6. Service Delivery & PDF Dispatch
// ─────────────────────────────────────────────────────────────
adminRouter.post('/api/admin/deliveries/send', requireAuth, async (req, res) => {
  try {
    const { deliverableId, orderId, clientEmail, clientName, inclusions, terms } = req.body;
    const targetId = orderId || deliverableId;

    let order = db.findOrderById(targetId);
    if (!order) return res.status(404).json({ error: 'Order record not found' });

    // Allow admin to update the email at dispatch time
    if (clientEmail && clientEmail !== order.customerEmail) {
      order = db.updateOrder(order.id, { customerEmail: clientEmail });
    }

    // Prepare Delivery
    const delivery = DeliveryService.createOrUpdateDelivery({
      orderId: order.id,
      inclusions: inclusions || 'Custom day-by-day business strategy & research report.',
      terms: terms || 'MCC 8999 / 8999 Terms accepted.',
      actorName: 'Staff Admin',
    });

    // Generate PDF
    const pdfBuffer = await DeliveryService.generateDeliveryPDF(delivery, order);

    // Get signed acknowledgment URL
    const ackUrl = DeliveryService.getSignedAcknowledgementUrl(order.id, delivery.id);

    // Dispatch Email
    await EmailService.sendServiceDeliveryEmail(order, pdfBuffer, ackUrl);

    // Update order status to Delivered
    OrderService.transitionStatus(order.id, 'Delivered', 'Staff Admin', 'Service delivery PDF dispatched via email');

    res.json({
      success: true,
      message: `Official delivery package sent to ${order.customerEmail}`,
      deliveryId: delivery.id,
      acknowledgementUrl: ackUrl,
    });
  } catch (err: any) {
    console.error('[DELIVERY SEND ERROR]:', err);
    res.status(500).json({ error: err.message || 'Failed to generate PDF and dispatch delivery' });
  }
});

// Legacy contracting route alias
adminRouter.post('/api/admin/send-contracting-details', requireAuth, async (req, res) => {
  const { deliverableId, inclusions, terms } = req.body;
  const order = db.findOrderById(deliverableId);
  if (!order) return res.status(404).json({ error: 'Deliverable not found' });

  const delivery = DeliveryService.createOrUpdateDelivery({
    orderId: order.id,
    inclusions: inclusions || 'Advisory service inclusions.',
    terms: terms || 'MCC 8999 / 8999 Terms accepted.',
    actorName: 'Staff Admin',
  });

  const pdfBuffer = await DeliveryService.generateDeliveryPDF(delivery, order);
  const ackUrl = DeliveryService.getSignedAcknowledgementUrl(order.id, delivery.id);
  await EmailService.sendServiceDeliveryEmail(order, pdfBuffer, ackUrl);
  OrderService.transitionStatus(order.id, 'Delivered', 'Staff Admin');

  res.json({ success: true, message: 'Contracting details dispatched.' });
});

// ─────────────────────────────────────────────────────────────
// 7. Client Acknowledgement Endpoints (Public & Secure)
// ─────────────────────────────────────────────────────────────
adminRouter.get('/api/client/ack-verify/:token', (req, res) => {
  const result = AcknowledgementService.verifyToken(req.params.token);
  if (!result.valid) {
    return res.status(400).json({ success: false, error: result.error });
  }
  res.json({
    success: true,
    order: result.order,
    deliveryId: result.deliveryId,
    alreadyAcknowledged: result.alreadyAcknowledged,
  });
});

adminRouter.post('/api/client/acknowledge', async (req, res) => {
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Web Browser';

  const result = await AcknowledgementService.recordAcknowledgement({
    token: req.body.token,
    orderId: req.body.orderId || req.body.deliverableId,
    clientIp,
    userAgent,
    browser: req.body.browser,
    os: req.body.os,
    deviceType: req.body.deviceType,
  });

  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error });
  }

  res.json({ success: true, message: 'Official receipt and terms acknowledged securely.' });
});

// ─────────────────────────────────────────────────────────────
// 8. Notifications, Templates & Audit Endpoints
// ─────────────────────────────────────────────────────────────
adminRouter.get('/api/admin/notifications', requireAuth, (_req, res) => {
  const notifs = db.getNotifications();
  const unreadCount = notifs.filter((n) => !n.read).length;
  res.json({ success: true, unreadCount, notifications: notifs });
});

adminRouter.post('/api/admin/notifications/mark-read', requireAuth, (req, res) => {
  const { id } = req.body;
  if (id) db.markNotificationAsRead(id);
  else db.markAllNotificationsAsRead();
  res.json({ success: true });
});

adminRouter.get('/api/admin/templates', requireAuth, (_req, res) => {
  res.json({ success: true, templates: db.getEmailTemplates() });
});

adminRouter.get('/api/admin/email-logs', requireAuth, (_req, res) => {
  res.json({ success: true, logs: db.getEmailLogs() });
});

adminRouter.get('/api/admin/audit-logs', requireAuth, (_req, res) => {
  res.json({ success: true, logs: db.getAuditLogs() });
});

adminRouter.get('/api/admin/acknowledgements', requireAuth, (_req, res) => {
  res.json({ success: true, acknowledgements: db.getAcknowledgements() });
});
