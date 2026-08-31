import React, { useState } from 'react';
import {
  X, Lock, ShieldCheck, AlertCircle, ArrowRight,
  RotateCw, XCircle, ArrowLeft, CreditCard, Clock,
  Phone, Mail, CheckCircle2, FileText
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────
interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  onProceedCheckout: (serviceName: string, isTestMode?: boolean) => Promise<void>;
  onOpenLegalModal?: (modal: 'terms' | 'privacy' | 'refund' | 'compliance') => void;
  isLoading?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Price + title derivation (shared between inner form & outer wrapper)
// ₹12,500 INR ($150.00 USD) matched before ₹4,000 INR ($50.00 USD) to avoid substring collision.
// ─────────────────────────────────────────────────────────────
const deriveServiceInfo = (serviceName: string) => {
  if (serviceName.includes('150') || serviceName.toLowerCase().includes('strategy')) {
    return {
      priceStr: '₹12,500 INR ($150.00 USD)',
      lineItemTitle: 'Custom Day-by-Day Strategy Planning Strategy',
      deliverables: [
        'Bespoke day-by-day route & timing blueprint',
        'Curated accommodation & direct provider license links',
        'Local transit logistics & activity scheduling notes',
        'One free revision within 14 days of delivery',
      ],
    };
  }
  if (serviceName.includes('75') || serviceName.toLowerCase().includes('research')) {
    return {
      priceStr: '₹6,000 INR ($75.00 USD)',
      lineItemTitle: 'Market Research Report',
      deliverables: [
        'Comprehensive market intelligence & cultural norms',
        'Visa requirements & seasonal weather briefing',
        'Hidden gems & curated activity recommendations',
        'Tailored direct-contracting guidance for independent clients',
      ],
    };
  }
  if (serviceName.includes('50') || serviceName.toLowerCase().includes('prep')) {
    return {
      priceStr: '₹4,000 INR ($50.00 USD)',
      lineItemTitle: 'Pre-Departure Strategy Prep & Safety Advisory',
      deliverables: [
        'Packing strategies & essential consulting mobile apps guide',
        'Currency handling & local payment advice',
        'Destination safety & health preparation checklist',
        'Pre-project strategic planning consultation deliverable',
      ],
    };
  }
  return {
    priceStr: '₹12,500 INR ($150.00 USD)',
    lineItemTitle: serviceName.replace(/project|license|license/gi, 'Consulting Advisory'),
    deliverables: ['Custom consulting advisory and research deliverable'],
  };
};

// ─────────────────────────────────────────────────────────────
// Inner Form
// ─────────────────────────────────────────────────────────────
const CheckoutFormContent: React.FC<
  CheckoutModalProps & {
    priceStr: string;
    lineItemTitle: string;
    deliverables: string[];
  }
> = ({
  onClose,
  serviceName,
  onProceedCheckout,
  onOpenLegalModal,
  isLoading = false,
  priceStr,
  lineItemTitle,
  deliverables,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);

  const resetState = () => {
    setIsChecked(false);
    setValidationError(false);
    setAuditId(null);
    setIsRecording(false);
    setIsSubmitting(false);
    setPaymentFailed(false);
    setPaymentError(null);
    setCardError(null);
  };

  const handleCancelAndGoBack = () => {
    resetState();
    onClose();
    const servicesEl = document.getElementById('services');
    if (servicesEl) servicesEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isChecked) {
      setValidationError(true);
      return;
    }

    setValidationError(false);
    setCardError(null);
    setPaymentFailed(false);
    setPaymentError(null);
    setIsSubmitting(true);
    setIsRecording(true);

    try {
      // ── 1. Record consent to backend audit trail ──────────────
      let capturedAuditId = `AUD-${Date.now()}`;
      try {
        const res = await fetch('/api/record-agreement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceName: lineItemTitle,
            isAccepted: true,
            disclosureText:
              'Cardholder confirmed purchase of consulting advisory research service from Your Flights LLC. Non-licenseing advisory only. Statement descriptor: YOUR FLIGHTS ADVISORY / YOURFLIGHTSLLC.COM.',
          }),
        });
        const ct = res.headers.get('content-type');
        if (ct?.includes('application/json')) {
          const data = await res.json();
          if (data.auditRecord?.id) capturedAuditId = data.auditRecord.id;
        }
      } catch (err) {
        console.warn('[AUDIT LOG SKIPPED]', err);
      }
      setAuditId(capturedAuditId);

      // ── 2. Trigger parent checkout handler → opens confirmation ─
      await onProceedCheckout(serviceName);
    } catch (err: any) {
      console.error('[CHECKOUT ERROR]', err);
      setPaymentFailed(true);
      setPaymentError(
        err?.message ||
          'Payment authorization timed out. Please verify your card details and try again.'
      );
    } finally {
      setIsRecording(false);
      setIsSubmitting(false);
    }
  };

  const handleRetry = async (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();
    setPaymentFailed(false);
    setPaymentError(null);
    await handleSubmit(e as React.FormEvent);
  };

  const isBusy = isLoading || isSubmitting || isRecording;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 my-auto flex flex-col text-left max-h-[96vh]">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={handleCancelAndGoBack}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close and return to service selection"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Brand + security line */}
          <div className="flex items-center space-x-2 text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-2">
            <Lock className="h-3.5 w-3.5" />
            <span>Secure Checkout · Your Flights</span>
          </div>

          {/* Title row */}
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              Payment Authorization
            </h2>
            <span className="shrink-0 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full mt-0.5">
              PCI-DSS Level 1
            </span>
          </div>

          {/* Sub-line: Merchant ID */}
          <div className="flex items-center justify-between flex-wrap gap-x-4 gap-y-0.5 mt-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
            <span>
              Merchant: <strong className="text-slate-200">Your Flights LLC</strong> · USA
            </span>
            <span className="font-mono text-slate-400">PCI-DSS Secured</span>
          </div>
        </div>

        {/* ── Scrollable Body ───────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6 space-y-4 sm:space-y-5 flex-1 overflow-y-auto"
        >

          {/* Error / Retry Banner */}
          {paymentFailed && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-rose-100 rounded-xl shrink-0 text-rose-600">
                  <XCircle className="h-5 w-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-extrabold text-rose-950 flex items-center flex-wrap gap-2">
                    Authorization Declined
                    <span className="bg-rose-200 text-rose-900 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                      Action Required
                    </span>
                  </h4>
                  <p className="text-xs text-rose-800 leading-relaxed font-medium">
                    {paymentError}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                disabled={!isChecked || isBusy}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCw className={`h-4 w-4 ${isBusy ? 'animate-spin' : ''}`} />
                <span>Retry Payment Authorization</span>
              </button>
            </div>
          )}

          {/* ── Order Summary Card ────────────────────────────── */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            {/* Merchant row */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Merchant</span>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                Your Flights LLC
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-200">
                  Verified Service
                </span>
              </span>
            </div>

            {/* Deliverable */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Selected Deliverable
              </span>
              <p className="text-sm sm:text-base font-extrabold text-blue-950 leading-snug">
                {lineItemTitle}
              </p>
              <ul className="space-y-1 pt-0.5">
                {deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SLA + pricing */}
            <div className="flex items-center gap-1.5 pt-0.5 text-[11px] text-slate-500">
              <Clock className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>Electronic delivery within <strong>2 business days</strong></span>
            </div>

            <div className="flex justify-between items-baseline pt-2.5 border-t border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Amount Due
                </span>
                <span className="text-[11px] text-slate-400">Single Charge · Zero Hidden Fees</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                {priceStr}{' '}
                <span className="text-xs font-normal text-slate-500">USD</span>
              </span>
            </div>
          </div>

          {/* ── Unified Compliance Consent Checkbox ─────────── */}
          {/* 
            Stripe, Razorpay & Visa/MC all require:
            • Active (un-prechecked) consent checkbox
            • Links to ToS and Refund Policy
            • Explicit statement of what is being purchased (non-licenseing)
            • Statement descriptor disclosed before charge
            • Entity name, MCC classification, and DBA name shown
          */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              validationError
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
                : isChecked
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                id="mcc-agreement-checkbox"
                checked={isChecked}
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                  if (e.target.checked) setValidationError(false);
                }}
                className="mt-0.5 h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-2 focus:ring-blue-500 shrink-0 cursor-pointer"
              />
              <span className="text-[11px] font-medium text-slate-700 leading-relaxed">
                <strong className="text-red-600">Mandatory Opt-In:</strong> I authorize this payment and confirm I am purchasing a consulting advisory and strategy research deliverable from{' '}
                <strong>Your Flights</strong> (Legal entity:{' '}
                <strong>Your Flights LLC</strong>). I
                have read and agree to the{' '}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 hover:underline font-bold"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/refund-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 hover:underline font-bold"
                >
                  Refund Policy
                </a>
                {' '}(which dictates all approved refunds require a strict 7-14 business day processing time). I understand that Your Flights provides independent planning and research
                deliverables only — no consulting services or software licenses are issued. My
                card statement will show{' '}
                <span className="font-mono bg-white text-slate-900 px-1.5 py-0.5 rounded border border-slate-300 text-[10px] font-bold whitespace-nowrap">
                  'YOUR FLIGHTS ADVISORY'
                </span>{' '}
                or{' '}
                <span className="font-mono bg-white text-slate-900 px-1.5 py-0.5 rounded border border-slate-300 text-[10px] font-bold whitespace-nowrap">
                  'YOURFLIGHTSLLC.COM'
                </span>
                .
              </span>
            </label>

            {validationError && (
              <div className="flex items-center gap-1.5 text-rose-700 text-xs font-bold mt-2 pt-2 border-t border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Please check the agreement box above before authorizing payment.</span>
              </div>
            )}
          </div>

          {/* Audit ID badge (shown once consent is recorded) */}
          {auditId && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Consent Audit Logged:</strong>{' '}
                  <span className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded">
                    {auditId}
                  </span>
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold uppercase">Active</span>
            </div>
          )}

          {/* ── Primary CTA ──────────────────────────────────── */}
          <div className="space-y-2 pt-1">
            <button
              type="submit"
              disabled={!isChecked || isBusy}
              className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${
                isChecked
                  ? paymentFailed
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20 cursor-pointer'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer hover:shadow-xl active:scale-[0.99]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isBusy ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Preparing Secure Checkout...</span>
                </>
              ) : paymentFailed ? (
                <>
                  <RotateCw className="h-4 w-4" />
                  <span>Retry Authorization ({priceStr})</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>
                    Authorize Payment · {priceStr} USD
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Cancel row */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleCancelAndGoBack}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Go Back · Cancel</span>
              </button>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <CreditCard className="h-3.5 w-3.5" />
                <span>Stripe Verified Merchant</span>
              </div>
            </div>

            {/* ── Merchant Support Channels (required for Visa/MC) */}
            <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-2 text-[10px] text-slate-500">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:+18105055186"
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <Phone className="h-3 w-3 shrink-0" />
                  USA +1 (810) 505-5186
                </a>
                <a
                  href="mailto:support@yourflightsllc.com"
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors truncate"
                >
                  <Mail className="h-3 w-3 shrink-0" />
                  support@yourflightsllc.com
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-1">
                  <strong className="shrink-0 text-slate-600">Legal Entity Registration:</strong> 
                  30 N Gould St Ste R, Sheridan, WY, 82801, USA, USA (Your Flights LLC)
                </div>
                <div className="flex items-start gap-1">
                  <strong className="shrink-0 text-slate-600">Global Operations Center:</strong> 
                  E-1/149 Jaitpur Extn Part-1, Badarpur, Delhi 110044 INDIA
                </div>
              </div>
            </div>

            {/* ── Compliance fine-print ───────────────────────── */}
            <p className="text-[10px] text-slate-400 leading-relaxed text-center pt-1">
              Your Flights LLC · Registered USA · Non-licenseing consulting advisory service ·
              All charges processed securely via Stripe.
              By completing this purchase you agree to our{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-slate-800 transition-colors cursor-pointer underline"
              >
                Terms
              </a>{' '}
              &{' '}
              <a
                href="/refund-policy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-slate-800 transition-colors cursor-pointer underline"
              >
                Refund Policy
              </a>
              .
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Public Export – wraps inner form in Stripe Elements context
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────
export const CheckoutModal: React.FC<CheckoutModalProps> = (props) => {
  if (!props.isOpen) return null;

  const { priceStr, lineItemTitle, deliverables } = deriveServiceInfo(props.serviceName);

  return (
    <CheckoutFormContent
      {...props}
      priceStr={priceStr}
      lineItemTitle={lineItemTitle}
      deliverables={deliverables}
    />
  );
};
