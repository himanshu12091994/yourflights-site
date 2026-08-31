// ─────────────────────────────────────────────────────────────
// YOUR FLIGHTS LLC — Client Deliverable & Terms Acknowledgment Page
// Securely verified identifiers with transparent non-repudiation logging.
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  FileText,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Clock,
  Building,
  Check,
  Lock,
} from 'lucide-react';

interface AcknowledgePageProps {
  onNavigate: (page: any) => void;
}

export const AcknowledgePage: React.FC<AcknowledgePageProps> = ({ onNavigate }) => {
  const [token, setToken] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  const [isLoadingVerification, setIsLoadingVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyAcknowledged, setAlreadyAcknowledged] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const idParam = params.get('id') || params.get('orderId');

    if (tokenParam) {
      setToken(tokenParam);
      verifyToken(tokenParam);
    } else if (idParam) {
      setOrderId(idParam);
    } else {
      setError('No valid contracting or deliverable reference found in link parameters.');
    }
  }, []);

  const verifyToken = async (tok: string) => {
    setIsLoadingVerification(true);
    try {
      const res = await fetch(`/api/client/ack-verify/${encodeURIComponent(tok)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setOrderDetails(data.order);
        setOrderId(data.order?.id);
        if (data.alreadyAcknowledged) {
          setAlreadyAcknowledged(true);
        }
      } else {
        setError(data.error || 'The acknowledgment link is invalid or has expired.');
      }
    } catch {
      setError('Failed to verify acknowledgment security signature.');
    } finally {
      setIsLoadingVerification(false);
    }
  };

  const handleAcknowledge = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: any = {
        browser: navigator.userAgent,
        os: navigator.platform,
        deviceType: window.innerWidth < 768 ? 'Mobile Device' : 'Desktop Browser',
      };

      if (token) {
        payload.token = token;
      } else if (orderId) {
        payload.orderId = orderId;
      }

      const response = await fetch('/api/client/acknowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        setError(data.error || 'Failed to record acknowledgment. Please contact support.');
      }
    } catch {
      setError('A network error occurred while transmitting your acknowledgment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingVerification) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 p-6">
        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-700">Verifying Security Signature & Deliverables...</p>
      </div>
    );
  }

  if (isSuccess || alreadyAcknowledged) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {alreadyAcknowledged ? 'Deliverable Already Acknowledged' : 'Acknowledgment Confirmed'}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Thank you! Your official receipt and terms acknowledgment for{' '}
            <strong className="text-slate-900">{orderId || 'your order'}</strong> has been securely logged.
          </p>

          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-[11px] text-slate-600 font-mono text-left space-y-1">
            <p className="font-bold text-slate-800">Forensic Proof Status: VERIFIED & SEALED</p>
            <p>Statement Descriptor: YOUR FLIGHTS ADVISORY</p>
            <p>Timestamp: {new Date().toISOString()}</p>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Return to Homepage</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 p-8 text-center border-b border-slate-800">
          <div className="mx-auto w-14 h-14 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Action Required: Acknowledge Terms</h2>
          <p className="text-slate-400 text-xs mt-1">
            Order Reference: <strong className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">{orderId || 'UNKNOWN'}</strong>
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-start gap-3 text-xs">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
              <div>
                <strong className="block font-bold">Verification Notice</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {orderDetails && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Client Name:</span>
                <span className="font-extrabold text-slate-900">{orderDetails.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Service Package:</span>
                <span className="font-extrabold text-slate-900">{orderDetails.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Advisory Fee:</span>
                <span className="font-extrabold font-mono text-emerald-600">${orderDetails.finalAmount.toFixed(2)} USD</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Merchant Disclosures & Consent
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              By confirming below, you acknowledge receipt of your digital consulting advisory deliverables and agree to the following terms:
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Independent Consulting Advisory Service:</strong> Your Flights LLC provides custom routing, research, and advisory strategies. We are not a licenseing agency and do not issue consulting services.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Non-Refundable Deliverables:</strong> All advisory fees are for professional research time rendered and are non-refundable once deliverables are transmitted.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleAcknowledge}
              disabled={isSubmitting || (!orderId && !token)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold py-4 px-6 rounded-2xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Recording Official Acknowledgment...</span>
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  <span>I Acknowledge & Agree</span>
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-slate-400 mt-3 flex items-center justify-center gap-1 font-mono">
              <Lock className="h-3 w-3" />
              <span>Timestamp & IP logged securely for MCC dispute defense</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
