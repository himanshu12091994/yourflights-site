import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { createMailServiciosr } from '../mail/transporter';
import { SMTP, APP_URL } from '../config';
import { updateDeliverable } from '../store/deliverables';

export const contractingRouter = Router();

contractingRouter.post('/api/admin/send-contracting-details', async (req, res) => {
  const authHeader = req.headers.authorization;
  const authQuery = req.query.token as string;

  // Simple auth check similar to dashboard
  if (!authHeader && !authQuery) {
    return res.status(401).json({ error: 'Unauthorized admin request' });
  }

  try {
    const { deliverableId, clientEmail, clientName, serviceName, amount, inclusions, terms } = req.body;

    if (!deliverableId || !clientEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Generate PDF in memory
    const generatePDF = (): Promise<Buffer> => {
      return new Promise((resolve, reject) => {
        try {
          const doc = new PDFDocument({ margin: 50, size: 'A4' });
          const buffers: Buffer[] = [];
          
          doc.on('data', buffers.push.bind(buffers));
          doc.on('end', () => resolve(Buffer.concat(buffers)));

          // --- Colors ---
          const primaryColor = '#1e3a8a'; // blue-900
          const secondaryColor = '#059669'; // emerald-600
          const textColor = '#334155'; // slate-700
          const lightBg = '#f8fafc'; // slate-50
          
          // --- Header ---
          doc.rect(0, 0, doc.page.width, 120).fill(primaryColor);
          doc.fillColor('#ffffff').fontSize(28).font('Helvetica-Bold').text('YOUR FLIGHTS LLC', 50, 40);
          doc.fontSize(12).font('Helvetica').text('Consulting Strategy & Advisory Concierge', 50, 75);
          doc.fontSize(10).text('MCC 8999 / 8999', doc.page.width - 150, 45, { align: 'right' });
          doc.text(`Reference ID: ${deliverableId}`, doc.page.width - 250, 60, { align: 'right' });
          doc.text(`Date: ${new Date().toLocaleDateString()}`, doc.page.width - 150, 75, { align: 'right' });
          
          doc.moveDown(4);

          // --- Client Info Box ---
          const startY = 140;
          doc.rect(50, startY, doc.page.width - 100, 70).fillAndStroke(lightBg, '#e2e8f0');
          doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('CLIENT INFORMATION', 70, startY + 15);
          doc.fillColor(textColor).fontSize(11).font('Helvetica').text(`Name: ${clientName || 'Valued Client'}`, 70, startY + 35);
          doc.text(`Email: ${clientEmail}`, 70, startY + 50);
          
          doc.moveDown(3);

          // --- Order Details Box ---
          const orderY = doc.y;
          doc.rect(50, orderY, doc.page.width - 100, 60).fillAndStroke(lightBg, '#e2e8f0');
          doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('SERVICE DETAILS', 70, orderY + 15);
          doc.fillColor(textColor).fontSize(11).font('Helvetica-Bold').text(`Service: ${serviceName}`, 70, orderY + 35);
          doc.fillColor(secondaryColor).fontSize(12).text(`Total Amount Due: $${amount.toFixed(2)} USD`, doc.page.width - 300, orderY + 35, { align: 'right' });

          doc.moveDown(4);

          // --- Inclusions ---
          doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('PACKAGE INCLUSIONS & RESEARCH DETAILS', 50, doc.y);
          doc.moveDown(0.5);
          doc.fillColor(textColor).fontSize(10).font('Helvetica').text(inclusions || 'Standard consulting advisory services.', {
            lineGap: 4,
            align: 'justify'
          });
          
          doc.moveDown(2);

          // --- Terms ---
          doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('MERCHANT TERMS & DISCLOSURES', 50, doc.y);
          doc.moveDown(0.5);
          doc.fillColor('#64748b').fontSize(9).font('Helvetica').text(terms || 'By acknowledging this document, you agree to the terms of service. Your Flights LLC acts solely as an independent consulting advisor and does not issue licenses.', {
            lineGap: 3,
            align: 'justify'
          });

          // --- Footer ---
          const footerY = doc.page.height - 80;
          doc.rect(0, footerY, doc.page.width, 80).fill('#0f172a');
          doc.fillColor('#94a3b8').fontSize(9).font('Helvetica')
             .text('Your Flights LLC | Legal Entity: 30 N Gould St, Ste R, Sheridan, WY 82801 | Ops: E-1/149 Jaitpur Extn Part-1, Badarpur, Delhi 110044 INDIA', 50, footerY + 25, { align: 'center' })
             .text('Support: support@yourflightsllc.com | +1-810-505-5186', 50, footerY + 40, { align: 'center' });

          doc.end();
        } catch (err) {
          reject(err);
        }
      });
    };

    const pdfBuffer = await generatePDF();

    // 2. Send Email with PDF Attachment and Acknowledgement Link
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
            <p style="font-size: 16px; color: #334155; margin-top: 0;">Dear <strong>${clientName || 'Client'}</strong>,</p>
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
              Your Flights LLC &copy; ${new Date().getFullYear()} All Rights Reserved.<br>
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
          contentType: 'application/pdf'
        }
      ]
    });

    updateDeliverable(deliverableId, { sentEmailHtml: htmlContent });

    res.json({ success: true, message: 'Contracting details PDF generated and sent successfully.' });

  } catch (error: any) {
    console.error('Error sending contracting details:', error);
    res.status(500).json({ error: error.message || 'Failed to generate PDF and send email.' });
  }
});

import { addAuditRecord } from '../store/auditLogs';

// New endpoint for Client Acknowledgment
contractingRouter.post('/api/client/acknowledge', async (req, res) => {
  try {
    const { deliverableId, clientName, clientEmail, serviceName, amount, isTestMode } = req.body;
    
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    let location = 'Unknown';

    // Query external geo-ip service asynchronously
    if (clientIp && clientIp !== 'unknown' && clientIp !== '::1' && clientIp !== '127.0.0.1') {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${clientIp}`);
        const geoData = await geoRes.json();
        if (geoData && geoData.status === 'success') {
          location = `${geoData.city}, ${geoData.regionName}, ${geoData.country}`;
        }
      } catch (e) {
        console.warn('GeoIP lookup failed for IP:', clientIp);
      }
    }

    addAuditRecord({
      id: `ACK-${Date.now()}`,
      timestamp: new Date().toISOString(),
      clientIp,
      userAgent,
      location,
      clientName: clientName || 'Unknown',
      clientEmail: clientEmail || 'Unknown',
      deliverableId,
      mccAgreement: 'ACCEPTED',
      disclosureText: `Client acknowledged receipt of deliverables and merchant terms via email link.`,
      serviceName: serviceName || 'Advisory Service',
      amount: amount || 0,
      currency: 'usd',
      isTestMode: isTestMode || false
    });

    if (deliverableId) {
      updateDeliverable(deliverableId, {
        isAcknowledged: true,
        acknowledgmentData: {
          ip: clientIp,
          userAgent,
          location,
          timestamp: new Date().toISOString()
        }
      });
    }

    res.json({ success: true, message: 'Acknowledgment recorded securely.' });
  } catch (error: any) {
    console.error('Acknowledgment Error:', error);
    res.status(500).json({ error: 'Failed to record acknowledgment.' });
  }
});

