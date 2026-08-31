// ─────────────────────────────────────────────────────────────
// YOUR FLIGHTS LLC — Service Delivery & PDF Engine
// Dynamic variable interpolation & PDF compilation.
// ─────────────────────────────────────────────────────────────
import PDFDocument from 'pdfkit';
import { db } from '../store/db';
import { ServiceDelivery, Order } from '../types/domain';
import { generateSignedAcknowledgementToken } from '../auth';
import { APP_URL } from '../config';

export class DeliveryService {
  public static interpolateVariables(text: string, variables: Record<string, string | number>): string {
    let result = text;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, String(value));
    }
    return result;
  }

  public static createOrUpdateDelivery(payload: {
    orderId: string;
    inclusions: string;
    terms: string;
    notes?: string;
    actorName: string;
  }): ServiceDelivery {
    const order = db.findOrderById(payload.orderId);
    if (!order) throw new Error(`Order ${payload.orderId} not found`);

    let existing = db.getDeliveries().find((d) => d.orderId === order.id);
    const version = existing ? existing.version + 1 : 1;
    const deliveryId = existing ? existing.id : `DEL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const delivery: ServiceDelivery = {
      id: deliveryId,
      orderId: order.id,
      customerId: order.customerId,
      version,
      inclusions: payload.inclusions,
      terms: payload.terms,
      notes: payload.notes,
      status: 'Ready',
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existing) {
      db.updateDelivery(existing.id, delivery);
    } else {
      db.insertDelivery(delivery);
    }

    db.insertAuditLog({
      id: `AUD-DEL-${Date.now()}`,
      actor: payload.actorName,
      action: 'SERVICE_DELIVERY_PREPARED',
      entity: 'ServiceDelivery',
      entityId: delivery.id,
      timestamp: new Date().toISOString(),
      newValues: { orderId: order.id, version },
    });

    return delivery;
  }

  public static async generateDeliveryPDF(delivery: ServiceDelivery, order: Order): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Styling Colors
        const primaryColor = '#0f172a'; // Deep Navy
        const accentColor = '#10b981'; // Emerald Green
        const secondaryColor = '#1e3a8a'; // Blue 900
        const textColor = '#334155'; // Slate 700
        const lightBg = '#f8fafc'; // Slate 50
        const borderColor = '#e2e8f0'; // Slate 200

        // ==========================================
        // 1. Full-Page Corporate Cover Sheet
        // ==========================================
        doc.rect(0, 0, doc.page.width, doc.page.height).fill(primaryColor);
        doc.rect(0, doc.page.height - 220, doc.page.width, 220).fill(secondaryColor);
        
        // Brand Mark
        doc.fillColor(accentColor).fontSize(14).font('Helvetica-Bold').text('CONFIDENTIAL & PROPRIETARY', 50, 80, { characterSpacing: 2 });
        
        // Massive Title
        doc.fillColor('#ffffff').fontSize(46).font('Helvetica-Bold').text('Consulting', 50, 220);
        doc.fillColor(accentColor).fontSize(46).font('Helvetica-Bold').text('Advisory Report', 50, 265);
        
        doc.fillColor('#94a3b8').fontSize(16).font('Helvetica').text(order.serviceName, 50, 325, { width: doc.page.width - 100 });
        
        // Client Details on Cover
        doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold').text('PREPARED FOR:', 50, doc.page.height - 300);
        doc.fillColor('#94a3b8').fontSize(14).font('Helvetica').text(order.customerName.toUpperCase(), 50, doc.page.height - 280);
        
        // Footer on Cover
        doc.fillColor('#ffffff').fontSize(28).font('Helvetica-Bold').text('YOUR FLIGHTS LLC', 50, doc.page.height - 140);
        doc.fillColor('#cbd5e1').fontSize(11).font('Helvetica').text('Travel Advisory & Market Research', 50, doc.page.height - 105);
        doc.fillColor('#94a3b8').fontSize(9).text(`DATE: ${new Date().toLocaleDateString()}  |  REF: ${order.id}  |  MCC 8999`, 50, doc.page.height - 70);

        // ==========================================
        // 2. Content Page Header
        // ==========================================
        doc.addPage();
        const headerHeight = 110;
        doc.rect(0, 0, doc.page.width, headerHeight).fill(primaryColor);
        doc.rect(0, headerHeight - 4, doc.page.width, 4).fill(accentColor);
        
        doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text('YOUR FLIGHTS LLC', 50, 35, { characterSpacing: 1 });
        doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold').text('OFFICIAL DELIVERABLE', doc.page.width - 200, 40, { align: 'right' });
        doc.fillColor('#cbd5e1').font('Helvetica').text(`Ref: ${order.id}`, doc.page.width - 200, 55, { align: 'right' });
        doc.text(new Date().toLocaleDateString(), doc.page.width - 200, 70, { align: 'right' });

        doc.moveDown(2);

        // ==========================================
        // 3. Structured Data Cards (Rounded Rects)
        // ==========================================
        const startY = 140;
        
        // Client Card
        doc.roundedRect(50, startY, doc.page.width / 2 - 60, 80, 8).fillAndStroke(lightBg, borderColor);
        doc.fillColor(secondaryColor).fontSize(10).font('Helvetica-Bold').text('CLIENT DETAILS', 65, startY + 12);
        doc.rect(65, startY + 28, 30, 2).fill(accentColor); 
        doc.fillColor(textColor).fontSize(10).font('Helvetica-Bold').text(order.customerName, 65, startY + 38);
        doc.font('Helvetica').text(order.customerEmail, 65, startY + 53);

        // Order Card
        doc.roundedRect(doc.page.width / 2 + 10, startY, doc.page.width / 2 - 60, 80, 8).fillAndStroke(lightBg, borderColor);
        doc.fillColor(secondaryColor).fontSize(10).font('Helvetica-Bold').text('ORDER REFERENCE', doc.page.width / 2 + 25, startY + 12);
        doc.rect(doc.page.width / 2 + 25, startY + 28, 30, 2).fill(accentColor);
        doc.fillColor(textColor).fontSize(10).font('Helvetica').text(`Ref ID: `, doc.page.width / 2 + 25, startY + 38, { continued: true }).font('Helvetica-Bold').text(order.id);
        doc.font('Helvetica').text(`Advisor: `, doc.page.width / 2 + 25, startY + 53, { continued: true }).font('Helvetica-Bold').text(order.assignedAdvisor || 'Staff Advisor');

        // Service Details Block
        const orderY = startY + 100;
        doc.roundedRect(50, orderY, doc.page.width - 100, 50, 8).fillAndStroke(lightBg, borderColor);
        doc.fillColor(secondaryColor).fontSize(11).font('Helvetica-Bold').text('Service Scope:', 65, orderY + 20, { continued: true })
           .fillColor(textColor).text(`  ${order.serviceName}`);
        
        doc.fillColor(accentColor).fontSize(12).font('Helvetica-Bold').text(`Advisory Fee: $${order.finalAmount.toFixed(2)} USD`, doc.page.width - 250, orderY + 19, { align: 'right' });

        // ==========================================
        // 4. Stylized Inclusions Section
        // ==========================================
        const contentY = orderY + 75;
        doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('ADVISORY DELIVERABLES & RESEARCH', 50, contentY);
        doc.rect(50, contentY + 18, 50, 3).fill(accentColor);
        doc.moveDown(1.5);
        
        const lines = delivery.inclusions.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) {
            doc.moveDown(0.5);
            continue;
          }
          
          if (doc.y > doc.page.height - 150) {
             doc.addPage();
          }

          // Section Header (starts with number or is ALL CAPS)
          if (/^[0-9]+\.\s/.test(trimmed) || (trimmed === trimmed.toUpperCase() && trimmed.length > 5)) {
            doc.moveDown(0.5);
            doc.rect(50, doc.y + 2, 4, 12).fill(accentColor);
            doc.fillColor(secondaryColor).fontSize(11).font('Helvetica-Bold').text(trimmed, 60, doc.y);
            doc.moveDown(0.2);
          } else {
            // Indented body text
            doc.fillColor(textColor).fontSize(10).font('Helvetica').text(trimmed, 60, doc.y, {
              lineGap: 4,
              align: 'justify',
              width: doc.page.width - 110
            });
            doc.moveDown(0.2);
          }
        }

        doc.moveDown(2);
        
        // ==========================================
        // 5. Terms Section
        // ==========================================
        if (doc.y > doc.page.height - 200) {
           doc.addPage();
        }
        doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('MERCHANT TERMS & DISCLOSURES', 50, doc.y);
        doc.rect(50, doc.y + 2, 30, 2).fill(accentColor);
        doc.moveDown(0.8);
        doc.fillColor('#64748b').fontSize(8.5).font('Helvetica').text(delivery.terms, 50, doc.y, {
          lineGap: 3.5,
          align: 'justify',
        });

        // ==========================================
        // 6. Corporate Footer (applied to all pages EXCEPT COVER)
        // ==========================================
        const range = doc.bufferedPageRange();
        for (let i = range.start + 1; i < range.start + range.count; i++) {
          doc.switchToPage(i);
          const footerY = doc.page.height - 60;
          doc.rect(0, footerY, doc.page.width, 60).fill(primaryColor);
          doc.fillColor('#94a3b8').fontSize(7.5).font('Helvetica')
            .text('Your Flights LLC | Legal Entity: 30 N Gould St, Ste R, Sheridan, WY 82801 | Ops: E-1/149 Jaitpur Extn Part-1, Badarpur, Delhi INDIA', 50, footerY + 18, { align: 'center' })
            .text('Support: support@yourflightsllc.com | +1-810-505-5186 | Statement Descriptor: YOUR FLIGHTS ADVISORY', 50, footerY + 30, { align: 'center' });
          
          doc.fillColor('#cbd5e1').fontSize(8).text(`Page ${i} of ${range.count - 1}`, 50, footerY + 42, { align: 'center' });
          
          // Add Watermark to content pages
          doc.save();
          doc.translate(doc.page.width / 2, doc.page.height / 2);
          doc.rotate(-45);
          doc.fillColor('#cbd5e1').fillOpacity(0.08).fontSize(80).font('Helvetica-Bold')
             .text('CONFIDENTIAL', -400, -40, { align: 'center', width: 800 });
          doc.restore();
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  public static getSignedAcknowledgementUrl(orderId: string, deliveryId: string): string {
    const token = generateSignedAcknowledgementToken(orderId, deliveryId);
    return `${APP_URL}/?page=acknowledge&token=${encodeURIComponent(token)}`;
  }
}
