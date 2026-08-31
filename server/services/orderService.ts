// ─────────────────────────────────────────────────────────────
// YOUR FLIGHTS LLC — Order & State Machine Service
// Manages complete order lifecycle, state transitions, and audit records.
// ─────────────────────────────────────────────────────────────
import { db } from '../store/db';
import { Order, OrderStatus, PaymentStatus } from '../types/domain';

export interface OrderFilterOptions {
  search?: string;
  status?: string;
  paymentStatus?: string;
  serviceCategory?: string;
  assignedAdvisor?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'finalAmount' | 'customerName' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export class OrderService {
  public static listOrders(options: OrderFilterOptions = {}) {
    const {
      search = '',
      status = 'ALL',
      paymentStatus = 'ALL',
      serviceCategory = 'ALL',
      assignedAdvisor = 'ALL',
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    let orders = db.getOrders();

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      orders = orders.filter((o) => {
        return (
          o.id.toLowerCase().includes(q) ||
          o.orderRef.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          (o.customerPhone && o.customerPhone.includes(q)) ||
          o.serviceName.toLowerCase().includes(q) ||
          (o.assignedAdvisor && o.assignedAdvisor.toLowerCase().includes(q))
        );
      });
    }

    // 2. Status Filter
    if (status !== 'ALL') {
      orders = orders.filter((o) => o.status === status);
    }

    // 3. Payment Status Filter
    if (paymentStatus !== 'ALL') {
      orders = orders.filter((o) => o.paymentStatus === paymentStatus);
    }

    // 4. Service Category Filter
    if (serviceCategory !== 'ALL') {
      orders = orders.filter((o) => o.serviceCategory === serviceCategory);
    }

    // 5. Advisor Filter
    if (assignedAdvisor !== 'ALL') {
      orders = orders.filter((o) => o.assignedAdvisor === assignedAdvisor);
    }

    // 6. Date Range
    if (startDate) {
      const start = new Date(startDate).getTime();
      orders = orders.filter((o) => new Date(o.createdAt).getTime() >= start);
    }
    if (endDate) {
      const end = new Date(endDate).getTime();
      orders = orders.filter((o) => new Date(o.createdAt).getTime() <= end);
    }

    // 7. Sorting
    orders.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'finalAmount') {
        comparison = a.finalAmount - b.finalAmount;
      } else if (sortBy === 'customerName') {
        comparison = a.customerName.localeCompare(b.customerName);
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
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
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static getOrderById(id: string): Order | null {
    return db.findOrderById(id) || null;
  }

  public static createOrder(payload: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    customerCountry?: string;
    serviceName: string;
    amount: number;
    assignedAdvisor?: string;
    customerNotes?: string;
    internalNotes?: string;
    actorName?: string;
  }): Order {
    const customer = db.insertOrUpdateCustomer({
      name: payload.customerName,
      email: payload.customerEmail,
      phone: payload.customerPhone,
      country: payload.customerCountry,
    });

    const orderYear = new Date().getFullYear();
    const count = db.getOrders().length + 1;
    const orderId = `YF-${orderYear}-${String(count).padStart(6, '0')}`;
    const orderRef = `YF-${Math.floor(100000 + Math.random() * 900000)}`;

    const amount = Number(payload.amount) || 150;

    let serviceCategory: Order['serviceCategory'] = 'ITINERARY_PLANNING';
    if (payload.serviceName.toLowerCase().includes('research') || amount === 75) {
      serviceCategory = 'DESTINATION_RESEARCH';
    } else if (payload.serviceName.toLowerCase().includes('prep') || amount === 50) {
      serviceCategory = 'TRAVEL_PREP';
    }

    const newOrder: Order = {
      id: orderId,
      orderRef,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: payload.customerPhone,
      customerCountry: payload.customerCountry,
      serviceId: amount === 75 ? 'SVC-RESEARCH-75' : amount === 50 ? 'SVC-PREP-50' : 'SVC-ITINERARY-150',
      serviceName: payload.serviceName,
      serviceCategory,
      status: 'New',
      originalAmount: amount,
      discount: 0,
      finalAmount: amount,
      amountPaid: 0,
      remainingAmount: amount,
      currency: 'usd',
      paymentStatus: 'Pending',
      assignedAdvisor: payload.assignedAdvisor || 'Sarah Jenkins (Senior Strategist)',
      customerNotes: payload.customerNotes,
      internalNotes: payload.internalNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.insertOrder(newOrder);

    // Record initial status history
    db.insertStatusHistory({
      id: `HIST-${Date.now()}`,
      orderId: newOrder.id,
      previousStatus: 'New',
      newStatus: 'New',
      changedBy: payload.actorName || 'System',
      reason: 'Order created via intake',
      timestamp: new Date().toISOString(),
    });

    // Record system audit log
    db.insertAuditLog({
      id: `AUD-ORD-${Date.now()}`,
      actor: payload.actorName || 'System',
      action: 'ORDER_CREATED',
      entity: 'Order',
      entityId: newOrder.id,
      timestamp: new Date().toISOString(),
      newValues: { orderId: newOrder.id, amount, customer: customer.email },
    });

    // Send admin notification
    db.insertNotification({
      id: `NOTIF-${Date.now()}`,
      title: 'New Client Intake Order',
      message: `Order ${newOrder.id} created for ${newOrder.customerName} ($${newOrder.finalAmount} USD)`,
      type: 'ORDER',
      read: false,
      link: `/admin?orderId=${newOrder.id}`,
      createdAt: new Date().toISOString(),
    });

    return newOrder;
  }

  public static transitionStatus(
    orderId: string,
    newStatus: OrderStatus,
    actorName: string,
    reason?: string
  ): Order {
    const order = db.findOrderById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    const previousStatus = order.status;
    if (previousStatus === newStatus) return order;

    const updated = db.updateOrder(order.id, { status: newStatus });
    if (!updated) throw new Error(`Failed to update order ${orderId}`);

    // Insert immutable status history record
    db.insertStatusHistory({
      id: `HIST-${Date.now()}`,
      orderId: order.id,
      previousStatus,
      newStatus,
      changedBy: actorName,
      reason: reason || `Status updated to ${newStatus}`,
      timestamp: new Date().toISOString(),
    });

    // Insert audit log
    db.insertAuditLog({
      id: `AUD-STAT-${Date.now()}`,
      actor: actorName,
      action: 'ORDER_STATUS_CHANGED',
      entity: 'Order',
      entityId: order.id,
      timestamp: new Date().toISOString(),
      oldValues: { status: previousStatus },
      newValues: { status: newStatus },
      reason,
    });

    return updated;
  }

  public static adjustFinancials(
    orderId: string,
    newFinalAmount: number,
    newDiscount: number,
    actorName: string,
    reason: string
  ): Order {
    if (!reason || reason.trim().length < 4) {
      throw new Error('A valid reason is required for financial adjustments');
    }

    const order = db.findOrderById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const previousAmount = order.finalAmount;
    const previousDiscount = order.discount;

    const remainingAmount = Math.max(0, newFinalAmount - order.amountPaid);
    let paymentStatus: PaymentStatus = order.paymentStatus;
    if (order.amountPaid >= newFinalAmount && newFinalAmount > 0) {
      paymentStatus = 'Successful';
    } else if (order.amountPaid > 0 && order.amountPaid < newFinalAmount) {
      paymentStatus = 'Partially Refunded';
    }

    const updated = db.updateOrder(order.id, {
      finalAmount: newFinalAmount,
      discount: newDiscount,
      remainingAmount,
      paymentStatus,
    });

    if (!updated) throw new Error('Failed to update financial values');

    // Immutable financial audit
    db.insertFinancialAudit({
      id: `FIN-AUD-${Date.now()}`,
      orderId: order.id,
      previousAmount,
      newAmount: newFinalAmount,
      previousDiscount,
      newDiscount,
      changedBy: actorName,
      reason,
      timestamp: new Date().toISOString(),
    });

    // General Audit Log
    db.insertAuditLog({
      id: `AUD-FIN-${Date.now()}`,
      actor: actorName,
      action: 'FINANCIAL_ADJUSTMENT',
      entity: 'Order',
      entityId: order.id,
      timestamp: new Date().toISOString(),
      oldValues: { amount: previousAmount, discount: previousDiscount },
      newValues: { amount: newFinalAmount, discount: newDiscount },
      reason,
    });

    return updated;
  }
}
