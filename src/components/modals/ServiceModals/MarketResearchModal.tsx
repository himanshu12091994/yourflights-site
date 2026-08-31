// ─────────────────────────────────────────────────────────────
// Market Research & Intelligence Report (₹6,000 INR ($75.00 USD)) Detail Modal
// ─────────────────────────────────────────────────────────────
import React from 'react';
import { X, Info, CheckCircle2 } from 'lucide-react';
import { LegalModalType } from '../../../types';
import { translations } from '../../../translations';
import { SERVICES } from '../../../config/constants';

interface MarketResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (serviceName: string) => void;
  onOpenLegalModal: (modal: LegalModalType) => void;
  t: typeof translations['en'];
}

export const MarketResearchModal: React.FC<MarketResearchModalProps> = ({
  isOpen,
  onClose,
  onCheckout,
  onOpenLegalModal,
  t,
}) => {
  if (!isOpen) return null;

  const data = t.modals.marketResearchDetail;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 p-6 md:p-8 relative my-8 text-left">
        <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                Location Intelligence
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Verified Advisory Service
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{data.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label={t.modals.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start space-x-2.5 mb-5">
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{t.modals.mccDisclaimer}</p>
        </div>

        <p className="text-sm text-slate-600 mb-6">{data.subtitle}</p>

        {/* Highlights Grid */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            {data.highlightsTitle}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.highlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl"
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <h5 className="text-xs font-bold text-slate-900">
                    {item.title}
                  </h5>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Disclaimer */}
        <p className="text-[11px] text-slate-500 mb-4 bg-slate-50 border border-slate-200/60 p-2.5 rounded-lg">
          * Note: The ₹6,000 INR ($75.00 USD) consulting research and intelligence service fee is
          non-refundable once research services have been rendered.
        </p>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-2xl font-bold text-slate-900">₹6,000 INR ($75.00 USD)</span>
            <span className="text-xs text-slate-500 ml-1">/ research report</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-medium text-sm transition-colors cursor-pointer"
            >
              {t.modals.close}
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onCheckout(SERVICES.RESEARCH.SERVICE_KEY);
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm cursor-pointer"
            >
              {data.btn}
            </button>
          </div>
        </div>

        {/* Legal Links (Bottom) */}
        <div className="py-2.5 bg-slate-100/50 border-t border-slate-200 mt-6 rounded-b-xl">
          <div className="flex flex-wrap gap-2 justify-center">
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors text-xs text-slate-500 font-medium">Terms</a>
            <span className="text-slate-300">•</span>
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors text-xs text-slate-500 font-medium">Privacy</a>
            <span className="text-slate-300">•</span>
            <a href="/refund-policy" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors text-xs text-slate-500 font-medium">Refund</a>
            <span className="text-slate-300">•</span>
            <a href="/compliance" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors text-xs text-slate-500 font-medium">Compliance</a>
          </div>
        </div>
      </div>
    </div>
  );
};
