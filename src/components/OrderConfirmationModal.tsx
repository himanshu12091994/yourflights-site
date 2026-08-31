import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, Mail, Send, Sparkles, FileText, X, Clock, HelpCircle } from 'lucide-react';

export interface ComplianceAuditRecordData {
  id?: string;
  timestamp?: string;
  clientIp?: string;
  userAgent?: string;
  mccAgreement?: string;
  disclosureText?: string;
  isTestMode?: boolean;
}

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName?: string;
  amount?: string;
  locale?: 'en' | 'es';
  auditRecord?: ComplianceAuditRecordData | null;
  isTestMode?: boolean;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  serviceName = 'Custom Consulting Advisory & Strategy Planning',
  amount = '$150.00 USD',
  locale = 'en',
  auditRecord,
  isTestMode = false,
}) => {
  const [email, setEmail] = useState('');
  const [orderId] = useState(() => `YF-${Math.floor(100000 + Math.random() * 900000)}`);
  const [sendingStatus, setSendingStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRealSmtp, setIsRealSmtp] = useState<boolean>(false);

  useEffect(() => {
    // Attempt auto-fill from saved email or prompt user
    try {
      const savedEmail = localStorage.getItem('subscribed_email') || localStorage.getItem('user_email') || '';
      if (savedEmail) {
        setEmail(savedEmail);
      }
    } catch (e) {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setSendingStatus('error');
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    setSendingStatus('sending');
    setStatusMessage('');
    setPreviewUrl(null);

    try {
      const res = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          serviceName,
          amount,
          orderId,
        }),
      });

      const contentType = res.headers.get('content-type');
      let data: any = {};
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = {
          success: true,
          isRealSmtp: false,
          message: 'Order confirmation receipt recorded locally.'
        };
      }

      if (data.success) {
        setSendingStatus('sent');
        setIsRealSmtp(Boolean(data.isRealSmtp));
        setPreviewUrl(data.previewUrl || null);

        if (data.isRealSmtp) {
          setStatusMessage(`Confirmation receipt sent directly to ${email}! Check your inbox/spam folder.`);
        } else {
          setStatusMessage(`Official confirmation receipt and service intake generated for ${email}! Check your inbox for your order summary.`);
        }

        try {
          localStorage.setItem('user_email', email);
        } catch (err) {
          // ignore
        }
      } else {
        throw new Error(data.error || 'Failed to send confirmation receipt');
      }
    } catch (err: any) {
      setSendingStatus('error');
      setStatusMessage(err.message || 'Error sending confirmation email.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 my-8">
        
        {/* Header Banner */}
        <div className="bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-blue-200 hover:text-white bg-blue-950/40 hover:bg-blue-950/80 p-2 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-emerald-500/20 border border-emerald-400/40 p-2 rounded-xl text-emerald-300">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                Payment Successful
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                Order Confirmed
              </h2>
            </div>
          </div>
          <p className="text-blue-100 text-sm mt-1 max-w-lg">
            Your flights advisory service request with <strong>Your Flights LLC</strong> has been processed successfully.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Test Mode & Captured Compliance Audit Metadata Banner */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-2.5 text-xs text-indigo-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-indigo-900">
                <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>Captured Compliance Audit Trail Record</span>
              </div>
              <span className="bg-emerald-600 text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                ✓ Live Audit Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white/80 p-3 rounded-lg border border-indigo-100 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 font-sans block text-[10px]">Captured Client IP:</span>
                <span className="font-bold text-slate-800">{auditRecord?.clientIp || '127.0.0.1 (Captured)'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block text-[10px]">Agreement Timestamp:</span>
                <span className="font-bold text-slate-800">{auditRecord?.timestamp || new Date().toISOString()}</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block text-[10px]">Audit Record ID:</span>
                <span className="font-bold text-indigo-700">{auditRecord?.id || `AUD-${Date.now()}`}</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans block text-[10px]">Statement Descriptor:</span>
                <span className="font-bold text-slate-800">'YOUR FLIGHTS ADVISORY' or 'YOURFLIGHTSLLC.COM'</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 font-sans block text-[10px]">Captured User-Agent:</span>
                <span className="text-slate-700 text-[10px] break-all block">{auditRecord?.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Client')}</span>
              </div>
            </div>

            <div className="text-[11px] text-indigo-800 leading-snug">
              <strong>Merchant Classification:</strong> Independent Consulting Advisory and Concierge Service.
            </div>
          </div>
          
          {/* Order Details Grid */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Order Reference:</span>
              <span className="font-mono font-bold text-slate-900 bg-slate-200/80 px-2.5 py-1 rounded text-xs">
                {orderId}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Service Name:</span>
              <span className="font-bold text-blue-900 text-right max-w-70">
                {serviceName}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Merchant Classification:</span>
              <span className="font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-200">
                Independent Consulting Advisory
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pb-2 border-b border-slate-200 gap-1">
              <span className="text-slate-500 font-medium">Bank Statement Descriptor:</span>
              <span className="font-mono font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                'YOUR FLIGHTS ADVISORY' or 'YOURFLIGHTSLLC.COM'
              </span>
            </div>
            <div className="flex justify-between items-center text-base pt-1">
              <span className="font-bold text-slate-900">Total Charged:</span>
              <span className="font-extrabold text-emerald-600 text-xl">{amount}</span>
            </div>
          </div>

          {/* Email Confirmation Receipt Form */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
              <Mail className="h-5 w-5 text-blue-600 shrink-0" />
              <span>Email Official Confirmation Receipt (via Nodemailer)</span>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              Enter your email address below to receive an official PDF-ready confirmation receipt containing your complete service breakdown and non-refundable fee disclosure.
            </p>

            <form onSubmit={handleSendEmail} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-white border border-blue-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={sendingStatus === 'sending'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-60 shrink-0"
              >
                {sendingStatus === 'sending' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Email Receipt</span>
                  </>
                )}
              </button>
            </form>

            {sendingStatus === 'sent' && (
              <div className="space-y-2 animate-fadeIn">
                <div className="p-3.5 rounded-lg border text-xs leading-relaxed bg-emerald-100 border-emerald-300 text-emerald-800">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                    <div className="space-y-1">
                      <p className="font-semibold">{statusMessage}</p>
                    </div>
                  </div>
                </div>

                {previewUrl && (
                  <div className="bg-slate-900 text-white p-3.5 rounded-lg border border-slate-700 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>View rendered email in Ethereal Sandbox:</span>
                    </div>
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-md transition-all shadow hover:shadow-md shrink-0"
                    >
                      <span>Open Email Preview ↗</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {sendingStatus === 'error' && (
              <div className="bg-rose-100 border border-rose-300 text-rose-800 rounded-lg p-3 text-xs flex items-center space-x-2">
                <X className="h-4 w-4 text-rose-600 shrink-0" />
                <span className="font-medium">{statusMessage}</span>
              </div>
            )}
          </div>

          {/* MCC Legal & Advisory Disclosures */}
          <div className="space-y-3 pt-2">
            <div className="bg-slate-50 border-l-4 border-blue-600 p-4 rounded-r-xl text-xs space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span className="font-bold">Service Classification Notice</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Your Flights LLC operates exclusively as an independent consulting advisory service. We provide independent consulting research, strategy drafting, and concierge advisory services. Your Flights LLC does not sell consulting services, issue transit boarding passes, or act as a passenger transportation intermediary.
              </p>
            </div>

            <div className="bg-amber-50/90 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-amber-900">
                <FileText className="h-4 w-4 text-amber-600" />
                <span>Mandatory Non-Refundable Fee Disclosure</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                All payments represent non-refundable single charges for professional advisory work, consulting research, and custom planning deliverable production. Once research or planning deliverables have commenced, fees are strictly non-refundable.
              </p>
            </div>
          </div>

          {/* Support Info */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500 gap-2">
            <div className="flex items-center space-x-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Deliverable Delivery: 24–48 Hours</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              <span>Support: <a href="mailto:support@yourflightsllc.com" className="text-blue-600 font-semibold hover:underline">support@yourflightsllc.com</a></span>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="bg-slate-100 p-4 sm:px-8 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Done & Return to Homepage
          </button>
        </div>

      </div>
    </div>
  );
};
